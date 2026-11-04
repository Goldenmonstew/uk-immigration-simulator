import { describe, expect, test } from 'vitest';
import { evaluate } from '../src/evaluate';
import { esProtectionPathway } from '../src/rules/es-protection';
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
    ...overrides,
  });
}

function es(overrides: Partial<PersonTimeline>, simulationDate: string) {
  const result = evaluate({ timeline: refugee(overrides), simulationDate });
  return { result, column: result.byRuleSet[ES]! };
}

describe('ES-PROTECTION-PATHWAY', () => {
  test('base years per route', () => {
    const cp = run(esProtectionPathway, refugee({ episodes: [core] }), '2030-01-01');
    expect(cp.status).toBe('PASS');
    expect(cp.explanation).toContain('20 年路径');
    expect(cp.assumptions?.[0]).toContain('PD-034');
    expect(
      run(esProtectionPathway, refugee({ episodes: coreThenWork }), '2030-01-01')
        .explanation,
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
