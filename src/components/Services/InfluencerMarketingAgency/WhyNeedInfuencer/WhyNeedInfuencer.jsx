import React from 'react';

const WhyNeedInfuencer = () => {
     const benefits = [
    { num: "1", title: "Increase Brand Awareness", icon: "📢" },
    { num: "2", title: "Win-win Partnerships", icon: "🤝" },
    { num: "3", title: "Cost-effective & Saves Time", icon: "⏱️" },
    { num: "4", title: "Build Credibility and Trust", icon: "✓" },
    { num: "5", title: "Boost SEO & ROI", icon: "📈" },
    { num: "6", title: "Drive Purchases Decisions", icon: "🛒" },
    { num: "7", title: "Enrich Content Strategy", icon: "✍️" },
    { num: "8", title: "Suitable For Any Business", icon: "🎯" },
    { num: "9", title: "Sharing Potential", icon: "📱" },
    { num: "10", title: "Increase Sales", icon: "💰" },
  ];
    return (
        <div>
             {/* Why Influencer Section */}
        <div className="mb-16 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 p-8 md:p-12 border border-primary/20">
          <h2 className="text-3xl font-bold text-secondary mb-2">Why Do You Need an <span className="text-primary">Influencer?</span></h2>
          <h4 className="text-xl mb-2 text-neutral">Benefits of Influencer Marketing Bangladesh</h4>
          <p className="text-neutral mb-8">A social media Influencer can directly connect a brand to their targeted audience. Furthermore, Influencer marketing adds a personal touch to a brands marketing. Such an addition is beneficial as it allows to create brand loyalty. The Influencers also benefit as a good brand can boost their image and help them better communicate.</p>
          
          {/* Benefits Grid */}
          <div className="grid gap-3 md:grid-cols-5">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-5 text-center transition-all hover:shadow-lg ${
                  idx < 9
                    ? "bg-white border-2 border-primary/20 hover:border-primary"
                    : "bg-gradient-to-br from-primary to-secondary text-white border-2 border-primary"
                }`}
              >
                <div className="text-4xl mb-3">{benefit.icon}</div>
                <p className="font-semibold text-sm leading-tight">{benefit.title}</p>
              </div>
            ))}
          </div>
        </div>
        </div>
    );
};

export default WhyNeedInfuencer;