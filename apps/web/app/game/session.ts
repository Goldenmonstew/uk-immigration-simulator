import { evaluate, type Locale } from '@uk-immigration/engine';
import {
  characters,
  currentEvent,
  isOver,
  npcAt,
  townsfolk,
  visaMonthsLeft,
  type GameState,
  type StatKey,
} from '@uk-immigration/game';
import { createDraft, type Draft } from '../../lib/questionnaire';
import type { DayMemory } from './diary';

export function visibleResidents(state: GameState, interior: boolean) {
  return townsfolk(state)
    .filter((npc) => npcAt(state, npc.id) !== 'away')
    .filter((npc) => (npcAt(state, npc.id) === 'home') === interior)
    .slice(0, 12);
}

export const homeSpot = (index: number) =>
  [
    { x: 5, y: 4 },
    { x: 11, y: 4 },
    { x: 5, y: 8 },
  ][index % 3];

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

export const statKeys: StatKey[] = [
  'money',
  'mood',
  'health',
  'english',
  'career',
];
const residentIds = [
  'skilled-worker',
  'hong-kong-bno',
  'family-partner',
  'margaret',
  'priya',
  'ade',
  'helen',
  'dave',
  'rahman',
  'lina',
  'gareth',
  'jamie',
  'ka-ning-partner',
  'ka-ning-child',
  'yao-flatmate',
];
export const spritePath = (id: string) =>
  `/game/assets/urban/${residentIds.includes(id) ? id : 'skilled-worker'}.png`;
export const cropIds = [
  'potato',
  'strawberry',
  'tomato',
  'cucumber',
  'turnip',
  'corn',
  'sunflower',
  'tulip',
];
export const itemIcon = (id: string) => {
  const crop = id.replace(/^seed-/, '');
  return cropIds.includes(crop)
    ? `/game/assets/crops/${crop}.png`
    : '/game/assets/indoor/item.png';
};
export const visaMonths = (state: GameState) =>
  Math.floor(visaMonthsLeft(state));

export function needsVisaReminder(state: GameState): boolean {
  if (isOver(state) || visaMonths(state) > 3) return false;
  const active = state.timeline.episodes
    .filter(
      (episode) =>
        episode.validFrom <= state.date && episode.validTo >= state.date,
    )
    .sort((a, b) => b.validFrom.localeCompare(a.validFrom))[0];
  if (!active) return true;
  const nextDay = new Date(Date.parse(active.validTo) + 86_400_000)
    .toISOString()
    .slice(0, 10);
  return !state.timeline.episodes.some(
    (episode) =>
      episode.validFrom > state.date &&
      episode.validFrom <= nextDay &&
      episode.validTo > active.validTo,
  );
}

// Storage is the external input boundary. Failed saves never interrupt play.
export function gameStorage(
  characterId: string,
  next?: GameState,
  diary: DayMemory[] = [],
  quarterStart?: GameState['stats'],
): {
  state: GameState | undefined;
  available: boolean;
  diary?: DayMemory[];
  quarterStart?: GameState['stats'];
} {
  try {
    const key = `uk-immigration-life-v3:${characterId}`;
    if (next) {
      localStorage.setItem(
        key,
        JSON.stringify({ ...next, clientVersion: 1, diary, quarterStart }),
      );
      return { state: next, available: true };
    }
    const saved = localStorage.getItem(key);
    if (!saved) return { state: undefined, available: true };
    const {
      clientVersion,
      diary: savedDiary,
      quarterStart: savedStart,
      ...state
    }: GameState & {
      clientVersion?: number;
      diary?: DayMemory[];
      quarterStart?: GameState['stats'];
    } = JSON.parse(saved);
    // The earlier mock also used version 3; its saves are not real core saves.
    if (clientVersion !== 1) return { state: undefined, available: true };
    if (
      !state ||
      state.version !== 3 ||
      state.characterId !== characterId ||
      !characters.some((item) => item.id === characterId) ||
      !Number.isInteger(state.seed) ||
      !Number.isInteger(state.randomState) ||
      !Number.isInteger(state.year) ||
      state.year < 1 ||
      ![1, 2, 3, 4].includes(state.quarter) ||
      !Number.isInteger(state.dayNumber) ||
      state.dayNumber < 0 ||
      !state.day ||
      ![0, 1, 2].includes(state.day.index) ||
      !Number.isInteger(state.day.minute) ||
      state.day.minute < 420 ||
      state.day.minute > 1440 ||
      !['workday', 'weekend', 'special'].includes(state.day.kind) ||
      !['sunny', 'cloudy', 'rain', 'snow'].includes(state.day.weather) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(state.day.date) ||
      !state.inventory ||
      !state.friendship ||
      !Object.values(state.inventory).every(
        (n) => Number.isInteger(n) && n >= 0,
      ) ||
      !Object.values(state.friendship).every(
        (n) => Number.isFinite(n) && n >= 0 && n <= 1000,
      ) ||
      !Array.isArray(state.plots) ||
      !state.plots.every(
        (p) => p && Number.isFinite(p.growth) && p.growth >= 0,
      ) ||
      !Array.isArray(state.day.deliveries) ||
      !state.day.deliveries.every(
        (d) =>
          d &&
          typeof d.channel === 'string' &&
          currentEvent({ ...state, pendingEvent: d.eventId }),
      ) ||
      !['zh-CN', 'en'].includes(state.locale) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(state.date) ||
      !statKeys.every((key) => Number.isFinite(state.stats?.[key])) ||
      ![
        state.flags,
        state.firedEvents,
        state.achievements,
        state.eventQueue,
        state.heard,
        state.day.done,
        state.day.talked,
        state.day.gifted,
      ].every(
        (list) =>
          Array.isArray(list) && list.every((item) => typeof item === 'string'),
      ) ||
      !state.eventQueue.every((id) =>
        currentEvent({ ...state, pendingEvent: id }),
      ) ||
      !Array.isArray(state.log) ||
      !state.log.every(
        (entry) =>
          entry &&
          typeof entry.text?.zhCN === 'string' &&
          typeof entry.text?.en === 'string',
      ) ||
      (state.pendingEvent !== undefined && !currentEvent(state))
    )
      return { state: undefined, available: false };
    state.result = evaluate({
      simulationDate: state.date,
      timeline: state.timeline,
      locale: state.locale,
    });
    const validDiary =
      Array.isArray(savedDiary) &&
      savedDiary.every(
        (m) =>
          m &&
          Number.isInteger(m.year) &&
          [1, 2, 3, 4].includes(m.quarter) &&
          [0, 1, 2].includes(m.day) &&
          typeof m.key === 'string' &&
          Number.isInteger(m.count) &&
          m.count > 0 &&
          typeof m.text?.zhCN === 'string' &&
          typeof m.text?.en === 'string' &&
          Object.values(m.statDeltas ?? {}).every(Number.isFinite),
      );
    return {
      state,
      available: true,
      diary: validDiary ? savedDiary : [],
      quarterStart:
        savedStart && statKeys.every((key) => Number.isFinite(savedStart[key]))
          ? savedStart
          : state.stats,
    };
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
