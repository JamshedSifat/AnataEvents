import React, { useState } from 'react';

const SingerCard = ({ singer, onBookNow, onToggleFavorite, isFavorite }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const getAvailabilityColor = (availability) => {
    switch (availability?.toLowerCase()) {
      case 'available':
        return 'bg-success text-success-content';
      case 'busy':
        return 'bg-warning text-warning-content';
      case 'limited':
        return 'bg-info text-info-content';
      default:
        return 'bg-neutral text-neutral-content';
    }
  };

  return (
    <div className="bg-base-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-base-300 overflow-hidden group">
      {/* Singer Image */}
      <div className="relative overflow-hidden">
        {!imageLoaded && (
          <div className="w-full h-64 bg-base-300 animate-pulse flex items-center justify-center">
            <div className="text-4xl text-base-content/30">🎤</div>
          </div>
        )}
        
        {imageError ? (
          <div className="w-full h-64 bg-gradient-to-br from-primary/10 to-secondary/10 flex flex-col items-center justify-center">
            <div className="text-6xl text-primary/50 mb-2">🎵</div>
            <p className="text-base-content/50 text-sm">{singer.name}</p>
          </div>
        ) : (
          <img 
            src={singer.image} 
            alt={singer.name}
            className={`w-full h-64 object-cover transition-all duration-300 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0 absolute'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}

        {/* Overlay with rating and availability */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <div className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            ⭐ {singer.rating}
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getAvailabilityColor(singer.availability)}`}>
            {singer.availability || 'Unknown'}
          </div>
        </div>

        {/* Favorite button */}
        <div className="absolute top-4 left-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(singer.id);
            }}
            className={`p-2 rounded-full transition-all duration-300 ${
              isFavorite 
                ? 'bg-primary text-white' 
                : 'bg-white/80 text-base-content hover:bg-primary hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-secondary/80 to-transparent p-4">
          <h3 className="text-white font-bold text-xl">{singer.name}</h3>
          <p className="text-base-200 text-sm">{singer.genre}</p>
        </div>
      </div>

      {/* Singer Info */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-primary">{singer.price}</span>
          <span className="text-sm text-accent bg-accent/10 px-2 py-1 rounded-full">
            {singer.experience}
          </span>
        </div>

        <p className="text-base-content text-sm mb-4 line-clamp-2">
          {singer.description}
        </p>

        {/* Languages */}
        <div className="mb-4">
          <p className="text-xs text-neutral font-semibold mb-2">Languages:</p>
          <div className="flex flex-wrap gap-1">
            {singer.languages?.map((lang, index) => (
              <span 
                key={index}
                className="bg-base-200 text-base-content px-2 py-1 rounded text-xs"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>

        {/* Popular Songs */}
        <div className="mb-6">
          <p className="text-xs text-neutral font-semibold mb-2">Popular Songs:</p>
          <p className="text-xs text-base-content opacity-75">
            {singer.popularSongs?.slice(0, 2).join(", ")}...
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={() => onBookNow(singer)}
            disabled={singer.availability?.toLowerCase() === 'busy'}
            className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-neutral disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:transform-none"
          >
            {singer.availability?.toLowerCase() === 'busy' ? 'Not Available' : 'Book Now'}
          </button>
          {/* <button className="bg-base-200 hover:bg-base-300 text-base-content py-2 px-4 rounded-lg transition-all duration-300">
            View Details
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default SingerCard;