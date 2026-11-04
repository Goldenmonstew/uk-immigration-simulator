/// <reference types="node" />

import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { immigrationSalaryListOccupations } from '../src/index';
import type { ImmigrationSalaryListEntry } from '../src/index';

const snapshot = readFileSync(
  new URL(
    '../../../policy-sources/2025-11-11-immigration-rules-appendix-immigration-salary-list.html',
    import.meta.url,
  ),
  'utf8',
);
const body = snapshot.split('<tbody>')[1].split('</tbody>')[0];
const bodyRows = [...body.matchAll(/<tr\b[^>]*>[\s\S]*?<\/tr>/g)].map(
  (match) => match[0],
);
// The first tbody row contains country subheaders, not an occupation.
const sourceRows = bodyRows.slice(1);

test('ISL preserves every occupation row and four-digit SOC code in source order', () => {
  const entries = immigrationSalaryListOccupations.entries;

  expect([...snapshot.matchAll(/<table>/g)]).toHaveLength(1);
  expect(bodyRows).toHaveLength(26);
  expect(entries).toHaveLength(sourceRows.length);
  for (const [index, entry] of entries.entries()) {
    expect(entry.socCode).toMatch(/^\d{4}$/);
    expect(sourceRows[index]).toContain(`<td>${entry.socCode} `);
  }
});

test.each([
  {
    socCode: '1212',
    title: 'Managers and proprietors in forestry, fishing and related services',
    criteria: 'only “fishing boat masters”',
    nations: 'Scotland',
    removalDate: '31 December 2026',
  },
  {
    socCode: '3414',
    title: 'Dancers and choreographers',
    criteria:
      'only skilled classical ballet dancers or skilled contemporary dancers who meet the standard required by internationally recognised UK ballet or contemporary dance companies. The company must be endorsed as being internationally recognised by a UK industry body such as the Arts Councils (of England, Scotland or Wales).',
    nations: 'England, Scotland, Wales and Northern Ireland',
    removalDate: '31 December 2026',
  },
  {
    socCode: '6135',
    title: 'Care workers and home carers',
    criteria:
      'all jobs, except jobs with a working location in England are only eligible in this SOC 2020 occupation code where the sponsor holds registration with the Care Quality Commission and is currently carrying on a regulated activity. Eligibility for Skilled Worker applicants to be sponsored in this SOC 2020 occupation code is restricted, as set out in SW 6.1B of Appendix Skilled Worker. Private households or individuals (other than sole traders sponsoring someone to work for their business) cannot sponsor Skilled Worker applicants.',
    nations: 'England, Scotland, Wales and Northern Ireland',
    removalDate: '22 July 2028',
  },
] satisfies ImmigrationSalaryListEntry[])(
  'ISL SOC $socCode matches the snapshot title, criteria, nations and removal date',
  (expected) => {
    const sourceRow = sourceRows.find((row) =>
      row.includes(`<td>${expected.socCode} `),
    )!;
    const cells = [...sourceRow.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/g)].map(
      (match) =>
        match[1]
          .replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim(),
    );

    expect(cells[0]).toBe(
      `${expected.socCode} ${expected.title} – ${expected.criteria}`,
    );
    expect(cells.slice(1, -1)).toEqual(
      expected.nations === 'Scotland'
        ? ['-', 'Yes', '-', '-']
        : ['Yes', 'Yes', 'Yes', 'Yes'],
    );
    expect(cells.at(-1)).toBe(expected.removalDate);
    expect(
      immigrationSalaryListOccupations.entries.find(
        (entry) => entry.socCode === expected.socCode,
      ),
    ).toEqual(expected);
  },
);
