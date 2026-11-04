import type {
  PersonTimeline,
  RuleOutcome,
  SettlementAssessment,
} from '@uk-immigration/engine';
import { earnedSettlement2026_11 } from '@uk-immigration/policy-data';
import { type Draft, draftReducer, visibleIncomeYears } from './questionnaire';

export interface WhatIf {
  simulationDate: string;
  incomeEnabled: boolean;
  incomeYears: number;
  earnings: number | undefined;
  english: PersonTimeline['english'];
  lifeInTheUk: PersonTimeline['lifeInTheUk'];
  noPublicFunds: boolean;
  noAbsences: boolean;
}

export function initialWhatIf(draft: Draft): WhatIf {
  return {
    simulationDate: draft.simulationDate,
    incomeEnabled: false,
    incomeYears: 7,
    earnings:
      visibleIncomeYears(draft)[0]?.earnings ??
      earnedSettlement2026_11.values.earningsThresholdMinimum.value,
    english: draft.timeline.english,
    lifeInTheUk: draft.timeline.lifeInTheUk,
    noPublicFunds: false,
    noAbsences: false,
  };
}

export function applyWhatIf(draft: Draft, whatIf: WhatIf): Draft {
  const dated =
    draft.simulationDate === whatIf.simulationDate
      ? draft
      : draftReducer(draft, { type: 'date', date: whatIf.simulationDate });
  const years = visibleIncomeYears(dated)
    .slice(0, whatIf.incomeYears)
    .map((row) => row.taxYear);
  return {
    ...dated,
    timeline: {
      ...dated.timeline,
      incomeYears: whatIf.incomeEnabled
        ? dated.timeline.incomeYears.map((row) =>
            years.includes(row.taxYear)
              ? { ...row, earnings: whatIf.earnings }
              : row,
          )
        : dated.timeline.incomeYears,
      english: whatIf.english,
      lifeInTheUk: whatIf.lifeInTheUk,
      benefits: whatIf.noPublicFunds ? [] : dated.timeline.benefits,
      absences: whatIf.noAbsences ? [] : dated.timeline.absences,
    },
  };
}

export function diffAssessment(
  before: SettlementAssessment,
  after: SettlementAssessment,
): {
  becameMet: RuleOutcome[];
  becameUnmet: RuleOutcome[];
  stillUnmet: RuleOutcome[];
  changed: boolean;
} {
  const becameMet: RuleOutcome[] = [];
  const becameUnmet: RuleOutcome[] = [];
  const stillUnmet: RuleOutcome[] = [];
  for (const rule of after.rules) {
    const previous = before.rules.find((item) => item.id === rule.id);
    if (rule.status === 'PASS') {
      if (previous?.status !== 'PASS') becameMet.push(rule);
    } else if (
      !previous ||
      previous.status === 'PASS' ||
      (previous.status === 'UNKNOWN' && rule.status === 'FAIL')
    ) {
      becameUnmet.push(rule);
    } else {
      stillUnmet.push(rule);
    }
  }
  return {
    becameMet,
    becameUnmet,
    stillUnmet,
    changed: JSON.stringify(before) !== JSON.stringify(after),
  };
}
