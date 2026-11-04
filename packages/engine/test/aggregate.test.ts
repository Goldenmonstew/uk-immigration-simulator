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
    expect(a.rules.find((r) => r.id === 'ES-RESIDENCE')?.status).toBe('FAIL');
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

  test('missing input gives INSUFFICIENT_INFORMATION without a pathway', () => {
    const noKol = es({ lifeInTheUk: undefined });
    expect(noKol.outcome).toBe('INSUFFICIENT_INFORMATION');
    expect(noKol.pathwayYears).toBeUndefined();
    const noIncome = es({ incomeYears: [] });
    expect(noIncome.outcome).toBe('INSUFFICIENT_INFORMATION');
    expect(noIncome.pathwayYears).toBeUndefined();
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

function cl(
  overrides: Partial<PersonTimeline>,
  simulationDate = SIMULATION_DATE,
) {
  return evaluate({ timeline: timeline(overrides), simulationDate }).byRuleSet[
    'current-law-2026-11'
  ]!;
}

describe('Earned Settlement: pre April 2024 Skilled Worker cohort (p44)', () => {
  const es = (validFrom: string) =>
    evaluate({
      timeline: timeline({ episodes: [sw(validFrom)] }),
      simulationDate: SIMULATION_DATE,
    }).byRuleSet['earned-settlement-2026-11']!;

  test('a Skilled Worker since before 2024-04-04 gets the renewal note, with the pathway unchanged', () => {
    const a = es('2024-04-03');
    expect(a.assumptions.join('')).toContain('2035');
    expect(a.pathwayYears).toBe(es('2024-04-04').pathwayYears);
  });

  test('from 2024-04-04 there is no note', () => {
    expect(es('2024-04-04').assumptions.join('')).not.toContain('2035');
  });
});

describe('current law', () => {
  test('Skilled Worker for 7 years on £60,000 qualifies after 5 years', () => {
    expect(cl({})).toMatchObject({
      outcome: 'LIKELY_ELIGIBLE',
      pathwayYears: 5,
      earliestDate: SIMULATION_DATE,
    });
  });

  test('2 years of Skilled Worker projects 5 years and flags B2', () => {
    const a = cl({ episodes: [sw('2025-02-01')] });
    expect(a).toMatchObject({
      outcome: 'LIKELY_NOT_ELIGIBLE',
      pathwayYears: 5,
      earliestDate: '2030-02-01',
    });
    expect(a.assumptions.join('')).toContain('届时定居须达到英语 B2');
  });

  test('£38,000 qualifies under SW 24.3 row C before 2024-04-04; from then it fails row A, and is insufficient without a SOC code', () => {
    expect(
      cl({ episodes: [sw('2019-11-01', { salary: 38000 })] }).outcome,
    ).toBe('LIKELY_ELIGIBLE');
    expect(
      cl({ episodes: [sw('2024-04-04', { salary: 38000 })] }, '2029-04-04')
        .outcome,
    ).toBe('LIKELY_NOT_ELIGIBLE');
    expect(
      cl(
        { episodes: [sw('2024-04-04', { salary: 38000, socCode: undefined })] },
        '2029-04-04',
      ).outcome,
    ).toBe('INSUFFICIENT_INFORMATION');
  });

  test('Student for 4 years is out of scope with only CL-SCOPE', () => {
    const a = cl({
      episodes: [
        {
          route: 'STUDENT',
          role: 'MAIN',
          validFrom: '2022-09-01',
          validTo: '2027-01-31',
        },
      ],
    });
    expect(a.outcome).toBe('INSUFFICIENT_INFORMATION');
    expect(a.rules.map((r) => r.id)).toEqual(['CL-SCOPE']);
  });

  test('Long Residence after 10 years on Student and Graduate', () => {
    const a = cl({
      episodes: [
        {
          route: 'STUDENT',
          role: 'MAIN',
          validFrom: '2015-09-01',
          validTo: '2021-01-31',
        },
        {
          route: 'GRADUATE',
          role: 'MAIN',
          validFrom: '2021-02-01',
          validTo: '2027-01-31',
        },
      ],
    });
    expect(a).toMatchObject({ outcome: 'LIKELY_ELIGIBLE', pathwayYears: 10 });
    expect(a.rules.some((r) => r.id.startsWith('CL-SW-'))).toBe(false);
  });
});

describe('dependants', () => {
  test('a dependant without a principal gets no Earned Settlement pathway or date', () => {
    const a = es({
      episodes: [sw('2025-01-15', { role: 'DEPENDANT', salary: undefined })],
    });
    expect(a.outcome).toBe('INSUFFICIENT_INFORMATION');
    expect(a.pathwayYears).toBeUndefined();
    expect(a.earliestDate).toBeUndefined();
    const pathway = a.rules.find((r) => r.id === 'ES-DEPENDANT-PATHWAY');
    expect(pathway?.status).toBe('UNKNOWN');
    expect(pathway?.explanation).toContain('填写主申请人信息后可判断');
  });

  test('a main applicant does not get the dependant rule', () => {
    expect(es({}).rules.some((r) => r.id === 'ES-DEPENDANT-PATHWAY')).toBe(
      false,
    );
  });
});
