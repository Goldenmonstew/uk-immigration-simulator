import { everydayDialogue, townDialogue } from './town-dialogue';
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
const giftReplies: Record<string, [Text, Text]> = {
  margaret: [
    text(
      '真贴心，我把园艺手套摘了再收。',
      'Lovely thought. Let me take my gardening gloves off.',
    ),
    text(
      '谢谢啊，小屋里得给它找个位置。',
      'Thank you. I’ll find it a spot in the shed.',
    ),
  ],
  ade: [
    text(
      '这个可比会议纪要讨喜，谢谢！',
      'Much nicer than meeting minutes. Thanks!',
    ),
    text(
      '收到，我腾一下那个乱抽屉。',
      'Thanks. I’ll clear a bit of that chaotic drawer.',
    ),
  ],
  helen: [
    text(
      '谢谢，讲义堆旁边总算添点别的了。',
      'Thank you. Something besides handouts on my desk at last.',
    ),
    text(
      '这份心意我收下了，先挪开眼镜。',
      'Thank you for thinking of me. Let me move my glasses.',
    ),
  ],
  priya: [
    text(
      '你真会挑时候，我刚好能喘口气。',
      'Good timing. I’ve just got a moment to breathe.',
    ),
    text(
      '谢谢，我先挪开那支漏墨的笔。',
      'Thanks. I’ll move that leaky pen out of the way.',
    ),
  ],
  dave: [
    text(
      '好眼光！这份礼物可不用抢答。',
      'Good choice! No buzzer needed for this one.',
    ),
    text(
      '谢啦，我给它留个不沾杯圈的位置。',
      'Cheers. I’ll find a spot without a beer ring.',
    ),
  ],
  rahman: [
    text(
      '还给我带了东西，门铃该替你多响一声。',
      'A gift for me? The doorbell owes you an extra ring.',
    ),
    text(
      '谢谢惦记，我放自己那一边，不上货架。',
      'Thank you. On my side of the counter, off the shelves.',
    ),
  ],
  lina: [
    text(
      '今天包里总算多了件让人高兴的东西。',
      'Something cheerful for my bag today. Thank you.',
    ),
    text(
      '谢谢你，我把杯子挪开一点。',
      'Thank you. I’ll shift my coffee cup a little.',
    ),
  ],
  gareth: [
    text(
      '这回轮到我收东西了，真不错。',
      'My turn to receive something. Lovely.',
    ),
    text(
      '谢谢，放外套口袋，免得混进邮包。',
      'Thanks. Coat pocket, so it won’t get mixed up with the post.',
    ),
  ],
};
const reactions = (
  id: string,
  loved: Text,
  disliked: Text,
): Npc['reactions'] => ({
  loved,
  liked: giftReplies[id][0],
  neutral: giftReplies[id][1],
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
    'The sunflowers hid the shed. I’ve got to edge round for the door.',
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
    '窗边那盆花，邻居已经问了两回。',
    'Next door has asked twice about the flowers by the window.',
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
    '快到续签那阵了？我抽屉也翻乱了。',
    'Renewal coming round? My drawers are a mess too.',
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
    'Back after the Easter holidays. Found a fallen petal in the chalk box.',
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
    '秋季学期的走廊又有湿外套味了。',
    'The autumn-term corridor smells of wet coats again.',
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
    '下班来上课辛苦了，热水壶刚烧好。',
    'Long day before class. The kettle’s just boiled.',
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
      'margaret',
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
      'ade',
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
      'helen',
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
      id,
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
      'Someone arranged the magazines by colour. I can’t disturb them.',
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
      'More tea? I’ve been saving the packet from last time.',
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
      'Wrote my shopping list on my hand. Washing my hands erased it.',
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
      'Knitted this scarf myself. The ends don’t quite match.',
    ],
    [
      '杯沿缺了一点，喝茶得找对方向。',
      'A chip in the rim. Tea needs the right angle.',
    ],
    [
      '听见你的脚步，我就知道茶该续了。',
      'Hearing your footsteps tells me it’s time for more tea.',
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
      'The soup isn’t part of the quiz. Taste away.',
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
      'Keep that chair. It won’t suddenly lose height.',
    ],
    [
      '厨房的钟慢一点，炸薯条可不等它。',
      'The kitchen clock is slow. The chips won’t wait for it.',
    ],
    [
      '我给笔装了新芯，题目可没换简单的。',
      'New ink in the pens. The questions are no easier.',
    ],
    [
      '上回有人把答题纸当购物单带走了。',
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
      'I remember your team name. I’ll need the spelling again.',
    ],
    [
      '给你一支好写的笔，别告诉隔壁桌。',
      'A decent pen for you. Don’t tell the next table.',
    ],
    [
      '你笑得这么早，我还没讲到包袱呢。',
      'Laughing already? I haven’t reached the punchline.',
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
      '题册先合上吧，杯子底下会留圈。',
      'Close the quiz book for now. Cups leave rings.',
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
      'New saucers. The big biscuits still don’t fit.',
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
      'If nobody requests a song tonight, I’ll hum my own.',
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
      'Snow covered the entrance. I’ve got to find the step again.',
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
      'Your usual tea is here. I haven’t moved it.',
    ],
    [
      '看你走过来，我就把硬币拿好了。',
      'Saw you coming and got the change ready.',
    ],
    [
      '上回你帮我按住纸箱，我还记着呢。',
      'I remember you holding that box steady for me.',
    ],
    [
      '今天别急着走，我想听你说完上次的事。',
      'No hurry today. I want to hear the rest of that story.',
    ],
    [
      '那张老照片里有我，找围裙最歪的那个。',
      'I’m in that old photograph. Look for the crooked apron.',
    ],
    [
      '入籍那天拍的照片，领带歪得很认真。',
      'My citizenship-day photograph has a very determined crooked tie.',
    ],
    [
      '入籍第二天照样早起开店，茶也照样凉。',
      'The day after citizenship, I still opened early. Tea still went cold.',
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
      'Bring your cup next time. Tea needn’t be just for me.',
    ],
  ],
  lina: [
    [
      '今天把文件夹换成帆布包，肩膀轻一点。',
      'Canvas bag instead of the folder today. Easier on my shoulder.',
    ],
    [
      '我学会把冷咖啡当另一种饮料了。',
      'I’ve learnt to treat cold coffee as a different drink.',
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
      'You remembered I don’t like it too sweet. This is just right.',
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
      'Saved this wool for you. I’ll show you how to join it.',
    ],
    [
      '我想聊聊害怕的事，能先找个安静角落吗？',
      'I want to talk about frightening things. Can we find a quiet corner first?',
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
      'Sometimes words won’t come. We can watch the water.',
    ],
    [
      '手机响的时候，咖啡匙总比我先跳起来。',
      'When the phone rings, the coffee spoon jumps before I do.',
    ],
    [
      '这张车站地图折不开了，路都挤在一起。',
      'The station map won’t unfold. All the roads are squeezed together.',
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
      'Stay a little longer. I haven’t reached the bottom of my cup.',
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
    [
      '晴天我能少拧一次袜子。',
      'Sunshine means one less pair of socks to wring out.',
    ],
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
      '等回信时，信箱盖一响就想去看看吧。',
      'Waiting for a letter, every rattle of the letterbox makes you look.',
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
      'That corner door catches sleeves. I’ve learnt to stand sideways.',
    ],
    [
      '我不怕绕路，只怕午饭的汤先凉了。',
      'I don’t mind a detour. I just mind my soup going cold.',
    ],
    [
      '这张明信片没地址，是我拿来试笔的。',
      'No address on this postcard. I was testing a pen.',
    ],
    [
      '明天换条近路，今天先把风景走完。',
      'A shortcut tomorrow. Today I’ll finish the scenic route.',
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
    '正想歇一会儿，这份心意来得真巧。',
    'I was just ready for a break. What lovely timing.',
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
    'Once this bag is delivered, I’ll sit down and enjoy it.',
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
        ? 'Keep that out of the kitchen. I’ll find a bucket.'
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
    '玛格丽特领你回菜地，拎着两只水壶顶住小屋门，钥匙却滑进最深的口袋。\n你伸手托住一只水壶，她终于摸出钥匙，门板仍倔强地卡在地上。\n「得往上抬一点。」她把门把让给你，自己弯腰挪开挡路的花盆。\n门开了，里面全是泥和旧报纸的气味。她侧身扶住门，先给你让出路。',
    'Margaret leads you back to the allotment. Holding two watering cans against the shed door, she finds her key has slipped deep into her pocket.\nYou support one can. She finds the key, but the door still catches on the ground.\n“Lift it a little.” She leaves you the handle and moves a flowerpot out of the way.\nThe door opens onto mud and old newspapers. She holds the door sideways, making room for you.',
    '接过水壶放到架上',
    'Put the watering can on the shelf',
    '抬起门把让她进屋',
    'Lift the handle and let her in',
  ],
  [
    'margaret',
    '有名字的木牌',
    'A name on a stake',
    '玛格丽特约你去小屋看木牌，你的名字写在上面，墨迹还没干透。\n「字比我的芜菁直。」她把牌转给你看，末尾那一笔却蹭到了手背。\n她用鞋尖在空地划个小圈，举起木牌比了比，名字正好被一根草挡住。\n你拔掉那根草，她笑着把木牌递来，另一只手上还留着洗不掉的墨线。',
    'Margaret invites you to the shed to see a wooden stake. Your name is on it, the ink still damp.\n“Straighter than my turnips.” She turns it towards you, smearing the final stroke on the back of her hand.\nShe marks a circle in the soil with her shoe and holds up the stake. A blade of grass hides your name.\nYou pull the grass out. Laughing, she offers you the stake; a stubborn ink line remains on her other hand.',
    '一起把木牌插稳',
    'Set the stake together',
    '端茶给她洗掉墨迹',
    'Bring tea and help with the ink',
  ],
  [
    'margaret',
    '少一把椅子',
    'One chair short',
    '玛格丽特领你去小屋找折椅，手指忽然停在一处磨白的扶手上。\n「我丈夫总坐这把。」她把椅子展开，铰链响了一声，人却没坐下。\n你在旁边等着。她用拇指擦掉扶手上的一点土，才把椅子往你这边推。\n她另搬来一把小凳，两人之间隔着水壶。壶嘴滴着水，她终于说起往事。',
    'Margaret takes you to the shed for a folding chair. Her fingers pause on its worn white arm.\n“My husband always sat here.” She opens it. The hinge squeaks, but she stays standing.\nYou wait beside her. She rubs a speck of soil off the arm, then slides the chair towards you.\nShe fetches a small stool. A watering can drips between you as she finally begins a story.',
    '坐下来听她讲往事',
    'Sit and hear her story',
    '陪她擦净折椅扶手',
    'Help clean the chair arms',
  ],
  [
    'margaret',
    '明年的种子',
    'Seeds for next year',
    '玛格丽特招呼你去小屋分种子，一粒卡在报纸折缝里，怎么拨都不肯走。\n你抬起纸角，她接住那粒种子，笑着说连它也舍不得分家。\n她将种子分进两只纸袋，在给你的那包画了朵花，又添上一片歪叶子。\n「明年再种。」她把你的纸袋递过来，自己的那包还等着收进小屋最上层。',
    'Margaret invites you to the shed to divide her dried seeds. One sticks in a newspaper fold and refuses to move.\nYou lift the paper. She catches the seed and laughs that even it dislikes being separated.\nShe divides the seeds between two packets, drawing a flower and a crooked leaf on yours.\n“We’ll plant them next year.” She offers your packet; hers is still waiting to go on the shed’s top shelf.',
    '在纸袋上写好明年的约定',
    'Write next year’s plan on the packet',
    '把她的种子收进小屋',
    'Put her seeds in the shed',
  ],
  [
    'ade',
    '复印机旁',
    'By the copier',
    '阿德拿着一叠歪掉的复印件站在机器旁，第二页的字几乎要爬出纸边。\n「这台也得先认识人吗？」他笑着问，又把原稿转了一个方向。\n你凑过去看，纸盘里卡着半张旧通知。他停下按钮，等你把纸抽出来。\n机器终于吐出一张完整的纸。阿德抽出剩下那叠，请你替他对一对页码。',
    'Ade stands by the copier with crooked copies. The words on page two almost run off the edge.\n“Does this thing need an introduction?” He laughs and turns the original round.\nYou look closer. Half an old notice is stuck in the tray. He stops pressing buttons while you pull it out.\nA complete page finally emerges. Ade spreads out the rest of the stack and asks you to check the page numbers.',
    '一起重新复印这叠纸',
    'Copy the stack again together',
    '把自己的夹子借给他',
    'Lend him your folder clip',
  ],
  [
    'ade',
    '茶歇的空位',
    'A seat at the tea break',
    '茶水间只剩一把椅子，阿德的包正坐在上面，拉链还大大张着嘴。\n他看见你，赶紧把包抱到脚边，露出半块被压扁的三明治。\n「包吃得比我多。」他把餐巾摊平，问你要不要听今天那场会的后半段。\n茶杯还在水壶旁冒热气。他朝空椅子扬扬下巴，手里的手机只亮了锁屏。',
    'Only one chair is left in the break room. Ade’s bag occupies it, zip gaping.\nHe sees you and moves it to his feet, revealing half a flattened sandwich.\n“The bag’s eaten more than I have.” He spreads a napkin and offers the rest of the morning’s meeting story.\nHis tea is still steaming by the kettle. He nods towards the empty chair; his phone only shows its lock screen.',
    '坐下一起歇一会儿',
    'Sit down for a break',
    '替他把热茶端过来',
    'Bring his tea over',
  ],
  [
    'ade',
    '收件箱刷新',
    'Refresh the inbox',
    '阿德的茶已经凉透，屏幕上还是那封旧邮件，鼠标指针停在刷新旁边。\n「我知道再点也不会快。」他说完又点了一次，这回自己也笑不出来。\n你没去碰电脑，只把空茶杯往桌边挪了挪。他终于抬头，揉了揉眼睛。\n他把屏幕合上，问你能不能陪他待一会儿，聊什么都行，先别聊结果。',
    'Ade’s tea is cold. The same old email fills the screen, cursor hovering beside refresh.\n“I know clicking won’t speed it up.” He clicks again, unable to make himself laugh this time.\nYou leave the computer alone and move the empty cup towards the edge. He looks up and rubs his eyes.\nHe closes the screen and asks you to stay a while. Anything to talk about, except the result for now.',
    '陪他绕楼散步',
    'Walk round the building with him',
    '给他换杯热茶',
    'Make him fresh tea',
  ],
  [
    'ade',
    '留在抽屉的工牌',
    'The badge in the drawer',
    '阿德找充电线时带出一张旧工牌，塑料套已经发黄，背面却写得很清楚。\n那是你的分机号。他用拇指抹了抹笔迹，说这个号码一直没有换。\n「有阵子就记得打给你。」他把工牌放在两人中间，没有再翻那堆线。\n你们说起刚认识时卡纸的机器，他笑出声来，才把工牌放回容易拿到的一格。',
    'Looking for a charging cable, Ade pulls out an old badge. Its sleeve is yellow, but the writing on the back is clear.\nIt is your extension. He rubs the writing with his thumb and says the number has never changed.\n“For a while, yours was the only number I remembered to call.” He leaves it between you and stops searching.\nYou remember the copier jam when you first met. He laughs and returns the badge to a drawer within easy reach.',
    '和他约好下周的午饭',
    'Arrange lunch next week',
    '给旧工牌拍张照片',
    'Photograph the old badge',
  ],
  [
    'helen',
    '晃动的桌子',
    'The wobbly desk',
    '海伦蹲在桌脚旁，把一本薄书塞进去，桌上的课本塔跟着晃了一下。\n「这本总算用上了。」她刚松手，最上面的书就沿着桌边慢慢滑过来。\n你伸手按住书堆，她找来一块折得厚厚的硬纸，准备替换桌脚下的薄书。\n她抬头指指窗边的空架子，又看看你扶住的书堆，等你挑个能腾开手的办法。',
    'Helen crouches by a desk leg and slides a thin book underneath. The tower of textbooks wobbles.\n“Found a use for this one.” As she lets go, the top book begins to slide.\nYou hold the stack. She finds a thick fold of card, ready to replace the thin book beneath the leg.\nShe points at an empty shelf by the window, then looks at the books in your hands, waiting for a plan.',
    '扶稳桌子让她垫纸',
    'Steady the desk while she fits the card',
    '把课本搬到窗边',
    'Move the books to the window',
  ],
  [
    'helen',
    '窗边的书签',
    'The bookmark by the window',
    '海伦把借来的书推给你，窗边的风翻起一页，露出夹在里面的纸条。\n纸条上写着上回没聊完的话题，下面画了一个很小的问号。\n「这不是作业。」她先把问号划掉，又笑着说划掉以后看起来更像作业。\n你翻到空白的背面，她把铅笔放在两人中间，等着你写下想聊的那一句。',
    'Helen slides a borrowed book towards you. A breeze by the window reveals a note between the pages.\nIt names the conversation you left unfinished, with a tiny question mark underneath.\n“It isn’t homework.” She crosses out the question mark, then laughs that it looks more like homework now.\nYou turn the note over. She places a pencil between you, waiting for the thing you want to talk about.',
    '在纸背写下自己的话题',
    'Write your topic on the back',
    '陪她聊完上次的话',
    'Finish the earlier conversation',
  ],
  [
    'helen',
    '没写完的讲义',
    'The unfinished handout',
    '海伦理讲义时翻出一张旧稿，自己的名字被划了两遍，旁边还有个墨点。\n「第一次站上讲台，连名字都拼错了。」她说得很轻，手却没把那页藏回去。\n你看着纸上的修改，她又讲起当时怎么越解释越乱，最后借了学生的笔。\n讲义散在桌上。她问你有没有也想装作没发生的事，随后把椅子往你这边挪了挪。',
    'Among her handouts, Helen finds an old draft. Her own name is crossed out twice beside an ink blot.\n“First time teaching. I even misspelt my name.” Her voice is quiet, but she does not hide the page.\nYou study the corrections as she describes making it worse and finally borrowing a student’s pen.\nPapers cover the table. She asks whether you have a story you wish had never happened, and moves her chair closer.',
    '讲讲自己出过的糗',
    'Share your own mishap',
    '陪她把旧讲义排好',
    'Sort the old handouts together',
  ],
  [
    'helen',
    '不点名的下午',
    'An afternoon without the register',
    '海伦把点名册收进包里，只端着两杯茶走到长椅边，包带滑到了脚旁。\n你刚叫了声老师，她就晃晃杯子：「下午不点名，叫我海伦吧。」\n她坐下才发现两杯放反了，重新换过来，自己先笑得差点喝不下茶。\n你们聊起书里那段没讲完的故事。她在小纸片上记下你说到的那一页。',
    'Helen puts the register in her bag and brings two cups to the bench. The bag strap slips by her feet.\nYou begin with “Teacher”, and she lifts a cup. “No register this afternoon. Call me Helen.”\nSitting down, she notices the cups are reversed. She swaps them, laughing too much to drink.\nYou return to the unfinished story from the book. She notes the page you mention on a scrap of paper.',
    '叫她海伦并接过茶杯',
    'Call her Helen and take the tea',
    '把滑到脚边的包带收好',
    'Gather the bag strap by her feet',
  ],
  [
    'priya',
    '一支能写的笔',
    'A working pen',
    '普里娅甩了甩笔，墨水没落在便签上，倒在拇指旁边留下了深蓝的一点。\n一摞便签跟着滑开，你递去纸巾，她先用手腕按住最上面的那张。\n「这支笔只认皮肤。」她在废纸背面划了一道，笔帽却滚进便签底下。\n纸上仍然空白。她叹口气又笑了，指指散开的便签，请你帮忙腾出一只手。',
    'Priya shakes a pen. Instead of marking the note, it leaves a dark blue spot beside her thumb.\nThe notes slide apart. You offer a tissue while she pins the top one with her wrist.\n“It only writes on skin.” She tries a line on scrap paper, but the cap rolls beneath the notes.\nThe page stays blank. She sighs, laughs and gestures at the scattered notes, asking for a hand.',
    '扶住散开的便签',
    'Hold the scattered notes',
    '替她找回漏墨笔的帽子',
    'Find the leaking pen’s cap',
  ],
  [
    'priya',
    '不响的手机',
    'A quiet phone',
    '普里娅坐到长椅上，手机刚亮，她就把它翻过来压在包边。\n你停在旁边，她挪开包，空出的座位上还留着一条提手的印子。\n「念名字久了，差点忘了我也有名字。」她揉揉喉咙，又轻轻报了一遍。\n你没有接着问工作的事。她把背靠稳，等呼吸慢下来，才指给你看路边的小狗。',
    'Priya sits on the bench. Her phone lights up; she turns it face down beside her bag.\nYou pause nearby. She moves the bag, leaving the mark of its handle on the empty seat.\n“So many names, I almost forget I have one.” She rubs her throat and quietly says her own.\nYou leave work out of the conversation. Settling back and breathing more slowly, she points out a dog on the path.',
    '挨着她在长椅坐下',
    'Sit beside her on the bench',
    '给她递一杯热茶',
    'Offer her warm tea',
  ],
  [
    'priya',
    '缺角的拼图',
    'The missing jigsaw corner',
    '普里娅倒出半盒拼图，先挑出一块蓝天，递到你手里，桌上全是相似的蓝。\n「这会儿不用叫下一位。」她把盒盖立起来，给两个人腾出同样宽的位置。\n你们找到一条云的边，拼了几次都不合。她转过那块拼片，忽然笑了起来。\n原来它是倒着的。她没有马上接走你手里的蓝天，等你自己找到能接上的地方。',
    'Priya tips out half a jigsaw and hands you a piece of sky. Similar blues cover the table.\n“No calling the next person for a bit.” She props up the lid and clears equal space for you both.\nYou find the edge of a cloud, but the pieces will not fit. She turns one round and laughs.\nIt was upside down. She leaves the sky in your hand, waiting for you to find its place.',
    '和她找齐角上的拼片',
    'Find the corner pieces together',
    '先拼出一小块蓝天',
    'Start a patch of sky',
  ],
  [
    'priya',
    '前台以外的名字',
    'A name beyond the desk',
    '有人从旁边经过，随口叫了声前台。普里娅下意识抬头，手已经摸到手机。\n她看见你，把手机放回去，笑着说：「这会儿只想做普里娅，不接转线。」\n你把茶挪到窗边，她跟着坐过来，说起一段一直没机会讲完的旅行。\n讲到迷路那截，她自己先笑了。那杯茶慢慢少下去，这回没有被电话打断。',
    'Someone passes and calls her “Reception”. Priya looks up, already reaching for her phone.\nSeeing you, she puts it down. “Just Priya for now. No transferring calls.”\nYou move the tea to the window. She follows and begins a travel story she has never had time to finish.\nAt the part about getting lost, she laughs first. The tea slowly disappears, without a phone interrupting.',
    '叫她普里娅接着听',
    'Use her name and keep listening',
    '请她讲完那次旅行',
    'Hear the rest of the trip',
  ],
  [
    'dave',
    '藏起来的答案',
    'The hidden answers',
    '戴夫在吧台试读下一场问答，把答案页塞回夹子，纸面却朝着吧台边的熟客。\n你抬手提醒，他低头看了看，叹口气，粉笔停在刚才那道题旁边。\n「这一轮测眼力。」他把新题写得格外小，熟客立刻抗议，他自己也笑了。\n答案纸还翘在夹子外。他一手端着饮料，一手举着粉笔，回头请你帮忙。',
    'Dave is trying out the next quiz at the bar. He files the answers facing the regulars.\nYou signal. He looks down and sighs, his chalk hovering beside the previous question.\n“Eyesight round.” He writes the new question unusually small. The regulars protest at once, making him laugh too.\nThe answers still poke out of the folder. Drink in one hand and chalk in the other, he turns to ask for help.',
    '替他挡住答案纸页',
    'Shield the answer sheet',
    '帮他擦去那道旧题',
    'Wipe off the old question',
  ],
  [
    'dave',
    '空着的队名',
    'A blank team name',
    '戴夫给你留了张答题纸，队名那栏空着，削好的铅笔横在上面。\n他念出几种名字，自己先摇头，最后一种太长，差点连气都接不上。\n「好名字得能喊出来。」他说着又试了一遍，把吧台边的客人也逗笑了。\n你把纸转向两人之间，他低下头看着空白的一栏，这回认真等你提一个。',
    'Dave saves an answer sheet for you, the team name blank and a sharpened pencil laid across it.\nHe reads out suggestions, rejecting each. The last is so long he nearly runs out of breath.\n“A good name has to be shoutable.” He tries again, making someone at the bar laugh.\nYou turn the sheet between you. He bends over the blank line, properly waiting for your suggestion.',
    '写下一个离谱的队名',
    'Write a ridiculous team name',
    '拉他一起想个短名字',
    'Think of a short name together',
  ],
  [
    'dave',
    '关门后的老歌',
    'An old song after closing',
    '最后一位客人走了，戴夫把门牌翻过来，擦杯子的手终于慢了下来。\n他找出一张旧唱片，唱针落下前先沙沙响了几声，比开场白还长。\n「这首不用抢答。」他把干布搭在肩上，低声跟了一句，又忘了下句词。\n你们没有替他找歌词。杯子一只只倒扣好，唱片这一面还没放完，他就坐了下来。',
    'The last customer leaves. Dave turns the sign and finally slows his glass polishing.\nHe finds an old record. It crackles before the music, longer than one of his introductions.\n“No buzzer for this one.” Cloth over his shoulder, he sings a line and forgets the next.\nNeither of you looks up the words. Glasses go upside down to dry, and he sits before the side finishes.',
    '坐着听完唱片这一面',
    'Stay for this side of the record',
    '替他收好最后一桌',
    'Clear the last table',
  ],
  [
    'dave',
    '不算分的一轮',
    'A round without scores',
    '戴夫拿出第一本题册，书脊用胶带贴了几层，页边挤着旧朋友的队名。\n你们读到同一处，一起笑了。他伸手挡住下一行，说那题到现在还有人争。\n「这轮不算分。」他把铅笔放到你面前，让你给页边那块空白找个名字。\n纸页松了一角，他用掌心压着，指指铅笔和夹子，请你挑个顺手的来。',
    'Dave brings out his first quiz book. Tape covers the spine; old friends’ team names fill the margins.\nYou laugh at the same note. He covers the next line, saying people still argue about that question.\n“No scores this round.” He sets a pencil before you and offers the remaining margin for a name.\nA loose page curls. Holding it flat, he points at the pencil and clip, asking which you would rather use.',
    '在页边添上你们的队名',
    'Add your team name in the margin',
    '替他夹牢松开的书页',
    'Clip the loose pages',
  ],
  [
    'rahman',
    '门铃下的纸箱',
    'Boxes by the bell',
    '拉赫曼招呼你回店拆纸箱，弯腰找剪刀，门铃一响，箱子又往过道滑了一点。\n你按住箱角，他终于腾出双手，从围裙口袋摸出那把一直没找到的剪刀。\n「原来它跟着我走。」他笑着举起剪刀，封口处翘起的硬纸又碰到了围裙。\n箱里传出瓶子轻轻相碰的声音。他挪开脚边的空箱，问你能不能再搭把手。',
    'Rahman calls you back to the shop to unpack. As he hunts for scissors, the doorbell rings and the box shifts.\nYou hold a corner. With both hands free, he finds the missing scissors in his apron pocket.\n“They’ve been following me.” He raises the scissors, laughing, as the raised cardboard flap catches his apron.\nBottles clink inside. Moving an empty box away from your feet, he asks for another hand with the seal.',
    '按住纸箱让他拆封',
    'Hold the box while he opens it',
    '接过剪刀替他剪胶带',
    'Take the scissors and cut the tape',
  ],
  [
    'rahman',
    '旧店牌',
    'The old shop sign',
    '拉赫曼约你进店看旧招牌。他从柜台后抽出来，围裙上立刻多了道灰。\n他念出褪色的字，念到最后一个音节停住，用手指描了描掉漆的边。\n「刚开张时，天天怕人找不到。」他说那会儿总把牌往外多挪一点。\n你扶着店牌，他讲起街上后来换过的店铺。门铃又响，他把店牌靠稳，留出擦灰的地方。',
    'Rahman invites you into the shop to see the old sign. Pulling it from behind the counter leaves dust across his apron.\nHe reads the faded words, pauses on the last syllable and traces the flaking edge.\n“At first I worried nobody would find us.” He used to move the sign a little further out each day.\nYou support it as he recalls shops the street has lost. The bell rings; he steadies the sign, leaving room to clean it.',
    '听他讲旧街上的店铺',
    'Hear about the old street',
    '陪他擦净店牌的灰',
    'Clean the dusty sign together',
  ],
  [
    'rahman',
    '照片里的领带',
    'The tie in the photo',
    '拉赫曼请你回店看旧照片。入籍那天的领带歪着，手里攥紧的纸却平平整整。\n「出门照过镜子，走到门口就忘了。」他说完摸摸领口，好像领带还在那里。\n你问照片外面有什么，他把相册放低，说起那天回家以后忘了下米的锅。\n大事讲着讲着成了一顿迟来的饭。他不再整理照片的角，只让相册在两人中间摊着。',
    'Rahman invites you back to the shop to look at old photographs. On citizenship day his tie is crooked; the papers in his grip are perfectly straight.\n“Checked the mirror. Forgot by the door.” He touches his collar as though the tie were still there.\nYou ask what was outside the picture. Lowering the album, he remembers the pot he forgot to put rice in.\nThe big day becomes a late meal. He stops straightening the corners and leaves the album open between you.',
    '陪他翻完这页相册',
    'Look through the album page',
    '问问那天迟来的晚饭',
    'Ask about the late dinner',
  ],
  [
    'rahman',
    '另一只杯子',
    'The other cup',
    '拉赫曼收摊时叫住你，锁好门，才从柜台下拿出另一只杯子。\n他把杯子放在你这边，门边的小凳还伸着一条腿，正好挡住两人中间的路。\n「这会儿不用找零钱。」他仍摸了摸围裙，自己笑着把手收回来。\n热茶沿着杯壁慢慢落下。他指指空着的位置，问你能不能留下讲讲近来的事。',
    'Closing up, Rahman calls you back in, locks the door and brings a second cup from below the counter.\nHe puts it on your side. The stool by the door has one leg sticking into the space between you.\n“No change to count now.” He still pats his apron, then laughs and takes his hand away.\nHot tea runs down the cup’s side. He gestures at the empty space and asks you to stay and tell him how you have been.',
    '坐着陪他把茶喝完',
    'Stay and finish the tea together',
    '收进店门旁的小凳',
    'Bring in the stool by the door',
  ],
  [
    'lina',
    '帆布包里的纸',
    'Papers in the canvas bag',
    '莉娜把拒签信从帆布包里拿出来，先折好翘起的纸角，又沿折痕压了一遍。\n「能坐一会儿吗？」她没把信推给你，只把旁边那张椅子拉开。\n你坐下后，她才说起自己反复读过的那几行，讲到一半停下来喝了口水。\n她把喝空的杯子推到旁边，指尖离开纸角，问你有没有空再听一段。',
    'Lina takes the refusal letter from her canvas bag, folds a raised corner and presses its crease again.\n“Can you stay a while?” She keeps the letter beside her and pulls out the next chair.\nOnce you sit, she begins describing the lines she has read so often, then pauses for water.\nShe moves her empty glass aside, takes her fingers off the corner and asks if you can hear a little more.',
    '替她倒满喝空的水杯',
    'Refill her empty glass',
    '听她慢慢把话说完',
    'Let her finish in her own time',
  ],
  [
    'lina',
    '没织完的围巾',
    'The unfinished scarf',
    '莉娜把没织完的围巾铺在桌上，手指沿最后一行走过去，数到一半又重来。\n「今天不想看文件。」她把帆布包挪到脚边，一根针却滚进了桌脚后面。\n她按住将要散开的线团，说这颜色让她想起池塘边的栏杆，又低头看看地面。\n针还躲在桌脚后。莉娜把围巾卷好，问你先找回来，还是去池塘边换口气。',
    'Lina lays the unfinished scarf on the table, counting along its last row, then starting again.\n“No paperwork today.” She moves the canvas bag to her feet. A needle rolls behind the table leg.\nCatching the wool, she says its colour reminds her of the pond railings, then glances at the floor.\nThe needle is still hiding. She rolls the scarf and asks whether to find it first or go to the pond for some air.',
    '替她找回桌脚后的针',
    'Find the needle behind the table leg',
    '陪她沿池塘走一圈',
    'Walk round the pond together',
  ],
  [
    'lina',
    '地图折痕',
    'Creases in the map',
    '莉娜摊开车站地图，纸张又沿旧折痕弹回来，几条路线被挤成了一团。\n她用手掌压住，问到一半又停了，最后只说想走走平时熟悉的路。\n你们把地图合上，沿街慢慢走。经过拐角时，她指给你看一扇认得的旧门。\n「下一站先不讲。」她把地图塞回包里。面包店亮着灯，她指指橱窗里歪掉的价签。',
    'Lina opens the station map. Old creases pull it shut again, bunching the routes together.\nShe presses it flat, begins a question, then only says she wants to walk a familiar route.\nYou fold the map and walk slowly along the street. At the corner she points out an old door she knows.\n“No next stop just yet.” She puts the map away. A bakery glows at the corner; she points out its crooked price card.',
    '陪她走完整条熟悉的街',
    'Walk the familiar street with her',
    '坐下陪她看列车来往',
    'Sit and watch the trains together',
  ],
  [
    'lina',
    '留着的椅子',
    'A chair kept free',
    '莉娜把咖啡馆的椅子拉开，杯旁压着一张你画过的纸，角上留着半个圆。\n「今天先听你说。」她把手机收进包里，把纸转过来，空白的一面朝着你。\n你刚提起最近一件小事，她便把杯子挪开，露出那个没画完的圆，等你继续。\n她从包里找出铅笔，搁在两人中间，说以后没话讲，也可以各画上一笔。',
    'Lina pulls out the café chair. A drawing you made lies by her cup, half a circle at its edge.\n“Your turn first today.” She puts her phone away and turns the blank side towards you.\nYou begin to mention a small recent event. She moves her cup, revealing the unfinished circle, ready to hear the rest.\nShe finds a pencil and leaves it between you: on days without words, each of you can add a line.',
    '讲一件最近发生的小事',
    'Share a small recent story',
    '拿铅笔补完那张画',
    'Finish the drawing with the pencil',
  ],
  [
    'gareth',
    '松掉的车篮',
    'The loose basket',
    '加雷思扶着晃动的车篮，刚一松手，里面的空袋就向车把另一侧歪过去。\n你托住车篮，他弯腰摸到松开的扣子，帽檐碰上铃铛，叮地响了一下。\n「铃比我先道谢。」他抬起头，给你看那枚差一点就掉进砖缝的小扣。\n两个人把车扶正，他又晃了晃车篮才放心。这回腾出的手，终于能摘下帽子擦汗。',
    'Gareth holds a wobbling basket. As he lets go, the empty bag tips across the handlebars.\nYou support the basket while he finds the loose clip. His cap catches the bell with a ding.\n“Bell thanked you first.” Looking up, he shows you the clip that nearly fell between the paving stones.\nYou straighten the bike. He tests the basket before finally freeing a hand to take off his cap and wipe his brow.',
    '替他扣牢车篮的小扣',
    'Fasten the basket clip',
    '扶稳车让他修好',
    'Hold the bike while he fixes it',
  ],
  [
    'gareth',
    '收工的长椅',
    'The bench after work',
    '加雷思把空邮包放在长椅脚边，先揉揉肩膀，才发现自己还侧着半边身子。\n「今天的重量还没下班。」他换了个坐姿，用手帕擦净旁边那一截椅面。\n他把自己的杯子端稳，朝空位挪挪手帕，问起路上那家换了颜色的大门。\n说到一半他才想起不用赶下一户，于是放下杯子，把刚才漏掉的细节又补了回来。',
    'Gareth leaves his empty postbag by the bench and rubs his shoulder, still leaning to one side.\n“The weight hasn’t clocked off yet.” He shifts and wipes the place beside him with a handkerchief.\nHe steadies his cup, shifts the handkerchief towards the empty seat and asks about the freshly painted door along the road.\nHalfway through, he remembers there is no next house to reach. Setting down the cup, he returns to the detail he missed.',
    '和他在长椅并排坐下',
    'Sit beside him on the bench',
    '帮他扶稳手里的茶杯',
    'Steady his teacup',
  ],
  [
    'gareth',
    '藏在包底的卡',
    'The card at the bottom',
    '加雷思清理邮包，掏出一张包在薄纸里的感谢卡，彩笔字大得挤出了边框。\n「是个孩子写的。」他念到其中一个字时卡住，重新从那一行的开头念。\n你没有替他接下去。他终于读顺，把卡翻过来，背面还画着一辆轮子不圆的车。\n他用指尖抹平卡边，说这张不在投递单上。薄纸已经破了，他仍舍不得换掉整张卡。',
    'Cleaning his postbag, Gareth finds a thank-you card in tissue. Large coloured letters spill over its border.\n“A child wrote it.” He stumbles on a word and starts the line again.\nYou let him finish. Turning it over, he reveals a bike drawn with wheels that are not quite round.\nHe smooths the edge: this one is not on the delivery list. Its tissue is torn, but the card itself will stay.',
    '听他重新读完整张卡',
    'Hear him read the whole card',
    '找只干燥的袋子护住卡',
    'Find a dry cover for the card',
  ],
  [
    'gareth',
    '不用送的信',
    'A letter without a round',
    '加雷思从自己外套里拿出一张卡，没有地址，也没贴邮票，纸角被压得很平。\n「这回不是替别人送。」他递过来之后没有走开，像怕你找不到拆开的地方。\n你们凑近读完那几句话，他把帽子翻来覆去，最后自己也凑过来看。\n卡上没有需要回复的日期。他问字能不能认清，你点头，他才把帽子重新戴好。',
    'Gareth takes a card from his own coat, without address or stamp, its corners carefully pressed.\n“Not delivering for someone else this time.” He stays nearby as if worried you cannot find the opening.\nYou lean closer to read it together. He turns his cap over, then leans in to look himself.\nThere is no reply deadline. He asks whether the writing is clear; at your nod, he finally puts his cap back on.',
    '把他的卡放进书里',
    'Keep his card in a book',
    '请他去喝一杯茶',
    'Take him for a cup of tea',
  ],
];
const tenHeartScenes: typeof scenes = [
  [
    'margaret',
    '钥匙有了家',
    'A home for the key',
    '玛格丽特约你去小屋试备用钥匙，旧绳圈递到手上，她抱着那把磨白的折椅。\n「得往上抬，手还记得吧？」门开了，她仍抱着折椅，没有收回钥匙。\n你把水壶挪到旁边，替她留出放脚的地方。她说起丈夫种坏的豆子，自己笑了。\n门内的空钩就在手边，折椅仍抱在她怀里。她请你挑个位置，钥匙也留在这里。',
    'Margaret asks you back to the shed to try the spare key. She hands you its old string loop, holding the worn folding chair.\n“Lift it. Hands still remember?” When the door opens, she keeps holding the folded chair without taking the key back.\nYou move the watering can aside, leaving her room for her feet. Her husband’s failed beans make her laugh.\nThe empty hook is within reach; the chair is still in her arms. She asks you to choose a place, with the key staying here too.',
    '把钥匙挂上门内的空钩',
    'Hang the key on the inside hook',
    '替她展开那把旧折椅',
    'Unfold the old chair for her',
  ],
  [
    'ade',
    '不刷新的茶歇',
    'A break without refreshing',
    '阿德把旧工牌从抽屉里拿出来，塑料套裂了一边，背面的分机号仍看得清。\n「现在直接叫你就行。」他试着喊一声，又低头笑，手里的手机没有解锁。\n他掀开点心盒，糖霜沾上袖口。没去拿纸，先把旁边那把椅子拉出来。\n茶喝到一半，手机震了一声。他把它推进抽屉，招呼你过来，点心盒旁还留着空。',
    'Ade takes the old badge from the drawer. The sleeve is split, but your extension is still readable.\n“I can just call your name now.” He tries it and laughs, leaving his phone locked.\nHe opens the snack box and icing catches his cuff. Before wiping it, he pulls out the chair beside him.\nHalfway through the tea, his phone buzzes. He slides it into the drawer and waves you over. There is still space beside the snack box.',
    '把点心盒推到两人中间',
    'Put the snack box between you',
    '坐下陪他把茶喝完',
    'Sit down and finish the tea together',
  ],
  [
    'helen',
    '不交的作业',
    'Work never handed in',
    '海伦翻出那页拼错自己名字的旧讲义，放在一本空白本旁，没有把错处遮住。\n「这次不用重抄。」她找来一枚大纸夹，夹住本子快合拢的那一边。\n她在废纸上画出当时蹲着的自己，鞋画得像两只小船，笔尖停在空白本上方。\n书架上留好一格，没有分数也没有交稿日。她请你给本子添个开头，旧讲义也在旁边。',
    'Helen sets the handout with her misspelt name beside a blank notebook, leaving the mistake uncovered.\n“No copying it out this time.” She finds a large clip to hold the notebook open.\nOn scrap paper she draws herself crouching, shoes like little boats. Her pencil hovers over the new notebook.\nA shelf space is ready, without marks or deadlines. She asks you to start the notebook, with the old handout beside it.',
    '在空白页画出摇晃的书堆',
    'Draw the wobbling pile on the blank page',
    '把那页旧讲义夹进本子',
    'Keep the old handout in the notebook',
  ],
  [
    'priya',
    '拼图外的蓝天',
    'Sky beyond the jigsaw',
    '普里娅把最后一块蓝天放进拼图，没有立刻拆掉，手掌还按着快散开的边框。\n「这回找个不会被收走的地方。」她挪开书架上的旧收据，量了量空出来的宽度。\n她拿来薄框放在桌边，一块云却翻到地上。两个人低头，正好同时看见它。\n手机亮了一下。她把屏幕扣住，先请你搭把手，书架上的位置还等着这片蓝天。',
    'Priya fits the final sky piece, keeping her palm against the loose border rather than taking it apart.\n“Somewhere it can stay this time.” She clears receipts from the shelf and measures the gap.\nShe brings a slim frame to the table. A cloud piece flips onto the floor, where you both spot it at once.\nHer phone lights up. She turns it over and asks for a hand first. The shelf space is waiting for this patch of blue.',
    '扶住薄框让她装好拼图',
    'Steady the frame for the jigsaw',
    '把翻掉的云放回蓝天',
    'Return the fallen cloud to the sky',
  ],
  [
    'dave',
    '题册的空白页',
    'The blank quiz-book page',
    '戴夫翻到旧题册最后一页，胶带黏住了纸角，他小心撕开，露出一行没写完的题。\n「答案我也忘了。」他找来那张写歪队名的纸，垫在下面，免得铅笔戳穿。\n你们试着补完题目，补到后来成了互相出新题，谁都没拿出计分板。\n一页纸又松了。他把铅笔和夹子放在吧台上，请你留个新答案，或帮这页找到位置。',
    'Dave opens the last page of the old quiz book. He eases tape from the corner to reveal an unfinished question.\n“Forgot the answer too.” The crooked team-name sheet goes underneath to stop the pencil making a hole.\nFinishing the question turns into setting each other new ones. Neither of you reaches for a scoreboard.\nAnother page comes loose. He sets a pencil and clip on the bar, asking for a new answer or a place to keep the page.',
    '给那道题补个新答案',
    'Write a new answer for the question',
    '替他夹牢题册松掉的纸页',
    'Clip the quiz book’s loose pages',
  ],
  [
    'rahman',
    '门铃旁的合照',
    'A photo by the bell',
    '拉赫曼约你回店挂旧招牌，牌刚擦净，钉子就从围裙口袋里滚进了货箱。\n你替他扶着牌，他一层层翻箱底，先翻出开张那天剩下的包装纸。\n纸背还能认出几笔旧账。他找回钉子，把纸放在脱漆的牌角旁，举起手机。\n「挂好拍张照？」他请你过来比位置，门铃恰在试拍时响了，屏幕上只留了半张侧脸。',
    'Rahman asks you back to the shop to hang the old sign. It is clean, but the nail drops from his apron into a box.\nYou hold the sign while he searches, finding wrapping paper left from opening day first.\nOld sums show on the reverse. He finds the nail, lays the paper by the chipped corner and raises his phone.\n“A photo once it’s up?” He invites you to try a position. The bell rings just as the camera clicks for a test shot, catching only half his face.',
    '扶住店牌让他裹好破角',
    'Hold the sign while he pads its corner',
    '陪他站到店牌旁拍张照片',
    'Stand beside the sign for a photograph',
  ],
  [
    'lina',
    '两个人的画册',
    'A sketchbook for two',
    '莉娜把那张没画完的纸贴进薄画册，圆圈被胶水沾住，皱出了一道小山脊。\n「杯子留下了，这个也别丢。」她拿铅笔沿着皱褶画路，问路口该往哪边走。\n她翻出旧街的速写，指指那扇认得的门，画册里的路却还没走到那里。\n帆布包搁在脚边，画册摊着，空白处够再画一栋屋子。她把铅笔转过来请你接着画。',
    'Lina pastes the unfinished drawing into a thin sketchbook. Glue wrinkles the circle into a little ridge.\n“The cup stayed. Keep this too.” She draws a road along the wrinkle and asks which way it should turn.\nAn old-street sketch shows the familiar door, but the road in the sketchbook has not reached it yet.\nHer canvas bag rests at her feet. The open page has room for another house; she turns the pencil round and asks you to carry on.',
    '在她画的路旁添一扇门',
    'Add a door beside her road',
    '把画册摊平继续画台阶',
    'Flatten the sketchbook and keep drawing the steps',
  ],
  [
    'gareth',
    '盒盖上的车轮',
    'Wheels on the box lid',
    '加雷思带来一只硬纸盒，把孩子画的感谢卡放进去，旧薄纸已经补了好几处。\n「自己的东西，老放邮包底下。」你带来他那张不用邮票的卡，他犹豫该放哪边。\n他拿隔纸比了比，说一格留给收到的，一格留给还想亲手送出去的，盒里正好够宽。\n盒盖还空着，彩笔和隔纸一齐递来。他请你搭把手，让这些卡不用再挤邮包底。',
    'Gareth brings a stiff box and lays the child’s thank-you card inside, its tissue patched in several places.\n“Always my own things at the bottom of the bag.” You’ve brought his unstamped card; he isn’t sure which side it belongs on.\nHe measures a divider: one side for cards received, one for cards still to hand over. The box is just wide enough.\nThe lid is blank. He offers you pens and the divider, asking for help so the cards need not crowd the bottom of his postbag.',
    '替纸盒折好两格隔纸',
    'Fold the two compartments for the box',
    '在盒盖画上那辆小车',
    'Draw the bicycle on the lid',
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

for (const [
  npc,
  title,
  titleEn,
  zhCN,
  en,
  first,
  firstEn,
  second,
  secondEn,
] of tenHeartScenes) {
  const friend =
    npc === 'margaret'
      ? 'friend-garden'
      : npc === 'ade'
        ? 'friend-neighbour'
        : npc === 'helen'
          ? 'friend-library'
          : `friend-${npc}`;
  heartEvents.push({
    id: `heart-${npc}-10`,
    title: text(title, titleEn),
    text: text(zhCN, en),
    weight: 1,
    once: true,
    channel: `npc:${npc}`,
    speaker: npc,
    heart: { npc, hearts: 10 },
    requires:
      npc === 'lina'
        ? [friend, 'lina-heart-8-shared', 'lina-stayed']
        : [friend],
    choices: [
      {
        id: 'stay',
        label: text(first, firstEn),
        effects: [
          { type: 'stat', key: 'mood', delta: b.heartMood },
          { type: 'friendship', npc, delta: b.talkFriendship },
        ],
        sets: [`heart-${npc}-10-shared`],
      },
      {
        id: 'help',
        label: text(second, secondEn),
        effects: [
          { type: 'stat', key: 'health', delta: b.heartHelp },
          { type: 'friendship', npc, delta: b.talkFriendship },
        ],
        sets: [`heart-${npc}-10-shared`],
      },
    ],
  });
}
for (const choice of heartEvents.find((event) => event.id === 'heart-lina-8')!
  .choices)
  choice.sets!.push('lina-heart-8-shared');

export const townHeartLetters: GameEvent[] = [
  {
    id: 'letter-lina-10',
    title: text('寄回的半幅画', 'The drawing sent back'),
    text: text(
      '莉娜寄回那张画，空白处添了她的新桌子。「以后想起来就各画一半吧。」信封里还有一张留给你的白纸。',
      'Lina sends back the drawing, adding her new table in the blank space. “Half each, whenever one of us remembers?” There is a fresh sheet for you in the envelope.',
    ),
    weight: 1,
    once: true,
    channel: 'letter',
    speaker: 'lina',
    requires: ['lina-left', 'lina-heart-8-shared'],
    choices: [
      {
        id: 'draw',
        label: text(
          '画上自己的桌子寄回去',
          'Draw your own table and send it back',
        ),
        effects: [{ type: 'stat', key: 'mood', delta: b.heartMood }],
        sets: ['lina-yearly-drawing'],
      },
      {
        id: 'write',
        label: text(
          '写信告诉她下一幅画什么',
          'Write about what you will draw next',
        ),
        effects: [{ type: 'stat', key: 'health', delta: b.heartHelp }],
        sets: ['lina-yearly-drawing'],
      },
    ],
  },
];

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
    ...(festivalDialogue[npc.id] ?? []).map(({ festival, text }) => ({
      id: `${npc.id}-festival-${festival}`,
      festival,
      text,
    })),
  );

// Scene-specific dialogue conditions are applied by stable id.
const dialogueConditions: Record<string, Partial<Npc['lines'][number]>> = {
  'priya-4': { dayKinds: ['weekend'] },
  'ade-21': { dayKinds: ['weekend', 'special'] },
  'margaret-1': { when: [{ minuteMax: 720 }] },
  'ade-1': { dayKinds: ['workday'], when: [{ minuteMax: 720 }] },
  'helen-1': { when: [{ minuteMax: 720 }] },
  'ade-10': {
    dayKinds: ['workday'],
    weather: ['sunny'],
    when: [{ minuteMin: 720, minuteMax: 840 }],
  },
  'ade-24': { when: [{ minuteMin: 720, minuteMax: 840 }] },
  'helen-36': { when: [{ minuteMin: b.eveningClass }] },
  'priya-daily-25': { heartsMin: 2, dayKinds: ['weekend'] },
  'priya-daily-34': { heartsMin: 4 },
  'rahman-daily-35': { heartsMin: 4 },
  'lina-4': { heartsMin: 2 },
  'lina-daily-35': { heartsMin: 4 },
  'gareth-daily-21': { requires: ['friend-gareth'] },
  'rahman-daily-22': { requires: ['friend-rahman'] },
  'gareth-daily-31': { season: 1 },
  'priya-daily-28': { when: [{ visaMonthsLeftMax: b.renewalWindowMonths }] },
  'dave-daily-28': { when: [{ visaMonthsLeftMax: b.renewalWindowMonths }] },
  'gareth-daily-28': { when: [{ visaMonthsLeftMax: b.renewalWindowMonths }] },
  'rahman-daily-27': { when: undefined },
  'rahman-daily-28': { when: [{ visaMonthsLeftMax: b.renewalWindowMonths }] },
};
for (const id of [
  'ade-2',
  'ade-3',
  'ade-5',
  'ade-7',
  'ade-8',
  'priya-1',
  'priya-2',
  'priya-3',
  'priya-5',
  'priya-daily-1',
  'priya-daily-2',
  'priya-daily-3',
  'priya-daily-5',
  'priya-daily-6',
  'priya-daily-8',
  'priya-daily-16',
])
  dialogueConditions[id] = { ...dialogueConditions[id], dayKinds: ['workday'] };
for (const id of [
  'priya-5',
  'rahman-2',
  'dave-5',
  'helen-9',
  'margaret-25',
  'gareth-daily-8',
])
  dialogueConditions[id] = { ...dialogueConditions[id], weather: ['rain'] };
for (const npc of npcs) {
  for (const line of npc.lines) {
    Object.assign(line, dialogueConditions[line.id]);
    if (line.festival === 'bonfire-night')
      line.when = [...(line.when ?? []), { minuteMin: b.bonfireStart }];
    if (line.id === 'helen-festival-christmas-market')
      line.when = [{ minuteMin: 960 }];
  }
}
const heartConditions: Record<string, GameEvent['when']> = {
  'heart-ade-2': [{ dayKind: 'workday' }, { minuteMin: 540, minuteMax: 1019 }],
  'heart-ade-4': [{ dayKind: 'workday' }, { minuteMin: 540, minuteMax: 1019 }],
  'heart-ade-6': [{ dayKind: 'workday' }, { minuteMin: 540, minuteMax: 1019 }],
  'heart-ade-8': [{ dayKind: 'workday' }, { minuteMin: 540, minuteMax: 1019 }],
  'heart-ade-10': [{ dayKind: 'workday' }, { minuteMin: 540, minuteMax: 1019 }],
  'heart-priya-4': [{ minuteMin: 1020 }],
  'heart-dave-2': [{ minuteMin: 720 }],
  'heart-dave-6': [{ minuteMin: 1320 }],
  'heart-rahman-2': [{ minuteMin: 600 }, { minuteMax: 1079 }],
  'heart-rahman-4': [{ minuteMin: 600 }, { minuteMax: 1079 }],
  'heart-rahman-6': [{ minuteMin: 600 }, { minuteMax: 1079 }],
  'heart-rahman-8': [{ minuteMin: 600 }, { minuteMax: 1079 }],
  'heart-rahman-10': [{ minuteMin: 600 }, { minuteMax: 1079 }],
  'heart-gareth-4': [{ minuteMin: 1080 }],
  'heart-helen-8': [{ minuteMin: 720, minuteMax: 1080 }],
};
for (const event of heartEvents)
  if (heartConditions[event.id]) event.when = heartConditions[event.id];

const lineCopy: Record<string, Text> = {
  'dave-1': text(
    '这回题目我锁抽屉了，钥匙还在找。',
    'This quiz’s questions are locked away. Now to find the key.',
  ),
  'dave-daily-9': text(
    '上回有人把答题纸当购物单带走了。',
    'Last time someone took the answer sheet home as a shopping list.',
  ),
  'rahman-daily-18': text(
    '周末早晨报纸卖完，街上才像醒了。',
    'Once the weekend morning papers sell out, the street feels awake.',
  ),
  'gareth-daily-18': text(
    '周末的邮筒也得看一眼，肩膀倒轻松些。',
    'Still checking the postbox at weekends. Easier on the shoulder, though.',
  ),
  'priya-daily-25': text(
    '绕池塘慢慢走一圈？今天不赶时间。',
    'Fancy a slow lap of the pond? I’ve got time today.',
  ),
};
for (const npc of npcs)
  for (const line of npc.lines)
    if (lineCopy[line.id]) line.text = lineCopy[line.id];
heartEvents.find((e) => e.id === 'heart-helen-4')!.title.en =
  'The bookmark by the window';
heartEvents.find((e) => e.id === 'heart-helen-8')!.title.en =
  'An afternoon without the register';

for (const npc of npcs)
  npc.lines.push(
    ...(townDialogue[npc.id] ?? []),
    ...(everydayDialogue[npc.id] ?? []),
  );
for (const event of heartEvents) {
  const flag = `heart-${event.heart!.npc}-${event.heart!.hearts}-shared`;
  if (
    townDialogue[event.heart!.npc]?.some((line) =>
      line.requires?.includes(flag),
    )
  )
    for (const choice of event.choices) choice.sets!.push(flag);
}
