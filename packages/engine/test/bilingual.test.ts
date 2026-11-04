import { policyChangelog } from '@uk-immigration/policy-data';
import { fixtures } from '@uk-immigration/policy-data/fixtures';
import { describe, expect, test } from 'vitest';
import { evaluate } from '../src/evaluate';
import { runRule } from '../src/rule';
import { RULES } from '../src/rules';
import type { RuleOutcome, SimulationResult } from '../src/types';
import { SAMPLES, SIMULATION_DATE } from './helpers';

// Recorded before the English texts were added: the default locale's output
// must stay byte-for-byte the same.
test.each(fixtures.map((f) => [f.id, f]))(
  '%s default-locale output is unchanged',
  (_, fixture) => {
    expect(
      JSON.stringify(evaluate(fixture.request), null, 2),
    ).toMatchSnapshot();
  },
);

// CJK punctuation, ideographs and full-width forms.
const CJK = /[\u3000-\u303f\u4e00-\u9fff\uff00-\uffef]/;

function expectEnglish(text: string | undefined) {
  expect(text).toBeTruthy();
  expect(text).not.toMatch(CJK);
}

function expectEnglishOutcome(r: RuleOutcome) {
  expectEnglish(r.title);
  expectEnglish(r.explanation);
  for (const a of r.assumptions ?? []) expectEnglish(a);
}

function expectEnglishResult(result: SimulationResult) {
  for (const assessment of Object.values(result.byRuleSet)) {
    assessment.rules.forEach(expectEnglishOutcome);
    assessment.assumptions.forEach(expectEnglish);
  }
  if (result.shortCircuit) expectEnglish(result.shortCircuit.message);
}

const RULE_LIST = Object.values(RULES).flat();

describe("locale: 'en'", () => {
  test.each(fixtures.map((f) => [f.id, f]))('%s', (_, fixture) => {
    expectEnglishResult(evaluate({ ...fixture.request, locale: 'en' }));
  });

  test.each(Object.entries(SAMPLES))('sample %s', (_, sample) => {
    const ctx = { timeline: sample, simulationDate: SIMULATION_DATE };
    for (const rule of RULE_LIST) {
      expectEnglishOutcome(runRule(rule, { ...ctx, locale: 'en' }));
    }
    expectEnglishResult(evaluate({ ...ctx, locale: 'en' }));
  });

  test.each(RULE_LIST.map((r) => [r.meta.id, r]))(
    '%s has an English title',
    (_, rule) => expectEnglish(rule.meta.titleEn),
  );

  test.each(policyChangelog.map((c) => [c.date, c]))(
    'changelog %s has English title and summary',
    (_, change) => {
      expectEnglish(change.titleEn);
      expectEnglish(change.summaryEn);
    },
  );
});
