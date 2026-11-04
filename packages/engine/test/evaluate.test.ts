import { fixtures } from '@uk-immigration/policy-data/fixtures';
import { describe, expect, test } from 'vitest';
import { evaluate } from '../src/evaluate';
import type { Fixture, SimulationRequest } from '../src/types';

// Fixtures C and D predate PersonTimeline.lifeInTheUk and leave it out, which
// makes ES-KOL UNKNOWN. Their source cases (SRC-001 p19) meet the other
// mandatory requirements, so the test supplies a passed test until the
// fixtures are updated (see docs/tasks/reports/1.1-rules-mvp0.md).
const PRE_KOL_FIXTURES = [
  'ES-OFFICIAL-INDIVIDUAL-C',
  'ES-OFFICIAL-INDIVIDUAL-D',
];

function requestOf({ id, request }: Fixture): SimulationRequest {
  return PRE_KOL_FIXTURES.includes(id) && !request.timeline.lifeInTheUk
    ? {
        ...request,
        timeline: { ...request.timeline, lifeInTheUk: { passed: true } },
      }
    : request;
}

describe.each(fixtures)('$id', (fixture) => {
  const { expected } = fixture;
  const result = evaluate(requestOf(fixture));
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

test('fixture C as written: missing Life in the UK leaves the outcome open', () => {
  const c = fixtures.find((f) => f.id === 'ES-OFFICIAL-INDIVIDUAL-C')!;
  const assessment = evaluate(c.request).byRuleSet[
    'earned-settlement-2026-11'
  ]!;
  if (c.request.timeline.lifeInTheUk) return;
  expect(assessment.rules.find((r) => r.id === 'ES-KOL')?.status).toBe(
    'UNKNOWN',
  );
  expect(assessment.outcome).toBe('INSUFFICIENT_INFORMATION');
});
