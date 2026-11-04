// Supplemented case, not an official example: the facts follow the rules in
// Appendix FM (SRC-024) and Appendix KoLL (SRC-025). The partner of a British
// citizen on the 5-year route since 2021-03-01 applies on 2026-03-01, the day
// 5 years (60 months) are completed (E-ILRP.1.3). The partner permission
// started before 2024-04-11, so the transitional £18,600 applies with no
// children (E-LTRP.3.5, E-LTRP.3.7(a)); combined earnings in 2024-25, the last
// complete tax year, are £22,000 (E-LTRP.3.2(a)–(b)). B1 English before
// 2027-03-26 (KoLL 2.2) and the Life in the UK test passed (KoLL 2.3).
// The relationship is taken as genuine and subsisting with the same partner.
// No absences, criminality, breaches or debt.
import type { Fixture } from '../../engine/src/types';

export const clFamilyPartnerFiveYears: Fixture = {
  id: 'CL-FAMILY-PARTNER-FIVE-YEARS',
  title: 'Partner of a British citizen: 5-year route completed on the day',
  source: { srcId: 'SRC-024', locator: 'E-ILRP.1.3' },
  request: {
    simulationDate: '2026-03-01',
    timeline: {
      dateOfBirth: '1992-09-08',
      nationality: 'PHL',
      episodes: [
        {
          route: 'FAMILY_PARTNER_OR_PARENT',
          role: 'MAIN',
          validFrom: '2021-03-01',
          validTo: '2023-08-31',
          familyPermission: 'PARTNER_FIVE_YEAR',
        },
        {
          route: 'FAMILY_PARTNER_OR_PARENT',
          role: 'MAIN',
          validFrom: '2023-09-01',
          validTo: '2026-02-28',
          familyPermission: 'PARTNER_FIVE_YEAR',
        },
        {
          route: 'FAMILY_PARTNER_OR_PARENT',
          role: 'MAIN',
          validFrom: '2026-03-01',
          validTo: '2028-08-31',
          familyPermission: 'PARTNER_FIVE_YEAR',
        },
      ],
      absences: [],
      incomeYears: [
        { taxYear: '2024-25', earnings: 14000, partnerEarnings: 8000 },
      ],
      benefits: [],
      relationships: [{ type: 'PARTNER', otherPartyStatus: 'BRITISH_CITIZEN' }],
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
    earliestDate: '2026-03-01',
  },
};
