// Shared primitives used by both policy-data and the engine. They live here
// (not in the engine) because the engine depends on this package, not the
// other way round.

/** A pointer into docs/SOURCES.md, e.g. { srcId: 'SRC-001', locator: 'p16' }. */
export interface SourceRef {
  srcId: string;
  /** Physical PDF page ("p16"), paragraph ("SW 4.2") or anchor. */
  locator: string;
}

export type RuleSetId = 'current-law-2026-11' | 'earned-settlement-2026-11';

export interface Parameter<T> {
  value: T;
  sources: SourceRef[];
}

/** "Meet the threshold in `required` of the `window` years before applying." */
export interface BestYears {
  required: number;
  window: number;
}

/** Declare parameter sets with `satisfies ParameterSet` so value names stay typed. */
export interface ParameterSet {
  ruleSetId: RuleSetId;
  /** Date (YYYY-MM-DD) the values were last checked against their sources. */
  asOf: string;
  values: Record<string, Parameter<number | BestYears>>;
}
