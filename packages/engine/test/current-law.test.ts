import { describe, expect, test } from 'vitest';
import {
  clEnglish,
  clKol,
  clLrResidence10Y,
  clScope,
  clSwResidence5Y,
  clSwSalary,
} from '../src/rules/current-law';
import { evaluate } from '../src/evaluate';
import type {
  ImmigrationEpisode,
  PersonTimeline,
  SettlementAssessment,
} from '../src/types';
import { asDependant, run, SIMULATION_DATE, timeline } from './helpers';

const episode = (
  extra: Partial<ImmigrationEpisode> = {},
): ImmigrationEpisode => ({
  route: 'SKILLED_WORKER',
  role: 'MAIN',
  validFrom: '2019-11-01',
  validTo: '2027-10-31',
  salary: 60000,
  ...extra,
});

describe('CL-SCOPE', () => {
  test('Skilled Worker main applicant is in scope', () => {
    expect(run(clScope).status).toBe('PASS');
  });

  test('a dependant or another route is out of scope', () => {
    expect(
      run(clScope, { episodes: [episode({ role: 'DEPENDANT' })] }).status,
    ).toBe('UNKNOWN');
    expect(
      run(clScope, { episodes: [episode({ route: 'GLOBAL_TALENT' })] }).status,
    ).toBe('UNKNOWN');
  });
});

describe('CL-SW-RESIDENCE-5Y', () => {
  test('5 years to the day passes, a day short fails with the due date', () => {
    expect(
      run(clSwResidence5Y, { episodes: [episode({ validFrom: '2021-11-04' })] })
        .status,
    ).toBe('PASS');
    const short = run(clSwResidence5Y, {
      episodes: [episode({ validFrom: '2021-11-05' })],
    });
    expect(short.status).toBe('FAIL');
    expect(short.explanation).toContain('2026-11-05');
  });

  test('Graduate time before Skilled Worker does not count', () => {
    const result = run(clSwResidence5Y, {
      episodes: [
        episode({
          route: 'GRADUATE',
          validFrom: '2019-11-01',
          validTo: '2021-10-31',
        }),
        episode({ validFrom: '2021-11-01' }),
      ],
    });
    expect(result.explanation).toContain('自 2021-11-01 起');
  });

  test('181 days abroad in 12 months restarts the period', () => {
    const result = run(clSwResidence5Y, {
      absences: [{ from: '2023-01-01', to: '2023-06-30' }],
    });
    expect(result.status).toBe('FAIL');
    expect(result.explanation).toContain('2028-07-01');
  });

  test('a dependant does not count', () => {
    expect(
      run(clSwResidence5Y, { episodes: [episode({ role: 'DEPENDANT' })] })
        .status,
    ).toBe('FAIL');
  });
});

describe('CL-SW-SALARY', () => {
  const at = (salary?: number) =>
    run(clSwSalary, { episodes: [episode({ salary })] }).status;

  test('£41,700 passes with a going-rate assumption; £41,699 is unknown', () => {
    expect(at(41700)).toBe('PASS');
    expect(run(clSwSalary).assumptions?.[0]).toContain('going rate');
    expect(at(41699)).toBe('UNKNOWN');
  });

  test('missing salary is unknown', () => {
    expect(at(undefined)).toBe('UNKNOWN');
  });
});

describe('CL-ENGLISH', () => {
  const b1 = { english: { cefrLevel: 'B1' as const } };

  test('Skilled Worker: no settlement English before 2027-03-26, B2 from then', () => {
    expect(run(clEnglish, { english: undefined }, '2027-03-25').status).toBe(
      'PASS',
    );
    expect(run(clEnglish, b1, '2027-03-26').status).toBe('FAIL');
    expect(run(clEnglish, {}, '2027-03-26').status).toBe('PASS');
    expect(run(clEnglish, { english: undefined }, '2027-03-26').status).toBe(
      'UNKNOWN',
    );
  });

  test('Long Residence: B1 before 2027-03-26, B2 from then', () => {
    const lr = {
      ...b1,
      episodes: [
        episode({
          route: 'STUDENT',
          validFrom: '2015-01-01',
          validTo: '2028-01-01',
        }),
      ],
    };
    expect(run(clEnglish, lr, '2027-03-25').status).toBe('PASS');
    expect(run(clEnglish, lr, '2027-03-26').status).toBe('FAIL');
    expect(
      run(clEnglish, { ...lr, english: { cefrLevel: 'A2' } }, '2027-03-25')
        .status,
    ).toBe('FAIL');
  });

  test('exempt at 65, not at 64', () => {
    expect(
      run(clEnglish, { ...b1, dateOfBirth: '1962-03-26' }, '2027-03-26').status,
    ).toBe('PASS');
    expect(
      run(clEnglish, { ...b1, dateOfBirth: '1962-03-27' }, '2027-03-26').status,
    ).toBe('FAIL');
  });
});

describe('CL-KOL', () => {
  test('passed or exempt passes; missing is unknown; 65 is exempt, 64 is not', () => {
    expect(run(clKol).status).toBe('PASS');
    expect(run(clKol, { lifeInTheUk: { exempt: true } }).status).toBe('PASS');
    expect(run(clKol, { lifeInTheUk: undefined }).status).toBe('UNKNOWN');
    expect(
      run(clKol, { lifeInTheUk: undefined, dateOfBirth: '1961-11-04' }).status,
    ).toBe('PASS');
    expect(
      run(clKol, { lifeInTheUk: undefined, dateOfBirth: '1961-11-05' }).status,
    ).toBe('UNKNOWN');
  });
});

describe('CL-LR-RESIDENCE-10Y', () => {
  const student = (validFrom: string, validTo: string) =>
    episode({ route: 'STUDENT', validFrom, validTo, salary: undefined });

  test('Student → Graduate → Skilled Worker counts for 10 years', () => {
    const result = run(clLrResidence10Y, {
      episodes: [
        student('2016-09-01', '2020-01-31'),
        episode({
          route: 'GRADUATE',
          validFrom: '2020-02-01',
          validTo: '2022-01-31',
        }),
        episode({ validFrom: '2022-02-01' }),
      ],
    });
    expect(result.status).toBe('PASS');
    expect(result.explanation).toContain('自 2016-09-01 起');
  });

  test('a Visitor period breaks the run', () => {
    const result = run(clLrResidence10Y, {
      episodes: [
        student('2014-09-01', '2018-08-31'),
        episode({
          route: 'VISIT',
          validFrom: '2018-09-01',
          validTo: '2018-12-31',
        }),
        student('2019-01-01', '2027-01-31'),
      ],
    });
    expect(result.status).toBe('FAIL');
    expect(result.explanation).toContain('2029-01-01');
  });

  test('legacy absences: a single 184-day absence before 2024-04-11 is fine, 185 breaks', () => {
    const lr = { episodes: [student('2014-09-01', '2027-01-31')] };
    // 2020-01-01 to 2020-07-02 is 184 days; 181 days in 12 months would break CR 3.1.
    expect(
      run(clLrResidence10Y, {
        ...lr,
        absences: [{ from: '2020-01-01', to: '2020-07-02' }],
      }).status,
    ).toBe('PASS');
    expect(
      run(clLrResidence10Y, {
        ...lr,
        absences: [{ from: '2020-01-01', to: '2020-07-03' }],
      }).status,
    ).toBe('FAIL');
  });

  test('absences after 2024-04-11 use CR 3.1', () => {
    const lr = { episodes: [student('2014-09-01', '2027-01-31')] };
    expect(
      run(clLrResidence10Y, {
        ...lr,
        absences: [{ from: '2025-01-01', to: '2025-06-30' }],
      }).status,
    ).toBe('FAIL');
  });

  test('CL-SCOPE: a non-Skilled-Worker route is in scope once Long Residence is met', () => {
    expect(
      run(clScope, { episodes: [student('2014-09-01', '2027-01-31')] }).status,
    ).toBe('PASS');
    expect(
      run(clScope, { episodes: [student('2020-09-01', '2027-01-31')] }).status,
    ).toBe('UNKNOWN');
  });
});

describe('Skilled Worker dependent partner (SW 38–SW 46)', () => {
  // The default timeline is the principal: Skilled Worker since 2019-11-01.
  const partnerFrom = (validFrom: string): ImmigrationEpisode[] => [
    {
      route: 'SKILLED_WORKER',
      role: 'DEPENDANT',
      validFrom,
      validTo: '2027-10-31',
      dependantOf: 'PARTNER',
    },
  ];
  const cl = (
    dependant: Partial<PersonTimeline>,
    principal: Partial<PersonTimeline> | null = {},
    simulationDate = SIMULATION_DATE,
  ) =>
    evaluate({
      timeline: timeline(dependant),
      simulationDate,
      ...(principal && { principal: timeline(principal) }),
    }).byRuleSet['current-law-2026-11']!;
  const statusOf = (a: SettlementAssessment, id: string) =>
    a.rules.find((r) => r.id === id)?.status;

  test('CL-SCOPE: a partner is in scope only with the principal; a child is not modelled', () => {
    expect(statusOf(cl({ episodes: asDependant('PARTNER') }), 'CL-SCOPE')).toBe(
      'PASS',
    );
    const alone = cl({ episodes: asDependant('PARTNER') }, null);
    expect(alone.outcome).toBe('INSUFFICIENT_INFORMATION');
    expect(alone.rules[0].explanation).toContain('填写主申请人信息');
    const child = cl({ episodes: asDependant('PARENT') });
    expect(child.outcome).toBe('INSUFFICIENT_INFORMATION');
    expect(child.rules[0].explanation).toContain('Appendix Children');
  });

  test('arriving with the principal settles with them, with no income requirement', () => {
    const a = cl({ episodes: asDependant('PARTNER'), incomeYears: [] });
    expect(a).toMatchObject({
      outcome: 'LIKELY_ELIGIBLE',
      pathwayYears: 5,
      earliestDate: SIMULATION_DATE,
    });
    expect(statusOf(a, 'CL-SW-PARTNER-5Y')).toBe('PASS');
    expect(a.rules.some((r) => r.id === 'CL-SW-SALARY')).toBe(false);
  });

  test('5 years as a dependent partner to the day qualifies; a day short projects the date', () => {
    expect(cl({ episodes: partnerFrom('2021-11-04') }).outcome).toBe(
      'LIKELY_ELIGIBLE',
    );
    const short = cl({ episodes: partnerFrom('2021-11-05') });
    expect(short).toMatchObject({
      outcome: 'LIKELY_NOT_ELIGIBLE',
      pathwayYears: 5,
      earliestDate: '2026-11-05',
    });
    expect(statusOf(short, 'CL-SW-PARTNER-5Y')).toBe('FAIL');
  });

  test('not before the principal completes the Skilled Worker period (SW 39.1(a))', () => {
    const recent = [
      episode({ validFrom: '2024-02-01', validTo: '2029-12-31' }),
    ];
    expect(
      cl({ episodes: partnerFrom('2024-02-01') }, { episodes: recent }),
    ).toMatchObject({
      outcome: 'LIKELY_NOT_ELIGIBLE',
      earliestDate: '2029-02-01',
    });
  });

  test('a principal who cannot settle as a Skilled Worker fails the partner', () => {
    const a = cl(
      { episodes: asDependant('PARTNER') },
      { english: { cefrLevel: 'B1' } },
      '2027-04-01',
    );
    expect(statusOf(a, 'CL-SW-PARTNER-5Y')).toBe('FAIL');
    expect(a.outcome).toBe('LIKELY_NOT_ELIGIBLE');
  });

  test('a principal with missing input or not on Skilled Worker leaves it unknown', () => {
    const missing = cl(
      { episodes: asDependant('PARTNER') },
      { episodes: [episode({ salary: undefined })] },
    );
    expect(statusOf(missing, 'CL-SW-PARTNER-5Y')).toBe('UNKNOWN');
    expect(missing.outcome).toBe('INSUFFICIENT_INFORMATION');
    const other = cl(
      { episodes: asDependant('PARTNER') },
      { episodes: [episode({ route: 'GLOBAL_TALENT' })] },
    );
    expect(
      other.rules.find((r) => r.id === 'CL-SW-PARTNER-5Y')?.explanation,
    ).toContain('SW 39.1(b)');
  });

  test('English: B1 before 2027-03-26, B2 from then (SW 44.1)', () => {
    const partner = { episodes: asDependant('PARTNER') };
    const b1 = { ...partner, english: { cefrLevel: 'B1' as const } };
    const a2 = { ...partner, english: { cefrLevel: 'A2' as const } };
    expect(run(clEnglish, b1, '2027-03-25').status).toBe('PASS');
    expect(run(clEnglish, a2, '2027-03-25').status).toBe('FAIL');
    expect(run(clEnglish, b1, '2027-03-26').status).toBe('FAIL');
    expect(run(clEnglish, partner, '2027-03-26').status).toBe('PASS');
  });
});
