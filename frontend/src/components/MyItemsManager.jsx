import { useCallback, useEffect, useState } from 'react';
import {
  createProduct,
  createService,
  deleteProduct,
  deleteService,
  fetchCategories,
  fetchMyProducts,
  fetchMyServices,
  updateProduct,
  updateService,
  suggestCategory,
} from '../api.js';

const STATUS_LABELS = { pending: 'Jóváhagyásra vár', approved: 'Jóváhagyva', rejected: 'Elutasítva' };
const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-600',
};

const CONFIG = {
  service: {
    title: 'Szolgáltatásaim',
    hint: 'Az új szolgáltatások admin jóváhagyás után jelennek meg nyilvánosan.',
    createLabel: 'Új szolgáltatás',
    createBtn: '+ Új szolgáltatás',
    empty: 'Még nincs felvett szolgáltatásod.',
    nameLabel: 'Szolgáltatás címe',
    namePlaceholder: 'pl. Vízvezeték-szerelés',
    categoryType: 'service',
    fetch: fetchMyServices,
    create: createService,
    update: updateService,
    remove: deleteService,
    emptyForm: { title: '', description: '', category_id: '' },
  },
  product: {
    title: 'Termékeim',
    hint: 'A termékek admin jóváhagyás után jelennek meg a Termékek listán.',
    createLabel: 'Termék felvétele',
    createBtn: '+ Új termék',
    empty: 'Még nincs felvett terméked.',
    nameLabel: 'Termék neve',
    namePlaceholder: 'pl. Házi lekvár',
    categoryType: 'product',
    fetch: fetchMyProducts,
    create: createProduct,
    update: updateProduct,
    remove: deleteProduct,
    emptyForm: { title: '', description: '', category_id: '', price: '', unit: '' },
  },
};

function CategorySuggestForm({ type, onSuggested }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setLocalError('');
    try {
      await suggestCategory(name.trim(), type);
      setName('');
      setOpen(false);
      onSuggested();
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-sm text-emerald-700 hover:underline mt-1">
        + Új kategória javaslata
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 p-3 bg-white rounded-lg border border-dashed border-emerald-200 space-y-2">
      <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Új kategória neve" />
      {localError && <p className="text-xs text-red-600">{localError}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="text-sm bg-emerald-700 text-white px-3 py-1.5 rounded-lg disabled:opacity-60">Javaslat</button>
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-stone-500">Mégse</button>
      </div>
    </form>
  );
}

function ItemFormFields({ type, form, setForm, categories, showCategorySuggest, onCategorySuggested }) {
  const cfg = CONFIG[type];
  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-1">{cfg.nameLabel} *</label>
        <input
          required
          value={form.title}
          onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
          className="w-full border rounded-lg px-3 py-2 bg-white text-sm"
          placeholder={cfg.namePlaceholder}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Leírás</label>
        <textarea rows={3} value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} className="w-full border rounded-lg px-3 py-2 bg-white text-sm" />
      </div>
      <div className={type === 'product' ? 'grid sm:grid-cols-2 gap-3' : ''}>
        <div>
          <label className="block text-sm font-medium mb-1">Kategória</label>
          <select value={form.category_id} onChange={(e) => setForm((s) => ({ ...s, category_id: e.target.value }))} className="w-full border rounded-lg px-3 py-2 bg-white text-sm">
            <option value="">Válassz…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {showCategorySuggest && (
            <CategorySuggestForm type={cfg.categoryType} onSuggested={onCategorySuggested} />
          )}
        </div>
        {type === 'product' && (
          <div>
            <label className="block text-sm font-medium mb-1">Ár (Ft)</label>
            <input type="number" min="0" value={form.price} onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))} className="w-full border rounded-lg px-3 py-2 bg-white text-sm" placeholder="opcionális" />
          </div>
        )}
      </div>
      {type === 'product' && (
        <div>
          <label className="block text-sm font-medium mb-1">Egység</label>
          <input value={form.unit} onChange={(e) => setForm((s) => ({ ...s, unit: e.target.value }))} className="w-full border rounded-lg px-3 py-2 bg-white text-sm" placeholder="pl. kg, db" />
        </div>
      )}
    </>
  );
}

function Chevron({ open }) {
  return (
    <svg
      className={`w-5 h-5 text-stone-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function MyItemsManager({ type, enabled, showCategorySuggest = false, compact = false }) {
  const cfg = CONFIG[type];
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ ...cfg.emptyForm });
  const [createSaving, setCreateSaving] = useState(false);
  const [openId, setOpenId] = useState(null);
  const [editForms, setEditForms] = useState({});
  const [editSaving, setEditSaving] = useState(false);

  const loadCategories = useCallback(() => {
    fetchCategories({ type: cfg.categoryType }).then(setCategories).catch(() => setCategories([]));
  }, [cfg.categoryType]);

  const loadItems = useCallback(() => {
    if (!enabled) return;
    setLoading(true);
    cfg.fetch()
      .then((list) => setItems(Array.isArray(list) ? list : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [enabled, cfg]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  if (!enabled) return null;

  function itemToForm(item) {
    return {
      title: item.title || '',
      description: item.description || '',
      category_id: item.category_id || item.category?.id || '',
      price: item.price ?? '',
      unit: item.unit || '',
    };
  }

  function toggleAccordion(id) {
    if (openId === id) {
      setOpenId(null);
      return;
    }
    const item = items.find((i) => i.id === id);
    if (item) {
      setEditForms((prev) => ({ ...prev, [id]: prev[id] ?? itemToForm(item) }));
    }
    setOpenId(id);
    setCreateOpen(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    setCreateSaving(true);
    setError('');
    setMessage('');
    try {
      const payload = {
        title: createForm.title,
        description: createForm.description || null,
        category_id: createForm.category_id || null,
      };
      if (type === 'product') {
        payload.price = createForm.price ? Number(createForm.price) : null;
        payload.unit = createForm.unit || null;
      }
      await cfg.create(payload);
      setCreateForm({ ...cfg.emptyForm });
      setCreateOpen(false);
      setMessage(type === 'service' ? 'Szolgáltatás felvéve — jóváhagyásra vár.' : 'Termék felvéve — jóváhagyásra vár.');
      loadItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreateSaving(false);
    }
  }

  async function handleUpdate(e, id) {
    e.preventDefault();
    const form = editForms[id];
    if (!form) return;
    setEditSaving(true);
    setError('');
    try {
      const payload = {
        title: form.title,
        description: form.description || null,
        category_id: form.category_id || null,
      };
      if (type === 'product') {
        payload.price = form.price ? Number(form.price) : null;
        payload.unit = form.unit || null;
      }
      await cfg.update(id, payload);
      setOpenId(null);
      setMessage('Mentve.');
      loadItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setEditSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Biztosan törlöd?')) return;
    setError('');
    try {
      await cfg.remove(id);
      if (openId === id) setOpenId(null);
      setMessage('Törölve.');
      loadItems();
    } catch (err) {
      setError(err.message);
    }
  }

  const wrapperClass = compact
    ? 'p-4 bg-emerald-50/50 rounded-xl border border-emerald-100'
    : 'p-5 bg-white rounded-xl border border-stone-100 shadow-sm';

  return (
    <section className={wrapperClass}>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <h2 className={`font-bold text-emerald-900 ${compact ? 'text-lg' : 'text-xl'}`}>{cfg.title}</h2>
          <p className="text-sm text-stone-500 mt-0.5">{cfg.hint}</p>
        </div>
        {!createOpen && (
          <button
            type="button"
            onClick={() => { setCreateOpen(true); setOpenId(null); }}
            className="text-sm font-medium bg-emerald-700 text-white px-4 py-2 rounded-lg hover:bg-emerald-800 shrink-0"
          >
            {cfg.createBtn}
          </button>
        )}
      </div>

      {message && <p className="text-sm text-emerald-700 mb-3">{message}</p>}
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      {createOpen && (
        <form onSubmit={handleCreate} className="space-y-3 mb-4 p-4 bg-white rounded-xl border border-emerald-100">
          <h3 className="text-sm font-semibold text-stone-700">Új felvétel</h3>
          <ItemFormFields
            type={type}
            form={createForm}
            setForm={setCreateForm}
            categories={categories}
            showCategorySuggest={showCategorySuggest}
            onCategorySuggested={() => { loadCategories(); setMessage('Kategória javaslat elküldve.'); }}
          />
          <div className="flex gap-2">
            <button type="submit" disabled={createSaving} className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60">
              {createSaving ? 'Mentés…' : cfg.createLabel}
            </button>
            <button type="button" onClick={() => setCreateOpen(false)} className="text-sm text-stone-500 px-2">Mégse</button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-stone-500 text-sm">Betöltés…</p>
      ) : items.length === 0 ? (
        <p className="text-stone-500 text-sm">{cfg.empty}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => {
            const isOpen = openId === item.id;
            const form = editForms[item.id] ?? itemToForm(item);
            return (
              <li key={item.id} className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-stone-50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-stone-800 truncate">{item.title}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {item.category?.name && (
                        <span className="text-xs text-stone-500">{item.category.name}</span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLES[item.approval_status] ?? 'bg-stone-100 text-stone-600'}`}>
                        {STATUS_LABELS[item.approval_status] ?? item.approval_status}
                      </span>
                    </div>
                  </div>
                  <Chevron open={isOpen} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 border-t border-stone-100 bg-stone-50/80">
                    <form onSubmit={(e) => handleUpdate(e, item.id)} className="space-y-3 pt-4">
                      <ItemFormFields
                        type={type}
                        form={form}
                        setForm={(updater) => {
                          setEditForms((prev) => {
                            const current = prev[item.id] ?? itemToForm(item);
                            const next = typeof updater === 'function' ? updater(current) : updater;
                            return { ...prev, [item.id]: next };
                          });
                        }}
                        categories={categories}
                        showCategorySuggest={showCategorySuggest}
                        onCategorySuggested={() => { loadCategories(); setMessage('Kategória javaslat elküldve.'); }}
                      />
                      <div className="flex flex-wrap gap-2">
                        <button type="submit" disabled={editSaving} className="text-sm bg-emerald-700 text-white px-3 py-1.5 rounded-lg disabled:opacity-60">
                          {editSaving ? 'Mentés…' : 'Mentés'}
                        </button>
                        <button type="button" onClick={() => handleDelete(item.id)} className="text-sm text-red-500 hover:text-red-700 px-2">
                          Töröl
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export function isOwnListingItem(item, myProfileId) {
  return myProfileId && item.profile?.id === myProfileId;
}

export function filterOutOwnItems(list, myProfileId) {
  if (!myProfileId) return list;
  return list.filter((item) => !isOwnListingItem(item, myProfileId));
}
