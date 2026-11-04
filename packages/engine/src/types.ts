import type {
  CefrLevel,
  Route,
  RouteGroup,
  RuleSetId,
  SourceRef,
} from '@uk-immigration/policy-data';

/** YYYY-MM-DD */
export type IsoDate = string;

// ---------- Input ----------

export interface PersonTimeline {
  dateOfBirth: IsoDate;
  /** ISO 3166-1 alpha-3, e.g. 'IND'. */
  nationality: string;
  episodes: ImmigrationEpisode[];
  absences: Absence[];
  incomeYears: IncomeYear[];
  benefits: BenefitEpisode[];
  relationships: Relationship[];
  /** Missing = not provided. */
  english?: EnglishEvidence;
  // Coarse fields that only need to trigger a short circuit or the 20-year
  // pathway; details go to regulated advice.
  criminalRecord: CriminalEvent[];
  immigrationBreaches: ImmigrationBreach[];
  /** Missing = not provided. */
  governmentDebt?: GovernmentDebt;
}

export interface ImmigrationEpisode {
  route: Route;
  role: 'MAIN' | 'DEPENDANT';
  validFrom: IsoDate;
  validTo: IsoDate;
  /** SOC 2020 code of the sponsored job, e.g. '6135' care worker. */
  socCode?: string;
  /** Sponsored salary in GBP per year. */
  salary?: number;
}

export interface Absence {
  from: IsoDate;
  to: IsoDate;
}

export interface IncomeYear {
  /** UK tax year, e.g. '2025-26'. */
  taxYear: string;
  /** GBP. Missing = unknown. */
  earnings?: number;
  /** GBP, for the household threshold. Missing = no partner income relied on. */
  partnerEarnings?: number;
}

export interface BenefitEpisode {
  /** Name as in the Home Office public funds guidance (SRC-006), e.g. 'UNIVERSAL_CREDIT'. */
  benefitType: string;
  from: IsoDate;
  /** Missing = ongoing. */
  to?: IsoDate;
}

export interface Relationship {
  type: 'PARTNER' | 'PARENT' | 'CHILD';
  otherPartyStatus: 'BRITISH_CITIZEN' | 'SETTLED' | 'OTHER';
}

export type EnglishEvidence = { cefrLevel: CefrLevel } | { exempt: true };

export interface CriminalEvent {
  date: IsoDate;
}

export interface ImmigrationBreach {
  type:
    | 'OVERSTAYING'
    | 'CONDITION_BREACH'
    | 'DECEPTION'
    | 'FRUSTRATING_CONTROLS'
    | 'ILLEGAL_ENTRY';
  date: IsoDate;
}

export interface GovernmentDebt {
  outstanding: boolean;
}

export interface SimulationRequest {
  timeline: PersonTimeline;
  /** The date the person would apply. */
  simulationDate: IsoDate;
  /** Defaults to every rule set. */
  ruleSetIds?: RuleSetId[];
}

// ---------- Rules ----------

export interface RuleSet {
  id: RuleSetId;
  kind: 'LAW' | 'ANNOUNCED';
  status: 'CURRENT_LAW' | 'ANNOUNCED_NOT_IN_FORCE' | 'IN_FORCE_FUTURE_VERSION';
  effectiveFrom?: IsoDate;
  effectiveTo?: IsoDate;
  supersedes?: RuleSetId;
  sources: SourceRef[];
}

/** e.g. 'ES-PUBLIC-FUNDS' */
export type RuleId = string;

export interface RuleMeta {
  id: RuleId;
  ruleSetId: RuleSetId;
  title: string;
  /** At least one. */
  sources: SourceRef[];
  /** PD-xxx ids from docs/pending-details.md. */
  pendingDetails: string[];
}

export interface RuleContext {
  timeline: PersonTimeline;
  simulationDate: IsoDate;
}

export interface RuleResult {
  status: 'PASS' | 'FAIL' | 'UNKNOWN';
  explanation: string;
  sources: SourceRef[];
}

export interface Rule {
  meta: RuleMeta;
  evaluate: (ctx: RuleContext) => RuleResult;
}

// ---------- Output ----------

export type DecisionOutcome =
  | 'LIKELY_ELIGIBLE'
  | 'LIKELY_NOT_ELIGIBLE'
  | 'POTENTIALLY_ELIGIBLE'
  | 'INSUFFICIENT_INFORMATION'
  | 'POLICY_NOT_YET_IN_FORCE'
  | 'REQUIRES_REGULATED_REVIEW';

export interface SettlementAssessment {
  outcome: DecisionOutcome;
  /** Earned Settlement rule sets only; current law has no route groups. */
  routeGroup?: RouteGroup;
  pathwayYears?: number;
  earliestDate?: IsoDate;
  satisfied: RuleId[];
  failed: RuleId[];
  unknown: RuleId[];
  assumptions: string[];
  sources: SourceRef[];
}

export interface SimulationResult {
  policyAsOf: IsoDate;
  byRuleSet: Partial<Record<RuleSetId, SettlementAssessment>>;
  shortCircuit?: {
    reason:
      'CRIMINALITY' | 'IMMIGRATION_BREACH' | 'PROTECTION' | 'OUTSIDE_FRAMEWORK';
    message: string;
  };
}

// ---------- Fixtures ----------

export interface Fixture {
  id: string;
  title: string;
  source: SourceRef;
  request: SimulationRequest;
  expected: {
    /** The column of SimulationResult.byRuleSet this fixture checks. */
    ruleSetId: RuleSetId;
    outcome: DecisionOutcome;
    pathwayYears?: number;
    earliestDate?: IsoDate;
    mustFail?: RuleId[];
    mustUnknown?: RuleId[];
  };
}
