import { describe, expect, test } from 'vitest';
import {
  characters,
  currentEvent,
  enter,
  newGame,
  readMail,
  resolve,
  sleep,
  talk,
  tick,
} from '../src';
import type { Channel, Condition, GameEvent, GameState } from '../src';
import { commonEvents } from '../src/events/common';
import { balance as b } from '../src/balance';
import { heartEvents } from '../src/npcs';
import { clear } from './helpers';

function card(channel: Channel, when: Condition[] = []): GameEvent {
  return {
    id: 'day-fixture',
    channel,
    when,
    once: true,
    weight: 1,
    title: { zhCN: '消息', en: 'News' },
    text: { zhCN: '有消息。', en: 'Some news.' },
    choices: [{ id: 'ok', label: { zhCN: '好', en: 'OK' }, effects: [] }],
  };
}
function only(event: GameEvent, check: () => void) {
  const common = commonEvents.splice(0, commonEvents.length, event);
  const original = characters[0].events;
  characters[0].events = [];
  try {
    check();
  } finally {
    commonEvents.splice(0, commonEvents.length, ...common);
    characters[0].events = original;
  }
}
function queued(event: GameEvent, minute = 420): GameState {
  const state = clear();
  state.day.minute = minute;
  state.day.deliveries = [{ eventId: event.id, channel: event.channel! }];
  return state;
}

describe('day-aware event delivery', () => {
  test('weekend-only cards are drawn across twenty seeds and never arrive on another day', () => {
    const event = card('morning', [{ dayKind: 'weekend' }]);
    let count = 0;
    only(event, () => {
      for (let seed = 1; seed <= 20; seed++) {
        let state = newGame('skilled-worker', seed);
        expect(state.eventQueue).toContain(event.id);
        expect(state.pendingEvent).toBeUndefined();
        state = sleep(state);
        expect(state.day.kind).toBe('weekend');
        expect(currentEvent(state)?.id).toBe(event.id);
        count++;
      }
    });
    expect(count).toBeGreaterThan(0);
  });
  test.each(['work', 'gp'] as const)(
    '%s cards are scheduled only on open days and delivered within hours',
    (place) => {
      const event = card(`place:${place}`);
      only(event, () => {
        for (let seed = 1; seed <= 20; seed++) {
          const before = newGame('skilled-worker', seed);
          expect(before.day.deliveries.map((d) => d.eventId)).toContain(
            event.id,
          );
          expect(enter(before, place).pendingEvent).toBeUndefined();
          const after = enter(tick(before, 120), place);
          expect(after.day.kind).toBe('workday');
          expect(after.day.minute).toBe(540);
          expect(after.pendingEvent).toBe(event.id);
          const closed = queued(event, 1260);
          expect(enter(closed, place).pendingEvent).toBeUndefined();
          expect(sleep(closed).firedEvents).not.toContain(event.id);
          closed.day.kind = 'weekend';
          closed.day.minute = 600;
          expect(enter(closed, place).pendingEvent).toBeUndefined();
        }
      });
    },
  );
  test('home waits for a return from outside, or falls back at bedtime', () => {
    const event = card('place:home');
    only(event, () => {
      const before = queued(event);
      expect(tick(before, 0).pendingEvent).toBeUndefined();
      expect(enter(before, 'home').pendingEvent).toBeUndefined();
      expect(enter(enter(tick(before, 60), 'green'), 'home').pendingEvent).toBe(
        event.id,
      );
      const bedtime = queued(event, 1320);
      const delivered = sleep(bedtime);
      expect(delivered.pendingEvent).toBe(event.id);
      expect(delivered.day.place).toBe('home');
      expect(delivered.dayNumber).toBe(bedtime.dayNumber);
      expect(delivered.firedEvents).toContain(event.id);
    });
  });
  test('sleeping at home at 22:00 returns an unvisited pond card to the pool unfired', () => {
    const event = card('place:pond');
    only(event, () => {
      const before = queued(event, 1320);
      before.day.index = 2;
      before.day.kind = 'special';
      const after = sleep(before);
      expect(after.pendingEvent).toBeUndefined();
      expect(after.dayNumber).toBe(before.dayNumber + 1);
      expect(after.firedEvents).not.toContain(event.id);
      expect([
        ...after.eventQueue,
        ...after.day.deliveries.map((delivery) => delivery.eventId),
      ]).toContain(event.id);
      let revisited = after;
      for (let day = 0; day < 3 && !revisited.pendingEvent; day++) {
        revisited = enter(tick(revisited, 180), 'pond');
        if (!revisited.pendingEvent) revisited = sleep(revisited);
      }
      expect(currentEvent(revisited)?.id).toBe(event.id);
      expect(revisited.day.place).toBe('pond');
      expect(
        revisited.firedEvents.filter((id) => id === event.id),
      ).toHaveLength(1);
    });
  });
  test('a festival chat reaches the threshold but waits until the next ordinary day for the scene', () => {
    const event = heartEvents.find((scene) => scene.id === 'heart-helen-2')!;
    const before = clear();
    before.day.index = 2;
    before.day.kind = 'special';
    before.day.festival = 'lunar-new-year';
    before.day.minute = 600;
    before.friendship.helen = 200 - b.talkFriendship;
    const festival = talk(before, 'helen');
    expect(festival.friendship.helen).toBe(200);
    expect(festival.pendingEvent).toBeUndefined();
    expect(festival.firedEvents).not.toContain(event.id);
    const nextDay = clear(sleep(festival));
    expect(nextDay.day.kind).toBe('workday');
    expect(nextDay.day.festival).toBeUndefined();
    const ordinary = talk(nextDay, 'helen');
    expect(currentEvent(ordinary)?.id).toBe(event.id);
    expect(ordinary.firedEvents.filter((id) => id === event.id)).toHaveLength(
      1,
    );
  });
  test.each(['place:green', 'npc:ade'] as const)(
    '%s retains a card until its delivery window',
    (channel) => {
      const event = card(channel, [{ minuteMin: 720, minuteMax: 780 }]);
      only(event, () => {
        const before = queued(event, 600);
        const act = (s: GameState) =>
          channel.startsWith('npc:') ? talk(s, 'ade') : enter(s, 'green');
        const early = act(before);
        expect(early.pendingEvent).toBeUndefined();
        expect(early.day.deliveries).toHaveLength(1);
        expect(act(tick(early, 720 - early.day.minute)).pendingEvent).toBe(
          event.id,
        );
        expect(sleep(queued(event, 900)).firedEvents).not.toContain(event.id);
      });
    },
  );
  test('phone samples within the window and interrupts a clock jump at that minute', () => {
    const event = card('phone', [{ minuteMin: 800, minuteMax: 810 }]);
    only(event, () => {
      let state = newGame('skilled-worker', 3);
      while (!state.day.deliveries.length) state = sleep(state);
      const minute = state.day.deliveries[0].minute!;
      expect(minute).toBeGreaterThanOrEqual(800);
      expect(minute).toBeLessThanOrEqual(810);
      const after = tick(state, 900);
      expect(after.pendingEvent).toBe(event.id);
      expect(after.day.minute).toBe(minute);
    });
  });
  test.each(['morning', 'letter'] as const)(
    '%s accepts only windows containing 07:00',
    (channel) => {
      for (const minute of [420, 600]) {
        const event = card(channel, [{ minuteMin: minute, minuteMax: minute }]);
        only(event, () => {
          let state = newGame('skilled-worker', 1);
          for (let day = 0; day < 3; day++) {
            if (minute === 600) {
              expect(state.pendingEvent).toBeUndefined();
              expect(state.day.deliveries).toHaveLength(0);
            } else if (channel === 'letter' && state.day.deliveries.length) {
              state = readMail(tick(state, 300));
              expect(state.pendingEvent).toBe(event.id);
            }
            if (state.pendingEvent) state = resolve(state, 'ok');
            if (day < 2) state = sleep(state);
          }
          expect(state.firedEvents.includes(event.id)).toBe(minute === 420);
        });
      }
    },
  );
  test('weather and festival match the delivery day; impossible cards return unfired to the pool', () => {
    for (const when of [
      [{ weather: 'rain' }],
      [{ festival: 'lunar-new-year' }],
      [{ festival: 'may-day' }],
    ] as Condition[][]) {
      const event = card('morning', when);
      only(event, () => {
        let delivered = 0;
        for (let seed = 1; seed <= 20; seed++) {
          let state = newGame('skilled-worker', seed);
          for (let day = 0; day < 3; day++) {
            if (state.pendingEvent) {
              if ('weather' in when[0]) expect(state.day.weather).toBe('rain');
              else expect(state.day.festival).toBe('lunar-new-year');
              delivered++;
              state = resolve(state, 'ok');
            }
            if (day < 2) state = sleep(state);
          }
          expect(state.eventQueue).not.toContain(event.id);
          if ('festival' in when[0] && when[0].festival === 'may-day')
            expect(state.firedEvents).not.toContain(event.id);
        }
        expect(delivered > 0).toBe(
          !('festival' in when[0]) || when[0].festival !== 'may-day',
        );
      });
    }
  });
});
