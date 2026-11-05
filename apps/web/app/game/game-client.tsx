'use client';

import { useEffect, useState, useRef } from 'react';
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
} from '@uk-immigration/game';
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
import {
  gameStorage,
  withGameLocale,
  needsVisaReminder,
  spritePath,
  visaMonths,
} from './session';
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

  const [sceneReady, setSceneReady] = useState(false);
  const [remindedQuarter, setRemindedQuarter] = useState<string>();
  const [music, setMusic] = useState(false);
  const [musicError, setMusicError] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);

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
      state.eventQueue.length > 0 ||
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

  useEffect(() => {
    if (!state || isOver(state)) {
      audio.current?.pause();
      setMusic(false);
    }
  }, [state]);

  const current = state && withGameLocale(state, locale);
  const event = current && currentEvent(current);
  const quarterKey =
    current &&
    `${current.characterId}:${current.seed}:${current.year}:${current.quarter}`;
  const reminder =
    current && needsVisaReminder(current) && remindedQuarter !== quarterKey;
  const paused = !!(
    !sceneReady ||
    reminder ||
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
    setRemindedQuarter(undefined);
    setSceneReady(false);
  };
  const apply = (next: GameState) => {
    setFeedback({ before: current!, after: next });
    setState(next);
    setLocation(undefined);
  };
  const walkTo = (target: LocationId) => {
    setDetail(undefined);
    setSummary(undefined);
    setRemindedQuarter(quarterKey);
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
      <audio
        ref={audio}
        src="/game/assets/musics/theme-9.ogg"
        loop
        preload="none"
        onError={() => {
          setMusic(false);
          setMusicError(true);
        }}
      />
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
              <StatusBar state={current}>
                <button
                  className={styles.music}
                  aria-pressed={music}
                  onClick={async () => {
                    if (music) {
                      audio.current?.pause();
                      setMusic(false);
                    } else {
                      try {
                        await audio.current?.play();
                        setMusic(true);
                        setMusicError(false);
                      } catch {
                        setMusicError(true);
                      }
                    }
                  }}
                >
                  {t(music ? 'game.musicOn' : 'game.musicOff')}
                </button>
              </StatusBar>
              {musicError && <p role="status">{t('game.musicUnavailable')}</p>}
              <div className={styles.map}>
                <TownCanvas
                  key={`${current.characterId}:${current.seed}`}
                  locale={locale}
                  quarter={current.quarter}
                  sprite={spritePath(
                    characters.find((item) => item.id === current.characterId)!
                      .sprite,
                  )}
                  onReady={() => setSceneReady(true)}
                  paused={paused}
                  onLocation={setLocation}
                  destination={destination}
                />
                {!sceneReady && (
                  <p className={styles.loading} role="status">
                    {t('game.loading')}
                  </p>
                )}
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
          {!sceneReady && !isOver(current) ? null : summary ? (
            <Modal
              key="summary"
              title={t(
                summary.before.quarter === 4
                  ? 'game.yearSummary'
                  : 'game.quarterSummary',
              )}
            >
              <QuarterSummary
                {...localizeChange(summary)}
                onContinue={() => setSummary(undefined)}
                onVisit={() => walkTo('council')}
              />
            </Modal>
          ) : feedback ? (
            <Modal key="feedback" title={t('game.changes')}>
              <ActionFeedback
                {...localizeChange(feedback)}
                onContinue={() => setFeedback(undefined)}
              />
            </Modal>
          ) : reminder ? (
            <Modal
              key={`reminder-${quarterKey}`}
              title={t('game.visaReminderTitle')}
            >
              <p>
                {t('game.visaReminder').replace(
                  '{count}',
                  String(visaMonths(current)),
                )}
              </p>
              <div className={styles.buttons}>
                <button className={site.button} onClick={() => walkTo('visa')}>
                  {t('game.visaVisit')}
                </button>
                <button
                  className={site.secondary}
                  onClick={() => setRemindedQuarter(quarterKey)}
                >
                  {t('game.continuePlaying')}
                </button>
              </div>
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
