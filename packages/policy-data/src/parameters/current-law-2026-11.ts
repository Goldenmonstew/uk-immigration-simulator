import type { ParameterSet } from '../types';

// Immigration Rules in force (SRC-004 Appendix Skilled Worker, version
// 2026-10-08).
export const currentLaw2026_11 = {
  ruleSetId: 'current-law-2026-11',
  asOf: '2026-11-04',
  values: {
    // GBP per year, general salary threshold for permission (SW 4.2 Option A)
    // and for settlement (SW 24.3 row A).
    skilledWorkerGeneralSalaryThreshold: {
      value: 41700,
      sources: [
        { srcId: 'SRC-004', locator: 'SW 4.2' },
        { srcId: 'SRC-004', locator: 'SW 24.3 row A' },
      ],
    },
    // Settlement applications made on or after this date need B2 English
    // unless exempt (inserted by HC 1691).
    skilledWorkerSettlementEnglish: {
      value: { cefrLevel: 'B2', applicationsFrom: '2027-03-26' },
      sources: [
        { srcId: 'SRC-004', locator: 'SW 22A.1' },
        { srcId: 'SRC-007', locator: 'p24' },
      ],
    },
  },
} satisfies ParameterSet;
