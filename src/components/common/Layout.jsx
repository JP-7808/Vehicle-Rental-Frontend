// src/components/common/Layout.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../layout/AdminLayout';
import VendorLayout from '../layout/VendorLayout';
import CustomerLayout from '../layout/CustomerLayout';

export default function Layout({ children }) {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return <AdminLayout>{children}</AdminLayout>;
  }

  if (user?.role === 'vendor') {
    return <VendorLayout>{children}</VendorLayout>;
  }

  return <CustomerLayout>{children}</CustomerLayout>;
}