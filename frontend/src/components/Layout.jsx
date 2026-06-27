import { Link, NavLink } from 'react-router-dom';
import Logo from './Logo.jsx';

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-[17px] font-medium ${isActive ? 'bg-emerald-700 text-white' : 'text-stone-700 hover:bg-stone-200'}`;

export default function Layout({ user, onLogout, children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="hover:opacity-90 transition-opacity">
            <Logo showText />
          </Link>
          <nav className="flex flex-wrap items-center gap-1">
            <NavLink to="/" className={linkClass} end>Kezdőlap</NavLink>
            <NavLink to="/szolgaltatok" className={linkClass}>Szolgáltatók</NavLink>
            <NavLink to="/termekek" className={linkClass}>Termékek</NavLink>
            <NavLink to="/szolgaltatasok" className={linkClass}>Szolgáltatások</NavLink>
            <NavLink to="/kerdesek" className={linkClass}>Kérdések</NavLink>
            {user ? (
              <>
                <NavLink to="/profil" className={linkClass}>Profilom</NavLink>
                {user.role === 'admin' && (
                  <NavLink to="/admin" className="px-3 py-2 rounded-lg text-[17px] font-medium bg-[#2d4a2b] text-white hover:bg-[#3d6335]">
                    Admin
                  </NavLink>
                )}
                <button type="button" onClick={onLogout} className="px-3 py-2 text-[17px] text-stone-600 hover:text-stone-900">
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
      <footer className="border-t border-emerald-900/10 bg-white/50 backdrop-blur-sm py-6 text-center text-[17px] text-stone-600">
        NeighborHub – Vác és környéke helyi közössége
      </footer>
    </div>
  );
}
