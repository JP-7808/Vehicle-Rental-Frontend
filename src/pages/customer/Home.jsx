// src/pages/customer/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Car, Shield, Star, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Home = () => {
  const [searchParams, setSearchParams] = useState({
    city: '',
    startDate: '',
    endDate: '',
    vehicleType: '',
  });
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalVehicles: 0,
    limit: 6
  });

  useEffect(() => {
    fetchFeaturedVehicles(1);
  }, []);

  const fetchFeaturedVehicles = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/vehicles?limit=${pagination.limit}&page=${page}`);
      const { vehicles, totalPages, currentPage, total } = response.data.data;
      
      setFeaturedVehicles(vehicles);
      setPagination(prev => ({
        ...prev,
        currentPage,
        totalPages,
        totalVehicles: total
      }));
    } catch (error) {
      console.error('Error fetching featured vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Navigate to search page with params
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    window.location.href = `/search?${params.toString()}`;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchFeaturedVehicles(newPage);
    }
  };

  const features = [
    {
      icon: Car,
      title: 'Wide Selection',
      description: 'Choose from cars, bikes, bicycles, buses, and trucks',
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Safe and secure payment processing with Razorpay',
    },
    {
      icon: Star,
      title: 'Verified Vendors',
      description: 'All vendors are verified and rated by customers',
    },
    {
      icon: MapPin,
      title: 'Multiple Cities',
      description: 'Available across multiple cities with easy pickup',
    },
  ];

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Ride
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Rent vehicles across multiple cities with ease
            </p>
            
            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={searchParams.city}
                      onChange={handleSearchChange}
                      placeholder="Enter city"
                      className="input-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={searchParams.startDate}
                      onChange={handleSearchChange}
                      className="input-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={searchParams.endDate}
                      onChange={handleSearchChange}
                      className="input-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Type
                    </label>
                    <select
                      name="vehicleType"
                      value={searchParams.vehicleType}
                      onChange={handleSearchChange}
                      className="input-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                    >
                      <option value="">All Types</option>
                      <option value="car">Car</option>
                      <option value="bike">Bike</option>
                      <option value="bicycle">Bicycle</option>
                      <option value="bus">Bus</option>
                      <option value="truck">Truck</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4">
                  <button
                    type="submit"
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <Search className="h-5 w-5" />
                    <span>Search Vehicles</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose RentWheels?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We provide the best vehicle rental experience with secure payments, 
            verified vendors, and 24/7 customer support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="bg-primary-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Vehicles</h2>
            {!loading && (
              <p className="text-gray-600 mt-2">
                Showing {featuredVehicles.length} of {pagination.totalVehicles} vehicles
              </p>
            )}
          </div>
          <Link
            to="/search"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredVehicles.map((vehicle) => (
                <div key={vehicle._id} className="card overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    <img
                      src={vehicle.images[0] || '/placeholder-vehicle.jpg'}
                      alt={vehicle.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {vehicle.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        {vehicle.locations?.[0]?.city || 'Multiple cities'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-2xl font-bold text-primary-600">
                        ₹{vehicle.pricing.baseDaily}/day
                      </span>
                      <span className="text-sm text-gray-500 capitalize">
                        {vehicle.vehicleType}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">
                          {vehicle.vendor?.rating || 'New'}
                        </span>
                      </div>
                      <Link
                        to={`/vehicles/${vehicle._id}`}
                        className="btn-primary text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      pagination.currentPage === pageNum
                        ? 'bg-primary-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}

        {!loading && featuredVehicles.length === 0 && (
          <div className="text-center py-12">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No vehicles available
            </h3>
            <p className="text-gray-600">
              Check back later for new vehicle listings.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;