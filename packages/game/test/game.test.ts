import { perform, quarter } from './helpers';
import { evaluate } from '@uk-immigration/engine';
import { currentLaw2026_11 } from '@uk-immigration/policy-data';
import { describe, expect, test } from 'vitest';
import {
  activities,
  achievements,
  characters,
  currentEvent,
  places,
  narrative,
  newGame,
  progress,
  resolve,
} from '../src';
import type { Effect, GameEvent, GameState, Text } from '../src';
import { balance } from '../src/balance';
import { commonEvents, systemEvents } from '../src/events/common';
import { locationActions } from '../src/locations';

const LAW = 'current-law-2026-11';
function clearEvents(s = newGame('skilled-worker', 1)): GameState {
  const next = structuredClone(s);
  delete next.pendingEvent;
  next.eventQueue = [];
  next.day.deliveries = [];
  return next;
}
function refreshed(s: GameState) {
  s.result = evaluate({
    timeline: s.timeline,
    simulationDate: s.date,
    locale: s.locale,
  });
  return s;
}
function inject(s: GameState, effects: Effect[], sets?: string[]) {
  const event: GameEvent = {
    id: 'test-event',
    title: { zhCN: '测试', en: 'Test' },
    text: { zhCN: '测试情节。', en: 'Test scene.' },
    weight: 1,
    choices: [
      { id: 'go', label: { zhCN: '继续', en: 'Continue' }, effects, sets },
    ],
  };
  characters[0].events.push(event);
  try {
    return resolve({ ...s, pendingEvent: event.id }, 'go');
  } finally {
    characters[0].events.pop();
  }
}
function checkText(t: Text) {
  expect(t.zhCN.trim()).not.toBe('');
  expect(t.en.trim()).not.toBe('');
  expect(t.zhCN).not.toContain('你应该');
  expect(t.en).not.toMatch(/you should/i);
}
function checkState(s: GameState) {
  for (const [key, value] of Object.entries(s.stats)) {
    expect(Number.isFinite(value)).toBe(true);
    if (key !== 'money') {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(100);
    }
  }
  for (const p of Object.values(progress(s))) {
    expect(p.percent).toBeGreaterThanOrEqual(0);
    expect(p.percent).toBeLessThanOrEqual(100);
  }
  expect(narrative(s).length).toBeGreaterThanOrEqual(8);
  expect(narrative(s).length).toBeLessThanOrEqual(12);
  expect(s.result).toEqual(
    evaluate({
      timeline: s.timeline,
      simulationDate: s.date,
      locale: s.locale,
    }),
  );
}

const effectKeys: Record<Effect['type'], string[]> = {
  stat: ['type', 'key', 'delta'],
  item: ['type', 'item', 'delta'],
  friendship: ['type', 'npc', 'delta'],
  money: ['type', 'delta'],
  absence: ['type', 'startOffsetDays', 'days'],
  income: ['type', 'taxYear', 'earnings', 'partnerEarnings'],
  episode: ['type', 'patch'],
  newEpisode: ['type', 'episode', 'durationMonths', 'gapDays', 'start'],
  benefit: ['type', 'benefit', 'startOffsetDays', 'months'],
  relationship: ['type', 'add', 'remove'],
  english: ['type', 'cefrLevel'],
  lifeInTheUk: ['type'],
  breach: ['type', 'breach', 'offsetDays'],
  criminal: ['type', 'event', 'offsetDays'],
  timeline: ['type', 'patch'],
  ending: ['type', 'ending'],
  none: ['type'],
};
function checkEffects(effects: Effect[]) {
  expect(effects.length).toBeGreaterThan(0);
  for (const effect of effects) {
    expect(effectKeys[effect.type]).toBeDefined();
    expect(
      Object.keys(effect).every((key) => effectKeys[effect.type].includes(key)),
    ).toBe(true);
    if (effect.type === 'stat')
      expect(['money', 'health', 'mood', 'english', 'career']).toContain(
        effect.key,
      );
    if ('delta' in effect) expect(Number.isFinite(effect.delta)).toBe(true);
    if (effect.type === 'absence') expect(effect.days).toBeGreaterThan(0);
  }
}
describe('v3 content contract', () => {
  test('120 common events, all characters, bilingual content, legal effect shapes and flags', () => {
    const all = [
      ...commonEvents,
      ...characters.flatMap((c) => c.events),
      ...systemEvents,
    ];
    expect(commonEvents).toHaveLength(120);
    expect(characters[0].events).toHaveLength(40);
    expect(characters.slice(1).map((c) => c.events.length)).toEqual([80, 80]);
    expect(new Set(all.map((e) => e.id)).size).toBe(all.length);
    const produced = new Set([
      'visa-renewed',
      'promoted',
      'debt-crisis',
      ...all.flatMap((e) => e.choices.flatMap((c) => c.sets ?? [])),
    ]);
    for (const e of all) {
      checkText(e.title);
      checkText(e.text);
      expect(e.text.zhCN.length, e.id).toBeLessThanOrEqual(60);
      expect(e.weight).toBeGreaterThan(0);
      expect(e.choices.length).toBeGreaterThanOrEqual(2);
      expect(e.choices.length).toBeLessThanOrEqual(3);
      expect(new Set(e.choices.map((c) => c.id)).size).toBe(e.choices.length);
      for (const f of [
        ...(e.requires ?? []),
        ...(e.forbids ?? []),
        ...(e.when ?? []).flatMap((c) => ('flag' in c ? [c.flag] : [])),
      ])
        expect(produced.has(f), `${e.id}: ${f}`).toBe(true);
      for (const c of e.choices) {
        checkText(c.label);
        if (c.note) checkText(c.note);
        checkEffects(c.effects);
      }
    }
    const consumed = new Set(
      all.flatMap((e) => [...(e.requires ?? []), ...(e.forbids ?? [])]),
    );
    for (const e of all)
      for (const c of e.choices)
        for (const f of c.sets ?? [])
          expect(
            consumed.has(f) ||
              f === 'cheap-housing' ||
              f.startsWith('rent-rise-') ||
              f.startsWith('friend-'),
            f,
          ).toBe(true);
    expect(
      commonEvents.filter((e) => e.requires?.length).length,
    ).toBeGreaterThanOrEqual(25);
    expect(commonEvents.filter((e) => e.once).length).toBeGreaterThanOrEqual(
      10,
    );
    expect(
      new Set(commonEvents.map((e) => e.season).filter(Boolean)).size,
    ).toBe(4);
    const onlyStats = all.filter((e) =>
      e.choices.every((c) =>
        c.effects.every((f) => ['stat', 'money', 'none'].includes(f.type)),
      ),
    );
    expect(onlyStats.length / all.length).toBeGreaterThanOrEqual(0.4);
    for (const c of characters.slice(1)) {
      expect(
        c.events.filter((e) => e.requires?.length).length,
      ).toBeGreaterThanOrEqual(6);
      const pure = c.events.filter((e) =>
        e.choices.every((choice) =>
          choice.effects.every((f) =>
            ['stat', 'money', 'none'].includes(f.type),
          ),
        ),
      );
      expect(pure.length / c.events.length).toBeGreaterThanOrEqual(0.4);
      // 8.3b makes the three BN(O) partner-work cards narrative only (53/80).
      expect(pure.length / c.events.length).toBeLessThanOrEqual(
        c.id === 'hong-kong-bno' ? 2 / 3 : 0.65,
      );
    }
    for (const a of locationActions) {
      checkText(a.label);
      checkEffects(a.effects);
      expect(places.some((l) => l.id === a.place)).toBe(true);
    }
    expect(places).toHaveLength(16);
    expect(characters[0].sprite).toBe('characters/3.png');
    expect(achievements).toHaveLength(15);
  });
  test('every authored choice runs against the engine without corrupting state', () => {
    for (const character of characters)
      for (const event of [
        ...commonEvents,
        ...character.events,
        ...systemEvents,
      ]) {
        for (const choice of event.choices) {
          const before = clearEvents(newGame(character.id, 1));
          const copy = structuredClone(before);
          const after = resolve(
            { ...before, pendingEvent: event.id },
            choice.id,
          );
          expect(before).toEqual(copy);
          checkState(after);
        }
      }
  });
  test('identity and starting timeline preserve the v1 Yao scenario', () => {
    const s = newGame('skilled-worker', 0);
    expect(s.version).toBe(3);
    expect(s.date).toBe('2025-01-15');
    expect(s.day.minute).toBe(420);
    expect(s).not.toHaveProperty('actionsLeft');
    expect(s.timeline.episodes).toEqual([
      {
        route: 'SKILLED_WORKER',
        role: 'MAIN',
        validFrom: '2024-01-15',
        validTo: '2027-01-14',
        salary: 38000,
        socCode: '2134',
      },
    ]);
    expect(s.timeline.incomeYears).toEqual([
      { taxYear: '2023-24', earnings: 8500 },
      { taxYear: '2024-25', earnings: 38000 },
    ]);
    expect(() => newGame('unknown', 0)).toThrow();
  });
});

describe('preserved engine and quarter behavior', () => {
  test('quarterly income, promotion once per threshold, and renewed salary stay in sync', () => {
    const before = clearEvents();
    before.date = '2026-01-15';
    before.stats.career = balance.promotionThresholds[0] + balance.careerDecay;
    const renewed = perform(refreshed(before), 'extend');
    const after = quarter(renewed);
    expect(after.stats.money).toBe(
      renewed.stats.money + 38000 / 4 - balance.livingCosts,
    );
    const promotedSalary = Math.round(38000 * balance.promotionMultiplier);
    expect(
      after.timeline.episodes.every((e) => e.salary === promotedSalary),
    ).toBe(true);
    expect(
      after.timeline.incomeYears.find((y) => y.taxYear === '2025-26')?.earnings,
    ).toBe(promotedSalary);
    const next = quarter(clearEvents(after));
    expect(
      next.timeline.episodes.every((e) => e.salary === promotedSalary),
    ).toBe(true);
    expect(
      after.flags.filter(
        (f) => f === `promotion-${balance.promotionThresholds[0]}`,
      ),
    ).toHaveLength(1);
    checkState(after);
    checkState(next);
  });
  test('expiry writes overstaying and ends play while preserving the real engine result', () => {
    const before = clearEvents();
    before.date = '2027-01-14';
    refreshed(before);
    const after = quarter(before);
    expect(before.timeline.immigrationBreaches).toHaveLength(0);
    expect(after.timeline.immigrationBreaches).toEqual([
      { type: 'OVERSTAYING', date: '2027-01-15' },
    ]);
    expect(after.result).toEqual(
      evaluate({
        timeline: after.timeline,
        simulationDate: after.date,
        locale: after.locale,
      }),
    );
    expect(after.result.shortCircuit).toBeUndefined();
    expect(after.ending).toBe('overstayed');
    expect(after.ending).toBeDefined();
    expect(quarter(after)).toEqual(after);
    expect(places.flatMap((p) => activities(after, p.id))).toEqual([]);
  });
  test('a granted adjoining renewal survives the old expiry boundary', () => {
    let s = clearEvents();
    s.date = '2027-01-14';
    s = perform(refreshed(s), 'extend');
    s = quarter(s);
    expect(s.ending).toBeUndefined();
    expect(s.timeline.immigrationBreaches).toHaveLength(0);
  });
  test('a future granted episode cannot conceal a gap after permission ends', () => {
    const before = clearEvents();
    const changed = inject(before, [
      {
        type: 'newEpisode',
        episode: {
          route: 'SKILLED_WORKER',
          role: 'MAIN',
          salary: 55000,
          socCode: '2136',
        },
        durationMonths: 36,
        gapDays: 90,
      },
    ]);
    const after = quarter(changed);
    expect(after.timeline.episodes.at(-1)?.validFrom).toBe('2025-04-15');
    expect(after.timeline.immigrationBreaches).toEqual([
      { type: 'OVERSTAYING', date: '2025-01-15' },
    ]);
    expect(after.ending).toBe('overstayed');
    checkState(after);
  });
  test('settlement uses a real eligible engine column, charges ILR fee and ends', () => {
    const before = clearEvents();
    before.date = '2029-01-15';
    before.year = 5;
    before.timeline.episodes[0].validTo = '2032-01-14';
    before.timeline.episodes[0].salary = 65000;
    before.timeline.english = { cefrLevel: 'B2' };
    before.timeline.lifeInTheUk = { passed: true };
    refreshed(before);
    expect(before.result.byRuleSet[LAW]?.outcome).toBe('LIKELY_ELIGIBLE');
    const after = perform(before, 'settle');
    expect(after.ending).toBe('settled');
    expect(after.stats.money).toBe(
      before.stats.money -
        currentLaw2026_11.values.settlementApplicationFee.value,
    );
    expect(after.achievements).toContain('settled');
    checkState(after);
    const unavailable = clearEvents();
    expect(activities(unavailable, 'visa').some((a) => a.id === 'settle')).toBe(
      false,
    );
  });
  test('leaving and a declared conviction reach their distinct endings', () => {
    const before = clearEvents();
    const left = perform(before, 'leave');
    expect(left.ending).toBe('left');
    const criminal = inject(before, [{ type: 'criminal', event: {} }]);
    expect(criminal.result.shortCircuit?.reason).toBe('CRIMINALITY');
    expect(criminal.ending).toBe('criminal');
    expect(criminal.log.at(-1)?.kind).toBe('ending');
    expect(narrative(criminal).at(-1)?.en).toContain('conviction');
  });
  test('two negative quarter ends trigger debt; moving reduces future costs', () => {
    let s = clearEvents();
    s.stats.money = -100000;
    s = clearEvents(quarter(s));
    expect(s.flags).toContain('negative-last-quarter');
    const second = quarter(s);
    expect(currentEvent(second)?.id).toBe('system-debt');
    const moved = clearEvents(resolve(second, 'move'));
    expect(moved.flags).toContain('cheap-housing');
    const after = quarter(moved);
    expect(after.stats.money - moved.stats.money).toBe(
      38000 / 4 - balance.livingCosts + balance.cheapHousingSaving,
    );
  });
  test('all timeline effects preserve their semantics and engine-only consequences', () => {
    const s = clearEvents();
    s.stats.money = 25000;
    const after = inject(s, [
      {
        type: 'income',
        taxYear: 'next',
        earnings: 50000,
        partnerEarnings: 20000,
      },
      {
        type: 'benefit',
        benefit: { benefitType: 'UNIVERSAL_CREDIT' },
        startOffsetDays: 0,
        months: 3,
      },
      {
        type: 'relationship',
        add: { type: 'PARTNER', otherPartyStatus: 'OTHER' },
      },
      { type: 'english', cefrLevel: 'B2' },
      { type: 'lifeInTheUk' },
      {
        type: 'timeline',
        patch: { cashSavings: 25000, governmentDebt: { outstanding: false } },
      },
    ]);
    expect(
      after.timeline.incomeYears.find((y) => y.taxYear === '2025-26'),
    ).toMatchObject({ earnings: 50000, partnerEarnings: 20000 });
    expect(after.timeline.benefits[0]).toMatchObject({
      from: '2025-01-15',
      to: '2025-04-14',
    });
    expect(after.timeline.relationships).toHaveLength(1);
    expect(after.timeline.cashSavings).toBe(25000);
    checkState(after);
    const breached = inject(s, [
      { type: 'breach', breach: { type: 'CONDITION_BREACH' } },
    ]);
    expect(breached.timeline.immigrationBreaches[0].type).toBe(
      'CONDITION_BREACH',
    );
    expect(breached.result.shortCircuit).toBeUndefined();
    checkState(breached);
    const illegalEntry = inject(s, [
      { type: 'breach', breach: { type: 'ILLEGAL_ENTRY' } },
    ]);
    expect(illegalEntry.result.shortCircuit?.reason).toBe('IMMIGRATION_BREACH');
    expect(illegalEntry.ending).toBe('overstayed');
  });
  test('job changes replace future renewals without overlap and do not reverse calendar time', () => {
    let s = clearEvents();
    s.date = '2026-01-15';
    s = perform(refreshed(s), 'extend');
    const after = inject(s, [
      {
        type: 'newEpisode',
        episode: {
          route: 'SKILLED_WORKER',
          role: 'MAIN',
          salary: 55000,
          socCode: '2136',
        },
        durationMonths: 36,
      },
    ]);
    expect(after.timeline.episodes).toHaveLength(2);
    expect(after.timeline.episodes[0].validTo).toBe('2026-01-14');
    expect(after.timeline.episodes[1]).toMatchObject({
      validFrom: '2026-01-15',
      validTo: '2029-01-14',
    });
    checkState(after);
  });
  test('read-only narrative effects retain engine output and clamp attributes', () => {
    const s = clearEvents();
    const after = inject(s, [
      { type: 'stat', key: 'health', delta: 1000 },
      { type: 'stat', key: 'career', delta: -1000 },
      { type: 'money', delta: -20000 },
    ]);
    expect(after.stats.health).toBe(100);
    expect(after.stats.career).toBe(0);
    expect(after.stats.money).toBeLessThan(0);
    expect(after.result).toEqual(s.result);
  });
});
