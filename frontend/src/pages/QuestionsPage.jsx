import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, createQuestion, fetchCategories, fetchCities } from '../api.js';

const emptyForm = { title: '', body: '', city_id: '', category_id: '' };

export default function QuestionsPage({ user }) {
  const [items, setItems] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [message, setMessage] = useState('');

  const loadQuestions = useCallback(() => {
    api('/questions')
      .then((res) => setItems(res.data || res))
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    loadQuestions();
    fetchCities().then(setCities).catch(() => {});
    fetchCategories({ type: 'service' }).then(setCategories).catch(() => {});
  }, [loadQuestions]);

  const list = items.data ?? items;

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    setMessage('');
    try {
      const payload = {
        title: form.title.trim(),
        body: form.body.trim(),
        city_id: form.city_id ? Number(form.city_id) : null,
        category_id: form.category_id ? Number(form.category_id) : null,
      };
      const created = await createQuestion(payload);
      setForm(emptyForm);
      setFormOpen(false);
      setMessage('Kérdésed sikeresen felkerült.');
      setItems((prev) => {
        const rows = prev.data ?? prev;
        const next = [created, ...rows];
        return prev.data !== undefined ? { ...prev, data: next } : next;
      });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-emerald-900">Közösségi kérdések</h1>
          <p className="text-stone-600 text-sm mt-1">Kérdezz a szomszédoktól — ajánlások, tapasztalatok, helyi tippek.</p>
        </div>
        {user && !formOpen && (
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-800"
          >
            + Új kérdés
          </button>
        )}
      </div>

      {message && <p className="text-emerald-700 text-sm bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-2">{message}</p>}

      {user ? (
        formOpen && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl p-5 border border-emerald-100 space-y-4 shadow-sm">
            <h2 className="font-semibold text-emerald-900">Új kérdés felvétele</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Cím *</label>
              <input
                required
                maxLength={255}
                value={form.title}
                onChange={(e) => setField('title', e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Pl. Ki tud ajánlani megbízható vízvezeték-szerelőt?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kérdés szövege *</label>
              <textarea
                required
                rows={4}
                value={form.body}
                onChange={(e) => setField('body', e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Írd le részletesen, miben tudnának segíteni…"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Település</label>
                <select
                  value={form.city_id}
                  onChange={(e) => setField('city_id', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 bg-white"
                >
                  <option value="">— válassz —</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Témakör</label>
                <select
                  value={form.category_id}
                  onChange={(e) => setField('category_id', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 bg-white"
                >
                  <option value="">— válassz —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            {formError && <p className="text-sm text-red-600">{formError}</p>}
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-60">
                {saving ? 'Küldés…' : 'Kérdés közzététele'}
              </button>
              <button
                type="button"
                onClick={() => { setFormOpen(false); setFormError(''); }}
                className="text-stone-500 px-3 py-2 text-sm"
              >
                Mégse
              </button>
            </div>
          </form>
        )
      ) : (
        <p className="text-sm text-stone-600 bg-stone-50 border border-stone-100 rounded-lg px-4 py-3">
          Kérdés felvételéhez{' '}
          <Link to="/bejelentkezes" className="text-emerald-700 font-medium hover:underline">jelentkezz be</Link>
          {' '}vagy{' '}
          <Link to="/regisztracio" className="text-emerald-700 font-medium hover:underline">regisztrálj</Link>.
        </p>
      )}

      {error && <p className="text-red-600">{error}</p>}
      <div className="space-y-4">
        {list.length === 0 && !error && <p className="text-stone-500">Még nincs kérdés.</p>}
        {list.map((q) => (
          <article key={q.id} className="bg-white rounded-xl p-5 border border-stone-100">
            <h2 className="font-semibold">{q.title}</h2>
            <p className="text-sm text-stone-500 mt-1">
              {[q.city?.name, q.category?.name, q.user?.name].filter(Boolean).join(' · ') || '—'}
            </p>
            <p className="mt-2 text-stone-700 text-sm whitespace-pre-wrap">{q.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
