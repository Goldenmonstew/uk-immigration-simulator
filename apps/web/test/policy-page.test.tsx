import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import { RULES, RULE_SETS } from '@uk-immigration/engine';
import {
  currentLaw2026_11,
  earnedSettlement2026_11,
  policyChangelog,
  ROUTE_GROUP_SOURCES,
} from '@uk-immigration/policy-data';
import PolicyPage from '../app/policy/page';
import { SiteShell } from '../components/site-shell';
import { LocaleContext } from '../i18n/locale';
import { englishPolicyChanges, englishRuleTitles } from '../i18n/policy';
import { sourceUrls } from '../lib/sources';

const parameterSets = [currentLaw2026_11, earnedSettlement2026_11];
const render = (locale: 'zh-CN' | 'en' = 'zh-CN') =>
  renderToStaticMarkup(
    <LocaleContext value={{ locale, setLocale: () => {} }}>
      <SiteShell>
        <PolicyPage />
      </SiteShell>
    </LocaleContext>,
  );

test('policy page enumerates the exported rule sets, parameters, rules, changelog and sources', () => {
  const html = render();
  expect(html.match(/data-rule-set=/g)).toHaveLength(
    Object.keys(RULE_SETS).length,
  );
  expect(html.match(/data-rule=/g)).toHaveLength(
    Object.values(RULES).flat().length,
  );
  expect(html.match(/data-parameter=/g)).toHaveLength(
    parameterSets.reduce(
      (count, set) => count + Object.keys(set.values).length,
      0,
    ),
  );
  expect(html.match(/data-policy-change=/g)).toHaveLength(
    policyChangelog.length,
  );
  expect(html.match(/data-source=/g)).toHaveLength(
    Object.keys(sourceUrls).length,
  );
  for (const ruleSet of Object.values(RULE_SETS)) {
    for (const { meta } of RULES[ruleSet.id]) {
      expect(html).toContain(`data-rule="${meta.id}"`);
      expect(html).toContain(meta.title);
      for (const pending of meta.pendingDetails ?? [])
        expect(html).toContain(pending);
    }
  }
  const dates = [...html.matchAll(/data-policy-change="([^"]+)"/g)].map(
    (match) => match[1],
  );
  expect(dates).toEqual(
    policyChangelog
      .map((change) => change.date)
      .sort()
      .reverse(),
  );
  expect(html).not.toMatch(/href="[^"]+\.md/);
});

test('policy page translates all metadata and UI in English, with readable parameter shapes', () => {
  const html = render('en');
  expect(html).not.toMatch(/[\u3400-\u9fff]/);
  expect(html).toContain('href="/policy"');
  expect(Object.keys(englishRuleTitles).sort()).toEqual(
    Object.values(RULES)
      .flat()
      .map((rule) => rule.meta.id)
      .sort(),
  );
  expect(Object.keys(englishPolicyChanges).sort()).toEqual(
    policyChangelog.map((change) => change.date).sort(),
  );
  const es = earnedSettlement2026_11.values;
  const cl = currentLaw2026_11.values;
  expect(html).toContain(
    `${es.bestYears10Year.value.required} of ${es.bestYears10Year.value.window} years`,
  );
  expect(html).toContain(
    es.earningsThresholdMinimum.value.toLocaleString('en'),
  );
  expect(html).toContain(`dateTime="${es.whitePaperPublished.value}"`);
  expect(html).toContain(cl.skilledWorkerSettlementEnglish.value.cefrLevel);
  expect(html).toContain(
    `dateTime="${cl.skilledWorkerSettlementEnglish.value.applicationsFrom}"`,
  );
});

test('every displayed metadata source and route-group source has a registered clickable URL', () => {
  const refs = [
    ...Object.values(RULE_SETS).flatMap((set) => set.sources),
    ...Object.values(RULES)
      .flat()
      .flatMap((rule) => rule.meta.sources),
    ...parameterSets.flatMap((set) =>
      Object.values(set.values).flatMap((value) => value.sources),
    ),
    ...policyChangelog.flatMap((change) => change.sources),
    ...Object.values(ROUTE_GROUP_SOURCES).flat(),
  ];
  const html = render();
  for (const ref of refs) {
    expect(sourceUrls[ref.srcId], ref.srcId).toMatch(/^https:\/\//);
    expect(html).toContain(`href="${sourceUrls[ref.srcId]}"`);
  }
  const register = readFileSync(
    new URL('../../../docs/SOURCES.md', import.meta.url),
    'utf8',
  );
  const ids = [...register.matchAll(/^\| (SRC-\d+) \|/gm)].map(
    (match) => match[1],
  );
  expect(Object.keys(sourceUrls).sort()).toEqual(ids.sort());
  for (const [id, url] of Object.entries(sourceUrls)) {
    const line = register
      .split('\n')
      .find((line) => line.startsWith(`| ${id} |`));
    expect(line).toContain(url);
  }
});
