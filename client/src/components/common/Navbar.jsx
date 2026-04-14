import { useState, useEffect, useCallback } from "react";
import logo from "../../assets/icons/MindsettlerLogo-removebg-preview.png";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // Navigation links
  const baseLinks = [
    { name: "Home", href: "/" },
    { name: "Booking", href: "/booking" },
    {name: "About Us", href:"/aboutus"},
    { name: "Events", href: "/events" },
    { name: "Resources", href: "/resources" },
    { name: "Corporate Services", href: "/corporate" },
    { name: "Contact", href: "/contact" },
  ];

  const navLinks = [...baseLinks];
  if (!user) {
    navLinks.push({ name: "Login", href: "/auth" });
  } else {
    if (user.role === "admin") navLinks.push({ name: "Admin", href: "/admin" });
    else navLinks.push({ name: "Profile", href: "/profile" });
  }

  return (
    <>
      <div className="fixed top-4 sm:top-6 z-30 w-full flex justify-center px-4 sm:px-0">
        <nav
          className={`w-full sm:w-[95%] lg:w-[90%] flex items-center justify-between 
                      px-4 sm:px-6 lg:px-10 py-3 sm:py-4
                      rounded-2xl sm:rounded-full transition-all duration-500 ease-in-out
                      ${
                        isScrolled || isMobileMenuOpen
                          ? "bg-white/90 backdrop-blur-xl border border-black/10 shadow-xl"
                          : "bg-white/10 backdrop-blur-lg border border-white/30 shadow-lg"
                      }`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center z-10">
            <img
              src={logo}
              alt="MindSettler Logo"
              className={`h-11 w-auto object-contain transition-all duration-500 
                          ${isScrolled || isMobileMenuOpen ? "brightness-100" : "brightness-125"}`}
            />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex justify-end items-center space-x-6 xl:space-x-8">
            {navLinks.map((link) => (
              <li key={link.name} className="group">
                <NavLink
                  to={link.href}
                  className={({ isActive }) => `
                    relative inline-block pb-1 cursor-pointer
                    text-sm xl:text-[15px] font-bold tracking-wide transition-all duration-300 whitespace-nowrap
                    ${isScrolled ? "text-[#583f7a]" : "text-[#e04073]"}
                    ${isActive ? "opacity-100" : "opacity-80 hover:opacity-100"}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {link.name}
                      <span
                        className={`absolute bottom-0 left-0 h-[2.5px] bg-current transition-all duration-300 ease-in-out
                          ${isActive ? "w-full" : "w-0 group-hover:w-full"}
                        `}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className={`lg:hidden p-2 rounded-lg transition-colors duration-300 z-10
                        ${isScrolled || isMobileMenuOpen 
                          ? "text-[#583f7a] hover:bg-[#583f7a]/10" 
                          : "text-[#e04073] hover:bg-white/10"}`}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300
                    ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white z-50 lg:hidden
                    transform transition-transform duration-300 ease-in-out shadow-2xl
                    ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <img
            src={logo}
            alt="MindSettler Logo"
            className="h-8 w-auto object-contain"
          />
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-lg text-[#583f7a] hover:bg-[#583f7a]/10 transition-colors"
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Links */}
        <nav className="p-4 overflow-y-auto h-[calc(100%-80px)]">
          <ul className="space-y-2">
            {navLinks.map((link, index) => (
              <li
                key={link.name}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
                className={`transform transition-all duration-300 ${
                  isMobileMenuOpen
                    ? "translate-x-0 opacity-100"
                    : "translate-x-4 opacity-0"
                }`}
              >
                <NavLink
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200
                    ${
                      isActive
                        ? "bg-linear-to-r from-[#583f7a] to-[#e04073] text-white shadow-md"
                        : "text-[#583f7a] hover:bg-[#583f7a]/10"
                    }
                  `}
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Optional: User info in mobile menu */}
          {user && (
            <div className="mt-8 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500">Logged in as</p>
              <p className="font-semibold text-[#583f7a]">
                {user.email || user.name || "User"}
              </p>
            </div>
          )}
        </nav>
      </div>
    </>
  );
};

export default Navbar;