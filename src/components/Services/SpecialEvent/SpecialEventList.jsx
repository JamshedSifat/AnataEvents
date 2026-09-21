import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { contentApi } from '../../../services/content';
import { mapServiceEntry } from '../../../services/mappers';

export const SpecialEventList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await contentApi.serviceEntries({ service: 'special-events', page_size: 50 });
        if (active) setEvents(data.map(mapServiceEntry));
        setError(null);
      } catch (error) {
        if (active) {
          setEvents([]);
          setError('Could not load these pages right now.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchEvents();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent mb-4'></div>
          <p className='text-xl text-gray-600 font-semibold'>Loading Events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center bg-white p-8 rounded-lg shadow-lg'>
          <p className='text-2xl text-red-600 mb-4 font-bold'>⚠️ Error</p>
          <p className='text-gray-600 mb-6'>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className='bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white'>
      {/* Header Section */}
      <div className='bg-gradient-to-r from-primary to-secondary py-16 px-4 text-white'>
        <div className='max-w-6xl mx-auto'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>Special Events</h1>
          <p className='text-gray-100 text-lg max-w-2xl'>Professional Event Management Services Tailored to Your Needs</p>
        </div>
      </div>

      {/* Events Grid */}
      <div className='max-w-6xl mx-auto px-4 py-20'>
        {events.length === 0 ? (
          <div className='text-center py-16'>
            <p className='text-2xl text-gray-600 font-semibold'>No Events Found</p>
          </div>
        ) : (
          <>
            <div className='mb-12 flex items-center justify-between'>
              <h2 className='text-3xl font-bold text-primary'>Featured Events</h2>
              <p className='text-gray-600'>Showing {events.length} events</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {events.map((event) => (
                <div 
                  key={event.id}
                  onClick={() => navigate(`/services/SpecialEvent/${event.id}`)}
                  className='group h-full bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-200'
                >
                  {/* Image Container */}
                  <div className='relative h-56 overflow-hidden bg-gray-200'>
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                      loading='lazy'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300'></div>
                    
                    {/* Badge */}
                    <div className='absolute top-4 right-4 bg-accent text-white px-4 py-2 rounded-full text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                      Learn More
                    </div>
                  </div>

                  {/* Content */}
                  <div className='p-6'>
                    <h3 className='text-xl font-bold text-primary mb-3 line-clamp-2   duration-300'>
                      {event.title}
                    </h3>
                    <p className='text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed'>
                      {event.description}
                    </p>
                    
                    {/* Services Preview */}
                    <div className='flex flex-wrap gap-2 mb-4'>
                      {event.services?.slice(0, 2).map((service, idx) => (
                        <span key={idx} className='text-xs bg-primary text-white px-2 py-1 rounded'>
                          {service}
                        </span>
                      ))}
                      {event.services?.length > 2 && (
                        <span className='text-xs text-gray-500'>+{event.services.length - 2} more</span>
                      )}
                    </div>

                    {/* Footer */}
                    <div className='flex items-center justify-between pt-4 border-t border-gray-200 group-hover:border-accent transition-colors'>
                      <div className='flex items-center text-primary text-sm font-semibold  transition-colors'>
                        View Details
                        <span className='ml-2 group-hover:translate-x-1 transition-transform duration-300'>→</span>
                      </div>
                      <div className='flex items-center gap-1'>
                        {event.stats && event.stats[0] && (
                          <span className='text-xs text-gray-500'>{event.stats[0].number}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* CTA Section */}
      {events.length > 0 && (
        <div className='bg-gradient-to-r from-primary to-secondary py-16 px-4 text-white mt-8'>
          <div className='max-w-6xl mx-auto text-center'>
            <h2 className='text-3xl font-bold mb-4'>Ready to Plan Your Event?</h2>
            <p className='text-gray-100 mb-8 text-lg'>Choose from our comprehensive range of event management services</p>
            <button className='bg-accent text-white px-8 py-4 rounded-lg font-bold hover:opacity-90 transition shadow-lg'>
              Get Started Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialEventList;