// src/services/adminApi.js
import api from './api';

// Dashboard
export const getAdminDashboard = () => api.get('/admin/dashboard');
export const getEnhancedDashboard = () => api.get('/admin/dashboard/enhanced');

// Users Management
export const getAllUsers = (params) => api.get('/admin/users', { params });
export const getUserDetails = (id) => api.get(`/admin/users/${id}`);
export const createUser = (userData) => api.post('/admin/users', userData);
export const updateUser = (id, userData) => api.put(`/admin/users/${id}`, userData);
export const updateUserStatus = (id, statusData) => api.patch(`/admin/users/${id}/status`, statusData);
export const updateUserRole = (id, roleData) => api.patch(`/admin/users/${id}/role`, roleData);
export const deleteUser = (id, data) => api.delete(`/admin/users/${id}`, { data });
export const uploadUserAvatar = (id, formData) => api.post(`/admin/users/${id}/avatar`, formData);
export const bulkUpdateUserStatus = (data) => api.post('/admin/users/bulk-status', data);

// Vendors Management
export const getAllVendors = (params) => api.get('/admin/vendors', { params });
export const getVendorDetails = (id) => api.get(`/admin/vendors/${id}`);
export const updateVendorStatus = (id, statusData) => api.patch(`/admin/vendors/${id}/status`, statusData);
export const verifyVendorKYC = (id, data) => api.patch(`/admin/vendors/${id}/kyc/verify`, data);
export const rejectVendorKYC = (id, data) => api.patch(`/admin/vendors/${id}/kyc/reject`, data);
export const bulkVerifyVendors = (data) => api.post('/admin/vendors/bulk-verify', data);

// Vehicles Management
export const getAllVehicles = (params) => api.get('/admin/vehicles', { params });
export const getVehiclesWithFilter = (params) => api.get('/admin/vehicles', { params });
export const getVehicleDetails = (id) => api.get(`/admin/vehicles/${id}`);
export const createVehicle = (vehicleData) => api.post('/admin/vehicles', vehicleData);
export const updateVehicle = (id, vehicleData) => api.put(`/admin/vehicles/${id}`, vehicleData);
export const updateVehicleStatus = (id, statusData) => api.patch(`/admin/vehicles/${id}/status`, statusData);
export const deleteVehicle = (id, data) => api.delete(`/admin/vehicles/${id}`, { data });
export const uploadVehicleImages = (id, formData) => api.post(`/admin/vehicles/${id}/images`, formData);
export const deleteVehicleImage = (id, data) => api.delete(`/admin/vehicles/${id}/images`, { data });
export const manageVehicleAvailability = (id, data) => api.patch(`/admin/vehicles/${id}/availability`, data);
export const transferVehicle = (id, data) => api.patch(`/admin/vehicles/${id}/transfer`, data);

// Bookings Management
export const getAllBookings = (params) => api.get('/admin/bookings', { params });
export const getBookingDetails = (id) => api.get(`/admin/bookings/${id}`);
export const updateBookingStatus = (id, statusData) => api.patch(`/admin/bookings/${id}/status`, statusData);
export const cancelBookingAdmin = (id, data) => api.post(`/admin/bookings/${id}/cancel`, data);

// Payments Management
export const getAllPayments = (params) => api.get('/admin/payments', { params });
export const getPaymentDetails = (id) => api.get(`/admin/payments/${id}`);
export const initiateAdminRefund = (id, data) => api.post(`/admin/payments/${id}/refund`, data);

// Analytics & Reports
export const getSystemAnalytics = (params) => api.get('/admin/analytics', { params });
export const getUserAnalytics = (params) => api.get('/admin/analytics/users', { params });
export const getVendorPerformance = (params) => api.get('/admin/analytics/vendors/performance', { params });
export const getRevenueAnalytics = (params) => api.get('/admin/analytics/revenue', { params });
export const getBookingQualityMetrics = (params) => api.get('/admin/analytics/bookings/quality', { params });
export const getRefundAnalytics = (params) => api.get('/admin/analytics/refunds', { params });
export const generateFinancialReport = (params) => api.get('/admin/reports/financial', { params });
export const getUserGrowthReport = (params) => api.get('/admin/reports/user-growth', { params });
export const getBookingTrends = (params) => api.get('/admin/reports/booking-trends', { params });

// System Management
export const getSystemHealth = () => api.get('/admin/system/health');
export const getSystemSettings = () => api.get('/admin/settings');
export const updateSystemSettings = (data) => api.put('/admin/settings', data);
export const getAuditLog = (params) => api.get('/admin/audit-log', { params });
export const exportData = (params) => api.get('/admin/export', { params });

// Promo Codes Management
export const getAllPromoCodes = (params) => api.get('/admin/promo-codes', { params });
export const createPromoCode = (data) => api.post('/admin/promo-codes', data);
export const updatePromoCode = (id, data) => api.put(`/admin/promo-codes/${id}`, data);
export const deletePromoCode = (id) => api.delete(`/admin/promo-codes/${id}`);

