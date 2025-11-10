// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/common/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Customer Pages
import Home from './pages/customer/Home';
import VehicleSearch from './pages/customer/VehicleSearch';
import VehicleDetails from './pages/customer/VehicleDetails';
import Booking from './pages/customer/Booking';
import MyBookings from './pages/customer/MyBookings';
import Profile from './pages/customer/Profile';

// Vendor Pages
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorVehicles from './pages/vendor/VendorVehicles';
import VendorBookings from './pages/vendor/VendorBookings';
import VendorProfile from './pages/vendor/VendorProfile';
import AddVehicle from './pages/vendor/AddVehicle';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminVendors from './pages/admin/AdminVendors';
import AdminVehicles from './pages/admin/AdminVehicles';
import AdminBookings from './pages/admin/AdminBookings';
import AdminPayments from './pages/admin/AdminPayments';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';

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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/verify-email" element={<PublicRoute><VerifyEmail /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
          
          {/* Customer Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/search" element={
            <ProtectedRoute>
              <Layout>
                <VehicleSearch />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/vehicles/:id" element={
            <ProtectedRoute>
              <Layout>
                <VehicleDetails />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/bookings/:id" element={
            <ProtectedRoute requiredRole="customer">
              <Layout>
                <Booking />
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
          
          {/* Vendor Routes */}
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
          {/* Admin Routes */}
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