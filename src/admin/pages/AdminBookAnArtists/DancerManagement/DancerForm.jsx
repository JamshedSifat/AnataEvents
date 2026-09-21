import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function DancerForm({ dancer, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    rating: 4.5,
    category: '',
    famous_for: '',
    experience_years: 1,
    status: 'Active',
    media_presence: '',
    styles: [],
    awards: []
  });

  const [newStyle, setNewStyle] = useState('');
  const [newAward, setNewAward] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const STYLE_OPTIONS = [
    'Classical',
    'Contemporary',
    'Hip-Hop',
    'Jazz',
    'Ballet',
    'Kathak',
    'Bharatanatyam',
    'Fusion',
    'Latin',
    'Salsa'
  ];

  const CATEGORY_OPTIONS = [
    'Contemporary',
    'Classical',
    'Hip-Hop',
    'Jazz',
    'Bollywood',
    'Street',
    'Professional'
  ];

  useEffect(() => {
    if (dancer) {
      setFormData(dancer);
    }
  }, [dancer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['rating', 'experience_years'].includes(name) ? parseFloat(value) : value
    }));
  };

  const addStyle = () => {
    if (newStyle.trim() && !formData.styles.includes(newStyle)) {
      setFormData(prev => ({
        ...prev,
        styles: [...prev.styles, newStyle]
      }));
      setNewStyle('');
    }
  };

  const removeStyle = (index) => {
    setFormData(prev => ({
      ...prev,
      styles: prev.styles.filter((_, i) => i !== index)
    }));
  };

  const addAward = () => {
    if (newAward.trim()) {
      setFormData(prev => ({
        ...prev,
        awards: [...prev.awards, newAward]
      }));
      setNewAward('');
    }
  };

  const removeAward = (index) => {
    setFormData(prev => ({
      ...prev,
      awards: prev.awards.filter((_, i) => i !== index)
    }));
  };

  const toggleStyle = (style) => {
    setFormData(prev => ({
      ...prev,
      styles: prev.styles.includes(style)
        ? prev.styles.filter(s => s !== style)
        : [...prev.styles, style]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Dancer name is required');
      return;
    }

    if (!formData.image.trim()) {
      toast.error('Image URL is required');
      return;
    }

    if (!formData.category.trim()) {
      toast.error('Category is required');
      return;
    }

    if (formData.styles.length === 0) {
      toast.error('Select at least one style');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      setFormData({
        name: '',
        image: '',
        rating: 4.5,
        category: '',
        famous_for: '',
        experience_years: 1,
        status: 'Active',
        media_presence: '',
        styles: [],
        awards: []
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save dancer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Dancer Name *</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="input input-bordered w-full"
          placeholder="Enter dancer name"
          disabled={isSubmitting}
        />
      </div>

      {/* Image URL */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Image URL *</span>
        </label>
        <input
          type="url"
          name="image"
          value={formData.image}
          onChange={handleInputChange}
          className="input input-bordered w-full"
          placeholder="https://example.com/image.jpg"
          disabled={isSubmitting}
        />
        {formData.image && (
          <img src={formData.image} alt="preview" className="h-32 mt-2 rounded" />
        )}
      </div>

      {/* Category */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Category *</span>
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="select select-bordered w-full"
          disabled={isSubmitting}
        >
          <option value="">Select Category</option>
          {CATEGORY_OPTIONS.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Famous For */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Famous For</span>
        </label>
        <textarea
          name="famous_for"
          value={formData.famous_for}
          onChange={handleInputChange}
          className="textarea textarea-bordered w-full"
          placeholder="What is this dancer famous for?"
          rows="3"
          disabled={isSubmitting}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="form-group">
          <label className="label">
            <span className="label-text font-bold">Rating</span>
          </label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            min="0"
            max="5"
            step="0.1"
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label className="label">
            <span className="label-text font-bold">Experience (Years)</span>
          </label>
          <input
            type="number"
            name="experience_years"
            value={formData.experience_years}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            min="0"
            disabled={isSubmitting}
          />
        </div>
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
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="On Break">On Break</option>
          </select>
        </div>
      </div>

      {/* Media Presence */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Media Presence</span>
        </label>
        <input
          type="text"
          name="media_presence"
          value={formData.media_presence}
          onChange={handleInputChange}
          className="input input-bordered w-full"
          placeholder="e.g., Instagram, YouTube, TikTok"
          disabled={isSubmitting}
        />
      </div>

      {/* Styles */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Select Dance Styles *</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-4">
          {STYLE_OPTIONS.map(style => (
            <button
              key={style}
              type="button"
              onClick={() => toggleStyle(style)}
              className={`btn btn-sm ${
                formData.styles.includes(style) ? 'btn-primary' : 'btn-outline'
              }`}
              disabled={isSubmitting}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Awards */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Awards</span>
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newAward}
            onChange={(e) => setNewAward(e.target.value)}
            className="input input-bordered flex-1"
            placeholder="Add an award"
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={addAward}
            className="btn btn-secondary"
            disabled={isSubmitting || !newAward.trim()}
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.awards.map((award, idx) => (
            <div key={idx} className="badge badge-lg gap-2 badge-primary">
              {award}
              <button
                type="button"
                onClick={() => removeAward(idx)}
                className="btn btn-xs btn-ghost"
                disabled={isSubmitting}
              >
                ✕
              </button>
            </div>
          ))}
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
            dancer ? 'Update Dancer' : 'Add Dancer'
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-ghost flex-1"
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}