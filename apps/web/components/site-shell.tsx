'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useTranslation } from '../i18n/locale';
import styles from '../app/site.module.css';

export function SiteShell({ children }: { children: ReactNode }) {
  const { t, locale, setLocale } = useTranslation();
  return (
    <>
      <a className={styles.skip} href="#main">
        {t('site.skip')}
      </a>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/">{t('site.name')}</Link>
          <span>{t('site.englishName')}</span>
          <nav aria-label={t('site.navigation')}>
            <Link href="/policy">{t('site.policy')}</Link>
          </nav>
          <div
            className={styles.languages}
            role="group"
            aria-label={t('site.language')}
          >
            <button
              type="button"
              lang="zh-CN"
              aria-pressed={locale === 'zh-CN'}
              onClick={() => setLocale('zh-CN')}
            >
              {t('site.chinese')}
            </button>
            <button
              type="button"
              lang="en"
              aria-pressed={locale === 'en'}
              onClick={() => setLocale('en')}
            >
              English
            </button>
          </div>
        </div>
      </header>
      {children}
      <footer className={styles.footer}>
        <p>{t('site.footer')}</p>
      </footer>
    </>
  );
}
