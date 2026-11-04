import type { Metadata } from 'next';
import { t } from '../i18n';
import HomeContent from './home-content';

export const metadata: Metadata = {
  description: t('home.intro'),
  openGraph: {
    title: t('site.name'),
    description: t('home.intro'),
    type: 'website',
  },
};

export default function Page() {
  return <HomeContent />;
}
