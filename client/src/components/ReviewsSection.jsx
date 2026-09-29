import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Stars({ value, onChange, readOnly = false, size = 'text-xl' }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => onChange && onChange(n)}
          className={`${size} leading-none transition ${n <= value ? 'text-amber-400' : 'text-gray-300'} ${readOnly ? 'cursor-default' : 'hover:scale-110'}`}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ReviewsSection({ placeId, onReviewPosted }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadReviews = () => {
    setLoading(true);
    api
      .get(`/reviews/${placeId}`)
      .then(({ data }) => setReviews(data.data || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  };

  useEffect(loadReviews, [placeId]);

  useEffect(() => {
    if (user?.name) {
      setReviewerName(user.name);
    }
  }, [user]);

  const stats = useMemo(() => {
    if (!reviews.length) return { average: 0, total: 0, counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
    const average = (sum / total).toFixed(1);
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating || 0)));
      counts[star] = (counts[star] || 0) + 1;
    });
    return { average, total, counts };
  }, [reviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    if (!rating) {
      setError('Please select a star rating (1–5).');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      if (editingReview) {
        await api.put(`/reviews/${editingReview._id}`, { rating, comment, name: reviewerName });
        onReviewPosted?.({ type: 'edit', oldRating: editingReview.rating, newRating: rating });
        setEditingReview(null);
      } else {
        await api.post('/reviews', { place: placeId, rating, comment, name: reviewerName });
        onReviewPosted?.({ type: 'create', rating });
      }
      setRating(0);
      setComment('');
      setShowForm(false);
      loadReviews();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  const startEditing = (review) => {
    setEditingReview(review);
    setRating(review.rating);
    setComment(review.comment);
    setShowForm(true);
    setError('');
  };

  const cancelEditing = () => {
    setEditingReview(null);
    setRating(0);
    setComment('');
    setShowForm(false);
    setError('');
  };

  const deleteReview = async (review) => {
    if (!window.confirm('Delete this review? This action cannot be undone.')) return;
    try {
      await api.delete(`/reviews/${review._id}`);
      setReviews((current) => current.filter((item) => item._id !== review._id));
      onReviewPosted?.({ type: 'delete', oldRating: review.rating });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete review.');
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER & RATING SUMMARY */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-900">Customer Reviews & Ratings</h2>
          <p className="mt-1 text-xs text-gray-500">Real feedback from verified visitors &amp; shoppers</p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!user) {
              navigate('/login', { state: { from: location.pathname } });
            } else {
              setShowForm((prev) => !prev);
            }
          }}
          className="rounded-full bg-amber-500 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-amber-600"
        >
          {showForm ? 'Close Review Form' : '★ Write a Review'}
        </button>
      </div>

      {/* RATING SUMMARY STATS BAR */}
      {stats.total > 0 && (
        <div className="grid gap-6 rounded-2xl bg-slate-50 p-6 sm:grid-cols-[200px_1fr]">
          <div className="flex flex-col items-center justify-center border-b border-gray-200 pb-4 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-6">
            <span className="font-display text-5xl font-black text-gray-900">{stats.average}</span>
            <div className="mt-1">
              <Stars value={Math.round(stats.average)} readOnly size="text-lg" />
            </div>
            <span className="mt-2 text-xs font-semibold text-gray-500">
              Based on {stats.total} review{stats.total > 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.counts[star] || 0;
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="w-8 text-right font-medium text-gray-600">{star} ★</span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full bg-amber-400 transition-all duration-300" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-10 text-right text-gray-400">{count} ({pct}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* REVIEW SUBMISSION FORM */}
      {(showForm || editingReview) && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 shadow-xs">
          <h3 className="font-display text-base font-bold text-gray-900">
            {editingReview ? 'Edit Your Review' : 'Write Your Review'}
          </h3>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700">Your Name</label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="Enter your name"
                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-medium text-gray-900 outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">Rating (1 to 5 Stars)</label>
              <div className="mt-1">
                <Stars value={rating} onChange={setRating} size="text-2xl" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">Your Review</label>
              <textarea
                id={`review-comment-${placeId}`}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share details of your experience with this business..."
                rows={4}
                required
                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-xs text-gray-900 outline-none focus:border-amber-500"
              />
            </div>

            {error && <p className="text-xs font-semibold text-red-600">{error}</p>}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-gray-900 px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-gray-800 disabled:opacity-50"
              >
                {submitting ? 'Submitting…' : editingReview ? 'Save Changes' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={cancelEditing}
                className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* LOADING & EMPTY STATES & REVIEWS LIST */}
      {loading && (
        <div className="py-8 text-center text-xs font-medium text-gray-400">
          Loading customer reviews...
        </div>
      )}

      {!loading && reviews.length === 0 && (
        <div className="my-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-8 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-amber-100 text-xl text-amber-600">
            ★
          </div>
          <h4 className="mt-3 font-display text-base font-bold text-gray-900">No reviews yet</h4>
          <p className="mt-1 text-xs text-gray-500">Be the first to share your experience with this business!</p>
          <button
            type="button"
            onClick={() => {
              if (!user) {
                navigate('/login', { state: { from: location.pathname } });
              } else {
                setShowForm(true);
              }
            }}
            className="mt-4 inline-block rounded-full bg-amber-500 px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-amber-600"
          >
            Be the First to Review
          </button>
        </div>
      )}

      {!loading && reviews.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => {
            const authorName = r.name || r.user?.name || 'Customer';
            const avatarUrl = r.user?.avatar || r.user?.profileImage || '';
            const initial = authorName.charAt(0).toUpperCase();

            return (
              <article
                key={r._id}
                className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-xs transition hover:shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-amber-100">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt={authorName} className="h-full w-full object-cover" />
                        ) : (
                          <span className="grid h-full place-items-center font-bold text-amber-800">
                            {initial}
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs text-gray-900">{authorName}</h4>
                        <span className="text-[10px] text-gray-400">
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                    </div>

                    <Stars value={r.rating} readOnly size="text-sm" />
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-gray-700">“{r.comment}”</p>

                  {r.ownerReply?.text && (
                    <div className="mt-3 rounded-xl bg-amber-50/80 p-3 text-[11px] leading-5 text-amber-900 border border-amber-100">
                      <span className="font-bold">Business Owner Reply:</span> {r.ownerReply.text}
                    </div>
                  )}
                </div>

                {user?._id && r.user?._id === user._id && (
                  <div className="mt-4 flex gap-3 border-t border-gray-100 pt-3 text-[11px] font-semibold">
                    <button type="button" onClick={() => startEditing(r)} className="text-amber-700 hover:underline">
                      Edit
                    </button>
                    <button type="button" onClick={() => deleteReview(r)} className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

