import { evaluate } from '@uk-immigration/engine';
import { currentLaw2026_11, RULE_SET_IDS } from '@uk-immigration/policy-data';
import { describe, expect, test } from 'vitest';
import {
  actions,
  act,
  achievements,
  characters,
  currentEvent,
  endQuarter,
  isOver,
  locations,
  narrative,
  newGame,
  progress,
  resolve,
  visaMonthsLeft,
} from '../src';
import type { Condition, Effect, GameEvent, GameState, Text } from '../src';
import { balance } from '../src/balance';
import { commonEvents, systemEvents } from '../src/events/common';
import { extensionCost, locationActions } from '../src/locations';

const LAW = 'current-law-2026-11';
function clearEvents(s = newGame('skilled-worker', 1)): GameState {
  const next = structuredClone(s);
  delete next.pendingEvent;
  next.eventQueue = [];
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
describe('v2 content contract', () => {
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
      expect(locations.some((l) => l.id === a.location)).toBe(true);
    }
    expect(locations).toHaveLength(8);
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
    expect(s.version).toBe(2);
    expect(s.date).toBe('2025-01-15');
    expect(s.actionsLeft).toBe(2);
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

describe('Before → Action → After', () => {
  test('work increases money and career, costs one AP, and leaves input untouched', () => {
    const before = clearEvents();
    const copy = structuredClone(before);
    const after = act(before, 'work');
    expect(after.stats.money).toBe(before.stats.money + balance.workMoney);
    expect(after.stats.career).toBe(before.stats.career + balance.workCareer);
    expect(after.actionsLeft).toBe(1);
    expect(before).toEqual(copy);
    expect(after.result).toEqual(before.result);
    expect(act(after, 'work').actionsLeft).toBe(0);
    expect(actions(act(after, 'work')).map((a) => a.id)).toEqual([
      'assessment',
    ]);
  });
  test('class does not grant evidence; B2 examination does, and B1 cannot downgrade it', () => {
    const before = clearEvents();
    before.stats.english = balance.englishB2 - balance.classEnglish;
    const studied = act(before, 'class');
    expect(studied.timeline.english).toEqual({ cefrLevel: 'B1' });
    const after = act(studied, 'exam');
    expect(after.timeline.english).toEqual({ cefrLevel: 'B2' });
    after.actionsLeft = 1;
    after.stats.english = balance.englishB1;
    expect(act(after, 'exam').timeline.english).toEqual({ cefrLevel: 'B2' });
    const low = clearEvents();
    low.stats.english = balance.englishB1 - 1;
    const failed = act(low, 'exam');
    expect(currentEvent(failed)?.id).toBe('system-exam-failed');
    expect(failed.timeline.english).toEqual(low.timeline.english);
    expect(resolve(failed, 'study').stats.english).toBeGreaterThan(
      low.stats.english,
    );
  });
  test('renewal charges sourced fee + IHS and appends a contiguous episode', () => {
    const before = clearEvents();
    before.date = '2026-01-15';
    refreshed(before);
    const oldEpisode = structuredClone(before.timeline.episodes[0]);
    expect(visaMonthsLeft(before)).toBeLessThanOrEqual(12);
    const after = act(before, 'extend');
    expect(after.stats.money).toBe(
      before.stats.money -
        currentLaw2026_11.values.skilledWorkerExtensionFeeInUk.value -
        currentLaw2026_11.values.immigrationHealthSurchargePerYear.value * 3,
    );
    expect(after.timeline.episodes).toHaveLength(2);
    expect(after.timeline.episodes[0]).toEqual(oldEpisode);
    expect(after.timeline.episodes[1]).toMatchObject({
      validFrom: '2027-01-15',
      validTo: '2030-01-14',
      salary: 38000,
    });
    expect(actions(after).some((a) => a.id === 'extend')).toBe(false);
    expect(before.timeline.episodes).toHaveLength(1);
    checkState(after);
    const early = clearEvents();
    expect(actions(early).some((a) => a.id === 'extend')).toBe(false);
    before.stats.money = extensionCost - 1;
    expect(actions(before).some((a) => a.id === 'extend')).toBe(false);
    before.stats.money = extensionCost;
    before.timeline.episodes[0].immigrationSalaryList = true;
    expect(actions(before).some((a) => a.id === 'extend')).toBe(false);
  });
  test('six-month trip records calendar absence and moves residence progress backwards', () => {
    const before = clearEvents();
    const pct = progress(before)[LAW].percent;
    const after = act(before, 'travel-6');
    expect(before.timeline.absences).toHaveLength(0);
    expect(after.timeline.absences).toEqual([
      { from: '2024-07-15', to: '2025-01-14' },
    ]);
    expect(progress(after)[LAW].percent).toBeLessThan(pct);
    expect(
      after.result.byRuleSet[LAW]!.rules.find(
        (r) => r.id === 'CL-SW-RESIDENCE-5Y',
      )?.status,
    ).toBe('FAIL');
    checkState(after);
  });
  test('quarterly income, promotion once per threshold, and renewed salary stay in sync', () => {
    const before = clearEvents();
    before.date = '2026-01-15';
    before.stats.career = balance.promotionThresholds[0] + balance.careerDecay;
    const renewed = act(refreshed(before), 'extend');
    const after = endQuarter(renewed);
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
    const next = endQuarter(clearEvents(after));
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
    const after = endQuarter(before);
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
    expect(isOver(after)).toBe(true);
    expect(endQuarter(after)).toEqual(after);
    expect(actions(after)).toEqual([]);
  });
  test('a granted adjoining renewal survives the old expiry boundary', () => {
    let s = clearEvents();
    s.date = '2027-01-14';
    s = act(refreshed(s), 'extend');
    s = endQuarter(s);
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
    const after = endQuarter(changed);
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
    const after = act(before, 'settle');
    expect(after.ending).toBe('settled');
    expect(after.stats.money).toBe(
      before.stats.money -
        currentLaw2026_11.values.settlementApplicationFee.value,
    );
    expect(after.achievements).toContain('settled');
    checkState(after);
    const unavailable = clearEvents();
    expect(actions(unavailable).some((a) => a.id === 'settle')).toBe(false);
  });
  test('leaving and a declared conviction reach their distinct endings', () => {
    const before = clearEvents();
    const left = act(before, 'leave');
    expect(left.ending).toBe('left');
    const criminal = inject(before, [{ type: 'criminal', event: {} }]);
    expect(criminal.result.shortCircuit?.reason).toBe('CRIMINALITY');
    expect(criminal.ending).toBe('criminal');
    expect(criminal.log.at(-1)?.kind).toBe('ending');
    expect(narrative(criminal).at(-1)?.en).toContain('conviction');
  });
  test('town hall is read-only with no AP; mail gives an event; pending events cannot be skipped', () => {
    const before = clearEvents();
    expect(act(before, 'assessment')).toEqual(before);
    const after = act(before, 'mail');
    expect(currentEvent(after)).toBeDefined();
    expect(after.actionsLeft).toBe(1);
    expect(() => endQuarter(after)).toThrow();
    expect(() => act(after, 'work')).toThrow();
    expect(() => resolve(after, 'unknown')).toThrow();
    expect(act(after, 'assessment')).toEqual(after);
  });
  test('two negative quarter ends trigger debt; moving reduces future costs', () => {
    let s = clearEvents();
    s.stats.money = -100000;
    s = clearEvents(endQuarter(s));
    expect(s.flags).toContain('negative-last-quarter');
    const second = endQuarter(s);
    expect(currentEvent(second)?.id).toBe('system-debt');
    const moved = clearEvents(resolve(second, 'move'));
    expect(moved.flags).toContain('cheap-housing');
    const after = endQuarter(moved);
    expect(after.stats.money - moved.stats.money).toBe(
      38000 / 4 - balance.livingCosts + balance.cheapHousingSaving,
    );
  });
  test('health and mood bottoms give real recovery or departure choices', () => {
    const before = clearEvents();
    before.stats.health = 1;
    before.stats.mood = 1;
    let after = act(before, 'overtime');
    expect(currentEvent(after)?.id).toBe('system-homesick');
    after = resolve(after, 'stay');
    expect(after.stats.mood).toBeGreaterThan(0);
    expect(currentEvent(after)?.id).toBe('system-hospital');
    after = resolve(after, 'recover');
    expect(after.stats.health).toBeGreaterThan(0);
    checkState(after);
  });
});

describe('event selection and effect compatibility', () => {
  test('all condition variants, seasons, once, required and forbidden flags govern weighted draws', () => {
    const original = characters[0].events;
    const common = commonEvents.splice(0);
    const template = original[0];
    const when: Condition[] = [
      { stat: 'money', min: 1, max: 20000 },
      { yearMin: 1, yearMax: 1 },
      { route: 'SKILLED_WORKER' },
      { flag: 'ready' },
      { visaMonthsLeftMax: 30 },
    ];
    const event: GameEvent = {
      ...template,
      id: 'conditional',
      once: true,
      season: 1,
      requires: ['ready'],
      forbids: ['blocked'],
      when,
    };
    characters[0].events = [event];
    try {
      const base = clearEvents();
      const pull = (s: GameState) => act(s, 'mail');
      expect(currentEvent(pull(base))).toBeUndefined();
      const enabled = { ...base, flags: ['ready'] };
      expect(currentEvent(pull(enabled))?.id).toBe('conditional');
      expect(
        currentEvent(pull({ ...enabled, flags: ['ready', 'blocked'] })),
      ).toBeUndefined();
      expect(currentEvent(pull({ ...enabled, quarter: 2 }))).toBeUndefined();
      expect(currentEvent(pull({ ...enabled, year: 2 }))).toBeUndefined();
      expect(
        currentEvent(
          pull({ ...enabled, stats: { ...enabled.stats, money: -1 } }),
        ),
      ).toBeUndefined();
      expect(
        currentEvent(pull({ ...enabled, firedEvents: ['conditional'] })),
      ).toBeUndefined();
      const seen = new Set<number>();
      characters[0].events = [
        { ...event, id: 'one', requires: [], when: [], weight: 1 },
        { ...event, id: 'two', requires: [], when: [], weight: 4 },
      ];
      const counts = { one: 0, two: 0 };
      for (let seed = 0; seed < 100; seed++) {
        const s = newGame('skilled-worker', seed);
        seen.add(s.eventQueue.length + 1);
        counts[currentEvent(s)!.id as keyof typeof counts]++;
      }
      expect([...seen].sort()).toEqual([1, 2]);
      expect(counts.two).toBeGreaterThan(counts.one);
    } finally {
      characters[0].events = original;
      commonEvents.push(...common);
    }
  });
  test('chains become drawable only after their opt-in choice', () => {
    const common = commonEvents.splice(0);
    const old = characters[0].events;
    const start = { ...common[0], season: undefined };
    const follow = common[1];
    characters[0].events = [start, follow];
    try {
      const before = newGame('skilled-worker', 3);
      expect(currentEvent(before)?.id).toBe(start.id);
      const resolved = resolve(before, 'plan');
      expect(resolved.flags).toContain('boiler-planned');
      const after = act(resolved, 'mail');
      expect(currentEvent(after)?.id).toBe(follow.id);
    } finally {
      commonEvents.push(...common);
      characters[0].events = old;
    }
  });
  test('queued event conditions are rechecked after the first choice', () => {
    const old = characters[0].events;
    const event: GameEvent = {
      ...old[0],
      id: 'queued',
      requires: ['keep'],
      once: false,
    };
    characters[0].events.push(event);
    try {
      const s = clearEvents();
      s.eventQueue = ['queued'];
      const after = inject(s, [{ type: 'none' }]);
      expect(currentEvent(after)).toBeUndefined();
    } finally {
      characters[0].events.pop();
    }
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
    s = act(refreshed(s), 'extend');
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

function play(seed: number, trace = false) {
  let s = newGame('skilled-worker', seed);
  let randomState = seed | 0;
  const pick = (n: number) => {
    randomState = (Math.imul(randomState, 1664525) + 1013904223) | 0;
    return (randomState >>> 0) % n;
  };
  const drain = () => {
    let count = 0;
    while (currentEvent(s)) {
      if (++count > 20) throw new Error('Unexpected event loop');
      const choices = currentEvent(s)!.choices.filter(
        (c) =>
          !c.effects.some((e) => e.type === 'ending' || e.type === 'criminal'),
      );
      s = resolve(s, choices[pick(choices.length)].id);
    }
  };
  for (let q = 0; q < 40; q++) {
    drain();
    for (let ap = 0; ap < 2; ap++) {
      const available = actions(s).filter(
        (a) => !['assessment', 'settle', 'leave'].includes(a.id),
      );
      const renewal = available.find((a) => a.id === 'extend');
      const selected = renewal ?? available[pick(available.length)];
      if (!selected) break;
      s = act(s, selected.id);
      drain();
    }
    s = endQuarter(s);
    if (trace)
      console.log(
        JSON.stringify({
          seed,
          quarter: q + 1,
          date: s.date,
          stats: s.stats,
          progress: progress(s),
          ending: s.ending,
        }),
      );
    // One engine equality check per quarter also catches stale cached results.
    checkState(s);
    if (isOver(s)) break;
  }
  return s;
}
describe('forty-quarter reproducibility', () => {
  for (let seed = 1; seed <= 20; seed++)
    test(`seed ${seed}: forty quarters, deterministic and JSON-restorable`, () => {
      const a = play(seed);
      const b = play(seed);
      expect(a).toEqual(b);
      expect(['timeout', 'overstayed']).toContain(a.ending);
      expect(
        a.log.filter((e) => e.kind === 'quarter').length,
      ).toBeLessThanOrEqual(40);
      expect(a).toEqual(JSON.parse(JSON.stringify(a)));
      expect(progress(a)).toHaveProperty(RULE_SET_IDS[0]);
    });
  test('serialized mid-quarter state continues with the same random stream', () => {
    const s = newGame('skilled-worker', 42, 'en');
    const choice = currentEvent(s)!.choices[0].id;
    const a = resolve(s, choice);
    const b = resolve(JSON.parse(JSON.stringify(s)), choice);
    expect(a).toEqual(b);
    expect(endQuarter(clearEvents(a))).toEqual(endQuarter(clearEvents(b)));
  });
  test('three seeded games print each played quarter through their ending', () => {
    for (const seed of [17, 42, 81])
      expect(['timeout', 'overstayed']).toContain(play(seed, true).ending);
  });
});

describe('achievement predicates and ending narrative', () => {
  test('at least eight achievements have reachable, independently inspectable predicates', () => {
    const state = clearEvents();
    for (let i = 0; i < 40; i++)
      state.log.push({
        year: Math.floor(i / 4) + 1,
        quarter: ((i % 4) + 1) as GameState['quarter'],
        kind: 'quarter',
        id: 'quarter',
        text: { zhCN: '一季', en: 'A quarter' },
      });
    state.stats.money = 10000;
    state.timeline.english = { cefrLevel: 'B2' };
    state.timeline.lifeInTheUk = { passed: true };
    state.flags = [
      'promoted',
      'friend-library',
      'friend-garden',
      'friend-neighbour',
    ];
    for (let i = 0; i < 2; i++)
      state.log.push({
        year: 1,
        quarter: 1,
        kind: 'action',
        id: 'extend',
        text: { zhCN: '续签', en: 'Renew' },
      });
    state.ending = 'settled';
    for (let i = 0; i < 3; i++)
      state.log.push({
        year: 1,
        quarter: 1,
        kind: 'event',
        id: `move-${i}`,
        choiceId: 'move',
        text: { zhCN: '搬家', en: 'Moved' },
      });
    state.result.byRuleSet[LAW]!.earliestDate = '2025-01-16';
    for (const achievement of achievements) {
      checkText(achievement.name);
      checkText(achievement.description);
      expect(achievement.check(state), achievement.id).toBe(true);
    }
    state.flags.push('worked-overtime');
    expect(achievements.find((a) => a.id === 'no-overtime')!.check(state)).toBe(
      false,
    );
    state.timeline.absences.push({ from: '2024-12-01', to: '2024-12-02' });
    expect(
      achievements.find((a) => a.id === 'five-years-home')!.check(state),
    ).toBe(false);
  });
  test('narrative includes actual event choice and bilingual terminal story', () => {
    const s = newGame('skilled-worker', 8);
    const e = currentEvent(s)!;
    const c = e.choices[0];
    const after = act(clearEvents(resolve(s, c.id)), 'leave');
    const story = narrative(after);
    expect(story.some((t) => t.zhCN.includes(c.label.zhCN))).toBe(true);
    story.forEach(checkText);
    expect(story.at(-1)?.zhCN).toContain('行李箱');
  });
});
