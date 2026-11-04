'use client';

import { useState } from 'react';
import { useTranslation } from '../i18n/locale';
import type { Draft } from '../lib/questionnaire';
import { encodeDraft } from '../lib/share';
import site from '../app/site.module.css';
import styles from './share-link.module.css';

export function ShareLink({ draft }: { draft: Draft }) {
  const { t } = useTranslation();
  const encoded = encodeDraft(draft);
  const [copied, setCopied] = useState<string>();
  const [manual, setManual] = useState<{ encoded: string; url: string }>();
  const copy = async () => {
    const url = `${window.location.origin}/result#s=${encoded}`;
    setCopied(undefined);
    setManual(undefined);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(encoded);
    } catch {
      setManual({ encoded, url });
    }
  };
  return (
    <section
      className={`${styles.share} ${site.noPrint}`}
      aria-label={t('share.copy')}
    >
      <div className={styles.row}>
        <button type="button" className={site.secondary} onClick={copy}>
          {t('share.copy')}
        </button>
        <p className={site.muted}>{t('share.privacy')}</p>
      </div>
      <div role="status">
        {copied === encoded && <p>{t('share.copied')}</p>}
        {manual?.encoded === encoded && (
          <label className={styles.manual}>
            {t('share.manual')}
            <textarea
              readOnly
              rows={4}
              value={manual.url}
              onFocus={(event) => event.target.select()}
            />
          </label>
        )}
      </div>
    </section>
  );
}
