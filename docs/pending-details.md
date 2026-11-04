# 政府未定事项登记表（Pending Details）

> 范围：Earned Settlement 框架中，政府在官方回应里**明确推迟**、**尚未规定**或**文内自相矛盾**的事项。规则引擎遇到这些事项时输出 `UNKNOWN`（或按本表声明假设），不得自行补全。
>
> 唯一来源：SRC-001，《A Fairer Pathway to Settlement: Government Response to the Consultation》（CP 1707，2026-11），归档于 `policy-sources/2026-11-02-cp1707-a-fairer-pathway-to-settlement-government-response.pdf`。
>
> 登记日期：2026-11-04。维护：Opus（规则语义）。

## 页码约定

- 表中 `p<N>` 一律指 **PDF 页序**：封面为 p1，按 `pdftotext -layout` 输出的换页符切分计数。
- 该 PDF 实际为 **62 页**（`pdfinfo` 结果），不是 `SOURCES.md` 与任务 brief 写的 60 页：p2 为空白页，p60–p61 为空白页，p62 为封底条码。
- 文档内印刷页码 = PDF 页序 − 4（印刷第 1 页即目录页 = p5）。
- **注意**：`docs/00-project-analysis-and-plan.md` §3 与任务 brief 中引用的页码比 PDF 页序**小 1**（疑似计数时跳过了空白的 p2）。例如 brief 的 "p14 至少 3 年" 在本表为 p15，"p45 Table 1" 在本表为 p46，"p40 过渡一般原则" 在本表为 p41。本表全部按 PDF 页序重新核对。

## 字段说明

- **原文怎么说**：自己的话概括，不超过 2 句；不是引文。
- **对引擎的影响**：什么输入组合下输出 `UNKNOWN`；在不输出 `UNKNOWN` 的地方，必须在结果页声明的假设。
- **预计何时明确**：只写原文给出的时间点；原文没说写"原文未提及"。
- "原文未提及"表示 SRC-001 中找不到相关表述，不代表政府不会规定。

## 一、明确推迟或尚未规定的事项

### A. 实施与总体

| ID | 事项 | 原文怎么说 | 出处 | 对引擎的影响 | 预计何时明确 |
|---|---|---|---|---|---|
| PD-001 | 技术与操作指引 | 实施前政府会发布进一步指引，补充技术和操作层面的细节，并会继续与受影响群体沟通。 | p10 | 所有依赖操作细节的判断（证据形式、计算口径、豁免认定）在指引发布前都只能基于本回应文件；结果页统一声明"规则依据为政府回应文件，非已生效的 Immigration Rules"。 | 实施前（p10），具体日期原文未提及 |
| PD-002 | 完整影响评估（Impact Assessment） | 完整影响评估将在实施时一并发布；咨询结果详情与 Targeted Research 已随回应发布。 | p54；p9 | 不影响资格判断。影响评估、咨询结果与 Targeted Research 均未在 `SOURCES.md` 登记，引擎不得引用其中数字。 | 随实施发布（p54） |
| PD-003 | 实施时间表 | PDF 内没有 Earned Settlement 的生效日期或分阶段时间表；文内出现的具体日期只有 2026-03-02（庇护申请分界）、2027-02-01（care worker 失去担保的宽限期）、2027-04-06（Legacy URS 分界）、2035（2024 前 Skilled Worker 续签期限）。议会陈述（2026-11-04 核实）：下议院称改动从 2026 年 12 月的那批 Immigration Rules 修改开始提交、2027 年内实施（SRC-002 col 593）；上议院称第一阶段 12 月开始、2027 年 1 月生效，2027、2028 年还有进一步修改（SRC-003 cols 1423–1424）。 | p26、p38、p43、p44；SRC-002 col 593；SRC-003 cols 1423–1424 | 两院说法给出了大致时间表，但没有生效日，也没说哪些要求进入第一阶段。Earned Settlement 规则集不设 `effectiveFrom`，按"假设在申请日适用"评估；每个 Earned Settlement 结果都附上述时间表作为假设。`POLICY_NOT_YET_IN_FORCE` 在 Statement of Changes 给出生效日之前不使用。 | 首批规则修改 2026-12 起提交（SRC-002、SRC-003）；生效日以届时的 Statement of Changes 为准 |
| PD-004 | 新要求对实施前事件的追溯 | 原文只说申请按决定日有效的规则审理、在英不代表有权按旧规则定居；没有说实施前发生的 immigration breach、public funds 使用、犯罪记录是否按新标准计入。 | p41 | 申请人在规则生效前有 breach / public funds 使用 / 轻微犯罪记录时，"是否适用新后果"输出 `UNKNOWN`；如要给出结论，假设为"按决定日规则整体回看，含实施前事件"并声明。 | 原文未提及 |

### B. Contribution（收入、公共服务、家庭收入、public funds）

| ID | 事项 | 原文怎么说 | 出处 | 对引擎的影响 | 预计何时明确 |
|---|---|---|---|---|---|
| PD-005 | qualifying earnings 的定义 | 原文只用 "earn / earnings" 描述门槛，没有定义哪些收入计入（工资、奖金、自雇利润、股息、海外收入、多份工作合计等），也没有说是税前还是税后。 | p15、p16、p46 | 用户收入构成只有英国雇佣工资时，按"税前年收入"计算并声明假设；含自雇、股息、海外收入或奖金占比显著时，"是否达标"输出 `UNKNOWN`。 | 原文未提及（推定在 PD-001 指引中） |
| PD-006 | 收入年度口径与证据形式 | 原文说按申请前若干 "years" 计算 best years，但没有说是 tax year 还是滚动 12 个月，也没有说用何种证据（如 HMRC 记录）。 | p16 | 引擎按英国 tax year 录入与计数，并声明假设；申请日与 tax year 不对齐导致年度归属不同时，相关年份标注 `UNKNOWN`。证据形式不建模。 | 原文未提及 |
| PD-007 | 门槛变动后各年份用哪个门槛 | 门槛与所得税门槛挂钩、会随之变动，但没有说历史年份按当年门槛还是申请时门槛比较。 | p15 | 门槛走 `packages/policy-data` 按 tax year 版本化的参数；比较口径默认"按该年度当年门槛"并声明假设；两种口径结论不同时输出 `UNKNOWN`。 | 原文未提及 |
| PD-008 | 苏格兰纳税人的门槛 | Annex B 把 £50,271 与 £125,141 描述为 England 的 higher / additional rate 门槛；正文与 Table 1 只给数字，未说明苏格兰税率带不同时如何处理。 | p52；p15；p46 | 统一使用 Table 1 的数字，并对苏格兰纳税人声明"按原文数字，未按苏格兰税率带调整"的假设。 | 原文未提及 |
| PD-009 | 收入要求豁免的完整范围 | 豁免"将包括"儿童、65 岁及以上、因身心状况无法满足者；用的是 "will include"，未说是否穷尽，也未说身心状况如何认定。 | p15 | 只对这三类豁免建模；用户声明其他理由（如全职照护者）时输出 `UNKNOWN`；身心状况豁免由用户自报并声明"未核实认定标准"。 | 原文未提及 |
| PD-010 | 家庭合并收入的适用条件 | 合格的伴侣可合并收入达到 £25,142，须为 genuine and subsisting 关系，且只能一方依赖另一方收入；"eligible couples" 未定义。 | p17 | 两人是否为 "eligible couple"（例如伴侣不在英、伴侣持其他路线、未婚伴侣）输出 `UNKNOWN`，仅对"同一申请中的主申请人 + 伴侣 dependant"给结论；是否要求同一组 best years 合并，默认"同年合并"并声明。 | 原文未提及 |
| PD-011 | Highest Talent Group 的范围与资格 | Table 1 把 "通过 Highest Talent Group" 列为 3 年路径的方式之一，但注 16 说该项待 MAC 报告审查；正文只在注 10 列出 "high talent permission" 路线，没说怎样凭此进入 3 年路径。 | p46 注 16；p23 注 10 | 3 年路径只按 £125,141（4 年中 3 年）计算；凭 Highest Talent Group 走 3 年一律输出 `UNKNOWN`。注 10 中 Global Talent / Innovator Founder 须"最近一次许可即为该路线"的条件照常建模。 | MAC 报告后，日期原文未提及 |
| PD-012 | 公共服务 5 年路径的工作年限要求 | 正文说 Annex C 职业的合格人员 5 年可定居；Table 1 表述为"在合格公共服务职业工作满 5 年"。未说明中途换入 / 换出合格职业、或部分年份在非合格职业时怎样计算。 | p16；p46 注 17；p58–p59 | 5 年全部在 Annex C 职业内 → 适用；有任何非 Annex C 年份 → `UNKNOWN`（并另按收入路径计算供参考）。 | 原文未提及 |
| PD-013 | specified public funds 的最终范围与弱势群体豁免 | 先沿用现行 public funds 定义；之后政府再决定哪些福利计入、哪些弱势群体可获保障或豁免，细节在实施前公布。 | p18 | 以现行定义（SOURCES.md SRC-006）为假设判断；用户属于可能的弱势群体（残障、家暴受害者等）且用过 public funds 时，"是否触发 20 年"输出 `UNKNOWN`。 | 实施前（p18） |
| PD-014 | 伴侣使用 public funds 是否影响申请人 | 原文只说申请人本人在申请前 5 年不应使用 specified public funds；未说明家庭成员（伴侣、子女）领取的福利是否计入。 | p18 | 仅申请人本人使用 → 按 PD-013 判断；仅伴侣 / 子女使用 → `UNKNOWN`。 | 原文未提及 |

### C. Character（犯罪、债务、违规）

| ID | 事项 | 原文怎么说 | 出处 | 对引擎的影响 | 预计何时明确 |
|---|---|---|---|---|---|
| PD-015 | qualifying immigration breach 的完整清单 | 清单将在 Immigration Rules 中列明，"将包括" 逾期居留、违反许可条件、申请中欺骗、妨碍移民管制；仅适用于成年后发生的违规。 | p13 | 四类已列明违规（成年后）→ 20 年路径；其他类型违规输出 `UNKNOWN`；违规发生时是否已满 18 岁不明 → `UNKNOWN`。 | 随 Immigration Rules 发布，日期原文未提及 |
| PD-016 | 违规后 20 年的起算与回看期 | 原文说成年违规会使申请人进入 20 年路径；未说 20 年从何时起算，也未说违规有无时效（多久以前的违规不再计入）。 | p13；p46 | 按 Table 1 的写法假设"在 qualifying route 上累计满 20 年"，不设时效，并声明假设。 | 原文未提及 |
| PD-017 | 犯罪记录要求中的酌情空间 | 成年人在英有任何犯罪记录即拒绝；但海外定罪在法律体系差异情形下、以及未满 18 岁时的犯罪，保留酌情处理。未提及犯罪记录有无时效（如 spent convictions）。 | p12 | 英国境内成年后犯罪记录 → 拒绝（不设时效，声明假设）；海外定罪且行为在英是否构成犯罪不明 → `UNKNOWN`；未满 18 岁时的犯罪 → `UNKNOWN`（酌情）。 | 原文未提及 |
| PD-018 | Government debt 的范围与还款计划 | 无欠政府债务是强制要求，"将包括" NHS 债务、税款与 NI 欠款、欠 Home Office 的诉讼费用；只有 asylum support 偿还明确允许"遵守还款计划"。未提及金额下限。 | p12；p8 注 1；p39 | 有未清偿的列明债务 → 拒绝；非 asylum support 债务正在按还款计划偿还 → `UNKNOWN`；其他类型政府债务 → `UNKNOWN`。 | 原文未提及 |

### D. Integration（英语、Life in the UK）

| ID | 事项 | 原文怎么说 | 出处 | 对引擎的影响 | 预计何时明确 |
|---|---|---|---|---|---|
| PD-019 | B2 英语要求的生效日期 | B2 成为定居的标准英语要求，现有豁免（儿童、65 岁及以上、身心状况）保留；文内未给生效日期。SRC-007（HC 1691）核实（2026-11-04）：现行 Rules 已规定申请日 ≥ 2027-03-26 的定居申请须 B2，覆盖 Skilled Worker（SW 22A.1）、Long Residence（LR 13.1(b)）等多条路线（EM 5.60–5.62）。 | p21；SRC-007 p24、EM 5.60–5.62；SRC-004 SW 22A.1；SRC-005 LR 13.1 | Earned Settlement 栏：按规则集的口径，B2 视为在申请日适用（`ES-ENGLISH-B2`），Earned Settlement 自身的 B2 生效日仍未知（同 PD-003）。现行法律栏（`CL-ENGLISH`）：申请日 ≥ 2027-03-26 一律 B2；之前 Long Residence 为 B1，Skilled Worker 主申请人的定居规则不另设英语要求。因 2027-03-26 起现行规则也要求 B2，此后的申请两栏结论一致。 | 现行规则：2027-03-26（已定）；Earned Settlement：原文未提及 |
| PD-020 | Life in the UK 考试改版 | 考试要求与现有豁免继续，政府正在审查考试内容使其更贴合当代英国。 | p21 | 不影响"是否需要考试"的判断；考试版本不建模。 | 原文未提及 |
| PD-021 | A2 版 Life in the UK 考试（UK Resettlement Scheme 难民） | URS 难民只需 A2 英语，并在出现合适的 A2 版考试前免考。 | p9 注 3；p21 注 8；p39 | URS 难民：Life in the UK = 当前免考，结果页注明"A2 版考试推出后可能改变"；推出日期 `UNKNOWN`。 | 原文未提及 |

### E. Residence（路线计入与组合）

| ID | 事项 | 原文怎么说 | 出处 | 对引擎的影响 | 预计何时明确 |
|---|---|---|---|---|---|
| PD-022 | Leave Outside the Rules（LOTR）群体 | LOTR 被列入"不计入定居"的路线，但注 12 承认部分 LOTR 是否本意通向定居并不清楚，政府将进一步考虑并适时公布做法。 | p24 注 12 | 任何 LOTR 时间：计入与否输出 `UNKNOWN`，不按"不计入"直接给结论。 | "in due course"，日期原文未提及 |
| PD-023 | 两张路线清单之外的路线 | 原文给出"计入"与"不计入"两张清单，并在注 9、10 中定义 core / high talent permission；未声明清单是否穷尽现行 Immigration Rules 的全部路线。 | p23 注 9、10；p24 | 路线分类表只收录两张清单与注脚中点名的路线；其余路线（例如 Domestic Worker in a Private Household、Adult Dependent Relative 等原文未点名的路线）一律输出 `UNKNOWN`。 | 原文未提及 |
| PD-024 | Long Residence 关闭的时点与在途者 | Long Residence 路线将关闭，临时路线时间不再因累计满 10 年而计入；未给关闭日期，也没有为已在累计 Long Residence 的人设专门过渡。 | p23；p41 | 关闭日期 = `UNKNOWN`（同 PD-003）；在途者按 p41 一般原则（按决定日规则）处理，并在结果页提示"原文无针对性过渡安排"。 | 原文未提及 |
| PD-025 | 路线组划分（切换即重新起算） | 保护类或人权类路线（例如难民、Article 8）的时间不能与工作或家庭路线合并，换组时新路径重新起算；未列出各路线分属哪一组。 | p25 | Family and Private Life 内部（Appendix FM 伴侣 vs Article 8 private life）之间切换是否重置，输出 `UNKNOWN`；工作 ↔ 保护的切换按重置建模。 | 原文未提及 |

### F. Dependants

| ID | 事项 | 原文怎么说 | 出处 | 对引擎的影响 | 预计何时明确 |
|---|---|---|---|---|---|
| PD-026 | 18–24 岁 dependant 的条件 | 保留 child-dependant 身份的 18–24 岁青年可随家庭定居，满足成人强制要求但免个人收入要求；案例称其只能在"父母双方"都定居时随同定居。 | p29；p31 | "保留 child-dependant 身份"的认定不建模，由用户自报；单亲家庭或仅一方父母定居的情形输出 `UNKNOWN`。 | 原文未提及 |

### G. 弱势群体与框架外群体

| ID | 事项 | 原文怎么说 | 出处 | 对引擎的影响 | 预计何时明确 |
|---|---|---|---|---|---|
| PD-027 | 弱势群体的详细安排 | 政府将与受影响群体及相关机构沟通，详细安排在明年的指引中公布；这些群体"在适当情况下"仍须满足强化的犯罪与英语要求。 | p33；p34；p26 | 框架外弱势群体（丧偶伴侣、UASC、local authority care 儿童、在英长大的青年、家暴受害者）：短路到"现行安排"，但"是否须满足 B2 / 新犯罪要求"输出 `UNKNOWN`。 | 原文 "next year"，即 2027 年（以回应发布于 2026-11 推算） |
| PD-028 | 强化要求对 Afghan schemes 与 Windrush 的适用 | 框架外一节开头概括说这些路线上的个人须满足强化的犯罪与 B2 要求（除非有现有豁免或保障）；而 Afghan schemes 为按资格立即定居，Windrush 为确认既有身份，二者如何叠加强化要求，原文没有逐项说明。 | p25；p26 | Afghan schemes 与 Windrush：短路到现行安排；"是否须满足强化要求"输出 `UNKNOWN`。 | 原文未提及 |

### H. 难民（MVP-0 不做，路线枚举需保留）

| ID | 事项 | 原文怎么说 | 出处 | 对引擎的影响 | 预计何时明确 |
|---|---|---|---|---|---|
| PD-029 | Protection Work and Study 推出前已在英的时间 | 对于 Protection Work and Study 推出前已获保护身份的人，政府将进一步说明已在英时间是否以及如何计入。 | p38 | 此类用户的已有时间是否计入输出 `UNKNOWN`（另见 PD-043 的文内矛盾）。 | 原文未提及 |
| PD-030 | Protection Work and Study 的 contribution 口径 | 通过工作证明 contribution 的须在三个 qualifying years 内年收入达 £12,571；未定义三年的观察窗口，也未定义"sustained work, education or training"及教育 / 培训者的 contribution 标准。 | p38；p47 | 工作年份计数可算，但观察窗口 `UNKNOWN`；教育 / 培训路径一律 `UNKNOWN`。 | 原文未提及 |
| PD-031 | 难民的 public funds 与偿还安排细则 | 先沿用现行 public funds 定义；难民哪些福利可不计入、偿还义务与保障措施的细节在实施前公布。须清偿 asylum support 或遵守还款计划。 | p39 | 难民用过 public funds 时，是否触发 20 年输出 `UNKNOWN`；asylum support 偿还状态由用户自报。 | 实施前（p39） |
| PD-032 | Article 31 保障如何运作 | 受 Refugee Convention Article 31 保护者不加 10 年；保障的具体运作在实施前公布。 | p39 | 非法入境 + 用户声称符合 Article 31 → `UNKNOWN`。 | 实施前（p39） |
| PD-033 | designated Safe and Legal Routes 的清单 | 用于定居目的的 designated Safe and Legal Routes 包括 UK Resettlement Scheme 及"specified"的安置与担保路线；具体清单未列出。 | p37；p47 | 只把 UK Resettlement Scheme 识别为 Safe and Legal；其他安置 / 担保路线输出 `UNKNOWN`。 | 原文未提及 |
| PD-034 | Protection Work and Study 与 Core Protection 的启用日期 | 2026-03-02 前申请庇护且非 Safe and Legal 的难民将转入 Core Protection；Protection Work and Study 的启用日期未给出。 | p38 注 14 | Protection Work and Study 启用日 = `UNKNOWN`。 | 原文未提及 |

### I. 过渡安排细节（详见 `docs/transitional-arrangements.md`）

| ID | 事项 | 原文怎么说 | 出处 | 对引擎的影响 | 预计何时明确 |
|---|---|---|---|---|---|
| PD-035 | 过渡截止点的精确日期 | 截止点为 "Immigration White Paper 于 2025 年 5 月发布"；PDF 内没有具体日期。SRC-012 已归档核实（2026-11-04）：White Paper 封面只写 "May 2025"；gov.uk 出版页的发布日为 2025-05-12（SOURCES.md），PDF 元数据修改日同为 2025-05-12。 | p42；p43；p44；SRC-012 封面 | 截止日取 2025-05-12，记为参数 `whitePaperPublished`（来源 SRC-001 p42、SRC-012）；care worker 许可起始日 < 2025-05-12 → 适用。"进入 / 转入"以哪个日期为准仍见 PD-036。 | 已按 SRC-012 确定为 2025-05-12 |
| PD-036 | care worker 群体的认定口径 | 适用于在 White Paper 发布前"进入或转入该路线"的 care worker；未定义"该路线"对应哪些职业代码，也未说"进入 / 转入"以申请日、获批日还是入境日为准。 | p42；p43 | 用户的入境 / 转入日期都明确早于截止点 → 适用；申请在截止前、获批在截止后等跨截止点情形 → `UNKNOWN`；职业是否属"care worker"由用户自报并声明。 | 原文未提及 |
| PD-037 | care worker 失去担保宽限期的适用范围 | 自 2027-02-01 起，因担保方被吊销执照而失业的 care worker 有 120 天找到工作、再加 60 天处理签证与雇佣状态；未明确是否仅限截止点前的过渡群体，也未说"担保被撤销"之外的失业是否适用。 | p43 | 宽限期作为提示信息输出，不影响定居年限；截止点后进入的 care worker 是否适用 → `UNKNOWN`。 | 原文未提及 |
| PD-038 | RQF6 以下国家薪级医疗 / 教育岗位的职业清单 | 举例为 nursing auxiliaries 与 teaching assistants，要求岗位"为 Immigration Rules 目的处于国家薪级"；Annex C 只列 RQF6 及以上职业，RQF6 以下的清单未给出。 | p44；p58–p59 | 用户职业为两个举例之一 → 适用；其他 RQF6 以下职业 → `UNKNOWN`，直到登记 Appendix Skilled Occupations（新来源，见报告）。 | 原文未提及 |
| PD-039 | RQF6 以下医疗 / 教育群体的时间条件 | 条件写作"在 White Paper 发布前来到英国"并满足签证要求；与 care worker 的"进入或转入该路线"写法不同，未说明截止前已在英、截止后才转入该职业的人是否适用。 | p44；p17 | 截止前已在该职业 → 适用；截止前在英但截止后才转入 → `UNKNOWN`。是否须满足强化最低要求，原文本节未提及，见 transitional-arrangements.md §2.2。 | 原文未提及 |
| PD-040 | 2024 年 4 月前 Skilled Worker 群体的细则 | 2024 年提高薪资门槛时的过渡安排原定 2030 年到期，现在允许该群体按现有条件续签至 2035 年；未给群体的精确界定日期、2035 年的具体日期，也未说其定居年限是否因此改变。 | p44 | 只建模"续签时可按旧薪资门槛"这一信息；定居年限按标准路径计算，不因此保留 5 年；2035 年具体截止日 `UNKNOWN`。群体界定需登记 2024 年 Statement of Changes（新来源，见报告）。 | 原文未提及 |

## 二、原文内部不一致

以下条目在 SRC-001 内部存在两种或以上说法。引擎的处理原则：以**更具体、更晚出现的结构化表述**（Table 1 / Table 2）为主口径，并在结论受影响时输出 `UNKNOWN` 或声明假设；不在两种说法之间自行裁决。

| ID | 事项 | 原文怎么说（各处概括） | 出处 | 对引擎的影响 | 预计何时明确 |
|---|---|---|---|---|---|
| PD-041 | 10 年路径的收入年数 | Contribution 一章先说须"至少 3 年"达到 £12,571，Annex B 也说"至少 3 年"；但同章 best years 段落与 Table 1 都写"申请前 7 年中 5 年"。 | p15、p52 vs p16、p46 | 主口径用 Table 1（7 年中 5 年）并声明假设；用户在 7 年中达标 ≥3 年但 <5 年时输出 `UNKNOWN`（结论取决于口径）。 | 原文未提及 |
| PD-042 | 收入门槛挂钩的税种 | 个人门槛 £12,571 在正文说与所得税 basic rate 挂钩，Annex B 却说与 2026/27 NICs 门槛一致；家庭门槛 £25,142 说随 National Insurance 门槛变动。 | p15 vs p52；p17 | 当前两种门槛数值相同，不影响今天的判断；参数文件须为个人门槛与家庭门槛分别记录挂钩依据，两种税种门槛将来分离时输出 `UNKNOWN`。 | 原文未提及 |
| PD-043 | 难民在新路线推出前的时间是否计入 | 注 14 说 2026-03-02 前申请庇护的（非 Safe and Legal）难民转入 Core Protection，有难民身份的时间"都会计入"；正文同页又说 Core Protection 时间不计入 Protection Work and Study 的 10 年，且已在英时间如何计入"将另行说明"。 | p38 注 14 vs p38 正文 | 2026-03-02 前申请庇护的难民：已有时间是否计入、计入哪条路径，输出 `UNKNOWN`。 | 原文未提及 |
| PD-044 | 非法入境的后果：20 年 breach 路径还是加 10 年 | 第 1 章把成年时非法入境与 qualifying breach 并列，暗示进入 20 年路径，同时说第 7 章的非法入境处理适用于所有移民；第 7 章则说非法入境者无论走哪条路线都"额外加 10 年"。 | p13 vs p38；p47–p48 | 非难民路线 + 非法入境：结论输出 `UNKNOWN`，并同时展示两种读法（20 年 / 基础路径 + 10 年）；难民路线按 Table 2 计算。 | 原文未提及 |
| PD-045 | 2027-04-06 前 URS 难民的英语标准 | Legacy Safe and Legal Routes（含 2027-04-06 前抵达的 URS 难民）属框架外，框架外群体一般须满足 B2（除非有现有豁免）；第 7 章又说 URS 难民只需 A2。 | p25、p26 注 13 vs p37、p39 | 2027-04-06 前抵达的 URS 难民：英语要求输出 `UNKNOWN`（A2 或 B2）。2027-04-06 后抵达者按 A2。 | 原文未提及 |
| PD-046 | care worker 二次 Health and Care 签证后的定居年限 | 第 8 章说未达标者可再获 5 年 Health and Care 签证，之后"再次申请定居"；Annex A 把这部分人放在 10 年路径下估算，案例 B 只说会支持其转入真实的担保工作。 | p43、p45 vs p50 | 二次签证后的定居：按"总计满 10 年"展示并声明假设；是否仍属保留的 5 年 qualifying period 规则、是否适用 £25,000 等条件，输出 `UNKNOWN`。 | 原文未提及 |
| PD-047 | public funds 回看期是否要求在 qualifying route 上 | 正文写"申请前紧接的 5 年"未使用 specified public funds；案例 D 写须在 qualifying route 上"连续 5 年"未使用。 | p18 vs p19 | 申请前 5 年内有部分时间不在 qualifying route 上时，输出 `UNKNOWN`；其余按正文判断。 | 原文未提及 |
| PD-048 | 3 年 / 高人才的命名 | 第 4 章注 10 使用 "high talent group / high talent permission"（含 Skilled Worker）；Table 1 使用 "Highest Talent Group" 并注明待 MAC 审查。二者是否同一概念不明。 | p23 注 10 vs p46 注 16 | 路线分类表使用 "high talent permission"（注 10）；"Highest Talent Group" 资格按 PD-011 输出 `UNKNOWN`；持 Skilled Worker 不等于可走 3 年路径。 | MAC 报告后（p46），日期原文未提及 |
| PD-049 | Protection Work and Study 的名称 | "计入定居"的路线清单写作 "Core Protection Work and Study"；第 7 章与 Table 2 均写 "Protection Work and Study"。 | p23 vs p37、p38、p47 | 视为同一路线，路线枚举使用 "Protection Work and Study"，别名记录 "Core Protection Work and Study"。 | 原文未提及 |
| PD-050 | 5 年路径是否"不受影响" | Annex B 称 5 年路径上的人不受 Earned Settlement 影响、仍为 5 年；但正文的强化最低要求（任何犯罪记录即拒绝、B2、无政府债务）适用于所有路径。 | p54 vs p12、p21、p46 | 以正文与 Table 1 为准：5 年路径仍须满足强化最低要求；Annex B 该句不作为规则依据。 | 原文未提及 |
| PD-051 | 丧偶伴侣须满足的要求 | 第 4 章概括说框架外弱势群体"在适当情况下"须满足强化的犯罪与英语要求；第 6 章对丧偶伴侣只说须满足 suitability 与 character 要求，未提英语。 | p26 vs p34 | 丧偶伴侣：英语要求输出 `UNKNOWN`；suitability / character 按须满足处理（同 PD-027）。 | 2027 年指引（p33 "next year"） |
| PD-052 | "No debt" 小标题下的内容 | 第 7 章 "No debt" 小标题下第一段讲的是 public funds，之后才讲 asylum support 偿还。属于排版 / 标题问题，不构成规则冲突。 | p39 | 无规则影响；规则作者引用时按段落内容（public funds / 债务）分别引用，不按小标题。 | — |

## 三、引擎假设（任务 1.1 新增）

原文未规定、引擎为给出结论而采用的口径。每条都会出现在结果页的 `assumptions` 中。

| ID | 事项 | 原文怎么说 | 出处 | 对引擎的影响 | 预计何时明确 |
|---|---|---|---|---|---|
| PD-053 | qualifying residence 的连续性 | 原文只说哪些路线计入（p23）、哪些不计入（p24），以及保护 / 人权路线与工作 / 家庭路线切换时重新起算（p25）；没有说不计入路线上的时间或许可之间的空隙是"只扣除"还是"打断连续性"。 | p23–p25 | 合格期 = 截至申请日连续处于同一类计入路线的最后一段；中间夹有不计入路线（如 Student、Graduate）或许可之间空隙超过 1 天，都视为中断、从下一段起重新起算。若政府采用"只扣除"口径，日期可能提前。 | 原文未提及 |
| PD-054 | Earned Settlement 的缺席口径 | 原文没有规定 Earned Settlement 下缺席多少天会打断连续居留。 | p22–p25 | 沿用现行 Appendix Continuous Residence CR 3.1（SRC-008）：任意 12 个月缺席不超过 180 天，超过则自该次缺席结束次日重新起算；缺席天数按含出境与入境当日计（偏保守）。CR 3.4 的可豁免缺席理由不建模。 | 原文未提及 |
