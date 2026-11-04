export const POLICY_DATA_VERSION = '0.0.0';

export type {
  BestYears,
  CefrLevel,
  DatedEnglishRequirement,
  Parameter,
  ParameterSet,
  RuleSetId,
  SourceRef,
} from './types';
export { ROUTE_GROUPS, ROUTE_GROUP_SOURCES } from './routes';
export type { Route, RouteGroup } from './routes';
export { currentLaw2026_11 } from './parameters/current-law-2026-11';
export { earnedSettlement2026_11 } from './parameters/earned-settlement-2026-11';
export { publicFundsBenefits } from './data/public-funds-benefits';
export type { Benefit } from './data/public-funds-benefits';
export { annexCOccupations, careWorkerOccupations } from './data/occupations';
export type { Occupation } from './data/occupations';
export { policyChangelog } from './data/policy-changelog';
export type { PolicyChange } from './data/policy-changelog';
export {
  goingRates,
  nationalPayScaleOccupations,
} from './data/skilled-occupations';
export type { GoingRate } from './data/skilled-occupations';
export { healthAndCareAsheOccupations } from './data/occupations';
export {
  healthEducationTransitionalExamples,
  nationalPayScaleBelowRqf6Occupations,
} from './data/occupations';
export {
  breachTypeNames,
  routeGroupNames,
  routeNames,
} from './data/display-names';
export type { DisplayName } from './data/display-names';
