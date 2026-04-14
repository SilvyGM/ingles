import type { AppSettings } from './settings';

type ErrorPayload = {
  message?: string | string[];
  error?: string;
};

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/$/, '');
}

export async function apiFetch<T>(
  settings: AppSettings,
  endpoint: string,
  init?: RequestInit,
): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');

  if (settings.token.trim()) {
    headers.set('Authorization', `Bearer ${settings.token.trim()}`);
  }

  const response = await fetch(`${normalizeBaseUrl(settings.baseUrl)}${endpoint}`, {
    ...init,
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    let text = await response.text();

    try {
      const payload = JSON.parse(text) as ErrorPayload;
      const message = Array.isArray(payload.message)
        ? payload.message.join(', ')
        : payload.message;
      text = message || payload.error || text;
    } catch {
      // Keep raw text if response is not JSON.
    }

    if (response.status === 401) {
      throw new Error('Sesion expirada o token invalido. Vuelve a iniciar sesion.');
    }

    if (response.status === 403) {
      throw new Error('No tienes permisos para esta operacion.');
    }

    throw new Error(text || `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}
