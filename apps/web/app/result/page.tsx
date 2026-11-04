'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { SimulationResult } from '@uk-immigration/engine';
import { ResultView } from '../../components/result-view';
import { t } from '../../i18n';
import { mockResults } from '../../lib/mock-results';
import { runSimulation } from '../../lib/questionnaire';
import { draftStorage, getRememberedResult } from '../../lib/storage';
import styles from '../site.module.css';

export default function ResultPage() {
  const [result, setResult] = useState<SimulationResult>();
  const [ready, setReady] = useState(false);
  const [mock, setMock] = useState(false);
  useEffect(() => {
    const preview = new URLSearchParams(window.location.search).get('mock');
    if (preview === '1' || preview === '2') {
      setResult(mockResults[preview]);
      setMock(true);
    } else {
      const { draft } = draftStorage();
      if (draft?.completed)
        setResult(getRememberedResult() ?? runSimulation(draft));
    }
    setReady(true);
  }, []);

  return (
    <main id="main" className={styles.main}>
      {!ready ? (
        <p role="status">{t('result.loading')}</p>
      ) : result ? (
        <>
          <ResultView result={result} mock={mock} />
          <div className={styles.actions}>
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
