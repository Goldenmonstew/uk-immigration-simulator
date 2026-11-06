import { currentLaw2026_11 } from '@uk-immigration/policy-data';
import type { Route } from '@uk-immigration/engine';
import { balance as b } from './balance';
import type { Activity, Place } from './types';

export const places: Place[] = [
  { id: 'home', name: { zhCN: '家', en: 'Home' }, kind: 'building' },
  {
    id: 'work',
    name: { zhCN: '公司', en: 'Work' },
    kind: 'building',
    hours: { opens: 540, closes: 1200, dayKinds: ['workday'] },
  },
  {
    id: 'college',
    name: { zhCN: '语言学校', en: 'Language school' },
    kind: 'building',
    hours: { opens: 540, closes: 1260 },
  },
  {
    id: 'library',
    name: { zhCN: '图书馆', en: 'Library' },
    kind: 'building',
    hours: { opens: 540, closes: 1080 },
  },
  {
    id: 'gp',
    name: { zhCN: 'GP 诊所', en: 'GP surgery' },
    kind: 'building',
    hours: { opens: 540, closes: 1020, dayKinds: ['workday'] },
  },
  {
    id: 'pub',
    name: { zhCN: '酒吧', en: 'Pub' },
    kind: 'building',
    hours: { opens: 720, closes: 1380 },
  },
  {
    id: 'cafe',
    name: { zhCN: '咖啡馆', en: 'Café' },
    kind: 'building',
    hours: { opens: 480, closes: 1080 },
  },
  {
    id: 'shop',
    name: { zhCN: '街角小店', en: 'Corner shop' },
    kind: 'building',
    hours: { opens: 480, closes: 1200 },
  },
  {
    id: 'council',
    name: { zhCN: '市政厅', en: 'Town hall' },
    kind: 'building',
    hours: { opens: 480, closes: 1200 },
  },
  {
    id: 'visa',
    name: { zhCN: '签证中心', en: 'Visa centre' },
    kind: 'building',
    hours: { opens: 480, closes: 1200 },
  },
  {
    id: 'station',
    name: { zhCN: '火车站', en: 'Station' },
    kind: 'building',
    hours: { opens: 420, closes: 1380 },
  },
  ...(['allotment', 'pond', 'board', 'green', 'bench'] as const).map(
    (id, i): Place => ({
      id,
      kind: 'outdoor',
      name: [
        { zhCN: '社区菜地', en: 'Allotment' },
        { zhCN: '公园池塘', en: 'Park pond' },
        { zhCN: '公告栏', en: 'Noticeboard' },
        { zhCN: '村绿地', en: 'Village green' },
        { zhCN: '长椅', en: 'Bench' },
      ][i],
    }),
  ),
];
const fees = currentLaw2026_11.values;
/** Standard adult, non-ISL Skilled Worker only; duration is a game scenario. */
export const extensionCost =
  fees.skilledWorkerExtensionFeeInUk.value +
  fees.immigrationHealthSurchargePerYear.value * (b.extensionMonths / 12);

// The two additional scenarios use the 30-month permission named in SRC-031
// (BN(O)) and SRC-024 D-LTRP.1.1 (partner); only the player is charged.
export function extensionFor(route: Route) {
  if (route === 'SKILLED_WORKER')
    return { months: b.extensionMonths, cost: extensionCost };
  const months = 30;
  if (route === 'HONG_KONG_BNO')
    return {
      months,
      cost:
        fees.hongKongBnoExtensionFee.value +
        (fees.immigrationHealthSurchargePerYear.value * months) / 12,
    };
  if (route === 'FAMILY_PARTNER_OR_PARENT')
    return {
      months,
      cost:
        fees.familyPartnerExtensionFee.value +
        (fees.immigrationHealthSurchargePerYear.value * months) / 12,
    };
  return undefined;
}

export const locationActions: Activity[] = [
  {
    id: 'rest',
    place: 'home',
    label: { zhCN: '休息', en: 'Rest' },
    minutes: b.minutes.rest,
    oncePerDay: true,
    effects: [
      { type: 'stat', key: 'mood', delta: b.restMood },
      { type: 'stat', key: 'health', delta: b.restHealth },
    ],
  },
  {
    id: 'nap',
    place: 'home',
    label: { zhCN: '午睡', en: 'Take a nap' },
    minutes: b.minutes.nap,
    oncePerDay: true,
    effects: [
      { type: 'stat', key: 'mood', delta: b.napMood },
      { type: 'stat', key: 'health', delta: b.napHealth },
    ],
  },
  ...(['home', 'library'] as const).map((place): Activity => ({
    id: `study-${place}`,
    place,
    label: { zhCN: '自学英语', en: 'Study English' },
    minutes: b.minutes.study,
    oncePerDay: true,
    effects: [{ type: 'stat', key: 'english', delta: b.studyEnglish }],
  })),
  {
    id: 'work',
    place: 'work',
    label: { zhCN: '上班', en: 'Work a shift' },
    minutes: b.minutes.work,
    oncePerDay: true,
    when: [{ dayKind: 'workday' }],
    effects: [
      { type: 'money', delta: b.workMoney },
      { type: 'stat', key: 'career', delta: b.workCareer },
    ],
  },
  {
    id: 'overtime',
    place: 'work',
    label: { zhCN: '加班', en: 'Work overtime' },
    minutes: b.minutes.overtime,
    oncePerDay: true,
    when: [{ dayKind: 'workday' }, { minuteMin: 1020 }],
    effects: [
      { type: 'money', delta: b.overtimeMoney },
      { type: 'stat', key: 'career', delta: b.overtimeCareer },
      { type: 'stat', key: 'mood', delta: b.overtimeMood },
      { type: 'stat', key: 'health', delta: b.overtimeHealth },
    ],
  },
  {
    id: 'class',
    place: 'college',
    label: { zhCN: '上课', en: 'Take a class' },
    minutes: b.minutes.class,
    oncePerDay: true,
    effects: [
      { type: 'money', delta: -b.classCost },
      { type: 'stat', key: 'english', delta: b.classEnglish },
    ],
  },
  {
    id: 'exam',
    place: 'college',
    label: { zhCN: '参加英语考试', en: 'Take an English test' },
    minutes: b.minutes.exam,
    oncePerDay: true,
    effects: [{ type: 'none' }],
  },
  {
    id: 'gp',
    place: 'gp',
    label: { zhCN: '看病', en: 'See the GP' },
    minutes: b.minutes.gp,
    oncePerDay: true,
    effects: [{ type: 'stat', key: 'health', delta: b.gpHealth }],
  },
  {
    id: 'relax',
    place: 'pub',
    label: { zhCN: '放松', en: 'Relax' },
    minutes: b.minutes.relax,
    oncePerDay: true,
    effects: [
      { type: 'money', delta: -b.relaxCost },
      { type: 'stat', key: 'mood', delta: b.relaxMood },
    ],
  },
  {
    id: 'coffee',
    place: 'cafe',
    label: { zhCN: '喝杯咖啡', en: 'Have a coffee' },
    minutes: b.minutes.coffee,
    oncePerDay: true,
    effects: [
      { type: 'money', delta: -b.coffeeCost },
      { type: 'stat', key: 'mood', delta: b.coffeeMood },
    ],
  },
  {
    id: 'bench',
    place: 'bench',
    label: { zhCN: '坐一会儿', en: 'Sit for a while' },
    minutes: b.minutes.bench,
    oncePerDay: true,
    effects: [{ type: 'stat', key: 'mood', delta: b.benchMood }],
  },
  {
    id: 'board',
    place: 'board',
    label: { zhCN: '看看公告', en: 'Read the notices' },
    minutes: b.minutes.board,
    oncePerDay: true,
    effects: [{ type: 'stat', key: 'mood', delta: b.boardMood }],
  },
  {
    id: 'rent-plot',
    place: 'allotment',
    label: { zhCN: '租下菜地', en: 'Rent an allotment' },
    minutes: b.minutes.rent,
    effects: [{ type: 'money', delta: -b.plotAnnualRent }],
  },
  {
    id: 'festival',
    place: 'green',
    label: { zhCN: '逛节日摊位', en: 'Join the festival' },
    minutes: b.minutes.festival,
    oncePerDay: true,
    when: [{ dayKind: 'special' }],
    effects: [{ type: 'stat', key: 'mood', delta: b.festivalMood }],
  },
  {
    id: 'assessment',
    place: 'council',
    label: { zhCN: '查看两栏定居评估', en: 'Read both settlement assessments' },
    minutes: 0,
    effects: [{ type: 'none' }],
  },
  {
    id: 'extend',
    place: 'visa',
    label: { zhCN: '续签', en: 'Extend permission' },
    minutes: b.minutes.paperwork,
    oncePerDay: true,
    when: [{ visaMonthsLeftMax: b.renewalWindowMonths }],
    effects: [{ type: 'money', delta: -extensionCost }],
  },
  {
    id: 'settle',
    place: 'visa',
    label: { zhCN: '申请定居', en: 'Apply for settlement' },
    minutes: b.minutes.paperwork,
    effects: [
      { type: 'money', delta: -fees.settlementApplicationFee.value },
      { type: 'ending', ending: 'settled' },
    ],
  },
  ...([1, 3, 6] as const).map((months): Activity => ({
    id: `travel-${months}`,
    place: 'station',
    label: {
      zhCN: `出国 ${months} 个月`,
      en: `Travel abroad for ${months} month(s)`,
    },
    minutes: 0,
    effects: [
      { type: 'money', delta: -b.travelCostPerMonth * months },
      { type: 'stat', key: 'mood', delta: b.travelMood },
    ],
  })),
  {
    id: 'leave',
    place: 'station',
    label: { zhCN: '离开英国', en: 'Leave the UK' },
    minutes: 0,
    effects: [{ type: 'ending', ending: 'left' }],
  },
];
