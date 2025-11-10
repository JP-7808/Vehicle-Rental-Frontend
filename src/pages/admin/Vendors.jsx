// src/pages/admin/Vendors.jsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, Building, Star, CheckCircle, XCircle, Clock, MoreVertical } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      // Mock data - replace with actual API call
      const mockVendors = [
        {
          _id: '1',
          companyName: 'City Cars Rental',
          contactEmail: 'info@citycars.com',
          contactPhone: '+1234567890',
          rating: 4.5,
          ratingCount: 124,
          kycStatus: 'verified',
          isVerified: true,
          vehiclesCount: 12,
          totalBookings: 45,
          joinedDate: '2024-01-15'
        },
        {
          _id: '2',
          companyName: 'Premium Bikes',
          contactEmail: 'contact@premiumbikes.com',
          contactPhone: '+1234567891',
          rating: 4.2,
          ratingCount: 89,
          kycStatus: 'pending',
          isVerified: false,
          vehiclesCount: 8,
          totalBookings: 23,
          joinedDate: '2024-02-01'
        },
        // Add more mock vendors...
      ];
      setVendors(mockVendors);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateKycStatus = async (vendorId, status) => {
    try {
      await api.patch(`/admin/vendors/${vendorId}/kyc`, { status });
      fetchVendors(); // Refresh the list
    } catch (error) {
      console.error('Error updating KYC status:', error);
    }
  };

  const getKycStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getKycStatusIcon = (status) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vendor.kycStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const VendorCard = ({ vendor }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Building className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{vendor.companyName}</h3>
            <p className="text-gray-600 text-sm">{vendor.contactEmail}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getKycStatusColor(vendor.kycStatus)}`}>
            {getKycStatusIcon(vendor.kycStatus)}
            <span className="ml-1 capitalize">{vendor.kycStatus}</span>
          </span>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-600">Phone:</span>
          <p className="font-medium">{vendor.contactPhone}</p>
        </div>
        <div>
          <span className="text-gray-600">Rating:</span>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 font-medium">{vendor.rating}</span>
            <span className="text-gray-500 ml-1">({vendor.ratingCount})</span>
          </div>
        </div>
        <div>
          <span className="text-gray-600">Vehicles:</span>
          <p className="font-medium">{vendor.vehiclesCount}</p>
        </div>
        <div>
          <span className="text-gray-600">Bookings:</span>
          <p className="font-medium">{vendor.totalBookings}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <span className="text-sm text-gray-500">
          Joined {new Date(vendor.joinedDate).toLocaleDateString()}
        </span>
        <div className="flex space-x-2">
          {vendor.kycStatus === 'pending' && (
            <>
              <button
                onClick={() => updateKycStatus(vendor._id, 'verified')}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => updateKycStatus(vendor._id, 'rejected')}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
            </>
          )}
          <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendors Management</h1>
          <p className="text-gray-600 mt-1">Manage and verify vendor accounts</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">
                {vendors.filter(v => v.kycStatus === 'pending').length} Pending KYC
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVendors.map((vendor) => (
          <VendorCard key={vendor._id} vendor={vendor} />
        ))}
      </div>

      {filteredVendors.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default Vendors;