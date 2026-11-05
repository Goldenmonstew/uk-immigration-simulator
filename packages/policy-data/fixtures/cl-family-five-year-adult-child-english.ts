// Supplemented case, not an official example: the facts follow the rules in
// Immigration Rules Part 8 para 298 (SRC-029) and Appendix KoLL (SRC-025).
// The principal, partner of a British citizen, has held Appendix FM partner
// permission on the 5-year route since 2021-11-05 and completes 5 years on
// the date of application, 2026-11-05 (E-ILRP.1.3), with B1 English, the Life
// in the UK test passed and earnings in 2025-26 above the transitional
// financial requirement (E-LTRP.3.7). Their child, born 2007-03-01, has held
// Appendix FM dependent child permission since 2021-11-05 and is now 19, so
// must meet the English and Life in the UK requirements of Appendix KoLL
// (para 298(vii)); the Life in the UK test is passed, but no English level is
// given.
import type { Fixture } from '../../engine/src/types';

export const clFamilyFiveYearAdultChildEnglish: Fixture = {
  id: 'CL-FAMILY-FIVE-YEAR-ADULT-CHILD-ENGLISH',
  title: 'Adult child of a 5-year route partner without an English level',
  source: { srcId: 'SRC-029', locator: 'para 298(vii)' },
  request: {
    simulationDate: '2026-11-05',
    principal: {
      dateOfBirth: '1980-09-03',
      nationality: 'NGA',
      episodes: [
        {
          route: 'FAMILY_PARTNER_OR_PARENT',
          role: 'MAIN',
          validFrom: '2021-11-05',
          validTo: '2024-05-04',
          familyPermission: 'PARTNER_FIVE_YEAR',
        },
        {
          route: 'FAMILY_PARTNER_OR_PARENT',
          role: 'MAIN',
          validFrom: '2024-05-05',
          validTo: '2027-05-04',
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
      dateOfBirth: '2007-03-01',
      nationality: 'NGA',
      episodes: [
        {
          route: 'FAMILY_PARTNER_OR_PARENT',
          role: 'DEPENDANT',
          validFrom: '2021-11-05',
          validTo: '2027-05-04',
          dependantOf: 'PARENT',
        },
      ],
      absences: [],
      incomeYears: [],
      benefits: [],
      relationships: [{ type: 'PARENT', otherPartyStatus: 'BRITISH_CITIZEN' }],
      lifeInTheUk: { passed: true },
      criminalRecord: [],
      immigrationBreaches: [],
    },
  },
  expected: {
    ruleSetId: 'current-law-2026-11',
    outcome: 'INSUFFICIENT_INFORMATION',
    mustUnknown: ['CL-ENGLISH'],
  },
};
