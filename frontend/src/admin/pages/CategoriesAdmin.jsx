import CrudPage from '../CrudPage.jsx';
import { Badge } from '../ui.jsx';

const TYPE_LABELS = { service: 'Szolgáltatás', product: 'Termék', community: 'Közösségi' };
const APPROVAL_LABELS = { pending: 'Függőben', approved: 'Jóváhagyva', rejected: 'Elutasítva' };

const columns = [
  { key: 'name', label: 'Név' },
  { key: 'slug', label: 'Slug' },
  { key: 'type', label: 'Típus', render: (r) => TYPE_LABELS[r.type] ?? r.type },
  {
    key: 'approval_status',
    label: 'Jóváhagyás',
    render: (r) => (
      <span className={`text-xs px-2 py-0.5 rounded-full ${
        r.approval_status === 'approved' ? 'bg-emerald-100 text-emerald-700'
          : r.approval_status === 'pending' ? 'bg-amber-100 text-amber-700'
            : 'bg-red-100 text-red-600'
      }`}
      >
        {APPROVAL_LABELS[r.approval_status] ?? r.approval_status}
      </span>
    ),
  },
  { key: 'active', label: 'Aktív', render: (r) => <Badge on={r.active} /> },
  { key: 'requestedBy', label: 'Javasolta', render: (r) => r.requested_by?.name ?? '—' },
];

const fields = [
  { name: 'name', label: 'Név', type: 'text' },
  { name: 'slug', label: 'Slug', type: 'text', nullable: true, hint: 'Üresen hagyva a névből generálódik.' },
  {
    name: 'type',
    label: 'Típus',
    type: 'select',
    options: [
      { value: 'service', label: 'Szolgáltatás' },
      { value: 'product', label: 'Termék' },
      { value: 'community', label: 'Közösségi' },
    ],
  },
  {
    name: 'approval_status',
    label: 'Jóváhagyás',
    type: 'select',
    options: [
      { value: 'pending', label: 'Függőben' },
      { value: 'approved', label: 'Jóváhagyva' },
      { value: 'rejected', label: 'Elutasítva' },
    ],
    default: 'approved',
  },
  { name: 'active', label: 'Aktív', type: 'checkbox', default: true },
];

export default function CategoriesAdmin() {
  return (
    <CrudPage
      title="Kategóriák"
      resource="categories"
      columns={columns}
      fields={fields}
      searchPlaceholder="Kategória keresése…"
    />
  );
}
