import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test, vi } from 'vitest';
import * as engine from '@uk-immigration/engine';
import { esP31IndividualAPartnerArrivesTogether as together } from '../../../packages/policy-data/fixtures/es-p31-individual-a-partner-arrives-together';
import { esP31IndividualBPartnerJoinsLater as later } from '../../../packages/policy-data/fixtures/es-p31-individual-b-partner-joins-later';
import { PrincipalAssessment } from '../components/result-view';
import {
  activePersonDraft,
  createDraft,
  draftReducer,
  needsPrincipal,
  runPrincipalSimulation,
  runSimulation,
  shortCircuitKeys,
  stepSequence,
  validateStep,
  visibleIncomeYears,
} from '../lib/questionnaire';
import { draftStorage } from '../lib/storage';
import { decodeDraft, encodeDraft } from '../lib/share';
import { applyWhatIf, initialWhatIf } from '../lib/whatif';

function familyDraft(fixture = together) {
  const screening = {
    criminality: 'no',
    breach: 'no',
    protection: 'no',
    debt: 'no',
  } as const;
  return {
    ...createDraft(),
    ...structuredClone(fixture.request),
    screening,
    principalScreening: { ...screening },
    principalCompleted: true,
    completed: true,
  };
}

test('a dependant relationship is required for every dependant period, including historical periods', () => {
  const draft = familyDraft();
  draft.step = 2;
  delete draft.timeline.episodes[0].dependantOf;
  expect(validateStep(draft)).toEqual({
    'episode-0-dependantOf': 'error.required',
  });
  draft.timeline.episodes[0].dependantOf = 'PARENT';
  expect(validateStep(draft)).toEqual({});
  draft.timeline.episodes[0].role = 'MAIN';
  delete draft.timeline.episodes[0].dependantOf;
  expect(validateStep(draft)).toEqual({});
});

test('principal step follows visa history only for the episode active on the simulation date', () => {
  const draft = familyDraft(later);
  expect(stepSequence(draft)).toEqual([0, 1, 2, 9, 3, 4, 5, 6, 7, 8]);
  for (const date of ['2023-04-06', '2027-04-05']) {
    expect(needsPrincipal({ ...draft, simulationDate: date })).toBe(true);
  }
  for (const date of ['2023-04-05', '2027-04-06']) {
    expect(needsPrincipal({ ...draft, simulationDate: date })).toBe(false);
  }
  draft.timeline.episodes.push({
    route: 'SKILLED_WORKER',
    role: 'MAIN',
    validFrom: '2026-01-01',
    validTo: '2029-01-01',
  });
  expect(stepSequence(draft)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
});

test('principal editing and storage restore keep the two timelines and screenings separate', () => {
  const stored = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    setItem: (key: string, value: string) => stored.set(key, value),
    getItem: (key: string) => stored.get(key) ?? null,
  });
  try {
    const applicant = familyDraft();
    let draft = draftReducer(applicant, { type: 'step', step: 9 });
    draft = draftReducer(draft, { type: 'principal-start' });
    expect(stepSequence(draft)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    draft = draftReducer(draft, {
      type: 'timeline',
      patch: { nationality: 'CAN' },
    });
    draft = draftReducer(draft, {
      type: 'screening',
      key: 'debt',
      answer: 'yes',
    });
    draft = draftReducer(draft, { type: 'step', step: 4 });
    expect(activePersonDraft(draft).timeline.nationality).toBe('CAN');
    expect(activePersonDraft(draft).screening.debt).toBe('yes');
    expect(draft.timeline).toEqual(applicant.timeline);
    expect(draft.screening).toEqual(applicant.screening);
    draftStorage(draft);
    const restored = draftReducer(createDraft(), {
      type: 'restore',
      draft: draftStorage().draft!,
    });
    expect(restored).toEqual(draft);
    expect(decodeDraft(encodeDraft(restored))).toEqual(restored);
    draft = draftReducer(restored, { type: 'principal-return' });
    expect(validateStep(draft)).toEqual({ principal: 'principal.required' });
    draft = draftReducer(draft, { type: 'principal-return', completed: true });
    expect(draft.principalStep).toBeUndefined();
    expect(draft.step).toBe(9);
    expect(validateStep(draft)).toEqual({});
    expect(decodeDraft(encodeDraft(createDraft()))?.principal).toBeUndefined();
  } finally {
    vi.unstubAllGlobals();
  }
});

test('runSimulation passes the principal income window and government debt to evaluate', () => {
  const draft = familyDraft();
  const principalScreening = {
    ...draft.principalScreening,
    debt: 'yes' as const,
  };
  const evaluate = vi.spyOn(engine, 'evaluate');
  try {
    runSimulation({ ...draft, principalScreening });
    expect(evaluate).toHaveBeenCalledExactlyOnceWith({
      locale: 'zh-CN',
      ruleSetIds: ['current-law-2026-11', 'earned-settlement-2026-11'],
      simulationDate: draft.simulationDate,
      timeline: {
        ...draft.timeline,
        incomeYears: visibleIncomeYears(draft),
        governmentDebt: { outstanding: false },
      },
      principal: {
        ...draft.principal,
        incomeYears: visibleIncomeYears({
          ...draft,
          timeline: draft.principal!,
        }),
        governmentDebt: { outstanding: true },
      },
    });
  } finally {
    evaluate.mockRestore();
  }
});

test.each(shortCircuitKeys)(
  'principal %s screening short-circuits with the prefix, without inventing events',
  (key) => {
    const draft = familyDraft();
    const screened = {
      ...draft,
      principalScreening: {
        ...draft.principalScreening,
        [key]: 'yes' as const,
      },
    };
    expect(runSimulation(screened).shortCircuit?.message).toMatch(
      /^主申请人：/,
    );
    expect(runSimulation(screened).byRuleSet).toEqual({});
    expect(screened.principal?.criminalRecord).toEqual([]);
    expect(screened.principal?.immigrationBreaches).toEqual([]);
    expect(runPrincipalSimulation(screened)?.shortCircuit).toBeDefined();
    expect(
      runSimulation({
        ...screened,
        screening: { ...draft.screening, criminality: 'yes' },
      }).shortCircuit?.message,
    ).not.toMatch(/^主申请人：/);
    screened.timeline.episodes.forEach((episode) => {
      episode.role = 'MAIN';
    });
    expect(runSimulation(screened).shortCircuit).toBeUndefined();
  },
);

test.each([together, later])(
  'real family result, What-if and share preserve $id',
  (fixture) => {
    const draft = familyDraft(fixture);
    const result = runSimulation(draft);
    for (const id of Object.keys(engine.RULE_SETS) as engine.RuleSetId[]) {
      expect(result.byRuleSet[id]).toMatchObject({
        outcome: fixture.expected.outcome,
        pathwayYears: 5,
        earliestDate: fixture === together ? '2026-04-06' : '2028-04-06',
      });
    }
    const modified = applyWhatIf(draft, {
      ...initialWhatIf(draft),
      noAbsences: true,
    });
    expect(modified.principal).toEqual(draft.principal);
    expect(runSimulation(modified)).toEqual(result);
    expect(runSimulation(decodeDraft(encodeDraft(draft))!)).toEqual(result);
    const dated = draftReducer(draft, { type: 'date', date: '2027-04-06' });
    expect(
      visibleIncomeYears({ ...dated, timeline: dated.principal! })[0],
    ).toEqual({ taxYear: '2026-27' });
    expect(dated.principal?.incomeYears).toContainEqual({
      taxYear: '2025-26',
      earnings: 55000,
    });
  },
);

test('principal assessment is collapsed by default and reuses both columns with unique heading IDs', () => {
  const result = runPrincipalSimulation(familyDraft())!;
  const html = renderToStaticMarkup(<PrincipalAssessment result={result} />);
  expect(html).toContain('<summary>主申请人的评估</summary>');
  expect(html).not.toContain('<details open');
  for (const id of Object.keys(engine.RULE_SETS))
    expect(html).toContain(`id="principal-${id}-heading"`);
  expect(html).toContain('2026-04-06');
});

test('share boundary rejects invalid principal containers and subflow state', () => {
  const draft = familyDraft();
  const encode = (value: unknown) =>
    btoa(JSON.stringify(value))
      .replaceAll('+', '-')
      .replaceAll('/', '_')
      .replace(/=+$/, '');
  expect(decodeDraft(encode({ ...draft, principal: {} }))).toBeUndefined();
  expect(decodeDraft(encode({ ...draft, principalStep: 8 }))).toBeUndefined();
  expect(
    decodeDraft(encode({ ...draft, principalScreening: null })),
  ).toBeUndefined();
});

test.each([true, false, undefined])(
  'principal ISL = %s and settlement survive editing, storage, sharing and request mapping',
  (immigrationSalaryList) => {
    const stored = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      setItem: (key: string, value: string) => stored.set(key, value),
      getItem: (key: string) => stored.get(key) ?? null,
    });
    const evaluate = vi.spyOn(engine, 'evaluate');
    try {
      const original = familyDraft();
      let draft = draftReducer(original, { type: 'principal-start' });
      draft = draftReducer(draft, {
        type: 'timeline',
        patch: {
          settled: { date: '2024-04-06', route: 'SKILLED_WORKER' },
          episodes: draft.principal!.episodes.map((episode) => ({
            ...episode,
            immigrationSalaryList,
          })),
        },
      });
      expect(validateStep(activePersonDraft(draft))).toEqual({});
      expect(draft.timeline).toEqual(original.timeline);
      draft = draftReducer(draft, {
        type: 'principal-return',
        completed: true,
      });
      draftStorage(draft);
      const saved = draftStorage().draft!;
      const shared = decodeDraft(encodeDraft(saved))!;
      expect(saved).toEqual(draft);
      expect(shared).toEqual(saved);
      runSimulation(shared, 'en');
      expect(evaluate).toHaveBeenLastCalledWith(
        expect.objectContaining({
          locale: 'en',
          principal: expect.objectContaining({
            settled: { date: '2024-04-06', route: 'SKILLED_WORKER' },
            episodes: shared.principal!.episodes,
          }),
        }),
      );
      expect(shared.principal!.episodes[0].immigrationSalaryList).toBe(
        immigrationSalaryList,
      );
      runPrincipalSimulation(shared, 'en');
      expect(evaluate).toHaveBeenLastCalledWith(
        expect.objectContaining({
          timeline: expect.objectContaining({
            settled: shared.principal!.settled,
            episodes: shared.principal!.episodes,
          }),
        }),
      );
      const cleared = draftReducer(
        draftReducer(shared, { type: 'principal-start' }),
        {
          type: 'timeline',
          patch: { settled: undefined },
        },
      );
      expect(validateStep(activePersonDraft(cleared))).toEqual({});
      expect(
        decodeDraft(encodeDraft(cleared))!.principal!.settled,
      ).toBeUndefined();
    } finally {
      evaluate.mockRestore();
      vi.unstubAllGlobals();
    }
  },
);

test('settled principal requires a valid grant date in the basic information step', () => {
  let draft = draftReducer(familyDraft(), { type: 'principal-start' });
  for (const date of ['', '2024-02-30']) {
    draft = draftReducer(draft, {
      type: 'timeline',
      patch: { settled: { date, route: 'SKILLED_WORKER' } },
    });
    expect(validateStep(activePersonDraft(draft))).toEqual({
      'principal-settled-date': 'error.date',
    });
  }
});

test('a partner with a settled Skilled Worker principal reaches SW 39.1(b) through the web request', () => {
  const draft = familyDraft();
  draft.principal!.settled = { date: '2024-04-06', route: 'SKILLED_WORKER' };
  const result = runSimulation(decodeDraft(encodeDraft(draft))!, 'en');
  const currentLaw = result.byRuleSet['current-law-2026-11']!;
  expect(currentLaw.outcome).toBe('LIKELY_ELIGIBLE');
  const partner = currentLaw.rules.find(
    (rule) => rule.id === 'CL-SW-PARTNER-5Y',
  )!;
  expect(partner.status).toBe('PASS');
  expect(partner.explanation).toContain('SW 39.1(b)');
});
