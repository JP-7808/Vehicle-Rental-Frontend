// src/pages/customer/Home.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Car,
  Shield,
  Star,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  Zap,
  DollarSign,
  Calendar,
  Navigation,
  Sparkles,
  ShieldCheck,
  Car as CarIcon,
  Bike,
  Truck,
  Bus,
  Fuel,
  Settings,
  UserCheck,
  Award,
} from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Home = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    city: '',
    startDate: '',
    endDate: '',
    vehicleType: '',
  });

  // City autocomplete states
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);

  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalVehicles: 0,
    limit: 6,
  });

  const [stats, setStats] = useState({
    totalVehicles: 1250,
    totalBookings: 8900,
    activeUsers: 4560,
    totalVendors: 340,
    totalRevenue: 1250000,
  });

  const [testimonials, setTestimonials] = useState([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonialRef = useRef(null);

  const [trendingDeals, setTrendingDeals] = useState([]);
  const [popularCategories, setPopularCategories] = useState([]);
  const [recentlyAdded, setRecentlyAdded] = useState([]);

  const [popularCities, setPopularCities] = useState([
    { 
      name: 'Delhi', 
      vehicleCount: 245,
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=600&fit=crop&auto=format'
    },
    { 
      name: 'Lucknow', 
      vehicleCount: 189,
      image: 'https://images.unsplash.com/photo-1564569914694-81bdbd8d7bc0?w=800&h=600&fit=crop&auto=format'
    },
    { 
      name: 'Bangalore', 
      vehicleCount: 312,
      image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&h=600&fit=crop&auto=format'
    },
    { 
      name: 'Chennai', 
      vehicleCount: 167,
      image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&h=600&fit=crop&auto=format'
    },
  ]);

  // Initialize with fallback data - NO API CALLS for these
  useEffect(() => {
    // Set fallback stats (no API call needed)
    setStats({
      totalVehicles: 1250,
      totalBookings: 8900,
      activeUsers: 4560,
      totalVendors: 340,
      totalRevenue: 1250000,
    });

    // Set fallback categories (no API call needed)
    setPopularCategories([
      { type: 'car', count: 450, label: 'Cars', icon: CarIcon, color: 'bg-blue-500' },
      { type: 'bike', count: 280, label: 'Bikes', icon: Bike, color: 'bg-green-500' },
      { type: 'bus', count: 45, label: 'Buses', icon: Bus, color: 'bg-purple-500' },
      { type: 'truck', count: 35, label: 'Trucks', icon: Truck, color: 'bg-red-500' },
    ]);

    // Set mock trending deals (no API call needed)
    setTrendingDeals([
      {
        _id: '1',
        title: 'Toyota Innova Crysta',
        images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&h=600&fit=crop'],
        pricing: { baseDaily: 3500, discountPrice: 2800 },
        locations: [{ city: 'Delhi' }],
        vehicleType: 'car'
      },
      {
        _id: '2',
        title: 'Royal Enfield Classic 350',
        images: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&h=600&fit=crop'],
        pricing: { baseDaily: 800, discountPrice: 600 },
        locations: [{ city: 'Bangalore' }],
        vehicleType: 'bike'
      }
    ]);

    // Set mock testimonials (no API call needed)
    setTestimonials([
      {
        _id: 1,
        reviewer: { name: 'Rajesh Kumar', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh' },
        rating: 5,
        comment: 'Excellent service! The car was clean and well-maintained. Pickup and drop was seamless.',
        vehicle: { title: 'Toyota Innova' },
        date: '2 days ago'
      },
      {
        _id: 2,
        reviewer: { name: 'Priya Sharma', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya' },
        rating: 5,
        comment: 'Perfect for our family trip. Affordable pricing and great customer support throughout.',
        vehicle: { title: 'Maruti Swift' },
        date: '1 week ago'
      },
      {
        _id: 3,
        reviewer: { name: 'Amit Patel', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit' },
        rating: 4,
        comment: 'Best bike rental experience! The booking process was smooth and the bike was in top condition.',
        vehicle: { title: 'Royal Enfield' },
        date: '3 days ago'
      },
    ]);

    // Only fetch actual data that's needed
    fetchFeaturedVehicles(1);
    fetchRecentlyAdded();
  }, []);

  // Debounced city suggestions - ONLY this API call is needed
  useEffect(() => {
    const fetchCitySuggestions = async () => {
      const query = searchParams.city.trim();
      if (!query) {
        setCitySuggestions([]);
        setShowCitySuggestions(false);
        return;
      }

      try {
        setCityLoading(true);
        const response = await api.get(`/vehicles/cities?q=${encodeURIComponent(query)}`);
        const cities = response.data?.data || [];
        setCitySuggestions(cities);
        setShowCitySuggestions(true);
      } catch (error) {
        console.error('Error fetching city suggestions:', error);
        setCitySuggestions([]);
      } finally {
        setCityLoading(false);
      }
    };

    const timer = setTimeout(fetchCitySuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchParams.city]);

  const fetchFeaturedVehicles = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        limit: pagination.limit,
        page,
        isActive: true,
        sort: '-createdAt',
      };
      const response = await api.get('/vehicles', { params });
      const data = response.data?.data || {};
      const vehicles = data.vehicles || data || [];
      const total = data.total || vehicles.length;
      const totalPages = data.totalPages || Math.ceil(total / pagination.limit);
      const currentPage = data.currentPage || page;

      setFeaturedVehicles(Array.isArray(vehicles) ? vehicles : []);
      setPagination((prev) => ({
        ...prev,
        currentPage,
        totalPages,
        totalVehicles: total,
      }));
    } catch (error) {
      console.error('Error fetching featured vehicles:', error);
      setFeaturedVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentlyAdded = async () => {
    try {
      const response = await api.get('/vehicles', {
        params: { limit: 4, sort: '-createdAt', isActive: true }
      });
      const vehicles = response.data?.data?.vehicles || response.data?.data || [];
      setRecentlyAdded(Array.isArray(vehicles) ? vehicles : []);
    } catch (error) {
      console.error('Error fetching recently added:', error);
      setRecentlyAdded([]);
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCitySelect = (city) => {
    setSearchParams((prev) => ({ ...prev, city: city }));
    setShowCitySuggestions(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    navigate(`/search?${params.toString()}`);
  };

  const handleCityClick = (cityName) => {
    navigate(`/search?city=${encodeURIComponent(cityName)}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchFeaturedVehicles(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const nextTestimonial = () => {
    if (testimonials.length > 0) {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }
  };

  const prevTestimonial = () => {
    if (testimonials.length > 0) {
      setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=600&fit=crop&auto=format';
  };

  const features = [
    {
      icon: ShieldCheck,
      title: 'Verified & Insured',
      description: 'All vehicles are thoroughly verified and come with insurance coverage',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Zap,
      title: 'Instant Booking',
      description: 'Book your vehicle in minutes with our seamless booking process',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: DollarSign,
      title: 'Best Price Guarantee',
      description: 'We guarantee the best prices with no hidden charges',
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      icon: Clock,
      title: '24/7 Roadside Assistance',
      description: 'Round-the-clock support for any emergencies on the road',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: UserCheck,
      title: 'Trusted Vendors',
      description: 'All vendors are verified with proper documentation',
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      icon: Award,
      title: 'Award Winning Service',
      description: 'Recognized as the best rental service provider 2024',
      color: 'bg-red-100 text-red-600',
    },
  ];

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-10 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-overlay filter blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <Sparkles className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Trusted by {stats.activeUsers.toLocaleString()}+ Customers</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Get Your Car On
                <span className="block text-primary-200">Your Fingure Tips</span>
                <span className="block text-primary-200">Book. Drive. Repeat</span>
              </h1>
              
              <p className="text-lg md:text-xl mb-8 text-primary-100 max-w-2xl leading-relaxed">
                👉Explore thousands of vehicles across India with flexible booking options and premium customer service
              </p>

              {/* Quick Stats - Using fallback data */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold">{stats.totalVehicles.toLocaleString()}+</div>
                  <div className="text-sm text-primary-200">Vehicles</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold">{stats.totalBookings.toLocaleString()}+</div>
                  <div className="text-sm text-primary-200">Bookings</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold">{stats.totalVendors.toLocaleString()}+</div>
                  <div className="text-sm text-primary-200">Vendors</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold">
                    {formatCurrency(stats.totalRevenue)}
                  </div>
                  <div className="text-sm text-primary-200">Processed</div>
                </div>
              </div>
            </div>

            {/* Search Form Card */}
            <div className="lg:w-1/2 w-full max-w-2xl">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl">
                <h3 className="text-2xl font-bold mb-6 text-white">Find Your Vehicle</h3>
                <form onSubmit={handleSearchSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* City Input */}
                    <div className="relative md:col-span-2">
                      <label className="block text-sm font-medium text-primary-100 mb-2 flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        Pickup City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={searchParams.city}
                        onChange={handleSearchChange}
                        placeholder="Enter city (e.g., Delhi, Mumbai)"
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-white/60 outline-none focus:outline-none"
                        autoComplete="off"
                      />
                      
                      {/* Suggestions Dropdown */}
                      {showCitySuggestions && (
                        <div className="absolute z-50 w-full mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl max-h-60 overflow-auto">
                          {cityLoading ? (
                            <div className="px-4 py-3 text-center text-white">
                              <LoadingSpinner size="sm" />
                            </div>
                          ) : citySuggestions.length > 0 ? (
                            citySuggestions.map((city, index) => (
                              <div
                                key={index}
                                onMouseDown={() => handleCitySelect(city)}
                                className="px-4 py-3 hover:bg-white/10 cursor-pointer flex items-center border-b border-white/5 last:border-0"
                              >
                                <MapPin className="h-4 w-4 text-primary-300 mr-3 flex-shrink-0" />
                                <span className="text-white">{city}</span>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-center text-white/60">
                              No cities found
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Vehicle Type */}
                    {/* Vehicle Type */}
                    <div>
                      <label className="block text-sm font-medium text-primary-100 mb-2 flex items-center">
                        <Car className="h-4 w-4 mr-2" />
                        Vehicle Type
                      </label>
                      <select
                        name="vehicleType"
                        value={searchParams.vehicleType}
                        onChange={handleSearchChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:ring-2 focus:ring-white focus:border-transparent text-white outline-none focus:outline-none"
                      >
                        <option value="" className="bg-gray-900 text-white">All Types</option>
                        <option value="car" className="bg-gray-900 text-white">🚗 Cars</option>
                        {/* <option value="bike" className="bg-gray-900 text-white">🏍️ Bikes</option>
                        <option value="bus" className="bg-gray-900 text-white">🚌 Buses</option>
                        <option value="truck" className="bg-gray-900 text-white">🚛 Trucks</option> */}
                      </select>
                    </div>

                    
                    {/* Pickup Date */}
                    <div>
                      <label className="block text-sm font-medium text-primary-100 mb-2 flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Pickup Date
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={searchParams.startDate}
                        onChange={handleSearchChange}
                        min={today}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:ring-2 focus:ring-white focus:border-transparent text-white outline-none focus:outline-none"
                      />
                    </div>

                    {/* Return Date */}
                    <div>
                      <label className="block text-sm font-medium text-primary-100 mb-2 flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Return Date
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={searchParams.endDate}
                        onChange={handleSearchChange}
                        min={searchParams.startDate || today}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:ring-2 focus:ring-white focus:border-transparent text-white outline-none focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-white text-primary-700 hover:bg-primary-50 font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-3 text-lg shadow-lg hover:shadow-xl"
                  >
                    <Search className="h-5 w-5" />
                    <span>Search Available Vehicles</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cities Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Popular Cities</h2>
            <p className="text-gray-600 mt-2">Discover vehicles in your favorite cities</p>
          </div>
          <Link to="/search" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
            View All <ChevronRight className="h-5 w-5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularCities.map((city, index) => (
            <button
              key={index}
              onClick={() => handleCityClick(city.name)}
              className="relative rounded-2xl overflow-hidden group h-64 hover:shadow-2xl transition-all duration-300"
            >
              <div className="absolute inset-0">
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{city.name}</h3>
                    <p className="text-sm text-white/90">{city.vehicleCount}+ Vehicles Available</p>
                  </div>
                  <Navigation className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1" />
                </div>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </button>
          ))}
        </div>
      </section>

      {/* Recently Added Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Recently Added</h2>
              <p className="text-gray-600 mt-2">Check out our latest additions to the fleet</p>
            </div>
            <Link to="/search?sort=newest" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
              View All <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>

          {recentlyAdded.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentlyAdded.slice(0, 4).map((vehicle) => (
                <Link
                  key={vehicle._id}
                  to={`/vehicles/${vehicle._id}`}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-primary-300"
                >
                  <div className="relative">
                    <img
                      src={vehicle.images?.[0] || '/placeholder-vehicle.jpg'}
                      alt={vehicle.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={handleImageError}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded shadow">
                        NEW
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1 truncate">{vehicle.title || 'Vehicle'}</h3>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                      <span className="truncate">{vehicle.locations?.[0]?.city || 'Multiple cities'}</span>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-lg font-bold text-primary-600">
                        ₹{vehicle.pricing?.baseDaily || 'N/A'}
                        <span className="text-sm font-normal text-gray-600"> /day</span>
                      </div>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded capitalize">
                        {vehicle.vehicleType || 'vehicle'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No recent vehicles added yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-primary-600">RentWheels</span>?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience seamless vehicle rental with premium services and customer-centric approach
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl border border-gray-200 hover:border-primary-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
            >
              <div className={`inline-flex rounded-2xl p-3 ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Vehicles</h2>
            {!loading && (
              <p className="text-gray-600 mt-2">
                Handpicked selection of premium vehicles just for you
              </p>
            )}
          </div>
          <div className="flex gap-4">
            <Link to="/search" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium flex items-center transition-colors">
              Explore All <ChevronRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : featuredVehicles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {featuredVehicles.map((vehicle) => (
                <div
                  key={vehicle._id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-primary-300"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={vehicle.images?.[0] || '/placeholder-vehicle.jpg'}
                      alt={vehicle.title}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={handleImageError}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-primary-600 text-white text-sm font-medium rounded-full shadow">
                        Featured
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="px-2 py-1 bg-white/90 text-gray-700 text-xs font-medium rounded capitalize">
                        {vehicle.vehicleType || 'vehicle'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{vehicle.title || 'Vehicle'}</h3>
                      <div className="flex items-center text-gray-600 text-sm mb-3">
                        <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                        <span className="line-clamp-1">{vehicle.locations?.[0]?.city || 'Multiple cities'}</span>
                      </div>
                      
                      {/* Vehicle Details */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center text-gray-600">
                          <Settings className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-sm">{vehicle.transmission || 'Manual'}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Fuel className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-sm">{vehicle.fuelType || 'Petrol'}</span>
                        </div>
                        {vehicle.seats && (
                          <div className="flex items-center text-gray-600">
                            <Users className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="text-sm">{vehicle.seats} Seats</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div>
                        <div className="text-xl font-bold text-primary-600">
                          ₹{vehicle.pricing?.baseDaily || 'N/A'}
                          <span className="text-sm font-normal text-gray-600"> /day</span>
                        </div>
                        {vehicle.pricing?.weeklyDiscountPercent > 0 && (
                          <div className="text-xs text-green-600">
                            Save {vehicle.pricing.weeklyDiscountPercent}% on weekly rental
                          </div>
                        )}
                      </div>
                      <Link
                        to={`/vehicles/${vehicle._id}`}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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
                    className={`px-3 py-2 rounded-lg font-medium min-w-[40px] transition-colors ${
                      pagination.currentPage === pageNum
                        ? 'bg-primary-600 text-white shadow'
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
        ) : (
          <div className="text-center py-20 bg-gradient-to-b from-gray-50 to-white rounded-3xl">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No vehicles available</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              We're adding new vehicles to our fleet. Check back soon for exciting options!
            </p>
            <Link to="/search" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Browse All Vehicles
            </Link>
          </div>
        )}
      </section>

      {/* Testimonials Section - Using mock data */}
      <section className="bg-gradient-to-r from-primary-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust RentWheels for their travel needs
            </p>
          </div>

          <div className="relative" ref={testimonialRef}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 3).map((testimonial, index) => (
                <div
                  key={testimonial._id || index}
                  className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transition-all duration-300 ${
                    index === activeTestimonial ? 'transform scale-105' : ''
                  }`}
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.reviewer?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.reviewer?.name || 'User'}`}
                      alt={testimonial.reviewer?.name}
                      className="w-12 h-12 rounded-full mr-4 border-2 border-primary-100"
                      onError={handleImageError}
                    />
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.reviewer?.name || 'Customer'}</h4>
                      <p className="text-gray-600 text-sm">{testimonial.vehicle?.title || 'Vehicle'}</p>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < (testimonial.rating || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 italic leading-relaxed">"{testimonial.comment || 'Great service!'}"</p>
                  {testimonial.date && (
                    <div className="mt-4 text-sm text-gray-500">{testimonial.date}</div>
                  )}
                </div>
              ))}
            </div>
            
            {testimonials.length > 3 && (
              <div className="flex justify-center space-x-3 mt-8">
                <button
                  onClick={prevTestimonial}
                  className="p-3 rounded-full bg-white shadow hover:shadow-md transition-shadow hover:bg-gray-50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="p-3 rounded-full bg-white shadow hover:shadow-md transition-shadow hover:bg-gray-50"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="px-8 py-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-primary-100 max-w-2xl mx-auto mb-8">
              Join thousands of happy customers who have found their perfect ride with RentWheels
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/search"
                className="bg-white text-primary-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 shadow-lg"
              >
                <Car className="h-5 w-5" />
                <span>Book Your First Ride</span>
              </Link>
              <Link
                to="/register"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;