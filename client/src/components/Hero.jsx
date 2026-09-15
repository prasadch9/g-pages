import React from 'react';
import LocationSelector from './LocationSelector';

/**
 * A hand-drawn "directory board" illustration — small plaques pinned to a
 * board, each carrying a simple line icon for one category. This stands in
 * for a stock photo: it's grounded in the actual subject (a city directory)
 * rather than a generic hero graphic.
 */
function DirectoryBoard() {
  const plaques = [
    { icon: 'school', rot: -3, x: 0, y: 0 },
    { icon: 'health', rot: 2, x: 1, y: 0 },
    { icon: 'food', rot: -2, x: 0, y: 1 },
    { icon: 'temple', rot: 3, x: 1, y: 1 },
  ];

  const icons = {
    school: (
      <path d="M12 4 3 8.5 12 13l9-4.5L12 4Zm-6 6.2v4.6c0 1.3 2.7 2.7 6 2.7s6-1.4 6-2.7v-4.6" strokeWidth="1.4" />
    ),
    health: (
      <path d="M12 5v14M5 12h14M6 6l1.5 1.5M18 6l-1.5 1.5M6 18l1.5-1.5M18 18l-1.5-1.5" strokeWidth="1.4" strokeLinecap="round" />
    ),
    food: (
      <path
        d="M7 3v7a2 2 0 0 0 2 2v9M9 3v9M11 3v9M17 3c-2 1-2 4-2 6s.6 3 2 3v9"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    ),
    temple: (
      <path
        d="M12 3 6 9h12L12 3ZM5 9h14M6 12v7M18 12v7M9 12v7M15 12v7M4 19h16"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    ),
  };

  const labels = { school: 'Schools', health: 'Hospitals', food: 'Restaurants', temple: 'Temples' };

  return (
    <div className="relative mx-auto aspect-square max-w-md rounded-md bg-ink p-6 sm:p-8">
      <div className="absolute left-1/2 top-3 h-2 w-2 -translate-x-1/2 rounded-full bg-marigold" />
      <div className="grid h-full grid-cols-2 gap-4 sm:gap-5">
        {plaques.map((p) => (
          <div
            key={p.icon}
            style={{ transform: `rotate(${p.rot}deg)` }}
            className="flex flex-col items-center justify-center gap-2 rounded-sm border border-line/40 bg-paper px-3 py-5 shadow-[3px_3px_0_0_rgba(0,0,0,0.25)]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#1B2A4A" className="h-8 w-8">
              {icons[p.icon]}
            </svg>
            <span className="font-display text-sm font-medium text-ink">{labels[p.icon]}</span>
          </div>
        ))}
      </div>
      <span className="absolute -bottom-4 right-4 rounded bg-marigold px-3 py-1 font-display text-xs font-semibold text-ink shadow-sm">
        +1,000 more
      </span>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="border-b border-line bg-paper">
      <div className="container-page grid gap-12 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <h1 className="max-w-xl font-display text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl">
            Discover everything around you
          </h1>
          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-ink/65">
            Find trusted schools, colleges, hospitals, businesses, shopping
            destinations, restaurants and more in your city — verified by
            Google Pages, reviewed by people who've actually been there.
          </p>

          <div className="mt-8">
            <LocationSelector />
          </div>

          <div className="mt-8 flex gap-8 text-sm text-ink/55">
            <div>
              <div className="font-display text-2xl font-semibold text-ink">28</div>
              states covered
            </div>
            <div>
              <div className="font-display text-2xl font-semibold text-ink">40k+</div>
              verified listings
            </div>
            <div>
              <div className="font-display text-2xl font-semibold text-ink">2M+</div>
              monthly visits
            </div>
          </div>
        </div>

        <DirectoryBoard />
      </div>
    </section>
  );
}
