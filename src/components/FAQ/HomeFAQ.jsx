// File: src/Components/HomeFAQ.jsx (For Home Page)
import React, { useState, useEffect } from "react";

const HomeFAQ = () => {
  const [faqData, setFaqData] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFAQs();
    
    // ✅ Listen for storage changes (real-time updates)
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleStorageChange = (e) => {
    if (e.key === 'homeFAQs') {
      loadFAQs();
    }
  };

  const loadFAQs = () => {
    try {
      setLoading(true);
      
      // Load Home FAQs from localStorage
      const savedFAQs = localStorage.getItem('homeFAQs');
      
      if (savedFAQs) {
        const data = JSON.parse(savedFAQs);
        setFaqData(data);
      } else {
        // Fallback to default data
        const defaultData = [
          {
            _id: 'home-faq-1',
            question: "What is Ananta Events & Entertainment?",
            answer: "Ananta Events & Entertainment is a leading event management company in Bangladesh specializing in creating memorable experiences for corporate, social, and cultural events."
          },
         
        ];
        
        setFaqData(defaultData);
        localStorage.setItem('homeFAQs', JSON.stringify(defaultData));
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading FAQs:', error);
      setLoading(false);
    }
  };

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
          Frequently Asked <span className="text-primary">Questions</span>
        </h2>

        {faqData.length > 0 ? (
          <div className="space-y-5">
            {faqData.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={faq._id || index}
                  className={`rounded-2xl overflow-hidden transition-all duration-500 shadow-md 
                    ${isOpen ? "bg-primary text-white shadow-xl" : "bg-white text-gray-800 hover:shadow-xl"}`}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex justify-between items-center px-6 py-5 text-left focus:outline-none group"
                  >
                    <span
                      className={`font-semibold text-lg transition-colors duration-300 ${
                        isOpen ? "text-white" : "text-gray-800 group-hover:text-primary"
                      }`}
                    >
                      {faq.question}
                    </span>
                    <span
                      className={`transform transition-transform duration-300 text-2xl flex-shrink-0 ml-4 ${
                        isOpen ? "text-white" : "text-primary"
                      }`}
                      style={{ rotate: isOpen ? "45deg" : "0deg" }}
                    >
                      +
                    </span>
                  </button>

                  <div
                    className="px-6 leading-relaxed overflow-hidden transition-all duration-500"
                    style={{
                      maxHeight: isOpen ? "500px" : "0",
                    }}
                  >
                    <p className="py-4">{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">No FAQs available</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeFAQ;