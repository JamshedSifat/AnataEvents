import React, { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        eventType: '',
        eventDate: '',
        guests: '',
        budget: '',
        venue: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted:', formData);
    };

    const contactInfo = [
        {
            icon: "📍",
            title: "Visit Our Office",
            details: ["123 Luxury Lane", "Premium District", "City 12345"],
            color: "from-red-500 to-pink-500"
        },
        {
            icon: "📞",
            title: "Call Us Today",
            details: ["+1 (555) 123-4567", "+1 (555) 987-6543", "24/7 Emergency Line"],
            color: "from-pink-500 to-orange-400"
        },
        {
            icon: "✉️",
            title: "Email Us",
            details: ["hello@anantaevents.com", "info@anantaevents.com", "support@anantaevents.com"],
            color: "from-orange-400 to-amber-400"
        },
        {
            icon: "🕒",
            title: "Business Hours",
            details: ["Mon-Fri: 9AM-6PM", "Saturday: 10AM-4PM", "Sunday: By Appointment"],
            color: "from-amber-400 to-red-500"
        }
    ];

    const eventTypes = [
        "Wedding", "Corporate Event", "Birthday Party", "Anniversary", 
        "Gala/Fundraiser", "Baby Shower", "Graduation", "Other"
    ];

    const budgetRanges = [
        "Under $5,000", "$5,000 - $15,000", "$15,000 - $30,000", 
        "$30,000 - $50,000", "$50,000 - $100,000", "Above $100,000"
    ];

    const venueTypes = [
        "Indoor", "Outdoor", "Hotel/Banquet Hall", "Private Residence", 
        "Beach/Waterfront", "Garden/Park", "Historic Venue", "Need Suggestions"
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-20 right-10 w-40 h-40 bg-red-100 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute bottom-32 left-10 w-64 h-64 bg-pink-100 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-25"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-100 to-pink-100 rounded-full text-red-600 text-sm font-medium mb-4">
                        <span className="mr-2">💬</span>
                        <span>Let's Plan Together</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-gray-800 mb-6">
                        Let's Create Something
                        <span className="block bg-gradient-to-r from-red-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                            Extraordinary
                        </span>
                    </h1>
                    
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Ready to plan your dream event? Get in touch with our expert team for a personalized consultation 
                        and let's bring your vision to life.
                    </p>
                </div>

                {/* Contact Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {contactInfo.map((info, index) => (
                        <div key={index} className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                            <div className={`w-14 h-14 bg-gradient-to-r ${info.color} rounded-2xl flex items-center justify-center text-2xl text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                {info.icon}
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-red-600 transition-colors duration-300">
                                {info.title}
                            </h3>
                            <div className="space-y-1">
                                {info.details.map((detail, idx) => (
                                    <p key={idx} className="text-gray-600 text-sm">
                                        {detail}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    
                    {/* Contact Form */}
                    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100">
                        <div className="mb-8">
                            <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-3">
                                Get Your Free Consultation
                            </h2>
                            <p className="text-gray-600">
                                Tell us about your dream event and we'll create a personalized proposal just for you.
                            </p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                                        placeholder="Your full name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                                        placeholder="your.email@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Event Type *
                                    </label>
                                    <select
                                        name="eventType"
                                        value={formData.eventType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                                        required
                                    >
                                        <option value="">Select event type</option>
                                        {eventTypes.map((type) => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Event Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Event Date
                                    </label>
                                    <input
                                        type="date"
                                        name="eventDate"
                                        value={formData.eventDate}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Expected Guests
                                    </label>
                                    <input
                                        type="number"
                                        name="guests"
                                        value={formData.guests}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                                        placeholder="Number of guests"
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Budget Range
                                    </label>
                                    <select
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                                    >
                                        <option value="">Select budget range</option>
                                        {budgetRanges.map((range) => (
                                            <option key={range} value={range}>{range}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Venue Preference
                                    </label>
                                    <select
                                        name="venue"
                                        value={formData.venue}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                                    >
                                        <option value="">Select venue type</option>
                                        {venueTypes.map((type) => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Tell us about your vision
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="5"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white resize-none"
                                    placeholder="Describe your dream event, special requirements, themes, or any other details you'd like to share..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-700 hover:to-pink-600 text-white py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl flex items-center justify-center space-x-2"
                            >
                                <span>Send My Request</span>
                                <span className="text-xl">✨</span>
                            </button>

                            <p className="text-sm text-gray-500 text-center">
                                We'll respond within 24 hours with a personalized proposal
                            </p>
                        </form>
                    </div>

                    {/* Right Side Content */}
                    <div className="space-y-8">
                        
                        {/* Why Choose Us Card */}
                        <div className="bg-gradient-to-br from-red-600 via-pink-500 to-orange-400 rounded-3xl p-8 text-white relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                }}></div>
                            </div>
                            
                            <div className="relative">
                                <h3 className="text-2xl font-playfair font-bold mb-6">
                                    Why Choose Ananta Events?
                                </h3>
                                
                                <div className="space-y-4">
                                    {[
                                        "🎭 15+ Years of Experience",
                                        "⭐ 500+ Successful Events",
                                        "💎 Award-Winning Designs",
                                        "🤝 24/7 Support & Guidance",
                                        "📞 Free Initial Consultation",
                                        "✨ 100% Satisfaction Guarantee"
                                    ].map((feature, index) => (
                                        <div key={index} className="flex items-center space-x-3">
                                            <span className="text-lg">{feature.split(' ')[0]}</span>
                                            <span className="text-white/90">{feature.substring(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                      {/* Enhanced Map with Your Location */}
<div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
    <div className="bg-gradient-to-r from-red-600 to-pink-500 text-white p-6">
        <h4 className="text-xl font-bold flex items-center">
            <span className="mr-3">📍</span>
            Visit Ananta Events Studio
        </h4>
        <p className="text-white/90 text-sm mt-1">
            Professional event planning consultations available
        </p>
    </div>
    
    <div className="h-64 relative">
        <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14608.4!2d90.3846194!3d23.7435484!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c46dd7d00001%3A0xb237a30c259afe2f!2sAnanta%20Events%20And%20Entertainment!5e0!3m2!1sen!2sbd!4v1650000000000!5m2!1sen!2sbd"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ananta Events And Entertainment - Green Road, Dhaka"
        />
    </div>
    
    <div className="p-6 bg-gradient-to-r from-gray-50 to-red-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <h5 className="font-bold text-gray-800 mb-2">📍 Our Address</h5>
                <p className="text-gray-700 font-medium">Ananta Events And Entertainment</p>
                <p className="text-gray-600 text-sm">19 Green Road</p>
                <p className="text-gray-600 text-sm">Dhaka 1205, Bangladesh</p>
            </div>
            <div className="flex flex-col space-y-2">
                <a 
                    href="https://www.google.com/maps/dir//Ananta+Events+And+Entertainment,+19+Green+Rd,+Dhaka+1205/@23.7435484,90.3846194"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 text-center"
                >
                    🗺️ Get Directions
                </a>
                <a 
                    href="tel:+8801XXXXXXXXX"
                    className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 text-center"
                >
                    📞 Call Now
                </a>
            </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600">
                    <span className="mr-2">🕒</span>
                    <span>Mon-Fri: 9AM-6PM</span>
                </div>
                <div className="flex items-center text-gray-600">
                    <span className="mr-2">🏢</span>
                    <span>Free Consultation Available</span>
                </div>
            </div>
        </div>
    </div>
</div>

                        {/* Social Media */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                            <h4 className="text-xl font-bold text-gray-800 mb-6 text-center">
                                Follow Our Journey
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { name: 'Instagram', icon: '📸', color: 'from-pink-500 to-red-500' },
                                    { name: 'Facebook', icon: '📘', color: 'from-blue-500 to-blue-600' },
                                    { name: 'Pinterest', icon: '📌', color: 'from-red-500 to-red-600' },
                                    { name: 'LinkedIn', icon: '💼', color: 'from-blue-600 to-blue-700' }
                                ].map((social) => (
                                    <button 
                                        key={social.name}
                                        className={`bg-gradient-to-r ${social.color} hover:scale-105 text-white p-4 rounded-xl transition-all duration-300 flex flex-col items-center space-y-2`}
                                    >
                                        <span className="text-2xl">{social.icon}</span>
                                        <span className="text-sm font-medium">{social.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Emergency Contact */}
                        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-3xl p-6 border-2 border-amber-200">
                            <div className="text-center">
                                <div className="text-3xl mb-3">🚨</div>
                                <h4 className="font-bold text-gray-800 mb-2">
                                    Last-Minute Event?
                                </h4>
                                <p className="text-gray-600 text-sm mb-4">
                                    Need urgent planning assistance? We're here to help!
                                </p>
                                <button className="bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-700 hover:to-pink-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                                    Call Now: +1 (555) 123-4567
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;