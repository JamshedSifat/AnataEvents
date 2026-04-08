import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const AwardShowDetail = () => {
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gallery Images
  const galleryImages = [
    {
      id: 1,
      title: 'Award Ceremony Stage',
      url: 'https://www.anantabd.net/wp-content/uploads/2020/03/Awards-Shows-bangladesh.jpg'
    },
    {
      id: 2,
      title: 'Winners on Stage',
      url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop'
    },
    {
      id: 3,
      title: 'Audience Hall',
      url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&h=600&fit=crop'
    },
    {
      id: 4,
      title: 'Stage Lighting',
      url: 'https://images.unsplash.com/photo-1511379938547-c1f69b13e835?w=800&h=600&fit=crop'
    },
    {
      id: 5,
      title: 'Award Trophy',
      url: 'https://images.unsplash.com/photo-1553531088-a87b1caea7ca?w=800&h=600&fit=crop'
    },
    {
      id: 6,
      title: 'Celebration Moment',
      url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=600&fit=crop'
    }
  ];

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await fetch('/Services/SpecialEvent.json');
        
        if (!response.ok) {
          throw new Error('Failed to load data');
        }
        
        const data = await response.json();
        const foundEvent = data.find(e => e.id === 'award-show');
        
        if (!foundEvent) {
          throw new Error('Event not found');
        }
        
        setEvent(foundEvent);
        setError(null);
      } catch (err) {
        setError(err.message);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, []);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4'></div>
          <p className='text-xl text-gray-600 font-semibold'>Loading Event Details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center bg-white p-8 rounded-lg shadow-lg'>
          <h1 className='text-4xl font-bold text-gray-800 mb-4'>⚠️ Error</h1>
          <p className='text-lg text-gray-600 mb-6'>{error || 'Event not found'}</p>
          <button 
            onClick={() => navigate('/services/SpecialEvent')}
            className='bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition'
          >
            ← Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <div className='relative h-96 md:h-[500px] overflow-hidden bg-gradient-to-r from-primary to-secondary'>
        {/* Back Button */}
        <div className='absolute top-12 left-6 z-20'>
          <button 
            onClick={() => navigate('/services/SpecialEvent')}
            className='bg-white/10 backdrop-blur-md border border-white/20 hover:border-primary text-white px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2 hover:bg-primary/20'
          >
            <span className='text-xl'>←</span>
            <span>Back to Events</span>
          </button>
        </div>

        {/* Background Image */}
        <img 
          src={event.image} 
          alt={event.title}
          className='w-full h-full object-cover opacity-80'
        />
        
     
       
        
        {/* Content */}
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='text-center text-white px-4'>
            <p className='text-white text-xl font-bold mb-2'>🏆 AWARD SHOWS</p>
            <h1 className='text-5xl md:text-6xl font-bold mb-4'>{event.title}</h1>
            <p className='text-gray-100 text-lg'>Glamorous Event Management Services</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-6xl mx-auto px-4 py-16'>
        {/* Stats Section */}
        <div className='grid grid-cols-3 gap-4 mb-16'>
          {event.stats.map((stat, idx) => (
            <div key={idx} className='bg-gradient-to-br from-primary to-secondary p-8 rounded-lg text-center text-white shadow-lg'>
              <p className='text-3xl font-bold mb-2'>{stat.number}</p>
              <p className='text-gray-100 text-sm'>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Introduction Section */}
        <div className='bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-lg mb-16 border-l-4 border-primary'>
          <h2 className='text-4xl font-bold mb-4 text-primary'>Award Shows Organizer</h2>
          <p className='text-gray-700 leading-relaxed text-lg mb-4'>
            Award Shows are highly glamorous events. There is a lot to do and experiment in such shows. It is essential to hire an event management service in this scenario that has considerable experience. We understand that the attendees expect a lot from such shows. It is because they come to such events to unwind.
          </p>
          <p className='text-gray-700 leading-relaxed text-lg'>
            With the best music, set-designs, and lighting setups, we leave no stone unturned to make your award shows exactly the way you want. We make every moment memorable and create an experience that your guests will never forget.
          </p>
        </div>

        {/* Image Gallery with Swiper */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold mb-8 text-primary'>Our Award Show Gallery</h2>
          <div className='relative'>
            <Swiper
              modules={[Navigation, Pagination, Autoplay, EffectFade]}
              spaceBetween={30}
              slidesPerView={1}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              pagination={{
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: true,
              }}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              effect="fade"
              className='rounded-lg overflow-hidden shadow-xl'
            >
              {galleryImages.map((image) => (
                <SwiperSlide key={image.id}>
                  <div className='relative h-96 md:h-[500px] overflow-hidden'>
                    <img 
                      src={image.url} 
                      alt={image.title}
                      className='w-full h-full object-cover'
                    />
                    <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6'>
                      <p className='text-white text-xl font-semibold'>{image.title}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
     
<button className='swiper-button-prev !w-12 !h-12  !rounded-full !text-white !top-1/2 !-translate-y-1/2 !left-4 transition shadow-lg' />
<button className='swiper-button-next !w-12 !h-12  !rounded-full !text-white !top-1/2 !-translate-y-1/2 !right-4 transition shadow-lg' />

            {/* Pagination */}
            <div className='swiper-pagination !bottom-4'></div>
          </div>
        </div>

        {/* Why Hire Us Section */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold mb-8 text-primary'>Why Hire Us?</h2>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-12'>
            {/* Best Location Use */}
            <div className='bg-white p-8 rounded-lg border-l-4 border-primary shadow-md hover:shadow-lg transition'>
              <h3 className='text-2xl font-bold text-primary mb-4'>📍 Best Use of Your Location</h3>
              <p className='text-gray-700 leading-relaxed'>
                We make sure that your location for your award show is put to best use. Everything needs to be planned and set according to the area and space of your venue. If you have an open area, we assist you where to build a stage and where to keep the sitting arrangements. We have professional people to meticulously construct these set-ups.
              </p>
            </div>

            {/* Best Stage Design */}
            <div className='bg-white p-8 rounded-lg border-l-4 border-secondary shadow-md hover:shadow-lg transition'>
              <h3 className='text-2xl font-bold text-secondary mb-4'>🎭 Best Stage Design</h3>
              <p className='text-gray-700 leading-relaxed'>
                The main attraction of your show in the visual arena is your stage. All winners, anchors, and speakers will use it and all eyes will be on stage. Therefore, your stage has to be amazingly designed and constructed with the best lighting, sound, and displays. We do everything with finesse to make your stage look appealing to the top extent.
              </p>
            </div>

            {/* Rehearsals */}
            <div className='bg-white p-8 rounded-lg border-l-4 border-primary shadow-md hover:shadow-lg transition'>
              <h3 className='text-2xl font-bold text-primary mb-4'>🎯 Professional Rehearsals</h3>
              <p className='text-gray-700 leading-relaxed'>
                On-stage rehearsals are often overlooked, but they're crucial. Our team is equipped to analyze rehearsals thoroughly. This helps us get the idea of what all needs to be done on the final leg of preparation. Participants get acquainted with where to stand and perform, making them comfortable and preventing awkward moments on the final day.
              </p>
            </div>

            {/* Experience */}
            <div className='bg-white p-8 rounded-lg border-l-4 border-secondary shadow-md hover:shadow-lg transition'>
              <h3 className='text-2xl font-bold text-secondary mb-4'>⭐ Years of Experience</h3>
              <p className='text-gray-700 leading-relaxed'>
                With decades of combined experience in award show management, our team knows exactly what it takes to deliver a flawless event. We've handled shows of all sizes and complexities, from intimate corporate gatherings to grand international award ceremonies.
              </p>
            </div>
          </div>
        </div>

        {/* Services Provided */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold mb-8 text-primary'>Complete Award Show Services</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {[
              'Venue Selection & Management',
              'Ticketing Management',
              'Program Development',
              'Nominee Reel Production',
              'Food & Beverage',
              'Theme & Décor Design',
              'Vendor Management',
              'Creative Direction',
              'Event Staffing & Logistics',
              'Scripting',
              'Entertainment Booking',
              'Marketing & Promotion',
              'Media Management',
              'Budget Management',
              'Live Streaming',
              'Photography & Videography'
            ].map((service, idx) => (
              <div 
                key={idx} 
                className='bg-gradient-to-br from-primary/5 to-secondary/5 p-4 rounded-lg border-l-2 border-primary hover:shadow-lg transition'
              >
                <p className='text-primary font-semibold'>✓ {service}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className='text-center mb-16 bg-gradient-to-r from-primary/5 to-secondary/5 p-12 rounded-lg border border-primary/30'>
          <h3 className='text-4xl font-bold mb-4 text-primary'>Ready to Plan Your Award Show?</h3>
          <p className='text-gray-700 text-lg mb-8 max-w-2xl mx-auto'>Let Ananta Events create an unforgettable experience for your guests</p>
          <button className='bg-primary text-white px-10 py-4 rounded-lg font-bold hover:opacity-90 transition text-lg shadow-lg'>
            Contact Us Today
          </button>
        </div>
      </div>

     
    </div>
  );
};

export default AwardShowDetail;