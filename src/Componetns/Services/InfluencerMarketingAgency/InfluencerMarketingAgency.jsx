import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import InfluencerFAQ from "./InfluencerFAQ/InfluencerFAQ";
import InfluencerList from "./InfluencerList/InfluencerList";
import SeoHeader from "./SeoHeader/SeoHeader";
import WhatsDigitalMarketing from "./WhatsDigitalMarketing/WhatsDigitalMarketing";
import WhyNeedInfuencer from "./WhyNeedInfuencer/WhyNeedInfuencer";
import MarketingVedio from "./MarketingVedio/MarketingVedio";
import CampaignProcess from "./CampaignProcess/CampaignProcess";
import SocialMediaMarketing from "./SocialMediaMarketing/SocialMediaMarketing";

const InfluencerMarketingAgency = () => {
  const [activeTab, setActiveTab] = useState(0);



 

  const choosingTips = [
    "Is the influencer creating content that is applicable to your business?",
    "Do the influencers engage with their following?",
    "Is their content consistent or are they always changing to stay relevant?",
    "How often is their content shared?",
    "Is the influencer someone you would like your brand to be affiliated with?",
  ];

  const caseStudies = [
    {
      brand: "Fashion Retail Brand",
      result: "350% Engagement Growth",
      description: "Partnered with 12 fashion influencers for seasonal campaign",
      stats: "2.5M Impressions | 125K Engagements",
    },
    {
      brand: "Tech Startup",
      result: "45% Conversion Rate",
      description: "Tech reviewers showcased product features authentically",
      stats: "850K Impressions | 38K Clicks",
    },
    {
      brand: "E-commerce Platform",
      result: "280% ROI",
      description: "Micro-influencer strategy for targeted traffic",
      stats: "1.2M Impressions | 95K Sales",
    },
  ];

  

  return (
    <section className="bg-base-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 md:py-16">
        
        {/* Hero Section */}
        <div className="mb-16 rounded-3xl bg-gradient-to-r from-primary via-secondary to-primary p-1">
          <div className="rounded-3xl bg-base-100 p-8 md:p-12">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div>
                <span className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-4">
                  INFLUENCER MARKETING AGENCY
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-secondary leading-tight">
                  Connect Your Brand with <span className="text-primary">Authentic Influencers</span>
                </h1>
                <p className="mt-6 text-lg text-neutral">
                  Build trust, reach your target audience, and drive conversions through strategic influencer partnerships. Ananta Events & Entertainment - Bangladesh's leading influencer marketing agency.
                </p>
                <div className="mt-8 flex gap-4">
                  <button className="rounded-lg bg-primary px-8 py-3 font-semibold text-white transition-all hover:shadow-lg hover:scale-105">
                    Start Your Campaign
                  </button>
                  <button className="rounded-lg border-2 border-primary px-8 py-3 font-semibold text-primary transition-all hover:bg-primary/10">
                    View Our Work
                  </button>
                </div>
              </div>
              <div className="hidden md:block overflow-hidden rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80"
                  alt="Influencer Marketing"
                  className="h-96 w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Seo header */}
       <SeoHeader></SeoHeader>

        {/* What is Digital Marketing */}
       <WhatsDigitalMarketing></WhatsDigitalMarketing>

        {/* Why Influencer Section */}
        <WhyNeedInfuencer></WhyNeedInfuencer>

        {/* Social Media Influencers */}
        <SocialMediaMarketing></SocialMediaMarketing>

        {/* Campaign Process */}
        <CampaignProcess></CampaignProcess>


        {/* Video Section */}
        <MarketingVedio></MarketingVedio>

        {/* Influencers List - Carousel with Images */}
        <InfluencerList></InfluencerList>

      </div>
        {/* FAQ quesstion */}
        <InfluencerFAQ></InfluencerFAQ>
    </section>
  );
};

export default InfluencerMarketingAgency;