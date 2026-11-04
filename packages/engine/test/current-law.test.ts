import { describe, expect, test } from 'vitest';
import {
  clEnglish,
  clKol,
  clLrResidence10Y,
  clScope,
  clSwChild,
  clSwGoingRate,
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
      run(clScope, { episodes: [episode({ route: 'UK_ANCESTRY' })] }).status,
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

  test('SW 21.2: Global Talent then Skilled Worker counts from the Global Talent start', () => {
    const episodes = [
      episode({
        route: 'GLOBAL_TALENT',
        validFrom: '2022-03-01',
        validTo: '2024-02-29',
        salary: undefined,
      }),
      episode({ validFrom: '2024-03-01', validTo: '2029-02-28' }),
    ];
    const result = run(clSwResidence5Y, { episodes });
    expect(result.status).toBe('FAIL');
    expect(result.explanation).toContain('自 2022-03-01 起');
    expect(
      evaluate({
        timeline: timeline({ episodes }),
        simulationDate: SIMULATION_DATE,
      }).byRuleSet['current-law-2026-11'],
    ).toMatchObject({ pathwayYears: 5, earliestDate: '2027-03-01' });
    expect(run(clSwResidence5Y, { episodes }, '2027-03-01').status).toBe(
      'PASS',
    );
  });

  test('SW 21.2: dependant time or a non-listed route breaks the run; the current permission must be Skilled Worker', () => {
    const before = (
      route: ImmigrationEpisode['route'],
      role: 'MAIN' | 'DEPENDANT',
    ) => [
      episode({ route, role, validFrom: '2020-03-01', validTo: '2024-02-29' }),
      episode({ validFrom: '2024-03-01', validTo: '2029-02-28' }),
    ];
    expect(
      run(clSwResidence5Y, { episodes: before('GLOBAL_TALENT', 'DEPENDANT') })
        .explanation,
    ).toContain('自 2024-03-01 起');
    expect(
      run(clSwResidence5Y, { episodes: before('UK_ANCESTRY', 'MAIN') })
        .explanation,
    ).toContain('自 2024-03-01 起');
    expect(
      run(clSwResidence5Y, {
        episodes: [
          episode({ validFrom: '2019-03-01', validTo: '2022-02-28' }),
          episode({
            route: 'GLOBAL_TALENT',
            validFrom: '2022-03-01',
            validTo: '2027-02-28',
          }),
        ],
      }).status,
    ).toBe('FAIL');
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
  // From 2025: no SW 4.2(b)(ii), so row A unless another row applies.
  const at = (
    salary: number | undefined,
    extra: Partial<ImmigrationEpisode> = {},
    simulationDate = '2030-03-01',
  ) =>
    run(
      clSwSalary,
      {
        episodes: [
          episode({
            validFrom: '2025-03-01',
            validTo: '2030-12-31',
            socCode: '2136',
            salary,
            ...extra,
          }),
        ],
      },
      simulationDate,
    );

  test('row A: £41,700 passes, £41,699 fails, naming the row', () => {
    const pass = at(41700);
    expect(pass.status).toBe('PASS');
    expect(pass.explanation).toContain('row A');
    expect(pass.assumptions?.join('')).toContain('Immigration Salary List');
    expect(at(41699).status).toBe('FAIL');
  });

  test('row B: Immigration Salary List lowers it to £33,400', () => {
    const isl = { immigrationSalaryList: true };
    expect(at(33400, isl)).toMatchObject({ status: 'PASS' });
    expect(at(33400, isl).explanation).toContain('row B');
    expect(at(33399, isl).status).toBe('FAIL');
  });

  test('row C: SW 4.2(b)(ii) before 2024-04-04, or a Health and Care ASHE job', () => {
    const pre = (validFrom: string, date = SIMULATION_DATE) =>
      run(
        clSwSalary,
        { episodes: [episode({ validFrom, socCode: '2136', salary: 31300 })] },
        date,
      );
    expect(pre('2024-04-03').status).toBe('PASS');
    expect(pre('2024-04-03').explanation).toContain('row C');
    expect(pre('2024-04-04').status).toBe('FAIL');
    // SW 4.2(b)(ii) stops applying from 2030-04-04.
    expect(pre('2024-04-03', '2030-04-04').status).toBe('FAIL');
    // 6135 is also on the Immigration Salary List; declared off it here.
    const careOffList = { socCode: '6135', immigrationSalaryList: false };
    const care = at(31300, careOffList);
    expect(care.status).toBe('PASS');
    expect(care.explanation).toContain('Health and Care ASHE');
    expect(care.assumptions?.join('')).toContain('SW A1.1(a)–(f)');
    expect(at(31299, careOffList).status).toBe('FAIL');
  });

  test('row D: a Table 3 occupation, or Immigration Salary List with SW 4.2(b)', () => {
    expect(at(25000, { socCode: '2231' }).status).toBe('PASS');
    expect(at(25000, { socCode: '2231' }).explanation).toContain('row D');
    expect(at(24999, { socCode: '2231' }).status).toBe('FAIL');
    const islCare = { socCode: '6135', immigrationSalaryList: true };
    expect(at(25000, islCare).explanation).toContain('row D');
    // Immigration Salary List alone is row B.
    expect(at(25000, { immigrationSalaryList: true }).status).toBe('FAIL');
  });

  describe('Immigration Salary List derived from the SOC code (SRC-019)', () => {
    // SOC 2112 (Biological scientists, all jobs) is on the list; 2136 is not.
    test('declared false overrides a listed occupation: row A', () => {
      const r = at(33400, { socCode: '2112', immigrationSalaryList: false });
      expect(r.status).toBe('FAIL');
      expect(r.explanation).toContain('row A');
      expect(r.assumptions?.join('')).not.toContain('推导');
    });

    test('not declared, listed occupation: row B, or row D with SW 4.2(b)', () => {
      const b = at(33400, { socCode: '2112' }, '2026-11-04');
      expect(b.status).toBe('PASS');
      expect(b.explanation).toContain('row B');
      expect(b.assumptions?.join('')).toContain('按职业代码推导');
      expect(b.assumptions?.join('')).toContain(
        '清单条目的移除日期为 2026-12-31，已按申请日比较',
      );
      expect(at(33399, { socCode: '2112' }, '2026-11-04').status).toBe('FAIL');
      // 6135 is also a Health and Care ASHE salary job (SW 4.2(b)(i)).
      const d = at(25000, { socCode: '6135' }, '2028-04-01');
      expect(d.status).toBe('PASS');
      expect(d.explanation).toContain('row D');
      expect(d.explanation).toContain('上，且 SOC 6135 属');
    });

    test('an entry removed before the date of application no longer counts', () => {
      // 6135 (removal date 2028-07-22): still on the list on that day.
      expect(
        at(25000, { socCode: '6135' }, '2028-07-22').explanation,
      ).toContain('row D');
      const after = at(25000, { socCode: '6135' }, '2028-07-23');
      expect(after.status).toBe('FAIL');
      expect(after.explanation).toContain('row C');
      expect(after.assumptions?.join('')).toContain(
        'SOC 6135 的清单条目移除日期为 2028-07-22，早于申请日，按不在清单处理',
      );
      // 2112 (removal date 2026-12-31) on 2027-01-01: row A.
      const a = at(33400, { socCode: '2112' }, '2027-01-01');
      expect(a.status).toBe('FAIL');
      expect(a.explanation).toContain('row A');
      // A declaration still decides.
      expect(
        at(
          33400,
          { socCode: '2112', immigrationSalaryList: true },
          '2027-01-01',
        ).status,
      ).toBe('PASS');
    });

    test('not declared, occupation not listed: row A', () => {
      const r = at(41699, { socCode: '2136' });
      expect(r.status).toBe('FAIL');
      expect(r.explanation).toContain('row A');
      expect(r.assumptions?.join('')).toContain('按不在清单处理');
    });
  });

  test('missing salary is unknown; missing SOC is unknown only below the row', () => {
    expect(at(undefined).status).toBe('UNKNOWN');
    expect(at(30000, { socCode: undefined }).status).toBe('UNKNOWN');
    expect(at(41700, { socCode: undefined }).status).toBe('PASS');
  });
});

describe('CL-SW-GOING-RATE', () => {
  const at = (
    extra: Partial<ImmigrationEpisode> = {},
    validFrom = '2025-03-01',
    simulationDate = '2030-03-01',
  ) =>
    run(
      clSwGoingRate,
      {
        episodes: [
          episode({
            validFrom,
            validTo: '2030-12-31',
            socCode: '2136',
            salary: 55000,
            ...extra,
          }),
        ],
      },
      simulationDate,
    );

  test('row A from 2025: SOC 2136 at £55,000 passes Table 1 (£41,200); SOC 1111 (£88,100) fails', () => {
    const pass = at();
    expect(pass.status).toBe('PASS');
    expect(pass.explanation).toContain('Table 1');
    expect(pass.explanation).toContain('£41,200');
    expect(pass.assumptions?.join('')).toContain('37.5');
    const fail = at({ socCode: '1111' });
    expect(fail.status).toBe('FAIL');
    expect(fail.explanation).toContain('£88,100');
    const full = (socCode: string) =>
      evaluate({
        timeline: timeline({
          episodes: [
            episode({
              validFrom: '2025-03-01',
              validTo: '2030-12-31',
              socCode,
              salary: 55000,
            }),
          ],
        }),
        simulationDate: '2030-03-01',
      }).byRuleSet['current-law-2026-11']!;
    expect(full('2136').outcome).toBe('LIKELY_ELIGIBLE');
    expect(full('1111').outcome).toBe('LIKELY_NOT_ELIGIBLE');
  });

  test('the going rate itself passes, a pound below fails', () => {
    expect(at({ salary: 41200 }).status).toBe('PASS');
    expect(at({ salary: 41199 }).status).toBe('FAIL');
  });

  test('missing or unlisted SOC is unknown', () => {
    const missing = at({ socCode: undefined });
    expect(missing.status).toBe('UNKNOWN');
    expect(missing.pendingDetails).toBeUndefined();
    expect(at({ socCode: '9999' }).status).toBe('UNKNOWN');
  });

  test('row C uses Table 2 (SOC 2136 £34,500), then Table 2a with a same-sponsor assumption', () => {
    const c = run(clSwGoingRate, {
      episodes: [episode({ socCode: '2136', salary: 34500 })],
    });
    expect(c.status).toBe('PASS');
    expect(c.explanation).toContain('row C');
    expect(c.explanation).toContain('Table 2，');
    const t2a = run(clSwGoingRate, {
      episodes: [episode({ socCode: '3214', salary: 31299 })],
    });
    expect(t2a.status).toBe('FAIL');
    expect(t2a.explanation).toContain('Table 2a');
    expect(t2a.assumptions?.join('')).toContain('同一 sponsor');
  });

  test('Table 1a only before 2025-07-22; a later start is unknown', () => {
    const before = at({ socCode: '1150', salary: 45000 }, '2025-07-21');
    expect(before.status).toBe('PASS');
    expect(before.explanation).toContain('Table 1a');
    const after = at({ socCode: '1150', salary: 45000 }, '2025-07-22');
    expect(after.status).toBe('UNKNOWN');
    expect(after.explanation).toContain('2025-07-22');
  });

  test('row D Table 3 occupation is unknown without a pending detail', () => {
    const nurse = at({ socCode: '2231', salary: 40000 });
    expect(nurse.status).toBe('UNKNOWN');
    expect(nurse.explanation).toContain('Table 4 / 5');
    expect(nurse.pendingDetails).toBeUndefined();
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

  test('CL-SCOPE: a partner or child is in scope only with the principal', () => {
    expect(statusOf(cl({ episodes: asDependant('PARTNER') }), 'CL-SCOPE')).toBe(
      'PASS',
    );
    const alone = cl({ episodes: asDependant('PARTNER') }, null);
    expect(alone.outcome).toBe('INSUFFICIENT_INFORMATION');
    expect(alone.rules[0].explanation).toContain('填写主申请人信息');
    expect(statusOf(cl({ episodes: asDependant('PARENT') }), 'CL-SCOPE')).toBe(
      'PASS',
    );
    const child = cl({ episodes: asDependant('PARENT') }, null);
    expect(child.outcome).toBe('INSUFFICIENT_INFORMATION');
    expect(child.rules[0].explanation).toContain('dependent child');
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

describe('Skilled Worker dependent child (SW 39.1, SW 41A.1)', () => {
  // The default timeline is the principal: Skilled Worker since 2019-11-01.
  const child = (extra: Partial<PersonTimeline> = {}) => ({
    dateOfBirth: '2012-05-01',
    episodes: asDependant('PARENT'),
    incomeYears: [],
    english: undefined,
    lifeInTheUk: undefined,
    ...extra,
  });
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
  const rule = (a: SettlementAssessment) =>
    a.rules.find((r) => r.id === 'CL-SW-CHILD')!;
  const principalFrom = (validFrom: string) => ({
    episodes: [episode({ validFrom, socCode: '2136' })],
  });

  test('a 14-year-old settles with the principal, without English or Life in the UK', () => {
    const a = cl(child());
    expect(a).toMatchObject({
      outcome: 'LIKELY_ELIGIBLE',
      pathwayYears: 5,
      earliestDate: SIMULATION_DATE,
    });
    expect(rule(a).status).toBe('PASS');
    expect(rule(a).explanation).toContain('CHI 1.1');
    expect(a.assumptions.join('')).toContain('CHI 1A.1');
    expect(a.assumptions.join('')).toContain('CHI 2.1');
    expect(a.rules.some((r) => r.id === 'CL-SW-PARTNER-5Y')).toBe(false);
  });

  test('a 20-year-old on a dependent child permission qualifies under CHI 1.2 with B1 and Life in the UK', () => {
    const adult = child({ dateOfBirth: '2006-05-01' });
    const missing = cl(adult);
    expect(rule(missing).explanation).toContain('CHI 1.2(a)');
    expect(missing.assumptions.join('')).not.toContain('CHI 2.1');
    expect(missing.outcome).toBe('INSUFFICIENT_INFORMATION');
    expect(
      cl({
        ...adult,
        english: { cefrLevel: 'B1' },
        lifeInTheUk: { passed: true },
      }).outcome,
    ).toBe('LIKELY_ELIGIBLE');
    expect(
      cl({
        ...adult,
        english: { cefrLevel: 'A2' },
        lifeInTheUk: { passed: true },
      }).outcome,
    ).toBe('LIKELY_NOT_ELIGIBLE');
  });

  test('settles when the principal completes 5 years: to the day, and a day short with the date', () => {
    expect(cl(child(), principalFrom('2021-11-04')).outcome).toBe(
      'LIKELY_ELIGIBLE',
    );
    const short = cl(child(), principalFrom('2021-11-05'));
    expect(short).toMatchObject({
      outcome: 'LIKELY_NOT_ELIGIBLE',
      pathwayYears: 5,
      earliestDate: '2026-11-05',
    });
    expect(rule(short).status).toBe('FAIL');
  });

  test('a principal who cannot settle fails the child; a missing principal leaves it insufficient', () => {
    const failing = cl(child(), { english: { cefrLevel: 'B1' } }, '2027-04-01');
    expect(rule(failing).status).toBe('FAIL');
    expect(failing.outcome).toBe('LIKELY_NOT_ELIGIBLE');
    const alone = cl(child(), null);
    expect(alone.outcome).toBe('INSUFFICIENT_INFORMATION');
    expect(run(clSwChild, child()).status).toBe('UNKNOWN');
  });

  test('not a dependent child: a partner fails CL-SW-CHILD', () => {
    expect(run(clSwChild, { episodes: asDependant('PARTNER') }).status).toBe(
      'FAIL',
    );
  });
});

describe('principal already settled (SW 39.1(b))', () => {
  // The principal settled on 2025-06-01 after Skilled Worker since 2019-11-01.
  const settled = (
    route: PersonTimeline['episodes'][number]['route'] = 'SKILLED_WORKER',
    date = '2025-06-01',
  ): Partial<PersonTimeline> => ({
    episodes: [episode({ validTo: '2025-05-31', socCode: '2136' })],
    settled: { date, route },
  });
  const dependantFrom = (
    validFrom: string,
    dependantOf: 'PARTNER' | 'PARENT',
  ): ImmigrationEpisode[] => [
    {
      route: 'SKILLED_WORKER',
      role: 'DEPENDANT',
      validFrom,
      validTo: '2027-10-31',
      dependantOf,
    },
  ];
  const cl = (
    dependant: Partial<PersonTimeline>,
    principal: Partial<PersonTimeline>,
  ) =>
    evaluate({
      timeline: timeline(dependant),
      simulationDate: SIMULATION_DATE,
      principal: timeline(principal),
    }).byRuleSet['current-law-2026-11']!;
  const ruleOf = (a: SettlementAssessment, id: string) =>
    a.rules.find((r) => r.id === id)!;

  test('partner: 5 years of their own dependant permission, to the day and a day short', () => {
    const met = cl(
      { episodes: dependantFrom('2021-11-04', 'PARTNER') },
      settled(),
    );
    expect(met).toMatchObject({ outcome: 'LIKELY_ELIGIBLE', pathwayYears: 5 });
    expect(ruleOf(met, 'CL-SW-PARTNER-5Y').explanation).toContain('SW 39.1(b)');
    expect(
      cl({ episodes: dependantFrom('2021-11-05', 'PARTNER') }, settled()),
    ).toMatchObject({
      outcome: 'LIKELY_NOT_ELIGIBLE',
      earliestDate: '2026-11-05',
    });
  });

  test('child: can apply now, with the age and care requirements', () => {
    const a = cl(
      {
        dateOfBirth: '2012-05-01',
        episodes: dependantFrom('2021-11-05', 'PARENT'),
        english: undefined,
        lifeInTheUk: undefined,
      },
      settled(),
    );
    expect(a).toMatchObject({
      outcome: 'LIKELY_ELIGIBLE',
      pathwayYears: 5,
      earliestDate: SIMULATION_DATE,
    });
    expect(ruleOf(a, 'CL-SW-CHILD').explanation).toContain('SW 39.1(b)');
  });

  test('settled from another route, or joined after P settled, fails', () => {
    const other = cl(
      { episodes: dependantFrom('2021-11-04', 'PARTNER') },
      settled('GLOBAL_TALENT'),
    );
    expect(ruleOf(other, 'CL-SW-PARTNER-5Y').status).toBe('FAIL');
    const joined = cl(
      { episodes: dependantFrom('2025-06-02', 'PARENT') },
      settled(),
    );
    expect(ruleOf(joined, 'CL-SW-CHILD').status).toBe('FAIL');
    expect(ruleOf(joined, 'CL-SW-CHILD').explanation).toContain('未持有');
  });
});
