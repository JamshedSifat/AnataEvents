import React, { useState, useEffect } from 'react';

import { toast } from 'react-toastify';
import SingerForm from './SingerForm';
import SingerTable from './SingerTable';

export default function SingerManagement() {
  const [singers, setSingers] = useState([]);
  const [selectedSinger, setSelectedSinger] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadSingers();
  }, []);

  const loadSingers = () => {
    try {
      const savedSingers = localStorage.getItem('singers');
      if (savedSingers) {
        setSingers(JSON.parse(savedSingers));
        console.log('Singers loaded from localStorage');
      } else {
        const sampleSingers = [
          {
            _id: '1',
            name: 'Imran Mahmudy',
            image: 'https://via.placeholder.com/300x400?text=Imran+Mahmudy',
            rating: 4.8,
            genre: 'Pop, Romantic',
            description: 'Popular Bangladeshi singer known for romantic and folk music',
            experience: '15 years',
            location: 'Dhaka, Bangladesh',
            availability: 'Available',
            popularSongs: ['Tomay Valobasechi', 'Ek Akdin'],
            specialties: ['Romantic Songs', 'Folk Music', 'Classical Fusion'],
            awards: ['National Music Award 2022', 'Best Singer 2021'],
            socialMedia: {
              facebook: 'facebook.com/imranmahmudy',
              instagram: 'instagram.com/imranmahmudy',
              youtube: 'youtube.com/@imranmahmudy'
            }
          }
        ];
        setSingers(sampleSingers);
        localStorage.setItem('singers', JSON.stringify(sampleSingers));
      }
    } catch (error) {
      console.error('Error loading singers:', error);
      toast.error('Failed to load singers');
    }
  };

  const saveSingersToStorage = (updatedSingers) => {
    try {
      localStorage.setItem('singers', JSON.stringify(updatedSingers));
      console.log('Singers saved to localStorage');
    } catch (error) {
      console.error('Error saving singers:', error);
      toast.error('Failed to save singers');
    }
  };

  const handleCreateSinger = async (singerData) => {
    try {
      setLoading(true);
      
      const newSinger = {
        ...singerData,
        _id: Date.now().toString()
      };

      const updatedSingers = [...singers, newSinger];
      setSingers(updatedSingers);
      saveSingersToStorage(updatedSingers);
      
      toast.success('Singer added successfully!');
      setIsModalOpen(false);
      
      console.log('Singer created:', newSinger);
    } catch (error) {
      console.error('Error creating singer:', error);
      toast.error('Failed to add singer');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSinger = async (id, singerData) => {
    try {
      setLoading(true);
      
      const updatedSingers = singers.map(singer =>
        singer._id === id ? { ...singerData, _id: id } : singer
      );
      
      setSingers(updatedSingers);
      saveSingersToStorage(updatedSingers);
      
      toast.success('Singer updated successfully!');
      setSelectedSinger(null);
      
      console.log('Singer updated:', id);
    } catch (error) {
      console.error('Error updating singer:', error);
      toast.error('Failed to update singer');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSinger = async (id) => {
    if (window.confirm('Are you sure you want to delete this singer?')) {
      try {
        setLoading(true);
        
        const updatedSingers = singers.filter(singer => singer._id !== id);
        setSingers(updatedSingers);
        saveSingersToStorage(updatedSingers);
        
        toast.success('Singer deleted successfully!');
        
        console.log('Singer deleted:', id);
      } catch (error) {
        console.error('Error deleting singer:', error);
        toast.error('Failed to delete singer');
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredSingers = singers.filter(singer =>
    singer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    singer.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-base-content">Singer Management</h1>
          <p className="text-base-content/60 mt-2">Total Singers: {singers.length}</p>
        </div>
        <button
          onClick={() => {
            setSelectedSinger(null);
            setIsModalOpen(true);
          }}
          className="btn btn-primary gap-2"
          disabled={loading}
        >
          <span>+</span>
          Add New Singer
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full"
          disabled={loading}
        />
      </div>

      {/* Singer Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 sticky top-0 bg-base-100 border-b border-base-300 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Add New Singer</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-ghost btn-sm btn-circle"
                disabled={loading}
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <SingerForm
                onSubmit={handleCreateSinger}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Singer Modal */}
      {selectedSinger && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 sticky top-0 bg-base-100 border-b border-base-300 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Edit Singer</h2>
              <button
                onClick={() => setSelectedSinger(null)}
                className="btn btn-ghost btn-sm btn-circle"
                disabled={loading}
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <SingerForm
                singer={selectedSinger}
                onSubmit={(data) =>
                  handleUpdateSinger(selectedSinger._id, data)
                }
                onCancel={() => setSelectedSinger(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Singers Table */}
      <div className="card bg-base-100 shadow-lg border border-base-300">
        {loading ? (
          <div className="card-body flex items-center justify-center py-12">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : filteredSingers.length > 0 ? (
          <SingerTable
            singers={filteredSingers}
            onEdit={setSelectedSinger}
            onDelete={handleDeleteSinger}
          />
        ) : (
          <div className="card-body text-center py-12">
            <p className="text-base-content/60 text-lg">No singers found</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary mt-4"
            >
              Add First Singer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}