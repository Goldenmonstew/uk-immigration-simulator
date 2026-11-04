import { expect, test } from 'vitest';
import { ENGINE_VERSION, getEngineVersion } from '../src/index';

test('returns the engine version', () => {
  expect(getEngineVersion()).toBe(ENGINE_VERSION);
});
