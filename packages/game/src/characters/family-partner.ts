import {
  currentLaw2026_11,
  earnedSettlement2026_11,
} from '@uk-immigration/policy-data';
import { balance } from '../balance';
import type { Character, GameEvent, Text } from '../types';

const t = (zhCN: string, en: string): Text => ({ zhCN, en });
const law = currentLaw2026_11.values;
const financialNote = t(
  `SRC-024 E-LTRP.3.1、E-ILRP.1.3(1A)：一般收入门槛 £${law.familyPartnerMinimumIncome.value.toLocaleString('en-GB')}，定居储蓄为基数 £${law.familyPartnerSavingsBase.value.toLocaleString('en-GB')} 加收入缺口，结果由引擎计算。`,
  `SRC-024 E-LTRP.3.1 and E-ILRP.1.3(1A): general income requirement £${law.familyPartnerMinimumIncome.value.toLocaleString('en-GB')}; settlement savings are the £${law.familyPartnerSavingsBase.value.toLocaleString('en-GB')} base plus the income shortfall; the engine assesses the result.`,
);

// Fictional household facts and life events, adapted from the family fixtures.
const events: GameEvent[] = [
  {
    id: 'family-hours',
    title: t('多出来的班表', 'An extra shift pattern'),
    text: t(
      '经理递来全职班表，索菲娅数了数还能一起吃晚饭的日子。',
      'The manager offers full-time hours. Sofia counts the evenings still free for dinner together.',
    ),
    weight: 3,
    once: true,
    choices: [
      {
        id: 'try',
        label: t(
          '试行增班，年薪暂按一万八记录',
          'Trial extra hours at an annualised eighteen thousand',
        ),
        effects: [
          { type: 'episode', patch: { salary: 18000 } },
          { type: 'income', taxYear: 'current', earnings: 18000 },
          { type: 'stat', key: 'career', delta: 3 },
        ],
        sets: ['family-hours-trial'],
        note: financialNote,
      },
      {
        id: 'stay',
        label: t(
          '继续兼职，留下下午',
          'Keep the afternoons and the part-time hours',
        ),
        effects: [{ type: 'stat', key: 'mood', delta: 5 }],
      },
    ],
  },
  {
    id: 'family-hours-trial',
    title: t('试过之后', 'After the trial'),
    text: t(
      '连着几周全职，冰箱有了整排饭盒，杰米学会了找锅盖。',
      'After several full-time weeks, lunch boxes line the fridge and Jamie can find the saucepan lids.',
    ),
    weight: 4,
    once: true,
    requires: ['family-hours-trial'],
    choices: [
      {
        id: 'full-time',
        label: t(
          '接下年薪两万四的岗位',
          'Take the role at twenty-four thousand a year',
        ),
        effects: [
          { type: 'episode', patch: { salary: 24000 } },
          { type: 'income', taxYear: 'current', earnings: 24000 },
          { type: 'stat', key: 'mood', delta: -4 },
        ],
        sets: ['family-full-time'],
        note: financialNote,
      },
      {
        id: 'part-time',
        label: t('回到兼职的节奏', 'Return to the part-time rhythm'),
        effects: [
          { type: 'episode', patch: { salary: 12000 } },
          { type: 'income', taxYear: 'current', earnings: 12000 },
          { type: 'stat', key: 'health', delta: 4 },
          { type: 'stat', key: 'mood', delta: 4 },
        ],
      },
    ],
  },
  {
    id: 'family-first-full-payslip',
    title: t('第一张完整工资单', 'The first full payslip'),
    text: t(
      '工资单比以前长了半页，索菲娅把它放进不再夹食谱的文件夹。',
      'The payslip is half a page longer. Sofia files it in the folder that no longer holds recipes.',
    ),
    weight: 4,
    once: true,
    requires: ['family-full-time'],
    choices: [
      {
        id: 'save',
        label: t(
          '接下额外职责，年薪改为两万六',
          'Take the added duties at twenty-six thousand a year',
        ),
        effects: [
          { type: 'episode', patch: { salary: 26000 } },
          { type: 'income', taxYear: 'current', earnings: 26000 },
          { type: 'stat', key: 'career', delta: 3 },
        ],
        note: financialNote,
      },
      {
        id: 'dinner',
        label: t('请杰米吃顿饭', 'Take Jamie out for dinner'),
        effects: [
          { type: 'money', delta: -65 },
          { type: 'stat', key: 'mood', delta: 7 },
        ],
      },
    ],
  },
  {
    id: 'family-savings-jar',
    title: t('罐子上的标签', 'The label on the jar'),
    text: t(
      '杰米把饼干罐标成存钱罐，里面暂时只有两张超市小票。',
      'Jamie labels a biscuit tin as a savings jar. So far it contains two supermarket receipts.',
    ),
    weight: 3,
    once: true,
    when: [{ stat: 'money', min: 8000 }],
    choices: [
      {
        id: 'plan',
        label: t(
          '从现有余额中申报八千现金储蓄',
          'Declare eight thousand of the existing balance as cash savings',
        ),
        effects: [
          { type: 'timeline', patch: { cashSavings: 8000 } },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
        sets: ['family-save-plan'],
        note: financialNote,
      },
      {
        id: 'later',
        label: t('先把本月账单付完', 'Finish this month’s bills first'),
        effects: [{ type: 'stat', key: 'mood', delta: 2 }],
      },
    ],
  },
  {
    id: 'family-savings-statement',
    title: t('攒下来的余额', 'The balance built up'),
    text: t(
      '储蓄记录终于装满一页，索菲娅拿出荧光笔，却先画了个笑脸。',
      'The savings record finally fills a page. Sofia takes out a highlighter and draws a smile first.',
    ),
    weight: 4,
    once: true,
    requires: ['family-save-plan'],
    when: [{ stat: 'money', min: 25000 }],
    choices: [
      {
        id: 'declare',
        label: t(
          '整理并申报两万五现金储蓄',
          'Document and declare twenty-five thousand in cash savings',
        ),
        effects: [{ type: 'timeline', patch: { cashSavings: 25000 } }],
        note: financialNote,
      },
      {
        id: 'wait',
        label: t(
          '先不在材料里使用储蓄',
          'Leave savings out of the papers for now',
        ),
        effects: [
          { type: 'timeline', patch: { cashSavings: 0 } },
          { type: 'stat', key: 'mood', delta: 2 },
        ],
        note: financialNote,
      },
    ],
  },
  {
    id: 'family-car-or-savings',
    title: t('展厅玻璃上的雨', 'Rain on the showroom glass'),
    text: t(
      '旧车价签贴得歪歪扭扭，杰米说它至少有四个轮子和暖气。',
      'The used car’s price card hangs crooked. Jamie points out that it has four wheels and heating.',
    ),
    weight: 3,
    once: true,
    requires: ['family-save-plan'],
    when: [{ stat: 'money', min: 25000 }],
    choices: [
      {
        id: 'car',
        label: t(
          '花六千买车，申报余下储蓄',
          'Spend six thousand on the car and declare the savings left',
        ),
        effects: [
          { type: 'money', delta: -6000 },
          { type: 'timeline', patch: { cashSavings: 19000 } },
          { type: 'stat', key: 'mood', delta: 6 },
        ],
        note: financialNote,
      },
      {
        id: 'save',
        label: t(
          '继续坐公交，申报两万五储蓄',
          'Keep taking the bus and declare twenty-five thousand',
        ),
        effects: [
          { type: 'timeline', patch: { cashSavings: 25000 } },
          { type: 'stat', key: 'mood', delta: -2 },
        ],
        note: financialNote,
      },
    ],
  },
  {
    id: 'family-savings-short',
    title: t('还差一截的进度', 'A little further to go'),
    text: t(
      '存钱罐很沉，银行记录却提醒索菲娅，硬币的声音不等于余额。',
      'The savings jar feels heavy, but the bank record reminds Sofia that rattling coins are not a balance.',
    ),
    weight: 3,
    once: true,
    requires: ['family-save-plan'],
    when: [{ stat: 'money', min: 24000, max: 24999 }],
    choices: [
      {
        id: 'declare',
        label: t(
          '如实记录两万四储蓄',
          'Record twenty-four thousand in savings',
        ),
        effects: [{ type: 'timeline', patch: { cashSavings: 24000 } }],
        note: financialNote,
      },
      {
        id: 'none',
        label: t(
          '这次不依靠储蓄材料',
          'Do not rely on savings evidence this time',
        ),
        effects: [
          { type: 'timeline', patch: { cashSavings: 0 } },
          { type: 'stat', key: 'mood', delta: 2 },
        ],
        note: financialNote,
      },
    ],
  },
  {
    id: 'family-jamie-rumour',
    title: t('会议后的沉默', 'Silence after the meeting'),
    text: t(
      '杰米下班后没开收音机，公司让大家等周五的消息。',
      'Jamie leaves the radio off after work. The company has told everyone to wait for Friday’s news.',
    ),
    weight: 3,
    once: true,
    when: [{ yearMin: 2 }],
    choices: [
      {
        id: 'budget',
        label: t(
          '记录杰米缩减工时，年薪降至一万六',
          'Record Jamie’s reduced hours at sixteen thousand a year',
        ),
        effects: [
          { type: 'income', taxYear: 'current', partnerEarnings: 16000 },
          { type: 'stat', key: 'mood', delta: -3 },
        ],
        sets: ['family-job-worry'],
        note: financialNote,
      },
      {
        id: 'talk',
        label: t('陪他散步，晚点再谈', 'Walk with him and talk later'),
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
        sets: ['family-job-worry'],
      },
    ],
  },
  {
    id: 'family-jamie-lost-job',
    title: t('纸箱里的马克杯', 'A mug in a cardboard box'),
    text: t(
      '杰米把办公室的杯子带回家，纸箱比想象中轻。',
      'Jamie brings the office mug home. The cardboard box is lighter than expected.',
    ),
    weight: 4,
    once: true,
    requires: ['family-job-worry'],
    choices: [
      {
        id: 'record',
        label: t(
          '记录失业，重新安排家用',
          'Record the job loss and redraw the household budget',
        ),
        effects: [
          { type: 'income', taxYear: 'current', partnerEarnings: 0 },
          { type: 'stat', key: 'mood', delta: -7 },
        ],
        sets: ['family-jamie-unemployed'],
        note: financialNote,
      },
      {
        id: 'help',
        label: t(
          '记录失业，陪他找招聘信息',
          'Record the job loss and search listings with him',
        ),
        effects: [
          { type: 'income', taxYear: 'current', partnerEarnings: 0 },
          { type: 'stat', key: 'health', delta: -3 },
          { type: 'stat', key: 'mood', delta: -4 },
        ],
        sets: ['family-jamie-unemployed'],
        note: financialNote,
      },
    ],
  },
  {
    id: 'family-jamie-interview',
    title: t('面试前的领带', 'A tie before the interview'),
    text: t(
      '杰米找到零工，也等到正式面试，久没戴的领带终于有了用场。',
      'Jamie finds casual work and gets a permanent-job interview. The long-unused tie finally has a purpose.',
    ),
    weight: 4,
    once: true,
    requires: ['family-jamie-unemployed'],
    choices: [
      {
        id: 'rehearse',
        label: t(
          '记录零工年收入六千，再陪他练问答',
          'Record six thousand a year from casual work and rehearse together',
        ),
        effects: [
          { type: 'income', taxYear: 'current', partnerEarnings: 6000 },
          { type: 'stat', key: 'english', delta: 2 },
        ],
        sets: ['family-jamie-interviewed'],
        note: financialNote,
      },
      {
        id: 'tea',
        label: t(
          '记录零工收入，泡茶让他准备',
          'Record the casual earnings and make tea while he prepares',
        ),
        effects: [
          { type: 'income', taxYear: 'current', partnerEarnings: 6000 },
          { type: 'stat', key: 'mood', delta: 4 },
        ],
        sets: ['family-jamie-interviewed'],
        note: financialNote,
      },
    ],
  },
  {
    id: 'family-jamie-new-job',
    title: t('新的午餐盒', 'A new lunch box'),
    text: t(
      '录用邮件到了，杰米先去洗了那个闲了几周的饭盒。',
      'The offer arrives. Jamie’s first move is to wash the lunch box that has sat idle for weeks.',
    ),
    weight: 4,
    once: true,
    requires: ['family-jamie-interviewed'],
    choices: [
      {
        id: 'accept',
        label: t(
          '记录杰米年薪两万的新工作',
          'Record Jamie’s new job at twenty thousand a year',
        ),
        effects: [
          { type: 'income', taxYear: 'current', partnerEarnings: 20000 },
          { type: 'stat', key: 'mood', delta: 6 },
        ],
        note: financialNote,
      },
      {
        id: 'part-time',
        label: t(
          '他先接受年薪一万的兼职',
          'He starts with part-time work at ten thousand a year',
        ),
        effects: [
          { type: 'income', taxYear: 'current', partnerEarnings: 10000 },
          { type: 'stat', key: 'mood', delta: 4 },
        ],
        note: financialNote,
      },
    ],
  },
  {
    id: 'family-jamie-health',
    title: t('楼梯中间的停顿', 'A pause on the stairs'),
    text: t(
      '杰米的旧病反复，去楼上取件外套也要歇一会儿。',
      'Jamie’s longstanding condition flares up. Fetching a coat upstairs now needs a pause.',
    ),
    weight: 3,
    once: true,
    when: [{ yearMin: 2 }],
    choices: [
      {
        id: 'advice',
        label: t(
          '杰米减少工作，记录年收入八千',
          'Record Jamie reducing work to eight thousand a year',
        ),
        effects: [
          { type: 'income', taxYear: 'current', partnerEarnings: 8000 },
          { type: 'stat', key: 'health', delta: -3 },
        ],
        sets: ['family-pip-advice'],
        note: financialNote,
      },
      {
        id: 'gp',
        label: t('先陪他去看 GP', 'Go with him to the GP first'),
        effects: [{ type: 'stat', key: 'mood', delta: -2 }],
        sets: ['family-pip-advice'],
      },
    ],
  },
  {
    id: 'family-pip-form',
    title: t('表格与冷掉的茶', 'Forms and cold tea'),
    text: t(
      'PIP 表格摊满餐桌，杰米写完一页，茶就凉了一次。',
      'The PIP forms cover the table. Jamie’s tea goes cold once per page.',
    ),
    weight: 4,
    once: true,
    requires: ['family-pip-advice'],
    choices: [
      {
        id: 'apply',
        label: t(
          '杰米暂别工作，提交本人 PIP 申请',
          'Jamie stops work for now and submits his own PIP application',
        ),
        effects: [
          { type: 'income', taxYear: 'current', partnerEarnings: 0 },
          { type: 'stat', key: 'mood', delta: -3 },
        ],
        sets: ['family-pip-applied'],
        note: t(
          'SRC-024 E-LTRP.3.3(a)：这里申请的是英国伴侣杰米的 PIP，尚不记录获批。',
          'SRC-024 E-LTRP.3.3(a): this is British partner Jamie’s PIP application; no award is recorded yet.',
        ),
      },
      {
        id: 'wait',
        label: t('先把补充材料整理好', 'Sort the supporting papers first'),
        effects: [{ type: 'stat', key: 'mood', delta: 2 }],
      },
    ],
  },
  {
    id: 'family-pip-decision',
    title: t('杰米的决定信', 'Jamie’s decision letter'),
    text: t(
      '决定信到了，索菲娅先清出餐桌的一角，给杰米慢慢看。',
      'The decision letter arrives. Sofia clears a corner of the table so Jamie can read it slowly.',
    ),
    weight: 4,
    once: true,
    requires: ['family-pip-applied'],
    choices: [
      {
        id: 'awarded',
        label: t(
          '本情节中杰米获批并领取 PIP',
          'In this scenario, Jamie is awarded and receives PIP',
        ),
        effects: [
          { type: 'timeline', patch: { partnerSpecifiedBenefit: true } },
          { type: 'stat', key: 'mood', delta: 4 },
        ],
        sets: ['family-pip-awarded'],
        note: t(
          'SRC-024 E-LTRP.3.3：记录伴侣领取指定福利；adequate maintenance 仍为 PD-075，不代表财务自动通过。',
          'SRC-024 E-LTRP.3.3: the partner receives a specified benefit; adequate maintenance remains PD-075, so finances do not automatically pass.',
        ),
      },
      {
        id: 'declined',
        label: t(
          '本情节中申请未获批',
          'In this scenario, the application is declined',
        ),
        effects: [
          { type: 'timeline', patch: { partnerSpecifiedBenefit: false } },
          { type: 'stat', key: 'mood', delta: -4 },
        ],
        note: t(
          '只记录杰米未领取指定福利，不向索菲娅的 benefits 写入记录。',
          'Records that Jamie receives no specified benefit; no entry is added to Sofia’s benefits.',
        ),
      },
    ],
  },
  {
    id: 'family-pip-review',
    title: t('复核的日历格', 'A date for review'),
    text: t(
      'PIP 复核的提醒夹在日历里，杰米把复诊和买面包写在同一页。',
      'The PIP review reminder sits in the calendar beside Jamie’s clinic visit and the bread shopping.',
    ),
    weight: 3,
    once: true,
    requires: ['family-pip-awarded'],
    when: [{ yearMin: 4 }],
    choices: [
      {
        id: 'continues',
        label: t('本情节中继续领取', 'In this scenario, the award continues'),
        effects: [
          { type: 'timeline', patch: { partnerSpecifiedBenefit: true } },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
        note: t(
          'SRC-024 E-LTRP.3.3：仅更新伴侣领取状态，充分供养与住宿仍需另行核实。',
          'SRC-024 E-LTRP.3.3: updates the partner’s receipt only; adequate maintenance and accommodation still need checking.',
        ),
      },
      {
        id: 'ends',
        label: t('本情节中领取已经结束', 'In this scenario, receipt has ended'),
        effects: [
          { type: 'timeline', patch: { partnerSpecifiedBenefit: false } },
          { type: 'stat', key: 'mood', delta: -3 },
        ],
        note: financialNote,
      },
    ],
  },
  {
    id: 'family-b2-letter',
    title: t('书页里的便签', 'A note between the pages'),
    text: t(
      '索菲娅把英语要求的更新夹进课本，杰米在旁边画了一只鼓劲的猫。',
      'Sofia slips the updated English requirement into her textbook. Jamie draws an encouraging cat beside it.',
    ),
    weight: 3,
    once: true,
    choices: [
      {
        id: 'study',
        label: t(
          '减少工时备考，年薪改为一万',
          'Reduce work to ten thousand a year to prepare for the test',
        ),
        effects: [
          { type: 'episode', patch: { salary: 10000 } },
          { type: 'income', taxYear: 'current', earnings: 10000 },
          { type: 'stat', key: 'english', delta: 2 },
        ],
        sets: ['family-b2-plan'],
        note: t(
          `SRC-025 KoLL 2.2(ba)：伴侣定居自 ${law.familyPartnerSettlementEnglish.value.applicationsFrom} 起要求 ${law.familyPartnerSettlementEnglish.value.cefrLevel}，豁免另计。`,
          `SRC-025 KoLL 2.2(ba): partner settlement requires ${law.familyPartnerSettlementEnglish.value.cefrLevel} from ${law.familyPartnerSettlementEnglish.value.applicationsFrom}, subject to exemptions.`,
        ),
      },
      {
        id: 'read',
        label: t(
          '先在市政厅看自己的评估',
          'Read the personal assessment at town hall first',
        ),
        effects: [{ type: 'stat', key: 'mood', delta: 2 }],
      },
    ],
  },
  {
    id: 'family-b2-study',
    title: t('餐桌上的口试', 'A speaking test at the dinner table'),
    text: t(
      '杰米拿菜谱模拟口试，索菲娅讲了三分钟为什么不能再吃焗豆。',
      'Jamie uses a cookbook for a mock speaking test. Sofia spends three minutes arguing against more baked beans.',
    ),
    weight: 4,
    once: true,
    requires: ['family-b2-plan'],
    choices: [
      {
        id: 'practise',
        label: t('练完再吃晚饭', 'Finish practising before dinner'),
        effects: [
          { type: 'stat', key: 'english', delta: 3 },
          { type: 'stat', key: 'mood', delta: 2 },
        ],
        sets: ['family-b2-practised'],
      },
      {
        id: 'class',
        label: t(
          '记下卡住的词，下次问老师',
          'Note the difficult words for the teacher',
        ),
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
        sets: ['family-b2-practised'],
      },
    ],
  },
  {
    id: 'family-b2-result',
    title: t('成绩邮件的提示音', 'The results email chimes'),
    text: t(
      '练过的题目终于派上用场，索菲娅在公交车上反复打开成绩邮件。',
      'The practice finally pays off. Sofia keeps reopening the results email on the bus.',
    ),
    weight: 4,
    once: true,
    requires: ['family-b2-practised'],
    when: [{ stat: 'english', min: balance.englishB2 }],
    choices: [
      {
        id: 'file',
        label: t('收好通过的 B2 证明', 'File the passed B2 evidence'),
        effects: [
          { type: 'english', cefrLevel: 'B2' },
          { type: 'stat', key: 'mood', delta: 4 },
        ],
        note: t(
          'SRC-025 KoLL 2.2(ba)：本情节记录通过的 B2 英语证明。',
          'SRC-025 KoLL 2.2(ba): this scenario records passed B2 English evidence.',
        ),
      },
      {
        id: 'copy',
        label: t('存好证明，再给杰米看', 'Save the evidence and show Jamie'),
        effects: [
          { type: 'english', cefrLevel: 'B2' },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
        note: t(
          'SRC-025 KoLL 2.2(ba)：本情节记录通过的 B2 英语证明。',
          'SRC-025 KoLL 2.2(ba): this scenario records passed B2 English evidence.',
        ),
      },
    ],
  },
  {
    id: 'family-kol-book',
    title: t('第二本床头书', 'A second bedside book'),
    text: t(
      'Life in the UK 书占了床头柜，杰米的侦探小说被挤到了地板上。',
      'The Life in the UK book takes over the bedside table. Jamie’s detective novel ends up on the floor.',
    ),
    weight: 3,
    once: true,
    choices: [
      {
        id: 'start',
        label: t('从第一章开始读', 'Start with the first chapter'),
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
        sets: ['family-kol-reading'],
      },
      {
        id: 'weekend',
        label: t('留到周末一起读', 'Read together at the weekend'),
        effects: [{ type: 'stat', key: 'mood', delta: 2 }],
        sets: ['family-kol-reading'],
      },
    ],
  },
  {
    id: 'family-kol-quiz',
    title: t('杰米答错的题', 'The question Jamie gets wrong'),
    text: t(
      '索菲娅提问，杰米连错三题，终于不再说这本书应该很简单。',
      'Sofia asks the questions. After three wrong answers Jamie stops saying the book should be easy.',
    ),
    weight: 4,
    once: true,
    requires: ['family-kol-reading'],
    choices: [
      {
        id: 'revise',
        label: t('把错题做成小卡片', 'Turn the mistakes into revision cards'),
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
        sets: ['family-kol-ready'],
      },
      {
        id: 'group',
        label: t('去图书馆复习小组', 'Join the library revision group'),
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
        sets: ['family-kol-ready'],
      },
    ],
  },
  {
    id: 'family-kol-result',
    title: t('书签可以退休了', 'The bookmark can retire'),
    text: t(
      '考试结束，索菲娅走出门时发现，那张旧购物小票书签已经揉软了。',
      'Leaving the test, Sofia finds the old shopping-receipt bookmark has worn soft.',
    ),
    weight: 4,
    once: true,
    requires: ['family-kol-ready'],
    choices: [
      {
        id: 'passed',
        label: t(
          '本情节中通过，收好结果',
          'In this scenario, pass and file the result',
        ),
        effects: [
          { type: 'lifeInTheUk' },
          { type: 'stat', key: 'mood', delta: 5 },
        ],
        note: t(
          'SRC-025 KoLL 2.3：记录 Life in the UK 通过，不代替其他定居条件。',
          'SRC-025 KoLL 2.3: records a Life in the UK pass; other settlement conditions still apply.',
        ),
      },
      {
        id: 'retry',
        label: t(
          '这次没过，再练一轮',
          'Miss the pass this time and practise again',
        ),
        effects: [
          { type: 'stat', key: 'english', delta: 2 },
          { type: 'stat', key: 'mood', delta: -3 },
        ],
      },
    ],
  },
  {
    id: 'family-parents-call',
    title: t('电话里的背景声', 'Sounds behind the call'),
    text: t(
      '母亲说家里一切都好，索菲娅却听见父亲咳嗽的声音。',
      'Her mother says everything is fine at home, but Sofia hears her father coughing in the background.',
    ),
    weight: 3,
    once: true,
    when: [{ yearMin: 2 }],
    choices: [
      {
        id: 'arrange',
        label: t(
          '记下刚结束的两周海外探亲，再商量安排',
          'Record the completed two-week family visit abroad, then plan care',
        ),
        effects: [
          { type: 'absence', startOffsetDays: -14, days: 14 },
          { type: 'money', delta: -350 },
          { type: 'stat', key: 'mood', delta: -3 },
        ],
        sets: ['family-care-planned'],
        note: t(
          'SRC-008 CR 3.1：回顾已经结束的两周离境，后续照顾另记。',
          'SRC-008 CR 3.1: records a completed two-week absence; any later care visit is separate.',
        ),
      },
      {
        id: 'check',
        label: t('再打一次电话问清楚', 'Call again and ask properly'),
        effects: [{ type: 'stat', key: 'mood', delta: -2 }],
        sets: ['family-care-planned'],
      },
    ],
  },
  {
    id: 'family-parents-care',
    title: t('回程箱里的药盒', 'Medicine boxes in the returning suitcase'),
    text: t(
      '照顾家人的日子结束，索菲娅回到英国，把旅行日期补进日记。',
      'The family care visit is over. Back in Britain, Sofia adds the travel dates to the diary.',
    ),
    weight: 4,
    once: true,
    requires: ['family-care-planned'],
    choices: [
      {
        id: 'long',
        label: t('记下四个月的海外照顾', 'Record four months caring abroad'),
        effects: [
          { type: 'absence', startOffsetDays: -120, days: 120 },
          { type: 'money', delta: -900 },
          { type: 'stat', key: 'health', delta: -4 },
        ],
        sets: ['family-care-returned'],
        note: t(
          'SRC-008 CR 3.1：回顾已发生的离境；连续居留后果由引擎按日期计算。',
          'SRC-008 CR 3.1: records a completed absence; the engine calculates continuous residence from the dates.',
        ),
      },
      {
        id: 'short',
        label: t(
          '家人分工，这次在外一个月',
          'Share care with relatives and record one month abroad',
        ),
        effects: [
          { type: 'absence', startOffsetDays: -30, days: 30 },
          { type: 'money', delta: -550 },
          { type: 'stat', key: 'mood', delta: 2 },
        ],
        sets: ['family-care-returned'],
        note: t(
          'SRC-008 CR 3.1：仅记录本次已经结束的离境。',
          'SRC-008 CR 3.1: records only this completed absence.',
        ),
      },
    ],
  },
  {
    id: 'family-care-home',
    title: t('熟悉的杯子', 'The familiar cup'),
    text: t(
      '回家第一晚，杰米把索菲娅的杯子放在老位置，连茶渍都没变。',
      'On her first night back, Jamie puts Sofia’s cup in its usual spot. Even the tea stain is familiar.',
    ),
    weight: 4,
    once: true,
    requires: ['family-care-returned'],
    choices: [
      {
        id: 'talk',
        label: t(
          '聊完旅程，回到年薪一万二的兼职',
          'Talk through the visit and return to part-time work at twelve thousand',
        ),
        effects: [
          { type: 'episode', patch: { salary: 12000 } },
          { type: 'income', taxYear: 'current', earnings: 12000 },
          { type: 'stat', key: 'mood', delta: 5 },
        ],
        note: financialNote,
      },
      {
        id: 'sleep',
        label: t(
          '先减少工时休整，年薪暂按六千记',
          'Reduce work while recovering, at an annualised six thousand',
        ),
        effects: [
          { type: 'episode', patch: { salary: 6000 } },
          { type: 'income', taxYear: 'current', earnings: 6000 },
          { type: 'stat', key: 'health', delta: 5 },
        ],
        note: financialNote,
      },
    ],
  },
  {
    id: 'family-small-socks',
    title: t('小得离谱的袜子', 'Impossibly small socks'),
    text: t(
      '宝宝的袜子比杰米的手掌还小，两个人对着购物篮傻笑。',
      'The baby socks are smaller than Jamie’s palm. They grin at the shopping basket together.',
    ),
    weight: 3,
    once: true,
    when: [{ yearMin: 2 }],
    choices: [
      {
        id: 'prepare',
        label: t(
          '买一套，育儿准备期先停下兼职',
          'Buy one set and pause part-time work while preparing for the baby',
        ),
        effects: [
          { type: 'money', delta: -35 },
          { type: 'episode', patch: { salary: 0 } },
          { type: 'income', taxYear: 'current', earnings: 0 },
          { type: 'stat', key: 'mood', delta: 5 },
        ],
        sets: ['family-baby-prepared'],
        note: financialNote,
      },
      {
        id: 'borrow',
        label: t(
          '先问朋友借婴儿用品',
          'Ask friends about baby things to borrow',
        ),
        effects: [{ type: 'stat', key: 'mood', delta: 4 }],
        sets: ['family-baby-prepared'],
      },
    ],
  },
  {
    id: 'family-baby-arrival',
    title: t('多了一盏夜灯', 'One more night light'),
    text: t(
      '孩子出生了，夜灯亮着，杰米把所有轻声关门都练成了慢动作。',
      'The baby arrives. With the night light on, Jamie turns every quiet door-closing into slow motion.',
    ),
    weight: 4,
    once: true,
    requires: ['family-baby-prepared'],
    choices: [
      {
        id: 'night',
        label: t('轮流照看，尽量补觉', 'Take turns and catch up on sleep'),
        effects: [
          { type: 'stat', key: 'health', delta: -4 },
          { type: 'stat', key: 'mood', delta: 6 },
        ],
        sets: ['family-baby-arrived'],
        note: t(
          '这里只叙事且只评估索菲娅本人；子女如需定居评估另见 SRC-029 para 298。',
          'This is narrative only and assesses Sofia alone; any child settlement assessment is separate under SRC-029 para 298.',
        ),
      },
      {
        id: 'help',
        label: t('接受朋友送来的热饭', 'Accept the hot meal a friend brings'),
        effects: [
          { type: 'stat', key: 'health', delta: -2 },
          { type: 'stat', key: 'mood', delta: 5 },
        ],
        sets: ['family-baby-arrived'],
        note: t(
          '不新增子女时间线；SRC-029 para 298 的子女条件须另行评估。',
          'No child timeline is added; child conditions under SRC-029 para 298 need a separate assessment.',
        ),
      },
    ],
  },
  {
    id: 'family-pram-hall',
    title: t('走廊的新家具', 'The hallway’s new furniture'),
    text: t(
      '婴儿车堵在门口，索菲娅和杰米研究出侧着身子进家的新步法。',
      'The pram blocks the hallway. Sofia and Jamie develop a new sideways step for getting indoors.',
    ),
    weight: 3,
    once: true,
    requires: ['family-baby-arrived'],
    choices: [
      {
        id: 'clear',
        label: t('整理走廊，腾出位置', 'Clear a proper space in the hallway'),
        effects: [
          { type: 'stat', key: 'health', delta: 3 },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
      },
      {
        id: 'fold',
        label: t(
          '折好婴儿车，重新开始年薪一万二的兼职',
          'Fold the pram and resume part-time work at twelve thousand a year',
        ),
        effects: [
          { type: 'episode', patch: { salary: 12000 } },
          { type: 'income', taxYear: 'current', earnings: 12000 },
          { type: 'stat', key: 'mood', delta: 4 },
        ],
        note: financialNote,
      },
    ],
  },
  {
    id: 'family-neighbour-drill',
    title: t('周日的电钻', 'A Sunday drill'),
    text: t(
      '隔壁周日一早又开电钻，杰米的枕头盖住耳朵也没用。',
      'The neighbour starts drilling early on Sunday again. Jamie’s pillow makes a poor ear defender.',
    ),
    weight: 3,
    once: true,
    choices: [
      {
        id: 'talk',
        label: t('白天约邻居谈谈', 'Arrange a daytime chat with the neighbour'),
        effects: [{ type: 'stat', key: 'mood', delta: -2 }],
        sets: ['family-noise-talk'],
      },
      {
        id: 'walk',
        label: t('先出去走走，记下时间', 'Take a walk and note the time'),
        effects: [{ type: 'stat', key: 'health', delta: 2 }],
        sets: ['family-noise-talk'],
      },
    ],
  },
  {
    id: 'family-neighbour-mediation',
    title: t('门口的对话', 'A conversation at the door'),
    text: t(
      '邻居开门时还拿着电钻，索菲娅把事先写好的话又读了一遍。',
      'The neighbour opens the door still holding the drill. Sofia rereads the words she prepared.',
    ),
    weight: 4,
    once: true,
    requires: ['family-noise-talk'],
    choices: [
      {
        id: 'agree',
        label: t('商量一个安静时段', 'Agree some quiet hours'),
        effects: [
          { type: 'stat', key: 'english', delta: 2 },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
      },
      {
        id: 'heated',
        label: t('话赶话，争执升级', 'Let the argument get heated'),
        effects: [{ type: 'stat', key: 'mood', delta: -5 }],
        sets: ['family-noise-heated'],
      },
    ],
  },
  {
    id: 'family-impulse',
    title: t('冲动的一刻', 'A moment of impulse'),
    text: t(
      '争执后又一次碰面，索菲娅听见自己攥紧钥匙的声音。',
      'They meet again after the argument. Sofia hears the keys tightening in her hand.',
    ),
    weight: 4,
    once: true,
    requires: ['family-noise-heated'],
    choices: [
      {
        id: 'leave',
        label: t('转身离开，请第三方协调', 'Walk away and ask for mediation'),
        effects: [{ type: 'stat', key: 'mood', delta: -2 }],
      },
      {
        id: 'convicted',
        label: t(
          '动手伤人，后来被定罪',
          'Assault the neighbour and later be convicted',
        ),
        effects: [{ type: 'criminal', event: {} }],
        note: t(
          'SRC-001 p11–p12：仅记录虚构定罪事实，犯罪后果由引擎计算。',
          'SRC-001 pp11–12: records a fictional conviction; the engine calculates criminality consequences.',
        ),
      },
    ],
  },
  {
    id: 'family-renewal-calendar',
    title: t('日历上的星号', 'An asterisk on the calendar'),
    text: t(
      '索菲娅给续签提醒画了星号，杰米问是不是又一个纪念日。',
      'Sofia marks the renewal reminder with an asterisk. Jamie asks whether it is another anniversary.',
    ),
    weight: 4,
    once: true,
    when: [{ visaMonthsLeftMax: balance.renewalWindowMonths }],
    choices: [
      {
        id: 'plan',
        label: t(
          '查好费用，安排去签证中心',
          'Check the fee and plan a visit to the visa centre',
        ),
        effects: [{ type: 'stat', key: 'mood', delta: -2 }],
        sets: ['family-renewal-planned'],
        note: t(
          'SRC-031 §9 Leave to remain - Other（伴侣境内申请）行；这里只安排材料，续签与 IHS 在签证中心扣费。',
          'SRC-031 §9, Leave to remain - Other (in-country partner application) row; this only prepares papers, with the renewal fee and IHS charged at the visa centre.',
        ),
      },
      {
        id: 'remind',
        label: t('把提醒也写进手机', 'Add the reminder to the phone too'),
        effects: [{ type: 'stat', key: 'mood', delta: 2 }],
        sets: ['family-renewal-planned'],
      },
    ],
  },
  {
    id: 'family-renewed-folder',
    title: t('少一张便签', 'One fewer sticky note'),
    text: t(
      '续签材料归档后，冰箱少了一张便签，露出下面的婚礼照片。',
      'With the renewal papers filed, one fewer sticky note on the fridge reveals the wedding photo underneath.',
    ),
    weight: 4,
    once: true,
    requires: ['family-renewal-planned', 'visa-renewed'],
    choices: [
      {
        id: 'tea',
        label: t('泡杯茶，今晚早点睡', 'Make tea and have an early night'),
        effects: [
          { type: 'stat', key: 'health', delta: 3 },
          { type: 'stat', key: 'mood', delta: 4 },
        ],
      },
      {
        id: 'copy',
        label: t(
          '留好副本，再收起文件夹',
          'Save a copy before putting the folder away',
        ),
        effects: [{ type: 'stat', key: 'mood', delta: 4 }],
      },
    ],
  },
  {
    id: 'family-public-funds-letter',
    title: t('预算旁的传单', 'A leaflet beside the budget'),
    text: t(
      '社区中心的福利传单压在账单下面，索菲娅把自己的许可也拿来对照。',
      'A community-centre benefits leaflet sits under the bills. Sofia takes out her permission to compare.',
    ),
    weight: 3,
    once: true,
    when: [{ stat: 'money', max: 18000 }],
    choices: [
      {
        id: 'advice',
        label: t(
          '先问清本人的领取资格',
          'Ask about personal entitlement first',
        ),
        effects: [{ type: 'stat', key: 'mood', delta: 2 }],
        sets: ['family-funds-checked'],
        note: t(
          'SRC-006 public funds 指引：资格和许可条件须单独核实，打开传单不等于已经领取。',
          'SRC-006 public funds guidance: entitlement and permission conditions need separate checking; opening a leaflet is not receipt.',
        ),
      },
      {
        id: 'savings',
        label: t(
          '动用积蓄，这次不再依靠储蓄材料',
          'Use savings and stop relying on savings evidence for now',
        ),
        effects: [
          { type: 'money', delta: -300 },
          { type: 'timeline', patch: { cashSavings: 0 } },
          { type: 'stat', key: 'mood', delta: -2 },
        ],
        note: financialNote,
      },
    ],
  },
  {
    id: 'family-uc-scenario',
    title: t('账本上的两种写法', 'Two versions of the ledger'),
    text: t(
      '索菲娅回看这一季的账本，决定记录哪一种虚构经历。',
      'Sofia looks back over the quarter’s ledger and chooses which fictional experience to record.',
    ),
    weight: 3,
    once: true,
    requires: ['family-funds-checked'],
    choices: [
      {
        id: 'received',
        label: t(
          '本情节中本人已领取 UC',
          'In this scenario, Sofia has received UC',
        ),
        effects: [
          {
            type: 'benefit',
            benefit: { benefitType: 'UNIVERSAL_CREDIT' },
            startOffsetDays: -90,
            months: 3,
          },
          { type: 'money', delta: 900 },
        ],
        note: t(
          'SRC-006 Universal Credit；SRC-001 p18：仅记录本人已领取的虚构事实，不表示有资格，政策后果交引擎。',
          'SRC-006 Universal Credit; SRC-001 p18: records fictional personal receipt, without asserting entitlement; the engine assesses consequences.',
        ),
      },
      {
        id: 'not-received',
        label: t(
          '没有领取，靠家中积蓄周转',
          'Receive none and manage with household savings',
        ),
        effects: [
          { type: 'money', delta: -250 },
          { type: 'stat', key: 'mood', delta: -2 },
        ],
      },
    ],
  },
  {
    id: 'family-rent-letter',
    title: t('房租信上的新数字', 'A new number in the rent letter'),
    text: t(
      '房东的邮件比平时客气，索菲娅看到最后一行才明白原因。',
      'The landlord’s email is unusually polite. Sofia reaches the final line and understands why.',
    ),
    weight: 3,
    once: true,
    forbids: ['quarter-housing-change'],
    choices: [
      {
        id: 'renew',
        label: t(
          '接受涨租，先留在这里',
          'Accept the rent increase and stay for now',
        ),
        effects: [{ type: 'stat', key: 'mood', delta: -4 }],
        sets: ['quarter-housing-change', 'rent-rise-family'],
      },
      {
        id: 'search',
        label: t('暂时续住，开始找房', 'Renew for now and start looking'),
        effects: [{ type: 'stat', key: 'mood', delta: -3 }],
        sets: [
          'quarter-housing-change',
          'rent-rise-family',
          'family-house-search',
        ],
      },
    ],
  },
  {
    id: 'family-move-boxes',
    title: t('标着厨房的纸箱', 'A box marked kitchen'),
    text: t(
      '写着厨房的箱子里全是书，杰米坚持说这也算精神食粮。',
      'The box marked kitchen contains only books. Jamie insists they are food for thought.',
    ),
    weight: 4,
    once: true,
    requires: ['family-house-search'],
    forbids: ['quarter-housing-change'],
    choices: [
      {
        id: 'move',
        label: t(
          '动用预留款搬家，暂不申报储蓄',
          'Use the reserved money to move and stop declaring savings for now',
        ),
        effects: [
          { type: 'money', delta: -650 },
          { type: 'timeline', patch: { cashSavings: 0 } },
          { type: 'stat', key: 'mood', delta: 5 },
        ],
        sets: ['quarter-housing-change'],
        note: financialNote,
      },
      {
        id: 'stay',
        label: t(
          '这次仍留下，把书归位',
          'Stay this time and put the books away',
        ),
        effects: [{ type: 'stat', key: 'mood', delta: 2 }],
        sets: ['quarter-housing-change'],
      },
    ],
  },
  {
    id: 'family-anniversary',
    title: t('手机里的日期提醒', 'A date reminder on the phone'),
    text: t(
      '纪念日又到了，两个人翻看日历，刚结束的旅行和今晚的晚饭挤在一起。',
      'Another anniversary arrives. The calendar holds both a recently completed trip and tonight’s dinner.',
    ),
    weight: 3,
    once: true,
    choices: [
      {
        id: 'cook',
        label: t(
          '记下刚结束的两周海外纪念旅行',
          'Record the completed two-week anniversary trip abroad',
        ),
        effects: [
          { type: 'absence', startOffsetDays: -14, days: 14 },
          { type: 'money', delta: -700 },
          { type: 'stat', key: 'mood', delta: 6 },
        ],
        sets: ['family-anniversary-kept'],
        note: t(
          'SRC-008 CR 3.1：这趟纪念旅行已经结束，日期记入离境记录。',
          'SRC-008 CR 3.1: this anniversary trip is complete and its dates enter the absence record.',
        ),
      },
      {
        id: 'takeaway',
        label: t(
          '点外卖，认真摆一次桌',
          'Order takeaway and set the table properly',
        ),
        effects: [
          { type: 'money', delta: -45 },
          { type: 'stat', key: 'mood', delta: 7 },
        ],
        sets: ['family-anniversary-kept'],
      },
    ],
  },
  {
    id: 'family-anniversary-photo',
    title: t('没有对焦的照片', 'The out-of-focus photo'),
    text: t(
      '上次纪念日的照片洗出来了，菜糊了，人也糊了，笑容倒很清楚。',
      'The anniversary photo comes back from printing. The food is blurred and so are they, but the smiles are clear.',
    ),
    weight: 4,
    once: true,
    requires: ['family-anniversary-kept'],
    choices: [
      {
        id: 'frame',
        label: t('放进相框', 'Put it in a frame'),
        effects: [
          { type: 'money', delta: -12 },
          { type: 'stat', key: 'mood', delta: 5 },
        ],
      },
      {
        id: 'fridge',
        label: t('贴到冰箱上', 'Put it on the fridge'),
        effects: [{ type: 'stat', key: 'mood', delta: 4 }],
      },
    ],
  },
  {
    id: 'family-british-connection',
    title: t('两栏之间的铅笔线', 'A pencil line between two columns'),
    text: t(
      '索菲娅在市政厅看到两栏不同的解释，杰米把椅子搬近了一点。',
      'Sofia reads two different explanations at town hall. Jamie pulls his chair a little closer.',
    ),
    weight: 3,
    once: true,
    choices: [
      {
        id: 'read',
        label: t(
          '一起看 British connection 的解释',
          'Read the British connection explanation together',
        ),
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
        note: t(
          `SRC-001 p18、p46：British connection 对应改革 ${earnedSettlement2026_11.values.pathwayYears5.value} 年候选路径，其他条件仍由引擎判断。`,
          `SRC-001 pp18, 46: British connection supports a proposed ${earnedSettlement2026_11.values.pathwayYears5.value}-year candidate pathway; the engine still checks the other conditions.`,
        ),
      },
      {
        id: 'save',
        label: t(
          '补记上月一起出国的七天行程',
          'Add last month’s seven-day trip abroad together',
        ),
        effects: [
          { type: 'absence', startOffsetDays: -30, days: 7 },
          { type: 'stat', key: 'mood', delta: 2 },
        ],
        note: t(
          'SRC-008 CR 3.1：British connection 不替代连续居留要求，已发生的离境仍记入。',
          'SRC-008 CR 3.1: British connection does not replace continuous residence; completed absences are still recorded.',
        ),
      },
    ],
  },
  {
    id: 'family-five-year-folder',
    title: t('文件夹变厚了', 'A thicker folder'),
    text: t(
      '索菲娅翻到第一张许可复印件，日期旁还留着当年手写的小太阳。',
      'Sofia finds the first permission copy. A tiny sun drawn beside the date is still there.',
    ),
    weight: 3,
    once: true,
    when: [{ yearMin: 4 }],
    choices: [
      {
        id: 'review',
        label: t(
          '把许可复印件按日期排好',
          'Put the permission copies in date order',
        ),
        effects: [{ type: 'stat', key: 'career', delta: 2 }],
        note: t(
          `SRC-024 E-ILRP.1.3：本人走 ${law.familyPartnerQualifyingYearsFive.value} 年伴侣路径，满年数不等于其他条件已满足。`,
          `SRC-024 E-ILRP.1.3: Sofia is on the ${law.familyPartnerQualifyingYearsFive.value}-year partner pathway; completing the period does not satisfy the other conditions.`,
        ),
      },
      {
        id: 'rest',
        label: t(
          '今晚先收起来，明天再看',
          'Put it away tonight and read tomorrow',
        ),
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
      },
    ],
  },
  {
    id: 'family-rain-bus',
    title: t('同一把伞', 'The same umbrella'),
    text: t(
      '公交还没来，杰米把伞往索菲娅那边倾，自己半边肩膀已经湿透。',
      'The bus is late. Jamie tilts the umbrella towards Sofia; half his shoulder is already soaked.',
    ),
    weight: 2,
    once: true,
    season: 4,
    choices: [
      {
        id: 'share',
        label: t('挤近一点，继续等车', 'Move closer and keep waiting'),
        effects: [{ type: 'stat', key: 'mood', delta: 4 }],
      },
      {
        id: 'walk',
        label: t('索性一起走回家', 'Walk home together instead'),
        effects: [
          { type: 'stat', key: 'health', delta: 3 },
          { type: 'stat', key: 'mood', delta: 2 },
        ],
      },
    ],
  },
  {
    id: 'family-yellow-stickers',
    title: t('黄标晚餐', 'A yellow-sticker dinner'),
    text: t(
      '超市黄标区剩下西兰花和一块蛋糕，杰米说营养已经很平衡。',
      'The reduced section has broccoli and one slice of cake. Jamie calls that a balanced meal.',
    ),
    weight: 2,
    once: true,
    choices: [
      {
        id: 'cook',
        label: t('买菜回家认真做饭', 'Take the vegetables home and cook'),
        effects: [
          { type: 'money', delta: -8 },
          { type: 'stat', key: 'health', delta: 4 },
        ],
      },
      {
        id: 'cake',
        label: t(
          '分着吃蛋糕，菜留明天',
          'Share the cake and save the vegetables for tomorrow',
        ),
        effects: [
          { type: 'money', delta: -5 },
          { type: 'stat', key: 'mood', delta: 4 },
        ],
      },
    ],
  },
  {
    id: 'family-phone-accent',
    title: t('电话另一头', 'At the other end of the phone'),
    text: t(
      '索菲娅打电话改预约，对方说得飞快，杰米在旁边也没听懂。',
      'Sofia calls to change an appointment. The person speaks so fast that Jamie cannot follow either.',
    ),
    weight: 2,
    once: true,
    choices: [
      {
        id: 'repeat',
        label: t('请对方再说一遍', 'Ask them to repeat it'),
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
      },
      {
        id: 'email',
        label: t('请对方发邮件确认', 'Ask for an email confirmation'),
        effects: [
          { type: 'stat', key: 'english', delta: 1 },
          { type: 'stat', key: 'mood', delta: 2 },
        ],
      },
    ],
  },
  {
    id: 'family-recipe-note',
    title: t('面粉袋上的食谱', 'A recipe on the flour bag'),
    text: t(
      '两个人照袋子上的食谱烤面包，成品有点像可以撑门的砖。',
      'They bake bread from the flour-bag recipe. The result looks capable of propping a door open.',
    ),
    weight: 2,
    once: true,
    choices: [
      {
        id: 'again',
        label: t('再试一次，少放点面粉', 'Try again with less flour'),
        effects: [
          { type: 'stat', key: 'english', delta: 1 },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
      },
      {
        id: 'toast',
        label: t(
          '切薄烤脆，也算成功',
          'Slice it thin and toast it into a success',
        ),
        effects: [{ type: 'stat', key: 'mood', delta: 4 }],
      },
    ],
  },
  {
    id: 'family-weekend-rota',
    title: t('周末班表', 'The weekend rota'),
    text: t(
      '两个人难得同时休息，窗外却下起雨，连鸽子都躲在站牌下面。',
      'They finally have the same day off. Outside, even the pigeons shelter from the rain under the bus stop.',
    ),
    weight: 2,
    once: true,
    choices: [
      {
        id: 'film',
        label: t('在沙发上看一部老电影', 'Watch an old film on the sofa'),
        effects: [{ type: 'stat', key: 'mood', delta: 5 }],
      },
      {
        id: 'boots',
        label: t('穿雨靴去公园走走', 'Put on wellies and walk in the park'),
        effects: [
          { type: 'stat', key: 'health', delta: 4 },
          { type: 'stat', key: 'mood', delta: 2 },
        ],
      },
    ],
  },
  {
    id: 'family-shared-lunch',
    title: t('午餐盒换了主人', 'Lunch boxes swap owners'),
    text: t(
      '索菲娅拿错杰米的午餐，同事看着整盒三明治，问是不是要开会。',
      'Sofia brings Jamie’s lunch by mistake. Seeing the box of sandwiches, a colleague asks whether a meeting is planned.',
    ),
    weight: 2,
    once: true,
    choices: [
      {
        id: 'share',
        label: t('分给同事，顺便聊天', 'Share them and have a chat'),
        effects: [
          { type: 'stat', key: 'mood', delta: 4 },
          { type: 'stat', key: 'english', delta: 1 },
        ],
      },
      {
        id: 'save',
        label: t('留一半给下午', 'Keep half for later'),
        effects: [{ type: 'stat', key: 'health', delta: 3 }],
      },
    ],
  },
  {
    id: 'family-charlie-library',
    title: t('图书馆的同一张桌', 'The same table at the library'),
    text: t(
      '查理每周都坐在窗边，这次主动把插座让给索菲娅。',
      'Charlie sits by the window every week. This time, Charlie offers Sofia the power socket.',
    ),
    weight: 2,
    once: true,
    choices: [
      {
        id: 'chat',
        label: t(
          '介绍自己，约下次喝茶',
          'Introduce yourself and arrange tea next time',
        ),
        effects: [
          { type: 'stat', key: 'mood', delta: 3 },
          { type: 'stat', key: 'english', delta: 1 },
        ],
        sets: ['friend-family-charlie'],
      },
      {
        id: 'thanks',
        label: t('道谢后继续看书', 'Say thanks and carry on reading'),
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
      },
    ],
  },
  {
    id: 'family-charlie-book',
    title: t('查理的推荐书', 'Charlie’s recommended book'),
    text: t(
      '查理借来的小说夹着一张路线图，说里面那家咖啡馆真的存在。',
      'Charlie’s novel contains a map. Apparently the cafe in the story really exists.',
    ),
    weight: 3,
    once: true,
    requires: ['friend-family-charlie'],
    choices: [
      {
        id: 'visit',
        label: t('一起按图找咖啡馆', 'Follow the map to the cafe together'),
        effects: [
          { type: 'money', delta: -9 },
          { type: 'stat', key: 'mood', delta: 5 },
        ],
      },
      {
        id: 'read',
        label: t('先把书读完再聊', 'Finish the book before discussing it'),
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
      },
    ],
  },
  {
    id: 'family-mina-art',
    title: t('沾颜料的袖口', 'Paint on a sleeve'),
    text: t(
      '社区画室里，米娜把颜料蹭到袖口，索菲娅递来的纸巾也染蓝了。',
      'At the community art room, Mina gets paint on a sleeve. The tissue Sofia offers turns blue too.',
    ),
    weight: 2,
    once: true,
    season: 2,
    choices: [
      {
        id: 'paint',
        label: t('一起画完这张小画', 'Finish the little painting together'),
        effects: [{ type: 'stat', key: 'mood', delta: 4 }],
        sets: ['friend-family-mina'],
      },
      {
        id: 'watch',
        label: t(
          '看看大家的作品再回家',
          'Look at everyone’s paintings before leaving',
        ),
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
      },
    ],
  },
  {
    id: 'family-mina-exhibition',
    title: t('墙上的小画', 'A little painting on the wall'),
    text: t(
      '米娜的小画在社区展出了，索菲娅一眼认出那块蓝得出格的天空。',
      'Mina’s painting is in the community show. Sofia recognises the outrageously blue sky immediately.',
    ),
    weight: 3,
    once: true,
    requires: ['friend-family-mina'],
    choices: [
      {
        id: 'go',
        label: t('带杰米去捧场', 'Take Jamie along to support the show'),
        effects: [
          { type: 'stat', key: 'mood', delta: 5 },
          { type: 'stat', key: 'english', delta: 1 },
        ],
      },
      {
        id: 'card',
        label: t('给米娜写张祝贺卡', 'Write Mina a congratulations card'),
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
      },
    ],
  },
  {
    id: 'family-noor-walk',
    title: t('公园绕圈', 'Laps of the park'),
    text: t(
      '努尔在公园走得很快，每说完一句话都要等索菲娅赶上来。',
      'Noor walks fast in the park and waits for Sofia to catch up at the end of each sentence.',
    ),
    weight: 2,
    once: true,
    season: 3,
    choices: [
      {
        id: 'join',
        label: t('约好以后一起走', 'Arrange more walks together'),
        effects: [
          { type: 'stat', key: 'health', delta: 4 },
          { type: 'stat', key: 'english', delta: 1 },
        ],
        sets: ['friend-family-noor'],
      },
      {
        id: 'bench',
        label: t('先在长椅上坐一会儿', 'Sit on the bench for a while first'),
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
      },
    ],
  },
  {
    id: 'family-noor-lake',
    title: t('湖边的岔路', 'A fork by the lake'),
    text: t(
      '努尔说这次是轻松路线，索菲娅看着眼前的坡，决定暂时不评论。',
      'Noor calls this the easy route. Looking at the slope ahead, Sofia reserves judgment.',
    ),
    weight: 3,
    once: true,
    requires: ['friend-family-noor'],
    choices: [
      {
        id: 'hill',
        label: t('慢慢爬上去看湖', 'Climb slowly for the view of the lake'),
        effects: [{ type: 'stat', key: 'health', delta: 5 }],
      },
      {
        id: 'flat',
        label: t(
          '商量走平路，边走边聊',
          'Agree on the flat path and keep chatting',
        ),
        effects: [
          { type: 'stat', key: 'health', delta: 2 },
          { type: 'stat', key: 'english', delta: 1 },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
      },
    ],
  },
  {
    id: 'family-winter-duvet',
    title: t('被子的边界', 'The duvet border'),
    text: t(
      '冬夜的被子总往杰米那边跑，索菲娅开始认真考虑两床被子的外交方案。',
      'The winter duvet keeps migrating towards Jamie. Sofia considers a diplomatic solution involving two duvets.',
    ),
    weight: 2,
    once: true,
    season: 1,
    choices: [
      {
        id: 'duvet',
        label: t(
          '买床厚被，各自睡暖',
          'Buy another thick duvet and both stay warm',
        ),
        effects: [
          { type: 'money', delta: -55 },
          { type: 'stat', key: 'health', delta: 5 },
        ],
      },
      {
        id: 'blanket',
        label: t('加条旧毯子，早点睡', 'Add the old blanket and sleep early'),
        effects: [{ type: 'stat', key: 'health', delta: 3 }],
      },
    ],
  },
  {
    id: 'family-spring-bulbs',
    title: t('窗台上的绿尖', 'Green tips on the windowsill'),
    text: t(
      '秋天种的球根终于发芽，杰米每天都问是不是又长高了一点。',
      'The bulbs planted in autumn finally sprout. Jamie asks every day whether they have grown again.',
    ),
    weight: 2,
    once: true,
    season: 2,
    choices: [
      {
        id: 'water',
        label: t('浇水，拍张照片', 'Water them and take a photo'),
        effects: [{ type: 'stat', key: 'mood', delta: 4 }],
      },
      {
        id: 'garden',
        label: t('去社区花园帮忙', 'Help at the community garden'),
        effects: [
          { type: 'stat', key: 'health', delta: 3 },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
      },
    ],
  },
  {
    id: 'family-summer-picnic',
    title: t('草地上的午饭', 'Lunch on the grass'),
    text: t(
      '天气预报说有太阳，两个人把野餐毯带出门，顺便也带了雨衣。',
      'The forecast promises sunshine. They take the picnic blanket and, just in case, raincoats.',
    ),
    weight: 2,
    once: true,
    season: 3,
    choices: [
      {
        id: 'picnic',
        label: t('吃完午饭再晒会儿太阳', 'Stay in the sun after lunch'),
        effects: [
          { type: 'money', delta: -14 },
          { type: 'stat', key: 'mood', delta: 5 },
        ],
      },
      {
        id: 'walk',
        label: t('沿河走一段再回家', 'Take the riverside path home'),
        effects: [{ type: 'stat', key: 'health', delta: 4 }],
      },
    ],
  },
  {
    id: 'family-autumn-jam',
    title: t('多了一排果酱', 'An extra row of jam jars'),
    text: t(
      '杰米买错了苹果的数量，厨房现在像个规模很小的果酱工厂。',
      'Jamie misjudges the apple order. The kitchen now resembles a very small jam factory.',
    ),
    weight: 2,
    once: true,
    season: 4,
    choices: [
      {
        id: 'gifts',
        label: t('装好几罐送给邻居', 'Take a few jars to the neighbours'),
        effects: [
          { type: 'stat', key: 'mood', delta: 4 },
          { type: 'stat', key: 'english', delta: 1 },
        ],
      },
      {
        id: 'freeze',
        label: t('分装冷冻，留着做点心', 'Freeze portions for future baking'),
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
      },
    ],
  },
  {
    id: 'family-late-shift',
    title: t('门口的拖鞋', 'Slippers by the door'),
    text: t(
      '忙完一周的班，索菲娅回家只想确认拖鞋没有被吸尘器藏起来。',
      'After a busy week, Sofia only wants to know that the vacuum cleaner has not hidden her slippers.',
    ),
    weight: 2,
    once: true,
    choices: [
      {
        id: 'sleep',
        label: t('洗完澡就睡', 'Shower and go straight to bed'),
        effects: [{ type: 'stat', key: 'health', delta: 5 }],
      },
      {
        id: 'talk',
        label: t('和杰米坐着聊十分钟', 'Sit with Jamie for a ten-minute chat'),
        effects: [{ type: 'stat', key: 'mood', delta: 5 }],
      },
    ],
  },
  {
    id: 'family-shoe-repair',
    title: t('鞋底的小洞', 'A little hole in the sole'),
    text: t(
      '杰米直到踩进水坑才发现鞋底破了，回家时一只脚发出了海浪声。',
      'Jamie discovers the hole in his shoe in a puddle. One foot sounds like the sea on the way home.',
    ),
    weight: 2,
    once: true,
    choices: [
      {
        id: 'repair',
        label: t('送去修鞋铺', 'Take the shoes to be repaired'),
        effects: [
          { type: 'money', delta: -28 },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
      },
      {
        id: 'dry',
        label: t('先晾干，穿备用鞋', 'Dry them and use the spare pair'),
        effects: [{ type: 'stat', key: 'health', delta: 2 }],
      },
    ],
  },
  {
    id: 'family-council-tax',
    title: t('棕色信封', 'A brown envelope'),
    text: t(
      'council tax 的信封混在披萨广告里，索菲娅差点把两张都当优惠券。',
      'The council tax letter lands among pizza adverts. Sofia nearly files both as vouchers.',
    ),
    weight: 2,
    once: true,
    choices: [
      {
        id: 'budget',
        label: t(
          '整理账单，调整预留的钱',
          'Sort the bills and adjust the money set aside',
        ),
        effects: [
          { type: 'money', delta: -180 },
          { type: 'stat', key: 'mood', delta: -2 },
        ],
      },
      {
        id: 'call',
        label: t(
          '打电话核对账期再付款',
          'Call to check the billing period before paying',
        ),
        effects: [
          { type: 'money', delta: -180 },
          { type: 'stat', key: 'english', delta: 2 },
        ],
      },
    ],
  },
  {
    id: 'family-wedding-invite',
    title: t('又一张请柬', 'Another wedding invitation'),
    text: t(
      '朋友的婚礼在城外，杰米翻出西装，口袋里还有上次的停车票。',
      'A friend’s wedding is out of town. Jamie finds the last wedding’s parking ticket in the suit pocket.',
    ),
    weight: 2,
    once: true,
    season: 3,
    choices: [
      {
        id: 'go',
        label: t('坐火车去，住一晚', 'Take the train and stay overnight'),
        effects: [
          { type: 'money', delta: -180 },
          { type: 'stat', key: 'mood', delta: 6 },
        ],
      },
      {
        id: 'day',
        label: t('当天来回，早点回家', 'Make it a day trip and get home early'),
        effects: [
          { type: 'money', delta: -70 },
          { type: 'stat', key: 'mood', delta: 4 },
        ],
      },
    ],
  },
  {
    id: 'family-garage-quote',
    title: t('修车单上的逗号', 'A comma on the garage quote'),
    text: t(
      '借来的车亮了警告灯，修车师傅叹气的速度让索菲娅有点担心。',
      'The borrowed car’s warning light comes on. The mechanic sighs rather too quickly for Sofia’s comfort.',
    ),
    weight: 2,
    once: true,
    choices: [
      {
        id: 'repair',
        label: t('分担这次修理费', 'Contribute to the repair bill'),
        effects: [
          { type: 'money', delta: -280 },
          { type: 'stat', key: 'mood', delta: -2 },
        ],
      },
      {
        id: 'second',
        label: t('和车主一起再询个价', 'Get another quote with the owner'),
        effects: [
          { type: 'money', delta: -160 },
          { type: 'stat', key: 'english', delta: 1 },
        ],
      },
    ],
  },
  {
    id: 'family-kettle',
    title: t('水壶最后的演出', 'The kettle’s final performance'),
    text: t(
      '水壶响了半天却没烧开，杰米说它只是想参与厨房的谈话。',
      'The kettle makes a noise for ages without boiling. Jamie says it just wants to join the kitchen conversation.',
    ),
    weight: 2,
    once: true,
    choices: [
      {
        id: 'replace',
        label: t('换一个耐用水壶', 'Buy a sturdy replacement kettle'),
        effects: [
          { type: 'money', delta: -32 },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
      },
      {
        id: 'pan',
        label: t('先用锅烧水', 'Boil water in a saucepan for now'),
        effects: [{ type: 'stat', key: 'mood', delta: -1 }],
      },
    ],
  },
  {
    id: 'family-gp-wait',
    title: t('候诊室里的杂志', 'A magazine in the waiting room'),
    text: t(
      'GP 候诊室的杂志还在介绍上个夏天，索菲娅已经穿上第二件毛衣。',
      'The GP waiting-room magazine still covers last summer. Sofia is already wearing her second jumper.',
    ),
    weight: 2,
    once: true,
    season: 1,
    choices: [
      {
        id: 'wait',
        label: t(
          '耐心等完，问清不舒服的原因',
          'Wait and ask properly about the symptoms',
        ),
        effects: [{ type: 'stat', key: 'health', delta: 5 }],
      },
      {
        id: 'notes',
        label: t(
          '先把症状和问题写下来',
          'Write down the symptoms and questions',
        ),
        effects: [
          { type: 'stat', key: 'health', delta: 3 },
          { type: 'stat', key: 'english', delta: 1 },
        ],
      },
    ],
  },
  {
    id: 'family-nhs-text',
    title: t('来得很早的短信', 'A very early text'),
    text: t(
      'NHS 的预约短信清晨就到了，杰米以为闹钟提前了一个时代。',
      'The NHS appointment text arrives at dawn. Jamie thinks the alarm has moved into another time zone.',
    ),
    weight: 2,
    once: true,
    choices: [
      {
        id: 'calendar',
        label: t(
          '记进日历，再睡一会儿',
          'Add it to the calendar and sleep a little longer',
        ),
        effects: [{ type: 'stat', key: 'health', delta: 3 }],
      },
      {
        id: 'walk',
        label: t('既然醒了，出去走走', 'Since you are awake, go for a walk'),
        effects: [
          { type: 'stat', key: 'health', delta: 4 },
          { type: 'stat', key: 'mood', delta: 2 },
        ],
      },
    ],
  },
  {
    id: 'family-exam-setback',
    title: t('模拟题上的红圈', 'Red circles on the mock test'),
    text: t(
      '模拟听力错得比上次多，索菲娅发现自己一直把烤箱声当背景噪音。',
      'The mock listening test goes worse than last time. Sofia realises the oven has been drowning out half the audio.',
    ),
    weight: 2,
    once: true,
    when: [{ stat: 'english', max: balance.englishB2 - 1 }],
    choices: [
      {
        id: 'retry',
        label: t('关掉烤箱，再听一次', 'Turn off the oven and listen again'),
        effects: [
          { type: 'stat', key: 'english', delta: 2 },
          { type: 'stat', key: 'mood', delta: -2 },
        ],
      },
      {
        id: 'break',
        label: t('先休息，明天再练', 'Rest and practise tomorrow'),
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
      },
    ],
  },
  {
    id: 'family-joke',
    title: t('慢半拍的笑声', 'Laughter a beat late'),
    text: t(
      '同事讲完笑话，索菲娅走到咖啡机旁才懂，结果对着空杯子笑出声。',
      'Sofia gets a colleague’s joke only at the coffee machine and ends up laughing into an empty cup.',
    ),
    weight: 2,
    once: true,
    choices: [
      {
        id: 'tell',
        label: t(
          '回去告诉同事终于懂了',
          'Go back and say the joke finally landed',
        ),
        effects: [
          { type: 'stat', key: 'english', delta: 2 },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
      },
      {
        id: 'save',
        label: t('留着回家讲给杰米', 'Save it to tell Jamie at home'),
        effects: [{ type: 'stat', key: 'mood', delta: 4 }],
      },
    ],
  },
  {
    id: 'family-laundry',
    title: t('袜子的平行宇宙', 'The parallel universe of socks'),
    text: t(
      '洗完衣服又少了一只袜子，杰米建议给失踪的袜子单独建个相册。',
      'Another sock vanishes in the wash. Jamie suggests a photo album for the missing ones.',
    ),
    weight: 2,
    once: true,
    choices: [
      {
        id: 'sort',
        label: t('把剩下的重新配好', 'Pair up what remains'),
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
      },
      {
        id: 'odd',
        label: t('干脆穿不一样的出门', 'Go out in odd socks'),
        effects: [{ type: 'stat', key: 'mood', delta: 4 }],
      },
    ],
  },
  {
    id: 'family-post-office',
    title: t('邮局里的队伍', 'The post-office queue'),
    text: t(
      '寄给家人的包裹排了很久，轮到索菲娅时，她已经读懂了整张价目表。',
      'The parcel queue takes so long that Sofia has read the whole price list by her turn.',
    ),
    weight: 2,
    once: true,
    choices: [
      {
        id: 'send',
        label: t(
          '寄出包裹，和柜员聊两句',
          'Send the parcel and chat with the clerk',
        ),
        effects: [
          { type: 'money', delta: -24 },
          { type: 'stat', key: 'english', delta: 2 },
        ],
      },
      {
        id: 'letter',
        label: t('这次先寄手写的信', 'Send the handwritten letter first'),
        effects: [
          { type: 'money', delta: -4 },
          { type: 'stat', key: 'mood', delta: 4 },
        ],
      },
    ],
  },
  {
    id: 'family-fridge-hum',
    title: t('冰箱的低音', 'The fridge’s bass note'),
    text: t(
      '冰箱整晚嗡嗡响，杰米说它正在练低音，索菲娅只想让乐队休息。',
      'The fridge hums all night. Jamie says it is practising bass; Sofia would like the band to take a break.',
    ),
    weight: 2,
    once: true,
    choices: [
      {
        id: 'repair',
        label: t(
          '预约维修，今晚戴耳塞',
          'Book a repair and use earplugs tonight',
        ),
        effects: [
          { type: 'money', delta: -95 },
          { type: 'stat', key: 'health', delta: 3 },
        ],
      },
      {
        id: 'landlord',
        label: t(
          '整理故障视频发给房东',
          'Send the landlord a video of the fault',
        ),
        effects: [
          { type: 'stat', key: 'english', delta: 2 },
          { type: 'stat', key: 'mood', delta: -1 },
        ],
      },
    ],
  },
  {
    id: 'family-work-training',
    title: t('名字写在名单上', 'A name on the training list'),
    text: t(
      '培训名单上有索菲娅的名字，旁边的同事小声提醒教室其实在楼下。',
      'Sofia spots her name on the training list. A colleague quietly points out that the room is downstairs.',
    ),
    weight: 2,
    once: true,
    choices: [
      {
        id: 'join',
        label: t('参加培训，记几页笔记', 'Join the training and take notes'),
        effects: [
          { type: 'stat', key: 'career', delta: 4 },
          { type: 'stat', key: 'english', delta: 1 },
        ],
      },
      {
        id: 'ask',
        label: t('先问清楚课程内容', 'Ask what the course covers first'),
        effects: [
          { type: 'stat', key: 'career', delta: 2 },
          { type: 'stat', key: 'english', delta: 1 },
        ],
      },
    ],
  },
  {
    id: 'family-late-dinner',
    title: t('保温中的晚饭', 'Dinner kept warm'),
    text: t(
      '索菲娅到家时晚饭已经热过两次，杰米把锅盖揭得像宣布彩票开奖。',
      'Dinner has been reheated twice when Sofia gets home. Jamie lifts the lid like announcing the lottery numbers.',
    ),
    weight: 2,
    once: true,
    choices: [
      {
        id: 'eat',
        label: t('坐下来慢慢吃完', 'Sit down and eat slowly'),
        effects: [
          { type: 'stat', key: 'health', delta: 3 },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
      },
      {
        id: 'tomorrow',
        label: t('商量明天各自带饭', 'Arrange packed meals for tomorrow'),
        effects: [{ type: 'stat', key: 'mood', delta: 4 }],
      },
    ],
  },
  {
    id: 'family-home-spice',
    title: t('厨房里熟悉的味道', 'A familiar smell in the kitchen'),
    text: t(
      '熟悉的香料终于买齐，杰米进门就问今天是不是有什么好消息。',
      'Sofia finally finds the familiar spices. Jamie comes in asking whether there is good news to celebrate.',
    ),
    weight: 2,
    once: true,
    choices: [
      {
        id: 'cook',
        label: t('做一锅家里的菜', 'Cook a pot of food from home'),
        effects: [
          { type: 'money', delta: -18 },
          { type: 'stat', key: 'mood', delta: 6 },
        ],
      },
      {
        id: 'call',
        label: t('边做边和家人视频', 'Video-call the family while cooking'),
        effects: [{ type: 'stat', key: 'mood', delta: 5 }],
      },
    ],
  },
  {
    id: 'family-camping',
    title: t('帐篷说明书', 'The tent instructions'),
    text: t(
      '营地就在英国海边，两个人研究帐篷说明书时，海鸥先看懂了零食袋。',
      'At a British seaside campsite, they study the tent instructions while a gull works out the snack bag.',
    ),
    weight: 2,
    once: true,
    season: 3,
    choices: [
      {
        id: 'camp',
        label: t('搭好帐篷住一晚', 'Pitch the tent and stay overnight'),
        effects: [
          { type: 'money', delta: -45 },
          { type: 'stat', key: 'mood', delta: 5 },
        ],
      },
      {
        id: 'day',
        label: t('改成海边一日游', 'Make it a day at the beach instead'),
        effects: [
          { type: 'money', delta: -20 },
          { type: 'stat', key: 'health', delta: 3 },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
      },
    ],
  },
  {
    id: 'family-heating',
    title: t('暖气旋钮', 'The heating dial'),
    text: t(
      '杰米把暖气调低一点，索菲娅把毛衣加厚一点，猫占了最暖的位置。',
      'Jamie turns the heating down, Sofia adds a thicker jumper, and the visiting cat claims the warmest spot.',
    ),
    weight: 2,
    once: true,
    season: 1,
    choices: [
      {
        id: 'warm',
        label: t('多开一会儿暖气', 'Keep the heating on a little longer'),
        effects: [
          { type: 'money', delta: -130 },
          { type: 'stat', key: 'health', delta: 4 },
        ],
      },
      {
        id: 'draft',
        label: t(
          '一起堵好门窗的漏风处',
          'Block the draughts around doors and windows',
        ),
        effects: [
          { type: 'money', delta: -22 },
          { type: 'stat', key: 'health', delta: 3 },
        ],
      },
    ],
  },
  {
    id: 'family-fifth-anniversary',
    title: t('同一条河的长椅', 'A bench by the same river'),
    text: t(
      '又走到初来时的河边，索菲娅发现杰米连长椅掉漆的位置都记得。',
      'Back by the river from her first days here, Sofia finds Jamie even remembers where the bench paint has peeled.',
    ),
    weight: 2,
    once: true,
    when: [{ yearMin: 5 }],
    choices: [
      {
        id: 'sit',
        label: t(
          '坐下来讲讲这些年的变化',
          'Sit and talk about what has changed',
        ),
        effects: [{ type: 'stat', key: 'mood', delta: 6 }],
      },
      {
        id: 'walk',
        label: t('沿着河再多走一段', 'Walk a little further along the river'),
        effects: [
          { type: 'stat', key: 'health', delta: 4 },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
      },
    ],
  },
  {
    id: 'family-friends-leaving',
    title: t('少了一张椅子', 'One fewer chair'),
    text: t(
      '常聚的朋友搬去别的城市，晚餐少摆一张椅子，房间忽然有点空。',
      'A regular dinner guest moves to another city. With one fewer chair, the room feels unexpectedly empty.',
    ),
    weight: 2,
    once: true,
    when: [{ yearMin: 8 }],
    choices: [
      {
        id: 'visit',
        label: t('约好下次坐火车去看望', 'Arrange a visit by train'),
        effects: [
          { type: 'money', delta: -60 },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
      },
      {
        id: 'call',
        label: t('把每月通话写进日历', 'Put a monthly call in the calendar'),
        effects: [
          { type: 'stat', key: 'mood', delta: 2 },
          { type: 'stat', key: 'english', delta: 1 },
        ],
      },
    ],
  },
  {
    id: 'family-new-cafe',
    title: t('换了招牌的街角', 'A new sign on the corner'),
    text: t(
      '街角换了第三家咖啡馆，索菲娅已经能给新人讲这栋店面的历史。',
      'The corner has its third cafe. Sofia can now tell a newcomer the shopfront’s history.',
    ),
    weight: 2,
    once: true,
    when: [{ yearMin: 9 }],
    choices: [
      {
        id: 'coffee',
        label: t('买杯咖啡，看看新菜单', 'Buy a coffee and read the new menu'),
        effects: [
          { type: 'money', delta: -5 },
          { type: 'stat', key: 'mood', delta: 4 },
        ],
      },
      {
        id: 'chat',
        label: t(
          '和新店员聊聊这条街',
          'Chat to the new barista about the street',
        ),
        effects: [
          { type: 'stat', key: 'english', delta: 2 },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
      },
    ],
  },
  {
    id: 'family-ten-year-box',
    title: t('没拆完的最后一箱', 'The last unopened box'),
    text: t(
      '搬来时最后一箱终于打开，里面有旧充电器、婚礼卡片和一把不知哪里的钥匙。',
      'The last box from arrival finally opens: old chargers, wedding cards and a key neither can place.',
    ),
    weight: 2,
    once: true,
    when: [{ yearMin: 10 }],
    choices: [
      {
        id: 'keep',
        label: t(
          '留下卡片，把钥匙收好',
          'Keep the cards and put the key somewhere safe',
        ),
        effects: [{ type: 'stat', key: 'mood', delta: 6 }],
      },
      {
        id: 'album',
        label: t('和杰米整理一本小相册', 'Make a small album with Jamie'),
        effects: [{ type: 'stat', key: 'mood', delta: 5 }],
      },
    ],
  },
  {
    id: 'family-late-call',
    title: t('睡前的一通电话', 'A call before bed'),
    text: t(
      '家里的电话打来时英国已经很晚，索菲娅披着毯子坐到了窗边。',
      'The call from home comes late in Britain. Sofia wraps a blanket around herself and sits by the window.',
    ),
    weight: 2,
    once: true,
    choices: [
      {
        id: 'talk',
        label: t(
          '多聊一会儿，明天早点睡',
          'Talk a little longer and sleep early tomorrow',
        ),
        effects: [
          { type: 'stat', key: 'mood', delta: 5 },
          { type: 'stat', key: 'health', delta: -1 },
        ],
      },
      {
        id: 'arrange',
        label: t('约好周末再慢慢聊', 'Arrange a longer call at the weekend'),
        effects: [
          { type: 'stat', key: 'health', delta: 3 },
          { type: 'stat', key: 'mood', delta: 2 },
        ],
      },
    ],
  },
  {
    id: 'family-back-step',
    title: t('后门的小台阶', 'The step by the back door'),
    text: t(
      '难得没有急事的傍晚，两个人坐在后门台阶上，看蜗牛完成它的通勤。',
      'On an evening with nothing urgent, they sit on the back step and watch a snail finish its commute.',
    ),
    weight: 2,
    once: true,
    season: 2,
    choices: [
      {
        id: 'stay',
        label: t('就这样多坐一会儿', 'Stay sitting just like this'),
        effects: [{ type: 'stat', key: 'mood', delta: 5 }],
      },
      {
        id: 'tea',
        label: t('回屋泡茶，再出来坐', 'Make tea and come back outside'),
        effects: [
          { type: 'stat', key: 'mood', delta: 4 },
          { type: 'stat', key: 'health', delta: 2 },
        ],
      },
    ],
  },
];

export const familyPartner: Character = {
  id: 'family-partner',
  name: t('索菲娅·莫拉', 'Sofia Mora'),
  intro: t(
    '索菲娅于 2024 年中以英国公民杰米的伴侣身份来英，兼职年薪 £12,000，杰米年薪 £20,000。两人正在学着把班表、账单和晚饭放进同一本日历。只评估索菲娅本人，人物与事件均为虚构。',
    'Sofia arrived in mid-2024 as British citizen Jamie’s partner. She earns £12,000 part-time and Jamie earns £20,000. They are learning to fit shifts, bills and dinner into one calendar. Only Sofia is assessed; all characters and events are fictional.',
  ),
  sprite: 'characters/7.png',
  startDate: '2025-06-15',
  timeline: {
    dateOfBirth: '1993-02-14',
    nationality: 'BRA',
    episodes: [
      {
        route: 'FAMILY_PARTNER_OR_PARENT',
        role: 'MAIN',
        familyPermission: 'PARTNER_FIVE_YEAR',
        validFrom: '2024-06-15',
        validTo: '2026-12-14',
        salary: 12000,
      },
    ],
    absences: [],
    incomeYears: [
      { taxYear: '2024-25', earnings: 12000, partnerEarnings: 20000 },
      { taxYear: '2025-26', earnings: 12000, partnerEarnings: 20000 },
    ],
    benefits: [],
    relationships: [{ type: 'PARTNER', otherPartyStatus: 'BRITISH_CITIZEN' }],
    english: { cefrLevel: 'B1' },
    cashSavings: 0,
    partnerSpecifiedBenefit: false,
    criminalRecord: [],
    immigrationBreaches: [],
    governmentDebt: { outstanding: false },
  },
  stats: { money: 16000, mood: 70, health: 76, english: 45, career: 16 },
  events,
};
