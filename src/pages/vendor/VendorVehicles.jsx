// src/pages/vendor/VendorVehicles.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Car, Edit, Trash2, Eye, Filter } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';

const VendorVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/vendors/vehicles');
      setVehicles(response.data.data.vehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setAlert({
        show: true,
        type: 'error',
        message: 'Failed to load vehicles',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    try {
      await api.delete(`/vehicles/${vehicleId}`);
      setAlert({
        show: true,
        type: 'success',
        message: 'Vehicle deleted successfully',
      });
      fetchVehicles(); // Refresh the list
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      setAlert({
        show: true,
        type: 'error',
        message: 'Failed to delete vehicle',
      });
    }
  };

  const handleToggleStatus = async (vehicleId, currentStatus) => {
    try {
      await api.put(`/vehicles/${vehicleId}`, {
        isActive: !currentStatus,
      });
      setAlert({
        show: true,
        type: 'success',
        message: `Vehicle ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
      fetchVehicles(); // Refresh the list
    } catch (error) {
      console.error('Error updating vehicle status:', error);
      setAlert({
        show: true,
        type: 'error',
        message: 'Failed to update vehicle status',
      });
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    if (filter === 'all') return true;
    if (filter === 'active') return vehicle.isActive;
    if (filter === 'inactive') return !vehicle.isActive;
    return true;
  });

  const getStatusColor = (status) => {
    return status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getVehicleTypeIcon = (type) => {
    const icons = {
      car: '🚗',
      bike: '🏍️',
      bicycle: '🚲',
      bus: '🚌',
      truck: '🚚',
    };
    return icons[type] || '🚗';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Vehicles</h1>
          <p className="text-gray-600 mt-1">Manage your vehicle listings</p>
        </div>
        <Link
          to="/vendor/vehicles/add"
          className="mt-4 sm:mt-0 btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Vehicle</span>
        </Link>
      </div>

      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ show: false, type: '', message: '' })}
        />
      )}

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <div className="flex space-x-2">
            {['all', 'active', 'inactive'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
                  filter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status} ({status === 'all' ? vehicles.length : 
                         status === 'active' ? vehicles.filter(v => v.isActive).length :
                         vehicles.filter(v => !v.isActive).length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vehicles Grid */}
      {filteredVehicles.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No vehicles found
          </h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' 
              ? "You haven't added any vehicles yet."
              : `No ${filter} vehicles found.`
            }
          </p>
          {filter === 'all' && (
            <Link to="/vendor/vehicles/add" className="btn-primary">
              Add Your First Vehicle
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle._id} className="bg-white shadow rounded-lg overflow-hidden">
              {/* Vehicle Image */}
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <img
                  src={vehicle.images[0] || '/placeholder-vehicle.jpg'}
                  alt={vehicle.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      vehicle.isActive
                    )}`}
                  >
                    {vehicle.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {vehicle.title}
                  </h3>
                  <span className="text-2xl">
                    {getVehicleTypeIcon(vehicle.vehicleType)}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-3">
                  {vehicle.make} • {vehicle.model} • {vehicle.year}
                </p>

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">Type:</span> {vehicle.vehicleType}
                  </div>
                  <div>
                    <span className="font-medium">Seats:</span> {vehicle.seats}
                  </div>
                  <div>
                    <span className="font-medium">Transmission:</span> {vehicle.transmission}
                  </div>
                  <div>
                    <span className="font-medium">Fuel:</span> {vehicle.fuelType}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-primary-600">
                    ₹{vehicle.pricing.baseDaily}
                    <span className="text-sm font-normal text-gray-600">/day</span>
                  </div>
                  {vehicle.pricing.depositAmount > 0 && (
                    <div className="text-sm text-gray-500">
                      + ₹{vehicle.pricing.depositAmount} deposit
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleToggleStatus(vehicle._id, vehicle.isActive)}
                      className={`text-sm px-3 py-1 rounded ${
                        vehicle.isActive
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {vehicle.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      to={`/vehicles/${vehicle._id}`}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      to={`/vendor/vehicles/edit/${vehicle._id}`}
                      className="p-2 text-blue-400 hover:text-blue-600"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteVehicle(vehicle._id)}
                      className="p-2 text-red-400 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorVehicles;