import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const LaserShowDetail = () => {
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gallery Images
  const galleryImages = [
    {
      id: 1,
      title: 'Laser Light Display',
      url: 'https://images.unsplash.com/photo-1511379938547-c1f69b13e835?w=800&h=600&fit=crop'
    },
    {
      id: 2,
      title: 'Fireworks Show',
      url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&h=600&fit=crop'
    },
    {
      id: 3,
      title: 'Night Spectacular',
      url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop'
    },
    {
      id: 4,
      title: 'Aerial Effects',
      url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=600&fit=crop'
    },
    {
      id: 5,
      title: 'Synchronized Display',
      url: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800&h=600&fit=crop'
    },
    {
      id: 6,
      title: 'Celebration Moment',
      url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop'
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
        const foundEvent = data.find(e => e.id === 'laser-show');
        
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
            <p className='text-secondary text-xl font-semibold mb-2'>✨ LASER & FIREWORKS SHOWS</p>
            <h1 className='text-5xl md:text-6xl font-bold mb-4'>{event.title}</h1>
            <p className='text-gray-100 text-lg'>Stunning Visual Experience & Pyrotechnic Displays</p>
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
          <h2 className='text-4xl font-bold mb-6 text-primary'>Laser Show & Fireworks Organizer Company in Dhaka, Bangladesh</h2>
          <p className='text-gray-700 leading-relaxed text-lg mb-4'>
            Ananta Events & Entertainment is Bangladesh's premium Laser Multimedia Show Company offering a world of laser show entertainment. We provide laser shows and special effects for any type of event from a product launch to birthday event, exhibitions to film festivals, Indoor or Outdoor - we have the complete solution.
          </p>
          <p className='text-gray-700 leading-relaxed text-lg mb-4'>
            With high powered 30W RGB (Multi Color) Laser System to 20W GREEN Laser systems, we ensure your event will look spectacular. Our advanced laser technology creates stunning visual experiences that captivate audiences and leave lasting impressions.
          </p>
          <p className='text-gray-700 leading-relaxed text-lg'>
            Ananta Events & Entertainment was formed in the year 2006. During these years, we have executed numerous shows in Bangladesh and provided special laser effects for the entertainment industry. We turn your vision into reality with our goal of providing spectacular laser light shows, exceptional customer service, and best production quality.
          </p>
        </div>

        {/* Company Overview */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold text-primary mb-8'>About Our Company</h2>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Established */}
            <div className='bg-white p-8 rounded-lg border-l-4 border-primary shadow-md hover:shadow-lg transition'>
              <h3 className='text-2xl font-bold text-primary mb-4'>📅 Established in 2006</h3>
              <p className='text-gray-700 leading-relaxed'>
                With nearly 20 years of experience, Ananta Events & Entertainment has built a reputation as Bangladesh's leading laser show company. Our proven track record speaks to our commitment to excellence and innovation in the entertainment industry.
              </p>
            </div>

            {/* Specialization */}
            <div className='bg-white p-8 rounded-lg border-l-4 border-secondary shadow-md hover:shadow-lg transition'>
              <h3 className='text-2xl font-bold text-secondary mb-4'>🎯 Specialized Services</h3>
              <p className='text-gray-700 leading-relaxed'>
                We specialize in both Indoor and Outdoor laser multimedia show entertainment. Our expertise covers Special Events, Corporate Events, Trade Shows, Concerts, Trade & Exhibitions, Movies, Product Launches, and Permanent Theme Park installations.
              </p>
            </div>

            {/* Technology */}
            <div className='bg-white p-8 rounded-lg border-l-4 border-primary shadow-md hover:shadow-lg transition'>
              <h3 className='text-2xl font-bold text-primary mb-4'>⚡ Advanced Technology</h3>
              <p className='text-gray-700 leading-relaxed'>
                Our arsenal includes high-powered 30W RGB (Multi Color) Laser systems and 20W GREEN Laser systems. This cutting-edge technology ensures your events are visually stunning and technically superior.
              </p>
            </div>

            {/* Location */}
            <div className='bg-white p-8 rounded-lg border-l-4 border-secondary shadow-md hover:shadow-lg transition'>
              <h3 className='text-2xl font-bold text-secondary mb-4'>📍 Based in Dhaka</h3>
              <p className='text-gray-700 leading-relaxed'>
                Headquartered in Dhaka, Bangladesh, we serve clients across the country and beyond. Our centralized location allows us to efficiently manage projects and provide exceptional service to all our clients.
              </p>
            </div>
          </div>
        </div>

        {/* Image Gallery with Swiper */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold mb-8 text-primary'>Our Laser & Fireworks Gallery</h2>
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

        {/* Event Types We Cover */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold text-primary mb-8'>Event Types We Specialize In</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {[
              'Product Launches',
              'Birthday Parties',
              'Exhibitions',
              'Film Festivals',
              'Corporate Events',
              'Concerts',
              'Trade Shows',
              'School/College Events',
              'Marriage Ceremonies',
              'Theme Park Events',
              'Wedding Receptions',
              'Special Occasions'
            ].map((eventType, idx) => (
              <div 
                key={idx} 
                className='bg-gradient-to-br from-primary/5 to-secondary/5 p-4 rounded-lg border-l-2 border-primary hover:shadow-lg transition text-center'
              >
                <p className='text-primary font-semibold'>✨ {eventType}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold text-primary mb-8'>Why Choose Our Laser Show Services</h2>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Advanced Technology */}
            <div className='bg-white p-8 rounded-lg border-l-4 border-primary shadow-md hover:shadow-lg transition'>
              <h3 className='text-2xl font-bold text-primary mb-4'>🎆 Advanced Technology</h3>
              <p className='text-gray-700 leading-relaxed'>
                High-powered 30W RGB and 20W GREEN laser systems ensure spectacular visual effects. Our cutting-edge equipment is maintained to the highest standards for consistent performance.
              </p>
            </div>

            {/* Professional Expertise */}
            <div className='bg-white p-8 rounded-lg border-l-4 border-secondary shadow-md hover:shadow-lg transition'>
              <h3 className='text-2xl font-bold text-secondary mb-4'>👨‍💼 Professional Expertise</h3>
              <p className='text-gray-700 leading-relaxed'>
                With nearly 20 years of experience, our team has executed countless shows. We bring artistic vision and technical precision to every project, turning your vision into reality.
              </p>
            </div>

            {/* Complete Solutions */}
            <div className='bg-white p-8 rounded-lg border-l-4 border-primary shadow-md hover:shadow-lg transition'>
              <h3 className='text-2xl font-bold text-primary mb-4'>🎯 Complete Solutions</h3>
              <p className='text-gray-700 leading-relaxed'>
                Indoor or outdoor, small or large scale, we have complete solutions for all your laser and special effects needs. From concept to execution, we manage everything professionally.
              </p>
            </div>

            {/* Safety & Compliance */}
            <div className='bg-white p-8 rounded-lg border-l-4 border-secondary shadow-md hover:shadow-lg transition'>
              <h3 className='text-2xl font-bold text-secondary mb-4'>🛡️ Safety & Compliance</h3>
              <p className='text-gray-700 leading-relaxed'>
                We prioritize safety with complete compliance to all regulations. Our team follows strict safety protocols ensuring a secure event for all attendees and participants.
              </p>
            </div>
          </div>
        </div>

        {/* Capabilities */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold mb-8 text-primary'>Our Capabilities</h2>
          
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {[
              { icon: '💡', title: 'RGB Laser Shows', desc: '30W Multi-Color laser displays' },
              { icon: '🟢', title: 'Green Laser Effects', desc: '20W precision green laser systems' },
              { icon: '🔊', title: 'Sound Sync', desc: 'Music synchronized laser displays' },
              { icon: '🎆', title: 'Fireworks Integration', desc: 'Combined laser & fireworks shows' },
              { icon: '📱', title: 'Smart Control', desc: 'Remote operation & automation' },
              { icon: '🏆', title: 'Award Winning', desc: '150+ shows successfully completed' }
            ].map((feature, idx) => (
              <div key={idx} className='bg-gradient-to-br from-primary/5 to-secondary/5 p-6 rounded-lg text-center border border-primary/20 hover:shadow-lg transition'>
                <p className='text-4xl mb-3'>{feature.icon}</p>
                <h3 className='text-xl font-bold text-primary mb-2'>{feature.title}</h3>
                <p className='text-gray-600 text-sm'>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Services List */}
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

      </div>

    
    </div>
  );
};

export default LaserShowDetail;