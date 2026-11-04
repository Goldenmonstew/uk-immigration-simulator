/// <reference types="node" />

import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { goingRates, nationalPayScaleOccupations } from '../src/index';
import type { GoingRate } from '../src/index';

const snapshot = readFileSync(
  new URL(
    '../../../policy-sources/2025-11-11-immigration-rules-appendix-skilled-occupations.html',
    import.meta.url,
  ),
  'utf8',
);
const rateTables: GoingRate['table'][] = ['1', '1a', '2', '2aa', '2a', '2b'];

function snapshotRows(table: string): string[] {
  const section = snapshot.slice(snapshot.indexOf(`id="table-${table}-`));
  const body = section.split('<tbody>')[1].split('</tbody>')[0];
  return [...body.matchAll(/<tr\b[^>]*>[\s\S]*?<\/tr>/g)].map(
    (match) => match[0],
  );
}

test.each(rateTables)(
  'Table %s preserves the snapshot row count and unique SOC 2020 codes',
  (table) => {
    const rows = goingRates.rows.filter((row) => row.table === table);
    const sourceRows = snapshotRows(table);

    expect(sourceRows.length).toBeGreaterThan(0);
    expect(rows).toHaveLength(sourceRows.length);
    expect(new Set(rows.map((row) => row.socCode)).size).toBe(rows.length);
    for (const row of rows) {
      expect(row.socCode).toMatch(/^\d{4}$/);
      expect(row.title).not.toBe('');
      expect(Number.isInteger(row.goingRate)).toBe(true);
      expect(row.goingRate).toBeGreaterThan(0);
    }
  },
);

test.each([
  {
    table: '1',
    socCode: '2136',
    title: 'IT quality and testing professionals',
    goingRate: 41200,
  },
  {
    table: '2',
    socCode: '2136',
    title: 'IT quality and testing professionals',
    goingRate: 34500,
  },
  {
    table: '1a',
    socCode: '3111',
    title: 'Laboratory technicians',
    goingRate: 33400,
  },
] satisfies GoingRate[])(
  'Table $table SOC $socCode matches the snapshot name and full annual rate',
  (expected) => {
    const sourceRow = snapshotRows(expected.table).find((row) =>
      row.includes(`<td>${expected.socCode} `),
    )!;
    const cells = [...sourceRow.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/g)].map(
      (match) => match[1],
    );
    const rateColumn = expected.table === '2' ? 3 : 2;

    expect(cells[0]).toBe(`${expected.socCode} ${expected.title}`);
    expect(cells[rateColumn].split('<br>')[0]).toBe(
      `£${expected.goingRate.toLocaleString('en-GB')}`,
    );
    expect(
      goingRates.rows.find(
        (row) =>
          row.table === expected.table && row.socCode === expected.socCode,
      ),
    ).toEqual(expected);
  },
);

test('Table 3 preserves all source rows, including region-specific SOC repeats', () => {
  const rows = nationalPayScaleOccupations.rows;
  const sourceRows = snapshotRows('3');

  expect(sourceRows.length).toBeGreaterThan(0);
  expect(rows).toHaveLength(sourceRows.length);
  expect(new Set(rows.map((row) => `${row.socCode} ${row.title}`)).size).toBe(
    rows.length,
  );
  for (const [index, row] of rows.entries()) {
    expect(row.socCode).toMatch(/^\d{4}$/);
    expect(sourceRows[index]).toContain(`<td>${row.socCode} ${row.title}</td>`);
    expect(row).not.toHaveProperty('goingRate');
  }
  // The source lists these codes separately for each of the four UK nations.
  for (const socCode of ['2211', '2253', '2312']) {
    expect(rows.filter((row) => row.socCode === socCode)).toHaveLength(4);
  }
});

test.each([
  {
    table: '1',
    socCode: '2119',
    title: 'Natural and social science professionals not elsewhere classified',
  },
  { table: '1a', socCode: '6135', title: 'Care workers and home carers' },
  {
    table: '2aa',
    socCode: '9119',
    title:
      'Fishing and other elementary agriculture occupations not elsewhere classified',
  },
])(
  'Table $table SOC $socCode keeps eligibility notes out of the occupation title',
  (expected) => {
    const sourceRow = snapshotRows(expected.table).find((row) =>
      row.includes(`<td>${expected.socCode} `),
    )!;

    expect(sourceRow).toContain(`<td>${expected.socCode} ${expected.title}`);
    expect(
      goingRates.rows.find(
        (row) =>
          row.table === expected.table && row.socCode === expected.socCode,
      ),
    ).toMatchObject(expected);
  },
);

test('Table 3 SOC 2231 follows Table 4 instead of inventing a numeric rate', () => {
  const sourceRow = snapshotRows('3').find((row) => row.includes('<td>2231 '))!;

  expect(sourceRow).toContain('<td>2231 Midwifery nurses</td>');
  expect(sourceRow).toContain('<td>See relevant pay band in Table 4</td>');
  expect(
    nationalPayScaleOccupations.rows.find((row) => row.socCode === '2231'),
  ).toEqual({
    socCode: '2231',
    title: 'Midwifery nurses',
  });
  expect(goingRates.rows.some((row) => row.socCode === '2231')).toBe(false);
});
