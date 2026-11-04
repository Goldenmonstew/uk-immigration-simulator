import type { RuleSetId } from '@uk-immigration/policy-data';
import type { Rule } from '../types';
import { esCriminality, esDebt } from './es-requirements';

/** Every rule, by rule set, in evaluation order. */
export const RULES: Record<RuleSetId, Rule[]> = {
  'earned-settlement-2026-11': [esCriminality, esDebt],
  'current-law-2026-11': [],
};
