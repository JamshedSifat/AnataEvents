import React from "react";

const CorporateEvent = () => {
  const services = [
    "Corporate Conferences",
    "Product Launch Events",
    "Annual General Meetings",
    "Award Ceremonies",
    "Team Building Programs",
    "Corporate Gala Dinners",
  ];

  return (
    <section className="py-20 bg-base-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Corporate Event Management{" "}
            <span className="text-primary">Company in Bangladesh</span>
          </h1>

          <p className="max-w-3xl mx-auto text-base-content/70 text-lg">
            <strong className="text-primary">
              Ananta Events & Entertainment
            </strong>{" "}
            is one of Bangladesh’s leading{" "}
            <strong className="text-primary">
              corporate event management companies
            </strong>{" "}
            based in Dhaka. We deliver creative and professional solutions for
            corporate meetings, product launches, exhibitions, and large-scale
            business events.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid lg:grid-cols-2 gap-14 items-start">

          {/* Left Content */}
          <div className="space-y-6 text-lg text-base-content/80 leading-relaxed">

            <h2 className="text-2xl font-bold">
              <span className="text-primary">
                360° Corporate Event Services
              </span>
            </h2>

            <p>
              As a trusted{" "}
              <strong className="text-primary">
                corporate event management company in Bangladesh
              </strong>
              , we provide complete 360° event solutions from planning to
              execution. Our experienced team ensures that every event is
              organized professionally and runs smoothly.
            </p>

            <p>
              We specialize in{" "}
              <strong className="text-primary">
                brand activation, corporate meetings, exhibitions,
                product launches, and business conventions
              </strong>
              . Our goal is to create memorable corporate experiences that
              strengthen your brand image.
            </p>

            <p>
              Since{" "}
              <strong className="text-primary">2009</strong>, we have supported
              organizations with{" "}
              <strong className="text-primary">
                MICE events (Meetings, Incentives, Conferences, Exhibitions)
              </strong>
              , networking events, trade shows, and corporate celebrations.
            </p>

          </div>

          {/* Right Services Cards */}
          <div className="grid sm:grid-cols-2 gap-6">

            {services.map((service, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border border-base-300 bg-base-200
                hover:shadow-xl transition duration-300"
              >
                <h3 className="font-semibold text-lg mb-2 text-primary">
                  {service}
                </h3>

                <p className="text-sm text-base-content/70">
                  Professional planning and flawless execution to make your
                  corporate event successful and memorable.
                </p>
              </div>
            ))}

          </div>

        </div>

      </div>
    </section>
  );
};

export default CorporateEvent;