import { evaluate } from '@uk-immigration/engine';
import { describe, expect, test } from 'vitest';
import {
  activities,
  buy,
  characters,
  cook,
  currentEvent,
  doActivity,
  eat,
  endQuarter,
  enter,
  fastForward,
  fish,
  gift,
  harvest,
  hearts,
  items,
  mailbox,
  newGame,
  npcAt,
  npcs,
  peopleAt,
  plant,
  readMail,
  recipes,
  resolve,
  shop,
  sleep,
  talk,
  tick,
  townsfolk,
  water,
} from '../src';
import type { Channel, GameEvent, GameState, Npc, PlaceId } from '../src';
import { balance as b } from '../src/balance';
import { commonEvents } from '../src/events/common';
import { heartEvents } from '../src/npcs';
import { clear, completeQuarter, drain, perform } from './helpers';

function delivery(state: GameState, channel: Channel, minute?: number) {
  const event = commonEvents.find((e) => e.id === 'common-boiler')!;
  return {
    ...clear(state),
    day: { ...state.day, deliveries: [{ eventId: event.id, channel, minute }] },
  };
}
function at(place: PlaceId, minute = 600, state = clear()) {
  return enter({ ...state, day: { ...state.day, minute } }, place);
}
function season(quarter: GameState['quarter'], date: string): GameState {
  const state = clear();
  state.quarter = quarter;
  state.date = date;
  return state;
}
const scheduled = (state: GameState) =>
  [
    state.pendingEvent,
    ...state.eventQueue,
    ...state.day.deliveries.map((d) => d.eventId),
  ].filter(Boolean) as string[];

describe('three days, calendar and clock', () => {
  test('wake at home; strict next Tuesday/Saturday and first February Saturday', () => {
    const state = clear(newGame('skilled-worker', 7));
    expect(state.day).toMatchObject({
      index: 0,
      kind: 'workday',
      date: '2025-01-28',
      minute: 420,
      place: 'home',
    });
    const weekend = sleep(state);
    expect(weekend.day).toMatchObject({
      index: 1,
      kind: 'weekend',
      date: '2025-02-01',
      minute: 420,
    });
    const special = sleep(weekend);
    expect(special.day).toMatchObject({
      index: 2,
      kind: 'special',
      date: '2025-04-12',
      festival: 'lunar-new-year',
    });
    expect(special.dayNumber).toBe(2);
    const next = sleep(special);
    expect(next.date).toBe('2025-04-15');
    expect(next.day.index).toBe(0);
    expect(next.dayNumber).toBe(3);
    expect(next.timeline.absences).toEqual([]);
    expect(state.dayNumber).toBe(0);
  });
  test.each([
    [2, '2025-04-15', '2025-05-05', 'may-day'],
    [3, '2025-07-15', '2025-08-30', 'summer-fair'],
    [4, '2025-10-15', '2025-11-05', 'bonfire-night'],
    [4, '2026-10-15', '2026-12-19', 'christmas-market'],
    [1, '2025-03-15', '2025-06-14', 'lunar-new-year'],
    [4, '2025-12-15', '2026-03-14', 'christmas-market'],
  ] as const)(
    'quarter %s, %s selects %s, %s',
    (quarter, date, expected, festival) => {
      const special = sleep(sleep(season(quarter, date)));
      expect(special.day.date).toBe(expected);
      expect(special.day.festival).toBe(festival);
    },
  );
  test('snow is winter-only; every weather can occur in winter', () => {
    const winter = new Set();
    for (let seed = 1; seed <= 100; seed++) {
      winter.add(newGame('skilled-worker', seed).day.weather);
      let state = clear(newGame('skilled-worker', seed));
      for (let q = 0; q < 3; q++) {
        state = clear(completeQuarter(state));
        expect(state.day.weather).not.toBe('snow');
      }
    }
    expect(winter).toEqual(new Set(['sunny', 'cloudy', 'rain', 'snow']));
  });
  test('every quarter keeps workday < weekend < festival inside its window', () => {
    for (let month = 0; month < 24; month++) {
      for (const day of [1, 15, 28]) {
        const anchor = new Date(Date.UTC(2024, month, day));
        let state = season(
          (Math.floor(anchor.getUTCMonth() / 3) + 1) as GameState['quarter'],
          anchor.toISOString().slice(0, 10),
        );
        state.day.index = 2;
        state.timeline.episodes[0].validFrom = '2020-01-01';
        state.timeline.episodes[0].validTo = '2040-01-01';
        state = clear(sleep(state));
        const work = state.day.date;
        const weekend = sleep(state);
        const special = sleep(weekend);
        expect(work < weekend.day.date).toBe(true);
        expect(weekend.day.date < special.day.date).toBe(true);
        const end = new Date(state.date);
        end.setUTCMonth(end.getUTCMonth() + 3);
        expect(special.day.date < end.toISOString().slice(0, 10)).toBe(true);
      }
    }
  });
  test('hours, workdays, once-per-day and pending lock actual actions', () => {
    let state = at('visa', 479);
    expect(activities(state, 'visa')).toEqual([]);
    state = tick(state, 1);
    expect(activities(state, 'council').map((a) => a.id)).toContain(
      'assessment',
    );
    const worked = doActivity(at('work', 540), 'work');
    expect(worked.day.minute).toBe(1020);
    expect(worked.stats.money).toBe(state.stats.money + b.workMoney);
    expect(activities(worked, 'work').map((a) => a.id)).not.toContain('work');
    const weekend = sleep(clear(worked));
    expect(activities(weekend, 'work')).toEqual([]);
    expect(activities(weekend, 'gp')).toEqual([]);
    const pending = { ...worked, pendingEvent: characters[0].events[0].id };
    expect(activities(pending, 'work')).toEqual([]);
    expect(activities(pending, 'council').map((a) => a.id)).toEqual([
      'assessment',
    ]);
    expect(doActivity(pending, 'assessment')).toBe(pending);
    expect(sleep(pending)).toBe(pending);
    expect(fastForward(pending)).toBe(pending);
    expect(() => talk(pending, 'ade')).toThrow();
    expect(() => gift(pending, 'ade', 'tea')).toThrow();
  });
  test('midnight caps time, sends home, applies penalty once and sleeps after leftovers', () => {
    const state = delivery(at('pond', 1430), 'letter');
    const midnight = tick(state, 1000);
    expect(midnight.day.minute).toBe(1440);
    expect(midnight.day.place).toBe('home');
    expect(midnight.pendingEvent).toBeDefined();
    expect(midnight.stats.mood).toBe(state.stats.mood + b.midnightMood);
    const next = resolve(midnight, currentEvent(midnight)!.choices[0].id);
    expect(next.day.minute).toBe(420);
    expect(next.day.index).toBe(1);
    expect(next.dayNumber).toBe(1);
    expect(
      tick(clear(), Number.MAX_SAFE_INTEGER).day.minute,
    ).toBeLessThanOrEqual(1440);
  });
  test('sleeping early helps health; late bedtime lowers mood', () => {
    const state = clear();
    expect(sleep(state).stats.health).toBe(
      state.stats.health + b.earlySleepHealth,
    );
    expect(sleep(at('home', 1400, state)).stats.mood).toBe(
      state.stats.mood + b.lateSleepMood,
    );
  });
});

describe('delivery and resumable default routine', () => {
  test('mail waits, phone rings at due minute, place waits for entrance, NPC waits for talk', () => {
    const original = clear();
    let state = delivery(original, 'letter');
    expect(mailbox(state)).toHaveLength(1);
    expect(tick(state, 1).pendingEvent).toBeUndefined();
    const letter = readMail(state);
    expect(letter.pendingEvent).toBeDefined();
    expect(mailbox(letter)).toEqual([]);
    expect(mailbox(state)).toHaveLength(1);
    state = delivery(original, 'phone', 800);
    expect(tick(state, 379).pendingEvent).toBeUndefined();
    expect(tick(state, 380).pendingEvent).toBeDefined();
    state = delivery(original, 'place:library');
    expect(enter(state, 'cafe').pendingEvent).toBeUndefined();
    expect(enter(tick(state, 120), 'library').pendingEvent).toBeDefined();
    state = delivery(original, 'npc:ade');
    expect(talk(state, 'helen').pendingEvent).toBeUndefined();
    expect(talk(state, 'ade').pendingEvent).toBeDefined();
  });
  test('phone interrupts walking and long activities at the due minute, then the remaining time resumes', () => {
    const walking = tick(delivery(clear(), 'phone', 800), 900);
    expect(walking.day.minute).toBe(800);
    expect(walking.day.resumeMinute).toBe(1320);
    expect(
      resolve(walking, currentEvent(walking)!.choices[0].id).day.minute,
    ).toBe(1320);
    const before = delivery(at('work', 540), 'phone', 800);
    const working = doActivity(before, 'work');
    expect(working.day.minute).toBe(800);
    expect(working.day.resumeMinute).toBe(1020);
    expect(working.stats.money).toBe(before.stats.money + b.workMoney);
    const after = resolve(working, currentEvent(working)!.choices[0].id);
    expect(after.day.minute).toBe(1020);
    expect(after.day.resumeMinute).toBeUndefined();
    expect(after.stats.money).toBe(working.stats.money);
  });
  test('leftovers appear one by one before the day changes', () => {
    const state = clear();
    const ids = commonEvents
      .filter(
        (e) =>
          !e.requires?.length &&
          !e.when?.length &&
          !e.season &&
          !state.firedEvents.includes(e.id),
      )
      .slice(0, 2)
      .map((e) => e.id);
    state.day.deliveries = ids.map((eventId) => ({
      eventId,
      channel: 'letter',
    }));
    expect(ids).toHaveLength(2);
    const first = sleep(state);
    expect(first.pendingEvent).toBe(ids[0]);
    expect(first.dayNumber).toBe(0);
    const answered = resolve(first, currentEvent(first)!.choices[0].id);
    expect(answered.day.index).toBe(0);
    const second = sleep(answered);
    expect(second.pendingEvent).toBe(ids[1]);
    expect(
      sleep(resolve(second, currentEvent(second)!.choices[0].id)).day.index,
    ).toBe(1);
  });
  test('drawn cards are processed or returned before quarter boundary; scheduled count remains one or two', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const state = newGame('skilled-worker', seed);
      const ids = scheduled(state);
      expect(ids.length).toBeGreaterThanOrEqual(1);
      expect(ids.length).toBeLessThanOrEqual(2);
      const after = completeQuarter(state);
      expect(after.dayNumber).toBe(3);
      expect(after.date).toBe('2025-04-15');
      expect(after.day).toMatchObject({ index: 0, minute: 420, place: 'home' });
    }
  });
  test('fast-forward stops at pending, resumes without repeating work, and never handles legal paperwork', () => {
    const before = delivery(clear(), 'phone', 800);
    const first = fastForward(before);
    expect(first.pendingEvent).toBeDefined();
    expect(first.day.done).toContain('work');
    const after = completeQuarter(first);
    expect(after.log.filter((e) => e.id === 'work')).toHaveLength(1);
    expect(
      after.log
        .filter((e) => e.kind === 'action')
        .every((e) =>
          [
            'work',
            'class',
            'relax',
            'rest',
            'nap',
            'bench',
            'festival',
          ].includes(e.id),
        ),
    ).toBe(true);
    expect(after.timeline.episodes).toEqual(before.timeline.episodes);
    expect(after.timeline.english).toEqual(before.timeline.english);
    expect(after.timeline.absences).toEqual([]);
    expect(() =>
      endQuarter({ ...before, pendingEvent: characters[0].events[0].id }),
    ).toThrow();
    expect(() => endQuarter(clear())).toThrow();
  });
  test('all new condition/effect variants drive activity availability and event effects', () => {
    const event: GameEvent = {
      id: 'test-new',
      weight: 1,
      title: { zhCN: '新条件', en: 'Conditions' },
      text: { zhCN: '测试。', en: 'Test.' },
      choices: [
        {
          id: 'ok',
          label: { zhCN: '继续', en: 'Continue' },
          effects: [
            { type: 'item', item: 'tea', delta: 2 },
            { type: 'friendship', npc: 'ade', delta: 1500 },
          ],
        },
      ],
    };
    characters[0].events.push(event);
    try {
      const next = resolve({ ...clear(), pendingEvent: event.id }, 'ok');
      expect(next.inventory.tea).toBe(2);
      expect(hearts(next, 'ade')).toBe(10);
    } finally {
      characters[0].events.pop();
    }
  });
});

describe('actual travel, interrupted travel and financial boundaries', () => {
  test('abroad only phone calls arrive; morning cards do not happen; face-to-face cards and letters wait for the first day home', () => {
    const channels: Channel[] = [
      'morning',
      'phone',
      'place:home',
      'npc:ade',
      'letter',
    ];
    const fixtures: GameEvent[] = channels.map((channel, i) => ({
      id: `trip-fixture-${i}`,
      channel,
      weight: 0,
      once: true,
      title: { zhCN: '旅途', en: 'Journey' },
      text: { zhCN: '旅途消息。', en: 'News on a journey.' },
      choices: [
        { id: 'ok', label: { zhCN: '记下', en: 'Note it' }, effects: [] },
      ],
    }));
    commonEvents.push(...fixtures);
    try {
      const before = clear();
      before.day.deliveries = fixtures.map((e) => ({
        eventId: e.id,
        channel: e.channel!,
        minute: 800,
      }));
      let state = perform(before, 'travel-3');
      const delivered: string[] = [];
      for (let i = 0; state.trip; i++) {
        expect(i).toBeLessThan(30);
        const event = currentEvent(state)!;
        expect(event).toBeDefined();
        expect(
          event.id.startsWith('system-') || event.channel === 'phone',
        ).toBe(true);
        expect(mailbox(state)).toEqual([]);
        delivered.push(event.id);
        state = resolve(JSON.parse(JSON.stringify(state)), event.choices[0].id);
      }
      expect(delivered).toContain('trip-fixture-1');
      expect(delivered).not.toContain('trip-fixture-0');
      expect(state.firedEvents).not.toContain('trip-fixture-0');
      expect(state.day.index).toBe(0);
      expect(mailbox(state)).toContain('trip-fixture-4');
      expect(scheduled(state)).toEqual(
        expect.arrayContaining(['trip-fixture-2', 'trip-fixture-3']),
      );
      expect(state.firedEvents).not.toContain('trip-fixture-4');
      expect(state.pendingEvent).not.toBe('trip-fixture-2');
      state = drain(state);
      state = enter(enter(state, 'green'), 'home');
      expect(state.pendingEvent).toBe('trip-fixture-2');
      state = drain(resolve(state, 'ok'));
      state = talk(state, 'ade');
      expect(state.pendingEvent).toBe('trip-fixture-3');
      state = drain(resolve(state, 'ok'));
      expect(readMail(state).pendingEvent).toBe('trip-fixture-4');
    } finally {
      commonEvents.splice(
        commonEvents.length - fixtures.length,
        fixtures.length,
      );
    }
  });
  test.each([
    [1, '2025-02-28', '2025-04-15', 1],
    [3, '2025-04-28', '2025-07-15', 2],
    [6, '2025-07-28', '2025-10-15', 3],
  ] as const)(
    '%s-month journey records actual dates only on the first quarter start after return',
    (months, to, date, quarters) => {
      const before = clear();
      let state = perform(before, `travel-${months}`);
      let limit = 0;
      while (state.trip) {
        expect(state.timeline.absences.every((a) => a.to <= state.date)).toBe(
          true,
        );
        state = currentEvent(state)
          ? resolve(state, currentEvent(state)!.choices[0].id)
          : sleep(state);
        if (++limit > 50) throw new Error('Journey loop');
      }
      expect(state.date).toBe(date);
      expect(state.timeline.absences).toContainEqual({
        from: before.day.date,
        to,
      });
      expect(state.timeline.absences.every((a) => a.to <= state.date)).toBe(
        true,
      );
      expect(state.dayNumber).toBe(quarters * 3);
      expect(state.log.filter((e) => e.kind === 'quarter')).toHaveLength(
        quarters,
      );
      expect(state.stats.money).not.toBe(
        before.stats.money - b.travelCostPerMonth * months,
      );
      expect(state.result).toEqual(
        evaluate({
          timeline: state.timeline,
          simulationDate: state.date,
          locale: state.locale,
        }),
      );
    },
  );
  test('a returned trip is recorded before an expiry ending at the same quarter boundary', () => {
    const before = clear();
    before.date = '2026-10-15';
    before.quarter = 4;
    before.day.date = '2026-10-28';
    before.timeline.episodes[0].validTo = '2027-01-14';
    const after = perform(before, 'travel-1');
    expect(after.date).toBe('2027-01-15');
    expect(after.ending).toBe('overstayed');
    expect(after.timeline.absences).toContainEqual({
      from: '2026-10-28',
      to: '2026-11-28',
    });
    expect(after.trip).toBeUndefined();
  });
  test('pending preserves serialized travel intention and absences stay elapsed after restore', () => {
    const before = delivery(clear(), 'phone', 800);
    const travelling = perform(before, 'travel-3');
    expect(travelling.pendingEvent).toBeDefined();
    expect(travelling.trip).toEqual({
      from: before.day.date,
      to: '2025-04-28',
    });
    expect(travelling.timeline.absences).toEqual([]);
    const restored = JSON.parse(JSON.stringify(travelling));
    const choice = currentEvent(travelling)!.choices[0].id;
    expect(resolve(restored, choice)).toEqual(resolve(travelling, choice));
  });
  test('trips beyond current permission are not offered; exact return at expiry is allowed', () => {
    const state = at('station');
    state.timeline.episodes[0].validTo = '2025-04-27';
    expect(activities(state, 'station').map((a) => a.id)).toContain('travel-1');
    expect(activities(state, 'station').map((a) => a.id)).not.toContain(
      'travel-3',
    );
    state.timeline.episodes[0].validTo = '2025-04-28';
    expect(activities(state, 'station').map((a) => a.id)).toContain('travel-3');
  });
});

describe('townspeople, hearts, dialogue and gifts', () => {
  test('eight residents and four household members have short bilingual lines, five heart scenes and valid schedules', () => {
    expect(npcs).toHaveLength(12);
    for (const npc of npcs) {
      expect(npc.lines.length).toBeGreaterThanOrEqual(npc.characters ? 55 : 40);
      for (const line of npc.lines) {
        expect(line.text.zhCN.length, line.id).toBeLessThanOrEqual(40);
        expect(line.text.en.trim()).not.toBe('');
      }
      expect(new Set(npc.lines.map((l) => l.id)).size).toBe(npc.lines.length);
      for (const rule of npc.schedule)
        expect(rule.stops.map((s) => s.from)).toEqual(
          [...rule.stops.map((s) => s.from)].sort((a, b) => a - b),
        );
    }
    expect(heartEvents).toHaveLength(60);
    for (const event of heartEvents) {
      expect(event.choices.length).toBeGreaterThanOrEqual(2);
      expect(event.choices.length).toBeLessThanOrEqual(3);
      expect(
        event.choices.every((choice) =>
          choice.effects.every((effect) =>
            ['stat', 'friendship', 'none'].includes(effect.type),
          ),
        ),
      ).toBe(true);
    }
    const household: Npc = {
      ...npcs[0],
      id: 'test-household',
      characters: ['family-partner'],
    };
    npcs.push(household);
    try {
      expect(townsfolk(clear()).map((n) => n.id)).not.toContain(household.id);
      expect(
        townsfolk(clear(newGame('family-partner', 1))).map((n) => n.id),
      ).toContain(household.id);
    } finally {
      npcs.pop();
    }
  });
  test('festival overrides rain, weekday and weekend; peopleAt reports building occupants', () => {
    let state = at('work', 600);
    state.day.weather = 'sunny';
    expect(npcAt(state, 'ade')).toBe('work');
    expect(peopleAt(state, 'work')).toContain('ade');
    state = sleep(state);
    state.day.minute = 600;
    state.day.weather = 'sunny';
    expect(npcAt(state, 'ade')).toBe('pond');
    state.day.weather = 'rain';
    expect(npcAt(state, 'margaret')).toBe('cafe');
    state.day.kind = 'special';
    state.day.festival = 'bonfire-night';
    expect(npcAt(state, 'ade')).toBe('green-stall');
  });
  test('first daily talk raises friendship once, prefers unheard lines, and never mutates input', () => {
    const before = at('cafe');
    const copy = structuredClone(before);
    const first = talk(before, 'margaret');
    expect(first.friendship.margaret).toBe(b.talkFriendship);
    expect(first.outcome?.text).toBeDefined();
    const second = talk(first, 'margaret');
    expect(second.friendship.margaret).toBe(b.talkFriendship);
    expect(second.heard).toHaveLength(2);
    expect(before).toEqual(copy);
    const tomorrow = talk(sleep(second), 'margaret');
    expect(tomorrow.friendship.margaret).toBe(b.talkFriendship * 2);
  });
  test('once-lines never repeat; conditions filter by hearts, season, weather, date type and flags', () => {
    const person = npcs[0];
    const old = person.lines;
    person.lines = [
      {
        id: 'only',
        text: { zhCN: '只说一次。', en: 'Just once.' },
        once: true,
        heartsMin: 2,
        heartsMax: 4,
        season: 1,
        weather: ['rain'],
        dayKinds: ['workday'],
        requires: ['ready'],
        forbids: ['stop'],
        when: [
          { minuteMin: 500, minuteMax: 800 },
          { npc: 'ade', heartsMin: 1 },
          { item: 'tea', min: 1 },
          { dayKind: 'workday' },
          { weather: 'rain' },
        ],
      },
      { id: 'fallback', text: { zhCN: '早。', en: 'Morning.' } },
    ];
    try {
      const state = at('home');
      state.friendship = { margaret: 200, ade: 100 };
      state.flags = ['ready'];
      state.inventory.tea = 1;
      state.day.weather = 'rain';
      state.heard = ['fallback'];
      state.firedEvents = heartEvents.map((e) => e.id);
      const first = talk(state, 'margaret');
      expect(first.outcome?.text?.en).toBe('Just once.');
      expect(talk(first, 'margaret').outcome?.text?.en).toBe('Morning.');
      expect(
        talk({ ...state, flags: ['stop'] }, 'margaret').outcome?.text?.en,
      ).toBe('Morning.');
    } finally {
      person.lines = old;
    }
  });
  test.each(['loved', 'liked', 'neutral', 'disliked'] as const)(
    '%s gifts use one item, change points and respond once per day',
    (liking) => {
      const state = clear();
      const item = liking === 'neutral' ? 'perch' : npcs[0].gifts[liking][0];
      state.inventory[item] = 2;
      state.friendship.margaret = 200;
      const after = gift(state, 'margaret', item);
      expect(after.inventory[item]).toBe(1);
      expect(after.friendship.margaret).toBe(200 + b.gifts[liking]);
      expect(after.outcome?.text).toEqual(npcs[0].reactions[liking]);
      expect(() => gift(after, 'margaret', item)).toThrow();
      expect(state.inventory[item]).toBe(2);
    },
  );
  test('friendship clamps, unseen quarterly decay and all heart thresholds fire once', () => {
    let state = clear();
    state.inventory['old-boot'] = 1;
    expect(gift(state, 'margaret', 'old-boot').friendship.margaret).toBe(0);
    state.friendship = { margaret: 1000, ade: 100 };
    state.inventory.tulip = 1;
    expect(gift(state, 'margaret', 'tulip').friendship.margaret).toBe(1000);
    const talked = talk(state, 'ade');
    const ended = completeQuarter(talked);
    expect(ended.friendship.margaret).toBe(1000 - b.unseenDecay);
    expect(ended.friendship.ade).toBe(
      100 + b.talkFriendship + b.festivalFriendship,
    );
    for (const npc of ['margaret', 'ade', 'helen']) {
      state = clear();
      for (const threshold of [2, 4, 6, 8, 10]) {
        const event = heartEvents.find(
          (e) => e.id === `heart-${npc}-${threshold}`,
        )!;
        state.friendship[npc] = threshold * 100 - b.talkFriendship;
        state.day.talked = [];
        state.flags.push(...(event.requires ?? []));
        state.day.minute = Math.max(
          600,
          ...(event.when ?? []).map((c) =>
            'minuteMin' in c ? (c.minuteMin ?? 0) : 0,
          ),
        );
        for (const c of event.when ?? []) {
          if ('dayKind' in c) state.day.kind = c.dayKind;
          if ('flag' in c) state.flags.push(c.flag);
        }
        state = talk(state, npc);
        expect(currentEvent(state)?.id).toBe(`heart-${npc}-${threshold}`);
        state = resolve(state, event.choices[0].id);
        expect(talk(state, npc).pendingEvent).toBeUndefined();
      }
      expect(
        state.firedEvents.filter((id) => id.startsWith(`heart-${npc}`)),
      ).toHaveLength(5);
    }
  });
});

describe('items, allotment, cooking, fishing and festival', () => {
  test('seasonal shop purchases have observable cost and quantity; no sell API', () => {
    const state = at('shop');
    expect(shop(state, 'shop').map((i) => i.id)).toContain('seed-turnip');
    expect(shop(state, 'shop').map((i) => i.id)).not.toContain('seed-tomato');
    const after = buy(state, 'seed-turnip', 2);
    expect(after.inventory['seed-turnip']).toBe(2);
    expect(after.stats.money).toBe(
      state.stats.money - items.find((i) => i.id === 'seed-turnip')!.price! * 2,
    );
    expect(() => buy(state, 'tea', -1)).toThrow();
    expect(() => buy(at('home'), 'tea', 1)).toThrow();
  });
  test('six plots, seasonal planting, watered/dry/rain growth, harvest quantity, and seasonal withering', () => {
    let state = doActivity(at('allotment'), 'rent-plot');
    expect(state.plots).toHaveLength(6);
    state.inventory = { 'seed-turnip': 3, 'seed-tomato': 1 };
    expect(() => plant(state, 0, 'seed-tomato')).toThrow();
    state = plant(state, 0, 'seed-turnip');
    state = plant(state, 1, 'seed-turnip');
    expect(() => harvest(state, 0)).toThrow();
    state = water(state, 0);
    expect(() => water(state, 0)).toThrow();
    state.day.weather = 'sunny';
    state = sleep(state);
    expect(state.plots.map((p) => p.growth).slice(0, 2)).toEqual([2, 1]);
    state.day.weather = 'rain';
    state = sleep(state);
    expect(state.plots.map((p) => p.growth).slice(0, 2)).toEqual([4, 3]);
    const harvested = harvest(at('allotment', 600, state), 0);
    expect(harvested.inventory.turnip).toBeGreaterThanOrEqual(1);
    expect(harvested.inventory.turnip).toBeLessThanOrEqual(3);
    expect(harvested.plots[0]).toEqual({ growth: 0 });
    const next = sleep(harvested);
    expect(next.plots.every((p) => !p.seed && p.growth === 0)).toBe(true);
  });
  test('late actions require their full duration and leave input untouched when time is insufficient', () => {
    const state = at('pond', 1430);
    state.inventory.potato = 1;
    const copy = structuredClone(state);
    expect(() => fish(state, false)).toThrow();
    expect(state).toEqual(copy);
    expect(() => cook(at('home', 1430, state), 'baked-potato')).toThrow();
    expect(shop(at('shop', 1199), 'shop')).toEqual([]);
  });
  test('annual rent is charged after four quarters of tenancy, including a fourth-quarter rental', () => {
    const before = clear();
    for (let index = 0; index < 3; index++)
      before.log.push({
        year: 1,
        quarter: 1,
        kind: 'quarter',
        id: 'quarter',
        text: { zhCN: '一季', en: 'A quarter' },
      });
    before.quarter = 4;
    before.date = '2025-10-15';
    let rented = doActivity(at('allotment', 600, before), 'rent-plot');
    for (let elapsed = 1; elapsed <= 4; elapsed++) {
      const comparison = clear(rented);
      comparison.log = comparison.log.filter((e) => e.id !== 'rent-plot');
      const withoutRent = sleep({
        ...comparison,
        day: { ...comparison.day, index: 2 },
      });
      rented = clear(
        sleep({ ...clear(rented), day: { ...rented.day, index: 2 } }),
      );
      expect(rented.stats.money - withoutRent.stats.money).toBe(
        elapsed === 4 ? -b.plotAnnualRent : 0,
      );
    }
  });
  test('fast-forward grows plots even when phone or letter interrupts the routine', () => {
    let state = clear();
    state.plots = [{ seed: 'seed-turnip', growth: 0 }];
    state.day.weather = 'sunny';
    state = sleep(state);
    expect(state.plots[0].growth).toBe(1);
    state = delivery(state, 'letter');
    state = fastForward(state);
    expect(state.pendingEvent).toBeDefined();
    expect(state.plots[0].growth).toBe(1);
  });
  test('fishing failure spends thirty minutes, success adds a deterministic seasonal catch or junk', () => {
    const state = at('pond');
    const missed = fish(state, false);
    expect(missed.day.minute).toBe(state.day.minute + 30);
    expect(missed.inventory).toEqual(state.inventory);
    const caught = fish(state, true);
    expect(caught.day.minute).toBe(state.day.minute + 30);
    expect(Object.values(caught.inventory).reduce((a, n) => a + n, 0)).toBe(1);
    expect(fish(JSON.parse(JSON.stringify(state)), true)).toEqual(caught);
    expect(
      items.find((i) => i.id === Object.keys(caught.inventory)[0])?.kind,
    ).toMatch(/fish|junk/);
  });
  test('cooking consumes ingredients, eating consumes the dish and restores health/mood', () => {
    expect(recipes.length).toBeGreaterThanOrEqual(3);
    const state = at('home');
    state.inventory.potato = 2;
    const cooked = cook(state, 'baked-potato');
    expect(cooked.inventory).toMatchObject({ potato: 1, 'baked-potato': 1 });
    expect(cooked.day.minute).toBe(state.day.minute + b.recipeMinutes);
    const eaten = eat(cooked, 'baked-potato');
    expect(eaten.inventory['baked-potato']).toBe(0);
    expect(eaten.stats.health).toBe(cooked.stats.health + b.food.mealHealth);
    expect(eaten.stats.mood).toBe(cooked.stats.mood + b.food.mealMood);
    expect(() => cook(state, 'salad')).toThrow();
    expect(() => eat(state, 'old-boot')).toThrow();
  });
  test('bonfire activity, stall food, festival schedules and friendship bonus are available on the special day', () => {
    const state = at('green', 1080, sleep(sleep(season(4, '2025-10-15'))));
    expect(state.day.festival).toBe('bonfire-night');
    expect(shop(state, 'green').map((i) => i.id)).toEqual(['bonfire-toffee']);
    const after = doActivity(buy(state, 'bonfire-toffee', 1), 'festival');
    expect(after.friendship.ade).toBe(b.festivalFriendship);
    expect(after.stats.mood).toBe(state.stats.mood + b.festivalMood);
    expect(peopleAt(after, 'green')).toHaveLength(9);
  });
});
