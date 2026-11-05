import { evaluate } from '@uk-immigration/engine';
import type {
  IsoDate,
  Locale,
  PersonTimeline,
  RuleResult,
  RuleSetId,
  SimulationResult,
} from '@uk-immigration/engine';
import { publicLuck } from './cards/luck';
import { skilledWorker } from './characters/skilled-worker';
import type { Card, Effect, GameState } from './types';

export const TURNS = 10;
export const TURN_MONTHS = 12;
export const LUCK_CHANCE = 0.5;
export const characters = [skilledWorker];

const addDays = (date: IsoDate, days: number): IsoDate =>
  new Date(Date.parse(date) + days * 86_400_000).toISOString().slice(0, 10);

function addMonths(date: IsoDate, months: number): IsoDate {
  const [year, month, day] = date.split('-').map(Number);
  const target = new Date(Date.UTC(year, month - 1 + months, 1));
  const lastDay = new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0),
  ).getUTCDate();
  target.setUTCDate(Math.min(day, lastDay));
  return target.toISOString().slice(0, 10);
}

function characterOf(id: string) {
  const character = characters.find((item) => item.id === id);
  if (!character) throw new Error(`Unknown character: ${id}`);
  return character;
}

function currentEpisode(timeline: PersonTimeline, date: IsoDate) {
  return timeline.episodes
    .filter((episode) => episode.validFrom <= date && date <= episode.validTo)
    .sort((a, b) => b.validFrom.localeCompare(a.validFrom))[0];
}

function applyEffects(
  timeline: PersonTimeline,
  date: IsoDate,
  effects: Effect[],
) {
  for (const effect of effects) {
    switch (effect.type) {
      case 'absence': {
        const from = addDays(date, effect.startOffsetDays);
        timeline.absences.push({ from, to: addDays(from, effect.days - 1) });
        break;
      }
      case 'income': {
        const startYear =
          Number(date.slice(0, 4)) -
          (date.slice(5) < '04-06' ? 1 : 0) +
          (effect.taxYear === 'next' ? 1 : 0);
        const taxYear = `${startYear}-${String((startYear + 1) % 100).padStart(2, '0')}`;
        let income = timeline.incomeYears.find(
          (year) => year.taxYear === taxYear,
        );
        if (!income) {
          income = { taxYear };
          timeline.incomeYears.push(income);
        }
        if (effect.earnings !== undefined) income.earnings = effect.earnings;
        if (effect.partnerEarnings !== undefined)
          income.partnerEarnings = effect.partnerEarnings;
        break;
      }
      case 'episode':
        Object.assign(currentEpisode(timeline, date), effect.patch);
        break;
      case 'newEpisode': {
        const current = currentEpisode(timeline, date);
        if (current) {
          current.validTo = addDays(date, -1);
          if (current.validTo < current.validFrom) {
            timeline.episodes.splice(timeline.episodes.indexOf(current), 1);
          }
        }
        const validFrom = addDays(date, effect.gapDays ?? 0);
        timeline.episodes.push({
          ...effect.episode,
          validFrom,
          validTo: addDays(addMonths(validFrom, effect.durationMonths), -1),
        });
        break;
      }
      case 'benefit': {
        const from = addDays(date, effect.startOffsetDays);
        timeline.benefits.push({
          ...effect.benefit,
          from,
          ...(effect.months !== undefined && {
            to: addDays(addMonths(from, effect.months), -1),
          }),
        });
        break;
      }
      case 'relationship':
        if (effect.remove)
          timeline.relationships = timeline.relationships.filter(
            (item) => item.type !== effect.remove,
          );
        if (effect.add) timeline.relationships.push(effect.add);
        break;
      case 'english':
        timeline.english = { cefrLevel: effect.cefrLevel };
        break;
      case 'lifeInTheUk':
        timeline.lifeInTheUk = { passed: true };
        break;
      case 'breach':
        timeline.immigrationBreaches.push({
          ...effect.breach,
          date: addDays(date, effect.offsetDays ?? 0),
        });
        break;
      case 'criminal':
        timeline.criminalRecord.push({
          ...effect.event,
          date: addDays(date, effect.offsetDays ?? 0),
        });
        break;
      case 'timeline':
        Object.assign(timeline, effect.patch);
        break;
      case 'none':
        break;
    }
  }
}

function mulberry32(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), state | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function drawLuck(state: GameState): GameState {
  // Two draws per turn make the stream reproducible without storing a PRNG.
  const random = mulberry32(state.seed);
  for (let i = 1; i < state.turn; i++) {
    random();
    random();
  }
  const chance = random();
  const index = random();
  const available = [
    ...publicLuck,
    ...characterOf(state.characterId).luckPool,
  ].filter((card) => !state.drawnLuck.includes(card.id));
  if (chance >= LUCK_CHANCE || available.length === 0) return state;
  const card = available[Math.floor(index * available.length)];
  return {
    ...state,
    phase: 'luck',
    pendingLuck: card.id,
    drawnLuck: [...state.drawnLuck, card.id],
  };
}

export function startGame(
  characterId: string,
  seed: number,
  locale: Locale = 'zh-CN',
): GameState {
  const character = characterOf(characterId);
  const timeline = structuredClone(character.timeline);
  const state: GameState = {
    characterId,
    seed,
    locale,
    turn: 1,
    simulationDate: character.startDate,
    timeline,
    phase: 'choice',
    drawnLuck: [],
    log: [],
    result: evaluate({ simulationDate: character.startDate, timeline, locale }),
  };
  return isOver(state) ? { ...state, phase: 'ended' } : drawLuck(state);
}

export function currentCard(state: GameState): Card | undefined {
  if (isOver(state)) return undefined;
  const character = characterOf(state.characterId);
  if (state.phase === 'luck') {
    return [...publicLuck, ...character.luckPool].find(
      (card) => card.id === state.pendingLuck,
    );
  }
  const card = character.script[state.turn - 1];
  return state.log.some(
    (entry) => entry.turn === state.turn && entry.cardId === card.id,
  )
    ? undefined
    : card;
}

export function choose(state: GameState, choiceId: string): GameState {
  const card = currentCard(state);
  const choice = card?.choices.find((item) => item.id === choiceId);
  if (!card || !choice) throw new Error(`Choice is not available: ${choiceId}`);
  const timeline = structuredClone(state.timeline);
  applyEffects(timeline, state.simulationDate, choice.effects);
  const result = evaluate({
    simulationDate: state.simulationDate,
    timeline,
    locale: state.locale,
  });
  const next: GameState = {
    ...state,
    timeline,
    result,
    phase: 'choice',
    log: [
      ...state.log,
      {
        turn: state.turn,
        cardId: card.id,
        choiceId,
        before: state.result,
        after: result,
      },
    ],
  };
  delete next.pendingLuck;
  if (isOver(next)) next.phase = 'ended';
  return next;
}

export function advance(state: GameState): GameState {
  if (isOver(state)) return state;
  if (currentCard(state)) throw new Error('Resolve this turn before advancing');
  const simulationDate = addMonths(state.simulationDate, TURN_MONTHS);
  const next: GameState = {
    ...state,
    turn: state.turn + 1,
    simulationDate,
    phase: 'choice',
    result: evaluate({
      simulationDate,
      timeline: state.timeline,
      locale: state.locale,
    }),
  };
  return isOver(next) ? { ...next, phase: 'ended' } : drawLuck(next);
}

export function isOver(state: GameState): boolean {
  return (
    state.phase === 'ended' ||
    Object.values(state.result.byRuleSet).some(
      (column) => column?.outcome === 'REQUIRES_REGULATED_REVIEW',
    ) ||
    (state.turn === TURNS &&
      state.log.some(
        (entry) =>
          entry.turn === TURNS &&
          entry.cardId === characterOf(state.characterId).script[TURNS - 1].id,
      ))
  );
}

export interface RuleChange {
  id: string;
  before: RuleResult['status'] | undefined;
  after: RuleResult['status'] | undefined;
}

export function changedRules(
  before: SimulationResult,
  after: SimulationResult,
  ruleSetId: RuleSetId,
): RuleChange[] {
  const previous = new Map(
    before.byRuleSet[ruleSetId]?.rules.map((rule) => [rule.id, rule.status]),
  );
  const next = new Map(
    after.byRuleSet[ruleSetId]?.rules.map((rule) => [rule.id, rule.status]),
  );
  return [...new Set([...previous.keys(), ...next.keys()])]
    .filter((id) => previous.get(id) !== next.get(id))
    .map((id) => ({ id, before: previous.get(id), after: next.get(id) }));
}
