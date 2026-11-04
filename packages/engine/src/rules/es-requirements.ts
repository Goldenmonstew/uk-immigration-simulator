import { earnedSettlement2026_11 as es } from '@uk-immigration/policy-data';
import { fullYears } from '../dates';
import { defineRule } from '../rule';
import type { CefrLevel } from '@uk-immigration/policy-data';
import type { IsoDate, PersonTimeline } from '../types';

// Mandatory requirements that apply to every Earned Settlement pathway
// (SRC-001 p8–p9, p46 "All mandatory requirements apply to all settlement
// pathways").

const RULE_SET = 'earned-settlement-2026-11';

export function isAdultOn(timeline: PersonTimeline, date: IsoDate): boolean {
  return fullYears(timeline.dateOfBirth, date) >= es.values.adultAge.value;
}

/** Under 18 or 65 and over: exempt from earnings, English and Life in the UK. */
export function ageExemptOn(timeline: PersonTimeline, date: IsoDate): boolean {
  const age = fullYears(timeline.dateOfBirth, date);
  return age < es.values.adultAge.value || age >= es.values.exemptionAge.value;
}

const CEFR_ORDER: readonly string[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export function meetsCefr(level: CefrLevel, required: string): boolean {
  return CEFR_ORDER.indexOf(level) >= CEFR_ORDER.indexOf(required);
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

export const esEnglishB2 = defineRule(
  {
    id: 'ES-ENGLISH-B2',
    ruleSetId: RULE_SET,
    title: '英语达到 B2',
    sources: [{ srcId: 'SRC-001', locator: 'p21' }],
    pendingDetails: ['PD-019'],
  },
  ({ timeline, simulationDate }) => {
    const required = es.values.settlementEnglishLevel.value;
    if (ageExemptOn(timeline, simulationDate)) {
      return {
        status: 'PASS',
        explanation: `申请日未满 18 岁或已满 65 岁，豁免英语要求。`,
      };
    }
    const english = timeline.english;
    if (!english) {
      return {
        status: 'UNKNOWN',
        explanation: `未填写英语水平。Earned Settlement 要求 CEFR ${required}（现有豁免保留）。`,
      };
    }
    if ('exempt' in english) {
      return {
        status: 'PASS',
        explanation: '申报因身心状况豁免英语要求。',
        assumptions: ['身心状况豁免按用户申报，未核实认定标准。'],
      };
    }
    return meetsCefr(english.cefrLevel, required)
      ? {
          status: 'PASS',
          explanation: `英语 ${english.cefrLevel}，达到 ${required}。`,
        }
      : {
          status: 'FAIL',
          explanation: `英语 ${english.cefrLevel}，低于 Earned Settlement 要求的 ${required}。这是强制要求，不能用收入或其他贡献抵消。`,
        };
  },
);

export const esKol = defineRule(
  {
    id: 'ES-KOL',
    ruleSetId: RULE_SET,
    title: '通过 Life in the UK 考试',
    sources: [{ srcId: 'SRC-001', locator: 'p21' }],
    pendingDetails: ['PD-020'],
  },
  ({ timeline, simulationDate }) => {
    if (ageExemptOn(timeline, simulationDate)) {
      return {
        status: 'PASS',
        explanation: '申请日未满 18 岁或已满 65 岁，豁免 Life in the UK 考试。',
      };
    }
    const kol = timeline.lifeInTheUk;
    if (!kol) {
      return {
        status: 'UNKNOWN',
        explanation: '未填写是否已通过 Life in the UK 考试。',
      };
    }
    return 'exempt' in kol
      ? {
          status: 'PASS',
          explanation: '申报因身心状况豁免 Life in the UK 考试。',
          assumptions: ['身心状况豁免按用户申报，未核实认定标准。'],
        }
      : { status: 'PASS', explanation: '已通过 Life in the UK 考试。' };
  },
);

/** Adult illegal entry, which short-circuits (PD-044). */
export function adultIllegalEntry(timeline: PersonTimeline): boolean {
  return timeline.immigrationBreaches.some(
    (b) => b.type === 'ILLEGAL_ENTRY' && isAdultOn(timeline, b.date),
  );
}

export const esBreach = defineRule(
  {
    id: 'ES-BREACH',
    ruleSetId: RULE_SET,
    title: '成年后无 qualifying immigration breach',
    sources: [{ srcId: 'SRC-001', locator: 'p13' }],
    pendingDetails: ['PD-015', 'PD-016', 'PD-044'],
  },
  ({ timeline }) => {
    const adult = timeline.immigrationBreaches.filter((b) =>
      isAdultOn(timeline, b.date),
    );
    const minorNote =
      adult.length < timeline.immigrationBreaches.length
        ? '未满 18 岁时的违规不计入（p13）。'
        : '';
    if (adultIllegalEntry(timeline)) {
      return {
        status: 'UNKNOWN',
        explanation: `成年后非法入境。第 1 章暗示进入 20 年路径，第 7 章又说无论走哪条路线都额外加 10 年，原文不一致，需由受监管顾问判断。${minorNote}`,
        pendingDetails: ['PD-044'],
      };
    }
    if (adult.length > 0) {
      return {
        status: 'FAIL',
        explanation: `成年后有 qualifying immigration breach（${[...new Set(adult.map((b) => b.type))].join('、')}），不论收入多高都进入 20 年路径。${minorNote}`,
        assumptions: [
          '20 年按在 qualifying route 上的连续居留计算，违规不设时效（PD-016）。',
        ],
      };
    }
    return {
      status: 'PASS',
      explanation: `成年后无 qualifying immigration breach。${minorNote}`,
    };
  },
);
