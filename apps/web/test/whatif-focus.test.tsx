import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import {
  currentLaw2026_11 as cl,
  earnedSettlement2026_11 as es,
} from '@uk-immigration/policy-data';
import type { PersonTimeline } from '@uk-immigration/engine';
import { clFamilyPartnerFiveYears as family } from '../../../packages/policy-data/fixtures/cl-family-partner-five-years';
import { WhatIfView } from '../components/whatif-lab';
import { LocaleContext } from '../i18n/locale';
import { createDraft, runSimulation } from '../lib/questionnaire';
import {
  applyWhatIf,
  focusForRule,
  initialWhatIf,
  parseWhatIfFocus,
  rememberWhatIfTarget,
  takeWhatIfTarget,
} from '../lib/whatif';

const baseline = () => ({
  ...createDraft(),
  ...structuredClone(family.request),
  completed: true,
});

test.each([
  ['ES-ENGLISH-B2', 'english'],
  ['CL-ENGLISH', 'english'],
  ['ES-EARNINGS-3Y', 'income'],
  ['ES-EARNINGS-5Y', 'income'],
  ['ES-EARNINGS-10Y', 'income'],
  ['ES-PROTECTION-CONTRIBUTION', 'income'],
  ['CL-FAMILY-FINANCIAL', 'income'],
  ['ES-PUBLIC-FUNDS', 'publicFunds'],
  ['ES-RESIDENCE', 'date'],
  ['CL-SW-RESIDENCE-5Y', 'date'],
  ['CL-LR-RESIDENCE-10Y', 'date'],
  ['CL-FAMILY-RESIDENCE', 'date'],
  ['CL-GT-RESIDENCE', 'date'],
  ['ES-PROTECTION-PATHWAY', 'date'],
  ['ES-KOL', 'life'],
  ['CL-KOL', 'life'],
  ['ES-DEBT', undefined],
  ['CL-SW-SALARY', undefined],
])('%s maps to %s', (id, focus) => expect(focusForRule(id)).toBe(focus));

test('URL focus accepts only control keys and consumes the exact clicked column once', () => {
  for (const value of ['english', 'income', 'date', 'life', 'publicFunds'])
    expect(parseWhatIfFocus(value)).toBe(value);
  for (const value of [
    null,
    '',
    'constructor',
    '__proto__',
    'ES-EARNINGS-3Y',
    'income=50000',
  ])
    expect(parseWhatIfFocus(value)).toBeUndefined();
  const assessment =
    runSimulation(baseline()).byRuleSet['current-law-2026-11']!;
  const target = {
    focus: 'date' as const,
    ruleId: 'CL-FAMILY-RESIDENCE',
    assessment,
  };
  rememberWhatIfTarget(target);
  expect(takeWhatIfTarget('date')).toBe(target);
  expect(takeWhatIfTarget('date')).toEqual({ focus: 'date' });
  rememberWhatIfTarget(target);
  expect(takeWhatIfTarget('english')).toEqual({ focus: 'english' });
  expect(takeWhatIfTarget(undefined)).toBeUndefined();
});

test.each([
  [undefined, { cefrLevel: es.values.settlementEnglishLevel.value }],
  [{ cefrLevel: 'A1' }, { cefrLevel: 'A2' }],
  [{ cefrLevel: 'B1' }, { cefrLevel: 'B2' }],
  [{ cefrLevel: 'B2' }, { cefrLevel: 'C1' }],
  [{ cefrLevel: 'C2' }, { cefrLevel: 'C2' }],
  [{ exempt: true }, { exempt: true }],
] as [PersonTimeline['english'], PersonTimeline['english']][])(
  'English focus advances %j to %j',
  (english, expected) => {
    const draft = baseline();
    draft.timeline.english = english;
    const original = structuredClone(draft);
    const controls = initialWhatIf(draft, { focus: 'english' });
    expect(controls).toEqual({ ...initialWhatIf(draft), english: expected });
    expect(draft).toEqual(original);
  },
);

test.each([
  ['ES-EARNINGS-3Y', es.values.earningsThreshold3Year.value],
  ['ES-EARNINGS-5Y', es.values.earningsThreshold5Year.value],
  ['ES-EARNINGS-10Y', es.values.earningsThresholdMinimum.value],
  ['ES-PROTECTION-CONTRIBUTION', es.values.earningsThresholdMinimum.value],
])('income focus for %s uses its sourced threshold', (ruleId, earnings) => {
  expect(initialWhatIf(baseline(), { focus: 'income', ruleId })).toMatchObject({
    incomeEnabled: true,
    earnings,
  });
});

test.each([0, 1, 2, 10])(
  'family focus reuses the engine threshold with %i children and makes the financial rule pass',
  (children) => {
    const draft = baseline();
    draft.timeline.relationships.push(
      ...Array.from({ length: children }, () => ({
        type: 'CHILD' as const,
        otherPartyStatus: 'OTHER' as const,
      })),
    );
    draft.timeline.incomeYears = [
      { taxYear: '2024-25', earnings: 0, partnerEarnings: 0 },
    ];
    // No savings declared, so the shortfall fails (contracts §17.3).
    draft.timeline.cashSavings = 0;
    const before = runSimulation(draft).byRuleSet['current-law-2026-11']!;
    expect(
      before.rules.find((r) => r.id === 'CL-FAMILY-FINANCIAL')?.status,
    ).toBe('FAIL');
    const controls = initialWhatIf(draft, {
      focus: 'income',
      ruleId: 'CL-FAMILY-FINANCIAL',
      assessment: before,
    });
    const expected =
      children === 0
        ? cl.values.familyPartnerTransitionalIncome.value
        : children === 1
          ? cl.values.familyPartnerTransitionalIncome.value +
            cl.values.familyPartnerTransitionalFirstChild.value
          : children === 2
            ? cl.values.familyPartnerTransitionalIncome.value +
              cl.values.familyPartnerTransitionalFirstChild.value +
              cl.values.familyPartnerTransitionalAdditionalChild.value
            : cl.values.familyPartnerMinimumIncome.value;
    expect(controls.earnings).toBe(expected);
    expect(
      runSimulation(applyWhatIf(draft, controls)).byRuleSet[
        'current-law-2026-11'
      ]!.rules.find((r) => r.id === 'CL-FAMILY-FINANCIAL')?.status,
    ).toBe('PASS');
  },
);

test('family general threshold comes from policy-data', () => {
  const draft = baseline();
  draft.timeline.episodes = [
    {
      ...draft.timeline.episodes[2],
      validFrom: cl.values.familyPartnerTransitionalBefore.value,
    },
  ];
  expect(
    initialWhatIf(draft, { focus: 'income', ruleId: 'CL-FAMILY-FINANCIAL' })
      .earnings,
  ).toBe(cl.values.familyPartnerMinimumIncome.value);
});

test('date focus uses the selected assessment; other controls only focus and reset restores the draft', () => {
  const draft = baseline();
  const assessment = {
    outcome: 'LIKELY_NOT_ELIGIBLE' as const,
    earliestDate: '2028-03-01',
    pathwayYears: 5,
    rules: [],
    assumptions: [],
  };
  expect(
    initialWhatIf(draft, { focus: 'date', assessment }).simulationDate,
  ).toBe(assessment.earliestDate);
  expect(initialWhatIf(draft, { focus: 'date' }).simulationDate).toBe(
    draft.simulationDate,
  );
  for (const focus of ['life', 'publicFunds'] as const)
    expect(initialWhatIf(draft, { focus })).toEqual(initialWhatIf(draft));
  expect(applyWhatIf(draft, initialWhatIf(draft))).toEqual(draft);
});

test('the English What-if page renders the enabled, prefilled control', () => {
  const html = renderToStaticMarkup(
    <LocaleContext value={{ locale: 'en', setLocale: () => {} }}>
      <WhatIfView
        draft={baseline()}
        target={{ focus: 'income', ruleId: 'ES-EARNINGS-5Y' }}
      />
    </LocaleContext>,
  );
  expect(html).toMatch(
    new RegExp(
      `id="whatif-earnings"[^>]*value="${es.values.earningsThreshold5Year.value}"`,
    ),
  );
  expect(html).not.toMatch(/id="whatif-earnings"[^>]*disabled/);
  expect(html).not.toMatch(/[\u3400-\u9fff：、（）]/);
});
