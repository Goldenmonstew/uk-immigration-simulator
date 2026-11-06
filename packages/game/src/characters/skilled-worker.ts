import { skilledWorkerAdditions } from './skilled-worker-additions';
import { extensionCost } from '../locations';
import type { Character, GameEvent } from '../types';

// Fictional individual facts, not policy thresholds.
const events: GameEvent[] = [
  {
    id: 'sw-visa-folder',
    channel: 'place:home',
    title: {
      zhCN: '桌上的文件夹',
      en: 'The folder on the desk',
    },
    text: {
      zhCN: '续签日期越来越近，林遥把文件夹放到茶杯旁。',
      en: 'Renewal draws closer; Yao puts the folder beside the teacup.',
    },
    weight: 3,
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '整理文件，去签证中心',
          en: 'Sort the papers for the visa centre',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 3,
          },
        ],
        sets: ['visa-folder-planned'],
      },
      {
        id: 'skip',
        label: {
          zhCN: '先把提醒贴冰箱上',
          en: 'Put a reminder on the fridge',
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
    when: [
      {
        visaMonthsLeftMax: 12,
      },
    ],
  },
  {
    id: 'sw-visa-folder-after',
    channel: 'place:home',
    title: {
      zhCN: '续签后的冰箱',
      en: 'The fridge after renewal',
    },
    text: {
      zhCN: '续签手续办妥，冰箱上的提醒终于换成了购物清单。',
      en: 'With renewal done, the reminder on the fridge becomes a shopping list.',
    },
    weight: 3,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '把文件收好，煮顿晚饭',
          en: 'File the papers and cook dinner',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 12,
          },
        ],
      },
      {
        id: 'second',
        label: {
          zhCN: '请朋友来吃饭',
          en: 'Invite friends for dinner',
        },
        effects: [
          {
            type: 'money',
            delta: -30,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 16,
          },
        ],
      },
    ],
    once: true,
    requires: ['visa-folder-planned', 'visa-renewed'],
  },
  {
    id: 'sw-job-invite',
    channel: 'letter',
    title: {
      zhCN: '招聘邮件',
      en: 'A recruiter’s email',
    },
    text: {
      zhCN: '测试团队约林遥聊聊新岗位，邮件里还有一张办公室狗的照片。',
      en: 'A testing team invites Yao to discuss a role, with a photo of the office dog.',
    },
    weight: 3,
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '去面试聊聊',
          en: 'Go and talk',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 3,
          },
        ],
        sets: ['job-invite-planned'],
      },
      {
        id: 'skip',
        label: {
          zhCN: '留在熟悉的团队',
          en: 'Stay with the familiar team',
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
    when: [
      {
        yearMin: 2,
      },
    ],
  },
  {
    id: 'sw-job-invite-after',
    channel: 'letter',
    title: {
      zhCN: '新工牌',
      en: 'A new pass',
    },
    text: {
      zhCN: '新公司发来担保材料，林遥的旧工牌仍挂在胸前。',
      en: 'The new company sends sponsorship papers; Yao still wears the old pass.',
    },
    weight: 3,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '付费更新许可，接下测试岗位',
          en: 'Pay to update permission and take the testing role',
        },
        effects: [
          {
            type: 'money',
            delta: -extensionCost,
          },
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
          {
            type: 'income',
            taxYear: 'current',
            earnings: 55000,
          },
          {
            type: 'stat',
            key: 'career',
            delta: 10,
          },
        ],
        note: {
          zhCN: '本情节假定新许可已获批并收取标准申请费及 IHS，不模拟审批。',
          en: 'The scenario assumes new permission has been granted and charges the standard application fee plus IHS, without simulating the decision.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '谢绝邀请，留在原岗位',
          en: 'Decline and stay',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 6,
          },
        ],
      },
    ],
    once: true,
    requires: ['job-invite-planned'],
    when: [
      {
        stat: 'money',
        min: extensionCost,
      },
    ],
  },
  {
    id: 'sw-parents-call',
    channel: 'phone',
    title: {
      zhCN: '爸妈的新手机',
      en: 'The new family phone',
    },
    text: {
      zhCN: '爸妈学会了视频通话，镜头却总对着天花板。',
      en: 'Yao’s parents master video calls, mostly pointing the camera at the ceiling.',
    },
    weight: 3,
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '答应回去住一阵',
          en: 'Promise a longer visit',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 3,
          },
        ],
        sets: ['parents-call-planned'],
      },
      {
        id: 'skip',
        label: {
          zhCN: '约定每周通话',
          en: 'Arrange a weekly call',
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
  },
  {
    id: 'sw-parents-call-after',
    channel: 'place:home',
    title: {
      zhCN: '久违的早餐',
      en: 'A familiar breakfast',
    },
    text: {
      zhCN: '相聚的日子结束，早餐桌上又只剩一副碗筷，林遥还是多煮了一个蛋。',
      en: 'The visit is over; breakfast is back to one bowl, though Yao still boils an extra egg.',
    },
    weight: 3,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '回国陪父母住了三个月',
          en: 'Spent ninety days with the parents abroad',
        },
        effects: [
          {
            type: 'absence',
            startOffsetDays: -90,
            days: 90,
          },
          {
            type: 'money',
            delta: -700,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 18,
          },
        ],
        note: {
          zhCN: '只记录虚构情节中的事实，政策后果由引擎计算。',
          en: 'Records the fictional scenario’s facts; the engine calculates policy consequences.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '最后是父母来英国小住',
          en: 'In the end the parents stayed in the UK',
        },
        effects: [
          {
            type: 'money',
            delta: -200,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 12,
          },
        ],
      },
    ],
    once: true,
    requires: ['parents-call-planned'],
  },
  {
    id: 'sw-partner-call',
    channel: 'phone',
    title: {
      zhCN: '两个人的时差',
      en: 'Time zones for two',
    },
    text: {
      zhCN: '伴侣下班时林遥正开晨会，聊天总差一个合适的钟点。',
      en: 'Yao starts morning meetings as a partner finishes work; the clocks never quite meet.',
    },
    weight: 3,
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '商量一起生活',
          en: 'Talk about living together',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 3,
          },
        ],
        sets: ['partner-call-planned'],
      },
      {
        id: 'skip',
        label: {
          zhCN: '继续异地，认真约时间',
          en: 'Make time for the long distance',
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
  },
  {
    id: 'sw-partner-call-after',
    channel: 'phone',
    title: {
      zhCN: '两把牙刷',
      en: 'Two toothbrushes',
    },
    text: {
      zhCN: '伴侣来英国了，洗手台多一把牙刷，房间忽然小了一点。',
      en: 'The partner arrives in the UK; one extra toothbrush makes the room feel smaller.',
    },
    weight: 3,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '一起安顿生活',
          en: 'Settle in together',
        },
        effects: [
          {
            type: 'relationship',
            remove: 'PARTNER',
            add: {
              type: 'PARTNER',
              otherPartyStatus: 'OTHER',
            },
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 15,
          },
        ],
        sets: ['partner-arrived'],
        note: {
          zhCN: '只记录虚构情节中的事实，政策后果由引擎计算。',
          en: 'Records the fictional scenario’s facts; the engine calculates policy consequences.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '先分别租住，慢慢适应',
          en: 'Keep separate homes while adjusting',
        },
        effects: [
          {
            type: 'relationship',
            remove: 'PARTNER',
            add: {
              type: 'PARTNER',
              otherPartyStatus: 'OTHER',
            },
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 8,
          },
        ],
        sets: ['partner-arrived'],
        note: {
          zhCN: '只记录虚构情节中的事实，政策后果由引擎计算。',
          en: 'Records the fictional scenario’s facts; the engine calculates policy consequences.',
        },
      },
    ],
    once: true,
    requires: ['partner-call-planned'],
  },
  {
    id: 'sw-dinner',
    channel: 'place:pub',
    title: {
      zhCN: '同事的庆功饭',
      en: 'A team dinner',
    },
    text: {
      zhCN: '项目上线了，同事点了酒，林遥把车钥匙放在桌边。',
      en: 'The project launches; colleagues order drinks as Yao puts car keys on the table.',
    },
    weight: 3,
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '吃完这顿',
          en: 'Finish the meal',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 3,
          },
        ],
        sets: ['dinner-planned'],
      },
      {
        id: 'skip',
        label: {
          zhCN: '提前坐公交回家',
          en: 'Take the bus home early',
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
  },
  {
    id: 'sw-dinner-after',
    channel: 'place:pub',
    title: {
      zhCN: '散场的车钥匙',
      en: 'Keys at closing time',
    },
    text: {
      zhCN: '喝过酒，散场时钥匙还在口袋里，出租车正在排队。',
      en: 'After drinks, the keys are still in a pocket and taxis wait outside.',
    },
    weight: 3,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '叫车回家',
          en: 'Take a taxi',
        },
        effects: [
          {
            type: 'money',
            delta: -25,
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
          zhCN: '酒驾，后来被定罪',
          en: 'Drive after drinking and later be convicted',
        },
        effects: [
          {
            type: 'criminal',
            event: {},
          },
        ],
        note: {
          zhCN: '只记录虚构情节中的事实，政策后果由引擎计算。',
          en: 'Records the fictional scenario’s facts; the engine calculates policy consequences.',
        },
      },
    ],
    once: true,
    requires: ['dinner-planned'],
  },
  {
    id: 'sw-review',
    when: [{ weather: 'rain' }],
    channel: 'place:work',
    title: {
      zhCN: '年度面谈',
      en: 'The annual review',
    },
    text: {
      zhCN: '经理问林遥明年想做什么，窗外的雨替沉默打了拍子。',
      en: 'A manager asks about next year; rain provides the rhythm while Yao thinks.',
    },
    weight: 3,
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '争取更多项目责任',
          en: 'Ask for more responsibility',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 3,
          },
        ],
        sets: ['review-planned'],
      },
      {
        id: 'skip',
        label: {
          zhCN: '先稳住现在的节奏',
          en: 'Keep the current rhythm',
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
  },
  {
    id: 'sw-review-after',
    channel: 'place:work',
    title: {
      zhCN: '带新人那天',
      en: 'A new starter’s first day',
    },
    text: {
      zhCN: '林遥带新人认路，第一次发现自己已经不需要看门牌。',
      en: 'Showing a new starter around, Yao realises the door signs are no longer needed.',
    },
    weight: 3,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '认真带完一个项目',
          en: 'Guide the next project',
        },
        effects: [
          {
            type: 'stat',
            key: 'career',
            delta: 15,
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
          zhCN: '把经验写成小册子',
          en: 'Write a little handbook',
        },
        effects: [
          {
            type: 'stat',
            key: 'career',
            delta: 8,
          },
          {
            type: 'stat',
            key: 'english',
            delta: 5,
          },
        ],
      },
    ],
    once: true,
    requires: ['review-planned'],
  },
  {
    id: 'sw-assignment',
    channel: 'place:work',
    title: {
      zhCN: '海外项目的空位',
      en: 'An overseas assignment',
    },
    text: {
      zhCN: '海外项目缺一位测试员，林遥盯着地图看了一会儿。',
      en: 'An overseas project needs a tester; Yao studies the map for a while.',
    },
    weight: 3,
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '考虑外派',
          en: 'Consider the assignment',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 3,
          },
        ],
        sets: ['assignment-planned'],
      },
      {
        id: 'skip',
        label: {
          zhCN: '留在英国团队',
          en: 'Stay with the UK team',
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
    when: [
      {
        yearMin: 2,
      },
    ],
  },
  {
    id: 'sw-assignment-after',
    channel: 'place:home',
    title: {
      zhCN: '八个月的行李',
      en: 'Eight months in a suitcase',
    },
    text: {
      zhCN: '项目终于收尾，林遥翻出这段时间的行程记录。',
      en: 'The project closes; Yao looks back through the travel diary.',
    },
    weight: 3,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '在海外驻场了八个月',
          en: 'Spent 240 days working on site abroad',
        },
        effects: [
          {
            type: 'absence',
            startOffsetDays: -240,
            days: 240,
          },
          {
            type: 'stat',
            key: 'career',
            delta: 12,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 8,
          },
        ],
        note: {
          zhCN: '只记录虚构情节中的事实，政策后果由引擎计算。',
          en: 'Records the fictional scenario’s facts; the engine calculates policy consequences.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '实际改成英国远程协作',
          en: 'The work was done remotely from the UK',
        },
        effects: [
          {
            type: 'stat',
            key: 'career',
            delta: 7,
          },
        ],
      },
    ],
    once: true,
    requires: ['assignment-planned'],
  },
  {
    id: 'sw-four-days',
    channel: 'place:work',
    title: {
      zhCN: '周五的可能性',
      en: 'A possible free Friday',
    },
    text: {
      zhCN: '公司提议缩短工时，林遥开始想象周五上午的公园。',
      en: 'Shorter hours are offered; Yao imagines Friday mornings in the park.',
    },
    weight: 3,
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '细算一下四天安排',
          en: 'Work through the four-day option',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 3,
          },
        ],
        sets: ['four-days-planned'],
      },
      {
        id: 'skip',
        label: {
          zhCN: '先保留全职',
          en: 'Keep full-time hours',
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
    when: [
      {
        yearMin: 2,
      },
    ],
  },
  {
    id: 'sw-four-days-after',
    channel: 'place:work',
    title: {
      zhCN: '空出来的星期五',
      en: 'A free Friday',
    },
    text: {
      zhCN: '日历多出了一块空白，林遥差点又往里面填上会议。',
      en: 'A blank space appears in the calendar; Yao almost fills it with a meeting.',
    },
    weight: 3,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '改为年薪四万四的安排',
          en: 'Take the forty-four-thousand arrangement',
        },
        effects: [
          {
            type: 'episode',
            patch: {
              salary: 44000,
            },
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 15,
          },
          {
            type: 'stat',
            key: 'health',
            delta: 5,
          },
        ],
        note: {
          zhCN: '只记录虚构情节中的事实，政策后果由引擎计算。',
          en: 'Records the fictional scenario’s facts; the engine calculates policy consequences.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '继续原来的工作安排',
          en: 'Keep the existing arrangement',
        },
        effects: [
          {
            type: 'stat',
            key: 'career',
            delta: 4,
          },
        ],
      },
    ],
    once: true,
    requires: ['four-days-planned'],
  },
  {
    id: 'sw-partner-budget',
    channel: 'phone',
    title: {
      zhCN: '伴侣的坏消息',
      en: 'Bad news at home',
    },
    text: {
      zhCN: '伴侣的合同没续上，林遥把外卖软件暂时挪出了首页。',
      en: 'A partner’s contract ends; Yao moves the takeaway app off the home screen.',
    },
    weight: 3,
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '一起重新算账',
          en: 'Rework the budget together',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 3,
          },
        ],
        sets: ['partner-budget-planned'],
      },
      {
        id: 'skip',
        label: {
          zhCN: '先找朋友聊聊',
          en: 'Talk to a friend first',
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
    requires: ['partner-arrived'],
  },
  {
    id: 'sw-partner-budget-after',
    channel: 'letter',
    title: {
      zhCN: '重新排预算',
      en: 'A revised budget',
    },
    text: {
      zhCN: '两人把账单排在桌上，茶续了两杯，账还没算完。',
      en: 'Bills cover the table; two refills later, the sums are still going.',
    },
    weight: 3,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '私人借款撑一阵',
          en: 'Use a private loan for a while',
        },
        effects: [
          {
            type: 'money',
            delta: 1000,
          },
          {
            type: 'income',
            taxYear: 'current',
            partnerEarnings: 0,
          },
        ],
        note: {
          zhCN: '只记录虚构情节中的事实，政策后果由引擎计算。',
          en: 'Records the fictional scenario’s facts; the engine calculates policy consequences.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '本情节中本人领取 UC',
          en: 'In this scenario, receive UC',
        },
        effects: [
          {
            type: 'money',
            delta: 600,
          },
          {
            type: 'income',
            taxYear: 'current',
            partnerEarnings: 0,
          },
          {
            type: 'benefit',
            benefit: {
              benefitType: 'UNIVERSAL_CREDIT',
            },
            startOffsetDays: 0,
            months: 6,
          },
        ],
        note: {
          zhCN: '只记录虚构情节中的事实，政策后果由引擎计算。',
          en: 'Records the fictional scenario’s facts; the engine calculates policy consequences.',
        },
      },
    ],
    once: true,
    requires: ['partner-budget-planned'],
  },
  {
    id: 'sw-bonus-review',
    channel: 'place:work',
    title: {
      zhCN: '项目收尾',
      en: 'Closing the project',
    },
    text: {
      zhCN: '项目终于交付，林遥的桌面从十几个窗口变成了一张壁纸。',
      en: 'The project ships; Yao’s desktop goes from a dozen windows to a wallpaper.',
    },
    weight: 3,
    choices: [
      {
        id: 'plan',
        label: {
          zhCN: '整理奖金材料',
          en: 'Sort the bonus paperwork',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 3,
          },
        ],
        sets: ['bonus-review-planned'],
      },
      {
        id: 'skip',
        label: {
          zhCN: '把周末留给休息',
          en: 'Keep the weekend for rest',
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
  },
  {
    id: 'sw-bonus-review-after',
    channel: 'place:work',
    title: {
      zhCN: '奖金那一行',
      en: 'The bonus line',
    },
    text: {
      zhCN: '年终奖金到账，公司又问林遥愿不愿接后续维护。',
      en: 'The annual bonus arrives, with an offer of follow-up maintenance work.',
    },
    weight: 3,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '接下后续维护',
          en: 'Take the follow-up maintenance',
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
        id: 'second',
        label: {
          zhCN: '按原计划收尾，留下假期',
          en: 'Finish as planned and keep the holiday',
        },
        effects: [
          {
            type: 'income',
            taxYear: 'current',
            earnings: 55000,
          },
          {
            type: 'money',
            delta: 250,
          },
        ],
        note: {
          zhCN: '本情节写入全年税前收入 £55,000，政策后果由引擎计算。',
          en: 'This scenario records £55,000 in annual gross earnings; the engine calculates policy consequences.',
        },
      },
    ],
    once: true,
    requires: ['bonus-review-planned'],
  },
  {
    id: 'sw-first-rain',
    when: [{ weather: 'rain' }],
    channel: 'place:work',
    title: {
      zhCN: '入职第一场雨',
      en: 'Rain on the way to work',
    },
    text: {
      zhCN: '林遥走进办公室时鞋还在滴水，同事递来一包纸巾。',
      en: 'Yao arrives with dripping shoes; a colleague offers tissues.',
    },
    weight: 3,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '说声谢谢，聊聊周末',
          en: 'Say thanks and chat about the weekend',
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
            delta: 6,
          },
        ],
      },
      {
        id: 'second',
        label: {
          zhCN: '换上备用袜子',
          en: 'Change into spare socks',
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
  },
  {
    id: 'sw-soup',
    channel: 'place:home',
    title: {
      zhCN: '留着的一碗汤',
      en: 'A saved bowl of soup',
    },
    text: {
      zhCN: '早上林遥才发现，室友给昨晚加班的她留了一碗汤。',
      en: 'In the morning Yao discovers the soup her flatmate saved after last night’s late shift.',
    },
    weight: 3,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '坐下慢慢喝',
          en: 'Sit and enjoy it',
        },
        effects: [
          {
            type: 'stat',
            key: 'health',
            delta: 8,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 7,
          },
        ],
      },
      {
        id: 'second',
        label: {
          zhCN: '留张便签道谢',
          en: 'Leave a thank-you note',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 8,
          },
          {
            type: 'stat',
            key: 'english',
            delta: 2,
          },
        ],
      },
    ],
    once: true,
  },
  {
    id: 'sw-debug',
    channel: 'place:work',
    title: {
      zhCN: '消失的 bug',
      en: 'A disappearing bug',
    },
    text: {
      zhCN: 'bug 在演示前自己消失了，林遥和同事都不太敢高兴。',
      en: 'A bug disappears before the demo; nobody quite dares celebrate.',
    },
    weight: 3,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '结对查清原因',
          en: 'Investigate together',
        },
        effects: [
          {
            type: 'stat',
            key: 'career',
            delta: 8,
          },
          {
            type: 'stat',
            key: 'english',
            delta: 3,
          },
        ],
      },
      {
        id: 'second',
        label: {
          zhCN: '先做好记录再下班',
          en: 'Document it and clock off',
        },
        effects: [
          {
            type: 'stat',
            key: 'career',
            delta: 3,
          },
          {
            type: 'stat',
            key: 'health',
            delta: 4,
          },
        ],
      },
    ],
    once: true,
  },
  {
    id: 'sw-park-call',
    channel: 'phone',
    title: {
      zhCN: '公园的电话',
      en: 'A call in the park',
    },
    text: {
      zhCN: '林遥坐在长椅上给家里打电话，鸭子抢走了背景音。',
      en: 'Yao calls home from a bench; the ducks dominate the soundtrack.',
    },
    weight: 3,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '多聊一会儿',
          en: 'Talk a little longer',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 12,
          },
        ],
      },
      {
        id: 'second',
        label: {
          zhCN: '沿湖边走边聊',
          en: 'Walk round the lake while talking',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 7,
          },
          {
            type: 'stat',
            key: 'health',
            delta: 5,
          },
        ],
      },
    ],
    once: true,
  },
  {
    id: 'sw-landlord-visit',
    channel: 'phone',
    title: {
      zhCN: '临时检查',
      en: 'A sudden inspection',
    },
    text: {
      zhCN: '房东说过两天来检查，林遥看了看满屋晾着的衣服。',
      en: 'The landlord plans a visit in a couple of days; laundry covers Yao’s room.',
    },
    weight: 3,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '收拾完出门散步',
          en: 'Tidy up and take a walk',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 5,
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
          zhCN: '商量换个时间',
          en: 'Agree another time',
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
            delta: 3,
          },
        ],
      },
    ],
    once: true,
  },
  {
    id: 'sw-promotion-cake',
    channel: 'place:work',
    title: {
      zhCN: '升职的蛋糕',
      en: 'Promotion cake',
    },
    text: {
      zhCN: '同事买了小蛋糕，林遥的新职称在糖霜上差点写不下。',
      en: 'Colleagues buy a cake; Yao’s new title barely fits in the icing.',
    },
    weight: 3,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '一起吃掉长职称',
          en: 'Share the long job title',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 14,
          },
        ],
      },
      {
        id: 'second',
        label: {
          zhCN: '留一块带回家',
          en: 'Save a slice for home',
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
    ],
    once: true,
    requires: ['promoted'],
  },
  {
    id: 'sw-market-noodles',
    channel: 'place:green',
    title: {
      zhCN: '集市的面条',
      en: 'Noodles at the market',
    },
    text: {
      zhCN: '林遥在集市闻到熟悉的香味，排队时忘了看手机。',
      en: 'A familiar smell stops Yao at the market; the phone stays in a pocket.',
    },
    weight: 3,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '买一碗热面',
          en: 'Buy a hot bowl',
        },
        effects: [
          {
            type: 'money',
            delta: -9,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 12,
          },
        ],
      },
      {
        id: 'second',
        label: {
          zhCN: '回家照着做',
          en: 'Try making it at home',
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
    once: true,
  },
  {
    id: 'sw-winter-light',
    season: 4,
    channel: 'place:home',
    title: {
      zhCN: '窗边的小灯',
      en: 'A light by the window',
    },
    text: {
      zhCN: '天黑得越来越早，林遥给窗边添了一盏小灯。',
      en: 'Darkness arrives earlier; Yao adds a little light by the window.',
    },
    weight: 3,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '邀朋友来喝茶',
          en: 'Invite a friend for tea',
        },
        effects: [
          {
            type: 'money',
            delta: -10,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 13,
          },
        ],
      },
      {
        id: 'second',
        label: {
          zhCN: '安静读一晚书',
          en: 'Read quietly for the evening',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 7,
          },
          {
            type: 'stat',
            key: 'english',
            delta: 4,
          },
        ],
      },
    ],
    once: true,
  },
  {
    id: 'sw-kol',
    channel: 'place:home',
    title: {
      zhCN: '材料清单的一格',
      en: 'A box on the checklist',
    },
    text: {
      zhCN: '林遥翻出 Life in the UK 书，里面夹着去年的车票。',
      en: 'Yao finds last year’s train ticket inside the Life in the UK book.',
    },
    weight: 3,
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
            delta: 8,
          },
        ],
        note: {
          zhCN: '只记录虚构情节中的事实，政策后果由引擎计算。',
          en: 'Records the fictional scenario’s facts; the engine calculates policy consequences.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '这季先复习',
          en: 'Revise this quarter',
        },
        effects: [
          {
            type: 'stat',
            key: 'english',
            delta: 5,
          },
        ],
      },
    ],
    once: true,
  },
  {
    id: 'sw-new-role',
    channel: 'letter',
    title: {
      zhCN: '开发岗位的新邀请',
      en: 'A development offer',
    },
    text: {
      zhCN: '新团队愿意把担保手续一起办好，林遥读了两遍邀请函。',
      en: 'A new team offers to arrange sponsorship; Yao reads the offer twice.',
    },
    weight: 3,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '付费更新许可，接受新开发岗',
          en: 'Pay to update permission for the development role',
        },
        effects: [
          {
            type: 'money',
            delta: -extensionCost,
          },
          {
            type: 'newEpisode',
            episode: {
              route: 'SKILLED_WORKER',
              role: 'MAIN',
              salary: 65000,
              socCode: '2134',
            },
            durationMonths: 36,
          },
          {
            type: 'income',
            taxYear: 'current',
            earnings: 65000,
          },
        ],
        note: {
          zhCN: '本情节假定新许可已获批并收取标准申请费及 IHS，不模拟审批。',
          en: 'The scenario assumes new permission has been granted and charges the standard application fee plus IHS, without simulating the decision.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '留在当前岗位',
          en: 'Stay in the current role',
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
    when: [
      {
        yearMin: 3,
      },
      {
        stat: 'money',
        min: extensionCost,
      },
    ],
  },
  {
    id: 'sw-salary-talk',
    channel: 'place:work',
    title: {
      zhCN: '工资面谈',
      en: 'Salary talks',
    },
    text: {
      zhCN: '林遥把做过的项目列成一页纸，经理认真看完了。',
      en: 'Yao lists completed projects on one page; the manager reads it carefully.',
    },
    weight: 3,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '接受年薪四万八的新安排',
          en: 'Accept a forty-eight-thousand salary',
        },
        effects: [
          {
            type: 'episode',
            patch: {
              salary: 48000,
            },
          },
          {
            type: 'stat',
            key: 'career',
            delta: 5,
          },
        ],
        note: {
          zhCN: '只记录虚构情节中的事实，政策后果由引擎计算。',
          en: 'Records the fictional scenario’s facts; the engine calculates policy consequences.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '先谈清工作范围',
          en: 'Clarify the responsibilities first',
        },
        effects: [
          {
            type: 'stat',
            key: 'career',
            delta: 7,
          },
        ],
      },
    ],
    once: true,
  },
  {
    id: 'sw-parent-care',
    channel: 'morning',
    title: {
      zhCN: '家里的病房',
      en: 'A hospital room back home',
    },
    text: {
      zhCN: '父母的病情反复，林遥和亲人回顾这次照顾怎么分工。',
      en: 'A parent’s health fluctuates; Yao and relatives look back on how they shared the care.',
    },
    weight: 3,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '回国照顾了四个月',
          en: 'Spent 120 days abroad caring for them',
        },
        effects: [
          {
            type: 'absence',
            startOffsetDays: -120,
            days: 120,
          },
          {
            type: 'money',
            delta: -800,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 10,
          },
        ],
        note: {
          zhCN: '只记录虚构情节中的事实，政策后果由引擎计算。',
          en: 'Records the fictional scenario’s facts; the engine calculates policy consequences.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '和亲人轮流，只住了一个月',
          en: 'Took turns with relatives and stayed thirty days',
        },
        effects: [
          {
            type: 'absence',
            startOffsetDays: -30,
            days: 30,
          },
          {
            type: 'money',
            delta: -500,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 4,
          },
        ],
        note: {
          zhCN: '只记录虚构情节中的事实，政策后果由引擎计算。',
          en: 'Records the fictional scenario’s facts; the engine calculates policy consequences.',
        },
      },
    ],
    once: true,
  },
  {
    id: 'sw-partner-work',
    channel: 'phone',
    title: {
      zhCN: '另一张工资单',
      en: 'Another payslip',
    },
    text: {
      zhCN: '伴侣开始工作，林遥发现冰箱上的预算表终于有了空白。',
      en: 'A partner starts work; the budget on Yao’s fridge finally has room to breathe.',
    },
    weight: 3,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '商量按全职安排安顿下来',
          en: 'Agree to settle into full-time work',
        },
        effects: [
          {
            type: 'income',
            taxYear: 'current',
            partnerEarnings: 24000,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 8,
          },
        ],
        note: {
          zhCN: '只记录虚构情节中的事实，政策后果由引擎计算。',
          en: 'Records the fictional scenario’s facts; the engine calculates policy consequences.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '先兼职，留时间照顾家里',
          en: 'Start part-time and leave time for home',
        },
        effects: [
          {
            type: 'income',
            taxYear: 'current',
            partnerEarnings: 12000,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 6,
          },
        ],
        note: {
          zhCN: '只记录虚构情节中的事实，政策后果由引擎计算。',
          en: 'Records the fictional scenario’s facts; the engine calculates policy consequences.',
        },
      },
    ],
    once: true,
    requires: ['partner-arrived'],
  },
  {
    id: 'sw-partner-space',
    channel: 'phone',
    title: {
      zhCN: '各自的空间',
      en: 'Room apart',
    },
    text: {
      zhCN: '两个人最近总为小事争执，林遥提出认真聊一次。',
      en: 'Small arguments keep recurring; Yao asks for a proper conversation.',
    },
    weight: 3,
    choices: [
      {
        id: 'first',
        sets: ['partner-separated'],
        label: {
          zhCN: '结束伴侣关系，分别生活',
          en: 'End the partnership and live apart',
        },
        effects: [
          {
            type: 'relationship',
            remove: 'PARTNER',
          },
          {
            type: 'stat',
            key: 'mood',
            delta: -8,
          },
        ],
        note: {
          zhCN: '只记录虚构情节中的事实，政策后果由引擎计算。',
          en: 'Records the fictional scenario’s facts; the engine calculates policy consequences.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '保留关系，给彼此时间',
          en: 'Keep the relationship and take time',
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
    requires: ['partner-arrived'],
  },
  {
    id: 'sw-reunion',
    channel: 'morning',
    title: {
      zhCN: '毕业多年以后',
      en: 'Years after graduation',
    },
    text: {
      zhCN: '同学的海外聚会散了，群里的合照刷了一整晚，林遥一张张往回翻。',
      en: 'The overseas reunion is over; photos fill the group chat all night, and Yao scrolls back through them.',
    },
    weight: 3,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '飞过去聚了两周',
          en: 'Flew out and spent fourteen days at the reunion',
        },
        effects: [
          {
            type: 'absence',
            startOffsetDays: -14,
            days: 14,
          },
          {
            type: 'money',
            delta: -400,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 12,
          },
        ],
        note: {
          zhCN: '只记录虚构情节中的事实，政策后果由引擎计算。',
          en: 'Records the fictional scenario’s facts; the engine calculates policy consequences.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '留在英国视频参加了',
          en: 'Joined by video from the UK',
        },
        effects: [
          {
            type: 'stat',
            key: 'mood',
            delta: 6,
          },
        ],
      },
    ],
    once: true,
  },
  {
    id: 'sw-income-audit',
    channel: 'place:home',
    title: {
      zhCN: '桌上的年结单',
      en: 'The annual statement',
    },
    text: {
      zhCN: '新项目邀请压在年结单上，林遥边看边算还有几个周末。',
      en: 'A project offer rests on the annual statement; Yao counts the free weekends.',
    },
    weight: 3,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '接受新项目邀请',
          en: 'Accept the new project',
        },
        effects: [
          {
            type: 'income',
            taxYear: 'current',
            earnings: 57000,
          },
        ],
        note: {
          zhCN: '本情节写入全年税前收入 £57,000，政策后果由引擎计算。',
          en: 'This scenario records £57,000 in annual gross earnings; the engine calculates policy consequences.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '保留现在的工时',
          en: 'Keep the current hours',
        },
        effects: [
          {
            type: 'income',
            taxYear: 'current',
            earnings: 53000,
          },
        ],
        note: {
          zhCN: '本情节写入全年税前收入 £53,000，政策后果由引擎计算。',
          en: 'This scenario records £53,000 in annual gross earnings; the engine calculates policy consequences.',
        },
      },
    ],
    once: true,
  },
  {
    id: 'sw-arrears',
    channel: 'letter',
    title: {
      zhCN: '忘记的一封信',
      en: 'A forgotten letter',
    },
    text: {
      zhCN: '政府欠款通知夹在广告里，林遥清理桌子时才看见。',
      en: 'A government-debt notice hides among adverts until Yao clears the desk.',
    },
    weight: 3,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '本情节中付清欠款',
          en: 'In this scenario, clear the debt',
        },
        effects: [
          {
            type: 'money',
            delta: -200,
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
          zhCN: '只记录虚构情节中的事实，政策后果由引擎计算。',
          en: 'Records the fictional scenario’s facts; the engine calculates policy consequences.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '本情节中仍欠款',
          en: 'In this scenario, leave a balance',
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
          zhCN: '只记录虚构情节中的事实，政策后果由引擎计算。',
          en: 'Records the fictional scenario’s facts; the engine calculates policy consequences.',
        },
      },
    ],
    once: true,
  },
  {
    id: 'sw-week-away',
    channel: 'phone',
    title: {
      zhCN: '海边的朋友',
      en: 'A friend by the sea',
    },
    text: {
      zhCN: '海边回来一周了，林遥的鞋缝里还有沙，朋友又发来一张合照。',
      en: 'A week after the seaside there is still sand in Yao’s shoes, and the friend sends another photo.',
    },
    weight: 3,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '去海外的海边住了一周',
          en: 'Spent seven days by the sea abroad',
        },
        effects: [
          {
            type: 'absence',
            startOffsetDays: -7,
            days: 7,
          },
          {
            type: 'money',
            delta: -250,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 10,
          },
        ],
        note: {
          zhCN: '只记录虚构情节中的事实，政策后果由引擎计算。',
          en: 'Records the fictional scenario’s facts; the engine calculates policy consequences.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '最后改在英国海边见面',
          en: 'Met at the British seaside instead',
        },
        effects: [
          {
            type: 'money',
            delta: -80,
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
  },
  {
    id: 'sw-catch-up-pay',
    channel: 'place:work',
    title: {
      zhCN: '补上的那一笔',
      en: 'The missing payment',
    },
    text: {
      zhCN: '旧项目款结清，新一轮邀约又来了，林遥看了看日历。',
      en: 'The old project is paid; a new offer arrives, and Yao checks the calendar.',
    },
    weight: 3,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '再接一轮，留钱给假期',
          en: 'Take another round and save for a holiday',
        },
        effects: [
          {
            type: 'income',
            taxYear: 'current',
            earnings: 62000,
          },
          {
            type: 'money',
            delta: 350,
          },
        ],
        note: {
          zhCN: '本情节写入全年税前收入 £62,000，政策后果由引擎计算。',
          en: 'This scenario records £62,000 in annual gross earnings; the engine calculates policy consequences.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '这次先停一停',
          en: 'Take a break this time',
        },
        effects: [
          {
            type: 'income',
            taxYear: 'current',
            earnings: 58000,
          },
          {
            type: 'money',
            delta: 200,
          },
        ],
        note: {
          zhCN: '本情节写入全年税前收入 £58,000，政策后果由引擎计算。',
          en: 'This scenario records £58,000 in annual gross earnings; the engine calculates policy consequences.',
        },
      },
    ],
    once: true,
  },
  {
    id: 'sw-remote-care',
    channel: 'place:home',
    title: {
      zhCN: '家里的备用房间',
      en: 'The spare room at home',
    },
    text: {
      zhCN: '家里的备用房间一直留着，林遥回想这次住了多久。',
      en: 'The family keeps the spare room ready; Yao recalls the length of this visit.',
    },
    weight: 3,
    choices: [
      {
        id: 'first',
        label: {
          zhCN: '回家小住了两个月',
          en: 'Stayed at the family home for sixty days',
        },
        effects: [
          {
            type: 'absence',
            startOffsetDays: -60,
            days: 60,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 12,
          },
        ],
        note: {
          zhCN: '只记录虚构情节中的事实，政策后果由引擎计算。',
          en: 'Records the fictional scenario’s facts; the engine calculates policy consequences.',
        },
      },
      {
        id: 'second',
        label: {
          zhCN: '实际只停留两周',
          en: 'The stay lasted only fourteen days',
        },
        effects: [
          {
            type: 'absence',
            startOffsetDays: -14,
            days: 14,
          },
          {
            type: 'stat',
            key: 'mood',
            delta: 6,
          },
        ],
        note: {
          zhCN: '只记录虚构情节中的事实，政策后果由引擎计算。',
          en: 'Records the fictional scenario’s facts; the engine calculates policy consequences.',
        },
      },
    ],
    once: true,
  },
];

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
  sprite: 'characters/3.png',
  stats: { money: 9000, mood: 65, health: 75, english: 45, career: 10 },
  events: [...events, ...skilledWorkerAdditions],
};
