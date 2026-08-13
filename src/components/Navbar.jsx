import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { Menu, X } from "lucide-react";
import Logomark from "./Logomark";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
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

  useEffect(() => {
    setMenuOpen(false);
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

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
                {NAV_LINKS.map((l) => (
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
                ))}
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
              {NAV_LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-sm tracking-[0.1em] uppercase font-medium ${isActive ? "text-gold-dark" : "text-ink/70"}`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
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
