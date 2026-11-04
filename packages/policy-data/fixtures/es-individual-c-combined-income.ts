// Fixtures type-import the engine by relative path: the engine depends on
// policy-data, so a package dependency back would be a cycle.
import type { Fixture } from '../../engine/src/types';

const TAX_YEARS = [
  '2019-20',
  '2020-21',
  '2021-22',
  '2022-23',
  '2023-24',
  '2024-25',
  '2025-26',
];

// SRC-001 p19: works part-time while caring for children, earns below
// £12,571, household meets £25,142, so qualifies once the residence period is
// complete if all other mandatory requirements are met. The source gives no
// dates; the timeline below completes 10 years and meets the other
// requirements. Partner is settled (not British), so no British connection.
export const esIndividualC: Fixture = {
  id: 'ES-OFFICIAL-INDIVIDUAL-C',
  title: 'Individual C: combined household income',
  source: { srcId: 'SRC-001', locator: 'p19' },
  request: {
    simulationDate: '2026-11-04',
    timeline: {
      dateOfBirth: '1988-04-12',
      nationality: 'IND',
      episodes: [
        {
          route: 'FAMILY_PARTNER_OR_PARENT',
          role: 'MAIN',
          validFrom: '2016-09-01',
          validTo: '2019-02-28',
        },
        {
          route: 'FAMILY_PARTNER_OR_PARENT',
          role: 'MAIN',
          validFrom: '2019-03-01',
          validTo: '2021-08-31',
        },
        {
          route: 'FAMILY_PARTNER_OR_PARENT',
          role: 'MAIN',
          validFrom: '2021-09-01',
          validTo: '2024-02-29',
        },
        {
          route: 'FAMILY_PARTNER_OR_PARENT',
          role: 'MAIN',
          validFrom: '2024-03-01',
          validTo: '2026-08-31',
        },
        {
          route: 'FAMILY_PARTNER_OR_PARENT',
          role: 'MAIN',
          validFrom: '2026-09-01',
          validTo: '2029-02-28',
        },
      ],
      absences: [],
      incomeYears: TAX_YEARS.map((taxYear) => ({
        taxYear,
        earnings: 9000,
        partnerEarnings: 28000,
      })),
      benefits: [],
      relationships: [{ type: 'PARTNER', otherPartyStatus: 'SETTLED' }],
      english: { cefrLevel: 'B2' },
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
