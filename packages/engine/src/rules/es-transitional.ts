import {
  careWorkerOccupations,
  earnedSettlement2026_11 as es,
  healthEducationTransitionalExamples,
  nationalPayScaleBelowRqf6Occupations,
} from '@uk-immigration/policy-data';
import { continuousRun, episodeOn } from '../residence';
import { defineRule, textFor } from '../rule';
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
    titleEn: `Care worker transitional arrangements (retain ${es.values.pathwayYears5.value} years)`,
    sources: [
      { srcId: 'SRC-001', locator: 'p42' },
      { srcId: 'SRC-001', locator: 'p43' },
      { srcId: 'SRC-012', locator: 'cover' },
      ...careWorkerOccupations.sources,
    ],
    pendingDetails: ['PD-035', 'PD-036'],
  },
  ({ timeline, simulationDate, locale }) => {
    const L = textFor({ locale });
    const current = episodeOn(timeline, simulationDate);
    if (!current || !isCareWorker(current)) {
      return {
        status: 'FAIL',
        explanation: L(
          `当前不是 care worker（SOC 2020 ${CARE_CODES}）的 Skilled Worker 签证，不适用 care worker 过渡安排。`,
          `The current permission is not a Skilled Worker visa as a care worker (SOC 2020 ${CARE_CODES}), so the care worker transitional arrangements do not apply.`,
        ),
      };
    }
    const cutoff = es.values.whitePaperPublished.value;
    const entered = continuousRun(timeline, simulationDate, isCareWorker)
      .episodes[0].validFrom;
    const assumptions = [
      L(
        `截止点取 Immigration White Paper 的发布日 ${cutoff}（PD-035）；"进入或转入该路线"按这段连续 care worker 许可的起始日判断，职业按 SOC 2020 ${CARE_CODES} 认定（PD-036）。`,
        `The cut-off is taken as the Immigration White Paper publication date, ${cutoff} (PD-035); “entered or switched into the route” is judged by the start of the current continuous care worker permission, and the occupation by SOC 2020 ${CARE_CODES} (PD-036).`,
      ),
    ];
    if (entered >= cutoff) {
      return timeline.episodes.some(
        (e) => isCareWorker(e) && e.validFrom < cutoff,
      )
        ? {
            status: 'UNKNOWN',
            explanation: L(
              `截止点 ${cutoff} 前曾是 care worker，但当前这段 care worker 许可自 ${entered} 起，是否仍属过渡群体未定。`,
              `Was a care worker before the cut-off of ${cutoff}, but the current care worker permission runs from ${entered}; whether this still falls within the transitional group is not settled.`,
            ),
            pendingDetails: ['PD-036'],
            assumptions,
          }
        : {
            status: 'FAIL',
            explanation: L(
              `自 ${entered} 起进入 care worker 路线，不早于 White Paper 发布日 ${cutoff}，不适用过渡安排，走标准 Earned Settlement 路径。`,
              `Entered the care worker route on ${entered}, not before the White Paper publication date of ${cutoff}: the transitional arrangements do not apply, and the standard Earned Settlement pathways are used.`,
            ),
            assumptions,
          };
    }
    const threshold = es.values.careWorkerSalaryThreshold.value;
    if (current.salary === undefined) {
      return {
        status: 'UNKNOWN',
        explanation: L(
          `自 ${entered} 起在截止点前进入 care worker 路线；未填写薪资，无法判断是否达到 ${gbp(threshold)}。`,
          `Entered the care worker route on ${entered}, before the cut-off; salary not provided, so whether it reaches ${gbp(threshold)} cannot be determined.`,
        ),
        assumptions,
      };
    }
    if (current.salary < threshold) {
      return {
        status: 'FAIL',
        explanation: L(
          `薪资 ${gbp(current.salary)} 低于过渡安排要求的 ${gbp(threshold)}，满 5 年时不能凭此定居；可再申请一次 5 年 Health and Care 签证，之后再申请定居。`,
          `Salary of ${gbp(current.salary)} is below the ${gbp(threshold)} the transitional arrangements require, so settlement on this basis is not possible after 5 years; a further 5-year Health and Care visa can be applied for once, before applying for settlement.`,
        ),
        assumptions,
      };
    }
    return {
      status: 'PASS',
      explanation: L(
        `自 ${entered} 起在截止点 ${cutoff} 前进入 care worker 路线，薪资 ${gbp(current.salary)} 达到 ${gbp(threshold)}，保留 5 年合格期；仍须满足犯罪记录、B2 英语等强化最低要求。`,
        `Entered the care worker route on ${entered}, before the cut-off of ${cutoff}, with a salary of ${gbp(current.salary)} that reaches ${gbp(threshold)}: the 5-year qualifying period is retained. The strengthened minimum requirements, such as criminality and B2 English, still apply.`,
      ),
      assumptions: [
        ...assumptions,
        L(
          '过渡安排另要求满足担保与雇佣要求（p42），本工具未核实。',
          'The transitional arrangements also require the sponsorship and employment requirements to be met (p42); this tool does not check them.',
        ),
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
    titleEn: `Transitional arrangement for health / education jobs on national pay scales below RQF 6 (retain ${es.values.pathwayYears5.value} years)`,
    sources: [
      { srcId: 'SRC-001', locator: 'p44' },
      { srcId: 'SRC-001', locator: 'p42' },
      { srcId: 'SRC-001', locator: 'p46' },
      { srcId: 'SRC-012', locator: 'cover' },
      ...nationalPayScaleBelowRqf6Occupations.sources,
    ],
    pendingDetails: ['PD-038', 'PD-039'],
  },
  ({ timeline, simulationDate, locale }) => {
    const L = textFor({ locale });
    const current = episodeOn(timeline, simulationDate);
    const soc = current?.socCode;
    if (
      current?.route !== 'SKILLED_WORKER' ||
      current.role !== 'MAIN' ||
      !inList(nationalPayScaleBelowRqf6Occupations.occupations, soc)
    ) {
      return {
        status: 'FAIL',
        explanation: L(
          '当前不是 RQF6 以下、国家薪级的医疗 / 教育职业（Appendix Skilled Occupations Table 3a）的 Skilled Worker 签证，不适用该过渡安排。',
          'The current permission is not a Skilled Worker visa in a health / education occupation on a national pay scale below RQF 6 (Appendix Skilled Occupations Table 3a), so this transitional arrangement does not apply.',
        ),
      };
    }
    const examples = EXAMPLES.map((o) =>
      L(`${o.title}（${o.socCode}）`, `${o.title} (${o.socCode})`),
    ).join(L('、', ' and '));
    if (!inList(EXAMPLES, soc)) {
      return {
        status: 'UNKNOWN',
        explanation: L(
          `SOC ${soc} 属 Table 3a 的 RQF6 以下国家薪级职业，但原文只举了 ${examples} 两例，是否适用未定。`,
          `SOC ${soc} is a national pay scale occupation below RQF 6 in Table 3a, but the response only gives ${examples} as examples; whether the arrangement applies is not settled.`,
        ),
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
      L(
        `截止点取 Immigration White Paper 的发布日 ${cutoff}；职业按 SOC 2020 ${EXAMPLES.map((o) => o.socCode).join(' / ')} 认定，"来到英国"按最早一段许可的起始日判断（PD-038、PD-039）。`,
        `The cut-off is taken as the Immigration White Paper publication date, ${cutoff}; the occupation is judged by SOC 2020 ${EXAMPLES.map((o) => o.socCode).join(' / ')}, and “came to the UK” by the start of the earliest permission (PD-038, PD-039).`,
      ),
    ];
    if (inJob < cutoff) {
      return {
        status: 'PASS',
        explanation: L(
          `自 ${inJob} 起以 SOC ${soc} 持 Skilled Worker 签证，早于 White Paper 发布日 ${cutoff}，保留 5 年合格期；仍须满足犯罪记录、B2 英语等强化最低要求。`,
          `Has held a Skilled Worker visa in SOC ${soc} since ${inJob}, before the White Paper publication date of ${cutoff}: the 5-year qualifying period is retained. The strengthened minimum requirements, such as criminality and B2 English, still apply.`,
        ),
        assumptions: [
          ...assumptions,
          L(
            'p44 本节未提强化最低要求；按 Table 1"强制要求适用于所有路径"（p46）处理。"满足签证要求"本工具未核实。',
            'p44 does not mention the strengthened minimum requirements; they are applied following Table 1, “all mandatory requirements apply to all settlement pathways” (p46). Whether the visa requirements are met is not checked by this tool.',
          ),
        ],
      };
    }
    return arrived < cutoff
      ? {
          status: 'UNKNOWN',
          explanation: L(
            `${arrived} 起在英，早于截止点 ${cutoff}，但自 ${inJob} 起才从事 SOC ${soc}；截止前来英、截止后才转入该职业是否适用未定。`,
            `In the UK since ${arrived}, before the cut-off of ${cutoff}, but in SOC ${soc} only since ${inJob}; whether the arrangement applies to someone who came before the cut-off but moved into the occupation after it is not settled.`,
          ),
          pendingDetails: ['PD-039'],
          assumptions,
        }
      : {
          status: 'FAIL',
          explanation: L(
            `${arrived} 起才来英，不早于 White Paper 发布日 ${cutoff}，不适用过渡安排，走标准 Earned Settlement 路径。`,
            `Came to the UK on ${arrived}, not before the White Paper publication date of ${cutoff}: the transitional arrangement does not apply, and the standard Earned Settlement pathways are used.`,
          ),
          assumptions,
        };
  },
);
