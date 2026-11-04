import Link from 'next/link';
import { PolicyStatus } from '../components/policy-status';
import { t } from '../i18n';
import { policyAsOf } from '../lib/policy';
import styles from './site.module.css';

export default function Home() {
  return (
    <main id="main" className={styles.main}>
      <PolicyStatus asOf={policyAsOf} />
      <div className={styles.narrow}>
        <h1>{t('home.title')}</h1>
        <p className={styles.lead}>{t('home.intro')}</p>
        <p>{t('home.scope')}</p>
        <div className={styles.actions}>
          <Link className={styles.button} href="/simulate">
            {t('home.start')}
          </Link>
        </div>
        <section className={styles.section}>
          <h2>{t('home.before')}</h2>
          <p>{t('home.prepare')}</p>
          <p className={styles.notice}>{t('home.privacy')}</p>
        </section>
        <section className={styles.section}>
          <h2>{t('home.disclaimerTitle')}</h2>
          <p>{t('home.disclaimer')}</p>
          <p lang="en" className={styles.muted}>
            {t('home.disclaimerEnglish')}
          </p>
        </section>
      </div>
    </main>
  );
}
