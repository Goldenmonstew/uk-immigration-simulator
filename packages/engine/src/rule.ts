import type {
  Rule,
  RuleContext,
  RuleMeta,
  RuleOutcome,
  RuleResult,
} from './types';

type Verdict = Omit<RuleResult, 'sources'> &
  Partial<Pick<RuleResult, 'sources'>>;

/** A rule whose results cite `meta.sources` unless the check says otherwise. */
export function defineRule(
  meta: RuleMeta,
  check: (ctx: RuleContext) => Verdict,
): Rule {
  return {
    meta,
    evaluate: (ctx) => ({ sources: meta.sources, ...check(ctx) }),
  };
}

export function runRule(rule: Rule, ctx: RuleContext): RuleOutcome {
  return { id: rule.meta.id, title: rule.meta.title, ...rule.evaluate(ctx) };
}
