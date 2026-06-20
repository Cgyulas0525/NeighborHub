import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import QuestionsPage from './pages/QuestionsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import { fetchUser, logout } from './api.js';

export default function App() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetchUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setReady(true));
  }, []);

  async function handleLogout() {
    try {
      await logout();
    } finally {
      setUser(null);
    }
  }

  if (!ready) {
    return <div className="min-h-screen grid place-items-center text-stone-500">Betöltés…</div>;
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/szolgaltatok" element={<ServicesPage />} />
        <Route path="/termekek" element={<ProductsPage />} />
        <Route path="/kerdesek" element={<QuestionsPage />} />
        <Route path="/bejelentkezes" element={user ? <Navigate to="/profil" /> : <LoginPage onAuth={setUser} />} />
        <Route path="/regisztracio" element={user ? <Navigate to="/profil" /> : <RegisterPage onAuth={setUser} />} />
        <Route path="/profil" element={user ? <ProfilePage user={user} /> : <Navigate to="/bejelentkezes" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}
