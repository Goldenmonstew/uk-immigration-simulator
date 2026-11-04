# 面向用户文案中英对照（2026-11）

由 `pnpm --filter @uk-immigration/engine export:wording` 生成（`packages/engine/test/export-wording.test.ts`），请勿手改。

收集范围：`test/helpers.ts` 的 6 个样例上下文（每条规则单独跑一遍 + 整体评估）与 14 个 fixtures，各按 zh-CN 与 en 运行一次；按规则 ID 分节，句子去重，按首次出现排序。样例跑不到的分支不在其中。

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

### ES-ENGLISH-B2：英语达到 B2 / English at B2

来源：SRC-001 p21

待定细节：PD-019

- 中：英语 B2，达到 B2。
  - EN: English at B2, which meets B2.
- 中：未填写英语水平。Earned Settlement 要求 CEFR B2（现有豁免保留）。
  - EN: English level not provided. Earned Settlement requires CEFR B2 (existing exemptions are retained).
- 中：英语 B1，低于 Earned Settlement 要求的 B2。这是强制要求，不能用收入或其他贡献抵消。
  - EN: English at B1, below the B2 required by Earned Settlement. This is a mandatory requirement and cannot be offset by earnings or other contributions.
- 中：申请日未满 18 岁或已满 65 岁，豁免英语要求。
  - EN: Under 18 or aged 65 or over on the date of application: exempt from the English requirement.

### ES-KOL：通过 Life in the UK 考试 / Pass the Life in the UK test

来源：SRC-001 p21

待定细节：PD-020

- 中：已通过 Life in the UK 考试。
  - EN: Passed the Life in the UK test.
- 中：未填写是否已通过 Life in the UK 考试。
  - EN: Not provided whether the Life in the UK test has been passed.
- 中：申请日未满 18 岁或已满 65 岁，豁免 Life in the UK 考试。
  - EN: Under 18 or aged 65 or over on the date of application: exempt from the Life in the UK test.

### ES-ROUTE-GROUP：当前路线计入定居 / Current route counts towards settlement

来源：SRC-001 p23；SRC-001 p24；SRC-001 p25；SRC-001 p26

待定细节：PD-022、PD-023

- 中：当前路线"技术工作者"属核心许可 / 高技能人才分组，计入定居。
  - EN: The current route, Skilled Worker, is in the Core permission / High talent groups and counts towards settlement.
- 中：当前路线"学生"是临时路线，不计入定居；转入计入的路线后才开始累计。
  - EN: The current route, Student, is a temporary route and does not count towards settlement; time starts to count only after switching to a counting route.
- 中：当前路线"家庭伴侣或父母"属核心许可 / 英国联系分组，计入定居。
  - EN: The current route, Family Partner or Parent, is in the Core permission / British connection groups and counts towards settlement.
- 中：当前路线"家庭与私人生活"属家庭与私人生活分组，计入定居。Family and Private Life 路线只能走 10 年或 20 年路径。
  - EN: The current route, Family and Private Life, is in the Family and Private Life group and counts towards settlement. Family and Private Life routes can only use the 10 or 20-year pathways.

### ES-RESIDENCE：计入定居的连续居留 / Continuous residence counting towards settlement

来源：SRC-001 p22；SRC-001 p23；SRC-001 p24；SRC-001 p25；SRC-008 CR 3.1

待定细节：PD-022、PD-023、PD-025、PD-053、PD-054

- 中：计入定居的连续居留自 2019-11-01 起，截至 2026-11-04 满 7 年。
  - EN: Continuous residence counting towards settlement since 2019-11-01: 7 full years by 2026-11-04.
- 中：计入定居的连续居留自 2022-01-01 起，截至 2026-11-04 满 4 年。有缺席在任意 12 个月内超过 180 天，连续居留中断，自 2022-01-01 重新起算。
  - EN: Continuous residence counting towards settlement since 2022-01-01: 4 full years by 2026-11-04. Absences exceed 180 days in a 12-month period, so continuous residence is broken and restarts from 2022-01-01.
- 中：Earned Settlement 的缺席口径未公布，假设沿用现行 Appendix Continuous Residence CR 3.1（任意 12 个月不超过 180 天，出境与入境当日都计入缺席）（PD-054）。
  - EN: How absences count under Earned Settlement has not been published; assumed to follow the current Appendix Continuous Residence CR 3.1 (no more than 180 days in any 12-month period, with the days of departure and return both counted as absence) (PD-054).
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
- 中：计入定居的连续居留自 2023-04-06 起，截至 2028-04-06 满 5 年。
  - EN: Continuous residence counting towards settlement since 2023-04-06: 5 full years by 2028-04-06.
- 中：计入定居的连续居留自 2023-04-06 起，截至 2028-04-06 满 5 年。10 年路径的居留还不够，2033-04-06 满 10 年。
  - EN: Continuous residence counting towards settlement since 2023-04-06: 5 full years by 2028-04-06. Not enough residence yet for the 10-year pathway; 10 years are completed on 2033-04-06.
- 中：计入定居的连续居留自 2025-06-06 起，截至 2035-06-06 满 10 年。此前在"毕业生"路线的时间不计入定居；本工具假设不计入路线的时间同时打断连续居留，而不只是从合格期中扣除（PD-053）。
  - EN: Continuous residence counting towards settlement since 2025-06-06: 10 full years by 2035-06-06. The earlier time on Graduate does not count towards settlement; this tool assumes that time on a non-counting route also breaks continuous residence, rather than only being deducted from the qualifying period (PD-053).
- 中：此前在"毕业生"路线的时间不计入定居；本工具假设不计入路线的时间同时打断连续居留，而不只是从合格期中扣除（PD-053）。
  - EN: The earlier time on Graduate does not count towards settlement; this tool assumes that time on a non-counting route also breaks continuous residence, rather than only being deducted from the qualifying period (PD-053).

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

### ES-BRITISH-CONNECTION：British connection（5 年路径） / British connection (5-year pathway)

来源：SRC-001 p18

待定细节：无

- 中：不属于 British citizen 家属路线或 UK Ancestry，不走这条 5 年路径。
  - EN: Not on a British citizen family route or UK Ancestry, so this 5-year pathway does not apply.
- 中：以 British citizen 的伴侣、父母或子女身份持家庭签证，属 recognised British connection，可走 5 年路径。
  - EN: Holds a family visa as the partner, parent or child of a British citizen, a recognised British connection: the 5-year pathway is available.

### ES-PUBLIC-FUNDS：申请前 5 年未使用 public funds / No public funds in the 5 years before applying

来源：SRC-001 p18；SRC-006 #benefits-open-to-new-claims；SRC-006 #contributory-benefits-and-statutory-payments

待定细节：PD-013、PD-014、PD-047

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
- 中：2021-11-04 以来领取过 Universal Credit，属 public funds。3 / 5 / 10 年路径要求申请前 5 年未使用 specified public funds，否则须在 qualifying route 上满 20 年。若此后不再使用，自 2028-10-01 起回看期内不再有 public funds，可按较短路径重新评估。
  - EN: Public funds received since 2021-11-04: Universal Credit. The 3 / 5 / 10-year pathways require no use of specified public funds in the 5 years before applying; otherwise 20 years on a qualifying route are needed. If they are not used again, the lookback contains no public funds from 2028-10-01, and the shorter pathways can be reassessed.

### ES-BREACH：成年后无 qualifying immigration breach / No qualifying immigration breach as an adult

来源：SRC-001 p13

待定细节：PD-015、PD-016、PD-044

- 中：成年后无 qualifying immigration breach。
  - EN: No qualifying immigration breach as an adult.
- 中：成年后有 qualifying immigration breach（逾期停留），不论收入多高都进入 20 年路径。
  - EN: Qualifying immigration breach as an adult (Overstaying): the 20-year pathway applies however high the earnings.
- 中：20 年按在 qualifying route 上的连续居留计算，违规不设时效（PD-016）。
  - EN: The 20 years count continuous residence on a qualifying route; breaches do not expire (PD-016).

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
- 中：最早可申请日期按"自 2015-06-01 起持续居留、收入等状况不变、其余要求届时仍满足"推算，不是对未来的保证。
  - EN: The earliest application date is projected on the basis that residence continues from 2015-06-01, earnings and other circumstances stay the same, and the other requirements are still met then; it is not a guarantee about the future.
- 中：自 2021-04-06 起连续持 Skilled Worker 许可，早于 2024-04-04，属"2024 年 4 月前群体"：可按现有薪资条件续签至 2035 年（p44，具体日期未定，PD-040）；本工具按标准路径计算定居年限。
  - EN: Continuous Skilled Worker permission since 2021-04-06, before 2024-04-04, so in the “pre-April 2024 cohort”: permission can be extended under the existing salary requirements until 2035 (p44; exact dates not set, PD-040). This tool calculates the settlement pathway under the standard pathways.
- 中：最早可申请日期按"自 2023-04-06 起持续居留、收入等状况不变、其余要求届时仍满足"推算，不是对未来的保证。
  - EN: The earliest application date is projected on the basis that residence continues from 2023-04-06, earnings and other circumstances stay the same, and the other requirements are still met then; it is not a guarantee about the future.
- 中：原文未规定同时符合过渡安排与标准路径时如何取舍；本结果取满足条件的最短路径，申请人可能可以选择更有利的安排，需咨询受监管顾问。
  - EN: The response does not say how to choose when someone qualifies for both a transitional arrangement and a standard pathway; this result takes the shortest pathway whose conditions are met. The applicant may be able to choose a more favourable arrangement and should seek regulated advice.
- 中：自 2023-04-06 起连续持 Skilled Worker 许可，早于 2024-04-04，属"2024 年 4 月前群体"：可按现有薪资条件续签至 2035 年（p44，具体日期未定，PD-040）；本工具按标准路径计算定居年限。
  - EN: Continuous Skilled Worker permission since 2023-04-06, before 2024-04-04, so in the “pre-April 2024 cohort”: permission can be extended under the existing salary requirements until 2035 (p44; exact dates not set, PD-040). This tool calculates the settlement pathway under the standard pathways.

## current-law-2026-11

### CL-SCOPE：在现行规则的建模范围内 / Within the scope of the modelled current rules

来源：SRC-004 SW 21.1；SRC-004 SW 39.1；SRC-004 SW 41A.1；SRC-005 LR 11.1

待定细节：无

- 中：当前持 Skilled Worker 主申请人许可，按 Appendix Skilled Worker 与 Appendix Long Residence 评估。
  - EN: Currently holds Skilled Worker permission as the main applicant; assessed under Appendix Skilled Worker and Appendix Long Residence.
- 中：现行规则只建模了 Skilled Worker（主申请人及其 dependent partner / child）与 Long Residence；当前路线不在其中，也不满足 Long Residence 的 10 年，无法判断其他路线的定居条件。
  - EN: The current rules are modelled only for Skilled Worker (main applicants and their dependent partners / children) and Long Residence; the current route is neither, and the 10 years for Long Residence are not met, so the settlement requirements of other routes cannot be assessed.
- 中：已满 10 年连续合法居留，按 Appendix Long Residence 评估。
  - EN: 10 years of continuous lawful residence completed; assessed under Appendix Long Residence.
- 中：当前持 Skilled Worker 的 dependent partner 许可，按 Appendix Skilled Worker 的伴侣定居要求（SW 38–SW 46）与 Appendix Long Residence 评估。
  - EN: Currently holds Skilled Worker permission as a dependent partner; assessed under the partner settlement requirements of Appendix Skilled Worker (SW 38–SW 46) and Appendix Long Residence.
- 中：当前持 Skilled Worker 的 dependent child 许可，按 Appendix Skilled Worker 的子女定居要求（SW 38–SW 46、Appendix Children）与 Appendix Long Residence 评估。
  - EN: Currently holds Skilled Worker permission as a dependent child; assessed under the child settlement requirements of Appendix Skilled Worker (SW 38–SW 46, Appendix Children) and Appendix Long Residence.

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
- 中：未申报是否在 Immigration Salary List 上；SOC 6135 在清单职业表中，按职业代码推导为在清单上。清单对岗位 / 地区的限制（criteria）未核对，可在问卷里申报覆盖。
  - EN: Not declared whether the job is on the Immigration Salary List; SOC 6135 is in the list’s occupation table, so the job is derived to be on the list from its occupation code. The list’s job / region restrictions (criteria) are not checked; a declaration in the questionnaire overrides this.
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
- 中：按 SW 24.3 row D（岗位在 Immigration Salary List 上，且SOC 6135 属 Health and Care ASHE salary job（SW A1.1）），general salary 门槛 £25,000；当前年薪 £30,000，已达到。
  - EN: Under SW 24.3 row D (the job is on the Immigration Salary List, and SOC 6135 is a Health and Care ASHE salary job (SW A1.1)), the general salary threshold is £25,000; the current salary of £30,000 meets it.
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

### CL-ENGLISH：定居英语要求 / Settlement English requirement

来源：SRC-004 SW 22A.1；SRC-004 SW 44.1；SRC-007 p24；SRC-005 LR 13.1；SRC-014 EL 1.1

待定细节：无

- 中：申请日早于 2027-03-26，Appendix Skilled Worker 未对定居另设英语要求（SW 22A.1 的 B2 只适用于此后的申请）。
  - EN: The application date is before 2027-03-26, and Appendix Skilled Worker sets no separate English requirement for settlement (the B2 in SW 22A.1 applies only to later applications).
- 中：英语 B2，达到定居要求的 B1。
  - EN: English at B2, which meets the B1 required for settlement.
- 中：申请日未满 18 岁或已满 65 岁，豁免英语要求。
  - EN: Under 18 or aged 65 or over on the date of application: exempt from the English requirement.
- 中：英语 B2，达到定居要求的 B2。
  - EN: English at B2, which meets the B2 required for settlement.

### CL-KOL：通过 Life in the UK 考试 / Pass the Life in the UK test

来源：SRC-004 SW 23.1；SRC-004 SW 45.1；SRC-005 LR 14.1；SRC-015 KOL 1.1；SRC-015 KOL 2.1

待定细节：无

- 中：已通过 Life in the UK 考试。
  - EN: Passed the Life in the UK test.
- 中：未填写是否已通过 Life in the UK 考试。
  - EN: Not provided whether the Life in the UK test has been passed.
- 中：申请日未满 18 岁或已满 65 岁，豁免 Life in the UK 考试。
  - EN: Under 18 or aged 65 or over on the date of application: exempt from the Life in the UK test.

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
- 中：自 2023-04-06 起连续合法居留，截至 2028-04-06 满 5 年；2033-04-06 满 10 年。
  - EN: Continuous lawful residence since 2023-04-06: 5 full years by 2028-04-06; 10 years are completed on 2033-04-06.
- 中：自 2024-06-06 起连续合法居留，已满 10 年。
  - EN: Continuous lawful residence since 2024-06-06: 10 years completed.

### 聚合假设 / Assessment assumptions（current-law-2026-11）

- 中：现行规则只建模 Skilled Worker 主申请人及其 dependent partner / child（Appendix Skilled Worker、Appendix Children）与 Long Residence（Appendix Long Residence）；Part Suitability、担保方仍获批准（SW 24.1–24.2）等其他要求未建模。
  - EN: The current rules are modelled only for Skilled Worker main applicants and their dependent partners / children (Appendix Skilled Worker, Appendix Children) and for Long Residence (Appendix Long Residence); other requirements, such as Part Suitability and the sponsor still being approved (SW 24.1–24.2), are not modelled.
- 中：最早可申请日期按"自 2022-01-01 起持续居留、收入等状况不变、其余要求届时仍满足"推算，不是对未来的保证。
  - EN: The earliest application date is projected on the basis that residence continues from 2022-01-01, earnings and other circumstances stay the same, and the other requirements are still met then; it is not a guarantee about the future.
- 中：预计日期在 2027-03-26 之后，届时定居须达到英语 B2（SW 22A.1、LR 13.1(b)）。
  - EN: The projected date is on or after 2027-03-26, when settlement requires English at B2 (SW 22A.1, LR 13.1(b)).
- 中：最早可申请日期按"自 2019-11-01 起持续居留、收入等状况不变、其余要求届时仍满足"推算，不是对未来的保证。
  - EN: The earliest application date is projected on the basis that residence continues from 2019-11-01, earnings and other circumstances stay the same, and the other requirements are still met then; it is not a guarantee about the future.
- 中：最早可申请日期按"自 2023-04-06 起持续居留、收入等状况不变、其余要求届时仍满足"推算，不是对未来的保证。
  - EN: The earliest application date is projected on the basis that residence continues from 2023-04-06, earnings and other circumstances stay the same, and the other requirements are still met then; it is not a guarantee about the future.
- 中：最早可申请日期按"自 2021-04-06 起持续居留、收入等状况不变、其余要求届时仍满足"推算，不是对未来的保证。
  - EN: The earliest application date is projected on the basis that residence continues from 2021-04-06, earnings and other circumstances stay the same, and the other requirements are still met then; it is not a guarantee about the future.

## 短路提示 / Short-circuit messages

- 中：申报了犯罪记录。Earned Settlement 下成年人的任何犯罪记录都会导致拒绝定居，现行规则下也取决于 Part Suitability 的具体情形；本工具不作结论，请咨询受监管的移民顾问。
  - EN: A criminal record has been declared. Under Earned Settlement any criminal record as an adult leads to refusal of settlement; under the current rules the outcome depends on the circumstances under Part Suitability. This tool does not reach a conclusion: please seek advice from a regulated immigration adviser.
