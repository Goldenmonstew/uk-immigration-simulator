'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import {
  AU_PERMANENT_SUBCLASSES,
  AU_TEMPORARY_SUBCLASSES,
  evaluateAustralia,
} from '@uk-immigration/engine';
import type { AuSubclass } from '@uk-immigration/engine';
import type { TranslationKey } from '../../i18n';
import { useTranslation } from '../../i18n/locale';
import { punct } from '../../i18n/punctuation';
import {
  auRequest,
  emptyAuForm,
  emptyTrip,
  emptyVisa,
  validateAuForm,
} from '../../lib/australia';
import type { AuErrors, AuForm } from '../../lib/australia';
import { today } from '../../lib/questionnaire';
import { Field } from '../simulate/field';
import form from '../simulate/form.module.css';
import { PilotResult } from '../pilot/pilot-result';
import site from '../site.module.css';

const TRT = new Set<AuSubclass>(['457', '482']);
const FIELD_LABELS: Record<string, TranslationKey> = {
  'au-simulation-date': 'au.simulationDate',
  'au-date-of-birth': 'au.dateOfBirth',
  'au-first-arrival': 'au.firstArrival',
  'au-partner-lodged': 'au.partnerLodged',
  from: 'au.from',
  to: 'au.to',
  departed: 'au.departed',
  returned: 'au.returned',
};

export default function AustraliaContent() {
  const { t, locale } = useTranslation();
  const p = punct(locale);
  // Today is set after hydration so the static page does not carry the build date.
  const [draft, setDraft] = useState<AuForm>(() => emptyAuForm(''));
  const [errors, setErrors] = useState<AuErrors>({});
  const [submitted, setSubmitted] = useState<AuForm>();
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const errorSummary = useRef<HTMLDivElement>(null);
  const result = useMemo(
    () => submitted && evaluateAustralia(auRequest(submitted, locale)),
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

  const set = (patch: Partial<AuForm>) => setDraft((d) => ({ ...d, ...patch }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const found = validateAuForm(draft);
    setErrors(found);
    // A new object each time, so the result heading is focused again.
    setSubmitted(Object.keys(found).length ? undefined : { ...draft });
  };
  const fieldLabel = (id: string) => {
    const [, kind, n, field] = id.match(/^au-(visa|trip)-(\d+)-(\w+)$/) ?? [];
    if (!kind) return t(FIELD_LABELS[id]);
    const entry = t(kind === 'visa' ? 'au.visa' : 'au.trip').replace(
      '{n}',
      String(Number(n) + 1),
    );
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
        <h1>{t('au.title')}</h1>
        <p className={site.lead}>{t('au.intro')}</p>
        <p className={site.notice}>{t('au.scope')}</p>
        <form noValidate onSubmit={submit}>
          {Object.keys(errors).length > 0 && (
            <div
              ref={errorSummary}
              tabIndex={-1}
              role="alert"
              className={form.errorSummary}
            >
              <p>{t('au.errorSummary')}</p>
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
          <h2>{t('au.basics')}</h2>
          {date(
            'au-simulation-date',
            t('au.simulationDate'),
            draft.simulationDate,
            (simulationDate) => set({ simulationDate }),
            t('au.simulationDateHint'),
          )}
          {date(
            'au-date-of-birth',
            t('au.dateOfBirth'),
            draft.dateOfBirth,
            (dateOfBirth) => set({ dateOfBirth }),
          )}
          {date(
            'au-first-arrival',
            t('au.firstArrival'),
            draft.firstArrival,
            (firstArrival) => set({ firstArrival }),
          )}

          <h2>{t('au.visas')}</h2>
          <p className={form.hint}>{t('au.visasHint')}</p>
          {draft.visas.map((visa, i) => {
            const update = (patch: Partial<typeof visa>) =>
              set({
                visas: draft.visas.map((v, n) =>
                  n === i ? { ...v, ...patch } : v,
                ),
              });
            return (
              <fieldset key={i} className={form.entry}>
                <legend>{t('au.visa').replace('{n}', String(i + 1))}</legend>
                <Field id={`au-visa-${i}-subclass`} label={t('au.subclass')}>
                  <select
                    id={`au-visa-${i}-subclass`}
                    value={visa.subclass}
                    onChange={(e) =>
                      update({ subclass: e.target.value as AuSubclass })
                    }
                  >
                    {[
                      ...AU_TEMPORARY_SUBCLASSES,
                      ...AU_PERMANENT_SUBCLASSES,
                    ].map((s) => (
                      <option key={s} value={s}>
                        {t(`au.sub.${s}` as TranslationKey)}
                      </option>
                    ))}
                  </select>
                </Field>
                {date(`au-visa-${i}-from`, t('au.from'), visa.from, (from) =>
                  update({ from }),
                )}
                {date(`au-visa-${i}-to`, t('au.to'), visa.to, (to) =>
                  update({ to }),
                )}
                <button
                  type="button"
                  className={form.remove}
                  onClick={() => {
                    // Row errors are keyed by index, so they go stale.
                    setErrors({});
                    set({ visas: draft.visas.filter((_, n) => n !== i) });
                  }}
                >
                  {t('au.remove')}
                </button>
              </fieldset>
            );
          })}
          <div className={form.field}>
            <button
              type="button"
              className={site.secondary}
              onClick={() => set({ visas: [...draft.visas, emptyVisa()] })}
            >
              {t('au.addVisa')}
            </button>
          </div>

          <h2>{t('au.trips')}</h2>
          <p className={form.hint}>{t('au.tripsHint')}</p>
          {draft.trips.map((trip, i) => {
            const update = (patch: Partial<typeof trip>) =>
              set({
                trips: draft.trips.map((x, n) =>
                  n === i ? { ...x, ...patch } : x,
                ),
              });
            return (
              <fieldset key={i} className={form.entry}>
                <legend>{t('au.trip').replace('{n}', String(i + 1))}</legend>
                {date(
                  `au-trip-${i}-departed`,
                  t('au.departed'),
                  trip.departed,
                  (departed) => update({ departed }),
                )}
                {date(
                  `au-trip-${i}-returned`,
                  t('au.returned'),
                  trip.returned,
                  (returned) => update({ returned }),
                )}
                <button
                  type="button"
                  className={form.remove}
                  onClick={() => {
                    setErrors({});
                    set({ trips: draft.trips.filter((_, n) => n !== i) });
                  }}
                >
                  {t('au.remove')}
                </button>
              </fieldset>
            );
          })}
          <div className={form.field}>
            <button
              type="button"
              className={site.secondary}
              onClick={() => set({ trips: [...draft.trips, emptyTrip()] })}
            >
              {t('au.addTrip')}
            </button>
          </div>

          <div className={form.checkboxes}>
            {draft.visas.some((v) => TRT.has(v.subclass)) && (
              <label>
                <input
                  type="checkbox"
                  checked={draft.sponsoredFullTime}
                  onChange={(e) => set({ sponsoredFullTime: e.target.checked })}
                />
                {t('au.sponsored')}
              </label>
            )}
            <label>
              <input
                type="checkbox"
                checked={draft.partner}
                onChange={(e) => set({ partner: e.target.checked })}
              />
              {t('au.partner')}
            </label>
          </div>
          {draft.partner && (
            <div className={form.followUp}>
              {date(
                'au-partner-lodged',
                t('au.partnerLodged'),
                draft.partnerLodged,
                (partnerLodged) => set({ partnerLodged }),
              )}
              <fieldset className={form.fieldset}>
                <legend className={form.legend}>{t('au.partnerStream')}</legend>
                <div className={form.radios}>
                  {(['onshore', 'offshore'] as const).map((stream) => (
                    <label key={stream}>
                      <input
                        type="radio"
                        name="au-partner-stream"
                        checked={draft.partnerStream === stream}
                        onChange={() => set({ partnerStream: stream })}
                      />
                      {t(`au.${stream}`)}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className={form.checkboxes}>
                <label>
                  <input
                    type="checkbox"
                    checked={draft.longTermRelationship}
                    onChange={(e) =>
                      set({ longTermRelationship: e.target.checked })
                    }
                  />
                  {t('au.longTerm')}
                </label>
              </div>
            </div>
          )}
          <div className={site.actions}>
            <button type="submit" className={site.button}>
              {t('au.submit')}
            </button>
          </div>
        </form>
        {result && <PilotResult result={result} headingRef={resultHeading} />}
      </div>
    </main>
  );
}
