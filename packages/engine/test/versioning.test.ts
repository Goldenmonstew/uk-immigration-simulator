import {
  currentLaw2026_11,
  PARAMETERS,
  RULE_SET_IDS,
} from '@uk-immigration/policy-data';
import type { ParameterSet, RuleSetId } from '@uk-immigration/policy-data';
import { describe, expect, test } from 'vitest';
import { RULE_SETS } from '../src/evaluate';
import { runRule, withRuleSet } from '../src/rule';
import { RULES } from '../src/rules';
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
