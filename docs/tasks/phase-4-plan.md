# Phase 4 规划（2026-11-04）

Phase 3 之后，Earned Settlement 栏已覆盖全部计入路线、家庭、过渡安排与难民路径；**现行法律栏**却仍只建模 Skilled Worker 与 Long Residence，其他路线（Hong Kong BN(O)、Global Talent、家庭伴侣、难民……）的用户在这一栏只能看到"信息不足"。Phase 4 的主题是**把现行法律栏补到与改革栏对称**，并为 2026-12 起分批提交的 Statement of Changes 做好**版本化与来源监控**的准备，再做一轮 web 打磨。候选来源：`docs/tasks/phase-3-plan.md` §5、各任务报告 §4、`PROGRESS.md` 当前状态。

原则不变：一个 package 一个 writer；规则语义只由 Opus 改；契约改动先 commit 再评审；每项政策数字带 `SRC-xxx` + 段号；不过度工程化；合并后自动 push 触发 CI 与部署。

## 1. 任务总览

| # | 任务 | 负责 | 改动范围 | 依赖 | 波次 |
|---|---|---|---|---|---|
| 4.1 | 登记现行法律新来源：Appendix Hong Kong British National (Overseas)、Appendix Global Talent、Appendix Settlement Family Life、Appendix Settlement Protection（各带 sha256 快照与 settlement 段落定位） | sol | `policy-sources/`、`docs/SOURCES.md`、`apps/web/lib/sources.ts`（来源 URL 表，仅加行） | 无 | 1 |
| 4.2 | 现行法律栏扩展：HK BN(O) 5 年、Global Talent 3 / 5 年、家庭伴侣 5 年 / 10 年（用户决定：三条都做；难民留到下一波）；`CL-SCOPE` 放宽；契约先行 | Opus | `packages/engine`、`packages/policy-data/src/parameters/current-law-2026-11.ts`、`fixtures/**`、`docs/contracts.md` §12、`docs/pending-details.md` | 4.1 的来源与段号 | 1（契约）/ 2（规则） |
| 4.3 | web 打磨：路线与分组名复用 policy-data 显示名、英文全角标点、/about 方法说明页、a11y 与 Lighthouse 修正、375px 与打印复查；反馈入口（用户要，渠道待定，作为 4.3 的补充任务单独派） | astra | `apps/web` | 无 | 1 |
| 4.4 | 来源监控改进：check-sources 对 GOV.UK 页面比对归一化正文；ISL `removalDate` 规范为 ISO；每周自动核对的 GitHub Actions（用户决定：加，只输出日志） | sol | `packages/policy-data/scripts/**`、`src/data/immigration-salary-list.ts`、`.github/workflows/check-sources.yml` | 无 | 1（与 4.1 串行，同为 sol） |
| 4.5 | 规则小项：ISL 移除日期与申请日比较；Legacy UKRS 短路文案；asylum support 偿还扩到全部路线（p8 注 1）；中文"且SOC"拼接空格 | Opus | `packages/engine`、`docs/pending-details.md` | 4.4 的 ISO 日期；4.2 合并后 | 2 |
| 4.6 | 问卷与结果页跟进：asylum support 一问对全部路线显示（随 4.5）；现行法律栏新路线所需的输入（随 4.2 契约：如 Global Talent 的 endorsement 类型、伴侣是否英国公民 / 定居者已在 `relationships`） | astra | `apps/web` | 4.2 契约合到 main | 2 |
| 4.7 | 规则集版本化流程文档（已写：`docs/versioning.md`） | Fable | `docs/versioning.md` | 无 | 1（完成） |
| 4.8 | 版本化实现（用户决定：要做）：引擎规则集注册支持同一规则挂到多个规则集与"沿用"参数、`RuleSet.effectiveFrom`、web 两栏选择逻辑与"已立法未生效"徽章、/policy 列出全部规则集；用测试里的合成第三规则集验证，不新增真实规则 | Opus（引擎）+ astra（web） | `packages/engine`、`packages/policy-data/src/types.ts`、`apps/web/lib/policy.ts` 等 | 4.2 合并后（引擎）；4.3 合并后（web） | 2 |

Wave 1 三个 writer 互不碰同一 package（sol 先做 4.1 再做 4.4；Opus 先交 4.2 契约；astra 做 4.3）。4.2 契约评审通过后单独合到 main，astra 的 4.6 按它做。Wave 2 的 4.8 按 `docs/versioning.md` §4.3 与 §5 实现，契约先行。

## 2. 任务卡

### 4.1 登记现行法律新来源（sol）

- 四个 Appendix 各登记为新 SRC（沿用 `policy-sources/<日期>-immigration-rules-appendix-*.html` 命名、sha256、gov.uk 变更记录里的版本日期），`docs/SOURCES.md` 表尾追加行并写"常用定位"：settlement 的合格期、连续居留、英语、KOL、suitability 段号（如 HK 18.1 之类，以快照为准）。`apps/web/lib/sources.ts` 的 URL 表同步加行（测试要求与 SOURCES.md 的 ID 集合一致）。
- 不做：规则语义；不改 `check-sources.mjs`（那是 4.4）。
- 验收（Fable）：gate 全过；每个 SRC 的 sha256 用 `check-sources` 核对为"未变"；抽查每个 Appendix 的 settlement 段号在快照里能找到。

### 4.2 现行法律栏扩展（Opus，契约先行）

- 目标：`CL-SCOPE` 从"只 Skilled Worker（含其 dependant）与 Long Residence"放宽到四类主申请人：
  - **Hong Kong BN(O)**：5 年连续居留 + 英语 B1（2027-03-26 起是否升 B2 以 SRC-007 / Appendix 为准）+ KOL；现行法律栏对这条框架外路线也要出真实结论（改革栏仍按框架外短路）。
  - **Global Talent**：3 年（exceptional talent / 获奖 / 特定背书）或 5 年（exceptional promise），需要新契约字段表达背书类型；英语、KOL 按 Appendix。
  - **家庭伴侣（Appendix Settlement Family Life）**：5 年路线与 10 年路线的合格期、关系要求（`relationships` 已有伴侣是否 British citizen / settled）、英语 B1 → B2（SRC-007）、KOL；财务要求（£29,000 等）原文有数字就建模，没有就 `UNKNOWN` 登记 PD。
  - **难民（Appendix Settlement Protection）**：5 年保护许可后定居；与 3.4 的改革栏形成对照（现在难民用户现行法律栏只能"信息不足"，见 3.4 报告 §4）。
- 契约（第一个 commit）：新增字段（如 `ImmigrationEpisode.globalTalentEndorsement?`）、参数名与来源段号、候选路径表（`docs/contracts.md` §12）；astra 的 4.6 按它做。
- 每条路线一组规则、三组用例、一个官方或自拟 fixture；现有 fixture 结论不变。
- 验收（Fable）：gate；对照快照逐条核对段号与数字；独立跑四类用户各一个场景。

### 4.3 web 打磨（astra）

- `apps/web/i18n/routes.ts` 的路线与分组名改为直接复用 policy-data 的 `routeNames` / `routeGroupNames`（删除 web 自己的那份），分组英文大小写以 policy-data 为准。
- 英文界面残留的全角标点（"Simulation date："、"（n）"、"：" 等）按语言选择半角 / 全角。
- 新增 `/about`（中英）：这个工具是什么、不是什么（参考与理解政策、带游戏性，不判定法律身份）、两栏的含义、数据来源与政策核对日期（读 `/policy` 的数据）、已知未定事项的入口、如何反馈（渠道见 §4 第 3 条）。
- a11y：用 axe 或 Lighthouse 跑首页 / 问卷 / 结果页 / What-if，修 contrast、label、焦点顺序等真实问题；Lighthouse PWA 可安装项核对。
- 375px 与打印复查（3.3 遗留：375px 截图由 Fable 在浏览器面板可见时补做）。
- 验收（Fable）：gate；浏览器中英文走查 /about 与问卷；Lighthouse a11y ≥ 95、PWA 可安装；375px 无溢出。

### 4.4 来源监控改进（sol）

- `check-sources.mjs`：对 GOV.UK 页面增加"归一化正文"比对（提取 `<main>`、去 script / style / 随机 ID 与空白后比较）或改用 Content API 的 `public_updated_at` / `details.change_history`（SRC-010 已登记）作为变更信号；原始 sha256 仍打印作为存档证据；SRC-011 单独标注为动态页。目标：19+ 个来源在内容未变时全部报"未变"。
- ISL `removalDate` 规范为 ISO 日期（脚本提取时转换，`immigration-salary-list.ts` 重新生成，测试核对）。
- （待定，见 §4 第 2 条）`.github/workflows/check-sources.yml`：每周一跑一次脚本，只把结果写进 Actions 日志；失败不阻塞任何东西。
- 验收（Fable）：本机跑一遍脚本，全部来源"未变"；ISL 25 行日期格式；工作流（如加）手动触发一次成功。

### 4.5 规则小项（Opus，Wave 2）

- ISL 推导时比较 `removalDate` 与申请日（晚于移除日按不在清单处理，假设说明）。
- 推导出的 Legacy UKRS 的短路文案改为与 PD-045 一致（不再写"B2 仍适用"）。
- `ES-ASYLUM-SUPPORT` 扩到全部路线（p8 注 1：所有申请人的最低要求），只在 `asylumSupportRepayment` 有值时运行判断、缺省不再 UNKNOWN（避免所有用户都"信息不足"）——口径在契约回合确认。
- 中文"且${原因}"拼接空格。
- 验收：gate；快照 diff 只含上述变化。

### 4.6 问卷与结果页跟进（astra，Wave 2）

- 按 4.2 契约加输入（Global Talent 背书类型等）；asylum support 一问按 4.5 口径对全部路线显示（或放到"债务"一问旁）。
- 结果页现行法律栏对新路线的展示无需特殊处理（规则自带标题与解释），核对即可。

### 4.7 规则集版本化流程（Fable，文档，已完成）

- `docs/versioning.md`：登记、新规则集命名与 `IN_FORCE_FUTURE_VERSION`、规则沿用、fixtures 与 PD、web 两栏选择、保留与退役、升级检查清单。

### 4.8 版本化实现（Opus + astra，Wave 2）

- 引擎（Opus，契约先行）：`RuleSet` 加 `effectiveFrom?`（已立法未生效时的生效日）；`defineRule` / 规则表允许同一 check 注册到多个规则集（参数按规则集取）；参数文件支持"沿用上一版本"的写法（值与来源来自旧文件、注释标明）；`RULE_SETS` 可含三个规则集。用测试内的合成第三规则集（不导出、不进 `RuleSetId` 的生产取值，或以测试专用 ID）验证 `evaluate` 对每个规则集独立出结果。不新增任何真实规则或参数。
- web（astra）：`apps/web/lib/policy.ts` 的两栏选择（`CURRENT_LAW` + `IN_FORCE_FUTURE_VERSION` 优先于 `ANNOUNCED`）、徽章文案（中英，含生效日）、`policyAsOf` 取所显示两栏的较晚者、/policy 列出全部规则集并标状态；用测试 mock 一个三规则集的 `RULE_SETS` 验证选择逻辑。
- 验收：gate；现有两规则集的输出与快照不变；合成规则集的测试覆盖"三个规则集时结果页只显示两栏"。

### 之外

- iOS / App Store：维持 Phase 3 的结论，等有真实用户反馈再定。
- IAA 复核：不做（用户决定）。
- 难民的 dependant（PD-067）：原文没有依据，继续短路，不建模。

## 3. 验收总则

同 Phase 3：gate 全过；新规则三组用例与 fixture；来源定位齐全；UI 改动 Fable 浏览器走查；一个逻辑改动一次 commit；合并后 push main 自动部署。

## 4. 用户决定（2026-11-04）

1. **4.2 的路线范围**：HK BN(O)、Global Talent、家庭伴侣三条都做；难民的现行法律栏留到下一波。
2. **每周自动来源核对的 GitHub Actions**：加（4.4），只输出日志、不开 issue、不阻塞部署。
3. **/about 的反馈渠道**：要；具体渠道（GitHub issue 需仓库公开 / mailto 需指定邮箱 / 表单）待用户指定后作为 4.3 的补充任务派给 astra。
4. **版本化**：除文档（4.7）外还要实现（4.8，Wave 2）。
