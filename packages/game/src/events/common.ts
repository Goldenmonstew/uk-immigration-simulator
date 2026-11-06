import { noticeEvents, festivalEvents } from './days';
import type { GameEvent } from '../types';
import { additionalCommonEvents } from './common-additions';
import { townEvents } from './town';
import { placeEvents } from './places';

// Fictional amounts and durations describe individual stories, not policy thresholds.
export const commonEvents: GameEvent[] = [
  {
    id: 'common-boiler',
    channel: 'place:home',
    title: {
      zhCN: '锅炉的脾气',
      en: 'Boiler moods',
    },
    text: {
      zhCN: '淋浴忽冷忽热，锅炉的声音像在练架子鼓。',
      en: 'The shower changes temperature while the boiler practises its drum solo.',
    },
    weight: 2,
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '约房东来看看',
          en: 'Arrange a visit',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 2,
          },
        ],
        sets: ['boiler-planned'],
      },
      {
        id: 'skip',
        label: {
          zhCN: '先用厚毯子撑着',
          en: 'Make do with blankets',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 4,
          },
        ],
      },
    ],
    once: true,
    season: 1,
  },
  {
    id: 'common-boiler-after',
    channel: 'place:home',
    title: {
      zhCN: '修理工的靴子',
      en: 'The plumber arrives',
    },
    text: {
      zhCN: '修理工终于来了，带进来的泥比工具还抢眼。',
      en: 'The plumber finally arrives, bringing almost as much mud as equipment.',
    },
    weight: 2,
    choices: [
      {
        id: 'follow',
        label: {
          zhCN: '腾出走廊',
          en: 'Clear the hallway',
        },
        effects: [
          {
            type: 'stat',
            key: 'health',
            delta: 8,
          },
          {
            type: 'money',
            delta: -50,
          },
        ],
      },
      {
        id: 'other',
        label: {
          zhCN: '请邻居帮忙开门',
          en: 'Ask a neighbour to let them in',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 4,
          },
        ],
      },
    ],
    once: true,
    requires: ['boiler-planned'],
  },
  {
    id: 'common-rail',
    channel: 'place:station',
    title: {
      zhCN: '站台公告',
      en: 'Platform news',
    },
    text: {
      zhCN: '火车罢工，站台上的鸽子比乘客更从容。',
      en: 'A rail strike leaves the pigeons looking calmer than the passengers.',
    },
    weight: 2,
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '保存车票',
          en: 'Keep the ticket',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 2,
          },
        ],
        sets: ['rail-planned'],
      },
      {
        id: 'skip',
        label: {
          zhCN: '改走河边回家',
          en: 'Walk home by the river',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 4,
          },
        ],
      },
    ],
    once: true,
    season: 2,
  },
  {
    id: 'common-rail-after',
    channel: 'letter',
    title: {
      zhCN: '退款邮件',
      en: 'A refund email',
    },
    text: {
      zhCN: '那趟没坐成的车终于退了款，咖啡早就凉了。',
      en: 'The missed train is finally refunded; the coffee went cold long ago.',
    },
    weight: 2,
    choices: [
      {
        id: 'follow',
        label: {
          zhCN: '收下退款',
          en: 'Accept the refund',
        },
        effects: [
          {
            type: 'money',
            delta: 45,
          },
        ],
      },
      {
        id: 'other',
        label: {
          zhCN: '分一半请朋友喝茶',
          en: 'Share it over tea',
        },
        effects: [
          {
            type: 'money',
            delta: 20,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 5,
          },
        ],
      },
    ],
    once: true,
    requires: ['rail-planned'],
  },
  {
    id: 'common-deposit',
    channel: 'place:home',
    title: {
      zhCN: '退租检查',
      en: 'Checkout inspection',
    },
    text: {
      zhCN: '房东盯着地毯上的旧印子，你翻出入住时的照片。',
      en: 'The landlord studies a carpet mark; you find the check-in photographs.',
    },
    weight: 2,
    forbids: ['quarter-housing-change'],
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '发照片争取押金',
          en: 'Send the photographs',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 2,
          },
        ],
        sets: ['deposit-planned', 'quarter-housing-change'],
      },
      {
        id: 'skip',
        sets: ['quarter-housing-change'],
        label: {
          zhCN: '不想再耗下去',
          en: 'Let the argument go',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 4,
          },
        ],
      },
    ],
    once: true,
    season: 3,
  },
  {
    id: 'common-deposit-after',
    channel: 'letter',
    title: {
      zhCN: '押金的下落',
      en: 'The deposit returns',
    },
    text: {
      zhCN: '照片起了作用，押金回来了一部分，邮件没说抱歉。',
      en: 'The photographs help recover part of the deposit, without an apology.',
    },
    weight: 2,
    forbids: ['quarter-housing-change'],
    choices: [
      {
        id: 'follow',
        sets: ['quarter-housing-change'],
        label: {
          zhCN: '放回应急金',
          en: 'Keep it for emergencies',
        },
        effects: [
          {
            type: 'money',
            delta: 300,
          },
        ],
      },
      {
        id: 'other',
        sets: ['quarter-housing-change'],
        label: {
          zhCN: '添置二手书桌',
          en: 'Buy a used desk',
        },
        effects: [
          {
            type: 'money',
            delta: 100,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 7,
          },
        ],
      },
    ],
    once: true,
    requires: ['deposit-planned'],
  },
  {
    id: 'common-garden',
    channel: 'npc:margaret',
    title: {
      zhCN: '窗台发芽',
      en: 'Windowsill shoots',
    },
    text: {
      zhCN: '超市薄荷活过了一整周，邻居说可以拿去社区花园。',
      en: 'The supermarket mint survives a whole week; a neighbour suggests the community garden.',
    },
    weight: 2,
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '带去花园',
          en: 'Take it to the garden',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 2,
          },
        ],
        sets: ['garden-planned'],
      },
      {
        id: 'skip',
        label: {
          zhCN: '继续养在窗台',
          en: 'Keep it on the sill',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 4,
          },
        ],
      },
    ],
    once: true,
    season: 4,
  },
  {
    id: 'common-garden-after',
    channel: 'place:allotment',
    title: {
      zhCN: '薄荷外交',
      en: 'Mint diplomacy',
    },
    text: {
      zhCN: '花园的人记住了你的名字，也记住了那盆薄荷。',
      en: 'People at the garden remember both your name and your mint.',
    },
    weight: 2,
    choices: [
      {
        id: 'follow',
        label: {
          zhCN: '留下喝茶',
          en: 'Stay for tea',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 9,
          },
          {
            type: 'stat',
            key: 'english',
            delta: 3,
          },
        ],
      },
      {
        id: 'other',
        label: {
          zhCN: '帮忙翻土',
          en: 'Help turn the soil',
        },
        effects: [
          {
            type: 'stat',
            key: 'health',
            delta: 6,
          },
        ],
      },
    ],
    once: true,
    requires: ['garden-planned'],
  },
  {
    id: 'common-bike',
    channel: 'morning',
    title: {
      zhCN: '二手自行车',
      en: 'A second-hand bicycle',
    },
    text: {
      zhCN: '慈善店门口有辆旧车，车铃比车轮精神。',
      en: 'A charity shop has an old bicycle with a very energetic bell.',
    },
    weight: 2,
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '买下慢慢修',
          en: 'Buy it and fix it',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 2,
          },
        ],
        sets: ['bike-planned'],
      },
      {
        id: 'skip',
        label: {
          zhCN: '继续坐公交',
          en: 'Keep taking the bus',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 4,
          },
        ],
      },
    ],
    once: true,
    season: 1,
  },
  {
    id: 'common-bike-after',
    channel: 'morning',
    title: {
      zhCN: '第一趟骑行',
      en: 'The first ride',
    },
    text: {
      zhCN: '修好的车沿河跑起来，逆风认真得像来上班。',
      en: 'The repaired bike rolls along the river into a very diligent headwind.',
    },
    weight: 2,
    choices: [
      {
        id: 'follow',
        label: {
          zhCN: '骑完整圈',
          en: 'Finish the loop',
        },
        effects: [
          {
            type: 'stat',
            key: 'health',
            delta: 9,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 4,
          },
        ],
      },
      {
        id: 'other',
        label: {
          zhCN: '半路停下吃点心',
          en: 'Stop for a snack',
        },
        effects: [
          {
            type: 'money',
            delta: -8,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 8,
          },
        ],
      },
    ],
    once: true,
    requires: ['bike-planned'],
  },
  {
    id: 'common-book',
    channel: 'npc:helen',
    title: {
      zhCN: '借来的考题',
      en: 'Borrowed questions',
    },
    text: {
      zhCN: '朋友把 Life in the UK 书递来，书签是一张超市小票。',
      en: 'A friend lends you a Life in the UK book, marked with a supermarket receipt.',
    },
    weight: 2,
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '预约备考时间',
          en: 'Make time to prepare',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 2,
          },
        ],
        sets: ['book-planned'],
      },
      {
        id: 'skip',
        label: {
          zhCN: '先还书',
          en: 'Return the book for now',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 4,
          },
        ],
      },
    ],
    once: true,
    season: 2,
  },
  {
    id: 'common-book-after',
    channel: 'morning',
    title: {
      zhCN: '考场门口',
      en: 'Outside the test centre',
    },
    text: {
      zhCN: '复习了好几晚，昨天走出考场时你终于松了口气。',
      en: 'After evenings of revision, leaving the test centre yesterday brought relief.',
    },
    weight: 2,
    choices: [
      {
        id: 'follow',
        label: {
          zhCN: '通过，收好证明',
          en: 'Pass and keep the evidence',
        },
        effects: [
          {
            type: 'lifeInTheUk',
          },
        ],
        note: {
          zhCN: '只记录本情节的事实，政策后果由引擎计算。',
          en: 'Only this scenario’s facts are recorded; the engine calculates policy consequences.',
        },
      },
      {
        id: 'other',
        label: {
          zhCN: '这次没通过，继续读书',
          en: 'Miss the pass and keep studying',
        },
        effects: [
          {
            type: 'stat',
            key: 'english',
            delta: 4,
          },
        ],
      },
    ],
    once: true,
    requires: ['book-planned'],
  },
  {
    id: 'common-tax',
    channel: 'letter',
    title: {
      zhCN: 'HMRC 的信封',
      en: 'An HMRC envelope',
    },
    text: {
      zhCN: '信封很正式，拆开才发现是在核对今年收入。',
      en: 'An imposing envelope turns out to be a check of this year’s earnings.',
    },
    weight: 2,
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '找齐工资单',
          en: 'Gather the payslips',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 2,
          },
        ],
        sets: ['tax-planned'],
      },
      {
        id: 'skip',
        label: {
          zhCN: '先整理抽屉',
          en: 'Start with the drawer',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 4,
          },
        ],
      },
    ],
    once: true,
    season: 3,
  },
  {
    id: 'common-tax-after',
    channel: 'morning',
    title: {
      zhCN: '核对完毕',
      en: 'Reconciliation complete',
    },
    text: {
      zhCN: '工资单对上了，全年税前收入终于有了准数。',
      en: 'The payslips match, giving a clear figure for annual gross earnings.',
    },
    weight: 2,
    choices: [
      {
        id: 'follow',
        label: {
          zhCN: '核对出漏算的奖金',
          en: 'Find the missing bonus',
        },
        effects: [
          {
            type: 'income',
            taxYear: 'current',
            earnings: 42000,
          },
        ],
        note: {
          zhCN: '本情节写入全年税前收入 £42,000，政策后果由引擎计算。',
          en: 'This scenario records £42,000 in annual gross earnings; the engine calculates policy consequences.',
        },
      },
      {
        id: 'other',
        label: {
          zhCN: '资料留好，歇一会儿',
          en: 'File the papers and take a break',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 3,
          },
        ],
      },
    ],
    once: true,
    requires: ['tax-planned'],
  },
  {
    id: 'common-wedding',
    channel: 'letter',
    title: {
      zhCN: '婚礼邀请',
      en: 'A wedding invitation',
    },
    text: {
      zhCN: '老朋友寄来海外婚礼请柬，信封里还夹着手绘地图。',
      en: 'An old friend sends an overseas wedding invitation with a hand-drawn map.',
    },
    weight: 2,
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '回复愿意参加',
          en: 'RSVP yes',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 2,
          },
        ],
        sets: ['wedding-planned'],
      },
      {
        id: 'skip',
        label: {
          zhCN: '寄一张贺卡',
          en: 'Send a card',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 4,
          },
        ],
      },
    ],
    once: true,
    season: 4,
  },
  {
    id: 'common-wedding-after',
    channel: 'place:home',
    title: {
      zhCN: '婚礼散场',
      en: 'After the wedding',
    },
    text: {
      zhCN: '婚礼日期到了，机票和视频邀请都还放在桌上。',
      en: 'The wedding date arrives; flight details and a video invitation sit on the table.',
    },
    weight: 2,
    choices: [
      {
        id: 'follow',
        label: {
          zhCN: '记下刚结束的一周旅行',
          en: 'Record the week just spent abroad',
        },
        effects: [
          {
            type: 'absence',
            startOffsetDays: -7,
            days: 7,
          },
          {
            type: 'money',
            delta: -300,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 12,
          },
        ],
        note: {
          zhCN: '只记录本情节的事实，政策后果由引擎计算。',
          en: 'Only this scenario’s facts are recorded; the engine calculates policy consequences.',
        },
      },
      {
        id: 'other',
        label: {
          zhCN: '最后没成行，视频道贺',
          en: 'Miss the trip and call instead',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 4,
          },
        ],
      },
    ],
    once: true,
    requires: ['wedding-planned'],
  },
  {
    id: 'common-conference',
    channel: 'npc:ade',
    title: {
      zhCN: '同事的邀请',
      en: 'A colleague’s invitation',
    },
    text: {
      zhCN: '同事说海外会议需要人讲项目，你先看了看日历。',
      en: 'A colleague asks you to present at an overseas conference; you check the calendar.',
    },
    weight: 2,
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '接下分享',
          en: 'Agree to present',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 2,
          },
        ],
        sets: ['conference-planned'],
      },
      {
        id: 'skip',
        label: {
          zhCN: '留在本地做演示',
          en: 'Present locally instead',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 4,
          },
        ],
      },
    ],
    once: true,
    season: 1,
  },
  {
    id: 'common-conference-after',
    channel: 'morning',
    title: {
      zhCN: '会议帆布袋',
      en: 'The conference tote',
    },
    text: {
      zhCN: '会议结束了，帆布袋里塞着胸牌和名片，线上链接的邮件也还在收件箱。',
      en: 'The conference is over; the tote holds a lanyard and business cards, and the video-link email is still in the inbox.',
    },
    weight: 2,
    choices: [
      {
        id: 'follow',
        label: {
          zhCN: '这次飞去海外开了两周会',
          en: 'Spent a fortnight at the venue abroad',
        },
        effects: [
          {
            type: 'absence',
            startOffsetDays: -14,
            days: 14,
          },
          {
            type: 'stat',
            key: 'career',
            delta: 8,
          },
        ],
        note: {
          zhCN: '只记录本情节的事实，政策后果由引擎计算。',
          en: 'Only this scenario’s facts are recorded; the engine calculates policy consequences.',
        },
      },
      {
        id: 'other',
        label: {
          zhCN: '最后改在线上参加',
          en: 'Joined online in the end',
        },
        effects: [
          {
            type: 'stat',
            key: 'english',
            delta: 4,
          },
        ],
      },
    ],
    once: true,
    requires: ['conference-planned'],
  },
  {
    id: 'common-family-call',
    channel: 'phone',
    title: {
      zhCN: '视频里的厨房',
      en: 'A kitchen on screen',
    },
    text: {
      zhCN: '家里在视频那头包饺子，你这头的微波炉响了。',
      en: 'Family fold dumplings on the call as your microwave beeps.',
    },
    weight: 2,
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '约好回去看看',
          en: 'Arrange a visit',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 2,
          },
        ],
        sets: ['family-call-planned'],
      },
      {
        id: 'skip',
        label: {
          zhCN: '再聊一会儿',
          en: 'Stay on the call',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 4,
          },
        ],
      },
    ],
    once: true,
    season: 2,
  },
  {
    id: 'common-family-call-after',
    channel: 'morning',
    title: {
      zhCN: '饭盒装不下',
      en: 'Too much for the lunchbox',
    },
    text: {
      zhCN: '团聚结束，父母塞来的菜饭盒装不下，你翻着照片回想这次在哪里见的面。',
      en: 'The visit is over and the lunchbox cannot hold everything your parents packed; you look back at where you met this time.',
    },
    weight: 2,
    choices: [
      {
        id: 'follow',
        label: {
          zhCN: '回国陪家人住了四周',
          en: 'Spent four weeks with family abroad',
        },
        effects: [
          {
            type: 'absence',
            startOffsetDays: -28,
            days: 28,
          },
          {
            type: 'money',
            delta: -600,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 15,
          },
        ],
        note: {
          zhCN: '只记录本情节的事实，政策后果由引擎计算。',
          en: 'Only this scenario’s facts are recorded; the engine calculates policy consequences.',
        },
      },
      {
        id: 'other',
        label: {
          zhCN: '这次是家人来英国相聚',
          en: 'Family came to the UK this time',
        },
        effects: [
          {
            type: 'money',
            delta: -200,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 9,
          },
        ],
      },
    ],
    once: true,
    requires: ['family-call-planned'],
  },
  {
    id: 'common-passport',
    channel: 'place:home',
    title: {
      zhCN: '护照里的便签',
      en: 'A note in the passport',
    },
    text: {
      zhCN: '护照夹着旧登机牌，你想起答应过自己的假期。',
      en: 'An old boarding pass in your passport reminds you of a promised holiday.',
    },
    weight: 2,
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '开始安排假期',
          en: 'Plan the holiday',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 2,
          },
        ],
        sets: ['passport-planned'],
      },
      {
        id: 'skip',
        label: {
          zhCN: '把钱留给冬天',
          en: 'Save for winter',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 4,
          },
        ],
      },
    ],
    once: true,
    season: 3,
  },
  {
    id: 'common-passport-after',
    channel: 'place:home',
    title: {
      zhCN: '晒黑的票根',
      en: 'Sun-faded tickets',
    },
    text: {
      zhCN: '假期过去了，窗台上那张票根被晒得褪了色，护照也收回了抽屉。',
      en: 'The holiday has passed; the ticket on the windowsill has faded in the sun, and the passport is back in the drawer.',
    },
    weight: 2,
    choices: [
      {
        id: 'follow',
        label: {
          zhCN: '去海外度了三周假',
          en: 'Spent three weeks abroad on holiday',
        },
        effects: [
          {
            type: 'absence',
            startOffsetDays: -21,
            days: 21,
          },
          {
            type: 'money',
            delta: -500,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 12,
          },
        ],
        note: {
          zhCN: '只记录本情节的事实，政策后果由引擎计算。',
          en: 'Only this scenario’s facts are recorded; the engine calculates policy consequences.',
        },
      },
      {
        id: 'other',
        label: {
          zhCN: '最后临时取消，去了本地公园',
          en: 'Cancelled at the last minute and visited the local park',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 5,
          },
        ],
      },
    ],
    once: true,
    requires: ['passport-planned'],
  },
  {
    id: 'common-budget',
    channel: 'letter',
    title: {
      zhCN: '账单摊开',
      en: 'Bills on the table',
    },
    text: {
      zhCN: '超市、房租、暖气排成一列，工资单看起来有点孤单。',
      en: 'Groceries, rent and heating line up against one rather lonely payslip.',
    },
    weight: 2,
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '找朋友商量周转',
          en: 'Discuss a way through',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 2,
          },
        ],
        sets: ['budget-planned'],
      },
      {
        id: 'skip',
        label: {
          zhCN: '先压缩外食',
          en: 'Cut back on takeaways',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 4,
          },
        ],
      },
    ],
    once: true,
    season: 4,
    when: [
      {
        stat: 'money',
        max: 5000,
      },
    ],
  },
  {
    id: 'common-budget-after',
    channel: 'morning',
    title: {
      zhCN: '周转的选择',
      en: 'Making ends meet',
    },
    text: {
      zhCN: '朋友带来一锅汤，账单还在，但晚饭解决了。',
      en: 'A friend brings soup; the bills remain, but dinner is sorted.',
    },
    weight: 2,
    choices: [
      {
        id: 'follow',
        label: {
          zhCN: '借一笔私人周转金',
          en: 'Take a private loan',
        },
        effects: [
          {
            type: 'money',
            delta: 1000,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 4,
          },
        ],
      },
      {
        id: 'other',
        label: {
          zhCN: '本情节中本人领取 UC',
          en: 'In this scenario, receive UC',
        },
        effects: [
          {
            type: 'benefit',
            benefit: {
              benefitType: 'UNIVERSAL_CREDIT',
            },
            startOffsetDays: 0,
            months: 3,
          },
          {
            type: 'money',
            delta: 600,
          },
        ],
        note: {
          zhCN: '只记录本情节的事实，政策后果由引擎计算。',
          en: 'Only this scenario’s facts are recorded; the engine calculates policy consequences.',
        },
      },
    ],
    once: true,
    requires: ['budget-planned'],
  },
  {
    id: 'common-council',
    channel: 'letter',
    title: {
      zhCN: 'council tax 来信',
      en: 'Council tax post',
    },
    text: {
      zhCN: 'council tax 账户有一笔争议欠款，信比冰箱贴还多。',
      en: 'A disputed council tax balance produces more letters than fridge magnets.',
    },
    weight: 2,
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '把账目理清',
          en: 'Sort through the account',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 2,
          },
        ],
        sets: ['council-planned'],
      },
      {
        id: 'skip',
        label: {
          zhCN: '先留出还款的钱',
          en: 'Set money aside',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 4,
          },
        ],
      },
    ],
    once: true,
    season: 1,
  },
  {
    id: 'common-council-after',
    channel: 'letter',
    title: {
      zhCN: '欠款核对',
      en: 'Checking the debt',
    },
    text: {
      zhCN: '账目终于对清，桌上只剩最后一封信。',
      en: 'The figures finally reconcile, leaving one last letter on the table.',
    },
    weight: 2,
    choices: [
      {
        id: 'follow',
        label: {
          zhCN: '付清政府欠款',
          en: 'Clear the government debt',
        },
        effects: [
          {
            type: 'money',
            delta: -400,
          },
          {
            type: 'timeline',
            patch: {
              governmentDebt: {
                outstanding: false,
              },
            },
          },
        ],
        note: {
          zhCN: '只记录本情节的事实，政策后果由引擎计算。',
          en: 'Only this scenario’s facts are recorded; the engine calculates policy consequences.',
        },
      },
      {
        id: 'other',
        label: {
          zhCN: '本情节中欠款仍未清',
          en: 'In this scenario, leave it outstanding',
        },
        effects: [
          {
            type: 'timeline',
            patch: {
              governmentDebt: {
                outstanding: true,
              },
            },
          },
          {
            type: 'stat',
            key: 'mood',
            delta: -5,
          },
        ],
        note: {
          zhCN: '只记录本情节的事实，政策后果由引擎计算。',
          en: 'Only this scenario’s facts are recorded; the engine calculates policy consequences.',
        },
      },
    ],
    once: true,
    requires: ['council-planned'],
  },
  {
    id: 'common-charity',
    channel: 'morning',
    title: {
      zhCN: '慈善店招募',
      en: 'Charity shop volunteers',
    },
    text: {
      zhCN: '慈善店缺人整理书架，侦探小说已经挤进烹饪区。',
      en: 'The charity shop needs help: detective novels have invaded the cookery shelf.',
    },
    weight: 2,
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '留个周末帮忙',
          en: 'Offer a weekend',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 2,
          },
        ],
        sets: ['charity-planned'],
      },
      {
        id: 'skip',
        label: {
          zhCN: '捐几本旧书',
          en: 'Donate a few books',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 4,
          },
        ],
      },
    ],
    once: true,
    season: 2,
  },
  {
    id: 'common-charity-after',
    channel: 'morning',
    title: {
      zhCN: '书架恢复秩序',
      en: 'Order on the shelves',
    },
    text: {
      zhCN: '书架整理好了，店员送你一只印着猫的旧杯子。',
      en: 'The shelves are sorted; the shopkeeper gives you a second-hand cat mug.',
    },
    weight: 2,
    choices: [
      {
        id: 'follow',
        label: {
          zhCN: '一起喝杯茶',
          en: 'Share a cup of tea',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 10,
          },
          {
            type: 'stat',
            key: 'english',
            delta: 3,
          },
        ],
      },
      {
        id: 'other',
        label: {
          zhCN: '继续整理下一排',
          en: 'Sort another row',
        },
        effects: [
          {
            type: 'stat',
            key: 'health',
            delta: 3,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 5,
          },
        ],
      },
    ],
    once: true,
    requires: ['charity-planned'],
  },
  {
    id: 'common-payslip',
    channel: 'place:work',
    title: {
      zhCN: '工资单有疑问',
      en: 'A payslip puzzle',
    },
    text: {
      zhCN: '项目奖金那行数字不太对，财务同事也皱起了眉。',
      en: 'The project bonus looks wrong; the payroll colleague frowns too.',
    },
    weight: 2,
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '请财务核对',
          en: 'Ask payroll to check',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 2,
          },
        ],
        sets: ['payslip-planned'],
      },
      {
        id: 'skip',
        label: {
          zhCN: '暂时记在本子里',
          en: 'Make a note for later',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 4,
          },
        ],
      },
    ],
    once: true,
    season: 3,
  },
  {
    id: 'common-payslip-after',
    channel: 'letter',
    title: {
      zhCN: '奖金补发',
      en: 'The missing bonus',
    },
    text: {
      zhCN: '补发的奖金到账，财务邮件最后画了个笑脸。',
      en: 'The missing bonus arrives with a smiley at the end of payroll’s email.',
    },
    weight: 2,
    choices: [
      {
        id: 'follow',
        label: {
          zhCN: '接下后续维护项目',
          en: 'Take the follow-up maintenance work',
        },
        effects: [
          {
            type: 'income',
            taxYear: 'current',
            earnings: 60000,
          },
          {
            type: 'money',
            delta: 500,
          },
        ],
        note: {
          zhCN: '本情节写入全年税前收入 £60,000，政策后果由引擎计算。',
          en: 'This scenario records £60,000 in annual gross earnings; the engine calculates policy consequences.',
        },
      },
      {
        id: 'other',
        label: {
          zhCN: '按原计划收尾',
          en: 'Finish as originally planned',
        },
        effects: [
          {
            type: 'income',
            taxYear: 'current',
            earnings: 50000,
          },
          {
            type: 'money',
            delta: 200,
          },
        ],
        note: {
          zhCN: '本情节写入全年税前收入 £50,000，政策后果由引擎计算。',
          en: 'This scenario records £50,000 in annual gross earnings; the engine calculates policy consequences.',
        },
      },
    ],
    once: true,
    requires: ['payslip-planned'],
  },
  {
    id: 'common-course',
    channel: 'place:college',
    title: {
      zhCN: '晚课新同桌',
      en: 'A new classmate',
    },
    text: {
      zhCN: '课上的同桌也总带错课本，你们笑着交换了笔记。',
      en: 'Your classmate also brings the wrong book; you swap notes.',
    },
    weight: 2,
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '约好一起复习',
          en: 'Arrange to revise together',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 2,
          },
        ],
        sets: ['course-planned'],
      },
      {
        id: 'skip',
        label: {
          zhCN: '下课先回家',
          en: 'Head home after class',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 4,
          },
        ],
      },
    ],
    once: true,
    season: 4,
  },
  {
    id: 'common-course-after',
    channel: 'place:library',
    title: {
      zhCN: '图书馆的角落',
      en: 'A library corner',
    },
    text: {
      zhCN: '图书馆暖气太足，你们靠互相提问保持清醒。',
      en: 'The library is so warm that quizzing each other is the only way to stay awake.',
    },
    weight: 2,
    choices: [
      {
        id: 'follow',
        label: {
          zhCN: '再练一轮口语',
          en: 'Practise speaking again',
        },
        effects: [
          {
            type: 'stat',
            key: 'english',
            delta: 9,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 4,
          },
        ],
      },
      {
        id: 'other',
        label: {
          zhCN: '去门口吹吹风',
          en: 'Get some air outside',
        },
        effects: [
          {
            type: 'stat',
            key: 'health',
            delta: 5,
          },
        ],
      },
    ],
    once: true,
    requires: ['course-planned'],
  },
  {
    id: 'common-flat',
    channel: 'place:home',
    title: {
      zhCN: '看房的鞋套',
      en: 'Viewing overshoes',
    },
    text: {
      zhCN: '新房窗外是公园，鞋套却一路滑到厨房。',
      en: 'The new flat overlooks a park; the overshoes slide you all the way to the kitchen.',
    },
    weight: 2,
    forbids: ['quarter-housing-change'],
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '申请这套房',
          en: 'Apply for the flat',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 2,
          },
        ],
        sets: ['flat-planned', 'quarter-housing-change'],
      },
      {
        id: 'skip',
        sets: ['quarter-housing-change'],
        label: {
          zhCN: '留在原处',
          en: 'Stay where you are',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 4,
          },
        ],
      },
    ],
    once: true,
    season: 1,
  },
  {
    id: 'common-flat-after',
    channel: 'place:home',
    title: {
      zhCN: '第一把新钥匙',
      en: 'The first new key',
    },
    text: {
      zhCN: '纸箱还没拆完，窗台已经摆上了一盆植物。',
      en: 'Boxes remain unpacked, but a plant is already on the windowsill.',
    },
    weight: 2,
    forbids: ['quarter-housing-change'],
    choices: [
      {
        id: 'move',
        sets: ['quarter-housing-change'],
        label: {
          zhCN: '搬进新家',
          en: 'Move in',
        },
        effects: [
          {
            type: 'money',
            delta: -500,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 10,
          },
        ],
      },
      {
        id: 'other',
        sets: ['quarter-housing-change'],
        label: {
          zhCN: '放弃这次搬家',
          en: 'Cancel the move',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: -2,
          },
        ],
      },
    ],
    once: true,
    requires: ['flat-planned'],
  },
  {
    id: 'common-keys',
    channel: 'morning',
    title: {
      zhCN: '多出来的门垫',
      en: 'A spare doormat',
    },
    text: {
      zhCN: '室友准备搬走，走廊里多了一卷没开封的门垫。',
      en: 'A flatmate is moving out; an unopened doormat appears in the hallway.',
    },
    weight: 2,
    forbids: ['quarter-housing-change'],
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '一起找新住处',
          en: 'Look for a new home',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 2,
          },
        ],
        sets: ['keys-planned', 'quarter-housing-change'],
      },
      {
        id: 'skip',
        sets: ['quarter-housing-change'],
        label: {
          zhCN: '留下找新室友',
          en: 'Stay and find another flatmate',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 4,
          },
        ],
      },
    ],
    once: true,
    season: 2,
  },
  {
    id: 'common-keys-after',
    channel: 'place:home',
    title: {
      zhCN: '搬家纸箱二号',
      en: 'Boxes, round two',
    },
    text: {
      zhCN: '新住处离公交站更近，搬家公司还是迷了路。',
      en: 'The new place is nearer the bus stop; the removal van still gets lost.',
    },
    weight: 2,
    forbids: ['quarter-housing-change'],
    choices: [
      {
        id: 'move',
        sets: ['quarter-housing-change'],
        label: {
          zhCN: '搬去车站旁',
          en: 'Move beside the stop',
        },
        effects: [
          {
            type: 'money',
            delta: -350,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 7,
          },
        ],
      },
      {
        id: 'other',
        sets: ['quarter-housing-change'],
        label: {
          zhCN: '仍住旧房间',
          en: 'Keep the old room',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 3,
          },
        ],
      },
    ],
    once: true,
    requires: ['keys-planned'],
  },
  {
    id: 'common-rent',
    channel: 'letter',
    title: {
      zhCN: '房租上涨',
      en: 'The rent rises',
    },
    text: {
      zhCN: '房东发来涨租邮件，你把计算器从抽屉底翻出来。',
      en: 'A rent-rise email sends you digging for the calculator.',
    },
    weight: 2,
    forbids: ['quarter-housing-change'],
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '看看便宜住处',
          en: 'Look for somewhere cheaper',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 2,
          },
        ],
        sets: ['rent-planned', 'quarter-housing-change'],
      },
      {
        id: 'skip',
        sets: ['quarter-housing-change', 'rent-rise-1'],
        label: {
          zhCN: '接受新租金',
          en: 'Accept the new rent',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 4,
          },
        ],
      },
    ],
    once: true,
    season: 3,
    when: [
      {
        yearMin: 2,
      },
    ],
  },
  {
    id: 'common-rent-after',
    channel: 'place:home',
    title: {
      zhCN: '第三次打包',
      en: 'Packing again',
    },
    text: {
      zhCN: '更小的住处只有一扇窗，阳光倒很舍得进来。',
      en: 'The smaller place has just one window, but generous sunshine.',
    },
    weight: 2,
    forbids: ['quarter-housing-change'],
    choices: [
      {
        id: 'move',
        sets: ['quarter-housing-change', 'cheap-housing'],
        label: {
          zhCN: '搬去便宜住处',
          en: 'Move to the cheaper place',
        },
        effects: [
          {
            type: 'money',
            delta: -250,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 5,
          },
        ],
      },
      {
        id: 'other',
        sets: ['quarter-housing-change'],
        label: {
          zhCN: '这回先不搬',
          en: 'Postpone the move',
        },
        effects: [
          {
            type: 'money',
            delta: -100,
          },
        ],
      },
    ],
    once: true,
    requires: ['rent-planned'],
  },
  {
    id: 'common-winter-trip',
    channel: 'morning',
    title: {
      zhCN: '冬天的邀约',
      en: 'A winter invitation',
    },
    text: {
      zhCN: '海外朋友说客房空着，照片里连窗帘都晒得发亮。',
      en: 'A friend abroad offers a spare room; even the curtains look sunlit.',
    },
    weight: 2,
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '安排见面',
          en: 'Arrange a visit',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 2,
          },
        ],
        sets: ['winter-trip-planned'],
      },
      {
        id: 'skip',
        label: {
          zhCN: '改约春天视频',
          en: 'Plan a spring call',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 4,
          },
        ],
      },
    ],
    once: true,
    season: 4,
  },
  {
    id: 'common-winter-trip-after',
    channel: 'morning',
    title: {
      zhCN: '客房的早晨',
      en: 'Mornings in the spare room',
    },
    text: {
      zhCN: '朋友整理好了客房，也说可以换他来英国找你。',
      en: 'The spare room is ready, but your friend could visit the UK instead.',
    },
    weight: 2,
    choices: [
      {
        id: 'follow',
        label: {
          zhCN: '记下这次海外小住',
          en: 'Record the month abroad',
        },
        effects: [
          {
            type: 'absence',
            startOffsetDays: -31,
            days: 31,
          },
          {
            type: 'money',
            delta: -450,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 13,
          },
        ],
        note: {
          zhCN: '只记录本情节的事实，政策后果由引擎计算。',
          en: 'Only this scenario’s facts are recorded; the engine calculates policy consequences.',
        },
      },
      {
        id: 'other',
        label: {
          zhCN: '改在英国相聚了',
          en: 'Meet in the UK instead',
        },
        effects: [
          {
            type: 'money',
            delta: -100,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 8,
          },
        ],
      },
    ],
    once: true,
    requires: ['winter-trip-planned'],
  },
  {
    id: 'common-rain',
    when: [{ weather: 'rain' }],
    channel: 'morning',
    title: {
      zhCN: '横着下的雨',
      en: 'Sideways rain',
    },
    text: {
      zhCN: '伞翻了，路边的人默契地一起笑了一声。',
      en: 'The umbrella flips inside out, earning a shared laugh from the pavement.',
    },
    weight: 2,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '买把结实的伞',
          en: 'Buy a stronger umbrella',
        },
        effects: [
          {
            type: 'money',
            delta: -18,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 5,
          },
        ],
      },
      {
        id: 'second',
        label: {
          zhCN: '顶着雨跑回家',
          en: 'Run home in the rain',
        },
        effects: [
          {
            type: 'stat',
            key: 'health',
            delta: -3,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 2,
          },
        ],
      },
    ],
    season: 1,
  },
  {
    id: 'common-yellow-sticker',
    channel: 'morning',
    title: {
      zhCN: '黄标晚餐',
      en: 'Yellow-sticker supper',
    },
    text: {
      zhCN: '超市最后一盒打折甜点，像在货架上等你来。',
      en: 'The last reduced dessert seems to have waited on the shelf for you.',
    },
    weight: 2,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '买来和室友分',
          en: 'Share it with a flatmate',
        },
        effects: [
          {
            type: 'money',
            delta: -3,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 8,
          },
        ],
      },
      {
        id: 'second',
        label: {
          zhCN: '今晚做蔬菜汤',
          en: 'Make vegetable soup',
        },
        effects: [
          {
            type: 'money',
            delta: -5,
          },
          {
            type: 'stat',
            key: 'health',
            delta: 5,
          },
        ],
      },
    ],
    season: 2,
  },
  {
    id: 'common-nhs',
    channel: 'place:gp',
    title: {
      zhCN: '候诊室的钟',
      en: 'The waiting-room clock',
    },
    text: {
      zhCN: 'NHS 候诊室的钟走得很响，你读完了整本旧杂志。',
      en: 'The NHS waiting-room clock is loud; you finish an entire old magazine.',
    },
    weight: 2,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '等到医生叫名',
          en: 'Wait to be called',
        },
        effects: [
          {
            type: 'stat',
            key: 'health',
            delta: 12,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: -2,
          },
        ],
      },
      {
        id: 'second',
        label: {
          zhCN: '改约后去休息',
          en: 'Rebook and rest',
        },
        effects: [
          {
            type: 'stat',
            key: 'health',
            delta: 4,
          },
        ],
      },
    ],
    season: 3,
  },
  {
    id: 'common-biscuits',
    channel: 'place:work',
    title: {
      zhCN: '茶水间饼干',
      en: 'Kitchen biscuits',
    },
    text: {
      zhCN: '同事带来的饼干只剩碎屑，大家仍认真讨论哪块最好。',
      en: 'Only crumbs remain of a colleague’s biscuits; the debate about the best one continues.',
    },
    weight: 2,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '加入讨论',
          en: 'Join the debate',
        },
        effects: [
          {
            type: 'stat',
            key: 'english',
            delta: 4,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 5,
          },
        ],
      },
      {
        id: 'second',
        label: {
          zhCN: '把碎屑留给自己',
          en: 'Claim the crumbs',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 7,
          },
        ],
      },
    ],
    season: 4,
  },
  {
    id: 'common-laundry',
    channel: 'morning',
    title: {
      zhCN: '烘干机排队',
      en: 'The dryer queue',
    },
    text: {
      zhCN: '洗衣房只剩一台烘干机能用，大家抱着湿衣服聊天。',
      en: 'One dryer works; everyone chats while holding damp laundry.',
    },
    weight: 2,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '边等边聊天',
          en: 'Chat while waiting',
        },
        effects: [
          {
            type: 'stat',
            key: 'english',
            delta: 5,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 3,
          },
        ],
      },
      {
        id: 'second',
        label: {
          zhCN: '回家晾起来',
          en: 'Air-dry at home',
        },
        effects: [
          {
            type: 'stat',
            key: 'health',
            delta: -2,
          },
          {
            type: 'money',
            delta: 4,
          },
        ],
      },
    ],
    season: 1,
  },
  {
    id: 'common-snow',
    channel: 'place:home',
    title: {
      zhCN: '雪停了',
      en: 'After the snow',
    },
    text: {
      zhCN: '小镇下了一点雪，公交软件却像进入了冬眠。',
      en: 'A little snow falls; the bus app appears to hibernate.',
    },
    weight: 2,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '步行去公园',
          en: 'Walk to the park',
        },
        effects: [
          {
            type: 'stat',
            key: 'health',
            delta: 6,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 6,
          },
        ],
      },
      {
        id: 'second',
        label: {
          zhCN: '在家喝热茶',
          en: 'Stay in with hot tea',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 8,
          },
        ],
      },
    ],
    season: 1,
  },
  {
    id: 'common-picnic',
    channel: 'place:green',
    title: {
      zhCN: '野餐桌布',
      en: 'A picnic blanket',
    },
    text: {
      zhCN: '公园刚铺好桌布，第一滴雨就来认领三明治。',
      en: 'The picnic blanket goes down; rain immediately claims the sandwiches.',
    },
    weight: 2,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '搬到树下',
          en: 'Move under a tree',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 8,
          },
        ],
      },
      {
        id: 'second',
        label: {
          zhCN: '跑回家煮汤',
          en: 'Run home and make soup',
        },
        effects: [
          {
            type: 'stat',
            key: 'health',
            delta: 6,
          },
          {
            type: 'money',
            delta: -6,
          },
        ],
      },
    ],
    season: 3,
  },
  {
    id: 'common-festival',
    channel: 'place:green',
    title: {
      zhCN: '秋日集市',
      en: 'The autumn fair',
    },
    text: {
      zhCN: '秋日集市的抽奖没中，邻居却塞来一袋自己种的豆角。',
      en: 'The fair raffle yields nothing, but a neighbour hands you home-grown beans.',
    },
    weight: 2,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '帮忙收摊',
          en: 'Help pack up',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 10,
          },
          {
            type: 'stat',
            key: 'health',
            delta: 3,
          },
        ],
      },
      {
        id: 'second',
        label: {
          zhCN: '买杯柠檬水',
          en: 'Buy lemonade',
        },
        effects: [
          {
            type: 'money',
            delta: -4,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 7,
          },
        ],
      },
    ],
    season: 4,
  },
  {
    id: 'common-bonus',
    channel: 'place:work',
    title: {
      zhCN: '到账的奖金',
      en: 'A bonus arrives',
    },
    text: {
      zhCN: '项目奖金来了，公司问你还想不想接下一轮收尾。',
      en: 'The project bonus arrives, and the company asks about another round of work.',
    },
    weight: 2,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '接下下一轮，周末再庆祝',
          en: 'Take another round and celebrate at the weekend',
        },
        effects: [
          {
            type: 'income',
            taxYear: 'current',
            earnings: 52000,
          },
          {
            type: 'money',
            delta: 400,
          },
        ],
        note: {
          zhCN: '本情节写入全年税前收入 £52,000，政策后果由引擎计算。',
          en: 'This scenario records £52,000 in annual gross earnings; the engine calculates policy consequences.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '少接一轮，把周末留给自己',
          en: 'Keep a round free for yourself',
        },
        effects: [
          {
            type: 'income',
            taxYear: 'current',
            earnings: 48000,
          },
          {
            type: 'money',
            delta: 200,
          },
        ],
        note: {
          zhCN: '本情节写入全年税前收入 £48,000，政策后果由引擎计算。',
          en: 'This scenario records £48,000 in annual gross earnings; the engine calculates policy consequences.',
        },
      },
    ],
    season: 1,
  },
  {
    id: 'common-tax-return',
    channel: 'letter',
    title: {
      zhCN: '税年结单',
      en: 'The annual statement',
    },
    text: {
      zhCN: '新项目和晚课撞了时间，你把日历翻到下个月。',
      en: 'A new project clashes with evening classes; you turn to next month’s calendar.',
    },
    weight: 2,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '接下新项目',
          en: 'Take the new project',
        },
        effects: [
          {
            type: 'income',
            taxYear: 'current',
            earnings: 45000,
          },
        ],
        note: {
          zhCN: '本情节写入全年税前收入 £45,000，政策后果由引擎计算。',
          en: 'This scenario records £45,000 in annual gross earnings; the engine calculates policy consequences.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '保留晚课时间',
          en: 'Keep time for evening classes',
        },
        effects: [
          {
            type: 'income',
            taxYear: 'current',
            earnings: 38000,
          },
        ],
        note: {
          zhCN: '本情节写入全年税前收入 £38,000，政策后果由引擎计算。',
          en: 'This scenario records £38,000 in annual gross earnings; the engine calculates policy consequences.',
        },
      },
    ],
    season: 2,
  },
  {
    id: 'common-care',
    channel: 'place:station',
    title: {
      zhCN: '短暂的探亲',
      en: 'A brief family visit',
    },
    text: {
      zhCN: '家人的手术恢复顺利，你从机场带回一袋零食。',
      en: 'A relative recovers well from surgery; you return from the airport with snacks.',
    },
    weight: 2,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '记下两个月海外照顾',
          en: 'Record sixty days caring abroad',
        },
        effects: [
          {
            type: 'absence',
            startOffsetDays: -60,
            days: 60,
          },
          {
            type: 'money',
            delta: -500,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 8,
          },
        ],
        note: {
          zhCN: '只写入本情节已发生的记录，政策后果由引擎计算。',
          en: 'Records only facts that have occurred in this scenario; the engine calculates consequences.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '这次由亲人照顾，我没离境',
          en: 'Relatives handled the care; stay in the UK',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: -3,
          },
        ],
      },
    ],
    season: 3,
  },
  {
    id: 'common-reunion',
    channel: 'morning',
    title: {
      zhCN: '老同学聚会',
      en: 'A class reunion',
    },
    text: {
      zhCN: '聚会照片里大家都变了发型，只有那盘菜没变。',
      en: 'Everyone in the reunion photographs has new hair; the familiar dish has not changed.',
    },
    weight: 2,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '飞去海外聚了十天',
          en: 'Flew out for ten days with old classmates',
        },
        effects: [
          {
            type: 'absence',
            startOffsetDays: -10,
            days: 10,
          },
          {
            type: 'money',
            delta: -350,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 10,
          },
        ],
        note: {
          zhCN: '只写入本情节已发生的记录，政策后果由引擎计算。',
          en: 'Records only facts that have occurred in this scenario; the engine calculates consequences.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '视频连线加入',
          en: 'Join by video',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 5,
          },
        ],
      },
    ],
    season: 4,
  },
  {
    id: 'common-kol-retake',
    channel: 'morning',
    title: {
      zhCN: '书页上的茶渍',
      en: 'Tea on the textbook',
    },
    text: {
      zhCN: 'Life in the UK 书上多了茶渍，你这次记住了那几页。',
      en: 'Tea stains mark the Life in the UK book; this time those pages stick.',
    },
    weight: 2,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '备考并通过',
          en: 'Prepare and pass',
        },
        effects: [
          {
            type: 'lifeInTheUk',
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 6,
          },
        ],
        note: {
          zhCN: '只写入本情节已发生的记录，政策后果由引擎计算。',
          en: 'Records only facts that have occurred in this scenario; the engine calculates consequences.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '再复习一季',
          en: 'Revise for another quarter',
        },
        effects: [
          {
            type: 'stat',
            key: 'english',
            delta: 4,
          },
        ],
      },
    ],
    season: 1,
  },
  {
    id: 'common-debt-paid',
    channel: 'place:home',
    title: {
      zhCN: '抽屉里的收据',
      en: 'Receipts in the drawer',
    },
    text: {
      zhCN: '你把政府欠款的收据按日期排好，抽屉终于能关上。',
      en: 'Government-debt receipts are sorted by date; the drawer finally closes.',
    },
    weight: 2,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '本情节中全部付清',
          en: 'In this scenario, clear the balance',
        },
        effects: [
          {
            type: 'money',
            delta: -300,
          },
          {
            type: 'timeline',
            patch: {
              governmentDebt: {
                outstanding: false,
              },
            },
          },
        ],
        note: {
          zhCN: '只写入本情节已发生的记录，政策后果由引擎计算。',
          en: 'Records only facts that have occurred in this scenario; the engine calculates consequences.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '余额仍在核对',
          en: 'The balance remains outstanding',
        },
        effects: [
          {
            type: 'timeline',
            patch: {
              governmentDebt: {
                outstanding: true,
              },
            },
          },
        ],
        note: {
          zhCN: '只写入本情节已发生的记录，政策后果由引擎计算。',
          en: 'Records only facts that have occurred in this scenario; the engine calculates consequences.',
        },
      },
    ],
    season: 2,
  },
  {
    id: 'common-remote-visit',
    channel: 'morning',
    title: {
      zhCN: '远方的书桌',
      en: 'A desk far away',
    },
    text: {
      zhCN: '海外亲人的书桌借给你一个月，窗外鸟叫代替了公交声。',
      en: 'Family lend you a desk abroad for a month, with birds instead of buses outside.',
    },
    weight: 2,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '记下这个月的离境',
          en: 'Record thirty days abroad',
        },
        effects: [
          {
            type: 'absence',
            startOffsetDays: -30,
            days: 30,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 9,
          },
        ],
        note: {
          zhCN: '只写入本情节已发生的记录，政策后果由引擎计算。',
          en: 'Records only facts that have occurred in this scenario; the engine calculates consequences.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '最后没成行，仍在英国',
          en: 'The trip fell through; stay in the UK',
        },
        effects: [
          {
            type: 'stat',
            key: 'career',
            delta: 3,
          },
        ],
      },
    ],
    season: 3,
  },
  {
    id: 'common-overtime-pay',
    channel: 'place:work',
    title: {
      zhCN: '补发工资',
      en: 'Back pay',
    },
    text: {
      zhCN: '财务补发了工资，经理顺便问下个项目能否多做一轮。',
      en: 'Missing pay arrives, and the manager asks about another round on the next project.',
    },
    weight: 2,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '加接一轮项目',
          en: 'Take another round of work',
        },
        effects: [
          {
            type: 'income',
            taxYear: 'current',
            earnings: 56000,
          },
          {
            type: 'money',
            delta: 250,
          },
        ],
        note: {
          zhCN: '本情节写入全年税前收入 £56,000，政策后果由引擎计算。',
          en: 'This scenario records £56,000 in annual gross earnings; the engine calculates policy consequences.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '保留当前工时',
          en: 'Keep the current hours',
        },
        effects: [
          {
            type: 'income',
            taxYear: 'current',
            earnings: 51000,
          },
          {
            type: 'money',
            delta: 150,
          },
        ],
        note: {
          zhCN: '本情节写入全年税前收入 £51,000，政策后果由引擎计算。',
          en: 'This scenario records £51,000 in annual gross earnings; the engine calculates policy consequences.',
        },
      },
    ],
    season: 4,
  },
  {
    id: 'common-leaves',
    channel: 'place:green',
    title: {
      zhCN: '落叶的声音',
      en: 'Leaves underfoot',
    },
    text: {
      zhCN: '公园铺满落叶，踩上去像在拆一大包薯片。',
      en: 'Leaves cover the park, crunching like a giant bag of crisps.',
    },
    weight: 2,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '绕公园走一圈',
          en: 'Walk around the park',
        },
        effects: [
          {
            type: 'stat',
            key: 'health',
            delta: 7,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 6,
          },
        ],
      },
      {
        id: 'second',
        label: {
          zhCN: '坐下画两笔',
          en: 'Sit and sketch',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 9,
          },
        ],
      },
    ],
    season: 4,
  },
  {
    id: 'common-market',
    channel: 'place:green',
    title: {
      zhCN: '集市日',
      en: 'Market day',
    },
    text: {
      zhCN: '集市摊主记住了你的面包口味，还多给了一片。',
      en: 'The market baker remembers your favourite loaf and adds an extra slice.',
    },
    weight: 2,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '用英语聊聊食谱',
          en: 'Chat about recipes',
        },
        effects: [
          {
            type: 'money',
            delta: -5,
          },
          {
            type: 'stat',
            key: 'english',
            delta: 4,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 5,
          },
        ],
      },
      {
        id: 'second',
        label: {
          zhCN: '带回家慢慢吃',
          en: 'Take it home',
        },
        effects: [
          {
            type: 'money',
            delta: -5,
          },
          {
            type: 'stat',
            key: 'health',
            delta: 3,
          },
        ],
      },
    ],
    season: 2,
  },
  {
    id: 'common-power',
    channel: 'morning',
    title: {
      zhCN: '停电了',
      en: 'A power cut',
    },
    text: {
      zhCN: '街上停电了，邻居的手电筒照亮了半条走廊。',
      en: 'A power cut leaves the neighbour’s torch lighting half the hallway.',
    },
    weight: 2,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '分享热水和茶',
          en: 'Share hot water and tea',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 9,
          },
        ],
      },
      {
        id: 'second',
        label: {
          zhCN: '点蜡烛吃早饭',
          en: 'Eat breakfast by candlelight',
        },
        effects: [
          {
            type: 'stat',
            key: 'health',
            delta: 9,
          },
        ],
      },
    ],
    season: 3,
  },
  {
    id: 'common-parcel',
    channel: 'morning',
    title: {
      zhCN: '错投的包裹',
      en: 'A misdelivered parcel',
    },
    text: {
      zhCN: '包裹送到了隔壁，敲门时顺便认识了那只很吵的狗。',
      en: 'A parcel goes next door, introducing you to a very vocal dog.',
    },
    weight: 2,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '站在门口聊会儿',
          en: 'Chat at the doorstep',
        },
        effects: [
          {
            type: 'stat',
            key: 'english',
            delta: 3,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 6,
          },
        ],
      },
      {
        id: 'second',
        label: {
          zhCN: '拿回家拆开',
          en: 'Take the parcel home',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 4,
          },
        ],
      },
    ],
    season: 4,
  },
  ...additionalCommonEvents,
  ...townEvents,
  ...placeEvents,
  ...noticeEvents,
  ...festivalEvents,
];

export const systemEvents: GameEvent[] = [
  {
    id: 'system-exam-failed',
    channel: 'morning',
    title: {
      zhCN: '考场小插曲',
      en: 'A test-day setback',
    },
    text: {
      zhCN: '听力里的广播太快了，这次成绩单还不够换一张证明。',
      en: 'The recording raced ahead; this result does not earn new evidence.',
    },
    weight: 1,
    choices: [
      {
        id: 'study',
        label: {
          zhCN: '带着错题回晚课',
          en: 'Take the mistakes to class',
        },
        effects: [
          {
            type: 'stat',
            key: 'english',
            delta: 5,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 3,
          },
        ],
      },
      {
        id: 'rest',
        label: {
          zhCN: '先喝杯热茶',
          en: 'Have a warm cup of tea',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 7,
          },
        ],
      },
    ],
  },
  {
    id: 'system-hospital',
    channel: 'morning',
    title: {
      zhCN: '身体按下暂停',
      en: 'The body calls time',
    },
    text: {
      zhCN: '身体撑不住了，NHS 病房的朋友带来一双干净袜子。',
      en: 'Your body gives out; a friend brings clean socks to the NHS ward.',
    },
    weight: 1,
    when: [
      {
        stat: 'health',
        max: 0,
      },
    ],
    choices: [
      {
        id: 'recover',
        label: {
          zhCN: '留在英国好好休养',
          en: 'Rest and recover in the UK',
        },
        effects: [
          {
            type: 'stat',
            key: 'health',
            delta: 35,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 8,
          },
        ],
      },
      {
        id: 'help',
        label: {
          zhCN: '请朋友陪着恢复',
          en: 'Recover with a friend’s help',
        },
        effects: [
          {
            type: 'stat',
            key: 'health',
            delta: 25,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 15,
          },
        ],
      },
    ],
  },
  {
    id: 'system-homesick',
    channel: 'morning',
    title: {
      zhCN: '想回家',
      en: 'Homesick',
    },
    text: {
      zhCN: '雨一直下，行李箱放在床底，今晚忽然离你很近。',
      en: 'The rain keeps falling; tonight the suitcase under the bed feels close.',
    },
    weight: 1,
    when: [
      {
        stat: 'mood',
        max: 0,
      },
    ],
    choices: [
      {
        id: 'stay',
        label: {
          zhCN: '找朋友聊一晚',
          en: 'Spend an evening with a friend',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 25,
          },
        ],
      },
      {
        id: 'leave',
        label: {
          zhCN: '收拾行李离开英国',
          en: 'Pack up and leave the UK',
        },
        effects: [
          {
            type: 'ending',
            ending: 'left',
          },
        ],
      },
    ],
  },
  {
    id: 'system-debt',
    channel: 'morning',
    forbids: ['quarter-housing-change'],
    title: {
      zhCN: '余额又红了',
      en: 'In the red again',
    },
    text: {
      zhCN: '连续两个季末，余额都躲在零以下，房租邮件又来了。',
      en: 'Two quarter ends in the red, and another rent email arrives.',
    },
    weight: 1,
    requires: ['debt-crisis'],
    choices: [
      {
        id: 'borrow',
        sets: ['quarter-housing-change'],
        label: {
          zhCN: '向朋友借钱周转',
          en: 'Borrow from a friend',
        },
        effects: [
          {
            type: 'money',
            delta: 2500,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 6,
          },
        ],
      },
      {
        id: 'move',
        label: {
          zhCN: '搬去更便宜的住处',
          en: 'Move somewhere cheaper',
        },
        effects: [
          {
            type: 'money',
            delta: 1000,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 4,
          },
        ],
        sets: ['cheap-housing', 'quarter-housing-change'],
      },
    ],
  },
];
