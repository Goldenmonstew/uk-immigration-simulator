/** Temporary Phase 9.2 core. Delete in 9.4 when connecting packages/game v3.
 * All prices, durations and rewards below are fictional game settings, not policy.
 * Policy assessment is delegated to evaluate; mock visa choices only demonstrate UI.
 */
import {
  evaluate,
  type IsoDate,
  type Locale,
  type PersonTimeline,
  type SimulationResult,
} from '@uk-immigration/engine';
import {
  characters,
  type Text,
  type StatKey,
  type Quarter,
  type LocationId,
  type EndingId,
  type Progress,
  type Effect as V2Effect,
  type Condition as V2Condition,
} from '@uk-immigration/game';
export { characters };
export type { Text, StatKey, Quarter };
export type DayKind = 'workday' | 'weekend' | 'special';
export type Weather = 'sunny' | 'cloudy' | 'rain' | 'snow';
export type PlaceId =
  | LocationId
  | 'shop'
  | 'cafe'
  | 'library'
  | 'allotment'
  | 'pond'
  | 'board'
  | 'green'
  | 'bench';
export type AnchorId =
  | 'home-street'
  | 'high-street-west'
  | 'high-street-east'
  | 'bus-stop'
  | 'postbox'
  | 'park-bench'
  | 'park-pond'
  | 'park-path'
  | 'allotment-gate'
  | 'allotment-plots'
  | 'green-centre'
  | 'green-stall'
  | 'station-front'
  | 'college-steps'
  | 'pub-garden'
  | 'library-steps';
export type NpcId = string;
export type ItemId = string;
export type FestivalId =
  | 'lunar-new-year'
  | 'may-day'
  | 'summer-fair'
  | 'bonfire-night'
  | 'christmas-market';
export type Channel =
  'morning' | 'letter' | 'phone' | `npc:${NpcId}` | `place:${PlaceId}`;
export interface Place {
  id: PlaceId;
  name: Text;
  kind: 'building' | 'outdoor';
  hours?: { opens: number; closes: number; dayKinds?: DayKind[] };
}
export type Condition =
  | V2Condition
  | { dayKind: DayKind }
  | { weather: Weather }
  | { festival: FestivalId }
  | { npc: NpcId; heartsMin?: number; heartsMax?: number }
  | { item: ItemId; min?: number }
  | { minuteMin?: number; minuteMax?: number };
export type Effect =
  | V2Effect
  | { type: 'item'; item: ItemId; delta: number }
  | { type: 'friendship'; npc: NpcId; delta: number };
export interface Activity {
  id: string;
  place: PlaceId;
  label: Text;
  minutes: number;
  effects: Effect[];
  when?: Condition[];
  oncePerDay?: boolean;
}
export interface GameEvent {
  id: string;
  title: Text;
  text: Text;
  weight: number;
  season?: Quarter;
  once?: boolean;
  requires?: string[];
  forbids?: string[];
  when?: Condition[];
  channel?: Channel;
  speaker?: NpcId;
  heart?: { npc: NpcId; hearts: number };
  choices: {
    id: string;
    label: Text;
    effects: Effect[];
    sets?: string[];
    note?: Text;
  }[];
}
export interface Npc {
  id: NpcId;
  name: Text;
  role: Text;
  characters?: string[];
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
export interface Item {
  id: ItemId;
  name: Text;
  kind: 'seed' | 'crop' | 'fish' | 'food' | 'gift' | 'junk';
  price?: number;
  edible?: { mood?: number; health?: number };
  grows?: { crop: ItemId; days: number; seasons: Quarter[] };
}
export interface Recipe {
  id: string;
  label: Text;
  needs: Record<ItemId, number>;
  makes: ItemId;
  minutes: number;
}
export interface Festival {
  id: FestivalId;
  name: Text;
  season: Quarter;
  text: Text;
}
export interface Plot {
  seed?: ItemId;
  growth: number;
  wateredOn?: number;
}
export interface DayState {
  index: 0 | 1 | 2;
  kind: DayKind;
  date: IsoDate;
  minute: number;
  weather: Weather;
  festival?: FestivalId;
  place?: PlaceId;
  done: string[];
  talked: NpcId[];
  gifted: NpcId[];
  deliveries: { eventId: string; channel: Channel; minute?: number }[];
}
export type Outcome = {
  kind:
    | 'activity'
    | 'talk'
    | 'gift'
    | 'catch'
    | 'harvest'
    | 'cook'
    | 'buy'
    | 'eat'
    | 'sleep'
    | 'travel';
  npc?: NpcId;
  text?: Text;
  items?: Record<ItemId, number>;
  statDeltas?: Partial<Record<StatKey, number>>;
};
export interface GameState {
  version: 3;
  characterId: string;
  seed: number;
  locale: Locale;
  year: number;
  quarter: Quarter;
  date: IsoDate;
  timeline: PersonTimeline;
  stats: Record<StatKey, number>;
  flags: string[];
  firedEvents: string[];
  pendingEvent?: string;
  eventQueue: string[];
  randomState: number;
  log: {
    year: number;
    quarter: Quarter;
    kind: 'action' | 'event' | 'quarter' | 'ending';
    id: string;
    choiceId?: string;
    text: Text;
    statDeltas?: Partial<Record<StatKey, number>>;
  }[];
  result: SimulationResult;
  ending?: EndingId;
  achievements: string[];
  dayNumber: number;
  day: DayState;
  inventory: Record<ItemId, number>;
  friendship: Record<NpcId, number>;
  plots: Plot[];
  heard: string[];
  outcome?: Outcome;
}
const tx = (zhCN: string, en: string): Text => ({ zhCN, en });
const addDays = (date: string, n: number) =>
  new Date(Date.parse(date) + n * 86400000).toISOString().slice(0, 10);
function addMonths(date: string, n: number) {
  const d = new Date(date);
  d.setUTCMonth(d.getUTCMonth() + n);
  return d.toISOString().slice(0, 10);
}
function random(state: GameState) {
  state.randomState = (state.randomState + 0x6d2b79f5) | 0;
  let t = Math.imul(
    state.randomState ^ (state.randomState >>> 15),
    1 | state.randomState,
  );
  t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const names: [PlaceId, string, string][] = [
  ['home', '家', 'Home'],
  ['work', '公司', 'Office'],
  ['college', '语言学校', 'Language school'],
  ['gp', 'GP 诊所', 'GP surgery'],
  ['pub', '橡树酒吧', 'The Oak pub'],
  ['council', '市政厅', 'Town hall'],
  ['visa', '签证中心', 'Visa centre'],
  ['station', '火车站', 'Station'],
  ['shop', '街角小店', 'Corner shop'],
  ['cafe', '咖啡馆', 'Café'],
  ['library', '图书馆', 'Library'],
  ['allotment', '社区菜地', 'Allotment'],
  ['pond', '公园池塘', 'Park pond'],
  ['board', '公告栏', 'Noticeboard'],
  ['green', '村绿地', 'Village green'],
  ['bench', '公园长椅', 'Park bench'],
];
export const places: Place[] = names.map(([id, zh, en]) => ({
  id,
  name: tx(zh, en),
  kind: ['allotment', 'pond', 'board', 'green', 'bench'].includes(id)
    ? 'outdoor'
    : 'building',
  ...([
    'home',
    'station',
    'allotment',
    'pond',
    'board',
    'green',
    'bench',
  ].includes(id)
    ? {}
    : {
        hours: {
          opens: id === 'pub' ? 720 : id === 'college' ? 600 : 480,
          closes: id === 'pub' ? 1380 : id === 'college' ? 1320 : 1200,
          ...(['work', 'gp'].includes(id)
            ? { dayKinds: ['workday'] as DayKind[] }
            : {}),
        },
      }),
}));

export function isOpen(state: GameState, place: PlaceId) {
  const h = places.find((p) => p.id === place)!.hours;
  return (
    !h ||
    (state.day.minute >= h.opens &&
      state.day.minute < h.closes &&
      (!h.dayKinds || h.dayKinds.includes(state.day.kind)))
  );
}
const cropNames: [string, string, string, Quarter[]][] = [
  ['potato', '土豆', 'Potato', [1, 2, 3, 4]],
  ['strawberry', '草莓', 'Strawberry', [2, 3]],
  ['tomato', '番茄', 'Tomato', [2, 3]],
  ['cucumber', '黄瓜', 'Cucumber', [2, 3]],
  ['turnip', '芜菁', 'Turnip', [1, 2, 4]],
  ['corn', '玉米', 'Sweetcorn', [3, 4]],
  ['sunflower', '向日葵', 'Sunflower', [2, 3]],
  ['tulip', '郁金香', 'Tulip', [1, 2]],
];
export const items: Item[] = cropNames
  .flatMap(([id, zh, en, seasons]): Item[] => [
    { id, name: tx(zh, en), kind: 'crop', edible: { health: 3, mood: 2 } },
    {
      id: `seed-${id}`,
      name: tx(`${zh}种子`, `${en} seeds`),
      kind: 'seed',
      price: 4,
      grows: { crop: id, days: 4, seasons },
    },
  ])
  .concat([
    { id: 'perch', name: tx('鲈鱼', 'Perch'), kind: 'fish' },
    { id: 'carp', name: tx('鲤鱼', 'Carp'), kind: 'fish' },
    { id: 'trout', name: tx('鳟鱼', 'Trout'), kind: 'fish' },
    { id: 'old-boot', name: tx('旧靴子', 'Old boot'), kind: 'junk' },
    {
      id: 'tea',
      name: tx('茶', 'Tea'),
      kind: 'gift',
      price: 3,
      edible: { mood: 3 },
    },
    {
      id: 'biscuits',
      name: tx('饼干', 'Biscuits'),
      kind: 'food',
      price: 3,
      edible: { mood: 4 },
    },
    { id: 'flowers', name: tx('一束花', 'Flowers'), kind: 'gift', price: 6 },
    {
      id: 'cake',
      name: tx('蛋糕', 'Cake'),
      kind: 'food',
      price: 7,
      edible: { mood: 6 },
    },
    {
      id: 'baked-potato',
      name: tx('烤土豆', 'Baked potato'),
      kind: 'food',
      edible: { health: 8, mood: 6 },
    },
    {
      id: 'salad',
      name: tx('沙拉', 'Salad'),
      kind: 'food',
      edible: { health: 10, mood: 4 },
    },
  ]);
export const recipes: Recipe[] = [
  {
    id: 'bake-potato',
    label: tx('烤土豆', 'Bake a potato'),
    needs: { potato: 1 },
    makes: 'baked-potato',
    minutes: 30,
  },
  {
    id: 'make-salad',
    label: tx('拌沙拉', 'Make a salad'),
    needs: { tomato: 1, cucumber: 1 },
    makes: 'salad',
    minutes: 20,
  },
];
export const festivals: Festival[] = [
  {
    id: 'lunar-new-year',
    name: tx('春节百家宴', 'Lunar New Year potluck'),
    season: 1,
    text: tx(
      '绿地上的桌子拼在了一起。带上一道菜，来认识邻居吧。',
      'Tables are pushed together on the green. Bring a dish and meet the neighbours.',
    ),
  },
];
const lines: Record<string, [string, string][]> = {
  margaret: [
    [
      '土豆喜欢松一点的土，跟人一样。',
      'Potatoes like a little room to breathe. Like people.',
    ],
    [
      '我把旧茶壶种上了花。终于不漏水了——因为我不在乎了。',
      'I planted flowers in my old teapot. The leak is finally useful.',
    ],
    [
      '这雨一来，今天就省了浇水。',
      'With this rain, the watering can gets a day off.',
    ],
    [
      '年轻时我也不认识这条街上的任何人。',
      'Once, I knew nobody on this street either.',
    ],
    [
      '你看见我的猫了吗？它又去图书馆了。',
      'Seen my cat? Off to the library again, I expect.',
    ],
    [
      '昨天的汤多做了一点。总会有人来。',
      'I made extra soup yesterday. Someone always drops by.',
    ],
    [
      '种子袋上的图片总是比我的菜漂亮。',
      'The seed packets always look better than my vegetables.',
    ],
    ['公园的长椅刚刷了漆，小心。', 'Mind the park bench. Fresh paint.'],
    [
      '我最喜欢傍晚。每扇窗都像一小盏灯。',
      'Evenings are my favourite. Every window a little lamp.',
    ],
    [
      '明天见吧。我给你留一杯茶。',
      'See you tomorrow. I will put the kettle on.',
    ],
  ],
  ade: [
    [
      '今天的邮件比咖啡还苦。',
      'The emails were stronger than the coffee today.',
    ],
    ['下班后去酒吧吗？不聊工作。', 'Pub after work? No work talk, I promise.'],
    [
      '我又检查了一遍那个文件夹。你也这样吗？',
      'Checked that folder again. Do you do that too?',
    ],
    ['周末我打算什么都不安排。', 'My weekend plan is to have no plan.'],
    ['家里寄来的零食快吃完了。', 'Nearly finished the snacks from home.'],
    [
      '在这儿听到熟悉的口音，总会回一下头。',
      'I still turn around when I hear a familiar accent.',
    ],
    [
      '你看车站那个人，总是赶同一班迟到的车。',
      'That person at the station always catches the same late train.',
    ],
    [
      '我终于记住大家爱喝什么咖啡了。',
      'I finally remember everybody’s coffee order.',
    ],
    [
      '今天老板夸了我。我假装没那么高兴。',
      'The boss praised me today. I pretended to be less pleased.',
    ],
    [
      '不用马上回答。坐一会儿也挺好。',
      'You do not have to answer. We can just sit for a bit.',
    ],
  ],
  helen: [
    [
      '听懂笑话的那天，比考试那天还让人开心。',
      'Getting a joke can feel better than passing a test.',
    ],
    ['今晚带上你最喜欢的一首歌。', 'Bring a favourite song to class tonight.'],
    ['我也常常找不到合适的词。', 'I lose words too, you know.'],
    [
      '图书馆的角落很安静。适合读一小段。',
      'There is a quiet corner in the library. Good for a page or two.',
    ],
    [
      '天气又给了我们一个聊天的话题。',
      'The weather has given us another conversation starter.',
    ],
    [
      '今天我们聊食谱。谁也不许饿着来。',
      'Recipes in class today. Nobody should arrive hungry.',
    ],
    ['你的故事值得慢慢说。', 'Your story deserves time to be told.'],
    [
      '我在公交车上批作业，差点坐过站。',
      'Marked homework on the bus. Nearly missed my stop.',
    ],
    ['那本书不用急着还。', 'No hurry with that book.'],
    [
      '这周的进步，你自己看见了吗？',
      'Have you noticed how far you came this week?',
    ],
  ],
};
const npcRows: [
  string,
  string,
  string,
  string,
  string,
  PlaceId,
  AnchorId,
  string[]?,
][] = [
  [
    'margaret',
    '玛格丽特',
    'Margaret',
    '退休邻居',
    'Neighbour',
    'home',
    'allotment-plots',
  ],
  [
    'priya',
    '普里娅',
    'Priya',
    '诊所前台',
    'GP receptionist',
    'gp',
    'park-bench',
  ],
  ['ade', '阿德', 'Ade', '同事', 'Colleague', 'work', 'high-street-east'],
  [
    'helen',
    '海伦',
    'Helen',
    '英语老师',
    'ESOL teacher',
    'college',
    'library-steps',
  ],
  ['dave', '戴夫', 'Dave', '酒吧老板', 'Publican', 'pub', 'pub-garden'],
  [
    'rahman',
    '拉赫曼',
    'Rahman',
    '小店老板',
    'Shopkeeper',
    'shop',
    'high-street-west',
  ],
  ['lina', '莉娜', 'Lina', '朋友', 'Friend', 'cafe', 'park-path'],
  ['gareth', '加雷思', 'Gareth', '邮差', 'Postie', 'station', 'postbox'],
  [
    'jamie',
    '杰米',
    'Jamie',
    '家人',
    'Family',
    'home',
    'park-bench',
    ['family-partner'],
  ],
  [
    'ka-ning-partner',
    '伴侣',
    'Partner',
    '家人',
    'Family',
    'home',
    'library-steps',
    ['hong-kong-bno'],
  ],
  [
    'ka-ning-child',
    '孩子',
    'Child',
    '家人',
    'Family',
    'home',
    'park-path',
    ['hong-kong-bno'],
  ],
];
export const npcs: Npc[] = npcRows.map(
  ([id, zh, en, role, englishRole, work, anchor, characters]) => ({
    id,
    name: tx(zh, en),
    role: tx(role, englishRole),
    characters,
    schedule: [
      {
        festival: true,
        stops: [
          { from: 420, at: 'green-centre' },
          { from: 720, at: 'green-stall' },
          { from: 1260, at: 'home' },
        ],
      },
      {
        weather: ['rain', 'snow'],
        stops: [
          { from: 420, at: 'home' },
          { from: 480, at: work },
          { from: 1080, at: 'pub' },
          { from: 1320, at: 'home' },
        ],
      },
      {
        dayKinds: ['workday'],
        stops: [
          { from: 420, at: 'home-street' },
          { from: 480, at: work },
          { from: 1020, at: anchor },
          { from: 1140, at: 'pub' },
          { from: 1320, at: 'home' },
        ],
      },
      {
        stops: [
          { from: 420, at: anchor },
          { from: 720, at: 'cafe' },
          { from: 900, at: 'park-path' },
          { from: 1140, at: 'pub' },
          { from: 1320, at: 'home' },
        ],
      },
    ],
    gifts: {
      loved: ['tea', 'baked-potato'],
      liked: ['flowers', 'potato', 'biscuits'],
      disliked: ['old-boot'],
    },
    reactions: {
      loved: tx('你还记得！这正是我喜欢的。', 'You remembered! My favourite.'),
      liked: tx('谢谢你想着我。', 'Thank you for thinking of me.'),
      neutral: tx('谢谢这份心意。', 'Thank you for the thought.'),
      disliked: tx(
        '这个……你还是留着吧。',
        'Perhaps you should have kept this one.',
      ),
    },
    lines: (
      lines[id] ?? [
        [`早上好。在这儿见到你真好。`, `Lovely to see you around town.`],
      ]
    ).map(([zhCN, en], i) => ({ id: `${id}-${i}`, text: { zhCN, en } })),
  }),
);
export const townsfolk = (s: GameState) =>
  npcs.filter((n) => !n.characters || n.characters.includes(s.characterId));
export function npcAt(s: GameState, id: NpcId): PlaceId | AnchorId {
  const npc = npcs.find((n) => n.id === id)!;
  const rule = npc.schedule.find(
    (r) =>
      (!r.dayKinds || r.dayKinds.includes(s.day.kind)) &&
      (!r.weather || r.weather.includes(s.day.weather)) &&
      (r.festival === undefined || r.festival === !!s.day.festival),
  )!;
  return (
    [...rule.stops].reverse().find((stop) => stop.from <= s.day.minute)?.at ??
    rule.stops[0].at
  );
}
export const peopleAt = (s: GameState, p: PlaceId) =>
  townsfolk(s)
    .filter((n) => npcAt(s, n.id) === p)
    .map((n) => n.id);
export const hearts = (s: GameState, n: NpcId) =>
  Math.floor((s.friendship[n] ?? 0) / 100);
const stat = (key: StatKey, delta: number): Effect => ({
  type: 'stat',
  key,
  delta,
});
const activityRows: Activity[] = [
  {
    id: 'rest',
    place: 'home',
    label: tx('午睡一会儿', 'Take a nap'),
    minutes: 60,
    effects: [stat('health', 5), stat('mood', 3)],
  },
  {
    id: 'study',
    place: 'home',
    label: tx('在书桌自学', 'Study at the desk'),
    minutes: 60,
    effects: [stat('english', 3)],
  },
  {
    id: 'work',
    place: 'work',
    label: tx('上班到 17:00', 'Work until 17:00'),
    minutes: 480,
    effects: [stat('career', 3), { type: 'money', delta: 120 }],
    when: [{ dayKind: 'workday' }, { minuteMax: 600 }],
    oncePerDay: true,
  },
  {
    id: 'overtime',
    place: 'work',
    label: tx('加班', 'Work overtime'),
    minutes: 120,
    effects: [
      stat('career', 2),
      stat('mood', -3),
      { type: 'money', delta: 30 },
    ],
    when: [{ dayKind: 'workday' }, { minuteMin: 1020 }],
    oncePerDay: true,
  },
  {
    id: 'class',
    place: 'college',
    label: tx('参加英语课', 'Take an English class'),
    minutes: 120,
    effects: [stat('english', 5)],
    when: [{ minuteMin: 1080 }],
    oncePerDay: true,
  },
  {
    id: 'weekend-class',
    place: 'college',
    label: tx('周末英语课', 'Weekend English class'),
    minutes: 90,
    effects: [stat('english', 4)],
    when: [{ dayKind: 'weekend' }],
    oncePerDay: true,
  },
  {
    id: 'exam',
    place: 'college',
    label: tx('英语考试', 'English test'),
    minutes: 60,
    effects: [stat('english', 2)],
    oncePerDay: true,
  },
  {
    id: 'read',
    place: 'library',
    label: tx('借一本书', 'Borrow a book'),
    minutes: 40,
    effects: [stat('english', 2), stat('mood', 2)],
  },
  {
    id: 'gp',
    place: 'gp',
    label: tx('看病', 'See the GP'),
    minutes: 60,
    effects: [stat('health', 10)],
  },
  {
    id: 'relax',
    place: 'pub',
    label: tx('喝一杯，聊聊天', 'Have a drink and unwind'),
    minutes: 60,
    effects: [stat('mood', 6), { type: 'money', delta: -5 }],
  },
  {
    id: 'quiz',
    place: 'pub',
    label: tx('参加 pub quiz', 'Join the pub quiz'),
    minutes: 60,
    effects: [stat('english', 3), stat('mood', 4)],
    when: [{ minuteMin: 1140 }],
    oncePerDay: true,
  },
  {
    id: 'coffee',
    place: 'cafe',
    label: tx('喝杯咖啡', 'Have a coffee'),
    minutes: 30,
    effects: [stat('mood', 4), { type: 'money', delta: -3 }],
  },
  {
    id: 'assessment',
    place: 'council',
    label: tx('两栏定居评估', 'Settlement assessments'),
    minutes: 0,
    effects: [],
  },
  {
    id: 'extend',
    place: 'visa',
    label: tx('续签', 'Extend permission'),
    minutes: 30,
    effects: [],
    oncePerDay: true,
  },
  {
    id: 'settle',
    place: 'visa',
    label: tx('申请定居', 'Apply for settlement'),
    minutes: 30,
    effects: [],
    oncePerDay: true,
  },
  {
    id: 'rent',
    place: 'allotment',
    label: tx('租下六格菜地 · £20', 'Rent six plots · £20'),
    minutes: 10,
    effects: [{ type: 'money', delta: -20 }],
  },
  {
    id: 'sit',
    place: 'bench',
    label: tx('坐一会儿', 'Sit for a while'),
    minutes: 30,
    effects: [stat('mood', 3)],
  },
  {
    id: 'notice',
    place: 'board',
    label: tx('看看本季公告', 'Read the seasonal notices'),
    minutes: 10,
    effects: [],
  },
  {
    id: 'festival',
    place: 'green',
    label: tx('参加百家宴', 'Join the potluck'),
    minutes: 60,
    effects: [stat('mood', 8)],
    when: [{ festival: 'lunar-new-year' }],
    oncePerDay: true,
  },
  ...[1, 3, 6].map((m): Activity => ({
    id: `travel-${m}`,
    place: 'station',
    label: tx(`出国 ${m} 个月`, `Travel abroad for ${m} month(s)`),
    minutes: 0,
    effects: [],
  })),
  {
    id: 'leave',
    place: 'station',
    label: tx('离开英国', 'Leave the UK'),
    minutes: 0,
    effects: [{ type: 'ending', ending: 'left' }],
  },
];
function matches(s: GameState, c: Condition) {
  if ('dayKind' in c) return s.day.kind === c.dayKind;
  if ('weather' in c) return s.day.weather === c.weather;
  if ('festival' in c) return s.day.festival === c.festival;
  if ('minuteMin' in c || 'minuteMax' in c)
    return (
      s.day.minute >= (c.minuteMin ?? 0) &&
      s.day.minute <= (c.minuteMax ?? 1440)
    );
  if ('stat' in c)
    return (
      s.stats[c.stat] >= (c.min ?? -Infinity) &&
      s.stats[c.stat] <= (c.max ?? Infinity)
    );
  return true;
}
export function activities(s: GameState, p: PlaceId) {
  if (s.pendingEvent || isOver(s) || !isOpen(s, p)) return [];
  return activityRows.filter(
    (a) =>
      a.place === p &&
      (!a.oncePerDay || !s.day.done.includes(a.id)) &&
      (a.when ?? []).every((c) => matches(s, c)) &&
      (a.id !== 'rent' || !s.plots.length) &&
      (!a.id.startsWith('travel-') ||
        addMonths(s.date, Number(a.id.slice(7))) <=
          (s.timeline.episodes.at(-1)?.validTo ?? '')),
  );
}
export const shop = (s: GameState, p: PlaceId) =>
  !s.pendingEvent &&
  isOpen(s, p) &&
  (p === 'shop' || (p === 'green' && s.day.festival))
    ? items.filter(
        (i) =>
          i.price !== undefined &&
          (!i.grows || i.grows.seasons.includes(s.quarter)),
      )
    : [];
const event = (
  id: string,
  title: Text,
  text: Text,
  channel: Channel,
): GameEvent => ({
  id,
  title,
  text,
  channel,
  weight: 1,
  choices: [
    {
      id: 'yes',
      label: tx('好，记下了', 'All right'),
      effects: [stat('mood', 2)],
    },
  ],
});
const events: GameEvent[] = [
  event(
    'morning',
    tx('新的一天', 'A new day'),
    tx(
      '日历旁贴着一张字条：先喝杯茶，再出门吧。',
      'A note beside the calendar: have a cup of tea before you head out.',
    ),
    'morning',
  ),
  event(
    'letter',
    tx('社区来信', 'A letter from the neighbourhood'),
    tx(
      '邻居邀请你去菜地看看。信封里还夹了一包土豆种子。',
      'A neighbour invites you to the allotment. There is a packet of potato seeds in the envelope.',
    ),
    'letter',
  ),
  event(
    'phone',
    tx('电话响了', 'Your phone rings'),
    tx(
      '阿德问你晚上要不要去酒吧。他已经留了一张桌子。',
      'Ade asks if you fancy the pub tonight. He has saved you a table.',
    ),
    'phone',
  ),
  event(
    'visa-demo',
    tx('签证中心', 'Visa centre'),
    tx(
      '材料已整理好。这是客户端演示；正式的费用与申请结果将在接入真实核心后显示。',
      'Your papers are organised. This client preview will show application fees and outcomes when the real core is connected.',
    ),
    'place:visa',
  ),
  ...['margaret', 'ade', 'helen'].map((id) => ({
    ...event(
      `heart-${id}`,
      tx('一杯茶的时间', 'Time for a cup of tea'),
      tx(
        '“其实，刚来的时候我也觉得陌生。现在有你在，这条街又熟悉了一点。”',
        '“It felt unfamiliar to me at first, too. Having you here makes this street feel a little more like home.”',
      ),
      `npc:${id}`,
    ),
    speaker: id,
    heart: { npc: id, hearts: 2 },
  })),
];
events
  .find((e) => e.id === 'letter')!
  .choices[0].effects.push({ type: 'item', item: 'seed-potato', delta: 1 });
events.find((e) => e.id === 'phone')!.speaker = 'ade';
export const currentEvent = (s: GameState) =>
  events.find((e) => e.id === s.pendingEvent);
export const mailbox = (s: GameState) =>
  s.day.deliveries.filter((d) => d.channel === 'letter').map((d) => d.eventId);
function deliver(
  s: GameState,
  match: (d: DayState['deliveries'][number]) => boolean,
) {
  if (s.pendingEvent) return;
  const i = s.day.deliveries.findIndex(match);
  if (i < 0) return;
  s.pendingEvent = s.day.deliveries[i].eventId;
  s.day.deliveries.splice(i, 1);
}
function record(s: GameState, outcome: Outcome, id: string) {
  s.outcome = outcome;
  const person = npcs.find((n) => n.id === outcome.npc),
    text = outcome.text ?? tx(id, id);
  const logText = person
    ? tx(`${person.name.zhCN}：${text.zhCN}`, `${person.name.en}: ${text.en}`)
    : text;
  const gains = Object.entries(outcome.items ?? {}).filter(([, n]) => n > 0);
  s.log.push({
    year: s.year,
    quarter: s.quarter,
    kind: 'action',
    id,
    text: gains.length
      ? tx(
          `${logText.zhCN}（${gains.map(([id, n]) => `${items.find((i) => i.id === id)?.name.zhCN ?? '物品'} × ${n}`).join('，')}）`,
          `${logText.en} (${gains.map(([id, n]) => `${items.find((i) => i.id === id)?.name.en ?? 'Item'} × ${n}`).join(', ')})`,
        )
      : logText,
    statDeltas: outcome.statDeltas,
  });
}
function effects(s: GameState, list: Effect[]) {
  const deltas: Partial<Record<StatKey, number>> = {};
  for (const e of list) {
    if (e.type === 'stat' || e.type === 'money') {
      const k = e.type === 'money' ? 'money' : e.key;
      const before = s.stats[k];
      s.stats[k] =
        k === 'money'
          ? before + e.delta
          : Math.min(100, Math.max(0, before + e.delta));
      deltas[k] = (deltas[k] ?? 0) + s.stats[k] - before;
    } else if (e.type === 'item')
      s.inventory[e.item] = (s.inventory[e.item] ?? 0) + e.delta;
    else if (e.type === 'friendship')
      s.friendship[e.npc] = Math.max(
        0,
        Math.min(1000, (s.friendship[e.npc] ?? 0) + e.delta),
      );
    else if (e.type === 'ending') s.ending = e.ending;
  }
  return deltas;
}
function advance(s: GameState, minutes: number) {
  s.day.minute = Math.min(1440, s.day.minute + minutes);
  deliver(s, (d) => d.channel === 'phone' && (d.minute ?? 0) <= s.day.minute);
  if (s.day.minute === 1440) {
    s.day.place = 'home';
    if (!s.day.done.includes('midnight')) {
      s.day.done.push('midnight');
      s.stats.mood = Math.max(0, s.stats.mood - 2);
    }
  }
}
function makeDay(s: GameState, index: 0 | 1 | 2): DayState {
  const weekday = new Date(s.date).getUTCDay();
  const workOffset = weekday === 0 ? 1 : weekday === 6 ? 2 : 0;
  const weekendOffset =
    workOffset + ((6 - ((weekday + workOffset) % 7) + 7) % 7);
  const offset =
    index === 0 ? workOffset : index === 1 ? weekendOffset : weekendOffset + 7;
  return {
    index,
    kind: (['workday', 'weekend', 'special'] as const)[index],
    date: addDays(s.date, offset),
    minute: 420,
    weather: (['sunny', 'cloudy', 'rain', 'snow'] as const)[
      Math.floor(random(s) * 4)
    ],
    ...(index === 2 && s.quarter === 1
      ? { festival: 'lunar-new-year' as const }
      : {}),
    place: 'home',
    done: [],
    talked: [],
    gifted: [],
    deliveries:
      index === 0
        ? [
            { eventId: 'morning', channel: 'morning' },
            { eventId: 'letter', channel: 'letter' },
            { eventId: 'phone', channel: 'phone', minute: 1080 },
          ]
        : [],
  };
}
export function newGame(
  characterId: string,
  seed: number,
  locale: Locale = 'zh-CN',
): GameState {
  const c = characters.find((c) => c.id === characterId)!;
  const timeline = structuredClone(c.timeline);
  const s: GameState = {
    version: 3,
    characterId,
    seed,
    randomState: seed | 0,
    locale,
    year: 1,
    quarter: Math.ceil(Number(c.startDate.slice(5, 7)) / 3) as Quarter,
    date: c.startDate,
    timeline,
    stats: { ...c.stats },
    flags: [],
    firedEvents: [],
    eventQueue: [],
    log: [],
    result: evaluate({ timeline, simulationDate: c.startDate, locale }),
    achievements: [],
    dayNumber: 0,
    day: {} as DayState,
    inventory: { 'seed-potato': 2, tea: 2, biscuits: 2 },
    friendship: {},
    plots: [],
    heard: [],
  };
  s.day = makeDay(s, 0);
  deliver(s, (d) => d.channel === 'morning');
  return s;
}
export function enter(state: GameState, place: PlaceId) {
  const s = structuredClone(state);
  s.day.place = place;
  deliver(s, (d) => d.channel === `place:${place}`);
  return s;
}
export function tick(state: GameState, minutes: number) {
  if (state.pendingEvent || isOver(state)) return state;
  const s = structuredClone(state);
  advance(s, minutes);
  return s;
}
export function doActivity(state: GameState, id: string) {
  const a = activityRows.find((a) => a.id === id)!;
  if (!activities(state, a.place).some((a) => a.id === id)) return state;
  const s = structuredClone(state);
  s.day.place = a.place;
  s.day.done.push(id);
  const statDeltas = effects(s, a.effects);
  if (id === 'rent') s.plots = Array.from({ length: 6 }, () => ({ growth: 0 }));
  if (id === 'extend' || id === 'settle') s.pendingEvent = 'visa-demo';
  if (id.startsWith('travel-')) {
    const from = s.date,
      to = addMonths(from, Number(id.slice(7)));
    s.date = to;
    s.timeline.absences.push({ from, to });
    s.result = evaluate({
      timeline: s.timeline,
      simulationDate: s.date,
      locale: s.locale,
    });
    s.day.index = 2;
    s.day.minute = 1440;
    s.day.place = 'home';
  } else
    advance(s, id === 'work' ? Math.max(0, 1020 - s.day.minute) : a.minutes);
  record(
    s,
    {
      kind: id.startsWith('travel-') ? 'travel' : 'activity',
      text: a.label,
      statDeltas,
    },
    id,
  );
  return s;
}
export function talk(state: GameState, npc: NpcId) {
  if (state.pendingEvent) return state;
  const s = structuredClone(state),
    n = npcs.find((n) => n.id === npc)!;
  if (!s.day.talked.includes(npc)) {
    s.day.talked.push(npc);
    if (!s.achievements.includes('neighbour')) s.achievements.push('neighbour');
    s.friendship[npc] = Math.min(1000, (s.friendship[npc] ?? 0) + 100);
  }
  const candidates = n.lines.filter((l) => !s.heard.includes(l.id));
  const line = (candidates.length ? candidates : n.lines)[
    Math.floor(random(s) * (candidates.length || n.lines.length))
  ];
  s.heard.push(line.id);
  advance(s, 10);
  record(s, { kind: 'talk', npc, text: line.text }, `talk:${npc}`);
  const heart = events.find(
    (e) =>
      e.heart?.npc === npc &&
      hearts(s, npc) >= e.heart.hearts &&
      !s.firedEvents.includes(e.id),
  );
  if (heart && !s.pendingEvent) s.pendingEvent = heart.id;
  deliver(s, (d) => d.channel === `npc:${npc}`);
  return s;
}
export function gift(state: GameState, npc: NpcId, item: ItemId) {
  if (
    state.pendingEvent ||
    state.day.gifted.includes(npc) ||
    !(state.inventory[item] > 0)
  )
    return state;
  const s = structuredClone(state),
    n = npcs.find((n) => n.id === npc)!;
  const liking = n.gifts.loved.includes(item)
    ? 'loved'
    : n.gifts.liked.includes(item)
      ? 'liked'
      : n.gifts.disliked.includes(item)
        ? 'disliked'
        : 'neutral';
  s.inventory[item]--;
  s.day.gifted.push(npc);
  s.friendship[npc] = Math.min(
    1000,
    Math.max(
      0,
      (s.friendship[npc] ?? 0) +
        { loved: 150, liked: 80, neutral: 20, disliked: -50 }[liking],
    ),
  );
  advance(s, 10);
  record(
    s,
    { kind: 'gift', npc, text: n.reactions[liking], items: { [item]: -1 } },
    `gift:${npc}`,
  );
  return s;
}
export function buy(state: GameState, item: ItemId, qty: number) {
  const i = shop(state, state.day.place ?? 'shop').find((i) => i.id === item);
  if (
    !i ||
    qty < 1 ||
    !Number.isInteger(qty) ||
    state.stats.money < (i.price ?? 0) * qty
  )
    return state;
  const s = structuredClone(state),
    cost = (i.price ?? 0) * qty;
  s.inventory[item] = (s.inventory[item] ?? 0) + qty;
  s.stats.money -= cost;
  record(
    s,
    {
      kind: 'buy',
      text: i.name,
      items: { [item]: qty },
      statDeltas: { money: -cost },
    },
    `buy:${item}`,
  );
  return s;
}
export function plant(state: GameState, plot: number, seed: ItemId) {
  const i = items.find((i) => i.id === seed);
  if (
    state.pendingEvent ||
    !state.plots[plot] ||
    state.plots[plot].seed ||
    !i?.grows ||
    !i.grows.seasons.includes(state.quarter) ||
    !(state.inventory[seed] > 0)
  )
    return state;
  const s = structuredClone(state);
  s.inventory[seed]--;
  s.plots[plot] = { seed, growth: 0 };
  advance(s, 10);
  record(
    s,
    {
      kind: 'activity',
      text: tx(`种下了${i.name.zhCN}`, `Planted ${i.name.en}`),
      items: { [seed]: -1 },
    },
    `plant:${seed}`,
  );
  return s;
}
export function water(state: GameState, plot: number) {
  if (
    state.pendingEvent ||
    !state.plots[plot]?.seed ||
    state.plots[plot].wateredOn === state.dayNumber
  )
    return state;
  const s = structuredClone(state);
  s.plots[plot].wateredOn = s.dayNumber;
  advance(s, 10);
  record(
    s,
    { kind: 'activity', text: tx('给菜地浇了水', 'Watered the plot') },
    `water:${plot}`,
  );
  return s;
}
export function harvest(state: GameState, plot: number) {
  const seed = items.find((i) => i.id === state.plots[plot]?.seed);
  if (
    state.pendingEvent ||
    !seed?.grows ||
    state.plots[plot].growth < seed.grows.days
  )
    return state;
  const s = structuredClone(state),
    qty = 1 + Math.floor(random(s) * 3),
    crop = seed.grows.crop;
  s.inventory[crop] = (s.inventory[crop] ?? 0) + qty;
  s.plots[plot] = { growth: 0 };
  advance(s, 10);
  record(
    s,
    {
      kind: 'harvest',
      text: tx(
        `收获了${items.find((i) => i.id === crop)!.name.zhCN}`,
        `Harvested ${items.find((i) => i.id === crop)!.name.en}`,
      ),
      items: { [crop]: qty },
    },
    `harvest:${crop}`,
  );
  return s;
}
export function fish(state: GameState, caught: boolean) {
  if (state.pendingEvent) return state;
  const s = structuredClone(state);
  const id = ['perch', 'carp', 'trout', 'old-boot'][Math.floor(random(s) * 4)];
  if (caught) s.inventory[id] = (s.inventory[id] ?? 0) + 1;
  advance(s, 20);
  record(
    s,
    {
      kind: 'catch',
      text: caught
        ? items.find((i) => i.id === id)!.name
        : tx('鱼游走了，下次再试。', 'It got away. Try again.'),
      items: caught ? { [id]: 1 } : {},
    },
    `fish:${caught ? id : 'miss'}`,
  );
  return s;
}
export function cook(state: GameState, recipe: string) {
  const r = recipes.find((r) => r.id === recipe)!;
  if (
    state.pendingEvent ||
    Object.entries(r.needs).some(([id, n]) => (state.inventory[id] ?? 0) < n)
  )
    return state;
  const s = structuredClone(state);
  for (const [id, n] of Object.entries(r.needs)) s.inventory[id] -= n;
  s.inventory[r.makes] = (s.inventory[r.makes] ?? 0) + 1;
  advance(s, r.minutes);
  record(
    s,
    { kind: 'cook', text: r.label, items: { [r.makes]: 1 } },
    `cook:${recipe}`,
  );
  return s;
}
export function eat(state: GameState, item: ItemId) {
  const i = items.find((i) => i.id === item);
  if (state.pendingEvent || !i?.edible || !(state.inventory[item] > 0))
    return state;
  const s = structuredClone(state);
  s.inventory[item]--;
  const statDeltas = effects(
    s,
    Object.entries(i.edible).map(([key, delta]) => stat(key as StatKey, delta)),
  );
  advance(s, 10);
  record(
    s,
    { kind: 'eat', text: i.name, items: { [item]: -1 }, statDeltas },
    `eat:${item}`,
  );
  return s;
}
export function readMail(state: GameState) {
  const s = structuredClone(state);
  deliver(s, (d) => d.channel === 'letter');
  return s;
}
export function resolve(state: GameState, choiceId: string) {
  const e = currentEvent(state),
    choice = e?.choices.find((c) => c.id === choiceId);
  if (!e || !choice) return state;
  const s = structuredClone(state),
    statDeltas = effects(s, choice.effects);
  s.firedEvents.push(e.id);
  s.flags.push(...(choice.sets ?? []));
  delete s.pendingEvent;
  s.log.push({
    year: s.year,
    quarter: s.quarter,
    kind: 'event',
    id: e.id,
    choiceId,
    text: e.title,
    statDeltas,
  });
  s.outcome = { kind: 'activity', text: choice.label, statDeltas };
  return s;
}
export function endQuarter(state: GameState) {
  if (state.pendingEvent || state.day.deliveries.length) return state;
  const s = structuredClone(state);
  s.stats.money += 800;
  s.log.push({
    year: s.year,
    quarter: s.quarter,
    kind: 'quarter',
    id: 'quarter',
    text: tx('工资与生活开销已结算', 'Wages and living costs settled'),
    statDeltas: { money: 800 },
  });
  s.quarter = ((s.quarter % 4) + 1) as Quarter;
  if (s.quarter === 1) s.year++;
  s.date = addMonths(s.date, 3);
  s.result = evaluate({
    timeline: s.timeline,
    simulationDate: s.date,
    locale: s.locale,
  });
  s.plots = s.plots.map(() => ({ growth: 0 }));
  if (s.year > 10) s.ending = 'timeout';
  s.day = makeDay(s, 0);
  if (s.ending) s.day.deliveries = [];
  else deliver(s, (d) => d.channel === 'morning');
  return s;
}
export function sleep(state: GameState) {
  if (state.pendingEvent || isOver(state)) return state;
  const s = structuredClone(state);
  s.day.place = 'home';
  if (s.day.deliveries.length) {
    deliver(s, () => true);
    return s;
  }
  for (const p of s.plots)
    if (p.seed)
      p.growth = Math.min(
        4,
        p.growth +
          1 +
          (p.wateredOn === s.dayNumber || s.day.weather === 'rain' ? 1 : 0),
      );
  s.dayNumber++;
  record(
    s,
    { kind: 'sleep', text: tx('又过了一天', 'Another day lived') },
    'sleep',
  );
  if (s.day.index === 2) return endQuarter(s);
  s.day = makeDay(s, (s.day.index + 1) as 1 | 2);
  deliver(s, (d) => d.channel === 'morning');
  return s;
}
export function fastForward(state: GameState) {
  let s = state;
  const year = s.year,
    q = s.quarter;
  while (!s.pendingEvent && !isOver(s) && s.year === year && s.quarter === q) {
    if (s.day.kind === 'workday' && !s.day.done.includes('work')) {
      s = tick(s, Math.max(0, 480 - s.day.minute));
      s = doActivity(s, 'work');
    }
    if (s.pendingEvent) break;
    if (!s.day.done.includes('default-evening')) {
      if (s.day.festival) s = doActivity(s, 'festival');
      else {
        s = tick(s, Math.max(0, 1140 - s.day.minute));
        if (s.pendingEvent) break;
        s = doActivity(s, 'relax');
      }
      s = structuredClone(s);
      s.day.done.push('default-evening');
    }
    if (s.pendingEvent) break;
    s = sleep(s);
  }
  return s;
}
export function visaMonthsLeft(s: GameState) {
  const end = s.timeline.episodes
    .filter((e) => e.validFrom <= s.date && e.validTo >= s.date)
    .at(-1)?.validTo;
  return end
    ? Math.max(
        0,
        Math.floor((Date.parse(end) - Date.parse(s.date)) / 86400000 / 30.4375),
      )
    : 0;
}
export function progress(s: GameState): Progress {
  const start = Math.min(
    ...s.timeline.episodes.map((e) => Date.parse(e.validFrom)),
  );
  return Object.fromEntries(
    Object.entries(s.result.byRuleSet).map(([id, r]) => {
      const target = r?.earliestDate ? Date.parse(r.earliestDate) : 0;
      return [
        id,
        {
          outcome: r?.outcome ?? 'INSUFFICIENT_INFORMATION',
          earliestDate: r?.earliestDate,
          percent: Math.round(
            Math.max(
              0,
              Math.min(
                100,
                r?.outcome === 'LIKELY_ELIGIBLE'
                  ? 100
                  : target > start
                    ? ((Date.parse(s.date) - start) / (target - start)) * 100
                    : 0,
              ),
            ),
          ),
        },
      ];
    }),
  ) as Progress;
}
export const isOver = (s: GameState) => !!s.ending;
export const narrative = (s: GameState): Text[] => [
  tx(
    `在小镇里，你度过了 ${s.dayNumber} 天。`,
    `You lived ${s.dayNumber} days in this town.`,
  ),
  tx(
    '日子记在了这些相遇和小事里。',
    'The days live on in these encounters and little moments.',
  ),
];
export const achievements = [
  {
    id: 'neighbour',
    name: tx('熟悉的街道', 'A familiar street'),
    description: tx('和邻居聊聊天。', 'Talk to a neighbour.'),
    check: (state: GameState) =>
      state.log.some((entry) => entry.id.startsWith('talk:')),
  },
];
