import type { ParameterSet } from '../types';

// Earned Settlement as announced in SRC-001 (CP 1707, 2026-11-02). Locators
// are physical PDF pages. Not in force.
export const earnedSettlement2026_11 = {
  ruleSetId: 'earned-settlement-2026-11',
  asOf: '2026-11-04',
  values: {
    // Breaches and criminality count from this age (p12, p13); younger
    // applicants are exempt from earnings, English and Life in the UK (p15, p21).
    adultAge: {
      value: 18,
      sources: [
        { srcId: 'SRC-001', locator: 'p12' },
        { srcId: 'SRC-001', locator: 'p13' },
        { srcId: 'SRC-001', locator: 'p15' },
        { srcId: 'SRC-001', locator: 'p21' },
      ],
    },

    // From this age the earnings, English and Life in the UK requirements do
    // not apply (p15, p21).
    exemptionAge: {
      value: 65,
      sources: [
        { srcId: 'SRC-001', locator: 'p15' },
        { srcId: 'SRC-001', locator: 'p21' },
      ],
    },
    settlementEnglishLevel: {
      value: 'B2',
      sources: [{ srcId: 'SRC-001', locator: 'p21' }],
    },

    // GBP per year
    earningsThreshold3Year: {
      value: 125141,
      sources: [
        { srcId: 'SRC-001', locator: 'p15' },
        { srcId: 'SRC-001', locator: 'p46' },
      ],
    },
    earningsThreshold5Year: {
      value: 50271,
      sources: [
        { srcId: 'SRC-001', locator: 'p15' },
        { srcId: 'SRC-001', locator: 'p46' },
      ],
    },
    // Also the minimum for the 20-year pathway (p46).
    earningsThresholdMinimum: {
      value: 12571,
      sources: [
        { srcId: 'SRC-001', locator: 'p15' },
        { srcId: 'SRC-001', locator: 'p46' },
      ],
    },
    // Couples combining earnings; meets the minimum only (p17).
    householdEarningsThreshold: {
      value: 25142,
      sources: [{ srcId: 'SRC-001', locator: 'p17' }],
    },

    bestYears3Year: {
      value: { required: 3, window: 4 },
      sources: [
        { srcId: 'SRC-001', locator: 'p16' },
        { srcId: 'SRC-001', locator: 'p46' },
      ],
    },
    bestYears5Year: {
      value: { required: 3, window: 5 },
      sources: [
        { srcId: 'SRC-001', locator: 'p16' },
        { srcId: 'SRC-001', locator: 'p46' },
      ],
    },
    // p15 says "at least three years"; p16 and Table 1 (p46) say 5 of 7.
    // We follow Table 1 and the rules must state the assumption (PD-041).
    bestYears10Year: {
      value: { required: 5, window: 7 },
      sources: [
        { srcId: 'SRC-001', locator: 'p16' },
        { srcId: 'SRC-001', locator: 'p46' },
      ],
    },
    bestYears20Year: {
      value: { required: 5, window: 7 },
      sources: [{ srcId: 'SRC-001', locator: 'p46' }],
    },

    // No specified public funds in this many years before applying, for the
    // 3, 5 and 10-year pathways.
    publicFundsLookbackYears: {
      value: 5,
      sources: [
        { srcId: 'SRC-001', locator: 'p18' },
        { srcId: 'SRC-001', locator: 'p46' },
      ],
    },

    // Care workers who entered or switched into the route before the
    // Immigration White Paper (CP 1326) keep the 5-year period if paid at least
    // this (GBP per year) (p42). The paper is dated May 2025 (p42; SRC-012
    // cover); the day is its gov.uk publication date (PD-035).
    careWorkerSalaryThreshold: {
      value: 25000,
      sources: [{ srcId: 'SRC-001', locator: 'p42' }],
    },
    whitePaperPublished: {
      value: '2025-05-12',
      sources: [
        { srcId: 'SRC-001', locator: 'p42' },
        { srcId: 'SRC-012', locator: 'cover' },
      ],
    },

    // Qualifying residence in years for each pathway.
    pathwayYears3: {
      value: 3,
      sources: [
        { srcId: 'SRC-001', locator: 'p15' },
        { srcId: 'SRC-001', locator: 'p46' },
      ],
    },
    pathwayYears5: {
      value: 5,
      sources: [
        { srcId: 'SRC-001', locator: 'p15' },
        { srcId: 'SRC-001', locator: 'p46' },
      ],
    },
    pathwayYears10: {
      value: 10,
      sources: [
        { srcId: 'SRC-001', locator: 'p15' },
        { srcId: 'SRC-001', locator: 'p46' },
      ],
    },
    // Public funds use (p18) or a qualifying immigration breach (p13).
    pathwayYears20: {
      value: 20,
      sources: [
        { srcId: 'SRC-001', locator: 'p13' },
        { srcId: 'SRC-001', locator: 'p18' },
        { srcId: 'SRC-001', locator: 'p46' },
      ],
    },
  },
} satisfies ParameterSet;
