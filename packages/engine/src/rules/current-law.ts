import { currentLaw2026_11 as cl } from '@uk-immigration/policy-data';
import { addYears, fullYears } from '../dates';
import { continuousRun, episodeOn, restartAfterAbsences } from '../residence';
import { defineRule } from '../rule';
import type {
  ImmigrationEpisode,
  IsoDate,
  PersonTimeline,
  RuleContext,
} from '../types';

// Current Immigration Rules, modelled for Skilled Worker settlement (SRC-004)
// and Long Residence (SRC-005) only.

const RULE_SET = 'current-law-2026-11';

const isSkilledWorker = (e: ImmigrationEpisode) =>
  e.route === 'SKILLED_WORKER' && e.role === 'MAIN';

export function onSkilledWorker(
  timeline: PersonTimeline,
  date: IsoDate,
): boolean {
  const current = episodeOn(timeline, date);
  return current !== undefined && isSkilledWorker(current);
}

export const clScope = defineRule(
  {
    id: 'CL-SCOPE',
    ruleSetId: RULE_SET,
    title: '在现行规则的建模范围内',
    sources: [{ srcId: 'SRC-004', locator: 'SW 21.1' }],
    pendingDetails: [],
  },
  ({ timeline, simulationDate }) =>
    onSkilledWorker(timeline, simulationDate)
      ? {
          status: 'PASS',
          explanation:
            '当前持 Skilled Worker 主申请人许可，按 Appendix Skilled Worker 评估。',
        }
      : {
          status: 'UNKNOWN',
          explanation:
            '现行规则只建模了 Skilled Worker（主申请人）与 Long Residence；当前路线不是 Skilled Worker 主申请人，也不满足 Long Residence 的 10 年，无法判断其他路线的定居条件。',
        },
);

export const CR_3_1 = {
  maxDays: cl.values.continuousResidenceMaxAbsenceDays.value,
  windowMonths: cl.values.continuousResidenceWindowMonths.value,
};

const ABSENCE_ASSUMPTION = `缺席按 Appendix Continuous Residence CR 3.1 计算，出境与入境当日都计入缺席；CR 3.4 的可豁免缺席理由未建模。`;

/** Start of the continuous Skilled Worker period ending on the simulation date. */
export function skilledWorkerStart({
  timeline,
  simulationDate,
}: RuleContext): IsoDate | undefined {
  const { episodes } = continuousRun(timeline, simulationDate, isSkilledWorker);
  return episodes.length > 0
    ? restartAfterAbsences(
        episodes[0].validFrom,
        simulationDate,
        timeline.absences,
        CR_3_1,
      )
    : undefined;
}

export const clSwResidence5Y = defineRule(
  {
    id: 'CL-SW-RESIDENCE-5Y',
    ruleSetId: RULE_SET,
    title: 'Skilled Worker 连续 5 年',
    sources: [
      { srcId: 'SRC-004', locator: 'SW 21.1' },
      { srcId: 'SRC-004', locator: 'SW 21.2' },
      { srcId: 'SRC-004', locator: 'SW 22.1' },
      { srcId: 'SRC-008', locator: 'CR 3.1' },
    ],
    pendingDetails: [],
  },
  (ctx) => {
    const years = cl.values.skilledWorkerQualifyingYears.value;
    const start = skilledWorkerStart(ctx);
    const assumptions = [
      '只计 Skilled Worker 主申请人许可，未合并 SW 21.2 列出的其他可计入路线（Global Talent、Innovator Founder 等）。',
      ...(ctx.timeline.absences.length > 0 ? [ABSENCE_ASSUMPTION] : []),
    ];
    if (!start) {
      return {
        status: 'FAIL',
        explanation: '当前不是 Skilled Worker 主申请人许可。',
        assumptions,
      };
    }
    const due = addYears(start, years);
    return due <= ctx.simulationDate
      ? {
          status: 'PASS',
          explanation: `自 ${start} 起连续持 Skilled Worker 许可，已满 ${years} 年。`,
          assumptions,
        }
      : {
          status: 'FAIL',
          explanation: `自 ${start} 起连续持 Skilled Worker 许可，截至 ${ctx.simulationDate} 满 ${fullYears(start, ctx.simulationDate)} 年；${due} 满 ${years} 年。`,
          assumptions,
        };
  },
);
