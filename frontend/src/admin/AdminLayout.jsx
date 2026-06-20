import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Logo from '../components/Logo.jsx';

const NAV = [
  { to: '/admin', label: 'Vezérlőpult', end: true, icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6' },
  { group: 'Törzsadatok' },
  { to: '/admin/varosok', label: 'Városok', icon: 'M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z' },
  { to: '/admin/kategoriak', label: 'Kategóriák', icon: 'M7 7h.01M7 3h5a2 2 0 011.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A2 2 0 013 11V6a3 3 0 013-3z' },
  { to: '/admin/szakmak', label: 'Szakmák', icon: 'M21 13.255A23.93 23.93 0 0112 15c-3.18 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { to: '/admin/felhasznalok', label: 'Felhasználók', icon: 'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4z' },
  { group: 'Tartalom' },
  { to: '/admin/profilok', label: 'Profilok', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { to: '/admin/szolgaltatasok', label: 'Szolgáltatások', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { to: '/admin/termekek', label: 'Termékek', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { to: '/admin/kerdesek', label: 'Kérdések', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { to: '/admin/ajanlasok', label: 'Ajánlások', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
];

export default function AdminLayout({ user, onLogout, children }) {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-white/15 text-white' : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
    }`;

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-5 h-16 flex items-center border-b border-white/10">
        <Link to="/admin" className="hover:opacity-90 transition-opacity">
          <Logo showText variant="admin" className="h-8 w-8" />
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV.map((item, i) =>
          item.group ? (
            <p key={`g-${i}`} className="px-4 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-300/60">
              {item.group}
            </p>
          ) : (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass} onClick={() => setOpen(false)}>
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {item.label}
            </NavLink>
          ),
        )}
      </nav>
      <div className="px-3 py-4 border-t border-white/10">
        <Link to="/" className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-emerald-100/80 hover:bg-white/10 hover:text-white">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Vissza az oldalra
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fdfaf3]">
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 bg-[#2d4a2b]">{sidebar}</aside>

      {open && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-[#2d4a2b]">{sidebar}</aside>
        </div>
      )}

      <div className="md:pl-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 h-16 bg-[#3d6335] text-white flex items-center justify-between px-4 md:px-8 shadow-sm">
          <button type="button" className="md:hidden p-2 -ml-2" onClick={() => setOpen(true)} aria-label="Menü">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-semibold tracking-tight">Adminisztráció</span>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-emerald-100">{user?.name}</span>
            <button
              type="button"
              onClick={onLogout}
              className="text-sm bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg transition-colors"
            >
              Kijelentkezés
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
