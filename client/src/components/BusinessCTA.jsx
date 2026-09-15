import React from 'react';
import { Link } from 'react-router-dom';

export default function BusinessCTA() {
  return (
    <section className="bg-ink py-16">
      <div className="container-page flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
        <div className="max-w-lg">
          <h2 className="font-display text-2xl font-semibold text-paper sm:text-3xl">
            Own a business? Get discovered by people searching in your city.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-paper/60">
            List your school, clinic, restaurant or shop for free. Add photos,
            services and hours — once verified, you're live for everyone
            searching your category and city.
          </p>
        </div>
        <Link
          to="/business/register"
          className="whitespace-nowrap rounded bg-marigold px-6 py-3 font-medium text-ink transition hover:bg-marigold-dark"
        >
          List your business
        </Link>
      </div>
    </section>
  );
}
