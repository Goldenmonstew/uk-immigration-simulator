import { evaluate, RULE_SETS } from '@uk-immigration/engine';
import type {
  DecisionOutcome,
  Locale,
  RuleSetId,
  SimulationResult,
} from '@uk-immigration/engine';
import { describe, expect, test } from 'vitest';
import {
  advance,
  changedRules,
  characters,
  choose,
  currentCard,
  isOver,
  LUCK_CHANCE,
  publicLuck,
  startGame,
  TURN_MONTHS,
  TURNS,
} from '../src';
import type { Character, Effect, GameState, LuckCard, Text } from '../src';

const LAW: RuleSetId = 'current-law-2026-11';
const REFORM: RuleSetId = 'earned-settlement-2026-11';
const outcomes: DecisionOutcome[] = [
  'LIKELY_ELIGIBLE',
  'LIKELY_NOT_ELIGIBLE',
  'POTENTIALLY_ELIGIBLE',
  'INSUFFICIENT_INFORMATION',
  'POLICY_NOT_YET_IN_FORCE',
  'REQUIRES_REGULATED_REVIEW',
];

function checkResult(result: SimulationResult) {
  expect(Object.keys(result.byRuleSet).sort()).toEqual(
    Object.keys(RULE_SETS).sort(),
  );
  for (const column of Object.values(result.byRuleSet))
    expect(outcomes).toContain(column!.outcome);
}

function checkText(text: Text) {
  expect(text.zhCN.trim()).not.toBe('');
  expect(text.en.trim()).not.toBe('');
  expect(text.zhCN).not.toContain('你应该');
  expect(text.en).not.toMatch(/you should/i);
}

function withoutLuck(state: GameState): GameState {
  const next = { ...state, phase: 'choice' as const };
  delete next.pendingLuck;
  return next;
}

function baselineAt(turn: number, characterId = characters[0].id): GameState {
  let state = withoutLuck(startGame(characterId, 0));
  while (state.turn < turn) {
    const card = currentCard(state)!;
    const choice =
      card.choices.find(
        (item) => !item.effects.some((effect) => effect.type === 'criminal'),
      ) ?? card.choices[0];
    state = withoutLuck(advance(choose(state, choice.id)));
  }
  return state;
}

function play(
  seed: number,
  avoidCriminality = false,
  locale: Locale = 'zh-CN',
  characterId = characters[0].id,
): GameState {
  let state = startGame(characterId, seed, locale);
  let steps = 0;
  while (!isOver(state)) {
    expect(++steps).toBeLessThanOrEqual(TURNS * 2);
    const card = currentCard(state)!;
    expect(card).toBeDefined();
    const choice =
      (avoidCriminality &&
        card.choices.find(
          (item) => !item.effects.some((effect) => effect.type === 'criminal'),
        )) ||
      card.choices[0];
    state = choose(state, choice.id);
    checkResult(state.result);
    if (!isOver(state) && !currentCard(state)) state = advance(state);
  }
  return state;
}

// Exercise the public API with small, temporary content rather than exporting
// an internal effect runner solely for tests.
function effectStep(effects: Effect[], date = '2025-01-15'): GameState {
  const character: Character = structuredClone(characters[0]);
  character.id = 'test-effects';
  character.startDate = date;
  character.script[0].choices[0].effects = effects;
  characters.push(character);
  try {
    const state = withoutLuck(startGame(character.id, 0));
    const before = structuredClone(state);
    const next = choose(state, character.script[0].choices[0].id);
    expect(state).toEqual(before);
    checkResult(next.result);
    return { ...next, characterId: characters[0].id };
  } finally {
    characters.pop();
  }
}

describe('content schema and engine compatibility', () => {
  test('bilingual content, card shapes and globally unique card ids', () => {
    const cards = [...publicLuck];
    const allIds: string[] = [];
    expect(publicLuck.length).toBeGreaterThanOrEqual(8);
    for (const character of characters) {
      checkText(character.name);
      checkText(character.intro);
      expect(character.script).toHaveLength(TURNS);
      expect(
        character.timeline.episodes.some(
          (episode) =>
            episode.validFrom <= character.startDate &&
            episode.validTo > character.startDate,
        ),
      ).toBe(true);
      cards.push(...character.luckPool);
      for (const card of character.script) {
        expect(card.kind).toBe('choice');
        expect(card.choices.length).toBeGreaterThanOrEqual(2);
        expect(card.choices.length).toBeLessThanOrEqual(3);
      }
      allIds.push(...character.script.map((card) => card.id));
    }
    const allCards = [
      ...cards,
      ...characters.flatMap((character) => character.script),
    ];
    for (const card of allCards) {
      checkText(card.title);
      checkText(card.text);
      expect(new Set(card.choices.map((choice) => choice.id)).size).toBe(
        card.choices.length,
      );
      for (const choice of card.choices) {
        checkText(choice.label);
        if (choice.note) checkText(choice.note);
        expect(choice.effects.length).toBeGreaterThan(0);
      }
      if (card.kind === 'luck') {
        expect(card.choices).toHaveLength(1);
        expect(card.choices[0].label).toEqual({ zhCN: '知道了', en: 'Noted' });
      }
    }
    allIds.push(...cards.map((card) => card.id));
    expect(new Set(allIds).size).toBe(allIds.length);
  });

  for (const character of characters) {
    for (let turn = 1; turn <= TURNS; turn++) {
      test(`${character.id}: every choice and luck card evaluates on turn ${turn}'s baseline`, () => {
        const baseline = baselineAt(turn, character.id);
        const card = currentCard(baseline)!;
        for (const choice of card.choices) {
          const next = choose(baseline, choice.id);
          checkResult(next.result);
          expect(next.result).toEqual(
            evaluate({
              simulationDate: next.simulationDate,
              timeline: next.timeline,
              locale: next.locale,
            }),
          );
        }
        for (const luck of [...publicLuck, ...character.luckPool]) {
          const state = {
            ...baseline,
            phase: 'luck' as const,
            pendingLuck: luck.id,
          };
          checkResult(choose(state, luck.choices[0].id).result);
        }
      });
    }
  }
});

describe('turns, replay and endings', () => {
  for (const character of characters) {
    for (const seed of [
      ...Array.from({ length: 10 }, (_, index) => index),
      17,
      42,
    ]) {
      test(`${character.id}, seed ${seed}: ten-turn play is deterministic`, () => {
        const state = play(seed, true, 'zh-CN', character.id);
        expect(state).toEqual(play(seed, true, 'zh-CN', character.id));
        expect(state.turn).toBe(TURNS);
        expect(
          state.log.filter((entry) =>
            character.script.some((card) => card.id === entry.cardId),
          ),
        ).toHaveLength(TURNS);
        expect(new Set(state.drawnLuck).size).toBe(state.drawnLuck.length);
        expect(currentCard(state)).toBeUndefined();
        expect(advance(state)).toBe(state);
      });
    }
    test(`${character.id}: English replay survives JSON persistence`, () => {
      const initial = startGame(character.id, 42, 'en');
      const restored: GameState = JSON.parse(JSON.stringify(initial));
      const card = currentCard(initial)!;
      expect(choose(restored, card.choices[0].id)).toEqual(
        choose(initial, card.choices[0].id),
      );
      expect(play(42, true, 'en', character.id)).toEqual(
        play(42, true, 'en', character.id),
      );
    });
  }

  test('framework and protection short circuits leave the game running', () => {
    for (const [route, role, reason] of [
      ['HONG_KONG_BNO', 'MAIN', 'OUTSIDE_FRAMEWORK'],
      ['CORE_PROTECTION', 'DEPENDANT', 'PROTECTION'],
    ] as const) {
      const state = effectStep([{ type: 'episode', patch: { route, role } }]);
      expect(state.result.shortCircuit?.reason).toBe(reason);
      expect(state.result.byRuleSet[REFORM]?.outcome).toBe(
        'REQUIRES_REGULATED_REVIEW',
      );
      expect(state.result.byRuleSet[LAW]?.outcome).not.toBe(
        'REQUIRES_REGULATED_REVIEW',
      );
      expect(isOver(state)).toBe(false);
      expect(advance(state).turn).toBe(2);
    }
  });

  test('adult illegal entry ends the game for both columns', () => {
    const state = effectStep([
      { type: 'breach', breach: { type: 'ILLEGAL_ENTRY' } },
    ]);
    expect(state.result.shortCircuit?.reason).toBe('IMMIGRATION_BREACH');
    expect(isOver(state)).toBe(true);
  });

  test('constants and boundary inputs', () => {
    expect([TURNS, TURN_MONTHS, LUCK_CHANCE]).toEqual([10, 12, 0.5]);
    expect(() => startGame('missing', 0)).toThrow('Unknown character');
    const state = startGame(characters[0].id, 0);
    expect(() => choose(state, 'missing')).toThrow('Choice is not available');
    expect(() => advance(state)).toThrow('Resolve this turn');
  });

  for (let seed = 0; seed < 10; seed++) {
    test(`seed ${seed}: deterministic first-choice play ends with review`, () => {
      const state = play(seed);
      expect(state).toEqual(play(seed));
      expect(state.turn).toBe(7);
      expect(state.phase).toBe('ended');
      expect(state.log.length).toBeGreaterThanOrEqual(state.turn);
      expect(state.log.length).toBeLessThanOrEqual(state.turn * 2);
      expect(
        state.log.filter((entry) =>
          characters[0].script.some((card) => card.id === entry.cardId),
        ),
      ).toHaveLength(7);
      expect(new Set(state.drawnLuck).size).toBe(state.drawnLuck.length);
      expect(currentCard(state)).toBeUndefined();
      expect(advance(state)).toBe(state);
      expect(() => choose(state, 'conviction')).toThrow();
    });
  }

  test('a non-criminal path resolves all ten turns, including the tenth card', () => {
    for (const seed of [17, 42]) {
      const state = play(seed, true);
      expect(state.turn).toBe(TURNS);
      expect(state.simulationDate).toBe('2034-01-15');
      expect(state.phase).toBe('ended');
      expect(
        state.log.filter((entry) => entry.cardId.startsWith('sw-')),
      ).toHaveLength(TURNS);
      expect(state.result.shortCircuit).toBeUndefined();
    }
  });

  test('luck precedes choice; selected choices cannot be selected twice or skipped', () => {
    const state = startGame(characters[0].id, 0);
    expect(state.phase).toBe('luck');
    const card = currentCard(state)!;
    const choiceState = choose(state, card.choices[0].id);
    expect(choiceState.phase).toBe('choice');
    expect(choiceState.pendingLuck).toBeUndefined();
    expect(choiceState.turn).toBe(state.turn);
    expect(choiceState.simulationDate).toBe(state.simulationDate);
    expect(choiceState.log[0].before).toEqual(state.result);
    expect(choiceState.log[0].after).toEqual(choiceState.result);
    expect(() => advance(choiceState)).toThrow();
    const selected = choose(
      choiceState,
      currentCard(choiceState)!.choices[0].id,
    );
    expect(currentCard(selected)).toBeUndefined();
    expect(() => choose(selected, 'take-b2')).toThrow();
    const next = advance(selected);
    expect(next.turn).toBe(2);
    expect(next.simulationDate).toBe('2026-01-15');
    expect(next.log).toHaveLength(2);
    expect(next.result).toEqual(
      evaluate({
        simulationDate: next.simulationDate,
        timeline: next.timeline,
        locale: next.locale,
      }),
    );
  });

  test('locale and deterministic draws survive JSON persistence', () => {
    const initial = startGame(characters[0].id, 42, 'en');
    const restored: GameState = JSON.parse(JSON.stringify(initial));
    const step = (state: GameState) => {
      while (currentCard(state))
        state = choose(state, currentCard(state)!.choices[0].id);
      return advance(state);
    };
    expect(step(restored)).toEqual(step(initial));
    expect(step(restored).locale).toBe('en');
    expect(play(42, true, 'en')).toEqual(play(42, true, 'en'));
    expect(initial.result).toEqual(
      evaluate({
        simulationDate: initial.simulationDate,
        timeline: initial.timeline,
        locale: 'en',
      }),
    );
  });

  test('pool exhaustion falls back to choice without repeats', () => {
    const state = withoutLuck(startGame(characters[0].id, 0));
    state.drawnLuck = publicLuck.map((card) => card.id);
    const next = advance(choose(state, currentCard(state)!.choices[0].id));
    expect(next.phase).toBe('choice');
    expect(next.drawnLuck).toEqual(state.drawnLuck);
  });

  test('character-specific luck joins the public pool', () => {
    const state = baselineAt(1);
    const card: LuckCard = {
      ...structuredClone(publicLuck[0]),
      id: 'test-personal-luck',
    };
    const character = characters[0];
    character.luckPool.push(card);
    try {
      expect(
        currentCard({ ...state, phase: 'luck', pendingLuck: card.id }),
      ).toEqual(card);
      state.drawnLuck = publicLuck.map((item) => item.id);
      const next = advance(choose(state, currentCard(state)!.choices[0].id));
      expect(next.pendingLuck).toBe(card.id);
    } finally {
      character.luckPool.pop();
    }
  });
});

describe('effect transformations', () => {
  test.each([
    ['2025-01-15', '2024-25'],
    ['2025-04-05', '2024-25'],
    ['2025-04-06', '2025-26'],
    ['2025-06-01', '2025-26'],
  ])(
    'advance carries salary into the tax year ending after %s',
    (date, taxYear) => {
      const state = effectStep([{ type: 'none' }], date);
      state.timeline.incomeYears = [
        { taxYear: '2023-24', earnings: 8500, partnerEarnings: 20000 },
      ];
      const before = structuredClone(state);
      const next = advance(state);
      expect(
        next.timeline.incomeYears.find((year) => year.taxYear === taxYear),
      ).toEqual({ taxYear, earnings: 38000 });
      expect(state).toEqual(before);
      expect(next.result).toEqual(
        evaluate({
          simulationDate: next.simulationDate,
          timeline: next.timeline,
          locale: next.locale,
        }),
      );
    },
  );

  test('advance fills missing earnings on a partner-only record without carrying partner earnings forward', () => {
    const state = effectStep(
      [{ type: 'income', taxYear: 'current', partnerEarnings: 20000 }],
      '2025-06-01',
    );
    const next = advance(state);
    expect(
      next.timeline.incomeYears.find((year) => year.taxYear === '2025-26'),
    ).toEqual({ taxYear: '2025-26', earnings: 38000, partnerEarnings: 20000 });
    const later = advance(choose(withoutLuck(next), 'apart'));
    expect(
      later.timeline.incomeYears.find((year) => year.taxYear === '2026-27'),
    ).toEqual({ taxYear: '2026-27', earnings: 38000 });
  });

  test.each([0, 42000])(
    'advance preserves card earnings of £%i and next-year earnings',
    (earnings) => {
      const state = effectStep(
        [
          { type: 'income', taxYear: 'current', earnings },
          { type: 'income', taxYear: 'next', earnings: 55000 },
        ],
        '2025-06-01',
      );
      const next = advance(state);
      expect(
        next.timeline.incomeYears.find((year) => year.taxYear === '2025-26')
          ?.earnings,
      ).toBe(earnings);
      expect(
        next.timeline.incomeYears.find((year) => year.taxYear === '2026-27')
          ?.earnings,
      ).toBe(55000);
    },
  );

  test('advance uses the current salary and leaves earnings unknown when it is absent', () => {
    const state = effectStep(
      [{ type: 'episode', patch: { salary: 44000 } }],
      '2025-06-01',
    );
    expect(
      advance(state).timeline.incomeYears.find(
        (year) => year.taxYear === '2025-26',
      )?.earnings,
    ).toBe(44000);
    delete state.timeline.episodes[0].salary;
    expect(
      advance(state).timeline.incomeYears.some(
        (year) => year.taxYear === '2025-26',
      ),
    ).toBe(false);
  });

  test('absence uses inclusive day counts and signed offsets', () => {
    expect(
      effectStep([{ type: 'absence', startOffsetDays: -3, days: 3 }]).timeline
        .absences,
    ).toEqual([{ from: '2025-01-12', to: '2025-01-14' }]);
  });

  test('income upserts the UK tax year and preserves fields omitted by an effect', () => {
    const state = effectStep(
      [
        { type: 'income', taxYear: 'current', earnings: 0 },
        { type: 'income', taxYear: 'current', partnerEarnings: 23000 },
        { type: 'income', taxYear: 'next', earnings: 55000 },
      ],
      '2025-04-05',
    );
    expect(
      state.timeline.incomeYears.filter((year) => year.taxYear === '2024-25'),
    ).toEqual([{ taxYear: '2024-25', earnings: 0, partnerEarnings: 23000 }]);
    expect(
      state.timeline.incomeYears.find((year) => year.taxYear === '2025-26')
        ?.earnings,
    ).toBe(55000);
    expect(
      effectStep(
        [{ type: 'income', taxYear: 'current', earnings: 42000 }],
        '2025-04-06',
      ).timeline.incomeYears.at(-1)?.taxYear,
    ).toBe('2025-26');
  });

  test('episode patch and new permission truncate history and preserve a gap', () => {
    const next = effectStep(
      [
        { type: 'episode', patch: { salary: 45000 } },
        {
          type: 'newEpisode',
          episode: {
            route: 'SKILLED_WORKER',
            role: 'MAIN',
            salary: 55000,
            socCode: '2136',
          },
          durationMonths: 1,
          gapDays: 3,
        },
      ],
      '2025-01-28',
    );
    expect(next.timeline.episodes[0]).toMatchObject({
      validFrom: '2024-01-15',
      validTo: '2025-01-27',
      salary: 45000,
    });
    expect(next.timeline.episodes[1]).toMatchObject({
      validFrom: '2025-01-31',
      validTo: '2025-02-27',
      salary: 55000,
    });
    const sameDay = effectStep(
      [
        {
          type: 'newEpisode',
          episode: { route: 'SKILLED_WORKER', role: 'MAIN' },
          durationMonths: 12,
        },
      ],
      '2024-01-15',
    );
    expect(sameDay.timeline.episodes).toHaveLength(1);
    expect(sameDay.timeline.episodes[0].validTo).toBe('2025-01-14');
  });

  test('fixed and ongoing benefits, relationship replacement and evidence', () => {
    const state = effectStep([
      {
        type: 'benefit',
        benefit: { benefitType: 'UNIVERSAL_CREDIT' },
        startOffsetDays: 0,
        months: 1,
      },
      {
        type: 'benefit',
        benefit: { benefitType: 'CHILD_BENEFIT' },
        startOffsetDays: 1,
      },
      {
        type: 'relationship',
        add: { type: 'PARTNER', otherPartyStatus: 'OTHER' },
      },
      {
        type: 'relationship',
        remove: 'PARTNER',
        add: { type: 'PARTNER', otherPartyStatus: 'BRITISH_CITIZEN' },
      },
      { type: 'english', cefrLevel: 'B2' },
      { type: 'lifeInTheUk' },
    ]);
    expect(state.timeline.benefits).toEqual([
      { benefitType: 'UNIVERSAL_CREDIT', from: '2025-01-15', to: '2025-02-14' },
      { benefitType: 'CHILD_BENEFIT', from: '2025-01-16' },
    ]);
    expect(state.timeline.relationships).toEqual([
      { type: 'PARTNER', otherPartyStatus: 'BRITISH_CITIZEN' },
    ]);
    expect(state.timeline.english).toEqual({ cefrLevel: 'B2' });
    expect(state.timeline.lifeInTheUk).toEqual({ passed: true });
  });

  test('breach, criminal and timeline fields are passed to the engine', () => {
    const state = effectStep([
      {
        type: 'timeline',
        patch: {
          cashSavings: 0,
          partnerSpecifiedBenefit: false,
          governmentDebt: { outstanding: true },
        },
      },
      { type: 'breach', breach: { type: 'OVERSTAYING' }, offsetDays: -1 },
      { type: 'criminal', event: {}, offsetDays: -2 },
    ]);
    expect(state.timeline).toMatchObject({
      cashSavings: 0,
      partnerSpecifiedBenefit: false,
      governmentDebt: { outstanding: true },
      immigrationBreaches: [{ type: 'OVERSTAYING', date: '2025-01-14' }],
      criminalRecord: [{ date: '2025-01-13' }],
    });
    expect(state.result.shortCircuit?.reason).toBe('CRIMINALITY');
    expect(state.phase).toBe('ended');
  });

  test('narrative effects preserve the timeline and engine result', () => {
    const state = effectStep([{ type: 'none' }]);
    expect(state.timeline).toEqual(characters[0].timeline);
    expect(state.log[0].before).toEqual(state.log[0].after);
  });
});

describe('known card consequences and changed rules', () => {
  test('Life in the UK is available on turn four before the five-year node', () => {
    expect(currentCard(baselineAt(4))?.id).toBe('sw-life-in-uk');
    const state = baselineAt(5);
    expect(state.timeline.lifeInTheUk).toEqual({ passed: true });
    expect(state.result.byRuleSet[LAW]?.outcome).toBe('LIKELY_ELIGIBLE');
    expect(state.result.byRuleSet[LAW]?.pathwayYears).toBe(5);
  });

  test('eight-month assignment changes the current-law residence rule from PASS to FAIL', () => {
    const state = baselineAt(5);
    const after = choose(state, 'abroad');
    expect(changedRules(state.result, after.result, LAW)).toContainEqual({
      id: 'CL-SW-RESIDENCE-5Y',
      before: 'PASS',
      after: 'FAIL',
    });
    expect(changedRules(state.result, state.result, LAW)).toEqual([]);
    expect(state.timeline.absences).toEqual([]);
  });

  test('a declared drink-driving conviction short-circuits both columns', () => {
    const after = choose(baselineAt(7), 'conviction');
    expect(after.result.shortCircuit?.reason).toBe('CRIMINALITY');
    for (const id of [LAW, REFORM])
      expect(after.result.byRuleSet[id]?.outcome).toBe(
        'REQUIRES_REGULATED_REVIEW',
      );
    expect(isOver(after)).toBe(true);
  });

  test('UC records the applicant’s public funds; borrowing does not', () => {
    const state = baselineAt(9);
    const received = choose(state, 'claim');
    expect(changedRules(state.result, received.result, REFORM)).toContainEqual({
      id: 'ES-PUBLIC-FUNDS',
      before: 'PASS',
      after: 'FAIL',
    });
    expect(choose(state, 'borrow').timeline.benefits).toEqual([]);
  });

  test('B2 evidence changes the reform English status', () => {
    const state = baselineAt(1);
    const after = choose(state, 'take-b2');
    expect(changedRules(state.result, after.result, REFORM)).toContainEqual({
      id: 'ES-ENGLISH-B2',
      before: 'FAIL',
      after: 'PASS',
    });
  });
});

describe('HK BN(O) character consequences', () => {
  const id = 'hong-kong-bno';

  test('the opening outside-framework column does not end the game', () => {
    const state = startGame(id, 17);
    expect(state.result.shortCircuit?.reason).toBe('OUTSIDE_FRAMEWORK');
    expect(state.result.shortCircuit?.message).toContain('B2');
    expect(isOver(state)).toBe(false);
    expect(currentCard(state)).toBeDefined();
    expect(
      state.result.byRuleSet[REFORM]?.rules.find(
        (rule) => rule.id === 'ES-ENGLISH-B2',
      )?.status,
    ).toBe('FAIL');
    expect(
      state.result.byRuleSet[LAW]?.rules.find(
        (rule) => rule.id === 'CL-ENGLISH',
      )?.status,
    ).toBe('PASS');
  });

  test('a long holiday changes the five-year residence rule from PASS to FAIL', () => {
    const state = baselineAt(5, id);
    expect(state.result.byRuleSet[LAW]?.outcome).toBe('LIKELY_ELIGIBLE');
    expect(state.result.byRuleSet[LAW]?.pathwayYears).toBe(5);
    const after = choose(state, 'long-holiday');
    expect(changedRules(state.result, after.result, LAW)).toContainEqual({
      id: 'CL-HKBNO-RESIDENCE-5Y',
      before: 'PASS',
      after: 'FAIL',
    });
    expect(after.result.byRuleSet[LAW]?.earliestDate).not.toBe(
      state.result.byRuleSet[LAW]?.earliestDate,
    );
    expect(isOver(after)).toBe(false);
  });

  test('B2 changes the reform English rule while current-law B1 remains sufficient', () => {
    const state = baselineAt(6, id);
    expect(state.simulationDate > '2027-03-26').toBe(true);
    const after = choose(state, 'take-b2');
    expect(changedRules(state.result, after.result, REFORM)).toContainEqual({
      id: 'ES-ENGLISH-B2',
      before: 'FAIL',
      after: 'PASS',
    });
    expect(
      changedRules(state.result, after.result, LAW).map((rule) => rule.id),
    ).not.toContain('CL-ENGLISH');
    expect(after.result.shortCircuit?.reason).toBe('OUTSIDE_FRAMEWORK');
  });

  test('renewal adjoins a 30-month BN(O) permission and baseline permissions cover all turns', () => {
    const state = baselineAt(4, id);
    const after = choose(state, 'renew');
    expect(after.timeline.episodes).toEqual([
      {
        route: 'HONG_KONG_BNO',
        role: 'MAIN',
        validFrom: '2022-07-01',
        validTo: '2026-06-30',
      },
      {
        route: 'HONG_KONG_BNO',
        role: 'MAIN',
        validFrom: '2026-07-01',
        validTo: '2028-12-31',
      },
    ]);
    for (let turn = 1; turn <= TURNS; turn++) {
      const baseline = baselineAt(turn, id);
      expect(
        baseline.timeline.episodes.some(
          (episode) =>
            episode.validFrom <= baseline.simulationDate &&
            baseline.simulationDate <= episode.validTo,
        ),
      ).toBe(true);
      expect(baseline.result.shortCircuit?.reason).toBe('OUTSIDE_FRAMEWORK');
    }
  });

  test('public funds do not remove the outside-framework boundary or end play', () => {
    const state = baselineAt(9, id);
    const after = choose(state, 'claim');
    expect(changedRules(state.result, after.result, REFORM)).toContainEqual({
      id: 'ES-PUBLIC-FUNDS',
      before: 'PASS',
      after: 'FAIL',
    });
    expect(after.result.shortCircuit?.reason).toBe('OUTSIDE_FRAMEWORK');
    expect(after.result.byRuleSet[LAW]?.outcome).not.toBe(
      'REQUIRES_REGULATED_REVIEW',
    );
    expect(isOver(after)).toBe(false);
    expect(choose(state, 'use-savings').timeline.benefits).toEqual([]);
  });

  test('a conviction replaces outside-framework with review in both columns', () => {
    const after = choose(baselineAt(10, id), 'conviction');
    expect(after.result.shortCircuit?.reason).toBe('CRIMINALITY');
    for (const ruleSet of [LAW, REFORM])
      expect(after.result.byRuleSet[ruleSet]?.outcome).toBe(
        'REQUIRES_REGULATED_REVIEW',
      );
    expect(isOver(after)).toBe(true);
  });
});

describe('British citizen’s partner character consequences', () => {
  const id = 'family-partner';
  const financial = (state: GameState) =>
    state.result.byRuleSet[LAW]?.rules.find(
      (rule) => rule.id === 'CL-FAMILY-FINANCIAL',
    );

  test('post-cutoff arrival uses combined earnings and the general financial requirement', () => {
    const state = startGame(id, 17);
    expect(state.timeline.episodes[0]).toMatchObject({
      validFrom: '2024-06-01',
      familyPermission: 'PARTNER_FIVE_YEAR',
      salary: 12000,
    });
    expect(state.timeline.relationships).toContainEqual({
      type: 'PARTNER',
      otherPartyStatus: 'BRITISH_CITIZEN',
    });
    expect(financial(state)?.status).toBe('PASS');
    expect(financial(state)?.explanation).toContain('29,000');
    expect(
      state.result.byRuleSet[REFORM]?.rules.find(
        (rule) => rule.id === 'ES-BRITISH-CONNECTION',
      )?.status,
    ).toBe('PASS');
    expect(currentCard(state)).toBeDefined();
  });

  test('the 2026 renewal retains the five-year permission and covers the next turn', () => {
    const state = baselineAt(2, id);
    for (const choice of currentCard(state)!.choices) {
      const after = choose(state, choice.id);
      expect(after.timeline.episodes.at(-1)).toMatchObject({
        route: 'FAMILY_PARTNER_OR_PARENT',
        role: 'MAIN',
        familyPermission: 'PARTNER_FIVE_YEAR',
        validFrom: '2026-11-30',
        validTo: '2029-05-29',
      });
      expect(after.timeline.episodes[0].validTo).toBe('2026-11-29');
    }
    for (let turn = 1; turn <= TURNS; turn++) {
      const baseline = baselineAt(turn, id);
      expect(
        baseline.timeline.episodes.some(
          (episode) =>
            episode.validFrom <= baseline.simulationDate &&
            baseline.simulationDate <= episode.validTo &&
            episode.familyPermission === 'PARTNER_FIVE_YEAR',
        ),
      ).toBe(true);
    }
  });

  test('B2 evidence changes both English rules after the current-law change date', () => {
    const state = baselineAt(3, id);
    const after = choose(state, 'take-b2');
    expect(changedRules(state.result, after.result, LAW)).toContainEqual({
      id: 'CL-ENGLISH',
      before: 'FAIL',
      after: 'PASS',
    });
    expect(changedRules(state.result, after.result, REFORM)).toContainEqual({
      id: 'ES-ENGLISH-B2',
      before: 'FAIL',
      after: 'PASS',
    });
    expect(choose(state, 'wait').timeline.english).toEqual(
      state.timeline.english,
    );
  });

  test('the five-year node has both language evidence and a British-connection pathway', () => {
    const state = baselineAt(5, id);
    expect(state.timeline.lifeInTheUk).toEqual({ passed: true });
    expect(state.result.byRuleSet[LAW]?.outcome).toBe('LIKELY_ELIGIBLE');
    expect(state.result.byRuleSet[LAW]?.pathwayYears).toBe(5);
    expect(state.result.byRuleSet[REFORM]?.pathwayYears).toBe(5);
  });

  test('claiming UC changes the reform pathway while current law still assesses settlement', () => {
    const state = baselineAt(5, id);
    const after = choose(state, 'claim');
    expect(changedRules(state.result, after.result, REFORM)).toContainEqual({
      id: 'ES-PUBLIC-FUNDS',
      before: 'PASS',
      after: 'FAIL',
    });
    expect(after.result.byRuleSet[REFORM]?.pathwayYears).toBe(20);
    expect(after.result.byRuleSet[LAW]?.outcome).toBe(
      state.result.byRuleSet[LAW]?.outcome,
    );
    expect(choose(state, 'cut-spending').timeline.benefits).toEqual([]);
    expect(
      advance(after).timeline.incomeYears.find(
        (year) => year.taxYear === '2029-30',
      ),
    ).toEqual({ taxYear: '2029-30', earnings: 20000, partnerEarnings: 0 });
  });

  test('cash savings change the financial rule from FAIL to PASS after partner unemployment', () => {
    const state = baselineAt(6, id);
    expect(financial(state)?.status).toBe('FAIL');
    const after = choose(state, 'save');
    expect(changedRules(state.result, after.result, LAW)).toContainEqual({
      id: 'CL-FAMILY-FINANCIAL',
      before: 'FAIL',
      after: 'PASS',
    });
    expect(after.timeline.cashSavings).toBe(25000);
    expect(financial(choose(state, 'buy-car'))?.status).toBe('FAIL');
  });

  test('PIP uses the unmodelled maintenance alternative when earnings and savings are insufficient', () => {
    const state = withoutLuck(advance(choose(baselineAt(6, id), 'buy-car')));
    const after = choose(state, 'pip-awarded');
    expect(changedRules(state.result, after.result, LAW)).toContainEqual({
      id: 'CL-FAMILY-FINANCIAL',
      before: 'FAIL',
      after: 'UNKNOWN',
    });
    expect(financial(after)?.pendingDetails).toContain('PD-075');
    expect(after.timeline.benefits).toEqual(state.timeline.benefits);
    expect(financial(choose(state, 'pip-pending'))?.status).toBe('FAIL');
    expect(financial(choose(baselineAt(7, id), 'pip-awarded'))?.status).toBe(
      'PASS',
    );
  });

  test('five-year family residence does not silently apply the standard absence reset', () => {
    const state = baselineAt(8, id);
    const after = choose(state, 'seven-months');
    expect(after.timeline.absences.at(-1)).toEqual({
      from: '2032-05-04',
      to: '2032-11-29',
    });
    expect(
      after.result.byRuleSet[LAW]?.rules.find(
        (rule) => rule.id === 'CL-FAMILY-RESIDENCE',
      )?.status,
    ).toBe('PASS');
    expect(after.result.byRuleSet[LAW]?.earliestDate).toBe(
      state.result.byRuleSet[LAW]?.earliestDate,
    );
    expect(
      changedRules(state.result, after.result, LAW).map((rule) => rule.id),
    ).not.toContain('CL-FAMILY-RESIDENCE');
  });

  test('birth is narrative only and a conviction still stops both columns', () => {
    const state = baselineAt(9, id);
    for (const choice of currentCard(state)!.choices)
      expect(choose(state, choice.id).result).toEqual(state.result);
    const after = choose(baselineAt(10, id), 'conviction');
    expect(after.result.shortCircuit?.reason).toBe('CRIMINALITY');
    for (const ruleSet of [LAW, REFORM])
      expect(after.result.byRuleSet[ruleSet]?.outcome).toBe(
        'REQUIRES_REGULATED_REVIEW',
      );
    expect(isOver(after)).toBe(true);
  });
});
