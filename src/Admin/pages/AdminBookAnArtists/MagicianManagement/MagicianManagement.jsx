import React, { useState, useEffect } from 'react';

import { toast } from 'react-toastify';
import MagicianForm from './MagicianForm';
import MagicianTable from './MagicianTable';

export default function MagicianManagement() {
  const [magicians, setMagicians] = useState([]);
  const [selectedMagician, setSelectedMagician] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMagicians();
  }, []);

  const loadMagicians = () => {
    try {
      const savedMagicians = localStorage.getItem('magicians');
      if (savedMagicians) {
        setMagicians(JSON.parse(savedMagicians));
        console.log('Magicians loaded from localStorage');
      } else {
        const sampleMagicians = [
          {
            _id: '1',
            name: 'Criss Angel',
            image: 'https://via.placeholder.com/300x400?text=Criss+Angel',
            rating: 4.9,
            tour_status: 'Active',
            city: 'Dhaka',
            language: 'Bengali, English',
            bio: 'Master illusionist with mind-bending street magic',
            famous_show: 'Street Magic Spectacular',
            experience_years: 15,
            followers: '1M+',
            awards: ['Magician of the Year 2023', 'International Magic Award'],
            genres: ['Street Magic', 'Illusion', 'Close-up Magic']
          }
        ];
        setMagicians(sampleMagicians);
        localStorage.setItem('magicians', JSON.stringify(sampleMagicians));
      }
    } catch (error) {
      console.error('Error loading magicians:', error);
      toast.error('Failed to load magicians');
    }
  };

  const saveMagiciansToStorage = (updatedMagicians) => {
    try {
      localStorage.setItem('magicians', JSON.stringify(updatedMagicians));
      console.log('Magicians saved to localStorage');
    } catch (error) {
      console.error('Error saving magicians:', error);
      toast.error('Failed to save magicians');
    }
  };

  const handleCreateMagician = async (magicianData) => {
    try {
      setLoading(true);
      
      const newMagician = {
        ...magicianData,
        _id: Date.now().toString()
      };

      const updatedMagicians = [...magicians, newMagician];
      setMagicians(updatedMagicians);
      saveMagiciansToStorage(updatedMagicians);
      
      toast.success('Magician added successfully!');
      setIsModalOpen(false);
      
      console.log('Magician created:', newMagician);
    } catch (error) {
      console.error('Error creating magician:', error);
      toast.error('Failed to add magician');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMagician = async (id, magicianData) => {
    try {
      setLoading(true);
      
      const updatedMagicians = magicians.map(magician =>
        magician._id === id ? { ...magicianData, _id: id } : magician
      );
      
      setMagicians(updatedMagicians);
      saveMagiciansToStorage(updatedMagicians);
      
      toast.success('Magician updated successfully!');
      setSelectedMagician(null);
      
      console.log('Magician updated:', id);
    } catch (error) {
      console.error('Error updating magician:', error);
      toast.error('Failed to update magician');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMagician = async (id) => {
    if (window.confirm('Are you sure you want to delete this magician?')) {
      try {
        setLoading(true);
        
        const updatedMagicians = magicians.filter(magician => magician._id !== id);
        setMagicians(updatedMagicians);
        saveMagiciansToStorage(updatedMagicians);
        
        toast.success('Magician deleted successfully!');
        
        console.log('Magician deleted:', id);
      } catch (error) {
        console.error('Error deleting magician:', error);
        toast.error('Failed to delete magician');
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredMagicians = magicians.filter(magician =>
    magician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    magician.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-base-content">Magician Management</h1>
          <p className="text-base-content/60 mt-2">Total Magicians: {magicians.length}</p>
        </div>
        <button
          onClick={() => {
            setSelectedMagician(null);
            setIsModalOpen(true);
          }}
          className="btn btn-primary gap-2"
          disabled={loading}
        >
          <span>+</span>
          Add New Magician
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

      {/* Magician Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 sticky top-0 bg-base-100 border-b border-base-300 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Add New Magician</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-ghost btn-sm btn-circle"
                disabled={loading}
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <MagicianForm
                onSubmit={handleCreateMagician}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Magician Modal */}
      {selectedMagician && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 sticky top-0 bg-base-100 border-b border-base-300 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Edit Magician</h2>
              <button
                onClick={() => setSelectedMagician(null)}
                className="btn btn-ghost btn-sm btn-circle"
                disabled={loading}
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <MagicianForm
                magician={selectedMagician}
                onSubmit={(data) =>
                  handleUpdateMagician(selectedMagician._id, data)
                }
                onCancel={() => setSelectedMagician(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Magicians Table */}
      <div className="card bg-base-100 shadow-lg border border-base-300">
        {loading ? (
          <div className="card-body flex items-center justify-center py-12">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : filteredMagicians.length > 0 ? (
          <MagicianTable
            magicians={filteredMagicians}
            onEdit={setSelectedMagician}
            onDelete={handleDeleteMagician}
          />
        ) : (
          <div className="card-body text-center py-12">
            <p className="text-base-content/60 text-lg">No magicians found</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary mt-4"
            >
              Add First Magician
            </button>
          </div>
        )}
      </div>
    </div>
  );
}