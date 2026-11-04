import type { Metadata } from 'next';
import { t } from '../../i18n';
import AboutContent from './about-content';

export const metadata: Metadata = {
  description: t('about.intro'),
  openGraph: {
    title: t('about.title'),
    description: t('about.intro'),
    type: 'website',
  },
};

export default function Page() {
  return <AboutContent />;
}
