import { expect, test } from 'vitest';
import type { RuleOutcome, SettlementAssessment } from '@uk-immigration/engine';
import { earnedSettlement2026_11 } from '@uk-immigration/policy-data';
import {
  createDraft,
  draftReducer,
  visibleIncomeYears,
} from '../lib/questionnaire';
import { applyWhatIf, diffAssessment, initialWhatIf } from '../lib/whatif';

function baseline() {
  const draft = draftReducer(createDraft(), {
    type: 'date',
    date: '2026-11-04',
  });
  draft.completed = true;
  draft.timeline.incomeYears = visibleIncomeYears(draft).map((row, index) => ({
    ...row,
    earnings: index === 0 ? 0 : 10000 + index,
    partnerEarnings: 20000 + index,
  }));
  draft.timeline.incomeYears.push({ taxYear: '2010-11', earnings: 123 });
  draft.timeline.benefits = [
    { benefitType: 'UNIVERSAL_CREDIT', from: '2025-02-01' },
  ];
  draft.timeline.absences = [{ from: '2025-03-01', to: '2025-04-01' }];
  return draft;
}

test('initial controls preserve the baseline, including zero income', () => {
  const draft = baseline();
  const controls = initialWhatIf(draft);
  expect(controls).toMatchObject({
    incomeEnabled: false,
    incomeYears: 7,
    earnings: 0,
  });
  expect(applyWhatIf(draft, controls)).toEqual(draft);
});

test.each([1, 4, 7])(
  'income override changes only the latest %i personal earnings rows',
  (incomeYears) => {
    const draft = baseline();
    const original = structuredClone(draft);
    const earnings =
      earnedSettlement2026_11.values.earningsThreshold3Year.value;
    const next = applyWhatIf(draft, {
      ...initialWhatIf(draft),
      incomeEnabled: true,
      incomeYears,
      earnings,
    });
    expect(next.timeline.incomeYears).toEqual(
      draft.timeline.incomeYears.map((row, index) =>
        index < incomeYears ? { ...row, earnings } : row,
      ),
    );
    expect(draft).toEqual(original);
    expect(applyWhatIf(draft, { ...initialWhatIf(draft), earnings })).toEqual(
      draft,
    );
  },
);

test('date changes synchronize tax years before applying income and retain older rows', () => {
  const draft = baseline();
  const next = applyWhatIf(draft, {
    ...initialWhatIf(draft),
    simulationDate: '2030-01-15',
    incomeEnabled: true,
    incomeYears: 4,
    earnings: 60000,
  });
  expect(next.simulationDate).toBe('2030-01-15');
  expect(visibleIncomeYears(next).slice(0, 4)).toEqual([
    { taxYear: '2028-29', earnings: 60000 },
    { taxYear: '2027-28', earnings: 60000 },
    { taxYear: '2026-27', earnings: 60000 },
    { taxYear: '2025-26', earnings: 60000, partnerEarnings: 20000 },
  ]);
  expect(visibleIncomeYears(next).slice(4)).toEqual(
    visibleIncomeYears(draft).slice(1, 4),
  );
  expect(
    next.timeline.incomeYears.find((row) => row.taxYear === '2010-11'),
  ).toEqual({ taxYear: '2010-11', earnings: 123 });
  const dateOnly = applyWhatIf(draft, {
    ...initialWhatIf(draft),
    simulationDate: '2030-01-15',
  });
  expect(visibleIncomeYears(dateOnly)[0]).toEqual({ taxYear: '2028-29' });
  expect(visibleIncomeYears(dateOnly)[3]).toEqual(visibleIncomeYears(draft)[0]);
});

test('checkboxes independently clear their arrays and resetting restores the baseline', () => {
  const draft = baseline();
  const controls = initialWhatIf(draft);
  const benefits = applyWhatIf(draft, { ...controls, noPublicFunds: true });
  expect(benefits.timeline.benefits).toEqual([]);
  expect(benefits.timeline.absences).toEqual(draft.timeline.absences);
  const absences = applyWhatIf(draft, { ...controls, noAbsences: true });
  expect(absences.timeline.absences).toEqual([]);
  expect(absences.timeline.benefits).toEqual(draft.timeline.benefits);
  expect(applyWhatIf(draft, controls)).toEqual(draft);
  expect(draft.timeline.benefits).toHaveLength(1);
  expect(draft.timeline.absences).toHaveLength(1);
});

test('English and Life in the UK overrides preserve the other timeline inputs', () => {
  const draft = baseline();
  draft.timeline.english = { exempt: true };
  draft.timeline.lifeInTheUk = { exempt: true };
  expect(initialWhatIf(draft)).toMatchObject({
    english: { exempt: true },
    lifeInTheUk: { exempt: true },
  });
  expect(
    applyWhatIf(draft, {
      ...initialWhatIf(draft),
      english: { cefrLevel: 'B2' },
      lifeInTheUk: { passed: true },
    }).timeline,
  ).toEqual({
    ...draft.timeline,
    english: { cefrLevel: 'B2' },
    lifeInTheUk: { passed: true },
  });
  expect(
    applyWhatIf(draft, {
      ...initialWhatIf(draft),
      english: undefined,
      lifeInTheUk: undefined,
    }).timeline.english,
  ).toBeUndefined();
});

const rule = (id: string, status: RuleOutcome['status']): RuleOutcome => ({
  id,
  title: id,
  status,
  explanation: `${id}: ${status}`,
  sources: [],
});
const assessment = (rules: RuleOutcome[]): SettlementAssessment => ({
  outcome: 'INSUFFICIENT_INFORMATION',
  rules,
  assumptions: [],
});

test('rule diff groups every status transition once and uses the after explanation', () => {
  const before: RuleOutcome[] = [];
  const after: RuleOutcome[] = [];
  for (const previous of ['PASS', 'FAIL', 'UNKNOWN'] as const) {
    for (const next of ['PASS', 'FAIL', 'UNKNOWN'] as const) {
      const id = `${previous}-${next}`;
      before.push(rule(id, previous));
      after.push(rule(id, next));
    }
  }
  const diff = diffAssessment(assessment(before), assessment(after));
  expect(diff.becameMet).toEqual([
    rule('FAIL-PASS', 'PASS'),
    rule('UNKNOWN-PASS', 'PASS'),
  ]);
  expect(diff.becameUnmet).toEqual([
    rule('PASS-FAIL', 'FAIL'),
    rule('PASS-UNKNOWN', 'UNKNOWN'),
    rule('UNKNOWN-FAIL', 'FAIL'),
  ]);
  expect(diff.stillUnmet).toEqual([
    rule('FAIL-FAIL', 'FAIL'),
    rule('FAIL-UNKNOWN', 'UNKNOWN'),
    rule('UNKNOWN-UNKNOWN', 'UNKNOWN'),
  ]);
  expect(diff.changed).toBe(true);
});

test('new rules are grouped by their after status', () => {
  const diff = diffAssessment(
    assessment([]),
    assessment([
      rule('new-pass', 'PASS'),
      rule('new-fail', 'FAIL'),
      rule('new-unknown', 'UNKNOWN'),
    ]),
  );
  expect(diff.becameMet).toEqual([rule('new-pass', 'PASS')]);
  expect(diff.becameUnmet).toEqual([
    rule('new-fail', 'FAIL'),
    rule('new-unknown', 'UNKNOWN'),
  ]);
  expect(diff.stillUnmet).toEqual([]);
});

test('unchanged assessments still list unmet rules without claiming a change', () => {
  const before = assessment([
    rule('pass', 'PASS'),
    rule('fail', 'FAIL'),
    rule('unknown', 'UNKNOWN'),
  ]);
  expect(diffAssessment(before, structuredClone(before))).toEqual({
    becameMet: [],
    becameUnmet: [],
    stillUnmet: before.rules.slice(1),
    changed: false,
  });
});

test('changes to summary, explanations, assumptions or removed rules count as a change', () => {
  const before = assessment([rule('pass', 'PASS')]);
  for (const patch of [
    { outcome: 'LIKELY_ELIGIBLE' as const },
    { pathwayYears: 3 },
    { earliestDate: '2030-01-15' },
    { rules: [{ ...before.rules[0], explanation: 'Updated explanation' }] },
    { assumptions: ['Updated assumption'] },
    { rules: [] },
  ])
    expect(diffAssessment(before, { ...before, ...patch }).changed).toBe(true);
});
