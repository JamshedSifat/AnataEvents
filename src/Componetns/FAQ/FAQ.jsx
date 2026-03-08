import React, { useState } from "react";

const faqData = [
  {
    question: "What services does Ananta Events & Entertainment provide?",
    answer: "Ananta Events & Entertainment offers a wide range of event management services, including corporate events, brand activations, weddings, social events, product launches, conferences, exhibitions, concerts, fairs, and cultural programs. We provide both creative planning and flawless execution to make every event a success."
  },
  {
    question: "Why choose Ananta as your event management partner in Bangladesh?",
    answer: "Choosing Ananta means choosing professionalism, creativity, and reliability. Our team pays attention to every detail, ensures timely delivery, and provides customized solutions tailored to your event needs. We focus on client satisfaction and have a proven track record of managing both local and international events with excellence."
  },
  {
    question: "Do you provide exhibition stand fabrication services?",
    answer: "Yes, we provide exhibition stand fabrication and design services. From concept to execution, our team creates visually appealing and functional stands that highlight your brand and engage visitors effectively."
  },
  {
    question: "Can Ananta handle both small and large-scale events?",
    answer: "Absolutely. Whether it's a small private gathering, a corporate meeting, or a large-scale concert or exhibition, Ananta has the expertise, resources, and team strength to manage events of any size."
  },
  {
    question: "Do you organize conferences and seminars?",
    answer: "Yes, Ananta specializes in organizing professional conferences, seminars, and workshops. We take care of venue management, audio-visual setup, logistics, registration, and overall coordination so you can focus on your content and guests."
  },
  {
    question: "What makes Ananta different from other event planners in Bangladesh?",
    answer: "What sets Ananta apart is our commitment to creativity, precision, and client satisfaction. We don't just plan events-we craft experiences. Our dedicated team ensures innovative ideas, flawless execution, and personalized service, making every event truly memorable."
  },
  {
    question: "Can you provide end-to-end solutions for brand activations?",
    answer: "Yes. We provide complete end-to-end solutions for brand activations, including concept development, creative design, promotional strategies, logistics, on-ground execution, and post-event reporting. Our goal is to maximize your brand's visibility and audience engagement."
  },
  {
    question: "Where does Ananta provide event services in Bangladesh?",
    answer: "Ananta provides event management services all across Bangladesh, including major cities like Dhaka, Chattogram, Khulna, Sylhet, Rajshahi, Barishal, Bogura, and more. We have the flexibility and capacity to manage events nationwide."
  },
  {
    question: "How can I request a quotation for my event?",
    answer: "Requesting a quotation is simple. You can contact us through our official website, social media channels, or directly via phone/email. Share your event details with us, and our team will provide you with a customized quotation tailored to your specific requirements."
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
          Frequently Asked <span className="text-primary">Questions</span>
        </h2>

        <div className="space-y-5">
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
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
                    className={`transform transition-transform duration-300 text-2xl ${
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
      </div>
    </section>
  );
};

export default FAQ;