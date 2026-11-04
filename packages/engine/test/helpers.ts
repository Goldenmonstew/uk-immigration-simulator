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

/**
 * Sample timelines that send the rules down their PASS, FAIL and UNKNOWN
 * branches (bilingual and wording-export tests).
 */
export const SAMPLES: Record<string, PersonTimeline> = {
  default: timeline(),
  missing: timeline({
    english: undefined,
    lifeInTheUk: undefined,
    governmentDebt: undefined,
    incomeYears: [],
    episodes: timeline().episodes.map((e) => ({
      ...e,
      socCode: undefined,
      salary: undefined,
    })),
  }),
  adverse: timeline({
    english: { cefrLevel: 'B1' },
    governmentDebt: { outstanding: true },
    immigrationBreaches: [{ type: 'OVERSTAYING', date: '2021-01-01' }],
    benefits: [
      {
        benefitType: 'UNIVERSAL_CREDIT',
        from: '2023-01-01',
        to: '2023-06-30',
      },
      { benefitType: 'UNLISTED_BENEFIT', from: '2024-01-01' },
    ],
    absences: [{ from: '2021-01-01', to: '2021-12-31' }],
    incomeYears: [{ taxYear: '2025-26', earnings: 10000 }],
  }),
  criminality: timeline({ criminalRecord: [{ date: '2020-01-01' }] }),
  careWorker: timeline({
    episodes: timeline().episodes.map((e) => ({
      ...e,
      socCode: '6135',
      salary: 20000,
    })),
  }),
  // Refugee pathways (contracts §11): Article 31, missing repayment.
  coreProtection: timeline({
    episodes: [
      {
        route: 'CORE_PROTECTION',
        role: 'MAIN',
        validFrom: '2024-01-01',
        validTo: '2029-12-31',
      },
    ],
    immigrationBreaches: [
      { type: 'ILLEGAL_ENTRY', date: '2023-06-01', article31: true },
    ],
  }),
  // Education, public funds, outstanding repayment, another breach.
  protectionWorkAndStudy: timeline({
    episodes: [
      {
        route: 'CORE_PROTECTION',
        role: 'MAIN',
        validFrom: '2021-01-01',
        validTo: '2021-12-31',
      },
      {
        route: 'PROTECTION_WORK_AND_STUDY',
        role: 'MAIN',
        validFrom: '2022-01-01',
        validTo: '2028-12-31',
        sustainedActivity: 'EDUCATION',
      },
    ],
    benefits: [
      { benefitType: 'UNIVERSAL_CREDIT', from: '2023-01-01', to: '2023-06-30' },
    ],
    immigrationBreaches: [
      { type: 'ILLEGAL_ENTRY', date: '2020-06-01' },
      { type: 'OVERSTAYING', date: '2020-09-01' },
    ],
    asylumSupportRepayment: 'OUTSTANDING',
  }),
  // Contribution through work, not yet three years; on a repayment plan.
  protectionWork: timeline({
    episodes: [
      {
        route: 'PROTECTION_WORK_AND_STUDY',
        role: 'MAIN',
        validFrom: '2024-01-01',
        validTo: '2029-12-31',
        sustainedActivity: 'WORK',
      },
    ],
    asylumSupportRepayment: 'ON_PLAN',
  }),
  // Back on Core Protection after Protection Work and Study.
  backOnCoreProtection: timeline({
    episodes: [
      {
        route: 'PROTECTION_WORK_AND_STUDY',
        role: 'MAIN',
        validFrom: '2022-01-01',
        validTo: '2024-12-31',
      },
      {
        route: 'CORE_PROTECTION',
        role: 'MAIN',
        validFrom: '2025-01-01',
        validTo: '2029-12-31',
      },
    ],
    asylumSupportRepayment: 'NOT_REQUIRED',
  }),
  // Another designated Safe and Legal route.
  safeAndLegal: timeline({
    episodes: [
      {
        route: 'SAFE_AND_LEGAL',
        role: 'MAIN',
        validFrom: '2023-01-01',
        validTo: '2028-12-31',
        resettlementScheme: 'OTHER_DESIGNATED',
      },
    ],
  }),
  // UK Resettlement Scheme before 2027-04-06: Legacy Safe and Legal.
  legacyResettlement: timeline({
    episodes: [
      {
        route: 'SAFE_AND_LEGAL',
        role: 'MAIN',
        validFrom: '2023-01-01',
        validTo: '2028-12-31',
        resettlementScheme: 'UK_RESETTLEMENT_SCHEME',
      },
    ],
  }),
  // Safe and Legal without the scheme; refugee dependant short circuit below.
  protectionDependant: timeline({
    episodes: [
      {
        route: 'SAFE_AND_LEGAL',
        role: 'DEPENDANT',
        validFrom: '2023-01-01',
        validTo: '2028-12-31',
        dependantOf: 'PARTNER',
      },
    ],
  }),
  // Current-law routes (contracts §12): Hong Kong BN(O) after Skilled Worker,
  // not yet 5 years; Global Talent without the criteria; family partner on
  // the 10-year route with a partner who is neither British nor settled.
  hongKongBno: timeline({
    episodes: [
      {
        route: 'SKILLED_WORKER',
        role: 'MAIN',
        validFrom: '2020-01-01',
        validTo: '2022-12-31',
      },
      {
        route: 'HONG_KONG_BNO',
        role: 'MAIN',
        validFrom: '2023-01-01',
        validTo: '2027-12-31',
      },
    ],
  }),
  globalTalent: timeline({
    episodes: [
      {
        route: 'GLOBAL_TALENT',
        role: 'MAIN',
        validFrom: '2023-01-01',
        validTo: '2027-12-31',
        globalTalentEndorsement: 'TECH_NATION',
      },
    ],
  }),
  familyPartner: timeline({
    episodes: [
      {
        route: 'FAMILY_PARTNER_OR_PARENT',
        role: 'MAIN',
        validFrom: '2019-01-01',
        validTo: '2027-12-31',
        familyPermission: 'PARTNER_TEN_YEAR',
      },
    ],
    relationships: [{ type: 'PARTNER', otherPartyStatus: 'OTHER' }],
  }),
  // 5-year partner route under the £29,000 rules, combined income below it,
  // with an absence (PD-070).
  familyPartnerFiveYear: timeline({
    episodes: [
      {
        route: 'FAMILY_PARTNER_OR_PARENT',
        role: 'MAIN',
        validFrom: '2024-06-01',
        validTo: '2027-11-30',
        familyPermission: 'PARTNER_FIVE_YEAR',
      },
    ],
    relationships: [{ type: 'PARTNER', otherPartyStatus: 'SETTLED' }],
    incomeYears: [
      { taxYear: '2025-26', earnings: 18000, partnerEarnings: 9000 },
    ],
    absences: [{ from: '2025-07-01', to: '2025-08-15' }],
  }),
  student: timeline({
    episodes: [
      {
        route: 'STUDENT',
        role: 'MAIN',
        validFrom: '2024-09-01',
        validTo: '2027-09-01',
      },
    ],
  }),
};
