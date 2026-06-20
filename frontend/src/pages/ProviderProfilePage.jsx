import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchProfile, fetchUser, fetchMyServices } from '../api.js';
import ProfileAvatar from '../components/ProfileAvatar.jsx';

const STATUS_LABELS = { pending: 'Jóváhagyásra vár', approved: 'Jóváhagyva', rejected: 'Elutasítva' };
const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-600',
};

export default function ProviderProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [ownerServices, setOwnerServices] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser().then(setUser).catch(() => setUser(null));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchProfile(id)
      .then(setProfile)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!profile || !user || profile.user_id !== user.id) {
      setOwnerServices(null);
      return;
    }
    fetchMyServices()
      .then((list) => setOwnerServices(Array.isArray(list) ? list : []))
      .catch(() => setOwnerServices([]));
  }, [profile, user]);

  if (loading) {
    return <p className="text-stone-500">Betöltés…</p>;
  }

  if (error || !profile) {
    return (
      <div className="space-y-4">
        <Link to="/szolgaltatok" className="text-sm text-emerald-700 hover:underline">← Vissza a szolgáltatókhoz</Link>
        <p className="text-red-600">{error || 'A szolgáltató nem található.'}</p>
      </div>
    );
  }

  const isOwner = user && profile.user_id === user.id;
  const services = isOwner && ownerServices !== null ? ownerServices : (profile.services ?? []);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/szolgaltatok" className="inline-block text-sm text-emerald-700 hover:underline">← Vissza a szolgáltatókhoz</Link>

      <div className="bg-white rounded-2xl p-8 border border-stone-100 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <ProfileAvatar
            url={profile.profile_image_url}
            name={profile.display_name}
            className="w-24 h-24"
            textClassName="text-3xl"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-emerald-900">{profile.display_name}</h1>
            <p className="text-stone-500 mt-1">{profile.city?.name ?? 'Település nincs megadva'}</p>
            {profile.phone && (
              <p className="mt-2 text-sm text-stone-600">
                <span className="font-medium">Telefon:</span>{' '}
                <a href={`tel:${profile.phone}`} className="text-emerald-700 hover:underline">{profile.phone}</a>
              </p>
            )}
            {profile.public_email && (
              <p className="mt-1 text-sm text-stone-600">
                <span className="font-medium">E-mail:</span>{' '}
                <a href={`mailto:${profile.public_email}`} className="text-emerald-700 hover:underline">{profile.public_email}</a>
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-stone-100">
          <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-2">Bemutatkozás</h2>
          {profile.introduction ? (
            <p className="text-stone-700 whitespace-pre-wrap">{profile.introduction}</p>
          ) : (
            <p className="text-stone-400 text-sm italic">A szolgáltató még nem adott meg bemutatkozást.</p>
          )}
        </div>

        {profile.skills?.length > 0 && (
          <div className="mt-6 pt-6 border-t border-stone-100">
            <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-2">Szakmák</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s) => (
                <span key={s.id} className="text-sm bg-stone-100 text-stone-700 px-3 py-1 rounded-full">{s.name}</span>
              ))}
            </div>
          </div>
        )}

        {(profile.website || profile.facebook_url) && (
          <div className="mt-6 pt-6 border-t border-stone-100 flex flex-wrap gap-4 text-sm">
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline">Weboldal</a>
            )}
            {profile.facebook_url && (
              <a href={profile.facebook_url} target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline">Facebook</a>
            )}
          </div>
        )}
      </div>

      <section>
        <h2 className="text-xl font-bold text-emerald-900 mb-4">Szolgáltatások</h2>
        {isOwner && ownerServices === null ? (
          <p className="text-stone-500 text-sm">Betöltés…</p>
        ) : services.length === 0 ? (
          <p className="text-stone-500 text-sm">
            {isOwner
              ? 'Még nincs felvett szolgáltatásod. A Profilom oldalon vehetsz fel újat.'
              : 'Ennek a szolgáltatónak még nincs nyilvános szolgáltatása.'}
          </p>
        ) : (
          <div className="grid gap-4">
            {services.map((s) => (
              <article key={s.id} className="bg-white rounded-xl p-5 border border-stone-100 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="font-semibold text-lg text-stone-800">{s.title}</h3>
                  {isOwner && s.approval_status && (
                    <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${STATUS_STYLES[s.approval_status] ?? 'bg-stone-100 text-stone-600'}`}>
                      {STATUS_LABELS[s.approval_status] ?? s.approval_status}
                    </span>
                  )}
                </div>
                {s.category?.name && (
                  <span className="inline-block mt-1 text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">{s.category.name}</span>
                )}
                {s.description && <p className="mt-2 text-stone-600 text-sm">{s.description}</p>}
              </article>
            ))}
          </div>
        )}
        {isOwner && services.some((s) => s.approval_status === 'pending') && (
          <p className="mt-3 text-sm text-amber-700 bg-amber-50 rounded-lg px-4 py-2">
            A „Jóváhagyásra vár” státuszú szolgáltatások csak admin jóváhagyás után jelennek meg nyilvánosan.
          </p>
        )}
      </section>

      {profile.products?.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-emerald-900 mb-4">Termékek</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {profile.products.map((p) => (
              <article key={p.id} className="bg-white rounded-xl p-5 border border-stone-100 shadow-sm">
                <h3 className="font-semibold text-stone-800">{p.title}</h3>
                {p.price != null && (
                  <p className="mt-1 font-medium text-emerald-800">{p.price.toLocaleString('hu-HU')} Ft{p.unit ? ` / ${p.unit}` : ''}</p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
