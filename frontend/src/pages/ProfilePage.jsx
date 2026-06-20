import { useEffect, useState } from 'react';
import { api, fetchCities } from '../api.js';

export default function ProfilePage({ user }) {
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({
    display_name: user?.name || '',
    phone: '',
    city_id: '',
    introduction: '',
    is_service_provider: false,
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCities().then(setCities).catch(() => {});
    api('/profile/me').then((p) => {
      if (p) {
        setForm({
          display_name: p.display_name || user?.name || '',
          phone: p.phone || '',
          city_id: p.city_id || '',
          introduction: p.introduction || '',
          is_service_provider: !!p.is_service_provider,
        });
      }
    }).catch(() => {});
  }, [user]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function save(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await api('/profile/me', {
        method: 'PUT',
        body: JSON.stringify({
          ...form,
          city_id: form.city_id || null,
        }),
      });
      setMessage('Profil mentve.');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl p-8 shadow-sm border border-stone-100">
      <h1 className="text-2xl font-bold text-emerald-900 mb-6">Saját profil</h1>
      <form onSubmit={save} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Megjelenített név</label>
          <input required value={form.display_name} onChange={(e) => set('display_name', e.target.value)} className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Telefon</label>
          <input value={form.phone} onChange={(e) => set('phone', e.target.value)} className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Település</label>
          <select value={form.city_id} onChange={(e) => set('city_id', e.target.value)} className="w-full border rounded-lg px-3 py-2">
            <option value="">Válassz…</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bemutatkozás</label>
          <textarea rows={4} value={form.introduction} onChange={(e) => set('introduction', e.target.value)} className="w-full border rounded-lg px-3 py-2" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_service_provider} onChange={(e) => set('is_service_provider', e.target.checked)} />
          Szolgáltatóként is megjelenek
        </label>
        {message && <p className="text-emerald-700 text-sm">{message}</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-emerald-800">
          Mentés
        </button>
      </form>
    </div>
  );
}
