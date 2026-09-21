import React, { useState } from 'react';

const InfluencerFAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);
      
        const toggleFAQ = (index) => {
          setOpenIndex(openIndex === index ? null : index);
        };

        const faqData = [
  {
    question: "How to choose the right social Influencer for your brand?",
    answer: "To choose the right influencer for your business in Bangladesh, you need to verify a few things Is the influencer creating content that is applicable to your business Do the influencers engage with their following?Is their content consistent or are they always changing to stay relevant?How often is their content shared?Is the influencer someone you would like your brand to be affiliated with?An influencer must be chosen after answering all these questions. Influencers in marketing tend to create lifestyle content. As such, it is best to choose someone who may already use your product or might benefit from it. Other Influencer create specific content and can create content directly promoting a brand or good. For such influencers it is essential that a brand is honest and forthcoming about their products. It must also be ensured that the Influencer does not have any scandals. Any scandal can reflect badly on the brand. Finally, it is crucial that the brand and influencer share the same social message. This ensures a long and successful relationship."
  },
  {
    question: "What is a social media influencer?",
    answer: "Social media Influencer or social influencer is a term we hear every day, but who are they? The answer: Social Influencers are individuals who possess a massive social media following. Their followings can be anywhere between 50,000 to 500,000 people. Such Influencers are divided into two groups; Micro Influencers, who have around 50,000 followers and Macro Influencers, Influencers whose follower count ranges from 100,000 to over 1 million. These individuals tend to create content based around their own lives. This attracts an audience that relate with the influencer on a personal level. Influencers tend to have a lot of respect within their communities. As such, their followers put a lot of weight on their opinions. These followers tend to receive any endorsement the influencer does as genuine advice."
  },
  {
    question: "Why choose us to find your right Influencers for your Brand ?",
    answer: "Our exceptional team at Ananta Events & Entertainment provide support according to our customers’ needs. Our influencer Marketing Agency is the top pioneering influencer agency in Dhaka Bangladesh. We are both a Micro Influencers Agency and a Top Macro Influencers Agency. Our team is connected to many Influencer marketing Companies. Furthermore, our Instagram Influencer Agency connects you to the top micro and macro Instagram influencers. Additionally, our YouTube Influencer Agency can connect you to any YouTuber of Bangladesh. Ananta Events & Entertainment are here to help in any shape and form."
  },
  
];
    return (
        <div>
              {/* FAQ quesstion */}
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
        </div>
    );
};

export default InfluencerFAQ;