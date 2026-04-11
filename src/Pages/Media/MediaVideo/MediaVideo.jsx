import React, { useState } from 'react';

const MediaVideo = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Video Data
  const videos = [
    {
      id: 1,
      title: 'Corporate Event Highlight',
      category: 'corporate',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      description: 'Professional corporate event management and execution',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      title: 'Wedding Ceremony',
      category: 'wedding',
      url: 'https://www.youtube.com/embed/9bZkp7q19f0',
      description: 'Beautiful wedding planning and decoration',
      thumbnail: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      title: 'Concert Production',
      category: 'concert',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw',
      description: 'Live music show and concert organization',
      thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69b13e835?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      title: 'Fashion Show',
      category: 'fashion',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      description: 'Professional fashion event management',
      thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop'
    },
    {
      id: 5,
      title: 'Award Show Setup',
      category: 'award',
      url: 'https://www.youtube.com/embed/9bZkp7q19f0',
      description: 'Award show organization and production',
      thumbnail: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=300&fit=crop'
    },
    {
      id: 6,
      title: 'Virtual Event',
      category: 'virtual',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw',
      description: 'Seamless virtual event management',
      thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop'
    },
    {
      id: 7,
      title: 'Exhibition Setup',
      category: 'exhibition',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      description: 'Exhibition stall design and fabrication',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop'
    },
    {
      id: 8,
      title: 'Birthday Party',
      category: 'party',
      url: 'https://www.youtube.com/embed/9bZkp7q19f0',
      description: 'Fun and engaging birthday celebration',
      thumbnail: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&h=300&fit=crop'
    },
    {
      id: 9,
      title: 'Product Launch',
      category: 'corporate',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw',
      description: 'Professional product launch event',
      thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69b13e835?w=400&h=300&fit=crop'
    }
  ];

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

  // Filter videos based on selected category
  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(video => video.category === selectedCategory);

  return (
    <div className='min-h-screen bg-white  '>
       {/* Title Section */}
<div className='pt-14 pb-8 text-center'>
  <h1 className='text-5xl md:text-6xl font-bold text-primary mb-4'>Media Videos</h1>
  <p className='text-gray-600 text-lg max-w-2xl mx-auto'>
    Explore our collection of professionally produced event videos
  </p>
</div>

{/* Hero Section */}
<div className='max-w-7xl mx-auto relative h-80 md:h-96 overflow-hidden bg-black rounded-lg shadow-lg mb-16'>
  <iframe
    width='100%'
    height='100%'
    src='https://www.youtube.com/embed/dQw4w9WgXcQ'
    title='Our Event Videos'
    frameBorder='0'
    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
    allowFullScreen
    className='w-full h-80 md:h-96'
  ></iframe>
  
  {/* Content Overlay */}
  <div className='absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent'></div>
  
  <div className='absolute bottom-0 left-0 right-0 text-white p-8'>
    <div className='max-w-4xl mx-auto'>
      <h2 className='text-3xl md:text-4xl font-bold mb-2'>Featured Event Video</h2>
      <p className='text-gray-200'>Watch our professional event management in action</p>
    </div>
  </div>
</div>

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
                key={video.id} 
                className='bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group'
              >
                {/* Video Thumbnail */}
                <div className='relative bg-black overflow-hidden h-48'>
                  <iframe
                    width='100%'
                    height='100%'
                    src={video.url}
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
                  <button className='w-full bg-primary hover:bg-secondary text-white py-2 rounded-lg font-semibold transition-all duration-300'>
                    Watch Full Video
                  </button>
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