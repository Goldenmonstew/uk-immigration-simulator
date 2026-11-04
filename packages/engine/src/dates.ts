import type { IsoDate } from './types';

// Dates are 'YYYY-MM-DD' strings, compared as strings and computed in UTC.

// eslint-disable-next-line no-restricted-syntax -- milliseconds per day, not a policy number
const MS_PER_DAY = 86_400_000;
// UK tax years run from 6 April to 5 April.
const TAX_YEAR_START = '04-06';

function parts(d: IsoDate): [number, number, number] {
  const [y, m, day] = d.split('-').map(Number);
  return [y, m, day];
}

function toMs(d: IsoDate): number {
  const [y, m, day] = parts(d);
  return Date.UTC(y, m - 1, day);
}

function fromMs(ms: number): IsoDate {
  return new Date(ms).toISOString().slice(0, 10);
}

export function addDays(d: IsoDate, n: number): IsoDate {
  return fromMs(toMs(d) + n * MS_PER_DAY);
}

/** Calendar months; the day is clamped to the end of the target month. */
export function addMonths(d: IsoDate, n: number): IsoDate {
  const [y, m, day] = parts(d);
  const total = y * 12 + (m - 1) + n;
  const year = Math.floor(total / 12);
  const month = total - year * 12;
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return fromMs(Date.UTC(year, month, Math.min(day, lastDay)));
}

export function addYears(d: IsoDate, n: number): IsoDate {
  return addMonths(d, n * 12);
}

/** Days from `from` to `to`; 1 for consecutive days. */
export function daysBetween(from: IsoDate, to: IsoDate): number {
  return Math.round((toMs(to) - toMs(from)) / MS_PER_DAY);
}

/** Whole years from `from` to `to` (age when `from` is the date of birth). */
export function fullYears(from: IsoDate, to: IsoDate): number {
  const [fy, fm, fd] = parts(from);
  const [ty, tm, td] = parts(to);
  return ty - fy - (tm < fm || (tm === fm && td < fd) ? 1 : 0);
}

/** English text for fullYears: "1 full year", "3 full years". */
export function fullYearsEn(from: IsoDate, to: IsoDate): string {
  const n = fullYears(from, to);
  return `${n} full year${n === 1 ? '' : 's'}`;
}

/** Days of [aFrom, aTo] inside [bFrom, bTo], both inclusive. */
export function overlapDays(
  aFrom: IsoDate,
  aTo: IsoDate,
  bFrom: IsoDate,
  bTo: IsoDate,
): number {
  const from = aFrom > bFrom ? aFrom : bFrom;
  const to = aTo < bTo ? aTo : bTo;
  return from > to ? 0 : daysBetween(from, to) + 1;
}

/** '2025-26' for any date from 2025-04-06 to 2026-04-05. */
export function taxYearOf(d: IsoDate): string {
  const y = Number(d.slice(0, 4));
  const start = d.slice(5) >= TAX_YEAR_START ? y : y - 1;
  return `${start}-${String((start + 1) % 100).padStart(2, '0')}`;
}

/** The `count` tax years immediately before the one containing `d`, oldest first. */
export function taxYearsBefore(d: IsoDate, count: number): string[] {
  const first = Number(taxYearOf(d).slice(0, 4)) - count;
  return Array.from({ length: count }, (_, i) =>
    taxYearOf(`${first + i}-${TAX_YEAR_START}`),
  );
}

/**
 * The tax years that start on or after `from` and end before the one
 * containing `d`, oldest first.
 */
export function taxYearsFrom(from: IsoDate, d: IsoDate): string[] {
  const y = Number(taxYearOf(from).slice(0, 4));
  const first = from === `${y}-${TAX_YEAR_START}` ? y : y + 1;
  const count = Number(taxYearOf(d).slice(0, 4)) - first;
  return count > 0 ? taxYearsBefore(d, count) : [];
}
