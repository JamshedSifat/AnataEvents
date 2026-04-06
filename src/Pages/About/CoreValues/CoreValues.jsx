import React, { useEffect, useState } from 'react';

const CoreValues = () => {
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

    return (
        <div>
            <div className="">
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
    );
};

export default CoreValues;