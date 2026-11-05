import { describe, expect, test } from 'vitest';
import {
  act,
  actions,
  characters,
  currentEvent,
  endQuarter,
  narrative,
  newGame,
  progress,
  resolve,
  visaMonthsLeft,
} from '../src';
import { balance } from '../src/balance';
import { commonEvents } from '../src/events/common';
import type { GameState } from '../src';

function clear(s = newGame('skilled-worker', 1)): GameState {
  delete s.pendingEvent;
  s.eventQueue = [];
  return s;
}
describe('8.1 review corrections', () => {
  test('visa months floor calendar fractions and progress rounds percentages', () => {
    const s = clear();
    expect(visaMonthsLeft(s)).toBe(23);
    s.date = '2027-01-14';
    expect(visaMonthsLeft(s)).toBe(0);
    s.date = '2026-12-15';
    expect(visaMonthsLeft(s)).toBe(0);
    s.date = '2025-02-17';
    for (const p of Object.values(progress(s)))
      expect(Number.isInteger(p.percent)).toBe(true);
    expect(narrative(s)[0].zhCN).toContain('在 2025-01-15 开始');
  });
  test('B1 learners need seven classes for B2 and an early exam gives a real setback', () => {
    let s = clear();
    for (let i = 0; i < 6; i++) {
      s.actionsLeft = 1;
      s = act(s, 'class');
    }
    expect(s.stats.english).toBeLessThan(balance.englishB2);
    s.actionsLeft = 1;
    const failed = act(s, 'exam');
    expect(currentEvent(failed)?.id).toBe('system-exam-failed');
    expect(failed.timeline.english).toEqual({ cefrLevel: 'B1' });
    s.actionsLeft = 2;
    s = act(s, 'class');
    expect(act(s, 'exam').timeline.english).toEqual({ cefrLevel: 'B2' });
  });
  test('quarterly attrition stretches regular B2 study to eight classes', () => {
    let s = clear();
    for (let i = 0; i < 7; i++)
      s = clear(endQuarter(act(act(s, 'class'), 'rest')));
    expect(s.stats.english).toBeLessThan(balance.englishB2);
    s = act(s, 'class');
    expect(act(s, 'exam').timeline.english).toEqual({ cefrLevel: 'B2' });
  });
  test('rent increases future expenses and a quarter housing lock blocks queued contradictions', () => {
    const before = clear();
    const increased = resolve(
      { ...before, pendingEvent: 'common-rent' },
      'skip',
    );
    expect(increased.flags).toContain('rent-rise-1');
    const after = endQuarter(clear(increased));
    expect(after.stats.money - increased.stats.money).toBe(
      38000 / 4 - balance.livingCosts - balance.rentRisePerQuarter,
    );
    expect(after.flags).not.toContain('quarter-housing-change');
    const queued = {
      ...before,
      eventQueue: ['common-flat-after'],
      flags: ['flat-planned'],
    };
    expect(
      currentEvent(resolve({ ...queued, pendingEvent: 'common-rent' }, 'skip')),
    ).toBeUndefined();
  });
  test('the weight pool excludes used one-offs and conflicting scheduled housing cards', () => {
    const original = characters[0].events;
    const common = commonEvents.splice(0);
    const move = {
      ...common.find((e) => e.id === 'common-flat-after')!,
      requires: [],
      season: undefined,
    };
    const renew = {
      ...common.find((e) => e.id === 'common-rent')!,
      when: [],
      season: undefined,
    };
    characters[0].events = [move, renew];
    try {
      for (let seed = 1; seed <= 20; seed++) {
        let s = newGame('skilled-worker', seed);
        expect(s.eventQueue).toHaveLength(0);
        const e = currentEvent(s)!;
        s = resolve(s, e.choices[0].id);
        expect(currentEvent(act(s, 'mail'))).toBeUndefined();
        s = clear(endQuarter(s));
        s.actionsLeft = 1;
        s.firedEvents = [move.id, renew.id];
        expect(actions(s).some((a) => a.id === 'mail')).toBe(true);
        expect(currentEvent(act(s, 'mail'))).toBeUndefined();
      }
    } finally {
      characters[0].events = original;
      commonEvents.push(...common);
    }
  });
});
