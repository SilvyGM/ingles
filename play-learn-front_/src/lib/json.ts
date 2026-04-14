export function toPrettyJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export function parseJsonObject(raw: string): Record<string, unknown> {
  const parsed = JSON.parse(raw) as unknown;

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('El payload debe ser un objeto JSON.');
  }

  return parsed as Record<string, unknown>;
}
