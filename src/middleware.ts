import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow NextAuth API routes and static auth assets through untouched.
  if (pathname.startsWith('/api/auth') || pathname.includes('favicon')) {
    return intlMiddleware(req);
  }

  // Protect admin pages (the locale prefix is added by next-intl, so an admin
  // URL looks like /en/admin, /tr/admin or /ru/admin — plus the bare /admin
  // redirect handled by next-intl). We intercept any /admin segment except
  // the login page itself.
  const adminMatch = pathname.match(/\/(?:[a-z]{2}\/)?admin(\/|$)/);
  const isLoginPage = /\/admin\/login(?:\/|$|\?)/.test(pathname);
  if (adminMatch && !isLoginPage) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token) {
      // Preserve the intended locale when redirecting to login.
      const locale = pathname.split('/')[1];
      const validLocale = ['en', 'tr', 'ru'].includes(locale) ? locale : 'en';
      const loginUrl = new URL(`/${validLocale}/admin/login`, req.url);
      return NextResponse.redirect(loginUrl);
    }
    // Authenticated — continue with normal next-intl handling so the locale
    // prefix is applied/validated.
    return intlMiddleware(req);
  }

  return intlMiddleware(req);
}

export const config = {
  // Run middleware on everything except API routes, Next internals, static
  // files and the admin login assets. next-intl handles locale routing and
  // the admin guard above handles protection.
  matcher: ['/((?!api/admin|api/contact|api/site-settings|api/auth|_next|_vercel|.*\\..*).*)'],
};
