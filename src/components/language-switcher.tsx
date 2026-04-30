'use client';

import { useRouter, usePathname } from 'next/navigation';
import { locales } from '@/config/i18n';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const getLocale = () => {
    const segments = pathname.split('/');
    const potentialLocale = segments[1];
    if (locales.includes(potentialLocale as any)) {
      return potentialLocale;
    }
    return 'fr';
  };

  const currentLocale = getLocale();

  const handleChange = (newLocale: string) => {
    const segments = pathname.split('/');
    if (locales.includes(segments[0] as any)) {
      segments[0] = newLocale;
      router.push(segments.join('/'));
    } else {
      router.push(`/${newLocale}${pathname}`);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Select value={currentLocale} onValueChange={handleChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {locales.map((lang) => (
            <SelectItem key={lang} value={lang}>
              {lang.toUpperCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}