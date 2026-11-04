import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import type { RuleOutcome, SettlementAssessment } from '@uk-immigration/engine';
import { GapSummary } from '../components/gap-summary';
import { esP45IndividualCCareWorkerAfterCutoff as skilledWorker } from '../../../packages/policy-data/fixtures/es-p45-individual-c-care-worker-after-cutoff';
import { createDraft, runSimulation } from '../lib/questionnaire';
import { LocaleContext } from '../i18n/locale';
import { t } from '../i18n';
import { firstSentence, remainingTime } from '../lib/gap-summary';

const rule = (
  id: string,
  status: RuleOutcome['status'],
  pendingDetails?: string[],
): RuleOutcome => ({
  id,
  status,
  title: id,
  explanation: 'First sentence. Second sentence.',
  sources: [],
  pendingDetails,
});
const rules = [
  rule('ES-EARNINGS-10Y', 'FAIL'),
  rule('CL-ENGLISH', 'UNKNOWN'),
  rule('ES-PUBLIC-FUNDS', 'UNKNOWN', ['PD-013']),
  rule('CL-KOL', 'PASS'),
];
const assessment = (
  patch: Partial<SettlementAssessment> = {},
): SettlementAssessment => ({
  outcome: 'INSUFFICIENT_INFORMATION',
  rules,
  assumptions: [],
  ...patch,
});
const render = (
  value: SettlementAssessment,
  locale: 'en' | 'zh-CN' = 'zh-CN',
) =>
  renderToStaticMarkup(
    <LocaleContext value={{ locale, setLocale: () => {} }}>
      <GapSummary assessment={value} simulationDate="2026-11-04" canWhatIf />
    </LocaleContext>,
  );

test('likely eligible only shows the all-modelled-requirements sentence, even with failed alternatives', () => {
  const html = render(assessment({ outcome: 'LIKELY_ELIGIBLE' }));
  expect(html).toContain(t('gap.met'));
  expect(html).not.toContain('ES-EARNINGS');
  expect(html).not.toContain('/whatif');
});

test.each([
  'LIKELY_NOT_ELIGIBLE',
  'POTENTIALLY_ELIGIBLE',
  'INSUFFICIENT_INFORMATION',
] as const)(
  '%s without a date shows failures and distinguishes the two unknown kinds',
  (outcome) => {
    const html = render(assessment({ outcome }));
    expect(html).toContain('ES-EARNINGS-10Y');
    expect(html).toContain('CL-ENGLISH（补填信息）');
    expect(html).toContain('ES-PUBLIC-FUNDS（待政府明确）');
    expect(html).not.toContain('CL-KOL');
    expect(html).toContain('First sentence.');
    expect(html).not.toContain('Second sentence.');
  },
);

test('a projected date shows the wait from the simulation date and only failed rules', () => {
  const html = render(
    assessment({
      outcome: 'LIKELY_NOT_ELIGIBLE',
      earliestDate: '2028-01-04',
      pathwayYears: 5,
    }),
  );
  expect(html).toContain('按当前情况最早 2028-01-04');
  expect(html).toContain('1 年 2 个月');
  expect(html).toContain('ES-EARNINGS-10Y');
  expect(html).not.toContain('CL-ENGLISH');
});

test.each(['REQUIRES_REGULATED_REVIEW', 'POLICY_NOT_YET_IN_FORCE'] as const)(
  '%s does not get an actionable summary',
  (outcome) => {
    expect(render(assessment({ outcome }))).toBe('');
  },
);

test('more than five rows are collapsed, counting the projected date', () => {
  const many = Array.from({ length: 6 }, (_, index) =>
    rule(`RULE-${index}`, 'FAIL'),
  );
  const html = render(assessment({ rules: many }));
  expect(html).toContain('aria-expanded="false"');
  expect(html.match(/class="[^"]*gapCollapsed[^"]*"/g)).toHaveLength(1);
  const dated = render(
    assessment({
      rules: many,
      outcome: 'LIKELY_NOT_ELIGIBLE',
      earliestDate: '2028-01-04',
    }),
  );
  expect(dated.match(/class="[^"]*gapCollapsed[^"]*"/g)).toHaveLength(2);
  expect(render(assessment({ rules: many.slice(0, 5) }))).not.toContain(
    'aria-expanded',
  );
});

test('links contain only mapped control keys and unmapped rules have no action', () => {
  const html = render(
    assessment({ rules: [...rules, rule('ES-DEBT', 'FAIL')] }),
  );
  expect(html.match(/href="[^"]+"/g)).toEqual([
    'href="/whatif?focus=income"',
    'href="/whatif?focus=english"',
    'href="/whatif?focus=publicFunds"',
  ]);
  const readOnly = renderToStaticMarkup(
    <GapSummary assessment={assessment()} />,
  );
  expect(readOnly).not.toContain('/whatif');
});

test.each([
  'LIKELY_ELIGIBLE',
  'LIKELY_NOT_ELIGIBLE',
  'POTENTIALLY_ELIGIBLE',
  'INSUFFICIENT_INFORMATION',
] as const)('English %s summary contains no Chinese', (outcome) => {
  const html = render(assessment({ outcome }), 'en');
  expect(html).toContain('What is missing');
  expect(html).not.toMatch(/[\u3400-\u9fff：、（）]/);
  expect(
    render(
      assessment({ outcome, earliestDate: '2028-01-04', pathwayYears: 5 }),
      'en',
    ),
  ).not.toMatch(/[\u3400-\u9fff：、（）]/);
});

test.each([
  ['2026-11-04', '2026-11-04', 0, 0],
  ['2026-11-04', '2026-01-01', 0, 0],
  ['2026-11-04', '2026-11-05', 0, 1],
  ['2026-11-04', '2028-01-04', 1, 2],
  ['2026-11-04', '2028-01-05', 1, 3],
  ['2026-01-31', '2026-02-28', 0, 1],
  ['2028-01-31', '2028-02-29', 0, 1],
  ['2028-02-29', '2029-02-28', 1, 0],
  ['2026-12-31', '2027-01-01', 0, 1],
])(
  'calendar wait %s to %s is %i years %i months',
  (from, to, years, months) => {
    expect(remainingTime(from, to)).toEqual({ years, months });
  },
);

test('first sentences preserve decimal rule references and both languages', () => {
  expect(firstSentence('按 SW 22A.1 核对。下一句。', 'zh-CN')).toBe(
    '按 SW 22A.1 核对。',
  );
  expect(
    firstSentence('See SW 22A.1 for details. Another sentence.', 'en'),
  ).toBe('See SW 22A.1 for details.');
  expect(firstSentence('No punctuation', 'en')).toBe('No punctuation');
  expect(firstSentence('', 'en')).toBe('');
});

test('a real Skilled Worker assessment with missing English offers the English control in both languages', () => {
  const draft = {
    ...createDraft(),
    ...structuredClone(skilledWorker.request),
    completed: true,
  };
  draft.timeline.english = undefined;
  for (const locale of ['zh-CN', 'en'] as const) {
    const assessment = runSimulation(draft, locale).byRuleSet[
      'current-law-2026-11'
    ]!;
    expect(assessment.outcome).toBe('INSUFFICIENT_INFORMATION');
    const html = render(assessment, locale);
    expect(html).toContain('href="/whatif?focus=english"');
    if (locale === 'zh-CN') expect(html).toContain('定居英语要求（补填信息）');
    else expect(html).not.toMatch(/[\u3400-\u9fff：、（）]/);
  }
});
