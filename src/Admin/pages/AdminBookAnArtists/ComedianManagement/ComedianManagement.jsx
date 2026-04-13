import React, { useState, useEffect } from 'react';

import { toast } from 'react-toastify';
import ComedianForm from './ComedianForm';
import ComedianTable from './ComedianTable';

export default function ComedianManagement() {
  const [comedians, setComedians] = useState([]);
  const [selectedComedian, setSelectedComedian] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Load comedians from localStorage on mount
  useEffect(() => {
    loadComedians();
  }, []);

  // Load comedians from localStorage
  const loadComedians = () => {
    try {
      const savedComedians = localStorage.getItem('comedians');
      if (savedComedians) {
        setComedians(JSON.parse(savedComedians));
        console.log('Comedians loaded from localStorage');
      } else {
        // Initialize with sample data if empty
        const sampleComedians = [
          {
            _id: '1',
            name: 'Zakir Khan',
            image: 'https://via.placeholder.com/300x400?text=Zakir+Khan',
            rating: 4.8,
            tour_status: 'Active',
            city: 'Mumbai',
            country: 'India',
            bio: 'Famous stand-up comedian known for witty humor',
            famous_show: 'Zakir Khan Live',
            experience_years: 8,
            followers: '2.5M',
            awards: ['Best Comedian 2022', 'Comedy Excellence Award'],
            genres: ['Stand-up', 'Observational', 'Political'],
            phone: '+91-9876543210',
            email: 'zakir@email.com',
            price: 50000
          }
        ];
        setComedians(sampleComedians);
        localStorage.setItem('comedians', JSON.stringify(sampleComedians));
      }
    } catch (error) {
      console.error('Error loading comedians:', error);
      toast.error('Failed to load comedians');
    }
  };

  // Save comedians to localStorage
  const saveComediansToStorage = (updatedComedians) => {
    try {
      localStorage.setItem('comedians', JSON.stringify(updatedComedians));
      console.log('Comedians saved to localStorage');
    } catch (error) {
      console.error('Error saving comedians:', error);
      toast.error('Failed to save comedians');
    }
  };

  // Create new comedian
  const handleCreateComedian = async (comedianData) => {
    try {
      setLoading(true);
      
      const newComedian = {
        ...comedianData,
        _id: Date.now().toString()
      };

      const updatedComedians = [...comedians, newComedian];
      setComedians(updatedComedians);
      saveComediansToStorage(updatedComedians);
      
      toast.success('Comedian added successfully!');
      setIsModalOpen(false);
      
      console.log('Comedian created:', newComedian);
    } catch (error) {
      console.error('Error creating comedian:', error);
      toast.error('Failed to add comedian');
    } finally {
      setLoading(false);
    }
  };

  // Update existing comedian
  const handleUpdateComedian = async (id, comedianData) => {
    try {
      setLoading(true);
      
      const updatedComedians = comedians.map(comedian =>
        comedian._id === id ? { ...comedianData, _id: id } : comedian
      );
      
      setComedians(updatedComedians);
      saveComediansToStorage(updatedComedians);
      
      toast.success('Comedian updated successfully!');
      setSelectedComedian(null);
      
      console.log('Comedian updated:', id);
    } catch (error) {
      console.error('Error updating comedian:', error);
      toast.error('Failed to update comedian');
    } finally {
      setLoading(false);
    }
  };

  // Delete comedian
  const handleDeleteComedian = async (id) => {
    if (window.confirm('Are you sure you want to delete this comedian?')) {
      try {
        setLoading(true);
        
        const updatedComedians = comedians.filter(comedian => comedian._id !== id);
        setComedians(updatedComedians);
        saveComediansToStorage(updatedComedians);
        
        toast.success('Comedian deleted successfully!');
        
        console.log('Comedian deleted:', id);
      } catch (error) {
        console.error('Error deleting comedian:', error);
        toast.error('Failed to delete comedian');
      } finally {
        setLoading(false);
      }
    }
  };

  // Filter comedians based on search
  const filteredComedians = comedians.filter(comedian =>
    comedian.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comedian.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-base-content">Comedian Management</h1>
          <p className="text-base-content/60 mt-2">Total Comedians: {comedians.length}</p>
        </div>
        <button
          onClick={() => {
            setSelectedComedian(null);
            setIsModalOpen(true);
          }}
          className="btn btn-primary gap-2"
          disabled={loading}
        >
          <span>+</span>
          Add New Comedian
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full"
          disabled={loading}
        />
      </div>

      {/* Comedian Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 sticky top-0 bg-base-100 border-b border-base-300 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Add New Comedian</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-ghost btn-sm btn-circle"
                disabled={loading}
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <ComedianForm
                onSubmit={handleCreateComedian}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Comedian Modal */}
      {selectedComedian && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 sticky top-0 bg-base-100 border-b border-base-300 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Edit Comedian</h2>
              <button
                onClick={() => setSelectedComedian(null)}
                className="btn btn-ghost btn-sm btn-circle"
                disabled={loading}
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <ComedianForm
                comedian={selectedComedian}
                onSubmit={(data) =>
                  handleUpdateComedian(selectedComedian._id, data)
                }
                onCancel={() => setSelectedComedian(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Comedians Table */}
      <div className="card bg-base-100 shadow-lg border border-base-300">
        {loading ? (
          <div className="card-body flex items-center justify-center py-12">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : filteredComedians.length > 0 ? (
          <ComedianTable
            comedians={filteredComedians}
            onEdit={setSelectedComedian}
            onDelete={handleDeleteComedian}
          />
        ) : (
          <div className="card-body text-center py-12">
            <p className="text-base-content/60 text-lg">No comedians found</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary mt-4"
            >
              Add First Comedian
            </button>
          </div>
        )}
      </div>
    </div>
  );
}