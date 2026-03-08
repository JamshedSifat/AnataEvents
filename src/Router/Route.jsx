import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Componetns/Home/Home";
import Portfolio from "../Pages/Portfolio/Portfolio";
import About from "../Pages/About/About";
import Contact from "../Pages/Contact/Contact";
import Services from "../Componetns/Services/Services";
import CorporateEvent from "../Componetns/Services/CorporateEvent/CorporateEvent";
import BestExhibitionStallDesgin from "../Componetns/Services/BestExhibitionStallDesgin/BestExhibitionStallDesgin";
import InfluencerMarketingAgency from "../Componetns/Services/InfluencerMarketingAgency/InfluencerMarketingAgency";
import SingerAndCelebrityBooking from "../Componetns/Services/SingerAndCelebrityBooking/SingerAndCelebrityBooking";
import WeddingPlannerManagement from "../Componetns/Services/WeddingPlannerManagement/WeddingPlannerManagement";
import PhotographyVedioServices from "../Componetns/Services/PhotographyVedioServices/PhotographyVedioServices";
import SpecialEvent from "../Componetns/Services/SpecialEvent/SpecialEvent";
import VirtualEvent from "../Componetns/Services/VirtualEvent/VirtualEvent";

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
      {
        path: '/services/CorporateEvent',
        element: <CorporateEvent></CorporateEvent>,
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
        path: '/services/SpecialEvent',
        element: <SpecialEvent></SpecialEvent>,
        loader: setTitle("Special Events - Ananta Events | Unique Event Planning")
      },
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
        path: '/portfolio',
        element: <Portfolio></Portfolio>,
        loader: setTitle("Portfolio - Ananta Events | Our Successful Events Gallery")
      },
      {
        path: '/contact',
        element: <Contact></Contact>,
        loader: setTitle("Contact Us - Ananta Events | Get Free Event Planning Consultation")
      },
    ]
  },
]);