// File: src/Components/CorporateEventCard.jsx (Fixed)
import React from 'react';
import { ArrowRight } from 'lucide-react';

const CorporateEventCard = ({ event, featured = false }) => {
  return (
    <a href={`/services/corporate-events/${event._id}`}>
      <div className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer ${
        featured ? 'lg:flex' : ''
      }`}>
        {/* Image */}
        <div className={`relative overflow-hidden ${
          featured 
            ? 'w-full h-48 sm:h-56 lg:w-1/2 lg:h-auto' 
            : 'w-full h-48'
        }`}>
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=Corporate+Event';
            }}
          />
          <div className="absolute top-3 left-3">
            <span className="badge badge-primary text-xs">{event.category || 'Corporate'}</span>
          </div>
        </div>

        {/* Content */}
        <div className={`p-4 sm:p-6 ${
          featured 
            ? 'w-full lg:w-1/2' 
            : 'w-full'
        } flex flex-col justify-between`}>
          {/* Title */}
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 line-clamp-2 hover:text-primary transition mb-2">
              {event.title}
            </h2>

            {/* Excerpt */}
            <p className="text-gray-600 line-clamp-2 mb-4 text-xs sm:text-sm">
              {event.excerpt}
            </p>
          </div>

          {/* Read More Link */}
          <div className="flex items-center text-primary font-semibold hover:gap-2 transition-all text-xs sm:text-sm">
            <span>Learn More</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
          </div>
        </div>
      </div>
    </a>
  );
};

export default CorporateEventCard;