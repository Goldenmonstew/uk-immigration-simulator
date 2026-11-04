import {
  currentLaw2026_11 as cl,
  earnedSettlement2026_11 as es,
} from '@uk-immigration/policy-data';
import type {
  Route,
  RouteGroup,
  RuleSetId,
} from '@uk-immigration/policy-data';
import { addYears } from './dates';
import { continuousRun, episodeOn } from './residence';
import { runRule, textFor } from './rule';
import type { Lang } from './rule';
import { RULES } from './rules';
import {
  longResidenceStart,
  onSkilledWorker,
  onSkilledWorkerChild,
  onSkilledWorkerPartner,
  skilledWorkerChildStart,
  skilledWorkerPartnerStart,
  skilledWorkerStart,
} from './rules/current-law';
import { esDependantSettlement } from './rules/es-dependant';
import {
  illegalEntryExtraYears,
  protectionBaseYears,
} from './rules/es-protection';
import {
  esProtectionRouteOn,
  esQualifyingResidence,
  esRouteOn,
  groupsOf,
} from './rules/es-residence';
import type {
  IsoDate,
  RuleContext,
  RuleOutcome,
  SettlementAssessment,
} from './types';

// Turns rule outcomes into a pathway, an outcome and an earliest date. Not a
// rule itself: the rules say what holds, this says what it adds up to.

/** One way to settle: every rule must pass and `years` of residence from `start`. */
interface Candidate {
  years: number;
  start?: IsoDate;
  rules: RuleOutcome[];
}

type Decision = Pick<
  SettlementAssessment,
  'outcome' | 'pathwayYears' | 'earliestDate'
> & {
  /** Start of the residence the earliest date was projected from. */
  projectedFrom?: IsoDate;
};

function statusOf(c: Candidate): RuleOutcome['status'] {
  if (c.rules.some((r) => r.status === 'FAIL')) return 'FAIL';
  if (c.rules.some((r) => r.status === 'UNKNOWN')) return 'UNKNOWN';
  return 'PASS';
}

const dueOf = (c: Candidate) => c.start && addYears(c.start, c.years);

/**
 * - Some candidate passes with enough residence → LIKELY_ELIGIBLE (shortest).
 * - Otherwise some candidate with enough residence (or unknown residence) is
 *   only UNKNOWN → POTENTIALLY_ELIGIBLE (with that pathway) if every unknown
 *   is a pending detail, else INSUFFICIENT_INFORMATION (no pathway).
 * - Otherwise LIKELY_NOT_ELIGIBLE, with the earliest date of the candidates
 *   that have not failed, assuming circumstances stay the same.
 */
function decide(candidates: Candidate[], simulationDate: IsoDate): Decision {
  const met = (c: Candidate) => {
    const due = dueOf(c);
    return due !== undefined && due <= simulationDate;
  };
  const byYears = (a: Candidate, b: Candidate) => a.years - b.years;

  const now = candidates
    .filter((c) => statusOf(c) === 'PASS' && met(c))
    .sort(byYears)[0];
  if (now) {
    return {
      outcome: 'LIKELY_ELIGIBLE',
      pathwayYears: now.years,
      earliestDate: simulationDate,
    };
  }

  const maybe = candidates
    .filter((c) => statusOf(c) === 'UNKNOWN' && (met(c) || !c.start))
    .sort(byYears);
  if (maybe.length > 0) {
    const unknown = maybe.flatMap((c) =>
      c.rules.filter((r) => r.status === 'UNKNOWN'),
    );
    // A pathway is only shown when the user has given everything they can.
    return unknown.every((r) => r.pendingDetails?.length)
      ? { outcome: 'POTENTIALLY_ELIGIBLE', pathwayYears: maybe[0].years }
      : { outcome: 'INSUFFICIENT_INFORMATION' };
  }

  const next = candidates
    .filter((c) => statusOf(c) !== 'FAIL' && c.start)
    .sort((a, b) => {
      const [da, db] = [dueOf(a)!, dueOf(b)!];
      return da === db ? a.years - b.years : da < db ? -1 : 1;
    })[0];
  return next
    ? {
        outcome: 'LIKELY_NOT_ELIGIBLE',
        pathwayYears: next.years,
        earliestDate: dueOf(next),
        projectedFrom: next.start,
      }
    : { outcome: 'LIKELY_NOT_ELIGIBLE' };
}

function projection(projectedFrom: IsoDate | undefined, L: Lang): string[] {
  return projectedFrom
    ? [
        L(
          `最早可申请日期按"自 ${projectedFrom} 起持续居留、收入等状况不变、其余要求届时仍满足"推算，不是对未来的保证。`,
          `The earliest application date is projected on the basis that residence continues from ${projectedFrom}, earnings and other circumstances stay the same, and the other requirements are still met then; it is not a guarantee about the future.`,
        ),
      ]
    : [];
}

function toAssessment(
  { projectedFrom, ...decision }: Decision,
  rules: RuleOutcome[],
  assumptions: string[],
  L: Lang,
): SettlementAssessment {
  return {
    ...decision,
    rules,
    assumptions: [
      ...new Set([
        ...assumptions,
        ...rules.flatMap((r) => r.assumptions ?? []),
        ...projection(projectedFrom, L),
      ]),
    ],
  };
}

const esBaseAssumption = (L: Lang) =>
  L(
    'Earned Settlement 已公布、尚未生效，按"假设在申请日适用"评估；规则依据为政府回应文件（SRC-001），不是已生效的 Immigration Rules（PD-001）。首批规则修改预计 2026 年 12 月起提交、2027 年 1 月生效，2027–2028 年继续修改（SRC-002 col 593；SRC-003 cols 1423–1424），具体生效日以届时的 Statement of Changes 为准（PD-003）。',
    'Earned Settlement has been announced but is not yet in force; it is assessed as if it applied on the date of application. The rules are based on the government response (SRC-001), not on Immigration Rules in force (PD-001). The first rule changes are expected to be laid from December 2026 and take effect in January 2027, with further changes in 2027–2028 (SRC-002 col 593; SRC-003 cols 1423–1424); the actual dates will be set by the Statements of Changes (PD-003).',
  );

const ES_MANDATORY = [
  'ES-CRIMINALITY',
  'ES-DEBT',
  'ES-ENGLISH-B2',
  'ES-KOL',
  'ES-ROUTE-GROUP',
  'ES-RESIDENCE',
];

// A dependant's one pathway: the mandatory requirements (with the exemptions
// inside the rules, p29–p30), the minimum income and the principal's pathway.
// ES-PUBLIC-FUNDS and ES-BREACH feed ES-DEPENDANT-PATHWAY (PD-062).
const ES_DEPENDANT_PATHWAY = [
  ...ES_MANDATORY,
  'ES-EARNINGS-10Y',
  'ES-DEPENDANT-PATHWAY',
];
const ES_DEPENDANT_RULES = [
  ...ES_DEPENDANT_PATHWAY,
  'ES-PUBLIC-FUNDS',
  'ES-BREACH',
];

// Rules only for protection routes (contracts §11).
const ES_PROTECTION_ONLY = ['ES-PROTECTION-PATHWAY'];
// What protection routes run: no earnings, British connection, public
// service or transitional rules (Table 2).
const ES_PROTECTION_RULES = [
  ...ES_MANDATORY,
  'ES-BREACH',
  'ES-PUBLIC-FUNDS',
  ...ES_PROTECTION_ONLY,
];

/**
 * Table 2 (p47–p48): one pathway per protection route, plus the 20 years
 * left after public funds or a breach (p13, p39). Illegal entry adds 10
 * years to each (p38, p48).
 */
function protectionCandidates(
  route: Route,
  pick: (...ids: string[]) => RuleOutcome[],
  ctx: RuleContext,
): Candidate[] {
  const mandatory = [...pick(...ES_MANDATORY), ...pick('ES-PROTECTION-PATHWAY')];
  const extra = illegalEntryExtraYears(ctx.timeline);
  const base = protectionBaseYears(route) + extra;
  const fallback = es.values.pathwayYears20.value + extra;
  const candidates: Candidate[] =
    route === 'SAFE_AND_LEGAL'
      ? [
          { years: base, rules: [...mandatory, ...pick('ES-BREACH')] },
          { years: fallback, rules: mandatory },
        ]
      : route === 'PROTECTION_WORK_AND_STUDY'
        ? [
            {
              years: base,
              rules: [...mandatory, ...pick('ES-BREACH', 'ES-PUBLIC-FUNDS')],
            },
            { years: fallback, rules: mandatory },
          ]
        : [{ years: base, rules: mandatory }];
  const start = esQualifyingResidence(ctx)?.start;
  return candidates.map((c) => ({ ...c, start }));
}

/** `rules` with `id` failed for want of time, until `earliestDate`. */
function showProjected(
  rules: RuleOutcome[],
  id: string,
  decision: Decision,
  note: string,
): RuleOutcome[] {
  return decision.projectedFrom
    ? rules.map((r) =>
        r.id === id
          ? { ...r, status: 'FAIL' as const, explanation: r.explanation + note }
          : r,
      )
    : rules;
}

function assessDependant(
  ctx: RuleContext,
  rules: RuleOutcome[],
): SettlementAssessment {
  const L = textFor(ctx);
  const assumptions = [esBaseAssumption(L)];
  const current = episodeOn(ctx.timeline, ctx.simulationDate);
  if (!ctx.principal || !current?.dependantOf) {
    return toAssessment(
      { outcome: 'INSUFFICIENT_INFORMATION' },
      rules,
      assumptions,
      L,
    );
  }
  const pathway = rules.filter((r) => ES_DEPENDANT_PATHWAY.includes(r.id));
  const settlement = esDependantSettlement(ctx);
  if (!settlement) {
    const unknown = pathway.filter((r) => r.status === 'UNKNOWN');
    return toAssessment(
      {
        outcome: pathway.some((r) => r.status === 'FAIL')
          ? 'LIKELY_NOT_ELIGIBLE'
          : unknown.every((r) => r.pendingDetails?.length)
            ? 'POTENTIALLY_ELIGIBLE'
            : 'INSUFFICIENT_INFORMATION',
      },
      rules,
      assumptions,
      L,
    );
  }
  const decision = decide(
    [{ years: settlement.years, start: settlement.start, rules: pathway }],
    ctx.simulationDate,
  );
  const shown = showProjected(
    rules,
    'ES-DEPENDANT-PATHWAY',
    decision,
    L(
      `截至 ${ctx.simulationDate} 尚未满期。`,
      ` Not yet completed by ${ctx.simulationDate}.`,
    ),
  );
  const routeGroupPassed =
    rules.find((r) => r.id === 'ES-ROUTE-GROUP')?.status === 'PASS';
  return {
    ...toAssessment(decision, shown, assumptions, L),
    ...(routeGroupPassed &&
      settlement.routeGroup && { routeGroup: settlement.routeGroup }),
  };
}

function assessEarnedSettlement(ctx: RuleContext): SettlementAssessment {
  const current = episodeOn(ctx.timeline, ctx.simulationDate);
  // A dependant settles with the principal (p29–p31).
  if (current?.role === 'DEPENDANT') {
    return assessDependant(
      ctx,
      RULES['earned-settlement-2026-11']
        .filter((rule) => ES_DEPENDANT_RULES.includes(rule.meta.id))
        .map((rule) => runRule(rule, ctx)),
    );
  }
  const protection = esProtectionRouteOn(ctx.timeline, ctx.simulationDate);
  const rules = RULES['earned-settlement-2026-11']
    .filter((rule) =>
      protection
        ? ES_PROTECTION_RULES.includes(rule.meta.id)
        : rule.meta.id !== 'ES-DEPENDANT-PATHWAY' &&
          !ES_PROTECTION_ONLY.includes(rule.meta.id),
    )
    .map((rule) => runRule(rule, ctx));
  const pick = (...ids: string[]) =>
    ids.map((id) => rules.find((r) => r.id === id)!);
  if (protection) {
    const L = textFor(ctx);
    return finishEarnedSettlement(
      ctx,
      rules,
      protectionCandidates(protection, pick, ctx),
      [
        esBaseAssumption(L),
        L(
          '难民定居路径的多项细则（路线推出时间、已有时间如何计入、public funds 与偿还安排、Article 31）将在实施前公布；本结果仅帮助理解已公布的政策，具体情况请咨询受监管的移民顾问。',
          'Many details of the refugee settlement pathways (when the routes start, how existing time counts, public funds and repayment, Article 31) will be set out before implementation. This result only helps to understand the announced policy; for your own case, please seek advice from a regulated immigration adviser.',
        ),
      ],
      'PROTECTION',
    );
  }
  const mandatory = pick(...ES_MANDATORY);
  const standard = [...mandatory, ...pick('ES-BREACH', 'ES-PUBLIC-FUNDS')];
  const v = es.values;
  const fiveYearRoutes = [
    'ES-EARNINGS-5Y',
    'ES-BRITISH-CONNECTION',
    'ES-PUBLIC-SERVICE',
    'ES-TRANSITIONAL-CARE-WORKER',
    'ES-TRANSITIONAL-HEALTH-EDUCATION',
  ];
  const start = esQualifyingResidence(ctx)?.start;
  const route = esRouteOn(ctx.timeline, ctx.simulationDate);
  const groups = route ? groupsOf(route) : [];
  // Family and Private Life only qualifies for the 10 and 20-year pathways (p23).
  const shortPathways = !groups.includes('FAMILY_AND_PRIVATE_LIFE');
  const candidates: Candidate[] = [
    ...(shortPathways
      ? [
          {
            years: v.pathwayYears3.value,
            rules: [...standard, ...pick('ES-EARNINGS-3Y')],
          },
          ...fiveYearRoutes.map((id) => ({
            years: v.pathwayYears5.value,
            rules: [...standard, ...pick(id)],
          })),
        ]
      : []),
    {
      years: v.pathwayYears10.value,
      rules: [...standard, ...pick('ES-EARNINGS-10Y')],
    },
    // Public funds or a breach leave only the 20-year pathway (p13, p18, p46).
    {
      years: v.pathwayYears20.value,
      rules: [...mandatory, ...pick('ES-EARNINGS-10Y')],
    },
  ].map((c) => ({ ...c, start }));

  const L = textFor(ctx);
  const assumptions = [esBaseAssumption(L)];
  if (
    pick(
      'ES-TRANSITIONAL-CARE-WORKER',
      'ES-TRANSITIONAL-HEALTH-EDUCATION',
    ).some((r) => r.status === 'PASS')
  ) {
    assumptions.push(
      L(
        '原文未规定同时符合过渡安排与标准路径时如何取舍；本结果取满足条件的最短路径，申请人可能可以选择更有利的安排，需咨询受监管顾问。',
        'The response does not say how to choose when someone qualifies for both a transitional arrangement and a standard pathway; this result takes the shortest pathway whose conditions are met. The applicant may be able to choose a more favourable arrangement and should seek regulated advice.',
      ),
    );
  }
  // Pre April 2024 cohort (p44): no change to the pathway, only a note.
  const skilledWorkerFrom = continuousRun(
    ctx.timeline,
    ctx.simulationDate,
    (e) => e.route === 'SKILLED_WORKER' && e.role === 'MAIN',
  ).episodes[0]?.validFrom;
  if (
    skilledWorkerFrom &&
    skilledWorkerFrom < v.preApril2024CohortBefore.value
  ) {
    assumptions.push(
      L(
        `自 ${skilledWorkerFrom} 起连续持 Skilled Worker 许可，早于 ${v.preApril2024CohortBefore.value}，属"2024 年 4 月前群体"：可按现有薪资条件续签至 2035 年（p44，具体日期未定，PD-040）；本工具按标准路径计算定居年限。`,
        `Continuous Skilled Worker permission since ${skilledWorkerFrom}, before ${v.preApril2024CohortBefore.value}, so in the “pre-April 2024 cohort”: permission can be extended under the existing salary requirements until 2035 (p44; exact dates not set, PD-040). This tool calculates the settlement pathway under the standard pathways.`,
      ),
    );
  }
  return finishEarnedSettlement(ctx, rules, candidates, assumptions, groups[0]);
}

function finishEarnedSettlement(
  ctx: RuleContext,
  rules: RuleOutcome[],
  candidates: Candidate[],
  assumptions: string[],
  routeGroup: RouteGroup | undefined,
): SettlementAssessment {
  const L = textFor(ctx);
  const decision = decide(candidates, ctx.simulationDate);
  // Not enough residence yet for the pathway the date was projected from:
  // ES-RESIDENCE shows that as the failing rule.
  const shown = showProjected(
    rules,
    'ES-RESIDENCE',
    decision,
    L(
      `${decision.pathwayYears} 年路径的居留还不够，${decision.earliestDate} 满 ${decision.pathwayYears} 年。`,
      ` Not enough residence yet for the ${decision.pathwayYears}-year pathway; ${decision.pathwayYears} years are completed on ${decision.earliestDate}.`,
    ),
  );
  return {
    ...toAssessment(decision, shown, assumptions, L),
    ...(rules.find((r) => r.id === 'ES-ROUTE-GROUP')?.status === 'PASS' && {
      routeGroup,
    }),
  };
}

const clBaseAssumption = (L: Lang) =>
  L(
    '现行规则只建模 Skilled Worker 主申请人及其 dependent partner / child（Appendix Skilled Worker、Appendix Children）与 Long Residence（Appendix Long Residence）；Part Suitability、担保方仍获批准（SW 24.1–24.2）等其他要求未建模。',
    'The current rules are modelled only for Skilled Worker main applicants and their dependent partners / children (Appendix Skilled Worker, Appendix Children) and for Long Residence (Appendix Long Residence); other requirements, such as Part Suitability and the sponsor still being approved (SW 24.1–24.2), are not modelled.',
  );

function assessCurrentLaw(ctx: RuleContext): SettlementAssessment {
  const L = textFor(ctx);
  const [scopeRule, ...others] = RULES['current-law-2026-11'];
  const scope = runRule(scopeRule, ctx);
  if (scope.status !== 'PASS') {
    return toAssessment(
      { outcome: 'INSUFFICIENT_INFORMATION' },
      [scope],
      [clBaseAssumption(L)],
      L,
    );
  }
  const sw = onSkilledWorker(ctx.timeline, ctx.simulationDate);
  // In scope as a partner or child only with the principal (CL-SCOPE).
  const partner =
    ctx.principal !== undefined &&
    onSkilledWorkerPartner(ctx.timeline, ctx.simulationDate);
  const child =
    ctx.principal !== undefined &&
    onSkilledWorkerChild(ctx.timeline, ctx.simulationDate);
  const runs = (id: string) =>
    id === 'CL-SW-PARTNER-5Y'
      ? partner
      : id === 'CL-SW-CHILD'
        ? child
        : !id.startsWith('CL-SW-') || sw;
  const rules = [
    scope,
    ...others
      .filter((rule) => runs(rule.meta.id))
      .map((rule) => runRule(rule, ctx)),
  ];
  const pick = (...ids: string[]) =>
    ids.map((id) => rules.find((r) => r.id === id)!);
  const candidates: Candidate[] = [
    ...(sw
      ? [
          {
            years: cl.values.skilledWorkerQualifyingYears.value,
            start: skilledWorkerStart(ctx),
            rules: pick(
              'CL-SW-SALARY',
              'CL-SW-GOING-RATE',
              'CL-ENGLISH',
              'CL-KOL',
            ),
          },
        ]
      : []),
    ...(partner
      ? [
          {
            years: cl.values.skilledWorkerQualifyingYears.value,
            start: skilledWorkerPartnerStart(ctx),
            rules: pick('CL-SW-PARTNER-5Y', 'CL-ENGLISH', 'CL-KOL'),
          },
        ]
      : []),
    ...(child
      ? [
          {
            years: cl.values.skilledWorkerQualifyingYears.value,
            start: skilledWorkerChildStart(ctx),
            rules: pick('CL-SW-CHILD', 'CL-ENGLISH', 'CL-KOL'),
          },
        ]
      : []),
    {
      years: cl.values.longResidenceQualifyingYears.value,
      start: longResidenceStart(ctx),
      rules: pick('CL-ENGLISH', 'CL-KOL'),
    },
  ];
  const decision = decide(candidates, ctx.simulationDate);
  const shown =
    (partner || child) &&
    decision.pathwayYears === cl.values.skilledWorkerQualifyingYears.value
      ? showProjected(
          rules,
          partner ? 'CL-SW-PARTNER-5Y' : 'CL-SW-CHILD',
          decision,
          L(
            `截至 ${ctx.simulationDate} 尚未满期。`,
            ` Not yet completed by ${ctx.simulationDate}.`,
          ),
        )
      : rules;
  const assumptions = [clBaseAssumption(L)];
  // Projected past the B2 date while assessed under the earlier requirement.
  const b2 = cl.values.skilledWorkerSettlementEnglish.value;
  if (
    decision.earliestDate &&
    ctx.simulationDate < b2.applicationsFrom &&
    decision.earliestDate >= b2.applicationsFrom
  ) {
    assumptions.push(
      L(
        `预计日期在 ${b2.applicationsFrom} 之后，届时定居须达到英语 ${b2.cefrLevel}（SW 22A.1、LR 13.1(b)）。`,
        `The projected date is on or after ${b2.applicationsFrom}, when settlement requires English at ${b2.cefrLevel} (SW 22A.1, LR 13.1(b)).`,
      ),
    );
  }
  return toAssessment(decision, shown, assumptions, L);
}

export function assess(id: RuleSetId, ctx: RuleContext): SettlementAssessment {
  return id === 'earned-settlement-2026-11'
    ? assessEarnedSettlement(ctx)
    : assessCurrentLaw(ctx);
}
