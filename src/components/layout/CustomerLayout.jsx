// src/components/layout/CustomerLayout.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Car, Menu, X, User, LogOut, Calendar, 
  Search, Home, Phone, Mail, LogIn, UserPlus,
  Shield, FileText, Info, BookOpen, AlertCircle,MapPin
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../../assets/logo.svg';

const CustomerLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Search Vehicles', href: '/search', icon: Search },
    { name: 'My Bookings', href: '/my-bookings', icon: Calendar },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Car className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">DriveEase</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-gray-700">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              <Menu className="h-6 w-6" />
            </button>
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
          <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <Car className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-bold text-gray-900">DriveEase</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="p-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* User Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src={Logo} 
                  alt="AsiaAndCompanySelfDrive Logo" 
                  className="h-12 w-12 object-contain" 
                />
                <div>
                  <span className="text-2xl font-bold block">Asia & Company</span>
                  <span className="text-lg text-blue-300">Self Drive</span>
                </div>
              </div>
              <p className="text-gray-400 max-w-md mb-4 leading-relaxed">
                Your trusted partner for self-drive vehicle rentals across India. 
                Experience complete freedom, comfort, and control over your travel.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-2">
                  {/* <Phone className="h-4 w-4 text-blue-300" /> */}
                  <span className="text-gray-300">+91 75260 51009</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-blue-300" />
                  <span className="text-gray-300">support@asiaandcompanyselfdrive.com</span>
                </div>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
                <Home className="h-5 w-5 mr-2 text-blue-300" />
                Quick Links
              </h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link to="/" className="hover:text-white transition-colors flex items-center" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/search" className="hover:text-white transition-colors flex items-center" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <Search className="h-4 w-4 mr-2" />
                    Search Vehicles
                  </Link>
                </li>
                {user && (
                  <li>
                    <Link to="/my-bookings" className="hover:text-white transition-colors flex items-center" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                      <Calendar className="h-4 w-4 mr-2" />
                      My Bookings
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            
            {/* Legal Policies */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-300" />
                Legal
              </h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link 
                    to="/legal/about-us" 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="hover:text-white transition-colors flex items-center group"
                  >
                    <div className="w-1 h-4 bg-transparent group-hover:bg-blue-400 mr-3 rounded"></div>
                    <Info className="h-4 w-4 mr-2" />
                    About Us
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/legal/privacy-policy" 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="hover:text-white transition-colors flex items-center group"
                  >
                    <div className="w-1 h-4 bg-transparent group-hover:bg-blue-400 mr-3 rounded"></div>
                    <Shield className="h-4 w-4 mr-2" />
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/legal/terms-conditions" 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="hover:text-white transition-colors flex items-center group"
                  >
                    <div className="w-1 h-4 bg-transparent group-hover:bg-blue-400 mr-3 rounded"></div>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/legal/cancellation-policy" 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="hover:text-white transition-colors flex items-center group"
                  >
                    <div className="w-1 h-4 bg-transparent group-hover:bg-blue-400 mr-3 rounded"></div>
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Cancellation Policy
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Contact & Business */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
                <Phone className="h-5 w-5 mr-2 text-blue-300" />
                Business Hours
              </h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3 mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-white font-medium">Monday – Sunday</p>
                    <p className="text-sm">9:00 AM – 7:00 PM</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-800">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-blue-300 mr-2 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-white font-medium mb-1">Address</p>
                      <p className="text-sm text-gray-400 leading-tight">
                        665 Sevai Barauna, Near Sector 14, Vrindavan Yojna, Lucknow, Uttar Pradesh, India
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Footer */}
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-400 text-sm">
                <p>&copy; {new Date().getFullYear()} Asia and Company Self Drive. All rights reserved.</p>
                <p className="mt-1 text-xs">Reg: Lucknow, Uttar Pradesh, India</p>
              </div>
              
              <div className="flex items-center space-x-6">
                {/* Razorpay Verification Badge */}
                <div className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-gray-300">
                    Payments secured by <span className="text-white font-medium">Razorpay</span>
                  </span>
                </div>
                
                {/* Policy Update Note */}
                <div className="text-xs text-gray-500 max-w-xs">
                  <p className="italic">Note: We reserve the right to update policies without prior notice.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;