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
