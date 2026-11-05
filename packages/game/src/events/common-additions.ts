import type { GameEvent } from '../types';

// Fictional costs and personal incidents; these are not policy thresholds.
export const additionalCommonEvents: GameEvent[] = [
  {
    id: 'common-library-card',
    weight: 2,
    once: true,
    season: 2,
    title: { zhCN: '借书证上的名字', en: 'A name on a library card' },
    text: {
      zhCN: '图书馆员艾莉帮你念准街名，打印机在旁边吐出一长条收据。',
      en: 'Ellie at the library helps with the street name while the printer produces a very long receipt.',
    },
    choices: [
      {
        id: 'join',
        label: { zhCN: '留下聊聊新书', en: 'Stay and talk about new books' },
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
        sets: ['friend-library'],
      },
      {
        id: 'home',
        label: { zhCN: '借本书回家', en: 'Take a book home' },
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
      },
    ],
  },
  {
    id: 'common-library-table',
    weight: 3,
    once: true,
    requires: ['friend-library'],
    title: { zhCN: '靠窗的座位', en: 'The window seat' },
    text: {
      zhCN: '艾莉给你留了读书会的位置，窗外的鸽子也像在听。',
      en: 'Ellie saves you a reading-group seat; even the pigeon outside seems to be listening.',
    },
    choices: [
      {
        id: 'read',
        label: { zhCN: '读出喜欢的一段', en: 'Read a favourite passage aloud' },
        effects: [
          { type: 'stat', key: 'english', delta: 3 },
          { type: 'stat', key: 'mood', delta: 2 },
        ],
      },
      {
        id: 'listen',
        label: {
          zhCN: '听完再帮忙收椅子',
          en: 'Listen, then help stack the chairs',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 5 }],
      },
    ],
  },
  {
    id: 'common-seed-swap',
    weight: 2,
    once: true,
    season: 2,
    title: { zhCN: '写错的种子袋', en: 'The wrong seed label' },
    text: {
      zhCN: '社区花园的山姆把西葫芦写成了黄瓜，大家决定等收成揭晓。',
      en: 'Sam at the allotment labels courgettes as cucumbers; everyone agrees to let the harvest settle it.',
    },
    choices: [
      {
        id: 'join',
        label: { zhCN: '和山姆一起播种', en: 'Plant with Sam' },
        effects: [{ type: 'stat', key: 'health', delta: 3 }],
        sets: ['friend-garden'],
      },
      {
        id: 'watch',
        label: { zhCN: '买束花带回家', en: 'Take home a bunch of flowers' },
        effects: [
          { type: 'money', delta: -8 },
          { type: 'stat', key: 'mood', delta: 5 },
        ],
      },
    ],
  },
  {
    id: 'common-courgette-harvest',
    weight: 3,
    once: true,
    season: 3,
    requires: ['friend-garden'],
    title: { zhCN: '巨大的答案', en: 'A very large answer' },
    text: {
      zhCN: '山姆提来一根巨大的西葫芦，种子袋的悬案终于结了。',
      en: 'Sam brings an enormous courgette, finally solving the mystery of the seed packet.',
    },
    choices: [
      {
        id: 'cook',
        label: { zhCN: '约好一起煮汤', en: 'Make soup together' },
        effects: [
          { type: 'money', delta: -6 },
          { type: 'stat', key: 'mood', delta: 5 },
          { type: 'stat', key: 'english', delta: 2 },
        ],
      },
      {
        id: 'share',
        label: { zhCN: '切好分给邻居', en: 'Share it with neighbours' },
        effects: [{ type: 'stat', key: 'mood', delta: 4 }],
      },
    ],
  },
  {
    id: 'common-spare-key',
    weight: 2,
    once: true,
    title: { zhCN: '隔壁的备用钥匙', en: 'The spare key next door' },
    text: {
      zhCN: '邻居诺拉出门时把钥匙锁在屋里，猫隔着玻璃看热闹。',
      en: 'Nora locks herself out next door; the cat watches the drama through the glass.',
    },
    choices: [
      {
        id: 'help',
        label: { zhCN: '陪诺拉等锁匠', en: 'Wait with Nora for the locksmith' },
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
        sets: ['friend-neighbour'],
      },
      {
        id: 'tea',
        label: {
          zhCN: '递杯热茶再去上班',
          en: 'Bring tea before heading to work',
        },
        effects: [
          { type: 'money', delta: -2 },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
      },
    ],
  },
  {
    id: 'common-watering-rota',
    weight: 3,
    once: true,
    requires: ['friend-neighbour'],
    title: { zhCN: '窗台值班表', en: 'Windowsill duty' },
    text: {
      zhCN: '诺拉托你浇花，纸条写着少浇一点，下面画了三遍感叹号。',
      en: 'Nora asks you to water the plants, underlining “just a little” with three exclamation marks.',
    },
    choices: [
      {
        id: 'water',
        label: {
          zhCN: '照着纸条照顾盆栽',
          en: 'Follow the plant instructions',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 4 }],
      },
      {
        id: 'call',
        label: {
          zhCN: '打电话确认哪盆怕水',
          en: 'Call to check which plant dislikes water',
        },
        effects: [
          { type: 'stat', key: 'english', delta: 3 },
          { type: 'stat', key: 'mood', delta: 2 },
        ],
      },
    ],
  },
  {
    id: 'common-used-car',
    weight: 2,
    once: true,
    when: [{ yearMin: 2 }],
    title: { zhCN: '车窗上的售价', en: 'A price in the car window' },
    text: {
      zhCN: '二手车的后座很干净，卖家说唯一的毛病是收音机只爱一个台。',
      en: 'The used car has spotless rear seats; the seller says the radio only likes one station.',
    },
    choices: [
      {
        id: 'buy',
        label: { zhCN: '花 £2,800 买下代步', en: 'Buy it for £2,800' },
        effects: [
          { type: 'money', delta: -2800 },
          { type: 'stat', key: 'mood', delta: 5 },
        ],
        sets: ['used-car-bought'],
      },
      {
        id: 'bus',
        label: { zhCN: '把公交卡充好', en: 'Top up the bus card instead' },
        effects: [
          { type: 'money', delta: -60 },
          { type: 'stat', key: 'health', delta: 2 },
        ],
      },
    ],
  },
  {
    id: 'common-car-rattle',
    weight: 3,
    once: true,
    requires: ['used-car-bought'],
    title: { zhCN: '仪表盘的新灯', en: 'A new dashboard light' },
    text: {
      zhCN: '旧车亮起一盏不认识的灯，修车师傅听了一下就开始点头。',
      en: 'An unfamiliar light appears in the used car; the mechanic listens, then nods knowingly.',
    },
    choices: [
      {
        id: 'repair',
        label: { zhCN: '花 £420 修好再开', en: 'Pay £420 for the repair' },
        effects: [
          { type: 'money', delta: -420 },
          { type: 'stat', key: 'mood', delta: 2 },
        ],
      },
      {
        id: 'park',
        label: {
          zhCN: '先停开，花 £90 坐公交',
          en: 'Park it and spend £90 on buses',
        },
        effects: [
          { type: 'money', delta: -90 },
          { type: 'stat', key: 'mood', delta: -3 },
        ],
      },
    ],
  },
  {
    id: 'common-parking-envelope',
    weight: 2,
    once: true,
    when: [{ yearMin: 2 }],
    title: { zhCN: '挡风玻璃的信', en: 'Post on the windscreen' },
    text: {
      zhCN: '借车搬东西时停错了车位，黄色罚单比纸箱醒目。',
      en: 'While moving boxes in a borrowed car, you park in the wrong bay; the yellow notice stands out.',
    },
    choices: [
      {
        id: 'appeal',
        label: { zhCN: '带照片提出申诉', en: 'Appeal with photographs' },
        effects: [{ type: 'stat', key: 'mood', delta: -2 }],
        sets: ['parking-appealed'],
      },
      {
        id: 'pay',
        label: { zhCN: '付 £60 结清', en: 'Pay £60 and close it' },
        effects: [{ type: 'money', delta: -60 }],
      },
    ],
  },
  {
    id: 'common-parking-answer',
    weight: 3,
    once: true,
    requires: ['parking-appealed'],
    title: { zhCN: '申诉的回信', en: 'The appeal reply' },
    text: {
      zhCN: '停车申诉被驳回，你把回信放到钥匙旁，免得又忘了。',
      en: 'The parking appeal is rejected; you put the letter beside the keys so it cannot be forgotten.',
    },
    choices: [
      {
        id: 'pay',
        label: {
          zhCN: '付清 £60 停车罚款',
          en: 'Clear the £60 parking charge',
        },
        effects: [{ type: 'money', delta: -60 }],
      },
      {
        id: 'budget',
        label: { zhCN: '付清后取消一次外食', en: 'Pay, then skip a takeaway' },
        effects: [
          { type: 'money', delta: -45 },
          { type: 'stat', key: 'mood', delta: -2 },
        ],
      },
    ],
  },
  {
    id: 'common-tax-code-check',
    weight: 2,
    once: true,
    season: 2,
    title: { zhCN: '税码里的字母', en: 'Letters in the tax code' },
    text: {
      zhCN: '工资单的税码换了字母，午休时你和同事一起翻旧信。',
      en: 'A letter changes in the payslip tax code; you and a colleague compare old letters over lunch.',
    },
    choices: [
      {
        id: 'check',
        label: { zhCN: '联系 payroll 核对', en: 'Ask payroll to check' },
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
        sets: ['tax-code-checked'],
      },
      {
        id: 'later',
        label: {
          zhCN: '留好工资单，下次再查',
          en: 'Keep the payslip for another day',
        },
        effects: [{ type: 'stat', key: 'mood', delta: -2 }],
      },
    ],
  },
  {
    id: 'common-tax-code-refund',
    weight: 3,
    once: true,
    requires: ['tax-code-checked'],
    title: { zhCN: '多扣的那一笔', en: 'The overpayment comes back' },
    text: {
      zhCN: '核对后退回了一笔税，你盯着到账通知多看了两眼。',
      en: 'The check brings a tax refund; you read the payment notification twice.',
    },
    choices: [
      {
        id: 'save',
        label: { zhCN: '把 £180 留在账户', en: 'Keep the £180 in the account' },
        effects: [{ type: 'money', delta: 180 }],
      },
      {
        id: 'share',
        label: {
          zhCN: '留 £150，余下请同事吃饭',
          en: 'Keep £150 and treat the colleague',
        },
        effects: [
          { type: 'money', delta: 150 },
          { type: 'stat', key: 'mood', delta: 4 },
        ],
      },
    ],
  },
  {
    id: 'common-rent-review',
    weight: 2,
    once: true,
    when: [{ yearMin: 4 }],
    forbids: ['quarter-housing-change'],
    title: { zhCN: '新一轮租金邮件', en: 'Another rent review' },
    text: {
      zhCN: '续租邮件又到了，房东附件里的新租金比正文还长。',
      en: 'Another renewal email arrives; the new rent in the attachment takes more space than the message.',
    },
    choices: [
      {
        id: 'renew',
        label: { zhCN: '接受涨租，续住这里', en: 'Accept the rise and renew' },
        effects: [{ type: 'stat', key: 'mood', delta: -3 }],
        sets: ['quarter-housing-change', 'rent-rise-2'],
      },
      {
        id: 'negotiate',
        label: { zhCN: '约房东谈租期', en: 'Arrange to discuss the term' },
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
        sets: ['quarter-housing-change', 'rent-review-discussed'],
      },
    ],
  },
  {
    id: 'common-rent-signature',
    weight: 3,
    once: true,
    requires: ['rent-review-discussed'],
    forbids: ['quarter-housing-change'],
    title: { zhCN: '合同的最后一页', en: 'The last contract page' },
    text: {
      zhCN: '房东带来了新合同，茶喝完了，租金还是原来谈的那个数。',
      en: 'The landlord brings the new contract; the tea is gone, but the rent stays at the proposed figure.',
    },
    choices: [
      {
        id: 'renew',
        label: { zhCN: '按新租金续住', en: 'Renew at the new rent' },
        effects: [{ type: 'stat', key: 'mood', delta: -2 }],
        sets: ['quarter-housing-change', 'rent-rise-2'],
      },
      {
        id: 'move',
        label: { zhCN: '花 £600 搬到别处', en: 'Spend £600 moving elsewhere' },
        effects: [
          { type: 'money', delta: -600 },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
        sets: ['quarter-housing-change'],
      },
    ],
  },
  {
    id: 'common-meter-photo',
    weight: 2,
    once: true,
    season: 1,
    title: { zhCN: '电表的蜘蛛网', en: 'Cobwebs on the meter' },
    text: {
      zhCN: '暖气账单按估算来了，你打开电表柜，先和蜘蛛打了照面。',
      en: 'The heating bill uses an estimate; opening the meter cupboard introduces you to its spider.',
    },
    choices: [
      {
        id: 'submit',
        label: {
          zhCN: '拍照提交读数',
          en: 'Photograph and submit the reading',
        },
        effects: [{ type: 'stat', key: 'mood', delta: -1 }],
        sets: ['meter-reading-sent'],
      },
      {
        id: 'pay',
        label: {
          zhCN: '先付 £120 差额',
          en: 'Pay the £120 difference for now',
        },
        effects: [{ type: 'money', delta: -120 }],
      },
    ],
  },
  {
    id: 'common-meter-credit',
    weight: 3,
    once: true,
    requires: ['meter-reading-sent'],
    title: { zhCN: '重新算过的冬天', en: 'Winter, recalculated' },
    text: {
      zhCN: '真实读数换来了退款，客服最后问你对音乐等待是否满意。',
      en: 'The actual reading brings a refund; customer service asks how you enjoyed the hold music.',
    },
    choices: [
      {
        id: 'refund',
        label: { zhCN: '收回 £95 多付款', en: 'Recover the £95 overpayment' },
        effects: [{ type: 'money', delta: 95 }],
      },
      {
        id: 'blanket',
        label: {
          zhCN: '留 £65，再买条厚毯子',
          en: 'Keep £65 and buy a thick blanket',
        },
        effects: [
          { type: 'money', delta: 65 },
          { type: 'stat', key: 'health', delta: 3 },
        ],
      },
    ],
  },
  {
    id: 'common-walking-poster',
    weight: 2,
    once: true,
    season: 2,
    title: { zhCN: '鞋印海报', en: 'A poster with boot prints' },
    text: {
      zhCN: '公园贴着步行小组海报，路线图上咖啡馆占了一半位置。',
      en: 'The park walking-group poster devotes almost half its route map to cafés.',
    },
    choices: [
      {
        id: 'join',
        label: { zhCN: '报名周末一起走', en: 'Join the weekend walk' },
        effects: [{ type: 'stat', key: 'mood', delta: 2 }],
        sets: ['walking-group-joined'],
      },
      {
        id: 'solo',
        label: { zhCN: '自己走一小圈', en: 'Take a short walk alone' },
        effects: [{ type: 'stat', key: 'health', delta: 3 }],
      },
    ],
  },
  {
    id: 'common-muddy-boots',
    weight: 3,
    once: true,
    requires: ['walking-group-joined'],
    title: { zhCN: '鞋底的新地图', en: 'A map on the soles' },
    text: {
      zhCN: '步行小组绕完山坡，你的鞋底把整条泥路带回了家。',
      en: 'After the group hill walk, your boots bring most of the muddy path home.',
    },
    choices: [
      {
        id: 'finish',
        label: {
          zhCN: '走完全程再慢慢洗鞋',
          en: 'Finish the route, then clean the boots',
        },
        effects: [
          { type: 'stat', key: 'health', delta: 5 },
          { type: 'stat', key: 'english', delta: 2 },
        ],
      },
      {
        id: 'cafe',
        label: {
          zhCN: '中途花 £7 在咖啡馆等',
          en: 'Wait at the café with a £7 lunch',
        },
        effects: [
          { type: 'money', delta: -7 },
          { type: 'stat', key: 'mood', delta: 5 },
        ],
      },
    ],
  },
  {
    id: 'common-dental-call',
    weight: 2,
    once: true,
    when: [{ yearMin: 2 }],
    title: { zhCN: '牙科的回拨', en: 'The dental callback' },
    text: {
      zhCN: '牙科终于回电话了，你正含着一口特别烫的茶。',
      en: 'The dentist finally calls back just as you take a mouthful of very hot tea.',
    },
    choices: [
      {
        id: 'book',
        label: {
          zhCN: '放下茶杯预约检查',
          en: 'Put down the cup and book a check',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 1 }],
        sets: ['dental-check-booked'],
      },
      {
        id: 'later',
        label: { zhCN: '这次先错过电话', en: 'Miss this call for now' },
        effects: [{ type: 'stat', key: 'health', delta: -2 }],
      },
    ],
  },
  {
    id: 'common-dental-chair',
    weight: 3,
    once: true,
    requires: ['dental-check-booked'],
    title: { zhCN: '仰望天花板', en: 'Studying the ceiling' },
    text: {
      zhCN: '躺上牙椅才发现天花板贴着海报，比候诊室的杂志新多了。',
      en: 'From the dental chair you discover a ceiling poster much newer than the waiting-room magazines.',
    },
    choices: [
      {
        id: 'treat',
        label: { zhCN: '花 £85 完成治疗', en: 'Pay £85 for treatment' },
        effects: [
          { type: 'money', delta: -85 },
          { type: 'stat', key: 'health', delta: 6 },
        ],
      },
      {
        id: 'plan',
        label: {
          zhCN: '花 £35 检查后安排下次',
          en: 'Pay £35 for the check and plan treatment',
        },
        effects: [
          { type: 'money', delta: -35 },
          { type: 'stat', key: 'health', delta: 2 },
        ],
      },
    ],
  },
  {
    id: 'common-empty-calendar',
    weight: 2,
    once: true,
    when: [{ yearMin: 5, yearMax: 6 }],
    title: { zhCN: '日历上的重复', en: 'The repeating calendar' },
    text: {
      zhCN: '第五年的周一和上周一一样，连午饭盒都像复制来的。',
      en: 'A Monday in year five looks like the last one, right down to the identical lunchbox.',
    },
    choices: [
      {
        id: 'leave',
        label: {
          zhCN: '给自己安排一个空白周末',
          en: 'Leave a weekend completely blank',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
        sets: ['quiet-weekend-planned'],
      },
      {
        id: 'shift',
        label: { zhCN: '换条路去上班', en: 'Try a different route to work' },
        effects: [
          { type: 'stat', key: 'health', delta: 2 },
          { type: 'stat', key: 'mood', delta: 1 },
        ],
      },
    ],
  },
  {
    id: 'common-unplanned-saturday',
    weight: 3,
    once: true,
    requires: ['quiet-weekend-planned'],
    title: { zhCN: '没响的闹钟', en: 'An alarm that stays silent' },
    text: {
      zhCN: '那个空白周末终于到了，醒来时你先确认了一遍今天不用上班。',
      en: 'The blank weekend arrives; waking up, you check once more that there really is no work today.',
    },
    choices: [
      {
        id: 'sleep',
        label: {
          zhCN: '再睡一会儿，慢慢做早饭',
          en: 'Sleep a little longer, then make breakfast',
        },
        effects: [
          { type: 'stat', key: 'health', delta: 5 },
          { type: 'stat', key: 'mood', delta: 4 },
        ],
      },
      {
        id: 'coast',
        label: {
          zhCN: '花 £45 坐车去海边',
          en: 'Spend £45 on a trip to the coast',
        },
        effects: [
          { type: 'money', delta: -45 },
          { type: 'stat', key: 'mood', delta: 6 },
        ],
      },
    ],
  },
  {
    id: 'common-friend-departure',
    weight: 3,
    once: true,
    when: [{ yearMin: 8, yearMax: 9 }],
    title: { zhCN: '送别的纸杯', en: 'Paper cups at a farewell' },
    text: {
      zhCN: '第八年，老朋友要离开小镇，送别聚会又用上了当年那套纸杯。',
      en: 'In year eight an old friend leaves town; the farewell uses the same paper cups as the first party.',
    },
    choices: [
      {
        id: 'station',
        label: {
          zhCN: '送到车站，交换新地址',
          en: 'Go to the station and exchange addresses',
        },
        effects: [
          { type: 'money', delta: -12 },
          { type: 'stat', key: 'mood', delta: -3 },
        ],
        sets: ['friend-new-address'],
      },
      {
        id: 'call',
        label: { zhCN: '打个长电话道别', en: 'Say goodbye on a long call' },
        effects: [{ type: 'stat', key: 'mood', delta: -2 }],
      },
    ],
  },
  {
    id: 'common-friend-postcard',
    weight: 3,
    once: true,
    requires: ['friend-new-address'],
    title: { zhCN: '另一座城的雨', en: 'Rain in another city' },
    text: {
      zhCN: '离开的朋友寄来明信片，说那边也下雨，写到最后没地方签名。',
      en: 'The friend sends a postcard: it rains there too, and there is barely room left to sign it.',
    },
    choices: [
      {
        id: 'write',
        label: { zhCN: '回一张小镇的明信片', en: 'Send a town postcard back' },
        effects: [
          { type: 'money', delta: -4 },
          { type: 'stat', key: 'english', delta: 2 },
          { type: 'stat', key: 'mood', delta: 4 },
        ],
      },
      {
        id: 'video',
        label: { zhCN: '约好每月视频聊天', en: 'Arrange a monthly video call' },
        effects: [{ type: 'stat', key: 'mood', delta: 5 }],
      },
    ],
  },
  {
    id: 'common-first-kettle',
    weight: 2,
    once: true,
    when: [{ yearMax: 1 }],
    title: { zhCN: '第一壶热水', en: 'The first kettleful' },
    text: {
      zhCN: '新买的水壶烧开了，插座旁那张小镇地图还没展开。',
      en: 'The new kettle boils beside a town map you have not unfolded yet.',
    },
    choices: [
      {
        id: 'map',
        label: {
          zhCN: '喝完茶去认路',
          en: 'Have tea, then explore the streets',
        },
        effects: [
          { type: 'stat', key: 'health', delta: 3 },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
      },
      {
        id: 'home',
        label: { zhCN: '先把杯子摆好', en: 'Arrange the mugs first' },
        effects: [{ type: 'stat', key: 'mood', delta: 4 }],
      },
    ],
  },
  {
    id: 'common-red-postbox',
    weight: 2,
    once: true,
    when: [{ yearMax: 1 }],
    title: { zhCN: '邮筒的窄口', en: 'The narrow postbox slot' },
    text: {
      zhCN: '第一张寄回家的卡片塞进红邮筒，厚信封却卡住了一角。',
      en: 'Your first card home slides into the red postbox, but the thick envelope catches at one corner.',
    },
    choices: [
      {
        id: 'ask',
        label: {
          zhCN: '向路人问清收信时间',
          en: 'Ask a passer-by about collection times',
        },
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
      },
      {
        id: 'post',
        label: {
          zhCN: '去邮局窗口寄出',
          en: 'Take it to the post office counter',
        },
        effects: [
          { type: 'money', delta: -5 },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
      },
    ],
  },
  {
    id: 'common-supermarket-aisle',
    weight: 2,
    once: true,
    when: [{ yearMax: 1 }],
    title: { zhCN: '第三条过道', en: 'Aisle three' },
    text: {
      zhCN: '你终于找到米，顺手拿的东西却把购物篮装成了一次搬家。',
      en: 'You finally find the rice; a few extras turn the basket into a small house move.',
    },
    choices: [
      {
        id: 'list',
        label: {
          zhCN: '放回零食，按清单结账',
          en: 'Put back the snacks and stick to the list',
        },
        effects: [
          { type: 'money', delta: -25 },
          { type: 'stat', key: 'health', delta: 2 },
        ],
      },
      {
        id: 'try',
        label: {
          zhCN: '花 £40 试试新食材',
          en: 'Spend £40 trying unfamiliar ingredients',
        },
        effects: [
          { type: 'money', delta: -40 },
          { type: 'stat', key: 'mood', delta: 4 },
        ],
      },
    ],
  },
  {
    id: 'common-dark-afternoon',
    weight: 2,
    once: true,
    season: 1,
    title: { zhCN: '下午四点的灯', en: 'Lights at four' },
    text: {
      zhCN: '下午窗外就黑了，你开灯时差点以为自己睡过了晚饭。',
      en: 'It is already dark outside; switching on the light, you wonder whether you slept through dinner.',
    },
    choices: [
      {
        id: 'walk',
        label: {
          zhCN: '趁还有一点天光出去走',
          en: 'Catch the last daylight on a walk',
        },
        effects: [{ type: 'stat', key: 'health', delta: 3 }],
      },
      {
        id: 'call',
        label: {
          zhCN: '开灯给朋友打电话',
          en: 'Turn on a lamp and call a friend',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 4 }],
      },
    ],
  },
  {
    id: 'common-window-mould',
    weight: 2,
    once: true,
    season: 1,
    title: { zhCN: '窗边的黑点', en: 'Spots by the window' },
    text: {
      zhCN: '窗边冒出一排霉点，擦窗布比天气预报更懂湿度。',
      en: 'A line of mould appears by the window; the cleaning cloth knows more about damp than the forecast.',
    },
    choices: [
      {
        id: 'clean',
        label: {
          zhCN: '花 £20 清理并通知房东',
          en: 'Spend £20 cleaning and tell the landlord',
        },
        effects: [
          { type: 'money', delta: -20 },
          { type: 'stat', key: 'health', delta: 3 },
        ],
      },
      {
        id: 'ventilate',
        label: {
          zhCN: '先通风，今晚多盖一层',
          en: 'Air the room and add a blanket tonight',
        },
        effects: [{ type: 'stat', key: 'mood', delta: -2 }],
      },
    ],
  },
  {
    id: 'common-phone-at-midnight',
    weight: 2,
    once: true,
    title: { zhCN: '枕边的蓝光', en: 'Blue light on the pillow' },
    text: {
      zhCN: '手机说再看一条，你抬头时窗帘已经透亮了。',
      en: 'The phone promises just one more clip; by the time you look up, the curtains are glowing.',
    },
    choices: [
      {
        id: 'off',
        label: {
          zhCN: '今晚把手机放客厅',
          en: 'Leave the phone in the living room tonight',
        },
        effects: [{ type: 'stat', key: 'health', delta: 4 }],
      },
      {
        id: 'nap',
        label: { zhCN: '午休补一觉', en: 'Catch a nap at lunchtime' },
        effects: [
          { type: 'stat', key: 'health', delta: 2 },
          { type: 'stat', key: 'career', delta: -1 },
        ],
      },
    ],
  },
  {
    id: 'common-shoulder-stretch',
    weight: 2,
    once: true,
    when: [{ yearMin: 3 }],
    title: { zhCN: '耸起的肩膀', en: 'Shoulders by the ears' },
    text: {
      zhCN: '肩膀又酸起来，同事提醒你打字时看着像在躲雨。',
      en: 'Your shoulders ache again; a colleague says your typing posture looks like sheltering from rain.',
    },
    choices: [
      {
        id: 'stretch',
        label: {
          zhCN: '设提醒，起来拉伸',
          en: 'Set a reminder to stand and stretch',
        },
        effects: [{ type: 'stat', key: 'health', delta: 4 }],
      },
      {
        id: 'chair',
        label: {
          zhCN: '花 £90 换张二手椅',
          en: 'Spend £90 on a second-hand chair',
        },
        effects: [
          { type: 'money', delta: -90 },
          { type: 'stat', key: 'health', delta: 5 },
        ],
      },
    ],
  },
  {
    id: 'common-lunch-soup',
    weight: 2,
    once: true,
    season: 4,
    title: { zhCN: '保温杯的惊喜', en: 'A flask surprise' },
    text: {
      zhCN: '午饭打开保温杯，汤还是热的，昨天的疲惫忽然没那么大了。',
      en: 'The soup is still hot at lunchtime; yesterday’s tiredness suddenly feels a little smaller.',
    },
    choices: [
      {
        id: 'sit',
        label: {
          zhCN: '找个安静地方慢慢喝',
          en: 'Find somewhere quiet and take your time',
        },
        effects: [
          { type: 'stat', key: 'health', delta: 3 },
          { type: 'stat', key: 'mood', delta: 2 },
        ],
      },
      {
        id: 'share',
        label: {
          zhCN: '和忘带午饭的同事分一点',
          en: 'Share with the colleague who forgot lunch',
        },
        effects: [
          { type: 'stat', key: 'mood', delta: 4 },
          { type: 'stat', key: 'english', delta: 1 },
        ],
      },
    ],
  },
  {
    id: 'common-new-glasses',
    weight: 2,
    once: true,
    when: [{ yearMin: 3 }],
    title: { zhCN: '远处的公交号码', en: 'The distant bus number' },
    text: {
      zhCN: '眯眼也看不清公交号码，车来了才发现不是自己等的那班。',
      en: 'Squinting at the bus number does not help; only when it arrives do you see it is the wrong one.',
    },
    choices: [
      {
        id: 'glasses',
        label: {
          zhCN: '花 £140 验光配镜',
          en: 'Spend £140 on an eye test and glasses',
        },
        effects: [
          { type: 'money', delta: -140 },
          { type: 'stat', key: 'health', delta: 4 },
        ],
      },
      {
        id: 'check',
        label: { zhCN: '先花 £25 验光', en: 'Start with a £25 eye test' },
        effects: [
          { type: 'money', delta: -25 },
          { type: 'stat', key: 'health', delta: 1 },
        ],
      },
    ],
  },
  {
    id: 'common-autumn-gust',
    weight: 2,
    once: true,
    season: 4,
    title: { zhCN: '追帽子的下午', en: 'An afternoon chasing a hat' },
    text: {
      zhCN: '一阵风把帽子吹过停车场，你追到时它正卡在购物车里。',
      en: 'A gust sends your hat across the car park; you catch it resting in a trolley.',
    },
    choices: [
      {
        id: 'laugh',
        label: {
          zhCN: '笑着捡回来，继续走',
          en: 'Retrieve it with a laugh and keep walking',
        },
        effects: [
          { type: 'stat', key: 'health', delta: 2 },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
      },
      {
        id: 'cafe',
        label: {
          zhCN: '花 £4 躲进咖啡馆',
          en: 'Take shelter over a £4 coffee',
        },
        effects: [
          { type: 'money', delta: -4 },
          { type: 'stat', key: 'mood', delta: 4 },
        ],
      },
    ],
  },
  {
    id: 'common-spare-torch',
    weight: 2,
    once: true,
    season: 1,
    title: { zhCN: '抽屉里的手电筒', en: 'The torch in the drawer' },
    text: {
      zhCN: '准备冬天停电用品时，你找到三支手电筒，却没有一节合适的电池。',
      en: 'Preparing for winter outages, you find three torches and not a single battery that fits.',
    },
    choices: [
      {
        id: 'battery',
        label: {
          zhCN: '花 £9 买好电池',
          en: 'Spend £9 on the right batteries',
        },
        effects: [
          { type: 'money', delta: -9 },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
      },
      {
        id: 'charge',
        label: { zhCN: '先把充电宝充满', en: 'Charge the power bank for now' },
        effects: [{ type: 'stat', key: 'mood', delta: 2 }],
      },
    ],
  },
  {
    id: 'common-hay-fever',
    weight: 2,
    once: true,
    season: 3,
    title: { zhCN: '草地的问候', en: 'Greetings from the grass' },
    text: {
      zhCN: '草刚割完，你连打三个喷嚏，公园的夏天认出了你。',
      en: 'The grass has just been cut; three sneezes announce that summer has recognised you.',
    },
    choices: [
      {
        id: 'pharmacy',
        label: {
          zhCN: '花 £8 去药房问问',
          en: 'Spend £8 after asking the pharmacist',
        },
        effects: [
          { type: 'money', delta: -8 },
          { type: 'stat', key: 'health', delta: 3 },
        ],
      },
      {
        id: 'inside',
        label: {
          zhCN: '回家关窗休息',
          en: 'Go home, close the windows and rest',
        },
        effects: [
          { type: 'stat', key: 'health', delta: 2 },
          { type: 'stat', key: 'mood', delta: -1 },
        ],
      },
    ],
  },
  {
    id: 'common-car-insurance',
    weight: 2,
    once: true,
    requires: ['used-car-bought'],
    when: [{ yearMin: 3 }],
    title: { zhCN: '续保的惊叹号', en: 'An insurance surprise' },
    text: {
      zhCN: '车险续保报价高了一截，你对着邮件喝完了一整杯茶。',
      en: 'The car insurance renewal quote jumps; you finish a whole cup of tea staring at the email.',
    },
    choices: [
      {
        id: 'compare',
        label: {
          zhCN: '比价后花 £430 续保',
          en: 'Compare quotes and renew for £430',
        },
        effects: [{ type: 'money', delta: -430 }],
      },
      {
        id: 'renew',
        label: {
          zhCN: '花 £560 按原报价续保',
          en: 'Renew at the original £560 quote',
        },
        effects: [
          { type: 'money', delta: -560 },
          { type: 'stat', key: 'mood', delta: 2 },
        ],
      },
    ],
  },
  {
    id: 'common-car-tyres',
    weight: 2,
    once: true,
    requires: ['used-car-bought'],
    season: 4,
    title: { zhCN: '轮胎店的日历', en: 'The tyre-shop calendar' },
    text: {
      zhCN: '换胎店的日历还停在上个月，师傅倒把每条轮胎记得清清楚楚。',
      en: 'The tyre-shop calendar is a month behind, but the mechanic remembers every tyre.',
    },
    choices: [
      {
        id: 'replace',
        label: {
          zhCN: '花 £220 换掉磨损轮胎',
          en: 'Spend £220 replacing the worn tyres',
        },
        effects: [
          { type: 'money', delta: -220 },
          { type: 'stat', key: 'mood', delta: 2 },
        ],
      },
      {
        id: 'stop',
        label: {
          zhCN: '先停开，花 £70 坐公交',
          en: 'Stop driving and spend £70 on buses',
        },
        effects: [
          { type: 'money', delta: -70 },
          { type: 'stat', key: 'health', delta: 2 },
        ],
      },
    ],
  },
  {
    id: 'common-delayed-bus-refund',
    weight: 2,
    once: true,
    season: 2,
    title: { zhCN: '迟到的车和退款', en: 'A late bus and a refund' },
    text: {
      zhCN: '长途车迟到了，退款短信却准时出现在晚饭桌上。',
      en: 'The coach was late; its refund text arrives punctually at the dinner table.',
    },
    choices: [
      {
        id: 'save',
        label: {
          zhCN: '把 £22 留作下次车费',
          en: 'Save the £22 for the next fare',
        },
        effects: [{ type: 'money', delta: 22 }],
      },
      {
        id: 'snack',
        label: { zhCN: '留 £15，买点零食', en: 'Keep £15 and buy a snack' },
        effects: [
          { type: 'money', delta: 15 },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
      },
    ],
  },
  {
    id: 'common-winter-boots',
    weight: 2,
    once: true,
    season: 1,
    title: { zhCN: '进水的鞋', en: 'Leaking shoes' },
    text: {
      zhCN: '鞋底终于认输了，走到办公室时两只袜子已经提前洗过。',
      en: 'The soles finally give up; by the office, both socks have had an unexpected wash.',
    },
    choices: [
      {
        id: 'boots',
        label: {
          zhCN: '花 £75 买双防水鞋',
          en: 'Spend £75 on waterproof shoes',
        },
        effects: [
          { type: 'money', delta: -75 },
          { type: 'stat', key: 'health', delta: 3 },
        ],
      },
      {
        id: 'repair',
        label: { zhCN: '花 £18 补鞋底', en: 'Spend £18 repairing the soles' },
        effects: [
          { type: 'money', delta: -18 },
          { type: 'stat', key: 'mood', delta: 1 },
        ],
      },
    ],
  },
  {
    id: 'common-heater-timer',
    weight: 2,
    once: true,
    season: 4,
    title: { zhCN: '暖气定时器', en: 'The heating timer' },
    text: {
      zhCN: '暖气总在你出门后才开始认真工作，说明书像折坏的地图。',
      en: 'The heating works hardest after you leave; the instruction leaflet resembles a badly folded map.',
    },
    choices: [
      {
        id: 'set',
        label: { zhCN: '重新设置，省下 £35', en: 'Reset it and save £35' },
        effects: [
          { type: 'money', delta: 35 },
          { type: 'stat', key: 'english', delta: 1 },
        ],
      },
      {
        id: 'ask',
        label: {
          zhCN: '请房东来演示一次',
          en: 'Ask the landlord to demonstrate',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 2 }],
      },
    ],
  },
  {
    id: 'common-bin-calendar',
    weight: 2,
    once: true,
    title: { zhCN: '垃圾桶的颜色', en: 'The colours of the bins' },
    text: {
      zhCN: '节假日改了收垃圾时间，街上一排桶像排错队的合唱团。',
      en: 'The holiday changes bin collection day; the row outside looks like a choir in the wrong order.',
    },
    choices: [
      {
        id: 'ask',
        label: {
          zhCN: '和邻居核对收集日历',
          en: 'Check the collection calendar with a neighbour',
        },
        effects: [
          { type: 'stat', key: 'english', delta: 2 },
          { type: 'stat', key: 'mood', delta: 2 },
        ],
      },
      {
        id: 'sort',
        label: {
          zhCN: '照日历重新分好',
          en: 'Sort everything using the calendar',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
      },
    ],
  },
  {
    id: 'common-charity-jumper',
    weight: 2,
    once: true,
    season: 4,
    title: { zhCN: '袖子长一点', en: 'Sleeves a little too long' },
    text: {
      zhCN: '慈善店的毛衣很暖，袖子长得能顺便当手套。',
      en: 'The charity-shop jumper is warm, with sleeves long enough to double as gloves.',
    },
    choices: [
      {
        id: 'buy',
        label: { zhCN: '花 £6 把它带回家', en: 'Take it home for £6' },
        effects: [
          { type: 'money', delta: -6 },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
      },
      {
        id: 'chat',
        label: {
          zhCN: '聊聊款式，先不买',
          en: 'Chat about it without buying today',
        },
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
      },
    ],
  },
  {
    id: 'common-paperback-note',
    weight: 2,
    once: true,
    title: { zhCN: '旧书里的纸条', en: 'A note in a used book' },
    text: {
      zhCN: '二手小说里夹着旧购物清单，结局还没看，先知道了别人缺牛奶。',
      en: 'A used novel contains an old shopping list; before the ending, you learn someone needed milk.',
    },
    choices: [
      {
        id: 'read',
        label: { zhCN: '把这一章读完', en: 'Finish the chapter' },
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
      },
      {
        id: 'share',
        label: {
          zhCN: '把纸条拍给朋友看',
          en: 'Send a photo of the note to a friend',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
      },
    ],
  },
  {
    id: 'common-pub-quiz',
    weight: 2,
    once: true,
    season: 1,
    title: { zhCN: '答错也碰杯', en: 'Cheers for a wrong answer' },
    text: {
      zhCN: '酒吧问答轮到电影题，大家争了半天，把片名都争错了。',
      en: 'At the pub quiz film round, the team argues for ages and still names the wrong film.',
    },
    choices: [
      {
        id: 'guess',
        label: {
          zhCN: '花 £5 参加下一轮',
          en: 'Spend £5 joining the next round',
        },
        effects: [
          { type: 'money', delta: -5 },
          { type: 'stat', key: 'english', delta: 3 },
          { type: 'stat', key: 'mood', delta: 2 },
        ],
      },
      {
        id: 'watch',
        label: { zhCN: '喝水看大家争论', en: 'Watch the debate over water' },
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
      },
    ],
  },
  {
    id: 'common-phone-spelling',
    weight: 2,
    once: true,
    title: { zhCN: '电话里的字母表', en: 'The telephone alphabet' },
    text: {
      zhCN: '电话客服第三次问邮编，你开始给每个字母找一种水果。',
      en: 'Customer service asks for the postcode a third time; you start assigning a fruit to each letter.',
    },
    choices: [
      {
        id: 'repeat',
        label: {
          zhCN: '慢慢拼完再确认一次',
          en: 'Spell it slowly and confirm it',
        },
        effects: [{ type: 'stat', key: 'english', delta: 3 }],
      },
      {
        id: 'online',
        label: { zhCN: '改在线聊天办完', en: 'Finish through online chat' },
        effects: [
          { type: 'stat', key: 'english', delta: 1 },
          { type: 'stat', key: 'mood', delta: 2 },
        ],
      },
    ],
  },
  {
    id: 'common-local-radio',
    weight: 2,
    once: true,
    season: 2,
    title: { zhCN: '厨房里的路况', en: 'Traffic news in the kitchen' },
    text: {
      zhCN: '做饭时听本地广播，你第一次听懂堵车的是哪座桥。',
      en: 'While cooking to local radio, you understand for the first time exactly which bridge is blocked.',
    },
    choices: [
      {
        id: 'listen',
        label: { zhCN: '听完下一段访谈', en: 'Stay for the next interview' },
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
      },
      {
        id: 'music',
        label: { zhCN: '跟着下一首歌哼两句', en: 'Hum along to the next song' },
        effects: [{ type: 'stat', key: 'mood', delta: 4 }],
      },
    ],
  },
  {
    id: 'common-station-name',
    weight: 2,
    once: true,
    title: { zhCN: '站名怎么念', en: 'How to say the station name' },
    text: {
      zhCN: '售票员念出的站名比地图上短了一半，你们相视一笑。',
      en: 'The ticket clerk says the station name in half the syllables shown on the map; you share a smile.',
    },
    choices: [
      {
        id: 'learn',
        label: { zhCN: '请他再念一遍', en: 'Ask to hear it once more' },
        effects: [{ type: 'stat', key: 'english', delta: 3 }],
      },
      {
        id: 'write',
        label: { zhCN: '写在手机备忘录里', en: 'Save a note on the phone' },
        effects: [{ type: 'stat', key: 'english', delta: 1 }],
      },
    ],
  },
  {
    id: 'common-community-choir',
    weight: 2,
    once: true,
    season: 4,
    title: { zhCN: '跑调的第一排', en: 'The off-key front row' },
    text: {
      zhCN: '社区合唱排练缺人，你坐到第一排才发现没人要求唱得准。',
      en: 'The community choir needs singers; only in the front row do you discover perfect pitch is optional.',
    },
    choices: [
      {
        id: 'sing',
        label: { zhCN: '跟着歌词唱一遍', en: 'Sing along with the lyrics' },
        effects: [
          { type: 'stat', key: 'english', delta: 2 },
          { type: 'stat', key: 'mood', delta: 4 },
        ],
      },
      {
        id: 'chairs',
        label: {
          zhCN: '帮忙摆椅子，坐后面听',
          en: 'Set out chairs and listen from the back',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
      },
    ],
  },
  {
    id: 'common-museum-label',
    weight: 2,
    once: true,
    season: 3,
    title: { zhCN: '博物馆的小字', en: 'The museum small print' },
    text: {
      zhCN: '小镇博物馆很小，一台旧缝纫机的介绍倒写得像一本小说。',
      en: 'The town museum is tiny, but the label for one old sewing machine reads like a novel.',
    },
    choices: [
      {
        id: 'read',
        label: { zhCN: '把介绍读完', en: 'Read the whole label' },
        effects: [{ type: 'stat', key: 'english', delta: 2 }],
      },
      {
        id: 'ask',
        label: {
          zhCN: '问志愿者它是谁用过的',
          en: 'Ask the volunteer who used it',
        },
        effects: [
          { type: 'stat', key: 'english', delta: 2 },
          { type: 'stat', key: 'mood', delta: 2 },
        ],
      },
    ],
  },
  {
    id: 'common-bus-small-talk',
    weight: 2,
    once: true,
    title: { zhCN: '同一班车的人', en: 'Faces on the same bus' },
    text: {
      zhCN: '常坐同一班车的人今天主动打招呼，话题仍从天气开始。',
      en: 'A familiar face on the bus says hello today; naturally, the conversation starts with the weather.',
    },
    choices: [
      {
        id: 'talk',
        label: { zhCN: '聊聊周末去哪走走', en: 'Talk about weekend walks' },
        effects: [
          { type: 'stat', key: 'english', delta: 2 },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
      },
      {
        id: 'smile',
        label: {
          zhCN: '笑着问好，安静看窗外',
          en: 'Smile hello and watch the view',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 2 }],
      },
    ],
  },
  {
    id: 'common-book-club-biscuits',
    weight: 2,
    once: true,
    when: [{ yearMin: 3 }],
    title: { zhCN: '读书会的饼干', en: 'Book-club biscuits' },
    text: {
      zhCN: '读书会一半时间在聊书，另一半在猜谁烤的饼干。',
      en: 'Half the book club discusses the novel; the other half tries to identify the biscuit baker.',
    },
    choices: [
      {
        id: 'opinion',
        label: {
          zhCN: '说说自己不喜欢的结局',
          en: 'Explain why the ending did not work for you',
        },
        effects: [{ type: 'stat', key: 'english', delta: 3 }],
      },
      {
        id: 'recipe',
        label: { zhCN: '问问饼干怎么做', en: 'Ask for the biscuit recipe' },
        effects: [
          { type: 'stat', key: 'english', delta: 1 },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
      },
    ],
  },
  {
    id: 'common-year-five-box',
    weight: 2,
    once: true,
    when: [{ yearMin: 5, yearMax: 5 }],
    title: { zhCN: '没拆的最后一箱', en: 'The last unopened box' },
    text: {
      zhCN: '第五年才拆开最后一箱行李，里面的转接头已经不需要了。',
      en: 'In year five you open the last moving box; its plug adapter is no longer needed.',
    },
    choices: [
      {
        id: 'keep',
        label: {
          zhCN: '留一件旧物，其他整理掉',
          en: 'Keep one memento and sort the rest',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 4 }],
      },
      {
        id: 'sell',
        label: {
          zhCN: '卖掉闲置，收回 £40',
          en: 'Sell the unused things for £40',
        },
        effects: [
          { type: 'money', delta: 40 },
          { type: 'stat', key: 'mood', delta: 2 },
        ],
      },
    ],
  },
  {
    id: 'common-year-six-detour',
    weight: 2,
    once: true,
    when: [{ yearMin: 6, yearMax: 6 }],
    title: { zhCN: '闭着眼也认识的路', en: 'The road you know by heart' },
    text: {
      zhCN: '第六年，熟路修路了，你第一次发现背街还有一家面包店。',
      en: 'In year six roadworks divert your familiar route, revealing a bakery in the back street.',
    },
    choices: [
      {
        id: 'bread',
        label: {
          zhCN: '花 £5 买面包顺便聊天',
          en: 'Buy £5 of bread and have a chat',
        },
        effects: [
          { type: 'money', delta: -5 },
          { type: 'stat', key: 'english', delta: 2 },
          { type: 'stat', key: 'mood', delta: 3 },
        ],
      },
      {
        id: 'walk',
        label: { zhCN: '沿新路多走一会儿', en: 'Explore a little further' },
        effects: [{ type: 'stat', key: 'health', delta: 3 }],
      },
    ],
  },
  {
    id: 'common-year-seven-cafe',
    weight: 2,
    once: true,
    when: [{ yearMin: 7, yearMax: 7 }],
    title: { zhCN: '咖啡馆关门以后', en: 'After the café closes' },
    text: {
      zhCN: '第七年，常去的咖啡馆关了，你还会下意识走到旧门口。',
      en: 'In year seven your usual café closes, but your feet still take you to the old door.',
    },
    choices: [
      {
        id: 'new',
        label: {
          zhCN: '花 £5 试试街尾的新店',
          en: 'Spend £5 trying the new place',
        },
        effects: [
          { type: 'money', delta: -5 },
          { type: 'stat', key: 'mood', delta: 2 },
        ],
      },
      {
        id: 'home',
        label: {
          zhCN: '回家煮咖啡，给旧老板发祝福',
          en: 'Make coffee at home and wish the old owner well',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
      },
    ],
  },
  {
    id: 'common-year-eight-arrival',
    weight: 2,
    once: true,
    when: [{ yearMin: 8, yearMax: 8 }],
    title: { zhCN: '另一个问路的人', en: 'Someone else asking directions' },
    text: {
      zhCN: '第八年，有人拿着皱巴巴的地图问路，像极了刚来时的你。',
      en: 'In year eight someone asks directions with a creased map, much as you once did.',
    },
    choices: [
      {
        id: 'walk',
        label: { zhCN: '陪他走到公交站', en: 'Walk them to the bus stop' },
        effects: [
          { type: 'stat', key: 'mood', delta: 4 },
          { type: 'stat', key: 'english', delta: 1 },
        ],
      },
      {
        id: 'draw',
        label: { zhCN: '在地图上标出近路', en: 'Mark the shortcut on the map' },
        effects: [{ type: 'stat', key: 'mood', delta: 2 }],
      },
    ],
  },
  {
    id: 'common-year-nine-tree',
    weight: 2,
    once: true,
    when: [{ yearMin: 9, yearMax: 9 }],
    title: { zhCN: '树长高了', en: 'The tree has grown' },
    text: {
      zhCN: '第九年，门口新种的小树已经挡住路牌，你终于记得不用看路牌了。',
      en: 'In year nine the once-new tree hides the street sign; you realise you no longer need the sign.',
    },
    choices: [
      {
        id: 'photo',
        label: {
          zhCN: '拍下来发给老朋友',
          en: 'Send a photograph to an old friend',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 4 }],
      },
      {
        id: 'walk',
        label: {
          zhCN: '绕街区走一整圈',
          en: 'Walk a full lap of the neighbourhood',
        },
        effects: [{ type: 'stat', key: 'health', delta: 3 }],
      },
    ],
  },
  {
    id: 'common-year-ten-album',
    weight: 3,
    once: true,
    when: [{ yearMin: 10 }],
    title: { zhCN: '手机里的十年', en: 'Ten years in the camera roll' },
    text: {
      zhCN: '翻到第一年的照片，房间很空，杯子却还是今天用的那只。',
      en: 'In the first-year photographs the room looks empty, but the mug is still the one you use today.',
    },
    choices: [
      {
        id: 'album',
        label: {
          zhCN: '花 £25 印一本小相册',
          en: 'Spend £25 printing a small album',
        },
        effects: [
          { type: 'money', delta: -25 },
          { type: 'stat', key: 'mood', delta: 6 },
        ],
      },
      {
        id: 'call',
        label: {
          zhCN: '和家人一起翻照片',
          en: 'Look through the photographs with family',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 5 }],
      },
    ],
  },
  {
    id: 'common-duplicate-payment',
    weight: 2,
    once: true,
    when: [{ yearMin: 2 }],
    title: { zhCN: '账单付了两遍', en: 'The bill paid twice' },
    text: {
      zhCN: '同一张账单扣了两次，银行客服排队音乐循环得像首主题曲。',
      en: 'The same bill is taken twice; the bank hold music repeats like a personal theme tune.',
    },
    choices: [
      {
        id: 'recover',
        label: {
          zhCN: '等到接通，取回 £120',
          en: 'Wait for an adviser and recover £120',
        },
        effects: [
          { type: 'money', delta: 120 },
          { type: 'stat', key: 'mood', delta: -2 },
        ],
      },
      {
        id: 'online',
        label: {
          zhCN: '在线办好，今晚再核对',
          en: 'Resolve it online and check again tonight',
        },
        effects: [
          { type: 'money', delta: 120 },
          { type: 'stat', key: 'english', delta: 2 },
        ],
      },
    ],
  },
  {
    id: 'common-gutter-rain',
    weight: 2,
    once: true,
    season: 4,
    title: { zhCN: '屋檐的小瀑布', en: 'A waterfall at the gutter' },
    text: {
      zhCN: '雨水从堵住的排水槽泼下来，门口像多了一处迷你景点。',
      en: 'Rain pours from the blocked gutter, turning the doorstep into a miniature tourist attraction.',
    },
    choices: [
      {
        id: 'report',
        label: {
          zhCN: '拍照报修，绕后门出入',
          en: 'Report it with a photo and use the back door',
        },
        effects: [
          { type: 'stat', key: 'english', delta: 1 },
          { type: 'stat', key: 'mood', delta: 1 },
        ],
      },
      {
        id: 'neighbour',
        label: {
          zhCN: '和邻居一起联系房东',
          en: 'Contact the landlord with a neighbour',
        },
        effects: [{ type: 'stat', key: 'mood', delta: 3 }],
      },
    ],
  },
];
