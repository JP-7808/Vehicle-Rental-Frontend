import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Eye, Calendar, User, Car, 
  MapPin, DollarSign, Clock, CheckCircle, XCircle,
  AlertCircle, CreditCard, Building, Phone, Mail
} from 'lucide-react';
import { 
  getAllBookings, 
  updateBookingStatus, 
  cancelBookingAdmin,
  getBookingDetails 
} from '../../services/adminApi';

const BookingCard = ({ booking, onView, onStatusChange, onCancel }) => {
  const getStatusColor = (status) => {
    const statusColors = {
      'pending_payment': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'checked_out': 'bg-purple-100 text-purple-800',
      'in_progress': 'bg-indigo-100 text-indigo-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'no_show': 'bg-gray-100 text-gray-800',
      'refunded': 'bg-gray-100 text-gray-800'
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
          <h3 className="font-semibold text-gray-900">{booking.bookingRef}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {formatDate(booking.pickup.datetime)} - {formatDate(booking.dropoff.datetime)}
          </p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
          {booking.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <User className="h-4 w-4" />
          <span>{booking.customer?.name}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Car className="h-4 w-4" />
          <span>{booking.vehicle?.title}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{booking.pickup.city} → {booking.dropoff.city}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <DollarSign className="h-4 w-4" />
          <span className="font-semibold text-green-600">
            ₹{booking.priceBreakdown?.totalPayable?.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => onView(booking._id)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
        >
          <Eye className="h-4 w-4" />
          <span>View Details</span>
        </button>

        <div className="flex space-x-2">
          {!['completed', 'cancelled', 'refunded'].includes(booking.status) && (
            <>
              <button
                onClick={() => onStatusChange(booking._id, 'completed')}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Mark Completed"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
              <button
                onClick={() => onCancel(booking._id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Cancel Booking"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const BookingDetailModal = ({ booking, isOpen, onClose }) => {
  if (!isOpen || !booking) return null;

  const formatDate = (dateString) => {
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
      'pending_payment': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'checked_out': 'bg-purple-100 text-purple-800',
      'in_progress': 'bg-indigo-100 text-indigo-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'no_show': 'bg-gray-100 text-gray-800',
      'refunded': 'bg-gray-100 text-gray-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
              <p className="text-gray-600">{booking.bookingRef}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Booking Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Booking Status</h3>
                <p className="text-gray-600">Current status of the booking</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                {booking.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            {/* Trip Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-2">Pickup</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-900">{booking.pickup.locationName}</p>
                      <p className="text-sm text-gray-600">{booking.pickup.city}</p>
                      <p className="text-sm text-gray-600">{formatDate(booking.pickup.datetime)}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-2">Dropoff</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-900">{booking.dropoff.locationName}</p>
                      <p className="text-sm text-gray-600">{booking.dropoff.city}</p>
                      <p className="text-sm text-gray-600">{formatDate(booking.dropoff.datetime)}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 text-sm text-blue-700">
                  <Clock className="h-4 w-4" />
                  <span>
                    Duration: {booking.duration?.days || 0} days, {booking.duration?.hours || 0} hours
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            {booking.customer && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{booking.customer.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{booking.customer.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{booking.customer.phone}</p>
                  </div>
                  {booking.customer.address && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {booking.customer.address.addressLine}, {booking.customer.address.city}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Vehicle Information */}
            {booking.vehicle && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Vehicle</label>
                    <p className="mt-1 text-sm text-gray-900">{booking.vehicle.title}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{booking.vehicle.vehicleType}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Make & Model</label>
                    <p className="mt-1 text-sm text-gray-900">{booking.vehicle.make} {booking.vehicle.model}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Transmission</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{booking.vehicle.transmission}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{booking.vehicle.fuelType}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Seats</label>
                    <p className="mt-1 text-sm text-gray-900">{booking.vehicle.seats} seats</p>
                  </div>
                </div>
              </div>
            )}

            {/* Vendor Information */}
            {booking.vendor && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                    <p className="mt-1 text-sm text-gray-900">{booking.vendor.companyName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                    <p className="mt-1 text-sm text-gray-900">{booking.vendor.contactEmail}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{booking.vendor.contactPhone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rating</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {booking.vendor.rating || 0}/5 ({booking.vendor.ratingCount || 0} reviews)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Breakdown */}
            {booking.priceBreakdown && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Breakdown</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Base Amount</span>
                      <span className="text-sm font-medium">₹{booking.priceBreakdown.baseAmount?.toLocaleString()}</span>
                    </div>
                    {booking.priceBreakdown.driverAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Driver Amount</span>
                        <span className="text-sm font-medium">₹{booking.priceBreakdown.driverAmount?.toLocaleString()}</span>
                      </div>
                    )}
                    {booking.priceBreakdown.taxes > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Taxes</span>
                        <span className="text-sm font-medium">₹{booking.priceBreakdown.taxes?.toLocaleString()}</span>
                      </div>
                    )}
                    {booking.priceBreakdown.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span className="text-sm">Discount</span>
                        <span className="text-sm font-medium">-₹{booking.priceBreakdown.discount?.toLocaleString()}</span>
                      </div>
                    )}
                    {booking.priceBreakdown.deposit > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Deposit</span>
                        <span className="text-sm font-medium">₹{booking.priceBreakdown.deposit?.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between">
                      <span className="text-sm font-medium text-gray-900">Total Payable</span>
                      <span className="text-sm font-bold text-green-600">
                        ₹{booking.priceBreakdown.totalPayable?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Information */}
            {booking.payment && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                    <span className={`mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      booking.payment.status === 'success' ? 'bg-green-100 text-green-800' :
                      booking.payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.payment.status.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                    <p className="mt-1 text-sm text-gray-900">{booking.payment.paymentMethod || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <p className="mt-1 text-sm text-gray-900">₹{booking.payment.amount?.toLocaleString()}</p>
                  </div>
                  {booking.payment.paidAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Paid At</label>
                      <p className="mt-1 text-sm text-gray-900">{formatDate(booking.payment.paidAt)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cancellation Information */}
            {booking.cancellation && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancellation Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cancelled By</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{booking.cancellation.cancelledBy}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cancelled At</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(booking.cancellation.cancelledAt)}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Reason</label>
                    <p className="mt-1 text-sm text-gray-900">{booking.cancellation.reason}</p>
                  </div>
                  {booking.cancellation.cancellationFee > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Cancellation Fee</label>
                      <p className="mt-1 text-sm text-gray-900">₹{booking.cancellation.cancellationFee?.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Booking Type</label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{booking.bookingType?.replace('-', ' ')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created At</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(booking.createdAt)}</p>
                </div>
                {booking.driver && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Driver</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {booking.driver.name} - {booking.driver.phone}
                    </p>
                  </div>
                )}
                {booking.notes && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <p className="mt-1 text-sm text-gray-900">{booking.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [detailModal, setDetailModal] = useState({ isOpen: false, booking: null });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        dateFrom: dateFilter || undefined
      };
      const response = await getAllBookings(params);
      setBookings(response.data.data.bookings || []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      alert('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, { status });
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error('Failed to update booking status:', error);
      alert('Failed to update booking status');
    }
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBookingAdmin(bookingId, { reason: 'Cancelled by admin' });
        fetchBookings(); // Refresh the list
      } catch (error) {
        console.error('Failed to cancel booking:', error);
        alert('Failed to cancel booking');
      }
    }
  };

  const handleViewBooking = async (bookingId) => {
    try {
      const response = await getBookingDetails(bookingId);
      setDetailModal({ isOpen: true, booking: response.data.data.booking });
    } catch (error) {
      console.error('Failed to fetch booking details:', error);
      alert('Failed to fetch booking details');
    }
  };

  const activeBookings = bookings.filter(b => 
    ['confirmed', 'checked_out', 'in_progress'].includes(b.status)
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
              <p className="text-gray-600 mt-2">Manage and monitor all bookings</p>
            </div>
            {activeBookings > 0 && (
              <div className="bg-blue-100 border border-blue-200 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2 text-blue-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">{activeBookings} active bookings</span>
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
                placeholder="Search bookings..."
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
              <option value="pending_payment">Pending Payment</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked_out">Checked Out</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={fetchBookings}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>

        {/* Bookings Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onView={handleViewBooking}
                onStatusChange={handleStatusChange}
                onCancel={handleCancel}
              />
            ))}
          </div>
        )}

        {!loading && bookings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Booking Detail Modal */}
        <BookingDetailModal
          booking={detailModal.booking}
          isOpen={detailModal.isOpen}
          onClose={() => setDetailModal({ isOpen: false, booking: null })}
        />
      </div>
    </div>
  );
}