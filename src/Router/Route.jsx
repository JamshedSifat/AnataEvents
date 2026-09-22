import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import ProtectedRoute from "../Componetns/ProtectedRoute";
import NotFound from "../Pages/Errors/NotFound";
import RouteFallback from "../Componetns/LoadingSpinner/RouteFallback";

/* ------------------------------------------------------------------ pages --
 * Every route is lazy-loaded so each section ships in its own chunk.
 */
const Home = lazy(() => import("../Componetns/Home/Home"));
const Services = lazy(() => import("../Componetns/Services/Services"));
const About = lazy(() => import("../Pages/About/About"));
const Contact = lazy(() => import("../Pages/Contact/Contact"));
const Portfolio = lazy(() => import("../Pages/Portfolio/Portfolio"));
const Media = lazy(() => import("../Pages/Media/Media"));

const CorporateEvent = lazy(() =>
  import("../Componetns/Services/CorporateEvent/CorporateEvent")
);
const CorporateEventDetails = lazy(() =>
  import("../Componetns/Services/CorporateEvent/CorporateEventDetails")
);
const BestExhibitionStallDesgin = lazy(() =>
  import("../Componetns/Services/BestExhibitionStallDesgin/BestExhibitionStallDesgin")
);
const ExhibitionEventDetails = lazy(() =>
  import("../Componetns/Services/BestExhibitionStallDesgin/ExhibitionEventDetails")
);
const InfluencerMarketingAgency = lazy(() =>
  import("../Componetns/Services/InfluencerMarketingAgency/InfluencerMarketingAgency")
);
const SingerAndCelebrityBooking = lazy(() =>
  import("../Componetns/Services/SingerAndCelebrityBooking/SingerAndCelebrityBooking")
);
const WeddingPlannerManagement = lazy(() =>
  import("../Componetns/Services/WeddingPlannerManagement/WeddingPlannerManagement")
);
const PhotographyVedioServices = lazy(() =>
  import("../Componetns/Services/PhotographyVedioServices/PhotographyVedioServices")
);
const PhotographyServicesDetails = lazy(() =>
  import("../Componetns/Services/PhotographyVedioServices/PhotographyServicesDetails")
);
const VirtualEvent = lazy(() =>
  import("../Componetns/Services/VirtualEvent/VirtualEvent")
);
const SpecialEventList = lazy(() =>
  import("../Componetns/Services/SpecialEvent/SpecialEventList")
);
const SpecialEventDetail = lazy(() =>
  import("../Componetns/Services/SpecialEvent/SpecialEventDetail")
);

const BookAnArtists = lazy(() => import("../Pages/BookAnArtists/BookAnArtists"));
const Singer = lazy(() => import("../Pages/BookAnArtists/Singers/Singer"));
const Dj = lazy(() => import("../Pages/BookAnArtists/Dj/Dj"));
const Comedian = lazy(() => import("../Pages/BookAnArtists/Comedian/Comedian"));
const Magician = lazy(() => import("../Pages/BookAnArtists/Magician/Magician"));
const Dancer = lazy(() => import("../Pages/BookAnArtists/Dancer/Dancer"));

const Opportunities = lazy(() => import("../Pages/Opportunities/Opportunities"));
const TalentHunt = lazy(() => import("../Pages/Opportunities/TalentHunt/TalentHunt"));
const ArtistRegistration = lazy(() =>
  import("../Pages/Opportunities/ArtistRegistration/ArtistRegistration")
);
const CareerOpportunities = lazy(() =>
  import("../Pages/Opportunities/CareerOpportunities/CareerOpportunities")
);
const VendorRegistration = lazy(() =>
  import("../Pages/Opportunities/VendorRegistration/VendorRegistration")
);

const MediaGellary = lazy(() => import("../Pages/Media/MediaGellary/MediaGellary"));
const MediaVideo = lazy(() => import("../Pages/Media/MediaVideo/MediaVideo"));
const PostCard = lazy(() => import("../Pages/BlogItems/PostCard"));
const PostCardDetails = lazy(() => import("../Pages/BlogItems/PostCardDetails"));

/* ------------------------------------------------------------------- auth --
const AdminLogin = lazy(() => import("../Auth/Pages/AdminLogin"));
const ForgotPassword = lazy(() => import("../Auth/Pages/ForgotPassword"));
const ResetPassword = lazy(() => import("../Auth/Pages/ResetPassword"));

/* ------------------------------------------------------------------ admin --
 * The whole dashboard ships as one separate chunk.
 */
const AdminLayout = lazy(() => import("../Admin/Layouts/AdminLayout"));
const Dashboard = lazy(() => import("../Admin/pages/Dashboard"));
const AdminHero = lazy(() => import("../Admin/Components/Home/AdminHero"));
const ServiceManagement = lazy(() =>
  import("../Admin/pages/Services/ServiceManagement")
);
const AdminCorporateEvents = lazy(() =>
  import("../Admin/pages/AdminCorporoateEvents/AdminCorporateEvents")
);
const AdminExhibitionStall = lazy(() =>
  import("../Admin/pages/ExhibitionStall/AdminExhibitionStall")
);
const AdminSpecialEvents = lazy(() =>
  import("../Admin/pages/SpecialEvents/AdminSpecialEvents")
);
const SingerManagement = lazy(() =>
  import("../Admin/pages/AdminBookAnArtists/SingerManagement/SingerManagement")
);
const DjManagement = lazy(() =>
  import("../Admin/pages/AdminBookAnArtists/DjManagement/DjManagement")
);
const ComedianManagement = lazy(() =>
  import("../Admin/pages/AdminBookAnArtists/ComedianManagement/ComedianManagement")
);
const MagicianManagement = lazy(() =>
  import("../Admin/pages/AdminBookAnArtists/MagicianManagement/MagicianManagement")
);
const DancerManagement = lazy(() =>
  import("../Admin/pages/AdminBookAnArtists/DancerManagement/DancerManagement")
);
const MediaManagement = lazy(() =>
  import("../Admin/pages/AdminMediaGellary/MediaManagement")
);
const VideoManagement = lazy(() =>
  import("../Admin/pages/AdminMediaGellary/VideoManagement")
);
const TestimonialManagement = lazy(() =>
  import("../Admin/pages/Testimonal/TestimonialManagement")
);
const TeamManagement = lazy(() => import("../Admin/pages/Team/TeamManagement"));
const CareerManagement = lazy(() =>
  import("../Admin/pages/AdminCarearOportunity/CareerManagement")
);
const BlogManagement = lazy(() => import("../Admin/pages/Blog/BlogManagement"));
const PortfolioManagement = lazy(() =>
  import("../Admin/pages/AdminProtfolio/ProtfolioManagement")
);
const VendorManagement = lazy(() =>
  import("../Admin/pages/AdminOpportunity/Vendor/VendorManagement")
);
const HomeFAQAdmin = lazy(() => import("../Admin/pages/AdminFAQ/HomeFAQ"));
const AdminArtists = lazy(() =>
  import("../Admin/pages/AdminOpportunity/Artists/AdminArtists")
);
const AdminTalentHunt = lazy(() =>
  import("../Admin/pages/AdminOpportunity/TalentHunt/AdminTalentHunt")
);
const AdminInfluencers = lazy(() =>
  import("../Admin/Components/AdminInfluencer/AdminInfluencers")
);
const AdminTalentProfiles = lazy(() =>
  import("../Admin/pages/TalentProfiles/AdminTalentProfiles")
);
const UsersList = lazy(() => import("../Admin/pages/Users/UsersList"));
const AdminSettings = lazy(() => import("../Admin/pages/Settings/AdminSettings"));

const withSuspense = (element) => <Suspense fallback={<RouteFallback />}>{element}</Suspense>;

/* ------------------------------------------------- legacy URL redirects --
 * Old mixed-case/typo URLs → new lowercase kebab-case routes.
 */
const LEGACY_REDIRECTS = [
  ["/About", "/about"],
  ["/bookAnArtists", "/book-an-artist"],
  ["/bookAnArtists/singer", "/book-an-artist/singer"],
  ["/bookAnArtists/dj", "/book-an-artist/dj"],
  ["/bookAnArtists/comedian", "/book-an-artist/comedian"],
  ["/bookAnArtists/magician", "/book-an-artist/magician"],
  ["/bookAnArtists/dancer", "/book-an-artist/dancer"],
  ["/services/CorporateEvent", "/services/corporate-events"],
  ["/services/BestExhibitionStallDesgin", "/services/exhibition-stall-design"],
  ["/services/InfluencerMarketingAgency", "/services/influencer-marketing"],
  ["/services/SingerAndCelebrityBooking", "/services/artist-celebrity-booking"],
  ["/services/WeddingPlanner&Management", "/services/wedding-planning"],
  ["/services/Photography&VedioServices", "/services/photography-video"],
  ["/services/SpecialEvent", "/services/special-events"],
  ["/services/SpecialEvent/award-show", "/services/special-events/award-show"],
  ["/services/SpecialEvent/convocation-event", "/services/special-events/convocation-event"],
  ["/services/SpecialEvent/reunion-event", "/services/special-events/reunion-event"],
  ["/services/SpecialEvent/fashion-show", "/services/special-events/fashion-show"],
  ["/services/SpecialEvent/music-concert", "/services/special-events/music-concert"],
  ["/services/SpecialEvent/laser-show", "/services/special-events/laser-show"],
  ["/services/SpecialEvent/sports-management", "/services/special-events/sports-management"],
  ["/services/VirtualEvent", "/services/virtual-events"],
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: withSuspense(<Home />) },
      { path: "services", element: withSuspense(<Services />) },
      { path: "services/corporate-events", element: withSuspense(<CorporateEvent />) },
      { path: "services/corporate-events/:id", element: withSuspense(<CorporateEventDetails />) },
      { path: "services/exhibition-stall-design", element: withSuspense(<BestExhibitionStallDesgin />) },
      { path: "services/exhibition-events/:id", element: withSuspense(<ExhibitionEventDetails />) },
      { path: "services/influencer-marketing", element: withSuspense(<InfluencerMarketingAgency />) },
      { path: "services/artist-celebrity-booking", element: withSuspense(<SingerAndCelebrityBooking />) },
      { path: "services/wedding-planning", element: withSuspense(<WeddingPlannerManagement />) },
      { path: "services/photography-video", element: withSuspense(<PhotographyVedioServices />) },
      { path: "services/photography-video/:id", element: withSuspense(<PhotographyServicesDetails />) },
      { path: "services/special-events", element: withSuspense(<SpecialEventList />) },
      // Single dynamic route replaces the 7 static special-event pages.
      { path: "services/special-events/:slug", element: withSuspense(<SpecialEventDetail />) },
      { path: "services/virtual-events", element: withSuspense(<VirtualEvent />) },
      { path: "about", element: withSuspense(<About />) },
      { path: "portfolio", element: withSuspense(<Portfolio />) },
      { path: "media", element: withSuspense(<Media />) },
      { path: "media/gallery", element: withSuspense(<MediaGellary />) },
      { path: "media/video", element: withSuspense(<MediaVideo />) },
      { path: "media/blog", element: withSuspense(<PostCard />) },
      { path: "media/blog/:id", element: withSuspense(<PostCardDetails />) },
      { path: "contact", element: withSuspense(<Contact />) },
      { path: "book-an-artist", element: withSuspense(<BookAnArtists />) },
      { path: "book-an-artist/singer", element: withSuspense(<Singer />) },
      { path: "book-an-artist/dj", element: withSuspense(<Dj />) },
      { path: "book-an-artist/comedian", element: withSuspense(<Comedian />) },
      { path: "book-an-artist/magician", element: withSuspense(<Magician />) },
      { path: "book-an-artist/dancer", element: withSuspense(<Dancer />) },
      { path: "opportunities", element: withSuspense(<Opportunities />) },
      { path: "opportunities/talent-hunt", element: withSuspense(<TalentHunt />) },
      { path: "opportunities/artist-registration", element: withSuspense(<ArtistRegistration />) },
      { path: "opportunities/careers", element: withSuspense(<CareerOpportunities />) },
      { path: "opportunities/vendor-registration", element: withSuspense(<VendorRegistration />) },
      // Legacy URLs → new kebab-case equivalents.
      ...LEGACY_REDIRECTS.map(([from, to]) => ({
        path: from,
        loader: () => new Response(null, { status: 301, headers: { Location: to } }),
      })),
      { path: "*", element: <NotFound /> },
    ],
  },

  // ------------------------------ admin auth (public routes) ---------------
  {
    path: "/admin",
    children: [
      { index: true, element: <Navigate to="/admin/login" replace /> },
      { path: "login", element: withSuspense(<AdminLogin />) },
      { path: "forgot-password", element: withSuspense(<ForgotPassword />) },
      { path: "reset-password", element: withSuspense(<ResetPassword />) },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<RouteFallback />}>
              <AdminLayout />
            </Suspense>
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: withSuspense(<Dashboard />) },
          { path: "hero", element: withSuspense(<AdminHero />) },
          { path: "settings", element: withSuspense(<AdminSettings />) },
          { path: "services", element: withSuspense(<ServiceManagement />) },
          { path: "corporate-events", element: withSuspense(<AdminCorporateEvents />) },
          { path: "exhibition-stall", element: withSuspense(<AdminExhibitionStall />) },
          { path: "special-events", element: withSuspense(<AdminSpecialEvents />) },
          { path: "photography-services", element: withSuspense(<AdminSpecialEvents photography />) },
          { path: "singers", element: withSuspense(<SingerManagement />) },
          { path: "djs", element: withSuspense(<DjManagement />) },
          { path: "comedians", element: withSuspense(<ComedianManagement />) },
          { path: "magicians", element: withSuspense(<MagicianManagement />) },
          { path: "dancers", element: withSuspense(<DancerManagement />) },
          { path: "influencers", element: withSuspense(<AdminInfluencers />) },
          { path: "gallery", element: withSuspense(<MediaManagement />) },
          { path: "videos", element: withSuspense(<VideoManagement />) },
          { path: "testimonials", element: withSuspense(<TestimonialManagement />) },
          { path: "team", element: withSuspense(<TeamManagement />) },
          { path: "careers", element: withSuspense(<CareerManagement />) },
          { path: "blogs", element: withSuspense(<BlogManagement />) },
          { path: "portfolio", element: withSuspense(<PortfolioManagement />) },
          { path: "faqs", element: withSuspense(<HomeFAQAdmin />) },
          { path: "talent-profiles", element: withSuspense(<AdminTalentProfiles />) },
          { path: "artists", element: withSuspense(<AdminArtists />) },
          { path: "talent-hunt", element: withSuspense(<AdminTalentHunt />) },
          { path: "vendors", element: withSuspense(<VendorManagement />) },
          {
            path: "users",
            element: (
              <ProtectedRoute roles={["super_admin"]}>
                {withSuspense(<UsersList />)}
              </ProtectedRoute>
            ),
          },
          { path: "*", element: <NotFound /> },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
