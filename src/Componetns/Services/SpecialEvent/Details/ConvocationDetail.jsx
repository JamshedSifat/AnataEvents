import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';

const ConvocationDetail = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await fetch('/public/Services/SpecialEvent.json');
        
        if (!response.ok) {
          throw new Error('ডেটা লোড করতে ব্যর্থ');
        }
        
        const data = await response.json();
        const foundEvent = data.find(e => e.id === 'convocation-event');
        
        if (!foundEvent) {
          throw new Error('ইভেন্ট পাওয়া যায়নি');
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
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-xl text-gray-600'>লোডিং হচ্ছে...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-gray-800 mb-4'>⚠️ {error || 'ইভেন্ট পাওয়া যায়নি'}</h1>
          <Link to='/special-events' className='text-blue-600 font-semibold hover:text-blue-700'>
            ← ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white'>
      {/* হেডার */}
      <div className='bg-gradient-to-r from-blue-500 to-blue-700 text-white py-12 px-4'>
        <div className='max-w-5xl mx-auto'>
          <h1 className='text-4xl md:text-5xl font-bold mb-2'>{event.title}</h1>
          <p className='text-blue-100 text-lg'>শিক্ষা প্রতিষ্ঠানের মর্যাদাপূর্ণ অনুষ্ঠান</p>
        </div>
      </div>

      {/* মূল কন্টেন্ট */}
      <div className='max-w-5xl mx-auto px-4 py-16'>
        {/* ইমেজ */}
        <img 
          src={event.image} 
          alt={event.title}
          className='w-full h-96 object-cover rounded-lg mb-12'
        />

        {/* স্ট্যাটস */}
        <div className='grid grid-cols-3 gap-4 mb-16'>
          {event.stats.map((stat, idx) => (
            <div key={idx} className='bg-blue-50 p-6 rounded-lg text-center border-l-4 border-blue-600'>
              <p className='text-3xl md:text-4xl font-bold text-blue-600 mb-2'>{stat.number}</p>
              <p className='text-gray-600 text-sm'>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* বিবরণ */}
        <div className='bg-blue-50 p-8 rounded-lg mb-12'>
          <h2 className='text-3xl font-bold text-blue-700 mb-4'>কনভোকেশন অনুষ্ঠানের পরিকল্পনা</h2>
          <p className='text-gray-700 leading-relaxed text-lg'>
            {event.details}
          </p>
        </div>

        {/* স্টেপ বাই স্টেপ */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold text-gray-800 mb-8'>আমরা কীভাবে কাজ করি</h2>
          <div className='space-y-6'>
            {[
              { step: '01', title: 'পরিকল্পনা', desc: 'আপনার প্রয়োজন অনুযায়ী বিস্তারিত পরিকল্পনা' },
              { step: '02', title: 'প্রস্তুতি', desc: 'সব ধরনের প্রস্তুতি ও সমন্বয় কাজ' },
              { step: '03', title: 'বাস্তবায়ন', desc: 'নিখুঁত বাস্তবায়ন ও তত্ত্বাবধান' },
              { step: '04', title: 'মূল্যায়ন', desc: 'পরবর্তী সফলতার জন্য মূল্যায়ন' }
            ].map((item, idx) => (
              <div key={idx} className='flex gap-6 items-start'>
                <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full flex items-center justify-center font-bold text-2xl flex-shrink-0'>
                  {item.step}
                </div>
                <div>
                  <h3 className='text-xl font-bold text-gray-800 mb-2'>{item.title}</h3>
                  <p className='text-gray-600'>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* সেবাসমূহ */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-16'>
          <div>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>মূল সেবা</h2>
            <div className='space-y-3'>
              {event.services.slice(0, 4).map((service, idx) => (
                <div key={idx} className='flex items-center p-3 bg-blue-50 rounded-lg'>
                  <span className='text-blue-600 font-bold mr-3 text-lg'>●</span>
                  <span className='text-gray-700'>{service}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>অতিরিক্ত সেবা</h2>
            <div className='space-y-3'>
              {event.services.slice(4).map((service, idx) => (
                <div key={idx} className='flex items-center p-3 bg-blue-50 rounded-lg'>
                  <span className='text-blue-600 font-bold mr-3 text-lg'>●</span>
                  <span className='text-gray-700'>{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className='bg-gradient-to-r from-blue-500 to-blue-700 text-white p-8 rounded-lg text-center mb-12'>
          <h3 className='text-2xl font-bold mb-4'>আপনার কনভোকেশনের জন্য আমাদের সাথে যোগাযোগ করুন</h3>
          <p className='mb-6'>পেশাদার পরিকল্পনা এবং বাস্তবায়নের জন্য</p>
          <button className='bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition'>
            এখনই যোগাযোগ করুন
          </button>
        </div>
      </div>

      {/* ফুটার */}
      <div className='bg-gray-100 py-8 px-4'>
        <div className='max-w-5xl mx-auto text-center'>
          <Link to='/special-events' className='inline-block text-blue-600 font-semibold hover:text-blue-700'>
            ← সকল ইভেন্টে ফিরুন
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConvocationDetail;