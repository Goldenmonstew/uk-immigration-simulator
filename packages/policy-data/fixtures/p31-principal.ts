// The lead applicant shared by the SRC-001 p31 dependant fixtures. Supplemented
// facts: arrives on 2021-04-06 as a Skilled Worker on £55,000 (salary and
// annual earnings) as an IT quality and testing professional (SOC 2136,
// Table 1 going rate £41,200; supplemented so the current-law salary rules
// can be checked), which meets the five-year earnings pathway (3 of the last
// 5 tax years at or above £50,271) on 2026-04-06; B2, Life in the UK, no
// absences, public funds, criminality, breaches or debt.
import type { PersonTimeline } from '../../engine/src/types';

const TAX_YEARS = ['2021-22', '2022-23', '2023-24', '2024-25', '2025-26'];

export const p31Principal: PersonTimeline = {
  dateOfBirth: '1986-09-20',
  nationality: 'IND',
  episodes: [
    {
      route: 'SKILLED_WORKER',
      role: 'MAIN',
      validFrom: '2021-04-06',
      validTo: '2024-04-05',
      salary: 55000,
      socCode: '2136',
    },
    {
      route: 'SKILLED_WORKER',
      role: 'MAIN',
      validFrom: '2024-04-06',
      validTo: '2027-04-05',
      salary: 55000,
      socCode: '2136',
    },
  ],
  absences: [],
  incomeYears: TAX_YEARS.map((taxYear) => ({ taxYear, earnings: 55000 })),
  benefits: [],
  relationships: [{ type: 'PARTNER', otherPartyStatus: 'OTHER' }],
  english: { cefrLevel: 'B2' },
  lifeInTheUk: { passed: true },
  criminalRecord: [],
  immigrationBreaches: [],
  governmentDebt: { outstanding: false },
};
