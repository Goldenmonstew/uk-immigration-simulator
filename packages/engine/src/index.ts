export const ENGINE_VERSION = '0.0.0';

export function getEngineVersion(): string {
  return ENGINE_VERSION;
}

export type * from './types';
export type {
  CefrLevel,
  Route,
  RouteGroup,
  RuleSetId,
  SourceRef,
} from '@uk-immigration/policy-data';
export { evaluate, RULE_SETS } from './evaluate';
export { RULES } from './rules';
export { withRuleSet } from './rule';
export { hasSettledSkilledWorkerPartner } from './rules/current-law/shared';
export { skilledWorkerApplication } from './rules/current-law/sw-application';
export type {
  SkilledWorkerApplication,
  SkilledWorkerApplicationResult,
} from './rules/current-law/sw-application';
export {
  familyFiveYearStart,
  familyIncomeThreshold,
  onProtection,
} from './rules/current-law';
export {
  AU_PERMANENT_SUBCLASSES,
  AU_TEMPORARY_SUBCLASSES,
  evaluateAustralia,
} from './australia';
export { NZ_RESIDENT_CATEGORIES, evaluateNewZealand } from './new-zealand';
export type {
  NzPathway,
  NzPathwayId,
  NzRequest,
  NzResidentCategory,
  NzResult,
  NzTrip,
} from './new-zealand';
export type {
  PilotCheck,
  PilotPathway,
  PilotResult,
  PilotStatus,
} from './pilot';
export type {
  AuCheck,
  AuPathway,
  AuPathwayId,
  AuRequest,
  AuResult,
  AuStatus,
  AuSubclass,
  AuTrip,
  AuVisa,
} from './australia';
