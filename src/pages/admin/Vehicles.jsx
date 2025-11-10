// src/pages/admin/Vehicles.jsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, Car, Star, MapPin, Eye, MoreVertical, CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/admin/vehicles');
      setVehicles(response.data.data.vehicles || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      // Mock data for development
      const mockVehicles = [
        {
          _id: '1',
          title: 'Toyota Innova Crysta',
          vehicleType: 'car',
          make: 'Toyota',
          model: 'Innova Crysta',
          year: 2023,
          pricing: { baseDaily: 2500, depositAmount: 5000 },
          vendor: { companyName: 'City Cars Rental' },
          locations: [{ city: 'Bangalore' }],
          isActive: true,
          images: ['/placeholder-vehicle.jpg'],
          createdAt: '2024-01-15'
        },
        {
          _id: '2',
          title: 'Royal Enfield Classic 350',
          vehicleType: 'bike',
          make: 'Royal Enfield',
          model: 'Classic 350',
          year: 2024,
          pricing: { baseDaily: 800, depositAmount: 2000 },
          vendor: { companyName: 'Premium Bikes' },
          locations: [{ city: 'Mumbai' }],
          isActive: true,
          images: ['/placeholder-vehicle.jpg'],
          createdAt: '2024-02-01'
        },
      ];
      setVehicles(mockVehicles);
    } finally {
      setLoading(false);
    }
  };

  const toggleVehicleStatus = async (vehicleId, currentStatus) => {
    try {
      await api.patch(`/admin/vehicles/${vehicleId}`, {
        isActive: !currentStatus
      });
      fetchVehicles();
    } catch (error) {
      console.error('Error updating vehicle status:', error);
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.vendor.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && vehicle.isActive) ||
                         (statusFilter === 'inactive' && !vehicle.isActive);
    const matchesType = typeFilter === 'all' || vehicle.vehicleType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getVehicleTypeColor = (type) => {
    const colors = {
      car: 'bg-blue-100 text-blue-800',
      bike: 'bg-green-100 text-green-800',
      bicycle: 'bg-purple-100 text-purple-800',
      bus: 'bg-orange-100 text-orange-800',
      truck: 'bg-red-100 text-red-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const VehicleCard = ({ vehicle }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
        <img
          src={vehicle.images[0] || '/placeholder-vehicle.jpg'}
          alt={vehicle.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 flex space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getVehicleTypeColor(vehicle.vehicleType)}`}>
            {vehicle.vehicleType}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            vehicle.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {vehicle.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {vehicle.title}
          </h3>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{vehicle.locations[0]?.city}</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-600">
            By {vehicle.vendor.companyName}
          </div>
          <div className="text-lg font-bold text-blue-600">
            ₹{vehicle.pricing.baseDaily}
            <span className="text-sm font-normal text-gray-600">/day</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
          <div>
            <span className="font-medium">Make:</span> {vehicle.make}
          </div>
          <div>
            <span className="font-medium">Model:</span> {vehicle.model}
          </div>
          <div>
            <span className="font-medium">Year:</span> {vehicle.year}
          </div>
          <div>
            <span className="font-medium">Deposit:</span> ₹{vehicle.pricing.depositAmount}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <span className="text-sm text-gray-500">
            Added {new Date(vehicle.createdAt).toLocaleDateString()}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => toggleVehicleStatus(vehicle._id, vehicle.isActive)}
              className={`text-sm px-3 py-1 rounded ${
                vehicle.isActive
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {vehicle.isActive ? 'Deactivate' : 'Activate'}
            </button>
            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
              <Eye className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

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
          <h1 className="text-2xl font-bold text-gray-900">Vehicles Management</h1>
          <p className="text-gray-600 mt-1">Manage all vehicles in the system</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
            <div className="flex items-center space-x-2">
              <Car className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                {vehicles.length} Total Vehicles
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="car">Car</option>
            <option value="bike">Bike</option>
            <option value="bicycle">Bicycle</option>
            <option value="bus">Bus</option>
            <option value="truck">Truck</option>
          </select>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <VehicleCard key={vehicle._id} vehicle={vehicle} />
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default Vehicles;