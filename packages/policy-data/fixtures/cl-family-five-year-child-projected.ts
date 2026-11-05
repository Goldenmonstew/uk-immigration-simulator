// Supplemented case, not an official example: the facts follow the rules in
// Immigration Rules Part 8 para 298 (SRC-029) and Appendix FM (SRC-024). The
// principal, partner of a British citizen, has held Appendix FM partner
// permission on the 5-year route since 2021-11-06, so completes 5 years on
// 2026-11-06 (E-ILRP.1.3), a day after the date of application; they have B1
// English, the Life in the UK test passed and earnings in 2025-26 above the
// transitional financial requirement (E-LTRP.3.7). Their child, born
// 2014-04-10, has held Appendix FM dependent child permission since
// 2021-11-06 and settles when the parent is granted settlement (para
// 298(i)(d); the other parent is the British citizen partner). Under 18, so
// para 298(vii) does not apply.
import type { Fixture } from '../../engine/src/types';

export const clFamilyFiveYearChildProjected: Fixture = {
  id: 'CL-FAMILY-FIVE-YEAR-CHILD-PROJECTED',
  title: 'Child of a 5-year route partner, a day before the parent qualifies',
  source: { srcId: 'SRC-029', locator: 'para 298(i)' },
  request: {
    simulationDate: '2026-11-05',
    principal: {
      dateOfBirth: '1990-05-12',
      nationality: 'IND',
      episodes: [
        {
          route: 'FAMILY_PARTNER_OR_PARENT',
          role: 'MAIN',
          validFrom: '2021-11-06',
          validTo: '2024-05-05',
          familyPermission: 'PARTNER_FIVE_YEAR',
        },
        {
          route: 'FAMILY_PARTNER_OR_PARENT',
          role: 'MAIN',
          validFrom: '2024-05-06',
          validTo: '2026-11-05',
          familyPermission: 'PARTNER_FIVE_YEAR',
        },
      ],
      absences: [],
      incomeYears: [{ taxYear: '2025-26', earnings: 30000 }],
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
      dateOfBirth: '2014-04-10',
      nationality: 'IND',
      episodes: [
        {
          route: 'FAMILY_PARTNER_OR_PARENT',
          role: 'DEPENDANT',
          validFrom: '2021-11-06',
          validTo: '2026-11-05',
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
    outcome: 'LIKELY_NOT_ELIGIBLE',
    pathwayYears: 5,
    earliestDate: '2026-11-06',
  },
};
