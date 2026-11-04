import type { SimulationResult } from '@uk-immigration/engine';
import type { Draft } from './questionnaire';

const draftKey = 'uk-immigration-draft-v1';
let memoryDraft: Draft | undefined;
let memoryResult: SimulationResult | undefined;

// A single storage boundary handles unavailable storage and invalid JSON.
export function draftStorage(next?: Draft): {
  draft: Draft | undefined;
  available: boolean;
} {
  if (next) memoryDraft = next;
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

export function rememberResult(result: SimulationResult): void {
  memoryResult = result;
}
export function getRememberedResult(): SimulationResult | undefined {
  return memoryResult;
}
