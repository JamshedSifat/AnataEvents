import React, { useState, useEffect } from 'react';
import { contentApi } from '../../../services/content';

const MediaGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [medias, setMedias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMedias();
  }, []);

  const loadMedias = async () => {
    try {
      setLoading(true);
      const data = await contentApi.gallery({ page_size: 100 });
      setMedias(
        data.map((image) => ({
          _id: image.id,
          title: image.title,
          category: image.album || 'corporate',
          url: image.image_src || '',
          description: image.caption,
        }))
      );
    } catch (error) {
      setMedias([]);
    } finally {
      setLoading(false);
    }
  };

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
    ? medias
    : medias.filter(image => image.category === selectedCategory);

  return (
    <div className='min-h-screen bg-white '>
      {/* Title */}
     <div className="text-center mb-16">
                    <div className="badge badge-primary badge-lg mb-4">
                        📸 Gallery
                    </div>

                    <h2 className="text-4xl md:text-5xl font-playfair font-bold text-base-content mb-6">
                        Event <span className="text-primary">Gallery</span>
                    </h2>

                    <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                        Explore our stunning collection of events and venues that showcase the beauty and elegance of our work
                    </p>
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

        {loading && (
          <div className='text-center py-12'>
            <p className='text-gray-600'>Loading gallery...</p>
          </div>
        )}

        {!loading && filteredImages.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-gray-600'>No images in this category</p>
          </div>
        )}

        {/* Gallery Grid */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {filteredImages.map((image) => (
            <div 
              key={image._id}
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
            {selectedImage.description && (
              <p className='text-gray-300 text-center mt-2'>
                {selectedImage.description}
              </p>
            )}
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