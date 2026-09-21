import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function DjForm({ dj, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    rating: 4.5,
    genre: '',
    famous_for: '',
    experience_years: 1,
    city: '',
    country: '',
    awards: [],
    media_presence: '',
    social_followers: '',
    status: 'Active'
  });

  const [newAward, setNewAward] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const GENRE_OPTIONS = [
    'Electronic',
    'EDM',
    'House',
    'Hip-Hop',
    'Bollywood',
    'Techno',
    'Trance',
    'Dubstep',
    'Deep House',
    'Remix'
  ];

  useEffect(() => {
    if (dj) {
      setFormData(dj);
    }
  }, [dj]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['rating', 'experience_years'].includes(name) ? parseFloat(value) : value
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('DJ name is required');
      return;
    }

    if (!formData.image.trim()) {
      toast.error('Image URL is required');
      return;
    }

    if (!formData.genre.trim()) {
      toast.error('Genre is required');
      return;
    }

    if (!formData.city.trim() || !formData.country.trim()) {
      toast.error('City and country are required');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      setFormData({
        name: '',
        image: '',
        rating: 4.5,
        genre: '',
        famous_for: '',
        experience_years: 1,
        city: '',
        country: '',
        awards: [],
        media_presence: '',
        social_followers: '',
        status: 'Active'
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save DJ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">DJ Name *</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="input input-bordered w-full"
          placeholder="Enter DJ name"
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

      {/* Genre */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Genre *</span>
        </label>
        <select
          name="genre"
          value={formData.genre}
          onChange={handleInputChange}
          className="select select-bordered w-full"
          disabled={isSubmitting}
        >
          <option value="">Select Genre</option>
          {GENRE_OPTIONS.map(genre => (
            <option key={genre} value={genre}>{genre}</option>
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
          placeholder="What is this DJ famous for?"
          rows="3"
          disabled={isSubmitting}
        />
      </div>

      {/* Location */}
      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="label">
            <span className="label-text font-bold">City *</span>
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="e.g., Dhaka"
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label className="label">
            <span className="label-text font-bold">Country *</span>
          </label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="e.g., Bangladesh"
            disabled={isSubmitting}
          />
        </div>
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

      {/* Social Info */}
      <div className="grid grid-cols-2 gap-4">
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
        <div className="form-group">
          <label className="label">
            <span className="label-text font-bold">Social Followers</span>
          </label>
          <input
            type="text"
            name="social_followers"
            value={formData.social_followers}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="e.g., 500K+"
            disabled={isSubmitting}
          />
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
            dj ? 'Update DJ' : 'Add DJ'
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