import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const ReunionDetail = () => {
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
        const foundEvent = data.find(e => e.id === 'reunion-event');
        
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
            <p className='text-secondary text-xl font-semibold mb-2'>👥 REUNION EVENTS</p>
            <h1 className='text-5xl md:text-6xl font-bold mb-4'>{event.title}</h1>
            <p className='text-gray-100 text-lg'>Relive Old Memories and Strengthen Bonds</p>
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
          <h2 className='text-4xl font-bold mb-4 text-primary'>Reunion Events Registration & Management</h2>
          <h3 className='text-2xl font-semibold mb-4 text-secondary'>Make Your Next Reunion a Memorable Experience</h3>
          <p className='text-gray-700 leading-relaxed text-lg mb-4'>
            The joy of meeting with your old friends after years can never be explained in words! It is a feeling that drives many to take up the responsibility of organizing alumni events. You can simplify your Reunion Events Registration with Ananta's flexible and feature-rich Event and Payment Management platform.
          </p>
          <p className='text-gray-700 leading-relaxed text-lg mb-4'>
            Let your members view reunion details with this amazing solution provider. Help attendees register and submit information seamlessly and without any hassle; store it for your future use. Access the marketing capabilities of our Reunion Events Registration software to promote your events extensively.
          </p>
          <p className='text-gray-700 leading-relaxed text-lg'>
            We are one of the best golden jubilee celebration events planner located in Dhaka and Chittagong. Planning for a class reunion calls for good event planning ideas that include the whole group.
          </p>
        </div>

        {/* Image Gallery with Swiper */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold mb-8 text-primary'>Our Reunion Events Gallery</h2>
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

        {/* Key Planning Points */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold text-primary mb-8'>Class Reunion Planning Tips</h2>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Plan Early */}
            <div className='bg-white p-8 rounded-lg border-l-4 border-primary shadow-md hover:shadow-lg transition'>
              <h3 className='text-2xl font-bold text-primary mb-4'>📅 Plan Early</h3>
              <p className='text-gray-700 leading-relaxed'>
                A reunion calls for good planning prior to the event. Ideally planning for reunions should start 12 months prior the event. Book the party site, events and entertainment early to get the best deals and availability.
              </p>
            </div>

            {/* Party Theme */}
            <div className='bg-white p-8 rounded-lg border-l-4 border-secondary shadow-md hover:shadow-lg transition'>
              <h3 className='text-2xl font-bold text-secondary mb-4'>🎨 Party Theme</h3>
              <p className='text-gray-700 leading-relaxed'>
                Decide on an exciting party theme that keeps everybody interested. Do not plan formal events as people prefer casual settings. A casual party theme is best as they will feel free to interact and enjoy.
              </p>
            </div>

            {/* Party Decorations */}
            <div className='bg-white p-8 rounded-lg border-l-4 border-primary shadow-md hover:shadow-lg transition'>
              <h3 className='text-2xl font-bold text-primary mb-4'>🎉 Party Decorations</h3>
              <p className='text-gray-700 leading-relaxed'>
                A reunion event can look stunning with the correct party decorations. Use pictures of teachers, class activities, sports and graduation ceremonies. For a beach reunion, decorate with sand castles or innovative items like flamingos and beach balls.
              </p>
            </div>

            {/* Music Level */}
            <div className='bg-white p-8 rounded-lg border-l-4 border-secondary shadow-md hover:shadow-lg transition'>
              <h3 className='text-2xl font-bold text-secondary mb-4'>🎵 Perfect Music Level</h3>
              <p className='text-gray-700 leading-relaxed'>
                A reunion event should be thrilling and calm. Avoid loud music as people join to revive old friendships and memories. Earsplitting music will hinder conversation and nobody will like to scream to talk.
              </p>
            </div>

            {/* Activities & Games */}
            <div className='bg-white p-8 rounded-lg border-l-4 border-primary shadow-md hover:shadow-lg transition'>
              <h3 className='text-2xl font-bold text-primary mb-4'>🎮 Activities & Games</h3>
              <p className='text-gray-700 leading-relaxed'>
                A class reunion event is incomplete without exciting games and activities. Scavenger hunt games are great party activities. A karaoke contest will also add zing to the party and keep everyone engaged.
              </p>
            </div>

            {/* Party Favors */}
            <div className='bg-white p-8 rounded-lg border-l-4 border-secondary shadow-md hover:shadow-lg transition'>
              <h3 className='text-2xl font-bold text-secondary mb-4'>🎁 Party Favors</h3>
              <p className='text-gray-700 leading-relaxed'>
                Party favors could range from imprinted school pens, bags with the school name, mugs, personalized t-shirts or custom calendars. Personalized costumes with school names make great keepsakes.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold mb-8 text-primary'>Our Features</h2>
          
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {[
              { icon: '📸', title: 'Photography & Videography', desc: 'Professional photo and video coverage' },
              { icon: '🎨', title: 'Theme Decoration', desc: 'Nostalgic and modern themes' },
              { icon: '🎉', title: 'Entertainment', desc: 'Music, games and activities' },
              { icon: '📝', title: 'Memory Collection', desc: 'Guest books and memory walls' },
              { icon: '🎤', title: 'Live Music', desc: 'Professional DJ and musicians' },
              { icon: '🏆', title: 'Memory Wall', desc: 'Interactive memory displays' }
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

        

    
      

        {/* CTA Section */}
        <div className='text-center mb-16 bg-gradient-to-r from-primary/5 to-secondary/5 p-12 rounded-lg border border-primary/30'>
          <h3 className='text-4xl font-bold mb-4 text-primary'>Plan Your Reunion Today</h3>
          <p className='text-gray-700 text-lg mb-8 max-w-2xl mx-auto'>Let Ananta Events help you create unforgettable memories with your friends and classmates</p>
          <button className='bg-primary text-white px-10 py-4 rounded-lg font-bold hover:opacity-90 transition text-lg shadow-lg'>
            Contact Us Today
          </button>
        </div>
      </div>

      
    </div>
  );
};

export default ReunionDetail;