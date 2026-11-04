// SRC-001 p19 Individual A: a social worker below £50,271 can use the
// public-service five-year pathway. Supplemented facts: all dates, nationality,
// Skilled Worker permission, SOC 2020 2461 (the brief's social-worker code),
// and annual salary / earnings of £42,000. Continuous residence exceeds five
// years; no British connection or household income shortcut is assumed.
// All other requirements are assumed met: B2, Life in the UK, no absences,
// public funds, criminality, breaches or debt. No exact date is asserted.
import type { Fixture } from '../../engine/src/types';

const TAX_YEARS = ['2021-22', '2022-23', '2023-24', '2024-25', '2025-26'];

export const esP19IndividualAPublicService: Fixture = {
  id: 'ES-OFFICIAL-P19-INDIVIDUAL-A',
  title: 'Individual A: social worker on the public-service pathway',
  source: { srcId: 'SRC-001', locator: 'p19' },
  request: {
    simulationDate: '2026-11-04',
    timeline: {
      dateOfBirth: '1988-04-12',
      nationality: 'IND',
      episodes: [
        {
          route: 'SKILLED_WORKER',
          role: 'MAIN',
          validFrom: '2021-04-06',
          validTo: '2024-04-05',
          socCode: '2461',
          salary: 42000,
        },
        {
          route: 'SKILLED_WORKER',
          role: 'MAIN',
          validFrom: '2024-04-06',
          validTo: '2027-04-05',
          socCode: '2461',
          salary: 42000,
        },
      ],
      absences: [],
      incomeYears: TAX_YEARS.map((taxYear) => ({ taxYear, earnings: 42000 })),
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
