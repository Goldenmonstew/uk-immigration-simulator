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

难民路径细节、What-if、前向推算的结构化假设，都等用到时再加字段，不提前预留。

## 7. 路径聚合（`packages/engine/src/aggregate.ts`）

规则只回答"这一条是否满足"，聚合把它们组合成结论。每个规则集先列出**候选路径**：一组必须全部 `PASS` 的规则 + 年限 + 居留起点。

- Earned Settlement（SRC-001 p46 Table 1）：强制要求 = `ES-CRIMINALITY`、`ES-DEBT`、`ES-ENGLISH-B2`、`ES-KOL`、`ES-ROUTE-GROUP`、`ES-RESIDENCE`。
  - 3 年：强制 + `ES-BREACH` + `ES-PUBLIC-FUNDS` + `ES-EARNINGS-3Y`
  - 5 年：强制 + `ES-BREACH` + `ES-PUBLIC-FUNDS` + 以下任一：`ES-EARNINGS-5Y`、`ES-BRITISH-CONNECTION`、`ES-PUBLIC-SERVICE`、`ES-TRANSITIONAL-CARE-WORKER`、`ES-TRANSITIONAL-HEALTH-EDUCATION`（2.5）
  - 10 年：强制 + `ES-BREACH` + `ES-PUBLIC-FUNDS` + `ES-EARNINGS-10Y`
  - 20 年：强制 + `ES-EARNINGS-10Y`（用过 public funds 或有 breach 时只剩这条）
  - 当前为 Family and Private Life 时只有 10 / 20 年（p23）。居留起点都是 `ES-RESIDENCE` 的合格期起点。
- 现行法律：`CL-SCOPE` 不通过时只输出这一条、结论 `INSUFFICIENT_INFORMATION`。否则候选为 Skilled Worker 5 年（`CL-SW-SALARY`、`CL-SW-GOING-RATE`（2.5）、`CL-ENGLISH`、`CL-KOL`，起点为连续 Skilled Worker 段）与 Long Residence 10 年（`CL-ENGLISH`、`CL-KOL`，起点为连续合法居留段）；居留规则 `CL-SW-RESIDENCE-5Y` / `CL-LR-RESIDENCE-10Y` 只用于展示，年限由起点计算。

判定（两个规则集同一套）：

1. 有候选全部 `PASS` 且起点 + 年限 ≤ 申请日 → `LIKELY_ELIGIBLE`，`pathwayYears` 取最短，`earliestDate` = 申请日。
2. 否则，有候选居留已满（或起点未知）且只有 `UNKNOWN`、没有 `FAIL` → 这些 `UNKNOWN` 都带 `pendingDetails` 时 `POTENTIALLY_ELIGIBLE`，`pathwayYears` 取该候选；否则 `INSUFFICIENT_INFORMATION`，不给 `pathwayYears`。两种都不给 `earliestDate`。
3. 否则 `LIKELY_NOT_ELIGIBLE`；若还有未 `FAIL` 的候选，取起点 + 年限最早的一条给出 `pathwayYears` 与 `earliestDate`，并加假设"持续居留、收入等状况不变"。强制要求 `FAIL` 时所有候选都失败，不给年限与日期。

短路（`SimulationResult.shortCircuit`）：`CRIMINALITY`（任何犯罪记录）与 `IMMIGRATION_BREACH`（成年后非法入境）让两栏都是 `REQUIRES_REGULATED_REVIEW`；`PROTECTION` 与 `OUTSIDE_FRAMEWORK`（当前路线）只让 Earned Settlement 一栏是 `REQUIRES_REGULATED_REVIEW`，现行法律照常评估。短路时规则照常运行、出现在 `rules` 里，但该栏不给 `pathwayYears` / `earliestDate`。

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

- `ImmigrationEpisode.immigrationSalaryList?: boolean`：只对 `SKILLED_WORKER` + `MAIN` 有意义，担保岗位在 Appendix Immigration Salary List 上（SW 24.3 rows B、D 看"最近一次许可"，即申请日当天那段）。缺省 = 否，不输出 `UNKNOWN`，规则在 `assumptions` 里写"未申报 Immigration Salary List，按不在清单处理"。
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
