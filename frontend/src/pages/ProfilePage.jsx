import { useEffect, useRef, useState } from 'react';
import { api, fetchCities, uploadProfileImage } from '../api.js';
import MyItemsManager from '../components/MyItemsManager.jsx';
import ProfileAvatar from '../components/ProfileAvatar.jsx';

export default function ProfilePage({ user }) {
  const [cities, setCities] = useState([]);
  const [hasProfile, setHasProfile] = useState(false);
  const [form, setForm] = useState({
    display_name: user?.name || '',
    phone: '',
    city_id: '',
    introduction: '',
    is_service_provider: false,
  });
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    fetchCities().then(setCities).catch(() => {});
    api('/profile/me').then((p) => {
      if (p) {
        setHasProfile(true);
        setForm({
          display_name: p.display_name || user?.name || '',
          phone: p.phone || '',
          city_id: p.city_id || '',
          introduction: p.introduction || '',
          is_service_provider: !!p.is_service_provider,
        });
        setImageUrl(p.profile_image_url || null);
      }
    }).catch(() => {});
  }, [user]);

  async function handleImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setMessage('');
    setUploading(true);
    try {
      const updated = await uploadProfileImage(file);
      setImageUrl(updated.profile_image_url || null);
      setMessage('Profilkép feltöltve.');
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

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
      setHasProfile(true);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100">
        <h1 className="text-2xl font-bold text-emerald-900 mb-6">Saját profil</h1>

        <div className="flex items-center gap-4 mb-6">
          <ProfileAvatar url={imageUrl} name={form.display_name} className="w-20 h-20" textClassName="text-2xl" />
          <div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImage} className="hidden" id="profile-image-input" />
            <label
              htmlFor="profile-image-input"
              className={`inline-block cursor-pointer text-sm font-medium px-4 py-2 rounded-lg border border-emerald-600 text-emerald-700 hover:bg-emerald-50 ${uploading ? 'opacity-60 pointer-events-none' : ''}`}
            >
              {uploading ? 'Feltöltés…' : imageUrl ? 'Kép cseréje' : 'Profilkép feltöltése'}
            </label>
            <p className="text-xs text-stone-400 mt-1">JPG, PNG vagy WebP, max. 4 MB.</p>
          </div>
        </div>

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

        {form.is_service_provider && !hasProfile && (
          <p className="mt-6 text-sm text-amber-700 bg-amber-50 rounded-lg px-4 py-3">Előbb mentsd el a profilodat, utána vehetsz fel szolgáltatásokat.</p>
        )}
        {!hasProfile && (
          <p className="mt-6 text-sm text-amber-700 bg-amber-50 rounded-lg px-4 py-3">Előbb mentsd el a profilodat, utána vehetsz fel termékeket.</p>
        )}
      </div>

      <MyItemsManager type="service" enabled={form.is_service_provider && hasProfile} showCategorySuggest />
      <MyItemsManager type="product" enabled={hasProfile} showCategorySuggest />
    </div>
  );
}
