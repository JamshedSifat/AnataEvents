// File: src/Admin/Pages/Portfolio/PortfolioManagement.jsx
import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, Search, Upload, X } from 'lucide-react';

const PortfolioManagement = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [filteredPortfolios, setFilteredPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    category: 'Weddings',
    image: '',
    gallery: [],
    description: '',
    client: '',
    date: new Date().toISOString().split('T')[0],
    budget: ''
  });
  const [imageInput, setImageInput] = useState('');

  const categories = ['Weddings', 'Corporate', 'Galas', 'Private', 'Luxury'];

  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = () => {
    try {
      setLoading(true);
      const savedPortfolios = localStorage.getItem('portfolios');
      if (savedPortfolios) {
        const data = JSON.parse(savedPortfolios);
        setPortfolios(data);
        setFilteredPortfolios(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading portfolios:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = portfolios;
    if (searchTerm) {
      filtered = filtered.filter(portfolio =>
        portfolio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        portfolio.client.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredPortfolios(filtered);
  }, [searchTerm, portfolios]);

  const handleOpenModal = (portfolio = null) => {
    if (portfolio) {
      setEditingPortfolio(portfolio);
      setFormData(portfolio);
    } else {
      setEditingPortfolio(null);
      setFormData({
        id: '',
        title: '',
        category: 'Weddings',
        image: '',
        gallery: [],
        description: '',
        client: '',
        date: new Date().toISOString().split('T')[0],
        budget: ''
      });
    }
    setImageInput('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPortfolio(null);
    setImageInput('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ Handle file upload
  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
        addImage(base64String);
      };
      reader.readAsDataURL(file);
    });
  };

  // ✅ Handle image URL input
  const handleAddImageUrl = () => {
    if (imageInput.trim()) {
      addImage(imageInput.trim());
      setImageInput('');
    }
  };

  // ✅ Add image to gallery
  const addImage = (imageUrl) => {
    if (!formData.gallery.includes(imageUrl)) {
      const updatedGallery = [...formData.gallery, imageUrl];
      setFormData(prev => ({
        ...prev,
        gallery: updatedGallery,
        image: updatedGallery[0] // Set first image as main
      }));
    }
  };

  // ✅ Remove image from gallery
  const removeImage = (index) => {
    const updatedGallery = formData.gallery.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      gallery: updatedGallery,
      image: updatedGallery[0] || ''
    }));
  };

  // ✅ Set as main image
  const setAsMainImage = (index) => {
    const mainImage = formData.gallery[index];
    const updatedGallery = [
      mainImage,
      ...formData.gallery.slice(0, index),
      ...formData.gallery.slice(index + 1)
    ];
    setFormData(prev => ({
      ...prev,
      gallery: updatedGallery,
      image: mainImage
    }));
  };

  const handleSavePortfolio = () => {
    if (!formData.title || !formData.description || !formData.client || !formData.image) {
      alert('Please fill all required fields and upload at least one image');
      return;
    }

    const newFormData = {
      ...formData,
      id: formData.id || Date.now()
    };

    let updatedPortfolios;
    if (editingPortfolio) {
      updatedPortfolios = portfolios.map(portfolio => 
        portfolio.id === editingPortfolio.id ? newFormData : portfolio
      );
    } else {
      updatedPortfolios = [...portfolios, newFormData];
    }

    localStorage.setItem('portfolios', JSON.stringify(updatedPortfolios));
    setPortfolios(updatedPortfolios);
    handleCloseModal();
    alert(editingPortfolio ? 'Portfolio updated successfully!' : 'Portfolio created successfully!');
  };

  const handleDeletePortfolio = (id) => {
    if (window.confirm('Are you sure you want to delete this portfolio?')) {
      const updatedPortfolios = portfolios.filter(portfolio => portfolio.id !== id);
      localStorage.setItem('portfolios', JSON.stringify(updatedPortfolios));
      setPortfolios(updatedPortfolios);
      alert('Portfolio deleted successfully!');
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Management</h1>
        <p className="text-gray-600">Manage your event portfolio and showcase</p>
      </div>

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="w-full sm:w-64">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search portfolios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-10"
            />
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn btn-primary gap-2 w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          Add New Portfolio
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Portfolios</h3>
          <p className="text-3xl font-bold text-primary">{portfolios.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Categories</h3>
          <p className="text-3xl font-bold text-primary">{new Set(portfolios.map(p => p.category)).size}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Images</h3>
          <p className="text-3xl font-bold text-primary">{portfolios.reduce((sum, p) => sum + p.gallery.length, 0)}</p>
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Client</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Images</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Budget</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPortfolios.length > 0 ? (
                filteredPortfolios.map(portfolio => (
                  <tr key={portfolio.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      <div className="line-clamp-1">{portfolio.title}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="badge badge-sm">{portfolio.category}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{portfolio.client}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="badge badge-secondary">{portfolio.gallery.length}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{portfolio.budget}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(portfolio.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenModal(portfolio)}
                          className="btn btn-sm btn-ghost gap-1"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePortfolio(portfolio.id)}
                          className="btn btn-sm btn-ghost text-error gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No portfolios found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingPortfolio ? 'Edit Portfolio' : 'Add New Portfolio'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="Enter portfolio title"
                />
              </div>

              {/* Client */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Client *</label>
                <input
                  type="text"
                  name="client"
                  value={formData.client}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="Enter client name"
                />
              </div>

              {/* Category & Date Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="select select-bordered w-full"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Budget</label>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="e.g., $75,000"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered w-full"
                  placeholder="Enter portfolio description"
                  rows="3"
                />
              </div>

              {/* Image Upload Section */}
              <div className="divider">Gallery Images</div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Upload Images</label>
                <label className="flex items-center justify-center w-full px-4 py-6 bg-gray-50 border-2 border-dashed border-primary rounded-lg cursor-pointer hover:bg-gray-100 transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-primary mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Image URL Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Or Add Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="input input-bordered w-full"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddImageUrl()}
                  />
                  <button
                    onClick={handleAddImageUrl}
                    className="btn btn-primary"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Images Preview */}
              {formData.gallery.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Gallery Images ({formData.gallery.length})
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {formData.gallery.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className={`w-full h-24 object-cover rounded-lg border-2 ${
                            formData.image === image ? 'border-primary' : 'border-gray-300'
                          }`}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-lg transition flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          {formData.image !== image && (
                            <button
                              onClick={() => setAsMainImage(index)}
                              className="btn btn-xs btn-warning"
                              title="Set as main"
                            >
                              Main
                            </button>
                          )}
                          <button
                            onClick={() => removeImage(index)}
                            className="btn btn-xs btn-error"
                            title="Remove"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        {formData.image === image && (
                          <span className="absolute top-2 right-2 badge badge-primary text-xs">Main</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePortfolio}
                className="btn btn-primary"
              >
                {editingPortfolio ? 'Update Portfolio' : 'Create Portfolio'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioManagement;