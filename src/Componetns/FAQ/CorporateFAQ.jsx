// File: src/Components/FAQ.jsx (Updated - Corporate FAQ for Frontend)
import React, { useState, useEffect } from "react";
import { api, toList } from "../../services/api";
import { EmptyState } from "../LoadingSpinner/AsyncState";

const CorporateFAQ = () => {
  const [faqData, setFaqData] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get("/faqs/", { params: { page: "corporate" } })
      .then((res) => {
        if (!cancelled) setFaqData(toList(res.data));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
                  key={faq.id || index}
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

export default CorporateFAQ;