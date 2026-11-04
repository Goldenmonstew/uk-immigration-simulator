import { writeFileSync } from 'node:fs';
import { fixtures } from '@uk-immigration/policy-data/fixtures';
import { expect, test } from 'vitest';
import { evaluate } from '../src/evaluate';
import { runRule } from '../src/rule';
import { RULES } from '../src/rules';
import type {
  RuleOutcome,
  SettlementAssessment,
  SimulationRequest,
  SimulationResult,
} from '../src/types';
import { SAMPLES, SIMULATION_DATE } from './helpers';

// Writes every user-facing text the sample contexts and fixtures reach, in
// Chinese and English side by side, for a read-through review. Run with
// `pnpm --filter @uk-immigration/engine export:wording`.

const OUT = new URL('../../../docs/review/wording-2026-11.md', import.meta.url);

type Pair = [zh: string, en: string];

/** Unique pairs per section, in first-seen order. */
const sections = new Map<string, Map<string, Pair>>();

function add(section: string, zh: string | undefined, en: string | undefined) {
  if (!zh && !en) return;
  const pairs = sections.get(section) ?? new Map<string, Pair>();
  sections.set(section, pairs);
  pairs.set(`${zh}\n${en}`, [zh ?? '', en ?? '']);
}

function addOutcome(zh: RuleOutcome, en: RuleOutcome) {
  expect(en.id).toBe(zh.id);
  add(zh.id, zh.explanation, en.explanation);
  const zhA = zh.assumptions ?? [];
  const enA = en.assumptions ?? [];
  expect(enA.length).toBe(zhA.length);
  zhA.forEach((a, i) => add(zh.id, a, enA[i]));
}

function ownAssumptions({ assumptions, rules }: SettlementAssessment) {
  return assumptions.filter(
    (a) => !rules.some((r) => r.assumptions?.includes(a)),
  );
}

function addResult(zh: SimulationResult, en: SimulationResult) {
  for (const [id, zhAssessment] of Object.entries(zh.byRuleSet)) {
    const enAssessment = en.byRuleSet[id as keyof typeof en.byRuleSet]!;
    zhAssessment.rules.forEach((r, i) => addOutcome(r, enAssessment.rules[i]));
    // Assessment assumptions also repeat the rules' own; keep the rest.
    const zhA = ownAssumptions(zhAssessment);
    const enA = ownAssumptions(enAssessment);
    expect(enA.length).toBe(zhA.length);
    zhA.forEach((a, i) => add(`aggregate:${id}`, a, enA[i]));
  }
  add('shortCircuit', zh.shortCircuit?.message, en.shortCircuit?.message);
}

function both(request: SimulationRequest) {
  addResult(
    evaluate({ ...request, locale: 'zh-CN' }),
    evaluate({ ...request, locale: 'en' }),
  );
}

test.skipIf(process.env.EXPORT_WORDING !== '1')('export wording', () => {
  for (const sample of Object.values(SAMPLES)) {
    const ctx = { timeline: sample, simulationDate: SIMULATION_DATE };
    for (const rule of Object.values(RULES).flat()) {
      addOutcome(
        runRule(rule, { ...ctx, locale: 'zh-CN' }),
        runRule(rule, { ...ctx, locale: 'en' }),
      );
    }
    both(ctx);
  }
  for (const fixture of fixtures) both(fixture.request);

  const lines = [
    '# 面向用户文案中英对照（2026-11）',
    '',
    '由 `pnpm --filter @uk-immigration/engine export:wording` 生成（`packages/engine/test/export-wording.test.ts`），请勿手改。',
    '',
    `收集范围：\`test/helpers.ts\` 的 ${Object.keys(SAMPLES).length} 个样例上下文（每条规则单独跑一遍 + 整体评估）与 ${fixtures.length} 个 fixtures，各按 zh-CN 与 en 运行一次；按规则 ID 分节，句子去重，按首次出现排序。样例跑不到的分支不在其中。`,
    '',
  ];
  const quote = (s: string) => s.replace(/\n/g, ' ');
  const pairList = (pairs: Map<string, Pair> | undefined) =>
    [...(pairs?.values() ?? [])].flatMap(([zh, en]) => [
      `- 中：${quote(zh)}`,
      `  - EN: ${quote(en)}`,
    ]);
  for (const [ruleSetId, rules] of Object.entries(RULES)) {
    lines.push(`## ${ruleSetId}`, '');
    for (const { meta } of rules) {
      lines.push(
        `### ${meta.id}：${meta.title} / ${meta.titleEn}`,
        '',
        `来源：${meta.sources.map((s) => `${s.srcId} ${s.locator}`).join('；')}`,
        '',
        `待定细节：${meta.pendingDetails.length > 0 ? meta.pendingDetails.join('、') : '无'}`,
        '',
        ...pairList(sections.get(meta.id)),
        '',
      );
    }
    lines.push(
      `### 聚合假设 / Assessment assumptions（${ruleSetId}）`,
      '',
      ...pairList(sections.get(`aggregate:${ruleSetId}`)),
      '',
    );
  }
  lines.push(
    '## 短路提示 / Short-circuit messages',
    '',
    ...pairList(sections.get('shortCircuit')),
    '',
  );
  writeFileSync(OUT, lines.join('\n'));
});
