import React from 'react';

const Maps = () => {
    return (
        <div>
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
        </div>
    );
};

export default Maps;