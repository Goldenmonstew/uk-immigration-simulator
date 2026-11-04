import { earnedSettlement2026_11 as es } from '@uk-immigration/policy-data';
import { fullYears } from '../dates';
import { defineRule } from '../rule';
import type { IsoDate, PersonTimeline } from '../types';

// Mandatory requirements that apply to every Earned Settlement pathway
// (SRC-001 p8–p9, p46 "All mandatory requirements apply to all settlement
// pathways").

const RULE_SET = 'earned-settlement-2026-11';

export function isAdultOn(timeline: PersonTimeline, date: IsoDate): boolean {
  return fullYears(timeline.dateOfBirth, date) >= es.values.adultAge.value;
}

export const esCriminality = defineRule(
  {
    id: 'ES-CRIMINALITY',
    ruleSetId: RULE_SET,
    title: '无犯罪记录',
    sources: [{ srcId: 'SRC-001', locator: 'p12' }],
    pendingDetails: ['PD-017'],
  },
  ({ timeline }) => {
    const events = timeline.criminalRecord;
    if (events.length === 0) {
      return { status: 'PASS', explanation: '未申报犯罪记录。' };
    }
    if (events.some((e) => isAdultOn(timeline, e.date))) {
      return {
        status: 'FAIL',
        explanation: `申报了 ${events.length} 条犯罪记录，其中有成年后的记录。Earned Settlement 下成年申请人在英国有任何犯罪记录（含判刑、罚款、社区刑、部分庭外处置）即拒绝定居；海外定罪也可能导致拒绝。需由受监管顾问判断。`,
      };
    }
    return {
      status: 'UNKNOWN',
      explanation:
        '申报的犯罪记录都发生在 18 岁以前。原文对未成年时的犯罪保留酌情拒绝的空间，需由受监管顾问判断。',
      pendingDetails: ['PD-017'],
    };
  },
);

export const esDebt = defineRule(
  {
    id: 'ES-DEBT',
    ruleSetId: RULE_SET,
    title: '无未清偿的政府债务',
    sources: [{ srcId: 'SRC-001', locator: 'p12' }],
    pendingDetails: ['PD-018'],
  },
  ({ timeline }) => {
    if (!timeline.governmentDebt) {
      return {
        status: 'UNKNOWN',
        explanation:
          '未填写是否有欠政府的债务（NHS 债务、税款与 National Insurance 欠款、欠 Home Office 的诉讼费用等）。',
      };
    }
    if (timeline.governmentDebt.outstanding) {
      return {
        status: 'FAIL',
        explanation:
          '有未清偿的政府债务。Earned Settlement 把无政府债务定为强制要求，不满足即不能定居，不能用收入或其他贡献抵消。',
      };
    }
    return {
      status: 'PASS',
      explanation: '申报无未清偿的政府债务。',
      assumptions: [
        '"无政府债务"按用户申报判断；正在按还款计划偿还的非 asylum support 债务是否满足要求，原文未说明（PD-018）。',
      ],
    };
  },
);
