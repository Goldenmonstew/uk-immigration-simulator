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
      '夏天的窗帘太薄，太阳总不肯下山。',
      'Summer curtains are too thin. The sun won’t go to bed.',
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
    ['雪天先看窗外吧，茶我来倒。', 'Watch the snow. I’ll pour the tea.'],
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
      'Sitting with you, I don’t mind the slow kettle.',
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
      'A shelf cleared for things we’ll bring home later.',
    ],
    [
      '沙发上的垫子翻好了，这面没有茶渍。',
      'I’ve turned the sofa cushion over. No tea stains on this side.',
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
      'Forms aside for a moment. I want this tea while it’s hot.',
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
      "Ka Ning, your lunch is on top. Don’t take the child's again.",
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
      'I’ll call home. Finish your tea first.',
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
      'I found the blue jumper. I can recognise my name upside down too.',
    ],
    [
      '这张通知没折成船，老师会高兴吗？',
      'I didn’t fold this note into a boat. Will the teacher be pleased?',
    ],
    [
      '画一张菜单吧，我想把晚饭圈出来。',
      'Draw a menu. I want to circle dinner.',
    ],
    [
      '春天的小花不肯排队，草地上到处都是。',
      'Spring flowers won’t queue. They’re all over the grass.',
    ],
    [
      '夏天的影子拉得好长，我快够到篱笆了。',
      'My summer shadow’s so long I can nearly reach the fence.',
    ],
    [
      '秋叶夹好了，明天看看有没有变薄。',
      'Leaves pressed. Tomorrow we can see if they got thinner.',
    ],
    [
      '冬天哈气像冒烟，我是小火车。',
      'Winter breath looks like smoke. I’m a little train.',
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
      'Send Granny a photo. I’ll choose the biggest smile.',
    ],
    [
      '我的树要排练，风来的时候不能乱跑。',
      'My tree needs rehearsal. It must not run when the wind comes.',
    ],
    [
      '豆袋掉了，再捡起来也能继续跑。',
      'I dropped the beanbag. I can pick it up and keep running.',
    ],
    [
      '学校那张照片，我少了牙还笑得最多。',
      'In the school photo I’ve got fewer teeth and the biggest smile.',
    ],
    [
      '今晚再讲一遍吧，换我学鸭子叫。',
      'That story again tonight. My turn for the duck noises.',
    ],
  ],
};
const householdReactions: Record<
  string,
  Pick<Npc['reactions'], 'liked' | 'neutral' | 'disliked'>
> = {
  jamie: {
    liked: t(
      '我把食谱挪开，给你带的东西腾个位置。',
      'I’ll move the recipe book and make room for this.',
    ),
    neutral: t(
      '你出门还想着我啊，先放杯子旁边。',
      'You thought of me while you were out. By my cup for now.',
    ),
    disliked: t(
      '这味道比我的炖菜还大胆，先搁门外吧。',
      'Bolder than my stew. Outside the door for now, eh?',
    ),
  },
  'ka-ning-partner': {
    liked: t(
      '正合心意，我把桌上那叠纸收一收。',
      'Lovely. I’ll clear that pile of papers off the table.',
    ),
    neutral: t(
      '收到啦，等我擦干手再好好看。',
      'Thank you. Let me dry my hands and have a proper look.',
    ),
    disliked: t(
      '先别放饭盒旁边，我拿个袋子装着。',
      'Away from the lunch boxes, please. I’ll fetch a bag.',
    ),
  },
  'ka-ning-child': {
    liked: t(
      '我要画下来，旁边写是你送的！',
      'I’ll draw it and write that it’s from you!',
    ),
    neutral: t(
      '这是给我的呀？我先给它起个名字。',
      'For me? I’ll give it a name first.',
    ),
    disliked: t(
      '它闻起来像池塘的袜子，可以住外面吗？',
      'It smells like pond socks. Can it live outside?',
    ),
  },
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
      // Schedule times are game settings, not working-time or school rules.
      ...(id === 'jamie'
        ? [
            {
              dayKinds: ['workday' as const],
              when: [{ flag: 'family-pip-applied' }],
              stops: [
                { from: 0, at: 'home' as const },
                { from: 720, at: 'park-path' as const },
                { from: 780, at: 'home' as const },
              ],
            },
          ]
        : []),
      ...(id.endsWith('child')
        ? []
        : [
            {
              dayKinds: ['workday' as const],
              when: [
                {
                  flag:
                    id === 'jamie'
                      ? 'family-jamie-reemployed'
                      : 'bno-partner-restarted',
                },
              ],
              stops: [
                { from: 0, at: 'home' as const },
                { from: 540, at: 'away' as const },
                { from: 1020, at: 'home' as const },
              ],
            },
            {
              dayKinds: ['workday' as const],
              when: [
                {
                  flag:
                    id === 'jamie'
                      ? 'family-jamie-unemployed'
                      : 'bno-partner-between-jobs',
                },
              ],
              stops: [
                { from: 0, at: 'home' as const },
                { from: 660, at: 'shop' as const },
                { from: 780, at: 'park-path' as const },
                { from: 900, at: 'home' as const },
              ],
            },
          ]),
      {
        dayKinds: ['workday'],
        stops: [
          { from: 0, at: 'home' },
          { from: 540, at: 'away' },
          { from: id.endsWith('child') ? 930 : 1020, at: 'home' },
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
      ...householdReactions[id],
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
familyNpcs[0].lines[4].when = [{ minuteMin: 1020 }];
familyNpcs[0].lines[9].weather = ['rain'];
familyNpcs[0].lines[9].when = [{ minuteMin: 1020 }];
familyNpcs[0].lines[25].forbids = ['family-jamie-reemployed'];
familyNpcs[1].lines[0].when = [{ minuteMax: 720 }];
familyNpcs[1].lines[24].dayKinds = ['weekend', 'special'];
for (const i of [25, 27])
  familyNpcs[1].lines[i].forbids = ['bno-partner-between-jobs'];
familyNpcs[1].lines[25].once = true;
familyNpcs[1].lines[26].forbids = ['bno-partner-restarted'];
familyNpcs[2].lines[26].season = 4;
familyNpcs[2].lines[27].season = 3;

const additionalLines: Record<string, Npc['lines']> = {
  jamie: [
    {
      id: 'jamie-daily-31',
      text: {
        zhCN: '下班把鞋带解开，今天总算不用赶了。',
        en: 'Laces undone after work. I can stop rushing now.',
      },
      dayKinds: ['workday'],
      when: [
        {
          minuteMin: 1020,
        },
      ],
      forbids: ['family-jamie-unemployed', 'family-pip-applied'],
    },
    {
      id: 'jamie-daily-32',
      text: {
        zhCN: '刚收工，先把收音机调到没有杂音的台。',
        en: 'Work finished. First, a station without the crackle.',
      },
      dayKinds: ['workday'],
      when: [
        {
          minuteMin: 1020,
        },
      ],
      forbids: ['family-jamie-unemployed', 'family-pip-applied'],
    },
    {
      id: 'jamie-daily-33',
      text: {
        zhCN: '下班路上想好炖菜，到了门口忘了配料。',
        en: 'Planned a stew on the way from work. Forgot the ingredients at the door.',
      },
      dayKinds: ['workday'],
      when: [
        {
          minuteMin: 1020,
        },
      ],
      forbids: ['family-jamie-unemployed', 'family-pip-applied'],
    },
    {
      id: 'jamie-daily-34',
      text: {
        zhCN: '刚回到家，外套口袋里还装着工牌。',
        en: 'Home from work. My staff pass is still in the coat pocket.',
      },
      dayKinds: ['workday'],
      when: [
        {
          minuteMin: 1020,
        },
      ],
      forbids: ['family-jamie-unemployed', 'family-pip-applied'],
    },
    {
      id: 'jamie-daily-35',
      text: {
        zhCN: '工作做完了，这会儿只想把洋葱切好。',
        en: 'Work done. Right now I only want to get this onion chopped.',
      },
      dayKinds: ['workday'],
      when: [
        {
          minuteMin: 1020,
        },
      ],
      forbids: ['family-jamie-unemployed', 'family-pip-applied'],
    },
    {
      id: 'jamie-daily-36',
      text: {
        zhCN: '下班以后这段安静，我想和你一起用。',
        en: 'I want to share this quiet bit after work with you.',
      },
      dayKinds: ['workday'],
      when: [
        {
          minuteMin: 1020,
        },
      ],
      forbids: ['family-jamie-unemployed', 'family-pip-applied'],
    },
    {
      id: 'jamie-daily-37',
      text: {
        zhCN: '还没找到工作，我试着不再盯着钟走。',
        en: 'Still between jobs. I’m trying not to watch the clock.',
      },
      requires: ['family-jamie-unemployed'],
      forbids: ['family-jamie-reemployed', 'family-pip-applied'],
    },
    {
      id: 'jamie-daily-38',
      text: {
        zhCN: '没上班的日子，买菜也想换条路走。',
        en: 'While I’m out of work, I’m trying a different route to the shops.',
      },
      requires: ['family-jamie-unemployed'],
      forbids: ['family-jamie-reemployed', 'family-pip-applied'],
    },
    {
      id: 'jamie-daily-39',
      text: {
        zhCN: '新工作下班了，我没再走到旧站台去。',
        en: 'Home from the new job. I didn’t wander to the old stop.',
      },
      requires: ['family-jamie-reemployed'],
      forbids: ['family-pip-applied'],
      dayKinds: ['workday'],
      when: [
        {
          minuteMin: 1020,
        },
      ],
    },
    {
      id: 'jamie-daily-40',
      text: {
        zhCN: '今天收工后有力气挑菜，想试试芜菁。',
        en: 'Finished work with enough energy to choose vegetables. Turnips, perhaps.',
      },
      requires: ['family-jamie-reemployed'],
      forbids: ['family-pip-applied'],
      dayKinds: ['workday'],
      when: [
        {
          minuteMin: 1020,
        },
      ],
    },
    {
      id: 'jamie-daily-41',
      text: {
        zhCN: '春天把窗开一点，炖菜香能走得远些。',
        en: 'A window ajar in spring lets the stew smell travel.',
      },
      season: 2,
    },
    {
      id: 'jamie-daily-42',
      text: {
        zhCN: '秋天的南瓜太大，案板只够放半个。',
        en: 'An autumn pumpkin. Only half fits on the chopping board.',
      },
      season: 4,
    },
    {
      id: 'jamie-daily-43',
      text: {
        zhCN: '雪把后门堵了一点，先从前门出去吧。',
        en: 'Snow’s edged against the back door. Front door today.',
      },
      weather: ['snow'],
    },
    {
      id: 'jamie-daily-44',
      text: {
        zhCN: '周末给炖菜留点时间，不靠拧大火来催它。',
        en: 'The weekend stew can take its time. No rushing it with a higher flame.',
      },
      dayKinds: ['weekend'],
    },
    {
      id: 'jamie-daily-45',
      text: {
        zhCN: '暂别工作后，下午的药盒换了个位置。',
        en: 'While I’m away from work, the afternoon pillbox has a new spot.',
      },
      requires: ['family-pip-applied'],
      when: [
        {
          minuteMin: 720,
          minuteMax: 1080,
        },
      ],
    },
    {
      id: 'jamie-daily-46',
      text: {
        zhCN: '上次歇脚后，我把常用的锅移到低处。',
        en: 'I’ve moved the everyday pans lower so I can reach them without climbing.',
      },
      requires: ['family-pip-advice'],
    },
    {
      id: 'jamie-daily-47',
      text: {
        zhCN: '这锅盐放稳了，轮到我听你讲今天。',
        en: 'Salt sorted. My turn to hear about your day.',
      },
      heartsMin: 2,
    },
    {
      id: 'jamie-daily-48',
      text: {
        zhCN: '你尝过的菜，我会在页边画一个小勾。',
        en: 'I put a small tick beside the dishes you’ve tasted.',
      },
      heartsMin: 2,
    },
    {
      id: 'jamie-daily-49',
      text: {
        zhCN: '灯还亮着，你想说话我就把书放下。',
        en: 'The light’s still on. If you want a chat, I’ll put the book down.',
      },
      heartsMin: 6,
      when: [
        {
          minuteMin: 1140,
        },
      ],
    },
    {
      id: 'jamie-daily-50',
      text: {
        zhCN: '这盘给你试味，失败也算我们一起的。',
        en: 'Taste this batch. If it’s a disaster, it’s ours together.',
      },
      heartsMin: 6,
    },
  ],
  'ka-ning-partner': [
    {
      id: 'ka-ning-partner-daily-31',
      text: {
        zhCN: '下班先擦干双手，纸巾里竟带着一截线头。',
        en: 'Home from work. Drying my hands, I find a loose thread in the tissue.',
      },
      dayKinds: ['workday'],
      when: [
        {
          minuteMin: 1020,
        },
      ],
      forbids: ['bno-partner-between-jobs'],
    },
    {
      id: 'ka-ning-partner-daily-32',
      text: {
        zhCN: '刚收工，今晚不想再对着表格吃饭。',
        en: 'Just finished work. No spreadsheets beside dinner tonight.',
      },
      dayKinds: ['workday'],
      when: [
        {
          minuteMin: 1020,
        },
      ],
      forbids: ['bno-partner-between-jobs'],
    },
    {
      id: 'ka-ning-partner-daily-33',
      text: {
        zhCN: '下班带回一根胡萝卜，饭盒终于有新颜色。',
        en: 'A carrot on the way from work. A new colour for the lunch box.',
      },
      dayKinds: ['workday'],
      when: [
        {
          minuteMin: 1020,
        },
      ],
      forbids: ['bno-partner-between-jobs'],
    },
    {
      id: 'ka-ning-partner-daily-34',
      text: {
        zhCN: '工作结束了，我把手机提醒调成了静音。',
        en: 'Work’s over. I’ve silenced the reminders on my phone.',
      },
      dayKinds: ['workday'],
      when: [
        {
          minuteMin: 1020,
        },
      ],
      forbids: ['bno-partner-between-jobs'],
    },
    {
      id: 'ka-ning-partner-daily-35',
      text: {
        zhCN: '从班上回来，最想先换掉这双硬鞋。',
        en: 'Back from my shift. These stiff shoes can come off first.',
      },
      dayKinds: ['workday'],
      when: [
        {
          minuteMin: 1020,
        },
      ],
      forbids: ['bno-partner-between-jobs'],
    },
    {
      id: 'ka-ning-partner-daily-36',
      text: {
        zhCN: '收工以后这一小段，我不想边吃边算账。',
        en: 'For this bit after work, I’d rather eat without doing sums.',
      },
      dayKinds: ['workday'],
      when: [
        {
          minuteMin: 1020,
        },
      ],
      forbids: ['bno-partner-between-jobs'],
    },
    {
      id: 'ka-ning-partner-daily-37',
      text: {
        zhCN: '找工作这阵，散步时尽量不刷招聘页。',
        en: 'While job hunting, I’m trying to keep listings off my walks.',
      },
      requires: ['bno-partner-between-jobs'],
      forbids: ['bno-partner-restarted'],
    },
    {
      id: 'ka-ning-partner-daily-38',
      text: {
        zhCN: '还在等下一份工作，先把午饭认真做好。',
        en: 'Still between jobs. Today’s lunch deserves some care anyway.',
      },
      requires: ['bno-partner-between-jobs'],
      forbids: ['bno-partner-restarted'],
    },
    {
      id: 'ka-ning-partner-daily-39',
      text: {
        zhCN: '新工作收工了，午饭盒比昨天轻得多。',
        en: 'Finished at the new job. The lunch box is lighter than yesterday.',
      },
      requires: ['bno-partner-restarted'],
      dayKinds: ['workday'],
      when: [
        {
          minuteMin: 1020,
        },
      ],
    },
    {
      id: 'ka-ning-partner-daily-40',
      text: {
        zhCN: '重新上班后，回家路上的灯也认熟了。',
        en: 'Back at work, I’m learning the lights along the route home.',
      },
      requires: ['bno-partner-restarted'],
      dayKinds: ['workday'],
      when: [
        {
          minuteMin: 1020,
        },
      ],
    },
    {
      id: 'ka-ning-partner-daily-41',
      text: {
        zhCN: '春天的薄外套找到了，袖口还别着线。',
        en: 'Found the spring jacket. A thread is still pinned to the cuff.',
      },
      season: 2,
    },
    {
      id: 'ka-ning-partner-daily-42',
      text: {
        zhCN: '冬天的饭盒凉得快，外面加层布试试。',
        en: 'Lunch cools quickly in winter. I’ll try wrapping the box in cloth.',
      },
      season: 1,
    },
    {
      id: 'ka-ning-partner-daily-43',
      text: {
        zhCN: '雨声盖过电饭锅，我差点错过它的提示。',
        en: 'The rain drowned out the rice cooker. I nearly missed its beep.',
      },
      weather: ['rain'],
    },
    {
      id: 'ka-ning-partner-daily-44',
      text: {
        zhCN: '周末把针线摊开，这次不赶着缝完。',
        en: 'Sewing laid out for the weekend. No rush to finish this time.',
      },
      dayKinds: ['weekend'],
    },
    {
      id: 'ka-ning-partner-daily-45',
      text: {
        zhCN: '孩子那张猫还留着，边上的字也舍不得剪。',
        en: 'The child’s cat is still here. I can’t bear to trim the writing beside it.',
      },
      requires: ['bno-partner-cv-seen'],
    },
    {
      id: 'ka-ning-partner-daily-46',
      text: {
        zhCN: '箱里的旧地图折反了，难怪怎么都合不上。',
        en: 'The old map was folded backwards. No wonder the case wouldn’t close.',
      },
    },
    {
      id: 'ka-ning-partner-daily-47',
      text: {
        zhCN: '你挑布料吧，颜色这件事我愿意听你的。',
        en: 'You choose the fabric. I trust you on the colour.',
      },
      heartsMin: 2,
    },
    {
      id: 'ka-ning-partner-daily-48',
      text: {
        zhCN: '等会儿一起拆这根线，不急着拆完。',
        en: 'Help me unpick this seam in a bit. It can take its time.',
      },
      heartsMin: 2,
    },
    {
      id: 'ka-ning-partner-daily-49',
      text: {
        zhCN: '我想把相册空白那页留给下一次出门。',
        en: 'I’d like to save that empty album page for our next outing.',
      },
      heartsMin: 6,
    },
    {
      id: 'ka-ning-partner-daily-50',
      text: {
        zhCN: '饭盒扣好后，来陪我看看窗外也行。',
        en: 'Once the lunch box is shut, you could come and watch the view with me.',
      },
      heartsMin: 6,
    },
  ],
  'ka-ning-child': [
    {
      id: 'ka-ning-child-daily-31',
      text: {
        zhCN: '放学了，书包先坐椅子，我坐你旁边。',
        en: 'School’s out. My bag gets the chair; I’ll sit beside you.',
      },
      dayKinds: ['workday'],
      when: [
        {
          minuteMin: 930,
        },
      ],
    },
    {
      id: 'ka-ning-child-daily-32',
      text: {
        zhCN: '今天下课我没忘水壶，差点忘了自己。',
        en: 'I remembered my bottle after class. Nearly forgot myself.',
      },
      dayKinds: ['workday'],
      when: [
        {
          minuteMin: 930,
        },
      ],
    },
    {
      id: 'ka-ning-child-daily-33',
      text: {
        zhCN: '放学回来才发现，袖子里藏着一块橡皮。',
        en: 'Home from school. There was a rubber hiding in my sleeve.',
      },
      dayKinds: ['workday'],
      when: [
        {
          minuteMin: 930,
        },
      ],
    },
    {
      id: 'ka-ning-child-daily-34',
      text: {
        zhCN: '功课摊开了，最难那题先给它空个座位。',
        en: 'Homework open. I’ve saved the hard question an empty space.',
      },
      dayKinds: ['workday'],
      when: [
        {
          minuteMin: 930,
        },
      ],
    },
    {
      id: 'ka-ning-child-daily-35',
      text: {
        zhCN: '下课铃响以后，大家的拉链也一起唱了。',
        en: 'After the bell, everyone’s zips sang together.',
      },
      dayKinds: ['workday'],
      when: [
        {
          minuteMin: 930,
        },
      ],
    },
    {
      id: 'ka-ning-child-daily-36',
      text: {
        zhCN: '放学路上捡的小石头，洗干净才给你看。',
        en: 'I’ll wash my stone from the walk home before I show you.',
      },
      dayKinds: ['workday'],
      when: [
        {
          minuteMin: 930,
        },
      ],
    },
    {
      id: 'ka-ning-child-daily-37',
      text: {
        zhCN: '学校的事我想说三件，你先别猜最后一件。',
        en: 'Three things from school. Don’t guess the last one yet.',
      },
      dayKinds: ['workday'],
      when: [
        {
          minuteMin: 930,
        },
      ],
    },
    {
      id: 'ka-ning-child-daily-38',
      text: {
        zhCN: '作业写完啦，铅笔比我先躺下了。',
        en: 'Homework done. My pencil lay down before I did.',
      },
      dayKinds: ['workday'],
      when: [
        {
          minuteMin: 930,
        },
      ],
    },
    {
      id: 'ka-ning-child-daily-39',
      text: {
        zhCN: '春天的蚂蚁好忙，它们有没有课间？',
        en: 'Spring ants are busy. Do they have break time?',
      },
      season: 2,
    },
    {
      id: 'ka-ning-child-daily-40',
      text: {
        zhCN: '夏天的凉鞋有洞，脚趾也能看风景。',
        en: 'Summer sandals have windows. My toes get a view too.',
      },
      season: 3,
    },
    {
      id: 'ka-ning-child-daily-41',
      text: {
        zhCN: '秋天拾的果壳，口袋一走就响。',
        en: 'Autumn nutshells. My pocket rattles when I walk.',
      },
      season: 4,
    },
    {
      id: 'ka-ning-child-daily-42',
      text: {
        zhCN: '冬天手套连着绳，像两个人拉着手。',
        en: 'Winter mittens on a string look like two people holding hands.',
      },
      season: 1,
    },
    {
      id: 'ka-ning-child-daily-43',
      text: {
        zhCN: '下雨时窗玻璃糊了，我用手指开个小窗。',
        en: 'Rain’s blurred the glass. My finger can make a tiny window.',
      },
      weather: ['rain'],
    },
    {
      id: 'ka-ning-child-daily-44',
      text: {
        zhCN: '雪人还没鼻子，可是我也想吃那根胡萝卜。',
        en: 'The snowman needs a nose, but I want that carrot too.',
      },
      weather: ['snow'],
    },
    {
      id: 'ka-ning-child-daily-45',
      text: {
        zhCN: '周末的闹钟不响，我的小肚子会响。',
        en: 'The weekend alarm is quiet. My tummy isn’t.',
      },
      dayKinds: ['weekend'],
    },
    {
      id: 'ka-ning-child-daily-46',
      text: {
        zhCN: '这次敢念长词了，你听我慢慢拆开。',
        en: 'I’m ready for the long word. Listen while I take it apart.',
      },
      heartsMin: 2,
    },
    {
      id: 'ka-ning-child-daily-47',
      text: {
        zhCN: '那张量身高的照片，我想发给外婆看。',
        en: 'I want to send Granny the photo of my height mark.',
      },
      heartsMin: 2,
      requires: ['heart-child-photo'],
    },
    {
      id: 'ka-ning-child-daily-48',
      text: {
        zhCN: '我给这幅画留了空，你也能画进去。',
        en: 'I left a space in this picture so you can draw yourself in.',
      },
      heartsMin: 6,
    },
    {
      id: 'ka-ning-child-daily-49',
      text: {
        zhCN: '这本书读错也没关系，我等你再念一次。',
        en: 'It’s all right to get this book wrong. I’ll wait for another try.',
      },
      heartsMin: 6,
    },
    {
      id: 'ka-ning-child-daily-50',
      text: {
        zhCN: '我想讲今天最小的事，一只蚂蚁那么小。',
        en: 'I want to tell you the smallest thing today. Ant-sized.',
      },
      heartsMin: 6,
    },
  ],
};
for (const npc of familyNpcs) npc.lines.push(...additionalLines[npc.id]);

// Existing supper and bedtime lines need the same clock gates as the new ones.
familyNpcs[1].lines[2].when = [{ minuteMin: 1020 }];
familyNpcs[1].lines[18].when = [{ minuteMin: 1020 }];
familyNpcs[1].lines[25].when = [{ minuteMin: 1020 }];
familyNpcs[2].lines[29].when = [{ minuteMin: 1080 }];

familyNpcs.push({
  id: 'yao-flatmate',
  name: t('周沅', 'Yuan Zhou'),
  role: t('林遥的室友，装裱员', 'Yao’s flatmate, a picture framer'),
  characters: ['skilled-worker'],
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
        { from: 540, at: 'away' },
        { from: 1020, at: 'home' },
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
    loved: ['corn-soup', 'sunflower'],
    liked: ['tea', 'biscuits', 'tomato'],
    disliked: ['old-boot', 'shopping-trolley', 'pike'],
  },
  reactions: {
    loved: t(
      '这份正中喜好，我把手洗干净再接！',
      'Just my favourite. Let me wash my hands before I take it!',
    ),
    liked: t(
      '真好，得给它找个没有纸屑的地方。',
      'Lovely. Somewhere without paper shavings for this.',
    ),
    neutral: t(
      '我先放在自己的架子上，免得混了。',
      'On my shelf for now, so it won’t get mixed up.',
    ),
    disliked: t(
      '这气味会钻进纸里，还是放远一点吧。',
      'That smell will get into the paper. Further away, please.',
    ),
  },
  lines: [
    {
      id: 'yao-flatmate-daily-1',
      text: {
        zhCN: '我是周沅，装裱店上班。厨房左边那格归你。',
        en: 'I’m Yuan, from the framing shop. The left kitchen shelf is yours.',
      },
      heartsMax: 1,
    },
    {
      id: 'yao-flatmate-daily-2',
      text: {
        zhCN: '门后那把折尺是我的，不是房东的。',
        en: 'The folding ruler behind the door is mine, not the landlord’s.',
      },
    },
    {
      id: 'yao-flatmate-daily-3',
      text: {
        zhCN: '盐和糖写了名字，我对手误没有信心。',
        en: 'Salt and sugar labelled. I don’t trust my hands to choose.',
      },
    },
    {
      id: 'yao-flatmate-daily-4',
      text: {
        zhCN: '汤可以多煮一点，洗锅的事不会变多。',
        en: 'More soup doesn’t make more pans to wash.',
      },
    },
    {
      id: 'yao-flatmate-daily-5',
      text: {
        zhCN: '冰箱门的声音大，轻推一下就行。',
        en: 'The fridge door’s loud. A gentle push will do.',
      },
    },
    {
      id: 'yao-flatmate-daily-6',
      text: {
        zhCN: '租约放在文件袋里，我没拿它垫桌脚。',
        en: 'The tenancy papers are in their wallet, not under a table leg.',
      },
    },
    {
      id: 'yao-flatmate-daily-7',
      text: {
        zhCN: '房东的检查邮件，我先标在门背的纸上。',
        en: 'I mark the landlord’s inspection emails on the sheet behind the door.',
      },
    },
    {
      id: 'yao-flatmate-daily-8',
      text: {
        zhCN: '我会修画框，修不了这只一直滴的龙头。',
        en: 'I can mend frames. This dripping tap is beyond me.',
      },
    },
    {
      id: 'yao-flatmate-daily-9',
      text: {
        zhCN: '装裱剩的小纸角，贴便签倒挺合适。',
        en: 'Offcuts from framing make good corners for notes.',
      },
    },
    {
      id: 'yao-flatmate-daily-10',
      text: {
        zhCN: '一碗汤的份量很难猜，多半锅倒容易。',
        en: 'One bowl of soup is hard to judge. Half a pan is easier.',
      },
    },
    {
      id: 'yao-flatmate-daily-11',
      text: {
        zhCN: '春天把窗开条缝，胶水的气味散得快。',
        en: 'A crack in the window helps the glue smell clear in spring.',
      },
      season: 2,
    },
    {
      id: 'yao-flatmate-daily-12',
      text: {
        zhCN: '夏天的胶带太黏，连我的指纹都想留下。',
        en: 'Summer tape’s so sticky it wants to keep my fingerprints.',
      },
      season: 3,
    },
    {
      id: 'yao-flatmate-daily-13',
      text: {
        zhCN: '秋天鞋底带进来的叶子，别夹进画框。',
        en: 'Keep the autumn leaves from our shoes out of the frames.',
      },
      season: 4,
    },
    {
      id: 'yao-flatmate-daily-14',
      text: {
        zhCN: '冬天裁纸先搓手，手指不能跟着打盹。',
        en: 'I warm my fingers before cutting paper in winter.',
      },
      season: 1,
    },
    {
      id: 'yao-flatmate-daily-15',
      text: {
        zhCN: '雨把门垫浸透了，我竖起来晾一会儿。',
        en: 'The rain soaked the doormat. I’ve propped it up to dry.',
      },
      weather: ['rain'],
    },
    {
      id: 'yao-flatmate-daily-16',
      text: {
        zhCN: '太阳照进来才看清，玻璃擦出了条纹。',
        en: 'Sunshine reveals every streak I left on the glass.',
      },
      weather: ['sunny'],
    },
    {
      id: 'yao-flatmate-daily-17',
      text: {
        zhCN: '雪天鞋放托盘里吧，玄关不是溜冰场。',
        en: 'Snowy shoes on the tray. The hall isn’t an ice rink.',
      },
      weather: ['snow'],
    },
    {
      id: 'yao-flatmate-daily-18',
      text: {
        zhCN: '周末不裁直线，我想随便撕一张纸。',
        en: 'No straight cuts at weekends. I fancy tearing some paper.',
      },
      dayKinds: ['weekend'],
    },
    {
      id: 'yao-flatmate-daily-19',
      text: {
        zhCN: '刚下班，围裙口袋里又带回两颗图钉。',
        en: 'Just home from work. Two drawing pins in the apron pocket again.',
      },
      dayKinds: ['workday'],
      when: [
        {
          minuteMin: 1020,
        },
      ],
    },
    {
      id: 'yao-flatmate-daily-20',
      text: {
        zhCN: '收工后不想量尺寸，面条抓多少算多少。',
        en: 'After work I won’t measure anything. A handful of noodles will do.',
      },
      dayKinds: ['workday'],
      when: [
        {
          minuteMin: 1020,
        },
      ],
    },
    {
      id: 'yao-flatmate-daily-21',
      text: {
        zhCN: '下班回来先听水烧开，比机器声音顺耳。',
        en: 'Home from work, I’d rather hear water boil than machinery.',
      },
      dayKinds: ['workday'],
      when: [
        {
          minuteMin: 1020,
        },
      ],
    },
    {
      id: 'yao-flatmate-daily-22',
      text: {
        zhCN: '今天裱了幅大画，收工后肩膀终于能放松。',
        en: 'A large frame today. My shoulders can loosen up after work.',
      },
      dayKinds: ['workday'],
      when: [
        {
          minuteMin: 1020,
        },
      ],
    },
    {
      id: 'yao-flatmate-daily-23',
      text: {
        zhCN: '刚把工服挂好，晾衣架又向我这边歪。',
        en: 'Work clothes hung up. The drying rack leans my way again.',
      },
      dayKinds: ['workday'],
      when: [
        {
          minuteMin: 1020,
        },
      ],
    },
    {
      id: 'yao-flatmate-daily-24',
      text: {
        zhCN: '下班带回的纸袋，倒出来全是纸屑。',
        en: 'The bag I brought back from work is mostly paper shavings.',
      },
      dayKinds: ['workday'],
      when: [
        {
          minuteMin: 1020,
        },
      ],
    },
    {
      id: 'yao-flatmate-daily-25',
      text: {
        zhCN: '早上我先用烤面包机，你用水壶吧。',
        en: 'I’ll take the toaster this morning; you take the kettle.',
      },
      when: [
        {
          minuteMax: 660,
        },
      ],
    },
    {
      id: 'yao-flatmate-daily-26',
      text: {
        zhCN: '这么晚还醒着？我把切菜声留到明天。',
        en: 'Still up this late? Chopping can wait until tomorrow.',
      },
      when: [
        {
          minuteMin: 1260,
        },
      ],
    },
    {
      id: 'yao-flatmate-daily-27',
      text: {
        zhCN: '你的口味记住了，下次不靠便签也行。',
        en: 'I know your taste now. Won’t need a note next time.',
      },
      heartsMin: 2,
    },
    {
      id: 'yao-flatmate-daily-28',
      text: {
        zhCN: '这段广播挺好笑，留着想和你一起听。',
        en: 'Saved this funny bit of radio for us to hear together.',
      },
      heartsMin: 4,
    },
    {
      id: 'yao-flatmate-daily-29',
      text: {
        zhCN: '你回来一开门，我就知道该多拿个碗。',
        en: 'When you open the door, I know to get another bowl.',
      },
      heartsMin: 6,
    },
    {
      id: 'yao-flatmate-daily-30',
      text: {
        zhCN: '我今天不太想说话，坐一会儿也算聊天。',
        en: 'I’m quiet today. Sitting together can count as a chat.',
      },
      heartsMin: 8,
    },
    {
      id: 'yao-flatmate-daily-31',
      text: {
        zhCN: '你伴侣来英国那会儿，日历翻得特别勤。',
        en: 'When your partner came to the UK, the calendar got a lot of use.',
      },
      requires: ['partner-arrived'],
    },
    {
      id: 'yao-flatmate-daily-32',
      text: {
        zhCN: '你伴侣来英国那阵，我们还没这么多碗。',
        en: 'When your partner came to the UK, we had fewer bowls than this.',
      },
      requires: ['partner-arrived'],
    },
    {
      id: 'yao-flatmate-daily-33',
      text: {
        zhCN: '一起住久了，连谁的锅铲都不用看。',
        en: 'After living together this long, I can tell the spatulas apart.',
      },
      heartsMin: 6,
    },
    {
      id: 'yao-flatmate-daily-34',
      text: {
        zhCN: '冰箱那排纸角还牢着，字倒被蒸汽泡胖了。',
        en: 'The fridge’s paper corners hold. The steam has fattened the lettering.',
      },
      requires: ['flatmate-shelf'],
    },
    {
      id: 'yao-flatmate-daily-35',
      text: {
        zhCN: '那份检查清单夹好了，房东来前不用乱找。',
        en: 'The inspection checklist’s filed. No scramble before the landlord visits.',
      },
      requires: ['flatmate-checklist'],
    },
    {
      id: 'yao-flatmate-daily-36',
      text: {
        zhCN: '空白那格留着呢，今天也能往上添一点。',
        en: 'That blank square’s still there. Something can go in it today.',
      },
      requires: ['flatmate-board'],
    },
    {
      id: 'yao-flatmate-daily-37',
      text: {
        zhCN: '有人敲门我会先应一声，你不用急着跑。',
        en: 'I’ll answer a knock. No need for you to run for it.',
      },
      heartsMin: 4,
    },
    {
      id: 'yao-flatmate-daily-38',
      text: {
        zhCN: '新来的时候我也拿错过垃圾桶，贴字管用。',
        en: 'When I was new, I chose the wrong bin too. Labels helped.',
      },
      heartsMax: 3,
    },
    {
      id: 'yao-flatmate-daily-39',
      text: {
        zhCN: '房东要修东西，约时间的邮件别忘了抄我。',
        en: 'Copy me into emails arranging the landlord’s repairs.',
      },
    },
    {
      id: 'yao-flatmate-daily-40',
      text: {
        zhCN: '我做饭用这条旧围裙，装裱那条不进厨房。',
        en: 'This old apron is for cooking. The framing one stays out of the kitchen.',
      },
    },
    {
      id: 'yao-flatmate-daily-41',
      text: {
        zhCN: '那个玻璃罐别急着扔，还能装松开的扣子。',
        en: 'Keep that jar. It can hold loose buttons.',
      },
    },
    {
      id: 'yao-flatmate-daily-42',
      text: {
        zhCN: '我在草稿上画歪了墙，幸好真墙还挺直。',
        en: 'Drew the wall crooked. Luckily the real one’s still straight.',
      },
    },
    {
      id: 'yao-flatmate-daily-43',
      text: {
        zhCN: '这箱纸先放我房间，公共地方得能走路。',
        en: 'This paper box goes in my room. We need room to walk.',
      },
    },
    {
      id: 'yao-flatmate-daily-44',
      text: {
        zhCN: '汤勺比碗还长，只好让它斜着休息。',
        en: 'The ladle’s longer than the bowl. A diagonal rest for it.',
      },
    },
    {
      id: 'yao-flatmate-daily-45',
      text: {
        zhCN: '周末小店不赶着去，路过公园也行。',
        en: 'No rush to the shop at weekends. We could pass the park.',
      },
      dayKinds: ['weekend'],
    },
    {
      id: 'yao-flatmate-daily-46',
      text: {
        zhCN: '云把天盖住了，窗边看颜色倒没那么刺眼。',
        en: 'Cloud cover makes judging colours by the window easier on my eyes.',
      },
      weather: ['cloudy'],
    },
    {
      id: 'yao-flatmate-daily-47',
      text: {
        zhCN: '晚上把音箱挪开一点，隔壁墙比纸还薄。',
        en: 'I move the speaker at night. This wall’s thinner than paper.',
      },
      when: [
        {
          minuteMin: 1140,
        },
      ],
    },
    {
      id: 'yao-flatmate-daily-48',
      text: {
        zhCN: '早餐别碰那只裂边碗，我留它装纸夹。',
        en: 'Not that chipped bowl for breakfast. It holds paper clips now.',
      },
      when: [
        {
          minuteMax: 660,
        },
      ],
    },
    {
      id: 'yao-flatmate-daily-49',
      text: {
        zhCN: '你讲今天，我负责把不冒烟的面煮好。',
        en: 'Tell me about your day. I’ll concentrate on noodles that don’t smoke.',
      },
      heartsMin: 4,
    },
    {
      id: 'yao-flatmate-daily-50',
      text: {
        zhCN: '门背的小图还在，连斜掉的角也舍不得改。',
        en: 'The little map’s still behind the door. I’m keeping its crooked corner.',
      },
      requires: ['flatmate-map'],
    },
    {
      id: 'yao-flatmate-daily-51',
      text: {
        zhCN: '这盘饺子留个角，我想画下大家摆菜的样子。',
        en: 'Leave a corner by the dumplings. I want to sketch the dishes.',
      },
      festival: 'lunar-new-year',
    },
    {
      id: 'yao-flatmate-daily-52',
      text: {
        zhCN: '五月节的彩带别借我量，会越量越长。',
        en: 'No measuring the May Day ribbons. They’ll only get longer.',
      },
      festival: 'may-day',
    },
    {
      id: 'yao-flatmate-daily-53',
      text: {
        zhCN: '夏日集市的标签好看，我只学它的排字。',
        en: 'Lovely summer-fair labels. I’m studying just the lettering.',
      },
      festival: 'summer-fair',
    },
    {
      id: 'yao-flatmate-daily-54',
      text: {
        zhCN: '烟花刚开，我画的线就跟不上了。',
        en: 'The fireworks open faster than I can draw them.',
      },
      festival: 'bonfire-night',
    },
    {
      id: 'yao-flatmate-daily-55',
      text: {
        zhCN: '圣诞集市的木牌歪着，我看得脖子也歪了。',
        en: 'The Christmas-market sign’s crooked. My neck’s following it.',
      },
      festival: 'christmas-market',
    },
  ],
});

const moments: {
  npc: string;
  hearts: number;
  title: Text;
  text: Text;
  labels: Text[];
  requires?: string[];
  when?: GameEvent['when'];
  sets?: string[];
}[] = [
  {
    npc: 'jamie',
    hearts: 2,
    title: {
      zhCN: '没合上的食谱',
      en: 'The open recipe book',
    },
    text: {
      zhCN: '杰米用杯子压住食谱，纸页卷回来，锅里的洋葱已经开始催人。\n你扶住锅柄，他终于腾出手翻页。「原来下一行才说要关小火。」\n他把火调低，又把挤在一起的两把椅子拉开，给你留出伸腿的位置。\n「这次先别管像不像照片。」他递来试味的勺子，自己先笑了一下。',
      en: 'Jamie pins the recipe open with a mug. The page curls back while the onions demand attention.\nYou steady the pan so he can turn the page. “The next line says turn the heat down.”\nHe lowers the flame and separates the two crowded chairs, leaving you room to stretch your legs.\n“Never mind whether it looks like the picture.” He offers you a tasting spoon and starts to smile.',
    },
    labels: [
      {
        zhCN: '扶着锅一起试味',
        en: 'Steady the pan and taste together',
      },
      {
        zhCN: '替食谱压平卷角',
        en: 'Flatten the curled recipe page',
      },
    ],
  },
  {
    npc: 'jamie',
    hearts: 4,
    title: {
      zhCN: '少一颗螺丝',
      en: 'One screw short',
    },
    text: {
      zhCN: '杰米把厨房椅子倒过来，指着松开的椅脚，掌心只剩下一颗螺丝。\n「另一颗大概退休了。」他摸遍裤袋，找出一张皱巴巴的购物纸。\n你替他扶稳椅背，他在纸上描下螺丝的形状，这回不凭印象去买。\n椅子暂时靠墙放好。他站起来试着推了推旁边那把，再请你坐下。',
      en: 'Jamie turns a kitchen chair over. The leg is loose and there is only one screw in his palm.\n“The other one must have retired.” His pockets produce a crumpled shopping list.\nYou hold the chair while he traces the screw on the paper. No shopping from memory this time.\nThe chair rests against the wall. He checks the one beside it before inviting you to sit.',
    },
    labels: [
      {
        zhCN: '扶住椅背描螺丝',
        en: 'Hold the chair and trace the screw',
      },
      {
        zhCN: '把松椅子搬到墙边',
        en: 'Move the loose chair against the wall',
      },
    ],
  },
  {
    npc: 'jamie',
    hearts: 6,
    title: {
      zhCN: '两把旧椅子',
      en: 'Two old chairs',
    },
    text: {
      zhCN: '后门旁的两把旧椅子积了灰。杰米拧干抹布，先仔细擦过椅背。\n他把吱呀声较轻的那把推给你，自己往另一把上坐，响声立刻接话。\n「它比我还想聊天。」他没急着起身，只用鞋跟轻轻试了试椅脚。\n你在他身旁坐定，院子里有一片叶子翻过来，两个人都看了好一会儿。',
      en: 'The old chairs by the back door are dusty. Jamie wrings out a cloth and wipes their backs.\nHe slides the quieter one towards you. His own chair answers as soon as he sits.\n“More talkative than me.” He stays seated, gently testing the leg with his heel.\nYou settle beside him. A leaf turns over in the yard, and you both watch it for a while.',
    },
    labels: [
      {
        zhCN: '把两把椅子并排摆好',
        en: 'Line the two chairs up together',
      },
      {
        zhCN: '接过抹布擦椅脚',
        en: 'Take the cloth and wipe the chair legs',
      },
    ],
  },
  {
    npc: 'jamie',
    hearts: 8,
    title: {
      zhCN: '椅脚下的小垫',
      en: 'A pad beneath the chair',
    },
    text: {
      zhCN: '杰米把旧椅子搬到门边，摊开几片软木，拿来一支短得握不住的笔。\n「这回轮到它站稳了。」他蹲了一会便坐下来，请你替他比着椅脚描线。\n你把剪好的垫子递过去，他慢慢贴牢，又将椅子转向你试坐的方向。\n那声熟悉的吱呀终于轻了。他抬头看你，手还扶在椅背上没有松开。',
      en: 'Jamie carries the old chair to the door and lays out cork offcuts and an awkwardly short pencil.\n“Its turn to stand steady.” He crouches, then sits and asks you to trace around the leg.\nYou pass him the cut pads. He fits them carefully, then turns the chair for you to try.\nThe familiar creak softens. He looks up at you, his hand still resting on the chair back.',
    },
    labels: [
      {
        zhCN: '比着椅脚剪软木',
        en: 'Cut the cork around the chair leg',
      },
      {
        zhCN: '坐下替他试稳不稳',
        en: 'Sit and test whether it rocks',
      },
    ],
    sets: ['family-chairs-mended'],
  },
  {
    npc: 'jamie',
    hearts: 10,
    title: {
      zhCN: '写在椅背上',
      en: 'Names on the chair backs',
    },
    text: {
      zhCN: '杰米拿出两块薄木牌，放在修好的椅背上比了又比，始终没有钉下去。\n「写名字会不会太郑重？」他把笔递来，自己先写了一个小小的字母。\n你看见木牌背面还留着空白。他说以后换了地方，这两块也要带走。\n两把椅子终于各有了名字。门边的空地不大，已经够你们并排坐下。',
      en: 'Jamie tries two thin wooden labels against the repaired chair backs without fastening them.\n“Are names too much?” He passes you the pen after adding a tiny initial of his own.\nThere is space on the reverse. He says the labels can come along if you ever move.\nThe chairs each have a name now. The patch by the door is small, but wide enough to sit together.',
    },
    labels: [
      {
        zhCN: '写上名字系好木牌',
        en: 'Write the names and tie on the labels',
      },
      {
        zhCN: '在木牌背面画两把椅子',
        en: 'Draw the two chairs on the reverse',
      },
    ],
    requires: ['family-chairs-mended'],
    sets: ['family-named-chairs'],
  },
  {
    npc: 'ka-ning-partner',
    hearts: 2,
    title: {
      zhCN: '简历背面的猫',
      en: 'The cat behind the CV',
    },
    text: {
      zhCN: '文舒整理旧简历时翻过一页，孩子画的猫从密密麻麻的字背后露出来。\n纸已经挨着废纸袋。你把它抽回来，猫的一只耳朵差点留在袋口。\n「这份倒舍不得扔。」她抚平纸上的折痕，把多余的那叠推到一旁。\n你们给小猫找了一块干净地方，餐桌空下来，终于能放下一盘饭。',
      en: 'Man Shu turns over an old CV. The child’s cat appears behind the crowded lines of type.\nThe page is beside the scrap bag. You rescue it before one ear catches on the rim.\n“Can’t throw this version away.” She smooths its creases and shifts the other copies aside.\nYou find the cat a clean space. The table has room for a plate of food again.',
    },
    labels: [
      {
        zhCN: '把猫贴到冰箱',
        en: 'Put the cat on the fridge',
      },
      {
        zhCN: '夹进透明袋压平',
        en: 'Flatten the drawing in a clear sleeve',
      },
    ],
    requires: ['bno-partner-cv-seen'],
  },
  {
    npc: 'ka-ning-partner',
    hearts: 4,
    title: {
      zhCN: '相册的空页',
      en: 'An empty album page',
    },
    text: {
      zhCN: '文舒把相册摊在膝上，旧车票从夹层滑出来，一角磨得露出白边。\n「来时装得太急。」她指着几张还没排好的照片，请你一起认顺序。\n你们把同一天的放在一起，没有照片的那页暂时空着，谁也没催着填满。\n她用铅笔在空页旁写上「以后」，又把笔递过来，让你加上自己的字。',
      en: 'Man Shu opens the album on her knees. Old tickets slip out, their corners worn white.\n“Packed in such a rush.” She asks you to help put the loose photographs in order.\nYou group the ones from the same day. A page without photographs stays empty, with no rush to fill it.\nShe pencils “Later” beside the blank page and passes you the pencil to add something.',
    },
    labels: [
      {
        zhCN: '在空页旁写个地点',
        en: 'Write a place beside the blank page',
      },
      {
        zhCN: '按日期排好旧车票',
        en: 'Arrange the old tickets by date',
      },
    ],
    sets: ['family-album-started'],
  },
  {
    npc: 'ka-ning-partner',
    hearts: 6,
    title: {
      zhCN: '窗边的两杯茶',
      en: 'Two cups by the window',
    },
    text: {
      zhCN: '孩子睡下了，文舒合上计算器，连同那叠没算完的纸一起收进抽屉。\n她端来两杯茶，把窗边的位置留给你，自己靠着椅背慢慢松开肩膀。\n「先不说账单，讲件没有用的事吧。」她想了想，说起路边一扇蓝门。\n你们轮流添上一点细节，茶渐渐不烫了。抽屉里的计算器始终没有再响。',
      en: 'The child is asleep. Man Shu closes the calculator and puts it away with the unfinished sums.\nShe brings two cups, saves you the window seat and slowly lets her shoulders relax.\n“Something useless, before the bills.” After thinking, she describes a blue door she passed.\nYou take turns adding details as the tea cools. The calculator stays quiet in its drawer.',
    },
    labels: [
      {
        zhCN: '慢慢喝茶讲那扇门',
        en: 'Take time over tea and the blue door',
      },
      {
        zhCN: '给她挪好椅背的靠垫',
        en: 'Set a cushion behind her chair',
      },
    ],
    when: [
      {
        minuteMin: 1200,
      },
    ],
  },
  {
    npc: 'ka-ning-partner',
    hearts: 8,
    title: {
      zhCN: '没拍好的那张',
      en: 'The imperfect photograph',
    },
    text: {
      zhCN: '文舒把几张新照片摆在相册旁，你们都眯着眼的一张被她留在手边。\n「别急着删，它有风。」她指着被吹翻的衣领，再看一眼整整齐齐的合照。\n你替她扶住相册，她把那张歪照片贴进去，旁边只写了当天走过的路。\n那页终于不空了，边上仍留出一条窄窄的地方，够两个人轮流写字。',
      en: 'Man Shu spreads new photographs beside the album, keeping the one where you are both squinting.\n“Don’t delete it. It has the wind.” She points at the turned-up collar, then at the tidier portrait.\nYou hold the album while she fixes in the crooked photograph and names the route you walked.\nThe page is no longer empty. A narrow margin remains for you both to take turns writing.',
    },
    labels: [
      {
        zhCN: '替照片写上那条路',
        en: 'Write the route beside the photograph',
      },
      {
        zhCN: '扶住相册让她贴牢',
        en: 'Hold the album while she fixes it in',
      },
    ],
    requires: ['family-album-started'],
    sets: ['family-album-page'],
  },
  {
    npc: 'ka-ning-partner',
    hearts: 10,
    title: {
      zhCN: '每年留一页',
      en: 'A page each year',
    },
    text: {
      zhCN: '文舒在相册后面夹了一叠空纸，数量没有认真算，只让每页都留着宽边。\n「以后每年挑一张，模糊的也算。」她把已经贴好的那页翻到你面前。\n你问写什么，她说不用先决定。走过哪条路，做坏过什么菜，都能慢慢补。\n她在封底写下你们的名字，把相册放回伸手够得到的架子，没再塞进箱底。',
      en: 'Man Shu slips blank sheets into the back of the album, leaving a wide margin on each.\n“One picture every year. Blurred ones count.” She turns the completed page towards you.\nYou ask what to write. There is no need to decide yet: a route walked or a meal gone wrong can wait.\nShe writes your names inside the back cover and returns the album to a reachable shelf, out of the box.',
    },
    labels: [
      {
        zhCN: '在封底写下自己的名字',
        en: 'Add your name inside the back cover',
      },
      {
        zhCN: '为下一年夹好空白页',
        en: 'Mark a blank page for next year',
      },
    ],
    requires: ['family-album-page'],
    sets: ['family-yearly-album'],
  },
  {
    npc: 'ka-ning-child',
    hearts: 2,
    title: {
      zhCN: '倒过来的书签',
      en: 'The upside-down bookmark',
    },
    text: {
      zhCN: '乐言抱来一本书，先把封面转正，又低头检查书签有没有跟着一起倒过来。\n孩子往旁边挪了挪，让出半张坐垫。「这次你一页，我一页，长的也算。」\n你读到一半停下，乐言没有抢着翻页，手指轻轻压住了快滑走的书签。\n故事里的鸭子还没找到门。孩子把书往你这边推一点，等你们一起接着找。',
      en: 'Lok Yin arrives with a book, turns the cover upright and checks the bookmark has turned too.\nThe child makes room on the cushion. “One page each. Long ones count.”\nWhen you pause halfway through, Lok Yin holds the slipping bookmark instead of turning ahead.\nThe duck in the story has not found its door. The book moves towards you so you can keep looking together.',
    },
    labels: [
      {
        zhCN: '轮流读故事',
        en: 'Take turns reading',
      },
      {
        zhCN: '替孩子扶住快滑走的书签',
        en: 'Hold the slipping bookmark for the child',
      },
    ],
  },
  {
    npc: 'ka-ning-child',
    hearts: 4,
    title: {
      zhCN: '画里的空位',
      en: 'A space in the picture',
    },
    text: {
      zhCN: '乐言把蜡笔铺成半圈，画纸上有一扇门，门前的人却只画了一半。\n「这边留给你，别画得太高。」孩子用手掌挡住一小块，认真量了量。\n你握住最短的那支笔，乐言把自己的头发补得乱一点，说这样才像刚起床。\n门边又多了一个人。孩子没有急着收笔，问你要不要给两个人加上影子。',
      en: 'Lok Yin arranges crayons in a semicircle. The person outside a drawn doorway is only half finished.\n“Your space here. Not too tall.” A small palm shields part of the paper while measuring it.\nYou take the shortest crayon. Lok Yin adds messy hair to look like someone just out of bed.\nAnother person stands by the door. Before packing away, the child asks about giving both of you shadows.',
    },
    labels: [
      {
        zhCN: '在空位画上自己',
        en: 'Draw yourself in the space',
      },
      {
        zhCN: '给两个人添上影子',
        en: 'Add shadows beneath both people',
      },
    ],
    sets: ['family-shared-drawing'],
  },
  {
    npc: 'ka-ning-child',
    hearts: 6,
    title: {
      zhCN: '门框上的新线',
      en: 'A new mark on the frame',
    },
    text: {
      zhCN: '乐言贴着门框站好，先压平翘起的头发，又悄悄把脚跟落回地板上。\n「这次不踮脚。」孩子说完便屏住气，眼睛一路追着你手里的铅笔。\n你在旧线旁添上日期，再把手移开。乐言转过身，用指尖比了两道记号。\n拍照时孩子坚持把旧线也留下。照片不只装着今天，还装着没长高的时候。',
      en: 'Lok Yin stands against the doorframe, smooths down unruly hair and quietly lowers both heels.\n“No tiptoes this time.” The child holds a breath, eyes following the pencil in your hand.\nYou date the mark beside the old one. Lok Yin turns and measures the gap with a fingertip.\nFor the photograph, the old mark has to stay in view. There is room for the smaller days too.',
    },
    labels: [
      {
        zhCN: '写好日期再拍照',
        en: 'Date the mark and take a photo',
      },
      {
        zhCN: '扶平头发比一比旧线',
        en: 'Smooth the hair and compare the old mark',
      },
    ],
  },
  {
    npc: 'ka-ning-child',
    hearts: 8,
    title: {
      zhCN: '寄给外婆的笑脸',
      en: 'A smile for Granny',
    },
    text: {
      zhCN: '乐言把几张照片排在地毯上，一边挑，一边用两根手指遮住自己的缺牙。\n「这张笑得最大，可是门框也照进去了。」孩子歪着头，迟迟不肯拿走它。\n你说门框也能留着，乐言便找来纸，写一行歪字，解释自己已经长高多少。\n照片压在写好的纸旁，孩子又加了一句「外婆别忘了也照一张」，才递给你。',
      en: 'Lok Yin lines photographs up on the rug, covering the missing teeth with two fingers while choosing.\n“Biggest smile, but the doorframe’s in it.” The child tilts their head without removing the picture.\nYou can keep the doorframe too. Lok Yin finds paper and explains the new height in a crooked line.\nBeside the picture, one more sentence appears: “Granny, remember a picture of you too.” Then it is handed over.',
    },
    labels: [
      {
        zhCN: '把照片和字一起发给外婆',
        en: 'Send Granny the picture with its message',
      },
      {
        zhCN: '帮孩子描清写歪的那一行',
        en: 'Help make the crooked line legible',
      },
    ],
    sets: ['heart-child-photo'],
  },
  {
    npc: 'ka-ning-child',
    hearts: 10,
    title: {
      zhCN: '带得走的身高',
      en: 'Height to take along',
    },
    text: {
      zhCN: '乐言拿来一卷长纸，把纸端对准门框底下，另一头递给你，让你举稳。\n「要是搬家，门框不能装进箱子。」孩子认真把一条条旧线的位置抄过去。\n你添上日期，乐言在最上方画了一个小箭头，说这里先留给以后长高的自己。\n长纸卷好，系上一根松松的绳。孩子要你答应，每年都帮忙再打开一次。',
      en: 'Lok Yin brings a long roll of paper, lines it up with the doorframe and asks you to hold it steady.\n“The frame won’t fit in a moving box.” Each old height mark is copied carefully onto the paper.\nYou add dates. At the top, a small arrow saves room for a taller future self.\nThe roll is tied loosely with string. The child asks you to promise to open it together every year.',
    },
    labels: [
      {
        zhCN: '扶着长纸抄好旧线',
        en: 'Hold the paper while copying the marks',
      },
      {
        zhCN: '在纸边写好每条线的日期',
        en: 'Date each mark along the paper',
      },
    ],
    requires: ['heart-child-photo'],
    sets: ['family-height-roll'],
  },
  {
    npc: 'yao-flatmate',
    hearts: 2,
    title: {
      zhCN: '冰箱左边那格',
      en: 'The left fridge shelf',
    },
    text: {
      zhCN: '周沅蹲在冰箱前，拿出几片装裱剩下的纸角，量了量左边那格的宽度。\n「用铅笔写，搬动东西也好改。」她递给你一张空签，自己先写上名字。\n你们把各自的盒子挪好，最底下留出一小块共用的地方，暂时没有放东西。\n关门前她又轻推了一下边沿，响声小了。「半夜饿了也不用怕把我吵醒。」',
      en: 'Yuan crouches by the fridge, sizing the left shelf with paper corners left over from framing.\n“Pencil. Easier to change when things move.” She offers a blank label and writes her own name.\nYour boxes find separate places. A small shared patch stays empty at the bottom.\nShe eases the door closed. “A midnight snack needn’t wake me.” The clatter is softer now.',
    },
    labels: [
      {
        zhCN: '写好名字贴在左边',
        en: 'Write your name on the left shelf',
      },
      {
        zhCN: '替她按住纸角贴牢',
        en: 'Hold the paper corner while she fixes it',
      },
    ],
    sets: ['flatmate-shelf'],
  },
  {
    npc: 'yao-flatmate',
    hearts: 4,
    title: {
      zhCN: '检查前的清单',
      en: 'Before the inspection',
    },
    text: {
      zhCN: '房东约了以后来检查。周沅拿着便签站在玄关，把「有问题」三个字划掉了。\n「写清楚，比写严重管用。」她示意你听龙头的滴答，又去试松动的门把手。\n你们逐项记下要问的事，没有把满屋晾衣架算成故障，纸也终于没被挤皱。\n她把清单夹到门背。「他来的时候，我们都能看见，不用临时互相找人。」',
      en: 'The landlord has arranged a future inspection. In the hall, Yuan crosses out “Something wrong” on a note.\n“Clearer beats louder.” She points out the dripping tap, then tests the loose door handle.\nYou list the questions together. The drying racks do not count as faults, and the page stays uncrumpled.\nShe clips it behind the door. “When he comes, either of us can find it without chasing the other.”',
    },
    labels: [
      {
        zhCN: '把龙头的位置写清楚',
        en: 'Describe which tap is dripping',
      },
      {
        zhCN: '扶住门让她试把手',
        en: 'Hold the door while she tests the handle',
      },
    ],
    requires: ['flatmate-shelf'],
    sets: ['flatmate-checklist'],
  },
  {
    npc: 'yao-flatmate',
    hearts: 6,
    title: {
      zhCN: '没有问完的话',
      en: 'A question left alone',
    },
    text: {
      zhCN: '你回到合租屋时，周沅正把一锅汤分进碗里，听见门响便多拿了一只。\n「想讲就讲，不想讲先喝。」她把长柄勺斜放着，没有急着问你今天过得怎样。\n你坐下来，桌上只有两张擦过又没舍得扔的纸巾。她把自己那碗往旁边挪。\n汤的热气慢慢散开，你们先说起盐够不够。原来有些话也可以晚一点再问。',
      en: 'Back at the shared flat, you find Yuan serving soup. The door opens and she reaches for another bowl.\n“Talk if you want. Or just eat.” She rests the long ladle diagonally, in no rush to ask about your day.\nYou sit down beside two reused paper napkins. She shifts her bowl to make more space.\nAs the steam clears, salt is enough to talk about. Some questions can wait.',
    },
    labels: [
      {
        zhCN: '坐下替两碗汤试味',
        en: 'Sit and taste the two bowls of soup',
      },
      {
        zhCN: '拿起长勺替她盛满那碗',
        en: 'Fill her bowl with the long ladle',
      },
    ],
    requires: ['flatmate-checklist'],
    when: [
      {
        minuteMin: 1020,
      },
    ],
    sets: ['flatmate-quiet-soup'],
  },
  {
    npc: 'yao-flatmate',
    hearts: 8,
    title: {
      zhCN: '门背的空格',
      en: 'The empty square',
    },
    text: {
      zhCN: '周沅把一块旧装裱背板靠在门边，上面画着几格，最中间那格还空着。\n「这格不写缴费，也不写检查。」她擦掉边角的胶痕，让你挑一支颜色。\n你们写下想一起做的小事，一次散步也算。纸角可以取下来，改主意不留痕。\n她把板挂稳，退后一步看了看。「谁先想起一件，就添上，不用等开会。」',
      en: 'Yuan leans an old backing board beside the door. It has squares, with the middle one empty.\n“No bills or inspections in this bit.” She rubs away old glue and asks you to choose a colour.\nYou note small things to do together. A walk counts. Removable paper corners leave room to change your minds.\nShe hangs it straight and steps back. “Whoever thinks of something can add it. No meeting needed.”',
    },
    labels: [
      {
        zhCN: '在空格写下一条散步路线',
        en: 'Put a walking route in the empty square',
      },
      {
        zhCN: '扶住背板让她挂直',
        en: 'Hold the board while she hangs it straight',
      },
    ],
    requires: ['flatmate-quiet-soup'],
    sets: ['flatmate-board'],
  },
  {
    npc: 'yao-flatmate',
    hearts: 10,
    title: {
      zhCN: '屋里的小地图',
      en: 'A map of the flat',
    },
    text: {
      zhCN: '周沅在门背的板上夹了一张小图，厨房画得最大，卧室只标了各自的门。\n「不是量房，别找比例尺。」她在共用那格画上两只碗，又把笔放到你面前。\n你添了一条从门口到厨房的线。她说以后换住处也带上它，再慢慢加别的门。\n纸角压好，两个人签了名字。这张没画准的地图，从此和租约分开收着。',
      en: 'Yuan clips a little map to the board. The kitchen is largest; the bedrooms are only labelled doors.\n“No scale. Don’t check.” She draws two bowls in the shared square and puts the pen before you.\nYou add a route from the entrance to the kitchen. She suggests taking it along to future homes and adding doors.\nThe corners hold it flat, signed by both of you. This inaccurate map has its own place, separate from the tenancy papers.',
    },
    labels: [
      {
        zhCN: '在小图下签上名字',
        en: 'Sign beneath the little map',
      },
      {
        zhCN: '画上门口通往厨房的线',
        en: 'Draw the route from the entrance to the kitchen',
      },
    ],
    requires: ['flatmate-board'],
    sets: ['flatmate-map'],
  },
];
export const familyHeartEvents: GameEvent[] = moments.map(
  ({ npc, hearts, title, text, labels, requires, when, sets }) => ({
    id: `heart-${npc}-${hearts}`,
    title,
    text,
    weight: 1,
    once: true,
    channel: `npc:${npc}`,
    speaker: npc,
    heart: { npc, hearts },
    ...(requires && { requires }),
    ...(when && { when }),
    choices: [
      {
        id: 'stay',
        label: labels[0],
        effects: [
          { type: 'stat', key: 'mood', delta: b.heartMood },
          { type: 'friendship', npc, delta: b.talkFriendship },
        ],
        ...(sets && { sets }),
      },
      {
        id: 'help',
        label: labels[1],
        effects: [
          { type: 'stat', key: 'health', delta: b.heartHelp },
          { type: 'friendship', npc, delta: b.talkFriendship },
        ],
        ...(sets && { sets }),
      },
    ],
  }),
);
