import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const DEFAULT_WHATSAPP_NUMBER = import.meta.env.VITE_COMPANY_WHATSAPP_NUMBER || '919876543210';

function SocialIcon({ name }) {
  if (name === 'Facebook') {
    return <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true"><path d="M13.4 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.5 1.6-1.5h1.7V3.1c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6v2.1h-3v3.2h3V21h3.9Z" /></svg>;
  }
  if (name === 'Instagram') {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>;
  }
  return <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true"><path d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.52 0 .18 5.34.18 11.9c0 2.1.55 4.15 1.59 5.96L.08 24l6.28-1.65a11.9 11.9 0 0 0 5.72 1.46h.01c6.55 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.47-8.43Zm-8.44 18.28h-.01a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.73.98 1-3.64-.23-.37a9.86 9.86 0 0 1-1.51-5.24C2.21 6.47 6.64 2.04 12.09 2.04a9.8 9.8 0 0 1 6.98 2.9 9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.43 9.83-9.88 9.83Zm5.41-7.37c-.3-.15-1.78-.88-2.05-.98-.27-.1-.47-.15-.67.15-.2.3-.77.98-.94 1.18-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47a8.94 8.94 0 0 1-1.65-2.05c-.17-.3-.02-.46.13-.61.14-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.78-.73 2.03-1.43.25-.7.25-1.3.17-1.43-.07-.12-.27-.2-.57-.35Z" /></svg>;
}

const COLUMNS = [
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Careers', to: '/careers' },
      { label: 'Privacy policy', to: '/privacy' },
      { label: 'Terms & conditions', to: '/terms' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Cities', to: '/explore' },
      { label: 'Categories', to: '/categories' },
      { label: 'Popular places', to: '/trending' },
    ],
  },
  {
    title: 'Business',
    links: [
      { label: 'List your business', to: '/business/register' },
      { label: 'Business login', to: '/business/login' },
      { label: 'Business support', to: '/business/support' },
    ],
  },
];

export default function Footer() {
  const [socialSettings, setSocialSettings] = useState({
    instagramUrl: '',
    facebookUrl: '',
    whatsappNumber: DEFAULT_WHATSAPP_NUMBER,
  });

  useEffect(() => {
    const applySettings = (settings) => setSocialSettings((current) => ({ ...current, ...settings }));
    api
      .get('/settings/public')
      .then(({ data }) => applySettings(data.data))
      .catch(() => {});
    const handleSettingsUpdate = (event) => applySettings(event.detail || {});
    window.addEventListener('google-pages:site-settings-updated', handleSettingsUpdate);
    return () => window.removeEventListener('google-pages:site-settings-updated', handleSettingsUpdate);
  }, []);

  const socialLinks = [
    { name: 'Facebook', href: socialSettings.facebookUrl },
    { name: 'Instagram', href: socialSettings.instagramUrl },
    { name: 'WhatsApp', href: socialSettings.whatsappNumber ? `https://wa.me/${String(socialSettings.whatsappNumber).replace(/\D/g, '')}` : '' },
  ].filter((link) => link.href);

  return (
    <footer className="bg-[#071d33] py-10 text-paper/70">
      <div className="container-page grid gap-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <Link to="/" aria-label="G-PAGES home" className="inline-flex rounded-md bg-white p-1.5">
            <img src="/images/branding/gpages-logo.png" alt="G-PAGES" className="h-12 w-32 object-contain" />
          </Link>
          <p className="mt-3 max-w-[220px] text-sm leading-relaxed">
            Helping people discover trusted places, one city at a time.
          </p>
          <div className="mt-5 flex gap-2">
            {socialLinks.map((link) => (
              <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" title={link.name} className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/20 text-paper/75 transition hover:bg-white/10 hover:text-paper" aria-label={link.name}>
                <SocialIcon name={link.name} />
              </a>
            ))}
          </div>
        </div>

        <div className="col-span-3 grid grid-cols-3 gap-2 sm:contents">
          {COLUMNS.map((col) => (
            <div key={col.title} className="min-w-0">
              <h4 className="font-display text-xs font-medium text-paper sm:text-sm">{col.title}</h4>
              <ul className="mt-3 flex flex-col gap-2 text-[11px] sm:mt-4 sm:gap-2.5 sm:text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="hover:text-paper">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="container-page mt-12 border-t border-paper/10 pt-6 text-xs text-paper/40">
        © {new Date().getFullYear()} Google Pages. All rights reserved.
      </div>
    </footer>
  );
}
