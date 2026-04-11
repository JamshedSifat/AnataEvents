import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

const AdminEditService = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    icon: '',
    description: '',
    features: [],
    lightGradient: '',
    darkGradient: '',
    status: 'Active'
  });

  const gradientOptions = [
    { light: 'from-red-500 to-pink-500', dark: 'from-purple-500 to-pink-500' },
    { light: 'from-pink-500 to-red-600', dark: 'from-pink-500 to-indigo-500' },
    { light: 'from-red-600 to-orange-500', dark: 'from-indigo-500 to-cyan-500' },
    { light: 'from-orange-500 to-red-500', dark: 'from-cyan-500 to-purple-500' },
  ];

  const emojiList = ['🎯', '🏢', '🎭', '📊', '⚙️', '📢', '🏗️', '🎨', '🛋️', '🎤', '📺', '💍'];

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/services/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to load service');
        }

        const data = await response.json();
        setFormData(data);
      } catch (err) {
        setError(err.message);
        alert('Error loading service');
        navigate('/admin/services');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title.trim()) {
      setError('Service title is required');
      return;
    }

    const validFeatures = formData.features.filter(f => f.trim() !== '');

    try {
      setSubmitting(true);

      const response = await fetch(`http://localhost:5000/api/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          features: validFeatures
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update service');
      }

      alert('✅ Service updated successfully!');
      navigate('/admin/services');

    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className='ml-64 p-8 bg-gray-50 min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4'></div>
          <p className='text-xl text-gray-600'>Loading service...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='ml-64 p-8 bg-gray-50 min-h-screen'>
      <h2 className='text-3xl font-bold text-gray-800 mb-8'>Edit Service</h2>

      <div className='bg-white p-8 rounded-lg shadow-md max-w-3xl'>
        {error && (
          <div className='mb-6 bg-red-100 border-l-4 border-red-600 text-red-700 p-4 rounded'>
            <p className='font-semibold'>⚠️ Error</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Title */}
          <div>
            <label className='block text-gray-700 font-semibold mb-2'>Service Title *</label>
            <input
              type='text'
              name='title'
              value={formData.title}
              onChange={handleChange}
              className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
              disabled={submitting}
              required
            />
          </div>

          {/* Icon Selection */}
          <div>
            <label className='block text-gray-700 font-semibold mb-3'>Icon</label>
            <div className='grid grid-cols-6 gap-2'>
              {emojiList.map((emoji) => (
                <button
                  key={emoji}
                  type='button'
                  onClick={() => setFormData(prev => ({ ...prev, icon: emoji }))}
                  disabled={submitting}
                  className={`p-3 text-2xl rounded-lg border-2 transition ${
                    formData.icon === emoji
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className='block text-gray-700 font-semibold mb-2'>Description *</label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleChange}
              rows='5'
              className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
              disabled={submitting}
              required
            ></textarea>
          </div>

          {/* Features */}
          <div>
            <label className='block text-gray-700 font-semibold mb-3'>Features</label>
            <div className='space-y-3'>
              {formData.features.map((feature, index) => (
                <div key={index} className='flex gap-2'>
                  <input
                    type='text'
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className='flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                    disabled={submitting}
                  />
                  <button
                    type='button'
                    onClick={() => removeFeature(index)}
                    disabled={submitting}
                    className='bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition'
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type='button'
                onClick={addFeature}
                disabled={submitting}
                className='w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition'
              >
                + Add Feature
              </button>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className='block text-gray-700 font-semibold mb-2'>Status</label>
            <select
              name='status'
              value={formData.status}
              onChange={handleChange}
              disabled={submitting}
              className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className='flex gap-4 pt-6 border-t'>
            <button
              type='submit'
              disabled={submitting}
              className='flex-1 bg-primary hover:bg-secondary text-white py-3 rounded-lg font-bold transition disabled:opacity-50'
            >
              {submitting ? 'Updating...' : '✅ Update Service'}
            </button>
            <button
              type='button'
              onClick={() => navigate('/admin/services')}
              disabled={submitting}
              className='flex-1 bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-lg font-bold transition disabled:opacity-50'
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditService;