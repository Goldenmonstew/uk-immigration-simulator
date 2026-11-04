import { fixtures } from '@uk-immigration/policy-data/fixtures';
import { describe, expect, test } from 'vitest';
import { evaluate } from '../src/evaluate';

describe.each(fixtures)('$id', (fixture) => {
  test('evaluate returns a well-formed result', () => {
    const result = evaluate(fixture.request);
    expect(result.policyAsOf).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const assessment = result.byRuleSet[fixture.expected.ruleSetId];
    expect(assessment).toMatchObject({
      outcome: expect.any(String),
      satisfied: expect.any(Array),
      failed: expect.any(Array),
      unknown: expect.any(Array),
      assumptions: expect.any(Array),
      sources: expect.any(Array),
    });
  });

  test.todo('matches expected outcome, pathway, date and rules (Phase 1)');
});
