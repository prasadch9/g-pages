import React from 'react';
import { Link } from 'react-router-dom';

export default function BusinessCTA() {
  return (
    <section className="border-b border-line bg-canvas section-pad">
      <div className="container-page">
        <div className="overflow-hidden rounded-2xl bg-ink">
          <div className="grid items-center gap-0 lg:grid-cols-2">

            {/* Left: copy */}
            <div className="px-8 py-12 sm:px-12">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-marigold">
                For business owners
              </p>
              <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                Have a business?<br />
                Get discovered locally.
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/55">
                List your school, clinic, restaurant or shop on G-PAGES. Add
                photos, services and contact details — once verified, you're
                visible to everyone searching in your city.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/business/register"
                  id="cta-list-business"
                  className="rounded-lg bg-marigold px-6 py-3 text-[15px] font-semibold text-white transition hover:bg-marigold-dark"
                >
                  List Your Business →
                </Link>
                <Link
                  to="/about"
                  className="rounded-lg border border-white/20 px-6 py-3 text-[15px] font-medium text-white/70 transition hover:border-white/40 hover:text-white"
                >
                  Learn more
                </Link>
              </div>
            </div>

            {/* Right: decorative panel */}
            <div className="relative hidden items-center justify-center overflow-hidden lg:flex" style={{ minHeight: 260 }}>
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />
              {/* Centred illustration */}
              <svg
                viewBox="0 0 280 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10 w-64 opacity-90"
                aria-hidden="true"
              >
                {/* Store outline */}
                <rect x="60" y="60" width="160" height="120" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.3" rx="4" />
                {/* Awning */}
                <rect x="52" y="44" width="176" height="24" fill="#F47224" rx="4 4 0 0" />
                {/* Windows */}
                <rect x="74"  y="84" width="52" height="52" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" rx="2" />
                <rect x="154" y="84" width="52" height="52" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" rx="2" />
                {/* Door */}
                <rect x="113" y="136" width="54" height="44" fill="#F47224" rx="2 2 0 0" opacity="0.8" />
                <circle cx="161" cy="160" r="3" fill="white" opacity="0.6" />
                {/* Ground */}
                <rect x="30" y="180" width="220" height="3" fill="white" rx="2" opacity="0.15" />
                {/* Location pin */}
                <path d="M140 5 C130 5 122 13 122 22 C122 34 140 50 140 50 C140 50 158 34 158 22 C158 13 150 5 140 5Z" fill="#F47224" />
                <circle cx="140" cy="22" r="7" fill="white" opacity="0.9" />
              </svg>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
