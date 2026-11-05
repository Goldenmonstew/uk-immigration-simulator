import { currentLaw2026_11 } from '@uk-immigration/policy-data';
import { balance as b } from './balance';
import type { Location, LocationAction } from './types';

export const locations: Location[] = [
  { id: 'home', name: { zhCN: '家', en: 'Home' } },
  { id: 'work', name: { zhCN: '公司', en: 'Work' } },
  { id: 'college', name: { zhCN: '语言学校', en: 'Language school' } },
  { id: 'gp', name: { zhCN: 'GP 诊所', en: 'GP surgery' } },
  { id: 'pub', name: { zhCN: '酒吧与公园', en: 'Pub and park' } },
  { id: 'council', name: { zhCN: '市政厅', en: 'Town hall' } },
  { id: 'visa', name: { zhCN: '签证中心', en: 'Visa centre' } },
  { id: 'station', name: { zhCN: '火车站 / 机场', en: 'Station / airport' } },
];
const fees = currentLaw2026_11.values;
/** Standard adult, non-ISL Skilled Worker only; duration is a game scenario. */
export const extensionCost =
  fees.skilledWorkerExtensionFeeInUk.value +
  fees.immigrationHealthSurchargePerYear.value * (b.extensionMonths / 12);

/** Dynamic evidence, renewal episode and calendar travel dates are filled by actions(). */
export const locationActions: LocationAction[] = [
  {
    id: 'rest',
    location: 'home',
    label: { zhCN: '休息', en: 'Rest' },
    effects: [
      { type: 'stat', key: 'mood', delta: b.restMood },
      { type: 'stat', key: 'health', delta: b.restHealth },
    ],
  },
  {
    id: 'mail',
    location: 'home',
    label: { zhCN: '收信', en: 'Check the post' },
    effects: [{ type: 'none' }],
  },
  {
    id: 'work',
    location: 'work',
    label: { zhCN: '上班', en: 'Work' },
    effects: [
      { type: 'money', delta: b.workMoney },
      { type: 'stat', key: 'career', delta: b.workCareer },
    ],
  },
  {
    id: 'overtime',
    location: 'work',
    label: { zhCN: '加班', en: 'Work overtime' },
    effects: [
      { type: 'money', delta: b.overtimeMoney },
      { type: 'stat', key: 'career', delta: b.overtimeCareer },
      { type: 'stat', key: 'mood', delta: b.overtimeMood },
      { type: 'stat', key: 'health', delta: b.overtimeHealth },
    ],
  },
  {
    id: 'class',
    location: 'college',
    label: { zhCN: '上课', en: 'Take a class' },
    effects: [
      { type: 'money', delta: -b.classCost },
      { type: 'stat', key: 'english', delta: b.classEnglish },
    ],
  },
  {
    id: 'exam',
    location: 'college',
    label: { zhCN: '参加英语考试', en: 'Take an English test' },
    effects: [{ type: 'none' }],
  },
  {
    id: 'gp',
    location: 'gp',
    label: { zhCN: '看病', en: 'See the GP' },
    effects: [{ type: 'stat', key: 'health', delta: b.gpHealth }],
  },
  {
    id: 'relax',
    location: 'pub',
    label: { zhCN: '放松', en: 'Relax' },
    effects: [
      { type: 'money', delta: -b.relaxCost },
      { type: 'stat', key: 'mood', delta: b.relaxMood },
    ],
  },
  {
    id: 'assessment',
    location: 'council',
    cost: 0,
    label: { zhCN: '查看两栏定居评估', en: 'Read both settlement assessments' },
    effects: [{ type: 'none' }],
  },
  {
    id: 'extend',
    location: 'visa',
    label: { zhCN: '续签', en: 'Extend permission' },
    when: [
      { route: 'SKILLED_WORKER' },
      { visaMonthsLeftMax: b.renewalWindowMonths },
    ],
    effects: [{ type: 'money', delta: -extensionCost }],
  },
  {
    id: 'settle',
    location: 'visa',
    label: { zhCN: '申请定居', en: 'Apply for settlement' },
    effects: [
      { type: 'money', delta: -fees.settlementApplicationFee.value },
      { type: 'ending', ending: 'settled' },
    ],
  },
  ...([1, 3, 6] as const).map((months): LocationAction => ({
    id: `travel-${months}`,
    location: 'station',
    label: {
      zhCN: `出国 ${months} 个月（归来）`,
      en: `Return from ${months} month(s) abroad`,
    },
    effects: [
      { type: 'money', delta: -b.travelCostPerMonth * months },
      { type: 'stat', key: 'mood', delta: b.travelMood },
    ],
  })),
  {
    id: 'leave',
    location: 'station',
    label: { zhCN: '离开英国', en: 'Leave the UK' },
    effects: [{ type: 'ending', ending: 'left' }],
  },
];
