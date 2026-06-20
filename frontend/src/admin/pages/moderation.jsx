import ModerationPage from '../ModerationPage.jsx';

export function ServicesAdmin() {
  return (
    <ModerationPage
      title="Szolgáltatások"
      resource="services"
      statusField="approval_status"
      statusOptions={[
        { value: 'pending', label: 'Függőben' },
        { value: 'approved', label: 'Jóváhagyva' },
        { value: 'rejected', label: 'Elutasítva' },
      ]}
      columns={[
        { key: 'title', label: 'Cím' },
        { key: 'profile', label: 'Szolgáltató', render: (r) => r.profile?.display_name ?? '—' },
        { key: 'category', label: 'Kategória', render: (r) => r.category?.name ?? '—' },
        { key: 'city', label: 'Település', render: (r) => r.city?.name ?? '—' },
      ]}
    />
  );
}

export function ProductsAdmin() {
  return (
    <ModerationPage
      title="Termékek"
      resource="products"
      statusField="approval_status"
      statusOptions={[
        { value: 'pending', label: 'Függőben' },
        { value: 'approved', label: 'Jóváhagyva' },
        { value: 'rejected', label: 'Elutasítva' },
      ]}
      columns={[
        { key: 'title', label: 'Cím' },
        { key: 'profile', label: 'Eladó', render: (r) => r.profile?.display_name ?? '—' },
        { key: 'category', label: 'Kategória', render: (r) => r.category?.name ?? '—' },
        { key: 'price', label: 'Ár', render: (r) => (r.price ? `${r.price.toLocaleString('hu-HU')} Ft` : '—') },
      ]}
    />
  );
}

export function QuestionsAdmin() {
  return (
    <ModerationPage
      title="Kérdések"
      resource="questions"
      statusField="status"
      statusOptions={[
        { value: 'open', label: 'Nyitott' },
        { value: 'closed', label: 'Lezárva' },
      ]}
      columns={[
        { key: 'title', label: 'Cím' },
        { key: 'user', label: 'Kérdező', render: (r) => r.user?.name ?? '—' },
        { key: 'city', label: 'Település', render: (r) => r.city?.name ?? '—' },
      ]}
    />
  );
}

export function RecommendationsAdmin() {
  return (
    <ModerationPage
      title="Ajánlások"
      resource="recommendations"
      searchable={false}
      statusField="status"
      statusOptions={[
        { value: 'pending', label: 'Függőben' },
        { value: 'approved', label: 'Jóváhagyva' },
        { value: 'rejected', label: 'Elutasítva' },
      ]}
      columns={[
        { key: 'recommender', label: 'Ajánló', render: (r) => r.recommender?.name ?? '—' },
        { key: 'profile', label: 'Ajánlott', render: (r) => r.profile?.display_name ?? '—' },
        { key: 'rating', label: 'Értékelés', render: (r) => (r.rating ? `${r.rating} ★` : '—') },
        {
          key: 'text',
          label: 'Szöveg',
          render: (r) => (r.text ? <span className="text-stone-500">{r.text.slice(0, 60)}{r.text.length > 60 ? '…' : ''}</span> : '—'),
        },
      ]}
    />
  );
}
