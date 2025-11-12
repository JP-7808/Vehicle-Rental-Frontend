// src/pages/customer/Booking.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Car, 
  MapPin, 
  Calendar, 
  User, 
  Shield,
  CreditCard
} from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    vehicleId: '',
    pickup: { city: '', locationName: '', datetime: '' },
    dropoff: { city: '', locationName: '', datetime: '' },
    bookingType: 'self-drive',
    driverId: null,
    promoCode: '',
  });

  const { vehicle, bookingDates, priceBreakdown } = location.state || {};

  useEffect(() => {
    if (!vehicle || !bookingDates) {
      navigate('/search');
      return;
    }

    setBookingData(prev => ({
      ...prev,
      vehicleId: vehicle._id,
      pickup: {
        city: vehicle.locations?.[0]?.city,
        locationName: vehicle.locations?.[0]?.locationName,
        datetime: `${bookingDates.startDate}T10:00:00`,
      },
      dropoff: {
        city: vehicle.locations?.[0]?.city,
        locationName: vehicle.locations?.[0]?.locationName,
        datetime: `${bookingDates.endDate}T18:00:00`,
      },
    }));
  }, [vehicle, bookingDates, navigate]);

  const handleInputChange = (section, field, value) => {
    setBookingData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // In your Booking.jsx, update the handleSubmit function:
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/bookings', bookingData);
      
      if (response.data.success) {
        const booking = response.data.data.booking;
        navigate('/payment', { 
          state: { 
            bookingId: booking._id,
            amount: booking.priceBreakdown.totalPayable,
            vehicle: vehicle,
            booking: booking
          } 
        });
      }
    } catch (error) {
      console.error('Booking creation error:', error);
      setError(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  if (!vehicle || !bookingDates) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Back</span>
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900">Complete Your Booking</h1>
        <p className="text-gray-600 mt-2">Review your booking details and proceed to payment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= stepNumber
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div
                      className={`w-16 h-1 mx-2 ${
                        step > stepNumber ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between mb-6">
              <span className={`text-sm font-medium ${
                step === 1 ? 'text-primary-600' : 'text-gray-600'
              }`}>
                Booking Details
              </span>
              <span className={`text-sm font-medium ${
                step === 2 ? 'text-primary-600' : 'text-gray-600'
              }`}>
                Review & Confirm
              </span>
              <span className={`text-sm font-medium ${
                step === 3 ? 'text-primary-600' : 'text-gray-600'
              }`}>
                Payment
              </span>
            </div>

            {error && (
              <Alert type="error" message={error} className="mb-6" />
            )}

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Booking Details
                  </h2>

                  {/* Pickup Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Pickup Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value={bookingData.pickup.city}
                          onChange={(e) => handleInputChange('pickup', 'city', e.target.value)}
                          className="input-field"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location Name
                        </label>
                        <input
                          type="text"
                          value={bookingData.pickup.locationName}
                          onChange={(e) => handleInputChange('pickup', 'locationName', e.target.value)}
                          className="input-field"
                          placeholder="e.g., Airport, Downtown"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          value={bookingData.pickup.datetime}
                          onChange={(e) => handleInputChange('pickup', 'datetime', e.target.value)}
                          className="input-field"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dropoff Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Dropoff Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value={bookingData.dropoff.city}
                          onChange={(e) => handleInputChange('dropoff', 'city', e.target.value)}
                          className="input-field"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location Name
                        </label>
                        <input
                          type="text"
                          value={bookingData.dropoff.locationName}
                          onChange={(e) => handleInputChange('dropoff', 'locationName', e.target.value)}
                          className="input-field"
                          placeholder="e.g., Airport, Downtown"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          value={bookingData.dropoff.datetime}
                          onChange={(e) => handleInputChange('dropoff', 'datetime', e.target.value)}
                          className="input-field"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Booking Type */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Booking Type
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setBookingData(prev => ({ ...prev, bookingType: 'self-drive' }))}
                        className={`p-4 border-2 rounded-lg text-left ${
                          bookingData.bookingType === 'self-drive'
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-300'
                        }`}
                      >
                        <User className="h-6 w-6 mb-2 text-primary-600" />
                        <h4 className="font-semibold">Self Drive</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Drive the vehicle yourself
                        </p>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setBookingData(prev => ({ ...prev, bookingType: 'with-driver' }))}
                        className={`p-4 border-2 rounded-lg text-left ${
                          bookingData.bookingType === 'with-driver'
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-300'
                        }`}
                      >
                        <User className="h-6 w-6 mb-2 text-primary-600" />
                        <h4 className="font-semibold">With Driver</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Professional driver included
                        </p>
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="btn-primary"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Review & Confirm
                  </h2>

                  {/* Vehicle Summary */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Vehicle Details
                    </h3>
                    <div className="flex items-center space-x-4">
                      <img
                        src={vehicle.images[0]}
                        alt={vehicle.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-medium">{vehicle.title}</h4>
                        <p className="text-sm text-gray-600">
                          {vehicle.make} • {vehicle.model} • {vehicle.vehicleType}
                        </p>
                        <p className="text-sm text-gray-600">
                          {vehicle.seats} seats • {vehicle.transmission} • {vehicle.fuelType}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Booking Summary */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Booking Summary
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pickup</span>
                        <span className="font-medium">
                          {new Date(bookingData.pickup.datetime).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dropoff</span>
                        <span className="font-medium">
                          {new Date(bookingData.dropoff.datetime).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration</span>
                        <span className="font-medium">
                          {priceBreakdown?.duration?.days || 0} days
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Booking Type</span>
                        <span className="font-medium capitalize">
                          {bookingData.bookingType}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  {priceBreakdown && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Price Breakdown
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Base Amount</span>
                          <span>₹{priceBreakdown.baseAmount}</span>
                        </div>
                        {priceBreakdown.taxes > 0 && (
                          <div className="flex justify-between">
                            <span>Taxes & Fees</span>
                            <span>₹{priceBreakdown.taxes}</span>
                          </div>
                        )}
                        {priceBreakdown.deposit > 0 && (
                          <div className="flex justify-between">
                            <span>Security Deposit</span>
                            <span>₹{priceBreakdown.deposit}</span>
                          </div>
                        )}
                        {priceBreakdown.discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span>-₹{priceBreakdown.discount}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-semibold border-t border-gray-200 pt-2">
                          <span>Total Payable</span>
                          <span>₹{priceBreakdown.totalPayable}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="btn-secondary"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex items-center space-x-2"
                    >
                      {loading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <CreditCard className="h-5 w-5" />
                      )}
                      <span>Proceed to Payment</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Booking Summary
            </h3>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Car className="h-8 w-8 text-primary-600" />
                <div>
                  <h4 className="font-medium text-gray-900">{vehicle.title}</h4>
                  <p className="text-sm text-gray-600">{vehicle.vehicleType}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Pickup & Dropoff</p>
                  <p className="text-sm font-medium">{bookingData.pickup.city}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="text-sm font-medium">
                    {priceBreakdown?.duration?.days || 0} days
                  </p>
                </div>
              </div>

              {priceBreakdown && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="text-2xl font-bold text-primary-600">
                      ₹{priceBreakdown.totalPayable}
                    </span>
                  </div>
                  {priceBreakdown.deposit > 0 && (
                    <p className="text-xs text-gray-600 text-center">
                      Includes ₹{priceBreakdown.deposit} refundable deposit
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Secure booking with instant confirmation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;