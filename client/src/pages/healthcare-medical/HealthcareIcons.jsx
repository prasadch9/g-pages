import React from 'react';

export function PhoneIcon({ className = 'h-4 w-4' }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.56 3.57.56.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.56 3.57a1 1 0 0 1-.25 1.02l-2.19 2.2Z" />
  </svg>;
}

const whatsappMark = 'M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.52 0 .18 5.34.18 11.9c0 2.1.55 4.15 1.59 5.96L.08 24l6.28-1.65a11.9 11.9 0 0 0 5.72 1.46h.01c6.55 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.47-8.43Zm-8.44 18.28h-.01a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.73.98 1-3.64-.23-.37a9.86 9.86 0 0 1-1.51-5.24C2.21 6.47 6.64 2.04 12.09 2.04a9.8 9.8 0 0 1 6.98 2.9 9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.43 9.83-9.88 9.83Zm5.41-7.37c-.3-.15-1.78-.88-2.05-.98-.27-.1-.47-.15-.67.15-.2.3-.77.98-.94 1.18-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47a8.94 8.94 0 0 1-1.65-2.05c-.17-.3-.02-.46.13-.61.14-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.78-.73 2.03-1.43.25-.7.25-1.3.17-1.43-.07-.12-.27-.2-.57-.35Z';

export function WhatsAppMark({ className = 'h-5 w-5' }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor"><path d={whatsappMark} /></svg>;
}

export function WhatsAppIcon({ className = 'h-5 w-5' }) {
  return <svg aria-hidden="true" viewBox="0 0 32 32" className={className}>
    <circle cx="16" cy="16" r="15" fill="#25D366" />
    <svg x="4" y="4" width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d={whatsappMark} /></svg>
  </svg>;
}

export function LocationMapIcon({ className = 'h-5 w-5' }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className={`${className} shrink-0`} fill="currentColor">
    <path d="M12 2.25a7.25 7.25 0 0 0-7.25 7.24c0 5.16 6.42 11.72 6.69 12a.78.78 0 0 0 1.12 0c.27-.28 6.69-6.84 6.69-12A7.25 7.25 0 0 0 12 2.25Zm0 10.1a2.86 2.86 0 1 1 0-5.72 2.86 2.86 0 0 1 0 5.72Z" />
  </svg>;
}
