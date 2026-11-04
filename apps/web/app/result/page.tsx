import type { Metadata } from 'next';
import { t } from '../../i18n';
import ResultContent from './result-content';

export const metadata: Metadata = {
  description: t('result.intro'),
  openGraph: {
    title: t('result.title'),
    description: t('result.intro'),
    type: 'website',
  },
};

export default function Page() {
  return <ResultContent />;
}
