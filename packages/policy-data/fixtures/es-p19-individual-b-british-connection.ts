// SRC-001 p19 Individual B: earns £42,000 and is married to a British citizen,
// qualifying for the five-year pathway without the higher earnings threshold.
// Supplemented facts: all dates, nationality, family-partner permission and
// £42,000 earnings in each of the five completed tax years. Continuous residence
// exceeds five years. PARTNER represents the source's spouse; no partner income
// is relied on. All other requirements are assumed met: B2, Life in the UK,
// no absences, public funds, criminality, breaches or debt. No date is asserted.
import type { Fixture } from '../../engine/src/types';

const TAX_YEARS = ['2021-22', '2022-23', '2023-24', '2024-25', '2025-26'];

export const esP19IndividualBBritishConnection: Fixture = {
  id: 'ES-OFFICIAL-P19-INDIVIDUAL-B',
  title: 'Individual B: spouse of a British citizen',
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
      incomeYears: TAX_YEARS.map((taxYear) => ({ taxYear, earnings: 42000 })),
      benefits: [],
      relationships: [{ type: 'PARTNER', otherPartyStatus: 'BRITISH_CITIZEN' }],
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
    pathwayYears: 5,
  },
};
