import { evaluate } from '@uk-immigration/engine';
import type {
  ImmigrationEpisode,
  IsoDate,
  Locale,
} from '@uk-immigration/engine';
import { RULE_SET_IDS } from '@uk-immigration/policy-data';
import { balance as b } from './balance';
import { achievements } from './achievements';
import { skilledWorker } from './characters/skilled-worker';
import { hongKongBno } from './characters/hong-kong-bno';
import { familyPartner } from './characters/family-partner';
import { commonEvents, systemEvents } from './events/common';
import { extensionFor, locationActions } from './locations';
import type {
  Condition,
  Effect,
  EndingId,
  GameEvent,
  GameState,
  LocationAction,
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
    return (
      (c.yearMin === undefined || state.year >= c.yearMin) &&
      (c.yearMax === undefined || state.year <= c.yearMax)
    );
  });
}
function available(state: GameState, event: GameEvent) {
  return (
    (!event.season || event.season === state.quarter) &&
    (!event.once || !state.firedEvents.includes(event.id)) &&
    (event.requires ?? []).every((f) => state.flags.includes(f)) &&
    !(event.forbids ?? []).some((f) => state.flags.includes(f)) &&
    matches(state, event.when)
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
  for (let i = 0; i < count; i++) {
    const candidates = [
      ...commonEvents,
      ...characterOf(state.characterId).events,
    ].filter(
      (e) =>
        available(state, e) &&
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
function nextEvent(state: GameState) {
  delete state.pendingEvent;
  while (state.eventQueue.length) {
    const id = state.eventQueue.shift();
    const event = pool(state).find((e) => e.id === id);
    if (event && available(state, event)) {
      state.pendingEvent = event.id;
      state.firedEvents.push(event.id);
      return;
    }
  }
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
  state.actionsLeft = 0;
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
function award(state: GameState) {
  for (const a of [
    ...achievements,
    ...(characterOf(state.characterId).achievements ?? []),
  ]) {
    if (!state.achievements.includes(a.id) && a.check(state))
      state.achievements.push(a.id);
  }
}
function setFlags(state: GameState, flags: string[] = []) {
  state.flags = [...new Set([...state.flags, ...flags])];
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
    version: 2,
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
    actionsLeft: b.actionsPerQuarter,
    flags: [],
    firedEvents: [],
    eventQueue: [],
    randomState: seed | 0,
    log: [],
    result: evaluate({ simulationDate: character.startDate, timeline, locale }),
    achievements: [],
  };
  draw(state, random(state) < 0.5 ? 1 : 2);
  nextEvent(state);
  return state;
}
export function actions(state: GameState): LocationAction[] {
  if (isOver(state)) return [];
  const current = episodeAt(state);
  return locationActions
    .filter((a) => {
      if (a.id === 'assessment') return true;
      if (state.actionsLeft < (a.cost ?? 1) || state.pendingEvent) return false;
      if (!matches(state, a.when)) return false;
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
          ) &&
          state.stats.money >=
            -a.effects
              .filter((e) => e.type === 'money')
              .reduce((sum, e) => sum + e.delta, 0)
        );
      return true;
    })
    .map((a) => {
      const action = structuredClone(a);
      if (a.id === 'exam' && state.stats.english >= b.englishB1)
        action.effects = [
          {
            type: 'english',
            cefrLevel: state.stats.english >= b.englishB2 ? 'B2' : 'B1',
          },
        ];
      if (a.id === 'extend' && current) {
        const terms = extensionFor(current.route)!;
        action.effects = [{ type: 'money', delta: -terms.cost }];
        const { validFrom: _from, validTo: _to, ...episode } = current;
        void _from;
        void _to;
        action.effects.push({
          type: 'newEpisode',
          episode,
          durationMonths: terms.months,
          start: 'afterCurrent',
        });
      }
      if (a.id.startsWith('travel-')) {
        // A completed trip is recalled at return, so engine absences are elapsed,
        // rather than treating planned future days as already spent overseas.
        const from = addMonths(state.date, -Number(a.id.slice(7)));
        const days = (Date.parse(state.date) - Date.parse(from)) / dayMs;
        action.effects.push({ type: 'absence', startOffsetDays: -days, days });
      }
      return action;
    });
}
export function act(state: GameState, actionId: string): GameState {
  const action = actions(state).find((a) => a.id === actionId);
  if (!action) throw new Error(`Action is not available: ${actionId}`);
  if (action.id === 'assessment') return state;
  const next = structuredClone(state);
  next.actionsLeft -= action.cost ?? 1;
  const changed = applyEffects(next, action.effects);
  const endingLog = next.log.filter((e) => e.kind === 'ending');
  next.log = next.log.filter((e) => e.kind !== 'ending');
  next.log.push({
    year: state.year,
    quarter: state.quarter,
    kind: 'action',
    id: action.id,
    text: action.label,
    statDeltas: deltas(state, next),
  });
  next.log.push(...endingLog);
  if (action.id === 'extend') setFlags(next, ['visa-renewed']);
  if (action.id === 'overtime') setFlags(next, ['worked-overtime']);
  if (changed) recalculate(next);
  if (!isOver(next)) {
    if (action.id === 'mail') draw(next, 1);
    if (
      action.id === 'exam' &&
      (state.stats.english < b.englishB1 ||
        (state.timeline.english &&
          'cefrLevel' in state.timeline.english &&
          state.timeline.english.cefrLevel === 'B1' &&
          state.stats.english < b.englishB2))
    )
      next.eventQueue.unshift('system-exam-failed');
    pressure(next);
    nextEvent(next);
  } else award(next);
  return next;
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
  const changed = applyEffects(next, choice.effects);
  setFlags(next, choice.sets);
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
  if (!isOver(next)) {
    pressure(next);
    nextEvent(next);
  } else award(next);
  return next;
}
export function endQuarter(state: GameState): GameState {
  if (isOver(state)) return state;
  if (state.pendingEvent)
    throw new Error('Resolve the pending event before ending the quarter');
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
  applyEffects(next, [
    {
      type: 'money',
      delta:
        householdSalary / b.quartersPerYear -
        b.livingCosts +
        (b.householdCostContribution[state.characterId] ?? 0) +
        (state.flags.includes('cheap-housing') ? b.cheapHousingSaving : 0) -
        (state.year - 1) * b.livingCostAnnualIncrease -
        state.flags.filter((f) => f.startsWith('rent-rise-')).length *
          b.rentRisePerQuarter,
    },
    { type: 'stat', key: 'mood', delta: -b.moodDecay },
    { type: 'stat', key: 'english', delta: -b.englishDecay },
    { type: 'stat', key: 'career', delta: -b.careerDecay },
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
  if (current?.salary !== undefined) {
    for (const threshold of b.promotionThresholds) {
      const flag = `promotion-${threshold}`;
      if (next.stats.career >= threshold && !next.flags.includes(flag)) {
        syncSalary(next, Math.round(current.salary * b.promotionMultiplier));
        setFlags(next, [flag, 'promoted']);
      }
    }
  }
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
    next.quarter = ((state.quarter % 4) + 1) as GameState['quarter'];
    next.year =
      state.year + (completedQuarters % b.quartersPerYear === 0 ? 1 : 0);
    next.actionsLeft = b.actionsPerQuarter;
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
    nextEvent(next);
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
