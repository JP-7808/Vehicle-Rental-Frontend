// src/pages/customer/VehicleDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Star, 
  Users, 
  Fuel, 
  Cog, 
  Calendar, 
  Shield,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';
import LegalPolicies from '../../components/legal/LegalPolicies';
import TermsConditions from '../../components/legal/TermsConditions';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [bookingDates, setBookingDates] = useState({
    startDate: '',
    endDate: '',
  });
  const [availability, setAvailability] = useState(null);
  const [priceBreakdown, setPriceBreakdown] = useState(null);

  useEffect(() => {
    fetchVehicleDetails();
  }, [id]);

  const fetchVehicleDetails = async () => {
    try {
      const response = await api.get(`/vehicles/${id}`);
      setVehicle(response.data.data.vehicle);
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
      setError('Vehicle not found');
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async () => {
    if (!bookingDates.startDate || !bookingDates.endDate) {
      setError('Please select both start and end dates');
      return;
    }

    try {
      const response = await api.post('/bookings/check-availability', {
        vehicleId: id,
        pickupDateTime: `${bookingDates.startDate}T10:00:00`,
        dropoffDateTime: `${bookingDates.endDate}T18:00:00`,
      });
      setAvailability(response.data.data);
    } catch (error) {
      console.error('Error checking availability:', error);
      setError('Failed to check availability');
    }
  };

  const calculatePrice = async () => {
    if (!bookingDates.startDate || !bookingDates.endDate) {
      return;
    }

    try {
      const response = await api.post('/bookings/calculate-price', {
        vehicleId: id,
        pickupDateTime: `${bookingDates.startDate}T10:00:00`,
        dropoffDateTime: `${bookingDates.endDate}T18:00:00`,
      });
      setPriceBreakdown(response.data.data);
    } catch (error) {
      console.error('Error calculating price:', error);
    }
  };

  useEffect(() => {
    if (bookingDates.startDate && bookingDates.endDate) {
      checkAvailability();
      calculatePrice();
    }
  }, [bookingDates]);

  const handleBookNow = () => {
    if (!availability?.available) {
      setError('Vehicle is not available for the selected dates');
      return;
    }

    navigate('/bookings/create', {
      state: {
        vehicle,
        bookingDates,
        priceBreakdown: priceBreakdown?.priceBreakdown,
      },
    });
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === vehicle.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? vehicle.images.length - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Vehicle Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The vehicle you are looking for does not exist.'}</p>
          <Link to="/search" className="btn-primary">
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-4">
          <li>
            <Link to="/" className="text-gray-400 hover:text-gray-500">
              Home
            </Link>
          </li>
          <li>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </li>
          <li>
            <Link to="/search" className="text-gray-400 hover:text-gray-500">
              Search
            </Link>
          </li>
          <li>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </li>
          <li>
            <span className="text-gray-900 font-medium">{vehicle.title}</span>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images and Details */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="card p-4 mb-6">
            <div className="relative aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden mb-4">
              {vehicle.images.length > 0 ? (
                <>
                  <img
                    src={vehicle.images[selectedImageIndex]}
                    alt={vehicle.title}
                    className="w-full h-96 object-cover"
                  />
                  
                  {vehicle.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-96 flex items-center justify-center text-gray-400">
                  No image available
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {vehicle.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {vehicle.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden ${
                      selectedImageIndex === index
                        ? 'border-primary-600'
                        : 'border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${vehicle.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Vehicle Details */}
          <div className="card p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {vehicle.title}
            </h1>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-400" />
                <span>{vehicle.seats} Seats</span>
              </div>
              <div className="flex items-center space-x-2">
                <Fuel className="h-5 w-5 text-gray-400" />
                <span className="capitalize">{vehicle.fuelType}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Cog className="h-5 w-5 text-gray-400" />
                <span className="capitalize">{vehicle.transmission}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span>{vehicle.locations?.[0]?.city}</span>
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-600">{vehicle.description}</p>
            </div>
          </div>

          {/* Vendor Information */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Vendor Information
            </h2>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-semibold">
                  {vehicle.vendor?.companyName?.charAt(0) || 'V'}
                </span>
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {vehicle.vendor?.companyName}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{vehicle.vendor?.rating || 'New'}</span>
                    <span className="text-gray-500">({vehicle.vendor?.ratingCount || 0} reviews)</span>
                  </div>

                  {/* Phone */}
                  {vehicle.vendor?.contactPhone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{vehicle.vendor.contactPhone}</span>
                    </div>
                  )}

                  {/* Email - will wrap to next line on small screens */}
                  {vehicle.vendor?.contactEmail && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span className="break-all">{vehicle.vendor.contactEmail}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <TermsConditions/>
          
        </div>

        {/* Right Column - Booking Widget */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Book This Vehicle
            </h2>

            {error && (
              <Alert type="error" message={error} className="mb-4" />
            )}

            {/* Price Display */}
            <div className="mb-6">
              <div className="text-3xl font-bold text-primary-600">
                ₹{vehicle.pricing.baseDaily}
                <span className="text-lg font-normal text-gray-600">/day</span>
              </div>
              {vehicle.pricing.depositAmount > 0 && (
                <div className="text-sm text-gray-600 mt-1">
                  + ₹{vehicle.pricing.depositAmount} refundable deposit
                </div>
              )}
            </div>

            {/* Date Selection */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={bookingDates.startDate}
                  onChange={(e) => setBookingDates(prev => ({
                    ...prev,
                    startDate: e.target.value,
                  }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={bookingDates.endDate}
                  onChange={(e) => setBookingDates(prev => ({
                    ...prev,
                    endDate: e.target.value,
                  }))}
                  min={bookingDates.startDate || new Date().toISOString().split('T')[0]}
                  className="input-field"
                />
              </div>
            </div>

            {/* Availability Status */}
            {availability && (
              <div className={`p-3 rounded-lg mb-4 ${
                availability.available
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center space-x-2">
                  <Calendar className={`h-4 w-4 ${
                    availability.available ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <span className={`text-sm font-medium ${
                    availability.available ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {availability.available
                      ? 'Available for selected dates'
                      : 'Not available for selected dates'
                    }
                  </span>
                </div>
              </div>
            )}

            {/* Price Breakdown */}
            {priceBreakdown && (
              <div className="border-t border-gray-200 pt-4 mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Price Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base Amount ({priceBreakdown.priceBreakdown.duration.days} days)</span>
                    <span>₹{priceBreakdown.priceBreakdown.baseAmount}</span>
                  </div>
                  {priceBreakdown.priceBreakdown.taxes > 0 && (
                    <div className="flex justify-between">
                      <span>Taxes & Fees</span>
                      <span>₹{priceBreakdown.priceBreakdown.taxes}</span>
                    </div>
                  )}
                  {priceBreakdown.priceBreakdown.deposit > 0 && (
                    <div className="flex justify-between">
                      <span>Security Deposit</span>
                      <span>₹{priceBreakdown.priceBreakdown.deposit}</span>
                    </div>
                  )}
                  {priceBreakdown.priceBreakdown.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{priceBreakdown.priceBreakdown.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold border-t border-gray-200 pt-2">
                    <span>Total Payable</span>
                    <span>₹{priceBreakdown.priceBreakdown.totalPayable}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Book Now Button */}
            <button
              onClick={handleBookNow}
              disabled={!availability?.available || !bookingDates.startDate || !bookingDates.endDate}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Book Now
            </button>

            {/* Trust Indicators */}
            <div className="mt-6 space-y-3 text-xs text-gray-600">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Secure payment with Razorpay</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span>Free cancellation within 24 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;