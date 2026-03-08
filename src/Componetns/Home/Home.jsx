import React, { useState } from 'react';

import WhyChooseUs from '../WhyChooseUs/WhyChooseUs';

import Hero from '../Hero/Hero';
import Navbar from '../Navbar/Navbar';
import Gallary from '../Gallary/Gallary';
import EventCoverage from '../EventCoverage/EventCoverage';
import FAQ from '../FAQ/FAQ';
import Testimonials from '../Testimonials/Testimonials';
import OurClients from '../OurClients/OurClients';
import QueryModal from '../QueryModal/QueryModal'; // import modal
import Services from '../Services/Services';

const Home = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen">

            {/* Navbar */}
            <div className="sticky top-0 z-50">
                <Navbar />
            </div>

            {/* Floating Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-6 right-6 btn btn-primary btn-circle btn-lg z-40"
            >
                💬
            </button>

            {/* Main Content */}
            <main className="flex-1">
                <Hero />
                <WhyChooseUs />
                <Services                                                                                                                     />
                <Gallary />
                <Testimonials />
                <OurClients />
                <EventCoverage />
                <FAQ />
            </main>

            {/* Query Modal */}
            <QueryModal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
            />

        </div>
    );
};

export default Home;