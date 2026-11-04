import { expect, test } from 'vitest';
import { POLICY_DATA_VERSION } from '../src/index';

test('exports the placeholder version', () => {
  expect(POLICY_DATA_VERSION).toBe('0.0.0');
});
