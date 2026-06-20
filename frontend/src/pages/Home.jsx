import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPublicStats } from '../api.js';

const CARDS = [
  {
    title: 'Szolgáltatók',
    countKey: 'providers',
    text: 'Vízvezeték-szerelőtől a webfejlesztőig – skill és település szerint.',
    to: '/szolgaltatok',
  },
  {
    title: 'Szolgáltatások',
    countKey: 'services',
    text: 'Konkrét szolgáltatás-hirdetések kategória és település szerint.',
    to: '/szolgaltatasok',
  },
  {
    title: 'Termékek',
    countKey: 'products',
    text: 'Helyi termelők és kézművesek kínálata a környékről.',
    to: '/termekek',
  },
  {
    title: 'Kérdések',
    countKey: null,
    text: '„Kit ajánlotok Vácon…?” – közösségi ajánlások.',
    to: '/kerdesek',
  },
];

export default function Home({ user }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchPublicStats().then(setStats).catch(() => setStats(null));
  }, []);

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 items-center p-10 md:p-14">
          <div>
            <p className="text-emerald-200 text-sm uppercase tracking-widest mb-3">Helyi közösség</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Találd meg, ajánld és támogasd a környék szakembereit
            </h1>
            <p className="mt-4 text-emerald-100 text-lg">
              Vác, Dunakeszi, Göd és a környék településein – megbízható szolgáltatók, termelők és helyi termékek egy helyen.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/szolgaltatok" className="bg-white text-emerald-900 px-5 py-3 rounded-xl font-semibold hover:bg-emerald-50">
                Szolgáltatók
              </Link>
              <Link to="/szolgaltatasok" className="bg-white/90 text-emerald-900 px-5 py-3 rounded-xl font-semibold hover:bg-white">
                Szolgáltatások
              </Link>
              <Link to="/termekek" className="bg-white/90 text-emerald-900 px-5 py-3 rounded-xl font-semibold hover:bg-white">
                Termékek
              </Link>
              {!user && (
                <Link to="/regisztracio" className="border border-white/40 px-5 py-3 rounded-xl font-semibold hover:bg-white/10">
                  Csatlakozom
                </Link>
              )}
            </div>
          </div>
          <div className="relative hidden md:block">
            <img
              src="/hero-community.png"
              alt="Szomszédok segítik egymást a helyi közösségben"
              className="w-full max-w-md mx-auto rounded-2xl shadow-2xl ring-1 ring-white/20"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-900/10 shadow-sm px-8 py-10 md:px-12 md:py-12 bg-gradient-to-br from-white/90 via-cream to-sand backdrop-blur-sm">
        <h2 className="text-2xl md:text-3xl font-bold text-emerald-900">Mi a NeighborHub?</h2>
        <p className="mt-4 text-stone-600 text-lg leading-relaxed max-w-3xl">
          A NeighborHub a Vác és környéki települések helyi ajánló oldala. Nem hirdetési portál —
          közösségi alapú: itt a szomszédok, ismerősök és helyi szakemberek ajánlásai számítanak.
        </p>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="rounded-xl bg-white/60 border border-emerald-900/5 p-5">
            <h3 className="font-semibold text-emerald-800">Megbízható szolgáltatók</h3>
            <p className="mt-2 text-stone-600 text-sm leading-relaxed">
              Regisztrált szakemberek és termelők mutatkoznak be profiljukon. A jóváhagyott profilok
              és hirdetések csak ellenőrzés után jelennek meg nyilvánosan.
            </p>
          </div>
          <div className="rounded-xl bg-white/60 border border-emerald-900/5 p-5">
            <h3 className="font-semibold text-emerald-800">Helyi ajánlások</h3>
            <p className="mt-2 text-stone-600 text-sm leading-relaxed">
              Kérdezz a közösségtől: „Kit ajánlotok vízvezeték-szerelőnek Gödön?” — és olvasd el,
              kiket támogatnak a környékbeliek valódi tapasztalat alapján.
            </p>
          </div>
          <div className="rounded-xl bg-white/60 border border-emerald-900/5 p-5">
            <h3 className="font-semibold text-emerald-800">Te is részt vehetsz</h3>
            <p className="mt-2 text-stone-600 text-sm leading-relaxed">
              Szolgáltatóként hirdethetsz, termelőként kínálhatsz terméket, vagy egyszerűen
              ajánlhatsz egy megbízható mestert — így erősödik a helyi hálózat.
            </p>
          </div>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {CARDS.map((card) => {
          const count = card.countKey && stats ? stats[card.countKey] : null;
          return (
            <Link
              key={card.to}
              to={card.to}
              className="block bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:border-emerald-200 hover:shadow-md transition"
            >
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="text-lg font-bold text-emerald-900">{card.title}</h2>
                {count != null && (
                  <span className="text-sm font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full tabular-nums">
                    {count}
                  </span>
                )}
              </div>
              <p className="mt-2 text-stone-600 text-sm">{card.text}</p>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
