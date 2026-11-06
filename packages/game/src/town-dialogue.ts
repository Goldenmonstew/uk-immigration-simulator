import type { Npc } from './types';

const copy: Record<string, [string, string][]> = {
  margaret: [
    [
      '林遥，你那工作得老盯着屏幕吧？来看看叶背，虫子可不发提醒。',
      'Yao, all that screen work. Try leaf undersides; insects don’t send alerts.',
    ],
    [
      '你写程序能让字排整齐吗？我这排芜菁已经放弃听指挥了。',
      'Can your programs line words up? My turnips have stopped taking instructions.',
    ],
    [
      '你要是哪天加班回来累了，先别替盆栽担心，我也常养坏。',
      'If overtime wears you out, don’t worry about the pots. I lose plants too.',
    ],
    [
      '嘉宁，给孩子留块能挖的土吧，不必每个坑都得长出东西。',
      'Ka Ning, leave the child some digging ground. Not every hole needs to grow something.',
    ],
    [
      '你家孩子看菜地的角度比我低，说不定先发现藏着的豆荚。',
      'Your child sees the plot from lower down. Might spot the hidden pods first.',
    ],
    [
      '嘉宁，你们一家过来坐得下，我的小凳本来就不讲配套。',
      'Your family will fit, Ka Ning. My stools have never been a matching set.',
    ],
    [
      '索菲娅，杰米爱琢磨炖菜，问他芜菁叶能不能留，我已经把嫩的分开装好了。',
      'Sofia, ask Jamie the stew expert about turnip tops. I’ve separated the tender ones already.',
    ],
    [
      '你和杰米带杯子就行，壶不管杯子配不配套，我自己的那只连盖子都配错了。',
      'Just bring cups, you and Jamie. The kettle won’t check they match; even my own cup has the wrong lid.',
    ],
    [
      '索菲娅，班表和种植表一样挤吧？铅笔借你，削笔刀在旁边，擦掉还可以重写。',
      'Rota as crowded as my planting chart, Sofia? Pencil and sharpener here; rub out and try again.',
    ],
    [
      '那枚蓝丝带拿到手了，菜还得自己洗，对吧？我也省不掉这步。',
      'Got the blue ribbon, but still have to wash the vegetables? Me too.',
    ],
    [
      '续签手续忙完了，来闻闻新翻的土吧，这东西不需要装文件袋。',
      'Renewal done? Smell the turned earth. Nothing here needs a document sleeve.',
    ],
    [
      '你钓到狗鱼的事我听说了，钓竿可别拿来给我的豆子搭架。',
      'Heard about your pike. Don’t lend the fishing rod to my beans.',
    ],
    [
      '约人看锅炉那回，你是不是也先挪花盆？我当初差点拿它们堵住维修员的路。',
      'When arranging the boiler visit, did you move pots too? Mine nearly blocked the repairer’s way.',
    ],
    [
      '海伦认花名认真，把我的潦草字当成新品种，还特意从书里找来一张图核对。',
      'Helen mistook my scrawl for a new variety, then brought a picture from a book to check it.',
    ],
    [
      '加雷思经过菜地会侧着邮包走，我把支架往里挪一点，也给他的车轮留条路。',
      'Gareth turns his postbag sideways by the plots. I move supports in a little to leave his wheels room too.',
    ],
    [
      '普里娅买盆先量窗台，连边沿都算，我先买再商量，最后总得挪走一本书。',
      'Priya measures even the sill edges before buying pots. I buy first, then move another book to make room.',
    ],
    [
      '那块木牌的墨印还在我袖口上，洗衣粉认输了，我也就留着。',
      'The plot-label ink is still on my cuff. The detergent surrendered, so I kept it.',
    ],
    [
      '折椅扶手擦亮了一小块。我讲他那会儿，你一直没催着起身。',
      'A little patch of that chair arm shines now. You never rushed me when I spoke of him.',
    ],
    [
      '我把破盆套在好盆外面，裂缝正好露出一片绿，连种错的苗都有了窗户。',
      'The cracked pot surrounds a sound one. A leaf shows through its own little window, even from a misplaced seedling.',
    ],
    [
      '种子袋拆开总有几粒混在一起，我拿蛋盒分格，空出来那格正好放眼镜。',
      'Seeds mix when the packets open. An egg box separates them, with a spare compartment for my glasses.',
    ],
    [
      '小屋挂钩看着都空，走近才见绳圈叠了好几层，我得一层层把水壶解下来。',
      'The shed hooks look empty until you see the layered string loops. Getting a watering can down takes unpicking.',
    ],
    [
      '有人问种地的秘诀，我先找回土上的眼镜，镜片一擦，才认出问话的邻居。',
      'Asked for a gardening secret, I first retrieved my glasses from the soil. Clean lenses helped identify the neighbour.',
    ],
    [
      '这把小铲木柄磨得亮，手套摘了更好握，换了新铲我反倒总在找这一把。',
      'The trowel’s worn handle is best without gloves. Even with a new trowel, I keep reaching for this one.',
    ],
    [
      '旧报纸铺好才分豆子，读完半条新闻，才发现照片里的人全被豆子盖住了。',
      'Newspaper down to sort beans. Halfway through a story, I notice everyone in the picture has a bean on their face.',
    ],
    [
      '壶盖配错也能倒水，就是响得厉害，我用绳拴好了，它还得继续跟我出门。',
      'The wrong lid still pours, noisily. Tied it on with string; it still has outings to make.',
    ],
  ],
  ade: [
    [
      '林遥，你也是写代码的，能不能解释为什么重开一次就好了？',
      'Yao, you write code. Why does turning it off and on work?',
    ],
    [
      '你排查程序时会对着它说话吗？我对表格讲过不少好话。',
      'Do you talk to programs while debugging? I’ve tried flattery on spreadsheets.',
    ],
    [
      '林遥，想聊点电脑以外的吧，我可以先贡献一个失败的烤饼。',
      'Something away from computers, Yao? I can offer a failed scone story.',
    ],
    [
      '嘉宁，带孩子出门的包是不是永远能多掏出一样我没想到的？',
      'Ka Ning, does a parent’s bag always hold one more thing I haven’t thought of?',
    ],
    [
      '你家那位和孩子都记得住自己的水壶吗？我连自己的都得查。',
      'Can your partner and child remember their bottles? I have to check my own.',
    ],
    [
      '嘉宁，学校通知的字都挤一块吧？我做表格也常舍不得换页。',
      'School letters cram it in, don’t they, Ka Ning? I’m reluctant to add spreadsheet pages too.',
    ],
    [
      '索菲娅，你和杰米排日历时先写谁的？我约会总得先把两种颜色的笔都找齐。',
      'Whose diary goes down first, Sofia, yours or Jamie’s? I need both coloured pens before scheduling anything.',
    ],
    [
      '你和杰米谁会找东西？我收进盒子的反倒最难找，盒子上的标签还贴得特整齐。',
      'Which of you finds things? Mine vanish into boxes whose labels are, annoyingly, perfectly neat.',
    ],
    [
      '索菲娅，有没有不必翻译给杰米的笑话？先让我猜，猜错也留个能解释的地方。',
      'Any jokes you spare translating for Jamie, Sofia? Let me guess, with room for an explanation if I fail.',
    ],
    [
      '菜地评比的蓝丝带可没法复印吧？真好，终于有件事不用留副本。',
      'Can’t photocopy a show ribbon, can you? Lovely to have something without a duplicate.',
    ],
    [
      '续签办完还留着提醒吗？我会把完成的事项也勾得特别用力。',
      'Still got the renewal reminder? I give completed tasks an especially firm tick.',
    ],
    [
      '你钓到狗鱼了？这可比我捞起水槽里的茶匙有技术多了。',
      'You caught a pike? Considerably more skill than retrieving my teaspoon from the sink.',
    ],
    [
      '说起你约人看锅炉那回，我还记着自己查过门铃，原来只是没装好电池。',
      'Your boiler arrangements remind me of checking my doorbell. The battery wasn’t fitted properly.',
    ],
    [
      '戴夫整理题目不用表格，我翻到题册背面也没找到，只有一张替换过的歌单。',
      'No spreadsheet for Dave’s questions. Checked the book’s back too; just a replaced playlist.',
    ],
    [
      '拉赫曼心算找零时，我已经在找计算器，找到以后，他连纸袋都替我打开了。',
      'While I find my calculator, Rahman works out the change and has my paper bag open already.',
    ],
    [
      '莉娜画路线比我画流程清楚，分岔都有去处，我的箭头最后总指向另一张纸。',
      'Lina’s routes have somewhere for every branch. My flowchart arrows end up pointing to another sheet.',
    ],
    [
      '饭桌边的包我学会放脚下了，那把椅子总算不用替我看行李。',
      'The lunch bag goes by my feet now. The chair is free of luggage duty.',
    ],
    [
      '你陪我合上收件箱那回，我才发现茶凉了也还能重新烧水。',
      'When you sat with me after I closed the inbox, I remembered we could boil the kettle again.',
    ],
    [
      '透明文具盒买好了，找不到笔也没法怪盒盖，只好承认自己夹在耳朵上了。',
      'Transparent pencil case bought. Can’t blame the lid for a missing pen; have to admit it’s behind my ear.',
    ],
    [
      '回形针搭的小人舍不得拆，我给它放了张废纸当桌子，文件继续散在一旁。',
      'Can’t dismantle the paper-clip person. It has a scrap-paper desk now; the real documents remain scattered.',
    ],
    [
      '耳机线的结解开了，装回包又结成别的样子，我只好连包也一起倒过来看。',
      'Headphone knot undone. Back in the bag it becomes another shape; I end up turning the whole bag over.',
    ],
    [
      '塑料仙人掌落了灰，我查完怎么浇水才认清，最后拿擦屏幕的布救了它。',
      'Looked up watering before recognising the dusty plastic cactus. Screen cloth rescued it in the end.',
    ],
    [
      '快捷键便签挡住了键盘，我把它往上挪，又挡住屏幕角落，只好贴在杯子上。',
      'The shortcut note covered the keyboard, then the screen corner. It lives on the mug now.',
    ],
    [
      '新本子太平整，我先画个歪饭盒，盖子画得合不上，倒挺像我自己带的。',
      'Drew a crooked lunch box to break in the pristine notebook. Its lid won’t close; rather like my real one.',
    ],
    [
      '计时器响了才想起忘了定什么，我给它写了张小纸条，纸条却压在它底下。',
      'The timer rang; forgot what for. Wrote a reminder and somehow left it underneath the timer.',
    ],
  ],
  helen: [
    [
      '林遥，软件里的报错也有语气吗？我批作业会尽量写得轻一点。',
      'Yao, do software errors have a tone? I try to keep my corrections gentle.',
    ],
    [
      '你写代码也要反复读出声吗？我想象了一下，标点应该挺忙。',
      'Do you read code aloud too? I imagine the punctuation keeps you busy.',
    ],
    [
      '林遥，工作里的词先歇歇吧，书架上还有讲不会上班的龙的。',
      'Give the work vocabulary a rest, Yao. The shelves have dragons who never clock in.',
    ],
    [
      '嘉宁，孩子读得比你快也没关系，我有时翻页还得找眼镜。',
      'Ka Ning, it’s fine if your child reads faster. I sometimes need my glasses to turn a page.',
    ],
    [
      '你们一家想借不同的书就各挑各的，不用把书包排成一个主题。',
      'Your family can choose different books. The bag doesn’t need a single theme.',
    ],
    [
      '嘉宁，学校的通知可以慢慢问，字小也不等于事情都很急。',
      'Ask about the school letters at your own pace, Ka Ning. Small print needn’t mean urgency.',
    ],
    [
      '索菲娅，你和杰米交换故事时各念一段也行，停在同一页，谁也不用赶着追谁。',
      'A passage each when you swap stories with Jamie, Sofia. Stop on the same page; neither needs to catch up.',
    ],
    [
      '你给杰米讲家里的事，先想起声音还是词？我有时得先哼一下，才能说清门铃。',
      'Telling Jamie about home: sounds or words first? I sometimes have to hum before describing a doorbell.',
    ],
    [
      '索菲娅，你和杰米喜欢不同结尾也没关系，书留在桌上，改天还可以各翻各的。',
      'You and Jamie can like different endings, Sofia. Leave the book on the table and return to your own pages.',
    ],
    [
      '你拿到菜地蓝丝带了！要把品种写下来，借书的人也会来问。',
      'A blue ribbon! Note the variety; even library readers may ask.',
    ],
    [
      '续签手续办妥，可以换本不夹材料清单的书了，书签随便挑。',
      'Renewal done. Choose a book without a paperwork checklist inside, and any bookmark.',
    ],
    [
      '狗鱼真让你钓到了？我那本鱼类图鉴总算有人能对照实物。',
      'You caught a pike? Someone can finally compare my fish guide with a real one.',
    ],
    [
      '你约锅炉维修那会儿，我也在记预约，纸夹在书里，翻到才想起是提醒。',
      'When you arranged the boiler visit, I noted an appointment too. Mistook its reminder for a bookmark.',
    ],
    [
      '普里娅借推理书先遮末页，我给她换了张不透字的借书条，免得漏出半个答案。',
      'Priya shields a mystery’s last page. Gave her an opaque loan slip so half an answer couldn’t show through.',
    ],
    [
      '玛格丽特夹的叶子太厚，书像多了一章，我拿薄纸包好，另放进旁边的小盒。',
      'Margaret’s pressed leaf gave a book an extra chapter. Wrapped it in tissue for a small box beside it.',
    ],
    [
      '阿德给捐来的杂志编了号，空盒也贴了签，我收好以后，都不舍得换个顺序。',
      'Ade numbered donated magazines and labelled the empty boxes. Now I can’t bear to change his order.',
    ],
    [
      '那张有问号的书签我没扔，划掉的地方比没划掉的还像问题。',
      'I kept our question-mark bookmark. The crossed-out bit looks even more questioning.',
    ],
    [
      '拼错自己名字的旧讲义还在，你看过之后，我倒不急着藏它了。',
      'The handout with my misspelt name is still here. Since you saw it, I’m less keen to hide it.',
    ],
    [
      '图书馆的印章盖歪了，日期像打算散步，借书的人还问我该从哪边读起。',
      'A crooked library stamp: the date looks ready to wander. A borrower asked which end to start reading.',
    ],
    [
      '靠垫排得像书脊，我伸手想借一本，翻过来只有洗涤标签，倒也认真读了。',
      'Cushions like book spines. Reached to borrow one, found a washing label, and read it carefully anyway.',
    ],
    [
      '大字书挪到低架后，有人不用踮脚也能翻目录，那把小梯子就先借给花盆。',
      'Large-print books on a low shelf let someone browse without tiptoes. The little step now serves the plant pots.',
    ],
    [
      '字典夹着面包店收据，查词的人大概很饿，我对着那串菜名也看了好一会儿。',
      'A bakery receipt in the dictionary. A hungry reader, perhaps; I spent a while reading its list myself.',
    ],
    [
      '眼镜绳打结了，解开才发现套住了衣领的小扣，难怪找眼镜时总觉得脖子紧。',
      'The glasses cord knotted round a collar button. Explains why searching for my glasses tightened my neck.',
    ],
    [
      '逗号太多的句子像一排小椅子，坐下就不想走，我得把其中几把先搬开。',
      'A sentence full of commas is a row of chairs: sit and never leave. I have to move a few away.',
    ],
    [
      '还书箱的感谢纸没写书名，我全算上了，再夹进盒盖里，让来还书的人也看见。',
      'No book named on the thank-you in the returns box. Credited them all, then put the note where returners can see it.',
    ],
  ],
  priya: [
    [
      '林遥，电脑也有候诊队伍吗？我这边一台打印机就能排得很长。',
      'Yao, do computers have waiting lists? One printer can make quite a queue here.',
    ],
    [
      '你写程序要记那么多符号，我光找键盘上的破折号就得停一下。',
      'All those symbols in your code. I have to pause to find a dash on the keyboard.',
    ],
    [
      '林遥，工作电话的声音要是太熟，可以换个水壶的声音听听。',
      'When work calls start sounding too familiar, Yao, try listening to a kettle instead.',
    ],
    [
      '嘉宁，给孩子装的包是不是比大人的还重？我只带钥匙也常找。',
      'Ka Ning, is the child’s bag heavier than yours? I lose things carrying only keys.',
    ],
    [
      '你家孩子能自己念名字了吧？慢慢念就行，我不会抢最后一音。',
      'Your child can say their own name? No rush. I won’t jump in on the last sound.',
    ],
    [
      '嘉宁，你们一家挑散步路线时，也会有一个人坚持先找洗手间吗？',
      'Ka Ning, does one of your family plan every walk around the toilets too?',
    ],
    [
      '索菲娅，你和杰米等水开也会忘拿什么吗？我会把杯子先放好，后来连杯子也找。',
      'Do you and Jamie forget things while the kettle boils, Sofia? I set my mug out, then search for it too.',
    ],
    [
      '你和杰米的日历太挤就用铅笔，擦掉不伤纸，我自己连买哪种茶也会改来改去。',
      'Pencil for the crowded shared diary. Easy on the paper; even my choice of tea keeps changing.',
    ],
    [
      '索菲娅，家里的故事慢慢讲，地名我跟着念两遍，你也能听听我念得像不像。',
      'Take your time with stories of home, Sofia. I’ll repeat place names twice and you can judge the sound.',
    ],
    [
      '菜地蓝丝带真好看，别别在容易洗的外套上，我替纸花吃过亏。',
      'Lovely show ribbon. Don’t pin it to a washable coat; I’ve lost paper flowers that way.',
    ],
    [
      '续签忙完了？这次空出的脑子先留给闲话，我带了不少。',
      'Renewal sorted? Leave some of that freed-up headspace for gossip. I have plenty.',
    ],
    [
      '你钓的狗鱼有那么长？我伸手比了比，差点碰倒自己的杯子。',
      'Was your pike that long? I tried measuring with my hands and nearly hit my cup.',
    ],
    [
      '约锅炉维修总让我想起漏问的那句话，我现在先写好问题，纸还得放在手边。',
      'Boiler arrangements remind me of forgotten questions. I write them first now, keeping the paper close.',
    ],
    [
      '戴夫认不出我电话里的声音，我站他面前试过，他还看了眼我手里有没有电话。',
      'Dave couldn’t recognise my phone voice. Tried it in front of him; he checked whether I held a phone.',
    ],
    [
      '海伦说书可以续，我差点问下一位何时来，她把还书日期指给我，又忍着没笑。',
      'Helen offered a book renewal. Nearly asked when the next person was due; she pointed to the date and held back a laugh.',
    ],
    [
      '加雷思穿便服我得看鞋才认得，他还低头检查，怕是鞋底又带进了别人的泥。',
      'Gareth in ordinary clothes needed his shoes for identification. He checked them, worried he’d brought in mud.',
    ],
    [
      '漏墨笔终于装进小袋了，多谢你那回帮忙，我的袖口可没全救回。',
      'The leaky pen has a pouch now. Thanks for that day; not all my cuff was saved.',
    ],
    [
      '那次拼图的云我能认出来了，倒着放也行，不再跟它生气。',
      'I recognise our jigsaw cloud now, upside down too. No more arguing with it.',
    ],
    [
      '针线盒多了颗不认识的扣子，我对过自己的衣服，没一件肯承认是它家的。',
      'An unfamiliar button in my sewing tin. Checked my clothes; none claims it belongs.',
    ],
    [
      '胶带找不到开口，我摸到纸筒里面才明白已经用空，手上却先沾了一圈灰。',
      'Couldn’t find the tape’s start. Felt inside the empty roll to work it out and acquired a ring of dust first.',
    ],
    [
      '旅行带回的石头摆上书架，书没多，架子沉了，我还得给每块留个不滚的位置。',
      'Travel stones on the bookshelf. No extra books, more weight, and a stable place needed for every stone.',
    ],
    [
      '失物招领的笔被领走了，我另找一支系上绳子，绳头却忘了系在什么地方。',
      'The lost-property pen was claimed. Tied string to another and forgot to attach the other end to anything.',
    ],
    [
      '大提手杯子拿得稳，喝水时却挡着眼镜，我换另一边握，又差点碰到鼻尖。',
      'The big-handled mug is secure but catches my glasses. Held the other way, it nearly meets my nose.',
    ],
    [
      '杂志还没拆封，封面陪我走了好多路，透明包装磨花了，倒像给它戴了眼镜。',
      'The wrapped magazine’s cover has travelled with me. Scratched wrapping looks like glasses for its face.',
    ],
    [
      '备用袋藏在袋里，拿出来又得找装它的袋子，我决定先把两只都摊在椅子上。',
      'A spare bag inside my bag. Once out, I had to find its bag. Decided to spread both on a chair.',
    ],
  ],
  dave: [
    [
      '林遥，软件报错要是出成问答题，是不是谁都不想抢答？',
      'Yao, if error messages were quiz questions, would anyone want the buzzer?',
    ],
    [
      '你工作的键盘怕不怕饮料？我把吧台擦了，电脑得自己带护身符。',
      'Does your keyboard fear drinks? I wiped the bar; computers must bring their own luck.',
    ],
    [
      '林遥，你说的程序我未必懂，卡住以后想出去走走倒听得明白。',
      'I may not follow your code, Yao. Wanting a walk when it jams makes perfect sense.',
    ],
    [
      '嘉宁，你孩子能不能给我出道题？太长的话我先申请喝口水。',
      'Ka Ning, can your child set me a question? If it’s long, I’ll request a sip first.',
    ],
    [
      '你们一家想不同队名没关系，我那块黑板擦得掉，别刻上去就行。',
      'Different team names in the family? The blackboard rubs clean. Just don’t carve them.',
    ],
    [
      '嘉宁，孩子的谜语是不是最难猜？猜中了还可能被临时换个答案。',
      'A child’s riddles are hardest, Ka Ning. Get one right and the answer might change.',
    ],
    [
      '索菲娅，你和杰米谁记歌名？我唱得出调子，写到纸上才发现又把歌词当名字。',
      'Which of you remembers titles, Sofia? I sing the tune, then discover I’ve written down a lyric instead.',
    ],
    [
      '你和杰米各选一首吧，我先试试唱机转不转，别挑到最后只听见我在擦唱片。',
      'A record each for you and Jamie. I’ll test the player first, or you’ll only hear me polishing records.',
    ],
    [
      '索菲娅，班表挤就别替我数椅子了，我挪开门后那个桶，又能找到多藏的一把。',
      'Busy rota, Sofia? Leave counting chairs to me. Move the bucket behind the door and another one appears.',
    ],
    [
      '蓝丝带拿到了？我只能给你一个杯垫，冠军也得防杯子留圈。',
      'A blue ribbon? I can offer a coaster. Champions still leave cup rings.',
    ],
    [
      '续签手续办妥就别继续给文件占座了，给自己挑个舒服的位置。',
      'Renewal sorted? Stop saving a seat for the folder and choose one for yourself.',
    ],
    [
      '你钓到狗鱼了，鱼有多长先别告诉我，我想留一道估算题。',
      'Don’t tell me your pike’s length yet. There’s an estimation question in that.',
    ],
    [
      '你约过锅炉维修吧？我那次看冰柜前先清出插头，才发现后面还躲着个杯垫。',
      'You arranged a boiler visit? Before my freezer visit I cleared the plug and found a hidden coaster.',
    ],
    [
      '玛格丽特来看我先看香草，我把花盆转了半圈，免得她总盯着那片长黄的叶子。',
      'Margaret checks my herbs before me. I turned the pot halfway so she needn’t stare at the yellow leaf.',
    ],
    [
      '阿德想给题册编索引，我怕客人翻到拿手的题，倒先请他帮忙找散掉的书页。',
      'Ade offered an index. Guests would find their best questions first; asked him to find the loose pages instead.',
    ],
    [
      '拉赫曼隔柜台就认出我少算的硬币，我换纸记数，他还递来一支有笔帽的笔。',
      'Rahman spots a miscounted coin across the counter. I switched to paper; he supplied a pen with its cap.',
    ],
    [
      '你帮我挡过的那页答案换了夹子，纸面这次真朝里了。',
      'A new clip for the answers you hid. The page really faces inward now.',
    ],
    [
      '那张旧唱片我没换，忘词那段就留着听乐器，倒也不着急。',
      'Kept that old record. Where I forget the words, I listen to the instruments.',
    ],
    [
      '粉笔总断，短题倒写得顺，我把小段攒进小盒，长题只好分两口气来问。',
      'Chalk breaks, so short questions go well. Little pieces in a tin; long questions need two breaths.',
    ],
    [
      '杯垫叠得比杯子高，我先拆小塔再擦桌，拆到底才看见客人落下的硬币。',
      'Coasters above the cup. Dismantled the tower before wiping and found a customer’s coin at the bottom.',
    ],
    [
      '唱片按字母排好，想听的却在最下面，我找完一轮，还是放回原来的乱序。',
      'Records alphabetised, favourite at the bottom. After searching them all, I restored the original muddle.',
    ],
    [
      '擦布的卷角总留一条干的，我翻面擦第二遍，那条线倒像故意画在桌上的。',
      'The cloth’s curled corner leaves a dry line. Flipped it for another wipe; the line looked almost deliberate.',
    ],
    [
      '菜单字小，客人把两道菜念成一道，我用手指分开，结果手指又挡住价钱。',
      'Tiny menu print merged two dishes for a customer. I separated them with a finger and hid the prices instead.',
    ],
    [
      '备用灯泡放对盒子，找起来反而不习惯，我还去旧地方摸了两回才想起来。',
      'Spare bulbs in the right box. So unfamiliar I checked their old hiding place twice before remembering.',
    ],
    [
      '桌边的刻痕有客人靠摸就认座，擦桌时我先绕过去，省得把里面的字擦没了。',
      'A customer identifies their seat by that table notch. I wipe round it to preserve the tiny letters.',
    ],
  ],
  rahman: [
    [
      '林遥，你写的软件要是能找东西，先帮我找找总躲起来的价签笔。',
      'Yao, if your software can find things, start with my elusive price pen.',
    ],
    [
      '程序出错能重新来吧？我贴歪的价签揭一次，纸就少一层。',
      'Programs can start again, can’t they? My crooked labels lose paper each time.',
    ],
    [
      '林遥，盯屏幕累了看看货架，罐头至少不会突然跳出新窗口。',
      'Eyes tired of screens, Yao? The tins won’t suddenly open a new window.',
    ],
    [
      '嘉宁，孩子想帮着拿东西就挑轻的，我也不靠一次搬完显本事。',
      'Ka Ning, light things for your helper. I’m not proving anything by carrying it all at once.',
    ],
    [
      '你们一家来买菜，可以各拿一个袋子，最后到门口再看看谁装得满。',
      'A bag each for your family shop. Compare them at the doorway.',
    ],
    [
      '嘉宁，小孩会认包装的图案，大人却总先转过去看价钱。',
      'Children know the packet pictures, Ka Ning. Adults turn them round for the price.',
    ],
    [
      '索菲娅，杰米的炖菜最爱放什么？我想放低一层，拿东西不用你俩轮流踮脚。',
      'What does Jamie most like in stew, Sofia? I could lower that shelf so neither of you needs to stretch.',
    ],
    [
      '你和杰米口味不同也能煮一锅，先盛再添料，我自己的那碗总得另外留点辣的。',
      'One pan despite different tastes for you and Jamie. Season the bowls separately; I save extra heat for mine.',
    ],
    [
      '索菲娅，你讲家乡吃的，我常先记香味才记名字，下回拿纸画个样子也能认。',
      'The smell of your food stories comes before the names, Sofia. Sketch it on paper next time; I’ll recognise it.',
    ],
    [
      '菜地的蓝丝带先收好，你带来的菜可别挤在袋底碰坏了。',
      'Keep the show ribbon safe. Don’t bruise your vegetables at the bottom of the bag.',
    ],
    [
      '续签忙完了，购物单终于不用和文件放一层了吧？我替面包高兴。',
      'Renewal done? The shopping list can leave the document pocket. Good news for bread.',
    ],
    [
      '那条狗鱼是你钓的？我先把量货架的尺收起来，别又拿它比。',
      'Your pike? I’d better put my shelf ruler away before trying to measure it.',
    ],
    [
      '你约锅炉维修那会儿，我也在收零件小罐，罐子洗干净以后，盖子却配不上了。',
      'When you arranged the boiler visit, I sorted my parts jars. Cleaned one and found its lid no longer fitted.',
    ],
    [
      '普里娅挑不滚的梨，我留能立的纸袋，她把袋底折平，又替后面的客人拿了一只。',
      'Priya chooses stable pears. I save a standing bag; she flattens its bottom and takes another for the next customer.',
    ],
    [
      '加雷思寄自己的卡比送信慢，信封摸平好多遍，走到邮筒边又停下来看看邮票。',
      'Gareth smooths his own card envelope over and over, then checks the stamp again beside the postbox.',
    ],
    [
      '戴夫试粉笔会往纸箱写题，我把写过那面朝外，搬箱子的人也能顺手猜一次。',
      'Dave tests chalk with questions on boxes. I face that side out so anyone moving them can have a guess.',
    ],
    [
      '那回你替我按纸箱，剪刀就在我围裙里，这事到现在还逗人笑。',
      'You holding the box, scissors in my apron all along. Still makes me laugh.',
    ],
    [
      '入籍照片的领带我不再去扶正了，照片外那锅忘下的米才记得牢。',
      'I leave the citizenship-photo tie crooked now. Remember the pot with no rice better.',
    ],
    [
      '零钱碟换大了，硬币不再挤着裂缝，我还把旧碟留下，专门给价签笔躺着。',
      'Bigger change dish, no queue by the crack. Kept the old one as a bed for price pens.',
    ],
    [
      '货架罐子转过来，才知道一直擦的是背面，正面的图案倒干净得不需要我。',
      'Turned the tins to find I’d been polishing their backs. The pictures were clean without my help.',
    ],
    [
      '门铃没响我先看客人，再看门铃，最后发现门压根没关严，铃还没来得及动。',
      'Bell silent: checked customer, then bell. The door hadn’t shut properly; the bell hadn’t had a chance.',
    ],
    [
      '纸箱按大小套好，最大那只没地方塞，我把它横放，刚好挡住最想拿的货。',
      'Boxes nested by size, nowhere for the biggest. Laid it sideways, right in front of the stock I needed.',
    ],
    [
      '算盘那颗珠子被我推得亮，想事时手总去找，没了算盘反倒不知手该放哪。',
      'One abacus bead shines from my thinking. Without the abacus, my hand doesn’t know where to go.',
    ],
    [
      '饼干铁盒空了，放回形针太委屈，我拿来装自己的零钱，和收银机分开放。',
      'Paper clips feel too humble for the empty biscuit tin. My own change goes there, apart from the till.',
    ],
    [
      '一根葱装进大纸袋，走路时总往一边倒，我折了袋底，给它换了个小房间。',
      'One onion kept toppling in a big bag. Folded the bottom up and gave it a smaller room.',
    ],
  ],
  lina: [
    [
      '林遥，软件里能撤回一步就好，画画也是，别急着换整张纸。',
      'Yao, one step back in software can help. Drawing too; no need for a new sheet yet.',
    ],
    [
      '你写代码的括号要成双吧？我织的围巾两头可没这么守规矩。',
      'Your code brackets come in pairs? My scarf ends aren’t so disciplined.',
    ],
    [
      '林遥，工作忙起来还记得喝水吗？我画东西也会忘了杯子在手边。',
      'Remember water when work gets busy, Yao? I draw and forget the cup beside me too.',
    ],
    [
      '嘉宁，你孩子画的人是不是比房子还大？画里住得下就行。',
      'Ka Ning, does your child draw people bigger than houses? Fine if they fit the picture.',
    ],
    [
      '你们一家要是画地图，得给每个人留条自己认得的路。',
      'A family map needs a route each person recognises.',
    ],
    [
      '嘉宁，孩子挑的颜色你留着吧，有时候长大以后反而不敢这样用。',
      'Keep the colours your child chooses, Ka Ning. Adults sometimes lose that nerve.',
    ],
    [
      '索菲娅，你和杰米拍照都看镜头吗？我总分神看旁边，洗出来才知道自己转了头。',
      'Do you and Jamie face the camera, Sofia? I look aside and only notice my turned head in the print.',
    ],
    [
      '你给杰米讲家乡哪段最想画下来？从一扇门开始，门外的路可以留着慢慢添。',
      'Which story of home you tell Jamie would you draw? Start with a door; the road outside can wait.',
    ],
    [
      '索菲娅，两个人一起做事也得留空位，我画画总得挪开纸，才想起旁边还坐着人。',
      'Making things together needs space, Sofia. I move my paper before remembering someone’s sitting beside me.',
    ],
    [
      '蓝丝带拿到了？我想画它折起来的样子，比摊平的有意思。',
      'A blue ribbon? I’d draw it folded. More interesting than laid flat.',
    ],
    [
      '续签办妥了，今天能不能讲件跟文件没有关系的小事？我想听。',
      'Renewal done. Could we hear a little story without any paperwork? I’d like that.',
    ],
    [
      '你钓的狗鱼真有牙，我看图才知道，以前画的太客气了。',
      'Your pike has teeth. The pictures showed me; mine were far too polite.',
    ],
    [
      '听你讲约锅炉维修，我想起自己等人时画过门把手，画完才发现纸又拿反了。',
      'Your boiler arrangements remind me of sketching a door handle while waiting, on paper the wrong way up.',
    ],
    [
      '海伦问速写本的歪线从哪边读，我把本子转过来，她说这回看着终于像条路。',
      'Helen asked where to start reading a sketchbook’s crooked line. Turned it round; now she could see a road.',
    ],
    [
      '玛格丽特认出画里的小屋，门画反也认得，她指着屋后说，那边其实藏着水壶。',
      'Margaret knew the shed despite its reversed door. Pointed out where the watering can hides behind it.',
    ],
    [
      '拉赫曼把包装纸铺平给我，背面图案更好看，我画完还得给画找个朝上的方向。',
      'Rahman flattens spare wrapping for me. I prefer the reverse pattern; after drawing I still have to choose which way is up.',
    ],
    [
      '那根滚到桌脚后的针找回来了，我给针盒加了条合得紧的带子。',
      'Found that needle behind the table leg. The needle case has a tighter strap now.',
    ],
    [
      '车站地图还顺着老折痕合拢，我记得你那次没有催我选下一站。',
      'The station map still folds along the old creases. You didn’t rush me to choose a next stop.',
    ],
    [
      '削笔木屑像小花，我挑了几片压进纸里，压平了又不像，还是让它卷着好。',
      'Shavings like flowers. Pressed a few into paper and lost the resemblance. Better curled after all.',
    ],
    [
      '新橡皮太干净，我留了一小块没擦的线，让自己知道这条路原来画到哪边。',
      'The new eraser is too clean. Kept a little old line to remember where the road first went.',
    ],
    [
      '帆布包缝了两层底，东西没轻，提手却更牢了，我终于敢放一本重些的书。',
      'Two layers in the bag’s bottom: no lighter, stronger handle. Finally brave enough for a heavier book.',
    ],
    [
      '小册子只有空白页，我翻完还夹了书签，怕忘了刚才打算从哪一页开始画。',
      'All blank pages in the booklet. Still added a bookmark to remember where I meant to start drawing.',
    ],
    [
      '咖啡渍像岛，添船画成土豆，我干脆给岛画了叉子，这张就当菜单草稿吧。',
      'Coffee-stain island, boat turned potato. Added a fork; this drawing can be a draft menu.',
    ],
    [
      '画总压在本子里快成书签了，我挑出一张摆书架上，结果先把书名挡住了。',
      'Drawings becoming bookmarks. Stood one on the shelf and promptly covered a book title.',
    ],
    [
      '短铅笔夹进纸卷不易丢，我给纸卷系条绳子，打开时倒像认真拆一件礼物。',
      'A short pencil stays safe in a paper roll. Tied it up; opening it feels like unwrapping a proper present.',
    ],
  ],
  gareth: [
    [
      '林遥，你工作的电脑认路比我快吧？不过它知道哪家门环夹手吗？',
      'Yao, your work computer finds routes faster. Does it know which knockers pinch?',
    ],
    [
      '你写程序也得一行行核对，我看地址也是，急着看就容易串门。',
      'You check code line by line. Addresses too; hurry and I visit the wrong door.',
    ],
    [
      '林遥，下班想不动了就走熟路，我熟得连哪块砖松都能记住。',
      'Too tired to think after work, Yao? Take a familiar path. I know every loose brick.',
    ],
    [
      '嘉宁，孩子的脚步比大人的零碎，我听见也不会催着开门。',
      'Ka Ning, children take more little steps. I won’t hurry anyone to the door.',
    ],
    [
      '你们一家名字写在信箱里就好，我念不准时宁可多问一遍。',
      'Your family names on the letterbox will do. If unsure, I’d rather ask twice.',
    ],
    [
      '嘉宁，给孩子的信我会单独递，不把小信封塞在一叠传单里。',
      'I hand over children’s letters separately, Ka Ning, away from the leaflets.',
    ],
    [
      '索菲娅，杰米认得我的路线，有回我走慢了，他先开着门，又回去给水壶添水。',
      'Jamie knows my round, Sofia. Once I ran late, he left the door open and went back to refill the kettle.',
    ],
    [
      '你和杰米寄合照别把信封塞太紧，照片角得能伸开，我手里这只还留着折痕。',
      'Leave your shared photo some space in its envelope. This envelope in my hand still bears a crease.',
    ],
    [
      '索菲娅，家乡地址慢慢写，我还常写旧门牌，得停一下，看清纸上到底是哪条街。',
      'Take time with your address back home, Sofia. I still start my old number and have to check which street I’m writing.',
    ],
    [
      '你拿了蓝丝带，我这儿只有橡皮筋，可不能拿它来替你绑奖品。',
      'You have a blue ribbon; I’ve only rubber bands. Can’t tie your prize with those.',
    ],
    [
      '续签办妥了，那叠纸先放稳吧，我的车篮可以帮你托住袋底。',
      'Renewal done. Set the papers safely; my basket can support the bottom of the bag.',
    ],
    [
      '听说你钓到了狗鱼，我经过池塘时又多看了一眼水面。',
      'Heard about your pike. Took another look at the pond on my way past.',
    ],
    [
      '你约过人看锅炉吧？我也贴过留门纸条，贴太高了，来的人先看见了胶带背面。',
      'You arranged a boiler visit? I once put a door note too high; the visitor saw the back of the tape first.',
    ],
    [
      '海伦给书包加反光条，避开书名还量了好久，我扶着包，书倒先从另一边滑出。',
      'Helen measured a reflective strip clear of the book titles. I held the bag; a book slid out the other side.',
    ],
    [
      '戴夫写队名落笔重，我挑厚便签给他，拿回来一看，下面的垫纸也留着名字。',
      'Thick note paper for Dave’s heavy team-name writing. When returned, the backing sheet carried the name too.',
    ],
    [
      '阿德寄卡把地址印得齐，邮票却歪，我问是不是故意留一个能认出是他的地方。',
      'Ade prints neat addresses but crooked stamps. Asked if that was his way of leaving a recognisable mark.',
    ],
    [
      '车篮那枚小扣还牢着，你扶过以后，我过砖缝也少提一口气。',
      'The basket catch you helped with is holding. Less breath-holding over the paving now.',
    ],
    [
      '那张感谢卡的边抚平了，车轮倒还是歪的，看着像马上又要转起来。',
      'The thank-you card’s edges are smooth now. Its crooked wheels look ready to turn again.',
    ],
    [
      '亮钥匙换了只环，摸口袋就认得，旧环舍不得扔，我又串上一把不常用的。',
      'Polished keys on another ring, easy to find by touch. Kept the old ring and added a seldom-used key.',
    ],
    [
      '车铃先响别的零件，我拆开拧紧，螺丝放帽子里，戴之前差点全忘了倒出。',
      'Other parts rang before the bell. Tightened it, screws in my cap; almost forgot them before putting it on.',
    ],
    [
      '投给我家的窗帘广告看了半天，我窗户小，纸上画的花纹倒比窗台还宽。',
      'Studied a curtain advert delivered to my house. Tiny windows; the printed pattern was wider than my sill.',
    ],
    [
      '近路的新小门我记清开向，邮包不再撞上，帽檐却得稍微低一点才能过去。',
      'Remembered which way the shortcut gate opens. Bag stays clear; my cap still needs ducking.',
    ],
    [
      '手帕快透明了，叠起来擦眼镜，展开能看天空，收好时还得先找清楚四个角。',
      'Handkerchief almost transparent. Folded for glasses, open to see the sky; finding its corners takes care.',
    ],
    [
      '车篮铺旧布后，明信片角不钻缝了，那块布滑下来时，我反倒先替它压平。',
      'Old cloth keeps postcard corners out of the basket gaps. When it slips, it’s the cloth I smooth first.',
    ],
    [
      '空邮包摘下才想起挺直背，我把背带调松一格，走起来才发现外套也跟着松。',
      'Taking off the empty bag reminded me to straighten. Loosened its strap and even my coat felt easier.',
    ],
  ],
};

const routes = [
  'SKILLED_WORKER',
  'HONG_KONG_BNO',
  'FAMILY_PARTNER_OR_PARENT',
] as const;
const recent = [
  'show-result-ribbon',
  'visa-renewed',
  'caught-pike',
  'boiler-planned',
];
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
      ...(i < 9 && { when: [{ route: routes[Math.floor(i / 3)] }] }),
      ...(i >= 9 && i < 13 && { requires: [recent[i - 9]] }),
      ...(i >= 16 &&
        i < 18 && {
          requires: [`heart-${npc}-${callbacks[npc][i - 16]}-shared`],
        }),
    })),
  ]),
);
