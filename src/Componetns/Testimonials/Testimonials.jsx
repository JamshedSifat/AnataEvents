import React, { useState, useEffect } from "react";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch testimonials
  useEffect(() => {
    fetch("/Testimonals.json")
      .then((res) => res.json())
      .then((data) => {
        setTestimonials(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Auto slider
  useEffect(() => {
    if (testimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials]);

  const next = () => setCurrent((current + 1) % testimonials.length);
  const prev = () =>
    setCurrent((current - 1 + testimonials.length) % testimonials.length);

  const renderStars = (rating) => (
    <div className="flex justify-center mb-4 text-yellow-400 text-lg">
      {[...Array(5)].map((_, i) => (
        <span key={i}>{i < rating ? "★" : "☆"}</span>
      ))}
    </div>
  );

  if (loading) {
    return (
      <section className="py-20 text-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </section>
    );
  }

  if (!testimonials.length) return null;

  const t = testimonials[current];

  return (
    <section className="py-10 bg-base-200 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Client <span className="text-primary">Testimonials</span>
          </h2>
          <p className="text-base-content/70 max-w-xl mx-auto">
            Hear from our happy clients who trusted us with their events.
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="relative">

          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body text-center p-4 md:p-12">

              <div className="text-5xl text-primary/20 ">"</div>

              {renderStars(t.rating)}

              <p className="text-lg md:text-xl italic text-base-content/80 mb-8">
                {t.review}
              </p>

              {/* Client */}
              <div className="flex items-center justify-center gap-4">

                <div className="avatar">
                  <div className="avatar">
             <div className="w-14 rounded-full ring ring-primary ring-offset-2">
                 <img src={t.image} alt={t.name} />
                </div>
                </div>
                </div>

                <div className="text-left">
                  <h4 className="font-bold">{t.name}</h4>
                  <p className="text-sm text-base-content/70">
                    {t.designation}
                  </p>
                  <p className="text-primary text-sm font-medium">
                    {t.company}
                  </p>
                </div>
              </div>

              {/* <div className="mt-4">
                <span className="badge badge-primary badge-outline">
                  {t.eventType}
                </span>
              </div> */}
            </div>
          </div>

          {/* Navigation */}
          {testimonials.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 btn btn-circle btn-primary btn-sm"
              >
                ❮
              </button>

              <button
                onClick={next}
                className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 btn btn-circle btn-primary btn-sm"
              >
                ❯
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {testimonials.length > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${
                  current === i
                    ? "bg-primary w-8"
                    : "bg-base-content/30 w-3"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;