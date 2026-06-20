import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchStats } from './adminApi.js';

const CARDS = [
  { key: 'users', label: 'Felhasználók', to: '/admin/felhasznalok', color: 'bg-emerald-50 text-emerald-700' },
  { key: 'profiles', label: 'Profilok', to: '/admin/profilok', color: 'bg-teal-50 text-teal-700' },
  { key: 'services', label: 'Szolgáltatások', to: '/admin/szolgaltatasok', color: 'bg-lime-50 text-lime-700' },
  { key: 'products', label: 'Termékek', to: '/admin/termekek', color: 'bg-amber-50 text-amber-700' },
  { key: 'questions', label: 'Kérdések', to: '/admin/kerdesek', color: 'bg-sky-50 text-sky-700' },
  { key: 'cities', label: 'Városok', to: '/admin/varosok', color: 'bg-stone-100 text-stone-700' },
  { key: 'categories', label: 'Kategóriák', to: '/admin/kategoriak', color: 'bg-stone-100 text-stone-700' },
  { key: 'skills', label: 'Szakmák', to: '/admin/szakmak', color: 'bg-stone-100 text-stone-700' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats().then(setStats).catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <p className="text-xs text-stone-400">Admin / Vezérlőpult</p>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Vezérlőpult</h1>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CARDS.map((c) => (
          <Link
            key={c.key}
            to={c.to}
            className="bg-white rounded-xl border border-stone-200 shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${c.color} mb-3 text-lg font-bold`}>
              {stats ? (stats[c.key] ?? 0) : '–'}
            </div>
            <p className="text-sm font-medium text-stone-600">{c.label}</p>
          </Link>
        ))}
      </div>

      {stats && (stats.recommendations_pending > 0 || stats.profiles_pending > 0 || stats.services_pending > 0 || stats.products_pending > 0 || stats.categories_pending > 0) && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h2 className="font-semibold text-amber-800 mb-2">Jóváhagyásra vár</h2>
          <ul className="text-sm text-amber-700 space-y-1">
            {stats.profiles_pending > 0 && (
              <li>
                <Link to="/admin/profilok" className="underline">
                  {stats.profiles_pending} profil jóváhagyásra vár
                </Link>
              </li>
            )}
            {stats.recommendations_pending > 0 && (
              <li>
                <Link to="/admin/ajanlasok" className="underline">
                  {stats.recommendations_pending} ajánlás moderálásra vár
                </Link>
              </li>
            )}
            {stats.services_pending > 0 && (
              <li>
                <Link to="/admin/szolgaltatasok" className="underline">
                  {stats.services_pending} szolgáltatás jóváhagyásra vár
                </Link>
              </li>
            )}
            {stats.products_pending > 0 && (
              <li>
                <Link to="/admin/termekek" className="underline">
                  {stats.products_pending} termék jóváhagyásra vár
                </Link>
              </li>
            )}
            {stats.categories_pending > 0 && (
              <li>
                <Link to="/admin/kategoriak" className="underline">
                  {stats.categories_pending} kategória javaslat jóváhagyásra vár
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
