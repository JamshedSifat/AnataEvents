import React, { useState } from 'react';

const Portfolio = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedImage, setSelectedImage] = useState(null);

    const filters = ['All', 'Weddings', 'Corporate', 'Galas', 'Private', 'Luxury'];

    const portfolioItems = [
        {
            id: 1,
            title: "Luxury Garden Wedding",
            category: "Weddings",
            image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            description: "An enchanting outdoor ceremony with 200 guests in a botanical garden setting",
            client: "Sarah & Michael",
            date: "June 2023",
            budget: "$75,000"
        },
        {
            id: 2,
            title: "Tech Conference 2023",
            category: "Corporate",
            image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            description: "A cutting-edge technology conference for 500+ industry professionals",
            client: "TechCorp Inc.",
            date: "September 2023",
            budget: "$120,000"
        },
        {
            id: 3,
            title: "Charity Gala Evening",
            category: "Galas",
            image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            description: "An elegant fundraising gala raising over $500K for children's education",
            client: "Hope Foundation",
            date: "November 2023",
            budget: "$95,000"
        },
        {
            id: 4,
            title: "Golden Anniversary",
            category: "Private",
            image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
            description: "A heartwarming 50th anniversary celebration with family and friends",
            client: "The Johnson Family",
            date: "October 2023",
            budget: "$35,000"
        },
        {
            id: 5,
            title: "Beachfront Destination Wedding",
            category: "Luxury",
            image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
            description: "An exclusive destination wedding on a private beach resort",
            client: "Emma & James",
            date: "December 2023",
            budget: "$150,000"
        },
        {
            id: 6,
            title: "Product Launch Event",
            category: "Corporate",
            image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            description: "A spectacular product launch with interactive displays and entertainment",
            client: "Innovation Labs",
            date: "August 2023",
            budget: "$85,000"
        },
        {
            id: 7,
            title: "Royal Wedding Celebration",
            category: "Weddings",
            image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            description: "A grand traditional wedding with 400 guests in a historic mansion",
            client: "Priya & Arjun",
            date: "February 2024",
            budget: "$200,000"
        },
        {
            id: 8,
            title: "Birthday Milestone",
            category: "Private",
            image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            description: "An unforgettable 40th birthday party with custom entertainment",
            client: "Robert Martinez",
            date: "July 2023",
            budget: "$45,000"
        },
        {
            id: 9,
            title: "Awards Ceremony Gala",
            category: "Galas",
            image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?ixlib=rb-4.0.3&auto=format&fit=crop&w=2062&q=80",
            description: "An prestigious awards ceremony honoring industry excellence",
            client: "Media Excellence Awards",
            date: "March 2024",
            budget: "$110,000"
        }
    ];

    const filteredItems = activeFilter === 'All' 
        ? portfolioItems 
        : portfolioItems.filter(item => item.category === activeFilter);

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
                    {filteredItems.map((item, index) => (
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
                                        onClick={() => setSelectedImage(item)}
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
                    ))}
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
                            <div className="text-3xl md:text-4xl font-bold mb-2">98%</div>
                            <div className="text-red-100">Client Satisfaction</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold mb-2">25+</div>
                            <div className="text-red-100">Awards Won</div>
                        </div>
                    </div>
                </div>

                
            </div>

            {/* Modal */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="relative">
                            {/* Close Button */}
                            <button 
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-4 right-4 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors duration-300 z-10"
                            >
                                ×
                            </button>
                            
                            {/* Image */}
                            <img 
                                src={selectedImage.image}
                                alt={selectedImage.title}
                                className="w-full h-80 object-cover rounded-t-2xl"
                            />
                            
                            {/* Content */}
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                                        {selectedImage.category}
                                    </span>
                                    <span className="text-gray-500 text-sm">{selectedImage.date}</span>
                                </div>
                                
                                <h3 className="text-3xl font-bold text-gray-900 mb-4">{selectedImage.title}</h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">{selectedImage.description}</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                                
                                <div className="flex gap-4">
                                    <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300">
                                        Start Similar Project
                                    </button>
                                    <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors duration-300">
                                        View More Photos
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Portfolio;