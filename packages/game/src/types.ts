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
  channel?: Channel;
  speaker?: NpcId;
  heart?: { npc: NpcId; hearts: number };
}
export interface Choice {
  id: string;
  label: Text;
  effects: Effect[];
  sets?: string[];
  note?: Text;
}
/** Conditions within an array are ANDed; year is the one-based game year. */
export type V2Condition =
  | { stat: StatKey; min?: number; max?: number }
  | { yearMin?: number; yearMax?: number }
  | { route: Route }
  | { flag: string }
  | { visaMonthsLeftMax: number };
export type V2Effect =
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
  version: 3;
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
  dayNumber: number;
  day: DayState;
  inventory: Record<ItemId, number>;
  friendship: Record<NpcId, number>;
  plots: Plot[];
  heard: string[];
  outcome?: Outcome;
  /** A trip waiting for event choices; appended to absences only after return. */
  trip?: { from: IsoDate; to: IsoDate };
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

export type DayKind = 'workday' | 'weekend' | 'special';
export type Weather = 'sunny' | 'cloudy' | 'rain' | 'snow';
export type PlaceId =
  | LocationId // home, work, college, gp, pub, council, visa, station
  | 'shop'
  | 'cafe'
  | 'library'
  | 'allotment'
  | 'pond'
  | 'board'
  | 'green'
  | 'bench';
export type AnchorId =
  | 'home-street'
  | 'high-street-west'
  | 'high-street-east'
  | 'bus-stop'
  | 'postbox'
  | 'park-bench'
  | 'park-pond'
  | 'park-path'
  | 'allotment-gate'
  | 'allotment-plots'
  | 'green-centre'
  | 'green-stall'
  | 'station-front'
  | 'college-steps'
  | 'pub-garden'
  | 'library-steps';
/** 'margaret' | 'priya' | 'ade' | 'helen' | 'dave' | 'rahman' | 'lina' | 'gareth' plus household ids. */
export type NpcId = string;
/** Seeds are `seed-<crop>`; the client maps unknown ids to a fallback icon. */
export type ItemId = string;
export type FestivalId =
  | 'lunar-new-year'
  | 'may-day'
  | 'summer-fair'
  | 'bonfire-night'
  | 'christmas-market';
export type Channel =
  'morning' | 'letter' | 'phone' | `npc:${NpcId}` | `place:${PlaceId}`;

export interface Place {
  id: PlaceId;
  name: Text;
  kind: 'building' | 'outdoor';
  hours?: { opens: number; closes: number; dayKinds?: DayKind[] }; // minutes since midnight
}
/** Replaces LocationAction. v2 ids stay where the action survives:
 *  rest, work, overtime, class, exam, gp, relax, assessment, extend, settle,
 *  travel-1, travel-3, travel-6, leave. */
export interface Activity {
  id: string;
  place: PlaceId;
  label: Text;
  minutes: number;
  effects: Effect[];
  when?: Condition[];
  oncePerDay?: boolean;
}
export type Condition =
  | V2Condition
  | { dayKind: DayKind }
  | { weather: Weather }
  | { festival: FestivalId }
  | { npc: NpcId; heartsMin?: number; heartsMax?: number }
  | { item: ItemId; min?: number }
  | { minuteMin?: number; minuteMax?: number };
export type Effect =
  | V2Effect
  | { type: 'item'; item: ItemId; delta: number }
  | { type: 'friendship'; npc: NpcId; delta: number };
export interface Npc {
  id: NpcId;
  name: Text;
  role: Text;
  characters?: string[]; // household members appear only for these characters
  /** First matching rule wins; stops are sorted by minute. */
  schedule: {
    dayKinds?: DayKind[];
    weather?: Weather[];
    festival?: boolean;
    stops: { from: number; at: PlaceId | AnchorId }[];
  }[];
  gifts: { loved: ItemId[]; liked: ItemId[]; disliked: ItemId[] };
  reactions: Record<'loved' | 'liked' | 'neutral' | 'disliked', Text>;
  lines: {
    id: string;
    text: Text;
    heartsMin?: number;
    heartsMax?: number;
    season?: Quarter;
    weather?: Weather[];
    dayKinds?: DayKind[];
    festival?: FestivalId;
    when?: Condition[];
    requires?: string[];
    forbids?: string[];
    once?: boolean;
  }[];
}
export interface Item {
  id: ItemId;
  name: Text;
  kind: 'seed' | 'crop' | 'fish' | 'food' | 'gift' | 'junk';
  price?: number; // shop price, game setting; nothing is sold back
  edible?: { mood?: number; health?: number };
  grows?: { crop: ItemId; days: number; seasons: Quarter[] };
}
export interface Recipe {
  id: string;
  label: Text;
  needs: Record<ItemId, number>;
  makes: ItemId;
  minutes: number;
}
export interface Festival {
  id: FestivalId;
  name: Text;
  season: Quarter;
  text: Text;
}
export interface Plot {
  seed?: ItemId;
  growth: number;
  wateredOn?: number;
} // wateredOn is a dayNumber
export interface DayState {
  index: 0 | 1 | 2;
  kind: DayKind;
  date: IsoDate; // display and festival only; timeline effects still use state.date
  minute: number; // minutes since midnight: 420 at wake-up, never above 1440
  /** End time of an activity interrupted by a phone call. */
  resumeMinute?: number;
  weather: Weather;
  festival?: FestivalId;
  place?: PlaceId;
  done: string[];
  talked: NpcId[];
  gifted: NpcId[];
  deliveries: { eventId: string; channel: Channel; minute?: number }[]; // undelivered events of this day
}
export type Outcome = {
  kind:
    | 'activity'
    | 'talk'
    | 'gift'
    | 'catch'
    | 'harvest'
    | 'cook'
    | 'buy'
    | 'eat'
    | 'sleep'
    | 'travel';
  npc?: NpcId;
  text?: Text;
  items?: Record<ItemId, number>;
  statDeltas?: Partial<Record<StatKey, number>>;
};
