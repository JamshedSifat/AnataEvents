import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 border-4 border-base-300 border-t-primary rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-2xl">🎤</div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-base-content mb-2">Loading Singers</h2>
        <p className="text-base-content/70">Getting our talented artists ready for you...</p>
        
        {/* Loading skeleton cards */}
        <div className="max-w-6xl mx-auto px-4 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-base-100 rounded-2xl p-4 animate-pulse">
                <div className="bg-base-300 h-48 rounded-lg mb-4"></div>
                <div className="bg-base-300 h-4 rounded mb-2"></div>
                <div className="bg-base-300 h-3 rounded w-3/4 mb-4"></div>
                <div className="flex justify-between">
                  <div className="bg-base-300 h-3 rounded w-1/4"></div>
                  <div className="bg-base-300 h-3 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;