import { describe, expect, test } from 'vitest';
import { evaluate } from '../src/evaluate';
import {
  clEnglish,
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
