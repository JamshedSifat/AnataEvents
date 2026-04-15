import React from "react";
import { Link } from "react-router";

const WhyChooseUs = () => {
  const features = [
    {
      icon: "👥",
      title: "Expert Planning Team",
      description:
        "Our certified event planners bring 16+ years of experience and creativity to make your vision come to life.",
      highlight: "16+ Years Experience",
    },
    {
      icon: "🏆",
      title: "Award-Winning Company",
      description:
        "Recognized as the Best Event Management Company in Dhaka Bangladesh with proven track record of excellence.",
      highlight: "Rank #1 Event Planners",
    },
    {
      icon: "💎",
      title: "Premium Services",
      description:
        "From corporate events to exhibitions, brand activations to product launches - we deliver flawless execution.",
      highlight: "Full-Service Excellence",
    },
    {
      icon: "🎯",
      title: "100% Satisfaction",
      description:
        "Your happiness is our priority. We guarantee exceptional service and flawless event execution across Bangladesh.",
      highlight: "98% Client Rating",
    },
  ];



  return (
    <section className="py-24 bg-gradient-to-b from-base-100 via-base-200 to-base-100 relative overflow-hidden">

     

      {/* Glow Background */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary/20 blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4">

        {/* Header with Company Description */}
        <div className="text-center mb-20">

          <div className="badge badge-primary badge-lg mb-4">
            🏆 Best Event Management Company in Dhaka Bangladesh
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-base-content mb-6">
            <span className="block text-primary">Rank #1 Event Planners</span>
            Dhaka Bangladesh
          </h1>

          <div className="max-w-4xl mx-auto text-lg text-base-content/80 mb-8 leading-relaxed">
            <p className="mb-4">
              <strong className="text-primary">Ananta Events and Entertainment</strong> – the Best Event Management Company in Dhaka Bangladesh. 
              We are <strong className="text-primary">award winning event planners</strong> in Bangladesh with <strong className="text-primary">16 years of experience</strong> on managing 
              Corporate Events, Conference & Seminars, Exhibition organized, Exhibition stand Fabrication, Brand Activation Event, 
              ATL and BTL activities, product launching event in Bangladesh.
            </p>
            
            <p>
              As a professional event planning service provider, we specialize in <strong className="text-primary">flawless and gorgeous event planning</strong>. 
              Our qualified and experienced team handles conference, brand activation event, exhibition organization, product launching event, 
              exhibition stand fabrication, corporate event management, celebrity management, and Digital influencer management agency services.
            </p>
          </div>

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

          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Why We're Bangladesh's #1 Choice</h3>
            <p className="text-white/90">Trusted by thousands of clients across Bangladesh</p>
          </div>

          <div className="grid md:grid-cols-4 gap-10 text-center">

            <div>
              <h3 className="text-5xl font-bold">2500+</h3>
              <p className="opacity-90">Events Completed</p>
            </div>

            <div>
              <h3 className="text-5xl font-bold">16+</h3>
              <p className="opacity-90">Years Experience</p>
            </div>

            <div>
              <h3 className="text-5xl font-bold">98%</h3>
              <p className="opacity-90">Client Satisfaction</p>
            </div>

            <div>
              <h3 className="text-5xl font-bold">50+</h3>
              <p className="opacity-90">Cities Covered</p>
            </div>

          </div>

        </div>

        {/* CTA Section */}
        <div className="text-center">

          <div className="bg-base-100 border border-primary/20 rounded-3xl p-12 shadow-xl">

            <h3 className="text-3xl font-bold text-primary mb-4">
              Ready to Experience Bangladesh's Best Event Management?
            </h3>

            <p className="text-base-content/70 mb-8 max-w-2xl mx-auto">
              Join hundreds of satisfied clients who trusted Bangladesh's #1 Event Planning Company 
              with their most important moments. Let's create something extraordinary together.
            </p>

            <div className="flex flex-wrap justify-center gap-4">

              <Link to='/contact'><a className="btn btn-primary btn-lg shadow-lg">
                Get Free Consultation 💬
              </a></Link>

              <Link to='/portfolio'><a  className="btn btn-outline btn-primary btn-lg">
                View Our Portfolio 🎭
              </a></Link>

            </div>

            <div className="mt-8 text-sm text-base-content/60">
              <p>📍 Serving Dhaka, Chattogram, Sylhet & All Major Cities in Bangladesh</p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;