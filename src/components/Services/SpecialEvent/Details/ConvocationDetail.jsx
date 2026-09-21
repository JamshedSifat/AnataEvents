import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const ConvocationDetail = () => {
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gallery Images
  const galleryImages = [
   {
      id: 1,
      title: 'Reunion Gathering',
      url: 'https://www.anantabd.net/wp-content/uploads/2020/03/Reunion-Events-2.jpg'
    },
    {
      id: 2,
      title: 'Alumni Meeting',
      url: 'https://www.anantabd.net/wp-content/uploads/2020/03/Reunion-Events-67-768x489.jpg'
    },
    {
      id: 3,
      title: 'Memory Wall',
      url: 'https://www.anantabd.net/wp-content/uploads/2020/03/Reunion-Events-4-768x576.jpg'
    },
    {
      id: 4,
      title: 'Group Photo',
      url: 'https://www.anantabd.net/wp-content/uploads/2020/03/Reunion-Events-6-1024x768.jpg'
    },
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
        const foundEvent = data.find(e => e.id === 'convocation-event');
        
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
            <p className='text-secondary text-xl font-semibold mb-2'>🎓 CONVOCATION EVENTS</p>
            <h1 className='text-5xl md:text-6xl font-bold mb-4'>{event.title}</h1>
            <p className='text-gray-100 text-lg'>Professional Academic Ceremony Management</p>
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
          <h2 className='text-4xl font-bold mb-4 text-primary'>University Convocation Event Organizer</h2>
          <p className='text-gray-700 leading-relaxed text-lg mb-4'>
            Ananta Events and Entertainment is the best Convocation Event Management Company and Event Planner in Bangladesh. We are actively engaged in providing University Convocation Event Management Services to our clients in Dhaka, Bangladesh.
          </p>
          <p className='text-gray-700 leading-relaxed text-lg'>
            We make proper sitting arrangements for audience. We arrange suitable chairs, tables and banners as per the requirement specified by the clients. We provide all the necessary equipment necessary for an event including Graduation Caps and Gowns, certificate files, gifts, chairs, tables, stages, decoration, Event Branding, Musical Shows arrangement, AV, Lighting, Truss - a one-stop event planning solution.
          </p>
        </div>

        {/* Image Gallery with Swiper */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold mb-8 text-primary'>Our Convocation Events Gallery</h2>
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
            <button className='swiper-button-prev !w-12 !h-12 !bg-primary/80 !rounded-full !text-white !top-1/2 !-translate-y-1/2 !left-4 transition shadow-lg' />
            <button className='swiper-button-next !w-12 !h-12 !bg-primary/80 !rounded-full !text-white !top-1/2 !-translate-y-1/2 !right-4 transition shadow-lg' />

            {/* Pagination */}
            <div className='swiper-pagination !bottom-4'></div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold text-primary mb-8'>Why Choose Our Convocation Services</h2>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Audio System */}
            <div className='bg-white p-8 rounded-lg border-l-4 border-primary shadow-md hover:shadow-lg transition'>
              <h3 className='text-2xl font-bold text-primary mb-4'>🎤 Professional Audio System</h3>
              <p className='text-gray-700 leading-relaxed'>
                We use well-tested microphones and speakers so that participants can hear the speech clearly. Our audio equipment ensures perfect sound quality throughout the entire ceremony for all attendees.
              </p>
            </div>

            {/* Timely Execution */}
            <div className='bg-white p-8 rounded-lg border-l-4 border-secondary shadow-md hover:shadow-lg transition'>
              <h3 className='text-2xl font-bold text-secondary mb-4'>⏱️ Timely Execution</h3>
              <p className='text-gray-700 leading-relaxed'>
                Our Event Management Services are trusted by clients due to their timely execution. We understand the importance of schedule and deliver everything on time. Clients can obtain Convocation Event Management services at market-leading rates.
              </p>
            </div>

            {/* Complete Setup */}
            <div className='bg-white p-8 rounded-lg border-l-4 border-primary shadow-md hover:shadow-lg transition'>
              <h3 className='text-2xl font-bold text-primary mb-4'>🎯 Complete Setup & Arrangement</h3>
              <p className='text-gray-700 leading-relaxed'>
                We make proper sitting arrangements for audience with suitable chairs, tables and banners as per requirements. We handle everything from stage setup to decorations ensuring a professional and dignified ceremony.
              </p>
            </div>

            {/* Equipment Provision */}
            <div className='bg-white p-8 rounded-lg border-l-4 border-secondary shadow-md hover:shadow-lg transition'>
              <h3 className='text-2xl font-bold text-secondary mb-4'>📦 Complete Equipment Package</h3>
              <p className='text-gray-700 leading-relaxed'>
                We provide all necessary equipment including Graduation Caps and Gowns, certificate files, gifts, chairs, tables, stages, decoration, Event Branding, Musical Shows, AV, Lighting, and Truss setups.
              </p>
            </div>
          </div>
        </div>

        {/* How We Work */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold text-primary mb-8'>How We Work</h2>
          <div className='space-y-6'>
            {[
              { step: '01', title: 'Planning', desc: 'Detailed planning according to your requirements and academic standards' },
              { step: '02', title: 'Preparation', desc: 'Complete preparation and coordination of all elements' },
              { step: '03', title: 'Execution', desc: 'Perfect execution with professional supervision' },
              { step: '04', title: 'Evaluation', desc: 'Post-event evaluation for continuous improvement' }
            ].map((item, idx) => (
              <div key={idx} className='flex gap-6 items-start'>
                <div className='w-16 h-16 bg-gradient-to-br from-primary to-secondary text-white rounded-full flex items-center justify-center font-bold text-2xl flex-shrink-0'>
                  {item.step}
                </div>
                <div className='flex-1'>
                  <h3 className='text-xl font-bold text-primary mb-2'>{item.title}</h3>
                  <p className='text-gray-700'>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Services Offered */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold mb-8 text-primary'>Services We Offer</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <h3 className='text-2xl font-bold text-primary mb-6'>Core Services</h3>
              <div className='space-y-3'>
                {event.services.slice(0, 4).map((service, idx) => (
                  <div key={idx} className='flex items-center p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg'>
                    <span className='text-primary font-bold mr-3 text-lg'>●</span>
                    <span className='text-gray-700'>{service}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className='text-2xl font-bold text-secondary mb-6'>Additional Services</h3>
              <div className='space-y-3'>
                {event.services.slice(4).map((service, idx) => (
                  <div key={idx} className='flex items-center p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg'>
                    <span className='text-secondary font-bold mr-3 text-lg'>●</span>
                    <span className='text-gray-700'>{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Convocation Management Offerings */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold mb-8 text-primary'>Convocation Event Management Offerings</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {[
              'Theme Suggestion & Design',
              'Venue Selection & Management',
              'Creative Invitations',
              'Photography & Videography',
              'Decor & Ambience',
              'Memorable Gifts & Souvenirs',
              'Social Programs',
              'Complete Audio-Visual Setup',
              'Stage & Platform Setup',
              'Catering & Refreshments',
              'Guest Management',
              'Documentation & Records'
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
          <h3 className='text-4xl font-bold mb-4 text-primary'>Plan Your Convocation Event</h3>
          <p className='text-gray-700 text-lg mb-8 max-w-2xl mx-auto'>Let Ananta Events organize a dignified and memorable convocation ceremony for your institution</p>
          <button className='bg-primary text-white px-10 py-4 rounded-lg font-bold hover:opacity-90 transition text-lg shadow-lg'>
            Contact Us Today
          </button>
        </div>
      </div>

    
    </div>
  );
};

export default ConvocationDetail;