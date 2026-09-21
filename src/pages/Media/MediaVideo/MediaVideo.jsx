import React, { useState, useEffect } from 'react';
import { contentApi } from '../../../services/content';

const MediaVideo = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const data = await contentApi.videos({ page_size: 100 });
      setVideos(
        data.map((video) => ({
          _id: video.id,
          title: video.title,
          description: video.description,
          category: video.category,
          youtubeId: video.youtube_id,
        }))
      );
    } catch (error) {
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Videos' },
    { id: 'corporate', label: 'Corporate' },
    { id: 'wedding', label: 'Wedding' },
    { id: 'concert', label: 'Concert' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'award', label: 'Award Show' },
    { id: 'virtual', label: 'Virtual Event' },
    { id: 'exhibition', label: 'Exhibition' },
    { id: 'party', label: 'Party' }
  ];

  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(video => video.category === selectedCategory);

  const featuredVideo = videos.length > 0 ? videos[0] : null;

  return (
    <div className='min-h-screen bg-white'>
      {/* Title Section */}
      <div className='pt-14 pb-8 text-center'>
        <h1 className='text-5xl md:text-6xl font-bold text-primary mb-4'>Media Videos</h1>
        <p className='text-gray-600 text-lg max-w-2xl mx-auto'>
          Explore our collection of professionally produced event videos
        </p>
      </div>

      {/* Hero Section */}
      {featuredVideo && (
        <div className='max-w-7xl mx-auto px-4 relative h-80 md:h-96 overflow-hidden bg-black rounded-lg shadow-lg mb-16'>
          <iframe
            width='100%'
            height='100%'
            src={`https://www.youtube.com/embed/${featuredVideo.youtubeId}`}
            title='Featured Video'
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
            className='w-full h-80 md:h-96'
          ></iframe>
          
          <div className='absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent'></div>
          
          <div className='absolute bottom-0 left-0 right-0 text-white p-8'>
            <div className='max-w-4xl mx-auto'>
              <h2 className='text-3xl md:text-4xl font-bold mb-2'>Featured Event Video</h2>
              <p className='text-gray-200'>Watch our professional event management in action</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 py-16'>
        {/* Description Section */}
        <div className='bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-lg mb-12 border-l-4 border-primary'>
          <h2 className='text-3xl font-bold text-primary mb-4'>Media Videos</h2>
          <p className='text-gray-700 leading-relaxed text-lg'>
            Explore our extensive collection of professionally produced videos showcasing our expertise in event management. From corporate events to weddings, concerts to virtual events, watch how we transform visions into spectacular realities. Each video demonstrates our commitment to excellence, creativity, and attention to detail.
          </p>
        </div>

        {/* Category Filter */}
        <div className='mb-12'>
          <h3 className='text-2xl font-bold text-primary mb-6'>Filter by Category</h3>
          <div className='flex flex-wrap gap-3'>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
          <p className='text-gray-600 mt-4'>
            Showing {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Videos Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video) => (
              <div 
                key={video._id} 
                className='bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group'
              >
                {/* Video Thumbnail */}
                <div className='relative bg-black overflow-hidden h-48'>
                  <iframe
                    width='100%'
                    height='100%'
                    src={`https://www.youtube.com/embed/${video.youtubeId}`}
                    title={video.title}
                    frameBorder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                    className='w-full h-48'
                  ></iframe>
                </div>

                {/* Video Info */}
                <div className='p-6'>
                  {/* Category Badge */}
                  <div className='inline-block bg-primary text-white px-3 py-1 rounded-full text-xs font-bold mb-3'>
                    {categories.find(c => c.id === video.category)?.label}
                  </div>

                  {/* Title */}
                  <h3 className='text-xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors'>
                    {video.title}
                  </h3>

                  {/* Description */}
                  <p className='text-gray-600 text-sm mb-4'>
                    {video.description}
                  </p>

                  {/* Watch Button */}
                  <a 
                    href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='w-full block text-center bg-primary hover:bg-secondary text-white py-2 rounded-lg font-semibold transition-all duration-300'
                  >
                    Watch Full Video
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className='col-span-full text-center py-12'>
              <p className='text-2xl text-gray-600 font-semibold'>No videos found in this category</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer CTA */}
      <div className='bg-gradient-to-r from-primary/5 to-secondary/5 py-12 px-4 mt-16'>
        <div className='max-w-6xl mx-auto text-center'>
          <h3 className='text-3xl font-bold text-primary mb-4'>Want to see more?</h3>
          <p className='text-gray-700 text-lg mb-8 max-w-2xl mx-auto'>
            Visit our gallery for more photos and event highlights from our past projects
          </p>
          <a 
            href='/media/gallery'
            className='inline-block bg-primary hover:bg-secondary text-white px-10 py-4 rounded-lg font-bold transition-all duration-300'
          >
            View Gallery
          </a>
        </div>
      </div>
    </div>
  );
};

export default MediaVideo;