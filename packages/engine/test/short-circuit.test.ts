import { describe, expect, test } from 'vitest';
import { evaluate } from '../src/evaluate';
import type { PersonTimeline } from '../src/types';
import { SIMULATION_DATE, timeline } from './helpers';

function result(overrides: Partial<PersonTimeline>) {
  return evaluate({
    timeline: timeline(overrides),
    simulationDate: SIMULATION_DATE,
  });
}

describe('short circuits', () => {
  test('a criminal record stops both columns', () => {
    const r = result({ criminalRecord: [{ date: '2021-05-01' }] });
    expect(r.shortCircuit?.reason).toBe('CRIMINALITY');
    expect(r.byRuleSet['earned-settlement-2026-11']?.outcome).toBe(
      'REQUIRES_REGULATED_REVIEW',
    );
    expect(r.byRuleSet['current-law-2026-11']?.outcome).toBe(
      'REQUIRES_REGULATED_REVIEW',
    );
  });

  test('an outside-framework route stops only the Earned Settlement column', () => {
    const r = result({
      episodes: [
        {
          route: 'HONG_KONG_BNO',
          role: 'MAIN',
          validFrom: '2022-01-01',
          validTo: '2027-01-01',
        },
      ],
    });
    expect(r.shortCircuit?.reason).toBe('OUTSIDE_FRAMEWORK');
    expect(r.byRuleSet['earned-settlement-2026-11']?.outcome).toBe(
      'REQUIRES_REGULATED_REVIEW',
    );
    expect(r.byRuleSet['current-law-2026-11']?.outcome).not.toBe(
      'REQUIRES_REGULATED_REVIEW',
    );
  });

  test('no short circuit by default', () => {
    expect(result({}).shortCircuit).toBeUndefined();
  });
});
