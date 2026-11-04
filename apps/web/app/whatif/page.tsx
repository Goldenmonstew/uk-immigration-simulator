'use client';

import { useEffect, useRef, useState } from 'react';
import { WhatIfView } from '../../components/whatif-lab';
import { useTranslation } from '../../i18n/locale';
import type { Draft } from '../../lib/questionnaire';
import { draftStorage } from '../../lib/storage';
import {
  parseWhatIfFocus,
  takeWhatIfTarget,
  type WhatIfTarget,
} from '../../lib/whatif';
import site from '../site.module.css';

export default function WhatIfPage() {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<Draft>();
  const [ready, setReady] = useState(false);
  const [target, setTarget] = useState<WhatIfTarget>();
  const loaded = useRef(false);
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    setDraft(draftStorage().draft);
    const url = new URL(window.location.href);
    setTarget(
      takeWhatIfTarget(parseWhatIfFocus(url.searchParams.get('focus'))),
    );
    if (url.searchParams.has('focus')) {
      url.searchParams.delete('focus');
      window.history.replaceState(
        window.history.state,
        '',
        `${url.pathname}${url.search}${url.hash}`,
      );
    }
    setReady(true);
  }, []);
  return (
    <main id="main" className={site.main}>
      {ready ? (
        <WhatIfView draft={draft} target={target} />
      ) : (
        <p role="status">{t('result.loading')}</p>
      )}
    </main>
  );
}
