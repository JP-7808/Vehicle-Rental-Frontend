import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import api from '../../services/api';
import Alert from '../../components/ui/Alert';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const EditVehicle = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    vehicleType: 'car',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    registrationNumber: '',
    seats: 4,
    transmission: 'manual',
    fuelType: 'petrol',
    currentOdometerKm: 0,
    pricing: {
      baseDaily: 0,
      baseHourly: 0,
      weeklyDiscountPercent: 0,
      monthlyDiscountPercent: 0,
      extraHourCharge: 0,
      depositAmount: 0,
    },
    policy: {
      fuelPolicy: 'full-to-full',
      ageRequirements: {
        minForSelfDrive: 21,
        minForTwoWheeler: 18,
      },
      licenseRequired: true,
      allowedKmPerDay: 200,
      extraKmCharge: 10,
      locationRestrictions: {
        allowedStates: [],
        allowedCities: [],
      },
      termsAndConditions: '',
    },
    locations: [
      {
        city: '',
        locationName: '',
        coordinates: [0, 0],
      },
    ],
    images: []
  });

  const vehicleTypes = [
    { value: 'car', label: 'Car' },
    { value: 'bike', label: 'Bike' },
    { value: 'bicycle', label: 'Bicycle' },
    { value: 'bus', label: 'Bus' },
    { value: 'truck', label: 'Truck' },
  ];

  const transmissions = [
    { value: 'manual', label: 'Manual' },
    { value: 'automatic', label: 'Automatic' },
  ];

  const fuelTypes = [
    { value: 'petrol', label: 'Petrol' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'electric', label: 'Electric' },
    { value: 'other', label: 'Other' },
  ];

  const fuelPolicies = [
    { value: 'full-to-full', label: 'Full to Full' },
    { value: 'pay-per-km', label: 'Pay per KM' },
    { value: 'prepaid', label: 'Prepaid' },
  ];

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  const fetchVehicle = async () => {
    try {
      const response = await api.get(`/vehicles/${id}`);
      const vehicle = response.data.data.vehicle;
      
      setFormData({
        title: vehicle.title || '',
        description: vehicle.description || '',
        vehicleType: vehicle.vehicleType || 'car',
        make: vehicle.make || '',
        model: vehicle.model || '',
        year: vehicle.year || new Date().getFullYear(),
        registrationNumber: vehicle.registrationNumber || '',
        seats: vehicle.seats || 4,
        transmission: vehicle.transmission || 'manual',
        fuelType: vehicle.fuelType || 'petrol',
        currentOdometerKm: vehicle.currentOdometerKm || 0,
        pricing: vehicle.pricing || {
          baseDaily: 0,
          baseHourly: 0,
          weeklyDiscountPercent: 0,
          monthlyDiscountPercent: 0,
          extraHourCharge: 0,
          depositAmount: 0,
        },
        policy: vehicle.policy || {
          fuelPolicy: 'full-to-full',
          ageRequirements: {
            minForSelfDrive: 21,
            minForTwoWheeler: 18,
          },
          licenseRequired: true,
          allowedKmPerDay: 200,
          extraKmCharge: 10,
          locationRestrictions: {
            allowedStates: [],
            allowedCities: [],
          },
          termsAndConditions: '',
        },
        locations: vehicle.locations || [
          {
            city: '',
            locationName: '',
            coordinates: [0, 0],
          },
        ],
        images: vehicle.images || []
      });
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      setAlert({
        show: true,
        type: 'error',
        message: 'Failed to load vehicle details'
      });
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('pricing.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        pricing: {
          ...prev.pricing,
          [field]: type === 'number' ? parseFloat(value) || 0 : value,
        },
      }));
    } else if (name.startsWith('policy.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        policy: {
          ...prev.policy,
          [field]: type === 'number' ? parseFloat(value) || 0 : value,
        },
      }));
    } else if (name.startsWith('locations.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        locations: [
          {
            ...prev.locations[0],
            [field]: value,
          },
        ],
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value,
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImageUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await api.post(`/vehicles/${id}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          images: response.data.data.images
        }));
        setAlert({
          show: true,
          type: 'success',
          message: 'Images uploaded successfully!'
        });
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      setAlert({
        show: true,
        type: 'error',
        message: 'Failed to upload images'
      });
    } finally {
      setImageUploading(false);
    }
  };

  const handleDeleteImage = async (imageIndex) => {
    try {
      await api.delete(`/vehicles/${id}/images/${imageIndex}`);
      
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, index) => index !== imageIndex)
      }));
      
      setAlert({
        show: true,
        type: 'success',
        message: 'Image deleted successfully!'
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      setAlert({
        show: true,
        type: 'error',
        message: 'Failed to delete image'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ show: false, type: '', message: '' });

    try {
      const response = await api.put(`/vehicles/${id}`, formData);
      
      if (response.data.success) {
        setAlert({
          show: true,
          type: 'success',
          message: 'Vehicle updated successfully!',
        });
        setTimeout(() => {
          navigate('/vendor/vehicles');
        }, 2000);
      }
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: error.response?.data?.message || 'Failed to update vehicle',
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
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
          onClick={() => navigate('/vendor/vehicles')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Vehicles</span>
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900">Edit Vehicle</h1>
        <p className="text-gray-600 mt-2">Update your vehicle details</p>
      </div>

      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ show: false, type: '', message: '' })}
        />
      )}

      {/* Image Upload Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Images</h2>
        
        {/* Current Images */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Current Images</h3>
          {formData.images.length === 0 ? (
            <p className="text-gray-500">No images uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Vehicle ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload New Images */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Upload New Images</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={imageUploading}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center justify-center space-y-2"
            >
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="text-sm text-gray-600">
                {imageUploading ? 'Uploading...' : 'Click to upload images'}
              </span>
              <span className="text-xs text-gray-500">
                PNG, JPG, JPEG up to 10MB
              </span>
            </label>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Toyota Innova Crysta"
                required
              />
            </div>

            <div>
              <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Type *
              </label>
              <select
                id="vehicleType"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                {vehicleTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-2">
                Make *
              </label>
              <input
                type="text"
                id="make"
                name="make"
                value={formData.make}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Toyota"
                required
              />
            </div>

            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
                Model *
              </label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Innova Crysta"
                required
              />
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                Year *
              </label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                min="1990"
                max={new Date().getFullYear()}
                required
              />
            </div>

            <div>
              <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Registration Number *
              </label>
              <input
                type="text"
                id="registrationNumber"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., KA01AB1234"
                required
              />
            </div>

            <div>
              <label htmlFor="seats" className="block text-sm font-medium text-gray-700 mb-2">
                Number of Seats *
              </label>
              <input
                type="number"
                id="seats"
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                min="1"
                required
              />
            </div>

            <div>
              <label htmlFor="transmission" className="block text-sm font-medium text-gray-700 mb-2">
                Transmission *
              </label>
              <select
                id="transmission"
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                {transmissions.map(trans => (
                  <option key={trans.value} value={trans.value}>
                    {trans.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 mb-2">
                Fuel Type *
              </label>
              <select
                id="fuelType"
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                {fuelTypes.map(fuel => (
                  <option key={fuel.value} value={fuel.value}>
                    {fuel.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="currentOdometerKm" className="block text-sm font-medium text-gray-700 mb-2">
                Current Odometer (KM)
              </label>
              <input
                type="number"
                id="currentOdometerKm"
                name="currentOdometerKm"
                value={formData.currentOdometerKm}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                min="0"
              />
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Describe your vehicle, features, condition, etc."
            />
          </div>
        </div>

        {/* Pricing Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Pricing Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label htmlFor="pricing.baseDaily" className="block text-sm font-medium text-gray-700 mb-2">
                Base Daily Rate (₹) *
              </label>
              <input
                type="number"
                id="pricing.baseDaily"
                name="pricing.baseDaily"
                value={formData.pricing.baseDaily}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                min="0"
                required
              />
            </div>

            <div>
              <label htmlFor="pricing.baseHourly" className="block text-sm font-medium text-gray-700 mb-2">
                Base Hourly Rate (₹)
              </label>
              <input
                type="number"
                id="pricing.baseHourly"
                name="pricing.baseHourly"
                value={formData.pricing.baseHourly}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                min="0"
              />
            </div>

            <div>
              <label htmlFor="pricing.extraHourCharge" className="block text-sm font-medium text-gray-700 mb-2">
                Extra Hour Charge (₹)
              </label>
              <input
                type="number"
                id="pricing.extraHourCharge"
                name="pricing.extraHourCharge"
                value={formData.pricing.extraHourCharge}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                min="0"
              />
            </div>

            <div>
              <label htmlFor="pricing.weeklyDiscountPercent" className="block text-sm font-medium text-gray-700 mb-2">
                Weekly Discount (%)
              </label>
              <input
                type="number"
                id="pricing.weeklyDiscountPercent"
                name="pricing.weeklyDiscountPercent"
                value={formData.pricing.weeklyDiscountPercent}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                min="0"
                max="100"
              />
            </div>

            <div>
              <label htmlFor="pricing.monthlyDiscountPercent" className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Discount (%)
              </label>
              <input
                type="number"
                id="pricing.monthlyDiscountPercent"
                name="pricing.monthlyDiscountPercent"
                value={formData.pricing.monthlyDiscountPercent}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                min="0"
                max="100"
              />
            </div>

            <div>
              <label htmlFor="pricing.depositAmount" className="block text-sm font-medium text-gray-700 mb-2">
                Security Deposit (₹)
              </label>
              <input
                type="number"
                id="pricing.depositAmount"
                name="pricing.depositAmount"
                value={formData.pricing.depositAmount}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Location Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="locations.city" className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                id="locations.city"
                name="locations.city"
                value={formData.locations[0].city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Bangalore"
                required
              />
            </div>

            <div>
              <label htmlFor="locations.locationName" className="block text-sm font-medium text-gray-700 mb-2">
                Location Name
              </label>
              <input
                type="text"
                id="locations.locationName"
                name="locations.locationName"
                value={formData.locations[0].locationName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Airport, Downtown"
              />
            </div>
          </div>
        </div>

        {/* Policy Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Rental Policy</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="policy.fuelPolicy" className="block text-sm font-medium text-gray-700 mb-2">
                Fuel Policy
              </label>
              <select
                id="policy.fuelPolicy"
                name="policy.fuelPolicy"
                value={formData.policy.fuelPolicy}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {fuelPolicies.map(policy => (
                  <option key={policy.value} value={policy.value}>
                    {policy.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="policy.allowedKmPerDay" className="block text-sm font-medium text-gray-700 mb-2">
                Allowed KM Per Day
              </label>
              <input
                type="number"
                id="policy.allowedKmPerDay"
                name="policy.allowedKmPerDay"
                value={formData.policy.allowedKmPerDay}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                min="0"
              />
            </div>

            <div>
              <label htmlFor="policy.extraKmCharge" className="block text-sm font-medium text-gray-700 mb-2">
                Extra KM Charge (₹)
              </label>
              <input
                type="number"
                id="policy.extraKmCharge"
                name="policy.extraKmCharge"
                value={formData.policy.extraKmCharge}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                min="0"
              />
            </div>

            <div>
              <label htmlFor="policy.minForSelfDrive" className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Age for Self Drive
              </label>
              <input
                type="number"
                id="policy.minForSelfDrive"
                name="policy.ageRequirements.minForSelfDrive"
                value={formData.policy.ageRequirements.minForSelfDrive}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  policy: {
                    ...prev.policy,
                    ageRequirements: {
                      ...prev.policy.ageRequirements,
                      minForSelfDrive: parseInt(e.target.value) || 0,
                    },
                  },
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                min="18"
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center">
              <input
                id="policy.licenseRequired"
                name="policy.licenseRequired"
                type="checkbox"
                checked={formData.policy.licenseRequired}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  policy: {
                    ...prev.policy,
                    licenseRequired: e.target.checked,
                  },
                }))}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="policy.licenseRequired" className="ml-2 block text-sm text-gray-900">
                Driving License Required
              </label>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="policy.termsAndConditions" className="block text-sm font-medium text-gray-700 mb-2">
              Terms & Conditions
            </label>
            <textarea
              id="policy.termsAndConditions"
              name="policy.termsAndConditions"
              value={formData.policy.termsAndConditions}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Additional terms and conditions for renting this vehicle"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            <span>Update Vehicle</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditVehicle;