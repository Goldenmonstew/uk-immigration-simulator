import type { SourceRef } from './types';

// Earned Settlement route groups, built from SRC-001 (CP 1707). Page numbers
// are physical PDF pages.
export type RouteGroup =
  | 'CORE_PERMISSION'
  | 'HIGH_TALENT'
  | 'BRITISH_CONNECTION'
  | 'FAMILY_AND_PRIVATE_LIFE'
  | 'PROTECTION'
  | 'NOT_COUNTING'
  | 'OUTSIDE_FRAMEWORK';

export const ROUTE_GROUP_SOURCES: Record<RouteGroup, SourceRef[]> = {
  CORE_PERMISSION: [{ srcId: 'SRC-001', locator: 'p23 fn 9' }],
  HIGH_TALENT: [{ srcId: 'SRC-001', locator: 'p23 fn 10' }],
  BRITISH_CONNECTION: [{ srcId: 'SRC-001', locator: 'p18' }],
  // Counts towards settlement but only via the 10 or 20-year pathways (p23–p24).
  // As an Article 8 route it is a "human-rights route" for the p25 rule that
  // such time cannot be combined with work or family time.
  FAMILY_AND_PRIVATE_LIFE: [
    { srcId: 'SRC-001', locator: 'p23' },
    { srcId: 'SRC-001', locator: 'p24' },
    { srcId: 'SRC-001', locator: 'p25' },
  ],
  PROTECTION: [
    { srcId: 'SRC-001', locator: 'p23' },
    { srcId: 'SRC-001', locator: 'p25' },
    { srcId: 'SRC-001', locator: 'p37' },
    { srcId: 'SRC-001', locator: 'p38' },
  ],
  NOT_COUNTING: [{ srcId: 'SRC-001', locator: 'p24' }],
  OUTSIDE_FRAMEWORK: [
    { srcId: 'SRC-001', locator: 'p25' },
    { srcId: 'SRC-001', locator: 'p26' },
  ],
};

// A route can sit in more than one group (Skilled Worker is both core and
// high talent permission).
export const ROUTE_GROUPS = {
  // Core permission (p23 fn 9); the high talent subset is p23 fn 10.
  MINISTER_OF_RELIGION: ['CORE_PERMISSION'],
  SKILLED_WORKER: ['CORE_PERMISSION', 'HIGH_TALENT'],
  UK_ANCESTRY: ['CORE_PERMISSION', 'BRITISH_CONNECTION'],
  GLOBAL_TALENT: ['CORE_PERMISSION', 'HIGH_TALENT'],
  SCALE_UP: ['CORE_PERMISSION', 'HIGH_TALENT'],
  INNOVATOR_FOUNDER: ['CORE_PERMISSION', 'HIGH_TALENT'],
  INTERNATIONAL_SPORTSPERSON: ['CORE_PERMISSION', 'HIGH_TALENT'],
  // "Family – Partner, Family – Partner/Parent (excluding Article 8 ECHR
  // cases)". British connection only where the sponsor is a British citizen
  // (p18), which the rules check against Relationship.
  FAMILY_PARTNER_OR_PARENT: ['CORE_PERMISSION', 'BRITISH_CONNECTION'],
  STATELESS: ['CORE_PERMISSION'],

  FAMILY_AND_PRIVATE_LIFE: ['FAMILY_AND_PRIVATE_LIFE'],

  SAFE_AND_LEGAL: ['PROTECTION'],
  CORE_PROTECTION: ['PROTECTION'],
  PROTECTION_WORK_AND_STUDY: ['PROTECTION'],

  // p24
  VISIT: ['NOT_COUNTING'],
  STUDENT: ['NOT_COUNTING'],
  GLOBAL_BUSINESS_MOBILITY: ['NOT_COUNTING'],
  TEMPORARY_WORKER: ['NOT_COUNTING'],
  YOUTH_MOBILITY: ['NOT_COUNTING'],
  SEASONAL_WORKER: ['NOT_COUNTING'],
  OVERSEAS_DOMESTIC_WORKER: ['NOT_COUNTING'],
  GRADUATE: ['NOT_COUNTING'],
  HIGH_POTENTIAL_INDIVIDUAL: ['NOT_COUNTING'],
  UKRAINE_SCHEME: ['NOT_COUNTING'],
  // Listed as not counting, but p24 fn 12 says treatment is still to be decided.
  LEAVE_OUTSIDE_THE_RULES: ['NOT_COUNTING'],

  // p25–p26
  HONG_KONG_BNO: ['OUTSIDE_FRAMEWORK'],
  AFGHAN_SCHEMES: ['OUTSIDE_FRAMEWORK'],
  LEGACY_SAFE_AND_LEGAL: ['OUTSIDE_FRAMEWORK'],
  WINDRUSH: ['OUTSIDE_FRAMEWORK'],
  ARMED_FORCES: ['OUTSIDE_FRAMEWORK'],
  BEREAVED_PARTNER: ['OUTSIDE_FRAMEWORK'],
  UNACCOMPANIED_ASYLUM_SEEKING_CHILD: ['OUTSIDE_FRAMEWORK'],
  CHILD_IN_LOCAL_AUTHORITY_CARE: ['OUTSIDE_FRAMEWORK'],
  GREW_UP_IN_UK: ['OUTSIDE_FRAMEWORK'],
  DOMESTIC_ABUSE_VICTIM: ['OUTSIDE_FRAMEWORK'],

  // Any route not listed above; the engine cannot classify it.
  OTHER: [],
} as const satisfies Record<string, readonly RouteGroup[]>;

export type Route = keyof typeof ROUTE_GROUPS;
