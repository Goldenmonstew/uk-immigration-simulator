import { fixtures } from '@uk-immigration/policy-data/fixtures';
import { describe, expect, test } from 'vitest';
import { evaluate } from '../src/evaluate';

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
