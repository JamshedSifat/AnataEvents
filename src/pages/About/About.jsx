import React, { useState, useEffect } from 'react';
import MyJourney from './MyJourney/MyJourney';
import Commitment from './Commitment/Commitment';
import MyTeam from './MyTeam/MyTeam';
import StatisticsItems from './StatisticsItems/StatisticsItems';
import CoreValues from './CoreValues/CoreValues';


const About = () => {
   
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
                        <span className="text-primary">
                            Extraordinary Moments
                        </span>
                    </h2>
                    
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        For over 15 years, we've been transforming dreams into reality, creating unforgettable experiences 
                        that celebrate life's most precious moments.
                    </p>
                </div>

                {/* My Journey */}
               <MyJourney></MyJourney>

                {/* Statistics Section */}
                <StatisticsItems></StatisticsItems>


                {/* Commitment */}
               <Commitment></Commitment>

                {/* Team Section */}
               <MyTeam></MyTeam>

                 {/* Our Values Section */}
                <CoreValues></CoreValues>

             

              
            </div>
        </section>
    );
};

export default About;