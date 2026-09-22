import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { api } from '../../../services/api';
import { SectionSpinner } from '../../LoadingSpinner/AsyncState';
import SPECIAL_EVENT_CONTENT from './specialEventContent';

/**
 * Dynamic special-event detail page.
 *
 * Replaces the seven old static routes (/services/SpecialEvent/award-show …)
 * with a single data-driven route (/services/special-events/:slug) that
 * renders the identical layout: hero, stats, intro, gallery swiper,
 * "why hire us" cards, services grid and CTA. Per-page copy that is not in
 * the database lives in specialEventContent.js.
 */
const SpecialEventDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const content = SPECIAL_EVENT_CONTENT[slug] || {};

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .get(`/service-entries/${slug}/`)
      .then((res) => {
        if (!cancelled) setEvent(res.data);
      })
      .catch(() => {
        if (!cancelled) setError('Event not found');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <SectionSpinner label='Loading Event Details...' />
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
            onClick={() => navigate('/services/special-events')}
            className='bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition'
          >
            ← Back to Events
          </button>
        </div>
      </div>
    );
  }

  const galleryImages =
    content.galleryImages?.length > 0
      ? content.galleryImages
      : (event.images || []).map((url, i) => ({ id: i, title: event.title, url }));
  const services =
    content.services?.length > 0 ? content.services : event.includedServices || [];
  const intro = content.intro?.length ? content.intro : [event.content].filter(Boolean);

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <div className='relative h-96 md:h-[500px] overflow-hidden bg-gradient-to-r from-primary to-secondary'>
        {/* Back Button */}
        <div className='absolute top-12 left-6 z-20'>
          <button
            onClick={() => navigate('/services/special-events')}
            className='bg-white/10 backdrop-blur-md border border-white/20 hover:border-primary text-white px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2 hover:bg-primary/20'
          >
            <span className='text-xl'>←</span>
            <span>Back to Events</span>
          </button>
        </div>

        {/* Background Image */}
        <img
          src={event.coverImage || (event.images && event.images[0]) || ''}
          alt={event.title}
          className='w-full h-full object-cover opacity-80'
        />

        {/* Content */}
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='text-center text-white px-4'>
            <p className='text-white text-xl font-bold mb-2'>{content.heroBadge || '🎉 SPECIAL EVENTS'}</p>
            <h1 className='text-5xl md:text-6xl font-bold mb-4'>{event.title}</h1>
            <p className='text-gray-100 text-lg'>{event.excerpt || 'Professional Event Management Services'}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-6xl mx-auto px-4 py-16'>
        {/* Stats Section */}
        {(event.stats || []).length > 0 && (
          <div className='grid grid-cols-3 gap-4 mb-16'>
            {event.stats.map((stat, idx) => (
              <div key={idx} className='bg-gradient-to-br from-primary to-secondary p-8 rounded-lg text-center text-white shadow-lg'>
                <p className='text-3xl font-bold mb-2'>{stat.number}</p>
                <p className='text-gray-100 text-sm'>{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Introduction Section */}
        <div className='bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-lg mb-16 border-l-4 border-primary'>
          <h2 className='text-4xl font-bold mb-4 text-primary'>{event.title}</h2>
          {intro.map((para, idx) => (
            <p key={idx} className='text-gray-700 leading-relaxed text-lg mb-4'>
              {para}
            </p>
          ))}
        </div>

        {/* Image Gallery with Swiper */}
        {galleryImages.length > 0 && (
          <div className='mb-16'>
            <h2 className='text-3xl font-bold mb-8 text-primary'>Our Event Gallery</h2>
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
                effect='fade'
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
        )}

        {/* Why Hire Us Section */}
        {content.whyCards?.length > 0 && (
          <div className='mb-16'>
            <h2 className='text-3xl font-bold mb-8 text-primary'>Why Hire Us?</h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-12'>
              {content.whyCards.map((card, idx) => (
                <div
                  key={idx}
                  className={`bg-white p-8 rounded-lg border-l-4 ${idx % 2 === 0 ? 'border-primary' : 'border-secondary'} shadow-md hover:shadow-lg transition`}
                >
                  <h3 className={`text-2xl font-bold ${idx % 2 === 0 ? 'text-primary' : 'text-secondary'} mb-4`}>
                    {card.title}
                  </h3>
                  <p className='text-gray-700 leading-relaxed'>{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services Provided */}
        {services.length > 0 && (
          <div className='mb-16'>
            <h2 className='text-3xl font-bold mb-8 text-primary'>Complete Event Services</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {services.map((service, idx) => (
                <div
                  key={idx}
                  className='bg-gradient-to-br from-primary/5 to-secondary/5 p-4 rounded-lg border-l-2 border-primary hover:shadow-lg transition'
                >
                  <p className='text-primary font-semibold'>✓ {service}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className='text-center mb-16 bg-gradient-to-r from-primary/5 to-secondary/5 p-12 rounded-lg border border-primary/30'>
          <h3 className='text-4xl font-bold mb-4 text-primary'>{content.ctaHeading || 'Ready to Plan Your Event?'}</h3>
          <p className='text-gray-700 text-lg mb-8 max-w-2xl mx-auto'>Let Ananta Events create an unforgettable experience for your guests</p>
          <button
            onClick={() => navigate('/contact')}
            className='bg-primary text-white px-10 py-4 rounded-lg font-bold hover:opacity-90 transition text-lg shadow-lg'
          >
            Contact Us Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpecialEventDetail;
