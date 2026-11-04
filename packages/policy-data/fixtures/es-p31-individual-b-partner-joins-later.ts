// SRC-001 p31 Individual B, the partner's perspective: the lead applicant can
// apply after five years; the partner, joining two years later, needs five
// years as a dependant and can apply two years after the lead applicant. The
// principal is `p31Principal` (eligible on 2026-04-06). Supplemented facts:
// the partner joins on 2023-04-06 and earns £20,000 a year from 2023-24; UK
// earnings before arrival are left unanswered, so the minimum income rule is
// UNKNOWN and the date is projected assuming it is met by then. All other
// requirements are met: B2, Life in the UK, no absences, public funds,
// criminality, breaches or debt.
//
// Expected: on the principal's eligibility date the partner is not yet
// eligible and can apply on 2028-04-06, two years later.
import type { Fixture } from '../../engine/src/types';
import { p31Principal } from './p31-principal';

const TAX_YEARS = ['2023-24', '2024-25', '2025-26'];

export const esP31IndividualBPartnerJoinsLater: Fixture = {
  id: 'ES-OFFICIAL-P31-INDIVIDUAL-B-PARTNER',
  title: 'Individual B: dependant partner joins two years later',
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
          validFrom: '2023-04-06',
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
    outcome: 'LIKELY_NOT_ELIGIBLE',
    pathwayYears: 5,
    earliestDate: '2028-04-06',
  },
};
