import { earnedSettlement2026_11 as es } from '@uk-immigration/policy-data';
import type { Route, SourceRef } from '@uk-immigration/policy-data';
import { addYears } from '../dates';
import { episodeOn } from '../residence';
import { defineRule, textFor } from '../rule';
import type { Lang } from '../rule';
import type { PersonTimeline } from '../types';
import { isAdultOn } from './es-requirements';
import { esProtectionRouteOn, esQualifyingResidence } from './es-residence';

// Refugee pathways under Earned Settlement (SRC-001 Chapter 7, p36–p40;
// Table 2, p47–p48).

const RULE_SET = 'earned-settlement-2026-11';
const v = es.values;
const src = (...pages: string[]): SourceRef[] =>
  pages.map((locator) => ({ srcId: 'SRC-001', locator }));

/** Base qualifying years on a protection route (Table 2). */
export function protectionBaseYears(route: Route): number {
  return route === 'SAFE_AND_LEGAL'
    ? v.protectionPathwayYearsSafeAndLegal.value
    : route === 'PROTECTION_WORK_AND_STUDY'
      ? v.protectionPathwayYearsWorkAndStudy.value
      : v.protectionPathwayYearsCore.value;
}

const adultIllegalEntries = (timeline: PersonTimeline) =>
  timeline.immigrationBreaches.filter(
    (b) => b.type === 'ILLEGAL_ENTRY' && isAdultOn(timeline, b.date),
  );

/**
 * Illegal entry as an adult (p13): none, the extra 10 years (p38), or every
 * such entry claimed to be protected by Article 31 (p39, PD-032).
 */
export function illegalEntryOf(
  timeline: PersonTimeline,
): 'NONE' | 'ADDED' | 'ARTICLE_31' {
  const entries = adultIllegalEntries(timeline);
  if (entries.length === 0) return 'NONE';
  return entries.every((b) => b.article31 === true) ? 'ARTICLE_31' : 'ADDED';
}

/** Years added to every protection pathway for illegal entry. */
export function illegalEntryExtraYears(timeline: PersonTimeline): number {
  return illegalEntryOf(timeline) === 'ADDED'
    ? v.illegalEntryAdditionalYears.value
    : 0;
}

/** Table 2's row for the route after illegal entry, if it has one. */
function illegalEntryRow(route: Route, L: Lang): string {
  return route === 'PROTECTION_WORK_AND_STUDY'
    ? L(
        'Table 2"Protection Work and Study following illegal entry"行',
        'Table 2’s “Protection Work and Study following illegal entry” row',
      )
    : route === 'CORE_PROTECTION'
      ? L(
          'Table 2"Core Protection following illegal entry"行',
          'Table 2’s “Core Protection following illegal entry” row',
        )
      : L(
          '"无论走哪条路线"都加 10 年的规定',
          'the rule that 10 years are added “regardless of the immigration route”',
        );
}

export const esProtectionPathway = defineRule(
  {
    id: 'ES-PROTECTION-PATHWAY',
    ruleSetId: RULE_SET,
    title: '难民定居路径与年限',
    titleEn: 'Refugee settlement pathway and qualifying period',
    sources: src('p37', 'p38', 'p39', 'p40', 'p47', 'p48'),
    pendingDetails: ['PD-029', 'PD-032', 'PD-033', 'PD-034', 'PD-043'],
  },
  (ctx) => {
    const { timeline, simulationDate } = ctx;
    const L = textFor(ctx);
    const route = esProtectionRouteOn(timeline, simulationDate);
    if (!route) {
      return {
        status: 'PASS',
        explanation: L(
          '当前不是保护类路线，本条不适用。',
          'The current route is not a protection route, so this does not apply.',
        ),
      };
    }
    const base = protectionBaseYears(route);
    const assumptions: string[] = [];
    let explanation: string;
    let sources: SourceRef[];
    if (route === 'SAFE_AND_LEGAL') {
      const scheme = episodeOn(timeline, simulationDate)?.resettlementScheme;
      if (!scheme) {
        return {
          status: 'UNKNOWN',
          explanation: L(
            '未填写经哪条 designated Safe and Legal Route 入境（UK Resettlement Scheme 或其他指定的安置 / 担保路线）。先以其他路线合法入境、之后申请庇护的，不走这条 5 年路径（p37）。',
            'Not provided which designated Safe and Legal Route the person was admitted on (the UK Resettlement Scheme, or another designated resettlement or sponsorship route). Entering legally on another route and later claiming asylum does not lead to this five-year pathway (p37).',
          ),
          sources: src('p37', 'p47'),
        };
      }
      sources = src('p37', 'p47');
      explanation =
        scheme === 'UK_RESETTLEMENT_SCHEME'
          ? L(
              `经 UK Resettlement Scheme 入境，属 designated Safe and Legal Routes：${base} 年路径（p37、p47）。`,
              `Admitted through the UK Resettlement Scheme, a designated Safe and Legal Route: the ${base}-year pathway (p37, p47).`,
            )
          : L(
              `按申报经其他指定的安置或担保路线入境，属 designated Safe and Legal Routes：${base} 年路径（p37、p47）。`,
              `Admitted, as declared, through another designated resettlement or sponsorship route, a designated Safe and Legal Route: the ${base}-year pathway (p37, p47).`,
            );
      if (scheme === 'OTHER_DESIGNATED') {
        assumptions.push(
          L(
            '"其他指定的安置或担保路线"的清单尚未公布，按你的申报处理（PD-033）；若为 Community Sponsorship、Mandate Resettlement Scheme 或此前的安置计划，属 Legacy Safe and Legal Routes，不在 Earned Settlement 框架内（p26 注 13）。',
            'The list of other designated resettlement and sponsorship routes has not been published, so this follows what you declared (PD-033). Community Sponsorship, the Mandate Resettlement Scheme and predecessor resettlement schemes are Legacy Safe and Legal Routes, outside the Earned Settlement framework (p26 note 13).',
          ),
        );
      }
    } else {
      sources = src('p38', 'p40', 'p47');
      explanation =
        route === 'PROTECTION_WORK_AND_STUDY'
          ? L(
              `Protection Work and Study：${base} 年路径，自转入本路线起算，此前在 Core Protection 的时间不计入（p38、p47）。`,
              `Protection Work and Study: the ${base}-year pathway, counted from the move onto this route; earlier time on Core Protection does not count (p38, p47).`,
            )
          : L(
              `Core Protection：${base} 年路径（p38、p47）。转入持续的工作、教育或培训并进入 Protection Work and Study 后，可自转入起按 ${v.protectionPathwayYearsWorkAndStudy.value} 年计算（p38）。`,
              `Core Protection: the ${base}-year pathway (p38, p47). Moving into sustained work, education or training and onto Protection Work and Study gives a ${v.protectionPathwayYearsWorkAndStudy.value}-year pathway counted from the move (p38).`,
            );
      assumptions.push(
        L(
          'Core Protection 与 Protection Work and Study 尚未推出，启用日期未定（PD-034）；本工具按所填许可片段的日期计算。推出前已有的难民身份时间是否及如何计入，原文说法不一、细则待公布（PD-029、PD-043）。',
          'Core Protection and Protection Work and Study have not been introduced and their start dates are not set (PD-034); this tool counts from the dates of the permissions entered. Whether and how refugee time before their introduction counts is inconsistent in the response and the details are still to be set out (PD-029, PD-043).',
        ),
      );
    }
    const entries = adultIllegalEntries(timeline).map((b) => b.date);
    const extra = v.illegalEntryAdditionalYears.value;
    const illegal = illegalEntryOf(timeline);
    if (illegal === 'ARTICLE_31') {
      const start = esQualifyingResidence(ctx)?.start;
      return {
        status: 'UNKNOWN',
        explanation:
          explanation +
          L(
            `成年后非法入境（${entries.join('、')}），申报受 Refugee Convention Article 31 保护。Article 31 适用时不加 ${extra} 年，按 ${base} 年计算；这一保障如何运作将在实施前公布（p39、p48）。若不适用，为 ${base + extra} 年${start ? `，最早 ${addYears(start, base + extra)}` : ''}。`,
            ` Illegal entry as an adult (${entries.join(', ')}), declared to be protected by Article 31 of the Refugee Convention. Where Article 31 applies the extra ${extra} years do not, so ${base} years are used; how this protection will work is to be set out before implementation (p39, p48). If it does not apply, the pathway is ${base + extra} years${start ? `, at the earliest ${addYears(start, base + extra)}` : ''}.`,
          ),
        sources: [...sources, ...src('p39', 'p48')],
        pendingDetails: ['PD-032'],
        assumptions,
      };
    }
    if (illegal === 'ADDED') {
      explanation += L(
        `成年后非法入境（${entries.join('、')}），按 ${illegalEntryRow(route, L)}额外加 ${extra} 年，共 ${base + extra} 年（p38、p48）；受 Article 31 保护时不加（未申报）。`,
        ` Illegal entry as an adult (${entries.join(', ')}): under ${illegalEntryRow(route, L)} an extra ${extra} years apply, ${base + extra} years in all (p38, p48); they do not apply where Article 31 protects the person (not declared).`,
      );
      sources = [...sources, ...src('p48')];
    }
    return { status: 'PASS', explanation, sources, assumptions };
  },
);
