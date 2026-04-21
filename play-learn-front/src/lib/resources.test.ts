import {
  RESOURCE_CONFIGS,
  RESOURCE_MAP,
  isResourceKey,
  pickWritableFields,
} from '@/lib/resources';

describe('resources', () => {
  describe('RESOURCE_CONFIGS', () => {
    it('debería tener 9 configuraciones de recursos', () => {
      expect(RESOURCE_CONFIGS).toHaveLength(9);
    });

    it('debería incluir los recursos principales', () => {
      const keys = RESOURCE_CONFIGS.map((r) => r.key);
      expect(keys).toContain('users');
      expect(keys).toContain('topics');
      expect(keys).toContain('skills');
      expect(keys).toContain('questions');
      expect(keys).toContain('conversation-sessions');
      expect(keys).toContain('conversation-feedback');
      expect(keys).toContain('generated-tests');
      expect(keys).toContain('test-answers');
      expect(keys).toContain('skill-progress');
    });

    it('cada recurso debe tener key, label, description, writableFields y defaultPayload', () => {
      for (const config of RESOURCE_CONFIGS) {
        expect(config.key).toBeTruthy();
        expect(config.label).toBeTruthy();
        expect(config.description).toBeTruthy();
        expect(Array.isArray(config.writableFields)).toBe(true);
        expect(config.writableFields.length).toBeGreaterThan(0);
        expect(typeof config.defaultPayload).toBe('object');
      }
    });
  });

  describe('RESOURCE_MAP', () => {
    it('debería indexar cada recurso por su key', () => {
      expect(RESOURCE_MAP['users'].label).toBe('Usuarios');
      expect(RESOURCE_MAP['topics'].label).toBe('Temas');
      expect(RESOURCE_MAP['skills'].label).toBe('Skills');
    });
  });

  describe('isResourceKey', () => {
    it('debería retornar true para claves válidas', () => {
      expect(isResourceKey('users')).toBe(true);
      expect(isResourceKey('topics')).toBe(true);
      expect(isResourceKey('skill-progress')).toBe(true);
    });

    it('debería retornar false para claves inválidas', () => {
      expect(isResourceKey('invalid')).toBe(false);
      expect(isResourceKey('')).toBe(false);
      expect(isResourceKey('admin')).toBe(false);
    });
  });

  describe('pickWritableFields', () => {
    it('debería extraer solo los campos indicados', () => {
      const source = { id: 'uuid', email: 'a@b.com', fullName: 'John', secret: 'hidden' };
      const result = pickWritableFields(source, ['email', 'fullName']);

      expect(result).toEqual({ email: 'a@b.com', fullName: 'John' });
      expect(result).not.toHaveProperty('id');
      expect(result).not.toHaveProperty('secret');
    });

    it('debería ignorar campos que no existen en la fuente', () => {
      const source = { email: 'a@b.com' };
      const result = pickWritableFields(source, ['email', 'nonExistent']);

      expect(result).toEqual({ email: 'a@b.com' });
    });

    it('debería retornar objeto vacío si ningún campo coincide', () => {
      const source = { id: 'uuid' };
      const result = pickWritableFields(source, ['email', 'fullName']);

      expect(result).toEqual({});
    });

    it('debería incluir campos con valor null o false', () => {
      const source = { isActive: false, score: null };
      const result = pickWritableFields(source, ['isActive', 'score']);

      expect(result).toEqual({ isActive: false, score: null });
    });
  });
});
