import { expect, test } from 'vitest';

import type {
  ImmigrationBreach,
  ImmigrationEpisode,
  PersonTimeline,
} from '@uk-immigration/engine';
import { createDraft, runSimulation } from '../lib/questionnaire';
import { decodeDraft, encodeDraft } from '../lib/share';
import { applyWhatIf, initialWhatIf } from '../lib/whatif';

test('a complete draft round trips through UTF-8 base64url without dropping inputs', () => {
  const draft = createDraft();
  draft.completed = true;
  draft.step = 8;
  draft.simulationDate = '2026-11-04';
  draft.screening = {
    criminality: 'no',
    breach: 'no',
    protection: 'no',
    debt: 'no',
  };
  draft.timeline = {
    ...draft.timeline,
    dateOfBirth: '1991-08-19',
    nationality: 'CHN',
    episodes: [
      {
        route: 'SKILLED_WORKER',
        role: 'MAIN',
        validFrom: '2025-01-01',
        validTo: '2031-01-01',
        salary: 55000,
        socCode: '2134',
      },
    ],
    absences: [{ from: '2025-07-01', to: '2025-07-20' }],
    incomeYears: [
      { taxYear: '2025-26', earnings: 0, partnerEarnings: 12345.67 },
      { taxYear: '2024-25' },
    ],
    benefits: [{ benefitType: '示例 & café 🏠', from: '2025-05-01' }],
    relationships: [{ type: 'PARTNER', otherPartyStatus: 'BRITISH_CITIZEN' }],
    english: { cefrLevel: 'B2' },
    lifeInTheUk: { passed: true },
  };
  const encoded = encodeDraft(draft);
  expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
  expect(decodeDraft(encoded)).toEqual(draft);
  const adjusted = applyWhatIf(draft, {
    ...initialWhatIf(draft),
    simulationDate: '2030-01-15',
    incomeEnabled: true,
    earnings: 125100,
    noAbsences: true,
    noPublicFunds: true,
  });
  expect(decodeDraft(encodeDraft(adjusted))).toEqual(adjusted);
  expect(runSimulation(decodeDraft(encodeDraft(adjusted))!)).toEqual(
    runSimulation(adjusted),
  );
  expect(draft.timeline.absences).toHaveLength(1);
});

test.each([
  '',
  'not%base64',
  'a',
  '////',
  '_w', // Invalid UTF-8.
  btoa('{broken JSON'),
  btoa('null'),
  btoa('[]'),
  btoa('{}'),
  btoa('{"version":1}'),
  btoa('{"version":"1"}'),
  btoa('{"version":2}'),
  btoa(JSON.stringify({ ...createDraft(), step: -1 })),
  btoa(JSON.stringify({ ...createDraft(), screening: {} })),
  btoa(JSON.stringify({ ...createDraft(), timeline: null })),
  btoa(
    JSON.stringify({
      ...createDraft(),
      timeline: { ...createDraft().timeline, absences: [null] },
    }),
  ),
  btoa(
    JSON.stringify({
      ...createDraft(),
      timeline: { ...createDraft().timeline, english: 'B2' },
    }),
  ),
])('bad or unsupported share input is ignored: %s', (encoded) => {
  expect(decodeDraft(encoded)).toBeUndefined();
});

test.each([true, false, undefined])(
  'sharing preserves optional applicant ISL = %s',
  (immigrationSalaryList) => {
    const draft = createDraft();
    draft.timeline.episodes = [
      {
        route: 'SKILLED_WORKER',
        role: 'MAIN',
        validFrom: '2021-04-06',
        validTo: '2027-04-05',
        immigrationSalaryList,
      },
    ];
    const restored = decodeDraft(encodeDraft(draft))!;
    expect(restored.timeline.episodes[0].immigrationSalaryList).toBe(
      immigrationSalaryList,
    );
    expect(runSimulation(restored, 'en')).toEqual(runSimulation(draft, 'en'));
  },
);

test('share input rejects malformed ISL and settlement fields', () => {
  const draft = createDraft();
  const decode = (timeline: unknown) =>
    decodeDraft(btoa(JSON.stringify({ ...draft, timeline })));
  for (const settled of [
    null,
    [],
    true,
    {},
    { date: 2024, route: 'SKILLED_WORKER' },
    { date: '2024-04-06', route: null },
  ])
    expect(decode({ ...draft.timeline, settled })).toBeUndefined();
  for (const immigrationSalaryList of ['yes', 1, null])
    expect(
      decode({ ...draft.timeline, episodes: [{ immigrationSalaryList }] }),
    ).toBeUndefined();
});

test('sharing accepts optional protection fields on both timelines without changing draft version', () => {
  const draft = createDraft();
  const cases: {
    resettlementScheme?: ImmigrationEpisode['resettlementScheme'];
    sustainedActivity?: ImmigrationEpisode['sustainedActivity'];
    asylumSupportRepayment?: PersonTimeline['asylumSupportRepayment'];
    article31?: ImmigrationBreach['article31'];
  }[] = [
    {},
    {
      resettlementScheme: 'UK_RESETTLEMENT_SCHEME',
      sustainedActivity: 'WORK',
      asylumSupportRepayment: 'REPAID',
      article31: true,
    },
    {
      resettlementScheme: 'OTHER_DESIGNATED',
      sustainedActivity: 'EDUCATION',
      asylumSupportRepayment: 'ON_PLAN',
      article31: false,
    },
    { sustainedActivity: 'TRAINING', asylumSupportRepayment: 'OUTSTANDING' },
    { asylumSupportRepayment: 'NOT_REQUIRED' },
  ];
  for (const {
    resettlementScheme,
    sustainedActivity,
    asylumSupportRepayment,
    article31,
  } of cases) {
    draft.timeline.episodes = [
      {
        route: 'SAFE_AND_LEGAL',
        role: 'MAIN',
        validFrom: '2027-06-01',
        validTo: '2028-05-31',
        resettlementScheme,
      },
      {
        route: 'PROTECTION_WORK_AND_STUDY',
        role: 'MAIN',
        validFrom: '2028-06-01',
        validTo: '2038-06-01',
        sustainedActivity,
      },
    ];
    draft.timeline.asylumSupportRepayment = asylumSupportRepayment;
    draft.timeline.immigrationBreaches = [
      { type: 'ILLEGAL_ENTRY', date: '2027-05-01', article31 },
    ];
    draft.principal = structuredClone(draft.timeline);
    expect(decodeDraft(encodeDraft(draft))).toEqual(
      JSON.parse(JSON.stringify(draft)),
    );
  }
  expect(draft.version).toBe(1);
});

test('sharing rejects malformed new protection fields at the input boundary', () => {
  const draft = createDraft();
  for (const patch of [
    { episodes: [{ resettlementScheme: 'UNKNOWN' }] },
    { episodes: [{ sustainedActivity: null }] },
    { immigrationBreaches: [{ article31: 'yes' }] },
    { asylumSupportRepayment: true },
  ]) {
    for (const key of ['timeline', 'principal']) {
      expect(
        decodeDraft(
          btoa(
            JSON.stringify({
              ...draft,
              [key]: { ...draft.timeline, ...patch },
            }),
          ),
        ),
      ).toBeUndefined();
    }
  }
});

test('sharing accepts all optional current law inputs on both timelines', () => {
  const draft = createDraft();
  for (const globalTalentEndorsement of [
    undefined,
    'RESEARCH_BODY',
    'ARTS_COUNCIL_ENGLAND',
    'TECH_NATION',
    'PRIZE',
  ] as const) {
    for (const globalTalentCriteria of [
      undefined,
      'EXCEPTIONAL_TALENT',
      'EXCEPTIONAL_PROMISE',
    ] as const) {
      for (const familyPermission of [
        undefined,
        'PARTNER_FIVE_YEAR',
        'PARTNER_TEN_YEAR',
        'PARENT',
      ] as const) {
        draft.timeline.episodes = [
          {
            route: 'GLOBAL_TALENT',
            role: 'MAIN',
            validFrom: '2023-11-04',
            validTo: '2026-11-04',
            globalTalentEndorsement,
            globalTalentCriteria,
          },
          {
            route: 'FAMILY_PARTNER_OR_PARENT',
            role: 'MAIN',
            validFrom: '2026-11-05',
            validTo: '2036-11-04',
            familyPermission,
          },
        ];
        draft.principal = structuredClone(draft.timeline);
        expect(decodeDraft(encodeDraft(draft))).toEqual(
          JSON.parse(JSON.stringify(draft)),
        );
      }
    }
  }
  expect(draft.version).toBe(1);
});

test('sharing rejects invalid current law values on either timeline', () => {
  const draft = createDraft();
  for (const field of [
    'globalTalentEndorsement',
    'globalTalentCriteria',
    'familyPermission',
    'dependantOf',
  ]) {
    for (const value of [
      '',
      'UNKNOWN',
      'PARENT_OF_CHILD',
      true,
      1,
      null,
      [],
      {},
    ]) {
      for (const key of ['timeline', 'principal']) {
        expect(
          decodeDraft(
            btoa(
              JSON.stringify({
                ...draft,
                [key]: { ...draft.timeline, episodes: [{ [field]: value }] },
              }),
            ),
          ),
        ).toBeUndefined();
      }
    }
  }
});

test.each([undefined, 'PARTNER', 'PARENT', 'RELATIVE'] as const)(
  'sharing preserves dependantOf = %s on both timelines',
  (dependantOf) => {
    const draft = createDraft();
    draft.timeline.episodes = [
      {
        route: 'HONG_KONG_BNO',
        role: 'DEPENDANT',
        validFrom: '2021-11-04',
        validTo: '2035-11-04',
        dependantOf,
      },
    ];
    draft.principal = structuredClone(draft.timeline);
    expect(decodeDraft(encodeDraft(draft))).toEqual(
      JSON.parse(JSON.stringify(draft)),
    );
  },
);

test('sharing preserves all extension two values, including empty criteria and omitted inputs, on both timelines', () => {
  const draft = createDraft();
  const criteria: ImmigrationEpisode['innovatorSettlementCriteria'][] = [
    undefined,
    [],
    ['INVESTMENT'],
    ['CUSTOMERS'],
    ['RESEARCH_AND_IP'],
    ['REVENUE'],
    ['EXPORT_REVENUE'],
    ['JOBS'],
    ['JOBS_WITH_SALARY'],
    ['INVESTMENT', 'JOBS'],
  ];
  for (const innovatorSettlementCriteria of criteria) {
    for (const privateLifeRoute of [
      undefined,
      'CHILD',
      'YOUNG_ADULT',
      'ADULT',
    ] as const) {
      for (const protectionStatusRevoked of [undefined, true, false]) {
        draft.timeline.episodes = [
          {
            route: 'INNOVATOR_FOUNDER',
            role: 'MAIN',
            validFrom: '2023-11-04',
            validTo: '2026-11-04',
            innovatorSettlementCriteria,
          },
          {
            route: 'FAMILY_AND_PRIVATE_LIFE',
            role: 'MAIN',
            validFrom: '2026-11-05',
            validTo: '2036-11-04',
            privateLifeRoute,
          },
        ];
        draft.timeline.protectionStatusRevoked = protectionStatusRevoked;
        draft.principal = structuredClone(draft.timeline);
        const restored = decodeDraft(encodeDraft(draft))!;
        expect(restored).toEqual(JSON.parse(JSON.stringify(draft)));
        expect(
          restored.timeline.episodes[0].innovatorSettlementCriteria,
        ).toEqual(innovatorSettlementCriteria);
      }
    }
  }
});

test('sharing rejects malformed extension two fields on either timeline', () => {
  const draft = createDraft();
  const invalid = ['', 'UNKNOWN', 1, true, null, {}];
  const patches = [
    ...[
      ...invalid,
      ['UNKNOWN'],
      ['INVESTMENT', 'UNKNOWN'],
      [null],
      [[]],
      [1],
    ].map((innovatorSettlementCriteria) => ({
      episodes: [{ innovatorSettlementCriteria }],
    })),
    ...[...invalid, [], ['CHILD']].map((privateLifeRoute) => ({
      episodes: [{ privateLifeRoute }],
    })),
    ...['true', 0, 1, null, [], {}].map((protectionStatusRevoked) => ({
      protectionStatusRevoked,
    })),
  ];
  for (const patch of patches) {
    for (const key of ['timeline', 'principal']) {
      expect(
        decodeDraft(
          btoa(
            JSON.stringify({
              ...draft,
              [key]: { ...draft.timeline, ...patch },
            }),
          ),
        ),
      ).toBeUndefined();
    }
  }
});

test('sharing preserves savings and specified benefit values on both timelines', () => {
  const draft = createDraft();
  for (const cashSavings of [undefined, 0, 25000, 25000.5]) {
    for (const partnerSpecifiedBenefit of [undefined, true, false]) {
      draft.timeline.cashSavings = cashSavings;
      draft.timeline.partnerSpecifiedBenefit = partnerSpecifiedBenefit;
      draft.principal = structuredClone(draft.timeline);
      expect(decodeDraft(encodeDraft(draft))).toEqual(
        JSON.parse(JSON.stringify(draft)),
      );
    }
  }
});

test('sharing rejects invalid savings and specified benefit values on either timeline', () => {
  const draft = createDraft();
  const patches = [
    ...[-1, '25000', '', true, null, [], {}].map((cashSavings) => ({
      cashSavings,
    })),
    ...['true', 0, 1, null, [], {}].map((partnerSpecifiedBenefit) => ({
      partnerSpecifiedBenefit,
    })),
  ];
  for (const key of ['timeline', 'principal']) {
    for (const patch of patches) {
      expect(
        decodeDraft(
          btoa(
            JSON.stringify({
              ...draft,
              [key]: { ...draft.timeline, ...patch },
            }),
          ),
        ),
      ).toBeUndefined();
    }
    const nonFinite = JSON.stringify({
      ...draft,
      [key]: { ...draft.timeline, cashSavings: 'non-finite' },
    }).replace('"non-finite"', '1e400');
    expect(decodeDraft(btoa(nonFinite))).toBeUndefined();
  }
});
