'use client';

import Link from 'next/link';
import { useEffect, useRef, type ReactNode } from 'react';
import type { RuleSetId } from '@uk-immigration/engine';
import { AssessmentColumns } from '../../components/result-view';
import { useTranslation } from '../../i18n/locale';
import { displayedRuleSets } from '../../lib/policy';
import { encodeDraft } from '../../lib/share';
import {
  activities,
  doActivity,
  isOpen,
  places,
  peopleAt,
  npcs,
  items,
  achievements,
  characters,
  currentEvent,
  isOver,
  narrative,
  newGame,
  progress,
  resolve,
  type Effect,
  type GameState,
  type PlaceId,
  type StatKey,
  type Text,
} from './mock-core';
import {
  gameDraft,
  withGameLocale,
  statKeys,
  spritePath,
  visaMonths,
} from './session';
import site from '../site.module.css';
import styles from './game.module.css';

export function localText(text: Text, locale: string) {
  return locale === 'en' ? text.en : text.zhCN;
}
export const weatherIcon = { sunny: '☀', cloudy: '☁', rain: '☂', snow: '❄' };
export const clockTime = (minute: number) =>
  `${Math.floor(minute / 60)
    .toString()
    .padStart(2, '0')}:${(minute % 60).toString().padStart(2, '0')}`;
export const dayDate = (date: string, locale: string) =>
  new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'zh-CN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date));
export function money(value: number) {
  return `£${value.toLocaleString('en-GB', { maximumFractionDigits: 0 })}`;
}
function signed(value: number, key: StatKey) {
  return `${value > 0 ? '+' : value < 0 ? '−' : ''}${key === 'money' ? money(Math.abs(value)) : Math.abs(value)}`;
}
function outcomeColor(outcome: string) {
  return outcome === 'LIKELY_ELIGIBLE'
    ? '#00703c'
    : outcome === 'LIKELY_NOT_ELIGIBLE' ||
        outcome === 'REQUIRES_REGULATED_REVIEW'
      ? '#b52b1a'
      : '#956d00';
}

export function CharacterSelect({
  saves,
  onChange,
}: {
  saves: Record<string, GameState | undefined>;
  onChange: (state: GameState) => void;
}) {
  const { t, locale } = useTranslation();
  return (
    <section className={styles.welcome}>
      <h1>Immigration Life</h1>
      <p className={site.lead}>{t('game.intro')}</p>
      <h2>{t('game.chooseCharacter')}</h2>
      <div className={styles.characters}>
        {characters.map((character) => (
          <article key={character.id} className={styles.character}>
            <span
              className={styles.portrait}
              style={{
                backgroundImage: `url("${spritePath(character.id)}")`,
              }}
              role="img"
              aria-label={localText(character.name, locale)}
            />
            <div>
              <h3>{localText(character.name, locale)}</h3>
              <p>{localText(character.intro, locale)}</p>
              <div className={styles.buttons}>
                {saves[character.id] && (
                  <button
                    className={site.button}
                    onClick={() =>
                      onChange(withGameLocale(saves[character.id]!, locale))
                    }
                  >
                    {t('game.continue')}
                  </button>
                )}
                <button
                  className={saves[character.id] ? site.secondary : site.button}
                  onClick={() =>
                    onChange(
                      newGame(character.id, Date.now() % 2 ** 31, locale),
                    )
                  }
                >
                  {t('game.startAs').replace(
                    '{name}',
                    localText(character.name, locale),
                  )}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function StatusBar({
  state,
  children,
}: {
  state: GameState;
  children?: ReactNode;
}) {
  const { t, locale } = useTranslation();
  const name = characters.find((item) => item.id === state.characterId)!.name;
  const months = visaMonths(state);
  return (
    <header className={styles.hud}>
      <div className={styles.hudTop}>
        <strong>{localText(name, locale)}</strong>
        <span className={styles.season}>
          {t('game.yearQuarter')
            .replace('{year}', String(state.year))
            .replace('{quarter}', String(state.quarter))}{' '}
          · {t(`game.season${state.quarter}`)}
        </span>
        <time dateTime={state.day.date}>{dayDate(state.day.date, locale)}</time>
        <strong className={styles.clock}>{clockTime(state.day.minute)}</strong>
        <span aria-label={t(`game.${state.day.weather}`)}>
          {weatherIcon[state.day.weather]} {t(`game.${state.day.weather}`)}
        </span>
        <span>
          {t('game.day').replace('{day}', String(state.day.index + 1))}
        </span>
        <span
          className={
            months <= 6 ? `${styles.urgent} ${styles.visaFlash}` : styles.visa
          }
          title={months <= 6 ? t('game.visaUrgent') : undefined}
        >
          {t('game.visa').replace('{count}', String(months))}
        </span>
        {children}
      </div>
      <div className={styles.stats}>
        {statKeys.map((key) => (
          <div className={styles.stat} key={key}>
            <div>
              <span>{t(`game.${key}`)}</span>
              <strong>
                {key === 'money' ? money(state.stats[key]) : state.stats[key]}
              </strong>
            </div>
            <meter
              aria-label={t(`game.${key}`)}
              min={key === 'money' ? Math.min(0, state.stats.money) : 0}
              max={key === 'money' ? Math.max(10000, state.stats.money) : 100}
              value={state.stats[key]}
            />
          </div>
        ))}
      </div>
    </header>
  );
}

export function ProgressBars({
  state,
  onOpen,
}: {
  state: GameState;
  onOpen: (id: RuleSetId) => void;
}) {
  const { t } = useTranslation();
  const bars = progress(state);
  return (
    <div className={styles.progressBars}>
      {displayedRuleSets.map(({ id }, index) => (
        <button
          className={styles.progressButton}
          key={id}
          onClick={() => onOpen(id)}
        >
          <span>
            {t(index === 0 ? 'game.currentLaw' : 'game.reform')}
            <strong>{Math.round(bars[id].percent)}%</strong>
          </span>
          <span
            className={styles.track}
            role="progressbar"
            aria-label={t(index === 0 ? 'game.currentLaw' : 'game.reform')}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(bars[id].percent)}
          >
            <span
              style={{
                width: `${Math.round(bars[id].percent)}%`,
                backgroundColor: outcomeColor(bars[id].outcome),
              }}
            />
          </span>
          <small>{t(`outcome.${bars[id].outcome}`)}</small>
        </button>
      ))}
    </div>
  );
}

export function ProgressDetail({
  state,
  id,
  onVisit,
}: {
  state: GameState;
  id: RuleSetId;
  onVisit: () => void;
}) {
  const { t } = useTranslation();
  const assessment = state.result.byRuleSet[id]!;
  return (
    <>
      <p className={site.lead}>{t(`outcome.${assessment.outcome}`)}</p>
      <dl className={styles.facts}>
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
          <dd>{assessment.earliestDate ?? t('result.undetermined')}</dd>
        </div>
      </dl>
      <p>{t('game.progressHint')}</p>
      <button className={site.button} onClick={onVisit}>
        {t('game.councilDetails')}
      </button>
    </>
  );
}

function EffectHints({ effects }: { effects: Effect[] }) {
  const { t, locale } = useTranslation();
  return (
    <span className={styles.hints}>
      {effects.map((effect, index) => (
        <span key={index}>
          {effect.type === 'stat'
            ? `${t(`game.${effect.key}`)} ${signed(effect.delta, effect.key)}`
            : effect.type === 'money'
              ? signed(effect.delta, 'money')
              : effect.type === 'item'
                ? `${localText(items.find((i) => i.id === effect.item)?.name ?? { zhCN: '物品', en: 'Item' }, locale)} ${effect.delta > 0 ? '+' : ''}${effect.delta}`
                : effect.type === 'friendship'
                  ? `${localText(npcs.find((n) => n.id === effect.npc)!.name, locale)} ${effect.delta > 0 ? '+' : ''}${effect.delta}`
                  : effect.type === 'none'
                    ? null
                    : t(
                        effect.type === 'ending'
                          ? 'game.endingEffect'
                          : 'game.timelineEffect',
                      )}
        </span>
      ))}
    </span>
  );
}

export function LocationMenu({
  state,
  location,
  onChange,
  onTalk,
  children,
}: {
  state: GameState;
  location: PlaceId;
  onChange: (next: GameState) => void;
  onTalk?: (npc: string) => void;
  children?: ReactNode;
}) {
  const { t, locale } = useTranslation();
  const place = places.find((p) => p.id === location)!;
  const open = isOpen(state, location);
  const available = activities(state, location).sort(
    (a, b) => Number(b.id === 'extend') - Number(a.id === 'extend'),
  );
  return (
    <>
      <p>
        {t('game.hours')}:{' '}
        {place.hours
          ? `${clockTime(place.hours.opens)}–${clockTime(place.hours.closes)}`
          : t('game.openAllDay')}
        {place.hours?.dayKinds &&
          ` · ${place.hours.dayKinds.map((k) => t(`game.${k}`)).join(', ')}`}
      </p>
      {!open ? (
        <p role="status">{t('game.closed')}</p>
      ) : (
        <>
          {location === 'council' ? (
            <AssessmentColumns
              result={state.result}
              simulationDate={state.date}
              idPrefix="town-"
            />
          ) : (
            <>
              {location === 'station' && <p>{t('game.travelRecall')}</p>}
              {location === 'board' && <p>{t('game.noticeText')}</p>}
              <div className={styles.choices}>
                {available.map((action) => (
                  <button
                    key={action.id}
                    className={styles.choice}
                    onClick={() => onChange(doActivity(state, action.id))}
                  >
                    <strong>{localText(action.label, locale)}</strong>
                    <small>
                      {t('game.minutes').replace(
                        '{count}',
                        String(
                          action.id === 'work'
                            ? 1020 - state.day.minute
                            : action.minutes,
                        ),
                      )}
                    </small>
                    <EffectHints effects={action.effects} />
                  </button>
                ))}
              </div>
              {children}
            </>
          )}
          {!!peopleAt(state, location).length && (
            <section className={styles.people}>
              <h3>{t('game.peopleHere')}</h3>
              {peopleAt(state, location).map((id) => (
                <button
                  key={id}
                  className={site.secondary}
                  onClick={() => onTalk?.(id)}
                >
                  {localText(npcs.find((n) => n.id === id)!.name, locale)} ·{' '}
                  {t('game.talk')}
                </button>
              ))}
            </section>
          )}
        </>
      )}
    </>
  );
}

export function EventCard({
  state,
  onChange,
}: {
  state: GameState;
  onChange: (next: GameState) => void;
}) {
  const { locale } = useTranslation();
  const event = currentEvent(state)!;
  return (
    <>
      <p className={site.lead}>{localText(event.text, locale)}</p>
      <div className={styles.choices}>
        {event.choices.map((choice) => (
          <button
            className={styles.choice}
            key={choice.id}
            onClick={() => onChange(resolve(state, choice.id))}
          >
            <strong>{localText(choice.label, locale)}</strong>
            <EffectHints effects={choice.effects} />
            {choice.note && <small>{localText(choice.note, locale)}</small>}
          </button>
        ))}
      </div>
    </>
  );
}

export interface StateChange {
  before: GameState;
  after: GameState;
}
export function StatChanges({ before, after }: StateChange) {
  const { t } = useTranslation();
  const changed = statKeys.filter(
    (key) => before.stats[key] !== after.stats[key],
  );
  return changed.length ? (
    <ul className={`${styles.deltas} ${styles.animateDeltas}`}>
      {changed.map((key) => (
        <li key={key}>
          <span>{t(`game.${key}`)}</span>
          <strong
            className={
              after.stats[key] > before.stats[key]
                ? styles.positive
                : styles.negative
            }
          >
            {signed(after.stats[key] - before.stats[key], key)}
          </strong>
        </li>
      ))}
    </ul>
  ) : (
    <p>{t('game.noChanges')}</p>
  );
}
export function ActionFeedback({
  before,
  after,
  onContinue,
}: StateChange & { onContinue: () => void }) {
  const { t } = useTranslation();
  return (
    <>
      <StatChanges before={before} after={after} />
      {JSON.stringify(before.timeline) !== JSON.stringify(after.timeline) && (
        <p>{t('game.timelineChanged')}</p>
      )}
      <button className={site.button} onClick={onContinue}>
        {t('game.continuePlaying')}
      </button>
    </>
  );
}

export function QuarterSummary({
  before,
  after,
  onContinue,
  onVisit,
}: StateChange & { onContinue: () => void; onVisit: () => void }) {
  const { t, locale } = useTranslation();
  const entries = after.log.filter(
    (entry) => entry.year === before.year && entry.quarter === before.quarter,
  );
  const net = entries
    .filter((entry) => entry.kind === 'quarter')
    .reduce((sum, entry) => sum + (entry.statDeltas?.money ?? 0), 0);
  const moments = entries.filter(
    (entry) => entry.kind === 'event' || entry.kind === 'action',
  );
  const quarterStart = { ...before, stats: { ...before.stats } };
  for (const key of statKeys) {
    quarterStart.stats[key] =
      after.stats[key] -
      entries.reduce((sum, entry) => sum + (entry.statDeltas?.[key] ?? 0), 0);
  }
  const previous = progress(before),
    next = progress(after);
  return (
    <>
      <dl className={styles.facts}>
        <div>
          <dt>{t('game.netIncome')}</dt>
          <dd>{signed(net, 'money')}</dd>
        </div>
      </dl>
      <h3>{t('game.quarterChanges')}</h3>
      <StatChanges before={quarterStart} after={after} />
      <p className={visaMonths(after) <= 6 ? styles.urgent : undefined}>
        {t('game.visa').replace('{count}', String(visaMonths(after)))}
      </p>
      <h3>{t('game.daysReview')}</h3>
      {moments.length ? (
        <ul className={styles.review}>
          {moments.map((entry, index) => (
            <li key={index}>
              {localText(entry.text, locale)}
              <span className={styles.hints}>
                {statKeys
                  .filter((key) => entry.statDeltas?.[key])
                  .map((key) => (
                    <small key={key}>
                      {t(`game.${key}`)} {signed(entry.statDeltas![key]!, key)}
                    </small>
                  ))}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>{t('game.noEvents')}</p>
      )}
      {before.quarter === 4 && (
        <>
          <h3>{t('game.yearSummary')}</h3>
          <p>{t('game.progressChanges')}</p>
          <div className={styles.progressBars}>
            {displayedRuleSets.map(({ id }, index) => (
              <div key={id} className={styles.progressButton}>
                <strong>
                  {t(index === 0 ? 'game.currentLaw' : 'game.reform')}
                </strong>
                <p>
                  {Math.round(previous[id].percent)}% →{' '}
                  {Math.round(next[id].percent)}%
                </p>
                <span className={styles.track} aria-hidden="true">
                  <span
                    style={{
                      width: `${Math.round(previous[id].percent)}%`,
                      backgroundColor: '#7896aa',
                    }}
                  />
                </span>
                <span
                  className={styles.track}
                  role="progressbar"
                  aria-label={t(
                    index === 0 ? 'game.currentLaw' : 'game.reform',
                  )}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(next[id].percent)}
                >
                  <span
                    style={{
                      width: `${Math.round(next[id].percent)}%`,
                      backgroundColor: outcomeColor(next[id].outcome),
                    }}
                  />
                </span>
                <small>{t(`outcome.${next[id].outcome}`)}</small>
              </div>
            ))}
          </div>
          {!isOver(after) && (
            <p>
              <button className={site.secondary} onClick={onVisit}>
                {t('game.councilDetails')}
              </button>
            </p>
          )}
        </>
      )}
      <button className={site.button} onClick={onContinue}>
        {t(isOver(after) ? 'game.seeEnding' : 'game.nextQuarter')}
      </button>
    </>
  );
}

export function Ending({
  state,
  onChange,
}: {
  state: GameState;
  onChange: (next: GameState | undefined) => void;
}) {
  const { t, locale } = useTranslation();
  return (
    <section className={styles.ending}>
      <h1>{t('game.ending')}</h1>
      {narrative(state).map((line, index) => (
        <p key={index} className={styles.story}>
          {localText(line, locale)}
        </p>
      ))}
      <h2>{t('game.achievements')}</h2>
      <div className={styles.achievementColumns}>
        {[true, false].map((earned) => {
          const items = [
            ...achievements,
            ...(characters.find(
              (character) => character.id === state.characterId,
            )!.achievements ?? []),
          ].filter((item) => state.achievements.includes(item.id) === earned);
          return (
            <section key={String(earned)}>
              <h3>{t(earned ? 'game.earned' : 'game.unearned')}</h3>
              {items.length ? (
                <ul>
                  {items.map((item) => (
                    <li key={item.id}>
                      <strong>{localText(item.name, locale)}</strong>
                      <p>{localText(item.description, locale)}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{t('game.noAchievements')}</p>
              )}
            </section>
          );
        })}
      </div>
      <div className={styles.buttons}>
        <Link
          className={site.button}
          href={`/result#s=${encodeDraft(gameDraft(state))}`}
        >
          {t('game.openTimeline')}
        </Link>
        <button
          className={site.secondary}
          onClick={() =>
            onChange(newGame(state.characterId, Date.now() % 2 ** 31, locale))
          }
        >
          {t('game.replay')}
        </button>
        <button className={site.secondary} onClick={() => onChange(undefined)}>
          {t('game.changeCharacter')}
        </button>
      </div>
      {state.result.shortCircuit && (
        <p className={site.notice}>{state.result.shortCircuit.message}</p>
      )}
      <AssessmentColumns
        result={state.result}
        simulationDate={state.date}
        idPrefix="ending-"
      />
    </section>
  );
}

export function Modal({
  title,
  children,
  onClose,
  wide = false,
  dialogue = false,
}: {
  title: string;
  children: ReactNode;
  onClose?: () => void;
  wide?: boolean;
  dialogue?: boolean;
}) {
  const { t } = useTranslation();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = ref.current!;
    dialog.showModal();
    return () => {
      dialog.close();
      previous?.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`${styles.modal} ${wide ? styles.wideModal : ''} ${dialogue ? styles.dialogueModal : ''}`}
      aria-labelledby="game-dialog-heading"
      onCancel={(event) => {
        event.preventDefault();
        onClose?.();
      }}
    >
      <header className={styles.modalHeader}>
        <h2 id="game-dialog-heading">{title}</h2>
        {onClose && (
          <button className={styles.close} onClick={onClose}>
            {t('game.close')}
          </button>
        )}
      </header>
      {children}
    </dialog>
  );
}
