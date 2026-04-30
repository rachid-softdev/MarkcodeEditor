'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { initI18n } from '@/lib/i18n';

interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const { i18n } = useTranslation();

  useEffect(() => {
    initI18n();
  }, []);

  return <>{children}</>;
}