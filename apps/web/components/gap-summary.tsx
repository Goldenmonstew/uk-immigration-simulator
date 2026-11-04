'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import type { SettlementAssessment } from '@uk-immigration/engine';
import { useTranslation } from '../i18n/locale';
import { punct } from '../i18n/punctuation';
import { firstSentence, gapRules, remainingTime } from '../lib/gap-summary';
import { focusForRule, rememberWhatIfTarget } from '../lib/whatif';
import site from '../app/site.module.css';
import styles from '../app/result/result.module.css';

export function GapSummary({
  assessment,
  simulationDate,
  canWhatIf = false,
}: {
  assessment: SettlementAssessment;
  simulationDate?: string;
  canWhatIf?: boolean;
}) {
  const { t, locale } = useTranslation();
  const p = punct(locale);
  const id = useId();
  const [expanded, setExpanded] = useState(false);
  if (
    assessment.outcome === 'REQUIRES_REGULATED_REVIEW' ||
    assessment.outcome === 'POLICY_NOT_YET_IN_FORCE'
  )
    return null;
  const eligible = assessment.outcome === 'LIKELY_ELIGIBLE';
  const rules = eligible ? [] : gapRules(assessment);
  const date =
    assessment.outcome === 'LIKELY_NOT_ELIGIBLE'
      ? assessment.earliestDate
      : undefined;
  const wait =
    date && simulationDate ? remainingTime(simulationDate, date) : undefined;
  const visibleRules = 5 - (date ? 1 : 0);
  return (
    <section className={styles.gap} aria-labelledby={`${id}-heading`}>
      <h3 id={`${id}-heading`}>{t('gap.title')}</h3>
      {eligible ? (
        <p>{t('gap.met')}</p>
      ) : (
        <>
          {!date && !rules.length && <p>{t('result.noRules')}</p>}
          <ul id={id} className={styles.gapList}>
            {date && (
              <li>
                {t('gap.earliest').replace('{date}', date)}
                {wait &&
                  t('gap.wait')
                    .replace('{years}', String(wait.years))
                    .replace('{months}', String(wait.months))}
              </li>
            )}
            {rules.map((rule, index) => {
              const focus = canWhatIf ? focusForRule(rule.id) : undefined;
              return (
                <li
                  key={rule.id}
                  className={
                    index >= visibleRules && !expanded
                      ? styles.gapCollapsed
                      : undefined
                  }
                >
                  <strong>
                    {rule.title}
                    {rule.status === 'UNKNOWN' && (
                      <>
                        {p.openParen}
                        {t(
                          rule.pendingDetails?.length
                            ? 'gap.pending'
                            : 'gap.input',
                        )}
                        {p.closeParen}
                      </>
                    )}
                  </strong>
                  {p.colon}
                  {firstSentence(rule.explanation, locale)}
                  {focus && (
                    <Link
                      className={`${styles.gapAction} ${site.noPrint}`}
                      href={`/whatif?focus=${focus}`}
                      scroll={false}
                      onClick={() =>
                        rememberWhatIfTarget({
                          focus,
                          ruleId: rule.id,
                          assessment,
                        })
                      }
                      aria-label={`${t('gap.try')}${p.colon}${rule.title}`}
                    >
                      {t('gap.try')}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
          {rules.length > visibleRules && (
            <button
              type="button"
              className={`${site.secondary} ${site.noPrint}`}
              aria-expanded={expanded}
              aria-controls={id}
              onClick={() => setExpanded(!expanded)}
            >
              {t(expanded ? 'gap.less' : 'gap.more')}
            </button>
          )}
        </>
      )}
    </section>
  );
}
