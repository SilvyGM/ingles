import {
  SESSION_COOKIE,
  ROLE_COOKIE,
  hasSessionCookie,
  setSessionCookie,
  getSessionRole,
  clearSessionCookie,
} from '@/lib/auth';

function setCookieRaw(value: string) {
  clearAllCookies();

  if (!value.trim()) {
    return;
  }

  for (const item of value.split(';')) {
    const trimmed = item.trim();
    if (trimmed) {
      document.cookie = `${trimmed}; Path=/`;
    }
  }
}

function clearAllCookies() {
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0]?.trim();
    if (name) {
      document.cookie = `${name}=; Path=/; Max-Age=0`;
    }
  }
}

describe('auth', () => {
  beforeEach(() => {
    clearAllCookies();
  });

  afterEach(() => {
    clearAllCookies();
  });

  describe('hasSessionCookie', () => {
    it('debería retornar true cuando la cookie de sesión existe con valor 1', () => {
      setCookieRaw(`${SESSION_COOKIE}=1; ${ROLE_COOKIE}=admin`);
      expect(hasSessionCookie()).toBe(true);
    });

    it('debería retornar false cuando la cookie de sesión no existe', () => {
      setCookieRaw('');
      expect(hasSessionCookie()).toBe(false);
    });

    it('debería retornar false cuando la cookie tiene valor diferente a 1', () => {
      setCookieRaw(`${SESSION_COOKIE}=0`);
      expect(hasSessionCookie()).toBe(false);
    });
  });

  describe('getSessionRole', () => {
    it('debería retornar "admin" cuando la cookie de rol es admin', () => {
      setCookieRaw(`${ROLE_COOKIE}=admin`);
      expect(getSessionRole()).toBe('admin');
    });

    it('debería retornar "learner" cuando la cookie de rol es learner', () => {
      setCookieRaw(`${ROLE_COOKIE}=learner`);
      expect(getSessionRole()).toBe('learner');
    });

    it('debería retornar null cuando no existe la cookie de rol', () => {
      setCookieRaw('');
      expect(getSessionRole()).toBeNull();
    });

    it('debería retornar null para un rol desconocido', () => {
      setCookieRaw(`${ROLE_COOKIE}=superuser`);
      expect(getSessionRole()).toBeNull();
    });
  });

  describe('setSessionCookie', () => {
    it('debería escribir en document.cookie sin lanzar errores', () => {
      setSessionCookie('admin');

      expect(document.cookie).toContain(`${SESSION_COOKIE}=1`);
      expect(document.cookie).toContain(`${ROLE_COOKIE}=admin`);
    });
  });

  describe('clearSessionCookie', () => {
    it('debería limpiar las cookies con Max-Age=0', () => {
      setSessionCookie('learner');
      expect(document.cookie).toContain(`${SESSION_COOKIE}=1`);
      expect(document.cookie).toContain(`${ROLE_COOKIE}=learner`);

      clearSessionCookie();

      expect(document.cookie).not.toContain(`${SESSION_COOKIE}=1`);
      expect(document.cookie).not.toContain(`${ROLE_COOKIE}=learner`);
    });
  });

  describe('constantes', () => {
    it('SESSION_COOKIE debe ser pl_session', () => {
      expect(SESSION_COOKIE).toBe('pl_session');
    });

    it('ROLE_COOKIE debe ser pl_role', () => {
      expect(ROLE_COOKIE).toBe('pl_role');
    });
  });
});
