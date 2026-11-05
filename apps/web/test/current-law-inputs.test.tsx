import { renderToStaticMarkup } from 'react-dom/server';
import * as React from 'react';
import { expect, test, vi } from 'vitest';
import * as engine from '@uk-immigration/engine';
import SimulatePage from '../app/simulate/page';
import { ResultView } from '../components/result-view';
import { en } from '../i18n/en';
import { t } from '../i18n';
import { LocaleContext } from '../i18n/locale';
import {
  activePersonDraft,
  createDraft,
  draftReducer,
  needsPrincipal,
  runPrincipalSimulation,
  runSimulation,
  validateStep,
} from '../lib/questionnaire';
import * as questionnaire from '../lib/questionnaire';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock('react', { spy: true });

const episodes: engine.ImmigrationEpisode[] = [
  {
    route: 'GLOBAL_TALENT',
    role: 'MAIN',
    validFrom: '2023-11-04',
    validTo: '2035-11-04',
    globalTalentEndorsement: 'ARTS_COUNCIL_ENGLAND',
    globalTalentCriteria: 'EXCEPTIONAL_TALENT',
  },
  {
    route: 'FAMILY_PARTNER_OR_PARENT',
    role: 'MAIN',
    validFrom: '2024-11-04',
    validTo: '2035-11-04',
    familyPermission: 'PARTNER_FIVE_YEAR',
  },
  {
    route: 'HONG_KONG_BNO',
    role: 'MAIN',
    validFrom: '2021-11-04',
    validTo: '2035-11-04',
  },
  {
    route: 'INNOVATOR_FOUNDER',
    role: 'MAIN',
    validFrom: '2023-11-04',
    validTo: '2035-11-04',
    innovatorSettlementCriteria: ['INVESTMENT', 'JOBS'],
  },
  {
    route: 'FAMILY_AND_PRIVATE_LIFE',
    role: 'MAIN',
    validFrom: '2021-11-04',
    validTo: '2035-11-04',
    privateLifeRoute: 'YOUNG_ADULT',
  },
  {
    route: 'CORE_PROTECTION',
    role: 'MAIN',
    validFrom: '2021-11-04',
    validTo: '2035-11-04',
  },
];

function currentLawDraft(episode: engine.ImmigrationEpisode) {
  const draft = createDraft();
  draft.simulationDate = '2026-11-04';
  draft.screening = { criminality: 'no', breach: 'no', debt: 'no' };
  draft.timeline = {
    ...draft.timeline,
    dateOfBirth: '1990-01-01',
    nationality: 'CHN',
    episodes: [{ ...episode }],
    // SRC-024 E-LTRP.3.1(a): combined income meets the non-transitional threshold.
    incomeYears: [
      { taxYear: '2025-26', earnings: 20000, partnerEarnings: 9000 },
    ],
    relationships: [{ type: 'PARTNER', otherPartyStatus: 'BRITISH_CITIZEN' }],
    english: { cefrLevel: 'B2' },
    lifeInTheUk: { passed: true },
  };
  return draft;
}

test.each([false, true])(
  'current law episode inputs reach evaluate when editing principal = %s',
  (principal) => {
    for (const episode of episodes) {
      let draft = currentLawDraft(episode);
      if (principal) {
        draft.timeline.episodes = [
          { ...episode, role: 'DEPENDANT', dependantOf: 'PARTNER' },
        ];
        draft = draftReducer(draft, { type: 'principal-start' });
      }
      draft = draftReducer(draft, {
        type: 'timeline',
        patch: currentLawDraft(episode).timeline,
      });
      const timeline = activePersonDraft(draft).timeline;
      const evaluate = vi.spyOn(engine, 'evaluate');
      try {
        runSimulation(draft, 'en');
        expect(evaluate).toHaveBeenCalledExactlyOnceWith(
          expect.objectContaining({
            locale: 'en',
            [principal ? 'principal' : 'timeline']: expect.objectContaining({
              episodes: timeline.episodes,
              relationships: timeline.relationships,
              incomeYears: expect.arrayContaining(timeline.incomeYears),
            }),
          }),
        );
        if (principal) {
          runPrincipalSimulation(draft, 'en');
          expect(evaluate).toHaveBeenLastCalledWith(
            expect.objectContaining({
              locale: 'en',
              timeline: expect.objectContaining({
                episodes: timeline.episodes,
              }),
            }),
          );
        }
      } finally {
        evaluate.mockRestore();
      }
    }
  },
);

test('new route inputs produce the contracted current law years and English results', () => {
  // SRC-021 GT 11.1; SRC-024 E-ILRP.1.3; SRC-020 HK 62.1(b);
  // SRC-027 INNF 18.1; SRC-028 PL 14.1; SRC-023 STP 3.1.
  for (const [index, years] of [3, 5, 5, 3, 5, 5].entries()) {
    const draft = currentLawDraft(episodes[index]);
    const result = runSimulation(draft, 'en');
    expect(result.byRuleSet['current-law-2026-11']?.pathwayYears).toBe(years);
    const html = renderToStaticMarkup(
      <LocaleContext value={{ locale: 'en', setLocale: () => {} }}>
        <ResultView result={result} draft={draft} />
      </LocaleContext>,
    );
    expect(html).toContain('id="current-law-2026-11-heading"');
    expect(html).not.toMatch(/[\u3400-\u9fff]/);
  }
  for (const [key, label] of Object.entries(en)) {
    if (
      key.startsWith('episodes.') ||
      key === 'home.scope' ||
      key === 'about.currentLawScope'
    )
      expect(label).not.toMatch(/[\u3400-\u9fff]/);
  }
});

test.each([false, true])(
  'family financial inputs reach the engine and change the result, principal = %s',
  (principal) => {
    let draft = currentLawDraft({ ...episodes[1], validFrom: '2024-06-01' });
    draft = draftReducer(draft, { type: 'date', date: '2029-06-01' });
    draft.timeline.incomeYears = [{ taxYear: '2028-29', earnings: 20000 }];
    if (principal) {
      const timeline = draft.timeline;
      draft = draftReducer(draft, { type: 'principal-start' });
      draft = draftReducer(draft, { type: 'timeline', patch: timeline });
    }
    const evaluate = vi.spyOn(engine, 'evaluate');
    try {
      // SRC-024 E-LTRP.3.1(b), E-ILRP.1.3(1A): £16,000 + £9,000 shortfall.
      for (const cashSavings of [undefined, 0, 25000]) {
        for (const partnerSpecifiedBenefit of [undefined, true, undefined]) {
          draft = draftReducer(draft, {
            type: 'timeline',
            patch: { cashSavings, partnerSpecifiedBenefit },
          });
          runSimulation(draft, 'en');
          const sent =
            evaluate.mock.lastCall![0][principal ? 'principal' : 'timeline']!;
          expect(sent.cashSavings).toBe(cashSavings);
          expect(sent.partnerSpecifiedBenefit).toBe(partnerSpecifiedBenefit);
          const result = principal
            ? runPrincipalSimulation(draft, 'en')!
            : runSimulation(draft, 'en');
          const current = result.byRuleSet['current-law-2026-11']!;
          const financial = current.rules.find(
            (rule) => rule.id === 'CL-FAMILY-FINANCIAL',
          )!;
          expect(financial.status).toBe(
            cashSavings === 25000
              ? 'PASS'
              : partnerSpecifiedBenefit || cashSavings === undefined
                ? 'UNKNOWN'
                : 'FAIL',
          );
          expect(current.outcome).toBe(
            cashSavings === 25000
              ? 'LIKELY_ELIGIBLE'
              : partnerSpecifiedBenefit
                ? 'POTENTIALLY_ELIGIBLE'
                : cashSavings === undefined
                  ? 'INSUFFICIENT_INFORMATION'
                  : 'LIKELY_NOT_ELIGIBLE',
          );
          expect(financial.pendingDetails ?? []).toEqual(
            partnerSpecifiedBenefit && cashSavings !== 25000 ? ['PD-075'] : [],
          );
        }
      }
    } finally {
      evaluate.mockRestore();
    }
  },
);

test.each([false, true])(
  'family financial inputs clear when the last eligible episode is changed or removed, principal = %s',
  (principal) => {
    let draft = currentLawDraft(episodes[1]);
    if (principal) {
      draft = draftReducer(draft, { type: 'principal-start' });
      draft = draftReducer(draft, {
        type: 'timeline',
        patch: currentLawDraft(episodes[1]).timeline,
      });
    }
    draft = draftReducer(draft, {
      type: 'timeline',
      patch: { cashSavings: 25000, partnerSpecifiedBenefit: true },
    });
    const actions = [
      { type: 'episode', index: 0, patch: { route: 'SKILLED_WORKER' } },
      { type: 'episode', index: 0, patch: { role: 'DEPENDANT' } },
      ...(['PARTNER_TEN_YEAR', 'PARENT', undefined] as const).map(
        (familyPermission) => ({
          type: 'episode' as const,
          index: 0,
          patch: { familyPermission },
        }),
      ),
      { type: 'timeline', patch: { episodes: [] } },
    ] satisfies Parameters<typeof draftReducer>[1][];
    for (const action of actions) {
      const changed = draftReducer(draft, action);
      const timeline = activePersonDraft(changed).timeline;
      expect(timeline.cashSavings).toBeUndefined();
      expect(timeline.partnerSpecifiedBenefit).toBeUndefined();
      expect(principal ? changed.timeline : changed.principal).toEqual(
        principal ? draft.timeline : draft.principal,
      );
      const restored = draftReducer(changed, {
        type: 'timeline',
        patch: { episodes: [episodes[1]] },
      });
      expect(activePersonDraft(restored).timeline.cashSavings).toBeUndefined();
      expect(
        activePersonDraft(restored).timeline.partnerSpecifiedBenefit,
      ).toBeUndefined();
    }
    const multiple = draftReducer(draft, {
      type: 'timeline',
      patch: { episodes: [episodes[1], episodes[1]] },
    });
    const oneRemaining = draftReducer(multiple, {
      type: 'episode',
      index: 0,
      patch: { route: 'SKILLED_WORKER' },
    });
    expect(activePersonDraft(oneRemaining).timeline).toMatchObject({
      cashSavings: 25000,
      partnerSpecifiedBenefit: true,
    });
    expect(activePersonDraft(draft).timeline).toMatchObject({
      cashSavings: 25000,
      partnerSpecifiedBenefit: true,
    });
  },
);

test.each(['zh-CN', 'en'] as const)(
  'family financial controls follow eligible episodes on either timeline in %s',
  (locale) => {
    const cases = [
      episodes[1],
      { ...episodes[1], validTo: '2025-01-01' },
      { ...episodes[1], route: 'SKILLED_WORKER' as const },
      { ...episodes[1], role: 'DEPENDANT' as const },
      ...(['PARTNER_TEN_YEAR', 'PARENT', undefined] as const).map(
        (familyPermission) => ({ ...episodes[1], familyPermission }),
      ),
    ];
    for (const principal of [false, true]) {
      for (const [index, episode] of cases.entries()) {
        for (const step of [4, 5]) {
          let draft = currentLawDraft(episode);
          if (principal) {
            draft = draftReducer(draft, { type: 'principal-start' });
            draft = draftReducer(draft, {
              type: 'timeline',
              patch: currentLawDraft(episode).timeline,
            });
          }
          draft = draftReducer(draft, {
            type: 'timeline',
            patch: { cashSavings: 0, partnerSpecifiedBenefit: true },
          });
          draft = draftReducer(draft, { type: 'step', step });
          const applicable = index < 2;
          const evaluate = vi.spyOn(engine, 'evaluate');
          const create = vi
            .spyOn(questionnaire, 'createDraft')
            .mockReturnValue(draft);
          const state = vi
            .spyOn(React, 'useState')
            .mockReturnValueOnce([true, vi.fn()]);
          try {
            const html = renderToStaticMarkup(
              <LocaleContext value={{ locale, setLocale: () => {} }}>
                <SimulatePage />
              </LocaleContext>,
            );
            expect(html.includes('id="cash-savings"')).toBe(
              applicable && step === 4,
            );
            expect(html.includes('id="partner-specified-benefit"')).toBe(
              applicable && step === 5,
            );
            if (applicable && step === 4) {
              expect(html).toContain('£16,000');
              expect(html).toContain('E-ILRP.1.3(1A)');
            }
            if (locale === 'en') expect(html).not.toMatch(/[\u3400-\u9fff]/);
            runSimulation(draft);
            const sent =
              evaluate.mock.lastCall![0][principal ? 'principal' : 'timeline']!;
            expect(sent.cashSavings).toBe(applicable ? 0 : undefined);
            expect(sent.partnerSpecifiedBenefit).toBe(
              applicable ? true : undefined,
            );
          } finally {
            create.mockRestore();
            state.mockRestore();
            evaluate.mockRestore();
          }
        }
      }
    }
  },
);

test('savings questionnaire validation accepts omitted or non-negative integers', () => {
  const draft = { ...currentLawDraft(episodes[1]), step: 4 };
  for (const cashSavings of [undefined, 0, 25000]) {
    draft.timeline.cashSavings = cashSavings;
    expect(validateStep(draft)).toEqual({});
  }
  for (const cashSavings of [-1, 0.5, NaN, Infinity]) {
    draft.timeline.cashSavings = cashSavings;
    expect(validateStep(draft)).toEqual({ 'cash-savings': 'error.savings' });
  }
});

test.each([false, true])(
  'financial control changes omit invalid savings and unchecked benefits, principal = %s',
  (principal) => {
    let draft = currentLawDraft(episodes[1]);
    if (principal) {
      draft = draftReducer(draft, { type: 'principal-start' });
      draft = draftReducer(draft, {
        type: 'timeline',
        patch: currentLawDraft(episodes[1]).timeline,
      });
    }
    const dispatch = (action: Parameters<typeof draftReducer>[1]) => {
      draft = draftReducer(draft, action);
    };
    let errors: questionnaire.Errors = {};
    const reducer = vi
      .spyOn(React, 'useReducer')
      .mockImplementation(() => [
        draft,
        (action?: unknown) =>
          dispatch(action as Parameters<typeof draftReducer>[1]),
      ]);
    const state = vi.spyOn(React, 'useState');
    let input: React.InputHTMLAttributes<HTMLInputElement>;
    const capture = (node: React.ReactNode) => {
      React.Children.forEach(node, (child) => {
        if (
          !React.isValidElement<{ children?: React.ReactNode; id?: string }>(
            child,
          )
        )
          return;
        if (
          child.type === 'input' &&
          ['cash-savings', 'partner-specified-benefit'].includes(
            child.props.id ?? '',
          )
        )
          input = child.props;
        capture(child.props.children);
      });
    };
    const render = () => {
      state
        .mockReturnValueOnce([true, vi.fn()])
        .mockReturnValueOnce([true, vi.fn()])
        .mockReturnValueOnce([
          errors,
          (update: unknown) => {
            const next = update as React.SetStateAction<questionnaire.Errors>;
            errors = typeof next === 'function' ? next(errors) : next;
          },
        ]);
      function Probe() {
        const page = SimulatePage();
        capture(page);
        return page;
      }
      return renderToStaticMarkup(
        <LocaleContext value={{ locale: 'en', setLocale: () => {} }}>
          <Probe />
        </LocaleContext>,
      );
    };
    try {
      dispatch({ type: 'step', step: 4 });
      for (const [value, badInput, expected] of [
        ['25000', false, 25000],
        ['-1', false, undefined],
        ['0.5', false, undefined],
        ['', true, undefined],
        ['', false, undefined],
        ['0', false, 0],
      ] as const) {
        render();
        input!.onChange!({
          target: { value, validity: { badInput } },
        } as React.ChangeEvent<HTMLInputElement>);
        expect(activePersonDraft(draft).timeline.cashSavings).toBe(expected);
        const invalid = badInput || (value !== '' && expected === undefined);
        expect(errors['cash-savings']).toBe(
          invalid ? 'error.savings' : undefined,
        );
        const html = render();
        expect(html.includes('id="cash-savings-error"')).toBe(invalid);
        expect(html).not.toMatch(/[\u3400-\u9fff]/);
      }
      dispatch({ type: 'step', step: 5 });
      for (const checked of [true, false]) {
        render();
        input!.onChange!({
          target: { checked },
        } as React.ChangeEvent<HTMLInputElement>);
        expect(activePersonDraft(draft).timeline.partnerSpecifiedBenefit).toBe(
          checked ? true : undefined,
        );
      }
    } finally {
      reducer.mockRestore();
      state.mockRestore();
    }
  },
);

test('unspecified Global Talent and family permission inputs remain insufficient information', () => {
  for (const episode of episodes.slice(0, 2)) {
    const draft = currentLawDraft({
      ...episode,
      globalTalentEndorsement: undefined,
      globalTalentCriteria: undefined,
      familyPermission: undefined,
    });
    expect(runSimulation(draft).byRuleSet['current-law-2026-11']?.outcome).toBe(
      'INSUFFICIENT_INFORMATION',
    );
  }
});

test('HK adult dependant relative reaches the engine with the principal and renders English rules', () => {
  let draft = currentLawDraft({ ...episodes[2], role: 'DEPENDANT' });
  draft = draftReducer(draft, {
    type: 'episode',
    index: 0,
    patch: { dependantOf: 'RELATIVE' },
  });
  expect(needsPrincipal(draft)).toBe(true);
  draft = draftReducer(draft, { type: 'principal-start' });
  draft = draftReducer(draft, {
    type: 'timeline',
    patch: currentLawDraft(episodes[2]).timeline,
  });
  draft = draftReducer(draft, { type: 'principal-return', completed: true });
  const evaluate = vi.spyOn(engine, 'evaluate');
  try {
    const result = runSimulation(draft, 'en');
    expect(evaluate).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        timeline: expect.objectContaining({
          episodes: [expect.objectContaining({ dependantOf: 'RELATIVE' })],
        }),
        principal: expect.objectContaining({ episodes: [episodes[2]] }),
      }),
    );
    const current = result.byRuleSet['current-law-2026-11']!;
    // SRC-020 HK 59.1(a), HK 62.1(b): both applicants have completed the qualifying period.
    expect(current.outcome).toBe('LIKELY_ELIGIBLE');
    expect(
      current.rules.find((rule) => rule.id === 'CL-HKBNO-DEPENDANT'),
    ).toMatchObject({
      status: 'PASS',
      explanation: expect.stringContaining('HK 59.1(a)'),
    });
    const html = renderToStaticMarkup(
      <LocaleContext value={{ locale: 'en', setLocale: () => {} }}>
        <ResultView result={result} draft={draft} />
      </LocaleContext>,
    );
    expect(html).toContain('adult dependant relative');
    expect(html).not.toMatch(/[\u3400-\u9fff]/);
  } finally {
    evaluate.mockRestore();
  }
});

test.each([false, true])(
  'leaving HK clears only RELATIVE on the edited episode, principal = %s',
  (principal) => {
    for (const dependantOf of ['RELATIVE', 'PARTNER', 'PARENT'] as const) {
      const episode = {
        ...episodes[2],
        role: 'DEPENDANT' as const,
        dependantOf,
      };
      let draft = currentLawDraft(episode);
      if (principal) {
        draft = draftReducer(draft, { type: 'principal-start' });
        draft = draftReducer(draft, {
          type: 'timeline',
          patch: currentLawDraft(episode).timeline,
        });
      }
      activePersonDraft(draft).timeline.episodes.push({ ...episode });
      const unchanged = draftReducer(draft, {
        type: 'episode',
        index: 0,
        patch: { validTo: '2036-11-04' },
      });
      expect(
        activePersonDraft(unchanged).timeline.episodes[0].dependantOf,
      ).toBe(dependantOf);
      const changed = draftReducer(draft, {
        type: 'episode',
        index: 0,
        patch: { route: 'GLOBAL_TALENT' },
      });
      const expected = dependantOf === 'RELATIVE' ? undefined : dependantOf;
      expect(activePersonDraft(changed).timeline.episodes[0].dependantOf).toBe(
        expected,
      );
      expect(activePersonDraft(changed).timeline.episodes[1]).toEqual(episode);
      expect(principal ? changed.timeline : changed.principal).toEqual(
        principal ? draft.timeline : draft.principal,
      );
      const returned = draftReducer(changed, {
        type: 'episode',
        index: 0,
        patch: { route: 'HONG_KONG_BNO' },
      });
      expect(activePersonDraft(returned).timeline.episodes[0].dependantOf).toBe(
        expected,
      );
      const main = draftReducer(draft, {
        type: 'episode',
        index: 0,
        patch: { role: 'MAIN' },
      });
      expect(
        activePersonDraft(main).timeline.episodes[0].dependantOf,
      ).toBeUndefined();
      expect(activePersonDraft(draft).timeline.episodes[0]).toEqual(episode);
    }
  },
);

test.each([false, true])(
  'changing route or role clears route inputs only on the edited episode, principal = %s',
  (principal) => {
    for (const episode of [
      episodes[0],
      episodes[1],
      episodes[3],
      episodes[4],
    ]) {
      let draft = currentLawDraft(episode);
      draft.timeline.episodes.push({ ...episode });
      if (principal) {
        draft = draftReducer(draft, { type: 'principal-start' });
        draft = draftReducer(draft, {
          type: 'timeline',
          patch: currentLawDraft(episode).timeline,
        });
        draft.principal!.episodes.push({ ...episode });
      }
      const before = activePersonDraft(draft).timeline.episodes;
      const updated = draftReducer(draft, {
        type: 'episode',
        index: 0,
        patch: { validTo: '2036-11-04' },
      });
      expect(activePersonDraft(updated).timeline.episodes[0]).toEqual({
        ...episode,
        validTo: '2036-11-04',
      });
      for (const patch of [
        { route: 'HONG_KONG_BNO' },
        { role: 'DEPENDANT' },
      ] as const) {
        const changed = draftReducer(draft, {
          type: 'episode',
          index: 0,
          patch,
        });
        const after = activePersonDraft(changed).timeline.episodes;
        expect(after[0]).toMatchObject(patch);
        expect(after[0].globalTalentEndorsement).toBeUndefined();
        expect(after[0].globalTalentCriteria).toBeUndefined();
        expect(after[0].familyPermission).toBeUndefined();
        expect(after[0].innovatorSettlementCriteria).toBeUndefined();
        expect(after[0].privateLifeRoute).toBeUndefined();
        expect(after[1]).toEqual(before[1]);
        expect(principal ? changed.timeline : changed.principal).toEqual(
          principal ? draft.timeline : draft.principal,
        );
        expect(activePersonDraft(draft).timeline.episodes).toEqual(before);
        const returned = draftReducer(changed, {
          type: 'episode',
          index: 0,
          patch: { route: episode.route, role: episode.role },
        });
        const evaluate = vi.spyOn(engine, 'evaluate');
        try {
          runSimulation(returned);
          const sent =
            evaluate.mock.lastCall![0][principal ? 'principal' : 'timeline']!
              .episodes[0];
          expect(sent.globalTalentEndorsement).toBeUndefined();
          expect(sent.globalTalentCriteria).toBeUndefined();
          expect(sent.familyPermission).toBeUndefined();
          expect(sent.innovatorSettlementCriteria).toBeUndefined();
          expect(sent.privateLifeRoute).toBeUndefined();
        } finally {
          evaluate.mockRestore();
        }
      }
    }
  },
);

test.each(['zh-CN', 'en'] as const)(
  'route inputs and hints render only for applicable main applicants in %s',
  (locale) => {
    const cases: engine.ImmigrationEpisode[] = [
      ...episodes,
      { ...episodes[2], route: 'SKILLED_WORKER', role: 'DEPENDANT' },
      ...([undefined, []] as const).map((criteria) => ({
        ...episodes[3],
        innovatorSettlementCriteria: criteria === undefined ? undefined : [],
      })),
      ...(['RESEARCH_BODY', 'TECH_NATION', 'PRIZE', undefined] as const).map(
        (globalTalentEndorsement) => ({
          ...episodes[0],
          globalTalentEndorsement,
        }),
      ),
      ...(['PARTNER_TEN_YEAR', 'PARENT', undefined] as const).map(
        (familyPermission) => ({ ...episodes[1], familyPermission }),
      ),
      ...episodes.map((episode) => ({
        ...episode,
        role: 'DEPENDANT' as const,
      })),
    ];
    for (const episode of cases) {
      const draft = { ...currentLawDraft(episode), step: 2 };
      const create = vi
        .spyOn(questionnaire, 'createDraft')
        .mockReturnValue(draft);
      // Server rendering does not run the effect that marks the questionnaire ready.
      const state = vi
        .spyOn(React, 'useState')
        .mockReturnValueOnce([true, vi.fn()]);
      try {
        const html = renderToStaticMarkup(
          <LocaleContext value={{ locale, setLocale: () => {} }}>
            <SimulatePage />
          </LocaleContext>,
        );
        const talent =
          episode.route === 'GLOBAL_TALENT' && episode.role === 'MAIN';
        const family =
          episode.route === 'FAMILY_PARTNER_OR_PARENT' &&
          episode.role === 'MAIN';
        expect(html.includes('id="episode-0-endorsement"')).toBe(talent);
        expect(html.includes('id="episode-0-criteria"')).toBe(
          talent &&
            (episode.globalTalentEndorsement === 'ARTS_COUNCIL_ENGLAND' ||
              episode.globalTalentEndorsement === 'TECH_NATION'),
        );
        expect(html.includes('id="episode-0-familyPermission"')).toBe(family);
        const relative =
          episode.route === 'HONG_KONG_BNO' && episode.role === 'DEPENDANT';
        expect(html.includes('<option value="RELATIVE">')).toBe(relative);
        if (relative)
          expect(html).toContain(t('episodes.relativeDependant', locale));
        const innovator =
          episode.route === 'INNOVATOR_FOUNDER' && episode.role === 'MAIN';
        expect(html.includes('id="episode-0-innovator-unknown"')).toBe(
          innovator,
        );
        expect(
          (html.match(/id="episode-0-innovator-(?!unknown)/g) ?? []).length,
        ).toBe(
          innovator && episode.innovatorSettlementCriteria !== undefined
            ? 7
            : 0,
        );
        expect(html.includes('id="episode-0-privateLifeRoute"')).toBe(
          episode.route === 'FAMILY_AND_PRIVATE_LIFE' &&
            episode.role === 'MAIN',
        );
        expect(html.includes(t('episodes.familyPermissionHint', locale))).toBe(
          family &&
            (episode.familyPermission === 'PARTNER_FIVE_YEAR' ||
              episode.familyPermission === 'PARTNER_TEN_YEAR'),
        );
        if (talent)
          expect(html).toContain(
            t('episodes.globalTalentEndorsementHint', locale),
          );
        if (locale === 'en') expect(html).not.toMatch(/[\u3400-\u9fff]/);
      } finally {
        create.mockRestore();
        state.mockRestore();
      }
    }
  },
);

test.each([false, true])(
  'extension inputs preserve none, unknown and revoked states in engine requests, principal = %s',
  (principal) => {
    let draft = currentLawDraft(episodes[3]);
    if (principal) {
      draft = draftReducer(draft, { type: 'principal-start' });
      draft = draftReducer(draft, {
        type: 'timeline',
        patch: currentLawDraft(episodes[3]).timeline,
      });
    }
    const evaluate = vi.spyOn(engine, 'evaluate');
    try {
      for (const criteria of [[], undefined] as const) {
        draft = draftReducer(draft, {
          type: 'episode',
          index: 0,
          patch: {
            innovatorSettlementCriteria:
              criteria === undefined ? undefined : [],
          },
        });
        runSimulation(draft);
        const sent =
          evaluate.mock.lastCall![0][principal ? 'principal' : 'timeline']!;
        expect(sent.episodes[0].innovatorSettlementCriteria).toEqual(criteria);
        const result = principal
          ? runPrincipalSimulation(draft)!
          : runSimulation(draft);
        expect(
          result.byRuleSet['current-law-2026-11']?.rules.find(
            (rule) => rule.id === 'CL-INNOVATOR-ENDORSEMENT',
          )?.status,
        ).toBe(criteria === undefined ? 'UNKNOWN' : 'FAIL');
      }
      draft = draftReducer(draft, {
        type: 'timeline',
        patch: { episodes: [episodes[5]] },
      });
      for (const revoked of [undefined, true, undefined]) {
        draft = draftReducer(draft, {
          type: 'timeline',
          patch: { protectionStatusRevoked: revoked },
        });
        runSimulation(draft);
        expect(
          evaluate.mock.lastCall![0][principal ? 'principal' : 'timeline']!
            .protectionStatusRevoked,
        ).toBe(revoked);
        const result = principal
          ? runPrincipalSimulation(draft)!
          : runSimulation(draft);
        const current = result.byRuleSet['current-law-2026-11']!;
        expect(
          current.rules.find((rule) => rule.id === 'CL-PROTECTION-STATUS')
            ?.status,
        ).toBe(revoked ? 'FAIL' : 'PASS');
        if (revoked) expect(current.pathwayYears).not.toBe(5);
        else expect(current.pathwayYears).toBe(5);
      }
    } finally {
      evaluate.mockRestore();
    }
  },
);

test('unspecified Private Life permission remains insufficient information', () => {
  const draft = currentLawDraft({
    ...episodes[4],
    privateLifeRoute: undefined,
  });
  expect(runSimulation(draft).byRuleSet['current-law-2026-11']?.outcome).toBe(
    'INSUFFICIENT_INFORMATION',
  );
});

test.each(['zh-CN', 'en'] as const)(
  'revocation input follows the current protection main applicant in %s',
  (locale) => {
    for (const route of [
      'CORE_PROTECTION',
      'PROTECTION_WORK_AND_STUDY',
      'SAFE_AND_LEGAL',
      'LEGACY_SAFE_AND_LEGAL',
      'UK_ANCESTRY',
    ] as const) {
      for (const role of ['MAIN', 'DEPENDANT'] as const) {
        for (const current of [true, false]) {
          const draft = currentLawDraft({
            ...episodes[5],
            route,
            role,
            validTo: current ? '2035-11-04' : '2025-11-04',
          });
          draft.step = 5;
          const create = vi
            .spyOn(questionnaire, 'createDraft')
            .mockReturnValue(draft);
          const state = vi
            .spyOn(React, 'useState')
            .mockReturnValueOnce([true, vi.fn()]);
          try {
            const html = renderToStaticMarkup(
              <LocaleContext value={{ locale, setLocale: () => {} }}>
                <SimulatePage />
              </LocaleContext>,
            );
            expect(html.includes('id="protection-status-revoked"')).toBe(
              current && role === 'MAIN' && route !== 'UK_ANCESTRY',
            );
            if (locale === 'en') expect(html).not.toMatch(/[\u3400-\u9fff]/);
          } finally {
            create.mockRestore();
            state.mockRestore();
          }
        }
      }
    }
  },
);
