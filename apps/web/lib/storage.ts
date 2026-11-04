import type { Locale, SimulationResult } from '@uk-immigration/engine';
import type { Draft } from './questionnaire';

const draftKey = 'uk-immigration-draft-v1';
let memoryDraft: Draft | undefined;
let memoryResult: { result: SimulationResult; locale: Locale } | undefined;

// A single storage boundary handles unavailable storage and invalid JSON.
export function draftStorage(next?: Draft): {
  draft: Draft | undefined;
  available: boolean;
} {
  if (next) {
    memoryDraft = next;
    memoryResult = undefined;
  }
  try {
    if (next) {
      localStorage.setItem(draftKey, JSON.stringify(next));
    } else {
      const saved = localStorage.getItem(draftKey);
      const parsed: Draft | undefined = saved ? JSON.parse(saved) : undefined;
      if (parsed?.version === 1) memoryDraft = parsed;
    }
    return { draft: memoryDraft, available: true };
  } catch {
    return { draft: memoryDraft, available: false };
  }
}

export function rememberResult(result: SimulationResult, locale: Locale): void {
  memoryResult = { result, locale };
}
export function getRememberedResult(
  locale: Locale,
): SimulationResult | undefined {
  return memoryResult?.locale === locale ? memoryResult.result : undefined;
}

export interface SavedScenario {
  id: string;
  name: string;
  savedAt: string;
  draft: Draft;
}

const scenariosKey = 'uk-immigration-scenarios-v1';

export function readScenarios(): {
  scenarios: SavedScenario[];
  available: boolean;
} {
  try {
    const saved = localStorage.getItem(scenariosKey);
    const scenarios = saved ? JSON.parse(saved) : [];
    if (
      !Array.isArray(scenarios) ||
      scenarios.some(
        (item) =>
          !item ||
          typeof item.id !== 'string' ||
          typeof item.name !== 'string' ||
          typeof item.savedAt !== 'string' ||
          item.draft?.version !== 1,
      )
    )
      return { scenarios: [], available: false };
    return { scenarios, available: true };
  } catch {
    return { scenarios: [], available: false };
  }
}

function writeScenarios(scenarios: SavedScenario[]) {
  try {
    localStorage.setItem(scenariosKey, JSON.stringify(scenarios));
    return { scenarios, available: true };
  } catch {
    return { ...readScenarios(), available: false };
  }
}

export function saveScenario(name: string, draft: Draft) {
  const stored = readScenarios();
  if (!stored.available) return stored;
  return writeScenarios([
    ...stored.scenarios,
    {
      id: crypto.randomUUID(),
      name,
      savedAt: new Date().toISOString(),
      draft,
    },
  ]);
}

export function deleteScenario(id: string) {
  const stored = readScenarios();
  if (!stored.available) return stored;
  return writeScenarios(
    stored.scenarios.filter((scenario) => scenario.id !== id),
  );
}

export function loadScenario(scenario: SavedScenario): Draft {
  // What-if share links can contain drafts marked incomplete after an edit.
  const next = { ...scenario.draft, completed: true };
  draftStorage(next);
  return next;
}
