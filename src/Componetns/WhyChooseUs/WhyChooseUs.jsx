import React from "react";

const WhyChooseUs = () => {
  const features = [
    {
      icon: "👥",
      title: "Expert Planning Team",
      description:
        "Our certified event planners bring years of experience and creativity to make your vision come to life.",
      highlight: "15+ Years Experience",
    },
    {
      icon: "💰",
      title: "Budget-Friendly Options",
      description:
        "Premium quality events at competitive prices. We work within your budget without compromising on excellence.",
      highlight: "Best Value Guarantee",
    },
    {
      icon: "⏰",
      title: "24/7 Support",
      description:
        "Round-the-clock assistance from planning to execution. We're always here when you need us most.",
      highlight: "Always Available",
    },
    {
      icon: "🎯",
      title: "100% Satisfaction",
      description:
        "Your happiness is our priority. We guarantee exceptional service and flawless event execution.",
      highlight: "98% Client Rating",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-base-100 via-base-200 to-base-100 relative overflow-hidden">

      {/* Glow Background */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary/20 blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-20">

          <div className="badge badge-primary badge-lg mb-4">
            ⭐ Why Choose Ananta Events
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-base-content mb-6">
            Why We're The
            <span className="block text-primary"> Perfect Choice</span>
          </h2>

          <p className="text-base-content/70 max-w-3xl mx-auto text-lg">
            With over 500 successful events and countless satisfied clients,
            we bring unmatched expertise and dedication to every celebration.
          </p>

        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">

          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-base-100 border border-primary/10 rounded-2xl p-8 text-center
              shadow-lg hover:shadow-[0_20px_60px_rgba(0,0,0,0.2)]
              transition-all duration-500 hover:-translate-y-4"
            >

              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center
              bg-gradient-to-r from-primary to-red-700 
              text-white text-2xl rounded-xl shadow-lg
              group-hover:scale-110 group-hover:rotate-6 transition">

                {feature.icon}

              </div>

              <h3 className="text-xl font-bold text-base-content mb-3 group-hover:text-primary transition">
                {feature.title}
              </h3>

              <p className="text-base-content/70 text-sm mb-5">
                {feature.description}
              </p>

              <div className="badge badge-primary badge-outline">
                ✨ {feature.highlight}
              </div>

            </div>
          ))}

        </div>

        {/* Stats Section */}
        <div className="rounded-3xl p-12 text-white
        bg-gradient-to-r from-primary via-red-500 to-secondary
        shadow-[0_25px_80px_rgba(0,0,0,0.3)]
        mb-20">

          <div className="grid md:grid-cols-4 gap-10 text-center">

            <div>
              <h3 className="text-5xl font-bold">500+</h3>
              <p className="opacity-90">Events Completed</p>
            </div>

            <div>
              <h3 className="text-5xl font-bold">15+</h3>
              <p className="opacity-90">Years Experience</p>
            </div>

            <div>
              <h3 className="text-5xl font-bold">98%</h3>
              <p className="opacity-90">Client Satisfaction</p>
            </div>

            <div>
              <h3 className="text-5xl font-bold">50+</h3>
              <p className="opacity-90">Luxury Venues</p>
            </div>

          </div>

        </div>

        {/* CTA */}
        {/* <div className="text-center">

          <div className="bg-base-100 border border-primary/20 rounded-3xl p-12 shadow-xl">

            <h3 className="text-3xl font-bold text-primary mb-4">
              Ready to Create Your Perfect Event?
            </h3>

            <p className="text-base-content/70 mb-8 max-w-xl mx-auto">
              Join hundreds of satisfied clients who trusted us with their
              special moments.
            </p>

            <div className="flex flex-wrap justify-center gap-4">

              <button className="btn btn-primary btn-lg shadow-lg">
                Get Free Consultation 💬
              </button>

              <button className="btn btn-outline btn-primary btn-lg">
                View Our Work 🎭
              </button>

            </div>

          </div>

        </div> */}

      </div>
    </section>
  );
};

export default WhyChooseUs;