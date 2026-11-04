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
  nationalPayScaleBelowRqf6Occupations,
  nationalPayScaleOccupations,
} from './data/skilled-occupations';
export type { GoingRate } from './data/skilled-occupations';
export { healthAndCareAsheOccupations } from './data/occupations';
export { healthEducationTransitionalExamples } from './data/occupations';
export { immigrationSalaryListOccupations } from './data/immigration-salary-list';
export type { ImmigrationSalaryListEntry } from './data/immigration-salary-list';
export {
  asylumSupportRepaymentNames,
  breachTypeNames,
  resettlementSchemeNames,
  routeGroupNames,
  routeNames,
  sustainedActivityNames,
} from './data/display-names';
export type { DisplayName } from './data/display-names';
