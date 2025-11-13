// src/pages/vendor/VendorSettings.jsx
import React, { useState, useEffect } from 'react';
import { Save, Mail, Smartphone, Globe, Calendar, X, Plus } from 'lucide-react';
import api from '../../services/api';
import Alert from '../../components/ui/Alert';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const VendorSettings = () => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [settings, setSettings] = useState({
    contactPhone: '',
    contactEmail: '',
    isActive: true,
    language: 'en',
    timezone: 'Asia/Kolkata',
  });

  const [blockedDates, setBlockedDates] = useState([]);
  const [newBlockDate, setNewBlockDate] = useState({
    date: '',
    reason: ''
  });
  const [showAddBlockForm, setShowAddBlockForm] = useState(false);
  const [blockDateLoading, setBlockDateLoading] = useState(false);

  // === HELPER FUNCTIONS - DEFINED EARLY TO AVOID HOISTING ISSUES ===
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isPastDate = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dateString) < today;
  };

  // Sort blocked dates: future first, then past
  const sortedBlockedDates = [...blockedDates].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
  // ==================================================================

  useEffect(() => {
    fetchVendorProfile();
    fetchBlockedDates();
  }, []);

  const fetchVendorProfile = async () => {
    try {
      const response = await api.get('/vendors/profile');
      const vendor = response.data.data.vendor;

      setSettings(prev => ({
        ...prev,
        contactPhone: vendor.contactPhone || '',
        contactEmail: vendor.contactEmail || '',
        isActive: vendor.isActive !== undefined ? vendor.isActive : true
      }));
    } catch (error) {
      console.error('Error fetching vendor profile:', error);
    }
  };

  const fetchBlockedDates = async () => {
    try {
      const response = await api.get('/vendors/profile');
      const vendor = response.data.data.vendor;
      setBlockedDates(vendor.blockedDates || []);
    } catch (error) {
      console.error('Error fetching blocked dates:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBlockDateChange = (e) => {
    const { name, value } = e.target;
    setNewBlockDate(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddBlockDate = async (e) => {
    e.preventDefault();
    if (!newBlockDate.date) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Please select a date to block.'
      });
      return;
    }

    setBlockDateLoading(true);
    try {
      const response = await api.post('/vendors/block-dates', {
        dates: [newBlockDate.date],
        reason: newBlockDate.reason || 'Vendor unavailable'
      });

      if (response.data.success) {
        setBlockedDates(response.data.data.blockedDates);
        setNewBlockDate({ date: '', reason: '' });
        setShowAddBlockForm(false);
        setAlert({
          show: true,
          type: 'success',
          message: 'Date blocked successfully!'
        });
      }
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: error.response?.data?.message || 'Failed to block date'
      });
    } finally {
      setBlockDateLoading(false);
    }
  };

  // === FIXED: Accept only dateId ===
  const handleRemoveBlockDate = async (dateId) => {
    try {
      const response = await api.delete(`/vendors/block-dates/${dateId}`);

      if (response.data.success) {
        setBlockedDates(response.data.data.blockedDates);
        setAlert({
          show: true,
          type: 'success',
          message: 'Date unblocked successfully!'
        });
      }
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: error.response?.data?.message || 'Failed to unblock date'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ show: false, type: '', message: '' });

    try {
      await api.patch('/vendors/settings', settings);

      setAlert({
        show: true,
        type: 'success',
        message: 'Settings updated successfully!'
      });
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: error.response?.data?.message || 'Failed to update settings'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600 mt-2">Manage your vendor account and availability</p>
      </div>

      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ show: false, type: '', message: '' })}
        />
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contact Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Contact Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone *
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={settings.contactPhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pl-10"
                  required
                  placeholder="Enter your contact number"
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
                  value={settings.contactEmail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pl-10"
                  required
                  placeholder="Enter your contact email"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Account Preferences */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Account Preferences
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                id="language"
                name="language"
                value={settings.language}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
                <option value="te">Telugu</option>
                <option value="kn">Kannada</option>
                <option value="ml">Malayalam</option>
              </select>
            </div>

            <div>
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <select
                id="timezone"
                name="timezone"
                value={settings.timezone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="Asia/Kolkata">India Standard Time (IST)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">Greenwich Mean Time (GMT)</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div>
              <label htmlFor="isActive" className="text-sm font-medium text-yellow-800">
                Vendor Account Status
              </label>
              <p className="text-sm text-yellow-700">
                {settings.isActive
                  ? 'Your vendor account is currently active and receiving bookings.'
                  : 'Your vendor account is inactive and not receiving bookings.'
                }
              </p>
            </div>
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              checked={settings.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
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
            <span>Save Settings</span>
          </button>
        </div>
      </form>

      {/* Block Vendor Dates Section */}
      <div className="mt-12">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Block Dates (Unavailability)
            </h2>
            <button
              type="button"
              onClick={() => setShowAddBlockForm(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Blocked Date</span>
            </button>
          </div>

          {/* Add Block Date Form */}
          {showAddBlockForm && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add Blocked Date</h3>
                <button
                  onClick={() => setShowAddBlockForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                  type="button"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddBlockDate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    Date to Block *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={newBlockDate.date}
                    onChange={handleBlockDateChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                    Reason (Optional)
                  </label>
                  <input
                    type="text"
                    id="reason"
                    name="reason"
                    value={newBlockDate.reason}
                    onChange={handleBlockDateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., Maintenance, Holiday, etc."
                  />
                </div>

                <div className="md:col-span-2 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddBlockForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={blockDateLoading}
                    className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {blockDateLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    <span>Block Date</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Blocked Dates List */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Blocked Dates ({blockedDates.length})
            </h3>

            {blockedDates.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No dates blocked yet.</p>
                <p className="text-sm text-gray-400 mt-1">
                  Add dates when you're unavailable for bookings.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedBlockedDates.map((blockedDate) => {
                  const id = blockedDate.id || blockedDate._id;
                  return (
                    <div
                      key={id}
                      className={`flex items-center justify-between p-4 border rounded-lg ${
                        isPastDate(blockedDate.date)
                          ? 'bg-gray-100 border-gray-300'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          isPastDate(blockedDate.date) ? 'bg-gray-400' : 'bg-red-500'
                        }`} />
                        <div>
                          <p className={`font-medium ${
                            isPastDate(blockedDate.date) ? 'text-gray-600' : 'text-red-800'
                          }`}>
                            {formatDate(blockedDate.date)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {blockedDate.reason || 'No reason provided'}
                          </p>
                          {isPastDate(blockedDate.date) && (
                            <span className="text-xs text-gray-400">Past date</span>
                          )}
                        </div>
                      </div>

                      {/* Only show remove button for future dates */}
                      {!isPastDate(blockedDate.date) && (
                        <button
                          onClick={() => handleRemoveBlockDate(id)}
                          className="text-red-600 hover:text-red-800 p-1 transition-colors"
                          title="Unblock this date"
                          type="button"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Information Box */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Calendar className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800">
                    About Blocked Dates
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Blocked dates prevent customers from booking your vehicles on those days. 
                    This is useful for maintenance, holidays, or personal unavailability. 
                    Past blocked dates are shown for reference but cannot be modified.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorSettings;