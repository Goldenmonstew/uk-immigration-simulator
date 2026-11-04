import type { Route, RouteGroup } from '../routes';

// Display names for enum codes in user-facing text. The Chinese names follow
// apps/web/i18n/routes.ts; the English names are the original terms.

export interface DisplayName {
  'zh-CN': string;
  en: string;
}

export const routeGroupNames = {
  CORE_PERMISSION: { 'zh-CN': '核心许可', en: 'Core permission' },
  HIGH_TALENT: { 'zh-CN': '高技能人才', en: 'High talent' },
  BRITISH_CONNECTION: { 'zh-CN': '英国联系', en: 'British connection' },
  FAMILY_AND_PRIVATE_LIFE: {
    'zh-CN': '家庭与私人生活',
    en: 'Family and Private Life',
  },
  PROTECTION: { 'zh-CN': '保护类', en: 'Protection' },
  NOT_COUNTING: { 'zh-CN': '不计入定居', en: 'Not counting' },
  OUTSIDE_FRAMEWORK: { 'zh-CN': '框架外', en: 'Outside the framework' },
} satisfies Record<RouteGroup, DisplayName>;

export const routeNames = {
  MINISTER_OF_RELIGION: { 'zh-CN': '宗教人士', en: 'Minister of Religion' },
  SKILLED_WORKER: { 'zh-CN': '技术工作者', en: 'Skilled Worker' },
  UK_ANCESTRY: { 'zh-CN': '英国血统', en: 'UK Ancestry' },
  GLOBAL_TALENT: { 'zh-CN': '全球人才', en: 'Global Talent' },
  SCALE_UP: { 'zh-CN': '高增长企业工作者', en: 'Scale-up' },
  INNOVATOR_FOUNDER: { 'zh-CN': '创新创始人', en: 'Innovator Founder' },
  INTERNATIONAL_SPORTSPERSON: {
    'zh-CN': '国际运动员',
    en: 'International Sportsperson',
  },
  FAMILY_PARTNER_OR_PARENT: {
    'zh-CN': '家庭伴侣或父母',
    en: 'Family Partner or Parent',
  },
  STATELESS: { 'zh-CN': '无国籍人士', en: 'Stateless' },
  FAMILY_AND_PRIVATE_LIFE: {
    'zh-CN': '家庭与私人生活',
    en: 'Family and Private Life',
  },
  SAFE_AND_LEGAL: { 'zh-CN': '安全合法保护路线', en: 'Safe and Legal' },
  CORE_PROTECTION: { 'zh-CN': '核心保护', en: 'Core Protection' },
  PROTECTION_WORK_AND_STUDY: {
    'zh-CN': '保护工作与学习',
    en: 'Protection Work and Study',
  },
  VISIT: { 'zh-CN': '访问', en: 'Visit' },
  STUDENT: { 'zh-CN': '学生', en: 'Student' },
  GLOBAL_BUSINESS_MOBILITY: {
    'zh-CN': '全球商务流动',
    en: 'Global Business Mobility',
  },
  TEMPORARY_WORKER: { 'zh-CN': '临时工作者', en: 'Temporary Worker' },
  YOUTH_MOBILITY: { 'zh-CN': '青年流动', en: 'Youth Mobility' },
  SEASONAL_WORKER: { 'zh-CN': '季节性工作者', en: 'Seasonal Worker' },
  OVERSEAS_DOMESTIC_WORKER: {
    'zh-CN': '海外家庭雇员',
    en: 'Overseas Domestic Worker',
  },
  GRADUATE: { 'zh-CN': '毕业生', en: 'Graduate' },
  HIGH_POTENTIAL_INDIVIDUAL: {
    'zh-CN': '高潜力人才',
    en: 'High Potential Individual',
  },
  UKRAINE_SCHEME: { 'zh-CN': '乌克兰计划', en: 'Ukraine Scheme' },
  LEAVE_OUTSIDE_THE_RULES: {
    'zh-CN': '规则外许可',
    en: 'Leave Outside the Rules',
  },
  HONG_KONG_BNO: { 'zh-CN': '香港英国国民（海外）', en: 'Hong Kong BN(O)' },
  AFGHAN_SCHEMES: { 'zh-CN': '阿富汗计划', en: 'Afghan Schemes' },
  LEGACY_SAFE_AND_LEGAL: {
    'zh-CN': '原有安全合法路线',
    en: 'Legacy Safe and Legal',
  },
  WINDRUSH: { 'zh-CN': '疾风计划', en: 'Windrush' },
  ARMED_FORCES: { 'zh-CN': '武装部队', en: 'Armed Forces' },
  BEREAVED_PARTNER: { 'zh-CN': '丧偶伴侣', en: 'Bereaved Partner' },
  UNACCOMPANIED_ASYLUM_SEEKING_CHILD: {
    'zh-CN': '无人陪伴寻求庇护儿童',
    en: 'Unaccompanied Asylum Seeking Child',
  },
  CHILD_IN_LOCAL_AUTHORITY_CARE: {
    'zh-CN': '地方政府照护儿童',
    en: 'Child in Local Authority Care',
  },
  GREW_UP_IN_UK: { 'zh-CN': '在英国成长', en: 'Grew Up in UK' },
  DOMESTIC_ABUSE_VICTIM: {
    'zh-CN': '家庭暴力受害者',
    en: 'Domestic Abuse Victim',
  },
  OTHER: { 'zh-CN': '其他', en: 'Other' },
} satisfies Record<Route, DisplayName>;

// Keys match ImmigrationBreach['type'] in the engine.
export const breachTypeNames = {
  OVERSTAYING: { 'zh-CN': '逾期停留', en: 'Overstaying' },
  CONDITION_BREACH: { 'zh-CN': '违反签证条件', en: 'Breach of conditions' },
  DECEPTION: { 'zh-CN': '欺骗', en: 'Deception' },
  FRUSTRATING_CONTROLS: {
    'zh-CN': '妨碍移民管制',
    en: 'Frustrating immigration control',
  },
  ILLEGAL_ENTRY: { 'zh-CN': '非法入境', en: 'Illegal entry' },
} satisfies Record<string, DisplayName>;

// Keys match ImmigrationEpisode['resettlementScheme'] in the engine.
export const resettlementSchemeNames = {
  UK_RESETTLEMENT_SCHEME: {
    'zh-CN': '英国安置计划',
    en: 'UK Resettlement Scheme',
  },
  OTHER_DESIGNATED: {
    'zh-CN': '其他指定的安置或担保路线',
    en: 'Other designated resettlement or sponsorship route',
  },
} satisfies Record<string, DisplayName>;

// Keys match ImmigrationEpisode['sustainedActivity'] in the engine.
export const sustainedActivityNames = {
  WORK: { 'zh-CN': '工作', en: 'Work' },
  EDUCATION: { 'zh-CN': '教育', en: 'Education' },
  TRAINING: { 'zh-CN': '培训', en: 'Training' },
} satisfies Record<string, DisplayName>;

// Keys match PersonTimeline['asylumSupportRepayment'] in the engine.
export const asylumSupportRepaymentNames = {
  NOT_REQUIRED: {
    'zh-CN': '未领取或无需偿还',
    en: 'Not received, or not required to repay',
  },
  REPAID: { 'zh-CN': '已全额偿还', en: 'Repaid in full' },
  ON_PLAN: {
    'zh-CN': '按约定还款计划偿还中',
    en: 'Keeping up with an agreed repayment plan',
  },
  OUTSTANDING: { 'zh-CN': '未偿还', en: 'Outstanding' },
} satisfies Record<string, DisplayName>;
