import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPublicStats, fetchRecentActivity } from '../api.js';
import Logo from '../components/Logo.jsx';

const TYPE_LABELS = {
  provider: 'Szolgáltató',
  service: 'Szolgáltatás',
  product: 'Termék',
  question: 'Kérdés',
};

const TYPE_STYLES = {
  provider: 'bg-emerald-100 text-emerald-800',
  service: 'bg-sky-100 text-sky-800',
  product: 'bg-amber-100 text-amber-800',
  question: 'bg-violet-100 text-violet-800',
};

function itemLink(item) {
  switch (item.type) {
    case 'provider':
      return `/szolgaltatok/${item.id}`;
    case 'service':
      return item.profile_id ? `/szolgaltatok/${item.profile_id}` : '/szolgaltatasok';
    case 'product':
      return '/termekek';
    case 'question':
      return '/kerdesek';
    default:
      return '/';
  }
}

function formatWhen(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' });
}

const CARDS = [
  {
    title: 'Szolgáltatók',
    countKey: 'providers',
    text: 'Vízvezeték-szerelőtől a webfejlesztőig – szakma és település szerint.',
    to: '/szolgaltatok',
    bgImage: '/card-bg-providers.png',
    bgPosition: 'center 40%',
  },
  {
    title: 'Szolgáltatások',
    countKey: 'services',
    text: 'Konkrét szolgáltatás-hirdetések kategória és település szerint.',
    to: '/szolgaltatasok',
    bgImage: '/card-bg-services.png',
    bgPosition: 'center 45%',
  },
  {
    title: 'Termékek',
    countKey: 'products',
    text: 'Helyi termelők és kézművesek kínálata a környékről.',
    to: '/termekek',
    bgImage: '/card-bg-products.png',
    bgPosition: 'center 50%',
  },
  {
    title: 'Kérdések',
    countKey: null,
    text: '„Kit ajánlotok Vácon…?” – közösségi ajánlások.',
    to: '/kerdesek',
    bgImage: '/card-bg-questions.png',
    bgPosition: 'center 42%',
  },
];

const HERO_TEXT_SHADOW =
  '[text-shadow:0_0_12px_rgb(255_255_255/1),0_0_24px_rgb(253_249_240/0.95),0_1px_3px_rgb(255_255_255/1)]';

export default function Home() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    fetchPublicStats().then(setStats).catch(() => setStats(null));
    fetchRecentActivity()
      .then((res) => setRecent(res.items ?? []))
      .catch(() => setRecent([]));
  }, []);

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-emerald-900/10 shadow-md min-h-[520px] md:min-h-[480px]">
        <img
          src="/hero-community.png"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: '18% center' }}
        />
        <div className="relative z-10 flex min-h-[520px] md:min-h-[480px] items-center">
          <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-14">
            <p className={`text-stone-900 text-[17px] uppercase tracking-widest mb-3 font-semibold ${HERO_TEXT_SHADOW}`}>Helyi közösség</p>
            <h1 className={`text-[33px] md:text-[39px] lg:text-[51px] font-bold leading-tight text-stone-900 ${HERO_TEXT_SHADOW}`}>
              Találd meg, ajánld és támogasd a környék szakembereit
            </h1>
            <p className={`mt-4 max-w-xl text-[21px] md:text-[22px] font-medium leading-relaxed text-stone-900 ${HERO_TEXT_SHADOW}`}>
              Vác, Dunakeszi, Göd és a környék településein – megbízható szolgáltatók, termelők és helyi termékek egy helyen.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-900/10 shadow-sm bg-white/90 p-6 md:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {CARDS.map((card) => {
            const count = card.countKey && stats ? stats[card.countKey] : null;
            return (
              <Link
                key={card.to}
                to={card.to}
                className="group flex flex-col overflow-hidden rounded-xl border border-emerald-900/10 bg-white hover:border-emerald-300 hover:shadow-md transition"
              >
                <div className="relative h-[220px] md:h-[260px] overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-no-repeat transition duration-300 group-hover:scale-105"
                    style={{ backgroundImage: `url('${card.bgImage}')`, backgroundPosition: card.bgPosition ?? 'center' }}
                    aria-hidden
                  />
                </div>
                <div className="p-5 md:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-[27px] md:text-[33px] font-bold text-emerald-900">{card.title}</h2>
                    {count != null && (
                      <span className="shrink-0 text-[33px] font-bold bg-emerald-50 text-emerald-700 px-5 py-1 rounded-full tabular-nums border-2 border-emerald-200">
                        {count}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[17px] text-stone-600 leading-relaxed">{card.text}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-900/10 shadow-sm px-8 py-10 md:px-12 md:py-12 bg-gradient-to-br from-white/90 via-cream to-sand backdrop-blur-sm">
        <div className="grid md:grid-cols-[1fr_auto] gap-8 md:gap-12 items-start">
          <div>
            <h2 className="text-[27px] md:text-[33px] font-bold text-emerald-900">Mi a NeighborHub?</h2>
            <p className="mt-4 text-stone-600 text-[21px] leading-relaxed max-w-3xl">
              A NeighborHub a Vác és környéki települések helyi ajánló oldala. Nem hirdetési portál —
              közösségi alapú: itt a szomszédok, ismerősök és helyi szakemberek ajánlásai számítanak.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 shrink-0 mx-auto md:mx-0 md:pt-1">
            <Logo className="h-28 w-28 md:h-36 md:w-36" />
            <span className="text-[23px] font-bold text-emerald-800 tracking-tight">NeighborHub</span>
          </div>
        </div>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="rounded-xl bg-white/60 border border-emerald-900/5 p-5">
            <h3 className="text-[19px] font-semibold text-emerald-800">Megbízható szolgáltatók</h3>
            <p className="mt-2 text-stone-600 text-[17px] leading-relaxed">
              Regisztrált szakemberek és termelők mutatkoznak be profiljukon. A jóváhagyott profilok
              és hirdetések csak ellenőrzés után jelennek meg nyilvánosan.
            </p>
          </div>
          <div className="rounded-xl bg-white/60 border border-emerald-900/5 p-5">
            <h3 className="text-[19px] font-semibold text-emerald-800">Helyi ajánlások</h3>
            <p className="mt-2 text-stone-600 text-[17px] leading-relaxed">
              Kérdezz a közösségtől: „Kit ajánlotok vízvezeték-szerelőnek Gödön?” — és olvasd el,
              kiket támogatnak a környékbeliek valódi tapasztalat alapján.
            </p>
          </div>
          <div className="rounded-xl bg-white/60 border border-emerald-900/5 p-5">
            <h3 className="text-[19px] font-semibold text-emerald-800">Te is részt vehetsz</h3>
            <p className="mt-2 text-stone-600 text-[17px] leading-relaxed">
              Szolgáltatóként hirdethetsz, termelőként kínálhatsz terméket, vagy egyszerűen
              ajánlhatsz egy megbízható mestert — így erősödik a helyi hálózat.
            </p>
          </div>
        </div>
      </section>

      {recent.length > 0 && (
        <section className="grid md:grid-cols-2 gap-6">
          <article className="rounded-xl border border-emerald-900/10 bg-white shadow-sm overflow-hidden p-6 md:p-8 flex flex-col justify-center order-2 md:order-1">
            <div className="mb-5">
              <h2 className="text-[27px] font-bold text-emerald-900">Újdonságok</h2>
              <p className="text-[17px] text-stone-600 mt-1">Az elmúlt 7 napban felkerült tartalmak</p>
            </div>
            <ul className="divide-y divide-emerald-900/10 rounded-xl bg-cream/40 border border-emerald-900/5 overflow-hidden">
              {recent.map((item) => (
                <li key={`${item.type}-${item.id}`}>
                  <Link
                    to={itemLink(item)}
                    className="flex flex-wrap items-center gap-3 py-4 px-4 hover:bg-white/80 transition-colors"
                  >
                    <span className={`text-[15px] font-medium px-2.5 py-1 rounded-full shrink-0 ${TYPE_STYLES[item.type] ?? 'bg-stone-100 text-stone-600'}`}>
                      {TYPE_LABELS[item.type] ?? item.type}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[19px] font-medium text-stone-800 truncate">{item.title}</p>
                      {item.subtitle && (
                        <p className="text-[17px] text-stone-500 truncate">{item.subtitle}</p>
                      )}
                    </div>
                    <time className="text-[15px] text-stone-400 shrink-0 tabular-nums">{formatWhen(item.created_at)}</time>
                  </Link>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-xl border border-emerald-900/10 bg-white shadow-sm overflow-hidden relative order-1 md:order-2 min-h-[220px] md:min-h-[320px]">
            <img
              src="/recent-section-bg.png"
              alt="Helyi piactér: szomszédok, szakemberek és termelők a környéken"
              className="absolute inset-0 h-full w-full object-cover object-[center_38%]"
            />
          </article>
        </section>
      )}
    </div>
  );
}
