'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { confirmDanger, showError, showSuccess, showWarning } from '@/lib/alerts';
import { parseJsonObject, toPrettyJson } from '@/lib/json';
import {
  isResourceKey,
  pickWritableFields,
  RESOURCE_MAP,
  type ResourceKey,
} from '@/lib/resources';
import { readSettings } from '@/lib/settings';

type ResourceCrudProps = {
  resource: string;
};

export function ResourceCrud({ resource }: ResourceCrudProps) {
  if (!isResourceKey(resource)) {
    return (
      <section className="card">
        <p className="hint">Recurso no valido.</p>
      </section>
    );
  }

  return <ResourceCrudInner resource={resource} />;
}

function ResourceCrudInner({ resource }: { resource: ResourceKey }) {
  const config = RESOURCE_MAP[resource];
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [payloadText, setPayloadText] = useState(() => toPrettyJson(config.defaultPayload));

  const settings = useMemo(() => readSettings(), []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<Record<string, unknown>[]>(settings, `/${config.key}`);
      setRows(data);
      setMessage(`Cargados ${data.length} registros.`);
    } catch (error) {
      setMessage(`Error al cargar: ${String(error)}`);
      await showError('Error cargando datos', error);
    } finally {
      setLoading(false);
    }
  }, [config.key, settings]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  function resetPayload() {
    setEditId(null);
    setPayloadText(toPrettyJson(config.defaultPayload));
  }

  async function createItem() {
    try {
      const payload = parseJsonObject(payloadText);
      await apiFetch(settings, `/${config.key}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setMessage('Registro creado correctamente.');
      await showSuccess('Registro creado', `Nuevo elemento en ${config.label}.`);
      resetPayload();
      await loadData();
    } catch (error) {
      setMessage(`Error creando registro: ${String(error)}`);
      await showError('No se pudo crear', error);
    }
  }

  async function updateItem() {
    if (!editId) {
      setMessage('Selecciona un registro para editar.');
      await showWarning('Sin registro seleccionado', 'Selecciona un item para editar.');
      return;
    }

    try {
      const payload = parseJsonObject(payloadText);
      await apiFetch(settings, `/${config.key}/${editId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      setMessage('Registro actualizado correctamente.');
      await showSuccess('Registro actualizado', `Cambios guardados en ${config.label}.`);
      resetPayload();
      await loadData();
    } catch (error) {
      setMessage(`Error actualizando registro: ${String(error)}`);
      await showError('No se pudo actualizar', error);
    }
  }

  async function deleteItem(id: string) {
    const confirmed = await confirmDanger(
      'Eliminar registro',
      'Se eliminara este registro. Esta accion no se puede deshacer.',
    );
    if (!confirmed) {
      return;
    }

    try {
      await apiFetch(settings, `/${config.key}/${id}`, { method: 'DELETE' });
      setMessage('Registro eliminado.');
      await showSuccess('Registro eliminado', `Elemento ${id} eliminado.`);
      if (editId === id) {
        resetPayload();
      }
      await loadData();
    } catch (error) {
      setMessage(`Error eliminando registro: ${String(error)}`);
      await showError('No se pudo eliminar', error);
    }
  }

  function startEdit(item: Record<string, unknown>) {
    const id = String(item.id ?? '');
    if (!id) {
      setMessage('El registro no tiene un campo id editable.');
      void showWarning('Sin identificador', 'El registro no tiene campo id editable.');
      return;
    }

    const writable = pickWritableFields(item, config.writableFields);
    setEditId(id);
    setPayloadText(toPrettyJson(writable));
  }

  return (
    <>
      <section className="card">
        <h2>{config.label}</h2>
        <p className="hint">{config.description}</p>

        <div className="editor-grid">
          <div>
            <label className="editor-label" htmlFor="payload">
              Payload JSON {editId ? `(modo edicion: ${editId})` : '(modo creacion)'}
            </label>
            <textarea
              className="payload-editor"
              id="payload"
              onChange={(event) => setPayloadText(event.target.value)}
              value={payloadText}
            />
            <div className="actions">
              <button className="btn" onClick={() => void createItem()} type="button">
                Crear
              </button>
              <button className="btn ghost" onClick={() => void updateItem()} type="button">
                Guardar cambios
              </button>
              <button className="btn ghost" onClick={resetPayload} type="button">
                Reset
              </button>
              <button className="btn ghost" onClick={() => void loadData()} type="button">
                Recargar
              </button>
            </div>
            <p className="hint">{message}</p>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="list-header">
          <h3>Listado ({rows.length})</h3>
          {loading && <span className="hint">Cargando...</span>}
        </div>

        {rows.length === 0 && <p className="hint">No hay registros para mostrar.</p>}

        <ul className="result-list">
          {rows.map((item, index) => {
            const id = String(item.id ?? `item-${index}`);
            return (
              <li key={id}>
                <div className="item-actions">
                  <strong>{id}</strong>
                  <div className="actions">
                    <button className="btn ghost" onClick={() => startEdit(item)} type="button">
                      Editar
                    </button>
                    <button className="btn danger" onClick={() => void deleteItem(id)} type="button">
                      Eliminar
                    </button>
                  </div>
                </div>
                <pre>{toPrettyJson(item)}</pre>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
