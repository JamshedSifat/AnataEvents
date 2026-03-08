import React from 'react';

const About = () => {
    const stats = [
        { number: "500+", label: "Events Planned", icon: "🎭" },
        { number: "15+", label: "Years Experience", icon: "⏰" },
        { number: "98%", label: "Client Satisfaction", icon: "⭐" },
        { number: "50+", label: "Luxury Venues", icon: "🏛️" }
    ];

    const team = [
        {
            name: "Sarah Mitchell",
            role: "Creative Director",
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b1a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
            description: "15+ years in luxury event planning"
        },
        {
            name: "Michael Chen",
            role: "Event Coordinator",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            description: "Expert in corporate and gala events"
        },
        {
            name: "Elena Rodriguez",
            role: "Design Specialist",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=1061&q=80",
            description: "Award-winning event designer"
        }
    ];

    const values = [
        {
            icon: "💎",
            title: "Excellence",
            description: "We strive for perfection in every detail, ensuring your event exceeds expectations."
        },
        {
            icon: "🤝",
            title: "Trust",
            description: "Building lasting relationships through transparency, reliability, and exceptional service."
        },
        {
            icon: "✨",
            title: "Innovation",
            description: "Creative solutions and cutting-edge ideas that make your event truly unique."
        },
        {
            icon: "❤️",
            title: "Passion",
            description: "Every celebration is personal to us. Your joy is our greatest achievement."
        }
    ];

    return (
        <section className="py-20 bg-white relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-20 right-10 w-40 h-40 bg-red-100 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute bottom-32 left-10 w-32 h-32 bg-pink-100 rounded-full blur-3xl opacity-40"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-100 to-pink-100 rounded-full text-red-600 text-sm font-medium mb-4">
                        <span className="mr-2">🏆</span>
                        <span>About Ananta Events</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-gray-800 mb-6">
                        Crafting 
                        <span className="block bg-gradient-to-r from-red-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                            Extraordinary Moments
                        </span>
                    </h2>
                    
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        For over 15 years, we've been transforming dreams into reality, creating unforgettable experiences 
                        that celebrate life's most precious moments.
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
                    
                    {/* Left Content */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-3xl font-playfair font-bold text-gray-800 mb-4">
                                Our Story
                            </h3>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Founded in 2008 with a simple vision: every celebration should be as unique as the people 
                                it honors. What started as a small dream has grown into one of the region's most trusted 
                                luxury event planning companies.
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Our team of dedicated professionals brings together creativity, precision, and passion 
                                to transform your vision into an unforgettable experience that exceeds all expectations.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-3xl font-playfair font-bold text-gray-800 mb-4">
                                Our Mission
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                To create extraordinary celebrations that capture the essence of your special moments, 
                                delivered with impeccable attention to detail and unmatched personal service.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-700 hover:to-pink-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                                Our Portfolio
                            </button>
                            <button className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300">
                                Meet the Team
                            </button>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative">
                        <img 
                            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80"
                            alt="Luxury Event Setup"
                            className="rounded-2xl shadow-2xl w-full"
                        />
                        
                        {/* Floating Card */}
                        <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-pink-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">A</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800">Award Winning</h4>
                                    <p className="text-sm text-gray-600">Event Planning</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="bg-gradient-to-r from-red-600 via-pink-500 to-orange-400 rounded-3xl p-8 md:p-12 text-white mb-20 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}></div>
                    </div>

                    <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        {stats.map((stat, index) => (
                            <div key={index} className="space-y-3">
                                <div className="text-3xl mb-2">{stat.icon}</div>
                                <div className="text-4xl md:text-5xl font-bold">
                                    {stat.number}
                                </div>
                                <div className="text-white/90 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Our Values */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl md:text-4xl font-playfair font-bold text-gray-800 mb-4">
                            Our Core Values
                        </h3>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            The principles that guide everything we do and every celebration we create
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="text-center group">
                                <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-2xl">{value.icon}</span>
                                </div>
                                <h4 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-red-600 transition-colors duration-300">
                                    {value.title}
                                </h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team */}
                <div>
                    <div className="text-center mb-12">
                        <h3 className="text-3xl md:text-4xl font-playfair font-bold text-gray-800 mb-4">
                            Meet Our 
                            <span className="bg-gradient-to-r from-red-600 to-pink-500 bg-clip-text text-transparent"> Expert </span>
                            Team
                        </h3>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Passionate professionals dedicated to making your dreams come true
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {team.map((member, index) => (
                            <div key={index} className="text-center group">
                                <div className="relative mb-6 inline-block">
                                    <img 
                                        src={member.image}
                                        alt={member.name}
                                        className="w-48 h-48 mx-auto rounded-2xl object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <h4 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h4>
                                <p className="text-red-600 font-medium mb-3">{member.role}</p>
                                <p className="text-gray-600 text-sm">{member.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center mt-20">
                    <div className="bg-gradient-to-r from-gray-50 to-red-50 rounded-3xl p-8 md:p-12">
                        <h3 className="text-3xl md:text-4xl font-playfair font-bold text-gray-800 mb-4">
                            Ready to Create Magic Together?
                        </h3>
                        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                            Let's discuss your vision and create an extraordinary experience that you and your guests will cherish forever.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-700 hover:to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                                Start Planning Today
                            </button>
                            <button className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300">
                                Schedule Consultation
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;