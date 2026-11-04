import { earnedSettlement2026_11 } from '@uk-immigration/policy-data';
import type { RuleSetId } from '@uk-immigration/policy-data';
import type {
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

// Stub: no rules yet (Phase 1).
export function evaluate(request: SimulationRequest): SimulationResult {
  const ids = request.ruleSetIds ?? (Object.keys(RULE_SETS) as RuleSetId[]);
  const byRuleSet: SimulationResult['byRuleSet'] = {};
  for (const id of ids) {
    const assessment: SettlementAssessment = {
      outcome: 'INSUFFICIENT_INFORMATION',
      satisfied: [],
      failed: [],
      unknown: [],
      assumptions: [],
      sources: [],
    };
    byRuleSet[id] = assessment;
  }
  return { policyAsOf: earnedSettlement2026_11.asOf, byRuleSet };
}
