import type { SourceRef } from '@uk-immigration/policy-data';
import { addDays, addYears, daysBetween } from './dates';
import type { IsoDate } from './types';

// Shared shapes and day counting for the country pilots (phase 17 on):
// each pilot works out the dates other countries' rules fix by time alone.

export type PilotStatus =
  'MET' | 'FUTURE' | 'NOT_MET' | 'UNKNOWN' | 'NOT_APPLICABLE';

/** One requirement checked on the simulation date. */
export interface PilotCheck {
  text: string;
  /** Absent = cannot tell from the answers. */
  met?: boolean;
  sources: SourceRef[];
}

export interface PilotPathway<Id extends string = string> {
  id: Id;
  title: string;
  status: PilotStatus;
  /** MET: the simulation date; FUTURE: the first later date all checks pass. */
  earliestDate?: IsoDate;
  summary: string;
  checks: PilotCheck[];
  /** Requirements this pilot does not check. */
  notChecked: string[];
  assumptions: string[];
  pendingDetails?: string[];
}

export interface PilotResult<Id extends string = string> {
  policyAsOf: IsoDate;
  pathways: PilotPathway<Id>[];
}

// Engine search limit for projected dates, not a policy number.
export const HORIZON_YEARS = 10;

/**
 * The `n`th anniversary of `d`; from 29 February, 1 March in a year
 * without one.
 */
export const afterYears = (d: IsoDate, n: number) => {
  const date = addYears(d, n);
  return date.slice(5) === d.slice(5) ? date : addDays(date, 1);
};

/** Daily flags from `start` with prefix sums, for window counts. */
export class Days {
  readonly count: number;
  constructor(
    readonly start: IsoDate,
    end: IsoDate,
  ) {
    this.count = daysBetween(start, end) + 1;
  }
  index(d: IsoDate): number {
    return daysBetween(this.start, d);
  }
  date(i: number): IsoDate {
    return addDays(this.start, i);
  }
  /** Prefix sums of `flag` over every day. */
  sums(flag: (i: number) => boolean): number[] {
    const sums = [0];
    for (let i = 0; i < this.count; i++) sums.push(sums[i] + (flag(i) ? 1 : 0));
    return sums;
  }
  /** Days flagged in [from, to], both inclusive. */
  total(sums: number[], from: IsoDate, to: IsoDate): number {
    const a = Math.max(0, this.index(from));
    const b = Math.min(this.count - 1, this.index(to));
    return a > b ? 0 : sums[b + 1] - sums[a];
  }
  /** Flag each day of [from, to] (to absent = to the end). */
  mark(flags: boolean[], from: IsoDate, to?: IsoDate): void {
    const a = Math.max(0, this.index(from));
    const b = Math.min(this.count - 1, to ? this.index(to) : this.count - 1);
    for (let i = a; i <= b; i++) flags[i] = true;
  }
}
