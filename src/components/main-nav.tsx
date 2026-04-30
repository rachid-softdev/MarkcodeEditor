'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-switcher';

export function MainNav() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
          <Link href="/" className="text-lg font-bold">
            MarkFlow
          </Link>
          <Button variant="ghost">
            <Link href="/">Nouveau document</Link>
          </Button>
          <Button variant="ghost">
            <Link href="/open">Ouvrir un fichier</Link>
          </Button>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}