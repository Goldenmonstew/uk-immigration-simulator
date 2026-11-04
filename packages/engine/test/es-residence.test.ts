import { describe, expect, test } from 'vitest';
import { esRouteGroup } from '../src/rules/es-residence';
import type { ImmigrationEpisode, Route } from '../src/index';
import { run } from './helpers';

function on(
  route: Route,
  extra: Partial<ImmigrationEpisode> = {},
): ImmigrationEpisode {
  return {
    route,
    role: 'MAIN',
    validFrom: '2024-01-01',
    validTo: '2027-12-31',
    ...extra,
  };
}

describe('ES-ROUTE-GROUP', () => {
  test('core permission passes', () => {
    expect(run(esRouteGroup).status).toBe('PASS');
  });

  test('Student fails as a non-counting route', () => {
    expect(run(esRouteGroup, { episodes: [on('STUDENT')] }).status).toBe(
      'FAIL',
    );
  });

  test('LOTR and unlisted routes are unknown for policy reasons', () => {
    expect(
      run(esRouteGroup, { episodes: [on('LEAVE_OUTSIDE_THE_RULES')] })
        .pendingDetails,
    ).toEqual(['PD-022']);
    expect(
      run(esRouteGroup, { episodes: [on('OTHER')] }).pendingDetails,
    ).toEqual(['PD-023']);
  });

  test('outside framework and protection are unknown here and short-circuit in evaluate', () => {
    expect(run(esRouteGroup, { episodes: [on('HONG_KONG_BNO')] }).status).toBe(
      'UNKNOWN',
    );
    expect(
      run(esRouteGroup, { episodes: [on('CORE_PROTECTION')] }).status,
    ).toBe('UNKNOWN');
  });

  test('an episode ending the day before the simulation date does not count', () => {
    const result = run(esRouteGroup, {
      episodes: [on('SKILLED_WORKER', { validTo: '2026-11-03' })],
    });
    expect(result.status).toBe('UNKNOWN');
    expect(result.pendingDetails).toBeUndefined();
  });
});
