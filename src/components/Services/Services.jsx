import React, { useState, useEffect } from 'react';
import { contentApi } from '../../services/content';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const services = await contentApi.services({ page_size: 50 });
      setServices(
        services.map((service) => ({
          _id: service.id,
          title: service.name,
          slug: service.slug,
          description: service.summary,
          features: service.features || [],
          icon: service.icon,
          badge: service.badge,
          lightGradient: `${service.color_from || 'from-primary'} ${service.color_to || 'to-secondary'}`,
        }))
      );
    } catch (error) {
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-base-100 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-10 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl animate-pulse-gentle"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="badge badge-primary badge-lg mb-4">
            <span className="mr-2">✨</span>
            <span>Our Services</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-base-content mb-6">
            Premium Event 
            <span className="block text-primary animate-gradient bg-clip-text text-transparent mt-2">
              Planning Services
            </span>
          </h2>
          
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            Creating exceptional experiences that exceed expectations and leave lasting memories
          </p>
        </div>

        {/* Services Grid */}
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {services.map((service, index) => (
              <div 
                key={service._id}
                className="group animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Service Card */}
                <div className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-500 border border-base-300 h-full">
                  <div className="card-body p-6">
                    {/* Icon and Badge Container */}
                    <div className="flex items-center justify-between mb-4">
                      {/* Icon */}
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl text-white transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                        <div className={`w-full h-full bg-gradient-to-br ${service.lightGradient} rounded-2xl flex items-center justify-center`}>
                          {service.icon}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className={`badge bg-gradient-to-r ${service.lightGradient} text-white border-none text-xs`}>
                            Premium
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="card-title text-lg font-playfair font-bold text-base-content mb-3 group-hover:text-primary transition-colors duration-300 leading-tight">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-base-content/70 mb-4 text-xs leading-relaxed">
                      {service.description}
                    </p>

                  {/* Features */}
<div className="space-y-2 mb-4">
  {service.features?.map((feature, idx) => (
    <div key={idx} className="flex items-center text-xs text-base-content/60 group-hover:text-base-content/80 transition-colors duration-300">
      <div className="w-1.5 h-1.5 rounded-full mr-2 transform scale-0 group-hover:scale-100 transition-transform duration-300 bg-primary"></div>
      <span className="transform translate-x-1 group-hover:translate-x-0 transition-transform duration-300">
        {feature}
      </span>
    </div>
  ))}
</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-base-content/60 text-lg">No services available yet</p>
          </div>
        )}

        {/* Stats Section */}
        <div className="mb-16 animate-fade-in">
          <div className="stats stats-vertical lg:stats-horizontal shadow w-full bg-base-200/50 backdrop-blur-sm">
            <div className="stat">
              <div className="stat-figure text-primary">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
              </div>
              <div className="stat-title text-base-content/70">Total Services</div>
              <div className="stat-value text-primary">{services.length}</div>
              <div className="stat-desc text-base-content/60">Available Categories</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⭐</span>
                </div>
              </div>
              <div className="stat-title text-base-content/70">Client Rating</div>
              <div className="stat-value text-secondary">4.9/5</div>
              <div className="stat-desc text-base-content/60">Average Satisfaction</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-accent">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
              </div>
              <div className="stat-title text-base-content/70">Success Rate</div>
              <div className="stat-value text-accent">100%</div>
              <div className="stat-desc text-base-content/60">Event Completion</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-info">
                <div className="w-12 h-12 bg-info/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💎</span>
                </div>
              </div>
              <div className="stat-title text-base-content/70">Premium Quality</div>
              <div className="stat-value text-info">A+</div>
              <div className="stat-desc text-base-content/60">Service Grade</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;