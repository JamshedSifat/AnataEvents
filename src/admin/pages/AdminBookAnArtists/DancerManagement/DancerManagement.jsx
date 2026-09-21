import React, { useState, useEffect } from 'react';

import { toast } from 'react-toastify';
import DancerForm from './DancerForm';
import DancerTable from './DancerTable';

export default function DancerManagement() {
  const [dancers, setDancers] = useState([]);
  const [selectedDancer, setSelectedDancer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDancers();
  }, []);

  const loadDancers = () => {
    try {
      const savedDancers = localStorage.getItem('dancers');
      if (savedDancers) {
        setDancers(JSON.parse(savedDancers));
        console.log('Dancers loaded from localStorage');
      } else {
        const sampleDancers = [
          {
            _id: '1',
            name: 'Priya Sharma',
            image: 'https://via.placeholder.com/300x400?text=Priya+Sharma',
            rating: 4.8,
            category: 'Contemporary',
            famous_for: 'Contemporary and classical fusion performances',
            experience_years: 8,
            status: 'Active',
            media_presence: 'Instagram, YouTube',
            styles: ['Contemporary', 'Classical', 'Fusion'],
            awards: ['National Dance Award 2022', 'Best Performer 2021']
          }
        ];
        setDancers(sampleDancers);
        localStorage.setItem('dancers', JSON.stringify(sampleDancers));
      }
    } catch (error) {
      console.error('Error loading dancers:', error);
      toast.error('Failed to load dancers');
    }
  };

  const saveDancersToStorage = (updatedDancers) => {
    try {
      localStorage.setItem('dancers', JSON.stringify(updatedDancers));
      console.log('Dancers saved to localStorage');
    } catch (error) {
      console.error('Error saving dancers:', error);
      toast.error('Failed to save dancers');
    }
  };

  const handleCreateDancer = async (dancerData) => {
    try {
      setLoading(true);
      
      const newDancer = {
        ...dancerData,
        _id: Date.now().toString()
      };

      const updatedDancers = [...dancers, newDancer];
      setDancers(updatedDancers);
      saveDancersToStorage(updatedDancers);
      
      toast.success('Dancer added successfully!');
      setIsModalOpen(false);
      
      console.log('Dancer created:', newDancer);
    } catch (error) {
      console.error('Error creating dancer:', error);
      toast.error('Failed to add dancer');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDancer = async (id, dancerData) => {
    try {
      setLoading(true);
      
      const updatedDancers = dancers.map(dancer =>
        dancer._id === id ? { ...dancerData, _id: id } : dancer
      );
      
      setDancers(updatedDancers);
      saveDancersToStorage(updatedDancers);
      
      toast.success('Dancer updated successfully!');
      setSelectedDancer(null);
      
      console.log('Dancer updated:', id);
    } catch (error) {
      console.error('Error updating dancer:', error);
      toast.error('Failed to update dancer');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDancer = async (id) => {
    if (window.confirm('Are you sure you want to delete this dancer?')) {
      try {
        setLoading(true);
        
        const updatedDancers = dancers.filter(dancer => dancer._id !== id);
        setDancers(updatedDancers);
        saveDancersToStorage(updatedDancers);
        
        toast.success('Dancer deleted successfully!');
        
        console.log('Dancer deleted:', id);
      } catch (error) {
        console.error('Error deleting dancer:', error);
        toast.error('Failed to delete dancer');
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredDancers = dancers.filter(dancer =>
    dancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dancer.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-base-content">Dancer Management</h1>
          <p className="text-base-content/60 mt-2">Total Dancers: {dancers.length}</p>
        </div>
        <button
          onClick={() => {
            setSelectedDancer(null);
            setIsModalOpen(true);
          }}
          className="btn btn-primary gap-2"
          disabled={loading}
        >
          <span>+</span>
          Add New Dancer
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full"
          disabled={loading}
        />
      </div>

      {/* Dancer Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 sticky top-0 bg-base-100 border-b border-base-300 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Add New Dancer</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-ghost btn-sm btn-circle"
                disabled={loading}
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <DancerForm
                onSubmit={handleCreateDancer}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Dancer Modal */}
      {selectedDancer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 sticky top-0 bg-base-100 border-b border-base-300 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Edit Dancer</h2>
              <button
                onClick={() => setSelectedDancer(null)}
                className="btn btn-ghost btn-sm btn-circle"
                disabled={loading}
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <DancerForm
                dancer={selectedDancer}
                onSubmit={(data) =>
                  handleUpdateDancer(selectedDancer._id, data)
                }
                onCancel={() => setSelectedDancer(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Dancers Table */}
      <div className="card bg-base-100 shadow-lg border border-base-300">
        {loading ? (
          <div className="card-body flex items-center justify-center py-12">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : filteredDancers.length > 0 ? (
          <DancerTable
            dancers={filteredDancers}
            onEdit={setSelectedDancer}
            onDelete={handleDeleteDancer}
          />
        ) : (
          <div className="card-body text-center py-12">
            <p className="text-base-content/60 text-lg">No dancers found</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary mt-4"
            >
              Add First Dancer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}