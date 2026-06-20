export function Badge({ on, onLabel = 'Aktív', offLabel = 'Inaktív' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        on ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'
      }`}
    >
      {on ? onLabel : offLabel}
    </span>
  );
}

const STATUS_STYLES = {
  approved: 'bg-emerald-100 text-emerald-700',
  open: 'bg-emerald-100 text-emerald-700',
  active: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  rejected: 'bg-red-100 text-red-600',
  suspended: 'bg-red-100 text-red-600',
  closed: 'bg-stone-100 text-stone-500',
};

const STATUS_LABELS = {
  approved: 'Jóváhagyva',
  pending: 'Függőben',
  rejected: 'Elutasítva',
  open: 'Nyitott',
  closed: 'Lezárva',
  active: 'Aktív',
  suspended: 'Felfüggesztve',
};

export function StatusBadge({ value }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[value] ?? 'bg-stone-100 text-stone-500'}`}>
      {STATUS_LABELS[value] ?? value ?? '—'}
    </span>
  );
}

export function RoleBadge({ value }) {
  const styles = {
    admin: 'bg-purple-100 text-purple-700',
    provider: 'bg-sky-100 text-sky-700',
    user: 'bg-stone-100 text-stone-600',
  };
  const labels = { admin: 'Admin', provider: 'Szolgáltató', user: 'Felhasználó' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[value] ?? 'bg-stone-100 text-stone-600'}`}>
      {labels[value] ?? value}
    </span>
  );
}
