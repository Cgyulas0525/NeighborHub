import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchMyProfile, fetchProfile, updateProfile, fetchCities } from '../api.js';
import MyItemsManager from '../components/MyItemsManager.jsx';
import ProfileAvatar from '../components/ProfileAvatar.jsx';

const STATUS_LABELS = { pending: 'Jóváhagyásra vár', approved: 'Jóváhagyva', rejected: 'Elutasítva' };
const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-600',
};

export default function ProviderProfilePage({ user }) {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [editProfile, setEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({});
  const [profileSaving, setProfileSaving] = useState(false);

  const isOwner = user && profile && profile.user_id === user.id;

  async function loadProfile() {
    setLoading(true);
    setError('');
    try {
      const p = await fetchProfile(id);
      setProfile(p);
    } catch (e) {
      setError(e.message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
    fetchCities().then(setCities).catch(() => {});
  }, [id]);

  useEffect(() => {
    if (!isOwner || !editProfile) return;
    fetchMyProfile()
      .then((p) => {
        if (p) {
          setProfileForm({
            display_name: p.display_name || '',
            phone: p.phone || '',
            city_id: p.city_id || '',
            introduction: p.introduction || '',
            public_email: p.public_email || '',
            website: p.website || '',
            facebook_url: p.facebook_url || '',
            is_service_provider: true,
          });
        }
      })
      .catch(() => {});
  }, [isOwner, editProfile]);

  async function saveProfile(e) {
    e.preventDefault();
    setProfileSaving(true);
    setError('');
    setMessage('');
    try {
      await updateProfile({ ...profileForm, city_id: profileForm.city_id || null });
      setMessage('Profil mentve.');
      setEditProfile(false);
      await loadProfile();
    } catch (err) {
      setError(err.message);
    } finally {
      setProfileSaving(false);
    }
  }

  if (loading) {
    return <p className="text-stone-500">Betöltés…</p>;
  }

  if (error && !profile) {
    return (
      <div className="space-y-4">
        <Link to="/szolgaltatok" className="text-sm text-emerald-700 hover:underline">← Vissza a szolgáltatókhoz</Link>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/szolgaltatok" className="text-sm text-emerald-700 hover:underline">← Vissza a szolgáltatókhoz</Link>
        {isOwner && (
          <button
            type="button"
            onClick={() => setEditProfile((v) => !v)}
            className="text-sm font-medium text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-50"
          >
            {editProfile ? 'Szerkesztés bezárása' : 'Profil szerkesztése'}
          </button>
        )}
      </div>

      {isOwner && profile.approval_status !== 'approved' && (
        <p className="text-sm text-amber-700 bg-amber-50 rounded-lg px-4 py-2">
          A profilod jóváhagyásra vár ({STATUS_LABELS[profile.approval_status] ?? profile.approval_status}).
        </p>
      )}

      {message && <p className="text-emerald-700 text-sm bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-2">{message}</p>}
      {error && profile && <p className="text-red-600 text-sm">{error}</p>}

      {editProfile && isOwner ? (
        <form onSubmit={saveProfile} className="bg-white rounded-2xl p-6 border border-emerald-100 space-y-4 shadow-sm">
          <h2 className="font-semibold text-emerald-900">Profil szerkesztése</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Megjelenített név *</label>
            <input required value={profileForm.display_name || ''} onChange={(e) => setProfileForm((f) => ({ ...f, display_name: e.target.value }))} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Telefon</label>
            <input value={profileForm.phone || ''} onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Település</label>
            <select value={profileForm.city_id || ''} onChange={(e) => setProfileForm((f) => ({ ...f, city_id: e.target.value }))} className="w-full border rounded-lg px-3 py-2 bg-white">
              <option value="">Válassz…</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bemutatkozás</label>
            <textarea rows={4} value={profileForm.introduction || ''} onChange={(e) => setProfileForm((f) => ({ ...f, introduction: e.target.value }))} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nyilvános e-mail</label>
            <input type="email" value={profileForm.public_email || ''} onChange={(e) => setProfileForm((f) => ({ ...f, public_email: e.target.value }))} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Weboldal</label>
            <input type="url" value={profileForm.website || ''} onChange={(e) => setProfileForm((f) => ({ ...f, website: e.target.value }))} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Facebook</label>
            <input type="url" value={profileForm.facebook_url || ''} onChange={(e) => setProfileForm((f) => ({ ...f, facebook_url: e.target.value }))} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <button type="submit" disabled={profileSaving} className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60">
            {profileSaving ? 'Mentés…' : 'Profil mentése'}
          </button>
        </form>
      ) : (
        <div className="bg-white rounded-2xl p-8 border border-stone-100 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <ProfileAvatar url={profile.profile_image_url} name={profile.display_name} className="w-24 h-24" textClassName="text-3xl" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-emerald-900">{profile.display_name}</h1>
                {isOwner && profile.approval_status && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLES[profile.approval_status] ?? ''}`}>
                    {STATUS_LABELS[profile.approval_status]}
                  </span>
                )}
              </div>
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
              {profile.website && <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline">Weboldal</a>}
              {profile.facebook_url && <a href={profile.facebook_url} target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline">Facebook</a>}
            </div>
          )}
        </div>
      )}

      {isOwner ? (
        <>
          <MyItemsManager type="service" enabled showCategorySuggest />
          <MyItemsManager type="product" enabled showCategorySuggest />
        </>
      ) : (
        <>
          {profile.services?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-emerald-900 mb-4">Szolgáltatások</h2>
              <div className="grid gap-4">
                {profile.services.map((s) => (
                  <article key={s.id} className="bg-white rounded-xl p-5 border border-stone-100 shadow-sm">
                    <h3 className="font-semibold text-lg text-stone-800">{s.title}</h3>
                    {s.category?.name && <span className="inline-block mt-1 text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">{s.category.name}</span>}
                    {s.description && <p className="mt-2 text-stone-600 text-sm">{s.description}</p>}
                  </article>
                ))}
              </div>
            </section>
          )}
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
        </>
      )}
    </div>
  );
}
