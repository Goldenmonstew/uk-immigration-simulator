import { describe, expect, test } from 'vitest';
import {
  activities,
  characters,
  doActivity,
  festivals,
  fish,
  narrative,
  newGame,
  resolve,
  sleep,
  tick,
} from '../src';
import type { EndingId, GameEvent } from '../src';
import { festivalActivities } from '../src/festivals';
import { clear } from './helpers';

function end(characterId: string, ending: EndingId) {
  const character = characters.find((c) => c.id === characterId)!;
  const event: GameEvent = {
    id: 'ending-fixture',
    title: { zhCN: '收尾', en: 'Ending' },
    text: { zhCN: '收好日记。', en: 'Close the diary.' },
    weight: 1,
    choices: [
      {
        id: 'finish',
        label: { zhCN: '合上', en: 'Close' },
        effects: [{ type: 'ending', ending }],
      },
    ],
  };
  character.events.push(event);
  try {
    return resolve(
      { ...clear(newGame(characterId, 1)), pendingEvent: event.id },
      'finish',
    );
  } finally {
    character.events.pop();
  }
}

describe('10.5 ending narratives', () => {
  test('unused plots and ponds leave no claims of use, and a missed cast records only the cast', () => {
    const state = clear();
    const before = narrative(state)
      .map((t) => t.zhCN)
      .join('\n');
    expect(before).not.toMatch(/菜地收成|池塘抛竿|钓到鱼|使用的痕迹/);
    state.day.place = 'pond';
    const after = narrative(fish(state, false))
      .map((t) => t.zhCN)
      .join('\n');
    expect(after).toContain('池塘抛竿 1 次。');
    expect(after).not.toMatch(/菜地收成|钓到鱼|使用的痕迹/);
  });

  test.each(characters)(
    '$id closes settlement with its own bilingual scene in narrative()',
    (character) => {
      const state = end(character.id, 'settled');
      const ending = state.log.at(-1)!.text;
      expect(narrative(state).at(-1)).toEqual(ending);
      const paragraphs = ending.zhCN.split('\n');
      expect(paragraphs.length).toBeGreaterThanOrEqual(3);
      expect(paragraphs.length).toBeLessThanOrEqual(5);
      expect(paragraphs.every((p) => p.length <= 40)).toBe(true);
      expect(paragraphs.join('').length).toBeGreaterThanOrEqual(80);
      expect(paragraphs.join('').length).toBeLessThanOrEqual(160);
      expect(ending.en.split('\n')).toHaveLength(paragraphs.length);
      expect(ending.zhCN).toContain(character.name.zhCN.split('·')[0]);
      expect(ending.zhCN).toContain('递交后的回执');
      expect(ending.zhCN).not.toMatch(/获批|批准|\d/);
      expect(
        new Set(
          characters.map((c) => end(c.id, 'settled').log.at(-1)!.text.zhCN),
        ).size,
      ).toBe(3);
    },
  );

  test('expiry explains the missed renewal and points the next game to the top bar and visa centre', () => {
    let state = clear();
    state.timeline.episodes[0].validTo = state.date;
    for (let day = 0; day < 3; day++) state = clear(sleep(state));
    expect(state.ending).toBe('overstayed');
    const ending = narrative(state).at(-1)!;
    expect(ending).toEqual(state.log.at(-1)!.text);
    expect(ending.zhCN).toContain('许可到期前没有续签上');
    expect(ending.zhCN).toContain('顶栏的剩余月数');
    expect(ending.zhCN).toContain('签证中心');
    expect(ending.en).toContain('before you renewed');
  });

  test.each([
    ['left', '选择离开英国', 'chose to leave'],
    ['timeout', '时间尽头', 'time limit'],
    ['criminal', '犯罪记录', 'criminal record'],
  ] as const)('%s explains why the game ends', (id, chinese, english) => {
    const ending = narrative(end('skilled-worker', id)).at(-1)!;
    expect(ending.zhCN).toContain(chinese);
    expect(ending.en).toContain(english);
  });
});

describe('10.5 festival activity results', () => {
  test('May Day morning stalls do not describe a dance before its activity opens', () => {
    const before = clear();
    before.day = {
      ...before.day,
      kind: 'special',
      festival: 'may-day',
      minute: 420,
      place: 'green',
    };
    expect(
      activities(before, 'green').some((a) => a.id === 'may-ribbons'),
    ).toBe(false);
    const stroll = doActivity(before, 'festival');
    expect(stroll.outcome?.text?.zhCN).not.toMatch(/舞步|彩带|换位/);
    const dance = doActivity(
      tick(stroll, 600 - stroll.day.minute),
      'may-ribbons',
    );
    expect(dance.outcome?.text).not.toEqual(stroll.outcome?.text);
    expect(dance.outcome?.text?.zhCN).toContain('彩带');
  });

  test.each(festivals)(
    '$id rotates actual results in adjacent years and on its next alternating visit',
    (festival) => {
      const activity = festivalActivities[festival.id];
      for (const id of ['festival', ...(activity ? [activity.id] : [])]) {
        const results = [1, 2, 3].map((year) => {
          const before = clear();
          before.year = year;
          before.day = {
            ...before.day,
            kind: 'special',
            festival: festival.id,
            minute: 1080,
            place: 'green',
          };
          const after = doActivity(before, id);
          expect(after.day.done).toContain(id);
          expect(after.flags).toContain(`visited-festival:${festival.id}`);
          expect(after.outcome?.text).not.toEqual(festival.text);
          expect(after.outcome?.text?.zhCN.length).toBeLessThanOrEqual(60);
          expect(after.outcome?.text?.en.trim()).not.toBe('');
          return after.outcome!.text!.zhCN;
        });
        expect(new Set(results).size).toBe(3);
      }
    },
  );
});
