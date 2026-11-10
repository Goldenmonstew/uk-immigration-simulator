import { describe, expect, test } from 'vitest';
import { characters, currentEvent, newGame, resolve, sleep } from '../src';
import { clear } from './helpers';

describe('10.5 opening mornings', () => {
  test.each(characters)(
    '$id starts with a single morning introduction and never repeats it',
    (character) => {
      for (const seed of [1, 17, 42]) {
        const before = newGame(character.id, seed);
        const opening = currentEvent(before)!;
        expect(opening.id).toBe(`opening-${character.id}`);
        expect(opening.channel).toBe('morning');
        expect(opening.once).toBe(true);
        expect(before.day).toMatchObject({
          index: 0,
          minute: 420,
          place: 'home',
        });
        const paragraphs = opening.text.zhCN.split('\n');
        expect(paragraphs.length).toBeGreaterThanOrEqual(3);
        expect(paragraphs.length).toBeLessThanOrEqual(4);
        expect(paragraphs.every((p) => p.length <= 40)).toBe(true);
        expect(opening.text.en.split('\n')).toHaveLength(paragraphs.length);
        for (const phrase of [
          '许可',
          '续签',
          '签证中心',
          '市政厅',
          '定居',
          '英语',
          'Life in the UK',
          '语言学校',
        ])
          expect(opening.text.zhCN).toContain(phrase);
        expect(opening.text.zhCN).toMatch(/菜地|种菜/);
        expect(opening.text.zhCN).not.toMatch(/\d|获批|应该/);
        expect(opening.choices.length).toBeGreaterThanOrEqual(1);
        expect(opening.choices.length).toBeLessThanOrEqual(2);
        for (const choice of opening.choices) {
          expect(
            choice.effects.every(
              (effect) =>
                effect.type === 'none' ||
                (effect.type === 'stat' && effect.key === 'mood'),
            ),
          ).toBe(true);
          const after = resolve(before, choice.id);
          expect(after.timeline).toEqual(before.timeline);
          expect(after.stats).toEqual(before.stats);
          expect(after.day.minute).toBe(420);
          expect(
            after.firedEvents.filter((id) => id === opening.id),
          ).toHaveLength(1);
          let state = clear(JSON.parse(JSON.stringify(after)));
          state.timeline.episodes[0].validTo = '2040-12-31';
          for (let day = 0; day < 120; day++) {
            state = sleep(clear(state));
            expect(currentEvent(state)?.id).not.toBe(opening.id);
            expect(state.eventQueue).not.toContain(opening.id);
            expect(
              state.day.deliveries.some((d) => d.eventId === opening.id),
            ).toBe(false);
          }
          expect(
            state.firedEvents.filter((id) => id === opening.id),
          ).toHaveLength(1);
        }
      }
    },
  );
});
