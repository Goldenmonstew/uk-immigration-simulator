import {
  currentLaw2026_11,
  PARAMETERS,
  RULE_SET_IDS,
} from '@uk-immigration/policy-data';
import type { ParameterSet, RuleSetId } from '@uk-immigration/policy-data';
import { describe, expect, test } from 'vitest';
import { RULE_SETS } from '../src/evaluate';
import { RULES } from '../src/rules';

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
      ruleSetId: 'current-law-test-future' as RuleSetId,
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
