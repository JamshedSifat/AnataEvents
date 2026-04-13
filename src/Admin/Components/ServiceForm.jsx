import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const EMOJI_ICONS = [
  '🎯', '🏢', '🎭', '📊', '⚙️', '📢', '🏗️', '🎨',
  '🛋️', '🎤', '📺', '💍', '🎪', '🎬', '🎸', '🎵'
];

const GRADIENT_PRESETS = [
  { light: 'from-red-500 to-pink-500', dark: 'from-purple-500 to-pink-500', name: 'Red-Pink' },
  { light: 'from-pink-500 to-red-600', dark: 'from-pink-500 to-indigo-500', name: 'Pink-Red' },
  { light: 'from-red-600 to-orange-500', dark: 'from-indigo-500 to-cyan-500', name: 'Red-Orange' },
  { light: 'from-orange-500 to-red-500', dark: 'from-cyan-500 to-purple-500', name: 'Orange-Red' },
  { light: 'from-blue-500 to-purple-500', dark: 'from-blue-600 to-pink-600', name: 'Blue-Purple' },
  { light: 'from-purple-500 to-pink-500', dark: 'from-purple-700 to-pink-700', name: 'Purple-Pink' },
];

export default function ServiceForm({ service, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    icon: '🎯',
    title: '',
    description: '',
    features: [''],
    lightGradient: 'from-red-500 to-pink-500',
    darkGradient: 'from-purple-500 to-pink-500',
    status: 'active'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData(service);
    }
  }, [service]);

  const handleInputChange = (e) => {
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

  const handleGradientSelect = (preset) => {
    setFormData(prev => ({
      ...prev,
      lightGradient: preset.light,
      darkGradient: preset.dark
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error('Service title is required');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }

    if (formData.features.filter(f => f.trim()).length === 0) {
      toast.error('At least one feature is required');
      return;
    }

    // Filter out empty features
    const cleanedData = {
      ...formData,
      features: formData.features.filter(f => f.trim())
    };

    try {
      setIsSubmitting(true);
      await onSubmit(cleanedData);
      // Reset form after successful submission
      setFormData({
        icon: '🎯',
        title: '',
        description: '',
        features: [''],
        lightGradient: 'from-red-500 to-pink-500',
        darkGradient: 'from-purple-500 to-pink-500',
        status: 'active'
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (formData.title || formData.description || formData.features.some(f => f.trim())) {
      if (window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
        setFormData({
          icon: '🎯',
          title: '',
          description: '',
          features: [''],
          lightGradient: 'from-red-500 to-pink-500',
          darkGradient: 'from-purple-500 to-pink-500',
          status: 'active'
        });
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Icon Selection */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Select Icon</span>
        </label>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {EMOJI_ICONS.map(emoji => (
            <button
              key={emoji}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, icon: emoji }))}
              className={`btn btn-lg text-2xl ${
                formData.icon === emoji ? 'btn-primary' : 'btn-ghost'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Service Title *</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="input input-bordered w-full"
          placeholder="e.g: Event Management"
          maxLength={50}
          disabled={isSubmitting}
        />
        <label className="label">
          <span className="label-text-alt text-xs text-base-content/50">
            {formData.title.length}/50
          </span>
        </label>
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Description *</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="textarea textarea-bordered w-full"
          placeholder="Enter detailed service description..."
          rows="4"
          maxLength={500}
          disabled={isSubmitting}
        />
        <label className="label">
          <span className="label-text-alt text-xs text-base-content/50">
            {formData.description.length}/500
          </span>
        </label>
      </div>

      {/* Features */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Features *</span>
        </label>
        <div className="space-y-3">
          {formData.features.map((feature, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                className="input input-bordered flex-1"
                placeholder={`Feature ${index + 1}`}
                maxLength={50}
                disabled={isSubmitting}
              />
              {formData.features.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="btn btn-error btn-sm"
                  disabled={isSubmitting}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addFeature}
          className="btn btn-outline btn-sm mt-3 w-full"
          disabled={isSubmitting}
        >
          + Add More Features
        </button>
      </div>

      {/* Gradient Selection */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Select Color Scheme</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {GRADIENT_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleGradientSelect(preset)}
              disabled={isSubmitting}
              className={`p-3 rounded-lg border-2 transition ${
                formData.lightGradient === preset.light
                  ? 'border-primary'
                  : 'border-base-300'
              }`}
            >
              <div
                className={`h-8 rounded bg-gradient-to-r ${preset.light} mb-1`}
              ></div>
              <div className="text-xs font-bold">{preset.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Status</span>
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          className="select select-bordered w-full"
          disabled={isSubmitting}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Preview */}
      <div className="form-group bg-base-200 p-4 rounded-lg">
        <label className="label">
          <span className="label-text font-bold">Preview</span>
        </label>
        <div className={`bg-gradient-to-br ${formData.lightGradient} p-4 rounded-lg text-white`}>
          <div className="text-3xl mb-2">{formData.icon}</div>
          <h3 className="font-bold text-lg mb-1">{formData.title || 'Service Name'}</h3>
          <p className="text-sm opacity-90 mb-3 line-clamp-2">
            {formData.description || 'Service description will appear here'}
          </p>
          <ul className="text-xs space-y-1">
            {formData.features.slice(0, 2).map((f, i) => (
              <li key={i}>{f || `Feature ${i + 1}`}</li>
            ))}
            {formData.features.length > 2 && (
              <li>+{formData.features.length - 2} more</li>
            )}
          </ul>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-6">
        <button
          type="submit"
          className="btn btn-primary flex-1 gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Saving...
            </>
          ) : (
            service ? 'Update Service' : 'Save Service'
          )}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="btn btn-ghost flex-1"
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}