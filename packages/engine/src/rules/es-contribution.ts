import { earnedSettlement2026_11 as es } from '@uk-immigration/policy-data';
import type { BestYears, SourceRef } from '@uk-immigration/policy-data';
import { taxYearsBefore } from '../dates';
import { defineRule } from '../rule';
import type { RuleContext } from '../types';
import { ageExemptOn } from './es-requirements';

// Contribution: earnings, British connection, public funds and public service
// (SRC-001 Chapter 2, p14–p19; Table 1 p46).

const RULE_SET = 'earned-settlement-2026-11';

export function gbp(amount: number): string {
  return `£${amount.toLocaleString('en-GB')}`;
}

const EARNINGS_ASSUMPTION =
  '收入按英国 tax year 的税前收入计算，窗口为申请日所在 tax year 之前的完整 tax year；各年份统一按现行门槛比较（PD-005 / PD-006 / PD-007）。';

/** The "best years" test (p16): meet the threshold in `required` of the last `window` tax years. */
function bestYears(
  { timeline, simulationDate }: RuleContext,
  threshold: number,
  { required, window }: BestYears,
  household: boolean,
) {
  const years = taxYearsBefore(simulationDate, window);
  let met = 0;
  let missing = 0;
  let withPartner = 0;
  for (const taxYear of years) {
    const income = timeline.incomeYears.find((i) => i.taxYear === taxYear);
    const own = income?.earnings;
    if (own !== undefined && own >= threshold) {
      met++;
    } else if (
      household &&
      (own ?? 0) + (income?.partnerEarnings ?? 0) >=
        es.values.householdEarningsThreshold.value
    ) {
      met++;
      withPartner++;
    } else if (own === undefined) {
      missing++;
    }
  }
  const status =
    met >= required ? 'PASS' : met + missing >= required ? 'UNKNOWN' : 'FAIL';
  const explanation =
    `${years[0]} 至 ${years[years.length - 1]} 这 ${window} 个 tax year 中，有 ${met} 年收入达到 ${gbp(threshold)}` +
    (household && withPartner > 0
      ? `（其中 ${withPartner} 年靠与伴侣合计达到 ${gbp(es.values.householdEarningsThreshold.value)}）`
      : '') +
    `，需要 ${required} 年` +
    (missing > 0 ? `；${missing} 年未填写收入` : '') +
    '。';
  return { status, explanation, withPartner } as const;
}

function earningsRule(
  id: string,
  title: string,
  threshold: number,
  years: BestYears,
  sources: SourceRef[],
  pendingDetails: string[],
) {
  return defineRule(
    { id, ruleSetId: RULE_SET, title, sources, pendingDetails },
    (ctx) => {
      const { status, explanation } = bestYears(ctx, threshold, years, false);
      return { status, explanation, assumptions: [EARNINGS_ASSUMPTION] };
    },
  );
}

const EARNINGS_SOURCES: SourceRef[] = [
  { srcId: 'SRC-001', locator: 'p15' },
  { srcId: 'SRC-001', locator: 'p16' },
  { srcId: 'SRC-001', locator: 'p46' },
];

export const esEarnings3Y = earningsRule(
  'ES-EARNINGS-3Y',
  '3 年路径收入：4 年中 3 年达到 £125,141',
  es.values.earningsThreshold3Year.value,
  es.values.bestYears3Year.value,
  EARNINGS_SOURCES,
  ['PD-005', 'PD-006', 'PD-007', 'PD-008', 'PD-011'],
);

export const esEarnings5Y = earningsRule(
  'ES-EARNINGS-5Y',
  '5 年路径收入：5 年中 3 年达到 £50,271',
  es.values.earningsThreshold5Year.value,
  es.values.bestYears5Year.value,
  EARNINGS_SOURCES,
  ['PD-005', 'PD-006', 'PD-007', 'PD-008'],
);

export const esEarnings10Y = defineRule(
  {
    id: 'ES-EARNINGS-10Y',
    ruleSetId: RULE_SET,
    title: '最低收入：7 年中 5 年达到 £12,571（或家庭合计 £25,142）',
    sources: [...EARNINGS_SOURCES, { srcId: 'SRC-001', locator: 'p17' }],
    pendingDetails: [
      'PD-005',
      'PD-006',
      'PD-007',
      'PD-008',
      'PD-009',
      'PD-010',
      'PD-041',
      'PD-042',
    ],
  },
  (ctx) => {
    const { timeline, simulationDate } = ctx;
    if (ageExemptOn(timeline, simulationDate)) {
      return {
        status: 'PASS',
        explanation: '申请日未满 18 岁或已满 65 岁，豁免最低收入要求。',
      };
    }
    if (timeline.earningsExemptHealth) {
      return {
        status: 'PASS',
        explanation: '申报因身心状况无法满足最低收入要求，适用豁免。',
        assumptions: ['身心状况豁免按用户申报，未核实认定标准（PD-009）。'],
      };
    }
    const { status, explanation, withPartner } = bestYears(
      ctx,
      es.values.earningsThresholdMinimum.value,
      es.values.bestYears10Year.value,
      true,
    );
    const assumptions = [
      EARNINGS_ASSUMPTION,
      '最低收入按 p16 与 Table 1 的"申请前 7 年中 5 年"计算；p15 另有"至少 3 年"的说法（PD-041）。',
    ];
    if (withPartner > 0) {
      assumptions.push(
        '家庭合计收入假设申请人与伴侣是 eligible couple（genuine and subsisting 关系），且伴侣没有反过来依赖申请人的收入（p17；PD-010）。',
      );
    }
    return { status, explanation, assumptions };
  },
);
