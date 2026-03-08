import React, { useState, useEffect } from 'react';

const Gallery = () => {
    const [galleryImages, setGalleryImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = ['All', 'Weddings', 'Corporate', 'Galas', 'Private', 'Venues'];

    // Fetch data from public JSON
  useEffect(() => {
    fetch('/gallery.json') // Public folder er file
        .then(res => res.json())
        .then(data => setGalleryImages(data))
        .catch(err => console.error('Failed to fetch gallery data:', err));
}, []);

    const filteredImages = activeCategory === 'All' 
        ? galleryImages 
        : galleryImages.filter(img => img.category === activeCategory);

    return (
        <section className="py-20 bg-base-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="badge badge-primary badge-lg mb-4">
                        <span className="mr-2">📸</span> Gallery
                    </div>
                    <h2 className="text-4xl md:text-5xl font-playfair font-bold text-base-content mb-6">
                        Event <span className="text-primary">Gallery</span> Collection
                    </h2>
                    <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                        Explore our stunning collection of events and venues that showcase the beauty and elegance of our work
                    </p>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`btn btn-sm md:btn-md ${
                                activeCategory === category 
                                    ? 'btn-primary' 
                                    : 'btn-outline btn-primary'
                            } transition-all duration-300`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                    {filteredImages.map((image, index) => (
                        <div 
                            key={image.id}
                            className="break-inside-avoid group cursor-pointer"
                            style={{ animationDelay: `${index * 0.05}s` }}
                            onClick={() => setSelectedImage(image)}
                        >
                            <div className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                                <figure className="relative overflow-hidden">
                                    <img 
                                        src={image.src}
                                        alt={image.title}
                                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="absolute bottom-4 left-4 right-4 text-white">
                                            <h3 className="font-bold text-lg mb-1">{image.title}</h3>
                                            <p className="text-sm text-white/90">{image.description}</p>
                                        </div>
                                        <div className="absolute top-4 right-4">
                                            <div className="badge badge-secondary">{image.category}</div>
                                        </div>
                                    </div>
                                </figure>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal */}
                {selectedImage && (
                    <dialog className="modal modal-open">
                        <div className="modal-box max-w-5xl">
                            <form method="dialog">
                                <button 
                                    onClick={() => setSelectedImage(null)}
                                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10"
                                >
                                    ✕
                                </button>
                            </form>
                            <img 
                                src={selectedImage.src}
                                alt={selectedImage.title}
                                className="w-full h-auto rounded-lg mb-6"
                            />
                            <div className="flex items-center justify-between mb-4">
                                <div className="badge badge-secondary">{selectedImage.category}</div>
                            </div>
                            <h3 className="text-2xl font-bold text-base-content mb-2">{selectedImage.title}</h3>
                            <p className="text-base-content/70 mb-6">{selectedImage.description}</p>
                        </div>
                    </dialog>
                )}
            </div>
        </section>
    );
};

export default Gallery;