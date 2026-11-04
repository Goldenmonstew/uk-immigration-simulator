import { describe, expect, test } from 'vitest';
import {
  addMonths,
  addYears,
  daysBetween,
  fullYears,
  overlapDays,
  taxYearOf,
  taxYearsBefore,
} from '../src/dates';

describe('dates', () => {
  test('addMonths clamps to month end', () => {
    expect(addMonths('2024-01-31', 1)).toBe('2024-02-29');
    expect(addYears('2024-02-29', 1)).toBe('2025-02-28');
    expect(addYears('2019-11-01', 5)).toBe('2024-11-01');
    expect(addMonths('2025-03-15', -12)).toBe('2024-03-15');
  });

  test('daysBetween and overlapDays', () => {
    expect(daysBetween('2024-02-28', '2024-03-01')).toBe(2);
    expect(
      overlapDays('2024-01-01', '2024-01-10', '2024-01-05', '2024-02-01'),
    ).toBe(6);
    expect(
      overlapDays('2024-01-01', '2024-01-10', '2024-01-11', '2024-02-01'),
    ).toBe(0);
  });

  test('fullYears turns on the anniversary', () => {
    expect(fullYears('1961-11-04', '2026-11-03')).toBe(64);
    expect(fullYears('1961-11-04', '2026-11-04')).toBe(65);
  });

  test('tax years start on 6 April', () => {
    expect(taxYearOf('2026-04-05')).toBe('2025-26');
    expect(taxYearOf('2026-04-06')).toBe('2026-27');
    expect(taxYearOf('1999-12-31')).toBe('1999-00');
    expect(taxYearsBefore('2026-11-04', 3)).toEqual([
      '2023-24',
      '2024-25',
      '2025-26',
    ]);
  });
});
