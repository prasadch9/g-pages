import React from 'react';
import { Link } from 'react-router-dom';

export default function BackToHomeLink({ className = '', variant = 'dark' }) {
  const variantClass = variant === 'light'
    ? 'border-line bg-white text-ink/75 hover:bg-ink/5 hover:text-ink'
    : 'border-white/35 bg-white/10 text-white hover:bg-white/20';

  return (
    <Link to="/" className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-2 text-xs font-semibold transition ${variantClass} ${className}`}>
      <span aria-hidden="true">←</span> Back to Home
    </Link>
  );
}
