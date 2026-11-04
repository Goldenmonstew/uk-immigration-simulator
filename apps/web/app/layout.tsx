import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { t } from '../i18n';
import { LocaleProvider } from '../i18n/locale';
import { SiteShell } from '../components/site-shell';
import styles from './site.module.css';

export const metadata: Metadata = {
  description: t('home.intro'),
  referrer: 'no-referrer',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={styles.body}>
        <LocaleProvider>
          <SiteShell>{children}</SiteShell>
        </LocaleProvider>
      </body>
    </html>
  );
}
