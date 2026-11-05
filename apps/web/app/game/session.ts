import { evaluate, type Locale } from '@uk-immigration/engine';
import { characters, statKeys, type GameState } from './mock-core';
import { createDraft, type Draft } from '../../lib/questionnaire';

export function withGameLocale(state: GameState, locale: Locale): GameState {
  if (state.locale === locale) return state;
  return {
    ...state,
    locale,
    result: evaluate({
      simulationDate: state.date,
      timeline: state.timeline,
      locale,
    }),
  };
}

// Storage is the external input boundary. Failed saves never interrupt play.
export function gameStorage(
  characterId: string,
  next?: GameState,
): { state: GameState | undefined; available: boolean } {
  try {
    const key = `uk-immigration-life-v2:${characterId}`;
    if (next) {
      localStorage.setItem(key, JSON.stringify(next));
      return { state: next, available: true };
    }
    const saved = localStorage.getItem(key);
    if (!saved) return { state: undefined, available: true };
    const state: GameState = JSON.parse(saved);
    if (
      !state ||
      state.version !== 2 ||
      state.characterId !== characterId ||
      !characters.some((item) => item.id === characterId) ||
      !Number.isInteger(state.seed) ||
      !Number.isInteger(state.year) ||
      state.year < 1 ||
      ![1, 2, 3, 4].includes(state.quarter) ||
      !Number.isInteger(state.actionsLeft) ||
      state.actionsLeft < 0 ||
      !['zh-CN', 'en'].includes(state.locale) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(state.date) ||
      !statKeys.every((key) => Number.isFinite(state.stats?.[key])) ||
      ![state.flags, state.firedEvents, state.achievements].every(
        (list) =>
          Array.isArray(list) && list.every((item) => typeof item === 'string'),
      ) ||
      !Array.isArray(state.log) ||
      !state.log.every(
        (entry) =>
          entry &&
          typeof entry.text?.zhCN === 'string' &&
          typeof entry.text?.en === 'string',
      ) ||
      (state.pendingEvent !== undefined &&
        !characters
          .find((item) => item.id === characterId)!
          .events.some((event) => event.id === state.pendingEvent))
    )
      return { state: undefined, available: false };
    state.result = evaluate({
      simulationDate: state.date,
      timeline: state.timeline,
      locale: state.locale,
    });
    return { state, available: true };
  } catch {
    return { state: next, available: false };
  }
}

export function gameDraft(state: GameState): Draft {
  return {
    ...createDraft(),
    timeline: state.timeline,
    simulationDate: state.date,
    completed: true,
    screening: {
      criminality: state.timeline.criminalRecord.length ? 'yes' : 'no',
      breach: state.timeline.immigrationBreaches.length ? 'yes' : 'no',
      debt: state.timeline.governmentDebt?.outstanding ? 'yes' : 'no',
    },
  };
}
