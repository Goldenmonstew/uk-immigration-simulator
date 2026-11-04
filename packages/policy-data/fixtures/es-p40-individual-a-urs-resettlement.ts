import type { Fixture } from '../../engine/src/types';

// SRC-001 p40 Individual A: comes to the UK through the UK Resettlement
// Scheme and can apply for settlement after five years, with A2 English and
// without the requirement not to have used public funds (p37, p39, p47).
// Supplementary facts: arrival on 2027-06-01 (after 2027-04-06, so not a
// Legacy Safe and Legal arrival, p26 note 13), born 1990, English at A2,
// Universal Credit claimed in 2028, the Life in the UK test not taken (exempt
// for now, p21 note 8, p39), no debt, criminal record or breach.
export const esP40IndividualAUrsResettlement: Fixture = {
  id: 'ES-OFFICIAL-P40-INDIVIDUAL-A',
  title: 'Individual A: UK Resettlement Scheme refugee',
  source: { srcId: 'SRC-001', locator: 'p40' },
  request: {
    simulationDate: '2032-06-01',
    timeline: {
      dateOfBirth: '1990-03-12',
      nationality: 'SYR',
      episodes: [
        {
          route: 'SAFE_AND_LEGAL',
          role: 'MAIN',
          validFrom: '2027-06-01',
          validTo: '2032-06-30',
          resettlementScheme: 'UK_RESETTLEMENT_SCHEME',
        },
      ],
      absences: [],
      incomeYears: [],
      benefits: [
        {
          benefitType: 'UNIVERSAL_CREDIT',
          from: '2028-01-01',
          to: '2028-12-31',
        },
      ],
      relationships: [],
      english: { cefrLevel: 'A2' },
      criminalRecord: [],
      immigrationBreaches: [],
      governmentDebt: { outstanding: false },
    },
  },
  expected: {
    ruleSetId: 'earned-settlement-2026-11',
    outcome: 'LIKELY_ELIGIBLE',
    pathwayYears: 5,
    earliestDate: '2032-06-01',
  },
};
