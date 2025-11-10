// src/pages/vendor/VendorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Users,
  Star,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const VendorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchRecentBookings();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/vendors/dashboard');
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentBookings = async () => {
    try {
      const response = await api.get('/vendors/bookings?limit=5');
      setRecentBookings(response.data.data.bookings);
    } catch (error) {
      console.error('Error fetching recent bookings:', error);
    }
  };

  const stats = [
    {
      name: 'Total Vehicles',
      value: dashboardData?.overview?.totalVehicles || 0,
      icon: Car,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Active Vehicles',
      value: dashboardData?.overview?.activeVehicles || 0,
      icon: Car,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Total Bookings',
      value: dashboardData?.overview?.totalBookings || 0,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Recent Bookings',
      value: dashboardData?.overview?.recentBookings || 0,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      name: 'Total Revenue',
      value: `₹${(dashboardData?.overview?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Average Rating',
      value: dashboardData?.vendor?.rating || '0.0',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800',
      pending_payment: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {dashboardData?.vendor?.companyName}!
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your business today.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <span className="text-lg font-semibold">
              {dashboardData?.vendor?.rating || '0.0'}
            </span>
            <span className="text-gray-500">
              ({dashboardData?.vendor?.ratingCount || 0} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
            <Link
              to="/vendor/bookings"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View all
            </Link>
          </div>

          <div className="space-y-4">
            {recentBookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No recent bookings</p>
              </div>
            ) : (
              recentBookings.map((booking) => (
                <div key={booking._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {booking.vehicle?.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {booking.customer?.name} • {new Date(booking.pickup.datetime).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status.replace('_', ' ')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-1 gap-4">
            <Link
              to="/vendor/vehicles"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <Car className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Manage Vehicles</p>
                <p className="text-sm text-gray-600">Add, edit, or remove vehicles</p>
              </div>
            </Link>

            <Link
              to="/vendor/bookings"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <Calendar className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">View Bookings</p>
                <p className="text-sm text-gray-600">Manage all bookings</p>
              </div>
            </Link>

            <Link
              to="/vendor/profile"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <Users className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Vendor Profile</p>
                <p className="text-sm text-gray-600">Update business information</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* KYC Status Alert */}
      {dashboardData?.vendor?.kycStatus !== 'verified' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-400 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                KYC Verification Required
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                Complete your KYC verification to access all vendor features and receive payments.
              </p>
              <Link
                to="/vendor/profile"
                className="inline-block mt-2 text-sm font-medium text-yellow-800 hover:text-yellow-900"
              >
                Complete KYC →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;