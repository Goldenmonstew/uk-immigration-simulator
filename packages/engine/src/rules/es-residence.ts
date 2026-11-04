import {
  currentLaw2026_11 as cl,
  earnedSettlement2026_11 as es,
  ROUTE_GROUPS,
  routeGroupNames,
  routeNames,
} from '@uk-immigration/policy-data';
import type { Route, RouteGroup } from '@uk-immigration/policy-data';
import { fullYears, fullYearsEn } from '../dates';
import { continuousRun, episodeOn, restartAfterAbsences } from '../residence';
import type { Run } from '../residence';
import { defineRule, nameIn, textFor } from '../rule';
import type { Lang } from '../rule';
import type { IsoDate, PersonTimeline, RuleContext } from '../types';

// Which routes count towards Earned Settlement and how long the person has
// been on them (SRC-001 Chapter 4, p22–p26).

const RULE_SET = 'earned-settlement-2026-11';

export function groupsOf(route: Route): readonly RouteGroup[] {
  return ROUTE_GROUPS[route];
}

/**
 * The arrival date of a UK Resettlement Scheme refugee who arrived before
 * the legacy cut-off: Legacy Safe and Legal Routes, outside the framework
 * (SRC-001 p26 note 13). The arrival is the start of the continuous Safe and
 * Legal permission.
 */
export function legacyUkrsArrival(
  timeline: PersonTimeline,
  date: IsoDate,
): IsoDate | undefined {
  const episode = episodeOn(timeline, date);
  if (
    episode?.route !== 'SAFE_AND_LEGAL' ||
    episode.resettlementScheme !== 'UK_RESETTLEMENT_SCHEME'
  ) {
    return undefined;
  }
  const arrival = continuousRun(
    timeline,
    date,
    (e) => e.route === 'SAFE_AND_LEGAL',
  ).episodes[0].validFrom;
  return arrival < es.values.legacySafeAndLegalArrivalsBefore.value
    ? arrival
    : undefined;
}

/**
 * The route the person is on for Earned Settlement on `date`: the episode's
 * route, except that a legacy UK Resettlement Scheme arrival is on
 * LEGACY_SAFE_AND_LEGAL.
 */
export function esRouteOn(
  timeline: PersonTimeline,
  date: IsoDate,
): Route | undefined {
  const episode = episodeOn(timeline, date);
  if (!episode) return undefined;
  return legacyUkrsArrival(timeline, date)
    ? 'LEGACY_SAFE_AND_LEGAL'
    : episode.route;
}

/** The protection route the person is on, if any (SRC-001 Chapter 7). */
export function esProtectionRouteOn(
  timeline: PersonTimeline,
  date: IsoDate,
): Route | undefined {
  const route = esRouteOn(timeline, date);
  return route && groupsOf(route).includes('PROTECTION') ? route : undefined;
}

export const esRouteGroup = defineRule(
  {
    id: 'ES-ROUTE-GROUP',
    ruleSetId: RULE_SET,
    title: '当前路线计入定居',
    titleEn: 'Current route counts towards settlement',
    sources: [
      { srcId: 'SRC-001', locator: 'p23' },
      { srcId: 'SRC-001', locator: 'p24' },
      { srcId: 'SRC-001', locator: 'p25' },
      { srcId: 'SRC-001', locator: 'p26' },
    ],
    pendingDetails: ['PD-022', 'PD-023', 'PD-045'],
  },
  ({ timeline, simulationDate, locale }) => {
    const L = textFor({ locale });
    const route = esRouteOn(timeline, simulationDate);
    if (!route) {
      return {
        status: 'UNKNOWN',
        explanation: L(
          `未填写 ${simulationDate} 当日有效的签证。`,
          `No permission valid on ${simulationDate} provided.`,
        ),
      };
    }
    const groups = groupsOf(route);
    const rn = nameIn(L, routeNames[route]);
    const arrival = legacyUkrsArrival(timeline, simulationDate);
    if (arrival) {
      return {
        status: 'UNKNOWN',
        explanation: L(
          `经 UK Resettlement Scheme 于 ${arrival} 抵达，早于 ${es.values.legacySafeAndLegalArrivalsBefore.value}，属 Legacy Safe and Legal Routes（p26 注 13）：不在 Earned Settlement 框架内，继续按现有安排 5 年定居；但强化的犯罪记录与英语要求仍适用，除非有现有豁免或保障。`,
          `Arrived through the UK Resettlement Scheme on ${arrival}, before ${es.values.legacySafeAndLegalArrivalsBefore.value}, so on the Legacy Safe and Legal Routes (p26 note 13): outside the Earned Settlement framework, keeping settlement after five years under the existing arrangements. The strengthened criminality and English requirements still apply, unless an existing exemption or protection applies.`,
        ),
        sources: [{ srcId: 'SRC-001', locator: 'p26' }],
        assumptions: [
          L(
            `${es.values.legacySafeAndLegalArrivalsBefore.value} 前抵达的 UK Resettlement Scheme 难民须达 B2 还是 A2 英语，原文前后不一（PD-045）。`,
            `Whether UK Resettlement Scheme refugees who arrived before ${es.values.legacySafeAndLegalArrivalsBefore.value} need English at B2 or A2 is inconsistent in the response (PD-045).`,
          ),
        ],
      };
    }
    if (groups.includes('OUTSIDE_FRAMEWORK')) {
      return {
        status: 'UNKNOWN',
        explanation: L(
          `当前路线"${rn}"不在 Earned Settlement 框架内，继续按该群体现有的定居安排；但强化的犯罪记录与 B2 英语要求仍适用，除非有现有豁免或保障。`,
          `The current route, ${rn}, is outside the Earned Settlement framework and keeps the existing settlement arrangements for that group. The strengthened criminality and B2 English requirements still apply, unless an existing exemption or protection applies.`,
        ),
      };
    }
    if (groups.includes('PROTECTION')) {
      return {
        status: 'PASS',
        explanation: L(
          `当前路线"${rn}"属保护类分组，计入定居，按难民定居路径（Table 2）计算；保护类时间不能与工作、家庭路线的时间合并（p25）。`,
          `The current route, ${rn}, is in the Protection group and counts towards settlement under the refugee pathways (Table 2); time on protection routes cannot be combined with time on work or family routes (p25).`,
        ),
        sources: [
          { srcId: 'SRC-001', locator: 'p25' },
          { srcId: 'SRC-001', locator: 'p47' },
          { srcId: 'SRC-001', locator: 'p48' },
        ],
      };
    }
    if (route === 'LEAVE_OUTSIDE_THE_RULES') {
      return {
        status: 'UNKNOWN',
        explanation: L(
          'Leave Outside the Rules 被列为不计入定居，但原文承认部分 LOTR 是否本意通向定居并不清楚，政府将另行公布做法。',
          'Leave Outside the Rules is listed as not counting towards settlement, but the response accepts it is unclear whether some LOTR was intended to lead to settlement; the government will set out its approach separately.',
        ),
        pendingDetails: ['PD-022'],
      };
    }
    if (groups.length === 0) {
      return {
        status: 'UNKNOWN',
        explanation: L(
          '当前路线不在原文的"计入"或"不计入"清单中，无法判断是否计入定居。',
          'The current route is on neither the “counting” nor the “not counting” list in the response, so whether it counts towards settlement cannot be determined.',
        ),
        pendingDetails: ['PD-023'],
      };
    }
    if (groups.includes('NOT_COUNTING')) {
      return {
        status: 'FAIL',
        explanation: L(
          `当前路线"${rn}"是临时路线，不计入定居；转入计入的路线后才开始累计。`,
          `The current route, ${rn}, is a temporary route and does not count towards settlement; time starts to count only after switching to a counting route.`,
        ),
      };
    }
    const groupNames = groups
      .map((g) => nameIn(L, routeGroupNames[g]))
      .join(' / ');
    return {
      status: 'PASS',
      explanation:
        L(
          `当前路线"${rn}"属${groupNames}分组，计入定居。`,
          `The current route, ${rn}, is in the ${groupNames} group${groups.length > 1 ? 's' : ''} and counts towards settlement.`,
        ) +
        (groups.includes('FAMILY_AND_PRIVATE_LIFE')
          ? L(
              `${nameIn(L, routeGroupNames.FAMILY_AND_PRIVATE_LIFE)}路线只能走 10 年或 20 年路径。`,
              ' Family and Private Life routes can only use the 10 or 20-year pathways.',
            )
          : ''),
    };
  },
);

/** PROTECTION or OUTSIDE_FRAMEWORK for the route on `date` (see esRouteOn). */
export function esCurrentGroup(
  timeline: PersonTimeline,
  date: IsoDate,
): 'PROTECTION' | 'OUTSIDE_FRAMEWORK' | undefined {
  const route = esRouteOn(timeline, date);
  if (!route) return undefined;
  const groups = groupsOf(route);
  if (groups.includes('OUTSIDE_FRAMEWORK')) return 'OUTSIDE_FRAMEWORK';
  if (groups.includes('PROTECTION')) return 'PROTECTION';
  return undefined;
}

// Time on one kind of route cannot be combined with another (p25): work and
// family routes, human-rights routes (Family and Private Life), protection.
// Within protection only the same route counts: time on Core Protection does
// not count towards Protection Work and Study (p38, p40 Individual B).
type Kind = 'WORK_OR_FAMILY' | 'HUMAN_RIGHTS' | 'PROTECTION';

function kindOf(route: Route): Kind | undefined {
  const groups = groupsOf(route);
  if (
    groups.length === 0 ||
    groups.includes('NOT_COUNTING') ||
    groups.includes('OUTSIDE_FRAMEWORK')
  ) {
    return undefined;
  }
  if (groups.includes('PROTECTION')) return 'PROTECTION';
  if (groups.includes('FAMILY_AND_PRIVATE_LIFE')) return 'HUMAN_RIGHTS';
  return 'WORK_OR_FAMILY';
}

export interface QualifyingResidence {
  /** Start of the qualifying period after any restart. */
  start: IsoDate;
  run: Run;
}

/** The qualifying residence on `date`, or undefined if the current route does not count. */
export function esQualifyingResidence({
  timeline,
  simulationDate,
}: RuleContext): QualifyingResidence | undefined {
  const route = esRouteOn(timeline, simulationDate);
  const kind = route && kindOf(route);
  if (!kind) return undefined;
  const run = continuousRun(timeline, simulationDate, (e) =>
    kind === 'PROTECTION' ? e.route === route : kindOf(e.route) === kind,
  );
  const start = restartAfterAbsences(
    run.episodes[0].validFrom,
    simulationDate,
    timeline.absences,
    {
      maxDays: cl.values.continuousResidenceMaxAbsenceDays.value,
      windowMonths: cl.values.continuousResidenceWindowMonths.value,
    },
  );
  return { start, run };
}

/** Why the run starts where it does: [explanation, is it an assumption]. */
function whyRunStarts(
  timeline: PersonTimeline,
  { episodes, stoppedAt }: Run,
  L: Lang,
): [string, boolean] | undefined {
  const first = episodes[0];
  if (!stoppedAt) {
    return timeline.episodes.some((e) => e.validFrom < first.validFrom)
      ? [
          L(
            `${first.validFrom} 之前的许可与之不连续（空隙超过 1 天），按连续居留中断处理（PD-053）。`,
            `Earlier permission is not continuous with the permission from ${first.validFrom} (a gap of more than 1 day), so continuous residence is treated as broken (PD-053).`,
          ),
          true,
        ]
      : undefined;
  }
  const { route } = stoppedAt;
  const rn = nameIn(L, routeNames[route]);
  if (kindOf(route) === 'PROTECTION' && kindOf(first.route) === 'PROTECTION') {
    return [
      L(
        `此前在"${rn}"路线的时间不计入当前保护类路线的合格期，自 ${first.validFrom} 转入起重新起算（p38；p40 Individual B）。`,
        `Earlier time on ${rn} does not count towards the qualifying period of the current protection route; the count restarts from the move on ${first.validFrom} (p38; p40 Individual B).`,
      ),
      false,
    ];
  }
  if (kindOf(route)) {
    return [
      L(
        `此前的"${rn}"路线与当前路线属不同类型（工作 / 家庭、人权、保护），时间不能合并，自 ${first.validFrom} 转入起重新起算。`,
        `The earlier ${rn} permission is a different kind of route from the current one (work / family, human rights, protection); the time cannot be combined, and the count restarts from the switch on ${first.validFrom}.`,
      ),
      false,
    ];
  }
  if (route === 'LEAVE_OUTSIDE_THE_RULES' || groupsOf(route).length === 0) {
    return [
      L(
        `此前在"${rn}"路线的时间是否计入未定，按不计入处理（PD-022 / PD-023）；若将来计入，日期可能提前。`,
        `Whether the earlier time on ${rn} counts is not settled; it is treated as not counting (PD-022 / PD-023). If it later counts, the date may come earlier.`,
      ),
      true,
    ];
  }
  return [
    L(
      `此前在"${rn}"路线的时间不计入定居；本工具假设不计入路线的时间同时打断连续居留，而不只是从合格期中扣除（PD-053）。`,
      `The earlier time on ${rn} does not count towards settlement; this tool assumes that time on a non-counting route also breaks continuous residence, rather than only being deducted from the qualifying period (PD-053).`,
    ),
    true,
  ];
}

export const esResidence = defineRule(
  {
    id: 'ES-RESIDENCE',
    ruleSetId: RULE_SET,
    title: '计入定居的连续居留',
    titleEn: 'Continuous residence counting towards settlement',
    sources: [
      { srcId: 'SRC-001', locator: 'p22' },
      { srcId: 'SRC-001', locator: 'p23' },
      { srcId: 'SRC-001', locator: 'p24' },
      { srcId: 'SRC-001', locator: 'p25' },
      { srcId: 'SRC-008', locator: 'CR 3.1' },
    ],
    pendingDetails: [
      'PD-022',
      'PD-023',
      'PD-025',
      'PD-053',
      'PD-054',
      'PD-064',
    ],
  },
  (ctx) => {
    const { timeline, simulationDate } = ctx;
    const L = textFor(ctx);
    const current = esRouteOn(timeline, simulationDate);
    if (!current) {
      return {
        status: 'UNKNOWN',
        explanation: L(
          `未填写 ${simulationDate} 当日有效的签证，无法计算居留。`,
          `No permission valid on ${simulationDate} provided, so residence cannot be calculated.`,
        ),
      };
    }
    const residence = esQualifyingResidence(ctx);
    if (!residence) {
      const groups = groupsOf(current);
      const rn = nameIn(L, routeNames[current]);
      if (
        groups.includes('NOT_COUNTING') &&
        current !== 'LEAVE_OUTSIDE_THE_RULES'
      ) {
        return {
          status: 'FAIL',
          explanation: L(
            `当前路线"${rn}"不计入定居，计入的居留为 0。`,
            `The current route, ${rn}, does not count towards settlement, so the counting residence is 0.`,
          ),
        };
      }
      return groups.includes('OUTSIDE_FRAMEWORK')
        ? {
            status: 'UNKNOWN',
            explanation: L(
              `当前路线"${rn}"不在 Earned Settlement 框架内，不按本框架计算居留。`,
              `The current route, ${rn}, is outside the Earned Settlement framework, so residence is not calculated under it.`,
            ),
          }
        : {
            status: 'UNKNOWN',
            explanation: L(
              `当前路线"${rn}"是否计入定居未定，无法计算居留。`,
              `Whether the current route, ${rn}, counts towards settlement is not settled, so residence cannot be calculated.`,
            ),
            pendingDetails: [
              current === 'LEAVE_OUTSIDE_THE_RULES' ? 'PD-022' : 'PD-023',
            ],
          };
    }
    const { start, run } = residence;
    if (
      current === 'CORE_PROTECTION' &&
      run.stoppedAt?.route === 'PROTECTION_WORK_AND_STUDY'
    ) {
      return {
        status: 'UNKNOWN',
        explanation: L(
          `自 ${run.episodes[0].validFrom} 起从 Protection Work and Study 回到 Core Protection。原文只说 Core Protection 的时间不计入 Protection Work and Study，没有说回到 Core Protection 后此前的时间如何计入。`,
          `Back on Core Protection from Protection Work and Study since ${run.episodes[0].validFrom}. The response only says that time on Core Protection does not count towards Protection Work and Study; it does not say how earlier time counts after moving back to Core Protection.`,
        ),
        sources: [{ srcId: 'SRC-001', locator: 'p38' }],
        pendingDetails: ['PD-064'],
      };
    }
    const notes: string[] = [];
    const assumptions: string[] = [];
    const why = whyRunStarts(timeline, run, L);
    if (why) {
      notes.push(why[0]);
      if (why[1]) assumptions.push(why[0]);
    }
    if (start > run.episodes[0].validFrom) {
      notes.push(
        L(
          `有缺席在任意 ${cl.values.continuousResidenceWindowMonths.value} 个月内超过 ${cl.values.continuousResidenceMaxAbsenceDays.value} 天，连续居留中断，自 ${start} 重新起算。`,
          `Absences exceed ${cl.values.continuousResidenceMaxAbsenceDays.value} days in a ${cl.values.continuousResidenceWindowMonths.value}-month period, so continuous residence is broken and restarts from ${start}.`,
        ),
      );
    }
    if (timeline.absences.length > 0) {
      assumptions.push(
        L(
          `Earned Settlement 的缺席口径未公布，假设沿用现行 Appendix Continuous Residence CR 3.1（任意 ${cl.values.continuousResidenceWindowMonths.value} 个月不超过 ${cl.values.continuousResidenceMaxAbsenceDays.value} 天，出境与入境当日都计入缺席）（PD-054）。`,
          `How absences count under Earned Settlement has not been published; assumed to follow the current Appendix Continuous Residence CR 3.1 (no more than ${cl.values.continuousResidenceMaxAbsenceDays.value} days in any ${cl.values.continuousResidenceWindowMonths.value}-month period, with the days of departure and return both counted as absence) (PD-054).`,
        ),
      );
    }
    return {
      status: 'PASS',
      explanation: [
        L(
          `计入定居的连续居留自 ${start} 起，截至 ${simulationDate} 满 ${fullYears(start, simulationDate)} 年。`,
          `Continuous residence counting towards settlement since ${start}: ${fullYearsEn(start, simulationDate)} by ${simulationDate}.`,
        ),
        ...notes,
      ].join(L('', ' ')),
      assumptions,
    };
  },
);
