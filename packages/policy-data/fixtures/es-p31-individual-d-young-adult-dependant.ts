// SRC-001 p31 Individual D: a 22-year-old graduate with child dependant status
// can settle as a dependant when their parents settle; as an adult they meet
// the mandatory requirements but not the individual income requirement (p30).
// The principal is `p31Principal` (eligible on 2026-04-06); the engine assumes
// the other parent settles at the same time (PD-061) and that holding
// permission as the parent's dependant is "retaining child-dependant status"
// (PD-059). Supplemented facts: date of birth 2004-01-10 (22 on 2026-04-06),
// dependant permission from 2021-04-06, B2, Life in the UK, no debt,
// criminality, absences or public funds. No income is entered.
import type { Fixture } from '../../engine/src/types';
import { p31Principal } from './p31-principal';

export const esP31IndividualDYoungAdultDependant: Fixture = {
  id: 'ES-OFFICIAL-P31-INDIVIDUAL-D',
  title: 'Individual D: 22-year-old child dependant',
  source: { srcId: 'SRC-001', locator: 'p31' },
  request: {
    simulationDate: '2026-04-06',
    principal: p31Principal,
    timeline: {
      dateOfBirth: '2004-01-10',
      nationality: 'IND',
      episodes: [
        {
          route: 'SKILLED_WORKER',
          role: 'DEPENDANT',
          validFrom: '2021-04-06',
          validTo: '2027-04-05',
          dependantOf: 'PARENT',
        },
      ],
      absences: [],
      incomeYears: [],
      benefits: [],
      relationships: [{ type: 'PARENT', otherPartyStatus: 'OTHER' }],
      english: { cefrLevel: 'B2' },
      lifeInTheUk: { passed: true },
      criminalRecord: [],
      immigrationBreaches: [],
      governmentDebt: { outstanding: false },
    },
  },
  expected: {
    ruleSetId: 'earned-settlement-2026-11',
    outcome: 'LIKELY_ELIGIBLE',
    pathwayYears: 5,
  },
};
