import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function MagicianForm({ magician, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    rating: 4.5,
    tour_status: 'Active',
    city: '',
    language: '',
    bio: '',
    famous_show: '',
    experience_years: 1,
    followers: '',
    awards: [],
    genres: []
  });

  const [newAward, setNewAward] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const GENRE_OPTIONS = [
    'Street Magic',
    'Close-up Magic',
    'Illusion',
    'Card Tricks',
    'Coin Magic',
    'Mentalism',
    'Comedy Magic',
    'Stage Illusion',
    'Escape Artist',
    'Levitation'
  ];

  useEffect(() => {
    if (magician) {
      setFormData(magician);
    }
  }, [magician]);

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

  const toggleGenre = (genre) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Magician name is required');
      return;
    }

    if (!formData.image.trim()) {
      toast.error('Image URL is required');
      return;
    }

    if (!formData.city.trim()) {
      toast.error('City is required');
      return;
    }

    if (formData.genres.length === 0) {
      toast.error('Select at least one magic specialty');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      setFormData({
        name: '',
        image: '',
        rating: 4.5,
        tour_status: 'Active',
        city: '',
        language: '',
        bio: '',
        famous_show: '',
        experience_years: 1,
        followers: '',
        awards: [],
        genres: []
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save magician');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Magician Name *</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="input input-bordered w-full"
          placeholder="Enter magician name"
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

      {/* Bio */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Biography</span>
        </label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          className="textarea textarea-bordered w-full"
          placeholder="Enter magician biography"
          rows="3"
          disabled={isSubmitting}
        />
      </div>

      {/* City & Language */}
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
            <span className="label-text font-bold">Language</span>
          </label>
          <input
            type="text"
            name="language"
            value={formData.language}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="e.g., Bengali, English"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Famous Show */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Signature Show</span>
        </label>
        <input
          type="text"
          name="famous_show"
          value={formData.famous_show}
          onChange={handleInputChange}
          className="input input-bordered w-full"
          placeholder="e.g., Street Magic Spectacular"
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
            <span className="label-text font-bold">Followers</span>
          </label>
          <input
            type="text"
            name="followers"
            value={formData.followers}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="e.g., 1M+"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Tour Status */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Tour Status</span>
        </label>
        <select
          name="tour_status"
          value={formData.tour_status}
          onChange={handleInputChange}
          className="select select-bordered w-full"
          disabled={isSubmitting}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="On Break">On Break</option>
        </select>
      </div>

      {/* Magic Specialties */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Magic Specialties *</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {GENRE_OPTIONS.map(genre => (
            <button
              key={genre}
              type="button"
              onClick={() => toggleGenre(genre)}
              className={`btn btn-sm ${
                formData.genres.includes(genre) ? 'btn-primary' : 'btn-outline'
              }`}
              disabled={isSubmitting}
            >
              {genre}
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
            magician ? 'Update Magician' : 'Add Magician'
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