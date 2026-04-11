import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';

const AdminServicesList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/services');
      
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }

      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
      alert('Error loading services');
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/services/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Failed to delete service');
        }

        setServices(services.filter(s => s._id !== id));
        alert('✅ Service deleted successfully!');
      } catch (error) {
        alert('❌ Error deleting service: ' + error.message);
      }
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      const service = services.find(s => s._id === id);

      const response = await fetch(`http://localhost:5000/api/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...service, status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      setServices(services.map(s =>
        s._id === id ? { ...s, status: newStatus } : s
      ));

    } catch (error) {
      alert('❌ Error updating status: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className='ml-64 p-8 bg-gray-50 min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4'></div>
          <p className='text-xl text-gray-600'>Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='ml-64 p-8 bg-gray-50 min-h-screen'>
      {/* Header */}
      <div className='flex justify-between items-center mb-8'>
        <h2 className='text-3xl font-bold text-gray-800'>Services Management</h2>
        <Link
          to='/admin/services/add'
          className='bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg font-bold transition'
        >
          + Add Service
        </Link>
      </div>

      {/* Search Bar */}
      <div className='mb-6'>
        <input
          type='text'
          placeholder='Search services by name...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
        />
      </div>

      {/* Stats */}
      <div className='grid grid-cols-4 gap-4 mb-8'>
        <div className='bg-white p-4 rounded-lg shadow'>
          <p className='text-gray-600 text-sm font-semibold'>Total Services</p>
          <p className='text-3xl font-bold text-primary mt-2'>{services.length}</p>
        </div>
        <div className='bg-white p-4 rounded-lg shadow'>
          <p className='text-gray-600 text-sm font-semibold'>Active</p>
          <p className='text-3xl font-bold text-green-600 mt-2'>{services.filter(s => s.status === 'Active').length}</p>
        </div>
        <div className='bg-white p-4 rounded-lg shadow'>
          <p className='text-gray-600 text-sm font-semibold'>Inactive</p>
          <p className='text-3xl font-bold text-red-600 mt-2'>{services.filter(s => s.status === 'Inactive').length}</p>
        </div>
        <div className='bg-white p-4 rounded-lg shadow'>
          <p className='text-gray-600 text-sm font-semibold'>Total Features</p>
          <p className='text-3xl font-bold text-blue-600 mt-2'>{services.reduce((sum, s) => sum + (s.features?.length || 0), 0)}</p>
        </div>
      </div>

      {/* Table */}
      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        <table className='w-full'>
          <thead className='bg-primary text-white'>
            <tr>
              <th className='px-6 py-4 text-left'>Icon</th>
              <th className='px-6 py-4 text-left'>Service Name</th>
              <th className='px-6 py-4 text-left'>Description</th>
              <th className='px-6 py-4 text-left'>Features</th>
              <th className='px-6 py-4 text-left'>Status</th>
              <th className='px-6 py-4 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <tr key={service._id} className='border-b hover:bg-gray-50 transition'>
                  <td className='px-6 py-4 text-2xl'>{service.icon}</td>
                  <td className='px-6 py-4 font-semibold text-gray-800'>{service.title}</td>
                  <td className='px-6 py-4 text-gray-600 text-sm truncate max-w-xs'>{service.description}</td>
                  <td className='px-6 py-4 text-gray-600'>{service.features?.length || 0} items</td>
                  <td className='px-6 py-4'>
                    <button
                      onClick={() => handleStatusToggle(service._id, service.status)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                        service.status === 'Active'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {service.status === 'Active' ? '🟢 Active' : '🔴 Inactive'}
                    </button>
                  </td>
                  <td className='px-6 py-4 text-center space-x-2'>
                    <Link
                      to={`/admin/services/edit/${service._id}`}
                      className='bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition inline-block'
                    >
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(service._id)}
                      className='bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition'
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='6' className='px-6 py-8 text-center text-gray-600'>
                  <p className='text-lg font-semibold'>No services found</p>
                  <p className='text-sm mt-2'>Try a different search or add a new service</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminServicesList;