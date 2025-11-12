import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Car, 
  User, 
  CreditCard, 
  CheckCircle, 
  XCircle,
  Clock,
  AlertCircle,
  Download,
  Shield
} from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      const response = await api.get(`/bookings/${id}`);
      setBooking(response.data.data.booking);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending_payment: {
        color: 'text-yellow-600 bg-yellow-100',
        icon: Clock,
        label: 'Pending Payment'
      },
      confirmed: {
        color: 'text-blue-600 bg-blue-100',
        icon: CheckCircle,
        label: 'Confirmed'
      },
      checked_out: {
        color: 'text-purple-600 bg-purple-100',
        icon: Car,
        label: 'Checked Out'
      },
      in_progress: {
        color: 'text-green-600 bg-green-100',
        icon: Car,
        label: 'In Progress'
      },
      completed: {
        color: 'text-gray-600 bg-gray-100',
        icon: CheckCircle,
        label: 'Completed'
      },
      cancelled: {
        color: 'text-red-600 bg-red-100',
        icon: XCircle,
        label: 'Cancelled'
      },
      no_show: {
        color: 'text-red-600 bg-red-100',
        icon: XCircle,
        label: 'No Show'
      },
      refunded: {
        color: 'text-gray-600 bg-gray-100',
        icon: AlertCircle,
        label: 'Refunded'
      }
    };
    return configs[status] || configs.pending_payment;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownloadInvoice = async () => {
    try {
      const response = await api.get(`/bookings/${id}/invoice`);
      // In a real app, you would handle the PDF download
      console.log('Invoice data:', response.data);
      alert('Invoice download functionality would be implemented here');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      setError('Failed to download invoice');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Booking not found'}
          </h2>
          <button
            onClick={() => navigate('/my-bookings')}
            className="btn-primary"
          >
            Back to My Bookings
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(booking.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/my-bookings')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to My Bookings</span>
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
            <p className="text-gray-600 mt-2">
              Booking ID: <span className="font-mono">{booking.bookingRef}</span>
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${statusConfig.color}`}>
              <StatusIcon className="h-4 w-4" />
              <span>{statusConfig.label}</span>
            </span>
            <button
              onClick={handleDownloadInvoice}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Invoice</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <Alert type="error" message={error} className="mb-6" />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vehicle Details */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Vehicle Information
            </h2>
            <div className="flex items-start space-x-4">
              <img
                src={booking.vehicle?.images?.[0]}
                alt={booking.vehicle?.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {booking.vehicle?.title}
                </h3>
                <p className="text-gray-600">
                  {booking.vehicle?.make} • {booking.vehicle?.model} • {booking.vehicle?.vehicleType}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Seats:</span>{' '}
                    <span className="font-medium">{booking.vehicle?.seats}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Transmission:</span>{' '}
                    <span className="font-medium capitalize">{booking.vehicle?.transmission}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Fuel Type:</span>{' '}
                    <span className="font-medium capitalize">{booking.vehicle?.fuelType}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Year:</span>{' '}
                    <span className="font-medium">{booking.vehicle?.year}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trip Details */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Trip Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <MapPin className="h-6 w-6 text-primary-600 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Pickup</h3>
                  <p className="text-gray-600 mt-1">
                    {formatDate(booking.pickup.datetime)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {booking.pickup.locationName && `${booking.pickup.locationName}, `}
                    {booking.pickup.city}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-6 w-6 text-primary-600 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Dropoff</h3>
                  <p className="text-gray-600 mt-1">
                    {formatDate(booking.dropoff.datetime)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {booking.dropoff.locationName && `${booking.dropoff.locationName}, `}
                    {booking.dropoff.city}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">
                Duration: {booking.duration?.days} days ({booking.duration?.hours} hours)
              </span>
            </div>
            <div className="mt-2 flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600 capitalize">
                Booking Type: {booking.bookingType?.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Payment Information */}
          {booking.payment && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Payment Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className={`font-medium ${
                    booking.payment.status === 'success' ? 'text-green-600' : 
                    booking.payment.status === 'failed' ? 'text-red-600' : 
                    'text-yellow-600'
                  }`}>
                    {booking.payment.status?.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium capitalize">
                    {booking.payment.paymentMethod || 'Razorpay'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Paid Amount:</span>
                  <span className="font-medium">₹{booking.payment.amount}</span>
                </div>
                {booking.payment.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paid At:</span>
                    <span className="font-medium">
                      {formatDate(booking.payment.paidAt)}
                    </span>
                  </div>
                )}
                {booking.payment.gatewayPaymentId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium font-mono text-sm">
                      {booking.payment.gatewayPaymentId}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Breakdown */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Price Breakdown
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Amount</span>
                <span>₹{booking.priceBreakdown?.baseAmount || 0}</span>
              </div>
              {booking.priceBreakdown?.driverAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Driver Charges</span>
                  <span>₹{booking.priceBreakdown.driverAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes & Fees</span>
                <span>₹{booking.priceBreakdown?.taxes || 0}</span>
              </div>
              {booking.priceBreakdown?.deposit > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Security Deposit</span>
                  <span>₹{booking.priceBreakdown.deposit}</span>
                </div>
              )}
              {booking.priceBreakdown?.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{booking.priceBreakdown.discount}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold text-lg">
                <span>Total Amount</span>
                <span className="text-primary-600">
                  ₹{booking.priceBreakdown?.totalPayable || 0}
                </span>
              </div>
            </div>

            {booking.status === 'pending_payment' && (
              <Link
                to="/payment"
                state={{
                  bookingId: booking._id,
                  amount: booking.priceBreakdown?.totalPayable,
                  vehicle: booking.vehicle,
                  booking: booking
                }}
                className="w-full btn-primary mt-4 flex items-center justify-center space-x-2"
              >
                <CreditCard className="h-5 w-5" />
                <span>Complete Payment</span>
              </Link>
            )}
          </div>

          {/* Support */}
          <div className="card p-6 bg-blue-50 border border-blue-200">
            <div className="flex items-start space-x-3">
              <Shield className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-medium text-blue-900">Need Help?</h3>
                <p className="text-blue-700 text-sm mt-1">
                  Contact our support team for any questions about your booking.
                </p>
                <div className="mt-2 text-sm text-blue-600">
                  <p>Email: support@vehiclerental.com</p>
                  <p>Phone: +91 9876543210</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;