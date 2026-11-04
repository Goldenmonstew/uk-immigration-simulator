// Supplemented case, not an official example: the facts follow the rules in
// Appendix Settlement Family Life (SRC-022). The principal, partner of a
// British citizen, has held Appendix FM partner permission on the 10-year
// route since 2016-03-01 and completes 10 years on 2026-03-01 (SETF 3.1) with
// B1 English and the Life in the UK test passed. Their child, born
// 2012-07-15, has held dependent child permission since 2019-03-01 and
// applies at the same time (SETF 12.1(a)); under 18, so exempt from English
// and Life in the UK by age (SETF 15.1, SETF 16.1). The other parent is a
// British citizen (SETF 12.2).
import type { Fixture } from '../../engine/src/types';

export const clFamilyChildTenYear: Fixture = {
  id: 'CL-FAMILY-CHILD-TEN-YEAR',
  title: 'Child of a 10-year route partner settling with the parent',
  source: { srcId: 'SRC-022', locator: 'SETF 12.1' },
  request: {
    simulationDate: '2026-03-01',
    principal: {
      dateOfBirth: '1985-01-30',
      nationality: 'PHL',
      episodes: [
        {
          route: 'FAMILY_PARTNER_OR_PARENT',
          role: 'MAIN',
          validFrom: '2016-03-01',
          validTo: '2026-08-31',
          familyPermission: 'PARTNER_TEN_YEAR',
        },
      ],
      absences: [],
      incomeYears: [],
      benefits: [],
      relationships: [
        { type: 'PARTNER', otherPartyStatus: 'BRITISH_CITIZEN' },
        { type: 'CHILD', otherPartyStatus: 'OTHER' },
      ],
      english: { cefrLevel: 'B1' },
      lifeInTheUk: { passed: true },
      criminalRecord: [],
      immigrationBreaches: [],
      governmentDebt: { outstanding: false },
    },
    timeline: {
      dateOfBirth: '2012-07-15',
      nationality: 'PHL',
      episodes: [
        {
          route: 'FAMILY_PARTNER_OR_PARENT',
          role: 'DEPENDANT',
          validFrom: '2019-03-01',
          validTo: '2026-08-31',
          dependantOf: 'PARENT',
        },
      ],
      absences: [],
      incomeYears: [],
      benefits: [],
      relationships: [{ type: 'PARENT', otherPartyStatus: 'BRITISH_CITIZEN' }],
      criminalRecord: [],
      immigrationBreaches: [],
    },
  },
  expected: {
    ruleSetId: 'current-law-2026-11',
    outcome: 'LIKELY_ELIGIBLE',
    pathwayYears: 10,
    earliestDate: '2026-03-01',
  },
};
