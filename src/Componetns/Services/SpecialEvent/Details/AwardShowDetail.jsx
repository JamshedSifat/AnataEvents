import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';

const AwardShowDetail = () => {
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
        const foundEvent = data.find(e => e.id === 'award-show');
        
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
          <Link to='/special-events' className='text-red-600 font-semibold hover:text-red-700'>
            ← ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white'>
      {/* হিরো সেকশন */}
      <div className='relative h-96 md:h-[500px] bg-gradient-to-r from-red-600 to-red-900'>
        <img 
          src={event.image} 
          alt={event.title}
          className='w-full h-full object-cover opacity-60'
        />
        <div className='absolute inset-0 bg-black bg-opacity-40'></div>
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='text-center text-white px-4'>
            <h1 className='text-4xl md:text-5xl font-bold mb-4'>{event.title}</h1>
            <p className='text-xl text-red-100'>গ্ল্যামারাস ইভেন্ট ম্যানেজমেন্ট সেবা</p>
          </div>
        </div>
      </div>

      {/* মূল কন্টেন্ট */}
      <div className='max-w-5xl mx-auto px-4 py-16'>
        {/* স্ট্যাটস */}
        <div className='grid grid-cols-3 gap-4 mb-16'>
          {event.stats.map((stat, idx) => (
            <div key={idx} className='bg-red-50 p-6 rounded-lg text-center'>
              <p className='text-3xl md:text-4xl font-bold text-red-600 mb-2'>{stat.number}</p>
              <p className='text-gray-600 text-sm'>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* বিবরণ */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-16'>
          <div>
            <h2 className='text-3xl font-bold text-red-600 mb-4'>আমাদের বিশেষত্ব</h2>
            <p className='text-gray-700 leading-relaxed mb-4'>
              {event.details}
            </p>
            <ul className='space-y-3'>
              <li className='flex items-start'>
                <span className='text-red-600 font-bold mr-3 text-2xl'>✓</span>
                <span className='text-gray-700'>পেশাদার ইভেন্ট ম্যানেজমেন্ট টিম</span>
              </li>
              <li className='flex items-start'>
                <span className='text-red-600 font-bold mr-3 text-2xl'>✓</span>
                <span className='text-gray-700'>অত্যাধুনিক সরঞ্জাম ও প্রযুক্তি</span>
              </li>
              <li className='flex items-start'>
                <span className='text-red-600 font-bold mr-3 text-2xl'>✓</span>
                <span className='text-gray-700'>সাশ্রয়ী মূল্যে প্রিমিয়াম সেবা</span>
              </li>
            </ul>
          </div>

          {/* পাশের বক্স */}
          <div className='bg-gradient-to-br from-red-50 to-pink-50 p-8 rounded-lg border-l-4 border-red-600'>
            <h3 className='text-2xl font-bold text-red-600 mb-6'>যোগাযোগ করুন</h3>
            <div className='space-y-4'>
              <div>
                <p className='text-gray-600 text-sm'>ফোন</p>
                <p className='text-lg font-semibold text-gray-800'>+880 1234567890</p>
              </div>
              <div>
                <p className='text-gray-600 text-sm'>ইমেইল</p>
                <p className='text-lg font-semibold text-gray-800'>info@ananta.com</p>
              </div>
              <div>
                <p className='text-gray-600 text-sm'>ঠিকানা</p>
                <p className='text-lg font-semibold text-gray-800'>ঢাকা, বাংলাদেশ</p>
              </div>
              <button className='w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition mt-4'>
                আজই বুক করুন
              </button>
            </div>
          </div>
        </div>

        {/* সেবাসমূহ */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold text-gray-800 mb-8'>আমাদের সেবাসমূহ</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {event.services.map((service, idx) => (
              <div 
                key={idx} 
                className='bg-white border-2 border-red-200 p-4 rounded-lg hover:border-red-600 hover:shadow-lg transition-all'
              >
                <div className='flex items-center'>
                  <span className='w-3 h-3 bg-red-600 rounded-full mr-3'></span>
                  <p className='font-semibold text-gray-800'>{service}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* প্যাকেজ */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold text-gray-800 mb-8'>আমাদের প্যাকেজ</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {['বাজেট', 'স্ট্যান্ডার্ড', 'প্রিমিয়াম'].map((pkg, idx) => (
              <div key={idx} className={`p-6 rounded-lg border-2 ${idx === 1 ? 'border-red-600 bg-red-50' : 'border-gray-200'}`}>
                <h3 className='text-xl font-bold text-gray-800 mb-4'>{pkg} প্যাকেজ</h3>
                <p className='text-3xl font-bold text-red-600 mb-4'>৳{10000 + idx * 5000}</p>
                <ul className='space-y-2 mb-6'>
                  <li className='text-gray-700'>✓ সম্পূর্ণ ইভেন্ট ম্যানেজমেন্ট</li>
                  <li className='text-gray-700'>✓ ডেকোরেশন এবং লাইটিং</li>
                  <li className='text-gray-700'>✓ ২৪/৭ সাপোর্ট</li>
                </ul>
                <button className={`w-full py-2 rounded-lg font-semibold transition ${idx === 1 ? 'bg-red-600 text-white hover:bg-red-700' : 'border-2 border-red-600 text-red-600 hover:bg-red-50'}`}>
                  নির্বাচন করুন
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ফুটার */}
      <div className='bg-gray-100 py-8 px-4'>
        <div className='max-w-5xl mx-auto text-center'>
          <Link to='/special-events' className='inline-block text-red-600 font-semibold hover:text-red-700'>
            ← সকল ইভেন্টে ফিরুন
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AwardShowDetail;