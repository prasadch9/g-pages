import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { WhatsAppMark } from '../pages/healthcare-medical/HealthcareIcons';

const DEFAULT_WHATSAPP_NUMBER = import.meta.env.VITE_COMPANY_WHATSAPP_NUMBER || '919876543210';

export default function WhatsAppButton() {
  const [number, setNumber] = useState(DEFAULT_WHATSAPP_NUMBER);

  useEffect(() => {
    const applySettings = (settings) => setNumber(settings.whatsappNumber || '');
    api
      .get('/settings/public')
      .then(({ data }) => applySettings(data.data || {}))
      .catch(() => {});
    const handleSettingsUpdate = (event) => applySettings(event.detail || {});
    window.addEventListener('google-pages:site-settings-updated', handleSettingsUpdate);
    return () => window.removeEventListener('google-pages:site-settings-updated', handleSettingsUpdate);
  }, []);

  const digits = String(number).replace(/\D/g, '');
  if (!digits) return null;
  const url = `https://wa.me/${digits}?text=${encodeURIComponent('Hello G-PAGES, I need some information.')}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with G-PAGES on WhatsApp"
      title="Chat with G-PAGES on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:bg-[#20bd5a] focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
    >
      <WhatsAppMark className="h-7 w-7" />
    </a>
  );
}
