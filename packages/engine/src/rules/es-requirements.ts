import {
  breachTypeNames,
  earnedSettlement2026_11 as es,
} from '@uk-immigration/policy-data';
import { fullYears } from '../dates';
import { episodeOn } from '../residence';
import { defineRule, nameIn, textFor } from '../rule';
import type { Lang } from '../rule';
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

export const childDependantAssumption = (L: Lang) =>
  L(
    '当前以父母的 dependant 身份持证，即视为"保留 child-dependant 身份"（retain child-dependant status）；原文未说明认定标准（PD-059）。',
    'Current permission as a parent’s dependant is treated as retaining child-dependant status; the response does not say how this is determined (PD-059).',
  );

/** Current permission is as the principal's child (SRC-001 p29–p30). */
export function childDependantOn(
  timeline: PersonTimeline,
  date: IsoDate,
): boolean {
  const episode = episodeOn(timeline, date);
  return episode?.role === 'DEPENDANT' && episode.dependantOf === 'PARENT';
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
    titleEn: 'No criminal record',
    sources: [{ srcId: 'SRC-001', locator: 'p12' }],
    pendingDetails: ['PD-017'],
  },
  ({ timeline, locale }) => {
    const L = textFor({ locale });
    const events = timeline.criminalRecord;
    if (events.length === 0) {
      return {
        status: 'PASS',
        explanation: L('未申报犯罪记录。', 'No criminal record declared.'),
      };
    }
    if (events.some((e) => isAdultOn(timeline, e.date))) {
      return {
        status: 'FAIL',
        explanation: L(
          `申报了 ${events.length} 条犯罪记录，其中有成年后的记录。Earned Settlement 下成年申请人在英国有任何犯罪记录（含判刑、罚款、社区刑、部分庭外处置）即拒绝定居；海外定罪也可能导致拒绝。需由受监管顾问判断。`,
          `${events.length} criminal record(s) declared, including at least one as an adult. Under Earned Settlement any criminal record of an adult applicant in the UK (including sentences, fines, community sentences and some out-of-court disposals) leads to refusal of settlement; overseas convictions may also lead to refusal. This needs a regulated adviser’s assessment.`,
        ),
      };
    }
    return {
      status: 'UNKNOWN',
      explanation: L(
        `申报的犯罪记录都发生在 ${es.values.adultAge.value} 岁以前。原文对未成年时的犯罪保留酌情拒绝的空间，需由受监管顾问判断。`,
        `Every declared criminal record is from before age ${es.values.adultAge.value}. The response leaves room for discretionary refusal for offences committed as a minor; this needs a regulated adviser’s assessment.`,
      ),
      pendingDetails: ['PD-017'],
    };
  },
);

export const esDebt = defineRule(
  {
    id: 'ES-DEBT',
    ruleSetId: RULE_SET,
    title: '无未清偿的政府债务',
    titleEn: 'No outstanding government debt',
    sources: [
      { srcId: 'SRC-001', locator: 'p12' },
      { srcId: 'SRC-001', locator: 'p29' },
    ],
    pendingDetails: ['PD-018'],
  },
  ({ timeline, simulationDate, locale }) => {
    const L = textFor({ locale });
    if (
      childDependantOn(timeline, simulationDate) &&
      !isAdultOn(timeline, simulationDate)
    ) {
      return {
        status: 'PASS',
        explanation: L(
          `申请日未满 ${es.values.adultAge.value} 岁的 child dependant 豁免政府债务要求。`,
          `A child dependant under ${es.values.adultAge.value} on the date of application is exempt from the government debt requirement.`,
        ),
        sources: [{ srcId: 'SRC-001', locator: 'p29' }],
      };
    }
    if (!timeline.governmentDebt) {
      return {
        status: 'UNKNOWN',
        explanation: L(
          '未填写是否有欠政府的债务（NHS 债务、税款与 National Insurance 欠款、欠 Home Office 的诉讼费用等）。',
          'Government debt not provided (NHS debt, unpaid tax and National Insurance, litigation costs owed to the Home Office and similar).',
        ),
      };
    }
    if (timeline.governmentDebt.outstanding) {
      return {
        status: 'FAIL',
        explanation: L(
          '有未清偿的政府债务。Earned Settlement 把无政府债务定为强制要求，不满足即不能定居，不能用收入或其他贡献抵消。',
          'Outstanding government debt declared. Earned Settlement makes having no government debt a mandatory requirement: without it settlement is not possible, and it cannot be offset by earnings or other contributions.',
        ),
      };
    }
    return {
      status: 'PASS',
      explanation: L(
        '申报无未清偿的政府债务。',
        'No outstanding government debt declared.',
      ),
      assumptions: [
        L(
          '"无政府债务"按用户申报判断；正在按还款计划偿还的非 asylum support 债务是否满足要求，原文未说明（PD-018）。',
          '“No government debt” is based on what the user declared; the response does not say whether debt other than asylum support debt that is being repaid under a repayment plan meets the requirement (PD-018).',
        ),
      ],
    };
  },
);

export const esEnglishB2 = defineRule(
  {
    id: 'ES-ENGLISH-B2',
    ruleSetId: RULE_SET,
    title: '英语达到 B2',
    titleEn: `English at ${es.values.settlementEnglishLevel.value}`,
    sources: [{ srcId: 'SRC-001', locator: 'p21' }],
    pendingDetails: ['PD-019'],
  },
  ({ timeline, simulationDate, locale }) => {
    const L = textFor({ locale });
    const required = es.values.settlementEnglishLevel.value;
    if (ageExemptOn(timeline, simulationDate)) {
      return {
        status: 'PASS',
        explanation: L(
          `申请日未满 ${es.values.adultAge.value} 岁或已满 ${es.values.exemptionAge.value} 岁，豁免英语要求。`,
          `Under ${es.values.adultAge.value} or aged ${es.values.exemptionAge.value} or over on the date of application: exempt from the English requirement.`,
        ),
      };
    }
    const english = timeline.english;
    if (!english) {
      return {
        status: 'UNKNOWN',
        explanation: L(
          `未填写英语水平。Earned Settlement 要求 CEFR ${required}（现有豁免保留）。`,
          `English level not provided. Earned Settlement requires CEFR ${required} (existing exemptions are retained).`,
        ),
      };
    }
    if ('exempt' in english) {
      return {
        status: 'PASS',
        explanation: L(
          '申报因身心状况豁免英语要求。',
          'Exempt from the English requirement because of a physical or mental condition, as declared.',
        ),
        assumptions: [
          L(
            '身心状况豁免按用户申报，未核实认定标准。',
            'The physical or mental condition exemption is taken as declared; the criteria are not checked.',
          ),
        ],
      };
    }
    return meetsCefr(english.cefrLevel, required)
      ? {
          status: 'PASS',
          explanation: L(
            `英语 ${english.cefrLevel}，达到 ${required}。`,
            `English at ${english.cefrLevel}, which meets ${required}.`,
          ),
        }
      : {
          status: 'FAIL',
          explanation: L(
            `英语 ${english.cefrLevel}，低于 Earned Settlement 要求的 ${required}。这是强制要求，不能用收入或其他贡献抵消。`,
            `English at ${english.cefrLevel}, below the ${required} required by Earned Settlement. This is a mandatory requirement and cannot be offset by earnings or other contributions.`,
          ),
        };
  },
);

export const esKol = defineRule(
  {
    id: 'ES-KOL',
    ruleSetId: RULE_SET,
    title: '通过 Life in the UK 考试',
    titleEn: 'Pass the Life in the UK test',
    sources: [{ srcId: 'SRC-001', locator: 'p21' }],
    pendingDetails: ['PD-020'],
  },
  ({ timeline, simulationDate, locale }) => {
    const L = textFor({ locale });
    if (ageExemptOn(timeline, simulationDate)) {
      return {
        status: 'PASS',
        explanation: L(
          `申请日未满 ${es.values.adultAge.value} 岁或已满 ${es.values.exemptionAge.value} 岁，豁免 Life in the UK 考试。`,
          `Under ${es.values.adultAge.value} or aged ${es.values.exemptionAge.value} or over on the date of application: exempt from the Life in the UK test.`,
        ),
      };
    }
    const kol = timeline.lifeInTheUk;
    if (!kol) {
      return {
        status: 'UNKNOWN',
        explanation: L(
          '未填写是否已通过 Life in the UK 考试。',
          'Not provided whether the Life in the UK test has been passed.',
        ),
      };
    }
    return 'exempt' in kol
      ? {
          status: 'PASS',
          explanation: L(
            '申报因身心状况豁免 Life in the UK 考试。',
            'Exempt from the Life in the UK test because of a physical or mental condition, as declared.',
          ),
          assumptions: [
            L(
              '身心状况豁免按用户申报，未核实认定标准。',
              'The physical or mental condition exemption is taken as declared; the criteria are not checked.',
            ),
          ],
        }
      : {
          status: 'PASS',
          explanation: L(
            '已通过 Life in the UK 考试。',
            'Passed the Life in the UK test.',
          ),
        };
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
    titleEn: 'No qualifying immigration breach as an adult',
    sources: [{ srcId: 'SRC-001', locator: 'p13' }],
    pendingDetails: ['PD-015', 'PD-016', 'PD-044'],
  },
  ({ timeline, locale }) => {
    const L = textFor({ locale });
    const adult = timeline.immigrationBreaches.filter((b) =>
      isAdultOn(timeline, b.date),
    );
    const minorNote =
      adult.length < timeline.immigrationBreaches.length
        ? L(
            `未满 ${es.values.adultAge.value} 岁时的违规不计入（p13）。`,
            ` Breaches before age ${es.values.adultAge.value} do not count (p13).`,
          )
        : '';
    if (adultIllegalEntry(timeline)) {
      return {
        status: 'UNKNOWN',
        explanation: L(
          `成年后非法入境。第 1 章暗示进入 20 年路径，第 7 章又说无论走哪条路线都额外加 10 年，原文不一致，需由受监管顾问判断。${minorNote}`,
          `Illegal entry as an adult. Chapter 1 implies the 20-year pathway, while Chapter 7 says an extra 10 years is added whatever the route; the response is inconsistent, and this needs a regulated adviser’s assessment.${minorNote}`,
        ),
        pendingDetails: ['PD-044'],
      };
    }
    if (adult.length > 0) {
      const types = [...new Set(adult.map((b) => b.type))].map((t) =>
        nameIn(L, breachTypeNames[t]),
      );
      return {
        status: 'FAIL',
        explanation: L(
          `成年后有 qualifying immigration breach（${types.join('、')}），不论收入多高都进入 20 年路径。${minorNote}`,
          `Qualifying immigration breach as an adult (${types.join(', ')}): the 20-year pathway applies however high the earnings.${minorNote}`,
        ),
        assumptions: [
          L(
            '20 年按在 qualifying route 上的连续居留计算，违规不设时效（PD-016）。',
            'The 20 years count continuous residence on a qualifying route; breaches do not expire (PD-016).',
          ),
        ],
      };
    }
    return {
      status: 'PASS',
      explanation: L(
        `成年后无 qualifying immigration breach。${minorNote}`,
        `No qualifying immigration breach as an adult.${minorNote}`,
      ),
    };
  },
);
