import { evaluate, type Locale, type RuleSetId } from '@uk-immigration/engine';
import {
  characters,
  changedRules,
  currentCard,
  TURNS,
  type GameState,
} from '@uk-immigration/game';
import { displayedRuleSets } from '../../lib/policy';
import { createDraft, type Draft } from '../../lib/questionnaire';

const gameKey = 'uk-immigration-game-v1';

export function withGameLocale(state: GameState, locale: Locale): GameState {
  if (state.locale === locale) return state;
  return {
    ...state,
    locale,
    result: evaluate({
      simulationDate: state.simulationDate,
      timeline: state.timeline,
      locale,
    }),
  };
}

// Storage is the only external input boundary; an unavailable save never blocks play.
export function gameStorage(next?: GameState | null): {
  state: GameState | undefined;
  available: boolean;
} {
  try {
    if (next === null) {
      localStorage.removeItem(gameKey);
      return { state: undefined, available: true };
    }
    if (next) {
      localStorage.setItem(gameKey, JSON.stringify(next));
      return { state: next, available: true };
    }
    const saved = localStorage.getItem(gameKey);
    if (!saved) return { state: undefined, available: true };
    const state: GameState = JSON.parse(saved);
    if (
      !state ||
      !characters.some((character) => character.id === state.characterId) ||
      !Number.isInteger(state.seed) ||
      !Number.isInteger(state.turn) ||
      state.turn < 1 ||
      state.turn > TURNS ||
      !['luck', 'choice', 'ended'].includes(state.phase) ||
      !['zh-CN', 'en'].includes(state.locale) ||
      !Array.isArray(state.drawnLuck) ||
      !Array.isArray(state.log) ||
      !state.log.every(
        (entry) => entry?.before?.byRuleSet && entry?.after?.byRuleSet,
      )
    )
      return { state: undefined, available: false };
    state.result = evaluate({
      simulationDate: state.simulationDate,
      timeline: state.timeline,
      locale: state.locale,
    });
    currentCard(state);
    return { state, available: true };
  } catch {
    return { state: next ?? undefined, available: false };
  }
}

export function gameDraft(state: GameState): Draft {
  return {
    ...createDraft(),
    timeline: state.timeline,
    simulationDate: state.simulationDate,
    completed: true,
    screening: {
      criminality: state.timeline.criminalRecord.length ? 'yes' : 'no',
      breach: state.timeline.immigrationBreaches.length ? 'yes' : 'no',
      debt: state.timeline.governmentDebt?.outstanding ? 'yes' : 'no',
    },
  };
}

export function mostChangedRules(state: GameState) {
  const counts = new Map<
    string,
    { id: string; ruleSetId: RuleSetId; count: number }
  >();
  for (const entry of state.log) {
    for (const ruleSet of displayedRuleSets) {
      for (const change of changedRules(
        entry.before,
        entry.after,
        ruleSet.id,
      )) {
        const key = `${ruleSet.id}:${change.id}`;
        const item = counts.get(key) ?? {
          id: change.id,
          ruleSetId: ruleSet.id,
          count: 0,
        };
        item.count++;
        counts.set(key, item);
      }
    }
  }
  return [...counts.values()].sort((a, b) => b.count - a.count).slice(0, 3);
}
