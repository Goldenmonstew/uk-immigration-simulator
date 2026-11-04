import { fixtures } from '@uk-immigration/policy-data/fixtures';
import { describe, expect, test } from 'vitest';
import { evaluate } from '../src/evaluate';
import {
  clEnglish,
  clFamilyRelationship,
  clFamilyResidence,
  clGtResidence,
  clHkbnoResidence5Y,
  clKol,
  clScope,
} from '../src/rules/current-law';
import type { ImmigrationEpisode, PersonTimeline } from '../src/types';
import { run, timeline } from './helpers';

// Current-law main applicants added in Phase 4.2 (contracts §12).

const on = (
  route: ImmigrationEpisode['route'],
  validFrom: string,
  extra: Partial<ImmigrationEpisode> = {},
): ImmigrationEpisode => ({
  route,
  role: 'MAIN',
  validFrom,
  validTo: '2031-12-31',
  ...extra,
});

const currentLaw = (
  overrides: Partial<PersonTimeline>,
  simulationDate: string,
) =>
  evaluate({ timeline: timeline(overrides), simulationDate }).byRuleSet[
    'current-law-2026-11'
  ]!;

describe('Hong Kong BN(O) (SRC-020)', () => {
  const bno = (validFrom: string, extra: Partial<ImmigrationEpisode> = {}) => ({
    episodes: [on('HONG_KONG_BNO', validFrom, extra)],
    english: { cefrLevel: 'B1' as const },
  });

  test('CL-SCOPE: a main applicant is in scope, a dependant is not', () => {
    expect(run(clScope, bno('2021-02-01')).status).toBe('PASS');
    const dependant = run(clScope, bno('2021-02-01', { role: 'DEPENDANT' }));
    expect(dependant.status).toBe('UNKNOWN');
    expect(dependant.explanation).toContain('只建模该路线的主申请人');
    expect(
      currentLaw(bno('2021-02-01', { role: 'DEPENDANT' }), '2026-02-01')
        .outcome,
    ).toBe('INSUFFICIENT_INFORMATION');
  });

  test('5 years to the day: likely eligible on the 5-year pathway', () => {
    expect(
      run(clHkbnoResidence5Y, bno('2021-02-01'), '2026-02-01').status,
    ).toBe('PASS');
    expect(currentLaw(bno('2021-02-01'), '2026-02-01')).toMatchObject({
      outcome: 'LIKELY_ELIGIBLE',
      pathwayYears: 5,
      earliestDate: '2026-02-01',
    });
  });

  test('a day short: projects the date 5 years on', () => {
    const short = run(clHkbnoResidence5Y, bno('2021-02-02'), '2026-02-01');
    expect(short.status).toBe('FAIL');
    expect(short.explanation).toContain('2026-02-02');
    expect(currentLaw(bno('2021-02-02'), '2026-02-01')).toMatchObject({
      outcome: 'LIKELY_NOT_ELIGIBLE',
      pathwayYears: 5,
      earliestDate: '2026-02-02',
    });
  });

  test('only BN(O) time counts; earlier permission is named in an assumption (PD-069)', () => {
    const episodes = [
      on('SKILLED_WORKER', '2019-01-01', { validTo: '2022-12-31' }),
      on('HONG_KONG_BNO', '2023-01-01'),
    ];
    const result = run(clHkbnoResidence5Y, { episodes }, '2026-11-04');
    expect(result.status).toBe('FAIL');
    expect(result.explanation).toContain('自 2023-01-01 起');
    expect(result.assumptions?.join()).toContain('PD-069');
    expect(
      run(clHkbnoResidence5Y, bno('2023-01-01'), '2026-11-04').assumptions,
    ).toEqual([]);
  });

  test('181 days abroad in 12 months restarts the period (HK 63.1, CR 3.1)', () => {
    const result = run(
      clHkbnoResidence5Y,
      {
        ...bno('2021-02-01'),
        absences: [{ from: '2022-01-01', to: '2022-06-30' }],
      },
      '2026-02-01',
    );
    expect(result.status).toBe('FAIL');
    expect(result.explanation).toContain('2027-07-01');
  });

  test('English is B1 before and after 2027-03-26 (HK 60.1)', () => {
    for (const date of ['2027-03-25', '2027-03-26']) {
      const b1 = run(clEnglish, bno('2021-02-01'), date);
      expect(b1.status).toBe('PASS');
      expect(b1.explanation).toContain('HK 60.1');
      expect(
        run(
          clEnglish,
          { ...bno('2021-02-01'), english: { cefrLevel: 'A2' } },
          date,
        ).status,
      ).toBe('FAIL');
    }
    // No B2 note on a projected date after 2027-03-26.
    expect(
      currentLaw(bno('2023-01-01'), '2026-11-04').assumptions.join(),
    ).not.toContain('B2');
  });

  test('Long Residence alongside still needs B2 from 2027-03-26 (LR 13.1(b))', () => {
    const episodes = [
      on('STUDENT', '2017-01-01', { validTo: '2023-12-31' }),
      on('HONG_KONG_BNO', '2024-01-01'),
    ];
    const b1 = currentLaw(
      { episodes, english: { cefrLevel: 'B1' } },
      '2027-06-01',
    );
    expect(b1).toMatchObject({
      outcome: 'LIKELY_NOT_ELIGIBLE',
      pathwayYears: 5,
      earliestDate: '2029-01-01',
    });
    expect(b1.assumptions.join()).toContain('LR 13.1(b)');
    expect(
      currentLaw({ episodes, english: { cefrLevel: 'B2' } }, '2027-06-01'),
    ).toMatchObject({ outcome: 'LIKELY_ELIGIBLE', pathwayYears: 10 });
    expect(
      currentLaw({ episodes, english: { cefrLevel: 'B1' } }, '2027-03-25'),
    ).toMatchObject({ outcome: 'LIKELY_ELIGIBLE', pathwayYears: 10 });
  });

  test('Life in the UK: HK 61.1, missing is unknown', () => {
    expect(run(clKol, bno('2021-02-01')).explanation).toContain('HK 61.1');
    expect(
      run(clKol, { ...bno('2021-02-01'), lifeInTheUk: undefined }).status,
    ).toBe('UNKNOWN');
  });
});

describe('Global Talent (SRC-021)', () => {
  const gt = (
    validFrom: string,
    extra: Partial<ImmigrationEpisode> = {
      globalTalentEndorsement: 'ARTS_COUNCIL_ENGLAND',
      globalTalentCriteria: 'EXCEPTIONAL_TALENT',
    },
  ) => ({
    episodes: [on('GLOBAL_TALENT', validFrom, extra)],
    english: { cefrLevel: 'B1' as const },
  });

  test('CL-SCOPE: a main applicant is in scope, a dependant is not', () => {
    expect(run(clScope, gt('2023-11-04')).status).toBe('PASS');
    expect(run(clScope, gt('2023-11-04', { role: 'DEPENDANT' })).status).toBe(
      'UNKNOWN',
    );
  });

  test('exceptional talent: 3 years to the day is likely eligible; a day short projects the date', () => {
    expect(currentLaw(gt('2023-11-04'), '2026-11-04')).toMatchObject({
      outcome: 'LIKELY_ELIGIBLE',
      pathwayYears: 3,
      earliestDate: '2026-11-04',
    });
    const short = run(clGtResidence, gt('2023-11-05'), '2026-11-04');
    expect(short.status).toBe('FAIL');
    expect(short.explanation).toContain('GT 11.1(b)');
    expect(currentLaw(gt('2023-11-05'), '2026-11-04')).toMatchObject({
      outcome: 'LIKELY_NOT_ELIGIBLE',
      pathwayYears: 3,
      earliestDate: '2026-11-05',
    });
  });

  test('3 years for research bodies and prizes, 5 for exceptional promise (GT 11.1–11.2)', () => {
    const years = (extra: Partial<ImmigrationEpisode>) =>
      currentLaw(gt('2021-11-04', extra), '2026-11-04');
    expect(years({ globalTalentEndorsement: 'RESEARCH_BODY' })).toMatchObject({
      outcome: 'LIKELY_ELIGIBLE',
      pathwayYears: 3,
    });
    expect(years({ globalTalentEndorsement: 'PRIZE' })).toMatchObject({
      pathwayYears: 3,
    });
    expect(
      years({
        globalTalentEndorsement: 'TECH_NATION',
        globalTalentCriteria: 'EXCEPTIONAL_PROMISE',
      }),
    ).toMatchObject({ outcome: 'LIKELY_ELIGIBLE', pathwayYears: 5 });
    const promise = currentLaw(
      gt('2023-11-04', {
        globalTalentEndorsement: 'ARTS_COUNCIL_ENGLAND',
        globalTalentCriteria: 'EXCEPTIONAL_PROMISE',
      }),
      '2026-11-04',
    );
    expect(promise).toMatchObject({
      outcome: 'LIKELY_NOT_ELIGIBLE',
      pathwayYears: 5,
      earliestDate: '2028-11-04',
    });
    // Projected past 2027-03-26: B2 then (GT 13.1(b)).
    expect(promise.assumptions.join()).toContain('GT 13.1(b)');
  });

  test('missing endorsement or criteria is unknown: insufficient information, no pathway', () => {
    for (const extra of [
      {},
      { globalTalentEndorsement: 'TECH_NATION' as const },
    ]) {
      const rule = run(clGtResidence, gt('2021-11-04', extra), '2026-11-04');
      expect(rule.status).toBe('UNKNOWN');
      expect(rule.pendingDetails ?? []).toEqual([]);
      const a = currentLaw(gt('2021-11-04', extra), '2026-11-04');
      expect(a.outcome).toBe('INSUFFICIENT_INFORMATION');
      expect(a.pathwayYears).toBeUndefined();
    }
  });

  test('GT 11.3: Skilled Worker time before Global Talent counts; dependant time does not', () => {
    const episodes = (role: 'MAIN' | 'DEPENDANT') => [
      on('SKILLED_WORKER', '2022-01-01', { role, validTo: '2024-12-31' }),
      on('GLOBAL_TALENT', '2025-01-01', {
        globalTalentEndorsement: 'RESEARCH_BODY',
      }),
    ];
    expect(
      run(clGtResidence, { episodes: episodes('MAIN') }, '2026-11-04')
        .explanation,
    ).toContain('自 2022-01-01 起');
    expect(
      run(clGtResidence, { episodes: episodes('DEPENDANT') }, '2026-11-04')
        .explanation,
    ).toContain('自 2025-01-01 起');
  });

  test('English: B1 before 2027-03-26, B2 from then (GT 13.1)', () => {
    const before = run(clEnglish, gt('2023-11-04'), '2027-03-25');
    expect(before.status).toBe('PASS');
    expect(before.explanation).toContain('GT 13.1(a)');
    const after = run(clEnglish, gt('2023-11-04'), '2027-03-26');
    expect(after.status).toBe('FAIL');
    expect(after.explanation).toContain('GT 13.1(b)');
    expect(
      run(
        clEnglish,
        { ...gt('2023-11-04'), english: { cefrLevel: 'B2' } },
        '2027-03-26',
      ).status,
    ).toBe('PASS');
  });

  test('Life in the UK: GT 14.1', () => {
    expect(run(clKol, gt('2023-11-04')).explanation).toContain('GT 14.1');
  });
});

describe('family partner, 10-year route (SRC-022)', () => {
  const partner = (
    validFrom: string,
    extra: Partial<ImmigrationEpisode> = {
      familyPermission: 'PARTNER_TEN_YEAR',
    },
    otherPartyStatus:
      'BRITISH_CITIZEN' | 'SETTLED' | 'OTHER' = 'BRITISH_CITIZEN',
  ): Partial<PersonTimeline> => ({
    episodes: [on('FAMILY_PARTNER_OR_PARENT', validFrom, extra)],
    relationships: [{ type: 'PARTNER', otherPartyStatus }],
    english: { cefrLevel: 'B1' },
  });

  test('10 years to the day is likely eligible; a day short projects the date', () => {
    expect(currentLaw(partner('2016-11-04'), '2026-11-04')).toMatchObject({
      outcome: 'LIKELY_ELIGIBLE',
      pathwayYears: 10,
      earliestDate: '2026-11-04',
    });
    const short = run(clFamilyResidence, partner('2016-11-05'), '2026-11-04');
    expect(short.status).toBe('FAIL');
    expect(short.explanation).toContain('2026-11-05');
    expect(currentLaw(partner('2016-11-05'), '2026-11-04')).toMatchObject({
      outcome: 'LIKELY_NOT_ELIGIBLE',
      pathwayYears: 10,
      earliestDate: '2026-11-05',
    });
  });

  test('SETF 3.1: private life time counts; Skilled Worker time is named in an assumption (PD-069)', () => {
    const before = (route: ImmigrationEpisode['route']) => ({
      ...partner('2021-01-01'),
      episodes: [
        on(route, '2016-01-01', { validTo: '2020-12-31' }),
        on('FAMILY_PARTNER_OR_PARENT', '2021-01-01', {
          familyPermission: 'PARTNER_TEN_YEAR',
        }),
      ],
    });
    const privateLife = run(
      clFamilyResidence,
      before('FAMILY_AND_PRIVATE_LIFE'),
      '2026-11-04',
    );
    expect(privateLife.explanation).toContain('自 2016-01-01 起');
    const sw = run(clFamilyResidence, before('SKILLED_WORKER'), '2026-11-04');
    expect(sw.explanation).toContain('自 2021-01-01 起');
    expect(sw.assumptions?.join()).toContain('PD-069');
  });

  test('missing route, or the 5-year route (not yet modelled), is unknown: insufficient information', () => {
    for (const extra of [
      {},
      { familyPermission: 'PARTNER_FIVE_YEAR' as const },
    ]) {
      expect(
        run(clFamilyResidence, partner('2018-11-04', extra), '2026-11-04')
          .status,
      ).toBe('UNKNOWN');
      // Long Residence is not met either.
      const a = currentLaw(partner('2018-11-04', extra), '2026-11-04');
      expect(a.outcome).toBe('INSUFFICIENT_INFORMATION');
      expect(a.pathwayYears).toBeUndefined();
    }
  });

  test('the parent route and dependants are out of scope', () => {
    const parent = run(
      clScope,
      partner('2020-11-04', { familyPermission: 'PARENT' }),
    );
    expect(parent.status).toBe('UNKNOWN');
    expect(parent.explanation).toContain('父母路线未建模');
    expect(
      run(clScope, partner('2020-11-04', { role: 'DEPENDANT' })).status,
    ).toBe('UNKNOWN');
  });

  test('SETF 7.1: British citizen or settled partner passes; OTHER or none is unknown', () => {
    expect(run(clFamilyRelationship, partner('2016-11-04')).status).toBe(
      'PASS',
    );
    expect(
      run(clFamilyRelationship, partner('2016-11-04', undefined, 'SETTLED'))
        .explanation,
    ).toContain('SETF 7.1(b)');
    expect(
      run(clFamilyRelationship, partner('2016-11-04', undefined, 'OTHER'))
        .status,
    ).toBe('UNKNOWN');
    expect(
      run(clFamilyRelationship, { ...partner('2016-11-04'), relationships: [] })
        .status,
    ).toBe('UNKNOWN');
    // The same 10 years also meet Long Residence, which has no partner
    // requirement.
    expect(
      currentLaw(partner('2016-11-04', undefined, 'OTHER'), '2026-11-04'),
    ).toMatchObject({ outcome: 'LIKELY_ELIGIBLE', pathwayYears: 10 });
  });

  test('English: B1 before 2027-03-26, B2 from then (SETF 5.1); Life in the UK SETF 6.1', () => {
    const before = run(clEnglish, partner('2016-11-04'), '2027-03-25');
    expect(before.status).toBe('PASS');
    expect(before.explanation).toContain('SETF 5.1(a)');
    const after = run(clEnglish, partner('2016-11-04'), '2027-03-26');
    expect(after.status).toBe('FAIL');
    expect(after.explanation).toContain('SETF 5.1(b)');
    expect(run(clKol, partner('2016-11-04')).explanation).toContain('SETF 6.1');
  });
});

describe('fixtures: the Earned Settlement column is unchanged', () => {
  const result = (id: string) =>
    evaluate(fixtures.find((f) => f.id === id)!.request);

  test('Hong Kong BN(O) short-circuits as outside the framework', () => {
    const r = result('CL-HKBNO-FIVE-YEARS');
    expect(r.shortCircuit?.reason).toBe('OUTSIDE_FRAMEWORK');
    expect(r.byRuleSet['earned-settlement-2026-11']?.outcome).toBe(
      'REQUIRES_REGULATED_REVIEW',
    );
  });

  test('Global Talent is assessed as usual', () => {
    const r = result('CL-GLOBAL-TALENT-THREE-YEARS');
    expect(r.shortCircuit).toBeUndefined();
    expect(
      r.byRuleSet['earned-settlement-2026-11']?.rules.find(
        (x) => x.id === 'ES-ROUTE-GROUP',
      )?.status,
    ).toBe('PASS');
  });
});
