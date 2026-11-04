import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import type { DecisionOutcome, SimulationResult } from '@uk-immigration/engine';
import Home from '../app/page';
import { ResultView } from '../components/result-view';
import { t } from '../i18n';
import { policyAsOf } from '../lib/policy';
import { mockResults } from '../lib/mock-results';
import { sourceUrls } from '../lib/sources';

test('homepage presents policy status, disclaimer, privacy and the questionnaire entry', () => {
  const html = renderToStaticMarkup(<Home />);
  for (const text of [
    policyAsOf,
    t('policy.CURRENT_LAW'),
    t('policy.ANNOUNCED_NOT_IN_FORCE'),
    t('home.disclaimerEnglish'),
    t('home.privacy'),
  ])
    expect(html).toContain(text);
  expect(html).toContain('href="/simulate"');
  expect(html).not.toContain('mock=');
});

test('an empty rule list from the stub renders without implying eligibility', () => {
  const html = renderToStaticMarkup(
    <ResultView
      result={{
        policyAsOf,
        byRuleSet: {
          'current-law-2026-11': {
            outcome: 'INSUFFICIENT_INFORMATION',
            rules: [],
            assumptions: [],
          },
          'earned-settlement-2026-11': {
            outcome: 'INSUFFICIENT_INFORMATION',
            rules: [],
            assumptions: [],
          },
        },
      }}
    />,
  );
  expect(html).toContain(t('outcome.INSUFFICIENT_INFORMATION'));
  expect(html).toContain(t('result.noRules'));
  expect(html).toContain(t('result.undetermined'));
});

test.each<DecisionOutcome>([
  'LIKELY_ELIGIBLE',
  'LIKELY_NOT_ELIGIBLE',
  'POTENTIALLY_ELIGIBLE',
  'INSUFFICIENT_INFORMATION',
  'POLICY_NOT_YET_IN_FORCE',
  'REQUIRES_REGULATED_REVIEW',
])('renders outcome %s with its explanation', (outcome) => {
  const result: SimulationResult = {
    policyAsOf,
    byRuleSet: {
      'current-law-2026-11': { outcome, rules: [], assumptions: [] },
    },
  };
  const html = renderToStaticMarkup(<ResultView result={result} />);
  expect(html).toContain(t(`outcome.${outcome}`));
  expect(html).toContain(t(`outcome.${outcome}.description`));
});

test('short circuit takes priority over any per-rule-set assessments', () => {
  const html = renderToStaticMarkup(
    <ResultView
      result={{
        ...mockResults['1'],
        shortCircuit: {
          reason: 'PROTECTION',
          message: '需要专业审查的测试情景',
        },
      }}
    />,
  );
  expect(html).toContain('需要专业审查的测试情景');
  expect(html).toContain(t('result.advice'));
  expect(html).not.toContain(t('result.pathway'));
  expect(html).not.toContain(t('outcome.LIKELY_ELIGIBLE'));
});

test('previews render rules, assumptions, dates, source links and group order', () => {
  const positive = renderToStaticMarkup(
    <ResultView result={mockResults['1']} mock />,
  );
  expect(positive).toContain(t('result.mock'));
  expect(positive).toContain('SRC-001 p16');
  expect(positive).toContain(sourceUrls['SRC-001']);
  expect(positive).toContain(`dateTime="${policyAsOf}"`);
  const negative = renderToStaticMarkup(
    <ResultView result={mockResults['2']} mock />,
  );
  expect(negative.indexOf('data-status="FAIL"')).toBeLessThan(
    negative.indexOf('data-status="UNKNOWN"'),
  );
  expect(negative).toContain('PD-013');
});
