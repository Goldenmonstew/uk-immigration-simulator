import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { t } from '../i18n';
import styles from './site.module.css';

export const metadata: Metadata = {
  title: t('site.name'),
  description: t('home.intro'),
  referrer: 'no-referrer',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={styles.body}>
        <a className={styles.skip} href="#main">
          {t('site.skip')}
        </a>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <Link href="/">{t('site.name')}</Link>
            <span>{t('site.englishName')}</span>
          </div>
        </header>
        {children}
        <footer className={styles.footer}>
          <p>{t('site.footer')}</p>
        </footer>
      </body>
    </html>
  );
}
