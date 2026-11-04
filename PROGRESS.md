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

### 当前状态

- **Phase 0 全部完成并合并到 main**：0.1 脚手架、0.2 引擎契约、0.3 来源登记、0.4 未定事项与过渡安排。
- 已定口径（Phase 1 规则按此执行）：
  - 已公布未生效的规则集（`ANNOUNCED_NOT_IN_FORCE`）按"假设在 `simulationDate` 适用"评估，"未生效"由 `RuleSet.status` 表达；`POLICY_NOT_YET_IN_FORCE` 只在规则集有已知 `effectiveFrom` 且晚于模拟日、或结论取决于未定生效日的过渡情形时使用。
  - 多重命中（同时符合框架外 / 过渡 / 标准路径）：主结论 + 参考结论并列，声明"原文未规定取舍"（0.4 §4.3）。
  - 10 年路径收入口径按 Table 1（7 年中 5 年），声明假设并引用 PD-041。
- Phase 1 的输入备忘（交 Opus 顺手处理）：`pending-details.md` 的 PD-003 / PD-019 / PD-035 可用 SRC-002/003/007/012 的核实结果更新；0.3 建议补登 Appendix Skilled Occupations（going rate 表）；`RULE_SETS['current-law-2026-11'].sources` 的 locator 还只到 Appendix 级别；fixture 用相对路径 `import type` 引 engine 类型（避免包依赖成环），暂时接受；`RuleResult.explanation` 与 UI i18n key 的对接待定。
- 页码约定：SRC-001 的 `p<N>` 一律指 PDF 物理页序（封面 p1），用 `pdftotext -f N -l N` 定位，页数用 `pdfinfo`；不要用整份文本的换页符计数（空白页会被漏掉）。
- Codex（astra / sol）启动参数（已验证）：`codex exec --skip-git-repo-check -C <worktree> -s workspace-write -c 'sandbox_workspace_write.network_access=true' -c 'approval_policy="never"' -c 'shell_environment_policy.inherit="all"' --add-dir ~/Library/pnpm --add-dir ~/.npm --add-dir ~/.cache -m <model> -c 'model_reasoning_effort="xhigh"' --color never -o <last.md> "$(cat brief.md)" < /dev/null`。沙箱拒绝写 `.git`，所以 Codex 不 commit，按 commit 分组写报告，Fable 审后替它提交。
- 下一步（待用户确认开始 Phase 1）：Opus 写 MVP-0 规则与求解器；astra 写问卷流与结果页（先用契约 mock）；sol 写 fixtures 工具链、CI 跑 fixtures、禁裸数字门槛 lint、路线 / Annex C 数据表、i18n 脚手架。
