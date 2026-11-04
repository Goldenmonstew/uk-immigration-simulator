import { describe, expect, test } from 'vitest';
import { evaluate } from '../src/evaluate';
import {
  esTransitionalCareWorker,
  esTransitionalHealthEducation,
} from '../src/rules/es-transitional';
import type { ImmigrationEpisode } from '../src/types';
import { run, timeline } from './helpers';

function care(
  validFrom: string,
  extra: Partial<ImmigrationEpisode> = {},
): ImmigrationEpisode {
  return {
    route: 'SKILLED_WORKER',
    role: 'MAIN',
    validFrom,
    validTo: '2028-01-31',
    socCode: '6135',
    salary: 25000,
    ...extra,
  };
}

describe('ES-TRANSITIONAL-CARE-WORKER', () => {
  test('care worker who entered in 2023 on £25,000 keeps 5 years', () => {
    expect(
      run(esTransitionalCareWorker, { episodes: [care('2023-02-01')] }).status,
    ).toBe('PASS');
  });

  test('cut-off: 2025-05-11 applies, 2025-05-12 does not', () => {
    expect(
      run(esTransitionalCareWorker, { episodes: [care('2025-05-11')] }).status,
    ).toBe('PASS');
    expect(
      run(esTransitionalCareWorker, { episodes: [care('2025-05-12')] }).status,
    ).toBe('FAIL');
  });

  test('salary: £24,999 fails, missing is unknown', () => {
    expect(
      run(esTransitionalCareWorker, {
        episodes: [care('2023-02-01', { salary: 24999 })],
      }).status,
    ).toBe('FAIL');
    expect(
      run(esTransitionalCareWorker, {
        episodes: [care('2023-02-01', { salary: undefined })],
      }).status,
    ).toBe('UNKNOWN');
  });

  test('care worker before the cut-off who returned after it is unknown (PD-036)', () => {
    const result = run(esTransitionalCareWorker, {
      episodes: [
        care('2023-02-01', { validTo: '2024-01-31' }),
        care('2025-08-01'),
      ],
    });
    expect(result.status).toBe('UNKNOWN');
    expect(result.pendingDetails).toEqual(['PD-036']);
  });

  test('other occupations do not apply', () => {
    expect(run(esTransitionalCareWorker).status).toBe('FAIL');
  });
});

describe('ES-TRANSITIONAL-HEALTH-EDUCATION', () => {
  const job = (
    validFrom: string,
    socCode = '6131',
    extra: Partial<ImmigrationEpisode> = {},
  ): ImmigrationEpisode => ({
    route: 'SKILLED_WORKER',
    role: 'MAIN',
    validFrom,
    validTo: '2029-12-31',
    socCode,
    salary: 26000,
    ...extra,
  });
  const at = (episodes: ImmigrationEpisode[], date = '2029-03-01') =>
    run(esTransitionalHealthEducation, { episodes }, date);

  test('a nursing auxiliary who came in 2024 keeps the 5-year pathway', () => {
    const rule = at([job('2024-03-01')]);
    expect(rule.status).toBe('PASS');
    expect(rule.assumptions?.join('')).toContain('p46');
    const es = evaluate({
      timeline: timeline({ episodes: [job('2024-03-01')] }),
      simulationDate: '2029-03-01',
    }).byRuleSet['earned-settlement-2026-11']!;
    expect(es).toMatchObject({ outcome: 'LIKELY_ELIGIBLE', pathwayYears: 5 });
    expect(es.assumptions.join('')).toContain('过渡安排与标准路径');
    expect(at([job('2024-03-01', '6112')]).status).toBe('PASS');
  });

  test('cut-off: 2025-05-11 applies, 2025-05-12 does not', () => {
    expect(at([job('2025-05-11')]).status).toBe('PASS');
    expect(at([job('2025-05-12')], '2030-06-01').status).toBe('FAIL');
  });

  test('in the UK before the cut-off but in the job only after it is pending (PD-039)', () => {
    const switched = at([
      job('2023-09-01', '6131', { route: 'STUDENT', socCode: undefined }),
      job('2025-06-01'),
    ]);
    expect(switched).toMatchObject({
      status: 'UNKNOWN',
      pendingDetails: ['PD-039'],
    });
  });

  test('another Table 3a occupation is pending (PD-038); others do not apply', () => {
    expect(at([job('2024-03-01', '6133')])).toMatchObject({
      status: 'UNKNOWN',
      pendingDetails: ['PD-038'],
    });
    // RQF 6+ Table 3 nurse and a care worker are not this arrangement.
    expect(at([job('2024-03-01', '2231')]).status).toBe('FAIL');
    expect(at([job('2024-03-01', '6135')]).status).toBe('FAIL');
    expect(at([job('2024-03-01', '6131', { socCode: undefined })]).status).toBe(
      'FAIL',
    );
  });
});
