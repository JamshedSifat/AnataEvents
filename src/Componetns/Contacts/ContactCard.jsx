import React from 'react';

const ContactCard = () => {
       const contactInfo = [
        {
            icon: "📍",
            title: "Visit Our Office",
            details: ["Level-7, Suite-2, A K Complex ", "19 Green Road,Dhanmondi", "Dhaka-1205,Bangladesh"],
            color: "from-red-500 to-pink-500"
        },
        {
            icon: "📞",
            title: "Call Us Today",
            details: ["+880 1813340400", "+880 1613340400", "24/7 Emergency Line"],
            color: "from-pink-500 to-orange-400"
        },
        {
            icon: "✉️",
            title: "Email Us",
            details: ["anantaevents@gmail.com", "mark@anantaexpo.com"],
            color: "from-orange-400 to-amber-400"
        },
        {
            icon: "🕒",
            title: "Business Hours",
            details: ["Mon-Fri: 9AM-6PM", "Saturday: 10AM-4PM"],
            color: "from-amber-400 to-red-500"
        }
    ];
    
    return (
        <div>
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
        </div>
    );
};

export default ContactCard;