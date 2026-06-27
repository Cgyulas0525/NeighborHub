import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchServices, fetchCities, fetchCategories, fetchMyProfile } from '../api.js';
import MyItemsManager, { filterOutOwnItems } from '../components/MyItemsManager.jsx';
import PageHero from '../components/PageHero.jsx';

export default function ServiceListingsPage({ user }) {
  const [items, setItems] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
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
    if (!user) {
      setMyProfile(null);
      return;
    }
    fetchMyProfile().then(setMyProfile).catch(() => setMyProfile(null));
  }, [user]);

  useEffect(() => {
    setLoading(true);
    setError('');
    const t = setTimeout(() => {
      fetchServices({ city_id: cityId, category_id: categoryId, q })
        .then((res) => setItems(res.data ?? res))
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [cityId, categoryId, q]);

  const list = filterOutOwnItems(Array.isArray(items) ? items : (items.data ?? []), myProfile?.id);
  const canManage = !!user && !!myProfile && myProfile.is_service_provider;

  function formatPrice(s) {
    if (s.price_from != null && s.price_to != null) {
      return `${s.price_from.toLocaleString('hu-HU')} – ${s.price_to.toLocaleString('hu-HU')} Ft`;
    }
    if (s.price_from != null) return `${s.price_from.toLocaleString('hu-HU')} Ft-tól`;
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHero
        title="Szolgáltatások"
        subtitle="Konkrét szolgáltatás-hirdetések kategória és település szerint."
        image="/card-bg-services.png"
        imagePosition="center 45%"
        actions={
          !user ? (
            <Link
              to="/bejelentkezes"
              className="text-[17px] font-medium bg-emerald-700 text-white px-4 py-2 rounded-lg hover:bg-emerald-800 shrink-0"
            >
              Bejelentkezés a kezeléshez
            </Link>
          ) : !myProfile?.is_service_provider ? (
            <Link
              to="/profil"
              className="text-[17px] font-medium border border-emerald-600 text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-50 shrink-0"
            >
              Szolgáltatói profil bekapcsolása
            </Link>
          ) : null
        }
      />

      <MyItemsManager type="service" enabled={canManage} compact showCategorySuggest />

      {user && myProfile && !myProfile.is_service_provider && (
        <p className="text-sm text-stone-600 bg-stone-50 border border-stone-100 rounded-lg px-4 py-3">
          Szolgáltatás felvételéhez kapcsold be a{' '}
          <Link to="/profil" className="text-emerald-700 font-medium hover:underline">szolgáltatói profilt</Link>.
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="border rounded-lg px-3 py-2 bg-white">
          <option value="">Minden kategória</option>
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
          placeholder="Keresés…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="border rounded-lg px-3 py-2 flex-1 min-w-[200px]"
        />
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <div className="grid md:grid-cols-2 gap-4">
        {!loading && list.length === 0 && !error && !canManage && (
          <p className="text-stone-500">Még nincs szolgáltatás.</p>
        )}
        {!loading && list.length === 0 && !error && canManage && (
          <p className="text-stone-500 col-span-full">Nincs más szolgáltatás a listában — a tieid fent kezelhetők.</p>
        )}
        {list.map((s) => (
          <article key={s.id} className="bg-white rounded-xl p-5 border border-stone-100 shadow-sm">
            <h2 className="font-semibold text-lg text-stone-800">{s.title}</h2>
            <p className="text-sm text-stone-500 mt-1">
              {s.profile?.display_name ?? '—'}
              {s.profile?.city?.name ? ` · ${s.profile.city.name}` : ''}
            </p>
            {s.category?.name && (
              <span className="inline-block mt-2 text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                {s.category.name}
              </span>
            )}
            {s.description && <p className="mt-2 text-stone-600 text-sm line-clamp-3">{s.description}</p>}
            {formatPrice(s) && <p className="mt-2 font-medium text-emerald-800">{formatPrice(s)}</p>}
          </article>
        ))}
      </div>
    </div>
  );
}
