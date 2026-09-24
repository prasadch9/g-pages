import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Stars({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`text-2xl leading-none ${n <= value ? 'text-marigold-dark' : 'text-line'}`}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ReviewsSection({ placeId }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadReviews = () => {
    api
      .get(`/reviews/${placeId}`)
      .then(({ data }) => setReviews(data.data))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  };

  useEffect(loadReviews, [placeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    if (!rating) {
      setError('Please select a rating.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await api.post('/reviews', { place: placeId, rating, comment });
      setRating(0);
      setComment('');
      loadReviews();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-ink">Reviews</h2>

      <form onSubmit={handleSubmit} className="mt-4 rounded border border-line bg-white/50 p-4">
        <label className="text-sm text-ink/70">Your rating</label>
        <div className="mt-1">
          <Stars value={rating} onChange={setRating} />
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience…"
          rows={3}
          required
          className="mt-3 w-full rounded border border-line bg-white px-3 py-2 text-[14px] outline-none focus:border-ink/40"
        />
        {error && <p className="mt-2 text-sm text-vermilion">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="mt-3 rounded bg-ink px-5 py-2 text-sm font-medium text-paper hover:bg-ink-light disabled:opacity-60"
        >
          {submitting ? 'Posting…' : 'Post review'}
        </button>
      </form>

      <div className="mt-6">
        {loading && <p className="py-4 text-sm text-ink/45">Loading reviews…</p>}
        {!loading && reviews.length === 0 && (
          <p className="py-4 text-sm text-ink/45">No reviews yet — be the first to share your experience.</p>
        )}

        {!loading && reviews.length > 0 && (
          <div className="overflow-x-auto pb-2">
            <div className="flex min-w-max gap-4">
              {reviews.map((r) => (
                <article key={r._id} className="w-[280px] shrink-0 rounded-[22px] border border-sky-100 bg-gradient-to-br from-white to-sky-50 p-5 shadow-sm shadow-sky-100/80 sm:w-[320px]">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-cyan-100 text-sm font-bold text-sky-700">
                        {(r.user?.name || 'A').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-ink">{r.user?.name || 'Anonymous'}</div>
                        <div className="text-[11px] text-ink/45">{new Date(r.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="text-base text-amber-400">{'★'.repeat(r.rating)}</div>
                  </div>

                  <p className="mt-4 text-[14px] leading-7 text-ink/70">“{r.comment}”</p>

                  {r.ownerReply?.text && (
                    <div className="mt-4 rounded-xl bg-sky-50 p-3 text-[13px] leading-6 text-sky-800">
                      <span className="font-semibold">Owner reply:</span> {r.ownerReply.text}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
