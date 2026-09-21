// File: src/Admin/Pages/HeroSlides/AdminHeroSlides.jsx (Updated - URL Input Box without Alert)
import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, Search, Eye, X, Image as ImageIcon } from 'lucide-react';

const AdminHeroSlides = () => {
  const [slides, setSlides] = useState([]);
  const [filteredSlides, setFilteredSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [formData, setFormData] = useState({
    _id: '',
    title: '',
    subtitle: '',
    description: '',
    image: '',
    stats: '',
    order: 1
  });

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = () => {
    try {
      setLoading(true);
      let data = [];
      const savedSlides = localStorage.getItem('heroSlides');
      
      if (savedSlides) {
        data = JSON.parse(savedSlides);
      } else {
        // Default slides
        data = [
          {
            _id: '1',
            title: "Creating Extraordinary",
            subtitle: "Luxury Events",
            description: "Transform your special moments into unforgettable experiences with our premium event planning services.",
            image: "https://www.anantabd.net/wp-content/uploads/2022/10/IMG_0386.jpg",
            stats: "500+ Events Planned",
            order: 1,
            createdAt: new Date().toISOString()
          },
        
        ];
        localStorage.setItem('heroSlides', JSON.stringify(data));
      }

      setSlides(data);
      setFilteredSlides(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading slides:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = slides;

    if (searchTerm) {
      filtered = filtered.filter(slide =>
        slide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slide.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSlides(filtered);
  }, [searchTerm, slides]);

  const generateUniqueId = () => {
    return `slide-${Date.now()}`;
  };

  const handleViewDetails = (slide) => {
    setSelectedSlide(slide);
    setIsDetailModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingSlide(null);
    setImageUrlInput('');
    setFormData({
      _id: generateUniqueId(),
      title: '',
      subtitle: '',
      description: '',
      image: '',
      stats: '',
      order: slides.length + 1,
      createdAt: new Date().toISOString()
    });
    setIsFormModalOpen(true);
  };

  const handleEdit = (slide) => {
    setEditingSlide(slide);
    setImageUrlInput('');
    setFormData(slide);
    setIsFormModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          image: event.target.result
        }));
        setImageUrlInput('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImageUrl = () => {
    const url = imageUrlInput.trim();
    if (url) {
      setFormData(prev => ({
        ...prev,
        image: url
      }));
      setImageUrlInput('');
    }
  };

  const handleImageUrlKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddImageUrl();
    }
  };

  const handleSaveSlide = () => {
    if (!formData.image.trim()) {
      alert('Image is required');
      return;
    }
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }

    let updatedSlides;
    if (editingSlide) {
      updatedSlides = slides.map(s => s._id === editingSlide._id ? formData : s);
      alert('Hero slide updated successfully!');
    } else {
      updatedSlides = [...slides, formData];
      alert('Hero slide added successfully!');
    }

    localStorage.setItem('heroSlides', JSON.stringify(updatedSlides));
    setSlides(updatedSlides);
    setIsFormModalOpen(false);
    setImageUrlInput('');
    setFormData({
      _id: generateUniqueId(),
      title: '',
      subtitle: '',
      description: '',
      image: '',
      stats: '',
      order: slides.length + 1,
      createdAt: new Date().toISOString()
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Permanently delete this hero slide?')) {
      const updatedSlides = slides.filter(s => s._id !== id);
      localStorage.setItem('heroSlides', JSON.stringify(updatedSlides));
      setSlides(updatedSlides);
      setIsDetailModalOpen(false);
      alert('Hero slide deleted!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Hero Slides</h1>
          <button
            onClick={handleAddNew}
            className="btn btn-primary gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Slide
          </button>
        </div>
        <p className="text-gray-600">Manage website hero section slides with title, subtitle, description, and stats</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Slides</h3>
          <p className="text-3xl font-bold text-blue-600">{slides.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">With Images</h3>
          <p className="text-3xl font-bold text-green-600">{slides.filter(s => s.image).length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">With Stats</h3>
          <p className="text-3xl font-bold text-purple-600">{slides.filter(s => s.stats).length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Active</h3>
          <p className="text-3xl font-bold text-orange-600">{slides.length > 0 ? 'Yes' : 'No'}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search slides by title or subtitle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full pl-10"
          />
        </div>
      </div>

      {/* Slides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSlides.length > 0 ? (
          filteredSlides.map(slide => (
            <div key={slide._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all">
              {/* Image Preview */}
              <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
                {slide.image ? (
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs font-semibold">
                  Order: {slide.order}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">{slide.title}</h3>
                {slide.subtitle && (
                  <p className="text-sm text-primary font-semibold mb-2">{slide.subtitle}</p>
                )}
                {slide.stats && (
                  <p className="text-xs text-green-600 mb-2">🏆 {slide.stats}</p>
                )}
                <p className="text-xs text-gray-500 mb-4 line-clamp-2">{slide.description}</p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(slide)}
                    className="btn btn-sm btn-ghost gap-1 flex-1"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(slide)}
                    className="btn btn-sm btn-ghost gap-1 flex-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(slide._id)}
                    className="btn btn-sm btn-ghost text-error gap-1 flex-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">No slides found</p>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {isDetailModalOpen && selectedSlide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{selectedSlide.title}</h2>
                {selectedSlide.subtitle && (
                  <p className="text-sm text-white/80">{selectedSlide.subtitle}</p>
                )}
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Image Preview */}
              <div>
                <h3 className="font-bold mb-3 text-gray-900">Image Preview</h3>
                {selectedSlide.image ? (
                  <img
                    src={selectedSlide.image}
                    alt={selectedSlide.title}
                    className="w-full h-96 object-cover rounded-lg"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/800x400?text=Image+Error'}
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">No image</p>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Title</p>
                  <p className="text-gray-900">{selectedSlide.title}</p>
                </div>
                {selectedSlide.subtitle && (
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">Subtitle</p>
                    <p className="text-gray-900">{selectedSlide.subtitle}</p>
                  </div>
                )}
                {selectedSlide.description && (
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">Description</p>
                    <p className="text-gray-700">{selectedSlide.description}</p>
                  </div>
                )}
                {selectedSlide.stats && (
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">Stats Badge</p>
                    <p className="text-green-600">🏆 {selectedSlide.stats}</p>
                  </div>
                )}
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-600">Order: {selectedSlide.order}</p>
                  <p className="text-xs text-gray-500">Created: {new Date(selectedSlide.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleEdit(selectedSlide);
                  }}
                  className="btn btn-primary flex-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleDelete(selectedSlide._id);
                  }}
                  className="btn btn-error flex-1"
                >
                  Delete
                </button>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="btn btn-ghost flex-1"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-primary to-pink-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {editingSlide ? 'Edit Hero Slide' : 'Add New Hero Slide'}
              </h2>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
             

              {/* Order */}
              <div>
                <label className="block text-sm font-semibold mb-2">Display Order</label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleFormChange}
                  placeholder="1, 2, 3..."
                  className="input input-bordered w-full"
                  min="1"
                />
              </div>

              {/* Image Section */}
              <div>
                <label className="block text-sm font-semibold mb-3">Image *</label>
                
                {/* Image Preview */}
                {formData.image && (
                  <div className="mb-4">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                      onError={(e) => e.target.src = 'https://via.placeholder.com/400x300?text=Image+Error'}
                    />
                  </div>
                )}

                {/* Upload Options */}
                <div className="space-y-3">
                  {/* File Upload */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Upload Image File</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-input file-input-bordered w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">Max file size: 5MB</p>
                  </div>

                  {/* Or Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-white text-gray-500">OR</span>
                    </div>
                  </div>

                  {/* URL Link - WITH INPUT BOX */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Use Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="imageUrlInput"
                        placeholder="Paste image URL here..."
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        onKeyPress={handleImageUrlKeyPress}
                        className="input input-bordered input-sm flex-1"
                      />
                      <button
                        onClick={handleAddImageUrl}
                        className="btn btn-primary btn-sm"
                      >
                        Add
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Paste full image URL (https://...) and press Enter or click Add</p>
                  </div>
                </div>

                {/* Current Image Info */}
                {formData.image && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">
                      <strong>Type:</strong> {formData.image.startsWith('data:') ? 'Uploaded File' : 'URL Link'}
                    </p>
                    <p className="text-xs text-gray-500 break-all font-mono">
                      {formData.image.substring(0, 60)}...
                    </p>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => setIsFormModalOpen(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSlide}
                  className="btn btn-primary"
                >
                  {editingSlide ? 'Update' : 'Add'} Slide
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHeroSlides;