import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import Home from '../app/page';
import { ResultView } from '../components/result-view';
import { SiteShell } from '../components/site-shell';
import { WhatIfView } from '../components/whatif-lab';
import { t } from '../i18n';
import { LocaleContext } from '../i18n/locale';
import { createDraft, runSimulation } from '../lib/questionnaire';

test('changing the locale renders translated UI and preserves engine explanations', () => {
  const draft = createDraft();
  draft.completed = true;
  draft.simulationDate = '2026-11-04';
  const result = runSimulation(draft);
  const render = (locale: 'zh-CN' | 'en') =>
    renderToStaticMarkup(
      <LocaleContext value={{ locale, setLocale: () => {} }}>
        <SiteShell>
          <Home />
          <ResultView result={result} />
          <WhatIfView draft={draft} />
        </SiteShell>
      </LocaleContext>,
    );
  const chinese = render('zh-CN');
  const english = render('en');
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
  expect(english).toContain('lang="en" aria-pressed="true"');
  expect(chinese).toContain('lang="zh-CN" aria-pressed="true"');
  for (const assessment of Object.values(result.byRuleSet)) {
    for (const rule of assessment.rules) {
      expect(english).toContain(rule.title);
      expect(english).toContain(rule.explanation);
    }
  }
});
