import {
  careWorkerOccupations,
  earnedSettlement2026_11 as es,
} from '@uk-immigration/policy-data';
import { continuousRun, episodeOn } from '../residence';
import { defineRule } from '../rule';
import type { ImmigrationEpisode } from '../types';
import { gbp } from './es-contribution';

// One-off transitional arrangements (SRC-001 Chapter 8, p41–p45).

const isCareWorker = (e: ImmigrationEpisode) =>
  e.route === 'SKILLED_WORKER' &&
  careWorkerOccupations.occupations.some((o) => o.socCode === e.socCode);

export const esTransitionalCareWorker = defineRule(
  {
    id: 'ES-TRANSITIONAL-CARE-WORKER',
    ruleSetId: 'earned-settlement-2026-11',
    title: 'care worker 过渡安排（保留 5 年）',
    sources: [
      { srcId: 'SRC-001', locator: 'p42' },
      { srcId: 'SRC-001', locator: 'p43' },
      { srcId: 'SRC-012', locator: 'cover' },
      ...careWorkerOccupations.sources,
    ],
    pendingDetails: ['PD-035', 'PD-036'],
  },
  ({ timeline, simulationDate }) => {
    const current = episodeOn(timeline, simulationDate);
    if (!current || !isCareWorker(current)) {
      return {
        status: 'FAIL',
        explanation:
          '当前不是 care worker（SOC 2020 6135 / 6136）的 Skilled Worker 签证，不适用 care worker 过渡安排。',
      };
    }
    const cutoff = es.values.whitePaperPublished.value;
    const entered = continuousRun(timeline, simulationDate, isCareWorker)
      .episodes[0].validFrom;
    const assumptions = [
      `截止点取 Immigration White Paper 的发布日 ${cutoff}（PD-035）；"进入或转入该路线"按这段连续 care worker 许可的起始日判断，职业按 SOC 2020 6135 / 6136 认定（PD-036）。`,
    ];
    if (entered >= cutoff) {
      return timeline.episodes.some(
        (e) => isCareWorker(e) && e.validFrom < cutoff,
      )
        ? {
            status: 'UNKNOWN',
            explanation: `截止点 ${cutoff} 前曾是 care worker，但当前这段 care worker 许可自 ${entered} 起，是否仍属过渡群体未定。`,
            pendingDetails: ['PD-036'],
            assumptions,
          }
        : {
            status: 'FAIL',
            explanation: `自 ${entered} 起进入 care worker 路线，不早于 White Paper 发布日 ${cutoff}，不适用过渡安排，走标准 Earned Settlement 路径。`,
            assumptions,
          };
    }
    const threshold = es.values.careWorkerSalaryThreshold.value;
    if (current.salary === undefined) {
      return {
        status: 'UNKNOWN',
        explanation: `自 ${entered} 起在截止点前进入 care worker 路线；未填写薪资，无法判断是否达到 ${gbp(threshold)}。`,
        assumptions,
      };
    }
    if (current.salary < threshold) {
      return {
        status: 'FAIL',
        explanation: `薪资 ${gbp(current.salary)} 低于过渡安排要求的 ${gbp(threshold)}，满 5 年时不能凭此定居；可再申请一次 5 年 Health and Care 签证，之后再申请定居。`,
        assumptions,
      };
    }
    return {
      status: 'PASS',
      explanation: `自 ${entered} 起在截止点 ${cutoff} 前进入 care worker 路线，薪资 ${gbp(current.salary)} 达到 ${gbp(threshold)}，保留 5 年合格期；仍须满足犯罪记录、B2 英语等强化最低要求。`,
      assumptions: [
        ...assumptions,
        '过渡安排另要求满足担保与雇佣要求（p42），本工具未核实。',
      ],
    };
  },
);
