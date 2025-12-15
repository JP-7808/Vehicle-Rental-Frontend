import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Eye, CheckCircle, XCircle, 
  Building, Mail, Phone, MapPin, Calendar, Star,
  AlertCircle, FileText, Download, User,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react';
import { 
  getAllVendors, 
  verifyVendorKYC, 
  rejectVendorKYC, 
  updateVendorStatus,
  getVendorDetails 
} from '../../services/adminApi';

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
      case 'pending': return 'Pending';
      case 'rejected': return 'Rejected';
      default: return 'Not Submitted';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 h-full flex flex-col">
      {/* Header with vendor info */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Building className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 truncate">{vendor.companyName}</h3>
            <p className="text-sm text-gray-600 truncate">{vendor.contactEmail}</p>
          </div>
        </div>
        
        {/* Status badges - properly aligned on desktop */}
        <div className="flex flex-col items-end space-y-2 ml-4">
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(vendor.kyc?.status)} whitespace-nowrap`}>
            {getKYCStatusText(vendor.kyc?.status)}
          </span>
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
            vendor.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          } whitespace-nowrap`}>
            {vendor.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Vendor details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm flex-grow">
        <div className="flex items-center space-x-2 text-gray-600">
          <Phone className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{vendor.contactPhone || 'N/A'}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{vendor.address?.city || 'N/A'}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Star className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{vendor.rating || 0}/5 ({vendor.ratingCount || 0})</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Calendar className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{new Date(vendor.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-between items-center pt-4 border-t">
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
            className={`p-2 text-sm rounded-lg transition-colors whitespace-nowrap ${
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

  useEffect(() => {
    if (isOpen) {
      setNotes('');
    }
  }, [isOpen]);

  if (!isOpen || !vendor) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (actionType === 'reject' && !notes.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    onAction(vendor._id, notes);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">
              {actionType === 'verify' ? 'Verify KYC' : 'Reject KYC'} - {vendor.companyName}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {actionType === 'verify' ? 'Verification Notes (Optional)' : 'Rejection Reason *'}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={actionType === 'verify' ? 'Add any notes about this verification...' : 'Please provide reason for rejection...'}
                required={actionType === 'reject'}
              />
              {actionType === 'reject' && (
                <p className="text-xs text-gray-500 mt-1">Required for rejection</p>
              )}
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

const VendorDetailModal = ({ vendor, isOpen, onClose }) => {
  if (!isOpen || !vendor) return null;

  const handleDownloadDocument = (documentUrl, documentName) => {
    if (documentUrl) {
      const link = document.createElement('a');
      link.href = documentUrl;
      link.target = '_blank';
      link.download = documentName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Vendor Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <p className="mt-1 text-sm text-gray-900">{vendor.companyName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                  <p className="mt-1 text-sm text-gray-900">{vendor.contactEmail}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{vendor.contactPhone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    vendor.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {vendor.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Verified</label>
                  <span className={`mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    vendor.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {vendor.isVerified ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rating</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {vendor.rating || 0}/5 ({vendor.ratingCount || 0} reviews)
                  </p>
                </div>
              </div>
            </div>

            {/* Address Information */}
            {vendor.address && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vendor.address.addressLine && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Address Line</label>
                      <p className="mt-1 text-sm text-gray-900">{vendor.address.addressLine}</p>
                    </div>
                  )}
                  {vendor.address.city && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">City</label>
                      <p className="mt-1 text-sm text-gray-900">{vendor.address.city}</p>
                    </div>
                  )}
                  {vendor.address.state && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">State</label>
                      <p className="mt-1 text-sm text-gray-900">{vendor.address.state}</p>
                    </div>
                  )}
                  {vendor.address.postalCode && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                      <p className="mt-1 text-sm text-gray-900">{vendor.address.postalCode}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* KYC Information */}
            {vendor.kyc && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">KYC Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">KYC Status</label>
                    <span className={`mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      vendor.kyc.status === 'verified' ? 'bg-green-100 text-green-800' :
                      vendor.kyc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      vendor.kyc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {vendor.kyc.status?.charAt(0).toUpperCase() + vendor.kyc.status?.slice(1)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ID Type</label>
                    <p className="mt-1 text-sm text-gray-900">{vendor.kyc.idType || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ID Number</label>
                    <p className="mt-1 text-sm text-gray-900">{vendor.kyc.idNumber || 'N/A'}</p>
                  </div>
                  {vendor.kyc.submittedAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Submitted At</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(vendor.kyc.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {vendor.kyc.verifiedAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Verified At</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(vendor.kyc.verifiedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {vendor.kyc.notes && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Notes</label>
                      <p className="mt-1 text-sm text-gray-900">{vendor.kyc.notes}</p>
                    </div>
                  )}
                </div>

                {/* KYC Documents */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">KYC Documents</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {vendor.kyc.idDocumentUrl && (
                      <div className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">ID Document</span>
                          <FileText className="h-4 w-4 text-gray-400" />
                        </div>
                        <button
                          onClick={() => handleDownloadDocument(vendor.kyc.idDocumentUrl, 'id-document')}
                          className="w-full bg-blue-50 text-blue-600 py-2 rounded text-sm hover:bg-blue-100 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Download className="h-3 w-3" />
                          <span>View Document</span>
                        </button>
                      </div>
                    )}
                    {vendor.kyc.businessProofUrl && (
                      <div className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Business Proof</span>
                          <FileText className="h-4 w-4 text-gray-400" />
                        </div>
                        <button
                          onClick={() => handleDownloadDocument(vendor.kyc.businessProofUrl, 'business-proof')}
                          className="w-full bg-blue-50 text-blue-600 py-2 rounded text-sm hover:bg-blue-100 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Download className="h-3 w-3" />
                          <span>View Document</span>
                        </button>
                      </div>
                    )}
                    {vendor.kyc.licenseUrl && (
                      <div className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">License</span>
                          <FileText className="h-4 w-4 text-gray-400" />
                        </div>
                        <button
                          onClick={() => handleDownloadDocument(vendor.kyc.licenseUrl, 'license')}
                          className="w-full bg-blue-50 text-blue-600 py-2 rounded text-sm hover:bg-blue-100 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Download className="h-3 w-3" />
                          <span>View Document</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* User Information */}
            {vendor.user && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{vendor.user.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{vendor.user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{vendor.user.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User Status</label>
                    <span className={`mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      vendor.user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {vendor.user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Statistics */}
            {vendor.statistics && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{vendor.statistics.totalVehicles || 0}</p>
                    <p className="text-sm text-gray-600">Total Vehicles</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{vendor.statistics.totalBookings || 0}</p>
                    <p className="text-sm text-gray-600">Total Bookings</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">₹{vendor.statistics.totalEarnings?.toLocaleString() || 0}</p>
                    <p className="text-sm text-gray-600">Total Earnings</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);
      
      if (currentPage <= 3) {
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - maxVisiblePages + 1;
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-b-lg">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{startItem}</span> to{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{totalItems}</span> results
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">First</span>
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                  currentPage === page
                    ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Last</span>
              <ChevronsRight className="h-4 w-4" />
            </button>
          </nav>
        </div>
      </div>
      
      {/* Mobile pagination */}
      <div className="flex items-center justify-between w-full sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <div className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
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
  const [detailModal, setDetailModal] = useState({ isOpen: false, vendor: null });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(9);

  useEffect(() => {
    fetchVendors();
  }, [currentPage, searchTerm, statusFilter, kycFilter]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        kycStatus: kycFilter !== 'all' ? kycFilter : undefined,
        page: currentPage,
        limit: itemsPerPage
      };
      const response = await getAllVendors(params);
      const data = response.data.data;
      setVendors(data.vendors || []);
      setTotalPages(data.totalPages || 1);
      setTotalItems(data.totalItems || 0);
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
      alert('Failed to fetch vendors');
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
      alert('Failed to verify KYC');
    }
  };

  const handleRejectKYC = async (vendorId, reason) => {
    try {
      await rejectVendorKYC(vendorId, { reason });
      setKycModal({ isOpen: false, vendor: null, actionType: null });
      fetchVendors(); // Refresh the list
    } catch (error) {
      console.error('Failed to reject KYC:', error);
      alert('Failed to reject KYC');
    }
  };

  const handleStatusChange = async (vendorId, isActive) => {
    try {
      await updateVendorStatus(vendorId, { isActive });
      fetchVendors(); // Refresh the list
    } catch (error) {
      console.error('Failed to update vendor status:', error);
      alert('Failed to update vendor status');
    }
  };

  const handleViewVendor = async (vendorId) => {
    try {
      const response = await getVendorDetails(vendorId);
      setDetailModal({ isOpen: true, vendor: response.data.data.vendor });
    } catch (error) {
      console.error('Failed to fetch vendor details:', error);
      alert('Failed to fetch vendor details');
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchVendors();
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
    fetchVendors();
  };

  const pendingKYCCount = vendors.filter(v => v.kyc?.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Vendor Management</h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Manage vendor accounts and KYC verification</p>
            </div>
            {pendingKYCCount > 0 && (
              <div className="bg-orange-100 border border-orange-200 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2 text-orange-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">{pendingKYCCount} KYC pending</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="relative sm:col-span-2 lg:col-span-1">
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
              onChange={(e) => {
                setStatusFilter(e.target.value);
                handleFilterChange();
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={kycFilter}
              onChange={(e) => {
                setKycFilter(e.target.value);
                handleFilterChange();
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              <option value="all">All KYC Status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <Filter className="h-4 w-4" />
              <span>Apply Filters</span>
            </button>
          </form>
        </div>

        {/* Vendors Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
              {vendors.map((vendor) => (
                <VendorCard
                  key={vendor._id}
                  vendor={vendor}
                  onView={handleViewVendor}
                  onVerify={(id) => setKycModal({ isOpen: true, vendor: vendor, actionType: 'verify' })}
                  onReject={(id) => setKycModal({ isOpen: true, vendor: vendor, actionType: 'reject' })}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>

            {/* Pagination - shows when there are 10+ vendors (9 per page) */}
            {totalPages > 1 && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
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

        {/* Vendor Detail Modal */}
        <VendorDetailModal
          vendor={detailModal.vendor}
          isOpen={detailModal.isOpen}
          onClose={() => setDetailModal({ isOpen: false, vendor: null })}
        />
      </div>
    </div>
  );
}