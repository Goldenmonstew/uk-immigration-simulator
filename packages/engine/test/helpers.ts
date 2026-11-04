import { runRule } from '../src/rule';
import type {
  ImmigrationEpisode,
  PersonTimeline,
  Rule,
  RuleContext,
  RuleOutcome,
} from '../src/types';

export const SIMULATION_DATE = '2026-11-04';

/**
 * A Skilled Worker since 2019-11-01 earning £60,000 who meets every
 * requirement under both rule sets on SIMULATION_DATE. Tests override one
 * field at a time.
 */
export function timeline(
  overrides: Partial<PersonTimeline> = {},
): PersonTimeline {
  return {
    dateOfBirth: '1990-01-15',
    nationality: 'IND',
    episodes: [
      {
        route: 'SKILLED_WORKER',
        role: 'MAIN',
        validFrom: '2019-11-01',
        validTo: '2022-10-31',
        socCode: '2136',
        salary: 60000,
      },
      {
        route: 'SKILLED_WORKER',
        role: 'MAIN',
        validFrom: '2022-11-01',
        validTo: '2027-10-31',
        socCode: '2136',
        salary: 60000,
      },
    ],
    absences: [],
    incomeYears: [
      '2019-20',
      '2020-21',
      '2021-22',
      '2022-23',
      '2023-24',
      '2024-25',
      '2025-26',
    ].map((taxYear) => ({ taxYear, earnings: 60000 })),
    benefits: [],
    relationships: [],
    english: { cefrLevel: 'B2' },
    lifeInTheUk: { passed: true },
    criminalRecord: [],
    immigrationBreaches: [],
    governmentDebt: { outstanding: false },
    ...overrides,
  };
}

export function run(
  rule: Rule,
  overrides: Partial<PersonTimeline> = {},
  simulationDate = SIMULATION_DATE,
): RuleOutcome {
  const ctx: RuleContext = { timeline: timeline(overrides), simulationDate };
  return runRule(rule, ctx);
}

/** The default timeline's permissions, held as the principal's dependant. */
export function asDependant(
  dependantOf: ImmigrationEpisode['dependantOf'] = 'PARTNER',
): ImmigrationEpisode[] {
  return timeline().episodes.map(({ route, validFrom, validTo }) => ({
    route,
    role: 'DEPENDANT',
    validFrom,
    validTo,
    dependantOf,
  }));
}
