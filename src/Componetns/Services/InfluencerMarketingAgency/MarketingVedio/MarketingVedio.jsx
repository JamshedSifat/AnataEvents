import React from 'react';

const MarketingVedio = () => {
    return (
        <div>
            <div className="mb-16">
              <div className="text-center mb-8">
                <span className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-4">
                  LEARN & GROW
                </span>
                <h2 className="text-3xl font-bold text-secondary mb-3">How to Execute Influencer Marketing</h2>
                <p className="text-neutral max-w-2xl mx-auto">Master the complete strategy to scale your business through influencer partnerships</p>
              </div>
              
              <div className="rounded-2xl overflow-hidden border-2 border-base-300 shadow-xl">
                <div className="relative w-full aspect-video bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/zEgOI1rNlyc?si=WS5X0PEFe5_HZ14H"
                    title="Influencer Marketing Guide"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </div>
            </div>
        </div>
    );
};

export default MarketingVedio;