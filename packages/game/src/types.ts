import type {
  BenefitEpisode,
  CriminalEvent,
  DecisionOutcome,
  EnglishEvidence,
  ImmigrationBreach,
  ImmigrationEpisode,
  IsoDate,
  Locale,
  PersonTimeline,
  Relationship,
  Route,
  RuleSetId,
  SimulationResult,
} from '@uk-immigration/engine';

export type Text = { zhCN: string; en: string };
export type StatKey = 'money' | 'mood' | 'health' | 'english' | 'career';
export type LocationId =
  'home' | 'work' | 'college' | 'gp' | 'pub' | 'council' | 'visa' | 'station';
export type EndingId =
  'settled' | 'left' | 'overstayed' | 'criminal' | 'timeout';
/** Calendar quarters: 1 winter, 2 spring, 3 summer, 4 autumn. */
export type Quarter = 1 | 2 | 3 | 4;
export interface Character {
  id: string;
  name: Text;
  intro: Text;
  /** Relative to the client's game asset directory. */
  sprite: string;
  startDate: IsoDate;
  timeline: PersonTimeline;
  stats: Record<StatKey, number>;
  events: GameEvent[];
  achievements?: Achievement[];
}
export interface GameEvent {
  id: string;
  title: Text;
  text: Text;
  weight: number;
  season?: Quarter;
  once?: boolean;
  requires?: string[];
  forbids?: string[];
  when?: Condition[];
  choices: Choice[];
}
export interface Choice {
  id: string;
  label: Text;
  effects: Effect[];
  sets?: string[];
  note?: Text;
}
/** Conditions within an array are ANDed; year is the one-based game year. */
export type Condition =
  | { stat: StatKey; min?: number; max?: number }
  | { yearMin?: number; yearMax?: number }
  | { route: Route }
  | { flag: string }
  | { visaMonthsLeftMax: number };
export type Effect =
  | { type: 'stat'; key: StatKey; delta: number }
  | { type: 'money'; delta: number }
  | { type: 'absence'; startOffsetDays: number; days: number }
  | {
      type: 'income';
      taxYear: 'current' | 'next';
      earnings?: number;
      partnerEarnings?: number;
    }
  | { type: 'episode'; patch: Partial<Omit<ImmigrationEpisode, 'validFrom'>> }
  | {
      type: 'newEpisode';
      episode: Omit<ImmigrationEpisode, 'validFrom' | 'validTo'>;
      durationMonths: number;
      gapDays?: number;
      /** Renewal appends at expiry; default replaces permission from today. */
      start?: 'afterCurrent';
    }
  | {
      type: 'benefit';
      benefit: Omit<BenefitEpisode, 'from' | 'to'>;
      startOffsetDays: number;
      months?: number;
    }
  | { type: 'relationship'; add?: Relationship; remove?: Relationship['type'] }
  | {
      type: 'english';
      cefrLevel: Extract<EnglishEvidence, { cefrLevel: unknown }>['cefrLevel'];
    }
  | { type: 'lifeInTheUk' }
  | {
      type: 'breach';
      breach: Omit<ImmigrationBreach, 'date'>;
      offsetDays?: number;
    }
  | {
      type: 'criminal';
      event: Omit<CriminalEvent, 'date'>;
      offsetDays?: number;
    }
  | {
      type: 'timeline';
      patch: Pick<
        PersonTimeline,
        'cashSavings' | 'partnerSpecifiedBenefit' | 'governmentDebt'
      >;
    }
  | { type: 'ending'; ending: EndingId }
  | { type: 'none' };
export interface LocationAction {
  id: string;
  location: LocationId;
  label: Text;
  /** Action points, default 1; money is represented by effects. */
  cost?: number;
  effects: Effect[];
  when?: Condition[];
}
export interface Location {
  id: LocationId;
  name: Text;
}
export interface Achievement {
  id: string;
  name: Text;
  description: Text;
  check: (state: GameState) => boolean;
}
export type LogEntry = {
  year: number;
  quarter: Quarter;
  kind: 'action' | 'event' | 'quarter' | 'ending';
  id: string;
  choiceId?: string;
  text: Text;
  statDeltas?: Partial<Record<StatKey, number>>;
};
export interface GameState {
  version: 2;
  characterId: string;
  /** Initial seed, unchanged throughout play. */
  seed: number;
  locale: Locale;
  /** One-based game year, 1–10; four elapsed quarters per game year. */
  year: number;
  quarter: Quarter;
  date: IsoDate;
  timeline: PersonTimeline;
  stats: Record<StatKey, number>;
  actionsLeft: number;
  flags: string[];
  firedEvents: string[];
  pendingEvent?: string;
  /** Remaining scheduled events; rechecked when promoted to pendingEvent. */
  eventQueue: string[];
  /** Serializable mulberry32 cursor, so restoring JSON preserves the stream. */
  randomState: number;
  log: LogEntry[];
  result: SimulationResult;
  ending?: EndingId;
  achievements: string[];
}
export type Progress = Record<
  RuleSetId,
  {
    outcome: DecisionOutcome;
    earliestDate?: IsoDate;
    /** Elapsed residence / engine earliest-date interval, clamped to 0–100. */
    percent: number;
  }
>;
