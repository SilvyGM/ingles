'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { apiFetch } from '@/lib/api';
import { RESOURCE_CONFIGS } from '@/lib/resources';
import { readSettings } from '@/lib/settings';

type CountMap = Record<string, number>;

export default function DashboardPage() {
  const settings = useMemo(() => readSettings(), []);
  const [counts, setCounts] = useState<CountMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('Cargando metricas...');

  useEffect(() => {
    async function loadCounts() {
      setLoading(true);
      setError('');
      try {
        const entries = await Promise.all(
          RESOURCE_CONFIGS.map(async (resource) => {
            const data = await apiFetch<unknown[]>(settings, `/${resource.key}`);
            return [resource.key, data.length] as const;
          }),
        );

        setCounts(Object.fromEntries(entries));
        setStatus('Metricas actualizadas.');
      } catch (error) {
        const message = String(error);
        setError(message);
        setStatus('No se pudo actualizar dashboard.');
      } finally {
        setLoading(false);
      }
    }

    void loadCounts();
  }, [settings]);

  return (
    <AppShell subtitle={status} title="Dashboard">
      <section className="card">
        <h2>Resumen del sistema</h2>
        {loading && <p className="hint">Cargando metricas de recursos...</p>}
        {error && (
          <div className="actions">
            <p className="hint">{error}</p>
            <button className="btn ghost" onClick={() => window.location.reload()} type="button">
              Reintentar
            </button>
          </div>
        )}
        <div className="stats-grid">
          {RESOURCE_CONFIGS.map((resource) => {
            const value = counts[resource.key] ?? 0;
            return (
              <article key={resource.key}>
                <span>{resource.label}</span>
                <strong>{value}</strong>
                <Link className="quick-link" href={`/crud/${resource.key}`}>
                  Abrir CRUD
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
