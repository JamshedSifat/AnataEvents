import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

const CorporateEvent = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("../../../../public/CorporateEvents/CorporateEvents.json")
      .then(res => {
        if (!res.ok) throw new Error("Failed to load JSON");
        return res.json();
      })
      .then(data => {
        console.log("Loaded services:", data);
        setServices(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading services:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-600">
        Loading services...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600">
        Error: {error}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-20 text-gray-600">
        No services found
      </div>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold border border-primary/30">
              CORPORATE SOLUTIONS
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Corporate Event Management{" "}
            <span className="text-primary">Company in Bangladesh</span>
          </h1>

          <p className="max-w-3xl mx-auto text-gray-600 text-lg leading-relaxed">
            <strong className="text-primary">
              Ananta Events & Entertainment
            </strong>{" "}
            is one of Bangladesh's leading{" "}
            <strong className="text-primary">
              corporate event management companies
            </strong>{" "}
            based in Dhaka.
          </p>
        </div>

        {/* Main Content */}
        <div className="mb-16 space-y-6">
          <h2 className="text-3xl font-bold">
            <span className="text-primary">
              360° Corporate Event Services
            </span>
          </h2>

          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>
              As a trusted{" "}
              <strong className="text-primary">
                corporate event management company in Bangladesh
              </strong>
              , we provide complete 360° event solutions from planning to
              execution.
            </p>
          </div>
        </div>

        {/* Services Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {services && services.length > 0 ? (
            services.map((service) => {
              // Ensure we have valid data
              const image = service?.image1 || "https://via.placeholder.com/400x300?text=Image";
              const highlights = Array.isArray(service?.highlights) ? service.highlights : [];
              
              return (
                <Link
                  key={service.id}
                  to={`/services/corporateEvent/${service.id}`}
                  className="group no-underline"
                >
                  <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-primary hover:shadow-xl hover:shadow-primary/15 transition-all duration-300 h-full flex flex-col cursor-pointer">

                    {/* Image Container */}
                    <div className="relative h-48 overflow-hidden bg-gray-200">
                      <img
                        src={image}
                        alt={service.title || "Service"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x300?text=Image";
                        }}
                      />
                      <div className="absolute top-4 left-4 bg-white rounded-full p-3 text-2xl shadow-lg">
                        {service.icon || "🎯"}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300">
                        {service.title || "Service"}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 flex-grow">
                        {service.description || "No description"}
                      </p>

                      {/* Highlights */}
                      {highlights.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-2">
                          {highlights.slice(0, 2).map((highlight, idx) => (
                            <span 
                              key={idx} 
                              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* CTA Button */}
                      <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all duration-300">
                        Learn More
                        <ArrowRight className="w-4 h-4" />
                      </div>

                    </div>

                  </div>
                </Link>
              );
            })
          ) : (
            <p className="text-gray-600">No services available</p>
          )}

        </div>

      </div>
    </section>
  );
};

export default CorporateEvent;