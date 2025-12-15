// src/pages/customer/VehicleSearch.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  MapPin,
  Star,
  Car,
  Bike,
  Truck,
  Bus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const VehicleSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    vehicleType: searchParams.get('vehicleType') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    transmission: searchParams.get('transmission') || '',
    fuelType: searchParams.get('fuelType') || '',
    seats: searchParams.get('seats') || '',
  });

  // City autocomplete states
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);

  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: parseInt(searchParams.get('page')) || 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  const vehicleTypes = [
    { value: 'car', label: 'Car', icon: Car },
    { value: 'bike', label: 'Bike', icon: Bike },
    { value: 'bicycle', label: 'Bicycle', icon: Bike },
    { value: 'bus', label: 'Bus', icon: Bus },
    { value: 'truck', label: 'Truck', icon: Truck },
  ];

  const transmissions = [
    { value: 'manual', label: 'Manual' },
    { value: 'automatic', label: 'Automatic' },
  ];

  const fuelTypes = [
    { value: 'petrol', label: 'Petrol' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'electric', label: 'Electric' },
  ];

  // Debounced city suggestions
  useEffect(() => {
    const fetchCitySuggestions = async () => {
      const query = filters.city.trim();
      if (!query) {
        setCitySuggestions([]);
        setShowCitySuggestions(false);
        return;
      }

      try {
        setCityLoading(true);
        const response = await api.get(`/vehicles/cities?q=${encodeURIComponent(query)}`);
        const cities = response.data.data || [];
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
  }, [filters.city]);

  useEffect(() => {
    fetchVehicles();
  }, [pagination.page, searchParams]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      params.append('page', pagination.page);
      params.append('limit', pagination.limit);

      const response = await api.get(`/vehicles?${params.toString()}`);
      const { vehicles, pagination: paginationData } = response.data.data;

      setVehicles(vehicles);
      setPagination((prev) => ({
        ...prev,
        total: paginationData.total || 0,
        pages: paginationData.pages || 0,
        page: paginationData.page || 1,
      }));
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setVehicles([]);
      setPagination((prev) => ({ ...prev, total: 0, pages: 0 }));
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCitySelect = (city) => {
    setFilters((prev) => ({ ...prev, city }));
    setShowCitySuggestions(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));

    const newSearchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) newSearchParams.append(key, value);
    });
    newSearchParams.set('page', '1');
    setSearchParams(newSearchParams);
  };

  const clearFilters = () => {
    const clearedFilters = {
      city: '',
      startDate: '',
      endDate: '',
      vehicleType: '',
      minPrice: '',
      maxPrice: '',
      transmission: '',
      fuelType: '',
      seats: '',
    };
    setFilters(clearedFilters);
    setCitySuggestions([]);
    setPagination((prev) => ({ ...prev, page: 1 }));
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination((prev) => ({ ...prev, page: newPage }));

      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('page', newPage.toString());
      setSearchParams(newSearchParams);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getDisplayRange = () => {
    const start = (pagination.page - 1) * pagination.limit + 1;
    const end = Math.min(pagination.page * pagination.limit, pagination.total);
    return { start, end };
  };

  const getPageNumbers = () => {
    const pages = [];
    const currentPage = pagination.page;
    const totalPages = pagination.pages;
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) endPage = 4;
      else if (currentPage >= totalPages - 2) startPage = totalPages - 3;

      if (startPage > 2) pages.push('...');
      for (let i = startPage; i <= endPage; i++) pages.push(i);
      if (endPage < totalPages - 1) pages.push('...');
      if (totalPages > 1) pages.push(totalPages);
    }

    return pages;
  };

  const { start, end } = getDisplayRange();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="card p-6 sticky top-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Clear All
              </button>
            </div>

            <form onSubmit={handleSearch} className="space-y-6">
              {/* City with Autocomplete */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  placeholder="Enter city"
                  className="input-field"
                  autoComplete="off"
                />

                {/* Suggestions Dropdown */}
                {showCitySuggestions && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {cityLoading ? (
                      <div className="px-4 py-3 text-center text-gray-500">
                        <LoadingSpinner size="sm" />
                      </div>
                    ) : citySuggestions.length > 0 ? (
                      citySuggestions.map((city, index) => (
                        <div
                          key={index}
                          onMouseDown={() => handleCitySelect(city)}
                          className="px-4 py-3 hover:bg-primary-50 cursor-pointer flex items-center"
                        >
                          <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                          <span className="text-gray-800 truncate">{city}</span>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-center text-gray-500">
                        No cities found
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Vehicle Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type
                </label>
                <select
                  value={filters.vehicleType}
                  onChange={(e) => handleFilterChange('vehicleType', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Types</option>
                  {vehicleTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (per day)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Transmission */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transmission
                </label>
                <select
                  value={filters.transmission}
                  onChange={(e) => handleFilterChange('transmission', e.target.value)}
                  className="input-field"
                >
                  <option value="">Any</option>
                  {transmissions.map((trans) => (
                    <option key={trans.value} value={trans.value}>
                      {trans.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fuel Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuel Type
                </label>
                <select
                  value={filters.fuelType}
                  onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                  className="input-field"
                >
                  <option value="">Any</option>
                  {fuelTypes.map((fuel) => (
                    <option key={fuel.value} value={fuel.value}>
                      {fuel.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Seats */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Seats
                </label>
                <input
                  type="number"
                  min="1"
                  value={filters.seats}
                  onChange={(e) => handleFilterChange('seats', e.target.value)}
                  className="input-field"
                  placeholder="e.g., 4"
                />
              </div>

              <button type="submit" className="w-full btn-primary">
                <Search className="h-4 w-4 mr-2 inline" />
                Apply Filters
              </button>
            </form>
          </div>
        </div>

        {/* Results Section - unchanged from your original code */}
        <div className="lg:w-3/4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Available Vehicles</h1>
              {!loading && pagination.total > 0 && (
                <p className="text-gray-600 mt-1">
                  Showing {start} - {end} of {pagination.total} vehicles
                </p>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden btn-secondary flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {vehicles.map((vehicle) => (
                  <VehicleCard key={vehicle._id} vehicle={vehicle} />
                ))}
              </div>

              {vehicles.length === 0 && (
                <div className="text-center py-12">
                  <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No vehicles found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search criteria or clear filters.
                  </p>
                  <button onClick={clearFilters} className="btn-primary">
                    Clear Filters
                  </button>
                </div>
              )}

              {pagination.pages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                  <div className="text-sm text-gray-700">
                    Page {pagination.page} of {pagination.pages}
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    {getPageNumbers().map((pageNum, index) => (
                      <button
                        key={index}
                        onClick={() => typeof pageNum === 'number' && handlePageChange(pageNum)}
                        disabled={pageNum === '...'}
                        className={`min-w-[40px] px-3 py-2 rounded-lg font-medium transition-colors ${
                          pageNum === pagination.page
                            ? 'bg-primary-600 text-white border-primary-600'
                            : pageNum === '...'
                            ? 'text-gray-500 cursor-default'
                            : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    {pagination.total} total vehicles
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// VehicleCard component remains exactly the same
const VehicleCard = ({ vehicle }) => {
  const VehicleIcon = {
    car: Car,
    bike: Bike,
    bicycle: Bike,
    bus: Bus,
    truck: Truck,
  }[vehicle.vehicleType] || Car;

  return (
    <div className="card overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/vehicles/${vehicle._id}`}>
        <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative cursor-pointer">
          <img
            src={vehicle.images[0] || '/placeholder-vehicle.jpg'}
            alt={vehicle.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2">
            <VehicleIcon className="h-5 w-5 text-white bg-black bg-opacity-50 rounded p-1" />
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/vehicles/${vehicle._id}`} className="hover:text-primary-600 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 mb-2">
            {vehicle.title}
          </h3>
        </Link>

        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">
            {vehicle.locations?.[0]?.city || 'Multiple cities'}
          </span>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
          <span>{vehicle.seats} seats</span>
          <span className="capitalize">{vehicle.transmission}</span>
          <span className="capitalize">{vehicle.fuelType}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">
              {vehicle.vendor?.rating || 'New'}
            </span>
          </div>

          <div className="text-right">
            <div className="text-xl font-bold text-primary-600">
              ₹{vehicle.pricing.baseDaily}
              <span className="text-sm font-normal text-gray-600">/day</span>
            </div>
            {vehicle.pricing.depositAmount > 0 && (
              <div className="text-xs text-gray-500">
                + ₹{vehicle.pricing.depositAmount} deposit
              </div>
            )}
          </div>
        </div>

        <Link
          to={`/vehicles/${vehicle._id}`}
          className="w-full mt-3 btn-primary text-center block py-2 text-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default VehicleSearch;