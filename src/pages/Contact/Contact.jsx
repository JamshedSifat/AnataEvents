import React, { useState } from 'react';
import SocialMedia from '../../components/Contacts/SocialMedia';
import Maps from '../../components/Contacts/Maps';
import ContactCard from '../../components/Contacts/ContactCard';
import ContactForm from '../../components/Contacts/ContactForm';


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
                    
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-gray-800 mb-6 ">
                        Let's Create Something
                        <br />
                        <span className="text-primary">
                            Extraordinary
                        </span>
                    </h1>
                    
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Ready to plan your dream event? Get in touch with our expert team for a personalized consultation 
                        and let's bring your vision to life.
                    </p>
                </div>

                <ContactCard></ContactCard>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    
                    {/* Contact Form */}
                    <ContactForm></ContactForm>

                    {/* Right Side Content */}
                    <div className="space-y-8">

                      {/* Enhanced Map with Your Location */}
                       <Maps></Maps>

                        {/* Social Media Icons */}
                      <SocialMedia></SocialMedia>

                      
                        
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;