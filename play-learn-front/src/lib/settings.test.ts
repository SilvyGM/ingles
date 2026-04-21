import { getDefaultSettings, readSettings, saveSettings, clearSettings, DEFAULT_BASE_URL } from '@/lib/settings';

describe('settings', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getDefaultSettings', () => {
    it('debería retornar configuración con baseUrl, token vacío y email vacío', () => {
      const defaults = getDefaultSettings();
      expect(defaults.baseUrl).toBe(DEFAULT_BASE_URL);
      expect(defaults.token).toBe('');
      expect(defaults.email).toBe('');
    });
  });

  describe('readSettings', () => {
    it('debería retornar defaults cuando localStorage está vacío', () => {
      const result = readSettings();
      expect(result).toEqual(getDefaultSettings());
    });

    it('debería leer configuración guardada en localStorage', () => {
      const stored = {
        baseUrl: 'http://my-api.com',
        token: 'my-token',
        email: 'user@example.com',
      };
      localStorage.setItem('playlearn_settings_v1', JSON.stringify(stored));

      const result = readSettings();

      expect(result.baseUrl).toBe('http://my-api.com');
      expect(result.token).toBe('my-token');
      expect(result.email).toBe('user@example.com');
    });

    it('debería usar DEFAULT_BASE_URL si baseUrl guardado está vacío', () => {
      localStorage.setItem(
        'playlearn_settings_v1',
        JSON.stringify({ baseUrl: '', token: 'tok', email: '' }),
      );

      const result = readSettings();

      expect(result.baseUrl).toBe(DEFAULT_BASE_URL);
    });

    it('debería retornar defaults si el JSON guardado es inválido', () => {
      localStorage.setItem('playlearn_settings_v1', '{invalid}');

      const result = readSettings();

      expect(result).toEqual(getDefaultSettings());
    });

    it('debería recortar espacios en token y email', () => {
      localStorage.setItem(
        'playlearn_settings_v1',
        JSON.stringify({ baseUrl: 'http://api.com', token: '  tok  ', email: '  user@x.com  ' }),
      );

      const result = readSettings();

      expect(result.token).toBe('tok');
      expect(result.email).toBe('user@x.com');
    });
  });

  describe('saveSettings', () => {
    it('debería guardar la configuración en localStorage', () => {
      const settings = { baseUrl: 'http://api.com', token: 'abc', email: 'x@x.com' };

      saveSettings(settings);

      const raw = localStorage.getItem('playlearn_settings_v1');
      expect(raw).not.toBeNull();
      expect(JSON.parse(raw!)).toEqual(settings);
    });
  });

  describe('clearSettings', () => {
    it('debería eliminar la clave de localStorage', () => {
      localStorage.setItem('playlearn_settings_v1', '{"baseUrl":"test"}');

      clearSettings();

      expect(localStorage.getItem('playlearn_settings_v1')).toBeNull();
    });
  });
});
