import { describe, expect, test } from 'vitest';
import { evaluate } from '../src/evaluate';
import { taxYearsFrom } from '../src/dates';
import {
  esAsylumSupport,
  esProtectionContribution,
  esProtectionPathway,
} from '../src/rules/es-protection';
import { esBreach } from '../src/rules/es-requirements';
import type {
  ImmigrationBreach,
  ImmigrationEpisode,
  PersonTimeline,
} from '../src/types';
import { run, timeline } from './helpers';

const ES = 'earned-settlement-2026-11';

// Granted protection on 2027-03-01 (p40 Individual B), born 1995.
const core: ImmigrationEpisode = {
  route: 'CORE_PROTECTION',
  role: 'MAIN',
  validFrom: '2027-03-01',
  validTo: '2060-12-31',
};
const coreThenWork: ImmigrationEpisode[] = [
  { ...core, validTo: '2028-02-29' },
  {
    route: 'PROTECTION_WORK_AND_STUDY',
    role: 'MAIN',
    validFrom: '2028-03-01',
    validTo: '2060-12-31',
    sustainedActivity: 'WORK',
  },
];
const ukrs = (validFrom = '2027-06-01'): ImmigrationEpisode[] => [
  {
    route: 'SAFE_AND_LEGAL',
    role: 'MAIN',
    validFrom,
    validTo: '2040-12-31',
    resettlementScheme: 'UK_RESETTLEMENT_SCHEME',
  },
];
const illegalEntry = (
  extra: Partial<ImmigrationBreach> = {},
): ImmigrationBreach[] => [
  { type: 'ILLEGAL_ENTRY', date: '2026-08-10', ...extra },
];

function refugee(overrides: Partial<PersonTimeline>): PersonTimeline {
  return timeline({
    dateOfBirth: '1995-05-01',
    nationality: 'SDN',
    incomeYears: [],
    asylumSupportRepayment: 'NOT_REQUIRED',
    ...overrides,
  });
}

function es(overrides: Partial<PersonTimeline>, simulationDate: string) {
  const result = evaluate({ timeline: refugee(overrides), simulationDate });
  return { result, column: result.byRuleSet[ES]! };
}

describe('ES-PROTECTION-PATHWAY', () => {
  test('base years per route', () => {
    const cp = run(
      esProtectionPathway,
      refugee({ episodes: [core] }),
      '2030-01-01',
    );
    expect(cp.status).toBe('PASS');
    expect(cp.explanation).toContain('20 年路径');
    expect(cp.assumptions?.[0]).toContain('PD-034');
    expect(
      run(
        esProtectionPathway,
        refugee({ episodes: coreThenWork }),
        '2030-01-01',
      ).explanation,
    ).toContain('10 年路径');
    expect(
      run(esProtectionPathway, refugee({ episodes: ukrs() }), '2030-01-01')
        .explanation,
    ).toContain('UK Resettlement Scheme');
  });

  test('Safe and Legal without the scheme is unknown, another designated route is declared', () => {
    const missing = run(
      esProtectionPathway,
      refugee({
        episodes: [{ ...ukrs()[0], resettlementScheme: undefined }],
      }),
      '2030-01-01',
    );
    expect(missing.status).toBe('UNKNOWN');
    expect(missing.pendingDetails).toBeUndefined();
    const other = run(
      esProtectionPathway,
      refugee({
        episodes: [{ ...ukrs()[0], resettlementScheme: 'OTHER_DESIGNATED' }],
      }),
      '2030-01-01',
    );
    expect(other.status).toBe('PASS');
    expect(other.assumptions?.[0]).toContain('PD-033');
  });

  test('illegal entry as an adult adds 10 years, naming the Table 2 row', () => {
    const result = run(
      esProtectionPathway,
      refugee({ episodes: [core], immigrationBreaches: illegalEntry() }),
      '2030-01-01',
    );
    expect(result.status).toBe('PASS');
    expect(result.explanation).toContain(
      'Core Protection following illegal entry',
    );
    expect(result.explanation).toContain('共 30 年');
  });

  test('illegal entry the day before turning 18 adds nothing', () => {
    const result = run(
      esProtectionPathway,
      refugee({
        episodes: [core],
        immigrationBreaches: illegalEntry({ date: '2013-04-30' }),
      }),
      '2030-01-01',
    );
    expect(result.explanation).not.toContain('非法入境');
  });

  test('Article 31 makes the extra years unknown and gives the other reading', () => {
    const result = run(
      esProtectionPathway,
      refugee({
        episodes: [core],
        immigrationBreaches: illegalEntry({ article31: true }),
      }),
      '2030-01-01',
    );
    expect(result.status).toBe('UNKNOWN');
    expect(result.pendingDetails).toEqual(['PD-032']);
    expect(result.explanation).toContain('为 30 年，最早 2057-03-01');
  });

  test('does not apply to other routes', () => {
    expect(run(esProtectionPathway).status).toBe('PASS');
  });
});

describe('protection pathways in evaluate', () => {
  test('protection routes are assessed, not short-circuited', () => {
    const { result, column } = es({ episodes: [core] }, '2030-01-01');
    expect(result.shortCircuit).toBeUndefined();
    expect(column.routeGroup).toBe('PROTECTION');
    expect(column.outcome).toBe('LIKELY_NOT_ELIGIBLE');
    expect(column.pathwayYears).toBe(20);
    expect(column.earliestDate).toBe('2047-03-01');
    expect(column.rules.map((r) => r.id)).not.toContain('ES-EARNINGS-10Y');
    expect(column.assumptions.join()).toContain('受监管');
  });

  test('a Core Protection grant counts 20 years to the day', () => {
    const { column } = es({ episodes: [core] }, '2047-03-01');
    expect(column.outcome).toBe('LIKELY_ELIGIBLE');
    expect(column.pathwayYears).toBe(20);
    expect(es({ episodes: [core] }, '2047-02-28').column.outcome).toBe(
      'LIKELY_NOT_ELIGIBLE',
    );
  });

  test('illegal entry on Core Protection gives 30 years', () => {
    const { result, column } = es(
      { episodes: [core], immigrationBreaches: illegalEntry() },
      '2030-01-01',
    );
    expect(result.shortCircuit).toBeUndefined();
    expect(column.pathwayYears).toBe(30);
    expect(column.earliestDate).toBe('2057-03-01');
  });

  test('Article 31 projects the base years', () => {
    const { column } = es(
      {
        episodes: [core],
        immigrationBreaches: illegalEntry({ article31: true }),
      },
      '2030-01-01',
    );
    expect(column.outcome).toBe('LIKELY_NOT_ELIGIBLE');
    expect(column.pathwayYears).toBe(20);
    const met = es(
      {
        episodes: [core],
        immigrationBreaches: illegalEntry({ article31: true }),
      },
      '2047-03-01',
    ).column;
    expect(met.outcome).toBe('POTENTIALLY_ELIGIBLE');
    expect(met.pathwayYears).toBe(20);
  });

  test('illegal entry on a non-protection route still short-circuits', () => {
    const r = evaluate({
      timeline: timeline({ immigrationBreaches: illegalEntry() }),
      simulationDate: '2026-11-04',
    });
    expect(r.shortCircuit?.reason).toBe('IMMIGRATION_BREACH');
  });

  test('a dependant on a protection route short-circuits the Earned Settlement column', () => {
    const r = evaluate({
      timeline: refugee({
        episodes: [{ ...core, role: 'DEPENDANT', dependantOf: 'PARTNER' }],
      }),
      principal: refugee({ episodes: [core] }),
      simulationDate: '2030-01-01',
    });
    expect(r.shortCircuit?.reason).toBe('PROTECTION');
    expect(r.byRuleSet[ES]?.outcome).toBe('REQUIRES_REGULATED_REVIEW');
    expect(r.byRuleSet['current-law-2026-11']?.outcome).not.toBe(
      'REQUIRES_REGULATED_REVIEW',
    );
  });
});

describe('ES-BREACH on protection routes', () => {
  test('illegal entry is left to the pathway', () => {
    const result = run(
      esBreach,
      refugee({ episodes: [core], immigrationBreaches: illegalEntry() }),
      '2030-01-01',
    );
    expect(result.status).toBe('PASS');
    expect(result.explanation).toContain('Table 2');
    expect(result.explanation).not.toContain('未满');
  });

  test('another adult breach still fails, with PD-065', () => {
    const result = run(
      esBreach,
      refugee({
        episodes: coreThenWork,
        immigrationBreaches: [
          ...illegalEntry(),
          { type: 'OVERSTAYING', date: '2025-01-01' },
        ],
      }),
      '2030-01-01',
    );
    expect(result.status).toBe('FAIL');
    expect(result.assumptions?.join()).toContain('PD-065');
  });

  test('Protection Work and Study with another breach falls back to 20 (+10) years', () => {
    const { column } = es(
      {
        episodes: coreThenWork,
        immigrationBreaches: [
          ...illegalEntry(),
          { type: 'DECEPTION', date: '2029-01-01' },
        ],
      },
      '2030-01-01',
    );
    expect(column.pathwayYears).toBe(30);
    expect(column.earliestDate).toBe('2058-03-01');
  });

  test('Safe and Legal with a breach falls back to 20 years', () => {
    const { column } = es(
      {
        episodes: ukrs(),
        immigrationBreaches: [{ type: 'OVERSTAYING', date: '2029-01-01' }],
      },
      '2030-01-01',
    );
    expect(column.pathwayYears).toBe(20);
    expect(column.earliestDate).toBe('2047-06-01');
  });

  test('illegal entry on Protection Work and Study gives 20 years (p40 Individual C)', () => {
    const { column } = es(
      { episodes: coreThenWork, immigrationBreaches: illegalEntry() },
      '2030-01-01',
    );
    expect(column.pathwayYears).toBe(20);
    expect(column.earliestDate).toBe('2048-03-01');
  });
});

describe('ES-ASYLUM-SUPPORT', () => {
  const at = (
    asylumSupportRepayment: PersonTimeline['asylumSupportRepayment'],
    episodes = [core],
  ) =>
    run(
      esAsylumSupport,
      refugee({ episodes, asylumSupportRepayment }),
      '2030-01-01',
    );

  test('repaid, on a plan or not required pass; outstanding fails', () => {
    expect(at('NOT_REQUIRED').status).toBe('PASS');
    expect(at('REPAID').status).toBe('PASS');
    expect(at('ON_PLAN').assumptions?.[0]).toContain('PD-031');
    expect(at('OUTSTANDING').status).toBe('FAIL');
  });

  test('missing is unknown without a pending detail', () => {
    const result = at(undefined);
    expect(result.status).toBe('UNKNOWN');
    expect(result.pendingDetails).toBeUndefined();
  });

  test('Safe and Legal does not run it', () => {
    const { column } = es(
      { episodes: ukrs(), asylumSupportRepayment: 'OUTSTANDING' },
      '2030-01-01',
    );
    expect(column.rules.map((r) => r.id)).not.toContain('ES-ASYLUM-SUPPORT');
    expect(at('OUTSTANDING', ukrs()).status).toBe('PASS');
  });

  test('outstanding repayment fails every Core Protection pathway', () => {
    const { column } = es(
      { episodes: [core], asylumSupportRepayment: 'OUTSTANDING' },
      '2047-03-01',
    );
    expect(column.outcome).toBe('LIKELY_NOT_ELIGIBLE');
    expect(column.pathwayYears).toBeUndefined();
  });

  test('missing repayment leaves a met pathway at insufficient information', () => {
    const { column } = es(
      { episodes: [core], asylumSupportRepayment: undefined },
      '2047-03-01',
    );
    expect(column.outcome).toBe('INSUFFICIENT_INFORMATION');
  });
});

describe('ES-PROTECTION-CONTRIBUTION', () => {
  const earning = (from: number, to: number, earnings = 20000) =>
    Array.from({ length: to - from + 1 }, (_, i) => ({
      taxYear: `${from + i}-${String((from + i + 1) % 100).padStart(2, '0')}`,
      earnings,
    }));
  const work = (
    overrides: Partial<PersonTimeline>,
    simulationDate = '2032-01-01',
  ) =>
    run(
      esProtectionContribution,
      refugee({ episodes: coreThenWork, ...overrides }),
      simulationDate,
    );

  test('complete tax years from the move, not the one containing it', () => {
    expect(taxYearsFrom('2028-03-01', '2032-01-01')).toEqual([
      '2028-29',
      '2029-30',
      '2030-31',
    ]);
    // Boundary: a move on 6 April counts that tax year.
    expect(taxYearsFrom('2028-04-06', '2029-05-01')).toEqual(['2028-29']);
    expect(taxYearsFrom('2028-04-07', '2029-05-01')).toEqual([]);
  });

  test('three years at £12,571 pass', () => {
    const result = work({ incomeYears: earning(2027, 2030) });
    expect(result.status).toBe('PASS');
    expect(result.explanation).toContain('2028-29、2029-30、2030-31');
    expect(result.assumptions?.[0]).toContain('PD-030');
  });

  test('the threshold is inclusive; one pound less does not count', () => {
    expect(work({ incomeYears: earning(2028, 2030, 12571) }).status).toBe(
      'PASS',
    );
    const below = work({
      incomeYears: [
        ...earning(2028, 2029, 12571),
        { taxYear: '2030-31', earnings: 12570 },
      ],
    });
    expect(below.status).toBe('UNKNOWN');
    expect(below.explanation).toContain('有 2 个');
  });

  test('not enough years yet is unknown until the period ends, then fails', () => {
    const early = work({ incomeYears: earning(2028, 2028) }, '2030-01-01');
    expect(early.status).toBe('UNKNOWN');
    expect(early.pendingDetails).toEqual(['PD-030']);
    const late = work({ incomeYears: earning(2028, 2037, 5000) }, '2038-03-01');
    expect(late.status).toBe('FAIL');
  });

  test('missing earnings after the period are unknown without a pending detail', () => {
    const result = work({ incomeYears: earning(2028, 2028) }, '2038-03-01');
    expect(result.status).toBe('UNKNOWN');
    expect(result.pendingDetails).toBeUndefined();
  });

  test('education or training is unknown (PD-030); missing activity is unknown', () => {
    const education = run(
      esProtectionContribution,
      refugee({
        episodes: [
          coreThenWork[0],
          { ...coreThenWork[1], sustainedActivity: 'EDUCATION' },
        ],
      }),
      '2032-01-01',
    );
    expect(education.pendingDetails).toEqual(['PD-030']);
    const missing = run(
      esProtectionContribution,
      refugee({
        episodes: [
          coreThenWork[0],
          { ...coreThenWork[1], sustainedActivity: undefined },
        ],
      }),
      '2032-01-01',
    );
    expect(missing.status).toBe('UNKNOWN');
    expect(missing.pendingDetails).toBeUndefined();
  });

  test('p40 Individual B settles 11 years after the grant', () => {
    const b = {
      incomeYears: earning(2027, 2037),
      asylumSupportRepayment: 'REPAID' as const,
    };
    const before = es({ episodes: coreThenWork, ...b }, '2030-01-01').column;
    expect(before.outcome).toBe('LIKELY_NOT_ELIGIBLE');
    expect(before.pathwayYears).toBe(10);
    expect(before.earliestDate).toBe('2038-03-01');
    const on = es({ episodes: coreThenWork, ...b }, '2038-03-01').column;
    expect(on.outcome).toBe('LIKELY_ELIGIBLE');
    expect(on.pathwayYears).toBe(10);
  });

  test('public funds on Protection Work and Study leave 20 years', () => {
    const { column } = es(
      {
        episodes: coreThenWork,
        incomeYears: earning(2027, 2037),
        benefits: [
          {
            benefitType: 'UNIVERSAL_CREDIT',
            from: '2029-01-01',
            to: '2029-06-30',
          },
        ],
      },
      '2030-01-01',
    );
    expect(column.pathwayYears).toBe(20);
    expect(column.earliestDate).toBe('2048-03-01');
  });
});
