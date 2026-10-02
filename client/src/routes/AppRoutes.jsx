import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MobileSubcategoryMenu from '../components/public/MobileSubcategoryMenu';

import Home from '../pages/Home';

import Login from '../pages/Login';

import ResetPassword from '../pages/ResetPassword';

import Register from '../pages/Register';

import CategoriesPage from '../pages/CategoriesPage';

import CategoryPlacesPage from '../pages/CategoryPlacesPage';

import ExplorePage from '../pages/ExplorePage';

import AboutPage from '../pages/AboutPage';

import { BusinessSupportPage, CareersPage, ContactPage, PrivacyPage, TermsPage } from '../pages/CompanyPages';

import BusinessesPage from '../pages/BusinessesPage';

import ComingSoon from '../pages/ComingSoon';

import ProtectedRoute from './ProtectedRoute';

import UserDashboard from '../pages/UserDashboard';

import BusinessDashboard from '../pages/business/BusinessDashboard';

import CreateListing from '../pages/business/CreateListing';

import SolarCreateListing from '../pages/industries-manufacturing/solar/SolarCreateListing';

import AdminLayout from '../pages/admin/AdminLayout';

import AdminOverview from '../pages/admin/AdminOverview';

import AdminBusinesses from '../pages/admin/AdminBusinesses';

import AdminBusinessReview from '../pages/admin/AdminBusinessReview';

import AdminUsers from '../pages/admin/AdminUsers';

import AdminSettings from '../pages/admin/AdminSettings';

import AdminCategories from '../pages/admin/AdminCategories';

import CityPage from '../pages/CityPage';

import CategoryListingPage from '../pages/CategoryListingPage';

import PlaceDetailPage from '../pages/PlaceDetailPage';

import SearchResultsPage from '../pages/SearchResultsPage';

import TrendingPlacesPage from '../pages/TrendingPlacesPage';

import PublicBusinessProfilePage from '../pages/PublicBusinessProfilePage';

import BlogsPage from '../pages/BlogsPage';

import BlogDetailPage from '../pages/BlogDetailPage';

import RestaurantEditor from '../pages/food-dining/restaurants/RestaurantEditor';

import BusinessEditorPage from '../pages/business/BusinessEditorPage';

import AdminBlogs from '../pages/admin/AdminBlogs';

import AdminBlogEditor from '../pages/admin/AdminBlogEditor';

export default function AppRoutes() {
  return (
    <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/trending" element={<TrendingPlacesPage />} />
          <Route path="/place/:id" element={<><PlaceDetailPage /><MobileSubcategoryMenu /></>} />
          <Route path="/business/login" element={<Login businessMode />} />
          <Route path="/business/support" element={<BusinessSupportPage />} />
          <Route path="/business/:businessId" element={<><PublicBusinessProfilePage /><MobileSubcategoryMenu /></>} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categories/:category" element={<CategoryPlacesPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/businesses" element={<BusinessesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Business owner area */}
          <Route
            path="/business/dashboard"
            element={
              <ProtectedRoute roles={['business']}>
                <BusinessDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/business/listings/new"
            element={
              <ProtectedRoute roles={['business']}>
                <CreateListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/business/listings/new/restaurant"
            element={
              <ProtectedRoute roles={['business']}>
                <CreateListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/business/listings/new/solar"
            element={
              <ProtectedRoute roles={['business']}>
                <SolarCreateListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/business/listings/:id/edit"
            element={
              <ProtectedRoute roles={['business', 'admin']}>
                <BusinessEditorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/business/listings/:id/edit/solar"
            element={
              <ProtectedRoute roles={['business']}>
                <SolarCreateListing />
              </ProtectedRoute>
            }
          />
          <Route path="/business/register" element={<Register />} />

          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/blogs/:slug" element={<BlogDetailPage />} />

          {/* Admin area */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="businesses" element={<AdminBusinesses />} />
            <Route path="businesses/:id" element={<AdminBusinessReview />} />
            <Route path="blogs" element={<AdminBlogs />} />
            <Route path="blogs/new" element={<AdminBlogEditor />} />
            <Route path="blogs/:id/edit" element={<AdminBlogEditor />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* SEO-friendly location routes, e.g.:
              /andhra-pradesh/east-godavari/rajahmundry
              /andhra-pradesh/east-godavari/rajahmundry/schools           */}
          <Route path="/:state/:district/:city/:category" element={<CategoryListingPage />} />
          <Route path="/:state/:district/:city" element={<CityPage />} />

          <Route path="*" element={<ComingSoon title="This page" />} />
        </Routes>
  );
}

