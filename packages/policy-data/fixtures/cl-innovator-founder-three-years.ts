// Supplemented case, not an official example: the facts follow the rules in
// Appendix Innovator Founder (SRC-027). An Innovator Founder since 2023-05-01
// applies on 2026-05-01, the day 3 years are completed (INNF 18.1); the
// business has invested at least £50,000 and created the equivalent of 10
// full-time jobs for settled workers (INNF 17.1(f)(i), (vi)), and the Life in
// the UK test is passed (INNF 20.1). No English level given: the main
// applicant's settlement has no English requirement. No absences,
// criminality, breaches or debt.
import type { Fixture } from '../../engine/src/types';

export const clInnovatorFounderThreeYears: Fixture = {
  id: 'CL-INNOVATOR-FOUNDER-THREE-YEARS',
  title: 'Innovator Founder: 3 years completed on the day, two criteria met',
  source: { srcId: 'SRC-027', locator: 'INNF 18.1' },
  request: {
    simulationDate: '2026-05-01',
    timeline: {
      dateOfBirth: '1988-11-03',
      nationality: 'NGA',
      episodes: [
        {
          route: 'INNOVATOR_FOUNDER',
          role: 'MAIN',
          validFrom: '2023-05-01',
          validTo: '2026-04-30',
        },
        {
          route: 'INNOVATOR_FOUNDER',
          role: 'MAIN',
          validFrom: '2026-05-01',
          validTo: '2029-04-30',
          innovatorSettlementCriteria: ['INVESTMENT', 'JOBS'],
        },
      ],
      absences: [],
      incomeYears: [],
      benefits: [],
      relationships: [],
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
    earliestDate: '2026-05-01',
  },
};
