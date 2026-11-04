import type { Fixture } from '../../engine/src/types';

// SRC-001 p40 Individual B: granted protection, one year on Core Protection,
// then sustained employment and Protection Work and Study. The 10 years start
// on the move and the Core Protection year does not count, so settlement is
// possible 11 years after the grant (p38, p40).
// Supplementary facts: born 1995, granted protection on 2027-03-01, moves into
// sustained employment and onto Protection Work and Study on 2028-03-01,
// earns £20,000 in every tax year (later years entered as if circumstances
// stay the same), English B2, Life in the UK passed, asylum support repaid,
// no public funds, debt or criminal record; assessed on 2030-01-01.
export const esP40IndividualBCoreProtectionToWork: Fixture = {
  id: 'ES-OFFICIAL-P40-INDIVIDUAL-B',
  title: 'Individual B: Core Protection, then work',
  source: { srcId: 'SRC-001', locator: 'p40' },
  request: {
    simulationDate: '2030-01-01',
    timeline: {
      dateOfBirth: '1995-05-01',
      nationality: 'SDN',
      episodes: [
        {
          route: 'CORE_PROTECTION',
          role: 'MAIN',
          validFrom: '2027-03-01',
          validTo: '2028-02-29',
        },
        {
          route: 'PROTECTION_WORK_AND_STUDY',
          role: 'MAIN',
          validFrom: '2028-03-01',
          validTo: '2033-02-28',
          sustainedActivity: 'WORK',
        },
        {
          route: 'PROTECTION_WORK_AND_STUDY',
          role: 'MAIN',
          validFrom: '2033-03-01',
          validTo: '2038-08-31',
          sustainedActivity: 'WORK',
        },
      ],
      absences: [],
      incomeYears: [
        '2027-28',
        '2028-29',
        '2029-30',
        '2030-31',
        '2031-32',
        '2032-33',
        '2033-34',
        '2034-35',
        '2035-36',
        '2036-37',
        '2037-38',
      ].map((taxYear) => ({ taxYear, earnings: 20000 })),
      benefits: [],
      relationships: [],
      english: { cefrLevel: 'B2' },
      lifeInTheUk: { passed: true },
      criminalRecord: [],
      immigrationBreaches: [],
      governmentDebt: { outstanding: false },
      asylumSupportRepayment: 'REPAID',
    },
  },
  expected: {
    ruleSetId: 'earned-settlement-2026-11',
    outcome: 'LIKELY_NOT_ELIGIBLE',
    pathwayYears: 10,
    earliestDate: '2038-03-01',
    mustUnknown: ['ES-PROTECTION-CONTRIBUTION'],
  },
};
