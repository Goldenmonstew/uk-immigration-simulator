// Supplemented case, not an official example: the facts follow the rules in
// Appendix Hong Kong British National (Overseas) (SRC-020). A BN(O) Status
// Holder on the route since 2021-02-01 applies on 2026-02-01, the day 5 years
// are completed (HK 62.1(b)), with B1 English (HK 60.1) and the Life in the UK
// test passed (HK 61.1). No absences, criminality, breaches or debt.
// The Earned Settlement column short-circuits (outside the framework).
import type { Fixture } from '../../engine/src/types';

export const clHkbnoFiveYears: Fixture = {
  id: 'CL-HKBNO-FIVE-YEARS',
  title: 'Hong Kong BN(O) Status Holder: 5 years completed on the day',
  source: { srcId: 'SRC-020', locator: 'HK 62.1(b)' },
  request: {
    simulationDate: '2026-02-01',
    timeline: {
      dateOfBirth: '1985-06-20',
      nationality: 'HKG',
      episodes: [
        {
          route: 'HONG_KONG_BNO',
          role: 'MAIN',
          validFrom: '2021-02-01',
          validTo: '2026-01-31',
        },
        {
          route: 'HONG_KONG_BNO',
          role: 'MAIN',
          validFrom: '2026-02-01',
          validTo: '2028-07-31',
        },
      ],
      absences: [],
      incomeYears: [],
      benefits: [],
      relationships: [],
      english: { cefrLevel: 'B1' },
      lifeInTheUk: { passed: true },
      criminalRecord: [],
      immigrationBreaches: [],
      governmentDebt: { outstanding: false },
    },
  },
  expected: {
    ruleSetId: 'current-law-2026-11',
    outcome: 'LIKELY_ELIGIBLE',
    pathwayYears: 5,
    earliestDate: '2026-02-01',
  },
};
