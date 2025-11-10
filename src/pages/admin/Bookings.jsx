// src/pages/admin/Bookings.jsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, User, Car, DollarSign, MoreVertical, CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/admin/bookings');
      setBookings(response.data.data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Mock data for development
      const mockBookings = [
        {
          _id: '1',
          bookingRef: 'BOOK_001',
          customer: { name: 'John Doe', email: 'john@example.com' },
          vendor: { companyName: 'City Cars Rental' },
          vehicle: { title: 'Toyota Innova Crysta', vehicleType: 'car' },
          pickup: { datetime: '2024-03-20T10:00:00', locationName: 'Airport' },
          dropoff: { datetime: '2024-03-22T18:00:00', locationName: 'Airport' },
          status: 'confirmed',
          priceBreakdown: { totalPayable: 7500 },
          createdAt: '2024-03-15'
        },
        {
          _id: '2',
          bookingRef: 'BOOK_002',
          customer: { name: 'Jane Smith', email: 'jane@example.com' },
          vendor: { companyName: 'Premium Bikes' },
          vehicle: { title: 'Royal Enfield Classic 350', vehicleType: 'bike' },
          pickup: { datetime: '2024-03-18T09:00:00', locationName: 'Downtown' },
          dropoff: { datetime: '2024-03-19T17:00:00', locationName: 'Downtown' },
          status: 'completed',
          priceBreakdown: { totalPayable: 1600 },
          createdAt: '2024-03-10'
        },
      ];
      setBookings(mockBookings);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await api.patch(`/admin/bookings/${bookingId}`, { status });
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
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
    };
    return icons[status] || Clock;
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.bookingRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.vendor.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const BookingRow = ({ booking }) => {
    const StatusIcon = getStatusIcon(booking.status);

    return (
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{booking.bookingRef}</div>
          <div className="text-sm text-gray-500">
            {new Date(booking.createdAt).toLocaleDateString()}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{booking.customer.name}</div>
          <div className="text-sm text-gray-500">{booking.customer.email}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{booking.vendor.companyName}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{booking.vehicle.title}</div>
          <div className="text-sm text-gray-500 capitalize">{booking.vehicle.vehicleType}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{formatDate(booking.pickup.datetime)}</div>
          <div className="text-sm text-gray-500">{booking.pickup.locationName}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          ₹{booking.priceBreakdown.totalPayable}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {booking.status.replace('_', ' ')}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center justify-end space-x-2">
            {booking.status === 'pending_payment' && (
              <>
                <button
                  onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                >
                  Confirm
                </button>
                <button
                  onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Cancel
                </button>
              </>
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
          <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
          <p className="text-gray-600 mt-1">Manage all bookings in the system</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                {bookings.length} Total Bookings
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
              placeholder="Search bookings..."
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
              <option value="pending_payment">Pending Payment</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pickup
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <BookingRow key={booking._id} booking={booking} />
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
              <span className="font-medium">{filteredBookings.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;