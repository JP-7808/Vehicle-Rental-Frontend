// src/pages/admin/System.jsx
import React, { useState, useEffect } from 'react';
import { Save, Settings, Shield, Bell, Globe, CreditCard, Database, Server } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';

const System = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/settings');
      setSettings(response.data.data.settings || {});
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Mock settings data
      setSettings({
        general: {
          siteName: 'RentWheels',
          siteDescription: 'Premium Vehicle Rental Platform',
          supportEmail: 'support@rentwheels.com',
          supportPhone: '+91-9876543210',
        },
        payment: {
          razorpayKey: 'rzp_test_xxxxxxxx',
          razorpaySecret: 'xxxxxxxxxxxxxxxx',
          currency: 'INR',
          testMode: true,
        },
        notifications: {
          emailNotifications: true,
          smsNotifications: false,
          pushNotifications: true,
          bookingAlerts: true,
          paymentAlerts: true,
        },
        security: {
          requireEmailVerification: true,
          requirePhoneVerification: false,
          twoFactorAuth: false,
          sessionTimeout: 24,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setAlert({ show: false, type: '', message: '' });
    
    try {
      await api.put('/admin/settings', settings);
      setAlert({
        show: true,
        type: 'success',
        message: 'Settings saved successfully!',
      });
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Failed to save settings',
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const SettingSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Icon className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      </div>
      <div className="p-6 space-y-4">
        {children}
      </div>
    </div>
  );

  const SettingField = ({ label, name, type = 'text', section, value, options }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {type === 'checkbox' ? (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => updateSetting(section, name, e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Enable {label}
          </label>
        </div>
      ) : type === 'select' ? (
        <select
          value={value || ''}
          onChange={(e) => updateSetting(section, name, e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={(e) => updateSetting(section, name, e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-1">Configure platform settings and preferences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <LoadingSpinner size="sm" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          <span>Save Changes</span>
        </button>
      </div>

      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ show: false, type: '', message: '' })}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <SettingSection title="General Settings" icon={Globe}>
          <SettingField
            label="Site Name"
            name="siteName"
            section="general"
            value={settings.general?.siteName}
          />
          <SettingField
            label="Site Description"
            name="siteDescription"
            section="general"
            value={settings.general?.siteDescription}
          />
          <SettingField
            label="Support Email"
            name="supportEmail"
            type="email"
            section="general"
            value={settings.general?.supportEmail}
          />
          <SettingField
            label="Support Phone"
            name="supportPhone"
            section="general"
            value={settings.general?.supportPhone}
          />
        </SettingSection>

        {/* Payment Settings */}
        <SettingSection title="Payment Settings" icon={CreditCard}>
          <SettingField
            label="Razorpay Key"
            name="razorpayKey"
            section="payment"
            value={settings.payment?.razorpayKey}
          />
          <SettingField
            label="Razorpay Secret"
            name="razorpaySecret"
            type="password"
            section="payment"
            value={settings.payment?.razorpaySecret}
          />
          <SettingField
            label="Currency"
            name="currency"
            type="select"
            section="payment"
            value={settings.payment?.currency}
            options={[
              { value: 'INR', label: 'Indian Rupee (INR)' },
              { value: 'USD', label: 'US Dollar (USD)' },
              { value: 'EUR', label: 'Euro (EUR)' },
            ]}
          />
          <SettingField
            label="Test Mode"
            name="testMode"
            type="checkbox"
            section="payment"
            value={settings.payment?.testMode}
          />
        </SettingSection>

        {/* Notification Settings */}
        <SettingSection title="Notification Settings" icon={Bell}>
          <SettingField
            label="Email Notifications"
            name="emailNotifications"
            type="checkbox"
            section="notifications"
            value={settings.notifications?.emailNotifications}
          />
          <SettingField
            label="SMS Notifications"
            name="smsNotifications"
            type="checkbox"
            section="notifications"
            value={settings.notifications?.smsNotifications}
          />
          <SettingField
            label="Push Notifications"
            name="pushNotifications"
            type="checkbox"
            section="notifications"
            value={settings.notifications?.pushNotifications}
          />
          <SettingField
            label="Booking Alerts"
            name="bookingAlerts"
            type="checkbox"
            section="notifications"
            value={settings.notifications?.bookingAlerts}
          />
          <SettingField
            label="Payment Alerts"
            name="paymentAlerts"
            type="checkbox"
            section="notifications"
            value={settings.notifications?.paymentAlerts}
          />
        </SettingSection>

        {/* Security Settings */}
        <SettingSection title="Security Settings" icon={Shield}>
          <SettingField
            label="Require Email Verification"
            name="requireEmailVerification"
            type="checkbox"
            section="security"
            value={settings.security?.requireEmailVerification}
          />
          <SettingField
            label="Require Phone Verification"
            name="requirePhoneVerification"
            type="checkbox"
            section="security"
            value={settings.security?.requirePhoneVerification}
          />
          <SettingField
            label="Two-Factor Authentication"
            name="twoFactorAuth"
            type="checkbox"
            section="security"
            value={settings.security?.twoFactorAuth}
          />
          <SettingField
            label="Session Timeout (hours)"
            name="sessionTimeout"
            type="number"
            section="security"
            value={settings.security?.sessionTimeout}
          />
        </SettingSection>
      </div>

      {/* System Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Server className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">System Information</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Database className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-600">Database</div>
              <div className="text-lg font-semibold text-gray-900">MongoDB</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Server className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-600">Server</div>
              <div className="text-lg font-semibold text-gray-900">Node.js</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Settings className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-600">Frontend</div>
              <div className="text-lg font-semibold text-gray-900">React + Vite</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default System;