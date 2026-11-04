# AGENTS.md — 本仓库所有 agent 的工作约定

适用于在本仓库工作的所有 agent：Claude Code（Opus）、Codex CLI（astra / sol）等。Claude Code 通过 `CLAUDE.md` 引入本文件。

## 角色与边界

- Fable（统筹 / 验收）拆任务、写 brief、评审契约、验收并合并到 `main`；不写业务代码。
- 每个任务只做 brief 指定的范围。发现范围外的问题，写进最终报告的"发现与建议"，不要擅自实现。
- 一个 package 同一时间只有一个 writer：
  - `packages/engine` 与一切规则语义：仅 Opus
  - `apps/web`：仅 astra
  - 仓库脚手架、`packages/policy-data` 的 schema / 数据表 / fixtures 工具链、CI、lint：仅 sol
  - `docs/`、`policy-sources/`：按 brief 指定
- 不要修改 `PROGRESS.md`（由 Fable 在合并时更新）。不要修改 `AGENTS.md` / `CLAUDE.md`。

## 语言

- 与人沟通、commit message、文档：中文。
- 代码、注释、标识符、文件名：英文。法律术语保留英文原文（如 Skilled Worker、public funds、settlement）。

## 政策内容的硬规则

- 任何政策数字（门槛、年限、日期）必须能追溯到 `docs/SOURCES.md` 的 `SRC-xxx` + 页码或段落号；没有来源的数字不要写进代码、数据或文档。
- 规则语义只由 Opus 改；其他 agent 发现规则问题只报告。
- 政府未定的细节输出 `UNKNOWN`，并登记到 `docs/pending-details.md`；不要猜。
- 不要在代码里硬编码裸数字门槛，一律走 `packages/policy-data` 的参数文件。
- 不要用律所、媒体页面替代官方来源；二手来源只能用于交叉验证。

## Git

- 在自己的 worktree / 分支上工作；不要切换分支；不要 push；不要改 git 配置；不要 rebase 或改写历史。
- 一个逻辑改动一次 commit。格式：`Type: 简短描述`，Type 取 `Feat` / `Fix` / `Refactor` / `Test` / `Chore` / `Docs`；正文可写要点；末尾一行 `Co-Authored-By: <agent 名> <noreply@...>`，例如：
  - `Co-Authored-By: Codex gpt-6.1-sol <noreply@openai.com>`
  - `Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>`
  - `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
- 只 `git add` 本次改动相关的文件；不要提交 `node_modules`、构建产物、`.env`。
- commit 前必须通过 brief 里的验收命令。

## 验证

- 改了会影响编译或行为的代码：改完就跑 build、typecheck、test；失败立即修，不要留着做别的。
- 不要同时启动多个重型进程（并行 build、多个 dev server）。
- 不信任"成功提示"：验证实际结果（文件真的存在、测试真的运行、命令退出码为 0）。

## 不要过度工程化（用户明确要求）

- 只实现 brief 要求的东西，用最直接的写法。不要为了"健壮"加额外的校验、防御性分支、抽象层、配置项或工具链。
- 除非 brief 明确要求，不要加：husky / lint-staged / commitlint 等提交钩子；自定义校验脚本；对内部调用的参数防御检查；为"将来可能需要"预留的接口或泛化；多余的 try/catch；把简单函数拆成多个文件；额外的 CI job（安全扫描、依赖审计等）。
- 判断标准：删掉这段代码，brief 的验收命令会不会失败？不会就别写。
- 校验只在系统边界做一次（用户输入、外部数据文件），内部信任类型系统。
- 配置文件保持最小：ESLint 用 recommended 规则集，tsconfig 只开 strict 与必要选项，不复制模板里用不到的字段。

## 完成时的报告

最后一条消息按下面四段写，并把同样内容写入 brief 指定的 `docs/tasks/reports/<task-id>.md` 一并提交：

1. 做了什么（按 commit 列）
2. 怎么验证的（命令 + 结果）
3. 没做或没验证的
4. 发现与建议（范围外，不实现）
