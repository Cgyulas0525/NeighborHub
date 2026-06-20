const base = import.meta.env.VITE_API_URL || '/api';

async function csrf() {
  await fetch('/sanctum/csrf-cookie', { credentials: 'include' });
}

export async function api(path, options = {}) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
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
