import { describe, expect, test } from 'vitest';
import { newGame, npcAt, npcs, peopleAt, places, townsfolk } from '../src';
import type { Npc, Weather } from '../src';
import { clear } from './helpers';

const households = [
  ['family-partner', 'jamie'],
  ['hong-kong-bno', 'ka-ning-partner'],
  ['hong-kong-bno', 'ka-ning-child'],
] as const;

function weekday(
  character: string,
  minute: number,
  weather: Weather = 'sunny',
) {
  const state = clear(newGame(character, 1));
  state.day.kind = 'workday';
  state.day.weather = weather;
  state.day.minute = minute;
  delete state.day.festival;
  return state;
}

describe('10.1 household schedules', () => {
  test.each(households)(
    '%s / %s leaves for work or school and comes home',
    (character, npc) => {
      for (const weather of ['sunny', 'cloudy'] as const) {
        const before = weekday(character, 420, weather);
        expect(npcAt(before, npc)).toBe('home');
        for (const minute of [600, 720]) {
          const daytime = { ...before, day: { ...before.day, minute } };
          expect(npcAt(daytime, npc)).toBe('away');
          expect(townsfolk(daytime).map((person) => person.id)).toContain(npc);
          for (const place of places)
            expect(peopleAt(daytime, place.id)).not.toContain(npc);
        }
        const after = { ...before, day: { ...before.day, minute: 1080 } };
        expect(npcAt(after, npc)).toBe('home');
        expect(peopleAt(after, 'home')).toContain(npc);
        expect(npcAt(before, npc)).toBe('home');
      }
    },
  );

  test.each([
    [
      'family-partner',
      'jamie',
      'family-jamie-unemployed',
      'family-jamie-reemployed',
    ],
    [
      'hong-kong-bno',
      'ka-ning-partner',
      'bno-partner-between-jobs',
      'bno-partner-restarted',
    ],
  ])(
    '%s / %s stays in town between jobs, then returns to work',
    (character, npc, unemployed, employed) => {
      const before = weekday(character, 600);
      expect(npcAt(before, npc)).toBe('away');
      const between = { ...before, flags: [...before.flags, unemployed] };
      const visited = new Set<string>();
      for (const minute of [600, 720, 840, 960]) {
        const state = { ...between, day: { ...between.day, minute } };
        const location = npcAt(state, npc);
        expect(['home', 'shop', 'park-path', 'park-bench']).toContain(location);
        visited.add(location);
      }
      expect(visited.size).toBeGreaterThan(1);
      const restarted = { ...between, flags: [...between.flags, employed] };
      expect(npcAt(restarted, npc)).toBe('away');
      expect(between.flags).not.toContain(employed);
    },
  );

  test('Jamie stays in town after the card explicitly pauses work, including either PIP result', () => {
    const before = weekday('family-partner', 600);
    before.flags.push('family-pip-advice');
    expect(npcAt(before, 'jamie')).toBe('away');
    const paused = {
      ...before,
      flags: [...before.flags, 'family-pip-applied'],
    };
    expect(npcAt(paused, 'jamie')).not.toBe('away');
    expect(
      npcAt(
        { ...paused, flags: [...paused.flags, 'family-pip-awarded'] },
        'jamie',
      ),
    ).not.toBe('away');
    expect(npcAt(before, 'jamie')).toBe('away');
  });

  test.each(households)(
    '%s / %s keeps weekend, rain and festival priorities',
    (character, npc) => {
      const state = weekday(character, 660);
      state.day.kind = 'weekend';
      expect(npcAt(state, npc)).toBe('park-path');
      state.day.minute = 780;
      expect(npcAt(state, npc)).toBe('home');
      for (const weather of ['rain', 'snow'] as const) {
        state.day.kind = 'workday';
        state.day.weather = weather;
        state.day.minute = 600;
        expect(npcAt(state, npc)).toBe('home');
        state.day.kind = 'special';
        state.day.festival = 'lunar-new-year';
        expect(npcAt(state, npc)).toBe('green-stall');
        state.day.minute = 1080;
        expect(npcAt(state, npc)).toBe('green');
        delete state.day.festival;
      }
    },
  );

  test('schedule when uses ANDed event conditions and the first matching rule', () => {
    const npc = npcs.find((person) => person.id === 'jamie')!;
    const original = npc.schedule;
    const schedule: Npc['schedule'] = [
      {
        when: [
          { flag: 'schedule-ready' },
          { minuteMin: 600, minuteMax: 720 },
          { stat: 'mood', min: 50 },
        ],
        stops: [{ from: 0, at: 'away' }],
      },
      { stops: [{ from: 0, at: 'home' }] },
    ];
    npc.schedule = schedule;
    try {
      const before = weekday('family-partner', 600);
      before.stats.mood = 50;
      expect(npcAt(before, npc.id)).toBe('home');
      const after = { ...before, flags: [...before.flags, 'schedule-ready'] };
      expect(npcAt(after, npc.id)).toBe('away');
      expect(
        npcAt({ ...after, day: { ...after.day, minute: 721 } }, npc.id),
      ).toBe('home');
      expect(
        npcAt({ ...after, stats: { ...after.stats, mood: 49 } }, npc.id),
      ).toBe('home');
    } finally {
      npc.schedule = original;
    }
  });

  test('Yao’s flatmate belongs only to her household, with a normal workday and no departure after her partner arrives', () => {
    for (const character of [
      'skilled-worker',
      'hong-kong-bno',
      'family-partner',
    ])
      expect(
        townsfolk(weekday(character, 600)).some(
          (npc) => npc.id === 'yao-flatmate',
        ),
      ).toBe(character === 'skilled-worker');
    const before = weekday('skilled-worker', 600);
    expect(npcAt(before, 'yao-flatmate')).toBe('away');
    const after = {
      ...before,
      flags: [...before.flags, 'partner-arrived'],
      day: { ...before.day, minute: 1080 },
    };
    expect(npcAt(after, 'yao-flatmate')).toBe('home');
    expect(peopleAt(after, 'home')).toContain('yao-flatmate');
    expect(
      npcs
        .filter((npc) => npc.characters?.includes('skilled-worker'))
        .map((npc) => npc.id),
    ).toEqual(['yao-flatmate']);
  });
});
