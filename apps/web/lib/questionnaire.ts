import { evaluate } from '@uk-immigration/engine';
import type {
  IncomeYear,
  PersonTimeline,
  SimulationResult,
} from '@uk-immigration/engine';
import { t } from '../i18n';
import { policyAsOf } from './policy';

export const steps = [
  'basic',
  'screening',
  'episodes',
  'absences',
  'income',
  'benefits',
  'relationships',
  'english',
  'date',
] as const;
export type ScreeningKey = 'criminality' | 'breach' | 'debt' | 'protection';
export const screeningKeys: ScreeningKey[] = [
  'criminality',
  'breach',
  'debt',
  'protection',
];
export type Screening = Record<ScreeningKey, '' | 'yes' | 'no'>;

export interface Draft {
  version: 1;
  step: number;
  completed: boolean;
  simulationDate: string;
  screening: Screening;
  timeline: PersonTimeline;
}

export function today(): string {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function taxYearsBefore(date: string): string[] {
  if (!date) return [];
  const year = Number(date.slice(0, 4));
  const currentStart = date.slice(5) >= '04-06' ? year : year - 1;
  return Array.from({ length: 7 }, (_, index) => {
    const start = currentStart - index - 1;
    return `${start}-${String(start + 1).slice(-2)}`;
  });
}

export function createDraft(): Draft {
  const simulationDate = today();
  return {
    version: 1,
    step: 0,
    completed: false,
    simulationDate,
    screening: { criminality: '', breach: '', debt: '', protection: '' },
    timeline: {
      dateOfBirth: '',
      nationality: '',
      episodes: [],
      absences: [],
      incomeYears: taxYearsBefore(simulationDate).map((taxYear) => ({
        taxYear,
      })),
      benefits: [],
      relationships: [],
      criminalRecord: [],
      immigrationBreaches: [],
    },
  };
}

type Action =
  | { type: 'restore'; draft: Draft }
  | { type: 'step'; step: number }
  | { type: 'timeline'; patch: Partial<PersonTimeline> }
  | { type: 'screening'; key: ScreeningKey; answer: Screening[ScreeningKey] }
  | { type: 'date'; date: string };

export function draftReducer(state: Draft, action: Action): Draft {
  switch (action.type) {
    case 'restore':
      return action.draft;
    case 'step':
      return { ...state, step: action.step };
    case 'timeline':
      return {
        ...state,
        completed: false,
        timeline: { ...state.timeline, ...action.patch },
      };
    case 'screening':
      return {
        ...state,
        completed: false,
        screening: { ...state.screening, [action.key]: action.answer },
      };
    case 'date': {
      const incomeYears = [...state.timeline.incomeYears];
      for (const taxYear of taxYearsBefore(action.date)) {
        if (!incomeYears.some((row) => row.taxYear === taxYear))
          incomeYears.push({ taxYear });
      }
      return {
        ...state,
        completed: false,
        simulationDate: action.date,
        timeline: { ...state.timeline, incomeYears },
      };
    }
  }
}

export function visibleIncomeYears(draft: Draft): IncomeYear[] {
  return taxYearsBefore(draft.simulationDate).map(
    (taxYear) =>
      draft.timeline.incomeYears.find((row) => row.taxYear === taxYear) ?? {
        taxYear,
      },
  );
}

export function runSimulation(draft: Draft): SimulationResult {
  const risk = screeningKeys.find((key) => draft.screening[key] === 'yes');
  if (risk) {
    // The screening contract has no event dates or protection-history field.
    // Do not fabricate CriminalEvent / ImmigrationBreach / episode entries.
    const reasons = {
      criminality: 'CRIMINALITY',
      breach: 'IMMIGRATION_BREACH',
      protection: 'PROTECTION',
      debt: 'OUTSIDE_FRAMEWORK',
    } as const;
    return {
      policyAsOf,
      byRuleSet: {},
      shortCircuit: { reason: reasons[risk], message: t('screening.message') },
    };
  }
  return evaluate({
    simulationDate: draft.simulationDate,
    timeline: {
      ...draft.timeline,
      incomeYears: visibleIncomeYears(draft),
      governmentDebt: { outstanding: false },
    },
  });
}

export type Errors = Record<string, string>;

function validDate(value: string): boolean {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
  );
}

export function validateStep(draft: Draft): Errors {
  const errors: Errors = {};
  const date = (id: string, value: string) => {
    if (!validDate(value)) errors[id] = t('error.date');
  };
  const range = (
    prefix: string,
    from: string,
    to: string,
    optionalEnd = false,
  ) => {
    date(`${prefix}-from`, from);
    if (to || !optionalEnd) date(`${prefix}-to`, to);
    if (validDate(from) && validDate(to) && to < from)
      errors[`${prefix}-to`] = t('error.range');
  };
  const amount = (id: string, value: number | undefined) => {
    if (value !== undefined && (!Number.isFinite(value) || value < 0))
      errors[id] = t('error.number');
  };
  const { timeline } = draft;
  switch (draft.step) {
    case 0:
      date('dob', timeline.dateOfBirth);
      if (
        timeline.dateOfBirth > today() ||
        timeline.dateOfBirth > draft.simulationDate
      )
        errors.dob = t('error.dob');
      if (!/^[A-Z]{3}$/.test(timeline.nationality))
        errors.nationality = t('error.nationality');
      break;
    case 1:
      for (const key of screeningKeys)
        if (!draft.screening[key]) errors[key] = t('error.required');
      break;
    case 2:
      timeline.episodes.forEach((episode, i) => {
        range(`episode-${i}`, episode.validFrom, episode.validTo);
        if (episode.route === 'SKILLED_WORKER') {
          if (episode.socCode && !/^\d{4}$/.test(episode.socCode))
            errors[`episode-${i}-soc`] = t('error.soc');
          amount(`episode-${i}-salary`, episode.salary);
        }
      });
      break;
    case 3:
      timeline.absences.forEach((absence, i) =>
        range(`absence-${i}`, absence.from, absence.to),
      );
      break;
    case 4:
      visibleIncomeYears(draft).forEach((row) => {
        amount(`${row.taxYear}-earnings`, row.earnings);
        amount(`${row.taxYear}-partner`, row.partnerEarnings);
      });
      break;
    case 5:
      timeline.benefits.forEach((benefit, i) =>
        range(`benefit-${i}`, benefit.from, benefit.to ?? '', true),
      );
      break;
    case 8:
      date('simulationDate', draft.simulationDate);
      if (
        validDate(draft.simulationDate) &&
        timeline.dateOfBirth > draft.simulationDate
      )
        errors.simulationDate = t('error.dob');
      break;
  }
  return errors;
}
