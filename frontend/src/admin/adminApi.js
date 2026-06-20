import { api } from '../api.js';

function buildQuery(params = {}) {
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined),
  );
  const q = new URLSearchParams(clean).toString();
  return q ? `?${q}` : '';
}

export function crud(resource) {
  return {
    list: (params = {}) => api(`/admin/${resource}${buildQuery(params)}`),
    create: (data) => api(`/admin/${resource}`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => api(`/admin/${resource}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id) => api(`/admin/${resource}/${id}`, { method: 'DELETE' }),
  };
}

export function fetchStats() {
  return api('/admin/stats');
}
