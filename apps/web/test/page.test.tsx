import { ENGINE_VERSION } from '@uk-immigration/engine';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import Home from '../app/page';

test('renders the workspace engine version on the homepage', () => {
  expect(renderToStaticMarkup(<Home />)).toContain(
    `引擎版本：${ENGINE_VERSION}`,
  );
});
