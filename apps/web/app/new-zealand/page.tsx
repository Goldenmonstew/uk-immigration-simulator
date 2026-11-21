import type { Metadata } from 'next';
import { t } from '../../i18n';
import NewZealandContent from './new-zealand-content';

export const metadata: Metadata = {
  description: t('nz.intro'),
  openGraph: {
    title: t('nz.title'),
    description: t('nz.intro'),
    type: 'website',
  },
};

export default function Page() {
  return <NewZealandContent />;
}
