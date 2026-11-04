import {
  currentLaw2026_11,
  earnedSettlement2026_11,
} from '@uk-immigration/policy-data';

// Display translations only. The page enumerates the exported metadata and
// uses its titles and summaries directly in Chinese.
const es = earnedSettlement2026_11.values;
const cl = currentLaw2026_11.values;
const gbp = (value: number) => `£${value.toLocaleString('en-GB')}`;

export const englishRuleTitles: Record<string, string> = {
  'ES-CRIMINALITY': 'No criminal record',
  'ES-DEBT': 'No outstanding government debt',
  'ES-ENGLISH-B2': `English at ${es.settlementEnglishLevel.value}`,
  'ES-KOL': 'Pass the Life in the UK test',
  'ES-ROUTE-GROUP': 'Current route counts towards settlement',
  'ES-RESIDENCE': 'Continuous residence counting towards settlement',
  'ES-EARNINGS-3Y': `${es.pathwayYears3.value}-year pathway earnings: ${gbp(es.earningsThreshold3Year.value)} in ${es.bestYears3Year.value.required} of ${es.bestYears3Year.value.window} years`,
  'ES-EARNINGS-5Y': `${es.pathwayYears5.value}-year pathway earnings: ${gbp(es.earningsThreshold5Year.value)} in ${es.bestYears5Year.value.required} of ${es.bestYears5Year.value.window} years`,
  'ES-EARNINGS-10Y': `Minimum earnings: ${gbp(es.earningsThresholdMinimum.value)} in ${es.bestYears10Year.value.required} of ${es.bestYears10Year.value.window} years (or ${gbp(es.householdEarningsThreshold.value)} combined household earnings)`,
  'ES-BRITISH-CONNECTION': `British connection (${es.pathwayYears5.value}-year pathway)`,
  'ES-PUBLIC-FUNDS': `No public funds in the ${es.publicFundsLookbackYears.value} years before applying`,
  'ES-BREACH': 'No qualifying immigration breach in adulthood',
  'ES-TRANSITIONAL-CARE-WORKER': `Care worker transitional arrangements (retain ${es.pathwayYears5.value} years)`,
  'ES-TRANSITIONAL-HEALTH-EDUCATION': `Transitional arrangement for below-RQF 6 national pay scale health / education jobs (retain ${es.pathwayYears5.value} years)`,
  'ES-PUBLIC-SERVICE': `${es.pathwayYears5.value} years in public service occupations (${es.pathwayYears5.value}-year pathway)`,
  'ES-DEPENDANT-PATHWAY': 'Settle with the principal applicant (dependant)',
  'CL-SCOPE': 'Within the scope of the modelled current rules',
  'CL-SW-RESIDENCE-5Y': `${cl.skilledWorkerQualifyingYears.value} continuous years as a Skilled Worker`,
  'CL-SW-SALARY': 'Skilled Worker settlement salary (general salary)',
  'CL-SW-GOING-RATE': 'Skilled Worker settlement salary (going rate)',
  'CL-SW-CHILD':
    'Skilled Worker dependent child settling with the principal applicant',
  'CL-SW-PARTNER-5Y': `${cl.skilledWorkerQualifyingYears.value} continuous years as a Skilled Worker dependent partner, settling with the principal applicant`,
  'CL-ENGLISH': 'Settlement English requirement',
  'CL-KOL': 'Pass the Life in the UK test',
  'CL-LR-RESIDENCE-10Y': `Long Residence: ${cl.longResidenceQualifyingYears.value} years of continuous lawful residence`,
};

// These are translations of policyChangelog entries, not additional entries
// or policy explanations. Dates, ordering and sources come from that export.
export const englishPolicyChanges: Record<
  string,
  { title: string; summary: string }
> = {
  '2025-05-12': {
    title:
      'White Paper CP 1326 “Restoring control over the immigration system”: proposes a 10-year settlement baseline and B2 English; publication becomes the Earned Settlement transitional cut-off',
    summary:
      'Proposes increasing the standard settlement qualifying period to 10 years and settlement English to B2. The relevant transitional arrangements in CP 1707 use the White Paper publication date as their cut-off.',
  },
  '2025-11-20': {
    title:
      'CP 1448 “A Fairer Pathway to Settlement” consultation (until 2026-02-13)',
    summary:
      'Publishes the Earned Settlement consultation CP 1448, running from 2025-11-20 to 2026-02-13.',
  },
  '2026-03-05': {
    title:
      'Statement of Changes HC 1691: settlement English rises to B2 on multiple routes from 2027-03-26',
    summary:
      'HC 1691 is laid before Parliament, requiring CEFR B2 English for settlement applications on multiple routes from 2027-03-26, including Skilled Worker and Long Residence, with the relevant exemptions retained.',
  },
  '2026-10-08': {
    title:
      'Statement of Changes HC 584: current snapshot versions of Appendix Skilled Worker / Long Residence',
    summary:
      'Records the 2026-10-08 snapshots of Appendix Skilled Worker and Appendix Long Residence. Both change histories associate this version with Statement of Changes HC 584.',
  },
  '2026-11-02': {
    title:
      'CP 1707 government response: final Earned Settlement framework (3 / 5 / 10 / 20-year pathways, mandatory requirements and transitional arrangements); statements in both Houses set out the implementation timetable',
    summary:
      'The government response announces the 3 / 5 / 10 / 20-year Earned Settlement pathways, mandatory requirements and transitional arrangements. Questions following statements in both Houses on the same day give the phased implementation timetable.',
  },
};
