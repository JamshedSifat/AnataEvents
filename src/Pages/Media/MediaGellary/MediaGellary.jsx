import React, { useState } from 'react';

const MediaGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  // Gallery Images Data
  const galleryImages = [
    {
      id: 1,
      title: 'Corporate Event Setup',
      category: 'corporate',
      url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop'
    },
    {
      id: 2,
      title: 'Wedding Decoration',
      category: 'wedding',
      url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&h=400&fit=crop'
    },
    {
      id: 3,
      title: 'Concert Stage',
      category: 'concert',
      url: 'https://images.unsplash.com/photo-1511379938547-c1f69b13e835?w=600&h=400&fit=crop'
    },
    {
      id: 4,
      title: 'Fashion Show Runway',
      category: 'fashion',
      url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop'
    },
    {
      id: 5,
      title: 'Award Show Stage',
      category: 'award',
      url: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=600&h=400&fit=crop'
    },
    {
      id: 6,
      title: 'Exhibition Booth',
      category: 'exhibition',
      url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=400&fit=crop'
    },
    {
      id: 7,
      title: 'Birthday Party Decor',
      category: 'party',
      url: 'https://images.unsplash.com/photo-1540575467063-178f50902556?w=600&h=400&fit=crop'
    },
    {
      id: 8,
      title: 'Product Launch Event',
      category: 'corporate',
      url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop'
    },
    {
      id: 9,
      title: 'Conference Hall',
      category: 'conference',
      url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&h=400&fit=crop'
    },
    {
      id: 10,
      title: 'Gala Dinner',
      category: 'corporate',
      url: 'https://images.unsplash.com/photo-1511379938547-c1f69b13e835?w=600&h=400&fit=crop'
    },
    {
      id: 11,
      title: 'Trade Show',
      category: 'exhibition',
      url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop'
    },
    {
      id: 12,
      title: 'Wedding Reception',
      category: 'wedding',
      url: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=600&h=400&fit=crop'
    }
  ];

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'corporate', label: 'Corporate' },
    { id: 'wedding', label: 'Wedding' },
    { id: 'concert', label: 'Concert' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'award', label: 'Award' },
    { id: 'exhibition', label: 'Exhibition' },
    { id: 'party', label: 'Party' },
    { id: 'conference', label: 'Conference' }
  ];

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(image => image.category === selectedCategory);

  return (
    <div className='min-h-screen bg-white pt-24'>
      {/* Title */}
      <div className='pb-12 text-center px-4'>
        <h1 className='text-5xl md:text-6xl font-bold text-primary mb-4'>Gallery</h1>
        <p className='text-gray-600 text-lg'>Explore our event photos</p>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 pb-16'>
        {/* Category Filter */}
        <div className='mb-12 flex flex-wrap gap-3 justify-center'>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid - Only Images */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {filteredImages.map((image) => (
            <div 
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className='group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300'
            >
              <div className='relative overflow-hidden h-64 bg-gray-200'>
                <img 
                  src={image.url}
                  alt={image.title}
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4'
          onClick={() => setSelectedImage(null)}
        >
          <div className='max-w-4xl w-full'>
            <img 
              src={selectedImage.url}
              alt={selectedImage.title}
              className='w-full h-auto rounded-lg'
            />
            <p className='text-white text-center mt-4 text-lg font-semibold'>
              {selectedImage.title}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setSelectedImage(null)}
            className='absolute top-4 right-4 text-white hover:text-gray-300'
          >
            <svg className='w-8 h-8' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd' />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default MediaGallery;