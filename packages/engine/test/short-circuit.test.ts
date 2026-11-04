import { describe, expect, test } from 'vitest';
import { evaluate } from '../src/evaluate';
import type { PersonTimeline } from '../src/types';
import { asDependant, SIMULATION_DATE, timeline } from './helpers';

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

  test('a legacy UK Resettlement Scheme arrival is outside the framework', () => {
    const r = result({
      episodes: [
        {
          route: 'SAFE_AND_LEGAL',
          role: 'MAIN',
          validFrom: '2024-01-01',
          validTo: '2029-01-01',
          resettlementScheme: 'UK_RESETTLEMENT_SCHEME',
        },
      ],
    });
    expect(r.shortCircuit?.reason).toBe('OUTSIDE_FRAMEWORK');
    expect(r.byRuleSet['earned-settlement-2026-11']?.outcome).toBe(
      'REQUIRES_REGULATED_REVIEW',
    );
  });

  test("a principal's criminal record stops both of the dependant's columns", () => {
    const r = evaluate({
      timeline: timeline({ episodes: asDependant('PARTNER') }),
      principal: timeline({ criminalRecord: [{ date: '2021-05-01' }] }),
      simulationDate: SIMULATION_DATE,
    });
    expect(r.shortCircuit?.reason).toBe('CRIMINALITY');
    expect(r.shortCircuit?.message).toMatch(/^主申请人：/);
    expect(r.byRuleSet['earned-settlement-2026-11']?.outcome).toBe(
      'REQUIRES_REGULATED_REVIEW',
    );
    expect(r.byRuleSet['current-law-2026-11']?.outcome).toBe(
      'REQUIRES_REGULATED_REVIEW',
    );
  });

  test("the dependant's own short circuit takes precedence", () => {
    const r = evaluate({
      timeline: timeline({
        episodes: asDependant('PARTNER'),
        criminalRecord: [{ date: '2021-05-01' }],
      }),
      principal: timeline({
        immigrationBreaches: [{ type: 'ILLEGAL_ENTRY', date: '2015-01-01' }],
      }),
      simulationDate: SIMULATION_DATE,
    });
    expect(r.shortCircuit?.reason).toBe('CRIMINALITY');
    expect(r.shortCircuit?.message).not.toMatch(/^主申请人/);
  });

  test("a principal's short circuit is ignored for a main applicant", () => {
    const r = evaluate({
      timeline: timeline(),
      principal: timeline({ criminalRecord: [{ date: '2021-05-01' }] }),
      simulationDate: SIMULATION_DATE,
    });
    expect(r.shortCircuit).toBeUndefined();
  });

  test('no short circuit by default', () => {
    expect(result({}).shortCircuit).toBeUndefined();
  });
});
