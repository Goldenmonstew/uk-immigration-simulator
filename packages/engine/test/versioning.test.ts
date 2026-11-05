import {
  currentLaw2026_11,
  PARAMETERS,
  RULE_SET_IDS,
} from '@uk-immigration/policy-data';
import type { ParameterSet, RuleSetId } from '@uk-immigration/policy-data';
import { fixtures } from '@uk-immigration/policy-data/fixtures';
import { describe, expect, test } from 'vitest';
import { evaluate, RULE_SETS } from '../src/evaluate';
import { runRule, withRuleSet } from '../src/rule';
import { RULES } from '../src/rules';
import type { RuleSet, RuleSetRegistry } from '../src/types';
import { SAMPLES, SIMULATION_DATE } from './helpers';

const FUTURE = 'current-law-test-future' as RuleSetId;

// Rule set versioning (contracts §13).

describe('registration (§13.2)', () => {
  test('RULE_SETS, RULES and PARAMETERS are keyed by RULE_SET_IDS', () => {
    for (const registry of [RULE_SETS, RULES, PARAMETERS]) {
      expect(Object.keys(registry).sort()).toEqual([...RULE_SET_IDS].sort());
    }
    for (const id of RULE_SET_IDS) {
      expect(RULE_SETS[id].id).toBe(id);
      expect(PARAMETERS[id].ruleSetId).toBe(id);
      expect(RULES[id].every((rule) => rule.meta.ruleSetId === id)).toBe(true);
    }
  });
});

describe('parameter files carried over with basedOn (§13.5)', () => {
  test('spreading the earlier values keeps them; one value is overridden', () => {
    const v = currentLaw2026_11.values;
    const future = {
      ruleSetId: FUTURE,
      basedOn: 'current-law-2026-11',
      asOf: '2027-01-05',
      values: {
        ...v,
        longResidenceQualifyingYears: {
          value: v.longResidenceQualifyingYears.value + 1,
          sources: [{ srcId: 'SRC-TEST', locator: 'LR 3.1' }],
        },
      },
    } satisfies ParameterSet;
    expect(future.values.skilledWorkerQualifyingYears).toBe(
      v.skilledWorkerQualifyingYears,
    );
    expect(future.values.longResidenceQualifyingYears.value).toBe(
      v.longResidenceQualifyingYears.value + 1,
    );
    expect(future.values.longResidenceQualifyingYears.sources).not.toEqual(
      v.longResidenceQualifyingYears.sources,
    );
  });
});

describe('withRuleSet (§13.4)', () => {
  test('only meta.ruleSetId changes; the check gives the same result', () => {
    for (const rule of RULES['current-law-2026-11']) {
      const copy = withRuleSet(rule, FUTURE);
      expect(copy.meta).toEqual({ ...rule.meta, ruleSetId: FUTURE });
      expect(rule.meta.ruleSetId).toBe('current-law-2026-11');
      for (const timeline of Object.values(SAMPLES)) {
        const ctx = { timeline, simulationDate: SIMULATION_DATE };
        expect(runRule(copy, ctx)).toEqual(runRule(rule, ctx));
      }
    }
  });
});

// Current law's rules under a third rule set, laid but not yet in force.
const future: RuleSet = {
  id: FUTURE,
  kind: 'LAW',
  status: 'IN_FORCE_FUTURE_VERSION',
  effectiveFrom: '2027-01-01',
  sources: RULE_SETS['current-law-2026-11'].sources,
};
const registry: RuleSetRegistry = {
  ruleSets: { ...RULE_SETS, [FUTURE]: future },
  rules: {
    ...RULES,
    [FUTURE]: RULES['current-law-2026-11'].map((r) => withRuleSet(r, FUTURE)),
  },
};

describe('a synthetic third rule set (§13.3, §13.7)', () => {
  test('effectiveFrom is required for a future version and only for it', () => {
    // @ts-expect-error effectiveFrom is required for IN_FORCE_FUTURE_VERSION
    const missing: RuleSet = { ...future, effectiveFrom: undefined };
    // @ts-expect-error effectiveFrom cannot be set on current law
    const extra: RuleSet = {
      ...RULE_SETS['current-law-2026-11'],
      effectiveFrom: '2027-01-01',
    };
    expect([missing.status, extra.status]).toEqual([
      'IN_FORCE_FUTURE_VERSION',
      'CURRENT_LAW',
    ]);
  });

  test.each(fixtures.map((f) => [f.id, f]))(
    '%s: three columns; the existing two are unchanged',
    (_, fixture) => {
      const two = evaluate(fixture.request);
      const three = evaluate(fixture.request, registry);
      expect(Object.keys(three.byRuleSet)).toEqual([...RULE_SET_IDS, FUTURE]);
      const { [FUTURE]: synthetic, ...existing } = three.byRuleSet;
      expect(JSON.stringify({ ...three, byRuleSet: existing })).toBe(
        JSON.stringify(two),
      );
      // The same rules and parameters as current law.
      expect(synthetic).toEqual(three.byRuleSet['current-law-2026-11']);
    },
  );

  test('ruleSetIds still filters', () => {
    const request = {
      timeline: SAMPLES.default,
      simulationDate: SIMULATION_DATE,
    };
    expect(
      Object.keys(
        evaluate({ ...request, ruleSetIds: [FUTURE] }, registry).byRuleSet,
      ),
    ).toEqual([FUTURE]);
    expect(
      Object.keys(
        evaluate(
          { ...request, ruleSetIds: ['earned-settlement-2026-11'] },
          registry,
        ).byRuleSet,
      ),
    ).toEqual(['earned-settlement-2026-11']);
  });

  test('policyAsOf: the synthetic rule set has no parameter file (§16.4)', () => {
    const request = {
      timeline: SAMPLES.default,
      simulationDate: SIMULATION_DATE,
    };
    expect(
      evaluate({ ...request, ruleSetIds: [FUTURE] }, registry).policyAsOf,
    ).toBe(evaluate(request).policyAsOf);
  });

  test('fixtures still check only the existing rule sets', () => {
    for (const fixture of fixtures) {
      expect(RULE_SET_IDS).toContain(fixture.expected.ruleSetId);
      expect(fixture.expected.ruleSetId).not.toBe(FUTURE);
    }
  });
});
