import React, { useState, useEffect } from 'react';

import { toast } from 'react-toastify';
import MediaForm from './MediaForm';
import MediaTable from './MediaTable';

export default function MediaManagement() {
  const [medias, setMedias] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMedias();
  }, []);

  const loadMedias = () => {
    try {
      const savedMedias = localStorage.getItem('medias');
      if (savedMedias) {
        setMedias(JSON.parse(savedMedias));
        console.log('Medias loaded from localStorage');
      } else {
        const sampleMedias = [
          {
            _id: '1',
            title: 'Corporate Event Setup',
            category: 'corporate',
            url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
            description: 'Professional corporate event setup with modern design',
            uploadDate: new Date().toISOString().split('T')[0]
          }
        ];
        setMedias(sampleMedias);
        localStorage.setItem('medias', JSON.stringify(sampleMedias));
      }
    } catch (error) {
      console.error('Error loading medias:', error);
      toast.error('Failed to load medias');
    }
  };

  const saveMediasToStorage = (updatedMedias) => {
    try {
      localStorage.setItem('medias', JSON.stringify(updatedMedias));
      console.log('Medias saved to localStorage');
    } catch (error) {
      console.error('Error saving medias:', error);
      toast.error('Failed to save medias');
    }
  };

  const handleCreateMedia = async (mediaData) => {
    try {
      setLoading(true);
      
      const newMedia = {
        ...mediaData,
        _id: Date.now().toString(),
        uploadDate: new Date().toISOString().split('T')[0]
      };

      const updatedMedias = [...medias, newMedia];
      setMedias(updatedMedias);
      saveMediasToStorage(updatedMedias);
      
      toast.success('Media added successfully!');
      setIsModalOpen(false);
      
      console.log('Media created:', newMedia);
    } catch (error) {
      console.error('Error creating media:', error);
      toast.error('Failed to add media');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMedia = async (id, mediaData) => {
    try {
      setLoading(true);
      
      const updatedMedias = medias.map(media =>
        media._id === id ? { ...mediaData, _id: id } : media
      );
      
      setMedias(updatedMedias);
      saveMediasToStorage(updatedMedias);
      
      toast.success('Media updated successfully!');
      setSelectedMedia(null);
      
      console.log('Media updated:', id);
    } catch (error) {
      console.error('Error updating media:', error);
      toast.error('Failed to update media');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMedia = async (id) => {
    if (window.confirm('Are you sure you want to delete this media?')) {
      try {
        setLoading(true);
        
        const updatedMedias = medias.filter(media => media._id !== id);
        setMedias(updatedMedias);
        saveMediasToStorage(updatedMedias);
        
        toast.success('Media deleted successfully!');
        
        console.log('Media deleted:', id);
      } catch (error) {
        console.error('Error deleting media:', error);
        toast.error('Failed to delete media');
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredMedias = medias.filter(media =>
    media.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    media.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-base-content">Media Management</h1>
          <p className="text-base-content/60 mt-2">Total Medias: {medias.length}</p>
        </div>
        <button
          onClick={() => {
            setSelectedMedia(null);
            setIsModalOpen(true);
          }}
          className="btn btn-primary gap-2"
          disabled={loading}
        >
          <span>+</span>
          Add New Media
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by title or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full"
          disabled={loading}
        />
      </div>

      {/* Media Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 sticky top-0 bg-base-100 border-b border-base-300 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Add New Media</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-ghost btn-sm btn-circle"
                disabled={loading}
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <MediaForm
                onSubmit={handleCreateMedia}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Media Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 sticky top-0 bg-base-100 border-b border-base-300 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Edit Media</h2>
              <button
                onClick={() => setSelectedMedia(null)}
                className="btn btn-ghost btn-sm btn-circle"
                disabled={loading}
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <MediaForm
                media={selectedMedia}
                onSubmit={(data) =>
                  handleUpdateMedia(selectedMedia._id, data)
                }
                onCancel={() => setSelectedMedia(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Medias Table */}
      <div className="card bg-base-100 shadow-lg border border-base-300">
        {loading ? (
          <div className="card-body flex items-center justify-center py-12">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : filteredMedias.length > 0 ? (
          <MediaTable
            medias={filteredMedias}
            onEdit={setSelectedMedia}
            onDelete={handleDeleteMedia}
          />
        ) : (
          <div className="card-body text-center py-12">
            <p className="text-base-content/60 text-lg">No medias found</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary mt-4"
            >
              Add First Media
            </button>
          </div>
        )}
      </div>
    </div>
  );
}