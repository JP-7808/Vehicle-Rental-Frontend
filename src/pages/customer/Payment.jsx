import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  const { bookingId, amount, vehicle, booking } = location.state || {};

  useEffect(() => {
    if (!bookingId || !amount) {
      navigate('/bookings');
      return;
    }
    initializePayment();
  }, [bookingId, amount, navigate]);

  const initializePayment = async () => {
    setLoading(true);
    try {
      const response = await api.post('/payments/create-order', {
        bookingId,
        amount
      });

      if (response.data.success) {
        setPaymentData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      setError(error.response?.data?.message || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentData) return;

    setProcessing(true);
    setError('');

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_wEHfns4O1eHdMO', 
      amount: paymentData.order.amount,
      currency: paymentData.order.currency,
      name: 'Vehicle Rental',
      description: `Booking for ${vehicle?.title}`,
      order_id: paymentData.order.id,
      handler: async function (response) {
        try {
          const verifyResponse = await api.post('/payments/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            paymentId: paymentData.payment.id
          });

          if (verifyResponse.data.success) {
            setSuccess(true);
            // Redirect to bookings page after 3 seconds
            setTimeout(() => {
              navigate('/my-bookings');
            }, 3000);
          } else {
            setError('Payment verification failed');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          setError('Payment verification failed');
        } finally {
          setProcessing(false);
        }
      },
      prefill: {
        name: 'Customer Name', // You can get this from user context
        email: 'customer@example.com', // You can get this from user context
        contact: '9999999999' // You can get this from user context
      },
      theme: {
        color: '#4f46e5'
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();

    razorpay.on('payment.failed', function (response) {
      setError(`Payment failed: ${response.error.description}`);
      setProcessing(false);
    });
  };

  if (!bookingId || !amount) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Payment</h2>
          <p className="text-gray-600 mb-4">Booking information is missing.</p>
          <button
            onClick={() => navigate('/bookings')}
            className="btn-primary"
          >
            Go to Bookings
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Your booking has been confirmed.</p>
          <p className="text-sm text-gray-500">Redirecting to bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900">Complete Payment</h1>
        <p className="text-gray-600 mt-2">Secure payment for your booking</p>
      </div>

      <div className="card p-6">
        {error && (
          <Alert type="error" message={error} className="mb-6" />
        )}

        {/* Booking Summary */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Booking Summary
          </h2>
          {vehicle && (
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={vehicle.images?.[0]}
                alt={vehicle.title}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h3 className="font-medium">{vehicle.title}</h3>
                <p className="text-sm text-gray-600">
                  {vehicle.make} • {vehicle.model}
                </p>
              </div>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Amount</span>
            <span className="text-2xl font-bold text-primary-600">
              ₹{amount}
            </span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Payment Method
          </h2>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-medium">Razorpay</h3>
                  <p className="text-sm text-gray-600">
                    Secure payment gateway
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Cards, UPI, Netbanking</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Secure Payment</h4>
              <p className="text-sm text-blue-700 mt-1">
                Your payment information is encrypted and secure. We do not store your card details.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={!paymentData || processing}
          className="w-full btn-primary flex items-center justify-center space-x-2"
        >
          {processing ? (
            <LoadingSpinner size="sm" />
          ) : (
            <Shield className="h-5 w-5" />
          )}
          <span>
            {processing ? 'Processing...' : `Pay ₹${amount}`}
          </span>
        </button>

        {/* Cancel Button */}
        <button
          onClick={() => navigate('/bookings')}
          className="w-full btn-secondary mt-3"
        >
          Cancel Payment
        </button>
      </div>
    </div>
  );
};

export default Payment;