import React from 'react';
import { NavLink } from 'react-router';
import { FaFacebook ,FaLinkedin,FaPinterestP, } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import logo from '../../assets/Ananta_Logo.png'
const Footer = () => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Services', path: '/services' },
        { name: 'Portfolio', path: '/portfolio' },
        { name: 'Contact', path: '/contact' }
    ];

    const services = [
        'Event Management',
        'Corporate Event Management', 
        'Concert & Fashion Show Organizer',
        'Event Coordination',
        'Brand Activation & Promotion',
        'Trade Show & Exhibition Organizer',
        'Exhibition Stall Design & Construction',
        'Furniture & Event Logistic Rental',
        'Singer & Celebrity Booking',
    ];

    const contactInfo = [
        { icon: '📍', text: 'Ananta Events And Entertainment, 19 Green Road, Dhaka 1205' },
        { icon: '📞', text: '+880 1813340400' },
        { icon: '📞', text: '+880 1613340400' },
        { icon: '✉️', text: 'anantaevents@gmail.com' },
        
    ];

    const socialLinks = [
        { name: 'Facebook', icon: <FaFacebook />, url: 'https://www.facebook.com/Ananta.bd2/' },
        { name: 'Instagram', icon: <FaXTwitter />, url: 'https://x.com/AnantaEventsbd' },
        { name: 'Pinterest', icon: <FaPinterestP />, url: 'https://www.pinterest.com/anantabd/' },
        { name: 'LinkedIn', icon: <FaLinkedin />, url: 'https://www.linkedin.com/company/ananta-events-bangladesh/' }
    ];

    return (
        <footer className="bg-base-300 text-base-content relative overflow-hidden transition-all duration-300">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dc2626' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    
                    {/* Company Info */}
                    <div className="lg:col-span-1">
                        <div className="mb-6">
                            <NavLink to="/" className="text-3xl font-bold font-playfair">
                                <img
                                  src={logo}
                                  alt="Ananta Logo"
                                  className="w-32 h-auto object-contain transition-transform duration-300 hover:scale-105 cursor-pointer"
                                />
                            </NavLink>
                            <p className="text-xs text-base-content/60 mt-1 tracking-wider uppercase">
                                Luxury Experience
                            </p>
                        </div>
                        
                        <p className="text-base-content/80 leading-relaxed mb-6 text-sm">
                            Creating extraordinary experiences that leave lasting impressions. 
                            From intimate gatherings to grand celebrations.
                        </p>
                        
                        {/* Social Links */}
                        <div className="flex space-x-4">
                            {socialLinks.map((social, index) => (
                                <a 
                                    key={index}
                                    href={social.url}
                                    target='_blank'
                                    className="btn btn-circle btn-sm bg-primary text-white border-none transition-all duration-300 transform hover:scale-110"
                                >
                                    <span className="text-lg">
                                        {social.icon}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-base-content">
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <NavLink 
                                        to={link.path}
                                        className="font-semibold text-base-content/70 hover:text-primary transition-colors duration-300 text-sm flex items-center group"
                                    >
                                        <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                                        {link.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-base-content">
                            Our Services
                        </h3>
                        <ul className="space-y-3">
                            {services.map((service, index) => (
                                <li key={index}>
                                    <a 
                                        href="#" 
                                        className="font-semibold text-base-content/70 hover:text-primary transition-colors duration-300 text-sm flex items-center  group"
                                    >
                                        
                                        {service}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-base-content">
                            Get in Touch
                        </h3>
                        <div className="space-y-4 mb-6">
                            {contactInfo.map((info, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                    <span className="text-lg">{info.icon}</span>
                                    <span className="text-base-content/80 text-sm leading-relaxed">
                                        {info.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                        
                        {/* Newsletter */}
                        <div>
                            <h4 className="font-semibold mb-3 text-base-content text-sm">
                                Stay Updated
                            </h4>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="input input-sm flex-1 bg-base-200 border-none text-base-content placeholder-base-content/50 focus:ring-2 focus:ring-primary"
                                />
                                <button className="btn btn-primary btn-sm">
                                    ✉️
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="border-t border-base-content/20 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-base-content/60 text-sm">
                            © {currentYear} Ananta Events. All rights reserved.
                        </p>
                        <div className="flex space-x-6 text-sm">
                            <a href="#" className="text-base-content/60 hover:text-primary transition-colors duration-300">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-base-content/60 hover:text-primary transition-colors duration-300">
                                Terms of Service
                            </a>
                            <a href="#" className="text-base-content/60 hover:text-primary transition-colors duration-300">
                                Cookie Policy
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;