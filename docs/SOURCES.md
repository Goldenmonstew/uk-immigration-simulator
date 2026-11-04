# 来源登记表（Sources Register）

> 规则引擎里每条规则都必须引用本表中的一个 `SRC-` 编号 + 页码/段落。
> 状态：`archived` = 快照已入 `policy-sources/`；`todo` = 只有 URL 或线索，待抓取与登记；`verify` = 只有二手来源，待对照原文。
> 权威等级：LAW（Immigration Rules / Statement of Changes / legislation）> GUIDANCE（Home Office 指引）> POLICY（命令文件、咨询回应）> PARLIAMENT（Hansard）> SECONDARY（律所、媒体，只能用于交叉验证）。

## 一级来源

| ID | 等级 | 标题 | URL | 发布日 | 抓取日 | 本地快照 | 状态 |
|---|---|---|---|---|---|---|---|
| SRC-001 | POLICY | A Fairer Pathway to Settlement: Government Response to the Consultation (CP 1707, 60 页) | https://assets.publishing.service.gov.uk/media/6ae90b0e5b14ba0182a272a4/A_Fairer_Pathway_to_Settlement_-_Government_response_to_the_consultation.pdf | 2026-11-02 | 2026-11-04 | `policy-sources/2026-11-02-cp1707-a-fairer-pathway-to-settlement-government-response.pdf`（sha256 `f2ce80103dd331cce70a1e2043ba58d4f791b9650ce1a3ed17a219f7d5f3253c`） | archived |
| SRC-002 | PARLIAMENT | 内政大臣下议院陈述（2026-11-02）：首批规则 2026-12 提交、2027 年实施 | 待登记（Hansard） | 2026-11-02 | — | — | todo |
| SRC-003 | PARLIAMENT | 上议院陈述（2026-11-02）：首批规则预计 2027-01 生效 | 待登记（Hansard） | 2026-11-02 | — | — | todo |
| SRC-004 | LAW | Immigration Rules: Appendix Skilled Worker（现行版本，含 £41,700 一般门槛与 going rate） | https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-worker | — | — | — | todo（登记时记录 Rules 的版本日期） |
| SRC-005 | LAW | Immigration Rules: Appendix Long Residence | https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-long-residence | — | — | — | todo |
| SRC-006 | GUIDANCE | Public funds: immigration guidance（SRC-001 p17 注 6 指向此页） | https://www.gov.uk/government/publications/public-funds--2/public-funds | — | — | — | todo |
| SRC-007 | LAW | Statement of Changes HC 1691（2026-03-05 提交；二手来源称 2027-03-26 起 settlement 需 B2） | 待登记 | 2026-03-05 | — | — | verify |
| SRC-008 | LAW | Appendix Continuous Residence / Appendix Settlement Family Life / Appendix Global Talent / Scale-up / Innovator Founder / UK Ancestry / Graduate / Student | gov.uk Immigration Rules 各 Appendix | — | — | — | todo（MVP-0 只需 Skilled Worker + Continuous Residence） |
| SRC-009 | GUIDANCE | IAA（Immigration Advice Authority）：什么是受监管的 immigration advice | 待登记 | — | — | — | todo |
| SRC-010 | REFERENCE | GOV.UK Content API 文档（public_updated_at / content_id；beta；~10 req/s） | https://content-api.publishing.service.gov.uk/ | — | — | — | todo（第二阶段才用） |
| SRC-011 | REFERENCE | legislation.gov.uk 新立法 Atom feeds | https://www.legislation.gov.uk/new/data.feed | — | — | — | todo（第二阶段才用） |
| SRC-012 | POLICY | Immigration White Paper（2025-05；过渡安排的截止点） | https://www.gov.uk/government/publications/restoring-control-over-the-immigration-system-white-paper | 2025-05-12 | — | — | todo |
| SRC-013 | POLICY | Earned Settlement 咨询文件（2025-11-20；15 年路径等已被 SRC-001 取代，仅作历史对照） | https://www.gov.uk/government/consultations/earned-settlement | 2025-11-20 | — | — | todo |

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
