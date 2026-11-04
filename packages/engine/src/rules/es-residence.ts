import { ROUTE_GROUPS } from '@uk-immigration/policy-data';
import type { Route, RouteGroup } from '@uk-immigration/policy-data';
import { episodeOn } from '../residence';
import { defineRule } from '../rule';
import type { IsoDate, PersonTimeline } from '../types';

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
    pendingDetails: ['PD-022', 'PD-023'],
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
