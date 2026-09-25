import React, { useState } from 'react';

const DEMO_OFFER = 'Today only: Enjoy 20% off selected stores and dining.';

export default function TodayOffer({ offer }) {
  const [dismissed, setDismissed] = useState(false);
  const message = String(offer || (import.meta.env.DEV ? DEMO_OFFER : '')).trim();
  if (!message || dismissed) return null;

  return (
    <aside className="fixed bottom-5 right-4 z-30 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-amber-200 bg-white p-4 pr-10 shadow-xl sm:bottom-6 sm:right-6" aria-label="Offer happening today">
      <button type="button" onClick={() => setDismissed(true)} aria-label="Dismiss today's offer" className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">×</button>
      <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-rose-600">Happening today</p>
      <p className="mt-1 text-sm font-bold leading-5 text-slate-900">{message}</p>
    </aside>
  );
}
