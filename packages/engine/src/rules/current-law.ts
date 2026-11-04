import {
  currentLaw2026_11 as cl,
  goingRates,
  healthAndCareAsheOccupations,
  immigrationSalaryListOccupations,
  nationalPayScaleOccupations,
  routeNames,
} from '@uk-immigration/policy-data';
import { addYears, fullYears, fullYearsEn } from '../dates';
import {
  continuousRun,
  episodeOn,
  restartAfterAbsences,
  settledBy,
} from '../residence';
import { defineRule, nameIn, textFor } from '../rule';
import type { Lang } from '../rule';
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

// Current Immigration Rules, modelled for Skilled Worker settlement (SRC-004),
// Long Residence (SRC-005) and the main applicants of Hong Kong BN(O)
// (SRC-020).

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

/** Main applicant on `route` on `date`. */
const onMain = (timeline: PersonTimeline, date: IsoDate, route: Route) => {
  const current = episodeOn(timeline, date);
  return current?.route === route && current.role === 'MAIN';
};

export const onHongKongBno = (timeline: PersonTimeline, date: IsoDate) =>
  onMain(timeline, date, 'HONG_KONG_BNO');

// Routes modelled for main applicants only: their dependants are out of scope.
const MAIN_ONLY_ROUTES: Route[] = ['HONG_KONG_BNO'];

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
    titleEn: 'Within the scope of the modelled current rules',
    sources: [
      { srcId: 'SRC-004', locator: 'SW 21.1' },
      { srcId: 'SRC-004', locator: 'SW 39.1' },
      { srcId: 'SRC-004', locator: 'SW 41A.1' },
      { srcId: 'SRC-005', locator: 'LR 11.1' },
      { srcId: 'SRC-020', locator: 'HK 62.1' },
    ],
    pendingDetails: [],
  },
  (ctx) => {
    const { timeline, simulationDate } = ctx;
    const L = textFor(ctx);
    const rn = (r: Route) => nameIn(L, routeNames[r]);
    if (onHongKongBno(timeline, simulationDate)) {
      return {
        status: 'PASS',
        explanation: L(
          '当前持 Hong Kong BN(O) 主申请人许可（BN(O) Status Holder 或 BN(O) Adult Child），按 Appendix Hong Kong British National (Overseas) 与 Appendix Long Residence 评估。',
          'Currently holds Hong Kong BN(O) permission as the main applicant (BN(O) Status Holder or BN(O) Adult Child); assessed under Appendix Hong Kong British National (Overseas) and Appendix Long Residence.',
        ),
      };
    }
    if (onSkilledWorker(timeline, simulationDate)) {
      return {
        status: 'PASS',
        explanation: L(
          '当前持 Skilled Worker 主申请人许可，按 Appendix Skilled Worker 与 Appendix Long Residence 评估。',
          'Currently holds Skilled Worker permission as the main applicant; assessed under Appendix Skilled Worker and Appendix Long Residence.',
        ),
      };
    }
    const partner = onSkilledWorkerPartner(timeline, simulationDate);
    if (partner && ctx.principal) {
      return {
        status: 'PASS',
        explanation: L(
          '当前持 Skilled Worker 的 dependent partner 许可，按 Appendix Skilled Worker 的伴侣定居要求（SW 38–SW 46）与 Appendix Long Residence 评估。',
          'Currently holds Skilled Worker permission as a dependent partner; assessed under the partner settlement requirements of Appendix Skilled Worker (SW 38–SW 46) and Appendix Long Residence.',
        ),
      };
    }
    const child = onSkilledWorkerChild(timeline, simulationDate);
    if (child && ctx.principal) {
      return {
        status: 'PASS',
        explanation: L(
          '当前持 Skilled Worker 的 dependent child 许可，按 Appendix Skilled Worker 的子女定居要求（SW 38–SW 46、Appendix Children）与 Appendix Long Residence 评估。',
          'Currently holds Skilled Worker permission as a dependent child; assessed under the child settlement requirements of Appendix Skilled Worker (SW 38–SW 46, Appendix Children) and Appendix Long Residence.',
        ),
      };
    }
    if (longResidenceMet(ctx)) {
      return {
        status: 'PASS',
        explanation: L(
          '已满 10 年连续合法居留，按 Appendix Long Residence 评估。',
          '10 years of continuous lawful residence completed; assessed under Appendix Long Residence.',
        ),
      };
    }
    const current = episodeOn(timeline, simulationDate);
    if (
      current?.role === 'DEPENDANT' &&
      MAIN_ONLY_ROUTES.includes(current.route)
    ) {
      return {
        status: 'UNKNOWN',
        explanation: L(
          `当前持${rn(current.route)}的 dependant 许可；现行法律栏只建模该路线的主申请人，dependant 的定居条件无法判断。`,
          `Currently holds ${rn(current.route)} permission as a dependant; the current rules are modelled only for the main applicants of this route, so a dependant’s settlement requirements cannot be assessed.`,
        ),
      };
    }
    const explanation =
      current && isSkilledWorkerDependant(current)
        ? partner || child
          ? L(
              `当前持 Skilled Worker 的 dependent ${partner ? 'partner' : 'child'} 许可；填写主申请人信息后可按 SW 38–SW 46 判断。`,
              `Currently holds Skilled Worker permission as a dependent ${partner ? 'partner' : 'child'}; this can be assessed under SW 38–SW 46 once the principal applicant’s details are provided.`,
            )
          : L(
              '当前持 Skilled Worker 的 dependant 许可，未填写是作为主申请人的伴侣还是子女随行。',
              'Currently holds Skilled Worker permission as a dependant; not provided whether this is as the principal applicant’s partner or child.',
            )
        : L(
            '现行规则只建模了 Skilled Worker（主申请人及其 dependent partner / child）、Hong Kong BN(O) 主申请人与 Long Residence；当前路线不在其中，也不满足 Long Residence 的 10 年，无法判断其他路线的定居条件。',
            'The current rules are modelled only for Skilled Worker (main applicants and their dependent partners / children), Hong Kong BN(O) main applicants and Long Residence; the current route is none of these, and the 10 years for Long Residence are not met, so the settlement requirements of other routes cannot be assessed.',
          );
    return { status: 'UNKNOWN', explanation };
  },
);

export const CR_3_1 = {
  maxDays: cl.values.continuousResidenceMaxAbsenceDays.value,
  windowMonths: cl.values.continuousResidenceWindowMonths.value,
};

const absenceAssumption = (L: Lang) =>
  L(
    `缺席按 Appendix Continuous Residence CR 3.1 计算，出境与入境当日都计入缺席；CR 3.4 的可豁免缺席理由未建模。`,
    'Absences are counted under Appendix Continuous Residence CR 3.1, with the days of departure and return both counted as absence; the permitted reasons for absence in CR 3.4 are not modelled.',
  );

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
    titleEn: `${cl.values.skilledWorkerQualifyingYears.value} continuous years as a Skilled Worker`,
    sources: [
      { srcId: 'SRC-004', locator: 'SW 21.1' },
      { srcId: 'SRC-004', locator: 'SW 21.2' },
      { srcId: 'SRC-004', locator: 'SW 22.1' },
      { srcId: 'SRC-008', locator: 'CR 3.1' },
    ],
    pendingDetails: [],
  },
  (ctx) => {
    const L = textFor(ctx);
    const years = cl.values.skilledWorkerQualifyingYears.value;
    const start = skilledWorkerStart(ctx);
    const assumptions = [
      L(
        '连续期合并 SW 21.2 列出的 Skilled Worker、Global Talent、Innovator Founder、T2 Minister of Religion、International Sportsperson、Scale-up 主申请人许可；Representative of an Overseas Business 与 Tier 1 本工具无法填写，不计入；SW 21.2(i) 的等待决定期间未建模。',
        'The continuous period combines main applicant permission on the routes listed in SW 21.2: Skilled Worker, Global Talent, Innovator Founder, T2 Minister of Religion, International Sportsperson and Scale-up. Representative of an Overseas Business and Tier 1 cannot be entered in this tool and are not counted; time awaiting a decision under SW 21.2(i) is not modelled.',
      ),
      ...(ctx.timeline.absences.length > 0 ? [absenceAssumption(L)] : []),
    ];
    if (!start) {
      return {
        status: 'FAIL',
        explanation: L(
          '当前不是 Skilled Worker 主申请人许可。',
          'Current permission is not as a Skilled Worker main applicant.',
        ),
        assumptions,
      };
    }
    const due = addYears(start, years);
    return due <= ctx.simulationDate
      ? {
          status: 'PASS',
          explanation: L(
            `自 ${start} 起连续持可计入 Skilled Worker 定居的许可（SW 21.2），已满 ${years} 年。`,
            `Continuous permission counting towards Skilled Worker settlement (SW 21.2) since ${start}: ${years} years completed.`,
          ),
          assumptions,
        }
      : {
          status: 'FAIL',
          explanation: L(
            `自 ${start} 起连续持可计入 Skilled Worker 定居的许可（SW 21.2），截至 ${ctx.simulationDate} 满 ${fullYears(start, ctx.simulationDate)} 年；${due} 满 ${years} 年。`,
            `Continuous permission counting towards Skilled Worker settlement (SW 21.2) since ${start}: ${fullYearsEn(start, ctx.simulationDate)} by ${ctx.simulationDate}; ${years} years are completed on ${due}.`,
          ),
          assumptions,
        };
  },
);

/**
 * Start of the continuous Hong Kong BN(O) permission (any role) ending on the
 * simulation date, while a main applicant on that route (HK 62.1, HK 63.1).
 * Only BN(O) time is counted (PD-069); `before` is the adjoining earlier
 * permission on another route, if any.
 */
export function hongKongBnoStart({
  timeline,
  simulationDate,
}: RuleContext): { start: IsoDate; before?: ImmigrationEpisode } | undefined {
  if (!onHongKongBno(timeline, simulationDate)) return undefined;
  const { episodes, stoppedAt } = continuousRun(
    timeline,
    simulationDate,
    (e) => e.route === 'HONG_KONG_BNO',
  );
  return {
    start: restartAfterAbsences(
      episodes[0].validFrom,
      simulationDate,
      timeline.absences,
      CR_3_1,
    ),
    before: stoppedAt,
  };
}

export const clHkbnoResidence5Y = defineRule(
  {
    id: 'CL-HKBNO-RESIDENCE-5Y',
    ruleSetId: RULE_SET,
    title: 'Hong Kong BN(O) 连续 5 年',
    titleEn: `${cl.values.hongKongBnoQualifyingYears.value} continuous years on the Hong Kong BN(O) route`,
    sources: [
      { srcId: 'SRC-020', locator: 'HK 62.1' },
      { srcId: 'SRC-020', locator: 'HK 63.1' },
      { srcId: 'SRC-008', locator: 'CR 3.1' },
    ],
    pendingDetails: ['PD-069'],
  },
  (ctx) => {
    const L = textFor(ctx);
    const years = cl.values.hongKongBnoQualifyingYears.value;
    const run = hongKongBnoStart(ctx);
    if (!run) {
      return {
        status: 'FAIL',
        explanation: L(
          '当前不是 Hong Kong BN(O) 主申请人许可。',
          'Current permission is not as a Hong Kong BN(O) main applicant.',
        ),
      };
    }
    const { start, before } = run;
    const assumptions = [
      ...(before
        ? [
            L(
              `HK 62.1(b) 也计入其他可定居路线（a route under which a person can settle）的许可；本工具只计 Hong Kong BN(O) 段，紧接其前的${nameIn(L, routeNames[before.route])}许可未计入，若该路线可定居，实际日期可能更早（PD-069）。`,
              `HK 62.1(b) also counts permission on any other route under which a person can settle; this tool counts only the Hong Kong BN(O) period, so the ${nameIn(L, routeNames[before.route])} permission just before it is not counted, and the actual date may be earlier if that route can lead to settlement (PD-069).`,
            ),
          ]
        : []),
      ...(ctx.timeline.absences.length > 0 ? [absenceAssumption(L)] : []),
    ];
    const due = addYears(start, years);
    return due <= ctx.simulationDate
      ? {
          status: 'PASS',
          explanation: L(
            `自 ${start} 起连续持 Hong Kong BN(O) 许可，已满 ${years} 年（HK 62.1(b)）。`,
            `Continuous Hong Kong BN(O) permission since ${start}: ${years} years completed (HK 62.1(b)).`,
          ),
          assumptions,
        }
      : {
          status: 'FAIL',
          explanation: L(
            `自 ${start} 起连续持 Hong Kong BN(O) 许可，截至 ${ctx.simulationDate} 满 ${fullYears(start, ctx.simulationDate)} 年；${due} 满 ${years} 年（HK 62.1(b)）。`,
            `Continuous Hong Kong BN(O) permission since ${start}: ${fullYearsEn(start, ctx.simulationDate)} by ${ctx.simulationDate}; ${years} years are completed on ${due} (HK 62.1(b)).`,
          ),
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
  locale,
}: RuleContext): SalaryRow | undefined {
  const L = textFor({ locale });
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
  // Declared answer first; otherwise derived from the SOC code (SRC-019).
  const islDerived =
    current.immigrationSalaryList === undefined &&
    inTable(immigrationSalaryListOccupations.entries, soc);
  const isl = current.immigrationSalaryList ?? islDerived;
  const pre2024Reason = L(
    `自 ${skilledWorkerFrom} 起连续持 Skilled Worker 许可，早于 ${v.skilledWorkerPre2024RulesBefore.value}，且申请日早于 ${v.skilledWorkerPre2024ApplicationsBefore.value}（SW 4.2(b)(ii)）`,
    `continuous Skilled Worker permission since ${skilledWorkerFrom}, before ${v.skilledWorkerPre2024RulesBefore.value}, with the application before ${v.skilledWorkerPre2024ApplicationsBefore.value} (SW 4.2(b)(ii))`,
  );
  const asheReason = L(
    `SOC ${soc} 属 Health and Care ASHE salary job（SW A1.1）`,
    `SOC ${soc} is a Health and Care ASHE salary job (SW A1.1)`,
  );
  const b42Reason = pre2024 ? pre2024Reason : asheReason;
  const assumptions = [
    L(
      'SW 24.3 row E（5 年期含 Tier 2 (General) 下的 STEM 类 SOC 2010 职业）未建模。',
      'SW 24.3 row E (a 5-year period including STEM occupations under SOC 2010 on Tier 2 (General)) is not modelled.',
    ),
    ...(islDerived
      ? [
          L(
            `未申报是否在 Immigration Salary List 上；SOC ${soc} 在清单职业表中，按职业代码推导为在清单上。清单对岗位 / 地区的限制（criteria）未核对，可在问卷里申报覆盖。`,
            `Not declared whether the job is on the Immigration Salary List; SOC ${soc} is in the list’s occupation table, so the job is derived to be on the list from its occupation code. The list’s job / region restrictions (criteria) are not checked; a declaration in the questionnaire overrides this.`,
          ),
        ]
      : current.immigrationSalaryList === undefined
        ? [
            L(
              '未申报是否在 Immigration Salary List 上，按不在清单处理。',
              'Not declared whether the job is on the Immigration Salary List; treated as not on the list.',
            ),
          ]
        : []),
    ...(ashe && !pre2024
      ? [
          L(
            `SOC ${soc} 在 SW A1.1 的 Health and Care ASHE salary job 职业列表内，假设雇主属 SW A1.1(a)–(f) 列出的类型。`,
            `SOC ${soc} is on the Health and Care ASHE salary job list in SW A1.1; the employer is assumed to be of a type listed in SW A1.1(a)–(f).`,
          ),
        ]
      : []),
    ...(pre2024
      ? [
          L(
            `"${v.skilledWorkerPre2024RulesBefore.value} 前按当时规则获批"按连续 Skilled Worker 许可的起始日判断（SW 4.2(b)(ii)）。`,
            `“Granted under the rules in place before ${v.skilledWorkerPre2024RulesBefore.value}” is judged by the start of the continuous Skilled Worker permission (SW 4.2(b)(ii)).`,
          ),
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
      reason: L(
        `SOC ${soc} 是 Appendix Skilled Occupations Table 3 的医疗 / 教育职业`,
        `SOC ${soc} is a health / education occupation in Appendix Skilled Occupations Table 3`,
      ),
    };
  }
  if (isl && (pre2024 || ashe)) {
    return {
      ...base,
      socMissing: false,
      row: 'D',
      threshold: v.skilledWorkerSettlementSalaryRowD.value,
      reason: L(
        `岗位在 Immigration Salary List 上，且${b42Reason}`,
        `the job is on the Immigration Salary List, and ${b42Reason}`,
      ),
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
      reason: L(
        '岗位在 Immigration Salary List 上',
        'the job is on the Immigration Salary List',
      ),
    };
  }
  return {
    ...base,
    row: 'A',
    threshold: v.skilledWorkerGeneralSalaryThreshold.value,
    reason: L('不适用 rows B–E', 'rows B–E do not apply'),
  };
}

export const clSwSalary = defineRule(
  {
    id: 'CL-SW-SALARY',
    ruleSetId: RULE_SET,
    title: 'Skilled Worker 定居薪资（general salary）',
    titleEn: 'Skilled Worker settlement salary (general salary)',
    sources: [
      { srcId: 'SRC-004', locator: 'SW 24.3' },
      { srcId: 'SRC-004', locator: 'SW 4.2(b)' },
      { srcId: 'SRC-004', locator: 'SW A1.1' },
      { srcId: 'SRC-017', locator: 'Table 3' },
      immigrationSalaryListOccupations.source,
    ],
    pendingDetails: [],
  },
  (ctx) => {
    const L = textFor(ctx);
    const row = settlementSalaryRow(ctx);
    if (!row) {
      return {
        status: 'FAIL',
        explanation: L(
          '当前不是 Skilled Worker 主申请人许可。',
          'Current permission is not as a Skilled Worker main applicant.',
        ),
      };
    }
    const salary = episodeOn(ctx.timeline, ctx.simulationDate)!.salary;
    const { assumptions } = row;
    if (salary === undefined) {
      return {
        status: 'UNKNOWN',
        explanation: L(
          '未填写当前 Skilled Worker 工作的年薪。',
          'Salary for the current Skilled Worker job not provided.',
        ),
        assumptions,
      };
    }
    const which = L(
      `按 SW 24.3 row ${row.row}（${row.reason}），general salary 门槛 ${gbp(row.threshold)}`,
      `Under SW 24.3 row ${row.row} (${row.reason}), the general salary threshold is ${gbp(row.threshold)}`,
    );
    if (salary >= row.threshold) {
      return {
        status: 'PASS',
        explanation: L(
          `${which}；当前年薪 ${gbp(salary)}，已达到。`,
          `${which}; the current salary of ${gbp(salary)} meets it.`,
        ),
        assumptions,
      };
    }
    return row.socMissing
      ? {
          status: 'UNKNOWN',
          explanation: L(
            `${which}；当前年薪 ${gbp(salary)} 低于此门槛。未填写 SOC 职业代码，若属 Table 3 医疗 / 教育职业或 Health and Care ASHE salary job，适用更低的 row C / D。`,
            `${which}; the current salary of ${gbp(salary)} is below it. SOC code not provided: if the job is a Table 3 health / education occupation or a Health and Care ASHE salary job, the lower rows C / D apply.`,
          ),
          assumptions,
        }
      : {
          status: 'FAIL',
          explanation: L(
            `${which}；当前年薪 ${gbp(salary)}，低于此门槛。`,
            `${which}; the current salary of ${gbp(salary)} is below it.`,
          ),
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
    titleEn: 'Skilled Worker settlement salary (going rate)',
    sources: [
      { srcId: 'SRC-004', locator: 'SW 24.3' },
      { srcId: 'SRC-004', locator: 'SW 6.1' },
      { srcId: 'SRC-004', locator: 'SW 14.4' },
      goingRates.source,
      immigrationSalaryListOccupations.source,
    ],
    pendingDetails: [],
  },
  (ctx) => {
    const L = textFor(ctx);
    const row = settlementSalaryRow(ctx);
    if (!row) {
      return {
        status: 'FAIL',
        explanation: L(
          '当前不是 Skilled Worker 主申请人许可。',
          'Current permission is not as a Skilled Worker main applicant.',
        ),
      };
    }
    const { socCode, salary } = episodeOn(ctx.timeline, ctx.simulationDate)!;
    const assumptions = [
      L(
        'going rate 按每周 37.5 小时的全额年薪比较，未按实际工时折算（SW 14.4）。',
        'The going rate is compared as the full annual salary for a 37.5-hour week, not pro-rated for actual hours (SW 14.4).',
      ),
    ];
    if (socCode === undefined) {
      return {
        status: 'UNKNOWN',
        explanation: L(
          '未填写当前 Skilled Worker 工作的 SOC 2020 职业代码，无法查 going rate。',
          'SOC 2020 code for the current Skilled Worker job not provided, so the going rate cannot be looked up.',
        ),
        assumptions,
      };
    }
    if (row.row === 'D' && inTable(nationalPayScaleOccupations.rows, socCode)) {
      return {
        status: 'UNKNOWN',
        explanation: L(
          `SOC ${socCode} 是 Table 3 医疗 / 教育职业，going rate 按国家薪级（Appendix Skilled Occupations Table 3–5）确定；Table 4 / 5 的薪级本工具未提取，无法核对。`,
          `SOC ${socCode} is a Table 3 health / education occupation, whose going rate is set by national pay scales (Appendix Skilled Occupations Tables 3–5); this tool has not extracted the pay scales in Tables 4 / 5, so it cannot check them.`,
        ),
        assumptions,
      };
    }
    if (salary === undefined) {
      return {
        status: 'UNKNOWN',
        explanation: L(
          '未填写当前 Skilled Worker 工作的年薪。',
          'Salary for the current Skilled Worker job not provided.',
        ),
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
            ? L(
                `SOC ${socCode} 只在 Table ${found[0].table}，该表只适用于 ${grantedBefore(found[0].table)} 前获批并连续持有 Skilled Worker 许可者；与所填的起始日 ${row.skilledWorkerFrom} 不符，请核对职业代码与许可记录。`,
                `SOC ${socCode} is only in Table ${found[0].table}, which applies only to people granted Skilled Worker permission before ${grantedBefore(found[0].table)} who have held it continuously since; this does not match the start date entered, ${row.skilledWorkerFrom}. Please check the occupation code and permission history.`,
              )
            : L(
                `SOC ${socCode} 不在 SW 24.3 row ${row.row} 适用的 ${tableNames} 中，无法确定 going rate。`,
                `SOC ${socCode} is not in ${tableNames}, which apply to SW 24.3 row ${row.row}, so the going rate cannot be determined.`,
              ),
        assumptions,
      };
    }
    if (rate.table === '2a') {
      assumptions.push(
        L(
          'Table 2a 还要求为同一 sponsor 工作（SW 6.1(f)），本工具未核对。',
          'Table 2a also requires working for the same sponsor (SW 6.1(f)); this tool does not check this.',
        ),
      );
    }
    const which = L(
      `按 SW 24.3 row ${row.row} 查 Appendix Skilled Occupations Table ${rate.table}，SOC ${socCode}（${rate.title}）的 going rate 为 ${gbp(rate.goingRate)}`,
      `Under SW 24.3 row ${row.row}, Appendix Skilled Occupations Table ${rate.table} gives a going rate of ${gbp(rate.goingRate)} for SOC ${socCode} (${rate.title})`,
    );
    return salary >= rate.goingRate
      ? {
          status: 'PASS',
          explanation: L(
            `${which}；当前年薪 ${gbp(salary)}，已达到。`,
            `${which}; the current salary of ${gbp(salary)} meets it.`,
          ),
          assumptions,
        }
      : {
          status: 'FAIL',
          explanation: L(
            `${which}；当前年薪 ${gbp(salary)}，低于 going rate。`,
            `${which}; the current salary of ${gbp(salary)} is below the going rate.`,
          ),
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

/**
 * SW 39.1(b): P has settled. Met when P settled from Skilled Worker
 * permission and the dependant then held permission as P's partner or child
 * (SW 39.1(b)(ii), born in the UK before P settled, is not modelled).
 */
function settledPrincipal(
  ctx: RuleContext,
): { met: boolean; date: IsoDate; explanation: string } | undefined {
  const settled =
    ctx.principal && settledBy(ctx.principal.timeline, ctx.simulationDate);
  if (!settled) return undefined;
  const L = textFor(ctx);
  const now = episodeOn(ctx.timeline, ctx.simulationDate)!;
  const who = now.dependantOf === 'PARTNER' ? 'partner' : 'child';
  if (settled.route !== 'SKILLED_WORKER') {
    return {
      met: false,
      date: settled.date,
      explanation: L(
        `主申请人 ${settled.date} 定居时持有的不是 Skilled Worker 许可，不能按 SW 39.1(b) 作为其 Skilled Worker dependant 定居。`,
        `The principal applicant did not hold Skilled Worker permission when they settled on ${settled.date}, so settlement as their Skilled Worker dependant under SW 39.1(b) is not possible.`,
      ),
    };
  }
  const then = episodeOn(ctx.timeline, settled.date);
  return then &&
    isSkilledWorkerDependant(then) &&
    then.dependantOf === now.dependantOf
    ? {
        met: true,
        date: settled.date,
        explanation: L(
          `主申请人已于 ${settled.date} 作为 Skilled Worker 定居，当时本人持有其 dependent ${who} 许可（SW 39.1(b)）`,
          `The principal applicant settled as a Skilled Worker on ${settled.date}, when this person held permission as their dependent ${who} (SW 39.1(b))`,
        ),
      }
    : {
        met: false,
        date: settled.date,
        explanation: L(
          `主申请人 ${settled.date} 作为 Skilled Worker 定居时，本人未持有其 Skilled Worker dependent ${who} 许可，不能按 SW 39.1(b) 定居。`,
          `When the principal applicant settled as a Skilled Worker on ${settled.date}, this person did not hold permission as their Skilled Worker dependent ${who}, so settlement under SW 39.1(b) is not possible.`,
        ),
      };
}

const settledPrincipalAssumption = (L: Lang) =>
  L(
    '主申请人尚未定居时，只判断与主申请人同时获批（SW 39.1(a)）；若其已定居，须在主申请人信息里填写定居日期与路线（SW 39.1(b)）。',
    'While the principal applicant has not settled, only being granted at the same time as them is assessed (SW 39.1(a)); if they have already settled, enter their settlement date and route in the principal applicant’s details (SW 39.1(b)).',
  );

/** Why a dependant cannot settle with P under SW 39.1(a). */
function withoutPrincipalPathway(
  { simulationDate, principal, locale }: RuleContext,
  who: string,
  assumptions: string[],
): Omit<RuleResult, 'sources'> {
  const L = textFor({ locale });
  const principalOnSw = skilledWorkerStart({
    timeline: principal!.timeline,
    simulationDate,
  });
  if (!principalOnSw) {
    return {
      status: 'UNKNOWN',
      explanation: L(
        '主申请人当前不是 Skilled Worker 主申请人许可；若其已作为 Skilled Worker 定居，请填写主申请人的定居日期与路线（SW 39.1(b)）。',
        'The principal applicant does not currently hold Skilled Worker permission as a main applicant; if they have already settled as a Skilled Worker, enter their settlement date and route (SW 39.1(b)).',
      ),
      assumptions,
    };
  }
  return principal!.result.byRuleSet[RULE_SET]?.outcome ===
    'LIKELY_NOT_ELIGIBLE'
    ? {
        status: 'FAIL',
        explanation: L(
          `主申请人目前不能作为 Skilled Worker 定居，${who} 不能按 SW 39.1(a) 随其定居。`,
          `The principal applicant cannot currently settle as a Skilled Worker, so the ${who} cannot settle with them under SW 39.1(a).`,
        ),
        assumptions,
      }
    : {
        status: 'UNKNOWN',
        explanation: L(
          '主申请人的信息不足以判断其能否作为 Skilled Worker 定居。',
          'The principal applicant’s details are not enough to determine whether they can settle as a Skilled Worker.',
        ),
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
  if (!ctx.principal || !onSkilledWorkerPartner(timeline, simulationDate)) {
    return undefined;
  }
  const settled = settledPrincipal(ctx);
  // P already settled: only the partner's own 5 years remain (SW 42.1).
  const principalStart = settled ? undefined : principalSkilledWorkerStart(ctx);
  if (settled ? !settled.met : !principalStart) return undefined;
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
  return principalStart && principalStart > own ? principalStart : own;
}

export const clSwPartner5Y = defineRule(
  {
    id: 'CL-SW-PARTNER-5Y',
    ruleSetId: RULE_SET,
    title: 'Skilled Worker dependent partner 连续 5 年并与主申请人一同定居',
    titleEn: `${cl.values.skilledWorkerQualifyingYears.value} continuous years as a Skilled Worker dependent partner, settling with the principal applicant`,
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
    const L = textFor(ctx);
    const years = cl.values.skilledWorkerQualifyingYears.value;
    if (!onSkilledWorkerPartner(timeline, simulationDate)) {
      return {
        status: 'FAIL',
        explanation: L(
          '当前不是 Skilled Worker 的 dependent partner 许可。',
          'Current permission is not as a Skilled Worker dependent partner.',
        ),
      };
    }
    if (!principal) {
      return {
        status: 'UNKNOWN',
        explanation: L(
          '填写主申请人信息后可判断。',
          'This can be assessed once the principal applicant’s details are provided.',
        ),
      };
    }
    const settled = settledPrincipal(ctx);
    const assumptions = [
      L(
        `只计连续的 Skilled Worker dependant 许可，假设整段都是同一主申请人的 dependent partner；Appendix Relationship with Partner（SW 39.3）未核对。`,
        'Only continuous Skilled Worker dependant permission is counted, assuming all of it was as the same principal applicant’s dependent partner; Appendix Relationship with Partner (SW 39.3) is not checked.',
      ),
      ...(settled ? [] : [settledPrincipalAssumption(L)]),
      ...(timeline.absences.length > 0 ? [absenceAssumption(L)] : []),
    ];
    const start = skilledWorkerPartnerStart(ctx);
    if (settled) {
      return settled.met
        ? {
            status: 'PASS',
            explanation: L(
              `${settled.explanation}；本人的 dependent partner 许可满 ${years} 年后，${addYears(start!, years)} 起可申请（SW 42.1）。`,
              `${settled.explanation}; they can apply from ${addYears(start!, years)}, once their own dependent partner permission reaches ${years} years (SW 42.1).`,
            ),
            assumptions,
          }
        : { status: 'FAIL', explanation: settled.explanation, assumptions };
    }
    if (!start) {
      return withoutPrincipalPathway(ctx, 'dependent partner', assumptions);
    }
    return {
      status: 'PASS',
      explanation: L(
        `与主申请人一同定居：dependent partner 许可与主申请人的 Skilled Worker 期都满 ${years} 年后，${addYears(start, years)} 起可申请（SW 39.1(a)、SW 42.1）。`,
        `Settling with the principal applicant: they can apply from ${addYears(start, years)}, once both the dependent partner permission and the principal applicant’s Skilled Worker period reach ${years} years (SW 39.1(a), SW 42.1).`,
      ),
      assumptions,
    };
  },
);

/** The start P's 5 years run from; the child settles with P (SW 39.1(a)). */
export function skilledWorkerChildStart(ctx: RuleContext): IsoDate | undefined {
  if (
    !ctx.principal ||
    !onSkilledWorkerChild(ctx.timeline, ctx.simulationDate)
  ) {
    return undefined;
  }
  const settled = settledPrincipal(ctx);
  if (!settled) return principalSkilledWorkerStart(ctx);
  // P already settled: the child can apply now, so the start is put a full
  // period before P's settlement date.
  return settled.met
    ? addYears(settled.date, -cl.values.skilledWorkerQualifyingYears.value)
    : undefined;
}

export const clSwChild = defineRule(
  {
    id: 'CL-SW-CHILD',
    ruleSetId: RULE_SET,
    title: 'Skilled Worker dependent child 与主申请人一同定居',
    titleEn:
      'Skilled Worker dependent child settling with the principal applicant',
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
    const L = textFor(ctx);
    if (!onSkilledWorkerChild(timeline, simulationDate)) {
      return {
        status: 'FAIL',
        explanation: L(
          '当前不是 Skilled Worker 的 dependent child 许可。',
          'Current permission is not as a Skilled Worker dependent child.',
        ),
      };
    }
    if (!principal) {
      return {
        status: 'UNKNOWN',
        explanation: L(
          '填写主申请人信息后可判断。',
          'This can be assessed once the principal applicant’s details are provided.',
        ),
      };
    }
    const settled = settledPrincipal(ctx);
    const minor =
      fullYears(timeline.dateOfBirth, simulationDate) <
      cl.values.settlementMinorAge.value;
    const assumptions = [
      L(
        '假设子女未 leading an independent life（CHI 1A.1）。',
        'The child is assumed not to be leading an independent life (CHI 1A.1).',
      ),
      ...(minor
        ? [
            L(
              '假设子女有符合英国法律的照护与住宿安排（CHI 2.1）。',
              'The child is assumed to have care and accommodation arrangements that comply with UK law (CHI 2.1).',
            ),
          ]
        : []),
      L(
        '只看申请日当天的 Skilled Worker dependent child 许可，假设是同一主申请人的子女；另一位家长须同时获批定居、已定居或为英国公民，除非主申请人负唯一抚养责任等（CHI 4.3，经 SW 39.4），本工具未核对。',
        'Only the Skilled Worker dependent child permission on the date of application is checked, assuming the child is the same principal applicant’s; the other parent must be granted settlement at the same time, already be settled or be a British citizen, unless the principal applicant has sole responsibility or similar (CHI 4.3, via SW 39.4); this tool does not check this.',
      ),
      settled
        ? L(
            '在英国出生、主申请人定居前出生的子女（SW 39.1(b)(ii)）未建模。',
            'Children born in the UK before the principal applicant settled (SW 39.1(b)(ii)) are not modelled.',
          )
        : settledPrincipalAssumption(L),
    ];
    const age = minor
      ? L(
          `申请日未满 ${cl.values.settlementMinorAge.value} 岁（CHI 1.1）`,
          `Under ${cl.values.settlementMinorAge.value} on the date of application (CHI 1.1)`,
        )
      : L(
          `申请日已满 ${cl.values.settlementMinorAge.value} 岁，但当前持有的是 dependent child 许可（CHI 1.2(a)）`,
          `Aged ${cl.values.settlementMinorAge.value} or over on the date of application, but currently holding dependent child permission (CHI 1.2(a))`,
        );
    if (settled) {
      return settled.met
        ? {
            status: 'PASS',
            explanation: L(
              `${age}；${settled.explanation}，可申请定居。`,
              `${age}; ${settled.explanation}, so they can apply for settlement.`,
            ),
            assumptions,
          }
        : { status: 'FAIL', explanation: settled.explanation, assumptions };
    }
    const start = skilledWorkerChildStart(ctx);
    if (!start) {
      return withoutPrincipalPathway(ctx, 'dependent child', assumptions);
    }
    return {
      status: 'PASS',
      explanation: L(
        `${age}；随主申请人定居：主申请人的 Skilled Worker 期 ${addYears(start, cl.values.skilledWorkerQualifyingYears.value)} 满 ${cl.values.skilledWorkerQualifyingYears.value} 年，届时可一同申请（SW 39.1(a)、SW 41A.1）；子女本人没有居留年限要求。`,
        `${age}; settling with the principal applicant: the principal applicant’s Skilled Worker period reaches ${cl.values.skilledWorkerQualifyingYears.value} years on ${addYears(start, cl.values.skilledWorkerQualifyingYears.value)}, when they can apply together (SW 39.1(a), SW 41A.1); the child has no residence requirement of their own.`,
      ),
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
    titleEn: 'Settlement English requirement',
    sources: [
      { srcId: 'SRC-004', locator: 'SW 22A.1' },
      { srcId: 'SRC-004', locator: 'SW 44.1' },
      { srcId: 'SRC-007', locator: 'p24' },
      { srcId: 'SRC-005', locator: 'LR 13.1' },
      { srcId: 'SRC-020', locator: 'HK 60.1' },
      { srcId: 'SRC-007', locator: 'EM 5.60' },
      { srcId: 'SRC-014', locator: 'EL 1.1' },
    ],
    pendingDetails: [],
  },
  ({ timeline, simulationDate, locale }) => {
    const L = textFor({ locale });
    if (ageExempt(timeline, simulationDate)) {
      return {
        status: 'PASS',
        explanation: L(
          `申请日未满 ${cl.values.settlementMinorAge.value} 岁或已满 ${cl.values.settlementExemptionAge.value} 岁，豁免英语要求。`,
          `Under ${cl.values.settlementMinorAge.value} or aged ${cl.values.settlementExemptionAge.value} or over on the date of application: exempt from the English requirement.`,
        ),
      };
    }
    const hk = onHongKongBno(timeline, simulationDate);
    // Which paragraph sets the level, for the new routes' explanations.
    const basis = hk
      ? L(
          '（Appendix Hong Kong BN(O) HK 60.1；HC 1691 的 B2 未覆盖该 Appendix，EM 5.60）',
          ' (Appendix Hong Kong BN(O) HK 60.1; the B2 introduced by HC 1691 does not cover this Appendix, EM 5.60)',
        )
      : '';
    const sw = onSkilledWorker(timeline, simulationDate);
    // SW 44.1 covers a dependent partner and a dependent child.
    const partner =
      onSkilledWorkerPartner(timeline, simulationDate) ||
      onSkilledWorkerChild(timeline, simulationDate);
    const b2 =
      sw || partner
        ? cl.values.skilledWorkerSettlementEnglish.value
        : cl.values.longResidenceSettlementEnglish.value;
    const required = hk
      ? cl.values.hongKongBnoSettlementEnglish.value
      : simulationDate >= b2.applicationsFrom
        ? b2.cefrLevel
        : sw
          ? undefined
          : partner
            ? cl.values.skilledWorkerDependantSettlementEnglishBefore.value
            : cl.values.longResidenceSettlementEnglishBefore.value;
    if (!required) {
      return {
        status: 'PASS',
        explanation: L(
          `申请日早于 ${b2.applicationsFrom}，Appendix Skilled Worker 未对定居另设英语要求（SW 22A.1 的 ${b2.cefrLevel} 只适用于此后的申请）。`,
          `The application date is before ${b2.applicationsFrom}, and Appendix Skilled Worker sets no separate English requirement for settlement (the ${b2.cefrLevel} in SW 22A.1 applies only to later applications).`,
        ),
      };
    }
    const english = timeline.english;
    if (!english) {
      return {
        status: 'UNKNOWN',
        explanation: L(
          `未填写英语水平；定居要求 CEFR ${required}${basis}。`,
          `English level not provided; settlement requires CEFR ${required}${basis}.`,
        ),
      };
    }
    if ('exempt' in english) {
      return {
        status: 'PASS',
        explanation: L(
          '申报因身心状况豁免英语要求。',
          'Exempt from the English requirement because of a physical or mental condition, as declared.',
        ),
        assumptions: [
          L(
            '身心状况豁免按用户申报，未核实认定标准。',
            'The physical or mental condition exemption is taken as declared; the criteria are not checked.',
          ),
        ],
      };
    }
    return meetsCefr(english.cefrLevel, required)
      ? {
          status: 'PASS',
          explanation: L(
            `英语 ${english.cefrLevel}，达到定居要求的 ${required}${basis}。`,
            `English at ${english.cefrLevel}, which meets the ${required} required for settlement${basis}.`,
          ),
        }
      : {
          status: 'FAIL',
          explanation: L(
            `英语 ${english.cefrLevel}，低于定居要求的 ${required}${hk ? basis : required === b2.cefrLevel ? `（${b2.applicationsFrom} 起的申请）` : ''}。`,
            `English at ${english.cefrLevel}, below the ${required} required for settlement${hk ? basis : required === b2.cefrLevel ? ` (applications from ${b2.applicationsFrom})` : ''}.`,
          ),
        };
  },
);

export const clKol = defineRule(
  {
    id: 'CL-KOL',
    ruleSetId: RULE_SET,
    title: '通过 Life in the UK 考试',
    titleEn: 'Pass the Life in the UK test',
    sources: [
      { srcId: 'SRC-004', locator: 'SW 23.1' },
      { srcId: 'SRC-004', locator: 'SW 45.1' },
      { srcId: 'SRC-005', locator: 'LR 14.1' },
      { srcId: 'SRC-020', locator: 'HK 61.1' },
      { srcId: 'SRC-015', locator: 'KOL 1.1' },
      { srcId: 'SRC-015', locator: 'KOL 2.1' },
    ],
    pendingDetails: [],
  },
  ({ timeline, simulationDate, locale }) => {
    const L = textFor({ locale });
    if (ageExempt(timeline, simulationDate)) {
      return {
        status: 'PASS',
        explanation: L(
          `申请日未满 ${cl.values.settlementMinorAge.value} 岁或已满 ${cl.values.settlementExemptionAge.value} 岁，豁免 Life in the UK 考试。`,
          `Under ${cl.values.settlementMinorAge.value} or aged ${cl.values.settlementExemptionAge.value} or over on the date of application: exempt from the Life in the UK test.`,
        ),
      };
    }
    const basis = onHongKongBno(timeline, simulationDate)
      ? L('（HK 61.1）', ' (HK 61.1)')
      : '';
    const kol = timeline.lifeInTheUk;
    if (!kol) {
      return {
        status: 'UNKNOWN',
        explanation: L(
          `未填写是否已通过 Life in the UK 考试${basis}。`,
          `Not provided whether the Life in the UK test has been passed${basis}.`,
        ),
      };
    }
    return 'exempt' in kol
      ? {
          status: 'PASS',
          explanation: L(
            '申报因身心状况豁免 Life in the UK 考试。',
            'Exempt from the Life in the UK test because of a physical or mental condition, as declared.',
          ),
          assumptions: [
            L(
              '身心状况豁免按用户申报，未核实认定标准。',
              'The physical or mental condition exemption is taken as declared; the criteria are not checked.',
            ),
          ],
        }
      : {
          status: 'PASS',
          explanation: L(
            `已通过 Life in the UK 考试${basis}。`,
            `Passed the Life in the UK test${basis}.`,
          ),
        };
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
    titleEn: `Long Residence: ${cl.values.longResidenceQualifyingYears.value} years of continuous lawful residence`,
    sources: [
      { srcId: 'SRC-005', locator: 'LR 11.1' },
      { srcId: 'SRC-005', locator: 'LR 11.2' },
      { srcId: 'SRC-008', locator: 'CR 3.1' },
      { srcId: 'SRC-008', locator: 'CR 3.3' },
    ],
    pendingDetails: [],
  },
  (ctx) => {
    const L = textFor(ctx);
    const years = cl.values.longResidenceQualifyingYears.value;
    const start = longResidenceStart(ctx);
    const rn = (r: Route) => nameIn(L, routeNames[r]);
    const assumptions = [
      L(
        `连续合法居留计入${rn('STUDENT')}、${rn('GRADUATE')}等临时路线，不计${LR_EXCLUDED.map(rn).join('、')}（LR 11.1(a)）；LR 11.2 不计入的期间（immigration bail 等）与 LR 11.3 的 12 个月要求未建模。`,
        `Continuous lawful residence includes temporary routes such as ${rn('STUDENT')} and ${rn('GRADUATE')}, but not ${LR_EXCLUDED.map(rn).join(', ')} (LR 11.1(a)); periods that do not count under LR 11.2 (immigration bail and similar) and the 12-month requirement in LR 11.3 are not modelled.`,
      ),
      ...(ctx.timeline.absences.length > 0
        ? [
            L(
              `${cl.values.longResidenceLegacyAbsenceBefore.value} 前开始的缺席按 CR 3.3（单次不超过 ${cl.values.longResidenceLegacyMaxSingleAbsenceDays.value} 天、累计不超过 ${cl.values.longResidenceLegacyMaxTotalAbsenceDays.value} 天），之后的按 CR 3.1；出境与入境当日都计入缺席。`,
              `Absences starting before ${cl.values.longResidenceLegacyAbsenceBefore.value} follow CR 3.3 (no single absence over ${cl.values.longResidenceLegacyMaxSingleAbsenceDays.value} days and no more than ${cl.values.longResidenceLegacyMaxTotalAbsenceDays.value} days in total), and later ones follow CR 3.1; the days of departure and return both count as absence.`,
            ),
          ]
        : []),
    ];
    if (!start) {
      return {
        status: 'FAIL',
        explanation: L(
          `${ctx.simulationDate} 当日没有计入 Long Residence 的许可。`,
          `No permission counting towards Long Residence on ${ctx.simulationDate}.`,
        ),
        assumptions,
      };
    }
    const due = addYears(start, years);
    return due <= ctx.simulationDate
      ? {
          status: 'PASS',
          explanation: L(
            `自 ${start} 起连续合法居留，已满 ${years} 年。`,
            `Continuous lawful residence since ${start}: ${years} years completed.`,
          ),
          assumptions,
        }
      : {
          status: 'FAIL',
          explanation: L(
            `自 ${start} 起连续合法居留，截至 ${ctx.simulationDate} 满 ${fullYears(start, ctx.simulationDate)} 年；${due} 满 ${years} 年。`,
            `Continuous lawful residence since ${start}: ${fullYearsEn(start, ctx.simulationDate)} by ${ctx.simulationDate}; ${years} years are completed on ${due}.`,
          ),
          assumptions,
        };
  },
);
