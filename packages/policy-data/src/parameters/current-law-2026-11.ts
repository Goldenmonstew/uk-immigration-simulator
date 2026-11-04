import type { ParameterSet } from '../types';

// Immigration Rules in force (SRC-004 Appendix Skilled Worker, version
// 2026-10-08).
export const currentLaw2026_11 = {
  ruleSetId: 'current-law-2026-11',
  asOf: '2026-11-04',
  values: {
    // Continuous residence: no more than this many days outside the UK in any
    // window of this many months (CR 3.1).
    continuousResidenceMaxAbsenceDays: {
      value: 180,
      sources: [{ srcId: 'SRC-008', locator: 'CR 3.1' }],
    },
    continuousResidenceWindowMonths: {
      value: 12,
      sources: [{ srcId: 'SRC-008', locator: 'CR 3.1' }],
    },

    // Settlement applicants under 18 or aged 65 and over are exempt from the
    // English language and Life in the UK requirements.
    settlementMinorAge: {
      value: 18,
      sources: [
        { srcId: 'SRC-014', locator: 'EL 1.1(b)' },
        { srcId: 'SRC-015', locator: 'KOL 1.1(b)' },
      ],
    },
    settlementExemptionAge: {
      value: 65,
      sources: [
        { srcId: 'SRC-014', locator: 'EL 1.1(a)' },
        { srcId: 'SRC-015', locator: 'KOL 1.1(a)' },
      ],
    },
    // B1 before 2027-03-26, B2 from then.
    longResidenceSettlementEnglishBefore: {
      value: 'B1',
      sources: [{ srcId: 'SRC-005', locator: 'LR 13.1(a)' }],
    },
    longResidenceSettlementEnglish: {
      value: { cefrLevel: 'B2', applicationsFrom: '2027-03-26' },
      sources: [{ srcId: 'SRC-005', locator: 'LR 13.1(b)' }],
    },

    skilledWorkerQualifyingYears: {
      value: 5,
      sources: [{ srcId: 'SRC-004', locator: 'SW 21.1' }],
    },

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
