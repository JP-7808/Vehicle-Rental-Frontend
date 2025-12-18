// src/components/layout/VendorLayout.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Car, Calendar, User, Menu, X,
  LogOut, Building, Plus, BarChart3, DollarSign,
  Settings, Shield, Banknote, FileText
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const VendorLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/vendor/dashboard', icon: LayoutDashboard },
    { name: 'My Vehicles', href: '/vendor/vehicles', icon: Car },
    { name: 'Add Vehicle', href: '/vendor/vehicles/add', icon: Plus },
    { name: 'Bookings', href: '/vendor/bookings', icon: Calendar },
    // { name: 'Earnings', href: '/vendor/earnings', icon: DollarSign },
    // { name: 'Analytics', href: '/vendor/analytics', icon: BarChart3 },
  ];

  const settingsNavigation = [
    { name: 'Business Profile', href: '/vendor/profile', icon: User, tab: 'profile' },
    { name: 'Bank Details', href: '/vendor/profile', icon: Banknote, tab: 'bank' },
    { name: 'KYC Verification', href: '/vendor/profile', icon: Shield, tab: 'kyc' },
    { name: 'Account Settings', href: '/vendor/settings', icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;
  const isProfileTabActive = (tab) => location.pathname === '/vendor/profile' && location.hash === `#${tab}`;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSettingsNavigation = (href, tab = null) => {
    if (tab) {
      navigate(`${href}#${tab}`);
    } else {
      navigate(href);
    }
    setSettingsDropdownOpen(false);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 mr-2"
              >
                <Menu className="h-6 w-6" />
              </button>
              <Link to="/vendor/dashboard" className="flex items-center space-x-2">
                <Building className="h-8 w-8 text-green-600" />
                <div>
                  <span className="text-xl font-bold text-gray-900">Vendor Panel</span>
                  <p className="text-xs text-gray-500">Asia & Comapany Self Drive</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-green-600 bg-green-50 border border-green-200'
                      : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
              
              {/* Settings Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSettingsDropdownOpen(!settingsDropdownOpen)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/vendor/profile' || location.pathname === '/vendor/settings'
                      ? 'text-green-600 bg-green-50 border border-green-200'
                      : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>

                {settingsDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">Account Settings</p>
                      <p className="text-xs text-gray-500">Manage your vendor account</p>
                    </div>
                    
                    <div className="py-1">
                      {settingsNavigation.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => handleSettingsNavigation(item.href, item.tab)}
                          className={`flex items-center space-x-3 w-full px-4 py-2 text-sm text-left transition-colors ${
                            (item.tab ? isProfileTabActive(item.tab) : isActive(item.href))
                              ? 'text-green-600 bg-green-50'
                              : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                          }`}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">Vendor</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-gray-900 bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <Building className="h-6 w-6 text-green-600" />
                <div>
                  <span className="text-lg font-bold text-gray-900">Vendor Panel</span>
                  <p className="text-xs text-gray-500">Asia & Company Partner</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="p-4 space-y-1">
              {/* Main Navigation */}
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-green-600 bg-green-50 border border-green-200'
                      : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}

              {/* Settings Section Header */}
              <div className="pt-4 mt-4 border-t border-gray-200">
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Settings
                </p>
                
                {/* Settings Navigation */}
                {settingsNavigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleSettingsNavigation(item.href, item.tab)}
                    className={`flex items-center space-x-3 w-full px-3 py-3 rounded-lg text-sm font-medium text-left transition-colors ${
                      (item.tab ? isProfileTabActive(item.tab) : isActive(item.href))
                        ? 'text-green-600 bg-green-50 border border-green-200'
                        : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </nav>

            {/* User Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">Vendor Account</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Building className="h-6 w-6 text-green-400" />
                <span className="text-xl font-bold">Vendor Portal</span>
              </div>
              <p className="text-gray-400 max-w-md">
                Manage your vehicles, bookings, earnings, and account settings with our comprehensive vendor dashboard.
                Access KYC verification, bank details, and business profile management all in one place.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/vendor/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="/vendor/vehicles" className="hover:text-white transition-colors">My Vehicles</Link></li>
                <li><Link to="/vendor/bookings" className="hover:text-white transition-colors">Bookings</Link></li>
                <li><Link to="/vendor/earnings" className="hover:text-white transition-colors">Earnings</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Account & Support</h3>
              <div className="space-y-2 text-gray-400">
                <Link to="/vendor/profile" className="block hover:text-white transition-colors">Business Profile</Link>
                <Link to="/vendor/profile#bank" className="block hover:text-white transition-colors">Bank Details</Link>
                <Link to="/vendor/profile#kyc" className="block hover:text-white transition-colors">KYC Verification</Link>
                <Link to="/vendor/settings" className="block hover:text-white transition-colors">Account Settings</Link>
                <p className="pt-2">Support: support@asiaandcompanyselfdrive.com</p>
                <p>Phone: +91 75260 51009</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Asia & Comapany Self Drive Vendor Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Close dropdown when clicking outside */}
      {settingsDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setSettingsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default VendorLayout;