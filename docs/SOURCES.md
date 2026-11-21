# 来源登记表（Sources Register）

每周一 06:00 UTC 自动核对来源，结果见 GitHub Actions 的 **Check sources** 工作流日志，也可手动运行该工作流。
若运行失败，人工核对日志中的 changed / fetch failed 来源，并按 [docs/versioning.md §2–§3](versioning.md#2-触发与发现) 确认变更、登记新来源或新快照。

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
| SRC-001 | POLICY | A Fairer Pathway to Settlement: Government Response to the Consultation (CP 1707, 62 页) | https://assets.publishing.service.gov.uk/media/6ae90b0e5b14ba0182a272a4/A_Fairer_Pathway_to_Settlement_-_Government_response_to_the_consultation.pdf | PDF 2026-11-02；HTML 2026-11-12 | PDF 2026-11-04；HTML／集合页 2026-11-15 | `policy-sources/2026-11-02-cp1707-a-fairer-pathway-to-settlement-government-response.pdf`（sha256 `f2ce80103dd331cce70a1e2043ba58d4f791b9650ce1a3ed17a219f7d5f3253c`）；`policy-sources/2026-11-12-cp1707-government-response-accessible.html`（sha256 `157ab17a4bd56aafd66af6d8a68c85363f457f9cd2dfd677c8bdf3b249e76e7b`）；`policy-sources/2026-11-12-earned-settlement-consultation.html`（sha256 `7734758c3fe3229b1755b058fa4f6e5cb8bbe87d1a8f025adf53f05d53ab594b`） | archived |
| SRC-002 | PARLIAMENT | HC Deb 2 November 2026 vol 792 cols 583 起，"Immigration: Earned Settlement"（内政大臣口头陈述及问答）；时间表句在 col 593 | https://hansard.parliament.uk/Commons/2026-11-02/debates/09F388D2-539E-4B0A-ABE2-D3195B14AF0E/ImmigrationEarnedSettlement | 2026-11-02 | 2026-11-04 | `policy-sources/2026-11-02-hansard-commons-immigration-earned-settlement.json`（sha256 `01a9899bc8013613a240080450710f87b9451187794d77f62ba34bc3fcb18d23`） | archived |
| SRC-003 | PARLIAMENT | HL Deb 2 November 2026 vol 860 cols 1415 起，"Immigration: Earned Settlement"（Lord Collins of Highbury 复述陈述及问答）；时间表句在 cols 1423–1424 | https://hansard.parliament.uk/Lords/2026-11-02/debates/5D3D04DB-0971-4B22-B841-6414AAFAA8C9/ImmigrationEarnedSettlement | 2026-11-02 | 2026-11-04 | `policy-sources/2026-11-02-hansard-lords-immigration-earned-settlement.json`（sha256 `c517d2c8fd6530262cbaf7d02d3d78694aeb7bc8ec4a9a51df3431d149f016e0`） | archived |
| SRC-004 | LAW | Immigration Rules: Appendix Skilled Worker（版本 2026-10-08，HC 584；£41,700 + going rate 见 SW 4.2 Option A、SW 8.1；settlement 见 SW 21.1–SW 24.4；dependent partner / child settlement 见 SW 37.1–SW 46.2） | https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-worker | 2026-10-08 | 2026-11-04 | `policy-sources/2026-10-08-immigration-rules-appendix-skilled-worker.html`（sha256 `93459890183de25a83c59b6825581e92a9d89fa2b1f96aa6190c7b6560514e36`） | archived |
| SRC-005 | LAW | Immigration Rules: Appendix Long Residence（版本 2026-10-08，HC 584；settlement 合格期 LR 11.1–11.2，B2 自 2027-03-26 见 LR 13.1） | https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-long-residence | 2026-10-08 | 2026-11-04 | `policy-sources/2026-10-08-immigration-rules-appendix-long-residence.html`（sha256 `6373e989543310ed9a0bd07ba257575fa5b9fed415521a8f9b07f06424dd8d44`） | archived |
| SRC-006 | GUIDANCE | Public funds（Home Office guidance，HTML 版；SRC-001 p18 注 6 指向此页） | https://www.gov.uk/government/publications/public-funds--2/public-funds | 2025-04-09 | 2026-11-04 | `policy-sources/2025-04-09-public-funds-guidance.html`（sha256 `30d3fe6a60d2e2aa84503944d0bd1b2cb06dcf30ec7577027bbf46455b295d55`） | archived |
| SRC-007 | LAW | Statement of Changes in Immigration Rules HC 1691（2026-03-05 提交议会）及其 Explanatory Memorandum：**已证实** 2027-03-26 起多条路线 settlement 英语要求升至 B2（Skilled Worker 见 APP SW5 插入的 SW 22A.1；EM 5.60–5.62） | https://www.gov.uk/government/publications/statement-of-changes-to-the-immigration-rules-hc-1619-5-march-2026 （正文 PDF：https://assets.publishing.service.gov.uk/media/69a9a1f58fd807b03bbe92e5/E03553349_-_HC_1691_-_Immigration_Rules_Changes__Web_Accessible_.pdf ；EM PDF：https://assets.publishing.service.gov.uk/media/69a9a2b8ac93547152b9b1eb/E03553349_-__HC_1691__-_EXPLANATORY_MEMORANDUM__Web_Accessible_.pdf ） | 2026-03-05 | 2026-11-04 | `policy-sources/2026-03-05-hc1691-statement-of-changes-immigration-rules.pdf`（sha256 `6192eb13f84577806c1c4766a45014704cf24a1deef859a66c2eb766c13083cb`）；`policy-sources/2026-03-05-hc1691-explanatory-memorandum.pdf`（sha256 `d4046133ae0f8ce429b20b9e3e81cac5688f6dd2e2474ca6f062ecc7e7271503`） | archived |
| SRC-008 | LAW | Immigration Rules: Appendix Continuous Residence（版本 2025-11-11，HC 1333；180 天缺席规则 CR 3.1，连续居住中断 CR 4.1） | https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-continuous-residence | 2025-11-11 | 2026-11-04 | `policy-sources/2025-11-11-immigration-rules-appendix-continuous-residence.html`（sha256 `c277440028e7e31662248f9d5d8ac8c755fbc958c9f98151d0c1e1c2850f29c6`） | archived（任务 0.3 时其余 Appendix 未登记；后续 Settlement Family Life / Global Talent / UK Ancestry / Innovator Founder / Graduate 分见 SRC-022 / 021 / 026 / 027 / 034） |
| SRC-009 | GUIDANCE | IAA registration explained（Immigration Advice Authority；§1.1 immigration advice / services 的法定定义，§1.3 未经资格提供属犯罪） | https://www.gov.uk/government/publications/iaa-adviser-registration-explained/iaa-adviser-registration-explained | 2026-10-05 | 2026-11-04 | `policy-sources/2026-10-05-iaa-registration-explained.html`（sha256 `980725d32782c7c4ab04ceb65b2a924736a57cbd23fbb45f0413817c0d8e6fa7`） | archived |
| SRC-010 | REFERENCE | GOV.UK Content API 文档：首页（用途、覆盖范围）与 API reference（字段、每客户端 10 req/s 限流） | https://content-api.publishing.service.gov.uk/ ；https://content-api.publishing.service.gov.uk/reference.html | —（页面无日期） | 2026-11-19 | `policy-sources/2026-11-19-govuk-content-api-docs.html`（sha256 `2eadf25194934d6796829e58e1ce1779cfba7148528bd72a13093f81c4ea8eb4`）；`policy-sources/2026-11-19-govuk-content-api-reference.html`（sha256 `ddc9550eeed71c3307f8fd0e5ab6a206bdad8f681acb5bc42baac8d0e2e9c3d3`） | archived（第二阶段才用） |
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
| SRC-024 | LAW | Immigration Rules: Appendix FM: family members（版本 2026-10-08，HC 584；伴侣 5 年 settlement 见 E-ILRP.1.1–E-ILRP.1.6，财务要求见其引用的 E-LTRP.3.1–E-LTRP.3.9） | https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-fm-family-members | 2026-10-08 | 2026-11-04 | `policy-sources/2026-10-08-immigration-rules-appendix-fm-family-members.html`（sha256 `14adc4b2b406b28b4eb5a46e111db870e2edd85101c4c79cccc417f655d576eb`） | archived |
| SRC-025 | LAW | Immigration Rules: Appendix KoLL（版本 2026-03-26，HC 1691；E-ILRP.1.6 引用的英语与 Life in the UK 要求，见 KoLL 2.1–KoLL 2.3，豁免见 Part 3；不同于 SRC-015 Appendix KOL UK） | https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-koll | 2026-03-26 | 2026-11-04 | `policy-sources/2026-03-26-immigration-rules-appendix-koll.html`（sha256 `d3003c6b5b99eacc50e4ac094e8b15c4128d4c11a60400bb5a1b111ed382de38`） | archived |
| SRC-026 | LAW | Immigration Rules: Appendix UK Ancestry（版本 2026-08-03，HC 259；主申请人 settlement 见 UKA 10.1–UKA 17.2） | https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-uk-ancestry | 2026-08-03 | 2026-11-04 | `policy-sources/2026-08-03-immigration-rules-appendix-uk-ancestry.html`（sha256 `82ead664bd3a11260db4bb5e8b1656c9b01cb73a1b1ba3f3ff147feb130d780b`） | archived |
| SRC-027 | LAW | Immigration Rules: Appendix Innovator Founder（版本 2026-08-03，HC 259；主申请人 settlement 见 INNF 15.1–INNF 21.6，业务条件见 INNF 17.1–INNF 17.5） | https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-innovator-founder | 2026-08-03 | 2026-11-04 | `policy-sources/2026-08-03-immigration-rules-appendix-innovator-founder.html`（sha256 `1853949fb4447bd0a0c8d76c79678aaf50947d02336e33f0c0867dbf55894418`） | archived |
| SRC-028 | LAW | Immigration Rules: Appendix Private Life（版本 2026-10-08，HC 584；主申请人 settlement 见 PL 11.1–PL 18.5，合格期分流见 PL 13.1–PL 14.4） | https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-private-life | 2026-10-08 | 2026-11-04 | `policy-sources/2026-10-08-immigration-rules-appendix-private-life.html`（sha256 `43a13c41406b8d7131d7f1e98addcd4afb597b04ea8dded55897ca3d4003e3ad`） | archived |
| SRC-029 | LAW | Immigration Rules Part 8: family members（版本 2026-08-03，HC 259；child settlement 见 para 298–298A） | https://www.gov.uk/guidance/immigration-rules/immigration-rules-part-8-family-members | 2026-08-03 | 2026-11-05 | `policy-sources/2026-08-03-immigration-rules-part-8-family-members.html`（sha256 `66c523cc6f5d9c6370277ab972b9ab07c247090476b5e5c8009d78a88feb8d9f`） | archived |
| SRC-030 | GUIDANCE | Skilled Worker visa: How much it costs（境内标准申请 ≤3 年 £943、IHS 通常每年 £1,035；动态 guide 子页） | https://www.gov.uk/skilled-worker-visa/how-much-it-costs | —（guide 元数据 public_updated_at 为 2024-10-31，非费用生效日） | 2026-11-05 | `policy-sources/2026-11-05-skilled-worker-visa-how-much-it-costs.html`（sha256 `55313dadb207b2caae7c5f77a5487791e61b4faf748b09b740b08b11511594ca`） | archived |
| SRC-031 | GUIDANCE | Home Office immigration and nationality fees, 8 October 2026（ILR 申请费 £3,226） | https://www.gov.uk/government/publications/visa-regulations-revised-table/home-office-immigration-and-nationality-fees-8-october-2026 | 2026-09-10（表内费率自 2026-10-08） | 2026-11-05 | `policy-sources/2026-10-08-home-office-immigration-and-nationality-fees.html`（sha256 `3b4fbb59134f418352ed61e6744bdccbfd341c7467f3e5e0c327b22ab25d2d33`） | archived |

| SRC-032 | POLICY | Budget 2026 (HTML)，HC 726；方向、实施窗口与税务措施见登记备注 | https://www.gov.uk/government/publications/budget-2026-document/budget-2026-html | 2026-10-28 | 2026-11-15 | `policy-sources/2026-10-28-budget-2026.html`（sha256 `200771cdef71c7922e842b94cfbd9ba108778dd2e1965631ed527a920fc0193e`） | archived |
| SRC-033 | PARLIAMENT | Written question 40064：工作签证薪资与 curtailment | https://questions-statements.parliament.uk/written-questions/detail/2026-11-02/40064 | 提问 2026-11-02；回答 2026-11-04 | 2026-11-15 | `policy-sources/2026-11-04-written-question-40064.json`（sha256 `a858b23f4568d18803b17de1ab68c6d5739941b898c9ffb20778eae15d432313`） | archived |
| SRC-034 | LAW | Immigration Rules Appendix Graduate（Appendix 版本 2026-08-03，HC 259；GR 8.1） | https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-graduate | 2026-08-03（页头手册 Updated 2026-10-29） | 2026-11-15 | `policy-sources/2026-08-03-immigration-rules-appendix-graduate.html`（sha256 `d98b79a8f5c36f6828e3a20864067da645cf594508222624f9019e33d2752984`）；`policy-sources/2026-08-03-immigration-rules-appendix-graduate-content-api.json`（sha256 `1278b1bec4b9343da47340a5eb6131eefe91b52df4fe7a47c64b6624d0097972`） | archived |
| SRC-035 | LAW | Immigration Rules Appendix High Potential Individual（版本 2026-08-03，HC 259；HPI 1.6A、5.1–5.3） | https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-high-potential-individual | 2026-08-03（页头手册 Updated 2026-10-29） | 2026-11-15 | `policy-sources/2026-08-03-immigration-rules-appendix-high-potential-individual.html`（sha256 `09988260da18eb0d8941a6d68904b0d7bb5dba65566b0f19ff6b027779928b00`）；`policy-sources/2026-08-03-immigration-rules-appendix-high-potential-individual-content-api.json`（sha256 `a1e8b7ca0aceefcca6bc9f799a4e4d4df7d71d6fb0a0c8a85d33be04a8f54334`） | archived |
| SRC-036 | GUIDANCE | High Potential Individual visa: global universities list 2026（含发布集合页） | https://www.gov.uk/government/publications/high-potential-individual-visa-global-universities-list/high-potential-individual-visa-global-universities-list-2026 | 首发 2026-11-01；更新 2026-11-04 | 2026-11-15 | `policy-sources/2026-11-04-high-potential-individual-global-universities-list-2026.html`（sha256 `7fd240cf29a78651ee91121081af6a56422bdcd0615b80d66c85ec3375d872a6`）；`policy-sources/2026-11-04-high-potential-individual-global-universities-list-index.html`（sha256 `80783082315d8ed9ecafd5ecf848b04704af0a4c396a5adb04c834ae6f2c9281`） | archived |
| SRC-037 | PARLIAMENT | Written question 39721：现有在英者、过渡与影响评估 | https://questions-statements.parliament.uk/written-questions/detail/2026-11-02/39721 | 提问 2026-11-02；回答 2026-11-04 | 2026-11-15 | `policy-sources/2026-11-04-written-question-39721.json`（sha256 `bf4e7e36fdae6f3ff1dd2ee23915ce963de6090d8e1ed6ea339be8177d25f25c`） | archived |
| SRC-038 | PARLIAMENT | Written question 40262：定居合格期不授予同长度停留许可 | https://questions-statements.parliament.uk/written-questions/detail/2026-11-03/40262 | 提问 2026-11-03；回答 2026-11-10 | 2026-11-15 | `policy-sources/2026-11-10-written-question-40262.json`（sha256 `8715dfaabd69d1de9fec59c5a3b9ec29b056bab0b4f578af2dd394e23cf383b6`） | archived |
| SRC-039 | PARLIAMENT | Written question 41453：无改革基线预测与影响评估 | https://questions-statements.parliament.uk/written-questions/detail/2026-11-10/41453 | 提问 2026-11-10；回答 2026-11-13 | 2026-11-15 | `policy-sources/2026-11-13-written-question-41453.json`（sha256 `5bccb509152700b099d6a8027ae4aafc8cf725824c17cc22904fb15b9bc75622`） | archived |
| SRC-040 | PARLIAMENT | Women and Equalities Committee oral evidence，HC 760（Q1–Q26；含官方元数据） | https://committees.parliament.uk/oralevidence/18236/html | 取证／命令刊印 2026-11-04；API publicationDate 2026-11-05 | 2026-11-15 | `policy-sources/2026-11-05-wec-earned-settlement-oral-evidence-hc760.html`（sha256 `80f2ba6774f345baf89219a7ea1c96d2fde494669cb262abf441a50936b4a83e`）；`policy-sources/2026-11-05-wec-earned-settlement-oral-evidence-hc760-metadata.json`（sha256 `fc353df69a41a41fa114c0a3bdffcbbd182e219cb56edde216344108c1c04ffb`） | archived |
| SRC-041 | PARLIAMENT | Women and Equalities Committee 致内政大臣函（5 页） | https://committees.parliament.uk/publications/55734/standard/pdf/ | 信件／发布 2026-11-05 | 2026-11-15 | `policy-sources/2026-11-05-wec-earned-settlement-letter.pdf`（sha256 `3a4e79f3767c789b4bea982f4ad2f8ad62b3d3ba3100f947e3e9272037c9e003`） | archived |
| SRC-042 | GUIDANCE | eVisas: access and use your online immigration status — Travel with your eVisa | https://www.gov.uk/evisa/travel-with-evisa | —（动态 guide 子页；不以旧元数据当政策版本日） | 2026-11-15 | `policy-sources/2026-11-15-evisa-travel-with-evisa.html`（sha256 `de8004ce72037dd75e06bea9f95d0fa6c8e82a28d78959a1c220c2cf43efa48f`） | archived |
| SRC-043 | GUIDANCE | Get an electronic travel authorisation (ETA) to visit the UK: Overview | https://www.gov.uk/eta | —（动态 guide 子页） | 2026-11-15 | `policy-sources/2026-11-15-electronic-travel-authorisation-overview.html`（sha256 `13216b5dceaff98b12f4d02e5a2d15c31315bd2138e81f7f9549ba6332ba8347`） | archived |
| SRC-044 | GUIDANCE | Pay for UK healthcare as part of your immigration application: How much you have to pay | https://www.gov.uk/healthcare-immigration-application/how-much-pay | —（动态 guide 子页） | 2026-11-15 | `policy-sources/2026-11-15-immigration-health-surcharge-cost.html`（sha256 `941b0fcf1251cfccadffe12a794426692bb21a2fd05f9fdbdf8b0e2c824a0b1a`） | archived |
| SRC-045 | GUIDANCE | Life in the UK Test: Book the Life in the UK Test | https://www.gov.uk/life-in-the-uk-test | —（动态 guide 子页） | 2026-11-15 | `policy-sources/2026-11-15-life-in-the-uk-test-booking.html`（sha256 `9ab64fddb4909fdbd0cab8e67f135d8353cbcf3744dbd39444524bb81ff022ba`） | archived |
| SRC-046 | POLICY | HMRC：Income Tax: immigration skills charge and certificate of sponsorship fees | https://www.gov.uk/government/publications/income-tax-treatment-of-immigration-skills-charge-and-certificate-of-sponsorship-fees/income-tax-immigration-skills-charge-and-certificate-of-sponsorship-fees | 2026-10-28 | 2026-11-15 | `policy-sources/2026-10-28-income-tax-immigration-skills-charge-and-cos-fees.html`（sha256 `708daf276a1f1e8369dfb466679e4838017801799722ff646b6b077e6e225085`） | archived |
| SRC-047 | PARLIAMENT | HC Deb vol 792，Budget Resolutions，Resolution 15（临时税收决议） | https://hansard.parliament.uk/Commons/2026-11-03/debates/31AB917B-C6F4-41D2-B256-BAB5D978DA92/BudgetResolutions | 2026-11-03 | 2026-11-15 | `policy-sources/2026-11-03-hansard-commons-budget-resolutions.json`（sha256 `f918f906f9c470cbc1e5f5e1099e1f6b92b8cfce42d4fa3c4a345a46b63fef3e`） | archived |
| SRC-048 | LAW | Statement of Changes to the Immigration Rules HC 584，accessible HTML | https://www.gov.uk/government/publications/statement-of-changes-to-the-immigration-rules-hc-584-3-september-2026/statement-of-changes-to-the-immigration-rules-hc-584-3-september-2026-accessible | 2026-09-03 | 2026-11-15 | `policy-sources/2026-09-03-hc584-statement-of-changes-accessible.html`（sha256 `db5275cd2da6a6b7ed45f4bbfbd67e59e6ace78b808ad267c8295cb73acedd1b`） | archived |
| SRC-049 | PARLIAMENT | Finance Bill 2026–27，Bill 173 as introduced，第 15 条 | https://publications.parliament.uk/pa/bills/cbill/59-02/0173/260173.pdf | 一读 2026-11-03；刊印 2026-11-04 | 2026-11-19（在线核对及元数据） | 无原文快照（议会发布元数据及 SHA-256 见登记备注） | todo |
| SRC-050 | GUIDANCE | Home Office Skilled Worker caseworker guidance，v20.0 | https://www.gov.uk/government/publications/skilled-worker-visa-caseworker-guidance/skilled-worker-caseworker-guidance-accessible | 2026-08-03 | 2026-11-19 | `policy-sources/2026-08-03-skilled-worker-caseworker-guidance.html`（sha256 `c663d22e881510bb4c107e66227395ef7e670430ec7f3d4bcbf4a00966e30f03`） | archived |
| SRC-051 | LAW | Immigration Rules Appendix Student，HC 584 | https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-student | 2026-10-08（页头手册 Updated 2026-10-29） | 2026-11-19 | `policy-sources/2026-10-08-immigration-rules-appendix-student.html`（sha256 `5e05c64b16e288e988bfd970a1eb68d6b80a18d36f454aab5b245e471906b598`） | archived |
| SRC-052 | GUIDANCE | Home Office Student and Child Student caseworker guidance，v15.0 | https://www.gov.uk/government/publications/student-route-caseworker-guidance/student-and-child-student | 员工版 2026-10-09；网页更新 2026-10-16 | 2026-11-19 | `policy-sources/2026-10-16-student-and-child-student-caseworker-guidance.html`（sha256 `87f800b0fd8ad5abfd5222094978ea73d3674bc1156686bbc56fcf7230d35aa1`） | archived |
| SRC-053 | LAW | Immigration Rules Appendix FM-SE: family members specified evidence，HC 1691 | https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-fm-se-family-members-specified-evidence | 2026-03-26（页头手册 Updated 2026-10-29） | 2026-11-19 | `policy-sources/2026-03-26-immigration-rules-appendix-fm-se.html`（sha256 `363d511587597e56df6cc78ad46b987e70bd350a3d0d670f10448413b484cc5d`） | archived |
| SRC-054 | GUIDANCE | Family Migration: Appendix FM and Adult Dependent Relative – adequate maintenance and accommodation，v13.0 | https://assets.publishing.service.gov.uk/media/6911ee0de9348ac8fb54f484/Appendix%2BFM%2Band%2BAdult%2BDependent%2BRelative%2BAdequate%2Bmaintenance%2Band%2Baccommodation.pdf | 2025-11-11 | 2026-11-19 | `policy-sources/2025-11-11-appendix-fm-adequate-maintenance-and-accommodation.pdf`（sha256 `624d2aaa8678c84045a31df6fed30d568cac8a2d3d01efa51ce427ad75a88226`） | archived |
| SRC-055 | LAW | Immigration Act 1971 s.3C: Continuation of leave pending variation decision（现行修订文本） | https://www.legislation.gov.uk/ukpga/1971/77/section/3C | 现行合订文本，按抓取日命名 | 2026-11-19 | `policy-sources/2026-11-19-immigration-act-1971-section-3c.html`（sha256 `e57a1c15ca7f584d247ce76212e2151a8ac6ce44b533358e610916bbaa84ed46`） | archived |
| SRC-056 | GUIDANCE | Workers and Temporary Workers: guidance for sponsors Part 2 – Sponsor a worker，v10/26 | https://www.gov.uk/government/publications/workers-and-temporary-workers-guidance-for-sponsors-part-2-sponsor-a-worker/workers-and-temporary-workers-guidance-for-sponsors-part-2-sponsor-a-worker-accessible--2 | 2026-10-08 | 2026-11-19 | `policy-sources/2026-10-08-sponsor-a-worker-part-2.html`（sha256 `871a45962e40c4954a9a650afdd8f6c775f56fc37eaaa8f54528d08f777ede04`） | archived |
| SRC-057 | GUIDANCE | Home Office Continuous residence caseworker guidance，v10.0 | https://www.gov.uk/government/publications/continuous-residence-caseworker-guidance/continuous-residence-guidance-accessible-version | 2026-10-08 | 2026-11-19 | `policy-sources/2026-10-08-continuous-residence-caseworker-guidance.html`（sha256 `fe80d4c8c759eb21c4c1ebef69b312483414723f1f0dacc2ab9470daa5f465dc`） | archived |
| SRC-058 | PARLIAMENT | Written question 40091：HPI 扩容的大学排名筛选 | https://questions-statements.parliament.uk/written-questions/detail/2026-11-02/40091 | 提问 2026-11-02；回答 2026-11-04 | 2026-11-19 | `policy-sources/2026-11-04-written-question-40091.json`（sha256 `04df2bb18720e55d2f8f62d380750d7a6333a05dbbe8d496d1390b357d2ed8f2`） | archived |
| SRC-059 | GUIDANCE | Home Office Cancellation and curtailment of permission，v12.0 | https://www.gov.uk/government/publications/immigration-status-and-enforcement-action-caseworker-guidance/cancellation-and-curtailment-of-permission-accessible | 员工版 2026-09-11；网页更新 2026-09-14 | 2026-11-19 | `policy-sources/2026-09-14-cancellation-and-curtailment-of-permission.html`（sha256 `1957b79a1d9a074d98c7722f9db134a8349bd5c3ec1284dafda6dc5eee11c96a`） | archived |
| SRC-060 | LAW | Statement of Changes in Immigration Rules HC 590（2024-03-14）Implementation：2024-04-04 前签发 CoS 的 Skilled Worker 申请按 2024-04-03 的规则审理 | https://www.gov.uk/government/publications/statement-of-changes-to-the-immigration-rules-hc-590-14-march-2024/statement-of-changes-to-the-immigration-rules-hc-590-14-march-2024-accessible-version | 2024-03-14 | 2026-11-20 | `policy-sources/2024-03-14-hc590-statement-of-changes-accessible.html`（sha256 `c538acdbce21a3f9cd49c99689efd8134c4f6b9bdbfca6646a01017826ce5ef8`） | archived |
| SRC-061 | LAW | Australian Citizenship Act 2007（Compilation No. 37，2026-06-04；一般资格 s21(2)，一般居住要求 s22） | https://www.legislation.gov.au/C2007A00020/2026-06-04/2026-06-04/text/original/epub/OEBPS/document_1/document_1.html （登记版本：https://www.legislation.gov.au/C2007A00020/2026-06-04/2026-06-04/text ；现行版入口：https://www.legislation.gov.au/C2007A00020/latest/text ） | 2026-06-04 | 2026-11-21 | `policy-sources/2026-06-04-au-australian-citizenship-act-2007-compilation-37.html`（sha256 `75fe3d5ae7abb63837f9348123cfe94baa0cbbda13693d0779da17e4d6aeacab`） | archived |
| SRC-062 | LAW | Migration Regulations 1994（Compilation No. 291，2026-11-03）Volume 1（reg 1.03 定义；Schedule 1 item 1139）与 Volume 2（Schedule 2：100、155、186、189、190、191、801） | https://www.legislation.gov.au/F1996B03551/2026-11-03/2026-11-03/text/original/epub/OEBPS/document_1/document_1.html ；https://www.legislation.gov.au/F1996B03551/2026-11-03/2026-11-03/text/original/epub/OEBPS/document_2/document_2.html （登记版本：https://www.legislation.gov.au/F1996B03551/2026-11-03/2026-11-03/text ；现行版入口：https://www.legislation.gov.au/F1996B03551/latest/text ） | 2026-11-03 | 2026-11-21 | `policy-sources/2026-11-03-au-migration-regulations-1994-compilation-291-vol1.html`（sha256 `fc8ed8facbe2ac35cc28385f014ec15d4b9ebf122f4534ac6e3c01c48e3192f3`）；`policy-sources/2026-11-03-au-migration-regulations-1994-compilation-291-vol2.html`（sha256 `cb7187a13efa7a73f20da21c1e2743e94aff950abe8250d8e6af01c0ac00e0a8`） | archived |
| SRC-063 | GUIDANCE | Department of Home Affairs：Skilled Regional visa（subclass 191）Regional Provisional Visas stream | https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-regional-191/regional-provisional | —（动态页面） | 2026-11-21 | `policy-sources/2026-11-21-au-191-regional-provisional-stream.html`（sha256 `07d09a632a0d95bef34e23f755e31f7aafc088be9b62ee615633cce239bfc02d`） | archived |
| SRC-064 | GUIDANCE | Department of Home Affairs：Employer Nomination Scheme visa（subclass 186）Temporary Residence Transition stream | https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/employer-nomination-scheme-186/temporary-residence-transition-stream | —（动态页面） | 2026-11-21 | `policy-sources/2026-11-21-au-186-temporary-residence-transition-stream.html`（sha256 `391aca298eb2a556682e583e43d2d9de1d32ce223bd2ece8ef4ecb5db5b9b4d9`） | archived |
| SRC-065 | GUIDANCE | Department of Home Affairs：Partner visa（subclass 801）永久阶段 | https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-onshore/permanent-801 | —（动态页面） | 2026-11-21 | `policy-sources/2026-11-21-au-801-partner-permanent.html`（sha256 `31b63e4b5bc7a2153a76a4bb845c22760253a39a377e45fd1cdea57821aff706`） | archived |
| SRC-066 | GUIDANCE | Department of Home Affairs：Resident Return visa（subclasses 155 和 157） | https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/resident-return-visa-155-157 | —（动态页面） | 2026-11-21 | `policy-sources/2026-11-21-au-resident-return-visa-155-157.html`（sha256 `af071d452dd84af5dbcbd3672dd41f8745da6021476e0c4af5ba024b35e7bfb3`） | archived |
| SRC-067 | GUIDANCE | Department of Home Affairs：Become an Australian citizen（by conferral）——永久居民 | https://immi.homeaffairs.gov.au/citizenship/become-a-citizen/permanent-resident | —（动态页面） | 2026-11-21 | `policy-sources/2026-11-21-au-citizenship-permanent-resident.html`（sha256 `312c97ec6555e1007a3557412cf96fde445f1e57915cfb7e73418e3e4cbb049d`） | archived |
| SRC-068 | GUIDANCE | Department of Home Affairs Standard Operating Procedure：General residence requirement and permanent resident status（依 FOI 申请 FA 25/08/01434 公开，部分删节，23 页） | https://www.homeaffairs.gov.au/foi/files/2025/fa-250801434-document-released.PDF | PDF 2025-09-15 | 2026-11-21 | `policy-sources/2025-09-15-au-sop-general-residence-requirement-foi.pdf`（sha256 `4fce927e1b93f2b296f899ffd096b9ec44659b083906d60112f67ad6d22be8b0`） | archived |
| SRC-069 | LAW | Migration Act 1958（Compilation No. 172，2026-10-08）Volume 1：签证何时终止（s82） | https://www.legislation.gov.au/C1958A00062/2026-10-08/2026-10-08/text/original/epub/OEBPS/document_1/document_1.html （登记版本：https://www.legislation.gov.au/C1958A00062/2026-10-08/2026-10-08/text ；现行版入口：https://www.legislation.gov.au/C1958A00062/latest/text ） | 2026-10-08 | 2026-11-21 | `policy-sources/2026-10-08-au-migration-act-1958-compilation-172-vol1.html`（sha256 `52a074ece7fdf107db0802e2079a71870d33f75aeabb91b2ecb842537330d29b`） | archived |
| SRC-070 | LAW | Citizenship Act 1977（新西兰，Version as at 2026-06-06；s8 citizenship by grant） | https://www.legislation.govt.nz/act/public/1977/61/en/latest/ （登记版本 PDF：https://www.legislation.govt.nz/act/public/1977/61/en/2026-06-06.pdf ） | 2026-06-06 | 2026-11-21 | `policy-sources/2026-06-06-nz-citizenship-act-1977-s8.html`（sha256 `f9a43233fabbbbedf29b4b9e56d2c49d2d66f99fd1ae12a865e954132db3be2c`） | archived |
| SRC-071 | LAW | Immigration Act 2009（新西兰，Version as at 2026-07-10；s73 永久居民签证、s74 居民签证与旅行条件） | https://www.legislation.govt.nz/act/public/2009/51/en/latest/ | 2026-07-10 | 2026-11-21 | `policy-sources/2026-07-10-nz-immigration-act-2009-ss73-74.html`（sha256 `850fa60bc0927ba64dcdf43f7cf9541a193b5760e7bc9f9eba2ba6fbffaec649`） | archived |
| SRC-072 | LAW | Immigration New Zealand Operational Manual（Immigration Instructions）：RV2.5 永久居民签证（2024-06-23 生效）、RV2.10 有投资条件的居民签证转永居（2022-09-19）、RV1.15 证据（2012-11-26）、R5.66 居民签证的旅行条件（2026-08-12）、RV1.5 居民签证何时失效（2011-11-07） | https://www.immigration.govt.nz/opsmanual/30505.htm ；https://www.immigration.govt.nz/opsmanual/46181.htm ；https://www.immigration.govt.nz/opsmanual/45649.htm ；https://www.immigration.govt.nz/opsmanual/44894.htm ；https://www.immigration.govt.nz/opsmanual/42631.htm | 见标题 | 2026-11-21 | `policy-sources/2024-06-23-nz-immigration-instructions-rv2-5.html`（sha256 `ae9c55ff6541067f080a52716d7dad82d4658d8b450f510ca04d9e523dc15bed`）；`policy-sources/2022-09-19-nz-immigration-instructions-rv2-10.html`（sha256 `72afede60ccfa7ec2fd75848103442ec444f955878cebf6c3d0487427b483afb`）；`policy-sources/2012-11-26-nz-immigration-instructions-rv1-15.html`（sha256 `c622973856d8b9998ed1b98df1c66a5d8e7c781ec5061292607580f7ea67faa5`）；`policy-sources/2026-08-12-nz-immigration-instructions-r5-66.html`（sha256 `654a93b52da6eba0121832b884735104c17b889b75cb2fd3636d5cffcb096d1d`）；`policy-sources/2011-11-07-nz-immigration-instructions-rv1-5.html`（sha256 `4666d0fbedbf0c4661fc2b0a71e25d3fa8deedec53b9f1e3326d296ea022d3f4`） | archived |
| SRC-073 | GUIDANCE | 新西兰官方说明：govt.nz（Department of Internal Affairs）Presence in NZ requirements；Immigration New Zealand Visa Pak 588（2024-07-18，永久居民签证的 12、24 个月按天计）；Religious Worker Resident Visa 页面（节选）；Department of Internal Affairs 依 OIA 21/22-0423 公开的在境计算器规格（2021-12-15） | https://www.govt.nz/browse/passports-citizenship-and-identity/nz-citizenship/requirements-for-nz-citizenship/presence-requirements/ ；https://www.immigration.govt.nz/assets/inz/documents/visa-paks/visa-pak-588.pdf ；https://www.immigration.govt.nz/visas/religious-worker-resident-visa/ ；https://www.dia.govt.nz/diawebsite.nsf/Files/OIA-releases/$file/OIA-2122-0423.pdf | 见标题（网页为动态页面） | 2026-11-21 | `policy-sources/2026-11-21-nz-citizenship-presence-requirements.html`（sha256 `92d4b3ef1b812709db0fff649e84d9d236d316757a080b37c6eb74afc475947c`）；`policy-sources/2024-07-18-nz-visa-pak-588-prv-periods.pdf`（sha256 `38319ee3e7429c5240024effc666c1b76d4f4be0ed8dea91cf45415590704f3d`）；`policy-sources/2026-11-21-nz-religious-worker-resident-visa.html`（sha256 `234df2062b623f618797781f4e65153ce45658cc45a24773acd4575ba4ad15aa`）；`policy-sources/2021-12-15-nz-dia-oia-2122-0423-presence-calculator.pdf`（sha256 `8ec44efdae4ab842f4267b7cf8891df4018390ab650a4e6c2464b7ae7797a2c6`） | archived |

## 登记备注（按 SRC）

### SRC-001 CP 1707

- PDF 共 62 页（`pdfinfo`）。PDF 物理页 = 页脚印刷页码 + 4（例：Table 1 在物理 p46，页脚印 42）。p2 为空白页。
- 常用定位（物理页）：Introduction 与最低要求 p8–p9；"实施前发布技术与操作指引" p10；Ch.1 Character p11–p12；Ch.2 Contribution p14–p19（收入门槛与税档联动、收入豁免 p15，"best years" p16，家庭合并收入 p17，British connection 与 public funds p18，案例 Individual A–D p19）；Ch.3 Integration p20–p21（B2 及豁免 p21）；Ch.4 Residence p22–p24（core / high talent permission 定义在 p23 注 9、10，不计入路线清单 p24）；Ch.5 Dependants p28–p31（伴侣同时 / 后到 p29，案例 p31）；Ch.7 难民 p36–p40（Safe and Legal p37，Core Protection / Protection Work and Study 与非法入境 +10 p38（注 14 为 2026-03-02 前申请庇护者），Article 31、英语、public funds 与 asylum support 偿还 p39，案例 Individual A–D p40）；Ch.8 过渡安排 p41–p45（案例 p45）；Table 1 p46；Table 2（难民路径）p47–p48；完整影响评估 p54。

- 2026-11-15 补存 [accessible HTML](https://www.gov.uk/government/consultations/earned-settlement/outcome/a-fairer-pathway-to-settlement-government-response-to-the-consultation) 与[咨询集合页](https://www.gov.uk/government/consultations/earned-settlement)。HTML 自身 `first-published-at`／`public-updated-at` 和集合页 `Updates to this page` 均为 2026-11-12；这是补充格式的日期，政策回应仍首发于 2026-11-02。内部 `updated-at` 不作为政策版本日；不另建等权政策编号，不覆盖原 PDF。
- `policy-sources/2026-11-12-cp1707-government-response-accessible.html` → <https://www.gov.uk/government/consultations/earned-settlement/outcome/a-fairer-pathway-to-settlement-government-response-to-the-consultation>
- `policy-sources/2026-11-12-earned-settlement-consultation.html` → <https://www.gov.uk/government/consultations/earned-settlement>
- HTML 定位：`#earnings`、`#how-earnings-will-be-assessed`、`#household-income`、`#public-funds`、`#chapter-6-vulnerable-groups---how-will-vulnerable-groups-be-treated`、`#chapter-8-transitional-arrangements-and-existing-care-workers`、`#in-summary`、`#annex-b-the-economic-case-for-change-`。HTML 小节锚点与 PDF 页序分开引用；收入年数与挂钩税种的分歧仍在，不能据格式更新关闭 PD-041／042。

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

- SRC-010 首页小节 `#what-you-can-do-with-this-api` 说明如何引用 GOV.UK 内容并保持更新。`#what-you-can-39-t-do-with-this-api` 说明覆盖范围限于 www.gov.uk 页面，附件和图片无法直接获取，搜索等动态生成内容不可用。
- SRC-010 的旧首页 `#quick-start` 和 `#authentication` 改见 [Get started](https://content-api.publishing.service.gov.uk/get-started.html) 和该页的 `#authentication`，使用 API 仍无需认证。旧首页 `#rate-limiting` 改见 [API reference 的 Rate limiting](https://content-api.publishing.service.gov.uk/reference.html#rate-limiting)，每客户端仍最多 10 请求/秒。旧首页 `#beta-software` 已移除。
- SRC-010 的字段 `content_id`、`public_updated_at`、`first_published_at` 仍见 [API reference 的 ContentItem](https://content-api.publishing.service.gov.uk/reference.html#schema-contentitem)。Appendix 响应中的 `details.change_history` 按实际 JSON 核对，样例见 SRC-034、SRC-035。
- SRC-010 旧版（抓取日 2026-11-04）保留 `policy-sources/2026-11-04-govuk-content-api-docs.html` 和 `policy-sources/2026-11-04-govuk-content-api-reference.html`。新页面未注明发布日期，快照以抓取日 2026-11-19 命名。
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

## 二手来源（仅交叉验证，2026-11-19 用于核对学生、毕业生路线）

UKCISA 是英国国际学生事务委员会。下列页面抓取于 2026-11-19，核对结果见 [docs/research/2026-11-19-ukcisa-crosscheck.md](research/2026-11-19-ukcisa-crosscheck.md)。页面内各段更新日期不一，数字一律以一级来源为准。

| 标题 | URL |
|---|---|
| UKCISA: Graduate route | https://www.ukcisa.org.uk/student-advice/working/graduate-route/ |
| UKCISA: Skilled Worker route | https://www.ukcisa.org.uk/student-advice/working/skilled-worker-route/ |
| UKCISA: Working after studies | https://www.ukcisa.org.uk/student-advice/working/working-after-studies/ |
| UKCISA: Student work | https://www.ukcisa.org.uk/student-advice/working/student-work/ |
| UKCISA: Student route eligibility and requirements | https://www.ukcisa.org.uk/student-advice/visas-and-immigration/student-route-eligibility-and-requirements/ |
| UKCISA: Student route applying in the UK | https://www.ukcisa.org.uk/student-advice/visas-and-immigration/student-route-applying-in-the-uk/ |
| UKCISA: Student route bringing your family | https://www.ukcisa.org.uk/student-advice/visas-and-immigration/student-route-bringing-your-family/ |
| UKCISA: Student immigration the basics | https://www.ukcisa.org.uk/student-advice/visas-and-immigration/student-immigration-the-basics/ |

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
- **Partner / child settlement — validity**：STP 6.1–STP 6.4（申请表、身份 / 生物信息、境内申请、最近许可及英国出生子女例外、无效申请）。
- **Partner / child settlement — suitability**：STP 7.1(a)–(g)（本 Appendix 自列的 criminality、conduct 与 public good 拒绝事由）。
- **Partner 关系**：STP 8.1(a)–(b)（P 同时在 protection route 获批 settlement，或 P 已在该路线定居且申请人在 P 定居时持其 partner 许可）；STP 8.2（Appendix Relationship with Partner）；STP 8.3 已 DELETED。
- **Child 要求**：STP 8A.1(a)–(c)（引用 Appendix Children 的年龄、照护及 settlement 关系要求）；STP 9.1–STP 9.2、STP 10.1 已 DELETED。
- **Partner / child 合格期 / 英语 / KOL**：快照的 partner / child settlement 部分 STP 6.1–STP 11.3 未列合格期、英语或 KOL 段。
- **Partner / child decision**：STP 11.1–STP 11.3（授予 settlement、仍符合 partner / child 许可资格时给予至少 30 个月 permission to stay，或拒绝申请）。

## SRC-024 常用定位

- 版本：[GOV.UK Content API 变更记录](https://www.gov.uk/api/content/guidance/immigration-rules/immigration-rules-appendix-fm-family-members) 最近一条为 2026-10-08（Statement of Changes HC 584），与[手册变更记录](https://www.gov.uk/guidance/immigration-rules/updates) 中该 Appendix 的最近一条一致；`public_updated_at` 与快照的 `govuk:public-updated-at` 同为 `2026-10-08T07:53:21+01:00`，不取手册头部的 2026-10-29。
- **来源地址**：任务单的 `/immigration-rules-appendix-family-members` 返回 HTTP 404，本表采用官方手册链接中的 `/immigration-rules-appendix-fm-family-members`。
- **Settlement 入口 / suitability**：R-ILRP.1.1(a)–(c)、(e)（双方在英国、有效申请、通过 S-ILR 并满足 E-ILRP，(d) 已 deleted）；S-ILR.1.1（不得因 Part Suitability 被拒）。
- **最近一次许可**：E-ILRP.1.2（申请人须在英国持有效 Appendix FM partner 许可，并列 overstayer 例外）。
- **5 年合格期 / 可计入许可**：E-ILRP.1.1、E-ILRP.1.3(1)(a)–(c)、(2)（连续至少 5 年 / 60 个月，计入 D-ECP.1.1 的 partner 入境许可、D-LTRP.1.1 的 partner 居留许可或其组合，排除 fiancé(e) / proposed civil partner 期间）。
- **关系要求**：E-ILRP.1.3(1A) 引用 E-LTRP 并排除 E-LTRP.1.2(c)–(f)，故伴侣身份按 E-LTRP.1.2(a)–(b) 为 British Citizen / settled；E-LTRP.1.7–E-LTRP.1.10（真实持续关系、有效婚姻 / civil partnership、此前关系结束、永久共同生活及同居证据）。
- **期间计算**：E-ILRP.1.4（只计同一伴侣的期间）；E-ILRP.1.5（Appendix FM-SE paragraph 26A 证据对应期间的境内要求例外）；E-ILRP.1.5A（特定 overstaying 期间可忽略）。
- **财务引用与储蓄倍数**：E-ILRP.1.3(1A)（须满足 Section E-LTRP，适用 E-LTRP.3.1(b)(ii) / E-LTRP.3.7(b)(ii) 时去掉 “2.5 times”）。
- **一般收入 / 储蓄**：E-LTRP.3.1(a)–(c)（指定年毛收入至少 £29,000，储蓄项列 £16,000 及收入缺口，或满足 E-LTRP.3.3）；E-LTRP.3.2(a)–(g)（允许的申请人 / 伴侣等收入与储蓄来源）。
- **财务过渡适用**：E-LTRP.3.5–E-LTRP.3.6（2024-04-11 前首次成功申请且仍持同一伴侣的指定许可者适用 E-LTRP.3.7，更换伴侣适用一般要求）。
- **过渡收入 / 储蓄**：E-LTRP.3.7(a)–(c)（£18,600，首名符合定义的 child 加 £3,800，其后每名加 £2,400，储蓄项列 £16,000 及收入缺口，或满足 E-LTRP.3.3）；E-LTRP.3.8（因子女数计算超过 £29,000 时只需 £29,000）。
- **财务替代 / 住宿**：E-LTRP.3.3(a)–(b)（伴侣领取列明福利时须证明 adequate maintenance and accommodation）；E-LTRP.3.4、E-LTRP.3.9（足够且不拥挤、不违反公共卫生规定的住宿）。
- **英语 / KOL**：E-ILRP.1.6（引用 Appendix KoLL，即 SRC-025；本段不直接列 B1 / B2，分段日期与等级见 KoLL 2.2(b)、(ba)、(c)(i)–(ii)，Life in the UK 见 KoLL 2.3）。
- **10 年路线与 SETF**：GEN.1.17（10 年合格期的 partner / parent 及其 dependent child settlement 必须依 Appendix Settlement Family Life 申请，不在 Appendix FM 审理）；R-ILRP.1.1(d) 已 deleted，不能从该项补造 10 年路线要求。

## SRC-025 常用定位

- 版本：[GOV.UK Content API 变更记录](https://www.gov.uk/api/content/guidance/immigration-rules/immigration-rules-appendix-koll) 最近一条为 2026-03-26（Statement of Changes HC 1691），与[手册变更记录](https://www.gov.uk/guidance/immigration-rules/updates) 中该 Appendix 的最近一条一致；`public_updated_at` 与快照的 `govuk:public-updated-at` 同为 `2026-03-26T09:33:27+00:00`。
- **适用与组合要求**：KoLL 1.1、KoLL 2.1（规定 indefinite leave 的英语与英国生活知识要求，通常须同时满足 KoLL 2.2 与 KoLL 2.3，Part 3 有例外）；本 Appendix 为 Appendix KoLL，不是 SRC-015 的 Appendix KOL UK。
- **英语证明途径**：KoLL 2.2(a)(i)、(iii)–(iv)（列明国籍或学历的指定证明）。
- **已有英语资格**：KoLL 2.2(b)(i)–(iii)、(ba)(i)–(iii)（以此前连续许可所依据的认可英语资格证明时，申请日早于 2027-03-26 至少 B1，自该日起至少 B2，且提供者在申请日仍获认可）。
- **英语考试**：KoLL 2.2(c)(i)–(ii)（认可中心的口语与听力考试，申请日前不超过 2 年，申请日早于 2027-03-26 至少 B1，自该日起至少 B2）。
- **Life in the UK**：KoLL 2.3(a)–(c)（通过获认可的 Life in the UK test，另列 Isle of Man / Guernsey / Jersey 的认可测试）。
- **一般豁免**：KoLL 3.1(a)–(c)（申请日未满 18 岁、至少 65 岁，或因身心状况由决策者认定不宜要求满足其中一项或两项）。
- **长期居留特定例外**：KoLL 3.2(a)(xi)–(xii)、(b)–(d)（包括 Appendix FM partner / parent 连续至少 15 年者，须同时满足 A2 等英语证明、努力学习仍未达 B1 / B2 的教师证明及国籍等限定，不是自动豁免）。
- **后续满足要求**：KoLL 3.3(i)–(iii)（paragraph 39C(c) 适用时，按所欠英语 / Life in the UK 项补足，英语等级亦以 2027-03-26 分 B1 / B2）。

## SRC-026 常用定位

- 版本：[GOV.UK Content API 变更记录](https://www.gov.uk/api/content/guidance/immigration-rules/immigration-rules-appendix-uk-ancestry) 最近一条为 2026-08-03（Statement of Changes HC 259），与[手册变更记录](https://www.gov.uk/guidance/immigration-rules/updates)中该 Appendix 的最近一条一致；`public_updated_at` 与快照的 `govuk:public-updated-at` 同为 `2026-08-03T09:50:43+01:00`，不取手册头部的 2026-10-29。
- **当前 / 最近一次许可**：UKA 10.1（申请 settlement 的人为 UK Ancestry route 上的人）；UKA 10.3（申请日须为 Commonwealth citizen）。本 Appendix 主申请人 settlement 部分未另列 “have, or have last been granted” 的最近一次许可段，不从 dependant 条款补造。
- **Suitability**：UKA 11.1–UKA 11.2（Part Suitability、移民法违规与 immigration bail 及其例外）。
- **仍须满足的资格条件**：UKA 12.1（继续满足 UKA 4.1 至 UKA 6.1）；UKA 4.1（祖父母或外祖父母之一出生于 UK 或 Islands）、UKA 5.1–UKA 5.3（本人及 dependants 的 adequate maintenance and accommodation、不得依赖 public funds、Appendix Finance 证据及可信第三方资助）、UKA 6.1（有能力工作且打算在英国寻找并从事工作）。
- **5 年合格期 / 可计入许可**：UKA 13.1（在英国持 UK Ancestry route 的主申请人许可满 5 年）；本段未列其他路线可组合计入，也未另列月数。
- **连续居留**：UKA 14.1（UKA 13.1 的期间须符合 Appendix Continuous Residence）。
- **英语**：UKA 15.1(a)–(b)（除非豁免，申请日早于 2027-03-26 为口语与听力至少 CEFR B1，自该日起为 B2）；UKA 15.2（引用 Appendix English Language）。
- **KOL**：UKA 16.1（引用 Appendix KOL UK）。
- **Partner / child settlement — validity**：UKA 28.1–UKA 28.4（申请表、费用 / 生物信息 / 身份、境内申请、P 的申请或定居身份、最近许可限制及无效申请）；其中 UKA 28.3A 列最近持 Student 许可者的额外条件。
- **Partner / child settlement — suitability**：UKA 29.1–UKA 29.2（Part Suitability、移民法违规与 immigration bail 及其例外）。
- **Partner / child 关系**：UKA 30.1–UKA 30.2、UKA 30.5（P 同时在 UK Ancestry route 获批 settlement，或已定居 / 入籍且定居时持该路线许可，partner 引用 Appendix Relationship with Partner，child 引用 Appendix Children 的 settlement 关系要求）；UKA 30.3–UKA 30.4 已 DELETED。
- **Partner / child 合格期定位边界**：UKA 31–32 已 DELETED（UKA 31.1、UKA 32.1–UKA 32.2），快照未列合格期。
- **Child 照护 / 年龄 / 独立生活**：UKA 32A.1(a)–(b)（引用 Appendix Children 的照护、年龄及独立生活要求）。
- **Partner / child maintenance**：UKA 33.1–UKA 33.3（本人、UK Ancestry 主申请人及其他 dependants 的足够生活费与住宿，不依赖 public funds；Appendix Finance 证据及可信第三方资助）。
- **Partner / child 英语 / KOL**：UKA 34.1(a)–(b)、UKA 34.2（除非豁免，口语与听力在申请日早于 2027-03-26 为至少 B1，自该日起至少 B2，并引用 Appendix English Language）；UKA 35.1（申请日 18 岁及以上须满足 Appendix KOL UK）。
- **Partner / child decision**：UKA 36.1–UKA 36.2（授予 settlement 或拒绝申请，拒绝后可按 Appendix AR 申请 Administrative Review）。

## SRC-027 常用定位

- 版本：[GOV.UK Content API 变更记录](https://www.gov.uk/api/content/guidance/immigration-rules/immigration-rules-appendix-innovator-founder) 最近一条为 2026-08-03（Statement of Changes HC 259），与[手册变更记录](https://www.gov.uk/guidance/immigration-rules/updates)中该 Appendix 的最近一条一致；`public_updated_at` 与快照的 `govuk:public-updated-at` 同为 `2026-08-03T10:23:50+01:00`，不取手册头部的 2026-10-29。
- **最近一次许可 / 背书有效性**：INNF 15.3（持有或最近获批 Innovator Founder 许可）；INNF 15.2(e)（Endorsing Body 或 Legacy Endorsing Body 的背书信须在申请日前不超过 3 个月签发且未撤回）；INNF 17.5（Legacy Endorsing Body 须与支持最近一次许可的机构相同）。
- **Suitability**：INNF 16.1–INNF 16.2（Part Suitability、移民法违规与 immigration bail 及其例外）。
- **3 年合格期 / 可计入许可**：INNF 18.1（在英国持 Innovator Founder 许可至少 3 年）；本段未列其他路线可组合计入，也未另列月数。
- **连续居留**：INNF 19.1（INNF 18.1 的期间须符合 Appendix Continuous Residence）。
- **业务持续性与申请人参与**：INNF 17.1(a)–(e)（对照此前背书的 business plan 有显著成果、Companies House 注册且申请人列为 director 或 member、active and trading、按资产 / 预期收入与支出判断未来至少 12 个月可持续、申请人在日常管理与发展中发挥 active key role）。
- **业务 / 投资条件，至少满足两项**：INNF 17.1(f)(i)（至少 £50,000 已投资并实际用于推进业务）；(ii)（最近 3 年客户数至少翻倍且高于提供可比主要产品或服务的其他英国企业平均客户数）；(iii)（显著研发活动且已申请英国知识产权保护）；(iv)（最近完整会计年度年毛收入至少 £1 million）；(v)（同一年度年毛收入至少 £500,000，其中海外出口至少 £100,000）；(vi)（为 settled workers 创造相当于至少 10 个全职岗位）；(vii)（相当于至少 5 个全职岗位，每个岗位平均年薪至少 £25,000，毛薪且不含 allowances）。
- **条件不可重复 / 团队与岗位限制**：INNF 17.2（同一 criterion 不能重复计为两项）；INNF 17.3（同时申请或已获 settlement 的团队成员不能共用同一达标成果）；INNF 17.4(a)–(c)（岗位至少存在 12 个月且合规、平均每周至少 30 小时有薪工作，符合条件的不同员工兼职可合并、settled worker 按入职时定义并持续任职整个所申报的 12 个月）。
- **英语定位边界**：主申请人 settlement 部分 INNF 15.1–INNF 21.6 未另列英语要求或 2027-03-26 分段；入境 / 续签的 INNF 5.1 积分表及 INNF 11.1–INNF 11.2 列的是四项能力均至少 CEFR B2（除非豁免，并引用 Appendix English Language）。本 Appendix 中按申请日早于 / 自 2027-03-26 分 B1 / B2 的 INNF 39.1–INNF 39.2 属 partner / child settlement，不是主申请人条款。
- **KOL**：INNF 20.1（引用 Appendix KOL UK）。
- **Partner / child settlement — validity**：INNF 32.1–INNF 32.3（申请表、费用 / 生物信息 / 身份、境内申请、P 的 settlement 申请或已定居 / 入籍身份及申请人的许可 / 出生条件、无效申请）。
- **Partner / child settlement — suitability**：INNF 33.1–INNF 33.2（Part Suitability、移民法违规与 immigration bail 及其例外）。
- **Partner / child 关系 / 最近许可**：INNF 34.1–INNF 34.4（P 同时作为 Innovator Founder 获批 settlement 或已定居 / 入籍时的条件、申请人最近 dependant 许可或英国出生 child 分支，child 引用 Appendix Children 的 settlement 关系要求，partner 引用 Appendix Relationship with Partner）。
- **Child 年龄 / 照护 / 独立生活**：INNF 35.1–INNF 35.2、INNF 36.1 已 DELETED；INNF 36A.1(a)–(b)（引用 Appendix Children 的照护、年龄及独立生活要求）。
- **Partner 合格期 / 连续居留**：INNF 37.1（在英国连续 5 年持 P 的 partner 许可）；INNF 38.1（该期间须符合 Appendix Continuous Residence）。
- **Partner / child 英语 / KOL**：INNF 39.1(a)–(b)、INNF 39.2（上述 B1 / B2 申请日分段及 Appendix English Language 的具体段号）；INNF 40.1（除非豁免，引用 Appendix KOL UK）。
- **Partner / child decision**：INNF 41.1–INNF 41.5（授予 settlement、转作 permission to stay 申请及其费用 / Immigration Health Charge、许可长度与条件、拒绝申请及 Administrative Review）。

## SRC-028 常用定位

- 版本：[GOV.UK Content API 变更记录](https://www.gov.uk/api/content/guidance/immigration-rules/immigration-rules-appendix-private-life) 最近一条为 2026-10-08（Statement of Changes HC 584），与[手册变更记录](https://www.gov.uk/guidance/immigration-rules/updates)中该 Appendix 的最近一条一致；`public_updated_at` 与快照的 `govuk:public-updated-at` 同为 `2026-10-08T07:41:18+01:00`，不取手册头部的 2026-10-29。
- **最近一次许可**：PL 11.3（持有或最近获批 Private Life 许可）；(a)（在英国出生的 child 例外）；(b)（2022-06-20 前获 Appendix FM 或规则外 dependent child 许可，且当时本可满足 PL 3.1(a) 的连续居留要求）；(c)（超过 18 岁、满足或曾满足 half-life test，且在 2022-06-20 前持有或最近获批 Appendix FM 或规则外 family / private life 许可）。
- **Suitability**：PL 12.1、PL 12.3–PL 12.7（Part Suitability；特定事由触发连续 10 年指定许可及刑期结束 / 事由被发现后首次许可起 5 年要求；非法入境的 10 年要求及 child / young adult 例外；可计入许可见 PL 12.6；移民法违规与 immigration bail 及其例外）。PL 12.2 已 DELETED。
- **未满 18 岁 7 年 / 18–24 岁 half-life 的许可入口**：PL 3.1(a)–(b)（申请日未满 18 岁、连续居留至少 7 年且不宜要求离境）；PL 4.1（申请日已满 18 岁且未满 25 岁、18 岁前抵英、在英国连续居留至少半生）。两段属于 permission to stay 的资格要求，不是通用的 settlement 合格期；PL 10.1–PL 10.3 的 30 / 60 个月是授予许可长度，不是 settlement 合格期。
- **英国出生 child 的直接 settlement**：PL 13.1–PL 13.3（英国出生并提供完整出生证明、自出生起连续在英国至少 7 年、不宜要求离境）；未另设先持许可 5 年的要求。
- **5 年合格期**：PL 14.1（持有或最近持有 child 或符合 PL 4.1 half-life test 的 young adult Private Life 许可，连续 5 年持 PL 14.3 或 PL 14.4 指定许可）。
- **其他 5 年过渡情形**：PL 14.1A(a)–(b)、PL 14.1B（2022-06-20 前持有或最近持有 Appendix FM / 规则外 dependent child 许可且当时本可满足 Private Life 规则的 child，申请时或此前申请时满足 PL 3.1(a)，另须连续 5 年持 PL 14.3 许可，两个期间不得重叠）；PL 14.2(b)、PL 14.2A(a)–(c)（2022-06-20 前的指定 family / private life 许可，连续 5 年持 PL 14.3 许可，并须满足或曾满足 half-life test，或最初获批为 child、此后已满 25 岁且在英国连续居留至少半生）。不能简化为所有其他申请人均可走 5 年路线。
- **10 年合格期**：PL 14.2(a)（申请日已满 18 岁且不满足 PL 14.1 者，连续 10 年持 PL 14.3 或 PL 14.4 指定许可；另见上述 PL 14.2(b) / PL 14.2A 的过渡分支）。合格期段以年数表述，未另列 60 / 120 个月。
- **可组合计入路线**：PL 14.3(a)–(e)（Appendix FM partner / parent，排除 fiancé(e) / proposed civil partner；grant letter 称为 family permission 的 partner / parent；2022-06-20 前 paragraph 276ADE / 276BE(2) 或 Appendix Private Life；Appendix FM partner / parent 的 child；依据 Article 8 在规则外授予的 partner / parent / child / private life 许可，及这些许可的组合）；PL 14.4(a)–(b)（PL 14.1 / PL 14.2 可另计其他可定居路线，须未非法入境，Private Life child / young adult 例外，且申请日已有至少 1 年指定 Private Life 许可；该段未列 PL 14.2A）。
- **连续居留**：PL 15.1（settlement 合格期引用 Appendix Continuous Residence，但在英国出生的 child 除外）；英国出生 child 的 PL 13.2 期间按 PL 15A.1–PL 15A.3（可含有 / 无许可期间、监禁 / 特定拘留不计、单次缺席超过 6 个月或累计至少 550 天等中断事由）。不要把许可入口 PL 7.1–PL 7.3 与 settlement 合格期的计算依据混为一谈。
- **英语 / KOL**：PL 16.1(a)–(b)（除非豁免，申请日早于 2027-03-26 为口语与听力至少 CEFR B1，自该日起为 B2）；PL 16.2（引用 Appendix English Language）；PL 17.1（除非豁免，例如未满 18 岁，引用 Appendix KOL UK；快照原文段号写作 `PL17.1`）。
- **与 Appendix Settlement Family Life 的衔接**：本 Appendix 快照未直接引用 Appendix Settlement Family Life；交叉定位 SRC-022 的 SETF 1.3（最近许可为 Appendix FM partner / parent）、SETF 3.1(c)（其 10 年组合可计 Private Life 许可）及 SETF 3.2（计入其他可定居路线的条件）。反向计入 Appendix FM family 许可的依据为本页 PL 14.3(a)–(b)、(d)–(e)，不能把两套 settlement 的最近许可入口互换。
- **英国出生 dependent child settlement — validity**：PL 26.1–PL 26.3（申请表、费用 / 生物信息 / 身份、境内申请、P 的 Private Life settlement 申请或已定居 / 入籍身份及子女出生时间、无效申请）。
- **英国出生 dependent child settlement — suitability**：PL 27.1、PL 27.3–PL 27.6（Part Suitability、特定事由对应的 10 年指定许可与刑期结束 / 事由被发现后首次许可起 5 年要求、可计入许可、移民法违规与 immigration bail 及其例外）；PL 27.2 已 DELETED。
- **英国出生 dependent child 要求**：PL 28.1–PL 28.2 已 DELETED；PL 28A.1(a)–(d)（Appendix Children 的年龄、独立生活、照护及 settlement 关系要求）、PL 28A.2（在英国出生）；PL 29.1–PL 29.2、PL 30.1 已 DELETED。
- **英国出生 dependent child 英语 / KOL**：PL 31.1(a)–(b)、PL 31.2（除非豁免，口语与听力在申请日早于 2027-03-26 为至少 B1，自该日起至少 B2，并引用 Appendix English Language；快照原文写作 `PL31.1`）；PL 32.1（除非豁免，例如未满 18 岁，引用 Appendix KOL UK）。
- **英国出生 dependent child decision**：PL 33.1–PL 33.5（授予 settlement、转作 permission to stay 申请及其费用 / Immigration Health Charge、许可长度与条件，或拒绝申请）。

## SRC-029 常用定位

- 版本：[GOV.UK Content API 变更记录](https://www.gov.uk/api/content/guidance/immigration-rules/immigration-rules-part-8-family-members) 最近一条为 2026-08-03（Statement of Changes HC 259），与[手册变更记录](https://www.gov.uk/guidance/immigration-rules/updates)中 Part 8 的最近一条一致；`public_updated_at` 与快照的 `govuk:public-updated-at` 同为 `2026-08-03T08:17:40+01:00`，不取手册头部的 2026-10-29。
- **Child settlement 小节**：para 298 前的标题为 “Requirements for indefinite leave to remain in the United Kingdom as the child of a parent, parents or a close relative present and settled or being admitted for settlement in the United Kingdom”。
- **父母 / 近亲情形**：para 298(i)(a)（父母双方在英国已定居）；(b)（一方在英国已定居、另一方去世）；(c)（一方在英国已定居且独自承担抚养责任，或子女通常与其同住而非另一方）；(d)（一方在英国已定居或同时获准入境定居、另一方没有且未获批英国限期许可，并列 serious and compelling reasons 例外）；(e)（近亲在英国已定居，子女在英国没有其他可合理期待提供支持或照料的家人）。
- **既往许可 / 年龄分支**：para 298(ii)（持有或曾持有英国限期入境或居留许可）及 (a)（未满 18 岁）；(b)（以定居为目的获批 para 302 或 Appendix FM 许可）；(c)（按 para 319R 入境并作为难民或 humanitarian protection 受益人的子女完成 2 年限期许可，父母现已定居或原保护身份父母现为 British Citizen）；(d)（按 para 319X 持限期许可，其难民或 humanitarian protection 受益人近亲现已定居）；(e)（最近按 para 298A 获批限期居留）；(f)（最近按 Appendix Adoption 或本 Part 的 adopted children rules 获批入境或居留许可）。
- **独立生活 / 住宿 / 生活费**：para 298(iii)（未独立生活、未婚、未另组独立家庭）；(iv)（由入境时投靠的父母 / 近亲提供其独占拥有或使用的足够住宿，不依赖 public funds）；(v)（由该父母 / 近亲提供足够生活费，不依赖 public funds）。
- **Suitability / 英语与 Life in the UK**：para 298(vi)（不得因 Part Suitability 被拒）；(vii)（18 岁及以上且按 para 302、Appendix FM、para 319R 或 para 319X 入境者，按 Appendix KoLL 满足英语与英国生活知识要求；KoLL 见 SRC-025）。
- **未满足 settlement 后的限期许可**：para 298A(a)–(c)（仅因 298(vi) 的 SUI 5.3 所述刑罚 / 处置、18 岁及以上未满足 298(vii)，或原会因 SUI 5.3 被拒时，可给予不超过 30 个月的 limited leave to remain，并附 no recourse to public funds 条件）。
- **Para 302 所在小节**：标题为 “Limited leave to enter or remain in the United Kingdom with a view to settlement as the child of a parent or parents given limited leave to enter or remain in the United Kingdom with a view to settlement”；para 302 为此类子女的限期许可条款，由 para 298(ii)(b) 引用。
- **Appendix FM 交叉引用**：para A277、A277B(a)–(c)、A277C、A277D、A278、A280(a)–(b)、A280(d)(v)、A280(g)、A280B、277、298(ii)(b)、298(vii)（分别见过渡与相互适用条款、partner 定义及上述 child settlement 许可 / KoLL 入口；Appendix FM 见 SRC-024）。
- **Appendix Settlement Family Life 交叉引用**：para A277B(c)（在该段指定情形下，将 Part 8 连续许可期间计入后续 indefinite leave to remain 的连续许可期间；该 Appendix 见 SRC-022）。

## SRC-030 常用定位

- **版本边界**：2026-11-05 抓取整页原始 HTML；GOV.UK Content API `/api/content/skilled-worker-visa` 的 `public_updated_at` 为 `2024-10-31T17:00:39+00:00`，guide 子页 API 同值且未列费用变更记录，不能将该日期当作费用生效日；本次费率使用抓取时正文，并与 SRC-031 的 2026-10-08 费用表 §7 交叉核对。
- **境内标准申请费**：`Application fees` 小节中 “If you’re applying from inside the UK to extend, switch or update your visa” 后的列表：up to 3 years £943，more than 3 years £1,865；不是境外 £819 档。本页小节没有 HTML id，以标题与句子定位。
- **IHS**：`How much it costs` 开头列表中 healthcare surcharge “usually £1,035 per year”；本游戏虚构的续签长度为 3 年，按标准成人 IHS 计，不模拟减免或附加服务。
- **例外范围**：`If your job is on the immigration salary list` 为另一费率；游戏当前仅为林遥的普通 Skilled Worker 主申请人开放续签。本页无 ILR 费用，另见 SRC-031。

## SRC-031 常用定位

- **版本**：标题 “Home Office immigration and nationality fees, 8 October 2026”；页面 Updated 10 September 2026，API `public_updated_at` 为 `2026-09-10T16:15:37+01:00`；使用表格 “Fee from 8 October 2026” 列，而非旧版本表。`/visa-fees` 只提供费用查询入口，因此归档其对应的 GOV.UK 完整费用表。
- **ILR**：§9 `Other applications made in the UK`（`#other-applications-made-in-the-uk`），行 “Indefinite leave to remain - main applicant and dependants”：£3,226（新旧列同值），不是境外 Route to Settlement 行。
- **交叉核对境内 Skilled Worker**：§7 `Work – applications made in the UK`（`#work--applications-made-in-the-uk`），非 Immigration Salary List、非 Health and Care 的 three years or less 行 £943，over three years 行 £1,865。
- **境内 BN(O) 续签**：§9 `Other applications made in the UK`（`#other-applications-made-in-the-uk`），行 “Hong Kong British National (In-Country) for 30 months - main applicant and dependants”，`Fee from 8 October 2026` 列 £206；勿误用 §1 境外行或同节五年档 £285。参数 `hongKongBnoExtensionFee` 按单个申请人收取。
- **境内伴侣续签**：同节行 “Leave to remain - Other”，同列 £1,407；表中没有单列 partner，勿误用 §1 的境外 “Route to Settlement” £2,064。2026-11-05 交叉核对 [Family visas: apply, extend or switch — Fees](https://www.gov.uk/uk-family-visa#fees)，`Cost if joining your partner, parent or child` 的 `Apply in the UK` 列也是 £1,407。参数 `familyPartnerExtensionFee` 采用归档费用表 §9 定位；IHS 复用 SRC-030 的成人年费参数。

## SRC-032 Budget 2026（HTML）

- 首发与 `public_updated_at` 为 2026-10-28；不把预算发布日期当作各措施的生效日。
- 人才方向的主要叙述在 **§5.6 `Backing British business` → `Access to talent`（`#access-to-talent`）**：HPI 拟覆盖 top 150 of the world's best institutions，cap 按比例增加；Graduate 拟对高合规、就业结果良好的大学毕业生给予两年许可。同段将 Global Talent endorsed funder pathway 的扩大描述为已经完成，不是所有 Global Talent 资格的新变更。
- **§7.9 `Backing business and British Industry`（`#backing-business-and-british-industry`）**还列有 `Expanding the High Potential Individual visa`、`Extending the graduate visa from 18 months to two years for eligible universities` 两个措施条目。因此 §5.6 是完整背景定位，§7.9 可作措施清单的补充定位，不能把二者混作同一段。
- 同节 `Implementing Migration Advisory Committee (MAC) recommendations on visa salary requirements` 给出 **2027 年春季**窗口，包括 occupation-specific 门槛改至工资第 25 百分位、更新一般门槛、年度更新、统一 new entrant 折扣、移除 PhD 折扣；`Extending visa curtailment to six months` 给出 **2027 年**窗口。未给确切生效日、金额和完整资格；预算 ¶6.94／6.95 的段号由 SRC-033 答复明确引用，不冒充本 HTML 的段号。
- **§7.4 `Public spending`（`#public-spending-2`）**的 `A change to the tax treatment of the Immigration Skills Charge and Certificate of Sponsorship fees`：针对雇主支付的税务处理，不是玩家申请费或 IHS 减免；临时法定效力另见 SRC-047，解释范围见 SRC-046。

## SRC-033／037／038／039 议会书面问题

- 2026-11-15 四个网页的 `curl` 抓取均返回 **HTTP 403**；在线网页可经阅读服务回读，实际快照采用议会官方 API 的完整单条 JSON（不是列表接口的截短 `answerText`），未保存拒绝页。
- `value.uin`／`value.dateTabled`／`value.dateAnswered` 可核身份与日期。定位为问题号 + 回答日 + `value.answerText` 内**非空 `<p>`** 顺序，不把自动换行或空白段计作一段。

### SRC-033 书面问题 40064

- [官方 API](https://questions-statements-api.parliament.uk/api/writtenquestions/questions/2026-11-02/40064?expandMember=true)
- **SRC-033，40064，回答 2026-11-04**：Answer ¶2–6 对应 Budget ¶6.94（薪资措施和春季窗口），¶8 是引用 MAC 的判断，¶9 对应 ¶6.95（最长六个月与 2027 年），¶10 说细节后续发布。未回答新一般门槛的具体金额。

### SRC-037 书面问题 39721

- [官方 API](https://questions-statements-api.parliament.uk/api/writtenquestions/questions/2026-11-02/39721?expandMember=true)
- **SRC-037，39721，回答 2026-11-04**：Answer ¶2（多数尚未定居的在英者、指定 care／public-sector 过渡不是普遍豁免），¶4（实施前发布经济、平等、儿童影响评估及进一步技术／操作指引）。不能据此补造在途者完整适用边界。

### SRC-038 书面问题 40262

- [官方 API](https://questions-statements-api.parliament.uk/api/writtenquestions/questions/2026-11-03/40262?expandMember=true)
- **SRC-038，40262，回答 2026-11-10**：Answer ¶1（未做所问威慑效果估算），¶2（较长的定居合格期本身不授予同长度停留许可），¶3（无合法停留依据时的处理）。不是新授予许可规则。

### SRC-039 书面问题 41453

- [官方 API](https://questions-statements-api.parliament.uk/api/writtenquestions/questions/2026-11-10/41453?expandMember=true)
- **SRC-039，41453，回答 2026-11-13**：Answer ¶2–3 的预测是无改革基线、有显著不确定性且不含 EUSS；¶4 说改革影响另列 accompanying Impact Assessment。不可换算为角色的获批概率。

## SRC-034 Appendix Graduate

- 页头确实显示 **Updated 29 October 2026**，但属于 Immigration Rules 手册。所附[单页 Content API](https://www.gov.uk/api/content/guidance/immigration-rules/immigration-rules-appendix-graduate) 的 `public_updated_at` 为 `2026-08-03T09:10:18+01:00`，`details.change_history[0]` 同日、HC 259；HTML `govuk:public-updated-at` 一致。按本登记既定约定，Appendix 版本日仍记 **2026-08-03**，同时保留页头日期供复核。
- GR 8.1（`#period-of-grant-for-a-graduate`）：博士三年；其他合格学历在 **2027-01-01 前申请为两年，自该日起申请为 18 个月**，许可长度从决定日计算。GR 4.1 为现有 sponsor 合规要求，不是预算案所提就业结果条件；预算案大学例外见 SRC-032、PD-077，不能提前写入 GR 8.1。引言明确该路线本身不通向 settlement；不据此否定现行 Long Residence 的可计入时间。

## SRC-035 Appendix High Potential Individual

- 所附[单页 Content API](https://www.gov.uk/api/content/guidance/immigration-rules/immigration-rules-appendix-high-potential-individual) 的 `public_updated_at` 为 `2026-08-03T10:10:39+01:00`，最近变更记录为 HC 259；HTML 同值。页头 2026-10-29 仍是手册日期。
- HPI 1.6A：现行年度 cap **8,000**，年度从 **11 月 1 日至翌年 10 月 31 日**；HPI 5.1–5.3（`#global-universities-list-degree-requirement`）：学历及名单按**学位授予日**核对，不能拿今天名单替代。引言明确不是直接 settlement 路线。预算扩容的新 cap 和实施边界仍未确定（PD-078）。

## SRC-036 HPI 大学清单 2026

- `policy-sources/2026-11-04-high-potential-individual-global-universities-list-index.html` → <https://www.gov.uk/government/publications/high-potential-individual-visa-global-universities-list>
- 子页 `first-published-at` 为 2026-11-01，`public-updated-at`／可见 Updated 为 2026-11-04；所附[集合页](https://www.gov.uk/government/publications/high-potential-individual-visa-global-universities-list) `Updates to this page` 分别记载加入 2026 名单和移除旧名单。文件名取子页版本日，不取名单标题的年份或授予期起点。
- 子页正文首段（无独立锚点）将适用学历授予期间定为 **2026-11-01 至 2027-10-31**，随后表头为 `Alphabetical rankings lists 2026`／`Country`。这是现行年度清单，不能作为预算 top 150 新方案已实施的证据。

## SRC-040 Women and Equalities Committee 取证

- `policy-sources/2026-11-05-wec-earned-settlement-oral-evidence-hc760.html` → <https://committees-api.parliament.uk/api/OralEvidence/18236/Document/Html>
- `policy-sources/2026-11-05-wec-earned-settlement-oral-evidence-hc760-metadata.json` → <https://committees-api.parliament.uk/api/OralEvidence/18236>
- 网页直接抓取 403；快照来自上述官方文档 API 返回的 base64 `data`，解码后保留原 HTML。官方元数据的 `meetingDate` 为 2026-11-04，`publicationDate` 为 **2026-11-05**；HTML 卷首的取证与命令刊印日期均为 2026-11-04。二者区分登记，不能只把取证日当网上发布日。
- 定位 **HC 760，Q1–Q26**，引用时保留对应证人及问题号。该材料是证人意见与委员会审查，适合家庭处境素材，不是政府已接受的豁免或新的 Immigration Rules。

## SRC-041 Women and Equalities Committee 信函

- `policy-sources/2026-11-05-wec-earned-settlement-letter.pdf` → <https://committees-api.parliament.uk/api/Publications/55734/Document/309954/OriginalFormat>
- 原 PDF URL 直接抓取 403；从上述官方 API 的 base64 `data` 解码得到原 PDF（126,591 字节）。信件日期与官方发布元数据均为 2026-11-05。
- `pdfinfo`：**5 页**；`pdftotext -f N -l N -layout` 核对：物理 **p1 问题 1–3**（儿童影响评估、单亲／父母不同进度），**p2 问题 4–5**（儿童入籍与 care leavers），**p4 问题 8–10**（残障支持、豁免咨询、家暴支持），**p5 问题 11**（平等影响评估）。本 PDF 页脚恰与物理页相同；这些是问题，不是政府答复；不采用转引的第三方统计。

## SRC-042–045 动态生活指引

- 四页均于 2026-11-15 存整页 HTML，以抓取日命名；没有可确认的独立子页政策版本日。快照 `govuk:public-updated-at` 分别为 2025-07-15、2025-05-28、2024-11-28、2024-12-04，只供技术核对，不当作正文现行要求或费用的生效日。
- **SRC-042 eVisa**：`Travel with your eVisa` 正文开头无独立 `Before you travel` 小节；用该标题后的核对清单（账户护照／个人资料、eVisa 状态、承运人资料）定位。另有 `#when-you-travel`、`#if-youre-asked-to-show-additional-proof-of-your-immigration-status`、`#if-your-passport-or-personal-details-change-when-youre-outside-the-uk`。账户更新不等于续签或延长许可。
- **SRC-043 ETA**：`Overview` 正文开头的 **£20**，`#who-needs-an-eta` 的国籍／目的判断及已有在英生活、工作或学习许可者无需 ETA 的例子。该授权不保证入境；不为现有角色每次返英重复收费。
- **SRC-044 IHS**：`#cost-for-a-year`：一般 **£1,035／年**；学生及其 dependants、Youth Mobility Scheme、申请时未满 18 岁者 **£776／年**；`#cost-for-part-of-a-year`、`#months-or-less`、`#more-than-6-months-but-less-than-one-year`、`#cost-for-more-than-one-year` 给不足整年的计费分档。不能把成人费率直接用于所有儿童／学生。
- **SRC-045 Life in the UK**：`Book the Life in the UK Test` 正文开头 **至少提前三天、£50**；`#prepare-for-the-test` **45 分钟、24 题**；`#book-the-test` 与 `#accepted-forms-of-id` 核预约姓名和证件。未据此确认新版考试或 UKRS A2 版已经推出。

## SRC-046–047 雇主 ISC／CoS 税务

- **SRC-046** 于 2026-10-28 发布；`#general-description-of-the-measure`、`#operative-date`、`#proposed-revisions`：针对雇主支付 ISC／CoS 的 benefit-in-kind 所得税豁免，适用付款日自 **2026-10-28** 起；不扩及 sponsor licence、visa application fee 或 IHS。该政策说明不独自证明法定效力。

### SRC-047 下议院 Budget Resolutions

- **SRC-047** 网页直接抓取 403，存档为[Hansard 官方 API](https://hansard-api.parliament.uk/debates/debate/31AB917B-C6F4-41D2-B256-BAB5D978DA92.json) 完整 JSON。定位 **HC Deb 2026-11-03 vol 792，Resolution 15 `Charges in connection with employment visas`，(1)–(2)**；标题 contribution `26110366000014`，付款日 `56bffe4a-fa6e-450d-8d67-e480fbe11be6`，法定效力声明 `891e7ed4-9876-42cd-a96c-84d71f3576ed`，通过结果 division `21AF684D-09F7-4DDF-A757-F344EFC811B1`。API 没有可用的数字栏号，故采用决议号和精确锚点，不补造 col。
- 决议明确依据 Provisional Collection of Taxes Act 1968 具有临时法定效力，并有通过结果；不把随后 Finance Bill 的草案身份当作永久成法。其作用是税务处理，不是退还玩家移民费用。

## SRC-048 HC 584 accessible

- HTML `first-published-at`／`public-updated-at` 为 2026-09-03；用 HTML 段号／锚点，不附未经核对的 PDF 页码。
- `#implementation`：APP SW1–SW2 自 **2026-10-08**；APP ST8–ST10 自 **2026-11-30**，此前申请按旧规则；APP EU16 自 **2026-12-09**。后两批不是 Earned Settlement 首批规则。
- `#app-sw1`／`#app-sw2`（资格评估机构称谓、特定 modern slavery 个案工作条件）；`#app-st8`／`#app-st9`／`#app-st10`（Student 生活费证明额）；`#app-eu16`（境内非 EEA 申请人身份证明）。与已登记 Appendix 的修法链对应，不据此更改本任务外的参数。

## SRC-049 Finance Bill 2026–27（Bill 173）

- Bill 173 as introduced，第 15 条（PDF 物理 p21、印刷第 8 页）拟在 ITEPA 2003 插入 s326C，豁免缴付 CoS 费和 Immigration Skills Charge 所产生的所得税，第 15(2) 条适用于 **2026-10-28 起支付**的款项。临时法定效力来自 SRC-047 Resolution 15。议会 Bill 4316 截至 2026-11-19 尚未成法，下议院二读排期为 2026-11-23。可对照[官方 PDF p21](https://publications.parliament.uk/pa/bills/cbill/59-02/0173/260173.pdf#page=21)、[官方 HTML](https://publications.parliament.uk/pa/bills/cbill/59-02/0173/260173.html)及[议会进度 API](https://bills-api.parliament.uk/api/v1/Bills/4316)。
- [议会发布 API](https://bills-api.parliament.uk/api/v1/Bills/4316/Publications)的原始响应已存为 `policy-sources/2026-11-04-finance-bill-173-publications.json`（sha256 `83f243758675a15b0b5e44e6f3095e4106b1542f99b09d87e8fc82b2056fb56b`）。发布记录 68588、68590 分别指向上述 PDF 和 HTML，68592 指向 [Bill 173–EN](https://publications.parliament.uk/pa/bills/cbill/59-02/0173/en/260173en.pdf)（物理 p37，Clause 15 ¶1–9）。第 15 条已通过官方 PDF 与 HTML 在线回读。命令行复取这些原件链接均返回 HTTP 403，发布 API 对应记录的 `files` 为空。目前仅存发布元数据，快照列无原文文件。

## SRC-050 Skilled Worker caseworker guidance

- `§1.2 Publication`（`#publication`）标明 v20.0 于 2026-08-03 向 Home Office 工作人员发布，页头及[发布集合](https://www.gov.uk/government/publications/skilled-worker-visa-caseworker-guidance)同日。
- `§11 Tradeable points requirement`（`#tradeable-points`）和 `§12.2 Occupations in Tables 1, 1a, 2, 2aa and 2a`（`#occupations-in-tables-1-1a-2-2aa-and-2a`）用于定位 Option E 及对应 going rate 表。`§16 New entrants`（`#new-entrants`）列六项备选资格，表第 6 项是 Graduate 分支，法律依据为 SRC-004 SW 4.2、12.1–12.3。
- `§16.1 4-year time limit`（`#year-time-limit`）首段明确 Graduate、Skilled Worker、Tier 2 时间均计入，非连续也计入。指引说明整个申请期都须满足上限，担保人可同意修订 CoS，且没有提前换签的计算示例。`§23.1 Dates of permission granted`（`#dates-granted`）给境内获批起日及 CoS 结束后许可尾段。提前换签的未届尾段和逐日核算见 PD-081。
- `§13.5 The going rate → Transitional arrangement for PhD-level roles`（`#transitional-arrangement-for-phd-level-roles`）明列 settlement 的申请截止日。`§22.4 Sponsorship and salary`（`#sponsorship-and-salary`）表后首段要求满足 SW 14.5(c) 的全部条件才能在 settlement 使用过渡安排（PD-080）。

## SRC-051 Appendix Student

- [单页 Content API](https://www.gov.uk/api/content/guidance/immigration-rules/immigration-rules-appendix-student)的 `public_updated_at` 为 `2026-10-08T08:54:41+01:00`，最近 `details.change_history` 为 HC 584，快照元数据同值。页头 2026-10-29 为手册日期。HC 584 已公布的后续生活费变动及过渡见 SRC-048 `#implementation`、`#app-st8`–`#app-st10`。
- `#period-and-conditions-of-grant-for-a-student`：ST 25.1(b)（工作条件）、ST 25.2–25.3 及附表（按 CAS 课程期及课程类型计算许可收尾期）。
- `#work-conditions-for-a-student`：ST 26.1（快照写作 `ST26.1.`）及表格（担保人及课程决定学期工时和非学期工作条件），ST 26.2–26.3（实习及特定选举职位）、ST 26.5–26.6、26.8（禁止工作及例外）。

## SRC-052 Student and Child Student caseworker guidance

- `Publication`（`#publication`）给出 v15.0 的员工版发布日期 2026-10-09，[发布集合](https://www.gov.uk/government/publications/student-route-caseworker-guidance)与 HTML 元数据给出网页更新时间 2026-10-16。`Work conditions`（`#work-conditions`）明确课程完成后仍有效的 Student 许可时间按非学期处理。`Student and Child Student: Prohibited work`（`#student-and-child-student-prohibited-work`）回指 ST 26.6、26.8。
- `Student: period to grant`（`#student-period-to-grant`）回指 ST 25.3，另列境内延长许可在课程已经结束后才获批时的起算和短课例外。

## SRC-053 Appendix FM-SE

- [单页 Content API](https://www.gov.uk/api/content/guidance/immigration-rules/immigration-rules-appendix-fm-se-family-members-specified-evidence)的 `public_updated_at` 为 `2026-03-26T09:03:14+00:00`，最新 `details.change_history` 为 HC 1691，快照元数据同值。2026-10-29 是 Immigration Rules 手册页头日期。
- 常用定位为 ¶12(a)–(n) 与段末 (i)–(ii)（指定福利与当前领取证明），¶12A(a)–(f)（收入、储蓄、住宿和 Council Tax 证据），¶11–11A 与 ¶12B（储蓄可计范围及按周折算），¶18–20（各类收入口径）。适用入口为 SRC-024 E-LTRP.3.3 与 E-ILRP.1.3(1A)，计算方法见 SRC-054。

## SRC-054 Adequate maintenance and accommodation caseworker guidance

- [Home Office 发布集合](https://www.gov.uk/government/publications/chapter-8-appendix-fm-family-members)的 2025-11-11 更新指向 v13.0 原件。PDF 共 33 页，物理页序与印刷页码一致。
- 常用定位为 p6–8（定义与适用群体），p9–10（`A − B ≥ C`、决定日费率、按周折算和舍入），p12–15（现金储蓄及可计收入），p17–19（福利、收入、储蓄和住房成本凭证），p23–26（住房权属／使用、拥挤和公共卫生）。p14 算例的 `C` 表格合计与正文比较行不同，实际基准按 p9 用决定日费率。

## SRC-055 Immigration Act 1971 s.3C

- 快照是 [legislation.gov.uk 现行修订条文](https://www.legislation.gov.uk/ukpga/1971/77/section/3C)的原始 HTML。s.3C(1)(a)–(c) 规定触发条件，s.3C(2)(a) 规定待决／未撤回期间，s.3C(2)(b)–(d) 另列符合条件的上诉或 administrative review 窗口及待决期间。s.3C(3) 规定离境失效，s.3C(3A) 规定可取消的事由，s.3C(4)–(5) 区分另提申请与变更原申请。

## SRC-056 Workers and Temporary Workers: Part 2 – Sponsor a worker

- `#version-number-and-publication` 标明 v10/26，2026-10-08 发布。CoS 定位：S2.1–S2.7 `#What_is_a`、S2.8–S2.11 `#Types_of_CoS`、S3.8 `#Information_you_must`（工作起止日、薪资、工时和 occupation code）。
- 薪资及 going rate 定位：S3.29–S3.32 `#Standard_occupational_classificatio`（SOC code 与去 SRC-017 查表）；S4.1–S4.5 `#Minimum_pay_rates`（路线薪资要求及合规）；S4.14–S4.16 `#Salary_information_you`、`#period-the-salary-must-cover`（工资申报）；S4.29–S4.31 `#Salary_otherwise_reduced`、`#salary-reductions-exceptions`（降薪、going rate 与报告）。具体 Skilled Worker 条件和费率引用 SRC-004、SRC-017。

## SRC-057 Continuous residence caseworker guidance

- `#publication` 标明 v10.0，2026-10-08 向 Home Office 工作人员发布。`#count-whole-days` 只计整天。`#calculating-the-length-of-absences` → `#the-12-month-period` 末段说明 Long Residence 跨过渡日行程何时开始适用滚动窗口。
- `#calculating-absences-which-started-before-11-april-2024-for-appendix-long-residence` 与其 Example 2 分别定位单次和累计旧限额、跨日行程在旧限额的计数范围，法源为 SRC-008 CR 3.1、CR 3.3(a)–(b)，并受 CR 3.4 所列例外约束。`#time-spent-on-3c-or-3d-leave` 说明此类法定延续在 continuous residence 中按相关路线的许可时间计算。
## SRC-058 书面问题 40091

- 快照取自[议会官方单条 API](https://questions-statements-api.parliament.uk/api/writtenquestions/questions/2026-11-02/40091?expandMember=true)。
- **40091，2026-11-04，Answer ¶1 后的榜单及 ¶2**：拟扩容的大学须在相关年份的 Times Higher Education World University Rankings、QS World University Rankings、Academic Ranking of World Universities（ARWU）中至少两个进入前 150。正式名单、新申请 cap 及生效日仍待公布（PD-078）。答复提到的 `Paragraph 6.2` 与现行 Appendix 的段号不符，现行 HPI 6.2 是英语要求，名单按学位授予日匹配的要求见 SRC-035 HPI 5.2。扩容筛选方法引本答复。

## SRC-059 Cancellation and curtailment of permission

- `Publication`（`#publication`）注明 v12.0 于 2026-09-11 向 Home Office 员工发布，网页更新于 2026-09-14。
- `Cancellation in points-based system (PBS) cases → Premature end of employment or study: cancellation process`（`#premature-end-of-employment-or-study-cancellation-process`）首个列表项明确，进一步许可获批后，新许可已替代原许可，无需另行取消原许可。上一小节的 `Individual granted permission in another category`（`#individual-granted-permission-in-another-category`）也给出改获其他类别许可时的办案操作。与 SRC-050 §23.1 合读可支持境内提前换签的许可期间推导，SW 12.3 逐日及 section 3C 的计法见 PD-081。

## SRC-060 HC 590 Implementation

- `Implementation`（`#implementation`）第三段：列明的条款于 2024-04-04 生效；以 2024-04-04 前由 sponsor 签发的 certificate of sponsorship 提出的入境或居留申请（及其伴侣、子女的随行申请），按 2024-04-03 有效的移民规则审理。所列条款含 APP SW1 至 APP SW28 与 APP SO1。与 SRC-004 SW 4.2(b)(ii) 合读，用于判断连续 Skilled Worker 许可的首段是否按旧规则获批。

## SRC-061 Australian Citizenship Act 2007

- 快照取 legislation.gov.au 该版本的 EPUB 正文页，版本 Compilation No. 37（Compilation date 2026-06-04，含 Act No. 75, 2025）。澳洲条文用 section 号定位，如 `s22(1)(a)`。
- `s5(1)`：permanent resident 指在澳并持永久签证的人；在境外时，须此前在澳且上次离境前已持永久签证（离境后在境外另获的永久签证，如 RRV，不改变这一点）。因此在境外获发的第一份永久签证，要持该签证入境后才算永久居民；只有日期时，引擎把出境当天生效的永久签证视为离境后才获发。
- `s21(2)`：一般资格，(a) 申请时满 18 岁，(b) 申请时和决定时都是 permanent resident，(c) 申请时满足一般居住要求（s22）。
- `s22(1)`：申请日前 4 年在澳（a）、其间不曾是 unlawful non-citizen（b）、申请日前 12 个月以永久居民身份在澳（c）。`s22(1A)`：4 年内出境合计不超过 12 个月视为在澳。`s22(1B)`：最后 12 个月出境合计不超过 90 天且出境期间一直是永久居民，视为以永久居民身份在澳。`s22(1C)` 规定 4 年内曾被监禁或依法院命令收治的不满足 (1)(a)。`s22(2)` 起为豁免与部长裁量，试点不建模。

## SRC-062 Migration Regulations 1994

- 快照取 legislation.gov.au 该版本 EPUB 的第 1、2 个正文文件，版本 Compilation No. 291（Compilation date 2026-11-03，含 F2026L01466）。条款号直接定位，如 `155.212(2)`、`Sch 1 item 1139(3)(c)`。
- Volume 1：`reg 1.03` 定义 regional provisional visa（491、494）与 long-term partner relationship（两人以配偶或事实伴侣身份持续满 3 年；有双方共同的受抚养子女、且不是继子女时满 2 年）。`Sch 1 item 1139(3)(c)`：191 的 Regional Provisional 主申请人须持有 regional provisional visa 且已持有满 3 年。
- Volume 2：`155.212(2)` RRV 5 年内以永久签证持有人或公民身份在澳合计不少于 2 年，`155.511(b)` 符合者获 5 年旅行便利。`186.221` 申请时未满 45 岁（文书列明的类别除外）；`186.226(1)` 申请前 3 年内持 457／482（含其后的 bridging visa）合计至少 2 年；`186.227(1)` 同期为 approved work sponsor 全职工作合计至少 2 年（不含无薪假）。`191.111` relevant income year 的定义，`191.222` 须交 3 个 relevant income year 的税务评估通知。`801.221(2)(d)`、`100.221(2)(c)`：伴侣签递交满 2 年；`801.221(6A)`、`100.221(5)`：递交时已是 long-term partner relationship 的不受 2 年限制。`100.221(6)`：担保人持有或曾持有永久人道签证、获签前双方已是配偶或事实伴侣并已告知移民局的，也不受限制。`100.511`、`186.511`、`189.511`、`190.511`、`191.511`、`801.511`：永久签证的旅行便利为批准日起 5 年。

## SRC-063 191 Regional Provisional Visas stream

- `Eligibility → Have an eligible visa`：申请时须持 491 或 494，且已持有满 3 年。`Satisfy the income requirement`：没有最低收入要求，须提供合格签证 5 年中 3 个财年的 ATO 评估通知。页面内容以 JSON 嵌在 HTML 中，按小节标题定位。

## SRC-064 186 Temporary Residence Transition stream

- `Eligibility → Have 2 years eligible sponsored employment in the 3 years prior to your application`：全职、在澳、持 457／482 或合格 bridging visa 期间、在获批职业内。年龄小节写明通常须未满 45 岁，并列出豁免类别。`Have this visa`：申请时须是 457 或 482 的主签证持有人，或持因 457、482、186、187 申请获发的 bridging visa，且上一份实质签证是 457／482。

## SRC-065 801 Partner（permanent）

- `Eligibility → Visa requirements`：须持 820（或 445），自递交 820 与 801 申请起满 2 年才进入永久阶段评估；部分情形可不满 2 年获批。

## SRC-066 Resident Return visa 155／157

- `Eligibility → Meet our residence, substantial ties, or member of the family unit requirements` 中的 `Option 1: Present in Australia for 2 of the last 5 years`：2 年按 730 个累计在澳日计算，5 年从 RRV 递交日倒数；入境日与出境日都计为在澳，同日出入境只计一天，在澳的部分日按整日计。符合者获 5 年旅行便利。

## SRC-067 入籍（永久居民）

- `Residence requirement → Meet the general residence requirement`：申请前 4 年持有效签证在澳，最后 12 个月持永久签证，4 年内出境合计不超过 12 个月，其中最后 12 个月不超过 90 天。符合条件的 SCV 444 持有人与部分新西兰 189 签证持有人另有起算方式，试点不建模。官方 Residence Calculator（https://immi.homeaffairs.gov.au/help-support/tools/residence-calculator ）只作估算参考。

## SRC-068 入籍一般居住要求 SOP（FOI 公开）

- `policy-sources/2025-09-15-au-sop-general-residence-requirement-foi.pdf` → <https://www.homeaffairs.gov.au/foi/files/2025/fa-250801434-document-released.PDF>
- 内部操作程序经 FOI 公开，部分内容按 s. 47E(d) 删节，版本记录页未公开。`p<N>` 指 PDF 页序。
- `p5 §3.3`：出境须以此前曾在澳为前提，首次入境未满 4 年不能满足居住要求。`p6` 情景（Mr Barnaby）以 365 天作为"12 个月"的出境上限，两次出境分别记 296 天和 67 天，即入境日减出境日。同页正文称入境日与出境日都计为在澳，按此两次出境应为 295 天和 66 天，两者相差每次一天。引擎按正文计，并另列按示例算出的日期，见 PD-084。

## SRC-069 Migration Act 1958

- 快照取 legislation.gov.au 该版本 EPUB 的第 1 个正文文件，版本 Compilation No. 172（Compilation date 2026-10-08）。
- `s82(2)`：另一份实质签证（特殊目的签证除外）生效时，原实质签证终止；`s82(2AA)` 另有船员签证的例外。`s82(3)`：其他签证（特殊目的签证、船员签证除外）生效时，bridging visa 终止。引擎据此让每份签证在下一份（实质签证，或对 bridging visa 而言任何签证）生效前一天结束，同日生效的按录入顺序；问卷不收特殊目的签证、船员签证和 ETA。`s68(4)` 下部分 bridging visa 可恢复生效，试点不建模。
- `s82(5)`–`(6)`：带有效期旅行便利的签证，期满时不在澳，或期满后离境，即终止。引擎对旅行便利为 5 年的永久签证（100.511、186.511、189.511、190.511、191.511、801.511），按完整出入境记录判断：期满当天结束时不在澳（包括尚未入境）即在当天终止，否则在期满后第一次出境当天终止。

## SRC-070 Citizenship Act 1977（新西兰）

- `policy-sources/2026-06-06-nz-citizenship-act-1977-s8.html` → <https://www.legislation.govt.nz/act/public/1977/61/en/latest/>
- legislation.govt.nz 对脚本请求返回 AWS WAF 质询（HTTP 202、空正文），快照是在浏览器中打开现行版（Version as at 6 June 2026）后只保存的 s8 节选（元素 `DLM443855`）。每周核对对这条会报 changed 或 fetch failed，需在浏览器里人工核对版本日。
- `s8(1)(a)`：年满 16 岁。`s8(2)(a)`：申请时依 Immigration Act 2009 可无限期留在新西兰。`s8(2)(b)`：申请日前 5 年内在新西兰合计不少于 1,350 天（i），且其中每一年不少于 240 天（ii），只算可无限期留在新西兰的日子。`s8(3)`：居留附加条件未满足或未取消的，不算可无限期留下。`s8(5)`、`s8(7)`：Crown service 视同在境、特殊情况下 20 个月内 450 天，试点不建模。法条没有规定出入境当天怎么算，见 PD-086。

## SRC-071 Immigration Act 2009（新西兰）

- `policy-sources/2026-07-10-nz-immigration-act-2009-ss73-74.html` → <https://www.legislation.govt.nz/act/public/2009/51/en/latest/>
- 同 SRC-070，快照是浏览器中现行版（Version as at 10 July 2026）的 s73–s74 节选（元素 `DLM1440688`、`DLM1440689`），每周核对需人工处理。
- `s73`：永久居民签证持有人可随时前往新西兰、获准入境并无限期居留。`s74(1)`：居民签证持有人可前往新西兰并申请入境许可，获准入境后可按签证条件无限期居留；`s74(2)`：前往新西兰须符合签证的旅行条件。法条没有写旅行条件到期时人在境外，居民签证是否随之失效，见 PD-088。

## SRC-072 Immigration Instructions（新西兰移民局操作手册）

- 新西兰的 Immigration Instructions 相当于英国的 Immigration Rules，按段落号定位，如 `RV2.5.1`。各页底部的 `Effective` 日期即快照文件名中的日期。
- `RV2.5`：(a) 申请时持居民签证且已连续持有满 24 个月（或申请前 90 天内曾持有、到期前已连续持有满 24 个月）；(b) 首次以居民身份在新西兰之日（R5.66.1）在申请前至少 24 个月；(c) 以 RV2.5.1–RV2.5.20 任一方式表明对新西兰的承诺；(d) 满足 s49(1)、s50 条件；(e) 品格。`RV2.5.1`：申请前 24 个月的两个 12 个月里，各以居民身份在新西兰合计不少于 184 天。`RV2.5.5`：两个 12 个月里各不少于 41 天，且申请前 24 个月具有税务居民身份（RV1.15.10）。`RV2.5.10`–`RV2.5.20`（投资、经营、在新西兰安家）试点不建模。
- `RV2.10`：Migrant Investment、Parent Retirement、Active Investor Plus 类别的居民签证转永居，看是否已满足投资条件，不看在境天数。
- `RV1.15.5` 注：以居民身份在新西兰的期间，入境日与出境日都计入。
- `RV1.5`：居民签证持有人离开新西兰时签证已没有有效的旅行条件，或旅行条件在其身处境外时到期，居民签证即失效（法条依据为 Immigration Act s63(2)，试点未存档该条）。失效后可在 90 天内以前持有人身份申请永久居民签证（RV2.5(a)(ii)），或按 RV4 另行申请居民签证。`RV3.1` 另规定只有签证仍有效时才能变更旅行条件（试点未存档该页）。
- `R5.66.1`：境外获批的，首次入境须在获批后 1 年内（萨摩亚配额、太平洋准入类别为 3 个月，试点不建模）。`R5.66.5`：多次入境的旅行条件自首次以居民身份在新西兰之日起 2 年；父母类 10 年、宗教工作者 5 年、Active Investor Plus 的 Growth 类 4 年、Balanced 类 6 年。首次以居民身份在新西兰之日，是在新西兰境内获批的获批日，或境外获批后首次凭该签证获准入境之日。超出旅行条件再前往新西兰、又不符合永久居民签证的，可申请变更旅行条件（RV3）。旅行条件的最后一天按哪天算，见 PD-087。

## SRC-073 新西兰官方说明

- `policy-sources/2026-11-21-nz-religious-worker-resident-visa.html` → <https://www.immigration.govt.nz/visas/religious-worker-resident-visa/>
- `policy-sources/2024-07-18-nz-visa-pak-588-prv-periods.pdf` → <https://www.immigration.govt.nz/assets/inz/documents/visa-paks/visa-pak-588.pdf>
- `policy-sources/2021-12-15-nz-dia-oia-2122-0423-presence-calculator.pdf` → <https://www.dia.govt.nz/diawebsite.nsf/Files/OIA-releases/$file/OIA-2122-0423.pdf>
- govt.nz `What are the presence requirements?` 第 2 条：5 年从申请当天往回数；每个 12 个月不少于 240 天、5 年合计 1,350 天；任一 12 个月出境超过 4 个月、或 5 年内出境合计超过 15 个月，就可能不满足。第 1 条（"至少过去 5 年以新西兰居民身份生活"）是对 s8(2) 的概括，引擎按法条的天数计算；同条写明父母类居民签证的条件可能为 5 年或 10 年，须满足或取消后才能申请入籍。页面附有官方 Presence calculator（https://dia.services.govt.nz/presence-calculator/ ），它调取移民局出入境记录计算；页面本身没写计法，2021 年的计算器规格已依 OIA 公开（见下）。
- Visa Pak 588（PDF 2 页）：永久居民签证的 12 个月按 365 天、24 个月按 730 天计；两个 12 个月从递交日往回各数 365 天，不含递交当天（例：2024-05-19 递交，两段为 2023-05-20 至 2024-05-18、2022-05-20 至 2023-05-19）。同页示例：没有有效旅行条件时离境，居民签证于离境次日失效（法条写的是离境时；模拟日期没有时刻，引擎按示例取次日）。
- OIA 21/22-0423（PDF 12 页，内政部依信息公开申请发布的在境计算器规格）：p9–p10 示例中离境日与返回日都不计入在境外的天数（2015-05-01 离境、2015-06-20 返回记 49 天），5 年窗口取申请日之前、不含申请日（1,826 天），每一年按申请日往回划分；Step 4c 每一年须在境不少于 240 天。p8–p9 的五年合计示例有一处算术出入（1,826 − 124 应为 1,702，文中写 1,703），不影响计法。PD-086 据此确定。
- Religious Worker Resident Visa 页面（immigration.govt.nz 拒绝脚本请求，快照为浏览器中保存的节选）：`Staying longer → Getting a Permanent Resident Visa` 自成为居民起满 5 年可申请永久居民签证，并须先满足、取消 s49 条件；`While you are in New Zealand → Travel` 旅行条件 5 年，到期时人在境外签证随之失效。每周核对对该页会报 fetch failed。
