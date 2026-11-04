import { afterEach, expect, test, vi } from 'vitest';
import {
  RULE_SETS,
  type RuleSet,
  type RuleSetId,
} from '@uk-immigration/engine';
import { PARAMETERS, RULE_SET_IDS } from '@uk-immigration/policy-data';

const CURRENT = 'current-law-2026-11';
const ANNOUNCED = 'earned-settlement-2026-11';
const FUTURE = 'current-law-test-future' as RuleSetId;
const OTHER = 'current-law-test-other' as RuleSetId;

afterEach(() => {
  vi.doUnmock('@uk-immigration/engine');
  vi.doUnmock('@uk-immigration/policy-data');
  vi.resetModules();
});

async function select(
  extra: RuleSet[],
  order: RuleSetId[],
  currentAsOf: string,
) {
  vi.doMock('@uk-immigration/engine', () => ({
    RULE_SETS: {
      ...RULE_SETS,
      ...Object.fromEntries(extra.map((set) => [set.id, set])),
    },
  }));
  vi.doMock('@uk-immigration/policy-data', () => ({
    RULE_SET_IDS: order,
    PARAMETERS: {
      ...PARAMETERS,
      [CURRENT]: { ...PARAMETERS[CURRENT], asOf: currentAsOf },
      ...Object.fromEntries(
        extra.map((set) => [
          set.id,
          { ...PARAMETERS[CURRENT], ruleSetId: set.id, asOf: '2027-01-05' },
        ]),
      ),
    },
  }));
  vi.resetModules();
  return import('../lib/policy');
}

test('without mocks the two production columns and policy date stay unchanged', async () => {
  const { allRuleSets, displayedRuleSets, policyAsOf } =
    await import('../lib/policy');
  expect(allRuleSets).toEqual(RULE_SET_IDS.map((id) => RULE_SETS[id]));
  expect(displayedRuleSets).toEqual([RULE_SETS[CURRENT], RULE_SETS[ANNOUNCED]]);
  expect(policyAsOf).toBe(PARAMETERS[ANNOUNCED].asOf);
});

test.each([
  [FUTURE, OTHER],
  [OTHER, FUTURE],
])(
  'the earliest effective date wins with registration order %s, %s',
  async (first, second) => {
    const future: RuleSet = {
      id: FUTURE,
      kind: 'LAW',
      status: 'IN_FORCE_FUTURE_VERSION',
      effectiveFrom: '2027-01-01',
      sources: RULE_SETS[CURRENT].sources,
    };
    const order: RuleSetId[] = [ANNOUNCED, first, CURRENT, second];
    const { allRuleSets, displayedRuleSets, policyAsOf } = await select(
      [future, { ...future, id: OTHER, effectiveFrom: '2027-02-01' }],
      order,
      '2027-03-01',
    );
    expect(allRuleSets.map((set) => set.id)).toEqual(order);
    expect(displayedRuleSets.map((set) => set.id)).toEqual([CURRENT, FUTURE]);
    expect(policyAsOf).toBe('2027-03-01');
  },
);

test('without future law the last announced ID wins regardless of registry insertion order', async () => {
  const newer: RuleSet = { ...RULE_SETS[ANNOUNCED], id: OTHER };
  const { displayedRuleSets } = await select(
    [newer],
    [OTHER, CURRENT, ANNOUNCED],
    PARAMETERS[CURRENT].asOf,
  );
  expect(displayedRuleSets.map((set) => set.id)).toEqual([CURRENT, ANNOUNCED]);
  const changed = await select(
    [newer],
    [ANNOUNCED, CURRENT, OTHER],
    PARAMETERS[CURRENT].asOf,
  );
  expect(changed.displayedRuleSets.map((set) => set.id)).toEqual([
    CURRENT,
    OTHER,
  ]);
});
