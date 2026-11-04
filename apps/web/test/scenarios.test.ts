import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { createDraft, runSimulation } from '../lib/questionnaire';
import { applyWhatIf, initialWhatIf } from '../lib/whatif';
import {
  deleteScenario,
  draftStorage,
  getRememberedResult,
  loadScenario,
  readScenarios,
  rememberResult,
  saveScenario,
} from '../lib/storage';

const storage = new Map<string, string>();
beforeEach(() => {
  storage.clear();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
  });
});
afterEach(() => vi.unstubAllGlobals());

test('two named scenarios persist as drafts including the principal, without stored results', async () => {
  const draft = {
    ...createDraft(),
    completed: true,
    principal: createDraft().timeline,
  };
  expect(readScenarios()).toEqual({ scenarios: [], available: true });
  saveScenario('家庭情景', draft);
  saveScenario('家庭情景', { ...draft, simulationDate: '2030-01-01' });
  vi.resetModules();
  const reloaded = await import('../lib/storage');
  const { scenarios, available } = reloaded.readScenarios();
  expect(available).toBe(true);
  expect(scenarios).toHaveLength(2);
  expect(scenarios[0].draft).toEqual(draft);
  expect(scenarios[1].draft.simulationDate).toBe('2030-01-01');
  expect(scenarios[0].id).not.toBe(scenarios[1].id);
  expect(Number.isFinite(Date.parse(scenarios[0].savedAt))).toBe(true);
  expect(Object.keys(scenarios[0]).sort()).toEqual([
    'draft',
    'id',
    'name',
    'savedAt',
  ]);
  expect(storage.has('uk-immigration-scenarios-v1')).toBe(true);
  expect(storage.get('uk-immigration-scenarios-v1')).not.toContain('byRuleSet');
});

test('loading replaces the current draft and clears the previous result; deleting keeps the other scenario', () => {
  const draft = { ...createDraft(), completed: true };
  saveScenario('A', draft);
  saveScenario('B', { ...draft, simulationDate: '2030-01-01' });
  const [first, second] = readScenarios().scenarios;
  draftStorage(second.draft);
  rememberResult(runSimulation(second.draft), 'zh-CN');
  expect(getRememberedResult('zh-CN')).toBeDefined();
  loadScenario(first);
  expect(draftStorage().draft).toEqual(first.draft);
  expect(getRememberedResult('zh-CN')).toBeUndefined();
  expect(deleteScenario(second.id).scenarios).toEqual([first]);
  expect(readScenarios().scenarios).toEqual([first]);
  expect(JSON.parse(storage.get('uk-immigration-scenarios-v1')!)).toHaveLength(
    1,
  );
});

test('a saved What-if date change loads as completed while retaining the original saved draft', () => {
  const baseline = { ...createDraft(), completed: true };
  const adjusted = applyWhatIf(baseline, {
    ...initialWhatIf(baseline),
    simulationDate: '2030-01-01',
  });
  expect(adjusted.completed).toBe(false);
  saveScenario('What-if', adjusted);
  const scenario = readScenarios().scenarios[0];
  expect(loadScenario(scenario)).toEqual({ ...adjusted, completed: true });
  expect(draftStorage().draft?.completed).toBe(true);
  expect(draftStorage().draft?.simulationDate).toBe('2030-01-01');
  expect(readScenarios().scenarios[0].draft).toEqual(adjusted);
});

test('unavailable storage and malformed scenario arrays report failure without claiming a save', () => {
  storage.set('uk-immigration-scenarios-v1', '{broken');
  expect(readScenarios().available).toBe(false);
  expect(saveScenario('A', createDraft()).available).toBe(false);
  expect(storage.get('uk-immigration-scenarios-v1')).toBe('{broken');
  storage.clear();
  vi.stubGlobal('localStorage', {
    getItem: () => null,
    setItem: () => {
      throw new Error('storage full');
    },
  });
  expect(saveScenario('A', createDraft())).toEqual({
    scenarios: [],
    available: false,
  });
});
