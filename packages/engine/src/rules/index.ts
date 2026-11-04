import type { RuleSetId } from '@uk-immigration/policy-data';
import type { Rule } from '../types';
import {
  clEnglish,
  clKol,
  clLrResidence10Y,
  clScope,
  clSwGoingRate,
  clSwPartner5Y,
  clSwResidence5Y,
  clSwSalary,
} from './current-law';
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
import { esDependantPathway } from './es-dependant';
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
    esDependantPathway,
  ],
  'current-law-2026-11': [
    clScope,
    clSwResidence5Y,
    clSwSalary,
    clSwGoingRate,
    clSwPartner5Y,
    clEnglish,
    clKol,
    clLrResidence10Y,
  ],
};
