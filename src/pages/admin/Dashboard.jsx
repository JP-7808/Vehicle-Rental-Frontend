// src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Building, 
  Car, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data.data);
      
      // Mock recent activity
      const mockActivity = [
        { type: 'user', message: 'New user registered: John Doe', time: '2 minutes ago', status: 'success' },
        { type: 'vendor', message: 'Vendor "City Cars" needs KYC verification', time: '5 minutes ago', status: 'warning' },
        { type: 'booking', message: 'New booking #BOOK_12345 created', time: '10 minutes ago', status: 'success' },
        { type: 'payment', message: 'Payment failed for booking #BOOK_12344', time: '15 minutes ago', status: 'error' },
      ];
      setRecentActivity(mockActivity);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, change, color = 'blue' }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change && (
              <p className={`ml-2 text-sm font-medium ${
                change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {change}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const getStatusIcon = (status) => {
      switch (status) {
        case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
        case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
        case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
        default: return <CheckCircle className="h-4 w-4 text-gray-500" />;
      }
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'success': return 'text-green-800 bg-green-100';
        case 'warning': return 'text-yellow-800 bg-yellow-100';
        case 'error': return 'text-red-800 bg-red-100';
        default: return 'text-gray-800 bg-gray-100';
      }
    };

    return (
      <div className="flex items-start space-x-3 p-4 hover:bg-gray-50 rounded-lg transition-colors">
        <div className="flex-shrink-0">
          {getStatusIcon(activity.status)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">
            {activity.message}
          </p>
          <p className="text-sm text-gray-500">{activity.time}</p>
        </div>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
          {activity.status}
        </span>
      </div>
    );
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to your admin dashboard</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Export Report
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || '1,247'}
          icon={Users}
          change="+12%"
          color="blue"
        />
        <StatCard
          title="Total Vendors"
          value={stats?.totalVendors || '89'}
          icon={Building}
          change="+5%"
          color="green"
        />
        <StatCard
          title="Total Vehicles"
          value={stats?.totalVehicles || '456'}
          icon={Car}
          change="+8%"
          color="purple"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${(stats?.totalRevenue || 1256000).toLocaleString()}`}
          icon={DollarSign}
          change="+15.2%"
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivity.map((activity, index) => (
              <ActivityItem key={index} activity={activity} />
            ))}
          </div>
          <div className="px-6 py-4 border-t border-gray-200">
            <Link
              to="/admin/activity"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View all activity →
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Platform Overview</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending KYC Verifications</span>
                <span className="font-semibold text-yellow-600">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Bookings</span>
                <span className="font-semibold text-blue-600">45</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Support Tickets</span>
                <span className="font-semibold text-red-600">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Refund Requests</span>
                <span className="font-semibold text-purple-600">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">System Health</span>
                <span className="font-semibold text-green-600">Excellent</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/users"
              className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
            >
              <Users className="h-8 w-8 text-gray-400 group-hover:text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                Manage Users
              </span>
            </Link>
            <Link
              to="/admin/vendors"
              className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group"
            >
              <Building className="h-8 w-8 text-gray-400 group-hover:text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">
                Verify Vendors
              </span>
            </Link>
            <Link
              to="/admin/bookings"
              className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors group"
            >
              <Calendar className="h-8 w-8 text-gray-400 group-hover:text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700">
                View Bookings
              </span>
            </Link>
            <Link
              to="/admin/payments"
              className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-colors group"
            >
              <DollarSign className="h-8 w-8 text-gray-400 group-hover:text-yellow-600 mb-2" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-yellow-700">
                Payment Reports
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;