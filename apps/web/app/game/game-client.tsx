'use client';
import { useEffect, useRef, useState } from 'react';
import type { RuleSetId } from '@uk-immigration/engine';
import { useTranslation } from '../../i18n/locale';
import {
  characters,
  currentEvent,
  enter,
  fastForward,
  isOver,
  hearts,
  mailbox,
  places,
  sleep,
  talk,
  tick,
  type GameState,
  type PlaceId,
  type Text,
} from '@uk-immigration/game';
import {
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
  Dialogue,
  Fishing,
  Inventory,
  Kitchen,
  Mailbox,
  MorningCard,
  OutcomeText,
  PlotMenu,
  Shop,
  TravelCard,
} from './life-overlays';
import { gameStorage, withGameLocale } from './session';
import {
  hideSound,
  playSound,
  readMuted,
  setMuted as saveMuted,
  setSoundSeason,
  stopSound,
  unlockSound,
} from './sound';
import TownCanvas from './town-canvas';
import type { Interaction, SceneFeedback } from './scene';
import { recordMemories, type DayMemory, type ChangeSource } from './diary';
import styles from './game.module.css';
import site from '../site.module.css';
type Overlay =
  | { kind: 'place'; id: PlaceId }
  | { kind: 'dialogue'; id: string }
  | { kind: 'plot'; id: number }
  | { kind: 'bag' }
  | { kind: 'kitchen' }
  | { kind: 'mailbox' }
  | { kind: 'fishing' }
  | { kind: 'detail'; id: RuleSetId };
export default function GameClient() {
  const { t, locale } = useTranslation();
  const [state, setState] = useState<GameState>();
  const [saves, setSaves] = useState<Record<string, GameState | undefined>>({});
  const [ready, setReady] = useState(false),
    [sceneReady, setSceneReady] = useState(false),
    [available, setAvailable] = useState(true);
  const [overlay, setOverlay] = useState<Overlay>();
  const [outcomeText, setOutcomeText] = useState<Text>();
  const [feedback, setFeedback] = useState<SceneFeedback>();
  const [returned, setReturned] = useState<GameState['trip']>();
  const diary = useRef<DayMemory[]>([]);
  const quarterStart = useRef<GameState['stats'] | undefined>(undefined);
  const openOverlay = (next?: Overlay) => {
    setOutcomeText(undefined);
    setOverlay(next);
  };
  const [morning, setMorning] = useState(false),
    [summary, setSummary] = useState<StateChange>();
  const [confirmation, setConfirmation] = useState<'sleep' | 'fast'>();
  const [routine, setRoutine] = useState<'sleep' | 'fast'>();
  const [fading, setFading] = useState(false),
    [interior, setInterior] = useState(true),
    [hidden, setHidden] = useState(false),
    [muted, setMuted] = useState(true);
  const [destination, setDestination] = useState<{
    location: PlaceId;
    request: number;
  }>();
  const [interaction, setInteraction] = useState<Interaction>();
  const [approachNpc, setApproachNpc] = useState<{
    id: string;
    request: number;
  }>();
  const [interactRequest, setInteractRequest] = useState(0);
  const latest = useRef(state);
  latest.current = state;
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  useEffect(() => {
    const loaded = characters.map((c) => [c.id, gameStorage(c.id)] as const);
    setSaves(Object.fromEntries(loaded.map(([id, s]) => [id, s.state])));
    setAvailable(loaded.every(([, s]) => s.available));
    setMuted(readMuted());
    saveMuted(readMuted());
    setReady(true);
    const visibility = () => {
      setHidden(document.hidden);
      hideSound(document.hidden);
    };
    document.addEventListener('visibilitychange', visibility);
    visibility();
    return () => {
      document.removeEventListener('visibilitychange', visibility);
      clearTimeout(fadeTimer.current);
      stopSound();
    };
  }, []);
  useEffect(() => {
    if (state && state.locale !== locale)
      setState(withGameLocale(state, locale));
  }, [state, locale]);
  useEffect(() => {
    if (!ready || !state || state.locale !== locale) return;
    setAvailable(
      gameStorage(state.characterId, state, diary.current, quarterStart.current)
        .available,
    );
    setSaves((prev) => ({ ...prev, [state.characterId]: state }));
  }, [state, ready, locale]);
  useEffect(() => {
    if (state && !isOver(state))
      setSoundSeason(state.quarter, !!state.day.festival);
    else stopSound();
  }, [state?.quarter, state?.day.festival, state?.ending, !!state]);
  const current = state && withGameLocale(state, locale),
    event = current && currentEvent(current);
  const paused = !!(
    !sceneReady ||
    hidden ||
    overlay ||
    morning ||
    summary ||
    event ||
    confirmation ||
    fading ||
    routine ||
    returned ||
    current?.trip ||
    (current && isOver(current))
  );
  function apply(next: GameState, source: ChangeSource | 'resolve' = 'action') {
    const before = latest.current!;
    latest.current = next;
    setState(next);
    if (next === before) return;
    diary.current = recordMemories(
      diary.current,
      before,
      next,
      source === 'resolve' ? 'observe' : source,
    );
    const changedHearts = Object.fromEntries(
      Object.keys(next.friendship)
        .filter((id) => hearts(before, id) !== hearts(next, id))
        .map((id) => [
          id,
          { before: hearts(before, id), after: hearts(next, id) },
        ]),
    );
    const promotion = next.flags.some(
      (f) => f.startsWith('promotion-') && !before.flags.includes(f),
    );
    if (source === 'action' || source === 'resolve' || promotion) {
      const outcome =
        source === 'action'
          ? next.outcome
          : {
              kind: 'activity' as const,
              statDeltas: Object.fromEntries(
                Object.keys(next.stats).map((key) => [
                  key,
                  next.stats[key as keyof GameState['stats']] -
                    before.stats[key as keyof GameState['stats']],
                ]),
              ),
            };
      setFeedback((prev) => ({
        token: (prev?.token ?? 0) + 1,
        outcome,
        hearts: changedHearts,
        promotion,
      }));
      setOutcomeText(
        source === 'action'
          ? (next.outcome?.text ??
              (next.outcome?.items ? diary.current.at(-1)?.text : undefined))
          : undefined,
      );
    }
    if (source === 'action' || next.log.length > before.log.length) {
      playSound(
        next.achievements.length > before.achievements.length
          ? 'achievement'
          : next.outcome?.kind === 'buy'
            ? 'coin'
            : next.outcome?.kind === 'harvest'
              ? 'achievement'
              : 'menu',
      );
    }
    if (next.dayNumber !== before.dayNumber) {
      setInterior(true);
      setOverlay(undefined);
      setMorning(!isOver(next) && !next.trip);
      setDestination(undefined);
    }
    if (next.log.slice(before.log.length).some((e) => e.kind === 'quarter')) {
      setSummary({
        before,
        after: next,
        diary: diary.current,
        startStats: quarterStart.current,
      });
      quarterStart.current = { ...next.stats };
      setRoutine(undefined);
    }
    const absence = next.timeline.absences.at(-1);
    if (
      absence &&
      next.timeline.absences.length > before.timeline.absences.length &&
      (before.trip || source === 'action')
    )
      setReturned(absence);
    if (next.trip) {
      setMorning(false);
      setDestination(undefined);
    }
    if (next.pendingEvent || next.trip) openOverlay();
  }
  useEffect(() => {
    if (!current || paused || interior) return;
    const timer = setInterval(() => {
      const s = latest.current;
      if (s) apply(tick(s, 10), 'observe');
    }, 2000);
    return () => clearInterval(timer);
  }, [paused, interior, current?.characterId]);
  useEffect(() => {
    if (!state || !routine || state.pendingEvent || summary || fading) return;
    const next = routine === 'fast' ? fastForward(state) : sleep(state);
    if (next === state) {
      setRoutine(undefined);
      return;
    }
    apply(next, routine === 'fast' ? 'fast' : 'observe');
    if (routine === 'sleep' && next.dayNumber !== state.dayNumber)
      setRoutine(undefined);
  }, [state, routine, summary, fading]);
  useEffect(() => {
    if (
      !state ||
      state.day.minute < 1440 ||
      state.pendingEvent ||
      summary ||
      routine ||
      fading
    )
      return;
    setInterior(true);
    setOverlay(undefined);
    setRoutine('sleep');
  }, [state?.day.minute, state?.pendingEvent, summary, routine, fading]);
  const choose = (next?: GameState) => {
    latest.current = next;
    const saved =
      next && saves[next.characterId]?.seed === next.seed
        ? gameStorage(next.characterId)
        : undefined;
    diary.current = saved?.diary ?? [];
    quarterStart.current = saved?.quarterStart ?? (next && { ...next.stats });
    setState(next);
    openOverlay();
    setFeedback(undefined);
    setReturned(undefined);
    setSummary(undefined);
    setRoutine(undefined);
    setDestination(undefined);
    setSceneReady(false);
    setMorning(!!next && !next.trip && next.day.minute === 420);
    setInterior(next?.day.place === 'home');
  };
  const startTalk = (npc: string) => {
    try {
      const next = talk(latest.current!, npc);
      openOverlay();
      apply(next);
      if (!next.pendingEvent) setOverlay({ kind: 'dialogue', id: npc });
    } catch {
      openOverlay({ kind: 'dialogue', id: npc });
      setOutcomeText({
        zhCN: '今天太晚了，明天再聊吧。',
        en: 'It is too late today. Let’s talk tomorrow.',
      });
    }
  };
  const visit = (id: PlaceId) => {
    const next = enter(latest.current!, id);
    apply(next, 'observe');
    if (id === 'home') {
      setInterior(true);
      setOverlay(undefined);
    } else if (!next.pendingEvent) openOverlay({ kind: 'place', id });
  };
  const walkTo = (location: PlaceId) => {
    setOverlay(undefined);
    setDestination((prev) => ({ location, request: (prev?.request ?? 0) + 1 }));
  };
  const interact = (target: Interaction) => {
    playSound('menu');
    switch (target.kind) {
      case 'place':
        visit(target.id);
        break;
      case 'npc':
        startTalk(target.id);
        break;
      case 'plot':
        apply(enter(latest.current!, 'allotment'), 'observe');
        openOverlay({ kind: 'plot', id: target.id });
        break;
      case 'home':
        if (target.id === 'exit') {
          setInterior(false);
          setState((s) => s && { ...s, day: { ...s.day, place: undefined } });
        } else if (target.id === 'bed') setConfirmation('sleep');
        else if (target.id === 'desk')
          openOverlay({ kind: 'place', id: 'home' });
        else openOverlay({ kind: target.id });
    }
  };
  const beginRoutine = () => {
    const which = confirmation!;
    setConfirmation(undefined);
    setOverlay(undefined);
    setFading(true);
    fadeTimer.current = setTimeout(() => {
      setInterior(true);
      setFading(false);
      setRoutine(which);
    }, 280);
  };
  const title = () => {
    if (!overlay) return '';
    if (overlay.kind === 'place')
      return localText(places.find((p) => p.id === overlay.id)!.name, locale);
    if (overlay.kind === 'plot')
      return t('game.plot').replace('{count}', String(overlay.id + 1));
    if (overlay.kind === 'detail') return t('game.progressChanges');
    return t(
      overlay.kind === 'bag'
        ? 'game.bag'
        : overlay.kind === 'kitchen'
          ? 'game.kitchen'
          : overlay.kind === 'mailbox'
            ? 'game.mailbox'
            : overlay.kind === 'fishing'
              ? 'game.fish'
              : 'game.talk',
    );
  };
  const close = () => openOverlay();
  return (
    <div
      className={styles.game}
      onPointerDownCapture={unlockSound}
      onKeyDownCapture={unlockSound}
    >
      {!ready ? (
        <p role="status">{t('game.loading')}</p>
      ) : !current ? (
        <CharacterSelect saves={saves} onChange={choose} />
      ) : (
        <>
          {isOver(current) && !summary ? (
            <Ending state={current} onChange={choose} />
          ) : (
            <>
              <StatusBar state={current}>
                <button
                  className={styles.music}
                  aria-pressed={!muted}
                  onClick={() => {
                    setMuted(!muted);
                    saveMuted(!muted);
                  }}
                >
                  {t(muted ? 'game.muted' : 'game.unmuted')}
                </button>
                <button
                  className={styles.music}
                  disabled={paused}
                  onClick={() => setConfirmation('fast')}
                >
                  {t('game.fastForward')}
                </button>
                <button
                  className={styles.music}
                  disabled={paused}
                  onClick={() => setConfirmation('sleep')}
                >
                  {t('game.endDay')}
                </button>
              </StatusBar>
              <div className={`${styles.map} ${fading ? styles.fading : ''}`}>
                {current.trip || returned ? (
                  <TravelCard
                    state={current}
                    returned={returned}
                    onContinue={() => {
                      if (returned) setReturned(undefined);
                      else apply(fastForward(current), 'fast');
                    }}
                  />
                ) : (
                  <TownCanvas
                    key={`${current.characterId}:${current.seed}`}
                    state={current}
                    feedback={feedback}
                    approachNpc={approachNpc}
                    focusNpc={
                      event?.heart?.npc ??
                      (overlay?.kind === 'dialogue' ? overlay.id : undefined)
                    }
                    locale={locale}
                    paused={paused}
                    interior={interior}
                    onReady={() => setSceneReady(true)}
                    onInteract={interact}
                    onNearby={setInteraction}
                    destination={destination}
                    interactRequest={interactRequest}
                    onStep={() => playSound('step')}
                  />
                )}
                {!sceneReady && !current.trip && !returned && (
                  <p className={styles.loading} role="status">
                    {t('game.loading')}
                  </p>
                )}
                {!!interaction && !paused && (
                  <button
                    className={styles.interactButton}
                    onClick={() => setInteractRequest((n) => n + 1)}
                  >
                    {t('game.interact')}
                  </button>
                )}
                {!!mailbox(current).length && (
                  <span
                    className={styles.mailBadge}
                    aria-label={t('game.mailCount').replace(
                      '{count}',
                      String(mailbox(current).length),
                    )}
                  >
                    ✉ {mailbox(current).length}
                  </span>
                )}
              </div>
              <p className={styles.controls}>{t('game.controls')}</p>
              <div className={styles.toolbar}>
                <button
                  className={site.secondary}
                  disabled={paused}
                  onClick={() => openOverlay({ kind: 'bag' })}
                >
                  {t('game.bag')} / {t('game.friends')}
                </button>
                <button
                  className={site.secondary}
                  disabled={paused}
                  onClick={() => choose(undefined)}
                >
                  {t('game.changeCharacter')}
                </button>
              </div>
              <nav
                className={styles.destinations}
                aria-label={t('game.destinations')}
                inert={paused}
              >
                {places.map((p) => (
                  <button
                    key={p.id}
                    disabled={paused}
                    onClick={() => walkTo(p.id)}
                  >
                    {localText(p.name, locale)}
                  </button>
                ))}
              </nav>
              <ProgressBars
                state={current}
                onOpen={(id) => {
                  if (!paused) openOverlay({ kind: 'detail', id });
                }}
              />
            </>
          )}
          {(sceneReady || current.trip || returned) &&
            (summary ? (
              <Modal key="summary" title={t('game.quarterSummary')}>
                <QuarterSummary
                  diary={summary.diary}
                  startStats={summary.startStats}
                  before={withGameLocale(summary.before, locale)}
                  after={withGameLocale(summary.after, locale)}
                  onContinue={() => setSummary(undefined)}
                  onVisit={() => {
                    setSummary(undefined);
                    setMorning(false);
                    walkTo('council');
                  }}
                />
              </Modal>
            ) : morning ? (
              <Modal
                key={`morning-${current.dayNumber}`}
                title={t('game.morning')}
              >
                <MorningCard
                  state={current}
                  onContinue={() => setMorning(false)}
                />
              </Modal>
            ) : event ? (
              <Modal
                key={`event-${event.id}`}
                title={localText(event.title, locale)}
                dialogue={!!(event.speaker || event.heart)}
              >
                {event.speaker || event.heart ? (
                  <Dialogue
                    state={current}
                    npc={event.speaker ?? event.heart!.npc}
                    heartChange={
                      feedback?.hearts?.[event.speaker ?? event.heart!.npc]
                    }
                    onChange={(next) => apply(next, 'resolve')}
                    onClose={close}
                  />
                ) : (
                  <EventCard
                    state={current}
                    onChange={(next) => apply(next, 'resolve')}
                  />
                )}{' '}
                {routine === 'fast' && <p>{t('game.continueFast')}</p>}
              </Modal>
            ) : confirmation ? (
              <Modal
                key="confirm"
                title={t(
                  confirmation === 'sleep' ? 'game.sleep' : 'game.fastForward',
                )}
                onClose={() => setConfirmation(undefined)}
              >
                <p>
                  {t(
                    confirmation === 'sleep'
                      ? 'game.sleepConfirm'
                      : 'game.fastConfirm',
                  )}
                </p>
                <div className={styles.buttons}>
                  <button className={site.button} onClick={beginRoutine}>
                    {t('game.confirm')}
                  </button>
                  <button
                    className={site.secondary}
                    onClick={() => setConfirmation(undefined)}
                  >
                    {t('game.cancel')}
                  </button>
                </div>
              </Modal>
            ) : overlay ? (
              <Modal
                key={overlay.kind + ('id' in overlay ? overlay.id : '')}
                title={title()}
                onClose={close}
                dialogue={overlay.kind === 'dialogue'}
                wide={overlay.kind === 'place' && overlay.id === 'council'}
              >
                {overlay.kind === 'place' ? (
                  <LocationMenu
                    state={current}
                    location={overlay.id}
                    onChange={(next) => {
                      apply(next);
                      if (!next.pendingEvent) setOverlay(undefined);
                    }}
                    onTalk={(id) => {
                      if (interior) {
                        openOverlay();
                        setApproachNpc((prev) => ({
                          id,
                          request: (prev?.request ?? 0) + 1,
                        }));
                      } else startTalk(id);
                    }}
                  >
                    {(overlay.id === 'shop' || overlay.id === 'green') && (
                      <Shop
                        state={current}
                        place={overlay.id}
                        onChange={apply}
                      />
                    )}
                    {overlay.id === 'pond' && (
                      <button
                        className={site.button}
                        onClick={() => openOverlay({ kind: 'fishing' })}
                      >
                        {t('game.fish')}
                      </button>
                    )}
                    {overlay.id === 'home' && (
                      <div className={styles.buttons}>
                        <button
                          className={site.secondary}
                          onClick={() => openOverlay({ kind: 'kitchen' })}
                        >
                          {t('game.kitchen')}
                        </button>
                        <button
                          className={site.secondary}
                          onClick={() => openOverlay({ kind: 'mailbox' })}
                        >
                          {t('game.mailbox')}
                        </button>
                        <button
                          className={site.secondary}
                          onClick={() => setConfirmation('sleep')}
                        >
                          {t('game.sleep')}
                        </button>
                      </div>
                    )}
                  </LocationMenu>
                ) : overlay.kind === 'dialogue' ? (
                  <Dialogue
                    state={current}
                    npc={overlay.id}
                    feedbackText={outcomeText}
                    heartChange={feedback?.hearts?.[overlay.id]}
                    onChange={apply}
                    onClose={close}
                  />
                ) : overlay.kind === 'bag' ? (
                  <Inventory
                    state={current}
                    onChange={apply}
                    onKitchen={() => {
                      if (interior) openOverlay({ kind: 'kitchen' });
                      else walkTo('home');
                    }}
                  />
                ) : overlay.kind === 'kitchen' ? (
                  <Kitchen state={current} onChange={apply} />
                ) : overlay.kind === 'mailbox' ? (
                  <Mailbox
                    state={current}
                    onChange={(next) => apply(next, 'observe')}
                  />
                ) : overlay.kind === 'plot' ? (
                  <PlotMenu
                    state={current}
                    plot={overlay.id}
                    onChange={apply}
                  />
                ) : overlay.kind === 'fishing' ? (
                  <Fishing state={current} onChange={apply} />
                ) : (
                  <ProgressDetail
                    state={current}
                    id={overlay.id}
                    onVisit={() => walkTo('council')}
                  />
                )}
                {overlay.kind !== 'dialogue' && (
                  <OutcomeText text={outcomeText} />
                )}
              </Modal>
            ) : null)}
        </>
      )}
      <p className={styles.saveStatus} role="status">
        {t(available ? 'game.saved' : 'game.storageUnavailable')}
      </p>
      <p className={styles.disclaimer}>
        {t('game.disclaimer')}
      </p>
    </div>
  );
}
