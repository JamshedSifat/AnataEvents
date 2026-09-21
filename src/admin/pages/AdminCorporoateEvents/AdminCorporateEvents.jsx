
import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, Search, Eye, X, Upload, Trash, Image as ImageIcon } from 'lucide-react';
import corporateEventsData from '../../../../public/CorporateEvents/CorporateEvents.json';

const AdminCorporateEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [formData, setFormData] = useState({
    _id: '',
    title: '',
    category: '',
    excerpt: '',
    author: '',
    date: '',
    featured: false,
    content: '',
    images: []
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    try {
      setLoading(true);
      let data = [];
      const savedEvents = localStorage.getItem('corporateEvents');
      
      if (savedEvents) {
        data = JSON.parse(savedEvents);
      } else if (corporateEventsData && Array.isArray(corporateEventsData)) {
        data = corporateEventsData;
        localStorage.setItem('corporateEvents', JSON.stringify(data));
      }

      setEvents(data);
      setFilteredEvents(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading events:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  // ✅ Generate unique ID
  const generateUniqueId = () => {
    return `event-${Date.now()}`;
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingEvent(null);
    setGalleryImages([]);
    setNewImageUrl('');
    setFormData({
      _id: generateUniqueId(),
      title: '',
      category: '',
      excerpt: '',
      author: '',
      date: '',
      featured: false,
      content: '',
      images: []
    });
    setIsFormModalOpen(true);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setGalleryImages(event.images || []);
    setNewImageUrl('');
    setFormData(event);
    setIsFormModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // ✅ Add image from URL
  const addImageFromUrl = () => {
    if (!newImageUrl.trim()) {
      alert('Please enter an image URL');
      return;
    }

    if (galleryImages.includes(newImageUrl)) {
      alert('This image URL already exists');
      return;
    }

    setGalleryImages(prev => [...prev, newImageUrl]);
    setNewImageUrl('');
  };

  // ✅ Handle file upload (multiple)
  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // ✅ Remove image
  const removeImage = (index) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  // ✅ Move image up
  const moveImageUp = (index) => {
    if (index === 0) return;
    const newImages = [...galleryImages];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    setGalleryImages(newImages);
  };

  // ✅ Move image down
  const moveImageDown = (index) => {
    if (index === galleryImages.length - 1) return;
    const newImages = [...galleryImages];
    [newImages[index + 1], newImages[index]] = [newImages[index], newImages[index + 1]];
    setGalleryImages(newImages);
  };

  const handleSaveEvent = () => {
    if (!formData.title || !formData.category) {
      alert('Title and Category are required');
      return;
    }

    if (galleryImages.length === 0) {
      alert('Please add at least one image');
      return;
    }

    const eventToSave = {
      ...formData,
      images: galleryImages,
      image: galleryImages[0] // Main image is first one
    };

    let updatedEvents;
    if (editingEvent) {
      updatedEvents = events.map(e => e._id === editingEvent._id ? eventToSave : e);
      alert('Event updated successfully!');
    } else {
      updatedEvents = [...events, eventToSave];
      alert('Event added successfully!');
    }

    localStorage.setItem('corporateEvents', JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
    setIsFormModalOpen(false);
    setGalleryImages([]);
    setNewImageUrl('');
    setFormData({
      _id: generateUniqueId(),
      title: '',
      category: '',
      excerpt: '',
      author: '',
      date: '',
      featured: false,
      content: '',
      images: []
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const updatedEvents = events.filter(e => e._id !== id);
      localStorage.setItem('corporateEvents', JSON.stringify(updatedEvents));
      setEvents(updatedEvents);
      alert('Event deleted successfully!');
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
          <h1 className="text-3xl font-bold text-gray-900">Corporate Events Management</h1>
          <button
            onClick={handleAddNew}
            className="btn btn-primary gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Event
          </button>
        </div>
        <p className="text-gray-600">Manage corporate events and services</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Events</h3>
          <p className="text-3xl font-bold text-primary">{events.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Featured</h3>
          <p className="text-3xl font-bold text-green-600">{events.filter(e => e.featured).length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Categories</h3>
          <p className="text-3xl font-bold text-blue-600">{new Set(events.map(e => e.category)).size}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Author</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Images</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Featured</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEvents.length > 0 ? (
                filteredEvents.map(event => (
                  <tr key={event._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium line-clamp-1">{event.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="badge badge-sm">{event.category}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{event.author}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="badge badge-info">{event.images?.length || 0}</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`badge ${event.featured ? 'badge-success' : 'badge-ghost'}`}>
                        {event.featured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(event)}
                          className="btn btn-sm btn-ghost gap-1"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(event)}
                          className="btn btn-sm btn-ghost gap-1"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(event._id)}
                          className="btn btn-sm btn-ghost text-error gap-1"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No events found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      {isDetailModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Images Gallery */}
              {selectedEvent.images && selectedEvent.images.length > 0 && (
                <div>
                  <label className="text-sm text-gray-600 font-semibold mb-3 block">Gallery Images ({selectedEvent.images.length})</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedEvent.images.map((img, idx) => (
                      <div key={idx} className="relative rounded-lg overflow-hidden group">
                        <img 
                          src={img} 
                          alt={`Image ${idx + 1}`} 
                          className="w-full h-40 object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Error';
                          }}
                        />
                        {idx === 0 && (
                          <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded font-semibold">
                            Main
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/30 px-2 py-1 text-white text-xs">
                          {idx + 1} / {selectedEvent.images.length}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 font-semibold">Category</label>
                  <p className="text-gray-900">{selectedEvent.category}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-semibold">Featured</label>
                  <p className="text-gray-900">{selectedEvent.featured ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-semibold">Author</label>
                  <p className="text-gray-900">{selectedEvent.author}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-semibold">Date</label>
                  <p className="text-gray-900">{new Date(selectedEvent.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600 font-semibold">Excerpt</label>
                <p className="text-gray-900 mt-2">{selectedEvent.excerpt}</p>
              </div>

              <div>
                <label className="text-sm text-gray-600 font-semibold">Content</label>
                <p className="text-gray-900 mt-2 whitespace-pre-wrap max-h-48 overflow-y-auto">{selectedEvent.content}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h2>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="Enter event title"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Category *</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    placeholder="Category"
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Author</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleFormChange}
                    placeholder="Author Name"
                    className="input input-bordered w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Featured</label>
                  <label className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleFormChange}
                      className="checkbox"
                    />
                    <span>Featured Event</span>
                  </label>
                </div>
              </div>

              {/* ✅ UPDATED Images Section */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ImageIcon className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Gallery Images ({galleryImages.length})
                  </h3>
                </div>

                {/* Upload Methods */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">📁 File Upload</label>
                    <label className="flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/70 p-4 rounded-lg border-2 border-dashed border-primary/50 transition">
                      <Upload className="w-6 h-6 text-primary" />
                      <span className="text-sm font-semibold text-gray-700 text-center">Select multiple images</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* URL Input */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">🔗 Image URL</label>
                    <div className="flex gap-2 flex-col">
                      <input
                        type="url"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="input input-bordered input-sm"
                        onKeyPress={(e) => e.key === 'Enter' && addImageFromUrl()}
                      />
                      <button
                        onClick={addImageFromUrl}
                        className="btn btn-primary btn-sm"
                      >
                        Add URL
                      </button>
                    </div>
                  </div>
                </div>

                {/* Gallery Preview */}
                {galleryImages.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-900">Preview & Manage</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-white p-4 rounded-lg">
                      {galleryImages.map((img, idx) => (
                        <div key={idx} className="relative group">
                          {/* Image */}
                          <div className="relative overflow-hidden rounded-lg h-28 bg-gray-200">
                            <img 
                              src={img} 
                              alt={`Image ${idx + 1}`} 
                              className="w-full h-full object-cover group-hover:scale-105 transition"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/200x150?text=Error';
                              }}
                            />
                            {idx === 0 && (
                              <div className="absolute top-1 left-1 bg-primary text-white text-xs px-2 py-1 rounded font-bold">
                                Main
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1 rounded-lg">
                            {/* Move Up */}
                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => moveImageUp(idx)}
                                className="p-1 bg-primary text-white rounded hover:bg-primary/80"
                                title="Move up"
                              >
                                ⬆
                              </button>
                            )}

                            {/* Move Down */}
                            {idx < galleryImages.length - 1 && (
                              <button
                                type="button"
                                onClick={() => moveImageDown(idx)}
                                className="p-1 bg-primary text-white rounded hover:bg-primary/80"
                                title="Move down"
                              >
                                ⬇
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                              title="Delete"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Index */}
                          <p className="text-xs text-gray-500 mt-1 text-center">
                            {idx + 1} / {galleryImages.length}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {galleryImages.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No images added yet</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Excerpt</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleFormChange}
                  placeholder="Short description"
                  className="textarea textarea-bordered w-full"
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleFormChange}
                  placeholder="Full content"
                  className="textarea textarea-bordered w-full"
                  rows="6"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-white border-t">
                <button
                  onClick={() => setIsFormModalOpen(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEvent}
                  className="btn btn-primary"
                >
                  {editingEvent ? 'Update' : 'Add'} Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCorporateEvents;