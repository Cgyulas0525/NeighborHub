import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api.js';

export default function RegisterPage({ onAuth }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [error, setError] = useState('');

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const data = await register(form.name, form.email, form.password, form.password_confirmation);
      onAuth(data.user);
      navigate('/profil');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl p-8 shadow-sm border border-stone-100">
      <h1 className="text-2xl font-bold text-emerald-900 mb-6">Regisztráció</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Név</label>
          <input required value={form.name} onChange={(e) => set('name', e.target.value)} className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">E-mail</label>
          <input type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Jelszó</label>
          <input type="password" required minLength={8} value={form.password} onChange={(e) => set('password', e.target.value)} className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Jelszó megerősítése</label>
          <input type="password" required value={form.password_confirmation} onChange={(e) => set('password_confirmation', e.target.value)} className="w-full border rounded-lg px-3 py-2" />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="w-full bg-emerald-700 text-white py-2.5 rounded-lg font-semibold hover:bg-emerald-800">
          Regisztráció
        </button>
      </form>
      <p className="mt-4 text-sm text-stone-600">
        Van már fiókod? <Link to="/bejelentkezes" className="text-emerald-700 font-medium">Bejelentkezés</Link>
      </p>
    </div>
  );
}
