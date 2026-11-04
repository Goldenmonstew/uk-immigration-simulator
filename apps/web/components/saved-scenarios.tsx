'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from '../i18n/locale';
import { punct } from '../i18n/punctuation';
import { displayedRuleSets } from '../lib/policy';
import { type Draft, runSimulation } from '../lib/questionnaire';
import {
  type SavedScenario,
  deleteScenario,
  loadScenario,
  readScenarios,
  saveScenario,
} from '../lib/storage';
import site from '../app/site.module.css';
import styles from './saved-scenarios.module.css';

export function SavedScenarios({
  draft,
  onLoad,
}: {
  draft?: Draft;
  onLoad?: (draft: Draft) => void;
}) {
  const { t, locale } = useTranslation();
  const p = punct(locale);
  const [scenarios, setScenarios] = useState<SavedScenario[]>([]);
  const [name, setName] = useState<string>();
  const [available, setAvailable] = useState(true);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    const stored = readScenarios();
    setScenarios(stored.scenarios);
    setAvailable(stored.available);
    setReady(true);
  }, []);
  const summaries = useMemo(
    () =>
      scenarios.map((scenario) => ({
        ...scenario,
        result: runSimulation(scenario.draft, locale),
      })),
    [scenarios, locale],
  );
  const defaultName = `${t('scenarios.defaultName')} ${scenarios.length + 1}`;

  return (
    <section
      className={`${site.section} ${site.noPrint}`}
      aria-labelledby="scenarios-heading"
    >
      <h2 id="scenarios-heading">{t('scenarios.title')}</h2>
      <p className={site.muted}>{t('scenarios.privacy')}</p>
      {draft && ready && (
        <form
          className={styles.save}
          onSubmit={(event) => {
            event.preventDefault();
            const stored = saveScenario(name?.trim() || defaultName, draft);
            setScenarios(stored.scenarios);
            setAvailable(stored.available);
            setSaved(stored.available);
            if (stored.available) setName(undefined);
          }}
        >
          <label htmlFor="scenario-name">{t('scenarios.name')}</label>
          <div className={styles.row}>
            <input
              id="scenario-name"
              value={name ?? defaultName}
              onChange={(event) => {
                setName(event.target.value);
                setSaved(false);
              }}
            />
            <button className={site.secondary} type="submit">
              {t('scenarios.save')}
            </button>
          </div>
        </form>
      )}
      <div role="status">
        {!ready && <p>{t('result.loading')}</p>}
        {!available && (
          <p className={site.notice}>{t('scenarios.unavailable')}</p>
        )}
        {saved && <p>{t('scenarios.saved')}</p>}
      </div>
      {ready && available && !scenarios.length && <p>{t('scenarios.empty')}</p>}
      <ul className={styles.list}>
        {summaries.map((scenario) => (
          <li key={scenario.id} className={styles.card}>
            <h3>{scenario.name}</h3>
            <p>
              {t('whatif.date')}
              {p.colon}
              <time dateTime={scenario.draft.simulationDate}>
                {scenario.draft.simulationDate}
              </time>
            </p>
            <dl className={styles.summaries}>
              {displayedRuleSets.map((ruleSet) => {
                const assessment = scenario.result.byRuleSet[ruleSet.id];
                return (
                  <div key={ruleSet.id}>
                    <dt>{t(`policy.${ruleSet.kind}`)}</dt>
                    <dd>
                      {assessment
                        ? t(`outcome.${assessment.outcome}`)
                        : (scenario.result.shortCircuit?.message ??
                          t('result.missingAssessment'))}
                    </dd>
                  </div>
                );
              })}
            </dl>
            <div className={styles.row}>
              <Link
                href="/result"
                className={site.button}
                aria-label={`${t('scenarios.load')} ${scenario.name}`}
                onClick={() => {
                  const next = loadScenario(scenario);
                  onLoad?.(next);
                  setSaved(false);
                }}
              >
                {t('scenarios.load')}
              </Link>
              <button
                className={site.secondary}
                type="button"
                aria-label={`${t('scenarios.delete')} ${scenario.name}`}
                onClick={() => {
                  if (
                    !window.confirm(
                      t('scenarios.confirmDelete').replace(
                        '{name}',
                        scenario.name,
                      ),
                    )
                  )
                    return;
                  const stored = deleteScenario(scenario.id);
                  setScenarios(stored.scenarios);
                  setAvailable(stored.available);
                  setSaved(false);
                }}
              >
                {t('scenarios.delete')}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
