import type { RuleSetId } from '@uk-immigration/policy-data';
import type { Rule } from '../types';
import { esCriminality, esDebt, esEnglishB2, esKol } from './es-requirements';
import { esResidence, esRouteGroup } from './es-residence';

/** Every rule, by rule set, in evaluation order. */
export const RULES: Record<RuleSetId, Rule[]> = {
  'earned-settlement-2026-11': [
    esCriminality,
    esDebt,
    esEnglishB2,
    esKol,
    esRouteGroup,
    esResidence,
  ],
  'current-law-2026-11': [],
};
