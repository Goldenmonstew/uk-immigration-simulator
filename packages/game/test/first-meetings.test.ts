import { describe, expect, test } from 'vitest';
import { currentEvent, newGame, npcs, resolve, sleep, talk } from '../src';
import { heartEvents } from '../src/npcs';
import { clear } from './helpers';

const introductions = npcs.filter(
  (npc) => !npc.characters || npc.id === 'yao-flatmate',
);

describe('10.5 first meetings and moving-in speech', () => {
  test.each(introductions)(
    '$id introduces themself only on the first chat',
    (npc) => {
      const introduction = npc.lines.find(
        (line) => line.id === `${npc.id}-intro`,
      )!;
      expect(introduction.text.zhCN.length).toBeLessThanOrEqual(40);
      expect(introduction.text.en.trim()).not.toBe('');
      for (const seed of [1, 17, 42]) {
        const before = clear(newGame('skilled-worker', seed));
        const first = talk(before, npc.id);
        expect(first.outcome?.text).toEqual(introduction.text);
        expect(first.heard).toContain(introduction.id);
        const second = talk(JSON.parse(JSON.stringify(first)), npc.id);
        expect(second.outcome?.text).not.toEqual(introduction.text);
        expect(
          second.heard.filter((id) => id === introduction.id),
        ).toHaveLength(1);
        const exhausted = {
          ...second,
          heard: npc.lines.map((line) => line.id),
        };
        expect(talk(exhausted, npc.id).outcome?.text).not.toEqual(
          introduction.text,
        );
        expect(before.flags).not.toContain(`talked-${npc.id}`);
      }
    },
  );

  test('family members have no introductions and existing acquaintances do not reintroduce themselves', () => {
    expect(introductions).toHaveLength(9);
    for (const npc of npcs.filter(
      (person) => person.characters && person.id !== 'yao-flatmate',
    ))
      expect(npc.lines.some((line) => line.id.endsWith('-intro'))).toBe(false);
    const state = clear();
    state.flags.push('talked-helen');
    expect(talk(state, 'helen').outcome?.text).not.toEqual(
      npcs
        .find((npc) => npc.id === 'helen')!
        .lines.find((line) => line.id === 'helen-intro')!.text,
    );
  });

  test.each([
    'yao-flatmate-intro',
    'yao-flatmate-daily-1',
    'yao-flatmate-daily-38',
  ])('%s stops after the first year', (id) => {
    const npc = npcs.find((npc) => npc.id === 'yao-flatmate')!;
    const line = npc.lines.find((line) => line.id === id)!;
    const original = npc.lines;
    const fallback = {
      id: 'fallback',
      text: { zhCN: '茶泡好了。', en: 'Tea is ready.' },
    };
    npc.lines = [line, fallback];
    try {
      const before = clear();
      before.heard = [fallback.id];
      expect(talk(before, npc.id).outcome?.text).toEqual(line.text);
      before.year = 2;
      expect(talk(before, npc.id).outcome?.text).toEqual(fallback.text);
    } finally {
      npc.lines = original;
    }
  });
});

test('only one friendship scene appears per day, leaving the other for the next ordinary day', () => {
  const before = clear();
  before.day.minute = 600;
  before.friendship = { helen: 200, margaret: 200 };
  const first = talk(before, 'helen');
  expect(currentEvent(first)?.id).toBe('heart-helen-2');
  const resolved = resolve(first, currentEvent(first)!.choices[0].id);
  const restored = JSON.parse(JSON.stringify(resolved));
  const sameDay = talk(restored, 'margaret');
  expect(currentEvent(sameDay)).toBeUndefined();
  expect(sameDay.firedEvents).not.toContain('heart-margaret-2');
  expect(
    sameDay.firedEvents.filter((id) =>
      heartEvents.some((scene) => scene.id === id),
    ),
  ).toHaveLength(1);
  const nextDay = clear(sleep(sameDay));
  expect(nextDay.day.festival).toBeUndefined();
  expect(currentEvent(talk(nextDay, 'margaret'))?.id).toBe('heart-margaret-2');
});
