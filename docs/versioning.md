# 规则集版本化流程（任务 4.7，2026-11-04）

Statement of Changes 落地时怎么把新规则引入引擎而不弄乱旧结论。只写流程与约定，不预先实现任何版本切换代码（用户决定：等 12 月的 Statement of Changes 真正提交后再开实现任务）。

## 1. 现状

- 两个规则集：`current-law-2026-11`（`kind: 'LAW'`、`status: 'CURRENT_LAW'`）与 `earned-settlement-2026-11`（`kind: 'ANNOUNCED'`、`status: 'ANNOUNCED_NOT_IN_FORCE'`），定义在 `packages/engine/src/evaluate.ts` 的 `RULE_SETS`，ID 的类型在 `packages/policy-data/src/types.ts` 的 `RuleSetId`。
- 每个规则集一个参数文件（`packages/policy-data/src/parameters/<rule-set-id>.ts`，`ruleSetId` + `asOf` + `values`，每个值带 `SRC-xxx` 定位），规则在 `meta.ruleSetId` 上归属规则集，fixtures 的 `expected.ruleSetId` 指明断言哪一栏。
- web 的 `apps/web/lib/policy.ts` 把 `RULE_SETS` 的全部值当作结果页的栏，`policyAsOf` 取 `earnedSettlement2026_11.asOf`；结果页两栏的标题与徽章来自 `kind` / `status`。
- `RuleSet.status` 已预留 `'IN_FORCE_FUTURE_VERSION'`（已立法、未生效）。
- 时间表（SRC-002 / SRC-003）：Immigration Rules 的修改自 2026-12 起分批提交（laid），2027-01 起陆续生效，2027–2028 还有后续批次；具体生效日以届时的 Statement of Changes 为准，在它出现前引擎把生效日视为 `UNKNOWN`。

## 2. 触发与发现

1. `node packages/policy-data/scripts/check-sources.mjs` 报某个 Appendix 的正文变化，或 gov.uk "Statement of changes to the Immigration Rules" 出现新的 HC 编号（SRC-011 / Content API 的 `change_history` 也能看到）。
2. 先登记，再判断影响面；不要在确认来源前改任何规则。

## 3. 登记（sol）

1. Statement of Changes 本体与 Explanatory Memorandum 各登记为新 `SRC-xxx`（LAW；PDF 快照 + sha256；"常用定位"记：生效日条款、涉及的 Appendix 清单、过渡条款段号）。
2. 受影响的 Appendix 重新抓快照：**不覆盖旧快照**（文件名带版本日，旧文件留在 `policy-sources/`），`docs/SOURCES.md` 该 SRC 行改指新版本（版本日、Statement of Changes 编号、新 sha256），"登记备注"里保留旧版本的文件名与版本日一行，方便旧规则集继续引用。
3. 段落号若重排（例如 SW 24.3 变成 SW 24.4），在该 SRC 的"常用定位"写一张"旧段号 → 新段号"对照，只列引擎引用过的段。
4. `apps/web/lib/sources.ts` 同步加行；`policy-changelog.ts` 加一条（日期为提交日或生效日，各一条也可），中英各一份。

## 4. 新规则集（Opus，契约先行）

1. 命名：`<kind>-<生效年月>`。规则**生效**后进入现行法律：`current-law-2027-01`；只是**提交但未生效**：仍用 `current-law-2026-11` 作现行法律，另建 `current-law-2027-01` 并标 `status: 'IN_FORCE_FUTURE_VERSION'`（`sources` 里写生效日）；Earned Settlement 中**尚未立法**的部分保留在 `earned-settlement-2026-11`（或按新政策文件升版为 `earned-settlement-<年月>`）。同一时刻 `RULE_SETS` 里可以有三个规则集。
2. `RuleSetId` 加新成员；新参数文件从旧文件复制后逐项核对来源，改动的值换成新 SRC 定位，没变的值保留原定位并在注释里写"沿用 <旧版本>"；`asOf` 为核对日。
3. 规则：按规则集一份。没有变化的规则**不复制代码**——规则工厂（`defineRule`）接受 `ruleSetId`，同一 check 函数可注册到两个规则集，只有参数与来源不同；语义变了的规则在新规则集下写新版本，旧版本不动。契约（`docs/contracts.md` 新一节）先列：哪些规则沿用、哪些新写、候选路径表有无变化、短路有无变化。
4. fixtures：旧 fixtures 的 `expected.ruleSetId` 指向旧规则集，继续通过；新规则集按官方案例或自拟各加 fixture；`bilingual.test.ts` 的快照按规则集分节。
5. `docs/pending-details.md`：被新规则解决的 PD 标"已关闭（<SRC>）"，不删行；新出现的未定事项照常登记。
6. 全文案导出（`pnpm --filter @uk-immigration/engine export:wording`）按规则集分节重新生成。

## 5. web（astra）

1. 结果页仍只显示**两栏**：`kind: 'LAW'` 且 `status: 'CURRENT_LAW'` 的那个，和"用户关心的下一版"——有 `IN_FORCE_FUTURE_VERSION` 时显示它（徽章"已立法，YYYY-MM-DD 起生效"），否则显示最新的 `ANNOUNCED`。选择逻辑放在 `apps/web/lib/policy.ts`，不改引擎。
2. `policyAsOf` 改为所显示两栏 `asOf` 的较晚者；/policy 页列出全部规则集（含未显示的），标明状态与来源。
3. What-if 与本机情景不需要改：它们按当前显示的两栏重算。
4. 旧规则集被移除时（见 §6），分享链接与本机情景里只有输入、没有规则集 ID，不受影响。

## 6. 保留与退役

- 新规则集合并后，旧规则集**至少保留到下一个阶段结束**（给用户一个"之前 / 之后"的对照期，也给 fixtures 一个过渡期）；退役时一次 commit 删除：`RULE_SETS` 条目、参数文件、只属于它的规则与 fixtures、快照里对应的分节。快照文件（`policy-sources/`）永不删除。
- `RuleSetId` 的旧成员删除后，`docs/contracts.md` 相应小节加一行"已退役（日期、commit）"，不删正文。

## 7. 一次版本升级的检查清单

1. [ ] Statement of Changes 与 Explanatory Memorandum 已登记（SRC、sha256、生效日）。
2. [ ] 受影响 Appendix 新快照已登记，旧快照保留，段号对照已写。
3. [ ] 契约评审通过（规则集 ID、参数文件、沿用 / 新写规则清单、候选路径、短路）。
4. [ ] 新参数文件每个值都有新 SRC 定位或"沿用"注释。
5. [ ] 旧 fixtures 不变；新 fixtures 覆盖官方案例；快照分节。
6. [ ] `policy-changelog.ts` 有条目；PD 关闭与新增已登记；全文案重新导出。
7. [ ] web 两栏选择逻辑与徽章文案（中英）更新；/policy 列出全部规则集。
8. [ ] gate 全过；Fable 在浏览器核对两栏标题、徽章、`policyAsOf`；合并后自动部署，在 `*.pages.dev` 复核。
