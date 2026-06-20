import ModerationPage from '../ModerationPage.jsx';
import { Badge } from '../ui.jsx';

export default function ProfilesAdmin() {
  return (
    <ModerationPage
      title="Profilok"
      resource="profiles"
      statusField="approval_status"
      statusOptions={[
        { value: 'pending', label: 'Függőben' },
        { value: 'approved', label: 'Jóváhagyva' },
        { value: 'rejected', label: 'Elutasítva' },
      ]}
      columns={[
        { key: 'display_name', label: 'Megjelenített név' },
        { key: 'user', label: 'Felhasználó', render: (r) => r.user?.name ?? '—' },
        { key: 'email', label: 'E-mail', render: (r) => r.user?.email ?? '—' },
        { key: 'city', label: 'Település', render: (r) => r.city?.name ?? '—' },
        { key: 'is_service_provider', label: 'Szolgáltató', render: (r) => <Badge on={r.is_service_provider} onLabel="Igen" offLabel="Nem" /> },
      ]}
    />
  );
}
