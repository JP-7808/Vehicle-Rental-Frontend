// src/pages/customer/VehicleSearch.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, MapPin, Star, Car, Bike, Truck, Bus } from 'lucide-react';
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
    minPrice: '',
    maxPrice: '',
    transmission: '',
    fuelType: '',
    seats: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  const vehicleTypes = [
    { value: 'car', label: 'Car', icon: Car },
    { value: 'bike', label: 'Bike', icon: Bike },
    { value: 'bicycle', label: 'Bicycle', icon: Bike }, // Using Bike icon for bicycle
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
  }, [searchParams, pagination.page]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      // Add search params
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
        total: paginationData.total,
        pages: paginationData.pages,
      }));
    } catch (error) {
      console.error('Error fetching vehicles:', error);
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
    setPagination(prev => ({ ...prev, page: 1 }));
    
    // Update URL search params
    const newSearchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) newSearchParams.append(key, value);
    });
    setSearchParams(newSearchParams);
    
    fetchVehicles();
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
    setSearchParams(new URLSearchParams());
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
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
              {!loading && (
                <p className="text-gray-600 mt-1">
                  {pagination.total} vehicles found
                </p>
              )}
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden btn-secondary flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
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

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 border rounded-md text-sm font-medium ${
                        page === pagination.page
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
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
      {/* Make the entire image area clickable */}
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

        {/* Add a dedicated View Details button */}
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