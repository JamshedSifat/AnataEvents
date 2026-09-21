import React from 'react';

const WhatsDigitalMarketing = () => {
    return (
        <div>
             <div className="mb-16 grid items-center gap-8 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl">
            <img
              src="https://i.pinimg.com/1200x/f8/45/52/f84552a8a27200320230b3fb86793ae8.jpg"
              alt="Digital Marketing"
              className="h-96 w-full object-center"
              loading="lazy"
            />
          </div>
          <div>
            <span className="inline-block rounded-full bg-primary px-4 py-2 text-sm text-white font-semibold text-accent mb-4">
              DIGITAL MARKETING
            </span>
            <h2 className="text-3xl font-bold text-secondary mb-4">What is Digital Marketing?</h2>
            <p className="text-neutral mb-4 leading-relaxed">
              <span className="font-semibold">Digital Marketing</span> refers to any marketing conducted via technology - on phones, computers, tablets, etc. It encompasses multiple strategies including <span className="font-semibold">Content Marketing</span>, <span className="font-semibold">Pay-per-click Marketing</span>, <span className="font-semibold">Affiliate Marketing</span>, and <span className="font-semibold">Social Media Marketing</span>.
            </p>
            <p className="text-neutral mb-4 leading-relaxed">
              <span className="font-semibold text-primary">Social Media Marketing</span> is one of the most rewarding yet challenging types of digital marketing. To make your social media strategy thrive and reach the right audience, the simplest approach is to <span className="font-semibold">hire a Social Media Influencer</span> who already has your target demographic's trust and attention.
            </p>
            <div className="flex gap-4 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-sm font-semibold">Real-time Engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-sm font-semibold">Measurable Results</span>
              </div>
            </div>
          </div>
        </div>
        </div>
    );
};

export default WhatsDigitalMarketing;