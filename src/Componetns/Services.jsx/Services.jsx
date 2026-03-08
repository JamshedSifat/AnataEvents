import React from 'react';

const Services = () => {
    const services = [
        {
            icon: "🎯",
            title: "Event Management",
            description: "Event management involves planning and organizing corporate or private events like conferences, festivals, concerts, and weddings, including concept creation, audience research, and technical coordination.",
            features: [
                "Theme planning",
                "Venue decoration", 
                "Vendor coordination",
                "Sound & lighting setup"
            ],
            lightGradient: "from-red-500 to-pink-500",
            darkGradient: "from-purple-500 to-pink-500"
        },
        {
            icon: "🏢",
            title: "Corporate Event Management",
            description: "Corporate event management includes planning conferences, seminars, team building programs, AGM meetings, brand launches, corporate dinners, and award ceremonies.",
            features: [
                "Conference planning",
                "Team building events", 
                "Product launches",
                "Award ceremonies"
            ],
            lightGradient: "from-pink-500 to-red-600",
            darkGradient: "from-pink-500 to-indigo-500"
        },
        {
            icon: "🎭",
            title: "Concert & Fashion Show Organizer",
            description: "We organize fashion shows, live concerts, DJ shows, and artist booking services across Dhaka, Chittagong, and all over Bangladesh.",
            features: [
                "Fashion show organizing",
                "Live concert management",
                "DJ show arrangement", 
                "Artist booking service"
            ],
            lightGradient: "from-red-600 to-orange-500",
            darkGradient: "from-indigo-500 to-cyan-500"
        },
        {
            icon: "📊",
            title: "Conference & Seminars",
            description: "We organize professional conferences and seminars with complete planning, venue sourcing, guest speaker management, and audiovisual support.",
            features: [
                "Conference planning",
                "Venue & accommodation booking",
                "Guest speaker management",
                "AV setup & logistics"
            ],
            lightGradient: "from-orange-500 to-red-500",
            darkGradient: "from-cyan-500 to-purple-500"
        },
        {
            icon: "⚙️",
            title: "Event Coordination",
            description: "Our expert coordinators manage lighting, decor, catering, sound systems, and entertainment to deliver smooth and memorable events.",
            features: [
                "Lighting & decor design",
                "Event styling",
                "Catering services",
                "Sound & AV setup"
            ],
            lightGradient: "from-red-500 to-rose-500",
            darkGradient: "from-purple-600 to-pink-600"
        },
        {
            icon: "📢",
            title: "Brand Activation & Promotion",
            description: "We create engaging brand activations through mall promotions, roadshows, in-shop campaigns, and corporate marketing events across Bangladesh.",
            features: [
                "Mall promotions",
                "Roadshows & campaigns",
                "In-shop promotions",
                "Corporate marketing events"
            ],
            lightGradient: "from-rose-500 to-red-600",
            darkGradient: "from-pink-600 to-indigo-600"
        },
        {
            icon: "🏗️",
            title: "Trade Show & Exhibition Organizer",
            description: "We organize professional trade shows and exhibitions with detailed planning, venue sourcing, guest coordination, and complete audiovisual management to ensure impactful and well-organized events.",
            features: [
                "Exhibition planning",
                "Booth & venue setup",
                "Guest & speaker management",
                "AV & logistics support"
            ],
            lightGradient: "from-orange-500 to-red-500",
            darkGradient: "from-cyan-500 to-purple-500"
        },
        {
            icon: "🎨",
            title: "Exhibition Stall Design & Construction",
            description: "We design and construct creative exhibition stalls with modern lighting, decor, and branding elements that attract visitors and effectively showcase your products and services.",
            features: [
                "Custom stall design",
                "Booth construction",
                "Lighting & decor setup",
                "Branding & display setup"
            ],
            lightGradient: "from-red-500 to-rose-500",
            darkGradient: "from-purple-600 to-pink-600"
        },
        {
            icon: "🛋️",
            title: "Furniture & Event Logistic Rental",
            description: "We provide event furniture and logistic rental services including stage setup, seating arrangements, transportation, and essential equipment for smooth and successful events.",
            features: [
                "Stage & seating setup",
                "Event furniture rental",
                "Transport & logistics",
                "Equipment support"
            ],
            lightGradient: "from-rose-500 to-red-600",
            darkGradient: "from-pink-600 to-indigo-600"
        },
        {
            icon: "🎤",
            title: "Singer & Celebrity Booking",
            description: "We provide professional singer and celebrity booking services for concerts, corporate events, weddings, and brand activations. From Bangladeshi artists to international celebrities, our team manages booking, coordination, and security to deliver a seamless star-powered experience.",
            features: [
                "Singer & artist booking",
                "Celebrity management",
                "Event performance coordination",
                "Security & logistics support"
            ],
            lightGradient: "from-orange-500 to-red-500",
            darkGradient: "from-cyan-500 to-purple-500"
        },
        {
            icon: "📺",
            title: "Advertising",
            description: "We offer creative and result-driven advertising solutions including digital, print, outdoor, TV, radio, and social media campaigns. Our strategic approach helps brands increase visibility, strengthen reputation, and reach the right audience.",
            features: [
                "Digital advertising",
                "Social media campaigns",
                "Print & outdoor ads",
                "Brand promotion strategy"
            ],
            lightGradient: "from-red-500 to-rose-500",
            darkGradient: "from-purple-600 to-pink-600"
        },
        {
            icon: "💍",
            title: "Wedding Planner & Management",
            description: "We plan and manage elegant weddings with complete services including venue selection, décor, catering, photography, entertainment, and guest management to create a seamless and memorable celebration.",
            features: [
                "Venue & theme planning",
                "Stage & decor design",
                "Catering & entertainment",
                "Guest & event coordination"
            ],
            lightGradient: "from-rose-500 to-red-600",
            darkGradient: "from-pink-600 to-indigo-600"
        }
    ];

    return (
        <section className="py-20 bg-base-100 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-10 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 left-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl animate-pulse-gentle"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <div className="badge badge-primary badge-lg mb-4">
                        <span className="mr-2">✨</span>
                        <span>Our Services</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-playfair font-bold text-base-content mb-6">
                        Premium Event 
                        <span className="block text-primary animate-gradient bg-clip-text text-transparent mt-2">
                            Planning Services
                        </span>
                    </h2>
                    
                    <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
                        Creating exceptional experiences that exceed expectations and leave lasting memories
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
                    {services.map((service, index) => (
                        <div 
                            key={index}
                            className="group animate-fade-in"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            {/* Service Card */}
                            <div className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-500 border border-base-300 h-full">
                                <div className="card-body p-6">
                                    {/* Icon and Badge Container */}
                                    <div className="flex items-center justify-between mb-4">
                                        {/* Theme-aware Icon */}
                                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl text-white transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                                            <div className={`w-full h-full bg-gradient-to-br ${service.lightGradient} dark:${service.darkGradient.replace('from-', 'dark:from-').replace('to-', 'dark:to-')} rounded-2xl flex items-center justify-center`}>
                                                {service.icon}
                                            </div>
                                        </div>
                                        
                                        <div className="text-right">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className={`badge bg-gradient-to-r ${service.lightGradient} dark:${service.darkGradient.replace('from-', 'dark:from-').replace('to-', 'dark:to-')} text-white border-none text-xs`}>
                                                    Premium
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="card-title text-lg font-playfair font-bold text-base-content mb-3 group-hover:text-primary transition-colors duration-300 leading-tight">
                                        {service.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-base-content/70 mb-4 text-xs leading-relaxed">
                                        {service.description}
                                    </p>

                                    {/* Features */}
                                    <div className="space-y-2 mb-4">
                                        {service.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center text-xs text-base-content/60 group-hover:text-base-content/80 transition-colors duration-300">
                                                <div className="w-1.5 h-1.5 rounded-full mr-2 transform scale-0 group-hover:scale-100 transition-transform duration-300" 
                                                     style={{
                                                         transitionDelay: `${idx * 100}ms`,
                                                         background: `var(--color-primary)`
                                                     }}>
                                                </div>
                                                <span className="transform translate-x-1 group-hover:translate-x-0 transition-transform duration-300">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA Button */}
                                    {/* <div className="card-actions justify-end mt-auto">
                                        <button className="btn btn-primary btn-sm hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg">
                                            Learn More
                                        </button>
                                    </div> */}
                                </div>

                                {/* Theme-aware Hover Border Effect */}
                                <div className="absolute inset-0 rounded-2xl border-2 border-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                                     style={{
                                         background: `linear-gradient(to right, var(--color-primary), var(--color-secondary))`
                                     }}>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats Section */}
                <div className="mb-16 animate-fade-in">
                    <div className="stats stats-vertical lg:stats-horizontal shadow w-full bg-base-200/50 backdrop-blur-sm">
                        <div className="stat">
                            <div className="stat-figure text-primary">
                                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">🎯</span>
                                </div>
                            </div>
                            <div className="stat-title text-base-content/70">Total Services</div>
                            <div className="stat-value text-primary">12+</div>
                            <div className="stat-desc text-base-content/60">Specialized Categories</div>
                        </div>

                        <div className="stat">
                            <div className="stat-figure text-secondary">
                                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">⭐</span>
                                </div>
                            </div>
                            <div className="stat-title text-base-content/70">Client Rating</div>
                            <div className="stat-value text-secondary">4.9/5</div>
                            <div className="stat-desc text-base-content/60">Average Satisfaction</div>
                        </div>

                        <div className="stat">
                            <div className="stat-figure text-accent">
                                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">🏆</span>
                                </div>
                            </div>
                            <div className="stat-title text-base-content/70">Success Rate</div>
                            <div className="stat-value text-accent">100%</div>
                            <div className="stat-desc text-base-content/60">Event Completion</div>
                        </div>

                        <div className="stat">
                            <div className="stat-figure text-info">
                                <div className="w-12 h-12 bg-info/20 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">💎</span>
                                </div>
                            </div>
                            <div className="stat-title text-base-content/70">Premium Quality</div>
                            <div className="stat-value text-info">A+</div>
                            <div className="stat-desc text-base-content/60">Service Grade</div>
                        </div>
                    </div>
                </div>

              
            </div>
        </section>
    );
};

export default Services;