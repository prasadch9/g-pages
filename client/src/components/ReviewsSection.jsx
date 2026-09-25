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

export default function ReviewsSection({ placeId, onReviewPosted }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [editingReview, setEditingReview] = useState(null);
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
      if (editingReview) {
        await api.put(`/reviews/${editingReview._id}`, { rating, comment });
        onReviewPosted?.({ type: 'edit', oldRating: editingReview.rating, newRating: rating });
        setEditingReview(null);
      } else {
        await api.post('/reviews', { place: placeId, rating, comment });
        onReviewPosted?.({ type: 'create', rating });
      }
      setRating(0);
      setComment('');
      loadReviews();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const startEditing = (review) => {
    setEditingReview(review);
    setRating(review.rating);
    setComment(review.comment);
    setError('');
  };

  const cancelEditing = () => {
    setEditingReview(null);
    setRating(0);
    setComment('');
    setError('');
  };

  const deleteReview = async (review) => {
    if (!window.confirm('Delete this review? This cannot be undone.')) return;
    try {
      await api.delete(`/reviews/${review._id}`);
      setReviews((current) => current.filter((item) => item._id !== review._id));
      onReviewPosted?.({ type: 'delete', oldRating: review.rating });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">Reviews</h2>
        <button
          type="button"
          onClick={() => {
            const commentField = document.getElementById(`review-comment-${placeId}`);
            commentField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            commentField?.focus({ preventScroll: true });
          }}
          className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-ink/70 hover:border-ink/30 hover:text-ink"
        >
          Add Comment ↓
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 rounded border border-line bg-white/50 p-4">
        <label className="text-sm text-ink/70">Your rating</label>
        <div className="mt-1">
          <Stars value={rating} onChange={setRating} />
        </div>
        <textarea
          id={`review-comment-${placeId}`}
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
          {submitting ? (editingReview ? 'Saving…' : 'Posting…') : (editingReview ? 'Save changes' : 'Post review')}
        </button>
        {editingReview && <button type="button" onClick={cancelEditing} className="ml-2 mt-3 rounded border border-line px-5 py-2 text-sm text-ink/70 hover:border-ink/40">Cancel</button>}
      </form>

      <div className="mt-6 flex flex-col divide-y divide-line">
        {loading && <p className="py-4 text-sm text-ink/45">Loading reviews…</p>}
        {!loading && reviews.length === 0 && (
          <p className="py-4 text-sm text-ink/45">No reviews yet — be the first to share your experience.</p>
        )}
        {reviews.map((r) => (
          <div key={r._id} className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-ink">{r.user?.name || 'Anonymous'}</p>
                <p className="mt-1 text-xs text-ink/45">
                  Reviewed by {r.user?.name || 'Anonymous'} on {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className="text-marigold-dark">{'★'.repeat(r.rating)}</span>
            </div>
            <p className="mt-1 text-[14px] text-ink/65">{r.comment}</p>
            {user?._id === r.user?._id && (
              <div className="mt-3 flex gap-3 text-xs font-medium">
                <button type="button" onClick={() => startEditing(r)} className="text-ink/60 hover:text-ink">Edit review</button>
                <button type="button" onClick={() => deleteReview(r)} className="text-vermilion hover:underline">Delete review</button>
              </div>
            )}
            {r.ownerReply?.text && (
              <div className="mt-2 rounded bg-ink/5 p-3 text-[13px] text-ink/70">
                <span className="font-medium">Owner reply: </span>
                {r.ownerReply.text}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
