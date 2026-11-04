// Supplemented case, not an official example: the facts follow the rules in
// Appendix Global Talent (SRC-021). The principal, endorsed by Arts Council
// England under the exceptional talent criteria, held Global Talent permission
// from 2021-06-01 and settled after 3 years on 2024-06-01 (GT 11.1(b)). The
// partner has held dependent partner permission since 2021-06-01, including
// on 2024-06-01 (GT 27.1(b)(i)), and applies on 2026-06-01, the day 5
// continuous years are completed (GT 30.1, GT 31.1), with B1 English (GT
// 32.1(a)) and the Life in the UK test passed (GT 33.1).
import type { Fixture } from '../../engine/src/types';

export const clGlobalTalentPartnerFiveYears: Fixture = {
  id: 'CL-GLOBAL-TALENT-PARTNER-FIVE-YEARS',
  title: 'Global Talent dependent partner: 5 years after the principal settled',
  source: { srcId: 'SRC-021', locator: 'GT 30.1' },
  request: {
    simulationDate: '2026-06-01',
    principal: {
      dateOfBirth: '1986-05-20',
      nationality: 'USA',
      episodes: [
        {
          route: 'GLOBAL_TALENT',
          role: 'MAIN',
          validFrom: '2021-06-01',
          validTo: '2024-05-31',
          globalTalentEndorsement: 'ARTS_COUNCIL_ENGLAND',
          globalTalentCriteria: 'EXCEPTIONAL_TALENT',
        },
      ],
      absences: [],
      incomeYears: [],
      benefits: [],
      relationships: [{ type: 'PARTNER', otherPartyStatus: 'OTHER' }],
      english: { cefrLevel: 'B2' },
      lifeInTheUk: { passed: true },
      criminalRecord: [],
      immigrationBreaches: [],
      governmentDebt: { outstanding: false },
      settled: { date: '2024-06-01', route: 'GLOBAL_TALENT' },
    },
    timeline: {
      dateOfBirth: '1987-08-14',
      nationality: 'USA',
      episodes: [
        {
          route: 'GLOBAL_TALENT',
          role: 'DEPENDANT',
          validFrom: '2021-06-01',
          validTo: '2026-05-31',
          dependantOf: 'PARTNER',
        },
        {
          route: 'GLOBAL_TALENT',
          role: 'DEPENDANT',
          validFrom: '2026-06-01',
          validTo: '2028-05-31',
          dependantOf: 'PARTNER',
        },
      ],
      absences: [],
      incomeYears: [],
      benefits: [],
      relationships: [{ type: 'PARTNER', otherPartyStatus: 'SETTLED' }],
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
    earliestDate: '2026-06-01',
  },
};
