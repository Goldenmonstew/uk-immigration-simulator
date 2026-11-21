'use client';

import Link from 'next/link';
import { PolicyStatus } from '../components/policy-status';
import { SavedScenarios } from '../components/saved-scenarios';
import { useTranslation } from '../i18n/locale';
import { punct } from '../i18n/punctuation';
import { policyAsOf } from '../lib/policy';
import { townBanner } from './game/art';
import styles from './site.module.css';

export default function Home() {
  const { t, locale } = useTranslation();
  const p = punct(locale);
  return (
    <main id="main" className={styles.main}>
      <PolicyStatus asOf={policyAsOf} />
      <div className={styles.homeHero}>
        <div className={styles.narrow}>
          <h1>{t('home.title')}</h1>
          <p className={styles.lead}>{t('home.intro')}</p>
          <details className={styles.scope}>
            <summary>{t('home.scopeTitle')}</summary>
            <p>{t('home.scope')}</p>
          </details>
          <div className={`${styles.actions} ${styles.homeActions}`}>
            <Link className={styles.button} href="/simulate">
              {t('home.start')}
            </Link>
          </div>
        </div>
        <Link className={styles.gameEntry} href="/game">
          <span
            className={styles.gameBanner}
            style={{ backgroundImage: `url("${townBanner}")` }}
            aria-hidden="true"
          />
          <span className={styles.gameEntryTitle}>{t('game.entry')}</span>
          <span className={styles.gameEntryDesc}>{t('game.entryDesc')}</span>
        </Link>
      </div>
      <div className={styles.narrow}>
        <SavedScenarios />
        <section className={styles.section}>
          <h2>{t('pilot.entryTitle')}</h2>
          <ul>
            <li>
              <Link href="/australia">{t('au.entryLink')}</Link>
              {p.colon}
              {t('au.entryDesc')}
            </li>
            <li>
              <Link href="/new-zealand">{t('nz.entryLink')}</Link>
              {p.colon}
              {t('nz.entryDesc')}
            </li>
          </ul>
        </section>
        <section className={styles.section}>
          <h2>{t('home.before')}</h2>
          <p>{t('home.prepare')}</p>
          <p className={styles.notice}>{t('home.privacy')}</p>
        </section>
        <section className={styles.section}>
          <h2>{t('home.disclaimerTitle')}</h2>
          <p>
            {t('home.disclaimer')} <Link href="/about">{t('about.link')}</Link>
          </p>
          {locale === 'zh-CN' && (
            <p lang="en" className={styles.muted}>
              {t('home.disclaimerEnglish')}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
