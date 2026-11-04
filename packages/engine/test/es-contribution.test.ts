import { describe, expect, test } from 'vitest';
import {
  esEarnings10Y,
  esEarnings3Y,
  esEarnings5Y,
} from '../src/rules/es-contribution';
import type { IncomeYear } from '../src/types';
import { run } from './helpers';

// SIMULATION_DATE 2026-11-04 is in 2026-27, so windows end with 2025-26.
const LAST_SEVEN = [
  '2019-20',
  '2020-21',
  '2021-22',
  '2022-23',
  '2023-24',
  '2024-25',
  '2025-26',
];

/** Income for the last tax years, newest last; earlier years get `before`. */
function income(recent: (number | undefined)[], before?: number): IncomeYear[] {
  return LAST_SEVEN.map((taxYear, i) => {
    const j = i - (LAST_SEVEN.length - recent.length);
    return { taxYear, earnings: j >= 0 ? recent[j] : before };
  });
}

describe('ES-EARNINGS-5Y', () => {
  test('£50,270 does not meet, £50,271 and £50,272 do', () => {
    const at = (amount: number) =>
      run(esEarnings5Y, {
        incomeYears: income([amount, amount, amount, amount, amount], 0),
      }).status;
    expect(at(50270)).toBe('FAIL');
    expect(at(50271)).toBe('PASS');
    expect(at(50272)).toBe('PASS');
  });

  test('3 of 5 years pass, 2 of 5 fail', () => {
    expect(
      run(esEarnings5Y, { incomeYears: income([60000, 0, 60000, 0, 60000], 0) })
        .status,
    ).toBe('PASS');
    expect(
      run(esEarnings5Y, { incomeYears: income([60000, 0, 0, 0, 60000], 0) })
        .status,
    ).toBe('FAIL');
  });

  test('2 met plus 1 missing is unknown from missing input', () => {
    const result = run(esEarnings5Y, {
      incomeYears: income([undefined, 0, 0, 60000, 60000], 0),
    });
    expect(result.status).toBe('UNKNOWN');
    expect(result.pendingDetails).toBeUndefined();
  });
});

describe('ES-EARNINGS-3Y', () => {
  test('3 of the last 4 years at £125,141 pass; 2 fail', () => {
    expect(
      run(esEarnings3Y, { incomeYears: income([125141, 0, 125141, 125141], 0) })
        .status,
    ).toBe('PASS');
    expect(
      run(esEarnings3Y, { incomeYears: income([125141, 0, 0, 125141], 125141) })
        .status,
    ).toBe('FAIL');
  });
});

describe('ES-EARNINGS-10Y', () => {
  test('5 of 7 years pass, 4 of 7 fail', () => {
    expect(
      run(esEarnings10Y, {
        incomeYears: income([20000, 20000, 0, 0, 20000, 20000, 20000]),
      }).status,
    ).toBe('PASS');
    expect(
      run(esEarnings10Y, {
        incomeYears: income([20000, 0, 0, 0, 20000, 20000, 20000]),
      }).status,
    ).toBe('FAIL');
  });

  test('household income: £25,142 combined meets, £25,141 does not', () => {
    const at = (partnerEarnings: number) =>
      run(esEarnings10Y, {
        incomeYears: LAST_SEVEN.map((taxYear) => ({
          taxYear,
          earnings: 9000,
          partnerEarnings,
        })),
      });
    expect(at(16142).status).toBe('PASS');
    expect(at(16142).assumptions?.join('')).toContain('PD-010');
    expect(at(16141).status).toBe('FAIL');
  });

  test('age 65 and the health exemption pass without income', () => {
    expect(
      run(esEarnings10Y, { incomeYears: [], dateOfBirth: '1961-11-04' }).status,
    ).toBe('PASS');
    expect(
      run(esEarnings10Y, { incomeYears: [], dateOfBirth: '1961-11-05' }).status,
    ).toBe('UNKNOWN');
    expect(
      run(esEarnings10Y, { incomeYears: [], earningsExemptHealth: true })
        .status,
    ).toBe('PASS');
  });
});
