// src/pages/admin/AdminPayments.jsx
import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Eye, DollarSign, User, Building, 
  Calendar, CheckCircle, XCircle, RefreshCw, CreditCard
} from 'lucide-react';
import { getAllPayments, initiateAdminRefund } from '../../services/adminApi';

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
          <h3 className="font-semibold text-gray-900">Payment #{payment.gatewayPaymentId?.slice(-8)}</h3>
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

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        dateFrom: dateFilter || undefined
      };
      const response = await getAllPayments(params);
      setPayments(response.data.data.payments || []);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
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
    }
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
              onChange={(e) => setStatusFilter(e.target.value)}
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
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={fetchPayments}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {payments.map((payment) => (
              <PaymentCard
                key={payment._id}
                payment={payment}
                onView={(id) => console.log('View payment:', id)}
                onRefund={(id) => setRefundModal({ isOpen: true, payment: payment })}
              />
            ))}
          </div>
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
      </div>
    </div>
  );
}