// src/pages/customer/VehicleSearch.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, MapPin, Star, Car, Bike, Truck, Bus, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const VehicleSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchVehicles();
  }, [pagination.page, searchParams]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      // Add all filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      // Add pagination
      params.append('page', pagination.page);
      params.append('limit', pagination.limit);

      const response = await api.get(`/vehicles?${params.toString()}`);
      const { vehicles, pagination: paginationData } = response.data.data;
      
      setVehicles(vehicles);
      setPagination(prev => ({
        ...prev,
        total: paginationData.total || 0,
        pages: paginationData.pages || 0,
        page: paginationData.currentPage || 1,
      }));
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      // Set default values on error
      setPagination(prev => ({
        ...prev,
        total: 0,
        pages: 0,
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const newPage = 1;
    setPagination(prev => ({ ...prev, page: newPage }));
    
    // Update URL search params with all filters and page
    const newSearchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) newSearchParams.append(key, value);
    });
    newSearchParams.append('page', newPage.toString());
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
    setPagination(prev => ({ ...prev, page: 1 }));
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      
      // Update URL with new page
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('page', newPage.toString());
      setSearchParams(newSearchParams);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Calculate display range safely
  const getDisplayRange = () => {
    const start = ((pagination.page - 1) * pagination.limit) + 1;
    const end = Math.min(pagination.page * pagination.limit, pagination.total);
    return { start, end };
  };

  // Generate page numbers for pagination with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const currentPage = pagination.page;
    const totalPages = pagination.pages;
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're at the beginning
      if (currentPage <= 3) {
        endPage = 4;
      }
      // Adjust if we're at the end
      else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push('...');
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
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
              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  placeholder="Enter city"
                  className="input-field"
                />
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
                <Search className="h-4 w-4 mr-2" />
                Apply Filters
              </button>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="lg:w-3/4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Available Vehicles
              </h1>
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
              {/* Vehicle Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {vehicles.map((vehicle) => (
                  <VehicleCard key={vehicle._id} vehicle={vehicle} />
                ))}
              </div>

              {/* No Results */}
              {vehicles.length === 0 && (
                <div className="text-center py-12">
                  <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No vehicles found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search criteria or clear filters.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="btn-primary"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {/* Enhanced Pagination */}
              {pagination.pages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                  <div className="text-sm text-gray-700">
                    Page {pagination.page} of {pagination.pages}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    {/* Page Numbers */}
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

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Next page"
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
        <Link 
          to={`/vehicles/${vehicle._id}`}
          className="hover:text-primary-600 transition-colors"
        >
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