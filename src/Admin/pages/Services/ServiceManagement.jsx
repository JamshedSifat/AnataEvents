import React, { useState, useEffect } from 'react';

import { toast } from 'react-toastify';
import ServiceForm from '../../Components/ServiceForm';
import ServiceTable from '../../Components/ServiceTable';

export default function ServiceManagement() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load services from localStorage on mount
  useEffect(() => {
    loadServices();
  }, []);

  // Load services from localStorage
  const loadServices = () => {
    try {
      const savedServices = localStorage.getItem('services');
      if (savedServices) {
        setServices(JSON.parse(savedServices));
        console.log('Services loaded from localStorage');
      } else {
        // Initialize with sample data if empty
        const sampleServices = [
          {
            _id: '1',
            icon: '🎯',
            title: 'Event Management',
            description: 'Professional event planning and organization services',
            features: ['Theme planning', 'Venue decoration', 'Vendor coordination'],
            lightGradient: 'from-red-500 to-pink-500',
            darkGradient: 'from-purple-500 to-pink-500',
            status: 'active'
          },
          {
            _id: '2',
            icon: '💍',
            title: 'Wedding Planning',
            description: 'Dream wedding organizers with complete services',
            features: ['Venue selection', 'Decor design', 'Catering management'],
            lightGradient: 'from-rose-500 to-red-600',
            darkGradient: 'from-pink-600 to-indigo-600',
            status: 'active'
          }
        ];
        setServices(sampleServices);
        localStorage.setItem('services', JSON.stringify(sampleServices));
      }
    } catch (error) {
      console.error('Error loading services:', error);
      toast.error('Failed to load services');
    }
  };

  // Save services to localStorage
  const saveServicesToStorage = (updatedServices) => {
    try {
      localStorage.setItem('services', JSON.stringify(updatedServices));
      console.log('Services saved to localStorage:', updatedServices);
    } catch (error) {
      console.error('Error saving services:', error);
      toast.error('Failed to save services');
    }
  };

  // Create new service
  const handleCreateService = async (serviceData) => {
    try {
      setLoading(true);
      
      // Generate unique ID
      const newService = {
        ...serviceData,
        _id: Date.now().toString()
      };

      const updatedServices = [...services, newService];
      setServices(updatedServices);
      saveServicesToStorage(updatedServices);
      
      toast.success('Service created successfully!');
      setIsModalOpen(false);
      
      console.log('Service created:', newService);
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error('Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  // Update existing service
  const handleUpdateService = async (id, serviceData) => {
    try {
      setLoading(true);
      
      const updatedServices = services.map(service =>
        service._id === id ? { ...serviceData, _id: id } : service
      );
      
      setServices(updatedServices);
      saveServicesToStorage(updatedServices);
      
      toast.success('Service updated successfully!');
      setSelectedService(null);
      
      console.log('Service updated:', id, serviceData);
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Failed to update service');
    } finally {
      setLoading(false);
    }
  };

  // Delete service
  const handleDeleteService = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        setLoading(true);
        
        const updatedServices = services.filter(service => service._id !== id);
        setServices(updatedServices);
        saveServicesToStorage(updatedServices);
        
        toast.success('Service deleted successfully!');
        
        console.log('Service deleted:', id);
      } catch (error) {
        console.error('Error deleting service:', error);
        toast.error('Failed to delete service');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-base-content">Service Management</h1>
          <p className="text-base-content/60 mt-2">Total Services: {services.length}</p>
        </div>
        <button
          onClick={() => {
            setSelectedService(null);
            setIsModalOpen(true);
          }}
          className="btn btn-primary gap-2"
          disabled={loading}
        >
          <span>+</span>
          Add New Service
        </button>
      </div>

      {/* Service Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 sticky top-0 bg-base-100 border-b border-base-300 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Add New Service</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-ghost btn-sm btn-circle"
                disabled={loading}
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <ServiceForm
                onSubmit={handleCreateService}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 sticky top-0 bg-base-100 border-b border-base-300 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Edit Service</h2>
              <button
                onClick={() => setSelectedService(null)}
                className="btn btn-ghost btn-sm btn-circle"
                disabled={loading}
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <ServiceForm
                service={selectedService}
                onSubmit={(data) =>
                  handleUpdateService(selectedService._id, data)
                }
                onCancel={() => setSelectedService(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Services Table */}
      <div className="card bg-base-100 shadow-lg border border-base-300">
        {loading ? (
          <div className="card-body flex items-center justify-center py-12">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : services.length > 0 ? (
          <ServiceTable
            services={services}
            onEdit={setSelectedService}
            onDelete={handleDeleteService}
          />
        ) : (
          <div className="card-body text-center py-12">
            <p className="text-base-content/60 text-lg">No services found</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary mt-4"
            >
              Create First Service
            </button>
          </div>
        )}
      </div>

      {/* Storage Info */}
      <div className="alert alert-info mt-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span>Data is stored in your browser's localStorage. It will persist across sessions.</span>
      </div>
    </div>
  );
}