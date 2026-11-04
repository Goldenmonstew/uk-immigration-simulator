# Phase 3 规划（2026-11-04）

站点已上线（https://wanruncong.uk，GitHub push main 自动部署）。Phase 3 的主题是**上线后的可信度与完善**：把 Phase 2 留下的数据缺口补上，把面向用户的中英文文案整理成可以通读校对的材料，把结果页做成能保存、能打印、能装到手机上的工具，再决定难民路径与 App 的去留。候选来源：`docs/tasks/phase-2-plan.md` §6、`PROGRESS.md` 当前状态、各任务报告 §4。

原则不变：一个 package 一个 writer；规则语义只由 Opus 改；契约改动先 commit 再评审；每项政策数字带 `SRC-xxx` 定位；不过度工程化；合并后自动 push 触发 CI 与部署。

## 1. 任务总览

| # | 任务 | 负责 | 改动范围 | 依赖 | 波次 |
|---|---|---|---|---|---|
| 3.1 | Immigration Salary List 登记与提取；Table 3a 改脚本提取；来源快照核对脚本 | sol | `policy-sources/`、`docs/SOURCES.md`、`packages/policy-data`（scripts、data、test） | 无 | 1 |
| 3.2 | 引擎可读名、ISL 按职业表推导、文案收尾、给 IAA 复核的全文案导出 | Opus | `packages/engine`、`packages/policy-data/src/data/*`（显示名表）、`docs/review/` | 3.1 的 ISL 表（可先按契约名写，合并后接上） | 1 |
| 3.3 | 结果页打印 / 保存 PDF、本地多情景保存、PWA 可安装、细节修正 | astra | `apps/web` | 无 | 1 |
| 3.4 | 难民路径（SRC-001 Ch.7、Table 2） | Opus | `packages/engine`、`packages/policy-data`、`docs/pending-details.md` | 3.2 合并后；契约先行 | 2 |
| 3.5 | 难民路径的问卷与结果页 | astra | `apps/web` | 3.4 | 2 |

Wave 1 三个任务互不碰同一 package。3.2 需要 3.1 的 `immigrationSalaryListOccupations` 表：Opus 先按 contracts 约定的导出名写规则与测试（用临时的两三条 SOC 桩数据不进仓库），3.1 合并后再接真实表；或者等 3.1 合并（预计半天内）再派 3.2，Fable 按进度定。

## 2. 任务卡

### 3.1 Immigration Salary List、Table 3a 与来源核对脚本（sol）

- 登记 Immigration Rules **Appendix Immigration Salary List** 为 SRC-019（快照 + sha256，SOURCES.md 末尾追加行与"常用定位"）。用脚本从快照提取 `immigrationSalaryListOccupations`：SOC 2020 代码、职业名、适用限制（原表的"Jobs with a working location in …"或仅限特定岗位的备注原样保留为 `note` 字段，不做解释）。沿用 `scripts/extract-skilled-occupations.mjs` 的写法，测试同样核对行数、代码格式与抽查行。
- 把 2.5 手写的 `nationalPayScaleBelowRqf6Occupations`（SRC-017 Table 3a）改为脚本提取，输出进 `skilled-occupations.ts`，删除 `occupations.ts` 里的手写表并更新 `src/index.ts` 导出；现有引擎测试与 fixtures 不得变化。
- `packages/policy-data/scripts/check-sources.mjs`：读 `docs/SOURCES.md` 的来源表，逐条重新抓取 URL（PDF 或 HTML）、算 sha256、与登记值比对，打印"未变 / 已变 / 抓取失败"三类；只打印，不改任何文件，不进 CI。这是 §5 第 14 条"人工定期 diff"的最小工具。
- 不做：Table 4 / 5 薪级（需要用户填 pay band，另议）、ISL 的历史版本、自动调度。
- 验收（Fable）：gate 全过；SRC-019 sha256 核对；ISL 随机抽 5 行对照快照；Table 3a 八行与 2.5 手写表一致；`check-sources` 跑一遍，19 个来源全部"未变"或给出明确原因。

### 3.2 可读名、ISL 推导、文案收尾与复核导出（Opus）

- **显示名表**：`policy-data/src/data/display-names.ts`，`Route`、`RouteGroup`、`ImmigrationBreach['type']`、`DecisionOutcome` 的中英文显示名（路线名可沿用 web 的 `routes.ts` 文字）。规则解释里不再直接拼枚举码（`SKILLED_WORKER`、`CORE_PERMISSION / HIGH_TALENT`、`OVERSTAYING` 等），改为显示名；中文快照会变，按新文案更新快照并在报告里列出改动的句子。
- **ISL 按职业推导**：`CL-SW-SALARY` / `CL-SW-GOING-RATE` 的 ISL 判断改为：`immigrationSalaryList` 已申报（true / false）→ 以申报为准；未申报 → `socCode` 在 `immigrationSalaryListOccupations` 中即视为在清单上，假设里说明"按职业代码推导，清单的岗位限制未核对"。
- **文案收尾**：英文 "1 full years" 单复数；`policy-changelog.ts` 的 `locator: '版本 2026-10-08'` 改为不含中文的写法（如 `version 2026-10-08`，SOURCES.md 同步）；PD-040 的"对引擎的影响"按 SW 4.2(b)(ii) 更新并标"部分关闭"。
- **文案导出**：把全部面向用户文案——每条规则的 title / titleEn、各分支 explanation、assumptions、短路 message、聚合假设——按中英文各一份导出到 `docs/review/wording-2026-11.md`，用 bilingual 测试里的样例上下文驱动，按规则分节、注明来源定位。用途是用户通读校对，Fable 先读一遍。
- 验收（Fable）：gate 全过；抽读 10 条改名后的解释；ISL 推导的 positive / negative（申报 false 覆盖表内职业）用例；导出文件完整可读。

### 3.3 打印、多情景、PWA 与细节（astra）

- **打印 / 保存 PDF**：结果页加"打印或保存为 PDF"按钮（`window.print()`），`@media print` 样式：两栏改单列、展开所有折叠、隐藏按钮与导航、页眉显示站名、模拟日期与政策核对日期、页脚免责说明。
- **本地多情景**：结果页"保存此情景"（命名），首页 / 结果页列出已保存情景（名称、模拟日期、两栏结论摘要），可载入、删除；全部存 `localStorage`，不新增网络请求；分享链接照常。
- **PWA 可安装**：`manifest.webmanifest`（名称、图标、`display: standalone`、主题色）+ 最小 service worker（预缓存静态导出的页面与 `_next/static`，网络优先、离线回退缓存）；iOS Safari "添加到主屏幕"可用。不做推送、不做后台同步。
- **细节**：问卷"修改输入"回到最后一步而不是第 1 步；英文模式下路线与分组名只显示英文（`routes.ts` 拆成双语字段）；首页与结果页加 Open Graph / description 元数据（静态文案，不含用户输入）。
- 验收（Fable）：gate 全过；浏览器：打印预览单列且折叠已展开；保存两个情景、载入其一、删除另一；Lighthouse PWA 可安装项通过；断网后首页与结果页仍可打开；375px。

### 3.4 难民路径（Opus，Wave 2）

现在保护类路线一律短路为"需要受监管复核"。SRC-001 Ch.7 与 p47 Table 2 的规则相对清楚：Safe and Legal Routes 5 年（UKRS 难民 A2 英语，不要求 5 年未用 public funds）；Protection Work and Study 10 年（持续工作 / 教育 / 培训，工作者 3 年达 £12,571，B2，Life in the UK，asylum support 还款，无非法入境）；Core Protection 20 年（B2、Life in the UK、其他强制要求、还款、无非法入境）。p40 有官方案例。需要新契约字段（持续活动、asylum support 还款状态等），契约先行。结果页仍保留"寻求受监管建议"的强提示。

### 3.5 难民路径的问卷与结果页（astra，随 3.4）

### 之外：iOS / App Store

静态站加 PWA 之后，iPhone 上已能"添加到主屏幕"全屏使用。上 App Store 需要原生价值（通知、本地安全存储等）且审核对套壳严格，建议等有真实用户反馈后再决定 Capacitor 或 Expo；引擎保持纯 TS，届时直接复用。

## 3. 验收总则

同 Phase 2：gate 全过；新规则三组用例；来源定位齐全；UI 改动 Fable 浏览器走查；一个逻辑改动一次 commit；合并后 push main，GitHub Actions 自动部署，Fable 在 `*.pages.dev` 复核线上结果。

## 4. 用户决定（2026-11-04）

1. **难民路径做**：3.4 / 3.5 列入 Wave 2，3.2 合并后派发。
2. **Web Analytics 接**：用 Cloudflare Pages 项目设置里的 Web Analytics 自动注入（无 cookie、不改代码），由 Fable 在后台开启；不在 3.3 里写 beacon 脚本。
3. **IAA 复核不做**：用户此前已表明不需要；3.2 的全文案导出保留，用途改为用户自己通读校对中英文文案。

## 5. 验收记录（2026-11-04）

- 3.1 已合并（main `b3d2058`）；3.3 已合并（`f84a5bb`，三个 commit）；3.2 已合并（`ec1181e`），报告见 `docs/tasks/reports/`。
- **3.2 验收决定——ISL 按职业推导包含 care worker**：未申报 Immigration Salary List 时按 SOC 代码推导，6135 / 6136 在 SRC-019 清单里，因此满足 SW 4.2(b) 的 care worker 现行法律栏从 row C（£31,300）降到 row D（£25,000）。fixture `ES-OFFICIAL-P45-INDIVIDUAL-A` 现行法律栏由 LIKELY_NOT_ELIGIBLE（10 年）变为 LIKELY_ELIGIBLE（5 年，2028-04-06），`-C` 年限 10 → 5，Earned Settlement 栏不变。接受理由：清单确列该职业；推导写进假设并可在问卷里申报覆盖；原先"按不在清单处理"同样是未核对的默认，只是更保守。用户若不接受，改为 care worker 职业不推导即可（Opus 一处改动）。
- 后续候选（本阶段不做）：
  - ISL 条目的 `removalDate`（多数 2026-12-31，care worker 2028-07-22）规范为 ISO 日期（sol），推导时与申请日比较（Opus）。
  - 中文"且${原因}"在原因以 SOC 开头时缺空格（"且SOC 6135"），下次文案通读时改（Opus）。
  - web 路线名复用 policy-data 显示名表、分组英文大小写统一；英文界面残留的全角标点（如 "Simulation date："、"（n）"）改半角（astra）。
  - check-sources 对 GOV.UK 页面改比对归一化后的 `<main>` 正文或 Content API 的 public_updated_at（sol）。
