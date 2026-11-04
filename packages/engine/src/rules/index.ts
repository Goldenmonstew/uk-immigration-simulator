import type { RuleSetId } from '@uk-immigration/policy-data';
import type { Rule } from '../types';
import {
  clEnglish,
  clHkbnoResidence5Y,
  clKol,
  clLrResidence10Y,
  clScope,
  clSwChild,
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
import {
  esAsylumSupport,
  esProtectionContribution,
  esProtectionPathway,
} from './es-protection';
import { esResidence, esRouteGroup } from './es-residence';
import {
  esTransitionalCareWorker,
  esTransitionalHealthEducation,
} from './es-transitional';

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
    esProtectionPathway,
    esProtectionContribution,
    esAsylumSupport,
    esTransitionalCareWorker,
    esTransitionalHealthEducation,
    esPublicService,
    esDependantPathway,
  ],
  'current-law-2026-11': [
    clScope,
    clSwResidence5Y,
    clSwSalary,
    clSwGoingRate,
    clSwPartner5Y,
    clSwChild,
    clHkbnoResidence5Y,
    clEnglish,
    clKol,
    clLrResidence10Y,
  ],
};
