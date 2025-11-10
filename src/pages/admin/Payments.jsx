// src/pages/admin/Payments.jsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, DollarSign, CheckCircle, XCircle, Clock, Download, MoreVertical } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/admin/payments');
      setPayments(response.data.data.payments || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      // Mock data for development
      const mockPayments = [
        {
          _id: '1',
          gatewayPaymentId: 'pay_001',
          amount: 7500,
          currency: 'INR',
          status: 'success',
          paymentMethod: 'card',
          user: { name: 'John Doe' },
          vendor: { companyName: 'City Cars Rental' },
          booking: { bookingRef: 'BOOK_001' },
          paidAt: '2024-03-15T10:30:00',
          refundDetails: { refundedAmount: 0 }
        },
        {
          _id: '2',
          gatewayPaymentId: 'pay_002',
          amount: 1600,
          currency: 'INR',
          status: 'failed',
          paymentMethod: 'upi',
          user: { name: 'Jane Smith' },
          vendor: { companyName: 'Premium Bikes' },
          booking: { bookingRef: 'BOOK_002' },
          paidAt: null,
          refundDetails: { refundedAmount: 0 }
        },
        {
          _id: '3',
          gatewayPaymentId: 'pay_003',
          amount: 5000,
          currency: 'INR',
          status: 'refunded',
          paymentMethod: 'card',
          user: { name: 'Mike Johnson' },
          vendor: { companyName: 'Luxury Cars' },
          booking: { bookingRef: 'BOOK_003' },
          paidAt: '2024-03-10T14:20:00',
          refundDetails: { refundedAmount: 5000 }
        },
      ];
      setPayments(mockPayments);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      success: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-purple-100 text-purple-800',
      initiated: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      success: CheckCircle,
      failed: XCircle,
      refunded: DollarSign,
      initiated: Clock,
    };
    return icons[status] || Clock;
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.gatewayPaymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.booking.bookingRef.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const PaymentRow = ({ payment }) => {
    const StatusIcon = getStatusIcon(payment.status);

    return (
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{payment.gatewayPaymentId}</div>
          <div className="text-sm text-gray-500">{payment.booking.bookingRef}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{payment.user.name}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{payment.vendor.companyName}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {formatCurrency(payment.amount)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {payment.paymentMethod}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {payment.status}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : 'N/A'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center justify-end space-x-2">
            {payment.status === 'success' && payment.refundDetails.refundedAmount === 0 && (
              <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors">
                Refund
              </button>
            )}
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Payments Management</h1>
          <p className="text-gray-600 mt-1">Manage and monitor all payment transactions</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(payments.reduce((sum, payment) => sum + (payment.status === 'success' ? payment.amount : 0), 0))}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Successful</p>
              <p className="text-2xl font-bold text-gray-900">
                {payments.filter(p => p.status === 'success').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-100">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-gray-900">
                {payments.filter(p => p.status === 'failed').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Refunded</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(payments.reduce((sum, payment) => sum + payment.refundDetails.refundedAmount, 0))}
              </p>
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
              placeholder="Search payments..."
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
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
              <option value="initiated">Initiated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment & Booking
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <PaymentRow key={payment._id} payment={payment} />
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;