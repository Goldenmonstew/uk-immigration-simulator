'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { SimulationResult } from '@uk-immigration/engine';
import { PrincipalAssessment, ResultView } from '../../components/result-view';
import { ShareLink } from '../../components/share-link';
import { SavedScenarios } from '../../components/saved-scenarios';
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
  const { t, locale } = useTranslation();
  const [result, setResult] = useState<SimulationResult>();
  const [draft, setDraft] = useState<Draft>();
  const [shared, setShared] = useState(false);
  const [ready, setReady] = useState(false);
  const [mock, setMock] = useState(false);
  useEffect(() => {
    let details: [HTMLDetailsElement, boolean][] | undefined;
    const beforePrint = () => {
      if (details) return;
      details = Array.from(document.querySelectorAll('details'), (element) => [
        element,
        element.open,
      ]);
      details.forEach(([element]) => {
        element.open = true;
      });
    };
    const afterPrint = () => {
      details?.forEach(([element, open]) => {
        element.open = open;
      });
      details = undefined;
    };
    window.addEventListener('beforeprint', beforePrint);
    window.addEventListener('afterprint', afterPrint);
    return () => {
      afterPrint();
      window.removeEventListener('beforeprint', beforePrint);
      window.removeEventListener('afterprint', afterPrint);
    };
  }, []);
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
            const nextResult = runSimulation(incoming, locale);
            draftStorage(incoming);
            rememberResult(nextResult, locale);
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
          setResult(
            getRememberedResult(locale) ?? runSimulation(draft, locale),
          );
        }
      }
      setReady(true);
    };
    load();
    window.addEventListener('hashchange', load);
    return () => window.removeEventListener('hashchange', load);
  }, [locale]);

  const principalResult =
    draft && needsPrincipal(draft)
      ? runPrincipalSimulation(draft, locale)
      : undefined;

  return (
    <main id="main" className={styles.main}>
      {!ready ? (
        <p role="status">{t('result.loading')}</p>
      ) : result ? (
        <>
          <p className={styles.printOnly}>
            {t('site.name')} · {t('whatif.date')}：
            {draft?.simulationDate ?? t('result.undetermined')} ·{' '}
            {t('policy.asOf')}：{result.policyAsOf}
          </p>
          {shared && (
            <p className={`${styles.notice} ${styles.noPrint}`} role="status">
              {t('share.loaded')}
            </p>
          )}
          {draft && <ShareLink draft={draft} />}
          <ResultView result={result} mock={mock} />
          {principalResult && <PrincipalAssessment result={principalResult} />}
          <div className={`${styles.actions} ${styles.noPrint}`}>
            <button
              className={styles.secondary}
              type="button"
              onClick={() => window.print()}
            >
              {t('result.print')}
            </button>
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
      {ready && (
        <SavedScenarios
          draft={draft}
          onLoad={(next) => {
            setDraft(next);
            setResult(runSimulation(next, locale));
            setShared(false);
            setMock(false);
          }}
        />
      )}
      {result && (
        <footer className={styles.printOnly}>{t('home.disclaimer')}</footer>
      )}
    </main>
  );
}
