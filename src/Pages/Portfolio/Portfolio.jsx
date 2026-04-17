// File: src/Pages/Portfolio/Portfolio.jsx (Updated)
import React, { useState, useEffect } from 'react';
import PortfolioModal from './PortfolioModal';


const Portfolio = () => {
    const [portfolioItems, setPortfolioItems] = useState([]);
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const defaultPortfolios = [
        {
            id: 1,
            title: "Luxury Garden Wedding",
            category: "Weddings",
            image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            description: "An enchanting outdoor ceremony with 200 guests in a botanical garden setting",
            client: "Sarah & Michael",
            date: "June 2023",
            budget: "$75,000",
            gallery: [
                "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
                "https://images.unsplash.com/photo-1465056836643-15cea6d4e866?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            ]
        },
        // ... more default items
    ];

    const filters = ['All', 'Weddings', 'Corporate', 'Galas', 'Private', 'Luxury'];

    useEffect(() => {
        loadPortfolios();
    }, []);

    const loadPortfolios = () => {
        try {
            setLoading(true);
            const savedPortfolios = localStorage.getItem('portfolios');
            
            if (savedPortfolios && JSON.parse(savedPortfolios).length > 0) {
                const data = JSON.parse(savedPortfolios);
                setPortfolioItems(data);
            } else {
                setPortfolioItems(defaultPortfolios);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error loading portfolios:', error);
            setPortfolioItems(defaultPortfolios);
            setLoading(false);
        }
    };

    const filteredItems = activeFilter === 'All' 
        ? portfolioItems 
        : portfolioItems.filter(item => item.category === activeFilter);

    const handleViewDetails = (item) => {
        setSelectedImage(item);
        setCurrentImageIndex(0);
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) => 
            (prev + 1) % selectedImage.gallery.length
        );
    };

    const handlePreviousImage = () => {
        setCurrentImageIndex((prev) => 
            prev === 0 ? selectedImage.gallery.length - 1 : prev - 1
        );
    };

    const handleThumbnailClick = (index) => {
        setCurrentImageIndex(index);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
        setCurrentImageIndex(0);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 bg-red-100 text-red-600 text-sm font-medium rounded-full mb-4">
                        Our Work
                    </span>
                    
                    <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gray-900 mb-6">
                        Event 
                        <span className="text-red-600"> Portfolio </span>
                        Showcase
                    </h2>
                    
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover our recent masterpieces and see how we transform dreams into extraordinary experiences
                    </p>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                                activeFilter === filter
                                    ? 'bg-red-600 text-white shadow-lg transform scale-105'
                                    : 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-600'
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Portfolio Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item, index) => (
                            <div 
                                key={item.id}
                                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Image */}
                                <div className="relative h-64 overflow-hidden">
                                    <img 
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    
                                    {/* Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button 
                                            onClick={() => handleViewDetails(item)}
                                            className="bg-white text-red-600 px-6 py-3 rounded-full font-semibold hover:bg-red-600 hover:text-white transition-colors duration-300"
                                        >
                                            View Details
                                        </button>
                                    </div>

                                    {/* Category Badge */}
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-300">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                        {item.description}
                                    </p>
                                    
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span className="font-medium">{item.client}</span>
                                        <span>{item.date}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-12">
                            <p className="text-gray-600 text-lg">No portfolios available</p>
                        </div>
                    )}
                </div>

                {/* Stats Section */}
                <div className="bg-red-600 rounded-2xl p-8 md:p-12 text-white mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
                            <div className="text-red-100">Events Completed</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold mb-2">$50M+</div>
                            <div className="text-red-100">Total Event Value</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold mb-2">100%</div>
                            <div className="text-red-100">Client Satisfaction</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold mb-2">25+</div>
                            <div className="text-red-100">Awards Won</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ Modal Component */}
            <PortfolioModal
              isOpen={selectedImage !== null}
              selectedImage={selectedImage}
              currentImageIndex={currentImageIndex}
              onClose={handleCloseModal}
              onNextImage={handleNextImage}
              onPreviousImage={handlePreviousImage}
              onThumbnailClick={handleThumbnailClick}
            />
        </section>
    );
};

export default Portfolio;