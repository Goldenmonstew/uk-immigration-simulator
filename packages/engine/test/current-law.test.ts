import { describe, expect, test } from 'vitest';
import {
  clEnglish,
  clScope,
  clSwResidence5Y,
  clSwSalary,
} from '../src/rules/current-law';
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

describe('CL-SW-SALARY', () => {
  const at = (salary?: number) =>
    run(clSwSalary, { episodes: [episode({ salary })] }).status;

  test('£41,700 passes with a going-rate assumption; £41,699 is unknown', () => {
    expect(at(41700)).toBe('PASS');
    expect(run(clSwSalary).assumptions?.[0]).toContain('going rate');
    expect(at(41699)).toBe('UNKNOWN');
  });

  test('missing salary is unknown', () => {
    expect(at(undefined)).toBe('UNKNOWN');
  });
});

describe('CL-ENGLISH', () => {
  const b1 = { english: { cefrLevel: 'B1' as const } };

  test('Skilled Worker: no settlement English before 2027-03-26, B2 from then', () => {
    expect(run(clEnglish, { english: undefined }, '2027-03-25').status).toBe(
      'PASS',
    );
    expect(run(clEnglish, b1, '2027-03-26').status).toBe('FAIL');
    expect(run(clEnglish, {}, '2027-03-26').status).toBe('PASS');
    expect(run(clEnglish, { english: undefined }, '2027-03-26').status).toBe(
      'UNKNOWN',
    );
  });

  test('Long Residence: B1 before 2027-03-26, B2 from then', () => {
    const lr = {
      ...b1,
      episodes: [
        episode({
          route: 'STUDENT',
          validFrom: '2015-01-01',
          validTo: '2028-01-01',
        }),
      ],
    };
    expect(run(clEnglish, lr, '2027-03-25').status).toBe('PASS');
    expect(run(clEnglish, lr, '2027-03-26').status).toBe('FAIL');
    expect(
      run(clEnglish, { ...lr, english: { cefrLevel: 'A2' } }, '2027-03-25')
        .status,
    ).toBe('FAIL');
  });

  test('exempt at 65, not at 64', () => {
    expect(
      run(clEnglish, { ...b1, dateOfBirth: '1962-03-26' }, '2027-03-26').status,
    ).toBe('PASS');
    expect(
      run(clEnglish, { ...b1, dateOfBirth: '1962-03-27' }, '2027-03-26').status,
    ).toBe('FAIL');
  });
});
