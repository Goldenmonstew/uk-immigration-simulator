// SRC-001 p31 Individual B: a principal on a five-year pathway may settle after
// five years even though their partner joins two years later. As the brief
// requires, this fixture covers only the principal's perspective, not the
// partner's later application. Supplemented facts: all dates, nationality,
// Skilled Worker permission and £60,000 salary / annual earnings, establishing
// the principal's five-year earnings pathway. The principal arrives on
// 2021-04-06 and the partner joins on 2023-04-06. Relationship has no arrival-date
// field, so that partner date is context only. All other requirements are met:
// B2, Life in the UK, no absences, public funds, criminality, breaches or debt.
import type { Fixture } from '../../engine/src/types';

const TAX_YEARS = ['2021-22', '2022-23', '2023-24', '2024-25', '2025-26'];

export const esP31IndividualBPartnerArrivesLater: Fixture = {
  id: 'ES-OFFICIAL-P31-INDIVIDUAL-B',
  title: 'Individual B: principal whose dependant partner arrives later',
  source: { srcId: 'SRC-001', locator: 'p31' },
  request: {
    simulationDate: '2026-04-06',
    timeline: {
      dateOfBirth: '1988-04-12',
      nationality: 'IND',
      episodes: [
        {
          route: 'SKILLED_WORKER',
          role: 'MAIN',
          validFrom: '2021-04-06',
          validTo: '2024-04-05',
          salary: 60000,
        },
        {
          route: 'SKILLED_WORKER',
          role: 'MAIN',
          validFrom: '2024-04-06',
          validTo: '2027-04-05',
          salary: 60000,
        },
      ],
      absences: [],
      incomeYears: TAX_YEARS.map((taxYear) => ({ taxYear, earnings: 60000 })),
      benefits: [],
      relationships: [{ type: 'PARTNER', otherPartyStatus: 'OTHER' }],
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
