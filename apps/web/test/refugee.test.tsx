import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test, vi } from 'vitest';
import * as engine from '@uk-immigration/engine';
import { ResultView } from '../components/result-view';
import { t } from '../i18n';
import { LocaleContext } from '../i18n/locale';
import {
  activePersonDraft,
  createDraft,
  draftReducer,
  runPrincipalSimulation,
  runSimulation,
  validateStep,
} from '../lib/questionnaire';
import { decodeDraft, encodeDraft } from '../lib/share';
import { draftStorage } from '../lib/storage';

function protectionDraft() {
  const draft = createDraft();
  draft.simulationDate = '2029-03-01';
  draft.screening = { criminality: 'no', breach: 'no', debt: 'no' };
  draft.timeline = {
    ...draft.timeline,
    dateOfBirth: '1990-01-01',
    nationality: 'SYR',
    // SRC-001 p40 Individual B; dates are supplemental scenario inputs.
    episodes: [
      {
        route: 'CORE_PROTECTION',
        role: 'MAIN',
        validFrom: '2027-03-01',
        validTo: '2028-02-29',
      },
      {
        route: 'PROTECTION_WORK_AND_STUDY',
        role: 'MAIN',
        validFrom: '2028-03-01',
        validTo: '2048-03-01',
        sustainedActivity: 'WORK',
      },
    ],
    english: { cefrLevel: 'B2' },
    lifeInTheUk: { passed: true },
    asylumSupportRepayment: 'REPAID',
  };
  return draft;
}

test.each([false, true])(
  'breach records and protection fields reach evaluate when editing principal = %s',
  (principal) => {
    for (const article31 of [undefined, true, false]) {
      let draft = protectionDraft();
      if (principal) {
        draft.timeline.episodes = [
          {
            route: 'SKILLED_WORKER',
            role: 'DEPENDANT',
            dependantOf: 'PARTNER',
            validFrom: '2028-03-01',
            validTo: '2048-03-01',
          },
        ];
        draft = draftReducer(draft, { type: 'principal-start' });
      }
      draft = draftReducer(draft, {
        type: 'timeline',
        patch: {
          ...protectionDraft().timeline,
          episodes: [
            {
              route: 'SAFE_AND_LEGAL',
              role: 'MAIN',
              validFrom: '2027-03-01',
              validTo: '2028-02-29',
              resettlementScheme: 'OTHER_DESIGNATED',
            },
            protectionDraft().timeline.episodes[1],
          ],
          immigrationBreaches: [
            { type: 'ILLEGAL_ENTRY', date: '2027-02-01', article31 },
          ],
        },
      });
      draft = draftReducer(draft, {
        type: 'screening',
        key: 'breach',
        answer: 'yes',
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
              immigrationBreaches: timeline.immigrationBreaches,
              asylumSupportRepayment: 'REPAID',
            }),
          }),
        );
        if (principal) {
          runPrincipalSimulation(draft, 'en');
          expect(evaluate).toHaveBeenLastCalledWith(
            expect.objectContaining({
              timeline: expect.objectContaining({
                immigrationBreaches: timeline.immigrationBreaches,
                asylumSupportRepayment: 'REPAID',
              }),
            }),
          );
        }
        const cleared = draftReducer(draft, {
          type: 'screening',
          key: 'breach',
          answer: 'no',
        });
        expect(activePersonDraft(cleared).timeline.immigrationBreaches).toEqual(
          [],
        );
        expect(timeline.immigrationBreaches).toHaveLength(1);
        expect(principal ? cleared.timeline : cleared.principal).toEqual(
          principal ? draft.timeline : draft.principal,
        );
        runSimulation(cleared);
        expect(evaluate).toHaveBeenLastCalledWith(
          expect.objectContaining({
            [principal ? 'principal' : 'timeline']: expect.objectContaining({
              immigrationBreaches: [],
            }),
          }),
        );
      } finally {
        evaluate.mockRestore();
      }
    }
  },
);

test('screening requires a dated breach when yes, but no protection answer', () => {
  const draft = protectionDraft();
  draft.step = 1;
  expect(validateStep(draft)).toEqual({});
  draft.screening.breach = 'yes';
  expect(validateStep(draft)).toEqual({ breaches: 'breaches.required' });
  for (const date of ['', '2027-02-30']) {
    draft.timeline.immigrationBreaches = [{ type: 'ILLEGAL_ENTRY', date }];
    expect(validateStep(draft)).toEqual({ 'breach-0-date': 'error.date' });
  }
  draft.timeline.immigrationBreaches[0].date = '2027-02-01';
  expect(validateStep(draft)).toEqual({});
});

test('legacy protection yes loads from storage and sharing without a frontend short circuit', () => {
  const draft = protectionDraft();
  draft.screening.protection = 'yes';
  draft.principal = structuredClone(draft.timeline);
  draft.principalScreening = { ...draft.screening };
  vi.stubGlobal('localStorage', { getItem: () => JSON.stringify(draft) });
  const evaluate = vi.spyOn(engine, 'evaluate');
  try {
    const loaded = draftStorage().draft!;
    expect(loaded).toEqual(draft);
    const shared = decodeDraft(encodeDraft(loaded))!;
    expect(shared).toEqual(draft);
    runSimulation(shared);
    expect(evaluate).toHaveBeenCalledOnce();
    runPrincipalSimulation(shared);
    expect(evaluate).toHaveBeenCalledTimes(2);
    expect(validateStep({ ...shared, step: 1 })).toEqual({});
  } finally {
    evaluate.mockRestore();
    vi.unstubAllGlobals();
  }
});

test('Skilled Worker overstaying reaches the engine 20-year pathway instead of frontend advice', () => {
  const draft = protectionDraft();
  draft.timeline.episodes = [
    {
      route: 'SKILLED_WORKER',
      role: 'MAIN',
      validFrom: '2027-03-01',
      validTo: '2048-03-01',
      salary: 55000,
      socCode: '2134',
    },
  ];
  draft.screening.breach = 'yes';
  draft.timeline.immigrationBreaches = [
    { type: 'OVERSTAYING', date: '2027-02-01' },
  ];
  const result = runSimulation(draft);
  expect(result.shortCircuit).toBeUndefined();
  expect(result.byRuleSet['earned-settlement-2026-11']).toMatchObject({
    pathwayYears: 20,
  });
});

test.each(['zh-CN', 'en'] as const)(
  'protection notice follows the active episode and preserves advice in %s',
  (locale) => {
    const draft = protectionDraft();
    const result = runSimulation(draft, locale);
    const render = () =>
      renderToStaticMarkup(
        <LocaleContext value={{ locale, setLocale: () => {} }}>
          <ResultView result={result} draft={draft} />
        </LocaleContext>,
      );
    for (const date of [
      '2027-03-01',
      '2028-02-29',
      '2028-03-01',
      '2048-03-01',
    ]) {
      draft.simulationDate = date;
      const html = render();
      expect(html).toContain(t('result.protectionNotice', locale));
      expect(html.indexOf(t('result.protectionNotice', locale))).toBeLessThan(
        html.indexOf('id="current-law-2026-11-heading"'),
      );
      expect(html).toContain(t('result.advice', locale));
      if (locale === 'en') expect(html).not.toMatch(/[\u3400-\u9fff]/);
    }
    for (const date of ['2027-02-28', '2048-03-02']) {
      draft.simulationDate = date;
      expect(render()).not.toContain(t('result.protectionNotice', locale));
    }
    draft.simulationDate = '2029-03-01';
    draft.timeline.episodes.push({
      route: 'SKILLED_WORKER',
      role: 'MAIN',
      validFrom: '2029-01-01',
      validTo: '2035-01-01',
    });
    expect(render()).not.toContain(t('result.protectionNotice', locale));
    draft.timeline.episodes.pop();
    draft.screening.criminality = 'yes';
    const short = renderToStaticMarkup(
      <ResultView result={runSimulation(draft, locale)} draft={draft} />,
    );
    expect(short).not.toContain(t('result.protectionNotice'));
    expect(short).not.toContain('id="current-law-2026-11-heading"');
  },
);
