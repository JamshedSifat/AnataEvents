import React, { useState, useEffect } from 'react';

import { toast } from 'react-toastify';
import VideoForm from './VideoForm';
import VideoTable from './VideoTable';

export default function VideoManagement() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = () => {
    try {
      const savedVideos = localStorage.getItem('videos');
      if (savedVideos) {
        setVideos(JSON.parse(savedVideos));
        console.log('Videos loaded from localStorage');
      } else {
        const sampleVideos = [
          {
            _id: '1',
            title: 'Corporate Event Highlight',
            category: 'corporate',
            youtubeId: 'dQw4w9WgXcQ',
            description: 'Professional corporate event management and execution',
            uploadDate: new Date().toISOString().split('T')[0]
          }
        ];
        setVideos(sampleVideos);
        localStorage.setItem('videos', JSON.stringify(sampleVideos));
      }
    } catch (error) {
      console.error('Error loading videos:', error);
      toast.error('Failed to load videos');
    }
  };

  const saveVideosToStorage = (updatedVideos) => {
    try {
      localStorage.setItem('videos', JSON.stringify(updatedVideos));
      console.log('Videos saved to localStorage');
    } catch (error) {
      console.error('Error saving videos:', error);
      toast.error('Failed to save videos');
    }
  };

  const handleCreateVideo = async (videoData) => {
    try {
      setLoading(true);
      
      const newVideo = {
        ...videoData,
        _id: Date.now().toString(),
        uploadDate: new Date().toISOString().split('T')[0]
      };

      const updatedVideos = [...videos, newVideo];
      setVideos(updatedVideos);
      saveVideosToStorage(updatedVideos);
      
      toast.success('Video added successfully!');
      setIsModalOpen(false);
      
      console.log('Video created:', newVideo);
    } catch (error) {
      console.error('Error creating video:', error);
      toast.error('Failed to add video');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVideo = async (id, videoData) => {
    try {
      setLoading(true);
      
      const updatedVideos = videos.map(video =>
        video._id === id ? { ...videoData, _id: id } : video
      );
      
      setVideos(updatedVideos);
      saveVideosToStorage(updatedVideos);
      
      toast.success('Video updated successfully!');
      setSelectedVideo(null);
      
      console.log('Video updated:', id);
    } catch (error) {
      console.error('Error updating video:', error);
      toast.error('Failed to update video');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (id) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        setLoading(true);
        
        const updatedVideos = videos.filter(video => video._id !== id);
        setVideos(updatedVideos);
        saveVideosToStorage(updatedVideos);
        
        toast.success('Video deleted successfully!');
        
        console.log('Video deleted:', id);
      } catch (error) {
        console.error('Error deleting video:', error);
        toast.error('Failed to delete video');
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-base-content">Video Management</h1>
          <p className="text-base-content/60 mt-2">Total Videos: {videos.length}</p>
        </div>
        <button
          onClick={() => {
            setSelectedVideo(null);
            setIsModalOpen(true);
          }}
          className="btn btn-primary gap-2"
          disabled={loading}
        >
          <span>+</span>
          Add New Video
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by title or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full"
          disabled={loading}
        />
      </div>

      {/* Video Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 sticky top-0 bg-base-100 border-b border-base-300 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Add New Video</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-ghost btn-sm btn-circle"
                disabled={loading}
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <VideoForm
                onSubmit={handleCreateVideo}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 sticky top-0 bg-base-100 border-b border-base-300 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Edit Video</h2>
              <button
                onClick={() => setSelectedVideo(null)}
                className="btn btn-ghost btn-sm btn-circle"
                disabled={loading}
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <VideoForm
                video={selectedVideo}
                onSubmit={(data) =>
                  handleUpdateVideo(selectedVideo._id, data)
                }
                onCancel={() => setSelectedVideo(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Videos Table */}
      <div className="card bg-base-100 shadow-lg border border-base-300">
        {loading ? (
          <div className="card-body flex items-center justify-center py-12">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : filteredVideos.length > 0 ? (
          <VideoTable
            videos={filteredVideos}
            onEdit={setSelectedVideo}
            onDelete={handleDeleteVideo}
          />
        ) : (
          <div className="card-body text-center py-12">
            <p className="text-base-content/60 text-lg">No videos found</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary mt-4"
            >
              Add First Video
            </button>
          </div>
        )}
      </div>
    </div>
  );
}