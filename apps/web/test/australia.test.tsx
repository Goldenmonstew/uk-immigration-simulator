import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import { evaluateAustralia } from '@uk-immigration/engine';
import AustraliaPage from '../app/australia/page';
import { PilotResult } from '../app/pilot/pilot-result';
import Home from '../app/page';
import { t } from '../i18n';
import { LocaleContext } from '../i18n/locale';
import { auRequest, emptyAuForm, validateAuForm } from '../lib/australia';
import type { AuForm } from '../lib/australia';
import { sourceUrls } from '../lib/sources';

const render = (node: React.ReactNode, locale: 'zh-CN' | 'en') =>
  renderToStaticMarkup(
    <LocaleContext value={{ locale, setLocale: () => {} }}>
      {node}
    </LocaleContext>,
  );

const filled: AuForm = {
  ...emptyAuForm('2026-11-21'),
  dateOfBirth: '1990-05-01',
  firstArrival: '2021-02-01',
  visas: [
    { subclass: '482', from: '2021-02-01', to: '2023-08-31' },
    { subclass: '186', from: '2023-09-01', to: '' },
  ],
  trips: [{ departed: '2025-01-10', returned: '2025-02-10' }],
};

test.each(['zh-CN', 'en'] as const)('the form renders in %s', (locale) => {
  const html = render(<AustraliaPage />, locale);
  for (const key of [
    'au.title',
    'au.basics',
    'au.simulationDate',
    'au.visas',
    'au.trips',
    'au.partner',
    'au.submit',
  ] as const)
    expect(html).toContain(t(key, locale));
});

test('home links to the Australia pilot', () => {
  expect(render(<Home />, 'zh-CN')).toContain('href="/australia"');
});

test('validation marks missing, out-of-order and conflicting dates', () => {
  const errors = validateAuForm({
    ...emptyAuForm('2026-11-21'),
    visas: [{ subclass: '482', from: '2025-01-01', to: '2024-12-31' }],
    trips: [{ departed: '2025-03-01', returned: '' }],
  });
  expect(errors).toEqual({
    'au-date-of-birth': 'au.error.date',
    'au-visa-0-to': 'au.error.order',
    'au-trip-0-departed': 'au.error.beforeArrival',
    'au-trip-0-returned': 'au.error.date',
  });
  expect(validateAuForm(filled)).toEqual({});
  expect(
    validateAuForm({ ...filled, dateOfBirth: '2021-03-01' })[
      'au-first-arrival'
    ],
  ).toBe('au.error.beforeBirth');
  // Overlapping visas are accepted: the engine ends the earlier one (s82).
  expect(
    validateAuForm({
      ...filled,
      visas: [
        { subclass: '482', from: '2021-02-01', to: '' },
        { subclass: '186', from: '2023-09-01', to: '' },
      ],
    }),
  ).toEqual({});
  // An offshore partner applicant who has not arrived can still submit.
  expect(
    validateAuForm({
      ...emptyAuForm('2026-11-21'),
      dateOfBirth: '1990-05-01',
      visas: [],
      partner: true,
      partnerLodged: '2025-03-10',
      partnerStream: 'offshore',
    }),
  ).toEqual({});
});

test('the request leaves out blank end dates and an unticked partner', () => {
  const request = auRequest(filled, 'en');
  expect(request.visas[1]).toEqual({ subclass: '186', from: '2023-09-01' });
  expect(auRequest({ ...filled, firstArrival: '' }, 'en')).not.toHaveProperty(
    'firstArrival',
  );
  expect(request.partnerApplication).toBeUndefined();
  expect(
    auRequest({ ...filled, partner: true, partnerLodged: '2025-03-10' }, 'en')
      .partnerApplication,
  ).toEqual({
    lodged: '2025-03-10',
    stream: 'onshore',
    longTermRelationship: false,
  });
});

test.each(['zh-CN', 'en'] as const)('results render in %s', (locale) => {
  const result = evaluateAustralia(auRequest(filled, locale));
  const html = render(<PilotResult result={result} />, locale);
  expect(html).toContain(t('pilot.resultTitle', locale));
  expect(html.match(/data-pathway=/g)).toHaveLength(5);
  expect(html).toContain('data-pathway="AU-CITIZENSHIP" data-status="MET"');
  expect(html).toContain(t('pilot.status.MET', locale));
  expect(html).toContain(`href="${sourceUrls['SRC-061']}"`);
  expect(html).toContain('PD-084');
});
