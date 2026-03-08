import React, { useState, useEffect } from 'react';

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const heroSlides = [
        {
            title: "Creating Extraordinary",
            subtitle: "Luxury Events",
            description: "Transform your special moments into unforgettable experiences with our premium event planning services.",
            image: "https://i.pinimg.com/736x/e2/15/a3/e215a3084956ce5be9a8195e14a51521.jpg",
            stats: "500+ Events Planned"
        },
        {
            title: "Luxury Wedding",
            subtitle: "Planning",
            description: "From intimate ceremonies to grand celebrations, we bring your dream wedding to life with impeccable attention to detail.",
            image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
            stats: "15+ Years Experience"
        },
        {
            title: "Premium Corporate",
            subtitle: "Events",
            description: "Elevate your business gatherings with sophisticated corporate event planning that impresses and inspires.",
            image: "https://i.pinimg.com/736x/a2/dd/49/a2dd4904d3bf2f10bfc9ca316b5062b2.jpg",
            stats: "1000+ Happy Clients"
        }
    ];

    // Auto slide functionality
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [heroSlides.length]);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Slides */}
            {heroSlides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
                </div>
            ))}

            {/* Floating Decorative Elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-32 right-16 w-32 h-32 bg-pink-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 right-10 w-16 h-16 bg-orange-400/20 rounded-full blur-xl animate-pulse delay-2000"></div>

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="space-y-5">
                    {/* Badge */}
                    <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium">
                        <span className="mr-2">🏆</span>
                        <span>{heroSlides[currentSlide].stats}</span>
                    </div>

                    {/* Main Heading */}
                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold text-white leading-tight">
                            {heroSlides[currentSlide].title}
                            <span className="block bg-gradient-to-r from-primary  via-red-600 to-pink-800 bg-clip-text text-transparent">
                                {heroSlides[currentSlide].subtitle}
                            </span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
                            {heroSlides[currentSlide].description}
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
                        <button className="group relative bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-red-500/25">
                            <span className="flex items-center space-x-2">
                                <span>Plan Your Event</span>
                                <span className="group-hover:translate-x-1 transition-transform duration-300">🎭</span>
                            </span>
                        </button>
                        
                        <button className="group relative border-2 border-white/30 text-white hover:border-white/50 hover:bg-white/10 backdrop-blur-md px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105">
                            <span className="flex items-center space-x-2">
                                <span>View Portfolio</span>
                                <span className="group-hover:rotate-12 transition-transform duration-300">🖼️</span>
                            </span>
                        </button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
                        <div className="space-y-2">
                            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">
                                500+
                            </div>
                            <div className="text-sm text-gray-300">Events Planned</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">
                                15+
                            </div>
                            <div className="text-sm text-gray-300">Years Experience</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">
                                98%
                            </div>
                            <div className="text-sm text-gray-300">Client Satisfaction</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
                {heroSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentSlide
                                ? 'bg-gradient-to-r from-red-500 to-pink-500 w-8'
                                : 'bg-white/30 hover:bg-white/50'
                        }`}
                    />
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 z-20"
            >
                ←
            </button>
            
            <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 z-20"
            >
                →
            </button>

            {/* Scroll Down Indicator */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
                </div>
            </div>
        </section>
    );
};

export default Hero;