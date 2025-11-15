// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/common/Layout';
import PublicLayout from './components/common/PublicLayout'; // ADD THIS
import LoadingSpinner from './components/ui/LoadingSpinner';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Public Pages (No login required)
import Home from './pages/customer/Home';
import VehicleSearch from './pages/customer/VehicleSearch';
import VehicleDetails from './pages/customer/VehicleDetails';

// Customer Pages (Login required)
import Booking from './pages/customer/Booking';
import BookingDetails from './pages/customer/BookingDetails';
import Payment from './pages/customer/Payment';
import MyBookings from './pages/customer/MyBookings';
import Profile from './pages/customer/Profile';

// Vendor Pages
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorVehicles from './pages/vendor/VendorVehicles';
import VendorBookings from './pages/vendor/VendorBookings';
import VendorProfile from './pages/vendor/VendorProfile';
import AddVehicle from './pages/vendor/AddVehicle';
import EditVehicle from './pages/vendor/EditVehicle';
import VendorSettings from './pages/vendor/VendorSettings';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminVendors from './pages/admin/AdminVendors';
import AdminVehicles from './pages/admin/AdminVehicles';
import AdminBookings from './pages/admin/AdminBookings';
import AdminPayments from './pages/admin/AdminPayments';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';

// Protected Route - Requires login
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }
  
  return children;
};

// Public Route - Accessible without login, redirects if already logged in
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (user) {
    return <Navigate to={user.role === 'vendor' ? '/vendor/dashboard' : '/'} />;
  }
  
  return children;
};

// Mixed Route - Accessible to both logged in and logged out users
const MixedRoute = ({ children }) => {
  const { loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes (Only for non-logged in users) */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/verify-email" element={<PublicRoute><VerifyEmail /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
          
          {/* Public Routes (No login required) */}
          <Route path="/" element={
            <MixedRoute>
              <PublicLayout>
                <Home />
              </PublicLayout>
            </MixedRoute>
          } />
          <Route path="/search" element={
            <MixedRoute>
              <PublicLayout>
                <VehicleSearch />
              </PublicLayout>
            </MixedRoute>
          } />
          <Route path="/vehicles/:id" element={
            <MixedRoute>
              <PublicLayout>
                <VehicleDetails />
              </PublicLayout>
            </MixedRoute>
          } />
          
          {/* Protected Customer Routes (Login required) */}
          <Route path="/bookings/:id" element={
            <ProtectedRoute requiredRole="customer">
              <Layout>
                <Booking />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/bookings-details/:id" element={
            <ProtectedRoute requiredRole="customer">
              <Layout>
                <BookingDetails />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/payment" element={
            <ProtectedRoute requiredRole="customer">
              <Layout>
                <Payment />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/my-bookings" element={
            <ProtectedRoute requiredRole="customer">
              <Layout>
                <MyBookings />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Vendor Routes (Login + vendor role required) */}
          <Route path="/vendor/dashboard" element={
            <ProtectedRoute requiredRole="vendor">
              <Layout>
                <VendorDashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/vendor/vehicles" element={
            <ProtectedRoute requiredRole="vendor">
              <Layout>
                <VendorVehicles />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/vendor/vehicles/add" element={
            <ProtectedRoute requiredRole="vendor">
              <Layout>
                <AddVehicle />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/vendor/bookings" element={
            <ProtectedRoute requiredRole="vendor">
              <Layout>
                <VendorBookings />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/vendor/profile" element={
            <ProtectedRoute requiredRole="vendor">
              <Layout>
                <VendorProfile />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/vendor/vehicles/edit/:id" element={
            <ProtectedRoute requiredRole="vendor">
              <Layout>
                <EditVehicle />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/vendor/settings" element={
            <ProtectedRoute requiredRole="vendor">
              <Layout>
                <VendorSettings />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Admin Routes (Login + admin role required) */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <AdminUsers />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/vendors" element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <AdminVendors />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/vehicles" element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <AdminVehicles />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/bookings" element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <AdminBookings />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/payments" element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <AdminPayments />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <AdminAnalytics />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <AdminSettings />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;