# Phase 2 规划（2026-11-04）

Phase 1 交付了一个能真实判断的 MVP-0：规则引擎（20 条规则、路径聚合、最早日期推算）、问卷与双栏结果页、10 个官方 fixture。Phase 2 的目标是把它变成**可以给人用的产品**：能回答"我改变什么会怎样"、能处理一家人、能部署到用户的域名、能让人看到规则与政策版本的来龙去脉。来源依据：研究报告第二阶段（What-if 实验室、家庭联合模拟、政策版本库、change log）、`docs/00-project-analysis-and-plan.md` §5 / §10、1.1 报告 §4 未建模项、`PROGRESS.md` Phase 2 候选。

原则不变：一个 package 一个 writer；规则语义只由 Opus 改；契约改动经 Fable 评审；每项政策数字带 `SRC-xxx` 定位；不过度工程化（研究报告的"自动 source monitor"与"规则集按日期选版本"的机制都等真有第二个版本或真有用户再做）。

## 1. 任务总览

| # | 任务 | 负责 | 改动范围 | 依赖 | 波次 |
|---|---|---|---|---|---|
| 2.1 | What-if 实验室 | astra | `apps/web` | 无（引擎不改） | 1 |
| 2.2 | dependant 与家庭建模 | Opus | `packages/engine`、`packages/policy-data`（参数、fixtures）、`docs/contracts.md`、`docs/pending-details.md` | 契约先行，Fable 评审后再写规则 | 1 |
| 2.3 | Cloudflare Pages 部署 + 政策变更日志数据 | sol | 根 `package.json`、`.github/workflows`、`docs/deploy.md`、`packages/policy-data/src/data/policy-changelog.ts` | 用户提供 Cloudflare 账号侧信息（见 §4） | 1 |
| 2.4 | 家庭问卷 + 政策页 | astra | `apps/web` | 2.2 的契约、2.3 的变更日志 | 2 |
| 2.5 | 现行法律补全与剩余过渡安排 | Opus | `packages/engine`、`packages/policy-data` | 2.2 合并后 | 2 |
| 2.6 | going rate 数据表（Appendix Skilled Occupations 登记为 SRC-017） | sol | `packages/policy-data`（data、scripts、test）、`docs/SOURCES.md`、`policy-sources/` | 无（2.3 合并后立即派发） | 1 |
| 2.7 + 2.8 | 分享链接 + en 文案与语言切换 | astra | `apps/web` | 2.1 合并后 | 2 |
| 2.9 | 引擎双语解释（`SimulationRequest.locale`） | Opus | `packages/engine`、`docs/contracts.md` | 2.2、2.5 合并后；契约先行 | 2 |

Wave 1 三个任务互不碰同一 package，可同时开工；2.3 合并后 sol 接 2.6。Wave 2 在 Wave 1 合并后派发；astra 顺序为 2.1 → 2.7 + 2.8 → 2.4，Opus 顺序为 2.2 → 2.5 → 2.9。

## 2. 任务卡

### 2.1 What-if 实验室（astra）

研究报告称之为"整个产品最有竞争力的功能"：改变一个输入，看结论、年限、日期怎么变，以及**哪些规则因此翻转、哪些仍未满足**。引擎是纯函数，整件事在前端完成，`evaluate()` 不需要改。

- 入口：结果页按钮"情景实验室 · What-if"，须有已完成的问卷草稿；页面 `/whatif`，静态导出。
- 基线：当前草稿跑出的 `SimulationResult`（两栏的 outcome / pathwayYears / earliestDate）。
- 可调项（每项都是对 `PersonTimeline` 的一次纯改写，改完立即重算）：
  1. 收入：把最近 N 个 tax year 的个人收入统一设为 X（`<input type=range>` + 数字框；预设按钮取 policy-data 的三档门槛值，不写裸数字）。
  2. 模拟日期（改日期即重算，覆盖"再等几年会怎样"）。
  3. 英语等级、Life in the UK（覆盖 1.1 报告 §4 第 8 条"强制要求补足后"的推算需求）。
  4. 假设未领取 public funds；假设无缺席。
- 展示：每栏"之前 → 之后"（结论、年限、日期）；规则 diff 分三组：**翻转为满足**、**翻转为不满足 / 未知**、**仍未满足**，每条带 `explanation`；假设清单用之后的结果。diff 是 `apps/web/lib/whatif.ts` 里的纯函数，带单元测试。
- 不做：保存多个情景、分享链接（见 2.7）、图表、拖拽时间线。
- 验收（Fable）：gate 全过；浏览器走四条：SW £55k 英语未填 → 设 B2 看 ES-ENGLISH-B2 翻转；收入提到 3 年门槛 → 出现 3 年路径与新日期；模拟日期推到 2030-01-15 → 两栏 LIKELY_ELIGIBLE；勾选"未领取 public funds"后 ES-PUBLIC-FUNDS 翻转；375px 不溢出；无携带输入的网络请求。

### 2.2 dependant 与家庭建模（Opus）

现在 `role = DEPENDANT` 的人两栏都是 `INSUFFICIENT_INFORMATION`（PD-055）。SRC-001 Ch.5（p28–p31）已经把规则写死了：同时到达的伴侣与主申请人同时定居（各自满足相关要求）；后到的伴侣须完成同样的合格期；18 岁以下子女随父母定居并豁免收入、债务、英语、Life in the UK；18–24 岁保留 child-dependant 身份者随家庭定居，须满足成人强制要求但不需个人收入；25 岁及以上须独立符合资格。案例 Individual A–E 在 p31。

- 契约（第一个 commit，Fable 评审后再写规则）：建议 `SimulationRequest.principal?: PersonTimeline`——dependant 的请求附带主申请人的完整时间线，引擎先评估主申请人，再把其路径年限与合格期起点用于 dependant；没有 `principal` 时维持现状。新参数 `independentAge = 25`（p30）。不要给主申请人另造一套"摘要"输入：用户不知道主申请人的路径年限，那正是引擎要算的。
- 规则：Earned Settlement 栏新增 dependant 路径规则（同时到达 / 后到 / 子女 / 18–24 / 25+ 五种情形，按模拟日年龄分支，豁免按 p29–p30）；现行法律栏补 Appendix Skilled Worker 的 partner / child settlement 段（段号以快照为准登记到 SOURCES.md），`CL-SCOPE` 相应放宽。
- fixtures：p31 Individual A 恢复 `LIKELY_ELIGIBLE` / 5；新增 B（后到两年 → 日期晚两年）、C（14 岁子女）、D（22 岁）、E（25 岁）。每条规则 positive / negative / boundary（如 18 岁、25 岁当天）。
- 登记：PD-055 更新；原文没说的（后到伴侣的"同样合格期"是否随主申请人的加速路径变化、18–24 岁"保留 child-dependant 身份"的认定）新增 PD 条目并输出 `UNKNOWN`。
- 验收（Fable）：gate 全过；对照 p29–p31 逐条核对规则解释；五个 p31 fixture 真实断言；dependant 无 `principal` 时行为不变。

### 2.3 Cloudflare Pages 部署 + 政策变更日志数据（sol）

两件小事，都不碰规则语义。

- 部署：`apps/web` 保持静态导出；根脚本 `deploy:pages` = build 后 `wrangler pages deploy apps/web/out`（`pnpm dlx wrangler@<固定版本>`，不加依赖）；项目名、账号 ID、API token 一律走环境变量，仓库不存任何密钥；`.github/workflows/deploy.yml` 在 push main 时部署（远端与 secrets 就绪后自动生效）；`docs/deploy.md` 写清用户侧步骤（建 Pages 项目、生成 token、首次部署、绑定域名、`*.pages.dev` 预览）。需要核实并写进文档的两点：Pages 对 `/simulate` → `simulate.html` 的 clean URL 行为；`_next/` 静态资源的缓存头是否需要 `_headers`（不需要就不加）。
- 变更日志：`packages/policy-data/src/data/policy-changelog.ts`，每条 `{ date, title, summary, sources: SourceRef[] }`，按日期排序，从包入口导出。初始条目由 Fable 在 brief 里按 `docs/SOURCES.md` 给出：2025-05-12 White Paper CP 1326（SRC-012）；2025-11-20 咨询 CP 1448（SRC-013）；2026-03-05 HC 1691 定居英语 2027-03-26 起 B2（SRC-007）；2026-10-08 HC 584 快照版本（SRC-004 / SRC-005）；2026-11-02 政府回应 CP 1707 与两院陈述（SRC-001 / SRC-002 / SRC-003）。不做自动监控。
- 验收（Fable）：gate 全过；`deploy:pages` 在无 token 时给出明确的 wrangler 报错而不是静默成功；文档步骤 Fable 逐条读一遍；首次真实部署由用户在自己的终端用自己的 token 执行，Fable 之后用浏览器检查 `*.pages.dev` 上三个页面与 clean URL。

### 2.4 家庭问卷 + 政策页（astra，Wave 2）

- 家庭问卷：签证历史里当前身份为 dependant 时，增加"主申请人的时间线"子流程，复用现有步骤组件填一份 `PersonTimeline`，提交时放进 `SimulationRequest.principal`；结果页显示"按主申请人 X 年路径推算"的依据。
- 政策页 `/policy`：从代码派生，零手写数据——`RULE_SETS`（状态三态、asOf、来源）、参数表（名称、值、来源链接）、规则清单（`RULES` 的 id / title / 来源 / PD 编号）、政策变更日志（2.3 的数据）、来源清单（`sources.ts`）。这就是"政策版本库"在无后端 MVP 里的形态；真有第二个规则集版本时再谈按日期选版本。
- 验收：gate；浏览器走 p31 Individual A / B 的家庭路径；政策页与 `docs/SOURCES.md` 抽查 5 条一致。

### 2.5 现行法律补全与剩余过渡安排（Opus，Wave 2）

- SW 21.2：Global Talent、Innovator Founder、Scale-up 等可与 Skilled Worker 合并计入 5 年；SW 24.3 rows B–E 的定居薪资例外（新入行、PhD、ISL、国家薪级）；每条带段号与 boundary 用例。
- 过渡安排 §2.2（RQF6 以下、国家薪级医疗 / 教育，White Paper 前来英 → 保留 5 年；职业清单 PD-038、时间口径 PD-039 → `UNKNOWN`）；§2.3（2024-04 前 Skilled Worker 群体只影响续签至 2035，输出为假设说明，不改年限）。
- `CL-SW-GOING-RATE`：用 2.6 的 `goingRates` 表按 `socCode` 查 going rate，与一般门槛取高（SW 24.3 row A；rows B–E 的百分比折减一并实现）；表里没有该 SOC → UNKNOWN。
- 不做：难民路径（Ch.7，Phase 3）、Highest Talent Group（PD-011 政府未定）。

### 2.6 going rate 数据表（sol，2.3 合并后立即派发）

用户决定纳入（2026-11-04）。登记 Immigration Rules Appendix Skilled Occupations 为 SRC-017（快照 + sha256），用脚本从快照机械提取 Table 1 / 1a / 2 / 2aa / 2a / 2b 的 SOC 2020 → 年 going rate，以及 Table 3 的国家薪级职业代码清单，放进 `policy-data/src/data/skilled-occupations.ts`，脚本留在 `policy-data/scripts/` 供 Appendix 更新时重跑。测试断言行数与快照一致并抽查若干行。brief：`docs/tasks/2.6-going-rates.md`。

### 2.7 + 2.8 分享链接 + en 文案与语言切换（astra，2.1 合并后）

用户决定纳入（2026-11-04）。分享链接：把问卷草稿编码进 URL hash，复制即分享，无后端，复制时提示链接含全部填写信息。en 文案：`en.ts` 补全到与 zh-CN 同键集（类型强制），页头语言切换并记住选择；引擎输出的中文解释在 2.9 之前原样显示。brief：`docs/tasks/2.7-share-link-and-en.md`。

### 2.9 引擎双语解释（Opus，2.5 之后，契约先行）

`SimulationRequest.locale?: 'zh-CN' | 'en'`（默认 zh-CN），每条规则的 `title` / `explanation` / `assumptions` 与 `shortCircuit.message` 按 locale 产出；`RuleMeta.title` 改为双语对象需经 Fable 评审（影响政策页）。先出契约 commit，再写文案。

## 3. 验收总则

沿用 `docs/00-project-analysis-and-plan.md` §7：fixtures 全过且新规则带三组用例；规则元数据有来源、无裸数字；输出带 `policyAsOf`；高风险短路不变；无携带输入的网络请求；UI 改动由 Fable 用浏览器走受影响页面；一个逻辑改动一次 commit，PROGRESS 有记录。Codex 任务仍由 Fable 代为提交。

## 4. 待用户决定

1. **远端仓库。** 目前没有 git remote。Cloudflare Pages 两条路：(a) 建 GitHub 仓库 → 现有 CI 生效 + `deploy.yml` 自动部署（推荐；也是 iOS 阶段多 agent 协作的前提）；(b) 不建远端，只用 `deploy:pages` 从本机直传。2.3 两条都支持，区别只在 `deploy.yml` 是否马上有用。
2. **IAA 复核时机。** 绑定正式域名前，由 IAA 注册顾问 review 结果页措辞（§5 第 12 条）；`*.pages.dev` 预览地址不受此限。这一步只有用户能安排。
3. **可选项取舍。** ~~默认都不进。~~ 用户 2026-11-04 决定：going rate、分享链接、en 文案全部纳入 Phase 2（2.6、2.7 + 2.8、2.9）。
4. **产品定位与 IAA。** 用户提出改为"仅供参考 / 理解政策 / 带游戏性"的定位。SRC-009 §1.1 的法定定义是"给某个特定个人、且顾问知道该建议针对该个人的建议"；一般性政策信息不在其内。免责声明本身不改变性质，产品设计才改变：不收集证件、不说"你应该申请 X"、结果以"情景"而非"你的申请"呈现、每个结果带未定事项与受监管建议入口（现有设计已如此）。IAA 复核是上线前的风险控制，不是法律前置条件；是否安排由用户决定。

## 5. 不在 Phase 2

自动政策监控 pipeline（§5 第 14 条）、用户账号与保存情景、邮件通知、难民路径、游戏模块、iOS 包壳决策（Phase 3 之前不决定）。
