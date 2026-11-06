import { evaluate } from '@uk-immigration/engine';
import type {
  ImmigrationEpisode,
  IsoDate,
  Locale,
} from '@uk-immigration/engine';
import { RULE_SET_IDS } from '@uk-immigration/policy-data';
import { balance as b } from './balance';
import { achievements, lifeAchievements } from './achievements';
import { skilledWorker } from './characters/skilled-worker';
import { hongKongBno } from './characters/hong-kong-bno';
import { familyPartner } from './characters/family-partner';
import { commonEvents, systemEvents } from './events/common';
import { extensionFor, locationActions, places } from './locations';
import { npcs, heartEvents, townHeartLetters } from './npcs';
import { items, recipes } from './items';
import {
  festivals,
  festivalFoods,
  festivalActivities,
  notices,
} from './festivals';
import type {
  Condition,
  Effect,
  EndingId,
  GameEvent,
  GameState,
  Activity,
  DayState,
  FestivalId,
  ItemId,
  Npc,
  NpcLocation,
  PlaceId,
  Channel,
  Weather,
  Progress,
  StatKey,
  Text,
} from './types';

export const characters = [skilledWorker, hongKongBno, familyPartner];
const dayMs = 86_400_000;
const addDays = (date: IsoDate, days: number): IsoDate =>
  new Date(Date.parse(date) + days * dayMs).toISOString().slice(0, 10);
function addMonths(date: IsoDate, months: number): IsoDate {
  const [year, month, day] = date.split('-').map(Number);
  const target = new Date(Date.UTC(year, month - 1 + months, 1));
  const last = new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0),
  ).getUTCDate();
  target.setUTCDate(Math.min(day, last));
  return target.toISOString().slice(0, 10);
}
function taxYearOf(date: IsoDate) {
  const year = Number(date.slice(0, 4)) - (date.slice(5) < '04-06' ? 1 : 0);
  return `${year}-${String((year + 1) % 100).padStart(2, '0')}`;
}
function characterOf(id: string) {
  const character = characters.find((c) => c.id === id);
  if (!character) throw new Error(`Unknown character: ${id}`);
  return character;
}
function episodeAt(state: GameState, date = state.date) {
  return state.timeline.episodes
    .filter((e) => e.validFrom <= date && date <= e.validTo)
    .sort((a, c) => c.validFrom.localeCompare(a.validFrom))[0];
}
function pool(state: GameState) {
  return [
    ...commonEvents,
    ...characterOf(state.characterId).events,
    ...systemEvents,
    ...heartEvents,
    ...townHeartLetters,
  ];
}
/** Remaining calendar months rounded down; zero on the last valid day. */
export function visaMonthsLeft(state: GameState): number {
  const episode = episodeAt(state);
  if (!episode) return 0;
  const full =
    (Number(episode.validTo.slice(0, 4)) - Number(state.date.slice(0, 4))) *
      12 +
    Number(episode.validTo.slice(5, 7)) -
    Number(state.date.slice(5, 7));
  const anchor = addMonths(state.date, full);
  return Math.max(
    0,
    Math.floor(
      full + (Date.parse(episode.validTo) - Date.parse(anchor)) / dayMs / 31,
    ),
  );
}
function matches(state: GameState, conditions: Condition[] = []): boolean {
  return conditions.every((c) => {
    if ('stat' in c)
      return (
        (c.min === undefined || state.stats[c.stat] >= c.min) &&
        (c.max === undefined || state.stats[c.stat] <= c.max)
      );
    if ('route' in c) return episodeAt(state)?.route === c.route;
    if ('flag' in c) return state.flags.includes(c.flag);
    if ('visaMonthsLeftMax' in c)
      return visaMonthsLeft(state) <= c.visaMonthsLeftMax;
    if ('dayKind' in c) return state.day.kind === c.dayKind;
    if ('weather' in c) return state.day.weather === c.weather;
    if ('festival' in c) return state.day.festival === c.festival;
    if ('npc' in c)
      return (
        (c.heartsMin === undefined || hearts(state, c.npc) >= c.heartsMin) &&
        (c.heartsMax === undefined || hearts(state, c.npc) <= c.heartsMax)
      );
    if ('item' in c) return (state.inventory[c.item] ?? 0) >= (c.min ?? 1);
    if ('minuteMin' in c || 'minuteMax' in c)
      return (
        (c.minuteMin === undefined || state.day.minute >= c.minuteMin) &&
        (c.minuteMax === undefined || state.day.minute <= c.minuteMax)
      );
    const year = c as { yearMin?: number; yearMax?: number };
    return (
      (year.yearMin === undefined || state.year >= year.yearMin) &&
      (year.yearMax === undefined || state.year <= year.yearMax)
    );
  });
}
function dayCondition(c: Condition) {
  return 'dayKind' in c || 'weather' in c || 'festival' in c;
}
function timeCondition(c: Condition) {
  return 'minuteMin' in c || 'minuteMax' in c;
}
function timeWindow(event: GameEvent, start: number, end: number) {
  for (const c of event.when ?? []) {
    if ('minuteMin' in c) start = Math.max(start, c.minuteMin ?? start);
    if ('minuteMax' in c) end = Math.min(end, c.minuteMax ?? end);
  }
  return { start, end };
}
function available(state: GameState, event: GameEvent, drawing = false) {
  return (
    (!event.season || event.season === state.quarter) &&
    (!event.once || !state.firedEvents.includes(event.id)) &&
    (event.requires ?? []).every((f) => state.flags.includes(f)) &&
    !(event.forbids ?? []).some((f) => state.flags.includes(f)) &&
    matches(
      state,
      event.when?.filter(
        (c) => !drawing || (!dayCondition(c) && !timeCondition(c)),
      ),
    )
  );
}
function random(state: GameState) {
  state.randomState = (state.randomState + 0x6d2b79f5) | 0;
  let value = Math.imul(
    state.randomState ^ (state.randomState >>> 15),
    state.randomState | 1,
  );
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
}
function draw(state: GameState, count: number) {
  // Post this quarter’s notices before checking board-linked card prerequisites.
  const options = notices.filter(
    (notice) => !notice.season || notice.season === state.quarter,
  );
  const noticeCount =
    b.boardCountMin +
    Math.floor(random(state) * (b.boardCountMax - b.boardCountMin + 1));
  for (let i = 0; i < noticeCount; i++) {
    const [notice] = options.splice(
      Math.floor(random(state) * options.length),
      1,
    );
    setFlags(state, [`quarter-board-${notice.id}`]);
  }
  for (let i = 0; i < count; i++) {
    const candidates = [
      ...commonEvents,
      ...characterOf(state.characterId).events,
      ...townHeartLetters,
    ].filter(
      (e) =>
        available(state, e, true) &&
        ![state.pendingEvent, ...state.eventQueue].some((id) =>
          pool(state)
            .find((scheduled) => scheduled.id === id)
            ?.forbids?.some(
              (flag) =>
                flag.startsWith('quarter-') && e.forbids?.includes(flag),
            ),
        ) &&
        !state.eventQueue.includes(e.id) &&
        e.id !== state.pendingEvent,
    );
    if (!candidates.length) break;
    let cursor =
      random(state) * candidates.reduce((sum, e) => sum + e.weight, 0);
    const event =
      candidates.find((e) => (cursor -= e.weight) < 0) ??
      candidates[candidates.length - 1];
    state.eventQueue.push(event.id);
  }
}
function makePending(state: GameState, id: string) {
  const event = pool(state).find((e) => e.id === id);
  if (!event || !available(state, event)) return false;
  state.pendingEvent = id;
  state.firedEvents.push(id);
  return true;
}
function deliver(state: GameState, channel: Channel | 'leftovers') {
  if (state.pendingEvent || isOver(state)) return;
  for (const delivery of [...state.day.deliveries]) {
    if (
      state.trip &&
      delivery.channel !== 'phone' &&
      !delivery.eventId.startsWith('system-')
    )
      continue;
    if (channel !== 'leftovers' && delivery.channel !== channel) continue;
    if (
      channel === 'phone' &&
      (delivery.minute ?? b.phoneStart) > state.day.minute
    )
      continue;
    const event = pool(state).find((e) => e.id === delivery.eventId);
    if (!event) continue;
    if (delivery.channel.startsWith('place:')) {
      const place = delivery.channel.slice(6) as PlaceId;
      if (!isOpen(state, place)) continue;
    }
    if (channel === 'leftovers' && delivery.channel === 'phone')
      state.day.minute = Math.max(
        state.day.minute,
        delivery.minute ?? b.phoneStart,
      );
    // Letters are written for wake-up, even when read later in the day.
    const check =
      delivery.channel === 'letter'
        ? { ...state, day: { ...state.day, minute: b.wakeMinute } }
        : state;
    if (!available(check, event)) continue;
    state.day.deliveries = state.day.deliveries.filter(
      (d) => d.eventId !== delivery.eventId,
    );
    state.pendingEvent = delivery.eventId;
    state.firedEvents.push(delivery.eventId);
    return;
  }
}
function nextEvent(state: GameState) {
  if (state.pendingEvent || isOver(state)) return;
  // eventQueue holds future-day cards and immediate system pressure.
  for (const id of [...state.eventQueue].filter((id) =>
    id.startsWith('system-'),
  )) {
    state.eventQueue.splice(state.eventQueue.indexOf(id), 1);
    if (makePending(state, id)) return;
  }
  deliver(state, 'morning');
  deliver(state, 'phone');
  if (
    state.day.place &&
    (state.day.place !== 'home' || state.day.done.includes('returned-home'))
  )
    deliver(state, `place:${state.day.place}`);
}
function pressure(state: GameState) {
  const queue = (id: string) => {
    if (state.pendingEvent !== id && !state.eventQueue.includes(id))
      state.eventQueue.unshift(id);
  };
  if (state.stats.money >= 0)
    state.flags = state.flags.filter((f) => f !== 'debt-crisis');
  if (state.stats.health === 0) queue('system-hospital');
  if (state.stats.mood === 0) queue('system-homesick');
}
function finish(state: GameState, ending: EndingId) {
  if (state.ending) return;
  state.ending = ending;
  state.day.deliveries = [];
  delete state.trip;
  delete state.pendingEvent;
  state.eventQueue = [];
  const texts: Record<EndingId, Text> = {
    settled: {
      zhCN: '材料递出后，游戏里的定居篇章落了款。',
      en: 'With the papers submitted, your settlement chapter closes in this simulation.',
    },
    left: {
      zhCN: '行李箱合上，小镇留在了车窗后面。',
      en: 'The suitcase closes, and the town slips behind the train window.',
    },
    overstayed: {
      zhCN: '许可过期，原本的日常按下了暂停键。',
      en: 'Permission expires, putting everyday life on pause.',
    },
    criminal: {
      zhCN: '定罪记录让材料转交审查，故事在这里停笔。',
      en: 'A conviction sends the papers for review, and this story stops here.',
    },
    timeout: {
      zhCN: '十年过去，抽屉里的定居材料仍没递出去。',
      en: 'Ten years pass, and the settlement folder is still in the drawer.',
    },
  };
  state.log.push({
    year: state.year,
    quarter: state.quarter,
    kind: 'ending',
    id: ending,
    text: texts[ending],
  });
}
function recalculate(state: GameState) {
  state.result = evaluate({
    simulationDate: state.date,
    timeline: state.timeline,
    locale: state.locale,
  });
  if (state.result.shortCircuit?.reason === 'CRIMINALITY')
    finish(state, 'criminal');
  if (state.result.shortCircuit?.reason === 'IMMIGRATION_BREACH')
    finish(state, 'overstayed');
}
function award(state: GameState, lifeOnly = false) {
  const candidates = lifeOnly
    ? lifeAchievements
    : [...achievements, ...(characterOf(state.characterId).achievements ?? [])];
  for (const a of candidates) {
    if (!state.achievements.includes(a.id) && a.check(state))
      state.achievements.push(a.id);
  }
}
function setFlags(state: GameState, flags: string[] = []) {
  state.flags = [...new Set([...state.flags, ...flags])];
}
function recordLife(state: GameState, id: string, text: Text) {
  state.log.push({
    year: state.year,
    quarter: state.quarter,
    kind: 'action',
    id,
    text,
  });
}
function recordIncome(
  state: GameState,
  date: IsoDate,
  earnings?: number,
  partnerEarnings?: number,
) {
  const taxYear = taxYearOf(date);
  let income = state.timeline.incomeYears.find((y) => y.taxYear === taxYear);
  if (!income) {
    income = { taxYear };
    state.timeline.incomeYears.push(income);
  }
  if (earnings !== undefined) income.earnings = earnings;
  if (partnerEarnings !== undefined) income.partnerEarnings = partnerEarnings;
}
function syncSalary(state: GameState, salary: number) {
  // A granted future renewal keeps the same job's latest salary.
  for (const e of state.timeline.episodes.filter(
    (e) => e.validTo >= state.date,
  ))
    e.salary = salary;
  // Fictional annualised gross-income model, consistent with the v1 scenario.
  recordIncome(state, state.date, salary);
}
function applyEffects(state: GameState, effects: Effect[]): boolean {
  let changedTimeline = false;
  for (const e of effects) {
    switch (e.type) {
      case 'stat':
        state.stats[e.key] += e.delta;
        break;
      case 'money':
        state.stats.money += e.delta;
        break;
      case 'ending':
        finish(state, e.ending);
        break;
      case 'none':
        break;
      case 'item':
        state.inventory[e.item] = Math.max(
          0,
          (state.inventory[e.item] ?? 0) + e.delta,
        );
        break;
      case 'friendship':
        state.friendship[e.npc] = Math.max(
          0,
          Math.min(b.friendshipMax, (state.friendship[e.npc] ?? 0) + e.delta),
        );
        break;
      case 'absence': {
        const from = addDays(state.date, e.startOffsetDays);
        state.timeline.absences.push({ from, to: addDays(from, e.days - 1) });
        changedTimeline = true;
        break;
      }
      case 'income':
        recordIncome(
          state,
          e.taxYear === 'next' ? addMonths(state.date, 12) : state.date,
          e.earnings,
          e.partnerEarnings,
        );
        changedTimeline = true;
        break;
      case 'episode': {
        Object.assign(episodeAt(state), e.patch);
        if (e.patch.salary !== undefined) syncSalary(state, e.patch.salary);
        changedTimeline = true;
        break;
      }
      case 'newEpisode': {
        const current = episodeAt(state);
        const from =
          e.start === 'afterCurrent' && current
            ? addDays(current.validTo, 1)
            : addDays(state.date, e.gapDays ?? 0);
        if (e.start !== 'afterCurrent') {
          state.timeline.episodes = state.timeline.episodes.filter(
            (episode) => episode.validFrom < state.date,
          );
          if (current) current.validTo = addDays(state.date, -1);
        }
        state.timeline.episodes.push({
          ...e.episode,
          validFrom: from,
          validTo: addDays(addMonths(from, e.durationMonths), -1),
        });
        if (e.start !== 'afterCurrent' && e.episode.salary !== undefined)
          recordIncome(state, from, e.episode.salary);
        changedTimeline = true;
        break;
      }
      case 'benefit': {
        const from = addDays(state.date, e.startOffsetDays);
        state.timeline.benefits.push({
          ...e.benefit,
          from,
          ...(e.months !== undefined && {
            to: addDays(addMonths(from, e.months), -1),
          }),
        });
        changedTimeline = true;
        break;
      }
      case 'relationship':
        if (e.remove)
          state.timeline.relationships = state.timeline.relationships.filter(
            (r) => r.type !== e.remove,
          );
        if (e.add) state.timeline.relationships.push(e.add);
        changedTimeline = true;
        break;
      case 'english': {
        const ranks = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        const old = state.timeline.english;
        if (
          !old ||
          ('cefrLevel' in old &&
            ranks.indexOf(e.cefrLevel) > ranks.indexOf(old.cefrLevel))
        )
          state.timeline.english = { cefrLevel: e.cefrLevel };
        changedTimeline = true;
        break;
      }
      case 'lifeInTheUk':
        state.timeline.lifeInTheUk = { passed: true };
        changedTimeline = true;
        break;
      case 'breach':
        state.timeline.immigrationBreaches.push({
          ...e.breach,
          date: addDays(state.date, e.offsetDays ?? 0),
        });
        changedTimeline = true;
        break;
      case 'criminal':
        state.timeline.criminalRecord.push({
          ...e.event,
          date: addDays(state.date, e.offsetDays ?? 0),
        });
        changedTimeline = true;
        break;
      case 'timeline':
        Object.assign(state.timeline, e.patch);
        changedTimeline = true;
        break;
    }
  }
  for (const key of ['mood', 'health', 'english', 'career'] as const)
    state.stats[key] = Math.max(0, Math.min(100, state.stats[key]));
  // A declared savings pot cannot retain money the household has spent.
  if (state.timeline.cashSavings !== undefined) {
    const savings = Math.min(
      state.timeline.cashSavings,
      Math.max(0, state.stats.money),
    );
    if (savings !== state.timeline.cashSavings) {
      state.timeline.cashSavings = savings;
      changedTimeline = true;
    }
  }
  return changedTimeline;
}
function deltas(before: GameState, after: GameState) {
  return Object.fromEntries(
    (Object.keys(before.stats) as StatKey[])
      .filter((key) => before.stats[key] !== after.stats[key])
      .map((key) => [key, after.stats[key] - before.stats[key]]),
  );
}
export function newGame(
  characterId: string,
  seed: number,
  locale: Locale = 'zh-CN',
): GameState {
  const character = characterOf(characterId);
  const timeline = structuredClone(character.timeline);
  const state: GameState = {
    version: 3,
    characterId,
    seed,
    locale,
    year: 1,
    quarter: Math.ceil(
      Number(character.startDate.slice(5, 7)) / 3,
    ) as GameState['quarter'],
    date: character.startDate,
    timeline,
    stats: { ...character.stats },
    dayNumber: 0,
    day: {
      index: 0,
      kind: 'workday',
      date: character.startDate,
      minute: b.wakeMinute,
      weather: 'cloudy',
      place: 'home',
      done: [],
      talked: [],
      gifted: [],
      deliveries: [],
    },
    inventory: {},
    friendship: {},
    plots: [],
    heard: [],
    flags: [],
    firedEvents: [],
    eventQueue: [],
    randomState: seed | 0,
    log: [],
    result: evaluate({ simulationDate: character.startDate, timeline, locale }),
    achievements: [],
  };
  draw(state, random(state) < 0.5 ? 1 : 2);
  beginDay(state, 0);
  return state;
}
export function activities(state: GameState, place: PlaceId): Activity[] {
  if (isOver(state) || !isOpen(state, place)) return [];
  const current = episodeAt(state);
  return locationActions
    .filter((a) => a.place === place)
    .filter((a) => {
      if (a.id === 'assessment') return true;
      if (
        state.pendingEvent ||
        state.trip ||
        state.day.minute + a.minutes > closingTime(state, place)
      )
        return false;
      if (a.oncePerDay && state.day.done.includes(a.id)) return false;
      if (
        a.id.startsWith('summer-show-') &&
        (state.day.done.includes('summer-show') ||
          showQuantity(state, a.id.slice(12)) === 0)
      )
        return false;
      if (!matches(state, a.when)) return false;
      if (a.id === 'rent-plot' && state.plots.length) return false;
      if (
        a.id === 'festival' &&
        state.day.festival === 'bonfire-night' &&
        state.day.minute < b.bonfireStart
      )
        return false;
      if (
        a.id === 'class' &&
        state.day.kind === 'workday' &&
        state.day.minute < b.eveningClass
      )
        return false;
      if (a.id.startsWith('travel-')) {
        const to = addMonths(state.day.date, Number(a.id.slice(7)));
        if (!current || to > current.validTo) return false;
      }
      if (a.id === 'extend')
        return (
          current?.role === 'MAIN' &&
          !!extensionFor(current.route) &&
          (current.route !== 'SKILLED_WORKER' ||
            !current.immigrationSalaryList) &&
          (current.route !== 'FAMILY_PARTNER_OR_PARENT' ||
            current.familyPermission === 'PARTNER_FIVE_YEAR') &&
          !state.timeline.episodes.some((e) => e.validFrom > state.date) &&
          state.stats.money >= extensionFor(current.route)!.cost
        );
      if (a.id === 'settle')
        return (
          Object.values(state.result.byRuleSet).some(
            (r) => r?.outcome === 'LIKELY_ELIGIBLE',
          ) && affordable(state, a.effects)
        );
      return affordable(state, a.effects);
    })
    .map((a) => {
      const action = structuredClone(a);
      if (a.id.startsWith('summer-show-')) {
        const crop = a.id.slice(12);
        const name = items.find((i) => i.id === crop)!.name;
        action.label = {
          zhCN: `带${showQuantity(state, crop)}份${name.zhCN}参加评比`,
          en: `Show ${showQuantity(state, crop)} ${cropName(crop, showQuantity(state, crop))}`,
        };
      }
      if (a.id === 'exam' && state.stats.english >= b.englishB1)
        action.effects = [
          {
            type: 'english',
            cefrLevel: state.stats.english >= b.englishB2 ? 'B2' : 'B1',
          },
        ];
      if (a.id === 'extend' && current) {
        const terms = extensionFor(current.route)!;
        const { validFrom: _from, validTo: _to, ...episode } = current;
        void _from;
        void _to;
        action.effects = [
          { type: 'money', delta: -terms.cost },
          {
            type: 'newEpisode',
            episode,
            durationMonths: terms.months,
            start: 'afterCurrent',
          },
        ];
      }
      if (a.id === 'festival' && state.day.festival === 'bonfire-night')
        action.label = {
          zhCN: '捧着热茶看烟花',
          en: 'Watch fireworks with a warm cup',
        };
      return action;
    });
}
function cropName(crop: string, quantity: number) {
  const name = items.find((i) => i.id === crop)!.name.en.toLowerCase();
  if (quantity === 1 || crop === 'corn') return name;
  return crop === 'tomato' || crop === 'potato' ? `${name}es` : `${name}s`;
}
function showQuantity(state: GameState, crop: string) {
  const record = state.flags.find((f) =>
    f.startsWith(`quarter-harvest:${crop}:`),
  );
  return Math.min(
    state.inventory[crop] ?? 0,
    record ? Number(record.split(':')[2]) : 0,
    b.showMaxQuantity,
  );
}
function affordable(state: GameState, effects: Effect[]) {
  const cost = -effects.reduce(
    (sum, e) => sum + (e.type === 'money' ? e.delta : 0),
    0,
  );
  return cost <= 0 || state.stats.money >= cost;
}
export function doActivity(state: GameState, actionId: string): GameState {
  if (
    actionId === 'assessment' &&
    activities(state, 'council').some((a) => a.id === actionId)
  )
    return state;
  const action =
    state.day.place &&
    activities(state, state.day.place).find((a) => a.id === actionId);
  if (!action) throw new Error(`Activity is not available: ${actionId}`);
  if (action.id === 'assessment') return state;
  const next = structuredClone(state);
  const changed = applyEffects(next, action.effects);
  next.day.done.push(action.id);
  if (action.id === 'extend') setFlags(next, ['visa-renewed']);
  if (action.id === 'overtime') setFlags(next, ['worked-overtime']);
  if (action.id === 'rent-plot') {
    next.plots = Array.from({ length: b.plots }, () => ({ growth: 0 }));
  }
  if (action.id === 'festival')
    applyEffects(
      next,
      townsfolk(next).map((npc) => ({
        type: 'friendship',
        npc: npc.id,
        delta: b.festivalFriendship,
      })),
    );
  if (changed) recalculate(next);
  const endingLog = next.log.filter((entry) => entry.kind === 'ending');
  next.log = next.log.filter((entry) => entry.kind !== 'ending');
  next.log.push({
    year: state.year,
    quarter: state.quarter,
    kind: 'action',
    id: action.id,
    text: action.label,
    statDeltas: deltas(state, next),
  });
  next.log.push(...endingLog);
  next.outcome = {
    kind: action.id.startsWith('travel-') ? 'travel' : 'activity',
    text: action.label,
    statDeltas: deltas(state, next),
  };
  if (action.id === 'board') {
    const posted = notices.filter((n) =>
      next.flags.includes(`quarter-board-${n.id}`),
    );
    const quizDate = firstWeekday(firstWeekday(addDays(state.date, 7), 2), 6);
    next.outcome.text = {
      zhCN: posted
        .map(
          (n) =>
            n.text.zhCN +
            (n.id === 'pub-quiz'
              ? `（${noticeDate(quizDate, 'zh-CN')} 18:00）`
              : ''),
        )
        .join('\n'),
      en: posted
        .map(
          (n) =>
            n.text.en +
            (n.id === 'pub-quiz'
              ? ` (${noticeDate(quizDate, 'en')}, 18:00)`
              : ''),
        )
        .join('\n'),
    };
  }
  if (action.id === 'festival' && next.day.festival)
    next.outcome.text = festivals.find((f) => f.id === next.day.festival)!.text;
  const celebration = Object.entries(festivalActivities).find(
    ([, a]) => a.id === action.id,
  );
  if (celebration) {
    const food = festivalFoods[celebration[0] as FestivalId];
    applyEffects(next, [{ type: 'item', item: food, delta: 1 }]);
    next.outcome.items = { [food]: 1 };
    next.outcome.text = festivals.find((f) => f.id === celebration[0])!.text;
  }
  if (action.id.startsWith('summer-show-')) {
    const crop = action.id.slice(12);
    const quantity = showQuantity(state, crop);
    const score = b.showVariety[crop] + quantity;
    const rank =
      score >= b.showRibbonScore
        ? 'ribbon'
        : score >= b.showCommendedScore
          ? 'commended'
          : 'first';
    applyEffects(next, [
      { type: 'stat', key: 'mood', delta: b.showMood[rank] },
      { type: 'friendship', npc: 'margaret', delta: b.showFriendship },
    ]);
    setFlags(next, [`show-result-${rank}`]);
    next.day.done.push('summer-show');
    const result =
      rank === 'ribbon'
        ? { zhCN: '拿到一枚蓝丝带', en: 'win a blue ribbon' }
        : rank === 'commended'
          ? { zhCN: '得到评委的特别夸奖', en: 'receive a special commendation' }
          : {
              zhCN: '留下第一次参展的标签',
              en: 'take home a first-entry label',
            };
    next.outcome.text = {
      zhCN: `${action.label.zhCN}，${result.zhCN}。玛格丽特帮你把收成装回篮子。`,
      en: `You show ${quantity} ${cropName(crop, quantity)} and ${result.en}. Margaret helps return the harvest to your basket.`,
    };
  }
  next.outcome.statDeltas = deltas(state, next);
  if (
    next.day.festival &&
    (action.id === 'festival' ||
      celebration ||
      action.id.startsWith('summer-show-'))
  )
    setFlags(next, [`visited-festival:${next.day.festival}`]);
  award(next, true);
  if (isOver(next)) {
    award(next);
    return next;
  }
  if (action.id === 'exam') {
    if (
      state.stats.english < b.englishB1 ||
      (state.timeline.english &&
        'cefrLevel' in state.timeline.english &&
        state.timeline.english.cefrLevel === 'B1' &&
        state.stats.english < b.englishB2)
    )
      next.eventQueue.unshift('system-exam-failed');
    else setFlags(next, ['quarter-exam-passed']);
  }
  if (action.id.startsWith('travel-')) {
    next.trip = {
      from: state.day.date,
      to: addMonths(state.day.date, Number(action.id.slice(7))),
    };
    return continueTrip(next);
  }
  return advanceClock(next, action.minutes);
}
export function currentEvent(state: GameState): GameEvent | undefined {
  return isOver(state)
    ? undefined
    : pool(state).find((e) => e.id === state.pendingEvent);
}
export function resolve(state: GameState, choiceId: string): GameState {
  const event = currentEvent(state);
  const choice = event?.choices.find((c) => c.id === choiceId);
  if (!event || !choice)
    throw new Error(`Choice is not available: ${choiceId}`);
  const next = structuredClone(state);
  delete next.pendingEvent;
  const changed = applyEffects(next, choice.effects);
  setFlags(next, choice.sets);
  if (event.id === 'town-lina-papers') {
    const chance =
      choice.id === 'stay' ? b.linaStaySupported : b.linaStayUnaccompanied;
    setFlags(next, [
      random(next) < chance ? 'lina-can-stay' : 'lina-will-leave',
    ]);
  }
  const endingLog = next.log.filter((e) => e.kind === 'ending');
  next.log = next.log.filter((e) => e.kind !== 'ending');
  next.log.push({
    year: state.year,
    quarter: state.quarter,
    kind: 'event',
    id: event.id,
    choiceId,
    text: {
      zhCN: `${event.title.zhCN}：${choice.label.zhCN}`,
      en: `${event.title.en}: ${choice.label.en}`,
    },
    statDeltas: deltas(state, next),
  });
  next.log.push(...endingLog);
  if (changed) recalculate(next);
  award(next, true);
  if (!isOver(next)) {
    pressure(next);
    nextEvent(next);
  } else award(next);
  if (next.trip) return continueTrip(next);
  if (!next.pendingEvent && next.day.resumeMinute !== undefined) {
    const target = next.day.resumeMinute;
    delete next.day.resumeMinute;
    return advanceClock(next, target - next.day.minute);
  }
  return !next.pendingEvent && next.day.minute === b.midnight
    ? sleep(next)
    : next;
}
export function endQuarter(state: GameState): GameState {
  if (isOver(state)) return state;
  if (state.pendingEvent)
    throw new Error('Resolve the pending event before ending the quarter');
  if (
    state.day.index !== 2 ||
    state.day.deliveries.length ||
    state.eventQueue.some(
      (id) =>
        !id.startsWith('system-') &&
        !(state.trip && state.flags.includes(`travel-deferred:${id}`)),
    )
  )
    throw new Error(
      'Finish the three days and their deliveries before ending the quarter',
    );
  const next = structuredClone(state);
  const current = episodeAt(next);
  const lifestyle = state.log.filter(
    (e) =>
      e.year === state.year &&
      e.quarter === state.quarter &&
      e.kind === 'action',
  );
  const salary = current?.salary ?? 0;
  const income = next.timeline.incomeYears.find(
    (y) => y.taxYear === taxYearOf(state.date),
  );
  const partnerEarnings = [...next.timeline.incomeYears]
    .filter(
      (y) =>
        y.taxYear <= taxYearOf(state.date) && y.partnerEarnings !== undefined,
    )
    .sort((a, c) => c.taxYear.localeCompare(a.taxYear))[0]?.partnerEarnings;
  if (income?.earnings === undefined && current?.salary !== undefined)
    recordIncome(next, state.date, salary);
  if (income?.partnerEarnings === undefined && partnerEarnings !== undefined)
    recordIncome(next, state.date, undefined, partnerEarnings);
  const householdSalary =
    salary +
    (current?.route === 'FAMILY_PARTNER_OR_PARENT'
      ? (partnerEarnings ?? 0)
      : 0);
  const played = state.log.filter((e) => e.kind === 'quarter').length;
  applyEffects(next, [
    {
      type: 'money',
      delta:
        householdSalary / b.quartersPerYear -
        b.livingCosts +
        (b.householdCostContribution[state.characterId] ?? 0) +
        (state.flags.includes('cheap-housing') ? b.cheapHousingSaving : 0) -
        (state.year - 1) * b.livingCostAnnualIncrease -
        state.flags.filter(
          (f) =>
            f.startsWith('rent-rise-') &&
            !f.endsWith('-ended') &&
            !state.flags.includes(`${f}-ended`),
        ).length *
          b.rentRisePerQuarter,
    },
    { type: 'stat', key: 'mood', delta: -b.moodDecay },
    // Slow skills fade a whole point every other quarter so stats stay integers.
    { type: 'stat', key: 'english', delta: played % 2 ? 0 : -b.englishDecay },
    { type: 'stat', key: 'career', delta: played % 2 ? 0 : -b.careerDecay },
    {
      type: 'stat',
      key: 'health',
      delta:
        -b.healthDecay -
        (lifestyle.some((e) => e.id === 'overtime')
          ? b.overtimeHealthDecay
          : 0),
    },
  ]);
  let promoted = false;
  if (current?.salary !== undefined) {
    for (const threshold of b.promotionThresholds) {
      const flag = `promotion-${threshold}`;
      if (next.stats.career >= threshold && !next.flags.includes(flag)) {
        syncSalary(next, Math.round(current.salary * b.promotionMultiplier));
        setFlags(next, [flag, 'promoted']);
        promoted = true;
      }
    }
  }
  const rental = state.log.findIndex(
    (entry) => entry.kind === 'action' && entry.id === 'rent-plot',
  );
  const rentalQuarter = state.log
    .slice(0, rental)
    .filter((entry) => entry.kind === 'quarter').length;
  if (rental >= 0 && (played + 1 - rentalQuarter) % b.quartersPerYear === 0)
    applyEffects(next, [{ type: 'money', delta: -b.plotAnnualRent }]);
  next.log.push({
    year: state.year,
    quarter: state.quarter,
    kind: 'quarter',
    id: 'quarter',
    text: {
      zhCN: '工资到账，账单付清，窗外又换了一季。',
      en: 'Pay arrives, bills go out, and another season passes outside.',
    },
    statDeltas: deltas(state, next),
  });
  for (const npc of townsfolk(next))
    if (!state.flags.includes(`quarter-talked-${npc.id}`))
      applyEffects(next, [
        { type: 'friendship', npc: npc.id, delta: -b.unseenDecay },
      ]);
  next.plots = next.plots.map(() => ({ growth: 0 }));
  next.date = addMonths(state.date, b.monthsPerQuarter);
  // Check coverage at every boundary, including a future gap, rather than
  // assuming the latest dated episode means permission is continuous.
  let coveredUntil = addDays(state.date, -1);
  for (const e of [...next.timeline.episodes].sort((a, c) =>
    a.validFrom.localeCompare(c.validFrom),
  )) {
    if (e.validFrom <= addDays(coveredUntil, 1) && e.validTo >= coveredUntil)
      coveredUntil = e.validTo;
  }
  if (coveredUntil < next.date)
    next.timeline.immigrationBreaches.push({
      type: 'OVERSTAYING',
      date: addDays(coveredUntil, 1),
    });
  recordReturn(next);
  recalculate(next);
  // Engine short circuits only adult illegal entry, not OVERSTAYING.
  // Expiry ends this game; the two assessments remain unmodified engine output.
  if (coveredUntil < next.date) finish(next, 'overstayed');
  const completedQuarters = next.log.filter((e) => e.kind === 'quarter').length;
  if (completedQuarters % b.quartersPerYear === 0) award(next);
  if (!isOver(next) && completedQuarters === b.years * b.quartersPerYear)
    finish(next, 'timeout');
  if (!isOver(next)) {
    next.flags = next.flags.filter((f) => !f.startsWith('quarter-'));
    if (promoted) setFlags(next, ['quarter-promoted']);
    next.quarter = ((state.quarter % 4) + 1) as GameState['quarter'];
    next.year =
      state.year + (completedQuarters % b.quartersPerYear === 0 ? 1 : 0);

    if (next.stats.money < 0) {
      if (next.flags.includes('negative-last-quarter')) {
        setFlags(next, ['debt-crisis']);
        next.eventQueue.push('system-debt');
      }
      setFlags(next, ['negative-last-quarter']);
    } else
      next.flags = next.flags.filter(
        (f) => f !== 'negative-last-quarter' && f !== 'debt-crisis',
      );
    draw(next, random(next) < 0.5 ? 1 : 2);
    pressure(next);
    beginDay(next, 0);
  } else award(next);
  return next;
}
export function progress(state: GameState): Progress {
  const start = Math.min(
    ...state.timeline.episodes.map((e: ImmigrationEpisode) =>
      Date.parse(e.validFrom),
    ),
  );
  return Object.fromEntries(
    RULE_SET_IDS.map((id) => {
      const result = state.result.byRuleSet[id];
      const target = result?.earliestDate && Date.parse(result.earliestDate);
      const percent =
        result?.outcome === 'LIKELY_ELIGIBLE'
          ? 100
          : target && target > start
            ? ((Date.parse(state.date) - start) / (target - start)) * 100
            : 0;
      return [
        id,
        {
          outcome: result?.outcome ?? 'INSUFFICIENT_INFORMATION',
          ...(result?.earliestDate && { earliestDate: result.earliestDate }),
          percent: Math.round(Math.max(0, Math.min(100, percent))),
        },
      ];
    }),
  ) as Progress;
}
export function isOver(state: GameState) {
  return state.ending !== undefined;
}
export function narrative(state: GameState): Text[] {
  const name = characterOf(state.characterId).name;
  const sentences: Text[] = [
    {
      zhCN: `${name.zhCN}在 ${characterOf(state.characterId).startDate} 开始记录小镇生活。`,
      en: `${name.en} began keeping a town diary on ${characterOf(state.characterId).startDate}.`,
    },
  ];
  const friends = npcs
    .filter((npc) => !npc.characters && (state.friendship[npc.id] ?? 0) > 0)
    .sort(
      (a, c) =>
        (state.friendship[c.id] ?? 0) - (state.friendship[a.id] ?? 0) ||
        a.id.localeCompare(c.id),
    )
    .slice(0, 3);
  if (friends.length)
    sentences.push({
      zhCN: `想起小镇时，总会先想起${friends.map((n) => n.name.zhCN).join('、')}，还有他们留着的座位。`,
      en: `Thoughts of town bring ${friends.map((n) => n.name.en).join(', ')} to mind, and the seats they kept for you.`,
    });
  const harvests = state.log.filter(
    (e) => e.kind === 'action' && e.id === 'harvest',
  ).length;
  const casts = state.log.filter(
    (e) => e.kind === 'action' && e.id === 'fishing',
  ).length;
  const catches = state.log.filter(
    (e) => e.kind === 'action' && e.id === 'catch-fish',
  ).length;
  sentences.push({
    zhCN: `菜地收成 ${harvests} 次，池塘抛竿 ${casts} 次，钓到鱼 ${catches} 次；篮子和鱼竿都留下了使用的痕迹。`,
    en: `There were ${harvests} harvests, ${casts} casts and ${catches} successful fish catches; basket and rod show their use.`,
  });
  const visited = festivals.filter((f) =>
    state.flags.includes(`visited-festival:${f.id}`),
  );
  if (visited.length)
    sentences.push({
      zhCN: `去过${visited.map((f) => f.name.zhCN).join('、')}，灯下的面孔渐渐都熟悉了。`,
      en: `You joined ${visited.map((f) => f.name.en).join(', ')}; the faces beneath the lights grew familiar.`,
    });
  const groups: [string[], Text][] = [
    [
      ['work', 'overtime'],
      {
        zhCN: '键盘和工资单，渐渐成了生活的节拍。',
        en: 'Keyboards and payslips slowly set the rhythm of life.',
      },
    ],
    [
      ['class', 'exam'],
      {
        zhCN: '课本翻了又翻，开口说话也越来越自在。',
        en: 'The textbooks grew worn, and conversation grew easier.',
      },
    ],
    [
      ['rest', 'gp', 'relax'],
      {
        zhCN: '也有一些日子，休息比赶路更要紧。',
        en: 'On some days, rest mattered more than rushing ahead.',
      },
    ],
    [
      ['extend', 'settle'],
      {
        zhCN: '文件夹越装越厚，下一段生活逐渐有了形状。',
        en: 'The paperwork folder thickened as the next chapter took shape.',
      },
    ],
    [
      ['travel-1', 'travel-3', 'travel-6'],
      {
        zhCN: '行李箱来回滚过，想念在两边都有地址。',
        en: 'The suitcase rolled both ways; there were people to miss at either end.',
      },
    ],
  ];
  for (const [ids, text] of groups) {
    const entry = state.log.find(
      (e) => e.kind === 'action' && ids.includes(e.id),
    );
    if (entry) sentences.push(text);
  }
  // Distinct event memories retain the actual choice, rather than a score summary.
  for (const e of state.log
    .filter((e) => e.kind === 'event')
    .filter((e, i, all) => all.findIndex((x) => x.id === e.id) === i)
    .slice(0, 3)) {
    sentences.push({
      zhCN: `记得那次${e.text.zhCN}。`,
      en: `One memory remains: ${e.text.en}.`,
    });
  }
  const quarters = state.log.filter((e) => e.kind === 'quarter').length;
  sentences.push({
    zhCN: `日记写过 ${quarters} 个季度，雨伞换了位置，生活没有停。`,
    en: `The diary spans ${quarters} quarters; umbrellas moved, and life kept going.`,
  });
  sentences.push({
    zhCN: `账本最后留下 £${Math.round(state.stats.money).toLocaleString('en-GB')}，还有没写进账本的牵挂。`,
    en: `The ledger holds £${Math.round(state.stats.money).toLocaleString('en-GB')}, alongside things it cannot count.`,
  });
  const fillers: Text[] = [
    {
      zhCN: '有些周末，最远只走到街角的超市。',
      en: 'Some weekends reached no further than the corner supermarket.',
    },
    {
      zhCN: '天气预报没总说准，日子倒是一天天过了。',
      en: 'The forecast was not always right, but the days passed anyway.',
    },
    {
      zhCN: '熟悉的街道，也曾是地图上陌生的一格。',
      en: 'These familiar streets were once unknown squares on a map.',
    },
    {
      zhCN: '茶凉过很多次，故事还留着余温。',
      en: 'Many cups of tea went cold; the story kept some warmth.',
    },
  ];
  const ending = state.log.find((e) => e.kind === 'ending')?.text;
  while (sentences.length < (ending ? 7 : 8))
    sentences.push(fillers[(sentences.length - 1) % fillers.length]);
  return [...sentences.slice(0, ending ? 11 : 12), ...(ending ? [ending] : [])];
}

function closingTime(state: GameState, place: PlaceId) {
  return Math.min(
    b.midnight,
    places.find((p) => p.id === place)?.hours?.closes ?? b.midnight,
  );
}
function isOpen(state: GameState, place: PlaceId) {
  const hours = places.find((p) => p.id === place)?.hours;
  return (
    !hours ||
    ((!hours.dayKinds || hours.dayKinds.includes(state.day.kind)) &&
      state.day.minute >= hours.opens &&
      state.day.minute < hours.closes)
  );
}
function noticeDate(date: IsoDate, locale: Locale) {
  const day = new Date(`${date}T00:00:00Z`);
  if (locale === 'zh-CN')
    return `${day.getUTCMonth() + 1}月${day.getUTCDate()}日周${'日一二三四五六'[day.getUTCDay()]}`;
  return `${new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'UTC' }).format(day)} ${day.getUTCDate()} ${new Intl.DateTimeFormat('en-GB', { month: 'short', timeZone: 'UTC' }).format(day)}`;
}
function firstWeekday(date: IsoDate, weekday: number): IsoDate {
  const delta = (weekday - new Date(date).getUTCDay() + 7) % 7;
  return addDays(date, delta || 7);
}
function festivalDate(id: FestivalId, year: number): IsoDate {
  if (id === 'lunar-new-year') return firstWeekday(`${year}-01-31`, 6);
  if (id === 'may-day') return firstWeekday(`${year}-04-30`, 1);
  if (id === 'bonfire-night') return `${year}-11-05`;
  const before = id === 'summer-fair' ? `${year}-09-01` : `${year}-12-25`;
  let date = addDays(before, -1);
  while (new Date(date).getUTCDay() !== 6) date = addDays(date, -1);
  return date;
}
function specialDay(state: GameState): { date: IsoDate; festival: FestivalId } {
  const end = addMonths(state.date, b.monthsPerQuarter);
  const pick = (year: number): FestivalId =>
    state.quarter === 1
      ? 'lunar-new-year'
      : state.quarter === 2
        ? 'may-day'
        : state.quarter === 3
          ? 'summer-fair'
          : year % 2
            ? 'bonfire-night'
            : 'christmas-market';
  for (
    let year = Number(state.date.slice(0, 4));
    year <= Number(end.slice(0, 4));
    year++
  ) {
    const festival = pick(year);
    const date = festivalDate(festival, year);
    const weekend = firstWeekday(firstWeekday(addDays(state.date, 7), 2), 6);
    if (date > weekend && date < end) return { date, festival };
  }
  let date = addDays(end, -1);
  while (new Date(date).getUTCDay() !== 6) date = addDays(date, -1);
  return { date, festival: pick(Number(date.slice(0, 4))) };
}
function beginDay(state: GameState, index: DayState['index']) {
  const weights = b.weatherWeights[state.quarter];
  let cursor = random(state) * weights.reduce((sum, n) => sum + n, 0);
  const weather = (['sunny', 'cloudy', 'rain', 'snow'] as Weather[])[
    weights.findIndex((n) => (cursor -= n) < 0)
  ];
  const special = specialDay(state);
  state.day = {
    index,
    kind: (['workday', 'weekend', 'special'] as const)[index],
    date:
      index === 0
        ? firstWeekday(addDays(state.date, 7), 2)
        : index === 1
          ? firstWeekday(firstWeekday(addDays(state.date, 7), 2), 6)
          : special.date,
    minute: b.wakeMinute,
    weather,
    ...(index === 2 && { festival: special.festival }),
    place: 'home',
    done: [],
    talked: [],
    gifted: [],
    deliveries: [],
  };
  // Day kinds and festivals are known for the remaining days. Weather is rolled
  // daily, so weather-bound cards take the first matching day.
  for (const id of [...state.eventQueue]) {
    if (id.startsWith('system-')) continue;
    const event = pool(state).find((e) => e.id === id)!;
    const channel = event.channel ?? 'morning';
    if (state.trip && channel === 'morning') {
      // A town-set morning card does not happen while the player is abroad;
      // it goes back to the pool and may be drawn in a later quarter.
      state.eventQueue.splice(state.eventQueue.indexOf(id), 1);
      continue;
    }
    if (state.trip && channel !== 'phone') {
      setFlags(state, [`travel-deferred:${id}`]);
      continue;
    }
    const hours = channel.startsWith('place:')
      ? places.find((p) => p.id === channel.slice(6))?.hours
      : undefined;
    const window = timeWindow(
      event,
      channel === 'phone' ? b.phoneStart : (hours?.opens ?? b.wakeMinute),
      channel === 'phone' ? b.phoneEnd : hours ? hours.closes - 1 : b.midnight,
    );
    const morning = channel === 'morning' || channel === 'letter';
    const remaining = ([0, 1, 2] as const).filter((i) => {
      const kind = (['workday', 'weekend', 'special'] as const)[i];
      return (
        i >= index &&
        (!hours?.dayKinds || hours.dayKinds.includes(kind)) &&
        matches(
          {
            ...state,
            day: {
              ...state.day,
              kind,
              festival: i === 2 ? special.festival : undefined,
            },
          },
          event.when?.filter((c) => dayCondition(c) && !('weather' in c)),
        )
      );
    });
    const possible =
      window.start <= window.end &&
      (!morning ||
        (window.start <= b.wakeMinute && b.wakeMinute <= window.end));
    if (!possible || !remaining.length) {
      state.eventQueue.splice(state.eventQueue.indexOf(id), 1);
      state.flags = state.flags.filter((f) => f !== `travel-deferred:${id}`);
      continue;
    }
    const today =
      remaining.includes(index) &&
      matches(state, event.when?.filter(dayCondition));
    if (!today) {
      if (index === 2) state.eventQueue.splice(state.eventQueue.indexOf(id), 1);
      continue;
    }
    const deferred = state.flags.includes(`travel-deferred:${id}`);
    if (
      !deferred &&
      !event.when?.some((c) => 'weather' in c) &&
      remaining.length > 1 &&
      random(state) >= 1 / remaining.length
    )
      continue;
    state.eventQueue.splice(state.eventQueue.indexOf(id), 1);
    state.flags = state.flags.filter((f) => f !== `travel-deferred:${id}`);
    state.day.deliveries.push({
      eventId: id,
      channel,
      ...(channel === 'phone' && {
        minute:
          window.start +
          Math.floor(random(state) * (window.end - window.start + 1)),
      }),
    });
  }
  nextEvent(state);
}
function ready(state: GameState, place?: PlaceId, minutes = 0) {
  if (state.pendingEvent || state.trip || isOver(state))
    throw new Error('Finish the pending event or journey first');
  if (
    state.day.minute + minutes >
    (place ? closingTime(state, place) : b.midnight)
  )
    throw new Error('There is not enough time today');
  if (place && (state.day.place !== place || !isOpen(state, place)))
    throw new Error(`Go to the open ${place} first`);
}
function advanceClock(state: GameState, minutes: number): GameState {
  const target = Math.min(
    b.midnight,
    state.day.minute + Math.max(0, Math.floor(minutes)),
  );
  const phone = state.day.deliveries
    .filter(
      (d) => d.channel === 'phone' && (d.minute ?? b.phoneStart) <= target,
    )
    .filter((d) => {
      const event = pool(state).find((e) => e.id === d.eventId);
      return (
        event &&
        available(
          {
            ...state,
            day: {
              ...state.day,
              minute: Math.max(state.day.minute, d.minute ?? b.phoneStart),
            },
          },
          event,
        )
      );
    })
    .sort((a, c) => (a.minute ?? b.phoneStart) - (c.minute ?? b.phoneStart))[0];
  state.day.minute =
    !state.pendingEvent && phone
      ? Math.max(state.day.minute, phone.minute ?? b.phoneStart)
      : target;
  if (state.day.minute < target) state.day.resumeMinute = target;
  pressure(state);
  nextEvent(state);
  if (state.day.minute === b.midnight) {
    if (!state.day.done.includes('midnight')) {
      applyEffects(state, [
        { type: 'stat', key: 'mood', delta: b.midnightMood },
      ]);
      state.day.done.push('midnight');
    }
    state.day.place = 'home';
    return state.pendingEvent ? state : sleep(state);
  }
  return state;
}
export function tick(state: GameState, minutes: number): GameState {
  if (state.pendingEvent || isOver(state) || state.trip) return state;
  return advanceClock(structuredClone(state), minutes);
}
export function enter(state: GameState, place: PlaceId): GameState {
  if (state.pendingEvent || state.trip || isOver(state)) return state;
  const next = structuredClone(state);
  next.day.place = place;
  if (place === 'home' && state.day.place !== 'home')
    next.day.done.push('returned-home');
  if (place !== 'home' || next.day.done.includes('returned-home'))
    deliver(next, `place:${place}`);
  return next;
}
export function mailbox(state: GameState): string[] {
  if (state.trip) return [];
  return state.day.deliveries
    .filter((d) => d.channel === 'letter')
    .map((d) => d.eventId);
}
export function readMail(state: GameState): GameState {
  if (state.pendingEvent || state.trip || isOver(state)) return state;
  const next = structuredClone(state);
  deliver(next, 'letter');
  return next;
}
function grow(state: GameState) {
  for (const plot of state.plots)
    if (plot.seed)
      plot.growth +=
        b.growthPerDay +
        (plot.wateredOn === state.dayNumber || state.day.weather === 'rain'
          ? b.wateredGrowth
          : 0);
  state.dayNumber++;
}
function sleepDay(state: GameState): GameState {
  if (state.pendingEvent || isOver(state)) return state;
  const next = structuredClone(state);
  deliver(next, 'leftovers');
  if (next.pendingEvent) return next;
  if (next.trip) {
    for (const delivery of next.day.deliveries) {
      if (!next.eventQueue.includes(delivery.eventId))
        next.eventQueue.push(delivery.eventId);
      setFlags(next, [`travel-deferred:${delivery.eventId}`]);
    }
  }
  // Missed windows return to the pool without being marked as fired.
  next.day.deliveries = [];
  applyEffects(next, [
    {
      type: 'stat',
      key: 'health',
      delta: next.day.minute < b.earlyBed ? b.earlySleepHealth : 0,
    },
    {
      type: 'stat',
      key: 'mood',
      delta: next.day.minute >= b.lateBed ? b.lateSleepMood : 0,
    },
  ]);
  grow(next);
  next.outcome = {
    kind: 'sleep',
    text: {
      zhCN: '窗外安静下来，明天的茶杯已经摆好。',
      en: 'Outside falls quiet. Tomorrow’s cup is ready.',
    },
    statDeltas: deltas(state, next),
  };
  if (state.day.index === 2) return endQuarter(next);
  beginDay(next, (state.day.index + 1) as DayState['index']);
  return next;
}
export function sleep(state: GameState): GameState {
  const next = sleepDay(state);
  return next.trip ? continueTrip(next) : next;
}
function recordReturn(state: GameState) {
  if (!state.trip || state.date < state.trip.to) return false;
  const trip = state.trip;
  delete state.trip;
  state.timeline.absences.push({ from: trip.from, to: trip.to });
  state.outcome = {
    kind: 'travel',
    text: {
      zhCN: '行李箱又滚回了门口，旅途写进了日记。',
      en: 'The suitcase rolls home, and the journey goes into the diary.',
    },
  };
  return true;
}
function continueTrip(state: GameState): GameState {
  let next = state;
  while (next.trip && !isOver(next)) {
    if (next.date >= next.trip.to) {
      recordReturn(next);
      recalculate(next);
      return next;
    }
    if (next.pendingEvent) return next;
    next = sleepDay(next);
  }
  return next;
}
export function fastForward(state: GameState): GameState {
  if (state.pendingEvent || isOver(state)) return state;
  if (state.trip) return continueTrip(structuredClone(state));
  const date = state.date;
  let next = structuredClone(state);
  const routine = (id: string, place: PlaceId, minute: number) => {
    if (next.day.done.includes(id) || next.day.done.includes(`auto-${id}`))
      return;
    if (next.day.minute < minute) next = tick(next, minute - next.day.minute);
    if (next.pendingEvent || isOver(next) || next.date !== date) return;
    next = enter(next, place);
    if (next.pendingEvent) return;
    if (activities(next, place).some((a) => a.id === id))
      next = doActivity(next, id);
    else next.day.done.push(`auto-${id}`);
  };
  while (next.date === date && !isOver(next) && !next.pendingEvent) {
    if (next.day.kind === 'workday') {
      routine('work', 'work', 540);
      if (next.pendingEvent) break;
      if (!next.day.done.includes('auto-evening')) {
        const evening =
          next.stats.english < b.englishB2 && next.stats.money >= b.classCost
            ? 'class'
            : next.stats.mood < b.routineMoodTarget
              ? 'relax'
              : 'bench';
        routine(
          evening,
          evening === 'class'
            ? 'college'
            : evening === 'relax'
              ? 'pub'
              : 'bench',
          1080,
        );
        if (
          next.day.done.includes(evening) ||
          next.day.done.includes(`auto-${evening}`)
        )
          next.day.done.push('auto-evening');
      }
    } else if (next.day.kind === 'weekend') {
      routine('rest', 'home', b.wakeMinute);
      if (next.pendingEvent) break;
      if (next.stats.health < b.routineHealthTarget)
        routine('nap', 'home', 600);
      if (next.pendingEvent) break;
      if (next.stats.mood < b.routineMoodTarget) routine('bench', 'bench', 660);
      if (next.pendingEvent) break;
      if (next.stats.mood < b.routineMoodTarget) routine('relax', 'pub', 720);
    } else
      routine(
        'festival',
        'green',
        next.day.festival === 'bonfire-night' ? b.bonfireStart : 600,
      );
    if (next.pendingEvent || isOver(next) || next.date !== date) break;
    if (next.day.minute < 1260) next = tick(next, 1260 - next.day.minute);
    if (next.pendingEvent || next.date !== date) break;
    next = sleep(next);
  }
  return next;
}
export function townsfolk(state: GameState): Npc[] {
  return npcs.filter(
    (npc) =>
      (!npc.characters || npc.characters.includes(state.characterId)) &&
      !(npc.id === 'lina' && state.flags.includes('lina-left')),
  );
}
function npcOf(state: GameState, id: string) {
  const npc = townsfolk(state).find((npc) => npc.id === id);
  if (!npc) throw new Error(`Unknown townsperson: ${id}`);
  return npc;
}
export function npcAt(state: GameState, npc: string): NpcLocation {
  const person = npcOf(state, npc);
  const rule = person.schedule.find(
    (r) =>
      (!r.dayKinds || r.dayKinds.includes(state.day.kind)) &&
      (!r.weather || r.weather.includes(state.day.weather)) &&
      (r.festival === undefined || r.festival === !!state.day.festival) &&
      matches(state, r.when),
  )!;
  return [...rule.stops].reverse().find((s) => s.from <= state.day.minute)!.at;
}
export function peopleAt(state: GameState, place: PlaceId): string[] {
  return townsfolk(state)
    .filter((npc) => npcAt(state, npc.id) === place)
    .map((npc) => npc.id);
}
export function hearts(state: GameState, npc: string): number {
  return Math.floor((state.friendship[npc] ?? 0) / 100);
}
export function talk(state: GameState, npc: string): GameState {
  ready(state, undefined, b.minutes.talk);
  const person = npcOf(state, npc);
  const next = structuredClone(state);
  if (!next.day.talked.includes(npc)) {
    applyEffects(next, [
      { type: 'friendship', npc, delta: b.talkFriendship },
      { type: 'stat', key: 'mood', delta: b.talkMood },
    ]);
    next.day.talked.push(npc);
    setFlags(next, [`quarter-talked-${npc}`]);
    setFlags(next, [`talked-${npc}`]);
  }
  const eligible = person.lines.filter(
    (line) =>
      (line.heartsMin === undefined || hearts(next, npc) >= line.heartsMin) &&
      (line.heartsMax === undefined || hearts(next, npc) <= line.heartsMax) &&
      (!line.season || line.season === next.quarter) &&
      (!line.weather || line.weather.includes(next.day.weather)) &&
      (!line.dayKinds || line.dayKinds.includes(next.day.kind)) &&
      (!line.festival || line.festival === next.day.festival) &&
      (line.requires ?? []).every((f) => next.flags.includes(f)) &&
      !(line.forbids ?? []).some((f) => next.flags.includes(f)) &&
      (!line.once || !next.heard.includes(line.id)) &&
      matches(next, line.when),
  );
  const fresh = eligible.filter((line) => !next.heard.includes(line.id));
  const festivalLines = fresh.filter(
    (line) =>
      line.festival === next.day.festival && line.festival !== undefined,
  );
  const options = festivalLines.length
    ? festivalLines
    : fresh.length
      ? fresh
      : eligible;
  const line = options[Math.floor(random(next) * options.length)];
  if (line && !next.heard.includes(line.id)) next.heard.push(line.id);
  next.outcome = {
    kind: 'talk',
    npc,
    text: line?.text,
    statDeltas: deltas(state, next),
  };
  deliver(next, `npc:${npc}`);
  if (!next.pendingEvent) {
    const heart = heartEvents.find(
      (event) =>
        event.heart!.npc === npc &&
        hearts(next, npc) >= event.heart!.hearts &&
        available(next, event),
    );
    if (heart) makePending(next, heart.id);
  }
  award(next, true);
  return advanceClock(next, b.minutes.talk);
}
export function gift(state: GameState, npc: string, item: ItemId): GameState {
  ready(state, undefined, b.minutes.gift);
  const person = npcOf(state, npc);
  if (state.day.gifted.includes(npc) || !(state.inventory[item] > 0))
    throw new Error('Gift is not available');
  const next = structuredClone(state);
  const liking = person.gifts.loved.includes(item)
    ? 'loved'
    : person.gifts.liked.includes(item)
      ? 'liked'
      : person.gifts.disliked.includes(item)
        ? 'disliked'
        : 'neutral';
  applyEffects(next, [
    { type: 'item', item, delta: -1 },
    { type: 'friendship', npc, delta: b.gifts[liking] },
  ]);
  next.day.gifted.push(npc);
  if (liking === 'loved') recordLife(next, 'loved-gift', person.name);
  next.outcome = {
    kind: 'gift',
    npc,
    text: person.reactions[liking],
    items: { [item]: -1 },
  };
  award(next, true);
  return advanceClock(next, b.minutes.gift);
}
export function shop(state: GameState, place: PlaceId) {
  if (
    state.pendingEvent ||
    state.trip ||
    isOver(state) ||
    !isOpen(state, place) ||
    state.day.minute + b.minutes.buy > closingTime(state, place)
  )
    return [];
  if (place === 'green' && state.day.festival)
    return items.filter((i) => i.id === festivalFoods[state.day.festival!]);
  if (place !== 'shop') return [];
  return items.filter(
    (i) =>
      i.price !== undefined &&
      (i.grows
        ? i.grows.seasons.includes(state.quarter)
        : ['tea', 'biscuits', 'flowers', 'cake'].includes(i.id)),
  );
}
export function buy(state: GameState, item: ItemId, qty: number): GameState {
  ready(state, state.day.place, b.minutes.buy);
  const goods =
    state.day.place && shop(state, state.day.place).find((i) => i.id === item);
  if (
    !goods ||
    !Number.isInteger(qty) ||
    qty <= 0 ||
    state.stats.money < goods.price! * qty
  )
    throw new Error('Purchase is not available');
  const next = structuredClone(state);
  if (
    applyEffects(next, [
      { type: 'money', delta: -goods.price! * qty },
      { type: 'item', item, delta: qty },
    ])
  )
    recalculate(next);
  next.outcome = {
    kind: 'buy',
    text: goods.name,
    items: { [item]: qty },
    statDeltas: deltas(state, next),
  };
  return advanceClock(next, b.minutes.buy);
}
export function plant(state: GameState, plot: number, seed: ItemId): GameState {
  ready(state, 'allotment', b.minutes.plant);
  const grows = items.find((i) => i.id === seed)?.grows;
  if (
    !state.plots[plot] ||
    state.plots[plot].seed ||
    !grows?.seasons.includes(state.quarter) ||
    !(state.inventory[seed] > 0)
  )
    throw new Error('Planting is not available');
  const next = structuredClone(state);
  next.plots[plot] = { seed, growth: 0 };
  applyEffects(next, [{ type: 'item', item: seed, delta: -1 }]);
  next.outcome = {
    kind: 'activity',
    text: {
      zhCN: '种子埋好，土轻轻拍平了。',
      en: 'Seeds tucked in, soil patted down.',
    },
    items: { [seed]: -1 },
  };
  return advanceClock(next, b.minutes.plant);
}
export function water(state: GameState, plot: number): GameState {
  ready(state, 'allotment', b.minutes.water);
  if (
    !state.plots[plot]?.seed ||
    state.plots[plot].wateredOn === state.dayNumber
  )
    throw new Error('Watering is not available');
  const next = structuredClone(state);
  next.plots[plot].wateredOn = state.dayNumber;
  next.outcome = {
    kind: 'activity',
    text: {
      zhCN: '水落进土里，小屋的水壶轻了一点。',
      en: 'Water sinks into the soil; the can feels lighter.',
    },
  };
  return advanceClock(next, b.minutes.water);
}
export function harvest(state: GameState, plot: number): GameState {
  ready(state, 'allotment', b.minutes.harvest);
  const planted = state.plots[plot];
  const grows = items.find((i) => i.id === planted?.seed)?.grows;
  if (!grows || planted.growth < grows.days)
    throw new Error('Harvest is not ready');
  const next = structuredClone(state);
  const qty =
    b.harvestMin + Math.floor(random(next) * (b.harvestMax - b.harvestMin + 1));
  applyEffects(next, [{ type: 'item', item: grows.crop, delta: qty }]);
  const prefix = `quarter-harvest:${grows.crop}:`;
  const previous = next.flags.find((f) => f.startsWith(prefix));
  const total = (previous ? Number(previous.split(':')[2]) : 0) + qty;
  next.flags = next.flags.filter((f) => !f.startsWith(prefix));
  setFlags(next, [`${prefix}${total}`]);
  next.plots[plot] = { growth: 0 };
  next.outcome = { kind: 'harvest', items: { [grows.crop]: qty } };
  recordLife(next, 'harvest', items.find((i) => i.id === grows.crop)!.name);
  award(next, true);
  return advanceClock(next, b.minutes.harvest);
}
export function fish(state: GameState, caught: boolean): GameState {
  ready(state, 'pond', b.minutes.fish);
  const next = structuredClone(state);
  recordLife(next, 'fishing', { zhCN: '在池塘抛竿', en: 'Cast at the pond' });
  if (!caught) {
    next.outcome = {
      kind: 'catch',
      text: {
        zhCN: '浮标晃了晃，鱼先回家了。',
        en: 'The float wobbles. The fish heads home first.',
      },
    };
  } else {
    const choices =
      next.day.weather === 'rain'
        ? ['tench', 'bream', 'carp']
        : next.quarter === 1
          ? ['pike', 'perch', 'roach']
          : next.quarter === 3
            ? ['carp', 'tench', 'bream']
            : ['perch', 'roach', 'carp'];
    if (next.day.minute >= b.phoneEnd) choices.push('pike');
    const junk = random(next) < b.fishingJunkChance;
    const available = junk ? ['old-boot', 'shopping-trolley'] : choices;
    const item = available[Math.floor(random(next) * available.length)];
    applyEffects(next, [{ type: 'item', item, delta: 1 }]);
    if (!junk) {
      recordLife(next, 'catch-fish', items.find((i) => i.id === item)!.name);
      if (item === 'pike') setFlags(next, ['caught-pike']);
    }
    next.outcome = {
      kind: 'catch',
      text: items.find((i) => i.id === item)!.name,
      items: { [item]: 1 },
    };
  }
  award(next, true);
  return advanceClock(next, b.minutes.fish);
}
export function cook(state: GameState, recipe: string): GameState {
  ready(state, 'home');
  const dish = recipes.find((r) => r.id === recipe);
  if (
    !dish ||
    Object.entries(dish.needs).some(
      ([item, qty]) => (state.inventory[item] ?? 0) < qty,
    )
  )
    throw new Error('Ingredients are missing');
  ready(state, 'home', dish.minutes);
  const next = structuredClone(state);
  const changes: Record<string, number> = Object.fromEntries([
    ...Object.entries(dish.needs).map(([item, qty]) => [item, -qty]),
    [dish.makes, 1],
  ]);
  applyEffects(
    next,
    Object.entries(changes).map(([item, delta]) => ({
      type: 'item',
      item,
      delta,
    })),
  );
  next.outcome = { kind: 'cook', text: dish.label, items: changes };
  return advanceClock(next, dish.minutes);
}
export function eat(state: GameState, item: ItemId): GameState {
  ready(state, undefined, b.minutes.eat);
  const food = items.find((i) => i.id === item);
  if (!food?.edible || !(state.inventory[item] > 0))
    throw new Error('Food is not available');
  const next = structuredClone(state);
  applyEffects(next, [
    { type: 'item', item, delta: -1 },
    ...Object.entries(food.edible).map(([key, delta]): Effect => ({
      type: 'stat',
      key: key as StatKey,
      delta,
    })),
  ]);
  next.outcome = {
    kind: 'eat',
    text: food.name,
    items: { [item]: -1 },
    statDeltas: deltas(state, next),
  };
  return advanceClock(next, b.minutes.eat);
}
