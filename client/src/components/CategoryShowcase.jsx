import React from 'react';
import { Link } from 'react-router-dom';

const CATEGORY_SHOWCASES = [
  {
    id: 'business-professional-services',
    badge: 'Business Growth',
    title: 'Business & Professional Services',
    description: 'Trusted consultancies, agencies, manpower teams, and professional experts for companies and entrepreneurs.',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    stats: '4.8 ★',
    list: ['Consultancies', 'Agencies', 'Manpower Agencies', 'Professions'],
  },
  {
    id: 'logistics-moving',
    badge: 'Moving Made Easy',
    title: 'Logistics & Moving',
    description: 'Packers, movers, transportation, storage, and warehouse support for homes and businesses.',
    image:
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
    stats: '3.2K+',
    list: ['Packers & Movers', 'Storage', 'Warehouse', 'Fleet & Transport'],
  },
];

export default function CategoryShowcase() {
  return (
    <section className="bg-[#f4f8ff] py-14 sm:py-16">
      <div className="container-page">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Featured categories</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Business & logistics support
            </h2>
          </div>
          <Link to="/categories" className="hidden rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50 sm:block">
            View all categories →
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {CATEGORY_SHOWCASES.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,64,104,0.08)]"
            >
              <div className="relative h-64 overflow-hidden">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#031b33]/85 via-[#031b33]/20 to-transparent" />
                <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-blue-700 backdrop-blur-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  {item.badge}
                </div>
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">Trusted services</p>
                    <h3 className="mt-2 font-display text-2xl font-bold text-white">{item.title}</h3>
                  </div>
                  <div className="rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
                    {item.stats}
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <p className="text-[15px] leading-relaxed text-ink/65">{item.description}</p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {item.list.map((service) => (
                    <div key={service} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-ink/75">
                      {service}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-200 pt-4">
                  <Link
                    to={`/categories/${item.id}`}
                    className="inline-flex items-center rounded-full bg-[#0c5dd7] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-[#0b4fb7]"
                  >
                    Explore now
                  </Link>
                  <span className="text-sm font-medium text-ink/50">Verified local experts</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
