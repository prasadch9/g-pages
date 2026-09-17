import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { label: 'Home',       to: '/' },
  { label: 'Categories', to: '/categories' },
  { label: 'Explore',    to: '/explore' },
  { label: 'About',      to: '/about' },
  { label: 'Contact',    to: '/contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const dashboardPath =
    user?.role === 'admin'    ? '/admin' :
    user?.role === 'business' ? '/business/dashboard' :
                                '/dashboard';

  const displayName = user?.name?.split(' ')[0] ?? 'Account';

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div className="container-page flex h-16 items-center justify-between gap-4">

        {/* ── Logo ── */}
        <Link to="/" aria-label="G-PAGES — Home" className="flex-shrink-0">
          <img
            src="/assets/g-pages-logo.png"
            alt="G-PAGES"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `text-[14px] font-medium transition-colors ${
                  isActive ? 'text-ink' : 'text-ink/50 hover:text-ink'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* ── Desktop actions ── */}
        <div className="hidden items-center gap-2 md:flex">
          <button
            onClick={() => navigate('/search')}
            aria-label="Search"
            className="rounded-md p-2 text-ink/40 transition hover:bg-canvas hover:text-ink"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>

          {user ? (
            <>
              <Link
                to={dashboardPath}
                className="rounded-md px-3 py-1.5 text-[14px] font-medium text-ink/60 transition hover:bg-canvas hover:text-ink"
              >
                {user.role === 'admin' ? 'Admin' : user.role === 'business' ? 'Dashboard' : displayName}
              </Link>
              <button
                onClick={logout}
                className="rounded-md border border-line px-4 py-1.5 text-[14px] font-medium text-ink/60 transition hover:border-ink/20 hover:text-ink"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md px-3 py-1.5 text-[14px] font-medium text-ink/60 transition hover:text-ink"
              >
                Login
              </Link>
              <Link
                to="/business/register"
                className="rounded-md bg-marigold px-4 py-2 text-[14px] font-semibold text-white transition hover:bg-marigold-dark"
              >
                List Your Business
              </Link>
            </>
          )}
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-md border border-line md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" className="h-4 w-4" strokeWidth={1.8} strokeLinecap="round">
              <path d="M1 1 13 13M13 1 1 13" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 12" fill="none" stroke="currentColor" className="h-4 w-4" strokeWidth={1.8} strokeLinecap="round">
              <path d="M0 1h16M0 6h16M0 11h16" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {open && (
        <div className="border-t border-line bg-white px-5 pb-5 pt-3 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {NAV_LINKS.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2.5 text-[15px] font-medium ${
                    isActive ? 'bg-canvas text-ink' : 'text-ink/60 hover:bg-canvas hover:text-ink'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4">
            {user ? (
              <button
                onClick={() => { logout(); setOpen(false); }}
                className="rounded-md border border-line py-2.5 text-center text-[14px] font-medium text-ink/60"
              >
                Log out
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-md border border-line py-2.5 text-center text-[14px] font-medium text-ink/60"
                >
                  Login
                </Link>
                <Link
                  to="/business/register"
                  onClick={() => setOpen(false)}
                  className="rounded-md bg-marigold py-2.5 text-center text-[14px] font-semibold text-white"
                >
                  List Your Business
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
