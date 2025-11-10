// src/pages/admin/AdminVendors.jsx
import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Eye, Edit, CheckCircle, XCircle, 
  Building, Mail, Phone, MapPin, Calendar, Star,
  AlertCircle
} from 'lucide-react';
import { getAllVendors, verifyVendorKYC, rejectVendorKYC, updateVendorStatus } from '../../services/adminApi';

const VendorCard = ({ vendor, onView, onVerify, onReject, onStatusChange }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getKYCStatusText = (status) => {
    switch (status) {
      case 'verified': return 'Verified';
      case 'pending': return 'Pending Review';
      case 'rejected': return 'Rejected';
      default: return 'Not Submitted';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Building className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{vendor.companyName}</h3>
            <p className="text-sm text-gray-600">{vendor.contactEmail}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vendor.kyc?.status)}`}>
            {getKYCStatusText(vendor.kyc?.status)}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            vendor.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {vendor.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center space-x-2 text-gray-600">
          <Phone className="h-4 w-4" />
          <span>{vendor.contactPhone}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{vendor.address?.city || 'N/A'}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Star className="h-4 w-4" />
          <span>{vendor.rating || 0}/5 ({vendor.ratingCount || 0} reviews)</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{new Date(vendor.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => onView(vendor._id)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
        >
          <Eye className="h-4 w-4" />
          <span>View Details</span>
        </button>

        <div className="flex space-x-2">
          {vendor.kyc?.status === 'pending' && (
            <>
              <button
                onClick={() => onVerify(vendor._id)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Verify KYC"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
              <button
                onClick={() => onReject(vendor._id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Reject KYC"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </>
          )}
          <button
            onClick={() => onStatusChange(vendor._id, !vendor.isActive)}
            className={`p-2 rounded-lg transition-colors ${
              vendor.isActive 
                ? 'text-red-600 hover:bg-red-50' 
                : 'text-green-600 hover:bg-green-50'
            }`}
            title={vendor.isActive ? 'Deactivate' : 'Activate'}
          >
            {vendor.isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>
    </div>
  );
};

const KYCModal = ({ vendor, isOpen, onClose, onAction, actionType }) => {
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAction(vendor._id, notes);
    setNotes('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {actionType === 'verify' ? 'Verify KYC' : 'Reject KYC'} - {vendor.companyName}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {actionType === 'verify' ? 'Verification Notes (Optional)' : 'Rejection Reason'}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={actionType === 'verify' ? 'Add any notes about this verification...' : 'Please provide reason for rejection...'}
                required={actionType === 'reject'}
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg text-white transition-colors ${
                  actionType === 'verify' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionType === 'verify' ? 'Verify KYC' : 'Reject KYC'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function AdminVendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [kycFilter, setKycFilter] = useState('all');
  const [kycModal, setKycModal] = useState({ isOpen: false, vendor: null, actionType: null });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        kycStatus: kycFilter !== 'all' ? kycFilter : undefined
      };
      const response = await getAllVendors(params);
      setVendors(response.data.data.vendors || []);
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyKYC = async (vendorId, notes) => {
    try {
      await verifyVendorKYC(vendorId, { notes });
      setKycModal({ isOpen: false, vendor: null, actionType: null });
      fetchVendors(); // Refresh the list
    } catch (error) {
      console.error('Failed to verify KYC:', error);
    }
  };

  const handleRejectKYC = async (vendorId, reason) => {
    try {
      await rejectVendorKYC(vendorId, { reason });
      setKycModal({ isOpen: false, vendor: null, actionType: null });
      fetchVendors(); // Refresh the list
    } catch (error) {
      console.error('Failed to reject KYC:', error);
    }
  };

  const handleStatusChange = async (vendorId, isActive) => {
    try {
      await updateVendorStatus(vendorId, { isActive });
      fetchVendors(); // Refresh the list
    } catch (error) {
      console.error('Failed to update vendor status:', error);
    }
  };

  const pendingKYCCount = vendors.filter(v => v.kyc?.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
              <p className="text-gray-600 mt-2">Manage vendor accounts and KYC verification</p>
            </div>
            {pendingKYCCount > 0 && (
              <div className="bg-orange-100 border border-orange-200 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2 text-orange-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">{pendingKYCCount} KYC pending review</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={kycFilter}
              onChange={(e) => setKycFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All KYC Status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              onClick={fetchVendors}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>

        {/* Vendors Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((vendor) => (
              <VendorCard
                key={vendor._id}
                vendor={vendor}
                onView={(id) => console.log('View vendor:', id)}
                onVerify={(id) => setKycModal({ isOpen: true, vendor: vendor, actionType: 'verify' })}
                onReject={(id) => setKycModal({ isOpen: true, vendor: vendor, actionType: 'reject' })}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}

        {!loading && vendors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Building className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* KYC Modal */}
        <KYCModal
          vendor={kycModal.vendor}
          isOpen={kycModal.isOpen}
          onClose={() => setKycModal({ isOpen: false, vendor: null, actionType: null })}
          onAction={kycModal.actionType === 'verify' ? handleVerifyKYC : handleRejectKYC}
          actionType={kycModal.actionType}
        />
      </div>
    </div>
  );
}