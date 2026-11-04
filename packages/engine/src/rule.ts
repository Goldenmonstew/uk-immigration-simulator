import type { DisplayName, RuleSetId } from '@uk-immigration/policy-data';
import type {
  Locale,
  Rule,
  RuleContext,
  RuleMeta,
  RuleOutcome,
  RuleResult,
} from './types';

type Verdict = Omit<RuleResult, 'sources'> &
  Partial<Pick<RuleResult, 'sources'>>;

/** Picks the text for the locale, written side by side: L('中文', 'English'). */
export type Lang = (zh: string, en: string) => string;

export function textFor({ locale }: { locale?: Locale }): Lang {
  return (zh, en) => (locale === 'en' ? en : zh);
}

/** A display name (route, route group, breach type) in the locale. */
export function nameIn(L: Lang, name: DisplayName): string {
  return L(name['zh-CN'], name.en);
}

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

/** The same rule registered to another rule set: only `meta.ruleSetId` changes. */
export function withRuleSet(rule: Rule, ruleSetId: RuleSetId): Rule {
  return { ...rule, meta: { ...rule.meta, ruleSetId } };
}

export function runRule(rule: Rule, ctx: RuleContext): RuleOutcome {
  return {
    id: rule.meta.id,
    title: textFor(ctx)(rule.meta.title, rule.meta.titleEn!),
    ...rule.evaluate(ctx),
  };
}
