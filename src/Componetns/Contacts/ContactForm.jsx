import React from 'react';
import { useState } from 'react';

const ContactForm = () => {
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
        <div>
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

        </div>
    );
};

export default ContactForm;