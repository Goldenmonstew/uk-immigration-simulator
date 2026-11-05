import { currentLaw2026_11 } from '@uk-immigration/policy-data';
import type { Character } from '../types';

// Fictional facts adapted from the structure of fixtures/p31-principal.ts.
// Policy dates and levels come from parameters (SRC-004 SW 22A.1).
const englishChange =
  currentLaw2026_11.values.skilledWorkerSettlementEnglish.value;

export const skilledWorker: Character = {
  id: 'skilled-worker',
  name: { zhCN: '林遥', en: 'Yao Lin' },
  intro: {
    zhCN: '林遥是一名来自中国的软件开发者，2024 年初独自持 Skilled Worker 许可来英，年薪 £38,000，正在慢慢安顿生活。人物与事件均为虚构。',
    en: 'Yao Lin is a software developer from China, settling into life after arriving alone in early 2024 with Skilled Worker permission and a £38,000 salary. All characters and events are fictional.',
  },
  startDate: '2025-01-15',
  timeline: {
    dateOfBirth: '1995-08-12',
    nationality: 'CHN',
    episodes: [
      {
        route: 'SKILLED_WORKER',
        role: 'MAIN',
        validFrom: '2024-01-15',
        validTo: '2027-01-14',
        salary: 38000,
        socCode: '2134',
      },
    ],
    absences: [],
    incomeYears: [
      { taxYear: '2023-24', earnings: 8500 },
      { taxYear: '2024-25', earnings: 38000 },
    ],
    benefits: [],
    relationships: [],
    english: { cefrLevel: 'B1' },
    criminalRecord: [],
    immigrationBreaches: [],
    governmentDebt: { outstanding: false },
  },
  luckPool: [],
  script: [
    {
      id: 'sw-english',
      kind: 'choice',
      title: { zhCN: '英语考试的安排', en: 'Making time for an English test' },
      text: {
        zhCN: '你在英国生活了一年，工作之外也想给英语学习留点时间。现在准备考试，还是先缓一缓？',
        en: 'After a year in the UK, you want to make time for English alongside work. Prepare for a test now, or leave it for later?',
      },
      choices: [
        {
          id: 'take-b2',
          label: { zhCN: '现在考取 B2', en: 'Obtain B2 now' },
          effects: [{ type: 'english', cefrLevel: 'B2' }],
          note: {
            zhCN: `本卡更新英语证明；Skilled Worker 现行法律栏从 ${englishChange.applicationsFrom} 起要求 ${englishChange.cefrLevel}（SRC-004 SW 22A.1），改革栏按自身规则评估。`,
            en: `This card updates English evidence; current-law Skilled Worker settlement requires ${englishChange.cefrLevel} from ${englishChange.applicationsFrom} (SRC-004 SW 22A.1), while reform uses its own rules.`,
          },
        },
        {
          id: 'wait',
          label: {
            zhCN: '暂时保留现有证明',
            en: 'Keep the existing evidence for now',
          },
          effects: [{ type: 'none' }],
          note: {
            zhCN: '等待不增加英语证明，之后仍按当时的要求评估。',
            en: 'Waiting adds no English evidence; later assessments still use the requirement applicable then.',
          },
        },
      ],
    },
    {
      id: 'sw-partner',
      kind: 'choice',
      title: { zhCN: '两个人的计划', en: 'Plans for two' },
      text: {
        zhCN: '新一轮三年 Skilled Worker 许可已办妥，工作照旧。过去一年认识的伴侣正和你商量，是来英国一起生活，还是暂时继续异地。',
        en: 'With fresh three-year Skilled Worker permission and the same job, you and a partner you met over the past year discuss living together in the UK or staying apart a little longer.',
      },
      choices: [
        {
          id: 'join',
          label: {
            zhCN: '伴侣来英，一起安顿并开始工作',
            en: 'Your partner joins you and starts work',
          },
          effects: [
            {
              type: 'newEpisode',
              episode: {
                route: 'SKILLED_WORKER',
                role: 'MAIN',
                salary: 38000,
                socCode: '2134',
              },
              durationMonths: 36,
            },
            {
              type: 'relationship',
              add: { type: 'PARTNER', otherPartyStatus: 'OTHER' },
            },
            { type: 'income', taxYear: 'current', partnerEarnings: 24000 },
          ],
          note: {
            zhCN: '伴侣关系与家庭收入进入时间线，但不评估伴侣的 dependant 资格。',
            en: 'The relationship and household earnings enter the timeline, but the partner’s dependant eligibility is not assessed.',
          },
        },
        {
          id: 'apart',
          label: {
            zhCN: '暂时继续异地生活',
            en: 'Continue living apart for now',
          },
          effects: [
            {
              type: 'newEpisode',
              episode: {
                route: 'SKILLED_WORKER',
                role: 'MAIN',
                salary: 38000,
                socCode: '2134',
              },
              durationMonths: 36,
            },
            {
              type: 'relationship',
              add: { type: 'PARTNER', otherPartyStatus: 'OTHER' },
            },
          ],
          note: {
            zhCN: '本卡只记录关系，不假定在海外的伴侣有可计入的收入。',
            en: 'This card records the relationship without assuming countable earnings for a partner abroad.',
          },
        },
      ],
    },
    {
      id: 'sw-new-job',
      kind: 'choice',
      title: { zhCN: '新岗位的邀请', en: 'A new job offer' },
      text: {
        zhCN: '一家新公司邀请你做 IT 质量与测试工作，年薪 £55,000。你有些心动，也舍不得现在熟悉的团队。',
        en: 'A new company offers an IT quality and testing job at £55,000. It is tempting, but you would miss your familiar team.',
      },
      choices: [
        {
          id: 'move',
          label: { zhCN: '接受测试岗位', en: 'Take the testing job' },
          effects: [
            {
              type: 'newEpisode',
              episode: {
                route: 'SKILLED_WORKER',
                role: 'MAIN',
                salary: 55000,
                socCode: '2136',
              },
              durationMonths: 36,
            },
            { type: 'income', taxYear: 'current', earnings: 55000 },
          ],
          note: {
            zhCN: '本情节以新岗位三年许可已获批为前提；担保年薪与 SOC 用于岗位薪资规则，tax year 收入用于收入路径。',
            en: 'This scenario assumes three-year permission for the new job is granted; sponsored salary and SOC feed job salary rules, while tax-year earnings feed earnings pathways.',
          },
        },
        {
          id: 'stay',
          label: { zhCN: '留在开发岗位', en: 'Stay in software development' },
          effects: [
            {
              type: 'newEpisode',
              episode: {
                route: 'SKILLED_WORKER',
                role: 'MAIN',
                salary: 38000,
                socCode: '2134',
              },
              durationMonths: 36,
            },
            { type: 'income', taxYear: 'current', earnings: 38000 },
          ],
          note: {
            zhCN: '本情节以原岗位三年许可已获批为前提；保留原岗位与年薪，不代表薪资必然满足定居要求。',
            en: 'This scenario assumes three-year permission for the existing job is granted; keeping the job and salary does not imply the salary meets settlement requirements.',
          },
        },
      ],
    },
    {
      id: 'sw-life-in-uk',
      kind: 'choice',
      title: { zhCN: 'Life in the UK', en: 'Life in the UK' },
      text: {
        zhCN: '你整理定居材料清单时发现，Life in the UK 还没考。趁这阵子工作不忙，能挤出些备考时间。',
        en: 'While sorting out a settlement checklist, you realise you have not taken Life in the UK. Work is quieter, leaving a little time to prepare.',
      },
      choices: [
        {
          id: 'pass',
          label: { zhCN: '备考并通过', en: 'Prepare and pass' },
          effects: [{ type: 'lifeInTheUk' }],
          note: {
            zhCN: '本卡写入 Life in the UK 已通过的证明。',
            en: 'This card records evidence of passing Life in the UK.',
          },
        },
        {
          id: 'later',
          label: { zhCN: '以后再安排', en: 'Arrange it later' },
          effects: [{ type: 'none' }],
          note: {
            zhCN: '未提供通过或豁免证明时，由引擎返回相应状态。',
            en: 'Without pass or exemption evidence, the engine returns the corresponding status.',
          },
        },
      ],
    },
    {
      id: 'sw-overseas-assignment',
      kind: 'choice',
      title: {
        zhCN: '回顾外派这一年',
        en: 'Looking back on an overseas assignment',
      },
      text: {
        zhCN: '过去一年，公司有个为期八个月的海外项目。你接下了外派，昨天刚回来，还是一直留在英国团队？续签也已办好，生活又翻过一页。',
        en: 'Looking back over the past year, you either took an overseas assignment and returned yesterday, or stayed with the UK team. Your renewed permission is also in place.',
      },
      choices: [
        {
          id: 'abroad',
          label: {
            zhCN: '接受外派，昨天刚回来',
            en: 'Take the assignment and return yesterday',
          },
          effects: [
            { type: 'episode', patch: { validTo: '2032-01-14' } },
            { type: 'absence', startOffsetDays: -240, days: 240 },
          ],
          note: {
            zhCN: '本情节把外派八个月记为 240 天离境，并将已续签许可延至 2032-01-14；连续居留由引擎计算。',
            en: 'This scenario records eight months as 240 days abroad and renewed permission through 2032-01-14; the engine calculates continuous residence.',
          },
        },
        {
          id: 'uk',
          label: { zhCN: '留在英国团队', en: 'Stay with the UK team' },
          effects: [{ type: 'episode', patch: { validTo: '2032-01-14' } }],
          note: {
            zhCN: '本卡不添加离境，只更新已续签的许可期限。',
            en: 'This card adds no absence and only updates the renewed permission’s end date.',
          },
        },
      ],
    },
    {
      id: 'sw-sponsor-loss',
      kind: 'choice',
      title: { zhCN: '担保方裁员', en: 'Redundancy at your sponsor' },
      text: {
        zhCN: '原公司开始裁员。你可以接受已经落实的新担保岗位，也可以先回国陪家人三个月，再回来开始新工作。新岗位年薪都是 £55,000。',
        en: 'Your employer starts making redundancies. You can take a job with a new sponsor already in place, or spend three months with family abroad before returning to a new job. Both pay £55,000.',
      },
      choices: [
        {
          id: 'new-sponsor',
          label: {
            zhCN: '接下新担保方的工作',
            en: 'Take the job with the new sponsor',
          },
          effects: [
            {
              type: 'newEpisode',
              episode: {
                route: 'SKILLED_WORKER',
                role: 'MAIN',
                salary: 55000,
                socCode: '2136',
              },
              durationMonths: 36,
            },
            { type: 'income', taxYear: 'current', earnings: 55000 },
          ],
          note: {
            zhCN: '本卡写入今天起相接的新许可与 SOC 2136，不模拟取消许可程序或寻找担保的时限。',
            en: 'This card records adjoining permission from today with SOC 2136; curtailment procedures and sponsor-search deadlines are not simulated.',
          },
        },
        {
          id: 'return-home',
          label: {
            zhCN: '回国陪家人，三个月后再来',
            en: 'Spend three months with family before returning',
          },
          effects: [
            {
              type: 'newEpisode',
              episode: {
                route: 'SKILLED_WORKER',
                role: 'MAIN',
                salary: 55000,
                socCode: '2136',
              },
              durationMonths: 36,
              gapDays: 90,
            },
            { type: 'absence', startOffsetDays: 0, days: 90 },
          ],
          note: {
            zhCN: '本情节写入 90 天离境与许可空档，新许可为 SOC 2136，生效后才参与评估；取消许可程序未建模。',
            en: 'This scenario records 90 days abroad and a permission gap; the new SOC 2136 permission is assessed once effective, without modelling curtailment procedures.',
          },
        },
      ],
    },
    {
      id: 'sw-drink-driving',
      kind: 'choice',
      title: { zhCN: '晚餐之后', en: 'After dinner' },
      text: {
        zhCN: '晚餐喝了酒，散场时天已经很晚。你会怎样回家？',
        en: 'You have had alcohol with dinner, and it is late when everyone leaves. How do you get home?',
      },
      choices: [
        {
          id: 'conviction',
          label: {
            zhCN: '酒驾并被定罪，留下犯罪记录',
            en: 'Drive, be convicted and acquire a criminal record',
          },
          effects: [{ type: 'criminal', event: {} }],
          note: {
            zhCN: '引擎对申报的犯罪记录触发受监管审查，不在游戏内判断具体法律后果。',
            en: 'The engine sends declared criminal records to regulated review; the game does not decide the specific legal consequences.',
          },
        },
        {
          id: 'taxi',
          label: { zhCN: '叫车回家', en: 'Take a taxi home' },
          effects: [{ type: 'none' }],
          note: {
            zhCN: '本情节没有新增犯罪记录。',
            en: 'This scenario adds no criminal record.',
          },
        },
      ],
    },
    {
      id: 'sw-home',
      kind: 'choice',
      title: { zhCN: '住处的选择', en: 'A place to live' },
      text: {
        zhCN: '新一轮三年 Skilled Worker 许可已办妥，测试岗位年薪仍是 £55,000。周末看了几套房，你开始考虑买下住处，还是继续租住。',
        en: 'With fresh three-year Skilled Worker permission and the same testing job at £55,000, a weekend of viewings gets you thinking about buying a home or continuing to rent.',
      },
      choices: [
        {
          id: 'buy',
          label: { zhCN: '买下住处', en: 'Buy a home' },
          effects: [
            {
              type: 'newEpisode',
              episode: {
                route: 'SKILLED_WORKER',
                role: 'MAIN',
                salary: 55000,
                socCode: '2136',
              },
              durationMonths: 36,
            },
            { type: 'none' },
          ],
          note: {
            zhCN: '本卡更新 SOC 2136 的许可；房价、贷款与资产变化未建模，买房不自动授予身份。',
            en: 'This card renews SOC 2136 permission; property prices, mortgages and asset changes are not modelled, and buying does not grant status.',
          },
        },
        {
          id: 'rent',
          label: { zhCN: '继续租住', en: 'Keep renting' },
          effects: [
            {
              type: 'newEpisode',
              episode: {
                route: 'SKILLED_WORKER',
                role: 'MAIN',
                salary: 55000,
                socCode: '2136',
              },
              durationMonths: 36,
            },
            { type: 'none' },
          ],
          note: {
            zhCN: '本卡更新许可，租住选择不另改引擎字段。',
            en: 'This card updates permission; the rental choice changes no other engine fields.',
          },
        },
      ],
    },
    {
      id: 'sw-income-shock',
      kind: 'choice',
      title: { zhCN: '预算突然收紧', en: 'A tighter budget' },
      text: {
        zhCN: '伴侣暂时失业，家里的账单却没有少。你们得想办法撑过这几个月。',
        en: 'Your partner is temporarily out of work, but the bills keep coming. You need a way through the next few months.',
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
            zhCN: '本情节设为本人领取 Universal Credit，不判断申领资格；不把伴侣领取的福利算到本人名下。',
            en: 'This scenario gives the applicant Universal Credit without assessing claim entitlement; benefits received by the partner are not attributed to the applicant.',
          },
        },
        {
          id: 'borrow',
          label: {
            zhCN: '向朋友借钱周转',
            en: 'Borrow from a friend',
          },
          effects: [{ type: 'income', taxYear: 'current', partnerEarnings: 0 }],
          note: {
            zhCN: '私人借款不记为 public funds 或 government debt，本游戏不模拟还款预算。',
            en: 'A private loan is not recorded as public funds or government debt; repayment budgeting is not simulated.',
          },
        },
      ],
    },
    {
      id: 'sw-four-days',
      kind: 'choice',
      title: { zhCN: '留一天给生活', en: 'A day for yourself' },
      text: {
        zhCN: '公司开始提供四天工作制，年薪是 £44,000，工作内容不变。每周多出一天自己的时间，让你有些心动。',
        en: 'Your employer offers a four-day week at £44,000 doing the same work. An extra day to yourself each week sounds tempting.',
      },
      choices: [
        {
          id: 'four-days',
          label: { zhCN: '改为四天工作制', en: 'Move to a four-day week' },
          effects: [
            { type: 'episode', patch: { salary: 44000 } },
            { type: 'income', taxYear: 'current', earnings: 44000 },
          ],
          note: {
            zhCN: '本卡更新名义年薪和当年收入，工时折算未建模。',
            en: 'This card updates nominal annual salary and current-year earnings; working-hours adjustments are not modelled.',
          },
        },
        {
          id: 'full-time',
          label: { zhCN: '保留当前安排', en: 'Keep the current arrangement' },
          effects: [{ type: 'income', taxYear: 'current', earnings: 55000 }],
          note: {
            zhCN: '本卡保留岗位年薪，并记录当年税前收入。',
            en: 'This card keeps the sponsored salary and records current-year gross earnings.',
          },
        },
      ],
    },
  ],
};
