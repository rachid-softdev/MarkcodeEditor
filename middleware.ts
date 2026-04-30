import createMiddleware from 'next-intl/middleware';
import { withAuth } from 'next-auth/middleware';

const locales = ['en', 'fr', 'es'] as const;

const localesMiddleware = createMiddleware({
  locales,
  defaultLocale: 'fr',
  localePrefix: 'as-needed',
});

const authMiddleware = withAuth({
  pages: {
    signIn: '/login',
  },
});

export default function middleware(req: any) {
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isProtectedPage = pathname.startsWith('/documents') || 
                     pathname.startsWith('/settings') ||
                     pathname.startsWith('/api/auth');

  if (isProtectedPage && !req.nextauth_token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return Response.redirect(loginUrl);
  }

  if (isAuthPage && req.nextauth_token) {
    return Response.redirect(new URL('/documents', req.url));
  }

  return localesMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};