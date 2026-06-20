import { Link, NavLink } from 'react-router-dom';

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-emerald-700 text-white' : 'text-stone-700 hover:bg-stone-200'}`;

export default function Layout({ user, onLogout, children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="text-xl font-bold text-emerald-800 tracking-tight">
            NeighborHub
          </Link>
          <nav className="flex flex-wrap items-center gap-1">
            <NavLink to="/" className={linkClass} end>Kezdőlap</NavLink>
            <NavLink to="/szolgaltatok" className={linkClass}>Szolgáltatók</NavLink>
            <NavLink to="/termekek" className={linkClass}>Termékek</NavLink>
            <NavLink to="/kerdesek" className={linkClass}>Kérdések</NavLink>
            {user ? (
              <>
                <NavLink to="/profil" className={linkClass}>Profilom</NavLink>
                <button type="button" onClick={onLogout} className="px-3 py-2 text-sm text-stone-600 hover:text-stone-900">
                  Kijelentkezés
                </button>
              </>
            ) : (
              <>
                <NavLink to="/bejelentkezes" className={linkClass}>Bejelentkezés</NavLink>
                <NavLink to="/regisztracio" className={linkClass}>Regisztráció</NavLink>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">{children}</main>
      <footer className="border-t border-stone-200 py-6 text-center text-sm text-stone-500">
        NeighborHub – Vác és környéke helyi közössége
      </footer>
    </div>
  );
}
