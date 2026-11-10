import {
  festivals,
  fish,
  narrative,
  shop,
  buy,
  activities,
  doActivity,
  cook,
  enter,
  harvest,
  sleep,
  recipes,
} from '../src';
import { festivalFoods, festivalActivities } from '../src/festivals';
import { describe, expect, test } from 'vitest';
import {
  characters,
  currentEvent,
  gift,
  newGame,
  npcAt,
  npcs,
  resolve,
  talk,
  townsfolk,
} from '../src';
import { heartEvents } from '../src/npcs';
import { townEvents } from '../src/events/town';
import { balance as b } from '../src/balance';
import { clear, drain } from './helpers';

describe('9.3 people and stories', () => {
  test('households are character-specific, at home in the morning, and residents never use the player home', () => {
    for (const character of characters) {
      const state = clear(newGame(character.id, 1));
      const family = townsfolk(state).filter((n) => n.characters);
      expect(family.map((n) => n.id)).toEqual(
        character.id === 'family-partner'
          ? ['jamie']
          : character.id === 'hong-kong-bno'
            ? ['ka-ning-partner', 'ka-ning-child']
            : ['yao-flatmate'],
      );
      for (const npc of family) expect(npcAt(state, npc.id)).toBe('home');
    }
    for (const npc of npcs.filter((n) => !n.characters))
      expect(
        npc.schedule.flatMap((r) => r.stops).some((s) => s.at === 'home'),
      ).toBe(false);
  });
  test('every new heart scene fires at its threshold once, and never changes a player timeline', () => {
    for (const npc of npcs.filter(
      (n) => !['margaret', 'ade', 'helen'].includes(n.id),
    )) {
      let state = clear(newGame(npc.characters?.[0] ?? 'skilled-worker', 1));
      const scenes = heartEvents
        .filter((e) => e.heart?.npc === npc.id)
        .sort((a, b) => a.heart!.hearts - b.heart!.hearts);
      expect(scenes.map((e) => e.heart!.hearts)).toEqual([2, 4, 6, 8, 10]);
      for (const event of scenes) {
        if (state.day.done.includes('heart-scene')) {
          state = clear(sleep(state));
          if (state.day.festival) state = clear(sleep(state));
        }
        const timeline = structuredClone(state.timeline);
        state.friendship[npc.id] = event.heart!.hearts * 100 - b.talkFriendship;
        state.day.minute = Math.max(
          600,
          ...(event.when ?? []).map((c) =>
            'minuteMin' in c ? (c.minuteMin ?? 0) : 0,
          ),
        );
        state.flags.push(...(event.requires ?? []));
        for (const c of event.when ?? []) {
          if ('dayKind' in c) state.day.kind = c.dayKind;
          if ('flag' in c) state.flags.push(c.flag);
          if ('weather' in c) state.day.weather = c.weather;
          if ('festival' in c) state.day.festival = c.festival;
        }
        state.day.talked = [];
        state = talk(state, npc.id);
        expect(currentEvent(state)?.id).toBe(event.id);
        state = resolve(state, event.choices[0].id);
        expect(state.timeline).toEqual(timeline);
        expect(talk(state, npc.id).pendingEvent).toBeUndefined();
      }
      for (const liking of ['loved', 'liked', 'disliked'] as const) {
        const item = npc.gifts[liking][0];
        const before = clear(
          newGame(npc.characters?.[0] ?? 'skilled-worker', 1),
        );
        before.inventory[item] = 1;
        before.friendship[npc.id] = 200;
        const after = gift(before, npc.id, item);
        expect(after.friendship[npc.id]).toBe(200 + b.gifts[liking]);
        expect(after.outcome?.text).toEqual(npc.reactions[liking]);
      }
    }
  });
  test('town chains retain their prerequisites and all choices leave player timeline untouched', () => {
    expect(townEvents.length).toBeGreaterThanOrEqual(12);
    for (const event of townEvents)
      for (const choice of event.choices) {
        const state = clear();
        const after = resolve({ ...state, pendingEvent: event.id }, choice.id);
        expect(after.timeline).toEqual(state.timeline);
        expect(event.text.zhCN.length).toBeLessThanOrEqual(60);
      }
    for (let i = 0; i < 10; i += 2)
      expect(townEvents[i + 1].requires).toEqual([
        `${townEvents[i].id}-shared`,
      ]);
  });
  test('Lina endings depend on the choice and seeded chance, are exclusive, survive JSON, and only end her story', () => {
    const endings = new Set<string>();
    let changedByChoice = 0;
    for (let seed = 1; seed <= 20; seed++) {
      const state = clear(newGame('skilled-worker', seed));
      const start = { ...state, pendingEvent: 'town-lina-papers' };
      const supported = resolve(start, 'stay');
      const alone = resolve(start, 'help');
      if (
        supported.flags.includes('lina-can-stay') !==
        alone.flags.includes('lina-can-stay')
      )
        changedByChoice++;
      for (const chosen of [supported, alone]) {
        const stay = chosen.flags.includes('lina-can-stay');
        endings.add(stay ? 'stay' : 'leave');
        const done = resolve(
          {
            ...JSON.parse(JSON.stringify(chosen)),
            pendingEvent: stay ? 'town-lina-stay' : 'town-lina-leave',
          },
          'stay',
        );
        expect(done.ending).toBeUndefined();
        expect(done.timeline).toEqual(state.timeline);
        expect(done.flags.includes('lina-stayed')).toBe(stay);
        expect(done.flags.includes('lina-left')).toBe(!stay);
        expect(townsfolk(done).some((n) => n.id === 'lina')).toBe(stay);
        expect(drain(done).timeline).toEqual(state.timeline);
      }
    }
    expect(endings).toEqual(new Set(['stay', 'leave']));
    expect(changedByChoice).toBeGreaterThan(0);
  });
});

describe('9.3 festivals, notices and food', () => {
  test('all festivals have resident and family dialogue, a stall food and green schedules', () => {
    for (const festival of festivals) {
      const state = clear(newGame('hong-kong-bno', 1));
      state.quarter = festival.season;
      state.day = {
        ...state.day,
        kind: 'special',
        festival: festival.id,
        minute: 1080,
        place: 'green',
      };
      expect(shop(state, 'green').map((i) => i.id)).toEqual([
        festivalFoods[festival.id],
      ]);
      for (const npc of npcs) {
        expect(npc.lines.some((l) => l.festival === festival.id)).toBe(true);
        expect(new Set(npc.lines.map((l) => l.text.zhCN)).size).toBe(
          npc.lines.length,
        );
        const own = {
          ...state,
          characterId: npc.characters?.[0] ?? state.characterId,
        };
        expect(npcAt(own, npc.id)).toBe('green');
        expect(talk(own, npc.id).outcome?.text).toEqual(
          expect.objectContaining({
            zhCN: expect.any(String),
            en: expect.any(String),
          }),
        );
      }
      const bought = buy(state, festivalFoods[festival.id], 1);
      expect(bought.inventory[festivalFoods[festival.id]]).toBe(1);
      const activity = festivalActivities[festival.id];
      if (activity) {
        const after = doActivity(state, activity.id);
        expect(after.inventory[festivalFoods[festival.id]]).toBe(1);
        expect(
          activities(after, 'green').some((a) => a.id === activity.id),
        ).toBe(false);
      }
    }
    expect(recipes).toHaveLength(8);
    for (const recipe of recipes) {
      const state = clear();
      state.inventory = { ...recipe.needs };
      const after = cook(state, recipe.id);
      expect(after.inventory[recipe.makes]).toBe(1);
      for (const item of Object.keys(recipe.needs))
        expect(after.inventory[item]).toBe(0);
    }
  });
  test('summer show requires a current-season harvest; variety and quantity decide one result with only social effects', () => {
    let state = clear();
    state.quarter = 3;
    state.day = {
      ...state.day,
      kind: 'special',
      festival: 'summer-fair',
      minute: 780,
      place: 'green',
    };
    state.inventory.tomato = 10;
    expect(
      activities(state, 'green').some((a) => a.id.startsWith('summer-show-')),
    ).toBe(false);
    state.plots = [{ seed: 'seed-tomato', growth: b.cropDays }];
    state = harvest(enter(state, 'allotment'), 0);
    state = enter(state, 'green');
    expect(
      activities(state, 'green').some((a) => a.id === 'summer-show-tomato'),
    ).toBe(true);
    for (const [crop, qty, rank] of [
      ['cucumber', 1, 'first'],
      ['tomato', 1, 'commended'],
      ['corn', 2, 'ribbon'],
    ] as const) {
      const before = {
        ...state,
        inventory: { [crop]: qty },
        flags: [`quarter-harvest:${crop}:${qty}`],
      };
      const after = doActivity(before, `summer-show-${crop}`);
      expect(after.flags).toContain(`show-result-${rank}`);
      expect(before.achievements).not.toContain('allotment-show');
      expect(after.achievements).toContain('allotment-show');
      expect(after.stats.mood - before.stats.mood).toBe(b.showMood[rank]);
      expect(after.friendship.margaret).toBe(b.showFriendship);
      expect(after.inventory).toEqual(before.inventory);
      expect(after.timeline).toEqual(before.timeline);
      expect(after.stats.money).toBe(before.stats.money);
      expect(
        activities(after, 'green').some((a) => a.id.startsWith('summer-show-')),
      ).toBe(false);
      expect(after.outcome?.text?.zhCN).toContain(`${qty}份`);
    }
  });
  test('two or three random notices stay fixed for a season and through JSON; quiz appears only on its announced day', () => {
    const selections = new Set<string>();
    for (let seed = 1; seed <= 20; seed++) {
      const state = clear(newGame('skilled-worker', seed));
      const flags = state.flags.filter((f) => f.startsWith('quarter-board-'));
      expect(flags.length).toBeGreaterThanOrEqual(2);
      expect(flags.length).toBeLessThanOrEqual(3);
      selections.add(flags.join(','));
      const read = doActivity(enter(state, 'board'), 'board');
      expect(read.outcome?.text?.zhCN.split('\n')).toHaveLength(flags.length);
      const restored = JSON.parse(JSON.stringify(state));
      expect(doActivity(enter(restored, 'board'), 'board').outcome).toEqual(
        read.outcome,
      );
      const weekend = clear(sleep(state));
      expect(
        weekend.flags.filter((f) => f.startsWith('quarter-board-')),
      ).toEqual(flags);
      const early = {
        ...weekend,
        day: { ...weekend.day, minute: b.quizStart - 1, place: 'pub' as const },
      };
      expect(activities(early, 'pub').some((a) => a.id === 'pub-quiz')).toBe(
        false,
      );
      const evening = { ...early, day: { ...early.day, minute: b.quizStart } };
      const offered = activities(evening, 'pub').some(
        (a) => a.id === 'pub-quiz',
      );
      expect(offered).toBe(flags.includes('quarter-board-pub-quiz'));
      if (offered) {
        expect(read.outcome?.text?.zhCN).toContain('2月1日周六 18:00');
        expect(npcAt(evening, 'dave')).toBe('pub');
        const played = doActivity(evening, 'pub-quiz');
        expect(played.stats.english).toBe(
          evening.stats.english + b.quizEnglish,
        );
        expect(played.stats.money).toBe(evening.stats.money);
        expect(activities(played, 'pub').some((a) => a.id === 'pub-quiz')).toBe(
          false,
        );
      }
    }
    expect(selections.size).toBeGreaterThan(1);
  });
});

describe('9.3 earned achievements and ending memories', () => {
  test('harvest and loved-gift milestones award at the actual threshold and retain counts through JSON', () => {
    let farm = clear();
    farm.day.place = 'allotment';
    for (let n = 1; n <= 20; n++) {
      farm.day.minute = 600;
      farm.plots = [{ seed: 'seed-turnip', growth: b.cropDays }];
      farm = harvest(farm, 0);
      expect(farm.achievements.includes('harvest-twenty')).toBe(n >= 20);
    }
    let presents = clear();
    presents.inventory.tea = 10;
    for (let n = 1; n <= 10; n++) {
      presents.day.gifted = [];
      presents = gift(presents, 'helen', 'tea');
      expect(presents.achievements.includes('loved-gifts-ten')).toBe(n >= 10);
    }
    const restored = JSON.parse(JSON.stringify(farm));
    expect(narrative(restored).some((t) => t.zhCN.includes('收成 20 次'))).toBe(
      true,
    );
    expect(
      farm.achievements.filter((id) => id === 'harvest-twenty'),
    ).toHaveLength(1);
  });
  test('pike, friendship and every-resident achievements come from observable actions', () => {
    let caught = false;
    for (let seed = 1; seed <= 50; seed++) {
      const before = clear(newGame('skilled-worker', seed));
      before.day.place = 'pond';
      const after = fish(before, true);
      if (after.inventory.pike) {
        caught = true;
        expect(before.achievements).not.toContain('caught-pike');
        expect(after.achievements).toContain('caught-pike');
        expect(
          narrative(after).some((t) => t.zhCN.includes('钓到鱼 1 次')),
        ).toBe(true);
        break;
      }
    }
    expect(caught).toBe(true);
    const missed = clear();
    missed.day.place = 'pond';
    const miss = fish(missed, false);
    expect(
      narrative(miss).some((t) => t.zhCN.includes('池塘抛竿 1 次。')),
    ).toBe(true);
    const close = clear();
    close.friendship.ade = 800 - b.talkFriendship;
    expect(talk(close, 'ade').achievements).toContain('eight-hearts');
    let social = clear();
    const residents = npcs.filter((n) => !n.characters);
    for (let i = 0; i < residents.length; i++) {
      social = talk(social, residents[i].id);
      expect(social.achievements.includes('talked-everyone')).toBe(
        i === residents.length - 1,
      );
    }
  });
  test('all five festival kinds and four announced quizzes award separately', () => {
    let state = clear();
    for (let i = 0; i < festivals.length; i++) {
      const festival = festivals[i];
      state.day = {
        ...state.day,
        kind: 'special',
        festival: festival.id,
        minute: 1080,
        done: [],
        place: 'green',
      };
      state = doActivity(state, 'festival');
      expect(state.achievements.includes('five-festivals')).toBe(
        i === festivals.length - 1,
      );
    }
    for (let n = 1; n <= 4; n++) {
      state.day = {
        ...state.day,
        kind: 'weekend',
        festival: undefined,
        minute: b.quizStart,
        done: [],
        place: 'pub',
      };
      state.flags.push('quarter-board-pub-quiz');
      state = doActivity(state, 'pub-quiz');
      expect(state.achievements.includes('quiz-four')).toBe(n >= 4);
    }
    state.friendship = {
      margaret: 900,
      ade: 800,
      helen: 700,
      dave: 600,
      jamie: 1000,
    };
    const text = narrative(JSON.parse(JSON.stringify(state)))
      .map((t) => t.zhCN)
      .join('\n');
    expect(text).toContain('玛格丽特、阿德、海伦');
    expect(text).not.toContain('戴夫');
    for (const festival of festivals)
      expect(text).toContain(festival.name.zhCN);
    expect(text).not.toContain('收成 0 次');
    expect(text).not.toContain('钓到鱼 0 次');
  });
});
