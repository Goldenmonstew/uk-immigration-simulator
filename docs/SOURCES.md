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
| SRC-004 | LAW | Immigration Rules: Appendix Skilled Worker（版本 2026-10-08，HC 584；£41,700 + going rate 见 SW 4.2 Option A、SW 8.1；settlement 见 SW 21.1–SW 24.4；dependent partner / child settlement 见 SW 37.1–SW 46.2） | https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-worker | 2026-10-08 | 2026-11-04 | `policy-sources/2026-10-08-immigration-rules-appendix-skilled-worker.html`（sha256 `93459890183de25a83c59b6825581e92a9d89fa2b1f96aa6190c7b6560514e36`） | archived |
| SRC-005 | LAW | Immigration Rules: Appendix Long Residence（版本 2026-10-08，HC 584；settlement 合格期 LR 11.1–11.2，B2 自 2027-03-26 见 LR 13.1） | https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-long-residence | 2026-10-08 | 2026-11-04 | `policy-sources/2026-10-08-immigration-rules-appendix-long-residence.html`（sha256 `6373e989543310ed9a0bd07ba257575fa5b9fed415521a8f9b07f06424dd8d44`） | archived |
| SRC-006 | GUIDANCE | Public funds（Home Office guidance，HTML 版；SRC-001 p18 注 6 指向此页） | https://www.gov.uk/government/publications/public-funds--2/public-funds | 2025-04-09 | 2026-11-04 | `policy-sources/2025-04-09-public-funds-guidance.html`（sha256 `30d3fe6a60d2e2aa84503944d0bd1b2cb06dcf30ec7577027bbf46455b295d55`） | archived |
| SRC-007 | LAW | Statement of Changes in Immigration Rules HC 1691（2026-03-05 提交议会）及其 Explanatory Memorandum：**已证实** 2027-03-26 起多条路线 settlement 英语要求升至 B2（Skilled Worker 见 APP SW5 插入的 SW 22A.1；EM 5.60–5.62） | https://www.gov.uk/government/publications/statement-of-changes-to-the-immigration-rules-hc-1619-5-march-2026 （正文 PDF：https://assets.publishing.service.gov.uk/media/69a9a1f58fd807b03bbe92e5/E03553349_-_HC_1691_-_Immigration_Rules_Changes__Web_Accessible_.pdf ；EM PDF：https://assets.publishing.service.gov.uk/media/69a9a2b8ac93547152b9b1eb/E03553349_-__HC_1691__-_EXPLANATORY_MEMORANDUM__Web_Accessible_.pdf ） | 2026-03-05 | 2026-11-04 | `policy-sources/2026-03-05-hc1691-statement-of-changes-immigration-rules.pdf`（sha256 `6192eb13f84577806c1c4766a45014704cf24a1deef859a66c2eb766c13083cb`）；`policy-sources/2026-03-05-hc1691-explanatory-memorandum.pdf`（sha256 `d4046133ae0f8ce429b20b9e3e81cac5688f6dd2e2474ca6f062ecc7e7271503`） | archived |
| SRC-008 | LAW | Immigration Rules: Appendix Continuous Residence（版本 2025-11-11，HC 1333；180 天缺席规则 CR 3.1，连续居住中断 CR 4.1） | https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-continuous-residence | 2025-11-11 | 2026-11-04 | `policy-sources/2025-11-11-immigration-rules-appendix-continuous-residence.html`（sha256 `c277440028e7e31662248f9d5d8ac8c755fbc958c9f98151d0c1e1c2850f29c6`） | archived（原列的 Settlement Family Life / Global Talent / Scale-up / Innovator Founder / UK Ancestry / Graduate / Student 等 Appendix 不属 MVP-0，未登记） |
| SRC-009 | GUIDANCE | IAA registration explained（Immigration Advice Authority；§1.1 immigration advice / services 的法定定义，§1.3 未经资格提供属犯罪） | https://www.gov.uk/government/publications/iaa-adviser-registration-explained/iaa-adviser-registration-explained | 2026-10-05 | 2026-11-04 | `policy-sources/2026-10-05-iaa-registration-explained.html`（sha256 `980725d32782c7c4ab04ceb65b2a924736a57cbd23fbb45f0413817c0d8e6fa7`） | archived |
| SRC-010 | REFERENCE | GOV.UK Content API 文档：首页（用途、限制、beta、无需认证、10 req/s）与 API reference（`content_id`、`public_updated_at` 字段） | https://content-api.publishing.service.gov.uk/ ；https://content-api.publishing.service.gov.uk/reference.html | —（页面无日期） | 2026-11-04 | `policy-sources/2026-11-04-govuk-content-api-docs.html`（sha256 `1eb1d87b17ec047cc07088d828dce83de7a3e4225ed08f6a6f94c0173a5c446d`）；`policy-sources/2026-11-04-govuk-content-api-reference.html`（sha256 `72861d6c58e48f8f0f9e14d94be29c68a969ffc32473913f9f774e5b136c9ab0`） | archived（第二阶段才用） |
| SRC-011 | REFERENCE | legislation.gov.uk "New Legislation" 页：Atom 订阅 feed 说明，及"与印刷版同步或至少 24 小时内上线"的目标 | https://www.legislation.gov.uk/new （feed：https://www.legislation.gov.uk/new/data.feed ，2026-11-04 实测返回 `application/atom+xml`） | —（动态页面） | 2026-11-04 | `policy-sources/2026-11-04-legislation-gov-uk-new-legislation.html`（sha256 `8878c1d2a2931bcf5c6eb96e03ad1facb62378a0338b3b44b186f2ef0359406d`） | archived（第二阶段才用） |
| SRC-012 | POLICY | Restoring control over the immigration system: White Paper（CP 1326，80 页；发布日是 SRC-001 过渡安排的截止点；settlement B2 见 ¶257，10 年基准见 ¶264） | https://www.gov.uk/government/publications/restoring-control-over-the-immigration-system-white-paper （PDF：https://assets.publishing.service.gov.uk/media/6821f334ced319d02c906103/restoring-control-over-the-immigration-system-web-optimised.pdf ） | 2025-05-12 | 2026-11-04 | `policy-sources/2025-05-12-cp1326-restoring-control-white-paper.pdf`（sha256 `c5ff95a61effb96aff7ad83806cd6892e60c5fe9a2e949a9822b778fd22ad775`） | archived |
| SRC-013 | POLICY | A Fairer Pathway to Settlement: statement and accompanying consultation on earned settlement（CP 1448，60 页；咨询期 2025-11-20 至 2026-02-13；RQF 6 以下 15 年等方案已被 SRC-001 取代，仅作历史对照） | https://www.gov.uk/government/consultations/earned-settlement （PDF：https://assets.publishing.service.gov.uk/media/691edda450b16caf978153d8/Command_Paper_final_-_reviewed7.pdf ） | 2025-11-20 | 2026-11-04 | `policy-sources/2025-11-20-cp1448-earned-settlement-consultation.pdf`（sha256 `0e56c34796ed482282aacdf2a50e40728fb0d603dd738019168ddab24c3bab07`） | archived |
| SRC-014 | LAW | Immigration Rules: Appendix English Language（版本 2026-03-26，HC 1691；settlement 英语豁免 EL 1.1） | https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-english-language | 2026-03-26 | 2026-11-04 | `policy-sources/2026-03-26-immigration-rules-appendix-english-language.html`（sha256 `a1d9f8bf81841a7481439f4ea8d0db77cabaccd5c888d3fc1f49d1dd62fa795f`） | archived |
| SRC-015 | LAW | Immigration Rules: Appendix KOL UK（版本 2025-04-09，HC 733；Life in the UK 豁免 KOL 1.1，满足方式 KOL 2.1） | https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-kol-uk | 2025-04-09 | 2026-11-04 | `policy-sources/2025-04-09-immigration-rules-appendix-kol-uk.html`（sha256 `11cf0a7ac3b7077a3d9dadff97f2b36c71d96f6c57f1a27d84b9473bb9add1d6`） | archived |
| SRC-016 | GUIDANCE | About us - Immigration Advice Authority（IAA 的调查、执法与起诉权） | https://www.gov.uk/government/organisations/immigration-advice-authority/about | 2025-01-16 | 2026-11-04 | `policy-sources/2025-01-16-iaa-about-us.html`（sha256 `4f8fa4114e9b593c7d197574d7144eed1f72adc1130d55f03ade9fb21f827212`） | archived |
| SRC-017 | LAW | Immigration Rules: Appendix Skilled Occupations（版本 2025-11-11，HC 1333；SOC 2020 职业及 going rates） | https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations | 2025-11-11 | 2026-11-04 | `policy-sources/2025-11-11-immigration-rules-appendix-skilled-occupations.html`（sha256 `80e31318ea53831fff90635abc64a4d8ca5eaef574bef66421045410b12818c7`） | archived |
| SRC-018 | LAW | Immigration Rules: Appendix Children（版本 2025-11-11，HC 1333；dependent child 的 age CHI 1.1–1.2、independent life CHI 1A.1、care CHI 2.1、settlement 关系要求 CHI 4.1–4.3；SW 39.4、SW 41A.1 引用） | https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-children | 2025-11-11 | 2026-11-04 | `policy-sources/2025-11-11-immigration-rules-appendix-children.html`（sha256 `51c9aece25bec6a58af8149dd4ab8292a0e87f10538c092e9a89bedad749338f`） | archived |
| SRC-019 | LAW | Immigration Rules: Appendix Immigration Salary List（版本 2025-11-11，HC 1333；SOC 2020 职业、进一步条件、适用国家与 removal date） | https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-immigration-salary-list | 2025-11-11 | 2026-11-04 | `policy-sources/2025-11-11-immigration-rules-appendix-immigration-salary-list.html`（sha256 `eae72b67984b14187821976ca618e81008755e6cab99266bec8dbf002b8c883a`） | archived |
| SRC-020 | LAW | Immigration Rules: Appendix Hong Kong British National (Overseas)（版本 2026-10-08，HC 584；settlement 见 HK 55.1–HK 64.2） | https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-hong-kong-british-national-overseas | 2026-10-08 | 2026-11-04 | `policy-sources/2026-10-08-immigration-rules-appendix-hong-kong-british-national-overseas.html`（sha256 `1dce2a9adfeb1b87d449df1e0ec47ff4578c0e29eae579649366bd94bf67381e`） | archived |
| SRC-021 | LAW | Immigration Rules: Appendix Global Talent（版本 2026-08-03，HC 259；主申请人 settlement 见 GT 8.1–GT 15.2） | https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-global-talent | 2026-08-03 | 2026-11-04 | `policy-sources/2026-08-03-immigration-rules-appendix-global-talent.html`（sha256 `680309baff0dc7e8e6f46eb2e0b6cd042e07f65fa3d0e7f13af8d99c24a6c08d`） | archived |
| SRC-022 | LAW | Immigration Rules: Appendix Settlement Family Life（版本 2026-08-03，HC 259；partner / parent 的 10 年 settlement 见 SETF 1.1–SETF 9.5） | https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-settlement-family-life | 2026-08-03 | 2026-11-04 | `policy-sources/2026-08-03-immigration-rules-appendix-settlement-family-life.html`（sha256 `c0d43e0daca75e7ce0fae936f3559e44858dfd2ae25049719fda5718dbbebddf`） | archived |
| SRC-023 | LAW | Immigration Rules: Appendix Settlement Protection（版本 2026-04-08，HC 1691；主申请人 settlement 见 STP 1.1–STP 5.3） | https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-settlement-protection | 2026-04-08 | 2026-11-04 | `policy-sources/2026-04-08-immigration-rules-appendix-settlement-protection.html`（sha256 `3ce467778ba7539b5fc59bb1e4e9aabeb5b7505db5a194ceabd74cb6bd965482`） | archived |

## 登记备注（按 SRC）

### SRC-001 CP 1707

- PDF 共 62 页（`pdfinfo`）。PDF 物理页 = 页脚印刷页码 + 4（例：Table 1 在物理 p46，页脚印 42）。p2 为空白页。
- 常用定位（物理页）：Introduction 与最低要求 p8–p9；"实施前发布技术与操作指引" p10；Ch.1 Character p11–p12；Ch.2 Contribution p14–p19（收入门槛与税档联动、收入豁免 p15，"best years" p16，家庭合并收入 p17，British connection 与 public funds p18，案例 Individual A–D p19）；Ch.3 Integration p20–p21（B2 及豁免 p21）；Ch.4 Residence p22–p24（core / high talent permission 定义在 p23 注 9、10，不计入路线清单 p24）；Ch.5 Dependants p28–p31（伴侣同时 / 后到 p29，案例 p31）；Ch.7 难民 p36–p40（Safe and Legal p37，Core Protection / Protection Work and Study 与非法入境 +10 p38（注 14 为 2026-03-02 前申请庇护者），Article 31、英语、public funds 与 asylum support 偿还 p39，案例 Individual A–D p40）；Ch.8 过渡安排 p41–p45（案例 p45）；Table 1 p46；Table 2（难民路径）p47–p48；完整影响评估 p54。

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
- **dependent partner / child settlement**：SW 38.1–SW 38.2（suitability）；SW 39.1（P 同时作为 Skilled Worker 获批定居，或已定居 / 入籍且当时持 Skilled Worker 许可）、SW 39.2–SW 39.4（最近一次许可为 P 的 dependant、Appendix Relationship with Partner、子女的关系要求在 Appendix Children）；SW 40.1、SW 41.1–SW 41.2 已 DELETED，子女的照护与年龄 / 独立生活要求改由 SW 41A.1 引用 Appendix Children；SW 42.1（伴侣连续 5 年持 P 的 dependent partner 许可，无薪资要求）；SW 43.1（Appendix Continuous Residence）；SW 44.1（2027-03-26 前 B1、此后 B2，除非豁免）、SW 44.2；SW 45.1（18 岁及以上须 Appendix KOL UK）；SW 46.1–SW 46.2（决定与 Administrative Review）。
- 入境英语积分 SW 4.1 / SW 7.1：现行为 B2（最近一次 Skilled Worker 许可按 B1 授予者可继续用 B1）。

### SRC-005 Appendix Long Residence

- 版本：2026-10-08（HC 584）；此前 2026-08-03（HC 259）、2026-03-26（HC 1691）。
- 现行规则下 Student / Graduate 时间可计入 10 年：LR 11.1(a) 只排除 Appendix Ukraine Scheme、Visitor、Short-term Student (English language)、Seasonal Worker 的许可（permission to stay 阶段同理见 LR 3.1）。不计入的期间见 LR 11.2。
- LR 13.1：2027-03-26 之前申请为 B1，之后为 B2（HC 1691 APP LR1）。

### SRC-006 Public funds

- 版本：gov.uk `public_updated_at` 2025-04-09（该 HTML publication 无变更记录列表）。页面无段落编号，按小节锚点引用：
  - `#benefits-open-to-new-claims`：属于 immigration public funds 的福利（含 Universal Credit、State Pension Credit、Personal Independence Payment、Carer's Allowance、Housing Benefit 等）。
  - `#contributory-benefits-and-statutory-payments`：**不**属于 public funds 的缴费型福利和法定支付（New Style JSA、New Style ESA、Maternity Allowance、Statutory Sick Pay、Statutory Maternity Pay 等法定育儿支付）。
- Earned Settlement 的"specified public funds"范围尚未确定：SRC-001 p18 说先沿用此定义，纳入范围与豁免在实施前另行公布。

### SRC-007 HC 1691

- 结论：**属实**。二手来源的说法与原文一致，但需要两点精确化：(1) 相关条款本身 2026-03-26 已写入 Rules，只是条文按"申请日是否在 2027-03-26 及以后"区分 B1 / B2，所以对引擎而言生效日是 **申请日 ≥ 2027-03-26**；(2) 适用于多条路线，不只 Skilled Worker。
- 正文 PDF 48 页，物理页 = 页脚印刷页 + 4。Implementation 一节在物理 p6–p8：APP SW5、APP LR1、APP EL1、APP KOLL2–7、APP ROB1–2、APP UKA1–2、APP GT6–7、APP SCU1–2、APP INNF1、APP ISP1–2、APP CRP1、APP BP1、APP PL1–2、APP SF1–2 等列在"2026-03-26 生效，此前提交的申请按 2026-03-25 的 Rules 审理"一组（p7）。
- Skilled Worker：物理 p24（印刷页 20）APP SW5 在 SW 22.1 后插入 SW 22A.1（申请日 ≥ 2027-03-26 须口语和听力达到 CEFR B2，除非豁免）与 SW 22A.2。现行 Appendix Skilled Worker 快照（SRC-004）中已有该条文，核对一致。
- Explanatory Memorandum（22 页，物理页 = 印刷页）：5.60 列出受影响路线（Appendix KoLL、Skilled Worker、T2 Minister of Religion、Representative of an Overseas Business、UK Ancestry、Global Talent、Scale Up、Innovator Founder、International Sportsperson、Child Relative (Sponsors with Protection)、Long Residence、Bereaved Partner、Private Life、Settlement Family Life）；5.61 说明这是落实 2025-05 White Paper（SRC-012）的承诺；5.62 说明改动 2027-03-26 生效、适用于已在 settlement 路径上的人、推迟一年是为了给申请人准备时间（物理 p13–p14）。
- gov.uk 出版页 URL 的 slug 写成 "hc-1619"，是 gov.uk 的笔误，页面标题与 PDF 均为 HC 1691。

### SRC-008 Appendix Continuous Residence

- 版本：2025-11-11（HC 1333）；此前 2025-07-29（HC 836）。
- 计算起点 CR 1.1；不算合法在场的期间 CR 2.1；任意 12 个月不超过 180 天 CR 3.1（2018-01-11 前许可的旧口径 CR 3.2，Long Residence 专用口径 CR 3.3，可豁免的缺席原因 CR 3.4）；连续居住中断 CR 4.1–4.4；随行家属缺席 CR 5.1。

### SRC-009 / SRC-016 IAA

- SRC-009 是 gov.uk HTML publication（首发 2026-07-14，最近更新 2026-10-05）。§1.1 引用 Immigration and Asylum Act 1999 的定义：immigration advice 是就相关移民事项向个人提供、且提供者知道与该个人相关的意见；immigration services 是代表个人向法院 / 审裁庭或政府部门作陈述。§1.1 还说明这些活动在"in the course of business"中进行即受监管，不论是否营利，包括偶尔的帮助。§1.3：依该法 s.84(2)，非 qualified person 提供 immigration advice / services 属犯罪。
- SRC-016（IAA 机构介绍页，2025-01-16）：IAA 调查投诉、对非法提供移民意见者调查并起诉。
- 对产品的含义（不属本任务，只记录）：针对具体个人情况给出移民结论可能落入受监管的 immigration advice，产品文案与免责声明需要法律评估。

### SRC-010 / SRC-011 监控类参考

- SRC-010 首页小节：`#what-you-can-do-with-this-api`（适合引用 GOV.UK 内容并保持更新）、`#what-you-can-39-t-do-with-this-api`（只覆盖 www.gov.uk 页面；不能直接取附件和图片；搜索等动态生成内容不可用）、`#beta-software`、`#authentication`（无需认证）、`#rate-limiting`（每客户端最多 10 请求/秒）。字段定义见 reference.html 的 content item schema（`content_id`、`public_updated_at`、`first_published_at`）。
- 本任务实际用 Content API（`https://www.gov.uk/api/content/<path>`）读取了各 Appendix 的 `public_updated_at` 与 `change_history`，可作为第二阶段变更检测的可行性证据。
- SRC-011：`/new` 页面是动态的，快照只证明 2026-11-04 时的说明文字；feed 本身未入库（内容每天变）。

### SRC-012 / SRC-013 政策文件

- SRC-012 White Paper PDF（web-optimised 版）80 页，物理页 = 页脚印刷页 + 3。¶257（物理 p71）：settlement 英语要求在多数路线从 B1 升至 B2；¶264（物理 p72）：settlement 标准合格期升至 10 年；¶265：British citizen 的非英籍家属保留 5 年；¶266–267：将就缩短合格期的积分方案另行咨询（即 SRC-013）。gov.uk 出版页另有 print-ready PDF（82 页）、可访问 HTML 版和 2026-01-20 追加的威尔士语版，未入库。
- SRC-013 咨询文件 PDF 60 页，物理页 = 页脚印刷页 + 4。物理 p10：咨询的选项包括基准合格期 10 年、Skilled Worker 中 RQF 6 以下岗位 15 年等；物理 p8：对经 Health and Care 签证入境的低技能、低薪群体另设 15 年基准的方案。gov.uk 咨询页的 `closing_date` 为 2026-02-13，2026-11-02 在同一页面追加了政府回应（SRC-001）。

### SRC-014 / SRC-015

- Appendix English Language 版本 2026-03-26（HC 1691），settlement 英语豁免 EL 1.1（65 岁及以上、未满 18、残障；EL 1.1(d)(iii)/(iv) 以 2027-03-26 为界）。
- Appendix KOL UK 版本 2025-04-09（HC 733），豁免 KOL 1.1，满足方式 KOL 2.1。注意 HC 1691 修改的 "Appendix KoLL" 是另一个 Appendix（Knowledge of Language and Life），不是 KOL UK。

## 二手来源（仅交叉验证，2026-11-04 用于核对 SRC-001 要点与时间表）

| 标题 | URL |
|---|---|
| Mishcon de Reya: UK earned settlement reforms | https://www.mishcon.com/news/uk-earned-settlement-reforms |
| Lewis Silkin: Home Office sets out revised earned settlement framework | https://www.lewissilkin.com/insights/2026/11/03/home-office-sets-out-revised-earned-settlement-framework-102o7co |
| Fox Williams: Earned Settlement — what the new ILR rules mean | https://www.foxwilliams.com/2026/11/03/earned-settlement-what-the-home-secretarys-new-ilr-rules-mean-for-workers-and-families/ |
| EIN: Earned settlement — policy announced, law not yet changed | https://www.ein.org.uk/blog/earned-settlement-government-has-announced-its-policy-law-has-not-yet-changed |
| Paragon Law: A Fairer Pathway to Settlement explained | https://www.paragonlaw.co.uk/resources/earned-settlement-uk-fairer-pathway-to-ilr |
| DavidsonMorris: Skilled Worker minimum salary 2026 | https://www.davidsonmorris.com/skilled-worker-visa-minimum-salary |

## 研究报告引用标记 → 来源映射（任务 0.3 已逐条核对，2026-11-04）

报告 `docs/research/2026-11-03-deep-research-report.md` 的 57 处引用共用 30 个研究工具内部 ID，报告里没有给出任何 URL，工具当时实际打开的页面已无法还原。因此本表的方法是：**逐条找出引用该 ID 的句子，把句子里的论点与本表登记的快照原文核对，填入能支撑该论点的确定位置**。"报告行"指该文件的行号。SRC-001 的 `p<N>` 是 PDF 物理页（见上方定位约定）。

| 报告引用 ID | 报告行 | 被引用的论点（概括） | 确定来源与位置 | 核对说明 |
|---|---|---|---|---|
| turn380943view0 | 7, 17, 584, 614 | 2026-11-02 发布政府回应；默认 10 年、3/5/10/20 年路径；实施前另发技术指引与完整影响评估 | SRC-001 p1、p3（2026-11 / CP 1707）；p8–p9（最低要求、10 年起点、四原则）；p10（实施前发布技术与操作指引）；p46 Table 1；p54（完整影响评估随实施准备） | 一致。发布日 2026-11-02 另见 gov.uk 咨询页变更记录（SRC-013 页面） |
| turn218854search0 | 7 | 下议院同日陈述：首批修改 2026-12 起提交、2027 年内实施 | SRC-002 HC Deb vol 792 col 593，`#contribution-912FA19F-4360-4FC7-A496-1DA8CA1436FE` | 内容一致；但出处是内政大臣回答 Home Affairs Committee 主席的问答，不在开场陈述中 |
| turn218854search1 | 7 | 上议院陈述：首批规则预计 2027-01 生效，2027–2028 继续修改 | SRC-003 HL Deb vol 860 cols 1423–1424，`#contribution-0681E679-F8C2-48A1-9C1E-54A4705E8C2E` | 内容一致；出处是 Lord Collins 回答 Baroness Lister，不在复述的陈述文本中 |
| turn377160view0 | 19, 95, 132, 535 | Long Residence 关闭；临时路线时间不再计入；core / high talent 路线归类；以个人时间线建模 | SRC-001 p23（Long Residence 关闭、可计入路线、注 9 core permission、注 10 high talent permission）、p24（不计入路线清单） | 一致 |
| turn377160view1 | 61, 76, 126, 227, 516, 531, 614 | "best years" 是为照顾产假、照护、疾病；收入要求豁免；门槛随税档变化；settlement 收入判断与签证薪资判断不同 | SRC-001 p15（门槛与所得税档联动、儿童 / 65 岁及以上 / 身心状况豁免、收入波动的理由）、p16（best years 三种计法） | 一致 |
| turn377160view2 | 126 | B2 英语一般规则也有年龄、健康豁免 | SRC-001 p21 | 一致（儿童、65 岁及以上、身心状况） |
| turn377160view3 | 95 | 路线归类（core permission、high talent、排除路线） | SRC-001 p23 注 9、注 10；p24 | 一致 |
| turn444181view0 | 31, 128 | 四个维度与不可被收入抵消的最低要求；成年人在英犯罪记录即拒绝，含判刑、罚款、社区刑、部分庭外处置；海外定罪 | SRC-001 p8–p9（最低要求、四原则）；p11–p12（Ch.1 Character，"no criminality" 在 p12） | 一致 |
| turn991133view0 | 42 | 3/5/10/20 年路径的收入数字与"best years"（"总结表和正文"） | SRC-001 p46 Table 1；p15–p16 | 一致。注意 p15 写 £12,571 "至少三年"，p16 与 Table 1 写"7 年中 5 年"，原文自相矛盾，已在分析文档 §3.2 记录 |
| turn991133view1 | 42 | 同上 | SRC-001 p15–p16；p46 Table 1 | 同上 |
| turn868569view0 | 42 | 门槛与税档挂钩，应作动态参数 | SRC-001 p15 | 一致 |
| turn868569view2 | 19 | Long Residence 关闭，Student / Graduate 不再自动累积 | SRC-001 p23–p24 | 一致 |
| turn648176search3 | 65, 76, 531, 584 | Skilled Worker 现行一般门槛 £41,700 且须达 going rate，部分类别数字不同；签证与 settlement 用不同薪资判断；Immigration Rules 2026-10-29 有更新 | SRC-004 SW 4.2 Option A 与 SW 8.1（£41,700 + going rate），SW 4.2 Options B–K（其他数字）；页面头部 "Updated: 29 October 2026" | 门槛与段落一致。2026-10-29 是整个 Rules 手册的更新日；Appendix Skilled Worker 本身最近一次修改是 2026-10-08（HC 584） |
| turn673303search15 | 65 | 现行 Skilled Worker 是 settlement 路线，通常要求 5 年连续合资格居留 | SRC-004 SW 21.1–SW 21.2（settlement 薪资 SW 24.3） | 一致 |
| turn673303search0 | 95 | 路线归类"来自现行各 Appendix" | 无法确认 | 原指向可能是 Scale-up / Global Talent / Innovator Founder 等 Appendix，这些不属 MVP-0，未登记快照，无法核对其中段落。该句论点本身由 SRC-001 p23 注 9–10、p24 支撑 |
| turn673303search1 | 95 | 同上 | 无法确认 | 同上 |
| turn673303search3 | 95 | 同上 | 无法确认 | 同上 |
| turn673303search2 | 535 | 现行 Long Residence 下多数合法 Student / Graduate 时间可计入 10 年 | SRC-005 LR 11.1(a)（settlement；permission to stay 阶段为 LR 3.1）；SRC-001 p23 对现行规则的描述 | 一致：LR 11.1(a) 只排除 Ukraine Scheme、Visitor、Short-term Student (English language)、Seasonal Worker |
| turn648176search4 | 99, 549 | 属于 / 不属于 immigration public funds 的福利清单 | SRC-006 `#benefits-open-to-new-claims`、`#contributory-benefits-and-statutory-payments` | 一致（原文为 State Pension Credit） |
| turn648176search5 | 99 | 同上 | SRC-006 同上两个小节 | 一致 |
| turn991133view2 | 120, 516, 549 | 3/5/10 年路径要求申请前 5 年未用 specified public funds，否则 20 年；纳入范围与豁免实施前另定 | SRC-001 p18（另见 p46 Table 1） | 一致 |
| turn997970view3 | 120, 516 | 同上（实施前进一步规定） | SRC-001 p18 | 一致。旧版映射写成 Ch.8 / p40–44，有误 |
| turn997970view0 | 124, 466 | 家庭合并收入 £25,142，只能一方依赖另一方；官方示例中的合并收入家庭 | SRC-001 p17；p19 Individual C | 一致 |
| turn997970view2 | 124, 132, 466, 614 | 伴侣同时入境可同时 settlement，后到者须自己完成合格期；官方示例中的后到伴侣 | SRC-001 p29；p31（Dependants: In Practice，Individual A、B） | 一致 |
| turn991133view4 | 466 | 官方示例：social worker、British citizen 配偶、公共资金使用者、care worker 过渡案例 | SRC-001 p19（Contribution: In Practice，Individual A–D）；p45（Transitional Arrangements: In Practice，Individual A–C） | 一致 |
| turn218854search7 | 363, 608 | Content API 无需认证、返回 JSON、有 `public_updated_at` / `content_id`、可用于保持同步；只覆盖 www.gov.uk、不含附件和搜索结果；beta；10 req/s | SRC-010 首页 `#what-you-can-do-with-this-api`、`#what-you-can-39-t-do-with-this-api`、`#beta-software`、`#authentication`、`#rate-limiting`；reference.html content item schema | 一致 |
| turn218854search9 | 363 | 同上 | SRC-010 同上 | 一致 |
| turn218854search10 | 377, 608 | legislation.gov.uk 提供新立法 Atom feeds，目标与出版同步 | SRC-011 `/new` 页（"simultaneously, or at least within 24 hours"；Legislation feeds） | 一致 |
| turn648176search6 | 409 | immigration advice 指针对具体个人的意见；在经营过程中提供即受监管，不论是否营利 | SRC-009 §1.1、§1.3 | 论点一致。报告把原文 "in the course of business" 误译为"在 business course 中" |
| turn648176search7 | 409 | IAA 有调查、执法、起诉权 | SRC-016（About us） | 一致 |

## SRC-017 常用定位

- 版本：该 Appendix 的 [GOV.UK Content API 变更记录](https://www.gov.uk/api/content/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations) 最近一条为 2025-11-11，说明为 “Updated to reflect Statement of Changes HC 1333”；此前为 2025-07-22（HC 997）。快照的 `govuk:public-updated-at` 同为 `2025-11-11T12:41:03+00:00`。页面头部 “Updated: 29 October 2026” 是整本手册的更新日，不作为此 Appendix 版本日。
- 各表锚点均从 `#table-<编号>-` 开始；数据行按表编号 + SOC 2020 代码定位，不使用 Equivalent SOC 2010 列。
- **Table 1**：基于 ASHE 中位数的 eligible SOC 2020 职业与 going rate；**Table 1a**：2025-07-22 前按旧规则获批、此后持续持有 Skilled Worker 许可者的附加职业（适用例外见该表引言）。两表取 `Going rate (SW – options A and D)` 列。
- **Table 2**：基于 ASHE 第 25 百分位的职业与 going rate；**Table 2aa**：2025-07-22 前获批者的附加职业（资格限制见引言）。两表取 `Going rate (SW – options F and I, GBM and SCU)` 列。
- **Table 2a**：2024-04-04 前获批的 Skilled Worker 附加职业，限制见该表引言；取 `Going rate (SW – option F)` 列。**Table 2b**：2024-04-04 前获批的 Global Business Mobility 附加职业，限制见该表引言；取 `Going rate (GBM – minimum rate)` 列。这些数据不表示所有职业都能用于 Skilled Worker。
- **Tables 1 / 1a / 2 / 2aa / 2a / 2b**：金额均为英镑年薪，基于每周 37.5 小时；首个金额为年薪，括号内是时薪。提取完整 going rate，不提取 70% / 80% / 90% 折扣列；Table 1 / 2 引言明确 settlement 仅适用完整 going rate 列。职业名称不包含同单元格内的后续 eligibility / Note 说明，限制仍以原表为准。
- **Table 3**：按国家薪级确定 going rate 的医疗 / 教育职业；本次仅提取 SOC 2020 代码与职业名。`Going rate (annual)` 中既有医生、牙医等按地区 / 职级列出的金额，也有指向 Table 4 / 5 的行，不能一律当作单一年薪。**Table 3a** 是国家薪级职业的附加清单（含 2025-07-22 前获批者及其他例外），本次未提取。
- **Table 4**：医疗职业按地区与 band 的国家薪级明细；**Table 5**：教育职业按地区与角色的国家薪级明细。本次不解析两表金额。
- **Table 6**：不合资格职业清单；附加清单职业的例外仍须查看各表引言。本次不提取 Table 6。
- **Table 3 行数口径**：保留原表全部 39 行与地区名称；其中 2211、2253、2312 各按 England / Scotland / Wales / Northern Ireland 列四行，因此共有 30 个唯一 SOC。该表按「SOC + 职业名」唯一；六张金额表则各自按 SOC 唯一，不能为满足去重而丢掉国家薪级职业的地区行。

## SRC-018 常用定位

- 版本：[GOV.UK Content API 变更记录](https://www.gov.uk/api/content/guidance/immigration-rules/immigration-rules-appendix-children) 最近一条为 2025-11-11，说明为 “Changes made with reference to Statement of Changes HC 1333”；此前为 2025-04-09（HC 733）。快照的 `govuk:public-updated-at` 同为 `2025-11-11T08:10:22+00:00`。页面头部 “Updated: 29 October 2026” 是整本手册的更新日。
- 适用范围：“Applicant applying as a dependent child” 一节列出的路线包含 Appendix Skilled Worker。
- **Age requirement**：CHI 1.1（申请日未满 18 岁，除非 CHI 1.2）；CHI 1.2（18 岁及以上也可，若最近一次获批的是父 / 母的 dependent child 许可，且 (a) 申请日仍有效或过期不超过 14 天，或 (b) Bereaved Partner / Victim of Domestic Abuse）。
- **Independent life requirement**：CHI 1A.1（不得 leading an independent life；本 Appendix 未给定义）。
- **Care requirement**：CHI 2.1（未满 18 岁时须有符合英国法律的照护与住宿安排）。
- **Relationship requirement: settlement**：CHI 4.1（P 同时获批同一路线定居，或已定居 / 入籍且此前持同一路线许可）；CHI 4.2（最近一次许可为 P 的 dependent child，或在英出生等）；CHI 4.3（另一位家长须同时获批、已定居或为英国公民，除非 P 是唯一在世家长或负唯一抚养责任，或有严重而紧迫的理由）。
- SW 41A.1 只引用其中的 care requirement 与 age and independent life requirement；关系要求经 SW 39.4 引用。

## SRC-019 常用定位

- 版本：[GOV.UK Content API 变更记录](https://www.gov.uk/api/content/guidance/immigration-rules/immigration-rules-appendix-immigration-salary-list) 最近一条为 2025-11-11，说明为 “Updated to reflect Statement of Changes HC 1333”；此前为 2025-07-22（HC 997）。`public_updated_at` 与快照的 `govuk:public-updated-at` 同为 `2025-11-11T12:42:52+00:00`。页面头部 “Updated: 29 October 2026” 是整本手册的更新日。
- **段落定位**：该页没有 `ISL 1.1` 等编号；引用未编号的表前引言（以 “An occupation is only included on the list” 开始）及唯一职业表的 SOC 2020 行，不虚构 ISL 段落号。引言规定须使用 removal date 之前由 sponsor 向申请人签发的 certificate of sponsorship。
- **表格列**：`SOC 2020 occupation code and any further criteria` 同单元格包含四位代码、职业名及 “–” 后的 further criteria；`Included on the Immigration Salary List in:` 实际跨 England / Scotland / Wales / Northern Ireland 四个国家列，单元格原文为 `Yes` 或 `-`；末列为 `Removal date`。本任务数据中的 `nations` 按原表顺序组合值为 `Yes` 的国家名；`criteria` 保留原文措辞（包括 “all jobs”、Note 与后续段落），仅归一化 HTML 换行与空白，不解释条件。
- **行数口径**：唯一表格的 `<tbody>` 共 26 行，其中第 1 行是国家子表头，实际为 25 条职业。按原顺序保留职业行，不按 SOC 去重。1212、2111、5235 仅 Scotland，其余行列四国；removal date 原文为 `31 December 2026`，6135 / 6136 为 `22 July 2028`。这些日期与国家范围均见对应 SOC 行。
- **SRC-017 Table 3a 补充（任务 3.1）**：上文任务 2.6 的“本次未提取”是历史范围；现已从 SRC-017 同一快照脚本提取 8 行国家薪级职业的 SOC 2020 代码与职业名，保留原 `sources` / `occupations` 结构；不提取薪级金额。Table 3a 引言标为 RQF 3–5，适用限制仍以原表引言为准。

## SRC-020 常用定位

- 版本：[GOV.UK Content API 变更记录](https://www.gov.uk/api/content/guidance/immigration-rules/immigration-rules-appendix-hong-kong-british-national-overseas) 最近一条为 2026-10-08（Statement of Changes HC 584），与[手册变更记录](https://www.gov.uk/guidance/immigration-rules/updates) 中该 Appendix 的最近一条一致；`public_updated_at` 与快照的 `govuk:public-updated-at` 同为 `2026-10-08T07:31:23+01:00`，不取手册头部的 2026-10-29。
- **最近一次许可**：HK 55.2(d)（持有或最近持有 Hong Kong BN(O) route 许可）；HK 62.1(a)（最近一次获批许可须为 Hong Kong BN(O) route）。
- **Suitability**：HK 56.1–HK 56.2（Part Suitability、移民法违规与 immigration bail 及其例外）。
- **合格期 / 家庭成员**：HK 62.1(b)（Hong Kong BN(O) route 的 settlement 共用连续 5 年可定居路线许可要求，申请日未满 18 岁除外）；未编号引言区分 BN(O) Status Holder 与 BN(O) Adult Child，BN(O) Household Child 的关系及 household 定义见 HK 15.1–HK 15.3，未另列家庭成员的不同 settlement 合格期。
- **连续居留**：HK 63.1（HK 62.1 的期间须符合 Appendix Continuous Residence）。
- **英语**：HK 60.1（除非豁免，口语与听力至少 CEFR B1）；HK 60.2（引用 Appendix English Language）；本 Appendix 快照未列 2027-03-26 起改 B2 的条款。
- **KOL**：HK 61.1（申请日已满 18 岁且未满 65 岁须符合 Appendix KOL UK）。

## SRC-021 常用定位

- 版本：[GOV.UK Content API 变更记录](https://www.gov.uk/api/content/guidance/immigration-rules/immigration-rules-appendix-global-talent) 最近一条为 2026-08-03（Statement of Changes HC 259），与[手册变更记录](https://www.gov.uk/guidance/immigration-rules/updates) 中该 Appendix 的最近一条一致；`public_updated_at` 与快照的 `govuk:public-updated-at` 同为 `2026-08-03T09:59:24+01:00`，不取手册头部的 2026-10-29。
- **最近一次许可 / Suitability**：GT 8.3（持有或最近获批 Global Talent route 许可）；GT 9.1–GT 9.2（Part Suitability、移民法违规与 immigration bail 及其例外）。
- **3 年合格期**：GT 11.1(a)（Royal Society、British Academy、Royal Academy of Engineering 或 UKRI 背书）；GT 11.1(b)（Arts Council England 或 Tech Nation 的 exceptional talent 背书）；GT 11.1(c)（首次申请使用 Appendix Global Talent: Prestigious Prizes 所列奖项）。
- **5 年合格期**：GT 11.2（Arts Council England 或 Tech Nation 的 exceptional promise 背书）。
- **可计入路线 / 连续居留**：GT 11.3(a)–(h)（列明可组合计入的非 dependant 许可路线）；GT 12.1（引用 Appendix Continuous Residence）。
- **背书 / 收入**：GT 10.1（首次申请使用的背书不得被撤回）；GT 10.2(a)–(b)（最近一次许可期间在英国取得与奖项或背书领域相关的收入）。
- **英语**：GT 13.1(a)–(b)（除非豁免，申请日早于 2027-03-26 为口语与听力至少 CEFR B1，自该日起为 B2）；GT 13.2（引用 Appendix English Language）。
- **KOL**：GT 14.1（引用 Appendix KOL UK）。

## SRC-022 常用定位

- 版本：[GOV.UK Content API 变更记录](https://www.gov.uk/api/content/guidance/immigration-rules/immigration-rules-appendix-settlement-family-life) 最近一条为 2026-08-03（Statement of Changes HC 259），与[手册变更记录](https://www.gov.uk/guidance/immigration-rules/updates) 中该 Appendix 的最近一条一致；`public_updated_at` 与快照的 `govuk:public-updated-at` 同为 `2026-08-03T11:06:52+01:00`，不取手册头部的 2026-10-29。
- **最近一次许可**：SETF 1.3（持有或最近获批 Appendix FM 的 partner / parent 许可）。
- **Suitability**：SETF 2.1–SETF 2.7（Part Suitability、特定事由后的居留要求、移民法违规与 immigration bail）。
- **10 年合格期**：SETF 3.1(a)–(e)（连续 10 年及可组合计入的 family / private life 许可）；SETF 3.2(a)–(b)（补计其他可定居路线期间的条件，包括至少 1 年 Appendix FM 的 partner / parent 许可）。
- **5 年 / 10 年路线与财务定位边界**：未编号引言及 SETF 3.1–SETF 3.2 仅列本 Appendix 的 10 年路线；SETF 2.3–SETF 2.4 所列 5 年为 suitability 事由后的期间，本快照没有独立 5 年 settlement 路线或 financial requirement 段，不能据此定位另一条路线或财务门槛。
- **连续居留**：SETF 4.1（合格期须符合 Appendix Continuous Residence）。
- **英语**：SETF 5.1(a)–(b)（除非豁免，申请日早于 2027-03-26 为口语与听力至少 CEFR B1，自该日起为 B2）；SETF 5.2（引用 Appendix English Language）；dependent child 对应 SETF 15.1–SETF 15.2。
- **KOL**：SETF 6.1（除非豁免，引用 Appendix KOL UK）；dependent child 对应 SETF 16.1。
- **Partner 关系**：SETF 7.1(a)–(c)（伴侣为在英 British citizen、已定居者或同时申请 settlement 者）；SETF 7.2（Appendix Relationship with Partner）；SETF 7.3（以与当前伴侣的关系获批许可至少 1 年）。

## SRC-023 常用定位

- 版本：[GOV.UK Content API 变更记录](https://www.gov.uk/api/content/guidance/immigration-rules/immigration-rules-appendix-settlement-protection) 最近一条为 2026-04-08（Statement of Changes HC 1691），与[手册变更记录](https://www.gov.uk/guidance/immigration-rules/updates) 中该 Appendix 的最近一条一致；`public_updated_at` 与快照的 `govuk:public-updated-at` 同为 `2026-04-08T08:02:26+01:00`，不取手册头部的 2026-10-29。
- **最近一次保护许可**：STP 1.3(a)–(b)（按 asylum application 日期列明持有或最近获批的 refugee / humanitarian protection 许可类别）。
- **Suitability**：STP 2.1(a)–(g)（本 Appendix 自列的 criminality、conduct 与 public good 拒绝事由）。
- **合格期 / 连续期间**：STP 3.1(a)–(b)（在英国连续至少 5 年持 refugee status 或 humanitarian protection）；本 Appendix 未引用 Appendix Continuous Residence。
- **持续保护身份**：STP 4.1（保护身份未被撤销或放弃）；STP 4.2（safe return review 及其指向的撤销 / 不续期条款）。
- **保护许可与 settlement 的衔接**：STP 5.1（满足 suitability 与 eligibility 则授予 settlement）；STP 5.2（未满足 settlement 但仍有权享有保护身份时，继续给予至少 30 个月许可）；本 Appendix 未列首次保护许可的授予年限。
- **英语 / KOL**：本 Appendix 快照未列英语等级、Appendix English Language、Appendix KOL UK 或 2027-03-26 起 B2 的条款，无相应段号可登记。
