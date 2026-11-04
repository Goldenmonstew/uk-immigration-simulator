import { type Draft, screeningKeys, steps } from './questionnaire';

export function encodeDraft(draft: Draft): string {
  const bytes = new TextEncoder().encode(JSON.stringify(draft));
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join(
    '',
  );
  return btoa(binary)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '');
}

export function decodeDraft(encoded: string): Draft | undefined {
  try {
    if (!/^[A-Za-z0-9_-]+$/.test(encoded)) return undefined;
    const binary = atob(encoded.replaceAll('-', '+').replaceAll('_', '/'));
    const bytes = Uint8Array.from(binary, (character) =>
      character.charCodeAt(0),
    );
    const draft = JSON.parse(
      new TextDecoder('utf-8', { fatal: true }).decode(bytes),
    );
    // Check the containers needed to reopen external input in the questionnaire.
    const timeline = draft?.timeline;
    if (
      draft?.version !== 1 ||
      !Number.isInteger(draft.step) ||
      draft.step < 0 ||
      draft.step >= steps.length ||
      typeof draft.completed !== 'boolean' ||
      typeof draft.simulationDate !== 'string' ||
      !screeningKeys.every((key) =>
        ['', 'yes', 'no'].includes(draft.screening?.[key]),
      ) ||
      typeof timeline?.dateOfBirth !== 'string' ||
      typeof timeline?.nationality !== 'string' ||
      ![
        'episodes',
        'absences',
        'incomeYears',
        'benefits',
        'relationships',
        'criminalRecord',
        'immigrationBreaches',
      ].every(
        (key) =>
          Array.isArray(timeline[key]) &&
          timeline[key].every(
            (row: unknown) =>
              row !== null && typeof row === 'object' && !Array.isArray(row),
          ),
      ) ||
      !['english', 'lifeInTheUk'].every(
        (key) =>
          timeline[key] === undefined ||
          (timeline[key] !== null &&
            typeof timeline[key] === 'object' &&
            !Array.isArray(timeline[key])),
      )
    )
      return undefined;
    return draft;
  } catch {
    return undefined;
  }
}
