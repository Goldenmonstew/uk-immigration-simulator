# Phase 9 规划（2026-11-06）：一天一天地过——小镇的生活层

## 背景

Phase 8 把游戏做成了可走动的像素小镇。Fable 用 20 个随机种子实测一局 10 年的体量：约 85 次选择、75 张事件卡，正文合计约 1,800 字；地图上能互动的只有 8 扇门，画面上会动的只有玩家；图块是忍者村风格。用户玩过后说"总感觉很空洞，没有星露谷物语那种灵动的感觉，内容也很少"。Fable 的判断：问题在结构——一步一季、每季两件事加弹窗——不在卡片条数。用户选择"按建议规划"：**季度当章节，天当玩法**。

本阶段不动：移民时间线与引擎、两栏评估、签证中心与费用、结局与成就框架、五条属性、季末结算。改的是每一季怎么过。

原则不变：一个 package 一个 writer（`packages/game` 仅 sol，`apps/web` 仅 astra，引擎不改）；政策后果只由引擎算；人物虚构；真实费用读有来源的参数；游戏数值集中写并注明"游戏设定"；不过度工程化。

## 1. 玩法设计

### 1.1 一季三天

- 每季有三个可玩的日子：工作日、周末、特别的一天（这一季的节日）。三天过完照旧季末结算：工资、开销、属性衰减、签证检查、引擎重算两栏、抽下一季的事件。
- 每天 07:00 在家里醒来，有时钟。户外走路按真实时间走表（每 2 秒 10 游戏分钟；菜单、对话、事件卡打开时暂停），做事按固定分钟数跳表。在家上床结束这一天；24:00 还在外面就自动回家，心情小降。
- 每天开始有一张早晨卡：日期星期、天气、信箱里有几封信、今天是不是节日。
- 快进："快进这一季"按默认作息（工作日上班、晚上上课或放松、周末休息、节日去逛）走完剩下的日子，遇到事件先停下；"今天到此为止"直接回家睡觉。只想看移民主线的玩家每季一键快进，一局仍在半小时上下。
- 体量目标：每天都玩的话，一局能看到 ≥ 300 句镇民台词、≥ 20 段好感剧情、约 75 张事件卡，合计 ≥ 15,000 字（9.5 用种子统计复核）。

### 1.2 地点与可做的事

营业时间与数值是游戏设定，由 sol 定；签证中心与市政厅每天 08:00–20:00 开放，GP 周末关门，公司只在工作日上班。

| 地点 | PlaceId | 可做的事 |
|---|---|---|
| 家（室内） | `home` | 床：睡觉、午睡；厨房：吃东西、做饭；书桌：自学英语；门口信箱：读信 |
| 公司 | `work` | 工作日上一整个班；下班后加班 |
| 语言学校 | `college` | 晚课 / 周末课；英语考试 |
| 图书馆 | `library` | 安静自学；借本书换心情 |
| GP 诊所 | `gp` | 看病 |
| 酒吧 | `pub` | 放松；pub quiz（公告栏提前贴出） |
| 咖啡馆 | `cafe` | 喝咖啡，碰见镇民 |
| 街角小店 | `shop` | 买种子、茶、饼干、花、蛋糕 |
| 市政厅 | `council` | 两栏定居评估（不花时间） |
| 签证中心 | `visa` | 续签、申请定居 |
| 火车站 | `station` | 出国旅行；离开英国 |
| 社区菜地 | `allotment` | 租一块地；种、浇水、收 |
| 公园池塘 | `pond` | 钓鱼 |
| 公告栏 | `board` | 本季的活动、失物招领、志愿者 |
| 村绿地 | `green` | 节日场地 |
| 长椅 | `bench` | 坐一会儿 |

小镇里不设出售与打零工：收成和钓到的鱼只用来吃、做饭、送礼和夏日集市评比，避免与签证的工作条件冲突；钱仍来自工作与原有系统。

### 1.3 镇民

- 八位常驻镇民，加上每个角色自己的家人：索菲娅的杰米；陈嘉宁的伴侣与孩子；林遥按现有卡片的设定，有就加。人物全部虚构。
- 每人有作息（按日子类型、天气、节日、钟点，在建筑里或街上的固定点之间走）、≥ 40 句日常台词、礼物喜好、4 段好感剧情（2、4、6、8 心）。台词随好感、季节、天气、节日和玩家的处境变化；不说教，不讲规则数字，不预测获批。
- 好感 0–10 心：每天第一次聊天加一点，送礼按喜好加减（每人每天一次），一季没见面略降。好感带来小帮助，例如老师多给一点英语、邻居在你出国时帮你浇菜、同事替你说话让事业涨一点；这些只改属性与叙事，不改时间线。
- 八位的 id 固定，名字与性格由 sol 写：
  1. `margaret`：退休邻居，菜地老手。
  2. `priya`：GP 诊所前台。
  3. `ade`：同事，也拿着工作签证，和你差不多时候续签。
  4. `helen`：语言学校的 ESOL 老师。
  5. `dave`：酒吧老板，主持 pub quiz。
  6. `rahman`：街角小店老板，几十年前来英国，早已入籍。
  7. `lina`：朋友，签证被拒后在想办法；这条线由选择与随机决定以离开或留下收尾。
  8. `gareth`：邮差，送信时会对棕色信封发表看法。
- 和移民有关的线写在人身上：一起等续签、考前辅导、拒签后的告别。政策后果仍由引擎显示。

### 1.4 菜地、钓鱼、做饭、小店

- 菜地：在菜地小屋租一块地（年费，游戏设定），共 6 格。种子按季节卖：土豆、草莓、番茄、黄瓜、芜菁、甜玉米、向日葵、郁金香（素材包里每种有 5 个生长阶段）。每过一天（含快进的日子）长一格，当天浇水或下雨再长一格；过季没收会枯；每格收 1–3 个。
- 钓鱼：在池塘边抛竿，浮标下沉时在时限内按键。核心按季节、天气、钟点决定钓到什么，偶尔是旧靴子或购物车。
- 做饭：厨房按食谱把收成和鱼做成菜，如烤土豆、沙拉、炸鱼薯条、草莓酱；吃了加心情或健康，也能送人。
- 小店：按季节卖种子和小礼物，价格是游戏设定。

### 1.5 节日

每季一个，按 `state.quarter` 的季节选；显示日期取该节日落在本季窗口里的那天，不在窗口里时取窗口内最后一个周六：

| 季节 | 节日 | FestivalId |
|---|---|---|
| 冬 | 春节聚会（社区里的百家宴） | `lunar-new-year` |
| 春 | 五月节集市（May Day） | `may-day` |
| 夏 | 夏日集市与菜地评比 | `summer-fair` |
| 秋 | 奇数年 Bonfire Night，偶数年圣诞集市 | `bonfire-night` / `christmas-market` |

节日那天绿地摆摊挂灯，镇民都在。有一个小活动（评比、看烟花、抽奖、包饺子），好感与心情有加成。

### 1.6 事件卡改为在日子里送达

- 现有约 320 张事件卡全部保留，仍按 v2 的规则每季抽 1–2 张，但分配到这一季的某一天，按 `channel` 出现：
  - 信：早上进信箱，读了才弹出。
  - 电话：当天某个钟点响。
  - 某位镇民：和这位镇民聊天时。
  - 某个地点：走进去时。
  - 早上：醒来时，等同 v2。
- 当天没送达的在睡前弹出，一季结束前必须全部处理完。
- 好感剧情也是事件卡（带 `heart`），和该镇民聊天时触发，客户端用对话框样式显示。

### 1.7 手感

- 天气有晴、多云、雨、雪，英国多雨。下雨时画面压暗、有雨滴，部分镇民改去室内。昼夜光照：18:00 起变暖，21:00 后变蓝，路灯亮起。
- 声音：脚步、说话的"哔哔"声（每人一种音高）、菜单、金币、成就；每季一首曲子，节日一首；有静音键，记住选择。
- 飘字（如"+2 英语"）、表情气泡（聊天时的心、雨天的汗滴）；有 CC0 素材就加鸭子、猫、鸽子。

### 1.8 不变与不做

- `state.date` 仍是这一季的锚定日期，所有时间线效果以它为"今天"；日子的日期只用于显示与节日。
- 续签、申请定居、离开英国的规则与费用不变。
- 出国改为当天出发，跳过本季余下的日子；归来后按实际日期写入离境，任何时刻时间线里都没有晚于 `state.date` 结束的离境；行程结束日晚于当前签证到期日时不可选。
- 不做：体力值（时钟已经限制一天能做的事）、买卖与打零工、恋爱结婚、制作系统、战斗、家以外的室内地图（其他建筑用菜单）、定制美术（可以对 CC0 素材调色、拼接）。

## 2. 技术决定（Fable）

- 画风换成现代英国小镇，素材全部 CC0。下面的链接 Fable 已于 2026-11-06 用脚本核实（HTTP 200，zip）：
  - 外景：Kenney "Roguelike Modern City"，`https://opengameart.org/sites/default/files/Roguelike%20Modern%20City%20pack.zip`（521 KB）。有红砖排屋、带遮阳棚的店面、路灯、公园。
  - 室内：Kenney "Roguelike Indoor"，`https://opengameart.org/sites/default/files/Roguelike%20Indoor%20pack.zip`（210 KB），与外景同一系列。
  - 人物：Kenney "RPG Urban Pack"，`https://opengameart.org/sites/default/files/kenney_RPGurbanPack.zip`（307 KB），6 个现代装束、四向行走的角色，调色派生出足够的镇民。和外景放在一起不搭时退回 ninja-adventure 的平民角色，并在报告里说明。
  - 作物：josehzz "Farming crops 16x16"，`https://opengameart.org/sites/default/files/FarmingCrops16x16.zip`（25 KB），20 种作物各 5 个生长阶段。
  - 声音、音乐、特效、表情：沿用 `sparklinlabs/superpowers-asset-packs` 的 ninja-adventure（GitHub raw）。
  - `ATTRIBUTION.md` 列出来源、作者、许可与文件；不再用的旧图块删掉。
- 地图：`apps/web/public/game/town.json` 约 56×40 格（16×16）。对象层 `places`（16 个 PlaceId 的触发区）、`anchors`（§3 的 16 个 AnchorId 点）、`plots`（6 格菜地）、`spawn`、`lamps`。`apps/web/public/game/home.json` 是家里。镜头跟随。
- 时钟在客户端按真实时间调用 `tick`；其他逻辑一律在核心。
- 存档改为 `uk-immigration-life-v3:<characterId>`；v2 存档不再读取。
- 集成分支：Phase 9 的任务都合并到本地分支 `phase-9`，main 保持现在可玩的 v2；Wave 2 验收后一次合并进 main、推送、部署，避免把 mock 版发布到线上。`phase-9` 不推送。

## 3. 契约：`packages/game` v3

sol 实现，astra 先按此写 mock；9.1 合并后以 `packages/game/src/types.ts` 为准。名字与形状不要改，确需改动写进报告的"契约偏离"。

```ts
// v2 types stay unless noted; V2Condition / V2Effect are the v2 unions.
type DayKind = 'workday' | 'weekend' | 'special';
type Weather = 'sunny' | 'cloudy' | 'rain' | 'snow';
type PlaceId =
  | LocationId // home, work, college, gp, pub, council, visa, station
  | 'shop' | 'cafe' | 'library' | 'allotment' | 'pond' | 'board' | 'green' | 'bench';
type AnchorId =
  | 'home-street' | 'high-street-west' | 'high-street-east' | 'bus-stop'
  | 'postbox' | 'park-bench' | 'park-pond' | 'park-path'
  | 'allotment-gate' | 'allotment-plots' | 'green-centre' | 'green-stall'
  | 'station-front' | 'college-steps' | 'pub-garden' | 'library-steps';
/** 'margaret' | 'priya' | 'ade' | 'helen' | 'dave' | 'rahman' | 'lina' | 'gareth' plus household ids. */
type NpcId = string;
/** Seeds are `seed-<crop>`; the client maps unknown ids to a fallback icon. */
type ItemId = string;
type FestivalId =
  'lunar-new-year' | 'may-day' | 'summer-fair' | 'bonfire-night' | 'christmas-market';
type Channel = 'morning' | 'letter' | 'phone' | `npc:${NpcId}` | `place:${PlaceId}`;

interface Place {
  id: PlaceId;
  name: Text;
  kind: 'building' | 'outdoor';
  hours?: { opens: number; closes: number; dayKinds?: DayKind[] }; // minutes since midnight
}
/** Replaces LocationAction. v2 ids stay where the action survives:
 *  rest, work, overtime, class, exam, gp, relax, assessment, extend, settle,
 *  travel-1, travel-3, travel-6, leave. */
interface Activity {
  id: string;
  place: PlaceId;
  label: Text;
  minutes: number;
  effects: Effect[];
  when?: Condition[];
  oncePerDay?: boolean;
}
type Condition =
  | V2Condition
  | { dayKind: DayKind }
  | { weather: Weather }
  | { festival: FestivalId }
  | { npc: NpcId; heartsMin?: number; heartsMax?: number }
  | { item: ItemId; min?: number }
  | { minuteMin?: number; minuteMax?: number };
type Effect =
  | V2Effect
  | { type: 'item'; item: ItemId; delta: number }
  | { type: 'friendship'; npc: NpcId; delta: number };
interface GameEvent {
  /* v2 fields */
  channel?: Channel; // default 'morning'
  speaker?: NpcId; // shown as a dialogue
  heart?: { npc: NpcId; hearts: number }; // heart event, fired through talk()
}
interface Npc {
  id: NpcId;
  name: Text;
  role: Text;
  characters?: string[]; // household members appear only for these characters
  /** First matching rule wins; stops are sorted by minute. */
  schedule: {
    dayKinds?: DayKind[];
    weather?: Weather[];
    festival?: boolean;
    stops: { from: number; at: PlaceId | AnchorId }[];
  }[];
  gifts: { loved: ItemId[]; liked: ItemId[]; disliked: ItemId[] };
  reactions: Record<'loved' | 'liked' | 'neutral' | 'disliked', Text>;
  lines: {
    id: string;
    text: Text;
    heartsMin?: number;
    heartsMax?: number;
    season?: Quarter;
    weather?: Weather[];
    dayKinds?: DayKind[];
    festival?: FestivalId;
    when?: Condition[];
    requires?: string[];
    forbids?: string[];
    once?: boolean;
  }[];
}
interface Item {
  id: ItemId;
  name: Text;
  kind: 'seed' | 'crop' | 'fish' | 'food' | 'gift' | 'junk';
  price?: number; // shop price, game setting; nothing is sold back
  edible?: { mood?: number; health?: number };
  grows?: { crop: ItemId; days: number; seasons: Quarter[] };
}
interface Recipe { id: string; label: Text; needs: Record<ItemId, number>; makes: ItemId; minutes: number }
interface Festival { id: FestivalId; name: Text; season: Quarter; text: Text }
interface Plot { seed?: ItemId; growth: number; wateredOn?: number } // wateredOn is a dayNumber
interface DayState {
  index: 0 | 1 | 2;
  kind: DayKind;
  date: IsoDate; // display and festival only; timeline effects still use state.date
  minute: number; // minutes since midnight: 420 at wake-up, never above 1440
  weather: Weather;
  festival?: FestivalId;
  place?: PlaceId;
  done: string[];
  talked: NpcId[];
  gifted: NpcId[];
  deliveries: { eventId: string; channel: Channel; minute?: number }[]; // undelivered events of this day
}
type Outcome = {
  kind: 'activity' | 'talk' | 'gift' | 'catch' | 'harvest' | 'cook' | 'buy' | 'eat' | 'sleep' | 'travel';
  npc?: NpcId;
  text?: Text;
  items?: Record<ItemId, number>;
  statDeltas?: Partial<Record<StatKey, number>>;
};
interface GameState {
  /* v2 fields except actionsLeft */
  version: 3;
  dayNumber: number; // days lived, including fast-forwarded ones
  day: DayState;
  inventory: Record<ItemId, number>;
  friendship: Record<NpcId, number>; // 0–1000; hearts = floor(points / 100)
  plots: Plot[]; // empty until a plot is rented
  heard: string[]; // npc line ids already heard
  outcome?: Outcome; // feedback of the last call, for floating text and bubbles
}

// Data
places, npcs, items, recipes, festivals, characters, achievements
// Queries
townsfolk(state): Npc[]                    // npcs of this game; household filtered by character
npcAt(state, npc): PlaceId | AnchorId      // where the schedule puts them at day.minute
peopleAt(state, place): NpcId[]            // inside a building right now
hearts(state, npc): number
activities(state, place): Activity[]       // filtered by when, hours and oncePerDay; empty while an event is pending
shop(state, place): Item[]
mailbox(state): string[]                   // event ids of letters waiting
// Moves (pure; each returns a new state)
newGame(characterId, seed, locale)         // first day of the first quarter, 07:00, at home
doActivity(state, id)
enter(state, place)                        // sets day.place, delivers place:<id> events
tick(state, minutes)                       // walking time; delivers phone events; at 1440 sends the player home to bed
talk(state, npc)                           // outcome.text is the line; may make a heart event pending
gift(state, npc, item)
buy(state, item, qty)
plant(state, plot, seed); water(state, plot); harvest(state, plot)
fish(state, caught: boolean)               // the client's mini-game decides caught; the core picks the catch
cook(state, recipe); eat(state, item)
readMail(state)                            // the first letter becomes the pending event
sleep(state)                               // delivers leftovers first; then the next day, or quarter end and the next quarter's first day
fastForward(state)                         // default routine to the next quarter's first morning; returns early at any pending event
// Unchanged from v2
currentEvent, resolve, endQuarter, progress, isOver, narrative, visaMonthsLeft
```

- 随机仍用一条 mulberry32 流：天气、台词、钓鱼、事件分配都从它取，同种子同结果。
- 引擎只在时间线变化后与季末重算，同 v2。
- 平衡：只用 `fastForward` 玩完的整局，第 5 年存款中位数仍在 £18,000–40,000（现有断言）。

## 4. 任务总览

| # | 任务 | 负责 | 范围 | 依赖 | 波次 |
|---|---|---|---|---|---|
| 9.1 | 核心 v3：天、时钟、天气、地点与营业时间、活动表、出国新流程；事件送达（给现有事件标 `channel`）；镇民框架（作息、台词、好感、送礼、好感剧情）与三位完整镇民（margaret、ade、helen）；物品、小店、菜地、钓鱼、做饭；一个完整节日；快进与默认作息；平衡与测试 | sol | `packages/game` | 无 | 1 |
| 9.2 | 客户端 v3 骨架：新素材与署名、56×40 新小镇与家的室内、镇民按作息走动、聊天 / 送礼 / 信箱 / 小店 / 菜地 / 钓鱼 / 做饭界面、时钟与早晨卡、昼夜与天气、声音与静音、快进、存档 v3、手机点按；9.1 合并前用本地 mock 实现 §3 | astra | `apps/web` | 无（契约见 §3） | 1 |
| 9.3 | 内容：其余五位镇民与各角色家人、其余四个节日、物品与食谱补全、公告栏、和镇民相关的事件连锁、新成就、结局叙事里的朋友；Fable 对 9.1 的评审修改 | sol | `packages/game` | 9.1 合并后 | 2 |
| 9.4 | 客户端整合与打磨：接真实 v3、删 mock、节日布置与小活动、好感剧情的对话样式、飘字与表情、小动物、路灯与窗户、季末小结加"这一季的日子"、性能与 375px | astra | `apps/web` | 9.1、9.2 合并后 | 2 |
| 9.5 | QA：三角色各玩一局逐日、一局快进；体量统计；文案评审；`phase-9` 合并进 main 并部署 | Fable | — | 9.3、9.4 | 3 |

## 5. 任务卡

见 `docs/tasks/9.1-game-core-v3.md`、`docs/tasks/9.2-game-client-v3.md`；9.3、9.4 在 Wave 1 验收后写。

## 6. 决定（2026-11-06）

- 用户：按建议规划（季度当章节、天当玩法）；一小时后再开始运行。
- Fable：
  - 一季三天（工作日、周末、特别的一天）；只有时钟，不加体力值。
  - 八位常驻镇民加各角色家人，好感 0–10 心；好感的帮助只改属性与叙事。
  - 不设买卖与打零工；有菜地、钓鱼、做饭、小店；每季一个节日。
  - 事件卡全部保留，改为在日子里送达。
  - `state.date` 语义不变；出国改为当天出发、归来后按实际日期记录。
  - 素材换成 Kenney 现代城镇系列（CC0）加 josehzz 作物，声音沿用 ninja-adventure。
  - 本地集成分支 `phase-9`，Wave 2 验收后再进 main。

## 7. 波次

- Wave 1（并行）：sol 9.1；astra 9.2（mock）。合并顺序先 9.2 后 9.1：9.1 删掉 v2 的 `act` / `actions` 会让 v2 客户端编译失败，而 9.2 已把客户端换到 mock 上。
- Wave 2（并行）：sol 9.3；astra 9.4。
- Wave 3：Fable 9.5；修改发回各 writer；`phase-9` 合并进 main、推送、部署。
- 进度（2026-11-06）：Wave 1、Wave 2 全部合到 `phase-9`（9.2 fd454a8、9.1 0fa5854、9.4 13f6c38、9.3 4132952；Fable 修正 c4a066f 地图图层字段、e4cc396 页脚、a296baa 出国期间早上卡、b09fbd7 家人测试、b1b9617 公告显示），浏览器验收后合进 main 部署。9.5 的整局 QA 与文案评审待做。
