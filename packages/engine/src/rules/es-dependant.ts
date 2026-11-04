import { earnedSettlement2026_11 as es } from '@uk-immigration/policy-data';
import type { RouteGroup } from '@uk-immigration/policy-data';
import { addYears, fullYears } from '../dates';
import { episodeOn, settledBy } from '../residence';
import { defineRule, textFor } from '../rule';
import type { IsoDate, RuleContext, SettlementAssessment } from '../types';
import { esPublicFunds, gbp } from './es-contribution';
import {
  childDependantAssumption,
  esBreach,
  isAdultOn,
} from './es-requirements';
import { esQualifyingResidence } from './es-residence';

// A dependant settles through the principal (SRC-001 Chapter 5, p28–p31).

const RULE_SET = 'earned-settlement-2026-11';

/** The pending details behind an assessment's UNKNOWN rules. */
export function pendingOf(assessment: SettlementAssessment): string[] {
  return [
    ...new Set(
      assessment.rules.flatMap((r) =>
        r.status === 'UNKNOWN' ? (r.pendingDetails ?? []) : [],
      ),
    ),
  ];
}

export interface DependantSettlement {
  /** The principal's pathway. */
  years: number;
  /** The dependant can apply `years` after this. */
  start: IsoDate;
  /** Principal's qualifying residence start + `years` (PD-060). */
  familyEligible: IsoDate;
  /** The partner's own qualifying residence started after the principal's. */
  joinedLater: boolean;
  routeGroup?: RouteGroup;
  /** Set when the principal is only potentially eligible. */
  pendingDetails: string[];
}

/**
 * The pathway the principal's Earned Settlement result gives the dependant:
 * none unless the principal has a pathway (eligible, potentially eligible or
 * projected). A partner who joined later needs the same period of their own
 * (p29); a child settles with the principal whenever they joined (PD-058).
 */
export function esDependantSettlement(
  ctx: RuleContext,
): DependantSettlement | undefined {
  const { timeline, simulationDate, principal } = ctx;
  const episode = episodeOn(timeline, simulationDate);
  if (
    episode?.role !== 'DEPENDANT' ||
    !episode.dependantOf ||
    !principal ||
    settledBy(principal.timeline, simulationDate)
  ) {
    return undefined;
  }
  const assessment = principal.result.byRuleSet[RULE_SET];
  if (!assessment?.pathwayYears) return undefined;
  const principalStart = esQualifyingResidence({
    timeline: principal.timeline,
    simulationDate,
  })?.start;
  if (!principalStart) return undefined;
  const years = assessment.pathwayYears;
  const own = esQualifyingResidence(ctx)?.start;
  const joinedLater = own !== undefined && own > principalStart;
  return {
    years,
    start:
      joinedLater && episode.dependantOf === 'PARTNER' ? own : principalStart,
    familyEligible: addYears(principalStart, years),
    joinedLater,
    ...(assessment.routeGroup && { routeGroup: assessment.routeGroup }),
    pendingDetails:
      assessment.outcome === 'POTENTIALLY_ELIGIBLE'
        ? pendingOf(assessment)
        : [],
  };
}

const PRINCIPAL_ASSUMPTION =
  'dependant 的路径年限与日期按主申请人在同一申请日的 Earned Settlement 评估结果推出；主申请人自己的规则明细见其本人的结果。';

export const esDependantPathway = defineRule(
  {
    id: 'ES-DEPENDANT-PATHWAY',
    ruleSetId: RULE_SET,
    title: '随主申请人定居（dependant）',
    sources: [
      { srcId: 'SRC-001', locator: 'p29' },
      { srcId: 'SRC-001', locator: 'p30' },
      { srcId: 'SRC-001', locator: 'p31' },
    ],
    pendingDetails: [
      'PD-056',
      'PD-057',
      'PD-058',
      'PD-059',
      'PD-060',
      'PD-061',
      'PD-062',
      'PD-063',
    ],
  },
  (ctx) => {
    const { timeline, simulationDate, principal } = ctx;
    const episode = episodeOn(timeline, simulationDate);
    if (episode?.role !== 'DEPENDANT') {
      return {
        status: 'FAIL',
        explanation:
          '当前不是以 dependant 身份持证，不走随主申请人定居的路径。',
      };
    }
    if (!principal) {
      return {
        status: 'UNKNOWN',
        explanation:
          '当前以 dependant 身份在英，dependant 随主申请人定居；填写主申请人信息后可判断。',
      };
    }
    if (!episode.dependantOf) {
      return {
        status: 'UNKNOWN',
        explanation: '未填写是作为主申请人的伴侣还是子女随行。',
      };
    }
    const settled = settledBy(principal.timeline, simulationDate);
    if (settled) {
      return {
        status: 'UNKNOWN',
        explanation: `主申请人已于 ${settled.date} 定居。Earned Settlement 只讲了 dependant 与主申请人同时定居、或后到伴侣补足同样的合格期（p29–p31），没有说主申请人已定居后其 dependant 如何定居。`,
        pendingDetails: ['PD-063'],
      };
    }
    const settlement = esDependantSettlement(ctx);
    if (!settlement) {
      const outcome = principal.result.byRuleSet[RULE_SET]?.outcome;
      return outcome === 'LIKELY_NOT_ELIGIBLE'
        ? {
            status: 'FAIL',
            explanation:
              '主申请人目前不满足 Earned Settlement 的强制要求，dependant 不能随其定居；主申请人补足后再评估。',
          }
        : {
            status: 'UNKNOWN',
            explanation:
              outcome === 'REQUIRES_REGULATED_REVIEW'
                ? '主申请人的情况需由受监管顾问判断，dependant 能否随其定居也无法判断。'
                : '主申请人的信息不足以确定其定居路径，dependant 随之无法判断。',
          };
    }
    const { years, start, familyEligible, joinedLater, pendingDetails } =
      settlement;
    const assumptions = [PRINCIPAL_ASSUMPTION];
    let explanation: string;
    if (episode.dependantOf === 'PARTNER') {
      assumptions.push(
        `伴侣的收入要求按最低收入（个人 ${gbp(es.values.earningsThresholdMinimum.value)} 或家庭合计 ${gbp(es.values.householdEarningsThreshold.value)}）判断，不按主申请人的加速门槛（PD-056）。`,
      );
      if (joinedLater) {
        explanation = `主申请人走 ${years} 年路径，${familyEligible} 满期；伴侣自 ${start} 起才有计入定居的居留，须同样满 ${years} 年，${addYears(start, years)} 起可申请。`;
        assumptions.push(
          `后到伴侣的合格期取主申请人所在路径的年限（${years} 年）（PD-057）。`,
        );
      } else {
        explanation = `与主申请人同时开始居留，可在主申请人的 ${years} 年路径满期时（${familyEligible}）一同定居，须各自满足相关要求。`;
      }
    } else {
      const age = fullYears(timeline.dateOfBirth, familyEligible);
      assumptions.push(
        `"家庭符合定居资格时"的年龄按主申请人首次满期之日（${familyEligible}）计算，不按实际申请日（PD-060）。`,
        '只按一位主申请人评估，假设另一位家长同时定居或就是主申请人的随行伴侣（PD-061）。',
      );
      if (joinedLater) {
        assumptions.push(
          '子女晚于主申请人加入，仍按主申请人的定居时点随家庭定居，不另计自己的合格期（PD-058）。',
        );
      }
      if (age >= es.values.independentAge.value) {
        return {
          status: 'FAIL',
          explanation: `家庭 ${familyEligible} 符合定居资格时已满 ${age} 岁（${es.values.independentAge.value} 岁及以上），不能作为 dependant 随家庭定居；须独立满足某条定居路径的全部强制与资格要求，或转入自己的移民路线。`,
          assumptions,
        };
      }
      if (isAdultOn(timeline, simulationDate)) {
        explanation = `${es.values.adultAge.value} 至 ${es.values.independentAge.value - 1} 岁保留 child-dependant 身份，随家庭定居（主申请人 ${years} 年路径，${familyEligible} 满期）；须满足成人强制要求（犯罪记录、政府债务、B2 英语、Life in the UK），不需个人收入。`;
        assumptions.push(childDependantAssumption(textFor(ctx)));
      } else {
        explanation = `未满 ${es.values.adultAge.value} 岁的子女随父母定居（主申请人 ${years} 年路径，${familyEligible} 满期）；豁免收入、政府债务、英语与 Life in the UK，只须满足 suitability 与犯罪记录要求。`;
      }
    }
    if (
      isAdultOn(timeline, simulationDate) &&
      [esPublicFunds, esBreach].some((r) => r.evaluate(ctx).status === 'FAIL')
    ) {
      return {
        status: 'UNKNOWN',
        explanation: `${explanation}但本人用过 public funds 或成年后有 qualifying breach；原文未说明这是否让 dependant 本人另走 20 年路径。`,
        pendingDetails: ['PD-062', ...pendingDetails],
        assumptions,
      };
    }
    if (pendingDetails.length > 0) {
      return {
        status: 'UNKNOWN',
        explanation: `${explanation}主申请人目前只是可能符合资格，取决于政府未定的细节。`,
        pendingDetails,
        assumptions,
      };
    }
    return { status: 'PASS', explanation, assumptions };
  },
);
