import type { Festival, FestivalId, Quarter, Text } from './types';

export const festivals: Festival[] = [
  {
    id: 'lunar-new-year',
    season: 1,
    name: { zhCN: '春节聚会', en: 'Lunar New Year gathering' },
    text: {
      zhCN: '社区百家宴，保温盒摆满长桌。一起捏饺子，捏漏的先下锅尝。',
      en: 'Covered dishes fill the bring-and-share table. Fold dumplings together; taste the leaky ones first.',
    },
  },
  {
    id: 'may-day',
    season: 2,
    name: { zhCN: '五月节集市', en: 'May Day fair' },
    text: {
      zhCN: '彩带绕过摊位，风先跳起舞。牵一头绕着走，甜面包在摊上等着。',
      en: 'Ribbons weave between stalls. Take an end and join the dance; sweet buns wait on the stall.',
    },
  },
  {
    id: 'summer-fair',
    season: 3,
    name: { zhCN: '夏日集市', en: 'Summer fair' },
    text: {
      zhCN: '带当季收成来评比，标签写好品种与数量。黄瓜排着队，烤玉米冒着热气。',
      en: 'Bring this season’s harvest to the show, labelled with variety and quantity. Cucumbers queue beside steaming grilled corn.',
    },
  },
  {
    id: 'bonfire-night',
    season: 4,
    name: { zhCN: '篝火之夜', en: 'Bonfire Night' },
    text: {
      zhCN: '绿地上架起篝火，纸杯热气里混着太妃糖的甜味。',
      en: 'A bonfire rises on the green. Steam from paper cups mingles with the sweetness of toffee.',
    },
  },
  {
    id: 'christmas-market',
    season: 4,
    name: { zhCN: '圣诞集市', en: 'Christmas market' },
    text: {
      zhCN: '小灯泡亮了，提盏灯听合唱，捧热杯暖手。姜饼摊的包装纸正追着风跑。',
      en: 'The fairy lights are on. Carry a lantern to hear the choir, warming your hands on a cup. The gingerbread wrapping chases the wind.',
    },
  },
];

export const festivalDialogue: Record<
  string,
  { festival: FestivalId; text: Text }[]
> = {
  margaret: [
    {
      festival: 'lunar-new-year',
      text: {
        zhCN: '饺子捏得像芜菁，馅倒是没跑。',
        en: 'My dumplings look like turnips. The filling stayed put.',
      },
    },
    {
      festival: 'may-day',
      text: {
        zhCN: '彩带在我帽子上绕了圈，算开花了。',
        en: 'A ribbon round my hat. A sort of bloom.',
      },
    },
    {
      festival: 'summer-fair',
      text: {
        zhCN: '我的黄瓜长得弯，摆盘得留个转弯位。',
        en: 'My cucumber bends. Leave room for the corner.',
      },
    },
    {
      festival: 'bonfire-night',
      text: {
        zhCN: '我拿错了园艺杯，太妃糖倒不挑杯子。',
        en: 'Brought my gardening mug. The toffee doesn’t mind.',
      },
    },
    {
      festival: 'christmas-market',
      text: {
        zhCN: '这棵小树挂得下手套，圣诞袜可得减肥。',
        en: 'This little tree fits gloves. Stockings must travel light.',
      },
    },
  ],
  priya: [
    {
      festival: 'lunar-new-year',
      text: {
        zhCN: '包饺子的桌子这么长，总算够放我的胳膊。',
        en: 'A dumpling table long enough for my elbows at last.',
      },
    },
    {
      festival: 'may-day',
      text: {
        zhCN: '彩带打结了，今天不用接电话解释。',
        en: 'Tangled ribbons. No phone calls to explain them today.',
      },
    },
    {
      festival: 'summer-fair',
      text: {
        zhCN: '我给番茄找了张纸垫，它比我还讲究。',
        en: 'A paper mat for the tomato. Fussier than I am.',
      },
    },
    {
      festival: 'bonfire-night',
      text: {
        zhCN: '纸杯捧暖了，手指终于不用挤在袖口。',
        en: 'Cup warmed my hands. Fingers can leave my cuffs.',
      },
    },
    {
      festival: 'christmas-market',
      text: {
        zhCN: '热饮上撒的香料，闻着就像放假。',
        en: 'The spices on this drink smell like a day off.',
      },
    },
  ],
  ade: [
    {
      festival: 'lunar-new-year',
      text: {
        zhCN: '这个饺子封口比我的文件夹严。',
        en: 'This dumpling seals better than my folder.',
      },
    },
    {
      festival: 'may-day',
      text: {
        zhCN: '彩带绕得我眼花，幸好不用写会议纪要。',
        en: 'Dizzy ribbons. Luckily no minutes to take.',
      },
    },
    {
      festival: 'summer-fair',
      text: {
        zhCN: '玉米摆得像一队同事，就差开会了。',
        en: 'Corn lined up like colleagues. All it needs is a meeting.',
      },
    },
    {
      festival: 'bonfire-night',
      text: {
        zhCN: '纸杯印着夏日特惠，手倒是暖起来了。',
        en: 'Paper cup says summer special. Still warming my hands.',
      },
    },
    {
      festival: 'christmas-market',
      text: {
        zhCN: '摊位灯一亮，我差点拿出工牌打卡。',
        en: 'Stall lights came on. Nearly swiped my badge.',
      },
    },
  ],
  helen: [
    {
      festival: 'lunar-new-year',
      text: {
        zhCN: '今天的饺子课，我也从揉面开始学。',
        en: 'Today I’m a student too, starting with dumpling dough.',
      },
    },
    {
      festival: 'may-day',
      text: {
        zhCN: '风把彩带拼成什么词，我还没读懂。',
        en: 'The wind’s spelling something with the ribbons. I can’t read it yet.',
      },
    },
    {
      festival: 'summer-fair',
      text: {
        zhCN: '菜名都写清楚了，终于能专心尝味道。',
        en: 'All the vegetables labelled. I can focus on tasting.',
      },
    },
    {
      festival: 'bonfire-night',
      text: {
        zhCN: '围巾上沾了糖，明天得换个结。',
        en: 'Toffee on my scarf. A different knot tomorrow.',
      },
    },
    {
      festival: 'christmas-market',
      text: {
        zhCN: '合唱歌词飞走了，幸好这段我还记得。',
        en: 'The carol sheet blew away. Luckily I know this verse.',
      },
    },
  ],
  dave: [
    {
      festival: 'lunar-new-year',
      text: {
        zhCN: '饺子里的馅不用抢答，先吹凉。',
        en: 'No speed round for dumpling fillings. Cool them first.',
      },
    },
    {
      festival: 'may-day',
      text: {
        zhCN: '彩带转得快，我那顶帽子跟不上。',
        en: 'Fast ribbons. My hat can’t keep up.',
      },
    },
    {
      festival: 'summer-fair',
      text: {
        zhCN: '菜地评委不答电影题，我白准备了。',
        en: 'The allotment judges don’t take film questions. Wasted preparation.',
      },
    },
    {
      festival: 'bonfire-night',
      text: {
        zhCN: '烟花一响，我的麦克风就输了。',
        en: 'One firework and my microphone loses.',
      },
    },
    {
      festival: 'christmas-market',
      text: {
        zhCN: '今天抽奖先放好票，别和购物小票混了。',
        en: 'Keep the raffle ticket separate from shopping receipts.',
      },
    },
  ],
  rahman: [
    {
      festival: 'lunar-new-year',
      text: {
        zhCN: '百家宴的盒子，收摊时又要猜主人。',
        en: 'At potluck closing we get to guess who owns each box.',
      },
    },
    {
      festival: 'may-day',
      text: {
        zhCN: '我把种子摊摆好了，风想自己选品种。',
        en: 'Seed stall ready. The wind wants to choose varieties.',
      },
    },
    {
      festival: 'summer-fair',
      text: {
        zhCN: '这颗番茄红得好，老店牌都羡慕。',
        en: 'Lovely red tomato. My old shop sign is jealous.',
      },
    },
    {
      festival: 'bonfire-night',
      text: {
        zhCN: '太妃糖别放暖杯旁，又要黏成一家人。',
        en: 'Toffee away from hot cups, or it all sticks together.',
      },
    },
    {
      festival: 'christmas-market',
      text: {
        zhCN: '这串灯用了好多年，还是有颗爱迟到。',
        en: 'Years with these lights. One bulb still turns up late.',
      },
    },
  ],
  lina: [
    {
      festival: 'lunar-new-year',
      text: {
        zhCN: '我包的饺子漏了一点，盘子替我接住了。',
        en: 'A dumpling leaked. The plate caught it for me.',
      },
    },
    {
      festival: 'may-day',
      text: {
        zhCN: '今天文件夹留在家，彩带占了它的位置。',
        en: 'Folder at home. Ribbons have taken its place today.',
      },
    },
    {
      festival: 'summer-fair',
      text: {
        zhCN: '黄瓜也有评语，我先替它深呼吸。',
        en: 'Cucumber getting judged too. I’ll take a breath for it.',
      },
    },
    {
      festival: 'bonfire-night',
      text: {
        zhCN: '烟花亮起来的时候，我忘了看手机。',
        en: 'When the fireworks lit up I forgot my phone.',
      },
    },
    {
      festival: 'christmas-market',
      text: {
        zhCN: '手套捧住热杯，今天想多站一会儿。',
        en: 'Gloves round a warm cup. I want to stay a little longer.',
      },
    },
  ],
  gareth: [
    {
      festival: 'lunar-new-year',
      text: {
        zhCN: '今天送的不是信，是这盘歪歪的饺子。',
        en: 'Today’s delivery is a plate of crooked dumplings.',
      },
    },
    {
      festival: 'may-day',
      text: {
        zhCN: '彩带缠上车铃，铃声都像穿了外套。',
        en: 'Ribbon on my bike bell. Even the sound has a coat.',
      },
    },
    {
      festival: 'summer-fair',
      text: {
        zhCN: '评比标签写得清楚，送信也想遇上这字。',
        en: 'Clear show labels. Wish every address looked like this.',
      },
    },
    {
      festival: 'bonfire-night',
      text: {
        zhCN: '信送完来看烟花，肩膀终于能放下来。',
        en: 'Post done before fireworks. My shoulder can finally drop.',
      },
    },
    {
      festival: 'christmas-market',
      text: {
        zhCN: '贺卡写好再投，我先喝完这一杯。',
        en: 'Write before posting the cards. My drink comes first.',
      },
    },
  ],
  jamie: [
    {
      festival: 'lunar-new-year',
      text: {
        zhCN: '这盘带回家的饺子，得先留出冰箱位置。',
        en: 'These dumplings need a little room in our fridge.',
      },
    },
    {
      festival: 'may-day',
      text: {
        zhCN: '彩带像我们家那团线，终于有用处了。',
        en: 'Ribbons like our tangled string. A use for it at last.',
      },
    },
    {
      festival: 'summer-fair',
      text: {
        zhCN: '我扶着菜篮，你把标签写直一点。',
        en: 'I’ll hold the basket. You keep the label straight.',
      },
    },
    {
      festival: 'bonfire-night',
      text: {
        zhCN: '糖纸我来收，别让它抢了烟花的风头。',
        en: 'I’ll collect the wrappers. Can’t have them upstaging the fireworks.',
      },
    },
    {
      festival: 'christmas-market',
      text: {
        zhCN: '这张贺卡给家里，字留点位置让我也写。',
        en: 'This card is for home. Leave room for my handwriting.',
      },
    },
  ],
  'ka-ning-partner': [
    {
      festival: 'lunar-new-year',
      text: {
        zhCN: '我们带的那盒先打开，别又忘在桌底。',
        en: 'Open our dish first. Not under the table again.',
      },
    },
    {
      festival: 'may-day',
      text: {
        zhCN: '孩子追着彩带跑，我替你拿住茶。',
        en: 'The child is chasing ribbons. I’ll hold your tea.',
      },
    },
    {
      festival: 'summer-fair',
      text: {
        zhCN: '篮子垫好布了，收成一路都没压坏。',
        en: 'Cloth in the basket kept the harvest safe on the way.',
      },
    },
    {
      festival: 'bonfire-night',
      text: {
        zhCN: '手套我多带了一双，在你那边的口袋。',
        en: 'Spare gloves in the pocket on your side.',
      },
    },
    {
      festival: 'christmas-market',
      text: {
        zhCN: '这盏小灯好看，回家摆窗边试试。',
        en: 'A lovely little light. We can try it by our window.',
      },
    },
  ],
  'ka-ning-child': [
    {
      festival: 'lunar-new-year',
      text: {
        zhCN: '这个饺子是小船，汤里不能开太快。',
        en: 'This dumpling is a boat. Not too fast in the soup.',
      },
    },
    {
      festival: 'may-day',
      text: {
        zhCN: '彩带跑得比我快，它是不是不用吃饭？',
        en: 'Ribbons run faster than me. Do they not need dinner?',
      },
    },
    {
      festival: 'summer-fair',
      text: {
        zhCN: '我给黄瓜画了笑脸，评委会不会也笑？',
        en: 'A smile on the cucumber. Will the judge smile too?',
      },
    },
    {
      festival: 'bonfire-night',
      text: {
        zhCN: '刚才那朵烟花，像我的书被翻到天上。',
        en: 'That firework looked like my book opening in the sky.',
      },
    },
    {
      festival: 'christmas-market',
      text: {
        zhCN: '这只姜饼人穿不穿围巾？它也站外面呢。',
        en: 'Does the gingerbread person need a scarf outside too?',
      },
    },
  ],
};

export const festivalFoods: Record<FestivalId, string> = {
  'lunar-new-year': 'dumplings',
  'may-day': 'may-bun',
  'summer-fair': 'summer-corn',
  'bonfire-night': 'bonfire-toffee',
  'christmas-market': 'gingerbread',
};
export const festivalActivities: Partial<
  Record<FestivalId, { id: string; label: Text; starts: number }>
> = {
  'lunar-new-year': {
    id: 'lunar-dumplings',
    label: { zhCN: '一起包饺子', en: 'Fold dumplings together' },
    starts: 600,
  },
  'may-day': {
    id: 'may-ribbons',
    label: { zhCN: '绕彩带跳支舞', en: 'Dance with the ribbons' },
    starts: 600,
  },
  'christmas-market': {
    id: 'christmas-lanterns',
    label: { zhCN: '提着小灯听合唱', en: 'Hear the choir with a lantern' },
    starts: 960,
  },
};
export const notices: { id: string; text: Text; season?: Quarter }[] = [
  {
    id: 'pub-quiz',
    text: {
      zhCN: '周末傍晚，戴夫在酒吧主持 pub quiz。铅笔已削好，队名自备。',
      en: 'Weekend evening: Dave hosts the pub quiz. Pencils ready; bring a team name.',
    },
  },
  {
    id: 'litter',
    text: {
      zhCN: '周末公园捡垃圾，玛格丽特带夹子。自带手套，结束后一起喝茶。',
      en: 'Weekend park litter pick. Margaret brings grabbers. Bring gloves; tea afterwards.',
    },
  },
  {
    id: 'cat',
    text: {
      zhCN: '走失的条纹猫叫饼干。若在小店附近看到，请告诉拉赫曼，别追它。',
      en: 'Missing tabby called Biscuit. Tell Rahman if spotted near the shop; don’t chase.',
    },
  },
  {
    id: 'choir',
    text: {
      zhCN: '合唱团在绿地练歌。海伦带歌词，跑调也能坐到前排。',
      en: 'Choir practice on the green. Helen brings lyrics; imperfect voices welcome in front.',
    },
  },
  {
    id: 'swap',
    text: {
      zhCN: '交换集市收旧书和干净花盆，不收钱。普里娅替空纸箱找新主人。',
      en: 'Swap clean pots and old books, no money changing hands. Priya is rehoming empty boxes.',
    },
  },
  {
    id: 'walk',
    text: {
      zhCN: '池塘慢走小队不计速度。加雷思收工后到长椅集合，狗也能同行。',
      en: 'An unhurried pond walk. Meet Gareth at the bench after his round; dogs welcome.',
    },
  },

  {
    id: 'repair',
    text: {
      zhCN: '咖啡馆收小件缝补，纽扣自带。不会穿针也能来坐坐。',
      en: 'Small sewing repairs at the café. Bring buttons; company welcome too.',
    },
  },
  {
    id: 'puzzles',
    text: {
      zhCN: '图书馆拼图交换，请先数数盒角有没有藏着最后一块。',
      en: 'Jigsaw swap at the library. Check the box corners for stray pieces.',
    },
  },
  {
    id: 'photos',
    text: {
      zhCN: '市政厅征集街景旧照片，背面请写地点，不必拍得端正。',
      en: 'Old street photographs wanted at the town hall. Add the location; crooked pictures welcome.',
    },
  },
  {
    id: 'mugs',
    text: {
      zhCN: '小店门边有共用杯架，认领自己的杯子，别替邻居挑。',
      en: 'Shared mug rack by the shop door. Claim your own mug, not your neighbour’s.',
    },
  },
  {
    id: 'winter-mending',
    text: {
      zhCN: '冬衣缝补桌在图书馆，断线的手套也能带来。',
      en: 'Winter-clothes mending table at the library. Bring unravelled gloves.',
    },
    season: 1,
  },
  {
    id: 'winter-soup',
    text: {
      zhCN: '酒吧交换热汤做法，先写锅里有什么，再写菜名。',
      en: 'Winter soup recipes at the pub. Ingredients first, names second.',
    },
    season: 1,
  },
  {
    id: 'winter-birds',
    text: {
      zhCN: '池塘冬季观鸟，借望远镜前先看看镜头盖。',
      en: 'Winter birdwatching at the pond. Check binocular caps before borrowing.',
    },
    season: 1,
  },
  {
    id: 'winter-draught',
    text: {
      zhCN: '市政厅展示挡风条样品，可以摸，不用拆自家窗户来比。',
      en: 'Draught-strip samples at the town hall. No need to bring your window.',
    },
    season: 1,
  },
  {
    id: 'winter-stories',
    text: {
      zhCN: '绿地帐篷讲冬天的故事，长椅边可借坐垫。',
      en: 'Winter stories in the green’s tent. Borrow a cushion by the benches.',
    },
    season: 1,
  },
  {
    id: 'spring-seeds',
    text: {
      zhCN: '春季分种子在菜地小屋，空纸袋比大计划有用。',
      en: 'Spring seed sharing in the allotment shed. Bring empty paper bags.',
    },
    season: 2,
  },
  {
    id: 'spring-pots',
    text: {
      zhCN: '小店交换空花盆，请把盆底的泥先刷掉。',
      en: 'Spring pot swap at the shop. Brush the soil off the bottoms first.',
    },
    season: 2,
  },
  {
    id: 'spring-path',
    text: {
      zhCN: '春季认路散步从车站门口出发，只在镇里绕一圈。',
      en: 'Spring orientation walk from the station entrance, staying in town.',
    },
    season: 2,
  },
  {
    id: 'spring-colours',
    text: {
      zhCN: '绿地画春芽，不必摘下来，纸和铅笔现场借。',
      en: 'Draw spring buds on the green. Leave them growing; borrow paper and pencils.',
    },
    season: 2,
  },
  {
    id: 'spring-books',
    text: {
      zhCN: '图书馆春季整理书架，书签请先取回，树叶也算。',
      en: 'Spring shelf tidy at the library. Retrieve bookmarks, including leaves.',
    },
    season: 2,
  },
  {
    id: 'summer-shade',
    text: {
      zhCN: '夏日绿地摆遮阳棚，帮忙的人请先认清哪边是入口。',
      en: 'Summer shade tent on the green. Helpers: find the entrance first.',
    },
    season: 3,
  },
  {
    id: 'summer-water',
    text: {
      zhCN: '菜地夏季轮流提水，空壶放左边，别只凭重量猜。',
      en: 'Summer allotment watering. Empty cans on the left; don’t guess by weight.',
    },
    season: 3,
  },
  {
    id: 'summer-drawing',
    text: {
      zhCN: '池塘夏季写生，画纸别搭在刚上漆的栏杆上。',
      en: 'Summer pond sketching. Keep paper off the freshly painted rail.',
    },
    season: 3,
  },
  {
    id: 'summer-recipes',
    text: {
      zhCN: '咖啡馆收夏季凉菜做法，抄一份也请留一份。',
      en: 'Summer salad recipes at the café. Take a copy and leave one.',
    },
    season: 3,
  },
  {
    id: 'summer-games',
    text: {
      zhCN: '酒吧花园玩桌游，风大时先把纸牌压住再谈战术。',
      en: 'Summer board games in the pub garden. Secure cards before discussing tactics.',
    },
    season: 3,
  },
  {
    id: 'autumn-leaves',
    text: {
      zhCN: '图书馆收秋叶做书签，只捡落下的，不折树枝。',
      en: 'Autumn-leaf bookmarks at the library. Fallen leaves only; leave branches alone.',
    },
    season: 4,
  },
  {
    id: 'autumn-apples',
    text: {
      zhCN: '小店交换苹果做法，酸的那种也请写清名字。',
      en: 'Autumn apple recipes at the shop. Name the sharp varieties too.',
    },
    season: 4,
  },
  {
    id: 'autumn-wheels',
    text: {
      zhCN: '车站门口检查自行车反光片，车铃也可以顺手试试。',
      en: 'Autumn bicycle reflector checks outside the station. Try the bell too.',
    },
    season: 4,
  },
  {
    id: 'autumn-lantern',
    text: {
      zhCN: '市政厅做纸灯罩，借剪刀，剪完记得传给旁边的人。',
      en: 'Autumn paper-lantern shades at the town hall. Pass the scissors along.',
    },
    season: 4,
  },
  {
    id: 'autumn-coats',
    text: {
      zhCN: '公告栏旁秋衣交换，口袋里的旧票请先拿出来。',
      en: 'Autumn coat swap by the noticeboard. Empty old tickets from the pockets first.',
    },
    season: 4,
  },
];
