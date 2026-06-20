import CrudPage from '../CrudPage.jsx';
import { RoleBadge, StatusBadge } from '../ui.jsx';

const columns = [
  { key: 'name', label: 'Név' },
  { key: 'email', label: 'E-mail' },
  { key: 'role', label: 'Szerep', render: (r) => <RoleBadge value={r.role} /> },
  { key: 'status', label: 'Állapot', render: (r) => <StatusBadge value={r.status} /> },
  {
    key: 'created_at',
    label: 'Regisztrált',
    render: (r) => (r.created_at ? new Date(r.created_at).toLocaleDateString('hu-HU') : '—'),
  },
];

const fields = [
  { name: 'name', label: 'Név', type: 'text' },
  { name: 'email', label: 'E-mail', type: 'text' },
  { name: 'password', label: 'Jelszó', type: 'password', hint: 'Szerkesztésnél üresen hagyva változatlan marad (min. 8 karakter).' },
  {
    name: 'role',
    label: 'Szerep',
    type: 'select',
    options: [
      { value: 'user', label: 'Felhasználó' },
      { value: 'provider', label: 'Szolgáltató' },
      { value: 'admin', label: 'Admin' },
    ],
  },
  {
    name: 'status',
    label: 'Állapot',
    type: 'select',
    options: [
      { value: 'active', label: 'Aktív' },
      { value: 'pending', label: 'Függőben' },
      { value: 'suspended', label: 'Felfüggesztve' },
    ],
  },
];

export default function UsersAdmin() {
  return <CrudPage title="Felhasználók" resource="users" columns={columns} fields={fields} searchPlaceholder="Név vagy e-mail…" />;
}
