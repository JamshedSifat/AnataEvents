import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import EventCoverage from '../../../EventCoverage/EventCoverage';

const FashionShowDetail = () => {
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gallery Images
  const galleryImages = [
    {
      id: 1,
      title: 'Runway Setup',
      url: 'https://www.anantabd.net/wp-content/uploads/2020/01/fashion-768x211.jpg'
    },
    {
      id: 2,
      title: 'Fashion Model',
      url: 'https://images.unsplash.com/photo-1510631318454-1f1724142e8b?w=800&h=600&fit=crop'
    },
    {
      id: 3,
      title: 'Stage Lighting',
      url: 'https://images.unsplash.com/photo-1511379938547-c1f69b13e835?w=800&h=600&fit=crop'
    },
    {
      id: 4,
      title: 'Fashion Show',
      url: 'https://images.unsplash.com/photo-1469047411149-fa1ec76a6f7b?w=800&h=600&fit=crop'
    },
    {
      id: 5,
      title: 'Backstage',
      url: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800&h=600&fit=crop'
    },
    {
      id: 6,
      title: 'Designer Collection',
      url: 'https://images.unsplash.com/photo-1570158268183-d296b2892211?w=800&h=600&fit=crop'
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
        const foundEvent = data.find(e => e.id === 'fashion-show');
        
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
        <div className='absolute top-6 left-6 z-20'>
          <button 
            onClick={() => navigate('/services/SpecialEvent')}
            className='bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2'
          >
            <span className='text-xl'>←</span>
            <span>Back to Events</span>
          </button>
        </div>

        {/* Background Image */}
        <img 
          src={event.image} 
          alt={event.title}
          className='w-full h-full object-cover opacity-30'
        />
        
        {/* Gradient Overlay */}
        <div className='absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent'></div>
        
        {/* Content */}
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='text-center text-white px-4'>
            <p className='text-secondary text-xl font-semibold mb-2'>👗 FASHION SHOWS</p>
            <h1 className='text-5xl md:text-6xl font-bold mb-4'>{event.title}</h1>
            <p className='text-gray-100 text-lg'>Professional Fashion Event Management</p>
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
          <h2 className='text-4xl font-bold mb-4 text-primary'>Fashion Show Organizers in Bangladesh</h2>
          <p className='text-gray-700 leading-relaxed text-lg mb-4'>
            We are expert into show event services. Fashion Shows are one of them. Ananta Events is one of the best Fashion Shows services provider. If we are talking about the concept of Models, Stage, Host any service related to Fashion Shows - Ananta Event will be best out of thousand event companies.
          </p>
          <p className='text-gray-700 leading-relaxed text-lg mb-4'>
            We work for Fashion Shows Models Arrangements, Stage and Venue management, and much more. If you have any kind of Fashion show requirement please reach our office or call our experts anytime to get best services.
          </p>
          <p className='text-gray-700 leading-relaxed text-lg'>
            Ananta Events - Rock Show Organisers, Laser Show Organisers, Fashion Show Organisers, Theme Party Organizers, Event Management Services, Corporate Party Organizers in Dhaka & Chittagong Bangladesh.
          </p>
        </div>

        {/* Image Gallery with Swiper */}
     <div className='mb-16'>
               <h2 className='text-3xl font-bold mb-8 text-primary'>Our Fashion Show Gallery</h2>
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

        {/* Key Focus Areas */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold text-primary mb-8'>We Pay Due Attention to the Following Areas</h2>
          
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {/* Venue and Time */}
            <div className='bg-white p-8 rounded-lg border-l-4 border-primary shadow-md hover:shadow-lg transition'>
              <h3 className='text-2xl font-bold text-primary mb-4'>📍 Venue And Time</h3>
              <p className='text-gray-700 leading-relaxed'>
                We select prime locations of fashion show events with an understanding of the class of audience. The timing of the fashion event and fashion event coordinator is carefully selected convenient to both the clients and the audience.
              </p>
            </div>

            {/* Theme */}
            <div className='bg-white p-8 rounded-lg border-l-4 border-secondary shadow-md hover:shadow-lg transition'>
              <h3 className='text-2xl font-bold text-secondary mb-4'>🎨 Theme</h3>
              <p className='text-gray-700 leading-relaxed'>
                Our creative designers are expert in proposing a variety of themes and select the best one that goes with the concept. The concept of designer wardrobes and accessories is selected according to the style and execution of the theme.
              </p>
            </div>

            {/* Bangladeshi Models */}
            <div className='bg-white p-8 rounded-lg border-l-4 border-primary shadow-md hover:shadow-lg transition'>
              <h3 className='text-2xl font-bold text-primary mb-4'>👗 Bangladeshi Models</h3>
              <p className='text-gray-700 leading-relaxed'>
                Our experienced and glamorous Bangladeshi models exhibit designer clothes with entire aura and confidence. They add value to the whole fashion event and create buzz amongst the audience.
              </p>
            </div>
          </div>
        </div>

        {/* Our Services */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold mb-8 text-primary'>Our Services</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {event.services.map((service, idx) => (
              <div key={idx} className='border-2 border-primary p-6 rounded-lg hover:shadow-lg transition'>
                <h3 className='text-xl font-bold text-primary mb-2'>✓ {service}</h3>
                <p className='text-gray-600 text-sm'>Professional quality service assured</p>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Section */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold text-primary mb-8'>Our Success Stories</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {[
              { title: 'Luxury Brand Launch', year: '2024' },
              { title: 'Designer Collection', year: '2023' },
              { title: 'Fashion Week', year: '2023' },
              { title: 'Student Fashion Show', year: '2024' }
            ].map((item, idx) => (
              <div key={idx} className='bg-gradient-to-br from-primary/5 to-secondary/5 h-64 rounded-lg flex flex-col items-center justify-center border border-primary/20 hover:shadow-lg transition'>
                <p className='text-primary font-bold text-lg'>{item.title}</p>
                <p className='text-gray-600 text-sm mt-2'>{item.year}</p>
              </div>
            ))}
          </div>
        </div>
        <EventCoverage></EventCoverage>
      </div>
    </div>
  );
};

export default FashionShowDetail;