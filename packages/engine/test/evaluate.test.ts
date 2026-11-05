import { PARAMETERS, RULE_SET_IDS } from '@uk-immigration/policy-data';
import { fixtures } from '@uk-immigration/policy-data/fixtures';
import { describe, expect, test } from 'vitest';
import { evaluate } from '../src/evaluate';
import { SAMPLES, SIMULATION_DATE } from './helpers';

describe.each(fixtures)('$id', (fixture) => {
  const { expected } = fixture;
  const result = evaluate(fixture.request);
  const assessment = result.byRuleSet[expected.ruleSetId]!;

  test('outcome, pathway and date', () => {
    expect(result.policyAsOf).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(assessment.outcome).toBe(expected.outcome);
    if (expected.pathwayYears !== undefined) {
      expect(assessment.pathwayYears).toBe(expected.pathwayYears);
    }
    if (expected.earliestDate !== undefined) {
      expect(assessment.earliestDate).toBe(expected.earliestDate);
    }
  });

  test('failing and unknown rules', () => {
    const statusOf = (id: string) =>
      assessment.rules.find((r) => r.id === id)?.status;
    for (const id of expected.mustFail ?? [])
      expect(statusOf(id), id).toBe('FAIL');
    for (const id of expected.mustUnknown ?? [])
      expect(statusOf(id), id).toBe('UNKNOWN');
  });
});

describe('policyAsOf (contracts §16.4)', () => {
  const request = {
    timeline: SAMPLES.default,
    simulationDate: SIMULATION_DATE,
  };
  const latest = RULE_SET_IDS.map((id) => PARAMETERS[id].asOf)
    .sort()
    .at(-1);

  test('the latest asOf of the rule sets assessed', () => {
    expect(evaluate(request).policyAsOf).toBe(latest);
    for (const id of RULE_SET_IDS) {
      expect(evaluate({ ...request, ruleSetIds: [id] }).policyAsOf).toBe(
        PARAMETERS[id].asOf,
      );
    }
    // No rule set assessed: every parameter file counts.
    expect(evaluate({ ...request, ruleSetIds: [] }).policyAsOf).toBe(latest);
  });

  test('a later parameter file counts only when its rule set is assessed', () => {
    const original = PARAMETERS['current-law-2026-11'];
    PARAMETERS['current-law-2026-11'] = { ...original, asOf: '2027-01-05' };
    try {
      expect(evaluate(request).policyAsOf).toBe('2027-01-05');
      expect(
        evaluate({ ...request, ruleSetIds: ['earned-settlement-2026-11'] })
          .policyAsOf,
      ).toBe(PARAMETERS['earned-settlement-2026-11'].asOf);
    } finally {
      PARAMETERS['current-law-2026-11'] = original;
    }
  });
});
