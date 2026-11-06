import { describe, expect, test } from 'vitest';
import { characters, enter, readMail, resolve, tick } from '../src';
import type { GameEvent, PlaceId } from '../src';
import { skilledWorkerAdditions } from '../src/characters/skilled-worker-additions';
import { festivalEvents, noticeEvents } from '../src/events/days';
import { placeEvents } from '../src/events/places';
import { clear } from './helpers';

const outdoor = [
  ...placeEvents.filter((event) =>
    /-(pond|allotment)-|bench-(crossword|drawing)$/.test(event.id),
  ),
  noticeEvents.find((event) => event.id === 'town-board-litter')!,
  skilledWorkerAdditions.find((event) => event.id === 'sw-town-plant-shadow')!,
];

function delivery(event: GameEvent, minute: number) {
  const state = clear();
  state.flags.push(...(event.requires ?? []));
  state.day.minute = minute;
  state.day.kind = 'weekend';
  state.day.weather = 'sunny';
  state.day.deliveries = [{ eventId: event.id, channel: event.channel! }];
  return state;
}

describe('10.4b card timing and continuity', () => {
  test('the ten outdoor scenes stop at dusk and remain available before it', () => {
    expect(outdoor).toHaveLength(10);
    for (const event of outdoor) {
      const place = event.channel!.slice(6) as PlaceId;
      const night = delivery(event, 1081);
      expect(enter(night, place).pendingEvent, event.id).toBeUndefined();
      expect(night.firedEvents).not.toContain(event.id);
      expect(enter(delivery(event, 1080), place).pendingEvent).toBe(event.id);
    }
  });

  test.each(['christmas-market', 'bonfire-night'] as const)(
    '%s retains its early scene in the second year',
    (festival) => {
      const event = festivalEvents.find(
        (card) =>
          card.when?.some(
            (condition) =>
              'festival' in condition && condition.festival === festival,
          ) && card.when?.some((condition) => 'yearMax' in condition),
      )!;
      const state = delivery(event, 1080);
      state.year = 2;
      state.quarter = 4;
      state.day.kind = 'special';
      state.day.festival = festival;
      expect(enter(state, 'green').pendingEvent).toBe(event.id);
      state.year = 3;
      expect(enter(state, 'green').pendingEvent).toBeUndefined();
    },
  );

  test.each(['lantern', 'star'])(
    'Christmas %s waits until the activity starts',
    (id) => {
      const event = festivalEvents.find(
        (card) => card.id === `town-festival-christmas-market-${id}`,
      )!;
      const state = delivery(event, 959);
      state.year = id === 'lantern' ? 1 : 5;
      state.quarter = 4;
      state.day.kind = 'special';
      state.day.festival = 'christmas-market';
      expect(enter(state, 'green').pendingEvent).toBeUndefined();
      state.day.minute = 960;
      expect(enter(state, 'green').pendingEvent).toBe(event.id);
    },
  );

  test.each(['call-book', 'call-tap'])(
    '%s is heard before the distant evening ends',
    (id) => {
      const event = skilledWorkerAdditions.find(
        (card) => card.id === `sw-partner-${id}`,
      )!;
      expect(tick(delivery(event, 901), 0).pendingEvent).toBeUndefined();
      expect(tick(delivery(event, 900), 0).pendingEvent).toBe(event.id);
    },
  );

  test('ending the partnership suppresses the two arrival memories', () => {
    const event = characters[0].events.find(
      (card) => card.id === 'sw-partner-space',
    )!;
    const before = clear();
    before.flags.push('partner-arrived');
    before.pendingEvent = event.id;
    const after = resolve(before, 'first');
    expect(before.flags).not.toContain('partner-separated');
    expect(after.flags).toContain('partner-separated');
    for (const card of skilledWorkerAdditions.filter((entry) =>
      entry.id.startsWith('sw-partner-arrival-'),
    )) {
      const state = delivery(card, 780);
      const deliver =
        card.channel === 'letter' ? readMail : (s: typeof state) => tick(s, 0);
      expect(deliver(state).pendingEvent).toBe(card.id);
      state.flags.push('partner-separated');
      expect(deliver(state).pendingEvent).toBeUndefined();
    }
  });

  test('second choices keep their reward size and change only the life stat for their place', () => {
    const events = [
      ...placeEvents,
      ...noticeEvents,
      ...festivalEvents,
      ...skilledWorkerAdditions.filter(
        (event) =>
          event.id.startsWith('sw-town-') || event.id.startsWith('sw-work-'),
      ),
    ];
    for (const event of events) {
      const place = event.channel!.slice(6);
      const expected = ['gp', 'pond', 'allotment', 'green', 'bench'].includes(
        place,
      )
        ? 'health'
        : ['college', 'library', 'cafe', 'pub', 'board'].includes(place)
          ? 'english'
          : place === 'council' || place === 'work'
            ? 'career'
            : 'mood';
      const choice = event.choices[1];
      expect(choice.effects, event.id).toEqual([
        { type: 'stat', key: expected, delta: 2 },
      ]);
      const before = clear();
      before.stats[expected] = 50;
      before.pendingEvent = event.id;
      const after = resolve(before, choice.id);
      expect(after.stats[expected] - before.stats[expected], event.id).toBe(2);
      expect(after.timeline).toEqual(before.timeline);
    }
  });
});
