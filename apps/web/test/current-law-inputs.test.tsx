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
  runPrincipalSimulation,
  runSimulation,
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
  // SRC-021 GT 11.1; SRC-024 E-ILRP.1.3; SRC-020 HK 62.1(b).
  for (const [index, years] of [3, 5, 5].entries()) {
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

test.each([false, true])(
  'changing route or role clears route inputs only on the edited episode, principal = %s',
  (principal) => {
    for (const episode of episodes.slice(0, 2)) {
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
