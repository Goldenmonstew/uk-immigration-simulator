// SRC-001 p31 Individual E: a 25-year-old who still holds child dependant
// status cannot settle with their parents, who have not yet met a settlement
// pathway; they must qualify independently or move onto their own route
// (p30). Supplemented facts: the lead applicant arrives on 2021-04-06 as a
// Skilled Worker on £30,000, which only meets the minimum income, so the
// family's 10-year pathway completes on 2031-04-06 (when the child is 30;
// PD-060); the child was born on 2001-01-10 (25 on 2026-04-06), holds
// dependant permission from 2021-04-06 and meets the adult mandatory
// requirements: B2, Life in the UK, no debt, criminality, absences or public
// funds.
//
// Expected: the dependant pathway fails; independent settlement on their own
// route is not assessed here.
import type { Fixture } from '../../engine/src/types';
import { p31Principal } from './p31-principal';

const TAX_YEARS = ['2021-22', '2022-23', '2023-24', '2024-25', '2025-26'];

export const esP31IndividualEDependantAt25: Fixture = {
  id: 'ES-OFFICIAL-P31-INDIVIDUAL-E',
  title: 'Individual E: child dependant aged 25',
  source: { srcId: 'SRC-001', locator: 'p31' },
  request: {
    simulationDate: '2026-04-06',
    principal: {
      ...p31Principal,
      episodes: p31Principal.episodes.map((e) => ({ ...e, salary: 30000 })),
      incomeYears: TAX_YEARS.map((taxYear) => ({ taxYear, earnings: 30000 })),
    },
    timeline: {
      dateOfBirth: '2001-01-10',
      nationality: 'IND',
      episodes: [
        {
          route: 'SKILLED_WORKER',
          role: 'DEPENDANT',
          validFrom: '2021-04-06',
          validTo: '2027-04-05',
          dependantOf: 'PARENT',
        },
      ],
      absences: [],
      incomeYears: [],
      benefits: [],
      relationships: [{ type: 'PARENT', otherPartyStatus: 'OTHER' }],
      english: { cefrLevel: 'B2' },
      lifeInTheUk: { passed: true },
      criminalRecord: [],
      immigrationBreaches: [],
      governmentDebt: { outstanding: false },
    },
  },
  expected: {
    ruleSetId: 'earned-settlement-2026-11',
    outcome: 'LIKELY_NOT_ELIGIBLE',
    mustFail: ['ES-DEPENDANT-PATHWAY'],
  },
};
