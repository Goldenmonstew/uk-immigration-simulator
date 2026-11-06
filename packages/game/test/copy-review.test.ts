import { describe, expect, test } from 'vitest';
import {
  activities,
  characters,
  doActivity,
  enter,
  gift,
  newGame,
  npcs,
  resolve,
  sleep,
  talk,
} from '../src';
import type { Condition, GameState, Npc } from '../src';
import { balance as b } from '../src/balance';
import { commonEvents } from '../src/events/common';
import { heartEvents } from '../src/npcs';
import { clear } from './helpers';

type Line = Npc['lines'][number];
const gates: Record<string, Partial<Line>> = {};
function add(ids: string[], gate: Partial<Line>) {
  for (const id of ids) gates[id] = { ...gates[id], ...gate };
}
add(['priya-4'], { dayKinds: ['weekend'] });
add(['ade-21'], { dayKinds: ['weekend', 'special'] });
add(['margaret-1', 'ade-1', 'helen-1', 'ka-ning-partner-daily-1'], {
  when: [{ minuteMax: 720 }],
});
add(
  [
    'ade-1',
    'ade-2',
    'ade-3',
    'ade-5',
    'ade-7',
    'ade-8',
    'ade-10',
    'priya-1',
    'priya-2',
    'priya-3',
    'priya-5',
    'priya-daily-1',
    'priya-daily-2',
    'priya-daily-3',
    'priya-daily-5',
    'priya-daily-6',
    'priya-daily-8',
    'priya-daily-16',
  ],
  { dayKinds: ['workday'] },
);
add(
  [
    'priya-5',
    'rahman-2',
    'dave-5',
    'helen-9',
    'margaret-25',
    'gareth-daily-8',
    'jamie-daily-10',
  ],
  { weather: ['rain'] },
);
add(['ade-10'], { weather: ['sunny'] });
add(['ade-10', 'ade-24'], { when: [{ minuteMin: 720, minuteMax: 840 }] });
add(['helen-36'], { when: [{ minuteMin: b.eveningClass }] });
add(['jamie-daily-5', 'jamie-daily-10'], { when: [{ minuteMin: 1020 }] });
add(['priya-daily-25'], { dayKinds: ['weekend'], heartsMin: 2 });
add(['lina-4'], { heartsMin: 2 });
add(['priya-daily-34', 'rahman-daily-35', 'lina-daily-35'], { heartsMin: 4 });
add(['gareth-daily-21'], { requires: ['friend-gareth'] });
add(['rahman-daily-22'], { requires: ['friend-rahman'] });
add(['gareth-daily-31'], { season: 1 });
add(['priya-daily-28', 'dave-daily-28', 'gareth-daily-28', 'rahman-daily-28'], {
  when: [{ visaMonthsLeftMax: b.renewalWindowMonths }],
});
add(['ka-ning-partner-daily-25'], { dayKinds: ['weekend', 'special'] });
add(['ka-ning-partner-daily-26', 'ka-ning-partner-daily-28'], {
  forbids: ['bno-partner-between-jobs'],
});
add(['ka-ning-partner-daily-26'], { once: true });
add(['ka-ning-partner-daily-27'], { forbids: ['bno-partner-restarted'] });
add(['jamie-daily-26'], { forbids: ['family-jamie-reemployed'] });
add(['ka-ning-child-daily-27'], { season: 4 });
add(['ka-ning-child-daily-28'], { season: 3 });
for (const [npc, minuteMin] of [
  ['jamie', 1020],
  ['ka-ning-partner', 1020],
  ['ka-ning-child', 930],
] as const)
  add(
    Array.from({ length: 6 }, (_, i) => `${npc}-daily-${31 + i}`),
    { dayKinds: ['workday'], when: [{ minuteMin }] },
  );
add(['jamie-daily-37', 'jamie-daily-38'], {
  requires: ['family-jamie-unemployed'],
  forbids: ['family-jamie-reemployed', 'family-pip-applied'],
});
add(['ka-ning-partner-daily-37', 'ka-ning-partner-daily-38'], {
  requires: ['bno-partner-between-jobs'],
  forbids: ['bno-partner-restarted'],
});
for (const npc of npcs)
  for (const line of npc.lines)
    if (line.festival === 'bonfire-night')
      add([line.id], { when: [{ minuteMin: b.bonfireStart }] });
add(['helen-festival-christmas-market'], { when: [{ minuteMin: 960 }] });

function satisfy(state: GameState, when: Condition[] = []) {
  for (const c of when) {
    if ('minuteMin' in c) state.day.minute = c.minuteMin ?? state.day.minute;
    if ('minuteMax' in c)
      state.day.minute = Math.min(state.day.minute, c.minuteMax ?? 1440);
    if ('dayKind' in c) state.day.kind = c.dayKind;
    if ('weather' in c) state.day.weather = c.weather;
    if ('visaMonthsLeftMax' in c)
      state.timeline.episodes[0].validTo = state.date;
  }
}
function violations(gate: Partial<Line>): ((s: GameState) => void)[] {
  const changes: ((s: GameState) => void)[] = [];
  if (gate.dayKinds)
    changes.push((s) => {
      s.day.kind = (['workday', 'weekend', 'special'] as const).find(
        (k) => !gate.dayKinds!.includes(k),
      )!;
    });
  if (gate.weather)
    changes.push((s) => {
      s.day.weather = gate.weather!.includes('sunny') ? 'rain' : 'sunny';
    });
  if (gate.season)
    changes.push((s) => {
      s.quarter = gate.season === 1 ? 3 : 1;
    });
  if (gate.heartsMin)
    changes.push((s) => {
      s.friendship = {};
    });
  if (gate.requires)
    changes.push((s) => {
      s.flags = [];
    });
  if (gate.forbids)
    changes.push((s) => {
      s.flags.push(...gate.forbids!);
    });
  if (gate.once)
    changes.push((s) => {
      s.heard.push(...Object.keys(gates).filter((id) => gates[id].once));
    });
  for (const c of gate.when ?? []) {
    if ('minuteMin' in c)
      changes.push((s) => {
        s.day.minute = c.minuteMin! - 1;
      });
    if ('minuteMax' in c)
      changes.push((s) => {
        s.day.minute = c.minuteMax! + 1;
      });
    if ('visaMonthsLeftMax' in c)
      changes.push((s) => {
        s.timeline.episodes[0].validTo = '2040-01-01';
      });
  }
  return changes;
}

describe('reviewed dialogue gates', () => {
  test.each(Object.entries(gates))(
    '%s speaks only in its reviewed context',
    (id, gate) => {
      const person = npcs.find((npc) => npc.lines.some((l) => l.id === id))!;
      const line = person.lines.find((l) => l.id === id)!;
      expect(line).toMatchObject(gate);
      const before = clear(
        newGame(person.characters?.[0] ?? 'skilled-worker', 1),
      );
      before.firedEvents = heartEvents.map((e) => e.id);
      before.heard = ['review-fallback'];
      before.day.minute = 600;
      before.quarter = line.season ?? before.quarter;
      before.day.kind = line.dayKinds?.[0] ?? 'workday';
      before.day.weather = line.weather?.[0] ?? 'sunny';
      before.day.festival = line.festival;
      before.friendship[person.id] = (line.heartsMin ?? 0) * 100;
      before.flags = [...(line.requires ?? [])];
      satisfy(before, line.when);
      const original = person.lines;
      person.lines = [
        line,
        { id: 'review-fallback', text: { zhCN: '你好。', en: 'Hello.' } },
      ];
      try {
        expect(talk(before, person.id).outcome?.text).toEqual(line.text);
        for (const violate of violations(gate)) {
          const wrong = structuredClone(before);
          violate(wrong);
          expect(talk(wrong, person.id).outcome?.text?.en).toBe('Hello.');
        }
      } finally {
        person.lines = original;
      }
    },
  );
  test('Rahman’s first winter is independent of the renewal window', () => {
    expect(
      npcs
        .find((n) => n.id === 'rahman')!
        .lines.find((l) => l.id === 'rahman-daily-27')!.when,
    ).toBeUndefined();
  });
});

const heartGates: Record<string, { when?: Condition[]; requires?: string[] }> =
  {
    'heart-ade-2': { when: [{ dayKind: 'workday' }] },
    'heart-ade-4': {
      when: [{ dayKind: 'workday' }, { minuteMin: 720, minuteMax: 840 }],
    },
    'heart-priya-4': { when: [{ minuteMin: 1020 }] },
    'heart-dave-2': {
      when: [{ dayKind: 'weekend' }, { minuteMin: b.quizStart }],
    },
    'heart-dave-6': { when: [{ minuteMin: 1380 }] },
    'heart-rahman-8': { when: [{ minuteMin: 1200 }] },
    'heart-gareth-4': { when: [{ minuteMin: 1080 }] },
    'heart-helen-8': { when: [{ minuteMin: 720, minuteMax: 1080 }] },
    'heart-ka-ning-partner-2': { requires: ['bno-partner-cv-seen'] },
    'heart-ka-ning-partner-6': { when: [{ minuteMin: 1200 }] },
  };
test.each(Object.entries(heartGates))(
  '%s respects its scene time or predecessor',
  (id, gate) => {
    const event = heartEvents.find((e) => e.id === id)!;
    expect(event).toMatchObject(gate);
    const npc = event.heart!.npc;
    const person = npcs.find((n) => n.id === npc)!;
    const state = clear(newGame(person.characters?.[0] ?? 'skilled-worker', 1));
    state.friendship[npc] = event.heart!.hearts * 100;
    state.flags = [...(gate.requires ?? [])];
    state.day.minute = 600;
    satisfy(state, gate.when);
    state.firedEvents = heartEvents.filter((e) => e !== event).map((e) => e.id);
    expect(talk(state, npc).pendingEvent).toBe(id);
    const wrongStates = violations({
      requires: gate.requires,
      when: gate.when,
    });
    for (const c of gate.when ?? [])
      if ('dayKind' in c)
        wrongStates.push((s) => {
          s.day.kind = c.dayKind === 'weekend' ? 'workday' : 'weekend';
        });
    for (const wrong of wrongStates) {
      const before = structuredClone(state);
      wrong(before);
      expect(talk(before, npc).pendingEvent).toBeUndefined();
    }
  },
);

test('rain-bound old cards are drawn and delivered only on rainy days', () => {
  const ids = [
    'common-rain',
    'common-gutter-rain',
    'sw-review',
    'sw-first-rain',
    'family-rain-bus',
    'bno-partner-umbrella',
  ];
  for (const id of ids) {
    const owner =
      characters.find((c) => c.events.some((e) => e.id === id)) ??
      characters[0];
    const event = [...commonEvents, ...owner.events].find((e) => e.id === id)!;
    expect(event.when).toContainEqual({ weather: 'rain' });
    const state = clear(newGame(owner.id, 1));
    state.flags = [...(event.requires ?? [])];
    state.quarter = event.season ?? state.quarter;
    state.year = 5;
    state.day.minute = 600;
    state.day.place = 'green';
    state.day.deliveries = [
      { eventId: id, channel: event.channel ?? 'morning' },
    ];
    state.day.weather = 'sunny';
    expect(sleep(state).firedEvents).not.toContain(id);
    state.day.weather = 'rain';
    const after = sleep(state);
    expect(after.pendingEvent, id).toBe(id);
    expect(after.day.weather).toBe('rain');
  }
});

test('season-only cards use the reviewed quarter; early NHS text and closed café use morning', () => {
  expect(commonEvents.find((e) => e.id === 'common-snow')!.season).toBe(1);
  expect(commonEvents.find((e) => e.id === 'common-leaves')!.season).toBe(4);
  expect(
    characters[0].events.find((e) => e.id === 'sw-winter-light')!.season,
  ).toBe(4);
  expect(
    characters[2].events.find((e) => e.id === 'family-nhs-text')!.channel,
  ).toBe('morning');
  expect(
    commonEvents.find((e) => e.id === 'common-year-seven-cafe')!.channel,
  ).toBe('morning');
});

test('both choices record CV, restarted work and Jamie’s new work, closing stale lines', () => {
  for (const [character, id, flag] of [
    ['hong-kong-bno', 'bno-partner-cv', 'bno-partner-cv-seen'],
    ['hong-kong-bno', 'bno-partner-restart', 'bno-partner-restarted'],
    ['family-partner', 'family-jamie-new-job', 'family-jamie-reemployed'],
  ]) {
    const event = characters
      .find((c) => c.id === character)!
      .events.find((e) => e.id === id)!;
    for (const choice of event.choices) {
      const state = clear(newGame(character, 1));
      state.pendingEvent = id;
      expect(resolve(state, choice.id).flags).toContain(flag);
    }
  }
});

test('every resident and household has short bilingual, distinct gift responses', () => {
  for (const kind of ['liked', 'neutral', 'disliked'] as const) {
    const people =
      kind === 'disliked' ? npcs.filter((n) => n.characters) : npcs;
    expect(new Set(people.map((n) => n.reactions[kind].zhCN)).size).toBe(
      people.length,
    );
    for (const npc of people) {
      expect(npc.reactions[kind].zhCN.length).toBeLessThanOrEqual(40);
      expect(npc.reactions[kind].en.trim()).not.toBe('');
      const state = clear(newGame(npc.characters?.[0] ?? 'skilled-worker', 1));
      const item = kind === 'neutral' ? 'perch' : npc.gifts[kind][0];
      state.inventory[item] = 1;
      expect(gift(state, npc.id, item).outcome?.text).toEqual(
        npc.reactions[kind],
      );
    }
  }
});

test('the board uses natural dates in both languages and the show uses English plurals', () => {
  const state = clear();
  state.flags = ['quarter-board-pub-quiz'];
  state.day.minute = 600;
  const board = doActivity(enter(state, 'board'), 'board').outcome!.text!;
  expect(board.zhCN).toContain('2月1日周六 18:00');
  expect(board.en).toContain('Sat 1 Feb, 18:00');
  expect(board.zhCN + board.en).not.toMatch(/\d{4}-\d{2}-\d{2}/);
  state.quarter = 3;
  state.day.minute = b.showStart;
  state.day.kind = 'special';
  state.day.festival = 'summer-fair';
  state.day.place = 'green';
  state.inventory.tomato = 3;
  state.flags = ['quarter-harvest:tomato:3'];
  expect(
    activities(state, 'green').find((a) => a.id === 'summer-show-tomato')!.label
      .en,
  ).toBe('Show 3 tomatoes');
  expect(doActivity(state, 'summer-show-tomato').outcome!.text!.en).toContain(
    'You show 3 tomatoes and win a blue ribbon.',
  );
});
