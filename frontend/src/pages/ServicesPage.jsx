import { useEffect, useState } from 'react';
import { fetchServices, fetchCities } from '../api.js';

export default function ServicesPage() {
  const [items, setItems] = useState([]);
  const [cities, setCities] = useState([]);
  const [cityId, setCityId] = useState('');
  const [q, setQ] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCities().then(setCities).catch(() => {});
  }, []);

  useEffect(() => {
    setError('');
    fetchServices({ city_id: cityId || undefined, q: q || undefined })
      .then((res) => setItems(res.data || res))
      .catch((e) => setError(e.message));
  }, [cityId, q]);

  const list = items.data ?? items;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-emerald-900">Szolgáltatók</h1>
      <div className="flex flex-wrap gap-3">
        <select value={cityId} onChange={(e) => setCityId(e.target.value)} className="border rounded-lg px-3 py-2 bg-white">
          <option value="">Minden település</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input
          type="search"
          placeholder="Keresés…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="border rounded-lg px-3 py-2 flex-1 min-w-[200px]"
        />
      </div>
      {error && <p className="text-red-600">{error}</p>}
      <div className="grid md:grid-cols-2 gap-4">
        {list.length === 0 && !error && <p className="text-stone-500">Még nincs szolgáltatás – legyél te az első!</p>}
        {list.map((s) => (
          <article key={s.id} className="bg-white rounded-xl p-5 border border-stone-100 shadow-sm">
            <h2 className="font-semibold text-lg">{s.title}</h2>
            <p className="text-sm text-stone-500 mt-1">
              {s.profile?.display_name || s.profile?.city?.name || '—'}
              {s.city?.name ? ` · ${s.city.name}` : ''}
            </p>
            {s.description && <p className="mt-2 text-stone-600 text-sm line-clamp-3">{s.description}</p>}
          </article>
        ))}
      </div>
    </div>
  );
}
