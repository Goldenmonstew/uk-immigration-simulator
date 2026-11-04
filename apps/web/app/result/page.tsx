'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { SimulationResult } from '@uk-immigration/engine';
import { PrincipalAssessment, ResultView } from '../../components/result-view';
import { ShareLink } from '../../components/share-link';
import { useTranslation } from '../../i18n/locale';
import { mockResults } from '../../lib/mock-results';
import {
  type Draft,
  needsPrincipal,
  runPrincipalSimulation,
  runSimulation,
} from '../../lib/questionnaire';
import { decodeDraft } from '../../lib/share';
import {
  draftStorage,
  getRememberedResult,
  rememberResult,
} from '../../lib/storage';
import styles from '../site.module.css';

export default function ResultPage() {
  const { t } = useTranslation();
  const [result, setResult] = useState<SimulationResult>();
  const [draft, setDraft] = useState<Draft>();
  const [shared, setShared] = useState(false);
  const [ready, setReady] = useState(false);
  const [mock, setMock] = useState(false);
  useEffect(() => {
    const load = () => {
      setResult(undefined);
      setDraft(undefined);
      setShared(false);
      setMock(false);
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const preview = new URLSearchParams(window.location.search).get('mock');
      if (hash.has('s')) {
        const incoming = decodeDraft(hash.get('s')!);
        try {
          if (incoming) {
            const nextResult = runSimulation(incoming);
            draftStorage(incoming);
            rememberResult(nextResult);
            setDraft(incoming);
            setResult(nextResult);
            setShared(true);
          }
        } catch {
          // A malformed external scenario must not replace the saved draft.
        }
      } else if (preview === '1' || preview === '2') {
        setResult(mockResults[preview]);
        setMock(true);
      } else {
        const { draft } = draftStorage();
        if (draft?.completed) {
          setDraft(draft);
          setResult(getRememberedResult() ?? runSimulation(draft));
        }
      }
      setReady(true);
    };
    load();
    window.addEventListener('hashchange', load);
    return () => window.removeEventListener('hashchange', load);
  }, []);

  const principalResult =
    draft && needsPrincipal(draft) ? runPrincipalSimulation(draft) : undefined;

  return (
    <main id="main" className={styles.main}>
      {!ready ? (
        <p role="status">{t('result.loading')}</p>
      ) : result ? (
        <>
          {shared && (
            <p className={styles.notice} role="status">
              {t('share.loaded')}
            </p>
          )}
          {draft && <ShareLink draft={draft} />}
          <ResultView result={result} mock={mock} />
          {principalResult && <PrincipalAssessment result={principalResult} />}
          <div className={styles.actions}>
            {!result.shortCircuit && (
              <Link className={styles.secondary} href="/whatif">
                {t('whatif.title')}
              </Link>
            )}
            <Link className={styles.button} href="/simulate">
              {t('result.edit')}
            </Link>
          </div>
        </>
      ) : (
        <div className={styles.narrow}>
          <h1>{t('result.title')}</h1>
          <p>{t('result.empty')}</p>
          <Link className={styles.button} href="/simulate">
            {t('home.start')}
          </Link>
        </div>
      )}
    </main>
  );
}
