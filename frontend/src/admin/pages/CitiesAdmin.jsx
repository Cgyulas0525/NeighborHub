import CrudPage from '../CrudPage.jsx';
import { Badge } from '../ui.jsx';

const columns = [
  { key: 'name', label: 'Név' },
  { key: 'county', label: 'Megye' },
  { key: 'postal_code', label: 'Irányítószám' },
  { key: 'active', label: 'Állapot', render: (r) => <Badge on={r.active} /> },
];

const fields = [
  { name: 'name', label: 'Név', type: 'text' },
  { name: 'county', label: 'Megye', type: 'text', nullable: true },
  { name: 'postal_code', label: 'Irányítószám', type: 'text', nullable: true },
  { name: 'active', label: 'Aktív', type: 'checkbox', default: true },
];

export default function CitiesAdmin() {
  return <CrudPage title="Városok" resource="cities" columns={columns} fields={fields} searchPlaceholder="Város keresése…" />;
}
