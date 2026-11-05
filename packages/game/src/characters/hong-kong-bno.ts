import { currentLaw2026_11 } from '@uk-immigration/policy-data';
import type { Character, GameEvent } from '../types';
import { balance } from '../balance';

// Fictional household facts adapted from CL-HKBNO-FIVE-YEARS; only this adult is assessed.
const policy = currentLaw2026_11.values;
const events: GameEvent[] = [
  {
    id: 'bno-school-gate',
    title: { zhCN: '校门口的雨伞', en: 'Umbrellas at the school gate' },
    text: {
      zhCN: '孩子把家长会通知揉成小船，嘉宁从书包底找到了它。',
      en: 'The child folds the parents’ evening letter into a boat; Ka Ning finds it at the bottom of the bag.',
    },
    weight: 2,
    once: true,
    when: [{ yearMax: 2 }],
    choices: [
      {
        id: 'plan',
        label: { zhCN: '约老师聊聊', en: 'Arrange a chat with the teacher' },
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
        sets: ['bno-school-chat'],
      },
      {
        id: 'skip',
        label: { zhCN: '先和孩子一起读通知', en: 'Read the letter together' },
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
      },
    ],
  },
  {
    id: 'bno-school-chat',
    title: { zhCN: '小椅子上的大人', en: 'Adults on tiny chairs' },
    text: {
      zhCN: '家长会的椅子低得像露营凳，老师把孩子的画摆在桌上。',
      en: 'The parents’ evening chairs are camping-stool low; the teacher lays out the child’s drawings.',
    },
    weight: 2,
    once: true,
    requires: ['bno-school-chat'],
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '慢慢问清孩子的情况',
          en: 'Take time to ask about the child',
        },
        effects: [
          { type: 'stat', key: 'english', delta: 3 },
          { type: 'stat', key: 'mood', delta: 5 },
        ],
        sets: ['friend-bno-school'],
      },
      {
        id: 'second',
        label: {
          zhCN: '让伴侣帮忙补充',
          en: 'Ask the partner to help explain',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 4 }],
      },
    ],
  },
  {
    id: 'bno-cafe-window',
    title: { zhCN: '茶餐厅的招聘纸', en: 'A café window vacancy' },
    text: {
      zhCN: '港式茶餐厅的招聘纸被蒸汽熏卷了角，老板递来一杯热茶。',
      en: 'Steam curls the vacancy notice at the Hong Kong café; the owner passes over hot tea.',
    },
    weight: 2,
    once: true,
    choices: [
      {
        id: 'plan',
        label: { zhCN: '试试周末帮工', en: 'Try weekend shifts' },
        effects: [
          { type: 'income', taxYear: 'current', earnings: 36000 },
          { type: 'stat', key: 'health', delta: -3 },
        ],
        sets: ['bno-cafe-shifts'],
        note: {
          zhCN: '记录本税年本人全年税前收入 £36,000；不模拟雇主流程。',
          en: 'Records £36,000 in the player’s annual gross earnings for this tax year; employer procedures are not simulated.',
        },
      },
      {
        id: 'skip',
        label: { zhCN: '先做熟客', en: 'Become a regular first' },
        effects: [
          { type: 'money', delta: -12 },
          { type: 'stat', key: 'mood', delta: 5 },
        ],
      },
    ],
  },
  {
    id: 'bno-cafe-shifts',
    title: { zhCN: '收工后的奶茶', en: 'Milk tea after closing' },
    text: {
      zhCN: '周末帮工满了一轮，嘉宁的袖口沾着糖，日历却挤满了。',
      en: 'After a round of weekend shifts, Ka Ning has sugar on the cuffs and a crowded calendar.',
    },
    weight: 2,
    once: true,
    requires: ['bno-cafe-shifts'],
    choices: [
      {
        id: 'first',
        sets: ['bno-cafe-regular'],
        label: { zhCN: '留下来做固定班', en: 'Keep regular shifts' },
        effects: [
          { type: 'income', taxYear: 'current', earnings: 38000 },
          { type: 'stat', key: 'health', delta: -4 },
        ],
        note: {
          zhCN: '记录本税年本人全年税前收入 £38,000；不模拟雇主流程。',
          en: 'Records £38,000 in the player’s annual gross earnings for this tax year; employer procedures are not simulated.',
        },
      },
      {
        id: 'second',
        label: { zhCN: '退回原来的工时', en: 'Return to the previous hours' },
        effects: [
          { type: 'income', taxYear: 'current', earnings: 34000 },
          { type: 'stat', key: 'mood', delta: 5 },
        ],
        note: {
          zhCN: '记录本税年本人全年税前收入 £34,000；不模拟雇主流程。',
          en: 'Records £34,000 in the player’s annual gross earnings for this tax year; employer procedures are not simulated.',
        },
      },
    ],
  },
  {
    id: 'bno-partner-cv',
    title: { zhCN: '餐桌上的简历', en: 'A CV on the table' },
    text: {
      zhCN: '伴侣把简历改到第七版，孩子给页脚画了一只猫。',
      en: 'The partner’s CV reaches version seven; the child adds a cat in the footer.',
    },
    weight: 2,
    once: true,
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '陪伴侣投递第一轮',
          en: 'Help send the first applications',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
        sets: ['bno-partner-applications'],
      },
      {
        id: 'skip',
        label: { zhCN: '今晚先收起电脑', en: 'Close the laptop tonight' },
        effects: [{ type: 'stat', key: 'mood', delta: 5 }],
      },
    ],
  },
  {
    id: 'bno-partner-offer',
    title: { zhCN: '第二张工牌', en: 'A second staff pass' },
    text: {
      zhCN: '伴侣终于拿到录用信，孩子在冰箱上的便签旁添了一颗星。',
      en: 'The partner gets an offer at last; the child adds a star beside the note on the fridge.',
    },
    weight: 2,
    once: true,
    requires: ['bno-partner-applications'],
    choices: [
      {
        id: 'first',
        label: { zhCN: '接受全职安排', en: 'Take the full-time arrangement' },
        effects: [{ type: 'stat', key: 'mood', delta: 7 }],
        sets: ['bno-partner-working'],
        note: {
          zhCN: '只改变心情并记录伴侣的工作经历，不计入本局收入。',
          en: 'Changes mood and records the partner’s work story, without adding income in this game.',
        },
      },
      {
        id: 'second',
        label: { zhCN: '先从兼职开始', en: 'Start with part-time hours' },
        effects: [{ type: 'stat', key: 'mood', delta: 5 }],
        sets: ['bno-partner-working'],
        note: {
          zhCN: '只改变心情并记录伴侣的工作经历，不计入本局收入。',
          en: 'Changes mood and records the partner’s work story, without adding income in this game.',
        },
      },
    ],
  },
  {
    id: 'bno-parents-ticket',
    title: { zhCN: '父母的行李秤', en: 'The parents’ luggage scales' },
    text: {
      zhCN: '视频里聊起刚结束的团聚，父母笑说三个箱子一个也没少。',
      en: 'On a video call about the reunion just ended, the parents laugh that all three suitcases made the trip.',
    },
    weight: 2,
    once: true,
    choices: [
      {
        id: 'plan',
        label: { zhCN: '约他们来英国小住', en: 'Invite them for a UK visit' },
        effects: [
          { type: 'money', delta: -250 },
          { type: 'stat', key: 'mood', delta: 4 },
        ],
        sets: ['bno-parents-visit'],
      },
      {
        id: 'skip',
        label: {
          zhCN: '这次是嘉宁回去住了三周',
          en: 'Ka Ning spent three weeks visiting them',
        },
        effects: [
          { type: 'absence', startOffsetDays: -21, days: 21 },
          { type: 'money', delta: -700 },
          { type: 'stat', key: 'mood', delta: 6 },
        ],
        note: {
          zhCN: '记录已经归来的实际离境，连续居留后果交给引擎计算（SRC-020 HK 63.1；SRC-008 CR 3.1）。',
          en: 'Records a completed absence; the engine assesses continuous residence (SRC-020 HK 63.1; SRC-008 CR 3.1).',
        },
      },
    ],
  },
  {
    id: 'bno-parents-visit',
    title: { zhCN: '客房里的电饭锅', en: 'A rice cooker in the spare room' },
    text: {
      zhCN: '父母住过一阵，客房留下电饭锅，玄关多了双拖鞋。',
      en: 'After the parents’ visit, a rice cooker stays in the spare room and slippers by the door.',
    },
    weight: 2,
    once: true,
    requires: ['bno-parents-visit'],
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '陪他们回港再住两周',
          en: 'Accompany them back to Hong Kong for a fortnight',
        },
        effects: [
          { type: 'absence', startOffsetDays: -14, days: 14 },
          { type: 'money', delta: -600 },
          { type: 'stat', key: 'mood', delta: 6 },
        ],
        note: {
          zhCN: '记录已经归来的实际离境，连续居留后果交给引擎计算（SRC-020 HK 63.1；SRC-008 CR 3.1）。',
          en: 'Records a completed absence; the engine assesses continuous residence (SRC-020 HK 63.1; SRC-008 CR 3.1).',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '送到机场后回家',
          en: 'Return home after the airport goodbye',
        },
        effects: [
          { type: 'money', delta: -65 },
          { type: 'stat', key: 'mood', delta: -2 },
        ],
      },
    ],
  },
  {
    id: 'bno-summer-hk',
    title: { zhCN: '暑假的两张日历', en: 'Two summer calendars' },
    text: {
      zhCN: '孩子想回港陪外婆，嘉宁把学校假期和机票摊在一起。',
      en: 'The child wants a summer with grandma in Hong Kong; Ka Ning lays out school dates and flights.',
    },
    weight: 2,
    once: true,
    season: 3,
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '商量陪读和照顾安排',
          en: 'Discuss school and care arrangements',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 2 }],
        sets: ['bno-summer-away'],
      },
      {
        id: 'skip',
        label: { zhCN: '先安排英国的暑假', en: 'Plan a UK summer for now' },
        effects: [
          { type: 'money', delta: -180 },
          { type: 'stat', key: 'mood', delta: 5 },
        ],
      },
    ],
  },
  {
    id: 'bno-summer-return',
    title: { zhCN: '回来的书包', en: 'The returning school bag' },
    text: {
      zhCN: '陪孩子回港的日子结束了，书包里还夹着一张电车票。',
      en: 'The stay in Hong Kong with the child is over; a tram ticket remains in the school bag.',
    },
    weight: 2,
    once: true,
    requires: ['bno-summer-away'],
    when: [{ yearMin: 2 }],
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '这次陪住了半年多',
          en: 'The stay lasted just over half a year',
        },
        effects: [
          { type: 'absence', startOffsetDays: -190, days: 190 },
          { type: 'money', delta: -1400 },
          { type: 'stat', key: 'mood', delta: 7 },
        ],
        note: {
          zhCN: '记录已经归来的实际离境，连续居留后果交给引擎计算（SRC-020 HK 63.1；SRC-008 CR 3.1）。',
          en: 'Records a completed absence; the engine assesses continuous residence (SRC-020 HK 63.1; SRC-008 CR 3.1).',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '分工照顾，嘉宁只住一个月',
          en: 'Share the care; Ka Ning stayed one month',
        },
        effects: [
          { type: 'absence', startOffsetDays: -30, days: 30 },
          { type: 'money', delta: -750 },
          { type: 'stat', key: 'mood', delta: 4 },
        ],
        note: {
          zhCN: '记录已经归来的实际离境，连续居留后果交给引擎计算（SRC-020 HK 63.1；SRC-008 CR 3.1）。',
          en: 'Records a completed absence; the engine assesses continuous residence (SRC-020 HK 63.1; SRC-008 CR 3.1).',
        },
      },
    ],
  },
  {
    id: 'bno-kol-book',
    title: { zhCN: '烤箱旁的练习册', en: 'A workbook by the oven' },
    text: {
      zhCN: 'Life in the UK 练习册放在烤箱旁，翻页时掉出一点面粉。',
      en: 'The Life in the UK workbook sits by the oven and sheds flour when opened.',
    },
    weight: 2,
    once: true,
    when: [{ yearMin: 2 }],
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '每晚腾出一点复习时间',
          en: 'Make room for evening revision',
        },
        effects: [
          { type: 'stat', key: 'english', delta: 2 },
          { type: 'stat', key: 'mood', delta: -1 },
        ],
        sets: ['bno-kol-revised'],
      },
      {
        id: 'skip',
        label: { zhCN: '先把晚饭煮好', en: 'Finish dinner first' },
        effects: [{ type: 'stat', key: 'mood', delta: 4 }],
      },
    ],
  },
  {
    id: 'bno-kol-result',
    title: { zhCN: '小小的通过通知', en: 'A small pass notice' },
    text: {
      zhCN: '复习过的题目终于派上用场，嘉宁把通过通知夹进文件夹。',
      en: 'The revision pays off; Ka Ning slips the pass notice into the folder.',
    },
    weight: 2,
    once: true,
    requires: ['bno-kol-revised'],
    choices: [
      {
        id: 'first',
        sets: ['bno-kol-passed'],
        label: {
          zhCN: '收好 Life in the UK 通过记录',
          en: 'File the Life in the UK pass',
        },
        effects: [
          { type: 'lifeInTheUk' },
          { type: 'stat', key: 'mood', delta: 4 },
        ],
        note: {
          zhCN: '本情节记录已通过；BN(O) 定居的知识要求见 SRC-020 HK 61.1。',
          en: 'Records a pass in this scenario; the BN(O) settlement knowledge requirement is SRC-020 HK 61.1.',
        },
      },
      {
        id: 'second',
        sets: ['bno-kol-passed'],
        label: {
          zhCN: '再核对一次通知姓名',
          en: 'Check the name on the notice once more',
        },
        effects: [
          { type: 'lifeInTheUk' },
          { type: 'stat', key: 'mood', delta: 2 },
        ],
        note: {
          zhCN: '同样记录已通过，不模拟报名费或考试过程（SRC-020 HK 61.1）。',
          en: 'Also records a pass; booking fees and the test itself are not simulated (SRC-020 HK 61.1).',
        },
      },
    ],
  },
  {
    id: 'bno-b2-question',
    title: { zhCN: '老师的新课程表', en: 'The teacher’s new timetable' },
    text: {
      zhCN: '语言老师问嘉宁要不要读进阶班，孩子在旁边替大人举手。',
      en: 'The language teacher offers an advanced class; the child volunteers Ka Ning with an enthusiastic hand.',
    },
    weight: 2,
    once: true,
    choices: [
      {
        id: 'plan',
        label: { zhCN: '试试进阶训练', en: 'Try advanced practice' },
        effects: [
          { type: 'stat', key: 'english', delta: 3 },
          { type: 'money', delta: -180 },
        ],
        sets: ['bno-b2-practice'],
      },
      {
        id: 'skip',
        label: {
          zhCN: '先用现有英语证明',
          en: 'Keep the existing English evidence',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
        note: {
          zhCN: '现行法律栏 HK 60.1 仍为 B1，该 Appendix 不在 HC 1691 升 B2 清单内（SRC-020；SRC-007 EM 5.60）；改革栏框架外群体仍适用强化的 B2 与犯罪记录要求（SRC-001 p25–p26）。',
          en: `In the current-law column HK 60.1 still requires ${policy.hongKongBnoSettlementEnglish.value}; this Appendix is outside the HC 1691 B2 list (SRC-020; SRC-007 EM 5.60); in the reform column, groups outside the framework still face enhanced B2 and criminal-record requirements (SRC-001 p25–p26).`,
        },
      },
    ],
  },
  {
    id: 'bno-b2-certificate',
    title: { zhCN: '进阶班的文件袋', en: 'The advanced-class envelope' },
    text: {
      zhCN: '准备了一段时间后，嘉宁拿到进阶考试结果，信封被雨打湿一角。',
      en: 'After a period of preparation, Ka Ning receives the advanced test result; rain wets one corner.',
    },
    weight: 2,
    once: true,
    forbids: ['bno-b2-passed'],
    requires: ['bno-b2-practice'],
    when: [{ stat: 'english', min: balance.englishB2 }],
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '收好本情节已取得的 B2 证明',
          en: 'File the B2 evidence obtained in this scenario',
        },
        effects: [
          { type: 'english', cefrLevel: 'B2' },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
        sets: ['bno-b2-passed'],
        note: {
          zhCN: '额外取得 B2 不改变现行法律栏 HK 60.1 的 B1 要求（SRC-020；SRC-007 EM 5.60）；改革栏框架外群体仍适用强化的 B2 与犯罪记录要求（SRC-001 p25–p26）。',
          en: 'Additional B2 evidence does not change HK 60.1’s B1 requirement in the current-law column (SRC-020; SRC-007 EM 5.60); in the reform column, groups outside the framework still face enhanced B2 and criminal-record requirements (SRC-001 p25–p26).',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '保留现有证明，本次未过继续练习',
          en: 'Keep existing evidence and practise after this unsuccessful test',
        },
        effects: [
          { type: 'stat', key: 'english', delta: 2 },
          { type: 'stat', key: 'mood', delta: -2 },
        ],
        sets: ['bno-b2-failed'],
      },
    ],
  },
  {
    id: 'bno-budget-gap',
    title: { zhCN: '月底的购物篮', en: 'The month-end shopping basket' },
    text: {
      zhCN: '购物篮删到只剩必需品，嘉宁还是把总价重算了一遍。',
      en: 'The basket is down to essentials; Ka Ning still adds up the total again.',
    },
    weight: 2,
    once: true,
    when: [{ yearMin: 2 }],
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '预约咨询 Universal Credit',
          en: 'Arrange advice about Universal Credit',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 1 }],
        sets: ['bno-benefit-advice'],
      },
      {
        id: 'skip',
        label: { zhCN: '这次动用积蓄', en: 'Use savings this time' },
        effects: [
          { type: 'money', delta: -500 },
          { type: 'stat', key: 'mood', delta: -2 },
        ],
      },
    ],
  },
  {
    id: 'bno-benefit-decision',
    title: { zhCN: '咨询后的信封', en: 'The envelope after advice' },
    text: {
      zhCN: '咨询回来，嘉宁把福利信封和存款单并排放在桌上。',
      en: 'Back from advice, Ka Ning lays the benefits envelope beside the savings statement.',
    },
    weight: 2,
    once: true,
    requires: ['bno-benefit-advice'],
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '本情节中已经领取 Universal Credit',
          en: 'In this scenario, Universal Credit was received',
        },
        effects: [
          {
            type: 'benefit',
            benefit: { benefitType: 'UNIVERSAL_CREDIT' },
            startOffsetDays: -90,
            months: 3,
          },
          { type: 'money', delta: 600 },
        ],
        note: {
          zhCN: '本情节假定本人已领取 Universal Credit 并写入时间线的 benefits；是否影响许可条件由引擎按 SRC-006 的 public funds 清单处理。',
          en: 'This scenario assumes the player received Universal Credit and records it in the timeline benefits; whether that affects conditions of permission is left to the engine under the SRC-006 public funds list.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '没有领取，仍用积蓄应付',
          en: 'No benefit was received; use savings',
        },
        effects: [
          { type: 'money', delta: -600 },
          { type: 'stat', key: 'mood', delta: -2 },
        ],
      },
    ],
  },
  {
    id: 'bno-neighbour-noise',
    title: { zhCN: '隔墙的低音炮', en: 'Bass through the wall' },
    text: {
      zhCN: '隔壁音乐响到午夜，嘉宁的茶杯也像跟着打拍子。',
      en: 'Music next door runs past midnight; Ka Ning’s teacup seems to keep the beat.',
    },
    weight: 2,
    once: true,
    choices: [
      {
        id: 'plan',
        label: { zhCN: '约邻居白天谈谈', en: 'Arrange a daytime conversation' },
        effects: [{ type: 'stat', key: 'mood', delta: -2 }],
        sets: ['bno-neighbour-talk'],
      },
      {
        id: 'skip',
        label: { zhCN: '先向房东记下情况', en: 'Document it for the landlord' },
        effects: [{ type: 'stat', key: 'mood', delta: -1 }],
      },
    ],
  },
  {
    id: 'bno-neighbour-outcome',
    title: { zhCN: '走廊里的回声', en: 'An echo in the corridor' },
    text: {
      zhCN: '约好的谈话变成争执，走廊里每句话都响了两遍。',
      en: 'The arranged conversation becomes an argument; every sentence echoes twice in the corridor.',
    },
    weight: 2,
    once: true,
    requires: ['bno-neighbour-talk'],
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '停下来，请人调解',
          en: 'Step back and ask for mediation',
        },
        effects: [{ type: 'stat', key: 'mood', delta: -3 }],
        sets: ['bno-neighbour-peace'],
      },
      {
        id: 'second',
        label: {
          zhCN: '本情节中动手并被定罪',
          en: 'In this scenario, an assault led to conviction',
        },
        effects: [{ type: 'criminal', event: {} }],
        note: {
          zhCN: '记录定罪后由引擎处理；改革栏不在框架内不等于免审犯罪记录（SRC-001 p25–p26；SRC-020 HK 56.1）。',
          en: 'The engine handles the conviction; being outside the reform framework does not remove criminal checks (SRC-001 p25–p26; SRC-020 HK 56.1).',
        },
      },
    ],
  },
  {
    id: 'bno-house-search',
    title: { zhCN: '学校附近的窗户', en: 'A window near the school' },
    text: {
      zhCN: '放学路上出现招租牌，嘉宁看了看窗户，又看了看书包。',
      en: 'A rental sign appears on the school run; Ka Ning looks at the window, then the school bag.',
    },
    weight: 2,
    once: true,
    forbids: ['quarter-housing-change'],
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '约看房，核算搬家费',
          en: 'Arrange a viewing and budget for moving',
        },
        effects: [
          { type: 'money', delta: -40 },
          { type: 'stat', key: 'mood', delta: 2 },
        ],
        sets: ['bno-house-viewing', 'quarter-housing-change'],
      },
      {
        id: 'skip',
        label: { zhCN: '留在现在的住处', en: 'Keep the current home' },
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
        sets: ['quarter-housing-change'],
      },
    ],
  },
  {
    id: 'bno-house-keys',
    title: { zhCN: '新门口的书包', en: 'The school bag at a new door' },
    text: {
      zhCN: '看过的房子留着同样的窗帘，嘉宁坐下来核对最后的合同。',
      en: 'The viewed house still has its curtains; Ka Ning sits down to check the final contract.',
    },
    weight: 2,
    once: true,
    requires: ['bno-house-viewing'],
    forbids: ['quarter-housing-change'],
    choices: [
      {
        id: 'move',
        label: {
          zhCN: '付搬家费，租下更贵的新住处',
          en: 'Pay to move into the more expensive new home',
        },
        effects: [
          { type: 'money', delta: -1100 },
          { type: 'stat', key: 'mood', delta: 5 },
        ],
        sets: ['quarter-housing-change', 'rent-rise-bno', 'bno-house-moved'],
      },
      {
        id: 'stay',
        label: { zhCN: '最后仍决定留下', en: 'Decide to stay after all' },
        effects: [
          { type: 'money', delta: -60 },
          { type: 'stat', key: 'mood', delta: 2 },
        ],
        sets: ['quarter-housing-change'],
      },
    ],
  },
  {
    id: 'bno-salary-review',
    title: { zhCN: '年结单的折角', en: 'A folded annual statement' },
    text: {
      zhCN: '主管把年结单推过来，嘉宁发现自己的名字终于没被拼错。',
      en: 'The manager slides over the annual statement; Ka Ning’s name is finally spelled correctly.',
    },
    weight: 2,
    once: true,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '接下年薪三万六的新安排',
          en: 'Take the new thirty-six-thousand arrangement',
        },
        effects: [
          { type: 'episode', patch: { salary: 36000 } },
          { type: 'stat', key: 'career', delta: 2 },
        ],
        note: {
          zhCN: '记录年薪 £36,000 写入本人时间线；不模拟雇主流程。',
          en: 'Records an annual salary of £36,000 in the player’s timeline; employer procedures are not simulated.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '保留原来工时和工资',
          en: 'Keep the current hours and pay',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
        note: {
          zhCN: '沿用现有工时和工资，记录这次面谈。',
          en: 'Keeps the current hours and pay and records the meeting.',
        },
      },
    ],
  },
  {
    id: 'bno-shorter-hours',
    title: { zhCN: '接送表的新空格', en: 'A gap in the school-run rota' },
    text: {
      zhCN: '课后班时间改了，嘉宁和伴侣拿铅笔重画了一遍接送表。',
      en: 'The after-school club changes its hours; Ka Ning and the partner redraw the collection rota.',
    },
    weight: 2,
    once: true,
    choices: [
      {
        id: 'first',
        label: { zhCN: '暂时减少工作时间', en: 'Reduce working hours for now' },
        effects: [
          { type: 'episode', patch: { salary: 30000 } },
          { type: 'stat', key: 'health', delta: 3 },
        ],
        note: {
          zhCN: '记录年薪 £30,000 写入本人时间线；不模拟雇主流程。',
          en: 'Records an annual salary of £30,000 in the player’s timeline; employer procedures are not simulated.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '维持工作，请人代接',
          en: 'Keep working and pay for collection help',
        },
        effects: [{ type: 'money', delta: -250 }],
        note: {
          zhCN: '记录代接孩子支出 £250，现有工时和工资继续沿用。',
          en: 'Records £250 spent on school collection help and keeps the current hours and pay.',
        },
      },
    ],
  },
  {
    id: 'bno-partner-layoff',
    title: { zhCN: '另一半的通知信', en: 'The partner’s notice' },
    text: {
      zhCN: '伴侣的办公室缩编，通知信比往常的广告还薄。',
      en: 'The partner’s office cuts staff; the notice is thinner than the usual adverts.',
    },
    weight: 2,
    once: true,
    requires: ['bno-partner-working'],
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '陪伴侣熬过失业这阵子',
          en: 'Support the partner through unemployment',
        },
        effects: [{ type: 'stat', key: 'mood', delta: -6 }],
        sets: ['bno-partner-between-jobs'],
        note: {
          zhCN: '只改变心情并记录伴侣的工作经历，不计入本局收入。',
          en: 'Changes mood and records the partner’s work story, without adding income in this game.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '先靠新找到的兼职过渡',
          en: 'Manage for now with the new part-time job',
        },
        effects: [{ type: 'stat', key: 'mood', delta: -2 }],
        note: {
          zhCN: '只改变心情并记录伴侣的工作经历，不计入本局收入。',
          en: 'Changes mood and records the partner’s work story, without adding income in this game.',
        },
      },
    ],
  },
  {
    id: 'bno-partner-restart',
    title: { zhCN: '重新响起的闹钟', en: 'An alarm clock rings again' },
    text: {
      zhCN: '伴侣找到新工作，清晨的闹钟又恢复了二重奏。',
      en: 'The partner finds a new job; the morning alarm clocks become a duet again.',
    },
    weight: 2,
    once: true,
    requires: ['bno-partner-between-jobs'],
    choices: [
      {
        id: 'first',
        label: { zhCN: '全职重新出发', en: 'Restart full-time work' },
        effects: [{ type: 'stat', key: 'mood', delta: 5 }],
        note: {
          zhCN: '只改变心情并记录伴侣的工作经历，不计入本局收入。',
          en: 'Changes mood and records the partner’s work story, without adding income in this game.',
        },
      },
      {
        id: 'second',
        label: { zhCN: '先以较短工时适应', en: 'Ease back with shorter hours' },
        effects: [{ type: 'stat', key: 'mood', delta: 4 }],
        note: {
          zhCN: '只改变心情并记录伴侣的工作经历，不计入本局收入。',
          en: 'Changes mood and records the partner’s work story, without adding income in this game.',
        },
      },
    ],
  },
  {
    id: 'bno-own-contract',
    title: { zhCN: '试用期结束', en: 'Probation ends' },
    text: {
      zhCN: '试用期结束，嘉宁的主管递来合同，手里还捏着半块饼干。',
      en: 'At the end of probation, the manager hands over a contract while holding half a biscuit.',
    },
    weight: 2,
    once: true,
    when: [{ yearMin: 2 }],
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '接受年薪三万五的岗位',
          en: 'Accept a thirty-five-thousand role',
        },
        effects: [
          { type: 'episode', patch: { salary: 35000 } },
          { type: 'stat', key: 'career', delta: 3 },
        ],
        note: {
          zhCN: '记录年薪 £35,000 写入本人时间线；不模拟雇主流程。',
          en: 'Records an annual salary of £35,000 in the player’s timeline; employer procedures are not simulated.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '选择较少工时的安排',
          en: 'Choose the shorter-hours arrangement',
        },
        effects: [
          { type: 'episode', patch: { salary: 31000 } },
          { type: 'stat', key: 'health', delta: 4 },
        ],
        note: {
          zhCN: '记录年薪 £31,000 写入本人时间线；不模拟雇主流程。',
          en: 'Records an annual salary of £31,000 in the player’s timeline; employer procedures are not simulated.',
        },
      },
    ],
  },
  {
    id: 'bno-project-month',
    title: { zhCN: '项目结束的外卖盒', en: 'Takeaway boxes after a project' },
    text: {
      zhCN: '项目收尾了，会议室里最后留下的是一排空外卖盒。',
      en: 'The project wraps up; a row of empty takeaway boxes is the last thing left in the meeting room.',
    },
    weight: 2,
    once: true,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '接下额外项目，忙完这一轮',
          en: 'Take the extra project and finish this round',
        },
        effects: [
          { type: 'income', taxYear: 'current', earnings: 39000 },
          { type: 'stat', key: 'health', delta: -3 },
        ],
        note: {
          zhCN: '记录本税年本人全年税前收入 £39,000；不模拟雇主流程。',
          en: 'Records £39,000 in the player’s annual gross earnings for this tax year; employer procedures are not simulated.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '守住正常工时，留点空闲',
          en: 'Keep normal hours and some free time',
        },
        effects: [
          { type: 'income', taxYear: 'current', earnings: 34000 },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
        note: {
          zhCN: '记录本税年本人全年税前收入 £34,000；不模拟雇主流程。',
          en: 'Records £34,000 in the player’s annual gross earnings for this tax year; employer procedures are not simulated.',
        },
      },
    ],
  },
  {
    id: 'bno-cafe-manager',
    title: { zhCN: '店门口的新钥匙', en: 'A new key to the café' },
    text: {
      zhCN: '老板把值班钥匙递给嘉宁，钥匙圈比整串钥匙还大。',
      en: 'The owner offers Ka Ning the duty key; the key ring is bigger than the keys.',
    },
    weight: 2,
    once: true,
    requires: ['bno-cafe-regular'],
    when: [{ yearMin: 3 }],
    choices: [
      {
        id: 'first',
        label: { zhCN: '接下值班经理岗位', en: 'Take the duty-manager role' },
        effects: [
          { type: 'income', taxYear: 'current', earnings: 40000 },
          { type: 'stat', key: 'career', delta: 4 },
        ],
        note: {
          zhCN: '记录本税年本人全年税前收入 £40,000，主业合同继续沿用；不模拟雇主流程。',
          en: 'Records £40,000 in the player’s annual gross earnings for this tax year and keeps the main-job contract; employer procedures are not simulated.',
        },
      },
      {
        id: 'second',
        label: { zhCN: '继续只做现在的班次', en: 'Keep the existing shifts' },
        effects: [{ type: 'stat', key: 'mood', delta: 4 }],
        note: {
          zhCN: '沿用现有班次，记录和老板的商量。',
          en: 'Keeps the existing shifts and records the discussion with the owner.',
        },
      },
    ],
  },
  {
    id: 'bno-quiet-career',
    title: { zhCN: '放慢一点的约定', en: 'An agreement to slow down' },
    text: {
      zhCN: '孩子问晚饭能不能早点吃，嘉宁把工作群调成了静音。',
      en: 'The child asks for an earlier dinner; Ka Ning mutes the work group.',
    },
    weight: 2,
    once: true,
    when: [{ yearMin: 5 }],
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '接受较低工资换稳定工时',
          en: 'Trade some pay for steadier hours',
        },
        effects: [
          { type: 'episode', patch: { salary: 32000 } },
          { type: 'stat', key: 'health', delta: 4 },
        ],
        note: {
          zhCN: '记录年薪 £32,000 写入本人时间线；不模拟雇主流程。',
          en: 'Records an annual salary of £32,000 in the player’s timeline; employer procedures are not simulated.',
        },
      },
      {
        id: 'second',
        label: { zhCN: '维持现在的合同', en: 'Keep the current contract' },
        effects: [{ type: 'stat', key: 'mood', delta: 1 }],
        note: {
          zhCN: '沿用现有合同，记录这次家庭商量。',
          en: 'Keeps the current contract and records the family discussion.',
        },
      },
    ],
  },
  {
    id: 'bno-hk-wedding',
    title: { zhCN: '喜帖里的金粉', en: 'Glitter in a wedding invitation' },
    text: {
      zhCN: '从香港婚礼回来，嘉宁收好喜帖，金粉又洒进了早餐麦片旁。',
      en: 'Back from the Hong Kong wedding, Ka Ning files the invitation and scatters glitter beside the breakfast cereal.',
    },
    weight: 2,
    once: true,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '已经回港参加两周婚礼行程',
          en: 'Record a completed fortnight for the wedding',
        },
        effects: [
          { type: 'absence', startOffsetDays: -14, days: 14 },
          { type: 'money', delta: -800 },
          { type: 'stat', key: 'mood', delta: 5 },
        ],
        note: {
          zhCN: '记录已经归来的实际离境，连续居留后果交给引擎计算（SRC-020 HK 63.1；SRC-008 CR 3.1）。',
          en: 'Records a completed absence; the engine assesses continuous residence (SRC-020 HK 63.1; SRC-008 CR 3.1).',
        },
      },
      {
        id: 'second',
        label: { zhCN: '只回去一周', en: 'The visit lasted one week' },
        effects: [
          { type: 'absence', startOffsetDays: -7, days: 7 },
          { type: 'money', delta: -650 },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
        note: {
          zhCN: '记录已经归来的实际离境，连续居留后果交给引擎计算（SRC-020 HK 63.1；SRC-008 CR 3.1）。',
          en: 'Records a completed absence; the engine assesses continuous residence (SRC-020 HK 63.1; SRC-008 CR 3.1).',
        },
      },
    ],
  },
  {
    id: 'bno-care-rota',
    title: { zhCN: '病房外的轮班表', en: 'A care rota outside the ward' },
    text: {
      zhCN: '家人回顾这次照顾父亲的分工，嘉宁的车票还夹在手机壳里。',
      en: 'The family reviews the recent care rota for Ka Ning’s father; a ticket remains in the phone case.',
    },
    weight: 2,
    once: true,
    when: [{ yearMin: 3 }],
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '陪父亲在海外住了四个月',
          en: 'Spent four months abroad caring for Dad',
        },
        effects: [
          { type: 'absence', startOffsetDays: -120, days: 120 },
          { type: 'money', delta: -1000 },
          { type: 'stat', key: 'health', delta: -5 },
        ],
        note: {
          zhCN: '记录已经归来的实际离境，连续居留后果交给引擎计算（SRC-020 HK 63.1；SRC-008 CR 3.1）。',
          en: 'Records a completed absence; the engine assesses continuous residence (SRC-020 HK 63.1; SRC-008 CR 3.1).',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '和亲人轮班，陪住了一个月',
          en: 'Shared the care and stayed for one month',
        },
        effects: [
          { type: 'absence', startOffsetDays: -30, days: 30 },
          { type: 'money', delta: -700 },
          { type: 'stat', key: 'health', delta: -2 },
        ],
        note: {
          zhCN: '记录已经归来的实际离境，连续居留后果交给引擎计算（SRC-020 HK 63.1；SRC-008 CR 3.1）。',
          en: 'Records a completed absence; the engine assesses continuous residence (SRC-020 HK 63.1; SRC-008 CR 3.1).',
        },
      },
    ],
  },
  {
    id: 'bno-school-trip-abroad',
    title: { zhCN: '护照套里的贴纸', en: 'Stickers inside the passport cover' },
    text: {
      zhCN: '陪孩子的海外比赛结束了，护照套里多了一张奖牌贴纸。',
      en: 'The child’s overseas competition is over; a medal sticker joins the passport cover.',
    },
    weight: 2,
    once: true,
    when: [{ yearMin: 2 }],
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '全程陪同了三周',
          en: 'Record three weeks accompanying the child',
        },
        effects: [
          { type: 'absence', startOffsetDays: -21, days: 21 },
          { type: 'money', delta: -600 },
          { type: 'stat', key: 'mood', delta: 5 },
        ],
        note: {
          zhCN: '记录已经归来的实际离境，连续居留后果交给引擎计算（SRC-020 HK 63.1；SRC-008 CR 3.1）。',
          en: 'Records a completed absence; the engine assesses continuous residence (SRC-020 HK 63.1; SRC-008 CR 3.1).',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '只在最后一周到场',
          en: 'Record attendance for the final week',
        },
        effects: [
          { type: 'absence', startOffsetDays: -7, days: 7 },
          { type: 'money', delta: -450 },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
        note: {
          zhCN: '记录已经归来的实际离境，连续居留后果交给引擎计算（SRC-020 HK 63.1；SRC-008 CR 3.1）。',
          en: 'Records a completed absence; the engine assesses continuous residence (SRC-020 HK 63.1; SRC-008 CR 3.1).',
        },
      },
    ],
  },
  {
    id: 'bno-anniversary-hk',
    title: { zhCN: '旧街道的新招牌', en: 'New signs on an old street' },
    text: {
      zhCN: '回港纪念日小旅行结束，嘉宁手机里拍满了街角的新招牌。',
      en: 'A small anniversary trip to Hong Kong ends with a phone full of changed shop signs.',
    },
    weight: 2,
    once: true,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '两个人在香港度过了十天假期',
          en: 'Spent ten days away together',
        },
        effects: [
          { type: 'absence', startOffsetDays: -10, days: 10 },
          { type: 'money', delta: -900 },
          { type: 'stat', key: 'mood', delta: 6 },
        ],
        note: {
          zhCN: '记录已经归来的实际离境，连续居留后果交给引擎计算（SRC-020 HK 63.1；SRC-008 CR 3.1）。',
          en: 'Records a completed absence; the engine assesses continuous residence (SRC-020 HK 63.1; SRC-008 CR 3.1).',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '多陪陪家人，住满了一个月',
          en: 'Stayed a full month with the family',
        },
        effects: [
          { type: 'absence', startOffsetDays: -30, days: 30 },
          { type: 'money', delta: -1100 },
          { type: 'stat', key: 'mood', delta: 7 },
        ],
        note: {
          zhCN: '记录已经归来的实际离境，连续居留后果交给引擎计算（SRC-020 HK 63.1；SRC-008 CR 3.1）。',
          en: 'Records a completed absence; the engine assesses continuous residence (SRC-020 HK 63.1; SRC-008 CR 3.1).',
        },
      },
    ],
  },
  {
    id: 'bno-passport-renewal-trip',
    title: {
      zhCN: '证件照的僵硬笑容',
      en: 'A stiff smile in a passport photo',
    },
    text: {
      zhCN: '办证之旅回来了，嘉宁对照片里的自己仍然很不满意。',
      en: 'Ka Ning returns from a document trip, still unimpressed by the passport-photo smile.',
    },
    weight: 2,
    once: true,
    when: [{ yearMin: 4 }],
    choices: [
      {
        id: 'first',
        label: { zhCN: '这次海外停留了十天', en: 'Record ten days abroad' },
        effects: [
          { type: 'absence', startOffsetDays: -10, days: 10 },
          { type: 'money', delta: -600 },
          { type: 'stat', key: 'mood', delta: -1 },
        ],
        note: {
          zhCN: '记录已经归来的实际离境，连续居留后果交给引擎计算（SRC-020 HK 63.1；SRC-008 CR 3.1）。',
          en: 'Records a completed absence; the engine assesses continuous residence (SRC-020 HK 63.1; SRC-008 CR 3.1).',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '顺道探亲，共住三周',
          en: 'Record three weeks including family visits',
        },
        effects: [
          { type: 'absence', startOffsetDays: -21, days: 21 },
          { type: 'money', delta: -750 },
          { type: 'stat', key: 'mood', delta: 4 },
        ],
        note: {
          zhCN: '记录已经归来的实际离境，连续居留后果交给引擎计算（SRC-020 HK 63.1；SRC-008 CR 3.1）。',
          en: 'Records a completed absence; the engine assesses continuous residence (SRC-020 HK 63.1; SRC-008 CR 3.1).',
        },
      },
    ],
  },
  {
    id: 'bno-farewell-trip',
    title: { zhCN: '离别饭的最后一碗', en: 'The last bowl at a farewell meal' },
    text: {
      zhCN: '海外朋友搬走前的饭局结束了，嘉宁把合照设成手机壁纸。',
      en: 'The overseas friend’s farewell dinner is over; Ka Ning makes the group photo the phone wallpaper.',
    },
    weight: 2,
    once: true,
    when: [{ yearMin: 6 }],
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '陪朋友度过了告别前的一周',
          en: 'Spent a week with the friend before the farewell',
        },
        effects: [
          { type: 'absence', startOffsetDays: -7, days: 7 },
          { type: 'money', delta: -450 },
          { type: 'stat', key: 'mood', delta: 4 },
        ],
        note: {
          zhCN: '记录已经归来的实际离境，连续居留后果交给引擎计算（SRC-020 HK 63.1；SRC-008 CR 3.1）。',
          en: 'Records a completed absence; the engine assesses continuous residence (SRC-020 HK 63.1; SRC-008 CR 3.1).',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '多住一周帮忙打包',
          en: 'Stayed another week to help pack',
        },
        effects: [
          { type: 'absence', startOffsetDays: -14, days: 14 },
          { type: 'money', delta: -550 },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
        note: {
          zhCN: '记录已经归来的实际离境，连续居留后果交给引擎计算（SRC-020 HK 63.1；SRC-008 CR 3.1）。',
          en: 'Records a completed absence; the engine assesses continuous residence (SRC-020 HK 63.1; SRC-008 CR 3.1).',
        },
      },
    ],
  },
  {
    id: 'bno-long-family-summer',
    title: { zhCN: '忘在香港的外套', en: 'A coat left in Hong Kong' },
    text: {
      zhCN: '一整个长假回来，嘉宁才发现外套留在了亲戚家的衣柜。',
      en: 'Back from an extended family summer, Ka Ning realises the coat is still in a relative’s wardrobe.',
    },
    weight: 2,
    once: true,
    when: [{ yearMin: 4 }],
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '在亲戚家住了半年多',
          en: 'Stayed with relatives for just over six months',
        },
        effects: [
          { type: 'absence', startOffsetDays: -185, days: 185 },
          { type: 'money', delta: -1400 },
          { type: 'stat', key: 'mood', delta: 6 },
        ],
        note: {
          zhCN: '记录已经归来的实际离境，连续居留后果交给引擎计算（SRC-020 HK 63.1；SRC-008 CR 3.1）。',
          en: 'Records a completed absence; the engine assesses continuous residence (SRC-020 HK 63.1; SRC-008 CR 3.1).',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '实际分成短住，这次仅两周',
          en: 'The actual stay was a short fortnight',
        },
        effects: [
          { type: 'absence', startOffsetDays: -14, days: 14 },
          { type: 'money', delta: -700 },
          { type: 'stat', key: 'mood', delta: 4 },
        ],
        note: {
          zhCN: '记录已经归来的实际离境，连续居留后果交给引擎计算（SRC-020 HK 63.1；SRC-008 CR 3.1）。',
          en: 'Records a completed absence; the engine assesses continuous residence (SRC-020 HK 63.1; SRC-008 CR 3.1).',
        },
      },
    ],
  },
  {
    id: 'bno-benefit-second-envelope',
    title: { zhCN: '另一个薄信封', en: 'Another thin envelope' },
    text: {
      zhCN: '账单又挤到同一天，嘉宁把之前的咨询笔记翻了出来。',
      en: 'Bills cluster on one day again; Ka Ning finds the old advice notes.',
    },
    weight: 2,
    once: true,
    requires: ['bno-benefit-advice'],
    when: [{ yearMin: 5 }],
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '本情节中本季领取 Universal Credit',
          en: 'In this scenario, receive Universal Credit this quarter',
        },
        effects: [
          {
            type: 'benefit',
            benefit: { benefitType: 'UNIVERSAL_CREDIT' },
            startOffsetDays: 0,
            months: 3,
          },
          { type: 'money', delta: 500 },
        ],
        note: {
          zhCN: '本情节假定本人已领取 Universal Credit 并写入时间线的 benefits；是否影响许可条件由引擎按 SRC-006 的 public funds 清单处理。',
          en: 'This scenario assumes the player received Universal Credit and records it in the timeline benefits; whether that affects conditions of permission is left to the engine under the SRC-006 public funds list.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '本季没有领取，动用存款',
          en: 'Receive none this quarter and draw on savings',
        },
        effects: [
          { type: 'money', delta: -500 },
          { type: 'stat', key: 'mood', delta: -2 },
        ],
      },
    ],
  },
  {
    id: 'bno-paid-debt',
    title: { zhCN: '夹在菜单里的通知', en: 'A notice among takeaway menus' },
    text: {
      zhCN: '政府欠款通知躲在外卖菜单后，嘉宁擦桌子时才看见。',
      en: 'A government-debt notice hides behind takeaway menus until Ka Ning clears the table.',
    },
    weight: 2,
    once: true,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '付清本情节中的欠款',
          en: 'Clear the debt in this scenario',
        },
        effects: [
          { type: 'money', delta: -240 },
          {
            type: 'timeline',
            patch: { governmentDebt: { outstanding: false } },
          },
        ],
        note: {
          zhCN: '只记录政府欠款是否结清，由引擎计算后果。',
          en: 'Records whether government debt is cleared; the engine calculates consequences.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '本情节中仍有未清余额',
          en: 'In this scenario, leave an outstanding balance',
        },
        effects: [
          {
            type: 'timeline',
            patch: { governmentDebt: { outstanding: true } },
          },
          { type: 'stat', key: 'mood', delta: -2 },
        ],
        note: {
          zhCN: '记录仍有政府欠款，不推定任何许可已经失效。',
          en: 'Records outstanding government debt without presuming permission has expired.',
        },
      },
    ],
  },
  {
    id: 'bno-english-retest',
    title: { zhCN: '换了一张考桌', en: 'A different exam desk' },
    text: {
      zhCN: '复习后的考试又结束了，嘉宁这次没把水瓶忘在考场。',
      en: 'Another test after revision is over; this time Ka Ning remembers the water bottle.',
    },
    weight: 2,
    once: true,
    forbids: ['bno-b2-passed'],
    requires: ['bno-b2-practice', 'bno-b2-failed'],
    when: [{ stat: 'english', min: balance.englishB2 }, { yearMin: 3 }],
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '收好这次通过的 B2 证明',
          en: 'File the B2 evidence from this pass',
        },
        effects: [
          { type: 'english', cefrLevel: 'B2' },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
        sets: ['bno-b2-passed'],
        note: {
          zhCN: '本情节假定通过，现行法律栏 HK 60.1 仍为 B1（SRC-020）；改革栏框架外群体仍适用强化的 B2 与犯罪记录要求（SRC-001 p25–p26）。',
          en: 'This scenario assumes a pass; HK 60.1 still requires B1 in the current-law column (SRC-020); in the reform column, groups outside the framework still face enhanced B2 and criminal-record requirements (SRC-001 p25–p26).',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '这次没过，继续练习',
          en: 'Keep practising after this unsuccessful test',
        },
        effects: [
          { type: 'stat', key: 'english', delta: 2 },
          { type: 'stat', key: 'mood', delta: -2 },
        ],
        sets: ['bno-b2-failed'],
      },
    ],
  },
  {
    id: 'bno-kol-copy',
    title: { zhCN: '文件夹里的第二份', en: 'A second copy in the folder' },
    text: {
      zhCN: '嘉宁整理旧邮件，找回了已经通过的 Life in the UK 通知。',
      en: 'Sorting old emails, Ka Ning finds the notice of an already-passed Life in the UK test.',
    },
    weight: 2,
    once: true,
    requires: ['bno-kol-passed'],
    when: [{ yearMin: 4 }],
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '把通过记录存进文件夹',
          en: 'Save the pass record in the folder',
        },
        effects: [
          { type: 'lifeInTheUk' },
          { type: 'stat', key: 'mood', delta: 2 },
        ],
        note: {
          zhCN: '找回既有通过证明；要求见 SRC-020 HK 61.1。',
          en: 'Recovers existing pass evidence; the requirement is SRC-020 HK 61.1.',
        },
      },
      {
        id: 'second',
        label: { zhCN: '也存一份电子副本', en: 'Save a digital copy as well' },
        effects: [
          { type: 'lifeInTheUk' },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
        note: {
          zhCN: '同样记录本情节已通过，未模拟重新考试（SRC-020 HK 61.1）。',
          en: 'Also records the scenario’s existing pass, without simulating a new test (SRC-020 HK 61.1).',
        },
      },
    ],
  },
  {
    id: 'bno-new-employer',
    title: { zhCN: '公交通勤的新路线', en: 'A new bus route to work' },
    text: {
      zhCN: '新雇主的办公室换了方向，嘉宁在公交站研究了半天地图。',
      en: 'The new employer’s office lies in the other direction; Ka Ning studies the bus-stop map.',
    },
    weight: 2,
    once: true,
    when: [{ yearMin: 3 }],
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '接受年薪三万八的新合同',
          en: 'Accept a thirty-eight-thousand contract',
        },
        effects: [
          { type: 'episode', patch: { salary: 38000 } },
          { type: 'stat', key: 'career', delta: 3 },
        ],
        note: {
          zhCN: '记录年薪 £38,000 写入本人时间线；不模拟雇主流程。',
          en: 'Records an annual salary of £38,000 in the player’s timeline; employer procedures are not simulated.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '接受工时较少的合同',
          en: 'Accept a shorter-hours contract',
        },
        effects: [
          { type: 'episode', patch: { salary: 33000 } },
          { type: 'stat', key: 'health', delta: 3 },
        ],
        note: {
          zhCN: '记录年薪 £33,000 写入本人时间线；不模拟雇主流程。',
          en: 'Records an annual salary of £33,000 in the player’s timeline; employer procedures are not simulated.',
        },
      },
    ],
  },
  {
    id: 'bno-school-shoes',
    title: { zhCN: '突然变小的鞋', en: 'Shoes that suddenly shrank' },
    text: {
      zhCN: '孩子说鞋子变小了，嘉宁怀疑是脚长得太有计划。',
      en: 'The child says the shoes shrank; Ka Ning suspects a remarkably organised growth spurt.',
    },
    weight: 2,
    once: true,
    season: 4,
    choices: [
      {
        id: 'first',
        label: { zhCN: '买合脚的新鞋', en: 'Buy shoes that fit' },
        effects: [{ type: 'money', delta: -45 }],
      },
      {
        id: 'second',
        label: {
          zhCN: '先去找二手校服交换',
          en: 'Try the second-hand uniform exchange',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
      },
    ],
  },
  {
    id: 'bno-canteen-menu',
    title: { zhCN: '菜单上的陌生词', en: 'An unfamiliar word on the menu' },
    text: {
      zhCN: '学校菜单写着一个嘉宁没见过的词，孩子说反正配土豆。',
      en: 'A new word appears on the school menu; the child says it comes with potatoes anyway.',
    },
    weight: 2,
    once: true,
    choices: [
      {
        id: 'first',
        label: { zhCN: '一起查明白菜名', en: 'Look up the dish together' },
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
      },
      {
        id: 'second',
        label: {
          zhCN: '请孩子画出来解释',
          en: 'Ask the child to draw an explanation',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
      },
    ],
  },
  {
    id: 'bno-reading-aloud',
    title: { zhCN: '倒过来的绘本', en: 'An upside-down picture book' },
    text: {
      zhCN: '睡前读到第三页，嘉宁才发现孩子一直把书拿倒了。',
      en: 'Three pages into bedtime reading, Ka Ning notices the child’s book has been upside down.',
    },
    weight: 2,
    once: true,
    choices: [
      {
        id: 'first',
        label: { zhCN: '换孩子读一段', en: 'Let the child read a page' },
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
      },
      {
        id: 'second',
        label: {
          zhCN: '重新从头演一遍',
          en: 'Act out the story from the start',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 4 }],
      },
    ],
  },
  {
    id: 'bno-sports-day',
    title: { zhCN: '草地上的豆袋', en: 'Beanbags on the grass' },
    text: {
      zhCN: '运动会家长组要夹豆袋，嘉宁的认真表情逗笑了孩子。',
      en: 'Parents must balance beanbags at sports day; Ka Ning’s serious face makes the child laugh.',
    },
    weight: 2,
    once: true,
    season: 3,
    choices: [
      {
        id: 'first',
        label: { zhCN: '参加家长接力', en: 'Join the parents’ relay' },
        effects: [{ type: 'stat', key: 'health', delta: 3 }],
      },
      {
        id: 'second',
        label: { zhCN: '坐在边上大声加油', en: 'Cheer from the sidelines' },
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
      },
    ],
  },
  {
    id: 'bno-school-play',
    title: { zhCN: '纸板做的树', en: 'A cardboard tree' },
    text: {
      zhCN: '孩子在学校戏剧里演一棵树，坚持树也需要排练。',
      en: 'The child plays a tree in the school show and insists trees need rehearsals too.',
    },
    weight: 2,
    once: true,
    season: 4,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '陪着练风吹树叶',
          en: 'Rehearse leaves moving in the wind',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 4 }],
      },
      {
        id: 'second',
        label: {
          zhCN: '帮忙读老师的剧本',
          en: 'Help read the teacher’s script',
        },
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
      },
    ],
  },
  {
    id: 'bno-lost-jumper',
    title: { zhCN: '第二件蓝毛衣', en: 'A second blue jumper' },
    text: {
      zhCN: '失物箱里躺着七件一样的蓝毛衣，嘉宁认出了自己的针脚。',
      en: 'Seven identical blue jumpers fill lost property; Ka Ning recognises the stitching.',
    },
    weight: 2,
    once: true,
    choices: [
      {
        id: 'first',
        label: { zhCN: '把姓名标签重新缝好', en: 'Sew the name label back on' },
        effects: [{ type: 'stat', key: 'mood', delta: 2 }],
      },
      {
        id: 'second',
        label: { zhCN: '请办公室帮忙登记', en: 'Ask the office to log it' },
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
      },
    ],
  },
  {
    id: 'bno-school-photo',
    title: { zhCN: '照片里的缺牙笑', en: 'A gap-toothed school photograph' },
    text: {
      zhCN: '学校照片送到，孩子少了一颗牙，笑容却比去年更满。',
      en: 'The school photograph arrives: one tooth missing, a bigger smile than last year.',
    },
    weight: 2,
    once: true,
    choices: [
      {
        id: 'first',
        label: { zhCN: '买一张留给外婆', en: 'Buy a copy for grandma' },
        effects: [{ type: 'money', delta: -18 }],
      },
      {
        id: 'second',
        label: {
          zhCN: '把电子样张放进家庭相册',
          en: 'Put the preview in the family album',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
      },
    ],
  },
  {
    id: 'bno-school-email',
    title: {
      zhCN: '一晚上的三封邮件',
      en: 'Three school emails in one evening',
    },
    text: {
      zhCN: '学校连发三封邮件，嘉宁先读了最短的那封，结果是广告。',
      en: 'Three school emails arrive; Ka Ning reads the shortest first and finds an advert.',
    },
    weight: 2,
    once: true,
    choices: [
      {
        id: 'first',
        label: { zhCN: '慢慢读完另两封', en: 'Read the other two slowly' },
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
      },
      {
        id: 'second',
        label: {
          zhCN: '和伴侣分着读',
          en: 'Split the reading with the partner',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 2 }],
      },
    ],
  },
  {
    id: 'bno-cafe-toast',
    title: { zhCN: '菠萝包的碎屑', en: 'Crumbs from a pineapple bun' },
    text: {
      zhCN: '茶餐厅桌上落满面包屑，嘉宁把热茶往里挪了挪。',
      en: 'Crumbs cover the café table; Ka Ning nudges the hot tea away from the edge.',
    },
    weight: 2,
    once: true,
    choices: [
      {
        id: 'first',
        label: { zhCN: '留一会儿聊聊天', en: 'Stay for a little conversation' },
        effects: [{ type: 'stat', key: 'mood', delta: 4 }],
      },
      {
        id: 'second',
        label: { zhCN: '打包一份带回家', en: 'Take a portion home' },
        effects: [{ type: 'money', delta: -8 }],
      },
    ],
  },
  {
    id: 'bno-cafe-queue',
    title: { zhCN: '排队时的闲聊', en: 'A conversation in the queue' },
    text: {
      zhCN: '午餐队伍绕过门口，嘉宁和前面的人聊起最近的雨。',
      en: 'The lunch queue curls outside; Ka Ning chats with the person ahead about the rain.',
    },
    weight: 2,
    once: true,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '继续聊本地好去处',
          en: 'Ask about favourite local places',
        },
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
      },
      {
        id: 'second',
        label: { zhCN: '换家人少的店', en: 'Try somewhere quieter' },
        effects: [{ type: 'stat', key: 'mood', delta: 2 }],
      },
    ],
  },
  {
    id: 'bno-recipe-call',
    title: { zhCN: '视频里的半碗面粉', en: 'Half a bowl of flour on video' },
    text: {
      zhCN: '父亲隔着屏幕说面粉放一点，嘉宁问一点究竟是多大一点。',
      en: 'Dad says to add a little flour over video; Ka Ning asks how large a little is.',
    },
    weight: 2,
    once: true,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '照着镜头慢慢学',
          en: 'Learn slowly over the video call',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 4 }],
      },
      {
        id: 'second',
        label: {
          zhCN: '今晚先做简单晚饭',
          en: 'Make a simpler dinner tonight',
        },
        effects: [{ type: 'stat', key: 'health', delta: 2 }],
      },
    ],
  },
  {
    id: 'bno-partner-umbrella',
    title: { zhCN: '两个人一把伞', en: 'One umbrella for two' },
    text: {
      zhCN: '伴侣忘带伞，嘉宁去车站接人，回家时左肩右肩都湿了。',
      en: 'The partner forgets an umbrella; Ka Ning meets them at the station and both shoulders get soaked.',
    },
    weight: 2,
    once: true,
    season: 4,
    choices: [
      {
        id: 'first',
        label: { zhCN: '回家煮热汤', en: 'Make hot soup at home' },
        effects: [{ type: 'stat', key: 'health', delta: 3 }],
      },
      {
        id: 'second',
        label: { zhCN: '路上买杯热饮', en: 'Buy warm drinks on the way' },
        effects: [{ type: 'money', delta: -9 }],
      },
    ],
  },
  {
    id: 'bno-partner-cinema',
    title: { zhCN: '没听懂的笑点', en: 'The joke that got away' },
    text: {
      zhCN: '电影院全场大笑，嘉宁慢了半拍，伴侣已经在耳边解释。',
      en: 'The cinema bursts out laughing; Ka Ning catches up as the partner whispers the joke.',
    },
    weight: 2,
    once: true,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '回家再聊那段台词',
          en: 'Discuss the line on the way home',
        },
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
      },
      {
        id: 'second',
        label: { zhCN: '笑着承认刚才没听懂', en: 'Laugh and admit missing it' },
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
      },
    ],
  },
  {
    id: 'bno-parents-weather',
    title: { zhCN: '两个城市的天气', en: 'Weather in two cities' },
    text: {
      zhCN: '父母每天问冷不冷，嘉宁干脆把天气预报发进了家庭群。',
      en: 'The parents ask about the cold every day; Ka Ning shares the forecast in the family chat.',
    },
    weight: 2,
    once: true,
    season: 1,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '拍张穿外套的照片',
          en: 'Send a photograph wearing a coat',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
      },
      {
        id: 'second',
        label: {
          zhCN: '约一次长点的视频通话',
          en: 'Arrange a longer video call',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 4 }],
      },
    ],
  },
  {
    id: 'bno-grocery-substitute',
    title: { zhCN: '冰箱里的替补队员', en: 'Substitutes in the fridge' },
    text: {
      zhCN: '超市缺货，嘉宁拿陌生蔬菜替补，晚饭像临时组队。',
      en: 'The shop is out of the usual vegetables; dinner becomes a team of unfamiliar substitutes.',
    },
    weight: 2,
    once: true,
    choices: [
      {
        id: 'first',
        label: { zhCN: '试做一道新菜', en: 'Try cooking something new' },
        effects: [{ type: 'stat', key: 'health', delta: 3 }],
      },
      {
        id: 'second',
        label: { zhCN: '查查包装上的做法', en: 'Read the cooking suggestions' },
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
      },
    ],
  },
  {
    id: 'bno-heating-meter',
    title: { zhCN: '像跑步的电表', en: 'A meter going for a run' },
    text: {
      zhCN: '暖气一开，电表的数字像穿上了跑鞋。',
      en: 'The heating comes on and the meter readings seem to put on running shoes.',
    },
    weight: 2,
    once: true,
    season: 1,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '多开一阵把屋子暖透',
          en: 'Keep it on until the house warms',
        },
        effects: [{ type: 'money', delta: -160 }],
      },
      {
        id: 'second',
        label: {
          zhCN: '加件衣服早点钻被窝',
          en: 'Add a layer and go to bed early',
        },
        effects: [{ type: 'stat', key: 'health', delta: 2 }],
      },
    ],
  },
  {
    id: 'bno-draught-strip',
    title: { zhCN: '门缝里的口哨', en: 'A whistle through the door' },
    text: {
      zhCN: '门缝每晚吹口哨，嘉宁终于找到声音的主唱。',
      en: 'The door gap whistles every night; Ka Ning finally locates the lead singer.',
    },
    weight: 2,
    once: true,
    season: 1,
    choices: [
      {
        id: 'first',
        label: { zhCN: '买密封条补一补', en: 'Buy a draught strip' },
        effects: [{ type: 'money', delta: -22 }],
      },
      {
        id: 'second',
        label: { zhCN: '请房东来看看', en: 'Ask the landlord to inspect it' },
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
      },
    ],
  },
  {
    id: 'bno-boiler-wait',
    title: { zhCN: '锅炉前的保温杯', en: 'A flask beside the boiler' },
    text: {
      zhCN: '等维修工的下午，嘉宁抱着保温杯，孩子裹得像一只饭团。',
      en: 'Waiting for the repairer, Ka Ning holds a flask while the child looks like a blanket-wrapped rice ball.',
    },
    weight: 2,
    once: true,
    season: 1,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '一起在客厅读书',
          en: 'Read together in the living room',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
      },
      {
        id: 'second',
        label: { zhCN: '出去走走等回电', en: 'Go for a walk while waiting' },
        effects: [{ type: 'stat', key: 'health', delta: 2 }],
      },
    ],
  },
  {
    id: 'bno-garden-herbs',
    title: { zhCN: '窗台上的葱', en: 'Spring onions on the sill' },
    text: {
      zhCN: '水杯里的葱根冒了芽，孩子宣布自己开了农场。',
      en: 'Spring onions sprout in a glass; the child announces the opening of a farm.',
    },
    weight: 2,
    once: true,
    season: 2,
    choices: [
      {
        id: 'first',
        label: { zhCN: '一起换个大花盆', en: 'Move them to a larger pot' },
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
      },
      {
        id: 'second',
        label: {
          zhCN: '去公园看看真花园',
          en: 'Visit the park’s bigger garden',
        },
        effects: [{ type: 'stat', key: 'health', delta: 3 }],
      },
    ],
  },
  {
    id: 'bno-rain-school-run',
    title: { zhCN: '斜着下的雨', en: 'Rain falling sideways' },
    text: {
      zhCN: '放学路上的雨是斜着下的，嘉宁觉得伞需要考个驾照。',
      en: 'Rain falls sideways on the school run; Ka Ning thinks the umbrella needs driving lessons.',
    },
    weight: 2,
    once: true,
    season: 4,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '回家换干衣服歇一歇',
          en: 'Change into dry clothes and rest',
        },
        effects: [{ type: 'stat', key: 'health', delta: 3 }],
      },
      {
        id: 'second',
        label: { zhCN: '请朋友顺路捎一程', en: 'Ask a friend for a lift' },
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
      },
    ],
  },
  {
    id: 'bno-bus-accent',
    title: { zhCN: '公交车上的新口音', en: 'A new accent on the bus' },
    text: {
      zhCN: '司机说了一句玩笑，嘉宁直到下一站才听明白。',
      en: 'The bus driver makes a joke; Ka Ning understands it at the next stop.',
    },
    weight: 2,
    once: true,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '下次上车接着聊',
          en: 'Continue the chat on the next ride',
        },
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
      },
      {
        id: 'second',
        label: { zhCN: '把笑话讲给家人听', en: 'Tell the family the joke' },
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
      },
    ],
  },
  {
    id: 'bno-library-card',
    title: { zhCN: '孩子替大人选书', en: 'A child chooses the adult’s book' },
    text: {
      zhCN: '图书馆里，孩子替嘉宁挑了本厚书，说封面看起来很好吃。',
      en: 'At the library, the child picks a thick book for Ka Ning because the cover looks delicious.',
    },
    weight: 2,
    once: true,
    choices: [
      {
        id: 'first',
        label: { zhCN: '先读第一页试试', en: 'Try reading the first page' },
        effects: [{ type: 'stat', key: 'english', delta: 3 }],
      },
      {
        id: 'second',
        label: {
          zhCN: '借本薄一点的一起看',
          en: 'Choose a shorter book together',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
      },
    ],
  },
  {
    id: 'bno-park-friend',
    title: { zhCN: '长椅的固定座位', en: 'The usual seat on a bench' },
    text: {
      zhCN: '每周在长椅遇到同一位家长，这次终于互相记住了名字。',
      en: 'The same parent appears on the bench each week; this time both remember each other’s names.',
    },
    weight: 2,
    once: true,
    choices: [
      {
        id: 'first',
        label: { zhCN: '约下周再见', en: 'Arrange to meet next week' },
        effects: [{ type: 'stat', key: 'mood', delta: 4 }],
      },
      {
        id: 'second',
        label: { zhCN: '一起聊聊周末安排', en: 'Chat about weekend plans' },
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
      },
    ],
  },
  {
    id: 'bno-gp-appointment',
    title: { zhCN: '电话等候的音乐', en: 'Music while waiting on the phone' },
    text: {
      zhCN: 'GP 电话的等候音乐响了又响，嘉宁已经会哼副歌。',
      en: 'The GP phone’s hold music repeats until Ka Ning can hum the chorus.',
    },
    weight: 2,
    once: true,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '坚持接通说清症状',
          en: 'Stay on and explain the symptoms',
        },
        effects: [{ type: 'stat', key: 'health', delta: 4 }],
      },
      {
        id: 'second',
        label: {
          zhCN: '写下症状再打一次',
          en: 'Write down the symptoms and call again',
        },
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
      },
    ],
  },
  {
    id: 'bno-dentist-wait',
    title: { zhCN: '候诊室的玩具箱', en: 'The waiting-room toy box' },
    text: {
      zhCN: '孩子摆弄候诊室的玩具，嘉宁盯着墙上的牙刷海报。',
      en: 'The child explores the waiting-room toys while Ka Ning studies the toothbrush poster.',
    },
    weight: 2,
    once: true,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '认真听完清洁建议',
          en: 'Listen to the cleaning advice',
        },
        effects: [{ type: 'stat', key: 'health', delta: 3 }],
      },
      {
        id: 'second',
        label: {
          zhCN: '回家一起练刷牙',
          en: 'Practise brushing together at home',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
      },
    ],
  },
  {
    id: 'bno-packed-lunch',
    title: { zhCN: '便当盒的新隔层', en: 'A new compartment in the lunchbox' },
    text: {
      zhCN: '孩子嫌便当总是同一种颜色，嘉宁开始研究彩椒。',
      en: 'The child says packed lunches have only one colour; Ka Ning starts investigating peppers.',
    },
    weight: 2,
    once: true,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '一起准备彩色午饭',
          en: 'Prepare a colourful lunch together',
        },
        effects: [{ type: 'stat', key: 'health', delta: 3 }],
      },
      {
        id: 'second',
        label: {
          zhCN: '画张菜单让孩子挑',
          en: 'Draw a menu for the child to choose',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
      },
    ],
  },
  {
    id: 'bno-sunday-laundry',
    title: { zhCN: '洗衣机的袜子账', en: 'The washing machine’s sock account' },
    text: {
      zhCN: '洗衣机又少交一只袜子，嘉宁在篮底找到孩子的玩具车。',
      en: 'The washing machine returns one sock short again; Ka Ning finds a toy car at the bottom of the basket.',
    },
    weight: 2,
    once: true,
    choices: [
      {
        id: 'first',
        label: { zhCN: '慢慢把家收拾好', en: 'Take time to tidy the home' },
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
      },
      {
        id: 'second',
        label: { zhCN: '先休息一会儿再说', en: 'Have a rest first' },
        effects: [{ type: 'stat', key: 'health', delta: 3 }],
      },
    ],
  },
  {
    id: 'bno-birthday-cake',
    title: { zhCN: '歪了一点的蛋糕', en: 'A slightly lopsided cake' },
    text: {
      zhCN: '生日蛋糕向左倾，孩子坚持说这是更有个性的版本。',
      en: 'The birthday cake leans left; the child insists this version has more personality.',
    },
    weight: 2,
    once: true,
    choices: [
      {
        id: 'first',
        label: { zhCN: '照样点上蜡烛', en: 'Light the candles anyway' },
        effects: [{ type: 'stat', key: 'mood', delta: 5 }],
      },
      {
        id: 'second',
        label: { zhCN: '再买点水果装饰', en: 'Buy fruit to decorate it' },
        effects: [{ type: 'money', delta: -12 }],
      },
    ],
  },
  {
    id: 'bno-anniversary-table',
    title: { zhCN: '餐桌上的旧车票', en: 'An old ticket on the dinner table' },
    text: {
      zhCN: '纪念日晚饭时，伴侣找出了两人第一次旅行的旧车票。',
      en: 'At the anniversary dinner, the partner finds the ticket from their first trip together.',
    },
    weight: 2,
    once: true,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '在家慢慢吃这顿饭',
          en: 'Take time over dinner at home',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 5 }],
      },
      {
        id: 'second',
        label: {
          zhCN: '请一晚保姆出门约会',
          en: 'Pay for a babysitter and go out',
        },
        effects: [{ type: 'money', delta: -95 }],
      },
    ],
  },
  {
    id: 'bno-snow-footprints',
    title: { zhCN: '雪地里的小脚印', en: 'Small footprints in snow' },
    text: {
      zhCN: '门前薄雪上留着孩子的脚印，绕了三圈才走向学校。',
      en: 'The child’s footprints circle three times in the light snow before heading towards school.',
    },
    weight: 2,
    once: true,
    season: 1,
    choices: [
      {
        id: 'first',
        label: { zhCN: '晚饭后一起散步', en: 'Take a walk after dinner' },
        effects: [{ type: 'stat', key: 'health', delta: 3 }],
      },
      {
        id: 'second',
        label: {
          zhCN: '把照片发给父母',
          en: 'Send a photograph to the parents',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
      },
    ],
  },
  {
    id: 'bno-summer-light',
    title: { zhCN: '不肯天黑的晚上', en: 'An evening that will not darken' },
    text: {
      zhCN: '夏天的窗外一直亮着，孩子说太阳是不是忘了下班。',
      en: 'The summer window stays bright; the child asks whether the sun forgot to clock off.',
    },
    weight: 2,
    once: true,
    season: 3,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '拉上窗帘早点睡',
          en: 'Close the curtains and sleep earlier',
        },
        effects: [{ type: 'stat', key: 'health', delta: 3 }],
      },
      {
        id: 'second',
        label: { zhCN: '到公园再走一圈', en: 'Take another lap of the park' },
        effects: [{ type: 'stat', key: 'mood', delta: 4 }],
      },
    ],
  },
  {
    id: 'bno-autumn-leaves',
    title: { zhCN: '夹在练习册里的叶子', en: 'Leaves inside an exercise book' },
    text: {
      zhCN: '孩子把秋叶夹进练习册，嘉宁翻页时像打开一小片公园。',
      en: 'The child presses autumn leaves into an exercise book; each page opens a little park.',
    },
    weight: 2,
    once: true,
    season: 4,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '和孩子写叶子的名字',
          en: 'Write the leaves’ names together',
        },
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
      },
      {
        id: 'second',
        label: {
          zhCN: '去捡下一片好看的叶子',
          en: 'Go looking for another leaf',
        },
        effects: [{ type: 'stat', key: 'health', delta: 3 }],
      },
    ],
  },
  {
    id: 'bno-fifth-year-drawer',
    title: { zhCN: '抽屉开始装不下', en: 'The drawer is getting full' },
    text: {
      zhCN: '住久了，抽屉里都是不知道该不该留的纸，嘉宁找不到剪刀。',
      en: 'Years of uncertain paperwork fill the drawer; Ka Ning cannot find the scissors.',
    },
    weight: 2,
    once: true,
    when: [{ yearMin: 5 }],
    choices: [
      {
        id: 'first',
        label: { zhCN: '花一晚整理旧纸', en: 'Spend an evening sorting it' },
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
      },
      {
        id: 'second',
        label: {
          zhCN: '把文件先分类装盒',
          en: 'Put the papers into labelled boxes',
        },
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
      },
    ],
  },
  {
    id: 'bno-eighth-year-friend',
    title: { zhCN: '朋友留下的花盆', en: 'A flowerpot left by a friend' },
    text: {
      zhCN: '朋友搬离小镇，把养不好的花送给嘉宁，说换个人或许有希望。',
      en: 'A friend leaving town gives Ka Ning a struggling plant, hoping a new owner might help.',
    },
    weight: 2,
    once: true,
    when: [{ yearMin: 8 }],
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '答应照顾，也约下次见',
          en: 'Care for it and arrange the next meeting',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 2 }],
      },
      {
        id: 'second',
        label: {
          zhCN: '陪朋友走最后一次老路',
          en: 'Walk the familiar route together once more',
        },
        effects: [{ type: 'stat', key: 'health', delta: 3 }],
      },
    ],
  },
  {
    id: 'bno-ten-year-measure',
    title: { zhCN: '门框上的铅笔线', en: 'Pencil marks on the doorframe' },
    text: {
      zhCN: '门框的铅笔线越画越高，嘉宁已经记不清第一条是哪年。',
      en: 'Pencil marks climb the doorframe; Ka Ning can no longer remember the year of the first.',
    },
    weight: 2,
    once: true,
    when: [{ yearMin: 9 }],
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '一起给旧照片写日期',
          en: 'Date the old photographs together',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 5 }],
      },
      {
        id: 'second',
        label: {
          zhCN: '站直了再量一次',
          en: 'Stand straight for another measurement',
        },
        effects: [{ type: 'stat', key: 'health', delta: 2 }],
      },
    ],
  },
  {
    id: 'bno-work-lunchroom',
    title: { zhCN: '微波炉前的队伍', en: 'A queue at the microwave' },
    text: {
      zhCN: '午休的微波炉排起长队，嘉宁发现人人都在守着一个饭盒。',
      en: 'A microwave queue forms at lunch; everyone appears to be guarding a lunchbox.',
    },
    weight: 2,
    once: true,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '和新同事聊聊午饭',
          en: 'Chat with a new colleague about lunch',
        },
        effects: [{ type: 'stat', key: 'english', delta: 3 }],
      },
      {
        id: 'second',
        label: { zhCN: '出去走一小圈', en: 'Take a short walk outside' },
        effects: [{ type: 'stat', key: 'health', delta: 3 }],
      },
    ],
  },
  {
    id: 'bno-local-election',
    title: { zhCN: '门口的传单', en: 'A leaflet at the door' },
    text: {
      zhCN: '门口落下一叠社区传单，嘉宁把活动日期圈给家人看。',
      en: 'Community leaflets land at the door; Ka Ning circles the event dates for the family.',
    },
    weight: 2,
    once: true,
    choices: [
      {
        id: 'first',
        label: { zhCN: '读读活动介绍', en: 'Read the activity descriptions' },
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
      },
      {
        id: 'second',
        label: { zhCN: '周末去看看热闹', en: 'Visit the weekend event' },
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
      },
    ],
  },
  {
    id: 'bno-rainbow-window',
    title: { zhCN: '窗户上的彩虹', en: 'A rainbow on the window' },
    text: {
      zhCN: '孩子画的彩虹贴歪了，嘉宁却觉得那正是它最像彩虹的地方。',
      en: 'The child’s rainbow hangs crookedly; Ka Ning thinks that is what makes it feel like a rainbow.',
    },
    weight: 2,
    once: true,
    choices: [
      {
        id: 'first',
        label: { zhCN: '就让它这样挂着', en: 'Leave it hanging that way' },
        effects: [{ type: 'stat', key: 'mood', delta: 4 }],
      },
      {
        id: 'second',
        label: { zhCN: '一起再画一张', en: 'Draw another together' },
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
      },
    ],
  },
  {
    id: 'bno-tea-with-neighbour',
    title: { zhCN: '终于放轻的音乐', en: 'Music finally turned down' },
    text: {
      zhCN: '邻居送来一小包茶，走廊这次安静得能听见开门声。',
      en: 'The neighbour brings tea; this time the corridor is quiet enough to hear the door open.',
    },
    weight: 2,
    once: true,
    forbids: ['bno-house-moved'],
    requires: ['bno-neighbour-peace'],
    choices: [
      {
        id: 'first',
        label: { zhCN: '泡两杯慢慢聊', en: 'Make two cups and talk' },
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
      },
      {
        id: 'second',
        label: { zhCN: '把茶留给晚上', en: 'Save the tea for the evening' },
        effects: [{ type: 'stat', key: 'mood', delta: 4 }],
      },
    ],
  },
  {
    id: 'bno-five-year-note',
    title: { zhCN: '便签上的五年', en: 'Five years on a sticky note' },
    text: {
      zhCN: '嘉宁在日历旁贴了一张便签，孩子问为什么不用更大的纸。',
      en: 'Ka Ning sticks a note beside the calendar; the child asks why the paper is not bigger.',
    },
    weight: 2,
    once: true,
    when: [{ yearMin: 4 }],
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '去市政厅看完整评估',
          en: 'Read the full assessment at the town hall',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 2 }],
        note: {
          zhCN: `HK 62.1(b) 为 ${policy.hongKongBnoQualifyingYears.value} 年；连续居留、${policy.hongKongBnoSettlementEnglish.value} 与 Life in the UK 仍须评估（SRC-020 HK 63.1、60.1、61.1）。`,
          en: `HK 62.1(b) requires ${policy.hongKongBnoQualifyingYears.value} years; continuous residence, ${policy.hongKongBnoSettlementEnglish.value} and Life in the UK still require assessment (SRC-020 HK 63.1, 60.1, 61.1).`,
        },
      },
      {
        id: 'second',
        label: { zhCN: '先把旧文件整理好', en: 'Sort the old papers first' },
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
        note: {
          zhCN: '改革栏 OUTSIDE_FRAMEWORK 不代表定居获批；两栏完整结果以引擎为准。',
          en: 'OUTSIDE_FRAMEWORK in the reform column is not settlement approval; the engine supplies both assessments.',
        },
      },
    ],
  },
];

export const hongKongBno: Character = {
  id: 'hong-kong-bno',
  name: { zhCN: '陈嘉宁', en: 'Ka Ning Chan' },
  intro: {
    zhCN: '嘉宁在 2022 年中以 BN(O) Status Holder 身份来英，伴侣和一个孩子同行。一年后，校门口渐渐有了熟面孔。本局只评估嘉宁，人物与事件均为虚构。',
    en: 'Ka Ning arrived in mid-2022 as a BN(O) Status Holder with a partner and one child. A year later, familiar faces are appearing at the school gate. Only Ka Ning is assessed; all characters and events are fictional.',
  },
  sprite: 'characters/1.png',
  startDate: '2023-06-15',
  timeline: {
    dateOfBirth: '1985-06-20',
    nationality: 'HKG',
    episodes: [
      {
        route: 'HONG_KONG_BNO',
        role: 'MAIN',
        validFrom: '2022-06-15',
        validTo: '2024-12-14',
        salary: 34000,
      },
    ],
    absences: [],
    incomeYears: [
      { taxYear: '2022-23', earnings: 28000 },
      { taxYear: '2023-24', earnings: 34000 },
    ],
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
  stats: { money: 12000, mood: 68, health: 76, english: 45, career: 18 },
  events,
};
