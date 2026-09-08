import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Star, ExternalLink } from "lucide-react";
import Reveal from "./Reveal";
import { useAdminData } from "../admin/context/AdminDataContext";

function GoogleGIcon({ className = "w-3 h-3" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "C";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function TestimonialCard({ card }) {
  const [imageError, setImageError] = useState(false);
  const hasImage = card.image && !imageError;
  const isGoogle = card.source === "google";

  return (
    <div className="bg-card rounded-xl p-7 sm:p-8 shadow-card border border-line/70 flex flex-col justify-between h-full relative group hover:shadow-soft hover:border-gold/50 transition-all duration-500">
      {/* Top section: Stars & Badges */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Star Rating */}
          <div
            className="flex items-center gap-1 text-gold"
            aria-label={`${card.rating} out of 5 stars`}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={
                  star <= card.rating
                    ? "fill-gold text-gold"
                    : "text-line fill-transparent"
                }
                strokeWidth={1.5}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Google Review Badge */}
            {isGoogle && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase border border-line bg-[#F8F6F2] text-ink-soft">
                <GoogleGIcon className="w-2.5 h-2.5" />
                Google
              </span>
            )}

            {/* Optional Featured Badge */}
            {card.featured && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-widest uppercase border border-gold/40 bg-gold/10 text-gold-dark">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Testimonial Quote */}
        <p className="font-serif italic text-ink/90 text-[15px] sm:text-[16px] leading-relaxed break-words">
          &ldquo;{card.review}&rdquo;
        </p>
      </div>

      {/* Bottom section: Divider & Client Info */}
      <div className="mt-6">
        <div className="hairline mb-5" />
        <div className="flex items-center justify-between gap-3 min-w-0">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Avatar / Fallback */}
            {hasImage ? (
              <img
                src={card.image}
                alt={card.name}
                onError={() => setImageError(true)}
                className="w-12 h-12 rounded-full object-cover border border-gold/30 shrink-0 shadow-sm"
                loading="lazy"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-full bg-gradient-to-br from-gold/20 via-gold-light/30 to-gold/10 border border-gold/30 flex items-center justify-center text-gold-dark font-display font-semibold text-sm shrink-0 shadow-sm"
                aria-hidden="true"
              >
                {getInitials(card.name)}
              </div>
            )}

            {/* Name, Category/Role & Date */}
            <div className="min-w-0 flex-1">
              <h4 className="font-display font-semibold text-ink text-[15px] sm:text-base leading-snug truncate">
                {card.name}
              </h4>
              <p className="text-xs text-ink-soft tracking-wider uppercase mt-0.5 truncate">
                {card.service}
              </p>
              {card.date && (
                <p className="text-[11px] text-ink-soft/70 mt-0.5 truncate">
                  {card.date}
                </p>
              )}
            </div>
          </div>

          {/* Optional Direct Google Review link */}
          {card.googleReviewUrl && (
            <a
              href={card.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full text-ink-soft/60 hover:text-[#1A73E8] hover:bg-gold/10 transition-colors shrink-0"
              title="Verified Google Review"
              aria-label="View verified review on Google"
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsCarousel() {
  const { testimonials } = useAdminData();
  const prefersReducedMotion = useReducedMotion();

  // Responsive items visible per slide
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter approved testimonials (and not hidden) & prioritize featured items
  const sortedTestimonials = useMemo(() => {
    if (!testimonials || !Array.isArray(testimonials)) return [];
    const approved = testimonials.filter((t) => t.approved === true && t.hidden !== true);
    return [...approved].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [testimonials]);

  // Normalized items supporting both manual testimonials and approved Google reviews
  const normalizedTestimonials = useMemo(() => {
    return sortedTestimonials.map((tst) => ({
      id: tst.id || Math.random().toString(),
      source: tst.source || "manual",
      googleReviewUrl: tst.googleReviewUrl || null,
      name:
        tst.googleReviewerName ||
        tst.customerName ||
        tst.clientName ||
        tst.name ||
        "Valued Client",
      service:
        tst.source === "google"
          ? "Google Review"
          : tst.eventType ||
            tst.customerRole ||
            tst.category ||
            tst.service ||
            "Client",
      rating:
        typeof tst.rating === "number"
          ? Math.max(1, Math.min(5, Math.round(tst.rating)))
          : 5,
      review: tst.review || tst.quote || tst.content || "",
      image:
        tst.googleReviewerPhoto ||
        tst.customerImage ||
        tst.image ||
        tst.avatar ||
        "",
      date: tst.date || "",
      featured: Boolean(tst.featured),
      approved: Boolean(tst.approved),
    }));
  }, [sortedTestimonials]);

  const totalItems = normalizedTestimonials.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  // Bounds safety when testimonials change
  useEffect(() => {
    if (totalItems > 0 && currentIndex >= totalItems) {
      setCurrentIndex(0);
    }
  }, [totalItems, currentIndex]);

  const handleNext = useCallback(() => {
    if (totalItems <= 1) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  }, [totalItems]);

  const handlePrev = useCallback(() => {
    if (totalItems <= 1) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  }, [totalItems]);

  const handleDotClick = (index) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Autoplay (every 5.5s) with pause on desktop hover & reduced motion check
  useEffect(() => {
    if (isHovered || prefersReducedMotion || totalItems <= 1) {
      return;
    }
    const timer = setInterval(() => {
      handleNext();
    }, 5500);

    return () => clearInterval(timer);
  }, [currentIndex, isHovered, prefersReducedMotion, totalItems, handleNext]);

  // Touch / swipe handling on mobile without preventing vertical page scroll
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  const handleTouchStart = (e) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 45;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  // Compute currently visible cards
  const visibleCards = useMemo(() => {
    if (totalItems === 0) return [];
    const count = Math.min(itemsPerPage, totalItems);
    const result = [];
    for (let i = 0; i < count; i++) {
      const idx = (currentIndex + i) % totalItems;
      result.push({
        ...normalizedTestimonials[idx],
        uniqueKey: `${normalizedTestimonials[idx].id}-${i}`,
      });
    }
    return result;
  }, [normalizedTestimonials, currentIndex, itemsPerPage, totalItems]);

  const slideVariants = {
    enter: (dir) => ({
      opacity: 0,
      x: prefersReducedMotion ? 0 : dir > 0 ? 30 : -30,
    }),
    center: {
      opacity: 1,
      x: 0,
    },
    exit: (dir) => ({
      opacity: 0,
      x: prefersReducedMotion ? 0 : dir > 0 ? -30 : 30,
    }),
  };

  return (
    <section
      id="testimonials"
      className="relative py-24 sm:py-28 bg-[#F8F6F2] overflow-hidden border-t border-line/60"
      aria-label="Client Testimonials"
    >
      {/* Subtle decorative background glow & lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section Header with Home page scroll-triggered reveal animations */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <Reveal>
            <p className="eyebrow mb-3">KIND WORDS</p>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="font-display font-medium text-3xl sm:text-4xl lg:text-5xl text-ink leading-[1.1] text-balance">
              What Our Clients Say
            </h2>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-4 text-[15px] sm:text-base text-ink-soft leading-relaxed">
              Real stories. Genuine emotions. Lasting relationships.
            </p>
          </Reveal>

          {/* Diamond Ornament: ─── ◇ ─── */}
          <Reveal delay={0.24}>
            <div
              className="flex items-center justify-center gap-3 my-6 text-gold"
              aria-hidden="true"
            >
              <span className="h-px w-12 sm:w-16 bg-gold/40" />
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                className="rotate-45 shrink-0 text-gold"
                fill="currentColor"
              >
                <rect
                  x="2"
                  y="2"
                  width="8"
                  height="8"
                  rx="1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              <span className="h-px w-12 sm:w-16 bg-gold/40" />
            </div>
          </Reveal>
        </div>

        {/* Carousel or Empty State with Scroll-Triggered Reveal */}
        {totalItems === 0 ? (
          <Reveal delay={0.28}>
            <div className="max-w-md mx-auto text-center p-8 sm:p-10 bg-card rounded-xl border border-line/70 shadow-card">
              <p className="font-display text-xl text-ink">
                Client stories coming soon.
              </p>
              <p className="text-ink-soft text-sm mt-2">
                We are currently preparing new testimonials and reviews from
                recent celebrations.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.28}>
            <div
              className="relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ touchAction: "pan-y" }}
            >
              {/* Cards Container with smooth slide/fade animation */}
              <div className="overflow-hidden min-h-[340px] flex items-stretch">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={`${currentIndex}-${itemsPerPage}`}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      duration: prefersReducedMotion ? 0.1 : 0.45,
                      ease: [0.25, 1, 0.5, 1],
                    }}
                    className={`grid w-full gap-6 items-stretch ${
                      itemsPerPage === 1
                        ? "grid-cols-1"
                        : itemsPerPage === 2
                        ? "grid-cols-1 sm:grid-cols-2"
                        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    }`}
                  >
                    {visibleCards.map((card) => (
                      <div key={card.uniqueKey} className="w-full flex flex-col">
                        <TestimonialCard card={card} />
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Centered Pagination Dots (Active: Champagne Gold, Inactive: Muted) */}
              {totalItems > 1 && (
                <div
                  className="mt-10 sm:mt-12 flex items-center justify-center gap-2.5"
                  role="tablist"
                  aria-label="Testimonial navigation"
                >
                  {normalizedTestimonials.map((t, idx) => {
                    const isActive = idx === currentIndex;
                    return (
                      <button
                        key={t.id || idx}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-label={`Go to testimonial ${idx + 1}`}
                        onClick={() => handleDotClick(idx)}
                        className={`transition-all duration-300 focus:outline-none rounded-full ${
                          isActive
                            ? "w-8 h-2.5 bg-gold shadow-sm"
                            : "w-2.5 h-2.5 bg-line hover:bg-gold/50"
                        }`}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
