'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useReducer, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import {
  asylumSupportRepaymentNames,
  breachTypeNames,
  publicFundsBenefits,
  resettlementSchemeNames,
  ROUTE_GROUPS,
  sustainedActivityNames,
} from '@uk-immigration/policy-data';
import type {
  CefrLevel,
  ImmigrationBreach,
  ImmigrationEpisode,
  PersonTimeline,
  Relationship,
  Route,
} from '@uk-immigration/engine';
import type { TranslationKey } from '../../i18n';
import { useTranslation } from '../../i18n/locale';
import { routeNames } from '../../i18n/routes';
import {
  activePersonDraft,
  createDraft,
  needsPrincipal,
  stepSequence,
  draftReducer,
  runSimulation,
  screeningKeys,
  shortCircuitKeys,
  steps,
  validateStep,
  visibleIncomeYears,
} from '../../lib/questionnaire';
import type { Draft, Errors, ScreeningKey } from '../../lib/questionnaire';
import { draftStorage, rememberResult } from '../../lib/storage';
import site from '../site.module.css';
import styles from './form.module.css';

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: TranslationKey;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <div className={`${styles.field} ${error ? styles.invalid : ''}`}>
      <label htmlFor={id}>{label}</label>
      {hint && (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className={styles.error}>
          {t(error)}
        </p>
      )}
      {children}
    </div>
  );
}

export default function SimulatePage() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [draft, dispatch] = useReducer(draftReducer, undefined, createDraft);
  const [ready, setReady] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const heading = useRef<HTMLHeadingElement>(null);
  const active = activePersonDraft(draft);
  const { timeline } = active;
  const editingPrincipal = draft.principalStep !== undefined;
  const sequence = stepSequence(draft);
  const position = sequence.indexOf(active.step);

  useEffect(() => {
    const stored = draftStorage();
    if (stored.draft)
      dispatch({
        type: 'restore',
        draft: stored.draft,
      });
    setStorageAvailable(stored.available);
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) setStorageAvailable(draftStorage(draft).available);
  }, [draft, ready]);

  useEffect(() => {
    if (ready) heading.current?.focus();
  }, [draft.step, draft.principalStep, ready]);

  const update = (patch: Partial<PersonTimeline>) =>
    dispatch({ type: 'timeline', patch });
  const fieldProps = (id: string, hasHint = false) => ({
    id,
    'aria-invalid': errors[id] ? (true as const) : undefined,
    'aria-describedby':
      [hasHint ? `${id}-hint` : '', errors[id] ? `${id}-error` : '']
        .filter(Boolean)
        .join(' ') || undefined,
  });
  const amount = (value: string) => (value === '' ? undefined : Number(value));
  const goTo = (step: number) => {
    setErrors({});
    dispatch({ type: 'step', step });
  };
  const finish = (value: Draft) => {
    const completed = { ...value, completed: true };
    const result = runSimulation(completed, locale);
    setStorageAvailable(draftStorage(completed).available);
    rememberResult(result, locale);
    dispatch({ type: 'restore', draft: completed });
    router.push('/result');
  };
  const screen = (key: ScreeningKey, answer: 'yes' | 'no') => {
    if (answer === 'yes' && key === 'criminality') {
      finish(draftReducer(draft, { type: 'screening', key, answer }));
    } else dispatch({ type: 'screening', key, answer });
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (
      active.step === 1 &&
      shortCircuitKeys.some((key) => active.screening[key] === 'yes')
    ) {
      finish(draft);
      return;
    }
    const nextErrors = validateStep(active);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() =>
        document.getElementById(Object.keys(nextErrors)[0])?.focus(),
      );
      return;
    }
    if (position === sequence.length - 1) {
      if (editingPrincipal)
        dispatch({ type: 'principal-return', completed: true });
      else if (needsPrincipal(draft) && !draft.principalCompleted) goTo(9);
      else finish(draft);
    } else goTo(sequence[position + 1]);
  };
  const updateEpisode = (index: number, patch: Partial<ImmigrationEpisode>) =>
    update({
      episodes: timeline.episodes.map((episode, i) =>
        i === index ? { ...episode, ...patch } : episode,
      ),
    });
  const updateBreach = (index: number, patch: Partial<ImmigrationBreach>) =>
    update({
      immigrationBreaches: timeline.immigrationBreaches.map((breach, i) =>
        i === index ? { ...breach, ...patch } : breach,
      ),
    });
  const dateField = (
    id: string,
    label: string,
    value: string,
    onChange: (value: string) => void,
    required = false,
  ) => (
    <Field id={id} label={label} error={errors[id]}>
      <input
        {...fieldProps(id)}
        type="date"
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </Field>
  );
  const remove = (label: string, onClick: () => void) => (
    <button
      type="button"
      className={styles.remove}
      aria-label={`${t('form.remove')} ${label}`}
      onClick={onClick}
    >
      {t('form.remove')} {label}
    </button>
  );

  return (
    <main id="main" className={site.main}>
      <div className={site.narrow}>
        {!ready ? (
          <p role="status">{t('result.loading')}</p>
        ) : (
          <>
            {editingPrincipal && (
              <aside className={site.notice} aria-label={t('principal.banner')}>
                <strong>{t('principal.banner')}</strong>
                <p>
                  {t('principal.sharedDate')}{' '}
                  <time>{draft.simulationDate}</time>
                </p>
                <button
                  type="button"
                  className={site.secondary}
                  onClick={() => {
                    setErrors({});
                    dispatch({ type: 'principal-return' });
                  }}
                >
                  {t('principal.return')}
                </button>
              </aside>
            )}
            <p className={styles.progress}>
              {t('form.step')} {position + 1} {t('form.of')} {sequence.length} —{' '}
              {t('form.title')}
            </p>
            <h1 ref={heading} tabIndex={-1}>
              {t(`step.${steps[active.step]}`)}
            </h1>
            <p
              className={
                storageAvailable
                  ? styles.saved
                  : `${site.notice} ${site.warning}`
              }
              role="status"
            >
              {t(storageAvailable ? 'form.saved' : 'form.storageUnavailable')}
            </p>
            <form onSubmit={submit} noValidate autoComplete="off">
              {Object.keys(errors).length > 0 && (
                <div role="alert" className={styles.errorSummary}>
                  <p>{t('form.fixErrors')}</p>
                </div>
              )}

              {active.step === 0 && (
                <>
                  {dateField(
                    'dob',
                    t('basic.dob'),
                    timeline.dateOfBirth,
                    (dateOfBirth) => update({ dateOfBirth }),
                  )}
                  <Field
                    id="nationality"
                    label={t('basic.nationality')}
                    hint={t('basic.nationalityHint')}
                    error={errors.nationality}
                  >
                    <input
                      {...fieldProps('nationality', true)}
                      value={timeline.nationality}
                      list="nationalities"
                      maxLength={3}
                      autoCapitalize="characters"
                      spellCheck={false}
                      onChange={(event) =>
                        update({
                          nationality: event.target.value.toUpperCase().trim(),
                        })
                      }
                    />
                    <datalist id="nationalities">
                      {(
                        [
                          'CHN',
                          'HKG',
                          'IND',
                          'PAK',
                          'NGA',
                          'USA',
                          'GBR',
                          'CAN',
                          'AUS',
                          'SGP',
                        ] as const
                      ).map((code) => (
                        <option key={code} value={code}>
                          {t(`country.${code}`)}
                        </option>
                      ))}
                    </datalist>
                  </Field>
                  {editingPrincipal && (
                    <>
                      <Field
                        id="principal-settled"
                        label={t('principal.settled')}
                      >
                        <select
                          id="principal-settled"
                          value={timeline.settled ? 'yes' : 'no'}
                          onChange={(event) =>
                            update({
                              settled:
                                event.target.value === 'yes'
                                  ? { date: '', route: 'SKILLED_WORKER' }
                                  : undefined,
                            })
                          }
                        >
                          <option value="no">{t('form.no')}</option>
                          <option value="yes">{t('form.yes')}</option>
                        </select>
                      </Field>
                      {timeline.settled && (
                        <>
                          {dateField(
                            'principal-settled-date',
                            t('principal.settledDate'),
                            timeline.settled.date,
                            (date) =>
                              update({
                                settled: { ...timeline.settled!, date },
                              }),
                          )}
                          <Field
                            id="principal-settled-route"
                            label={t('principal.settledRoute')}
                          >
                            <select
                              id="principal-settled-route"
                              value={timeline.settled.route}
                              onChange={(event) =>
                                update({
                                  settled: {
                                    ...timeline.settled!,
                                    route: event.target.value as Route,
                                  },
                                })
                              }
                            >
                              {Object.entries(routeNames).map(
                                ([route, name]) => (
                                  <option key={route} value={route}>
                                    {name[locale]}
                                  </option>
                                ),
                              )}
                            </select>
                          </Field>
                        </>
                      )}
                    </>
                  )}
                </>
              )}

              {active.step === 1 && (
                <>
                  <p>{t('screening.hint')}</p>
                  {screeningKeys.map((key) => (
                    <fieldset
                      key={key}
                      className={`${styles.fieldset} ${errors[key] ? styles.invalid : ''}`}
                      aria-describedby={`${key}-hint ${errors[key] ? `${key}-error` : ''}`}
                    >
                      <legend className={styles.legend}>
                        {t(`screening.${key}`)}
                      </legend>
                      <p id={`${key}-hint`} className={styles.hint}>
                        {key === 'breach' ? t('screening.breachHint') : null}
                      </p>
                      {errors[key] && (
                        <p id={`${key}-error`} className={styles.error}>
                          {t(errors[key])}
                        </p>
                      )}
                      <div className={styles.radios}>
                        {(['yes', 'no'] as const).map((answer, index) => (
                          <label key={answer}>
                            <input
                              id={index === 0 ? key : `${key}-no`}
                              type="radio"
                              name={key}
                              value={answer}
                              checked={active.screening[key] === answer}
                              aria-invalid={errors[key] ? true : undefined}
                              onChange={() => screen(key, answer)}
                            />
                            {t(`form.${answer}`)}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  ))}
                  {active.screening.breach === 'yes' && (
                    <section aria-labelledby="breaches-heading">
                      <h2 id="breaches-heading">{t('breaches.title')}</h2>
                      {timeline.immigrationBreaches.map((breach, index) => (
                        <fieldset key={index} className={styles.entry}>
                          <legend>
                            {t('breaches.item')} {index + 1}
                          </legend>
                          <Field
                            id={`breach-${index}-type`}
                            label={t('breaches.type')}
                          >
                            <select
                              id={`breach-${index}-type`}
                              value={breach.type}
                              onChange={(event) =>
                                updateBreach(index, {
                                  type: event.target
                                    .value as ImmigrationBreach['type'],
                                  article31: undefined,
                                })
                              }
                            >
                              {Object.entries(breachTypeNames).map(
                                ([type, name]) => (
                                  <option key={type} value={type}>
                                    {name[locale]}
                                  </option>
                                ),
                              )}
                            </select>
                          </Field>
                          {dateField(
                            `breach-${index}-date`,
                            t('breaches.date'),
                            breach.date,
                            (date) => updateBreach(index, { date }),
                            true,
                          )}
                          {breach.type === 'ILLEGAL_ENTRY' && (
                            <Field
                              id={`breach-${index}-article31`}
                              label={t('breaches.article31')}
                            >
                              <select
                                id={`breach-${index}-article31`}
                                value={
                                  breach.article31 === undefined
                                    ? ''
                                    : breach.article31
                                      ? 'yes'
                                      : 'no'
                                }
                                onChange={(event) =>
                                  updateBreach(index, {
                                    article31:
                                      event.target.value === ''
                                        ? undefined
                                        : event.target.value === 'yes',
                                  })
                                }
                              >
                                <option value="">{t('form.unknown')}</option>
                                <option value="yes">{t('form.yes')}</option>
                                <option value="no">{t('form.no')}</option>
                              </select>
                            </Field>
                          )}
                          {remove(`${t('breaches.item')} ${index + 1}`, () =>
                            update({
                              immigrationBreaches:
                                timeline.immigrationBreaches.filter(
                                  (_, i) => i !== index,
                                ),
                            }),
                          )}
                        </fieldset>
                      ))}
                      {errors.breaches && (
                        <p id="breaches-error" className={styles.error}>
                          {t(errors.breaches)}
                        </p>
                      )}
                      <button
                        {...fieldProps('breaches')}
                        type="button"
                        className={site.secondary}
                        onClick={() =>
                          update({
                            immigrationBreaches: [
                              ...timeline.immigrationBreaches,
                              { type: 'OVERSTAYING', date: '' },
                            ],
                          })
                        }
                      >
                        {t('breaches.add')}
                      </button>
                    </section>
                  )}
                </>
              )}

              {active.step === 2 && (
                <>
                  <p>{t('episodes.hint')}</p>
                  {!timeline.episodes.length && (
                    <p className={site.muted}>{t('episodes.empty')}</p>
                  )}
                  {timeline.episodes.map((episode, index) => {
                    const prefix = `episode-${index}`;
                    return (
                      <fieldset key={index} className={styles.entry}>
                        <legend>
                          {t('episodes.item')} {index + 1}
                        </legend>
                        <Field
                          id={`${prefix}-route`}
                          label={t('episodes.route')}
                        >
                          <select
                            id={`${prefix}-route`}
                            value={episode.route}
                            onChange={(event) =>
                              updateEpisode(index, {
                                route: event.target.value as Route,
                                socCode: undefined,
                                salary: undefined,
                                immigrationSalaryList: undefined,
                                resettlementScheme: undefined,
                                sustainedActivity: undefined,
                              })
                            }
                          >
                            {Object.entries(routeNames).map(([route, name]) => (
                              <option key={route} value={route}>
                                {name[locale]}
                              </option>
                            ))}
                          </select>
                        </Field>
                        {dateField(
                          `${prefix}-from`,
                          t('episodes.from'),
                          episode.validFrom,
                          (validFrom) => updateEpisode(index, { validFrom }),
                        )}
                        {dateField(
                          `${prefix}-to`,
                          t('episodes.to'),
                          episode.validTo,
                          (validTo) => updateEpisode(index, { validTo }),
                        )}
                        <Field id={`${prefix}-role`} label={t('episodes.role')}>
                          <select
                            id={`${prefix}-role`}
                            value={episode.role}
                            onChange={(event) =>
                              updateEpisode(index, {
                                role: event.target
                                  .value as ImmigrationEpisode['role'],
                                dependantOf: undefined,
                                immigrationSalaryList: undefined,
                              })
                            }
                          >
                            <option value="MAIN">{t('episodes.MAIN')}</option>
                            <option value="DEPENDANT">
                              {t('episodes.DEPENDANT')}
                            </option>
                          </select>
                        </Field>
                        {episode.role === 'DEPENDANT' && (
                          <Field
                            id={`${prefix}-dependantOf`}
                            label={t('episodes.dependantOf')}
                            error={errors[`${prefix}-dependantOf`]}
                          >
                            <select
                              {...fieldProps(`${prefix}-dependantOf`)}
                              required
                              value={episode.dependantOf ?? ''}
                              onChange={(event) =>
                                updateEpisode(index, {
                                  dependantOf: (event.target.value ||
                                    undefined) as ImmigrationEpisode['dependantOf'],
                                })
                              }
                            >
                              <option value="">{t('form.choose')}</option>
                              <option value="PARTNER">
                                {t('episodes.partnerDependant')}
                              </option>
                              <option value="PARENT">
                                {t('episodes.childDependant')}
                              </option>
                            </select>
                          </Field>
                        )}
                        {episode.route === 'SAFE_AND_LEGAL' && (
                          <Field
                            id={`${prefix}-resettlement`}
                            label={t('episodes.resettlementScheme')}
                          >
                            <select
                              id={`${prefix}-resettlement`}
                              value={episode.resettlementScheme ?? ''}
                              onChange={(event) =>
                                updateEpisode(index, {
                                  resettlementScheme: (event.target.value ||
                                    undefined) as ImmigrationEpisode['resettlementScheme'],
                                })
                              }
                            >
                              <option value="">{t('form.unknown')}</option>
                              {Object.entries(resettlementSchemeNames).map(
                                ([value, name]) => (
                                  <option key={value} value={value}>
                                    {name[locale]}
                                  </option>
                                ),
                              )}
                            </select>
                          </Field>
                        )}
                        {episode.route === 'PROTECTION_WORK_AND_STUDY' && (
                          <Field
                            id={`${prefix}-activity`}
                            label={t('episodes.sustainedActivity')}
                          >
                            <select
                              id={`${prefix}-activity`}
                              value={episode.sustainedActivity ?? ''}
                              onChange={(event) =>
                                updateEpisode(index, {
                                  sustainedActivity: (event.target.value ||
                                    undefined) as ImmigrationEpisode['sustainedActivity'],
                                })
                              }
                            >
                              <option value="">{t('form.unknown')}</option>
                              {Object.entries(sustainedActivityNames).map(
                                ([value, name]) => (
                                  <option key={value} value={value}>
                                    {name[locale]}
                                  </option>
                                ),
                              )}
                            </select>
                          </Field>
                        )}
                        {episode.route === 'SKILLED_WORKER' && (
                          <>
                            <Field
                              id={`${prefix}-soc`}
                              label={t('episodes.soc')}
                              error={errors[`${prefix}-soc`]}
                            >
                              <input
                                {...fieldProps(`${prefix}-soc`)}
                                inputMode="numeric"
                                maxLength={4}
                                value={episode.socCode ?? ''}
                                onChange={(event) =>
                                  updateEpisode(index, {
                                    socCode: event.target.value || undefined,
                                  })
                                }
                              />
                            </Field>
                            <Field
                              id={`${prefix}-salary`}
                              label={t('episodes.salary')}
                              error={errors[`${prefix}-salary`]}
                            >
                              <input
                                {...fieldProps(`${prefix}-salary`)}
                                type="number"
                                inputMode="decimal"
                                min="0"
                                step="any"
                                value={episode.salary ?? ''}
                                onChange={(event) =>
                                  updateEpisode(index, {
                                    salary: amount(event.target.value),
                                  })
                                }
                              />
                            </Field>
                            {episode.role === 'MAIN' && (
                              <Field
                                id={`${prefix}-isl`}
                                label={t('episodes.immigrationSalaryList')}
                                hint={t('episodes.immigrationSalaryListHint')}
                              >
                                <select
                                  {...fieldProps(`${prefix}-isl`, true)}
                                  value={
                                    episode.immigrationSalaryList === undefined
                                      ? ''
                                      : episode.immigrationSalaryList
                                        ? 'yes'
                                        : 'no'
                                  }
                                  onChange={(event) =>
                                    updateEpisode(index, {
                                      immigrationSalaryList:
                                        event.target.value === ''
                                          ? undefined
                                          : event.target.value === 'yes',
                                    })
                                  }
                                >
                                  <option value="">{t('form.unknown')}</option>
                                  <option value="yes">{t('form.yes')}</option>
                                  <option value="no">{t('form.no')}</option>
                                </select>
                              </Field>
                            )}
                          </>
                        )}
                        {remove(`${t('episodes.item')} ${index + 1}`, () =>
                          update({
                            episodes: timeline.episodes.filter(
                              (_, i) => i !== index,
                            ),
                          }),
                        )}
                      </fieldset>
                    );
                  })}
                  <button
                    type="button"
                    className={site.secondary}
                    onClick={() =>
                      update({
                        episodes: [
                          ...timeline.episodes,
                          {
                            route: 'SKILLED_WORKER',
                            role: 'MAIN',
                            validFrom: '',
                            validTo: '',
                          },
                        ],
                      })
                    }
                  >
                    {t('episodes.add')}
                  </button>
                </>
              )}

              {active.step === 9 && (
                <>
                  <p>{t('principal.hint')}</p>
                  <p>
                    {t(
                      draft.principalCompleted
                        ? 'principal.saved'
                        : 'principal.incomplete',
                    )}
                  </p>
                  <Field
                    id="principal"
                    label={t('step.principal')}
                    error={errors.principal}
                  >
                    <button
                      {...fieldProps('principal')}
                      type="button"
                      className={site.secondary}
                      onClick={() => {
                        setErrors({});
                        dispatch({ type: 'principal-start' });
                      }}
                    >
                      {t(
                        draft.principal ? 'principal.edit' : 'principal.start',
                      )}
                    </button>
                  </Field>
                </>
              )}

              {active.step === 3 && (
                <>
                  <p>{t('absences.hint')}</p>
                  {!timeline.absences.length && (
                    <p className={site.muted}>{t('absences.empty')}</p>
                  )}
                  {timeline.absences.map((absence, index) => (
                    <fieldset key={index} className={styles.entry}>
                      <legend>
                        {t('absences.item')} {index + 1}
                      </legend>
                      {dateField(
                        `absence-${index}-from`,
                        t('absences.from'),
                        absence.from,
                        (from) =>
                          update({
                            absences: timeline.absences.map((row, i) =>
                              i === index ? { ...row, from } : row,
                            ),
                          }),
                      )}
                      {dateField(
                        `absence-${index}-to`,
                        t('absences.to'),
                        absence.to,
                        (to) =>
                          update({
                            absences: timeline.absences.map((row, i) =>
                              i === index ? { ...row, to } : row,
                            ),
                          }),
                      )}
                      {remove(`${t('absences.item')} ${index + 1}`, () =>
                        update({
                          absences: timeline.absences.filter(
                            (_, i) => i !== index,
                          ),
                        }),
                      )}
                    </fieldset>
                  ))}
                  <button
                    type="button"
                    className={site.secondary}
                    onClick={() =>
                      update({
                        absences: [...timeline.absences, { from: '', to: '' }],
                      })
                    }
                  >
                    {t('absences.add')}
                  </button>
                </>
              )}

              {active.step === 4 && (
                <>
                  <p>{t('income.hint')}</p>
                  <p className={styles.hint}>{t('income.taxYearHint')}</p>
                  <p className={styles.hint}>{t('income.partnerHint')}</p>
                  {visibleIncomeYears(active).map((row) => (
                    <fieldset className={styles.incomeRow} key={row.taxYear}>
                      <legend>{row.taxYear}</legend>
                      <div className={styles.incomeFields}>
                        {(['earnings', 'partnerEarnings'] as const).map(
                          (key) => {
                            const suffix =
                              key === 'earnings' ? 'earnings' : 'partner';
                            const id = `${row.taxYear}-${suffix}`;
                            return (
                              <Field
                                key={key}
                                id={id}
                                label={t(`income.${suffix}`)}
                                error={errors[id]}
                              >
                                <input
                                  {...fieldProps(id)}
                                  type="number"
                                  inputMode="decimal"
                                  min="0"
                                  step="any"
                                  value={row[key] ?? ''}
                                  onChange={(event) =>
                                    update({
                                      incomeYears: timeline.incomeYears.map(
                                        (year) =>
                                          year.taxYear === row.taxYear
                                            ? {
                                                ...year,
                                                [key]: amount(
                                                  event.target.value,
                                                ),
                                              }
                                            : year,
                                      ),
                                    })
                                  }
                                />
                              </Field>
                            );
                          },
                        )}
                      </div>
                    </fieldset>
                  ))}
                </>
              )}

              {active.step === 5 && (
                <>
                  <p>{t('benefits.hint')}</p>
                  {!timeline.benefits.length && (
                    <p className={site.muted}>{t('benefits.empty')}</p>
                  )}
                  {timeline.benefits.map((benefit, index) => (
                    <fieldset key={index} className={styles.entry}>
                      <legend>
                        {t('benefits.item')} {index + 1}
                      </legend>
                      <Field
                        id={`benefit-${index}-type`}
                        label={t('benefits.type')}
                      >
                        <select
                          id={`benefit-${index}-type`}
                          value={benefit.benefitType}
                          onChange={(event) =>
                            update({
                              benefits: timeline.benefits.map((row, i) =>
                                i === index
                                  ? { ...row, benefitType: event.target.value }
                                  : row,
                              ),
                            })
                          }
                        >
                          {(['publicFunds', 'notPublicFunds'] as const).map(
                            (group) => (
                              <optgroup
                                key={group}
                                label={t(`benefits.${group}`)}
                              >
                                {publicFundsBenefits[group].map(
                                  ({ benefitType, name }) => (
                                    <option
                                      key={benefitType}
                                      value={benefitType}
                                    >
                                      {name}
                                    </option>
                                  ),
                                )}
                              </optgroup>
                            ),
                          )}
                        </select>
                      </Field>
                      {dateField(
                        `benefit-${index}-from`,
                        t('benefits.from'),
                        benefit.from,
                        (from) =>
                          update({
                            benefits: timeline.benefits.map((row, i) =>
                              i === index ? { ...row, from } : row,
                            ),
                          }),
                      )}
                      {dateField(
                        `benefit-${index}-to`,
                        t('benefits.to'),
                        benefit.to ?? '',
                        (to) =>
                          update({
                            benefits: timeline.benefits.map((row, i) =>
                              i === index
                                ? { ...row, to: to || undefined }
                                : row,
                            ),
                          }),
                      )}
                      {remove(`${t('benefits.item')} ${index + 1}`, () =>
                        update({
                          benefits: timeline.benefits.filter(
                            (_, i) => i !== index,
                          ),
                        }),
                      )}
                    </fieldset>
                  ))}
                  <button
                    type="button"
                    className={site.secondary}
                    onClick={() =>
                      update({
                        benefits: [
                          ...timeline.benefits,
                          { benefitType: 'UNIVERSAL_CREDIT', from: '' },
                        ],
                      })
                    }
                  >
                    {t('benefits.add')}
                  </button>
                  {timeline.episodes.some((episode) =>
                    ROUTE_GROUPS[episode.route].some(
                      (group) => group === 'PROTECTION',
                    ),
                  ) && (
                    <div className={styles.followUp}>
                      <Field
                        id="asylum-support"
                        label={t('benefits.asylumSupportRepayment')}
                      >
                        <select
                          id="asylum-support"
                          value={timeline.asylumSupportRepayment ?? ''}
                          onChange={(event) =>
                            update({
                              asylumSupportRepayment: (event.target.value ||
                                undefined) as PersonTimeline['asylumSupportRepayment'],
                            })
                          }
                        >
                          <option value="">{t('form.unknown')}</option>
                          {Object.entries(asylumSupportRepaymentNames).map(
                            ([value, name]) => (
                              <option key={value} value={value}>
                                {name[locale]}
                              </option>
                            ),
                          )}
                        </select>
                      </Field>
                    </div>
                  )}
                </>
              )}

              {active.step === 6 && (
                <>
                  <p>{t('relationships.hint')}</p>
                  {!timeline.relationships.length && (
                    <p className={site.muted}>{t('relationships.empty')}</p>
                  )}
                  {timeline.relationships.map((relationship, index) => (
                    <fieldset key={index} className={styles.entry}>
                      <legend>
                        {t('relationships.item')} {index + 1}
                      </legend>
                      <Field
                        id={`relationship-${index}-type`}
                        label={t('relationships.type')}
                      >
                        <select
                          id={`relationship-${index}-type`}
                          value={relationship.type}
                          onChange={(event) =>
                            update({
                              relationships: timeline.relationships.map(
                                (row, i) =>
                                  i === index
                                    ? {
                                        ...row,
                                        type: event.target
                                          .value as Relationship['type'],
                                      }
                                    : row,
                              ),
                            })
                          }
                        >
                          {(['PARTNER', 'PARENT', 'CHILD'] as const).map(
                            (value) => (
                              <option key={value} value={value}>
                                {t(`relationships.${value}`)}
                              </option>
                            ),
                          )}
                        </select>
                      </Field>
                      <Field
                        id={`relationship-${index}-status`}
                        label={t('relationships.status')}
                      >
                        <select
                          id={`relationship-${index}-status`}
                          value={relationship.otherPartyStatus}
                          onChange={(event) =>
                            update({
                              relationships: timeline.relationships.map(
                                (row, i) =>
                                  i === index
                                    ? {
                                        ...row,
                                        otherPartyStatus: event.target
                                          .value as Relationship['otherPartyStatus'],
                                      }
                                    : row,
                              ),
                            })
                          }
                        >
                          {(
                            ['BRITISH_CITIZEN', 'SETTLED', 'OTHER'] as const
                          ).map((value) => (
                            <option key={value} value={value}>
                              {t(`relationships.${value}`)}
                            </option>
                          ))}
                        </select>
                      </Field>
                      {remove(`${t('relationships.item')} ${index + 1}`, () =>
                        update({
                          relationships: timeline.relationships.filter(
                            (_, i) => i !== index,
                          ),
                        }),
                      )}
                    </fieldset>
                  ))}
                  <button
                    type="button"
                    className={site.secondary}
                    onClick={() =>
                      update({
                        relationships: [
                          ...timeline.relationships,
                          { type: 'PARTNER', otherPartyStatus: 'OTHER' },
                        ],
                      })
                    }
                  >
                    {t('relationships.add')}
                  </button>
                </>
              )}

              {active.step === 7 && (
                <>
                  <p>{t('english.hint')}</p>
                  <Field id="english" label={t('english.level')}>
                    <select
                      id="english"
                      value={
                        timeline.english
                          ? 'exempt' in timeline.english
                            ? 'exempt'
                            : timeline.english.cefrLevel
                          : ''
                      }
                      onChange={(event) =>
                        update({
                          english:
                            event.target.value === ''
                              ? undefined
                              : event.target.value === 'exempt'
                                ? { exempt: true }
                                : {
                                    cefrLevel: event.target.value as CefrLevel,
                                  },
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
                  </Field>
                  <Field id="life" label={t('english.life')}>
                    <select
                      id="life"
                      value={
                        timeline.lifeInTheUk
                          ? 'passed' in timeline.lifeInTheUk
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
                  </Field>
                </>
              )}

              {active.step === 8 && (
                <>
                  <p>{t('date.hint')}</p>
                  {dateField(
                    'simulationDate',
                    t('date.label'),
                    draft.simulationDate,
                    (date) => dispatch({ type: 'date', date }),
                  )}
                  <p>
                    {t('date.incomeWindow')}：
                    {visibleIncomeYears(active)
                      .map((row) => row.taxYear)
                      .join('、')}
                  </p>
                  <button
                    type="button"
                    className={site.secondary}
                    onClick={() => goTo(4)}
                  >
                    {t('date.reviewIncome')}
                  </button>
                  {needsPrincipal(draft) && draft.principal && (
                    <button
                      type="button"
                      className={site.secondary}
                      onClick={() => goTo(9)}
                    >
                      {t('principal.edit')}
                    </button>
                  )}
                  <p className={site.notice}>{t('home.disclaimer')}</p>
                </>
              )}

              <div className={site.actions}>
                <button type="submit" className={site.button}>
                  {t(
                    position === sequence.length - 1
                      ? editingPrincipal
                        ? 'principal.finish'
                        : 'form.results'
                      : 'form.continue',
                  )}
                </button>
                {position > 0 ? (
                  <button
                    type="button"
                    className={site.secondary}
                    onClick={() => goTo(sequence[position - 1])}
                  >
                    {t('form.back')}
                  </button>
                ) : (
                  <Link href="/">{t('site.home')}</Link>
                )}
              </div>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
