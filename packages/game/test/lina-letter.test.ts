import { expect, test } from 'vitest';
import {
  characters,
  currentEvent,
  mailbox,
  newGame,
  readMail,
  resolve,
  sleep,
  townsfolk,
} from '../src';
import { commonEvents } from '../src/events/common';
import { heartEvents, townHeartLetters } from '../src/npcs';
import { clear, completeQuarter } from './helpers';

test('Lina’s farewell scene leaves a shared memory for either choice', () => {
  const letter = townHeartLetters[0];
  const farewell = heartEvents.find((event) => event.id === 'heart-lina-8')!;
  expect(townHeartLetters).toHaveLength(1);
  expect(letter).toMatchObject({ once: true, channel: 'letter' });
  expect(letter.heart).toBeUndefined();
  expect(letter.requires).toContain('lina-left');
  const memory = letter.requires!.filter((flag) => flag !== 'lina-left');
  expect(memory).toHaveLength(1);
  for (const choice of farewell.choices) {
    const before = clear();
    before.pendingEvent = farewell.id;
    const after = resolve(before, choice.id);
    expect(after.flags).toEqual(expect.arrayContaining(memory));
  }
});

test('the ordinary letter requires both departure and the shared memory, is readable without Lina, and cannot repeat', () => {
  const letter = townHeartLetters[0];
  for (const missing of letter.requires!) {
    const before = clear();
    before.flags = letter.requires!.filter((flag) => flag !== missing);
    before.day.deliveries = [{ eventId: letter.id, channel: 'letter' }];
    expect(readMail(before).pendingEvent).toBeUndefined();
    expect(readMail(before).firedEvents).not.toContain(letter.id);
  }
  for (const choice of letter.choices) {
    const before = clear();
    before.stats.mood = 50;
    before.flags = [...letter.requires!];
    before.day.deliveries = [{ eventId: letter.id, channel: 'letter' }];
    expect(townsfolk(before).map((npc) => npc.id)).not.toContain('lina');
    expect(mailbox(before)).toContain(letter.id);
    const opened = readMail(before);
    expect(currentEvent(opened)?.id).toBe(letter.id);
    expect(mailbox(opened)).not.toContain(letter.id);
    const after = resolve(opened, choice.id);
    expect(after.timeline).toEqual(before.timeline);
    expect(after.firedEvents.filter((id) => id === letter.id)).toHaveLength(1);
    const restored = JSON.parse(JSON.stringify(after));
    restored.day.deliveries = [{ eventId: letter.id, channel: 'letter' }];
    expect(readMail(restored).pendingEvent).toBeUndefined();
  }
});

test('the replacement letter is drawn by the ordinary seasonal pool and delivered to the mailbox', () => {
  const letter = townHeartLetters[0];
  const originalCommon = commonEvents.splice(0);
  const originalCharacter = characters[0].events;
  characters[0].events = [];
  try {
    let state = clear(newGame('skilled-worker', 1));
    state.flags.push(...letter.requires!);
    state = completeQuarter(state);
    expect([
      ...state.eventQueue,
      ...state.day.deliveries.map((delivery) => delivery.eventId),
    ]).toContain(letter.id);
    for (let day = 0; day < 3 && !currentEvent(state); day++) {
      state = readMail(state);
      if (!currentEvent(state)) state = sleep(state);
    }
    expect(currentEvent(state)?.id).toBe(letter.id);
    state = resolve(state, letter.choices[0].id);
    state = completeQuarter(state);
    expect(state.firedEvents.filter((id) => id === letter.id)).toHaveLength(1);
    expect(state.eventQueue).not.toContain(letter.id);
    expect(mailbox(state)).not.toContain(letter.id);
  } finally {
    commonEvents.push(...originalCommon);
    characters[0].events = originalCharacter;
  }
});
