import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Upload, X } from 'lucide-react';

export default function VideoForm({ video, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    youtubeId: '',
    videoFile: null,
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadMethod, setUploadMethod] = useState('url'); // 'url' or 'file'

  const CATEGORY_OPTIONS = [
    'corporate',
    'wedding',
    'concert',
    'fashion',
    'award',
    'virtual',
    'exhibition',
    'party'
  ];

  useEffect(() => {
    if (video) {
      setFormData(video);
      if (video.youtubeId) {
        setPreviewUrl(`https://www.youtube.com/embed/${video.youtubeId}`);
        setUploadMethod('url');
      }
    }
  }, [video]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update preview when YouTube ID changes
    if (name === 'youtubeId' && value.trim()) {
      setPreviewUrl(`https://www.youtube.com/embed/${value}`);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 100MB for videos)
      if (file.size > 100 * 1024 * 1024) {
        toast.error('File size must be less than 100MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('video/')) {
        toast.error('Only video files are allowed');
        return;
      }

      setFormData(prev => ({
        ...prev,
        videoFile: file,
        youtubeId: '' // Clear YouTube ID when file is selected
      }));

      // Create preview using FileReader
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e) => {
    const youtubeId = extractYoutubeId(e.target.value);
    setFormData(prev => ({
      ...prev,
      youtubeId: youtubeId,
      videoFile: null
    }));
    if (youtubeId) {
      setPreviewUrl(`https://www.youtube.com/embed/${youtubeId}`);
    }
  };

  const extractYoutubeId = (url) => {
    let id = '';
    if (url.includes('youtube.com/watch?v=')) {
      id = url.split('v=')[1]?.split('&')[0] || '';
    } else if (url.includes('youtu.be/')) {
      id = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('youtube.com/embed/')) {
      id = url.split('embed/')[1]?.split('?')[0] || '';
    } else {
      id = url;
    }
    return id;
  };

  const removeFile = () => {
    setFormData(prev => ({
      ...prev,
      videoFile: null
    }));
    setPreviewUrl('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Video title is required');
      return;
    }

    if (!formData.category.trim()) {
      toast.error('Category is required');
      return;
    }

    if (uploadMethod === 'url' && !formData.youtubeId.trim()) {
      toast.error('YouTube video ID or URL is required');
      return;
    }

    if (uploadMethod === 'file' && !formData.videoFile) {
      toast.error('Please upload a video file');
      return;
    }

    try {
      setIsSubmitting(true);

      let submitData = {
        title: formData.title,
        category: formData.category,
        description: formData.description
      };

      if (uploadMethod === 'url') {
        submitData.youtubeId = formData.youtubeId;
        submitData.videoType = 'youtube';
      } else {
        // Convert file to base64
        const videoBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.readAsDataURL(formData.videoFile);
        });
        
        submitData.videoFile = videoBase64;
        submitData.fileName = formData.videoFile.name;
        submitData.videoType = 'file';
      }

      await onSubmit(submitData);

      setFormData({
        title: '',
        category: '',
        youtubeId: '',
        videoFile: null,
        description: ''
      });
      setPreviewUrl('');
      setUploadMethod('url');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save video');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Video Title *</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="input input-bordered w-full"
          placeholder="Enter video title"
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
          <span className="label-text font-bold">Video Source *</span>
        </label>
        <div className="tabs tabs-boxed mb-4">
          <a
            onClick={() => {
              setUploadMethod('url');
              setFormData(prev => ({ ...prev, videoFile: null }));
              setPreviewUrl('');
            }}
            className={`tab cursor-pointer ${uploadMethod === 'url' ? 'tab-active' : ''}`}
          >
            YouTube Link
          </a>
          <a
            onClick={() => {
              setUploadMethod('file');
              setFormData(prev => ({ ...prev, youtubeId: '' }));
              setPreviewUrl('');
            }}
            className={`tab cursor-pointer ${uploadMethod === 'file' ? 'tab-active' : ''}`}
          >
            Upload File
          </a>
        </div>

        {/* YouTube URL Input */}
        {uploadMethod === 'url' && (
          <div>
            <input
              type="text"
              value={formData.youtubeId}
              onChange={handleUrlChange}
              className="input input-bordered w-full"
              placeholder="e.g., dQw4w9WgXcQ or https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-2">
              Paste YouTube URL or just the video ID
            </p>
          </div>
        )}

        {/* File Upload */}
        {uploadMethod === 'file' && (
          <div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
                id="videoInput"
                disabled={isSubmitting}
              />
              <label htmlFor="videoInput" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  MP4, WebM, AVI up to 100MB
                </p>
              </label>
            </div>

            {formData.videoFile && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    {formData.videoFile.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({(formData.videoFile.size / 1024 / 1024).toFixed(2)} MB)
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

      {/* Video Preview */}
      {previewUrl && (
        <div className="form-group">
          <label className="label">
            <span className="label-text font-bold">Preview</span>
          </label>
          <div className="border rounded-lg overflow-hidden bg-black aspect-video">
            {uploadMethod === 'url' ? (
              <iframe
                width="100%"
                height="100%"
                src={previewUrl}
                title="Preview"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            ) : (
              <video
                width="100%"
                height="100%"
                controls
                className="w-full h-full"
              >
                <source src={previewUrl} type={formData.videoFile?.type} />
                Your browser does not support the video tag.
              </video>
            )}
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
          placeholder="Enter video description"
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
            video ? 'Update Video' : 'Add Video'
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