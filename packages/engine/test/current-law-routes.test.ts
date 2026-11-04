import { describe, expect, test } from 'vitest';
import { evaluate } from '../src/evaluate';
import {
  clEnglish,
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
