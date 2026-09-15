import React from 'react';

const CITIES = [
  { name: 'Rajahmundry', state: 'Andhra Pradesh', count: '1,240 listings' },
  { name: 'Vijayawada', state: 'Andhra Pradesh', count: '2,180 listings' },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', count: '3,020 listings' },
  { name: 'Kakinada', state: 'Andhra Pradesh', count: '860 listings' },
  { name: 'Machilipatnam', state: 'Andhra Pradesh', count: '410 listings' },
];

export default function PopularCities() {
  return (
    <section className="border-b border-line bg-paper py-16">
      <div className="container-page">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          Popular cities
        </h2>
        <div className="mt-8 flex gap-4 overflow-x-auto pb-2">
          {CITIES.map((city) => (
            <div
              key={city.name}
              className="flex min-w-[200px] flex-col justify-between rounded border border-line bg-white/50 p-5 transition hover:border-ink/25"
            >
              <div>
                <div className="font-display text-lg font-medium text-ink">{city.name}</div>
                <div className="text-xs text-ink/45">{city.state}</div>
              </div>
              <div className="mt-6 text-sm text-moss">{city.count}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
