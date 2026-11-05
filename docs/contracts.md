# 引擎契约（Phase 0.2；Phase 1.1 补充规则、数据表与路径聚合；Phase 2.2 补充家庭）

给 astra（`apps/web`）和 sol（fixtures 工具链）看的接口说明。类型的唯一真相是代码：`packages/engine/src/types.ts` 与 `packages/policy-data/src/{types,routes}.ts`；本文只讲关系和约定。

## 1. 数据流

```text
SimulationRequest { timeline: PersonTimeline, simulationDate, ruleSetIds?, principal?, locale? }
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

`SettlementAssessment`：`outcome`、`routeGroup?`（只有 Earned Settlement 有）、`pathwayYears?`、`earliestDate?`、`rules: RuleOutcome[]`（每条跑过的规则：`id`、`title`、`status: PASS | FAIL | UNKNOWN`、`explanation`、`sources`，按执行顺序；结果页的"为什么"就来自这里）、`assumptions`。满足 / 未满足 / 未知的规则 ID 从 `rules` 按 `status` 过滤即可，不单独存。`title`、`explanation`、`assumptions`、`shortCircuit.message` 都是面向用户的句子，语言由 `SimulationRequest.locale` 决定（缺省中文，见 §10），UI 直接显示；UI 自身的文案走 i18n。

| `DecisionOutcome` | 含义 |
|---|---|
| `LIKELY_ELIGIBLE` | 该规则集下全部规则 `PASS` |
| `LIKELY_NOT_ELIGIBLE` | 有规则 `FAIL`，且补充信息也改变不了 |
| `POTENTIALLY_ELIGIBLE` | 没有 `FAIL`；`UNKNOWN` 来自政府未定细节（`PD-xxx`），不是用户漏填 |
| `INSUFFICIENT_INFORMATION` | 用户输入不足以判断（含现行规则未建模的路线，见 §7） |
| `POLICY_NOT_YET_IN_FORCE` | 结论取决于尚未生效的规则何时、如何生效；只在规则集有已知 `effectiveFrom` 且晚于模拟日、或结论取决于未定生效日的过渡情形时使用（MVP-0 尚无触发情形） |
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
- engine 导出 `RULES: Record<RuleSetId, Rule[]>`：每个规则集的全部规则，按执行顺序。测试与 UI 可以用它列出规则的 `meta`（标题、来源、PD）。规则代码在 `packages/engine/src/rules/`。
- `RuleResult` 有两个可选字段（1.1 新增）：`pendingDetails`——只用于 `UNKNOWN`，列出导致未知的 `PD-xxx`；`UNKNOWN` 不带它表示用户没填够。`assumptions`——该结果依赖的假设，会汇总进 `SettlementAssessment.assumptions`（去重）。

## 4. 来源与参数

- `SourceRef { srcId, locator }`：`srcId` 是 `docs/SOURCES.md` 的 `SRC-xxx`；`locator` 对 PDF 用物理页码（`p16`，CP 1707 的物理页 = 印刷页 + 4），对 Rules 用段落号（`SW 4.2`）。
- 政策数字只出现在 `packages/policy-data/src/parameters/*.ts`，每个值都是 `{ value, sources }`。规则代码按名字引用，不写裸数字：

```ts
import { earnedSettlement2026_11 as es } from '@uk-immigration/policy-data';
const threshold = es.values.earningsThreshold5Year.value; // 50271, SRC-001 p15/p46
```

- 参数集用 `satisfies ParameterSet` 声明，名字保持字面量类型，拼错直接编译失败。门槛随税制变动时只改参数文件。
- 路线分类在 `policy-data/src/routes.ts`：`ROUTE_GROUPS` 把每条 `Route` 映射到一个或多个 `RouteGroup`（Skilled Worker 同时是 core 和 high talent），`ROUTE_GROUP_SOURCES` 给每组来源。表外路线填 `OTHER`。
- 数据表在 `policy-data/src/data/`，从包入口导出：
  - `publicFundsBenefits`：`{ publicFunds, notPublicFunds }`，每项 `{ benefitType, name, source }`，来自 SRC-006 各小节。**`benefitType` 命名约定**：SRC-006 上的英文福利名，去掉撇号与括号说明，转大写蛇形（`Universal Credit` → `UNIVERSAL_CREDIT`，`Carer’s Allowance` → `CARERS_ALLOWANCE`，`Statutory Maternity Pay` → `STATUTORY_MATERNITY_PAY`）；原文一条列了两种福利的拆成两项（`CHILD_TAX_CREDIT`、`WORKING_TAX_CREDIT`），英格兰 / 北爱尔兰重复列出的 Social Fund 支付只保留一项；`Job Seekers` / `Jobseeker’s` 统一为 `JOBSEEKERS`，`&` 写作 `AND`；按法条描述的长条目用简称（`COUNCIL_TAX_REDUCTION`、`LOCAL_AUTHORITY_DISCRETIONARY_PAYMENT`、`SCOTTISH_WELFARE_FUND_PAYMENT` 等）。取值以数据表为准。`BenefitEpisode.benefitType` 填这里的值；不在两张表里的值，`ES-PUBLIC-FUNDS` 给 `UNKNOWN`（PD-013）。问卷下拉直接用 `name` 显示。
  - `annexCOccupations`、`careWorkerOccupations`：`{ sources, occupations: { socCode, title }[] }`。Annex C 原文只有职业名，SOC 2020 代码按同名职业取自 Appendix Skilled Worker SW 16.1。`ImmigrationEpisode.socCode` 填 4 位 SOC 2020 代码字符串。

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
- `packages/engine/test/evaluate.test.ts` 遍历全部 fixture，断言 `expected` 的 outcome、`pathwayYears`、`earliestDate`（有则查）、`mustFail` / `mustUnknown`。

## 6. 不在 MVP-0 契约里

What-if、前向推算的结构化假设，都等用到时再加字段，不提前预留。难民路径见 §11（Phase 3.4）。

## 7. 路径聚合（`packages/engine/src/aggregate.ts`）

规则只回答"这一条是否满足"，聚合把它们组合成结论。每个规则集先列出**候选路径**：一组必须全部 `PASS` 的规则 + 年限 + 居留起点。

- Earned Settlement（SRC-001 p46 Table 1）：强制要求 = `ES-CRIMINALITY`、`ES-DEBT`、`ES-ENGLISH-B2`、`ES-KOL`、`ES-ROUTE-GROUP`、`ES-RESIDENCE`，以及 `ES-ASYLUM-SUPPORT`（p8 注 1 列为所有申请人的最低要求；4.5 起非保护类路线与 dependant 也运行，保护类路线按 §11.4）。
  - 3 年：强制 + `ES-BREACH` + `ES-PUBLIC-FUNDS` + `ES-EARNINGS-3Y`
  - 5 年：强制 + `ES-BREACH` + `ES-PUBLIC-FUNDS` + 以下任一：`ES-EARNINGS-5Y`、`ES-BRITISH-CONNECTION`、`ES-PUBLIC-SERVICE`、`ES-TRANSITIONAL-CARE-WORKER`、`ES-TRANSITIONAL-HEALTH-EDUCATION`（2.5）
  - 10 年：强制 + `ES-BREACH` + `ES-PUBLIC-FUNDS` + `ES-EARNINGS-10Y`
  - 20 年：强制 + `ES-EARNINGS-10Y`（用过 public funds 或有 breach 时只剩这条）
  - 当前为 Family and Private Life 时只有 10 / 20 年（p23）。居留起点都是 `ES-RESIDENCE` 的合格期起点。
- 现行法律：`CL-SCOPE` 不通过时只输出这一条、结论 `INSUFFICIENT_INFORMATION`。否则候选为 Skilled Worker 5 年（`CL-SW-SALARY`、`CL-SW-GOING-RATE`（2.5）、`CL-ENGLISH`、`CL-KOL`，起点为连续 Skilled Worker 段）与 Long Residence 10 年（`CL-ENGLISH`、`CL-KOL`，起点为连续合法居留段；英语按 LR 13.1 的等级单独核对，与当前路线的等级不同时只改该候选里的状态，`rules[]` 仍只显示按当前路线的一条，差异写进 `assumptions`（4.5））；居留规则 `CL-SW-RESIDENCE-5Y` / `CL-LR-RESIDENCE-10Y` 只用于展示，年限由起点计算。

判定（两个规则集同一套）：

1. 有候选全部 `PASS` 且起点 + 年限 ≤ 申请日 → `LIKELY_ELIGIBLE`，`pathwayYears` 取最短，`earliestDate` = 申请日。
2. 否则，有候选居留已满（或起点未知）且只有 `UNKNOWN`、没有 `FAIL` → 这些 `UNKNOWN` 都带 `pendingDetails` 时 `POTENTIALLY_ELIGIBLE`，`pathwayYears` 取该候选；否则 `INSUFFICIENT_INFORMATION`，不给 `pathwayYears`。两种都不给 `earliestDate`。
3. 否则 `LIKELY_NOT_ELIGIBLE`；若还有未 `FAIL` 的候选，取起点 + 年限最早的一条给出 `pathwayYears` 与 `earliestDate`，并加假设"持续居留、收入等状况不变"。强制要求 `FAIL` 时所有候选都失败，不给年限与日期。

短路（`SimulationResult.shortCircuit`）：`CRIMINALITY`（任何犯罪记录）与 `IMMIGRATION_BREACH`（成年后非法入境）让两栏都是 `REQUIRES_REGULATED_REVIEW`；`PROTECTION` 与 `OUTSIDE_FRAMEWORK`（当前路线）只让 Earned Settlement 一栏是 `REQUIRES_REGULATED_REVIEW`，现行法律照常评估。短路时规则照常运行、出现在 `rules` 里，但该栏不给 `pathwayYears` / `earliestDate`。保护类路线的短路自 Phase 3.4 起按 §11.5。

## 8. 家庭（Phase 2.2）

dependant 不单独挣定居，而是随主申请人定居（SRC-001 Ch.5，p28–p31；现行法律 Appendix Skilled Worker SW 38–SW 46）。所以 dependant 的请求要带上主申请人。

```text
SimulationRequest {
  timeline,                 dependant 本人（当前 episode role = DEPENDANT，dependantOf 指明身份）
  principal?,               主申请人的完整 PersonTimeline
  simulationDate,
}
        │
        ▼  evaluate(request)
  1. 先按同一个 simulationDate 评估 principal（作为主申请人；principal 自己的 principal 不存在，不递归）
  2. 再评估 dependant：路径年限、定居时点、routeGroup 取自 principal 那一栏的结果
```

字段：

- `SimulationRequest.principal?: PersonTimeline`：主申请人的完整时间线，和普通申请人填法一样。不另设"主申请人摘要"：用户通常不知道主申请人的路径年限，那正是引擎要算的。缺省时 dependant 仍是 `INSUFFICIENT_INFORMATION`，解释说"填写主申请人信息后可判断"。当前 episode 不是 `DEPENDANT` 时 `principal` 被忽略。
- `ImmigrationEpisode.dependantOf?: 'PARTNER' | 'PARENT'`：只对 `role = 'DEPENDANT'` 有意义。`PARTNER` = 主申请人是此人的伴侣；`PARENT` = 主申请人是此人的父 / 母（此人是 child dependant）。缺省 → 分支未知，dependant 路径规则 `UNKNOWN`。`role` 的取值不变。
- 参数 `independentAge`（25，SRC-001 p30）；18 岁沿用 `adultAge`。
- `SettlementAssessment` 不加字段：dependant 的依据写在 `rules[]`（`ES-DEPENDANT-PATHWAY`、`CL-SW-PARTNER-5Y`）的解释与 `assumptions` 里，主申请人自己的规则清单不并入 dependant 的结果。

Earned Settlement 栏的 dependant 候选路径（只有一条）：

- 规则 = 强制要求（`ES-CRIMINALITY`、`ES-DEBT`、`ES-ENGLISH-B2`、`ES-KOL`、`ES-ROUTE-GROUP`、`ES-RESIDENCE`）+ `ES-EARNINGS-10Y`（最低收入）+ `ES-DEPENDANT-PATHWAY`。按身份的豁免写在各规则里（见下表），豁免时规则 `PASS` 并引 p29 / p30。dependant 的 `rules` 另外只列 `ES-PUBLIC-FUNDS` 与 `ES-BREACH`（成年 dependant 本人 `FAIL` → `ES-DEPENDANT-PATHWAY` 为 `UNKNOWN`，PD-062）；3 / 5 年收入、British connection、公共服务与过渡安排规则不对 dependant 运行。
- 年限 = 主申请人该栏的 `pathwayYears`；`routeGroup` = 主申请人的。
- `earliestDate` = max(主申请人的定居时点, dependant 自己的 dependant 居留起点 + 年限)。同时到达 → 与主申请人同日；后到的伴侣 → 晚到多久就晚多久（p29、p31 Individual B）。
- 主申请人该栏：`LIKELY_ELIGIBLE` 或带日期的 `LIKELY_NOT_ELIGIBLE` → 按上面取年限与时点；`POTENTIALLY_ELIGIBLE` → 同样取年限，`ES-DEPENDANT-PATHWAY` 为 `UNKNOWN` 并带上主申请人的 `pendingDetails`（dependant 也是 `POTENTIALLY_ELIGIBLE`）；强制要求不满足、没有日期的 `LIKELY_NOT_ELIGIBLE` → `FAIL`；`INSUFFICIENT_INFORMATION`、`REQUIRES_REGULATED_REVIEW` → `UNKNOWN`（不带 PD）。
- 居留不够时（主申请人尚未满期，或伴侣后到）由 `ES-DEPENDANT-PATHWAY` 显示为 `FAIL` 并写明可申请日期（主申请人用 `ES-RESIDENCE`）。
- 规则通过 `RuleContext.principal`（`{ timeline, result }`，`evaluate` 先算好）读取主申请人的时间线与结果；只在当前 episode 为 `DEPENDANT` 且请求带 `principal` 时设置。

| 身份（按年龄与 `dependantOf`） | 适用的强制要求 | 收入 | 来源 |
|---|---|---|---|
| 伴侣 | criminality、debt、B2、KOL | 最低收入（个人或家庭口径，假设，见 PD） | p29、p46 |
| 子女，18 岁以下 | 只有 criminality（与 suitability） | 豁免 | p29 |
| 子女，18–24 岁 | criminality、debt、B2、KOL | 豁免 | p29–p30 |
| 子女，家庭首次符合资格日（主申请人合格期起点 + 其年限）已满 25 岁 | 不能作为 dependant 定居，`ES-DEPENDANT-PATHWAY` 为 `FAIL`，须独立符合资格或转入自己的路线 | — | p30、p31 Individual E；PD-060 |

年龄分支：是否满 18 岁按申请日（`simulationDate`）；25 岁按家庭首次符合资格日（PD-060）。

现行法律栏：Skilled Worker 主申请人的 dependent partner（当前 episode `SKILLED_WORKER` + `DEPENDANT` + `dependantOf = 'PARTNER'`，且有 `principal`）进入 `CL-SCOPE`。候选路径 = `CL-SW-PARTNER-5Y` + `CL-ENGLISH` + `CL-KOL`，5 年，起点 = max(伴侣连续 dependant 许可的起点, 主申请人连续 Skilled Worker 期的起点)，即不早于主申请人满 5 年（SW 39.1(a)、SW 42.1、SW 43.1）；没有薪资要求；英语 2027-03-26 前 B1、此后 B2（SW 44.1），KOL 按 SW 45.1。主申请人该栏没有 Skilled Worker 5 年路径（`pathwayYears` 不是 5）时：其结论为 `LIKELY_NOT_ELIGIBLE` → `FAIL`，否则 `UNKNOWN`。Long Residence 候选照常。dependent child 与主申请人已定居（SW 39.1(b)）见 §9（Phase 2.5）。

短路：先看 dependant 本人的时间线（本人有犯罪记录照常短路，优先）；本人没有短路而主申请人有时，把主申请人的 `shortCircuit` 复制到 dependant 的 `SimulationResult`，`reason` 不变，`message` 前加"主申请人："。栏目影响沿用 §7：`CRIMINALITY` / `IMMIGRATION_BREACH` 两栏都是 `REQUIRES_REGULATED_REVIEW`，`PROTECTION` / `OUTSIDE_FRAMEWORK` 只影响 Earned Settlement 栏。

## 9. 现行法律补全与剩余过渡安排（Phase 2.5）

只新增可选字段，已有字段不变。

字段：

- `ImmigrationEpisode.immigrationSalaryList?: boolean`：只对 `SKILLED_WORKER` + `MAIN` 有意义，担保岗位在 Appendix Immigration Salary List 上（SW 24.3 rows B、D 看"最近一次许可"，即申请日当天那段）。缺省 = 否，不输出 `UNKNOWN`，规则在 `assumptions` 里写"未申报 Immigration Salary List，按不在清单处理"。（3.1 起缺省时按 `socCode` 从 SRC-019 推导；4.5 起只计 `removalDate` 不早于申请日的条目，同一 SOC 多条时任一条仍有效即算在清单上。）
- `PersonTimeline.settled?: { date: IsoDate; route: Route }`：填在**主申请人**的时间线上，表示主申请人已经定居（或已入籍），`date` 为获批日，`route` 为获批时所持许可的路线（SW 39.1(b)）。申请人本人时间线上的 `settled` 不被规则读取。缺省 = 未定居。
- 不新增 `newEntrant`：SW 24.3 row C / D 引用的 SW 4.2(b) 不是"新入行"定义，而是 options F–J 的适用条件——(i) Health and Care ASHE salary job（SW A1.1），或 (ii) 2024-04-04 前按旧规则获批 Skilled Worker、此后连续持有、申请日早于 2030-04-04。两者都能从现有字段推出（`socCode` + `episodes`），见下。"新入行"只出现在 options E / J（入境 / 续签积分），SW 24.3 不用。

参数（`currentLaw2026_11.values`）：

| 名称 | 值 | 来源 |
|---|---|---|
| `skilledWorkerGeneralSalaryThreshold`（已有） | 41,700 | SW 24.3 row A |
| `skilledWorkerSettlementSalaryRowB` | 33,400 | SW 24.3 row B |
| `skilledWorkerSettlementSalaryRowC` | 31,300 | SW 24.3 row C |
| `skilledWorkerSettlementSalaryRowD` | 25,000 | SW 24.3 row D |
| `skilledWorkerPre2024RulesBefore` | 2024-04-04 | SW 4.2(b)(ii)；SRC-017 Table 2a |
| `skilledWorkerPre2024ApplicationsBefore` | 2030-04-04 | SW 4.2(b)(ii) |
| `skilledWorkerPre2025RulesBefore` | 2025-07-22 | SW 6.1(d)；SRC-017 Table 1a / 2aa |

`earnedSettlement2026_11.values.preApril2024CohortBefore` = 2024-04-04（SRC-001 p44 + SW 4.2(b)(ii)；p44 本身没给日期，见 PD-040）。

新数据表（`policy-data/src/data/occupations.ts`，形状同 `careWorkerOccupations`）：

- `healthAndCareAsheOccupations`：SW A1.1 列出的 10 个 SOC 2020 代码（1171、1231、1232、2113、2114、3111、3211、3212、6135、6136）。
- `nationalPayScaleBelowRqf6Occupations`：SRC-017 Table 3a 的 8 个 RQF 3–5 国家薪级职业（3213、3219、3231、6112、6113、6131、6132、6133）。
- `healthEducationTransitionalExamples`：p44 点名的 nursing auxiliaries（6131）与 teaching assistants（6112），SOC 取自 Table 3a 同名行。

`CL-SW-SALARY` 选行（SW 24.3，按 E → D → C → B → A 的排除顺序；"SW 4.2(b)" 下称 4.2(b)）：

| 行 | 条件（当前 Skilled Worker 段） | general salary | going rate 查表顺序 |
|---|---|---|---|
| E | Tier 2 (General) STEM 遗留，不建模（假设说明） | — | — |
| D | `socCode` 在 `nationalPayScaleOccupations`（Table 3），或 `immigrationSalaryList` 且满足 4.2(b) | 25,000 | Table 3 职业 → `UNKNOWN`（Table 4 / 5 未提取，新 PD）；其余 `2` → `2aa` → `2a` |
| C | 满足 4.2(b)：`socCode` 在 `healthAndCareAsheOccupations`（雇主条件 SW A1.1(a)–(f) 按满足假设），或连续 Skilled Worker 段起点 < 2024-04-04 且申请日 < 2030-04-04 | 31,300 | `2` → `2aa` → `2a` |
| B | `immigrationSalaryList` | 33,400 | `1` → `1a` |
| A | 其余 | 41,700 | `1` → `1a` |

- `CL-SW-SALARY` 只比 general salary，解释写明用的是哪一行；`CL-SW-GOING-RATE` 按同一行查 going rate，两条都 `PASS` 才满足 SW 24.3。两条都加进 Skilled Worker 5 年候选路径。
- 查表用 `goingRates.rows` 里 `table` 与 `socCode` 都匹配的一行。附加表的适用条件从时间线判断，不另设 PD：`1a` / `2aa` 要求连续 Skilled Worker 段起点 < 2025-07-22（SW 6.1(d)），`2a` 要求起点 < 2024-04-04（SW 6.1(f)；"同一 sponsor"不核对，假设说明）。SOC 只在附加表里、但起点不满足其日期 → `UNKNOWN`（输入与可担保职业矛盾）。`socCode` 缺省或不在相应任何表 → `UNKNOWN`。
- going rate 按每周 37.5 小时、不按实际工时折算（SW 14.4，假设说明）；薪资按用户填的 `salary`，SW 14.1–14.3 的口径不核对。

`CL-SW-RESIDENCE-5Y` 合并（SW 21.2）：连续期可由以下 `MAIN` 许可任意组合构成：`SKILLED_WORKER`、`GLOBAL_TALENT`、`INNOVATOR_FOUNDER`、`MINISTER_OF_RELIGION`、`INTERNATIONAL_SPORTSPERSON`、`SCALE_UP`。`Route` 里没有 Representative of an Overseas Business 与 Tier 1，不计（假设说明）；SW 21.2(i) 不建模。当前段仍须是 `SKILLED_WORKER`（`CL-SCOPE` 不变）。Skilled Worker 5 年候选的起点即这个合并起点；伴侣路径的"主申请人起点"随之改用合并起点。4.2(b)(ii) 与附加表的日期条件仍只看纯 Skilled Worker 段。

dependent child（`CL-SW-CHILD`，SRC-018 Appendix Children）：当前 episode `SKILLED_WORKER` + `DEPENDANT` + `dependantOf = 'PARENT'` 且有 `principal` 时进入 `CL-SCOPE`。候选 = `CL-SW-CHILD` + `CL-ENGLISH` + `CL-KOL`，与主申请人同时定居（SW 39.1(a)），日期 = 主申请人 Skilled Worker 5 年候选的日期；子女本人没有居留年限要求。`CL-SW-CHILD` 判断 SW 41A.1：age（CHI 1.1 / 1.2：申请日未满 18，或当前许可就是 dependent child 许可）、independent life（CHI 1A.1）、care（CHI 2.1，未满 18 时）。英语 SW 44.1、KOL SW 45.1（18 岁以上），未满 18 沿用 `settlementMinorAge` 豁免。

主申请人已定居（SW 39.1(b)）：`principal.settled` 存在、`route = 'SKILLED_WORKER'`，且 dependant 在 `settled.date` 当天持有 `SKILLED_WORKER` + `DEPENDANT` 许可、`dependantOf` 与当前一致时：

- 伴侣：起点 = 伴侣自己的连续 dependant 起点（不再受主申请人起点约束），满 5 年（SW 42.1）。
- 子女：无居留年限要求，申请日即可（仍须满足 `CL-SW-CHILD`）。
- `settled.route` 不是 `SKILLED_WORKER`，或 dependant 当时没有相应许可 → `FAIL`（不能按 SW 39.1(b)）。
- Earned Settlement 栏：原文没写已定居主申请人的 dependant 如何定居 → `ES-DEPENDANT-PATHWAY` 为 `UNKNOWN`（PD-063），不给年限与日期；dependant 没有其他 `FAIL`、也没有不带 PD 的 `UNKNOWN` 时结论为 `POTENTIALLY_ELIGIBLE`。
- `settled.date` 晚于申请日时视为尚未定居（按 SW 39.1(a) 判断）。SW 39.1(b)(ii)（在英出生、主申请人定居前出生的子女）不建模。

Earned Settlement 栏新规则 `ES-TRANSITIONAL-HEALTH-EDUCATION`（SRC-001 p44，§2.2）加入 5 年候选的"以下任一"：当前 `SKILLED_WORKER` 且 `socCode` 在 `healthEducationTransitionalExamples`、该职业连续段起点 < `whitePaperPublished` → `PASS`；首段入境早于截止点但该职业段晚于截止点 → `UNKNOWN`（PD-039）；`socCode` 在 `nationalPayScaleBelowRqf6Occupations` 但不在示例 → `UNKNOWN`（PD-038）；其余 `FAIL`。强制要求照常适用（假设说明）。

§2.3 前 2024-04 群体：不改年限，也不是规则；Earned Settlement 栏在当前 `SKILLED_WORKER` 段且连续 Skilled Worker 段起点 < `preApril2024CohortBefore` 时，在 `assumptions` 加一句"可按旧薪资条件续签至 2035（p44），本工具按标准路径计算定居年限"。

## 10. 双语输出（Phase 2.9）

只新增可选字段，已有字段与中文输出不变。

字段：

- `SimulationRequest.locale?: Locale`，`Locale = 'zh-CN' | 'en'`；缺省 = `'zh-CN'`。只影响文案，不影响任何判断、年限、日期或 `sources`。
- `RuleContext.locale?: Locale`：`evaluate` 从请求带入；评估 dependant 时，主申请人的嵌套 `evaluate` 用同一 locale。缺省 = `'zh-CN'`（直接构造 `RuleContext` 的测试不必填）。
- `RuleMeta.titleEn?: string`：英文标题。`title` 仍是中文、不改。类型上可选，但每条规则都填，由测试保证；UI 列规则（政策页）时按界面语言取 `title` 或 `titleEn`。
- `PolicyChange.titleEn?` / `summaryEn?`（`policy-data`）：变更日志五条都填，`title` / `summary` 仍是中文。

数据流：

```text
SimulationRequest.locale ──► RuleContext.locale ──► 规则 check：explanation、assumptions
                                     │             runRule：RuleOutcome.title = locale === 'en' ? meta.titleEn : meta.title
                                     │             aggregate：基础假设、投影说明、showProjected 附加句
                                     └──────────► evaluate：shortCircuit.message（dependant 的"主申请人："前缀 → "Principal applicant: "）
```

约束：

- 机制保持最直接：每次评估从 `ctx.locale` 得到一个选择函数，中英文并排写在同一处；不引入 i18n 库、消息目录或占位符模板。数字、日期、金额照常从参数插值。
- 英文文案：法律术语保留原文（Skilled Worker、public funds、settlement、Life in the UK），引用用原文段号（SW 24.3、p29），金额 `£50,271`，日期 ISO（YYYY-MM-DD）。
- `SettlementAssessment.assumptions` 的去重逻辑不变（按所选语言的字符串去重）。
- `RuleOutcome.id`、`status`、`sources`、`pendingDetails` 与 locale 无关；fixtures 用默认 locale，结论不变。

## 11. 难民路径（Phase 3.4）

依据 SRC-001 Chapter 7（p36–p40，案例 p40）与 Table 2（p47–p48）。只新增可选字段，已有字段与取值不变；`Route`、`RouteGroup`、`role` 不改。`SettlementAssessment` 不加字段：依据写在 `rules[]` 的解释与 `assumptions` 里。现行法律栏不变（`CL-SCOPE` 仍只建模 Skilled Worker 与 Long Residence）。

### 11.1 字段

| 字段 | 取值 | 含义 | 何时读取 |
|---|---|---|---|
| `ImmigrationEpisode.resettlementScheme?` | `'UK_RESETTLEMENT_SCHEME'` \| `'OTHER_DESIGNATED'` | 经哪条 designated Safe and Legal Route 入境（p37、p47）。`OTHER_DESIGNATED` = 原文"specified resettlement and sponsorship routes"，清单未公布（PD-033），按用户申报处理 | 申请日当天的 `SAFE_AND_LEGAL` 片段 |
| `ImmigrationEpisode.sustainedActivity?` | `'WORK'` \| `'EDUCATION'` \| `'TRAINING'` | 转入 Protection Work and Study 所依据的持续活动（p38、p47） | 申请日当天的 `PROTECTION_WORK_AND_STUDY` 片段 |
| `ImmigrationBreach.article31?` | `boolean` | 只对 `ILLEGAL_ENTRY` 有意义：用户声称受 Refugee Convention Article 31 保护（p39、p48）。缺省 = 未声称 | 保护类路线上的成年后非法入境 |
| `PersonTimeline.asylumSupportRepayment?` | `'NOT_REQUIRED'` \| `'REPAID'` \| `'ON_PLAN'` \| `'OUTSTANDING'` | asylum support 偿还（p8 注 1、p39、p47）。`NOT_REQUIRED` = 未领取或无需偿还；`REPAID` = 已全额偿还；`ON_PLAN` = 按约定还款计划履行中；`OUTSTANDING` = 欠款且未还、未按计划 | 当前为 `PROTECTION_WORK_AND_STUDY` 或 `CORE_PROTECTION`；4.5 起有值时任何路线都读取（Safe and Legal 除外，§11.3） |

- 缺省一律 = 用户没提供：读取它的规则输出不带 PD 的 `UNKNOWN`（结论多为 `INSUFFICIENT_INFORMATION`），`article31` 除外（缺省 = 未声称，按加 10 年处理）。
- 显示名（`policy-data` 导出）：`resettlementSchemeNames`、`sustainedActivityNames`、`asylumSupportRepaymentNames`，形状同 `breachTypeNames`。
- 推出前的时间：Core Protection / Protection Work and Study 尚未推出（PD-034）。用户按"获保护之日起为 `CORE_PROTECTION`、转入工作 / 学习之日起为 `PROTECTION_WORK_AND_STUDY`"填写片段；现有难民许可（2026-03-02 前申请庇护者，p38 注 14）也按 `CORE_PROTECTION` 自获保护之日起填。引擎按片段起止日计算，见 11.3。

### 11.2 参数（`earnedSettlement2026_11.values`）

| 名称 | 值 | 来源（SRC-001 物理页） |
|---|---|---|
| `protectionPathwayYearsSafeAndLegal` | 5 | p37、p40、p47 |
| `protectionPathwayYearsWorkAndStudy` | 10 | p38、p40、p47 |
| `protectionPathwayYearsCore` | 20 | p38、p40、p47 |
| `illegalEntryAdditionalYears` | 10 | p38、p39、p48 |
| `protectionWorkQualifyingYears` | 3 | p38、p47 |
| `ukrsEnglishLevel` | `'A2'` | p21 注 7–8、p37、p39、p47 |
| `legacySafeAndLegalArrivalsBefore` | `'2027-04-06'` | p26 注 13 |

- 工作者的年收入门槛复用 `earningsThresholdMinimum`（£12,571），来源补 p38、p47。
- 用过 public funds 或有其他 breach 时的 20 年兜底复用 `pathwayYears20`，来源补 p39（"a settlement pathway less than 20 years"）。

### 11.3 规则

保护类路线的 Earned Settlement 栏只运行：强制要求（`ES-CRIMINALITY`、`ES-DEBT`、`ES-ENGLISH-B2`、`ES-KOL`、`ES-ROUTE-GROUP`、`ES-RESIDENCE`）+ `ES-BREACH` + `ES-PUBLIC-FUNDS` + 下面三条新规则（按路线取用）；`ES-EARNINGS-*`、`ES-BRITISH-CONNECTION`、`ES-PUBLIC-SERVICE`、过渡安排规则不运行、不出现在 `rules[]`。非保护类路线不运行 `ES-PROTECTION-PATHWAY` 与 `ES-PROTECTION-CONTRIBUTION`；`ES-ASYLUM-SUPPORT` 自 4.5 起作为强制要求运行（§7）。

| 规则 | 适用 | 判断 |
|---|---|---|
| `ES-PROTECTION-PATHWAY`（新） | 三条保护类路线 | 给出基础年限：Safe and Legal 5、PWS 10、Core Protection 20。成年后 `ILLEGAL_ENTRY`（`article31 !== true`）→ 年限 +10，解释点名 Table 2 对应行（p48）。全部成年后非法入境都 `article31: true` → `UNKNOWN`（PD-032），解释同时给出不适用 Article 31 时的年限与日期。Safe and Legal：`resettlementScheme` 缺省 → `UNKNOWN`；`OTHER_DESIGNATED` → `PASS` + 假设"指定路线清单未公布，按你的申报处理；若为 Community Sponsorship、Mandate Resettlement Scheme 或其前身则属 Legacy Safe and Legal Routes（框架外）"（PD-033）。PWS / Core Protection：`PASS` + 假设"两条路线尚未推出，按所填片段日期计算；推出前已有时间是否及如何计入未定"（PD-029、PD-034、PD-043）。 |
| `ES-PROTECTION-CONTRIBUTION`（新） | 仅 PWS | `sustainedActivity = 'WORK'`：数 PWS 合格期（`ES-RESIDENCE` 的起点）内**完整的** tax year——起点在合格期起点当天或之后、且在申请日所在 tax year 之前结束；起点所在的那个 tax year 不算（除非合格期恰从 4 月 6 日开始），因为年收入无法拆出转入前的部分。年收入 ≥ £12,571 的年数 ≥ 3 → `PASS`；不足但合格期尚未满 10 年（+10）→ `UNKNOWN`（PD-030，解释写"已有 n 年达标，需 3 年"）；已满仍不足 → `FAIL`。观察窗口原文未定义，按"合格期内任意 3 年"建模并在假设里声明（PD-030）。`EDUCATION` / `TRAINING` → `UNKNOWN`（PD-030）；缺省 → `UNKNOWN`（不带 PD）。 |
| `ES-ASYLUM-SUPPORT`（新） | PWS、Core Protection；4.5 起也用于非保护类路线 | `NOT_REQUIRED` / `REPAID` / `ON_PLAN` → `PASS`；`OUTSTANDING` → `FAIL`（任何路线）；缺省 → PWS / Core Protection 为 `UNKNOWN`（不带 PD），其他路线 `PASS`，解释"未申报，按未领取 asylum support 处理"（p8 注 1）。Safe and Legal 不运行（Table 2 未列，PD-068）。 |
| `ES-ENGLISH-B2`（改） | — | `resettlementScheme = 'UK_RESETTLEMENT_SCHEME'` 的 Safe and Legal → A2（`ukrsEnglishLevel`）；其他一律 B2。推导出的 Legacy UKRS → `UNKNOWN`（PD-045）。解释写明适用等级。规则 ID 不变，标题改为等级中性（"定居英语要求（B2；UKRS 难民 A2）"）。 |
| `ES-KOL`（改） | — | UKRS 的 Safe and Legal → `PASS`（当前免考），假设"A2 版考试推出后可能改变"（PD-021）；其他不变。 |
| `ES-PUBLIC-FUNDS`（改） | — | Safe and Legal → `PASS`（豁免，p37、p47）；Core Protection → `PASS`（20 年路径本身不要求，p39）；PWS → 照常评估，用过则只剩 20 年兜底（p39）。弱势群体保障与可不计入的福利未定 → 假设里提 PD-031。 |
| `ES-BREACH`（改） | — | 当前为保护类路线时，`ILLEGAL_ENTRY` 不计入（由 `ES-PROTECTION-PATHWAY` 的 +10 处理）；其他类型的成年后 breach 照常 `FAIL`、进 20 年兜底（p13、p46 "apply to all"；Table 2 未提，新 PD）。非保护类路线不变（成年后非法入境仍 `UNKNOWN` + PD-044 并短路）。 |
| `ES-ROUTE-GROUP`（改） | — | 保护类路线 → `PASS`，解释写明属保护类分组、走 Table 2 路径。UKRS 且连续 `SAFE_AND_LEGAL` 段的起点早于 `legacySafeAndLegalArrivalsBefore` → 推导为 Legacy Safe and Legal Routes，按 `LEGACY_SAFE_AND_LEGAL` 处理：`UNKNOWN`（框架外）+ 短路 `OUTSIDE_FRAMEWORK`，假设提 PD-045；`rules[]` 与其他框架外路线相同。 |
| `ES-RESIDENCE`（改） | — | 保护类路线的合格期 = **同一条**保护类路线的连续片段（原来按"保护类"整体连续）：Core Protection → PWS 在转入日重新起算（p38；p40 Individual B）；当前为 Core Protection 而之前紧接的是 PWS（回切）→ `UNKNOWN`（原文未提，新 PD）。起点仍经 `restartAfterAbsences`。 |

### 11.4 候选路径（§7 的补充）

M = 强制要求；P = `ES-PROTECTION-PATHWAY`；+10 = 成年后非法入境且未声称 Article 31。起点都是 `ES-RESIDENCE` 的合格期起点。

| 当前路线 | 候选 | 年限 |
|---|---|---|
| `SAFE_AND_LEGAL` | M + P + `ES-BREACH` | 5（+10） |
| | M + P（有其他 breach 时，p13） | 20（+10） |
| `PROTECTION_WORK_AND_STUDY` | M + P + `ES-BREACH` + `ES-PUBLIC-FUNDS` + `ES-PROTECTION-CONTRIBUTION` + `ES-ASYLUM-SUPPORT` | 10（+10） |
| | M + P + `ES-ASYLUM-SUPPORT`（用过 public funds 或有其他 breach 时，p39） | 20（+10） |
| `CORE_PROTECTION` | M + P + `ES-ASYLUM-SUPPORT` | 20（+10） |

- Article 31 声称时 P 为 `UNKNOWN`，候选年限按基础年限（不加 10）：未满期 → `LIKELY_NOT_ELIGIBLE` 投影到基础年限的日期；满期 → `POTENTIALLY_ELIGIBLE`。加 10 年的读法写在 P 的解释里。
- 判定（§7 的 1–3 条）不变；`routeGroup` 输出 `PROTECTION`。

### 11.5 短路（替换 §7 中关于 `PROTECTION` 与非法入境的部分）

- `IMMIGRATION_BREACH`（成年后非法入境）：只在申请日当天的路线**不是**保护类时触发（非保护类路线维持 PD-044 的"不作结论"，两栏都 `REQUIRES_REGULATED_REVIEW`）。保护类路线上不短路，两栏照常评估。
- `PROTECTION`：取值保留，只在申请日当天是保护类路线上的 `DEPENDANT` 时触发（Chapter 7 与 Table 2 未提难民的 dependant，新 PD）；只影响 Earned Settlement 栏。保护类主申请人不再短路。
- `OUTSIDE_FRAMEWORK`：不变，另含 11.3 推导出的 Legacy UKRS；其短路文案不说"B2 英语要求仍适用"，改为写明框架外一般 B2 与第 7 章 UKRS A2 不一致（PD-045）（4.5）。
- `CRIMINALITY`：不变，优先。

### 11.6 给 3.5（问卷与结果页）

- 当前片段为 `SAFE_AND_LEGAL` 时问 `resettlementScheme`；为 `PROTECTION_WORK_AND_STUDY` 时问 `sustainedActivity`（`WORK` 时收入按 tax year 照常填 `incomeYears`）；当前为 PWS 或 Core Protection 时问 `asylumSupportRepayment`；违规里选了 `ILLEGAL_ENTRY` 时问 `article31`。
- "寻求受监管建议"提示：Earned Settlement 栏 `routeGroup === 'PROTECTION'`（或当前片段路线属 `PROTECTION` 分组）时显示，文案由 web 自己的 i18n 提供；引擎另在 `assumptions` 里带一句同义提示。
- `ES-ENGLISH-B2` 的 ID 与标题不变，实际等级（A2 / B2）看解释。

### 11.7 新增 PD

PD-064（PWS → Core Protection 回切）、PD-065（保护类路线上的其他 breach）、PD-066（PWS 用过 public funds 后 20 年的起点）、PD-067（难民的 dependant）、PD-068（Safe and Legal 的 asylum support），见 `docs/pending-details.md` 第六节。

### 11.8 fixtures

`packages/policy-data/fixtures/` 新增 p40 Individual A–D 四个（日期为补充事实，文件头注明）：A（UKRS 2027-06-01 抵达、A2、用过 Universal Credit；2032-06-01 → `LIKELY_ELIGIBLE`、5 年）；B（2027-03-01 Core Protection → 2028-03-01 PWS；2030-01-01 → `LIKELY_NOT_ELIGIBLE`、10 年、2038-03-01）；C（同 B，成年后 2026-08-10 非法入境 → 20 年、2048-03-01）；D（同 C 但一直 Core Protection → 30 年、2057-03-01）。原有 fixture 的状态 / 年限 / 日期不变。

## 12. 现行法律栏：HK BN(O)、Global Talent 与家庭伴侣（Phase 4.2）

把 Hong Kong BN(O) 与 Global Talent 两条路线的**主申请人**纳入现行法律栏（12.1–12.7）；家庭伴侣主申请人见 12.8（范围变更后追加）。只新增可选字段，已有字段与取值不变；`SettlementAssessment` 不加字段。Earned Settlement 栏不变（HK BN(O) 仍 `OUTSIDE_FRAMEWORK` 短路，Global Talent 仍按核心许可 / 高人才评估）。

段号已按 4.1 / 4.4 登记的快照核对：SRC-020 Appendix Hong Kong British National (Overseas)（2026-10-08）、SRC-021 Appendix Global Talent（2026-08-03）、SRC-022 Appendix Settlement Family Life（2026-08-03）、SRC-024 Appendix FM（2026-10-08）、SRC-025 Appendix KoLL（2026-03-26）。

### 12.1 字段

| 字段 | 取值 | 含义 | 何时读取 |
|---|---|---|---|
| `ImmigrationEpisode.globalTalentEndorsement?` | `'RESEARCH_BODY'` \| `'ARTS_COUNCIL_ENGLAND'` \| `'TECH_NATION'` \| `'PRIZE'` | 首次 Global Talent 许可依据的背书 / 奖项（GT 11.1–11.2）。`RESEARCH_BODY` = Royal Society、British Academy、Royal Academy of Engineering 或 UKRI 背书；`ARTS_COUNCIL_ENGLAND` / `TECH_NATION` = 该机构背书（标准看下一字段）；`PRIZE` = Appendix Global Talent: Prestigious Prizes 所列奖项 | 申请日当天的 `GLOBAL_TALENT` + `MAIN` 片段 |
| `ImmigrationEpisode.globalTalentCriteria?` | `'EXCEPTIONAL_TALENT'` \| `'EXCEPTIONAL_PROMISE'` | Arts Council England / Tech Nation 背书所依据的标准（GT 11.1(b)、GT 11.2） | 同上，且 `globalTalentEndorsement` 为 `ARTS_COUNCIL_ENGLAND` 或 `TECH_NATION` |

- 缺省 = 用户没提供：`CL-GT-RESIDENCE` 输出不带 PD 的 `UNKNOWN`。背书机构不是 GT 11 点名的六个机构之一时，用户留空（同样 `UNKNOWN`，解释列出 GT 11 点名的机构）。
- HK BN(O) 不加字段：BN(O) Status Holder、BN(O) Adult Child 与 BN(O) Household Child（HK 15.1–15.3）等的定居条款是同一组（HK 55.1–HK 64.2），合格期都是 HK 62.1(b)；本任务只建模 `MAIN`。

### 12.2 参数（`currentLaw2026_11.values`，规则 commit 时加）

| 名称 | 值 | 来源（预期段号） |
|---|---|---|
| `hongKongBnoQualifyingYears` | 5 | SRC-020 HK 62.1(b) |
| `hongKongBnoSettlementEnglish` | `'B1'` | SRC-020 HK 60.1；SRC-007 EM 5.60（列出升 B2 的 14 个 Appendix，不含 Appendix Hong Kong BN(O)） |
| `globalTalentQualifyingYearsShort` | 3 | SRC-021 GT 11.1 |
| `globalTalentQualifyingYearsLong` | 5 | SRC-021 GT 11.2 |
| `globalTalentSettlementEnglishBefore` | `'B1'` | SRC-021 GT 13.1(a) |
| `globalTalentSettlementEnglish` | `{ cefrLevel: 'B2', applicationsFrom: '2027-03-26' }` | SRC-021 GT 13.1(b)；SRC-007 EM 5.60 |

HK BN(O) 的英语只有一个等级（HK 60.1 没有按申请日分段），所以是标量，不用"等级 + 生效日"的形状。

### 12.3 规则

| 规则 | 适用 | 判断 |
|---|---|---|
| `CL-SCOPE`（改） | — | 申请日当天的 episode 为 `HONG_KONG_BNO` + `MAIN` 或 `GLOBAL_TALENT` + `MAIN` → `PASS`，解释写明按哪条 Appendix 与 Appendix Long Residence 评估。两条路线的 `DEPENDANT` → `UNKNOWN`（不带 PD），解释"现行法律栏只建模该路线的主申请人"；其余不变。来源补 HK 62.1、GT 11.1。 |
| `CL-HKBNO-RESIDENCE-5Y`（新） | 当前 `HONG_KONG_BNO` + `MAIN` | 起点 = 申请日所在的连续 `HONG_KONG_BNO` 段（任意 `role`）的起点，经 `restartAfterAbsences`（CR 3.1，HK 63.1）。起点 + 5 ≤ 申请日 → `PASS`；否则 `FAIL`，解释写到期日（写法同 `CL-SW-RESIDENCE-5Y`）。HK 62.1(b) 允许合并"可定居路线"（a route under which a person can settle）的时间，本工具只计 BN(O) 段：紧接该段之前有其他路线的许可时，加假设"此前 X 的时间若属可定居路线也可计入，实际日期可能更早"（新 PD）。HK 62.1(a)（最近一次许可为 BN(O)）由 `CL-SCOPE` 保证。 |
| `CL-GT-RESIDENCE`（新） | 当前 `GLOBAL_TALENT` + `MAIN` | 年限：`RESEARCH_BODY`、`PRIZE`、(`ARTS_COUNCIL_ENGLAND` \| `TECH_NATION`) + `EXCEPTIONAL_TALENT` → 3（GT 11.1(a)–(c)）；(`ARTS_COUNCIL_ENGLAND` \| `TECH_NATION`) + `EXCEPTIONAL_PROMISE` → 5（GT 11.2）；`globalTalentEndorsement` 缺省，或为 ACE / Tech Nation 而 `globalTalentCriteria` 缺省 → `UNKNOWN`（不带 PD）。起点 = 申请日所在的、由 GT 11.3 路线的 `MAIN` 许可任意组合构成的连续段起点，经 `restartAfterAbsences`（CR 3.1，GT 12.1）。GT 11.3 的列表与 SW 21.2 相同（Global Talent、Innovator Founder、Skilled Worker、T2 Minister of Religion、International Sportsperson、Scale-up；Tier 1 与 Representative of an Overseas Business 不在 `Route` 里，不计，假设说明），复用 `SW_QUALIFYING_ROUTES`。满期 → `PASS`，未满 → `FAIL` 写到期日。GT 10.1（背书未被撤回）与 GT 10.2（上一段许可期间在背书领域有收入）不建模，按满足处理并写进假设。 |
| `CL-ENGLISH`（改） | — | 当前 HK BN(O) 主申请人 → 一律 B1（HK 60.1），解释注明 HC 1691 的 B2 不覆盖该 Appendix（EM 5.60）；当前 Global Talent 主申请人 → 申请日 < 2027-03-26 为 B1（GT 13.1(a)），此后 B2（GT 13.1(b)）。豁免与其余路线不变。来源补 HK 60.1、GT 13.1、EM 5.60。 |
| `CL-KOL`（改） | — | 判断不变（HK 61.1、GT 14.1 都引 Appendix KOL UK）；来源补这两段，解释写明按哪条 Appendix。 |

### 12.4 候选路径（§7 现行法律部分的补充）

| 当前 | 候选 | 年限 | 起点 |
|---|---|---|---|
| `HONG_KONG_BNO` + `MAIN` | `CL-ENGLISH` + `CL-KOL` | 5 | `CL-HKBNO-RESIDENCE-5Y` 的起点 |
| `GLOBAL_TALENT` + `MAIN` | `CL-GT-RESIDENCE` + `CL-ENGLISH` + `CL-KOL` | 3 或 5（按 12.3）；`CL-GT-RESIDENCE` 为 `UNKNOWN` 时不给起点 | `CL-GT-RESIDENCE` 的起点 |
| 两者 | Long Residence 10 年候选照常并列 | 10 | 不变 |

- `CL-HKBNO-RESIDENCE-5Y` 与 `CL-SW-RESIDENCE-5Y` 一样只用于展示，年限由起点计算。`CL-GT-RESIDENCE` 只在 `UNKNOWN`（背书未填）时进候选，让结论落到 `INSUFFICIENT_INFORMATION`（§7 判定第 2 条：起点未知且 `UNKNOWN` 不带 PD），不按 3 年或 5 年猜；年限已知时与其他居留规则一样只用于展示（否则未满期的 `FAIL` 会让候选失败、无法投影到期日）。
- 判定（§7 的 1–3 条）不变：满期且英语、KOL 都 `PASS` → `LIKELY_ELIGIBLE`；未满期 → `LIKELY_NOT_ELIGIBLE` 投影到期日。
- 聚合里"投影日期在 2027-03-26 之后、届时须 B2"的假设只对 Skilled Worker、Global Talent 与 Long Residence 加；HK BN(O) 5 年路径不加（HK 60.1 没有 B2）。
- `clBaseAssumption` 的建模范围说明补上 HK BN(O) 与 Global Talent 的主申请人。

### 12.5 不建模（登记 `docs/pending-details.md` 新一节"现行法律栏扩展（任务 4.2）"）

- 两条路线的 dependant（HK 57、HK 59 的子女与 adult dependant relative；GT 25–GT 34 的伴侣 5 年与子女）：`CL-SCOPE` `UNKNOWN`，见 12.3。
- HK 62.1(b) 中 BN(O) 以外"可定居路线"的时间（含 BN(O) concession 下的 Leave Outside the Rules）：只计 BN(O) 段，见 12.3。
- GT 10.1 / GT 10.2：按满足处理，见 12.3。
- HC 1691 不覆盖 HK BN(O)：已由 EM 5.60 确认，不是 PD；写在 `CL-ENGLISH` 的解释与参数来源里。

### 12.6 给 4.6（问卷）

- 当前片段为 `GLOBAL_TALENT` + `MAIN` 时问 `globalTalentEndorsement`；选了 `ARTS_COUNCIL_ENGLAND` 或 `TECH_NATION` 时再问 `globalTalentCriteria`。背书机构不在这四项里时提示留空。
- HK BN(O) 不新增问题。

### 12.7 fixtures

`packages/policy-data/fixtures/` 新增两个自拟 fixture（文件头注明事实依据为规则条款，不是官方案例）：`cl-hkbno-five-years.ts`（2021-02-01 起持 `HONG_KONG_BNO` 主申请人许可，申请日 2026-02-01 → 现行法律栏 `LIKELY_ELIGIBLE`、5 年；Earned Settlement 栏 `OUTSIDE_FRAMEWORK` 短路）；`cl-global-talent-three-years.ts`（`ARTS_COUNCIL_ENGLAND` + `EXCEPTIONAL_TALENT`，3 年到期当天 → `LIKELY_ELIGIBLE`、3 年；Earned Settlement 栏照常）。原有 fixture 的状态 / 年限 / 日期不变。

### 12.8 家庭伴侣主申请人（范围变更后追加）

**来源结构**（与任务书的假定不同，需先定来源）：Appendix Settlement Family Life（SRC-022，gov.uk 现行版 2026-08-03）**只有 10 年路线**（SETF 1–SETF 17），且没有财务要求。**5 年路线在 Appendix FM**：合格期 E-ILRP.1.3（"5 years (60 months)"）、伴侣身份 E-LTRP.1.2、财务 E-LTRP.3.1–3.8（经 E-ILRP.1.3(1A) 适用于定居）、英语与 KOL 经 E-ILRP.1.6 引 **Appendix KoLL**（KoLL 2.2 的 B1 / B2 按 2027-03-26 分段，HC 1691 EM 5.60 列有 Appendix KoLL）。Appendix FM 与 Appendix KoLL 已在 4.4 登记为 SRC-024 / SRC-025（SRC-015 是 Appendix KOL UK，不是 KoLL）。**分两步**：10 年路线（SRC-022）随 HK BN(O) 与 Global Talent 一起写；5 年路线与 `CL-FAMILY-FINANCIAL` 在 4.4 登记 SRC-024（Appendix FM）与 SRC-025（Appendix KoLL）后写（已完成）。5 年路线的连续居住：Appendix FM 不引用 Appendix Continuous Residence，所以**不**经 `restartAfterAbsences`，填了缺席时写假设（PD-070）；下表 `CL-FAMILY-RESIDENCE` 中"两者都经 `restartAfterAbsences`"只适用于 10 年路线。

#### 字段

| 字段 | 取值 | 含义 | 何时读取 |
|---|---|---|---|
| `ImmigrationEpisode.familyPermission?` | `'PARTNER_FIVE_YEAR'` \| `'PARTNER_TEN_YEAR'` \| `'PARENT'` | Appendix FM 许可的类型：5 年路线伴侣（D-ECP.1.1 / D-LTRP.1.1）、10 年路线伴侣、parent of a child | 申请日当天的 `FAMILY_PARTNER_OR_PARENT` + `MAIN` 片段 |

- 用一个字段同时区分"伴侣 / 父母"和"5 年 / 10 年"，不从 `relationships` 推断是伴侣还是父母：父母路线的申请人也可能有 `PARTNER` 关系。
- 缺省 → `CL-FAMILY-RESIDENCE` 为不带 PD 的 `UNKNOWN`（结论"信息不足"）。`PARENT` → `CL-SCOPE` 为 `UNKNOWN`，解释写"父母路线未建模"（Long Residence 已满 10 年时照常 `PASS`）。
- 复用现有字段：伴侣身份用 `relationships` 里 `type = 'PARTNER'` 的 `otherPartyStatus`；收入用 `incomeYears` 的 `earnings` + `partnerEarnings`；子女数用 `relationships` 里 `type = 'CHILD'` 且 `otherPartyStatus = 'OTHER'` 的条数（E-LTRP.3.7 的"child"不含 British citizen 与 settled）。

#### 参数（`currentLaw2026_11.values`）

| 名称 | 值 | 来源（预期段号） |
|---|---|---|
| `familyPartnerQualifyingYearsFive` | 5 | SRC-024 E-ILRP.1.3 |
| `familyPartnerQualifyingYearsTen` | 10 | SRC-022 SETF 3.1 |
| `familyPartnerMinimumIncome` | 29,000 | SRC-024 E-LTRP.3.1(a)、E-LTRP.3.8 |
| `familyPartnerTransitionalBefore` | `'2024-04-11'` | SRC-024 E-LTRP.3.5 |
| `familyPartnerTransitionalIncome` | 18,600 | SRC-024 E-LTRP.3.7(a)(i) |
| `familyPartnerTransitionalFirstChild` | 3,800 | SRC-024 E-LTRP.3.7(a)(ii) |
| `familyPartnerTransitionalAdditionalChild` | 2,400 | SRC-024 E-LTRP.3.7(a)(iii) |
| `familyPartnerSettlementEnglishBefore` | `'B1'` | SRC-022 SETF 5.1(a)；SRC-025 KoLL 2.2(b)–(c) |
| `familyPartnerSettlementEnglish` | `{ cefrLevel: 'B2', applicationsFrom: '2027-03-26' }` | SRC-022 SETF 5.1(b)；SRC-025 KoLL 2.2(b)–(c)；SRC-007 EM 5.60 |

#### 规则

| 规则 | 适用 | 判断 |
|---|---|---|
| `CL-SCOPE`（改） | — | 当前 `FAMILY_PARTNER_OR_PARENT` + `MAIN` 且 `familyPermission` 不是 `PARENT` → `PASS`（缺省也进入，由下一条给 `UNKNOWN`）；`PARENT` → `UNKNOWN`（见上）；该路线的 `DEPENDANT` → `UNKNOWN`，同 12.3。 |
| `CL-FAMILY-RESIDENCE`（新） | 当前 `FAMILY_PARTNER_OR_PARENT` + `MAIN` | `PARTNER_FIVE_YEAR`：起点 = 申请日所在的连续 `FAMILY_PARTNER_OR_PARENT` + `MAIN` 段起点，满 5 年（E-ILRP.1.3）；fiancé(e) 时间不计（E-ILRP.1.3(2)，本工具无此取值）、同一伴侣（E-ILRP.1.4）按满足假设。`PARTNER_TEN_YEAR`：起点 = 由 `FAMILY_PARTNER_OR_PARENT`（任意 `role`，SETF 3.1(a)(d)）与 `FAMILY_AND_PRIVATE_LIFE`（SETF 3.1(c)）组成的连续段起点，满 10 年；SETF 3.1(e) 的 Article 8 Leave Outside the Rules 无法区分，不计；SETF 3.2（合并其他可定居路线）不建模，紧接之前有其他路线时加假设（与 HK 62.1(b) 同一个新 PD）。两者都经 `restartAfterAbsences`（CR 3.1；SETF 4.1）。满期 `PASS`，未满 `FAIL` 写到期日；`familyPermission` 缺省 → `UNKNOWN`（不带 PD）。片段内各段按与当前片段同一类许可假设。 |
| `CL-FAMILY-RELATIONSHIP`（新） | 同上 | `relationships` 里有 `PARTNER` 且 `otherPartyStatus` 为 `BRITISH_CITIZEN` 或 `SETTLED` → `PASS`（E-LTRP.1.2(a)(b)；SETF 7.1(a)(b)）；为 `OTHER` → `UNKNOWN`（不带 PD；10 年路线另有 SETF 7.1(c)"同时申请定居"，5 年路线 E-LTRP.1.2(c)–(f) 在定居阶段不能用）；没有 `PARTNER` → `UNKNOWN`（不带 PD）。关系真实且持续（Appendix Relationship with Partner、SETF 7.3 的 1 年）按满足假设。 |
| `CL-FAMILY-FINANCIAL`（新） | 当前为 `PARTNER_FIVE_YEAR` | 门槛：连续段起点 < 2024-04-11 → 过渡门槛 £18,600 + 首个子女 £3,800 + 其后每个 £2,400，最高 £29,000（E-LTRP.3.5–3.8）；否则 £29,000（E-LTRP.3.1(a)）。收入 = 申请日前最近一个完整 tax year（`taxYearsBefore(simulationDate, 1)`）的 `earnings` + `partnerEarnings`（E-LTRP.3.2(a)(b)）。≥ 门槛 → `PASS`；< 门槛 → `FAIL`；该年 `earnings` 与 `partnerEarnings` 都缺 → `UNKNOWN`（不带 PD）。储蓄（E-LTRP.3.1(b)）、E-LTRP.3.3（伴侣领特定福利）、Appendix FM-SE 证据规则不建模，写进假设；"首次申请"按获批日近似（获批在 2024-04-11 后而申请在此前的情形写进假设）。10 年路线不运行（SETF 没有财务要求）。 |
| `CL-ENGLISH`（改） | — | 当前家庭伴侣 → 申请日 < 2027-03-26 为 B1，此后 B2（SETF 5.1；5 年路线 KoLL 2.2）。 |
| `CL-KOL`（改） | — | 判断不变；来源补 SETF 6.1（Appendix KOL UK）与 KoLL 2.3（5 年路线）。 |

#### 候选路径

| `familyPermission` | 候选 | 年限 | 起点 |
|---|---|---|---|
| `PARTNER_FIVE_YEAR` | `CL-FAMILY-RESIDENCE` + `CL-FAMILY-RELATIONSHIP` + `CL-FAMILY-FINANCIAL` + `CL-ENGLISH` + `CL-KOL` | 5 | `CL-FAMILY-RESIDENCE` 的起点 |
| `PARTNER_TEN_YEAR` | `CL-FAMILY-RESIDENCE` + `CL-FAMILY-RELATIONSHIP` + `CL-ENGLISH` + `CL-KOL` | 10 | 同上 |
| 缺省 | `CL-FAMILY-RESIDENCE`（`UNKNOWN`） | —（不给起点） | — |
| 都有 | Long Residence 10 年候选照常并列 | 10 | 不变 |

- `CL-FAMILY-RESIDENCE` 进候选，理由同 `CL-GT-RESIDENCE`（12.4）。"投影到 2027-03-26 后须 B2"的假设对家庭伴侣也加。
- 新 PD（登记到"现行法律栏扩展（任务 4.2）"）：HK 62.1(b) / SETF 3.2 的"可定居路线"合并（同一条）；家庭伴侣的储蓄与 E-LTRP.3.3 不建模属引擎假设，不另设 PD。

#### fixture 与给 4.6

- `cl-family-partner-five-years.ts`：`PARTNER_FIVE_YEAR`，伴侣 `BRITISH_CITIZEN`，2021-03-01 起，申请日 2026-03-01（5 年到期当天）；连续段起点早于 2024-04-11 → 过渡门槛 £18,600（无子女），上一 tax year 合并收入达标；英语 B1、KOL 已过 → `LIKELY_ELIGIBLE`、5 年。Earned Settlement 栏照常。随第二步（SRC-024 合并后）加入；第一步用单测覆盖 10 年路线。
- 问卷：当前片段为 `FAMILY_PARTNER_OR_PARENT` + `MAIN` 时问 `familyPermission`；伴侣路线时提示填写伴侣身份（`relationships`）与上一 tax year 的本人及伴侣收入。

## 13. 规则集版本化（Phase 4.8）

把 `docs/versioning.md` §4 里需要代码支撑的部分定下来：Statement of Changes 落地时只需"加一个规则集 + 参数文件 + 规则差异"。本任务**不新增真实规则集、参数或规则**，机制用测试内的合成规则集证明；现有两栏的输出与 `bilingual` 快照不变。

### 13.1 字段

| 位置 | 字段 | 取值 / 含义 |
|---|---|---|
| `policy-data` `types.ts` | `RULE_SET_IDS`（新，常量） | `['current-law-2026-11', 'earned-settlement-2026-11'] as const`，按加入顺序。**加一个规则集 = 在这里加一项**。 |
| | `RuleSetId`（改） | 由 `RULE_SET_IDS` 推导（`(typeof RULE_SET_IDS)[number]`），不再手写联合类型；定义只在这一处。 |
| | `ParameterSet.basedOn?: RuleSetId`（新） | 本参数文件的值与来源沿用自哪个版本，只作文档用途，引擎不读。 |
| `engine` `types.ts` | `RuleSet.effectiveFrom`（改） | `RuleSet` 改为按 `status` 区分的联合：`IN_FORCE_FUTURE_VERSION`（已提交、未生效）时**必填**，为生效日；`CURRENT_LAW` / `ANNOUNCED_NOT_IN_FORCE` 时不能填（`never`）。`evaluate` 不读它，哪两栏显示由 web 决定（13.5）。`effectiveTo` / `supersedes` 不变（仍未使用）。 |
| | `RuleSetRegistry`（新） | `{ ruleSets: Record<RuleSetId, RuleSet>; rules: Record<RuleSetId, Rule[]> }`：`evaluate` 评估的规则集与各自的规则，键相同。 |

### 13.2 注册方式

- `RULE_SET_IDS` 是唯一入口；下面三张表都是 `Record<RuleSetId, …>`，加了 ID 而漏了哪张，typecheck 会报错：
  - `RULE_SETS`（engine，`evaluate.ts`）：规则集元数据，web 用它列栏与徽章。
  - `RULES`（engine，`rules/index.ts`）：各规则集的规则，按执行顺序。
  - `PARAMETERS`（policy-data，新）：`Record<RuleSetId, ParameterSet>`，各规则集的参数文件；web 用它取各栏的 `asOf`（13.5）。规则仍直接 import 本版本的参数文件，不经 `PARAMETERS`（13.4）。
- 聚合按 `RuleSet.kind` 选：`LAW` 按现行法律栏的候选路径（§7、§12），`ANNOUNCED` 按 Earned Settlement（§7、§11）；规则取 `registry.rules[id]`，不再写死 ID。短路时 `PROTECTION` / `OUTSIDE_FRAMEWORK` 只停 `kind: 'ANNOUNCED'` 的栏（原来写死 `earned-settlement-2026-11`），`CRIMINALITY` / `IMMIGRATION_BREACH` 停所有栏。新版本若改了候选路径或短路，在它自己的契约小节里写，不在本节预留。
- `SimulationResult.policyAsOf` 不变（仍为 `earnedSettlement2026_11.asOf`），web 的显示用 13.5 的算法。

### 13.3 测试注入：`evaluate(request, registry?)`

- 签名改为 `evaluate(request: SimulationRequest, registry: RuleSetRegistry = { ruleSets: RULE_SETS, rules: RULES })`。现有调用不传第二个参数，行为不变；`request.ruleSetIds` 缺省时取 `registry.ruleSets` 的全部键，给了时照常过滤；主申请人的递归评估传同一个 `registry`。
- 合成规则集只在测试里构造：ID 写成 `'current-law-test-future' as RuleSetId`（类型上借用，生产代码与 `RULE_SET_IDS` 不出现它），`registry = { ruleSets: { ...RULE_SETS, [id]: … }, rules: { ...RULES, [id]: … } }`。
- 不选"可替换的模块级 `RULES`"或 `vi.mock`：显式参数最直接，测试里能在同一个用例中对比"不传 / 传合成 registry"两次结果。

### 13.4 同一规则挂到多个规则集：`withRuleSet(rule, ruleSetId)`

- `rule.ts` 新增 `withRuleSet(rule: Rule, ruleSetId: RuleSetId): Rule`，返回 `meta.ruleSetId` 换成新 ID、`evaluate`（即 check）不变的规则；`defineRule` 不变。沿用的规则用它注册到新规则集，不复制代码；语义变了的规则在新规则集下另写新版本，旧版本不动（`docs/versioning.md` §4.3）。
- **参数按规则集注入：等真实版本出现再做（同意任务书的倾向）**。理由：
  1. 没有第二个参数文件，无法测出"同一 check 在不同版本下取到不同值"是对的。
  2. 现有规则在模块顶层 import `currentLaw2026_11 as cl` / `earnedSettlement2026_11 as es`，引用约数百处。现在改成从 `ctx` 取值，是一次全量重写，却换不来可验证的收益。
  3. 12 月的 Statement of Changes 是改数字、改段号还是改结构，现在不知道。若主要是新段落与新条件，规则本来就要新写，注入用处有限。
- 代价：在注入做出来之前，`withRuleSet` 沿用的规则读的仍是 2026-11 的参数。所以新版本里**只要有数字变化的规则，都要另写**，或在那时先做注入。
- 届时的改法（只记在这里，不实现）：`RuleContext` 加 `values`，由 `evaluate` 按 `PARAMETERS[id]` 填入；规则把 `cl.values.x` 机械替换为 `ctx.values.x`；两个参数文件的值类型须一致（`basedOn` 展开保证同形）。范围：`packages/engine/src/rules/**` 与 `aggregate.ts`，快照应不变。

### 13.5 参数文件的"沿用"写法

```ts
export const currentLaw2027_01 = {
  ruleSetId: 'current-law-2027-01',
  basedOn: 'current-law-2026-11',
  asOf: '2027-01-05',
  values: {
    ...currentLaw2026_11.values,          // 沿用：值与 SRC 定位不变
    skilledWorkerSettlementSalaryRowA: {  // 覆盖：新值 + 新 SRC 定位
      value: /* 新 Statement of Changes 的值 */,
      sources: [{ srcId: 'SRC-0xx', locator: 'SW 24.3' }],
    },
  },
} satisfies ParameterSet;
```

- 前提：`'current-law-2027-01'` 已加进 `RULE_SET_IDS`。`satisfies ParameterSet` 下逐项覆盖仍保留各值的具体类型。沿用的值不必逐项写"沿用"注释，`basedOn` 说明来源版本（`docs/versioning.md` §4.2 按此改）。

### 13.6 给 astra（web 部分，另做）

- **两栏选择**（`apps/web/lib/policy.ts`，按 `RULE_SET_IDS` 顺序遍历 `RULE_SETS`）：
  - 左栏：`kind: 'LAW'` 且 `status: 'CURRENT_LAW'` 的那个。
  - 右栏：有 `status: 'IN_FORCE_FUTURE_VERSION'` 时取它；有多个时取 `effectiveFrom` 最早的。没有时取 `kind: 'ANNOUNCED'` 中最后加入的（`RULE_SET_IDS` 里靠后）。
  - 评估时 `ruleSetIds` 只传这两个。
- **徽章文案键**：保留 `policy.<status>`；新增 `policy.IN_FORCE_FUTURE_VERSION.effectiveFrom`，用于 `IN_FORCE_FUTURE_VERSION` 栏，按 web 现有插值写法带日期。
  - 中文："已立法，{date} 起生效"
  - 英文："Laid, in force from {date}"
- **`policyAsOf`**：所显示两栏 `PARAMETERS[id].asOf` 的较晚者。
- **/policy**：列出 `RULE_SET_IDS` 的全部规则集（含未显示的），写明状态、生效日（若有）与来源。

### 13.7 测试（合成规则集）

`packages/engine/test/versioning.test.ts`：

- 合成规则集 `current-law-test-future`：复用 `RULES['current-law-2026-11']` 的全部规则（经 `withRuleSet`），`kind: 'LAW'`、`status: 'IN_FORCE_FUTURE_VERSION'`、`effectiveFrom: '2027-01-01'`。
- 对每个 fixture：
  - 传合成 registry 时出三栏；
  - 现有两栏与不传 registry 时逐字节相同；
  - 合成栏与 `current-law-2026-11` 栏相同（同一组规则与参数）。
- `ruleSetIds: [合成 ID]` 只出这一栏。
- 合成规则的 `meta.ruleSetId` 都是合成 ID，原规则不变。
- 所有 fixture 的 `expected.ruleSetId` 都在 `RULE_SET_IDS` 里，且没有合成 ID。
- `RULE_SETS`、`RULES`、`PARAMETERS` 的键都等于 `RULE_SET_IDS`，`PARAMETERS[id].ruleSetId === id`。
- `basedOn` 写法：测试内构造一个合成参数集，展开沿用、覆盖一项，断言沿用值与覆盖值都对。
- `bilingual` 快照不变（合成规则集只在测试里）。

## 14. 现行法律栏扩展二：难民、UK Ancestry、Innovator Founder 与 Private Life（Phase 5.2）

把四类**主申请人**纳入现行法律栏。只新增可选字段，已有字段与取值不变；`Route`、`SettlementAssessment` 不改。Earned Settlement 栏不变。这些路线的 dependant 留给 5.4（`CL-SCOPE` `UNKNOWN`，同 12.3）。

来源：SRC-023 Appendix Settlement Protection（2026-04-08，已登记）；SRC-026 Appendix UK Ancestry（2026-08-03）、SRC-027 Appendix Innovator Founder（2026-08-03）、SRC-028 Appendix Private Life（2026-10-08）由 5.1 登记。下表段号按 5.1 取得的快照核对；SRC-026–028 合并前只写难民。

### 14.1 字段

| 字段 | 取值 | 含义 | 何时读取 |
|---|---|---|---|
| `PersonTimeline.protectionStatusRevoked?` | `boolean` | refugee status 或 humanitarian protection 已被撤销（revoked）或本人放弃（renounced）（STP 4.1）。缺省 = 未撤销、未放弃 | 申请日当天为保护类路线（14.3）+ `MAIN` |
| `ImmigrationEpisode.innovatorSettlementCriteria?` | `('INVESTMENT' \| 'CUSTOMERS' \| 'RESEARCH_AND_IP' \| 'REVENUE' \| 'EXPORT_REVENUE' \| 'JOBS' \| 'JOBS_WITH_SALARY')[]` | 业务已满足的 INNF 17.1(f)(i)–(vii) 各项（定居背书须至少两项）；`[]` = 一项都没满足；缺省 = 未提供 | 申请日当天的 `INNOVATOR_FOUNDER` + `MAIN` 片段 |
| `ImmigrationEpisode.privateLifeRoute?` | `'CHILD'` \| `'YOUNG_ADULT'` \| `'ADULT'` | Appendix Private Life 许可的依据：`CHILD` = 作为儿童获批（PL 3.1：未满 18 岁、连续居住 7 年；或首次获批时未满 18 岁，PL 10.1）；`YOUNG_ADULT` = 18–24 岁、未满 18 岁入境且半生在英国（PL 4.1）；`ADULT` = 其余（PL 5.1：连续居住超过 20 年或融入有"very significant obstacles"） | 申请日当天的 `FAMILY_AND_PRIVATE_LIFE` + `MAIN` 片段 |

- `protectionStatusRevoked` 缺省按"仍持有"处理（写进假设），不输出 `UNKNOWN`：撤销 / 放弃是少数情形，问卷可以只在用户主动勾选时填。
- `innovatorSettlementCriteria` 缺省 → `CL-INNOVATOR-ENDORSEMENT` 为不带 PD 的 `UNKNOWN`。同一项不能算两次（INNF 17.2），数组按去重计数。
- `privateLifeRoute` 缺省 → `CL-PRIVATE-LIFE-RESIDENCE` 为不带 PD 的 `UNKNOWN`（结论"信息不足"）。路线枚举沿用 `FAMILY_AND_PRIVATE_LIFE`（web 的"家庭与私人生活"），与 Appendix FM 的 `FAMILY_PARTNER_OR_PARENT` 区分。
- UK Ancestry 不加字段：UKA 12.1 要求定居时"仍满足"UKA 4.1–6.1（祖父母生于英国、自给自足、能工作并打算工作），UKA 10.3 要求申请日为 Commonwealth citizen，都按满足处理、写进假设。
- 给 5.5（问卷）的 INNF 17.1(f) 各项原文要点（数字均出自该段）：(i) 至少 £50,000 投入业务并已用于推进业务；(ii) 最近 3 年客户数至少翻倍，且高于同类英国企业的平均客户数；(iii) 有显著研发活动并已在英国申请知识产权保护；(iv) 最近一个完整会计年度年总营收至少 £1,000,000；(v) 最近一个完整会计年度年总营收至少 £500,000，其中至少 £100,000 来自出口；(vi) 为 settled workers 创造至少 10 个全职等效岗位；(vii) 为 settled workers 创造至少 5 个全职等效岗位、平均年薪至少 £25,000。

### 14.2 参数（`currentLaw2026_11.values`，规则 commit 时加）

| 名称 | 值 | 来源 |
|---|---|---|
| `protectionQualifyingYears` | 5 | SRC-023 STP 3.1 |
| `ukAncestryQualifyingYears` | 5 | SRC-026 UKA 13.1 |
| `ukAncestrySettlementEnglishBefore` | `'B1'` | SRC-026 UKA 15.1(a) |
| `ukAncestrySettlementEnglish` | `{ cefrLevel: 'B2', applicationsFrom: '2027-03-26' }` | SRC-026 UKA 15.1(b)；SRC-007 EM 5.60 |
| `innovatorFounderQualifyingYears` | 3 | SRC-027 INNF 18.1 |
| `innovatorFounderSettlementCriteriaMinimum` | 2 | SRC-027 INNF 17.1(f) |
| `privateLifeQualifyingYearsFive` | 5 | SRC-028 PL 14.1 |
| `privateLifeQualifyingYearsTen` | 10 | SRC-028 PL 14.2(a) |
| `privateLifeSettlementEnglishBefore` | `'B1'` | SRC-028 PL 16.1(a) |
| `privateLifeSettlementEnglish` | `{ cefrLevel: 'B2', applicationsFrom: '2027-03-26' }` | SRC-028 PL 16.1(b)；SRC-007 EM 5.60 |

- INNF 17.1(f) 各项的金额与岗位数只出现在问卷文案与规则解释所引的段号里，引擎不按金额判断（用户自报满足哪几项），所以不设参数。
- 难民与 Innovator Founder 主申请人没有定居英语参数：STP 未列英语要求；Appendix Innovator Founder 的定居段（INNF 15–21）只有 KOL（INNF 20.1），英语只在首次许可（INNF 11.1，B2）与 dependant 定居（INNF 39.1，HC 1691 改为 B1 / B2 分段，EM 5.60 列入的正是这一段）出现。

### 14.3 规则

"保护类路线" = `CORE_PROTECTION`、`PROTECTION_WORK_AND_STUDY`、`SAFE_AND_LEGAL`（含 11.3 推导出的 Legacy UKRS）、`LEGACY_SAFE_AND_LEGAL`：现行法律下都是 refugee status 或 humanitarian protection 的许可（11.1 让现有难民自获保护之日起填 `CORE_PROTECTION`），不区分 Earned Settlement 的三条路线。

| 规则 | 适用 | 判断 |
|---|---|---|
| `CL-SCOPE`（改） | — | 申请日当天为保护类路线 + `MAIN`、`UK_ANCESTRY` + `MAIN`、`INNOVATOR_FOUNDER` + `MAIN`、`FAMILY_AND_PRIVATE_LIFE` + `MAIN`（`privateLifeRoute` 缺省也进入）→ `PASS`，解释写明按哪条 Appendix 与 Appendix Long Residence 评估。这些路线的 `DEPENDANT` → `UNKNOWN`（不带 PD），同 12.3。来源补 STP 1.3、UKA 13.1、INNF 18.1、PL 14.1。 |
| `CL-PROTECTION-RESIDENCE-5Y`（新） | 当前保护类路线 + `MAIN` | 起点 = 申请日所在的、由保护类路线 `MAIN` 片段任意组合构成的连续段起点；STP 3.1 未引用 Appendix Continuous Residence，**不**经 `restartAfterAbsences`，填了缺席时写假设（新 PD）。起点 + 5 ≤ 申请日 → `PASS`；否则 `FAIL` 写到期日。只用于展示（同 `CL-HKBNO-RESIDENCE-5Y`）。假设：STP 1.3 按申请庇护日期列明许可类别（2022-06-28 前：refugee 或 humanitarian protection；此后：refugee permission to stay），本工具不区分 refugee 与 humanitarian protection，按持有所列许可处理；2022-06-28 及以后申请庇护而获 humanitarian protection 者 STP 1.3(b) 未列（新 PD）。 |
| `CL-PROTECTION-STATUS`（新） | 同上 | `protectionStatusRevoked === true` → `FAIL`（STP 4.1）；否则 `PASS`，假设"未申报撤销或放弃，按仍持有保护身份处理；STP 4.2 的 safe return review 会核查个人情况与原籍国状况是否已变化，结果无法预判"。两种情况都加假设"不满足定居要求但仍有权受保护时，会再获至少 30 个月保护许可（STP 5.2）"。 |
| `CL-ANCESTRY-RESIDENCE-5Y`（新） | 当前 `UK_ANCESTRY` + `MAIN` | 起点 = 申请日所在的连续 `UK_ANCESTRY` + `MAIN` 段起点（UKA 13.1 "as a person with UK Ancestry"），经 `restartAfterAbsences`（UKA 14.1）。满 5 年 `PASS`，未满 `FAIL` 写到期日；只用于展示。假设：UKA 12.1、UKA 10.3（见 14.1）。 |
| `CL-INNOVATOR-RESIDENCE-3Y`（新） | 当前 `INNOVATOR_FOUNDER` + `MAIN` | 起点 = 申请日所在的连续 `INNOVATOR_FOUNDER` + `MAIN` 段起点（INNF 18.1 "with permission as an Innovator Founder"），经 `restartAfterAbsences`（INNF 19.1）。满 3 年 `PASS`，未满 `FAIL` 写到期日；只用于展示。 |
| `CL-INNOVATOR-ENDORSEMENT`（新） | 同上 | 去重后的 `innovatorSettlementCriteria` 项数 ≥ 2 → `PASS`；< 2 → `FAIL`（解释"已满足 n 项，INNF 17.1(f) 须至少 2 项"，并列出已满足项的段号）；缺省 → `UNKNOWN`（不带 PD）。假设：INNF 17.1(a)–(e)（显著成就、Companies House 登记且为董事或成员、仍在经营、未来 12 个月可持续、在日常管理中起关键作用）由 endorsing body 判断，按满足处理；背书信须在申请前 3 个月内签发且未撤回（INNF 15.2(e)）；团队成员不能共用同一项（INNF 17.3）、岗位须满 12 个月等（INNF 17.4）未核实。 |
| `CL-PRIVATE-LIFE-RESIDENCE`（新） | 当前 `FAMILY_AND_PRIVATE_LIFE` + `MAIN` | 年限：`CHILD` / `YOUNG_ADULT` → 5（PL 14.1）；`ADULT` → 10（PL 14.2(a)）；缺省 → `UNKNOWN`（不带 PD）。起点 = 由 PL 14.3 所列许可任意组合构成的连续段起点：`FAMILY_PARTNER_OR_PARENT`（任意 `role`，PL 14.3(a)(b)(d)）与 `FAMILY_AND_PRIVATE_LIFE`（任意 `role`，PL 14.3(c)），复用 `countsForFamilyTenYear`（与 SETF 3.1 同一张列表）；PL 14.3(e) 的 Article 8 Leave Outside the Rules 无法区分，不计；经 `restartAfterAbsences`（PL 15.1）。满期 `PASS`，未满 `FAIL` 写到期日。PL 14.4（其他可定居路线的时间，须已持 Private Life 许可满 1 年且非非法入境）不建模，紧接之前有其他路线时加假设（PD-069）。假设：PL 13（英国出生、连续居住 7 年的儿童可直接定居）、PL 14.1A / PL 14.2(b) / PL 14.2A（2022-06-20 前的 Appendix FM 或 Leave Outside the Rules 过渡安排）与 PL 12.3–12.5（suitability 事由迫使走 10 年）未建模。 |
| `CL-ENGLISH`（改） | — | UK Ancestry → 申请日 < 2027-03-26 为 B1，此后 B2（UKA 15.1）；Private Life → 同样分段（PL 16.1），未满 18 岁由现有 `ageExempt` 豁免。保护类路线与 Innovator Founder 主申请人：该 Appendix 的定居段没有英语要求，本规则按 Long Residence 的等级核对（只用于 10 年候选），解释写明"Appendix Settlement Protection / Appendix Innovator Founder 未对定居设英语要求，此等级只适用于 Long Residence"。来源补 UKA 15.1、PL 16.1。 |
| `CL-KOL`（改） | — | 判断不变；解释写明依据：UKA 16.1、INNF 20.1、PL 17.1（未满 18 岁豁免，已由 `ageExempt` 覆盖）；保护类路线写"Appendix Settlement Protection 未设 KOL 要求，此项只适用于 Long Residence"。来源补这三段。 |

### 14.4 候选路径（§7、§12.4 的补充）

| 当前 | 候选 | 年限 | 起点 |
|---|---|---|---|
| 保护类路线 + `MAIN` | `CL-PROTECTION-STATUS` | 5 | `CL-PROTECTION-RESIDENCE-5Y` 的起点 |
| `UK_ANCESTRY` + `MAIN` | `CL-ENGLISH` + `CL-KOL` | 5 | `CL-ANCESTRY-RESIDENCE-5Y` 的起点 |
| `INNOVATOR_FOUNDER` + `MAIN` | `CL-INNOVATOR-ENDORSEMENT` + `CL-KOL` | 3 | `CL-INNOVATOR-RESIDENCE-3Y` 的起点 |
| `FAMILY_AND_PRIVATE_LIFE` + `MAIN` | `CL-ENGLISH` + `CL-KOL`；`privateLifeRoute` 缺省时为 `CL-PRIVATE-LIFE-RESIDENCE`（`UNKNOWN`）+ `CL-ENGLISH` + `CL-KOL`，不给起点 | 5 或 10（按 14.3） | `CL-PRIVATE-LIFE-RESIDENCE` 的起点 |
| 以上都有 | Long Residence 10 年候选照常并列（保护类许可属合法居留） | 10 | 不变 |

- 难民候选不含 `CL-ENGLISH` / `CL-KOL`；Innovator Founder 候选不含 `CL-ENGLISH`。两者在 Long Residence 候选里照常使用，`lrEnglish` 的比较不变。
- 判定（§7 的 1–3 条）不变。`CL-INNOVATOR-ENDORSEMENT` 的 `FAIL` 与 `CL-FAMILY-FINANCIAL` 一样让该候选失败（按"状况不变"推算，不投影 3 年日期）。
- 聚合里"投影日期在 2027-03-26 之后、届时须 B2"的假设：UK Ancestry（UKA 15.1(b)）与 Private Life（PL 16.1(b)）加；难民 5 年与 Innovator Founder 3 年路径不加（与 HK BN(O) 同理）。
- `clBaseAssumption` 的建模范围补上四条路线的主申请人；另说明 STP 2.1 / Part Suitability 等未建模（现有一句已覆盖 Part Suitability，补 STP 2.1）。
- 短路无变化：保护类主申请人本来就不因成年后非法入境短路（11.5），现行法律栏照常评估；`PROTECTION`、`OUTSIDE_FRAMEWORK` 只停 Earned Settlement 栏（13.2）。

### 14.5 不建模与新 PD（登记 `docs/pending-details.md` 新一节"现行法律栏扩展二（任务 5.2）"）

- 新 PD：STP 3.1 的"连续期间"如何因缺席中断（同 PD-070 的写法）；STP 未列英语 / KOL 要求（原文未提及，不从其他路线照搬）；STP 1.3(b) 未列 2022-06-28 及以后申请庇护而获 humanitarian protection 者。
- 不设 PD 的引擎取舍（写进假设或解释）：四条路线的 dependant（5.4）；STP 4.2 safe return review；STP 5.2 的 30 个月续期；UKA 10.3、UKA 12.1；INNF 17.1(a)–(e)、15.2(e)、17.3、17.4；PL 13、PL 14.1A、PL 14.2(b)、PL 14.2A、PL 12.3–12.5；PL 14.4 归入 PD-069。

### 14.6 给 5.5（问卷）

- 当前片段为保护类路线 + `MAIN` 时，可选勾选"保护身份已被撤销或我已放弃"（`protectionStatusRevoked`）。
- 当前片段为 `INNOVATOR_FOUNDER` + `MAIN` 时，多选 `innovatorSettlementCriteria`（文案按 14.1 的 INNF 17.1(f) 要点，标注段号），允许"一项都没有"（`[]`）。
- 当前片段为 `FAMILY_AND_PRIVATE_LIFE` + `MAIN` 时问 `privateLifeRoute`（三选一，文案按 14.1）。
- UK Ancestry 不新增问题。

### 14.7 fixtures

`packages/policy-data/fixtures/` 新增四个自拟 fixture（文件头注明事实依据为规则条款，不是官方案例），各在满期当天 → 现行法律栏 `LIKELY_ELIGIBLE`：难民（`CORE_PROTECTION` 主申请人满 5 年，未填英语与 KOL）、UK Ancestry（满 5 年，B1、KOL 已过，申请日早于 2027-03-26）、Innovator Founder（满 3 年，两项 INNF 17.1(f)、KOL 已过，未填英语）、Private Life（`YOUNG_ADULT` 满 5 年，B1、KOL 已过）。原有 fixture 的状态 / 年限 / 日期不变。

## 15. 现行法律栏的 dependant：HK BN(O)、Global Talent 与家庭伴侣的子女（Phase 5.4）

把三组 dependant 纳入现行法律栏，机制沿用 §8 / §9（`SimulationRequest.principal`，主申请人先按同一申请日评估）。Earned Settlement 栏、短路（§8 末段的复制规则）不变。保护类、UK Ancestry、Innovator Founder、Private Life 的 dependant 仍由 `CL-SCOPE` 给 `UNKNOWN`（§14）。

段号按快照核对：SRC-020 Appendix HK BN(O)（2026-10-08）HK 55–64；SRC-021 Appendix Global Talent（2026-08-03）GT 25–34；SRC-022 Appendix Settlement Family Life（2026-08-03）SETF 10–17；SRC-024 Appendix FM（2026-10-08）D-LTRC.1.1；SRC-018 Appendix Children CHI 1–4；SRC-014 EL 1.1。

### 15.1 字段

| 字段 | 取值 | 含义 | 何时读取 |
|---|---|---|---|
| `ImmigrationEpisode.dependantOf?`（改） | 增加 `'RELATIVE'` | HK BN(O) 的 adult dependant relative：主申请人是此人的子女、孙子女、兄弟姐妹或父母（HK 59.1） | 申请日当天的 `HONG_KONG_BNO` + `DEPENDANT` 片段；其他路线上为 `RELATIVE` → `CL-SCOPE` `UNKNOWN` |

- 不加其他字段：
  - 年龄从 `dateOfBirth` 按申请日算；
  - "最近一次许可为 dependent child / partner"由当前片段的 `role` + `dependantOf` 推出；
  - 主申请人已定居用 `principal.settled`，即 `{ date, route }`，含"已成为英国公民"（同 SW 39.1(b) 的做法）；
  - 家庭子女所随的伴侣是 10 年还是 5 年路线：读主申请人当前片段的 `familyPermission`。主申请人已定居时，读其最后一个 `FAMILY_PARTNER_OR_PARENT` + `MAIN` 片段的 `familyPermission`。
- "在英国出生的子女"（GT 25.2(e)(ii)、GT 27.2(b)、SETF 10.3）不建模，写进假设。

### 15.2 参数（`currentLaw2026_11.values`，规则 commit 时加 / 改）

| 名称 | 值 | 来源 |
|---|---|---|
| `globalTalentPartnerQualifyingYears`（新） | 5 | SRC-021 GT 30.1 |
| `hongKongBnoQualifyingYears`（沿用） | 5 | 已有 HK 62.1(b)；dependant 也按此段，不另设参数 |
| `hongKongBnoSettlementEnglish`（沿用） | `'B1'` | 已有 HK 60.1（适用于该路线所有申请人） |
| `globalTalentSettlementEnglishBefore` / `globalTalentSettlementEnglish`（沿用，补来源） | `'B1'` / `{ B2, 2027-03-26 }` | 来源补 SRC-021 GT 32.1(a) / GT 32.1(b) |
| `familyPartnerSettlementEnglishBefore` / `familyPartnerSettlementEnglish`（沿用，补来源） | 同上 | 来源补 SRC-022 SETF 15.1(a) / SETF 15.1(b) |

### 15.3 规则

"主申请人时点" = 主申请人本路线的起点 + 其年限，只在主申请人现行法律栏的 `pathwayYears` 等于本路线年限时成立，否则不成立。写法同 `principalSkilledWorkerStart`：
- HK BN(O)：`hongKongBnoStart` + 5；
- Global Talent：`globalTalentQualifying` 的起点 + 3 或 5；
- 家庭 10 年：`familyTenYearStart` + 10。

不成立时按 `withoutPrincipalPathway` 的写法：主申请人不在该路线 → `UNKNOWN`；其结论为 `LIKELY_NOT_ELIGIBLE` → `FAIL`；否则 `UNKNOWN`。

| 规则 | 适用 | 判断 |
|---|---|---|
| `CL-SCOPE`（改） | — | 下列 `DEPENDANT` → `PASS`：HK BN(O) 的 `PARTNER`，或申请日已满 18 岁的 `PARENT`（不需要 `principal`）；HK BN(O) 未满 18 岁的 `PARENT` 与 `RELATIVE`、Global Talent 的 `PARTNER` / `PARENT`、`FAMILY_PARTNER_OR_PARENT` 的 `PARENT`（这些需要 `principal`）。缺 `principal` → `UNKNOWN`，解释"填写主申请人信息后可判断"（同 SW）。`dependantOf` 缺省 → `UNKNOWN`（同 SW）。`FAMILY_PARTNER_OR_PARENT` 的 `PARTNER` / `RELATIVE` 与其他路线的 `RELATIVE` → `UNKNOWN`。家庭子女所随主申请人为 `PARTNER_FIVE_YEAR` → `UNKNOWN` + `pendingDetails: ['PD-074']`，解释写"D-LTRC.1.1 末句：不随 Appendix Settlement Family Life 申请的子女按 Part 8 第 298 段定居，该段未登记"。结论"信息不足"，不给年限与日期。来源补 HK 57.1、GT 27.1、SETF 12.1、D-LTRC.1.1。 |
| `CL-HKBNO-RESIDENCE-5Y`（改） | 当前 `HONG_KONG_BNO` + `MAIN`，或 `DEPENDANT` 中除"未满 18 岁的 `PARENT`"以外的情形 | 判断不变：本人连续 `HONG_KONG_BNO` 段（任意 `role`）起点经 `restartAfterAbsences`（HK 62.1(b)、HK 63.1），dependant 许可本身即"可定居路线"的许可。未满 18 岁的子女不运行（HK 62.1(b) 豁免）。 |
| `CL-HKBNO-DEPENDANT`（新） | 当前 `HONG_KONG_BNO` + `DEPENDANT`，且为未满 18 岁的 `PARENT` 或 `RELATIVE` | 主申请人须当前持 `HONG_KONG_BNO`（`MAIN`，或作为 `PARTNER` 的 `DEPENDANT`）。未满 18 岁子女（HK 57.2–57.3、HK 58.1）：主申请人时点成立 → `PASS`，解释写到时点（HK 57.3(a)）；主申请人已定居（任意路线，或已成为英国公民）→ `PASS`，可立即申请（HK 57.3(b)）。`RELATIVE`（HK 59.1）：主申请人时点成立 → `PASS`（59.1(a)）；已定居且 `settled.route = 'HONG_KONG_BNO'` → `PASS`（59.1(b)）；已定居但路线不同 → `UNKNOWN`，解释写"只有主申请人已是英国公民时才满足（59.1(c)），本工具无法区分"。假设：HK 57.4（另一位父母）、HK 58.1 / CHI 2.1（照护）按满足；HK 59.1 的亲属关系按申报。 |
| `CL-GT-DEPENDANT`（新） | 当前 `GLOBAL_TALENT` + `DEPENDANT` + `PARTNER` / `PARENT` | 主申请人须当前为 `GLOBAL_TALENT` + `MAIN`，或已于 `settled.route = 'GLOBAL_TALENT'` 定居且本人当时持其同一身份的 GT dependant 许可（GT 27.1(b)(i)）。已定居但条件不符 → `FAIL`（同 SW 39.1(b)）。`PARTNER`：本人连续 GT dependant 段起点经 `restartAfterAbsences`，须满 5 年（GT 30.1、GT 31.1）；时点 = max(本人起点 + 5, 主申请人时点)；主申请人已定居时只看本人 5 年。`PARENT`：没有合格期，时点 = 主申请人时点；主申请人已定居 → 可立即申请。主申请人时点不成立 → 同 `withoutPrincipalPathway`。假设：Appendix Relationship with Partner（GT 27.4）；CHI 4.1–4.3（GT 27.3，含另一位父母）、CHI 1.1–1.2、1A.1、2.1（GT 29A.1）按满足；在英国出生的子女未建模。 |
| `CL-FAMILY-CHILD`（新） | 当前 `FAMILY_PARTNER_OR_PARENT` + `DEPENDANT` + `PARENT`，且主申请人不是 5 年路线（5 年路线由 `CL-SCOPE` 处理） | 主申请人当前为 `FAMILY_PARTNER_OR_PARENT` + `MAIN` + `PARTNER_TEN_YEAR`：时点 = 主申请人时点（SETF 12.1(a)），子女没有自己的合格期。主申请人已于 `FAMILY_PARTNER_OR_PARENT` 定居，且最后一个 FM 片段为 `PARTNER_TEN_YEAR` → `PASS`，可立即申请（SETF 12.1(b)）。主申请人已于其他路线定居 → `FAIL`。主申请人为 `PARENT`，或 `familyPermission` 缺省 → `UNKNOWN`（不带 PD，同主申请人的处理）。年龄：未满 18 岁，或最近一次为 dependent child 许可（SETF 13.1，当前片段即满足），解释写明。假设：SETF 10.3 的在英国出生例外未建模；SETF 12.2（另一位父母）、SETF 13.2（16 岁以上不独立生活）、SETF 14.1（照护）按满足；SETF 11.3–11.6（suitability 事由要求 10 年）未建模。 |
| `CL-ENGLISH`（改） | — | 按路线取等级：HK BN(O) 的 dependant → B1（HK 60.1）；GT dependant → B1，2027-03-26 起 B2（GT 32.1）；家庭子女 → 同样分段（SETF 15.1）。年龄豁免沿用 `ageExempt`（EL 1.1(a)(b)：未满 18 岁或已满 65 岁）。来源补 GT 32.1、SETF 15.1。 |
| `CL-KOL`（改） | — | 判断与年龄豁免不变；解释写依据：HK 61.1（18–64 岁，与 `ageExempt` 一致）、GT 33.1、SETF 16.1。来源补 GT 33.1、SETF 16.1。 |

### 15.4 候选路径（§12.4、§12.8 的补充）

| 当前（`DEPENDANT`） | 候选 | 年限 | 起点 |
|---|---|---|---|
| HK BN(O) `PARTNER`，或已满 18 岁的 `PARENT` | `CL-ENGLISH` + `CL-KOL` | 5 | `CL-HKBNO-RESIDENCE-5Y` 的起点（本人） |
| HK BN(O) 未满 18 岁的 `PARENT` | `CL-HKBNO-DEPENDANT` + `CL-ENGLISH` + `CL-KOL` | 5（主申请人的） | 主申请人 HK 起点；主申请人已定居 → 申请日 − 5 年 |
| HK BN(O) `RELATIVE` | 同上 | 5 | max(本人起点, 主申请人 HK 起点)；主申请人已定居 → 本人起点 |
| GT `PARTNER` | `CL-GT-DEPENDANT` + `CL-ENGLISH` + `CL-KOL` | 5 | max(本人起点, 主申请人时点 − 5 年)；主申请人已定居 → 本人起点 |
| GT `PARENT` | 同上 | 主申请人的 3 或 5 | 主申请人 GT 起点；主申请人已定居 → 申请日 − 年限 |
| 家庭 `PARENT`（主申请人 10 年路线） | `CL-FAMILY-CHILD` + `CL-ENGLISH` + `CL-KOL` | 10 | 主申请人 `familyTenYearStart`；主申请人已定居 → 申请日 − 10 年 |
| 以上都有 | Long Residence 10 年候选照常并列 | 10 | 不变 |

- 起点不成立（缺 `principal`、主申请人时点不成立）时候选不给起点，结论按新规则的状态落到"信息不足"或"不符合"，同 `CL-SW-CHILD`。
- 本人 5 年（HK `PARTNER` / 已满 18 岁的 `PARENT` / `RELATIVE`）的起点与缺席重算来自 `CL-HKBNO-RESIDENCE-5Y`（`hongKongBnoStart`）；该规则与主申请人的同名规则一样只用于展示、不进候选（§12.4）：未满期的 `FAIL` 若进候选，会让候选失败、无法投影到期日。
- 新规则的 `FAIL` / `UNKNOWN` 都进候选；`PASS` 时年限与起点由上表给出。
- 投影日期在 2027-03-26 之后、届时须 B2 的假设：GT dependant 写 GT 32.1(b)，家庭子女写 SETF 15.1(b)；HK BN(O) 的 dependant 不加。
- 年龄按申请日分支（同 `CL-SW-CHILD`）。HK 未满 18 岁子女的投影日期若已满 18 岁，届时应改按本人 5 年（HK 62.1(b)），只写进假设，不另算。
- `clBaseAssumption` 的建模范围补上这三组 dependant。

### 15.5 不建模与新 PD

- 新 PD-074（登记到 `docs/pending-details.md` 第八节后的新一节"现行法律栏 dependant（任务 5.4）"）：Appendix FM 5 年路线伴侣的子女定居，依据为 Part 8 第 298 段（D-LTRC.1.1 末句），本仓库未登记该来源。
- 不设 PD 的引擎取舍（写进假设）：
  - 在英国出生的子女；
  - HK 57.4、GT 27.3（CHI 4.3）、SETF 12.2 的另一位父母；
  - 照护与独立生活要求（CHI 1A.1、CHI 2.1、SETF 13.2、SETF 14.1）；
  - Appendix Relationship with Partner；
  - HK 59.1 的亲属关系、59.1(c) 英国公民与已定居无法区分；
  - SETF 11.3–11.6；
  - 子女在投影期间满 18 岁。

### 15.6 fixtures 与测试

- `packages/policy-data/fixtures/` 新增三个自拟 fixture，文件头注明不是官方案例：
  - HK BN(O) 未满 18 岁子女：随主申请人在其 5 年到期当天 `LIKELY_ELIGIBLE`、5 年；
  - GT 伴侣：dependant 5 年到期当天，主申请人已以 Global Talent 定居（`principal.settled`）→ `LIKELY_ELIGIBLE`、5 年；
  - SETF 10 年路线子女：随主申请人在其 10 年到期当天 `LIKELY_ELIGIBLE`、10 年。
- 原有 fixture 的状态、年限、日期不变。
- `packages/engine/test/current-law-dependants.test.ts`：
  - 每组覆盖"到期当天 / 差一天 / 缺 `principal` → `UNKNOWN`"；
  - HK 18 岁以上伴侣不需要 `principal`；
  - 5 年路线子女 → `CL-SCOPE` `UNKNOWN` + PD-074。

### 15.7 给 5.5b（问卷）

- 当前片段为 `HONG_KONG_BNO` + `DEPENDANT` 时，`dependantOf` 增加"adult dependant relative（主申请人是我的子女、孙子女、兄弟姐妹或父母）"选项（`'RELATIVE'`）。
- 这三条路线的 dependant 需要填主申请人信息，HK BN(O) 18 岁以上伴侣 / 子女除外。

## 16. 引擎一致性与 PD-074（Phase 6.2）

收掉 Phase 5 报告 §4 的四处一致性问题（16.1–16.4），并按 Immigration Rules Part 8 第 298 段建模 Appendix FM 5 年路线伴侣的子女（16.5，关闭 PD-074）。只新增一个可选输出字段 `SettlementAssessment.decidedBy`；输入字段、`Route`、`RouteGroup`、规则 ID 都不变。§8 的"`SettlementAssessment` 不加字段"与 §13.2 的"`policyAsOf` 不变"由本节取代。Earned Settlement 栏的判断不变：只多出 `decidedBy`，另有 16.3 的短路原因变化。原有 fixture 的 `expected` 不改。`bilingual` 快照的变化限于三类：各栏多出 `decidedBy`（16.1）；16.5 给 `CL-SCOPE`、`CL-ENGLISH`、`CL-KOL`、`CL-FAMILY-CHILD` 补的来源（结果默认引用 `meta.sources`）；现行法律栏的建模范围句补上 5 年路线子女。结论、年限、日期与规则状态都不变。

来源：SRC-029 Immigration Rules Part 8（2026-08-03，HC 259；6.1 已登记）para 298、298A；SRC-024 D-LTRC.1.1 末句；SRC-025 Appendix KoLL 2.2、2.3、3.1。段号已按快照核对。

### 16.1 结论依据：`SettlementAssessment.decidedBy`

| 字段 | 取值 | 含义 |
|---|---|---|
| `SettlementAssessment.decidedBy?` | `RuleId[]` | 该栏结论所依据的那条候选路径（§7）的规则 ID，按该栏 `rules[]` 的顺序，不重复 |

`decide()` 除结论外返回所选的候选：

| `outcome` | `decidedBy` |
|---|---|
| `LIKELY_ELIGIBLE` | 全部 `PASS` 且已满期的候选中年限最短的一条（给出 `pathwayYears` 的那条） |
| `POTENTIALLY_ELIGIBLE` | `maybe[0]`（给出 `pathwayYears` 的那条） |
| `LIKELY_NOT_ELIGIBLE`，有 `earliestDate` | 投影出该日期的候选 |
| `LIKELY_NOT_ELIGIBLE`，无 `earliestDate` | 缺省 |
| `INSUFFICIENT_INFORMATION` | 缺省 |
| `REQUIRES_REGULATED_REVIEW`（短路栏） | 缺省：与 `pathwayYears`、`earliestDate` 一起删除 |

缺省的理由：这几种结论不落在某一条候选上。无日期的 `LIKELY_NOT_ELIGIBLE` 是每条候选都有 `FAIL`（或没有起点）。`INSUFFICIENT_INFORMATION` 有两种来源：没有可评估的候选（`CL-SCOPE` 不通过，或 dependant 缺主申请人 / `dependantOf`）；或几条候选都缺用户输入，补哪一项会改变适用哪条候选（`decide()` 本来就看全部 `maybe` 候选的 `UNKNOWN`）。只取其中一条会漏掉其他候选的 `FAIL` / `UNKNOWN`，所以这几种结论的依据就是整个 `rules[]`。短路栏不作结论。由此 `decidedBy` 与 `pathwayYears` 总是同时出现、同时缺省。

现行法律栏有些居留规则"只用于展示"（§12.4、§14.4、§15.4：不进候选，年限由起点计算）。它们给出候选的起点，所以列入该候选的 `decidedBy`，但不参与候选的状态判断：

| 候选 | 一并列入的居留规则 |
|---|---|
| Skilled Worker 5 年 | `CL-SW-RESIDENCE-5Y` |
| HK BN(O) 本人 5 年（主申请人、伴侣、已满 18 岁的子女）；adult dependant relative | `CL-HKBNO-RESIDENCE-5Y` |
| Global Talent 主申请人（背书已填） | `CL-GT-RESIDENCE` |
| 家庭伴侣 5 年 / 10 年（`familyPermission` 已填） | `CL-FAMILY-RESIDENCE` |
| 难民 5 年 | `CL-PROTECTION-RESIDENCE-5Y` |
| UK Ancestry 5 年 | `CL-ANCESTRY-RESIDENCE-5Y` |
| Innovator Founder 3 年 | `CL-INNOVATOR-RESIDENCE-3Y` |
| Private Life（`privateLifeRoute` 已填） | `CL-PRIVATE-LIFE-RESIDENCE` |
| Long Residence 10 年 | `CL-LR-RESIDENCE-10Y` |

- 背书、`familyPermission`、`privateLifeRoute` 缺省时，对应的居留规则本来就在候选里（`UNKNOWN`）。Skilled Worker、HK BN(O) 未满 18 岁子女、Global Talent 与家庭子女这几类 dependant 候选没有单独的居留规则：时点已经在 `CL-SW-PARTNER-5Y`、`CL-SW-CHILD`、`CL-HKBNO-DEPENDANT`、`CL-GT-DEPENDANT`、`CL-FAMILY-CHILD` 里。Earned Settlement 栏的 `ES-RESIDENCE` 本来就在每条候选里，不需要补。
- 补上居留规则后，每条现行法律候选都能由 `decidedBy` 区分。只看候选规则时，Long Residence、HK BN(O)、UK Ancestry 都是 `CL-ENGLISH` + `CL-KOL`。16.2 据此判断主申请人走哪条路线。差距摘要也能列出"居留未满"这一条：未满期时该规则为 `FAIL`。
- Long Residence 候选的英语按 LR 13.1 单独核对（§7）。`decidedBy` 里的 `CL-ENGLISH` 指 `rules[]` 中按当前路线核对的那一条；两者状态不同时，`assumptions` 里已有说明。

实现：`Candidate` 加可选字段 `residence?: RuleId`，取值见上表；`decide()` 返回所选候选的规则 ID 加 `residence`；`toAssessment` 按 `rules[]` 过滤并排序。不另建候选 ID。Earned Settlement 的 dependant（§8）只有一条候选；主申请人年限未知时（`esDependantSettlement` 无结果），结论不经 `decide()`，没有 `decidedBy`，此时也没有 `pathwayYears`。

性质（由测试断言；6.7 扩展随机测试时照此写）：

- 有值时非空、不重复，每个 ID 都在该栏 `rules[]` 里，顺序与 `rules[]` 相同；
- 有 `pathwayYears` 当且仅当有 `decidedBy`；
- `LIKELY_ELIGIBLE` 时，`decidedBy` 里的规则在 `rules[]` 中都是 `PASS`；
- 与 `locale` 无关，中英输出相同。

`Fixture.expected` 不加这个字段。

给 6.3（web 差距摘要）：有 `decidedBy` 时只列其中的 `FAIL` / `UNKNOWN` 规则，其他候选的失败不再出现在"还差什么"里；没有时保持现状，即按整个 `rules[]` 列。"为什么"列表仍显示完整的 `rules[]`。

### 16.2 dependant 判断主申请人走哪条路线

§9、§15.3 的"主申请人时点"原来在"主申请人现行法律栏的 `pathwayYears` 等于本路线年限"时成立。SETF 10 年与 Long Residence 10 年无法用年限区分（5.4 报告 §4）。现改为读主申请人该栏的 `decidedBy`。`principal.result` 已经带着这个字段，所以不另在 `RuleContext.principal` 里传候选。

| dependant | 主申请人时点成立的条件：主申请人现行法律栏的 `decidedBy` 含 |
|---|---|
| Skilled Worker 的伴侣、子女（`principalSkilledWorkerStart`） | `CL-SW-RESIDENCE-5Y` |
| HK BN(O) 未满 18 岁的子女、adult dependant relative | `CL-HKBNO-RESIDENCE-5Y` |
| Global Talent 的伴侣、子女 | `CL-GT-RESIDENCE` |
| 家庭 10 年路线的子女（主申请人为 `PARTNER_TEN_YEAR`） | `CL-FAMILY-RESIDENCE` |

- 起点算法不变，仍是主申请人本路线的起点。
- 不成立时的处理不变（`withoutPrincipalPathway` / `principalNotReady`）：主申请人不在该路线 → `UNKNOWN`；其结论为 `LIKELY_NOT_ELIGIBLE` → `FAIL`；否则 `UNKNOWN`。最后一种情形下，如果主申请人该栏有 `decidedBy`，说明其结论依据的是其他路径（例如 Long Residence）。这时解释改写为"主申请人的现行法律结论不是按本路线得出的（例如按 Long Residence），本人随其按本路线定居的时间无法判断"，不再说"主申请人的信息不足"。
- 5 年路线的子女（16.5）不看主申请人走哪条路线：para 298 只要求父母已定居或同时获批定居。
- 主申请人已定居时，有两处读其"最后一个主申请人片段"，写进对应规则的假设（只在实际读取时加）：
  - `CL-GT-DEPENDANT`（子女）：按主申请人最后一个 Global Talent 主申请人片段的背书定年限（GT 11.1–11.2）；
  - `CL-FAMILY-CHILD`：按主申请人定居日前最后一个 Appendix FM 主申请人片段的 `familyPermission`，判断其走 10 年路线（SETF 12.1(b)）还是 5 年路线（para 298）。
  - HK BN(O) 只读用户填的 `settled.route`，不读片段，不加假设。
- 回归用例：主申请人为 `PARTNER_TEN_YEAR`，SETF 候选不通过，而 Long Residence 恰满 10 年。主申请人 `LIKELY_ELIGIBLE`，`decidedBy` 含 `CL-LR-RESIDENCE-10Y`。子女的 `CL-FAMILY-CHILD` 改为 `UNKNOWN`（解释如上），不再被判随行。

### 16.3 Legacy Safe and Legal 的成年后非法入境：只短路改革栏

`shortCircuitOf` 的 `IMMIGRATION_BREACH`（成年后非法入境，§11.5）原来只放过 Earned Settlement 的 `PROTECTION` 组。Legacy Safe and Legal Routes 属 `OUTSIDE_FRAMEWORK` 组，所以两栏都被短路，现行法律栏没有结论。这与现行法律下同属保护类路线（§14.3）的其他路线不一致（5.2 报告 §4）。

- 改为：申请日当天的 Earned Settlement 路线（`esRouteOn`）为 `LEGACY_SAFE_AND_LEGAL` 时，也不触发 `IMMIGRATION_BREACH`。这包括两种情形：用户填的 `LEGACY_SAFE_AND_LEGAL` 片段，以及由 UKRS 推导出的 Legacy（`legacyUkrsArrival`，§11.3）。两者在现行法律下都是保护类路线。与 `PROTECTION` 组一样不看 `role`。
- 其他 `OUTSIDE_FRAMEWORK` 路线（HK BN(O)、Afghan schemes 等）的成年后非法入境照旧两栏短路。
- 不再触发 `IMMIGRATION_BREACH` 后，结果落到 `OUTSIDE_FRAMEWORK`，文案不变：推导出的 Legacy UKRS 用提到 PD-045 的那段，用户填的 `LEGACY_SAFE_AND_LEGAL` 用一般的框架外文案。`CRIMINALITY` 仍优先。

| 情形 | Earned Settlement 栏 | 现行法律栏 |
|---|---|---|
| Legacy 主申请人，成年后非法入境 | `REQUIRES_REGULATED_REVIEW`（`OUTSIDE_FRAMEWORK`）。规则照常运行：`ES-ROUTE-GROUP` 为 Legacy / 框架外的 `UNKNOWN`，`ES-BREACH` 为 PD-044 的 `UNKNOWN`。不给年限、日期与 `decidedBy` | 照常评估：`CL-SCOPE` `PASS`，STP 5 年候选与 Long Residence 并列，给出结论。非法入境不在现行法律栏判断（Part Suitability 未建模），同其他保护类路线 |
| Legacy dependant，成年后非法入境 | 同上 | 照常评估：`CL-SCOPE` `UNKNOWN`（保护类路线的 dependant 未建模，§14），结论 `INSUFFICIENT_INFORMATION` |
| 上述 Legacy 主申请人的 dependant | 复制主申请人的 `OUTSIDE_FRAMEWORK`（§8 复制规则不变），只停改革栏 | 照常评估 |

测试：Legacy 主申请人成年后非法入境 → `shortCircuit.reason` 为 `OUTSIDE_FRAMEWORK`，改革栏 `REQUIRES_REGULATED_REVIEW`，现行法律栏给出 STP 结论（满 5 年 → `LIKELY_ELIGIBLE`、5 年）。分两例：UKRS 于 2027-04-06 前抵达；用户直接填 `LEGACY_SAFE_AND_LEGAL`。另测 HK BN(O) 主申请人成年后非法入境仍为 `IMMIGRATION_BREACH`。

### 16.4 `SimulationResult.policyAsOf`

- 改为本次评估的规则集（经 `ruleSetIds` 过滤）的 `PARAMETERS[id].asOf` 中较晚的一个。原来固定取 `earnedSettlement2026_11.asOf`。web 按所显示两栏自行计算（§13.6），不受影响。
- 测试注入的合成规则集（§13.3）没有参数文件，不参与比较。如果本次评估的规则集都没有参数文件（`ruleSetIds: []`，或只评估合成规则集），取全部参数文件中较晚的一个。合成规则集的规则读的就是现有参数文件（§13.4）。
- 两个参数文件现在都是 `2026-11-04`，输出值不变。
- 测试：只评估一栏时取该栏参数的 `asOf`；在测试内把一个参数文件的 `asOf` 临时改晚（用后恢复），默认评估取到它，只评估另一栏时取不到；传合成 registry 时结果与不传时相同。

### 16.5 PD-074：Appendix FM 5 年路线伴侣的子女（Part 8 para 298）

D-LTRC.1.1 末句：伴侣或父母的子女申请 indefinite leave to remain 时，若随按 Appendix Settlement Family Life 申请的父母定居，适用该 Appendix；否则适用 para 298。5 年路线的伴侣按 Appendix FM（E-ILRP）定居，不经 SETF，所以其子女适用 para 298。

para 298 要点（SRC-029）：

- (i) 与父母或近亲同住，属下列情形之一：(a) 父母双方已定居；(b) 一方已定居、另一方已去世；(c) 一方已定居，且独自抚养，或子女通常与其同住；(d) 一方已定居**或同时获批定居**，另一方未持、也不在获批英国限期许可（另有 serious and compelling reasons 例外）；(e) 近亲已定居，且英国没有其他家人可照料。
- (ii) 持有或曾持有限期许可，并且 (a) 未满 18 岁；或 (b) 以定居为目的获批 para 302 或 Appendix FM 许可；(c)–(f) 为难民子女（319R、319X）、298A、Appendix Adoption。
- (iii) 未独立生活、未婚、未另组家庭；(iv)、(v) 由所投靠的父母或近亲提供住宿与生活费，不依赖 public funds；(vi) Part Suitability。
- (vii) 已满 18 岁、且按 para 302 / Appendix FM / 319R / 319X 入境者，须按 Appendix KoLL 满足英语与 Life in the UK。
- 子女本人没有合格期。另有 298A：仅因 (vi) 中 SUI 5.3 所述情形、或已满 18 岁不满足 (vii) 而不符合时，可获不超过 30 个月的限期许可。

适用：申请日当天为 `FAMILY_PARTNER_OR_PARENT` + `DEPENDANT` + `dependantOf = 'PARENT'`，带 `principal`，且主申请人的 Appendix FM 许可为 `PARTNER_FIVE_YEAR`。主申请人的许可由 `principalFamilyPermission` 读取：未定居时读当前片段，已定居时读定居前最后一个 FM 主申请人片段（16.2）。

| 规则 | 判断 |
|---|---|
| `CL-SCOPE`（改） | 上述子女 → `PASS`，解释"按 Immigration Rules Part 8 第 298 段（D-LTRC.1.1 末句）与 Appendix Long Residence 评估"。缺 `principal` → `UNKNOWN`，解释"填写主申请人信息后可判断"，同其他 dependant。不再输出 PD-074，`meta.pendingDetails` 去掉 PD-074。来源补 SRC-029 para 298。 |
| `CL-FAMILY-CHILD`（改；ID、标题不变） | 主申请人为 `PARTNER_FIVE_YEAR` 时按 para 298 判断。主申请人已定居 → `PASS`，可立即申请（298(i)，具体情形见假设）。未定居、但其现行法律栏有 `earliestDate` → `PASS`，时点即该日期（298(i)(d)：同时获批定居，不论主申请人按哪条路线）。其结论为无日期的 `LIKELY_NOT_ELIGIBLE` → `FAIL`。其余（`INSUFFICIENT_INFORMATION`、短路）→ `UNKNOWN`。年龄：申请日未满 18 岁 → 298(ii)(a)；已满 18 岁 → 当前的 Appendix FM 子女许可视为以定居为目的获批（298(ii)(b)，写进假设）。10 年路线（SETF）、主申请人为 `PARENT` 或缺省、主申请人不在该路线这几种情形的处理不变。`meta.pendingDetails` 去掉 PD-074；来源补 SRC-029 para 298(i)、(ii)、(iii)、(iv)、(v)、(vii) 与 para 298A。 |
| `CL-ENGLISH`（改） | 上述子女申请日已满 18 岁（且未满 65 岁）时按 298(vii) → Appendix KoLL 2.2：2027-03-26 前为 B1，此后为 B2。复用 `familyPartnerSettlementEnglishBefore` / `familyPartnerSettlementEnglish`，两者来源已含 KoLL 2.2，补 SRC-029 para 298(vii)。解释写"Part 8 第 298(vii) 段、Appendix KoLL 2.2"。未满 18 岁时 298(vii) 不适用，沿用 `ageExempt`（与 KoLL 3.1(a)(b) 一致）→ `PASS`。规则来源补 SRC-029 para 298(vii)、SRC-025 KoLL 3.1。 |
| `CL-KOL`（改） | 同上：已满 18 岁按 KoLL 2.3，解释写"298(vii)、Appendix KoLL 2.3"；未满 18 岁 → `PASS`。来源补 SRC-029 para 298(vii)、SRC-025 KoLL 3.1。 |

候选（§15.4 的补充）：

| 当前（`DEPENDANT`） | 候选 | 年限 | 起点 |
|---|---|---|---|
| 家庭 `PARENT`，主申请人在 5 年路线 | `CL-FAMILY-CHILD` + `CL-ENGLISH` + `CL-KOL` | 主申请人现行法律栏的 `pathwayYears`；主申请人已定居 → 5（`familyPartnerQualifyingYearsFive`） | 主申请人的 `earliestDate` 减去年限，即时点等于主申请人的 `earliestDate`；主申请人已定居 → 申请日减 5 年 |
| 都有 | Long Residence 10 年候选照常并列 | 10 | 不变 |

- 不成立（缺 `principal`，或主申请人没有日期）时候选不给起点，同 `CL-SW-CHILD`。
- 投影日期在 2027-03-26 之后、届时须 B2 的假设，依据写"KoLL 2.2"（经 298(vii)）。
- `clBaseAssumption` 与 `CL-SCOPE` 的范围外解释补上"Appendix FM 5 年路线伴侣的子女（Immigration Rules Part 8 第 298 段）"。

`CL-FAMILY-CHILD` 的假设（5 年路线）：

- 298(i)：主申请人已定居时，按 (a)–(d) 之一满足处理（另一位父母已定居或为英国公民、已去世、由主申请人独自抚养或子女与其同住，或另一位父母未持也不在获批英国限期许可）。尚未定居时只有 (d)（同时获批）适用，假设另一位父母未持、也不在获批英国限期许可，例如是主申请人的英国公民或已定居伴侣。(e) 近亲情形未建模。
- 298(ii)(b)：已满 18 岁的子女，当前的 Appendix FM 子女许可视为以定居为目的获批。
- 298(iii)–(v) 按满足处理：未独立生活、未婚、未另组家庭；父母提供足够的住宿与生活费，不依赖 public funds。298(vi) 的 Part Suitability 已由建模范围句覆盖。
- 已满 18 岁、仅因英语或 Life in the UK 不满足 298(vii) 时，可按 298A 获不超过 30 个月的限期许可，但仍不符合定居。
- 按申请日年龄判断；如果到预计日期已满 18 岁，届时须满足 298(vii)。
- 主申请人已定居时的读法见 16.2。

不建模（写进假设，不设 PD）：298(ii)(c)–(f)（难民子女、298A、Adoption 的既往许可）与 para 297（入境）不适用于本路径。10 年路线的主申请人改按 Long Residence 等其他路线定居时，依 D-LTRC.1.1 其子女同样适用 para 298；本任务不改这部分，仍按 16.2 输出 `UNKNOWN`（写进 6.2 报告 §4）。

PD-074 在 `docs/pending-details.md` 中标"已关闭（SRC-029，任务 6.2）"，不删行；"对引擎的影响"改写为现在的建模方式。不新增 PD。

fixtures（自拟，文件头注明不是官方案例）与测试：

- `cl-family-five-year-child-projected.ts`：主申请人为 `PARTNER_FIVE_YEAR`，差一天满 5 年，其他要求都满足，结论为 `LIKELY_NOT_ELIGIBLE` 并投影到次日。未满 18 岁的子女 → `LIKELY_NOT_ELIGIBLE`、5 年、同一日期。
- `cl-family-five-year-adult-child-english.ts`：主申请人已满 5 年（`LIKELY_ELIGIBLE`）；子女已满 18 岁，已通过 Life in the UK，未填英语 → `INSUFFICIENT_INFORMATION`，`mustUnknown: ['CL-ENGLISH']`。
- `current-law-dependants.test.ts`：原用例"5 年路线子女 → `CL-SCOPE` `UNKNOWN` + PD-074"改为新行为。补充用例：到期当天同时获批；主申请人已定居；缺 `principal`；主申请人为无日期的 `LIKELY_NOT_ELIGIBLE` → `FAIL`；18 岁以上英语 B1 → `PASS`；未满 18 岁豁免。

## 17. 5 年伴侣路线的储蓄与福利替代（Phase 6.4）

`CL-FAMILY-FINANCIAL`（§12.8）原来只按收入判断；储蓄（E-LTRP.3.1(b) / 3.7(b)）与伴侣领取特定福利（E-LTRP.3.3）写在假设里，标为"未建模"。本节补上这两项。只新增两个可选输入字段与一个参数；规则 ID、候选路径、`decidedBy`（§16.1）都不变。Earned Settlement 栏不变；10 年路线不变（SETF 没有财务要求）。

来源：SRC-024 Appendix FM（快照 2026-10-08）的 E-LTRP.3.1(a)–(c)、E-LTRP.3.2(g)、E-LTRP.3.3(a)–(b)、E-LTRP.3.7(a)–(c)、E-LTRP.3.8、E-ILRP.1.3(1A)。段号已按快照核对。要点：

- E-LTRP.3.1：须以指定证据证明以下之一。(a) 年毛收入至少 £29,000；(b) 指定储蓄，为 (i) £16,000，加 (ii) 额外储蓄，金额为缺口的 2.5 倍（缺口 = (a) 的要求减去 E-LTRP.3.2(a)–(f) 来源的年毛收入）；(c) 满足 E-LTRP.3.3（EX.1 适用时除外）。
- E-LTRP.3.7（过渡要求）：(a) £18,600，首名子女加 £3,800，其后每名加 £2,400，可单独满足，也可与 (b) 组合（"alone or in combination with"）；(b) 储蓄的写法同 3.1(b)；(c) 满足 E-LTRP.3.3。E-LTRP.3.8：子女多到要求超过 £29,000 时，只需 £29,000。
- E-ILRP.1.3(1A)：定居申请适用 E-LTRP.3.1(b)(ii) / E-LTRP.3.7(b)(ii) 时，去掉 "2.5 times"。所以定居阶段储蓄 ≥ £16,000 + 缺口即可。
- E-LTRP.3.3：(a) 伴侣领取所列福利之一（(i)–(xiv)：Disability Living Allowance、Severe Disablement Allowance、Industrial Injuries Disablement Benefit、Attendance Allowance、Carer's Allowance、Personal Independence Payment、Armed Forces Independence Payment / Guaranteed Income Payment、War Pensions Scheme 下的 Constant Attendance Allowance / Mobility Supplement / War Disablement Pension、Police Injury Pension，以及苏格兰的 Child Disability Payment、Adult Disability Payment、Carer's Support Payment、Pension Age Disability Payment、Scottish Adult Disability Living Allowance）；(b) 申请人须证明伴侣能在不依赖 public funds 的情况下，充分供养与安置其本人、申请人与 dependants。没有数字门槛。

### 17.1 字段

| 字段 | 取值 | 含义 | 何时读取 |
|---|---|---|---|
| `PersonTimeline.cashSavings?` | `number`（GBP） | 申请人与伴侣合计的现金储蓄，含 E-LTRP.3.2(g) 所列 18 岁以上 dependent child 的储蓄。缺省 = 未填写 | 申请日当天为 `FAMILY_PARTNER_OR_PARENT` + `MAIN` + `PARTNER_FIVE_YEAR`，且收入未满足门槛 |
| `PersonTimeline.partnerSpecifiedBenefit?` | `boolean` | 伴侣领取 E-LTRP.3.3(a) 所列福利之一。缺省 = 否，不输出 `UNKNOWN` | 同上，且收入与储蓄都不满足 |

- 两个字段都放在 timeline 上，与片段无关。不加别的字段。
- 储蓄的持有期与证据规则（Appendix FM-SE）、E-LTRP.3.2 的来源种类都不核对，写进假设。
- `partnerSpecifiedBenefit` 缺省按"未领取"处理，不单独加假设；只在 `FAIL` 的解释里提示可改按 E-LTRP.3.3 判断。
- 非负数等输入校验在 web 边界做（6.5），引擎不另外校验。

### 17.2 参数（`currentLaw2026_11.values`）

| 名称 | 值 | 来源 |
|---|---|---|
| `familyPartnerSavingsBase`（新） | 16,000 | SRC-024 E-LTRP.3.1(b)(i)、E-LTRP.3.7(b)(i) |

不设倍数参数。去掉 2.5 倍的依据 E-ILRP.1.3(1A) 已在 `CL-FAMILY-FINANCIAL` 的 `sources` 里。

### 17.3 `CL-FAMILY-FINANCIAL`（改）

适用范围不变：当前为 `PARTNER_FIVE_YEAR` 的伴侣主申请人；其他情形照旧 `FAIL`。门槛与收入的算法也不变：
- 门槛由 `familyIncomeThreshold` 给出：一般 £29,000；过渡为 £18,600 加子女，按 E-LTRP.3.8 封顶；
- 收入取申请日前最近一个完整 tax year 的 `earnings` + `partnerEarnings`。

E-LTRP.3.1 与 3.7 的 (a)(b)(c) 是并列的替代，满足任一即可。所以先看给定的数据能否满足 (a) 或 (b)，再看 (c)，最后看缺了什么。下表中，缺口 = 门槛 − 收入：

| 顺序 | 情形 | 结果 |
|---|---|---|
| 1 | 收入已填，且 ≥ 门槛 | `PASS`（3.1(a) / 3.7(a)），解释不变 |
| 2 | `cashSavings` 已填，且 ≥ `familyPartnerSavingsBase` + 缺口；收入未填时，缺口按整个门槛计（即收入为 0 也满足） | `PASS`（3.1(b) / 3.7(b)）。解释写收入、缺口与储蓄，并注明定居阶段按 E-ILRP.1.3(1A) 不乘 2.5 |
| 3 | `partnerSpecifiedBenefit === true` | `UNKNOWN` + `pendingDetails: ['PD-075']`（3.1(c) / 3.7(c)、3.3(b)）。解释写：福利按申报，按 3.3(a) 处理；须证明 adequate maintenance and accommodation，没有数字门槛，计算口径本工具未登记 |
| 4 | 收入未填 | `UNKNOWN`（不带 PD）。现有解释后补一句："也可用储蓄补足，至少 £16,000 加收入缺口（E-LTRP.3.1(b) / 3.7(b)）" |
| 5 | 收入不足，`cashSavings` 缺省 | `UNKNOWN`（不带 PD）。解释写出缺口，并说明"储蓄至少 £16,000 加缺口即可满足，未填写储蓄" |
| 6 | 收入不足，储蓄已填但不够 | `FAIL`。解释写还差的金额（£16,000 + 缺口 − 储蓄），并提示伴侣领取 3.3(a) 所列福利时可改按 E-LTRP.3.3 判断 |

与任务书的两处不同，请评审：

- **第 2 条里"收入未填也可 PASS"是新增的**：储蓄已覆盖整个门槛时，不论收入多少都满足 (b)，不必再要收入。
- **第 3 条的位置**：
  - 排在第 1、2 条之后（任务书放在最前）：(c) 是 (a)(b) 之外的另一种满足方式，收入或储蓄已满足时就该 `PASS`；只有两者都不满足时才落到 (c)。
  - 排在第 4、5 条之前：伴侣领福利时，申请人可以直接走 (c)；补填收入或储蓄最多把结果改成 `PASS`，不会改成 `FAIL`。

其余规定：

- PD：只有第 3 条带 PD-075；其他规则都通过时，结论为 `POTENTIALLY_ELIGIBLE`、5 年（§7 判定第 2 条）。第 4、5 条是用户可以补填的输入，不带 PD，结论为 `INSUFFICIENT_INFORMATION`。
- `meta.pendingDetails` 加 PD-075；`sources` 补 E-LTRP.3.3。
- 假设：替换原来"储蓄、E-LTRP.3.3 与 Appendix FM-SE 未建模"那句，改为三条：
  - 储蓄按申报的合计现金储蓄计；Appendix FM-SE 的持有期与证据规则、E-LTRP.3.2 的来源种类未核对；
  - 过渡门槛超过 £29,000 时，缺口按 E-LTRP.3.8 封顶后的门槛计算；
  - 伴侣领取的福利按申报；住宿要求（E-LTRP.3.4、E-LTRP.3.9）与 EX.1 未建模。
- 不做：E-LTRP.3.2 的来源校验、Appendix FM-SE、EX.1、10 年路线、Earned Settlement 栏、问卷（6.5 由 astra 做）。

### 17.4 新 PD

PD-075 登记到 `docs/pending-details.md` 新的第十节"现行法律栏家庭财务（任务 6.4 新增）"：伴侣领取 E-LTRP.3.3(a) 所列福利时 adequate maintenance 的口径。Appendix FM 没有给出数字或算法；算法见 Appendix FM-SE 与内政部指引，本仓库未登记。第七节"未建模的点"里关于储蓄与 E-LTRP.3.3 的那句，在实现 commit 里改写。

### 17.5 受影响的现有测试与输出

- engine `current-law-routes.test.ts`：
  - "£29,000 from 2024-04-11 …"：有两处收入比门槛少 £1（`28999`，以及两名子女时的 `24799`），原断言 `FAIL`；储蓄缺省后会变成 `UNKNOWN`。改为在这两处申报 `cashSavings: 0`（无储蓄），仍断言 `FAIL`，门槛边界的检验不变。
  - "combined income below the threshold fails the pathway …"：低收入原断言 `FAIL` / `LIKELY_NOT_ELIGIBLE`。改为两例：申报 `cashSavings: 0` → `FAIL` / `LIKELY_NOT_ELIGIBLE`；不填储蓄 → `UNKNOWN` / `INSUFFICIENT_INFORMATION`。收入缺省那一例不变。
- engine `helpers.ts` 的 `SAMPLES.familyPartnerFiveYear`（收入 £27,000，低于 £29,000，未填储蓄）：`CL-FAMILY-FINANCIAL` 由 `FAIL` 变为 `UNKNOWN`。该样例只用于双语检查与文案导出，没有状态断言，不改。
- **web `apps/web/test/whatif-focus.test.tsx` 会失败**：用例 "family focus reuses the engine threshold … makes the financial rule pass" 把 fixture 的收入改为 0 后，断言 `before` 为 `FAIL`。按新语义（未填储蓄）应为 `UNKNOWN`。
  - `apps/web` 不归 Opus 改，需要 astra 把断言改为 `UNKNOWN`，或在 draft 上申报 `cashSavings: 0`。
  - 在那之前，本任务的实现 commit 过不了 gate。由 Fable 决定由谁改、何时合并。
- fixtures：原有 fixture 的 `expected` 都不变。`CL-FAMILY-PARTNER-FIVE-YEARS` 收入 £22,000 ≥ £18,600，仍 `PASS`。`bilingual` 快照只变 `CL-FAMILY-FINANCIAL` 的来源（补 E-LTRP.3.3）与假设句。

### 17.6 fixtures 与测试（实现时）

三个自拟 fixture，文件头注明不是官方案例。都用一般门槛 £29,000（伴侣许可自 2024-06-01 起），申请日为满 5 年当天 2029-06-01（英语 B2），上一完整 tax year 为 2028-29：

- `cl-family-five-year-savings-pass.ts`：收入 £20,000，储蓄 £25,000（缺口 £9,000 = £25,000 − £16,000）→ 财务规则 `PASS`，结论 `LIKELY_ELIGIBLE`、5 年。
- `cl-family-five-year-savings-short.ts`：储蓄 £24,000 → `LIKELY_NOT_ELIGIBLE`，`mustFail: ['CL-FAMILY-FINANCIAL']`。
- `cl-family-five-year-partner-benefit.ts`：伴侣领 Carer's Allowance（`partnerSpecifiedBenefit: true`），收入 £20,000，未填储蓄 → `POTENTIALLY_ELIGIBLE`、5 年，`mustUnknown: ['CL-FAMILY-FINANCIAL']`。

单测覆盖：
- 储蓄刚好够 / 差 £1 / 缺省；
- 过渡门槛下的缺口；
- 收入未填，但储蓄覆盖整个门槛；
- 福利替代，且 PD 只出现在福利这一条；
- 收入已达门槛时，福利与储蓄不影响 `PASS`。
