import { RULE_SETS } from '@uk-immigration/engine';
// Read existing policy metadata without changing workspace dependencies.
import { earnedSettlement2026_11 } from '../../../packages/policy-data/src';

export const policyAsOf = earnedSettlement2026_11.asOf;
export const ruleSets = Object.values(RULE_SETS);
