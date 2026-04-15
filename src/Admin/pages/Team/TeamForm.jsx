import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Upload, X } from 'lucide-react';

export default function TeamForm({ member, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    image: '',
    description: '',
    email: '',
    phone: '',
    social: {
      twitter: '',
      linkedin: '',
      facebook: '',
      instagram: ''
    }
  });

  const [preview, setPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('url');

  const ROLE_OPTIONS = [
    'Event Manager',
    'Event Coordinator',
    'Marketing Manager',
    'Sales Manager',
    'Creative Director',
    'Operations Manager',
    'Customer Service',
    'Senior Manager'
  ];

  useEffect(() => {
    if (member) {
      setFormData(member);
      setPreview(member.image);
      setUploadMethod('url');
    }
  }, [member]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      social: {
        ...prev.social,
        [name]: value
      }
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
      toast.error('Name is required');
      return;
    }

    if (!formData.role.trim()) {
      toast.error('Role is required');
      return;
    }

    if (!formData.image) {
      toast.error('Image is required');
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
        role: formData.role,
        image: imageUrl,
        description: formData.description,
        email: formData.email,
        phone: formData.phone,
        social: formData.social
      };

      await onSubmit(submitData);

      setFormData({
        name: '',
        role: '',
        image: '',
        description: '',
        email: '',
        phone: '',
        social: {
          twitter: '',
          linkedin: '',
          facebook: '',
          instagram: ''
        }
      });
      setPreview('');
      setUploadMethod('url');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save team member');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name & Role */}
      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="label">
            <span className="label-text font-bold">Name *</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter full name"
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label className="label">
            <span className="label-text font-bold">Role *</span>
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="select select-bordered w-full"
            disabled={isSubmitting}
          >
            <option value="">Select Role</option>
            {ROLE_OPTIONS.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="label">
            <span className="label-text font-bold">Email</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="email@example.com"
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label className="label">
            <span className="label-text font-bold">Phone</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="+1-234-567-8900"
            disabled={isSubmitting}
          />
        </div>
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
          placeholder="Brief description about the team member"
          rows="3"
          disabled={isSubmitting}
        />
      </div>

      {/* Image Upload */}
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
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary mx-auto">
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* Social Media Links */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Social Media Links</span>
        </label>
        <div className="space-y-3">
          <input
            type="url"
            name="twitter"
            value={formData.social.twitter}
            onChange={handleSocialChange}
            className="input input-bordered w-full"
            placeholder="Twitter URL"
            disabled={isSubmitting}
          />
          <input
            type="url"
            name="linkedin"
            value={formData.social.linkedin}
            onChange={handleSocialChange}
            className="input input-bordered w-full"
            placeholder="LinkedIn URL"
            disabled={isSubmitting}
          />
          <input
            type="url"
            name="facebook"
            value={formData.social.facebook}
            onChange={handleSocialChange}
            className="input input-bordered w-full"
            placeholder="Facebook URL"
            disabled={isSubmitting}
          />
          <input
            type="url"
            name="instagram"
            value={formData.social.instagram}
            onChange={handleSocialChange}
            className="input input-bordered w-full"
            placeholder="Instagram URL"
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
            member ? 'Update Member' : 'Add Member'
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