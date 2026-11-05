import {
  asylumSupportRepaymentNames,
  breachTypeNames,
  earnedSettlement2026_11,
  publicFundsBenefits,
  resettlementSchemeNames,
  ROUTE_GROUPS,
  RULE_SET_IDS,
  sustainedActivityNames,
} from '@uk-immigration/policy-data';
import type { Route } from '@uk-immigration/policy-data';
import { describe, expect, test } from 'vitest';
import { taxYearsBefore } from '../src/dates';
import { evaluate, RULE_SETS } from '../src/evaluate';
import { episodeOn } from '../src/residence';
import type {
  ImmigrationBreach,
  ImmigrationEpisode,
  PersonTimeline,
  SimulationRequest,
} from '../src/types';

const FIRST_SEED = 0x56c0ffee;
const CASE_COUNT = 2000;
const DAY_MS = 86_400_000;
const routes = Object.keys(ROUTE_GROUPS) as Route[];
const benefitTypes = [
  ...publicFundsBenefits.publicFunds,
  ...publicFundsBenefits.notPublicFunds,
].map((benefit) => benefit.benefitType);

function generateRequest(seed: number): SimulationRequest {
  // Mulberry32: each case is reproducible from its seed alone.
  let state = seed;
  const random = () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), state | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
  const int = (min: number, max: number) =>
    min + Math.floor(random() * (max - min + 1));
  const chance = (probability = 0.5) => random() < probability;
  const pick = <T>(values: readonly T[]): T =>
    values[int(0, values.length - 1)];
  const optional = <T>(value: T): T | undefined =>
    chance(0.65) ? value : undefined;
  const iso = (milliseconds: number) =>
    new Date(milliseconds).toISOString().slice(0, 10);
  const date = (firstYear: number, lastYear: number) =>
    iso(
      Date.UTC(firstYear, 0, 1) +
        int(
          0,
          (Date.UTC(lastYear + 1, 0, 1) - Date.UTC(firstYear, 0, 1)) / DAY_MS -
            1,
        ) *
          DAY_MS,
    );
  const simulationDate = date(2026, 2040);
  const simulationMs = Date.parse(simulationDate);

  const timeline = (principalRoute?: Route): PersonTimeline => {
    const dateOfBirth = date(1950, 2010);
    const birthMs = Date.parse(dateOfBirth);
    const eventDate = () =>
      iso(birthMs + int(0, (simulationMs - birthMs) / DAY_MS) * DAY_MS);
    const episodes: ImmigrationEpisode[] = [];
    const episodeCount = principalRoute === undefined ? int(0, 4) : 1;
    let from = Math.max(birthMs, simulationMs - int(365, 30 * 365) * DAY_MS);
    for (let index = 0; index < episodeCount; index++) {
      const duration = int(30, 10 * 365);
      const to =
        index === episodeCount - 1 &&
        (principalRoute !== undefined || chance(0.75))
          ? Math.max(from, simulationMs + int(0, 4 * 365) * DAY_MS)
          : from + duration * DAY_MS;
      const episode: ImmigrationEpisode = {
        route: principalRoute ?? pick(routes),
        role:
          principalRoute === undefined
            ? pick(['MAIN', 'DEPENDANT'] as const)
            : 'MAIN',
        validFrom: iso(from),
        validTo: iso(to),
      };
      if (episode.role === 'DEPENDANT') {
        episode.dependantOf = optional(
          pick(['PARTNER', 'PARENT', 'RELATIVE'] as const),
        );
      }
      if (episode.route === 'SKILLED_WORKER' && episode.role === 'MAIN') {
        episode.socCode = optional(
          pick(['2136', '6135', '6136', '2211', '2312', '9999']),
        );
        episode.salary = optional(int(0, 200000));
        episode.immigrationSalaryList = optional(chance());
      }
      if (episode.route === 'SAFE_AND_LEGAL') {
        episode.resettlementScheme = optional(
          pick(
            Object.keys(resettlementSchemeNames) as NonNullable<
              ImmigrationEpisode['resettlementScheme']
            >[],
          ),
        );
      }
      if (episode.route === 'PROTECTION_WORK_AND_STUDY') {
        episode.sustainedActivity = optional(
          pick(
            Object.keys(sustainedActivityNames) as NonNullable<
              ImmigrationEpisode['sustainedActivity']
            >[],
          ),
        );
      }
      if (episode.route === 'GLOBAL_TALENT' && episode.role === 'MAIN') {
        episode.globalTalentEndorsement = optional(
          pick([
            'RESEARCH_BODY',
            'ARTS_COUNCIL_ENGLAND',
            'TECH_NATION',
            'PRIZE',
          ] as const),
        );
        if (
          episode.globalTalentEndorsement === 'ARTS_COUNCIL_ENGLAND' ||
          episode.globalTalentEndorsement === 'TECH_NATION'
        ) {
          episode.globalTalentCriteria = optional(
            pick(['EXCEPTIONAL_TALENT', 'EXCEPTIONAL_PROMISE'] as const),
          );
        }
      }
      if (
        episode.route === 'FAMILY_PARTNER_OR_PARENT' &&
        episode.role === 'MAIN'
      ) {
        const permission = pick([
          'PARTNER_FIVE_YEAR',
          'PARTNER_TEN_YEAR',
          'PARENT',
        ] as const);
        episode.familyPermission =
          principalRoute === undefined ? optional(permission) : permission;
      }
      if (episode.route === 'INNOVATOR_FOUNDER' && episode.role === 'MAIN') {
        episode.innovatorSettlementCriteria = optional(
          (
            [
              'INVESTMENT',
              'CUSTOMERS',
              'RESEARCH_AND_IP',
              'REVENUE',
              'EXPORT_REVENUE',
              'JOBS',
              'JOBS_WITH_SALARY',
            ] as const
          ).filter(() => chance()),
        );
      }
      if (
        episode.route === 'FAMILY_AND_PRIVATE_LIFE' &&
        episode.role === 'MAIN'
      ) {
        episode.privateLifeRoute = optional(
          pick(['CHILD', 'YOUNG_ADULT', 'ADULT'] as const),
        );
      }
      episodes.push(episode);
      // Next permission: overlap, adjoining dates, or a gap. Starts stay ordered.
      from =
        to +
        pick([-int(1, Math.min(duration - 1, 365)), 1, int(2, 730)]) * DAY_MS;
    }
    const absenceCount = int(0, 3);
    return {
      dateOfBirth,
      nationality: pick(['IND', 'CHN', 'HKG', 'PAK', 'NGA', 'USA']),
      episodes,
      absences: Array.from({ length: absenceCount }, (_, index) => {
        const from =
          simulationMs -
          ((absenceCount - index) * 3 * 365 - int(0, 365)) * DAY_MS;
        return { from: iso(from), to: iso(from + int(0, 400) * DAY_MS) };
      }),
      incomeYears: taxYearsBefore(simulationDate, int(0, 7)).map((taxYear) => ({
        taxYear,
        earnings: optional(pick([0, int(1, 200000)])),
        partnerEarnings: optional(pick([0, int(1, 100000)])),
      })),
      cashSavings: optional(pick([0, int(0, 60000)])),
      partnerSpecifiedBenefit: optional(chance()),
      benefits: Array.from({ length: chance(0.6) ? 0 : int(1, 3) }, () => {
        const from = eventDate();
        return {
          benefitType: pick([...benefitTypes, 'UNLISTED_BENEFIT']),
          from,
          to: optional(
            iso(
              Math.min(simulationMs, Date.parse(from) + int(0, 730) * DAY_MS),
            ),
          ),
        };
      }),
      relationships: Array.from({ length: int(0, 3) }, () => ({
        type: pick(['PARTNER', 'PARENT', 'CHILD'] as const),
        otherPartyStatus: pick([
          'BRITISH_CITIZEN',
          'SETTLED',
          'OTHER',
        ] as const),
      })),
      english: optional(
        chance(0.2)
          ? { exempt: true }
          : { cefrLevel: pick(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const) },
      ),
      lifeInTheUk: optional(chance() ? { passed: true } : { exempt: true }),
      earningsExemptHealth: optional(chance()),
      criminalRecord: chance(0.15) ? [{ date: eventDate() }] : [],
      immigrationBreaches: Array.from(
        { length: chance(0.6) ? 0 : int(1, 3) },
        () => {
          const type = pick(
            Object.keys(breachTypeNames) as ImmigrationBreach['type'][],
          );
          return {
            type,
            date: eventDate(),
            ...(type === 'ILLEGAL_ENTRY' && { article31: optional(chance()) }),
          };
        },
      ),
      governmentDebt: optional({ outstanding: chance(0.25) }),
      settled:
        principalRoute === undefined
          ? optional({ date: eventDate(), route: pick(routes) })
          : undefined,
      asylumSupportRepayment: optional(
        pick(
          Object.keys(asylumSupportRepaymentNames) as NonNullable<
            PersonTimeline['asylumSupportRepayment']
          >[],
        ),
      ),
      protectionStatusRevoked: optional(chance()),
    };
  };
  const request: SimulationRequest = {
    timeline: timeline(),
    simulationDate,
    locale: pick(['zh-CN', 'en'] as const),
  };
  if (chance(0.3)) {
    const current = episodeOn(request.timeline, simulationDate);
    request.principal = timeline(
      current?.role === 'DEPENDANT' && chance() ? current.route : undefined,
    );
  }
  switch (int(0, 5)) {
    case 1:
      request.ruleSetIds = [];
      break;
    case 2:
      request.ruleSetIds = RULE_SET_IDS.slice(0, 1);
      break;
    case 3:
      request.ruleSetIds = RULE_SET_IDS.slice(1);
      break;
    case 4:
      request.ruleSetIds = [...RULE_SET_IDS].reverse();
      break;
    case 5:
      request.ruleSetIds = [...RULE_SET_IDS];
      break;
  }
  return request;
}

const p = earnedSettlement2026_11.values;
// Contracts §7 and §11.4, SRC-001 p46–48: Safe and Legal can be 5 + 10 = 15.
const pathwayYears = [
  p.pathwayYears3.value,
  p.pathwayYears5.value,
  p.pathwayYears10.value,
  p.pathwayYears20.value,
  p.protectionPathwayYearsSafeAndLegal.value +
    p.illegalEntryAdditionalYears.value,
  p.protectionPathwayYearsCore.value + p.illegalEntryAdditionalYears.value,
];

describe('random timelines (fixed Mulberry32 seeds)', () => {
  test.each(
    Array.from({ length: CASE_COUNT }, (_, index) => FIRST_SEED + index),
  )('seed %i: output invariants and locale independence', (seed) => {
    const request = generateRequest(seed);
    try {
      const result = evaluate(request);
      const translated = evaluate({
        ...request,
        locale: request.locale === 'en' ? 'zh-CN' : 'en',
      });
      const ids = request.ruleSetIds ?? [...RULE_SET_IDS];
      for (const output of [result, translated]) {
        expect(Object.keys(output.byRuleSet).sort()).toEqual([...ids].sort());
        for (const id of ids) {
          const assessment = output.byRuleSet[id]!;
          expect([
            'LIKELY_ELIGIBLE',
            'LIKELY_NOT_ELIGIBLE',
            'POTENTIALLY_ELIGIBLE',
            'INSUFFICIENT_INFORMATION',
            'POLICY_NOT_YET_IN_FORCE',
            'REQUIRES_REGULATED_REVIEW',
          ]).toContain(assessment.outcome);
          if (assessment.outcome === 'LIKELY_ELIGIBLE') {
            expect(assessment.earliestDate).toBe(request.simulationDate);
          }
          if (
            assessment.outcome === 'LIKELY_NOT_ELIGIBLE' &&
            assessment.earliestDate !== undefined
          ) {
            expect(assessment.earliestDate > request.simulationDate).toBe(true);
            expect(assessment.pathwayYears).toBeDefined();
          }
          if (assessment.pathwayYears !== undefined) {
            expect(pathwayYears).toContain(assessment.pathwayYears);
          }
          const ruleIds = assessment.rules.map((rule) => rule.id);
          expect(new Set(ruleIds).size).toBe(ruleIds.length);
          // Contracts §16.1: with the pathway; part of rules[], in its order.
          const { decidedBy } = assessment;
          expect(decidedBy !== undefined).toBe(
            assessment.pathwayYears !== undefined,
          );
          if (decidedBy !== undefined) {
            expect(decidedBy.length).toBeGreaterThan(0);
            expect(new Set(decidedBy).size).toBe(decidedBy.length);
            expect(decidedBy).toEqual(
              ruleIds.filter((ruleId) => decidedBy.includes(ruleId)),
            );
            if (assessment.outcome === 'LIKELY_ELIGIBLE') {
              for (const rule of assessment.rules) {
                if (decidedBy.includes(rule.id)) {
                  expect(rule.status).toBe('PASS');
                }
              }
            }
          }
          for (const rule of assessment.rules) {
            expect(['PASS', 'FAIL', 'UNKNOWN']).toContain(rule.status);
            if (rule.id === 'CL-FAMILY-FINANCIAL') {
              if (
                rule.status === 'UNKNOWN' &&
                rule.pendingDetails !== undefined
              ) {
                expect(rule.pendingDetails).toEqual(['PD-075']);
              }
              if (rule.pendingDetails?.includes('PD-075')) {
                expect(request.timeline.partnerSpecifiedBenefit).toBe(true);
              }
            }
            expect(typeof rule.explanation).toBe('string');
            expect(rule.explanation.trim().length).toBeGreaterThan(0);
            for (const source of rule.sources) {
              expect(typeof source.srcId).toBe('string');
              expect(source.srcId.trim().length).toBeGreaterThan(0);
              expect(typeof source.locator).toBe('string');
              expect(source.locator.trim().length).toBeGreaterThan(0);
            }
          }
          expect(Array.isArray(assessment.assumptions)).toBe(true);
          expect(
            assessment.assumptions.every(
              (assumption) => typeof assumption === 'string',
            ),
          ).toBe(true);
          const reason = output.shortCircuit?.reason;
          if (
            reason &&
            (RULE_SETS[id].kind === 'ANNOUNCED' ||
              reason === 'CRIMINALITY' ||
              reason === 'IMMIGRATION_BREACH')
          ) {
            expect(assessment.outcome).toBe('REQUIRES_REGULATED_REVIEW');
            expect(assessment).not.toHaveProperty('pathwayYears');
            expect(assessment).not.toHaveProperty('earliestDate');
            expect(assessment).not.toHaveProperty('decidedBy');
          }
        }
      }
      expect(translated.policyAsOf).toBe(result.policyAsOf);
      expect(translated.shortCircuit?.reason).toBe(result.shortCircuit?.reason);
      for (const id of ids) {
        const original = result.byRuleSet[id]!;
        const other = translated.byRuleSet[id]!;
        expect({
          outcome: other.outcome,
          routeGroup: other.routeGroup,
          pathwayYears: other.pathwayYears,
          earliestDate: other.earliestDate,
          decidedBy: other.decidedBy,
          rules: other.rules.map(({ id, status, sources, pendingDetails }) => ({
            id,
            status,
            sources,
            pendingDetails,
          })),
        }).toEqual({
          outcome: original.outcome,
          routeGroup: original.routeGroup,
          pathwayYears: original.pathwayYears,
          earliestDate: original.earliestDate,
          decidedBy: original.decidedBy,
          rules: original.rules.map(
            ({ id, status, sources, pendingDetails }) => ({
              id,
              status,
              sources,
              pendingDetails,
            }),
          ),
        });
      }
    } catch (error) {
      console.error(JSON.stringify({ seed, request }, null, 2));
      throw error;
    }
  });
});
