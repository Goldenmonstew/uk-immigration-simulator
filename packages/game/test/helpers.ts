import {
  activities,
  doActivity,
  enter,
  fastForward,
  currentEvent,
  resolve,
  newGame,
  sleep,
  tick,
} from '../src';
import { locationActions, places } from '../src/locations';
import type { GameState } from '../src';

export function clear(state = newGame('skilled-worker', 1)): GameState {
  const next = structuredClone(state);
  delete next.pendingEvent;
  next.eventQueue = [];
  next.day.deliveries = [];
  return next;
}
/** Set up a unit scene at an open place; full-day tests use actual travel/time. */
export function perform(state: GameState, id: string) {
  const action = locationActions.find((a) => a.id === id)!;
  const next = structuredClone(state);
  next.day.minute = Math.max(
    places.find((p) => p.id === action.place)?.hours?.opens ?? 420,
    ...(action.when ?? []).map((c) =>
      'minuteMin' in c ? (c.minuteMin ?? 0) : 0,
    ),
  );
  next.day.done = next.day.done.filter((done) => done !== id);
  if (id === 'class' && next.day.kind === 'workday') next.day.minute = 1080;
  return doActivity(enter(next, action.place), id);
}
export const availableActivities = (state: GameState) =>
  places.flatMap((p) =>
    activities(
      { ...state, day: { ...state.day, minute: p.hours?.opens ?? 420 } },
      p.id,
    ),
  );
/** Isolate the unchanged financial accounting from optional daily routines. */
export function quarter(state: GameState) {
  return sleep({
    ...state,
    day: { ...state.day, index: 2, kind: 'special', minute: 1260 },
  });
}
export function firstPending(state: GameState) {
  let next = state;
  const date = state.date;
  while (!currentEvent(next) && !next.ending && next.date === date) {
    next = tick(next, Math.max(0, 600 - next.day.minute));
    if (!currentEvent(next)) next = sleep(next);
  }
  return next;
}
export function drain(state: GameState) {
  let next = state;
  for (let i = 0; currentEvent(next); i++) {
    if (i > 30) throw new Error('Event loop');
    const choices = currentEvent(next)!.choices.filter(
      (c) =>
        !c.effects.some((e) => e.type === 'criminal' || e.type === 'ending'),
    );
    next = resolve(next, choices[0].id);
  }
  return next;
}
export function completeQuarter(state: GameState) {
  let next = drain(state);
  const date = state.date;
  for (let i = 0; !next.ending && next.date === date; i++) {
    if (i > 50) throw new Error('Quarter loop');
    next = drain(fastForward(next));
  }
  return next;
}
