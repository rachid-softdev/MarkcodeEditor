export const defaultLocale = 'fr' as const;
export const locales = ['en', 'fr', 'es'] as const;

export type Locale = (typeof locales)[number];

export const languageNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
};
