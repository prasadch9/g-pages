import React from 'react';

const STEPS = [
  {
    n: '1',
    title: 'Choose your location',
    text: 'Pick your state, district and city — or let us detect it — to see what\u2019s actually near you.',
  },
  {
    n: '2',
    title: 'Pick a category',
    text: 'Schools, hospitals, restaurants, salons — browse by what you need, filtered to your area.',
  },
  {
    n: '3',
    title: 'Connect with confidence',
    text: 'Every listing is verified before it goes live. Read real reviews, call, or get directions in one tap.',
  },
];

export default function HowItWorks() {
  return (
    <section className="border-b border-line bg-white/40 py-16">
      <div className="container-page">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          How Google Pages works
        </h2>

        <div className="mt-10 grid gap-10 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.n} className="relative pl-2">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl font-semibold text-marigold-dark">
                  {step.n}
                </span>
                <h3 className="font-display text-lg font-medium text-ink">{step.title}</h3>
              </div>
              <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-ink/60">{step.text}</p>
              {i < STEPS.length - 1 && (
                <div className="mt-6 hidden h-px w-full bg-line sm:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
