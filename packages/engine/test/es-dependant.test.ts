import { describe, expect, test } from 'vitest';
import { evaluate } from '../src/evaluate';
import type {
  ImmigrationEpisode,
  PersonTimeline,
  SettlementAssessment,
} from '../src/types';
import { asDependant, SIMULATION_DATE, timeline } from './helpers';

// The default timeline is the principal: Skilled Worker since 2019-11-01,
// eligible for the 5-year pathway since 2024-11-01.

function es(
  dependant: Partial<PersonTimeline>,
  principal: Partial<PersonTimeline> | null = {},
): SettlementAssessment {
  return evaluate({
    timeline: timeline(dependant),
    simulationDate: SIMULATION_DATE,
    ...(principal && { principal: timeline(principal) }),
  }).byRuleSet['earned-settlement-2026-11']!;
}

const pathwayOf = (a: SettlementAssessment) =>
  a.rules.find((r) => r.id === 'ES-DEPENDANT-PATHWAY')!;

const partnerFrom = (validFrom: string): ImmigrationEpisode[] => [
  {
    route: 'SKILLED_WORKER',
    role: 'DEPENDANT',
    validFrom,
    validTo: '2027-10-31',
    dependantOf: 'PARTNER',
  },
];

const PARTNER = { episodes: asDependant('PARTNER') };
const child = (dateOfBirth: string): Partial<PersonTimeline> => ({
  dateOfBirth,
  episodes: asDependant('PARENT'),
  incomeYears: [],
  english: undefined,
  lifeInTheUk: undefined,
  governmentDebt: undefined,
});

describe('ES-DEPENDANT-PATHWAY: partner', () => {
  test('arriving with the principal settles with them', () => {
    const a = es(PARTNER);
    expect(a).toMatchObject({
      outcome: 'LIKELY_ELIGIBLE',
      pathwayYears: 5,
      earliestDate: SIMULATION_DATE,
      routeGroup: 'CORE_PERMISSION',
    });
    expect(pathwayOf(a).status).toBe('PASS');
    expect(a.assumptions.join('')).toContain('PD-056');
    expect(a.rules.some((r) => r.id === 'ES-EARNINGS-5Y')).toBe(false);
  });

  test('joining later settles once they have the same five years', () => {
    // Joined two years after the principal: five years of their own by now.
    expect(es({ episodes: partnerFrom('2021-11-01') })).toMatchObject({
      outcome: 'LIKELY_ELIGIBLE',
      pathwayYears: 5,
    });
    const later = es({ episodes: partnerFrom('2022-11-01') });
    expect(later).toMatchObject({
      outcome: 'LIKELY_NOT_ELIGIBLE',
      pathwayYears: 5,
      earliestDate: '2027-11-01',
    });
    expect(pathwayOf(later).status).toBe('FAIL');
    expect(later.assumptions.join('')).toContain('PD-057');
  });

  test('five years of their own on the simulation date qualifies; a day short does not', () => {
    expect(es({ episodes: partnerFrom('2021-11-04') }).outcome).toBe(
      'LIKELY_ELIGIBLE',
    );
    expect(es({ episodes: partnerFrom('2021-11-05') }).earliestDate).toBe(
      '2026-11-05',
    );
  });

  test('a principal not yet eligible projects the family date', () => {
    const recent: ImmigrationEpisode[] = [
      {
        route: 'SKILLED_WORKER',
        role: 'MAIN',
        validFrom: '2024-02-01',
        validTo: '2029-12-31',
        salary: 60000,
      },
    ];
    const a = es({ episodes: partnerFrom('2024-02-01') }, { episodes: recent });
    expect(a).toMatchObject({
      outcome: 'LIKELY_NOT_ELIGIBLE',
      pathwayYears: 5,
      earliestDate: '2029-02-01',
    });
  });

  test('the partner still needs the adult mandatory requirements and minimum income', () => {
    const b1 = es({ ...PARTNER, english: { cefrLevel: 'B1' } });
    expect(b1.outcome).toBe('LIKELY_NOT_ELIGIBLE');
    expect(b1.pathwayYears).toBeUndefined();
    expect(es({ ...PARTNER, incomeYears: [] }).outcome).toBe(
      'INSUFFICIENT_INFORMATION',
    );
  });

  test("the partner's own public funds use is a pending detail (PD-062)", () => {
    const a = es({
      ...PARTNER,
      benefits: [
        {
          benefitType: 'UNIVERSAL_CREDIT',
          from: '2024-01-01',
          to: '2024-06-30',
        },
      ],
    });
    expect(pathwayOf(a).pendingDetails).toEqual(['PD-062']);
    expect(a).toMatchObject({
      outcome: 'POTENTIALLY_ELIGIBLE',
      pathwayYears: 5,
    });
  });
});

describe("ES-DEPENDANT-PATHWAY: the principal's result", () => {
  test('a potentially eligible principal passes on their pending details', () => {
    const unlisted = {
      benefits: [
        { benefitType: 'SOMETHING_ELSE', from: '2024-01-01', to: '2024-06-30' },
      ],
    };
    const a = es(PARTNER, unlisted);
    expect(pathwayOf(a).status).toBe('UNKNOWN');
    expect(pathwayOf(a).pendingDetails).toContain('PD-013');
    expect(a).toMatchObject({
      outcome: 'POTENTIALLY_ELIGIBLE',
      pathwayYears: 5,
    });
  });

  test('a principal failing a mandatory requirement fails the dependant', () => {
    const a = es(PARTNER, { english: { cefrLevel: 'B1' } });
    expect(pathwayOf(a).status).toBe('FAIL');
    expect(a.outcome).toBe('LIKELY_NOT_ELIGIBLE');
  });

  test('a principal with missing input leaves the dependant unknown', () => {
    const a = es(PARTNER, { english: undefined });
    expect(pathwayOf(a).status).toBe('UNKNOWN');
    expect(a.outcome).toBe('INSUFFICIENT_INFORMATION');
  });

  test('no principal or no dependantOf is insufficient information', () => {
    expect(es(PARTNER, null).outcome).toBe('INSUFFICIENT_INFORMATION');
    const unknownBranch = es({
      episodes: asDependant().map((e) => ({ ...e, dependantOf: undefined })),
    });
    expect(unknownBranch.outcome).toBe('INSUFFICIENT_INFORMATION');
    expect(pathwayOf(unknownBranch).explanation).toContain('伴侣还是子女');
  });

  test('a principal is ignored for a main applicant', () => {
    const a = es({}, { english: { cefrLevel: 'B1' } });
    expect(a.outcome).toBe('LIKELY_ELIGIBLE');
  });
});

describe('ES-DEPENDANT-PATHWAY: children', () => {
  test('a 14-year-old settles with the parent, exempt from income, debt, English and KOL', () => {
    const a = es(child('2012-06-01'));
    expect(a).toMatchObject({
      outcome: 'LIKELY_ELIGIBLE',
      pathwayYears: 5,
      earliestDate: SIMULATION_DATE,
    });
    expect(a.assumptions.join('')).toContain('PD-061');
  });

  test('a child who joined later still settles with the parent (PD-058)', () => {
    const a = es({
      ...child('2012-06-01'),
      episodes: partnerFrom('2025-01-01').map((e) => ({
        ...e,
        dependantOf: 'PARENT' as const,
      })),
    });
    expect(a).toMatchObject({ outcome: 'LIKELY_ELIGIBLE', pathwayYears: 5 });
    expect(a.assumptions.join('')).toContain('PD-058');
  });

  test('a 22-year-old needs the adult mandatory requirements but no income', () => {
    expect(es(child('2004-06-01')).outcome).toBe('INSUFFICIENT_INFORMATION');
    const a = es({
      ...child('2004-06-01'),
      english: { cefrLevel: 'B2' },
      lifeInTheUk: { passed: true },
      governmentDebt: { outstanding: false },
    });
    expect(a).toMatchObject({ outcome: 'LIKELY_ELIGIBLE', pathwayYears: 5 });
    expect(a.assumptions.join('')).toContain('PD-059');
  });

  test('25 on the day the family became eligible fails; 24 that day does not', () => {
    // The family became eligible on 2024-11-01 (PD-060).
    const adult = {
      english: { cefrLevel: 'B2' as const },
      lifeInTheUk: { passed: true as const },
      governmentDebt: { outstanding: false },
    };
    const at25 = es({ ...child('1999-11-01'), ...adult });
    expect(pathwayOf(at25).status).toBe('FAIL');
    expect(pathwayOf(at25).explanation).toContain('须独立满足');
    expect(at25.outcome).toBe('LIKELY_NOT_ELIGIBLE');
    expect(at25.assumptions.join('')).toContain('PD-060');
    expect(es({ ...child('1999-11-02'), ...adult }).outcome).toBe(
      'LIKELY_ELIGIBLE',
    );
  });
});
