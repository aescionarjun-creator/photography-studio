import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingButtons from "./components/FloatingButtons";
import { useLenis, scrollToTop } from "./lib/useLenis";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import Gallery from "./pages/Gallery";
import Films from "./pages/Films";
import Branches from "./pages/Branches";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

function PageWrapper({ children }) {
  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
    >
      {children}
    </motion.main>
  );
}

export default function App() {
  useLenis();
  const location = useLocation();

  useEffect(() => {
    scrollToTop();
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-bg text-ink">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
          <Route path="/services" element={<PageWrapper><Services /></PageWrapper>} />
          <Route path="/portfolio" element={<PageWrapper><Portfolio /></PageWrapper>} />
          <Route path="/gallery" element={<PageWrapper><Gallery /></PageWrapper>} />
          <Route path="/films" element={<PageWrapper><Films /></PageWrapper>} />
          <Route path="/branches" element={<PageWrapper><Branches /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
          <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
