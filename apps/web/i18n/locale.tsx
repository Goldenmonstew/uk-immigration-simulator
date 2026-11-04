'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { t, type TranslationKey } from './index';

type Locale = 'zh-CN' | 'en';
const localeKey = 'uk-immigration-locale';

export const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
}>({ locale: 'zh-CN', setLocale: () => {} });

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, updateLocale] = useState<Locale>('zh-CN');
  useEffect(() => {
    try {
      if (localStorage.getItem(localeKey) === 'en') updateLocale('en');
    } catch {
      // Keep the default when storage is unavailable.
    }
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  const setLocale = (next: Locale) => {
    updateLocale(next);
    try {
      localStorage.setItem(localeKey, next);
    } catch {
      // The selected language still applies for this page session.
    }
  };
  return (
    <LocaleContext value={{ locale, setLocale }}>{children}</LocaleContext>
  );
}

export function useTranslation() {
  const context = useContext(LocaleContext);
  return {
    ...context,
    t: (key: TranslationKey) => t(key, context.locale),
  };
}
