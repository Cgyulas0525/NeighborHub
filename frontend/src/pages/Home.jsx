import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white p-10 md:p-14">
        <p className="text-emerald-200 text-sm uppercase tracking-widest mb-3">Helyi közösség</p>
        <h1 className="text-3xl md:text-5xl font-bold max-w-2xl leading-tight">
          Találd meg, ajánld és támogasd a környék szakembereit
        </h1>
        <p className="mt-4 text-emerald-100 max-w-xl text-lg">
          Vác, Dunakeszi, Göd és a környék településein – megbízható szolgáltatók, termelők és helyi termékek egy helyen.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/szolgaltatok" className="bg-white text-emerald-900 px-5 py-3 rounded-xl font-semibold hover:bg-emerald-50">
            Szolgáltatók böngészése
          </Link>
          <Link to="/regisztracio" className="border border-white/40 px-5 py-3 rounded-xl font-semibold hover:bg-white/10">
            Csatlakozom
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        {[
          { title: 'Szolgáltatók', text: 'Vízvezeték-szerelőtől a webfejlesztőig – skill és település szerint.', to: '/szolgaltatok' },
          { title: 'Termékek', text: 'Helyi termelők és kézművesek kínálata a környékről.', to: '/termekek' },
          { title: 'Kérdések', text: '„Kit ajánlotok Vácon…?” – közösségi ajánlások.', to: '/kerdesek' },
        ].map((card) => (
          <Link key={card.to} to={card.to} className="block bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:border-emerald-200 hover:shadow-md transition">
            <h2 className="text-lg font-bold text-emerald-900">{card.title}</h2>
            <p className="mt-2 text-stone-600 text-sm">{card.text}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
