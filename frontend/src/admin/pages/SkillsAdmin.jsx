import { useEffect, useState } from 'react';
import CrudPage from '../CrudPage.jsx';
import { crud } from '../adminApi.js';
import { Badge } from '../ui.jsx';

const columns = [
  { key: 'name', label: 'Név' },
  { key: 'slug', label: 'Slug' },
  { key: 'category', label: 'Kategória', render: (r) => r.category?.name ?? '—' },
  { key: 'active', label: 'Állapot', render: (r) => <Badge on={r.active} /> },
];

export default function SkillsAdmin() {
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    crud('categories')
      .list({ page: 1 })
      .then((data) => setCategoryOptions((data.data ?? []).map((c) => ({ value: c.id, label: c.name }))))
      .catch(() => setCategoryOptions([]));
  }, []);

  const fields = [
    { name: 'name', label: 'Név', type: 'text' },
    { name: 'slug', label: 'Slug', type: 'text', nullable: true, hint: 'Üresen hagyva a névből generálódik.' },
    { name: 'category_id', label: 'Kategória', type: 'select', nullable: true, options: categoryOptions },
    { name: 'active', label: 'Aktív', type: 'checkbox', default: true },
  ];

  return <CrudPage title="Szakmák" resource="skills" columns={columns} fields={fields} searchPlaceholder="Szakma keresése…" />;
}
