import React from 'react';

const SeoHeader = () => {
    return (
        <div>
             {/* SEO Header Section */}
        <div className="mb-16 rounded-2xl bg-base-200 p-8">
          <h2 className="text-3xl font-bold text-secondary mb-4">
            Influencer Marketing Agency in Bangladesh
          </h2>
          <p className="text-neutral leading-relaxed mb-4">
            Ananta Events & Entertainment is one of the <span className="font-semibold text-primary">best Influencer Marketing Agency in Bangladesh</span>. Our <span className="font-semibold">Influencer Management Agency Service</span> specializes in organizing and delegating influencers across all media platforms. We provide on-time support, strategic talent management, and manage social media pages with trained influencers who help your brand reach millions of people. Our team excels in <span className="font-semibold">digital marketing</span> and market research to provide strategies best-suited to your business model.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="rounded-xl bg-white p-4 text-center">
              <p className="text-3xl font-bold text-primary">100+</p>
              <p className="text-sm text-neutral font-semibold mt-2">Successful Campaigns</p>
            </div>
            <div className="rounded-xl bg-white p-4 text-center">
              <p className="text-3xl font-bold text-primary">5000+</p>
              <p className="text-sm text-neutral font-semibold mt-2">Verified Influencers</p>
            </div>
            <div className="rounded-xl bg-white p-4 text-center">
              <p className="text-3xl font-bold text-primary">15+</p>
              <p className="text-sm text-neutral font-semibold mt-2">Years Experience</p>
            </div>
            <div className="rounded-xl bg-white p-4 text-center">
              <p className="text-3xl font-bold text-primary">100%</p>
              <p className="text-sm text-neutral font-semibold mt-2">Client Satisfaction</p>
            </div>
          </div>
        </div>
        </div>
    );
};

export default SeoHeader;