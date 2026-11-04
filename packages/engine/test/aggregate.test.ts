import { describe, expect, test } from 'vitest';
import { evaluate } from '../src/evaluate';
import type { ImmigrationEpisode, PersonTimeline } from '../src/types';
import { SIMULATION_DATE, timeline } from './helpers';

function es(overrides: Partial<PersonTimeline>) {
  return evaluate({
    timeline: timeline(overrides),
    simulationDate: SIMULATION_DATE,
  }).byRuleSet['earned-settlement-2026-11']!;
}

const sw = (
  validFrom: string,
  extra: Partial<ImmigrationEpisode> = {},
): ImmigrationEpisode => ({
  route: 'SKILLED_WORKER',
  role: 'MAIN',
  validFrom,
  validTo: '2029-12-31',
  socCode: '2136',
  salary: 60000,
  ...extra,
});

describe('Earned Settlement pathway', () => {
  test('higher earner with 7 years qualifies now on the 5-year pathway', () => {
    const a = es({});
    expect(a).toMatchObject({
      outcome: 'LIKELY_ELIGIBLE',
      pathwayYears: 5,
      earliestDate: SIMULATION_DATE,
      routeGroup: 'CORE_PERMISSION',
    });
    expect(a.assumptions[0]).toContain('PD-003');
  });

  test('a failed mandatory requirement is not eligible, with no pathway', () => {
    const a = es({ english: { cefrLevel: 'B1' } });
    expect(a.outcome).toBe('LIKELY_NOT_ELIGIBLE');
    expect(a.pathwayYears).toBeUndefined();
  });

  test('short residence projects the earliest date', () => {
    const a = es({ episodes: [sw('2024-02-01')] });
    expect(a).toMatchObject({
      outcome: 'LIKELY_NOT_ELIGIBLE',
      pathwayYears: 5,
      earliestDate: '2029-02-01',
    });
    expect(a.assumptions.at(-1)).toContain('自 2024-02-01 起持续居留');
  });

  test('residence exactly 5 years on the simulation date qualifies; a day short does not', () => {
    expect(es({ episodes: [sw('2021-11-04')] }).outcome).toBe(
      'LIKELY_ELIGIBLE',
    );
    expect(es({ episodes: [sw('2021-11-05')] }).earliestDate).toBe(
      '2026-11-05',
    );
  });

  test('public funds leave only the 20-year pathway', () => {
    const a = es({
      benefits: [
        {
          benefitType: 'UNIVERSAL_CREDIT',
          from: '2024-01-01',
          to: '2024-03-31',
        },
      ],
    });
    expect(a).toMatchObject({
      outcome: 'LIKELY_NOT_ELIGIBLE',
      pathwayYears: 20,
      earliestDate: '2039-11-01',
    });
  });

  test('Family and Private Life cannot use the 5-year pathway', () => {
    const a = es({
      episodes: [
        {
          ...sw('2019-11-01'),
          route: 'FAMILY_AND_PRIVATE_LIFE',
          socCode: undefined,
        },
      ],
    });
    expect(a).toMatchObject({
      outcome: 'LIKELY_NOT_ELIGIBLE',
      pathwayYears: 10,
      earliestDate: '2029-11-01',
    });
  });

  test('missing input gives INSUFFICIENT_INFORMATION', () => {
    expect(es({ lifeInTheUk: undefined }).outcome).toBe(
      'INSUFFICIENT_INFORMATION',
    );
    expect(es({ episodes: [] }).outcome).toBe('INSUFFICIENT_INFORMATION');
  });

  test('an unknown caused only by a pending detail gives POTENTIALLY_ELIGIBLE', () => {
    // Switched into nursing in 2022 after 3 years in another Skilled Worker
    // job; earns below £50,271, so only the public service route could give 5
    // years, and that is PD-012.
    const a = es({
      episodes: [
        sw('2019-11-01', { validTo: '2022-10-31', salary: 35000 }),
        sw('2022-11-01', { socCode: '2231', salary: 35000 }),
      ],
      incomeYears: [
        '2019-20',
        '2020-21',
        '2021-22',
        '2022-23',
        '2023-24',
        '2024-25',
        '2025-26',
      ].map((taxYear) => ({
        taxYear,
        earnings: 35000,
      })),
    });
    expect(a).toMatchObject({
      outcome: 'POTENTIALLY_ELIGIBLE',
      pathwayYears: 5,
    });
  });

  test('care worker before the cut-off keeps 5 years', () => {
    const a = es({
      episodes: [sw('2023-02-01', { socCode: '6135', salary: 25000 })],
      incomeYears: ['2022-23', '2023-24', '2024-25', '2025-26'].map(
        (taxYear) => ({ taxYear, earnings: 25000 }),
      ),
    });
    expect(a).toMatchObject({
      outcome: 'LIKELY_NOT_ELIGIBLE',
      pathwayYears: 5,
      earliestDate: '2028-02-01',
    });
    expect(a.assumptions.join('')).toContain(
      '原文未规定同时符合过渡安排与标准路径时如何取舍',
    );
  });
});
