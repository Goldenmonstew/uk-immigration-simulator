// SRC-001 p16: three qualifying earnings years, two below-threshold maternity
// years, then two qualifying years meet the standard 10-year contribution test.
// Supplemented facts: all dates, nationality, family-partner permission with a
// settled non-British partner, and earnings of £20,000 / £5,000 are illustrative.
// The seven completed tax years end immediately before application; continuous
// qualifying residence totals 10 years. No partner income is relied on. The
// contract records the earnings dip, but has no maternity-leave field. All other
// requirements are assumed met: B2, Life in the UK, no absences, public funds,
// criminality, breaches or debt. No exact settlement date is asserted.
import type { Fixture } from '../../engine/src/types';

export const esP16MaternityBestYears: Fixture = {
  id: 'ES-OFFICIAL-P16-MATERNITY-BEST-YEARS',
  title: 'Maternity leave: five qualifying earnings years out of seven',
  source: { srcId: 'SRC-001', locator: 'p16' },
  request: {
    simulationDate: '2026-04-06',
    timeline: {
      dateOfBirth: '1988-04-12',
      nationality: 'IND',
      episodes: [
        {
          route: 'FAMILY_PARTNER_OR_PARENT',
          role: 'MAIN',
          validFrom: '2016-04-06',
          validTo: '2018-10-05',
        },
        {
          route: 'FAMILY_PARTNER_OR_PARENT',
          role: 'MAIN',
          validFrom: '2018-10-06',
          validTo: '2021-04-05',
        },
        {
          route: 'FAMILY_PARTNER_OR_PARENT',
          role: 'MAIN',
          validFrom: '2021-04-06',
          validTo: '2023-10-05',
        },
        {
          route: 'FAMILY_PARTNER_OR_PARENT',
          role: 'MAIN',
          validFrom: '2023-10-06',
          validTo: '2026-04-05',
        },
        {
          route: 'FAMILY_PARTNER_OR_PARENT',
          role: 'MAIN',
          validFrom: '2026-04-06',
          validTo: '2028-10-05',
        },
      ],
      absences: [],
      incomeYears: [
        { taxYear: '2019-20', earnings: 20000 },
        { taxYear: '2020-21', earnings: 20000 },
        { taxYear: '2021-22', earnings: 20000 },
        { taxYear: '2022-23', earnings: 5000 },
        { taxYear: '2023-24', earnings: 5000 },
        { taxYear: '2024-25', earnings: 20000 },
        { taxYear: '2025-26', earnings: 20000 },
      ],
      benefits: [],
      relationships: [{ type: 'PARTNER', otherPartyStatus: 'SETTLED' }],
      english: { cefrLevel: 'B2' },
      lifeInTheUk: { passed: true },
      criminalRecord: [],
      immigrationBreaches: [],
      governmentDebt: { outstanding: false },
    },
  },
  expected: {
    ruleSetId: 'earned-settlement-2026-11',
    outcome: 'LIKELY_ELIGIBLE',
    pathwayYears: 10,
  },
};
