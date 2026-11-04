import type {
  CefrLevel,
  Route,
  RouteGroup,
  RuleSetId,
  SourceRef,
} from '@uk-immigration/policy-data';

/** YYYY-MM-DD */
export type IsoDate = string;

/** Language of the engine's user-facing texts. */
export type Locale = 'zh-CN' | 'en';

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
  /** Life in the UK test. Missing = not provided. */
  lifeInTheUk?: { passed: true } | { exempt: true };
  /**
   * Physical or mental condition that exempts the minimum earnings
   * requirement (SRC-001 p15). Age exemptions are derived from dateOfBirth.
   */
  earningsExemptHealth?: boolean;
  // Coarse fields that only need to trigger a short circuit or the 20-year
  // pathway; details go to regulated advice.
  criminalRecord: CriminalEvent[];
  immigrationBreaches: ImmigrationBreach[];
  /** Missing = not provided. */
  governmentDebt?: GovernmentDebt;
  /**
   * Principal timelines only: the principal already holds settlement (or
   * became a British citizen), granted on `date` from permission on `route`
   * (SW 39.1(b)). Missing = not settled.
   */
  settled?: { date: IsoDate; route: Route };
  /**
   * Repayment of asylum support costs (SRC-001 p8 note 1, p39, p47).
   * NOT_REQUIRED = never received asylum support, or not required to repay;
   * REPAID = repaid in full; ON_PLAN = keeping up with an agreed repayment
   * plan; OUTSTANDING = owed and neither repaid nor on a plan.
   * Read for PROTECTION_WORK_AND_STUDY and CORE_PROTECTION only.
   * Missing = not provided.
   */
  asylumSupportRepayment?: 'NOT_REQUIRED' | 'REPAID' | 'ON_PLAN' | 'OUTSTANDING';
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
  /**
   * DEPENDANT only: the principal is this person's partner, or their parent
   * (this person is a child dependant). Missing = not provided.
   */
  dependantOf?: 'PARTNER' | 'PARENT';
  /**
   * SKILLED_WORKER MAIN only: the sponsored job is on Appendix Immigration
   * Salary List (SW 24.3 rows B, D). Missing = no.
   */
  immigrationSalaryList?: boolean;
  /**
   * SAFE_AND_LEGAL only: the designated route the person was admitted on
   * (SRC-001 p37, p47). UK_RESETTLEMENT_SCHEME arrivals before 2027-04-06 are
   * Legacy Safe and Legal Routes, outside the framework (p26 note 13).
   * Missing = not provided.
   */
  resettlementScheme?: 'UK_RESETTLEMENT_SCHEME' | 'OTHER_DESIGNATED';
  /**
   * PROTECTION_WORK_AND_STUDY only: the sustained activity the person moved
   * into (SRC-001 p38, p47). Missing = not provided.
   */
  sustainedActivity?: 'WORK' | 'EDUCATION' | 'TRAINING';
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
  /**
   * ILLEGAL_ENTRY only: the person says Article 31 of the Refugee Convention
   * protects them, so the extra 10 years would not apply (SRC-001 p39, p48).
   * Missing = not claimed.
   */
  article31?: boolean;
}

export interface GovernmentDebt {
  outstanding: boolean;
}

export interface SimulationRequest {
  timeline: PersonTimeline;
  /** The date the person would apply. */
  simulationDate: IsoDate;
  /**
   * The principal's full timeline, when `timeline` is a dependant. The engine
   * assesses the principal first, on the same simulationDate, and settles the
   * dependant from that result. Missing = not provided.
   */
  principal?: PersonTimeline;
  /** Defaults to every rule set. */
  ruleSetIds?: RuleSetId[];
  /** Language of titles, explanations, assumptions and messages. Defaults to 'zh-CN'. */
  locale?: Locale;
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
  /** Chinese. */
  title: string;
  /** English; every rule has one (checked by tests). */
  titleEn?: string;
  /** At least one. */
  sources: SourceRef[];
  /** PD-xxx ids from docs/pending-details.md. */
  pendingDetails: string[];
}

export interface RuleContext {
  timeline: PersonTimeline;
  simulationDate: IsoDate;
  /** Dependants only: the principal's timeline and result on the same date. */
  principal?: { timeline: PersonTimeline; result: SimulationResult };
  /** From SimulationRequest.locale. Missing = 'zh-CN'. */
  locale?: Locale;
}

export interface RuleResult {
  status: 'PASS' | 'FAIL' | 'UNKNOWN';
  explanation: string;
  sources: SourceRef[];
  /**
   * UNKNOWN only: the PD-xxx ids that make it unknown. Absent on an UNKNOWN
   * = the user has not given enough input.
   */
  pendingDetails?: string[];
  /** Assumptions behind this result; also listed in SettlementAssessment.assumptions. */
  assumptions?: string[];
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

/** One rule's outcome for this person; the UI's "Why?" comes from these. */
export interface RuleOutcome extends RuleResult {
  id: RuleId;
  title: string;
}

export interface SettlementAssessment {
  outcome: DecisionOutcome;
  /** Earned Settlement rule sets only; current law has no route groups. */
  routeGroup?: RouteGroup;
  pathwayYears?: number;
  earliestDate?: IsoDate;
  /** Every rule that ran, in order, with explanation and sources. */
  rules: RuleOutcome[];
  assumptions: string[];
}

export interface SimulationResult {
  policyAsOf: IsoDate;
  byRuleSet: Partial<Record<RuleSetId, SettlementAssessment>>;
  shortCircuit?: {
    /**
     * PROTECTION: a dependant on a protection route (Chapter 7 does not
     * cover them); protection main applicants are assessed (contracts §11).
     */
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
