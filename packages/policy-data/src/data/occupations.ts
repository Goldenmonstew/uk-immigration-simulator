import type { SourceRef } from '../types';

export interface Occupation {
  /** SOC 2020 occupation code. */
  socCode: string;
  title: string;
}

// Annex C of SRC-001 (p58–p59) lists the qualifying public service
// occupations by title only. The SOC 2020 codes are taken from the same titles
// in Appendix Skilled Worker SW 16.1 (SRC-004), where Annex C's "Registered
// ... nurses" appear without "Registered".
export const annexCOccupations: {
  sources: SourceRef[];
  occupations: Occupation[];
} = {
  sources: [
    { srcId: 'SRC-001', locator: 'p58' },
    { srcId: 'SRC-001', locator: 'p59' },
    { srcId: 'SRC-004', locator: 'SW 16.1' },
  ],
  occupations: [
    { socCode: '2211', title: 'Generalist medical practitioners' },
    { socCode: '2212', title: 'Specialist medical practitioners' },
    { socCode: '2221', title: 'Physiotherapists' },
    { socCode: '2222', title: 'Occupational therapists' },
    { socCode: '2223', title: 'Speech and language therapists' },
    {
      socCode: '2224',
      title: 'Psychotherapists and cognitive behaviour therapists',
    },
    { socCode: '2225', title: 'Clinical psychologists' },
    { socCode: '2226', title: 'Other psychologists' },
    {
      socCode: '2229',
      title: 'Therapy professionals not elsewhere classified',
    },
    { socCode: '2231', title: 'Midwifery nurses' },
    { socCode: '2232', title: 'Registered community nurses' },
    { socCode: '2233', title: 'Registered specialist nurses' },
    { socCode: '2234', title: 'Registered nurse practitioners' },
    { socCode: '2235', title: 'Registered mental health nurses' },
    { socCode: '2236', title: 'Registered children’s nurses' },
    { socCode: '2237', title: 'Other registered nursing professionals' },
    { socCode: '2251', title: 'Pharmacists' },
    { socCode: '2252', title: 'Optometrists' },
    { socCode: '2253', title: 'Dental practitioners' },
    { socCode: '2254', title: 'Medical radiographers' },
    { socCode: '2255', title: 'Paramedics' },
    { socCode: '2256', title: 'Podiatrists' },
    {
      socCode: '2259',
      title: 'Other health professionals not elsewhere classified',
    },
    { socCode: '2312', title: 'Further education teaching professional' },
    { socCode: '2313', title: 'Secondary education teaching professionals' },
    { socCode: '2314', title: 'Primary education teaching professionals' },
    { socCode: '2315', title: 'Nursery education teaching professionals' },
    {
      socCode: '2316',
      title: 'Special and additional needs education teaching professionals',
    },
    { socCode: '2321', title: 'Head teachers and principals' },
    { socCode: '2461', title: 'Social workers' },
  ],
};

// The care worker transitional arrangement (SRC-001 p42) does not define the
// occupation codes (PD-036); these are the care worker codes the Skilled Worker
// rules use (SW 6.1B).
export const careWorkerOccupations: {
  sources: SourceRef[];
  occupations: Occupation[];
} = {
  sources: [
    { srcId: 'SRC-001', locator: 'p42' },
    { srcId: 'SRC-004', locator: 'SW 6.1B' },
  ],
  occupations: [
    { socCode: '6135', title: 'Care workers and home carers' },
    { socCode: '6136', title: 'Senior care workers' },
  ],
};

// "Health and Care ASHE salary job" (SW A1.1): a job in one of these codes
// with one of the employers listed in SW A1.1(a)–(f), which is not modelled.
export const healthAndCareAsheOccupations: {
  sources: SourceRef[];
  occupations: Occupation[];
} = {
  sources: [{ srcId: 'SRC-004', locator: 'SW A1.1' }],
  occupations: [
    {
      socCode: '1171',
      title: 'Health services and public health managers and directors',
    },
    { socCode: '1231', title: 'Health care practice managers' },
    {
      socCode: '1232',
      title: 'Residential, day and domiciliary care managers and proprietors',
    },
    { socCode: '2113', title: 'Biochemists and biomedical scientists' },
    { socCode: '2114', title: 'Physical scientists' },
    { socCode: '3111', title: 'Laboratory technicians' },
    { socCode: '3211', title: 'Dispensing opticians' },
    { socCode: '3212', title: 'Pharmaceutical technicians' },
    { socCode: '6135', title: 'Care workers and home carers' },
    { socCode: '6136', title: 'Senior care workers' },
  ],
};

// Health and education occupations below RQF 6 with going rates on national
// pay scales: Appendix Skilled Occupations Table 3a ("skilled to RQF level
// 3-5"). Table 3 holds the RQF 6+ ones.
export const nationalPayScaleBelowRqf6Occupations: {
  sources: SourceRef[];
  occupations: Occupation[];
} = {
  sources: [{ srcId: 'SRC-017', locator: 'Table 3a' }],
  occupations: [
    { socCode: '3213', title: 'Medical and dental technicians' },
    {
      socCode: '3219',
      title: 'Health associate professionals not elsewhere classified',
    },
    { socCode: '3231', title: 'Higher level teaching assistants' },
    { socCode: '6112', title: 'Teaching assistants' },
    { socCode: '6113', title: 'Educational support assistants' },
    { socCode: '6131', title: 'Nursing auxiliaries and assistants' },
    { socCode: '6132', title: 'Ambulance staff (excluding paramedics)' },
    { socCode: '6133', title: 'Dental nurses' },
  ],
};

// The examples SRC-001 p44 names for the below-RQF 6 health and education
// transitional arrangement ("nursing auxiliaries and teaching assistants"),
// coded by the same titles in Table 3a. The full list is not given (PD-038).
export const healthEducationTransitionalExamples: {
  sources: SourceRef[];
  occupations: Occupation[];
} = {
  sources: [
    { srcId: 'SRC-001', locator: 'p44' },
    { srcId: 'SRC-017', locator: 'Table 3a' },
  ],
  occupations: [
    { socCode: '6131', title: 'Nursing auxiliaries and assistants' },
    { socCode: '6112', title: 'Teaching assistants' },
  ],
};
