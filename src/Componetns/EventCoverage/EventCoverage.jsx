import React from "react";

const EventCoverage = () => {
  const cities = [
    "Dhaka",
    "Chattogram",
    "Sylhet",
    "Cox's Bazar",
    "Comilla",
    "Khulna",
    "Rajshahi",
    "Mymensingh",
    "Barisal",
    "Rangpur"
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-primary to-secondary relative overflow-hidden">
      {/* Background Circles */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse-slow"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Nationwide Event
            <span className="block text-yellow-300 mt-2">Coverage Across Bangladesh</span>
          </h2>
          <p className="text-white/80 max-w-3xl mx-auto text-lg leading-relaxed">
            From bustling capitals to serene coastal towns, we bring our premium event planning expertise to every corner of Bangladesh.
          </p>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
  {cities.map((city, index) => (
    <div
      key={index}
      className="bg-white/10 rounded-xl py-6 text-center text-white font-semibold 
                 shadow-md hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] 
                 hover:bg-gradient-to-r hover:from-white/20 hover:to-white/10
                 transition-all duration-500 cursor-pointer"
    >
      {city}
    </div>
  ))}
</div>
      </div>
    </section>
  );
};

export default EventCoverage;