import { useEffect, useState } from 'react';
import { fetchProducts, fetchCities } from '../api.js';

export default function ProductsPage() {
  const [items, setItems] = useState([]);
  const [cities, setCities] = useState([]);
  const [cityId, setCityId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCities().then(setCities).catch(() => {});
  }, []);

  useEffect(() => {
    setError('');
    fetchProducts({ city_id: cityId || undefined })
      .then((res) => setItems(res.data || res))
      .catch((e) => setError(e.message));
  }, [cityId]);

  const list = items.data ?? items;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-emerald-900">Termékek</h1>
      <select value={cityId} onChange={(e) => setCityId(e.target.value)} className="border rounded-lg px-3 py-2 bg-white">
        <option value="">Minden település</option>
        {cities.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      {error && <p className="text-red-600">{error}</p>}
      <div className="grid md:grid-cols-2 gap-4">
        {list.length === 0 && !error && <p className="text-stone-500">Még nincs termék.</p>}
        {list.map((p) => (
          <article key={p.id} className="bg-white rounded-xl p-5 border border-stone-100 shadow-sm">
            <h2 className="font-semibold text-lg">{p.title}</h2>
            <p className="text-sm text-stone-500 mt-1">{p.profile?.display_name || '—'}</p>
            {p.price != null && <p className="mt-2 font-medium text-emerald-800">{p.price.toLocaleString('hu-HU')} Ft{p.unit ? ` / ${p.unit}` : ''}</p>}
          </article>
        ))}
      </div>
    </div>
  );
}
