import { episodeOn } from '../residence';
import { defineRule } from '../rule';
import type { ImmigrationEpisode, PersonTimeline, IsoDate } from '../types';

// Current Immigration Rules, modelled for Skilled Worker settlement (SRC-004)
// and Long Residence (SRC-005) only.

const RULE_SET = 'current-law-2026-11';

const isSkilledWorker = (e: ImmigrationEpisode) =>
  e.route === 'SKILLED_WORKER' && e.role === 'MAIN';

export function onSkilledWorker(
  timeline: PersonTimeline,
  date: IsoDate,
): boolean {
  const current = episodeOn(timeline, date);
  return current !== undefined && isSkilledWorker(current);
}

export const clScope = defineRule(
  {
    id: 'CL-SCOPE',
    ruleSetId: RULE_SET,
    title: '在现行规则的建模范围内',
    sources: [{ srcId: 'SRC-004', locator: 'SW 21.1' }],
    pendingDetails: [],
  },
  ({ timeline, simulationDate }) =>
    onSkilledWorker(timeline, simulationDate)
      ? {
          status: 'PASS',
          explanation:
            '当前持 Skilled Worker 主申请人许可，按 Appendix Skilled Worker 评估。',
        }
      : {
          status: 'UNKNOWN',
          explanation:
            '现行规则只建模了 Skilled Worker（主申请人）与 Long Residence；当前路线不是 Skilled Worker 主申请人，也不满足 Long Residence 的 10 年，无法判断其他路线的定居条件。',
        },
);
