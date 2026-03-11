import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isBookAnArtistOpen, setIsBookAnArtistOpen] = useState(false);
  const [isOpportunityOpen, setIsOpportunityOpen] = useState(false);
  
  const location = useLocation();

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services", hasDropdown: true },
    { name: "Book an Artist", path: "/bookAnArtists", hasDropdown: true },
    { name: "Opportunities", path: "/opportunities", hasDropdown: true },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Contact Us", path: "/contact" },
  ];

  const servicesDropdown = [
    { name: "Corporate Event", path: "/services/CorporateEvent" },
    { name: "Best Exhibition stall desgin and Fabrication company dhaka bangladesh", path: "/services/BestExhibitionStallDesgin" },
    { name: "Influencer Marketing Agency", path: "/services/InfluencerMarketingAgency" },
    { name: "Singer & Celebrity Booking", path: "/services/SingerAndCelebrityBooking" },
    { name: "Wedding Planner & Management", path: "/services/WeddingPlanner&Management" },
    { name: "Photography & Vedio Services", path: "/services/Photography&VedioServices" },
    { name: "Special Event", path: "/services/SpecialEvent" },
    { name: "Virtual Event", path: "/services/VirtualEvent" }
   
  ];

  const bookAnArtistDropdown = [
    { name: "Singer", path: "/bookAnArtists/singer" },
    { name: "DJ", path: "/bookAnArtists/dj" },
    { name: "Celebrity", path: "/bookAnArtists/celebrity" },
    { name: "Dancer / Choreographer", path: "/bookAnArtists/dancer" },
    { name: "Magician", path: "/bookAnArtists/magician" },
    { name: "Comedian", path: "/bookAnArtists/comedian" },
  ];

  const opportunitiesDropdown = [
    { name: "Vendor Registration", path: "/opportunities/vendor-registration" },
    { name: "Talent Hunt", path: "/opportunities/talent-hunt" },
    { name: "Artist Registration", path: "/opportunities/artist-registration" },
    { name: "Become a Partner", path: "/opportunities/partner-program" },
    { name: "Career Opportunities", path: "/opportunities/careers" }
  ];

  // Function to handle navigation with smooth scroll to top
  const handleNavigation = (path) => {
    // Close all dropdowns
    setIsServicesOpen(false);
    setIsBookAnArtistOpen(false);
    setIsOpportunityOpen(false);
    setIsOpen(false);
    
    // If it's the same page, scroll to top
    if (location.pathname === path) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Get dropdown data based on link name
  const getDropdownData = (linkName) => {
    if (linkName === "Services") return { items: servicesDropdown, isOpen: isServicesOpen, setOpen: setIsServicesOpen };
    if (linkName === "Book an Artist") return { items: bookAnArtistDropdown, isOpen: isBookAnArtistOpen, setOpen: setIsBookAnArtistOpen };
    if (linkName === "Opportunities") return { items: opportunitiesDropdown, isOpen: isOpportunityOpen, setOpen: setIsOpportunityOpen };
    return null;
  };

  // Desktop Navigation
  const renderDesktopNavLinks = () =>
    navLinks.map((link) => {
      if (link.hasDropdown) {
        const dropdown = getDropdownData(link.name);
        
        return (
          <div
            key={link.name}
            className="relative"
            onMouseEnter={() => dropdown.setOpen(true)}
            onMouseLeave={() => dropdown.setOpen(false)}
          >
            <NavLink
              to={link.path}
              onClick={() => handleNavigation(link.path)}
              className={({ isActive }) =>
                `px-6 py-3 rounded-lg hover:bg-base-200 hover:text-primary transition-all duration-300 flex items-center space-x-1 ${
                  isActive ? 'text-primary bg-base-200' : 'text-base-content'
                }`
              }
            >
              <span>{link.name}</span>
              <span className={`transition-transform duration-300 ${dropdown.isOpen ? "rotate-180" : ""}`}>
                ▼
              </span>
            </NavLink>

            {/* Dropdown Menu */}
            {dropdown.isOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-base-100 rounded-xl shadow-lg border border-base-300 z-50 p-2">
                {dropdown.items.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={({ isActive }) =>
                      `block px-4 py-2 rounded-lg transition-all duration-300 ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-base-content hover:bg-primary hover:text-white'
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        );
      }

      return (
        <NavLink
          key={link.name}
          to={link.path}
          onClick={() => handleNavigation(link.path)}
          className={({ isActive }) =>
            `px-6 py-3 rounded-lg hover:bg-base-200 hover:text-primary transition-all duration-300 ${
              isActive ? 'text-primary bg-base-200' : 'text-base-content'
            }`
          }
        >
          {link.name}
        </NavLink>
      );
    });

  // Mobile Navigation
  const renderMobileNavLinks = () =>
    navLinks.map((link) => {
      if (link.hasDropdown) {
        const dropdown = getDropdownData(link.name);
        
        return (
          <div key={link.name} className="space-y-1">
            <button
              onClick={() => dropdown.setOpen(!dropdown.isOpen)}
              className={`w-full flex justify-between items-center px-4 py-3 rounded-lg hover:bg-base-200 hover:text-primary transition-all duration-300 ${
                location.pathname === link.path ? 'text-primary bg-base-200' : 'text-base-content'
              }`}
            >
              <span>{link.name}</span>
              <span className={`transition-transform duration-300 ${dropdown.isOpen ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>

            {dropdown.isOpen && (
              <div className="ml-4 space-y-1">
                {dropdown.items.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={({ isActive }) =>
                      `block px-4 py-2 rounded-lg transition-all duration-300 ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-base-content hover:bg-primary hover:text-white'
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        );
      }

      return (
        <NavLink
          key={link.name}
          to={link.path}
          onClick={() => handleNavigation(link.path)}
          className={({ isActive }) =>
            `block px-4 py-3 rounded-lg hover:bg-base-200 hover:text-primary transition-all duration-300 ${
              isActive ? 'text-primary bg-base-200 border-l-4 border-primary' : 'text-base-content'
            }`
          }
        >
          {link.name}
        </NavLink>
      );
    });

  return (
    <nav className="bg-base-100 shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 ">
            <NavLink 
              to="/" 
              onClick={() => handleNavigation("/")}
              className="text-2xl font-bold"
            >
             <img
                src='/public/Ananta_Logo.png'
                   alt='anantaEvents'
                    className="w-32 h-auto object-contain "
/>
            </NavLink>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {renderDesktopNavLinks()}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
              Get Quote
            </button>
          </div>

          {/* Mobile Toggle Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-base-content hover:text-primary transition-colors duration-300 p-2 rounded-lg hover:bg-base-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-base-100 shadow-lg border-t border-base-200">
            <div className="px-4 py-6 space-y-2">
              {renderMobileNavLinks()}
              
              <button 
                onClick={() => setIsOpen(false)}
                className="w-full mt-6 bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Get Quote
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;