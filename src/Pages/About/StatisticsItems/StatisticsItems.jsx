import React, { useEffect, useState } from 'react';

const StatisticsItems = () => {
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
        </div>
    );
};

export default StatisticsItems;