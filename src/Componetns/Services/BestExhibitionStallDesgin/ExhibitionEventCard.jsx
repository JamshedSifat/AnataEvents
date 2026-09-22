import React from 'react';
import { ArrowRight } from 'lucide-react';

const ExhibitionEventCard = ({ event }) => {
  if (!event) return null;

  return (
    <a
      href={`/services/exhibition-events/${event.slug}`}
      className="block w-full max-w-sm h-full"
    >
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">

        {/* Image */}
        <div className="relative w-full h-52 overflow-hidden">
          <img
            src={
              event.image ||
              event.images?.[0] ||
              'https://via.placeholder.com/400x300?text=Exhibition+Event'
            }
            alt={event.title || 'Exhibition Event'}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.src =
                'https://via.placeholder.com/400x300?text=Exhibition+Event';
            }}
          />

          <span className="absolute top-3 left-3 badge badge-primary text-xs">
            {event.category || 'Exhibition'}
          </span>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col justify-between flex-grow">

          <div>
            <h2 className="text-lg font-bold text-gray-900 line-clamp-2 hover:text-primary transition mb-2">
              {event.title || 'Untitled Event'}
            </h2>

            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
              {event.excerpt || 'No description available'}
            </p>
          </div>

          {/* Button */}
          <div className="flex items-center text-primary font-semibold text-sm hover:gap-2 transition-all">
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </div>

        </div>
      </div>
    </a>
  );
};

export default ExhibitionEventCard;