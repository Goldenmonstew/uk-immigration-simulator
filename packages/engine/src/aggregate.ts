import {
  currentLaw2026_11 as cl,
  earnedSettlement2026_11 as es,
} from '@uk-immigration/policy-data';
import type { RuleSetId } from '@uk-immigration/policy-data';
import { addYears } from './dates';
import { episodeOn } from './residence';
import { runRule } from './rule';
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
import { esQualifyingResidence, groupsOf } from './rules/es-residence';
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

function projection(projectedFrom: IsoDate | undefined): string[] {
  return projectedFrom
    ? [
        `最早可申请日期按"自 ${projectedFrom} 起持续居留、收入等状况不变、其余要求届时仍满足"推算，不是对未来的保证。`,
      ]
    : [];
}

function toAssessment(
  { projectedFrom, ...decision }: Decision,
  rules: RuleOutcome[],
  assumptions: string[],
): SettlementAssessment {
  return {
    ...decision,
    rules,
    assumptions: [
      ...new Set([
        ...assumptions,
        ...rules.flatMap((r) => r.assumptions ?? []),
        ...projection(projectedFrom),
      ]),
    ],
  };
}

const ES_BASE_ASSUMPTION =
  'Earned Settlement 已公布、尚未生效，按"假设在申请日适用"评估；规则依据为政府回应文件（SRC-001），不是已生效的 Immigration Rules（PD-001）。首批规则修改预计 2026 年 12 月起提交、2027 年 1 月生效，2027–2028 年继续修改（SRC-002 col 593；SRC-003 cols 1423–1424），具体生效日以届时的 Statement of Changes 为准（PD-003）。';

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
  const assumptions = [ES_BASE_ASSUMPTION];
  const current = episodeOn(ctx.timeline, ctx.simulationDate);
  if (!ctx.principal || !current?.dependantOf) {
    return toAssessment(
      { outcome: 'INSUFFICIENT_INFORMATION' },
      rules,
      assumptions,
    );
  }
  const pathway = rules.filter((r) => ES_DEPENDANT_PATHWAY.includes(r.id));
  const settlement = esDependantSettlement(ctx);
  if (!settlement) {
    return toAssessment(
      {
        outcome: pathway.some((r) => r.status === 'FAIL')
          ? 'LIKELY_NOT_ELIGIBLE'
          : 'INSUFFICIENT_INFORMATION',
      },
      rules,
      assumptions,
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
    `截至 ${ctx.simulationDate} 尚未满期。`,
  );
  const routeGroupPassed =
    rules.find((r) => r.id === 'ES-ROUTE-GROUP')?.status === 'PASS';
  return {
    ...toAssessment(decision, shown, assumptions),
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
  const rules = RULES['earned-settlement-2026-11']
    .filter((rule) => rule.meta.id !== 'ES-DEPENDANT-PATHWAY')
    .map((rule) => runRule(rule, ctx));
  const pick = (...ids: string[]) =>
    ids.map((id) => rules.find((r) => r.id === id)!);
  const mandatory = pick(...ES_MANDATORY);
  const standard = [...mandatory, ...pick('ES-BREACH', 'ES-PUBLIC-FUNDS')];
  const v = es.values;
  const fiveYearRoutes = [
    'ES-EARNINGS-5Y',
    'ES-BRITISH-CONNECTION',
    'ES-PUBLIC-SERVICE',
    'ES-TRANSITIONAL-CARE-WORKER',
  ];
  const start = esQualifyingResidence(ctx)?.start;
  const groups = current ? groupsOf(current.route) : [];
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

  const assumptions = [ES_BASE_ASSUMPTION];
  if (pick('ES-TRANSITIONAL-CARE-WORKER')[0].status === 'PASS') {
    assumptions.push(
      '原文未规定同时符合过渡安排与标准路径时如何取舍；本结果取满足条件的最短路径，申请人可能可以选择更有利的安排，需咨询受监管顾问。',
    );
  }
  const decision = decide(candidates, ctx.simulationDate);
  // Not enough residence yet for the pathway the date was projected from:
  // ES-RESIDENCE shows that as the failing rule.
  const shown = showProjected(
    rules,
    'ES-RESIDENCE',
    decision,
    `${decision.pathwayYears} 年路径的居留还不够，${decision.earliestDate} 满 ${decision.pathwayYears} 年。`,
  );
  return {
    ...toAssessment(decision, shown, assumptions),
    ...(pick('ES-ROUTE-GROUP')[0].status === 'PASS' && {
      routeGroup: groups[0],
    }),
  };
}

const CL_BASE_ASSUMPTION =
  '现行规则只建模 Skilled Worker 主申请人及其 dependent partner / child（Appendix Skilled Worker、Appendix Children）与 Long Residence（Appendix Long Residence）；Part Suitability、担保方仍获批准（SW 24.1–24.2）等其他要求未建模。';

function assessCurrentLaw(ctx: RuleContext): SettlementAssessment {
  const [scopeRule, ...others] = RULES['current-law-2026-11'];
  const scope = runRule(scopeRule, ctx);
  if (scope.status !== 'PASS') {
    return toAssessment(
      { outcome: 'INSUFFICIENT_INFORMATION' },
      [scope],
      [CL_BASE_ASSUMPTION],
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
          `截至 ${ctx.simulationDate} 尚未满期。`,
        )
      : rules;
  const assumptions = [CL_BASE_ASSUMPTION];
  // Projected past the B2 date while assessed under the earlier requirement.
  const b2 = cl.values.skilledWorkerSettlementEnglish.value;
  if (
    decision.earliestDate &&
    ctx.simulationDate < b2.applicationsFrom &&
    decision.earliestDate >= b2.applicationsFrom
  ) {
    assumptions.push(
      `预计日期在 ${b2.applicationsFrom} 之后，届时定居须达到英语 ${b2.cefrLevel}（SW 22A.1、LR 13.1(b)）。`,
    );
  }
  return toAssessment(decision, shown, assumptions);
}

export function assess(id: RuleSetId, ctx: RuleContext): SettlementAssessment {
  return id === 'earned-settlement-2026-11'
    ? assessEarnedSettlement(ctx)
    : assessCurrentLaw(ctx);
}
