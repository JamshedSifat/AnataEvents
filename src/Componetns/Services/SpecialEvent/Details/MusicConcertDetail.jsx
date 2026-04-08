import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import EventCoverage from '../../../EventCoverage/EventCoverage';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const MusicConcertDetail = () => {
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const galleryImages = [
    {
      id: 1,
      title: 'Concert Stage',
      url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'
    },
    {
      id: 2,
      title: 'Live Performance',
      url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop'
    },
    {
      id: 3,
      title: 'Crowd',
      url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop'
    },
    {
      id: 4,
      title: 'Stage Lighting',
      url: 'https://images.unsplash.com/photo-1511379938547-c1f69b13e835?w=800&h=600&fit=crop'
    },
    {
      id: 5,
      title: 'DJ Performance',
      url: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800&h=600&fit=crop'
    },
    {
      id: 6,
      title: 'Concert Night',
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
        const foundEvent = data.find(e => e.id === 'music-concert');
        
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
        <p className='text-xl text-gray-600'>Loading...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-gray-800 mb-4'>⚠️ {error || 'Event not found'}</h1>
          <button 
            onClick={() => navigate('/services/SpecialEvent')}
            className='bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition'
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Header */}
      
<div className='relative h-96 md:h-[500px] overflow-hidden bg-gradient-to-r from-primary to-secondary'>
  {/* Back Button - Glass Morphism Style */}
  <div className='absolute top-12 left-6 z-20'>
    <button 
      onClick={() => navigate('/services/SpecialEvent')}
      className='bg-white/10 backdrop-blur-md border border-white/20 hover:border-accent text-white px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2 hover:bg-accent/20'
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
  
 
  
  {/* Content */}
  <div className='absolute inset-0 flex items-center justify-center'>
    <div className='text-center text-white px-4'>
      <p className='text-accent text-xl font-semibold mb-2'>🎵 LIVE MUSIC EVENTS</p>
      <h1 className='text-5xl md:text-6xl font-bold mb-4'>{event.title}</h1>
      <p className='text-gray-100 text-lg'>Your Perfect Musical Experience</p>
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
        <div className='bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-lg mb-16 border-l-4 border-accent'>
          <h2 className='text-4xl font-bold mb-4 text-primary'>Live Music Show & Concert Organizers</h2>
          <p className='text-gray-700 leading-relaxed text-lg mb-4'>
            Since Ananta Events and Entertainment has been able to supersede client's expectations by delivering on-demand events and entertainment projects at a world class standard. All our expertise and elements when fused together brings an outcome that surpasses the said expectations within the given timelines.
          </p>
          <p className='text-gray-700 leading-relaxed text-lg'>
            A high-quality flawless Concert that feels like breeze and fun to attend. The very core essence of events such as Live Concerts is the perfect planning, execution without skipping a beat.
          </p>
        </div>

          {/* Image Gallery with Swiper */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold mb-8 text-primary'>Our Events Gallery</h2>
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
            <button className='swiper-button-prev !w-12 !h-12 !rounded-full !text-white !top-1/2 !-translate-y-1/2 !left-4 transition shadow-lg' />
            <button className='swiper-button-next !w-12 !h-12  !rounded-full !text-white !top-1/2 !-translate-y-1/2 !right-4 transition shadow-lg' />

            {/* Pagination */}
            <div className='swiper-pagination !bottom-4'></div>
          </div>

         
        </div>

        {/* Why Choose Us */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold mb-8 text-primary'>Why Choose Us?</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='bg-white p-6 rounded-lg border-l-4 border-primary shadow-md hover:shadow-lg transition'>
              <h3 className='text-xl font-bold text-primary mb-3'>🎤 Artist Management</h3>
              <p className='text-gray-700'>Top artists and performers coordination with complete management services</p>
            </div>
            <div className='bg-white p-6 rounded-lg border-l-4 border-primary shadow-md hover:shadow-lg transition'>
              <h3 className='text-xl font-bold text-primary mb-3'>🎧 Sound System</h3>
              <p className='text-gray-700'>State-of-the-art audio equipment and professional mixing services</p>
            </div>
            <div className='bg-white p-6 rounded-lg border-l-4 border-primary shadow-md hover:shadow-lg transition'>
              <h3 className='text-xl font-bold text-primary mb-3'>💡 Lighting Effects</h3>
              <p className='text-gray-700'>Stunning visual lighting design and stage production</p>
            </div>
            <div className='bg-white p-6 rounded-lg border-l-4 border-primary shadow-md hover:shadow-lg transition'>
              <h3 className='text-xl font-bold text-primary mb-3'>👥 Crowd Management</h3>
              <p className='text-gray-700'>Safe and organized audience management with security</p>
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div className='bg-gradient-to-r from-primary/5 to-secondary/5 p-8 rounded-lg mb-16 border border-primary/20'>
          <h2 className='text-3xl font-bold mb-6 text-primary'>About Our Services</h2>
          <p className='text-gray-700 leading-relaxed mb-4'>
            Organizing a concert, show or gig needs enough time, manpower and materials to keep your audiences engaged with music, play or other elements. We have a decade full of expertise to withstand and suffice a reliable experience in all types of concerts.
          </p>
          <p className='text-gray-700 leading-relaxed mb-4'>
            We have exposure to organizing events in multiple scenarios with a wide variety of industry and its audiences right from local, rural to national scale branding. Our pre-planning team makes it sure that we have complete information on the purpose, tasks, expectations of the event plan.
          </p>
          <p className='text-gray-700 leading-relaxed'>
            With a bottoms-up approach we get involved in every step of setup as your virtual extended team and steadily delegate each task chain to our subordinates right from events venue, timings, plan, materials, audience management, AV/Visuals, Play, Music, Engaging activities, Artist Management, Awards, Fabrications, Staging, other Fun and feedback activities, we can cover it all.
          </p>
        </div>

        {/* Services List */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold mb-8 text-primary'>Our Services</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {event.services.map((service, idx) => (
              <div key={idx} className='bg-primary  p-4 rounded-lg border-l-4 border-black hover:shadow-lg transition'>
                <p className='text-white font-semibold text-center'>{service}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Artists Category */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold mb-8 text-primary'>Our Artist Packages</h2>
          
          {/* Solo Artists */}
          <div className='mb-8'>
            <h3 className='text-2xl font-bold text-primary mb-4 border-b-2 border-primary pb-2'>🎤 Solo Artists</h3>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
              {['Mila', 'Habib Wahid', 'Fuad & Friends', 'Arnob', 'Topu', 'Nancy', 'Bappa', 'Samina', 'Momtaj', 'Sonia', 'Akhi', 'Meherin'].map((artist, idx) => (
                <div key={idx} className='bg-primary p-3 rounded border-l-4 border-black'>
                  <p className='text-white font-semibold'>{artist}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bands */}
          <div className='mb-8'>
            <h3 className='text-2xl font-bold text-primary mb-4 border-b-2 border-primary pb-2'>🎸 Bands</h3>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
              {['Artcell', 'Black', 'Aurthohin', 'Warfaze', 'Shironamhin', 'Grove Trap', 'Stone Free', 'Bangla'].map((band, idx) => (
                <div key={idx} className='bg-primary p-3 rounded border-l-4 border-secondary'>
                  <p className='text-white font-semibold'>{band}</p>
                </div>
              ))}
            </div>
          </div>

          {/* DJs */}
          <div className='mb-8'>
            <h3 className='text-2xl font-bold text-primary mb-4 border-b-2 border-primary pb-2'>🎧 DJs</h3>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
              {['DJ Prince', 'DJ Rahat', 'DJ Himu', 'DJ Mishu', 'DJ Ratul', 'DJ Tanmay', 'DJ Trisha'].map((dj, idx) => (
                <div key={idx} className='bg-primary p-3 rounded border-l-4 border-secondary'>
                  <p className='text-white font-semibold'>{dj}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dancers */}
          <div className='mb-8'>
            <h3 className='text-2xl font-bold text-primary mb-4 border-b-2 border-primary pb-2'>💃 Dancers</h3>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
              {['Eagle', 'Shibli & Nipa', 'Sohel & Rea', 'Waseq & Group'].map((dancer, idx) => (
                <div key={idx} className='bg-primary p-3 rounded border-l-4 border-secondary'>
                  <p className='text-white font-semibold'>{dancer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Comedians */}
          <div className='mb-8'>
            <h3 className='text-2xl font-bold text-primary mb-4 border-b-2 border-primary pb-2'>😂 Comedians</h3>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
              {['Kajol', 'Sahin'].map((comedian, idx) => (
                <div key={idx} className='bg-primary p-3 rounded border-l-4 border-secondary'>
                  <p className='text-white font-semibold'>{comedian}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Magicians */}
          <div className='mb-8'>
            <h3 className='text-2xl font-bold text-primary mb-4 border-b-2 border-primary pb-2'>✨ Magicians</h3>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
              {['Jewel Aich', 'Ali Raj', 'Ulfat', 'Juliana Rini'].map((magician, idx) => (
                <div key={idx} className='bg-primary p-3 rounded border-l-4 border-secondary'>
                  <p className='text-white font-semibold'>{magician}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technology Section */}
        <div className='bg-primary p-8 rounded-lg mb-16 text-white shadow-lg'>
          <h2 className='text-3xl font-bold mb-6'>Our Technology</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {['🎬 4K Live Streaming', '🔊 360° Sound System', '✨ Laser Light Show'].map((tech, idx) => (
              <div key={idx} className='text-center bg-white/20 p-4 rounded-lg backdrop-blur'>
                <p className='text-xl font-bold'>{tech}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Coverage Area */}
        <EventCoverage></EventCoverage>

      

        {/* CTA Section */}
        <div className='mt-8 text-center mb-16 bg-gradient-to-r from-primary to-secondary p-12 rounded-lg border border-accent/30'>
          <h3 className='text-4xl font-bold mb-4 text-white'>Plan Your Concert Today</h3>
          <p className='text-gray-200 text-lg mb-8'>Get the best musical experience with Ananta Events</p>
          <button className='bg-primary text-white px-10 py-4 rounded-lg font-bold hover:opacity-90 transition text-lg shadow-lg'>
            Contact Us Now
          </button>
        </div>
      </div>

    
    </div>
  );
};

export default MusicConcertDetail;