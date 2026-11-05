import type { Locale } from '@uk-immigration/engine';
import type { DisplayName } from '@uk-immigration/policy-data';

export { routeNames, routeGroupNames } from '@uk-immigration/policy-data';

export function routeLabel(
  name: DisplayName,
  locale: Locale,
  compact = false,
): string {
  if (locale === 'en') return name.en;
  const suffix = ` · ${name.en}`;
  if (compact) return name['zh-CN'].replace(suffix, '');
  return name['zh-CN'].endsWith(suffix)
    ? name['zh-CN']
    : `${name['zh-CN']}${suffix}`;
}
