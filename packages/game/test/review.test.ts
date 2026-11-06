import { perform, availableActivities, quarter, firstPending } from './helpers';
import { describe, expect, test } from 'vitest';
import {
  characters,
  currentEvent,
  narrative,
  newGame,
  progress,
  resolve,
  sleep,
  visaMonthsLeft,
} from '../src';
import { balance } from '../src/balance';
import { commonEvents } from '../src/events/common';
import type { GameState } from '../src';

function clear(s = newGame('skilled-worker', 1)): GameState {
  delete s.pendingEvent;
  s.eventQueue = [];
  s.day.deliveries = [];
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
  test('classes improve skill, while early and successful exams retain v2 evidence behavior', () => {
    const state = clear();
    state.stats.english = balance.englishB2 - balance.classEnglish;
    const failed = perform(state, 'exam');
    expect(currentEvent(failed)?.id).toBe('system-exam-failed');
    expect(failed.timeline.english).toEqual({ cefrLevel: 'B1' });
    const learned = perform(state, 'class');
    expect(learned.stats.english).toBe(balance.englishB2);
    expect(learned.timeline.english).toEqual({ cefrLevel: 'B1' });
    expect(perform(learned, 'exam').timeline.english).toEqual({
      cefrLevel: 'B2',
    });
  });
  test('rent increases future expenses and a quarter housing lock blocks queued contradictions', () => {
    const before = clear();
    const increased = resolve(
      { ...before, pendingEvent: 'common-rent' },
      'skip',
    );
    expect(increased.flags).toContain('rent-rise-1');
    const after = quarter(clear(increased));
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
        expect(
          [
            s.pendingEvent,
            ...s.eventQueue,
            ...s.day.deliveries.map((d) => d.eventId),
          ].filter(Boolean),
        ).toHaveLength(1);
        s = firstPending(s);
        const e = currentEvent(s)!;
        s = resolve(s, e.choices[0].id);
        const rest = firstPending(s);
        // A card delivered at the next quarter's wake-up is a new draw.
        if (rest.date === s.date) expect(currentEvent(rest)).toBeUndefined();
        s = clear(quarter(s));

        s.firedEvents = [move.id, renew.id];
        expect(availableActivities(s).some((a) => a.id === 'rest')).toBe(true);
        expect(currentEvent(firstPending(s))).toBeUndefined();
      }
    } finally {
      characters[0].events = original;
      commonEvents.push(...common);
    }
  });
});

describe('8.3b content chain corrections', () => {
  function scene(state: GameState, id: string, choice: string) {
    return resolve({ ...clear(state), pendingEvent: id }, choice);
  }
  function queued(state: GameState, id: string) {
    return currentEvent(
      sleep({
        ...clear(structuredClone(state)),
        day: { ...state.day, deliveries: [{ eventId: id, channel: 'letter' }] },
      }),
    )?.id;
  }
  test.each(['advice', 'gp'])(
    'Jamie’s health path (%s) excludes the layoff chain',
    (choice) => {
      const before = clear(newGame('family-partner', 1));
      before.year = 2;
      expect(queued(before, 'family-jamie-rumour')).toBe('family-jamie-rumour');
      expect(queued(before, 'family-jamie-health')).toBe('family-jamie-health');
      const health = scene(before, 'family-jamie-health', choice);
      expect(queued(health, 'family-jamie-rumour')).toBeUndefined();
      const stopped = scene(health, 'family-pip-form', 'apply');
      expect(stopped.timeline.incomeYears.at(-1)?.partnerEarnings).toBe(0);
      expect(queued(stopped, 'family-jamie-rumour')).toBeUndefined();
      expect(
        queued(
          { ...stopped, flags: [...stopped.flags, 'family-job-worry'] },
          'family-jamie-lost-job',
        ),
      ).toBeUndefined();
    },
  );
  test.each(['budget', 'talk'])(
    'Jamie’s layoff path (%s) excludes work reduction for health',
    (choice) => {
      const before = clear(newGame('family-partner', 1));
      before.year = 2;
      const rumour = scene(before, 'family-jamie-rumour', choice);
      expect(queued(rumour, 'family-jamie-lost-job')).toBe(
        'family-jamie-lost-job',
      );
      expect(queued(rumour, 'family-jamie-health')).toBeUndefined();
      for (const loss of ['record', 'help']) {
        const lost = scene(
          structuredClone(rumour),
          'family-jamie-lost-job',
          loss,
        );
        expect(lost.timeline.incomeYears.at(-1)?.partnerEarnings).toBe(0);
        expect(queued(lost, 'family-jamie-health')).toBeUndefined();
      }
    },
  );
  test('B2 retests require a failed first attempt and a pass closes both result cards', () => {
    const before = clear(newGame('hong-kong-bno', 1));
    before.year = 3;
    before.stats.english = balance.englishB2;
    before.flags.push('bno-b2-practice');
    expect(queued(before, 'bno-b2-certificate')).toBe('bno-b2-certificate');
    expect(queued(before, 'bno-english-retest')).toBeUndefined();
    const failed = scene(
      structuredClone(before),
      'bno-b2-certificate',
      'second',
    );
    expect(failed.timeline.english).toEqual({ cefrLevel: 'B1' });
    expect(queued(failed, 'bno-english-retest')).toBe('bno-english-retest');
    for (const passed of [
      scene(failed, 'bno-english-retest', 'first'),
      scene(before, 'bno-b2-certificate', 'first'),
    ]) {
      expect(passed.timeline.english).toEqual({ cefrLevel: 'B2' });
      expect(queued(passed, 'bno-b2-certificate')).toBeUndefined();
      expect(queued(passed, 'bno-english-retest')).toBeUndefined();
    }
  });
  test.each([
    ['family-car-or-savings', 'car'],
    ['common-used-car', 'buy'],
  ])('buying through %s excludes both borrowed-car scenes', (id, choice) => {
    const before = clear(newGame('family-partner', 1));
    before.year = 2;
    expect(queued(before, 'family-garage-quote')).toBe('family-garage-quote');
    expect(queued(before, 'common-parking-envelope')).toBe(
      'common-parking-envelope',
    );
    const bought = scene(before, id, choice);
    expect(bought.flags).toContain('used-car-bought');
    expect(queued(bought, 'family-garage-quote')).toBeUndefined();
    expect(queued(bought, 'common-parking-envelope')).toBeUndefined();
  });
  test.each(['clear', 'fold'])(
    'the pram %s path restores paused pay and household cash',
    (choice) => {
      const before = clear(newGame('family-partner', 1));
      before.year = 2;
      expect(queued(before, 'family-pram-hall')).toBeUndefined();
      const stopped = scene(before, 'family-small-socks', 'prepare');
      expect(stopped.timeline.episodes[0].salary).toBe(0);
      expect(stopped.timeline.incomeYears.at(-1)?.earnings).toBe(0);
      const arrived = scene(stopped, 'family-baby-arrival', 'night');
      expect(queued(arrived, 'family-pram-hall')).toBe('family-pram-hall');
      const resumed = scene(arrived, 'family-pram-hall', choice);
      expect(resumed.timeline.episodes[0].salary).toBe(12000);
      expect(resumed.timeline.incomeYears.at(-1)?.earnings).toBe(12000);
      const unpaid = quarter(clear(structuredClone(arrived)));
      const paid = quarter(clear(structuredClone(resumed)));
      expect(
        paid.stats.money -
          resumed.stats.money -
          (unpaid.stats.money - arrived.stats.money),
      ).toBe(12000 / 4);
    },
  );
  test('pram pay cannot replace an uninterrupted part-time or accepted full-time job', () => {
    const before = clear(newGame('family-partner', 1));
    before.year = 2;
    const borrowed = scene(before, 'family-small-socks', 'borrow');
    const arrived = scene(borrowed, 'family-baby-arrival', 'help');
    expect(queued(arrived, 'family-pram-hall')).toBeUndefined();
    const trial = scene(arrived, 'family-hours', 'try');
    const full = scene(trial, 'family-hours-trial', 'full-time');
    const raised = scene(
      structuredClone(full),
      'family-first-full-payslip',
      'save',
    );
    for (const employed of [full, raised]) {
      expect(queued(employed, 'family-small-socks')).toBeUndefined();
      expect(queued(employed, 'family-pram-hall')).toBeUndefined();
      expect(
        queued(
          { ...employed, flags: [...employed.flags, 'family-work-paused'] },
          'family-pram-hall',
        ),
      ).toBeUndefined();
    }
  });
  test('BN(O) partner work changes mood and story without changing income or quarterly cash', () => {
    let state = clear(newGame('hong-kong-bno', 1));
    for (const id of [
      'bno-partner-cv',
      'bno-partner-offer',
      'bno-partner-layoff',
      'bno-partner-restart',
    ]) {
      const before = structuredClone(state);
      state = scene(state, id, id === 'bno-partner-cv' ? 'plan' : 'first');
      expect(state.timeline.incomeYears).toEqual(before.timeline.incomeYears);
      expect(state.timeline.episodes).toEqual(before.timeline.episodes);
      const beforeQuarter = quarter(clear(before));
      const afterQuarter = quarter(clear(structuredClone(state)));
      expect(afterQuarter.stats.money).toBe(beforeQuarter.stats.money);
    }
  });
  test('moving ends only the old family rent rise; staying and other rises keep charging', () => {
    const before = clear(newGame('family-partner', 1));
    const raised = scene(before, 'family-rent-letter', 'search');
    const quarterlyPay =
      32000 / 4 -
      balance.livingCosts +
      balance.householdCostContribution['family-partner'];
    const nextQuarter = clear(quarter(clear(raised)));
    expect(nextQuarter.stats.money - raised.stats.money).toBe(
      quarterlyPay - balance.rentRisePerQuarter,
    );
    expect(nextQuarter.flags).not.toContain('quarter-housing-change');
    expect(queued(nextQuarter, 'family-move-boxes')).toBe('family-move-boxes');
    for (const choice of ['move', 'stay']) {
      const decided = scene(
        structuredClone(nextQuarter),
        'family-move-boxes',
        choice,
      );
      const after = quarter(clear(structuredClone(decided)));
      expect(after.stats.money - decided.stats.money).toBe(
        quarterlyPay - (choice === 'stay' ? balance.rentRisePerQuarter : 0),
      );
      if (choice === 'move') {
        expect(decided.flags).toContain('rent-rise-family-ended');
        const otherRise = {
          ...decided,
          flags: [...decided.flags, 'rent-rise-1'],
        };
        expect(
          quarter(clear(otherRise)).stats.money - otherRise.stats.money,
        ).toBe(quarterlyPay - balance.rentRisePerQuarter);
      }
    }
  });
  test('the BN(O) UC episode starts ninety days before the receipt is recalled', () => {
    const before = clear(newGame('hong-kong-bno', 1));
    expect(before.timeline.benefits).toHaveLength(0);
    const received = scene(
      structuredClone(before),
      'bno-benefit-decision',
      'first',
    );
    expect(received.timeline.benefits).toHaveLength(1);
    expect(received.timeline.benefits[0]).toMatchObject({
      benefitType: 'UNIVERSAL_CREDIT',
      from: '2023-03-17',
    });
    expect(
      scene(before, 'bno-benefit-decision', 'second').timeline.benefits,
    ).toHaveLength(0);
  });
  test('the family B2 update starts in year two', () => {
    const state = clear(newGame('family-partner', 1));
    expect(queued(state, 'family-b2-letter')).toBeUndefined();
    expect(queued({ ...state, year: 2 }, 'family-b2-letter')).toBe(
      'family-b2-letter',
    );
  });
  test('moving away closes the BN(O) old-neighbour scene; staying keeps it available', () => {
    const before = clear(newGame('hong-kong-bno', 1));
    before.flags.push('bno-neighbour-peace');
    expect(queued(before, 'bno-tea-with-neighbour')).toBe(
      'bno-tea-with-neighbour',
    );
    const stayed = scene(structuredClone(before), 'bno-house-keys', 'stay');
    expect(queued(stayed, 'bno-tea-with-neighbour')).toBe(
      'bno-tea-with-neighbour',
    );
    const moved = scene(before, 'bno-house-keys', 'move');
    expect(queued(moved, 'bno-tea-with-neighbour')).toBeUndefined();
  });
  test.each(['bno-own-contract', 'bno-new-employer'])(
    'café manager shifts preserve the main-job contract from %s',
    (id) => {
      const employed = scene(clear(newGame('hong-kong-bno', 1)), id, 'first');
      const managed = scene(
        structuredClone(employed),
        'bno-cafe-manager',
        'first',
      );
      expect(managed.timeline.episodes).toEqual(employed.timeline.episodes);
      expect(managed.timeline.incomeYears.at(-1)?.earnings).toBe(40000);
      expect(managed.stats.career).toBe(employed.stats.career + 4);
      const beforeQuarter = quarter(clear(employed));
      const afterQuarter = quarter(clear(managed));
      expect(afterQuarter.stats.money).toBe(beforeQuarter.stats.money);
    },
  );
});
