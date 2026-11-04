import type { ParameterSet, RuleSetId } from '../types';
import { currentLaw2026_11 } from './current-law-2026-11';
import { earnedSettlement2026_11 } from './earned-settlement-2026-11';

/** Each rule set's parameter file, by the ids in RULE_SET_IDS (contracts §13.2). */
export const PARAMETERS: Record<RuleSetId, ParameterSet> = {
  'current-law-2026-11': currentLaw2026_11,
  'earned-settlement-2026-11': earnedSettlement2026_11,
};
