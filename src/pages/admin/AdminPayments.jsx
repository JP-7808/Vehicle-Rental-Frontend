import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Eye, DollarSign, User, Building, 
  Calendar, CheckCircle, XCircle, RefreshCw, CreditCard,
  Download, FileText, Shield,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react';
import { 
  getAllPayments, 
  initiateAdminRefund,
  getPaymentDetails 
} from '../../services/adminApi';

const PaymentCard = ({ payment, onView, onRefund }) => {
  const getStatusColor = (status) => {
    const statusColors = {
      'success': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800',
      'refunded': 'bg-blue-100 text-blue-800',
      'initiated': 'bg-yellow-100 text-yellow-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">
            Payment {payment.gatewayPaymentId ? `#${payment.gatewayPaymentId.slice(-8)}` : `#${payment._id.slice(-8)}`}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {formatDate(payment.createdAt)}
          </p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
          {payment.status.toUpperCase()}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <User className="h-4 w-4" />
          <span>{payment.user?.name}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Building className="h-4 w-4" />
          <span>{payment.vendor?.companyName}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <CreditCard className="h-4 w-4" />
          <span>{payment.paymentMethod || 'N/A'}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <DollarSign className="h-4 w-4 text-green-600" />
          <span className="font-semibold text-green-600 text-lg">
            ₹{payment.amount?.toLocaleString()}
          </span>
        </div>
        {payment.refundDetails?.refundedAmount > 0 && (
          <div className="flex items-center space-x-2 text-sm">
            <RefreshCw className="h-4 w-4 text-blue-600" />
            <span className="text-blue-600">
              Refunded: ₹{payment.refundDetails.refundedAmount.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => onView(payment._id)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
        >
          <Eye className="h-4 w-4" />
          <span>View Details</span>
        </button>

        <div className="flex space-x-2">
          {payment.status === 'success' && !payment.refundDetails?.refundedAmount && (
            <button
              onClick={() => onRefund(payment._id)}
              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              title="Initiate Refund"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Add this Pagination component
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
    <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
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

const PaymentDetailModal = ({ payment, isOpen, onClose }) => {
  if (!isOpen || !payment) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'success': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800',
      'refunded': 'bg-blue-100 text-blue-800',
      'initiated': 'bg-yellow-100 text-yellow-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
              <p className="text-gray-600">
                {payment.gatewayPaymentId ? `Gateway ID: ${payment.gatewayPaymentId}` : `ID: ${payment._id}`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Payment Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Payment Status</h3>
                <p className="text-gray-600">Current status of the payment</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                {payment.status.toUpperCase()}
              </span>
            </div>

            {/* Payment Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <p className="mt-1 text-2xl font-bold text-green-600">₹{payment.amount?.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Currency</label>
                  <p className="mt-1 text-sm text-gray-900">{payment.currency || 'INR'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{payment.paymentMethod || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gateway</label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{payment.gateway || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created At</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(payment.createdAt)}</p>
                </div>
                {payment.paidAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Paid At</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(payment.paidAt)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Gateway Information */}
            {(payment.gatewayPaymentId || payment.gatewayOrderId) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Gateway Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {payment.gatewayPaymentId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Gateway Payment ID</label>
                      <p className="mt-1 text-sm text-gray-900 font-mono">{payment.gatewayPaymentId}</p>
                    </div>
                  )}
                  {payment.gatewayOrderId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Gateway Order ID</label>
                      <p className="mt-1 text-sm text-gray-900 font-mono">{payment.gatewayOrderId}</p>
                    </div>
                  )}
                  {payment.gatewaySignature && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Gateway Signature</label>
                      <p className="mt-1 text-sm text-gray-900 font-mono break-all">{payment.gatewaySignature}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Customer Information */}
            {payment.user && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{payment.user.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{payment.user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{payment.user.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User ID</label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">{payment.user._id}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Vendor Information */}
            {payment.vendor && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                    <p className="mt-1 text-sm text-gray-900">{payment.vendor.companyName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                    <p className="mt-1 text-sm text-gray-900">{payment.vendor.contactEmail}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{payment.vendor.contactPhone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Vendor ID</label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">{payment.vendor._id}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Booking Information */}
            {payment.booking && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Booking Reference</label>
                    <p className="mt-1 text-sm text-gray-900">{payment.booking.bookingRef}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Booking ID</label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">{payment.booking._id}</p>
                  </div>
                  {payment.booking.pickup && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Pickup Location</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {payment.booking.pickup.locationName}, {payment.booking.pickup.city}
                      </p>
                    </div>
                  )}
                  {payment.booking.vehicle && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Vehicle</label>
                      <p className="mt-1 text-sm text-gray-900">{payment.booking.vehicle.title}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Refund Information */}
            {payment.refundDetails && payment.refundDetails.refundedAmount > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Refund Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Refunded Amount</label>
                    <p className="mt-1 text-sm text-blue-600 font-semibold">
                      ₹{payment.refundDetails.refundedAmount?.toLocaleString()}
                    </p>
                  </div>
                  {payment.refundDetails.refundAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Refunded At</label>
                      <p className="mt-1 text-sm text-gray-900">{formatDate(payment.refundDetails.refundAt)}</p>
                    </div>
                  )}
                  {payment.refundDetails.refundTransactionId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Refund Transaction ID</label>
                      <p className="mt-1 text-sm text-gray-900 font-mono">{payment.refundDetails.refundTransactionId}</p>
                    </div>
                  )}
                  {payment.refundDetails.refundStatus && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Refund Status</label>
                      <span className={`mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        payment.refundDetails.refundStatus === 'completed' ? 'bg-green-100 text-green-800' :
                        payment.refundDetails.refundStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {payment.refundDetails.refundStatus.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Additional Metadata */}
            {payment.meta && Object.keys(payment.meta).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Metadata</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm text-gray-900 whitespace-pre-wrap">
                    {JSON.stringify(payment.meta, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
              {payment.gatewayPaymentId && (
                <button
                  onClick={() => window.open(`https://dashboard.razorpay.com/payments/${payment.gatewayPaymentId}`, '_blank')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Shield className="h-4 w-4" />
                  <span>View in Razorpay</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RefundModal = ({ payment, isOpen, onClose, onRefund }) => {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (payment) {
      setAmount(payment.amount.toString());
    }
  }, [payment]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onRefund(payment._id, parseFloat(amount), reason);
    setAmount('');
    setReason('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Initiate Refund</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Refund Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={payment.amount}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum refundable amount: ₹{payment.amount}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Refund Reason
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter reason for refund..."
                required
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
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Initiate Refund
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [refundModal, setRefundModal] = useState({ isOpen: false, payment: null });
  const [detailModal, setDetailModal] = useState({ isOpen: false, payment: null });
  
  // Pagination state - ADD THESE LINES
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(9); // 9 items per page for 3-column grid

  useEffect(() => {
    fetchPayments();
  }, [currentPage, searchTerm, statusFilter, dateFilter]); // Add dependencies

  // In adminPayments.js - Update the fetchPayments function
const fetchPayments = async () => {
  try {
    setLoading(true);
    const params = {
      search: searchTerm || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      dateFrom: dateFilter || undefined,
      page: currentPage,
      limit: itemsPerPage
    };
    
    const response = await getAllPayments(params);
    
    // Debug: Log the response to see its structure
    console.log('Payments API Response:', response);
    
    // Check if response.data exists and has the expected structure
    if (response.data && response.data.success) {
      const data = response.data.data;
      setPayments(data.payments || []);
      
      // Check if pagination data exists in the expected format
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages || 1);
        setTotalItems(data.pagination.totalItems || 0);
      } else {
        // Fallback if pagination data is not in expected format
        console.warn('Pagination data not found in expected format');
        setTotalPages(1);
        setTotalItems(data.payments?.length || 0);
      }
    } else {
      console.error('API response format unexpected:', response);
      setPayments([]);
      setTotalPages(1);
      setTotalItems(0);
    }
  } catch (error) {
    console.error('Failed to fetch payments:', error);
    alert('Failed to fetch payments');
    setPayments([]);
    setTotalPages(1);
    setTotalItems(0);
  } finally {
    setLoading(false);
  }
};

  const handleRefund = async (paymentId, amount, reason) => {
    try {
      await initiateAdminRefund(paymentId, { amount, reason });
      setRefundModal({ isOpen: false, payment: null });
      fetchPayments(); // Refresh the list
    } catch (error) {
      console.error('Failed to initiate refund:', error);
      alert('Failed to initiate refund');
    }
  };

  const handleViewPayment = async (paymentId) => {
    try {
      const response = await getPaymentDetails(paymentId);
      setDetailModal({ isOpen: true, payment: response.data.data.payment });
    } catch (error) {
      console.error('Failed to fetch payment details:', error);
      alert('Failed to fetch payment details');
    }
  };

  // ADD handlePageChange function
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // ADD handleFilterChange function
  const handleFilterChange = () => {
    setCurrentPage(1); // Reset to first page when filters change
    fetchPayments();
  };

  const totalRevenue = payments
    .filter(p => p.status === 'success')
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
              <p className="text-gray-600 mt-2">Manage payments and refunds</p>
            </div>
            <div className="bg-green-100 border border-green-200 rounded-lg px-4 py-2">
              <div className="flex items-center space-x-2 text-green-800">
                <DollarSign className="h-4 w-4" />
                <span className="font-medium">Total Revenue: ₹{totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search payments..."
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
              <option value="initiated">Initiated</option>
            </select>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                handleFilterChange();
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => {
                setCurrentPage(1);
                fetchPayments();
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>

        {/* Payments Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {payments.map((payment) => (
                <PaymentCard
                  key={payment._id}
                  payment={payment}
                  onView={handleViewPayment}
                  onRefund={(id) => setRefundModal({ isOpen: true, payment: payment })}
                />
              ))}
            </div>

            {/* ADD Pagination Component */}
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

        {!loading && payments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <CreditCard className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Refund Modal */}
        <RefundModal
          payment={refundModal.payment}
          isOpen={refundModal.isOpen}
          onClose={() => setRefundModal({ isOpen: false, payment: null })}
          onRefund={handleRefund}
        />

        {/* Payment Detail Modal */}
        <PaymentDetailModal
          payment={detailModal.payment}
          isOpen={detailModal.isOpen}
          onClose={() => setDetailModal({ isOpen: false, payment: null })}
        />
      </div>
    </div>
  );
}