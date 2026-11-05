'use client';

import { useEffect, useState } from 'react';
import type { RuleSetId } from '@uk-immigration/engine';
import { useTranslation } from '../../i18n/locale';
import {
  characters,
  currentEvent,
  endQuarter,
  isOver,
  locations,
  type GameState,
  type LocationId,
} from './mock-core';
import {
  ActionFeedback,
  CharacterSelect,
  Ending,
  EventCard,
  localText,
  LocationMenu,
  Modal,
  ProgressBars,
  ProgressDetail,
  QuarterSummary,
  StatusBar,
  type StateChange,
} from './game-view';
import { gameStorage, withGameLocale } from './session';
import TownCanvas from './town-canvas';
import styles from './game.module.css';
import site from '../site.module.css';

export default function GameClient() {
  const { t, locale } = useTranslation();
  const [state, setState] = useState<GameState>();
  const [saves, setSaves] = useState<Record<string, GameState | undefined>>({});
  const [ready, setReady] = useState(false);
  const [available, setAvailable] = useState(true);
  const [location, setLocation] = useState<LocationId>();
  const [detail, setDetail] = useState<RuleSetId>();
  const [feedback, setFeedback] = useState<StateChange>();
  const [summary, setSummary] = useState<StateChange>();
  const [destination, setDestination] = useState<{
    location: LocationId;
    request: number;
  }>();

  useEffect(() => {
    const stored = characters.map(
      (character) => [character.id, gameStorage(character.id)] as const,
    );
    setSaves(Object.fromEntries(stored.map(([id, save]) => [id, save.state])));
    setAvailable(stored.every(([, save]) => save.available));
    setReady(true);
  }, []);
  useEffect(() => {
    if (state && state.locale !== locale)
      setState(withGameLocale(state, locale));
  }, [state, locale]);
  useEffect(() => {
    if (!ready || !state || state.locale !== locale) return;
    setAvailable(gameStorage(state.characterId, state).available);
    setSaves((previous) => ({ ...previous, [state.characterId]: state }));
  }, [ready, state, locale]);
  useEffect(() => {
    if (
      !state ||
      state.actionsLeft > 0 ||
      currentEvent(state) ||
      feedback ||
      summary ||
      isOver(state)
    )
      return;
    const after = endQuarter(state);
    setSummary({ before: state, after });
    setLocation(undefined);
    setState(after);
  }, [state, feedback, summary]);

  const current = state && withGameLocale(state, locale);
  const event = current && currentEvent(current);
  const paused = !!(
    location ||
    detail ||
    feedback ||
    summary ||
    event ||
    (current && isOver(current))
  );
  const changeCharacter = (next: GameState | undefined) => {
    setState(next);
    setLocation(undefined);
    setDetail(undefined);
    setFeedback(undefined);
    setSummary(undefined);
    setDestination(undefined);
  };
  const apply = (next: GameState) => {
    setFeedback({ before: current!, after: next });
    setState(next);
    setLocation(undefined);
  };
  const walkTo = (target: LocationId) => {
    setDetail(undefined);
    setDestination((previous) => ({
      location: target,
      request: (previous?.request ?? 0) + 1,
    }));
  };
  const localizeChange = (change: StateChange) => ({
    before: withGameLocale(change.before, locale),
    after: withGameLocale(change.after, locale),
  });
  return (
    <div className={styles.game}>
      <p className={styles.preview}>{t('game.preview')}</p>
      {!ready ? (
        <p role="status">{t('game.loading')}</p>
      ) : !current ? (
        <CharacterSelect saves={saves} onChange={changeCharacter} />
      ) : (
        <>
          {isOver(current) && !summary && !feedback ? (
            <Ending state={current} onChange={changeCharacter} />
          ) : (
            <>
              <StatusBar state={current} />
              <div className={styles.map}>
                <TownCanvas
                  key={`${current.characterId}:${current.seed}`}
                  locale={locale}
                  quarter={current.quarter}
                  sprite={
                    characters.find((item) => item.id === current.characterId)!
                      .sprite
                  }
                  paused={paused}
                  onLocation={setLocation}
                  destination={destination}
                />
              </div>
              <p className={styles.controls}>{t('game.controls')}</p>
              <nav
                className={styles.destinations}
                aria-label={t('game.destinations')}
              >
                {locations.map((place) => (
                  <button
                    key={place.id}
                    disabled={paused}
                    onClick={() => walkTo(place.id)}
                  >
                    {localText(place.name, locale)}
                  </button>
                ))}
              </nav>
              <ProgressBars state={current} onOpen={setDetail} />
              <div className={styles.toolbar}>
                <button
                  className={site.button}
                  disabled={paused}
                  onClick={() => {
                    const after = endQuarter(current);
                    setSummary({ before: current, after });
                    setState(after);
                  }}
                >
                  {t('game.endQuarter')}
                </button>
                <button
                  className={site.secondary}
                  disabled={paused}
                  onClick={() => changeCharacter(undefined)}
                >
                  {t('game.changeCharacter')}
                </button>
              </div>
            </>
          )}
          {summary ? (
            <Modal key="summary" title={t('game.quarterSummary')}>
              <QuarterSummary
                {...localizeChange(summary)}
                onContinue={() => setSummary(undefined)}
              />
            </Modal>
          ) : feedback ? (
            <Modal key="feedback" title={t('game.changes')}>
              <ActionFeedback
                {...localizeChange(feedback)}
                onContinue={() => setFeedback(undefined)}
              />
            </Modal>
          ) : event ? (
            <Modal
              key={`event-${event.id}`}
              title={localText(event.title, locale)}
            >
              <EventCard state={current} onChange={apply} />
            </Modal>
          ) : location ? (
            <Modal
              key={`location-${location}`}
              title={t(`game.location.${location}`)}
              onClose={() => setLocation(undefined)}
              wide={location === 'council'}
            >
              <LocationMenu
                state={current}
                location={location}
                onChange={apply}
              />
            </Modal>
          ) : detail ? (
            <Modal
              key="progress"
              title={t(
                detail === 'current-law-2026-11'
                  ? 'game.currentLaw'
                  : 'game.reform',
              )}
              onClose={() => setDetail(undefined)}
            >
              <ProgressDetail
                state={current}
                id={detail}
                onVisit={() => walkTo('council')}
              />
            </Modal>
          ) : null}
        </>
      )}
      <p className={styles.saveStatus} role="status">
        {t(available ? 'game.saved' : 'game.storageUnavailable')}
      </p>
      <p className={styles.disclaimer}>{t('game.disclaimer')}</p>
    </div>
  );
}
