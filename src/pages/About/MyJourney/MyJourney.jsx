import React from 'react';
import { Link } from 'react-router';


const MyJourney = () => {
    return (
        <div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
                    
                    {/* Left Content */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-3xl font-playfair font-bold text-primary mb-4">
                                Our Story
                            </h3>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Ananta Events & Entertainment is one of the <strong>top event management companies in Bangladesh,</strong> proudly serving clients since 2009. With <strong>15+ years of proven experience,</strong> we have built a strong reputation as a reliable, creative, and result-driven event planner in Bangladesh, delivering flawless events across the country.

From concept development to final execution, <strong>we specialize in creating high-impact corporate events, exhibitions, conferences, brand activations, concerts, and domestic celebrations, ensuring every project reflects precision, creativity, and professionalism.</strong>

There is no boundary for us to organize events anywhere in Bangladesh—we operate nationwide with confidence and consistency.
                            </p>
                        
                        </div>

                        <div>
                            <h3 className="text-3xl font-playfair font-bold text-primary mb-4">
                                Our Journey & Experience
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                              <strong> Founded in 2009, </strong> Ananta Events & Entertainment has grown from a passionate event startup into a <strong>full-service event management and exhibition solutions company. Over the years, we have successfully delivered hundreds of events, </strong>working with <strong>corporate brands, development organizations, government entities, and international partners.</strong>

Our <strong>15+ years of hands-on experience</strong> allow us to anticipate challenges, manage complex logistics, and deliver events that exceed expectations—on time and within budget.
                            </p>
                        </div>

                      <div className="flex flex-col sm:flex-row gap-4">
  
  <Link
    to="/portfolio"
    className="bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-700 hover:to-pink-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
  >
    Portfolio
  </Link>

  <Link
      
    className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
  >
    Meet the Team
  </Link>

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
        </div>
    );
};

export default MyJourney;