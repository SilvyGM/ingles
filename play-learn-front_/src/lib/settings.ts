export type AppSettings = {
  baseUrl: string;
  token: string;
  email: string;
};

const STORAGE_KEY = 'playlearn_settings_v1';

export const DEFAULT_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api';

export function getDefaultSettings(): AppSettings {
  return {
    baseUrl: DEFAULT_BASE_URL,
    token: '',
    email: '',
  };
}

export function readSettings(): AppSettings {
  if (typeof window === 'undefined') {
    return getDefaultSettings();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return getDefaultSettings();
    }

    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return {
      baseUrl: parsed.baseUrl?.trim() || DEFAULT_BASE_URL,
      token: parsed.token?.trim() || '',
      email: parsed.email?.trim() || '',
    };
  } catch {
    return getDefaultSettings();
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function clearSettings(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
