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
