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
    zhCN: '虚构人物林遥，虚构设定为中国籍软件开发者，单身，2024 年初持技术工作者（Skilled Worker）许可入境，年薪 £38,000。每回合记录一段生活；没有记录的年度收入保持未知，不自动续填或推断定居获批。',
    en: 'Yao Lin is a fictional Chinese software developer, single on arrival in early 2024 with Skilled Worker permission and a £38,000 salary. Each turn records part of a life; unrecorded annual earnings remain unknown, and settlement grants are never inferred.',
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
        zhCN: `你在英国生活了一年，考虑现在取得 ${englishChange.cefrLevel} 证明，还是再等等；引擎中的 Skilled Worker 定居英语要求在 ${englishChange.applicationsFrom} 发生变化。`,
        en: `After a year in the UK, you consider obtaining ${englishChange.cefrLevel} evidence now or waiting; the engine’s Skilled Worker settlement English requirement changes on ${englishChange.applicationsFrom}.`,
      },
      choices: [
        {
          id: 'take-b2',
          label: { zhCN: '现在考取 B2', en: 'Obtain B2 now' },
          effects: [{ type: 'english', cefrLevel: 'B2' }],
          note: {
            zhCN: '本卡更新英语证明；适用等级由评估日和规则栏决定。',
            en: 'This card updates English evidence; the assessment date and rule set determine the required level.',
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
        zhCN: '你已取得新的三年 Skilled Worker 许可，岗位和年薪不变。过去一年认识的伴侣考虑来英；本游戏只评估你本人。',
        en: 'You have obtained a fresh three-year Skilled Worker permission with the same job and salary. A partner you met over the past year is considering joining you; the game assesses only you.',
      },
      choices: [
        {
          id: 'join',
          label: {
            zhCN: '记录伴侣来英并工作',
            en: 'Record your partner joining and working',
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
        zhCN: '一家新公司邀请你做 IT 质量与测试工作，年薪 £55,000。两个情节均已办妥对应岗位的三年 Skilled Worker 许可。',
        en: 'A new company offers an IT quality and testing job at £55,000. In either scenario, the relevant three-year Skilled Worker permission has already been granted.',
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
            zhCN: '担保年薪与 SOC 用于岗位薪资规则，tax year 收入用于收入路径。',
            en: 'Sponsored salary and SOC feed job salary rules; tax-year earnings feed earnings pathways.',
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
            zhCN: '继续记录原岗位与年薪，不代表当前薪资必然满足定居要求。',
            en: 'The original job and salary are retained; this does not imply the salary meets settlement requirements.',
          },
        },
      ],
    },
    {
      id: 'sw-income-shock',
      kind: 'choice',
      title: { zhCN: '预算突然收紧', en: 'A tighter budget' },
      text: {
        zhCN: '伴侣暂时失业，家庭开支吃紧。选择一段虚构记录：本卡不判断你是否有资格申领福利。',
        en: 'Your partner is temporarily out of work and household finances are tight. Choose a fictional record; this card does not decide whether you are entitled to claim benefits.',
      },
      choices: [
        {
          id: 'claim',
          label: {
            zhCN: '记录本人领取 Universal Credit',
            en: 'Record Universal Credit received by you',
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
            zhCN: '福利记录只计申请人本人领取的 public funds，不把伴侣的福利算到本人名下。',
            en: 'The benefit record counts public funds received by the applicant, not benefits received by the partner.',
          },
        },
        {
          id: 'borrow',
          label: {
            zhCN: '记录向朋友借钱周转',
            en: 'Record borrowing from a friend',
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
      id: 'sw-overseas-assignment',
      kind: 'choice',
      title: {
        zhCN: '回顾外派这一年',
        en: 'Looking back on an overseas assignment',
      },
      text: {
        zhCN: '以回顾方式选择过去一年的项目安排：海外工作八个月（本情节记为 240 天），或一直留在英国。两个情节均已获续签，现有许可延至 2032-01-14。',
        en: 'Choose retrospectively how the past year’s project was arranged: eight months working abroad (240 days in this scenario), or staying in the UK throughout. In both scenarios, a renewal has extended your current permission to 2032-01-14.',
      },
      choices: [
        {
          id: 'abroad',
          label: {
            zhCN: '记录外派八个月，昨天返回',
            en: 'Record eight months abroad, returning yesterday',
          },
          effects: [
            { type: 'episode', patch: { validTo: '2032-01-14' } },
            { type: 'absence', startOffsetDays: -240, days: 240 },
          ],
          note: {
            zhCN: '这段离境进入连续居留计算，是否重置起点由引擎判定。',
            en: 'This absence enters continuous-residence calculations; the engine decides whether it restarts the qualifying period.',
          },
        },
        {
          id: 'uk',
          label: { zhCN: '记录留在英国', en: 'Record staying in the UK' },
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
        zhCN: '原公司裁员。一个情节是今天已有新担保并衔接许可；另一个是今天起回国 90 天，随后取得新许可。新岗位均为 SOC 2136，年薪 £55,000；本卡不模拟取消许可的程序。',
        en: 'Your employer makes redundancies. One scenario has a new sponsor and adjoining permission today; the other has 90 days abroad from today before new permission is granted. Both new jobs are SOC 2136 at £55,000; this card does not simulate curtailment procedures.',
      },
      choices: [
        {
          id: 'new-sponsor',
          label: {
            zhCN: '记录已找到新担保',
            en: 'Record a new sponsor already found',
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
            zhCN: '本卡记录相接的许可片段，不把寻找担保的时限写成游戏规则。',
            en: 'This card records adjoining permissions without turning a sponsor-search deadline into a game rule.',
          },
        },
        {
          id: 'return-home',
          label: {
            zhCN: '记录回国三个月后再来',
            en: 'Record returning after three months abroad',
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
            zhCN: '许可空档与离境分别记录，未来的新许可到生效后才参与评估。',
            en: 'The permission gap and absence are recorded separately; future permission is assessed once it starts.',
          },
        },
      ],
    },
    {
      id: 'sw-drink-driving',
      kind: 'choice',
      title: { zhCN: '晚餐之后', en: 'After dinner' },
      text: {
        zhCN: '晚餐喝了酒，选择接下来的虚构情节；涉及犯罪记录的情节会结束这局，并显示引擎的受监管审查提示。',
        en: 'You have had alcohol with dinner. Choose the next fictional scenario; a criminal record ends the game with the engine’s regulated-review message.',
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
        zhCN: '你已取得新的三年 Skilled Worker 许可，SOC 2136、年薪 £55,000。接着考虑买房还是继续租住；游戏不模拟房价、贷款与资产变化。',
        en: 'You have obtained fresh three-year Skilled Worker permission, SOC 2136 at £55,000. You then consider buying or renting; the game does not simulate property prices, mortgages or changes in assets.',
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
            zhCN: '本卡更新许可；买房本身不增加定居年限或自动授予身份。',
            en: 'This card updates permission; buying a home does not add qualifying years or automatically grant status.',
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
      id: 'sw-life-in-uk',
      kind: 'choice',
      title: { zhCN: 'Life in the UK', en: 'Life in the UK' },
      text: {
        zhCN: '你整理材料时发现还没有 Life in the UK 通过记录。',
        en: 'While organising your documents, you notice there is no Life in the UK pass recorded.',
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
      id: 'sw-four-days',
      kind: 'choice',
      title: { zhCN: '留一天给生活', en: 'A day for yourself' },
      text: {
        zhCN: '公司提供四天工作制：年薪降为 £44,000，岗位代码不变。引擎没有工时字段，不判断兼职 going rate 的折算。',
        en: 'Your employer offers a four-day week at £44,000 with the same SOC code. The engine has no working-hours field and does not calculate a part-time going-rate adjustment.',
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
