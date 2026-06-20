import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function QuestionsPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/questions')
      .then((res) => setItems(res.data || res))
      .catch((e) => setError(e.message));
  }, []);

  const list = items.data ?? items;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-emerald-900">Közösségi kérdések</h1>
      {error && <p className="text-red-600">{error}</p>}
      <div className="space-y-4">
        {list.length === 0 && !error && <p className="text-stone-500">Még nincs kérdés.</p>}
        {list.map((q) => (
          <article key={q.id} className="bg-white rounded-xl p-5 border border-stone-100">
            <h2 className="font-semibold">{q.title}</h2>
            <p className="text-sm text-stone-500 mt-1">{q.city?.name || '—'} · {q.user?.name}</p>
            <p className="mt-2 text-stone-700 text-sm">{q.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
