import { addDays, addMonths, daysBetween, overlapDays } from './dates';
import type {
  Absence,
  ImmigrationEpisode,
  IsoDate,
  PersonTimeline,
} from './types';

/** The episode valid on `date`; the most recent one if they overlap. */
export function episodeOn(
  timeline: PersonTimeline,
  date: IsoDate,
): ImmigrationEpisode | undefined {
  return timeline.episodes
    .filter((e) => e.validFrom <= date && date <= e.validTo)
    .sort((a, b) => (a.validFrom < b.validFrom ? 1 : -1))[0];
}

// Consecutive permissions with at most this many uncovered days between them
// count as continuous (engine assumption, PD-053).
const MAX_GAP_DAYS = 1;

export interface Run {
  /** Oldest first; empty when the episode on the date does not count. */
  episodes: ImmigrationEpisode[];
  /** The adjoining earlier episode that does not count, if that ended the run. */
  stoppedAt?: ImmigrationEpisode;
}

/** The consecutive episodes satisfying `counts` that end with the one on `date`. */
export function continuousRun(
  timeline: PersonTimeline,
  date: IsoDate,
  counts: (e: ImmigrationEpisode) => boolean,
): Run {
  const current = episodeOn(timeline, date);
  if (!current || !counts(current)) return { episodes: [] };
  const episodes = [current];
  for (;;) {
    const from = episodes[0].validFrom;
    const previous = timeline.episodes
      .filter(
        (e) =>
          e.validFrom < from &&
          !episodes.includes(e) &&
          daysBetween(e.validTo, from) <= MAX_GAP_DAYS + 1,
      )
      .sort((a, b) => (a.validTo < b.validTo ? 1 : -1))[0];
    if (!previous) return { episodes };
    if (!counts(previous)) return { episodes, stoppedAt: previous };
    episodes.unshift(previous);
  }
}

export interface AbsenceLimit {
  maxDays: number;
  windowMonths: number;
}

/**
 * `start`, moved to the day after each absence that breaks continuous
 * residence: more than `maxDays` outside the UK in any `windowMonths`
 * (SRC-008 CR 3.1). Absences count both the departure and the return day.
 */
export function restartAfterAbsences(
  start: IsoDate,
  date: IsoDate,
  absences: Absence[],
  limit: AbsenceLimit,
): IsoDate {
  const relevant = absences
    .filter((a) => a.to >= start && a.from <= date)
    .sort((a, b) => (a.from < b.from ? -1 : 1));
  let from = start;
  for (const absence of relevant) {
    if (absence.to < from) continue;
    const end = absence.to < date ? absence.to : date;
    const windowStart = addDays(addMonths(end, -limit.windowMonths), 1);
    const windowFrom = windowStart > from ? windowStart : from;
    const days = relevant.reduce(
      (sum, a) => sum + overlapDays(a.from, a.to, windowFrom, end),
      0,
    );
    if (days > limit.maxDays) from = addDays(absence.to, 1);
  }
  return from;
}
