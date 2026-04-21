import { proxy } from '@/proxy';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE, ROLE_COOKIE } from '@/lib/auth';

jest.mock('next/server', () => {
  return {
    NextResponse: {
      redirect: jest.fn((url: URL) => ({ redirected: true, url: url.toString() })),
      next: jest.fn(() => ({ next: true })),
    },
  };
});

function makeRequest(pathname: string, cookies: Record<string, string> = {}): NextRequest {
  const url = `http://localhost${pathname}`;

  return {
    nextUrl: new URL(url),
    url,
    cookies: {
      get: (name: string) => (cookies[name] ? { value: cookies[name] } : undefined),
    },
  } as unknown as NextRequest;
}

describe('proxy middleware', () => {
  afterEach(() => jest.clearAllMocks());

  describe('rutas protegidas sin sesión', () => {
    it('debería redirigir /dashboard a /login sin sesión', () => {
      proxy(makeRequest('/dashboard'));
      expect(NextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({ pathname: '/login' }),
      );
    });

    it('debería redirigir /crud/users a /login sin sesión', () => {
      proxy(makeRequest('/crud/users'));
      expect(NextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({ pathname: '/login' }),
      );
    });

    it('debería redirigir /session-completion a /login sin sesión', () => {
      proxy(makeRequest('/session-completion'));
      expect(NextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({ pathname: '/login' }),
      );
    });
  });

  describe('rutas protegidas con sesión pero sin rol admin', () => {
    const learnerCookies = { [SESSION_COOKIE]: '1', [ROLE_COOKIE]: 'learner' };

    it('debería redirigir /dashboard a /learn si el rol es learner', () => {
      proxy(makeRequest('/dashboard', learnerCookies));
      expect(NextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({ pathname: '/learn' }),
      );
    });
  });

  describe('rutas protegidas con sesión admin', () => {
    const adminCookies = { [SESSION_COOKIE]: '1', [ROLE_COOKIE]: 'admin' };

    it('debería pasar /dashboard si el rol es admin', () => {
      proxy(makeRequest('/dashboard', adminCookies));
      expect(NextResponse.next).toHaveBeenCalled();
    });

    it('debería pasar /crud/users si el rol es admin', () => {
      proxy(makeRequest('/crud/users', adminCookies));
      expect(NextResponse.next).toHaveBeenCalled();
    });
  });

  describe('/login con sesión activa', () => {
    it('debería redirigir admin a /dashboard', () => {
      const adminCookies = { [SESSION_COOKIE]: '1', [ROLE_COOKIE]: 'admin' };
      proxy(makeRequest('/login', adminCookies));
      expect(NextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({ pathname: '/dashboard' }),
      );
    });

    it('debería redirigir learner a /learn', () => {
      const learnerCookies = { [SESSION_COOKIE]: '1', [ROLE_COOKIE]: 'learner' };
      proxy(makeRequest('/login', learnerCookies));
      expect(NextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({ pathname: '/learn' }),
      );
    });
  });

  describe('rutas no protegidas', () => {
    it('debería pasar /learn sin restricciones', () => {
      proxy(makeRequest('/learn'));
      expect(NextResponse.next).toHaveBeenCalled();
    });
  });
});
