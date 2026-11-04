import type { ParameterSet } from '../types';

// Immigration Rules in force (SRC-004 Appendix Skilled Worker, version
// 2026-10-08).
export const currentLaw2026_11 = {
  ruleSetId: 'current-law-2026-11',
  asOf: '2026-11-04',
  values: {
    // Continuous residence: no more than this many days outside the UK in any
    // window of this many months (CR 3.1).
    continuousResidenceMaxAbsenceDays: {
      value: 180,
      sources: [{ srcId: 'SRC-008', locator: 'CR 3.1' }],
    },
    continuousResidenceWindowMonths: {
      value: 12,
      sources: [{ srcId: 'SRC-008', locator: 'CR 3.1' }],
    },

    // Settlement applicants under 18 or aged 65 and over are exempt from the
    // English language and Life in the UK requirements.
    settlementMinorAge: {
      value: 18,
      sources: [
        { srcId: 'SRC-014', locator: 'EL 1.1(b)' },
        { srcId: 'SRC-015', locator: 'KOL 1.1(b)' },
      ],
    },
    settlementExemptionAge: {
      value: 65,
      sources: [
        { srcId: 'SRC-014', locator: 'EL 1.1(a)' },
        { srcId: 'SRC-015', locator: 'KOL 1.1(a)' },
      ],
    },
    // B1 before 2027-03-26, B2 from then.
    longResidenceSettlementEnglishBefore: {
      value: 'B1',
      sources: [{ srcId: 'SRC-005', locator: 'LR 13.1(a)' }],
    },
    longResidenceSettlementEnglish: {
      value: { cefrLevel: 'B2', applicationsFrom: '2027-03-26' },
      sources: [{ srcId: 'SRC-005', locator: 'LR 13.1(b)' }],
    },

    // Long Residence absences that started before this date: no more than 548
    // days in all and 184 days at a time instead of CR 3.1 (CR 3.3).
    longResidenceLegacyAbsenceBefore: {
      value: '2024-04-11',
      sources: [{ srcId: 'SRC-008', locator: 'CR 3.3' }],
    },
    longResidenceLegacyMaxTotalAbsenceDays: {
      value: 548,
      sources: [{ srcId: 'SRC-008', locator: 'CR 3.3(a)' }],
    },
    longResidenceLegacyMaxSingleAbsenceDays: {
      value: 184,
      sources: [{ srcId: 'SRC-008', locator: 'CR 3.3(b)' }],
    },
    longResidenceQualifyingYears: {
      value: 10,
      sources: [{ srcId: 'SRC-005', locator: 'LR 11.1' }],
    },

    skilledWorkerQualifyingYears: {
      value: 5,
      sources: [{ srcId: 'SRC-004', locator: 'SW 21.1' }],
    },

    // GBP per year, general salary threshold for permission (SW 4.2 Option A)
    // and for settlement (SW 24.3 row A).
    skilledWorkerGeneralSalaryThreshold: {
      value: 41700,
      sources: [
        { srcId: 'SRC-004', locator: 'SW 4.2' },
        { srcId: 'SRC-004', locator: 'SW 24.3 row A' },
      ],
    },
    // GBP per year, settlement general salary for the other SW 24.3 rows:
    // B (Immigration Salary List), C (meets SW 4.2(b)), D (Immigration Salary
    // List and SW 4.2(b), or a Table 3 health or education occupation). Row E
    // (Tier 2 (General) STEM codes) is not modelled.
    skilledWorkerSettlementSalaryRowB: {
      value: 33400,
      sources: [{ srcId: 'SRC-004', locator: 'SW 24.3 row B' }],
    },
    skilledWorkerSettlementSalaryRowC: {
      value: 31300,
      sources: [{ srcId: 'SRC-004', locator: 'SW 24.3 row C' }],
    },
    skilledWorkerSettlementSalaryRowD: {
      value: 25000,
      sources: [{ srcId: 'SRC-004', locator: 'SW 24.3 row D' }],
    },
    // SW 4.2(b)(ii): granted Skilled Worker permission under the rules before
    // this date, continuous Skilled Worker permission since, and applying
    // before the next date. Also the cut-off of Appendix Skilled Occupations
    // Table 2a.
    skilledWorkerPre2024RulesBefore: {
      value: '2024-04-04',
      sources: [
        { srcId: 'SRC-004', locator: 'SW 4.2(b)(ii)' },
        { srcId: 'SRC-017', locator: 'Table 2a' },
      ],
    },
    skilledWorkerPre2024ApplicationsBefore: {
      value: '2030-04-04',
      sources: [{ srcId: 'SRC-004', locator: 'SW 4.2(b)(ii)' }],
    },
    // Tables 1a, 2aa and 3a of Appendix Skilled Occupations only apply to
    // those granted Skilled Worker permission under the rules before this
    // date with continuous Skilled Worker permission since (SW 6.1(d)).
    skilledWorkerPre2025RulesBefore: {
      value: '2025-07-22',
      sources: [
        { srcId: 'SRC-004', locator: 'SW 6.1(d)' },
        { srcId: 'SRC-017', locator: 'Table 1a' },
        { srcId: 'SRC-017', locator: 'Table 2aa' },
      ],
    },
    // Settlement applications made on or after this date need B2 English
    // unless exempt (inserted by HC 1691).
    // Also for a Skilled Worker's dependent partner or child (SW 44.1(b)).
    skilledWorkerSettlementEnglish: {
      value: { cefrLevel: 'B2', applicationsFrom: '2027-03-26' },
      sources: [
        { srcId: 'SRC-004', locator: 'SW 22A.1' },
        { srcId: 'SRC-004', locator: 'SW 44.1(b)' },
        { srcId: 'SRC-007', locator: 'p24' },
      ],
    },
    // A Skilled Worker's dependent partner or child applying before that date.
    skilledWorkerDependantSettlementEnglishBefore: {
      value: 'B1',
      sources: [{ srcId: 'SRC-004', locator: 'SW 44.1(a)' }],
    },

    // Appendix Hong Kong British National (Overseas), version 2026-10-08.
    hongKongBnoQualifyingYears: {
      value: 5,
      sources: [{ srcId: 'SRC-020', locator: 'HK 62.1(b)' }],
    },
    // B1 whatever the application date: HC 1691 did not add B2 to this
    // Appendix (it is not among those listed in EM 5.60).
    hongKongBnoSettlementEnglish: {
      value: 'B1',
      sources: [
        { srcId: 'SRC-020', locator: 'HK 60.1' },
        { srcId: 'SRC-007', locator: 'EM 5.60' },
      ],
    },

    // Appendix Global Talent, version 2026-08-03. 3 years if endorsed by a
    // research body, under the exceptional talent criteria by Arts Council
    // England or Tech Nation, or granted on a prize; 5 years if endorsed under
    // the exceptional promise criteria by Arts Council England or Tech Nation.
    globalTalentQualifyingYearsShort: {
      value: 3,
      sources: [{ srcId: 'SRC-021', locator: 'GT 11.1' }],
    },
    globalTalentQualifyingYearsLong: {
      value: 5,
      sources: [{ srcId: 'SRC-021', locator: 'GT 11.2' }],
    },
    // B1 before 2027-03-26, B2 from then.
    globalTalentSettlementEnglishBefore: {
      value: 'B1',
      sources: [{ srcId: 'SRC-021', locator: 'GT 13.1(a)' }],
    },
    globalTalentSettlementEnglish: {
      value: { cefrLevel: 'B2', applicationsFrom: '2027-03-26' },
      sources: [
        { srcId: 'SRC-021', locator: 'GT 13.1(b)' },
        { srcId: 'SRC-007', locator: 'EM 5.60' },
      ],
    },

    // Appendix Settlement Family Life (10-year partner route), version
    // 2026-08-03.
    familyPartnerQualifyingYearsTen: {
      value: 10,
      sources: [{ srcId: 'SRC-022', locator: 'SETF 3.1' }],
    },
    // B1 before 2027-03-26, B2 from then: SETF 5.1 for the 10-year route,
    // Appendix KoLL (via E-ILRP.1.6) for the 5-year route.
    familyPartnerSettlementEnglishBefore: {
      value: 'B1',
      sources: [
        { srcId: 'SRC-022', locator: 'SETF 5.1(a)' },
        { srcId: 'SRC-025', locator: 'KoLL 2.2(b)' },
        { srcId: 'SRC-025', locator: 'KoLL 2.2(c)(i)' },
      ],
    },
    familyPartnerSettlementEnglish: {
      value: { cefrLevel: 'B2', applicationsFrom: '2027-03-26' },
      sources: [
        { srcId: 'SRC-022', locator: 'SETF 5.1(b)' },
        { srcId: 'SRC-025', locator: 'KoLL 2.2(ba)' },
        { srcId: 'SRC-025', locator: 'KoLL 2.2(c)(ii)' },
        { srcId: 'SRC-007', locator: 'EM 5.60' },
      ],
    },

    // Appendix FM (5-year partner route), version 2026-10-08.
    familyPartnerQualifyingYearsFive: {
      value: 5,
      sources: [{ srcId: 'SRC-024', locator: 'E-ILRP.1.3(1)' }],
    },
    // GBP per year, gross income of the applicant and partner (E-LTRP.3.2),
    // applied at settlement through E-ILRP.1.3(1A). Also the cap on the
    // transitional requirement (E-LTRP.3.8).
    familyPartnerMinimumIncome: {
      value: 29000,
      sources: [
        { srcId: 'SRC-024', locator: 'E-LTRP.3.1(a)' },
        { srcId: 'SRC-024', locator: 'E-LTRP.3.8' },
      ],
    },
    // A successful first partner (or fiancé(e)) application before this date,
    // with the same partner since: the transitional requirement applies.
    familyPartnerTransitionalBefore: {
      value: '2024-04-11',
      sources: [
        { srcId: 'SRC-024', locator: 'E-LTRP.3.5' },
        { srcId: 'SRC-024', locator: 'E-LTRP.3.6' },
      ],
    },
    familyPartnerTransitionalIncome: {
      value: 18600,
      sources: [{ srcId: 'SRC-024', locator: 'E-LTRP.3.7(a)(i)' }],
    },
    familyPartnerTransitionalFirstChild: {
      value: 3800,
      sources: [{ srcId: 'SRC-024', locator: 'E-LTRP.3.7(a)(ii)' }],
    },
    familyPartnerTransitionalAdditionalChild: {
      value: 2400,
      sources: [{ srcId: 'SRC-024', locator: 'E-LTRP.3.7(a)(iii)' }],
    },
    // Continuous years in the UK with refugee status or humanitarian
    // protection. Appendix Settlement Protection sets no English or Life in
    // the UK requirement (PD-072).
    protectionQualifyingYears: {
      value: 5,
      sources: [{ srcId: 'SRC-023', locator: 'STP 3.1' }],
    },

    // Appendix UK Ancestry, version 2026-08-03.
    ukAncestryQualifyingYears: {
      value: 5,
      sources: [{ srcId: 'SRC-026', locator: 'UKA 13.1' }],
    },
    ukAncestrySettlementEnglishBefore: {
      value: 'B1',
      sources: [{ srcId: 'SRC-026', locator: 'UKA 15.1(a)' }],
    },
    ukAncestrySettlementEnglish: {
      value: { cefrLevel: 'B2', applicationsFrom: '2027-03-26' },
      sources: [
        { srcId: 'SRC-026', locator: 'UKA 15.1(b)' },
        { srcId: 'SRC-007', locator: 'EM 5.60' },
      ],
    },
  },
} satisfies ParameterSet;
