import { describe, expect, test } from 'vitest';
import {
  activities,
  buy,
  characters,
  cook,
  currentEvent,
  doActivity,
  eat,
  enter,
  fastForward,
  fish,
  gift,
  harvest,
  isOver,
  newGame,
  npcAt,
  npcs,
  plant,
  recipes,
  resolve,
  shop,
  sleep,
  talk,
  tick,
  visaMonthsLeft,
  water,
  townsfolk,
} from '../src';
import type { GameState, PlaceId, StatKey } from '../src';
import { balance as b } from '../src/balance';
import { heartEvents } from '../src/npcs';

const median = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted.length
    ? (sorted[Math.floor((sorted.length - 1) / 2)] +
        sorted[Math.floor(sorted.length / 2)]) /
        2
    : null;
};
function play(character: string, seed: number, active: boolean) {
  let state = newGame(character, seed);
  let cursor = seed | 0;
  const pick = (n: number) => {
    cursor = (Math.imul(cursor, 1664525) + 1013904223) | 0;
    return (cursor >>> 0) % n;
  };
  let fifth: GameState['stats'] | undefined;
  const quarterSamples: GameState['stats'][] = [];
  let recorded = 0;
  let listenedLines = 0;
  let chineseCharacters = 0;
  const peakFriendship: Record<string, number> = {};
  const playedDays = new Set<number>();
  const record = () => {
    for (const [npc, points] of Object.entries(state.friendship))
      peakFriendship[npc] = Math.max(peakFriendship[npc] ?? 0, points);
    const quarters = state.log.filter((e) => e.kind === 'quarter').length;
    if (quarters > recorded) {
      quarterSamples.push({ ...state.stats });
      recorded = quarters;
      if (quarters === 20) fifth = { ...state.stats };
    }
  };
  const drain = () => {
    for (let i = 0; currentEvent(state); i++) {
      if (i > 40) throw new Error('Unexpected event loop');
      const choices = currentEvent(state)!.choices.filter(
        (c) =>
          !c.effects.some((e) => e.type === 'criminal' || e.type === 'ending'),
      );
      state = resolve(state, choices[pick(choices.length)].id);
      record();
    }
    record();
  };
  const visit = (place: PlaceId, minute = 480) => {
    if (state.day.minute < minute) {
      state = tick(state, minute - state.day.minute);
      drain();
    }
    state = enter(state, place);
    drain();
  };
  const activity = (id: string, place: PlaceId, minute = 480) => {
    visit(place, minute);
    if (activities(state, place).some((a) => a.id === id)) {
      state = doActivity(state, id);
      record();
      drain();
    }
  };
  for (let iteration = 0; !isOver(state); iteration++) {
    if (iteration > 2000) throw new Error('Unexpected play loop');
    drain();
    if (visaMonthsLeft(state) <= b.renewalWindowMonths)
      activity('extend', 'visa');
    if (isOver(state)) break;
    if (!active) {
      state = fastForward(state);
      record();
      continue;
    }
    const day = state.dayNumber;
    if (playedDays.has(day)) {
      state = sleep(state);
      record();
      continue;
    }
    playedDays.add(day);
    if (state.day.kind === 'workday') activity('work', 'work', 540);
    const count = 3 + pick(2);
    for (
      let step = state.day.kind === 'workday' ? 1 : 0;
      step < count && state.dayNumber === day && !isOver(state);
      step++
    ) {
      const choices = [
        ['rest', 'home'],
        ['nap', 'home'],
        ['class', 'college'],
        ['study-home', 'home'],
        ['gp', 'gp'],
        ['relax', 'pub'],
        ['coffee', 'cafe'],
        ['bench', 'bench'],
        ['board', 'board'],
      ] as const;
      if (pick(4) === 0) {
        visit('pond');
        state = fish(state, pick(4) !== 0);
        drain();
      } else {
        const [id, place] = choices[pick(choices.length)];
        activity(id, place, place === 'pub' ? 720 : 540);
      }
    }
    if (state.dayNumber !== day || isOver(state)) {
      record();
      continue;
    }
    if (state.day.minute > 1200) {
      state = sleep(state);
      record();
      continue;
    }
    // A small everyday loop exercises gifts, crops and recipes alongside the
    // three/four main activities, rather than silently making legal decisions.
    const present = () =>
      townsfolk(state).filter((person) => npcAt(state, person.id) !== 'away');
    const offset = pick(present().length);
    for (
      let chat = 0;
      chat < 5 && state.dayNumber === day && !isOver(state);
      chat++
    ) {
      const people = present();
      const person = people[(offset + chat) % people.length];
      state = talk(state, person.id);
      if (state.outcome?.kind === 'talk' && state.outcome.text) {
        listenedLines++;
        chineseCharacters +=
          state.outcome.text.zhCN.match(/\p{Script=Han}/gu)?.length ?? 0;
      }
      drain();
    }
    const people = present();
    const npc = people[offset % people.length];
    if (state.dayNumber !== day || isOver(state)) {
      record();
      continue;
    }
    visit('shop');
    if (
      state.stats.money > 100 &&
      shop(state, 'shop').some((i) => i.id === 'tea')
    ) {
      state = buy(state, 'tea', 1);
      drain();
      if (
        townsfolk(state).some((person) => person.id === npc.id) &&
        npcAt(state, npc.id) !== 'away' &&
        !state.day.gifted.includes(npc.id) &&
        state.inventory.tea > 0
      ) {
        state = gift(state, npc.id, 'tea');
        drain();
      }
      const seeds = shop(state, 'shop').filter((i) => i.kind === 'seed');
      if (seeds.length) {
        state = buy(state, seeds[pick(seeds.length)].id, 1);
        drain();
      }
    }
    if (state.dayNumber !== day || isOver(state)) {
      record();
      continue;
    }
    visit('allotment');
    if (!state.plots.length) activity('rent-plot', 'allotment');
    for (
      let index = 0;
      index < state.plots.length && state.dayNumber === day && !isOver(state);
      index++
    ) {
      const plot = state.plots[index];
      if (plot.seed && plot.growth >= b.cropDays) {
        state = harvest(state, index);
        drain();
      } else if (plot.seed && plot.wateredOn !== state.dayNumber) {
        state = water(state, index);
        drain();
      } else if (!plot.seed) {
        const seed = shop(
          { ...state, day: { ...state.day, minute: 600 } },
          'shop',
        ).find((item) => item.grows && state.inventory[item.id] > 0);
        if (seed) {
          state = plant(state, index, seed.id);
          drain();
        }
      }
    }
    if (state.dayNumber !== day || isOver(state)) {
      record();
      continue;
    }
    visit('home');
    const recipe = recipes.find((r) =>
      Object.entries(r.needs).every(
        ([item, qty]) => state.inventory[item] >= qty,
      ),
    );
    if (recipe && state.day.minute + recipe.minutes <= b.midnight) {
      state = cook(state, recipe.id);
      drain();
    }
    if (
      recipe &&
      state.inventory[recipe.makes] &&
      state.day.minute + b.minutes.eat <= b.midnight &&
      state.dayNumber === day &&
      !isOver(state)
    ) {
      state = eat(state, recipe.makes);
      drain();
    }
    if (state.dayNumber === day && !isOver(state)) state = sleep(state);
    record();
    expect(state.day.minute).toBeLessThanOrEqual(1440);
    expect(state.timeline.absences.every((a) => a.to <= state.date)).toBe(true);
  }
  record();
  const lines = npcs
    .flatMap((npc) => npc.lines)
    .filter((line) => state.heard.includes(line.id));
  return {
    state,
    fifth,
    quarterSamples,
    heard: listenedLines,
    uniqueLines: lines.length,
    words: chineseCharacters,
    uniqueWords: lines.reduce(
      (sum, line) =>
        sum + (line.text.zhCN.match(/\p{Script=Han}/gu)?.length ?? 0),
      0,
    ),
    heartScenes: Object.fromEntries(
      [2, 4, 6, 8, 10].map((threshold) => [
        threshold,
        heartEvents.filter(
          (event) =>
            event.heart!.hearts === threshold &&
            state.firedEvents.includes(event.id),
        ).length,
      ]),
    ),
    peakFriendship,
  };
}

describe('v3 seeded strategies', () => {
  for (const character of characters) {
    test(`${character.id}: 20 seeds, fast-forward and active daily play`, () => {
      const summary = [];
      for (const active of [false, true]) {
        const runs = Array.from({ length: 20 }, (_, index) =>
          play(character.id, index + 1, active),
        );
        const fifth = runs.flatMap((run) => (run.fifth ? [run.fifth] : []));
        const tenth = runs
          .filter(
            (run) =>
              run.state.log.filter((e) => e.kind === 'quarter').length === 40,
          )
          .map((run) => run.state.stats);
        const medians = (stats: GameState['stats'][]) =>
          Object.fromEntries(
            (['money', 'mood', 'health', 'english', 'career'] as StatKey[]).map(
              (key) => [key, median(stats.map((s) => s[key]))],
            ),
          );

        if (!active) {
          expect(fifth).toHaveLength(20);
          expect(median(fifth.map((s) => s.money))).toBeGreaterThanOrEqual(
            18000,
          );
          expect(median(fifth.map((s) => s.money))).toBeLessThanOrEqual(40000);
          for (const key of ['mood', 'health', 'english', 'career'] as const) {
            expect(
              median(fifth.map((s) => s[key])),
              `year 5 ${key}`,
            ).toBeGreaterThanOrEqual(50);
            expect(
              median(fifth.map((s) => s[key])),
              `year 5 ${key}`,
            ).toBeLessThanOrEqual(85);
            expect(
              median(tenth.map((s) => s[key])),
              `year 10 ${key}`,
            ).toBeGreaterThanOrEqual(35);
          }
          // Each attribute stays away from either boundary in at least three
          // quarters out of four across the seeded histories.
          const interior = (
            ['mood', 'health', 'english', 'career'] as const
          ).filter(
            (key) =>
              runs
                .flatMap((r) => r.quarterSamples)
                .filter((s) => s[key] > 0 && s[key] < 100).length /
                runs.flatMap((r) => r.quarterSamples).length >
              0.75,
          );
          expect(interior).toHaveLength(4);
        }
        if (active)
          expect(
            runs.reduce((sum, r) => sum + r.uniqueLines, 0) / runs.length,
          ).toBeGreaterThanOrEqual(200);
        expect(runs.every((run) => run.state.ending !== undefined)).toBe(true);
        expect(runs.every((run) => run.state.day.minute <= 1440)).toBe(true);
        summary.push({
          character: character.id,
          strategy: active ? 'active' : 'fast-forward',
          seeds: '1-20',
          fifthN: fifth.length,
          fifth: medians(fifth),
          tenthN: tenth.length,
          tenth: medians(tenth),
          meanLines: runs.reduce((sum, r) => sum + r.heard, 0) / runs.length,
          meanUniqueLines:
            runs.reduce((sum, r) => sum + r.uniqueLines, 0) / runs.length,
          meanChineseCharacters:
            runs.reduce((sum, r) => sum + r.words, 0) / runs.length,
          meanUniqueChineseCharacters:
            runs.reduce((sum, r) => sum + r.uniqueWords, 0) / runs.length,
          meanHeartScenes: Object.fromEntries(
            [2, 4, 6, 8, 10].map((threshold) => [
              threshold,
              runs.reduce((sum, r) => sum + r.heartScenes[threshold], 0) /
                runs.length,
            ]),
          ),
          tenHeartReach: Object.fromEntries(
            npcs
              .filter(
                (npc) =>
                  !npc.characters || npc.characters.includes(character.id),
              )
              .map((npc) => [
                npc.id,
                runs.filter((run) => (run.peakFriendship[npc.id] ?? 0) >= 1000)
                  .length / runs.length,
              ]),
          ),
        });
      }
      console.log('BALANCE_V3', JSON.stringify(summary));
    });
  }
  test('full games reproduce across seeds and JSON restoration retains the one random stream', () => {
    for (const seed of [1, 17, 42]) {
      const first = play('skilled-worker', seed, false);
      expect(play('skilled-worker', seed, false)).toEqual(first);
      expect(first.state).toEqual(JSON.parse(JSON.stringify(first.state)));
    }
  });
});
