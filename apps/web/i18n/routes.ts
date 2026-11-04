import type { Locale } from '@uk-immigration/engine';
import type { DisplayName } from '@uk-immigration/policy-data';

export { routeNames, routeGroupNames } from '@uk-immigration/policy-data';

export function routeLabel(name: DisplayName, locale: Locale): string {
  if (locale === 'en') return name.en;
  const suffix = ` · ${name.en}`;
  return name['zh-CN'].endsWith(suffix)
    ? name['zh-CN']
    : `${name['zh-CN']}${suffix}`;
}
