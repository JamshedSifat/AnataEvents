
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import EventsList from "../../../admin/pages/Events/EventsList";
import ExhibitionEventsList from "./ExhibitionEventsList";

const BestExhibitionStallDesign = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExhibitionData();
  }, []);

  const loadExhibitionData = () => {
    try {
      setLoading(true);

      // Default slides
      const defaultSlides = [
        {
          _id: '1',
          image: "https://www.anantabd.net/wp-content/uploads/2024/08/01-30-1-768x480.jpg",
          title: "Modern Minimal Booth",
          description: "Clean lines, premium lighting, and a focused product zone.",
        },
        {
          _id: '2',
          image: "https://www.anantabd.net/wp-content/uploads/2023/08/1IMG_9097-768x480.jpg",
          title: "Interactive Demo Layout",
          description: "Hands-on displays with a clear visitor journey.",
        },
        {
          _id: '3',
          image: "https://www.anantabd.net/wp-content/uploads/2022/11/IMG_0386-1-768x480.jpg",
          title: "Brand-First Experience",
          description: "High visibility branding with comfortable meeting corners.",
        },
        {
          _id: '4',
          image: "https://www.anantabd.net/wp-content/uploads/2020/01/iscea-night-9-1-768x480.jpg",
          title: "Premium Exhibition Setup",
          description: "High visibility branding with comfortable meeting corners.",
        },
        {
          _id: '5',
          image: "https://www.anantabd.net/wp-content/uploads/2020/01/FB_IMG_1537774282179-1-768x480.jpg",
          title: "Corporate Event Display",
          description: "Professional setup with modern design elements.",
        },
        {
          _id: '6',
          image: "https://www.anantabd.net/wp-content/uploads/2022/10/T5-1-768x480.jpg",
          title: "Elegant Booth Design",
          description: "Sophisticated layout with premium finishing.",
        },
        {
          _id: '7',
          image: "https://www.anantabd.net/wp-content/uploads/2022/10/pp3-1-1-768x480.jpg",
          title: "Interactive Showcase",
          description: "Engaging visitor experience with modern technology.",
        },
        {
          _id: '8',
          image: "https://www.anantabd.net/wp-content/uploads/2022/10/Galaxy1-1-768x480.jpg",
          title: "Brand Experience Center",
          description: "Complete brand storytelling through exhibition design.",
        },
      ];

      // Try to load from localStorage
      const savedSlides = localStorage.getItem('exhibitionStallDesigns');
      
      if (savedSlides) {
        try {
          const parsedSlides = JSON.parse(savedSlides);
          if (Array.isArray(parsedSlides) && parsedSlides.length > 0) {
            setSlides(parsedSlides);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error('Error parsing saved slides:', e);
        }
      }

      // Use default slides
      setSlides(defaultSlides);
      localStorage.setItem('exhibitionStallDesigns', JSON.stringify(defaultSlides));
      setLoading(false);
    } catch (error) {
      console.error('Error loading exhibition data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex items-center justify-center min-h-96">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-white py-12 sm:py-16">
      <div className="mx-auto w-full max-w-6xl px-4">
        {/* Heading */}
        <header className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-3">
            Best Exhibition Stall Design
          </h1>
          <p className="max-w-3xl text-sm sm:text-base text-gray-600">
            Stand out at your next expo with thoughtful booth layouts, strong
            branding, and visitor-friendly flow.
          </p>
        </header>

        {/* Hero Image Slider */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white mb-10 sm:mb-12">
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            loop
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            slidesPerView={1}
            className="w-full"
          >
            {slides.map((s) => (
              <SwiperSlide key={s._id || s.id}>
                <div className="relative aspect-[16/8] w-full">
                  <img
                    src={s.image || s.img}
                    alt={s.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/1200x600?text=Exhibition+Stall';
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 md:p-6">
                    <h2 className="text-base font-semibold text-white md:text-2xl">
                      {s.title}
                    </h2>
                    <p className="mt-1 text-xs text-white/90 md:text-sm">
                      {s.description || s.desc}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Intro Cards */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3 mb-12 sm:mb-16">
          <div className="rounded-xl border border-gray-200 p-6 bg-white hover:shadow-lg hover:border-primary/30 transition">
            <h3 className="text-lg font-semibold text-gray-900">Smart Layout</h3>
            <p className="mt-3 text-sm text-gray-600">
              Guide visitors naturally—welcome zone, demo zone, meeting space,
              and storage.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-6 bg-white hover:shadow-lg hover:border-primary/30 transition">
            <h3 className="text-lg font-semibold text-gray-900">Brand Visibility</h3>
            <p className="mt-3 text-sm text-gray-600">
              High-impact graphics, consistent colors, and readable signage from
              distance.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-6 bg-white hover:shadow-lg hover:border-primary/30 transition">
            <h3 className="text-lg font-semibold text-gray-900">Engagement</h3>
            <p className="mt-3 text-sm text-gray-600">
              Add interactive demos, sampling, lead forms, and comfortable
              seating.
            </p>
          </div>
        </div>

        {/* 2 Column: Left Content + Right Image */}
        <div className="grid items-center gap-8 md:gap-12 md:grid-cols-2 mb-16 sm:mb-20">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              <span className="text-primary">Stall Designers & Exhibition Stall Fabricators</span>
              <br />
              With Inhouse Warehouse Facilities
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
              <p>
                We provide the best exhibition services and facilities in Anata Events and Entertainment under one roof. We have 6000SQF inhouse factory facilities & 2000sft office space. From exhibition stand design to innovative graphics, manufacturing, installation and dismantling, all these display services are in-house. We guarantee time savings and make it easy for customers to focus on other important aspects of their brand.
              </p>
              <p>
                You can get a better idea of the services we provide and the kind of work you can expect from us by taking a look at our gallery. The award we strive for for happy customers who return to us again and again can only be achieved through continuous creativity, consistent innovation and effective delivery of high-quality service.
              </p>
              <p>
                We feel incredibly honored to be our clients' first choice when it comes to setting up show stalls for their companies in a hassle-free and reliable manner.
                <br />
                During the design and construction of our exhibition stalls, you will be able to observe actual craftsmanship from our stall carpenters, metal fabricators, painters and electricians.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <img
              src="https://www.anantabd.net/wp-content/uploads/2023/08/exclusive_stand_bangladesh-768x614.jpg"
              alt="Exhibition Stall Design"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x500?text=Exhibition+Design';
              }}
            />
          </div>
        </div>

        {/* 2 Column: Left Description + Right Swiper */}
        <div className="grid items-center gap-8 md:gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-primary">Anata Events & Entertainment?</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-700 mb-6">
              Backed with an extensive experience of 15+ years, Anata Events has an extensive history of creating premium-quality exhibition stalls for national and international clients across industries.
            </p>

            <ul className="space-y-3">
              <li className="flex gap-3 text-sm sm:text-base text-gray-700">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary flex-shrink-0" />
                <span>Leading exhibition stall design and fabrication company in Bangladesh. With 2 offices located in Dhaka and Chittagong.</span>
              </li>
              <li className="flex gap-3 text-sm sm:text-base text-gray-700">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary flex-shrink-0" />
                <span>Expertise in exhibition stand designing, building, fabricating, contracting services</span>
              </li>
              <li className="flex gap-3 text-sm sm:text-base text-gray-700">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary flex-shrink-0" />
                <span>Experience creating customised exhibition stands that capture your brand's unique essence</span>
              </li>
              <li className="flex gap-3 text-sm sm:text-base text-gray-700">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary flex-shrink-0" />
                <span>Delivering high quality booth finishing results on time and within budget</span>
              </li>
              <li className="flex gap-3 text-sm sm:text-base text-gray-700">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary flex-shrink-0" />
                <span>Ability to develop effective stall designs for exhibitions of any size or type</span>
              </li>
              <li className="flex gap-3 text-sm sm:text-base text-gray-700">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary flex-shrink-0" />
                <span>Exclusively tailored solutions based on each customer's individual needs</span>
              </li>
              <li className="flex gap-3 text-sm sm:text-base text-gray-700">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary flex-shrink-0" />
                <span>100% Client satisfaction guaranty!</span>
              </li>
            </ul>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              loop
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              slidesPerView={1}
              className="h-full w-full"
            >
              {slides.map((s) => (
                <SwiperSlide key={s._id || s.id}>
                  <div className="relative aspect-[4/3] w-full">
                    <img
                      src={s.image || s.img}
                      alt={s.title}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/600x450?text=Exhibition';
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
                      <h3 className="text-sm font-semibold text-white md:text-base">
                        {s.title}
                      </h3>
                      <p className="mt-1 text-xs text-white/90 md:text-sm">
                        {s.description || s.desc}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    <div>
      <ExhibitionEventsList></ExhibitionEventsList>
    </div>
    </section>
  );
};

export default BestExhibitionStallDesign;