import { useCallback, useEffect, useState } from 'react';
import { crud } from './adminApi.js';

function emptyForm(fields) {
  const out = {};
  for (const f of fields) {
    out[f.name] = f.type === 'checkbox' ? (f.default ?? true) : (f.default ?? '');
  }
  return out;
}

function toPayload(fields, form) {
  const out = {};
  for (const f of fields) {
    let v = form[f.name];
    if (f.type === 'password' && (v === '' || v === null || v === undefined)) {
      continue;
    }
    if (f.type === 'number') v = v === '' || v === null ? null : Number(v);
    if (f.type === 'checkbox') v = !!v;
    if ((f.type === 'select' || f.type === 'text') && v === '') v = f.nullable ? null : v;
    out[f.name] = v;
  }
  return out;
}

export default function CrudPage({ title, resource, columns, fields, searchPlaceholder = 'Keresés…' }) {
  const repo = crud(resource);
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm(fields));
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await repo.list({ page, q: search });
      setRows(data.data ?? []);
      setMeta({ current_page: data.current_page, last_page: data.last_page, total: data.total });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, resource]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  function flash(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm(fields));
    setFormError('');
    setModalOpen(true);
  }

  function openEdit(row) {
    setEditing(row);
    const f = {};
    for (const field of fields) {
      const val = row[field.name];
      f[field.name] = field.type === 'checkbox' ? !!val : (val ?? '');
    }
    setForm(f);
    setFormError('');
    setModalOpen(true);
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const payload = toPayload(fields, form);
      if (editing) {
        await repo.update(editing.id, payload);
        flash('Mentve.');
      } else {
        await repo.create(payload);
        flash('Létrehozva.');
      }
      setModalOpen(false);
      load();
    } catch (e2) {
      setFormError(e2.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(row) {
    if (!window.confirm('Biztosan törlöd ezt az elemet?')) return;
    try {
      await repo.remove(row.id);
      flash('Törölve.');
      if (rows.length === 1 && page > 1) setPage((p) => p - 1);
      else load();
    } catch (e) {
      flash(e.message);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <p className="text-xs text-stone-400">Admin / {title}</p>
          <h1 className="text-2xl font-bold text-stone-800">{title}</h1>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-[#4a7c3f] hover:bg-[#3d6335] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Új
        </button>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm">
        <div className="p-4 border-b border-stone-100">
          <div className="relative max-w-sm">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>
        </div>

        {error && <div className="p-4 text-sm text-red-600">{error}</div>}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-500 border-b border-stone-100">
                {columns.map((c) => (
                  <th key={c.key} className="px-4 py-3 font-medium">{c.label}</th>
                ))}
                <th className="px-4 py-3 font-medium text-right">Műveletek</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={columns.length + 1} className="px-4 py-10 text-center text-stone-400">Betöltés…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={columns.length + 1} className="px-4 py-10 text-center text-stone-400">Nincs találat.</td></tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-b border-stone-50 hover:bg-stone-50/60">
                    {columns.map((c) => (
                      <td key={c.key} className="px-4 py-3 text-stone-700">
                        {c.render ? c.render(row) : (row[c.key] ?? '—')}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(row)} className="text-emerald-700 hover:text-emerald-900 text-sm font-medium">
                          Szerkeszt
                        </button>
                        <button onClick={() => remove(row)} className="text-red-500 hover:text-red-700 text-sm font-medium">
                          Töröl
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-stone-100 text-sm text-stone-500">
          <span>Összesen: {meta.total}</span>
          <div className="flex items-center gap-2">
            <button
              disabled={meta.current_page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-stone-200 disabled:opacity-40 hover:bg-stone-50"
            >
              Előző
            </button>
            <span>{meta.current_page} / {meta.last_page}</span>
            <button
              disabled={meta.current_page >= meta.last_page}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-stone-200 disabled:opacity-40 hover:bg-stone-50"
            >
              Következő
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModalOpen(false)} />
          <form onSubmit={save} className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-stone-100">
              <h2 className="text-lg font-semibold text-stone-800">
                {editing ? `${title} szerkesztése` : `Új ${title.toLowerCase()}`}
              </h2>
            </div>
            <div className="px-6 py-4 space-y-4">
              {formError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{formError}</p>}
              {fields.map((f) => (
                <div key={f.name}>
                  <label className="block text-sm font-medium text-stone-600 mb-1">{f.label}</label>
                  {f.type === 'checkbox' ? (
                    <label className="inline-flex items-center gap-2 text-sm text-stone-700">
                      <input
                        type="checkbox"
                        checked={!!form[f.name]}
                        onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.checked }))}
                        className="w-4 h-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      Igen
                    </label>
                  ) : f.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={form[f.name] ?? ''}
                      onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                  ) : f.type === 'select' ? (
                    <select
                      value={form[f.name] ?? ''}
                      onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    >
                      <option value="">{f.placeholder ?? '— válassz —'}</option>
                      {(f.options ?? []).map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={f.type === 'number' ? 'number' : f.type === 'password' ? 'password' : 'text'}
                      value={form[f.name] ?? ''}
                      onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                  )}
                  {f.hint && <p className="text-xs text-stone-400 mt-1">{f.hint}</p>}
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-stone-100 flex justify-end gap-3">
              <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900">
                Mégse
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-sm font-medium bg-[#4a7c3f] hover:bg-[#3d6335] text-white rounded-lg disabled:opacity-60"
              >
                {saving ? 'Mentés…' : 'Mentés'}
              </button>
            </div>
          </form>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-800 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
