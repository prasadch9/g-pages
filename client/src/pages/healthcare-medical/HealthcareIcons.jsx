import React from 'react';

export function WhatsAppIcon({ className = 'h-5 w-5' }) {
  return <svg aria-hidden="true" viewBox="0 0 32 32" className={`${className} text-current`} fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M26.2 15.5a10.2 10.2 0 0 1-15.1 8.9L5 26l1.7-5.8a10.2 10.2 0 1 1 19.5-4.7Z" />
    <path d="M11.1 10.6c.4-.5 1.2-.5 1.6 0l1.4 2.1c.3.4.2.9-.1 1.2l-.8.8a9.6 9.6 0 0 0 4.1 4.1l.8-.8c.3-.3.8-.4 1.2-.1l2.1 1.4c.5.4.5 1.2 0 1.6-.8.8-2 1.1-3.1.8a13.5 13.5 0 0 1-7.9-7.9c-.3-1.1 0-2.3.7-3.2Z" />
  </svg>;
}

export function LocationMapIcon({ className = 'h-5 w-5' }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className={`${className} shrink-0`} fill="currentColor">
    <path d="M12 2.25a7.25 7.25 0 0 0-7.25 7.24c0 5.16 6.42 11.72 6.69 12a.78.78 0 0 0 1.12 0c.27-.28 6.69-6.84 6.69-12A7.25 7.25 0 0 0 12 2.25Zm0 10.1a2.86 2.86 0 1 1 0-5.72 2.86 2.86 0 0 1 0 5.72Z" />
  </svg>;
}
