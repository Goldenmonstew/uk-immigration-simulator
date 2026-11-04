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
import type { Lang } from '../rule';
import type { ImmigrationEpisode, RuleContext } from '../types';
import {
  ageExemptOn,
  childDependantAssumption,
  childDependantOn,
} from './es-requirements';
import { esProtectionRouteOn, esQualifyingResidence } from './es-residence';

// Contribution: earnings, British connection, public funds and public service
// (SRC-001 Chapter 2, p14–p19; Table 1 p46).

const RULE_SET = 'earned-settlement-2026-11';

export function gbp(amount: number): string {
  return `£${amount.toLocaleString('en-GB')}`;
}

const earningsAssumption = (L: Lang) =>
  L(
    '收入按英国 tax year 的税前收入计算，窗口为申请日所在 tax year 之前的完整 tax year；各年份统一按现行门槛比较（PD-005 / PD-006 / PD-007）。',
    'Earnings are gross earnings per UK tax year; the window is the complete tax years before the tax year of the application date, and every year is compared with the current thresholds (PD-005 / PD-006 / PD-007).',
  );

/** The "best years" test (p16): meet the threshold in `required` of the last `window` tax years. */
function bestYears(
  { timeline, simulationDate, locale }: RuleContext,
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
  const L = textFor({ locale });
  const explanation =
    L(
      `${years[0]} 至 ${years[years.length - 1]} 这 ${window} 个 tax year 中，有 ${met} 年收入达到 ${gbp(threshold)}`,
      `Earnings reached ${gbp(threshold)} in ${met} of the ${window} tax years ${years[0]} to ${years[years.length - 1]}`,
    ) +
    (household && withPartner > 0
      ? L(
          `（其中 ${withPartner} 年靠与伴侣合计达到 ${gbp(es.values.householdEarningsThreshold.value)}）`,
          ` (${withPartner} of them through combined household earnings of ${gbp(es.values.householdEarningsThreshold.value)})`,
        )
      : '') +
    L(`，需要 ${required} 年`, `; ${required} needed`) +
    (missing > 0
      ? L(
          `；${missing} 年未填写收入`,
          `; earnings not provided for ${missing} year(s)`,
        )
      : '') +
    L('。', '.');
  return { status, explanation, withPartner } as const;
}

function earningsRule(
  id: string,
  title: string,
  titleEn: string,
  threshold: number,
  years: BestYears,
  sources: SourceRef[],
  pendingDetails: string[],
) {
  return defineRule(
    { id, ruleSetId: RULE_SET, title, titleEn, sources, pendingDetails },
    (ctx) => {
      const { status, explanation } = bestYears(ctx, threshold, years, false);
      return {
        status,
        explanation,
        assumptions: [earningsAssumption(textFor(ctx))],
      };
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
  `${es.values.pathwayYears3.value}-year pathway earnings: ${gbp(es.values.earningsThreshold3Year.value)} in ${es.values.bestYears3Year.value.required} of ${es.values.bestYears3Year.value.window} years`,
  es.values.earningsThreshold3Year.value,
  es.values.bestYears3Year.value,
  EARNINGS_SOURCES,
  ['PD-005', 'PD-006', 'PD-007', 'PD-008', 'PD-011'],
);

export const esEarnings5Y = earningsRule(
  'ES-EARNINGS-5Y',
  `5 年路径收入：${es.values.bestYears5Year.value.window} 年中 ${es.values.bestYears5Year.value.required} 年达到 ${gbp(es.values.earningsThreshold5Year.value)}`,
  `${es.values.pathwayYears5.value}-year pathway earnings: ${gbp(es.values.earningsThreshold5Year.value)} in ${es.values.bestYears5Year.value.required} of ${es.values.bestYears5Year.value.window} years`,
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
    titleEn: `Minimum earnings: ${gbp(es.values.earningsThresholdMinimum.value)} in ${es.values.bestYears10Year.value.required} of ${es.values.bestYears10Year.value.window} years (or ${gbp(es.values.householdEarningsThreshold.value)} combined household earnings)`,
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
    const L = textFor(ctx);
    if (ageExemptOn(timeline, simulationDate)) {
      return {
        status: 'PASS',
        explanation: L(
          `申请日未满 ${es.values.adultAge.value} 岁或已满 ${es.values.exemptionAge.value} 岁，豁免最低收入要求。`,
          `Under ${es.values.adultAge.value} or aged ${es.values.exemptionAge.value} or over on the date of application: exempt from the minimum earnings requirement.`,
        ),
      };
    }
    // Adult children over the age limit cannot settle as dependants at all
    // (ES-DEPENDANT-PATHWAY, p30).
    if (childDependantOn(timeline, simulationDate)) {
      return {
        status: 'PASS',
        explanation: L(
          '保留 child-dependant 身份的成年子女随家庭定居，不需满足个人收入要求。',
          'An adult child retaining child-dependant status settles with the family and does not need to meet the individual earnings requirement.',
        ),
        sources: [{ srcId: 'SRC-001', locator: 'p30' }],
        assumptions: [childDependantAssumption(L)],
      };
    }
    if (timeline.earningsExemptHealth) {
      return {
        status: 'PASS',
        explanation: L(
          '申报因身心状况无法满足最低收入要求，适用豁免。',
          'A physical or mental condition that prevents meeting the minimum earnings requirement has been declared, so the exemption applies.',
        ),
        assumptions: [
          L(
            '身心状况豁免按用户申报，未核实认定标准（PD-009）。',
            'The physical or mental condition exemption is taken as declared; the criteria are not checked (PD-009).',
          ),
        ],
      };
    }
    const { status, explanation, withPartner } = bestYears(
      ctx,
      es.values.earningsThresholdMinimum.value,
      es.values.bestYears10Year.value,
      true,
    );
    const assumptions = [
      earningsAssumption(L),
      L(
        '最低收入按 p16 与 Table 1 的"申请前 7 年中 5 年"计算；p15 另有"至少 3 年"的说法（PD-041）。',
        'Minimum earnings are calculated as “5 of the 7 years before applying”, as in p16 and Table 1; p15 also says “at least 3 years” (PD-041).',
      ),
    ];
    if (withPartner > 0) {
      assumptions.push(
        L(
          '家庭合计收入假设申请人与伴侣是 eligible couple（genuine and subsisting 关系），且伴侣没有反过来依赖申请人的收入（p17；PD-010）。',
          'Combined household earnings assume the applicant and partner are an eligible couple (a genuine and subsisting relationship) and the partner does not in turn rely on the applicant’s earnings (p17; PD-010).',
        ),
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
    titleEn: `British connection (${es.values.pathwayYears5.value}-year pathway)`,
    sources: [{ srcId: 'SRC-001', locator: 'p18' }],
    pendingDetails: [],
  },
  ({ timeline, simulationDate, locale }) => {
    const L = textFor({ locale });
    const route = episodeOn(timeline, simulationDate)?.route;
    if (route === 'UK_ANCESTRY') {
      return {
        status: 'PASS',
        explanation: L(
          '持 UK Ancestry 签证，属 recognised British connection，可走 5 年路径。',
          'Holds a UK Ancestry visa, a recognised British connection: the 5-year pathway is available.',
        ),
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
        explanation: L(
          '以 British citizen 的伴侣、父母或子女身份持家庭签证，属 recognised British connection，可走 5 年路径。',
          'Holds a family visa as the partner, parent or child of a British citizen, a recognised British connection: the 5-year pathway is available.',
        ),
      };
    }
    return {
      status: 'FAIL',
      explanation: L(
        '不属于 British citizen 家属路线或 UK Ancestry，不走这条 5 年路径。',
        'Not on a British citizen family route or UK Ancestry, so this 5-year pathway does not apply.',
      ),
    };
  },
);

function namesOf(types: string[], L: Lang): string {
  return [...new Set(types)]
    .map(
      (t) =>
        [
          ...publicFundsBenefits.publicFunds,
          ...publicFundsBenefits.notPublicFunds,
        ].find((b) => b.benefitType === t)?.name ?? t,
    )
    .join(L('、', ', '));
}

export const esPublicFunds = defineRule(
  {
    id: 'ES-PUBLIC-FUNDS',
    ruleSetId: RULE_SET,
    title: '申请前 5 年未使用 public funds',
    titleEn: `No public funds in the ${es.values.publicFundsLookbackYears.value} years before applying`,
    sources: [
      { srcId: 'SRC-001', locator: 'p18' },
      { srcId: 'SRC-006', locator: '#benefits-open-to-new-claims' },
      {
        srcId: 'SRC-006',
        locator: '#contributory-benefits-and-statutory-payments',
      },
    ],
    pendingDetails: ['PD-013', 'PD-014', 'PD-031', 'PD-047', 'PD-066'],
  },
  ({ timeline, simulationDate, locale }) => {
    const L = textFor({ locale });
    const years = es.values.publicFundsLookbackYears.value;
    const protection = esProtectionRouteOn(timeline, simulationDate);
    if (protection === 'SAFE_AND_LEGAL') {
      return {
        status: 'PASS',
        explanation: L(
          `经 designated Safe and Legal Routes 入境的难民豁免"定居前 ${years} 年未使用 public funds"的要求（p37、p47）。`,
          `Refugees admitted through designated Safe and Legal Routes are exempt from the requirement not to have used public funds in the ${years} years before settlement (p37, p47).`,
        ),
        sources: [
          { srcId: 'SRC-001', locator: 'p37' },
          { srcId: 'SRC-001', locator: 'p47' },
        ],
      };
    }
    if (protection === 'CORE_PROTECTION') {
      return {
        status: 'PASS',
        explanation: L(
          `Core Protection 的 ${es.values.protectionPathwayYearsCore.value} 年路径不要求申请前 ${years} 年未使用 public funds；这一要求只用于短于 20 年的路径（p39）。`,
          `The ${es.values.protectionPathwayYearsCore.value}-year Core Protection pathway does not require no use of public funds in the ${years} years before applying; that requirement only applies to pathways shorter than 20 years (p39).`,
        ),
        sources: [
          { srcId: 'SRC-001', locator: 'p39' },
          { srcId: 'SRC-001', locator: 'p47' },
        ],
      };
    }
    const pws = protection === 'PROTECTION_WORK_AND_STUDY';
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
            ...(pws
              ? [
                  L(
                    '难民哪些福利可不计入、对最弱势者的保障措施，将在实施前公布；目前先按现行 public funds 定义判断（PD-031）。',
                    'Which benefits may be disregarded for refugees, and the safeguards for the most vulnerable, are to be set out before implementation; the current public funds definition is used for now (PD-031).',
                  ),
                ]
              : []),
            L(
              'specified public funds 先按现行 public funds 定义（SRC-006）判断；政府将另定纳入范围与弱势群体的保障或豁免（PD-013）。',
              'Specified public funds are judged by the current public funds definition (SRC-006) for now; the government will set the scope, and protections or exemptions for vulnerable groups, separately (PD-013).',
            ),
            L(
              '只计申请人本人领取的福利；伴侣或子女领取是否影响申请人，原文未说明（PD-014）。',
              'Only benefits received by the applicant are counted; the response does not say whether benefits received by a partner or child affect the applicant (PD-014).',
            ),
            L(
              `回看期按正文"申请前紧接的 ${years} 年"计算，不要求这段时间都在 qualifying route 上（PD-047）。`,
              `The lookback is “the ${years} years immediately before applying”, as in the main text, and that time need not all be on a qualifying route (PD-047).`,
            ),
          ]
        : [];
    const ignoredNote =
      ignored.length > 0
        ? L(
            `${namesOf(
              ignored.map((b) => b.benefitType),
              L,
            )} 属缴费型福利或法定支付，不算 public funds。`,
            ` Contributory benefits or statutory payments, not public funds: ${namesOf(
              ignored.map((b) => b.benefitType),
              L,
            )}.`,
          )
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
          L(
            `${from} 以来领取过 ${namesOf(
              used.map((b) => b.benefitType),
              L,
            )}，属 public funds。${pws ? `Protection Work and Study 的 ${es.values.protectionPathwayYearsWorkAndStudy.value} 年路径要求申请前 ${years} 年未使用 public funds，否则只能走 20 年路径（p39）。` : `3 / 5 / 10 年路径要求申请前 ${years} 年未使用 specified public funds，否则须在 qualifying route 上满 20 年。`}`,
            `Public funds received since ${from}: ${namesOf(
              used.map((b) => b.benefitType),
              L,
            )}. ${pws ? `The ${es.values.protectionPathwayYearsWorkAndStudy.value}-year Protection Work and Study pathway requires no use of public funds in the ${years} years before applying; otherwise only the 20-year pathway is available (p39).` : `The 3 / 5 / 10-year pathways require no use of specified public funds in the ${years} years before applying; otherwise 20 years on a qualifying route are needed.`}`,
          ) +
          (ongoing
            ? ''
            : L(
                `若此后不再使用，自 ${addDays(addYears(lastUse, years), 1)} 起回看期内不再有 public funds，可按较短路径重新评估。`,
                ` If they are not used again, the lookback contains no public funds from ${addDays(addYears(lastUse, years), 1)}, and the shorter pathways can be reassessed.`,
              )) +
          ignoredNote,
        ...(pws && {
          sources: [
            { srcId: 'SRC-001', locator: 'p39' },
            { srcId: 'SRC-006', locator: '#benefits-open-to-new-claims' },
          ],
        }),
        assumptions: [
          ...assumptions,
          ...(pws
            ? [
                L(
                  '20 年按 p25 / p38 的"转入新路线重新起算"，自 Protection Work and Study 的合格期起点起算，不含此前的 Core Protection 时间（PD-066）。',
                  'Following the rule that the count restarts on moving to a new route (p25, p38), the 20 years count from the start of the qualifying period on Protection Work and Study, without earlier Core Protection time (PD-066).',
                ),
              ]
            : []),
        ],
      };
    }
    if (unlisted.length > 0) {
      return {
        status: 'UNKNOWN',
        explanation: L(
          `${namesOf(
            unlisted.map((b) => b.benefitType),
            L,
          )} 不在现行 public funds 指引的两张清单中，无法判断是否算 public funds。${ignoredNote}`,
          `Not on either list in the current public funds guidance: ${namesOf(
            unlisted.map((b) => b.benefitType),
            L,
          )}. Whether it counts as public funds cannot be determined.${ignoredNote}`,
        ),
        pendingDetails: ['PD-013'],
        assumptions,
      };
    }
    return {
      status: 'PASS',
      explanation: L(
        `申请前 ${years} 年内未领取 public funds。${ignoredNote}`,
        `No public funds received in the ${years} years before applying.${ignoredNote}`,
      ),
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
    titleEn: `${es.values.pathwayYears5.value} years in public service occupations (${es.values.pathwayYears5.value}-year pathway)`,
    sources: [
      { srcId: 'SRC-001', locator: 'p16' },
      { srcId: 'SRC-001', locator: 'p46 fn 17' },
      ...annexCOccupations.sources,
    ],
    pendingDetails: ['PD-012'],
  },
  (ctx) => {
    const { timeline, simulationDate } = ctx;
    const L = textFor(ctx);
    const current = episodeOn(timeline, simulationDate);
    if (!current || !inAnnexC(current)) {
      return {
        status: 'FAIL',
        explanation: L(
          '当前工作不在 Annex C 公共服务职业表中，不走这条 5 年路径。',
          'The current job is not in the Annex C public service occupations list, so this 5-year pathway does not apply.',
        ),
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
        explanation: L(
          `自 ${since} 起连续从事 Annex C 公共服务职业（${title}），已满 ${years} 年。`,
          `In an Annex C public service occupation (${title}) continuously since ${since}: ${years} years completed.`,
        ),
      };
    }
    const residence = esQualifyingResidence(ctx);
    if (residence && since <= residence.start) {
      return {
        status: 'PASS',
        explanation: L(
          `整个合格期（自 ${residence.start} 起）都在 Annex C 公共服务职业（${title}），可走 5 年路径。`,
          `The whole qualifying period (since ${residence.start}) has been in an Annex C public service occupation (${title}): the 5-year pathway is available.`,
        ),
      };
    }
    return {
      status: 'UNKNOWN',
      explanation: L(
        `合格期中途才转入 Annex C 公共服务职业（${title}，自 ${since} 起），原文未说明换入合格职业前的年份如何计算。`,
        `Switched into an Annex C public service occupation (${title}, since ${since}) partway through the qualifying period; the response does not say how the years before the switch count.`,
      ),
      pendingDetails: ['PD-012'],
    };
  },
);
