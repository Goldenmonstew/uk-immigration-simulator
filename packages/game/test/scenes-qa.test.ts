import { describe, expect, test } from 'vitest';
import { currentEvent, newGame, npcs, resolve, sleep, talk } from '../src';
import type { GameEvent, GameState } from '../src';
import { heartEvents } from '../src/npcs';
import { clear } from './helpers';

function sceneState(event: GameEvent, minute: number): GameState {
  const state = clear(newGame('skilled-worker', 1));
  state.friendship[event.heart!.npc] = event.heart!.hearts * 100;
  state.flags = [...(event.requires ?? [])];
  state.firedEvents = heartEvents
    .filter((other) => other !== event)
    .map((other) => other.id);
  state.day.kind = 'workday';
  state.day.weather = 'sunny';
  state.day.minute = minute;
  delete state.day.festival;
  return state;
}

describe('10.4b scene contexts', () => {
  test.each([2, 4, 6, 8, 10])(
    'Ade %i hearts fits a workday tea break',
    (level) => {
      const event = heartEvents.find(
        (event) => event.id === `heart-ade-${level}`,
      )!;
      for (const minute of [540, 1019]) {
        const state = sceneState(event, minute);
        expect(currentEvent(talk(state, 'ade'))?.id).toBe(event.id);
      }
      for (const minute of [539, 1020]) {
        const state = sceneState(event, minute);
        expect(currentEvent(talk(state, 'ade'))).toBeUndefined();
      }
      const weekend = sceneState(event, 600);
      weekend.day.kind = 'weekend';
      expect(currentEvent(talk(weekend, 'ade'))).toBeUndefined();
    },
  );

  test.each([2, 4, 6, 8, 10])(
    'Rahman %i hearts stays within shop hours',
    (level) => {
      const event = heartEvents.find(
        (event) => event.id === `heart-rahman-${level}`,
      )!;
      for (const minute of [600, 1079]) {
        const state = sceneState(event, minute);
        expect(currentEvent(talk(state, 'rahman'))?.id).toBe(event.id);
      }
      for (const minute of [599, 1080]) {
        const state = sceneState(event, minute);
        expect(currentEvent(talk(state, 'rahman'))).toBeUndefined();
      }
    },
  );

  test('Dave opens his friendship without a quiz notice and can play the record before going home', () => {
    const first = heartEvents.find((event) => event.id === 'heart-dave-2')!;
    const state = sceneState(first, 720);
    state.friendship.dave = 1000;
    state.firedEvents = heartEvents
      .filter(
        (event) =>
          !['heart-dave-2', 'heart-dave-6', 'heart-dave-10'].includes(event.id),
      )
      .map((event) => event.id);
    expect(state.flags).not.toContain('quarter-board-pub-quiz');
    const introduction = talk(state, 'dave');
    expect(currentEvent(introduction)?.id).toBe('heart-dave-2');
    const friends = clear(sleep(resolve(introduction, 'stay')));
    expect(friends.flags).toContain('friend-dave');
    friends.day.minute = 1320;
    const record = talk(friends, 'dave');
    expect(currentEvent(record)?.id).toBe('heart-dave-6');
    let afterRecord = clear(sleep(resolve(record, 'stay')));
    if (afterRecord.day.festival) afterRecord = clear(sleep(afterRecord));
    const ending = talk(afterRecord, 'dave');
    expect(currentEvent(ending)?.id).toBe('heart-dave-10');
  });
});

test('family dialogue stops recalling an empty page or a continuing partnership after those states change', () => {
  for (const [npcId, lineId, character, required, forbidden] of [
    [
      'ka-ning-partner',
      'ka-ning-partner-daily-49',
      'hong-kong-bno',
      'family-album-started',
      'family-album-page',
    ],
    [
      'yao-flatmate',
      'yao-flatmate-daily-31',
      'skilled-worker',
      'partner-arrived',
      'partner-separated',
    ],
    [
      'yao-flatmate',
      'yao-flatmate-daily-32',
      'skilled-worker',
      'partner-arrived',
      'partner-separated',
    ],
  ]) {
    const npc = npcs.find((npc) => npc.id === npcId)!;
    const line = npc.lines.find((line) => line.id === lineId)!;
    const original = npc.lines;
    npc.lines = [
      line,
      { id: 'qa-fallback', text: { zhCN: '你好。', en: 'Hello.' } },
    ];
    try {
      const before = clear(newGame(character, 1));
      before.friendship[npcId] = 1000;
      before.day.minute = 1080;
      before.firedEvents = heartEvents.map((event) => event.id);
      before.heard = ['qa-fallback'];
      before.flags = [];
      expect(talk(before, npcId).outcome?.text?.en).toBe('Hello.');
      const during = { ...before, flags: [required] };
      expect(talk(during, npcId).outcome?.text).toEqual(line.text);
      const after = { ...during, flags: [required, forbidden] };
      expect(talk(after, npcId).outcome?.text?.en).toBe('Hello.');
    } finally {
      npc.lines = original;
    }
  }
});
