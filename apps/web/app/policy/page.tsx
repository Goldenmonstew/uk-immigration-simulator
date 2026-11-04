'use client';

import { RULES } from '@uk-immigration/engine';
import {
  currentLaw2026_11,
  earnedSettlement2026_11,
  policyChangelog,
} from '@uk-immigration/policy-data';
import type { ParameterSet, SourceRef } from '@uk-immigration/policy-data';
import { useTranslation } from '../../i18n/locale';
import { punct } from '../../i18n/punctuation';
import { ruleSets } from '../../lib/policy';
import { sourceUrls } from '../../lib/sources';
import site from '../site.module.css';
import styles from './policy.module.css';

const parameterSets: Record<string, ParameterSet> = {
  [currentLaw2026_11.ruleSetId]: currentLaw2026_11,
  [earnedSettlement2026_11.ruleSetId]: earnedSettlement2026_11,
};

function Sources({ sources }: { sources: SourceRef[] }) {
  const { locale } = useTranslation();
  return (
    <ul className={styles.sources}>
      {sources.map(({ srcId, locator }, index) => (
        <li key={`${srcId}-${index}`}>
          <a href={sourceUrls[srcId]} target="_blank" rel="noreferrer">
            {srcId}{' '}
            {locale === 'en' ? locator.replace('版本', 'version') : locator}
          </a>
        </li>
      ))}
    </ul>
  );
}

function ParameterValue({
  value,
}: {
  value: ParameterSet['values'][string]['value'];
}) {
  const { t, locale } = useTranslation();
  if (typeof value === 'number') return value.toLocaleString(locale);
  if (typeof value === 'string')
    return /^\d{4}-\d{2}-\d{2}$/.test(value) ? (
      <time dateTime={value}>{value}</time>
    ) : (
      value
    );
  if ('required' in value)
    return t('policyPage.bestYears')
      .replace('{required}', String(value.required))
      .replace('{window}', String(value.window));
  return (
    <>
      {value.cefrLevel} · {t('policyPage.applicationsFrom')}{' '}
      <time dateTime={value.applicationsFrom}>{value.applicationsFrom}</time>
    </>
  );
}

export default function PolicyPage() {
  const { t, locale } = useTranslation();
  const p = punct(locale);
  return (
    <main id="main" className={site.main}>
      <h1>{t('policyPage.title')}</h1>
      <section className={site.section} aria-labelledby="rule-sets-heading">
        <h2 id="rule-sets-heading">{t('policyPage.ruleSets')}</h2>
        <div className={styles.ruleSets}>
          {ruleSets.map((ruleSet) => (
            <article
              key={ruleSet.id}
              className={styles.card}
              data-rule-set={ruleSet.id}
            >
              <h3>{t(`policy.${ruleSet.kind}`)}</h3>
              <p className={site.badge}>{t(`policy.${ruleSet.status}`)}</p>
              <p>
                <code>{ruleSet.id}</code>
              </p>
              <p>
                {t('policy.asOf')}{' '}
                <time dateTime={parameterSets[ruleSet.id].asOf}>
                  {parameterSets[ruleSet.id].asOf}
                </time>
              </p>
              <Sources sources={ruleSet.sources} />
            </article>
          ))}
        </div>
      </section>
      <section className={site.section} aria-labelledby="parameters-heading">
        <h2 id="parameters-heading">{t('policyPage.parameters')}</h2>
        {ruleSets.map((ruleSet) => (
          <table key={ruleSet.id} className={styles.parameters}>
            <caption>{t(`policy.${ruleSet.kind}`)}</caption>
            <thead>
              <tr>
                <th scope="col">{t('policyPage.name')}</th>
                <th scope="col">{t('policyPage.value')}</th>
                <th scope="col">{t('result.sources')}</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(parameterSets[ruleSet.id].values).map(
                ([name, parameter]) => (
                  <tr key={name} data-parameter={name}>
                    <th scope="row">
                      <code>{name}</code>
                    </th>
                    <td data-label={t('policyPage.value')}>
                      <ParameterValue value={parameter.value} />
                    </td>
                    <td data-label={t('result.sources')}>
                      <Sources sources={parameter.sources} />
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        ))}
      </section>
      <section className={site.section} aria-labelledby="rules-heading">
        <h2 id="rules-heading">{t('policyPage.rules')}</h2>
        {ruleSets.map((ruleSet) => (
          <section key={ruleSet.id} className={site.section}>
            <h3>{t(`policy.${ruleSet.kind}`)}</h3>
            <ul className={styles.entries}>
              {RULES[ruleSet.id].map(({ meta }) => (
                <li key={meta.id} data-rule={meta.id}>
                  <h4>{locale === 'en' ? meta.titleEn : meta.title}</h4>
                  <p>
                    <code>{meta.id}</code>
                  </p>
                  <Sources sources={meta.sources} />
                  {!!meta.pendingDetails?.length && (
                    <p className={site.muted}>
                      {t('result.pendingDetails')}
                      {p.colon}
                      {meta.pendingDetails.join(p.list)}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </section>
      <section className={site.section} aria-labelledby="changelog-heading">
        <h2 id="changelog-heading">{t('policyPage.changelog')}</h2>
        <ol className={styles.entries}>
          {[...policyChangelog]
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((change) => (
              <li key={change.date} data-policy-change={change.date}>
                <time dateTime={change.date}>{change.date}</time>
                <h3>{locale === 'en' ? change.titleEn : change.title}</h3>
                <p>{locale === 'en' ? change.summaryEn : change.summary}</p>
                <Sources sources={change.sources} />
              </li>
            ))}
        </ol>
      </section>
      <section className={site.section} aria-labelledby="sources-heading">
        <h2 id="sources-heading">{t('policyPage.sources')}</h2>
        <ul className={styles.entries}>
          {Object.entries(sourceUrls).map(([id, url]) => (
            <li key={id} data-source={id}>
              <strong>{id}</strong>
              <br />
              <a href={url} target="_blank" rel="noreferrer">
                {url}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
