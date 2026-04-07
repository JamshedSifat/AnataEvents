import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';

export const SpecialEventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/public/Services/SpecialEvent.json');
        
        if (!response.ok) {
          throw new Error('ইভেন্ট লোড করতে ব্যর্থ');
        }
        
        const data = await response.json();
        setEvents(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-xl text-gray-600'>লোডিং হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-xl text-red-600 mb-4'>⚠️ {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className='bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700'
          >
            পুনরায় চেষ্টা করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white'>
      {/* হেডার */}
      <div className='bg-gradient-to-r from-red-50 to-pink-50 py-12 px-4'>
        <div className='max-w-6xl mx-auto'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-800 mb-2'>Special Events</h1>
          <p className='text-gray-600 text-lg'>Professional Event Management Services</p>
        </div>
      </div>

      {/* ইভেন্ট গ্রিড */}
      <div className='max-w-6xl mx-auto px-4 py-16'>
        {events.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-xl text-gray-600'>কোনো ইভেন্ট পাওয়া যায়নি</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {events.map((event) => (
              // ✅ এখানে URL ঠিক করুন - /services/SpecialEvent/ ব্যবহার করুন
              <Link key={event.id} to={`/services/SpecialEvent/${event.id}`}>
                <div className='group h-full bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer'>
                  {/* ইমেজ */}
                  <div className='relative h-48 overflow-hidden'>
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                    />
                    <div className='absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity'></div>
                  </div>

                  {/* কন্টেন্ট */}
                  <div className='p-5'>
                    <h3 className='text-lg font-bold text-red-600 mb-2 line-clamp-2 group-hover:text-red-700'>
                      {event.title}
                    </h3>
                    <p className='text-gray-600 text-sm line-clamp-2'>
                      {event.description}
                    </p>
                    <div className='mt-4 flex items-center text-red-600 text-sm font-semibold'>
                      আরও জানুন 
                      <span className='ml-2 group-hover:translate-x-1 transition-transform'>→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecialEventList;