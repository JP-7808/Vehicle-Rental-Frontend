// src/pages/vendor/VendorBookingDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, User, Phone, Car, IndianRupee, Clock, CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';

const VendorBookingDetails = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      const response = await api.get(`/bookings/${id}`);
      setBooking(response.data.data.booking);
    } catch (error) {
      console.error('Error fetching booking:', error);
      setAlert({
        show: true,
        type: 'error',
        message: 'Failed to load booking details',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount || 0);
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

  if (loading) return <LoadingSpinner />;

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Booking Not Found</h2>
          <Link to="/vendor/bookings" className="text-primary-600 hover:underline mt-4 inline-block">
            ← Back to Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {alert.show && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ show: false })} />
      )}

      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/vendor/bookings" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
              <p className="text-gray-600">Reference: <span className="font-mono font-bold">{booking.bookingRef}</span></p>
            </div>
          </div>
          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
            {booking.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Customer & Vehicle */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" /> Customer Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Name</span>
                <span className="font-medium">{booking.customer?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone</span>
                <span className="font-medium flex items-center">
                  <Phone className="h-4 w-4 mr-1" /> {booking.customer?.phone}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email</span>
                <span className="font-medium">{booking.customer?.email}</span>
              </div>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Car className="h-5 w-5 mr-2" /> Vehicle Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Vehicle</p>
                <p className="font-semibold">{booking.vehicle?.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium capitalize">{booking.vehicle?.vehicleType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Make/Model</p>
                <p className="font-medium">{booking.vehicle?.make} {booking.vehicle?.model}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Registration</p>
                <p className="font-medium">{booking.vehicle?.registrationNumber}</p>
              </div>
            </div>
          </div>

          {/* Trip Details */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" /> Trip Schedule
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <p className="font-medium">Pickup</p>
                  <p className="text-gray-600">{booking.pickup.locationName || 'N/A'}, {booking.pickup.city}</p>
                  <p className="text-sm text-gray-500">{formatDate(booking.pickup.datetime)}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-red-600 mt-1" />
                <div>
                  <p className="font-medium">Dropoff</p>
                  <p className="text-gray-600">{booking.dropoff.locationName || 'N/A'}, {booking.dropoff.city}</p>
                  <p className="text-sm text-gray-500">{formatDate(booking.dropoff.datetime)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Pricing & Actions */}
        <div className="space-y-6">
          {/* Price Breakdown */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <IndianRupee className="h-5 w-5 mr-2" /> Payment Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Base Amount</span>
                <span>{formatCurrency(booking.priceBreakdown?.baseAmount)}</span>
              </div>
              {booking.priceBreakdown?.driverAmount > 0 && (
                <div className="flex justify-between">
                  <span>Driver Charges</span>
                  <span>{formatCurrency(booking.priceBreakdown?.driverAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Taxes & Fees</span>
                <span>{formatCurrency(booking.priceBreakdown?.taxes)}</span>
              </div>
              {booking.priceBreakdown?.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(booking.priceBreakdown?.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-3 border-t">
                <span>Total Paid</span>
                <span>{formatCurrency(booking.priceBreakdown?.totalPayable)}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full btn-primary flex items-center justify-center">
                <Phone className="h-4 w-4 mr-2" />
                Call Customer
              </button>
              <button className="w-full btn-secondary">
                Send WhatsApp Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorBookingDetails;