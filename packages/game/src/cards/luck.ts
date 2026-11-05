import type { LuckCard } from '../types';

export const publicLuck: LuckCard[] = [
  {
    id: 'luck-family-visit',
    kind: 'luck',
    title: { zhCN: '家里需要你', en: 'Family needs you' },
    text: {
      zhCN: '父母病重，你从今天起回国照顾家人，共离境 120 天。',
      en: 'A parent is seriously ill. You leave today to care for family abroad for 120 days.',
    },
    choices: [
      {
        id: 'noted',
        label: { zhCN: '知道了', en: 'Noted' },
        effects: [{ type: 'absence', startOffsetDays: 0, days: 120 }],
        note: {
          zhCN: '离境按评估日已经发生的部分计入连续居留计算。',
          en: 'Only the part of the absence elapsed by the assessment date enters the continuous-residence calculation.',
        },
      },
    ],
  },
  {
    id: 'luck-project-bonus',
    kind: 'luck',
    title: { zhCN: '项目奖金到账', en: 'A project bonus arrives' },
    text: {
      zhCN: '项目奖金和其他工作收入使你本 tax year 的税前总收入记录更新为 £60,000；担保岗位的年薪不变。',
      en: 'A project bonus and other work bring your recorded gross earnings for the current tax year to £60,000; your sponsored salary stays the same.',
    },
    choices: [
      {
        id: 'noted',
        label: { zhCN: '知道了', en: 'Noted' },
        effects: [{ type: 'income', taxYear: 'current', earnings: 60000 }],
        note: {
          zhCN: '收入规则读取完整 tax year 的收入，当前年度要在之后的评估中才进入回看窗口。',
          en: 'Earnings rules read completed tax years, so the current year enters the lookback window in a later assessment.',
        },
      },
    ],
  },
  {
    id: 'luck-rent-rise',
    kind: 'luck',
    title: { zhCN: '房租又涨了', en: 'The rent goes up' },
    text: {
      zhCN: '房东通知涨租，你重新算了算每月预算。',
      en: 'Your landlord announces a rent increase. Time to revisit the monthly budget.',
    },
    choices: [
      {
        id: 'noted',
        label: { zhCN: '知道了', en: 'Noted' },
        effects: [{ type: 'none' }],
        note: {
          zhCN: '这条时间线没有租金字段，本卡只记录生活事件。',
          en: 'This timeline has no rent field; this card records a life event only.',
        },
      },
    ],
  },
  {
    id: 'luck-hospital-stay',
    kind: 'luck',
    title: { zhCN: '慢慢恢复', en: 'Taking time to recover' },
    text: {
      zhCN: '你在英国住院六周，朋友帮忙照看住处。',
      en: 'You spend six weeks in hospital in the UK. Friends help look after your home.',
    },
    choices: [
      {
        id: 'noted',
        label: { zhCN: '知道了', en: 'Noted' },
        effects: [{ type: 'none' }],
        note: {
          zhCN: '在英国生病不算离境，本卡不添加 absence。',
          en: 'Being ill in the UK is not an absence abroad; this card adds no absence.',
        },
      },
    ],
  },
  {
    id: 'luck-tax-refund',
    kind: 'luck',
    title: { zhCN: '意外的退税', en: 'An unexpected tax refund' },
    text: {
      zhCN: '税务核对后收到一笔退税，预算宽松了一点。',
      en: 'A tax reconciliation brings a refund and a little room in your budget.',
    },
    choices: [
      {
        id: 'noted',
        label: { zhCN: '知道了', en: 'Noted' },
        effects: [{ type: 'none' }],
        note: {
          zhCN: '本卡不把退税改写为税前工作收入，也不改储蓄记录。',
          en: 'This card does not treat a tax refund as gross work earnings or change recorded savings.',
        },
      },
    ],
  },
  {
    id: 'luck-english-course',
    kind: 'luck',
    title: { zhCN: '课程结业', en: 'Course completed' },
    text: {
      zhCN: '你完成英语课程并取得 B2 英语证明。',
      en: 'You complete an English course and obtain B2 English evidence.',
    },
    choices: [
      {
        id: 'noted',
        label: { zhCN: '知道了', en: 'Noted' },
        effects: [{ type: 'english', cefrLevel: 'B2' }],
        note: {
          zhCN: '英语规则读取证明等级，再与该栏要求比较。',
          en: 'The English rule reads the evidence level and compares it with that column’s requirement.',
        },
      },
    ],
  },
  {
    id: 'luck-passport-delay',
    kind: 'luck',
    title: { zhCN: '护照还在路上', en: 'Passport delayed' },
    text: {
      zhCN: '护照续签延误，你取消了一趟尚未出发的旅行；现有移民许可不变。',
      en: 'A passport renewal is delayed. You cancel a trip before departure; your existing immigration permission is unchanged.',
    },
    choices: [
      {
        id: 'noted',
        label: { zhCN: '知道了', en: 'Noted' },
        effects: [{ type: 'none' }],
        note: {
          zhCN: '取消但未成行的旅行不添加离境，护照办理进度未建模。',
          en: 'A cancelled trip adds no absence; passport processing is not modelled.',
        },
      },
    ],
  },
  {
    id: 'luck-parking-penalty',
    kind: 'luck',
    title: { zhCN: '一张停车罚单', en: 'A parking penalty' },
    text: {
      zhCN: '你收到并缴清一张民事停车罚款，没有刑事定罪。',
      en: 'You receive and pay a civil parking penalty, with no criminal conviction.',
    },
    choices: [
      {
        id: 'noted',
        label: { zhCN: '知道了', en: 'Noted' },
        effects: [{ type: 'none' }],
        note: {
          zhCN: '本情节的民事罚款不是犯罪记录，引擎未建模这类罚款。',
          en: 'The civil penalty in this scenario is not a criminal record; the engine does not model these penalties.',
        },
      },
    ],
  },
];
