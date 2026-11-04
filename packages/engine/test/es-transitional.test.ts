import { describe, expect, test } from 'vitest';
import { esTransitionalCareWorker } from '../src/rules/es-transitional';
import type { ImmigrationEpisode } from '../src/types';
import { run } from './helpers';

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
