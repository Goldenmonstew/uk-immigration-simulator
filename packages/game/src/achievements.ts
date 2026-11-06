import type { Achievement, GameState } from './types';
import { npcs } from './npcs';
import { festivals } from './festivals';
import { balance as b } from './balance';
const quarters = (s: GameState) =>
  s.log.filter((e) => e.kind === 'quarter').length;
// Achievement milestones are game goals, not legal eligibility tests.
export const lifeAchievements: Achievement[] = [
  {
    id: 'harvest-twenty',
    name: { zhCN: '沾泥的二十次', en: 'Twenty muddy harvests' },
    description: {
      zhCN: '在菜地收获二十次。',
      en: 'Harvest an allotment plot twenty times.',
    },
    check: (s) =>
      s.log.filter((e) => e.kind === 'action' && e.id === 'harvest').length >=
      b.milestones.harvest,
  },
  {
    id: 'caught-pike',
    name: { zhCN: '池塘的大影子', en: 'A shadow in the pond' },
    description: { zhCN: '钓到一条狗鱼。', en: 'Catch a pike.' },
    check: (s) => s.flags.includes('caught-pike'),
  },
  {
    id: 'eight-hearts',
    name: { zhCN: '留着的那把椅子', en: 'The chair kept for you' },
    description: {
      zhCN: '和一位镇民或家人达到八心。',
      en: 'Reach eight hearts with a resident or family member.',
    },
    check: (s) =>
      Object.values(s.friendship).some(
        (points) => points >= b.milestones.friendship,
      ),
  },
  {
    id: 'talked-everyone',
    name: { zhCN: '一路都能打招呼', en: 'Greetings along the street' },
    description: {
      zhCN: '和八位常驻镇民都聊过天。',
      en: 'Talk to all eight permanent residents.',
    },
    check: (s) =>
      npcs
        .filter((n) => !n.characters)
        .every((n) => s.flags.includes(`talked-${n.id}`)),
  },
  {
    id: 'five-festivals',
    name: { zhCN: '一年又一年的灯', en: 'Lights year after year' },
    description: { zhCN: '参加过五种节日。', en: 'Attend all five festivals.' },
    check: (s) =>
      festivals.every((f) => s.flags.includes(`visited-festival:${f.id}`)),
  },
  {
    id: 'allotment-show',
    name: { zhCN: '篮子上的标签', en: 'A label on the basket' },
    description: {
      zhCN: '在夏日菜地评比取得一次结果。',
      en: 'Receive a result at the summer allotment show.',
    },
    check: (s) => s.flags.some((f) => f.startsWith('show-result-')),
  },
  {
    id: 'quiz-four',
    name: { zhCN: '队名不用再问', en: 'The team name remembered' },
    description: {
      zhCN: '参加四次 pub quiz。',
      en: 'Join the pub quiz four times.',
    },
    check: (s) =>
      s.log.filter((e) => e.kind === 'action' && e.id === 'pub-quiz').length >=
      b.milestones.quiz,
  },
  {
    id: 'loved-gifts-ten',
    name: { zhCN: '还记得你喜欢', en: 'Remembering your favourite' },
    description: {
      zhCN: '送出十次对方最爱的礼物。',
      en: 'Give a loved gift ten times.',
    },
    check: (s) =>
      s.log.filter((e) => e.kind === 'action' && e.id === 'loved-gift')
        .length >= b.milestones.lovedGifts,
  },
];
export const achievements: Achievement[] = [
  ...lifeAchievements,
  {
    id: 'never-overstayed',
    name: { zhCN: '签证从未逾期', en: 'Always in time' },
    description: {
      zhCN: '结束一局，度过至少一季且没有逾期记录。',
      en: 'Finish after at least one quarter without an overstaying record.',
    },
    check: (s) =>
      !!s.ending &&
      quarters(s) > 0 &&
      !s.timeline.immigrationBreaches.some((b) => b.type === 'OVERSTAYING'),
  },
  {
    id: 'ten-years-no-public-funds',
    name: { zhCN: '十年零 public funds', en: 'Ten years without public funds' },
    description: {
      zhCN: '度过四十季，本人没有领取 public funds 的记录。',
      en: 'Complete forty quarters without a personal public-funds record.',
    },
    check: (s) => quarters(s) >= 40 && s.timeline.benefits.length === 0,
  },
  {
    id: 'three-friends',
    name: { zhCN: '三个朋友', en: 'Three friends' },
    description: {
      zhCN: '在图书馆、菜地与邻里间交到三位朋友。',
      en: 'Make three friends through library, allotment and neighbourhood life.',
    },
    check: (s) =>
      ['friend-library', 'friend-garden', 'friend-neighbour'].every((f) =>
        s.flags.includes(f),
      ),
  },
  {
    id: 'life-in-the-uk',
    name: { zhCN: '书签换成证明', en: 'A certificate for a bookmark' },
    description: {
      zhCN: '取得 Life in the UK 通过记录。',
      en: 'Record a Life in the UK pass.',
    },
    check: (s) =>
      !!s.timeline.lifeInTheUk &&
      'passed' in s.timeline.lifeInTheUk &&
      s.timeline.lifeInTheUk.passed === true,
  },
  {
    id: 'feeling-at-home',
    name: { zhCN: '安顿下来', en: 'Finding your feet' },
    description: {
      zhCN: '度过二十季时，心情与健康都达到六十。',
      en: 'After twenty quarters, hold mood and health of at least sixty.',
    },
    check: (s) =>
      quarters(s) >= 20 && s.stats.mood >= 60 && s.stats.health >= 60,
  },
  {
    id: 'two-renewals',
    name: { zhCN: '文件夹的第二格', en: 'The second folder tab' },
    description: {
      zhCN: '在签证中心完成两次续签。',
      en: 'Complete two renewals at the visa centre.',
    },
    check: (s) =>
      s.log.filter((e) => e.kind === 'action' && e.id === 'extend').length >= 2,
  },
  {
    id: 'five-years-home',
    name: { zhCN: '五年零缺席', en: 'Five years at home' },
    description: {
      zhCN: '度过二十季，没有离境记录。',
      en: 'Complete twenty quarters without an absence.',
    },
    check: (s) => quarters(s) >= 20 && s.timeline.absences.length === 0,
  },
  {
    id: 'one-day-away',
    name: { zhCN: '差一天', en: 'One day away' },
    description: {
      zhCN: '评估日期离任一栏最早日期只差一天。',
      en: 'Reach one day before an engine earliest date.',
    },
    check: (s) =>
      Object.values(s.result.byRuleSet).some(
        (r) =>
          r?.earliestDate &&
          Date.parse(r.earliestDate) - Date.parse(s.date) === 86_400_000,
      ),
  },
  {
    id: 'english-b2',
    name: { zhCN: '英语 B2', en: 'B2 in the folder' },
    description: {
      zhCN: '取得 B2 或更高英语证明。',
      en: 'Obtain B2 or higher English evidence.',
    },
    check: (s) =>
      !!s.timeline.english &&
      'cefrLevel' in s.timeline.english &&
      ['B2', 'C1', 'C2'].includes(s.timeline.english.cefrLevel),
  },
  {
    id: 'ten-year-veteran',
    name: { zhCN: '十年老兵', en: 'Ten-year veteran' },
    description: {
      zhCN: '写满四十季的日记。',
      en: 'Fill forty quarters of the diary.',
    },
    check: (s) => quarters(s) >= 40,
  },
  {
    id: 'ten-thousand',
    name: { zhCN: '存款过万', en: 'Five figures' },
    description: {
      zhCN: '年末或结局时余额达到一万英镑。',
      en: 'Hold at least ten thousand pounds at a year end or ending.',
    },
    check: (s) => s.stats.money >= 10000,
  },
  {
    id: 'no-overtime',
    name: { zhCN: '从不加班', en: 'Clocking off' },
    description: {
      zhCN: '度过二十季，从未选择加班。',
      en: 'Complete twenty quarters without choosing overtime.',
    },
    check: (s) => quarters(s) >= 20 && !s.flags.includes('worked-overtime'),
  },
  {
    id: 'three-moves',
    name: { zhCN: '搬过三次家', en: 'Three sets of keys' },
    description: {
      zhCN: '三次在事件里选定新住处。',
      en: 'Choose a new home in three events.',
    },
    check: (s) =>
      s.log.filter((e) => e.kind === 'event' && e.choiceId === 'move').length >=
      3,
  },
  {
    id: 'promotion',
    name: { zhCN: '工牌换了字', en: 'A new job title' },
    description: {
      zhCN: '通过事业积累获得一次升职。',
      en: 'Earn a promotion through career progress.',
    },
    check: (s) => s.flags.includes('promoted'),
  },
  {
    id: 'settled',
    name: { zhCN: '落款', en: 'A signed chapter' },
    description: {
      zhCN: '在游戏中申请定居并结束本局。',
      en: 'Finish by applying for settlement in the game.',
    },
    check: (s) => s.ending === 'settled',
  },
];
