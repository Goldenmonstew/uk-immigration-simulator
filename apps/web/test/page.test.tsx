import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import type { DecisionOutcome, SimulationResult } from '@uk-immigration/engine';
import Home from '../app/page';
import { ResultView } from '../components/result-view';
import { t } from '../i18n';
import { routeGroupNames } from '../i18n/routes';
import { policyAsOf } from '../lib/policy';
import { mockResults } from '../lib/mock-results';
import { sourceUrls } from '../lib/sources';
import { createDraft, runSimulation } from '../lib/questionnaire';

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

test('an empty rule list renders without implying eligibility', () => {
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
  expect(html).toContain(t('result.noAssumptions'));
  expect(html).not.toContain('<details');
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

test('a frontend short circuit without assessments shows only advice', () => {
  const html = renderToStaticMarkup(
    <ResultView
      result={{
        policyAsOf,
        byRuleSet: {},
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

test.each([
  // A Hong Kong BN(O) main applicant is assessed under current law (§12).
  ['HONG_KONG_BNO', 'MAIN', 'OUTSIDE_FRAMEWORK', 'LIKELY_NOT_ELIGIBLE'],
  ['CORE_PROTECTION', 'DEPENDANT', 'PROTECTION', 'INSUFFICIENT_INFORMATION'],
] as const)(
  'engine short circuit for %s retains both assessment columns',
  (route, role, reason, currentLaw) => {
    const draft = createDraft();
    draft.simulationDate = '2026-11-04';
    draft.timeline.dateOfBirth = '1991-08-19';
    draft.timeline.episodes = [
      { route, role, validFrom: '2025-01-01', validTo: '2031-01-01' },
    ];
    const result = runSimulation(draft);
    expect(result.shortCircuit?.reason).toBe(reason);
    expect(result.byRuleSet['current-law-2026-11']?.outcome).toBe(currentLaw);
    expect(result.byRuleSet['earned-settlement-2026-11']?.outcome).toBe(
      'REQUIRES_REGULATED_REVIEW',
    );
    const html = renderToStaticMarkup(<ResultView result={result} />);
    expect(html).toContain(result.shortCircuit!.message);
    expect(html).toContain('id="current-law-2026-11-heading"');
    expect(html).toContain('id="earned-settlement-2026-11-heading"');
    expect(html).toContain(t(`outcome.${currentLaw}`));
    expect(html).toContain(t('outcome.REQUIRES_REGULATED_REVIEW'));
    for (const assessment of Object.values(result.byRuleSet)) {
      expect(assessment.rules.length).toBeGreaterThan(0);
      for (const rule of assessment.rules) expect(html).toContain(rule.title);
    }
  },
);

test('previews render rules, assumptions, dates, source links and group order', () => {
  const positive = renderToStaticMarkup(
    <ResultView result={mockResults['1']} mock />,
  );
  expect(positive).toContain(t('result.mock'));
  expect(positive).toContain('SRC-001 p16');
  expect(positive).toContain(sourceUrls['SRC-001']);
  expect(positive).toContain(`dateTime="${policyAsOf}"`);
  expect(positive).toContain(routeGroupNames.CORE_PERMISSION['zh-CN']);
  expect(positive).toContain('政府未定细节：PD-012、PD-013');
  expect(positive).toContain('<details><summary>假设清单（2 条）</summary>');
  expect(positive).not.toContain('<details open');
  const negative = renderToStaticMarkup(
    <ResultView result={mockResults['2']} mock />,
  );
  expect(negative.indexOf('data-status="FAIL"')).toBeLessThan(
    negative.indexOf('data-status="UNKNOWN"'),
  );
  expect(negative).toContain('PD-013');
});
