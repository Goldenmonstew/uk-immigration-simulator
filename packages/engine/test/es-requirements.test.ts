import { describe, expect, test } from 'vitest';
import { esCriminality, esDebt } from '../src/rules/es-requirements';
import { run } from './helpers';

describe('ES-CRIMINALITY', () => {
  test('no record passes', () => {
    expect(run(esCriminality).status).toBe('PASS');
  });

  test('an adult record fails', () => {
    expect(
      run(esCriminality, { criminalRecord: [{ date: '2020-03-01' }] }).status,
    ).toBe('FAIL');
  });

  test('a record from the day before the 18th birthday is unknown, from the birthday fails', () => {
    const minor = run(esCriminality, {
      criminalRecord: [{ date: '2008-01-14' }],
    });
    expect(minor.status).toBe('UNKNOWN');
    expect(minor.pendingDetails).toEqual(['PD-017']);
    expect(
      run(esCriminality, { criminalRecord: [{ date: '2008-01-15' }] }).status,
    ).toBe('FAIL');
  });
});

describe('ES-DEBT', () => {
  test('no outstanding debt passes', () => {
    expect(run(esDebt).status).toBe('PASS');
  });

  test('outstanding debt fails', () => {
    expect(run(esDebt, { governmentDebt: { outstanding: true } }).status).toBe(
      'FAIL',
    );
  });

  test('not answered is unknown from missing input', () => {
    const result = run(esDebt, { governmentDebt: undefined });
    expect(result.status).toBe('UNKNOWN');
    expect(result.pendingDetails).toBeUndefined();
  });
});
