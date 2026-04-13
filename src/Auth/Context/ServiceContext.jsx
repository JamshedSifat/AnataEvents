import React, { createContext, useState, useEffect } from 'react';

export const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Load services from localStorage
  useEffect(() => {
    const savedServices = localStorage.getItem('anataServices');
    if (savedServices) {
      setServices(JSON.parse(savedServices));
      setFilteredServices(JSON.parse(savedServices));
    } else {
      // Initial mock data
      const initialServices = [
        {
          id: 1,
          name: 'Corporate Event Management',
          category: 'Corporate',
          description: 'Professional corporate event planning and execution',
          price: 50000,
          image: 'https://via.placeholder.com/300x200?text=Corporate+Event',
          status: 'Active'
        },
        {
          id: 2,
          name: 'Wedding Planning',
          category: 'Wedding',
          description: 'Complete wedding planning and coordination services',
          price: 100000,
          image: 'https://via.placeholder.com/300x200?text=Wedding',
          status: 'Active'
        },
        {
          id: 3,
          name: 'Photography & Videography',
          category: 'Media',
          description: 'Professional photo and video coverage',
          price: 30000,
          image: 'https://via.placeholder.com/300x200?text=Photography',
          status: 'Active'
        }
      ];
      setServices(initialServices);
      setFilteredServices(initialServices);
      localStorage.setItem('anataServices', JSON.stringify(initialServices));
    }
  }, []);

  // Add service
  const addService = (newService) => {
    const service = {
      ...newService,
      id: Date.now()
    };
    const updatedServices = [...services, service];
    setServices(updatedServices);
    setFilteredServices(updatedServices);
    localStorage.setItem('anataServices', JSON.stringify(updatedServices));
    return service;
  };

  // Update service
  const updateService = (id, updatedService) => {
    const updatedServices = services.map(service =>
      service.id === id ? { ...service, ...updatedService } : service
    );
    setServices(updatedServices);
    setFilteredServices(updatedServices);
    localStorage.setItem('anataServices', JSON.stringify(updatedServices));
  };

  // Delete service
  const deleteService = (id) => {
    const updatedServices = services.filter(service => service.id !== id);
    setServices(updatedServices);
    setFilteredServices(updatedServices);
    localStorage.setItem('anataServices', JSON.stringify(updatedServices));
  };

  // Search services
  const searchServices = (term) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredServices(services);
    } else {
      const filtered = services.filter(service =>
        service.name.toLowerCase().includes(term.toLowerCase()) ||
        service.category.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredServices(filtered);
    }
  };

  // Get statistics
  const getStats = () => {
    return {
      totalServices: services.length,
      activeServices: services.filter(s => s.status === 'Active').length,
      inactiveServices: services.filter(s => s.status === 'Inactive').length,
      totalRevenue: services.reduce((sum, s) => sum + (s.price || 0), 0)
    };
  };

  return (
    <ServiceContext.Provider
      value={{
        services,
        filteredServices,
        searchTerm,
        loading,
        addService,
        updateService,
        deleteService,
        searchServices,
        getStats
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};