import { expect, test, vi } from 'vitest';
import * as engine from '@uk-immigration/engine';
import {
  createDraft,
  draftReducer,
  runSimulation,
  screeningKeys,
  taxYearsBefore,
  validateStep,
  visibleIncomeYears,
} from '../lib/questionnaire';
import { draftStorage } from '../lib/storage';

test('normal submission sends the entered timeline and selected income window to evaluate', () => {
  const draft = draftReducer(createDraft(), {
    type: 'date',
    date: '2026-11-04',
  });
  draft.screening = {
    criminality: 'no',
    breach: 'no',
    debt: 'no',
    protection: 'no',
  };
  draft.timeline.dateOfBirth = '1991-08-19';
  draft.timeline.nationality = 'CHN';
  draft.timeline.episodes = [
    {
      route: 'SKILLED_WORKER',
      role: 'MAIN',
      validFrom: '2021-06-01',
      validTo: '2027-06-01',
      salary: 61234.56,
    },
  ];
  draft.timeline.incomeYears = [
    { taxYear: '2025-26', earnings: 0 },
    { taxYear: '2010-11', earnings: 1 },
  ];
  const evaluate = vi.spyOn(engine, 'evaluate');
  runSimulation(draft);
  expect(evaluate).toHaveBeenCalledExactlyOnceWith({
    simulationDate: '2026-11-04',
    timeline: {
      ...draft.timeline,
      incomeYears: [
        { taxYear: '2025-26', earnings: 0 },
        { taxYear: '2024-25' },
        { taxYear: '2023-24' },
        { taxYear: '2022-23' },
        { taxYear: '2021-22' },
        { taxYear: '2020-21' },
        { taxYear: '2019-20' },
      ],
      governmentDebt: { outstanding: false },
    },
  });
  evaluate.mockRestore();
});

test('tax year window uses completed years on either side of 6 April', () => {
  expect(taxYearsBefore('2026-04-05')).toEqual([
    '2024-25',
    '2023-24',
    '2022-23',
    '2021-22',
    '2020-21',
    '2019-20',
    '2018-19',
  ]);
  expect(taxYearsBefore('2026-04-06')).toEqual([
    '2025-26',
    '2024-25',
    '2023-24',
    '2022-23',
    '2021-22',
    '2020-21',
    '2019-20',
  ]);
});

test('changing simulation date preserves entered income; blanks and zero remain distinct', () => {
  let draft = draftReducer(createDraft(), { type: 'date', date: '2026-11-04' });
  draft = draftReducer(draft, {
    type: 'timeline',
    patch: {
      incomeYears: [
        { taxYear: '2025-26', earnings: 0, partnerEarnings: 20000 },
      ],
    },
  });
  draft = draftReducer(draft, { type: 'date', date: '2027-04-06' });
  expect(visibleIncomeYears(draft)[0]).toEqual({ taxYear: '2026-27' });
  expect(visibleIncomeYears(draft)[1]).toEqual({
    taxYear: '2025-26',
    earnings: 0,
    partnerEarnings: 20000,
  });
  draft = draftReducer(draft, { type: 'date', date: '2026-11-04' });
  expect(visibleIncomeYears(draft)[0].earnings).toBe(0);
});

test.each(screeningKeys)(
  'a yes to %s short-circuits without inventing event details',
  (key) => {
    const draft = draftReducer(createDraft(), {
      type: 'screening',
      key,
      answer: 'yes',
    });
    expect(runSimulation(draft).shortCircuit?.message).toBeTruthy();
    expect(runSimulation(draft).byRuleSet).toEqual({});
    expect(draft.timeline.criminalRecord).toEqual([]);
    expect(draft.timeline.immigrationBreaches).toEqual([]);
    expect(draft.timeline.episodes).toEqual([]);
  },
);

test('field validation rejects missing screening, reversed dates and invalid amounts', () => {
  const draft = createDraft();
  expect(validateStep(draft)).toHaveProperty('dob');
  draft.step = 1;
  expect(Object.keys(validateStep(draft))).toHaveLength(4);
  draft.step = 2;
  draft.timeline.episodes = [
    {
      route: 'SKILLED_WORKER',
      role: 'MAIN',
      validFrom: '2026-02-28',
      validTo: '2026-02-27',
      salary: -1,
      socCode: '123',
    },
  ];
  expect(Object.keys(validateStep(draft))).toEqual([
    'episode-0-to',
    'episode-0-soc',
    'episode-0-salary',
  ]);
  draft.timeline.episodes[0] = {
    ...draft.timeline.episodes[0],
    validTo: '2027-02-28',
    salary: 0,
    socCode: undefined,
  };
  expect(validateStep(draft)).toEqual({});
});

test('draft round trip retains inputs and unavailable storage retains in-memory draft', () => {
  const stored = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    setItem: (key: string, value: string) => stored.set(key, value),
    getItem: (key: string) => stored.get(key) ?? null,
  });
  const draft = createDraft();
  draft.timeline.nationality = 'CHN';
  draft.step = 4;
  expect(draftStorage(draft).available).toBe(true);
  expect(draftStorage().draft).toEqual(draft);
  vi.stubGlobal('localStorage', {
    setItem: () => {
      throw new Error('unavailable');
    },
    getItem: () => {
      throw new Error('unavailable');
    },
  });
  draft.timeline.nationality = 'IND';
  expect(draftStorage(draft)).toEqual({ draft, available: false });
  expect(draftStorage().draft?.timeline.nationality).toBe('IND');
  vi.unstubAllGlobals();
});
