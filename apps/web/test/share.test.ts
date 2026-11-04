import { expect, test } from 'vitest';
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
