import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';

const ReunionDetail = () => {
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
        const foundEvent = data.find(e => e.id === 'reunion-event');
        
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
          <Link to='/special-events' className='text-purple-600 font-semibold hover:text-purple-700'>
            ← ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 to-pink-50'>
      {/* হেডার */}
      <div className='bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12 px-4'>
        <div className='max-w-5xl mx-auto'>
          <h1 className='text-4xl md:text-5xl font-bold mb-2'>{event.title}</h1>
          <p className='text-purple-100 text-lg'>পুরানো দিনের স্মৃতি নতুন করে জাগিয়ে তুলুন</p>
        </div>
      </div>

      {/* মূল কন্টেন্ট */}
      <div className='max-w-5xl mx-auto px-4 py-16'>
        {/* ফিচার */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-16'>
          {[
            { icon: '📸', title: 'ফটোগ্রাফি', desc: 'পেশাদার ফটোগ্রাফার এবং ভিডিওগ্রাফি' },
            { icon: '🎨', title: 'থিম ডেকোরেশন', desc: 'নস্টালজিক এবং আধুনিক থিম ডেকোরেশন' },
            { icon: '🎉', title: 'বিনোদন', desc: 'সঙ্গীত, গেমস এবং অন্যান্য বিনোদন' }
          ].map((feature, idx) => (
            <div key={idx} className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center'>
              <p className='text-4xl mb-3'>{feature.icon}</p>
              <h3 className='text-xl font-bold text-gray-800 mb-2'>{feature.title}</h3>
              <p className='text-gray-600'>{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* স্ট্যাটস */}
        <div className='grid grid-cols-3 gap-4 mb-16'>
          {event.stats.map((stat, idx) => (
            <div key={idx} className='bg-white p-6 rounded-lg text-center shadow-md'>
              <p className='text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2'>
                {stat.number}
              </p>
              <p className='text-gray-600 text-sm'>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* বিবরণ সেকশন */}
        <div className='bg-white p-8 rounded-lg shadow-md mb-16'>
          <h2 className='text-3xl font-bold text-gray-800 mb-4'>আমাদের বিশেষত্ব</h2>
          <p className='text-gray-700 leading-relaxed mb-6'>
            {event.details}
          </p>
          <div className='grid grid-cols-2 gap-4'>
            {['স্মৃতি সংগ্রহ', 'লাইভ মিউজিক', 'গেস্ট বুক', 'মেমোরি ওয়াল'].map((item, idx) => (
              <div key={idx} className='flex items-center p-3 bg-purple-50 rounded'>
                <span className='text-purple-600 mr-2 text-xl'>✨</span>
                <span className='text-gray-700'>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* টাইমলাইন */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold text-gray-800 mb-8'>আপনার পুনর্মিলনের দিন</h2>
          <div className='space-y-4'>
            {[
              { time: '10:00 AM', event: 'পঞ্জীকরণ এবং আগমন' },
              { time: '11:00 AM', event: 'স্বাগত অনুষ্ঠান এবং চা' },
              { time: '12:30 PM', event: 'লাঞ্চ এবং নেটওয়ার্কিং' },
              { time: '2:00 PM', event: 'খেলাধুলা এবং প্রতিযোগিতা' },
              { time: '4:00 PM', event: 'সাংস্কৃতিক অনুষ্ঠান' },
              { time: '6:00 PM', event: 'ডিনার এবং সমাপনী' }
            ].map((item, idx) => (
              <div key={idx} className='flex gap-4 items-center'>
                <div className='w-24 font-bold text-purple-600 text-lg'>{item.time}</div>
                <div className='flex-1 bg-white p-4 rounded-lg shadow-sm'>
                  <p className='text-gray-800'>{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className='bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-lg text-center'>
          <h3 className='text-2xl font-bold mb-2'>আপনার পুনর্মিলন পরিকল্পনা করুন</h3>
          <p className='mb-6 text-purple-100'>বিশেষ ছাড় এবং কাস্টমাইজড প্যাকেজ পান</p>
          <button className='bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition'>
            যোগাযোগ করুন
          </button>
        </div>
      </div>

      {/* ফুটার */}
      <div className='bg-white py-8 px-4 mt-16'>
        <div className='max-w-5xl mx-auto text-center'>
          <Link to='/special-events' className='inline-block text-purple-600 font-semibold hover:text-purple-700'>
            ← সকল ইভেন্টে ফিরুন
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReunionDetail;