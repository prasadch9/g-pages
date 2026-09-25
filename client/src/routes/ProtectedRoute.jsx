import React from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wraps a route that requires login (and optionally a specific role).
 * Unauthenticated users are sent to /login with the original destination
 * preserved in location state, so they land back where they wanted after
 * signing in — matching the "preserve selection through auth" requirement.
 */
export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="container-page py-24 text-center text-ink/40">Loading…</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-xl font-semibold text-ink">Access restricted</h1>
        <p className="mt-2 text-sm text-ink/55">This page is for business accounts. You are currently logged in as a {user.role || 'user'} account.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link to="/business/register?role=business" className="rounded bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink-light">
            Create business account
          </Link>
          <Link to="/dashboard" className="rounded border border-line px-4 py-2 text-sm text-ink/70 hover:border-ink/30">
            Go to my dashboard
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
