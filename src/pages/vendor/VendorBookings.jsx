// src/pages/vendor/VendorBookings.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, Filter, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';

const VendorBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/vendors/bookings');
      setBookings(response.data.data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setAlert({
        show: true,
        type: 'error',
        message: 'Failed to load bookings',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status });
      setAlert({
        show: true,
        type: 'success',
        message: `Booking ${status.replace('_', ' ')} successfully`,
      });
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error('Error updating booking status:', error);
      setAlert({
        show: true,
        type: 'error',
        message: 'Failed to update booking status',
      });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending_payment: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      checked_out: 'bg-purple-100 text-purple-800',
      in_progress: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      no_show: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending_payment: Clock,
      confirmed: CheckCircle,
      checked_out: Calendar,
      in_progress: Calendar,
      completed: CheckCircle,
      cancelled: XCircle,
      no_show: XCircle,
    };
    return icons[status] || Clock;
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const statusCounts = {
    all: bookings.length,
    pending_payment: bookings.filter(b => b.status === 'pending_payment').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    in_progress: bookings.filter(b => b.status === 'in_progress').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => ['cancelled', 'no_show'].includes(b.status)).length,
  };

  const statusFilters = [
    { key: 'all', label: 'All', count: statusCounts.all },
    { key: 'pending_payment', label: 'Pending Payment', count: statusCounts.pending_payment },
    { key: 'confirmed', label: 'Confirmed', count: statusCounts.confirmed },
    { key: 'in_progress', label: 'In Progress', count: statusCounts.in_progress },
    { key: 'completed', label: 'Completed', count: statusCounts.completed },
    { key: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-600 mt-1">Manage customer bookings for your vehicles</p>
      </div>

      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ show: false, type: '', message: '' })}
        />
      )}

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((status) => (
              <button
                key={status.key}
                onClick={() => setFilter(status.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
                  filter === status.key
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.label} ({status.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? "You don't have any bookings yet."
                : `No ${filter.replace('_', ' ')} bookings found.`
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking & Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => {
                  const StatusIcon = getStatusIcon(booking.status);
                  
                  return (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.bookingRef}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.vehicle?.title}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {booking.customer?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.customer?.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(booking.pickup.datetime).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          to {new Date(booking.dropoff.datetime).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(booking.priceBreakdown?.totalPayable || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {booking.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => window.open(`/bookings/${booking._id}`, '_blank')}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          {/* Action buttons based on status */}
                          {booking.status === 'confirmed' && (
                            <button
                              onClick={() => updateBookingStatus(booking._id, 'checked_out')}
                              className="text-green-600 hover:text-green-900 text-sm"
                            >
                              Check Out
                            </button>
                          )}
                          
                          {booking.status === 'checked_out' && (
                            <button
                              onClick={() => updateBookingStatus(booking._id, 'in_progress')}
                              className="text-green-600 hover:text-green-900 text-sm"
                            >
                              Start Trip
                            </button>
                          )}
                          
                          {booking.status === 'in_progress' && (
                            <button
                              onClick={() => updateBookingStatus(booking._id, 'completed')}
                              className="text-green-600 hover:text-green-900 text-sm"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Statistics */}
      {bookings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white shadow rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{statusCounts.confirmed}</div>
            <div className="text-sm text-gray-600">Confirmed</div>
          </div>
          <div className="bg-white shadow rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{statusCounts.in_progress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white shadow rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{statusCounts.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white shadow rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending_payment}</div>
            <div className="text-sm text-gray-600">Pending Payment</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorBookings;