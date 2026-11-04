'use client';

import Link from 'next/link';
import { useTranslation } from '../../i18n/locale';
import { punct } from '../../i18n/punctuation';
import { policyAsOf, ruleSets } from '../../lib/policy';
import site from '../site.module.css';
import styles from '../policy/policy.module.css';

export default function AboutContent() {
  const { t, locale } = useTranslation();
  const p = punct(locale);
  return (
    <main id="main" className={site.main}>
      <div className={site.narrow}>
        <h1>{t('about.title')}</h1>
        <p className={site.lead}>{t('about.intro')}</p>
        <p className={site.notice}>{t('about.limits')}</p>
      </div>
      <section className={site.section} aria-labelledby="about-columns">
        <h2 id="about-columns">{t('about.columnsTitle')}</h2>
        <div className={styles.ruleSets}>
          {ruleSets.map((ruleSet) => (
            <article key={ruleSet.id} className={styles.card}>
              <h3>{t(`policy.${ruleSet.kind}`)}</h3>
              <p
                className={`${site.badge} ${ruleSet.kind === 'ANNOUNCED' ? site.announced : ''}`}
              >
                {t(`policy.${ruleSet.status}`)}
              </p>
              <p>
                {t(
                  ruleSet.kind === 'LAW' ? 'about.currentLaw' : 'about.reforms',
                )}
              </p>
              <p>
                {t(
                  ruleSet.kind === 'LAW'
                    ? 'about.currentLawScope'
                    : 'about.reformScope',
                )}
              </p>
            </article>
          ))}
        </div>
        <p className={site.notice}>{t('about.informationGaps')}</p>
      </section>
      <div className={site.narrow}>
        <section className={site.section} aria-labelledby="about-sources">
          <h2 id="about-sources">{t('about.sourcesTitle')}</h2>
          <p>{t('about.sources')}</p>
          <p>
            {t('policy.asOf')}
            {p.colon}
            <time dateTime={policyAsOf}>{policyAsOf}</time>
          </p>
          <ul>
            {ruleSets.map((ruleSet) => (
              <li key={ruleSet.id}>
                {t(`policy.${ruleSet.kind}`)}
                {p.colon}
                <code>{ruleSet.id}</code>
              </li>
            ))}
          </ul>
          <p>
            <Link href="/policy">{t('about.policyLink')}</Link>
          </p>
        </section>
        <section className={site.section} aria-labelledby="about-pending">
          <h2 id="about-pending">{t('about.pendingTitle')}</h2>
          <p>{t('about.pending')}</p>
          <p>
            <Link href="/policy#rules-heading">{t('about.pendingLink')}</Link>
          </p>
        </section>
        <section className={site.section} aria-labelledby="about-privacy">
          <h2 id="about-privacy">{t('about.privacyTitle')}</h2>
          <p>{t('about.localPrivacy')}</p>
          <p>{t('about.sharePrivacy')}</p>
          <p>{t('about.analyticsPrivacy')}</p>
        </section>
      </div>
    </main>
  );
}
