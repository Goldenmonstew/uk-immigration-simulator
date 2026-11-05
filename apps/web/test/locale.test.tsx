import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test, vi } from 'vitest';
import * as engine from '@uk-immigration/engine';
import * as policyData from '@uk-immigration/policy-data';
import { esP31IndividualAPartnerArrivesTogether as together } from '../../../packages/policy-data/fixtures/es-p31-individual-a-partner-arrives-together';
import Home from '../app/page';
import { PrincipalAssessment, ResultView } from '../components/result-view';
import { SiteShell } from '../components/site-shell';
import { WhatIfView } from '../components/whatif-lab';
import { t } from '../i18n';
import { LocaleContext } from '../i18n/locale';
import { routeNames, routeGroupNames, routeLabel } from '../i18n/routes';
import {
  createDraft,
  runPrincipalSimulation,
  runSimulation,
  shortCircuitKeys,
} from '../lib/questionnaire';
import { getRememberedResult, rememberResult } from '../lib/storage';

const familyDraft = () => ({
  ...createDraft(),
  ...structuredClone(together.request),
  completed: true,
});
const cjk = /[\u3400-\u9fff]/;

test('all route and group labels preserve bilingual Chinese and English-only English', () => {
  expect(routeNames).toBe(policyData.routeNames);
  expect(routeGroupNames).toBe(policyData.routeGroupNames);
  for (const names of [
    ...Object.values(routeNames),
    ...Object.values(routeGroupNames),
  ]) {
    expect(names['zh-CN']).toMatch(cjk);
    expect(routeLabel(names, 'zh-CN')).toBe(`${names['zh-CN']} · ${names.en}`);
    expect(routeLabel(names, 'en')).toBe(names.en);
    expect(routeLabel(names, 'zh-CN', true)).toBe(names['zh-CN']);
    expect(routeLabel(names, 'en', true)).toBe(names.en);
    expect(names.en).not.toMatch(cjk);
  }
  expect(
    routeLabel({ 'zh-CN': '中文 · English', en: 'English' }, 'zh-CN'),
  ).toBe('中文 · English');
  expect(
    routeLabel({ 'zh-CN': '中文 · English', en: 'English' }, 'zh-CN', true),
  ).toBe('中文');
  const render = (locale: 'zh-CN' | 'en') =>
    renderToStaticMarkup(
      <LocaleContext value={{ locale, setLocale: () => {} }}>
        <ResultView result={runSimulation(familyDraft(), locale)} />
      </LocaleContext>,
    );
  expect(render('zh-CN')).toContain(routeGroupNames.CORE_PERMISSION['zh-CN']);
  expect(render('en')).toContain(
    `<dd>${routeGroupNames.CORE_PERMISSION.en}</dd>`,
  );
  expect(render('en')).not.toContain(routeGroupNames.CORE_PERMISSION['zh-CN']);
});

function expectEnglish(result: engine.SimulationResult) {
  expect(Object.values(result.byRuleSet).length).toBeGreaterThan(0);
  for (const assessment of Object.values(result.byRuleSet)) {
    expect(assessment.rules.length).toBeGreaterThan(0);
    for (const rule of assessment.rules) {
      expect(rule.title).not.toMatch(cjk);
      expect(rule.explanation).not.toMatch(cjk);
    }
    for (const assumption of assessment.assumptions)
      expect(assumption).not.toMatch(cjk);
  }
  if (result.shortCircuit) expect(result.shortCircuit.message).not.toMatch(cjk);
}

test('English reaches evaluate for the applicant and separate principal assessment', () => {
  const draft = familyDraft();
  const evaluate = vi.spyOn(engine, 'evaluate');
  try {
    expectEnglish(runSimulation(draft, 'en'));
    expect(evaluate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        locale: 'en',
        principal: expect.objectContaining({
          episodes: draft.principal!.episodes,
        }),
      }),
    );
    expectEnglish(runPrincipalSimulation(draft, 'en')!);
    expect(evaluate).toHaveBeenLastCalledWith(
      expect.objectContaining({ locale: 'en' }),
    );
    expect(evaluate.mock.lastCall![0].principal).toBeUndefined();
  } finally {
    evaluate.mockRestore();
  }
});

test('locale renders the shell title, engine result, principal and What-if explanations in the selected language', () => {
  const draft = familyDraft();
  const render = (locale: 'zh-CN' | 'en') =>
    renderToStaticMarkup(
      <LocaleContext value={{ locale, setLocale: () => {} }}>
        <SiteShell>
          <Home />
          <ResultView result={runSimulation(draft, locale)} />
          <PrincipalAssessment
            result={runPrincipalSimulation(draft, locale)!}
          />
          <WhatIfView draft={draft} />
        </SiteShell>
      </LocaleContext>,
    );
  const chinese = render('zh-CN');
  const english = render('en');
  expect(english).not.toMatch(cjk);
  expect(english).not.toMatch(/[：、（）]/);
  for (const key of [
    'site.name',
    'home.title',
    'result.title',
    'whatif.controls',
    'form.unknown',
  ] as const) {
    expect(chinese).toContain(t(key));
    expect(english).toContain(t(key, 'en'));
    expect(english).not.toContain(t(key));
  }
  expect(english).toContain(`<title>${t('site.name', 'en')}</title>`);
  expect(chinese).toContain(`<title>${t('site.name')}</title>`);
  for (const html of [chinese, english])
    expect(html).not.toContain('My Immigration Path');
  expect(english).toContain('lang="en" aria-pressed="true"');
  expect(chinese).toContain('lang="zh-CN" aria-pressed="true"');
  for (const result of [
    runSimulation(draft, 'en'),
    runPrincipalSimulation(draft, 'en')!,
  ]) {
    for (const assessment of Object.values(result.byRuleSet)) {
      for (const rule of assessment.rules) {
        expect(english).toContain(
          renderToStaticMarkup(<strong>{rule.title}</strong>),
        );
        expect(english).toContain(
          renderToStaticMarkup(<p>{rule.explanation}</p>),
        );
      }
    }
  }
  const whatIf = renderToStaticMarkup(
    <LocaleContext value={{ locale: 'en', setLocale: () => {} }}>
      <WhatIfView
        draft={{
          ...draft,
          timeline: { ...draft.timeline, english: undefined },
        }}
      />
    </LocaleContext>,
  );
  expect(whatIf).toContain('ES-ENGLISH');
  expect(whatIf).not.toMatch(cjk);
  expect(whatIf).not.toMatch(/[：、（）]/);
});

test('a remembered result is only reused for its original locale', () => {
  const draft = familyDraft();
  const chinese = runSimulation(draft, 'zh-CN');
  rememberResult(chinese, 'zh-CN');
  expect(getRememberedResult('zh-CN')).toBe(chinese);
  expect(getRememberedResult('en')).toBeUndefined();
  const english = runSimulation(draft, 'en');
  rememberResult(english, 'en');
  expect(getRememberedResult('en')).toBe(english);
  expect(getRememberedResult('zh-CN')).toBeUndefined();
});

test.each(shortCircuitKeys)(
  'frontend %s screening and principal prefix use the selected locale',
  (key) => {
    const draft = familyDraft();
    draft.screening[key] = 'yes';
    expect(runSimulation(draft, 'en').shortCircuit?.message).toBe(
      t('screening.message', 'en'),
    );
    draft.screening[key] = 'no';
    const principalScreening = { ...draft.screening, [key]: 'yes' as const };
    const screened = { ...draft, principalScreening };
    expect(runSimulation(screened, 'en').shortCircuit?.message).toBe(
      `Principal applicant: ${t('screening.message', 'en')}`,
    );
    expect(runPrincipalSimulation(screened, 'en')?.shortCircuit?.message).toBe(
      t('screening.message', 'en'),
    );
  },
);

test('engine short circuit messages are also English', () => {
  const draft = familyDraft();
  draft.timeline.episodes = [
    {
      route: 'HONG_KONG_BNO',
      role: 'MAIN',
      validFrom: '2021-04-06',
      validTo: '2027-04-05',
    },
  ];
  const result = runSimulation(draft, 'en');
  expect(result.shortCircuit?.reason).toBe('OUTSIDE_FRAMEWORK');
  expectEnglish(result);
});
