const base = import.meta.env.VITE_API_URL || '/api';

function readCookie(name) {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
}

export async function csrf() {
  await fetch('/sanctum/csrf-cookie', { credentials: 'include' });
}

export async function ensureCsrf() {
  if (!readCookie('XSRF-TOKEN')) {
    await csrf();
  }
}

export async function api(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  if (method !== 'GET' && method !== 'HEAD') {
    await ensureCsrf();
  }

  const xsrf = readCookie('XSRF-TOKEN');
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(xsrf ? { 'X-XSRF-TOKEN': xsrf } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${base}${path}`, {
    credentials: 'include',
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || data.email?.[0] || 'Hiba történt.');
  }
  return data;
}

export async function apiUpload(path, formData) {
  await ensureCsrf();
  const xsrf = readCookie('XSRF-TOKEN');
  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(xsrf ? { 'X-XSRF-TOKEN': xsrf } : {}),
    },
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || data.image?.[0] || 'Hiba történt a feltöltés során.');
  }
  return data;
}

export async function uploadProfileImage(file) {
  const fd = new FormData();
  fd.append('image', file);
  return apiUpload('/profile/image', fd);
}

export async function login(email, password) {
  await csrf();
  return api('/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export async function register(name, email, password, password_confirmation) {
  await csrf();
  return api('/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, password_confirmation }),
  });
}

export async function logout() {
  return api('/logout', { method: 'POST' });
}

export async function fetchUser() {
  return api('/user');
}

export async function fetchCities() {
  return api('/cities');
}

export async function fetchServices(params = {}) {
  const q = new URLSearchParams(params).toString();
  return api(`/services${q ? `?${q}` : ''}`);
}

export async function fetchProducts(params = {}) {
  const q = new URLSearchParams(params).toString();
  return api(`/products${q ? `?${q}` : ''}`);
}

export async function fetchProviders(params = {}) {
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined),
  );
  const q = new URLSearchParams(clean).toString();
  return api(`/providers${q ? `?${q}` : ''}`);
}

export async function fetchCategories(params = {}) {
  const q = new URLSearchParams(params).toString();
  return api(`/categories${q ? `?${q}` : ''}`);
}

export async function suggestCategory(name, type) {
  return api('/category-suggestions', { method: 'POST', body: JSON.stringify({ name, type }) });
}

export async function fetchPublicStats() {
  return api('/stats');
}

export async function fetchProfile(id) {
  return api(`/profiles/${id}`);
}

export async function fetchMyServices() {
  return api('/profile/me/services');
}

export async function fetchMyProducts() {
  return api('/profile/me/products');
}

export async function createService(data) {
  return api('/services', { method: 'POST', body: JSON.stringify(data) });
}

export async function createProduct(data) {
  return api('/products', { method: 'POST', body: JSON.stringify(data) });
}

export async function deleteService(id) {
  return api(`/services/${id}`, { method: 'DELETE' });
}

export async function deleteProduct(id) {
  return api(`/products/${id}`, { method: 'DELETE' });
}

export async function createQuestion(data) {
  return api('/questions', { method: 'POST', body: JSON.stringify(data) });
}
