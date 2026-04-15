import React from 'react';
import { FaFacebookSquare, FaLinkedin, FaPinterest } from 'react-icons/fa';
import { FaSquareXTwitter } from 'react-icons/fa6';

const SocialMedia = () => {
    const socialLinks = [
        { 
            name: "Twiter", 
            icon: <FaSquareXTwitter />, 
            color: 'from-pink-500 to-red-500',
            url: 'https://x.com/AnantaEventsbd' 
        },
        { 
            name: "Facebook", 
            icon: <FaFacebookSquare />, 
            color: 'from-blue-500 to-blue-600',
            url: 'https://www.facebook.com/Ananta.bd2/' 
        },
        { 
            name: 'Pinterest', 
            icon: <FaPinterest />, 
            color: 'from-red-500 to-red-600',
            url: 'https://www.pinterest.com/anantabd/'
        },
        { 
            name: 'LinkedIn', 
            icon: <FaLinkedin/>, 
            color: 'from-blue-600 to-blue-700',
            url: 'https://www.linkedin.com/company/ananta-events-bangladesh/' 
        }
    ];

    return (
        <div>
            {/* Social Media */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <h4 className="text-xl font-bold text-gray-800 mb-6 text-center">
                    Follow Our Journey
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    {socialLinks.map((social) => (
                        <a
                            key={social.name}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`bg-gradient-to-r ${social.color} hover:scale-105 text-white p-4 rounded-xl transition-all duration-300 flex flex-col items-center space-y-2`}
                        >
                            <span className="text-2xl">{social.icon}</span>
                            <span className="text-sm font-medium">{social.name}</span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SocialMedia;