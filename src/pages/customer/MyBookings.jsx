// src/pages/customer/MyBookings.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Car, Clock, CheckCircle, XCircle, AlertCircle, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchBookings();
  }, [filter, pagination.page]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/bookings?page=${pagination.page}&limit=${pagination.limit}&status=${filter === 'all' ? '' : filter}`);
      const { bookings: fetchedBookings, pagination: paginationData } = response.data.data;
      
      setBookings(fetchedBookings);
      setPagination(prev => ({
        ...prev,
        total: paginationData.total || 0,
        pages: paginationData.pages || 0,
      }));
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
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
      checked_out: Car,
      in_progress: Car,
      completed: CheckCircle,
      cancelled: XCircle,
      no_show: XCircle,
      refunded: AlertCircle,
    };
    return icons[status] || Clock;
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Calculate display range safely
  const getDisplayRange = () => {
    const start = ((pagination.page - 1) * pagination.limit) + 1;
    const end = Math.min(pagination.page * pagination.limit, pagination.total);
    return { start, end };
  };

  // Generate page numbers for pagination with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const currentPage = pagination.page;
    const totalPages = pagination.pages;
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're at the beginning
      if (currentPage <= 3) {
        endPage = 4;
      }
      // Adjust if we're at the end
      else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push('...');
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const statusCounts = {
    all: pagination.total,
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const { start, end } = getDisplayRange();

  if (loading && bookings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600 mt-2">Manage and view your vehicle bookings</p>
      </div>

      {/* Status Filters */}
      <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
        {statusFilters.map((status) => (
          <button
            key={status.key}
            onClick={() => handleFilterChange(status.key)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              filter === status.key
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{status.label}</span>
            {status.count > 0 && (
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  filter === status.key
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-300 text-gray-700'
                }`}
              >
                {status.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Results Info */}
      {!loading && bookings.length > 0 && (
        <div className="mb-4 text-sm text-gray-600">
          Showing {start} - {end} of {pagination.total} bookings
        </div>
      )}

      {/* Bookings List */}
      <div className="space-y-6">
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all' 
                ? "You haven't made any bookings yet."
                : `No ${filter.replace('_', ' ')} bookings found.`
              }
            </p>
            {filter === 'all' && (
              <Link to="/search" className="btn-primary">
                Book a Vehicle
              </Link>
            )}
          </div>
        ) : (
          <>
            {bookings.map((booking) => {
              const StatusIcon = getStatusIcon(booking.status);
              
              return (
                <div key={booking._id} className="bg-white rounded-lg shadow border border-gray-200 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {booking.vehicle?.title}
                          </h3>
                          <p className="text-gray-600">
                            {booking.vehicle?.make} • {booking.vehicle?.model} • {booking.vehicle?.vehicleType}
                          </p>
                        </div>
                        <span
                          className={`flex items-center space-x-1 px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          <StatusIcon className="h-4 w-4" />
                          <span>{booking.status.replace('_', ' ')}</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Pickup</p>
                            <p className="text-sm text-gray-600">
                              {formatDate(booking.pickup.datetime)} 
                              {booking.pickup.locationName && ` • ${booking.pickup.locationName}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Dropoff</p>
                            <p className="text-sm text-gray-600">
                              {formatDate(booking.dropoff.datetime)}
                              {booking.dropoff.locationName && ` • ${booking.dropoff.locationName}`}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Booking ID: <span className="font-mono">{booking.bookingRef}</span>
                        </div>
                        <div className="text-lg font-semibold text-primary-600">
                          ₹{booking.priceBreakdown?.totalPayable || 0}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 lg:mt-0 lg:ml-6 flex space-x-3">
                      <Link
                        to={`/bookings-details/${booking._id}`}
                        className="btn-secondary text-sm flex items-center space-x-2"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </Link>
                      {booking.status === 'pending_payment' && (
                        <Link
                          to={`/payment?bookingId=${booking._id}`}
                          className="btn-primary text-sm"
                        >
                          Pay Now
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Page {pagination.page} of {pagination.pages}
                </div>
                
                <div className="flex items-center space-x-1">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {/* Page Numbers */}
                  {getPageNumbers().map((pageNum, index) => (
                    <button
                      key={index}
                      onClick={() => typeof pageNum === 'number' && handlePageChange(pageNum)}
                      disabled={pageNum === '...'}
                      className={`min-w-[40px] px-3 py-2 rounded-lg font-medium transition-colors ${
                        pageNum === pagination.page
                          ? 'bg-primary-600 text-white border-primary-600'
                          : pageNum === '...'
                          ? 'text-gray-500 cursor-default'
                          : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-sm text-gray-500">
                  {pagination.total} total bookings
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyBookings;