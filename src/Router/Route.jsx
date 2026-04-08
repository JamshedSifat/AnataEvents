import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Componetns/Home/Home";
import Portfolio from "../Pages/Portfolio/Portfolio";
import About from "../Pages/About/About";
import Contact from "../Pages/Contact/Contact";
import Services from "../Componetns/Services/Services";
import CorporateEvent from "../Componetns/Services/CorporateEvent/CorporateEvent";
import CorporateEventDetails from "../Componetns/Services/CorporateEvent/CorporateEventDetails";
import BestExhibitionStallDesgin from "../Componetns/Services/BestExhibitionStallDesgin/BestExhibitionStallDesgin";
import InfluencerMarketingAgency from "../Componetns/Services/InfluencerMarketingAgency/InfluencerMarketingAgency";
import SingerAndCelebrityBooking from "../Componetns/Services/SingerAndCelebrityBooking/SingerAndCelebrityBooking";
import WeddingPlannerManagement from "../Componetns/Services/WeddingPlannerManagement/WeddingPlannerManagement";
import PhotographyVedioServices from "../Componetns/Services/PhotographyVedioServices/PhotographyVedioServices";

import VirtualEvent from "../Componetns/Services/VirtualEvent/VirtualEvent";
import BlogDetails from "../Pages/BlogDetails/BlogDetails";
import BlogCard from "../Componetns/BlogCard/BlogCard";
import BookAnArtists from "../Pages/BookAnArtists/BookAnArtists";
import Singer from "../Pages/BookAnArtists/Singers/Singer";
import Dj from "../Pages/BookAnArtists/Dj/Dj";
import Comedian from "../Pages/BookAnArtists/Comedian/Comedian";
import Magician from "../Pages/BookAnArtists/Magician/Magician";
import Dancer from "../Pages/BookAnArtists/Dancer/Dancer";
import Opportunities from "../Pages/Opportunities/Opportunities";
import TalentHunt from "../Pages/Opportunities/TalentHunt/TalentHunt";
import ArtistRegistration from "../Pages/Opportunities/ArtistRegistration/ArtistRegistration";
import CareerOpportunities from "../Pages/Opportunities/CareerOpportunities/CareerOpportunities";
import VendorRegistration from "../Pages/Opportunities/VendorRegistration/VendorRegistration";
import PhotographyServicesDetails from "../Componetns/Services/PhotographyVedioServices/PhotographyServicesDetails";
import SpecialEventList from "../Componetns/Services/SpecialEvent/SpecialEventList";
import SpecialEventDetail from "../Componetns/Services/SpecialEvent/SpecialEventDetail";
import AwardShowDetail from "../Componetns/Services/SpecialEvent/Details/AwardShowDetail";
import ConvocationDetail from "../Componetns/Services/SpecialEvent/Details/ConvocationDetail";
import ReunionDetail from "../Componetns/Services/SpecialEvent/Details/ReunionDetail";
import FashionShowDetail from "../Componetns/Services/SpecialEvent/Details/FashionShowDetail";
import MusicConcertDetail from "../Componetns/Services/SpecialEvent/Details/MusicConcertDetail";
import SportsManagementDetail from "../Componetns/Services/SpecialEvent/Details/SportsManagementDetail";
import LaserShowDetail from "../Componetns/Services/SpecialEvent/Details/LaserShowDetail";

// Title setter function
const setTitle = (title) => {
  return () => {
    document.title = title;
    return null;
  };
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        index: true,
        Component: Home,
        loader: setTitle("Home - Ananta Events | Best Event Management Company in Bangladesh")
      },
      {
        path: '/services',
        element: <Services></Services>,
        loader: setTitle("Services - Ananta Events | Professional Event Planning Services")
      },
      // Corporate Event Routes
      {
        path: '/services/CorporateEvent',
        element: <CorporateEvent></CorporateEvent>,
        loader: setTitle("Corporate Events - Ananta Events | Business Event Management")
      },
      {
        path: '/services/CorporateEvent/:id',
        element: <CorporateEventDetails></CorporateEventDetails>,
        loader: setTitle("Corporate Events - Ananta Events | Business Event Management")
      },
      {
        path: '/services/BestExhibitionStallDesgin',
        element: <BestExhibitionStallDesgin></BestExhibitionStallDesgin>,
        loader: setTitle("Exhibition Stall Design - Ananta Events | Professional Booth Design")
      },
      {
        path: '/services/InfluencerMarketingAgency',
        element: <InfluencerMarketingAgency></InfluencerMarketingAgency>,
        loader: setTitle("Influencer Marketing - Ananta Events | Digital Marketing Agency")
      },
      {
        path: '/services/SingerAndCelebrityBooking',
        element: <SingerAndCelebrityBooking></SingerAndCelebrityBooking>,
        loader: setTitle("Celebrity Booking - Ananta Events | Singer & Artist Management")
      },
      {
        path: '/services/WeddingPlanner&Management',
        element: <WeddingPlannerManagement></WeddingPlannerManagement>,
        loader: setTitle("Wedding Planning - Ananta Events | Dream Wedding Organizers")
      },
      {
        path: '/services/Photography&VedioServices',
        element: <PhotographyVedioServices></PhotographyVedioServices>,
        loader: setTitle("Photography & Video - Ananta Events | Professional Event Coverage")
      },
      {
        path: '/services/Photography&VedioServices/:id',
        element: <PhotographyServicesDetails></PhotographyServicesDetails>,
        loader: setTitle("Photography & Video Details - Ananta Events | Professional Event Coverage")
      },
      
      // ============ SPECIAL EVENT ROUTES ============
      {
        path: '/services/SpecialEvent',
        element: <SpecialEventList></SpecialEventList>,
        loader: setTitle("Special Events - Ananta Events | Unique Event Planning")
      },
      // Dynamic Special Event Route
      {
        path: '/services/SpecialEvent/:eventId',
        element: <SpecialEventDetail></SpecialEventDetail>,
        loader: setTitle("Special Event Details - Ananta Events | Professional Event Management")
      },
      // Individual Special Event Routes (Optional - for direct access)
      {
        path: '/services/SpecialEvent/award-show',
        element: <AwardShowDetail></AwardShowDetail>,
        loader: setTitle("Award Show Organizers - Ananta Events | Glamorous Event Management")
      },
      {
        path: '/services/SpecialEvent/convocation-event',
        element: <ConvocationDetail></ConvocationDetail>,
        loader: setTitle("University Convocation - Ananta Events | Academic Event Planning")
      },
      {
        path: '/services/SpecialEvent/reunion-event',
        element: <ReunionDetail></ReunionDetail>,
        loader: setTitle("Reunion Event Planner - Ananta Events | Alumni Gatherings")
      },
      {
        path: '/services/SpecialEvent/fashion-show',
        element: <FashionShowDetail></FashionShowDetail>,
        loader: setTitle("Fashion Show Organizer - Ananta Events | Runway Event Management")
      },
      {
        path: '/services/SpecialEvent/music-concert',
        element: <MusicConcertDetail></MusicConcertDetail>,
        loader: setTitle("Live Music Concert - Ananta Events | Concert Organization Services")
      },
      {
        path: '/services/SpecialEvent/laser-show',
        element: <LaserShowDetail></LaserShowDetail>,
        loader: setTitle("Laser Show & Fireworks - Ananta Events | Professional Display Services")
      },
      {
       path: '/services/SpecialEvent/sports-management',
       element: <SportsManagementDetail></SportsManagementDetail>,
        loader: setTitle("Sports Event Management - Ananta Events | Professional Sports Organization")
},
     
      // ============ END OF SPECIAL EVENT ROUTES ============

      {
        path: '/services/VirtualEvent',
        element: <VirtualEvent></VirtualEvent>,
        loader: setTitle("Virtual Events - Ananta Events | Online Event Management")
      },
      {
        path: '/About',
        element: <About></About>,
        loader: setTitle("About Us - Ananta Events | 16+ Years Experience in Event Planning")
      },
      {
        path: '/blog',
        element: <BlogCard></BlogCard>,
        loader: setTitle("Blog - Ananta Events | Event Planning Tips & Ideas")
      },
      {
        path: '/blog/:id',
        element: <BlogDetails></BlogDetails>,
        loader: setTitle("Blog Details - Ananta Events | Event Planning Article")
      },
      {
        path: '/portfolio',
        element: <Portfolio></Portfolio>,
        loader: setTitle("Portfolio - Ananta Events | Our Successful Events Gallery")
      },
      {
        path: '/contact',
        element: <Contact></Contact>,
        loader: setTitle("Contact Us - Ananta Events | Get Free Event Planning Consultation")
      },
      {
        path: '/bookAnArtists',
        element: <BookAnArtists></BookAnArtists>,
        loader: setTitle("Book Artists - Ananta Events | Hire Professional Performers")
      },
      {
        path: '/bookAnArtists/singer',
        element: <Singer></Singer>,
        loader: setTitle("Book Singers - Ananta Events | Hire Professional Singers")
      },
      {
        path: '/bookAnArtists/dj',
        element: <Dj></Dj>,
        loader: setTitle("Book DJs - Ananta Events | Hire Professional DJs")
      },
      {
        path: '/bookAnArtists/comedian',
        element: <Comedian></Comedian>,
        loader: setTitle("Book Comedians - Ananta Events | Hire Professional Comedians")
      },
      {
        path: '/bookAnArtists/magician',
        element: <Magician></Magician>,
        loader: setTitle("Book Magicians - Ananta Events | Hire Professional Magicians")
      },
      {
        path: '/bookAnArtists/dancer',
        element: <Dancer></Dancer>,
        loader: setTitle("Book Choreographers - Ananta Events | Hire Professional Dancers")
      },
      {
        path: '/opportunities',
        element: <Opportunities></Opportunities>
      },
      {
        path: '/opportunities/talent-hunt',
        element: <TalentHunt></TalentHunt>
      },
      {
        path: '/opportunities/artist-registration',
        element: <ArtistRegistration></ArtistRegistration>
      },
      {
        path: '/opportunities/careers',
        element: <CareerOpportunities></CareerOpportunities>
      },
      {
        path: '/opportunities/vendor-registration',
        element: <VendorRegistration></VendorRegistration>
      },
    ]
  },
]);