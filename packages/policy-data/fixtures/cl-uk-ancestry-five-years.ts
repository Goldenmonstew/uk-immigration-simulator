// Supplemented case, not an official example: the facts follow the rules in
// Appendix UK Ancestry (SRC-026). A Commonwealth citizen with a grandparent
// born in the UK holds UK Ancestry permission from 2021-09-01 and applies on
// 2026-09-01, the day 5 years are completed (UKA 13.1), with B1 English
// (UKA 15.1(a), before 2027-03-26) and the Life in the UK test passed
// (UKA 16.1). No absences, criminality, breaches or debt.
import type { Fixture } from '../../engine/src/types';

export const clUkAncestryFiveYears: Fixture = {
  id: 'CL-UK-ANCESTRY-FIVE-YEARS',
  title: 'UK Ancestry: 5 years completed on the day',
  source: { srcId: 'SRC-026', locator: 'UKA 13.1' },
  request: {
    simulationDate: '2026-09-01',
    timeline: {
      dateOfBirth: '1994-02-14',
      nationality: 'AUS',
      episodes: [
        {
          route: 'UK_ANCESTRY',
          role: 'MAIN',
          validFrom: '2021-09-01',
          validTo: '2026-08-31',
        },
        {
          route: 'UK_ANCESTRY',
          role: 'MAIN',
          validFrom: '2026-09-01',
          validTo: '2031-08-31',
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
    earliestDate: '2026-09-01',
  },
};
