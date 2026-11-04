// Supplemented case, not an official example: the facts follow the rules in
// Appendix Global Talent (SRC-021). Endorsed by Arts Council England under the
// exceptional talent criteria, on Global Talent since 2023-11-04, applying on
// 2026-11-04, the day 3 years are completed (GT 11.1(b)), with B1 English
// before 2027-03-26 (GT 13.1(a)) and the Life in the UK test passed (GT 14.1).
// Endorsement not withdrawn and earnings in the field (GT 10.1–10.2) are
// assumed by the engine. No absences, criminality, breaches or debt.
import type { Fixture } from '../../engine/src/types';

export const clGlobalTalentThreeYears: Fixture = {
  id: 'CL-GLOBAL-TALENT-THREE-YEARS',
  title: 'Global Talent, exceptional talent: 3 years completed on the day',
  source: { srcId: 'SRC-021', locator: 'GT 11.1(b)' },
  request: {
    simulationDate: '2026-11-04',
    timeline: {
      dateOfBirth: '1990-03-12',
      nationality: 'USA',
      episodes: [
        {
          route: 'GLOBAL_TALENT',
          role: 'MAIN',
          validFrom: '2023-11-04',
          validTo: '2028-11-03',
          globalTalentEndorsement: 'ARTS_COUNCIL_ENGLAND',
          globalTalentCriteria: 'EXCEPTIONAL_TALENT',
        },
      ],
      absences: [],
      incomeYears: ['2023-24', '2024-25', '2025-26'].map((taxYear) => ({
        taxYear,
        earnings: 55000,
      })),
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
    pathwayYears: 3,
    earliestDate: '2026-11-04',
  },
};
