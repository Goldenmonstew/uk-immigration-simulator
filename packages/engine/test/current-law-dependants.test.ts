import { describe, expect, test } from 'vitest';
import { evaluate } from '../src/evaluate';
import type { ImmigrationEpisode, PersonTimeline } from '../src/types';
import { timeline } from './helpers';

// Current-law dependants of Hong Kong BN(O), Global Talent and Appendix FM
// partners (contracts §15).

const ep = (
  route: ImmigrationEpisode['route'],
  role: ImmigrationEpisode['role'],
  validFrom: string,
  extra: Partial<ImmigrationEpisode> = {},
): ImmigrationEpisode => ({
  route,
  role,
  validFrom,
  validTo: '2031-12-31',
  ...extra,
});

function currentLaw(
  dependant: Partial<PersonTimeline>,
  principal: Partial<PersonTimeline> | undefined,
  simulationDate: string,
) {
  return evaluate({
    timeline: timeline(dependant),
    ...(principal && { principal: timeline(principal) }),
    simulationDate,
  }).byRuleSet['current-law-2026-11']!;
}

const rule = (
  result: ReturnType<typeof currentLaw>,
  id: string,
): { status: string; explanation: string; pendingDetails?: string[] } =>
  result.rules.find((r) => r.id === id)!;

describe('Hong Kong BN(O) dependants (SRC-020)', () => {
  const principal = (validFrom: string) => ({
    episodes: [ep('HONG_KONG_BNO', 'MAIN', validFrom)],
    english: { cefrLevel: 'B1' as const },
  });
  const child = {
    dateOfBirth: '2014-09-01',
    episodes: [
      ep('HONG_KONG_BNO', 'DEPENDANT', '2021-02-01', { dependantOf: 'PARENT' }),
    ],
    english: undefined,
    lifeInTheUk: undefined,
  };

  test('child under 18 settles with the parent on the day (HK 57.3(a))', () => {
    const result = currentLaw(child, principal('2021-02-01'), '2026-02-01');
    expect(result).toMatchObject({
      outcome: 'LIKELY_ELIGIBLE',
      pathwayYears: 5,
      earliestDate: '2026-02-01',
    });
    expect(rule(result, 'CL-HKBNO-DEPENDANT').explanation).toContain(
      'HK 57.3(a)',
    );
    expect(result.rules.map((r) => r.id)).not.toContain(
      'CL-HKBNO-RESIDENCE-5Y',
    );
  });

  test('child: a day short projects the parent’s date', () => {
    expect(
      currentLaw(child, principal('2021-02-02'), '2026-02-01'),
    ).toMatchObject({
      outcome: 'LIKELY_NOT_ELIGIBLE',
      pathwayYears: 5,
      earliestDate: '2026-02-02',
    });
  });

  test('child without the principal: insufficient information', () => {
    const result = currentLaw(child, undefined, '2026-02-01');
    expect(result.outcome).toBe('INSUFFICIENT_INFORMATION');
    expect(rule(result, 'CL-SCOPE').explanation).toContain(
      '填写主申请人信息后可判断',
    );
  });

  test('child of a settled parent can apply now, whatever the route (HK 57.3(b))', () => {
    const settled = {
      ...principal('2015-01-01'),
      settled: { date: '2025-01-01', route: 'SKILLED_WORKER' as const },
    };
    expect(currentLaw(child, settled, '2026-02-01')).toMatchObject({
      outcome: 'LIKELY_ELIGIBLE',
      pathwayYears: 5,
    });
  });

  test('partner aged 18 or over: own 5 years, no principal needed (HK 62.1)', () => {
    const partner = (validFrom: string) => ({
      episodes: [
        ep('HONG_KONG_BNO', 'DEPENDANT', validFrom, { dependantOf: 'PARTNER' }),
      ],
      english: { cefrLevel: 'B1' as const },
    });
    const due = currentLaw(partner('2021-02-01'), undefined, '2026-02-01');
    expect(due).toMatchObject({
      outcome: 'LIKELY_ELIGIBLE',
      pathwayYears: 5,
      earliestDate: '2026-02-01',
    });
    expect(rule(due, 'CL-HKBNO-RESIDENCE-5Y').status).toBe('PASS');
    expect(
      currentLaw(partner('2021-02-02'), undefined, '2026-02-01'),
    ).toMatchObject({
      outcome: 'LIKELY_NOT_ELIGIBLE',
      pathwayYears: 5,
      earliestDate: '2026-02-02',
    });
    // An adult child is assessed the same way.
    expect(
      currentLaw(
        {
          dateOfBirth: '2005-01-01',
          episodes: [
            ep('HONG_KONG_BNO', 'DEPENDANT', '2021-02-01', {
              dependantOf: 'PARENT',
            }),
          ],
          english: { cefrLevel: 'B1' },
        },
        undefined,
        '2026-02-01',
      ).outcome,
    ).toBe('LIKELY_ELIGIBLE');
  });

  test('adult dependant relative: the later of own 5 years and the principal (HK 59.1)', () => {
    const relative = {
      dateOfBirth: '1958-04-01',
      episodes: [
        ep('HONG_KONG_BNO', 'DEPENDANT', '2022-01-01', {
          dependantOf: 'RELATIVE',
        }),
      ],
      english: undefined,
      lifeInTheUk: undefined,
    };
    const due = currentLaw(relative, principal('2021-02-01'), '2027-01-01');
    expect(due).toMatchObject({
      outcome: 'LIKELY_ELIGIBLE',
      pathwayYears: 5,
      earliestDate: '2027-01-01',
    });
    expect(rule(due, 'CL-HKBNO-DEPENDANT').explanation).toContain('HK 59.1(a)');
    const short = currentLaw(relative, principal('2021-02-01'), '2026-12-31');
    expect(short).toMatchObject({
      outcome: 'LIKELY_NOT_ELIGIBLE',
      earliestDate: '2027-01-01',
    });
    expect(short.assumptions.join()).not.toContain('B2');
    expect(currentLaw(relative, undefined, '2027-01-01').outcome).toBe(
      'INSUFFICIENT_INFORMATION',
    );
    // Settled from another route: only a British citizen meets HK 59.1(c).
    const other = currentLaw(
      relative,
      {
        ...principal('2015-01-01'),
        settled: { date: '2025-01-01', route: 'SKILLED_WORKER' },
      },
      '2027-01-01',
    );
    expect(rule(other, 'CL-HKBNO-DEPENDANT').status).toBe('UNKNOWN');
    expect(rule(other, 'CL-HKBNO-DEPENDANT').explanation).toContain(
      'HK 59.1(c)',
    );
  });
});

describe('Global Talent dependants (SRC-021)', () => {
  const principal = (
    validFrom: string,
    criteria: ImmigrationEpisode['globalTalentCriteria'] = 'EXCEPTIONAL_TALENT',
  ) => ({
    episodes: [
      ep('GLOBAL_TALENT', 'MAIN', validFrom, {
        globalTalentEndorsement: 'ARTS_COUNCIL_ENGLAND',
        globalTalentCriteria: criteria,
      }),
    ],
  });
  const partner = (validFrom: string) => ({
    episodes: [
      ep('GLOBAL_TALENT', 'DEPENDANT', validFrom, { dependantOf: 'PARTNER' }),
    ],
    english: { cefrLevel: 'B1' as const },
  });

  test('partner: 5 years of their own even when the principal needs 3 (GT 30.1)', () => {
    const due = currentLaw(
      partner('2021-06-01'),
      principal('2021-06-01'),
      '2026-06-01',
    );
    expect(due).toMatchObject({
      outcome: 'LIKELY_ELIGIBLE',
      pathwayYears: 5,
      earliestDate: '2026-06-01',
    });
    expect(rule(due, 'CL-ENGLISH').explanation).toContain('GT 32.1(a)');
    expect(rule(due, 'CL-KOL').explanation).toContain('GT 33.1');
    expect(
      currentLaw(partner('2021-06-02'), principal('2021-06-01'), '2026-06-01'),
    ).toMatchObject({
      outcome: 'LIKELY_NOT_ELIGIBLE',
      pathwayYears: 5,
      earliestDate: '2026-06-02',
    });
  });

  test('partner: not before the principal’s own 5 years (GT 27.1(a))', () => {
    const result = currentLaw(
      partner('2021-06-01'),
      principal('2022-06-01', 'EXCEPTIONAL_PROMISE'),
      '2026-11-04',
    );
    expect(result).toMatchObject({
      outcome: 'LIKELY_NOT_ELIGIBLE',
      pathwayYears: 5,
      earliestDate: '2027-06-01',
    });
    expect(result.assumptions.join()).toContain('GT 32.1(b)');
  });

  test('child settles with the principal on the principal’s date', () => {
    const child = {
      dateOfBirth: '2015-03-01',
      episodes: [
        ep('GLOBAL_TALENT', 'DEPENDANT', '2023-06-01', {
          dependantOf: 'PARENT',
        }),
      ],
      english: undefined,
      lifeInTheUk: undefined,
    };
    expect(
      currentLaw(child, principal('2023-06-01'), '2026-06-01'),
    ).toMatchObject({
      outcome: 'LIKELY_ELIGIBLE',
      pathwayYears: 3,
      earliestDate: '2026-06-01',
    });
    expect(
      currentLaw(child, principal('2023-06-01'), '2026-05-31'),
    ).toMatchObject({
      outcome: 'LIKELY_NOT_ELIGIBLE',
      pathwayYears: 3,
      earliestDate: '2026-06-01',
    });
  });

  test('without the principal: insufficient information', () => {
    expect(
      currentLaw(partner('2021-06-01'), undefined, '2026-06-01').outcome,
    ).toBe('INSUFFICIENT_INFORMATION');
  });

  test('child of a settled principal: years from the last Global Talent permission (assumption)', () => {
    const child = {
      dateOfBirth: '2015-03-01',
      episodes: [
        ep('GLOBAL_TALENT', 'DEPENDANT', '2020-06-01', {
          dependantOf: 'PARENT',
        }),
      ],
      english: undefined,
      lifeInTheUk: undefined,
    };
    const result = currentLaw(
      child,
      {
        ...principal('2020-06-01'),
        settled: { date: '2023-06-01', route: 'GLOBAL_TALENT' },
      },
      '2026-06-01',
    );
    expect(result).toMatchObject({
      outcome: 'LIKELY_ELIGIBLE',
      pathwayYears: 3,
    });
    expect(result.assumptions.join('')).toContain(
      '最后一个 Global Talent 主申请人片段',
    );
  });

  test('a principal settled from another route fails GT 27.1(b)', () => {
    const result = currentLaw(
      partner('2021-06-01'),
      {
        ...principal('2018-01-01'),
        settled: { date: '2024-06-01', route: 'SKILLED_WORKER' },
      },
      '2026-06-01',
    );
    expect(rule(result, 'CL-GT-DEPENDANT').status).toBe('FAIL');
  });
});

describe('children of Appendix FM partners (SRC-022, SRC-024)', () => {
  const principal = (
    validFrom: string,
    familyPermission: ImmigrationEpisode['familyPermission'] = 'PARTNER_TEN_YEAR',
  ) => ({
    episodes: [
      ep('FAMILY_PARTNER_OR_PARENT', 'MAIN', validFrom, { familyPermission }),
    ],
    relationships: [
      {
        type: 'PARTNER' as const,
        otherPartyStatus: 'BRITISH_CITIZEN' as const,
      },
    ],
    english: { cefrLevel: 'B1' as const },
    incomeYears: [{ taxYear: '2025-26', earnings: 30000 }],
  });
  const child = {
    dateOfBirth: '2012-07-15',
    episodes: [
      ep('FAMILY_PARTNER_OR_PARENT', 'DEPENDANT', '2019-03-01', {
        dependantOf: 'PARENT',
      }),
    ],
    english: undefined,
    lifeInTheUk: undefined,
  };

  test('10-year route: settles with the principal on the day (SETF 12.1(a))', () => {
    const result = currentLaw(child, principal('2016-03-01'), '2026-03-01');
    expect(result).toMatchObject({
      outcome: 'LIKELY_ELIGIBLE',
      pathwayYears: 10,
      earliestDate: '2026-03-01',
    });
    expect(rule(result, 'CL-FAMILY-CHILD').explanation).toContain(
      'SETF 12.1(a)',
    );
    expect(
      currentLaw(child, principal('2016-03-02'), '2026-03-01'),
    ).toMatchObject({
      outcome: 'LIKELY_NOT_ELIGIBLE',
      pathwayYears: 10,
      earliestDate: '2026-03-02',
    });
  });

  test('an adult child needs B1 English (SETF 15.1, SETF 16.1)', () => {
    const adult = { ...child, dateOfBirth: '2006-01-01' };
    const result = currentLaw(adult, principal('2016-03-01'), '2026-03-01');
    expect(rule(result, 'CL-ENGLISH').explanation).toContain('SETF 15.1(a)');
    expect(rule(result, 'CL-KOL').explanation).toContain('SETF 16.1');
    expect(result.outcome).toBe('INSUFFICIENT_INFORMATION');
  });

  test('without the principal: insufficient information', () => {
    expect(currentLaw(child, undefined, '2026-03-01').outcome).toBe(
      'INSUFFICIENT_INFORMATION',
    );
  });

  // Contracts §16.2 (5.4 report §4): Long Residence also reaches 10 years,
  // but the principal's result rests on it, not on SETF.
  test('the principal settles under Long Residence, not SETF: the child no longer settles with them', () => {
    const notSetf = {
      ...principal('2016-03-01'),
      relationships: [
        { type: 'PARTNER' as const, otherPartyStatus: 'OTHER' as const },
      ],
    };
    const p = evaluate({
      timeline: timeline(notSetf),
      simulationDate: '2026-03-01',
    }).byRuleSet['current-law-2026-11']!;
    expect(p).toMatchObject({ outcome: 'LIKELY_ELIGIBLE', pathwayYears: 10 });
    expect(p.decidedBy).toContain('CL-LR-RESIDENCE-10Y');
    expect(p.decidedBy).not.toContain('CL-FAMILY-RESIDENCE');
    const result = currentLaw(child, notSetf, '2026-03-01');
    expect(rule(result, 'CL-FAMILY-CHILD').status).toBe('UNKNOWN');
    expect(rule(result, 'CL-FAMILY-CHILD').explanation).toContain(
      '例如按 Long Residence',
    );
    expect(result.outcome).toBe('INSUFFICIENT_INFORMATION');
  });

  test('a settled principal: the route is read from the last Appendix FM permission (assumption)', () => {
    const result = currentLaw(
      child,
      {
        ...principal('2014-03-01'),
        settled: { date: '2024-03-01', route: 'FAMILY_PARTNER_OR_PARENT' },
      },
      '2026-03-01',
    );
    expect(rule(result, 'CL-FAMILY-CHILD').status).toBe('PASS');
    expect(result.assumptions.join('')).toContain(
      '定居日前最后一个 Appendix FM 主申请人片段',
    );
  });

  test('5-year route: Part 8 para 298 is not registered (PD-074)', () => {
    const result = currentLaw(
      child,
      principal('2021-03-01', 'PARTNER_FIVE_YEAR'),
      '2026-03-01',
    );
    expect(result.outcome).toBe('INSUFFICIENT_INFORMATION');
    expect(result.pathwayYears).toBeUndefined();
    const scope = rule(result, 'CL-SCOPE');
    expect(scope.status).toBe('UNKNOWN');
    expect(scope.pendingDetails).toEqual(['PD-074']);
  });
});
