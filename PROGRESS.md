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

### 当前状态

- Phase 0 全部完成。Phase 1 进行中：1.1 规则与前向推算（Opus 会话 rules-mvp0，运行中）、1.2 问卷与结果页（astra，`.worktrees/astra-web`，运行中）、1.3 已合并。
- 已定口径（Phase 1 规则按此执行）：
  - 已公布未生效的规则集按"假设在 `simulationDate` 适用"评估，"未生效"由 `RuleSet.status` 表达；`POLICY_NOT_YET_IN_FORCE` 只在规则集有已知 `effectiveFrom` 且晚于模拟日、或结论取决于未定生效日的过渡情形时使用。
  - 居留年限不足但无其他 FAIL：`ES-RESIDENCE` 对该路径 FAIL → `LIKELY_NOT_ELIGIBLE`（截至模拟日），同时给 `earliestDate`。
  - 多重命中：主结论 + 参考结论并列（0.4 §4.3）；10 年路径收入口径按 Table 1（PD-041）。
- 1.3 报告提出、留给 1.1 / 契约的点：p31 伴侣案例缺主申请人关联字段（只做主申请人视角）；care worker 缺担保 / 真实雇佣证据字段（由 socCode + salary 近似）。
- 页码约定与 Codex 启动参数不变（见上一节）。
- 下一步：验收 1.2 与 1.1 并合并；之后 Phase 2 规划（What-if、政策版本库）。
