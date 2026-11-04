import type { Locale, Route, RouteGroup } from '@uk-immigration/engine';

export const routeGroupNames = {
  CORE_PERMISSION: {
    'zh-CN': '核心许可 · Core Permission',
    en: 'Core Permission',
  },
  HIGH_TALENT: { 'zh-CN': '高技能人才 · High Talent', en: 'High Talent' },
  BRITISH_CONNECTION: {
    'zh-CN': '英国联系 · British Connection',
    en: 'British Connection',
  },
  FAMILY_AND_PRIVATE_LIFE: {
    'zh-CN': '家庭与私人生活 · Family and Private Life',
    en: 'Family and Private Life',
  },
  PROTECTION: { 'zh-CN': '保护类 · Protection', en: 'Protection' },
  NOT_COUNTING: { 'zh-CN': '不计入定居 · Not Counting', en: 'Not Counting' },
  OUTSIDE_FRAMEWORK: {
    'zh-CN': '框架外 · Outside Framework',
    en: 'Outside Framework',
  },
} satisfies Record<RouteGroup, Record<Locale, string>>;

export const routeNames = {
  MINISTER_OF_RELIGION: {
    'zh-CN': '宗教人士 · Minister of Religion',
    en: 'Minister of Religion',
  },
  SKILLED_WORKER: {
    'zh-CN': '技术工作者 · Skilled Worker',
    en: 'Skilled Worker',
  },
  UK_ANCESTRY: { 'zh-CN': '英国血统 · UK Ancestry', en: 'UK Ancestry' },
  GLOBAL_TALENT: { 'zh-CN': '全球人才 · Global Talent', en: 'Global Talent' },
  SCALE_UP: { 'zh-CN': '高增长企业工作者 · Scale-up', en: 'Scale-up' },
  INNOVATOR_FOUNDER: {
    'zh-CN': '创新创始人 · Innovator Founder',
    en: 'Innovator Founder',
  },
  INTERNATIONAL_SPORTSPERSON: {
    'zh-CN': '国际运动员 · International Sportsperson',
    en: 'International Sportsperson',
  },
  FAMILY_PARTNER_OR_PARENT: {
    'zh-CN': '家庭伴侣或父母 · Family Partner or Parent',
    en: 'Family Partner or Parent',
  },
  STATELESS: { 'zh-CN': '无国籍人士 · Stateless', en: 'Stateless' },
  FAMILY_AND_PRIVATE_LIFE: {
    'zh-CN': '家庭与私人生活 · Family and Private Life',
    en: 'Family and Private Life',
  },
  SAFE_AND_LEGAL: {
    'zh-CN': '安全合法保护路线 · Safe and Legal',
    en: 'Safe and Legal',
  },
  CORE_PROTECTION: {
    'zh-CN': '核心保护 · Core Protection',
    en: 'Core Protection',
  },
  PROTECTION_WORK_AND_STUDY: {
    'zh-CN': '保护工作与学习 · Protection Work and Study',
    en: 'Protection Work and Study',
  },
  VISIT: { 'zh-CN': '访问 · Visit', en: 'Visit' },
  STUDENT: { 'zh-CN': '学生 · Student', en: 'Student' },
  GLOBAL_BUSINESS_MOBILITY: {
    'zh-CN': '全球商务流动 · Global Business Mobility',
    en: 'Global Business Mobility',
  },
  TEMPORARY_WORKER: {
    'zh-CN': '临时工作者 · Temporary Worker',
    en: 'Temporary Worker',
  },
  YOUTH_MOBILITY: {
    'zh-CN': '青年流动 · Youth Mobility',
    en: 'Youth Mobility',
  },
  SEASONAL_WORKER: {
    'zh-CN': '季节性工作者 · Seasonal Worker',
    en: 'Seasonal Worker',
  },
  OVERSEAS_DOMESTIC_WORKER: {
    'zh-CN': '海外家庭雇员 · Overseas Domestic Worker',
    en: 'Overseas Domestic Worker',
  },
  GRADUATE: { 'zh-CN': '毕业生 · Graduate', en: 'Graduate' },
  HIGH_POTENTIAL_INDIVIDUAL: {
    'zh-CN': '高潜力人才 · High Potential Individual',
    en: 'High Potential Individual',
  },
  UKRAINE_SCHEME: {
    'zh-CN': '乌克兰计划 · Ukraine Scheme',
    en: 'Ukraine Scheme',
  },
  LEAVE_OUTSIDE_THE_RULES: {
    'zh-CN': '规则外许可 · Leave Outside the Rules',
    en: 'Leave Outside the Rules',
  },
  HONG_KONG_BNO: {
    'zh-CN': '香港英国国民（海外） · Hong Kong BN(O)',
    en: 'Hong Kong BN(O)',
  },
  AFGHAN_SCHEMES: {
    'zh-CN': '阿富汗计划 · Afghan Schemes',
    en: 'Afghan Schemes',
  },
  LEGACY_SAFE_AND_LEGAL: {
    'zh-CN': '原有安全合法路线 · Legacy Safe and Legal',
    en: 'Legacy Safe and Legal',
  },
  WINDRUSH: { 'zh-CN': '疾风计划 · Windrush', en: 'Windrush' },
  ARMED_FORCES: { 'zh-CN': '武装部队 · Armed Forces', en: 'Armed Forces' },
  BEREAVED_PARTNER: {
    'zh-CN': '丧偶伴侣 · Bereaved Partner',
    en: 'Bereaved Partner',
  },
  UNACCOMPANIED_ASYLUM_SEEKING_CHILD: {
    'zh-CN': '无人陪伴寻求庇护儿童 · Unaccompanied Asylum Seeking Child',
    en: 'Unaccompanied Asylum Seeking Child',
  },
  CHILD_IN_LOCAL_AUTHORITY_CARE: {
    'zh-CN': '地方政府照护儿童 · Child in Local Authority Care',
    en: 'Child in Local Authority Care',
  },
  GREW_UP_IN_UK: { 'zh-CN': '在英国成长 · Grew Up in UK', en: 'Grew Up in UK' },
  DOMESTIC_ABUSE_VICTIM: {
    'zh-CN': '家庭暴力受害者 · Domestic Abuse Victim',
    en: 'Domestic Abuse Victim',
  },
  OTHER: { 'zh-CN': '其他 · Other', en: 'Other' },
} satisfies Record<Route, Record<Locale, string>>;
