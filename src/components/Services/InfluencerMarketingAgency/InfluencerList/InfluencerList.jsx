// File: src/Components/InfluencerList.jsx (Updated - Load from localStorage)
import { Swiper, SwiperSlide } from 'swiper/react';
import { useState, useEffect } from 'react';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

const InfluencerList = () => {
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [influencersList, setInfluencersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInfluencers();
  }, []);

  const loadInfluencers = () => {
    try {
      setLoading(true);

      const defaultInfluencers = [
        {
          _id: '1',
          name: "Nodi Chowdhury",
          category: "Fashion",
          followers: "250K",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPrYP2N4PqKhrbzA0fT9vsJtQ26ti9OUf4Eg&s",
          description: "Fashion influencer with trending styles",
          engagement: "4.2%",
          posts: "14",
          platforms: ["Instagram", "TikTok", "YouTube"],
          bio: "Fashion enthusiast sharing latest trends and styling tips",
          avgReach: "125K per post"
        },
        {
          _id: '2',
          name: "Ayman Sadiq",
          category: "Education",
          followers: "2.3M+",
          image: "https://yt3.googleusercontent.com/NtAHSyzlrYdBt_Mpbr5UeV3Vs2OMEseNRB6VdCufotcWIOfC2842LlfsshCpYyO3J0HoZ0gw=s900-c-k-c0x00ffffff-no-rj",
          description: "Founder of 10 Minute School, motivational speaker",
          engagement: "5.5%",
          posts: "25",
          platforms: ["YouTube", "Facebook"],
          bio: "Education, skills, and self-development content",
          avgReach: "500K per post"
        },
        {
          _id: '3',
          name: "Raba Khan",
          category: "Comedy",
          followers: "790K+",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7JIKVJnOQM3saYU8EfyV_wUgefTm6FFsxQQ&s",
          description: "Comedy and lifestyle content creator",
          engagement: "6.1%",
          posts: "20",
          platforms: ["YouTube", "Instagram"],
          bio: "Satirical videos about Bengali life",
          avgReach: "350K per post"
        },
        {
          _id: '4',
          name: "Salahuddin Sumon",
          category: "Travel",
          followers: "2.9M+",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNP9JniiQ2CEGtcg0O-cRB7yGndgysOrUWMQ&s",
          description: "Travel vlogger and storyteller",
          engagement: "5.8%",
          posts: "18",
          platforms: ["YouTube", "Facebook"],
          bio: "Travel documentaries and global exploration",
          avgReach: "700K per post"
        },
        {
          _id: '5',
          name: "Nadir Nibras",
          category: "Travel",
          followers: "2.2M+",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9iVVjj088WTV7mGhTQnyNMYSMiQudhSKrEA&s",
          description: "Travel filmmaker and vlogger",
          engagement: "5.2%",
          posts: "16",
          platforms: ["YouTube", "Instagram"],
          bio: "Travel stories, culture, and experiences",
          avgReach: "600K per post"
        },
        {
          _id: '6',
          name: "RnaR (Rakib)",
          category: "Entertainment",
          followers: "1.9M+",
          image: "https://ecdn.dhakatribune.net/contents/cache/images/1200x630x1xxxxx1/uploads/dten/2023/05/16/278960849-564053261799700-1289283670046029060-n.jpeg",
          description: "Film reviewer and content creator",
          engagement: "6.5%",
          posts: "14",
          platforms: ["YouTube"],
          bio: "Movie reviews and media analysis",
          avgReach: "550K per post"
        },
        {
          _id: '7',
          name: "Tahseenation",
          category: "Tech",
          followers: "600K+",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpJ8d1BSGSV774b07m7j4JEGa4kJm2iPOxxg&s",
          description: "Tech reviewer and gadget expert",
          engagement: "4.8%",
          posts: "20",
          platforms: ["YouTube", "Facebook"],
          bio: "Tech reviews and smartphone analysis",
          avgReach: "300K per post"
        },
        {
          _id: '8',
          name: "Rafsan The Choto Bhai",
          category: "Food",
          followers: "1.5M+",
          image: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Iftekhar_Rafsan_%28Rafsan_thechotobhai%29.jpg",
          description: "Food vlogger and reviewer",
          engagement: "6.9%",
          posts: "22",
          platforms: ["YouTube", "Facebook"],
          bio: "Food reviews and restaurant experiences",
          avgReach: "650K per post"
        }
      ];

      // Try to load from localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedInfluencers = localStorage.getItem('influencers');

        if (savedInfluencers) {
          try {
            const parsedInfluencers = JSON.parse(savedInfluencers);
            if (Array.isArray(parsedInfluencers) && parsedInfluencers.length > 0) {
              setInfluencersList(parsedInfluencers);
              setLoading(false);
              return;
            }
          } catch (e) {
            console.error('Error parsing influencers:', e);
          }
        }
      }

      // Use default influencers if localStorage is empty
      setInfluencersList(defaultInfluencers);
      setLoading(false);
    } catch (error) {
      console.error('Error loading influencers:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div>
      {/* Influencers List - Carousel with Images */}
      <div className="mb-16">
        <div className="mb-8 text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-4">
            OUR NETWORK
          </span>
          <h2 className="text-3xl font-bold mb-2">Featured <span className='text-primary'>Influencers</span></h2>
          <p className="text-neutral">Handpicked creators driving real results for brands</p>
        </div>

        {influencersList.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="rounded-2xl overflow-hidden"
          >
            {influencersList.map((inf, idx) => (
              <SwiperSlide key={inf._id || idx}>
                <div className="rounded-2xl bg-white border-2 border-base-300 m-2 overflow-hidden hover:border-primary transition-all hover:shadow-xl group">
                  
                  {/* Image Section */}
                  <div className="relative h-48 w-full overflow-hidden bg-base-300">
                    <img
                      src={inf.image}
                      alt={inf.name}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Influencer';
                      }}
                    />
                    {/* Category Badge Overlay */}
                    <div className="absolute top-3 right-3">
                      <span className="inline-block rounded-full bg-primary/90 px-3 py-1 text-xs font-bold text-white">
                        {inf.category}
                      </span>
                    </div>
                    {/* Followers Badge */}
                    <div className="absolute bottom-3 left-3 rounded-lg bg-white/95 px-3 py-2 backdrop-blur-sm">
                      <p className="text-xs text-neutral">Followers</p>
                      <p className="font-bold text-secondary">{inf.followers}</p>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <h3 className="font-bold text-secondary text-lg mb-1">{inf.name}</h3>
                    <p className="text-xs text-neutral mb-4 leading-relaxed">
                      {inf.description || "Verified influencer with high engagement rates"}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 pb-4 mb-4 border-b border-base-300">
                      <div>
                        <p className="text-xs text-neutral">Engagement</p>
                        <p className="font-bold text-primary text-sm">{inf.engagement || "3.5-5.8%"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral">Posts/Month</p>
                        <p className="font-bold text-secondary text-sm">{inf.posts || "12-15"}</p>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button 
                      onClick={() => setSelectedInfluencer(inf)}
                      className="w-full rounded-lg bg-primary/10 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-all">
                      View Profile →
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 text-lg">No influencers available</p>
          </div>
        )}
      </div>

      {/* Modal Popup */}
      {selectedInfluencer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in duration-300 my-8">
            
            {/* Modal Header with Image */}
            <div className="relative h-48 sm:h-56 md:h-64 w-full overflow-hidden bg-base-300">
              <img
                src={selectedInfluencer.image}
                alt={selectedInfluencer.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x600?text=Influencer';
                }}
              />
              <button
                onClick={() => setSelectedInfluencer(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 rounded-full bg-white p-2 hover:bg-base-200 transition-all shadow-lg"
              >
                <span className="text-lg sm:text-xl">✕</span>
              </button>
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 rounded-full bg-primary/90 px-3 py-1 sm:px-4 sm:py-2">
                <span className="text-xs sm:text-sm font-bold text-white">{selectedInfluencer.category}</span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 md:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-2">{selectedInfluencer.name}</h2>
              <p className="text-sm sm:text-base text-neutral mb-6">{selectedInfluencer.bio}</p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-base-300">
                <div>
                  <p className="text-xs sm:text-sm text-neutral mb-1">Followers</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary">{selectedInfluencer.followers}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-neutral mb-1">Engagement Rate</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary">{selectedInfluencer.engagement}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-neutral mb-1">Average Reach</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-secondary">{selectedInfluencer.avgReach}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-neutral mb-1">Posts/Month</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-secondary">{selectedInfluencer.posts}</p>
                </div>
              </div>

              {/* Platforms */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-bold text-secondary mb-3">Active Platforms</h3>
                <div className="flex gap-2 flex-wrap">
                  {selectedInfluencer.platforms && selectedInfluencer.platforms.length > 0 ? (
                    selectedInfluencer.platforms.map((platform, idx) => (
                      <span key={idx} className="rounded-full bg-primary/10 px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-primary">
                        {platform}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-neutral">No platforms listed</p>
                  )}
                </div>
              </div>

              {/* Description */}
              {selectedInfluencer.description && (
                <div className="mb-6 sm:mb-8 bg-primary/5 p-4 rounded-lg">
                  <h3 className="text-base sm:text-lg font-bold text-secondary mb-2">About</h3>
                  <p className="text-sm sm:text-base text-neutral">{selectedInfluencer.description}</p>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button 
                  className="flex-1 rounded-lg bg-primary px-4 sm:px-6 py-2.5 sm:py-3 font-semibold text-white text-sm sm:text-base hover:bg-primary/90 transition-all active:scale-95">
                  Collaborate
                </button>
                <button 
                  onClick={() => setSelectedInfluencer(null)}
                  className="flex-1 rounded-lg border-2 border-primary px-4 sm:px-6 py-2.5 sm:py-3 font-semibold text-primary text-sm sm:text-base hover:bg-primary/10 transition-all active:scale-95">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfluencerList;