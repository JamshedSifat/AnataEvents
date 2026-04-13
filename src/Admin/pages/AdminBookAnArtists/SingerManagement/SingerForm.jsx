import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function SingerForm({ singer, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    rating: 4.5,
    genre: '',
    description: '',
    experience: '',
    location: '',
    availability: 'Available',
    popularSongs: [],
    specialties: [],
    awards: [],
    socialMedia: {
      facebook: '',
      instagram: '',
      youtube: ''
    }
  });

  const [newSong, setNewSong] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newAward, setNewAward] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const GENRE_OPTIONS = [
    'Pop',
    'Romantic',
    'Folk',
    'Classical',
    'Bhangra',
    'Classical Fusion',
    'Modern',
    'Traditional',
    'Devotional',
    'Duet'
  ];

  useEffect(() => {
    if (singer) {
      setFormData(singer);
    }
  }, [singer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['rating'].includes(name) ? parseFloat(value) : value
    }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [name]: value
      }
    }));
  };

  const addSong = () => {
    if (newSong.trim()) {
      setFormData(prev => ({
        ...prev,
        popularSongs: [...prev.popularSongs, newSong]
      }));
      setNewSong('');
    }
  };

  const removeSong = (index) => {
    setFormData(prev => ({
      ...prev,
      popularSongs: prev.popularSongs.filter((_, i) => i !== index)
    }));
  };

  const addSpecialty = () => {
    if (newSpecialty.trim()) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty]
      }));
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (index) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index)
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
      toast.error('Singer name is required');
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

    if (formData.specialties.length === 0) {
      toast.error('Add at least one specialty');
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
        description: '',
        experience: '',
        location: '',
        availability: 'Available',
        popularSongs: [],
        specialties: [],
        awards: [],
        socialMedia: {
          facebook: '',
          instagram: '',
          youtube: ''
        }
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save singer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Singer Name *</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="input input-bordered w-full"
          placeholder="Enter singer name"
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

      {/* Description */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Description</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="textarea textarea-bordered w-full"
          placeholder="Enter singer description"
          rows="3"
          disabled={isSubmitting}
        />
      </div>

      {/* Experience & Location */}
      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="label">
            <span className="label-text font-bold">Experience</span>
          </label>
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="e.g., 15 years"
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label className="label">
            <span className="label-text font-bold">Location</span>
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="e.g., Dhaka, Bangladesh"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Rating & Availability */}
      <div className="grid grid-cols-2 gap-4">
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
            <span className="label-text font-bold">Availability</span>
          </label>
          <select
            name="availability"
            value={formData.availability}
            onChange={handleInputChange}
            className="select select-bordered w-full"
            disabled={isSubmitting}
          >
            <option value="Available">Available</option>
            <option value="Not Available">Not Available</option>
            <option value="On Request">On Request</option>
          </select>
        </div>
      </div>

      {/* Popular Songs */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Popular Songs</span>
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newSong}
            onChange={(e) => setNewSong(e.target.value)}
            className="input input-bordered flex-1"
            placeholder="Add a popular song"
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={addSong}
            className="btn btn-secondary"
            disabled={isSubmitting || !newSong.trim()}
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.popularSongs.map((song, idx) => (
            <div key={idx} className="badge badge-lg gap-2 badge-primary">
              {song}
              <button
                type="button"
                onClick={() => removeSong(idx)}
                className="btn btn-xs btn-ghost"
                disabled={isSubmitting}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Specialties */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Specialties *</span>
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newSpecialty}
            onChange={(e) => setNewSpecialty(e.target.value)}
            className="input input-bordered flex-1"
            placeholder="Add a specialty"
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={addSpecialty}
            className="btn btn-secondary"
            disabled={isSubmitting || !newSpecialty.trim()}
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.specialties.map((specialty, idx) => (
            <div key={idx} className="badge badge-lg gap-2 badge-primary">
              {specialty}
              <button
                type="button"
                onClick={() => removeSpecialty(idx)}
                className="btn btn-xs btn-ghost"
                disabled={isSubmitting}
              >
                ✕
              </button>
            </div>
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

      {/* Social Media */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Social Media</span>
        </label>
        <div className="space-y-3">
          <input
            type="text"
            name="facebook"
            value={formData.socialMedia.facebook}
            onChange={handleSocialChange}
            className="input input-bordered w-full"
            placeholder="Facebook URL"
            disabled={isSubmitting}
          />
          <input
            type="text"
            name="instagram"
            value={formData.socialMedia.instagram}
            onChange={handleSocialChange}
            className="input input-bordered w-full"
            placeholder="Instagram URL"
            disabled={isSubmitting}
          />
          <input
            type="text"
            name="youtube"
            value={formData.socialMedia.youtube}
            onChange={handleSocialChange}
            className="input input-bordered w-full"
            placeholder="YouTube URL"
            disabled={isSubmitting}
          />
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
            singer ? 'Update Singer' : 'Add Singer'
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