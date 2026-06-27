import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, createAnswer, createQuestion, fetchCategories, fetchCities } from '../api.js';
import PageHero from '../components/PageHero.jsx';

const emptyForm = { title: '', body: '', city_id: '', category_id: '' };

function appendAnswer(answers, parentId, newAnswer) {
  if (!parentId) {
    return [...answers, { ...newAnswer, replies: newAnswer.replies || [] }];
  }
  return answers.map((a) => {
    if (a.id === parentId) {
      return { ...a, replies: [...(a.replies || []), { ...newAnswer, replies: newAnswer.replies || [] }] };
    }
    if (a.replies?.length) {
      return { ...a, replies: appendAnswer(a.replies, parentId, newAnswer) };
    }
    return a;
  });
}

function updateQuestionAnswers(items, questionId, updater) {
  const patch = (rows) =>
    rows.map((q) => {
      if (q.id !== questionId) return q;
      const roots = q.root_answers ?? q.rootAnswers ?? [];
      const next = updater(roots);
      return {
        ...q,
        root_answers: next,
        rootAnswers: next,
        answers_count: (q.answers_count ?? roots.length) + 1,
      };
    });

  if (items.data !== undefined) {
    return { ...items, data: patch(items.data) };
  }
  return patch(items);
}

function ReplyForm({ user, questionId, parentId, parentAuthor, onSuccess, onCancel }) {
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const created = await createAnswer(questionId, {
        body: body.trim(),
        parent_id: parentId || null,
      });
      setBody('');
      onSuccess(created);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return (
      <p className="text-xs text-stone-500 mt-2">
        Válaszhoz{' '}
        <Link to="/bejelentkezes" className="text-emerald-700 hover:underline">jelentkezz be</Link>.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 space-y-2">
      {parentAuthor && (
        <p className="text-xs text-stone-500">Válasz neki: <span className="font-medium">{parentAuthor}</span></p>
      )}
      <textarea
        required
        rows={2}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 text-sm"
        placeholder="Írd meg a válaszod…"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="text-sm bg-emerald-700 text-white px-3 py-1.5 rounded-lg disabled:opacity-60"
        >
          {saving ? 'Küldés…' : 'Küldés'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-sm text-stone-500 px-2">
            Mégse
          </button>
        )}
      </div>
    </form>
  );
}

function AnswerThread({ answer, questionId, user, replyKey, openReply, setOpenReply, depth = 0 }) {
  const isOpen = openReply === `${questionId}-${answer.id}`;

  return (
    <div className={depth > 0 ? 'mt-3 pl-4 border-l-2 border-emerald-100' : ''}>
      <div className="bg-stone-50 rounded-lg px-3 py-2">
        <p className="text-xs font-medium text-emerald-800">{answer.user?.name || 'Felhasználó'}</p>
        <p className="text-sm text-stone-700 whitespace-pre-wrap mt-0.5">{answer.body}</p>
        {user && (
          <button
            type="button"
            onClick={() => setOpenReply(isOpen ? null : `${questionId}-${answer.id}`)}
            className="text-xs text-emerald-700 hover:underline mt-1"
          >
            {isOpen ? 'Mégse' : 'Válasz'}
          </button>
        )}
      </div>
      {isOpen && (
        <ReplyForm
          user={user}
          questionId={questionId}
          parentId={answer.id}
          parentAuthor={answer.user?.name}
          onSuccess={(created) => {
            setOpenReply(null);
            replyKey.onAnswer(created);
          }}
          onCancel={() => setOpenReply(null)}
        />
      )}
      {(answer.replies || []).map((r) => (
        <AnswerThread
          key={r.id}
          answer={r}
          questionId={questionId}
          user={user}
          replyKey={replyKey}
          openReply={openReply}
          setOpenReply={setOpenReply}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}

function QuestionCard({ question, user, onAnswer }) {
  const [openReply, setOpenReply] = useState(null);
  const roots = question.root_answers ?? question.rootAnswers ?? [];
  const count = question.answers_count ?? roots.length;
  const replyKey = { onAnswer: (created) => onAnswer(question.id, created) };

  return (
    <article className="bg-white rounded-xl p-5 border border-stone-100">
      <h2 className="font-semibold">{question.title}</h2>
      <p className="text-sm text-stone-500 mt-1">
        {[question.city?.name, question.category?.name, question.user?.name].filter(Boolean).join(' · ') || '—'}
      </p>
      <p className="mt-2 text-stone-700 text-sm whitespace-pre-wrap">{question.body}</p>

      <div className="mt-4 pt-4 border-t border-stone-100">
        <div className="flex items-center justify-between gap-2 mb-3">
          <p className="text-sm font-medium text-stone-600">
            {count === 0 ? 'Még nincs válasz' : `${count} válasz`}
          </p>
          {user && openReply !== `${question.id}-root` && (
            <button
              type="button"
              onClick={() => setOpenReply(`${question.id}-root`)}
              className="text-sm text-emerald-700 font-medium hover:underline"
            >
              + Válasz
            </button>
          )}
        </div>

        {openReply === `${question.id}-root` && (
          <ReplyForm
            user={user}
            questionId={question.id}
            parentId={null}
            onSuccess={(created) => {
              setOpenReply(null);
              onAnswer(question.id, created);
            }}
            onCancel={() => setOpenReply(null)}
          />
        )}

        <div className="space-y-3 mt-3">
          {roots.map((a) => (
            <AnswerThread
              key={a.id}
              answer={a}
              questionId={question.id}
              user={user}
              replyKey={replyKey}
              openReply={openReply}
              setOpenReply={setOpenReply}
            />
          ))}
        </div>
      </div>
    </article>
  );
}

export default function QuestionsPage({ user }) {
  const [items, setItems] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [message, setMessage] = useState('');

  const loadQuestions = useCallback(() => {
    api('/questions')
      .then((res) => setItems(res.data || res))
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    loadQuestions();
    fetchCities().then(setCities).catch(() => {});
    fetchCategories({ type: 'service' }).then(setCategories).catch(() => {});
  }, [loadQuestions]);

  const list = items.data ?? items;

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleNewAnswer(questionId, created) {
    setItems((prev) =>
      updateQuestionAnswers(prev, questionId, (roots) =>
        appendAnswer(roots, created.parent_id ?? null, created),
      ),
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    setMessage('');
    try {
      const payload = {
        title: form.title.trim(),
        body: form.body.trim(),
        city_id: form.city_id ? Number(form.city_id) : null,
        category_id: form.category_id ? Number(form.category_id) : null,
      };
      const created = await createQuestion(payload);
      setForm(emptyForm);
      setFormOpen(false);
      setMessage('Kérdésed sikeresen felkerült.');
      setItems((prev) => {
        const rows = prev.data ?? prev;
        const next = [{ ...created, root_answers: [], answers_count: 0 }, ...rows];
        return prev.data !== undefined ? { ...prev, data: next } : next;
      });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHero
        title="Kérdések"
        subtitle="„Kit ajánlotok Vácon…?” – kérdezz a szomszédoktól, ajánlások és helyi tippek."
        image="/card-bg-questions.png"
        imagePosition="center 42%"
        actions={
          user && !formOpen ? (
            <button
              type="button"
              onClick={() => setFormOpen(true)}
              className="text-[17px] font-medium bg-emerald-700 text-white px-4 py-2 rounded-lg hover:bg-emerald-800 shrink-0"
            >
              + Új kérdés
            </button>
          ) : !user ? (
            <Link
              to="/bejelentkezes"
              className="text-[17px] font-medium border border-emerald-600 text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-50 shrink-0"
            >
              Bejelentkezés kérdés felvételéhez
            </Link>
          ) : null
        }
      />

      {message && <p className="text-emerald-700 text-sm bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-2">{message}</p>}

      {user ? (
        formOpen && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl p-5 border border-emerald-100 space-y-4 shadow-sm">
            <h2 className="font-semibold text-emerald-900">Új kérdés felvétele</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Cím *</label>
              <input
                required
                maxLength={255}
                value={form.title}
                onChange={(e) => setField('title', e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Pl. Ki tud ajánlani megbízható vízvezeték-szerelőt?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kérdés szövege *</label>
              <textarea
                required
                rows={4}
                value={form.body}
                onChange={(e) => setField('body', e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Írd le részletesen, miben tudnának segíteni…"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Település</label>
                <select
                  value={form.city_id}
                  onChange={(e) => setField('city_id', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 bg-white"
                >
                  <option value="">— válassz —</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Témakör</label>
                <select
                  value={form.category_id}
                  onChange={(e) => setField('category_id', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 bg-white"
                >
                  <option value="">— válassz —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            {formError && <p className="text-sm text-red-600">{formError}</p>}
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-60">
                {saving ? 'Küldés…' : 'Kérdés közzététele'}
              </button>
              <button
                type="button"
                onClick={() => { setFormOpen(false); setFormError(''); }}
                className="text-stone-500 px-3 py-2 text-sm"
              >
                Mégse
              </button>
            </div>
          </form>
        )
      ) : (
        <p className="text-sm text-stone-600 bg-stone-50 border border-stone-100 rounded-lg px-4 py-3">
          Kérdés felvételéhez{' '}
          <Link to="/bejelentkezes" className="text-emerald-700 font-medium hover:underline">jelentkezz be</Link>
          {' '}vagy{' '}
          <Link to="/regisztracio" className="text-emerald-700 font-medium hover:underline">regisztrálj</Link>.
        </p>
      )}

      {error && <p className="text-red-600">{error}</p>}
      <div className="space-y-4">
        {list.length === 0 && !error && <p className="text-stone-500">Még nincs kérdés.</p>}
        {list.map((q) => (
          <QuestionCard key={q.id} question={q} user={user} onAnswer={handleNewAnswer} />
        ))}
      </div>
    </div>
  );
}
