import { describe, expect, test } from 'vitest';
import { characters, newGame, sleep } from '../src';
import { clear } from './helpers';

const windows = {
  'lunar-new-year': ['01-20', '02-28'],
  'may-day': ['04-29', '05-12'],
  'summer-fair': ['08-01', '09-07'],
  'bonfire-night': ['11-05', '11-05'],
  'christmas-market': ['11-22', '12-24'],
};

describe('10.5 calendar seasons and festival dates', () => {
  test.each(characters)(
    '$id keeps all three days ordered and seasonal for forty quarters',
    (character) => {
      let state = clear(newGame(character.id, 1));
      state.timeline.episodes[0].validTo = '2040-12-31';
      for (let quarter = 0; quarter < 40; quarter++) {
        const start = state.date;
        const endDate = new Date(`${start}T00:00:00Z`);
        endDate.setUTCMonth(endDate.getUTCMonth() + 3);
        const end = endDate.toISOString().slice(0, 10);
        const midpoint = new Date((Date.parse(start) + Date.parse(end)) / 2);
        expect(state.quarter).toBe(Math.ceil((midpoint.getUTCMonth() + 1) / 3));
        const dates: string[] = [];
        for (let day = 0; day < 3; day++) {
          dates.push(state.day.date);
          expect(state.day.index).toBe(day);
          expect(state.day.date >= start && state.day.date < end).toBe(true);
          const month = Number(state.day.date.slice(5, 7));
          if (state.quarter === 1) expect(month < 4 || month > 9).toBe(true);
          if (state.quarter === 3) expect(month >= 3 && month <= 10).toBe(true);
          if (day === 2) {
            const [first, last] = windows[state.day.festival!];
            const date = state.day.date.slice(5);
            expect(
              date >= first && date <= last,
              `${state.day.festival}: ${state.day.date}`,
            ).toBe(true);
          }
          state = clear(sleep(state));
        }
        expect(dates[0] < dates[1] && dates[1] < dates[2]).toBe(true);
        expect(state.date).toBe(end);
      }
      expect(state.ending).toBe('timeout');
    },
  );

  test('Yao’s first gathering moves one week past the Saturday weekend', () => {
    let state = clear(newGame('skilled-worker', 1));
    state = clear(sleep(state));
    expect(state.day.date).toBe('2025-02-01');
    state = clear(sleep(state));
    expect(state.day.date).toBe('2025-02-08');
  });
});
