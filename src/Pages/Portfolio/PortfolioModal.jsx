// File: src/Components/Portfolio/PortfolioModal.jsx
import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const PortfolioModal = ({
  isOpen,
  selectedImage,
  currentImageIndex,
  onClose,
  onNextImage,
  onPreviousImage,
  onThumbnailClick
}) => {
  if (!isOpen || !selectedImage) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 z-40"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg z-10 hover:scale-110"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
          
          {/* Gallery Section */}
          <div className="relative bg-black">
            {/* Main Image */}
            <div className="relative w-full h-96 overflow-hidden">
              <img 
                src={selectedImage.gallery[currentImageIndex]}
                alt={`${selectedImage.title} - ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Buttons */}
              {selectedImage.gallery.length > 1 && (
                <>
                  {/* Previous Button */}
                  <button
                    onClick={onPreviousImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-black p-3 rounded-full transition-all duration-300 z-10 hover:scale-110 shadow-lg"
                    title="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={onNextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-black p-3 rounded-full transition-all duration-300 z-10 hover:scale-110 shadow-lg"
                    title="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 hover:bg-black/80 text-white px-4 py-2 rounded-full text-sm transition-all duration-300">
                    {currentImageIndex + 1} / {selectedImage.gallery.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {selectedImage.gallery.length > 1 && (
              <div className="bg-black p-4 flex gap-2 overflow-x-auto">
                {selectedImage.gallery.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => onThumbnailClick(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                      currentImageIndex === index
                        ? 'border-red-600 shadow-lg'
                        : 'border-gray-600 opacity-60 hover:opacity-100'
                    }`}
                    title={`View image ${index + 1}`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Content Section */}
          <div className="p-8">
            {/* Category & Date */}
            <div className="flex items-center justify-between mb-4">
              <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                {selectedImage.category}
              </span>
              <span className="text-gray-500 text-sm">{selectedImage.date}</span>
            </div>
            
            {/* Title */}
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {selectedImage.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              {selectedImage.description}
            </p>
            
            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Client</h4>
                <p className="text-gray-600">{selectedImage.client}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Date</h4>
                <p className="text-gray-600">{selectedImage.date}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Investment</h4>
                <p className="text-gray-600">{selectedImage.budget}</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4">
              <button 
                onClick={onClose}
                className="flex-1 border border-gray-300 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-300"
              >
                Close
              </button>
              <button className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors duration-300">
                Contact For Similar Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PortfolioModal;