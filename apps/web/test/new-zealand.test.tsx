import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import { evaluateNewZealand } from '@uk-immigration/engine';
import NewZealandPage from '../app/new-zealand/page';
import { PilotResult } from '../app/pilot/pilot-result';
import Home from '../app/page';
import { t } from '../i18n';
import { LocaleContext } from '../i18n/locale';
import { emptyNzForm, nzRequest, validateNzForm } from '../lib/new-zealand';
import type { NzForm } from '../lib/new-zealand';
import { sourceUrls } from '../lib/sources';

const render = (node: React.ReactNode, locale: 'zh-CN' | 'en') =>
  renderToStaticMarkup(
    <LocaleContext value={{ locale, setLocale: () => {} }}>
      {node}
    </LocaleContext>,
  );

const filled: NzForm = {
  ...emptyNzForm('2026-11-21'),
  dateOfBirth: '1990-05-01',
  firstArrival: '2019-01-10',
  residentGranted: '2021-03-01',
  trips: [{ departed: '2022-06-10', returned: '2022-07-10' }],
};

test.each(['zh-CN', 'en'] as const)('the form renders in %s', (locale) => {
  const html = render(<NewZealandPage />, locale);
  for (const key of [
    'nz.title',
    'nz.basics',
    'nz.residentGranted',
    'nz.category',
    'nz.prvGranted',
    'nz.trips',
    'nz.submit',
  ] as const)
    expect(html).toContain(t(key, locale));
});

test('home links to both pilots', () => {
  const html = render(<Home />, 'zh-CN');
  expect(html).toContain('href="/australia"');
  expect(html).toContain('href="/new-zealand"');
});

test('validation marks missing and out-of-order dates', () => {
  expect(
    validateNzForm({
      ...emptyNzForm('2026-11-21'),
      firstArrival: '2020-01-01',
      residentGranted: '2022-01-01',
      prvGranted: '2021-12-31',
      trips: [{ departed: '2019-12-01', returned: '2019-11-01' }],
    }),
  ).toEqual({
    'nz-date-of-birth': 'nz.error.date',
    'nz-prv-granted': 'nz.error.prvOrder',
    'nz-trip-0-departed': 'nz.error.beforeArrival',
    'nz-trip-0-returned': 'nz.error.order',
  });
  expect(validateNzForm(filled)).toEqual({});
  expect(
    validateNzForm({ ...filled, dateOfBirth: '2019-02-01' })[
      'nz-first-arrival'
    ],
  ).toBe('nz.error.beforeBirth');
});

test('the request leaves out a blank PRV date', () => {
  expect(nzRequest(filled, 'en')).not.toHaveProperty('permanentResidentVisa');
  expect(nzRequest(filled, 'en')).not.toHaveProperty('travelConditionsEnd');
  expect(
    nzRequest(
      {
        ...filled,
        travelConditionsEnd: '2023-02-28',
        conditionsOutstanding: true,
      },
      'en',
    ),
  ).toMatchObject({
    travelConditionsEnd: '2023-02-28',
    conditionsOutstanding: true,
  });
  expect(
    nzRequest({ ...filled, prvGranted: '2023-04-01' }, 'en')
      .permanentResidentVisa,
  ).toBe('2023-04-01');
});

test.each(['zh-CN', 'en'] as const)('results render in %s', (locale) => {
  const result = evaluateNewZealand(nzRequest(filled, locale));
  const html = render(<PilotResult result={result} />, locale);
  expect(html.match(/data-pathway=/g)).toHaveLength(3);
  expect(html).toContain('data-pathway="NZ-PRV" data-status="MET"');
  expect(html).toContain('data-pathway="NZ-CITIZENSHIP" data-status="MET"');
  expect(html).toContain(`href="${sourceUrls['SRC-072']}"`);
  expect(html).toContain('PD-087');
});
