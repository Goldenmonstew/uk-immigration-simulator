# 引擎契约（Phase 0.2）

给 astra（`apps/web`）和 sol（fixtures 工具链）看的接口说明。类型的唯一真相是代码：`packages/engine/src/types.ts` 与 `packages/policy-data/src/{types,routes}.ts`；本文只讲关系和约定。

## 1. 数据流

```text
SimulationRequest { timeline: PersonTimeline, simulationDate, ruleSetIds? }
        │
        ▼  evaluate(request)          packages/engine
SimulationResult {
  policyAsOf,                          参数集核对日期，UI 必须显示
  byRuleSet: {                         一栏一个规则集
    'current-law-2026-11':       SettlementAssessment,
    'earned-settlement-2026-11': SettlementAssessment,
  },
  shortCircuit?                        高风险短路：有它时以它为准，各栏不作结论
}
```

- `PersonTimeline` 是时间线，不是现状快照：签证片段 `episodes`、缺席、按 tax year 的收入、福利片段、家庭关系、英语、Life in the UK、收入要求的健康豁免、犯罪 / 违规 / 政府债务。犯罪、违规、债务只有能触发短路或 20 年路径的粗粒度字段，细节交给受监管建议。
- 可选字段缺省 = 用户没提供（规则输出 `UNKNOWN`，结果多为 `INSUFFICIENT_INFORMATION`）；数组为空 = 用户声明没有。
- `RULE_SETS`（engine 导出）给每个规则集的 `kind`、`status`（三态）和来源。UI 用 `status` 给每栏打标签，比如"已公布、未生效"。

## 2. 输出：六态与规则清单

`SettlementAssessment`：`outcome`、`routeGroup?`（只有 Earned Settlement 有）、`pathwayYears?`、`earliestDate?`、`rules: RuleOutcome[]`（每条跑过的规则：`id`、`title`、`status: PASS | FAIL | UNKNOWN`、`explanation`、`sources`，按执行顺序；结果页的"为什么"就来自这里）、`assumptions`。满足 / 未满足 / 未知的规则 ID 从 `rules` 按 `status` 过滤即可，不单独存。`title`、`explanation`、`assumptions`、`shortCircuit.message` 都是面向用户的中文句子（法律术语保留英文），UI 直接显示；UI 自身的文案走 i18n。

| `DecisionOutcome` | 含义 |
|---|---|
| `LIKELY_ELIGIBLE` | 该规则集下全部规则 `PASS` |
| `LIKELY_NOT_ELIGIBLE` | 有规则 `FAIL`，且补充信息也改变不了 |
| `POTENTIALLY_ELIGIBLE` | 没有 `FAIL`；`UNKNOWN` 来自政府未定细节（`PD-xxx`），不是用户漏填 |
| `INSUFFICIENT_INFORMATION` | 用户输入不足以判断（当前 stub 一律返回这个） |
| `POLICY_NOT_YET_IN_FORCE` | 结论取决于尚未生效的规则何时、如何生效；触发条件由 Phase 1 过渡安排规则定义 |
| `REQUIRES_REGULATED_REVIEW` | 必须由受监管顾问判断 |

已公布未生效的规则集（`ANNOUNCED_NOT_IN_FORCE`）按"假设它在 `simulationDate` 适用"来评估；"未生效"由 `RuleSet.status` 表达，不塞进 `outcome`。

## 3. 规则 = TS 函数 + 元数据

```ts
interface Rule {
  meta: RuleMeta; // { id, ruleSetId, title, sources: SourceRef[], pendingDetails: string[] }
  evaluate: (ctx: RuleContext) => RuleResult; // { status: PASS | FAIL | UNKNOWN, explanation, sources }
}
```

- 为什么不用 DSL：连续居留窗口、路线切换重置（SRC-001 p25）、伴侣合并收入、豁免覆盖、前向推算，YAML 都表达不了，自研 DSL 本身就是一个项目。TS 函数可测、可调试，类型检查免费。
- 每条规则 `meta.sources` 至少一条 `SourceRef`；依赖政府未定细节时把 `PD-xxx` 写进 `pendingDetails`，结果给 `UNKNOWN`，不要猜。
- 规则 ID 用大写短横线，前缀标规则集：`ES-…`（Earned Settlement）、`CL-…`（现行法律）。fixture 的 `mustFail / mustUnknown` 引用的就是这些 ID。

## 4. 来源与参数

- `SourceRef { srcId, locator }`：`srcId` 是 `docs/SOURCES.md` 的 `SRC-xxx`；`locator` 对 PDF 用物理页码（`p16`，CP 1707 的物理页 = 印刷页 + 4），对 Rules 用段落号（`SW 4.2`）。
- 政策数字只出现在 `packages/policy-data/src/parameters/*.ts`，每个值都是 `{ value, sources }`。规则代码按名字引用，不写裸数字：

```ts
import { earnedSettlement2026_11 as es } from '@uk-immigration/policy-data';
const threshold = es.values.earningsThreshold5Year.value; // 50271, SRC-001 p15/p46
```

- 参数集用 `satisfies ParameterSet` 声明，名字保持字面量类型，拼错直接编译失败。门槛随税制变动时只改参数文件。
- 路线分类在 `policy-data/src/routes.ts`：`ROUTE_GROUPS` 把每条 `Route` 映射到一个或多个 `RouteGroup`（Skilled Worker 同时是 core 和 high talent），`ROUTE_GROUP_SOURCES` 给每组来源。表外路线填 `OTHER`。

## 5. Fixture 怎么写

一个 fixture 一个文件，放 `packages/policy-data/fixtures/`，在 `fixtures/index.ts` 的数组里登记：

```ts
import type { Fixture } from '../../engine/src/types';

export const esIndividualC: Fixture = {
  id: 'ES-OFFICIAL-INDIVIDUAL-C',
  title: 'Individual C: combined household income',
  source: { srcId: 'SRC-001', locator: 'p19' }, // 案例出处
  request: { simulationDate: '2026-11-04', timeline: { /* … */ } },
  expected: {
    ruleSetId: 'earned-settlement-2026-11', // 检查 byRuleSet 的哪一栏
    outcome: 'LIKELY_ELIGIBLE',
    pathwayYears: 10,
  },
};
```

- `expected` 只写原文能确定的东西。原文没给的日期、年限不写；为了把案例落成具体时间线而补的事实，在文件注释里说明。
- fixture 用相对路径 `import type` 引 engine 的类型：engine 依赖 policy-data，反向声明包依赖会成环（pnpm 会告警）。`import type` 编译后消失，没有运行时依赖。
- `packages/engine/test/evaluate.test.ts` 遍历全部 fixture。现在只检查返回形状；按 `expected` 断言是 Phase 1 的 `test.todo`。

## 6. 不在 MVP-0 契约里

Annex C 岗位表、难民路径细节、What-if、前向推算的假设结构，都等用到时再加字段，不提前预留。
