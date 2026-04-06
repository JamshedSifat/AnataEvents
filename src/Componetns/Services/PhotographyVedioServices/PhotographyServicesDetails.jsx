import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router';

const PhotographyServicesDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const service = location.state?.service;
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', date: '' });

  if (!service) {
    return (
      <section className="py-20 bg-base-100 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 text-center w-full">
          <div className="rounded-2xl bg-white border-2 border-base-300 p-12">
            <p className="text-2xl font-bold text-secondary mb-4">📸 Service Not Found</p>
            <button 
              onClick={() => navigate(-1)}
              className="rounded-lg bg-primary px-8 py-3 text-white font-semibold hover:shadow-lg transition-all"
            >
              ← Go Back
            </button>
          </div>
        </div>
      </section>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for booking! We will contact you soon.');
    setFormData({ name: '', email: '', phone: '', date: '' });
  };

  return (
    <section className="bg-gradient-to-b from-base-100 to-base-200 py-16 md:py-20">
      <div className="mx-auto w-full max-w-7xl px-4">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-all hover:translate-x-1"
        >
          ← Back to Services
        </button>

        {/* Header Section */}
        <div className="mb-12">
          <div className="relative h-72 md:h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
            <img
              src={service.image}
              alt={service.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            
            <div className="absolute top-6 right-6 rounded-full bg-primary/95 px-4 py-2 shadow-lg">
              <span className="text-sm font-bold text-white">{service.category}</span>
            </div>

            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                {service.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">

          {/* What's Included - Full Width */}
          <div className="rounded-2xl bg-white border-2 border-base-300 p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-3">
              <span className="text-3xl">✓</span> What's Included
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {service.details.split('•').map((detail, idx) => (
                detail.trim() && (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-base-100 hover:bg-primary/10 transition-all">
                    <span className="text-primary text-2xl">✓</span>
                    <span className="text-neutral font-medium">{detail.trim()}</span>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Gallery Section - Large */}
          <div>
            <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-3">
              <span className="text-3xl">🖼️</span> Gallery ({service.gallery?.length || 8} Images)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {service.gallery && service.gallery.map((image, idx) => (
                <div 
                  key={idx} 
                  className="relative group rounded-xl overflow-hidden h-48 md:h-56 bg-base-300 cursor-pointer shadow-lg hover:shadow-xl transition-all"
                >
                  <img
                    src={image}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20 p-8">
            <h2 className="text-2xl font-bold text-secondary mb-6">⭐ Why Choose Us</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: '👥', title: 'Expert Team', desc: '10+ years experience' },
                { icon: '🎯', title: 'Quality First', desc: 'Premium equipment' },
                { icon: '⚡', title: 'Fast Delivery', desc: 'Quick turnaround' },
                { icon: '🎨', title: 'Custom', desc: 'Tailored solutions' }
              ].map((item, idx) => (
                <div key={idx} className="rounded-xl bg-white p-6 hover:shadow-lg transition-all text-center">
                  <p className="text-4xl mb-3">{item.icon}</p>
                  <p className="font-bold text-secondary text-sm mb-1">{item.title}</p>
                  <p className="text-xs text-neutral">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

         
        </div>
      </div>
    </section>
  );
};

export default PhotographyServicesDetails;