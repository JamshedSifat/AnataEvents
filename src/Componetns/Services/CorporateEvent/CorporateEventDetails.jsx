import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";

const CorporateEventDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);

  useEffect(() => {
    fetch("../../../../public/CorporateEvents/CorporateEvents.json")
      .then((res) => res.json())
      .then((data) => {
        const foundService = data.find((item) => item.id === parseInt(id));
        setService(foundService);
      });
  }, [id]);

  if (!service) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">

        {/* Back Button */}
        <Link
          to="/services/corporate-event"
          className="text-primary font-semibold mb-6 inline-block"
        >
          ← Back to Services
        </Link>

        {/* Title */}
        <h1 className="text-4xl font-bold mb-6">
          {service.icon} {service.title}
        </h1>

        {/* Main Image */}
        <img
          src={service.images[0]}
          alt={service.title}
          className="w-full h-[400px] object-cover rounded-xl mb-8"
        />

        {/* Description */}
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          {service.fullDetails}
        </p>

        {/* Highlights */}
        {service.highlights && (
          <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-4">Key Highlights</h3>

            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              {service.highlights.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Image Gallery */}
        <div>
          <h3 className="text-2xl font-semibold mb-6">Event Gallery</h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={service.title}
                className="w-full h-56 object-cover rounded-xl hover:scale-105 transition duration-300"
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default CorporateEventDetails;