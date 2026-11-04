import type { RuleSetId } from '@uk-immigration/policy-data';
import type { Rule } from '../types';
import {
  esBreach,
  esCriminality,
  esDebt,
  esEnglishB2,
  esKol,
} from './es-requirements';
import {
  esBritishConnection,
  esEarnings10Y,
  esEarnings3Y,
  esEarnings5Y,
  esPublicFunds,
  esPublicService,
} from './es-contribution';
import { esResidence, esRouteGroup } from './es-residence';
import { esTransitionalCareWorker } from './es-transitional';

/** Every rule, by rule set, in evaluation order. */
export const RULES: Record<RuleSetId, Rule[]> = {
  'earned-settlement-2026-11': [
    esCriminality,
    esDebt,
    esEnglishB2,
    esKol,
    esRouteGroup,
    esResidence,
    esEarnings3Y,
    esEarnings5Y,
    esEarnings10Y,
    esBritishConnection,
    esPublicFunds,
    esBreach,
    esTransitionalCareWorker,
    esPublicService,
  ],
  'current-law-2026-11': [],
};
