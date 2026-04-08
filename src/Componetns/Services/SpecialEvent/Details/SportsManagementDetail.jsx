import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const SportsManagementDetail = () => {
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gallery Images
  const galleryImages = [
    {
      id: 1,
      title: 'Sports Tournament',
      url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop'
    },
    {
      id: 2,
      title: 'Athletic Competition',
      url: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=800&h=600&fit=crop'
    },
    {
      id: 3,
      title: 'Stadium Event',
      url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop'
    },
    {
      id: 4,
      title: 'Awards Ceremony',
      url: 'https://images.unsplash.com/photo-1540575467063-178f50902556?w=800&h=600&fit=crop'
    },
    {
      id: 5,
      title: 'Team Competition',
      url: 'https://images.unsplash.com/photo-1516396895544-f3ac5c5a3b67?w=800&h=600&fit=crop'
    },
    {
      id: 6,
      title: 'Victory Celebration',
      url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop'
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
        const foundEvent = data.find(e => e.id === 'sports-management');
        
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
            <p className='text-secondary text-xl font-semibold mb-2'>⚽ SPORTS MANAGEMENT</p>
            <h1 className='text-5xl md:text-6xl font-bold mb-4'>{event.title}</h1>
            <p className='text-gray-100 text-lg'>Professional Sports Tournament Organization in Bangladesh</p>
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
          <h2 className='text-4xl font-bold mb-6 text-primary'>Sports Event Management Company in Bangladesh</h2>
          <p className='text-gray-700 leading-relaxed text-lg mb-4'>
            Ananta Events Bangladesh is a Global Sports Management company with major expertise in Event Management & Sports Marketing. We strive for ethics and fairness in everything we do. Sports is our passion and joy, and that passion is the fuel that inspires us to realize extraordinary results.
          </p>
          <p className='text-gray-700 leading-relaxed text-lg mb-4'>
            Today, professional sports management companies are growing across the country, especially in leading cities like Dhaka and Chittagong Bangladesh. We specialize in sports management and planning, supervising and organizing various sporting activities including international and domestic tournaments for cricket, football, hockey, golf, and several other games.
          </p>
          <p className='text-gray-700 leading-relaxed text-lg'>
            We understand that sport is a unique way for any brand to establish a share in the heart and mind of consumers. Superior quality is the foundation of our organization, and we have been working with sponsors, teams, and sports federations for over a decade.
          </p>
        </div>

        {/* Image Gallery with Swiper */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold mb-8 text-primary'>Our Sports Events Gallery</h2>
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

        {/* Brand Awareness Section */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold text-primary mb-8'>Brand Awareness - Sport as a Strategic Platform</h2>
          <div className='bg-white p-8 rounded-lg border-l-4 border-primary shadow-md mb-8'>
            <p className='text-gray-700 leading-relaxed text-lg mb-4'>
              We have partnered with sponsors across a wide range of different sports and locations. We work as hospitality providers for main sponsors of any Football or Cricket tournaments. Our comprehensive sponsorship packages include:
            </p>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {[
                'On-site hospitality, logistics & full-service event management',
                'Corporate hospitality programmes: design, implementation & management',
                'Athlete and celebrity appearance coordination',
                'Ticket management',
                'Leisure activity and tour coordination',
                'Enhanced brand awareness through ROI improvement and measurement',
                'Tailored programmes to meet individual needs',
                'Brand image customization for better integration'
              ].map((service, idx) => (
                <div key={idx} className='flex items-start p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg'>
                  <span className='text-primary mr-3 text-xl'>✓</span>
                  <span className='text-gray-700'>{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Training Camps Section */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold text-primary mb-8'>Training Camps & Team Support</h2>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
            {/* Training Support */}
            <div className='bg-white p-8 rounded-lg border-l-4 border-primary shadow-md hover:shadow-lg transition'>
              <h3 className='text-2xl font-bold text-primary mb-4'>🏋️ Professional Training Support</h3>
              <p className='text-gray-700 leading-relaxed mb-4'>
                We offer event and logistics support to teams of all levels - amateur and professional. Ananta Events works with numerous sports centres and tournaments to ensure teams have a wide range of options for pre-season training preparation.
              </p>
              <p className='text-gray-700 leading-relaxed text-sm'>
                Access to world-class sports training installations including facilities for Football, Basketball, Volleyball, Handball, Rugby, Hockey, and more.
              </p>
            </div>

            {/* Assistance Services */}
            <div className='bg-white p-8 rounded-lg border-l-4 border-secondary shadow-md hover:shadow-lg transition'>
              <h3 className='text-2xl font-bold text-secondary mb-4'>🎯 Comprehensive Assistance</h3>
              <p className='text-gray-700 leading-relaxed'>
                Our assistance in helping you get the best out of training includes:
              </p>
              <ul className='text-gray-700 text-sm space-y-2 mt-4'>
                <li>✓ Location consulting services</li>
                <li>✓ Site inspections & selection process</li>
                <li>✓ Accommodation arrangements</li>
                <li>✓ Special dietary & catering needs</li>
                <li>✓ Professional team assistants</li>
                <li>✓ Social programmes & team unwind activities</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Football Team Handling */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold text-primary mb-8'>Football Team Handling - Organizing Away Matches</h2>
          <div className='bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-lg border-l-4 border-primary'>
            <p className='text-gray-700 leading-relaxed text-lg mb-6'>
              Our team of football (soccer) specialists is drawn from several offices in our international network, providing strong cross-border partners. Our goal is to provide each team with the best possible travel conditions and logistics, guaranteeing high service levels across multiple locations. We have managed dozens of Champions League and international matches.
            </p>
            
            <h4 className='text-2xl font-bold text-primary mb-6'>Services for Away Matches:</h4>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {[
                'Site inspections at away fixtures',
                'Match venue verification',
                'Hotel & transfer arrangements',
                'Training facilities assessment',
                'Communication between teams',
                'Smooth & secure arrival preparation',
                'Supplier coordination',
                'Menu & dining preparations',
                'Bedroom allocation & check-in',
                'Massage & kit room setup',
                'Meeting room technical setup',
                'VIP & sponsor accommodations',
                'Fan social programmes',
                'On-site project management',
                'Last-minute request handling'
              ].map((service, idx) => (
                <div key={idx} className='flex items-center p-3 bg-white rounded-lg'>
                  <span className='text-primary mr-2 font-bold'>●</span>
                  <span className='text-gray-700'>{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sports Types */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold mb-8 text-primary'>Sports We Manage</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {[
              'Cricket',
              'Football/Soccer',
              'Badminton',
              'Tennis',
              'Basketball',
              'Volleyball',
              'Swimming',
              'Athletics',
              'Chess',
              'Kabaddi',
              'Hockey',
              'Golf'
            ].map((sport, idx) => (
              <div 
                key={idx} 
                className='bg-gradient-to-br from-primary/5 to-secondary/5 p-4 rounded-lg border-l-2 border-primary hover:shadow-lg transition text-center'
              >
                <p className='text-primary font-semibold'>⚽ {sport}</p>
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

        {/* Sports Event Services Expertise */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold text-primary mb-8'>Sports Events Services Expertise</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {[
              'Sports Event Strategic Planning',
              'Sports Marketing',
              'Advertising of Sports Events',
              'Public & Media Relations',
              'Sports Events Ticket Sales',
              'Corporate & Onsite Merchandise',
              'Sports Events Sponsor Relations',
              'Hospitality Consulting',
              'Sports Events Operations',
              'Event Financial Planning',
              'Event Accounting',
              'Volunteer Coordination',
              'Creative Services',
              'Technology Solutions',
              'Website Development',
              'Broadcasting & Live Streaming'
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

        {/* Why Choose Us Section */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold text-primary mb-8'>Why Choose Our Services</h2>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Global Experience */}
            <div className='bg-white p-8 rounded-lg border-l-4 border-primary shadow-md hover:shadow-lg transition'>
              <h3 className='text-2xl font-bold text-primary mb-4'>🌍 Global Experience</h3>
              <p className='text-gray-700 leading-relaxed'>
                We are a global sports management company with international expertise. Our network spans multiple countries, allowing us to coordinate events and tournaments on a world-class scale.
              </p>
            </div>

            {/* Decade of Experience */}
            <div className='bg-white p-8 rounded-lg border-l-4 border-secondary shadow-md hover:shadow-lg transition'>
              <h3 className='text-2xl font-bold text-secondary mb-4'>⏰ Decade of Partnership</h3>
              <p className='text-gray-700 leading-relaxed'>
                We have been working with sponsors, teams, and sports federations for over a decade. Our proven track record demonstrates our commitment to excellence and reliable service delivery.
              </p>
            </div>

            {/* Ethical Approach */}
            <div className='bg-white p-8 rounded-lg border-l-4 border-primary shadow-md hover:shadow-lg transition'>
              <h3 className='text-2xl font-bold text-primary mb-4'>🤝 Ethics & Fairness</h3>
              <p className='text-gray-700 leading-relaxed'>
                We strive for ethics and fairness in everything we do. Our foundation is built on integrity, transparency, and fair play across all sporting events and partnerships.
              </p>
            </div>

            {/* Passion & Quality */}
            <div className='bg-white p-8 rounded-lg border-l-4 border-secondary shadow-md hover:shadow-lg transition'>
              <h3 className='text-2xl font-bold text-secondary mb-4'>💪 Passion & Quality</h3>
              <p className='text-gray-700 leading-relaxed'>
                Sports is our passion and joy. Superior quality is the foundation of our organization. This passion fuels us to realize extraordinary results for every event we manage.
              </p>
            </div>
          </div>
        </div>

        

        

        {/* CTA Section */}
        <div className='text-center mb-16 bg-gradient-to-r from-primary/5 to-secondary/5 p-12 rounded-lg border border-primary/30'>
          <h3 className='text-4xl font-bold mb-4 text-primary'>Organize Your Sports Event</h3>
          <p className='text-gray-700 text-lg mb-8 max-w-2xl mx-auto'>Let Ananta Events create a memorable sports tournament experience with professional management, ethical practices, and world-class service</p>
          <button className='bg-primary text-white px-10 py-4 rounded-lg font-bold hover:opacity-90 transition text-lg shadow-lg'>
            Contact Us Today
          </button>
        </div>
      </div>

     
    </div>
  );
};

export default SportsManagementDetail;