import { fixtures } from '@uk-immigration/policy-data/fixtures';
import { describe, expect, test } from 'vitest';
import { evaluate } from '../src/evaluate';

// Fixture expectations that conflict with the engine, kept failing on
// purpose until Fable rules on them (docs/tasks/reports/1.1-rules-mvp0.md §4).
// ES-OFFICIAL-P31-INDIVIDUAL-A: a dependant partner settles with the principal
// (p29, p31), but the timeline cannot say which pathway the principal is on;
// assessed on their own the partner is on the 10-year pathway.
const CONFLICTS = ['ES-OFFICIAL-P31-INDIVIDUAL-A'];

describe.each(fixtures)('$id', (fixture) => {
  const { expected } = fixture;
  const result = evaluate(fixture.request);
  const assessment = result.byRuleSet[expected.ruleSetId]!;

  (CONFLICTS.includes(fixture.id) ? test.fails : test)(
    'outcome, pathway and date',
    () => {
      expect(result.policyAsOf).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(assessment.outcome).toBe(expected.outcome);
      if (expected.pathwayYears !== undefined) {
        expect(assessment.pathwayYears).toBe(expected.pathwayYears);
      }
      if (expected.earliestDate !== undefined) {
        expect(assessment.earliestDate).toBe(expected.earliestDate);
      }
    },
  );

  test('failing and unknown rules', () => {
    const statusOf = (id: string) =>
      assessment.rules.find((r) => r.id === id)?.status;
    for (const id of expected.mustFail ?? [])
      expect(statusOf(id), id).toBe('FAIL');
    for (const id of expected.mustUnknown ?? [])
      expect(statusOf(id), id).toBe('UNKNOWN');
  });
});
