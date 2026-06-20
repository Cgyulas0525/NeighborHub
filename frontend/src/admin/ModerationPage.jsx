import { useCallback, useEffect, useState } from 'react';
import { crud } from './adminApi.js';

export default function ModerationPage({ title, resource, columns, statusField, statusOptions, searchable = true }) {
  const repo = crud(resource);
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await repo.list({ page, q: searchable ? search : '' });
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

  async function changeStatus(row, raw) {
    const option = statusOptions.find((o) => String(o.value) === raw);
    if (!option) return;
    try {
      await repo.update(row.id, { [statusField]: option.value });
      flash('Frissítve.');
      load();
    } catch (e) {
      flash(e.message);
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
      <p className="text-xs text-stone-400">Admin / {title}</p>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">{title}</h1>

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm">
        {searchable && (
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
                placeholder="Keresés…"
                className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
          </div>
        )}

        {error && <div className="p-4 text-sm text-red-600">{error}</div>}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-500 border-b border-stone-100">
                {columns.map((c) => (
                  <th key={c.key} className="px-4 py-3 font-medium">{c.label}</th>
                ))}
                <th className="px-4 py-3 font-medium">Állapot</th>
                <th className="px-4 py-3 font-medium text-right">Műveletek</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={columns.length + 2} className="px-4 py-10 text-center text-stone-400">Betöltés…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={columns.length + 2} className="px-4 py-10 text-center text-stone-400">Nincs találat.</td></tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-b border-stone-50 hover:bg-stone-50/60">
                    {columns.map((c) => (
                      <td key={c.key} className="px-4 py-3 text-stone-700">
                        {c.render ? c.render(row) : (row[c.key] ?? '—')}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <select
                        value={String(row[statusField])}
                        onChange={(e) => changeStatus(row, e.target.value)}
                        className="text-sm border border-stone-300 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                      >
                        {statusOptions.map((o) => (
                          <option key={String(o.value)} value={String(o.value)}>{o.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => remove(row)} className="text-red-500 hover:text-red-700 text-sm font-medium">
                        Töröl
                      </button>
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

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-800 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
