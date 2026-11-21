'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import {
  NZ_RESIDENT_CATEGORIES,
  evaluateNewZealand,
} from '@uk-immigration/engine';
import type { NzResidentCategory } from '@uk-immigration/engine';
import type { TranslationKey } from '../../i18n';
import { useTranslation } from '../../i18n/locale';
import { punct } from '../../i18n/punctuation';
import {
  emptyNzForm,
  emptyNzTrip,
  nzRequest,
  validateNzForm,
} from '../../lib/new-zealand';
import type { NzErrors, NzForm } from '../../lib/new-zealand';
import { today } from '../../lib/questionnaire';
import { PilotResult } from '../pilot/pilot-result';
import { Field } from '../simulate/field';
import form from '../simulate/form.module.css';
import site from '../site.module.css';

const FIELD_LABELS: Record<string, TranslationKey> = {
  'nz-simulation-date': 'nz.simulationDate',
  'nz-date-of-birth': 'nz.dateOfBirth',
  'nz-first-arrival': 'nz.firstArrival',
  'nz-resident-granted': 'nz.residentGranted',
  'nz-prv-granted': 'nz.prvGranted',
  'nz-travel-conditions-end': 'nz.travelConditionsEnd',
  departed: 'nz.departed',
  returned: 'nz.returned',
};

export default function NewZealandContent() {
  const { t, locale } = useTranslation();
  const p = punct(locale);
  // Today is set after hydration so the static page does not carry the build date.
  const [draft, setDraft] = useState<NzForm>(() => emptyNzForm(''));
  const [errors, setErrors] = useState<NzErrors>({});
  const [submitted, setSubmitted] = useState<NzForm>();
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const errorSummary = useRef<HTMLDivElement>(null);
  const result = useMemo(
    () => submitted && evaluateNewZealand(nzRequest(submitted, locale)),
    [submitted, locale],
  );

  useEffect(() => {
    setDraft((d) => (d.simulationDate ? d : { ...d, simulationDate: today() }));
  }, []);
  useEffect(() => {
    if (submitted) resultHeading.current?.focus();
  }, [submitted]);
  useEffect(() => {
    if (Object.keys(errors).length) errorSummary.current?.focus();
  }, [errors]);

  const set = (patch: Partial<NzForm>) => setDraft((d) => ({ ...d, ...patch }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const found = validateNzForm(draft);
    setErrors(found);
    // A new object each time, so the result heading is focused again.
    setSubmitted(Object.keys(found).length ? undefined : { ...draft });
  };
  const fieldLabel = (id: string) => {
    const [, n, field] = id.match(/^nz-trip-(\d+)-(\w+)$/) ?? [];
    if (!field) return t(FIELD_LABELS[id]);
    const entry = t('nz.trip').replace('{n}', String(Number(n) + 1));
    return `${entry} · ${t(FIELD_LABELS[field])}`;
  };

  const date = (
    id: string,
    label: string,
    value: string,
    onChange: (value: string) => void,
    hint?: string,
  ) => (
    <Field id={id} label={label} hint={hint} error={errors[id]}>
      <input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={errors[id] ? true : undefined}
        aria-describedby={
          [hint && `${id}-hint`, errors[id] && `${id}-error`]
            .filter(Boolean)
            .join(' ') || undefined
        }
      />
    </Field>
  );

  return (
    <main id="main" className={site.main}>
      <div className={site.narrow}>
        <h1>{t('nz.title')}</h1>
        <p className={site.lead}>{t('nz.intro')}</p>
        <p className={site.notice}>{t('nz.scope')}</p>
        <form noValidate onSubmit={submit}>
          {Object.keys(errors).length > 0 && (
            <div
              ref={errorSummary}
              tabIndex={-1}
              role="alert"
              className={form.errorSummary}
            >
              <p>{t('nz.errorSummary')}</p>
              <ul>
                {Object.entries(errors).map(([id, key]) => (
                  <li key={id}>
                    <a href={`#${id}`}>
                      {fieldLabel(id)}
                      {p.colon}
                      {key && t(key)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <h2>{t('nz.basics')}</h2>
          {date(
            'nz-simulation-date',
            t('nz.simulationDate'),
            draft.simulationDate,
            (simulationDate) => set({ simulationDate }),
            t('nz.simulationDateHint'),
          )}
          {date(
            'nz-date-of-birth',
            t('nz.dateOfBirth'),
            draft.dateOfBirth,
            (dateOfBirth) => set({ dateOfBirth }),
          )}
          {date(
            'nz-first-arrival',
            t('nz.firstArrival'),
            draft.firstArrival,
            (firstArrival) => set({ firstArrival }),
          )}

          <h2>{t('nz.visas')}</h2>
          {date(
            'nz-resident-granted',
            t('nz.residentGranted'),
            draft.residentGranted,
            (residentGranted) => set({ residentGranted }),
            t('nz.residentGrantedHint'),
          )}
          <Field id="nz-category" label={t('nz.category')}>
            <select
              id="nz-category"
              value={draft.category}
              onChange={(e) =>
                set({ category: e.target.value as NzResidentCategory })
              }
            >
              {NZ_RESIDENT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {t(`nz.category.${c}` as TranslationKey)}
                </option>
              ))}
            </select>
          </Field>
          {date(
            'nz-travel-conditions-end',
            t('nz.travelConditionsEnd'),
            draft.travelConditionsEnd,
            (travelConditionsEnd) => set({ travelConditionsEnd }),
            t('nz.travelConditionsEndHint'),
          )}
          <div className={form.checkboxes}>
            <label>
              <input
                type="checkbox"
                checked={draft.conditionsOutstanding}
                onChange={(e) =>
                  set({ conditionsOutstanding: e.target.checked })
                }
              />
              {t('nz.conditionsOutstanding')}
            </label>
          </div>
          {date(
            'nz-prv-granted',
            t('nz.prvGranted'),
            draft.prvGranted,
            (prvGranted) => set({ prvGranted }),
          )}

          <h2>{t('nz.trips')}</h2>
          <p className={form.hint}>{t('nz.tripsHint')}</p>
          {draft.trips.map((trip, i) => {
            const update = (patch: Partial<typeof trip>) =>
              set({
                trips: draft.trips.map((x, n) =>
                  n === i ? { ...x, ...patch } : x,
                ),
              });
            return (
              <fieldset key={i} className={form.entry}>
                <legend>{t('nz.trip').replace('{n}', String(i + 1))}</legend>
                {date(
                  `nz-trip-${i}-departed`,
                  t('nz.departed'),
                  trip.departed,
                  (departed) => update({ departed }),
                )}
                {date(
                  `nz-trip-${i}-returned`,
                  t('nz.returned'),
                  trip.returned,
                  (returned) => update({ returned }),
                )}
                <button
                  type="button"
                  className={form.remove}
                  onClick={() => {
                    // Row errors are keyed by index, so they go stale.
                    setErrors({});
                    set({ trips: draft.trips.filter((_, n) => n !== i) });
                  }}
                >
                  {t('nz.remove')}
                </button>
              </fieldset>
            );
          })}
          <div className={form.field}>
            <button
              type="button"
              className={site.secondary}
              onClick={() => set({ trips: [...draft.trips, emptyNzTrip()] })}
            >
              {t('nz.addTrip')}
            </button>
          </div>
          <div className={site.actions}>
            <button type="submit" className={site.button}>
              {t('nz.submit')}
            </button>
          </div>
        </form>
        {result && <PilotResult result={result} headingRef={resultHeading} />}
      </div>
    </main>
  );
}
