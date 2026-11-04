import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import { WhatIfView } from '../components/whatif-lab';
import { t } from '../i18n';
import { createDraft } from '../lib/questionnaire';

test('no completed draft renders a questionnaire link instead of controls', () => {
  for (const draft of [undefined, createDraft()]) {
    const html = renderToStaticMarkup(<WhatIfView draft={draft} />);
    expect(html).toContain(t('whatif.empty'));
    expect(html).toContain('href="/simulate"');
    expect(html).not.toContain('type="range"');
    expect(html).not.toContain(t('whatif.becameMet'));
  }
});

test('a screening short circuit renders the unsupported state and return link', () => {
  const draft = createDraft();
  draft.completed = true;
  draft.screening.criminality = 'yes';
  const html = renderToStaticMarkup(<WhatIfView draft={draft} />);
  expect(html).toContain(t('whatif.unsupported'));
  expect(html).toContain('href="/result"');
  expect(html).not.toContain('type="range"');
});
