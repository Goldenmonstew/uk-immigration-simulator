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

### 当前状态

- 已合并：0.1 脚手架、0.3 来源登记、0.4 未定事项与过渡安排。
- 待启动：0.2 引擎契约（提案卡片，需用户点击启动；brief 已按物理页码修正）。
- Phase 1 的输入备忘（交 Opus 顺手处理，不单独开任务）：`pending-details.md` 的 PD-003 / PD-019 / PD-035 可用 SRC-002/003/007/012 的核实结果更新；0.3 建议补登 Appendix Skilled Occupations（going rate 表）；0.4 §4.3 "主结论 + 参考结论" 的呈现建议已接受。
- 页码约定：SRC-001 的 `p<N>` 一律指 PDF 物理页序（封面 p1），用 `pdftotext -f N -l N` 定位，页数用 `pdfinfo`；不要用整份文本的换页符计数（空白页会被漏掉）。
- Codex（astra / sol）启动参数（已验证）：`codex exec --skip-git-repo-check -C <worktree> -s workspace-write -c 'sandbox_workspace_write.network_access=true' -c 'approval_policy="never"' -c 'shell_environment_policy.inherit="all"' --add-dir ~/Library/pnpm --add-dir ~/.npm --add-dir ~/.cache -m <model> -c 'model_reasoning_effort="xhigh"' --color never -o <last.md> "$(cat brief.md)" < /dev/null`。沙箱拒绝写 `.git`，所以 Codex 不 commit，按 commit 分组写报告，Fable 审后替它提交。
- 下一步：0.2 合并后进入 Phase 1（Opus 规则与求解器、astra 问卷与结果页、sol fixtures 工具链与数据表）。
