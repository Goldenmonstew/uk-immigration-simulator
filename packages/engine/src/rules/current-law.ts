import {
  currentLaw2026_11 as cl,
  goingRates,
  healthAndCareAsheOccupations,
  nationalPayScaleOccupations,
} from '@uk-immigration/policy-data';
import { addYears, fullYears } from '../dates';
import { continuousRun, episodeOn, restartAfterAbsences } from '../residence';
import { defineRule } from '../rule';
import { gbp } from './es-contribution';
import { meetsCefr } from './es-requirements';
import type { GoingRate, Route } from '@uk-immigration/policy-data';
import type {
  ImmigrationEpisode,
  IsoDate,
  PersonTimeline,
  RuleContext,
  RuleResult,
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

// A Skilled Worker's dependant: the run of such permissions counts towards
// settlement as a dependent partner (SW 42.1).
const isSkilledWorkerDependant = (e: ImmigrationEpisode) =>
  e.route === 'SKILLED_WORKER' && e.role === 'DEPENDANT';

export function onSkilledWorkerPartner(
  timeline: PersonTimeline,
  date: IsoDate,
): boolean {
  const current = episodeOn(timeline, date);
  return (
    current !== undefined &&
    isSkilledWorkerDependant(current) &&
    current.dependantOf === 'PARTNER'
  );
}

export function onSkilledWorkerChild(
  timeline: PersonTimeline,
  date: IsoDate,
): boolean {
  const current = episodeOn(timeline, date);
  return (
    current !== undefined &&
    isSkilledWorkerDependant(current) &&
    current.dependantOf === 'PARENT'
  );
}

export const clScope = defineRule(
  {
    id: 'CL-SCOPE',
    ruleSetId: RULE_SET,
    title: '在现行规则的建模范围内',
    sources: [
      { srcId: 'SRC-004', locator: 'SW 21.1' },
      { srcId: 'SRC-004', locator: 'SW 39.1' },
      { srcId: 'SRC-004', locator: 'SW 41A.1' },
      { srcId: 'SRC-005', locator: 'LR 11.1' },
    ],
    pendingDetails: [],
  },
  (ctx) => {
    const { timeline, simulationDate } = ctx;
    if (onSkilledWorker(timeline, simulationDate)) {
      return {
        status: 'PASS',
        explanation:
          '当前持 Skilled Worker 主申请人许可，按 Appendix Skilled Worker 与 Appendix Long Residence 评估。',
      };
    }
    const partner = onSkilledWorkerPartner(timeline, simulationDate);
    if (partner && ctx.principal) {
      return {
        status: 'PASS',
        explanation:
          '当前持 Skilled Worker 的 dependent partner 许可，按 Appendix Skilled Worker 的伴侣定居要求（SW 38–SW 46）与 Appendix Long Residence 评估。',
      };
    }
    const child = onSkilledWorkerChild(timeline, simulationDate);
    if (child && ctx.principal) {
      return {
        status: 'PASS',
        explanation:
          '当前持 Skilled Worker 的 dependent child 许可，按 Appendix Skilled Worker 的子女定居要求（SW 38–SW 46、Appendix Children）与 Appendix Long Residence 评估。',
      };
    }
    if (longResidenceMet(ctx)) {
      return {
        status: 'PASS',
        explanation:
          '已满 10 年连续合法居留，按 Appendix Long Residence 评估。',
      };
    }
    const current = episodeOn(timeline, simulationDate);
    const explanation =
      current && isSkilledWorkerDependant(current)
        ? partner || child
          ? `当前持 Skilled Worker 的 dependent ${partner ? 'partner' : 'child'} 许可；填写主申请人信息后可按 SW 38–SW 46 判断。`
          : '当前持 Skilled Worker 的 dependant 许可，未填写是作为主申请人的伴侣还是子女随行。'
        : '现行规则只建模了 Skilled Worker（主申请人及其 dependent partner / child）与 Long Residence；当前路线不在其中，也不满足 Long Residence 的 10 年，无法判断其他路线的定居条件。';
    return { status: 'UNKNOWN', explanation };
  },
);

export const CR_3_1 = {
  maxDays: cl.values.continuousResidenceMaxAbsenceDays.value,
  windowMonths: cl.values.continuousResidenceWindowMonths.value,
};

const ABSENCE_ASSUMPTION = `缺席按 Appendix Continuous Residence CR 3.1 计算，出境与入境当日都计入缺席；CR 3.4 的可豁免缺席理由未建模。`;

// SW 21.2(a)–(h): permission (not as a dependant) on any combination of these
// routes counts towards the 5 years. Representative of an Overseas Business
// and Tier 1 are not in Route; SW 21.2(i) is not modelled.
const SW_QUALIFYING_ROUTES: Route[] = [
  'SKILLED_WORKER',
  'GLOBAL_TALENT',
  'INNOVATOR_FOUNDER',
  'MINISTER_OF_RELIGION',
  'INTERNATIONAL_SPORTSPERSON',
  'SCALE_UP',
];

const countsForSkilledWorker = (e: ImmigrationEpisode) =>
  e.role === 'MAIN' && SW_QUALIFYING_ROUTES.includes(e.route);

/**
 * Start of the continuous SW 21.2 period ending on the simulation date, while
 * on Skilled Worker.
 */
export function skilledWorkerStart({
  timeline,
  simulationDate,
}: RuleContext): IsoDate | undefined {
  if (!onSkilledWorker(timeline, simulationDate)) return undefined;
  const { episodes } = continuousRun(
    timeline,
    simulationDate,
    countsForSkilledWorker,
  );
  return restartAfterAbsences(
    episodes[0].validFrom,
    simulationDate,
    timeline.absences,
    CR_3_1,
  );
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
      '连续期合并 SW 21.2 列出的 Skilled Worker、Global Talent、Innovator Founder、T2 Minister of Religion、International Sportsperson、Scale-up 主申请人许可；Representative of an Overseas Business 与 Tier 1 本工具无法填写，不计入；SW 21.2(i) 的等待决定期间未建模。',
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
          explanation: `自 ${start} 起连续持可计入 Skilled Worker 定居的许可（SW 21.2），已满 ${years} 年。`,
          assumptions,
        }
      : {
          status: 'FAIL',
          explanation: `自 ${start} 起连续持可计入 Skilled Worker 定居的许可（SW 21.2），截至 ${ctx.simulationDate} 满 ${fullYears(start, ctx.simulationDate)} 年；${due} 满 ${years} 年。`,
          assumptions,
        };
  },
);

/** The relevant row of the table in SW 24.3 (row E is not modelled). */
export interface SalaryRow {
  row: 'A' | 'B' | 'C' | 'D';
  /** General salary, GBP per year. */
  threshold: number;
  /** Why this row applies, for explanations. */
  reason: string;
  /** Lower rows might apply but `socCode` is missing. */
  socMissing: boolean;
  /** Start of the continuous Skilled Worker (not SW 21.2) permission. */
  skilledWorkerFrom: IsoDate;
  assumptions: string[];
}

const inTable = (rows: { socCode: string }[], soc: string | undefined) =>
  soc !== undefined && rows.some((r) => r.socCode === soc);

/** Undefined unless on Skilled Worker on the simulation date. */
export function settlementSalaryRow({
  timeline,
  simulationDate,
}: RuleContext): SalaryRow | undefined {
  const current = episodeOn(timeline, simulationDate);
  if (!current || !isSkilledWorker(current)) return undefined;
  const v = cl.values;
  const soc = current.socCode;
  const skilledWorkerFrom = continuousRun(
    timeline,
    simulationDate,
    isSkilledWorker,
  ).episodes[0].validFrom;
  const table3 = inTable(nationalPayScaleOccupations.rows, soc);
  const ashe = inTable(healthAndCareAsheOccupations.occupations, soc);
  // SW 4.2(b)(ii)
  const pre2024 =
    skilledWorkerFrom < v.skilledWorkerPre2024RulesBefore.value &&
    simulationDate < v.skilledWorkerPre2024ApplicationsBefore.value;
  const isl = current.immigrationSalaryList === true;
  const pre2024Reason = `自 ${skilledWorkerFrom} 起连续持 Skilled Worker 许可，早于 ${v.skilledWorkerPre2024RulesBefore.value}，且申请日早于 ${v.skilledWorkerPre2024ApplicationsBefore.value}（SW 4.2(b)(ii)）`;
  const asheReason = `SOC ${soc} 属 Health and Care ASHE salary job（SW A1.1）`;
  const b42Reason = pre2024 ? pre2024Reason : asheReason;
  const assumptions = [
    'SW 24.3 row E（5 年期含 Tier 2 (General) 下的 STEM 类 SOC 2010 职业）未建模。',
    ...(current.immigrationSalaryList === undefined
      ? ['未申报是否在 Immigration Salary List 上，按不在清单处理。']
      : []),
    ...(ashe && !pre2024
      ? [
          `SOC ${soc} 在 SW A1.1 的 Health and Care ASHE salary job 职业列表内，假设雇主属 SW A1.1(a)–(f) 列出的类型。`,
        ]
      : []),
    ...(pre2024
      ? [
          `"${v.skilledWorkerPre2024RulesBefore.value} 前按当时规则获批"按连续 Skilled Worker 许可的起始日判断（SW 4.2(b)(ii)）。`,
        ]
      : []),
  ];
  const base = {
    socMissing: soc === undefined,
    skilledWorkerFrom,
    assumptions,
  };
  if (table3) {
    return {
      ...base,
      socMissing: false,
      row: 'D',
      threshold: v.skilledWorkerSettlementSalaryRowD.value,
      reason: `SOC ${soc} 是 Appendix Skilled Occupations Table 3 的医疗 / 教育职业`,
    };
  }
  if (isl && (pre2024 || ashe)) {
    return {
      ...base,
      socMissing: false,
      row: 'D',
      threshold: v.skilledWorkerSettlementSalaryRowD.value,
      reason: `岗位在 Immigration Salary List 上，且${b42Reason}`,
    };
  }
  if (pre2024 || ashe) {
    return {
      ...base,
      row: 'C',
      threshold: v.skilledWorkerSettlementSalaryRowC.value,
      reason: b42Reason,
    };
  }
  if (isl) {
    return {
      ...base,
      row: 'B',
      threshold: v.skilledWorkerSettlementSalaryRowB.value,
      reason: '岗位在 Immigration Salary List 上',
    };
  }
  return {
    ...base,
    row: 'A',
    threshold: v.skilledWorkerGeneralSalaryThreshold.value,
    reason: '不适用 rows B–E',
  };
}

export const clSwSalary = defineRule(
  {
    id: 'CL-SW-SALARY',
    ruleSetId: RULE_SET,
    title: 'Skilled Worker 定居薪资（general salary）',
    sources: [
      { srcId: 'SRC-004', locator: 'SW 24.3' },
      { srcId: 'SRC-004', locator: 'SW 4.2(b)' },
      { srcId: 'SRC-004', locator: 'SW A1.1' },
      { srcId: 'SRC-017', locator: 'Table 3' },
    ],
    pendingDetails: [],
  },
  (ctx) => {
    const row = settlementSalaryRow(ctx);
    if (!row) {
      return {
        status: 'FAIL',
        explanation: '当前不是 Skilled Worker 主申请人许可。',
      };
    }
    const salary = episodeOn(ctx.timeline, ctx.simulationDate)!.salary;
    const { assumptions } = row;
    if (salary === undefined) {
      return {
        status: 'UNKNOWN',
        explanation: '未填写当前 Skilled Worker 工作的年薪。',
        assumptions,
      };
    }
    const which = `按 SW 24.3 row ${row.row}（${row.reason}），general salary 门槛 ${gbp(row.threshold)}`;
    if (salary >= row.threshold) {
      return {
        status: 'PASS',
        explanation: `${which}；当前年薪 ${gbp(salary)}，已达到。`,
        assumptions,
      };
    }
    return row.socMissing
      ? {
          status: 'UNKNOWN',
          explanation: `${which}；当前年薪 ${gbp(salary)} 低于此门槛。未填写 SOC 职业代码，若属 Table 3 医疗 / 教育职业或 Health and Care ASHE salary job，适用更低的 row C / D。`,
          assumptions,
        }
      : {
          status: 'FAIL',
          explanation: `${which}；当前年薪 ${gbp(salary)}，低于此门槛。`,
          assumptions,
        };
  },
);

// Going-rate tables for each SW 24.3 row, in lookup order (row D's Table 3
// occupations use the national pay scales in Tables 3–5, not extracted).
const GOING_RATE_TABLES: Record<SalaryRow['row'], GoingRate['table'][]> = {
  A: ['1', '1a'],
  B: ['1', '1a'],
  C: ['2', '2aa', '2a'],
  D: ['2', '2aa', '2a'],
};

/** Additional tables only cover those first granted before a date (SW 6.1). */
function grantedBefore(table: GoingRate['table']): IsoDate | undefined {
  if (table === '1a' || table === '2aa') {
    return cl.values.skilledWorkerPre2025RulesBefore.value;
  }
  return table === '2a'
    ? cl.values.skilledWorkerPre2024RulesBefore.value
    : undefined;
}

export const clSwGoingRate = defineRule(
  {
    id: 'CL-SW-GOING-RATE',
    ruleSetId: RULE_SET,
    title: 'Skilled Worker 定居薪资（going rate）',
    sources: [
      { srcId: 'SRC-004', locator: 'SW 24.3' },
      { srcId: 'SRC-004', locator: 'SW 6.1' },
      { srcId: 'SRC-004', locator: 'SW 14.4' },
      goingRates.source,
    ],
    pendingDetails: [],
  },
  (ctx) => {
    const row = settlementSalaryRow(ctx);
    if (!row) {
      return {
        status: 'FAIL',
        explanation: '当前不是 Skilled Worker 主申请人许可。',
      };
    }
    const { socCode, salary } = episodeOn(ctx.timeline, ctx.simulationDate)!;
    const assumptions = [
      'going rate 按每周 37.5 小时的全额年薪比较，未按实际工时折算（SW 14.4）。',
    ];
    if (socCode === undefined) {
      return {
        status: 'UNKNOWN',
        explanation:
          '未填写当前 Skilled Worker 工作的 SOC 2020 职业代码，无法查 going rate。',
        assumptions,
      };
    }
    if (row.row === 'D' && inTable(nationalPayScaleOccupations.rows, socCode)) {
      return {
        status: 'UNKNOWN',
        explanation: `SOC ${socCode} 是 Table 3 医疗 / 教育职业，going rate 按国家薪级（Appendix Skilled Occupations Table 3–5）确定；Table 4 / 5 的薪级本工具未提取，无法核对。`,
        assumptions,
      };
    }
    if (salary === undefined) {
      return {
        status: 'UNKNOWN',
        explanation: '未填写当前 Skilled Worker 工作的年薪。',
        assumptions,
      };
    }
    const tables = GOING_RATE_TABLES[row.row];
    const found = tables.flatMap((table) =>
      goingRates.rows.filter((r) => r.table === table && r.socCode === socCode),
    );
    const rate = found.find((r) => {
      const before = grantedBefore(r.table);
      return before === undefined || row.skilledWorkerFrom < before;
    });
    const tableNames = tables.map((t) => `Table ${t}`).join(' / ');
    if (!rate) {
      return {
        status: 'UNKNOWN',
        explanation:
          found.length > 0
            ? `SOC ${socCode} 只在 Table ${found[0].table}，该表只适用于 ${grantedBefore(found[0].table)} 前获批并连续持有 Skilled Worker 许可者；与所填的起始日 ${row.skilledWorkerFrom} 不符，请核对职业代码与许可记录。`
            : `SOC ${socCode} 不在 SW 24.3 row ${row.row} 适用的 ${tableNames} 中，无法确定 going rate。`,
        assumptions,
      };
    }
    if (rate.table === '2a') {
      assumptions.push(
        'Table 2a 还要求为同一 sponsor 工作（SW 6.1(f)），本工具未核对。',
      );
    }
    const which = `按 SW 24.3 row ${row.row} 查 Appendix Skilled Occupations Table ${rate.table}，SOC ${socCode}（${rate.title}）的 going rate 为 ${gbp(rate.goingRate)}`;
    return salary >= rate.goingRate
      ? {
          status: 'PASS',
          explanation: `${which}；当前年薪 ${gbp(salary)}，已达到。`,
          assumptions,
        }
      : {
          status: 'FAIL',
          explanation: `${which}；当前年薪 ${gbp(salary)}，低于 going rate。`,
          assumptions,
        };
  },
);

/**
 * The start of P's Skilled Worker period when P has a 5-year Skilled Worker
 * pathway in this column, so the dependant can settle at the same time as P
 * (SW 39.1(a)).
 */
function principalSkilledWorkerStart({
  simulationDate,
  principal,
}: RuleContext): IsoDate | undefined {
  if (!principal) return undefined;
  const start = skilledWorkerStart({
    timeline: principal.timeline,
    simulationDate,
  });
  return start &&
    principal.result.byRuleSet[RULE_SET]?.pathwayYears ===
      cl.values.skilledWorkerQualifyingYears.value
    ? start
    : undefined;
}

/** Why a dependant cannot settle with P under SW 39.1(a). */
function withoutPrincipalPathway(
  { simulationDate, principal }: RuleContext,
  who: string,
  assumptions: string[],
): Omit<RuleResult, 'sources'> {
  const principalOnSw = skilledWorkerStart({
    timeline: principal!.timeline,
    simulationDate,
  });
  if (!principalOnSw) {
    return {
      status: 'UNKNOWN',
      explanation:
        '主申请人当前不是 Skilled Worker 主申请人许可；若其已作为 Skilled Worker 定居（SW 39.1(b)），本工具未建模。',
      assumptions,
    };
  }
  return principal!.result.byRuleSet[RULE_SET]?.outcome ===
    'LIKELY_NOT_ELIGIBLE'
    ? {
        status: 'FAIL',
        explanation: `主申请人目前不能作为 Skilled Worker 定居，${who} 不能按 SW 39.1(a) 随其定居。`,
        assumptions,
      }
    : {
        status: 'UNKNOWN',
        explanation: '主申请人的信息不足以判断其能否作为 Skilled Worker 定居。',
        assumptions,
      };
}

/**
 * The start the dependent partner can apply 5 years after: their own
 * continuous dependant period (SW 42.1, SW 43.1), but not before P completes
 * the Skilled Worker period (SW 39.1(a)). Undefined unless P has a Skilled
 * Worker pathway.
 */
export function skilledWorkerPartnerStart(
  ctx: RuleContext,
): IsoDate | undefined {
  const { timeline, simulationDate } = ctx;
  const principalStart = principalSkilledWorkerStart(ctx);
  if (!principalStart || !onSkilledWorkerPartner(timeline, simulationDate)) {
    return undefined;
  }
  const { episodes } = continuousRun(
    timeline,
    simulationDate,
    isSkilledWorkerDependant,
  );
  const own = restartAfterAbsences(
    episodes[0].validFrom,
    simulationDate,
    timeline.absences,
    CR_3_1,
  );
  return own > principalStart ? own : principalStart;
}

export const clSwPartner5Y = defineRule(
  {
    id: 'CL-SW-PARTNER-5Y',
    ruleSetId: RULE_SET,
    title: 'Skilled Worker dependent partner 连续 5 年并与主申请人一同定居',
    sources: [
      { srcId: 'SRC-004', locator: 'SW 39.1' },
      { srcId: 'SRC-004', locator: 'SW 42.1' },
      { srcId: 'SRC-004', locator: 'SW 43.1' },
      { srcId: 'SRC-008', locator: 'CR 3.1' },
    ],
    pendingDetails: [],
  },
  (ctx) => {
    const { timeline, simulationDate, principal } = ctx;
    const years = cl.values.skilledWorkerQualifyingYears.value;
    if (!onSkilledWorkerPartner(timeline, simulationDate)) {
      return {
        status: 'FAIL',
        explanation: '当前不是 Skilled Worker 的 dependent partner 许可。',
      };
    }
    if (!principal) {
      return {
        status: 'UNKNOWN',
        explanation: '填写主申请人信息后可判断。',
      };
    }
    const assumptions = [
      `只计连续的 Skilled Worker dependant 许可，假设整段都是同一主申请人的 dependent partner；Appendix Relationship with Partner（SW 39.3）未核对。`,
      '主申请人已经定居的情形（SW 39.1(b)）未建模，只判断与主申请人同时获批（SW 39.1(a)）。',
      ...(timeline.absences.length > 0 ? [ABSENCE_ASSUMPTION] : []),
    ];
    const start = skilledWorkerPartnerStart(ctx);
    if (!start) {
      return withoutPrincipalPathway(ctx, 'dependent partner', assumptions);
    }
    return {
      status: 'PASS',
      explanation: `与主申请人一同定居：dependent partner 许可与主申请人的 Skilled Worker 期都满 ${years} 年后，${addYears(start, years)} 起可申请（SW 39.1(a)、SW 42.1）。`,
      assumptions,
    };
  },
);

/** The start P's 5 years run from; the child settles with P (SW 39.1(a)). */
export function skilledWorkerChildStart(ctx: RuleContext): IsoDate | undefined {
  return onSkilledWorkerChild(ctx.timeline, ctx.simulationDate)
    ? principalSkilledWorkerStart(ctx)
    : undefined;
}

export const clSwChild = defineRule(
  {
    id: 'CL-SW-CHILD',
    ruleSetId: RULE_SET,
    title: 'Skilled Worker dependent child 与主申请人一同定居',
    sources: [
      { srcId: 'SRC-004', locator: 'SW 39.1' },
      { srcId: 'SRC-004', locator: 'SW 41A.1' },
      { srcId: 'SRC-018', locator: 'CHI 1.1' },
      { srcId: 'SRC-018', locator: 'CHI 1.2' },
      { srcId: 'SRC-018', locator: 'CHI 1A.1' },
      { srcId: 'SRC-018', locator: 'CHI 2.1' },
    ],
    pendingDetails: [],
  },
  (ctx) => {
    const { timeline, simulationDate, principal } = ctx;
    if (!onSkilledWorkerChild(timeline, simulationDate)) {
      return {
        status: 'FAIL',
        explanation: '当前不是 Skilled Worker 的 dependent child 许可。',
      };
    }
    if (!principal) {
      return {
        status: 'UNKNOWN',
        explanation: '填写主申请人信息后可判断。',
      };
    }
    const minor =
      fullYears(timeline.dateOfBirth, simulationDate) <
      cl.values.settlementMinorAge.value;
    const assumptions = [
      '假设子女未 leading an independent life（CHI 1A.1）。',
      ...(minor ? ['假设子女有符合英国法律的照护与住宿安排（CHI 2.1）。'] : []),
      '只看申请日当天的 Skilled Worker dependent child 许可，假设是同一主申请人的子女；另一位家长须同时获批定居、已定居或为英国公民，除非主申请人负唯一抚养责任等（CHI 4.3，经 SW 39.4），本工具未核对。',
      '主申请人已经定居的情形（SW 39.1(b)）未建模，只判断与主申请人同时获批（SW 39.1(a)）。',
    ];
    const start = skilledWorkerChildStart(ctx);
    if (!start) {
      return withoutPrincipalPathway(ctx, 'dependent child', assumptions);
    }
    const age = minor
      ? `申请日未满 ${cl.values.settlementMinorAge.value} 岁（CHI 1.1）`
      : `申请日已满 ${cl.values.settlementMinorAge.value} 岁，但当前持有的是 dependent child 许可（CHI 1.2(a)）`;
    return {
      status: 'PASS',
      explanation: `${age}；随主申请人定居：主申请人的 Skilled Worker 期 ${addYears(start, cl.values.skilledWorkerQualifyingYears.value)} 满 ${cl.values.skilledWorkerQualifyingYears.value} 年，届时可一同申请（SW 39.1(a)、SW 41A.1）；子女本人没有居留年限要求。`,
      assumptions,
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
      { srcId: 'SRC-004', locator: 'SW 44.1' },
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
    // SW 44.1 covers a dependent partner and a dependent child.
    const partner =
      onSkilledWorkerPartner(timeline, simulationDate) ||
      onSkilledWorkerChild(timeline, simulationDate);
    const b2 =
      sw || partner
        ? cl.values.skilledWorkerSettlementEnglish.value
        : cl.values.longResidenceSettlementEnglish.value;
    const required =
      simulationDate >= b2.applicationsFrom
        ? b2.cefrLevel
        : sw
          ? undefined
          : partner
            ? cl.values.skilledWorkerDependantSettlementEnglishBefore.value
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
      { srcId: 'SRC-004', locator: 'SW 45.1' },
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
