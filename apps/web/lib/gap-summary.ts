import type { SettlementAssessment } from '@uk-immigration/engine';

export function gapRules(assessment: SettlementAssessment) {
  const onlyFailures =
    assessment.outcome === 'LIKELY_NOT_ELIGIBLE' && !!assessment.earliestDate;
  return assessment.rules.filter(
    (rule) =>
      (!assessment.decidedBy || assessment.decidedBy.includes(rule.id)) &&
      (rule.status === 'FAIL' || (!onlyFailures && rule.status === 'UNKNOWN')),
  );
}

export function firstSentence(text: string, locale: string): string {
  const sentences = new Intl.Segmenter(locale, {
    granularity: 'sentence',
  }).segment(text);
  return sentences[Symbol.iterator]().next().value?.segment.trim() ?? '';
}

// Calendar months, rounded up so a future date never reads as no wait.
export function remainingTime(simulationDate: string, earliestDate: string) {
  if (earliestDate <= simulationDate) return { years: 0, months: 0 };
  const [fromYear, fromMonth, fromDay] = simulationDate.split('-').map(Number);
  const [toYear, toMonth, toDay] = earliestDate.split('-').map(Number);
  const lastDay = new Date(Date.UTC(toYear, toMonth, 0)).getUTCDate();
  const months =
    (toYear - fromYear) * 12 +
    toMonth -
    fromMonth +
    (toDay > Math.min(fromDay, lastDay) ? 1 : 0);
  return { years: Math.floor(months / 12), months: months % 12 };
}
