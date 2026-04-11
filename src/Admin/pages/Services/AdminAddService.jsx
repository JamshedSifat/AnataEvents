import React, { useState } from 'react';
import { useNavigate } from 'react-router';

const AdminAddService = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    icon: '',
    description: '',
    features: ['', '', '', ''],
    lightGradient: 'from-red-500 to-pink-500',
    darkGradient: 'from-purple-500 to-pink-500',
    status: 'Active'
  });

  const gradientOptions = [
    { light: 'from-red-500 to-pink-500', dark: 'from-purple-500 to-pink-500' },
    { light: 'from-pink-500 to-red-600', dark: 'from-pink-500 to-indigo-500' },
    { light: 'from-red-600 to-orange-500', dark: 'from-indigo-500 to-cyan-500' },
    { light: 'from-orange-500 to-red-500', dark: 'from-cyan-500 to-purple-500' },
    { light: 'from-blue-500 to-purple-500', dark: 'from-blue-600 to-indigo-600' },
    { light: 'from-green-500 to-teal-500', dark: 'from-green-600 to-cyan-600' },
  ];

  const emojiList = ['🎯', '🏢', '🎭', '📊', '⚙️', '📢', '🏗️', '🎨', '🛋️', '🎤', '📺', '💍', '📸', '🎬', '🎪', '🎊'];

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

  const handleGradientSelect = (index) => {
    const gradient = gradientOptions[index];
    setFormData(prev => ({
      ...prev,
      lightGradient: gradient.light,
      darkGradient: gradient.dark
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

    if (!formData.icon) {
      setError('Please select an icon');
      return;
    }

    if (!formData.description.trim()) {
      setError('Service description is required');
      return;
    }

    const validFeatures = formData.features.filter(f => f.trim() !== '');
    if (validFeatures.length === 0) {
      setError('Please add at least one feature');
      return;
    }

    try {
      setLoading(true);

      const serviceData = {
        title: formData.title.trim(),
        icon: formData.icon,
        description: formData.description.trim(),
        features: validFeatures,
        lightGradient: formData.lightGradient,
        darkGradient: formData.darkGradient,
        status: formData.status
      };

      // API Call to backend
      const response = await fetch('http://localhost:5000/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData)
      });

      if (!response.ok) {
        throw new Error('Failed to add service');
      }

      const result = await response.json();
      console.log('Service added:', result);

      alert('✅ Service added successfully!');
      navigate('/admin/services');

    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Error adding service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='ml-64 p-8 bg-gray-50 min-h-screen'>
      <div className='mb-6'>
        <h2 className='text-3xl font-bold text-gray-800'>Add New Service</h2>
        <p className='text-gray-600 mt-2'>Create a new service offering for your clients</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Form */}
        <div className='lg:col-span-2 bg-white p-8 rounded-lg shadow-md'>
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
                placeholder='e.g., Corporate Event Management'
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition'
                disabled={loading}
              />
              <p className='text-gray-500 text-sm mt-1'>Give your service a clear, descriptive name</p>
            </div>

            {/* Icon Selection */}
            <div>
              <label className='block text-gray-700 font-semibold mb-3'>Select Icon *</label>
              <div className='grid grid-cols-8 gap-2'>
                {emojiList.map((emoji) => (
                  <button
                    key={emoji}
                    type='button'
                    onClick={() => setFormData(prev => ({ ...prev, icon: emoji }))}
                    disabled={loading}
                    className={`p-3 text-2xl rounded-lg border-2 transition transform hover:scale-110 ${
                      formData.icon === emoji
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-300 hover:border-primary'
                    }`}
                    title={emoji}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <p className='text-gray-500 text-sm mt-2'>Current selection: {formData.icon || 'None'}</p>
            </div>

            {/* Description */}
            <div>
              <label className='block text-gray-700 font-semibold mb-2'>Description *</label>
              <textarea
                name='description'
                value={formData.description}
                onChange={handleChange}
                placeholder='Enter detailed service description...'
                rows='5'
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition'
                disabled={loading}
              ></textarea>
              <p className='text-gray-500 text-sm mt-1'>{formData.description.length} characters</p>
            </div>

            {/* Features */}
            <div>
              <label className='block text-gray-700 font-semibold mb-3'>Features/Services Included</label>
              <div className='space-y-3'>
                {formData.features.map((feature, index) => (
                  <div key={index} className='flex gap-2'>
                    <div className='flex-1 relative'>
                      <span className='absolute left-4 top-3 text-gray-400'>•</span>
                      <input
                        type='text'
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder={`Feature ${index + 1}`}
                        className='w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition'
                        disabled={loading}
                      />
                    </div>
                    {formData.features.length > 1 && (
                      <button
                        type='button'
                        onClick={() => removeFeature(index)}
                        disabled={loading}
                        className='bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition disabled:opacity-50'
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type='button'
                onClick={addFeature}
                disabled={loading}
                className='w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition disabled:opacity-50'
              >
                + Add Another Feature
              </button>
            </div>

            {/* Status */}
            <div>
              <label className='block text-gray-700 font-semibold mb-2'>Status</label>
              <select
                name='status'
                value={formData.status}
                onChange={handleChange}
                disabled={loading}
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition'
              >
                <option value='Active'>🟢 Active</option>
                <option value='Inactive'>🔴 Inactive</option>
              </select>
            </div>

            {/* Buttons */}
            <div className='flex gap-4 pt-6 border-t'>
              <button
                type='submit'
                disabled={loading}
                className='flex-1 bg-primary hover:bg-secondary text-white py-3 rounded-lg font-bold transition disabled:opacity-50 flex items-center justify-center gap-2'
              >
                {loading ? (
                  <>
                    <span className='inline-block animate-spin'>⏳</span>
                    Adding...
                  </>
                ) : (
                  <>✅ Add Service</>
                )}
              </button>
              <button
                type='button'
                onClick={() => navigate('/admin/services')}
                disabled={loading}
                className='flex-1 bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-lg font-bold transition disabled:opacity-50'
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Preview Panel */}
        <div className='lg:col-span-1'>
          <div className='bg-white p-6 rounded-lg shadow-md sticky top-8'>
            <h3 className='text-xl font-bold text-gray-800 mb-4'>📋 Preview</h3>

            {formData.title && formData.icon && formData.description ? (
              <div className='space-y-4'>
                {/* Icon Preview */}
                <div className='flex justify-center'>
                  <div className={`w-16 h-16 bg-gradient-to-br ${formData.lightGradient} rounded-2xl flex items-center justify-center text-3xl text-white shadow-lg`}>
                    {formData.icon}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h4 className='font-bold text-lg text-primary text-center'>{formData.title}</h4>
                </div>

                {/* Description */}
                <div className='text-gray-700 text-sm'>
                  <p className='line-clamp-3'>{formData.description}</p>
                </div>

                {/* Features */}
                <div>
                  <p className='text-xs font-semibold text-gray-600 mb-2'>Features:</p>
                  <ul className='space-y-1'>
                    {formData.features.filter(f => f).map((feature, idx) => (
                      <li key={idx} className='flex items-start text-xs text-gray-700'>
                        <span className='text-primary mr-2'>•</span>
                        <span className='line-clamp-2'>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Status Badge */}
                <div className='text-center'>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    formData.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {formData.status}
                  </span>
                </div>

                {/* Gradient Preview */}
                <div>
                  <p className='text-xs font-semibold text-gray-600 mb-2'>Color Gradient:</p>
                  <div className={`w-full h-12 bg-gradient-to-r ${formData.lightGradient} rounded-lg`}></div>
                </div>
              </div>
            ) : (
              <div className='text-center py-8'>
                <p className='text-gray-500 text-sm'>Fill the form to see preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAddService;