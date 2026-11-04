# UK Immigration Simulator — 项目梳理、改进点与分工方案

| | |
|---|---|
| 日期 | 2026-11-04 |
| 作者 | Fable 5.1（统筹 / 验收） |
| 输入 | `docs/research/2026-11-03-deep-research-report.md`（研究报告，归档自 ~/Downloads，内容未改动） |
| 原文核对 | `policy-sources/2026-11-02-cp1707-a-fairer-pathway-to-settlement-government-response.pdf`（官方回应文件 CP 1707，60 页）。本文所有 `p<N>` 指该 PDF 的页码，对应 `docs/SOURCES.md` 的 SRC-001 |
| 状态 | 草案。§9 的决定项由用户确认后，本文作为各编码 agent 的任务依据 |

## 1. 现状

- 梳理前 `web-UK/` 是空目录：无代码、无仓库、无文档，项目唯一输入是研究报告。本次已 `git init`（仅本地，无远端），归档了报告与官方 PDF。
- 本机工具链：Node 26.13、pnpm 10.34、bun 1.3、Python 3.11、git 2.54、codex-cli 0.166、Claude Code 2.1。
- 可用 agent 与角色：

| Agent | 实际模型 | 角色 |
|---|---|---|
| Opus 5.5 | Claude Code 本地 | 编码 |
| astra | Codex CLI `gpt-6-astra` | 编码 |
| sol | Codex CLI `gpt-6.1-sol` / `gpt-5.6-sol` | 编码 |
| Fable 5.1 | 本会话 | 统筹、拆任务、写 brief、评审契约、验收；不写业务代码 |

## 2. 报告梳理（一页版）

**定位**：不是"签证资格计算器"，而是把英国移民政策变成可交互、可追溯、可改变量的因果模型。三个模块共享一个版本化规则引擎：

| 模块 | 用途 | 报告建议阶段 |
|---|---|---|
| My Immigration Path | 输入个人时间线 → 现行法律 / 已公布改革两栏结果 + Why + 官方来源 | MVP |
| Policy Explorer（What-if） | 拖动收入、时间等变量，解释结果为什么变 | 第二阶段 |
| Immigration Life | 虚构角色的教学游戏 | 第四阶段 |

**六条架构原则**（报告最有价值的部分，原样保留）：

1. 政策三态 `CURRENT_LAW` / `ANNOUNCED_NOT_IN_FORCE` / `IN_FORCE_FUTURE_VERSION`；每个结果都标明"截至哪天、依据哪个版本"。
2. 数据模型围绕个人时间线（签证片段、缺席、收入年度、福利片段、家庭关系），不是当前状态快照。
3. `visa_eligibility` 与 `settlement_eligibility` 分开计算，两套门槛不混用。
4. 门槛参数化：£12,571 / £50,271 / £125,141 与所得税门槛挂钩，会随税制变动（p14 原文确认）。
5. 决策输出六态 + 满足 / 未满足 / 未知规则 + 假设 + 官方来源，而不是一个布尔值。
6. LLM 只做 policy intelligence（发现变化、提议规则改动），不进运行时引擎；上线前经人工法律 review 与回归测试。

**规则目录**：Earned Settlement 3 / 5 / 10 / 20 年路径与 best-years 计数；现行路线到新框架的归类；public funds 按具体福利项细分（SMP、New Style JSA 等不属 immigration public funds）；家庭合并收入；年龄 / 健康豁免；犯罪记录走人工复核。

**法律与隐私**：IAA 监管下针对具体个人的移民意见是受监管活动，页脚免责声明不足以免责；高风险情形（犯罪、逾期、庇护、家暴等）短路到"建议寻求受监管建议"；MVP 匿名、无账号、浏览器本地计算。

**路线图与估算**：MVP → What-if / 版本库 / 自动监控 → 保存与通知 → 游戏。核心范围约 8–12 个工程周（两人）加持续法律 review。

## 3. 事实核对（2026-11-04，对照官方 PDF）

报告依据的政府回应文件在我的知识截止之后，所以逐条对照了原文。

### 3.1 报告说对的

| 断言 | 原文位置 |
|---|---|
| CP 1707《A Fairer Pathway to Settlement: Government Response to the Consultation》2026-11 发布 | p1–p3 |
| 3 年：£125,141，申请前 4 年中 3 年；5 年：£50,271，5 年中 3 年；10 年：£12,571，7 年中 5 年 | p15；Table 1 p45 |
| 门槛与所得税门槛联动 | p14 |
| 家庭合并门槛 £25,142（个人的两倍，随 NI 门槛变动）；只能一方依赖另一方收入 | p16 |
| 收入要求豁免：儿童、65 岁以上、身心状况 | p14 |
| Long Residence 关闭；Student / Graduate 等临时路线时间不计入 | p22–p23 |
| 3/5/10 年路径要求申请前 5 年未使用 specified public funds，否则 20 年；先沿用现有 public funds 定义，纳入范围与豁免实施前另行公布 | p17 |
| 成年人在英有犯罪记录即拒绝，含 fines、cautions、community sentences、conditional discharge 等；海外定罪在英构成犯罪的视同 | p11 |
| 成年人的 qualifying immigration breach（逾期、违反许可条件、申请中欺骗、妨碍移民管制）→ 20 年路径，不因高收入抵消 | p12 |
| BN(O) 保留 5 年，但仍需满足强化的犯罪记录与 B2 要求 | p24 |
| Highest Talent Group 范围待 MAC 审查 | p45 注 16 |
| 公共服务（医疗、教育国家薪级岗位）5 年路径；岗位清单在 Annex C | p15；p45 注 17 |
| 实施前政府还会发布技术 / 操作指引与完整影响评估 | p9；p53 |
| Skilled Worker 一般门槛 £41,700（2025-07-22 起）| 多家二手来源一致；Rules 原文待登记（SRC-004） |
| 首批规则 2026-12 提交、2027 年陆续实施 | 多家二手来源一致；来自议会陈述，不在 PDF 内（SRC-002/003 待登记） |

### 3.2 报告遗漏或需修正的

| 项目 | 原文 | 对产品的影响 |
|---|---|---|
| 不计入路线的完整清单：Visit、Student、Global Business Mobility、Temporary Worker、Youth Mobility、Seasonal Worker、Overseas Domestic Worker、Graduate 与 HPI、Ukraine 各 scheme；LOTR 待政府另行决定 | p23 | 报告只提 Student / Graduate；引擎需要完整的路线分类表 |
| core permission 与 high talent permission 的精确定义：core = Tier 2 Minister of Religion、Skilled Worker、UK Ancestry、Global Talent、Scale-up、Innovator Founder、International Sportsperson、Family Partner、Family Partner/Parent（不含 Article 8）、Stateless；high talent = Skilled Worker、Global Talent、Scale-up、Innovator Founder、International Sportsperson；Global Talent / Innovator Founder 走 3/5 年时最近一次许可必须就是该路线 | p22 注 9、10 | 路线归类不能靠常识，要按注脚建表；Skilled Worker 同属两者 |
| Family and Private Life 路线不能走 3 / 5 年，只能 10 / 20；但 British citizen 的伴侣 / 父母 / 子女与 UK Ancestry 属 British connection，可走 5 年 | p17；p22 | 报告把"Family"笼统归为 British connection；引擎要区分 Appendix FM 伴侣（British connection）与 private life / Article 8 |
| 保护类 / 人权类路线时间不能与工作 / 家庭路线时间合并；切换时新路径重新起算 | p24 | 时间线引擎需要"路线组切换重置"规则，报告没有 |
| 10 年路径的收入要求文内有两种表述：p14 "至少 3 年达到 £12,571"，p15 与 Table 1 "7 年中 5 年" | p14、p15、p45 | 典型 PENDING_DETAIL；引擎以 Table 1 为准并在输出中声明假设 |
| 15 年路径取消；RQF6 以下岗位走 10 年并可凭贡献加速 | p40–p41 | 报告表格已无 15 年，但没说明咨询版到回应版的变化 |
| 过渡安排：无一般豁免；申请按决定日有效的 Rules 审理（p40）。一次性针对性安排：2025-05 白皮书发布前进入或转入 care worker 路线者保留 5 年（£25,000 薪资、担保、雇佣条件），不达标者可再获 5 年 Health and Care 签证；RQF6 以下国家薪级医疗 / 教育岗位（白皮书前入境）保留 5 年；2024-04 前 Skilled Worker 群体可按原条件续签至 2035；2027-02-01 起失去担保的 care worker 有 120 + 60 天窗口 | p40–p44 | 报告只提一句；这是已在英用户的第一个问题，必须建模 |
| 框架外群体：Afghan schemes、Legacy Safe and Legal routes、Windrush、Armed Forces（4 年）、丧偶伴侣、UASC、local authority care 儿童、在英长大的青年、家暴受害者 | p24–p25 | 引擎至少要能识别并短路到"框架外，按现行安排" |
| 难民三条路径（Safe and Legal 5 年 / Protection Work and Study 10 年 / Core Protection 20 年；非法入境加 10 年） | p37–p39；Table 2 p46 | MVP 不做，但路线枚举里要有，走短路分支 |
| B2 英语据称经 HC 1691 于 2027-03-26 起适用于 settlement | 单一二手来源，待核对（SRC-007） | 若属实，是一个现成的 `IN_FORCE_FUTURE_VERSION` 测试用例 |

## 4. 报告本身的问题

1. **引用不可用**。全文 57 处引用是研究工具内部标记（30 个来源 ID），没有一个真实 URL 或页码。对一个"每条规则都要溯源到官方段落"的产品，这是第一个必须补的洞。§3 已把最关键的一份文件按页核对；其余来源在 `docs/SOURCES.md` 登记为 todo，并附了引用 ID 到来源的推断映射。
2. **无版本元数据**。报告没有日期、版本、"截至"声明，而产品恰恰要求所有政策陈述带时间戳。已按 2026-11-03 快照归档。
3. **路线分类过粗**（§3.2 前四行）。按报告的表建规则会把 private life 路线错误地放进 5 年路径。
4. **YAML 规则 DSL 的建议在工程上站不住**，见 §5 第 7 条。

## 5. 改进点

### P0 范围与假设

1. **MVP 再收窄为垂直切片（MVP-0）**。报告 MVP 把 7 条路线一起做，意味着规则引擎、解释层、来源层三者都没验证就开始铺规则。建议 MVP-0 只做：Skilled Worker 现行 5 年路径 + Earned Settlement 3/5/10/20 年收入计数 + public funds 基础分支 + 过渡安排判断 + 结果页（双栏 + Why + 来源 + 政策版本标注）。端到端跑通后，其他路线以"规则包"形式逐条加入，每条带 fixtures。
2. **建"政府未定事项登记表"（`docs/pending-details.md`）**。qualifying earnings 的定义（含不含奖金、自雇利润、以何种证据）、specified public funds 的最终清单与豁免、过渡安排细则、Highest Talent Group 范围、LOTR 处理、10 年路径"3 年 vs 7 中 5"的口径、实施日期——这些在引擎里必须输出 `UNKNOWN` 并声明假设，不能由 agent 猜。登记表是规则作者和验收者共用的清单，每条带 `p<N>` 出处。
3. **过渡安排要建模**。用户最关心"我适用旧规则还是新规则"。引擎要能对"入境日期 + 路线 + 是否 2025-05 白皮书前 + 申请日期"输出 `POLICY_NOT_YET_IN_FORCE` 或具体的过渡结论，并引用 p40 "按决定日有效的 Rules 审理"的原则。
4. **定目标用户与首发语言**。报告中文写就，UI 示例中英混杂。先定：以华人用户为主（中文 UI，法律术语保留英文原文）还是英文站。无论哪种，从第一天用 i18n key，不硬编码文案。
5. **多年收入历史的录入交互**是最难的输入（tax year 对齐、多雇主、产假年份、自雇）。报告只给了数据结构，没有交互设计。MVP-0 用最简方案：按 tax year 填年收入，不确定可留空，留空年份按"未达门槛"保守处理并在假设里注明。

### P1 技术设计

6. **技术栈与仓库结构**（报告未定）。建议 pnpm monorepo + TypeScript strict：

   ```text
   web-UK/
     apps/web/              Next.js 静态导出（案例页可 SEO 与分享；可换 Vite，引擎已解耦不阻塞）
     packages/engine/       纯函数、零框架依赖、可在浏览器运行；输入时间线 + 模拟日期 + 规则集 → 决策与解释
     packages/policy-data/  规则参数（门槛、日期）、规则元数据、路线分类表、Annex C 岗位表、fixtures；JSON Schema 校验
     policy-sources/        官方文件快照（PDF/HTML + retrieved_at + sha256）
     docs/                  本文、SOURCES.md、pending-details.md、决策记录
   ```

7. **规则用 TS 函数 + 强制元数据，而不是 YAML DSL**。报告的 YAML 示例只能表达 `count_years`；连续居留（缺席窗口）、路线切换序列与重置（p24）、伴侣联动、豁免覆盖、前向推算都表达不了，自研 DSL 本身就是一个项目。参数化（门槛随税制调整）用 JSON 参数文件即可满足。每条规则强制元数据头 `id / ruleset / status / effective_from / sources[] / pending_details[]`，由 schema 校验；缺来源的规则 CI 直接拒绝。
8. **`earliestPossibleDate` 是前向推算求解器**，不是布尔判断。它要对未来做假设（收入不变、持续居留、路线不变），每个假设必须写进 `assumptions[]` 并在 UI 展示。报告没有讨论这一层，但它是双栏结果和 What-if 的基础。
9. **规则集版本模型**要区分法律版本（Immigration Rules 的 point-in-time）与政策版本（已公布框架）：`RuleSet { id, kind: LAW | ANNOUNCED, effective_from, effective_to, supersedes, sources[] }`，引擎按 `simulation_date` 选取。
10. **黄金案例（golden fixtures）是验收主工具**。格式：YAML 场景 + 预期结果（outcome、路径年限、最早日期、必须出现的 failed / unknown 规则）。官方文件里的示例全部转成 fixture：Individual A–D（p18）、产假案例（p15）、过渡安排 Individual A–C（p44）、难民案例（p39）。CI 跑全部 fixtures，验收时我只看 fixtures 与 diff。
11. **MVP 不要后端**。浏览器本地计算 + URL / localStorage 保存情景，无账号、无数据库、无用户数据上传。报告路线图的第三阶段（保存、通知）明确推后，隐私风险也降到最低。

### P2 法律合规

12. IAA 风险不是靠免责声明解决，要靠产品设计：不收集证件、不输出"你应该申请 X"、每个结果带"未定事项"与"受监管建议"入口。上线前由 IAA 注册顾问 review 输出措辞。这一步 agent 不能替代，需要用户安排真人。
13. 高风险分支（犯罪记录、逾期 / 非法入境、庇护、家暴、人口贩卖、无国籍、驱逐）在问卷早期触发并短路，不再收集后续敏感信息。

### P3 推后

14. 自动政策监控 pipeline（GOV.UK Content API、legislation.gov.uk feeds、Hansard）推到有真实用户之后；之前用"人工定期 diff + 来源登记表"足够。
15. 游戏模块保持第四阶段。

## 6. 分工方案

原则：每个 agent 一个 git worktree + 分支；一个 package 同一时间只有一个 writer；先定契约再并行；跨 package 改动经 Fable；Fable 验收后合并到 `main`。

| 工作流 | 负责 | 范围 | 不做 |
|---|---|---|---|
| 统筹 / 验收 | Fable | 任务拆分与 brief、契约评审、来源抽检、fixtures 裁判、决策记录、验收与合并 | 写业务代码 |
| 规则引擎与规则建模 | Opus 5.5 | `packages/engine`、规则 TS 实现与求解器、来源登记、pending-details 登记 | UI |
| Web 应用 | astra | `apps/web`：问卷流、结果页、What-if、i18n 接入 | 改引擎逻辑 |
| 数据 / 测试 / 基础设施 | sol | 仓库脚手架、`packages/policy-data` schema、路线分类表与 Annex C 提取、fixtures 工具链、CI、lint（禁止裸数字门槛）、后期监控脚本 | 改规则语义 |

astra 与 sol 的分配可互换；关键是 UI 与基础设施分开，且都不碰规则语义。规则语义只由 Opus 改、由 Fable 对照原文验收。

### Phase 0（串行，先于并行开发）

| # | 任务 | 负责 | 产出 | 验收 |
|---|---|---|---|---|
| 0.1 | 仓库脚手架 | sol | pnpm monorepo、TS strict、vitest、eslint、CI、README；三个 package 空壳 | `pnpm -r build && pnpm -r test` 通过 |
| 0.2 | 引擎契约 | Opus 写，Fable 评审 | `packages/engine` 的类型（PersonTimeline、RuleSet、DecisionOutcome、Explanation）+ fixture schema + 规则元数据 schema + 两个示例 fixture | 类型可编译；schema 有示例；astra / sol 确认可消费 |
| 0.3 | 来源登记 | Opus | `docs/SOURCES.md` 的 todo 项全部登记（URL、版本日期、快照、sha256）；报告 30 个引用 ID 全部映射 | Fable 抽检 ≥5 条与原文一致 |
| 0.4 | pending-details 与过渡安排登记 | Opus | `docs/pending-details.md`，每条带 `SRC-xxx p<N>` | 每条有出处；无猜测 |

### Phase 1（并行）

- Opus：MVP-0 规则（Skilled Worker 现行 5 年；ES 3/5/10/20 收入计数；public funds 基础；过渡安排；路线组切换重置）+ 求解器。
- astra：问卷流 + 结果页 + 政策版本标注；先用 engine 契约的 mock 数据开发，不等引擎完成。
- sol：官方示例 → fixtures；路线分类表与 Annex C 数据表；CI 跑 fixtures；禁裸数字门槛的 lint；i18n 脚手架。

## 7. 验收标准（Fable 检查项）

- 所有 fixtures 通过；新增规则必须带 positive / negative / boundary 三组用例（如 £50,270 / £50,271 / £50,272）。
- 每条规则元数据含 ≥1 条 `SRC-xxx p<N>` 来源，schema 校验通过；规则文件中不出现裸数字门槛（lint）。
- 任何输出都带 `policyVersion` 与 as-of 日期；未定事项显示为 `UNKNOWN` 而不是默认通过。
- 高风险分支短路，且不触发后续敏感字段收集。
- MVP 无网络请求携带用户输入（检查 network 面板）。
- UI 改动附受影响页面截图；文案走 i18n key。
- 每个独立改动一次 commit（`Type: 描述` 格式），PROGRESS.md 有记录。

## 8. 工作量判断

报告估算"核心范围 8–12 个工程周（两人）"是按人类团队算的。按 agent 并行，瓶颈不在写代码，而在三处：规则建模对照原文、fixtures 的正确预期值、以及真人法律 review。前两处由 Fable 验收把关，第三处必须由用户安排 IAA 注册顾问。建议把 Phase 0 当作一次"引擎设计验证"，跑通 MVP-0 再评估后续路线的扩展速度。

## 9. 待用户决定

1. 是否接受 MVP-0 的收窄范围（§5 第 1 条）。
2. 目标用户与首发语言（中文优先 / 英文优先 / 双语）。
3. 规则实现方式：TS 函数 + 元数据（推荐）还是报告的 YAML DSL。
4. 前端框架（默认 Next.js 静态导出；可换 Vite）。
5. astra / sol 的分配是否按 §6 表（可互换）。
6. 是否建远端仓库（当前仅本地 git）。
7. 真人 IAA / OISC 顾问 review 的安排（上线前必需，可先不定）。

### §9 决定状态（2026-11-04）

用户确认开始 Phase 0：第 1、3、4、5 项按推荐执行；第 2 项暂按中文优先 + 从第一天用 i18n key；第 6 项暂无远端仓库；第 7 项后期安排。模型推理等级：Codex（astra / sol）用 `high`，Opus 会话用 `high`。

## 10. 部署与客户端（2026-11-04 补充）

- **部署目标：Cloudflare Pages（静态托管，免费额度，绑定用户已有的 Cloudflare 域名）。** 与 §5 第 11 条"MVP 无后端"完全一致：`apps/web` 保持 Next.js 静态导出，不使用 API routes、SSR、middleware 等服务端特性。第二阶段若需要服务端（保存情景、政策监控定时任务、通知），用 Cloudflare Workers + Cron Triggers + KV / D1，同样有免费额度；在那之前不引入。
- **iOS 应用（后期；用户已有 Apple 开发者账号）。** 对架构的唯一要求：规则语义只存在于 `packages/engine` + `packages/policy-data`（纯 TypeScript），绝不复制到 Swift，否则会出现两套规则真相。届时二选一：Capacitor 包壳（复用全部 Web 代码，但 App Store 对"网页套壳"审核较严，需有原生价值）或 React Native / Expo 复用同一引擎包。Phase 3 之前不做决定。
