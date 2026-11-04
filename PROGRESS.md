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
| 13 | 1.4 brief；合并 1.4 前端对接真实规则（astra）：web 显式依赖 policy-data、福利下拉用数据表两组、政府债务交 ES-DEBT、引擎短路保留两栏、路线分组 / 政府未定细节标签 / 假设折叠、真实引擎回归测试；Fable 独立复跑 gate 并用内置浏览器走查六条路径（债务、SW £55k、HK BN(O) 短路、Visit、mock=1、375px）；brief 验收示例 Visit 改为 HK BN(O)（Visit 属 NOT_COUNTING） | docs/tasks/1.4-web-integration.md, apps/web/**, pnpm-lock.yaml, docs/tasks/reports/1.4-web-integration.md, PROGRESS.md |
| 14 | Phase 2 规划：docs/tasks/phase-2-plan.md（六张任务卡、两波次、验收总则、待用户决定三项）；方案 §6 加 Phase 2 指针 | docs/tasks/phase-2-plan.md, docs/00-project-analysis-and-plan.md, PROGRESS.md |
| 15 | Phase 2 Wave 1 派发：三份 brief（2.1 What-if / 2.2 家庭建模 / 2.3 部署与变更日志）；astra、sol 各在 `.worktrees/` 以 xhigh 启动，Opus 会话 dependants-2-2 以 high 启动（契约先行，Fable 评审后再写规则） | docs/tasks/2.1-whatif-lab.md, docs/tasks/2.2-dependants.md, docs/tasks/2.3-deploy-changelog.md, PROGRESS.md |

### 当前状态

- **Phase 1 四个任务全部合并到 main**（1.1 规则引擎、1.2 问卷与结果页、1.3 fixtures 与机械检查、1.4 前端对接真实规则）。`pnpm lint && pnpm typecheck && pnpm test && pnpm build` 在 main 全过：engine 129 个测试、policy-data 2 个、web 23 个；10 个官方 fixture 全部真实断言通过。
- 1.4 验收记录：债务 = 是 → 走完问卷，Earned Settlement 栏 ES-DEBT 未满足、不给年限；债务 = 否 → 两栏 5 年 / 2030-01-01，路线分组显示"核心许可 · Core Permission"；最近一段为 Hong Kong BN(O) → 页首 OUTSIDE_FRAMEWORK 提示且现行法律栏仍评估；Visit → 无提示、ES-ROUTE-GROUP 未满足；福利下拉两组（38 + 13 项）可选，Statutory Maternity Pay 判为不算 public funds；`?mock=1` 显示路线分组与"政府未定细节：PD-012、PD-013"；假设清单默认折叠、点击展开；375px 无横向溢出。
- 已知小项（不阻塞）：`?mock=1` 现行法律栏 LIKELY_ELIGIBLE 未给 pathwayYears（手写示例）；"修改输入"回到问卷第 1 步而非最后一步（1.2 起如此）；犯罪 / 违规 / 庇护筛查仍是前端合成短路（契约缺无日期形式与庇护字段，Phase 2 再补）。
- 1.1 报告列出的未建模项（Phase 2 候选）：SW 21.2 其他可计入路线合并、going rate（需登记 Appendix Skilled Occupations）、SW 24.3 rows B–E、dependant 随主申请人定居（PD-055）、RQF6 以下医疗 / 教育与 2024 前 Skilled Worker 两项过渡安排、难民路径、Highest Talent Group、强制要求 FAIL 时的"补足后"推算。
- 已定口径（见上）：已公布规则集按"假设在模拟日适用"评估；居留不足 → ES-RESIDENCE FAIL + earliestDate；INSUFFICIENT_INFORMATION 不显示 pathwayYears；dependant 两栏 INSUFFICIENT_INFORMATION；CL-ENGLISH 按快照原文（SW 主申请人 2027-03-26 前无定居英语要求）；引擎短路 PROTECTION / OUTSIDE_FRAMEWORK 只停 Earned Settlement 栏。
- 本地预览：`.claude/launch.json`（gitignored）`web-static-astra` 用 `scratchpad/serve/static.mjs` 托管 main 的 `apps/web/out`（先 `pnpm build`）。
- 页码约定与 Codex 启动参数不变。
- Phase 2 规划已写入 `docs/tasks/phase-2-plan.md`：Wave 1 = 2.1 What-if（astra）、2.2 dependant 与家庭建模（Opus，契约先行）、2.3 Cloudflare Pages 部署 + 政策变更日志数据（sol）；Wave 2 = 2.4 家庭问卷 + 政策页（astra）、2.5 现行法律补全与剩余过渡安排（Opus）；2.6 going rate、2.7 分享链接可选。
- 待用户决定：是否建 GitHub 远端（目前无 remote）；IAA 复核安排在绑定正式域名前；可选项取舍。
- Wave 1 进行中（2026-11-04 派发）：2.1 astra 在 `.worktrees/astra-whatif`（分支 `codex/astra-whatif-2.1`）；2.3 sol 在 `.worktrees/sol-deploy`（分支 `codex/sol-deploy-2.3`）；2.2 Opus 会话 dependants-2-2（自己的 worktree，第一个 commit 只做契约，等 Fable 评审）。Codex 日志与最终消息在 scratchpad `astra-2.1*` / `sol-2.3*`。
- 用户问题待答（已在对话里回复）：仓库名建议 `uk-immigration-simulator`；IAA 复核 = 上线正式域名前由 IAA 注册顾问 review 结果页措辞；going rate / 分享链接 / en 文案均为可选项，默认不进 Phase 2。
- 下一步：评审 2.2 契约 → 验收三个任务 → 合并 → 派发 Wave 2（2.4 家庭问卷 + 政策页、2.5 现行法律补全）。
