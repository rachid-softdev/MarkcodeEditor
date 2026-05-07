import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { I18nProvider } from '@/components/providers/i18n-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MarkFlow 📝 - Éditeur Markdown Collaboratif',
  description: 'Éditeur Markdown moderne avec prévisualisation temps réel, collaboration, export PDF/HTML et bien plus.',
  keywords: 'markdown, éditeur, collaboratif, export, PDF, HTML, temps réel',
  authors: [{ name: 'MarkFlow Team' }],
  openGraph: {
    title: 'MarkFlow 📝 - Éditeur Markdown Collaboratif',
    description: 'Créez, éditez et partagez vos documents Markdown avec un éditeur moderne et collaboratif.',
    type: 'website',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <AuthProvider>
          <I18nProvider>
            {children}
            <Toaster richColors position="top-right" />
          </I18nProvider>
        </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}