// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Users, Car, Calendar, DollarSign, TrendingUp, AlertCircle,
  CheckCircle, XCircle, Clock, Eye
} from 'lucide-react';
import { getAdminDashboard, getEnhancedDashboard } from '../../services/adminApi';

const StatCard = ({ title, value, icon: Icon, change, changeType, onClick }) => (
  <div 
    className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change && (
          <p className={`text-sm mt-1 ${
            changeType === 'positive' ? 'text-green-600' : 'text-red-600'
          }`}>
            {change}
          </p>
        )}
      </div>
      <div className="p-3 bg-blue-50 rounded-full">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
    </div>
  </div>
);

const QuickAction = ({ title, description, icon: Icon, action, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow">
    <div className="flex items-start space-x-4">
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  </div>
);

const RecentActivity = ({ activities }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className={`p-2 rounded-full ${
              activity.type === 'booking' ? 'bg-blue-100' : 
              activity.type === 'user' ? 'bg-green-100' : 'bg-purple-100'
            }`}>
              <Eye className="h-4 w-4 text-gray-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
            <p className="text-sm text-gray-600">{activity.description}</p>
            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getEnhancedDashboard();
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = dashboardData?.realTimeMetrics || {};
  const weeklyPerformance = dashboardData?.weeklyPerformance || [];
  const topCities = dashboardData?.topCities || [];

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'View and manage all users',
      icon: Users,
      color: 'bg-blue-500',
      path: '/admin/users'
    },
    {
      title: 'Verify Vendors',
      description: 'Review pending KYC applications',
      icon: CheckCircle,
      color: 'bg-green-500',
      path: '/admin/vendors'
    },
    {
      title: 'View Bookings',
      description: 'Monitor all active bookings',
      icon: Calendar,
      color: 'bg-purple-500',
      path: '/admin/bookings'
    },
    {
      title: 'System Health',
      description: 'Check system status and performance',
      icon: TrendingUp,
      color: 'bg-orange-500',
      path: '/admin/analytics'
    }
  ];

  const recentActivities = [
    {
      title: 'New Booking Created',
      description: 'Booking #BOOK_12345 for Toyota Innova',
      time: '2 minutes ago',
      type: 'booking'
    },
    {
      title: 'User Registration',
      description: 'John Doe registered as customer',
      time: '5 minutes ago',
      type: 'user'
    },
    {
      title: 'Payment Received',
      description: 'Payment of ₹2,500 for booking #BOOK_12344',
      time: '10 minutes ago',
      type: 'payment'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {['today', 'week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers || 0}
            icon={Users}
            change="+12% from last week"
            changeType="positive"
          />
          <StatCard
            title="Active Bookings"
            value={stats.activeBookings || 0}
            icon={Calendar}
            change="+5% from yesterday"
            changeType="positive"
          />
          <StatCard
            title="Today's Revenue"
            value={`₹${(stats.todayRevenue || 0).toLocaleString()}`}
            icon={DollarSign}
            change="+8% from yesterday"
            changeType="positive"
          />
          <StatCard
            title="Pending KYC"
            value={stats.pendingKYC || 0}
            icon={AlertCircle}
            change="3 need attention"
            changeType="negative"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <QuickAction key={index} {...action} />
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <RecentActivity activities={recentActivities} />
          </div>
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Performance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Performance</h2>
            <div className="space-y-3">
              {weeklyPerformance.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Day {day._id}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium">{day.bookings} bookings</span>
                    <span className="text-sm font-medium text-green-600">
                      ₹{day.revenue?.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Cities */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Cities</h2>
            <div className="space-y-3">
              {topCities.map((city, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{city._id}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium">{city.bookings} bookings</span>
                    <span className="text-sm font-medium text-green-600">
                      ₹{city.revenue?.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}