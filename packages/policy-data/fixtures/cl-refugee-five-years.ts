// Supplemented case, not an official example: the facts follow the rules in
// Appendix Settlement Protection (SRC-023). A refugee granted protection on
// 2021-03-01 (entered as CORE_PROTECTION from that date, contracts §11.1)
// applies on 2026-03-01, the day 5 continuous years are completed (STP 3.1).
// Status not revoked or renounced (STP 4.1). No English level or Life in the
// UK test given: the Appendix sets neither (PD-072). No absences,
// criminality, breaches or debt; asylum support not received.
import type { Fixture } from '../../engine/src/types';

export const clRefugeeFiveYears: Fixture = {
  id: 'CL-REFUGEE-FIVE-YEARS',
  title: 'Refugee: 5 years with protection completed on the day',
  source: { srcId: 'SRC-023', locator: 'STP 3.1' },
  request: {
    simulationDate: '2026-03-01',
    timeline: {
      dateOfBirth: '1992-04-10',
      nationality: 'SDN',
      episodes: [
        {
          route: 'CORE_PROTECTION',
          role: 'MAIN',
          validFrom: '2021-03-01',
          validTo: '2026-03-31',
        },
      ],
      absences: [],
      incomeYears: [],
      benefits: [],
      relationships: [],
      criminalRecord: [],
      immigrationBreaches: [],
      governmentDebt: { outstanding: false },
      asylumSupportRepayment: 'NOT_REQUIRED',
    },
  },
  expected: {
    ruleSetId: 'current-law-2026-11',
    outcome: 'LIKELY_ELIGIBLE',
    pathwayYears: 5,
    earliestDate: '2026-03-01',
  },
};
