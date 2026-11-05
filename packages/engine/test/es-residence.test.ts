import { describe, expect, test } from 'vitest';
import { esResidence, esRouteGroup } from '../src/rules/es-residence';
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

  test('outside framework is unknown here and short-circuits in evaluate', () => {
    expect(run(esRouteGroup, { episodes: [on('HONG_KONG_BNO')] }).status).toBe(
      'UNKNOWN',
    );
  });

  test('protection routes pass in the Protection group', () => {
    const result = run(esRouteGroup, { episodes: [on('CORE_PROTECTION')] });
    expect(result.status).toBe('PASS');
    expect(result.explanation).toContain('保护类');
  });

  test('a UK Resettlement Scheme arrival before 2027-04-06 is Legacy Safe and Legal', () => {
    const ukrs = (validFrom: string) => [
      on('SAFE_AND_LEGAL', {
        validFrom,
        validTo: '2032-12-31',
        resettlementScheme: 'UK_RESETTLEMENT_SCHEME',
      }),
    ];
    const legacy = run(
      esRouteGroup,
      { episodes: ukrs('2027-04-05') },
      '2028-01-01',
    );
    expect(legacy.status).toBe('UNKNOWN');
    expect(legacy.explanation).toContain('Legacy Safe and Legal');
    expect(legacy.assumptions?.[0]).toContain('PD-045');
    // Boundary: arriving on the cut-off date is not legacy.
    expect(
      run(esRouteGroup, { episodes: ukrs('2027-04-06') }, '2028-01-01').status,
    ).toBe('PASS');
    // Another designated route is not derived as legacy.
    expect(
      run(
        esRouteGroup,
        {
          episodes: [
            on('SAFE_AND_LEGAL', {
              validFrom: '2025-01-01',
              resettlementScheme: 'OTHER_DESIGNATED',
            }),
          ],
        },
        '2026-01-01',
      ).status,
    ).toBe('PASS');
  });

  test('an episode ending the day before the simulation date does not count', () => {
    const result = run(esRouteGroup, {
      episodes: [on('SKILLED_WORKER', { validTo: '2026-11-03' })],
    });
    expect(result.status).toBe('UNKNOWN');
    expect(result.pendingDetails).toBeUndefined();
  });
});

describe('ES-RESIDENCE on protection routes', () => {
  const core = on('CORE_PROTECTION', {
    validFrom: '2027-03-01',
    validTo: '2028-02-29',
  });
  const pws = on('PROTECTION_WORK_AND_STUDY', {
    validFrom: '2028-03-01',
    validTo: '2033-02-28',
  });

  test('moving from Core Protection to Protection Work and Study restarts the count', () => {
    const result = run(esResidence, { episodes: [core, pws] }, '2030-01-01');
    expect(result.status).toBe('PASS');
    expect(result.explanation).toContain('自 2028-03-01 起');
    expect(result.explanation).toContain('Individual B');
  });

  test('Core Protection alone counts from the grant', () => {
    const result = run(
      esResidence,
      { episodes: [{ ...core, validTo: '2032-12-31' }] },
      '2030-01-01',
    );
    expect(result.status).toBe('PASS');
    expect(result.explanation).toContain('自 2027-03-01 起');
  });

  test('moving back to Core Protection is unknown', () => {
    const back = on('CORE_PROTECTION', {
      validFrom: '2033-03-01',
      validTo: '2038-02-28',
    });
    const result = run(
      esResidence,
      { episodes: [core, pws, back] },
      '2034-01-01',
    );
    expect(result.status).toBe('UNKNOWN');
    expect(result.pendingDetails).toEqual(['PD-064']);
  });

  test('work-route time before a protection route does not count', () => {
    const result = run(
      esResidence,
      {
        episodes: [
          on('SKILLED_WORKER', {
            validFrom: '2024-01-01',
            validTo: '2027-02-28',
          }),
          { ...core, validTo: '2032-12-31' },
        ],
      },
      '2030-01-01',
    );
    expect(result.explanation).toContain('自 2027-03-01 起');
  });

  test('a legacy UK Resettlement Scheme arrival is outside the framework', () => {
    const result = run(
      esResidence,
      {
        episodes: [
          on('SAFE_AND_LEGAL', {
            validFrom: '2025-01-01',
            resettlementScheme: 'UK_RESETTLEMENT_SCHEME',
          }),
        ],
      },
      '2026-01-01',
    );
    expect(result.status).toBe('UNKNOWN');
    expect(result.pendingDetails).toBeUndefined();
  });
});

describe('ES-RESIDENCE', () => {
  const sw = (validFrom: string, validTo: string): ImmigrationEpisode => ({
    route: 'SKILLED_WORKER',
    role: 'MAIN',
    validFrom,
    validTo,
  });

  test('consecutive Skilled Worker permissions count from the first', () => {
    const result = run(esResidence);
    expect(result.status).toBe('PASS');
    expect(result.explanation).toContain('自 2019-11-01 起');
  });

  test('Student and Graduate time before Skilled Worker does not count', () => {
    const result = run(esResidence, {
      episodes: [
        on('STUDENT', { validFrom: '2020-09-01', validTo: '2023-01-31' }),
        on('GRADUATE', { validFrom: '2023-02-01', validTo: '2025-01-31' }),
        sw('2025-02-01', '2028-01-31'),
      ],
    });
    expect(result.status).toBe('PASS');
    expect(result.explanation).toContain('自 2025-02-01 起');
    expect(result.assumptions?.[0]).toContain('PD-053');
  });

  test('switching from Family and Private Life to work restarts the clock', () => {
    const result = run(esResidence, {
      episodes: [
        on('FAMILY_AND_PRIVATE_LIFE', {
          validFrom: '2015-01-01',
          validTo: '2021-12-31',
        }),
        sw('2022-01-01', '2027-12-31'),
      ],
    });
    expect(result.explanation).toContain('自 2022-01-01 起');
    expect(result.assumptions).toEqual([]);
  });

  test('a one-day gap is tolerated, a two-day gap breaks', () => {
    const oneDay = run(esResidence, {
      episodes: [
        sw('2019-11-01', '2022-10-30'),
        sw('2022-11-01', '2027-10-31'),
      ],
    });
    expect(oneDay.explanation).toContain('自 2019-11-01 起');
    const twoDays = run(esResidence, {
      episodes: [
        sw('2019-11-01', '2022-10-29'),
        sw('2022-11-01', '2027-10-31'),
      ],
    });
    expect(twoDays.explanation).toContain('自 2022-11-01 起');
  });

  test('180 days abroad in 12 months keeps continuity, 181 breaks it', () => {
    // 2023-01-01 to 2023-06-29 is 180 days inclusive.
    const ok = run(esResidence, {
      absences: [{ from: '2023-01-01', to: '2023-06-29' }],
    });
    expect(ok.explanation).toContain('自 2019-11-01 起');
    const broken = run(esResidence, {
      absences: [{ from: '2023-01-01', to: '2023-06-30' }],
    });
    expect(broken.explanation).toContain('自 2023-07-01 起');
    expect(broken.assumptions?.at(-1)).toContain('PD-054');
  });

  test('two absences inside one 12-month window add up', () => {
    const broken = run(esResidence, {
      absences: [
        { from: '2023-01-01', to: '2023-03-31' },
        { from: '2023-10-01', to: '2023-12-31' },
      ],
    });
    expect(broken.explanation).toContain('自 2024-01-01 起');
  });

  test('a current non-counting route fails; no episode is unknown', () => {
    expect(run(esResidence, { episodes: [on('STUDENT')] }).status).toBe('FAIL');
    expect(run(esResidence, { episodes: [] }).status).toBe('UNKNOWN');
  });
});
