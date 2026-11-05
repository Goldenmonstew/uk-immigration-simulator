'use client';

import { useEffect, useState } from 'react';
import { currentCard, isOver, type GameState } from '@uk-immigration/game';
import { jumpToAssessment } from '../../components/result-view';
import { useTranslation } from '../../i18n/locale';
import { GameView } from './game-view';
import { gameStorage, withGameLocale } from './session';
import site from '../site.module.css';

export default function GamePage() {
  const { t, locale } = useTranslation();
  const [state, setState] = useState<GameState>();
  const [ready, setReady] = useState(false);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    const stored = gameStorage();
    setState(stored.state);
    setAvailable(stored.available);
    setReady(true);
  }, []);

  useEffect(() => {
    if (state && state.locale !== locale)
      setState(withGameLocale(state, locale));
  }, [locale, state]);

  useEffect(() => {
    if (!ready) return;
    setAvailable(gameStorage(state ?? null).available);
  }, [ready, state]);

  const changeState = (next: GameState | undefined) => {
    setState(next);
    const heading =
      next && !isOver(next) && !currentCard(next)
        ? 'game-results-heading'
        : 'game-step';
    requestAnimationFrame(() => jumpToAssessment(heading));
  };

  return (
    <main id="main" className={site.main}>
      <p className={site.notice}>{t('game.disclaimer')}</p>
      {!ready ? (
        <p role="status">{t('result.loading')}</p>
      ) : (
        <>
          <GameView state={state} onChange={changeState} />
          <p className={site.muted} role="status">
            {t(available ? 'game.saved' : 'game.storageUnavailable')}
          </p>
        </>
      )}
    </main>
  );
}
