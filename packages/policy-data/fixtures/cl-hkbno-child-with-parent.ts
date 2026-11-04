// Supplemented case, not an official example: the facts follow the rules in
// Appendix Hong Kong British National (Overseas) (SRC-020). A child born
// 2014-09-01 holds BN(O) dependent child permission from 2021-02-01 with a
// parent who has been a BN(O) Status Holder since the same day. On
// 2026-02-01 the parent completes 5 years (HK 62.1(b)) and the child, under 18,
// applies at the same time (HK 57.2–57.3(a)); the child has no residence
// requirement and is exempt from English and Life in the UK by age (EL 1.1,
// HK 61.1). The other parent is assumed to settle at the same time (HK 57.4).
import type { Fixture } from '../../engine/src/types';

export const clHkbnoChildWithParent: Fixture = {
  id: 'CL-HKBNO-CHILD-WITH-PARENT',
  title: 'Hong Kong BN(O) child under 18 settling with the parent',
  source: { srcId: 'SRC-020', locator: 'HK 57.3' },
  request: {
    simulationDate: '2026-02-01',
    principal: {
      dateOfBirth: '1984-03-12',
      nationality: 'HKG',
      episodes: [
        {
          route: 'HONG_KONG_BNO',
          role: 'MAIN',
          validFrom: '2021-02-01',
          validTo: '2026-07-31',
        },
      ],
      absences: [],
      incomeYears: [],
      benefits: [],
      relationships: [{ type: 'CHILD', otherPartyStatus: 'OTHER' }],
      english: { cefrLevel: 'B1' },
      lifeInTheUk: { passed: true },
      criminalRecord: [],
      immigrationBreaches: [],
      governmentDebt: { outstanding: false },
    },
    timeline: {
      dateOfBirth: '2014-09-01',
      nationality: 'HKG',
      episodes: [
        {
          route: 'HONG_KONG_BNO',
          role: 'DEPENDANT',
          validFrom: '2021-02-01',
          validTo: '2026-07-31',
          dependantOf: 'PARENT',
        },
      ],
      absences: [],
      incomeYears: [],
      benefits: [],
      relationships: [{ type: 'PARENT', otherPartyStatus: 'OTHER' }],
      criminalRecord: [],
      immigrationBreaches: [],
    },
  },
  expected: {
    ruleSetId: 'current-law-2026-11',
    outcome: 'LIKELY_ELIGIBLE',
    pathwayYears: 5,
    earliestDate: '2026-02-01',
  },
};
