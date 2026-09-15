import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Auto-advancing image carousel for "Popular places in <city>". Supports
 * previous/next controls, dot navigation, and touch swipe on mobile.
 */
export default function PlacesSlideshow({ places = [] }) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (places.length < 2) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % places.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [places.length]);

  if (!places.length) return null;

  const goTo = (i) => {
    clearInterval(timerRef.current);
    setIndex((i + places.length) % places.length);
  };

  const onTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 40) goTo(index - 1);
    if (delta < -40) goTo(index + 1);
    touchStartX.current = null;
  };

  const place = places[index];
  const cover = place.coverImage || place.images?.[0];

  return (
    <div
      className="relative overflow-hidden rounded-md border border-line bg-ink"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative flex h-64 items-end sm:h-80">
        <img src={cover} alt={place.name} className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="relative z-10 w-full bg-gradient-to-t from-ink/90 to-transparent p-6">
          <p className="text-xs uppercase tracking-wide text-marigold">{place.category?.name}</p>
          <h3 className="mt-1 font-display text-2xl font-semibold text-paper">{place.name}</h3>
          <p className="mt-1 line-clamp-1 text-sm text-paper/70">{place.address}</p>
          {place._id && (
            <Link
              to={`/place/${place._id}`}
              className="mt-3 inline-block rounded bg-paper px-4 py-2 text-sm font-medium text-ink hover:bg-paper/90"
            >
              View details
            </Link>
          )}
        </div>
      </div>

      {places.length > 1 && (
        <>
          <button
            onClick={() => goTo(index - 1)}
            aria-label="Previous"
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-paper/80 px-3 py-1.5 text-ink hover:bg-paper"
          >
            ‹
          </button>
          <button
            onClick={() => goTo(index + 1)}
            aria-label="Next"
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-paper/80 px-3 py-1.5 text-ink hover:bg-paper"
          >
            ›
          </button>
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {places.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-1.5 w-1.5 rounded-full transition-all ${i === index ? 'w-4 bg-marigold' : 'bg-paper/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
