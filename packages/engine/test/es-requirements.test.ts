import { describe, expect, test } from 'vitest';
import {
  esBreach,
  esCriminality,
  esDebt,
  esEnglishB2,
  esKol,
} from '../src/rules/es-requirements';
import { evaluate } from '../src/evaluate';
import { asDependant, run, SIMULATION_DATE, timeline } from './helpers';

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
  test('a child dependant is exempt until the day before turning 18 (p29)', () => {
    const child = (dateOfBirth: string) =>
      run(esDebt, {
        dateOfBirth,
        episodes: asDependant('PARENT'),
        governmentDebt: { outstanding: true },
      });
    expect(child('2008-11-05').status).toBe('PASS');
    expect(child('2008-11-05').sources).toEqual([
      { srcId: 'SRC-001', locator: 'p29' },
    ]);
    expect(child('2008-11-04').status).toBe('FAIL');
  });

  test('a partner dependant under 18 is not exempt', () => {
    expect(
      run(esDebt, {
        dateOfBirth: '2008-11-05',
        episodes: asDependant('PARTNER'),
        governmentDebt: { outstanding: true },
      }).status,
    ).toBe('FAIL');
  });
});

describe('ES-ENGLISH-B2', () => {
  test('B2 and above pass, B1 fails', () => {
    expect(run(esEnglishB2).status).toBe('PASS');
    expect(run(esEnglishB2, { english: { cefrLevel: 'C1' } }).status).toBe(
      'PASS',
    );
    expect(run(esEnglishB2, { english: { cefrLevel: 'B1' } }).status).toBe(
      'FAIL',
    );
  });

  test('exempt passes; missing is unknown', () => {
    expect(run(esEnglishB2, { english: { exempt: true } }).status).toBe('PASS');
    expect(run(esEnglishB2, { english: undefined }).status).toBe('UNKNOWN');
  });

  test('age exemption from 65, not at 64', () => {
    const b1 = { english: { cefrLevel: 'B1' as const } };
    expect(run(esEnglishB2, { ...b1, dateOfBirth: '1961-11-05' }).status).toBe(
      'FAIL',
    );
    expect(run(esEnglishB2, { ...b1, dateOfBirth: '1961-11-04' }).status).toBe(
      'PASS',
    );
  });

  test('age exemption under 18, not at 18', () => {
    const none = { english: undefined };
    expect(
      run(esEnglishB2, { ...none, dateOfBirth: '2008-11-05' }).status,
    ).toBe('PASS');
    expect(
      run(esEnglishB2, { ...none, dateOfBirth: '2008-11-04' }).status,
    ).toBe('UNKNOWN');
  });
});

describe('ES-KOL', () => {
  test('passed or exempt passes; missing is unknown', () => {
    expect(run(esKol).status).toBe('PASS');
    expect(run(esKol, { lifeInTheUk: { exempt: true } }).status).toBe('PASS');
    expect(run(esKol, { lifeInTheUk: undefined }).status).toBe('UNKNOWN');
  });

  test('age exemption from 65, not at 64', () => {
    const none = { lifeInTheUk: undefined };
    expect(run(esKol, { ...none, dateOfBirth: '1961-11-05' }).status).toBe(
      'UNKNOWN',
    );
    expect(run(esKol, { ...none, dateOfBirth: '1961-11-04' }).status).toBe(
      'PASS',
    );
  });
});

describe('ES-BREACH', () => {
  test('no breach passes; adult overstaying fails', () => {
    expect(run(esBreach).status).toBe('PASS');
    expect(
      run(esBreach, {
        immigrationBreaches: [{ type: 'OVERSTAYING', date: '2018-05-01' }],
      }).status,
    ).toBe('FAIL');
  });

  test('a breach the day before turning 18 is ignored, on the birthday it counts', () => {
    expect(
      run(esBreach, {
        immigrationBreaches: [{ type: 'DECEPTION', date: '2008-01-14' }],
      }).status,
    ).toBe('PASS');
    expect(
      run(esBreach, {
        immigrationBreaches: [{ type: 'DECEPTION', date: '2008-01-15' }],
      }).status,
    ).toBe('FAIL');
  });

  test('adult illegal entry is unknown (PD-044) and short-circuits', () => {
    const breaches = {
      immigrationBreaches: [
        { type: 'ILLEGAL_ENTRY' as const, date: '2015-01-01' },
      ],
    };
    expect(run(esBreach, breaches).pendingDetails).toEqual(['PD-044']);
    const result = evaluate({
      timeline: timeline(breaches),
      simulationDate: SIMULATION_DATE,
    });
    expect(result.shortCircuit?.reason).toBe('IMMIGRATION_BREACH');
  });
});
