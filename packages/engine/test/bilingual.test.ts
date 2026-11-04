import { fixtures } from '@uk-immigration/policy-data/fixtures';
import { expect, test } from 'vitest';
import { evaluate } from '../src/evaluate';

// Recorded before the English texts were added: the default locale's output
// must stay byte-for-byte the same.
test.each(fixtures.map((f) => [f.id, f]))(
  '%s default-locale output is unchanged',
  (_, fixture) => {
    expect(
      JSON.stringify(evaluate(fixture.request), null, 2),
    ).toMatchSnapshot();
  },
);
