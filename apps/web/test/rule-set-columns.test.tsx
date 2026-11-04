import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, expect, test, vi } from 'vitest';
import { evaluate, RULE_SETS, type RuleSetId } from '@uk-immigration/engine';
import { PARAMETERS, RULE_SET_IDS } from '@uk-immigration/policy-data';
import { esP31IndividualAPartnerArrivesTogether as fixture } from '../../../packages/policy-data/fixtures/es-p31-individual-a-partner-arrives-together';
import AboutContent from '../app/about/about-content';
import PolicyPage from '../app/policy/page';
import { PolicyStatus } from '../components/policy-status';
import { PrincipalAssessment, ResultView } from '../components/result-view';
import { WhatIfView } from '../components/whatif-lab';
import { LocaleContext } from '../i18n/locale';
import { allRuleSets, displayedRuleSets, policyAsOf } from '../lib/policy';
import {
  createDraft,
  runPrincipalSimulation,
  runSimulation,
} from '../lib/questionnaire';
import { loadScenario, readScenarios, saveScenario } from '../lib/storage';
import { applyWhatIf, initialWhatIf } from '../lib/whatif';

const { CURRENT, ANNOUNCED, FUTURE } = vi.hoisted(() => ({
  CURRENT: 'current-law-2026-11' as RuleSetId,
  ANNOUNCED: 'earned-settlement-2026-11' as RuleSetId,
  FUTURE: 'current-law-test-future' as RuleSetId,
}));

vi.mock('@uk-immigration/policy-data', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@uk-immigration/policy-data')>();
  return {
    ...actual,
    RULE_SET_IDS: [...actual.RULE_SET_IDS, FUTURE],
    PARAMETERS: {
      ...actual.PARAMETERS,
      // A hidden set's newer review date must not affect the displayed date.
      [ANNOUNCED]: { ...actual.PARAMETERS[ANNOUNCED], asOf: '2028-01-05' },
      [FUTURE]: {
        ...actual.PARAMETERS[CURRENT],
        ruleSetId: FUTURE,
        basedOn: CURRENT,
        asOf: '2027-01-05',
      },
    },
  };
});

vi.mock('@uk-immigration/engine', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@uk-immigration/engine')>();
  const { withRuleSet } = await import('@uk-immigration/engine');
  const ruleSets = {
    ...actual.RULE_SETS,
    [FUTURE]: {
      id: FUTURE,
      kind: 'LAW' as const,
      status: 'IN_FORCE_FUTURE_VERSION' as const,
      effectiveFrom: '2027-01-01',
      sources: actual.RULE_SETS[CURRENT].sources,
    },
  };
  const rules = {
    ...actual.RULES,
    [FUTURE]: actual.RULES[CURRENT].map((rule) => withRuleSet(rule, FUTURE)),
  };
  return {
    ...actual,
    RULE_SETS: ruleSets,
    RULES: rules,
    evaluate: vi.fn((request: Parameters<typeof actual.evaluate>[0]) =>
      actual.evaluate(request, { ruleSets, rules }),
    ),
  };
});

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

function familyDraft() {
  return {
    ...createDraft(),
    ...structuredClone(fixture.request),
    completed: true,
  };
}

function render(page: ReactNode, locale: 'zh-CN' | 'en') {
  return renderToStaticMarkup(
    <LocaleContext value={{ locale, setLocale: () => {} }}>
      {page}
    </LocaleContext>,
  );
}

test('a synthetic future version replaces the announced column and controls policyAsOf', () => {
  expect(allRuleSets.map((set) => set.id)).toEqual(RULE_SET_IDS);
  expect(displayedRuleSets.map((set) => set.id)).toEqual([CURRENT, FUTURE]);
  expect(policyAsOf).toBe('2027-01-05');
  expect(PARAMETERS[ANNOUNCED].asOf > policyAsOf).toBe(true);
});

test('applicant, principal and What-if evaluate only the displayed columns', () => {
  const draft = familyDraft();
  const results = [
    runSimulation(draft),
    runPrincipalSimulation(draft)!,
    runSimulation(
      applyWhatIf(draft, {
        ...initialWhatIf(draft),
        simulationDate: '2030-01-15',
      }),
    ),
  ];
  for (const result of results) {
    expect(Object.keys(result.byRuleSet)).toEqual([CURRENT, FUTURE]);
    expect(result.byRuleSet[FUTURE]).toEqual(result.byRuleSet[CURRENT]);
    expect(result.policyAsOf).toBe('2027-01-05');
  }
  expect(evaluate).toHaveBeenCalledTimes(3);
  for (const [request] of vi.mocked(evaluate).mock.calls)
    expect(request.ruleSetIds).toEqual([CURRENT, FUTURE]);

  draft.screening.criminality = 'yes';
  expect(runSimulation(draft)).toMatchObject({
    policyAsOf: '2027-01-05',
    byRuleSet: {},
    shortCircuit: { reason: 'CRIMINALITY' },
  });
  expect(evaluate).toHaveBeenCalledTimes(3);
});

test('saved scenarios recalculate their summaries with the displayed rule sets', () => {
  const storage = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
  });
  expect(readScenarios().scenarios).toEqual([]);
  saveScenario('Synthetic version', familyDraft());
  const [scenario] = readScenarios().scenarios;
  expect(scenario.name).toBe('Synthetic version');
  for (const draft of [scenario.draft, loadScenario(scenario)]) {
    const result = runSimulation(draft);
    expect(Object.keys(result.byRuleSet)).toEqual([CURRENT, FUTURE]);
    expect(result.policyAsOf).toBe('2027-01-05');
  }
});

test.each([
  ['zh-CN', '已立法，2027-01-01 起生效', '结果页未显示'],
  ['en', 'Laid, in force from 2027-01-01', 'Not shown on the results page'],
] as const)(
  'all badges include the effective date and policy lists all three sets in %s',
  (locale, badge, hidden) => {
    const draft = familyDraft();
    const result = render(
      <ResultView result={runSimulation(draft, locale)} />,
      locale,
    );
    const principal = render(
      <PrincipalAssessment result={runPrincipalSimulation(draft, locale)!} />,
      locale,
    );
    const whatif = render(<WhatIfView draft={draft} />, locale);
    const about = render(<AboutContent />, locale);
    const status = render(<PolicyStatus asOf={policyAsOf} />, locale);
    for (const html of [result, principal, whatif, about, status]) {
      expect(html).toContain(badge);
      expect(html).not.toContain(ANNOUNCED);
    }
    for (const html of [result, principal, whatif]) {
      expect(html.match(/<h2[^>]*id="[^"]+-heading"/g)).toHaveLength(2);
      for (const id of [CURRENT, FUTURE])
        expect(html).toContain(`${id}-heading`);
    }
    expect(about.match(/<article/g)).toHaveLength(2);
    for (const html of [result, whatif, about, status])
      expect(html).toContain('dateTime="2027-01-05">2027-01-05</time>');

    const policy = render(<PolicyPage />, locale);
    const cards = policy.match(/<article\b[\s\S]*?<\/article>/g)!;
    expect(cards).toHaveLength(3);
    expect(
      cards.map((card) => card.match(/data-rule-set="([^"]+)"/)![1]),
    ).toEqual(RULE_SET_IDS);
    for (const id of RULE_SET_IDS) {
      const card = cards.find((html) =>
        html.includes(`data-rule-set="${id}"`),
      )!;
      expect(card).toContain(`dateTime="${PARAMETERS[id].asOf}"`);
      for (const source of RULE_SETS[id].sources)
        expect(card).toContain(source.srcId);
      if (id === ANNOUNCED) expect(card).toContain(hidden);
      else expect(card).not.toContain(hidden);
    }
    expect(policy).toContain(badge);
    expect(policy.match(/<table/g)).toHaveLength(3);
    if (locale === 'en') expect(policy).not.toMatch(/[\u3400-\u9fff]/);
  },
);
