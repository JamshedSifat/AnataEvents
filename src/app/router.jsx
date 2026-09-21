import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';

import MainLayout from './MainLayout';
import RouteError from './RouteError';
import ProtectedRoute from '../components/ProtectedRoute';
import NotFound from '../pages/NotFound/NotFound';
import { LoadingScreen } from '../components/ui/States';

/**
 * Route table.
 *
 * * Every page is lazy-loaded, so the initial bundle only contains the shell
 *   (the build shipped a single ~1 MB chunk before).
 * * URLs are kebab-case and slug based; every URL from the old build redirects
 *   to its new home below.
 * * `errorElement` guarantees a rendered error page instead of a blank screen.
 */
const lazyPage = (loader) => {
  const Component = lazy(loader);
  const Wrapped = (props) => (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
  return Wrapped;
};

// --- public -----------------------------------------------------------------
const Home = lazyPage(() => import('../components/Home/Home'));
const Services = lazyPage(() => import('../components/Services/Services'));
const CorporateEvent = lazyPage(() => import('../components/Services/CorporateEvent/CorporateEvent'));
const CorporateEventDetails = lazyPage(
  () => import('../components/Services/CorporateEvent/CorporateEventDetails'),
);
const ExhibitionStall = lazyPage(
  () => import('../components/Services/BestExhibitionStallDesgin/BestExhibitionStallDesgin'),
);
const ExhibitionEventDetails = lazyPage(
  () => import('../components/Services/BestExhibitionStallDesgin/ExhibitionEventDetails'),
);
const InfluencerMarketing = lazyPage(
  () => import('../components/Services/InfluencerMarketingAgency/InfluencerMarketingAgency'),
);
const SingerCelebrity = lazyPage(
  () => import('../components/Services/SingerAndCelebrityBooking/SingerAndCelebrityBooking'),
);
const WeddingPlanner = lazyPage(
  () => import('../components/Services/WeddingPlannerManagement/WeddingPlannerManagement'),
);
const PhotographyVideo = lazyPage(
  () => import('../components/Services/PhotographyVedioServices/PhotographyVedioServices'),
);
const PhotographyServicesDetails = lazyPage(
  () => import('../components/Services/PhotographyVedioServices/PhotographyServicesDetails'),
);
const SpecialEventList = lazyPage(() => import('../components/Services/SpecialEvent/SpecialEventList'));
const SpecialEventDetail = lazyPage(() => import('../components/Services/SpecialEvent/SpecialEventDetail'));
const VirtualEvent = lazyPage(() => import('../components/Services/VirtualEvent/VirtualEvent'));

const About = lazyPage(() => import('../pages/About/About'));
const Portfolio = lazyPage(() => import('../pages/Portfolio/Portfolio'));
const Media = lazyPage(() => import('../pages/Media/Media'));
const MediaGallery = lazyPage(() => import('../pages/Media/MediaGellary/MediaGellary'));
const MediaVideo = lazyPage(() => import('../pages/Media/MediaVideo/MediaVideo'));
const BlogList = lazyPage(() => import('../pages/BlogItems/PostCard'));
const BlogDetails = lazyPage(() => import('../pages/BlogItems/PostCardDetails'));
const Contact = lazyPage(() => import('../pages/Contact/Contact'));

const BookAnArtists = lazyPage(() => import('../pages/BookAnArtists/BookAnArtists'));
const Singer = lazyPage(() => import('../pages/BookAnArtists/Singers/Singer'));
const Dj = lazyPage(() => import('../pages/BookAnArtists/Dj/Dj'));
const Comedian = lazyPage(() => import('../pages/BookAnArtists/Comedian/Comedian'));
const Magician = lazyPage(() => import('../pages/BookAnArtists/Magician/Magician'));
const Dancer = lazyPage(() => import('../pages/BookAnArtists/Dancer/Dancer'));

const Opportunities = lazyPage(() => import('../pages/Opportunities/Opportunities'));
const TalentHunt = lazyPage(() => import('../pages/Opportunities/TalentHunt/TalentHunt'));
const ArtistRegistration = lazyPage(
  () => import('../pages/Opportunities/ArtistRegistration/ArtistRegistration'),
);
const CareerOpportunities = lazyPage(
  () => import('../pages/Opportunities/CareerOpportunities/CareerOpportunities'),
);
const VendorRegistration = lazyPage(
  () => import('../pages/Opportunities/VendorRegistration/VendorRegistration'),
);

// --- auth -------------------------------------------------------------------
const AdminLogin = lazyPage(() => import('../auth/Pages/AdminLogin'));
const ForgotPassword = lazyPage(() => import('../auth/Pages/ForgotPassword'));
const ResetPassword = lazyPage(() => import('../auth/Pages/ResetPassword'));
const ChangePassword = lazyPage(() => import('../auth/Pages/ChangePassword'));

// --- admin ------------------------------------------------------------------
const AdminLayout = lazyPage(() => import('../admin/Layouts/AdminLayout'));
const Dashboard = lazyPage(() => import('../admin/pages/Dashboard'));
const AdminHero = lazyPage(() => import('../admin/Components/Home/AdminHero'));
const AdminInfluencers = lazyPage(() => import('../admin/Components/AdminInfluencer/AdminInfluencers'));
const AdminCorporateEvents = lazyPage(() => import('../admin/pages/AdminCorporoateEvents/AdminCorporateEvents'));
const AdminExhibitionStall = lazyPage(() => import('../admin/pages/ExhibitionStall/AdminExhibitionStall'));
const HomeFAQ = lazyPage(() => import('../admin/pages/AdminFAQ/HomeFAQ'));
const AdminArtists = lazyPage(() => import('../admin/pages/AdminOpportunity/Artists/AdminArtists'));
const AdminTalentHunt = lazyPage(() => import('../admin/pages/AdminOpportunity/TalentHunt/AdminTalentHunt'));
const VendorManagement = lazyPage(() => import('../admin/pages/AdminOpportunity/Vendor/VendorManagement'));
const ServiceManagement = lazyPage(() => import('../admin/pages/Services/ServiceManagement'));
const ComedianManagement = lazyPage(
  () => import('../admin/pages/AdminBookAnArtists/ComedianManagement/ComedianManagement'),
);
const DancerManagement = lazyPage(
  () => import('../admin/pages/AdminBookAnArtists/DancerManagement/DancerManagement'),
);
const DjManagement = lazyPage(() => import('../admin/pages/AdminBookAnArtists/DjManagement/DjManagement'));
const MagicianManagement = lazyPage(
  () => import('../admin/pages/AdminBookAnArtists/MagicianManagement/MagicianManagement'),
);
const SingerManagement = lazyPage(
  () => import('../admin/pages/AdminBookAnArtists/SingerManagement/SingerManagement'),
);
const MediaManagement = lazyPage(() => import('../admin/pages/AdminMediaGellary/MediaManagement'));
const VideoManagement = lazyPage(() => import('../admin/pages/AdminMediaGellary/VideoManagement'));
const TestimonialManagement = lazyPage(
  () => import('../admin/pages/Testimonal/TestimonialManagement'),
);
const TeamManagement = lazyPage(() => import('../admin/pages/Team/TeamManagement'));
const CareerManagement = lazyPage(() => import('../admin/pages/AdminCarearOportunity/CareerManagement'));
const ApplicationsList = lazyPage(() => import('../admin/pages/AdminCarearOportunity/ApplicationsList'));
const BlogManagement = lazyPage(() => import('../admin/pages/Blog/BlogManagement'));
const PortfolioManagement = lazyPage(() => import('../admin/pages/AdminProtfolio/ProtfolioManagement'));
const MediaList = lazyPage(() => import('../admin/pages/Media/MediaList'));
const UsersList = lazyPage(() => import('../admin/pages/Users/UsersList'));
const EventsList = lazyPage(() => import('../admin/pages/Events/EventsList'));
const AdminSpecialEvents = lazyPage(() => import('../admin/pages/AdminSpecialEvents/AdminSpecialEvents'));
const AdminSettings = lazyPage(() => import('../admin/pages/Settings/AdminSettings'));
const BookingsList = lazyPage(() => import('../admin/pages/Bookings/BookingsList'));
const ActionLogs = lazyPage(() => import('../admin/pages/Users/ActionLogs'));

/** Redirect helper that keeps the browser history clean. */
const redirect = (to) => ({ path: to, element: <Navigate to={to} replace /> });

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, Component: Home },

      { path: 'services', Component: Services },

      // Corporate events
      { path: 'services/corporate-events', Component: CorporateEvent },
      { path: 'services/corporate-events/:slug', Component: CorporateEventDetails },

      // Exhibition stall design
      { path: 'services/exhibition-stall-design', Component: ExhibitionStall },
      { path: 'services/exhibition-stall-design/:slug', Component: ExhibitionEventDetails },

      // Influencer marketing / celebrity booking / wedding / photography
      { path: 'services/influencer-marketing', Component: InfluencerMarketing },
      { path: 'services/singer-celebrity-booking', Component: SingerCelebrity },
      { path: 'services/wedding-planner', Component: WeddingPlanner },
      { path: 'services/photography-video', Component: PhotographyVideo },
      { path: 'services/photography-video/:slug', Component: PhotographyServicesDetails },

      // Special events (single dynamic route for all seven programmes)
      { path: 'services/special-events', Component: SpecialEventList },
      { path: 'services/special-events/:slug', Component: SpecialEventDetail },

      { path: 'services/virtual-events', Component: VirtualEvent },

      { path: 'about', Component: About },
      { path: 'portfolio', Component: Portfolio },

      { path: 'media', Component: Media },
      { path: 'media/gallery', Component: MediaGallery },
      { path: 'media/videos', Component: MediaVideo },
      { path: 'media/blog', Component: BlogList },
      { path: 'media/blog/:slug', Component: BlogDetails },

      { path: 'contact', Component: Contact },

      { path: 'book-artists', Component: BookAnArtists },
      { path: 'book-artists/singers', Component: Singer },
      { path: 'book-artists/djs', Component: Dj },
      { path: 'book-artists/comedians', Component: Comedian },
      { path: 'book-artists/magicians', Component: Magician },
      { path: 'book-artists/dancers', Component: Dancer },

      { path: 'opportunities', Component: Opportunities },
      { path: 'opportunities/talent-hunt', Component: TalentHunt },
      { path: 'opportunities/artist-registration', Component: ArtistRegistration },
      { path: 'opportunities/careers', Component: CareerOpportunities },
      { path: 'opportunities/vendor-registration', Component: VendorRegistration },

      // ---- legacy URLs from the pre-API build -------------------------------

      // service pages (mixed case, ampersands and numeric ids)
      { path: 'services/CorporateEvent', element: <Navigate to="/services/corporate-events" replace /> },
      {
        path: 'services/corporate-events/:id',
        element: <CorporateEventDetails />,
      },
      {
        path: 'services/BestExhibitionStallDesgin',
        element: <Navigate to="/services/exhibition-stall-design" replace />,
      },
      {
        path: 'services/exhibition-events/:slug',
        element: <ExhibitionEventDetails />,
      },
      {
        path: 'services/InfluencerMarketingAgency',
        element: <Navigate to="/services/influencer-marketing" replace />,
      },
      {
        path: 'services/SingerAndCelebrityBooking',
        element: <Navigate to="/services/singer-celebrity-booking" replace />,
      },
      {
        path: 'services/WeddingPlanner&Management',
        element: <Navigate to="/services/wedding-planner" replace />,
      },
      {
        path: 'services/Photography&VedioServices',
        element: <Navigate to="/services/photography-video" replace />,
      },
      {
        path: 'services/Photography&VedioServices/:slug',
        element: <PhotographyServicesDetails />,
      },
      { path: 'services/SpecialEvent', element: <Navigate to="/services/special-events" replace /> },
      { path: 'services/SpecialEvent/:slug', element: <SpecialEventDetail /> },
      { path: 'services/VirtualEvent', element: <Navigate to="/services/virtual-events" replace /> },

      // top-level pages
      { path: 'About', element: <Navigate to="/about" replace /> },
      { path: 'media/video', element: <Navigate to="/media/videos" replace /> },
      { path: 'blog', element: <Navigate to="/media/blog" replace /> },
      { path: 'blog/:slug', element: <BlogDetails /> },

      // booking (camelCase)
      { path: 'bookAnArtists', element: <Navigate to="/book-artists" replace /> },
      { path: 'bookAnArtists/singer', element: <Navigate to="/book-artists/singers" replace /> },
      { path: 'bookAnArtists/dj', element: <Navigate to="/book-artists/djs" replace /> },
      { path: 'bookAnArtists/comedian', element: <Navigate to="/book-artists/comedians" replace /> },
      { path: 'bookAnArtists/magician', element: <Navigate to="/book-artists/magicians" replace /> },
      { path: 'bookAnArtists/dancer', element: <Navigate to="/book-artists/dancers" replace /> },
      { path: 'bookAnArtists/:rest', element: <Navigate to="/book-artists" replace /> },

      { path: '*', Component: NotFound },
    ],
  },

  // ---- admin ---------------------------------------------------------------
  { path: '/admin', element: <Navigate to="/admin/dashboard" replace /> },
  {
    path: '/admin/login',
    Component: AdminLogin,
    errorElement: <RouteError />,
  },
  { path: '/admin/forgot-password', Component: ForgotPassword },
  { path: '/admin/reset-password', Component: ResetPassword },
  { path: '/admin/change-password', Component: ChangePassword },

  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
    children: [
      { index: true, Component: Dashboard },
      { path: 'events', Component: EventsList },
      { path: 'events/add', element: <Navigate to="/admin/dashboard/events" replace /> },
      { path: 'hero', Component: AdminHero },
      { path: 'services', Component: ServiceManagement },
      { path: 'corporate-events', Component: AdminCorporateEvents },
      { path: 'exhibition-stall', Component: AdminExhibitionStall },
      { path: 'special-events', Component: AdminSpecialEvents },
      { path: 'faqs', Component: HomeFAQ },
      { path: 'artists', Component: AdminArtists },
      { path: 'comedians', Component: ComedianManagement },
      { path: 'dancers', Component: DancerManagement },
      { path: 'djs', Component: DjManagement },
      { path: 'magicians', Component: MagicianManagement },
      { path: 'singers', Component: SingerManagement },
      { path: 'influencers', Component: AdminInfluencers },
      { path: 'gallery', Component: MediaManagement },
      { path: 'videos', Component: VideoManagement },
      { path: 'testimonials', Component: TestimonialManagement },
      { path: 'team', Component: TeamManagement },
      { path: 'careers', Component: CareerManagement },
      { path: 'careers/applications', Component: ApplicationsList },
      { path: 'blogs', Component: BlogManagement },
      { path: 'portfolio', Component: PortfolioManagement },
      { path: 'media', Component: MediaList },
      { path: 'talent-hunt', Component: AdminTalentHunt },
      { path: 'vendors', Component: VendorManagement },
      { path: 'messages', Component: MediaList },
      { path: 'bookings', Component: BookingsList },
      {
        path: 'users',
        element: (
          <ProtectedRoute requiredRole="super_admin">
            <UsersList />
          </ProtectedRoute>
        ),
      },
      {
        path: 'action-logs',
        element: (
          <ProtectedRoute requiredRole="super_admin">
            <ActionLogs />
          </ProtectedRoute>
        ),
      },
      { path: 'settings', Component: AdminSettings },

      // legacy admin URLs
      { path: 'dashboard', element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'media-gallery', element: <Navigate to="/admin/dashboard/gallery" replace /> },
      { path: 'opportunities', element: <Navigate to="/admin/dashboard/artists" replace /> },
      { path: 'opportunities/vendors', element: <Navigate to="/admin/dashboard/vendors" replace /> },
      { path: 'opportunities/talent-hunt', element: <Navigate to="/admin/dashboard/talent-hunt" replace /> },
      { path: '*', Component: NotFound },
    ],
  },
]);

export default router;
