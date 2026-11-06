import { describe, expect, test } from 'vitest';
import { newGame, npcs, talk } from '../src';
import type { Npc } from '../src';
import { heartEvents } from '../src/npcs';
import { everydayDialogue, townDialogue } from '../src/town-dialogue';
import { clear } from './helpers';

const fallback = {
  id: 'qa-fallback',
  text: { zhCN: '你好。', en: 'Hello.' },
};
const memories = [
  'show-result-ribbon',
  'visa-renewed',
  'caught-pike',
  'boiler-planned',
];

function hear(
  npc: Npc,
  line: Npc['lines'][number],
  friendship: number,
  flags: string[],
) {
  const state = clear(newGame('skilled-worker', 1));
  state.day.talked = [npc.id];
  state.friendship[npc.id] = friendship;
  state.flags = flags;
  state.firedEvents = heartEvents.map((event) => event.id);
  state.heard = [fallback.id];
  npc.lines = [line, fallback];
  return talk(state, npc.id).outcome?.text;
}

describe('10.4b town speech', () => {
  test('a third of the original 200 lines fit a short spoken turn', () => {
    const lines = Object.values(townDialogue).flat();
    expect(lines).toHaveLength(200);
    expect(
      lines.filter((line) => line.text.zhCN.length <= 24).length,
    ).toBeGreaterThanOrEqual(67);
    expect(new Set(lines.map((line) => line.text.zhCN)).size).toBe(
      lines.length,
    );
  });

  test('each recent event is recalled by only two or three residents', () => {
    for (const flag of memories) {
      const speakers = Object.entries(townDialogue).filter(([, lines]) =>
        lines.some((line) => line.requires?.includes(flag)),
      );
      expect(speakers.length, flag).toBeGreaterThanOrEqual(2);
      expect(speakers.length, flag).toBeLessThanOrEqual(3);
    }
  });

  test.each(Object.keys(townDialogue))(
    '%s saves personal route speech for an acquaintance',
    (id) => {
      const npc = npcs.find((person) => person.id === id)!;
      const original = npc.lines;
      try {
        const line = townDialogue[id][0];
        expect(hear(npc, line, 0, [])).toEqual(fallback.text);
        expect(hear(npc, line, 100, [])).toEqual(line.text);
      } finally {
        npc.lines = original;
      }
    },
  );

  test('the account of Lina drawing routes stops after she leaves', () => {
    const npc = npcs.find((person) => person.id === 'ade')!;
    const line = townDialogue.ade.find((entry) => entry.id === 'ade-town-16')!;
    const original = npc.lines;
    try {
      expect(hear(npc, line, 100, [])).toEqual(line.text);
      expect(hear(npc, line, 100, ['lina-left'])).toEqual(fallback.text);
    } finally {
      npc.lines = original;
    }
  });
});

describe('10.4b additional everyday speech', () => {
  test.each(Object.entries(everydayDialogue))(
    '%s gains distinct bilingual lines with a third kept brief',
    (id, added) => {
      expect(added).toHaveLength(24);
      expect(
        added.filter((line) => line.text.zhCN.length <= 24).length,
      ).toBeGreaterThanOrEqual(8);
      const npc = npcs.find((person) => person.id === id)!;
      for (const line of added) {
        expect(line.text.zhCN.length).toBeLessThanOrEqual(40);
        expect(line.text.en.trim()).not.toBe('');
        expect(npc.lines).toContain(line);
        const state = clear(newGame('skilled-worker', 1));
        state.firedEvents = heartEvents.map((event) => event.id);
        state.heard = npc.lines
          .filter((other) => other.id !== line.id)
          .map((other) => other.id);
        expect(talk(state, id).outcome?.text).toEqual(line.text);
      }
    },
  );
});
