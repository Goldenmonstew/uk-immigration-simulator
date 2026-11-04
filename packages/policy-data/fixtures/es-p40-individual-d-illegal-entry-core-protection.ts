import type { Fixture } from '../../engine/src/types';

// SRC-001 p40 Individual D: arrives illegally by small boat, is granted
// protection and stays on Core Protection without sustained work, education
// or training: 20 years plus 10 for illegal entry, 30 years (p38, p40, p48).
// Supplementary facts as for Individual C (born 1995, illegal entry on
// 2026-08-10 as an adult, Article 31 not claimed, protection granted on
// 2027-03-01, English B2, Life in the UK passed, asylum support repaid),
// except that the person stays on Core Protection; the earnings entered do
// not matter on Core Protection. Assessed on 2030-01-01.
export const esP40IndividualDIllegalEntryCoreProtection: Fixture = {
  id: 'ES-OFFICIAL-P40-INDIVIDUAL-D',
  title: 'Individual D: illegal entry, stays on Core Protection',
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
          validTo: '2032-02-29',
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
      immigrationBreaches: [{ type: 'ILLEGAL_ENTRY', date: '2026-08-10' }],
      governmentDebt: { outstanding: false },
      asylumSupportRepayment: 'REPAID',
    },
  },
  expected: {
    ruleSetId: 'earned-settlement-2026-11',
    outcome: 'LIKELY_NOT_ELIGIBLE',
    pathwayYears: 30,
    earliestDate: '2057-03-01',
  },
};
