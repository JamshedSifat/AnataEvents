import React, { useState, useEffect } from 'react';


const About = () => {
    // Create state to store data
    const [data, setData] = useState({
        stats: [],
        team: [],
        values: []
    });

    // State to track if data is loading
    const [loading, setLoading] = useState(true);

    // State to store error messages
    const [error, setError] = useState(null);

    // useEffect runs when component loads
    useEffect(() => {
        // Create function to fetch data
        const fetchAboutData = async () => {
            try {
                // Fetch the JSON file from public folder
                const response = await fetch('../../../public/About/About.json');

                // Check if fetch was successful
                if (!response.ok) {
                    throw new Error('Failed to load data');
                }

                // Convert response to JSON
                const jsonData = await response.json();

                // Update state with fetched data
                setData(jsonData);

                // Clear any errors
                setError(null);

            } catch (err) {
                // If error occurs, store error message
                console.log('Error:', err.message);
                setError(err.message);
            } finally {
                // Stop loading regardless of success or error
                setLoading(false);
            }
        };

        // Call the fetch function
        fetchAboutData();

    }, []); // Empty array means run only once when component loads

    // Show loading message while fetching
    if (loading) {
        return (
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-gray-600">Loading data...</p>
                </div>
            </section>
        );
    }

    // Show error message if something went wrong
    if (error) {
        return (
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-red-600">Error: {error}</p>
                </div>
            </section>
        );
    }

    // Main component JSX
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

                {/* Main Content Grid */}
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
                            <button className="bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-700 hover:to-pink-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                                Our Portfolio
                            </button>
                            <button className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300">
                                Meet the Team
                            </button>
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

                {/* Statistics Section */}
                <div className="bg-gradient-to-r from-primary to-pink-600 rounded-3xl p-8 md:p-12 text-white mb-20 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}></div>
                    </div>

                    <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        {/* Loop through stats array and display each one */}
                        {data.stats.map((stat, index) => (
                            <div key={index} className="space-y-3">
                                <div className="text-3xl mb-2">{stat.icon}</div>
                                <div className="text-4xl md:text-5xl font-bold">
                                    {stat.number}
                                </div>
                                <div className="text-white/90 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


<div className="my-20 flex flex-col items-center justify-center text-center mx-auto max-w-3xl px-4">
    <h1 className="text-3xl md:text-4xl font-bold mb-4 ">
        Our <span className='text-primary'>Commitment</span>
    </h1>

    <p className="text-gray-600 text-base md:text-lg leading-relaxed">
        Our goal is to deliver <strong>visually striking, memorable, and impactful events</strong> 
        that leave a lasting impression. Every project is handled with 
        <strong> delicacy, professionalism, and passion,</strong> because your satisfaction 
        is the true measure of our success.
    </p>
</div>
               

                {/* Team Section */}
                <div>
                    <div className="text-center mb-12">
                        <h3 className="text-3xl md:text-4xl font-playfair font-bold text-gray-800 mb-4">
                            Meet Our 
                            <span className="bg-gradient-to-r from-red-600 to-pink-500 bg-clip-text text-transparent"> Expert </span>
                            Team
                        </h3>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Passionate professionals dedicated to making your dreams come true
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Loop through team array */}
                        {data.team.map((member, index) => (
                            <div key={index} className="text-center group">
                                <div className="relative mb-6 inline-block">
                                    <img 
                                        src={member.image}
                                        alt={member.name}
                                        className="w-48 h-48 mx-auto rounded-2xl object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <h4 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h4>
                                <p className="text-red-600 font-medium mb-3">{member.role}</p>
                                {/* <p className="text-gray-600 text-sm">{member.description}</p> */}
                            </div>
                        ))}
                    </div>
                </div>

                 {/* Our Values Section */}
                <div className="my-20">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl md:text-4xl font-playfair font-bold text-gray-800 mb-4">
                            Our <span className='text-primary'>Core Values</span>
                        </h3>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            The principles that guide everything we do and every celebration we create
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Loop through values array */}
                        {data.values.map((value, index) => (
                            <div key={index} className="text-center group">
                                <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-2xl">{value.icon}</span>
                                </div>
                                <h4 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-red-600 transition-colors duration-300">
                                    {value.title}
                                </h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

             

              
            </div>
        </section>
    );
};

export default About;