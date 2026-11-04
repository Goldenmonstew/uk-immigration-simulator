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
