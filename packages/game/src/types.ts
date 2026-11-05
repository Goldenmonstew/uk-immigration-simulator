import type {
  BenefitEpisode,
  CriminalEvent,
  EnglishEvidence,
  ImmigrationBreach,
  ImmigrationEpisode,
  IsoDate,
  Locale,
  PersonTimeline,
  Relationship,
  SimulationResult,
} from '@uk-immigration/engine';

export type Text = { zhCN: string; en: string };

export interface Character {
  id: string;
  name: Text;
  intro: Text;
  startDate: IsoDate;
  timeline: PersonTimeline;
  script: ChoiceCard[];
  luckPool: LuckCard[];
}

export interface ChoiceCard {
  id: string;
  kind: 'choice';
  title: Text;
  text: Text;
  choices: Choice[];
}

export interface LuckCard {
  id: string;
  kind: 'luck';
  title: Text;
  text: Text;
  choices: [Choice];
}

export type Card = ChoiceCard | LuckCard;

export interface Choice {
  id: string;
  label: Text;
  effects: Effect[];
  note?: Text;
}

export type Effect =
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
  | { type: 'none' };

export interface GameState {
  characterId: string;
  seed: number;
  locale: Locale;
  /** One-based, including the final turn. */
  turn: number;
  simulationDate: IsoDate;
  timeline: PersonTimeline;
  phase: 'luck' | 'choice' | 'ended';
  pendingLuck?: string;
  drawnLuck: string[];
  log: Array<{
    turn: number;
    cardId: string;
    choiceId: string;
    before: SimulationResult;
    after: SimulationResult;
  }>;
  result: SimulationResult;
}
