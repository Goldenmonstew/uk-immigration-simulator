import { describe, expect, test } from 'vitest';
import { clScope, clSwResidence5Y } from '../src/rules/current-law';
import type { ImmigrationEpisode } from '../src/types';
import { run } from './helpers';

const episode = (
  extra: Partial<ImmigrationEpisode> = {},
): ImmigrationEpisode => ({
  route: 'SKILLED_WORKER',
  role: 'MAIN',
  validFrom: '2019-11-01',
  validTo: '2027-10-31',
  salary: 60000,
  ...extra,
});

describe('CL-SCOPE', () => {
  test('Skilled Worker main applicant is in scope', () => {
    expect(run(clScope).status).toBe('PASS');
  });

  test('a dependant or another route is out of scope', () => {
    expect(
      run(clScope, { episodes: [episode({ role: 'DEPENDANT' })] }).status,
    ).toBe('UNKNOWN');
    expect(
      run(clScope, { episodes: [episode({ route: 'GLOBAL_TALENT' })] }).status,
    ).toBe('UNKNOWN');
  });
});

describe('CL-SW-RESIDENCE-5Y', () => {
  test('5 years to the day passes, a day short fails with the due date', () => {
    expect(
      run(clSwResidence5Y, { episodes: [episode({ validFrom: '2021-11-04' })] })
        .status,
    ).toBe('PASS');
    const short = run(clSwResidence5Y, {
      episodes: [episode({ validFrom: '2021-11-05' })],
    });
    expect(short.status).toBe('FAIL');
    expect(short.explanation).toContain('2026-11-05');
  });

  test('Graduate time before Skilled Worker does not count', () => {
    const result = run(clSwResidence5Y, {
      episodes: [
        episode({
          route: 'GRADUATE',
          validFrom: '2019-11-01',
          validTo: '2021-10-31',
        }),
        episode({ validFrom: '2021-11-01' }),
      ],
    });
    expect(result.explanation).toContain('自 2021-11-01 起');
  });

  test('181 days abroad in 12 months restarts the period', () => {
    const result = run(clSwResidence5Y, {
      absences: [{ from: '2023-01-01', to: '2023-06-30' }],
    });
    expect(result.status).toBe('FAIL');
    expect(result.explanation).toContain('2028-07-01');
  });

  test('a dependant does not count', () => {
    expect(
      run(clSwResidence5Y, { episodes: [episode({ role: 'DEPENDANT' })] })
        .status,
    ).toBe('FAIL');
  });
});
