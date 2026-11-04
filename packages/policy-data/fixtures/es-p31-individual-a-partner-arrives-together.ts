// SRC-001 p31 Individual A: a partner arriving with a lead applicant on a
// five-year pathway can settle with them after five years, provided they each
// meet the relevant requirements. This timeline is the dependant partner's;
// the principal is `p31Principal` (five-year earnings pathway from
// 2021-04-06). Supplemented facts: all dates, nationality, Skilled Worker
// dependant permission and £20,000 annual earnings, which meet the minimum
// income the engine applies to partners (PD-056). Both arrive on 2021-04-06.
// All other requirements are met: B2, Life in the UK, no absences, public
// funds, criminality, breaches or debt.
import type { Fixture } from '../../engine/src/types';
import { p31Principal } from './p31-principal';

const TAX_YEARS = ['2021-22', '2022-23', '2023-24', '2024-25', '2025-26'];

export const esP31IndividualAPartnerArrivesTogether: Fixture = {
  id: 'ES-OFFICIAL-P31-INDIVIDUAL-A',
  title: 'Individual A: dependant partner arrives with the principal',
  source: { srcId: 'SRC-001', locator: 'p31' },
  request: {
    simulationDate: '2026-04-06',
    principal: p31Principal,
    timeline: {
      dateOfBirth: '1988-04-12',
      nationality: 'IND',
      episodes: [
        {
          route: 'SKILLED_WORKER',
          role: 'DEPENDANT',
          validFrom: '2021-04-06',
          validTo: '2024-04-05',
          dependantOf: 'PARTNER',
        },
        {
          route: 'SKILLED_WORKER',
          role: 'DEPENDANT',
          validFrom: '2024-04-06',
          validTo: '2027-04-05',
          dependantOf: 'PARTNER',
        },
      ],
      absences: [],
      incomeYears: TAX_YEARS.map((taxYear) => ({ taxYear, earnings: 20000 })),
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
