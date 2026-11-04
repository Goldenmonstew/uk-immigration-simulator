# 来源登记表（Sources Register）

> 规则引擎里每条规则都必须引用本表中的一个 `SRC-` 编号 + 页码/段落。
> 状态：`archived` = 快照已入 `policy-sources/`；`todo` = 只有 URL 或线索，待抓取与登记；`verify` = 只有二手来源，待对照原文。
> 权威等级：LAW（Immigration Rules / Statement of Changes / legislation）> GUIDANCE（Home Office 指引）> POLICY（命令文件、咨询回应）> PARLIAMENT（Hansard）> SECONDARY（律所、媒体，只能用于交叉验证）。
>
> 定位约定（任务 0.3，2026-11-04）：
> - PDF 的 `p<N>` 一律指 **PDF 物理页序**（封面为 p1，与 `pdftotext -f N -l N` 一致），不是页脚印刷页码；各文件的换算关系写在下方"登记备注"。
> - Immigration Rules 用段落号（如 `SW 24.3`）；gov.uk 无编号的 guidance 用小节标题及其 HTML 锚点；Hansard 用卷号 + 栏号（col）+ contribution 锚点。
> - 快照文件名 `YYYY-MM-DD-<slug>.<ext>`：日期取文件的发布日或版本日（Rules 各 Appendix 取 gov.uk `public_updated_at`）；无固定版本日的动态页面取抓取日。
> - Rules 各 Appendix 的"版本日"取该页 gov.uk 变更记录的最近一条（同时记录对应 Statement of Changes 编号）；页面头部的 "Updated" 日期是整个 Immigration Rules 手册的更新日，不代表该 Appendix 本身有改动。

## 一级来源

| ID | 等级 | 标题 | URL | 发布日 | 抓取日 | 本地快照 | 状态 |
|---|---|---|---|---|---|---|---|
| SRC-001 | POLICY | A Fairer Pathway to Settlement: Government Response to the Consultation (CP 1707, 62 页) | https://assets.publishing.service.gov.uk/media/6ae90b0e5b14ba0182a272a4/A_Fairer_Pathway_to_Settlement_-_Government_response_to_the_consultation.pdf | 2026-11-02 | 2026-11-04 | `policy-sources/2026-11-02-cp1707-a-fairer-pathway-to-settlement-government-response.pdf`（sha256 `f2ce80103dd331cce70a1e2043ba58d4f791b9650ce1a3ed17a219f7d5f3253c`） | archived |
| SRC-002 | PARLIAMENT | HC Deb 2 November 2026 vol 792 cols 583 起，"Immigration: Earned Settlement"（内政大臣口头陈述及问答）；时间表句在 col 593 | https://hansard.parliament.uk/Commons/2026-11-02/debates/09F388D2-539E-4B0A-ABE2-D3195B14AF0E/ImmigrationEarnedSettlement | 2026-11-02 | 2026-11-04 | `policy-sources/2026-11-02-hansard-commons-immigration-earned-settlement.json`（sha256 `01a9899bc8013613a240080450710f87b9451187794d77f62ba34bc3fcb18d23`） | archived |
| SRC-003 | PARLIAMENT | HL Deb 2 November 2026 vol 860 cols 1415 起，"Immigration: Earned Settlement"（Lord Collins of Highbury 复述陈述及问答）；时间表句在 cols 1423–1424 | https://hansard.parliament.uk/Lords/2026-11-02/debates/5D3D04DB-0971-4B22-B841-6414AAFAA8C9/ImmigrationEarnedSettlement | 2026-11-02 | 2026-11-04 | `policy-sources/2026-11-02-hansard-lords-immigration-earned-settlement.json`（sha256 `c517d2c8fd6530262cbaf7d02d3d78694aeb7bc8ec4a9a51df3431d149f016e0`） | archived |
| SRC-004 | LAW | Immigration Rules: Appendix Skilled Worker（版本 2026-10-08，HC 584；£41,700 + going rate 见 SW 4.2 Option A、SW 8.1；settlement 见 SW 21.1–SW 24.4） | https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-worker | 2026-10-08 | 2026-11-04 | `policy-sources/2026-10-08-immigration-rules-appendix-skilled-worker.html`（sha256 `93459890183de25a83c59b6825581e92a9d89fa2b1f96aa6190c7b6560514e36`） | archived |
| SRC-005 | LAW | Immigration Rules: Appendix Long Residence（版本 2026-10-08，HC 584；settlement 合格期 LR 11.1–11.2，B2 自 2027-03-26 见 LR 13.1） | https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-long-residence | 2026-10-08 | 2026-11-04 | `policy-sources/2026-10-08-immigration-rules-appendix-long-residence.html`（sha256 `6373e989543310ed9a0bd07ba257575fa5b9fed415521a8f9b07f06424dd8d44`） | archived |
| SRC-006 | GUIDANCE | Public funds（Home Office guidance，HTML 版；SRC-001 p18 注 6 指向此页） | https://www.gov.uk/government/publications/public-funds--2/public-funds | 2025-04-09 | 2026-11-04 | `policy-sources/2025-04-09-public-funds-guidance.html`（sha256 `30d3fe6a60d2e2aa84503944d0bd1b2cb06dcf30ec7577027bbf46455b295d55`） | archived |
| SRC-007 | LAW | Statement of Changes in Immigration Rules HC 1691（2026-03-05 提交议会）及其 Explanatory Memorandum：**已证实** 2027-03-26 起多条路线 settlement 英语要求升至 B2（Skilled Worker 见 APP SW5 插入的 SW 22A.1；EM 5.60–5.62） | https://www.gov.uk/government/publications/statement-of-changes-to-the-immigration-rules-hc-1619-5-march-2026 （正文 PDF：https://assets.publishing.service.gov.uk/media/69a9a1f58fd807b03bbe92e5/E03553349_-_HC_1691_-_Immigration_Rules_Changes__Web_Accessible_.pdf ；EM PDF：https://assets.publishing.service.gov.uk/media/69a9a2b8ac93547152b9b1eb/E03553349_-__HC_1691__-_EXPLANATORY_MEMORANDUM__Web_Accessible_.pdf ） | 2026-03-05 | 2026-11-04 | `policy-sources/2026-03-05-hc1691-statement-of-changes-immigration-rules.pdf`（sha256 `6192eb13f84577806c1c4766a45014704cf24a1deef859a66c2eb766c13083cb`）；`policy-sources/2026-03-05-hc1691-explanatory-memorandum.pdf`（sha256 `d4046133ae0f8ce429b20b9e3e81cac5688f6dd2e2474ca6f062ecc7e7271503`） | archived |
| SRC-008 | LAW | Immigration Rules: Appendix Continuous Residence（版本 2025-11-11，HC 1333；180 天缺席规则 CR 3.1，连续居住中断 CR 4.1） | https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-continuous-residence | 2025-11-11 | 2026-11-04 | `policy-sources/2025-11-11-immigration-rules-appendix-continuous-residence.html`（sha256 `c277440028e7e31662248f9d5d8ac8c755fbc958c9f98151d0c1e1c2850f29c6`） | archived（原列的 Settlement Family Life / Global Talent / Scale-up / Innovator Founder / UK Ancestry / Graduate / Student 等 Appendix 不属 MVP-0，未登记） |
| SRC-009 | GUIDANCE | IAA registration explained（Immigration Advice Authority；§1.1 immigration advice / services 的法定定义，§1.3 未经资格提供属犯罪） | https://www.gov.uk/government/publications/iaa-adviser-registration-explained/iaa-adviser-registration-explained | 2026-10-05 | 2026-11-04 | `policy-sources/2026-10-05-iaa-registration-explained.html`（sha256 `980725d32782c7c4ab04ceb65b2a924736a57cbd23fbb45f0413817c0d8e6fa7`） | archived |
| SRC-010 | REFERENCE | GOV.UK Content API 文档：首页（用途、限制、beta、无需认证、10 req/s）与 API reference（`content_id`、`public_updated_at` 字段） | https://content-api.publishing.service.gov.uk/ ；https://content-api.publishing.service.gov.uk/reference.html | —（页面无日期） | 2026-11-04 | `policy-sources/2026-11-04-govuk-content-api-docs.html`（sha256 `1eb1d87b17ec047cc07088d828dce83de7a3e4225ed08f6a6f94c0173a5c446d`）；`policy-sources/2026-11-04-govuk-content-api-reference.html`（sha256 `72861d6c58e48f8f0f9e14d94be29c68a969ffc32473913f9f774e5b136c9ab0`） | archived（第二阶段才用） |
| SRC-011 | REFERENCE | legislation.gov.uk "New Legislation" 页：Atom 订阅 feed 说明，及"与印刷版同步或至少 24 小时内上线"的目标 | https://www.legislation.gov.uk/new （feed：https://www.legislation.gov.uk/new/data.feed ，2026-11-04 实测返回 `application/atom+xml`） | —（动态页面） | 2026-11-04 | `policy-sources/2026-11-04-legislation-gov-uk-new-legislation.html`（sha256 `8878c1d2a2931bcf5c6eb96e03ad1facb62378a0338b3b44b186f2ef0359406d`） | archived（第二阶段才用） |
| SRC-012 | POLICY | Immigration White Paper（2025-05；过渡安排的截止点） | https://www.gov.uk/government/publications/restoring-control-over-the-immigration-system-white-paper | 2025-05-12 | — | — | todo |
| SRC-013 | POLICY | Earned Settlement 咨询文件（2025-11-20；15 年路径等已被 SRC-001 取代，仅作历史对照） | https://www.gov.uk/government/consultations/earned-settlement | 2025-11-20 | — | — | todo |
| SRC-014 | LAW | Immigration Rules: Appendix English Language（版本 2026-03-26，HC 1691；settlement 英语豁免 EL 1.1） | https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-english-language | 2026-03-26 | 2026-11-04 | `policy-sources/2026-03-26-immigration-rules-appendix-english-language.html`（sha256 `a1d9f8bf81841a7481439f4ea8d0db77cabaccd5c888d3fc1f49d1dd62fa795f`） | archived |
| SRC-015 | LAW | Immigration Rules: Appendix KOL UK（版本 2025-04-09，HC 733；Life in the UK 豁免 KOL 1.1，满足方式 KOL 2.1） | https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-kol-uk | 2025-04-09 | 2026-11-04 | `policy-sources/2025-04-09-immigration-rules-appendix-kol-uk.html`（sha256 `11cf0a7ac3b7077a3d9dadff97f2b36c71d96f6c57f1a27d84b9473bb9add1d6`） | archived |
| SRC-016 | GUIDANCE | About us - Immigration Advice Authority（IAA 的调查、执法与起诉权） | https://www.gov.uk/government/organisations/immigration-advice-authority/about | 2025-01-16 | 2026-11-04 | `policy-sources/2025-01-16-iaa-about-us.html`（sha256 `4f8fa4114e9b593c7d197574d7144eed1f72adc1130d55f03ade9fb21f827212`） | archived |

## 登记备注（按 SRC）

### SRC-001 CP 1707

- PDF 共 62 页（`pdfinfo`）。PDF 物理页 = 页脚印刷页码 + 4（例：Table 1 在物理 p46，页脚印 42）。p2 为空白页。
- 常用定位（物理页）：Introduction 与最低要求 p8–p9；"实施前发布技术与操作指引" p10；Ch.1 Character p11–p12；Ch.2 Contribution p14–p19（收入门槛与税档联动、收入豁免 p15，"best years" p16，家庭合并收入 p17，British connection 与 public funds p18，案例 Individual A–D p19）；Ch.3 Integration p20–p21（B2 及豁免 p21）；Ch.4 Residence p22–p24（core / high talent permission 定义在 p23 注 9、10，不计入路线清单 p24）；Ch.5 Dependants p28–p31（伴侣同时 / 后到 p29，案例 p31）；Ch.8 过渡安排 p41–p45（案例 p45）；Table 1 p46；Table 2 p47；完整影响评估 p54。

### SRC-002 下议院（HC Deb vol 792）

- 快照为 Hansard 官方 API（`https://hansard-api.parliament.uk/debates/debate/09F388D2-539E-4B0A-ABE2-D3195B14AF0E.json`）返回的 JSON，内容与网页版一致：hansard.parliament.uk 网页对脚本请求返回 403，网页已于 2026-11-04 在浏览器中打开并核对过下列句子。
- 陈述 15:47 开始（col 583）。**内政大臣的开场陈述本身没有给出实施时间表**；时间表出现在她回答 Home Affairs Committee 主席 Dame Karen Bradley 的提问时（col 593，contribution 锚点 `#contribution-912FA19F-4360-4FC7-A496-1DA8CA1436FE`，约 16:29）。
- 概括：已公布的改动将从 2026 年 12 月的那一批 Immigration Rules 修改开始提交（laid），并在 2027 年内陆续实施；影响评估和其他详细指引会随改动推出时提供。同一场问答中她另说影响评估将"大约在规则提交时"按常规发布（col 604）。

### SRC-003 上议院（HL Deb vol 860）

- 快照为 Hansard 官方 API（`https://hansard-api.parliament.uk/debates/debate/5D3D04DB-0971-4B22-B841-6414AAFAA8C9.json`）返回的 JSON；网页已于 2026-11-04 在浏览器中打开核对。
- 19:31 由 Lord Collins of Highbury 复述下议院陈述（cols 1415–1418）。时间表句**不在复述文本内**，而在他回答 Baroness Lister of Burtersett 的提问时（cols 1423–1424，锚点 `#contribution-0681E679-F8C2-48A1-9C1E-54A4705E8C2E`，20:04 时间戳之后）。
- 概括：实施的第一阶段——修改 Immigration Rules——12 月开始，2027 年 1 月生效；2027、2028 年还会有进一步的规则修改；实施前将发布更多技术细节和完整影响评估。
- 与 SRC-002 的关系：两院说法相容但精度不同（下议院"12 月开始提交、2027 年内实施"；上议院"12 月开始、2027-01 生效，后续 2027–2028 继续"）。生效日以届时提交的 Statement of Changes 为准，在它出现前引擎应把具体生效日视为 `UNKNOWN`。

### SRC-004 Appendix Skilled Worker

- 版本：gov.uk 变更记录最近一条 2026-10-08 "Changes made with reference to Statement of Changes HC 584"；此前 2026-08-03（HC 259）、2026-04-08（HC 1691）。页面头部 "Updated: 29 October 2026" 是整个 Immigration Rules 手册的更新日（当日改的是 Appendix T2 Minister of Religion 等，HC 584），不是本 Appendix。
- **£41,700 一般门槛 + going rate（入境 / 续签）**：SW 4.2 的积分表 Option A——薪资须同时不低于 £41,700/年和该 SOC 2020 代码的 going rate；going rate 取值规则见 SW 8.1（Option A 用 Appendix Skilled Occupations Table 1 或 1a）。其他选项（B–K）对应 PhD、Immigration Salary List、新入职、过渡群体等较低数字（£37,500 / £33,400 / £31,300 / £28,200 / £25,000，配合 going rate 的 70%、80%、90% 或 100%），由 SW 4.2(a)–(d) 限定适用。薪资计算方式见 SW 14.1–SW 14.5。
- **settlement**：SW 21.1（连续 5 年）、SW 21.2（可计入路线）、SW 22.1（Appendix Continuous Residence）、SW 22A.1–22A.2（2027-03-26 起 B2，HC 1691 插入）、SW 23.1（Appendix KOL UK）、SW 24.3 表 row A（£41,700 + Table 1/1a going rate；rows B–E 为 £33,400 / £31,300 / £25,000 等例外）、SW 24.4（薪资计算与缺勤）。
- 入境英语积分 SW 4.1 / SW 7.1：现行为 B2（最近一次 Skilled Worker 许可按 B1 授予者可继续用 B1）。

### SRC-005 Appendix Long Residence

- 版本：2026-10-08（HC 584）；此前 2026-08-03（HC 259）、2026-03-26（HC 1691）。
- 现行规则下 Student / Graduate 时间可计入 10 年：LR 11.1(a) 只排除 Appendix Ukraine Scheme、Visitor、Short-term Student (English language)、Seasonal Worker 的许可（permission to stay 阶段同理见 LR 3.1）。不计入的期间见 LR 11.2。
- LR 13.1：2027-03-26 之前申请为 B1，之后为 B2（HC 1691 APP LR1）。

### SRC-007 HC 1691

- 结论：**属实**。二手来源的说法与原文一致，但需要两点精确化：(1) 相关条款本身 2026-03-26 已写入 Rules，只是条文按"申请日是否在 2027-03-26 及以后"区分 B1 / B2，所以对引擎而言生效日是 **申请日 ≥ 2027-03-26**；(2) 适用于多条路线，不只 Skilled Worker。
- 正文 PDF 48 页，物理页 = 页脚印刷页 + 4。Implementation 一节在物理 p6–p8：APP SW5、APP LR1、APP EL1、APP KOLL2–7、APP ROB1–2、APP UKA1–2、APP GT6–7、APP SCU1–2、APP INNF1、APP ISP1–2、APP CRP1、APP BP1、APP PL1–2、APP SF1–2 等列在"2026-03-26 生效，此前提交的申请按 2026-03-25 的 Rules 审理"一组（p7）。
- Skilled Worker：物理 p24（印刷页 20）APP SW5 在 SW 22.1 后插入 SW 22A.1（申请日 ≥ 2027-03-26 须口语和听力达到 CEFR B2，除非豁免）与 SW 22A.2。现行 Appendix Skilled Worker 快照（SRC-004）中已有该条文，核对一致。
- Explanatory Memorandum（22 页，物理页 = 印刷页）：5.60 列出受影响路线（Appendix KoLL、Skilled Worker、T2 Minister of Religion、Representative of an Overseas Business、UK Ancestry、Global Talent、Scale Up、Innovator Founder、International Sportsperson、Child Relative (Sponsors with Protection)、Long Residence、Bereaved Partner、Private Life、Settlement Family Life）；5.61 说明这是落实 2025-05 White Paper（SRC-012）的承诺；5.62 说明改动 2027-03-26 生效、适用于已在 settlement 路径上的人、推迟一年是为了给申请人准备时间（物理 p13–p14）。
- gov.uk 出版页 URL 的 slug 写成 "hc-1619"，是 gov.uk 的笔误，页面标题与 PDF 均为 HC 1691。

### SRC-008 Appendix Continuous Residence

- 版本：2025-11-11（HC 1333）；此前 2025-07-29（HC 836）。
- 计算起点 CR 1.1；不算合法在场的期间 CR 2.1；任意 12 个月不超过 180 天 CR 3.1（2018-01-11 前许可的旧口径 CR 3.2，Long Residence 专用口径 CR 3.3，可豁免的缺席原因 CR 3.4）；连续居住中断 CR 4.1–4.4；随行家属缺席 CR 5.1。

### SRC-014 / SRC-015

- Appendix English Language 版本 2026-03-26（HC 1691），settlement 英语豁免 EL 1.1（65 岁及以上、未满 18、残障；EL 1.1(d)(iii)/(iv) 以 2027-03-26 为界）。
- Appendix KOL UK 版本 2025-04-09（HC 733），豁免 KOL 1.1，满足方式 KOL 2.1。注意 HC 1691 修改的 "Appendix KoLL" 是另一个 Appendix（Knowledge of Language and Life），不是 KOL UK。

### SRC-006 Public funds

- 版本：gov.uk `public_updated_at` 2025-04-09（该 HTML publication 无变更记录列表）。页面无段落编号，按小节锚点引用：
  - `#benefits-open-to-new-claims`：属于 immigration public funds 的福利（含 Universal Credit、State Pension Credit、Personal Independence Payment、Carer's Allowance、Housing Benefit 等）。
  - `#contributory-benefits-and-statutory-payments`：**不**属于 public funds 的缴费型福利和法定支付（New Style JSA、New Style ESA、Maternity Allowance、Statutory Sick Pay、Statutory Maternity Pay 等法定育儿支付）。
- Earned Settlement 的"specified public funds"范围尚未确定：SRC-001 p18 说先沿用此定义，纳入范围与豁免在实施前另行公布。

### SRC-009 / SRC-016 IAA

- SRC-009 是 gov.uk HTML publication（首发 2026-07-14，最近更新 2026-10-05）。§1.1 引用 Immigration and Asylum Act 1999 的定义：immigration advice 是就相关移民事项向个人提供、且提供者知道与该个人相关的意见；immigration services 是代表个人向法院 / 审裁庭或政府部门作陈述。§1.1 还说明这些活动在"in the course of business"中进行即受监管，不论是否营利，包括偶尔的帮助。§1.3：依该法 s.84(2)，非 qualified person 提供 immigration advice / services 属犯罪。
- SRC-016（IAA 机构介绍页，2025-01-16）：IAA 调查投诉、对非法提供移民意见者调查并起诉。
- 对产品的含义（不属本任务，只记录）：针对具体个人情况给出移民结论可能落入受监管的 immigration advice，产品文案与免责声明需要法律评估。

### SRC-010 / SRC-011 监控类参考

- SRC-010 首页小节：`#what-you-can-do-with-this-api`（适合引用 GOV.UK 内容并保持更新）、`#what-you-can-39-t-do-with-this-api`（只覆盖 www.gov.uk 页面；不能直接取附件和图片；搜索等动态生成内容不可用）、`#beta-software`、`#authentication`（无需认证）、`#rate-limiting`（每客户端最多 10 请求/秒）。字段定义见 reference.html 的 content item schema（`content_id`、`public_updated_at`、`first_published_at`）。
- 本任务实际用 Content API（`https://www.gov.uk/api/content/<path>`）读取了各 Appendix 的 `public_updated_at` 与 `change_history`，可作为第二阶段变更检测的可行性证据。
- SRC-011：`/new` 页面是动态的，快照只证明 2026-11-04 时的说明文字；feed 本身未入库（内容每天变）。

## 二手来源（仅交叉验证，2026-11-04 用于核对 SRC-001 要点与时间表）

| 标题 | URL |
|---|---|
| Mishcon de Reya: UK earned settlement reforms | https://www.mishcon.com/news/uk-earned-settlement-reforms |
| Lewis Silkin: Home Office sets out revised earned settlement framework | https://www.lewissilkin.com/insights/2026/11/03/home-office-sets-out-revised-earned-settlement-framework-102o7co |
| Fox Williams: Earned Settlement — what the new ILR rules mean | https://www.foxwilliams.com/2026/11/03/earned-settlement-what-the-home-secretarys-new-ilr-rules-mean-for-workers-and-families/ |
| EIN: Earned settlement — policy announced, law not yet changed | https://www.ein.org.uk/blog/earned-settlement-government-has-announced-its-policy-law-has-not-yet-changed |
| Paragon Law: A Fairer Pathway to Settlement explained | https://www.paragonlaw.co.uk/resources/earned-settlement-uk-fairer-pathway-to-ilr |
| DavidsonMorris: Skilled Worker minimum salary 2026 | https://www.davidsonmorris.com/skilled-worker-visa-minimum-salary |

## 研究报告引用标记 → 来源映射（待 Opus 在任务 0.3 中逐条确认）

报告 `docs/research/2026-11-03-deep-research-report.md` 中的 30 个引用 ID 没有 URL。下面是按上下文推断的映射，确认后把每个 ID 换成 `SRC-xxx p<N>`：

| 报告引用 ID | 推断来源 | 置信 |
|---|---|---|
| turn380943view0 | SRC-001 总述 / Foreword | 高 |
| turn377160view0–3 | SRC-001 Ch.4 Residence（p21–25）、Ch.2 Contribution（p13–17）、Ch.3 Integration（p19–20） | 高 |
| turn991133view0–4 | SRC-001 Table 1（p45）、Ch.2、案例 Individual A–D（p18） | 高 |
| turn997970view0–3 | SRC-001 Ch.5 Dependants（p27–28）、Ch.8 Transitional（p40–44）、Public Funds（p17） | 高 |
| turn444181view0 | SRC-001 Ch.1 Character（p10–12） | 高 |
| turn868569view0/2 | SRC-001 Earnings / Long Residence 段落 | 中 |
| turn218854search0/1 | SRC-002 / SRC-003（Hansard 下议院 / 上议院） | 中 |
| turn218854search7/9 | SRC-010（GOV.UK Content API） | 高 |
| turn218854search10 | SRC-011（legislation.gov.uk feeds） | 高 |
| turn648176search3 | SRC-004（Appendix Skilled Worker）及 Immigration Rules 更新日期 2026-10-29 | 高 |
| turn648176search4/5 | SRC-006（Public funds guidance） | 高 |
| turn648176search6/7 | SRC-009（IAA） | 高 |
| turn673303search0–3, 15 | SRC-008 各 Appendix（Scale-up、Global Talent、Innovator Founder、Long Residence、Skilled Worker settlement 段） | 中 |
