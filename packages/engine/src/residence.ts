import type { ImmigrationEpisode, IsoDate, PersonTimeline } from './types';

/** The episode valid on `date`; the most recent one if they overlap. */
export function episodeOn(
  timeline: PersonTimeline,
  date: IsoDate,
): ImmigrationEpisode | undefined {
  return timeline.episodes
    .filter((e) => e.validFrom <= date && date <= e.validTo)
    .sort((a, b) => (a.validFrom < b.validFrom ? 1 : -1))[0];
}
