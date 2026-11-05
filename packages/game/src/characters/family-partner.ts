import { currentLaw2026_11 } from '@uk-immigration/policy-data';
import type { Character, Effect } from '../types';

// Fictional facts adapted from fixtures/cl-family-partner-five-years.ts and
// cl-family-five-year-savings-*.ts, with the post-transition arrival date.
// Sofia first applied in May 2024, then arrived in June 2024.
// SRC-024 E-ILRP.1.3, E-LTRP.3.1–3.3, E-LTRP.3.5; SRC-025 KoLL 2.2–2.3.
const law = currentLaw2026_11.values;
const englishChange = law.familyPartnerSettlementEnglish.value;
const incomeThreshold =
  law.familyPartnerMinimumIncome.value.toLocaleString('en-GB');
const savingsBase = law.familyPartnerSavingsBase.value.toLocaleString('en-GB');
const renewal: Effect = {
  type: 'newEpisode',
  episode: {
    route: 'FAMILY_PARTNER_OR_PARENT',
    role: 'MAIN',
    familyPermission: 'PARTNER_FIVE_YEAR',
    salary: 20000,
  },
  durationMonths: 30,
};

export const familyPartner: Character = {
  id: 'family-partner',
  name: { zhCN: '索菲娅·莫拉', en: 'Sofia Mora' },
  intro: {
    zhCN: '索菲娅来自巴西，2024 年中以英国公民杰米的伴侣身份来英，持 Appendix FM 五年路线许可；她兼职年收入 £12,000，杰米年收入 £20,000，两人正为将来的生活攒钱。人物与事件均为虚构。',
    en: 'Sofia Mora moved from Brazil in mid-2024 as the partner of Jamie, a British citizen, on the Appendix FM five-year route; she earns £12,000 part-time and Jamie earns £20,000 as they save for their future. All characters and events are fictional.',
  },
  startDate: '2025-11-30',
  timeline: {
    dateOfBirth: '1993-02-14',
    nationality: 'BRA',
    episodes: [
      {
        route: 'FAMILY_PARTNER_OR_PARENT',
        role: 'MAIN',
        familyPermission: 'PARTNER_FIVE_YEAR',
        validFrom: '2024-06-01',
        validTo: '2026-11-30',
        salary: 12000,
      },
    ],
    absences: [],
    incomeYears: [
      { taxYear: '2024-25', earnings: 12000, partnerEarnings: 20000 },
    ],
    benefits: [],
    relationships: [{ type: 'PARTNER', otherPartyStatus: 'BRITISH_CITIZEN' }],
    english: { cefrLevel: 'B1' },
    cashSavings: 10000,
    partnerSpecifiedBenefit: false,
    criminalRecord: [],
    immigrationBreaches: [],
    governmentDebt: { outstanding: false },
  },
  script: [
    {
      id: 'family-work',
      kind: 'choice',
      title: { zhCN: '一份全职邀请', en: 'A full-time offer' },
      text: {
        zhCN: '现在的兼职年收入是 £12,000，新公司愿意提供年薪 £26,000 的全职工作。杰米的工作照旧，你想怎样安排自己的时间？',
        en: 'Your part-time work brings in £12,000 a year, and a new employer offers a full-time job at £26,000. Jamie’s work is unchanged. How would you like to spend your time?',
      },
      choices: [
        {
          id: 'full-time',
          label: {
            zhCN: '接受全职，年薪 £26,000',
            en: 'Take the full-time job at £26,000',
          },
          effects: [
            { type: 'episode', patch: { salary: 26000 } },
            {
              type: 'income',
              taxYear: 'current',
              earnings: 26000,
              partnerEarnings: 20000,
            },
          ],
          note: {
            zhCN: `写入岗位年薪与本 tax year 的双方收入；财务规则回看完整年度，本人首次申请在 2024 年 5 月，适用一般门槛 £${incomeThreshold}，不适用 ${law.familyPartnerTransitionalBefore.value} 前首次申请者的过渡安排（SRC-024 E-LTRP.3.1(a)、3.5）。`,
            en: `Records salary and both partners’ earnings for this tax year; the financial rule reads completed years. The first application was in May 2024, so the general £${incomeThreshold} threshold applies, rather than transitional arrangements for first applications before ${law.familyPartnerTransitionalBefore.value} (SRC-024 E-LTRP.3.1(a), 3.5).`,
          },
        },
        {
          id: 'part-time',
          label: {
            zhCN: '继续兼职，留些时间给生活',
            en: 'Keep part-time work and some time for yourself',
          },
          effects: [
            { type: 'episode', patch: { salary: 12000 } },
            {
              type: 'income',
              taxYear: 'current',
              earnings: 12000,
              partnerEarnings: 20000,
            },
          ],
          note: {
            zhCN: '写入双方当年收入；家庭伴侣财务规则可合并收入，不要求本人单独达到门槛（SRC-024 E-LTRP.3.2(a)(b)）。',
            en: 'Records both partners’ earnings for the year; the family financial rule can combine them rather than requiring the applicant alone to meet the threshold (SRC-024 E-LTRP.3.2(a)(b)).',
          },
        },
      ],
    },
    {
      id: 'family-renewal',
      kind: 'choice',
      title: { zhCN: '续签后的工作安排', en: 'Work after renewal' },
      text: {
        zhCN: '2026 年底，伴侣路线续签已获批，杰米仍在原岗位工作。你也到了重新安排工时的时候：下一年选全职，还是兼职？',
        en: 'At the end of 2026, your partner-route renewal is granted and Jamie is still in the same job. It is also time to choose full-time or part-time work for the coming year.',
      },
      choices: [
        {
          id: 'renew-full-time',
          label: {
            zhCN: '续签后按全职安排继续生活',
            en: 'Continue with full-time work after renewal',
          },
          effects: [
            {
              type: 'newEpisode',
              episode: {
                route: 'FAMILY_PARTNER_OR_PARENT',
                role: 'MAIN',
                familyPermission: 'PARTNER_FIVE_YEAR',
                salary: 26000,
              },
              durationMonths: 30,
            },
            {
              type: 'income',
              taxYear: 'current',
              earnings: 26000,
              partnerEarnings: 20000,
            },
          ],
          note: {
            zhCN: '写入已获批的 30 个月新许可，保留 PARTNER_FIVE_YEAR 并衔接前段；年薪 £26,000、伴侣收入 £20,000，不模拟续签审批。',
            en: 'Adds an already-granted 30-month adjoining permission retaining PARTNER_FIVE_YEAR, with £26,000 salary and £20,000 partner earnings; renewal decisions are not simulated.',
          },
        },
        {
          id: 'renew-part-time',
          label: {
            zhCN: '续签后保留兼职的节奏',
            en: 'Keep a part-time rhythm after renewal',
          },
          effects: [
            {
              type: 'newEpisode',
              episode: {
                route: 'FAMILY_PARTNER_OR_PARENT',
                role: 'MAIN',
                familyPermission: 'PARTNER_FIVE_YEAR',
                salary: 12000,
              },
              durationMonths: 30,
            },
            {
              type: 'income',
              taxYear: 'current',
              earnings: 12000,
              partnerEarnings: 20000,
            },
          ],
          note: {
            zhCN: '同样写入相接的 30 个月五年路线许可；兼职 £12,000 与伴侣 £20,000 进入本年度收入，不切换为十年路线。',
            en: 'Also adds an adjoining 30-month five-year-route permission; £12,000 part-time earnings and £20,000 partner earnings enter this year’s record without switching to the ten-year route.',
          },
        },
      ],
    },
    {
      id: 'family-english',
      kind: 'choice',
      title: {
        zhCN: '给英语考试留个周末',
        en: 'A weekend for an English test',
      },
      text: {
        zhCN: '生活渐渐有了节奏，你想继续提高英语。杰米的工作没有变化，你考虑这个冬天考取 B2，或晚些再安排。',
        en: 'Life has found a rhythm, and you want to improve your English. Jamie’s work is unchanged. You consider taking B2 this winter or leaving it for later.',
      },
      choices: [
        {
          id: 'take-b2',
          label: {
            zhCN: '认真备考，取得 B2 证明',
            en: 'Prepare and obtain B2 evidence',
          },
          effects: [
            { type: 'english', cefrLevel: 'B2' },
            { type: 'income', taxYear: 'current', partnerEarnings: 20000 },
          ],
          note: {
            zhCN: `现行五年伴侣路线从 ${englishChange.applicationsFrom} 起要求 ${englishChange.cefrLevel}（SRC-025 KoLL 2.2），改革栏也要求 B2；本卡同时填写伴侣本年度收入。`,
            en: `The current five-year partner route requires ${englishChange.cefrLevel} from ${englishChange.applicationsFrom} (SRC-025 KoLL 2.2), while reform also requires B2; this card also records the partner’s earnings for this year.`,
          },
        },
        {
          id: 'wait',
          label: {
            zhCN: '这个冬天先缓一缓',
            en: 'Leave it for another winter',
          },
          effects: [
            { type: 'income', taxYear: 'current', partnerEarnings: 20000 },
          ],
          note: {
            zhCN: '保留已有英语证明，不因等待降低或提高等级；只另填伴侣本年度收入。',
            en: 'Keeps existing English evidence without changing its level; only the partner’s earnings for this year are added.',
          },
        },
      ],
    },
    {
      id: 'family-life-in-uk',
      kind: 'choice',
      title: { zhCN: '又翻开了材料清单', en: 'Back to the checklist' },
      text: {
        zhCN: '你换到一份年薪 £20,000 的工作，新一轮续签也办妥了，杰米仍在工作。来英快五年，你翻出材料清单，发现 Life in the UK 还没考。',
        en: 'You move to a £20,000 job and complete another renewal while Jamie remains in work. With five years in the UK approaching, you find Life in the UK still on your checklist.',
      },
      choices: [
        {
          id: 'pass',
          label: { zhCN: '这次备考并通过', en: 'Prepare and pass this time' },
          effects: [
            renewal,
            {
              type: 'income',
              taxYear: 'current',
              earnings: 20000,
              partnerEarnings: 20000,
            },
            { type: 'lifeInTheUk' },
          ],
          note: {
            zhCN: '更新已获批的 30 个月五年路线许可和当年收入，并写入 KoLL 2.3 的通过证明（SRC-025）；不推断定居获批。',
            en: 'Updates an already-granted 30-month five-year-route permission and current-year earnings, and adds a pass under KoLL 2.3 (SRC-025), without inferring a settlement grant.',
          },
        },
        {
          id: 'later',
          label: {
            zhCN: '先适应新工作，之后再考',
            en: 'Settle into the new job and take the test later',
          },
          effects: [
            renewal,
            {
              type: 'income',
              taxYear: 'current',
              earnings: 20000,
              partnerEarnings: 20000,
            },
          ],
          note: {
            zhCN: '同样更新已获批许可与收入，但不新增 KOL 证明；五年节点仍逐项评估。',
            en: 'Also updates granted permission and earnings, but adds no KOL evidence; the five-year point is still assessed requirement by requirement.',
          },
        },
      ],
    },
    {
      id: 'family-income-shock',
      kind: 'choice',
      title: { zhCN: '杰米暂时失业了', en: 'Jamie loses a job' },
      text: {
        zhCN: '杰米所在的团队被裁撤，家里暂时只剩你的收入。你们一起算了算开支，接下来几个月得更节省些。',
        en: 'Jamie’s team is made redundant, leaving the household relying on your earnings. You work through the bills together and plan a tighter few months.',
      },
      choices: [
        {
          id: 'claim',
          label: {
            zhCN: '申领 Universal Credit 渡过难关',
            en: 'Claim Universal Credit to get through',
          },
          effects: [
            { type: 'income', taxYear: 'current', partnerEarnings: 0 },
            {
              type: 'benefit',
              benefit: { benefitType: 'UNIVERSAL_CREDIT' },
              startOffsetDays: 0,
              months: 6,
            },
          ],
          note: {
            zhCN: '本情节设为本人领取 Universal Credit，不判断福利资格或 NRPF 条件变更；伴侣本年度收入为零，当前财务规则仍读上一完整年度，public funds 两栏后果由引擎显示。',
            en: 'Assumes Universal Credit receipt by the applicant without assessing benefit entitlement or NRPF changes; partner earnings are zero this year, the financial rule still reads the last completed year, and the engine shows each column’s public-funds consequences.',
          },
        },
        {
          id: 'cut-spending',
          label: {
            zhCN: '暂不申领，压缩日常开支',
            en: 'Do not claim and reduce everyday spending',
          },
          effects: [{ type: 'income', taxYear: 'current', partnerEarnings: 0 }],
          note: {
            zhCN: '同样写入伴侣本年度收入为零，不添加本人福利记录；不模拟家庭预算。',
            en: 'Also records zero partner earnings for this year without adding benefits for the applicant; household budgeting is not simulated.',
          },
        },
      ],
    },
    {
      id: 'family-savings',
      kind: 'choice',
      title: { zhCN: '积蓄还是一辆车', en: 'Savings or a car' },
      text: {
        zhCN: '又一期伴侣路线续签已办妥，你年薪仍是 £20,000，杰米还没有工作收入。家里可以把现金积蓄补到 £25,000，也可以先买车，买完留下 £5,000。',
        en: 'Another partner-route renewal is in place. You still earn £20,000 and Jamie has no work earnings. You could bring your cash savings to £25,000 or buy a car and keep £5,000.',
      },
      choices: [
        {
          id: 'save',
          label: {
            zhCN: '把现金积蓄攒到 £25,000',
            en: 'Build cash savings to £25,000',
          },
          effects: [
            renewal,
            { type: 'timeline', patch: { cashSavings: 25000 } },
          ],
          note: {
            zhCN: `续签 30 个月并更新合计现金储蓄；定居阶段可用 £${savingsBase} 加收入缺口补足，按 E-ILRP.1.3(1A) 不乘 2.5，持有期与证据未核对；这不是续签财务测试（SRC-024 E-LTRP.3.1(b)）。`,
            en: `Renews permission for 30 months and updates combined cash savings; settlement can use £${savingsBase} plus the earnings shortfall without multiplying by 2.5 under E-ILRP.1.3(1A), without checking holding periods or evidence. This is not a renewal financial test (SRC-024 E-LTRP.3.1(b)).`,
          },
        },
        {
          id: 'buy-car',
          label: {
            zhCN: '买车，留下 £5,000 应急',
            en: 'Buy the car and keep £5,000 for emergencies',
          },
          effects: [
            renewal,
            { type: 'timeline', patch: { cashSavings: 5000 } },
          ],
          note: {
            zhCN: '同样写入已获批的续签，只将现金储蓄改为 £5,000；汽车不计为 cashSavings，由定居财务规则重算缺口。',
            en: 'Also adds the granted renewal, but changes cash savings to £5,000; the car is not cashSavings, and the settlement financial rule recalculates the shortfall.',
          },
        },
      ],
    },
    {
      id: 'family-partner-benefit',
      kind: 'choice',
      title: { zhCN: '杰米的健康状况', en: 'Jamie’s health' },
      text: {
        zhCN: '杰米因病暂时无法工作，你们正在处理 Personal Independence Payment（PIP）的申请。回顾这段时间，申请已经获批，还是仍在等待？',
        en: 'Jamie is unable to work because of illness, and you are dealing with a Personal Independence Payment (PIP) application. Looking back, was it granted or still pending?',
      },
      choices: [
        {
          id: 'pip-awarded',
          label: {
            zhCN: 'PIP 已获批，整理后续生活安排',
            en: 'PIP is awarded; organise the next steps',
          },
          effects: [
            { type: 'timeline', patch: { partnerSpecifiedBenefit: true } },
          ],
          note: {
            zhCN: 'PIP 属 E-LTRP.3.3(a) 所列伴侣福利；收入和储蓄均不足时，adequate maintenance and accommodation 尚未建模，财务规则为 UNKNOWN（PD-075），不自动 PASS，也不记作本人领取 public funds（SRC-024 3.3(a)(vi)、3.3(b)）。',
            en: 'PIP is a listed partner benefit under E-LTRP.3.3(a); when earnings and savings are insufficient, adequate maintenance and accommodation are not modelled, so the financial rule is UNKNOWN (PD-075), not an automatic PASS or public-funds receipt by the applicant (SRC-024 3.3(a)(vi), 3.3(b)).',
          },
        },
        {
          id: 'pip-pending',
          label: {
            zhCN: '还在等待，先靠现有收入生活',
            en: 'Keep waiting and live on existing earnings',
          },
          effects: [
            { type: 'timeline', patch: { partnerSpecifiedBenefit: false } },
          ],
          note: {
            zhCN: '尚未领取不设 partnerSpecifiedBenefit；仍按已知收入与现金储蓄评估，不预测福利审批。',
            en: 'A pending award does not set partnerSpecifiedBenefit; assessment uses known earnings and cash savings without predicting the benefit decision.',
          },
        },
      ],
    },
    {
      id: 'family-care-abroad',
      kind: 'choice',
      title: { zhCN: '家人需要照顾', en: 'Family needs care' },
      text: {
        zhCN: '续签已办妥，工作安排不变。回想过去一年，海外的家人需要照顾，你是去了七个月，还是和亲人轮流照顾，只去了三个月？你昨天回到英国。',
        en: 'Your renewal is in place and work arrangements are unchanged. Looking back, did you care for family abroad for seven months or share the care and spend three months away? You returned to the UK yesterday.',
      },
      choices: [
        {
          id: 'seven-months',
          label: {
            zhCN: '陪家人七个月，昨天回来',
            en: 'Spend seven months with family and return yesterday',
          },
          effects: [
            renewal,
            { type: 'absence', startOffsetDays: -210, days: 210 },
          ],
          note: {
            zhCN: '续签 30 个月并写入 210 天离境；五年伴侣路线不引用 Appendix Continuous Residence，不直接套其天数上限，缺席影响尚未建模（PD-070）；改革栏分别计算（SRC-024 E-ILRP.1.3，契约 §12.8）。',
            en: 'Renews permission for 30 months and records 210 days abroad; the five-year partner route does not invoke Appendix Continuous Residence or directly use its day limit, and the impact of absences is not modelled (PD-070); reform is assessed separately (SRC-024 E-ILRP.1.3, contracts §12.8).',
          },
        },
        {
          id: 'three-months',
          label: {
            zhCN: '和亲人轮流照顾，三个月后回来',
            en: 'Share the care and return after three months',
          },
          effects: [
            renewal,
            { type: 'absence', startOffsetDays: -90, days: 90 },
          ],
          note: {
            zhCN: '同样续签并写入 90 天离境；不把较短离境写成自动满足五年伴侣路线的结论。',
            en: 'Also renews permission and records 90 days abroad, without treating a shorter absence as automatic satisfaction of the five-year partner route.',
          },
        },
      ],
    },
    {
      id: 'family-child',
      kind: 'choice',
      title: { zhCN: '家里多了一位小成员', en: 'A new member of the family' },
      text: {
        zhCN: '孩子出生了，家里的作息全变了。你们讨论周末请亲友来帮忙，还是先留些安静相处的时间。',
        en: 'A baby arrives and turns the household routine upside down. You discuss inviting friends and family to help at the weekend or keeping some quiet time together.',
      },
      choices: [
        {
          id: 'family-help',
          label: {
            zhCN: '请亲友来帮忙，轮流休息',
            en: 'Ask friends and family to help so you can rest',
          },
          effects: [{ type: 'none' }],
          note: {
            zhCN: '只作叙事，不评估孩子的国籍或自动授予身份；需申请定居的家庭子女另按 para 298 评估，不随本人的五年年限自动通过（SRC-029 para 298）。',
            en: 'Narrative only, without assessing the child’s nationality or granting status; a family child who needs settlement is assessed separately under para 298, not automatically through the applicant’s five-year period (SRC-029 para 298).',
          },
        },
        {
          id: 'quiet-weekend',
          label: {
            zhCN: '先留一个安静的周末',
            en: 'Keep a quiet weekend together',
          },
          effects: [{ type: 'none' }],
          note: {
            zhCN: '不添加子女定居结果或本人福利记录；本局仍只评估索菲娅。',
            en: 'Adds neither a child’s settlement result nor benefits for the applicant; this game still assesses only Sofia.',
          },
        },
      ],
    },
    {
      id: 'family-conviction',
      kind: 'choice',
      title: { zhCN: '冲动的一刻', en: 'A moment of impulse' },
      text: {
        zhCN: '你和人发生争执，一时很生气。你是离开现场，还是损坏对方财物，后来被定罪？',
        en: 'An argument leaves you angry. Do you walk away, or damage the other person’s property and later receive a conviction?',
      },
      choices: [
        {
          id: 'conviction',
          label: {
            zhCN: '损坏财物，后来被定罪',
            en: 'Damage the property and later be convicted',
          },
          effects: [{ type: 'criminal', event: {} }],
          note: {
            zhCN: '写入犯罪记录后，两栏均转受监管审查并结束本局；游戏不按轻重推断具体法律后果。',
            en: 'A criminal record sends both columns to regulated review and ends the game; the game does not infer specific legal consequences from severity.',
          },
        },
        {
          id: 'walk-away',
          label: {
            zhCN: '离开现场，等冷静后再谈',
            en: 'Walk away and talk after cooling down',
          },
          effects: [{ type: 'none' }],
          note: {
            zhCN: '本情节不新增犯罪记录。',
            en: 'This scenario adds no criminal record.',
          },
        },
      ],
    },
  ],
  luckPool: [
    {
      id: 'family-luck-pay-rise',
      kind: 'luck',
      title: {
        zhCN: '杰米有了工作上的好消息',
        en: 'Good news about Jamie’s work',
      },
      text: {
        zhCN: '杰米拿到一份更好的工作安排，这个纳税年度的工作收入合计 £24,000。',
        en: 'Jamie secures a better work arrangement, bringing work earnings for this tax year to £24,000.',
      },
      choices: [
        {
          id: 'noted',
          label: { zhCN: '知道了', en: 'Noted' },
          effects: [
            { type: 'income', taxYear: 'current', partnerEarnings: 24000 },
          ],
          note: {
            zhCN: '只更新这个 tax year 的伴侣工作收入，不自动延续；完整年度才进入财务规则的回看窗口。',
            en: 'Updates only this tax year’s partner work earnings without carrying them forward; completed years enter the financial rule’s lookback window.',
          },
        },
      ],
    },
    {
      id: 'family-luck-new-baby',
      kind: 'luck',
      title: { zhCN: '亲友家的新生儿', en: 'A new baby among friends' },
      text: {
        zhCN: '亲友家添了孩子，邀请你们去喝茶，聊聊最近的生活。',
        en: 'Friends welcome a baby and invite you for tea and a catch-up.',
      },
      choices: [
        {
          id: 'noted',
          label: { zhCN: '知道了', en: 'Noted' },
          effects: [{ type: 'none' }],
          note: {
            zhCN: '亲友家的变化只作叙事，不改变本人的关系、福利或定居结果。',
            en: 'Changes in friends’ lives are narrative only, without changing the applicant’s relationships, benefits or settlement result.',
          },
        },
      ],
    },
    {
      id: 'family-luck-move-home',
      kind: 'luck',
      title: { zhCN: '又要搬家了', en: 'Another move' },
      text: {
        zhCN: '房东准备收回房子，你们在同一个英国小镇找到新住处，忙着打包。',
        en: 'Your landlord needs the property back. You find a new home in the same UK town and start packing.',
      },
      choices: [
        {
          id: 'noted',
          label: { zhCN: '知道了', en: 'Noted' },
          effects: [{ type: 'none' }],
          note: {
            zhCN: '英国境内搬家不构成离境；地址与搬家费用没有对应引擎字段。',
            en: 'Moving within the UK is not an absence abroad; addresses and moving costs have no corresponding engine fields.',
          },
        },
      ],
    },
  ],
};
