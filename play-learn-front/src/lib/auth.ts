export const SESSION_COOKIE = 'pl_session';
export const ROLE_COOKIE = 'pl_role';

export type SessionRole = 'admin' | 'learner';

export function hasSessionCookie(): boolean {
  if (typeof document === 'undefined') {
    return false;
  }

  return document.cookie.split('; ').some((item) => item.startsWith(`${SESSION_COOKIE}=1`));
}

export function setSessionCookie(role: SessionRole): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${SESSION_COOKIE}=1; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 12}`;
  document.cookie = `${ROLE_COOKIE}=${role}; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 12}`;
}

export function getSessionRole(): SessionRole | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const roleCookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${ROLE_COOKIE}=`));

  const role = roleCookie?.split('=')[1];
  if (role === 'admin' || role === 'learner') {
    return role;
  }

  return null;
}

export function clearSessionCookie(): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
  document.cookie = `${ROLE_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
