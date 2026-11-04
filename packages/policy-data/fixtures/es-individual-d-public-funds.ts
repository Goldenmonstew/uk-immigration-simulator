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

// SRC-001 p19: accessed specified public funds in the five years before
// applying and has no exemption, so does not qualify now. They must either
// complete five years without public funds or reach 20 years, so the source
// fixes no single pathway length or date. The timeline is on a route with
// recourse to public funds (claiming on a no-recourse route would also be a
// breach) and otherwise meets the 10-year pathway, so public funds is the only
// failing rule. The exemption list is not yet published (p18, PD-013); per the source
// we assume none applies.
export const esIndividualD: Fixture = {
  id: 'ES-OFFICIAL-INDIVIDUAL-D',
  title: 'Individual D: accessed public funds',
  source: { srcId: 'SRC-001', locator: 'p19' },
  request: {
    simulationDate: '2026-11-04',
    timeline: {
      dateOfBirth: '1985-07-20',
      nationality: 'NGA',
      episodes: [
        {
          route: 'FAMILY_AND_PRIVATE_LIFE',
          role: 'MAIN',
          validFrom: '2015-06-01',
          validTo: '2017-11-30',
        },
        {
          route: 'FAMILY_AND_PRIVATE_LIFE',
          role: 'MAIN',
          validFrom: '2017-12-01',
          validTo: '2020-05-31',
        },
        {
          route: 'FAMILY_AND_PRIVATE_LIFE',
          role: 'MAIN',
          validFrom: '2020-06-01',
          validTo: '2022-11-30',
        },
        {
          route: 'FAMILY_AND_PRIVATE_LIFE',
          role: 'MAIN',
          validFrom: '2022-12-01',
          validTo: '2025-05-31',
        },
        {
          route: 'FAMILY_AND_PRIVATE_LIFE',
          role: 'MAIN',
          validFrom: '2025-06-01',
          validTo: '2027-11-30',
        },
      ],
      absences: [],
      incomeYears: TAX_YEARS.map((taxYear) => ({ taxYear, earnings: 20000 })),
      benefits: [
        {
          benefitType: 'UNIVERSAL_CREDIT',
          from: '2023-01-01',
          to: '2023-09-30',
        },
      ],
      relationships: [],
      english: { cefrLevel: 'B2' },
      criminalRecord: [],
      immigrationBreaches: [],
      governmentDebt: { outstanding: false },
    },
  },
  expected: {
    ruleSetId: 'earned-settlement-2026-11',
    outcome: 'LIKELY_NOT_ELIGIBLE',
    mustFail: ['ES-PUBLIC-FUNDS'],
  },
};
