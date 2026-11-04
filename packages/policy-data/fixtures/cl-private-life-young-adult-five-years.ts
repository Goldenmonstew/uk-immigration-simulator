// Supplemented case, not an official example: the facts follow the rules in
// Appendix Private Life (SRC-028). A young adult who arrived as a child and
// met the half-life test (PL 4.1) holds Private Life permission from
// 2021-07-01 and applies on 2026-07-01, the day 5 continuous years are
// completed (PL 14.1, PL 15.1), with B1 English (PL 16.1(a), before
// 2027-03-26) and the Life in the UK test passed (PL 17.1). No absences,
// criminality, breaches or debt.
import type { Fixture } from '../../engine/src/types';

export const clPrivateLifeYoungAdultFiveYears: Fixture = {
  id: 'CL-PRIVATE-LIFE-YOUNG-ADULT-FIVE-YEARS',
  title:
    'Private Life young adult (half-life test): 5 years completed on the day',
  source: { srcId: 'SRC-028', locator: 'PL 14.1' },
  request: {
    simulationDate: '2026-07-01',
    timeline: {
      dateOfBirth: '2000-03-15',
      nationality: 'PAK',
      episodes: [
        {
          route: 'FAMILY_AND_PRIVATE_LIFE',
          role: 'MAIN',
          validFrom: '2021-07-01',
          validTo: '2023-12-31',
          privateLifeRoute: 'YOUNG_ADULT',
        },
        {
          route: 'FAMILY_AND_PRIVATE_LIFE',
          role: 'MAIN',
          validFrom: '2024-01-01',
          validTo: '2026-06-30',
          privateLifeRoute: 'YOUNG_ADULT',
        },
        {
          route: 'FAMILY_AND_PRIVATE_LIFE',
          role: 'MAIN',
          validFrom: '2026-07-01',
          validTo: '2028-12-31',
          privateLifeRoute: 'YOUNG_ADULT',
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
    earliestDate: '2026-07-01',
  },
};
