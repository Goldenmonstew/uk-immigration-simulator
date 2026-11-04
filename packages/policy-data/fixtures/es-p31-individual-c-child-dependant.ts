// SRC-001 p31 Individual C: a 14-year-old with child dependant status may
// settle with their parents, subject to suitability and criminality, without
// the income, debt, English or Life in the UK requirements. The principal is
// `p31Principal` (eligible on 2026-04-06); the engine assumes the other parent
// settles at the same time (PD-061). Supplemented facts: date of birth
// 2012-01-10 (14 on 2026-04-06), dependant permission from 2021-04-06, no
// criminality or absences. Income, debt, English and Life in the UK are left
// unanswered to show the exemptions.
import type { Fixture } from '../../engine/src/types';
import { p31Principal } from './p31-principal';

export const esP31IndividualCChildDependant: Fixture = {
  id: 'ES-OFFICIAL-P31-INDIVIDUAL-C',
  title: 'Individual C: 14-year-old child dependant',
  source: { srcId: 'SRC-001', locator: 'p31' },
  request: {
    simulationDate: '2026-04-06',
    principal: p31Principal,
    timeline: {
      dateOfBirth: '2012-01-10',
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
      criminalRecord: [],
      immigrationBreaches: [],
    },
  },
  expected: {
    ruleSetId: 'earned-settlement-2026-11',
    outcome: 'LIKELY_ELIGIBLE',
    pathwayYears: 5,
  },
};
