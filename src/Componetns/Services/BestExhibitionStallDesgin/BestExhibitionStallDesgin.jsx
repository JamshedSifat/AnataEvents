import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const BestExhibitionStallDesgin = () => {
  const slides = [
    {
      id: 1,
      img: "https://www.anantabd.net/wp-content/uploads/2024/08/01-30-1-768x480.jpg",
      title: "Modern Minimal Booth",
      desc: "Clean lines, premium lighting, and a focused product zone.",
    },
    {
      id: 2,
      img: "https://www.anantabd.net/wp-content/uploads/2023/08/1IMG_9097-768x480.jpg",
      title: "Interactive Demo Layout",
      desc: "Hands-on displays with a clear visitor journey.",
    },
    {
      id: 3,
      img: "https://www.anantabd.net/wp-content/uploads/2022/11/IMG_0386-1-768x480.jpg",
      title: "Brand-First Experience",
      desc: "High visibility branding with comfortable meeting corners.",
    },
    {
      id: 4,
      img: "https://www.anantabd.net/wp-content/uploads/2020/01/iscea-night-9-1-768x480.jpg",
      title: "Brand-First Experience",
      desc: "High visibility branding with comfortable meeting corners.",
    },
    {
      id: 5,
      img: "https://www.anantabd.net/wp-content/uploads/2020/01/FB_IMG_1537774282179-1-768x480.jpg",
      title: "Brand-First Experience",
      desc: "High visibility branding with comfortable meeting corners.",
    },
    {
      id: 6,
      img: "https://www.anantabd.net/wp-content/uploads/2022/10/T5-1-768x480.jpg",
      title: "Brand-First Experience",
      desc: "High visibility branding with comfortable meeting corners.",
    },
    {
      id: 7,
      img: "https://www.anantabd.net/wp-content/uploads/2022/10/pp3-1-1-768x480.jpg",
      title: "Brand-First Experience",
      desc: "High visibility branding with comfortable meeting corners.",
    },
    {
      id: 8,
      img: "https://www.anantabd.net/wp-content/uploads/2022/10/Galaxy1-1-768x480.jpg",
      title: "Brand-First Experience",
      desc: "High visibility branding with comfortable meeting corners.",
    },
  ];

  return (
    <section className="mt-10">
      <div className="mx-auto w-full max-w-6xl px-4">
        {/* heading */}
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Best Exhibition Stall Design
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-600 md:text-base">
            Stand out at your next expo with thoughtful booth layouts, strong
            branding, and visitor-friendly flow.
          </p>
        </header>

        {/* hero image */}
        <div className="overflow-hidden rounded-2xl border bg-gray-50">
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
              <SwiperSlide key={s.id}>
                <div className="relative aspect-[16/8] w-full">
                  <img
                    src={s.img}
                    alt={s.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 md:p-6">
                    <h2 className="text-base font-semibold text-white md:text-2xl">
                      {s.title}
                    </h2>
                    <p className="mt-1 text-xs text-white/90 md:text-sm">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* intro cards */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border p-5">
            <h3 className="text-base font-semibold">Smart Layout</h3>
            <p className="mt-2 text-sm text-gray-600">
              Guide visitors naturally—welcome zone, demo zone, meeting space,
              and storage.
            </p>
          </div>
          <div className="rounded-2xl border p-5">
            <h3 className="text-base font-semibold">Brand Visibility</h3>
            <p className="mt-2 text-sm text-gray-600">
              High-impact graphics, consistent colors, and readable signage from
              distance.
            </p>
          </div>
          <div className="rounded-2xl border p-5">
            <h3 className="text-base font-semibold">Engagement</h3>
            <p className="mt-2 text-sm text-gray-600">
              Add interactive demos, sampling, lead forms, and comfortable
              seating.
            </p>
          </div>
        </div>

        {/* 2 column: left content + right image */}
        <div className="mt-10 grid items-center gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold md:text-2xl text-primary">
              Stall Designers & Exhibition Stall Fabricators With Inhouse Warehouse Facilities
            </h2>
            <p className="mt-3 text-sm text-gray-600 md:text-base">
             
We provide the best exhibition services and facilities in Ananta Events and Entertainment under one roof. We have 6000SQF inhouse factory facilities & 2000sft office space. From exhibition stand design to innovative graphics, manufacturing, installation and dismantling, all these display services are in-house. We guarantee time savings and make it easy for customers to focus on other important aspects of their brand.
            </p>
            <p className="mt-3 text-sm text-gray-600 md:text-base">
             
You can get a better idea of the services we provide and the kind of work you can expect from us by taking a look at our gallery. The award we strive for for happy customers who return to us again and again can only be achieved through continuous creativity, consistent innovation and effective delivery of high-quality service.
            </p>
            <p className="mt-3 text-sm text-gray-600 md:text-base">
             
We feel incredibly honored to be our clients’ first choice when it comes to setting up show stalls for their companies in a hassle-free and reliable manner.
<br />

During the design and construction of our exhibition stalls, you will be able to observe actual craftsmanship from our stall carpenters, metal fabricators, painters and electricians.
            </p>

           

           
          </div>

          <div className="overflow-hidden rounded-2xl border bg-gray-50">
            <img
              src="https://www.anantabd.net/wp-content/uploads/2023/08/exclusive_stand_bangladesh-768x614.jpg"
            />
          </div>
        </div>

        {/* 2 column: left description + right swiper */}
        <div className="mt-10 grid items-center gap-6 md:grid-cols-2">
         <div>
  <h2 className="text-xl font-semibold md:text-2xl text-primary">
    Why Choose Ananta Events & Entertainment?
  </h2>
  <p className="mt-3 text-sm text-gray-600 md:text-base">
    Backed with an extensive experience of 15+ years, Ananta Events has an extensive history of creating premium-quality exhibition stalls for national and international clients across industries.
  </p>

  <ul className="mt-5 space-y-3 text-sm text-gray-700">
    <li className="flex gap-2">
      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gray-900" />
      Leading exhibition stall design and fabrication company in Bangladesh. With 2 offices located in Dhaka and Chittagong.
    </li>
    <li className="flex gap-2">
      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gray-900" />
      Expertise in exhibition stand designing, building, fabricating, contracting services
    </li>
    <li className="flex gap-2">
      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gray-900" />
      Experience creating customised exhibition stands that capture your brand's unique essence
    </li>
    <li className="flex gap-2">
      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gray-900" />
      Delivering high quality booth finishing results on time and within budget
    </li>
    <li className="flex gap-2">
      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gray-900" />
      Ability to develop effective stall designs for exhibitions of any size or type
    </li>
    <li className="flex gap-2">
      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gray-900" />
      Exclusively tailored solutions based on each customer's individual needs
    </li>
    <li className="flex gap-2">
      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gray-900" />
      100% Client satisfaction guaranty!
    </li>
  </ul>
</div>

          <div className="overflow-hidden rounded-2xl border bg-gray-50">
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
                <SwiperSlide key={s.id}>
                  <div className="relative aspect-[4/3] w-full">
                    <img
                      src={s.img}
                      alt={s.title}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
                      <h3 className="text-sm font-semibold text-white md:text-base">
                        {s.title}
                      </h3>
                      <p className="mt-1 text-xs text-white/90 md:text-sm">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

       
      </div>
    </section>
  );
};

export default BestExhibitionStallDesgin;