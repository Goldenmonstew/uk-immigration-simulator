# PROGRESS

## 2026-11-04

| # | 改动描述 | 涉及文件 |
|---|---|---|
| 1 | 初始化 git 仓库；归档研究报告与官方回应 PDF（CP 1707）；撰写项目梳理 / 改进点 / 分工方案；建立来源登记表 | .gitignore, PROGRESS.md, docs/00-project-analysis-and-plan.md, docs/SOURCES.md, docs/research/2026-11-03-deep-research-report.md, policy-sources/2026-11-02-cp1707-a-fairer-pathway-to-settlement-government-response.pdf |
| 2 | AGENTS.md 工作约定、CLAUDE.md、Phase 0 任务 brief（0.1 / 0.3 / 0.4）、方案 §10 部署与客户端补充 | AGENTS.md, CLAUDE.md, docs/tasks/0.1-scaffold.md, docs/tasks/0.3-sources-register.md, docs/tasks/0.4-pending-details.md, docs/00-project-analysis-and-plan.md |
| 3 | AGENTS.md 增加不过度工程化规则；0.1 brief 收紧；Codex 推理等级改 xhigh | AGENTS.md, docs/tasks/0.1-scaffold.md, docs/00-project-analysis-and-plan.md |
| 4 | 合并 0.1 脚手架（sol，xhigh）：pnpm monorepo、engine / policy-data 空壳、Next.js 静态导出壳、CI；验收命令由 Fable 独立复跑通过 | package.json, pnpm-workspace.yaml, tsconfig.base.json, eslint.config.mjs, README.md, apps/web/**, packages/**, .github/workflows/ci.yml, docs/tasks/reports/0.1-scaffold.md |
| 5 | 0.2 引擎契约 brief；AGENTS.md 补 Codex 沙箱不能写 .git 的处理；方案 §9 记录"数据与 fixtures 用 TS 模块" | docs/tasks/0.2-engine-contracts.md, AGENTS.md, docs/00-project-analysis-and-plan.md, PROGRESS.md |

### 当前状态

- 已合并：0.1 脚手架。
- 进行中：0.3 来源登记（Opus 会话 sources-register）、0.4 未定事项与过渡安排（Opus 会话 pending-details）、0.2 引擎契约（Opus 会话，从 main 切 worktree）。
- Codex（astra / sol）启动参数（已验证）：`codex exec --skip-git-repo-check -C <worktree> -s workspace-write -c 'sandbox_workspace_write.network_access=true' -c 'approval_policy="never"' -c 'shell_environment_policy.inherit="all"' --add-dir ~/Library/pnpm --add-dir ~/.npm --add-dir ~/.cache -m <model> -c 'model_reasoning_effort="xhigh"' --color never -o <last.md> "$(cat brief.md)" < /dev/null`。沙箱拒绝写 `.git`（`writable_roots` / `--add-dir` 均无效），所以 Codex 不 commit，按 commit 分组写报告，Fable 审后替它提交。
- 下一步：0.2 合并后进入 Phase 1（Opus 规则与求解器、astra 问卷与结果页、sol fixtures 工具链与数据表）。
