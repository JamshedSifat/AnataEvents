import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Upload, X } from 'lucide-react';

export default function TestimonialForm({ testimonial, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    company: '',
    image: '',
    rating: 5,
    review: '',
    eventType: ''
  });

  const [preview, setPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('url');

  const EVENT_TYPES = [
    'Corporate Event',
    'Wedding',
    'Birthday',
    'Conference',
    'Product Launch',
    'Exhibition',
    'Concert',
    'Fashion Show'
  ];

  useEffect(() => {
    if (testimonial) {
      setFormData(testimonial);
      setPreview(testimonial.image);
      setUploadMethod('url');
    }
  }, [testimonial]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['rating'].includes(name) ? parseInt(value) : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed');
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (url) => {
    setFormData(prev => ({
      ...prev,
      image: url
    }));
    if (url) {
      setPreview(url);
    }
  };

  const removeFile = () => {
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
    setPreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Client name is required');
      return;
    }

    if (!formData.designation.trim()) {
      toast.error('Designation is required');
      return;
    }

    if (!formData.company.trim()) {
      toast.error('Company name is required');
      return;
    }

    if (!formData.image) {
      toast.error('Image is required');
      return;
    }

    if (!formData.review.trim()) {
      toast.error('Review is required');
      return;
    }

    try {
      setIsSubmitting(true);

      let imageUrl = formData.image;

      if (typeof formData.image === 'object' && formData.image.type) {
        imageUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.readAsDataURL(formData.image);
        });
      }

      const submitData = {
        name: formData.name,
        designation: formData.designation,
        company: formData.company,
        image: imageUrl,
        rating: formData.rating,
        review: formData.review,
        eventType: formData.eventType
      };

      await onSubmit(submitData);

      setFormData({
        name: '',
        designation: '',
        company: '',
        image: '',
        rating: 5,
        review: '',
        eventType: ''
      });
      setPreview('');
      setUploadMethod('url');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save testimonial');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Client Name *</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="input input-bordered w-full"
          placeholder="Enter client name"
          disabled={isSubmitting}
        />
      </div>

      {/* Designation */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Designation *</span>
        </label>
        <input
          type="text"
          name="designation"
          value={formData.designation}
          onChange={handleInputChange}
          className="input input-bordered w-full"
          placeholder="e.g., CEO, Manager"
          disabled={isSubmitting}
        />
      </div>

      {/* Company */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Company *</span>
        </label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleInputChange}
          className="input input-bordered w-full"
          placeholder="Enter company name"
          disabled={isSubmitting}
        />
      </div>

      {/* Event Type */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Event Type</span>
        </label>
        <select
          name="eventType"
          value={formData.eventType}
          onChange={handleInputChange}
          className="select select-bordered w-full"
          disabled={isSubmitting}
        >
          <option value="">Select Event Type</option>
          {EVENT_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Rating */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Rating (1-5) *</span>
        </label>
        <select
          name="rating"
          value={formData.rating}
          onChange={handleInputChange}
          className="select select-bordered w-full"
          disabled={isSubmitting}
        >
          <option value={1}>⭐ 1 - Poor</option>
          <option value={2}>⭐⭐ 2 - Fair</option>
          <option value={3}>⭐⭐⭐ 3 - Good</option>
          <option value={4}>⭐⭐⭐⭐ 4 - Very Good</option>
          <option value={5}>⭐⭐⭐⭐⭐ 5 - Excellent</option>
        </select>
      </div>

      {/* Review */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Review/Testimonial *</span>
        </label>
        <textarea
          name="review"
          value={formData.review}
          onChange={handleInputChange}
          className="textarea textarea-bordered w-full"
          placeholder="Enter the testimonial review"
          rows="4"
          disabled={isSubmitting}
        />
      </div>

      {/* Upload Method Tabs */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Profile Image *</span>
        </label>
        <div className="tabs tabs-boxed mb-4">
          <a
            onClick={() => {
              setUploadMethod('url');
              setFormData(prev => ({ ...prev, image: '' }));
              setPreview('');
            }}
            className={`tab cursor-pointer ${uploadMethod === 'url' ? 'tab-active' : ''}`}
          >
            URL
          </a>
          <a
            onClick={() => {
              setUploadMethod('file');
              setFormData(prev => ({ ...prev, image: '' }));
              setPreview('');
            }}
            className={`tab cursor-pointer ${uploadMethod === 'file' ? 'tab-active' : ''}`}
          >
            Upload
          </a>
        </div>

        {/* URL Input */}
        {uploadMethod === 'url' && (
          <input
            type="url"
            value={typeof formData.image === 'string' ? formData.image : ''}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="input input-bordered w-full"
            placeholder="https://example.com/image.jpg"
            disabled={isSubmitting}
          />
        )}

        {/* File Upload */}
        {uploadMethod === 'file' && (
          <div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="imageInput"
                disabled={isSubmitting}
              />
              <label htmlFor="imageInput" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG up to 5MB
                </p>
              </label>
            </div>

            {formData.image && typeof formData.image === 'object' && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {formData.image.name}
                </span>
                <button
                  type="button"
                  onClick={removeFile}
                  className="btn btn-ghost btn-sm"
                  disabled={isSubmitting}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image Preview */}
      {preview && (
        <div className="form-group">
          <label className="label">
            <span className="label-text font-bold">Preview</span>
          </label>
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary">
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
          </div>
        </div>
      )}

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
            testimonial ? 'Update Testimonial' : 'Add Testimonial'
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