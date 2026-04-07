import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';

const FashionShowDetail = () => {
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
        const foundEvent = data.find(e => e.id === 'fashion-show');
        
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
          <Link to='/special-events' className='text-gray-800 font-semibold hover:text-black'>
            ← ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white'>
      {/* হেরো ইমেজ */}
      <div className='relative h-96 md:h-[500px] overflow-hidden'>
        <img 
          src={event.image} 
          alt={event.title}
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black to-transparent'></div>
        <div className='absolute bottom-0 left-0 right-0 text-white p-8'>
          <h1 className='text-4xl md:text-5xl font-bold'>{event.title}</h1>
        </div>
      </div>

      {/* মূল কন্টেন্ট */}
      <div className='max-w-5xl mx-auto px-4 py-16'>
        {/* স্ট্যাটস */}
        <div className='grid grid-cols-3 gap-4 mb-16'>
          {event.stats.map((stat, idx) => (
            <div key={idx} className='bg-black text-white p-6 rounded-lg text-center'>
              <p className='text-3xl font-bold mb-2'>{stat.number}</p>
              <p className='text-gray-300 text-sm'>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* বিবরণ */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-16'>
          <div>
            <h2 className='text-3xl font-bold text-gray-800 mb-4'>আমাদের সেবা</h2>
            <p className='text-gray-700 leading-relaxed mb-6'>
              {event.details}
            </p>
          </div>
          <div className='bg-gray-100 p-8 rounded-lg'>
            <h3 className='text-2xl font-bold text-gray-800 mb-6'>ফ্যাশন শো প্যাকেজ</h3>
            <ul className='space-y-4'>
              {event.services.slice(0, 4).map((service, idx) => (
                <li key={idx} className='flex items-start'>
                  <span className='text-2xl mr-3'>•</span>
                  <span className='text-gray-700'>{service}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* সেবা গ্রিড */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold text-gray-800 mb-8'>আমাদের সম্পূর্ণ সেবা প্যাকেজ</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {event.services.map((service, idx) => (
              <div key={idx} className='border-2 border-gray-300 p-6 rounded-lg hover:border-black hover:shadow-lg transition'>
                <h3 className='text-xl font-bold text-gray-800 mb-2'>{service}</h3>
                <p className='text-gray-600 text-sm'>পেশাদার মানের সেবা নিশ্চিত করা হয়</p>
              </div>
            ))}
          </div>
        </div>

        {/* পোর্টফোলিও */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold text-gray-800 mb-8'>আমাদের সাফল্যের গল্প</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className='bg-gray-200 h-64 rounded-lg flex items-center justify-center'>
                <p className='text-gray-600'>ফ্যাশন শো {item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className='bg-black text-white p-12 rounded-lg text-center'>
          <h3 className='text-3xl font-bold mb-4'>আপনার ফ্যাশন শো বাস্তবায়ন করুন</h3>
          <p className='mb-6 text-gray-300 text-lg'>আমাদের সাথে থাকুন রানওয়েতে সেরা অভিজ্ঞতার জন্য</p>
          <button className='bg-white text-black px-10 py-3 rounded-lg font-bold hover:bg-gray-200 transition text-lg'>
            বুকিং করুন
          </button>
        </div>
      </div>

      {/* ফুটার */}
      <div className='bg-gray-100 py-8 px-4 mt-16'>
        <div className='max-w-5xl mx-auto text-center'>
          <Link to='/special-events' className='inline-block text-gray-800 font-semibold hover:text-black'>
            ← সকল ইভেন্টে ফিরুন
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FashionShowDetail;