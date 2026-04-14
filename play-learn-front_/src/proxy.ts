import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROLE_COOKIE, SESSION_COOKIE } from '@/lib/auth';

const protectedRoutes = ['/dashboard', '/crud', '/session-completion'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.get(SESSION_COOKIE)?.value === '1';
  const role = request.cookies.get(ROLE_COOKIE)?.value;

  const needsSession = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (needsSession && !hasSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (needsSession && role !== 'admin') {
    return NextResponse.redirect(new URL('/learn', request.url));
  }

  if (pathname === '/login' && hasSession) {
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.redirect(new URL('/learn', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/dashboard/:path*',
    '/crud/:path*',
    '/session-completion/:path*',
  ],
};
