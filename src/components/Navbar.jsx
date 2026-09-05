import { useEffect, useState, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { Menu, X, ChevronDown, Camera, Frame } from "lucide-react";
import Logomark from "./Logomark";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services", hasDropdown: true },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/gallery", label: "Gallery" },
  { to: "/films", label: "Films" },
  { to: "/branches", label: "Branches" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const location = useLocation();
  const [visible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setServicesOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setServicesOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const isServicesActive =
    location.pathname === "/services" || location.pathname === "/frames";

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
            className={`fixed top-0 left-0 right-0 z-50 bg-bg-soft/95 backdrop-blur-md border-b transition-shadow duration-300 ${
              scrolled ? "border-line shadow-card" : "border-transparent"
            }`}
          >
            <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[84px] flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3 group">
                <Logomark size={34} />
                <span className="font-display text-lg tracking-[0.22em] text-ink">SUBASH STUDIO</span>
              </Link>

              <nav className="hidden lg:flex items-center gap-9">
                {NAV_LINKS.map((l) => {
                  if (l.hasDropdown) {
                    return (
                      <div
                        key={l.to}
                        ref={dropdownRef}
                        className="relative"
                        onMouseEnter={() => setServicesOpen(true)}
                        onMouseLeave={() => setServicesOpen(false)}
                      >
                        <NavLink
                          to={l.to}
                          onClick={() => setServicesOpen((prev) => !prev)}
                          className={({ isActive }) =>
                            `text-[13px] tracking-[0.08em] uppercase font-medium transition-colors duration-300 relative py-1 flex items-center gap-1 ${
                              isActive || isServicesActive
                                ? "text-gold-dark"
                                : "text-ink/70 hover:text-ink"
                            }`
                          }
                        >
                          {() => (
                            <>
                              <span>{l.label}</span>
                              <ChevronDown
                                size={13}
                                className={`transition-transform duration-200 ${
                                  servicesOpen ? "rotate-180" : ""
                                }`}
                              />
                              {isServicesActive && (
                                <motion.span
                                  layoutId="nav-underline"
                                  className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-gold"
                                />
                              )}
                            </>
                          )}
                        </NavLink>

                        <AnimatePresence>
                          {servicesOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 8, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 6, scale: 0.98 }}
                              transition={{ duration: 0.18 }}
                              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-[#FDFBF7] border border-[#E4D3A6]/80 rounded-2xl p-2.5 shadow-xl backdrop-blur-lg z-50 space-y-1"
                            >
                              <Link
                                to="/services"
                                onClick={() => setServicesOpen(false)}
                                className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F4EFE6] transition-colors group"
                              >
                                <div className="w-9 h-9 rounded-lg bg-[#EFE9DD] flex items-center justify-center text-[#9C7B3D] shrink-0 group-hover:bg-[#C9A669] group-hover:text-white transition-colors">
                                  <Camera size={18} />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-semibold text-[#1C1B19] tracking-wider uppercase">
                                    Order Booking
                                  </div>
                                  <div className="text-[11px] text-[#6F6A62] mt-0.5 leading-snug">
                                    Studio packages, wedding shoots & cinematic films
                                  </div>
                                </div>
                              </Link>

                              <Link
                                to="/frames"
                                onClick={() => setServicesOpen(false)}
                                className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F4EFE6] transition-colors group"
                              >
                                <div className="w-9 h-9 rounded-lg bg-[#EFE9DD] flex items-center justify-center text-[#9C7B3D] shrink-0 group-hover:bg-[#C9A669] group-hover:text-white transition-colors">
                                  <Frame size={18} />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-semibold text-[#1C1B19] tracking-wider uppercase flex items-center gap-1.5">
                                    <span>Order Frames</span>
                                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#C9A669]/20 text-[#9C7B3D] font-bold">
                                      NEW
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-[#6F6A62] mt-0.5 leading-snug">
                                    Handcrafted wood frames with photo upload
                                  </div>
                                </div>
                              </Link>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      className={({ isActive }) =>
                        `text-[13px] tracking-[0.08em] uppercase font-medium transition-colors duration-300 relative py-1 ${
                          isActive ? "text-gold-dark" : "text-ink/70 hover:text-ink"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {l.label}
                          {isActive && (
                            <motion.span
                              layoutId="nav-underline"
                              className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-gold"
                            />
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </nav>

              <div className="hidden lg:flex items-center gap-5">
                <Link
                  to="/contact"
                  className="px-5 py-2.5 bg-ink text-bg-soft text-[12px] tracking-[0.12em] uppercase font-semibold rounded-full hover:bg-gold-dark transition-colors duration-300 shadow-card"
                >
                  Book a Shoot
                </Link>
              </div>

              <button
                className="lg:hidden text-ink"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
            className="fixed top-[84px] left-0 right-0 z-40 bg-bg-soft border-b border-line lg:hidden overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {NAV_LINKS.map((l) => {
                if (l.hasDropdown) {
                  return (
                    <div key={l.to} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-sm tracking-[0.1em] uppercase font-medium text-ink/90">
                        <NavLink
                          to={l.to}
                          onClick={() => setMenuOpen(false)}
                          className={({ isActive }) =>
                            isActive ? "text-gold-dark font-semibold" : "text-ink/80"
                          }
                        >
                          {l.label}
                        </NavLink>
                        <button
                          type="button"
                          onClick={() => setMobileServicesOpen((v) => !v)}
                          className="p-1 text-ink/60"
                          aria-label="Toggle services options"
                        >
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-200 ${
                              mobileServicesOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {mobileServicesOpen && (
                        <div className="pl-4 flex flex-col gap-3 py-2 border-l-2 border-[#C9A669]/40 ml-1">
                          <NavLink
                            to="/services"
                            onClick={() => setMenuOpen(false)}
                            className={({ isActive }) =>
                              `text-xs tracking-[0.08em] uppercase font-medium flex items-center gap-2 ${
                                isActive ? "text-gold-dark font-semibold" : "text-ink/70"
                              }`
                            }
                          >
                            <Camera size={14} className="text-[#C9A669]" />
                            <span>Order Booking</span>
                          </NavLink>
                          <NavLink
                            to="/frames"
                            onClick={() => setMenuOpen(false)}
                            className={({ isActive }) =>
                              `text-xs tracking-[0.08em] uppercase font-medium flex items-center gap-2 ${
                                isActive ? "text-gold-dark font-semibold" : "text-ink/70"
                              }`
                            }
                          >
                            <Frame size={14} className="text-[#C9A669]" />
                            <span className="flex items-center gap-2">
                              <span>Order Frames</span>
                              <span className="text-[8px] px-1.5 py-0.2 rounded bg-[#C9A669]/20 text-[#9C7B3D] font-bold">
                                NEW
                              </span>
                            </span>
                          </NavLink>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `text-sm tracking-[0.1em] uppercase font-medium ${
                        isActive ? "text-gold-dark" : "text-ink/70"
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                );
              })}
              <div className="flex items-center gap-5 pt-2">
                <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="text-ink/60"><FaWhatsapp size={20} /></a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-ink/60"><FaInstagram size={20} /></a>
              </div>
              <Link to="/contact" onClick={() => setMenuOpen(false)} className="mt-2 px-5 py-3 bg-ink text-bg-soft text-center text-[12px] tracking-[0.12em] uppercase font-semibold rounded-full">
                Book a Shoot
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
