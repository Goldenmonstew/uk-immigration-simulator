import { earnedSettlement2026_11 as es } from '@uk-immigration/policy-data';
import type { RuleSetId } from '@uk-immigration/policy-data';
import { addYears } from './dates';
import { episodeOn } from './residence';
import { runRule } from './rule';
import { RULES } from './rules';
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
>;

function statusOf(c: Candidate): RuleOutcome['status'] {
  if (c.rules.some((r) => r.status === 'FAIL')) return 'FAIL';
  if (c.rules.some((r) => r.status === 'UNKNOWN')) return 'UNKNOWN';
  return 'PASS';
}

const dueOf = (c: Candidate) => c.start && addYears(c.start, c.years);

/**
 * - Some candidate passes with enough residence → LIKELY_ELIGIBLE (shortest).
 * - Otherwise some candidate with enough residence (or unknown residence) is
 *   only UNKNOWN → POTENTIALLY_ELIGIBLE if every unknown is a pending detail,
 *   else INSUFFICIENT_INFORMATION.
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
    return {
      outcome: unknown.every((r) => r.pendingDetails?.length)
        ? 'POTENTIALLY_ELIGIBLE'
        : 'INSUFFICIENT_INFORMATION',
      pathwayYears: maybe[0].years,
    };
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
      }
    : { outcome: 'LIKELY_NOT_ELIGIBLE' };
}

function projection(decision: Decision, start: IsoDate | undefined): string[] {
  return decision.outcome === 'LIKELY_NOT_ELIGIBLE' && decision.earliestDate
    ? [
        `最早可申请日期按"自 ${start} 起持续居留、收入等状况不变、其余要求届时仍满足"推算，不是对未来的保证。`,
      ]
    : [];
}

function ruleAssumptions(rules: RuleOutcome[]): string[] {
  return rules.flatMap((r) => r.assumptions ?? []);
}

const ES_BASE_ASSUMPTION =
  'Earned Settlement 已公布、尚未生效，按"假设在申请日适用"评估；规则依据为政府回应文件（SRC-001），不是已生效的 Immigration Rules（PD-001）。首批规则修改预计 2026 年 12 月起提交、2027 年 1 月生效，2027–2028 年继续修改（SRC-002 col 593；SRC-003 cols 1423–1424），具体生效日以届时的 Statement of Changes 为准（PD-003）。';

function assessEarnedSettlement(ctx: RuleContext): SettlementAssessment {
  const rules = RULES['earned-settlement-2026-11'].map((rule) =>
    runRule(rule, ctx),
  );
  const pick = (...ids: string[]) =>
    ids.map((id) => rules.find((r) => r.id === id)!);
  const mandatory = pick(
    'ES-CRIMINALITY',
    'ES-DEBT',
    'ES-ENGLISH-B2',
    'ES-KOL',
    'ES-ROUTE-GROUP',
    'ES-RESIDENCE',
  );
  const standard = [...mandatory, ...pick('ES-BREACH', 'ES-PUBLIC-FUNDS')];
  const v = es.values;
  const fiveYearRoutes = [
    'ES-EARNINGS-5Y',
    'ES-BRITISH-CONNECTION',
    'ES-PUBLIC-SERVICE',
    'ES-TRANSITIONAL-CARE-WORKER',
  ];
  const start = esQualifyingResidence(ctx)?.start;
  const current = episodeOn(ctx.timeline, ctx.simulationDate);
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

  const decision = decide(candidates, ctx.simulationDate);
  const assumptions = [ES_BASE_ASSUMPTION, ...ruleAssumptions(rules)];
  if (pick('ES-TRANSITIONAL-CARE-WORKER')[0].status === 'PASS') {
    assumptions.push(
      '原文未规定同时符合过渡安排与标准路径时如何取舍；本结果取满足条件的最短路径，申请人可能可以选择更有利的安排，需咨询受监管顾问。',
    );
  }
  assumptions.push(...projection(decision, start));
  return {
    ...decision,
    ...(pick('ES-ROUTE-GROUP')[0].status === 'PASS' && {
      routeGroup: groups[0],
    }),
    rules,
    assumptions: [...new Set(assumptions)],
  };
}

function assessCurrentLaw(ctx: RuleContext): SettlementAssessment {
  return {
    outcome: 'INSUFFICIENT_INFORMATION',
    rules: RULES['current-law-2026-11'].map((rule) => runRule(rule, ctx)),
    assumptions: [],
  };
}

export function assess(id: RuleSetId, ctx: RuleContext): SettlementAssessment {
  return id === 'earned-settlement-2026-11'
    ? assessEarnedSettlement(ctx)
    : assessCurrentLaw(ctx);
}
