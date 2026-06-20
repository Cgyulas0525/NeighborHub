import { useEffect, useRef, useState } from 'react';
import { api, fetchCities, fetchCategories, fetchMyServices, fetchMyProducts, createService, createProduct, deleteService, deleteProduct, uploadProfileImage, suggestCategory } from '../api.js';
import ProfileAvatar from '../components/ProfileAvatar.jsx';

const STATUS_LABELS = { pending: 'Jóváhagyásra vár', approved: 'Jóváhagyva', rejected: 'Elutasítva' };
const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-600',
};

function CategorySuggestForm({ type, onSuggested }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setLocalError('');
    try {
      await suggestCategory(name.trim(), type);
      setName('');
      setOpen(false);
      onSuggested();
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-sm text-emerald-700 hover:underline mt-1">
        + Új kategória javaslata
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 p-3 bg-white rounded-lg border border-dashed border-emerald-200 space-y-2">
      <p className="text-xs text-stone-500">Az admin jóváhagyása után választható lesz a listában.</p>
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 text-sm"
        placeholder="Új kategória neve"
      />
      {localError && <p className="text-xs text-red-600">{localError}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="text-sm bg-emerald-700 text-white px-3 py-1.5 rounded-lg disabled:opacity-60">
          {saving ? 'Küldés…' : 'Javaslat küldése'}
        </button>
        <button type="button" onClick={() => { setOpen(false); setLocalError(''); }} className="text-sm text-stone-500 px-2">
          Mégse
        </button>
      </div>
    </form>
  );
}

export default function ProfilePage({ user }) {
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [myServices, setMyServices] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [hasProfile, setHasProfile] = useState(false);
  const [serviceForm, setServiceForm] = useState({ title: '', description: '', category_id: '' });
  const [productForm, setProductForm] = useState({ title: '', description: '', category_id: '', price: '', unit: '' });
  const [serviceSaving, setServiceSaving] = useState(false);
  const [productSaving, setProductSaving] = useState(false);
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

  async function loadServiceCategories() {
    try {
      setCategories(await fetchCategories({ type: 'service' }));
    } catch {
      setCategories([]);
    }
  }

  async function loadProductCategories() {
    try {
      setProductCategories(await fetchCategories({ type: 'product' }));
    } catch {
      setProductCategories([]);
    }
  }

  useEffect(() => {
    fetchCities().then(setCities).catch(() => {});
    loadServiceCategories();
    loadProductCategories();
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
        if (p.is_service_provider) loadMyServices();
        loadMyProducts();
      }
    }).catch(() => {});
  }, [user]);

  async function loadMyServices() {
    try {
      const list = await fetchMyServices();
      setMyServices(Array.isArray(list) ? list : []);
    } catch {
      setMyServices([]);
    }
  }

  async function loadMyProducts() {
    try {
      const list = await fetchMyProducts();
      setMyProducts(Array.isArray(list) ? list : []);
    } catch {
      setMyProducts([]);
    }
  }

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
      if (form.is_service_provider) loadMyServices();
      loadMyProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  async function addService(e) {
    e.preventDefault();
    setServiceSaving(true);
    setError('');
    try {
      await createService({
        title: serviceForm.title,
        description: serviceForm.description || null,
        category_id: serviceForm.category_id || null,
      });
      setServiceForm({ title: '', description: '', category_id: '' });
      setMessage('Szolgáltatás felvéve — admin jóváhagyásra vár.');
      loadMyServices();
    } catch (err) {
      setError(err.message);
    } finally {
      setServiceSaving(false);
    }
  }

  async function removeService(id) {
    if (!window.confirm('Biztosan törlöd ezt a szolgáltatást?')) return;
    try {
      await deleteService(id);
      setMessage('Szolgáltatás törölve.');
      loadMyServices();
    } catch (err) {
      setError(err.message);
    }
  }

  async function addProduct(e) {
    e.preventDefault();
    setProductSaving(true);
    setError('');
    try {
      await createProduct({
        title: productForm.title,
        description: productForm.description || null,
        category_id: productForm.category_id || null,
        price: productForm.price ? Number(productForm.price) : null,
        unit: productForm.unit || null,
      });
      setProductForm({ title: '', description: '', category_id: '', price: '', unit: '' });
      setMessage('Termék felvéve — admin jóváhagyásra vár.');
      loadMyProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setProductSaving(false);
    }
  }

  async function removeProduct(id) {
    if (!window.confirm('Biztosan törlöd ezt a terméket?')) return;
    try {
      await deleteProduct(id);
      setMessage('Termék törölve.');
      loadMyProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl p-8 shadow-sm border border-stone-100">
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

      {form.is_service_provider && hasProfile && (
        <div className="mt-10 pt-8 border-t border-stone-200">
          <h2 className="text-xl font-bold text-emerald-900 mb-2">Szolgáltatásaim</h2>
          <p className="text-sm text-stone-500 mb-4">Az új szolgáltatások admin jóváhagyás után jelennek meg nyilvánosan.</p>

          <form onSubmit={addService} className="space-y-3 mb-6 p-4 bg-stone-50 rounded-xl border border-stone-100">
            <div>
              <label className="block text-sm font-medium mb-1">Szolgáltatás címe</label>
              <input required value={serviceForm.title} onChange={(e) => setServiceForm((s) => ({ ...s, title: e.target.value }))} className="w-full border rounded-lg px-3 py-2 bg-white" placeholder="pl. Vízvezeték-szerelés" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Leírás</label>
              <textarea rows={3} value={serviceForm.description} onChange={(e) => setServiceForm((s) => ({ ...s, description: e.target.value }))} className="w-full border rounded-lg px-3 py-2 bg-white" />
            </div>
            <div className="grid sm:grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Kategória</label>
                <select value={serviceForm.category_id} onChange={(e) => setServiceForm((s) => ({ ...s, category_id: e.target.value }))} className="w-full border rounded-lg px-3 py-2 bg-white">
                  <option value="">Válassz…</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <CategorySuggestForm
                  type="service"
                  onSuggested={() => {
                    loadServiceCategories();
                    setMessage('Kategória javaslat elküldve — admin jóváhagyásra vár.');
                  }}
                />
              </div>
            </div>
            <button type="submit" disabled={serviceSaving} className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-800 disabled:opacity-60">
              {serviceSaving ? 'Mentés…' : 'Szolgáltatás felvétele'}
            </button>
          </form>

          {myServices.length === 0 ? (
            <p className="text-stone-500 text-sm">Még nincs felvett szolgáltatásod.</p>
          ) : (
            <ul className="space-y-3">
              {myServices.map((s) => (
                <li key={s.id} className="flex items-start justify-between gap-3 p-4 bg-white border border-stone-100 rounded-xl">
                  <div>
                    <p className="font-medium text-stone-800">{s.title}</p>
                    {s.category?.name && <p className="text-sm text-stone-500">{s.category.name}</p>}
                    <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${STATUS_STYLES[s.approval_status] ?? 'bg-stone-100 text-stone-600'}`}>
                      {STATUS_LABELS[s.approval_status] ?? s.approval_status}
                    </span>
                  </div>
                  <button type="button" onClick={() => removeService(s.id)} className="text-sm text-red-500 hover:text-red-700 shrink-0">
                    Töröl
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {form.is_service_provider && !hasProfile && (
        <p className="mt-6 text-sm text-amber-700 bg-amber-50 rounded-lg px-4 py-3">Előbb mentsd el a profilodat, utána vehetsz fel szolgáltatásokat.</p>
      )}

      {hasProfile && (
        <div className="mt-10 pt-8 border-t border-stone-200">
          <h2 className="text-xl font-bold text-emerald-900 mb-2">Termékeim</h2>
          <p className="text-sm text-stone-500 mb-4">Helyi termékek, amiket kínálsz — admin jóváhagyás után jelennek meg a Termékek listán.</p>

          <form onSubmit={addProduct} className="space-y-3 mb-6 p-4 bg-stone-50 rounded-xl border border-stone-100">
            <div>
              <label className="block text-sm font-medium mb-1">Termék neve</label>
              <input required value={productForm.title} onChange={(e) => setProductForm((s) => ({ ...s, title: e.target.value }))} className="w-full border rounded-lg px-3 py-2 bg-white" placeholder="pl. Házi lekvár" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Leírás</label>
              <textarea rows={3} value={productForm.description} onChange={(e) => setProductForm((s) => ({ ...s, description: e.target.value }))} className="w-full border rounded-lg px-3 py-2 bg-white" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Kategória</label>
                <select value={productForm.category_id} onChange={(e) => setProductForm((s) => ({ ...s, category_id: e.target.value }))} className="w-full border rounded-lg px-3 py-2 bg-white">
                  <option value="">Válassz…</option>
                  {productCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <CategorySuggestForm
                  type="product"
                  onSuggested={() => {
                    loadProductCategories();
                    setMessage('Kategória javaslat elküldve — admin jóváhagyásra vár.');
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ár (Ft)</label>
                <input type="number" min="0" value={productForm.price} onChange={(e) => setProductForm((s) => ({ ...s, price: e.target.value }))} className="w-full border rounded-lg px-3 py-2 bg-white" placeholder="opcionális" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Egység</label>
              <input value={productForm.unit} onChange={(e) => setProductForm((s) => ({ ...s, unit: e.target.value }))} className="w-full border rounded-lg px-3 py-2 bg-white" placeholder="pl. kg, db, üveg" />
            </div>
            <button type="submit" disabled={productSaving} className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-800 disabled:opacity-60">
              {productSaving ? 'Mentés…' : 'Termék felvétele'}
            </button>
          </form>

          {myProducts.length === 0 ? (
            <p className="text-stone-500 text-sm">Még nincs felvett terméked.</p>
          ) : (
            <ul className="space-y-3">
              {myProducts.map((p) => (
                <li key={p.id} className="flex items-start justify-between gap-3 p-4 bg-white border border-stone-100 rounded-xl">
                  <div>
                    <p className="font-medium text-stone-800">{p.title}</p>
                    {p.category?.name && <p className="text-sm text-stone-500">{p.category.name}</p>}
                    {p.price != null && (
                      <p className="text-sm text-emerald-800 mt-1">{p.price.toLocaleString('hu-HU')} Ft{p.unit ? ` / ${p.unit}` : ''}</p>
                    )}
                    <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${STATUS_STYLES[p.approval_status] ?? 'bg-stone-100 text-stone-600'}`}>
                      {STATUS_LABELS[p.approval_status] ?? p.approval_status}
                    </span>
                  </div>
                  <button type="button" onClick={() => removeProduct(p.id)} className="text-sm text-red-500 hover:text-red-700 shrink-0">
                    Töröl
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {!hasProfile && (
        <p className="mt-6 text-sm text-amber-700 bg-amber-50 rounded-lg px-4 py-3">Előbb mentsd el a profilodat, utána vehetsz fel termékeket.</p>
      )}
    </div>
  );
}
