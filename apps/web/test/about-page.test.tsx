import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import AboutPage, { metadata } from '../app/about/page';
import Home from '../app/page';
import PolicyPage from '../app/policy/page';
import { ResultView } from '../components/result-view';
import { SiteShell } from '../components/site-shell';
import { t } from '../i18n';
import { LocaleContext } from '../i18n/locale';
import { policyAsOf, displayedRuleSets } from '../lib/policy';
import { createDraft, runSimulation } from '../lib/questionnaire';

test.each(['zh-CN', 'en'] as const)(
  'about renders its method, policy data, privacy and feedback in %s',
  (locale) => {
    const html = renderToStaticMarkup(
      <LocaleContext value={{ locale, setLocale: () => {} }}>
        <SiteShell>
          <AboutPage />
        </SiteShell>
      </LocaleContext>,
    );
    for (const key of [
      'about.title',
      'about.intro',
      'about.limits',
      'about.currentLawScope',
      'about.reforms',
      'about.reformScope',
      'about.informationGaps',
      'about.pending',
      'about.localPrivacy',
      'about.sharePrivacy',
      'about.analyticsPrivacy',
      'about.feedbackTitle',
      'about.feedbackIntro',
      'about.feedbackPrivacy',
    ] as const)
      expect(html).toContain(t(key, locale));
    expect(html).toContain(`dateTime="${policyAsOf}">${policyAsOf}</time>`);
    for (const ruleSet of displayedRuleSets) {
      expect(html).toContain(`<code>${ruleSet.id}</code>`);
      expect(html).toContain(t(`policy.${ruleSet.status}`, locale));
    }
    expect(html).toContain('href="/about"');
    expect(html).toContain('href="/policy"');
    expect(html).toContain('href="/policy#rules-heading"');
    expect(renderToStaticMarkup(<PolicyPage />)).toContain(
      'id="rules-heading"',
    );
    const feedbackUrl =
      'https://github.com/Goldenmonstew/uk-immigration-simulator/issues/new?template=feedback.md';
    const feedbackSection = html.match(
      /<section[^>]*aria-labelledby="about-feedback"[^>]*>[\s\S]*?<\/section>/,
    )?.[0];
    expect(feedbackSection).toContain(
      `<a href="${feedbackUrl}" target="_blank" rel="noreferrer">${t('about.feedbackLink', locale)}</a>`,
    );
    const footer = html.match(/<footer[\s\S]*?<\/footer>/)?.[0];
    expect(footer).toContain(
      `<a href="${feedbackUrl}" target="_blank" rel="noreferrer">${t('site.feedback', locale)}</a>`,
    );
    expect(footer).toContain(`href="/policy">${t('site.policy', locale)}</a>`);
    expect(footer).toContain(`href="/about">${t('site.about', locale)}</a>`);
    if (locale === 'en') expect(html).not.toMatch(/[\u3400-\u9fff：、（）]/);
  },
);

test('about exports static social metadata', () => {
  expect(metadata.description).toBe(t('about.intro'));
  expect(metadata.openGraph).toMatchObject({
    title: t('about.title'),
    type: 'website',
  });
});

test.each(['zh-CN', 'en'] as const)(
  'home and result disclaimers link to about in %s, including short circuits',
  (locale) => {
    const draft = createDraft();
    const results = [runSimulation(draft, locale)];
    draft.screening.criminality = 'yes';
    results.push(runSimulation(draft, locale));
    for (const page of [
      <Home key="home" />,
      ...results.map((result, i) => <ResultView key={i} result={result} />),
    ]) {
      const html = renderToStaticMarkup(
        <LocaleContext value={{ locale, setLocale: () => {} }}>
          {page}
        </LocaleContext>,
      );
      expect(html).toContain(t('home.disclaimer', locale));
      expect(html).toContain(`<a href="/about">${t('about.link', locale)}</a>`);
      expect(html).not.toContain('github.com/Goldenmonstew');
    }
  },
);

test('the service worker precaches about and uses the new cache version', () => {
  const source = readFileSync(
    new URL('../public/sw.js', import.meta.url),
    'utf8',
  );
  expect(source).toMatch(/const PAGES = \[[^\]]*'\/about'/);
  expect(source).toContain('2026-11-04-v2');
  expect(source).toContain('...PAGES');
});
