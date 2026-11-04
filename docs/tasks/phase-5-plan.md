# Phase 5 规划（2026-11-04）

Phase 4 之后，现行法律栏覆盖 Skilled Worker、HK BN(O)、Global Talent、Appendix FM 伴侣与 Long Residence，改革栏覆盖全部计入路线，来源监控与版本化机制就绪，仓库公开、反馈入口上线。Phase 5 的主题是**把两栏补到用户常见路线全覆盖、让结果可行动、照顾香港群体的阅读习惯，并补上视觉与健壮性验收**。候选来源：`docs/tasks/phase-4-plan.md` §5、各任务报告 §4、`docs/pending-details.md`。

原则不变：一个 package 一个 writer；规则语义只由 Opus 改；契约改动先 commit 再评审；每项政策数字带 `SRC-xxx` + 段号；不过度工程化；合并后自动 push 触发 CI 与部署。

## 1. 任务总览

| # | 任务 | 负责 | 改动范围 | 依赖 | 波次 |
|---|---|---|---|---|---|
| 5.1 | 登记现行法律新来源：Appendix UK Ancestry、Appendix Innovator Founder、Appendix Private Life（各带快照、sha256、settlement 段号定位） | sol | `policy-sources/`、`docs/SOURCES.md`、`apps/web/lib/sources.ts`（只加行） | 无 | 1 |
| 5.2 | 现行法律栏扩展二：难民（SRC-023）、UK Ancestry、Innovator Founder、Private Life（5 / 10 年，与 SETF 的组合）；契约先行 | Opus | `packages/engine`、`packages/policy-data/src/parameters/current-law-2026-11.ts`、`fixtures/**`、`docs/contracts.md` §14、`docs/pending-details.md` | 5.1（难民部分不依赖） | 1（契约 + 难民）/ 2（其余） |
| 5.3 | 结果页"差距摘要"：每栏在结论下列出"还差什么"（未满足 / 未知规则各一句，来自 `rules[]`），并提供"去 What-if 试试"快捷入口（预填英语、收入、日期控件） | astra | `apps/web` | 无（纯 UI 聚合，不改引擎） | 1 |
| 5.4 | 现行法律栏的 dependant：HK BN(O)（HK 57–59）、Global Talent（GT 25–34）、Appendix FM / SETF 伴侣的子女；复用 2.2 的主申请人机制 | Opus | `packages/engine`、`fixtures/**`、`docs/contracts.md` | 5.2 合并后 | 2 |
| 5.5 | 问卷与结果页跟进：5.2 / 5.4 契约的新输入（如 Private Life 路线类型）、范围文案 | astra | `apps/web` | 5.2 契约合到 main | 2 |
| 5.6 | 引擎健壮性：随机时间线测试（自写生成器，不加依赖）——`evaluate` 不抛错、输出不变量（两栏键齐全、`LIKELY_NOT_ELIGIBLE` 时 `earliestDate` ≥ 申请日、`pathwayYears` 属已知集合、中英文输出结构一致）；发现的问题只报告，由 Opus 修（规则语义仍归 Opus） | sol（测试）+ Opus（修复） | `packages/engine/test/random.test.ts`；修复处 | 5.2 合并后 | 2 |
| 5.7 | 繁体中文界面（待定）：web 层把 zh-CN 文案与引擎中文解释按 OpenCC 转繁体（新依赖），语言切换加第三项，法律术语保留英文 | astra | `apps/web` | 用户决定 | 2 |
| 5.8 | 视觉验收补课：用无头 Chrome 截 375px 与打印预览（首页、问卷各步、结果、What-if、/policy、/about），记录并修发现的问题 | Fable 截图 + astra 修 | `apps/web`（如有问题） | 无 | 1 |
| 5.9 | 维护项（待定）：LICENSE 文件；PROGRESS.md 内部记录精简；12 月 Statement of Changes 落地后按 `docs/versioning.md` 升级（届时另开任务） | Fable | 根目录、`PROGRESS.md` | 用户决定 | — |

Wave 1 三个 writer 互不碰同一 package（sol 5.1；Opus 5.2 契约 + 难民部分；astra 5.3）。5.2 契约评审通过后单独合到 main，astra 的 5.5 按它做；5.4 与 5.6 在 5.2 之后由同一 Opus 会话顺序做。

## 2. 任务卡

### 5.1 登记现行法律新来源（sol）

- SRC-026 Appendix UK Ancestry（Content API 版本 2026-08-03）、SRC-027 Appendix Innovator Founder（2026-08-03）、SRC-028 Appendix Private Life（2026-10-08）：做法同 4.1 / 4.4（整页快照、sha256、版本依据交叉核对、"常用定位"记 settlement 的最近许可、合格期、连续居留、英语、KOL、suitability 段）。Private Life 另记 5 年（18 岁以下 7 年 / 18–24 岁半生等）与 10 年路线的区分段、与 Appendix Settlement Family Life 的衔接段。
- 验收：gate；sha256；段号抽查；`check-sources` 全部 unchanged。

### 5.2 现行法律栏扩展二（Opus，契约先行）

- 难民（SRC-023 Appendix Settlement Protection）：STP 1.3 的许可类别、STP 3.1 连续 5 年保护身份（不引用 Appendix Continuous Residence，缺席处理登记 PD）、STP 4.1–4.2 持续保护身份（用户自报，契约字段）、STP 5.2 不满足时的 30 个月续期（只写假设）；英语 / KOL 该 Appendix 未列——按快照实际内容建模，没有就不设要求并登记 PD（不从其他路线照搬）。现行法律栏对难民输出真实结论，与改革栏的 Table 2 对照。
- UK Ancestry 5 年、Innovator Founder 3 年：按各自 Appendix 的合格期、英语、KOL；Innovator Founder 的"业务要求"若有数字就建模，没有就 `UNKNOWN`。
- Private Life：5 年路线（18 岁以下 7 年 / 18–24 岁半生 / 其他 5 年）与 10 年路线，按 Appendix Private Life 与 SETF 的衔接；契约字段表达路线类型（如 `privateLifeRoute?`）。
- 不做：这些路线的 dependant（5.4）。
- 验收：gate；每条路线一个自拟 fixture；原有 fixture 结论不变；Fable 对照快照核段号与数字。

### 5.3 结果页差距摘要（astra）

- 每栏结论下方加"还差什么"：按 `rules[]` 的 `FAIL` 与带 PD 的 `UNKNOWN` 各列一句（规则标题 + 一句解释的首句），`LIKELY_ELIGIBLE` 时显示"已满足全部已建模要求"；`LIKELY_NOT_ELIGIBLE` 且有 `earliestDate` 时首行写"最早 {date}，还需 {n} 年 {m} 个月"。
- "去 What-if 试试"：按失败规则映射到 What-if 的控件（英语 → 等级下拉、收入 → 收入改写、public funds → 开关、日期 → 模拟日期），点击带参数跳转并预填（What-if 页读 URL 参数）；无映射的规则不显示按钮。
- 中英；375px；打印样式里也显示摘要；不改引擎输出、不加依赖。
- 验收：浏览器：Skilled Worker 未填英语 / 收入不足两个场景的摘要与跳转；英文模式；375px。

### 5.4 现行法律栏的 dependant（Opus，Wave 2）

- 复用 2.2 的 `principal` 机制：HK BN(O) 的 child / adult dependant relative（HK 57–59）、Global Talent 的伴侣与子女（GT 25–34）、Appendix FM / SETF 伴侣的子女（Appendix Children 与 SETF 15–16）；合格期与主申请人同时定居的条款按快照；三组用例、fixtures。

### 5.5 问卷与结果页跟进（astra，Wave 2）

- 按 5.2 / 5.4 契约加输入（Private Life 路线类型、难民持续保护身份等）、范围文案（`home.scope`、`about.currentLawScope`）。

### 5.6 引擎健壮性（Opus，Wave 2）

- `packages/engine/test/random.test.ts`：自写简单随机生成器（路线、片段数、日期、收入、英语、KOL、关系、违规、新字段的随机组合），固定种子跑 ≥ 2000 个时间线，断言不抛错与不变量；发现的崩溃或不变量破坏逐个修复，各一个 commit。

### 5.7 繁体中文界面（astra，待定）

- 若用户要：引入 OpenCC（`opencc-js`，纯 JS），在 `useTranslation` 与引擎解释渲染处按 locale 'zh-HK' 转换；语言切换"中文 / 繁體 / English"；`uk-immigration-locale` 存第三值；法律术语本来就是英文不受影响；测试覆盖转换后无简体残留的抽样。引擎 `Locale` 类型是否加 'zh-HK' 由契约决定（建议不加：引擎仍输出 zh-CN，web 转换）。

### 5.8 视觉验收补课（Fable + astra）

- Fable 用本机 Chrome 无头模式截图（`--headless --screenshot --window-size=375,812`）与打印（`--print-to-pdf`）跑一遍全部页面与问卷各步，问题清单交 astra 修（一个小任务）。

### 5.9 维护项（Fable，待定）

- LICENSE：用户选许可证（如 MIT）后加文件；PROGRESS.md 精简：把过程性备注移到 `docs/history/` 或删除；12 月 Statement of Changes 落地后按 `docs/versioning.md` §7 清单开任务。

## 3. 验收总则

同 Phase 4：gate 全过；新规则三组用例与 fixture；来源定位齐全；UI 改动 Fable 浏览器走查；一个逻辑改动一次 commit；合并后 push main 自动部署。

## 4. 用户决定（2026-11-04）

1. **5.2**：难民 + UK Ancestry + Innovator Founder + Private Life 四条都做（难民先写，其余等 5.1）。
2. **5.3 差距摘要**：做，含"去 What-if 试试"预填。
3. **5.7 繁体中文**：不做。
4. **5.9**：LICENSE 用 MIT（已加 `LICENSE`，版权署名 Goldenmonstew，快照部分注明 OGL / OPL）；PROGRESS 不精简。
5. **分工**：后期多用 Codex 的模型（astra / sol）承担任务，规则语义仍由 Opus 负责；所有任务继续遵守"不过度工程化"（本阶段起 5.6 的测试由 sol 写、修复归 Opus；5.8 的修正归 astra）。
