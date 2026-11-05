// Supplemented case, not an official example: the facts follow the rules in
// Appendix FM (SRC-024) and Appendix KoLL (SRC-025). The partner of a British
// citizen has held partner permission on the 5-year route since 2024-06-01,
// so the transitional requirement does not apply (E-LTRP.3.5) and the
// financial requirement is the general one (E-LTRP.3.1). They apply on
// 2029-06-01, the day 5 years (60 months) are completed (E-ILRP.1.3), with B2
// English (KoLL 2.2) and the Life in the UK test passed (KoLL 2.3). Combined
// earnings in 2028-29, the last complete tax year, are £20,000, below the
// income requirement in E-LTRP.3.1(a).
// Cash savings of £24,000 fall short of £16,000 plus the shortfall
// (E-LTRP.3.1(b), E-ILRP.1.3(1A)); the partner receives none of the benefits
// in E-LTRP.3.3(a).
import type { Fixture } from '../../engine/src/types';

export const clFamilyFiveYearSavingsShort: Fixture = {
  id: 'CL-FAMILY-FIVE-YEAR-SAVINGS-SHORT',
  title: 'Partner on the 5-year route: savings short of the income shortfall',
  source: { srcId: 'SRC-024', locator: 'E-LTRP.3.1(b)' },
  request: {
    simulationDate: '2029-06-01',
    timeline: {
      dateOfBirth: '1993-02-14',
      nationality: 'BRA',
      episodes: [
        {
          route: 'FAMILY_PARTNER_OR_PARENT',
          role: 'MAIN',
          validFrom: '2024-06-01',
          validTo: '2026-11-30',
          familyPermission: 'PARTNER_FIVE_YEAR',
        },
        {
          route: 'FAMILY_PARTNER_OR_PARENT',
          role: 'MAIN',
          validFrom: '2026-12-01',
          validTo: '2029-08-31',
          familyPermission: 'PARTNER_FIVE_YEAR',
        },
      ],
      absences: [],
      incomeYears: [{ taxYear: '2028-29', earnings: 20000 }],
      benefits: [],
      relationships: [{ type: 'PARTNER', otherPartyStatus: 'BRITISH_CITIZEN' }],
      english: { cefrLevel: 'B2' },
      lifeInTheUk: { passed: true },
      cashSavings: 24000,
      criminalRecord: [],
      immigrationBreaches: [],
      governmentDebt: { outstanding: false },
    },
  },
  expected: {
    ruleSetId: 'current-law-2026-11',
    outcome: 'LIKELY_NOT_ELIGIBLE',
    mustFail: ['CL-FAMILY-FINANCIAL'],
  },
};
