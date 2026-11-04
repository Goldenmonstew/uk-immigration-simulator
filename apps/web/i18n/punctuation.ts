import type { Locale } from '@uk-immigration/engine';

export function punct(locale: Locale) {
  return locale === 'zh-CN'
    ? { colon: '：', list: '、', openParen: '（', closeParen: '）' }
    : { colon: ': ', list: ', ', openParen: ' (', closeParen: ')' };
}
