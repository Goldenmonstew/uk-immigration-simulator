import { earnedSettlement2026_11 } from '@uk-immigration/policy-data';
import type { RuleSetId } from '@uk-immigration/policy-data';
import { assess } from './aggregate';
import { adultIllegalEntry } from './rules/es-requirements';
import { episodeOn } from './residence';
import { esCurrentGroup } from './rules/es-residence';
import { textFor } from './rule';
import type {
  RuleContext,
  RuleSet,
  SimulationRequest,
  SimulationResult,
} from './types';

export const RULE_SETS: Record<RuleSetId, RuleSet> = {
  'current-law-2026-11': {
    id: 'current-law-2026-11',
    kind: 'LAW',
    status: 'CURRENT_LAW',
    sources: [{ srcId: 'SRC-004', locator: 'Appendix Skilled Worker' }],
  },
  'earned-settlement-2026-11': {
    id: 'earned-settlement-2026-11',
    kind: 'ANNOUNCED',
    status: 'ANNOUNCED_NOT_IN_FORCE',
    sources: [{ srcId: 'SRC-001', locator: 'p46' }],
  },
};

type ShortCircuit = NonNullable<SimulationResult['shortCircuit']>;

function shortCircuitOf(ctx: RuleContext): ShortCircuit | undefined {
  const { timeline, simulationDate } = ctx;
  const L = textFor(ctx);
  if (timeline.criminalRecord.length > 0) {
    return {
      reason: 'CRIMINALITY',
      message: L(
        '申报了犯罪记录。Earned Settlement 下成年人的任何犯罪记录都会导致拒绝定居，现行规则下也取决于 Part Suitability 的具体情形；本工具不作结论，请咨询受监管的移民顾问。',
        'A criminal record has been declared. Under Earned Settlement any criminal record as an adult leads to refusal of settlement; under the current rules the outcome depends on the circumstances under Part Suitability. This tool does not reach a conclusion: please seek advice from a regulated immigration adviser.',
      ),
    };
  }
  const group = esCurrentGroup(timeline, simulationDate);
  // On a protection route illegal entry adds 10 years (Table 2, p48) and is
  // assessed; elsewhere its consequence is inconsistent (PD-044).
  if (adultIllegalEntry(timeline) && group !== 'PROTECTION') {
    return {
      reason: 'IMMIGRATION_BREACH',
      message: L(
        '申报了成年后的非法入境。Earned Settlement 对非法入境的后果前后说法不一（20 年路径或额外加 10 年，PD-044），现行规则下也可能涉及拒绝理由；本工具不作结论，请咨询受监管的移民顾问。',
        'Illegal entry as an adult has been declared. Earned Settlement is inconsistent about its consequences (the 20-year pathway, or an extra 10 years; PD-044), and under the current rules it may also be a ground for refusal. This tool does not reach a conclusion: please seek advice from a regulated immigration adviser.',
      ),
    };
  }
  // Chapter 7 and Table 2 do not cover refugees' dependants (PD-067).
  if (
    group === 'PROTECTION' &&
    episodeOn(timeline, simulationDate)?.role === 'DEPENDANT'
  ) {
    return {
      reason: 'PROTECTION',
      message: L(
        '当前以 dependant 身份持保护类路线许可。Earned Settlement 的难民定居路径（SRC-001 Chapter 7、Table 2）没有说明难民的 dependant 如何定居（PD-067），本工具不作结论，请咨询受监管的移民顾问。',
        'The current permission is on a protection route as a dependant. The Earned Settlement refugee pathways (SRC-001 Chapter 7, Table 2) do not say how refugees’ dependants settle (PD-067). This tool does not reach a conclusion: please seek advice from a regulated immigration adviser.',
      ),
    };
  }
  if (group === 'OUTSIDE_FRAMEWORK') {
    return {
      reason: 'OUTSIDE_FRAMEWORK',
      message: L(
        '当前路线不在 Earned Settlement 框架内，继续按该群体现有的定居安排（SRC-001 p25–p26）；但强化的犯罪记录与 B2 英语要求仍适用，除非有现有豁免或保障。',
        'The current route is outside the Earned Settlement framework and keeps the existing settlement arrangements for that group (SRC-001 p25–p26). The strengthened criminality and B2 English requirements still apply, unless an existing exemption or protection applies.',
      ),
    };
  }
  return undefined;
}

export function evaluate(request: SimulationRequest): SimulationResult {
  const ids = request.ruleSetIds ?? (Object.keys(RULE_SETS) as RuleSetId[]);
  const { timeline, simulationDate, principal, locale } = request;
  const ctx: RuleContext = {
    timeline,
    simulationDate,
    locale,
    // The principal is assessed as a main applicant: their own principal, if
    // any, is not followed.
    ...(principal &&
      episodeOn(timeline, simulationDate)?.role === 'DEPENDANT' && {
        principal: {
          timeline: principal,
          result: evaluate({
            timeline: principal,
            simulationDate,
            ruleSetIds: ids,
            locale,
          }),
        },
      }),
  };
  // The dependant's own short circuit first, then the principal's.
  const fromPrincipal = ctx.principal?.result.shortCircuit;
  const shortCircuit =
    shortCircuitOf(ctx) ??
    (fromPrincipal && {
      ...fromPrincipal,
      message: textFor(ctx)(
        `主申请人：${fromPrincipal.message}`,
        `Principal applicant: ${fromPrincipal.message}`,
      ),
    });
  const byRuleSet: SimulationResult['byRuleSet'] = {};
  for (const id of ids) {
    // Protection dependants and outside-framework routes only stop the Earned
    // Settlement column; current law is still assessed.
    const stopped =
      shortCircuit &&
      (id === 'earned-settlement-2026-11' ||
        shortCircuit.reason === 'CRIMINALITY' ||
        shortCircuit.reason === 'IMMIGRATION_BREACH');
    const assessment = assess(id, ctx);
    if (stopped) {
      delete assessment.pathwayYears;
      delete assessment.earliestDate;
      assessment.outcome = 'REQUIRES_REGULATED_REVIEW';
    }
    byRuleSet[id] = assessment;
  }
  return {
    policyAsOf: earnedSettlement2026_11.asOf,
    byRuleSet,
    ...(shortCircuit && { shortCircuit }),
  };
}
