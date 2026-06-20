import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProviders, fetchCities, fetchCategories } from '../api.js';
import ProfileAvatar from '../components/ProfileAvatar.jsx';

export default function ServicesPage() {
  const [items, setItems] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cityId, setCityId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [q, setQ] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCities().then(setCities).catch(() => {});
    fetchCategories({ type: 'service' }).then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    const t = setTimeout(() => {
      fetchProviders({ city_id: cityId, category_id: categoryId, q })
        .then((res) => setItems(res.data ?? res))
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [cityId, categoryId, q]);

  const list = Array.isArray(items) ? items : (items.data ?? []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-emerald-900">Szolgáltatók</h1>

      <div className="flex flex-wrap gap-3">
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="border rounded-lg px-3 py-2 bg-white">
          <option value="">Minden szolgáltatás</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select value={cityId} onChange={(e) => setCityId(e.target.value)} className="border rounded-lg px-3 py-2 bg-white">
          <option value="">Minden település</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input
          type="search"
          placeholder="Név vagy szolgáltatás keresése…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="border rounded-lg px-3 py-2 flex-1 min-w-[200px]"
        />
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <div className="grid md:grid-cols-2 gap-4">
        {!loading && list.length === 0 && !error && (
          <p className="text-stone-500">Még nincs szolgáltató – legyél te az első!</p>
        )}
        {list.map((p) => (
          <Link
            key={p.id}
            to={`/szolgaltatok/${p.id}`}
            className="block bg-white rounded-xl p-5 border border-stone-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <ProfileAvatar url={p.profile_image_url} name={p.display_name} />
                <div className="min-w-0">
                  <h2 className="font-semibold text-lg text-stone-800 truncate">{p.display_name}</h2>
                  <p className="text-sm text-stone-500">{p.city?.name ?? 'Település nincs megadva'}</p>
                </div>
              </div>
              {p.services_count > 0 && (
                <span className="shrink-0 text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                  {p.services_count} szolgáltatás
                </span>
              )}
            </div>
            {p.introduction && <p className="mt-2 text-stone-600 text-sm line-clamp-3">{p.introduction}</p>}
            {p.skills?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.skills.slice(0, 5).map((s) => (
                  <span key={s.id} className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">{s.name}</span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
