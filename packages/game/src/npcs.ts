import { balance as b } from './balance';
import { festivalDialogue } from './festivals';
import { familyNpcs, familyHeartEvents } from './family';
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

const extraDailyLines: Record<string, [string, string][]> = {
  priya: [
    [
      '订书机躲在纸堆下，我听见它笑了。',
      'The stapler is under the papers. I can hear it laughing.',
    ],
    [
      '那盆塑料花倒是不怕我忘记浇水。',
      'At least the plastic flowers survive my forgetting to water them.',
    ],
    [
      '门口的新垫子专收泥，不收脚步声。',
      'The new mat catches mud, but not the sound of footsteps.',
    ],
    [
      '我的午饭在冰箱，叉子在另一个宇宙。',
      'My lunch is in the fridge. My fork is in another universe.',
    ],
    [
      '有人把杂志按颜色排了，我舍不得动。',
      'Someone arranged the magazines by colour. I cannot disturb them.',
    ],
    [
      '这支笔总漏墨，我的拇指先签到了。',
      'This pen leaks. My thumb has signed in first.',
    ],
    [
      '今天带了梨，午休时它已经滚到包底。',
      'Brought a pear. It rolled to the bottom of my bag before lunch.',
    ],
    [
      '我给椅脚贴了垫，终于听得见自己想事。',
      'Pads on the chair legs. I can finally hear myself think.',
    ],
    [
      '同事说我电话里的声音比本人清醒。',
      'My colleague says I sound more awake on the phone than in person.',
    ],
    [
      '小孩画的太阳，贴得比窗户还高。',
      'A child drew a sun. It is stuck higher than the window.',
    ],
    [
      '春天的风把门口传单都翻到背面了。',
      'Spring wind turned all the leaflets over outside.',
    ],
    [
      '夏天我用凉水瓶压住午饭的餐巾。',
      'In summer my cold water bottle holds the lunch napkin down.',
    ],
    [
      '落叶黏在门上，看起来像预约便签。',
      'Leaves stuck to the door look like appointment notes.',
    ],
    [
      '冬天我先暖手，才摸那把金属钥匙。',
      'In winter I warm my hands before touching the metal key.',
    ],
    [
      '雨天每把伞都滴在同一块地砖上。',
      'Every wet umbrella drips on the very same tile.',
    ],
    [
      '太阳照到前台时，眼镜也想下班。',
      'When sunlight reaches the desk, my glasses want a break too.',
    ],
    [
      '雪粘在鞋底，走廊忽然多了小脚印。',
      'Snow sticks to soles, leaving little footprints in the corridor.',
    ],
    [
      '周末我散步不带工作那只包。',
      'On weekend walks I leave my work bag behind.',
    ],
    [
      '下班后最喜欢听的，是水壶咔嗒一声。',
      'My favourite sound after work is the kettle clicking off.',
    ],
    [
      '你的杯子我认得，手柄有个小蓝点。',
      'I know your cup. A little blue dot on the handle.',
    ],
    [
      '又来买茶？我上次那包还舍不得拆。',
      'More tea? I have been saving the packet from last time.',
    ],
    [
      '你在这儿，我可以把半句笑话讲完。',
      'With you here I can finish that half-told joke.',
    ],
    [
      '上回你扶的门，今天终于不吱呀了。',
      'The door you held last time has finally stopped squeaking.',
    ],
    [
      '我给你留了张没沾咖啡的纸巾。',
      'Saved you a napkin without coffee on it.',
    ],
    ['今天不赶时间，绕池塘走走？', 'No hurry today. A walk round the pond?'],
    [
      '我的针线盒能修袖口，修不了闹钟。',
      'My sewing kit repairs cuffs, but not alarm clocks.',
    ],
    [
      '等信很累吧，我把这张桌子清出来了。',
      'Waiting for a letter is tiring. I cleared this table for you.',
    ],
    [
      '文件忙完了吗？我的拼图还缺一块蓝天。',
      'Paperwork done? My puzzle is still missing a patch of sky.',
    ],
    [
      '我把购物单写在手上，洗手后全忘了。',
      'Wrote my shopping list on my hand. Washing up erased it.',
    ],
    [
      '那只麻雀每天来，从没预约过。',
      'That sparrow visits every day without an appointment.',
    ],
    [
      '休息时我把手机扣过来，茶才喝得热。',
      'On breaks I turn my phone over. My tea stays hot that way.',
    ],
    [
      '围巾是自己织的，两头不太认识。',
      'Knitted this scarf myself. The ends do not quite match.',
    ],
    [
      '杯沿缺了一点，喝茶得找对方向。',
      'A chip in the rim. Tea needs the right angle.',
    ],
    [
      '听见你的脚步，我就知道茶该续了。',
      'Hearing your footsteps tells me it is time for more tea.',
    ],
    [
      '今天想坐着发会儿呆，你也可以坐。',
      'I fancy sitting quietly today. There is room beside me.',
    ],
  ],
  dave: [
    [
      '黑板擦丢了，菜单暂时多了一朵云。',
      'Lost the board eraser. The menu has gained a cloud.',
    ],
    [
      '今天的汤不在测验里，放心尝。',
      'The soup is not part of the quiz. Taste away.',
    ],
    [
      '桌脚垫了杯垫，杯子反倒没垫的了。',
      'Beer mats under the table legs. None left for the glasses.',
    ],
    [
      '门铃像只打嗝的鸟，我还挺喜欢。',
      'The doorbell sounds like a hiccupping bird. I rather like it.',
    ],
    [
      '我练习念队名，猫已经听得睡着了。',
      'Practising team names. The cat has fallen asleep listening.',
    ],
    [
      '那张椅子留着，坐下不会突然矮一截。',
      'Keep that chair. It will not suddenly lose height.',
    ],
    [
      '厨房的钟慢一点，炸薯条可不等它。',
      'The kitchen clock is slow. The chips will not wait for it.',
    ],
    [
      '我给笔装了新芯，题目可没换简单的。',
      'New ink in the pens. The questions are no easier.',
    ],
    [
      '昨晚有人把答题纸当购物单带走了。',
      'Someone took the answer sheet home as a shopping list.',
    ],
    [
      '灯罩擦干净了，酒吧年轻了一个下午。',
      'Cleaned the lampshades. The pub looked younger for an afternoon.',
    ],
    [
      '春天把门撑开，花粉也来答题。',
      'Door propped open in spring. Even pollen joins the quiz.',
    ],
    [
      '夏天的冰块化得比大家算分还快。',
      'Summer ice melts faster than we can add up the scores.',
    ],
    [
      '落叶跟着客人进门，不肯买饮料。',
      'Leaves follow customers in, refusing to buy a drink.',
    ],
    [
      '冬天的围巾挂满了，衣帽架像棵树。',
      'Winter scarves turn the coat stand into a tree.',
    ],
    ['雨敲棚顶，今天有免费鼓手。', 'Rain on the awning. A free drummer today.'],
    [
      '太阳一出，大家突然都认识花园的门。',
      'Sun comes out and everyone discovers the garden door.',
    ],
    [
      '雪天黑板上写热汤，粉笔都像暖和了。',
      'Hot soup on the snowy-day board. Even the chalk looks warmer.',
    ],
    [
      '周末的报纸没人翻体育版以外的页。',
      'At weekends nobody gets beyond the sports pages.',
    ],
    [
      '这支麦克风只在我讲笑话时咳嗽。',
      'This microphone only coughs during my jokes.',
    ],
    [
      '你老位置空着，杯垫我刚换过。',
      'Your usual seat is free. Fresh mat and all.',
    ],
    [
      '你来帮我听听，这道题有没有说清楚。',
      'Listen to this question for me. Is it clear enough?',
    ],
    [
      '上回那个队名我记住了，拼写得再问。',
      'Remember your team name. Will need the spelling again.',
    ],
    [
      '给你一支好写的笔，别告诉隔壁桌。',
      'A decent pen for you. Do not tell the next table.',
    ],
    [
      '你笑得这么早，我还没讲到包袱呢。',
      'Laughing already? I have not reached the punchline.',
    ],
    [
      '关店后我也爱坐着，换到桌子这边。',
      'After closing I like sitting on this side of the table.',
    ],
    [
      '新歌单没改成功，又放回那张老唱片。',
      'New playlist failed. Back to the old record.',
    ],
    [
      '文件先放椅子上，杯子底下会留圈。',
      'Put the folder on the chair. Cups leave rings.',
    ],
    [
      '等消息时来坐吧，今天没人催你交卷。',
      'Sit here while waiting for news. No answer sheet due today.',
    ],
    [
      '我擦杯子时常把自己擦得满袖口水。',
      'Polishing glasses usually leaves my sleeves wetter than the glasses.',
    ],
    [
      '台球杆修好了，准头得各人自己修。',
      'Cue repaired. Everyone must fix their own aim.',
    ],
    [
      '小碟子换了，大饼干依旧放不下。',
      'New saucers. The big biscuits still do not fit.',
    ],
    [
      '客人夸窗户亮，我刚擦的是镜子。',
      'Someone praised the bright window. I had polished the mirror.',
    ],
    [
      '收摊时数椅子，总有一把藏在门后。',
      'Counting chairs at closing. One always hides behind the door.',
    ],
    [
      '我给自己泡的茶，最后总是端给别人。',
      'Tea I make for myself always ends up with someone else.',
    ],
    [
      '今晚要是没人点歌，我就哼自己的。',
      'If nobody requests a song tonight, I will hum my own.',
    ],
  ],
  rahman: [
    [
      '价签笔找到了，在装价签笔的盒子外面。',
      'Found the pricing pen. Outside the box marked pricing pens.',
    ],
    [
      '货架最上层那罐茶，我也得踩小凳。',
      'Even I need the stool for that tea on the top shelf.',
    ],
    [
      '有人把饼干放到肥皂旁，香味倒挺一致。',
      'Biscuits beside the soap. Similar smell, admittedly.',
    ],
    [
      '门铃一响我就抬头，在家也这样。',
      'I look up at every doorbell. Even at home.',
    ],
    [
      '今天送来的箱子比里面的货还结实。',
      "Today's boxes are sturdier than their contents.",
    ],
    [
      '旧算盘还留着，用来镇住新收银机。',
      'Kept the old abacus. It intimidates the new till.',
    ],
    [
      '我的收音机只在新闻开始时没电。',
      'My radio only runs out of battery when the news begins.',
    ],
    [
      '面包放高一点，邻居的狗很懂礼貌地盯着。',
      "Bread up high. The neighbour's dog stares very politely.",
    ],
    [
      '这串钥匙跟了我好多年，圆环都亮了。',
      'These keys have been with me for years. The ring is polished smooth.',
    ],
    [
      '进门当心纸箱，我正和它们商量搬家。',
      'Mind the boxes. We are negotiating their relocation.',
    ],
    [
      '春天的种子袋，总比我的计划多。',
      'Spring seed packets always outnumber my plans.',
    ],
    [
      '夏天西红柿熟得快，冰箱的门更忙了。',
      'Tomatoes ripen fast in summer. The fridge door gets busy.',
    ],
    [
      '秋天我把热茶摆到离门近一点的地方。',
      'In autumn I move the hot tea closer to the door.',
    ],
    [
      '冬天的玻璃蒙雾，招牌像在做梦。',
      'Winter fog on the glass. The sign looks half asleep.',
    ],
    [
      '下雨天，门垫比收银机忙。',
      'On rainy days the doormat is busier than the till.',
    ],
    [
      '太阳照到糖罐上，整个柜台都发亮。',
      'Sun on the sugar jar makes the whole counter shine.',
    ],
    [
      '雪把门前盖住了，我得重新找台阶。',
      'Snow covered the entrance. I have to find the step again.',
    ],
    [
      '周末早晨报纸卖完，街上才像醒了。',
      'Once the weekend papers sell out, the street feels awake.',
    ],
    [
      '几十年前刚来时，我连这条街名都念不顺。',
      "Decades ago I could barely pronounce this street's name.",
    ],
    [
      '你常买的茶在这里，我没挪地方。',
      'Your usual tea is here. I have not moved it.',
    ],
    [
      '看你走过来，我就把硬币拿好了。',
      'Saw you coming and got the change ready.',
    ],
    [
      '你替我看那次店门，我还记着呢。',
      'I remember you watching the door for me.',
    ],
    [
      '今天别急着走，我想听你说完上次的事。',
      'No hurry today. I want to hear the rest of that story.',
    ],
    [
      '那张老照片里有我，找围裙最歪的那个。',
      'I am in that old photograph. Look for the crooked apron.',
    ],
    [
      '入籍那天拍的照片，领带歪得很认真。',
      'My citizenship-day photograph has a very determined crooked tie.',
    ],
    [
      '那天之后还是要早起开店，茶也照样凉。',
      'Still had to open early afterwards. The tea went cold as usual.',
    ],
    [
      '第一次在这里过冬，买了顶太大的帽子。',
      'My first winter here I bought a hat far too large.',
    ],
    [
      '等信的时候，我总把门铃听成邮车。',
      'Waiting for a letter, I mistook every doorbell for the post van.',
    ],
    [
      '纸袋放柜台下，塑料袋老爱飘走。',
      'Paper bags under the counter. Plastic ones keep floating away.',
    ],
    [
      '我把旧店牌留着，油漆比我头发还黑。',
      'Kept the old shop sign. Its paint is darker than my hair.',
    ],
    [
      '今天想早点关门，给窗台的花换水。',
      "Fancy closing early today to change the flowers' water.",
    ],
    [
      '那只猫只看鱼罐头，从不看价签。',
      'That cat studies the fish tins, never their prices.',
    ],
    [
      '小店灯亮起来，我才觉得下午到了。',
      'When the shop lights come on, it feels like afternoon.',
    ],
    [
      '我总把找零数出声，算是给硬币道别。',
      'I count change aloud. Saying goodbye to the coins.',
    ],
    [
      '下次带杯子来，别让茶只剩我一个人喝。',
      'Bring your cup next time. Tea need not be just for me.',
    ],
  ],
  lina: [
    [
      '今天把文件夹换成帆布包，肩膀轻一点。',
      'Canvas bag instead of the folder today. Easier on my shoulder.',
    ],
    [
      '我学会把冷咖啡当另一种饮料了。',
      'I have learnt to treat cold coffee as a different drink.',
    ],
    [
      '织到一半的围巾，已经比我有方向感。',
      'This half-knitted scarf has more sense of direction than me.',
    ],
    [
      '那扇门上有猫的鼻印，我每次都认得。',
      'Cat nose prints on that door. I recognise them every time.',
    ],
    [
      '今天不刷新邮箱，先把蛋糕上的莓吃了。',
      'No refreshing the inbox yet. Berries on the cake first.',
    ],
    [
      '我把便签贴在包里，开包像翻日历。',
      'Notes inside my bag. Opening it feels like turning a calendar.',
    ],
    [
      '昨晚煮的面太多，锅盖都盖不住。',
      'Too many noodles last night. The lid would not close.',
    ],
    [
      '图书馆的角落安静得能听见拉链。',
      'That library corner is quiet enough to hear a zip.',
    ],
    [
      '今天带了铅笔，想把池塘画得不像杯子。',
      'Brought a pencil. Trying to draw the pond without making it a cup.',
    ],
    [
      '新鞋还硬，我正跟它商量走慢点。',
      'New shoes are stiff. We are negotiating a slower pace.',
    ],
    [
      '春天的枝条有芽，我总忍不住数。',
      'Buds on spring branches. I keep counting them.',
    ],
    [
      '夏天太亮，窗帘也像没睡醒。',
      'Summer is so bright. Even the curtains look tired.',
    ],
    [
      '落叶在靴子边响，像有人拆信。',
      'Leaves by my boots sound like someone opening a letter.',
    ],
    [
      '冬天把围巾绕好，鼻尖还是会跑出来。',
      'Scarf wrapped for winter. My nose still escapes.',
    ],
    [
      '雨天不用决定去哪，咖啡馆已经替我选了。',
      'Rain chooses the café for me. One fewer decision.',
    ],
    [
      '太阳出来，我的速写本总算不怕湿。',
      'Sun out. The sketchbook can stop fearing the rain.',
    ],
    [
      '雪落在长椅上，坐下前得先借个位。',
      'Snow on the bench. Need to ask it to move first.',
    ],
    [
      '周末我把闹钟关了，猫没同意。',
      'Turned off the weekend alarm. The cat disagreed.',
    ],
    [
      '拒签信折过的地方，还能摸到一道棱。',
      'I can still feel the crease in the refusal letter.',
    ],
    [
      '你记得我不爱太甜，今天这杯正好。',
      'You remembered I do not like it too sweet. This is just right.',
    ],
    [
      '上回没讲完的故事，我带着后半段来了。',
      'Brought the rest of that unfinished story with me.',
    ],
    [
      '跟你走路，我终于不总盯着手机。',
      'Walking with you, I finally stop staring at the phone.',
    ],
    [
      '这团毛线替你留着，下回教你接线。',
      'Saved this wool for you. I will show you how to join it.',
    ],
    [
      '我想聊聊害怕的事，能先找张干椅子吗？',
      'I want to talk about being scared. A dry chair first?',
    ],
    [
      '今天想笑一下，刚才那只鸭子帮了忙。',
      'Wanted a laugh today. That duck helped.',
    ],
    [
      '我把要问的事写好了，纸背画了一条鱼。',
      'Wrote my questions down. Drew a fish on the back.',
    ],
    [
      '有时不知道说什么，我们就看看水吧。',
      'Sometimes words will not come. We can watch the water.',
    ],
    [
      '手机响的时候，咖啡匙总比我先跳起来。',
      'When the phone rings, the coffee spoon jumps before I do.',
    ],
    [
      '这张车站地图折不开了，路都挤在一起。',
      'The station map will not unfold. All the roads are squeezed together.',
    ],
    [
      '今天把抽屉理了，找回一枚旧发夹。',
      'Tidied a drawer today. Found an old hair clip.',
    ],
    ['我给自己留了一个空白下午。', 'I kept one afternoon completely free.'],
    [
      '这家店的椅子很熟悉，坐下不用想。',
      'These café chairs feel familiar. Sitting needs no thinking.',
    ],
    [
      '昨天买的面包，今天烤一下还能很好吃。',
      "Yesterday's bread is good again after a little toasting.",
    ],
    [
      '我在学缝包带，总把线留得太短。',
      'Learning to mend bag straps. Always cut the thread too short.',
    ],
    [
      '多坐一会儿吧，我还没喝到杯底。',
      'Stay a little longer. I have not reached the bottom of my cup.',
    ],
  ],
  gareth: [
    [
      '这袋传单太厚，像整条街订了同一本书。',
      'Such a thick bag of leaflets. As if the street ordered the same book.',
    ],
    [
      '门牌擦亮以后，我差点没认出来。',
      'Polished house number. Nearly did not recognise it.',
    ],
    [
      '那只狗今天叼了球，我算是带球上班了。',
      'The dog brought a ball. Apparently that is part of my round now.',
    ],
    [
      '邮筒上的鸟没搬家，我绕它开锁。',
      'Bird still on the postbox. I unlock around it.',
    ],
    [
      '橡皮筋缠在袖口，比手表还准时。',
      'Rubber band round my cuff. More punctual than my watch.',
    ],
    [
      '新鞋走路太响，猫老远就准备躲了。',
      'Noisy new shoes. Cats prepare to hide from far away.',
    ],
    [
      '有人把邮箱漆成蓝色，信看起来凉快了。',
      'Someone painted their letterbox blue. The letters look cooler.',
    ],
    [
      '这顶帽子防雨，唯独帽檐爱存水。',
      'Waterproof hat. The brim insists on storing rain.',
    ],
    [
      '我收工后总先解鞋带，再想晚饭。',
      'After work I untie my shoes before considering dinner.',
    ],
    [
      '有张明信片画着太阳，包里都暖和一点。',
      'A sunny postcard makes the whole bag feel warmer.',
    ],
    [
      '春天送信时，篱笆总想替我梳头。',
      'Spring hedges keep trying to comb my hair on the round.',
    ],
    [
      '夏天我带水，包里的信不肯替我拿。',
      'In summer I carry water. The letters refuse to help.',
    ],
    [
      '秋天信箱里混着叶子，我把两样分开。',
      'Autumn leaves in letterboxes. I sort them from the post.',
    ],
    [
      '冬天的门环摸一下，就能把手叫醒。',
      'A winter door knocker wakes my fingers instantly.',
    ],
    [
      '雨把地址打湿了，幸好我认得这条街。',
      'Rain blurred the address. Lucky I know this street.',
    ],
    ['晴天我能少拧一次袜子。', 'Sunshine means one fewer sock-wringing.'],
    [
      '雪上留下的路线，比导航诚实。',
      'My tracks in snow are more honest than the navigation app.',
    ],
    [
      '周末不背邮包，肩膀还会自己往上提。',
      'No weekend postbag. My shoulder still lifts itself.',
    ],
    [
      '棕色信封也可能只是改收垃圾的日子。',
      'A brown envelope can simply mean a new bin day.',
    ],
    [
      '你的门铃我认得，像短了一拍的歌。',
      'I know your doorbell. A song missing a beat.',
    ],
    [
      '你帮我扶那次车，我还没谢够。',
      'Still have not thanked you enough for steadying the bike.',
    ],
    [
      '收工后一起坐会儿？我带了自己的杯子。',
      'Sit together after my round? I brought my own cup.',
    ],
    [
      '你那双鞋修好了？我也该去一趟。',
      'Shoes repaired? I ought to take mine in too.',
    ],
    [
      '有时送完一条街，最想听见别人叫名字。',
      'After a whole street, sometimes I just want someone to use my name.',
    ],
    [
      '我给旧邮包装了新扣，还能继续走。',
      'New buckle on the old postbag. It can keep going.',
    ],
    [
      '别急着猜信里是什么，先把茶放稳。',
      'No hurry guessing the letter. Put the tea somewhere steady first.',
    ],
    [
      '文件夹看着沉，要我替你扶一下门吗？',
      'That folder looks heavy. Shall I hold the door?',
    ],
    [
      '等回信时，听见每辆车都像邮车吧。',
      'Waiting for news makes every van sound like the post van.',
    ],
    [
      '今天有封写得很漂亮的信，我只看了地址。',
      'Beautiful handwriting today. I only read the address.',
    ],
    ['这辆车的铃比我嗓门还响。', 'The bike bell is louder than my voice.'],
    [
      '我把手套晾在暖气旁，差点忘了带走。',
      'Dried my gloves by the radiator. Nearly left them there.',
    ],
    [
      '街角那扇门总夹袖子，我学会侧着站。',
      'That corner door catches sleeves. I have learnt to stand sideways.',
    ],
    [
      '我不怕绕路，只怕午饭的汤先凉了。',
      'Do not mind a detour. Just mind the lunch soup going cold.',
    ],
    [
      '长椅空着呢，这回我先坐了。',
      'Bench is free. This time I am sitting first.',
    ],
    [
      '明天换条近路，今天先把风景走完。',
      'A shortcut tomorrow. Today I will finish the scenic route.',
    ],
  ],
};
for (const npc of npcs.filter(
  (n) => !['margaret', 'ade', 'helen'].includes(n.id),
)) {
  npc.lines.push(
    ...extraDailyLines[npc.id].map(([zhCN, en], i) => ({
      id: `${npc.id}-daily-${i + 1}`,
      text: text(zhCN, en),
    })),
  );
  for (const [i, season] of [
    [10, 2],
    [11, 3],
    [12, 4],
    [13, 1],
  ] as const)
    npc.lines[i + 5].season = season;
  npc.lines[19].weather = ['rain'];
  npc.lines[20].weather = ['sunny'];
  npc.lines[21].weather = ['snow'];
  npc.lines[22].dayKinds = ['weekend'];
  for (let i = 24; i < 29; i++)
    npc.lines[i].heartsMin = i < 26 ? 2 : i < 28 ? 4 : 6;
  npc.lines[31].when = [{ visaMonthsLeftMax: b.renewalWindowMonths }];
}

const favourites: Record<string, [string[], string[], string, string]> = {
  priya: [
    ['tea', 'salad'],
    ['flowers', 'biscuits'],
    '正想找个安静地方喝茶，这个太合适了。',
    'A quiet cup of tea was just what I wanted. Perfect.',
  ],
  dave: [
    ['cake', 'fish-and-potatoes'],
    ['biscuits', 'baked-potato'],
    '这个值得单开一轮庆祝，我去找盘子。',
    'This deserves a celebration round. Let me get a plate.',
  ],
  rahman: [
    ['tea', 'strawberry-jam'],
    ['flowers', 'corn'],
    '你记着我的口味，今晚能慢慢尝了。',
    'You remembered my taste. I can enjoy this slowly tonight.',
  ],
  lina: [
    ['flowers', 'strawberry'],
    ['tea', 'biscuits'],
    '给我的？今天这张桌子好看多了。',
    'For me? This table looks much brighter today.',
  ],
  gareth: [
    ['tea', 'baked-potato'],
    ['biscuits', 'cake'],
    '送完这一袋，就坐下来慢慢享用。',
    'Once this bag is delivered, I will sit down and enjoy it.',
  ],
};
for (const npc of npcs.filter((n) => favourites[n.id])) {
  const [loved, liked, zhCN, en] = favourites[npc.id];
  npc.gifts.loved = loved;
  npc.gifts.liked = liked;
  npc.reactions.loved = text(zhCN, en);
  npc.reactions.disliked = text(
    npc.id === 'gareth'
      ? '这可不能装进邮包，纸会跟着遭殃。'
      : npc.id === 'dave'
        ? '这个先别进厨房，我去找个空桶。'
        : npc.id === 'priya'
          ? '这个气味，候诊室可受不了。'
          : npc.id === 'rahman'
            ? '先别放货架上，我拿个袋子。'
            : '谢谢惦记，不过先放远一点吧。',
    npc.id === 'gareth'
      ? 'Not in the postbag. The letters would suffer.'
      : npc.id === 'dave'
        ? 'Keep that out of the kitchen. I will find a bucket.'
        : npc.id === 'priya'
          ? 'The waiting room could not bear that smell.'
          : npc.id === 'rahman'
            ? 'Off the shelf, please. Let me find a bag.'
            : 'Kind thought, but a little further away please.',
  );
}
// The receptionist stays at the surgery on wet workdays; Dave serves until closing.
npcs.find((n) => n.id === 'priya')!.schedule[1].stops = [
  { from: 0, at: 'home-street' },
  { from: 540, at: 'gp' },
  { from: 1020, at: 'cafe' },
  { from: 1080, at: 'home-street' },
];
const dave = npcs.find((n) => n.id === 'dave')!;
for (const rule of dave.schedule.filter((r) => r.festival !== true))
  rule.stops = [
    { from: 0, at: 'home-street' },
    { from: 660, at: 'pub-garden' },
    { from: 720, at: 'pub' },
    { from: 1380, at: 'home-street' },
  ];

npcs.push(...familyNpcs);

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
const extraScenes: typeof scenes = [
  [
    'priya',
    '一支能写的笔',
    'A working pen',
    '普里娅甩了甩漏墨的笔，你递去纸巾，帮她把散开的便签压住。',
    'Priya shakes a leaking pen. You offer a tissue and hold down the scattered notes.',
    '扶住便签',
    'Hold the notes',
    '找来笔帽',
    'Find the pen cap',
  ],
  [
    'priya',
    '不响的手机',
    'A quiet phone',
    '下班后她把手机翻过来，挪开包，长椅上空出一个位置。',
    'After work she turns her phone over and moves her bag to clear a bench seat.',
    '并排坐下',
    'Sit beside her',
    '递过热茶',
    'Offer warm tea',
  ],
  [
    'priya',
    '歪掉的围巾',
    'The uneven scarf',
    '她拆开织歪的半截围巾，把针递给你，两人对着线团慢慢找头。',
    'She unpicks an uneven scarf and offers you a needle. Together you find the end of the wool.',
    '替她理线',
    'Untangle the wool',
    '学着织一行',
    'Try knitting a row',
  ],
  [
    'priya',
    '前台以外的名字',
    'A name beyond the desk',
    '有人叫她前台，她指着你笑，说今天只想做普里娅。你们把茶搬到窗边。',
    'Someone calls her reception. She smiles at you: today she is just Priya. You move the tea to the window.',
    '叫她的名字',
    'Use her name',
    '听她讲休息日',
    'Hear about her day off',
  ],
  [
    'dave',
    '藏起来的答案',
    'The hidden answers',
    '戴夫把测验答案塞反了，满桌都看见。他叹口气，拿粉笔重写题目。',
    'Dave exposes the answers by filing them backwards. He sighs and rewrites the quiz on the board.',
    '替他挡住纸页',
    'Shield the page',
    '帮忙擦黑板',
    'Wipe the board',
  ],
  [
    'dave',
    '空着的队名',
    'A blank team name',
    '他给你留了张答题纸，队名那栏空着，铅笔已经削好。',
    'He saves you an answer sheet, team name blank and pencil sharpened.',
    '写个离谱的队名',
    'Write a ridiculous team name',
    '拉他一起想',
    'Think of one together',
  ],
  [
    'dave',
    '关门后的老歌',
    'An old song after closing',
    '最后一位客人走了，戴夫放起旧唱片，擦杯子的手慢了下来。',
    'The last customer leaves. Dave puts on an old record and slows his glass polishing.',
    '听完这一面',
    'Stay for this side',
    '帮他收最后一桌',
    'Clear the last table',
  ],
  [
    'dave',
    '不算分的一轮',
    'A round without scores',
    '他翻出第一本题册，页边都是旧朋友的队名。你们读到同一处，一起笑了。',
    'His first quiz book has old friends’ team names in the margins. You laugh at the same note.',
    '添上你们的队名',
    'Add your team name',
    '把松页夹好',
    'Clip the loose pages',
  ],
  [
    'rahman',
    '门铃下的纸箱',
    'Boxes by the bell',
    '拉赫曼用脚扶着纸箱找剪刀，你把箱子按住，他终于能腾出手。',
    'Rahman steadies a box with his foot while hunting scissors. You hold it so he can let go.',
    '扶住纸箱',
    'Hold the box',
    '接过剪刀',
    'Take the scissors',
  ],
  [
    'rahman',
    '旧店牌',
    'The old shop sign',
    '旧店牌从柜台后露出一角，他抹掉灰，念出油漆已经淡了的字。',
    'An old shop sign shows behind the counter. He wipes the dust and reads the faded lettering.',
    '听他说旧街道',
    'Hear about the old street',
    '一起擦净店牌',
    'Clean the sign together',
  ],
  [
    'rahman',
    '照片里的领带',
    'The tie in the photo',
    '他找出入籍那天的照片，领带歪着，手里紧攥的纸却很平整。',
    'He finds his citizenship-day photograph: crooked tie, papers gripped carefully straight.',
    '陪他翻相册',
    'Turn the album pages',
    '问问那天的晚饭',
    'Ask about dinner that day',
  ],
  [
    'rahman',
    '另一只杯子',
    'The other cup',
    '收银机盖上布，拉赫曼从柜台下拿出另一只杯子，放到你的那边。',
    'Till covered, Rahman takes a second cup from below the counter and sets it on your side.',
    '坐到茶凉下来',
    'Stay until the tea cools',
    '收好店门旁的凳子',
    'Bring in the stool',
  ],
  [
    'lina',
    '帆布包里的纸',
    'Papers in the canvas bag',
    '莉娜把拒签信从包里拿出来，先折好纸角，再问你能不能坐一会儿。',
    'Lina takes the refusal letter from her bag, smooths a corner and asks you to stay a while.',
    '陪她坐着',
    'Sit with her',
    '听她慢慢说',
    'Let her take her time',
  ],
  [
    'lina',
    '没织完的围巾',
    'The unfinished scarf',
    '她把围巾铺在桌上，手指摸着最后一行，说今天不想再看文件。',
    'She lays the scarf on the table, touching the last row. No more paperwork today.',
    '一起找掉的针',
    'Find the dropped needle',
    '陪她去池塘',
    'Walk to the pond',
  ],
  [
    'lina',
    '地图折痕',
    'Creases in the map',
    '莉娜摊开车站地图，又合上。你们沿着熟路走，谁也没急着说下一站。',
    'Lina opens the station map, then folds it. You walk the familiar route without naming the next stop.',
    '陪她走完整条街',
    'Walk the whole street',
    '坐下看车来往',
    'Sit and watch the trains',
  ],
  [
    'lina',
    '留着的椅子',
    'A chair kept free',
    '她把咖啡馆的椅子拉开，杯旁压着你画过的纸。今天先听你说。',
    'She pulls out a café chair. Your old drawing lies by her cup. Today she wants to hear you.',
    '讲讲最近的小事',
    'Share a small recent story',
    '把那张画补完',
    'Finish the drawing',
  ],
  [
    'gareth',
    '松掉的车篮',
    'The loose basket',
    '加雷思扶着晃动的车篮，你托住另一边，两人终于找到松掉的扣子。',
    'Gareth holds a wobbling basket. You support the other side and find the loose clip.',
    '替他扣好',
    'Fasten the clip',
    '扶车让他修',
    'Hold the bike steady',
  ],
  [
    'gareth',
    '收工的长椅',
    'The bench after work',
    '他把空邮包放到脚边，先揉揉肩，再把长椅上的水擦干。',
    'He sets the empty postbag by his feet, rubs his shoulder and dries the bench.',
    '和他并排坐下',
    'Sit alongside him',
    '帮他拿稳茶杯',
    'Hold his tea',
  ],
  [
    'gareth',
    '藏在包底的卡',
    'The card at the bottom',
    '包底留着一张孩子写的感谢卡。他念错一个字，又认真念了一遍。',
    'A child’s thank-you card lives at the bottom of the bag. He stumbles on a word and reads it again.',
    '听他读完',
    'Listen to the end',
    '找个干袋装好',
    'Find a dry cover',
  ],
  [
    'gareth',
    '不用送的信',
    'A letter without a round',
    '他递来一张自己写的卡，没贴邮票。你们就在门口，把那几句话读完。',
    'He offers a handwritten card without a stamp. You read it together at the doorstep.',
    '把卡收好',
    'Keep the card safe',
    '请他进来喝茶',
    'Invite him for tea',
  ],
];
scenes.push(...extraScenes);
export const heartEvents: GameEvent[] = scenes.map(
  ([npc, title, titleEn, zhCN, en, first, firstEn, second, secondEn], i) => {
    const level = [2, 4, 6, 8][i % 4];
    const friend =
      npc === 'margaret'
        ? 'friend-garden'
        : npc === 'ade'
          ? 'friend-neighbour'
          : npc === 'helen'
            ? 'friend-library'
            : `friend-${npc}`;
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
              key: ['margaret', 'priya', 'gareth'].includes(npc)
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

heartEvents.push(...familyHeartEvents);

const lina = npcs.find((n) => n.id === 'lina')!;
lina.lines[1].forbids = ['lina-stayed'];
lina.lines.push({
  id: 'lina-stayed',
  requires: ['lina-stayed'],
  text: text(
    '留下的杯子洗好了，下次换我请咖啡。',
    'Washed the cup that stayed. Coffee is on me next time.',
  ),
});

for (const npc of npcs)
  npc.lines.push(
    ...festivalDialogue[npc.id].map(({ festival, text }) => ({
      id: `${npc.id}-festival-${festival}`,
      festival,
      text,
    })),
  );
