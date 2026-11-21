'use client';

import type { ReactNode, Ref } from 'react';
import type { PilotResult as PilotResultData } from '@uk-immigration/engine';
import { useTranslation } from '../../i18n/locale';
import { punct } from '../../i18n/punctuation';
import { sourceUrls } from '../../lib/sources';
import site from '../site.module.css';
import styles from './pilot.module.css';

export function PilotResult({
  result,
  headingRef,
}: {
  result: PilotResultData;
  headingRef?: Ref<HTMLHeadingElement>;
}) {
  const { t, locale } = useTranslation();
  const p = punct(locale);
  const list = (title: string, items: ReactNode[]) =>
    items.length > 0 && (
      <details className={styles.more}>
        <summary>{title}</summary>
        <ul>
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </details>
    );
  return (
    <section className={site.section} aria-labelledby="pilot-result">
      <h2 id="pilot-result" ref={headingRef} tabIndex={-1}>
        {t('pilot.resultTitle')}
      </h2>
      <p className={site.muted}>
        {t('pilot.policyAsOf').replace('{date}', result.policyAsOf)}
      </p>
      {result.pathways.map((pathway) => (
        <article
          key={pathway.id}
          className={styles.pathway}
          data-pathway={pathway.id}
          data-status={pathway.status}
        >
          <h3>{pathway.title}</h3>
          <p className={styles.status}>
            {t(`pilot.status.${pathway.status}`).replace(
              '{date}',
              pathway.earliestDate ?? '',
            )}
          </p>
          <p>{pathway.summary}</p>
          {pathway.checks.length > 0 && (
            <>
              <h4>{t('pilot.checks')}</h4>
              <ul className={styles.checks}>
                {pathway.checks.map((c, i) => (
                  <li key={i} data-met={c.met ?? 'unknown'}>
                    <span aria-hidden="true">
                      {c.met === undefined ? '?' : c.met ? '✓' : '✗'}{' '}
                    </span>
                    <span className={styles.label}>
                      {c.met === undefined
                        ? t('pilot.unknownCheck')
                        : c.met
                          ? t('pilot.met')
                          : t('pilot.notMet')}
                      {p.colon}
                    </span>
                    {c.text}{' '}
                    <span className={styles.sources}>
                      {c.sources.map((s, n) => (
                        <a key={n} href={sourceUrls[s.srcId]}>
                          {s.srcId} {s.locator}
                        </a>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
          {list(t('pilot.notChecked'), pathway.notChecked)}
          {list(t('pilot.assumptions'), pathway.assumptions)}
          {pathway.pendingDetails && (
            <p className={site.muted}>
              {t('pilot.pending')}
              {p.colon}
              {pathway.pendingDetails.join(p.list)}
            </p>
          )}
        </article>
      ))}
      <p className={site.muted}>{t('pilot.disclaimer')}</p>
    </section>
  );
}
