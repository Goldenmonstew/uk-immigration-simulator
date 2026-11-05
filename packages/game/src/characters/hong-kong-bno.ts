import {
  currentLaw2026_11,
  earnedSettlement2026_11,
} from '@uk-immigration/policy-data';
import type { Character, Effect } from '../types';

// Fictional facts adapted from fixtures/cl-hkbno-five-years.ts.
// SRC-020 HK 60.1, HK 61.1, HK 62.1(b), HK 63.1; SRC-001 p25–p26.
const law = currentLaw2026_11.values;
const reformEnglish =
  earnedSettlement2026_11.values.settlementEnglishLevel.value;
const renewal: Effect = {
  type: 'newEpisode',
  episode: { route: 'HONG_KONG_BNO', role: 'MAIN' },
  durationMonths: 30,
};

export const hongKongBno: Character = {
  id: 'hong-kong-bno',
  name: { zhCN: '陈嘉宁', en: 'Ka Ning Chan' },
  intro: {
    zhCN: '陈嘉宁在 2022 年中以 BN(O) Status Holder 身份来英，与伴侣和一个孩子一起安顿下来，周末喜欢逛附近的公园。人物与事件均为虚构。',
    en: 'Ka Ning Chan arrived in mid-2022 as a BN(O) Status Holder with a partner and one child, and enjoys exploring local parks at weekends. All characters and events are fictional.',
  },
  startDate: '2023-07-01',
  timeline: {
    dateOfBirth: '1987-03-19',
    nationality: 'HKG',
    episodes: [
      {
        route: 'HONG_KONG_BNO',
        role: 'MAIN',
        validFrom: '2022-07-01',
        validTo: '2027-06-30',
      },
    ],
    absences: [],
    incomeYears: [],
    benefits: [],
    relationships: [
      { type: 'PARTNER', otherPartyStatus: 'OTHER' },
      { type: 'CHILD', otherPartyStatus: 'OTHER' },
    ],
    english: { cefrLevel: 'B1' },
    criminalRecord: [],
    immigrationBreaches: [],
    governmentDebt: { outstanding: false },
  },
  script: [
    {
      id: 'bno-school',
      kind: 'choice',
      title: { zhCN: '孩子的下一学期', en: 'The next school term' },
      text: {
        zhCN: '孩子刚适应英国学校，也很想念香港的同学。回想这一年，你们可以留在英国继续读书，或回香港陪读半年，昨天才回来。',
        en: 'Your child is settling into school in the UK but misses classmates in Hong Kong. Looking back, you either stayed with the UK school or spent half a year in Hong Kong, returning yesterday.',
      },
      choices: [
        {
          id: 'uk-school',
          label: {
            zhCN: '留在英国，慢慢适应新学校',
            en: 'Stay and settle into the UK school',
          },
          effects: [{ type: 'none' }],
          note: {
            zhCN: '不新增本人离境；游戏只评估嘉宁，孩子的 dependant 资格另算。',
            en: 'No absence is added for Ka Ning; the game assesses only Ka Ning, and the child’s dependant eligibility is separate.',
          },
        },
        {
          id: 'hong-kong-school',
          label: {
            zhCN: '回香港陪读半年，昨天回来',
            en: 'Spend half a year in Hong Kong and return yesterday',
          },
          effects: [{ type: 'absence', startOffsetDays: -183, days: 183 }],
          note: {
            zhCN: '本情节写入 183 天本人离境；按 HK 63.1 与 Appendix Continuous Residence 计算连续居留（SRC-020）。',
            en: 'This scenario adds 183 days abroad for the applicant; continuous residence follows HK 63.1 and Appendix Continuous Residence (SRC-020).',
          },
        },
      ],
    },
    {
      id: 'bno-work',
      kind: 'choice',
      title: { zhCN: '换一种工作节奏', en: 'A different working rhythm' },
      text: {
        zhCN: '朋友邀请你一起接自由职业项目，原公司的岗位也还在。你更喜欢自己安排时间，还是固定的同事和上下班？',
        en: 'A friend invites you to take freelance projects together, while your current job remains available. Do you prefer setting your own hours or a familiar team and routine?',
      },
      choices: [
        {
          id: 'self-employed',
          label: {
            zhCN: '开始接自由职业项目',
            en: 'Start taking freelance projects',
          },
          effects: [{ type: 'none' }],
          note: {
            zhCN: 'HK BN(O) 定居没有本游戏要核对的薪资门槛；工作方式未建模，不更改路线或收入字段（SRC-020 HK 55.1–64.2）。',
            en: 'HK BN(O) settlement has no salary threshold for this game to check; work arrangements are not modelled, so route and income fields stay unchanged (SRC-020 HK 55.1–64.2).',
          },
        },
        {
          id: 'employed',
          label: {
            zhCN: '继续留在熟悉的团队',
            en: 'Stay with the familiar team',
          },
          effects: [{ type: 'none' }],
          note: {
            zhCN: '继续受雇不改变 HK BN(O) 路线；本卡不添加收入记录或担保薪资要求。',
            en: 'Remaining employed does not change the HK BN(O) route; this card adds neither earnings records nor a sponsored-salary requirement.',
          },
        },
      ],
    },
    {
      id: 'bno-life-in-uk',
      kind: 'choice',
      title: { zhCN: '书桌上的备考书', en: 'A test book on the desk' },
      text: {
        zhCN: '朋友刚考完 Life in the UK，把备考书送给了你。你翻了几页，开始考虑什么时候安排自己的考试。',
        en: 'A friend has passed Life in the UK and gives you the study book. After browsing a few pages, you think about arranging your own test.',
      },
      choices: [
        {
          id: 'pass',
          label: {
            zhCN: '腾出时间备考并通过',
            en: 'Make time to prepare and pass',
          },
          effects: [{ type: 'lifeInTheUk' }],
          note: {
            zhCN: '写入 Life in the UK 通过证明，对应 HK 61.1（SRC-020）；不代表定居申请已获批。',
            en: 'Adds a Life in the UK pass under HK 61.1 (SRC-020); this does not mean settlement has been granted.',
          },
        },
        {
          id: 'later',
          label: {
            zhCN: '先放在书架上，晚些再考',
            en: 'Put it on the shelf and take the test later',
          },
          effects: [{ type: 'none' }],
          note: {
            zhCN: '本卡不新增通过或豁免证明，KOL 状态继续由引擎判断。',
            en: 'No pass or exemption evidence is added; the engine continues to assess KOL.',
          },
        },
      ],
    },
    {
      id: 'bno-renewal',
      kind: 'choice',
      title: { zhCN: '下一段生活的手续', en: 'Paperwork for the next chapter' },
      text: {
        zhCN: '一家人决定继续在英国生活。回顾这次 BN(O) 续签，你是自己整理好材料，还是请顾问协助完成的？',
        en: 'Your family decides to keep living in the UK. Looking back at this BN(O) renewal, did you organise the documents yourself or get help from an adviser?',
      },
      choices: [
        {
          id: 'renew',
          label: {
            zhCN: '自己整理材料，续签已获批',
            en: 'Organise the documents yourself; renewal granted',
          },
          effects: [renewal],
          note: {
            zhCN: '两个分支均设为今天已获 30 个月 BN(O) 许可，新片段与上一片段相接；不模拟续签审批。',
            en: 'Both branches assume a 30-month BN(O) grant today, adjoining the previous episode; renewal decisions are not simulated.',
          },
        },
        {
          id: 'renew-with-help',
          label: {
            zhCN: '请顾问协助，续签已获批',
            en: 'Get help from an adviser; renewal granted',
          },
          effects: [renewal],
          note: {
            zhCN: '协助方式不改变引擎字段；同样写入已获批的 30 个月许可，不推断定居获批。',
            en: 'The kind of help changes no engine fields; this also adds an already-granted 30-month permission without inferring a settlement grant.',
          },
        },
      ],
    },
    {
      id: 'bno-long-holiday',
      kind: 'choice',
      title: { zhCN: '来英第五年的假期', en: 'A holiday in your fifth year' },
      text: {
        zhCN: '今天是来英五周年。回想过去一年，家人曾提议回香港住上七个月，再回来准备定居材料。你们最后怎样安排？',
        en: 'Today marks five years since your arrival. Looking back, your family suggested spending seven months in Hong Kong before returning to prepare settlement documents. What did you decide?',
      },
      choices: [
        {
          id: 'long-holiday',
          label: {
            zhCN: '回香港住了七个月，昨天回来',
            en: 'Spend seven months in Hong Kong and return yesterday',
          },
          effects: [{ type: 'absence', startOffsetDays: -210, days: 210 }],
          note: {
            zhCN: `本情节写入 210 天离境；${law.hongKongBnoQualifyingYears.value} 年节点仍须检查连续居留（SRC-020 HK 62.1(b)、HK 63.1）。`,
            en: `This scenario adds 210 days abroad; the ${law.hongKongBnoQualifyingYears.value}-year point still requires a continuous-residence check (SRC-020 HK 62.1(b), HK 63.1).`,
          },
        },
        {
          id: 'stay-uk',
          label: {
            zhCN: '留在英国，把长假放到以后',
            en: 'Stay in the UK and leave the long holiday for later',
          },
          effects: [{ type: 'none' }],
          note: {
            zhCN: '不新增离境；是否满足年限、英语与 KOL 由现行法律栏评估，不自动授予定居。',
            en: 'No absence is added; the current-law column assesses time, English and KOL without automatically granting settlement.',
          },
        },
      ],
    },
    {
      id: 'bno-english',
      kind: 'choice',
      title: { zhCN: '要不要再考一次英语', en: 'Another English test?' },
      text: {
        zhCN: '新一轮 BN(O) 续签已办妥。朋友最近在准备更高等级的英语考试，你也想试试，或先把精力留给工作和家人。',
        en: 'Another BN(O) renewal is in place. A friend is preparing for a higher-level English test, and you consider joining in or keeping your time for work and family.',
      },
      choices: [
        {
          id: 'take-b2',
          label: {
            zhCN: '一起备考，取得 B2 证明',
            en: 'Prepare together and obtain B2 evidence',
          },
          effects: [renewal, { type: 'english', cefrLevel: 'B2' }],
          note: {
            zhCN: `本卡续签 30 个月并更新英语；改革栏虽属框架外，${reformEnglish} 与强化犯罪要求仍适用（SRC-001 p25–p26），现行 HK 60.1 一律 ${law.hongKongBnoSettlementEnglish.value}（SRC-020）。`,
            en: `Renews permission for 30 months and updates English; outside-framework reform still requires ${reformEnglish} and strengthened criminality checks (SRC-001 p25–p26), while current HK 60.1 requires ${law.hongKongBnoSettlementEnglish.value} throughout (SRC-020).`,
          },
        },
        {
          id: 'keep-evidence',
          label: {
            zhCN: '这次先不考，保留现有证明',
            en: 'Skip this test and keep the evidence you have',
          },
          effects: [renewal],
          note: {
            zhCN: `本卡只续签 30 个月，不降级已有证明；现行 HK 60.1 的 ${law.hongKongBnoSettlementEnglish.value} 与改革栏 ${reformEnglish} 要求分别显示。`,
            en: `Only renews permission for 30 months without downgrading evidence; current HK 60.1’s ${law.hongKongBnoSettlementEnglish.value} and reform’s ${reformEnglish} requirement remain separate.`,
          },
        },
      ],
    },
    {
      id: 'bno-parents',
      kind: 'choice',
      title: { zhCN: '父母的探亲计划', en: 'A visit from your parents' },
      text: {
        zhCN: '父母想来看看你们在英国的生活。你们商量是在家多做几顿饭，还是一起去附近的小镇逛逛。',
        en: 'Your parents want to see your life in the UK. You plan either more family meals at home or outings to nearby towns.',
      },
      choices: [
        {
          id: 'at-home',
          label: {
            zhCN: '在家相聚，多聊聊天',
            en: 'Spend time together at home',
          },
          effects: [{ type: 'none' }],
          note: {
            zhCN: '父母来访不构成本人离境；访客许可与父母的身份不在本局评估范围。',
            en: 'A visit from parents is not an absence for the applicant; their visitor permissions and status are outside this game’s assessment.',
          },
        },
        {
          id: 'local-trips',
          label: {
            zhCN: '带父母看看英国的小镇',
            en: 'Explore nearby UK towns together',
          },
          effects: [{ type: 'none' }],
          note: {
            zhCN: '英国境内旅行不添加离境，不评估来访家人的定居资格。',
            en: 'Travel within the UK adds no absence; visiting relatives’ settlement eligibility is not assessed.',
          },
        },
      ],
    },
    {
      id: 'bno-partner-work',
      kind: 'choice',
      title: { zhCN: '伴侣收到工作邀请', en: 'A job offer for your partner' },
      text: {
        zhCN: '又一期 BN(O) 续签已办妥。伴侣也收到了年薪 £24,000 的工作邀请，正在考虑现在入职，还是先留些时间照顾家里。',
        en: 'Another BN(O) renewal is complete. Your partner receives a £24,000 job offer and considers starting now or keeping some time for the family.',
      },
      choices: [
        {
          id: 'start-work',
          label: {
            zhCN: '伴侣接受邀请，开始工作',
            en: 'Your partner accepts and starts work',
          },
          effects: [
            renewal,
            { type: 'income', taxYear: 'current', partnerEarnings: 24000 },
          ],
          note: {
            zhCN: '续签 30 个月并写入本 tax year 的伴侣收入；HK BN(O) 无此薪资门槛，伴侣的 dependant 资格另算。',
            en: 'Renews permission for 30 months and adds partner earnings for this tax year; HK BN(O) has no such salary threshold, and the partner’s dependant eligibility is separate.',
          },
        },
        {
          id: 'wait-work',
          label: {
            zhCN: '伴侣暂缓入职，先照顾家里',
            en: 'Your partner waits and focuses on family',
          },
          effects: [
            renewal,
            { type: 'income', taxYear: 'current', partnerEarnings: 0 },
          ],
          note: {
            zhCN: '续签 30 个月并把本 tax year 的伴侣收入设为零；伴侣收入不自动延续到其他年度。',
            en: 'Renews permission for 30 months and sets this tax year’s partner earnings to zero; partner earnings are not carried into other years.',
          },
        },
      ],
    },
    {
      id: 'bno-budget',
      kind: 'choice',
      title: { zhCN: '家里的应急预算', en: 'The household emergency budget' },
      text: {
        zhCN: '家里接连多了几笔开支，收入一时跟不上。你考虑申领 Universal Credit，或用积蓄先撑一段时间。',
        en: 'Several unexpected bills arrive while income is tight. You consider claiming Universal Credit or using savings for a while.',
      },
      choices: [
        {
          id: 'claim',
          label: {
            zhCN: '申领 Universal Credit 渡过难关',
            en: 'Claim Universal Credit to get through',
          },
          effects: [
            {
              type: 'benefit',
              benefit: { benefitType: 'UNIVERSAL_CREDIT' },
              startOffsetDays: 0,
              months: 6,
            },
          ],
          note: {
            zhCN: '本情节设为本人领取，不判断福利资格或 NRPF 条件变更；改革栏 public funds 规则仍展示，但框架外不算核心路径年限，现行栏未建模领取资格。',
            en: 'Assumes receipt by the applicant without assessing benefit entitlement or changes to NRPF conditions; reform still displays its public-funds rule but does not calculate a core pathway outside the framework, and current law does not model claim entitlement.',
          },
        },
        {
          id: 'use-savings',
          label: {
            zhCN: '动用积蓄，先付清账单',
            en: 'Use savings to pay the bills',
          },
          effects: [{ type: 'none' }],
          note: {
            zhCN: '不添加本人 public funds 领取记录；本卡不模拟具体储蓄余额。',
            en: 'Adds no public-funds receipt for the applicant; this card does not model a savings balance.',
          },
        },
      ],
    },
    {
      id: 'bno-conviction',
      kind: 'choice',
      title: { zhCN: '一次争执之后', en: 'After an argument' },
      text: {
        zhCN: '一次邻里争执让你很生气。你是离开现场冷静下来，还是砸坏对方物品，后来因此被定罪？',
        en: 'An argument with a neighbour leaves you angry. Do you walk away to cool down, or damage their property and later receive a conviction?',
      },
      choices: [
        {
          id: 'conviction',
          label: {
            zhCN: '砸坏物品，后来被定罪',
            en: 'Damage the property and later be convicted',
          },
          effects: [{ type: 'criminal', event: {} }],
          note: {
            zhCN: '任何申报的犯罪记录都会触发两栏受监管审查并结束本局；框架外仍有强化犯罪要求（SRC-001 p25–p26），游戏不判断轻重或具体拒绝理由。',
            en: 'Any declared criminal record triggers regulated review in both columns and ends the game; strengthened criminality requirements still apply outside the framework (SRC-001 p25–p26), without the game judging severity or specific refusal grounds.',
          },
        },
        {
          id: 'walk-away',
          label: {
            zhCN: '离开现场，等冷静后再沟通',
            en: 'Walk away and talk once you have cooled down',
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
      id: 'bno-luck-friends',
      kind: 'luck',
      title: { zhCN: '老朋友来访', en: 'Old friends visit' },
      text: {
        zhCN: '香港的老朋友来英国旅行，你们约了一顿久违的晚饭。',
        en: 'Old friends from Hong Kong visit the UK, and you arrange a long-awaited dinner.',
      },
      choices: [
        {
          id: 'noted',
          label: { zhCN: '知道了', en: 'Noted' },
          effects: [{ type: 'none' }],
          note: {
            zhCN: '朋友来英不构成本人离境，不改变引擎字段。',
            en: 'Friends visiting the UK is not an absence for the applicant and changes no engine fields.',
          },
        },
      ],
    },
    {
      id: 'bno-luck-project',
      kind: 'luck',
      title: { zhCN: '香港的合作项目', en: 'A project in Hong Kong' },
      text: {
        zhCN: '你接下一个需要在香港驻留三个月的合作项目，昨天刚回到英国。',
        en: 'You take a project requiring three months in Hong Kong and return to the UK yesterday.',
      },
      choices: [
        {
          id: 'noted',
          label: { zhCN: '知道了', en: 'Noted' },
          effects: [{ type: 'absence', startOffsetDays: -90, days: 90 }],
          note: {
            zhCN: '本情节写入 90 天离境，与其他离境一起交给连续居留规则评估。',
            en: 'This scenario records 90 days abroad, assessed together with other absences under continuous-residence rules.',
          },
        },
      ],
    },
    {
      id: 'bno-luck-child-plans',
      kind: 'luck',
      title: { zhCN: '孩子的未来打算', en: 'Your child’s plans' },
      text: {
        zhCN: '孩子谈起将来离家求学的打算，一家人聊了很久。',
        en: 'Your child talks about studying away from home one day, and the conversation lasts all evening.',
      },
      choices: [
        {
          id: 'noted',
          label: { zhCN: '知道了', en: 'Noted' },
          effects: [{ type: 'none' }],
          note: {
            zhCN: '只作叙事；孩子成年后的 dependant 与定居规则须按其自身情况另算，本局只评估本人。',
            en: 'Narrative only; the child’s dependant and settlement rules in adulthood require a separate assessment of their circumstances. This game assesses only the applicant.',
          },
        },
      ],
    },
  ],
};
