import { expect, test } from 'vitest';
import { punct } from '../i18n/punctuation';

test.each([
  ['zh-CN', 'Label：PD-012、PD-013（2）'],
  ['en', 'Label: PD-012, PD-013 (2)'],
] as const)('formats punctuation for %s', (locale, expected) => {
  const p = punct(locale);
  expect(
    `Label${p.colon}${['PD-012', 'PD-013'].join(p.list)}${p.openParen}2${p.closeParen}`,
  ).toBe(expected);
});
