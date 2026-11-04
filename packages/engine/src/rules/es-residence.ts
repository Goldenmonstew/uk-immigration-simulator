import {
  currentLaw2026_11 as cl,
  ROUTE_GROUPS,
} from '@uk-immigration/policy-data';
import type { Route, RouteGroup } from '@uk-immigration/policy-data';
import { fullYears } from '../dates';
import { continuousRun, episodeOn, restartAfterAbsences } from '../residence';
import type { Run } from '../residence';
import { defineRule, textFor } from '../rule';
import type { Lang } from '../rule';
import type { IsoDate, PersonTimeline, RuleContext } from '../types';

// Which routes count towards Earned Settlement and how long the person has
// been on them (SRC-001 Chapter 4, p22–p26).

const RULE_SET = 'earned-settlement-2026-11';

export function groupsOf(route: Route): readonly RouteGroup[] {
  return ROUTE_GROUPS[route];
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
    pendingDetails: ['PD-022', 'PD-023'],
  },
  ({ timeline, simulationDate, locale }) => {
    const L = textFor({ locale });
    const episode = episodeOn(timeline, simulationDate);
    if (!episode) {
      return {
        status: 'UNKNOWN',
        explanation: L(
          `未填写 ${simulationDate} 当日有效的签证。`,
          `No permission valid on ${simulationDate} provided.`,
        ),
      };
    }
    const { route } = episode;
    const groups = groupsOf(route);
    if (groups.includes('OUTSIDE_FRAMEWORK')) {
      return {
        status: 'UNKNOWN',
        explanation: L(
          `当前路线 ${route} 不在 Earned Settlement 框架内，继续按该群体现有的定居安排；但强化的犯罪记录与 B2 英语要求仍适用，除非有现有豁免或保障。`,
          `The current route ${route} is outside the Earned Settlement framework and keeps the existing settlement arrangements for that group. The strengthened criminality and B2 English requirements still apply, unless an existing exemption or protection applies.`,
        ),
      };
    }
    if (groups.includes('PROTECTION')) {
      return {
        status: 'UNKNOWN',
        explanation: L(
          `当前路线 ${route} 属保护类路线，定居路径另有规定（SRC-001 Chapter 7），本工具尚未建模。`,
          `The current route ${route} is a protection route with its own settlement pathway (SRC-001 Chapter 7), which this tool does not yet model.`,
        ),
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
          `当前路线 ${route} 是临时路线，不计入定居；转入计入的路线后才开始累计。`,
          `The current route ${route} is a temporary route and does not count towards settlement; time starts to count only after switching to a counting route.`,
        ),
      };
    }
    return {
      status: 'PASS',
      explanation:
        L(
          `当前路线 ${route} 属 ${groups.join(' / ')}，计入定居。`,
          `The current route ${route} is in ${groups.join(' / ')} and counts towards settlement.`,
        ) +
        (groups.includes('FAMILY_AND_PRIVATE_LIFE')
          ? L(
              'Family and Private Life 路线只能走 10 年或 20 年路径。',
              ' Family and Private Life routes can only use the 10 or 20-year pathways.',
            )
          : ''),
    };
  },
);

/** PROTECTION or OUTSIDE_FRAMEWORK for the episode on `date`, which short-circuit. */
export function esCurrentGroup(
  timeline: PersonTimeline,
  date: IsoDate,
): 'PROTECTION' | 'OUTSIDE_FRAMEWORK' | undefined {
  const episode = episodeOn(timeline, date);
  if (!episode) return undefined;
  const groups = groupsOf(episode.route);
  if (groups.includes('OUTSIDE_FRAMEWORK')) return 'OUTSIDE_FRAMEWORK';
  if (groups.includes('PROTECTION')) return 'PROTECTION';
  return undefined;
}

// Time on one kind of route cannot be combined with another (p25): work and
// family routes, human-rights routes (Family and Private Life), protection.
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
  const current = episodeOn(timeline, simulationDate);
  const kind = current && kindOf(current.route);
  if (!kind) return undefined;
  const run = continuousRun(
    timeline,
    simulationDate,
    (e) => kindOf(e.route) === kind,
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
  if (kindOf(route)) {
    return [
      L(
        `此前的 ${route} 与当前路线属不同类型（工作 / 家庭、人权、保护），时间不能合并，自 ${first.validFrom} 转入起重新起算。`,
        `The earlier ${route} is a different kind of route from the current one (work / family, human rights, protection); the time cannot be combined, and the count restarts from the switch on ${first.validFrom}.`,
      ),
      false,
    ];
  }
  if (route === 'LEAVE_OUTSIDE_THE_RULES' || groupsOf(route).length === 0) {
    return [
      L(
        `此前的 ${route} 时间是否计入未定，按不计入处理（PD-022 / PD-023）；若将来计入，日期可能提前。`,
        `Whether the earlier time on ${route} counts is not settled; it is treated as not counting (PD-022 / PD-023). If it later counts, the date may come earlier.`,
      ),
      true,
    ];
  }
  return [
    L(
      `此前的 ${route} 时间不计入定居；本工具假设不计入路线的时间同时打断连续居留，而不只是从合格期中扣除（PD-053）。`,
      `The earlier time on ${route} does not count towards settlement; this tool assumes that time on a non-counting route also breaks continuous residence, rather than only being deducted from the qualifying period (PD-053).`,
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
    pendingDetails: ['PD-022', 'PD-023', 'PD-025', 'PD-053', 'PD-054'],
  },
  (ctx) => {
    const { timeline, simulationDate } = ctx;
    const L = textFor(ctx);
    const current = episodeOn(timeline, simulationDate);
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
      const groups = groupsOf(current.route);
      if (
        groups.includes('NOT_COUNTING') &&
        current.route !== 'LEAVE_OUTSIDE_THE_RULES'
      ) {
        return {
          status: 'FAIL',
          explanation: L(
            `当前路线 ${current.route} 不计入定居，计入的居留为 0。`,
            `The current route ${current.route} does not count towards settlement, so the counting residence is 0.`,
          ),
        };
      }
      return groups.includes('OUTSIDE_FRAMEWORK')
        ? {
            status: 'UNKNOWN',
            explanation: L(
              `当前路线 ${current.route} 不在 Earned Settlement 框架内，不按本框架计算居留。`,
              `The current route ${current.route} is outside the Earned Settlement framework, so residence is not calculated under it.`,
            ),
          }
        : {
            status: 'UNKNOWN',
            explanation: L(
              `当前路线 ${current.route} 是否计入定居未定，无法计算居留。`,
              `Whether the current route ${current.route} counts towards settlement is not settled, so residence cannot be calculated.`,
            ),
            pendingDetails: [
              current.route === 'LEAVE_OUTSIDE_THE_RULES' ? 'PD-022' : 'PD-023',
            ],
          };
    }
    const { start, run } = residence;
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
          `Continuous residence counting towards settlement since ${start}: ${fullYears(start, simulationDate)} full years by ${simulationDate}.`,
        ),
        ...notes,
      ].join(L('', ' ')),
      assumptions,
    };
  },
);
