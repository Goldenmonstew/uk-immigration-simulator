'use client';

import { useEffect, useState } from 'react';
import { WhatIfView } from '../../components/whatif-lab';
import { useTranslation } from '../../i18n/locale';
import type { Draft } from '../../lib/questionnaire';
import { draftStorage } from '../../lib/storage';
import site from '../site.module.css';

export default function WhatIfPage() {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<Draft>();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setDraft(draftStorage().draft);
    setReady(true);
  }, []);
  return (
    <main id="main" className={site.main}>
      {ready ? (
        <WhatIfView draft={draft} />
      ) : (
        <p role="status">{t('result.loading')}</p>
      )}
    </main>
  );
}
