import { skilledWorkerAdditions } from '../src/characters/skilled-worker-additions';
import { readMail } from '../src';
import { festivalEvents, noticeEvents } from '../src/events/days';
import { notices } from '../src/festivals';
import type { PlaceId } from '../src';
import { commonEvents } from '../src/events/common';
import { placeEvents } from '../src/events/places';
import { describe, expect, test } from 'vitest';
import {
  characters,
  doActivity,
  enter,
  festivals,
  newGame,
  npcs,
  places,
  resolve,
  talk,
  tick,
} from '../src';
import { heartEvents } from '../src/npcs';
import { townDialogue } from '../src/town-dialogue';
import { clear, completeQuarter } from './helpers';

const routes = [
  ['SKILLED_WORKER', 'skilled-worker'],
  ['HONG_KONG_BNO', 'hong-kong-bno'],
  ['FAMILY_PARTNER_OR_PARENT', 'family-partner'],
] as const;

describe('10.2 town dialogue', () => {
  test('each resident gains 25 distinct lines, including every role and real memories', () => {
    expect(Object.keys(townDialogue)).toHaveLength(8);
    for (const npc of npcs.filter((person) => !person.characters)) {
      const added = townDialogue[npc.id];
      expect(added, npc.id).toHaveLength(25);
      expect(npc.lines.length).toBeGreaterThanOrEqual(70);
      for (const [route] of routes)
        expect(
          added.filter((line) =>
            line.when?.some((c) => 'route' in c && c.route === route),
          ).length,
        ).toBeGreaterThanOrEqual(3);
      expect(
        added.filter((line) =>
          line.requires?.some((flag) => !flag.startsWith('heart-')),
        ).length,
      ).toBeGreaterThanOrEqual(4);
      const callbacks = added.filter((line) =>
        line.requires?.some((flag) => flag.startsWith('heart-')),
      );
      expect(callbacks.length).toBeGreaterThanOrEqual(2);
      for (const line of callbacks) {
        const flag = line.requires![0];
        const scene = heartEvents.find((event) =>
          event.choices.some((choice) => choice.sets?.includes(flag)),
        )!;
        expect(scene.heart!.npc).toBe(npc.id);
        for (const choice of scene.choices) {
          const state = clear();
          state.pendingEvent = scene.id;
          expect(resolve(state, choice.id).flags).toContain(flag);
        }
      }
    }
  });

  for (const [id, added] of Object.entries(townDialogue))
    test(`${id}: role and memory conditions govern actual speech`, () => {
      const npc = npcs.find((person) => person.id === id)!;
      const original = npc.lines;
      try {
        for (const line of added) {
          expect(line.text.zhCN.length).toBeLessThanOrEqual(40);
          expect(line.text.en.trim()).not.toBe('');
          npc.lines = [
            line,
            { id: 'fallback', text: { zhCN: '你好。', en: 'Hello.' } },
          ];
          for (const [route, character] of routes) {
            const before = clear(newGame(character, 1));
            before.heard = ['fallback'];
            before.firedEvents = heartEvents.map((event) => event.id);
            before.flags = [...(line.requires ?? [])];
            const expected = !line.when?.some(
              (c) => 'route' in c && c.route !== route,
            );
            const after = talk(before, id);
            expect(after.outcome?.text).toEqual(
              expected ? line.text : npc.lines[1].text,
            );
            expect(before.heard).toEqual(['fallback']);
            if (line.requires?.length) {
              before.flags = [];
              expect(talk(before, id).outcome?.text).toEqual(npc.lines[1].text);
            }
          }
        }
      } finally {
        npc.lines = original;
      }
    });
});

describe('10.2 place stories', () => {
  test('every shared place has at least four cards, including 35 new one-off scenes', () => {
    expect(placeEvents).toHaveLength(35);
    for (const place of places.filter((p) => !['home', 'visa'].includes(p.id)))
      expect(
        commonEvents.filter((event) => event.channel === `place:${place.id}`)
          .length,
        place.id,
      ).toBeGreaterThanOrEqual(4);
    expect(placeEvents.every((event) => commonEvents.includes(event))).toBe(
      true,
    );
    expect(
      placeEvents.filter((event) =>
        event.choices.every((choice) =>
          choice.effects.every((effect) =>
            ['stat', 'none'].includes(effect.type),
          ),
        ),
      ).length,
    ).toBeGreaterThanOrEqual(18);
  });

  test.each(placeEvents.map((event) => [event.id, event] as const))(
    '%s is encountered on entry, applies the choice, and remains read after restoring',
    (_id, event) => {
      expect(event.once).toBe(true);
      expect(event.text.zhCN.length).toBeLessThanOrEqual(60);
      for (const choice of event.choices) {
        const before = clear();
        before.day.minute = 780;
        before.day.kind = 'workday';
        before.day.deliveries = [
          { eventId: event.id, channel: event.channel! },
        ];
        expect(tick(before, 0).pendingEvent).toBeUndefined();
        const opened = enter(before, event.channel!.slice(6) as PlaceId);
        expect(opened.pendingEvent).toBe(event.id);
        expect(before.firedEvents).not.toContain(event.id);
        const after = resolve(opened, choice.id);
        expect(after.timeline).toEqual(before.timeline);
        expect(after.log.at(-1)).toMatchObject({
          id: event.id,
          choiceId: choice.id,
        });
        const restored = JSON.parse(JSON.stringify(after));
        restored.day.deliveries = [...before.day.deliveries];
        expect(
          enter(restored, event.channel!.slice(6) as PlaceId).pendingEvent,
        ).toBeUndefined();
      }
    },
  );
});

describe('10.2 notices and festivals', () => {
  test('30 short notices include ten common and five for each season; seasonal draws persist on reload', () => {
    expect(notices.length).toBeGreaterThanOrEqual(30);
    expect(
      notices.filter((notice) => !notice.season).length,
    ).toBeGreaterThanOrEqual(10);
    for (const season of [1, 2, 3, 4])
      expect(
        notices.filter((notice) => notice.season === season).length,
      ).toBeGreaterThanOrEqual(5);
    for (const notice of notices)
      expect(notice.text.zhCN.length).toBeLessThanOrEqual(40);
    for (let seed = 1; seed <= 20; seed++) {
      let state = clear(newGame('skilled-worker', seed));
      for (let quarter = 0; quarter < 4; quarter++) {
        const ids = state.flags
          .filter((flag) => flag.startsWith('quarter-board-'))
          .map((flag) => flag.slice('quarter-board-'.length));
        expect(ids.length).toBeGreaterThanOrEqual(2);
        expect(ids.length).toBeLessThanOrEqual(3);
        for (const id of ids) {
          const notice = notices.find((entry) => entry.id === id)!;
          expect(!notice.season || notice.season === state.quarter).toBe(true);
        }
        const read = doActivity(enter(state, 'board'), 'board');
        const restored = JSON.parse(JSON.stringify(state));
        expect(doActivity(enter(restored, 'board'), 'board').outcome).toEqual(
          read.outcome,
        );
        if (quarter < 3) state = clear(completeQuarter(read));
      }
    }
  });

  test.each(noticeEvents.map((event) => [event.id, event] as const))(
    '%s: posted notices permit actual seasonal draws before delivery',
    (_id, event) => {
      const original = commonEvents.splice(0, commonEvents.length, event);
      const originalCharacter = characters[0].events;
      characters[0].events = [];
      let offered = 0;
      try {
        for (let seed = 1; seed <= 80; seed++) {
          const before = newGame('skilled-worker', seed);
          const posted = before.flags.includes(event.requires![0]);
          const scheduled = [
            before.pendingEvent,
            ...before.eventQueue,
            ...before.day.deliveries.map((d) => d.eventId),
          ];
          expect(scheduled.includes(event.id)).toBe(posted);
          if (posted) offered++;
        }
      } finally {
        commonEvents.splice(0, commonEvents.length, ...original);
        characters[0].events = originalCharacter;
      }
      expect(offered).toBeGreaterThan(0);
      const before = clear();
      before.day.minute = 1100;
      before.day.kind = 'weekend';
      before.day.deliveries = [{ eventId: event.id, channel: event.channel! }];
      expect(
        enter(before, event.channel!.slice(6) as PlaceId).pendingEvent,
      ).toBeUndefined();
      before.flags.push(...event.requires!);
      // The swap and repair locations close before the evening walk.
      if (event.id !== 'town-board-walk') before.day.minute = 780;
      expect(
        enter(before, event.channel!.slice(6) as PlaceId).pendingEvent,
      ).toBe(event.id);
    },
  );

  test('each festival has first-year and later one-off cards with matching day and year gates', () => {
    expect(festivalEvents).toHaveLength(15);
    for (const festival of festivals) {
      const cards = festivalEvents.filter((event) =>
        event.when?.some((c) => 'festival' in c && c.festival === festival.id),
      );
      expect(cards.length).toBeGreaterThanOrEqual(3);
      expect(
        cards.some((event) =>
          event.when?.some(
            (c) =>
              'yearMax' in c &&
              c.yearMax === (festival.id === 'christmas-market' ? 2 : 1),
          ),
        ),
      ).toBe(true);
      expect(
        cards.some((event) =>
          event.when?.some((c) => 'yearMin' in c && c.yearMin! > 1),
        ),
      ).toBe(true);
      for (const event of cards) {
        const year = event.when!.find(
          (c) => 'yearMin' in c || 'yearMax' in c,
        ) as { yearMin?: number; yearMax?: number };
        const before = clear();
        before.year = year.yearMin ?? 1;
        before.quarter = festival.season;
        before.day.kind = 'special';
        before.day.festival = festival.id;
        before.day.minute = 1080;
        before.day.deliveries = [
          { eventId: event.id, channel: event.channel! },
        ];
        expect(event.once).toBe(true);
        expect(enter(before, 'green').pendingEvent).toBe(event.id);
        const wrongDay = structuredClone(before);
        delete wrongDay.day.festival;
        expect(enter(wrongDay, 'green').pendingEvent).toBeUndefined();
        const wrongYear = structuredClone(before);
        wrongYear.year = year.yearMax ? year.yearMax + 1 : 1;
        expect(enter(wrongYear, 'green').pendingEvent).toBeUndefined();
        const after = resolve(enter(before, 'green'), event.choices[0].id);
        expect(after.timeline).toEqual(before.timeline);
        const restored = JSON.parse(JSON.stringify(after));
        restored.day.deliveries = [...before.day.deliveries];
        expect(enter(restored, 'green').pendingEvent).toBeUndefined();
      }
    }
  });
});

describe('10.2 Yao stories', () => {
  test('30 additions bring Yao to 70, with ten flatmate, six partner, six work and eight town cards', () => {
    expect(skilledWorkerAdditions).toHaveLength(30);
    expect(characters[0].events).toHaveLength(70);
    expect(
      skilledWorkerAdditions.filter(
        (event) => event.channel === 'npc:yao-flatmate',
      ),
    ).toHaveLength(10);
    expect(
      skilledWorkerAdditions.filter((event) =>
        event.id.startsWith('sw-partner-'),
      ),
    ).toHaveLength(6);
    expect(
      skilledWorkerAdditions.filter((event) => event.id.startsWith('sw-work-')),
    ).toHaveLength(6);
    expect(
      skilledWorkerAdditions.filter((event) => event.id.startsWith('sw-town-')),
    ).toHaveLength(8);
    for (const event of skilledWorkerAdditions) {
      expect(event.once).toBe(true);
      expect(characters[0].events).toContain(event);
      expect(characters.slice(1).some((c) => c.events.includes(event))).toBe(
        false,
      );
      for (const choice of event.choices) {
        const before = clear();
        before.pendingEvent = event.id;
        const after = resolve(before, choice.id);
        expect(after.timeline).toEqual(before.timeline);
        expect(after.log.at(-1)).toMatchObject({
          id: event.id,
          choiceId: choice.id,
        });
      }
    }
  });

  test('calls and letters distinguish arrival memories from the time before arrival', () => {
    const partner = skilledWorkerAdditions.filter((event) =>
      event.id.startsWith('sw-partner-'),
    );
    for (const event of partner) {
      const before = clear();
      before.day.minute = 780;
      before.day.deliveries = [{ eventId: event.id, channel: event.channel! }];
      const deliver = (s: typeof before) =>
        event.channel === 'letter' ? readMail(s) : tick(s, 0);
      const isArrivalMemory =
        event.requires?.includes('partner-arrived') ?? false;
      expect(deliver(before).pendingEvent === event.id).toBe(!isArrivalMemory);
      const arrived = {
        ...before,
        flags: [...before.flags, 'partner-arrived'],
      };
      expect(deliver(arrived).pendingEvent === event.id).toBe(isArrivalMemory);
      expect(before.flags).not.toContain('partner-arrived');
    }
  });
});
