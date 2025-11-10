// src/pages/admin/AdminVehicles.jsx
import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Plus, Edit, Trash2, Eye, 
  Car, MapPin, Users, DollarSign, Calendar 
} from 'lucide-react';
import { getVehiclesWithFilter, updateVehicleStatus, deleteVehicle } from '../../services/adminApi';

const VehicleCard = ({ vehicle, onEdit, onView, onStatusChange, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Vehicle Image */}
      <div className="h-48 bg-gray-200 relative">
        {vehicle.images && vehicle.images.length > 0 ? (
          <img
            src={vehicle.images[0]}
            alt={vehicle.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Car className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            vehicle.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {vehicle.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Vehicle Details */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{vehicle.title}</h3>
        
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>{vehicle.locations?.[0]?.city || 'No location'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>{vehicle.seats} seats • {vehicle.transmission}</span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span className="font-semibold text-green-600">
              ₹{vehicle.pricing?.baseDaily}/day
            </span>
          </div>
        </div>

        {/* Vendor Info */}
        <div className="border-t pt-3">
          <p className="text-xs text-gray-500">
            Vendor: {vehicle.vendor?.companyName || 'System'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => onView(vehicle._id)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Details
          </button>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(vehicle._id)}
              className="p-1 text-gray-600 hover:text-green-600"
              title="Edit Vehicle"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onStatusChange(vehicle._id, !vehicle.isActive)}
              className={`p-1 ${
                vehicle.isActive 
                  ? 'text-red-600 hover:text-red-800' 
                  : 'text-green-600 hover:text-green-800'
              }`}
              title={vehicle.isActive ? 'Deactivate' : 'Activate'}
            >
              {vehicle.isActive ? 'Deactivate' : 'Activate'}
            </button>
            <button
              onClick={() => onDelete(vehicle._id)}
              className="p-1 text-gray-600 hover:text-red-600"
              title="Delete Vehicle"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    vehicleType: '',
    city: '',
    status: 'all'
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const params = {
        search: filters.search || undefined,
        vehicleType: filters.vehicleType || undefined,
        city: filters.city || undefined,
        status: filters.status !== 'all' ? filters.status : undefined
      };
      const response = await getVehiclesWithFilter(params);
      setVehicles(response.data.data.vehicles || []);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (vehicleId, isActive) => {
    try {
      await updateVehicleStatus(vehicleId, { isActive });
      fetchVehicles(); // Refresh the list
    } catch (error) {
      console.error('Failed to update vehicle status:', error);
    }
  };

  const handleDelete = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await deleteVehicle(vehicleId, { hardDelete: false });
        fetchVehicles(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete vehicle:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Vehicle Management</h1>
              <p className="text-gray-600 mt-2">Manage all vehicles in the system</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Vehicle</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filters.vehicleType}
              onChange={(e) => setFilters({ ...filters, vehicleType: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="car">Car</option>
              <option value="bike">Bike</option>
              <option value="bicycle">Bicycle</option>
              <option value="bus">Bus</option>
              <option value="truck">Truck</option>
            </select>
            <input
              type="text"
              placeholder="City"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              onClick={fetchVehicles}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Apply</span>
            </button>
          </div>
        </div>

        {/* Vehicles Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle._id}
                vehicle={vehicle}
                onEdit={(id) => console.log('Edit vehicle:', id)}
                onView={(id) => console.log('View vehicle:', id)}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {!loading && vehicles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Car className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}