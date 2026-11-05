import type { Achievement, GameState } from './types';
const quarters = (s: GameState) =>
  s.log.filter((e) => e.kind === 'quarter').length;
// Achievement milestones are game goals, not legal eligibility tests.
export const achievements: Achievement[] = [
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
