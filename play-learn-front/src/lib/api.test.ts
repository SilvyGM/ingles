import { apiFetch } from '@/lib/api';

const mockFetch = jest.fn();
global.fetch = mockFetch;

function makeResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(JSON.stringify(body)),
    json: () => Promise.resolve(body),
  } as unknown as Response;
}

const settings = { baseUrl: 'http://localhost:3000', token: 'test-token', email: '' };

describe('apiFetch', () => {
  afterEach(() => jest.clearAllMocks());

  it('debería realizar una petición GET y retornar JSON', async () => {
    mockFetch.mockResolvedValue(makeResponse([{ id: '1' }]));

    const result = await apiFetch<{ id: string }[]>(settings, '/users');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/users',
      expect.objectContaining({
        cache: 'no-store',
        headers: expect.any(Headers),
      }),
    );
    expect(result).toEqual([{ id: '1' }]);
  });

  it('debería agregar el header Authorization con el token', async () => {
    mockFetch.mockResolvedValue(makeResponse({}));

    await apiFetch(settings, '/test');

    const call = mockFetch.mock.calls[0] as [string, RequestInit];
    const headers = call[1].headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer test-token');
  });

  it('NO debería agregar Authorization si el token está vacío', async () => {
    mockFetch.mockResolvedValue(makeResponse({}));

    await apiFetch({ ...settings, token: '' }, '/test');

    const call = mockFetch.mock.calls[0] as [string, RequestInit];
    const headers = call[1].headers as Headers;
    expect(headers.get('Authorization')).toBeNull();
  });

  it('debería eliminar la barra final de baseUrl', async () => {
    mockFetch.mockResolvedValue(makeResponse({}));

    await apiFetch({ ...settings, baseUrl: 'http://localhost:3000/' }, '/users');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/users',
      expect.anything(),
    );
  });

  it('debería retornar null para respuestas 204', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 204,
      text: () => Promise.resolve(''),
      json: () => Promise.resolve(null),
    });

    const result = await apiFetch(settings, '/test');

    expect(result).toBeNull();
  });

  it('debería lanzar error con mensaje de sesión expirada en 401', async () => {
    mockFetch.mockResolvedValue(makeResponse({ message: 'Unauthorized' }, 401));

    await expect(apiFetch(settings, '/test')).rejects.toThrow(
      'Sesion expirada o token invalido. Vuelve a iniciar sesion.',
    );
  });

  it('debería lanzar error de permisos en 403', async () => {
    mockFetch.mockResolvedValue(makeResponse({ message: 'Forbidden' }, 403));

    await expect(apiFetch(settings, '/test')).rejects.toThrow(
      'No tienes permisos para esta operacion.',
    );
  });

  it('debería lanzar el mensaje del payload de error en 400', async () => {
    mockFetch.mockResolvedValue(makeResponse({ message: 'email must be an email' }, 400));

    await expect(apiFetch(settings, '/test')).rejects.toThrow('email must be an email');
  });

  it('debería unir array de mensajes de error con coma', async () => {
    mockFetch.mockResolvedValue(
      makeResponse({ message: ['campo requerido', 'formato invalido'] }, 400),
    );

    await expect(apiFetch(settings, '/test')).rejects.toThrow(
      'campo requerido, formato invalido',
    );
  });

  it('debería pasar el body y method correctamente', async () => {
    mockFetch.mockResolvedValue(makeResponse({ id: 'new-id' }, 201));

    await apiFetch(settings, '/users', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com' }),
    });

    const call = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(call[1].method).toBe('POST');
    expect(call[1].body).toBe(JSON.stringify({ email: 'test@test.com' }));
  });
});
