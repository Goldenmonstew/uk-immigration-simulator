import {
  annexCOccupations,
  earnedSettlement2026_11 as es,
  publicFundsBenefits,
} from '@uk-immigration/policy-data';
import type {
  Benefit,
  BestYears,
  SourceRef,
} from '@uk-immigration/policy-data';
import { addDays, addYears, taxYearsBefore } from '../dates';
import { continuousRun, episodeOn } from '../residence';
import { defineRule, textFor } from '../rule';
import type { ImmigrationEpisode, RuleContext } from '../types';
import {
  ageExemptOn,
  childDependantAssumption,
  childDependantOn,
} from './es-requirements';
import { esQualifyingResidence } from './es-residence';

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
  `3 年路径收入：${es.values.bestYears3Year.value.window} 年中 ${es.values.bestYears3Year.value.required} 年达到 ${gbp(es.values.earningsThreshold3Year.value)}`,
  es.values.earningsThreshold3Year.value,
  es.values.bestYears3Year.value,
  EARNINGS_SOURCES,
  ['PD-005', 'PD-006', 'PD-007', 'PD-008', 'PD-011'],
);

export const esEarnings5Y = earningsRule(
  'ES-EARNINGS-5Y',
  `5 年路径收入：${es.values.bestYears5Year.value.window} 年中 ${es.values.bestYears5Year.value.required} 年达到 ${gbp(es.values.earningsThreshold5Year.value)}`,
  es.values.earningsThreshold5Year.value,
  es.values.bestYears5Year.value,
  EARNINGS_SOURCES,
  ['PD-005', 'PD-006', 'PD-007', 'PD-008'],
);

export const esEarnings10Y = defineRule(
  {
    id: 'ES-EARNINGS-10Y',
    ruleSetId: RULE_SET,
    title: `最低收入：${es.values.bestYears10Year.value.window} 年中 ${es.values.bestYears10Year.value.required} 年达到 ${gbp(es.values.earningsThresholdMinimum.value)}（或家庭合计 ${gbp(es.values.householdEarningsThreshold.value)}）`,
    sources: [
      ...EARNINGS_SOURCES,
      { srcId: 'SRC-001', locator: 'p17' },
      { srcId: 'SRC-001', locator: 'p30' },
    ],
    pendingDetails: [
      'PD-005',
      'PD-006',
      'PD-007',
      'PD-008',
      'PD-009',
      'PD-010',
      'PD-041',
      'PD-042',
      'PD-059',
    ],
  },
  (ctx) => {
    const { timeline, simulationDate } = ctx;
    if (ageExemptOn(timeline, simulationDate)) {
      return {
        status: 'PASS',
        explanation: `申请日未满 ${es.values.adultAge.value} 岁或已满 ${es.values.exemptionAge.value} 岁，豁免最低收入要求。`,
      };
    }
    // Adult children over the age limit cannot settle as dependants at all
    // (ES-DEPENDANT-PATHWAY, p30).
    if (childDependantOn(timeline, simulationDate)) {
      return {
        status: 'PASS',
        explanation:
          '保留 child-dependant 身份的成年子女随家庭定居，不需满足个人收入要求。',
        sources: [{ srcId: 'SRC-001', locator: 'p30' }],
        assumptions: [childDependantAssumption(textFor(ctx))],
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

export const esBritishConnection = defineRule(
  {
    id: 'ES-BRITISH-CONNECTION',
    ruleSetId: RULE_SET,
    title: 'British connection（5 年路径）',
    sources: [{ srcId: 'SRC-001', locator: 'p18' }],
    pendingDetails: [],
  },
  ({ timeline, simulationDate }) => {
    const route = episodeOn(timeline, simulationDate)?.route;
    if (route === 'UK_ANCESTRY') {
      return {
        status: 'PASS',
        explanation:
          '持 UK Ancestry 签证，属 recognised British connection，可走 5 年路径。',
      };
    }
    if (
      route === 'FAMILY_PARTNER_OR_PARENT' &&
      timeline.relationships.some(
        (r) => r.otherPartyStatus === 'BRITISH_CITIZEN',
      )
    ) {
      return {
        status: 'PASS',
        explanation:
          '以 British citizen 的伴侣、父母或子女身份持家庭签证，属 recognised British connection，可走 5 年路径。',
      };
    }
    return {
      status: 'FAIL',
      explanation:
        '不属于 British citizen 家属路线或 UK Ancestry，不走这条 5 年路径。',
    };
  },
);

function namesOf(types: string[]): string {
  return [...new Set(types)]
    .map(
      (t) =>
        [
          ...publicFundsBenefits.publicFunds,
          ...publicFundsBenefits.notPublicFunds,
        ].find((b) => b.benefitType === t)?.name ?? t,
    )
    .join('、');
}

export const esPublicFunds = defineRule(
  {
    id: 'ES-PUBLIC-FUNDS',
    ruleSetId: RULE_SET,
    title: '申请前 5 年未使用 public funds',
    sources: [
      { srcId: 'SRC-001', locator: 'p18' },
      { srcId: 'SRC-006', locator: '#benefits-open-to-new-claims' },
      {
        srcId: 'SRC-006',
        locator: '#contributory-benefits-and-statutory-payments',
      },
    ],
    pendingDetails: ['PD-013', 'PD-014', 'PD-047'],
  },
  ({ timeline, simulationDate }) => {
    const years = es.values.publicFundsLookbackYears.value;
    const from = addYears(simulationDate, -years);
    const inWindow = timeline.benefits.filter(
      (b) => b.from <= simulationDate && (b.to ?? simulationDate) >= from,
    );
    const isIn = (list: Benefit[]) => (t: string) =>
      list.some((b) => b.benefitType === t);
    const used = inWindow.filter((b) =>
      isIn(publicFundsBenefits.publicFunds)(b.benefitType),
    );
    const unlisted = inWindow.filter(
      (b) =>
        !isIn(publicFundsBenefits.publicFunds)(b.benefitType) &&
        !isIn(publicFundsBenefits.notPublicFunds)(b.benefitType),
    );
    const ignored = inWindow.filter((b) =>
      isIn(publicFundsBenefits.notPublicFunds)(b.benefitType),
    );
    const assumptions =
      inWindow.length > 0
        ? [
            'specified public funds 先按现行 public funds 定义（SRC-006）判断；政府将另定纳入范围与弱势群体的保障或豁免（PD-013）。',
            '只计申请人本人领取的福利；伴侣或子女领取是否影响申请人，原文未说明（PD-014）。',
            `回看期按正文"申请前紧接的 ${years} 年"计算，不要求这段时间都在 qualifying route 上（PD-047）。`,
          ]
        : [];
    const ignoredNote =
      ignored.length > 0
        ? `${namesOf(ignored.map((b) => b.benefitType))} 属缴费型福利或法定支付，不算 public funds。`
        : '';
    if (used.length > 0) {
      const ongoing = used.some((b) => !b.to);
      const lastUse = used
        .map((b) => b.to ?? simulationDate)
        .sort()
        .at(-1)!;
      return {
        status: 'FAIL',
        explanation:
          `${from} 以来领取过 ${namesOf(used.map((b) => b.benefitType))}，属 public funds。3 / 5 / 10 年路径要求申请前 ${years} 年未使用 specified public funds，否则须在 qualifying route 上满 20 年。` +
          (ongoing
            ? ''
            : `若此后不再使用，自 ${addDays(addYears(lastUse, years), 1)} 起回看期内不再有 public funds，可按较短路径重新评估。`) +
          ignoredNote,
        assumptions,
      };
    }
    if (unlisted.length > 0) {
      return {
        status: 'UNKNOWN',
        explanation: `${namesOf(unlisted.map((b) => b.benefitType))} 不在现行 public funds 指引的两张清单中，无法判断是否算 public funds。${ignoredNote}`,
        pendingDetails: ['PD-013'],
        assumptions,
      };
    }
    return {
      status: 'PASS',
      explanation: `申请前 ${years} 年内未领取 public funds。${ignoredNote}`,
      assumptions,
    };
  },
);

const inAnnexC = (e: ImmigrationEpisode) =>
  annexCOccupations.occupations.some((o) => o.socCode === e.socCode);

export const esPublicService = defineRule(
  {
    id: 'ES-PUBLIC-SERVICE',
    ruleSetId: RULE_SET,
    title: '公共服务职业满 5 年（5 年路径）',
    sources: [
      { srcId: 'SRC-001', locator: 'p16' },
      { srcId: 'SRC-001', locator: 'p46 fn 17' },
      ...annexCOccupations.sources,
    ],
    pendingDetails: ['PD-012'],
  },
  (ctx) => {
    const { timeline, simulationDate } = ctx;
    const current = episodeOn(timeline, simulationDate);
    if (!current || !inAnnexC(current)) {
      return {
        status: 'FAIL',
        explanation:
          '当前工作不在 Annex C 公共服务职业表中，不走这条 5 年路径。',
      };
    }
    const title = annexCOccupations.occupations.find(
      (o) => o.socCode === current.socCode,
    )?.title;
    const since = continuousRun(timeline, simulationDate, inAnnexC).episodes[0]
      .validFrom;
    const years = es.values.pathwayYears5.value;
    if (addYears(since, years) <= simulationDate) {
      return {
        status: 'PASS',
        explanation: `自 ${since} 起连续从事 Annex C 公共服务职业（${title}），已满 ${years} 年。`,
      };
    }
    const residence = esQualifyingResidence(ctx);
    if (residence && since <= residence.start) {
      return {
        status: 'PASS',
        explanation: `整个合格期（自 ${residence.start} 起）都在 Annex C 公共服务职业（${title}），可走 5 年路径。`,
      };
    }
    return {
      status: 'UNKNOWN',
      explanation: `合格期中途才转入 Annex C 公共服务职业（${title}，自 ${since} 起），原文未说明换入合格职业前的年份如何计算。`,
      pendingDetails: ['PD-012'],
    };
  },
);
