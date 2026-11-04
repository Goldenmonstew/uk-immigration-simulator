import { earnedSettlement2026_11 } from '@uk-immigration/policy-data';
import type { RuleSetId } from '@uk-immigration/policy-data';
import { runRule } from './rule';
import { RULES } from './rules';
import type {
  RuleContext,
  RuleSet,
  SettlementAssessment,
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

function shortCircuitOf({ timeline }: RuleContext): ShortCircuit | undefined {
  if (timeline.criminalRecord.length > 0) {
    return {
      reason: 'CRIMINALITY',
      message:
        '申报了犯罪记录。Earned Settlement 下成年人的任何犯罪记录都会导致拒绝定居，现行规则下也取决于 Part Suitability 的具体情形；本工具不作结论，请咨询受监管的移民顾问。',
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
    const assessment: SettlementAssessment = {
      outcome: shortCircuit
        ? 'REQUIRES_REGULATED_REVIEW'
        : 'INSUFFICIENT_INFORMATION',
      rules: RULES[id].map((rule) => runRule(rule, ctx)),
      assumptions: [],
    };
    byRuleSet[id] = assessment;
  }
  return {
    policyAsOf: earnedSettlement2026_11.asOf,
    byRuleSet,
    ...(shortCircuit && { shortCircuit }),
  };
}
