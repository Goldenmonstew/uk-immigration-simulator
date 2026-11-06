import type { Npc } from './types';

const copy: Record<string, [string, string][]> = {
  margaret: [
    [
      '林遥，屏幕看累了？叶背的虫可不发提醒。',
      "Tired of the screen, Yao? The insects under these leaves don't send alerts.",
    ],
    [
      '林遥，你用过的纸盒留给我，正好装种子。',
      "Save your spare cardboard boxes for me, Yao. They're just right for seeds.",
    ],
    [
      '加班回来累了就歇着，盆栽我也常养坏。',
      'Have a rest if overtime wears you out. I lose plants too.',
    ],
    [
      '嘉宁，给孩子留块能挖的土吧，不必每个坑都得长出东西。',
      'Ka Ning, leave your child some ground to dig. Not every hole needs to grow something.',
    ],
    [
      '你家孩子看菜地的角度比我低，说不定先发现藏着的豆荚。',
      'Your child sees the plot from lower down. They might spot the hidden pods first.',
    ],
    [
      '嘉宁，保温壶挺沉吧？放这儿，别一直拎着。',
      'That flask looks heavy, Ka Ning. Put it down here rather than carrying it about.',
    ],
    [
      '索菲娅，带点芜菁叶回去？我把嫩的挑好了。',
      "Would you like some turnip tops, Sofia? I've picked out the tender ones.",
    ],
    [
      '你和杰米带杯子就行，我自己的壶连盖子都配错了。',
      'Just bring cups, you and Jamie. Even my own pot has the wrong lid.',
    ],
    [
      '索菲娅，散步回来挑几株苗吧，空盆还多着。',
      "Choose some seedlings after your walk, Sofia. I've plenty of empty pots.",
    ],
    [
      '那枚蓝丝带拿到手了，菜还得自己洗，对吧？我也省不掉这步。',
      "You got the blue ribbon, but still have to wash the vegetables, don't you? I can't skip that bit either.",
    ],
    [
      '续签的事办过一回了，来闻闻新翻的土吧，这东西不需要装文件袋。',
      "You've been through a renewal. Come and smell the turned earth; nothing here needs a document sleeve.",
    ],
    [
      '豆架搭得太高，摘豆子先得伸脖子。',
      "I've made the bean supports too high. I have to stretch my neck to pick anything.",
    ],
    [
      '水管一打结，我就得顺着它绕半圈菜地。',
      'When the hose gets tangled, I have to follow it halfway round the plot.',
    ],
    [
      '海伦把我写的花名当成新品种了。',
      'Helen thought my handwritten plant label named a new variety.',
    ],
    [
      '加雷思经过菜地会侧着邮包走，我把支架往里挪一点，也给他的车轮留条路。',
      'Gareth turns his postbag sideways by the plots. I move the supports in a little to leave room for his wheels too.',
    ],
    [
      '普里娅买盆先量窗台，我先买，再挪书。',
      'Priya measures the sill before buying pots. I buy first, then move the books.',
    ],
    [
      '那块木牌的墨印还留着，我换了根不褪色的绳。',
      "The ink on that plot label is still there. I've given it some colourfast string.",
    ],
    [
      '折椅扶手擦亮了一小块，你坐的那边总先晒到太阳。',
      "A patch of the folding chair's arm shines now. Your side catches the sun first.",
    ],
    [
      '我把破盆套在好盆外面，裂缝正好露出一片绿，连种错的苗都有了窗户。',
      "I've slipped the cracked pot over a good one. Green shows through the crack — even my misplaced seedling has a window.",
    ],
    [
      '蛋盒分好种子，空格正好放剪刀。',
      'The egg box keeps my seeds apart, with a spare space for the scissors.',
    ],
    [
      '小屋挂钩看着都空，走近才见绳圈叠了好几层，我得一层层把水壶解下来。',
      'The shed hooks look empty until you get close enough to see the string loops. I have to untangle them to get the watering can down.',
    ],
    [
      '有人问种地的秘诀，我先找回土上的眼镜，镜片一擦，才认出问话的邻居。',
      "Someone asked my gardening secret. I had to fish my glasses out of the soil and wipe them before I knew who'd asked.",
    ],
    [
      '新铲子买了，我还在找那把磨亮的旧铲。',
      'I bought a new trowel, but I still reach for the worn old one.',
    ],
    [
      '豆子铺在报纸上，把新闻照片全挡住了。',
      'The beans on my newspaper have covered every photograph.',
    ],
    [
      '壶盖配错也能倒水，就是响得厉害，我用绳拴好了，它还得继续跟我出门。',
      "The pot with the wrong lid still pours, just noisily. I've tied the lid on; it's got outings left in it.",
    ],
  ],
  ade: [
    [
      '林遥，你是写代码的，能不能解释为什么重开一次就好了？',
      'Yao, you write code. Can you explain why turning it off and on again works?',
    ],
    [
      '这本小册子装得进外套，林遥，借你路上翻。',
      'This booklet fits a coat pocket, Yao. Borrow it for the walk home.',
    ],
    [
      '林遥，想聊点电脑以外的吧，我可以先贡献一个失败的烤饼。',
      'Fancy talking about something away from computers, Yao? I can start with my failed scones.',
    ],
    [
      '嘉宁，孩子上学以后，鞋是不是总得换新的？',
      "Ka Ning, does your child seem to need new shoes all the time now they're at school?",
    ],
    [
      '你家那位和孩子都记得住自己的水壶吗？我连自己的都得查。',
      'Do your partner and child remember their water bottles? I even have to check for my own.',
    ],
    [
      '嘉宁，学校义卖能收这个拼错字的布袋吗？',
      'Would the school sale take this bag with a misspelt slogan, Ka Ning?',
    ],
    [
      '索菲娅，这条围巾是从家乡带来的？颜色真好认。',
      "Did that scarf come from home, Sofia? I'd recognise those colours anywhere.",
    ],
    [
      '你和杰米谁会找东西？我贴过标签的盒子反倒最难找。',
      'Which of you is better at finding things, you or Jamie? My labelled boxes are the ones I lose.',
    ],
    [
      '索菲娅，有没有不必翻译给杰米的笑话？先让我猜，猜错也留个能解释的地方。',
      "Any jokes you don't need to translate for Jamie, Sofia? Let me guess first — leave room to explain if I'm wrong.",
    ],
    [
      '复印机印了片空白，我还认真看了看背面。',
      'The copier gave me a blank sheet. I still turned it over to check the back.',
    ],
    [
      '续签那张提醒还留着吗？我勾完的事项也舍不得删。',
      "Have you kept the reminder from your renewal? I can't bear to delete a task even once I've ticked it off.",
    ],
    [
      '烤饼掉在盘子上，响得像放了枚硬币。',
      "My scone landed on the plate with a clink, as if I'd dropped a coin.",
    ],
    [
      '抽屉终于推上了，原来尺子一直斜着卡在里面。',
      'The drawer finally shuts. A ruler had been wedged across it all along.',
    ],
    [
      '戴夫的题目不用表格管，我翻遍题册找目录，只翻出一张改过的歌单。',
      'Dave keeps his questions without a spreadsheet. I hunted the quiz book for an index and found only a revised playlist.',
    ],
    [
      '我找到计算器时，拉赫曼已经找好零钱了。',
      'By the time I found my calculator, Rahman had my change ready.',
    ],
    [
      '莉娜画路线比分岔流程清楚，我的箭头总跑到纸外。',
      'Lina draws clearer routes than my flowcharts. My arrows always run off the page.',
    ],
    [
      '茶水间的包放脚下，椅子总算不用看行李了。',
      'My bag goes by my feet in the break room now. The chair is off luggage duty.',
    ],
    [
      '你陪我合上收件箱那回，我才发现茶凉了也还能重新烧水。',
      'When you sat with me after I closed the inbox, I remembered I could boil the kettle again even if the tea had gone cold.',
    ],
    [
      '文具盒透明了，才看见笔一直夹在耳朵上。',
      'My pencil case is transparent now. That helped me notice the pen behind my ear.',
    ],
    [
      '回形针搭的小人舍不得拆，我给它放了张废纸当桌子，文件继续散在一旁。',
      "I can't dismantle my paper-clip person. It has a scrap-paper desk now, while my own papers stay scattered.",
    ],
    [
      '耳机线一放回包，就又换了种打结法。',
      'The headphone cable finds a different knot every time it goes back in my bag.',
    ],
    [
      '给仙人掌查完浇水方法，才认出它是塑料的。',
      'I looked up how to water the cactus before noticing it was plastic.',
    ],
    [
      '快捷键便签挡键盘，只好贴杯子上。',
      "My shortcut note covered the keyboard, so I've stuck it on my mug.",
    ],
    [
      '新本子太平整，我先画个歪饭盒，盖子画得合不上，倒挺像我自己带的。',
      "The new notebook was too pristine, so I drew a crooked lunch box. Its lid won't shut, rather like the one I bring in.",
    ],
    [
      '计时器响了，我还在想刚才定了什么。',
      "The timer went off while I was still trying to remember what I'd set it for.",
    ],
  ],
  helen: [
    [
      '林遥，软件里的报错也有语气吗？我批作业会尽量写得轻一点。',
      'Yao, do software errors have a tone of voice? I try to make my corrections sound gentle.',
    ],
    [
      '林遥，书里夹的车票拿好，别跟着书借出去。',
      "Keep hold of the ticket you've left in the book, Yao. It might go out on loan with it.",
    ],
    [
      '林遥，工作里的词先歇歇吧，书架上还有讲不会上班的龙的。',
      'Give the work vocabulary a rest, Yao. There are books about dragons who never clock in.',
    ],
    [
      '嘉宁，孩子读得比你快也没关系，我翻页也常找半天。',
      "It's fine if your child reads faster, Ka Ning. Even finding my page can take me a while.",
    ],
    [
      '你们一家想借不同的书就各挑各的，不用把书包排成一个主题。',
      "Your family can each choose different books. The bag needn't have a single theme.",
    ],
    [
      '嘉宁，学校的通知可以慢慢问，字小也不等于事情都很急。',
      "Ask about the school letters at your own pace, Ka Ning. Small print doesn't mean it's all urgent.",
    ],
    [
      '索菲娅，轮班空下来想读点什么？短篇也能留个长结尾。',
      'What would you like to read between shifts, Sofia? A short story can still leave you thinking for ages.',
    ],
    [
      '索菲娅，想起家乡门铃时，先哼给我听听吧。',
      'Hum your old doorbell for me, Sofia, if you remember how it sounded.',
    ],
    [
      '你和杰米喜欢不同结尾也没关系，改天还能各翻各的。',
      'You and Jamie can prefer different endings. You can each return to your own pages another day.',
    ],
    [
      '花卉图鉴有人夹了糖纸，蝴蝶倒画得很像。',
      'Someone left a sweet wrapper in the flower guide. Its butterfly is rather convincing.',
    ],
    [
      '这本书封面磨白了，里面的字还很精神。',
      "This book's cover is worn white, but the words inside are still going strong.",
    ],
    [
      '你钓到过狗鱼吧？鱼类图鉴里那条，我总觉得画小了。',
      "You've caught a pike, haven't you? I've always thought the one in the fish guide looked rather small.",
    ],
    [
      '借书条背面能记电话，别把书名也报给对方。',
      "You can write a phone number on a loan slip. Just don't read out the book title with it.",
    ],
    [
      '普里娅读推理，连借书条都怕透出结局。',
      'Priya worries even a loan slip might show through and spoil her mystery.',
    ],
    [
      '玛格丽特带来一枝迷迭香，我拿小瓶装水，借书台倒先有了厨房的气味。',
      'Margaret brought a sprig of rosemary. I put it in a bottle of water, and the lending desk began to smell like a kitchen.',
    ],
    [
      '阿德给空杂志盒也贴了签，我都不敢换位置。',
      "Ade labelled even the empty magazine boxes. I daren't move them now.",
    ],
    [
      '那张有问号的书签我没扔，划掉的地方比没划掉的还像问题。',
      "I've kept our question-mark bookmark. The crossed-out bit looks even more questioning.",
    ],
    [
      '拼错自己名字的旧讲义还在，你看过之后，我倒不急着藏它了。',
      "The handout with my misspelt name is still here. Since you saw it, I've been less keen to hide it.",
    ],
    [
      '印章盖歪了，日期像要从纸上散步出去。',
      'I stamped it crookedly. The date looks ready to wander off the page.',
    ],
    [
      '靠垫排得像书脊，我伸手想借一本，翻过来只有洗涤标签，倒也认真读了。',
      'The cushions looked like book spines, so I reached for one. I found a washing label and read that carefully instead.',
    ],
    [
      '大字书放低架了，小梯子终于能歇歇。',
      'The large-print books are on the low shelf now. The little stepladder can have a rest.',
    ],
    [
      '字典夹着面包店收据，看得我先饿了。',
      'There was a bakery receipt in the dictionary. Reading it made me hungry.',
    ],
    [
      '项链挂在衣领扣上，难怪转头总被拽住。',
      'My necklace caught on a collar button. No wonder it kept tugging when I turned my head.',
    ],
    [
      '逗号太多的句子像一排小椅子，坐下就不想走，我得把其中几把先搬开。',
      'A sentence full of commas is like a row of chairs. You sit down and never leave, so I have to move a few away.',
    ],
    [
      '还书箱的感谢纸没写书名，我就当每本都谢了。',
      "The thank-you note in the returns box didn't name a book. I'll take it as thanks for all of them.",
    ],
  ],
  priya: [
    [
      '林遥，电脑也有候诊队伍吗？我这边一台打印机就能排得很长。',
      'Yao, do computers have waiting lists? One printer can make quite a queue here.',
    ],
    [
      '林遥，你这把伞好认，失物箱里全是黑的。',
      'Your umbrella is easy to recognise, Yao. Every one in the lost-property box is black.',
    ],
    [
      '林遥，工作电话的声音要是太熟，可以换个水壶的声音听听。',
      'If work calls start sounding too familiar, Yao, try listening to the kettle instead.',
    ],
    [
      '嘉宁，孩子的雨衣买大些，袖子先卷起来也好。',
      'You could get your child a bigger raincoat, Ka Ning. The sleeves can stay rolled up for now.',
    ],
    [
      '下回登记让孩子自己报名字吧？慢慢说，我不会抢最后一个音。',
      "Next time you check in, let your child give their own name? No rush. I won't jump in on the last sound.",
    ],
    [
      '嘉宁，散步先找洗手间这习惯，我也有。',
      'I plan my walks around the toilets too, Ka Ning.',
    ],
    [
      '索菲娅，我找杯子时，水壶倒先替我着急了。',
      "The kettle starts fussing before I've even found my mug, Sofia.",
    ],
    [
      '索菲娅，你家乡的茶要加什么？我想换换口味。',
      'What do you put in tea back home, Sofia? I fancy trying something different.',
    ],
    [
      '索菲娅，家里的故事慢慢讲，地名我跟着念两遍，你也能听听我念得像不像。',
      "Take your time with stories of home, Sofia. I'll repeat the place names, and you can tell me how they sound.",
    ],
    [
      '菜地蓝丝带真好看，可别把它别在常洗的外套上，我替纸花吃过亏。',
      "That show ribbon is lovely. Don't pin it to a coat you wash often; I lost paper flowers that way.",
    ],
    [
      '我带的闲话比午餐还多，就是没法分盒装。',
      "I've brought more gossip than lunch. I just can't divide it into little tubs.",
    ],
    [
      '收音机有个台总是沙沙响，我还以为是节目在下雨。',
      'One station on my radio always crackles. I thought it was raining in the programme.',
    ],
    [
      '你约过锅炉维修那回，我也学着先记问题，免得人走了才想起来。',
      'After that boiler appointment you arranged, I started writing my questions down too, rather than remembering them once the visitor had gone.',
    ],
    [
      '戴夫送来糖罐，里面竟放了半罐粉笔。',
      'Dave brought over a sugar bowl. It turned out to be half full of chalk.',
    ],
    [
      '海伦说书可以续，我差点问下一位何时来，她把还书日期指给我，又忍着没笑。',
      'When Helen offered to renew a book, I nearly asked when the next person was due. She pointed to the return date and tried not to laugh.',
    ],
    [
      '加雷思穿便服，我靠那双沾泥的鞋才认出。',
      'I only recognised Gareth out of uniform by his muddy shoes.',
    ],
    [
      '漏墨笔装进小袋了，我的拇指可洗了三回。',
      'The leaky pen has a pouch now. My thumb took three washes.',
    ],
    [
      '那次拼图的云我能认出来了，倒着放也行，不再跟它生气。',
      "I recognise the cloud from our jigsaw now, even upside down. I've stopped arguing with it.",
    ],
    [
      '针线盒多了颗不认识的扣子，我对过自己的衣服，没一件肯承认是它家的。',
      'An unfamiliar button turned up in my sewing tin. I checked my clothes, but none would claim it.',
    ],
    [
      '胶带的开口没找到，倒摸了满手灰。',
      "I couldn't find the start of the tape. All I got was dust on my hands.",
    ],
    [
      '石头摆上书架，书没添，架子倒沉了。',
      "I've put my travel stones on the shelf. There are no more books, but it's heavier now.",
    ],
    [
      '失物招领的笔被领走了，我另找一支系上绳子，绳头却忘了系在什么地方。',
      'The lost-property pen was claimed. I tied string to another pen, then forgot to attach the other end to anything.',
    ],
    [
      '大提手杯子拿得稳，就是喝水时老碰鼻尖。',
      'The big handle makes my mug easy to hold. It just keeps bumping my nose when I drink.',
    ],
    [
      '杂志没拆封，包装先被我磨花了。',
      "I haven't opened the magazine yet, but I've already worn its wrapping cloudy.",
    ],
    [
      '备用袋还藏着个袋子，到底留哪只好？',
      "There's another bag inside my spare bag. Which one am I meant to keep?",
    ],
  ],
  dave: [
    [
      '林遥，软件报错要是出成问答题，是不是谁都不想抢答？',
      'Yao, if error messages were quiz questions, would anyone want to answer?',
    ],
    [
      '林遥，杯底压着张小票，我差点当茶泡了。',
      "There's a receipt under your cup, Yao. I nearly brewed it with the tea.",
    ],
    [
      '林遥，卡住以后想出去走走，这个我听得懂。',
      "I understand wanting a walk when you're stuck, Yao.",
    ],
    [
      '嘉宁，你孩子能不能给我出道题？太长的话我先申请喝口水。',
      "Can your child set me a question, Ka Ning? If it's a long one, I'll ask for a sip of water first.",
    ],
    [
      '嘉宁，你想好自己的队名了吗？黑板还空着。',
      "Have you thought of a team name for yourself, Ka Ning? There's still space on the blackboard.",
    ],
    [
      '嘉宁，孩子的谜语是不是最难猜？猜中了还可能被临时换个答案。',
      "Children's riddles are the hardest, aren't they, Ka Ning? Get one right and they might change the answer.",
    ],
    [
      '索菲娅，你家乡的歌我听过，歌名总记成歌词。',
      "I've heard songs from your home, Sofia. I keep mistaking the lyrics for their titles.",
    ],
    [
      '你和杰米各选一首吧，我先试试唱机转不转，别挑到最后只听见我在擦唱片。',
      "Choose a record each, you and Jamie. I'll check the player first, or you'll only hear me polishing records.",
    ],
    [
      '索菲娅，空班来猜个谜？这道不用唱出来。',
      "Come and try a riddle between shifts, Sofia. This one doesn't need singing.",
    ],
    [
      '冠军也得洗杯子，奖杯恐怕不进洗碗机。',
      'Even champions have washing-up to do. I doubt the trophy goes in the dishwasher.',
    ],
    [
      '我换了块写菜单的板，旧板背后还有一道没算完的题。',
      "I've changed the menu board. The back of the old one still has an unfinished sum on it.",
    ],
    [
      '你钓过的那条狗鱼，长度先别告诉我，我还想留作一道估算题。',
      "Don't tell me the length of that pike you caught. I'd still like to use it for an estimation question.",
    ],
    [
      '冰柜旁找到个手套，竟比我的还大。',
      "I found a glove beside the freezer. It's bigger than mine.",
    ],
    [
      '玛格丽特来看我先看香草，我把花盆转了半圈，免得她总盯着那片长黄的叶子。',
      "Margaret checks my herbs before saying hello. I turned the pot so she wouldn't keep staring at its yellow leaf.",
    ],
    [
      '阿德想给题册编索引，我怕客人翻到拿手的题，倒先请他帮忙找散掉的书页。',
      'Ade offered to index the quiz book. People might skip to their favourite questions, so I asked him to find its loose pages instead.',
    ],
    [
      '我还在数硬币，拉赫曼已经替我打开纸袋了。',
      "I'm still counting the coins when Rahman opens the paper bag for me.",
    ],
    [
      '你帮我挡过的那页答案换了夹子，纸面这次真朝里了。',
      "I've changed the clip on the answers you helped hide. The page really faces inward this time.",
    ],
    [
      '那张旧唱片我没换，忘词那段就留着听乐器，倒也不着急。',
      "I've kept that old record. When I forget the words, I listen to the instruments instead.",
    ],
    [
      '粉笔一断，我出的长题也得分两口气。',
      'When the chalk breaks, even my long questions have to come in two breaths.',
    ],
    [
      '开瓶器系了绳，瓶盖却一路滚到门口。',
      "I've put the bottle opener on a string. The bottle tops still roll all the way to the door.",
    ],
    [
      '唱片按字母排好，想听的却在最下面，我找完一轮，还是放回原来的乱序。',
      'I sorted the records alphabetically and put my favourite at the bottom. After finding it, I went back to the old muddle.',
    ],
    [
      '抹布卷角老留条干线，像我故意画的。',
      "The cloth's curled corner leaves a dry line, as if I'd drawn it on purpose.",
    ],
    [
      '菜单字小，我的手指一分开菜名又挡了价钱。',
      'The menu print is tiny. When I separate the dishes with my finger, I hide the prices.',
    ],
    [
      '灯泡放对了盒，我还是先去旧地方找。',
      "I've put the bulbs in the right box, but I still look in the old place first.",
    ],
    [
      '有位客人摸着桌边的刻痕认座位。',
      'One customer recognises their seat by feeling the notch in the table.',
    ],
  ],
  rahman: [
    [
      '林遥，你的手套落在货架了，还替我守着罐头。',
      "You left your gloves on the shelf, Yao. They've been guarding the tins for me.",
    ],
    [
      '价签贴歪也能揭，可纸每揭一次就薄一层。',
      'I can peel a crooked price label off, but the paper gets thinner each time.',
    ],
    [
      '林遥，盯屏幕累了看看货架，罐头至少不会突然跳出新窗口。',
      "Rest your eyes on the shelves, Yao. At least the tins won't open a new window.",
    ],
    [
      '嘉宁，孩子想帮着拿东西就挑轻的，我也不靠一次搬完显本事。',
      "Give your child something light if they want to help, Ka Ning. I don't prove anything by carrying it all at once either.",
    ],
    [
      '嘉宁，这个小袋给你，面包别跟罐头挤一起。',
      "Here's a little bag for you, Ka Ning. The bread needn't fight for room with the tins.",
    ],
    [
      '嘉宁，小孩会认包装的图案，大人却总先转过去看价钱。',
      'Children recognise the pictures on packets, Ka Ning. Adults turn them round to find the price.',
    ],
    [
      '索菲娅，想找家乡的调料？说说气味也成。',
      'Looking for a seasoning from home, Sofia? Describing its smell might help.',
    ],
    [
      '你和杰米口味不同也能煮一锅，先盛再添料，我自己的那碗总得另外留点辣的。',
      'You and Jamie can cook one pan and season your bowls separately. I always save extra heat for mine.',
    ],
    [
      '索菲娅，你讲家乡吃的，我常先记香味才记名字，下回拿纸画个样子也能认。',
      'I remember the smells from your food stories before the names, Sofia. A sketch might help me recognise the dish next time.',
    ],
    [
      '纸袋边角卷了，装上面包倒又站直了。',
      "The paper bag's corners were curling, but the bread made it stand straight again.",
    ],
    [
      '账本翻到最后，还有一行写着别忘吃饭。',
      "At the back of my ledger there's still a line saying, “Don't forget to eat.”",
    ],
    [
      '这把秤没装电池，我还找了半天开关。',
      "I spent ages looking for the switch before realising these scales don't take batteries.",
    ],
    [
      '围裙挂钩太高，摘下来时我也得踮脚。',
      'The apron hook is so high that I have to stand on tiptoe to get it down.',
    ],
    [
      '普里娅挑不滚的梨，我就替她留个平底袋。',
      'Priya chooses pears that stay put, so I save her a flat-bottomed bag.',
    ],
    [
      '加雷思寄自己的卡比送信慢，信封摸平好多遍，走到邮筒边又停下来看看邮票。',
      'Gareth takes longer to post his own card than to deliver the post. He smooths the envelope, then checks its stamp again by the postbox.',
    ],
    [
      '戴夫在纸箱上试题，搬箱子的人也能猜。',
      'Dave tests questions on cardboard boxes. Anyone carrying one can have a guess.',
    ],
    [
      '那回你替我按纸箱，剪刀就在我围裙里，这事到现在还逗人笑。',
      'You were holding the box while the scissors were in my apron all along. That still makes me laugh.',
    ],
    [
      '入籍照片的领带我不再去扶正了，照片外那锅忘下的米才记得牢。',
      "I leave the tie in my citizenship photo crooked now. It's the pot I forgot to put rice in that I remember.",
    ],
    [
      '零钱碟换大了，硬币不再挤着裂缝，我还把旧碟留下，专门给价签笔躺着。',
      "I've got a bigger change dish now, so the coins stop crowding the crack. The old one's a bed for price pens.",
    ],
    [
      '罐头转过来，才知道一直擦的是背面。',
      "I turned the tins round and found I'd been polishing their backs.",
    ],
    [
      '门铃没响，原来门一直没关严。',
      "The bell stayed silent because the door hadn't shut properly.",
    ],
    [
      '纸箱套好，最大的偏偏挡住我想拿的货。',
      'I nested all the boxes, and the biggest one blocked the stock I wanted.',
    ],
    [
      '算盘珠被我摸得发亮，都是想事情时磨的。',
      "I've polished that abacus bead just by moving it while I think.",
    ],
    [
      '饼干铁盒空了，放回形针太委屈，我拿来装自己的零钱，和收银机分开放。',
      'Paper clips felt a poor reward for the empty biscuit tin. I keep my own change in it, apart from the till.',
    ],
    [
      '一根葱装大袋老倒，我折了袋底给它换小房间。',
      'One leek kept toppling over in a big bag. I folded the bottom up to give it a smaller room.',
    ],
  ],
  lina: [
    [
      '林遥，画坏的纸先别扔，翻过来还能画。',
      "Don't throw that spoiled sheet away yet, Yao. You can still draw on the back.",
    ],
    [
      '林遥，这条围巾两头不齐，我认得出哪头先织。',
      "The scarf ends don't match, Yao. I can tell which one I knitted first.",
    ],
    [
      '林遥，工作忙起来还记得喝水吗？我画东西也会忘了杯子在手边。',
      "Do you remember to drink when work gets busy, Yao? I forget the cup beside me when I'm drawing.",
    ],
    [
      '嘉宁，你孩子画的人是不是比房子还大？画里住得下就行。',
      "Does your child draw people bigger than houses, Ka Ning? That's fine if they fit the picture.",
    ],
    [
      '嘉宁，你想画自己的哪条路？先别管像不像。',
      "Which of your own routes would you draw, Ka Ning? It needn't look right straight away.",
    ],
    [
      '嘉宁，孩子挑的颜色你留着吧，有时候长大以后反而不敢这样用。',
      'Keep the colours your child chooses, Ka Ning. Adults sometimes lose the nerve to use them that way.',
    ],
    [
      '索菲娅，我拍照总看旁边，洗出来才发现。',
      'I keep looking aside in photographs, Sofia. I only notice when I see the prints.',
    ],
    [
      '你给杰米讲家乡哪段最想画下来？从一扇门开始，门外的路可以留着慢慢添。',
      'Which of the home stories you tell Jamie would you most like to draw? Start with a door; the road outside can wait.',
    ],
    [
      '索菲娅，给你留半张纸？画到哪儿都行。',
      'Shall I save you half the sheet, Sofia? You can start wherever you like.',
    ],
    [
      '那枚蓝丝带折过几回了吧？我想画它折起来的样子，比摊平的有意思。',
      "That blue ribbon must have a few creases now. I'd like to draw it folded; it's more interesting than lying flat.",
    ],
    [
      '这张画没起名，翻过来反而先画了标题框。',
      "I haven't named this drawing, but I turned it over and drew a box for the title first.",
    ],
    [
      '池塘里的鱼只露背，我总给它多画半条。',
      'The fish at the pond only show their backs. I always end up drawing another half a fish.',
    ],
    [
      '等人时画过门把手，画完才发现纸拿反了。',
      "I sketched a door handle while waiting, then found I'd held the paper upside down.",
    ],
    [
      '本子转过来，海伦才认出那歪线是条路。',
      'Helen only recognised my crooked line as a road when I turned the sketchbook round.',
    ],
    [
      '玛格丽特认出画里的小屋，门画反也认得，她指着屋后说，那边其实藏着水壶。',
      'Margaret recognised the shed even with its door reversed. She pointed out where the watering can hides behind it.',
    ],
    [
      '拉赫曼给的包装纸，反面比正面还好看。',
      "The reverse of Rahman's wrapping paper is prettier than the front.",
    ],
    [
      '那根滚到桌脚后的针找回来了，我给针盒加了条合得紧的带子。',
      "I've found the needle that rolled behind the table leg. The needle case has a tighter strap now.",
    ],
    [
      '车站地图还照老折痕收着，那回圈过的地方也没擦。',
      "The station map still folds along its old creases. I haven't rubbed out the places we circled that day.",
    ],
    [
      '削笔木屑一压平，就不像小花了。',
      'The pencil shavings stopped looking like flowers once I pressed them flat.',
    ],
    [
      '新橡皮太干净，我留了一小块没擦的线，让自己知道这条路原来画到哪边。',
      "The new rubber is too clean. I've left a little line to remind myself where I first drew the road.",
    ],
    [
      '帆布包缝了两层底，东西没轻，提手却更牢了，我终于敢放一本重些的书。',
      "I've sewn another layer into the bag's bottom. It isn't lighter, but the handle feels firmer. I'll risk a heavier book now.",
    ],
    [
      '空白本也夹书签，免得忘了想从哪页画。',
      "I've put a bookmark in the blank sketchbook so I remember where I meant to start.",
    ],
    [
      '咖啡渍像岛，船画成土豆，只好补把叉子。',
      'The coffee stain looked like an island, but my boat became a potato. I added a fork.',
    ],
    [
      '画竖在书架上，先把书名挡住了。',
      "I've stood a drawing on the shelf. It's already hiding a book title.",
    ],
    [
      '短铅笔夹进纸卷不易丢，我给纸卷系条绳子，打开时倒像认真拆一件礼物。',
      "A short pencil stays safe in a paper roll. I've tied it with string, so opening it feels like unwrapping a proper present.",
    ],
  ],
  gareth: [
    [
      '林遥，你耳机掉了个套，先放口袋里吧。',
      "Your earphone's lost a cover, Yao. Put it in your pocket for now.",
    ],
    [
      '林遥，鞋带松了，我也常被邮包挡着看不见。',
      'Your shoelace is loose, Yao. My postbag often hides mine from me too.',
    ],
    [
      '林遥，下班想不动了就走熟路，我熟得连哪块砖松都能记住。',
      "Take a familiar path if you're too tired to think after work, Yao. I know every loose brick on mine.",
    ],
    [
      '嘉宁，孩子的脚步比大人的零碎，我听见也不会催着开门。',
      "Children take more little steps, Ka Ning. I won't hurry anyone to the door.",
    ],
    [
      '信箱写好名字就行，嘉宁，念不准我会再问。',
      "Your name on the letterbox will do, Ka Ning. If I'm unsure how to say it, I'll ask again.",
    ],
    [
      '嘉宁，给孩子的信我会单独递，不把小信封塞在一叠传单里。',
      "I hand over children's letters separately, Ka Ning. I don't bury little envelopes among the leaflets.",
    ],
    [
      '索菲娅，你寄回家的卡，背面还能画朵花。',
      "There's room for a little flower on the back of the card you're sending home, Sofia.",
    ],
    [
      '你和杰米寄合照别把信封塞太紧，照片角得能伸开，我手里这只还留着折痕。',
      'Leave your photograph some room in the envelope, you and Jamie. The one in my hand still bears a crease.',
    ],
    [
      '索菲娅，我写旧地址也会习惯地先写旧门牌。',
      'I still start with my old house number when writing an address, Sofia. Habit gets there first.',
    ],
    [
      '橡皮筋断在指头上，倒比车铃先叫我一声。',
      'The rubber band snapped against my finger. It got my attention before the bell could.',
    ],
    [
      '车篮里落了片广告，我的晚餐被它想好了。',
      "An advert landed in my basket. It's planned my dinner for me.",
    ],
    [
      '池塘边那只鸭子认得邮包，每回都过来看看。',
      'The duck by the pond recognises my postbag. It comes over to inspect it every time.',
    ],
    [
      '你约过人看锅炉吧？我也贴过留门纸条，贴太高了，来的人先看见胶带背面。',
      'Remember arranging that boiler visit? I once put a door note too high. The visitor saw the back of the tape first.',
    ],
    [
      '海伦量书包的反光条，书倒先从另一头滑了。',
      'Helen was measuring a reflective strip for the bag when a book slipped out of the other end.',
    ],
    [
      '戴夫写队名落笔重，我挑厚便签给他，拿回来一看，下面的垫纸也留着名字。',
      'Dave presses hard when writing team names. I gave him thick paper, but his name still reached the backing sheet.',
    ],
    [
      '阿德印的地址很齐，邮票偏偏贴歪。',
      'Ade prints his addresses so neatly. Somehow the stamps still go on crooked.',
    ],
    [
      '车篮那枚小扣还牢着，你扶过以后，我过砖缝也少提一口气。',
      "The basket catch you helped with is holding. I don't have to hold my breath over the gaps in the paving now.",
    ],
    [
      '那张感谢卡的边抚平了，车轮倒还是歪的，看着像马上又要转起来。',
      "The thank-you card's edges are smooth now. Its crooked wheels still look ready to turn.",
    ],
    [
      '擦亮的钥匙换了个圈，摸口袋就认得。',
      'The polished keys have a different ring now. I recognise them by touch in my pocket.',
    ],
    [
      '车铃修好了，螺丝差点跟着帽子戴上。',
      "I've fixed the bicycle bell. I nearly put my cap on with the spare screws still inside.",
    ],
    [
      '投给我家的窗帘广告看了半天，我窗户小，纸上画的花纹倒比窗台还宽。',
      'I studied a curtain advert delivered to my house. My windows are tiny; its pattern was wider than my sill.',
    ],
    [
      '近路的小门记熟了，帽檐还是得低一点。',
      'I know the shortcut gate now, but I still have to duck my cap.',
    ],
    [
      '手帕快透明了，展开真能看见天空。',
      "My handkerchief's nearly transparent. I can see the sky right through it.",
    ],
    [
      '车篮铺旧布后，明信片角不钻缝了，那块布滑下来时，我反倒先替它压平。',
      'The old cloth keeps postcard corners out of the basket gaps. When it slips, I smooth the cloth first now.',
    ],
    [
      '邮包摘下来，才发现背一直弯着。',
      'I only notice how bent my back was once I take the postbag off.',
    ],
  ],
};

const routes = [
  'SKILLED_WORKER',
  'HONG_KONG_BNO',
  'FAMILY_PARTNER_OR_PARENT',
] as const;
const recent: Record<string, Record<number, string>> = {
  margaret: { 9: 'show-result-ribbon', 10: 'visa-renewed' },
  ade: { 10: 'visa-renewed' },
  helen: { 11: 'caught-pike' },
  priya: { 9: 'show-result-ribbon', 12: 'boiler-planned' },
  dave: { 11: 'caught-pike' },
  rahman: {},
  lina: { 9: 'show-result-ribbon' },
  gareth: { 12: 'boiler-planned' },
};
const callbacks: Record<string, number[]> = {
  margaret: [4, 6],
  ade: [4, 6],
  helen: [4, 6],
  priya: [2, 6],
  dave: [2, 6],
  rahman: [2, 6],
  lina: [4, 6],
  gareth: [2, 6],
};
export const townDialogue: Record<string, Npc['lines']> = Object.fromEntries(
  Object.entries(copy).map(([npc, pairs]) => [
    npc,
    pairs.map(([zhCN, en], i) => ({
      id: `${npc}-town-${i + 1}`,
      text: { zhCN, en },
      ...(i < 9 && {
        heartsMin: 1,
        when: [{ route: routes[Math.floor(i / 3)] }],
      }),
      ...(recent[npc][i] && { requires: [recent[npc][i]] }),
      ...(npc === 'ade' && i === 15 && { forbids: ['lina-left'] }),
      ...(i >= 16 &&
        i < 18 && {
          requires: [`heart-${npc}-${callbacks[npc][i - 16]}-shared`],
        }),
    })),
  ]),
);

const everydayCopy: Record<string, [string, string][]> = {
  margaret: [
    [
      '我种豆子喜欢留宽一点，手能伸进去，摘完也不用跟藤蔓赔不是。',
      'I leave room between the beans so I can reach in without apologising to the vines afterwards.',
    ],
    [
      '新土刚打开有股熟悉的味道，我本想只闻一下，结果又买了一袋。',
      'A fresh bag of soil has such a familiar smell. I meant only to sniff it and ended up buying another.',
    ],
    [
      '邻居把篱笆修得笔直，我这一边留个缺口，刺猬走路可不看尺子。',
      "My neighbour clips the hedge straight. I leave a gap on my side; hedgehogs don't follow a ruler.",
    ],
    [
      '我喜欢把花种在门口能看见的地方，倒垃圾时也不算白跑一趟。',
      'I like flowers where I can see them from the door. Even taking the rubbish out comes with a view.',
    ],
    [
      '摘下来的豆子先放膝上挑，不好看的归我，炖进汤里也认不出。',
      "I sort picked beans on my lap. I keep the ugly ones; nobody recognises them once they're in soup.",
    ],
    [
      '种东西不能只看照片，我买过的小苗长大后，差点把照片都遮住。',
      "You can't judge a plant by its photograph. One little thing I bought grew big enough to hide the picture.",
    ],
    [
      '小路边的薄荷我不舍得拔干净，鞋底碰一下，走出去还带着香。',
      'I leave some mint beside the path. Brush it with a shoe and you carry the smell away.',
    ],
    [
      '我把摘下的花插进果酱瓶，瓶身那块旧标签，正好挡住水里的花枝。',
      'I put cut flowers in jam jars. The old labels happen to hide the stems under the water.',
    ],
    [
      '有人夸我菜地整齐，我先看了看背后，怕他认的是隔壁那一块。',
      'Someone called my plot tidy. I looked behind me first, in case they meant the one next door.',
    ],
    [
      '给幼苗换盆时我会把收音机关小，它们倒不在意，是我怕碰断根。',
      "I turn the radio down when repotting seedlings. They don't mind it; I just need to concentrate on the roots.",
    ],
    [
      '我留了一小块地不种，蹲着看蚯蚓搬土，也算它们请我歇一会儿。',
      'I leave a little patch unplanted. Watching worms shift the soil is their way of inviting me to take a break.',
    ],
    [
      '新手问杂草长什么样，我拔起一把才发现，里面还混着自己种的。',
      'Someone new asked what a weed looks like. I pulled up a handful and found one of my own plants among them.',
    ],
    [
      '我用干草铺出一条窄路，靴子走过软一点，不用每步都踩得响亮。',
      "I've laid a narrow path with straw. It's softer under my boots, without a clatter at every step.",
    ],
    [
      '小屋的门开着时，我喜欢听外面挖土的声音，隔壁也知道我在。',
      "With the shed door open, I like hearing the digging outside. Next door knows I'm there too.",
    ],
    [
      '我不爱把土拍得太硬，手掌留个印就够，没必要把苗床做成路。',
      "I don't pat the soil too hard. A palm print is enough; the seedbed needn't become a pavement.",
    ],
    [
      '有人往堆肥里放了根长树枝，我拉出来半天，差点以为在钓鱼。',
      'Someone put a long branch in the compost. Pulling it out took so long I felt I was fishing.',
    ],
    [
      '园艺手套晒干后有点脆，戴上得先握握拳。',
      'My gardening gloves go stiff when they dry. I have to make a fist to soften them.',
    ],
    [
      '小番茄甜不甜，我喜欢闭眼尝。',
      'I like closing my eyes to decide how sweet a little tomato is.',
    ],
    [
      '我喜欢豆花，比种子袋上印的还小。',
      "I like bean flowers. They're smaller than the ones printed on the packet.",
    ],
    [
      '手指沾着泥，我就用手背捋头发。',
      'When my fingers are muddy, I push my hair back with the back of my hand.',
    ],
    [
      '萝卜长歪了也脆，不耽误我拌沙拉。',
      "A crooked radish is still crisp. It doesn't spoil my salad.",
    ],
    [
      '蹲下再站起，膝盖总要先发表点意见。',
      'Whenever I stand up from a crouch, my knees have an opinion first.',
    ],
    [
      '花盆底下那层碎石，洗洗还能接着用。',
      'The gravel at the bottom of a pot can go back in after a wash.',
    ],
    [
      '园艺绳摸着扎手，用久了倒很服帖。',
      'Garden twine feels rough at first, but it softens with use.',
    ],
  ],
  ade: [
    [
      '我喜欢坐巴士上层，经过矮楼时，能看见屋顶上谁的球还没拿回。',
      'I like the top deck of the bus. Over the low buildings you can see whose ball is still on the roof.',
    ],
    [
      '有人把会议提前结束了，我还捏着没吃的饼干，不太习惯这份自由。',
      "Someone ended a meeting early while I was still holding a biscuit. I wasn't quite used to that much freedom.",
    ],
    [
      '我烤面包开始肯等面团慢慢长，手闲下来，反而觉得厨房更忙。',
      "I've learnt to let bread dough rise in its own time. With my hands still, the kitchen somehow feels busier.",
    ],
    [
      '练口琴得把嘴收小一点，我试过以后，喝汤也跟着小心翼翼的。',
      'You have to purse your lips for the harmonica. After practising, I even start sipping soup carefully.',
    ],
    [
      '同事把各人的杯子摆成一排，远看像团队合照，只有我的把手朝后。',
      "A colleague lined up everyone's mugs like a team photograph. Only mine had its handle turned away.",
    ],
    [
      '我挑散步路线会看有没有坡，走上去想起运动，走下来又想起面包店。',
      'I choose walks with a hill. Going up reminds me of exercise; coming down reminds me of the bakery.',
    ],
    [
      '洗好的衬衫不熨也能穿，我把袖口拉平了，心里就当已经做完。',
      'A washed shirt is wearable without ironing. I flatten the cuffs and mentally tick the job off.',
    ],
    [
      '我学着做蘑菇汤，尝味的时候总越盛越满，最后试吃就算一顿饭。',
      "I'm learning mushroom soup. My tasting spoonfuls keep growing until the tasting counts as a meal.",
    ],
    [
      '我喜欢听人讲怎么修自行车，明明没动手，听完也想擦擦车链。',
      'I like hearing how people mend bicycles. Even without doing the work, it makes me want to clean the chain.',
    ],
    [
      '有回步子迈得很大，赶到路口才发现还要等，我只好假装是在散步。',
      "Once I strode all the way to the crossing and still had to wait. I pretended I'd just been enjoying a walk.",
    ],
    [
      '办公室换了安静的键盘，我不用回头，也知道谁还在认真找标点。',
      "The office has quieter keyboards now. I can still tell who's hunting for punctuation without looking round.",
    ],
    [
      '我喜欢把橙皮剥成一整条，剥断了也没关系，反正没人替我评分。',
      "I like peeling an orange in one strip. If it breaks, nobody's giving me marks for it.",
    ],
    [
      '有人建议午休打羽毛球，我先练着抬头，免得球来了还盯着手机。',
      "Someone suggested badminton at lunch. I'm practising looking up so I won't still be staring at my phone when the shuttle comes.",
    ],
    [
      '家里的挂画稍微歪着也挺好，我一想把它扶正，就得放下手里的零食。',
      "I don't mind the picture at home hanging crookedly. Straightening it would mean putting my snack down.",
    ],
    [
      '我拆开旧音箱看了看，里面比外面整齐，暂时不敢说自己会修。',
      "I opened an old speaker and found it tidier inside than out. I'm not ready to claim I can repair it.",
    ],
    [
      '同事讲笑话我慢半拍才懂，大家已经喝茶，我才对着杯沿笑起来。',
      "I catch a colleague's jokes a little late. Everyone's drinking tea by the time I start laughing into my cup.",
    ],
    [
      '我选吐司先看边，脆一点才有咬头。',
      'I choose toast by its edges. I like something crisp to bite into.',
    ],
    [
      '新袜子太滑，在地毯上走得格外认真。',
      'My new socks are so slippery that I walk very carefully on the carpet.',
    ],
    [
      '口琴吹完擦一擦，总比重新练曲子容易。',
      'Wiping the harmonica is always easier than practising the tune again.',
    ],
    [
      '我喜欢听电梯叮一声，有种终于轮到我的感觉。',
      "I like the lift's little ding. It feels as though it's finally my turn.",
    ],
    [
      '烤饼上的裂口，我就当是留着涂果酱的。',
      'I treat the cracks in my scones as extra space for jam.',
    ],
    [
      '同事开始聊跑步，我先把背坐直了。',
      'When my colleagues start talking about running, I sit up straighter.',
    ],
    [
      '有些歌只记得一句，也够我洗完碗了。',
      'One line is all I remember of some songs, but it gets me through the washing-up.',
    ],
    [
      '我剪纸总沿着线外面，留点改主意的地方。',
      'I cut just outside the line on paper. It leaves room to change my mind.',
    ],
  ],
  helen: [
    [
      '我喜欢读别人写在页边的小问号，书合上以后，好像还留着谈话。',
      'I like the little questions people write in the margins. When the book shuts, the conversation still seems to be there.',
    ],
    [
      '学员说终于听懂巴士司机的话，我问了半天，原来只是他也没零钱。',
      "A learner said they'd finally understood the bus driver. After some questioning, it turned out neither of them had any change.",
    ],
    [
      '讲故事时可以先说最想说的那句，我自己介绍一本书也常从中间开始。',
      'A story can begin with the line you most want to say. I often start introducing a book halfway through it.',
    ],
    [
      '我爱听不同的人念同一首诗，停的地方不一样，连里面的路也像换了。',
      'I enjoy hearing different people read the same poem. Their pauses change it, as if even its paths have moved.',
    ],
    [
      '有本旧书的封皮修过很多回，摸起来有起伏，比书里的地图还立体。',
      'One old book has had its cover mended so often that it feels more mountainous than the map inside.',
    ],
    [
      '教室墙上留了一小块空白，没贴提示，有人说看着那儿才想得出词。',
      'I left a patch of classroom wall without reminders. Someone said it was the one place they could look to think of a word.',
    ],
    [
      '我练着少在别人停顿时接话，手里捏着粉笔，才发现自己也挺着急。',
      "I'm trying not to fill other people's pauses. Holding the chalk, I notice how impatient I can be myself.",
    ],
    [
      '借来的侦探小说我会先看目录，不猜凶手，只想知道在哪一章下雨。',
      "I look at the contents of a borrowed mystery first. I'm not guessing the murderer, just wondering which chapter has rain.",
    ],
    [
      '有人念错一个词，反倒让我想起童年邻居的说法，我听着先笑了笑。',
      "Someone's slip over a word reminded me of how a childhood neighbour spoke. I found myself smiling at the memory.",
    ],
    [
      '改作业时我喜欢用绿笔，不像红笔那么醒目，擦不掉的地方也好看些。',
      "I like marking in green. It's less conspicuous than red, and the bits that won't rub out look nicer too.",
    ],
    [
      '有时一整页只改个小词，我自己读出声，才知道刚才为何一直不顺。',
      'Sometimes I change just one small word on a page. Reading it aloud tells me why it kept catching.',
    ],
    [
      '我把食谱也当故事看，读到揉面那一段，常觉得写书的人还没说完。',
      'I read recipes like stories. By the kneading paragraph, I often feel the writer still has more to tell me.',
    ],
    [
      '有人把书送回时包了层布，我拆得很认真，仿佛自己先借到了一份礼物。',
      "Someone returned a book wrapped in cloth. I unwrapped it carefully, as if I'd borrowed a present first.",
    ],
    [
      '我喜欢去旧剧院看侧墙，补过的地方还在，台上的故事倒已经换了。',
      "I like looking at the old theatre's side walls. The repairs stay visible while the story on stage changes.",
    ],
    [
      '学生问我也会不会紧张，我拿起自己写满改字的讲稿，先给他看了看。',
      'A student asked whether I get nervous too. I showed them my own speech, covered in crossings-out.',
    ],
    [
      '有些信只写问候也够了，读信的人认出笔迹，可能已经知道是谁在笑。',
      "Some letters need only a greeting. The reader recognises the handwriting and may already know who's smiling.",
    ],
    [
      '我喜欢书翻页的声音，比铃声轻多了。',
      "I like the sound of a turning page. It's gentler than a bell.",
    ],
    [
      '句子读顺了，肩膀也会跟着松下来。',
      'When a sentence flows, I feel my shoulders relax with it.',
    ],
    [
      '新词先试着用，写在纸上总显得更拘谨。',
      'I like trying a new word aloud. It always looks more formal on paper.',
    ],
    [
      '我读菜谱也会做笔记，常写的是多放一点。',
      'I take notes in recipes too. They usually say, “A little more.”',
    ],
    [
      '小孩问故事里的狗吃什么，我也得认真想。',
      "When a child asks what the story's dog eats, I have to think about it properly.",
    ],
    [
      '厚书躺在腿上，手空出来正好捧着茶。',
      'A thick book rests on my lap, leaving both hands free for tea.',
    ],
    [
      '我不折书角，折过的地方摸着太心疼。',
      "I don't turn page corners down. Feeling the crease makes me wince.",
    ],
    [
      '我喜欢读信的落款，名字像隔着纸招手。',
      'I like the signatures on letters. A name feels like a wave through the paper.',
    ],
  ],
  priya: [
    [
      '我拼别人的姓时会轻轻点桌面，停在哪个字母，手指也正好知道。',
      "I tap the desk gently when spelling a surname. My fingers know which letter I've reached.",
    ],
    [
      '做拼图我先找边，拼到只剩天空时，才想起自己其实更喜欢看树。',
      'I start a jigsaw with the edges. Once only the sky is left, I remember I prefer looking at trees.',
    ],
    [
      '我喜欢梨切开后那股清味，果汁滴到手上，擦干净了也还闻得到。',
      'I like the fresh smell of a cut pear. Even after wiping the juice off my hand, I can still smell it.',
    ],
    [
      '邻居借我个深盘子，我还回去时装了饼干，盘子倒又多住了一天。',
      'A neighbour lent me a deep plate. I filled it with biscuits to return it, so it stayed another day.',
    ],
    [
      '我在公园选路会避开碎石，不是嫌难走，是懒得回家再倒一遍鞋。',
      'I avoid gravel paths in the park. Walking on them is fine; emptying my shoes at home is the nuisance.',
    ],
    [
      '有人等候时一直搓手，我给他找了本大一点的杂志，拿着能稳当些。',
      'Someone kept rubbing their hands while waiting. I found them a bigger magazine so they had something steady to hold.',
    ],
    [
      '我试着给旧外套换衬里，拆开才发现，里面缝的线比我想的细致。',
      "I tried replacing an old coat's lining. Once it was open, I found stitching much neater than I'd expected.",
    ],
    [
      '旅行带回来的石头我会挨个摸摸，不记得地名，也记得当时河水多凉。',
      'I feel the stones I bring back from trips. Even when the place name escapes me, I remember the cold river water.',
    ],
    [
      '我不太会跟着音乐打拍子，唱到高兴处，脚就先把自己的拍子换了。',
      "I'm not good at keeping time to music. At the cheerful bit, my feet choose a rhythm of their own.",
    ],
    [
      '前台的木头隔板磨得很滑，我摸着那道边，就知道手里的事可以先放下。',
      'The wooden divider at reception has worn smooth. Feeling its edge reminds me I can put the task in my hands down.',
    ],
    [
      '我喜欢听别人讲养狗的规矩，每家的狗听上去都只同意了其中一条。',
      "I like hearing people's rules for their dogs. Every dog seems to have agreed to just one of them.",
    ],
    [
      '有本小说我翻了好久才开始读，封面画着海，先拿它当窗户也不错。',
      'I spent ages looking at a novel before reading it. With that sea on the cover, it made a good window first.',
    ],
    [
      '我试过把胡萝卜刨得很细，吃的时候省了嚼，洗刨子时倒补回来。',
      'I grated carrots very finely to save chewing. Cleaning the grater more than made up the work.',
    ],
    [
      '等水烧开时我会活动手腕，做着做着，倒像在跟水壶认真指挥什么。',
      "I stretch my wrists while the kettle boils. After a while it looks as though I'm conducting it.",
    ],
    [
      '我给自己留了个不用装东西的小盒，看着里面空空的，倒觉得挺宽敞。',
      "I've kept a little box that doesn't have to hold anything. Looking inside it feels surprisingly spacious.",
    ],
    [
      '遇到老熟人先聊别的也好，姓氏记不起来，至少还记得他爱吃什么。',
      'It helps to start with something else when I meet an old acquaintance. I may lose their surname, but I remember their favourite food.',
    ],
    [
      '我喜欢脆梨，咬一口自己先听见。',
      'I like a crisp pear. I get to hear the crunch first.',
    ],
    [
      '针织袖口松些好，抬手不用跟它商量。',
      "I like a loose knitted cuff. I don't have to negotiate with it when I lift my hand.",
    ],
    [
      '拼图留到一半，回家才有点想接着做的事。',
      "I leave the jigsaw half done so there's something I fancy coming home to.",
    ],
    [
      '我收石头不收大的，口袋先替我做了决定。',
      'I only collect small stones. My pockets made that decision for me.',
    ],
    [
      '好笑的话讲两回，我自己还是会笑。',
      'I still laugh at my own funny story the second time I tell it.',
    ],
    [
      '我爱把饼干蘸软一点，咬下去不用出大声。',
      'I like dipping a biscuit until it softens. I can take a quiet bite then.',
    ],
    [
      '走累了就看看高处，窗台上的花各有主意。',
      "When I'm tired of walking, I look up. Every windowsill has its own idea about flowers.",
    ],
    [
      '唱不出的调子，我就用手指轻轻点完。',
      "If I can't sing the tune, I tap the rest of it out with my fingers.",
    ],
  ],
  dave: [
    [
      '我试新题会念给厨房听，没人回答不算难，可能只是锅里的水开了。',
      "I read new questions towards the kitchen. Silence doesn't mean they're hard; the pan might just be boiling.",
    ],
    [
      '有人点歌只会哼开头，我也跟着哼，歌名没找到，倒把擦桌子的手带快了。',
      "Someone hummed the start of a request, and I joined in. We didn't find the title, but my wiping hand sped up.",
    ],
    [
      '我喜欢烤土豆皮那点焦味，切开时先听一听，脆不脆耳朵也能猜。',
      'I like the toasted smell of baked potato skins. Listen when you cut one; your ears can judge the crispness too.',
    ],
    [
      '有位客人总把帽子摆在正对面，别人拉开凳子前，还得先跟帽子打招呼。',
      'One regular puts their hat opposite them. Before taking that stool, people have to greet the hat.',
    ],
    [
      '我给新来的服务员示范端盘，空盘当然容易，装上汤我也得慢慢走。',
      'I showed a new server how to carry plates. Empty ones are easy; with soup on them, I slow down too.',
    ],
    [
      '有些歌的前奏很长，我能先把吧台擦完，唱的人还没唱到第一句。',
      'Some songs have such long introductions that I can finish wiping the bar before the singer reaches the first line.',
    ],
    [
      '看客人对答案比自己念题有意思，有人说得很轻，整张桌子反而凑近了。',
      'Watching people compare answers is better than reading the questions. A quiet reply can bring a whole table closer.',
    ],
    [
      '喝完饮料再把杯子放回桌上，轻轻一声，听着像一句话终于讲完。',
      'I like the sound of a glass going down after its last sip. That small tap feels like the end of a sentence.',
    ],
    [
      '我把门边的小地毯卷起洗过，才知道底下那块地板，原来颜色能这么浅。',
      "I rolled up the little rug by the door to wash it. I'd forgotten how pale the floor underneath could be.",
    ],
    [
      '有人问我最喜欢哪道题，我想了好久，喜欢的其实是答错后那阵笑声。',
      "Someone asked for my favourite question. After thinking it over, I realised it's the laughter after a wrong answer I like.",
    ],
    [
      '我煮豌豆汤喜欢留点没压碎的，嚼到的时候，才知道勺子不是在喝茶。',
      "I leave a few peas whole in the soup. Biting one reminds you that the spoon isn't just delivering tea.",
    ],
    [
      '客人带来个老笑话，我听过也照样笑，他讲的时候把眉毛都用上了。',
      "A customer told me an old joke. I laughed though I'd heard it; they put their eyebrows into the telling.",
    ],
    [
      '有回给人指去洗手间的路，手里还拿着抹布，远看倒像在发小旗子。',
      'Once I gave directions to the toilets with a cloth still in my hand. From a distance it must have looked like a little flag.',
    ],
    [
      '我喜欢看台球转到快停下的那一下，所有人都跟着轻轻往同一边歪。',
      'I like the moment just before a pool ball stops. Everyone leans gently in the same direction.',
    ],
    [
      '新装的门把手摸着太凉，客人先缩一下手，才想起自己是要进来的。',
      'The new door handle feels cold. People draw their hand back before remembering they meant to come in.',
    ],
    [
      '有些人喜欢站着聊天，脚尖朝门口，故事却总能再多讲上好几段。',
      'Some people chat standing up with their feet towards the door. The story still finds several more parts.',
    ],
    [
      '一口热汤下去，人说话也会软一点。',
      "A sip of hot soup seems to soften a person's voice.",
    ],
    [
      '出题时多留个空，念起来才不喘。',
      'I leave a little space when writing questions. It gives me room to breathe when I read them.',
    ],
    [
      '我喜欢听唱针落下，歌还没来，耳朵先坐好了。',
      'I like hearing the needle go down. My ears settle in before the song starts.',
    ],
    [
      '薯条蘸多少醋，我让客人自己拿主意。',
      'I let people decide how much vinegar their chips need.',
    ],
    [
      '有人进门先点头，我也懂他要的那杯。',
      'Some people just nod when they come in. I know which drink they mean.',
    ],
    [
      '题目的答案太长，我念着也会想喝水。',
      "If an answer's too long, even reading it makes me thirsty.",
    ],
    [
      '洗净的木托盘有股味道，闻着像要开饭。',
      'A clean wooden tray has a smell that makes me expect dinner.',
    ],
    [
      '擦过的吧台滑溜溜，袖口放上去也能歇脚。',
      'The polished bar is so smooth that even my cuffs can take a rest on it.',
    ],
  ],
  rahman: [
    [
      '我喜欢听面包袋打开的声音，纸一松，刚才还没觉得饿的人就会看过来。',
      "I like the sound of a bread bag opening. As the paper unfolds, even people who weren't hungry turn to look.",
    ],
    [
      '有人拿着空调料瓶来问，我闻了闻瓶口，名字没想起，肚子先替我回答。',
      'Someone brought an empty spice jar to ask about. I sniffed the rim; before I found its name, my stomach answered.',
    ],
    [
      '小店换货架那回，我站在新位置后面，邻居进门竟先跟墙打了招呼。',
      'When I moved the shelves, I stood in a new spot. A neighbour came in and greeted the wall first.',
    ],
    [
      '我剥橘子爱把白筋留一点，甜里带点苦，才像真的吃了整只果子。',
      'I leave some pith when peeling an orange. A little bitterness with the sweet feels like eating the whole fruit.',
    ],
    [
      '有人买东西只说颜色和大小，我跟着比划，最后找出来双方都觉得有道理。',
      'Some people describe what they want by colour and size. We gesture until we find something that makes sense to both of us.',
    ],
    [
      '货架上的茶我自己也会换着喝，不然别人问起，我只会把盒子读一遍。',
      'I try different teas from the shelves myself. Otherwise, when someone asks, I can only read them the box.',
    ],
    [
      '我喜欢把水果蒂朝上摆，客人拿起一只时，好像先跟它点了一下头。',
      'I arrange fruit with the stalks up. Picking one up looks like giving it a little nod first.',
    ],
    [
      '有人进店总先问我吃没吃，我回答完再问他，买的东西反倒最后才讲。',
      "One customer always asks whether I've eaten. I answer and ask them back before we get to the shopping.",
    ],
    [
      '刚开始做生意时，我连包装绳都舍不得剪，后来才学会让袋子容易打开。',
      'When I started trading, I hated cutting even a length of wrapping string. Later I learnt to make a bag easy to open.',
    ],
    [
      '我把散着的香料一小撮一小撮装好，手洗过了，握拳还能闻见味道。',
      'I pack loose spices in little pinches. Even after washing, I can smell them when I close my hand.',
    ],
    [
      '店里有个小孩子只对着秤讲话，他站得矮，觉得那面盘子像个大耳朵。',
      'A little visitor talks only to the scales. From their height, the pan must look like an enormous ear.',
    ],
    [
      '有位老客人买苹果先敲一敲，我听了好久，也没学会那声音该怎么选。',
      "One regular taps apples before buying them. I've listened for ages without learning which sound to choose.",
    ],
    [
      '我喜欢走到街对面看看自己的招牌，站远点，才记得这也是别人的风景。',
      "I like looking at my sign from across the street. From there I remember it's part of someone else's view too.",
    ],
    [
      '有时客人讲完话还站着，我就把袋口再折一折，等他想起最后那件东西。',
      "Sometimes a customer stays after finishing a sentence. I fold the bag's top again while they remember that last item.",
    ],
    [
      '拆大袋米时我喜欢听它往下落的声，忙完才想起，自己也该吃点东西。',
      "I like hearing rice pour from a big sack. Once it's done, I remember I ought to eat something too.",
    ],
    [
      '有人说这里味道一直没变，我闻着只认出木头、纸袋，还有自己的茶。',
      'Someone said the shop smells just as it always has. I can only pick out the wood, the paper bags and my tea.',
    ],
    [
      '这块姜长得像手，掰开还有点不忍心。',
      'This piece of ginger looks like a hand. I almost feel bad breaking it.',
    ],
    [
      '茶要是回甘，我喝完还会抿一下嘴。',
      'If the tea leaves a sweet finish, I find myself pressing my lips together afterwards.',
    ],
    [
      '我挑苹果先闻，不着急找最亮的那只。',
      'I smell apples first rather than choosing the shiniest one.',
    ],
    [
      '旧围裙洗软了，打个结也不硌腰。',
      "The old apron's washed soft. Its knot no longer digs into my waist.",
    ],
    [
      '空店里哼首歌，声音还能绕货架回来。',
      'If I hum in the empty shop, the sound comes back round the shelves.',
    ],
    [
      '薄饼边上脆，掰下来总想先尝。',
      "The flatbread's crisp at the edges. I always want to break a bit off first.",
    ],
    [
      '花生嚼慢一点，嘴里才留得住香。',
      'If I chew peanuts slowly, their flavour stays with me longer.',
    ],
    [
      '给纸袋折口时，我喜欢让两边一样宽。',
      "When folding a paper bag's top, I like the two sides to match.",
    ],
  ],
  lina: [
    [
      '我画人的手总比脸认真，拿东西时哪根手指弯着，比笑没笑还容易记。',
      'I spend more care on drawn hands than faces. I remember which finger bends round an object more easily than a smile.',
    ],
    [
      '有回把河岸画成直线，回去再看才发现，水边没有谁真肯站得那么齐。',
      'Once I drew the riverbank straight. Looking again, I found nothing by the water really stood in such a neat line.',
    ],
    [
      '我喜欢给毛线换种针法，同一团线摸起来会变，像换了一种说话声音。',
      'I like trying a different stitch with the same wool. Its new texture feels like a change of voice.',
    ],
    [
      '画街景我常把人留到最后，不是怕画错，是还没想好他们要往哪儿去。',
      "I often leave people until last in a street drawing. It's not the shapes that worry me; I haven't decided where they're going.",
    ],
    [
      '我选颜色先铺在一起看，单独喜欢的，挨到旁边未必肯好好相处。',
      'I lay colours together before choosing. Two I like separately might not get along side by side.',
    ],
    [
      '有人夸画像，我反而要看一会儿，自己总先记得那块改过好多遍的地方。',
      'When someone says a drawing looks right, I need another look. I still see the patch I redid so many times.',
    ],
    [
      '我喜欢把织好的小样留着，摸到那种凹凸，就能想起手上怎么走线。',
      'I keep little knitted samples. Feeling their ridges reminds my hands how the stitches go.',
    ],
    [
      '我画过街角那棵树，画到旁边有人坐过的草，才觉得这块地方算完整。',
      "I drew the tree on the corner. It only felt like a whole place once I'd added the flattened grass where someone had sat.",
    ],
    [
      '有些衣服穿旧了颜色更好，布不再那么亮，搭在身上倒像本来就这样。',
      'Some clothes improve as their colour fades. Once the cloth loses its shine, it seems more at home on you.',
    ],
    [
      '我喜欢听别人形容一幅画，有人先说远处的桥，我却从鞋边那点泥画起。',
      'I like hearing a drawing described. Someone starts with the distant bridge; I began with the mud by a shoe.',
    ],
    [
      '织完一行把东西放下，再拿起来时，手指常比我先记得要从哪里继续。',
      'After I put down a finished row, my fingers often remember where to continue before I do.',
    ],
    [
      '我画水果不求每只都圆，削过皮留下的小平面，比圆得规矩更有意思。',
      "I don't need every drawn fruit to be round. A little flat where it's been peeled interests me more than a perfect circle.",
    ],
    [
      '有人问我能不能画得快些，我试着少画几笔，最后反倒盯着空白看更久。',
      'Someone asked whether I could draw faster. I tried fewer lines and ended up looking at the empty spaces longer.',
    ],
    [
      '我给旧抱枕挑了块素布，纹路不抢眼，手放上去却很容易分清正反面。',
      'I chose plain cloth for an old cushion. The weave is quiet to look at, but my hand easily knows its two sides.',
    ],
    [
      '走到有回声的地方，我喜欢把脚步放轻，听下一步到底是我的还是墙的。',
      'In a place with an echo, I soften my steps. I like hearing whether the next footfall belongs to me or the wall.',
    ],
    [
      '我画过一只蜷着的狗，添上耳朵才发现，自己一直把尾巴认成了鼻子。',
      "I drew a curled-up dog. Only when I added the ears did I realise I'd been taking its tail for its nose.",
    ],
    [
      '我画圆总留个口，合得太齐像在盖章。',
      'I leave a gap in a drawn circle. Too neat a join feels like stamping it.',
    ],
    [
      '毛线贴着手掌走，有时比成品还好摸。',
      'Sometimes the wool passing over my palm feels nicer than the finished knitting.',
    ],
    [
      '素描里的空地方，也得留个能呼吸的大小。',
      'Even the blank part of a sketch needs room to breathe.',
    ],
    [
      '铅笔横着涂，纸的纹路就自己出来了。',
      "Shade with the side of a pencil and the paper's grain shows itself.",
    ],
    [
      '我喜欢布料洗过的气味，像东西终于能用了。',
      'I like the smell of freshly washed cloth. It feels ready to use at last.',
    ],
    [
      '缝一小段停一下，线就不容易拧成团。',
      'Pausing after a short bit of sewing keeps the thread from twisting into a knot.',
    ],
    [
      '画水不必全涂满，留白也能有点亮。',
      "I don't fill in all the water in a drawing. Blank paper can give it a glint.",
    ],
    [
      '手指沾了炭粉，一碰哪里都像刚画过。',
      'With charcoal on my fingers, everything I touch looks freshly drawn.',
    ],
  ],
  gareth: [
    [
      '我喜欢从同一条路走回来，去时看见的门，回来就能看见门里的树。',
      'I like returning along the same road. On the way out I see the doors; coming back I notice the trees behind them.',
    ],
    [
      '有位住户给门口的铃装了小罩，我按之前总想先掀开，像给它脱雨衣。',
      'One resident put a little cover over the bell. I always want to lift it before pressing, as if removing its raincoat.',
    ],
    [
      '我走路会听自己鞋底的声响，换过路面，脚还没说累，耳朵就先知道。',
      'I listen to my soles as I walk. My ears notice a change of paving before my feet have a chance to complain.',
    ],
    [
      '有些人隔着门问是谁，听见我名字，声音就从屋子里面慢慢走近了。',
      "Some people ask who's there through the door. At my name, their voice slowly comes closer from inside.",
    ],
    [
      '我喜欢看别人给门口放的小物件，陶瓷鸟搬个位置，也算这条路有新鲜事。',
      'I like the little things people put by their doors. A ceramic bird changing position is news on my round.',
    ],
    [
      '骑车过小巷我会放轻铃声，猫能听见就够，不必让整条巷子知道我来了。',
      "I ring softly through the narrow lane. The cat needs to hear me; the whole lane doesn't need to know I've arrived.",
    ],
    [
      '旧地图里的小巷还画着，我沿着它找过去，尽头已经能闻到面包味。',
      'An old map still showed the little lane. Following it, I reached an end that smelled of bread.',
    ],
    [
      '有人把门前刷得很干净，还想替我擦鞋，我只好先把两只脚好好站稳。',
      "Someone scrubbed their doorstep and offered to clean my shoes too. I thought I'd better get both feet firmly down first.",
    ],
    [
      '我会把空邮包抖开晾一会儿，里面带回来的空气，闻着也像刚走过路。',
      "I air the empty postbag for a while. Even the air inside smells as though it's just walked the round.",
    ],
    [
      '有些字写得挤在一起，我读出来会自己留空，念清一个名字也像整理东西。',
      'Some handwriting crowds together. I add spaces as I read it; making a name clear feels like putting something in order.',
    ],
    [
      '我喜欢看楼梯扶手磨亮的地方，看不见人，也知道很多手从这里经过。',
      'I like the polished patches on stair rails. Even with nobody there, you can see how many hands have passed.',
    ],
    [
      '有人请我尝过自家烤的面包，我记住了外皮的硬度，地址倒本来就认得。',
      "Someone offered me their homemade bread. I remembered the crust's firmness; I already knew the address.",
    ],
    [
      '路上捡到的羽毛我不带走，摆到矮墙上，给下一个走来的人也留点好看。',
      'I leave a feather I find on a low wall rather than taking it. The next person along can enjoy it too.',
    ],
    [
      '有位住户总从窗里挥手，窗玻璃反光时，我看不清脸，也会跟着抬手。',
      'One resident always waves through the window. Even when the glass hides their face, I raise my hand back.',
    ],
    [
      '我不大记得哪条路最长，倒记得哪里会有人喊我，走到那儿步子也轻点。',
      "I don't remember which road is longest. I remember where someone calls my name; my step gets lighter there.",
    ],
    [
      '有些门推开得慢一点才不响，我走了好多回，已经会先把呼吸也放轻。',
      'Some doors stay quiet if opened slowly. After so many visits, I find myself softening my breath as well.',
    ],
    [
      '鞋底踩过木桥，我喜欢那点空空的回声。',
      'I like the hollow echo of my soles on a wooden bridge.',
    ],
    [
      '邮包背带宽一点，肩膀真能分得出来。',
      'My shoulder really can tell the difference when the postbag strap is wider.',
    ],
    [
      '我吃三明治不拆到底，纸还能接住碎屑。',
      'I keep the bottom of a sandwich wrapped. The paper catches the crumbs.',
    ],
    [
      '路牌漆得新，旧墙倒显得更有精神了。',
      'Fresh paint on a street sign seems to perk up the old wall too.',
    ],
    [
      '我喜欢软底鞋，走完路脚还肯跟我回家。',
      'I like soft-soled shoes. After the round, my feet still agree to take me home.',
    ],
    [
      '人行道上的粉笔画，我跨过去不踩着。',
      'I step over chalk drawings on the pavement rather than across them.',
    ],
    [
      '空车推起来轻，我得提醒自己别走太快。',
      'The empty bicycle is so light to push that I have to remember to slow down.',
    ],
    [
      '我在门口收伞，会等最后那滴水落下。',
      'When closing my umbrella at a door, I wait for the last drop to fall.',
    ],
  ],
};

export const everydayDialogue: Record<string, Npc['lines']> =
  Object.fromEntries(
    Object.entries(everydayCopy).map(([npc, pairs]) => [
      npc,
      pairs.map(([zhCN, en], i) => ({
        id: `${npc}-everyday-${i + 1}`,
        text: { zhCN, en },
      })),
    ]),
  );
