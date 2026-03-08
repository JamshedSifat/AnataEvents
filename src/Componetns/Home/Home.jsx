import React from 'react';

import WhyChooseUs from '../WhyChooseUs/WhyChooseUs';
import Services from '../Services.jsx/Services';
import Hero from '../Hero/Hero';
import Navbar from '../Navbar/Navbar';
import Gallary from '../Gallary/Gallary';
import EventCoverage from '../EventCoverage/EventCoverage';
import FAQ from '../FAQ/FAQ';


const Home = () => {
    return (
        <div className="flex flex-col min-h-screen ">
            {/* Fixed Navbar */}
            <div className="sticky top-0 z-50">
                <Navbar />
            </div>
            
            {/* Main Content */}
            <main className="flex-1">
                <Hero/>
                <WhyChooseUs />
                <Services />
                <Gallary></Gallary>
                <EventCoverage></EventCoverage>
                <FAQ></FAQ>
            </main>
        </div>
    );
};

export default Home;