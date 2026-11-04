import { describe, expect, test } from 'vitest';
import { clScope } from '../src/rules/current-law';
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
