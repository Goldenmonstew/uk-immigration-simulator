import { fixtures } from '@uk-immigration/policy-data/fixtures';
import { describe, expect, test } from 'vitest';
import { evaluate } from '../src/evaluate';
import {
  clAncestryResidence5Y,
  clEnglish,
  clInnovatorEndorsement,
  clInnovatorResidence3Y,
  clKol,
  clPrivateLifeResidence,
  clProtectionResidence5Y,
  clProtectionStatus,
  clScope,
} from '../src/rules/current-law';
import type { ImmigrationEpisode, PersonTimeline } from '../src/types';
import { run, timeline } from './helpers';

// Current-law main applicants added in Phase 5.2 (contracts §14).

const on = (
  route: ImmigrationEpisode['route'],
  validFrom: string,
  extra: Partial<ImmigrationEpisode> = {},
): ImmigrationEpisode => ({
  route,
  role: 'MAIN',
  validFrom,
  validTo: '2031-12-31',
  ...extra,
});

const currentLaw = (
  overrides: Partial<PersonTimeline>,
  simulationDate: string,
) =>
  evaluate({ timeline: timeline(overrides), simulationDate }).byRuleSet[
    'current-law-2026-11'
  ]!;

const ids = (rules: { id: string }[]) => rules.map((r) => r.id);

describe('refugee status or humanitarian protection (SRC-023)', () => {
  const refugee = (
    validFrom: string,
    extra: Partial<PersonTimeline> = {},
  ): Partial<PersonTimeline> => ({
    episodes: [on('CORE_PROTECTION', validFrom)],
    english: undefined,
    lifeInTheUk: undefined,
    asylumSupportRepayment: 'NOT_REQUIRED',
    ...extra,
  });

  test('CL-SCOPE: a main applicant is in scope, a dependant is not', () => {
    expect(run(clScope, refugee('2021-03-01')).explanation).toContain(
      'Appendix Settlement Protection',
    );
    const dependant = run(
      clScope,
      refugee('2021-03-01', {
        episodes: [on('CORE_PROTECTION', '2021-03-01', { role: 'DEPENDANT' })],
      }),
    );
    expect(dependant.status).toBe('UNKNOWN');
    expect(dependant.explanation).toContain('只建模该路线的主申请人');
  });

  test('5 years to the day, without English or Life in the UK (STP 3.1, PD-072)', () => {
    expect(
      run(clProtectionResidence5Y, refugee('2021-03-01'), '2026-03-01').status,
    ).toBe('PASS');
    const result = currentLaw(refugee('2021-03-01'), '2026-03-01');
    expect(result).toMatchObject({
      outcome: 'LIKELY_ELIGIBLE',
      pathwayYears: 5,
      earliestDate: '2026-03-01',
    });
    const english = result.rules.find((r) => r.id === 'CL-ENGLISH')!;
    expect(english.status).toBe('UNKNOWN');
    expect(english.explanation).toContain('PD-072');
    expect(result.rules.find((r) => r.id === 'CL-KOL')!.explanation).toContain(
      'PD-072',
    );
    expect(ids(result.rules)).toEqual([
      'CL-SCOPE',
      'CL-PROTECTION-RESIDENCE-5Y',
      'CL-PROTECTION-STATUS',
      'CL-ENGLISH',
      'CL-KOL',
      'CL-LR-RESIDENCE-10Y',
    ]);
  });

  test('a day short: projects 5 years on, with no B2 note after 2027-03-26', () => {
    const short = run(
      clProtectionResidence5Y,
      refugee('2022-06-02'),
      '2027-06-01',
    );
    expect(short.status).toBe('FAIL');
    expect(short.explanation).toContain('2027-06-02');
    const result = currentLaw(refugee('2022-06-02'), '2027-06-01');
    expect(result).toMatchObject({
      outcome: 'LIKELY_NOT_ELIGIBLE',
      pathwayYears: 5,
      earliestDate: '2027-06-02',
    });
    expect(result.assumptions.join()).not.toContain('B2');
  });

  test('protection routes combine; dependant time does not count', () => {
    const chain = [
      on('SAFE_AND_LEGAL', '2020-01-01', { validTo: '2021-12-31' }),
      on('CORE_PROTECTION', '2022-01-01', { validTo: '2022-12-31' }),
      on('PROTECTION_WORK_AND_STUDY', '2023-01-01'),
    ];
    expect(
      run(
        clProtectionResidence5Y,
        refugee('', { episodes: chain }),
        '2025-01-01',
      ).explanation,
    ).toContain('自 2020-01-01 起');
    const afterDependant = [
      on('CORE_PROTECTION', '2020-01-01', {
        role: 'DEPENDANT',
        validTo: '2021-12-31',
      }),
      on('CORE_PROTECTION', '2022-01-01'),
    ];
    expect(
      run(
        clProtectionResidence5Y,
        refugee('', { episodes: afterDependant }),
        '2025-01-01',
      ).explanation,
    ).toContain('自 2022-01-01 起');
  });

  test('absences do not restart the period (PD-071)', () => {
    const result = run(
      clProtectionResidence5Y,
      refugee('2021-03-01', {
        absences: [{ from: '2022-01-01', to: '2022-12-31' }],
      }),
      '2026-03-01',
    );
    expect(result.status).toBe('PASS');
    expect(result.assumptions?.join()).toContain('PD-071');
    expect(
      run(
        clProtectionResidence5Y,
        refugee('2021-03-01'),
        '2026-03-01',
      ).assumptions?.join(),
    ).not.toContain('PD-071');
  });

  test('revoked or renounced status fails STP 4.1; Long Residence still counts', () => {
    const revoked = refugee('2021-03-01', { protectionStatusRevoked: true });
    expect(run(clProtectionStatus, revoked).status).toBe('FAIL');
    expect(
      run(clProtectionStatus, refugee('2021-03-01')).assumptions?.join(),
    ).toContain('STP 4.2');
    expect(currentLaw(revoked, '2026-03-01')).toMatchObject({
      outcome: 'LIKELY_NOT_ELIGIBLE',
      pathwayYears: 10,
      earliestDate: '2031-03-01',
    });
  });

  test('Long Residence 10 years runs alongside', () => {
    const episodes = [
      on('STUDENT', '2015-01-01', { validTo: '2023-12-31' }),
      on('CORE_PROTECTION', '2024-01-01'),
    ];
    const result = currentLaw(
      refugee('', {
        episodes,
        english: { cefrLevel: 'B1' },
        lifeInTheUk: { passed: true },
      }),
      '2026-11-04',
    );
    expect(result).toMatchObject({
      outcome: 'LIKELY_ELIGIBLE',
      pathwayYears: 10,
    });
    expect(
      run(clEnglish, refugee('', { episodes, english: { cefrLevel: 'A2' } }))
        .status,
    ).toBe('FAIL');
    expect(run(clKol, refugee('', { episodes })).status).toBe('UNKNOWN');
  });

  test('adult illegal entry does not stop the current-law column', () => {
    const result = currentLaw(
      refugee('2021-03-01', {
        immigrationBreaches: [{ type: 'ILLEGAL_ENTRY', date: '2020-12-01' }],
      }),
      '2026-03-01',
    );
    expect(result.outcome).toBe('LIKELY_ELIGIBLE');
  });

  test('fixture: the Earned Settlement column is assessed as Core Protection', () => {
    const r = evaluate(
      fixtures.find((f) => f.id === 'CL-REFUGEE-FIVE-YEARS')!.request,
    );
    expect(r.shortCircuit).toBeUndefined();
    expect(r.byRuleSet['earned-settlement-2026-11']?.routeGroup).toBe(
      'PROTECTION',
    );
  });
});

describe('UK Ancestry (SRC-026)', () => {
  const ancestry = (
    validFrom: string,
    extra: Partial<PersonTimeline> = {},
  ): Partial<PersonTimeline> => ({
    episodes: [on('UK_ANCESTRY', validFrom)],
    english: { cefrLevel: 'B1' },
    ...extra,
  });

  test('CL-SCOPE: a main applicant is in scope, a dependant is not', () => {
    expect(run(clScope, ancestry('2021-09-01')).explanation).toContain(
      'Appendix UK Ancestry',
    );
    expect(
      run(clScope, {
        episodes: [on('UK_ANCESTRY', '2021-09-01', { role: 'DEPENDANT' })],
      }).status,
    ).toBe('UNKNOWN');
  });

  test('5 years to the day: likely eligible (UKA 13.1)', () => {
    const result = run(
      clAncestryResidence5Y,
      ancestry('2021-09-01'),
      '2026-09-01',
    );
    expect(result.status).toBe('PASS');
    expect(result.assumptions?.join()).toContain('UKA 12.1');
    expect(currentLaw(ancestry('2021-09-01'), '2026-09-01')).toMatchObject({
      outcome: 'LIKELY_ELIGIBLE',
      pathwayYears: 5,
      earliestDate: '2026-09-01',
    });
  });

  test('a day short: projects the date, with the B2 note after 2027-03-26', () => {
    expect(
      run(clAncestryResidence5Y, ancestry('2021-09-02'), '2026-09-01').status,
    ).toBe('FAIL');
    expect(currentLaw(ancestry('2021-09-02'), '2026-09-01')).toMatchObject({
      outcome: 'LIKELY_NOT_ELIGIBLE',
      pathwayYears: 5,
      earliestDate: '2026-09-02',
    });
    expect(
      currentLaw(ancestry('2023-01-01'), '2026-11-04').assumptions.join(),
    ).toContain('UKA 15.1(b)');
  });

  test('only UK Ancestry main permission counts; absences restart it (UKA 14.1)', () => {
    const episodes = [
      on('STUDENT', '2019-01-01', { validTo: '2021-08-31' }),
      on('UK_ANCESTRY', '2021-09-01'),
    ];
    expect(
      run(clAncestryResidence5Y, { episodes }, '2026-09-01').explanation,
    ).toContain('自 2021-09-01 起');
    const absent = run(
      clAncestryResidence5Y,
      ancestry('2021-09-01', {
        absences: [{ from: '2022-01-01', to: '2022-06-30' }],
      }),
      '2026-09-01',
    );
    expect(absent.status).toBe('FAIL');
    expect(absent.explanation).toContain('2027-07-01');
  });

  test('English B1 before 2027-03-26, B2 from then (UKA 15.1); KOL UKA 16.1', () => {
    const before = run(clEnglish, ancestry('2021-09-01'), '2027-03-25');
    expect(before.status).toBe('PASS');
    expect(before.explanation).toContain('UKA 15.1(a)');
    const after = run(clEnglish, ancestry('2021-09-01'), '2027-03-26');
    expect(after.status).toBe('FAIL');
    expect(after.explanation).toContain('UKA 15.1(b)');
    expect(run(clKol, ancestry('2021-09-01')).explanation).toContain(
      'UKA 16.1',
    );
  });
});

describe('Innovator Founder (SRC-027)', () => {
  const founder = (
    validFrom: string,
    criteria: ImmigrationEpisode['innovatorSettlementCriteria'] = [
      'INVESTMENT',
      'JOBS',
    ],
    extra: Partial<PersonTimeline> = {},
  ): Partial<PersonTimeline> => ({
    episodes: [
      on('INNOVATOR_FOUNDER', validFrom, {
        innovatorSettlementCriteria: criteria,
      }),
    ],
    english: undefined,
    ...extra,
  });

  test('CL-SCOPE: a main applicant is in scope, a dependant is not', () => {
    expect(run(clScope, founder('2023-05-01')).explanation).toContain(
      'Appendix Innovator Founder',
    );
    expect(
      run(clScope, {
        episodes: [
          on('INNOVATOR_FOUNDER', '2023-05-01', { role: 'DEPENDANT' }),
        ],
      }).status,
    ).toBe('UNKNOWN');
  });

  test('3 years to the day with two criteria, no English needed (INNF 18.1)', () => {
    expect(
      run(clInnovatorResidence3Y, founder('2023-05-01'), '2026-05-01').status,
    ).toBe('PASS');
    const result = currentLaw(founder('2023-05-01'), '2026-05-01');
    expect(result).toMatchObject({
      outcome: 'LIKELY_ELIGIBLE',
      pathwayYears: 3,
      earliestDate: '2026-05-01',
    });
    const english = result.rules.find((r) => r.id === 'CL-ENGLISH')!;
    expect(english.status).toBe('UNKNOWN');
    expect(english.explanation).toContain('INNF 15.1–21.6');
    expect(result.rules.find((r) => r.id === 'CL-KOL')!.explanation).toContain(
      'INNF 20.1',
    );
  });

  test('a day short: projects 3 years on, with no B2 note', () => {
    expect(
      run(clInnovatorResidence3Y, founder('2024-05-02'), '2027-05-01').status,
    ).toBe('FAIL');
    const result = currentLaw(founder('2024-05-02'), '2027-05-01');
    expect(result).toMatchObject({
      outcome: 'LIKELY_NOT_ELIGIBLE',
      pathwayYears: 3,
      earliestDate: '2027-05-02',
    });
    expect(result.assumptions.join()).not.toContain('B2');
  });

  test('INNF 17.1(f): at least two distinct criteria; missing is unknown', () => {
    const noCriteria = {
      episodes: [on('INNOVATOR_FOUNDER', '2023-05-01')],
      english: undefined,
    };
    const two = run(clInnovatorEndorsement, founder('2023-05-01'));
    expect(two.status).toBe('PASS');
    expect(two.explanation).toContain('INNF 17.1(f)(i)、INNF 17.1(f)(vi)');
    expect(two.assumptions?.join()).toContain('INNF 15.2(e)');
    expect(
      run(clInnovatorEndorsement, founder('2023-05-01', ['REVENUE', 'REVENUE']))
        .status,
    ).toBe('FAIL');
    expect(
      run(clInnovatorEndorsement, founder('2023-05-01', [])).explanation,
    ).toContain('0 项');
    expect(run(clInnovatorEndorsement, noCriteria).status).toBe('UNKNOWN');
    expect(currentLaw(noCriteria, '2026-05-01').outcome).toBe(
      'INSUFFICIENT_INFORMATION',
    );
    expect(
      currentLaw(founder('2023-05-01', ['JOBS']), '2026-05-01'),
    ).toMatchObject({
      outcome: 'LIKELY_NOT_ELIGIBLE',
      pathwayYears: 10,
    });
  });

  test('absences restart the period (INNF 19.1, CR 3.1)', () => {
    const result = run(
      clInnovatorResidence3Y,
      founder('2023-05-01', undefined, {
        absences: [{ from: '2024-01-01', to: '2024-06-30' }],
      }),
      '2026-05-01',
    );
    expect(result.status).toBe('FAIL');
    expect(result.explanation).toContain('2027-07-01');
  });
});

describe('Private Life (SRC-028)', () => {
  const privateLife = (
    validFrom: string,
    privateLifeRoute: ImmigrationEpisode['privateLifeRoute'],
    extra: Partial<PersonTimeline> = {},
  ): Partial<PersonTimeline> => ({
    episodes: [on('FAMILY_AND_PRIVATE_LIFE', validFrom, { privateLifeRoute })],
    english: { cefrLevel: 'B1' },
    ...extra,
  });

  test('CL-SCOPE: a main applicant is in scope (also without the basis), a dependant is not', () => {
    expect(
      run(clScope, privateLife('2021-07-01', undefined)).explanation,
    ).toContain('Appendix Private Life');
    expect(
      run(clScope, {
        episodes: [
          on('FAMILY_AND_PRIVATE_LIFE', '2021-07-01', { role: 'DEPENDANT' }),
        ],
      }).status,
    ).toBe('UNKNOWN');
  });

  test('child or young adult: 5 years to the day (PL 14.1)', () => {
    for (const route of ['CHILD', 'YOUNG_ADULT'] as const) {
      const result = run(
        clPrivateLifeResidence,
        privateLife('2021-07-01', route),
        '2026-07-01',
      );
      expect(result.status).toBe('PASS');
      expect(result.explanation).toContain('PL 14.1');
      expect(
        currentLaw(privateLife('2021-07-01', route), '2026-07-01'),
      ).toMatchObject({
        outcome: 'LIKELY_ELIGIBLE',
        pathwayYears: 5,
        earliestDate: '2026-07-01',
      });
    }
  });

  test('a day short: projects the date 5 years on', () => {
    expect(
      currentLaw(privateLife('2021-07-02', 'YOUNG_ADULT'), '2026-07-01'),
    ).toMatchObject({
      outcome: 'LIKELY_NOT_ELIGIBLE',
      pathwayYears: 5,
      earliestDate: '2026-07-02',
    });
  });

  test('adult: 10 years (PL 14.2(a)), a day short projects the date', () => {
    expect(
      currentLaw(privateLife('2016-07-01', 'ADULT'), '2026-07-01'),
    ).toMatchObject({ outcome: 'LIKELY_ELIGIBLE', pathwayYears: 10 });
    const short = run(
      clPrivateLifeResidence,
      privateLife('2016-07-02', 'ADULT'),
      '2026-07-01',
    );
    expect(short.status).toBe('FAIL');
    expect(short.explanation).toContain('PL 14.2(a)');
    expect(
      currentLaw(privateLife('2016-07-02', 'ADULT'), '2026-07-01'),
    ).toMatchObject({
      outcome: 'LIKELY_NOT_ELIGIBLE',
      pathwayYears: 10,
      earliestDate: '2026-07-02',
    });
  });

  test('missing basis is unknown: insufficient information', () => {
    expect(
      run(clPrivateLifeResidence, privateLife('2021-07-01', undefined)).status,
    ).toBe('UNKNOWN');
    expect(
      currentLaw(privateLife('2021-07-01', undefined), '2026-07-01').outcome,
    ).toBe('INSUFFICIENT_INFORMATION');
  });

  test('PL 14.3: Appendix FM time combines; other routes are named (PD-069)', () => {
    const fm = [
      on('FAMILY_PARTNER_OR_PARENT', '2021-01-01', {
        role: 'DEPENDANT',
        dependantOf: 'PARENT',
        validTo: '2022-12-31',
      }),
      on('FAMILY_AND_PRIVATE_LIFE', '2023-01-01', {
        privateLifeRoute: 'CHILD',
      }),
    ];
    expect(
      run(clPrivateLifeResidence, { episodes: fm }, '2026-01-01').status,
    ).toBe('PASS');
    const afterStudent = [
      on('STUDENT', '2019-01-01', { validTo: '2022-12-31' }),
      on('FAMILY_AND_PRIVATE_LIFE', '2023-01-01', {
        privateLifeRoute: 'ADULT',
      }),
    ];
    const result = run(
      clPrivateLifeResidence,
      { episodes: afterStudent },
      '2026-01-01',
    );
    expect(result.explanation).toContain('自 2023-01-01 起');
    expect(result.assumptions?.join()).toContain('PD-069');
  });

  test('English B1 / B2 by 2027-03-26 (PL 16.1); under 18 exempt; KOL PL 17.1', () => {
    const tl = privateLife('2021-07-01', 'CHILD');
    expect(run(clEnglish, tl, '2027-03-25').explanation).toContain(
      'PL 16.1(a)',
    );
    expect(run(clEnglish, tl, '2027-03-26').status).toBe('FAIL');
    expect(
      run(clEnglish, { ...tl, dateOfBirth: '2012-01-01', english: undefined })
        .status,
    ).toBe('PASS');
    expect(run(clKol, tl).explanation).toContain('PL 17.1');
    expect(
      currentLaw(
        privateLife('2023-01-01', 'YOUNG_ADULT'),
        '2026-11-04',
      ).assumptions.join(),
    ).toContain('PL 16.1(b)');
  });
});
