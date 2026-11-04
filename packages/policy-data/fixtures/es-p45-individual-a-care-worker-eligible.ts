// SRC-001 p45 Individual A: entered the Health and Care route in 2023,
// remains in genuine sponsored care work and retains the five-year pathway.
// Supplemented facts: exact dates, nationality, Skilled Worker permission for
// Health and Care, SOC 2020 6135 (the brief's care-worker code), and £30,000
// salary / annual earnings, above the applicable £25,000 condition (p42).
// Application is after five years in 2028, rather than before residence is met.
// Genuine sponsorship and employment are assumed; the contract has no separate
// evidence fields. All other requirements are met: B2, Life in the UK, no
// absences, public funds, criminality, breaches or debt. No date is asserted.
import type { Fixture } from '../../engine/src/types';

const TAX_YEARS = ['2023-24', '2024-25', '2025-26', '2026-27', '2027-28'];

export const esP45IndividualACareWorkerEligible: Fixture = {
  id: 'ES-OFFICIAL-P45-INDIVIDUAL-A',
  title: 'Individual A: existing care worker meeting the requirements',
  source: { srcId: 'SRC-001', locator: 'p45' },
  request: {
    simulationDate: '2028-04-06',
    timeline: {
      dateOfBirth: '1988-04-12',
      nationality: 'IND',
      episodes: [
        {
          route: 'SKILLED_WORKER',
          role: 'MAIN',
          validFrom: '2023-04-06',
          validTo: '2026-04-05',
          socCode: '6135',
          salary: 30000,
        },
        {
          route: 'SKILLED_WORKER',
          role: 'MAIN',
          validFrom: '2026-04-06',
          validTo: '2029-04-05',
          socCode: '6135',
          salary: 30000,
        },
      ],
      absences: [],
      incomeYears: TAX_YEARS.map((taxYear) => ({ taxYear, earnings: 30000 })),
      benefits: [],
      relationships: [],
      english: { cefrLevel: 'B2' },
      lifeInTheUk: { passed: true },
      criminalRecord: [],
      immigrationBreaches: [],
      governmentDebt: { outstanding: false },
    },
  },
  expected: {
    ruleSetId: 'earned-settlement-2026-11',
    outcome: 'LIKELY_ELIGIBLE',
    pathwayYears: 5,
  },
};
