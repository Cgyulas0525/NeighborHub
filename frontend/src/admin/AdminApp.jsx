import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import CitiesAdmin from './pages/CitiesAdmin.jsx';
import CategoriesAdmin from './pages/CategoriesAdmin.jsx';
import SkillsAdmin from './pages/SkillsAdmin.jsx';
import UsersAdmin from './pages/UsersAdmin.jsx';
import ProfilesAdmin from './pages/ProfilesAdmin.jsx';
import { ServicesAdmin, ProductsAdmin, QuestionsAdmin, RecommendationsAdmin } from './pages/moderation.jsx';

export default function AdminApp({ user, onLogout }) {
  return (
    <AdminLayout user={user} onLogout={onLogout}>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="varosok" element={<CitiesAdmin />} />
        <Route path="kategoriak" element={<CategoriesAdmin />} />
        <Route path="szakmak" element={<SkillsAdmin />} />
        <Route path="felhasznalok" element={<UsersAdmin />} />
        <Route path="profilok" element={<ProfilesAdmin />} />
        <Route path="szolgaltatasok" element={<ServicesAdmin />} />
        <Route path="termekek" element={<ProductsAdmin />} />
        <Route path="kerdesek" element={<QuestionsAdmin />} />
        <Route path="ajanlasok" element={<RecommendationsAdmin />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
}
