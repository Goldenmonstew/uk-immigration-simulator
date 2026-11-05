// Temporary Phase 8.2 core. Delete in 8.4 when the real v2 API is connected.
// All money, stat changes and demo duration below are fictional game settings,
// not policy thresholds or application fees. Assessments still use the engine.
import {
  evaluate,
  type IsoDate,
  type Locale,
  type PersonTimeline,
  type RuleSetId,
  type SimulationResult,
} from '@uk-immigration/engine';
import { displayedRuleSets } from '../../lib/policy';

export type Text = { zhCN: string; en: string };
export type StatKey = 'money' | 'mood' | 'health' | 'english' | 'career';
export type LocationId =
  'home' | 'work' | 'college' | 'gp' | 'pub' | 'council' | 'visa' | 'station';
export type EndingId = 'left-uk' | 'time-limit';
export type Effect =
  | { type: 'stat'; key: StatKey; delta: number }
  | { type: 'money'; delta: number }
  | { type: 'english'; cefrLevel: 'B1' | 'B2' }
  | { type: 'ending'; ending: EndingId }
  | { type: 'none' };
export interface Choice {
  id: string;
  label: Text;
  effects: Effect[];
  sets?: string[];
  note?: Text;
}
export interface GameEvent {
  id: string;
  title: Text;
  text: Text;
  weight: number;
  once?: boolean;
  choices: Choice[];
}
export interface LocationAction {
  id: string;
  location: LocationId;
  label: Text;
  cost?: number;
  effects: Effect[];
}
export interface Character {
  id: string;
  name: Text;
  intro: Text;
  sprite: string;
  startDate: IsoDate;
  timeline: PersonTimeline;
  stats: Record<StatKey, number>;
  events: GameEvent[];
}
export interface LogEntry {
  year: number;
  quarter: 1 | 2 | 3 | 4;
  kind: 'action' | 'event' | 'quarter' | 'ending';
  id: string;
  choiceId?: string;
  text: Text;
  statDeltas?: Partial<Record<StatKey, number>>;
}
export interface GameState {
  version: 2;
  characterId: string;
  seed: number;
  locale: Locale;
  year: number;
  quarter: 1 | 2 | 3 | 4;
  date: IsoDate;
  timeline: PersonTimeline;
  stats: Record<StatKey, number>;
  actionsLeft: number;
  flags: string[];
  firedEvents: string[];
  pendingEvent?: string;
  log: LogEntry[];
  result: SimulationResult;
  ending?: EndingId;
  achievements: string[];
}
const text = (zhCN: string, en: string): Text => ({ zhCN, en });
export const statKeys: StatKey[] = [
  'money',
  'mood',
  'health',
  'english',
  'career',
];
export const locations: { id: LocationId; name: Text }[] = [
  { id: 'home', name: text('家', 'Home') },
  { id: 'work', name: text('公司', 'Work') },
  { id: 'college', name: text('语言学校', 'College') },
  { id: 'gp', name: text('GP 诊所', 'GP clinic') },
  { id: 'pub', name: text('酒吧与公园', 'Pub & park') },
  { id: 'council', name: text('市政厅', 'Town hall') },
  { id: 'visa', name: text('签证中心', 'Visa centre') },
  { id: 'station', name: text('火车站', 'Station') },
];
const events: GameEvent[] = [
  {
    id: 'parcel',
    weight: 1,
    once: true,
    title: text('隔壁的包裹', 'Next door’s parcel'),
    text: text(
      '替邻居收了个巨大的包裹。门铃响了，对方端着一盘饼干。',
      'You took in an enormous parcel for a neighbour. Now they are at the door with biscuits.',
    ),
    choices: [
      {
        id: 'tea',
        label: text('烧壶水，一起喝茶', 'Put the kettle on'),
        effects: [{ type: 'stat', key: 'mood', delta: 12 }],
        note: text('今天多认识一个人。', 'One more familiar face in town.'),
      },
      {
        id: 'rest',
        label: text(
          '收下饼干，早点休息',
          'Take the biscuits and get some rest',
        ),
        effects: [{ type: 'stat', key: 'health', delta: 8 }],
      },
    ],
  },
  {
    id: 'rain',
    weight: 1,
    once: true,
    title: text('雨停了五分钟', 'Five minutes without rain'),
    text: text(
      '午休刚出门，太阳就露脸了。同事已经在公园占好了长椅。',
      'The sun appears just as your lunch break starts. A colleague has saved you a park bench.',
    ),
    choices: [
      {
        id: 'picnic',
        label: text('带上三明治去公园', 'Bring a sandwich to the park'),
        effects: [
          { type: 'money', delta: -8 },
          { type: 'stat', key: 'mood', delta: 10 },
        ],
      },
      {
        id: 'walk',
        label: text('沿河走一圈', 'Walk along the river'),
        effects: [{ type: 'stat', key: 'health', delta: 10 }],
      },
    ],
  },
  {
    id: 'letter',
    weight: 1,
    once: true,
    title: text('信箱里的好消息', 'Good news in the letterbox'),
    text: text(
      '英语考试成绩到了。那段每天在公交车上背单词的日子，终于有了回音。',
      'Your English test result has arrived. All those bus rides spent learning vocabulary paid off.',
    ),
    choices: [
      {
        id: 'file',
        label: text('把 B2 证明归档', 'File the B2 certificate'),
        effects: [
          { type: 'english', cefrLevel: 'B2' },
          { type: 'stat', key: 'english', delta: 15 },
        ],
        note: text(
          '证明写入时间线，由引擎评估。',
          'The evidence enters the timeline for the engine to assess.',
        ),
      },
      {
        id: 'later',
        label: text('先放在桌上，晚点整理', 'Leave it on the desk for later'),
        effects: [{ type: 'stat', key: 'mood', delta: 5 }],
      },
    ],
  },
];
export const characters: Character[] = [
  {
    id: 'lin-yao',
    name: text('林遥', 'Yao Lin'),
    intro: text(
      '刚在小镇安顿下来的软件开发者。先找到家，再看看今天想去哪里。',
      'A software developer settling into town. Find your way home, then see where the day takes you.',
    ),
    sprite: '/game/assets/characters/1.png',
    startDate: '2026-01-15',
    stats: { money: 4200, mood: 65, health: 75, english: 40, career: 30 },
    events,
    timeline: {
      dateOfBirth: '1995-08-12',
      nationality: 'CHN',
      episodes: [
        {
          route: 'SKILLED_WORKER',
          role: 'MAIN',
          validFrom: '2024-01-15',
          validTo: '2027-01-14',
          salary: 38000,
          socCode: '2134',
        },
      ],
      absences: [],
      incomeYears: [
        { taxYear: '2024-25', earnings: 38000 },
        { taxYear: '2025-26', earnings: 38000 },
      ],
      benefits: [],
      relationships: [],
      english: { cefrLevel: 'B1' },
      criminalRecord: [],
      immigrationBreaches: [],
      governmentDebt: { outstanding: false },
    },
  },
];
export const achievements = [
  {
    id: 'first-year',
    title: text('小镇的四季', 'Four seasons in town'),
    description: text(
      '体验了小镇的第一个年头。',
      'You experienced your first year in town.',
    ),
  },
];
const actionList: LocationAction[] = [
  {
    id: 'rest',
    location: 'home',
    label: text('好好休息', 'Rest at home'),
    effects: [
      { type: 'stat', key: 'mood', delta: 12 },
      { type: 'stat', key: 'health', delta: 10 },
    ],
  },
  {
    id: 'work',
    location: 'work',
    label: text('上班', 'Go to work'),
    effects: [
      { type: 'money', delta: 180 },
      { type: 'stat', key: 'career', delta: 8 },
      { type: 'stat', key: 'mood', delta: -4 },
    ],
  },
  {
    id: 'overtime',
    location: 'work',
    label: text('多接一班', 'Work an extra shift'),
    effects: [
      { type: 'money', delta: 300 },
      { type: 'stat', key: 'mood', delta: -12 },
    ],
  },
  {
    id: 'class',
    location: 'college',
    label: text('上英语课', 'Take an English class'),
    cost: 60,
    effects: [{ type: 'stat', key: 'english', delta: 12 }],
  },
  {
    id: 'gp',
    location: 'gp',
    label: text('看医生', 'See the GP'),
    effects: [{ type: 'stat', key: 'health', delta: 20 }],
  },
  {
    id: 'pub',
    location: 'pub',
    label: text('和朋友坐一会儿', 'Catch up with friends'),
    cost: 15,
    effects: [{ type: 'stat', key: 'mood', delta: 18 }],
  },
  {
    id: 'visa',
    location: 'visa',
    label: text('整理申请材料', 'Organise your documents'),
    effects: [{ type: 'stat', key: 'career', delta: 3 }],
  },
  {
    id: 'leave',
    location: 'station',
    label: text('收拾行李，离开英国', 'Pack up and leave the UK'),
    effects: [{ type: 'ending', ending: 'left-uk' }],
  },
];
function assess(state: Pick<GameState, 'timeline' | 'date' | 'locale'>) {
  return evaluate({
    timeline: state.timeline,
    simulationDate: state.date,
    locale: state.locale,
  });
}
export function newGame(
  characterId: string,
  seed: number,
  locale: Locale = 'zh-CN',
): GameState {
  const character = characters.find((item) => item.id === characterId)!;
  const state = {
    version: 2 as const,
    characterId,
    seed,
    locale,
    year: 1,
    quarter: 1 as const,
    date: character.startDate,
    timeline: structuredClone(character.timeline),
    stats: { ...character.stats },
    actionsLeft: 2,
    flags: [],
    firedEvents: [],
    log: [],
    achievements: [],
  };
  return { ...state, result: assess(state) };
}
export function isOver(state: GameState) {
  return !!state.ending;
}
export function actions(state: GameState): LocationAction[] {
  return state.actionsLeft > 0 && !state.pendingEvent && !isOver(state)
    ? actionList
    : [];
}
export function currentEvent(state: GameState): GameEvent | undefined {
  return characters
    .find((item) => item.id === state.characterId)
    ?.events.find((event) => event.id === state.pendingEvent);
}
function apply(state: GameState, effects: Effect[]) {
  for (const effect of effects) {
    if (effect.type === 'stat')
      state.stats[effect.key] =
        effect.key === 'money'
          ? state.stats.money + effect.delta
          : Math.max(0, Math.min(100, state.stats[effect.key] + effect.delta));
    if (effect.type === 'money') state.stats.money += effect.delta;
    if (effect.type === 'english')
      state.timeline.english = { cefrLevel: effect.cefrLevel };
    if (effect.type === 'ending') state.ending = effect.ending;
  }
}
function logChange(
  before: GameState,
  after: GameState,
  entry: Omit<LogEntry, 'year' | 'quarter' | 'statDeltas'>,
) {
  const statDeltas = Object.fromEntries(
    statKeys.map((key) => [key, after.stats[key] - before.stats[key]]),
  );
  after.log.push({
    year: before.year,
    quarter: before.quarter,
    ...entry,
    statDeltas,
  });
}
export function act(state: GameState, actionId: string): GameState {
  const action = actions(state).find((item) => item.id === actionId);
  if (!action) return state;
  const next = structuredClone(state);
  next.actionsLeft--;
  next.stats.money -= action.cost ?? 0;
  apply(next, action.effects);
  logChange(state, next, { kind: 'action', id: action.id, text: action.label });
  const event = events[state.quarter - 1];
  if (!isOver(next) && event && !next.firedEvents.includes(event.id))
    next.pendingEvent = event.id;
  next.result = assess(next);
  return next;
}
export function resolve(state: GameState, choiceId: string): GameState {
  const event = currentEvent(state);
  const choice = event?.choices.find((item) => item.id === choiceId);
  if (!event || !choice) return state;
  const next = structuredClone(state);
  apply(next, choice.effects);
  next.pendingEvent = undefined;
  next.firedEvents.push(event.id);
  logChange(state, next, {
    kind: 'event',
    id: event.id,
    choiceId,
    text: choice.label,
  });
  next.result = assess(next);
  return next;
}
export function endQuarter(state: GameState): GameState {
  if (isOver(state) || state.pendingEvent) return state;
  const next = structuredClone(state);
  // Demo-only quarterly ledger. Real income and expense rules belong to 8.1.
  next.stats.money += 9500 - 9000;
  next.stats.mood = Math.max(0, next.stats.mood - 3);
  next.log.push(
    {
      year: state.year,
      quarter: state.quarter,
      kind: 'quarter',
      id: 'income',
      text: text('季度收入', 'Quarterly income'),
      statDeltas: { money: 9500 },
    },
    {
      year: state.year,
      quarter: state.quarter,
      kind: 'quarter',
      id: 'expenses',
      text: text('生活开销', 'Living expenses'),
      statDeltas: { money: -9000, mood: -3 },
    },
  );
  const date = new Date(`${state.date}T12:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() + 3);
  next.date = date.toISOString().slice(0, 10);
  next.quarter = ((state.quarter % 4) + 1) as GameState['quarter'];
  next.year += state.quarter === 4 ? 1 : 0;
  next.actionsLeft = 2;
  if (state.quarter === 4) {
    next.ending = 'time-limit';
    next.achievements = ['first-year'];
  }
  next.result = assess(next);
  return next;
}
export function visaMonthsLeft(state: GameState): number {
  const end = state.timeline.episodes.at(-1)!.validTo;
  const from = new Date(`${state.date}T12:00:00Z`);
  const to = new Date(`${end}T12:00:00Z`);
  return Math.max(
    0,
    (to.getUTCFullYear() - from.getUTCFullYear()) * 12 +
      to.getUTCMonth() -
      from.getUTCMonth() +
      (to.getUTCDate() > from.getUTCDate() ? 1 : 0),
  );
}
export function progress(state: GameState) {
  const start = new Date(state.timeline.episodes[0].validFrom).getTime();
  const now = new Date(state.date).getTime();
  return Object.fromEntries(
    displayedRuleSets.map(({ id }) => {
      const result = state.result.byRuleSet[id]!;
      const end = result.earliestDate
        ? new Date(result.earliestDate).getTime()
        : undefined;
      return [
        id,
        {
          outcome: result.outcome,
          earliestDate: result.earliestDate,
          percent: end
            ? Math.max(
                0,
                Math.min(
                  100,
                  Math.round(((now - start) / Math.max(1, end - start)) * 100),
                ),
              )
            : 0,
        },
      ];
    }),
  ) as Record<
    RuleSetId,
    {
      outcome: NonNullable<SimulationResult['byRuleSet'][RuleSetId]>['outcome'];
      earliestDate?: IsoDate;
      percent: number;
    }
  >;
}
export function narrative(state: GameState): Text[] {
  return [
    state.ending === 'left-uk'
      ? text(
          '火车缓缓驶出车站。你带着小镇的回忆，开始下一段生活。',
          'The train leaves the station. You take your memories of town into the next part of your life.',
        )
      : text(
          '四季过去了，小镇的路已经不用看地图。这个试玩故事到这里，你的生活还在继续。',
          'Four seasons later, you know the streets by heart. This preview ends here; your life carries on.',
        ),
    ...state.log
      .filter((entry) => entry.kind === 'event')
      .map((entry) => entry.text),
  ];
}
