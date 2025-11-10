// src/pages/vendor/VendorProfile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Building, Mail, Phone, MapPin, User, Upload, Save } from 'lucide-react';
import api from '../../services/api';
import Alert from '../../components/ui/Alert';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const VendorProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [vendorData, setVendorData] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPhone: '',
    contactEmail: '',
    address: {
      city: '',
      state: '',
      country: '',
      addressLine: '',
      postalCode: '',
    },
    bankDetails: {
      accountName: '',
      accountNumber: '',
      ifsc: '',
      upiId: '',
    },
  });

  useEffect(() => {
    fetchVendorProfile();
  }, []);

  const fetchVendorProfile = async () => {
    try {
      const response = await api.get('/vendors/profile');
      setVendorData(response.data.data.vendor);
      setFormData({
        companyName: response.data.data.vendor.companyName || '',
        contactPhone: response.data.data.vendor.contactPhone || '',
        contactEmail: response.data.data.vendor.contactEmail || '',
        address: response.data.data.vendor.address || {
          city: '',
          state: '',
          country: '',
          addressLine: '',
          postalCode: '',
        },
        bankDetails: response.data.data.vendor.bankDetails || {
          accountName: '',
          accountNumber: '',
          ifsc: '',
          upiId: '',
        },
      });
    } catch (error) {
      console.error('Error fetching vendor profile:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else if (name.startsWith('bankDetails.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [field]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ show: false, type: '', message: '' });

    try {
      const response = await api.put('/vendors/profile', formData);
      
      if (response.data.success) {
        setAlert({
          show: true,
          type: 'success',
          message: 'Vendor profile updated successfully!',
        });
        setVendorData(response.data.data.vendor);
      }
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: error.response?.data?.message || 'Failed to update vendor profile',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!vendorData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Vendor Profile</h1>
        <p className="text-gray-600 mt-2">Manage your business information and bank details</p>
      </div>

      <div className="space-y-8">
        {alert.show && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ show: false, type: '', message: '' })}
          />
        )}

        {/* Business Information */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Business Information</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Business Address</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="address.addressLine" className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="address.addressLine"
                      name="address.addressLine"
                      value={formData.address.addressLine}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="Street address"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    id="address.city"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="address.state" className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    id="address.state"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="address.postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="address.postalCode"
                    name="address.postalCode"
                    value={formData.address.postalCode}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="address.country" className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    id="address.country"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Bank Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="bankDetails.accountName" className="block text-sm font-medium text-gray-700 mb-2">
                    Account Holder Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="bankDetails.accountName"
                      name="bankDetails.accountName"
                      value={formData.bankDetails.accountName}
                      onChange={handleChange}
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="bankDetails.accountNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    id="bankDetails.accountNumber"
                    name="bankDetails.accountNumber"
                    value={formData.bankDetails.accountNumber}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="bankDetails.ifsc" className="block text-sm font-medium text-gray-700 mb-2">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    id="bankDetails.ifsc"
                    name="bankDetails.ifsc"
                    value={formData.bankDetails.ifsc}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="bankDetails.upiId" className="block text-sm font-medium text-gray-700 mb-2">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    id="bankDetails.upiId"
                    name="bankDetails.upiId"
                    value={formData.bankDetails.upiId}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="yourname@upi"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center space-x-2"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* KYC Status */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">KYC Verification</h2>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">
                Status: <span className={`font-medium capitalize ${
                  vendorData.kyc?.status === 'verified' ? 'text-green-600' :
                  vendorData.kyc?.status === 'pending' ? 'text-yellow-600' :
                  vendorData.kyc?.status === 'rejected' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {vendorData.kyc?.status || 'not_submitted'}
                </span>
              </p>
              {vendorData.kyc?.submittedAt && (
                <p className="text-sm text-gray-500 mt-1">
                  Submitted on: {new Date(vendorData.kyc.submittedAt).toLocaleDateString()}
                </p>
              )}
            </div>
            
            {(!vendorData.kyc || vendorData.kyc.status !== 'verified') && (
              <button className="btn-primary">
                {vendorData.kyc ? 'Update KYC' : 'Submit KYC'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;