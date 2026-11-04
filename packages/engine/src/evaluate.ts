import { earnedSettlement2026_11 } from '@uk-immigration/policy-data';
import type { RuleSetId } from '@uk-immigration/policy-data';
import { assess } from './aggregate';
import { adultIllegalEntry } from './rules/es-requirements';
import { esCurrentGroup } from './rules/es-residence';
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

function shortCircuitOf({
  timeline,
  simulationDate,
}: RuleContext): ShortCircuit | undefined {
  if (timeline.criminalRecord.length > 0) {
    return {
      reason: 'CRIMINALITY',
      message:
        '申报了犯罪记录。Earned Settlement 下成年人的任何犯罪记录都会导致拒绝定居，现行规则下也取决于 Part Suitability 的具体情形；本工具不作结论，请咨询受监管的移民顾问。',
    };
  }
  if (adultIllegalEntry(timeline)) {
    return {
      reason: 'IMMIGRATION_BREACH',
      message:
        '申报了成年后的非法入境。Earned Settlement 对非法入境的后果前后说法不一（20 年路径或额外加 10 年，PD-044），现行规则下也可能涉及拒绝理由；本工具不作结论，请咨询受监管的移民顾问。',
    };
  }
  const group = esCurrentGroup(timeline, simulationDate);
  if (group === 'PROTECTION') {
    return {
      reason: 'PROTECTION',
      message:
        '当前是保护类路线（难民、Safe and Legal 等），Earned Settlement 对其另设路径（SRC-001 Chapter 7），本工具尚未建模，请咨询受监管的移民顾问。',
    };
  }
  if (group === 'OUTSIDE_FRAMEWORK') {
    return {
      reason: 'OUTSIDE_FRAMEWORK',
      message:
        '当前路线不在 Earned Settlement 框架内，继续按该群体现有的定居安排（SRC-001 p25–p26）；但强化的犯罪记录与 B2 英语要求仍适用，除非有现有豁免或保障。',
    };
  }
  return undefined;
}

export function evaluate(request: SimulationRequest): SimulationResult {
  const ids = request.ruleSetIds ?? (Object.keys(RULE_SETS) as RuleSetId[]);
  const ctx: RuleContext = {
    timeline: request.timeline,
    simulationDate: request.simulationDate,
  };
  const shortCircuit = shortCircuitOf(ctx);
  const byRuleSet: SimulationResult['byRuleSet'] = {};
  for (const id of ids) {
    // Protection and outside-framework routes only stop the Earned Settlement
    // column; current law is still assessed.
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
