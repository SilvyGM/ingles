import { toPrettyJson, parseJsonObject } from '@/lib/json';

describe('toPrettyJson', () => {
  it('debería serializar un objeto con indentación de 2 espacios', () => {
    const result = toPrettyJson({ name: 'test', value: 42 });
    expect(result).toBe('{\n  "name": "test",\n  "value": 42\n}');
  });

  it('debería serializar un array', () => {
    const result = toPrettyJson([1, 2, 3]);
    expect(result).toBe('[\n  1,\n  2,\n  3\n]');
  });

  it('debería serializar null', () => {
    expect(toPrettyJson(null)).toBe('null');
  });

  it('debería serializar valores primitivos', () => {
    expect(toPrettyJson('hello')).toBe('"hello"');
    expect(toPrettyJson(42)).toBe('42');
    expect(toPrettyJson(true)).toBe('true');
  });
});

describe('parseJsonObject', () => {
  it('debería parsear un objeto JSON válido', () => {
    const result = parseJsonObject('{"key": "value", "num": 5}');
    expect(result).toEqual({ key: 'value', num: 5 });
  });

  it('debería lanzar Error si el JSON es un array', () => {
    expect(() => parseJsonObject('[1, 2, 3]')).toThrow(
      'El payload debe ser un objeto JSON.',
    );
  });

  it('debería lanzar Error si el JSON es una cadena', () => {
    expect(() => parseJsonObject('"texto"')).toThrow(
      'El payload debe ser un objeto JSON.',
    );
  });

  it('debería lanzar Error si el JSON es un número', () => {
    expect(() => parseJsonObject('42')).toThrow(
      'El payload debe ser un objeto JSON.',
    );
  });

  it('debería lanzar Error si el JSON es null', () => {
    expect(() => parseJsonObject('null')).toThrow(
      'El payload debe ser un objeto JSON.',
    );
  });

  it('debería lanzar Error de sintaxis si el JSON es inválido', () => {
    expect(() => parseJsonObject('{invalid json}')).toThrow();
  });

  it('debería retornar un objeto vacío para "{}"', () => {
    const result = parseJsonObject('{}');
    expect(result).toEqual({});
  });
});
