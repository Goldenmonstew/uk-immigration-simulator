import { evaluate } from '@uk-immigration/engine';
import type {
  IncomeYear,
  ImmigrationEpisode,
  Locale,
  PersonTimeline,
  SimulationResult,
} from '@uk-immigration/engine';
import { t, type TranslationKey } from '../i18n';
import { displayedRuleSets, policyAsOf } from './policy';

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
  // Append to preserve the step numbers in version 1 drafts.
  'principal',
] as const;
export const shortCircuitKeys = ['criminality'] as const;
export const screeningKeys = ['criminality', 'breach', 'debt'] as const;
export type ScreeningKey = (typeof screeningKeys)[number];
export type Screening = Record<ScreeningKey, '' | 'yes' | 'no'> & {
  // Version 1 drafts may retain this obsolete answer; it is ignored.
  protection?: '' | 'yes' | 'no';
};

export interface Draft {
  version: 1;
  step: number;
  completed: boolean;
  simulationDate: string;
  screening: Screening;
  timeline: PersonTimeline;
  principal?: PersonTimeline;
  principalScreening?: Screening;
  principalStep?: number;
  principalCompleted?: boolean;
}

export const emptyScreening = (): Screening => ({
  criminality: '',
  breach: '',
  debt: '',
});

export function currentEpisode(draft: Draft) {
  return draft.timeline.episodes
    .filter(
      (episode) =>
        episode.validFrom <= draft.simulationDate &&
        draft.simulationDate <= episode.validTo,
    )
    .sort((a, b) => (a.validFrom < b.validFrom ? 1 : -1))[0];
}

export function needsPrincipal(draft: Draft): boolean {
  return currentEpisode(draft)?.role === 'DEPENDANT';
}

export function activePersonDraft(draft: Draft): Draft {
  return draft.principalStep === undefined
    ? draft
    : {
        ...draft,
        step: draft.principalStep,
        timeline: draft.principal!,
        screening: draft.principalScreening!,
      };
}

export function stepSequence(draft: Draft): number[] {
  if (draft.principalStep !== undefined) return [0, 1, 2, 3, 4, 5, 6, 7];
  return [0, 1, 2, ...(needsPrincipal(draft) ? [9] : []), 3, 4, 5, 6, 7, 8];
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
    screening: emptyScreening(),
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
  | { type: 'episode'; index: number; patch: Partial<ImmigrationEpisode> }
  | { type: 'screening'; key: ScreeningKey; answer: Screening[ScreeningKey] }
  | { type: 'date'; date: string }
  | { type: 'principal-start' }
  | { type: 'principal-return'; completed?: boolean };

export function draftReducer(state: Draft, action: Action): Draft {
  const editingPrincipal = state.principalStep !== undefined;
  switch (action.type) {
    case 'restore': {
      if (!action.draft.completed) return action.draft;
      const restored = { ...action.draft, principalStep: undefined };
      return { ...restored, step: stepSequence(restored).at(-1)! };
    }
    case 'step':
      return {
        ...state,
        [editingPrincipal ? 'principalStep' : 'step']: action.step,
      };
    case 'principal-start':
      return {
        ...state,
        completed: false,
        principalStep: 0,
        principal:
          state.principal ??
          draftReducer(createDraft(), {
            type: 'date',
            date: state.simulationDate,
          }).timeline,
        principalScreening: state.principalScreening ?? emptyScreening(),
      };
    case 'principal-return':
      return {
        ...state,
        principalStep: undefined,
        principalCompleted: action.completed ?? state.principalCompleted,
      };
    case 'timeline':
      return {
        ...state,
        completed: false,
        [editingPrincipal ? 'principal' : 'timeline']: {
          ...(editingPrincipal ? state.principal : state.timeline),
          ...action.patch,
        },
        ...(editingPrincipal && { principalCompleted: false }),
      };
    case 'episode': {
      const timeline = activePersonDraft(state).timeline;
      return draftReducer(state, {
        type: 'timeline',
        patch: {
          episodes: timeline.episodes.map((episode, index) => {
            if (index !== action.index) return episode;
            const routeChanged =
              action.patch.route !== undefined &&
              action.patch.route !== episode.route;
            const roleChanged =
              action.patch.role !== undefined &&
              action.patch.role !== episode.role;
            return {
              ...episode,
              ...action.patch,
              ...(routeChanged && {
                socCode: undefined,
                salary: undefined,
                immigrationSalaryList: undefined,
                resettlementScheme: undefined,
                sustainedActivity: undefined,
              }),
              ...(roleChanged && {
                dependantOf: undefined,
                immigrationSalaryList: undefined,
              }),
              ...((routeChanged || roleChanged) && {
                globalTalentEndorsement: undefined,
                globalTalentCriteria: undefined,
                familyPermission: undefined,
                innovatorSettlementCriteria: undefined,
                privateLifeRoute: undefined,
              }),
            };
          }),
        },
      });
    }
    case 'screening':
      return {
        ...state,
        completed: false,
        [editingPrincipal ? 'principalScreening' : 'screening']: {
          ...(editingPrincipal ? state.principalScreening : state.screening),
          [action.key]: action.answer,
        },
        ...(action.key === 'breach' &&
          action.answer === 'no' && {
            [editingPrincipal ? 'principal' : 'timeline']: {
              ...(editingPrincipal ? state.principal : state.timeline),
              immigrationBreaches: [],
            },
          }),
        ...(editingPrincipal && { principalCompleted: false }),
      };
    case 'date': {
      const withIncomeWindow = (timeline: PersonTimeline) => {
        const incomeYears = [...timeline.incomeYears];
        for (const taxYear of taxYearsBefore(action.date)) {
          if (!incomeYears.some((row) => row.taxYear === taxYear))
            incomeYears.push({ taxYear });
        }
        return { ...timeline, incomeYears };
      };
      return {
        ...state,
        completed: false,
        simulationDate: action.date,
        timeline: withIncomeWindow(state.timeline),
        ...(state.principal && {
          principal: withIncomeWindow(state.principal),
        }),
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

export function runSimulation(
  draft: Draft,
  locale: Locale = 'zh-CN',
): SimulationResult {
  const applicantRisk = shortCircuitKeys.find(
    (key) => draft.screening[key] === 'yes',
  );
  const principalRisk =
    needsPrincipal(draft) &&
    draft.principal &&
    shortCircuitKeys.find((key) => draft.principalScreening?.[key] === 'yes');
  const risk = applicantRisk || principalRisk;
  if (risk) {
    // The screening does not collect details needed for CriminalEvent entries.
    return {
      policyAsOf,
      byRuleSet: {},
      shortCircuit: {
        reason: 'CRIMINALITY',
        message: `${!applicantRisk && principalRisk ? t('principal.prefix', locale) : ''}${t('screening.message', locale)}`,
      },
    };
  }
  const result = evaluate({
    locale,
    ruleSetIds: displayedRuleSets.map((ruleSet) => ruleSet.id),
    simulationDate: draft.simulationDate,
    timeline: {
      ...draft.timeline,
      incomeYears: visibleIncomeYears(draft),
      governmentDebt: { outstanding: draft.screening.debt === 'yes' },
    },
    ...(draft.principal && {
      principal: {
        ...draft.principal,
        incomeYears: visibleIncomeYears({
          ...draft,
          timeline: draft.principal,
        }),
        ...(draft.principalScreening?.debt && {
          governmentDebt: {
            outstanding: draft.principalScreening.debt === 'yes',
          },
        }),
      },
    }),
  });
  return { ...result, policyAsOf };
}

export function runPrincipalSimulation(
  draft: Draft,
  locale: Locale = 'zh-CN',
): SimulationResult | undefined {
  if (!draft.principal) return undefined;
  return runSimulation(
    {
      ...draft,
      timeline: draft.principal,
      screening: draft.principalScreening ?? {
        ...emptyScreening(),
        debt: draft.principal.governmentDebt?.outstanding ? 'yes' : 'no',
      },
      principal: undefined,
      principalScreening: undefined,
    },
    locale,
  );
}

export type Errors = Record<string, TranslationKey>;

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
    if (!validDate(value)) errors[id] = 'error.date';
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
      errors[`${prefix}-to`] = 'error.range';
  };
  const amount = (id: string, value: number | undefined) => {
    if (value !== undefined && (!Number.isFinite(value) || value < 0))
      errors[id] = 'error.number';
  };
  const { timeline } = draft;
  switch (draft.step) {
    case 0:
      date('dob', timeline.dateOfBirth);
      if (
        timeline.dateOfBirth > today() ||
        timeline.dateOfBirth > draft.simulationDate
      )
        errors.dob = 'error.dob';
      if (!/^[A-Z]{3}$/.test(timeline.nationality))
        errors.nationality = 'error.nationality';
      if (draft.principalStep !== undefined && timeline.settled)
        date('principal-settled-date', timeline.settled.date);
      break;
    case 1:
      for (const key of screeningKeys)
        if (!draft.screening[key]) errors[key] = 'error.required';
      if (draft.screening.breach === 'yes') {
        if (!timeline.immigrationBreaches.length)
          errors.breaches = 'breaches.required';
        timeline.immigrationBreaches.forEach((breach, i) =>
          date(`breach-${i}-date`, breach.date),
        );
      }
      break;
    case 2:
      timeline.episodes.forEach((episode, i) => {
        range(`episode-${i}`, episode.validFrom, episode.validTo);
        if (episode.role === 'DEPENDANT' && !episode.dependantOf)
          errors[`episode-${i}-dependantOf`] = 'error.required';
        if (episode.route === 'SKILLED_WORKER') {
          if (episode.socCode && !/^\d{4}$/.test(episode.socCode))
            errors[`episode-${i}-soc`] = 'error.soc';
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
        errors.simulationDate = 'error.dob';
      break;
    case 9:
      if (!draft.principalCompleted) errors.principal = 'principal.required';
      break;
  }
  return errors;
}
