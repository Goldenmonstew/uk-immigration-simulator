// SRC-001 p31 Individual A: a partner arriving with a lead applicant on a
// five-year pathway can settle with them after five years. This timeline is
// the dependant partner's perspective. Supplemented facts: all dates,
// nationality, Skilled Worker dependant permission and £20,000 annual earnings.
// Both arrive on 2021-04-06; the principal meets a five-year pathway and all
// relevant requirements. The contract cannot encode that principal's pathway
// or timeline; see the task report. The dependant does not independently meet
// the accelerated earnings threshold. All other requirements are assumed met:
// B2, Life in the UK, no absences, public funds, criminality, breaches or debt.
//
// Expected outcome: the source concludes the partner settles with the
// principal after five years. The engine does not model dependants settling
// with a principal yet (PD-055), so it answers INSUFFICIENT_INFORMATION; restore
// LIKELY_ELIGIBLE with pathwayYears 5 once dependants are modelled in Phase 2.
import type { Fixture } from '../../engine/src/types';

const TAX_YEARS = ['2021-22', '2022-23', '2023-24', '2024-25', '2025-26'];

export const esP31IndividualAPartnerArrivesTogether: Fixture = {
  id: 'ES-OFFICIAL-P31-INDIVIDUAL-A',
  title: 'Individual A: dependant partner arrives with the principal',
  source: { srcId: 'SRC-001', locator: 'p31' },
  request: {
    simulationDate: '2026-04-06',
    timeline: {
      dateOfBirth: '1988-04-12',
      nationality: 'IND',
      episodes: [
        {
          route: 'SKILLED_WORKER',
          role: 'DEPENDANT',
          validFrom: '2021-04-06',
          validTo: '2024-04-05',
        },
        {
          route: 'SKILLED_WORKER',
          role: 'DEPENDANT',
          validFrom: '2024-04-06',
          validTo: '2027-04-05',
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
    outcome: 'INSUFFICIENT_INFORMATION',
  },
};
