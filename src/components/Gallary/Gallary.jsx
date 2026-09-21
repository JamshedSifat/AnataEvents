import React, { useState, useEffect } from 'react';

const Gallery = () => {
    const [galleryImages, setGalleryImages] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    // Fetch gallery data
    useEffect(() => {
        fetch('/gallery.json')
            .then(res => res.json())
            .then(data => setGalleryImages(data))
            .catch(err => console.error('Failed to fetch gallery data:', err));
    }, []);

    // Show first 12 or all
    const displayImages = showAll ? galleryImages : galleryImages.slice(0, 12);

    return (
        <section className="py-4 bg-base-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="badge badge-primary badge-lg mb-4">
                        📸 Gallery
                    </div>

                    <h2 className="text-4xl md:text-5xl font-playfair font-bold text-base-content mb-6">
                        Event <span className="text-primary">Gallery</span>
                    </h2>

                    <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                        Explore our stunning collection of events and venues that showcase the beauty and elegance of our work
                    </p>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                    {displayImages.map((image) => (
                        <div 
                            key={image.id}
                            className="group cursor-pointer"
                            onClick={() => setSelectedImage(image)}
                        >
                            <div className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                                <figure className="relative overflow-hidden">
                                    <img 
                                        src={image.src}
                                        alt={image.title}
                                        className="w-full h-48 md:h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                                        loading="lazy"
                                    />

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="text-white text-center">
                                            <div className="text-3xl mb-2">🔍</div>
                                            <p className="text-sm font-medium">View Image</p>
                                        </div>
                                    </div>
                                </figure>

                                <div className="card-body p-4">
                                    <h3 className="card-title text-sm font-bold text-base-content line-clamp-1">
                                        {image.title}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                {!showAll && galleryImages.length > 12 && (
                    <div className="text-center mb-8">
                        <button 
                            onClick={() => setShowAll(true)}
                            className="btn btn-primary btn-lg"
                        >
                            📷 View All Photos ({galleryImages.length})
                        </button>
                    </div>
                )}

                {/* Show Less */}
                {showAll && (
                    <div className="text-center mb-8">
                        <button 
                            onClick={() => {
                                setShowAll(false);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="btn btn-outline btn-primary"
                        >
                            Show Less
                        </button>
                    </div>
                )}

            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-5xl w-full">

                        <button 
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-10 right-0 text-white text-2xl"
                        >
                            ✕
                        </button>

                        <img 
                            src={selectedImage.src}
                            alt={selectedImage.title}
                            className="w-full max-h-[80vh] object-contain rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />

                        <div 
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-bold mb-2">{selectedImage.title}</h3>
                            <p className="text-white/90">{selectedImage.description}</p>
                        </div>

                    </div>
                </div>
            )}
        </section>
    );
};

export default Gallery;