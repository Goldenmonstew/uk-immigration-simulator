import {
  currentLaw2026_11 as cl,
  ROUTE_GROUPS,
} from '@uk-immigration/policy-data';
import type { Route, RouteGroup } from '@uk-immigration/policy-data';
import { fullYears } from '../dates';
import { continuousRun, episodeOn, restartAfterAbsences } from '../residence';
import type { Run } from '../residence';
import { defineRule } from '../rule';
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
    sources: [
      { srcId: 'SRC-001', locator: 'p23' },
      { srcId: 'SRC-001', locator: 'p24' },
      { srcId: 'SRC-001', locator: 'p25' },
      { srcId: 'SRC-001', locator: 'p26' },
    ],
    pendingDetails: ['PD-022', 'PD-023', 'PD-055'],
  },
  ({ timeline, simulationDate }) => {
    const episode = episodeOn(timeline, simulationDate);
    if (!episode) {
      return {
        status: 'UNKNOWN',
        explanation: `未填写 ${simulationDate} 当日有效的签证。`,
      };
    }
    const { route } = episode;
    if (episode.role === 'DEPENDANT') {
      return {
        status: 'UNKNOWN',
        explanation: `当前以 ${route} 的 dependant 身份在英。dependant 随主申请人定居的规则与主申请人的信息尚未建模，不能按主申请人评估（PD-055）。`,
      };
    }
    const groups = groupsOf(route);
    if (groups.includes('OUTSIDE_FRAMEWORK')) {
      return {
        status: 'UNKNOWN',
        explanation: `当前路线 ${route} 不在 Earned Settlement 框架内，继续按该群体现有的定居安排；但强化的犯罪记录与 B2 英语要求仍适用，除非有现有豁免或保障。`,
      };
    }
    if (groups.includes('PROTECTION')) {
      return {
        status: 'UNKNOWN',
        explanation: `当前路线 ${route} 属保护类路线，定居路径另有规定（SRC-001 Chapter 7），本工具尚未建模。`,
      };
    }
    if (route === 'LEAVE_OUTSIDE_THE_RULES') {
      return {
        status: 'UNKNOWN',
        explanation:
          'Leave Outside the Rules 被列为不计入定居，但原文承认部分 LOTR 是否本意通向定居并不清楚，政府将另行公布做法。',
        pendingDetails: ['PD-022'],
      };
    }
    if (groups.length === 0) {
      return {
        status: 'UNKNOWN',
        explanation:
          '当前路线不在原文的"计入"或"不计入"清单中，无法判断是否计入定居。',
        pendingDetails: ['PD-023'],
      };
    }
    if (groups.includes('NOT_COUNTING')) {
      return {
        status: 'FAIL',
        explanation: `当前路线 ${route} 是临时路线，不计入定居；转入计入的路线后才开始累计。`,
      };
    }
    return {
      status: 'PASS',
      explanation:
        `当前路线 ${route} 属 ${groups.join(' / ')}，计入定居。` +
        (groups.includes('FAMILY_AND_PRIVATE_LIFE')
          ? 'Family and Private Life 路线只能走 10 年或 20 年路径。'
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
): [string, boolean] | undefined {
  const first = episodes[0];
  if (!stoppedAt) {
    return timeline.episodes.some((e) => e.validFrom < first.validFrom)
      ? [
          `${first.validFrom} 之前的许可与之不连续（空隙超过 1 天），按连续居留中断处理（PD-053）。`,
          true,
        ]
      : undefined;
  }
  const { route } = stoppedAt;
  if (kindOf(route)) {
    return [
      `此前的 ${route} 与当前路线属不同类型（工作 / 家庭、人权、保护），时间不能合并，自 ${first.validFrom} 转入起重新起算。`,
      false,
    ];
  }
  if (route === 'LEAVE_OUTSIDE_THE_RULES' || groupsOf(route).length === 0) {
    return [
      `此前的 ${route} 时间是否计入未定，按不计入处理（PD-022 / PD-023）；若将来计入，日期可能提前。`,
      true,
    ];
  }
  return [
    `此前的 ${route} 时间不计入定居；本工具假设不计入路线的时间同时打断连续居留，而不只是从合格期中扣除（PD-053）。`,
    true,
  ];
}

export const esResidence = defineRule(
  {
    id: 'ES-RESIDENCE',
    ruleSetId: RULE_SET,
    title: '计入定居的连续居留',
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
    const current = episodeOn(timeline, simulationDate);
    if (!current) {
      return {
        status: 'UNKNOWN',
        explanation: `未填写 ${simulationDate} 当日有效的签证，无法计算居留。`,
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
          explanation: `当前路线 ${current.route} 不计入定居，计入的居留为 0。`,
        };
      }
      return groups.includes('OUTSIDE_FRAMEWORK')
        ? {
            status: 'UNKNOWN',
            explanation: `当前路线 ${current.route} 不在 Earned Settlement 框架内，不按本框架计算居留。`,
          }
        : {
            status: 'UNKNOWN',
            explanation: `当前路线 ${current.route} 是否计入定居未定，无法计算居留。`,
            pendingDetails: [
              current.route === 'LEAVE_OUTSIDE_THE_RULES' ? 'PD-022' : 'PD-023',
            ],
          };
    }
    const { start, run } = residence;
    const notes: string[] = [];
    const assumptions: string[] = [];
    const why = whyRunStarts(timeline, run);
    if (why) {
      notes.push(why[0]);
      if (why[1]) assumptions.push(why[0]);
    }
    if (start > run.episodes[0].validFrom) {
      notes.push(
        `有缺席在任意 ${cl.values.continuousResidenceWindowMonths.value} 个月内超过 ${cl.values.continuousResidenceMaxAbsenceDays.value} 天，连续居留中断，自 ${start} 重新起算。`,
      );
    }
    if (timeline.absences.length > 0) {
      assumptions.push(
        `Earned Settlement 的缺席口径未公布，假设沿用现行 Appendix Continuous Residence CR 3.1（任意 ${cl.values.continuousResidenceWindowMonths.value} 个月不超过 ${cl.values.continuousResidenceMaxAbsenceDays.value} 天，出境与入境当日都计入缺席）（PD-054）。`,
      );
    }
    return {
      status: 'PASS',
      explanation: [
        `计入定居的连续居留自 ${start} 起，截至 ${simulationDate} 满 ${fullYears(start, simulationDate)} 年。`,
        ...notes,
      ].join(''),
      assumptions,
    };
  },
);
