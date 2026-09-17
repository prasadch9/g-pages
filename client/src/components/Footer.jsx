import React from 'react';
import { Link } from 'react-router-dom';

const QUICK_LINKS = [
  { label: 'Home',       to: '/' },
  { label: 'Categories', to: '/categories' },
  { label: 'Explore',    to: '/explore' },
  { label: 'Businesses', to: '/businesses' },
  { label: 'About',      to: '/about' },
  { label: 'Contact',    to: '/contact' },
];

const CATEGORIES_LINKS = [
  { label: 'Education & Learning',       to: '/categories?group=education' },
  { label: 'Healthcare & Medical',       to: '/categories?group=healthcare' },
  { label: 'Religious & Social',         to: '/categories?group=religious' },
  { label: 'Marriage & Wedding',         to: '/categories?group=wedding' },
  { label: 'Travel & Hospitality',       to: '/categories?group=travel' },
  { label: 'Real Estate & Construction', to: '/categories?group=real-estate' },
  { label: 'Food & Dining',              to: '/categories?group=food' },
];

const FOR_BUSINESS = [
  { label: 'List Your Business', to: '/business/register' },
  { label: 'Business Login',     to: '/login' },
  { label: 'Manage Listing',     to: '/business/dashboard' },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink text-white/70">

      {/* Main footer content */}
      <div className="container-page py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand column */}
          <div>
            <Link to="/" aria-label="G-PAGES Home" className="inline-block">
              <img
                src="/assets/g-pages-logo.png"
                alt="G-PAGES - Find Local. Connect Easy."
                className="footer__logo"
              />
            </Link>
            <p className="mt-4 text-[14px] leading-relaxed text-white/50">
              Find trusted local businesses, services and places near you — all
              in one place.
            </p>
            <p className="mt-4 text-[13px] font-medium tracking-wide text-white/30">
              Find Local. Connect Easy.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-4 text-[12px] font-bold uppercase tracking-widest text-white/40">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5">
              {QUICK_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-[14px] text-white/60 transition hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 text-[12px] font-bold uppercase tracking-widest text-white/40">
              Categories
            </h3>
            <ul className="flex flex-col gap-2.5">
              {CATEGORIES_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-[14px] text-white/60 transition hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For business */}
          <div>
            <h3 className="mb-4 text-[12px] font-bold uppercase tracking-widest text-white/40">
              For Business
            </h3>
            <ul className="flex flex-col gap-2.5">
              {FOR_BUSINESS.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-[14px] text-white/60 transition hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* CTA in footer */}
            <Link
              to="/business/register"
              className="mt-6 inline-block rounded-lg bg-marigold px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-marigold-dark"
            >
              List Your Business &rarr;
            </Link>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-[13px] text-white/35 sm:flex-row">
          <p>© {new Date().getFullYear()} G-PAGES. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-white/60 transition">Privacy Policy</Link>
            <Link to="/terms"   className="hover:text-white/60 transition">Terms of Use</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
