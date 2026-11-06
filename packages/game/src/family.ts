import { balance as b } from './balance';
import type { GameEvent, Npc, Text } from './types';
const t = (zhCN: string, en: string): Text => ({ zhCN, en });
const dialogue: Record<string, [string, string][]> = {
  jamie: [
    [
      '杯子放原位了，这次把手朝着你。',
      'Your cup is back. Handle facing you this time.',
    ],
    [
      '收音机又只收到厨房的杂音。',
      'The radio is picking up kitchen noises again.',
    ],
    [
      '面包太硬了，我得先和刀商量。',
      'Bread is hard. I need a word with the knife first.',
    ],
    [
      '你的拖鞋在沙发边，没被吸尘器带走。',
      'Your slippers are by the sofa. The vacuum spared them.',
    ],
    [
      '今晚锅盖都找齐了，算个好开头。',
      'Found every saucepan lid tonight. A good start.',
    ],
    [
      '袜子又少一只，要给洗衣机写信吗？',
      'Another sock missing. Shall we write to the washing machine?',
    ],
    [
      '我把账单夹好了，食谱没夹进去。',
      'Bills filed. No recipes among them this time.',
    ],
    [
      '这张桌子总往我这边倒茶。',
      'This table keeps spilling tea in my direction.',
    ],
    [
      '旧照片里的围巾，我还找得到。',
      'I can still find the scarf in that old photograph.',
    ],
    [
      '晚饭留着呢，先把湿外套脱下来。',
      'Dinner is saved. Get that wet coat off first.',
    ],
    [
      '春天的球根长了，我今天没去掀土看。',
      'Spring bulbs are growing. I resisted digging to check today.',
    ],
    [
      '夏天的窗帘太薄，太阳老赖床。',
      'Summer curtains are too thin. The sun will not go to bed.',
    ],
    [
      '落叶进了玄关，鞋子像带回来一个公园。',
      'Leaves in the hall. Our shoes brought home a park.',
    ],
    [
      '冬天我把毯子挪到你那边了。',
      'Moved the blanket to your side for winter.',
    ],
    [
      '雨衣挂稳了，地板还在等它道歉。',
      'Raincoat hung up. The floor still awaits its apology.',
    ],
    [
      '太阳照着餐桌，今天不用找那盏小灯。',
      'Sun on the table. No need to find the little lamp today.',
    ],
    ['雪天先看窗外吧，茶我来倒。', 'Watch the snow. I will pour the tea.'],
    [
      '周末难得都闲着，电影挑短一点的？',
      'A rare free weekend. Shall we choose a shorter film?',
    ],
    [
      '我把明天的提醒写好了，没再画成纪念日。',
      "Tomorrow's reminder is written. No anniversary doodle this time.",
    ],
    [
      '和你坐着，水壶慢一点也没关系。',
      'Sitting with you, I do not mind the slow kettle.',
    ],
    [
      '上次你笑的那段，我今天才懂。',
      'Finally understood the bit you laughed at last time.',
    ],
    [
      '我们那张糊照片，我反倒最喜欢。',
      'That blurred photograph of us is my favourite.',
    ],
    [
      '书架空出一格，给我们以后带回的东西。',
      'A shelf cleared for things we will bring home later.',
    ],
    [
      '这把椅子给你，我坐会吱呀的那把。',
      'You take this chair. I will have the squeaky one.',
    ],
    [
      '今天不想赶路，陪我把茶喝完吧。',
      'No rushing today. Stay until we finish the tea.',
    ],
    [
      '办公室的杯子拿回家，放哪都不顺手。',
      'The office mug feels out of place at home.',
    ],
    [
      '表格先放一边，我想把这口茶喝热。',
      'Forms aside for a moment. I want this tea while it is hot.',
    ],
    [
      '夜灯的开关找到了，原来被小袜子盖住。',
      'Found the night light switch. Tiny socks were covering it.',
    ],
    [
      '新班表我贴上了，没挡住你的便签。',
      'New rota up. I left your note visible.',
    ],
    [
      '今天走楼梯得慢一点，扶手擦干净了。',
      'Stairs slowly today. The handrail is clean.',
    ],
  ],
  'ka-ning-partner': [
    [
      '嘉宁，饭盒在最上层，别又拿成孩子的。',
      "Ka Ning, your lunch is on top. Do not take the child's again.",
    ],
    [
      '这把伞装得下两个人，装不下两只包。',
      'This umbrella fits two people, but not two bags.',
    ],
    [
      '我把简历收起来了，餐桌今晚能吃饭。',
      'CV put away. The dinner table can host dinner tonight.',
    ],
    [
      '旧车票没扔，在装相片的小盒子里。',
      'Kept the old tickets in the photograph box.',
    ],
    [
      '电饭锅响了，我以为有人按门铃。',
      'The rice cooker beeped. Thought it was the doorbell.',
    ],
    [
      '今天在菜里多放了颜色，孩子先挑红的。',
      'More colour in dinner. The child chose the red bits first.',
    ],
    [
      '接送表贴稳了，磁铁终于有正经事做。',
      'School-run rota secured. The magnets finally have a job.',
    ],
    [
      '家里的电话我来拨，你先把茶喝了。',
      'I will call home. Finish your tea first.',
    ],
    [
      '那件外套我缝好了，针线还在找出口。',
      'Mended the coat. Still finding a home for the needle.',
    ],
    [
      '窗台的葱又长了，孩子已经准备收租。',
      'The spring onions grew. The child is preparing to charge rent.',
    ],
    [
      '春天的鞋柜总多出一层泥。',
      'The shoe rack gains a layer of mud every spring.',
    ],
    [
      '夏天我把厚被收了，箱子比人还热。',
      'Packed the winter duvet. The box is warmer than we are.',
    ],
    [
      '秋叶夹在书里，借书还得先检查。',
      'Autumn leaves in books. Better check before returning them.',
    ],
    [
      '冬天那只保温杯，终于不用等人想起。',
      'In winter the flask finally gets remembered.',
    ],
    [
      '雨把肩膀淋湿了，回家先换件衣服。',
      'Rain soaked my shoulder. A dry shirt first at home.',
    ],
    [
      '太阳一出来，洗衣篮就有了野心。',
      'Sunshine gives the laundry basket ambitions.',
    ],
    [
      '雪天在窗边看一会儿，别忘了关烤箱。',
      'Watch the snow from the window. Remember the oven though.',
    ],
    [
      '周末一起把漏风的门缝找出来？',
      'Shall we find the draught in the door this weekend?',
    ],
    [
      '今天学到个新菜名，晚饭先不考你。',
      'Learnt a new dish name. No dinner test for you yet.',
    ],
    [
      '你那杯茶我记得，不用再问一遍。',
      'I remember your tea. No need to ask again.',
    ],
    [
      '这条路走熟了，我还是喜欢跟你并排。',
      'I know the route now. Still like walking beside you.',
    ],
    [
      '相册给你留了一页，等下回一起挑。',
      'A page saved in the album. We can choose pictures later.',
    ],
    [
      '厨房安静下来了，我想再坐一会儿。',
      'Kitchen quiet at last. I fancy sitting a little longer.',
    ],
    [
      '你皱眉的时候，我把计算器拿远一点。',
      'When you frown, I move the calculator a little further away.',
    ],
    [
      '慢慢吃吧，今天没人在门口等接送。',
      'Eat slowly. Nobody is waiting for a school run now.',
    ],
    [
      '录用信先放好了，今晚想煮点特别的。',
      'Offer letter put away. Something special for dinner tonight.',
    ],
    [
      '找工作的页面关了，眼睛得看看别的。',
      'Closed the job listings. My eyes need something else.',
    ],
    [
      '闹钟又得响早一点，先找齐两只鞋。',
      'The alarm needs an earlier start. Matching shoes first.',
    ],
    [
      '我们来时那只箱子，还装得下旧地图。',
      'The suitcase we arrived with still holds the old map.',
    ],
    [
      '名字写在信箱里了，胶带还贴得很歪。',
      'Names in the letterbox. The tape is still crooked.',
    ],
  ],
  'ka-ning-child': [
    [
      '我把书拿正了，故事会不会变快？',
      'Book the right way up now. Will the story go faster?',
    ],
    [
      '午饭想有三种颜色，土豆只算一种。',
      'Three colours in lunch please. Potato only counts as one.',
    ],
    [
      '我的鞋没变小，是脚偷偷加班。',
      'My shoes did not shrink. My feet worked overtime.',
    ],
    [
      '画里的猫不是猫，是还没画完的老虎。',
      'Not a cat in my drawing. An unfinished tiger.',
    ],
    [
      '葱长高了，我的农场需要更大窗台。',
      'The onions grew. My farm needs a bigger windowsill.',
    ],
    ['那片叶子给我留着，它像一只手。', 'Save that leaf. It looks like a hand.'],
    [
      '这本书封面好像饼干，可以先读它吗？',
      'This cover looks like a biscuit. Can we read it first?',
    ],
    [
      '我找到蓝毛衣了，名字倒着也认得。',
      'Found the blue jumper. Recognise my name upside down too.',
    ],
    [
      '这张通知没折成船，老师会高兴吗？',
      'Did not fold this note into a boat. Will the teacher be pleased?',
    ],
    [
      '画一张菜单吧，我想把晚饭圈出来。',
      'Draw a menu. I want to circle dinner.',
    ],
    [
      '春天的小花不肯排队，草地上到处都是。',
      'Spring flowers will not queue. They are all over the grass.',
    ],
    [
      '夏天的太阳为什么还不下班？',
      'Why has the summer sun not clocked off yet?',
    ],
    [
      '秋叶夹好了，明天看看有没有变薄。',
      'Leaves pressed. Tomorrow we can see if they got thinner.',
    ],
    [
      '冬天哈气像冒烟，我是小火车。',
      'Winter breath looks like smoke. I am a little train.',
    ],
    [
      '雨在窗上赛跑，我挑最慢的那滴。',
      'Rain racing on the window. I picked the slowest drop.',
    ],
    [
      '太阳晒着地毯，猫会不会抢座位？',
      'Sun on the rug. Will the cat claim the seat?',
    ],
    [
      '雪地脚印是我画的路，还没画完。',
      'My footprints are a road in the snow. Not finished yet.',
    ],
    [
      '周末可以走公园那条长一点的路吗？',
      'Can we take the longer park route this weekend?',
    ],
    [
      '我今天想读你那页，不挑最短的。',
      'I want your page today. Not choosing the shortest.',
    ],
    [
      '你坐旁边，我就敢把这个词念出来。',
      'Sit beside me and I can say this word aloud.',
    ],
    [
      '这张画给你，别放在账单下面。',
      'This drawing is for you. Not underneath the bills please.',
    ],
    [
      '我给你留了最大的那块，边上有点歪。',
      'Saved you the biggest piece. A bit crooked at the edge.',
    ],
    [
      '今天的事先讲给你，不想讲给手机。',
      "Today's story is for you first, not the phone.",
    ],
    [
      '把书签放这儿，我们明晚从这里接着。',
      'Bookmark here. Tomorrow night we start from this spot.',
    ],
    [
      '你猜我长高了吗？门框上的线会说。',
      'Guess if I grew. The marks on the doorframe know.',
    ],
    [
      '给外婆发照片，我来挑笑得最大的。',
      'Send Granny a photo. I will choose the biggest smile.',
    ],
    [
      '我的树要排练，风来的时候不能乱跑。',
      'My tree needs rehearsal. It must not run when the wind comes.',
    ],
    [
      '豆袋掉了，再捡起来也能继续跑。',
      'Dropped the beanbag. Can pick it up and keep running.',
    ],
    [
      '学校那张照片，我少了牙还笑得最多。',
      'In the school photo I have fewer teeth and the biggest smile.',
    ],
    [
      '今晚再讲一遍吧，换我学鸭子叫。',
      'That story again tonight. My turn for the duck noises.',
    ],
  ],
};
const members: [string, string, string, string, string[]][] = [
  ['jamie', '杰米', 'Jamie', 'family-partner', ['tea', 'baked-potato']],
  [
    'ka-ning-partner',
    '许文舒',
    'Man Shu Hui',
    'hong-kong-bno',
    ['flowers', 'salad'],
  ],
  [
    'ka-ning-child',
    '陈乐言',
    'Lok Yin Chan',
    'hong-kong-bno',
    ['cake', 'strawberry-jam'],
  ],
];
export const familyNpcs: Npc[] = members.map(
  ([id, zhCN, en, character, loved]) => ({
    id,
    name: t(zhCN, en),
    role: t(
      id === 'jamie'
        ? '索菲娅的伴侣'
        : id.endsWith('child')
          ? '嘉宁的孩子'
          : '嘉宁的伴侣',
      id === 'jamie'
        ? 'Sofia’s partner'
        : id.endsWith('child')
          ? 'Ka Ning’s child'
          : 'Ka Ning’s partner',
    ),
    characters: [character],
    schedule: [
      {
        festival: true,
        stops: [
          { from: 0, at: 'home' },
          { from: 540, at: 'green-stall' },
          { from: 1080, at: 'green' },
          { from: 1320, at: 'home' },
        ],
      },
      { weather: ['rain', 'snow'], stops: [{ from: 0, at: 'home' }] },
      {
        dayKinds: ['workday'],
        stops: [
          { from: 0, at: 'home' },
          { from: 840, at: 'shop' },
          { from: 960, at: 'home' },
        ],
      },
      {
        dayKinds: ['weekend', 'special'],
        stops: [
          { from: 0, at: 'home' },
          { from: 660, at: 'park-path' },
          { from: 780, at: 'home' },
        ],
      },
    ],
    gifts: {
      loved,
      liked: ['tea', 'biscuits', 'tulip'].filter(
        (item) => !loved.includes(item),
      ),
      disliked: ['old-boot', 'shopping-trolley', 'pike'],
    },
    reactions: {
      loved: t(
        id.endsWith('child')
          ? '给我的？我要放在最喜欢的盘子里。'
          : '还记着我喜欢这个呢，过来一起坐。',
        id.endsWith('child')
          ? 'For me? My favourite plate for this.'
          : 'You remembered my favourite. Come and sit with me.',
      ),
      liked: t(
        '正好用得上，我给它腾个地方。',
        'Just what we need. I will make room for it.',
      ),
      neutral: t(
        '谢谢想着我，先放桌上吧。',
        'Thanks for thinking of me. On the table for now.',
      ),
      disliked: t(
        '这个味道，还是先放门外吧。',
        'That smell. Outside the door for now, perhaps.',
      ),
    },
    lines: dialogue[id].map(([zhCN, en], i) => ({
      id: `${id}-daily-${i + 1}`,
      text: t(zhCN, en),
    })),
  }),
);
for (const npc of familyNpcs) {
  for (const [i, season] of [
    [10, 2],
    [11, 3],
    [12, 4],
    [13, 1],
  ] as const)
    npc.lines[i].season = season;
  npc.lines[14].weather = ['rain'];
  npc.lines[15].weather = ['sunny'];
  npc.lines[16].weather = ['snow'];
  npc.lines[17].dayKinds = ['weekend'];
  for (let i = 19; i < 24; i++)
    npc.lines[i].heartsMin = i < 21 ? 2 : i < 23 ? 4 : 6;
}
familyNpcs[0].lines[25].requires = ['family-jamie-unemployed'];
familyNpcs[0].lines[26].requires = ['family-pip-advice'];
familyNpcs[0].lines[27].requires = ['family-baby-arrived'];
familyNpcs[0].lines[28].requires = ['family-full-time'];
familyNpcs[0].lines[29].requires = ['family-pip-advice'];
familyNpcs[1].lines[25].requires = ['bno-partner-working'];
familyNpcs[1].lines[26].requires = ['bno-partner-between-jobs'];
familyNpcs[1].lines[27].requires = ['bno-partner-working'];
const moments: [
  string,
  number,
  string,
  string,
  string,
  string,
  string,
  string,
][] = [
  [
    'jamie',
    2,
    '没合上的食谱',
    'The open recipe book',
    '杰米用杯子压住食谱，你扶着锅，他终于腾出手翻页。',
    'Jamie holds the recipe open with a mug. You steady the pan so he can turn the page.',
    '一起试一遍',
    'Try the recipe together',
  ],
  [
    'jamie',
    6,
    '两把旧椅子',
    'Two old chairs',
    '杰米擦干后门的两把椅子，把吱呀较轻的那把推给你。',
    'Jamie dries two chairs by the back door and slides the quieter one towards you.',
    '坐到天暗下来',
    'Sit until dusk',
  ],
  [
    'ka-ning-partner',
    2,
    '简历背面的猫',
    'The cat behind the CV',
    '文舒翻过旧简历，孩子画的猫露出来。你们把它从废纸里挑出来。',
    'Man Shu turns over an old CV, revealing the child’s cat. You rescue it from the scrap paper.',
    '把猫贴到冰箱',
    'Put the cat on the fridge',
  ],
  [
    'ka-ning-partner',
    6,
    '窗边的两杯茶',
    'Two cups by the window',
    '孩子睡下，文舒把计算器收进抽屉，给你留了窗边的位置。',
    'Once the child is asleep, Man Shu puts the calculator away and saves you the window seat.',
    '慢慢喝完这杯茶',
    'Take time over tea',
  ],
  [
    'ka-ning-child',
    2,
    '倒过来的书签',
    'The upside-down bookmark',
    '乐言把书递给你，自己挪出半张坐垫，这次先检查了封面的方向。',
    'Lok Yin offers you the book and half the cushion, checking the cover is the right way up.',
    '轮流读故事',
    'Take turns reading',
  ],
  [
    'ka-ning-child',
    6,
    '门框上的新线',
    'A new mark on the frame',
    '乐言站到门框旁，伸手压平头发，等你在旧线旁添上今天的日期。',
    'Lok Yin smooths down their hair by the doorframe, waiting for you to date a new pencil mark.',
    '写好日期再拍照',
    'Date the mark and take a photo',
  ],
];
export const familyHeartEvents: GameEvent[] = moments.map(
  ([npc, hearts, title, titleEn, zhCN, en, label, labelEn]) => ({
    id: `heart-${npc}-${hearts}`,
    title: t(title, titleEn),
    text: t(zhCN, en),
    weight: 1,
    once: true,
    channel: `npc:${npc}`,
    speaker: npc,
    heart: { npc, hearts },
    choices: [
      {
        id: 'stay',
        label: t(label, labelEn),
        effects: [
          { type: 'stat', key: 'mood', delta: b.heartMood },
          { type: 'friendship', npc, delta: b.talkFriendship },
        ],
      },
      {
        id: 'help',
        label: t('收好这一刻的小东西', 'Keep a small reminder'),
        effects: [
          { type: 'stat', key: 'health', delta: b.heartHelp },
          { type: 'friendship', npc, delta: b.talkFriendship },
        ],
      },
    ],
  }),
);
