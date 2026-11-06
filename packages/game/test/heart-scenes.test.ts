import { describe, expect, test } from 'vitest';
import { currentEvent, newGame, npcs, resolve, talk } from '../src';
import type { GameEvent, StatKey } from '../src';
import { balance as b } from '../src/balance';
import { heartEvents } from '../src/npcs';
import { clear } from './helpers';

function beforeScene(event: GameEvent) {
  const npc = npcs.find((person) => person.id === event.heart!.npc)!;
  const state = clear(newGame(npc.characters?.[0] ?? 'skilled-worker', 1));
  state.stats = { money: 5000, mood: 50, health: 50, english: 50, career: 50 };
  state.friendship[npc.id] = event.heart!.hearts * 100 - b.talkFriendship;
  state.firedEvents = heartEvents.filter((e) => e !== event).map((e) => e.id);
  state.flags = [...(event.requires ?? [])];
  state.quarter = event.season ?? state.quarter;
  state.day.minute = 600;
  for (const condition of event.when ?? []) {
    if ('dayKind' in condition) state.day.kind = condition.dayKind;
    if ('weather' in condition) state.day.weather = condition.weather;
    if ('festival' in condition) state.day.festival = condition.festival;
    if ('flag' in condition) state.flags.push(condition.flag);
    if ('minuteMin' in condition)
      state.day.minute = Math.max(
        state.day.minute,
        condition.minuteMin ?? state.day.minute,
      );
    if ('minuteMax' in condition)
      state.day.minute = Math.min(
        state.day.minute,
        condition.minuteMax ?? state.day.minute,
      );
  }
  return state;
}

describe('10.1 complete heart scenes', () => {
  test('every person has exactly one scene at each of the five thresholds', () => {
    expect(heartEvents).toHaveLength(60);
    expect(new Set(heartEvents.map((event) => event.id)).size).toBe(60);
    for (const npc of npcs) {
      const scenes = heartEvents.filter((event) => event.heart?.npc === npc.id);
      expect(
        scenes.map((event) => event.heart!.hearts).sort((a, b) => a - b),
        npc.id,
      ).toEqual([2, 4, 6, 8, 10]);
      for (const event of scenes)
        expect(event.id).toBe(`heart-${npc.id}-${event.heart!.hearts}`);
    }
  });

  test.each(heartEvents.map((event) => [event.id, event] as const))(
    '%s is a short, bilingual scene with concrete choices and life effects',
    (_id, event) => {
      const paragraphs = event.text.zhCN.split('\n');
      expect(paragraphs.length).toBeGreaterThanOrEqual(3);
      expect(paragraphs.length).toBeLessThanOrEqual(5);
      for (const paragraph of paragraphs) {
        expect(paragraph.trim()).not.toBe('');
        expect(paragraph.length).toBeLessThanOrEqual(40);
      }
      const length = paragraphs.join('').length;
      expect(length).toBeGreaterThanOrEqual(80);
      expect(length).toBeLessThanOrEqual(160);
      const english = event.text.en.split('\n');
      expect(english).toHaveLength(paragraphs.length);
      expect(english.every((paragraph) => paragraph.trim() !== '')).toBe(true);
      expect(event.title.zhCN.length).toBeLessThanOrEqual(10);
      expect(event.title.en.trim()).not.toBe('');
      expect(event.choices.length).toBeGreaterThanOrEqual(2);
      expect(event.choices.length).toBeLessThanOrEqual(3);
      expect(event.once).toBe(true);
      expect(event.channel).toBe(`npc:${event.heart!.npc}`);
      for (const choice of event.choices) {
        expect(choice.label.zhCN.trim()).not.toBe('');
        expect(choice.label.zhCN).not.toContain('收好这一刻的小东西');
        expect(choice.label.en.trim()).not.toBe('');
        expect(
          choice.effects.every((effect) =>
            ['stat', 'friendship', 'none'].includes(effect.type),
          ),
        ).toBe(true);
      }
    },
  );

  test.each(heartEvents.map((event) => [event.id, event] as const))(
    '%s becomes available at its threshold, applies each choice, and stays completed',
    (_id, event) => {
      const npc = event.heart!.npc;
      const below = beforeScene(event);
      below.friendship[npc]--;
      expect(talk(below, npc).pendingEvent).toBeUndefined();

      for (const choice of event.choices) {
        const before = beforeScene(event);
        const pending = talk(before, npc);
        expect(currentEvent(pending)?.id).toBe(event.id);
        expect(pending.friendship[npc]).toBe(event.heart!.hearts * 100);
        expect(before.pendingEvent).toBeUndefined();
        const after = resolve(pending, choice.id);
        expect(after.timeline).toEqual(before.timeline);
        expect(after.inventory).toEqual(before.inventory);
        expect(after.log.at(-1)).toMatchObject({
          kind: 'event',
          id: event.id,
          choiceId: choice.id,
        });
        for (const key of Object.keys(pending.stats) as StatKey[]) {
          const delta = choice.effects.reduce(
            (sum, effect) =>
              sum +
              (effect.type === 'stat' && effect.key === key ? effect.delta : 0),
            0,
          );
          expect(after.stats[key]).toBe(pending.stats[key] + delta);
        }
        const friendship = choice.effects.reduce(
          (sum, effect) =>
            sum +
            (effect.type === 'friendship' && effect.npc === npc
              ? effect.delta
              : 0),
          0,
        );
        expect(after.friendship[npc]).toBe(
          Math.min(b.friendshipMax, pending.friendship[npc] + friendship),
        );
        for (const flag of choice.sets ?? [])
          expect(after.flags).toContain(flag);
        expect(after.firedEvents.filter((id) => id === event.id)).toHaveLength(
          1,
        );
        const restored = JSON.parse(JSON.stringify(after));
        expect(talk(restored, npc).pendingEvent).toBeUndefined();
      }
    },
  );
});
