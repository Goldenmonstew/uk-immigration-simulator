import { currentLaw2026_11 as cl } from '@uk-immigration/policy-data';
import { addYears, fullYears } from '../dates';
import { continuousRun, episodeOn, restartAfterAbsences } from '../residence';
import { defineRule } from '../rule';
import { gbp } from './es-contribution';
import { meetsCefr } from './es-requirements';
import type { Route } from '@uk-immigration/policy-data';
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
    sources: [
      { srcId: 'SRC-004', locator: 'SW 21.1' },
      { srcId: 'SRC-005', locator: 'LR 11.1' },
    ],
    pendingDetails: [],
  },
  (ctx) => {
    if (onSkilledWorker(ctx.timeline, ctx.simulationDate)) {
      return {
        status: 'PASS',
        explanation:
          '当前持 Skilled Worker 主申请人许可，按 Appendix Skilled Worker 与 Appendix Long Residence 评估。',
      };
    }
    return longResidenceMet(ctx)
      ? {
          status: 'PASS',
          explanation:
            '已满 10 年连续合法居留，按 Appendix Long Residence 评估。',
        }
      : {
          status: 'UNKNOWN',
          explanation:
            '现行规则只建模了 Skilled Worker（主申请人）与 Long Residence；当前路线不是 Skilled Worker 主申请人，也不满足 Long Residence 的 10 年，无法判断其他路线的定居条件。',
        };
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

export const clSwSalary = defineRule(
  {
    id: 'CL-SW-SALARY',
    ruleSetId: RULE_SET,
    title: 'Skilled Worker 定居薪资',
    sources: [{ srcId: 'SRC-004', locator: 'SW 24.3' }],
    pendingDetails: [],
  },
  ({ timeline, simulationDate }) => {
    const threshold = cl.values.skilledWorkerGeneralSalaryThreshold.value;
    const current = episodeOn(timeline, simulationDate);
    if (!current || !isSkilledWorker(current)) {
      return {
        status: 'FAIL',
        explanation: '当前不是 Skilled Worker 主申请人许可。',
      };
    }
    if (current.salary === undefined) {
      return {
        status: 'UNKNOWN',
        explanation: '未填写当前 Skilled Worker 工作的年薪。',
      };
    }
    return current.salary >= threshold
      ? {
          status: 'PASS',
          explanation: `当前年薪 ${gbp(current.salary)}，达到 SW 24.3 row A 的一般门槛 ${gbp(threshold)}。`,
          assumptions: [
            '薪资还须达到该职业的 going rate（Appendix Skilled Occupations Table 1 / 1a），本工具未核对。',
          ],
        }
      : {
          status: 'UNKNOWN',
          explanation: `当前年薪 ${gbp(current.salary)}，低于 SW 24.3 row A 的 ${gbp(threshold)}；若适用 rows B–E（Immigration Salary List、新入职、Table 3 医疗与教育职业等），门槛更低，需按具体职业判断。`,
        };
  },
);

function ageExempt(timeline: PersonTimeline, date: IsoDate): boolean {
  const age = fullYears(timeline.dateOfBirth, date);
  return (
    age < cl.values.settlementMinorAge.value ||
    age >= cl.values.settlementExemptionAge.value
  );
}

export const clEnglish = defineRule(
  {
    id: 'CL-ENGLISH',
    ruleSetId: RULE_SET,
    title: '定居英语要求',
    sources: [
      { srcId: 'SRC-004', locator: 'SW 22A.1' },
      { srcId: 'SRC-007', locator: 'p24' },
      { srcId: 'SRC-005', locator: 'LR 13.1' },
      { srcId: 'SRC-014', locator: 'EL 1.1' },
    ],
    pendingDetails: [],
  },
  ({ timeline, simulationDate }) => {
    if (ageExempt(timeline, simulationDate)) {
      return {
        status: 'PASS',
        explanation: `申请日未满 ${cl.values.settlementMinorAge.value} 岁或已满 ${cl.values.settlementExemptionAge.value} 岁，豁免英语要求。`,
      };
    }
    const sw = onSkilledWorker(timeline, simulationDate);
    const b2 = sw
      ? cl.values.skilledWorkerSettlementEnglish.value
      : cl.values.longResidenceSettlementEnglish.value;
    const required =
      simulationDate >= b2.applicationsFrom
        ? b2.cefrLevel
        : sw
          ? undefined
          : cl.values.longResidenceSettlementEnglishBefore.value;
    if (!required) {
      return {
        status: 'PASS',
        explanation: `申请日早于 ${b2.applicationsFrom}，Appendix Skilled Worker 未对定居另设英语要求（SW 22A.1 的 ${b2.cefrLevel} 只适用于此后的申请）。`,
      };
    }
    const english = timeline.english;
    if (!english) {
      return {
        status: 'UNKNOWN',
        explanation: `未填写英语水平；定居要求 CEFR ${required}。`,
      };
    }
    if ('exempt' in english) {
      return {
        status: 'PASS',
        explanation: '申报因身心状况豁免英语要求。',
        assumptions: ['身心状况豁免按用户申报，未核实认定标准。'],
      };
    }
    return meetsCefr(english.cefrLevel, required)
      ? {
          status: 'PASS',
          explanation: `英语 ${english.cefrLevel}，达到定居要求的 ${required}。`,
        }
      : {
          status: 'FAIL',
          explanation: `英语 ${english.cefrLevel}，低于定居要求的 ${required}${required === b2.cefrLevel ? `（${b2.applicationsFrom} 起的申请）` : ''}。`,
        };
  },
);

export const clKol = defineRule(
  {
    id: 'CL-KOL',
    ruleSetId: RULE_SET,
    title: '通过 Life in the UK 考试',
    sources: [
      { srcId: 'SRC-004', locator: 'SW 23.1' },
      { srcId: 'SRC-005', locator: 'LR 14.1' },
      { srcId: 'SRC-015', locator: 'KOL 1.1' },
      { srcId: 'SRC-015', locator: 'KOL 2.1' },
    ],
    pendingDetails: [],
  },
  ({ timeline, simulationDate }) => {
    if (ageExempt(timeline, simulationDate)) {
      return {
        status: 'PASS',
        explanation: `申请日未满 ${cl.values.settlementMinorAge.value} 岁或已满 ${cl.values.settlementExemptionAge.value} 岁，豁免 Life in the UK 考试。`,
      };
    }
    const kol = timeline.lifeInTheUk;
    if (!kol) {
      return {
        status: 'UNKNOWN',
        explanation: '未填写是否已通过 Life in the UK 考试。',
      };
    }
    return 'exempt' in kol
      ? {
          status: 'PASS',
          explanation: '申报因身心状况豁免 Life in the UK 考试。',
          assumptions: ['身心状况豁免按用户申报，未核实认定标准。'],
        }
      : { status: 'PASS', explanation: '已通过 Life in the UK 考试。' };
  },
);

// LR 11.1(a): permission on any route counts except these. Short-term Student
// (English language) is not a separate route here.
const LR_EXCLUDED: Route[] = ['VISIT', 'SEASONAL_WORKER', 'UKRAINE_SCHEME'];

/** Start of the continuous lawful residence for Long Residence. */
export function longResidenceStart({
  timeline,
  simulationDate,
}: RuleContext): IsoDate | undefined {
  const { episodes } = continuousRun(
    timeline,
    simulationDate,
    (e) => !LR_EXCLUDED.includes(e.route),
  );
  return episodes.length > 0
    ? restartAfterAbsences(
        episodes[0].validFrom,
        simulationDate,
        timeline.absences,
        {
          ...CR_3_1,
          legacy: {
            before: cl.values.longResidenceLegacyAbsenceBefore.value,
            maxSingleDays:
              cl.values.longResidenceLegacyMaxSingleAbsenceDays.value,
            maxTotalDays:
              cl.values.longResidenceLegacyMaxTotalAbsenceDays.value,
          },
        },
      )
    : undefined;
}

function longResidenceMet(ctx: RuleContext): boolean {
  const start = longResidenceStart(ctx);
  return (
    start !== undefined &&
    addYears(start, cl.values.longResidenceQualifyingYears.value) <=
      ctx.simulationDate
  );
}

export const clLrResidence10Y = defineRule(
  {
    id: 'CL-LR-RESIDENCE-10Y',
    ruleSetId: RULE_SET,
    title: 'Long Residence 连续合法居留 10 年',
    sources: [
      { srcId: 'SRC-005', locator: 'LR 11.1' },
      { srcId: 'SRC-005', locator: 'LR 11.2' },
      { srcId: 'SRC-008', locator: 'CR 3.1' },
      { srcId: 'SRC-008', locator: 'CR 3.3' },
    ],
    pendingDetails: [],
  },
  (ctx) => {
    const years = cl.values.longResidenceQualifyingYears.value;
    const start = longResidenceStart(ctx);
    const assumptions = [
      `连续合法居留计入 Student、Graduate 等临时路线，不计 ${LR_EXCLUDED.join('、')}（LR 11.1(a)）；LR 11.2 不计入的期间（immigration bail 等）与 LR 11.3 的 12 个月要求未建模。`,
      ...(ctx.timeline.absences.length > 0
        ? [
            `${cl.values.longResidenceLegacyAbsenceBefore.value} 前开始的缺席按 CR 3.3（单次不超过 ${cl.values.longResidenceLegacyMaxSingleAbsenceDays.value} 天、累计不超过 ${cl.values.longResidenceLegacyMaxTotalAbsenceDays.value} 天），之后的按 CR 3.1；出境与入境当日都计入缺席。`,
          ]
        : []),
    ];
    if (!start) {
      return {
        status: 'FAIL',
        explanation: `${ctx.simulationDate} 当日没有计入 Long Residence 的许可。`,
        assumptions,
      };
    }
    const due = addYears(start, years);
    return due <= ctx.simulationDate
      ? {
          status: 'PASS',
          explanation: `自 ${start} 起连续合法居留，已满 ${years} 年。`,
          assumptions,
        }
      : {
          status: 'FAIL',
          explanation: `自 ${start} 起连续合法居留，截至 ${ctx.simulationDate} 满 ${fullYears(start, ctx.simulationDate)} 年；${due} 满 ${years} 年。`,
          assumptions,
        };
  },
);
