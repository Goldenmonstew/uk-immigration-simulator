import type { Parameter } from '../types';

// New Zealand pilot (phase 18, task 60): Immigration Instructions (SRC-072)
// and Citizenship Act 1977 s8 (SRC-070).
export const newZealand2026_11 = {
  asOf: '2026-11-21',
  values: {
    // Permanent resident visa: days holding the resident visa, and days since
    // the first day in New Zealand as a resident, at application (24 months
    // counted as 730 days by Visa Pak 588).
    prvHeldDays: {
      value: 730,
      sources: [
        { srcId: 'SRC-072', locator: 'RV2.5(a)(i)' },
        { srcId: 'SRC-073', locator: 'Visa Pak 588 p1' },
      ],
    },
    prvFirstDayDays: {
      value: 730,
      sources: [
        { srcId: 'SRC-072', locator: 'RV2.5(b)' },
        { srcId: 'SRC-072', locator: 'R5.66.5(b)' },
        { srcId: 'SRC-073', locator: 'Visa Pak 588 p1' },
      ],
    },
    // Each of the two 12-month portions before applying, in days.
    prvPeriodDays: {
      value: 365,
      sources: [
        { srcId: 'SRC-072', locator: 'RV2.5.1' },
        { srcId: 'SRC-073', locator: 'Visa Pak 588 p1–p2' },
      ],
    },
    // Days in New Zealand as a resident in each of those portions.
    prvPortionDays: {
      value: 184,
      sources: [{ srcId: 'SRC-072', locator: 'RV2.5.1' }],
    },
    // The same, on the tax residence route.
    prvTaxPortionDays: {
      value: 41,
      sources: [{ srcId: 'SRC-072', locator: 'RV2.5.5(a)' }],
    },
    // Offshore grant: first entry within this many years of the grant.
    firstEntryYears: {
      value: 1,
      sources: [{ srcId: 'SRC-072', locator: 'R5.66.1(a)' }],
    },
    // Multiple-entry travel conditions, years from the first day in New
    // Zealand as a resident, by residence category.
    travelYears: {
      value: {
        general: 2,
        parent: 10,
        'religious-worker': 5,
        'aip-growth': 4,
        'aip-balanced': 6,
      },
      sources: [{ srcId: 'SRC-072', locator: 'R5.66.5(a)' }],
    },
    // Religious Worker resident visas: a permanent resident visa after this
    // many years from the first day as a resident.
    religiousWorkerYears: {
      value: 5,
      sources: [
        {
          srcId: 'SRC-073',
          locator:
            'Religious Worker Resident Visa → Getting a Permanent Resident Visa',
        },
      ],
    },
    citizenshipMinAge: {
      value: 16,
      sources: [{ srcId: 'SRC-070', locator: 's8(1)(a)' }],
    },
    citizenshipWindowYears: {
      value: 5,
      sources: [{ srcId: 'SRC-070', locator: 's8(2)(b)(i)' }],
    },
    citizenshipTotalDays: {
      value: 1350,
      sources: [
        { srcId: 'SRC-070', locator: 's8(2)(b)(i)' },
        { srcId: 'SRC-073', locator: 'What are the presence requirements? 2' },
      ],
    },
    citizenshipYearDays: {
      value: 240,
      sources: [
        { srcId: 'SRC-070', locator: 's8(2)(b)(ii)' },
        { srcId: 'SRC-073', locator: 'What are the presence requirements? 2' },
      ],
    },
  },
} satisfies {
  asOf: string;
  values: Record<string, Parameter<number | Record<string, number>>>;
};
