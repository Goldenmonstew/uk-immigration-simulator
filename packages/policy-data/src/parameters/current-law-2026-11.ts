import type { ParameterSet } from '../types';

// Immigration Rules in force (SRC-004 Appendix Skilled Worker).
export const currentLaw2026_11 = {
  ruleSetId: 'current-law-2026-11',
  asOf: '2026-11-04',
  values: {
    // GBP per year, general salary threshold.
    // Paragraph number to be filled in once task 0.3 registers SRC-004.
    skilledWorkerGeneralSalaryThreshold: {
      value: 41700,
      sources: [{ srcId: 'SRC-004', locator: 'paragraph TBD' }],
    },
  },
} satisfies ParameterSet;
