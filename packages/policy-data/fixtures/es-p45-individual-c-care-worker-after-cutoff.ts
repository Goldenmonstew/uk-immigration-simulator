// SRC-001 p45 Individual C: switched to care work after May 2025 and uses the
// standard 10-year pathway, without the care-worker transitional arrangement.
// Supplemented facts: exact dates, nationality, an earlier Graduate episode,
// Skilled Worker permission for Health and Care from 2025-06-06, SOC 2020 6135
// (the brief's care-worker code), and £30,000 salary / annual earnings. Application
// is after 10 years on the qualifying route; the Graduate year is not needed or
// counted. No accelerated earnings or British connection is assumed. Genuine
// sponsorship and employment are assumed; the contract has no separate evidence
// fields. All other requirements are met: B2, Life in the UK, no absences, public
// funds, criminality, breaches or debt. No exact settlement date is asserted.
import type { Fixture } from '../../engine/src/types';

const TAX_YEARS = [
  '2028-29',
  '2029-30',
  '2030-31',
  '2031-32',
  '2032-33',
  '2033-34',
  '2034-35',
];

export const esP45IndividualCCareWorkerAfterCutoff: Fixture = {
  id: 'ES-OFFICIAL-P45-INDIVIDUAL-C',
  title: 'Individual C: care worker switching after the transitional cutoff',
  source: { srcId: 'SRC-001', locator: 'p45' },
  request: {
    simulationDate: '2035-06-06',
    timeline: {
      dateOfBirth: '1988-04-12',
      nationality: 'IND',
      episodes: [
        {
          route: 'GRADUATE',
          role: 'MAIN',
          validFrom: '2024-06-06',
          validTo: '2025-06-05',
        },
        {
          route: 'SKILLED_WORKER',
          role: 'MAIN',
          validFrom: '2025-06-06',
          validTo: '2028-06-05',
          socCode: '6135',
          salary: 30000,
        },
        {
          route: 'SKILLED_WORKER',
          role: 'MAIN',
          validFrom: '2028-06-06',
          validTo: '2031-06-05',
          socCode: '6135',
          salary: 30000,
        },
        {
          route: 'SKILLED_WORKER',
          role: 'MAIN',
          validFrom: '2031-06-06',
          validTo: '2034-06-05',
          socCode: '6135',
          salary: 30000,
        },
        {
          route: 'SKILLED_WORKER',
          role: 'MAIN',
          validFrom: '2034-06-06',
          validTo: '2037-06-05',
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
    pathwayYears: 10,
  },
};
