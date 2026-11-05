# Phase 6 规划（2026-11-05）

Phase 5 之后，现行法律栏覆盖用户常见路线的主申请人与主要 dependant，结果页有差距摘要，引擎有随机健壮性测试，仓库有 LICENSE。Phase 6 的主题是**收掉 Phase 5 发现的一致性问题、补 5 年伴侣路线的子女与财务替代、为 12 月的 Statement of Changes 做好触发准备**。分工继续向 Codex 倾斜：Opus 只做两项规则任务（6.2、6.4，另一项 6.6 待定），来源登记、web、测试全部由 sol / astra 承担。候选来源：`docs/tasks/phase-5-plan.md` §5、5.2 / 5.3 / 5.4 报告 §4、`docs/pending-details.md` PD-074。

原则不变：一个 package 一个 writer；规则语义只由 Opus 改；契约改动先 commit 再评审；每项政策数字带 `SRC-xxx` + 段号；不过度工程化；合并后自动 push 触发 CI 与部署。

已核实、不再列为任务的候选：check-sources 对 GOV.UK 页面已按归一化的 `<main>` 正文比较（4.4）；web 路线名已复用 policy-data 显示名表（`apps/web/i18n/routes.ts`）；web 的 `policyAsOf` 已取所显示两栏参数 `asOf` 的较晚者（`apps/web/lib/policy.ts`，引擎侧固定值在 6.2 顺手改）；HC 584 剩余两批生效（2026-11-30 的 APP ST8–ST10、2026-12-09 的 APP EU16）只涉及 Appendix Student 与 Appendix EU，不涉及本仓库登记的 Appendix；截至 2026-11-05 没有新的 Statement of Changes 提交（最近一份仍是 2026-09-03 的 HC 584），Earned Settlement 的规则仍待 12 月起分批提交（SRC-002 col 593）。

## 1. 任务总览

| # | 任务 | 负责 | 改动范围 | 依赖 | 波次 |
|---|---|---|---|---|---|
| 6.1 | 登记 Immigration Rules Part 8（SRC-029：para 298 / 298A 的 child settlement）；补 SRC-023 / 026 / 027 / 028 "常用定位"的 partner / child settlement 段 | sol | `policy-sources/`、`docs/SOURCES.md`、`apps/web/lib/sources.ts`（只加行） | 无 | 1 |
| 6.2 | 引擎一致性与 PD-074（契约 §16 先行）：(a) 结论依据 `decidedBy`；(b) dependant 判断主申请人路线不再靠 `pathwayYears`；(c) Legacy UKRS 非法入境的短路与其他保护类一致；(d) 引擎 `policyAsOf` 取参数 `asOf`；(e) 6.1 合并后按 para 298 建模 5 年伴侣路线的子女 | Opus | `packages/engine`、`packages/policy-data/src/parameters`、`fixtures/**`、`docs/contracts.md` §16、`docs/pending-details.md` | (e) 依赖 6.1 | 1（a–d）/ 2（e） |
| 6.3 | web 跟进：差距摘要只列结论所依据候选的规则；范围文案加 5 年路线子女 | astra | `apps/web` | 6.2 契约合到 main | 2 |
| 6.4 | 5 年伴侣路线的储蓄（E-LTRP.3.1(b) / 3.7(b)，定居阶段按 E-ILRP.1.3(1A) 不乘 2.5）与伴侣领取特定福利（E-LTRP.3.3）；契约 §17 先行 | Opus | 同 6.2 | 无（6.2 之后同一会话） | 2 |
| 6.5 | 问卷输入：现金储蓄、伴侣领取特定福利；分享链接校验 | astra | `apps/web` | 6.4 契约合到 main | 2 |
| 6.6 | Innovator Founder 的伴侣与子女（待定）：INNF 34.1–INNF 40.1 | Opus | `packages/engine`、`fixtures/**`、契约 §18 | 6.1 定位；用户决定 | 3 |
| 6.7 | 随机测试覆盖新字段与 `decidedBy` 不变量 | sol | `packages/engine/test/random.test.ts` | 6.2、6.4 合并后 | 3 |
| 6.8 | 12 月 Statement of Changes 准备：监控与触发（§5） | Fable | — | 外部事件 | — |

## 2. 任务卡

### 6.1 来源登记与定位补充（sol）

- SRC-029：Immigration Rules Part 8: family members（https://www.gov.uk/guidance/immigration-rules/immigration-rules-part-8-family-members）。做法同 5.1：整页快照 `policy-sources/<版本日>-immigration-rules-part-8-family-members.html`（版本日取 Content API `public_updated_at`，2026-11-05 查为 2026-08-03，核对对应的 Statement of Changes 编号）、sha256、`docs/SOURCES.md` 一级来源表一行，"常用定位"记 para 298 各项：(i)(a)–(e)（父母双方或一方 / 近亲在英国已定居或同时获批定居的五种情形）、(ii)(a)–(f)（曾持限期许可，且未满 18 岁，或以定居为目的获批 para 302 / Appendix FM 许可等）、(iii)（未独立生活、未婚、未另组家庭）、(iv)–(v)（由父母 / 近亲提供住宿与生活费，不依赖 public funds）、(vi)（Part Suitability）、(vii)（18 岁以上须按 Appendix KoLL 满足英语与 Life in the UK）；para 298A（仅因 (i) / (ii) 不满足时的 permission to stay）；para 302 的位置（(ii)(b) 引用）。
- 在 SRC-023 / SRC-026 / SRC-027 / SRC-028 的"常用定位"各补一段 partner / child settlement 的段号与一句要点，不解释规则：STP 6.1–STP 11.3（STP 8.3、9.1–10.1 已 DELETED）；UKA 28.1–UKA 34.2（UKA 31.1–32.2 已 DELETED，伴侣是否无合格期只记"快照未列"，不下结论）；INNF 32.1–INNF 40.1（INNF 37.1 伴侣连续 5 年、INNF 38.1 连续居留、INNF 39.1–39.2 英语分段、INNF 40.1 KOL）；PL 26.1–PL 33.5（英国出生子女）。
- `apps/web/lib/sources.ts` 加 SRC-029 一行；`check-sources` 全部 unchanged。
- 验收：gate；sha256 与 Content API 版本核对；Fable 用 python 去标签后抽查段号。

### 6.2 引擎一致性与 PD-074（Opus，契约 §16 先行）

- (a) 结论依据：`SettlementAssessment.decidedBy?: RuleId[]`——`decide()` 所选候选的规则 ID（`LIKELY_ELIGIBLE` 的通过候选、`POTENTIALLY_ELIGIBLE` 的首个未知候选、`LIKELY_NOT_ELIGIBLE` 时投影的候选），按该栏 `rules[]` 顺序，无候选（短路、无路径）时缺省。字段名与语义由契约定，web 只读它。
- (b) dependant 逻辑改用主申请人结论的依据（而不是 `pathwayYears = 10`）判断主申请人走的是 SETF 10 年还是 Long Residence 10 年（5.4 报告 §4）；GT / HK / 家庭子女读主申请人"最后一个主申请人片段"的做法写进假设。
- (c) Legacy UKRS（`LEGACY_SAFE_AND_LEGAL` 与由 UKRS 推导出的 Legacy）主申请人成年后非法入境：不再因 `esCurrentGroup` 为 `OUTSIDE_FRAMEWORK` 被 `IMMIGRATION_BREACH` 短路，现行法律栏按 STP 给结论，改革栏按原有 Legacy 处理（5.2 报告 §4；3.4 / 4.5 的短路设计只改这一点）。
- (d) `SimulationResult.policyAsOf` 改为本次评估各规则集参数 `asOf` 的较晚者（`evaluate.ts` 现在固定取 `earnedSettlement2026_11.asOf`）。
- (e) 6.1 合并后：PD-074——主申请人最后一个 Appendix FM 主申请人片段为 `PARTNER_FIVE_YEAR` 时，子女（`dependantOf: 'PARENT'`）按 Part 8 para 298 随父母定居：候选起点取主申请人现行法律栏的到期日（298(i)(a) / (d)：父母已定居或同时获批），子女本人不需要合格期；298(ii)(a) 未满 18 岁或 (ii)(b) 以定居为目的获批 Appendix FM 子女许可（`role: 'DEPENDANT'` 的 FM 片段视为满足，写进假设）；298(vii) 18 岁以上按 Appendix KoLL（SRC-025）核英语与 Life in the UK，未满 18 岁不核；(iii)–(vi) 写假设。`CL-SCOPE` 不再对这类子女输出 UNKNOWN；PD-074 标"已关闭（SRC-029）"。fixture：父母差一天到期 → 子女投影同日；18 岁以上子女未填英语 → UNKNOWN。
- 顺手：`pnpm --filter @uk-immigration/engine exec prettier --write test/es-residence.test.ts`（5.2 报告 §4，单独一个 commit）。
- 顺序：(a)–(d) 不依赖 6.1，契约 §16 commit 后 Fable 评审再实现；(e) 在 6.1 合并后做，补进同一节。
- 验收：gate；原有 fixtures 的 `expected` 不改；`decidedBy` 为 `rules[]` 子集；随机测试通过；Fable 对照快照核 para 298 的段号与 KoLL 定位。

### 6.3 web 跟进（astra，6.2 契约合到 main 后）

- 差距摘要（`apps/web/lib/gap-summary.ts`）：有 `decidedBy` 时只列其中的 FAIL / UNKNOWN 规则——其他候选路径的失败不再出现在"还差什么"；没有 `decidedBy` 时保持现状。"为什么"列表与"去 What-if 试试"映射不变。
- 范围文案（`home.scope`、`about.currentLawScope`，中英）：dependant 覆盖加"Appendix FM 5 年路线伴侣的子女（Part 8 第 298 段）"，去掉"5 年路线子女仍信息不足"。
- 测试：差距摘要按 `decidedBy` 过滤；英文模式无中文。
- 验收：浏览器：HK BN(O) 主申请人未满 5 年 → 摘要不再列 Long Residence 的失败；5 年路线子女场景 → 现行法律栏随父母；英文；375px。

### 6.4 5 年伴侣路线的储蓄与福利替代（Opus，契约 §17 先行，与 6.2 同一会话顺序做）

- 字段：`PersonTimeline.cashSavings?: number`（申请人与伴侣合计现金储蓄，GBP，E-LTRP.3.2 允许的来源）；`PersonTimeline.partnerSpecifiedBenefit?: boolean`（伴侣领取 E-LTRP.3.3(a) 列明的福利）。
- 规则：`CL-FAMILY-FINANCIAL` 在收入不足时按 E-LTRP.3.1(b)（过渡：E-LTRP.3.7(b)）计储蓄——定居阶段 E-ILRP.1.3(1A) 去掉 "2.5 times"，即储蓄 ≥ £16,000 + 收入缺口即通过；£16,000 进参数文件并带 E-LTRP.3.1(b)(i) 定位；Appendix FM-SE 的持有期只写假设。`partnerSpecifiedBenefit` 为真时改为 adequate maintenance 要求（E-LTRP.3.1(c)、E-LTRP.3.3(b)），没有数字门槛：建议输出 `UNKNOWN` + 新 PD（adequate maintenance 的口径），不按假设通过。
- fixture：收入 £20,000 + 储蓄 £25,000 → 财务规则通过（缺口 £9,000 ≤ £25,000 − £16,000）；储蓄 £24,000 → FAIL；伴侣领福利 → UNKNOWN。
- 验收：gate；参数定位对照 SRC-024 快照（E-LTRP.3.1(b)(i)–(ii)、E-LTRP.3.7(b)、E-ILRP.1.3(1A)、E-LTRP.3.3）。

### 6.5 问卷输入（astra，6.4 契约合到 main 后）

- 收入步骤：主申请人有 5 年伴侣路线片段时显示"现金储蓄（本人与伴侣合计，£）"数字输入（空 = 缺省）；福利步骤加复选框"我的伴侣领取 E-LTRP.3.3 列明的福利"（清单文案按契约）。字段在 timeline 上，不随片段清空（由契约定）。
- `share.ts` 校验；What-if 不加控件。
- 测试：两个字段进入请求；非法值拒绝；英文无中文。
- 验收：浏览器：收入 £20,000 + 储蓄 £25,000 → 现行法律栏财务规则通过；英文；375px。

### 6.6 Innovator Founder 的伴侣与子女（Opus，待定）

- INNF 34.1（P 已定居或同时获批）、INNF 37.1（伴侣连续 5 年持伴侣许可）、INNF 38.1（连续居留）、INNF 39.1–39.2（英语，2027-03-26 分段）、INNF 40.1（KOL）；子女 INNF 36A.1（Appendix Children），无合格期。做法同 5.4 的 Global Talent dependant。
- 不做（继续 `CL-SCOPE` UNKNOWN）：保护类 dependant（STP 6–11；dependant 整体被 PROTECTION 短路，改动面大、用户少）、UK Ancestry dependant（UKA 31–32 已 DELETED，伴侣是否无合格期需另核）、Private Life 英国出生子女（PL 26–33）。

### 6.7 随机测试覆盖新字段（sol，6.2 / 6.4 合并后）

- `packages/engine/test/random.test.ts`：生成器加 `cashSavings`、`partnerSpecifiedBenefit`（随机填或缺省）；新增不变量按契约 §16 写：`decidedBy` 若有值则非空、每个 ID 都在该栏 `rules[]` 里且不重复、有 `pathwayYears` 时必有 `decidedBy`；中英一致包含 `decidedBy`。不改 `src/**`；发现问题报告给 Opus。
- 验收：本机 2000 例通过；运行时间 < 30 秒。

## 3. 验收总则

同 Phase 5：gate 全过；新规则有 fixture 与三组用例；来源定位齐全；UI 改动 Fable 浏览器走查（含英文与 375px）；一个逻辑改动一次 commit；合并后 push main 自动部署。

## 4. 用户决定（2026-11-05）

1. **6.4 储蓄与福利替代**：做。
2. **6.6 Innovator Founder 的 dependant**：暂不做；保护类 / UK Ancestry / Private Life 的 dependant 本阶段也不做。
3. **分工**：维持 `AGENTS.md`，规则语义仅 Opus；sol / astra 承担 6.1、6.3、6.5、6.7。
4. Wave 1 于 2026-11-05 派发：sol 6.1（`docs/tasks/6.1-part-8-and-dependant-locators.md`）、Opus 6.2（`docs/tasks/6.2-engine-consistency-pd-074.md`，契约先行）。

## 5. 12 月 Statement of Changes 的触发（Fable）

- 每周一 06:00 UTC 的 Check sources 工作流（下一次 2026-11-09）报 changed → 按 `docs/versioning.md` §2–§3 由 sol 登记新快照（不覆盖旧快照）。HC 584 剩余两批生效不涉及已登记 Appendix，预计 unchanged。
- Earned Settlement 的 Statement of Changes 提交后（内政大臣：自 12 月起分批提交，2027 年起生效）：6.9 sol 登记 Statement of Changes、Explanatory Memorandum 与受影响 Appendix 的新快照；6.10 Opus 按 §4 新建 `current-law-<生效年月>`（`IN_FORCE_FUTURE_VERSION`）或升版 `earned-settlement-<年月>`，契约先列沿用 / 新写规则；6.11 astra 两栏选择与徽章、/policy 列表；6.12 sol 随机测试与全文案导出。届时另写任务书，不在本阶段预做。

## 6. 波次

- Wave 1（并行）：sol 6.1；Opus 6.2(a)–(d) 契约 → Fable 评审 → 实现 → 合并。
- Wave 2：Opus 6.2(e)（6.1 合并后）→ 6.4 契约 → 实现；astra 6.3（6.2 契约合到 main 后）→ 6.5（6.4 契约合到 main 后）。
- Wave 3：sol 6.7；6.6 若用户要。
- 三个 writer 互不碰同一 package：sol 只改 `policy-sources/`、`docs/SOURCES.md`、`apps/web/lib/sources.ts` 一行与 `random.test.ts`；Opus 只改 `packages/engine`、`packages/policy-data` 参数与 fixtures、契约与 PD；astra 只改 `apps/web`。6.1 合并后 astra 才开始 6.3，避免 `apps/web/lib/sources.ts` 冲突。
