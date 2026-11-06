import { balance as b } from './balance';
import type { GameEvent, Npc, Text } from './types';

const text = (zhCN: string, en: string): Text => ({ zhCN, en });
const lines = (npc: string, pairs: [string, string][]): Npc['lines'] =>
  pairs.map(([zhCN, en], i) => ({
    id: `${npc}-${i + 1}`,
    text: text(zhCN, en),
  }));
const reactions = (loved: Text, disliked: Text): Npc['reactions'] => ({
  loved,
  liked: text(
    '还特意给我带了？谢谢，正好用得上。',
    'You brought this for me? Thank you. Just the thing.',
  ),
  neutral: text(
    '谢谢你想着我，我先收好。',
    'Thanks for thinking of me. I’ll put it somewhere safe.',
  ),
  disliked,
});
const schedule = (
  work: Npc['schedule'][number]['stops'],
  weekend: Npc['schedule'][number]['stops'],
  rain: Npc['schedule'][number]['stops'],
): Npc['schedule'] => [
  {
    festival: true,
    stops: [
      { from: 0, at: 'home-street' },
      { from: 540, at: 'green-stall' },
      { from: 1080, at: 'green' },
      { from: 1320, at: 'home-street' },
    ],
  },
  { weather: ['rain', 'snow'], dayKinds: ['workday'], stops: rain },
  {
    weather: ['rain', 'snow'],
    dayKinds: ['weekend', 'special'],
    stops: [
      { from: 0, at: 'home-street' },
      { from: 600, at: 'cafe' },
      { from: 840, at: 'library' },
      { from: 1080, at: 'home-street' },
    ],
  },
  { dayKinds: ['workday'], stops: work },
  { dayKinds: ['weekend', 'special'], stops: weekend },
];
const margaretLines = lines('margaret', [
  [
    '早啊。垃圾桶我推回来了，风倒是没帮忙。',
    'Morning. I brought the bins in. The wind was no help.',
  ],
  [
    '这件外套有年头了，口袋里还留着旧便士。',
    'This coat is ancient. Still has an old penny in the pocket.',
  ],
  [
    '邮差又把隔壁的目录塞给我，我快能开店了。',
    'Another catalogue meant for next door. I could open a shop.',
  ],
  [
    '水壶刚响，你来得比门铃还准。',
    'Kettle just clicked. Better timing than the doorbell.',
  ],
  [
    '别踩那块砖，它会往鞋里喷雨水。',
    'Mind that paving slab. It squirts rainwater straight into your shoe.',
  ],
  ['我家的知更鸟只认铲子，不认我。', 'My robin recognises the spade, not me.'],
  [
    '菜地小屋那把钥匙，总在最里面的口袋。',
    'The shed key always finds the deepest pocket.',
  ],
  [
    '隔壁修了半天篱笆，最后只是换了个角度。',
    'Next door spent hours on the fence. It merely leans differently.',
  ],
  [
    '这根胡萝卜分了三条腿，走路应该挺稳。',
    'Three legs on this carrot. Must be steady on its feet.',
  ],
  [
    '土豆还没出芽，我已经替它担心晚霜了。',
    'The potatoes aren’t up yet and I’m worrying about frost.',
  ],
  [
    '郁金香冒头了，园艺中心也该给我寄账单了。',
    'Tulips are up. The garden centre bill can’t be far behind.',
  ],
  [
    '草莓要盖网，鸽子比我起得早。',
    'Net the strawberries. The pigeons get up before I do.',
  ],
  [
    '番茄红了一个，我巡视了四遍。',
    'One tomato turned red. I’ve inspected it four times.',
  ],
  [
    '向日葵挡住了小屋，我得侧身找门。',
    'The sunflowers hid the shed. I have to edge round for the door.',
  ],
  [
    '落叶能堆肥，扫不完就这么安慰自己。',
    'Leaves make compost. That’s what I say when I can’t finish sweeping.',
  ],
  [
    '芜菁炖汤不错，锅盖还能顺便暖暖手。',
    'Turnips make good soup. The lid warms your hands too.',
  ],
  [
    '霜把草地描白了，蜗牛今天倒省了闹钟。',
    'Frost edged the grass white. The snails can sleep in.',
  ],
  [
    '冬天的小屋闻着像湿手套和旧报纸。',
    'The shed smells of damp gloves and old newspapers in winter.',
  ],
  [
    '这雨细得像没下，袖口可不这么想。',
    'Rain so fine you’d think it wasn’t raining. My cuffs disagree.',
  ],
  [
    '浇水壶今天休假，我替它高兴。',
    'The watering can has the day off. Good for it.',
  ],
  [
    '太阳出来了，连那张塑料椅都像新买的。',
    'Sun’s out. Even the plastic chair looks new.',
  ],
  [
    '云压得低，茶倒得满一点。',
    'Low clouds. Best fill the teacup a little higher.',
  ],
  [
    '雪盖住杂草，这下大家的菜地都一样整齐。',
    'Snow covers the weeds. All our plots look equally tidy now.',
  ],
  [
    '你还认得我这件旧雨衣，眼力真好。',
    'You recognised me in this old raincoat. Good eyes.',
  ],
  [
    '给你留了张干椅子，我拿塑料袋罩着的。',
    'Saved you a dry chair. Kept a carrier bag over it.',
  ],
  [
    '你一来，茶杯就不用孤零零摆一只了。',
    'With you here, I needn’t put out just one cup.',
  ],
  [
    '小屋备用钥匙挂那儿了，门得抬一下再锁。',
    'Spare shed key’s there. Lift the door before locking it.',
  ],
  [
    '我把你送的花放窗边，邻居已经问了两回。',
    'Your flowers are by the window. Next door asked about them twice.',
  ],
  [
    '晚点回来也敲门，我听得到水壶以外的声音。',
    'Knock even if you’re late. I hear things besides the kettle.',
  ],
  [
    '有空替我尝口酱？我这舌头只会说甜。',
    'Try the jam when you can? My tongue only says “sweet”.',
  ],
  [
    '文件夹又厚了？我给你腾块干燥的桌角。',
    'Folder getting thicker? I’ll clear you a dry corner of the table.',
  ],
  [
    '等回信那阵子，拔草倒挺解闷。',
    'Weeding passed the time when I was waiting for a letter.',
  ],
  [
    '听说换新工牌了？旧的别扔，开罐头用不上也留着。',
    'New work badge? Keep the old one. Even if it won’t open a tin.',
  ],
  [
    '考完了？来坐，今天不抽问单词。',
    'Test done? Sit down. No vocabulary questions today.',
  ],
  [
    '周六的面包车一来，整条街都闻着饿。',
    'Saturday’s bread van makes the whole street hungry.',
  ],
  [
    '工作日安静些，鸽子倒像轮班似的。',
    'Quieter on weekdays. The pigeons seem to work shifts though.',
  ],
  [
    '烟花一响，我差点把茶包当糖放。',
    'That firework nearly made me put a teabag in for sugar.',
  ],
  [
    '太妃糖得慢慢吃，我的假牙也来过节了。',
    'Easy with the toffee. My false teeth are celebrating too.',
  ],
  [
    '火光照着泥靴，今晚不用擦也挺亮。',
    'Firelight on muddy boots. Shiny without polishing tonight.',
  ],
  [
    '每年都说站远点，最后还是你替我拿热茶。',
    'Every year I say I’ll stand back. You still end up holding my tea.',
  ],
]);
for (const i of [9, 10, 11]) margaretLines[i].season = 2;
for (const i of [12, 13]) margaretLines[i].season = 3;
for (const i of [14, 15]) margaretLines[i].season = 4;
for (const i of [16, 17]) margaretLines[i].season = 1;
for (const i of [18, 19]) margaretLines[i].weather = ['rain'];
margaretLines[20].weather = ['sunny'];
margaretLines[21].weather = ['cloudy'];
margaretLines[22].weather = ['snow'];
for (let i = 23; i < 30; i++)
  margaretLines[i].heartsMin = i < 25 ? 2 : i < 28 ? 4 : 6;
for (const i of [30, 31])
  margaretLines[i].when = [{ visaMonthsLeftMax: b.renewalWindowMonths }];
margaretLines[32].when = [{ flag: 'quarter-promoted' }];
margaretLines[32].once = true;
margaretLines[33].when = [{ flag: 'quarter-exam-passed' }];
margaretLines[33].once = true;
margaretLines[34].dayKinds = ['weekend'];
margaretLines[35].dayKinds = ['workday'];
for (let i = 36; i < 40; i++) margaretLines[i].festival = 'bonfire-night';

const adeLines = lines('ade', [
  [
    '早。打印机比我先开始抱怨了。',
    'Morning. The printer started complaining before I did.',
  ],
  [
    '今天的会有饼干，我对议程重新有了信心。',
    'Biscuits at today’s meeting. My faith in the agenda is restored.',
  ],
  [
    '谁把微波炉调到解冻？我的午饭过冬了。',
    'Who left the microwave on defrost? My lunch has overwintered.',
  ],
  [
    '工牌挂绳又缠住耳机了，它俩感情比我好。',
    'Badge lanyard tangled in my headphones again. Those two are close.',
  ],
  ['茶包我买了，牛奶这回轮到谁？', 'I got teabags. Whose turn is the milk?'],
  [
    '巴士提前到了，司机看我跑得很有节奏。',
    'Bus came early. Driver watched me run quite rhythmically.',
  ],
  [
    '我那张报销单在三个收件箱里旅行。',
    'My expenses form is touring three inboxes.',
  ],
  [
    '办公室的暖气有自己的时区。',
    'The office heating operates in its own time zone.',
  ],
  [
    '周五留下的香蕉，周一变成了团队议题。',
    'Friday’s banana became a team discussion on Monday.',
  ],
  [
    '窗边有阳光，午饭先让三明治晒一会儿。',
    'Sun by the window. I’ll let the sandwich enjoy it first.',
  ],
  [
    '春天一到，我的通勤卡又和花粉一起失踪。',
    'Spring arrives and my travelcard disappears in a cloud of pollen.',
  ],
  [
    '公园的水仙开了，我绕路还差点迟到。',
    'Daffodils in the park. Took a detour and nearly ran late.',
  ],
  [
    '冰箱贴满了假期表，门快打不开了。',
    'Holiday rotas all over the fridge. Nearly sealed the door shut.',
  ],
  [
    '夏天的巴士像温室，还种满了乘客。',
    'Summer buses are greenhouses planted with passengers.',
  ],
  [
    '落叶堵住排水口，我的皮鞋先发现的。',
    'Leaves blocked the drain. My shoes discovered it first.',
  ],
  [
    '天黑得早，我那件反光衣终于有戏份了。',
    'Dark early. My reflective jacket finally gets a role.',
  ],
  [
    '冬天找手套，总能找到两只不同的。',
    'In winter I always find two gloves. Never a matching pair.',
  ],
  [
    '天没亮就出门，路灯成了我的同事。',
    'Out before daylight. The streetlights are practically colleagues.',
  ],
  [
    '雨从领口进去，伞全程在保护我的背包。',
    'Rain down my collar. Umbrella did a fine job protecting my bag.',
  ],
  [
    '裤脚湿了半截，散热器那边还有空位吗？',
    'Trouser hems soaked. Any room left by the radiator?',
  ],
  [
    '晴天居然碰上休息日，得截张图。',
    'Sunshine on a day off. Better take a screenshot.',
  ],
  [
    '这云像老板说的“很快就好”。',
    'Those clouds look like the boss’s “nearly done”.',
  ],
  [
    '雪把车站变好看了，也让显示屏变诚实了：取消。',
    'Snow prettied up the station. The board simply says: cancelled.',
  ],
  [
    '你也来买午饭？一起排，队能显得短点。',
    'Lunch queue too? Join me. Might feel shorter.',
  ],
  [
    '我的备用充电线在抽屉，你知道那个抽屉。',
    'Spare cable’s in the drawer. You know which drawer.',
  ],
  [
    '给你留了靠窗的位子，窗缝我拿纸堵了。',
    'Saved the window seat. Stuffed paper in the draught.',
  ],
  [
    '有句话想找你练练，跟经理说的时候别结巴。',
    'Can I practise a sentence on you? Before I try it on the manager.',
  ],
  [
    '今天别聊工作，我连三明治都切成表格了。',
    'No work talk today. I’ve cut my sandwich into a spreadsheet.',
  ],
  [
    '要是你加班，走时敲我桌子，别又各自等着。',
    'If you’re staying late, tap my desk before leaving. No waiting for each other again.',
  ],
  [
    '这边给你留个位置，茶杯当占座牌了。',
    'Kept a seat here. Your mug is doing the reserving.',
  ],
  [
    '快到续签那阵了？我也在找旧工资单。',
    'Renewal coming round? I’m hunting old payslips too.',
  ],
  [
    '等邮件时我总刷收件箱，垃圾邮件倒挺准时。',
    'I keep refreshing for that email. Spam is remarkably punctual.',
  ],
  [
    '新职位那行字真长，工牌得横着戴吧。',
    'Long new job title. You’ll have to wear the badge sideways.',
  ],
  [
    '考完英语想吃什么？这题没有标准答案。',
    'What do you fancy after the English test? No model answer for that one.',
  ],
  [
    '周末不碰工作群，除了有人发猫。',
    'No work chat at weekends. Unless someone posts a cat.',
  ],
  [
    '周二已经开始想周六了，算不算提前备课？',
    'Thinking about Saturday on Tuesday. Does that count as preparation?',
  ],
  [
    '烟花比办公室的投影清楚多了。',
    'Fireworks are much clearer than the office projector.',
  ],
  [
    '我拿了太妃糖，牙医暂时不在群里。',
    'Got some toffee. The dentist isn’t in this group chat.',
  ],
  [
    '篝火烤热了脸，背后还是英国天气。',
    'Face warm by the bonfire. British weather still at my back.',
  ],
  [
    '明年还站这儿吧，这边没有烟往脸上跑。',
    'Same spot next year? The smoke misses our faces here.',
  ],
]);
for (const [season, indices] of [
  [2, [10, 11]],
  [3, [12, 13]],
  [4, [14, 15]],
  [1, [16, 17]],
] as const)
  for (const i of indices) adeLines[i].season = season;
for (const i of [18, 19]) adeLines[i].weather = ['rain'];
adeLines[20].weather = ['sunny'];
adeLines[21].weather = ['cloudy'];
adeLines[22].weather = ['snow'];
for (let i = 23; i < 30; i++)
  adeLines[i].heartsMin = i < 25 ? 2 : i < 28 ? 4 : 6;
for (const i of [30, 31])
  adeLines[i].when = [{ visaMonthsLeftMax: b.renewalWindowMonths }];
adeLines[32].when = [{ flag: 'quarter-promoted' }];
adeLines[32].once = true;
adeLines[33].when = [{ flag: 'quarter-exam-passed' }];
adeLines[33].once = true;
adeLines[34].dayKinds = ['weekend'];
adeLines[35].dayKinds = ['workday'];
for (let i = 36; i < 40; i++) adeLines[i].festival = 'bonfire-night';

const helenLines = lines('helen', [
  [
    '早，门有点沉，得连同昨天的雨一起推开。',
    'Morning. Heavy door. You have to push yesterday’s rain out with it.',
  ],
  [
    '白板笔又干了，它比我们更早放学。',
    'Marker’s dry again. It finishes class before we do.',
  ],
  [
    '我带了两副眼镜，两副都在找。',
    'Brought two pairs of glasses. Looking for both.',
  ],
  [
    '今天听力材料里那辆巴士，比真的准时。',
    'The bus in today’s listening exercise is more punctual than the real one.',
  ],
  [
    '这间教室的钟一直很有自己的主意。',
    'The clock in this classroom has strong opinions of its own.',
  ],
  [
    '茶杯别放讲义上，上次圆圈被当成重点了。',
    'Cup off the handout. Last time the tea ring became a key point.',
  ],
  [
    '图书馆那本大字书又被借走了，眼睛也受欢迎。',
    'Large-print book’s out again. Someone else’s eyes had the same idea.',
  ],
  [
    '我写了购物单，最后拿它讲了一节课。',
    'Wrote a shopping list. Ended up teaching a lesson with it.',
  ],
  [
    '不用收椅子，下一班学员已经在门口脱雨衣了。',
    'Leave the chairs. The next class is peeling off raincoats at the door.',
  ],
  [
    '有人问我的口音哪来的，我说公交终点站。',
    'Someone asked where my accent was from. I said the bus terminus.',
  ],
  [
    '春假刚过，粉笔盒里长了片落花。',
    'Back after spring break. Found a fallen petal in the chalk box.',
  ],
  [
    '窗外鸟叫太响，听力练习有伴奏了。',
    'Birds outside are loud. Free accompaniment for listening practice.',
  ],
  [
    '电风扇只会吹走最重要的那页纸。',
    'The fan blows away only the most important sheet.',
  ],
  [
    '天亮这么久，回家还以为有一节晚课。',
    'Light so late I get home thinking there’s another evening class.',
  ],
  [
    '开学的走廊又有湿外套味了。',
    'Term starts and the corridor smells of wet coats again.',
  ],
  [
    '树叶夹在书里，可惜不是我刚读的那页。',
    'Leaf in my book. Sadly not on the page I’d reached.',
  ],
  [
    '手冻僵时，签名会比平时更有艺术性。',
    'Cold hands make my signature rather more artistic.',
  ],
  [
    '暖气边的位置坐满了，大家的听力突然很集中。',
    'Seats by the radiator filled first. Very attentive listeners there.',
  ],
  [
    '雨声比录音还清楚，我得把音量再调一点。',
    'Rain’s clearer than the recording. I’ll turn it up a touch.',
  ],
  [
    '湿伞搁门后吧，它也需要下课休息。',
    'Umbrella behind the door. It needs a break too.',
  ],
  [
    '晴天的窗玻璃，能看见上次擦漏的地方。',
    'Sun through the windows reveals every bit I missed cleaning.',
  ],
  [
    '云把教室照成旧照片，灯倒还没坏。',
    'Clouds make the room look like an old photograph. The lights still work.',
  ],
  [
    '雪天来上课的人，鞋底都带着一段故事。',
    'Everyone arriving on a snow day brings a story on their soles.',
  ],
  [
    '又碰见了。上次那本书读到哪儿了？',
    'You again. How far did you get with that book?',
  ],
  ['你坐这儿吧，这张桌子不晃。', 'Sit here. This desk doesn’t wobble.'],
  [
    '我记得你喝茶不放糖，今天没拿错吧？',
    'No sugar in your tea, I remember. Got it right today?',
  ],
  [
    '有句话今天说得很顺，我刚才都忘了记笔记。',
    'That sentence flowed so well I forgot to take notes.',
  ],
  [
    '这本书给你留着，里面还有我年轻时的铅笔字。',
    'Kept this book for you. My younger self’s pencil notes are still inside.',
  ],
  [
    '今天换你挑话题，我已经讲过三遍天气了。',
    'Your choice of topic. I’ve done the weather three times today.',
  ],
  [
    '路上碰见也喊我名字，别隔着菜摊叫老师啦。',
    'Use my name in town. No “Teacher!” across the vegetable stall.',
  ],
  [
    '文件忙的时候，来这儿安静坐一会儿也行。',
    'When paperwork gets busy, you can always sit quietly here.',
  ],
  [
    '等回音挺磨人的，我有一整壶茶。',
    'Waiting for news wears you out. I’ve a whole pot of tea.',
  ],
  [
    '升职了？那今天的聊天得换个新开头。',
    'Promotion? We’ll need a new opening for today’s conversation.',
  ],
  [
    '考完先把笔放下，手指也该松口气。',
    'Test over? Put the pen down. Give your fingers a breather.',
  ],
  [
    '周末课的饼干比晚课多，别告诉晚课那班。',
    'More biscuits in the weekend class. Don’t tell the evening lot.',
  ],
  [
    '下班来上课辛苦了，我先给你找把干椅子。',
    'Long day before class. Let me find you a dry chair.',
  ],
  [
    '今晚的“轰”不用查词典，大家都听懂了。',
    'No dictionary needed for tonight’s “bang”. Everyone understood.',
  ],
  [
    '太妃糖粘住牙，我现在不适合示范发音。',
    'Toffee stuck to my teeth. Not the best moment for pronunciation practice.',
  ],
  [
    '烟花散了还有火光，倒不急着找回教案。',
    'Fireworks done, bonfire still glowing. Lesson plans can wait.',
  ],
  [
    '给你留了围巾这一头，站近点就不漏风。',
    'Here’s the other end of my scarf. Closer together keeps the draught out.',
  ],
]);
for (const [season, indices] of [
  [2, [10, 11]],
  [3, [12, 13]],
  [4, [14, 15]],
  [1, [16, 17]],
] as const)
  for (const i of indices) helenLines[i].season = season;
for (const i of [18, 19]) helenLines[i].weather = ['rain'];
helenLines[20].weather = ['sunny'];
helenLines[21].weather = ['cloudy'];
helenLines[22].weather = ['snow'];
for (let i = 23; i < 30; i++)
  helenLines[i].heartsMin = i < 25 ? 2 : i < 28 ? 4 : 6;
for (const i of [30, 31])
  helenLines[i].when = [{ visaMonthsLeftMax: b.renewalWindowMonths }];
helenLines[32].when = [{ flag: 'quarter-promoted' }];
helenLines[32].once = true;
helenLines[33].when = [{ flag: 'quarter-exam-passed' }];
helenLines[33].once = true;
helenLines[34].dayKinds = ['weekend'];
helenLines[35].dayKinds = ['workday'];
for (let i = 36; i < 40; i++) helenLines[i].festival = 'bonfire-night';

export const npcs: Npc[] = [
  {
    id: 'margaret',
    name: text('玛格丽特', 'Margaret'),
    role: text('退休邻居，菜地老手', 'Retired neighbour and allotment regular'),
    schedule: schedule(
      [
        { from: 0, at: 'home-street' },
        { from: 540, at: 'allotment-plots' },
        { from: 720, at: 'cafe' },
        { from: 900, at: 'allotment' },
        { from: 1080, at: 'home-street' },
      ],
      [
        { from: 0, at: 'home-street' },
        { from: 540, at: 'shop' },
        { from: 660, at: 'allotment' },
        { from: 960, at: 'park-bench' },
        { from: 1080, at: 'home-street' },
      ],
      [
        { from: 0, at: 'home-street' },
        { from: 600, at: 'cafe' },
        { from: 840, at: 'library' },
        { from: 1020, at: 'home-street' },
      ],
    ),
    gifts: {
      loved: ['strawberry-jam', 'tulip'],
      liked: ['tea', 'flowers', 'potato'],
      disliked: ['old-boot', 'shopping-trolley', 'pike'],
    },
    reactions: reactions(
      text(
        '你记着我喜欢的东西呢，快来喝杯茶。',
        'You remembered what I like. Come and have a cup of tea.',
      ),
      text(
        '这味儿……我先放小屋外面吧。',
        'That smell… best leave it outside the shed.',
      ),
    ),
    lines: margaretLines,
  },
  {
    id: 'ade',
    name: text('阿德', 'Ade'),
    role: text('同事，也在准备续签', 'Colleague, also preparing a renewal'),
    schedule: schedule(
      [
        { from: 0, at: 'bus-stop' },
        { from: 540, at: 'work' },
        { from: 1020, at: 'cafe' },
        { from: 1140, at: 'pub' },
        { from: 1320, at: 'home-street' },
      ],
      [
        { from: 0, at: 'home-street' },
        { from: 600, at: 'pond' },
        { from: 840, at: 'cafe' },
        { from: 1080, at: 'pub-garden' },
        { from: 1260, at: 'home-street' },
      ],
      [
        { from: 0, at: 'home-street' },
        { from: 540, at: 'work' },
        { from: 1020, at: 'pub' },
        { from: 1260, at: 'home-street' },
      ],
    ),
    gifts: {
      loved: ['cake', 'fish-and-potatoes'],
      liked: ['tea', 'biscuits', 'corn'],
      disliked: ['old-boot', 'shopping-trolley', 'turnip'],
    },
    reactions: reactions(
      text(
        '蛋糕级别的好消息！我去拿两把叉子。',
        'Cake-level good news! I’ll get two forks.',
      ),
      text(
        '这个先别靠近我的午饭，拜托。',
        'Please keep that away from my lunch.',
      ),
    ),
    lines: adeLines,
  },
  {
    id: 'helen',
    name: text('海伦', 'Helen'),
    role: text('语言学校 ESOL 老师', 'ESOL teacher at the college'),
    schedule: schedule(
      [
        { from: 0, at: 'home-street' },
        { from: 540, at: 'library' },
        { from: 780, at: 'college' },
        { from: 1260, at: 'college-steps' },
        { from: 1320, at: 'home-street' },
      ],
      [
        { from: 0, at: 'home-street' },
        { from: 600, at: 'college' },
        { from: 840, at: 'library-steps' },
        { from: 1020, at: 'park-path' },
        { from: 1140, at: 'home-street' },
      ],
      [
        { from: 0, at: 'home-street' },
        { from: 540, at: 'library' },
        { from: 780, at: 'college' },
        { from: 1260, at: 'home-street' },
      ],
    ),
    gifts: {
      loved: ['tea', 'flowers'],
      liked: ['biscuits', 'strawberry-jam', 'salad'],
      disliked: ['old-boot', 'shopping-trolley', 'pike'],
    },
    reactions: reactions(
      text(
        '这正好配我那只缺了角的杯子，谢谢。',
        'Just the thing for my chipped cup. Thank you.',
      ),
      text(
        '谢谢惦记，不过它还是留在教室外吧。',
        'Kind thought, but let’s leave it outside the classroom.',
      ),
    ),
    lines: helenLines,
  },
];

const supporting: [
  string,
  string,
  string,
  string,
  Npc['schedule'][number]['stops'][number]['at'],
  [string, string][],
][] = [
  [
    'priya',
    '普里娅',
    'Priya',
    'GP 诊所前台',
    'gp',
    [
      [
        '预约本翻旧了，封皮比我先下班。',
        'The appointment book cover has clocked off before me.',
      ],
      ['电话停了？我先喝口水。', 'Phones quiet? Time for a sip of water.'],
      [
        '那把椅子别坐，靠背有自己的想法。',
        'Avoid that chair. The back has ideas of its own.',
      ],
      ['周末终于不用拼读姓氏了。', 'A weekend off spelling surnames.'],
      [
        '伞套在门边，地板今天已经喝够了。',
        'Umbrella bags by the door. The floor’s had enough to drink.',
      ],
    ],
  ],
  [
    'dave',
    '戴夫',
    'Dave',
    '酒吧老板，pub quiz 主持',
    'pub',
    [
      [
        '今晚题目我锁抽屉了，钥匙还在找。',
        'Quiz questions locked away. Now to find the key.',
      ],
      [
        '杯垫别叠，昨天倒了一座塔。',
        'Don’t stack the beer mats. Lost a whole tower yesterday.',
      ],
      [
        '无酒精的也有，我给你找个干杯子。',
        'Alcohol-free too. Let me find a dry glass.',
      ],
      ['答题笔都系绳了，照样少了两支。', 'Pens tied down. Still two missing.'],
      [
        '雨停再走？门口那滩挺有深度。',
        'Wait for the rain? That puddle has ambitions.',
      ],
    ],
  ],
  [
    'rahman',
    '拉赫曼',
    'Rahman',
    '街角小店老板，早已入籍',
    'shop',
    [
      [
        '零钱有，正好硬币把抽屉卡住了。',
        'Plenty of change. Coins have jammed the drawer again.',
      ],
      [
        '报纸还剩一份，雨替它翻过页了。',
        'One paper left. Rain’s already turned a page.',
      ],
      ['种子在茶旁边，别一块泡了。', 'Seeds beside the tea. Don’t brew both.'],
      [
        '这儿开了几十年，门铃还是这个调。',
        'Decades here. Doorbell still sings the same note.',
      ],
      [
        '今天的蛋糕到了，我数了两遍才忍住。',
        'Cakes arrived. Counted them twice to resist one.',
      ],
    ],
  ],
  [
    'lina',
    '莉娜',
    'Lina',
    '正在为拒签找办法的朋友',
    'cafe',
    [
      [
        '今天先喝咖啡，文件夹放椅子上歇歇。',
        'Coffee first. The folder can rest on that chair.',
      ],
      [
        '我把信又读了一遍，这次没洒茶。',
        'Read the letter again. No tea spilt this time.',
      ],
      [
        '等回电话时，我把围巾织长了一截。',
        'Scarf grew a bit while I waited for a call.',
      ],
      [
        '能陪我走到车站吗？还不急着坐车。',
        'Walk to the station with me? No train to catch yet.',
      ],
      [
        '今天想聊点别的，比如这块太干的蛋糕。',
        'Something else today. Like this very dry cake.',
      ],
    ],
  ],
  [
    'gareth',
    '加雷思',
    'Gareth',
    '邮差',
    'postbox',
    [
      [
        '棕色信封先放平，别让它吓着茶杯。',
        'Brown envelope flat first. Don’t let it frighten the teacup.',
      ],
      [
        '这条街的门牌，雨天就爱躲起来。',
        'Street numbers love hiding in the rain.',
      ],
      [
        '狗已经认得我的鞋，不必再闻一遍。',
        'Dog knows these shoes. No second sniff needed.',
      ],
      [
        '包里最重的是超市传单，不是秘密。',
        'Heaviest things in the bag are supermarket leaflets, not secrets.',
      ],
      [
        '信送完了，我也能坐一下那张长椅了。',
        'Post done. My turn on the bench.',
      ],
    ],
  ],
];
const roles: Record<string, string> = {
  priya: 'GP receptionist',
  dave: 'Publican and quiz host',
  rahman: 'Long-established shopkeeper and British citizen',
  lina: 'Friend finding a way through a visa refusal',
  gareth: 'Postal worker',
};
for (const [id, zhCN, en, role, at, pairs] of supporting)
  npcs.push({
    id,
    name: text(zhCN, en),
    role: text(role, roles[id]),
    schedule: schedule(
      [
        { from: 0, at: 'home-street' },
        { from: 540, at },
        { from: 1080, at: 'high-street-east' },
        { from: 1260, at: 'home-street' },
      ],
      [
        { from: 0, at: 'home-street' },
        { from: 600, at: id === 'priya' ? 'park-path' : at },
        { from: 1080, at: 'bench' },
      ],
      [
        { from: 0, at: 'home-street' },
        {
          from: 540,
          at: id === 'priya' ? 'cafe' : id === 'gareth' ? 'shop' : at,
        },
        { from: 1080, at: 'cafe' },
      ],
    ),
    gifts: {
      loved: [],
      liked: ['tea', 'biscuits'],
      disliked: ['old-boot', 'shopping-trolley'],
    },
    reactions: reactions(
      text('太好了，正想着这个呢。', 'Lovely, I was just thinking of that.'),
      text('这个……我先找个地方搁着。', 'Well… I’ll find somewhere to put it.'),
    ),
    lines: lines(id, pairs),
  });

const scenes: [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
][] = [
  [
    'margaret',
    '小屋钥匙',
    'The shed key',
    '玛格丽特拎着两只水壶，空不出手开门。',
    'Margaret has a watering can in each hand and no hand left for the door.',
    '接过水壶',
    'Take a watering can',
    '替她开门',
    'Open the door',
  ],
  [
    'margaret',
    '有名字的木牌',
    'A name on a stake',
    '木牌上写着你的名字，字比她种的芜菁还直。',
    'Your name is on a wooden stake, straighter than her turnips.',
    '一起把牌插稳',
    'Set the stake together',
    '请她喝杯茶',
    'Offer her tea',
  ],
  [
    'margaret',
    '少一把椅子',
    'One chair short',
    '她搬出丈夫留下的折椅，铰链轻轻响了一声。',
    'She unfolds her late husband’s chair. The hinge gives a quiet squeak.',
    '坐下来陪她',
    'Sit with her',
    '陪她擦干椅子',
    'Help wipe the chair',
  ],
  [
    'margaret',
    '明年的种子',
    'Seeds for next year',
    '她把晒干的种子分成两包，在你那包画了朵花。',
    'She divides the dried seeds into two packets and draws a flower on yours.',
    '约好春天再种',
    'Plan a spring planting',
    '把她那包收进小屋',
    'Put her packet in the shed',
  ],
  [
    'ade',
    '复印机旁',
    'By the copier',
    '阿德拿着歪掉的复印件，笑着问你那台怎么用。',
    'Ade holds a crooked copy and asks, laughing, how that machine works.',
    '一起重新复印',
    'Try another copy together',
    '把自己的夹子借他',
    'Lend him a folder clip',
  ],
  [
    'ade',
    '午饭的空位',
    'A seat at lunch',
    '他把午饭桌边的包拿开，给你留了整张椅子。',
    'He moves his bag off the lunch table chair and leaves it for you.',
    '坐下一起吃',
    'Sit down for lunch',
    '帮他把茶端来',
    'Bring his tea over',
  ],
  [
    'ade',
    '收件箱刷新',
    'Refresh the inbox',
    '阿德的茶早凉了，屏幕上还是同一封旧邮件。',
    'Ade’s tea is cold. The same old email is still on the screen.',
    '陪他去散步',
    'Walk with him',
    '替他换杯热茶',
    'Make him fresh tea',
  ],
  [
    'ade',
    '留在抽屉的工牌',
    'The badge in the drawer',
    '旧工牌背面写着你的分机号，他说这个一直没换。',
    'Your extension is on the back of his old badge. He says he’s kept it there.',
    '约好下周午饭',
    'Arrange lunch next week',
    '给旧工牌拍张照',
    'Photograph the old badge',
  ],
  [
    'helen',
    '晃动的桌子',
    'The wobbly desk',
    '海伦蹲着垫桌脚，课本堆得像小塔。',
    'Helen crouches by a desk leg beside a tower of textbooks.',
    '帮她扶稳桌子',
    'Hold the desk steady',
    '把书搬到窗边',
    'Move the books to the window',
  ],
  [
    'helen',
    '窗边的书签',
    'The bookmark',
    '她在借书里夹了张纸条，写着上回没聊完的话题。',
    'A note in the library book keeps the conversation you left unfinished.',
    '留下自己的书签',
    'Leave a bookmark of your own',
    '陪她再聊一会儿',
    'Stay for a chat',
  ],
  [
    'helen',
    '没写完的讲义',
    'The unfinished handout',
    '海伦承认第一次站讲台时，把名字也拼错了。',
    'Helen admits she misspelt her own name at her first lesson.',
    '分享自己的糗事',
    'Share your own mishap',
    '一起把讲义理好',
    'Sort the handouts together',
  ],
  [
    'helen',
    '不点名的下午',
    'No register today',
    '她把点名册收进包，只带着两杯茶走到长椅边。',
    'She puts the register away and brings two cups of tea to the bench.',
    '叫她海伦',
    'Call her Helen',
    '替她拿住茶杯',
    'Take a teacup from her',
  ],
];
export const heartEvents: GameEvent[] = scenes.map(
  ([npc, title, titleEn, zhCN, en, first, firstEn, second, secondEn], i) => {
    const level = [2, 4, 6, 8][i % 4];
    const friend =
      npc === 'margaret'
        ? 'friend-garden'
        : npc === 'ade'
          ? 'friend-neighbour'
          : 'friend-library';
    return {
      id: `heart-${npc}-${level}`,
      title: text(title, titleEn),
      text: text(zhCN, en),
      weight: 1,
      once: true,
      channel: `npc:${npc}`,
      speaker: npc,
      heart: { npc, hearts: level },
      choices: [
        {
          id: 'stay',
          label: text(first, firstEn),
          sets: level === 2 ? [friend] : [],
          effects: [
            {
              type: 'stat',
              key:
                npc === 'margaret'
                  ? 'health'
                  : npc === 'ade'
                    ? 'career'
                    : 'english',
              delta: b.heartHelp,
            },
            { type: 'friendship', npc, delta: b.talkFriendship },
          ],
        },
        {
          id: 'help',
          label: text(second, secondEn),
          sets: level === 2 ? [friend] : [],
          effects: [
            { type: 'stat', key: 'mood', delta: b.heartMood },
            { type: 'friendship', npc, delta: b.talkFriendship },
          ],
        },
      ],
    };
  },
);
