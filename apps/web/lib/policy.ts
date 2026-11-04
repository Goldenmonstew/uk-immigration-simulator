import { RULE_SETS, type RuleSet } from '@uk-immigration/engine';
import { PARAMETERS, RULE_SET_IDS } from '@uk-immigration/policy-data';

export const allRuleSets = RULE_SET_IDS.map((id) => RULE_SETS[id]);

const currentLaw = allRuleSets.find(
  (ruleSet) => ruleSet.kind === 'LAW' && ruleSet.status === 'CURRENT_LAW',
)!;
const nextVersion =
  allRuleSets
    .filter((ruleSet) => ruleSet.status === 'IN_FORCE_FUTURE_VERSION')
    .sort((a, b) => a.effectiveFrom.localeCompare(b.effectiveFrom))[0] ??
  [...allRuleSets].reverse().find((ruleSet) => ruleSet.kind === 'ANNOUNCED')!;

export const displayedRuleSets: [RuleSet, RuleSet] = [currentLaw, nextVersion];
export const policyAsOf = displayedRuleSets
  .map((ruleSet) => PARAMETERS[ruleSet.id].asOf)
  .sort()[1];
