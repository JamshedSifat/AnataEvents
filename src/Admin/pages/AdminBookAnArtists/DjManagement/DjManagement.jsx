import React, { useState, useEffect } from 'react';

import { toast } from 'react-toastify';
import DjForm from './DjForm';
import DjTable from './DjTable';

export default function DjManagement() {
  const [djs, setDjs] = useState([]);
  const [selectedDj, setSelectedDj] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDjs();
  }, []);

  const loadDjs = () => {
    try {
      const savedDjs = localStorage.getItem('djs');
      if (savedDjs) {
        setDjs(JSON.parse(savedDjs));
        console.log('DJs loaded from localStorage');
      } else {
        const sampleDjs = [
          {
            _id: '1',
            name: 'DJ Nacho',
            image: 'https://via.placeholder.com/300x400?text=DJ+Nacho',
            rating: 4.9,
            genre: 'Electronic',
            famous_for: 'High-energy electronic and EDM performances',
            experience_years: 10,
            city: 'Dhaka',
            country: 'Bangladesh',
            awards: ['Best DJ 2023', 'Festival Favorite'],
            media_presence: 'Instagram, YouTube, TikTok',
            social_followers: '500K+',
            status: 'Active'
          }
        ];
        setDjs(sampleDjs);
        localStorage.setItem('djs', JSON.stringify(sampleDjs));
      }
    } catch (error) {
      console.error('Error loading DJs:', error);
      toast.error('Failed to load DJs');
    }
  };

  const saveDjsToStorage = (updatedDjs) => {
    try {
      localStorage.setItem('djs', JSON.stringify(updatedDjs));
      console.log('DJs saved to localStorage');
    } catch (error) {
      console.error('Error saving DJs:', error);
      toast.error('Failed to save DJs');
    }
  };

  const handleCreateDj = async (djData) => {
    try {
      setLoading(true);
      
      const newDj = {
        ...djData,
        _id: Date.now().toString()
      };

      const updatedDjs = [...djs, newDj];
      setDjs(updatedDjs);
      saveDjsToStorage(updatedDjs);
      
      toast.success('DJ added successfully!');
      setIsModalOpen(false);
      
      console.log('DJ created:', newDj);
    } catch (error) {
      console.error('Error creating DJ:', error);
      toast.error('Failed to add DJ');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDj = async (id, djData) => {
    try {
      setLoading(true);
      
      const updatedDjs = djs.map(dj =>
        dj._id === id ? { ...djData, _id: id } : dj
      );
      
      setDjs(updatedDjs);
      saveDjsToStorage(updatedDjs);
      
      toast.success('DJ updated successfully!');
      setSelectedDj(null);
      
      console.log('DJ updated:', id);
    } catch (error) {
      console.error('Error updating DJ:', error);
      toast.error('Failed to update DJ');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDj = async (id) => {
    if (window.confirm('Are you sure you want to delete this DJ?')) {
      try {
        setLoading(true);
        
        const updatedDjs = djs.filter(dj => dj._id !== id);
        setDjs(updatedDjs);
        saveDjsToStorage(updatedDjs);
        
        toast.success('DJ deleted successfully!');
        
        console.log('DJ deleted:', id);
      } catch (error) {
        console.error('Error deleting DJ:', error);
        toast.error('Failed to delete DJ');
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredDjs = djs.filter(dj =>
    dj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dj.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-base-content">DJ Management</h1>
          <p className="text-base-content/60 mt-2">Total DJs: {djs.length}</p>
        </div>
        <button
          onClick={() => {
            setSelectedDj(null);
            setIsModalOpen(true);
          }}
          className="btn btn-primary gap-2"
          disabled={loading}
        >
          <span>+</span>
          Add New DJ
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or genre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full"
          disabled={loading}
        />
      </div>

      {/* DJ Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 sticky top-0 bg-base-100 border-b border-base-300 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Add New DJ</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-ghost btn-sm btn-circle"
                disabled={loading}
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <DjForm
                onSubmit={handleCreateDj}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit DJ Modal */}
      {selectedDj && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 sticky top-0 bg-base-100 border-b border-base-300 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Edit DJ</h2>
              <button
                onClick={() => setSelectedDj(null)}
                className="btn btn-ghost btn-sm btn-circle"
                disabled={loading}
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <DjForm
                dj={selectedDj}
                onSubmit={(data) =>
                  handleUpdateDj(selectedDj._id, data)
                }
                onCancel={() => setSelectedDj(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* DJs Table */}
      <div className="card bg-base-100 shadow-lg border border-base-300">
        {loading ? (
          <div className="card-body flex items-center justify-center py-12">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : filteredDjs.length > 0 ? (
          <DjTable
            djs={filteredDjs}
            onEdit={setSelectedDj}
            onDelete={handleDeleteDj}
          />
        ) : (
          <div className="card-body text-center py-12">
            <p className="text-base-content/60 text-lg">No DJs found</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary mt-4"
            >
              Add First DJ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}