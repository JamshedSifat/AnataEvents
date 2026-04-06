import React from 'react';

const CampaignProcess = () => {
    const process = [
    {
      step: "1",
      title: "Brand Discovery",
      description: "We analyze your brand values, target audience, and campaign objectives",
    },
    {
      step: "2",
      title: "Influencer Curation",
      description: "Identify and vet influencers that align with your brand DNA",
    },
    {
      step: "3",
      title: "Strategy Development",
      description: "Create a customized campaign strategy with clear KPIs",
    },
    {
      step: "4",
      title: "Campaign Execution",
      description: "Manage all negotiations, content creation, and posting",
    },
    {
      step: "5",
      title: "Performance Analytics",
      description: "Deliver detailed reports with engagement and conversion metrics",
    },
    {
      step: "6",
      title: "Optimization",
      description: "Continuously refine strategy based on real-time performance data",
    },
  ];
    return (
        <div>
            <div className="mb-16">
          <div className="text-center mb-12">
            <span className="inline-block rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent mb-4">
              OUR PROCESS
            </span>
            <h2 className="text-3xl font-bold text-secondary mb-3">Six-Step Campaign Strategy</h2>
            <p className="text-neutral max-w-2xl mx-auto">From discovery to optimization, we manage every aspect of your influencer marketing campaign</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {process.map((p, idx) => (
              <div key={idx} className="group rounded-2xl bg-white border-2 border-base-300 p-6 hover:border-primary transition-all hover:shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-bold text-lg group-hover:scale-110 transition-transform">
                  {p.step}
                </div>
                <h3 className="text-lg font-bold text-secondary mb-2">{p.title}</h3>
                <p className="text-sm text-neutral">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
        </div>
    );
};

export default CampaignProcess;