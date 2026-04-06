import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const InfluencerMarketingAgency = () => {
  const [activeTab, setActiveTab] = useState(0);
   const [openIndex, setOpenIndex] = useState(null);
  
    const toggleFAQ = (index) => {
      setOpenIndex(openIndex === index ? null : index);
    };

const faqData = [
  {
    question: "How to choose the right social Influencer for your brand?",
    answer: "To choose the right influencer for your business in Bangladesh, you need to verify a few things Is the influencer creating content that is applicable to your business Do the influencers engage with their following?Is their content consistent or are they always changing to stay relevant?How often is their content shared?Is the influencer someone you would like your brand to be affiliated with?An influencer must be chosen after answering all these questions. Influencers in marketing tend to create lifestyle content. As such, it is best to choose someone who may already use your product or might benefit from it. Other Influencer create specific content and can create content directly promoting a brand or good. For such influencers it is essential that a brand is honest and forthcoming about their products. It must also be ensured that the Influencer does not have any scandals. Any scandal can reflect badly on the brand. Finally, it is crucial that the brand and influencer share the same social message. This ensures a long and successful relationship."
  },
  {
    question: "What is a social media influencer?",
    answer: "Social media Influencer or social influencer is a term we hear every day, but who are they? The answer: Social Influencers are individuals who possess a massive social media following. Their followings can be anywhere between 50,000 to 500,000 people. Such Influencers are divided into two groups; Micro Influencers, who have around 50,000 followers and Macro Influencers, Influencers whose follower count ranges from 100,000 to over 1 million. These individuals tend to create content based around their own lives. This attracts an audience that relate with the influencer on a personal level. Influencers tend to have a lot of respect within their communities. As such, their followers put a lot of weight on their opinions. These followers tend to receive any endorsement the influencer does as genuine advice."
  },
  {
    question: "Why choose us to find your right Influencers for your Brand ?",
    answer: "Our exceptional team at Ananta Events & Entertainment provide support according to our customers’ needs. Our influencer Marketing Agency is the top pioneering influencer agency in Dhaka Bangladesh. We are both a Micro Influencers Agency and a Top Macro Influencers Agency. Our team is connected to many Influencer marketing Companies. Furthermore, our Instagram Influencer Agency connects you to the top micro and macro Instagram influencers. Additionally, our YouTube Influencer Agency can connect you to any YouTuber of Bangladesh. Ananta Events & Entertainment are here to help in any shape and form."
  },
  
];

 const influencersList = [
  {
    name: "Nodi Chowdhury",
    category: "Fashion",
    followers: "250K",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=60",
    description: "Fashion influencer with trending styles",
    engagement: "4.2%",
    posts: "14"
  },
  {
    name: "Farida Tasnim",
    category: "Lifestyle",
    followers: "180K",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=60",
    description: "Lifestyle content creator",
    engagement: "3.8%",
    posts: "12"
  },
  {
    name: "Tanzim",
    category: "Tech",
    followers: "320K",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c006ae3f?auto=format&fit=crop&w=500&q=60",
    description: "Tech reviewer and innovator",
    engagement: "5.1%",
    posts: "15"
  },
  {
    name: "Salman Muqtadir",
    category: "Tech",
    followers: "410K",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=60",
    description: "Tech expert and analyst",
    engagement: "4.9%",
    posts: "16"
  },
  {
    name: "Bengali Boin",
    category: "Comedy",
    followers: "520K",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=60",
    description: "Comedy and entertainment creator",
    engagement: "6.2%",
    posts: "18"
  },
  {
    name: "Hamza Inka Shawon",
    category: "Lifestyle",
    followers: "275K",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=60",
    description: "Lifestyle and travel content",
    engagement: "4.1%",
    posts: "13"
  },
  {
    name: "Iftekhar Rafhan",
    category: "Tech",
    followers: "385K",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69be79?auto=format&fit=crop&w=500&q=60",
    description: "Tech innovations and reviews",
    engagement: "5.3%",
    posts: "17"
  },
  {
    name: "Saba Chowdhury",
    category: "Fashion",
    followers: "195K",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=500&q=60",
    description: "Fashion and style influencer",
    engagement: "3.9%",
    posts: "11"
  },
  {
    name: "Mehzabeen Ahmad",
    category: "Lifestyle",
    followers: "420K",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=60",
    description: "Lifestyle expert",
    engagement: "5.0%",
    posts: "14"
  },
  {
    name: "Zohra",
    category: "Fashion",
    followers: "165K",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=60",
    description: "Fashion and beauty creator",
    engagement: "3.7%",
    posts: "10"
  },
  {
    name: "SADIYA & RUCHITA",
    category: "Lifestyle",
    followers: "550K",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=500&q=60",
    description: "Lifestyle duo with unique content",
    engagement: "5.8%",
    posts: "16"
  },
  {
    name: "Sabla Adrss",
    category: "Fashion",
    followers: "290K",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=60",
    description: "Fashion and styling expert",
    engagement: "4.3%",
    posts: "13"
  },
  {
    name: "Alfana Khan Tura",
    category: "Beauty",
    followers: "210K",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=60",
    description: "Beauty and makeup influencer",
    engagement: "4.0%",
    posts: "12"
  },
  {
    name: "Ishrat Zahan Ahmad",
    category: "Lifestyle",
    followers: "340K",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c006ae3f?auto=format&fit=crop&w=500&q=60",
    description: "Lifestyle and wellness content",
    engagement: "4.6%",
    posts: "15"
  },
];

  const benefits = [
    { num: "1", title: "Increase Brand Awareness", icon: "📢" },
    { num: "2", title: "Win-win Partnerships", icon: "🤝" },
    { num: "3", title: "Cost-effective & Saves Time", icon: "⏱️" },
    { num: "4", title: "Build Credibility and Trust", icon: "✓" },
    { num: "5", title: "Boost SEO & ROI", icon: "📈" },
    { num: "6", title: "Drive Purchases Decisions", icon: "🛒" },
    { num: "7", title: "Enrich Content Strategy", icon: "✍️" },
    { num: "8", title: "Suitable For Any Business", icon: "🎯" },
    { num: "9", title: "Sharing Potential", icon: "📱" },
    { num: "10", title: "Increase Sales", icon: "💰" },
  ];

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

  const process = [
    {
      step: "1",
      title: "Brand Discovery",
      description: "We analyze your brand values, target audience, and campaign objectives",
    },
    {
      step: "2",
      title: "Influencer Curation",
      description: "Identify and vet influencers that align with your brand DNA",
    },
    {
      step: "3",
      title: "Strategy Development",
      description: "Create a customized campaign strategy with clear KPIs",
    },
    {
      step: "4",
      title: "Campaign Execution",
      description: "Manage all negotiations, content creation, and posting",
    },
    {
      step: "5",
      title: "Performance Analytics",
      description: "Deliver detailed reports with engagement and conversion metrics",
    },
    {
      step: "6",
      title: "Optimization",
      description: "Continuously refine strategy based on real-time performance data",
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

        {/* What is Digital Marketing */}
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

        {/* Why Influencer Section */}
        <div className="mb-16 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 p-8 md:p-12 border border-primary/20">
          <h2 className="text-3xl font-bold text-secondary mb-2">Why Do You Need an <span className="text-primary">Influencer?</span></h2>
          <h4 className="text-xl mb-2 text-neutral">Benefits of Influencer Marketing Bangladesh</h4>
          <p className="text-neutral mb-8">A social media Influencer can directly connect a brand to their targeted audience. Furthermore, Influencer marketing adds a personal touch to a brands marketing. Such an addition is beneficial as it allows to create brand loyalty. The Influencers also benefit as a good brand can boost their image and help them better communicate.</p>
          
          {/* Benefits Grid */}
          <div className="grid gap-3 md:grid-cols-5">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-5 text-center transition-all hover:shadow-lg ${
                  idx < 9
                    ? "bg-white border-2 border-primary/20 hover:border-primary"
                    : "bg-gradient-to-br from-primary to-secondary text-white border-2 border-primary"
                }`}
              >
                <div className="text-4xl mb-3">{benefit.icon}</div>
                <p className="font-semibold text-sm leading-tight">{benefit.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media Influencers */}
        <div className="mb-16 rounded-2xl bg-base-200 p-8 md:p-12">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white mb-4 ">
              SOCIAL MEDIA MARKETING
            </span>
            <h2 className="text-3xl font-bold text-secondary mb-4">Social Media Influencers Marketing</h2>
            <p className="text-neutral leading-relaxed mb-4">
              Influencers on social media hold tremendous power in the digital marketing ecosystem. In recent years, social media has become an indispensable platform for marketing that cannot be ignored. To capitalize on this trend in the digital landscape, you need strategic direction. The best solution is to <span className="font-semibold">hire a social media influencer</span> who can focus and direct your products to your targeted consumers.
            </p>
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div className="rounded-xl bg-white p-6 border-l-4 border-primary">
                <h3 className="font-bold text-secondary mb-2">Authentic Engagement</h3>
                <p className="text-sm text-neutral">Influencers create genuine connections with audiences through trusted personalities and authentic content.</p>
              </div>
              <div className="rounded-xl bg-white p-6 border-l-4 border-accent">
                <h3 className="font-bold text-secondary mb-2">Targeted Reach</h3>
                <p className="text-sm text-neutral">Access highly specific audience segments aligned with your brand values and business objectives.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Process */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <span className="inline-block rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent mb-4">
              OUR PROCESS
            </span>
            <h2 className="text-3xl font-bold text-secondary mb-3">Six-Step Campaign Strategy</h2>
            <p className="text-neutral max-w-2xl mx-auto">From discovery to optimization, we manage every aspect of your influencer marketing campaign</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {process.map((p, idx) => (
              <div key={idx} className="group rounded-2xl bg-white border-2 border-base-300 p-6 hover:border-primary transition-all hover:shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-bold text-lg group-hover:scale-110 transition-transform">
                  {p.step}
                </div>
                <h3 className="text-lg font-bold text-secondary mb-2">{p.title}</h3>
                <p className="text-sm text-neutral">{p.description}</p>
              </div>
            ))}
          </div>
        </div>


{/* Video Section */}
<div className="mb-16">
  <h2 className="text-3xl font-bold text-secondary mb-8">How to Execute Influencer Marketing</h2>
  
  <div className="rounded-2xl overflow-hidden border-2 border-base-300 shadow-xl">
    <div className="relative w-full aspect-video bg-black">
      <iframe
        width="100%"
        height="100%"
        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        title="Influencer Marketing Guide"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
    </div>
  </div>
</div>
   {/* Influencers List - Carousel with Images */}
<div className="mb-16">
  <div className="mb-8">
    <span className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-4">
      OUR NETWORK
    </span>
    <h2 className="text-3xl font-bold text-secondary mb-2">Featured Influencers</h2>
    <p className="text-neutral">Handpicked creators driving real results for brands</p>
  </div>

  <Swiper
    modules={[Navigation, Pagination, Autoplay]}
    navigation
    pagination={{ clickable: true }}
    autoplay={{ delay: 5000 }}
    slidesPerView={1}
    breakpoints={{
      640: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
      1280: { slidesPerView: 4 },
    }}
    className="rounded-2xl overflow-hidden"
  >
    {influencersList.map((inf, idx) => (
      <SwiperSlide key={idx}>
        <div className="rounded-2xl bg-white border-2 border-base-300 m-2 overflow-hidden hover:border-primary transition-all hover:shadow-xl group">
          
          {/* Image Section */}
          <div className="relative h-48 w-full overflow-hidden bg-base-300">
            <img
              src={inf.image}
              alt={inf.name}
              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
            />
            {/* Category Badge Overlay */}
            <div className="absolute top-3 right-3">
              <span className="inline-block rounded-full bg-primary/90 px-3 py-1 text-xs font-bold text-white">
                {inf.category}
              </span>
            </div>
            {/* Followers Badge */}
            <div className="absolute bottom-3 left-3 rounded-lg bg-white/95 px-3 py-2 backdrop-blur-sm">
              <p className="text-xs text-neutral">Followers</p>
              <p className="font-bold text-secondary">{inf.followers}</p>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            <h3 className="font-bold text-secondary text-lg mb-1">{inf.name}</h3>
            <p className="text-xs text-neutral mb-4 leading-relaxed">
              {inf.description || "Verified influencer with high engagement rates and authentic audience connection"}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 pb-4 mb-4 border-b border-base-300">
              <div>
                <p className="text-xs text-neutral">Engagement</p>
                <p className="font-bold text-primary text-sm">{inf.engagement || "3.5-5.8%"}</p>
              </div>
              <div>
                <p className="text-xs text-neutral">Posts/Month</p>
                <p className="font-bold text-secondary text-sm">{inf.posts || "12-15"}</p>
              </div>
            </div>

            {/* CTA Button */}
            <button className="w-full rounded-lg bg-primary/10 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-all">
              View Profile →
            </button>
          </div>
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
</div>

       
      </div>
      {/* FAQ quesstion */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
          Frequently Asked <span className="text-primary">Questions</span>
        </h2>

        <div className="space-y-5">
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl overflow-hidden transition-all duration-500 shadow-md 
                  ${isOpen ? "bg-primary text-white shadow-xl" : "bg-white text-gray-800 hover:shadow-xl"}`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left focus:outline-none group"
                >
                  <span
                    className={`font-semibold text-lg transition-colors duration-300 ${
                      isOpen ? "text-white" : "text-gray-800 group-hover:text-primary"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <span
                    className={`transform transition-transform duration-300 text-2xl ${
                      isOpen ? "text-white" : "text-primary"
                    }`}
                    style={{ rotate: isOpen ? "45deg" : "0deg" }}
                  >
                    +
                  </span>
                </button>

                <div
                  className="px-6 leading-relaxed overflow-hidden transition-all duration-500"
                  style={{
                    maxHeight: isOpen ? "500px" : "0",
                  }}
                >
                  <p className="py-4">{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
    </section>
  );
};

export default InfluencerMarketingAgency;