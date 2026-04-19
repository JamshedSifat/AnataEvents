// File: src/Pages/Services/CorporateEvent.jsx
import React from "react";
import CorporateEventsList from "./CorporateEventsList";

import CorporateFAQ from "../../FAQ/CorporateFAQ";


const CorporateEvent = () => {
  return (
    <section className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 py-20">
          <div className="inline-block mb-4">
            <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold border border-primary/30">
              CORPORATE SOLUTIONS
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Corporate Event Management{" "}
            <span className="text-primary">Company in Bangladesh</span>
          </h1>

          <p className="max-w-3xl mx-auto text-gray-600 text-lg leading-relaxed">
            Ananta Events and Entertainment is one of Bangladesh's best corporate event management companies. In Dhaka, Bangladesh, we are regarded as the best corporate event planners. We provide professional event management services, project scheduling, meeting, and brand activation events, show organizing, product launching events, exhibition stall construction, Exhibition stand Fabrication, exhibition booth production and location procurement.
          </p>
        </div>

        {/* Services List */}
        <CorporateEventsList />

        {/* Main Content */}
        <div className="mb-20 space-y-6 pb-20">
          <h2 className="text-3xl font-bold">
            <span className="text-primary">
              360 Degree Corporate Event services provider in Bangladesh:
            </span>
          </h2>

          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>As a best Corporate Event Management Company in Bangladesh, we provide 360 Degree Corporate Event services . We do ✓Corporate Event Planners, ✓Event Organizers For Corporate, ✓Corporate Event Organisers, ✓Corporate Event Promotion Planners in Dhaka.</p>

            <h3 className="text-2xl font-bold mt-6">What a Company expect from a Corporate Event management company in Bangladesh?</h3>

            <p>A Corporate Event management company take the responsibility to organize an event from the planning to execution. Firstly, we understand the client's requirements make a scratch. Then we make the plan and execution the event either it corporate or social events...</p>
          </div>
        </div>
      </div>

      {/* ✅ Corporate FAQs */}
      <CorporateFAQ />
    </section>
  );
};

export default CorporateEvent;