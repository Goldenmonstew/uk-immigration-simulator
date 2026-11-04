import { en } from './en';
import { zhCN } from './zh-CN';

export type TranslationKey = keyof typeof zhCN;
export function t(
  key: TranslationKey,
  locale: 'zh-CN' | 'en' = 'zh-CN',
): string {
  return (locale === 'en' ? en[key] : undefined) ?? zhCN[key];
}
