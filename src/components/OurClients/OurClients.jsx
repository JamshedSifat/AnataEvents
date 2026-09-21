import React from "react";

const OurClients = () => {
  const clients = [
    { name: "Grameenphone", logo: "https://www.anantabd.net/wp-content/uploads/2025/09/1-200x100.png" },
    { name: "Banglalink", logo: "https://www.anantabd.net/wp-content/uploads/2025/09/2.png" },
    { name: "Unilever", logo: "https://www.anantabd.net/wp-content/uploads/2025/09/6-200x100.jpg" },
    { name: "BRAC", logo: "https://www.anantabd.net/wp-content/uploads/2025/09/56.jpg" }
    
  ];

  return (
    <section className="py-20 bg-base-100">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-primary">Esteemed Clientele</span>
          </h2>
          <p className="text-base-content/70 max-w-2xl mx-auto">
            We are proud to have collaborated with some of the most respected
            brands and organizations across Bangladesh.
          </p>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 items-center  ">
          {clients.map((client, index) => (
            <div
              key={index}
              className="flex justify-center items-center p-4 bg-white rounded-xl shadow-sm 
              "
            >
              <img
                src={client.logo}
                alt={client.name}
                className="h-12 object-contain w-full mx-auto"
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default OurClients;