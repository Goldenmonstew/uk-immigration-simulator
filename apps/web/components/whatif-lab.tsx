'use client';

import Link from 'next/link';
import { useState } from 'react';
import type {
  SettlementAssessment,
  SimulationResult,
} from '@uk-immigration/engine';
import {
  type CefrLevel,
  earnedSettlement2026_11,
} from '@uk-immigration/policy-data';
import { useTranslation } from '../i18n/locale';
import { ruleSets } from '../lib/policy';
import {
  type Draft,
  runSimulation,
  validateStep,
  visibleIncomeYears,
} from '../lib/questionnaire';
import {
  applyWhatIf,
  diffAssessment,
  initialWhatIf,
  type WhatIf,
} from '../lib/whatif';
import { PolicyStatus } from './policy-status';
import { ShareLink } from './share-link';
import site from '../app/site.module.css';
import resultStyles from '../app/result/result.module.css';
import styles from '../app/whatif/whatif.module.css';

const incomePresets = [
  earnedSettlement2026_11.values.earningsThresholdMinimum.value,
  earnedSettlement2026_11.values.earningsThreshold5Year.value,
  earnedSettlement2026_11.values.earningsThreshold3Year.value,
];
const maxIncome =
  earnedSettlement2026_11.values.earningsThreshold3Year.value * 2;
const money = (amount: number) => `£${amount.toLocaleString('en-GB')}`;

function Comparison({
  before,
  after,
}: {
  before: SettlementAssessment;
  after: SettlementAssessment;
}) {
  const { t } = useTranslation();
  const diff = diffAssessment(before, after);
  const years = (assessment: SettlementAssessment) =>
    assessment.pathwayYears === undefined
      ? t('result.undetermined')
      : `${assessment.pathwayYears} ${t('result.years')}`;
  return (
    <>
      <p className={styles.direction}>
        {t('whatif.before')} → {t('whatif.after')}
      </p>
      <dl className={resultStyles.facts}>
        {[
          [
            t('whatif.outcome'),
            t(`outcome.${before.outcome}`),
            t(`outcome.${after.outcome}`),
          ],
          [t('result.pathway'), years(before), years(after)],
          [
            t('result.earliest'),
            before.earliestDate ?? t('result.undetermined'),
            after.earliestDate ?? t('result.undetermined'),
          ],
        ].map(([label, previous, next]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd className={styles.change}>
              <span className={site.muted}>{previous}</span>
              <span aria-hidden="true">→</span>
              <span>{next}</span>
            </dd>
          </div>
        ))}
      </dl>
      {!diff.changed && <p className={site.notice}>{t('whatif.unchanged')}</p>}
      {(['becameMet', 'becameUnmet', 'stillUnmet'] as const).map((group) => (
        <section
          key={group}
          className={resultStyles.group}
          aria-label={t(`whatif.${group}`)}
        >
          <h3>
            {t(`whatif.${group}`)}（{diff[group].length}）
          </h3>
          {!diff[group].length ? (
            <p className={site.muted}>{t('result.noGroupRules')}</p>
          ) : (
            <ul className={resultStyles.rules}>
              {diff[group].map((rule) => (
                <li
                  key={rule.id}
                  className={resultStyles.rule}
                  data-status={rule.status}
                >
                  <strong>{rule.title}</strong>
                  <div className={styles.ruleMeta}>
                    {rule.id} · {t(`result.${rule.status}`)}
                  </div>
                  <p>{rule.explanation}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
      {after.assumptions.length ? (
        <details>
          <summary>
            {t('result.assumptions')}（{after.assumptions.length}{' '}
            {t('result.assumptionCount')}）
          </summary>
          <ul className={resultStyles.assumptions}>
            {after.assumptions.map((assumption, index) => (
              <li key={index}>{assumption}</li>
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
  );
}

function WhatIfLab({
  draft,
  before,
}: {
  draft: Draft;
  before: SimulationResult;
}) {
  const { t } = useTranslation();
  const [whatIf, setWhatIf] = useState(() => initialWhatIf(draft));
  const update = (patch: Partial<WhatIf>) =>
    setWhatIf((current) => ({ ...current, ...patch }));
  const afterDraft = applyWhatIf(draft, whatIf);
  const dateError = validateStep({ ...afterDraft, step: 8 }).simulationDate;
  const incomeError =
    whatIf.incomeEnabled &&
    (whatIf.earnings === undefined ||
      !Number.isFinite(whatIf.earnings) ||
      whatIf.earnings < 0);
  const after =
    dateError || incomeError ? undefined : runSimulation(afterDraft);
  return (
    <>
      <p className={site.lead}>{t('whatif.intro')}</p>
      {after && <ShareLink draft={afterDraft} />}
      <p className={`${site.notice} ${site.warning}`}>
        {t('policy.hypothesis')}
      </p>
      <div className={styles.layout}>
        <section className={styles.controls} aria-labelledby="whatif-controls">
          <h2 id="whatif-controls">{t('whatif.controls')}</h2>
          <div className={styles.field}>
            <label htmlFor="whatif-date">{t('whatif.date')}</label>
            <input
              id="whatif-date"
              type="date"
              value={whatIf.simulationDate}
              aria-invalid={!!dateError}
              aria-describedby={dateError ? 'whatif-date-error' : undefined}
              onChange={(event) =>
                update({ simulationDate: event.target.value })
              }
            />
            {dateError && (
              <p id="whatif-date-error" role="alert" className={styles.error}>
                {t(dateError)}
              </p>
            )}
          </div>
          <fieldset className={styles.income}>
            <legend>{t('whatif.income')}</legend>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={whatIf.incomeEnabled}
                onChange={(event) =>
                  update({ incomeEnabled: event.target.checked })
                }
              />
              {t('whatif.enableIncome')}
            </label>
            <p className={styles.hint}>{t('whatif.incomeHint')}</p>
            <div className={styles.field}>
              <label htmlFor="whatif-years">{t('whatif.incomeYears')}</label>
              <select
                id="whatif-years"
                disabled={!whatIf.incomeEnabled}
                value={whatIf.incomeYears}
                onChange={(event) =>
                  update({ incomeYears: Number(event.target.value) })
                }
              >
                {Array.from({ length: 7 }, (_, i) => i + 1).map((years) => (
                  <option key={years} value={years}>
                    {years}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="whatif-earnings">{t('whatif.earnings')}</label>
              <input
                id="whatif-earnings"
                type="number"
                min="0"
                step="any"
                disabled={!whatIf.incomeEnabled}
                value={whatIf.earnings ?? ''}
                aria-invalid={!!incomeError}
                aria-describedby={
                  incomeError ? 'whatif-income-error' : undefined
                }
                onChange={(event) =>
                  update({
                    earnings:
                      event.target.value === ''
                        ? undefined
                        : event.target.valueAsNumber,
                  })
                }
              />
              <input
                type="range"
                min="0"
                max={maxIncome}
                step="500"
                disabled={!whatIf.incomeEnabled}
                aria-label={t('whatif.incomeSlider')}
                value={whatIf.earnings ?? 0}
                onChange={(event) =>
                  update({ earnings: event.target.valueAsNumber })
                }
              />
              {incomeError && (
                <p
                  id="whatif-income-error"
                  role="alert"
                  className={styles.error}
                >
                  {t('error.number')}
                </p>
              )}
            </div>
            <div className={styles.presets}>
              {incomePresets.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  className={site.secondary}
                  onClick={() =>
                    update({ incomeEnabled: true, earnings: amount })
                  }
                >
                  {money(amount)}
                </button>
              ))}
            </div>
            <p className={styles.hint}>
              {t('date.incomeWindow')}：
              {visibleIncomeYears(afterDraft)
                .map((row) => row.taxYear)
                .join('、')}
            </p>
          </fieldset>
          <div className={styles.field}>
            <label htmlFor="whatif-english">{t('english.level')}</label>
            <select
              id="whatif-english"
              value={
                whatIf.english
                  ? 'exempt' in whatIf.english
                    ? 'exempt'
                    : whatIf.english.cefrLevel
                  : ''
              }
              onChange={(event) =>
                update({
                  english:
                    event.target.value === ''
                      ? undefined
                      : event.target.value === 'exempt'
                        ? { exempt: true }
                        : { cefrLevel: event.target.value as CefrLevel },
                })
              }
            >
              <option value="">{t('form.unknown')}</option>
              {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
              <option value="exempt">{t('english.exempt')}</option>
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="whatif-life">{t('english.life')}</label>
            <select
              id="whatif-life"
              value={
                whatIf.lifeInTheUk
                  ? 'passed' in whatIf.lifeInTheUk
                    ? 'passed'
                    : 'exempt'
                  : ''
              }
              onChange={(event) =>
                update({
                  lifeInTheUk:
                    event.target.value === ''
                      ? undefined
                      : event.target.value === 'passed'
                        ? { passed: true }
                        : { exempt: true },
                })
              }
            >
              <option value="">{t('form.unknown')}</option>
              <option value="passed">{t('english.passed')}</option>
              <option value="exempt">{t('english.exempt')}</option>
            </select>
          </div>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={whatIf.noPublicFunds}
              onChange={(event) =>
                update({ noPublicFunds: event.target.checked })
              }
            />
            {t('whatif.noPublicFunds')}
          </label>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={whatIf.noAbsences}
              onChange={(event) => update({ noAbsences: event.target.checked })}
            />
            {t('whatif.noAbsences')}
          </label>
          <div className={site.actions}>
            <button
              type="button"
              className={site.secondary}
              onClick={() => setWhatIf(initialWhatIf(draft))}
            >
              {t('whatif.reset')}
            </button>
            <Link href="/result">{t('whatif.back')}</Link>
          </div>
        </section>
        <div className={styles.comparisons} aria-live="polite">
          {!after ? (
            <p role="status">{t('form.fixErrors')}</p>
          ) : (
            ruleSets.map((ruleSet) => {
              const previous = before.byRuleSet[ruleSet.id];
              const next = after.byRuleSet[ruleSet.id];
              return (
                <section
                  key={ruleSet.id}
                  aria-labelledby={`${ruleSet.id}-heading`}
                  className={`${resultStyles.assessment} ${ruleSet.kind === 'ANNOUNCED' ? resultStyles.announced : ''}`}
                >
                  <h2 id={`${ruleSet.id}-heading`}>
                    {t(`policy.${ruleSet.kind}`)}
                  </h2>
                  <span
                    className={`${site.badge} ${ruleSet.kind === 'ANNOUNCED' ? site.announced : ''}`}
                  >
                    {t(`policy.${ruleSet.status}`)}
                  </span>
                  {previous && next ? (
                    <Comparison before={previous} after={next} />
                  ) : (
                    <p>{t('result.missingAssessment')}</p>
                  )}
                </section>
              );
            })
          )}
        </div>
      </div>
      <p className={`${site.notice} ${site.muted}`}>{t('home.disclaimer')}</p>
    </>
  );
}

export function WhatIfView({ draft }: { draft?: Draft }) {
  const { t } = useTranslation();
  if (!draft?.completed)
    return (
      <div className={site.narrow}>
        <h1>{t('whatif.title')}</h1>
        <p>{t('whatif.empty')}</p>
        <Link className={site.button} href="/simulate">
          {t('home.start')}
        </Link>
      </div>
    );
  const before = runSimulation(draft);
  return (
    <>
      <PolicyStatus asOf={before.policyAsOf} />
      <h1>{t('whatif.title')}</h1>
      {before.shortCircuit ? (
        <div className={site.narrow}>
          <p className={site.notice}>{t('whatif.unsupported')}</p>
          <p>{before.shortCircuit.message}</p>
          <ShareLink draft={draft} />
          <Link className={site.secondary} href="/result">
            {t('whatif.back')}
          </Link>
        </div>
      ) : (
        <WhatIfLab draft={draft} before={before} />
      )}
    </>
  );
}
