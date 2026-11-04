'use client';

import type { SimulationResult } from '@uk-immigration/engine';
import { ROUTE_GROUPS } from '@uk-immigration/policy-data';
import { useTranslation } from '../i18n/locale';
import { routeGroupNames } from '../i18n/routes';
import { ruleSets } from '../lib/policy';
import { currentEpisode, type Draft } from '../lib/questionnaire';
import { sourceUrls } from '../lib/sources';
import { PolicyStatus } from './policy-status';
import site from '../app/site.module.css';
import styles from '../app/result/result.module.css';

function Advice() {
  const { t } = useTranslation();
  return (
    <section className={site.notice}>
      <h2>{t('result.advice')}</h2>
      <p>{t('result.adviceText')}</p>
      <p>
        <a href={sourceUrls['SRC-016']} target="_blank" rel="noreferrer">
          {t('result.adviceLink')}
        </a>
      </p>
    </section>
  );
}

export function ResultView({
  result,
  mock = false,
  draft,
}: {
  result: SimulationResult;
  mock?: boolean;
  draft?: Draft;
}) {
  const { t } = useTranslation();
  const episode = draft && currentEpisode(draft);
  const protection =
    episode &&
    ROUTE_GROUPS[episode.route].some((group) => group === 'PROTECTION');
  return (
    <>
      <PolicyStatus asOf={result.policyAsOf} />
      {mock && (
        <p className={`${site.notice} ${site.warning}`}>{t('result.mock')}</p>
      )}
      {result.shortCircuit && Object.keys(result.byRuleSet).length === 0 ? (
        <div className={site.narrow}>
          <h1>{t('result.shortCircuit')}</h1>
          <p className={site.lead}>{result.shortCircuit.message}</p>
          <Advice />
        </div>
      ) : (
        <>
          <h1>{t('result.title')}</h1>
          {result.shortCircuit && (
            <p className={`${site.notice} ${site.warning}`}>
              {result.shortCircuit.message}
            </p>
          )}
          <p className={site.lead}>{t('result.intro')}</p>
          <p className={`${site.notice} ${site.warning}`}>
            {t('policy.hypothesis')}
          </p>
          {protection && (
            <p className={`${site.notice} ${site.warning}`}>
              {t('result.protectionNotice')}
            </p>
          )}
          <AssessmentColumns result={result} />
          <Advice />
          <p className={`${site.muted} ${site.noPrint}`}>
            {t('home.disclaimer')}
          </p>
        </>
      )}
    </>
  );
}

export function AssessmentColumns({
  result,
  idPrefix = '',
}: {
  result: SimulationResult;
  idPrefix?: string;
}) {
  const { t, locale } = useTranslation();
  return (
    <div className={styles.columns}>
      {ruleSets.map((ruleSet) => {
        const assessment = result.byRuleSet[ruleSet.id];
        return (
          <section
            key={ruleSet.id}
            className={`${styles.assessment} ${ruleSet.kind === 'ANNOUNCED' ? styles.announced : ''}`}
            aria-labelledby={`${idPrefix}${ruleSet.id}-heading`}
          >
            <h2
              id={`${idPrefix}${ruleSet.id}-heading`}
              className={styles.heading}
            >
              {t(`policy.${ruleSet.kind}`)}
            </h2>
            <span
              className={`${site.badge} ${ruleSet.kind === 'ANNOUNCED' ? site.announced : ''}`}
            >
              {t(`policy.${ruleSet.status}`)}
            </span>
            {!assessment ? (
              <p className={site.notice}>{t('result.missingAssessment')}</p>
            ) : (
              <>
                <div
                  className={`${styles.outcome} ${assessment.outcome === 'LIKELY_ELIGIBLE' ? styles.success : assessment.outcome === 'LIKELY_NOT_ELIGIBLE' ? styles.failure : styles.unknown}`}
                >
                  <h3>{t(`outcome.${assessment.outcome}`)}</h3>
                  <p>{t(`outcome.${assessment.outcome}.description`)}</p>
                </div>
                <dl className={styles.facts}>
                  {assessment.routeGroup && (
                    <div>
                      <dt>{t('result.routeGroup')}</dt>
                      <dd>{routeGroupNames[assessment.routeGroup][locale]}</dd>
                    </div>
                  )}
                  <div>
                    <dt>{t('result.pathway')}</dt>
                    <dd>
                      {assessment.pathwayYears === undefined
                        ? t('result.undetermined')
                        : `${assessment.pathwayYears} ${t('result.years')}`}
                    </dd>
                  </div>
                  <div>
                    <dt>{t('result.earliest')}</dt>
                    <dd>
                      {assessment.earliestDate ? (
                        <time dateTime={assessment.earliestDate}>
                          {assessment.earliestDate}
                        </time>
                      ) : (
                        t('result.undetermined')
                      )}
                    </dd>
                  </div>
                </dl>
                <h3>{t('result.why')}</h3>
                {!assessment.rules.length ? (
                  <p className={site.muted}>{t('result.noRules')}</p>
                ) : (
                  (['FAIL', 'UNKNOWN', 'PASS'] as const).map((status) => {
                    const rules = assessment.rules.filter(
                      (rule) => rule.status === status,
                    );
                    return (
                      <section key={status} className={styles.group}>
                        <h4>
                          {t(`result.${status}`)}（{rules.length}）
                        </h4>
                        {!rules.length ? (
                          <p className={site.muted}>
                            {t('result.noGroupRules')}
                          </p>
                        ) : (
                          <ul className={styles.rules}>
                            {rules.map((rule) => (
                              <li
                                className={styles.rule}
                                key={rule.id}
                                data-status={status}
                              >
                                <strong>{rule.title}</strong>
                                <p>{rule.explanation}</p>
                                <div
                                  className={styles.sources}
                                  aria-label={t('result.sources')}
                                >
                                  {rule.sources.map((source, index) =>
                                    sourceUrls[source.srcId] ? (
                                      <a
                                        key={index}
                                        href={sourceUrls[source.srcId]}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        {source.srcId} {source.locator}
                                      </a>
                                    ) : (
                                      <span key={index}>
                                        {source.srcId} {source.locator}
                                      </span>
                                    ),
                                  )}
                                </div>
                                {!!rule.pendingDetails?.length && (
                                  <p className={site.badge}>
                                    {t('result.pendingDetails')}：
                                    {rule.pendingDetails.join('、')}
                                  </p>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </section>
                    );
                  })
                )}
                {assessment.assumptions.length ? (
                  <details>
                    <summary>
                      {t('result.assumptions')}（{assessment.assumptions.length}{' '}
                      {t('result.assumptionCount')}）
                    </summary>
                    <ul className={styles.assumptions}>
                      {assessment.assumptions.map((assumption, i) => (
                        <li key={i}>{assumption}</li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <>
                    <h3>{t('result.assumptions')}</h3>
                    <p className={site.muted}>{t('result.noAssumptions')}</p>
                  </>
                )}
              </>
            )}
          </section>
        );
      })}
    </div>
  );
}

export function PrincipalAssessment({ result }: { result: SimulationResult }) {
  const { t } = useTranslation();
  return (
    <details className={styles.principal}>
      <summary>{t('result.principal')}</summary>
      {result.shortCircuit && (
        <p className={site.notice}>{result.shortCircuit.message}</p>
      )}
      {!!Object.keys(result.byRuleSet).length && (
        <AssessmentColumns result={result} idPrefix="principal-" />
      )}
    </details>
  );
}
