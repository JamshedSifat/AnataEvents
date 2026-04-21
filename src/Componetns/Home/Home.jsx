import React, { useState } from 'react';

import WhyChooseUs from '../WhyChooseUs/WhyChooseUs';

import Hero from '../Hero/Hero';
import Navbar from '../Navbar/Navbar';
import Gallary from '../Gallary/Gallary';
import EventCoverage from '../EventCoverage/EventCoverage';

import Testimonials from '../Testimonials/Testimonials';
import OurClients from '../OurClients/OurClients';
import QueryModal from '../QueryModal/QueryModal'; // import modal
import Services from '../Services/Services';

import MediaGallery from '../../Pages/Media/MediaGellary/MediaGellary';
import HomeFAQ from '../FAQ/HomeFAQ';
import PostCard from '../../Pages/BlogItems/PostCard';
import RecentBlogPosts from '../../Pages/BlogItems/RecentBlogPost';


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
                {/* <Gallary /> */}
                <MediaGallery></MediaGallery>
                <Testimonials />
                <OurClients />
                <EventCoverage />
               
                <div className="bg-white p-8">
                    <div className=" my-8 max-w-7xl mx-auto">
                    <div className=" ">
                        <h1 className="text-5xl text-center py-6 font-bold">Our <span className="text-primary">Blogs</span></h1>
                        <p className="text-gray-600 text-center text-xl">Stay updated with the latest event management tips, trends, and insights</p>
                    </div>
                    <RecentBlogPosts limit={6} columns={3} className="max-w-7xl mx-auto"></RecentBlogPosts>
                </div>
                </div>
                
                <HomeFAQ />
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