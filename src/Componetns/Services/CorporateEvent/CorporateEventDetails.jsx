// File: src/Components/CorporateEventDetails.jsx (With Image Slider)
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { ArrowLeft, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';
import corporateEventsData from '../../../../public/CorporateEvents/CorporateEvents.json';

const CorporateEventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadEventDetail();
  }, [id]);

  const loadEventDetail = () => {
    try {
      setLoading(true);

      let events = [];
      const savedEvents = localStorage.getItem('corporateEvents');
      
      if (savedEvents) {
        events = JSON.parse(savedEvents);
      } else if (corporateEventsData && Array.isArray(corporateEventsData)) {
        events = corporateEventsData;
        localStorage.setItem('corporateEvents', JSON.stringify(events));
      }

      console.log('All events:', events);
      console.log('Looking for ID:', id);

      const foundEvent = events.find(e => e._id === id);

      console.log('Found event:', foundEvent);

      if (!foundEvent) {
        console.error('Event not found with id:', id);
        setLoading(false);
        return;
      }

      setEvent(foundEvent);
      setCurrentImageIndex(0);

      if (foundEvent) {
        const related = events
          .filter(e => (e.category || 'Other') === (foundEvent.category || 'Other') && e._id !== foundEvent._id)
          .slice(0, 3);
        setRelatedEvents(related);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading event:', error);
      setLoading(false);
    }
  };

  // ✅ Image slider functions
  const getGalleryImages = () => {
    if (!event) return [];
    const images = [event.image];
    
    // Add gallery images if they exist
    if (event.galleryImages && Array.isArray(event.galleryImages)) {
      images.push(...event.galleryImages);
    }
    
    return images;
  };

  const galleryImages = getGalleryImages();

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-28">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-28">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Service Not Found</h1>
        <p className="text-gray-600 mb-6 text-center">ID: {id}</p>
        <a href="/services/corporate-events" className="btn btn-primary">
          Back to Services
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 pt-28">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        {/* Back Button */}
        <a href="/services/corporate-events" className="btn btn-ghost btn-sm sm:btn-md gap-2 mb-6 sm:mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Services
        </a>

        {/* Article */}
        <article className="bg-white rounded-lg shadow-lg p-4 sm:p-8 md:p-12">
          
          {/* ✅ Image Slider Section */}
          <div className="mb-6 sm:mb-8">
            {/* Main Image */}
            <div className="relative bg-gray-200 rounded-lg overflow-hidden mb-4">
              <div className="relative w-full h-48 sm:h-64 md:h-96">
                <img
                  src={galleryImages[currentImageIndex]}
                  alt={`${event.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x400?text=Corporate+Event';
                  }}
                />
              </div>

              {/* Navigation Buttons */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full transition z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full transition z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {currentImageIndex + 1} / {galleryImages.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {galleryImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {galleryImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden transition ${
                      currentImageIndex === index
                        ? 'ring-2 ring-primary'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80x80?text=Thumb';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category Badge */}
          <div className="mb-4">
            <span className="badge badge-primary">{event.category || 'Corporate'}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900 leading-tight">
            {event.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-3 sm:gap-6 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b-2 border-gray-200">
            <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{event.date ? new Date(event.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{event.author || 'Anata Events'}</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6 sm:mb-8">
            <p className="text-gray-600 text-sm sm:text-base md:text-lg italic">
              {event.excerpt}
            </p>
          </div>

          {/* Content Only */}
          <div className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed whitespace-pre-wrap mb-12">
            {event.content}
          </div>

          {/* Related Events */}
          {relatedEvents.length > 0 && (
            <div className="pt-8 sm:pt-12 border-t-2 border-gray-200">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-900">
                Related Services
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {relatedEvents.map(relatedEvent => (
                  <a 
                    key={relatedEvent._id} 
                    href={`/services/corporate-events/${relatedEvent._id}`}
                    className="group"
                  >
                    <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                      {/* Image */}
                      <div className="relative overflow-hidden h-40 sm:h-48">
                        <img
                          src={relatedEvent.image}
                          alt={relatedEvent.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300?text=Event';
                          }}
                        />
                      </div>

                      {/* Content */}
                      <div className="p-3 sm:p-4 flex flex-col flex-grow">
                        <span className="badge badge-primary text-xs mb-2 w-fit">
                          {relatedEvent.category || 'Corporate'}
                        </span>
                        
                        <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition text-sm sm:text-base mb-2 flex-grow">
                          {relatedEvent.title}
                        </h3>

                        <p className="text-xs text-gray-500 line-clamp-1">
                          {relatedEvent.excerpt}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
};

export default CorporateEventDetails;