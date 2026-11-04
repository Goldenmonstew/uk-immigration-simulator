# PROGRESS

## 2026-11-04

| # | 改动描述 | 涉及文件 |
|---|---|---|
| 1 | 初始化 git 仓库；归档研究报告与官方回应 PDF（CP 1707）；撰写项目梳理 / 改进点 / 分工方案；建立来源登记表 | .gitignore, PROGRESS.md, docs/00-project-analysis-and-plan.md, docs/SOURCES.md, docs/research/2026-11-03-deep-research-report.md, policy-sources/2026-11-02-cp1707-a-fairer-pathway-to-settlement-government-response.pdf |
| 2 | AGENTS.md 工作约定、CLAUDE.md、Phase 0 任务 brief（0.1 / 0.3 / 0.4）、方案 §10 部署与客户端补充 | AGENTS.md, CLAUDE.md, docs/tasks/0.1-scaffold.md, docs/tasks/0.3-sources-register.md, docs/tasks/0.4-pending-details.md, docs/00-project-analysis-and-plan.md |
| 3 | AGENTS.md 增加不过度工程化规则；0.1 brief 收紧；Codex 推理等级改 xhigh | AGENTS.md, docs/tasks/0.1-scaffold.md, docs/00-project-analysis-and-plan.md |
| 4 | 合并 0.1 脚手架（sol，xhigh）：pnpm monorepo、engine / policy-data 空壳、Next.js 静态导出壳、CI；验收命令由 Fable 独立复跑通过 | package.json, pnpm-workspace.yaml, tsconfig.base.json, eslint.config.mjs, README.md, apps/web/**, packages/**, .github/workflows/ci.yml, docs/tasks/reports/0.1-scaffold.md |
| 5 | 0.2 引擎契约 brief；AGENTS.md 补 Codex 沙箱不能写 .git 的处理；方案 §9 记录"数据与 fixtures 用 TS 模块" | docs/tasks/0.2-engine-contracts.md, AGENTS.md, docs/00-project-analysis-and-plan.md, PROGRESS.md |
| 6 | SRC-001 页码改为物理页序（p2 以后 +1，页数 60→62）；§3 三处"待核对"更新为 0.3 的核实结论（SW 4.2 / SW 24.3、Hansard 栏号、SW 22A.1 B2 申请日分界、2030 vs 2035 过渡对照） | docs/00-project-analysis-and-plan.md, docs/tasks/0.2-engine-contracts.md, docs/tasks/0.4-pending-details.md |
| 7 | 合并 0.3 来源登记（Opus）：SRC-001–016 登记并归档，18 个快照 sha256 由 Fable 复核一致，30 个引用 ID 映射（27 确定 / 3 无法确认） | docs/SOURCES.md, policy-sources/*, docs/tasks/reports/0.3-sources-register.md |
| 8 | 合并 0.4 未定事项与过渡安排（Opus）：PD-001–052、过渡安排与框架外群体登记、引擎判断顺序建议；Fable 抽查 13 处页码 12 处命中 | docs/pending-details.md, docs/transitional-arrangements.md, docs/tasks/reports/0.4-pending-details.md |
| 9 | 合并 0.2 引擎契约（Opus）：engine 类型与 evaluate stub、policy-data 路线分类（35 条路线 / 7 组）、参数集（ES 2026-11 与现行法律）、官方案例 Individual C / D fixture、contracts.md；验收命令由 Fable 在临时 worktree 独立复跑通过，源文件逐一审过 | packages/engine/**, packages/policy-data/**, docs/contracts.md, docs/tasks/reports/0.2-engine-contracts.md |
| 10 | 契约补齐（rules[] 携带解释与来源；lifeInTheUk、earningsExemptHealth）；Phase 1 三份 brief；合并 1.3（sol）：8 个官方案例 fixtures（共 10 个）、来源一致性测试、engine/src 禁裸数字与隐式时钟 lint；Fable 独立复跑验收并用探针验证 lint；C / D 补 lifeInTheUk | packages/engine/src/types.ts, docs/contracts.md, docs/tasks/1.*.md, packages/policy-data/fixtures/**, packages/policy-data/test/sources.test.ts, eslint.config.mjs, docs/tasks/reports/1.3-fixtures-tooling.md |
| 11 | 合并 1.2 问卷流与结果页（astra）：首页、九步问卷（高风险前置短路、本机草稿）、双栏结果页、mock 预览、自写 i18n、CSS Modules；Fable 独立复跑验收命令并用内置浏览器走完五条路径（短路、完整 SW、mock 1/2、刷新保留、375px 无溢出），网络面板无用户数据请求 | apps/web/**, docs/tasks/reports/1.2-web-mvp0.md |
| 12 | 合并 1.1 MVP-0 规则与前向推算（Opus）：14 条 Earned Settlement 规则 + 6 条现行法律规则、候选路径聚合与最早日期推算、Annex C 与 public funds 数据表、PD-003/019/035 更新、PD-053–055 新增；Fable 独立复跑全套命令、通读代码、亲自跑六个场景、抽查 13 处来源；验收后三处修改（dependant 不按主申请人评估、信息不足不显示年限、PD-041/007 口径）已复核 | packages/engine/**, packages/policy-data/src/data/**, packages/policy-data/src/parameters/**, packages/policy-data/fixtures/es-p31-individual-a-partner-arrives-together.ts, docs/contracts.md, docs/pending-details.md, docs/tasks/reports/1.1-rules-mvp0.md |

### 当前状态

- **Phase 1 三个任务全部合并到 main**（1.1 规则引擎、1.2 问卷与结果页、1.3 fixtures 与机械检查）。`pnpm lint && pnpm typecheck && pnpm test && pnpm build` 在 main 全过：engine 129 个测试、policy-data 2 个、web 19 个；10 个官方 fixture 全部真实断言通过。
- 待派发 1.4（astra，前端对接真实规则，需用户确认）：
  - 福利下拉换成 `policy-data` 的 `publicFundsBenefits`（用 `name` 显示，`benefitType` 为值）。
  - 高风险筛查：政府债务改为设 `governmentDebt.outstanding = true` 交给 ES-DEBT 规则，不再合成 `OUTSIDE_FRAMEWORK` 短路；犯罪记录 / 违规筛查继续前端短路（契约的 `CriminalEvent` / `ImmigrationBreach` 需日期，Phase 2 再补无日期形式）。
  - `lib/policy.ts` / `mock-results.ts` 的相对路径引用改为 web 显式依赖 `@uk-immigration/policy-data`（允许改 package.json 与锁文件）。
  - 结果页：`routeGroup` 展示、`rules[].pendingDetails` 标记"政府未定"、假设清单去重后可能较长需折叠；用真实引擎跑一遍 brief 1.2 的路径截图核对。
- 1.1 报告列出的未建模项（Phase 2 候选）：SW 21.2 其他可计入路线合并、going rate（需登记 Appendix Skilled Occupations）、SW 24.3 rows B–E、dependant 随主申请人定居（PD-055）、RQF6 以下医疗 / 教育与 2024 前 Skilled Worker 两项过渡安排、难民路径、Highest Talent Group、强制要求 FAIL 时的"补足后"推算。
- 已定口径（见上）：已公布规则集按"假设在模拟日适用"评估；居留不足 → ES-RESIDENCE FAIL + earliestDate；INSUFFICIENT_INFORMATION 不显示 pathwayYears；dependant 两栏 INSUFFICIENT_INFORMATION；CL-ENGLISH 按快照原文（SW 主申请人 2027-03-26 前无定居英语要求）。
- 本地预览：`.claude/launch.json`（gitignored）`web-static-astra` 用 `scratchpad/serve/static.mjs` 托管静态导出；路径需改到 main 的 `apps/web/out`。
- 页码约定与 Codex 启动参数不变。
- 下一步：1.4 → Phase 2 规划（What-if 实验室、政策版本库与变更日志、Cloudflare Pages 部署、dependant 建模）。
