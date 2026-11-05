import { evaluate } from '@uk-immigration/engine';
import { currentLaw2026_11 } from '@uk-immigration/policy-data';
import { describe, expect, test } from 'vitest';
import {
  act,
  actions,
  achievements,
  characters,
  currentEvent,
  endQuarter,
  isOver,
  newGame,
  resolve,
} from '../src';
import type { GameState } from '../src';
import { commonEvents } from '../src/events/common';
import { extensionFor } from '../src/locations';
import { balance } from '../src/balance';
const LAW = 'current-law-2026-11';
const REFORM = 'earned-settlement-2026-11';
function clear(state: GameState): GameState {
  delete state.pendingEvent;
  state.eventQueue = [];
  return state;
}
function refresh(state: GameState) {
  state.result = evaluate({
    timeline: state.timeline,
    simulationDate: state.date,
  });
  return state;
}
function rule(state: GameState, id: string) {
  return state.result.byRuleSet[LAW]!.rules.find((r) => r.id === id)!;
}
function scene(state: GameState, id: string, choice: string) {
  return resolve({ ...clear(state), pendingEvent: id }, choice);
}

describe('additional character timelines and decisions', () => {
  test('BN(O) keeps B1 on the five-year route while reform exclusion retains criminal checks', () => {
    let state = clear(newGame('hong-kong-bno', 1));
    expect(state.date).toBe('2023-06-15');
    expect(state.timeline.relationships).toHaveLength(2);
    expect(state.timeline.lifeInTheUk).toBeUndefined();
    state.date = '2027-06-15';
    state.timeline.episodes[0].validTo = '2032-06-14';
    state.timeline.lifeInTheUk = { passed: true };
    state = refresh(state);
    expect(rule(state, 'CL-ENGLISH').status).toBe('PASS');
    expect(state.result.byRuleSet[LAW]?.outcome).toBe('LIKELY_ELIGIBLE');
    expect(state.result.byRuleSet[REFORM]?.outcome).toBe(
      'REQUIRES_REGULATED_REVIEW',
    );
    expect(state.result.shortCircuit?.reason).toBe('OUTSIDE_FRAMEWORK');
    expect(act(state, 'settle').ending).toBe('settled');
    const convicted = scene(state, 'bno-neighbour-outcome', 'second');
    expect(convicted.timeline.criminalRecord).toHaveLength(1);
    expect(convicted.result.shortCircuit?.reason).toBe('CRIMINALITY');
    expect(convicted.ending).toBe('criminal');
    const trip = act(state, 'travel-6');
    expect(trip.timeline.absences).toHaveLength(1);
    expect(rule(trip, 'CL-HKBNO-RESIDENCE-5Y').status).toBe('FAIL');
  });
  test.each([
    ['hong-kong-bno', '2024-06-15', '2024-12-15', '2027-06-14', 206],
    ['family-partner', '2026-06-15', '2026-12-15', '2029-06-14', 1407],
  ])(
    '%s pays its sourced fee and IHS for adjoining thirty-month permission',
    (id, date, from, to, fee) => {
      const before = clear(newGame(id, 1));
      before.date = date;
      refresh(before);
      const after = act(before, 'extend');
      expect(extensionFor(before.timeline.episodes[0].route)?.cost).toBe(
        Number(fee) +
          currentLaw2026_11.values.immigrationHealthSurchargePerYear.value *
            2.5,
      );
      expect(after.stats.money).toBe(
        before.stats.money -
          Number(fee) -
          currentLaw2026_11.values.immigrationHealthSurchargePerYear.value *
            2.5,
      );
      expect(after.timeline.episodes).toHaveLength(2);
      expect(after.timeline.episodes[0]).toEqual(before.timeline.episodes[0]);
      expect(after.timeline.episodes[1]).toMatchObject({
        validFrom: from,
        validTo: to,
        route: before.timeline.episodes[0].route,
      });
      expect(actions(after).some((a) => a.id === 'extend')).toBe(false);
      if (id === 'family-partner')
        expect(after.timeline.episodes[1].familyPermission).toBe(
          'PARTNER_FIVE_YEAR',
        );
      const expired = { ...before, date: before.timeline.episodes[0].validTo };
      expect(endQuarter(refresh(expired)).ending).toBe('overstayed');
    },
  );
  test('family income, declared savings, partner PIP and personal public funds remain distinct', () => {
    let state = clear(newGame('family-partner', 1));
    expect(state.timeline.episodes[0].familyPermission).toBe(
      'PARTNER_FIVE_YEAR',
    );
    expect(rule(state, 'CL-FAMILY-FINANCIAL').status).toBe('PASS');
    state.date = '2029-06-15';
    state.timeline.episodes[0].validTo = '2032-06-14';
    state.timeline.incomeYears = [
      { taxYear: '2028-29', earnings: 20000, partnerEarnings: 0 },
    ];
    state.stats.money = 25000;
    state = refresh(state);
    expect(rule(state, 'CL-FAMILY-FINANCIAL').status).toBe('FAIL');
    const saved = scene(state, 'family-savings-statement', 'declare');
    expect(saved.timeline.cashSavings).toBe(25000);
    expect(rule(saved, 'CL-FAMILY-FINANCIAL').status).toBe('PASS');
    saved.timeline.english = { cefrLevel: 'B2' };
    saved.timeline.lifeInTheUk = { passed: true };
    expect(act(refresh(saved), 'settle').ending).toBe('settled');
    const short = scene(
      { ...state, stats: { ...state.stats, money: 24000 } },
      'family-savings-short',
      'declare',
    );
    expect(short.timeline.cashSavings).toBe(24000);
    expect(rule(short, 'CL-FAMILY-FINANCIAL').status).toBe('FAIL');
    const pip = scene(state, 'family-pip-decision', 'awarded');
    expect(pip.timeline.partnerSpecifiedBenefit).toBe(true);
    expect(pip.timeline.benefits).toHaveLength(0);
    expect(rule(pip, 'CL-FAMILY-FINANCIAL').status).toBe('UNKNOWN');
    expect(rule(pip, 'CL-FAMILY-FINANCIAL').pendingDetails).toContain('PD-075');
    expect(rule(state, 'CL-ENGLISH').status).toBe('FAIL');
    state.timeline.english = { cefrLevel: 'B2' };
    state.timeline.lifeInTheUk = { passed: true };
    expect(refresh(state).result.byRuleSet[REFORM]?.pathwayYears).toBe(5);
  });
  test('partner wages persist over tax years, a job loss reduces actual household cash, spending reduces declared savings', () => {
    const before = clear(newGame('family-partner', 1));
    before.date = '2026-06-15';
    const paid = endQuarter(refresh(before));
    expect(
      paid.timeline.incomeYears.find((y) => y.taxYear === '2026-27'),
    ).toMatchObject({ earnings: 12000, partnerEarnings: 20000 });
    expect(paid.stats.money - before.stats.money).toBe(
      32000 / 4 -
        balance.livingCosts +
        balance.householdCostContribution['family-partner'],
    );
    const lost = scene(before, 'family-jamie-lost-job', 'record');
    const unpaid = endQuarter(clear(lost));
    expect(unpaid.stats.money - lost.stats.money).toBe(
      12000 / 4 -
        balance.livingCosts +
        balance.householdCostContribution['family-partner'],
    );
    const savings = clear(newGame('family-partner', 1));
    savings.stats.money = 25000;
    const declared = scene(savings, 'family-savings-statement', 'declare');
    const spent = act(clear(declared), 'class');
    expect(spent.timeline.cashSavings).toBe(25000 - balance.classCost);
    expect(spent.result).toEqual(
      evaluate({ timeline: spent.timeline, simulationDate: spent.date }),
    );
  });
  test('returning to part-time restores pay and keeping a contract preserves current earnings', () => {
    const trial = scene(
      clear(newGame('family-partner', 1)),
      'family-hours',
      'try',
    );
    expect(trial.timeline.episodes[0].salary).toBe(18000);
    const returned = scene(trial, 'family-hours-trial', 'part-time');
    expect(returned.timeline.episodes[0].salary).toBe(12000);
    expect(
      returned.timeline.incomeYears.find((y) => y.taxYear === '2025-26')
        ?.earnings,
    ).toBe(12000);
    const jobless = scene(returned, 'family-jamie-lost-job', 'record');
    expect(
      scene(jobless, 'family-five-year-folder', 'review').timeline.incomeYears,
    ).toEqual(jobless.timeline.incomeYears);
    let bno = scene(
      clear(newGame('hong-kong-bno', 1)),
      'bno-cafe-manager',
      'first',
    );
    for (const id of [
      'bno-salary-review',
      'bno-shorter-hours',
      'bno-quiet-career',
      'bno-cafe-manager',
    ]) {
      const kept = scene(bno, id, 'second');
      expect(kept.timeline.incomeYears).toEqual(bno.timeline.incomeYears);
      expect(kept.timeline.episodes[0].salary).toBe(40000);
      bno = kept;
    }
  });
  test('new characters start in their calendar season and each still gets forty quarters', () => {
    for (const id of ['hong-kong-bno', 'family-partner']) {
      let state = clear(newGame(id, 1));
      expect(state.quarter).toBe(2);
      // Isolate the clock from story-driven endings and provide already-granted coverage.
      state.timeline.episodes[0].validTo = '2040-01-01';
      for (let q = 0; q < 40; q++) {
        expect(isOver(state)).toBe(false);
        expect(state.year).toBe(Math.floor(q / 4) + 1);
        state = clear(endQuarter(state));
      }
      expect(state.ending).toBe('timeout');
      expect(state.date).toBe(
        id === 'hong-kong-bno' ? '2033-06-15' : '2035-06-15',
      );
    }
  });
});

describe('authored exclusive chains', () => {
  test('BN(O) pass copies and manager shifts require their actual predecessor decisions', () => {
    const bno = characters.find((c) => c.id === 'hong-kong-bno')!;
    const original = bno.events;
    const common = commonEvents.splice(0);
    bno.events = original.filter((e) =>
      ['bno-kol-copy', 'bno-cafe-manager'].includes(e.id),
    );
    try {
      const state = clear(newGame(bno.id, 1));
      state.year = 4;
      state.flags = ['bno-kol-revised', 'bno-cafe-shifts'];
      expect(currentEvent(act(state, 'mail'))).toBeUndefined();
      state.flags.push('bno-kol-passed');
      expect(currentEvent(act(state, 'mail'))?.id).toBe('bno-kol-copy');
      state.flags = ['bno-cafe-regular'];
      expect(currentEvent(act(state, 'mail'))?.id).toBe('bno-cafe-manager');
    } finally {
      bno.events = original;
      commonEvents.push(...common);
    }
  });
  test.each([
    ['skilled-worker', 'sw-review', 'plan', 'sw-review-after', 'first'],
    ['hong-kong-bno', 'bno-school-gate', 'plan', 'bno-school-chat', 'first'],
    [
      'family-partner',
      'family-hours',
      'try',
      'family-hours-trial',
      'full-time',
    ],
  ])(
    '%s draws the follow-up only after the opt-in',
    (id, first, choose, follow, finish) => {
      const character = characters.find((c) => c.id === id)!;
      const original = character.events;
      const common = commonEvents.splice(0);
      character.events = original.filter((e) => [first, follow].includes(e.id));
      try {
        const before = newGame(id, 7);
        expect(currentEvent(before)?.id).toBe(first);
        expect(before.eventQueue).not.toContain(follow);
        const opted = resolve(before, choose);
        const after = act(opted, 'mail');
        expect(currentEvent(after)?.id).toBe(follow);
        const completed = resolve(after, finish);
        expect(
          completed.log.filter((e) => e.kind === 'event').map((e) => e.id),
        ).toEqual([first, follow]);
      } finally {
        character.events = original;
        commonEvents.push(...common);
      }
    },
  );
  test('new achievements reject early, missing and opposite histories', () => {
    const initial = clear(newGame('skilled-worker', 1));
    for (const id of [
      'never-overstayed',
      'ten-years-no-public-funds',
      'three-friends',
      'two-renewals',
    ])
      expect(achievements.find((a) => a.id === id)!.check(initial)).toBe(false);
    initial.flags = ['friend-library', 'friend-garden', 'friend-neighbour'];
    expect(
      achievements.find((a) => a.id === 'three-friends')!.check(initial),
    ).toBe(true);
    initial.log = Array.from({ length: 40 }, () => ({
      year: 10,
      quarter: 4,
      kind: 'quarter',
      id: 'quarter',
      text: { zhCN: '一季', en: 'A quarter' },
    }));
    initial.ending = 'timeout';
    expect(
      achievements.find((a) => a.id === 'never-overstayed')!.check(initial),
    ).toBe(true);
    expect(
      achievements
        .find((a) => a.id === 'ten-years-no-public-funds')!
        .check(initial),
    ).toBe(true);
    initial.timeline.benefits.push({
      benefitType: 'UNIVERSAL_CREDIT',
      from: initial.date,
    });
    initial.timeline.immigrationBreaches.push({
      type: 'OVERSTAYING',
      date: initial.date,
    });
    expect(
      achievements.find((a) => a.id === 'never-overstayed')!.check(initial),
    ).toBe(false);
    expect(
      achievements
        .find((a) => a.id === 'ten-years-no-public-funds')!
        .check(initial),
    ).toBe(false);
  });
});
