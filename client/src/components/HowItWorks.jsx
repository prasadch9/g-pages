import React from 'react';

const STEPS = [
  {
    num: '01',
    title: 'Choose your location',
    desc: 'Select your state, district, and city using the search tool to see results near you.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Pick a category',
    desc: 'Browse schools, hospitals, restaurants, shops and 13+ business categories.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Connect with the business',
    desc: 'View contact details, address, hours and services — then call, visit or enquire directly.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .14h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.72 6.72l1.14-1.14a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0121.86 15l.06 1.92z" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="border-b border-line bg-white section-pad">
      <div className="container-page">
        {/* Heading */}
        <div className="mb-12 max-w-lg">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-marigold">
            Simple. Fast. Free.
          </p>
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            How G-PAGES works
          </h2>
          <p className="mt-2 text-[15px] text-ink/50">
            Three easy steps to find any local business or service near you.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-8 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.num} className="flex gap-5">
              {/* Number + icon */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent-pale text-accent">
                  {step.icon}
                </div>
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="hidden h-full w-px bg-line sm:block" />
                )}
              </div>

              {/* Text */}
              <div className="pt-1">
                <span className="text-[11px] font-bold uppercase tracking-widest text-marigold">
                  Step {step.num}
                </span>
                <h3 className="mt-1 text-[16px] font-semibold text-ink">{step.title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink/55">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
