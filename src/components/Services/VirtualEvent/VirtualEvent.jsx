import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const VirtualEvent = () => {
  const [activeTab, setActiveTab] = useState('virtual');

  // Video Data
  const videos = [
    {
      id: 1,
      title: 'Virtual Conference Demo',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      description: 'Watch our virtual conference setup'
    },
    {
      id: 2,
      title: 'Live Streaming Setup',
      url: 'https://www.youtube.com/embed/9bZkp7q19f0',
      description: 'Professional live streaming technology'
    },
    {
      id: 3,
      title: 'Hybrid Event Experience',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw',
      description: 'Seamless hybrid event management'
    },
    {
      id: 4,
      title: 'Virtual Exhibition Tour',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      description: 'Interactive virtual exhibition platform'
    },
    {
      id: 5,
      title: 'Studio Production',
      url: 'https://www.youtube.com/embed/9bZkp7q19f0',
      description: 'Professional studio setup & production'
    },
    {
      id: 6,
      title: 'Virtual Networking',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw',
      description: 'Engaging virtual networking experience'
    }
  ];

  // Gallery Images
  const galleryImages = [
    {
      id: 1,
      title: 'Virtual Conference',
      url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop'
    },
    {
      id: 2,
      title: 'Virtual Exhibition',
      url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&h=600&fit=crop'
    },
    {
      id: 3,
      title: 'Live Streaming Setup',
      url: 'https://images.unsplash.com/photo-1511379938547-c1f69b13e835?w=800&h=600&fit=crop'
    },
    {
      id: 4,
      title: 'Hybrid Event',
      url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop'
    },
    {
      id: 5,
      title: 'Studio Setup',
      url: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800&h=600&fit=crop'
    },
    {
      id: 6,
      title: 'Virtual Networking',
      url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=600&fit=crop'
    }
  ];

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <div className='relative h-96 md:h-[500px] overflow-hidden bg-gradient-to-r from-primary to-secondary'>
        <img 
          src='https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop'
          alt='Virtual Event'
          className='w-full h-full object-cover opacity-30'
        />
        
        <div className='absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent'></div>
        
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='text-center text-white px-4'>
            <p className='text-secondary text-xl font-semibold mb-2'>🌐 VIRTUAL EVENTS</p>
            <h1 className='text-5xl md:text-6xl font-bold mb-4'>Virtual Event Management</h1>
            <p className='text-gray-100 text-lg'>Seamless Virtual & Hybrid Event Planning Solutions</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-6xl mx-auto px-4 py-16'>
        {/* Introduction Section */}
        <div className='bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-lg mb-16 border-l-4 border-primary'>
          <h2 className='text-4xl font-bold mb-6 text-primary'>Virtual Event Management & Planning</h2>
          <p className='text-gray-700 leading-relaxed text-lg mb-4'>
            Are you trying to find virtual event solutions to make reference to global audience beyond physical bounds? Ananta Events Bangladesh is that the virtual event company that gets you covered by offering seamless virtual event planning and strategic content production with utilization of inventive technologies and experienced digital event strategies.
          </p>
          <p className='text-gray-700 leading-relaxed text-lg mb-4'>
            Whether you're choosing hybrid events or fully virtual events, starting from virtual conferences, virtual exhibition, virtual trade shows, virtual meetings, online conferences, webinars, company meetings to product launches, we are dedicated to assist you create an immersive environment that permits virtual networking and maximizes engagement for your audience.
          </p>
          <p className='text-gray-700 leading-relaxed text-lg'>
            Ananta Events Bangladesh is leading virtual event planner in total brand activation specialising in engaging people, creating experiences and activating brands. Our businesses are diversified in numerous cities across Bangladesh.
          </p>
        </div>

        {/* Video Section */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold text-primary mb-8'>Watch Our Virtual Event Demos</h2>
          
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {videos.map((video) => (
              <div key={video.id} className='bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition'>
                {/* Video Container */}
                <div className='relative bg-black overflow-hidden'>
                  <iframe
                    width='100%'
                    height='200'
                    src={video.url}
                    title={video.title}
                    frameBorder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                    className='w-full h-48'
                  ></iframe>
                </div>

                {/* Video Info */}
                <div className='p-4'>
                  <h3 className='text-lg font-bold text-primary mb-2'>{video.title}</h3>
                  <p className='text-gray-600 text-sm'>{video.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Key Features Below Videos */}
          <div className='mt-12 bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-lg border-l-4 border-primary'>
            <h3 className='text-2xl font-bold text-primary mb-6'>Why Our Virtual Events Stand Out</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              {[
                { icon: '🌐', label: 'Global Reach' },
                { icon: '⚡', label: 'Live Streaming' },
                { icon: '🎯', label: 'Interactive' },
                { icon: '📊', label: 'Engagement Metrics' }
              ].map((feature, idx) => (
                <div key={idx} className='text-center'>
                  <p className='text-4xl mb-2'>{feature.icon}</p>
                  <p className='text-gray-700 font-semibold'>{feature.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Image Gallery with Swiper */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold mb-8 text-primary'>Our Virtual Events Gallery</h2>
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

            <button className='swiper-button-prev !w-12 !h-12 !bg-primary/80 !rounded-full !text-white !top-1/2 !-translate-y-1/2 !left-4 transition shadow-lg' />
            <button className='swiper-button-next !w-12 !h-12 !bg-primary/80 !rounded-full !text-white !top-1/2 !-translate-y-1/2 !right-4 transition shadow-lg' />

            <div className='swiper-pagination !bottom-4'></div>
          </div>
        </div>

        {/* Services Tabs */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold text-primary mb-8'>Our Event Services</h2>
          
          {/* Tab Buttons */}
          <div className='flex flex-wrap gap-4 mb-8'>
            {['virtual', 'hybrid', 'live'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-lg font-semibold transition ${
                  activeTab === tab
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tab === 'virtual' && '🌐 Virtual'}
                {tab === 'hybrid' && '🔄 Hybrid'}
                {tab === 'live' && '📍 Live'}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {(activeTab === 'virtual' 
              ? ['Created on-demand content', 'LED studio', 'Green screen technology', 'Broadcasting from studio', 'Live editing team', 'Studio hire for events', 'Live-streaming & webinars', 'Custom built websites', 'Virtual Entertainment', 'Gift boxes & PR packages', 'Interstitial video', 'Event platforms']
              : activeTab === 'hybrid'
              ? ['Bespoke Mobile studio', 'Live-streaming & webcasting', 'Live audio and video', 'Break out rooms', 'Entertainment & speakers', 'Sanitising stations', 'Covid-safe facilities', 'Gift bags & resources', 'Live editing team', 'Synchronised slides', 'Live commentary', 'Multi-language translation']
              : ['Pre-event venue cleaning', 'Timeslot bookings', 'Better air installation', 'Temperature check', 'Disinfection mist', 'Sanitisation stations', 'Photo badges', 'Mask photo check', 'Personal sanitation kit', 'Safe distancing layout', 'Contactless card exchange', 'Covid-safe entertainment']
            ).map((service, idx) => (
              <div 
                key={idx} 
                className='bg-gradient-to-br from-primary/5 to-secondary/5 p-4 rounded-lg border-l-2 border-primary'
              >
                <p className='text-primary font-semibold text-sm'>✓ {service}</p>
              </div>
            ))}
          </div>
        </div>


        {/* CTA Section */}
        <div className='text-center mb-16 bg-gradient-to-r from-primary/5 to-secondary/5 p-12 rounded-lg border border-primary/30'>
          <h3 className='text-4xl font-bold mb-4 text-primary'>Host Your Virtual Event Today</h3>
          <p className='text-gray-700 text-lg mb-8 max-w-2xl mx-auto'>Create an immersive virtual experience that engages your global audience</p>
          <button className='bg-primary text-white px-10 py-4 rounded-lg font-bold hover:opacity-90 transition text-lg shadow-lg'>
            Contact Us
          </button>
        </div>
      </div>

   
    </div>
  );
};

export default VirtualEvent;