import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Upload, X } from 'lucide-react';

export default function MediaForm({ media, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    url: '',
    file: null,
    description: ''
  });

  const [preview, setPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('url'); // 'url' or 'file'

  const CATEGORY_OPTIONS = [
    'corporate',
    'wedding',
    'concert',
    'fashion',
    'award',
    'exhibition',
    'party',
    'conference'
  ];

  useEffect(() => {
    if (media) {
      setFormData(media);
      setPreview(media.url);
      setUploadMethod('url');
    }
  }, [media]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed');
        return;
      }

      setFormData(prev => ({
        ...prev,
        file: file,
        url: '' // Clear URL when file is selected
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({
      ...prev,
      url: url,
      file: null
    }));
    if (url) {
      setPreview(url);
    }
  };

  const removeFile = () => {
    setFormData(prev => ({
      ...prev,
      file: null,
      url: ''
    }));
    setPreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Media title is required');
      return;
    }

    if (!formData.category.trim()) {
      toast.error('Category is required');
      return;
    }

    if (uploadMethod === 'file' && !formData.file && !formData.url) {
      toast.error('Please upload an image file');
      return;
    }

    if (uploadMethod === 'url' && !formData.url.trim()) {
      toast.error('Image URL is required');
      return;
    }

    try {
      setIsSubmitting(true);

      let imageUrl = formData.url;

      // Convert file to base64 if file is selected
      if (formData.file) {
        imageUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.readAsDataURL(formData.file);
        });
      }

      const submitData = {
        title: formData.title,
        category: formData.category,
        url: imageUrl,
        description: formData.description
      };

      await onSubmit(submitData);

      setFormData({
        title: '',
        category: '',
        url: '',
        file: null,
        description: ''
      });
      setPreview('');
      setUploadMethod('url');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save media');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Media Title *</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="input input-bordered w-full"
          placeholder="Enter media title"
          disabled={isSubmitting}
        />
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
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Upload Method Tabs */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Upload Image *</span>
        </label>
        <div className="tabs tabs-boxed mb-4">
          <a
            onClick={() => setUploadMethod('url')}
            className={`tab ${uploadMethod === 'url' ? 'tab-active' : ''}`}
          >
            URL
          </a>
          <a
            onClick={() => setUploadMethod('file')}
            className={`tab ${uploadMethod === 'file' ? 'tab-active' : ''}`}
          >
            File Upload
          </a>
        </div>

        {/* URL Upload */}
        {uploadMethod === 'url' && (
          <div>
            <input
              type="url"
              value={formData.url}
              onChange={handleUrlChange}
              className="input input-bordered w-full"
              placeholder="https://example.com/image.jpg"
              disabled={isSubmitting}
            />
          </div>
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
                id="fileInput"
                disabled={isSubmitting}
              />
              <label htmlFor="fileInput" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, GIF up to 5MB
                </p>
              </label>
            </div>

            {formData.file && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    {formData.file.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
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
          <div className="border rounded-lg p-2">
            <img src={preview} alt="preview" className="h-64 w-full object-cover rounded" />
          </div>
        </div>
      )}

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
          placeholder="Enter media description"
          rows="3"
          disabled={isSubmitting}
        />
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
            media ? 'Update Media' : 'Add Media'
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