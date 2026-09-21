
import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, Search, Eye, Image as ImageIcon } from 'lucide-react';

const AdminInfluencers = () => {
  const [influencers, setInfluencers] = useState([]);
  const [filteredInfluencers, setFilteredInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingInfluencer, setEditingInfluencer] = useState(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    category: '',
    followers: '',
    image: '',
    description: '',
    engagement: '',
    posts: '',
    platforms: [],
    bio: '',
    avgReach: ''
  });
  const [platformInput, setPlatformInput] = useState('');

  const categories = ['Fashion', 'Education', 'Comedy', 'Travel', 'Entertainment', 'Tech', 'Food', 'Beauty', 'Sports', 'Music', 'Fitness', 'Gaming'];

  useEffect(() => {
    loadInfluencers();
  }, []);

  const loadInfluencers = () => {
    try {
      setLoading(true);
      let data = [];
      const savedInfluencers = localStorage.getItem('influencers');
      
      if (savedInfluencers) {
        data = JSON.parse(savedInfluencers);
      } else {
        data = [
          {
            _id: '1',
            name: "Nodi Chowdhury",
            category: "Fashion",
            followers: "250K",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPrYP2N4PqKhrbzA0fT9vsJtQ26ti9OUf4Eg&s",
            description: "Fashion influencer with trending styles",
            engagement: "4.2%",
            posts: "14",
            platforms: ["Instagram", "TikTok", "YouTube"],
            bio: "Fashion enthusiast sharing latest trends and styling tips",
            avgReach: "125K per post",
            createdAt: new Date().toISOString()
          },
          {
            _id: '2',
            name: "Ayman Sadiq",
            category: "Education",
            followers: "2.3M+",
            image: "https://yt3.googleusercontent.com/NtAHSyzlrYdBt_Mpbr5UeV3Vs2OMEseNRB6VdCufotcWIOfC2842LlfsshCpYyO3J0HoZ0gw=s900-c-k-c0x00ffffff-no-rj",
            description: "Founder of 10 Minute School, motivational speaker",
            engagement: "5.5%",
            posts: "25",
            platforms: ["YouTube", "Facebook"],
            bio: "Education, skills, and self-development content",
            avgReach: "500K per post",
            createdAt: new Date().toISOString()
          },
        ];
        localStorage.setItem('influencers', JSON.stringify(data));
      }

      setInfluencers(data);
      setFilteredInfluencers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading influencers:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = influencers;

    if (searchTerm) {
      filtered = filtered.filter(inf =>
        inf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inf.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredInfluencers(filtered);
  }, [searchTerm, influencers]);

  const generateUniqueId = () => {
    return `inf-${Date.now()}`;
  };

  const handleAddNew = () => {
    setEditingInfluencer(null);
    setImageUrlInput('');
    setPlatformInput('');
    setFormData({
      _id: generateUniqueId(),
      name: '',
      category: '',
      followers: '',
      image: '',
      description: '',
      engagement: '',
      posts: '',
      platforms: [],
      bio: '',
      avgReach: '',
      createdAt: new Date().toISOString()
    });
    setIsFormModalOpen(true);
  };

  const handleEdit = (inf) => {
    setEditingInfluencer(inf);
    setImageUrlInput('');
    setPlatformInput('');
    setFormData(inf);
    setIsFormModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

  const handleAddPlatform = () => {
    if (platformInput.trim() && !formData.platforms.includes(platformInput.trim())) {
      setFormData(prev => ({
        ...prev,
        platforms: [...prev.platforms, platformInput.trim()]
      }));
      setPlatformInput('');
    }
  };

  const handleRemovePlatform = (platform) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.filter(p => p !== platform)
    }));
  };

  const handleSaveInfluencer = () => {
    if (!formData.name.trim()) {
      alert('Name is required');
      return;
    }
    if (!formData.category) {
      alert('Category is required');
      return;
    }
    if (!formData.image.trim()) {
      alert('Image is required');
      return;
    }

    let updatedInfluencers;
    if (editingInfluencer) {
      updatedInfluencers = influencers.map(i => i._id === editingInfluencer._id ? formData : i);
      alert('Influencer updated successfully!');
    } else {
      updatedInfluencers = [...influencers, formData];
      alert('Influencer added successfully!');
    }

    localStorage.setItem('influencers', JSON.stringify(updatedInfluencers));
    setInfluencers(updatedInfluencers);
    setIsFormModalOpen(false);
    setImageUrlInput('');
    setPlatformInput('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Permanently delete this influencer?')) {
      const updatedInfluencers = influencers.filter(i => i._id !== id);
      localStorage.setItem('influencers', JSON.stringify(updatedInfluencers));
      setInfluencers(updatedInfluencers);
      setIsDetailModalOpen(false);
      alert('Influencer deleted!');
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
          <h1 className="text-3xl font-bold text-gray-900">Influencers Management</h1>
          <button
            onClick={handleAddNew}
            className="btn btn-primary gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Influencer
          </button>
        </div>
        <p className="text-gray-600">Manage influencer profiles and details</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Influencers</h3>
          <p className="text-3xl font-bold text-blue-600">{influencers.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Categories</h3>
          <p className="text-3xl font-bold text-green-600">{[...new Set(influencers.map(i => i.category))].length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">With Images</h3>
          <p className="text-3xl font-bold text-purple-600">{influencers.filter(i => i.image).length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search influencers by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full pl-10"
          />
        </div>
      </div>

      {/* Influencers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInfluencers.length > 0 ? (
          filteredInfluencers.map(inf => (
            <div key={inf._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all">
              {/* Image Preview */}
              <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
                {inf.image ? (
                  <img
                    src={inf.image}
                    alt={inf.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-primary/90 text-white px-2 py-1 rounded text-xs font-semibold">
                  {inf.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1 text-lg">{inf.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{inf.followers} followers</p>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{inf.description}</p>

                {/* Platforms */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {inf.platforms.slice(0, 2).map((platform, idx) => (
                    <span key={idx} className="badge badge-primary text-xs">
                      {platform}
                    </span>
                  ))}
                  {inf.platforms.length > 2 && (
                    <span className="badge badge-outline text-xs">
                      +{inf.platforms.length - 2}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedInfluencer(inf);
                      setIsDetailModalOpen(true);
                    }}
                    className="btn btn-sm btn-ghost gap-1 flex-1"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(inf)}
                    className="btn btn-sm btn-ghost gap-1 flex-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(inf._id)}
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
            <p className="text-gray-500 text-lg">No influencers found</p>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {isDetailModalOpen && selectedInfluencer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">{selectedInfluencer.name}</h2>
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
                <h3 className="font-bold mb-3 text-gray-900">Profile Image</h3>
                {selectedInfluencer.image ? (
                  <img
                    src={selectedInfluencer.image}
                    alt={selectedInfluencer.name}
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/800x400?text=Image+Error'}
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">No image</p>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Name</p>
                  <p className="text-gray-900 font-bold">{selectedInfluencer.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Category</p>
                  <p className="text-gray-900">{selectedInfluencer.category}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Bio</p>
                  <p className="text-gray-700">{selectedInfluencer.bio}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Description</p>
                  <p className="text-gray-700">{selectedInfluencer.description}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Followers</p>
                  <p className="text-xl font-bold text-blue-600">{selectedInfluencer.followers}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Engagement</p>
                  <p className="text-xl font-bold text-green-600">{selectedInfluencer.engagement}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Avg Reach</p>
                  <p className="text-xl font-bold text-purple-600">{selectedInfluencer.avgReach}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Posts/Month</p>
                  <p className="text-xl font-bold text-orange-600">{selectedInfluencer.posts}</p>
                </div>
              </div>

              {/* Platforms */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Active Platforms</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedInfluencer.platforms.map((platform, idx) => (
                    <span key={idx} className="badge badge-primary">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleEdit(selectedInfluencer);
                  }}
                  className="btn btn-primary flex-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleDelete(selectedInfluencer._id);
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl my-8">
            <div className="sticky top-0 bg-gradient-to-r from-primary to-pink-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {editingInfluencer ? 'Edit Influencer' : 'Add New Influencer'}
              </h2>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="e.g., Nodi Chowdhury"
                  className="input input-bordered w-full"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  className="select select-bordered w-full"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Followers */}
              <div>
                <label className="block text-sm font-semibold mb-2">Followers</label>
                <input
                  type="text"
                  name="followers"
                  value={formData.followers}
                  onChange={handleFormChange}
                  placeholder="e.g., 250K, 2.3M+"
                  className="input input-bordered w-full"
                />
              </div>

              {/* Engagement */}
              <div>
                <label className="block text-sm font-semibold mb-2">Engagement Rate</label>
                <input
                  type="text"
                  name="engagement"
                  value={formData.engagement}
                  onChange={handleFormChange}
                  placeholder="e.g., 4.2%"
                  className="input input-bordered w-full"
                />
              </div>

              {/* Posts */}
              <div>
                <label className="block text-sm font-semibold mb-2">Posts/Month</label>
                <input
                  type="text"
                  name="posts"
                  value={formData.posts}
                  onChange={handleFormChange}
                  placeholder="e.g., 14"
                  className="input input-bordered w-full"
                />
              </div>

              {/* Avg Reach */}
              <div>
                <label className="block text-sm font-semibold mb-2">Average Reach</label>
                <input
                  type="text"
                  name="avgReach"
                  value={formData.avgReach}
                  onChange={handleFormChange}
                  placeholder="e.g., 125K per post"
                  className="input input-bordered w-full"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Short description"
                  className="textarea textarea-bordered w-full"
                  rows="2"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleFormChange}
                  placeholder="Detailed bio"
                  className="textarea textarea-bordered w-full"
                  rows="2"
                />
              </div>

              {/* Platforms */}
              <div>
                <label className="block text-sm font-semibold mb-2">Platforms</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={platformInput}
                    onChange={(e) => setPlatformInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddPlatform();
                      }
                    }}
                    placeholder="e.g., Instagram"
                    className="input input-bordered input-sm flex-1"
                  />
                  <button
                    onClick={handleAddPlatform}
                    className="btn btn-primary btn-sm"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.platforms.map((platform, idx) => (
                    <div key={idx} className="badge badge-primary gap-2">
                      {platform}
                      <button
                        onClick={() => handleRemovePlatform(platform)}
                        className="text-white hover:text-red-300"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
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
                      className="w-full h-40 object-cover rounded-lg"
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

                  {/* URL Link */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Use Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Paste image URL here..."
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddImageUrl();
                          }
                        }}
                        className="input input-bordered input-sm flex-1"
                      />
                      <button
                        onClick={handleAddImageUrl}
                        className="btn btn-primary btn-sm"
                      >
                        Add
                      </button>
                    </div>
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
                  onClick={handleSaveInfluencer}
                  className="btn btn-primary"
                >
                  {editingInfluencer ? 'Update' : 'Add'} Influencer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInfluencers;