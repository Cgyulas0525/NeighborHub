import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, fetchCities, fetchMyProfile } from '../api.js';
import MyItemsManager, { filterOutOwnItems } from '../components/MyItemsManager.jsx';
import PageHero from '../components/PageHero.jsx';

export default function ProductsPage({ user }) {
  const [items, setItems] = useState([]);
  const [cities, setCities] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [cityId, setCityId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCities().then(setCities).catch(() => {});
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
    fetchProducts({ city_id: cityId || undefined })
      .then((res) => setItems(res.data || res))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [cityId]);

  const list = filterOutOwnItems(items.data ?? items, myProfile?.id);
  const canManage = !!user && !!myProfile;

  return (
    <div className="space-y-6">
      <PageHero
        title="Termékek"
        subtitle="Helyi termelők és kézművesek kínálata a környékről."
        image="/card-bg-products.png"
        imagePosition="center 50%"
        actions={
          !user ? (
            <Link
              to="/bejelentkezes"
              className="text-[17px] font-medium bg-emerald-700 text-white px-4 py-2 rounded-lg hover:bg-emerald-800 shrink-0"
            >
              Bejelentkezés a kezeléshez
            </Link>
          ) : (
            <Link
              to="/profil"
              className="text-[17px] font-medium border border-emerald-600 text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-50 shrink-0"
            >
              Termék felvétele a profilodon
            </Link>
          )
        }
      />

      <MyItemsManager type="product" enabled={canManage} compact showCategorySuggest />

      {!user && (
        <p className="text-sm text-stone-600 bg-stone-50 border border-stone-100 rounded-lg px-4 py-3">
          Termék felvételéhez <Link to="/profil" className="text-emerald-700 font-medium hover:underline">hozd létre a profilodat</Link>.
        </p>
      )}

      <select value={cityId} onChange={(e) => setCityId(e.target.value)} className="border rounded-lg px-3 py-2 bg-white">
        <option value="">Minden település</option>
        {cities.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      {error && <p className="text-red-600">{error}</p>}

      <div className="grid md:grid-cols-2 gap-4">
        {!loading && list.length === 0 && !error && !canManage && (
          <p className="text-stone-500">Még nincs termék.</p>
        )}
        {!loading && list.length === 0 && !error && canManage && (
          <p className="text-stone-500 col-span-full">Nincs más termék a listában — a tieid fent kezelhetők.</p>
        )}
        {list.map((p) => (
          <article key={p.id} className="bg-white rounded-xl p-5 border border-stone-100 shadow-sm">
            <h2 className="font-semibold text-lg">{p.title}</h2>
            <p className="text-sm text-stone-500 mt-1">{p.profile?.display_name || '—'}</p>
            {p.price != null && (
              <p className="mt-2 font-medium text-emerald-800">{p.price.toLocaleString('hu-HU')} Ft{p.unit ? ` / ${p.unit}` : ''}</p>
            )}
            {p.description && <p className="mt-2 text-stone-600 text-sm line-clamp-2">{p.description}</p>}
          </article>
        ))}
      </div>
    </div>
  );
}
