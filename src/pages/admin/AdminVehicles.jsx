import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Plus, Edit, Trash2, Eye, 
  Car, MapPin, Users, DollarSign, Calendar,
  Fuel, Settings, Image, Building, Clock,
  CheckCircle, XCircle, Upload
} from 'lucide-react';
import { 
  getVehiclesWithFilter, 
  updateVehicleStatus, 
  deleteVehicle,
  getVehicleDetails,
  updateVehicle,
  createVehicle
} from '../../services/adminApi';

const VehicleCard = ({ vehicle, onEdit, onView, onStatusChange, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Vehicle Image */}
      <div className="h-48 bg-gray-200 relative">
        {vehicle.images && vehicle.images.length > 0 ? (
          <img
            src={vehicle.images[0]}
            alt={vehicle.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Car className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            vehicle.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {vehicle.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Vehicle Details */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{vehicle.title}</h3>
        
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>{vehicle.locations?.[0]?.city || 'No location'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>{vehicle.seats} seats • {vehicle.transmission}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Fuel className="h-4 w-4" />
            <span>{vehicle.fuelType} • {vehicle.make} {vehicle.model}</span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span className="font-semibold text-green-600">
              ₹{vehicle.pricing?.baseDaily}/day
            </span>
          </div>
        </div>

        {/* Vendor Info */}
        <div className="border-t pt-3">
          <p className="text-xs text-gray-500">
            Vendor: {vehicle.vendor?.companyName || 'System'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => onView(vehicle._id)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Details
          </button>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(vehicle)}
              className="p-1 text-gray-600 hover:text-green-600"
              title="Edit Vehicle"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onStatusChange(vehicle._id, !vehicle.isActive)}
              className={`p-1 ${
                vehicle.isActive 
                  ? 'text-red-600 hover:text-red-800' 
                  : 'text-green-600 hover:text-green-800'
              }`}
              title={vehicle.isActive ? 'Deactivate' : 'Activate'}
            >
              {vehicle.isActive ? 'Deactivate' : 'Activate'}
            </button>
            <button
              onClick={() => onDelete(vehicle._id, vehicle.title)}
              className="p-1 text-gray-600 hover:text-red-600"
              title="Delete Vehicle"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const VehicleDetailModal = ({ vehicle, isOpen, onClose }) => {
  if (!isOpen || !vehicle) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Vehicle Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Vehicle Images */}
            {vehicle.images && vehicle.images.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {vehicle.images.map((image, index) => (
                    <div key={index} className="aspect-w-16 aspect-h-9">
                      <img
                        src={image}
                        alt={`${vehicle.title} ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <p className="mt-1 text-sm text-gray-900">{vehicle.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{vehicle.vehicleType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Make & Model</label>
                  <p className="mt-1 text-sm text-gray-900">{vehicle.make} {vehicle.model}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Year</label>
                  <p className="mt-1 text-sm text-gray-900">{vehicle.year}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Registration Number</label>
                  <p className="mt-1 text-sm text-gray-900">{vehicle.registrationNumber || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    vehicle.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {vehicle.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Seats</label>
                  <p className="mt-1 text-sm text-gray-900">{vehicle.seats} seats</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Transmission</label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{vehicle.transmission}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{vehicle.fuelType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Odometer</label>
                  <p className="mt-1 text-sm text-gray-900">{vehicle.currentOdometerKm?.toLocaleString()} km</p>
                </div>
              </div>
            </div>

            {/* Pricing Information */}
            {vehicle.pricing && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Base Daily Rate</label>
                    <p className="mt-1 text-sm text-gray-900">₹{vehicle.pricing.baseDaily}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Base Hourly Rate</label>
                    <p className="mt-1 text-sm text-gray-900">₹{vehicle.pricing.baseHourly || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Weekly Discount</label>
                    <p className="mt-1 text-sm text-gray-900">{vehicle.pricing.weeklyDiscountPercent || 0}%</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Monthly Discount</label>
                    <p className="mt-1 text-sm text-gray-900">{vehicle.pricing.monthlyDiscountPercent || 0}%</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Extra Hour Charge</label>
                    <p className="mt-1 text-sm text-gray-900">₹{vehicle.pricing.extraHourCharge || 0}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Deposit Amount</label>
                    <p className="mt-1 text-sm text-gray-900">₹{vehicle.pricing.depositAmount || 0}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Policy Information */}
            {vehicle.policy && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fuel Policy</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{vehicle.policy.fuelPolicy?.replace(/-/g, ' ')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Minimum Age (Self Drive)</label>
                    <p className="mt-1 text-sm text-gray-900">{vehicle.policy.ageRequirements?.minForSelfDrive || 21} years</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Allowed KM Per Day</label>
                    <p className="mt-1 text-sm text-gray-900">{vehicle.policy.allowedKmPerDay || 200} km</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Extra KM Charge</label>
                    <p className="mt-1 text-sm text-gray-900">₹{vehicle.policy.extraKmCharge || 10}/km</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">License Required</label>
                    <p className="mt-1 text-sm text-gray-900">{vehicle.policy.licenseRequired ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Locations */}
            {vehicle.locations && vehicle.locations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Locations</h3>
                <div className="space-y-2">
                  {vehicle.locations.map((location, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{location.locationName} - {location.city}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vendor Information */}
            {vehicle.vendor && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                    <p className="mt-1 text-sm text-gray-900">{vehicle.vendor.companyName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                    <p className="mt-1 text-sm text-gray-900">{vehicle.vendor.contactEmail}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{vehicle.vendor.contactPhone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rating</label>
                    <p className="mt-1 text-sm text-gray-900">{vehicle.vendor.rating || 0}/5 ({vehicle.vendor.ratingCount || 0} reviews)</p>
                  </div>
                </div>
              </div>
            )}

            {/* Statistics */}
            {vehicle.statistics && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{vehicle.statistics.totalBookings || 0}</p>
                    <p className="text-sm text-gray-600">Total Bookings</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{vehicle.statistics.totalReviews || 0}</p>
                    <p className="text-sm text-gray-600">Total Reviews</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">₹{vehicle.statistics.totalEarnings?.toLocaleString() || 0}</p>
                    <p className="text-sm text-gray-600">Total Earnings</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const VehicleModal = ({ vehicle, isOpen, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    vehicleType: 'car',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    registrationNumber: '',
    seats: 5,
    transmission: 'manual',
    fuelType: 'petrol',
    currentOdometerKm: 0,
    pricing: {
      baseDaily: 0,
      baseHourly: 0,
      weeklyDiscountPercent: 0,
      monthlyDiscountPercent: 0,
      extraHourCharge: 0,
      depositAmount: 0
    },
    policy: {
      fuelPolicy: 'full-to-full',
      ageRequirements: {
        minForSelfDrive: 21,
        minForTwoWheeler: 18
      },
      licenseRequired: true,
      allowedKmPerDay: 200,
      extraKmCharge: 10,
      locationRestrictions: {
        allowedStates: [],
        allowedCities: []
      },
      termsAndConditions: ''
    },
    locations: [],
    isActive: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (vehicle) {
      setFormData({
        title: vehicle.title || '',
        description: vehicle.description || '',
        vehicleType: vehicle.vehicleType || 'car',
        make: vehicle.make || '',
        model: vehicle.model || '',
        year: vehicle.year || new Date().getFullYear(),
        registrationNumber: vehicle.registrationNumber || '',
        seats: vehicle.seats || 5,
        transmission: vehicle.transmission || 'manual',
        fuelType: vehicle.fuelType || 'petrol',
        currentOdometerKm: vehicle.currentOdometerKm || 0,
        pricing: vehicle.pricing || {
          baseDaily: 0,
          baseHourly: 0,
          weeklyDiscountPercent: 0,
          monthlyDiscountPercent: 0,
          extraHourCharge: 0,
          depositAmount: 0
        },
        policy: vehicle.policy || {
          fuelPolicy: 'full-to-full',
          ageRequirements: {
            minForSelfDrive: 21,
            minForTwoWheeler: 18
          },
          licenseRequired: true,
          allowedKmPerDay: 200,
          extraKmCharge: 10,
          locationRestrictions: {
            allowedStates: [],
            allowedCities: []
          },
          termsAndConditions: ''
        },
        locations: vehicle.locations || [],
        isActive: vehicle.isActive !== false
      });
    } else {
      setFormData({
        title: '',
        description: '',
        vehicleType: 'car',
        make: '',
        model: '',
        year: new Date().getFullYear(),
        registrationNumber: '',
        seats: 5,
        transmission: 'manual',
        fuelType: 'petrol',
        currentOdometerKm: 0,
        pricing: {
          baseDaily: 0,
          baseHourly: 0,
          weeklyDiscountPercent: 0,
          monthlyDiscountPercent: 0,
          extraHourCharge: 0,
          depositAmount: 0
        },
        policy: {
          fuelPolicy: 'full-to-full',
          ageRequirements: {
            minForSelfDrive: 21,
            minForTwoWheeler: 18
          },
          licenseRequired: true,
          allowedKmPerDay: 200,
          extraKmCharge: 10,
          locationRestrictions: {
            allowedStates: [],
            allowedCities: []
          },
          termsAndConditions: ''
        },
        locations: [],
        isActive: true
      });
    }
    setErrors({});
  }, [vehicle, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.vehicleType) newErrors.vehicleType = 'Vehicle type is required';
    if (!formData.pricing.baseDaily || formData.pricing.baseDaily <= 0) {
      newErrors.baseDaily = 'Base daily price is required and must be greater than 0';
    }
    if (!formData.make.trim()) newErrors.make = 'Make is required';
    if (!formData.model.trim()) newErrors.model = 'Model is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData, vehicle?._id);
    }
  };

  const handlePricingChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [field]: value
      }
    }));
  };

  const handlePolicyChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      policy: {
        ...prev.policy,
        [field]: value
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {vehicle ? 'Edit Vehicle' : 'Create Vehicle'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vehicle Type *</label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="car">Car</option>
                    <option value="bike">Bike</option>
                    <option value="bicycle">Bicycle</option>
                    <option value="bus">Bus</option>
                    <option value="truck">Truck</option>
                  </select>
                  {errors.vehicleType && <p className="text-red-500 text-xs mt-1">{errors.vehicleType}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Make *</label>
                  <input
                    type="text"
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.make && <p className="text-red-500 text-xs mt-1">{errors.make}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Model *</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Year</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Registration Number</label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Seats</label>
                  <input
                    type="number"
                    value={formData.seats}
                    onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Transmission</label>
                  <select
                    value={formData.transmission}
                    onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="manual">Manual</option>
                    <option value="automatic">Automatic</option>
                    <option value="n/a">N/A</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
                  <select
                    value={formData.fuelType}
                    onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Odometer (km)</label>
                  <input
                    type="number"
                    value={formData.currentOdometerKm}
                    onChange={(e) => setFormData({ ...formData, currentOdometerKm: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Active Vehicle</label>
                </div>
              </div>
            </div>

            {/* Pricing Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Base Daily Rate *</label>
                  <input
                    type="number"
                    value={formData.pricing.baseDaily}
                    onChange={(e) => handlePricingChange('baseDaily', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.baseDaily && <p className="text-red-500 text-xs mt-1">{errors.baseDaily}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Base Hourly Rate</label>
                  <input
                    type="number"
                    value={formData.pricing.baseHourly}
                    onChange={(e) => handlePricingChange('baseHourly', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Weekly Discount (%)</label>
                  <input
                    type="number"
                    value={formData.pricing.weeklyDiscountPercent}
                    onChange={(e) => handlePricingChange('weeklyDiscountPercent', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Monthly Discount (%)</label>
                  <input
                    type="number"
                    value={formData.pricing.monthlyDiscountPercent}
                    onChange={(e) => handlePricingChange('monthlyDiscountPercent', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Extra Hour Charge</label>
                  <input
                    type="number"
                    value={formData.pricing.extraHourCharge}
                    onChange={(e) => handlePricingChange('extraHourCharge', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Deposit Amount</label>
                  <input
                    type="number"
                    value={formData.pricing.depositAmount}
                    onChange={(e) => handlePricingChange('depositAmount', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Policy Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Policy Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fuel Policy</label>
                  <select
                    value={formData.policy.fuelPolicy}
                    onChange={(e) => handlePolicyChange('fuelPolicy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="full-to-full">Full to Full</option>
                    <option value="pay-per-km">Pay per KM</option>
                    <option value="prepaid">Prepaid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Minimum Age (Self Drive)</label>
                  <input
                    type="number"
                    value={formData.policy.ageRequirements.minForSelfDrive}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      policy: {
                        ...prev.policy,
                        ageRequirements: {
                          ...prev.policy.ageRequirements,
                          minForSelfDrive: parseInt(e.target.value)
                        }
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Allowed KM Per Day</label>
                  <input
                    type="number"
                    value={formData.policy.allowedKmPerDay}
                    onChange={(e) => handlePolicyChange('allowedKmPerDay', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Extra KM Charge</label>
                  <input
                    type="number"
                    value={formData.policy.extraKmCharge}
                    onChange={(e) => handlePolicyChange('extraKmCharge', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.policy.licenseRequired}
                    onChange={(e) => handlePolicyChange('licenseRequired', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">License Required</label>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter vehicle description..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>{vehicle ? 'Updating...' : 'Creating...'}</span>
                  </>
                ) : (
                  <span>{vehicle ? 'Update Vehicle' : 'Create Vehicle'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    vehicleType: '',
    city: '',
    status: 'all'
  });
  const [detailModal, setDetailModal] = useState({ isOpen: false, vehicle: null });
  const [editModal, setEditModal] = useState({ isOpen: false, vehicle: null });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const params = {
        search: filters.search || undefined,
        vehicleType: filters.vehicleType || undefined,
        city: filters.city || undefined,
        status: filters.status !== 'all' ? filters.status : undefined
      };
      const response = await getVehiclesWithFilter(params);
      setVehicles(response.data.data.vehicles || []);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
      alert('Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (vehicleId, isActive) => {
    try {
      await updateVehicleStatus(vehicleId, { isActive });
      fetchVehicles(); // Refresh the list
    } catch (error) {
      console.error('Failed to update vehicle status:', error);
      alert('Failed to update vehicle status');
    }
  };

  const handleDelete = async (vehicleId, vehicleTitle) => {
    if (window.confirm(`Are you sure you want to delete vehicle "${vehicleTitle}"?`)) {
      try {
        await deleteVehicle(vehicleId, { hardDelete: false });
        fetchVehicles(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete vehicle:', error);
        alert('Failed to delete vehicle');
      }
    }
  };

  const handleViewVehicle = async (vehicleId) => {
    try {
      const response = await getVehicleDetails(vehicleId);
      setDetailModal({ isOpen: true, vehicle: response.data.data.vehicle });
    } catch (error) {
      console.error('Failed to fetch vehicle details:', error);
      alert('Failed to fetch vehicle details');
    }
  };

  const handleSaveVehicle = async (vehicleData, vehicleId) => {
    try {
      setModalLoading(true);
      if (vehicleId) {
        // Update existing vehicle
        await updateVehicle(vehicleId, vehicleData);
      } else {
        // Create new vehicle
        await createVehicle(vehicleData);
      }
      setEditModal({ isOpen: false, vehicle: null });
      fetchVehicles(); // Refresh the list
    } catch (error) {
      console.error('Failed to save vehicle:', error);
      alert(error.response?.data?.message || 'Failed to save vehicle');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Vehicle Management</h1>
              <p className="text-gray-600 mt-2">Manage all vehicles in the system</p>
            </div>
            <button
              onClick={() => setEditModal({ isOpen: true, vehicle: null })}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Vehicle</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filters.vehicleType}
              onChange={(e) => setFilters({ ...filters, vehicleType: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="car">Car</option>
              <option value="bike">Bike</option>
              <option value="bicycle">Bicycle</option>
              <option value="bus">Bus</option>
              <option value="truck">Truck</option>
            </select>
            <input
              type="text"
              placeholder="City"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              onClick={fetchVehicles}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Apply</span>
            </button>
          </div>
        </div>

        {/* Vehicles Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle._id}
                vehicle={vehicle}
                onEdit={(vehicle) => setEditModal({ isOpen: true, vehicle })}
                onView={handleViewVehicle}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {!loading && vehicles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Car className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Vehicle Detail Modal */}
        <VehicleDetailModal
          vehicle={detailModal.vehicle}
          isOpen={detailModal.isOpen}
          onClose={() => setDetailModal({ isOpen: false, vehicle: null })}
        />

        {/* Vehicle Edit/Create Modal */}
        <VehicleModal
          vehicle={editModal.vehicle}
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, vehicle: null })}
          onSave={handleSaveVehicle}
          loading={modalLoading}
        />
      </div>
    </div>
  );
}