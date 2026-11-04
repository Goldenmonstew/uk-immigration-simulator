/// <reference types="node" />

import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import * as fixtureData from '../fixtures/index';
import * as policyData from '../src/index';
import type { SourceRef } from '../src/types';

function collectSourceRefs(value: unknown): SourceRef[] {
  if (value === null || typeof value !== 'object') return [];

  const refs: SourceRef[] = [];
  if ('srcId' in value && 'locator' in value) {
    refs.push(value as SourceRef);
  }
  for (const child of Object.values(value)) {
    refs.push(...collectSourceRefs(child));
  }
  return refs;
}

test('exported policy data and fixtures reference registered primary sources', () => {
  const register = readFileSync(
    new URL('../../../docs/SOURCES.md', import.meta.url),
    'utf8',
  );
  const primarySources = register.split('## 一级来源')[1].split('\n## ')[0];
  const registeredIds = new Set(
    [...primarySources.matchAll(/^\|\s*(SRC-\d+)\s*\|/gm)].map(
      (match) => match[1],
    ),
  );
  const refs = collectSourceRefs([policyData, fixtureData]);

  expect(refs.length).toBeGreaterThan(0);
  for (const ref of refs) {
    expect(
      registeredIds.has(ref.srcId),
      `Unregistered source: ${ref.srcId}`,
    ).toBe(true);
    expect(typeof ref.locator).toBe('string');
    expect(ref.locator.trim(), `Empty locator for ${ref.srcId}`).not.toBe('');
  }
});
