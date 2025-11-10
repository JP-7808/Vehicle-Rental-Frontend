// src/pages/admin/AdminAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, Car, DollarSign, TrendingUp, 
  Calendar, Download, Filter
} from 'lucide-react';
import { 
  getSystemAnalytics, 
  getRevenueAnalytics, 
  getUserAnalytics,
  getBookingTrends 
} from '../../services/adminApi';

const StatCard = ({ title, value, change, changeType, icon: Icon }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
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

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const params = { period: timeRange };
      
      const [analyticsRes, revenueRes, userRes, bookingRes] = await Promise.all([
        getSystemAnalytics(params),
        getRevenueAnalytics(params),
        getUserAnalytics(params),
        getBookingTrends(params)
      ]);

      setAnalytics(analyticsRes.data.data);
      setRevenueData(revenueRes.data.data);
      setUserData(userRes.data.data);
      setBookingData(bookingRes.data.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-2">Comprehensive insights and performance metrics</p>
            </div>
            <div className="flex space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={`₹${(revenueData?.metrics?.currentRevenue || 0).toLocaleString()}`}
            change={`${revenueData?.metrics?.revenueGrowth || 0}% from previous period`}
            changeType={revenueData?.metrics?.revenueGrowth >= 0 ? 'positive' : 'negative'}
            icon={DollarSign}
          />
          <StatCard
            title="Active Users"
            value={(userData?.engagement?.[0]?.activeUsers || 0).toLocaleString()}
            change="+12% from last month"
            changeType="positive"
            icon={Users}
          />
          <StatCard
            title="Total Bookings"
            value={(bookingData?.bookingTrends?.reduce((sum, day) => sum + day.totalBookings, 0) || 0).toLocaleString()}
            change="+8% from last month"
            changeType="positive"
            icon={Car}
          />
          <StatCard
            title="Success Rate"
            value="94.5%"
            change="+2.3% from last month"
            changeType="positive"
            icon={TrendingUp}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart Placeholder */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h2>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                <p>Revenue chart will be displayed here</p>
                <p className="text-sm">(Integrate with Recharts or Chart.js)</p>
              </div>
            </div>
          </div>

          {/* User Growth Chart Placeholder */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h2>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-2" />
                <p>User growth chart will be displayed here</p>
                <p className="text-sm">(Integrate with Recharts or Chart.js)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Status Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Status</h2>
            <div className="space-y-3">
              {analytics?.charts?.bookingStatus?.map((status) => (
                <div key={status._id} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 capitalize">{status._id.replace('_', ' ')}</span>
                  <span className="font-semibold">{status.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle Type Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Types</h2>
            <div className="space-y-3">
              {analytics?.vehiclePerformance?.map((vehicle) => (
                <div key={vehicle._id} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 capitalize">{vehicle._id}</span>
                  <div className="flex space-x-4">
                    <span className="font-semibold">{vehicle.bookings}</span>
                    <span className="text-green-600">₹{vehicle.revenue?.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Cities */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Cities</h2>
            <div className="space-y-3">
              {analytics?.topCities?.map((city) => (
                <div key={city._id} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{city._id}</span>
                  <div className="flex space-x-4">
                    <span className="font-semibold">{city.bookings}</span>
                    <span className="text-green-600">₹{city.revenue?.toLocaleString()}</span>
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