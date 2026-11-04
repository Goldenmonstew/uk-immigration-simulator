// SRC-001 p45 Individual B: entered the Health and Care route in 2023 but
// does not meet all settlement requirements after five years. The source does
// not identify the failed requirement. To make that case concrete, this fixture
// supplements a £20,000 salary / annual earnings below the applicable £25,000
// salary condition (p42), while still meeting minimum Earned Settlement earnings.
// This is a modelling choice, not a claim about the official person's salary;
// no specific mustFail rule or eventual pathway length is asserted.
// Other supplemented facts: exact dates, nationality, Skilled Worker permission
// for Health and Care and SOC 2020 6135 (the brief's care-worker code). Genuine
// sponsored employment is assumed. All other requirements are met: five years'
// residence, B2, Life in the UK, no absences, public funds, criminality, breaches
// or debt. The contract has no separate sponsorship / employment evidence.
import type { Fixture } from '../../engine/src/types';

const TAX_YEARS = ['2023-24', '2024-25', '2025-26', '2026-27', '2027-28'];

export const esP45IndividualBCareWorkerIneligible: Fixture = {
  id: 'ES-OFFICIAL-P45-INDIVIDUAL-B',
  title: 'Individual B: existing care worker not meeting the requirements',
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
          salary: 20000,
        },
        {
          route: 'SKILLED_WORKER',
          role: 'MAIN',
          validFrom: '2026-04-06',
          validTo: '2029-04-05',
          socCode: '6135',
          salary: 20000,
        },
      ],
      absences: [],
      incomeYears: TAX_YEARS.map((taxYear) => ({ taxYear, earnings: 20000 })),
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
    outcome: 'LIKELY_NOT_ELIGIBLE',
  },
};
