import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Building, Mail, Phone, MapPin, User, Upload, Save, Plus, AlertCircle, Shield, Banknote, FileText } from 'lucide-react';
import api from '../../services/api';
import Alert from '../../components/ui/Alert';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useLocation, useNavigate } from 'react-router-dom';

const VendorProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [vendorData, setVendorData] = useState(null);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [kycLoading, setKycLoading] = useState(false);
  const [bankLoading, setBankLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  
  // Add this useEffect to handle URL hash changes
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && ['profile', 'bank', 'kyc'].includes(hash)) {
      setActiveTab(hash);
    }
  }, [location.hash]);

  // Update tab change handler to update URL
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/vendor/profile#${tab}`, { replace: true });
  };

  // Update your tab buttons to use handleTabChange
  <button
    onClick={() => handleTabChange('profile')}
    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
      activeTab === 'profile'
        ? 'border-primary-500 text-primary-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    <Building className="h-4 w-4 inline mr-2" />
    Business Profile
  </button>
  
  const [formData, setFormData] = useState({
    companyName: '',
    contactPhone: '',
    contactEmail: '',
    address: {
      city: '',
      state: '',
      country: 'India',
      addressLine: '',
      postalCode: '',
    }
  });

  const [bankFormData, setBankFormData] = useState({
    accountName: '',
    accountNumber: '',
    ifsc: '',
    upiId: '',
  });

  const [kycFormData, setKycFormData] = useState({
    idType: 'Aadhaar',
    idNumber: '',
    notes: ''
  });

  const [kycDocuments, setKycDocuments] = useState({
    idDocument: null,
    businessProof: null,
    license: null
  });

  const idTypes = [
    'Aadhaar',
    'PAN',
    'Passport',
    'Driving License',
    'Voter ID'
  ];

  useEffect(() => {
    if (user && user.role === 'vendor') {
      fetchVendorProfile();
    }
  }, [user]);

  const fetchVendorProfile = async () => {
    try {
      console.log('Fetching vendor profile for user:', user?.email);
      setProfileLoading(true);
      
      const response = await api.get('/vendors/profile');
      console.log('Vendor profile response:', response.data);
      
      if (response.data.success) {
        const vendor = response.data.data.vendor;
        setVendorData(vendor);
        setFormData({
          companyName: vendor.companyName || '',
          contactPhone: vendor.contactPhone || user?.phone || '',
          contactEmail: vendor.contactEmail || user?.email || '',
          address: vendor.address || {
            city: '',
            state: '',
            country: 'India',
            addressLine: '',
            postalCode: '',
          }
        });

        setBankFormData(vendor.bankDetails || {
          accountName: '',
          accountNumber: '',
          ifsc: '',
          upiId: '',
        });

        if (vendor.kyc) {
          setKycFormData({
            idType: vendor.kyc.idType || 'Aadhaar',
            idNumber: vendor.kyc.idNumber || '',
            notes: vendor.kyc.notes || ''
          });
        }

        setIsCreatingProfile(false);
      }
    } catch (error) {
      console.error('Error fetching vendor profile:', error);
      if (error.response?.status === 404) {
        setIsCreatingProfile(true);
        setFormData(prev => ({
          ...prev,
          contactPhone: user?.phone || '',
          contactEmail: user?.email || '',
          companyName: user?.name ? `${user.name}'s Business` : ''
        }));
      } else {
        setAlert({
          show: true,
          type: 'error',
          message: 'Failed to load vendor profile. Please try again.'
        });
      }
    } finally {
      setProfileLoading(false);
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
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setBankFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleKycChange = (e) => {
    const { name, value } = e.target;
    setKycFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDocumentUpload = (e, documentType) => {
    const file = e.target.files[0];
    if (file) {
      setKycDocuments(prev => ({
        ...prev,
        [documentType]: file
      }));
    }
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ show: false, type: '', message: '' });

    try {
      console.log('Creating vendor profile for user:', user?.email);
      const response = await api.post('/vendors/profile', formData);
      
      if (response.data.success) {
        setAlert({
          show: true,
          type: 'success',
          message: 'Vendor profile created successfully! You can now manage vehicles and bookings.',
        });
        setVendorData(response.data.data.vendor);
        setIsCreatingProfile(false);
        
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating vendor profile:', error);
      setAlert({
        show: true,
        type: 'error',
        message: error.response?.data?.message || 'Failed to create vendor profile. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
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

  const handleUpdateBankDetails = async (e) => {
    e.preventDefault();
    setBankLoading(true);
    setAlert({ show: false, type: '', message: '' });

    try {
      const response = await api.patch('/vendors/bank-details', bankFormData);
      
      if (response.data.success) {
        setAlert({
          show: true,
          type: 'success',
          message: 'Bank details updated successfully!',
        });
        setVendorData(response.data.data.vendor);
      }
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: error.response?.data?.message || 'Failed to update bank details',
      });
    } finally {
      setBankLoading(false);
    }
  };

  const handleSubmitKYC = async (e) => {
    e.preventDefault();
    setKycLoading(true);
    setAlert({ show: false, type: '', message: '' });

    try {
      // First submit KYC basic info
      await api.post('/vendors/kyc', kycFormData);

      // Then upload documents if any
      const formDataToSend = new FormData();
      
      if (kycDocuments.idDocument) {
        formDataToSend.append('idDocument', kycDocuments.idDocument);
      }
      if (kycDocuments.businessProof) {
        formDataToSend.append('businessProof', kycDocuments.businessProof);
      }
      if (kycDocuments.license) {
        formDataToSend.append('license', kycDocuments.license);
      }

      if (kycDocuments.idDocument || kycDocuments.businessProof || kycDocuments.license) {
        await api.post('/vendors/kyc/documents', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setAlert({
        show: true,
        type: 'success',
        message: 'KYC submitted successfully! It will be reviewed by our team.',
      });
      
      // Refresh vendor data
      fetchVendorProfile();
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: error.response?.data?.message || 'Failed to submit KYC',
      });
    } finally {
      setKycLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (user && user.role !== 'vendor') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">
            Vendor Access Required
          </h2>
          <p className="text-yellow-700">
            You need to be registered as a vendor to access this page.
          </p>
        </div>
      </div>
    );
  }

  if (isCreatingProfile) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Vendor Profile</h1>
          <p className="text-gray-600 mt-2">Complete your vendor profile to start renting vehicles</p>
        </div>

        {alert.show && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ show: false, type: '', message: '' })}
          />
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <Plus className="h-5 w-5 text-blue-400 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">
                  Setup Required
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  You're registered as a vendor but need to complete your business profile to start using vendor features.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleCreateProfile} className="space-y-6">
            {/* Business Information Form - Same as before */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Business Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pl-10"
                      required
                      placeholder="Enter your company name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="contactEmail"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      id="contactPhone"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pl-10"
                      required
                    />
                  </div>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pl-10"
                      placeholder="Street address, building, area"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    id="address.city"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                    placeholder="e.g., Mumbai"
                  />
                </div>

                <div>
                  <label htmlFor="address.state" className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    id="address.state"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                    placeholder="e.g., Maharashtra"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., 400001"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                <span>Create Vendor Profile</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Vendor Profile</h1>
        <p className="text-gray-600 mt-2">Manage your business information and settings</p>
      </div>

      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ show: false, type: '', message: '' })}
        />
      )}

      {/* Navigation Tabs */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Building className="h-4 w-4 inline mr-2" />
              Business Profile
            </button>
            <button
              onClick={() => setActiveTab('bank')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'bank'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Banknote className="h-4 w-4 inline mr-2" />
              Bank Details
            </button>
            <button
              onClick={() => setActiveTab('kyc')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'kyc'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Shield className="h-4 w-4 inline mr-2" />
              KYC Verification
            </button>
          </nav>
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Business Information</h2>
          
          <form onSubmit={handleUpdateProfile} className="space-y-6">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pl-10"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pl-10"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pl-10"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pl-10"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
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
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bank Details Tab */}
      {activeTab === 'bank' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Bank Details</h2>
          
          <form onSubmit={handleUpdateBankDetails} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-2">
                  Account Holder Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="accountName"
                    name="accountName"
                    value={bankFormData.accountName}
                    onChange={handleBankChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number *
                </label>
                <input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  value={bankFormData.accountNumber}
                  onChange={handleBankChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="ifsc" className="block text-sm font-medium text-gray-700 mb-2">
                  IFSC Code *
                </label>
                <input
                  type="text"
                  id="ifsc"
                  name="ifsc"
                  value={bankFormData.ifsc}
                  onChange={handleBankChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                  placeholder="e.g., SBIN0000123"
                />
              </div>

              <div>
                <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-2">
                  UPI ID
                </label>
                <input
                  type="text"
                  id="upiId"
                  name="upiId"
                  value={bankFormData.upiId}
                  onChange={handleBankChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="yourname@upi"
                />
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-yellow-400 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Important Information</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Ensure your bank details are accurate. Payments will be processed to this account.
                    Double-check your account number and IFSC code before saving.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={bankLoading}
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bankLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                <span>Update Bank Details</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* KYC Tab */}
      {activeTab === 'kyc' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">KYC Verification</h2>
            {vendorData?.kyc && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                vendorData.kyc.status === 'verified' ? 'bg-green-100 text-green-800' :
                vendorData.kyc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                vendorData.kyc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                Status: {vendorData.kyc.status}
              </span>
            )}
          </div>

          {vendorData?.kyc?.status === 'verified' ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-green-800 mb-2">KYC Verified</h3>
              <p className="text-green-700">
                Your KYC verification has been completed and approved.
              </p>
              {vendorData.kyc.verifiedAt && (
                <p className="text-sm text-green-600 mt-2">
                  Verified on: {new Date(vendorData.kyc.verifiedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ) : (
            <>
              {vendorData?.kyc?.status === 'pending' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-blue-400 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">KYC Under Review</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Your KYC submission is being reviewed by our team. This process usually takes 1-2 business days.
                      </p>
                      {vendorData.kyc.submittedAt && (
                        <p className="text-sm text-blue-600 mt-1">
                          Submitted on: {new Date(vendorData.kyc.submittedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {vendorData?.kyc?.status === 'rejected' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-red-800">KYC Rejected</h4>
                      <p className="text-sm text-red-700 mt-1">
                        {vendorData.kyc.notes || 'Your KYC submission was rejected. Please review and resubmit your documents.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmitKYC} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="idType" className="block text-sm font-medium text-gray-700 mb-2">
                      ID Type *
                    </label>
                    <select
                      id="idType"
                      name="idType"
                      value={kycFormData.idType}
                      onChange={handleKycChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    >
                      {idTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      ID Number *
                    </label>
                    <input
                      type="text"
                      id="idNumber"
                      name="idNumber"
                      value={kycFormData.idNumber}
                      onChange={handleKycChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                      placeholder="Enter your ID number"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={kycFormData.notes}
                    onChange={handleKycChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Any additional information for verification..."
                  />
                </div>

                {/* Document Upload Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Required Documents</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* ID Document */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h4 className="text-sm font-medium text-gray-900 mb-1">ID Document</h4>
                      <p className="text-xs text-gray-500 mb-3">
                        Upload a clear copy of your {kycFormData.idType}
                      </p>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => handleDocumentUpload(e, 'idDocument')}
                        className="hidden"
                        id="idDocument"
                      />
                      <label
                        htmlFor="idDocument"
                        className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium py-2 px-3 rounded-lg cursor-pointer inline-block"
                      >
                        {kycDocuments.idDocument ? 'Change File' : 'Upload File'}
                      </label>
                      {kycDocuments.idDocument && (
                        <p className="text-xs text-green-600 mt-2">
                          Selected: {kycDocuments.idDocument.name}
                        </p>
                      )}
                    </div>

                    {/* Business Proof */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Business Proof</h4>
                      <p className="text-xs text-gray-500 mb-3">
                        GST certificate, trade license, etc.
                      </p>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => handleDocumentUpload(e, 'businessProof')}
                        className="hidden"
                        id="businessProof"
                      />
                      <label
                        htmlFor="businessProof"
                        className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium py-2 px-3 rounded-lg cursor-pointer inline-block"
                      >
                        {kycDocuments.businessProof ? 'Change File' : 'Upload File'}
                      </label>
                      {kycDocuments.businessProof && (
                        <p className="text-xs text-green-600 mt-2">
                          Selected: {kycDocuments.businessProof.name}
                        </p>
                      )}
                    </div>

                    {/* License */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Business License</h4>
                      <p className="text-xs text-gray-500 mb-3">
                        Business registration or license
                      </p>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => handleDocumentUpload(e, 'license')}
                        className="hidden"
                        id="license"
                      />
                      <label
                        htmlFor="license"
                        className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium py-2 px-3 rounded-lg cursor-pointer inline-block"
                      >
                        {kycDocuments.license ? 'Change File' : 'Upload File'}
                      </label>
                      {kycDocuments.license && (
                        <p className="text-xs text-green-600 mt-2">
                          Selected: {kycDocuments.license.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">Document Requirements</h4>
                      <ul className="text-sm text-blue-700 mt-1 list-disc list-inside space-y-1">
                        <li>Files should be in JPG, PNG, or PDF format</li>
                        <li>Maximum file size: 10MB per document</li>
                        <li>Ensure documents are clear and readable</li>
                        <li>All documents should be valid and not expired</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={kycLoading}
                    className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {kycLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <Shield className="h-5 w-5" />
                    )}
                    <span>
                      {vendorData?.kyc ? 'Update KYC Submission' : 'Submit KYC'}
                    </span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default VendorProfile;