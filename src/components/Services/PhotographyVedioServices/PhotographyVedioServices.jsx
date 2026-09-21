import React, { useState } from 'react';
import { useNavigate } from 'react-router';

const PhotographyVideoServices = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: 1,
      title: "Conference Photography",
      category: "Photography",
      image: "https://www.anantabd.net/wp-content/uploads/2020/03/CONFERENCE-PHOTOGRAPHY1-768x513.jpg",
      gallery: [
        "https://www.anantabd.net/wp-content/uploads/2020/03/CONFERENCE-PHOTOGRAPHY1-768x513.jpg",
        "https://www.anantabd.net/wp-content/uploads/2020/03/CONFERENCE-PHOTOGRAPHY2-768x513.jpg",
        "https://www.anantabd.net/wp-content/uploads/2020/03/CONFERENCE-PHOTOGRAPHY3-768x513.jpg",
        "https://www.anantabd.net/wp-content/uploads/2020/03/CONFERENCE-PHOTOGRAPHY5-768x576.jpg",
        "https://www.anantabd.net/wp-content/uploads/2020/03/CONFERENCE-PHOTOGRAPHY4-768x513.jpg",
       
    
      ],
      details: "Full day coverage • Professional editing • High-resolution images • Digital album • Print-ready files • Drone photography available • Same-day preview • Post-event album"
    },
    {
      id: 2,
      title: "Industrial Photography",
      category: "Photography",
      image: "https://www.anantabd.net/wp-content/uploads/2020/03/Industrial-Photogr-1-768x449.jpg",
      gallery: [
        "https://www.anantabd.net/wp-content/uploads/2020/03/Industrial-Photography-of-BM-Energy-Ltd2-768x512.jpg",
        "https://www.anantabd.net/wp-content/uploads/2020/03/Industrial-Photography-of-BM-Energy-Ltd5-768x496.jpg",
        "https://www.anantabd.net/wp-content/uploads/2020/03/Industrial-Photography-of-BM-Energy-Ltd4-768x512.jpg",
       
        "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=600&q=80",
      ],
      details: "2-8 hours coverage • Edited photos • Digital copies • Corporate branding • Facility documentation • Team photography • Product showcase • Professional retouching"
    },
    {
      id: 3,
      title: "Corporate Video Production",
      category: "Video",
      image: "https://www.anantabd.net/services/video-production-company-in-bangladesh/",
      gallery: [
        "https://www.anantabd.net/services/video-production-company-in-bangladesh/",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1537381052736-fe75ced3e34c?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1535016120754-fd58615ccbf5?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1533627519674-87af27127a8d?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=600&q=80",
      ],
      details: "Scriptwriting • Professional shooting • 4K video quality • Color grading • Sound design • Motion graphics • Multiple camera angles • Post-production editing"
    },
    {
      id: 4,
      title: "Modeling Photography",
      category: "Photography",
      image: "https://www.anantabd.net/wp-content/uploads/2020/01/7.jpg",
      gallery: [
        "https://www.anantabd.net/wp-content/uploads/2020/01/model-photoshoot-in-dhaka-6-350x350-1.jpg",
        "https://www.anantabd.net/wp-content/uploads/2020/01/model-photoshoot-in-dhaka.jpg",
        "https://www.anantabd.net/wp-content/uploads/2020/01/model-photography-9.jpg",
        "https://www.anantabd.net/wp-content/uploads/2020/01/DSC_3371-350x350-1-300x300.jpg",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1517841905240-472988babdf0?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80",
      ],
      details: "Studio setup • Multiple angles • Various backgrounds • Professional lighting • Wardrobe styling • Hair & makeup coordination • Retouching services • Fashion portfolio creation"
    },
    {
      id: 5,
      title: "Product Photography",
      category: "Video",
      image: "https://www.anantabd.net/wp-content/uploads/2020/01/product-Photography-1.jpg",
      gallery: [
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1537381052736-fe75ced3e34c?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1525565565265-20668516635a?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1522869635100-ce306fb11cf5?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&q=80",
      ],
      details: "Concept development • Professional production • Post-production editing • Motion graphics • E-commerce optimization • Multiple product angles • Lifestyle shoots • Behind-the-scenes content"
    },
    {
      id: 6,
      title: "Wedding Photography & Videography",
      category: "Photography",
      image: "https://www.anantabd.net/wp-content/uploads/2019/12/wedding-photography-11.jpg",
      gallery: [
        "https://www.anantabd.net/wp-content/uploads/2019/12/wedding-photography-12.jpg",
        "https://www.anantabd.net/wp-content/uploads/2019/12/wedding-photography-11.jpg",
        "https://www.anantabd.net/wp-content/uploads/2019/12/wedding-photography-10.jpg",
        "https://www.anantabd.net/wp-content/uploads/2019/12/wedding-photography-9.jpg",
        "https://www.anantabd.net/wp-content/uploads/2019/12/wedding-photography-8.jpg",
        "https://www.anantabd.net/wp-content/uploads/2019/12/wedding-photography-7.jpg",
        "https://www.anantabd.net/wp-content/uploads/2019/12/wedding-photography-5.jpg",
        "https://www.anantabd.net/wp-content/uploads/2019/12/wedding-photography-4.jpg",
      ],
      details: "Full day coverage • Bridal photography • Candid moments • Venue decoration shots • Guest interactions • Reception highlights • Same-day edit video • Drone footage included"
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-base-100">
      <div className="mx-auto w-full max-w-7xl px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-4">
            OUR SERVICES
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary mb-4">
            Professional Photography & Video Services
          </h1>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group rounded-2xl overflow-hidden bg-white border-2 border-base-300 hover:border-primary transition-all hover:shadow-xl"
            >
              {/* Image Container */}
              <div className="relative h-48 md:h-56 overflow-hidden bg-base-300">
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <span className="inline-block rounded-full bg-primary/90 px-3 py-1 text-xs font-bold text-white">
                    {service.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg md:text-xl font-bold text-secondary mb-4">
                  {service.title}
                </h3>
                
                {/* Details Bullet Points */}
                <div className="space-y-2 mb-6">
                  {service.details.split('•').map((detail, idx) => (
                    detail.trim() && (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-primary text-sm mt-0.5">✓</span>
                        <span className="text-sm text-neutral">{detail.trim()}</span>
                      </div>
                    )
                  ))}
                </div>

                {/* View Button */}
                <button 
                  onClick={() => navigate(`/services/Photography&VedioServices/${service.id}`, { state: { service } })}
                  className="w-full rounded-lg bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-all">
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhotographyVideoServices;