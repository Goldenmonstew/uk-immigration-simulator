import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { RULES } from '../src/rules';

const pendingDetails = readFileSync(
  new URL('../../../docs/pending-details.md', import.meta.url),
  'utf8',
);

test.each(
  Object.values(RULES)
    .flat()
    .map((rule) => [rule.meta.id, rule]),
)('%s has sources and registered pending details', (_, rule) => {
  expect(rule.meta.sources.length).toBeGreaterThanOrEqual(1);
  for (const id of rule.meta.pendingDetails) {
    expect(pendingDetails).toContain(`| ${id} |`);
  }
});
