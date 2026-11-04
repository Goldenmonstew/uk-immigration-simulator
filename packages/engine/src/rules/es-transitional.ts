import {
  careWorkerOccupations,
  earnedSettlement2026_11 as es,
  healthEducationTransitionalExamples,
  nationalPayScaleBelowRqf6Occupations,
} from '@uk-immigration/policy-data';
import { continuousRun, episodeOn } from '../residence';
import { defineRule } from '../rule';
import type { ImmigrationEpisode } from '../types';
import { gbp } from './es-contribution';

// One-off transitional arrangements (SRC-001 Chapter 8, p41–p45).

const CARE_CODES = careWorkerOccupations.occupations
  .map((o) => o.socCode)
  .join(' / ');

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
        explanation: `当前不是 care worker（SOC 2020 ${CARE_CODES}）的 Skilled Worker 签证，不适用 care worker 过渡安排。`,
      };
    }
    const cutoff = es.values.whitePaperPublished.value;
    const entered = continuousRun(timeline, simulationDate, isCareWorker)
      .episodes[0].validFrom;
    const assumptions = [
      `截止点取 Immigration White Paper 的发布日 ${cutoff}（PD-035）；"进入或转入该路线"按这段连续 care worker 许可的起始日判断，职业按 SOC 2020 ${CARE_CODES} 认定（PD-036）。`,
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

const inList = (list: { socCode: string }[], soc: string | undefined) =>
  soc !== undefined && list.some((o) => o.socCode === soc);

const EXAMPLES = healthEducationTransitionalExamples.occupations;

export const esTransitionalHealthEducation = defineRule(
  {
    id: 'ES-TRANSITIONAL-HEALTH-EDUCATION',
    ruleSetId: 'earned-settlement-2026-11',
    title: 'RQF6 以下国家薪级医疗 / 教育岗位过渡安排（保留 5 年）',
    sources: [
      { srcId: 'SRC-001', locator: 'p44' },
      { srcId: 'SRC-001', locator: 'p42' },
      { srcId: 'SRC-001', locator: 'p46' },
      { srcId: 'SRC-012', locator: 'cover' },
      ...nationalPayScaleBelowRqf6Occupations.sources,
    ],
    pendingDetails: ['PD-038', 'PD-039'],
  },
  ({ timeline, simulationDate }) => {
    const current = episodeOn(timeline, simulationDate);
    const soc = current?.socCode;
    if (
      current?.route !== 'SKILLED_WORKER' ||
      current.role !== 'MAIN' ||
      !inList(nationalPayScaleBelowRqf6Occupations.occupations, soc)
    ) {
      return {
        status: 'FAIL',
        explanation:
          '当前不是 RQF6 以下、国家薪级的医疗 / 教育职业（Appendix Skilled Occupations Table 3a）的 Skilled Worker 签证，不适用该过渡安排。',
      };
    }
    const examples = EXAMPLES.map((o) => `${o.title}（${o.socCode}）`).join(
      '、',
    );
    if (!inList(EXAMPLES, soc)) {
      return {
        status: 'UNKNOWN',
        explanation: `SOC ${soc} 属 Table 3a 的 RQF6 以下国家薪级职业，但原文只举了 ${examples} 两例，是否适用未定。`,
        pendingDetails: ['PD-038'],
      };
    }
    const cutoff = es.values.whitePaperPublished.value;
    const inJob = continuousRun(
      timeline,
      simulationDate,
      (e) => e.route === 'SKILLED_WORKER' && e.socCode === soc,
    ).episodes[0].validFrom;
    const arrived = timeline.episodes.map((e) => e.validFrom).sort()[0];
    const assumptions = [
      `截止点取 Immigration White Paper 的发布日 ${cutoff}；职业按 SOC 2020 ${EXAMPLES.map((o) => o.socCode).join(' / ')} 认定，"来到英国"按最早一段许可的起始日判断（PD-038、PD-039）。`,
    ];
    if (inJob < cutoff) {
      return {
        status: 'PASS',
        explanation: `自 ${inJob} 起以 SOC ${soc} 持 Skilled Worker 签证，早于 White Paper 发布日 ${cutoff}，保留 5 年合格期；仍须满足犯罪记录、B2 英语等强化最低要求。`,
        assumptions: [
          ...assumptions,
          'p44 本节未提强化最低要求；按 Table 1"强制要求适用于所有路径"（p46）处理。"满足签证要求"本工具未核实。',
        ],
      };
    }
    return arrived < cutoff
      ? {
          status: 'UNKNOWN',
          explanation: `${arrived} 起在英，早于截止点 ${cutoff}，但自 ${inJob} 起才从事 SOC ${soc}；截止前来英、截止后才转入该职业是否适用未定。`,
          pendingDetails: ['PD-039'],
          assumptions,
        }
      : {
          status: 'FAIL',
          explanation: `${arrived} 起才来英，不早于 White Paper 发布日 ${cutoff}，不适用过渡安排，走标准 Earned Settlement 路径。`,
          assumptions,
        };
  },
);
