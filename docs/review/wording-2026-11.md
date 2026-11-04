# 面向用户文案中英对照（2026-11）

由 `pnpm --filter @uk-immigration/engine export:wording` 生成（`packages/engine/test/export-wording.test.ts`），请勿手改。

收集范围：`test/helpers.ts` 的 17 个样例上下文（每条规则单独跑一遍 + 整体评估）与 25 个 fixtures，各按 zh-CN 与 en 运行一次；按规则 ID 分节，句子去重，按首次出现排序。样例跑不到的分支不在其中。

## earned-settlement-2026-11

### ES-CRIMINALITY：无犯罪记录 / No criminal record

来源：SRC-001 p12

待定细节：PD-017

- 中：未申报犯罪记录。
  - EN: No criminal record declared.
- 中：申报了 1 条犯罪记录，其中有成年后的记录。Earned Settlement 下成年申请人在英国有任何犯罪记录（含判刑、罚款、社区刑、部分庭外处置）即拒绝定居；海外定罪也可能导致拒绝。需由受监管顾问判断。
  - EN: 1 criminal record(s) declared, including at least one as an adult. Under Earned Settlement any criminal record of an adult applicant in the UK (including sentences, fines, community sentences and some out-of-court disposals) leads to refusal of settlement; overseas convictions may also lead to refusal. This needs a regulated adviser’s assessment.

### ES-DEBT：无未清偿的政府债务 / No outstanding government debt

来源：SRC-001 p12；SRC-001 p29

待定细节：PD-018

- 中：申报无未清偿的政府债务。
  - EN: No outstanding government debt declared.
- 中："无政府债务"按用户申报判断；正在按还款计划偿还的非 asylum support 债务是否满足要求，原文未说明（PD-018）。
  - EN: “No government debt” is based on what the user declared; the response does not say whether debt other than asylum support debt that is being repaid under a repayment plan meets the requirement (PD-018).
- 中：未填写是否有欠政府的债务（NHS 债务、税款与 National Insurance 欠款、欠 Home Office 的诉讼费用等）。
  - EN: Government debt not provided (NHS debt, unpaid tax and National Insurance, litigation costs owed to the Home Office and similar).
- 中：有未清偿的政府债务。Earned Settlement 把无政府债务定为强制要求，不满足即不能定居，不能用收入或其他贡献抵消。
  - EN: Outstanding government debt declared. Earned Settlement makes having no government debt a mandatory requirement: without it settlement is not possible, and it cannot be offset by earnings or other contributions.
- 中：申请日未满 18 岁的 child dependant 豁免政府债务要求。
  - EN: A child dependant under 18 on the date of application is exempt from the government debt requirement.

### ES-ENGLISH-B2：定居英语要求（B2；UKRS 难民 A2） / English for settlement (B2; A2 for UK Resettlement Scheme refugees)

来源：SRC-001 p21

待定细节：PD-019、PD-045

- 中：英语 B2，达到 B2。
  - EN: English at B2, which meets B2.
- 中：未填写英语水平。Earned Settlement 要求 CEFR B2（现有豁免保留）。
  - EN: English level not provided. Earned Settlement requires CEFR B2 (existing exemptions are retained).
- 中：英语 B1，低于 Earned Settlement 要求的 B2。这是强制要求，不能用收入或其他贡献抵消。
  - EN: English at B1, below the B2 required by Earned Settlement. This is a mandatory requirement and cannot be offset by earnings or other contributions.
- 中：2023-01-01 经 UK Resettlement Scheme 抵达，属 Legacy Safe and Legal Routes。框架外群体一般须达 B2，第 7 章又说 UK Resettlement Scheme 难民只需 A2，原文不一致。
  - EN: Arrived through the UK Resettlement Scheme on 2023-01-01, so on the Legacy Safe and Legal Routes. Groups outside the framework generally need B2, while Chapter 7 says UK Resettlement Scheme refugees need A2 only; the response is inconsistent.
- 中：申请日未满 18 岁或已满 65 岁，豁免英语要求。
  - EN: Under 18 or aged 65 or over on the date of application: exempt from the English requirement.
- 中：英语 A2，达到 A2。经 UK Resettlement Scheme 入境的难民只需 A2（p37、p39）。
  - EN: English at A2, which meets A2. Refugees admitted through the UK Resettlement Scheme need A2 only (p37, p39).

### ES-KOL：通过 Life in the UK 考试 / Pass the Life in the UK test

来源：SRC-001 p21

待定细节：PD-020、PD-021

- 中：已通过 Life in the UK 考试。
  - EN: Passed the Life in the UK test.
- 中：未填写是否已通过 Life in the UK 考试。
  - EN: Not provided whether the Life in the UK test has been passed.
- 中：申请日未满 18 岁或已满 65 岁，豁免 Life in the UK 考试。
  - EN: Under 18 or aged 65 or over on the date of application: exempt from the Life in the UK test.
- 中：经 UK Resettlement Scheme 入境的难民在出现适合 A2 水平的考试版本前，暂免 Life in the UK 考试（p21 注 8、p39）。
  - EN: Refugees admitted through the UK Resettlement Scheme are exempt from the Life in the UK test until a version suitable for A2 English is available (p21 note 8, p39).
- 中：A2 版 Life in the UK 考试推出后，这一豁免可能改变；推出时间未公布（PD-021）。
  - EN: This exemption may change once an A2 version of the Life in the UK test is available; no date has been given (PD-021).

### ES-ROUTE-GROUP：当前路线计入定居 / Current route counts towards settlement

来源：SRC-001 p23；SRC-001 p24；SRC-001 p25；SRC-001 p26

待定细节：PD-022、PD-023、PD-045

- 中：当前路线"技术工作者"属核心许可 / 高技能人才分组，计入定居。
  - EN: The current route, Skilled Worker, is in the Core permission / High talent groups and counts towards settlement.
- 中：当前路线"核心保护"属保护类分组，计入定居，按难民定居路径（Table 2）计算；保护类时间不能与工作、家庭路线的时间合并（p25）。
  - EN: The current route, Core Protection, is in the Protection group and counts towards settlement under the refugee pathways (Table 2); time on protection routes cannot be combined with time on work or family routes (p25).
- 中：当前路线"保护工作与学习"属保护类分组，计入定居，按难民定居路径（Table 2）计算；保护类时间不能与工作、家庭路线的时间合并（p25）。
  - EN: The current route, Protection Work and Study, is in the Protection group and counts towards settlement under the refugee pathways (Table 2); time on protection routes cannot be combined with time on work or family routes (p25).
- 中：当前路线"安全合法保护路线"属保护类分组，计入定居，按难民定居路径（Table 2）计算；保护类时间不能与工作、家庭路线的时间合并（p25）。
  - EN: The current route, Safe and Legal, is in the Protection group and counts towards settlement under the refugee pathways (Table 2); time on protection routes cannot be combined with time on work or family routes (p25).
- 中：经 UK Resettlement Scheme 于 2023-01-01 抵达，早于 2027-04-06，属 Legacy Safe and Legal Routes（p26 注 13）：不在 Earned Settlement 框架内，继续按现有安排 5 年定居；但强化的犯罪记录与英语要求仍适用，除非有现有豁免或保障。
  - EN: Arrived through the UK Resettlement Scheme on 2023-01-01, before 2027-04-06, so on the Legacy Safe and Legal Routes (p26 note 13): outside the Earned Settlement framework, keeping settlement after five years under the existing arrangements. The strengthened criminality and English requirements still apply, unless an existing exemption or protection applies.
- 中：2027-04-06 前抵达的 UK Resettlement Scheme 难民须达 B2 还是 A2 英语，原文前后不一（PD-045）。
  - EN: Whether UK Resettlement Scheme refugees who arrived before 2027-04-06 need English at B2 or A2 is inconsistent in the response (PD-045).
- 中：当前路线"香港英国国民（海外）"不在 Earned Settlement 框架内，继续按该群体现有的定居安排；但强化的犯罪记录与 B2 英语要求仍适用，除非有现有豁免或保障。
  - EN: The current route, Hong Kong BN(O), is outside the Earned Settlement framework and keeps the existing settlement arrangements for that group. The strengthened criminality and B2 English requirements still apply, unless an existing exemption or protection applies.
- 中：当前路线"全球人才"属核心许可 / 高技能人才分组，计入定居。
  - EN: The current route, Global Talent, is in the Core permission / High talent groups and counts towards settlement.
- 中：当前路线"家庭伴侣或父母"属核心许可 / 英国联系分组，计入定居。
  - EN: The current route, Family Partner or Parent, is in the Core permission / British connection groups and counts towards settlement.
- 中：当前路线"学生"是临时路线，不计入定居；转入计入的路线后才开始累计。
  - EN: The current route, Student, is a temporary route and does not count towards settlement; time starts to count only after switching to a counting route.
- 中：当前路线"家庭与私人生活"属家庭与私人生活分组，计入定居。家庭与私人生活路线只能走 10 年或 20 年路径。
  - EN: The current route, Family and Private Life, is in the Family and Private Life group and counts towards settlement. Family and Private Life routes can only use the 10 or 20-year pathways.
- 中：当前路线"英国血统"属核心许可 / 英国联系分组，计入定居。
  - EN: The current route, UK Ancestry, is in the Core permission / British connection groups and counts towards settlement.
- 中：当前路线"创新创始人"属核心许可 / 高技能人才分组，计入定居。
  - EN: The current route, Innovator Founder, is in the Core permission / High talent groups and counts towards settlement.

### ES-RESIDENCE：计入定居的连续居留 / Continuous residence counting towards settlement

来源：SRC-001 p22；SRC-001 p23；SRC-001 p24；SRC-001 p25；SRC-008 CR 3.1

待定细节：PD-022、PD-023、PD-025、PD-053、PD-054、PD-064

- 中：计入定居的连续居留自 2019-11-01 起，截至 2026-11-04 满 7 年。
  - EN: Continuous residence counting towards settlement since 2019-11-01: 7 full years by 2026-11-04.
- 中：计入定居的连续居留自 2022-01-01 起，截至 2026-11-04 满 4 年。有缺席在任意 12 个月内超过 180 天，连续居留中断，自 2022-01-01 重新起算。
  - EN: Continuous residence counting towards settlement since 2022-01-01: 4 full years by 2026-11-04. Absences exceed 180 days in a 12-month period, so continuous residence is broken and restarts from 2022-01-01.
- 中：Earned Settlement 的缺席口径未公布，假设沿用现行 Appendix Continuous Residence CR 3.1（任意 12 个月不超过 180 天，出境与入境当日都计入缺席）（PD-054）。
  - EN: How absences count under Earned Settlement has not been published; assumed to follow the current Appendix Continuous Residence CR 3.1 (no more than 180 days in any 12-month period, with the days of departure and return both counted as absence) (PD-054).
- 中：计入定居的连续居留自 2024-01-01 起，截至 2026-11-04 满 2 年。
  - EN: Continuous residence counting towards settlement since 2024-01-01: 2 full years by 2026-11-04.
- 中：计入定居的连续居留自 2024-01-01 起，截至 2026-11-04 满 2 年。20 年路径的居留还不够，2044-01-01 满 20 年。
  - EN: Continuous residence counting towards settlement since 2024-01-01: 2 full years by 2026-11-04. Not enough residence yet for the 20-year pathway; 20 years are completed on 2044-01-01.
- 中：计入定居的连续居留自 2022-01-01 起，截至 2026-11-04 满 4 年。此前在"核心保护"路线的时间不计入当前保护类路线的合格期，自 2022-01-01 转入起重新起算（p38；p40 Individual B）。
  - EN: Continuous residence counting towards settlement since 2022-01-01: 4 full years by 2026-11-04. Earlier time on Core Protection does not count towards the qualifying period of the current protection route; the count restarts from the move on 2022-01-01 (p38; p40 Individual B).
- 中：计入定居的连续居留自 2024-01-01 起，截至 2026-11-04 满 2 年。10 年路径的居留还不够，2034-01-01 满 10 年。
  - EN: Continuous residence counting towards settlement since 2024-01-01: 2 full years by 2026-11-04. Not enough residence yet for the 10-year pathway; 10 years are completed on 2034-01-01.
- 中：自 2025-01-01 起从 Protection Work and Study 回到 Core Protection。原文只说 Core Protection 的时间不计入 Protection Work and Study，没有说回到 Core Protection 后此前的时间如何计入。
  - EN: Back on Core Protection from Protection Work and Study since 2025-01-01. The response only says that time on Core Protection does not count towards Protection Work and Study; it does not say how earlier time counts after moving back to Core Protection.
- 中：自 2025-01-01 起从 Protection Work and Study 回到 Core Protection。原文只说 Core Protection 的时间不计入 Protection Work and Study，没有说回到 Core Protection 后此前的时间如何计入。20 年路径的居留还不够，2045-01-01 满 20 年。
  - EN: Back on Core Protection from Protection Work and Study since 2025-01-01. The response only says that time on Core Protection does not count towards Protection Work and Study; it does not say how earlier time counts after moving back to Core Protection. Not enough residence yet for the 20-year pathway; 20 years are completed on 2045-01-01.
- 中：计入定居的连续居留自 2023-01-01 起，截至 2026-11-04 满 3 年。
  - EN: Continuous residence counting towards settlement since 2023-01-01: 3 full years by 2026-11-04.
- 中：计入定居的连续居留自 2023-01-01 起，截至 2026-11-04 满 3 年。5 年路径的居留还不够，2028-01-01 满 5 年。
  - EN: Continuous residence counting towards settlement since 2023-01-01: 3 full years by 2026-11-04. Not enough residence yet for the 5-year pathway; 5 years are completed on 2028-01-01.
- 中：当前路线"原有安全合法路线"不在 Earned Settlement 框架内，不按本框架计算居留。
  - EN: The current route, Legacy Safe and Legal, is outside the Earned Settlement framework, so residence is not calculated under it.
- 中：当前路线"香港英国国民（海外）"不在 Earned Settlement 框架内，不按本框架计算居留。
  - EN: The current route, Hong Kong BN(O), is outside the Earned Settlement framework, so residence is not calculated under it.
- 中：计入定居的连续居留自 2019-01-01 起，截至 2026-11-04 满 7 年。
  - EN: Continuous residence counting towards settlement since 2019-01-01: 7 full years by 2026-11-04.
- 中：计入定居的连续居留自 2024-06-01 起，截至 2026-11-04 满 2 年。
  - EN: Continuous residence counting towards settlement since 2024-06-01: 2 full years by 2026-11-04.
- 中：计入定居的连续居留自 2024-06-01 起，截至 2026-11-04 满 2 年。3 年路径的居留还不够，2027-06-01 满 3 年。
  - EN: Continuous residence counting towards settlement since 2024-06-01: 2 full years by 2026-11-04. Not enough residence yet for the 3-year pathway; 3 years are completed on 2027-06-01.
- 中：当前路线"学生"不计入定居，计入的居留为 0。
  - EN: The current route, Student, does not count towards settlement, so the counting residence is 0.
- 中：计入定居的连续居留自 2016-09-01 起，截至 2026-11-04 满 10 年。
  - EN: Continuous residence counting towards settlement since 2016-09-01: 10 full years by 2026-11-04.
- 中：计入定居的连续居留自 2015-06-01 起，截至 2026-11-04 满 11 年。20 年路径的居留还不够，2035-06-01 满 20 年。
  - EN: Continuous residence counting towards settlement since 2015-06-01: 11 full years by 2026-11-04. Not enough residence yet for the 20-year pathway; 20 years are completed on 2035-06-01.
- 中：计入定居的连续居留自 2016-04-06 起，截至 2026-04-06 满 10 年。
  - EN: Continuous residence counting towards settlement since 2016-04-06: 10 full years by 2026-04-06.
- 中：计入定居的连续居留自 2021-04-06 起，截至 2026-11-04 满 5 年。
  - EN: Continuous residence counting towards settlement since 2021-04-06: 5 full years by 2026-11-04.
- 中：计入定居的连续居留自 2021-04-06 起，截至 2026-04-06 满 5 年。
  - EN: Continuous residence counting towards settlement since 2021-04-06: 5 full years by 2026-04-06.
- 中：计入定居的连续居留自 2023-04-06 起，截至 2026-04-06 满 3 年。
  - EN: Continuous residence counting towards settlement since 2023-04-06: 3 full years by 2026-04-06.
- 中：计入定居的连续居留自 2027-06-01 起，截至 2032-06-01 满 5 年。
  - EN: Continuous residence counting towards settlement since 2027-06-01: 5 full years by 2032-06-01.
- 中：计入定居的连续居留自 2028-03-01 起，截至 2030-01-01 满 1 年。此前在"核心保护"路线的时间不计入当前保护类路线的合格期，自 2028-03-01 转入起重新起算（p38；p40 Individual B）。10 年路径的居留还不够，2038-03-01 满 10 年。
  - EN: Continuous residence counting towards settlement since 2028-03-01: 1 full year by 2030-01-01. Earlier time on Core Protection does not count towards the qualifying period of the current protection route; the count restarts from the move on 2028-03-01 (p38; p40 Individual B). Not enough residence yet for the 10-year pathway; 10 years are completed on 2038-03-01.
- 中：计入定居的连续居留自 2028-03-01 起，截至 2030-01-01 满 1 年。此前在"核心保护"路线的时间不计入当前保护类路线的合格期，自 2028-03-01 转入起重新起算（p38；p40 Individual B）。20 年路径的居留还不够，2048-03-01 满 20 年。
  - EN: Continuous residence counting towards settlement since 2028-03-01: 1 full year by 2030-01-01. Earlier time on Core Protection does not count towards the qualifying period of the current protection route; the count restarts from the move on 2028-03-01 (p38; p40 Individual B). Not enough residence yet for the 20-year pathway; 20 years are completed on 2048-03-01.
- 中：计入定居的连续居留自 2027-03-01 起，截至 2030-01-01 满 2 年。30 年路径的居留还不够，2057-03-01 满 30 年。
  - EN: Continuous residence counting towards settlement since 2027-03-01: 2 full years by 2030-01-01. Not enough residence yet for the 30-year pathway; 30 years are completed on 2057-03-01.
- 中：计入定居的连续居留自 2023-04-06 起，截至 2028-04-06 满 5 年。
  - EN: Continuous residence counting towards settlement since 2023-04-06: 5 full years by 2028-04-06.
- 中：计入定居的连续居留自 2023-04-06 起，截至 2028-04-06 满 5 年。10 年路径的居留还不够，2033-04-06 满 10 年。
  - EN: Continuous residence counting towards settlement since 2023-04-06: 5 full years by 2028-04-06. Not enough residence yet for the 10-year pathway; 10 years are completed on 2033-04-06.
- 中：计入定居的连续居留自 2025-06-06 起，截至 2035-06-06 满 10 年。此前在"毕业生"路线的时间不计入定居；本工具假设不计入路线的时间同时打断连续居留，而不只是从合格期中扣除（PD-053）。
  - EN: Continuous residence counting towards settlement since 2025-06-06: 10 full years by 2035-06-06. The earlier time on Graduate does not count towards settlement; this tool assumes that time on a non-counting route also breaks continuous residence, rather than only being deducted from the qualifying period (PD-053).
- 中：此前在"毕业生"路线的时间不计入定居；本工具假设不计入路线的时间同时打断连续居留，而不只是从合格期中扣除（PD-053）。
  - EN: The earlier time on Graduate does not count towards settlement; this tool assumes that time on a non-counting route also breaks continuous residence, rather than only being deducted from the qualifying period (PD-053).
- 中：计入定居的连续居留自 2023-11-04 起，截至 2026-11-04 满 3 年。
  - EN: Continuous residence counting towards settlement since 2023-11-04: 3 full years by 2026-11-04.
- 中：计入定居的连续居留自 2021-03-01 起，截至 2026-03-01 满 5 年。
  - EN: Continuous residence counting towards settlement since 2021-03-01: 5 full years by 2026-03-01.
- 中：计入定居的连续居留自 2021-03-01 起，截至 2026-03-01 满 5 年。20 年路径的居留还不够，2041-03-01 满 20 年。
  - EN: Continuous residence counting towards settlement since 2021-03-01: 5 full years by 2026-03-01. Not enough residence yet for the 20-year pathway; 20 years are completed on 2041-03-01.
- 中：计入定居的连续居留自 2021-09-01 起，截至 2026-09-01 满 5 年。
  - EN: Continuous residence counting towards settlement since 2021-09-01: 5 full years by 2026-09-01.
- 中：计入定居的连续居留自 2023-05-01 起，截至 2026-05-01 满 3 年。
  - EN: Continuous residence counting towards settlement since 2023-05-01: 3 full years by 2026-05-01.
- 中：计入定居的连续居留自 2021-07-01 起，截至 2026-07-01 满 5 年。
  - EN: Continuous residence counting towards settlement since 2021-07-01: 5 full years by 2026-07-01.

### ES-EARNINGS-3Y：3 年路径收入：4 年中 3 年达到 £125,141 / 3-year pathway earnings: £125,141 in 3 of 4 years

来源：SRC-001 p15；SRC-001 p16；SRC-001 p46

待定细节：PD-005、PD-006、PD-007、PD-008、PD-011

- 中：2022-23 至 2025-26 这 4 个 tax year 中，有 0 年收入达到 £125,141，需要 3 年。
  - EN: Earnings reached £125,141 in 0 of the 4 tax years 2022-23 to 2025-26; 3 needed.
- 中：收入按英国 tax year 的税前收入计算，窗口为申请日所在 tax year 之前的完整 tax year；各年份统一按现行门槛比较（PD-005 / PD-006 / PD-007）。
  - EN: Earnings are gross earnings per UK tax year; the window is the complete tax years before the tax year of the application date, and every year is compared with the current thresholds (PD-005 / PD-006 / PD-007).
- 中：2022-23 至 2025-26 这 4 个 tax year 中，有 0 年收入达到 £125,141，需要 3 年；4 年未填写收入。
  - EN: Earnings reached £125,141 in 0 of the 4 tax years 2022-23 to 2025-26; 3 needed; earnings not provided for 4 year(s).
- 中：2022-23 至 2025-26 这 4 个 tax year 中，有 0 年收入达到 £125,141，需要 3 年；3 年未填写收入。
  - EN: Earnings reached £125,141 in 0 of the 4 tax years 2022-23 to 2025-26; 3 needed; earnings not provided for 3 year(s).
- 中：2024-25 至 2027-28 这 4 个 tax year 中，有 0 年收入达到 £125,141，需要 3 年。
  - EN: Earnings reached £125,141 in 0 of the 4 tax years 2024-25 to 2027-28; 3 needed.
- 中：2031-32 至 2034-35 这 4 个 tax year 中，有 0 年收入达到 £125,141，需要 3 年。
  - EN: Earnings reached £125,141 in 0 of the 4 tax years 2031-32 to 2034-35; 3 needed.
- 中：2021-22 至 2024-25 这 4 个 tax year 中，有 0 年收入达到 £125,141，需要 3 年；4 年未填写收入。
  - EN: Earnings reached £125,141 in 0 of the 4 tax years 2021-22 to 2024-25; 3 needed; earnings not provided for 4 year(s).
- 中：2022-23 至 2025-26 这 4 个 tax year 中，有 0 年收入达到 £125,141，需要 3 年；1 年未填写收入。
  - EN: Earnings reached £125,141 in 0 of the 4 tax years 2022-23 to 2025-26; 3 needed; earnings not provided for 1 year(s).
- 中：2021-22 至 2024-25 这 4 个 tax year 中，有 0 年收入达到 £125,141，需要 3 年；3 年未填写收入。
  - EN: Earnings reached £125,141 in 0 of the 4 tax years 2021-22 to 2024-25; 3 needed; earnings not provided for 3 year(s).

### ES-EARNINGS-5Y：5 年路径收入：5 年中 3 年达到 £50,271 / 5-year pathway earnings: £50,271 in 3 of 5 years

来源：SRC-001 p15；SRC-001 p16；SRC-001 p46

待定细节：PD-005、PD-006、PD-007、PD-008

- 中：2021-22 至 2025-26 这 5 个 tax year 中，有 5 年收入达到 £50,271，需要 3 年。
  - EN: Earnings reached £50,271 in 5 of the 5 tax years 2021-22 to 2025-26; 3 needed.
- 中：收入按英国 tax year 的税前收入计算，窗口为申请日所在 tax year 之前的完整 tax year；各年份统一按现行门槛比较（PD-005 / PD-006 / PD-007）。
  - EN: Earnings are gross earnings per UK tax year; the window is the complete tax years before the tax year of the application date, and every year is compared with the current thresholds (PD-005 / PD-006 / PD-007).
- 中：2021-22 至 2025-26 这 5 个 tax year 中，有 0 年收入达到 £50,271，需要 3 年；5 年未填写收入。
  - EN: Earnings reached £50,271 in 0 of the 5 tax years 2021-22 to 2025-26; 3 needed; earnings not provided for 5 year(s).
- 中：2021-22 至 2025-26 这 5 个 tax year 中，有 0 年收入达到 £50,271，需要 3 年；4 年未填写收入。
  - EN: Earnings reached £50,271 in 0 of the 5 tax years 2021-22 to 2025-26; 3 needed; earnings not provided for 4 year(s).
- 中：2021-22 至 2025-26 这 5 个 tax year 中，有 0 年收入达到 £50,271，需要 3 年。
  - EN: Earnings reached £50,271 in 0 of the 5 tax years 2021-22 to 2025-26; 3 needed.
- 中：2023-24 至 2027-28 这 5 个 tax year 中，有 0 年收入达到 £50,271，需要 3 年。
  - EN: Earnings reached £50,271 in 0 of the 5 tax years 2023-24 to 2027-28; 3 needed.
- 中：2030-31 至 2034-35 这 5 个 tax year 中，有 0 年收入达到 £50,271，需要 3 年。
  - EN: Earnings reached £50,271 in 0 of the 5 tax years 2030-31 to 2034-35; 3 needed.
- 中：2020-21 至 2024-25 这 5 个 tax year 中，有 0 年收入达到 £50,271，需要 3 年；5 年未填写收入。
  - EN: Earnings reached £50,271 in 0 of the 5 tax years 2020-21 to 2024-25; 3 needed; earnings not provided for 5 year(s).
- 中：2021-22 至 2025-26 这 5 个 tax year 中，有 3 年收入达到 £50,271，需要 3 年；2 年未填写收入。
  - EN: Earnings reached £50,271 in 3 of the 5 tax years 2021-22 to 2025-26; 3 needed; earnings not provided for 2 year(s).
- 中：2020-21 至 2024-25 这 5 个 tax year 中，有 0 年收入达到 £50,271，需要 3 年；4 年未填写收入。
  - EN: Earnings reached £50,271 in 0 of the 5 tax years 2020-21 to 2024-25; 3 needed; earnings not provided for 4 year(s).

### ES-EARNINGS-10Y：最低收入：7 年中 5 年达到 £12,571（或家庭合计 £25,142） / Minimum earnings: £12,571 in 5 of 7 years (or £25,142 combined household earnings)

来源：SRC-001 p15；SRC-001 p16；SRC-001 p46；SRC-001 p17；SRC-001 p30

待定细节：PD-005、PD-006、PD-007、PD-008、PD-009、PD-010、PD-041、PD-042、PD-059

- 中：2019-20 至 2025-26 这 7 个 tax year 中，有 7 年收入达到 £12,571，需要 5 年。
  - EN: Earnings reached £12,571 in 7 of the 7 tax years 2019-20 to 2025-26; 5 needed.
- 中：收入按英国 tax year 的税前收入计算，窗口为申请日所在 tax year 之前的完整 tax year；各年份统一按现行门槛比较（PD-005 / PD-006 / PD-007）。
  - EN: Earnings are gross earnings per UK tax year; the window is the complete tax years before the tax year of the application date, and every year is compared with the current thresholds (PD-005 / PD-006 / PD-007).
- 中：最低收入按 p16 与 Table 1 的"申请前 7 年中 5 年"计算；p15 另有"至少 3 年"的说法（PD-041）。
  - EN: Minimum earnings are calculated as “5 of the 7 years before applying”, as in p16 and Table 1; p15 also says “at least 3 years” (PD-041).
- 中：2019-20 至 2025-26 这 7 个 tax year 中，有 0 年收入达到 £12,571，需要 5 年；7 年未填写收入。
  - EN: Earnings reached £12,571 in 0 of the 7 tax years 2019-20 to 2025-26; 5 needed; earnings not provided for 7 year(s).
- 中：2019-20 至 2025-26 这 7 个 tax year 中，有 0 年收入达到 £12,571，需要 5 年；6 年未填写收入。
  - EN: Earnings reached £12,571 in 0 of the 7 tax years 2019-20 to 2025-26; 5 needed; earnings not provided for 6 year(s).
- 中：2019-20 至 2025-26 这 7 个 tax year 中，有 1 年收入达到 £12,571，需要 5 年；6 年未填写收入。
  - EN: Earnings reached £12,571 in 1 of the 7 tax years 2019-20 to 2025-26; 5 needed; earnings not provided for 6 year(s).
- 中：2019-20 至 2025-26 这 7 个 tax year 中，有 7 年收入达到 £12,571（其中 7 年靠与伴侣合计达到 £25,142），需要 5 年。
  - EN: Earnings reached £12,571 in 7 of the 7 tax years 2019-20 to 2025-26 (7 of them through combined household earnings of £25,142); 5 needed.
- 中：家庭合计收入假设申请人与伴侣是 eligible couple（genuine and subsisting 关系），且伴侣没有反过来依赖申请人的收入（p17；PD-010）。
  - EN: Combined household earnings assume the applicant and partner are an eligible couple (a genuine and subsisting relationship) and the partner does not in turn rely on the applicant’s earnings (p17; PD-010).
- 中：2019-20 至 2025-26 这 7 个 tax year 中，有 5 年收入达到 £12,571，需要 5 年。
  - EN: Earnings reached £12,571 in 5 of the 7 tax years 2019-20 to 2025-26; 5 needed.
- 中：2019-20 至 2025-26 这 7 个 tax year 中，有 5 年收入达到 £12,571，需要 5 年；2 年未填写收入。
  - EN: Earnings reached £12,571 in 5 of the 7 tax years 2019-20 to 2025-26; 5 needed; earnings not provided for 2 year(s).
- 中：2019-20 至 2025-26 这 7 个 tax year 中，有 3 年收入达到 £12,571，需要 5 年；4 年未填写收入。
  - EN: Earnings reached £12,571 in 3 of the 7 tax years 2019-20 to 2025-26; 5 needed; earnings not provided for 4 year(s).
- 中：申请日未满 18 岁或已满 65 岁，豁免最低收入要求。
  - EN: Under 18 or aged 65 or over on the date of application: exempt from the minimum earnings requirement.
- 中：保留 child-dependant 身份的成年子女随家庭定居，不需满足个人收入要求。
  - EN: An adult child retaining child-dependant status settles with the family and does not need to meet the individual earnings requirement.
- 中：当前以父母的 dependant 身份持证，即视为"保留 child-dependant 身份"（retain child-dependant status）；原文未说明认定标准（PD-059）。
  - EN: Current permission as a parent’s dependant is treated as retaining child-dependant status; the response does not say how this is determined (PD-059).
- 中：2021-22 至 2027-28 这 7 个 tax year 中，有 5 年收入达到 £12,571，需要 5 年；2 年未填写收入。
  - EN: Earnings reached £12,571 in 5 of the 7 tax years 2021-22 to 2027-28; 5 needed; earnings not provided for 2 year(s).
- 中：2028-29 至 2034-35 这 7 个 tax year 中，有 7 年收入达到 £12,571，需要 5 年。
  - EN: Earnings reached £12,571 in 7 of the 7 tax years 2028-29 to 2034-35; 5 needed.
- 中：2018-19 至 2024-25 这 7 个 tax year 中，有 0 年收入达到 £12,571，需要 5 年；7 年未填写收入。
  - EN: Earnings reached £12,571 in 0 of the 7 tax years 2018-19 to 2024-25; 5 needed; earnings not provided for 7 year(s).
- 中：2018-19 至 2024-25 这 7 个 tax year 中，有 1 年收入达到 £12,571，需要 5 年；6 年未填写收入。
  - EN: Earnings reached £12,571 in 1 of the 7 tax years 2018-19 to 2024-25; 5 needed; earnings not provided for 6 year(s).

### ES-BRITISH-CONNECTION：British connection（5 年路径） / British connection (5-year pathway)

来源：SRC-001 p18

待定细节：无

- 中：不属于 British citizen 家属路线或 UK Ancestry，不走这条 5 年路径。
  - EN: Not on a British citizen family route or UK Ancestry, so this 5-year pathway does not apply.
- 中：以 British citizen 的伴侣、父母或子女身份持家庭签证，属 recognised British connection，可走 5 年路径。
  - EN: Holds a family visa as the partner, parent or child of a British citizen, a recognised British connection: the 5-year pathway is available.
- 中：持 UK Ancestry 签证，属 recognised British connection，可走 5 年路径。
  - EN: Holds a UK Ancestry visa, a recognised British connection: the 5-year pathway is available.

### ES-PUBLIC-FUNDS：申请前 5 年未使用 public funds / No public funds in the 5 years before applying

来源：SRC-001 p18；SRC-006 #benefits-open-to-new-claims；SRC-006 #contributory-benefits-and-statutory-payments

待定细节：PD-013、PD-014、PD-031、PD-047、PD-066

- 中：申请前 5 年内未领取 public funds。
  - EN: No public funds received in the 5 years before applying.
- 中：2021-11-04 以来领取过 Universal Credit，属 public funds。3 / 5 / 10 年路径要求申请前 5 年未使用 specified public funds，否则须在 qualifying route 上满 20 年。若此后不再使用，自 2028-07-01 起回看期内不再有 public funds，可按较短路径重新评估。
  - EN: Public funds received since 2021-11-04: Universal Credit. The 3 / 5 / 10-year pathways require no use of specified public funds in the 5 years before applying; otherwise 20 years on a qualifying route are needed. If they are not used again, the lookback contains no public funds from 2028-07-01, and the shorter pathways can be reassessed.
- 中：specified public funds 先按现行 public funds 定义（SRC-006）判断；政府将另定纳入范围与弱势群体的保障或豁免（PD-013）。
  - EN: Specified public funds are judged by the current public funds definition (SRC-006) for now; the government will set the scope, and protections or exemptions for vulnerable groups, separately (PD-013).
- 中：只计申请人本人领取的福利；伴侣或子女领取是否影响申请人，原文未说明（PD-014）。
  - EN: Only benefits received by the applicant are counted; the response does not say whether benefits received by a partner or child affect the applicant (PD-014).
- 中：回看期按正文"申请前紧接的 5 年"计算，不要求这段时间都在 qualifying route 上（PD-047）。
  - EN: The lookback is “the 5 years immediately before applying”, as in the main text, and that time need not all be on a qualifying route (PD-047).
- 中：Core Protection 的 20 年路径不要求申请前 5 年未使用 public funds；这一要求只用于短于 20 年的路径（p39）。
  - EN: The 20-year Core Protection pathway does not require no use of public funds in the 5 years before applying; that requirement only applies to pathways shorter than 20 years (p39).
- 中：2021-11-04 以来领取过 Universal Credit，属 public funds。Protection Work and Study 的 10 年路径要求申请前 5 年未使用 public funds，否则只能走 20 年路径（p39）。若此后不再使用，自 2028-07-01 起回看期内不再有 public funds，可按较短路径重新评估。
  - EN: Public funds received since 2021-11-04: Universal Credit. The 10-year Protection Work and Study pathway requires no use of public funds in the 5 years before applying; otherwise only the 20-year pathway is available (p39). If they are not used again, the lookback contains no public funds from 2028-07-01, and the shorter pathways can be reassessed.
- 中：难民哪些福利可不计入、对最弱势者的保障措施，将在实施前公布；目前先按现行 public funds 定义判断（PD-031）。
  - EN: Which benefits may be disregarded for refugees, and the safeguards for the most vulnerable, are to be set out before implementation; the current public funds definition is used for now (PD-031).
- 中：20 年按 p25 / p38 的"转入新路线重新起算"，自 Protection Work and Study 的合格期起点起算，不含此前的 Core Protection 时间（PD-066）。
  - EN: Following the rule that the count restarts on moving to a new route (p25, p38), the 20 years count from the start of the qualifying period on Protection Work and Study, without earlier Core Protection time (PD-066).
- 中：经 designated Safe and Legal Routes 入境的难民豁免"定居前 5 年未使用 public funds"的要求（p37、p47）。
  - EN: Refugees admitted through designated Safe and Legal Routes are exempt from the requirement not to have used public funds in the 5 years before settlement (p37, p47).
- 中：2021-11-04 以来领取过 Universal Credit，属 public funds。3 / 5 / 10 年路径要求申请前 5 年未使用 specified public funds，否则须在 qualifying route 上满 20 年。若此后不再使用，自 2028-10-01 起回看期内不再有 public funds，可按较短路径重新评估。
  - EN: Public funds received since 2021-11-04: Universal Credit. The 3 / 5 / 10-year pathways require no use of specified public funds in the 5 years before applying; otherwise 20 years on a qualifying route are needed. If they are not used again, the lookback contains no public funds from 2028-10-01, and the shorter pathways can be reassessed.

### ES-BREACH：成年后无 qualifying immigration breach / No qualifying immigration breach as an adult

来源：SRC-001 p13

待定细节：PD-015、PD-016、PD-044、PD-065

- 中：成年后无 qualifying immigration breach。
  - EN: No qualifying immigration breach as an adult.
- 中：成年后有 qualifying immigration breach（逾期停留），不论收入多高都进入 20 年路径。
  - EN: Qualifying immigration breach as an adult (Overstaying): the 20-year pathway applies however high the earnings.
- 中：20 年按在 qualifying route 上的连续居留计算，违规不设时效（PD-016）。
  - EN: The 20 years count continuous residence on a qualifying route; breaches do not expire (PD-016).
- 中：成年后无 qualifying immigration breach。成年后非法入境在保护类路线上按 Table 2 额外加 10 年，见"难民定居路径与年限"，不在此计入。
  - EN: No qualifying immigration breach as an adult. On a protection route illegal entry as an adult adds 10 years under Table 2 (see the refugee settlement pathway) and is not counted here.
- 中：成年后有 qualifying immigration breach（逾期停留），不论收入多高都进入 20 年路径。成年后非法入境在保护类路线上按 Table 2 额外加 10 年，见"难民定居路径与年限"，不在此计入。
  - EN: Qualifying immigration breach as an adult (Overstaying): the 20-year pathway applies however high the earnings. On a protection route illegal entry as an adult adds 10 years under Table 2 (see the refugee settlement pathway) and is not counted here.
- 中：Table 2 只规定非法入境的后果；其他 qualifying breach 按第 1 章与 Table 1"所有路径适用"进入 20 年路径（叠加非法入境的 10 年），自当前保护类路线的合格期起点起算（PD-065）。
  - EN: Table 2 only sets out the consequence of illegal entry; other qualifying breaches lead to the 20-year pathway under Chapter 1 and Table 1 (“apply to all”), plus 10 years for any illegal entry, counted from the start of the qualifying period on the current protection route (PD-065).

### ES-PROTECTION-PATHWAY：难民定居路径与年限 / Refugee settlement pathway and qualifying period

来源：SRC-001 p37；SRC-001 p38；SRC-001 p39；SRC-001 p40；SRC-001 p47；SRC-001 p48

待定细节：PD-029、PD-032、PD-033、PD-034、PD-043

- 中：当前不是保护类路线，本条不适用。
  - EN: The current route is not a protection route, so this does not apply.
- 中：Core Protection：20 年路径（p38、p47）。转入持续的工作、教育或培训并进入 Protection Work and Study 后，可自转入起按 10 年计算（p38）。成年后非法入境（2023-06-01），申报受 Refugee Convention Article 31 保护。Article 31 适用时不加 10 年，按 20 年计算；这一保障如何运作将在实施前公布（p39、p48）。若不适用，为 30 年，最早 2054-01-01。
  - EN: Core Protection: the 20-year pathway (p38, p47). Moving into sustained work, education or training and onto Protection Work and Study gives a 10-year pathway counted from the move (p38). Illegal entry as an adult (2023-06-01), declared to be protected by Article 31 of the Refugee Convention. Where Article 31 applies the extra 10 years do not, so 20 years are used; how this protection will work is to be set out before implementation (p39, p48). If it does not apply, the pathway is 30 years, at the earliest 2054-01-01.
- 中：Core Protection 与 Protection Work and Study 尚未推出，启用日期未定（PD-034）；本工具按所填许可片段的日期计算。推出前已有的难民身份时间是否及如何计入，原文说法不一、细则待公布（PD-029、PD-043）。
  - EN: Core Protection and Protection Work and Study have not been introduced and their start dates are not set (PD-034); this tool counts from the dates of the permissions entered. Whether and how refugee time before their introduction counts is inconsistent in the response and the details are still to be set out (PD-029, PD-043).
- 中：Protection Work and Study：10 年路径，自转入本路线起算，此前在 Core Protection 的时间不计入（p38、p47）。成年后非法入境（2020-06-01），按 Table 2"Protection Work and Study following illegal entry"行额外加 10 年，共 20 年（p38、p48）；受 Article 31 保护时不加（未申报）。
  - EN: Protection Work and Study: the 10-year pathway, counted from the move onto this route; earlier time on Core Protection does not count (p38, p47). Illegal entry as an adult (2020-06-01): under Table 2’s “Protection Work and Study following illegal entry” row an extra 10 years apply, 20 years in all (p38, p48); they do not apply where Article 31 protects the person (not declared).
- 中：Protection Work and Study：10 年路径，自转入本路线起算，此前在 Core Protection 的时间不计入（p38、p47）。
  - EN: Protection Work and Study: the 10-year pathway, counted from the move onto this route; earlier time on Core Protection does not count (p38, p47).
- 中：Core Protection：20 年路径（p38、p47）。转入持续的工作、教育或培训并进入 Protection Work and Study 后，可自转入起按 10 年计算（p38）。
  - EN: Core Protection: the 20-year pathway (p38, p47). Moving into sustained work, education or training and onto Protection Work and Study gives a 10-year pathway counted from the move (p38).
- 中：按申报经其他指定的安置或担保路线入境，属 designated Safe and Legal Routes：5 年路径（p37、p47）。
  - EN: Admitted, as declared, through another designated resettlement or sponsorship route, a designated Safe and Legal Route: the 5-year pathway (p37, p47).
- 中："其他指定的安置或担保路线"的清单尚未公布，按你的申报处理（PD-033）；若为 Community Sponsorship、Mandate Resettlement Scheme 或此前的安置计划，属 Legacy Safe and Legal Routes，不在 Earned Settlement 框架内（p26 注 13）。
  - EN: The list of other designated resettlement and sponsorship routes has not been published, so this follows what you declared (PD-033). Community Sponsorship, the Mandate Resettlement Scheme and predecessor resettlement schemes are Legacy Safe and Legal Routes, outside the Earned Settlement framework (p26 note 13).
- 中：未填写经哪条 designated Safe and Legal Route 入境（UK Resettlement Scheme 或其他指定的安置 / 担保路线）。先以其他路线合法入境、之后申请庇护的，不走这条 5 年路径（p37）。
  - EN: Not provided which designated Safe and Legal Route the person was admitted on (the UK Resettlement Scheme, or another designated resettlement or sponsorship route). Entering legally on another route and later claiming asylum does not lead to this five-year pathway (p37).
- 中：经 UK Resettlement Scheme 入境，属 designated Safe and Legal Routes：5 年路径（p37、p47）。
  - EN: Admitted through the UK Resettlement Scheme, a designated Safe and Legal Route: the 5-year pathway (p37, p47).
- 中：Protection Work and Study：10 年路径，自转入本路线起算，此前在 Core Protection 的时间不计入（p38、p47）。成年后非法入境（2026-08-10），按 Table 2"Protection Work and Study following illegal entry"行额外加 10 年，共 20 年（p38、p48）；受 Article 31 保护时不加（未申报）。
  - EN: Protection Work and Study: the 10-year pathway, counted from the move onto this route; earlier time on Core Protection does not count (p38, p47). Illegal entry as an adult (2026-08-10): under Table 2’s “Protection Work and Study following illegal entry” row an extra 10 years apply, 20 years in all (p38, p48); they do not apply where Article 31 protects the person (not declared).
- 中：Core Protection：20 年路径（p38、p47）。转入持续的工作、教育或培训并进入 Protection Work and Study 后，可自转入起按 10 年计算（p38）。成年后非法入境（2026-08-10），按 Table 2"Core Protection following illegal entry"行额外加 10 年，共 30 年（p38、p48）；受 Article 31 保护时不加（未申报）。
  - EN: Core Protection: the 20-year pathway (p38, p47). Moving into sustained work, education or training and onto Protection Work and Study gives a 10-year pathway counted from the move (p38). Illegal entry as an adult (2026-08-10): under Table 2’s “Core Protection following illegal entry” row an extra 10 years apply, 30 years in all (p38, p48); they do not apply where Article 31 protects the person (not declared).

### ES-PROTECTION-CONTRIBUTION：Protection Work and Study 的持续贡献 / Sustained contribution on Protection Work and Study

来源：SRC-001 p38；SRC-001 p47

待定细节：PD-030

- 中：当前不是 Protection Work and Study，本条不适用。
  - EN: The current route is not Protection Work and Study, so this does not apply.
- 中：原文只给出工作者的 contribution 标准（3 年年收入达 £12,571），没有给出教育或培训者如何证明持续贡献。
  - EN: The response only sets the contribution standard for those working (earning £12,571 a year for three years); it does not say how those in education or training show sustained contribution.
- 中：2 个完整 tax year 中有 2 个年收入达 £12,571（2024-25、2025-26），需 3 个（p38、p47）。合格期到 2034-01-01 才满，在此之前仍可达到。计入自 2024-01-01 起的完整 tax year（起点所在 tax year 不计，因年收入无法拆出转入前的部分），截至申请日所在 tax year 之前。
  - EN: 2 of 2 complete tax years with earnings of at least £12,571 (2024-25, 2025-26); 3 are needed (p38, p47). The qualifying period ends on 2034-01-01, so this can still be met by then. Complete tax years from 2024-01-01 count (the tax year containing that date does not, as its earnings cannot be split at the move), up to the tax year before the application date.
- 中：原文未定义 3 个 qualifying years 的观察窗口；本工具按"Protection Work and Study 合格期内任意 3 个 tax year"计算（PD-030）。
  - EN: The response does not define the window for the three qualifying years; this tool counts any 3 tax years in the qualifying period on Protection Work and Study (PD-030).
- 中：1 个完整 tax year 中有 1 个年收入达 £12,571（2028-29），需 3 个（p38、p47）。合格期到 2038-03-01 才满，在此之前仍可达到。计入自 2028-03-01 起的完整 tax year（起点所在 tax year 不计，因年收入无法拆出转入前的部分），截至申请日所在 tax year 之前。
  - EN: 1 of 1 complete tax year with earnings of at least £12,571 (2028-29); 3 are needed (p38, p47). The qualifying period ends on 2038-03-01, so this can still be met by then. Complete tax years from 2028-03-01 count (the tax year containing that date does not, as its earnings cannot be split at the move), up to the tax year before the application date.
- 中：1 个完整 tax year 中有 1 个年收入达 £12,571（2028-29），需 3 个（p38、p47）。合格期到 2048-03-01 才满，在此之前仍可达到。计入自 2028-03-01 起的完整 tax year（起点所在 tax year 不计，因年收入无法拆出转入前的部分），截至申请日所在 tax year 之前。
  - EN: 1 of 1 complete tax year with earnings of at least £12,571 (2028-29); 3 are needed (p38, p47). The qualifying period ends on 2048-03-01, so this can still be met by then. Complete tax years from 2028-03-01 count (the tax year containing that date does not, as its earnings cannot be split at the move), up to the tax year before the application date.

### ES-ASYLUM-SUPPORT：已偿还 asylum support 或按计划还款 / Asylum support repaid or repayment plan kept up

来源：SRC-001 p8；SRC-001 p39；SRC-001 p47

待定细节：PD-031、PD-068

- 中：未申报 asylum support 的偿还情况，按未领取 asylum support 处理（领过且须偿还的，定居前须已全额偿还或按约定还款计划持续履行，p8 注 1）。
  - EN: Repayment of asylum support not declared; treated as no asylum support received (anyone who received asylum support and must repay it needs to have repaid it in full, or be keeping up with an agreed repayment plan, before settlement; p8 note 1).
- 中：未填写 asylum support 的偿还情况。领过 asylum support 且须偿还的，定居前须已全额偿还或按约定还款计划持续履行（p8 注 1、p39）。
  - EN: Repayment of asylum support not provided. Anyone who received asylum support and must repay it needs to have repaid it in full, or be keeping up with an agreed repayment plan, before settlement (p8 note 1, p39).
- 中：须偿还的 asylum support 尚未偿还，也没有按约定的还款计划履行。这是最低要求，不满足即不能定居（p8 注 1、p39、p47）。
  - EN: Asylum support that must be repaid is outstanding and no agreed repayment plan is being kept up. This is a minimum requirement: without it settlement is not possible (p8 note 1, p39, p47).
- 中：申报正按约定的还款计划偿还 asylum support（p39）。
  - EN: Declared that an agreed repayment plan for asylum support is being kept up (p39).
- 中：难民偿还义务与保障措施的细则将在实施前公布（PD-031）；偿还情况按你的申报判断。
  - EN: The details of refugees’ repayment obligations and safeguards are to be set out before implementation (PD-031); repayment follows what you declared.
- 中：申报未领取 asylum support 或无需偿还。
  - EN: Declared that no asylum support was received or none needs to be repaid.
- 中：申报已全额偿还 asylum support（p39）。
  - EN: Declared that asylum support has been repaid in full (p39).

### ES-TRANSITIONAL-CARE-WORKER：care worker 过渡安排（保留 5 年） / Care worker transitional arrangements (retain 5 years)

来源：SRC-001 p42；SRC-001 p43；SRC-012 cover；SRC-001 p42；SRC-004 SW 6.1B

待定细节：PD-035、PD-036

- 中：当前不是 care worker（SOC 2020 6135 / 6136）的 Skilled Worker 签证，不适用 care worker 过渡安排。
  - EN: The current permission is not a Skilled Worker visa as a care worker (SOC 2020 6135 / 6136), so the care worker transitional arrangements do not apply.
- 中：薪资 £20,000 低于过渡安排要求的 £25,000，满 5 年时不能凭此定居；可再申请一次 5 年 Health and Care 签证，之后再申请定居。
  - EN: Salary of £20,000 is below the £25,000 the transitional arrangements require, so settlement on this basis is not possible after 5 years; a further 5-year Health and Care visa can be applied for once, before applying for settlement.
- 中：截止点取 Immigration White Paper 的发布日 2025-05-12（PD-035）；"进入或转入该路线"按这段连续 care worker 许可的起始日判断，职业按 SOC 2020 6135 / 6136 认定（PD-036）。
  - EN: The cut-off is taken as the Immigration White Paper publication date, 2025-05-12 (PD-035); “entered or switched into the route” is judged by the start of the current continuous care worker permission, and the occupation by SOC 2020 6135 / 6136 (PD-036).
- 中：自 2023-04-06 起在截止点 2025-05-12 前进入 care worker 路线，薪资 £30,000 达到 £25,000，保留 5 年合格期；仍须满足犯罪记录、B2 英语等强化最低要求。
  - EN: Entered the care worker route on 2023-04-06, before the cut-off of 2025-05-12, with a salary of £30,000 that reaches £25,000: the 5-year qualifying period is retained. The strengthened minimum requirements, such as criminality and B2 English, still apply.
- 中：过渡安排另要求满足担保与雇佣要求（p42），本工具未核实。
  - EN: The transitional arrangements also require the sponsorship and employment requirements to be met (p42); this tool does not check them.
- 中：自 2025-06-06 起进入 care worker 路线，不早于 White Paper 发布日 2025-05-12，不适用过渡安排，走标准 Earned Settlement 路径。
  - EN: Entered the care worker route on 2025-06-06, not before the White Paper publication date of 2025-05-12: the transitional arrangements do not apply, and the standard Earned Settlement pathways are used.

### ES-TRANSITIONAL-HEALTH-EDUCATION：RQF6 以下国家薪级医疗 / 教育岗位过渡安排（保留 5 年） / Transitional arrangement for health / education jobs on national pay scales below RQF 6 (retain 5 years)

来源：SRC-001 p44；SRC-001 p42；SRC-001 p46；SRC-012 cover；SRC-017 Table 3a

待定细节：PD-038、PD-039

- 中：当前不是 RQF6 以下、国家薪级的医疗 / 教育职业（Appendix Skilled Occupations Table 3a）的 Skilled Worker 签证，不适用该过渡安排。
  - EN: The current permission is not a Skilled Worker visa in a health / education occupation on a national pay scale below RQF 6 (Appendix Skilled Occupations Table 3a), so this transitional arrangement does not apply.

### ES-PUBLIC-SERVICE：公共服务职业满 5 年（5 年路径） / 5 years in public service occupations (5-year pathway)

来源：SRC-001 p16；SRC-001 p46 fn 17；SRC-001 p58；SRC-001 p59；SRC-004 SW 16.1

待定细节：PD-012

- 中：当前工作不在 Annex C 公共服务职业表中，不走这条 5 年路径。
  - EN: The current job is not in the Annex C public service occupations list, so this 5-year pathway does not apply.
- 中：自 2021-04-06 起连续从事 Annex C 公共服务职业（Social workers），已满 5 年。
  - EN: In an Annex C public service occupation (Social workers) continuously since 2021-04-06: 5 years completed.

### ES-DEPENDANT-PATHWAY：随主申请人定居（dependant） / Settle with the principal applicant (dependant)

来源：SRC-001 p29；SRC-001 p30；SRC-001 p31

待定细节：PD-056、PD-057、PD-058、PD-059、PD-060、PD-061、PD-062、PD-063

- 中：当前不是以 dependant 身份持证，不走随主申请人定居的路径。
  - EN: The current permission is not as a dependant, so the pathway of settling with the principal applicant does not apply.
- 中：当前以 dependant 身份在英，dependant 随主申请人定居；填写主申请人信息后可判断。
  - EN: Currently in the UK as a dependant, and a dependant settles with the principal applicant; this can be assessed once the principal applicant’s details are provided.
- 中：与主申请人同时开始居留，可在主申请人的 5 年路径满期时（2026-04-06）一同定居，须各自满足相关要求。
  - EN: Residence started together with the principal applicant, so they can settle together when the principal applicant’s 5-year pathway is completed (2026-04-06), each meeting the relevant requirements.
- 中：dependant 的路径年限与日期按主申请人在同一申请日的 Earned Settlement 评估结果推出；主申请人自己的规则明细见其本人的结果。
  - EN: The dependant’s pathway and date follow from the principal applicant’s Earned Settlement assessment on the same application date; see the principal applicant’s own result for their rules.
- 中：伴侣的收入要求按最低收入（个人 £12,571 或家庭合计 £25,142）判断，不按主申请人的加速门槛（PD-056）。
  - EN: The partner’s earnings requirement is the minimum earnings (£12,571 individually or £25,142 combined household earnings), not the principal applicant’s accelerated threshold (PD-056).
- 中：主申请人走 5 年路径，2026-04-06 满期；伴侣自 2023-04-06 起才有计入定居的居留，须同样满 5 年，2028-04-06 起可申请。截至 2026-04-06 尚未满期。
  - EN: The principal applicant is on the 5-year pathway, completed on 2026-04-06; the partner’s counting residence only starts on 2023-04-06, so they also need 5 years and can apply from 2028-04-06. Not yet completed by 2026-04-06.
- 中：后到伴侣的合格期取主申请人所在路径的年限（5 年）（PD-057）。
  - EN: A partner who joined later needs the length of the principal applicant’s pathway (5 years) (PD-057).
- 中：未满 18 岁的子女随父母定居（主申请人 5 年路径，2026-04-06 满期）；豁免收入、政府债务、英语与 Life in the UK，只须满足 suitability 与犯罪记录要求。
  - EN: A child under 18 settles with their parents (principal applicant’s 5-year pathway, completed on 2026-04-06); exempt from earnings, government debt, English and Life in the UK, with only the suitability and criminality requirements to meet.
- 中："家庭符合定居资格时"的年龄按主申请人首次满期之日（2026-04-06）计算，不按实际申请日（PD-060）。
  - EN: Age “when the family becomes eligible for settlement” is taken on the date the principal applicant first completes their pathway (2026-04-06), not the actual application date (PD-060).
- 中：只按一位主申请人评估，假设另一位家长同时定居或就是主申请人的随行伴侣（PD-061）。
  - EN: Assessed against one principal applicant only, assuming the other parent settles at the same time or is the principal applicant’s accompanying partner (PD-061).
- 中：18 至 24 岁保留 child-dependant 身份，随家庭定居（主申请人 5 年路径，2026-04-06 满期）；须满足成人强制要求（犯罪记录、政府债务、B2 英语、Life in the UK），不需个人收入。
  - EN: Aged 18 to 24 and retaining child-dependant status, so settles with the family (principal applicant’s 5-year pathway, completed on 2026-04-06); the adult mandatory requirements apply (criminality, government debt, B2 English, Life in the UK), but not individual earnings.
- 中：当前以父母的 dependant 身份持证，即视为"保留 child-dependant 身份"（retain child-dependant status）；原文未说明认定标准（PD-059）。
  - EN: Current permission as a parent’s dependant is treated as retaining child-dependant status; the response does not say how this is determined (PD-059).
- 中：家庭 2031-04-06 符合定居资格时已满 30 岁（25 岁及以上），不能作为 dependant 随家庭定居；须独立满足某条定居路径的全部强制与资格要求，或转入自己的移民路线。
  - EN: Aged 30 when the family becomes eligible for settlement on 2031-04-06 (25 or over), so cannot settle with the family as a dependant; they must independently meet every mandatory and qualifying requirement of a settlement pathway, or switch to an immigration route of their own.
- 中："家庭符合定居资格时"的年龄按主申请人首次满期之日（2031-04-06）计算，不按实际申请日（PD-060）。
  - EN: Age “when the family becomes eligible for settlement” is taken on the date the principal applicant first completes their pathway (2031-04-06), not the actual application date (PD-060).

### 聚合假设 / Assessment assumptions（earned-settlement-2026-11）

- 中：Earned Settlement 已公布、尚未生效，按"假设在申请日适用"评估；规则依据为政府回应文件（SRC-001），不是已生效的 Immigration Rules（PD-001）。首批规则修改预计 2026 年 12 月起提交、2027 年 1 月生效，2027–2028 年继续修改（SRC-002 col 593；SRC-003 cols 1423–1424），具体生效日以届时的 Statement of Changes 为准（PD-003）。
  - EN: Earned Settlement has been announced but is not yet in force; it is assessed as if it applied on the date of application. The rules are based on the government response (SRC-001), not on Immigration Rules in force (PD-001). The first rule changes are expected to be laid from December 2026 and take effect in January 2027, with further changes in 2027–2028 (SRC-002 col 593; SRC-003 cols 1423–1424); the actual dates will be set by the Statements of Changes (PD-003).
- 中：自 2019-11-01 起连续持 Skilled Worker 许可，早于 2024-04-04，属"2024 年 4 月前群体"：可按现有薪资条件续签至 2035 年（p44，具体日期未定，PD-040）；本工具按标准路径计算定居年限。
  - EN: Continuous Skilled Worker permission since 2019-11-01, before 2024-04-04, so in the “pre-April 2024 cohort”: permission can be extended under the existing salary requirements until 2035 (p44; exact dates not set, PD-040). This tool calculates the settlement pathway under the standard pathways.
- 中：难民定居路径的多项细则（路线推出时间、已有时间如何计入、public funds 与偿还安排、Article 31）将在实施前公布；本结果仅帮助理解已公布的政策，具体情况请咨询受监管的移民顾问。
  - EN: Many details of the refugee settlement pathways (when the routes start, how existing time counts, public funds and repayment, Article 31) will be set out before implementation. This result only helps to understand the announced policy; for your own case, please seek advice from a regulated immigration adviser.
- 中：最早可申请日期按"自 2024-01-01 起持续居留、收入等状况不变、其余要求届时仍满足"推算，不是对未来的保证。
  - EN: The earliest application date is projected on the basis that residence continues from 2024-01-01, earnings and other circumstances stay the same, and the other requirements are still met then; it is not a guarantee about the future.
- 中：最早可申请日期按"自 2025-01-01 起持续居留、收入等状况不变、其余要求届时仍满足"推算，不是对未来的保证。
  - EN: The earliest application date is projected on the basis that residence continues from 2025-01-01, earnings and other circumstances stay the same, and the other requirements are still met then; it is not a guarantee about the future.
- 中：最早可申请日期按"自 2023-01-01 起持续居留、收入等状况不变、其余要求届时仍满足"推算，不是对未来的保证。
  - EN: The earliest application date is projected on the basis that residence continues from 2023-01-01, earnings and other circumstances stay the same, and the other requirements are still met then; it is not a guarantee about the future.
- 中：最早可申请日期按"自 2024-06-01 起持续居留、收入等状况不变、其余要求届时仍满足"推算，不是对未来的保证。
  - EN: The earliest application date is projected on the basis that residence continues from 2024-06-01, earnings and other circumstances stay the same, and the other requirements are still met then; it is not a guarantee about the future.
- 中：最早可申请日期按"自 2015-06-01 起持续居留、收入等状况不变、其余要求届时仍满足"推算，不是对未来的保证。
  - EN: The earliest application date is projected on the basis that residence continues from 2015-06-01, earnings and other circumstances stay the same, and the other requirements are still met then; it is not a guarantee about the future.
- 中：自 2021-04-06 起连续持 Skilled Worker 许可，早于 2024-04-04，属"2024 年 4 月前群体"：可按现有薪资条件续签至 2035 年（p44，具体日期未定，PD-040）；本工具按标准路径计算定居年限。
  - EN: Continuous Skilled Worker permission since 2021-04-06, before 2024-04-04, so in the “pre-April 2024 cohort”: permission can be extended under the existing salary requirements until 2035 (p44; exact dates not set, PD-040). This tool calculates the settlement pathway under the standard pathways.
- 中：最早可申请日期按"自 2023-04-06 起持续居留、收入等状况不变、其余要求届时仍满足"推算，不是对未来的保证。
  - EN: The earliest application date is projected on the basis that residence continues from 2023-04-06, earnings and other circumstances stay the same, and the other requirements are still met then; it is not a guarantee about the future.
- 中：最早可申请日期按"自 2028-03-01 起持续居留、收入等状况不变、其余要求届时仍满足"推算，不是对未来的保证。
  - EN: The earliest application date is projected on the basis that residence continues from 2028-03-01, earnings and other circumstances stay the same, and the other requirements are still met then; it is not a guarantee about the future.
- 中：最早可申请日期按"自 2027-03-01 起持续居留、收入等状况不变、其余要求届时仍满足"推算，不是对未来的保证。
  - EN: The earliest application date is projected on the basis that residence continues from 2027-03-01, earnings and other circumstances stay the same, and the other requirements are still met then; it is not a guarantee about the future.
- 中：原文未规定同时符合过渡安排与标准路径时如何取舍；本结果取满足条件的最短路径，申请人可能可以选择更有利的安排，需咨询受监管顾问。
  - EN: The response does not say how to choose when someone qualifies for both a transitional arrangement and a standard pathway; this result takes the shortest pathway whose conditions are met. The applicant may be able to choose a more favourable arrangement and should seek regulated advice.
- 中：自 2023-04-06 起连续持 Skilled Worker 许可，早于 2024-04-04，属"2024 年 4 月前群体"：可按现有薪资条件续签至 2035 年（p44，具体日期未定，PD-040）；本工具按标准路径计算定居年限。
  - EN: Continuous Skilled Worker permission since 2023-04-06, before 2024-04-04, so in the “pre-April 2024 cohort”: permission can be extended under the existing salary requirements until 2035 (p44; exact dates not set, PD-040). This tool calculates the settlement pathway under the standard pathways.
- 中：最早可申请日期按"自 2021-03-01 起持续居留、收入等状况不变、其余要求届时仍满足"推算，不是对未来的保证。
  - EN: The earliest application date is projected on the basis that residence continues from 2021-03-01, earnings and other circumstances stay the same, and the other requirements are still met then; it is not a guarantee about the future.

## current-law-2026-11

### CL-SCOPE：在现行规则的建模范围内 / Within the scope of the modelled current rules

来源：SRC-004 SW 21.1；SRC-004 SW 39.1；SRC-004 SW 41A.1；SRC-005 LR 11.1；SRC-020 HK 62.1；SRC-021 GT 11.1；SRC-022 SETF 1.3；SRC-023 STP 1.3；SRC-026 UKA 13.1；SRC-027 INNF 18.1；SRC-028 PL 14.1

待定细节：无

- 中：当前持 Skilled Worker 主申请人许可，按 Appendix Skilled Worker 与 Appendix Long Residence 评估。
  - EN: Currently holds Skilled Worker permission as the main applicant; assessed under Appendix Skilled Worker and Appendix Long Residence.
- 中：当前以主申请人身份持 refugee status 或 humanitarian protection 的许可，按 Appendix Settlement Protection 与 Appendix Long Residence 评估。
  - EN: Currently holds permission with refugee status or humanitarian protection as the main applicant; assessed under Appendix Settlement Protection and Appendix Long Residence.
- 中：当前持安全合法保护路线的 dependant 许可；现行法律栏只建模该路线的主申请人，dependant 的定居条件无法判断。
  - EN: Currently holds Safe and Legal permission as a dependant; the current rules are modelled only for the main applicants of this route, so a dependant’s settlement requirements cannot be assessed.
- 中：当前持 Hong Kong BN(O) 主申请人许可（BN(O) Status Holder 或 BN(O) Adult Child），按 Appendix Hong Kong British National (Overseas) 与 Appendix Long Residence 评估。
  - EN: Currently holds Hong Kong BN(O) permission as the main applicant (BN(O) Status Holder or BN(O) Adult Child); assessed under Appendix Hong Kong British National (Overseas) and Appendix Long Residence.
- 中：当前持 Global Talent 主申请人许可，按 Appendix Global Talent 与 Appendix Long Residence 评估。
  - EN: Currently holds Global Talent permission as the main applicant; assessed under Appendix Global Talent and Appendix Long Residence.
- 中：当前持 Appendix FM 的伴侣许可，按伴侣的定居要求与 Appendix Long Residence 评估。
  - EN: Currently holds permission as a partner under Appendix FM; assessed under the partner settlement requirements and Appendix Long Residence.
- 中：现行规则只建模了 Skilled Worker（主申请人及其 dependent partner / child）、Hong Kong BN(O) 与 Global Talent 主申请人、Appendix FM 伴侣、持 refugee status 或 humanitarian protection 的主申请人、UK Ancestry、Innovator Founder 与 Private Life 主申请人、Long Residence；当前路线不在其中，也不满足 Long Residence 的 10 年，无法判断其他路线的定居条件。
  - EN: The current rules are modelled only for Skilled Worker (main applicants and their dependent partners / children), Hong Kong BN(O) and Global Talent main applicants, Appendix FM partners, main applicants with refugee status or humanitarian protection, UK Ancestry, Innovator Founder and Private Life main applicants, and Long Residence; the current route is none of these, and the 10 years for Long Residence are not met, so the settlement requirements of other routes cannot be assessed.
- 中：当前持 Appendix Private Life 主申请人许可，按 Appendix Private Life 与 Appendix Long Residence 评估。
  - EN: Currently holds Appendix Private Life permission as the main applicant; assessed under Appendix Private Life and Appendix Long Residence.
- 中：当前持 Skilled Worker 的 dependent partner 许可，按 Appendix Skilled Worker 的伴侣定居要求（SW 38–SW 46）与 Appendix Long Residence 评估。
  - EN: Currently holds Skilled Worker permission as a dependent partner; assessed under the partner settlement requirements of Appendix Skilled Worker (SW 38–SW 46) and Appendix Long Residence.
- 中：当前持 Skilled Worker 的 dependent child 许可，按 Appendix Skilled Worker 的子女定居要求（SW 38–SW 46、Appendix Children）与 Appendix Long Residence 评估。
  - EN: Currently holds Skilled Worker permission as a dependent child; assessed under the child settlement requirements of Appendix Skilled Worker (SW 38–SW 46, Appendix Children) and Appendix Long Residence.
- 中：当前持 UK Ancestry 主申请人许可，按 Appendix UK Ancestry 与 Appendix Long Residence 评估。
  - EN: Currently holds UK Ancestry permission as the main applicant; assessed under Appendix UK Ancestry and Appendix Long Residence.
- 中：当前持 Innovator Founder 主申请人许可，按 Appendix Innovator Founder 与 Appendix Long Residence 评估。
  - EN: Currently holds Innovator Founder permission as the main applicant; assessed under Appendix Innovator Founder and Appendix Long Residence.

### CL-SW-RESIDENCE-5Y：Skilled Worker 连续 5 年 / 5 continuous years as a Skilled Worker

来源：SRC-004 SW 21.1；SRC-004 SW 21.2；SRC-004 SW 22.1；SRC-008 CR 3.1

待定细节：无

- 中：自 2019-11-01 起连续持可计入 Skilled Worker 定居的许可（SW 21.2），已满 5 年。
  - EN: Continuous permission counting towards Skilled Worker settlement (SW 21.2) since 2019-11-01: 5 years completed.
- 中：连续期合并 SW 21.2 列出的 Skilled Worker、Global Talent、Innovator Founder、T2 Minister of Religion、International Sportsperson、Scale-up 主申请人许可；Representative of an Overseas Business 与 Tier 1 本工具无法填写，不计入；SW 21.2(i) 的等待决定期间未建模。
  - EN: The continuous period combines main applicant permission on the routes listed in SW 21.2: Skilled Worker, Global Talent, Innovator Founder, T2 Minister of Religion, International Sportsperson and Scale-up. Representative of an Overseas Business and Tier 1 cannot be entered in this tool and are not counted; time awaiting a decision under SW 21.2(i) is not modelled.
- 中：自 2022-01-01 起连续持可计入 Skilled Worker 定居的许可（SW 21.2），截至 2026-11-04 满 4 年；2027-01-01 满 5 年。
  - EN: Continuous permission counting towards Skilled Worker settlement (SW 21.2) since 2022-01-01: 4 full years by 2026-11-04; 5 years are completed on 2027-01-01.
- 中：缺席按 Appendix Continuous Residence CR 3.1 计算，出境与入境当日都计入缺席；CR 3.4 的可豁免缺席理由未建模。
  - EN: Absences are counted under Appendix Continuous Residence CR 3.1, with the days of departure and return both counted as absence; the permitted reasons for absence in CR 3.4 are not modelled.
- 中：当前不是 Skilled Worker 主申请人许可。
  - EN: Current permission is not as a Skilled Worker main applicant.
- 中：自 2021-04-06 起连续持可计入 Skilled Worker 定居的许可（SW 21.2），已满 5 年。
  - EN: Continuous permission counting towards Skilled Worker settlement (SW 21.2) since 2021-04-06: 5 years completed.
- 中：自 2023-04-06 起连续持可计入 Skilled Worker 定居的许可（SW 21.2），已满 5 年。
  - EN: Continuous permission counting towards Skilled Worker settlement (SW 21.2) since 2023-04-06: 5 years completed.
- 中：自 2025-06-06 起连续持可计入 Skilled Worker 定居的许可（SW 21.2），已满 5 年。
  - EN: Continuous permission counting towards Skilled Worker settlement (SW 21.2) since 2025-06-06: 5 years completed.

### CL-SW-SALARY：Skilled Worker 定居薪资（general salary） / Skilled Worker settlement salary (general salary)

来源：SRC-004 SW 24.3；SRC-004 SW 4.2(b)；SRC-004 SW A1.1；SRC-017 Table 3；SRC-019 Unnumbered introductory paragraph; occupation table; SOC 2020 rows

待定细节：无

- 中：按 SW 24.3 row C（自 2019-11-01 起连续持 Skilled Worker 许可，早于 2024-04-04，且申请日早于 2030-04-04（SW 4.2(b)(ii)）），general salary 门槛 £31,300；当前年薪 £60,000，已达到。
  - EN: Under SW 24.3 row C (continuous Skilled Worker permission since 2019-11-01, before 2024-04-04, with the application before 2030-04-04 (SW 4.2(b)(ii))), the general salary threshold is £31,300; the current salary of £60,000 meets it.
- 中：SW 24.3 row E（5 年期含 Tier 2 (General) 下的 STEM 类 SOC 2010 职业）未建模。
  - EN: SW 24.3 row E (a 5-year period including STEM occupations under SOC 2010 on Tier 2 (General)) is not modelled.
- 中：未申报是否在 Immigration Salary List 上，按不在清单处理。
  - EN: Not declared whether the job is on the Immigration Salary List; treated as not on the list.
- 中："2024-04-04 前按当时规则获批"按连续 Skilled Worker 许可的起始日判断（SW 4.2(b)(ii)）。
  - EN: “Granted under the rules in place before 2024-04-04” is judged by the start of the continuous Skilled Worker permission (SW 4.2(b)(ii)).
- 中：未填写当前 Skilled Worker 工作的年薪。
  - EN: Salary for the current Skilled Worker job not provided.
- 中：按 SW 24.3 row D（岗位在 Immigration Salary List 上，且自 2019-11-01 起连续持 Skilled Worker 许可，早于 2024-04-04，且申请日早于 2030-04-04（SW 4.2(b)(ii)）），general salary 门槛 £25,000；当前年薪 £20,000，低于此门槛。
  - EN: Under SW 24.3 row D (the job is on the Immigration Salary List, and continuous Skilled Worker permission since 2019-11-01, before 2024-04-04, with the application before 2030-04-04 (SW 4.2(b)(ii))), the general salary threshold is £25,000; the current salary of £20,000 is below it.
- 中：未申报是否在 Immigration Salary List 上；SOC 6135 在清单职业表中，按职业代码推导为在清单上。清单对岗位 / 地区的限制（criteria）未核对，可在问卷里申报覆盖。清单条目的移除日期为 2028-07-22，已按申请日比较。
  - EN: Not declared whether the job is on the Immigration Salary List; SOC 6135 is in the list’s occupation table, so the job is derived to be on the list from its occupation code. The list’s job / region restrictions (criteria) are not checked; a declaration in the questionnaire overrides this. The list entry’s removal date is 2028-07-22, compared with the date of application.
- 中：当前不是 Skilled Worker 主申请人许可。
  - EN: Current permission is not as a Skilled Worker main applicant.
- 中：按 SW 24.3 row D（SOC 2461 是 Appendix Skilled Occupations Table 3 的医疗 / 教育职业），general salary 门槛 £25,000；当前年薪 £42,000，已达到。
  - EN: Under SW 24.3 row D (SOC 2461 is a health / education occupation in Appendix Skilled Occupations Table 3), the general salary threshold is £25,000; the current salary of £42,000 meets it.
- 中：按 SW 24.3 row C（自 2021-04-06 起连续持 Skilled Worker 许可，早于 2024-04-04，且申请日早于 2030-04-04（SW 4.2(b)(ii)）），general salary 门槛 £31,300；当前年薪 £60,000，已达到。
  - EN: Under SW 24.3 row C (continuous Skilled Worker permission since 2021-04-06, before 2024-04-04, with the application before 2030-04-04 (SW 4.2(b)(ii))), the general salary threshold is £31,300; the current salary of £60,000 meets it.
- 中：按 SW 24.3 row D（岗位在 Immigration Salary List 上，且自 2023-04-06 起连续持 Skilled Worker 许可，早于 2024-04-04，且申请日早于 2030-04-04（SW 4.2(b)(ii)）），general salary 门槛 £25,000；当前年薪 £30,000，已达到。
  - EN: Under SW 24.3 row D (the job is on the Immigration Salary List, and continuous Skilled Worker permission since 2023-04-06, before 2024-04-04, with the application before 2030-04-04 (SW 4.2(b)(ii))), the general salary threshold is £25,000; the current salary of £30,000 meets it.
- 中：按 SW 24.3 row D（岗位在 Immigration Salary List 上，且自 2023-04-06 起连续持 Skilled Worker 许可，早于 2024-04-04，且申请日早于 2030-04-04（SW 4.2(b)(ii)）），general salary 门槛 £25,000；当前年薪 £20,000，低于此门槛。
  - EN: Under SW 24.3 row D (the job is on the Immigration Salary List, and continuous Skilled Worker permission since 2023-04-06, before 2024-04-04, with the application before 2030-04-04 (SW 4.2(b)(ii))), the general salary threshold is £25,000; the current salary of £20,000 is below it.
- 中：按 SW 24.3 row C（SOC 6135 属 Health and Care ASHE salary job（SW A1.1）），general salary 门槛 £31,300；当前年薪 £30,000，低于此门槛。
  - EN: Under SW 24.3 row C (SOC 6135 is a Health and Care ASHE salary job (SW A1.1)), the general salary threshold is £31,300; the current salary of £30,000 is below it.
- 中：未申报是否在 Immigration Salary List 上；SOC 6135 的清单条目移除日期为 2028-07-22，早于申请日，按不在清单处理。
  - EN: Not declared whether the job is on the Immigration Salary List; the list entry for SOC 6135 has a removal date of 2028-07-22, before the date of application, so the job is treated as not on the list.
- 中：SOC 6135 在 SW A1.1 的 Health and Care ASHE salary job 职业列表内，假设雇主属 SW A1.1(a)–(f) 列出的类型。
  - EN: SOC 6135 is on the Health and Care ASHE salary job list in SW A1.1; the employer is assumed to be of a type listed in SW A1.1(a)–(f).

### CL-SW-GOING-RATE：Skilled Worker 定居薪资（going rate） / Skilled Worker settlement salary (going rate)

来源：SRC-004 SW 24.3；SRC-004 SW 6.1；SRC-004 SW 14.4；SRC-017 Tables 1, 1a, 2, 2aa, 2a, 2b; SOC 2020 rows; Going rate columns；SRC-019 Unnumbered introductory paragraph; occupation table; SOC 2020 rows

待定细节：无

- 中：按 SW 24.3 row C 查 Appendix Skilled Occupations Table 2，SOC 2136（IT quality and testing professionals）的 going rate 为 £34,500；当前年薪 £60,000，已达到。
  - EN: Under SW 24.3 row C, Appendix Skilled Occupations Table 2 gives a going rate of £34,500 for SOC 2136 (IT quality and testing professionals); the current salary of £60,000 meets it.
- 中：going rate 按每周 37.5 小时的全额年薪比较，未按实际工时折算（SW 14.4）。
  - EN: The going rate is compared as the full annual salary for a 37.5-hour week, not pro-rated for actual hours (SW 14.4).
- 中：未填写当前 Skilled Worker 工作的 SOC 2020 职业代码，无法查 going rate。
  - EN: SOC 2020 code for the current Skilled Worker job not provided, so the going rate cannot be looked up.
- 中：按 SW 24.3 row D 查 Appendix Skilled Occupations Table 2aa，SOC 6135（Care workers and home carers）的 going rate 为 £25,000；当前年薪 £20,000，低于 going rate。
  - EN: Under SW 24.3 row D, Appendix Skilled Occupations Table 2aa gives a going rate of £25,000 for SOC 6135 (Care workers and home carers); the current salary of £20,000 is below the going rate.
- 中：当前不是 Skilled Worker 主申请人许可。
  - EN: Current permission is not as a Skilled Worker main applicant.
- 中：SOC 2461 是 Table 3 医疗 / 教育职业，going rate 按国家薪级（Appendix Skilled Occupations Table 3–5）确定；Table 4 / 5 的薪级本工具未提取，无法核对。
  - EN: SOC 2461 is a Table 3 health / education occupation, whose going rate is set by national pay scales (Appendix Skilled Occupations Tables 3–5); this tool has not extracted the pay scales in Tables 4 / 5, so it cannot check them.
- 中：按 SW 24.3 row D 查 Appendix Skilled Occupations Table 2aa，SOC 6135（Care workers and home carers）的 going rate 为 £25,000；当前年薪 £30,000，已达到。
  - EN: Under SW 24.3 row D, Appendix Skilled Occupations Table 2aa gives a going rate of £25,000 for SOC 6135 (Care workers and home carers); the current salary of £30,000 meets it.
- 中：按 SW 24.3 row C 查 Appendix Skilled Occupations Table 2aa，SOC 6135（Care workers and home carers）的 going rate 为 £25,000；当前年薪 £30,000，已达到。
  - EN: Under SW 24.3 row C, Appendix Skilled Occupations Table 2aa gives a going rate of £25,000 for SOC 6135 (Care workers and home carers); the current salary of £30,000 meets it.

### CL-SW-PARTNER-5Y：Skilled Worker dependent partner 连续 5 年并与主申请人一同定居 / 5 continuous years as a Skilled Worker dependent partner, settling with the principal applicant

来源：SRC-004 SW 39.1；SRC-004 SW 42.1；SRC-004 SW 43.1；SRC-008 CR 3.1

待定细节：无

- 中：当前不是 Skilled Worker 的 dependent partner 许可。
  - EN: Current permission is not as a Skilled Worker dependent partner.
- 中：与主申请人一同定居：dependent partner 许可与主申请人的 Skilled Worker 期都满 5 年后，2026-04-06 起可申请（SW 39.1(a)、SW 42.1）。
  - EN: Settling with the principal applicant: they can apply from 2026-04-06, once both the dependent partner permission and the principal applicant’s Skilled Worker period reach 5 years (SW 39.1(a), SW 42.1).
- 中：只计连续的 Skilled Worker dependant 许可，假设整段都是同一主申请人的 dependent partner；Appendix Relationship with Partner（SW 39.3）未核对。
  - EN: Only continuous Skilled Worker dependant permission is counted, assuming all of it was as the same principal applicant’s dependent partner; Appendix Relationship with Partner (SW 39.3) is not checked.
- 中：主申请人尚未定居时，只判断与主申请人同时获批（SW 39.1(a)）；若其已定居，须在主申请人信息里填写定居日期与路线（SW 39.1(b)）。
  - EN: While the principal applicant has not settled, only being granted at the same time as them is assessed (SW 39.1(a)); if they have already settled, enter their settlement date and route in the principal applicant’s details (SW 39.1(b)).
- 中：与主申请人一同定居：dependent partner 许可与主申请人的 Skilled Worker 期都满 5 年后，2028-04-06 起可申请（SW 39.1(a)、SW 42.1）。截至 2026-04-06 尚未满期。
  - EN: Settling with the principal applicant: they can apply from 2028-04-06, once both the dependent partner permission and the principal applicant’s Skilled Worker period reach 5 years (SW 39.1(a), SW 42.1). Not yet completed by 2026-04-06.

### CL-SW-CHILD：Skilled Worker dependent child 与主申请人一同定居 / Skilled Worker dependent child settling with the principal applicant

来源：SRC-004 SW 39.1；SRC-004 SW 41A.1；SRC-018 CHI 1.1；SRC-018 CHI 1.2；SRC-018 CHI 1A.1；SRC-018 CHI 2.1

待定细节：无

- 中：当前不是 Skilled Worker 的 dependent child 许可。
  - EN: Current permission is not as a Skilled Worker dependent child.
- 中：申请日未满 18 岁（CHI 1.1）；随主申请人定居：主申请人的 Skilled Worker 期 2026-04-06 满 5 年，届时可一同申请（SW 39.1(a)、SW 41A.1）；子女本人没有居留年限要求。
  - EN: Under 18 on the date of application (CHI 1.1); settling with the principal applicant: the principal applicant’s Skilled Worker period reaches 5 years on 2026-04-06, when they can apply together (SW 39.1(a), SW 41A.1); the child has no residence requirement of their own.
- 中：假设子女未 leading an independent life（CHI 1A.1）。
  - EN: The child is assumed not to be leading an independent life (CHI 1A.1).
- 中：假设子女有符合英国法律的照护与住宿安排（CHI 2.1）。
  - EN: The child is assumed to have care and accommodation arrangements that comply with UK law (CHI 2.1).
- 中：只看申请日当天的 Skilled Worker dependent child 许可，假设是同一主申请人的子女；另一位家长须同时获批定居、已定居或为英国公民，除非主申请人负唯一抚养责任等（CHI 4.3，经 SW 39.4），本工具未核对。
  - EN: Only the Skilled Worker dependent child permission on the date of application is checked, assuming the child is the same principal applicant’s; the other parent must be granted settlement at the same time, already be settled or be a British citizen, unless the principal applicant has sole responsibility or similar (CHI 4.3, via SW 39.4); this tool does not check this.
- 中：主申请人尚未定居时，只判断与主申请人同时获批（SW 39.1(a)）；若其已定居，须在主申请人信息里填写定居日期与路线（SW 39.1(b)）。
  - EN: While the principal applicant has not settled, only being granted at the same time as them is assessed (SW 39.1(a)); if they have already settled, enter their settlement date and route in the principal applicant’s details (SW 39.1(b)).
- 中：申请日已满 18 岁，但当前持有的是 dependent child 许可（CHI 1.2(a)）；随主申请人定居：主申请人的 Skilled Worker 期 2026-04-06 满 5 年，届时可一同申请（SW 39.1(a)、SW 41A.1）；子女本人没有居留年限要求。
  - EN: Aged 18 or over on the date of application, but currently holding dependent child permission (CHI 1.2(a)); settling with the principal applicant: the principal applicant’s Skilled Worker period reaches 5 years on 2026-04-06, when they can apply together (SW 39.1(a), SW 41A.1); the child has no residence requirement of their own.
- 中：主申请人目前不能作为 Skilled Worker 定居，dependent child 不能按 SW 39.1(a) 随其定居。
  - EN: The principal applicant cannot currently settle as a Skilled Worker, so the dependent child cannot settle with them under SW 39.1(a).

### CL-HKBNO-RESIDENCE-5Y：Hong Kong BN(O) 连续 5 年 / 5 continuous years on the Hong Kong BN(O) route

来源：SRC-020 HK 62.1；SRC-020 HK 63.1；SRC-008 CR 3.1

待定细节：PD-069

- 中：当前不是 Hong Kong BN(O) 主申请人许可。
  - EN: Current permission is not as a Hong Kong BN(O) main applicant.
- 中：自 2023-01-01 起连续持 Hong Kong BN(O) 许可，截至 2026-11-04 满 3 年；2028-01-01 满 5 年（HK 62.1(b)）。
  - EN: Continuous Hong Kong BN(O) permission since 2023-01-01: 3 full years by 2026-11-04; 5 years are completed on 2028-01-01 (HK 62.1(b)).
- 中：HK 62.1(b) 也计入其他可定居路线（a route under which a person can settle）的许可；本工具只计 Hong Kong BN(O) 段，紧接其前的技术工作者许可未计入，若该路线可定居，实际日期可能更早（PD-069）。
  - EN: HK 62.1(b) also counts permission on any other route under which a person can settle; this tool counts only the Hong Kong BN(O) period, so the Skilled Worker permission just before it is not counted, and the actual date may be earlier if that route can lead to settlement (PD-069).
- 中：自 2021-02-01 起连续持 Hong Kong BN(O) 许可，已满 5 年（HK 62.1(b)）。
  - EN: Continuous Hong Kong BN(O) permission since 2021-02-01: 5 years completed (HK 62.1(b)).

### CL-GT-RESIDENCE：Global Talent 连续 3 年或 5 年 / Global Talent: 3 or 5 continuous years

来源：SRC-021 GT 11.1；SRC-021 GT 11.2；SRC-021 GT 11.3；SRC-021 GT 12.1；SRC-008 CR 3.1

待定细节：无

- 中：当前不是 Global Talent 主申请人许可。
  - EN: Current permission is not as a Global Talent main applicant.
- 中：未填写 Tech Nation 的背书是 exceptional talent 还是 exceptional promise：前者 3 年（GT 11.1(b)），后者 5 年（GT 11.2）。
  - EN: Not provided whether the Tech Nation endorsement was under the exceptional talent or the exceptional promise criteria: 3 years for the former (GT 11.1(b)), 5 for the latter (GT 11.2).
- 中：连续期合并 GT 11.3 列出的 Global Talent、Innovator Founder、Skilled Worker、T2 Minister of Religion、International Sportsperson、Scale-up 主申请人许可；Tier 1 与 Representative of an Overseas Business 本工具无法填写，不计入。
  - EN: The continuous period combines main applicant permission on the routes listed in GT 11.3: Global Talent, Innovator Founder, Skilled Worker, T2 Minister of Religion, International Sportsperson and Scale-up. Tier 1 and Representative of an Overseas Business cannot be entered in this tool and are not counted.
- 中：按背书未被撤回（GT 10.1）、上一段许可期间在背书或奖项领域有收入（GT 10.2）处理，本工具未核对。
  - EN: The endorsement is taken as not withdrawn (GT 10.1) and the applicant as having earned money in the field of their endorsement or prize during their last permission (GT 10.2); this tool does not check these.
- 中：按 GT 11.1(b) 合格期 3 年；自 2023-11-04 起连续持可计入的许可（GT 11.3），已满 3 年。
  - EN: 3-year qualifying period under GT 11.1(b); continuous qualifying permission (GT 11.3) since 2023-11-04: 3 years completed.

### CL-FAMILY-RESIDENCE：家庭伴侣路线的连续居留 / Continuous residence on the family partner route

来源：SRC-022 SETF 3.1；SRC-022 SETF 3.2；SRC-022 SETF 4.1；SRC-024 E-ILRP.1.3；SRC-024 E-ILRP.1.4；SRC-008 CR 3.1

待定细节：PD-069、PD-070

- 中：当前不是 Appendix FM 的伴侣许可。
  - EN: Current permission is not as a partner under Appendix FM.
- 中：10 年伴侣路线：自 2019-01-01 起连续持可计入的许可（SETF 3.1），截至 2026-11-04 满 7 年；2029-01-01 满 10 年。
  - EN: 10-year partner route: continuous qualifying permission (SETF 3.1) since 2019-01-01: 7 full years by 2026-11-04; 10 years are completed on 2029-01-01.
- 中：连续期合并 SETF 3.1 列出的家庭伴侣或父母、家庭与私人生活两类许可；各段按与当前许可同属 10 年路线计算。
  - EN: The continuous period combines the Family Partner or Parent and Family and Private Life permissions listed in SETF 3.1; each period is taken to be on the 10-year route like the current permission.
- 中：5 年伴侣路线：自 2024-06-01 起连续持伴侣许可，截至 2026-11-04 满 2 年；2029-06-01 满 5 年（E-ILRP.1.3）。
  - EN: 5-year partner route: continuous partner permission since 2024-06-01: 2 full years by 2026-11-04; 5 years are completed on 2029-06-01 (E-ILRP.1.3).
- 中：E-ILRP.1.3 只计 5 年路线的伴侣许可（D-ECP.1.1 / D-LTRP.1.1），不计 fiancé(e) 期间；各段按同属 5 年路线、同一伴侣（E-ILRP.1.4）计算。
  - EN: E-ILRP.1.3 counts only partner permission on the 5-year route (D-ECP.1.1 / D-LTRP.1.1), not time as a fiancé(e); each period is taken to be on the 5-year route with the same partner (E-ILRP.1.4).
- 中：Appendix FM 未引用 Appendix Continuous Residence，也没有规定多长的缺席会中断 E-ILRP.1.3 的连续居住；本工具不因缺席重新起算（PD-070）。
  - EN: Appendix FM does not refer to Appendix Continuous Residence and does not say what absence breaks the continuous residence in E-ILRP.1.3; this tool does not restart the period for absences (PD-070).
- 中：未填写伴侣许可是 5 年路线还是 10 年路线：5 年路线按 Appendix FM，10 年路线按 Appendix Settlement Family Life（SETF 3.1）。
  - EN: Not provided whether the partner permission is on the 5-year or the 10-year route: the 5-year route follows Appendix FM, the 10-year route Appendix Settlement Family Life (SETF 3.1).
- 中：5 年伴侣路线：自 2021-03-01 起连续持伴侣许可，已满 5 年（E-ILRP.1.3）。
  - EN: 5-year partner route: continuous partner permission since 2021-03-01: 5 years completed (E-ILRP.1.3).

### CL-FAMILY-RELATIONSHIP：伴侣为 British citizen 或已定居 / Partner is a British citizen or settled

来源：SRC-022 SETF 7.1；SRC-022 SETF 7.2；SRC-022 SETF 7.3；SRC-024 E-ILRP.1.3(1A)；SRC-024 E-LTRP.1.2

待定细节：无

- 中：未填写伴侣信息；SETF 7.1 要求伴侣为在英国的 British citizen、已定居，或与申请人同时申请定居。
  - EN: Partner details not provided; SETF 7.1 requires the partner to be a British citizen living in the UK, settled in the UK, or applying for settlement at the same time.
- 中：伴侣既不是 British citizen 也未定居；只有伴侣与申请人同时申请定居时才满足 SETF 7.1(c)，本工具无法判断。
  - EN: The partner is neither a British citizen nor settled; SETF 7.1(c) is met only if the partner is applying for settlement at the same time, which this tool cannot tell.
- 中：伴侣已在英国定居（E-LTRP.1.2(b)）。
  - EN: The partner is settled in the UK (E-LTRP.1.2(b)).
- 中：按关系真实且持续、双方打算永久共同生活（E-LTRP.1.7–E-LTRP.1.10）处理，本工具未核对。
  - EN: The relationship is taken as genuine and subsisting, with both intending to live together permanently (E-LTRP.1.7–E-LTRP.1.10); this tool does not check these.
- 中：伴侣为 British citizen（E-LTRP.1.2(a)）。
  - EN: The partner is a British citizen (E-LTRP.1.2(a)).

### CL-FAMILY-FINANCIAL：5 年伴侣路线的财务要求 / Financial requirement on the 5-year partner route

来源：SRC-024 E-ILRP.1.3(1A)；SRC-024 E-LTRP.3.1；SRC-024 E-LTRP.3.2；SRC-024 E-LTRP.3.5；SRC-024 E-LTRP.3.7；SRC-024 E-LTRP.3.8

待定细节：无

- 中：当前不是 5 年路线的伴侣许可。
  - EN: Current permission is not as a partner on the 5-year route.
- 中：2025-26 纳税年度本人与伴侣收入合计 £27,000，低于一般门槛（E-LTRP.3.1(a)）的 £29,000。
  - EN: Combined earnings of the applicant and partner in the 2025-26 tax year are £27,000, below the £29,000 of the general requirement (E-LTRP.3.1(a)).
- 中：是否适用过渡门槛按连续伴侣许可的起点是否早于 2024-04-11 判断（E-LTRP.3.5 看的是首次申请日；获批在此后而申请在此前的，也适用过渡门槛）；子女按"关系"里身份为其他的子女计。储蓄（E-LTRP.3.1(b)）、伴侣领取特定福利（E-LTRP.3.3）与 Appendix FM-SE 的证据规则未建模。
  - EN: Whether the transitional requirement applies is judged by whether the continuous partner permission started before 2024-04-11 (E-LTRP.3.5 looks at the date of the first application, so an application made before that date and granted after it also qualifies); children are those listed under relationships with another status. Savings (E-LTRP.3.1(b)), the partner receiving specified benefits (E-LTRP.3.3) and the evidence rules in Appendix FM-SE are not modelled.
- 中：2024-25 纳税年度本人与伴侣收入合计 £22,000，达到过渡门槛（E-LTRP.3.5、E-LTRP.3.7(a)，0 名子女，最高 £29,000）的 £18,600。
  - EN: Combined earnings of the applicant and partner in the 2024-25 tax year are £22,000, which meets the £18,600 of the transitional requirement (E-LTRP.3.5, E-LTRP.3.7(a); 0 children, capped at £29,000).

### CL-PROTECTION-RESIDENCE-5Y：连续 5 年持 refugee status 或 humanitarian protection / 5 continuous years with refugee status or humanitarian protection

来源：SRC-023 STP 1.3；SRC-023 STP 3.1

待定细节：PD-071、PD-073

- 中：当前不是以主申请人身份持 refugee status 或 humanitarian protection 的许可。
  - EN: Current permission is not as a main applicant with refugee status or humanitarian protection.
- 中：自 2024-01-01 起在英国连续持 refugee status 或 humanitarian protection，截至 2026-11-04 满 2 年；2029-01-01 满 5 年（STP 3.1）。
  - EN: Continuously in the UK with refugee status or humanitarian protection since 2024-01-01: 2 full years by 2026-11-04; 5 years are completed on 2029-01-01 (STP 3.1).
- 中：STP 1.3 按申请庇护的日期列明许可类别：2022-06-28 前申请的为 refugee 或 humanitarian protection 许可，此后申请的为 refugee permission to stay；本工具不区分 refugee 与 humanitarian protection，按你持有所列许可处理。2022-06-28 及以后申请庇护而获 humanitarian protection 的，STP 1.3(b) 未列明（PD-073）。
  - EN: STP 1.3 lists the permission by the date of the asylum application: refugee or humanitarian protection permission for applications before 2022-06-28, and refugee permission to stay for later ones. This tool does not tell refugee status and humanitarian protection apart, and assumes you hold a listed permission. Humanitarian protection following an asylum application made on or after 2022-06-28 is not listed in STP 1.3(b) (PD-073).
- 中：自 2021-01-01 起在英国连续持 refugee status 或 humanitarian protection，已满 5 年（STP 3.1）。
  - EN: Continuously in the UK with refugee status or humanitarian protection since 2021-01-01: 5 years completed (STP 3.1).
- 中：自 2022-01-01 起在英国连续持 refugee status 或 humanitarian protection，截至 2026-11-04 满 4 年；2027-01-01 满 5 年（STP 3.1）。
  - EN: Continuously in the UK with refugee status or humanitarian protection since 2022-01-01: 4 full years by 2026-11-04; 5 years are completed on 2027-01-01 (STP 3.1).
- 中：自 2023-01-01 起在英国连续持 refugee status 或 humanitarian protection，截至 2026-11-04 满 3 年；2028-01-01 满 5 年（STP 3.1）。
  - EN: Continuously in the UK with refugee status or humanitarian protection since 2023-01-01: 3 full years by 2026-11-04; 5 years are completed on 2028-01-01 (STP 3.1).
- 中：自 2027-06-01 起在英国连续持 refugee status 或 humanitarian protection，已满 5 年（STP 3.1）。
  - EN: Continuously in the UK with refugee status or humanitarian protection since 2027-06-01: 5 years completed (STP 3.1).
- 中：自 2027-03-01 起在英国连续持 refugee status 或 humanitarian protection，截至 2030-01-01 满 2 年；2032-03-01 满 5 年（STP 3.1）。
  - EN: Continuously in the UK with refugee status or humanitarian protection since 2027-03-01: 2 full years by 2030-01-01; 5 years are completed on 2032-03-01 (STP 3.1).
- 中：自 2021-03-01 起在英国连续持 refugee status 或 humanitarian protection，已满 5 年（STP 3.1）。
  - EN: Continuously in the UK with refugee status or humanitarian protection since 2021-03-01: 5 years completed (STP 3.1).

### CL-PROTECTION-STATUS：保护身份未被撤销或放弃 / Protection status not revoked or renounced

来源：SRC-023 STP 4.1；SRC-023 STP 4.2；SRC-023 STP 5.2

待定细节：无

- 中：未申报撤销或放弃，按仍持有 refugee status 或 humanitarian protection 处理（STP 4.1）。
  - EN: No revocation or renunciation declared, so refugee status or humanitarian protection is taken as still held (STP 4.1).
- 中：审理定居申请时会做 safe return review（STP 4.2），核查个人情况或原籍国状况是否已变化到可撤销或不续期保护身份，结果无法预判。
  - EN: A safe return review is carried out when the settlement application is considered (STP 4.2), checking whether personal circumstances or country conditions have changed so that protection could be revoked or not renewed; its outcome cannot be predicted.
- 中：不满足定居要求、但仍有权享有 refugee status 或 humanitarian protection 时，会再获至少 30 个月的保护许可（STP 5.2）。
  - EN: If the settlement requirements are not met but the person is still entitled to refugee status or humanitarian protection, a further period of at least 30 months of protection permission is granted (STP 5.2).

### CL-ANCESTRY-RESIDENCE-5Y：UK Ancestry 连续 5 年 / 5 continuous years on the UK Ancestry route

来源：SRC-026 UKA 10.3；SRC-026 UKA 12.1；SRC-026 UKA 13.1；SRC-026 UKA 14.1；SRC-008 CR 3.1

待定细节：无

- 中：当前不是 UK Ancestry 主申请人许可。
  - EN: Current permission is not as a UK Ancestry main applicant.
- 中：自 2021-09-01 起连续持 UK Ancestry 主申请人许可，已满 5 年（UKA 13.1）。
  - EN: Continuous UK Ancestry permission as the main applicant since 2021-09-01: 5 years completed (UKA 13.1).
- 中：按你在申请日仍是 Commonwealth citizen（UKA 10.3），且仍满足 UKA 4.1–6.1（祖父母之一生于 UK 或 Islands、能自给自足且不依赖 public funds、能工作并打算在英国工作，UKA 12.1）处理。
  - EN: Assumes you are still a Commonwealth citizen on the date of application (UKA 10.3) and still meet UKA 4.1–6.1 (a grandparent born in the UK or Islands, adequate maintenance and accommodation without recourse to public funds, and able and intending to work in the UK, UKA 12.1).

### CL-INNOVATOR-RESIDENCE-3Y：Innovator Founder 连续 3 年 / 3 continuous years as an Innovator Founder

来源：SRC-027 INNF 18.1；SRC-027 INNF 19.1；SRC-008 CR 3.1

待定细节：无

- 中：当前不是 Innovator Founder 主申请人许可。
  - EN: Current permission is not as an Innovator Founder main applicant.
- 中：自 2023-05-01 起连续持 Innovator Founder 许可，已满 3 年（INNF 18.1）。
  - EN: Continuous Innovator Founder permission since 2023-05-01: 3 years completed (INNF 18.1).

### CL-INNOVATOR-ENDORSEMENT：Innovator Founder 定居背书的业务条件 / Business criteria for the Innovator Founder settlement endorsement

来源：SRC-027 INNF 15.2(e)；SRC-027 INNF 17.1；SRC-027 INNF 17.2；SRC-027 INNF 17.3；SRC-027 INNF 17.4

待定细节：无

- 中：未填写业务已满足 INNF 17.1(f) 的哪几项；定居背书须至少满足 2 项。
  - EN: Not provided which of the INNF 17.1(f) business criteria have been met; the settlement endorsement needs at least 2.
- 中：业务已满足 2 项（INNF 17.1(f)(i)、INNF 17.1(f)(vi)），达到 INNF 17.1(f) 的至少 2 项。
  - EN: The business has met 2 of the criteria (INNF 17.1(f)(i), INNF 17.1(f)(vi)), at least the 2 required by INNF 17.1(f).
- 中：按 endorsing body 会确认 INNF 17.1(a)–(e)（对照原业务计划有显著成果、在 Companies House 登记且你是 director 或 member、仍在经营、未来至少 12 个月可持续、你在日常管理中起关键作用）处理；背书信须在申请前 3 个月内签发且未撤回（INNF 15.2(e)）。团队成员不能共用同一项（INNF 17.3），岗位须存在满 12 个月、每周至少 30 小时等（INNF 17.4），均未核实。
  - EN: Assumes the endorsing body will confirm INNF 17.1(a)–(e) (significant achievements against the business plan, registration with Companies House with you as a director or member, active trading, sustainability for at least the next 12 months, and your key role in day-to-day management); the endorsement letter must be issued no more than 3 months before the application and not withdrawn (INNF 15.2(e)). That team members cannot share a criterion (INNF 17.3) and that jobs must have existed for 12 months with at least 30 hours a week (INNF 17.4) are not checked.

### CL-PRIVATE-LIFE-RESIDENCE：Private Life 连续 5 年或 10 年 / Private Life: 5 or 10 continuous years

来源：SRC-028 PL 14.1；SRC-028 PL 14.2；SRC-028 PL 14.3；SRC-028 PL 14.4；SRC-028 PL 15.1；SRC-008 CR 3.1

待定细节：PD-069

- 中：当前不是 Appendix Private Life 主申请人许可。
  - EN: Current permission is not as an Appendix Private Life main applicant.
- 中：未填写 Private Life 许可的依据：作为儿童（PL 3.1）或满足 half-life test 的 young adult（PL 4.1）获批的，合格期 5 年（PL 14.1）；其余 10 年（PL 14.2(a)）。
  - EN: Not provided what the Private Life permission was granted on: 5 years for permission as a child (PL 3.1) or as a young adult who met the half-life test (PL 4.1) (PL 14.1); 10 years otherwise (PL 14.2(a)).
- 中：连续期合并 PL 14.3 列出的 Appendix FM 伴侣、父母及其子女许可与 Private Life 许可；PL 14.3(e) 基于 Article 8 的 Leave Outside the Rules 无法与其他 Leave Outside the Rules 区分，不计入。PL 13（英国出生、连续居住 7 年的儿童可直接定居）、PL 14.1A / PL 14.2(b) / PL 14.2A（2022-06-20 前 Appendix FM 或 Leave Outside the Rules 许可的过渡安排）与 PL 12.3–12.5（suitability 事由要求走 10 年）未建模。
  - EN: The continuous period combines the permissions listed in PL 14.3: Appendix FM partner, parent and child permission, and Private Life permission. Leave Outside the Rules on Article 8 grounds (PL 14.3(e)) cannot be told apart from other such leave and is not counted. PL 13 (immediate settlement for a child born in the UK after 7 years of continuous residence), PL 14.1A / PL 14.2(b) / PL 14.2A (transitional cases with Appendix FM or Leave Outside the Rules permission before 2022-06-20) and PL 12.3–12.5 (suitability grounds that require 10 years) are not modelled.
- 中：按 PL 14.1 合格期 5 年；自 2021-07-01 起连续持可计入的许可（PL 14.3），已满 5 年。
  - EN: 5-year qualifying period under PL 14.1; continuous qualifying permission (PL 14.3) since 2021-07-01: 5 years completed.

### CL-ENGLISH：定居英语要求 / Settlement English requirement

来源：SRC-004 SW 22A.1；SRC-004 SW 44.1；SRC-007 p24；SRC-005 LR 13.1；SRC-020 HK 60.1；SRC-021 GT 13.1；SRC-022 SETF 5.1；SRC-024 E-ILRP.1.6；SRC-025 KoLL 2.2；SRC-026 UKA 15.1；SRC-028 PL 16.1；SRC-007 EM 5.60；SRC-014 EL 1.1

待定细节：PD-072

- 中：申请日早于 2027-03-26，Appendix Skilled Worker 未对定居另设英语要求（SW 22A.1 的 B2 只适用于此后的申请）。
  - EN: The application date is before 2027-03-26, and Appendix Skilled Worker sets no separate English requirement for settlement (the B2 in SW 22A.1 applies only to later applications).
- 中：英语 B2，达到定居要求的 B1（Appendix Settlement Protection 未对定居设英语要求，此等级只适用于 Long Residence 10 年路径，PD-072）。
  - EN: English at B2, which meets the B1 required for settlement (Appendix Settlement Protection sets no English requirement for settlement; this level applies only to the 10-year Long Residence pathway, PD-072).
- 中：英语 B2，达到定居要求的 B1。
  - EN: English at B2, which meets the B1 required for settlement.
- 中：英语 B2，达到定居要求的 B1（Appendix Hong Kong BN(O) HK 60.1；HC 1691 的 B2 未覆盖该 Appendix，EM 5.60）。
  - EN: English at B2, which meets the B1 required for settlement (Appendix Hong Kong BN(O) HK 60.1; the B2 introduced by HC 1691 does not cover this Appendix, EM 5.60).
- 中：英语 B2，达到定居要求的 B1（Appendix Global Talent GT 13.1(a)，2027-03-26 前的申请）。
  - EN: English at B2, which meets the B1 required for settlement (Appendix Global Talent GT 13.1(a), applications before 2027-03-26).
- 中：英语 B2，达到定居要求的 B1（Appendix Settlement Family Life SETF 5.1(a)，2027-03-26 前的申请）。
  - EN: English at B2, which meets the B1 required for settlement (Appendix Settlement Family Life SETF 5.1(a), applications before 2027-03-26).
- 中：英语 B2，达到定居要求的 B1（Appendix KoLL 2.2，经 E-ILRP.1.6；2027-03-26 前的申请）。
  - EN: English at B2, which meets the B1 required for settlement (Appendix KoLL 2.2, through E-ILRP.1.6; applications before 2027-03-26).
- 中：英语 B2，达到定居要求的 B1（Appendix Private Life PL 16.1(a)，2027-03-26 前的申请）。
  - EN: English at B2, which meets the B1 required for settlement (Appendix Private Life PL 16.1(a), applications before 2027-03-26).
- 中：申请日未满 18 岁或已满 65 岁，豁免英语要求。
  - EN: Under 18 or aged 65 or over on the date of application: exempt from the English requirement.
- 中：英语 A2，低于定居要求的 B2（Appendix Settlement Protection 未对定居设英语要求，此等级只适用于 Long Residence 10 年路径，PD-072）。
  - EN: English at A2, below the B2 required for settlement (Appendix Settlement Protection sets no English requirement for settlement; this level applies only to the 10-year Long Residence pathway, PD-072).
- 中：英语 B2，达到定居要求的 B2（Appendix Settlement Protection 未对定居设英语要求，此等级只适用于 Long Residence 10 年路径，PD-072）。
  - EN: English at B2, which meets the B2 required for settlement (Appendix Settlement Protection sets no English requirement for settlement; this level applies only to the 10-year Long Residence pathway, PD-072).
- 中：英语 B2，达到定居要求的 B2。
  - EN: English at B2, which meets the B2 required for settlement.
- 中：英语 B1，达到定居要求的 B1（Appendix Hong Kong BN(O) HK 60.1；HC 1691 的 B2 未覆盖该 Appendix，EM 5.60）。
  - EN: English at B1, which meets the B1 required for settlement (Appendix Hong Kong BN(O) HK 60.1; the B2 introduced by HC 1691 does not cover this Appendix, EM 5.60).
- 中：英语 B1，达到定居要求的 B1（Appendix Global Talent GT 13.1(a)，2027-03-26 前的申请）。
  - EN: English at B1, which meets the B1 required for settlement (Appendix Global Talent GT 13.1(a), applications before 2027-03-26).
- 中：英语 B1，达到定居要求的 B1（Appendix KoLL 2.2，经 E-ILRP.1.6；2027-03-26 前的申请）。
  - EN: English at B1, which meets the B1 required for settlement (Appendix KoLL 2.2, through E-ILRP.1.6; applications before 2027-03-26).
- 中：未填写英语水平；定居要求 CEFR B1（Appendix Settlement Protection 未对定居设英语要求，此等级只适用于 Long Residence 10 年路径，PD-072）。
  - EN: English level not provided; settlement requires CEFR B1 (Appendix Settlement Protection sets no English requirement for settlement; this level applies only to the 10-year Long Residence pathway, PD-072).
- 中：英语 B1，达到定居要求的 B1（Appendix UK Ancestry UKA 15.1(a)，2027-03-26 前的申请）。
  - EN: English at B1, which meets the B1 required for settlement (Appendix UK Ancestry UKA 15.1(a), applications before 2027-03-26).
- 中：未填写英语水平；定居要求 CEFR B1（Appendix Innovator Founder 未对主申请人定居设英语要求，INNF 15.1–21.6；此等级只适用于 Long Residence 10 年路径）。
  - EN: English level not provided; settlement requires CEFR B1 (Appendix Innovator Founder sets no English requirement for a main applicant’s settlement, INNF 15.1–21.6; this level applies only to the 10-year Long Residence pathway).
- 中：英语 B1，达到定居要求的 B1（Appendix Private Life PL 16.1(a)，2027-03-26 前的申请）。
  - EN: English at B1, which meets the B1 required for settlement (Appendix Private Life PL 16.1(a), applications before 2027-03-26).

### CL-KOL：通过 Life in the UK 考试 / Pass the Life in the UK test

来源：SRC-004 SW 23.1；SRC-004 SW 45.1；SRC-005 LR 14.1；SRC-020 HK 61.1；SRC-021 GT 14.1；SRC-022 SETF 6.1；SRC-025 KoLL 2.3；SRC-026 UKA 16.1；SRC-027 INNF 20.1；SRC-028 PL 17.1；SRC-015 KOL 1.1；SRC-015 KOL 2.1

待定细节：PD-072

- 中：已通过 Life in the UK 考试。
  - EN: Passed the Life in the UK test.
- 中：未填写是否已通过 Life in the UK 考试。
  - EN: Not provided whether the Life in the UK test has been passed.
- 中：已通过 Life in the UK 考试（Appendix Settlement Protection 未设 Life in the UK 要求，此项只适用于 Long Residence 10 年路径，PD-072）。
  - EN: Passed the Life in the UK test (Appendix Settlement Protection sets no Life in the UK requirement; this applies only to the 10-year Long Residence pathway, PD-072).
- 中：已通过 Life in the UK 考试（HK 61.1）。
  - EN: Passed the Life in the UK test (HK 61.1).
- 中：已通过 Life in the UK 考试（GT 14.1）。
  - EN: Passed the Life in the UK test (GT 14.1).
- 中：已通过 Life in the UK 考试（SETF 6.1）。
  - EN: Passed the Life in the UK test (SETF 6.1).
- 中：已通过 Life in the UK 考试（Appendix KoLL 2.3，经 E-ILRP.1.6）。
  - EN: Passed the Life in the UK test (Appendix KoLL 2.3, through E-ILRP.1.6).
- 中：已通过 Life in the UK 考试（PL 17.1）。
  - EN: Passed the Life in the UK test (PL 17.1).
- 中：申请日未满 18 岁或已满 65 岁，豁免 Life in the UK 考试。
  - EN: Under 18 or aged 65 or over on the date of application: exempt from the Life in the UK test.
- 中：未填写是否已通过 Life in the UK 考试（Appendix Settlement Protection 未设 Life in the UK 要求，此项只适用于 Long Residence 10 年路径，PD-072）。
  - EN: Not provided whether the Life in the UK test has been passed (Appendix Settlement Protection sets no Life in the UK requirement; this applies only to the 10-year Long Residence pathway, PD-072).
- 中：已通过 Life in the UK 考试（UKA 16.1）。
  - EN: Passed the Life in the UK test (UKA 16.1).
- 中：已通过 Life in the UK 考试（INNF 20.1）。
  - EN: Passed the Life in the UK test (INNF 20.1).

### CL-LR-RESIDENCE-10Y：Long Residence 连续合法居留 10 年 / Long Residence: 10 years of continuous lawful residence

来源：SRC-005 LR 11.1；SRC-005 LR 11.2；SRC-008 CR 3.1；SRC-008 CR 3.3

待定细节：无

- 中：自 2019-11-01 起连续合法居留，截至 2026-11-04 满 7 年；2029-11-01 满 10 年。
  - EN: Continuous lawful residence since 2019-11-01: 7 full years by 2026-11-04; 10 years are completed on 2029-11-01.
- 中：连续合法居留计入学生、毕业生等临时路线，不计访问、季节性工作者、乌克兰计划（LR 11.1(a)）；LR 11.2 不计入的期间（immigration bail 等）与 LR 11.3 的 12 个月要求未建模。
  - EN: Continuous lawful residence includes temporary routes such as Student and Graduate, but not Visit, Seasonal Worker, Ukraine Scheme (LR 11.1(a)); periods that do not count under LR 11.2 (immigration bail and similar) and the 12-month requirement in LR 11.3 are not modelled.
- 中：自 2022-01-01 起连续合法居留，截至 2026-11-04 满 4 年；2032-01-01 满 10 年。
  - EN: Continuous lawful residence since 2022-01-01: 4 full years by 2026-11-04; 10 years are completed on 2032-01-01.
- 中：2024-04-11 前开始的缺席按 CR 3.3（单次不超过 184 天、累计不超过 548 天），之后的按 CR 3.1；出境与入境当日都计入缺席。
  - EN: Absences starting before 2024-04-11 follow CR 3.3 (no single absence over 184 days and no more than 548 days in total), and later ones follow CR 3.1; the days of departure and return both count as absence.
- 中：自 2024-01-01 起连续合法居留，截至 2026-11-04 满 2 年；2034-01-01 满 10 年。
  - EN: Continuous lawful residence since 2024-01-01: 2 full years by 2026-11-04; 10 years are completed on 2034-01-01.
- 中：自 2021-01-01 起连续合法居留，截至 2026-11-04 满 5 年；2031-01-01 满 10 年。
  - EN: Continuous lawful residence since 2021-01-01: 5 full years by 2026-11-04; 10 years are completed on 2031-01-01.
- 中：自 2023-01-01 起连续合法居留，截至 2026-11-04 满 3 年；2033-01-01 满 10 年。
  - EN: Continuous lawful residence since 2023-01-01: 3 full years by 2026-11-04; 10 years are completed on 2033-01-01.
- 中：自 2020-01-01 起连续合法居留，截至 2026-11-04 满 6 年；2030-01-01 满 10 年。
  - EN: Continuous lawful residence since 2020-01-01: 6 full years by 2026-11-04; 10 years are completed on 2030-01-01.
- 中：自 2019-01-01 起连续合法居留，截至 2026-11-04 满 7 年；2029-01-01 满 10 年。
  - EN: Continuous lawful residence since 2019-01-01: 7 full years by 2026-11-04; 10 years are completed on 2029-01-01.
- 中：自 2024-06-01 起连续合法居留，截至 2026-11-04 满 2 年；2034-06-01 满 10 年。
  - EN: Continuous lawful residence since 2024-06-01: 2 full years by 2026-11-04; 10 years are completed on 2034-06-01.
- 中：自 2024-09-01 起连续合法居留，截至 2026-11-04 满 2 年；2034-09-01 满 10 年。
  - EN: Continuous lawful residence since 2024-09-01: 2 full years by 2026-11-04; 10 years are completed on 2034-09-01.
- 中：自 2016-09-01 起连续合法居留，已满 10 年。
  - EN: Continuous lawful residence since 2016-09-01: 10 years completed.
- 中：自 2015-06-01 起连续合法居留，已满 10 年。
  - EN: Continuous lawful residence since 2015-06-01: 10 years completed.
- 中：自 2016-04-06 起连续合法居留，已满 10 年。
  - EN: Continuous lawful residence since 2016-04-06: 10 years completed.
- 中：自 2021-04-06 起连续合法居留，截至 2026-11-04 满 5 年；2031-04-06 满 10 年。
  - EN: Continuous lawful residence since 2021-04-06: 5 full years by 2026-11-04; 10 years are completed on 2031-04-06.
- 中：自 2021-04-06 起连续合法居留，截至 2026-04-06 满 5 年；2031-04-06 满 10 年。
  - EN: Continuous lawful residence since 2021-04-06: 5 full years by 2026-04-06; 10 years are completed on 2031-04-06.
- 中：自 2023-04-06 起连续合法居留，截至 2026-04-06 满 3 年；2033-04-06 满 10 年。
  - EN: Continuous lawful residence since 2023-04-06: 3 full years by 2026-04-06; 10 years are completed on 2033-04-06.
- 中：自 2027-06-01 起连续合法居留，截至 2032-06-01 满 5 年；2037-06-01 满 10 年。
  - EN: Continuous lawful residence since 2027-06-01: 5 full years by 2032-06-01; 10 years are completed on 2037-06-01.
- 中：自 2027-03-01 起连续合法居留，截至 2030-01-01 满 2 年；2037-03-01 满 10 年。
  - EN: Continuous lawful residence since 2027-03-01: 2 full years by 2030-01-01; 10 years are completed on 2037-03-01.
- 中：自 2023-04-06 起连续合法居留，截至 2028-04-06 满 5 年；2033-04-06 满 10 年。
  - EN: Continuous lawful residence since 2023-04-06: 5 full years by 2028-04-06; 10 years are completed on 2033-04-06.
- 中：自 2024-06-06 起连续合法居留，已满 10 年。
  - EN: Continuous lawful residence since 2024-06-06: 10 years completed.
- 中：自 2021-02-01 起连续合法居留，截至 2026-02-01 满 5 年；2031-02-01 满 10 年。
  - EN: Continuous lawful residence since 2021-02-01: 5 full years by 2026-02-01; 10 years are completed on 2031-02-01.
- 中：自 2023-11-04 起连续合法居留，截至 2026-11-04 满 3 年；2033-11-04 满 10 年。
  - EN: Continuous lawful residence since 2023-11-04: 3 full years by 2026-11-04; 10 years are completed on 2033-11-04.
- 中：自 2021-03-01 起连续合法居留，截至 2026-03-01 满 5 年；2031-03-01 满 10 年。
  - EN: Continuous lawful residence since 2021-03-01: 5 full years by 2026-03-01; 10 years are completed on 2031-03-01.
- 中：自 2021-09-01 起连续合法居留，截至 2026-09-01 满 5 年；2031-09-01 满 10 年。
  - EN: Continuous lawful residence since 2021-09-01: 5 full years by 2026-09-01; 10 years are completed on 2031-09-01.
- 中：自 2023-05-01 起连续合法居留，截至 2026-05-01 满 3 年；2033-05-01 满 10 年。
  - EN: Continuous lawful residence since 2023-05-01: 3 full years by 2026-05-01; 10 years are completed on 2033-05-01.
- 中：自 2021-07-01 起连续合法居留，截至 2026-07-01 满 5 年；2031-07-01 满 10 年。
  - EN: Continuous lawful residence since 2021-07-01: 5 full years by 2026-07-01; 10 years are completed on 2031-07-01.

### 聚合假设 / Assessment assumptions（current-law-2026-11）

- 中：现行规则只建模 Skilled Worker 主申请人及其 dependent partner / child（Appendix Skilled Worker、Appendix Children）、Hong Kong BN(O) 主申请人（Appendix Hong Kong British National (Overseas)）、Global Talent 主申请人（Appendix Global Talent）、Appendix FM 伴侣（10 年路线按 Appendix Settlement Family Life，5 年路线按 Appendix FM）、持 refugee status 或 humanitarian protection 的主申请人（Appendix Settlement Protection）、UK Ancestry 主申请人（Appendix UK Ancestry）、Innovator Founder 主申请人（Appendix Innovator Founder）、Private Life 主申请人（Appendix Private Life）与 Long Residence（Appendix Long Residence）；Part Suitability、STP 2.1 的 suitability、担保方仍获批准（SW 24.1–24.2）等其他要求未建模。
  - EN: The current rules are modelled only for Skilled Worker main applicants and their dependent partners / children (Appendix Skilled Worker, Appendix Children), Hong Kong BN(O) main applicants (Appendix Hong Kong British National (Overseas)), Global Talent main applicants (Appendix Global Talent), Appendix FM partners (the 10-year route under Appendix Settlement Family Life, the 5-year route under Appendix FM), main applicants with refugee status or humanitarian protection (Appendix Settlement Protection), UK Ancestry main applicants (Appendix UK Ancestry), Innovator Founder main applicants (Appendix Innovator Founder), Private Life main applicants (Appendix Private Life) and Long Residence (Appendix Long Residence); other requirements, such as Part Suitability, suitability under STP 2.1 and the sponsor still being approved (SW 24.1–24.2), are not modelled.
- 中：Long Residence 10 年路径须英语 B1（LR 13.1(a)），未填写英语水平；"定居英语要求"一条按当前路线的等级核对。
  - EN: The 10-year Long Residence pathway requires English at B1 (LR 13.1(a)), and no English level has been provided; the settlement English requirement shown applies the current route’s level.
- 中：最早可申请日期按"自 2022-01-01 起持续居留、收入等状况不变、其余要求届时仍满足"推算，不是对未来的保证。
  - EN: The earliest application date is projected on the basis that residence continues from 2022-01-01, earnings and other circumstances stay the same, and the other requirements are still met then; it is not a guarantee about the future.
- 中：预计日期在 2027-03-26 之后，届时定居须达到英语 B2（SW 22A.1、LR 13.1(b)）。
  - EN: The projected date is on or after 2027-03-26, when settlement requires English at B2 (SW 22A.1, LR 13.1(b)).
- 中：最早可申请日期按"自 2019-11-01 起持续居留、收入等状况不变、其余要求届时仍满足"推算，不是对未来的保证。
  - EN: The earliest application date is projected on the basis that residence continues from 2019-11-01, earnings and other circumstances stay the same, and the other requirements are still met then; it is not a guarantee about the future.
- 中：最早可申请日期按"自 2024-01-01 起持续居留、收入等状况不变、其余要求届时仍满足"推算，不是对未来的保证。
  - EN: The earliest application date is projected on the basis that residence continues from 2024-01-01, earnings and other circumstances stay the same, and the other requirements are still met then; it is not a guarantee about the future.
- 中：最早可申请日期按"自 2023-01-01 起持续居留、收入等状况不变、其余要求届时仍满足"推算，不是对未来的保证。
  - EN: The earliest application date is projected on the basis that residence continues from 2023-01-01, earnings and other circumstances stay the same, and the other requirements are still met then; it is not a guarantee about the future.
- 中：预计日期在 2027-03-26 之后，届时定居须达到英语 B2（SETF 5.1(b)、LR 13.1(b)）。
  - EN: The projected date is on or after 2027-03-26, when settlement requires English at B2 (SETF 5.1(b), LR 13.1(b)).
- 中：最早可申请日期按"自 2019-01-01 起持续居留、收入等状况不变、其余要求届时仍满足"推算，不是对未来的保证。
  - EN: The earliest application date is projected on the basis that residence continues from 2019-01-01, earnings and other circumstances stay the same, and the other requirements are still met then; it is not a guarantee about the future.
- 中：预计日期在 2027-03-26 之后，届时定居须达到英语 B2（KoLL 2.2、LR 13.1(b)）。
  - EN: The projected date is on or after 2027-03-26, when settlement requires English at B2 (KoLL 2.2, LR 13.1(b)).
- 中：最早可申请日期按"自 2024-06-01 起持续居留、收入等状况不变、其余要求届时仍满足"推算，不是对未来的保证。
  - EN: The earliest application date is projected on the basis that residence continues from 2024-06-01, earnings and other circumstances stay the same, and the other requirements are still met then; it is not a guarantee about the future.
- 中：最早可申请日期按"自 2023-04-06 起持续居留、收入等状况不变、其余要求届时仍满足"推算，不是对未来的保证。
  - EN: The earliest application date is projected on the basis that residence continues from 2023-04-06, earnings and other circumstances stay the same, and the other requirements are still met then; it is not a guarantee about the future.
- 中：最早可申请日期按"自 2021-04-06 起持续居留、收入等状况不变、其余要求届时仍满足"推算，不是对未来的保证。
  - EN: The earliest application date is projected on the basis that residence continues from 2021-04-06, earnings and other circumstances stay the same, and the other requirements are still met then; it is not a guarantee about the future.
- 中：最早可申请日期按"自 2027-03-01 起持续居留、收入等状况不变、其余要求届时仍满足"推算，不是对未来的保证。
  - EN: The earliest application date is projected on the basis that residence continues from 2027-03-01, earnings and other circumstances stay the same, and the other requirements are still met then; it is not a guarantee about the future.

## 短路提示 / Short-circuit messages

- 中：申报了犯罪记录。Earned Settlement 下成年人的任何犯罪记录都会导致拒绝定居，现行规则下也取决于 Part Suitability 的具体情形；本工具不作结论，请咨询受监管的移民顾问。
  - EN: A criminal record has been declared. Under Earned Settlement any criminal record as an adult leads to refusal of settlement; under the current rules the outcome depends on the circumstances under Part Suitability. This tool does not reach a conclusion: please seek advice from a regulated immigration adviser.
- 中：当前路线属 Legacy Safe and Legal Routes（2027-04-06 前经 UK Resettlement Scheme 抵达），不在 Earned Settlement 框架内，继续按该群体现有的定居安排（SRC-001 p25–p26）；强化的犯罪记录要求仍适用。英语等级原文不一致：框架外群体一般须 B2（p25–p26），第 7 章又说 UK Resettlement Scheme 难民只需 A2（p37、p39），见 PD-045。
  - EN: The current route is a Legacy Safe and Legal Route (arrival through the UK Resettlement Scheme before 2027-04-06), outside the Earned Settlement framework, and keeps the existing settlement arrangements for that group (SRC-001 p25–p26). The strengthened criminality requirements still apply. The English level is inconsistent: groups outside the framework generally need B2 (p25–p26), while Chapter 7 says UK Resettlement Scheme refugees only need A2 (p37, p39); see PD-045.
- 中：当前以 dependant 身份持保护类路线许可。Earned Settlement 的难民定居路径（SRC-001 Chapter 7、Table 2）没有说明难民的 dependant 如何定居（PD-067），本工具不作结论，请咨询受监管的移民顾问。
  - EN: The current permission is on a protection route as a dependant. The Earned Settlement refugee pathways (SRC-001 Chapter 7, Table 2) do not say how refugees’ dependants settle (PD-067). This tool does not reach a conclusion: please seek advice from a regulated immigration adviser.
- 中：当前路线不在 Earned Settlement 框架内，继续按该群体现有的定居安排（SRC-001 p25–p26）；但强化的犯罪记录与 B2 英语要求仍适用，除非有现有豁免或保障。
  - EN: The current route is outside the Earned Settlement framework and keeps the existing settlement arrangements for that group (SRC-001 p25–p26). The strengthened criminality and B2 English requirements still apply, unless an existing exemption or protection applies.
