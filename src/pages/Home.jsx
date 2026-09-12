import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowDown, Play } from "lucide-react";
import * as ReactCountUp from "react-countup";
const CountUp = ReactCountUp.default?.default || ReactCountUp.default;
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";
import FloralCorners from "../components/FloralCorners";
import { BotanicalBranch, BotanicalCorner, BotanicalSprig } from "../components/BotanicalDecoration";
import WhyChooseUs from "../components/WhyChooseUs";
import TestimonialsCarousel from "../components/TestimonialsCarousel";
import { portfolioProjects as defaultPortfolio } from "../data/portfolio";
import { useAdminData } from "../admin/context/AdminDataContext";

const defaultStats = [
  { end: 12, suffix: "+", label: "Years Behind the Lens" },
  { end: 1400, suffix: "+", label: "Happy Clients" },
  { end: 2, suffix: "", label: "Studio Branches" },
  { end: 98, suffix: "%", label: "Client Satisfaction" },
];

const fallbackSelectedWork = [
  {
    title: "Forever Begins",
    category: "Wedding",
    image: "/images/portfolio/wedding-01.jpg",
  },
  {
    title: "A Beautiful Beginning",
    category: "Wedding",
    image: "/images/portfolio/wedding-02.jpg",
  },
  {
    title: "The Wedding Story",
    category: "Wedding",
    image: "/images/portfolio/wedding-03.jpg",
  },
  {
    title: "Two Hearts",
    category: "Couple",
    image: "/images/portfolio/couple-01.jpg",
  },
  {
    title: "Together",
    category: "Couple",
    image: "/images/portfolio/couple-02.jpg",
  },
  {
    title: "Little Moments",
    category: "Baby",
    image: "/images/portfolio/baby-01.jpg",
  },
];

export default function Home() {
  const { websiteContent, portfolio: adminPortfolio } = useAdminData();

  const homeData = websiteContent?.home || {};
  const heroEyebrow = homeData.heroHeading || "FINE PHOTOGRAPHY & CINEMATIC FILMS";
  const heroSub = homeData.heroTagline || "Preserving timeless heritage, profound emotions, and authentic human celebrations across generations.";

  const displayPortfolio = (adminPortfolio && adminPortfolio.length >= 6
    ? adminPortfolio.filter((p) => p.published !== false)
    : defaultPortfolio && defaultPortfolio.length >= 6
    ? defaultPortfolio
    : fallbackSelectedWork
  ).map((p, idx) => ({
    ...p,
    title: p.title || fallbackSelectedWork[idx]?.title || "Portfolio",
    category: p.category || fallbackSelectedWork[idx]?.category || "Featured",
    image: p.coverImage || p.image || p.imageUrl || fallbackSelectedWork[idx]?.image || "/images/portfolio/wedding-01.jpg",
  }));

  return (
    <>
      <Seo title="Home" description="SUBASH STUDIO — a premium photography and cinematography house crafting timeless wedding, portrait and editorial imagery across three branches." />

      {/* SECTION 2 — HERO */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#FBF8F2] via-[#F8F5EF] to-[#F4EFE6] pt-[84px] border-b border-line/40">
        <FloralCorners />

        <div className="relative max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_1.1fr] items-center">
          {/* Left — copy */}
          <div className="relative z-10 flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-14 lg:py-16">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="eyebrow mb-6 tracking-[0.32em]"
            >
              {heroEyebrow}
            </motion.p>

            <h1 className="font-display font-semibold leading-[0.95] tracking-tight">
              <motion.span
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.9 }}
                className="block text-6xl sm:text-7xl lg:text-[5.5rem] text-ink"
              >
                Subash
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.9 }}
                className="block text-6xl sm:text-7xl lg:text-[5.5rem] text-gold-dark font-normal italic"
              >
                Photography
              </motion.span>
            </h1>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex items-center gap-3 my-7 origin-left"
            >
              <span className="h-px w-14 bg-gold/60" />
              <svg width="14" height="14" viewBox="0 0 14 14" className="text-gold shrink-0">
                <path d="M7 0 L9 7 L7 14 L5 7 Z" fill="currentColor" />
              </svg>
              <span className="h-px w-14 bg-gold/60" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="max-w-md text-ink-soft text-[15px] sm:text-base leading-relaxed"
            >
              {heroSub}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95, duration: 0.8 }}
              className="flex flex-wrap items-center gap-4 mt-9"
            >
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-gold text-ink text-[13px] font-semibold tracking-[0.1em] uppercase rounded-full shadow-soft hover:bg-gold-dark hover:text-bg-soft transition-colors duration-300"
              >
                Book a Shoot
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/portfolio"
                className="group inline-flex items-center gap-2 px-7 py-3.5 border border-gold/70 text-ink text-[13px] font-semibold tracking-[0.1em] uppercase rounded-full hover:bg-ink hover:border-ink hover:text-bg-soft transition-colors duration-300"
              >
                Explore Our Work
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {/* SCROLL DOWN centered below buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="flex flex-col items-center gap-2 mt-12 sm:mt-14"
            >
              <span className="text-ink-soft/70 text-[10px] tracking-[0.32em] uppercase font-medium">Scroll Down</span>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="w-9 h-9 rounded-full border border-gold/70 flex items-center justify-center text-gold-dark"
              >
                <ArrowDown size={14} />
              </motion.div>
            </motion.div>
          </div>

          {/* Right — image with soft center transition */}
          <motion.div
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
            className="relative w-full h-[380px] sm:h-[480px] lg:h-full lg:min-h-[640px] overflow-hidden"
          >
            <img
              src="/images/storefront.jpg"
              alt="SUBASH STUDIO storefront"
              className="w-full h-full object-cover object-center"
            />
            {/* Soft center fade / gradient transition between left text and right image */}
            <div className="absolute inset-y-0 left-0 w-28 sm:w-40 bg-gradient-to-r from-[#F8F5EF] via-[#F8F5EF]/60 to-transparent hidden lg:block pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#F8F5EF]/40 to-transparent lg:hidden pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#F8F5EF]/25 via-transparent to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* SECTION 3 — STATISTICS BAR */}
      <section className="bg-[#FBF8F2] border-b border-line/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 sm:py-14 grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-line/70">
          {defaultStats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className={`text-center py-4 sm:py-0 px-4 ${i === 1 ? "border-r-0 lg:border-r border-line/70" : ""}`}>
              <p className="font-display text-4xl sm:text-5xl lg:text-[50px] text-gold-dark font-medium leading-none">
                <CountUp end={s.end} duration={2.2} enableScrollSpy scrollSpyOnce />
                {s.suffix}
              </p>
              <p className="mt-2.5 text-[11px] sm:text-xs tracking-[0.16em] uppercase font-semibold text-ink-soft">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SECTION 4 — WHY CHOOSE US */}
      <WhyChooseUs />

      {/* SECTION 5 — OUR CRAFT / FOUNDER STORY */}
      <section className="relative w-full bg-[#FBF8F2] border-b border-line/50 overflow-hidden">
        {/* Subtle decorative botanical elements near outer edges */}
        <div className="absolute top-1/2 -right-8 -translate-y-1/2 pointer-events-none select-none hidden 2xl:block opacity-30">
          <BotanicalBranch className="w-56 h-56" rotate={-45} />
        </div>
        <div className="absolute -bottom-8 -left-8 pointer-events-none select-none hidden xl:block opacity-25">
          <BotanicalSprig className="w-48 h-48" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 sm:py-28 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center relative z-10">
          {/* Left: Founder portrait with secondary overlapping B&W portrait (clean, no wooden frame) */}
          <Reveal className="relative max-w-md sm:max-w-lg mx-auto lg:max-w-none w-full">
            <div className="relative rounded-md overflow-hidden shadow-card aspect-[4/5] bg-bg-soft">
              <img
                src="/images/shyam chandru.jpeg"
                alt="Subash - Founder and Lead Photographer at SUBASH STUDIO"
                className="w-full h-full object-cover object-top"
              />
            </div>
            {/* Small overlapping secondary black-and-white portrait at bottom/right */}
            <div className="hidden sm:flex absolute -bottom-6 -right-4 sm:-bottom-8 sm:-right-6 w-36 h-36 sm:w-44 sm:h-44 rounded-md overflow-hidden shadow-card border-4 border-bg-soft bg-white z-10">
              <img
                src="/images/shyam chandru.jpeg"
                alt="Subash at work behind the lens"
                className="w-full h-full object-cover object-center grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </Reveal>

          {/* Right: Content, signature and video action */}
          <div className="flex flex-col justify-center">
            <Reveal>
              <span className="eyebrow mb-3 block">OUR CRAFT</span>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="font-display font-medium text-3xl sm:text-4xl lg:text-[44px] leading-[1.15] text-ink tracking-tight">
                Photography that feels less like a service, more like a keepsake.
              </h2>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-6 text-ink-soft text-[15px] sm:text-base leading-relaxed">
                For over a decade, SUBASH STUDIO has documented weddings, families and milestones across Tamil Nadu with an editorial eye and an unhurried hand. What began as a single studio in Mylapore has grown into three branches, one shared philosophy: light, honesty, and a story worth returning to.
              </p>
              <p className="mt-4 text-ink-soft text-[15px] sm:text-base leading-relaxed">
                Every frame is treated as a timeless heirloom—captured with intention, edited with restraint, and printed to outlive generations.
              </p>
            </Reveal>

            {/* Signature & Play Button Row */}
            <Reveal delay={0.24} className="mt-10 pt-8 border-t border-line/70 flex flex-wrap items-center justify-between gap-6">
              {/* Left: Signature style text */}
              <div>
                <p className="font-display italic text-2xl sm:text-3xl text-gold-dark font-normal select-none -rotate-1 mb-1">
                  Subash
                </p>
                <p className="text-xs font-bold tracking-[0.22em] text-ink uppercase">
                  SUBASH
                </p>
                <p className="text-[10px] tracking-[0.2em] text-ink-soft uppercase font-medium mt-0.5">
                  FOUNDER & LEAD PHOTOGRAPHER
                </p>
              </div>

              {/* Right: Circular play button & WATCH OUR STORY */}
              <Link
                to="/films"
                className="group flex items-center gap-3.5 select-none"
              >
                <div className="w-12 h-12 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold-dark group-hover:bg-gold group-hover:text-ink group-hover:scale-105 transition-all duration-300 shadow-sm">
                  <Play size={15} className="fill-current ml-0.5" />
                </div>
                <span className="text-xs font-semibold tracking-[0.16em] uppercase text-ink group-hover:text-gold-dark transition-colors">
                  Watch Our Story
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SECTION 6 — TESTIMONIALS */}
      <TestimonialsCarousel />

      {/* SECTION 7 — SELECTED WORK */}
      <section className="relative w-full bg-[#FBF8F2] border-t border-line/50 overflow-hidden">
        {/* Subtle decorative botanical element near outer top-right corner */}
        <div className="absolute -top-6 -right-6 pointer-events-none select-none hidden lg:block opacity-25">
          <BotanicalCorner className="w-44 h-44" rotate={80} />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 sm:py-24 relative z-10">
          {/* SECTION HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 sm:mb-14">
            <div>
              <Reveal>
                <p className="eyebrow mb-3">SELECTED WORK</p>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="font-display font-medium text-3xl sm:text-4xl lg:text-[42px] text-ink leading-tight">
                  Stories captured, moments preserved.
                </h2>
              </Reveal>
            </div>

            <Reveal delay={0.15}>
              <Link
                to="/portfolio"
                className="group inline-flex items-center gap-2.5 text-xs sm:text-[13px] font-semibold tracking-[0.12em] uppercase text-ink hover:text-gold-dark whitespace-nowrap transition-colors"
              >
                <span>Explore Full Portfolio</span>
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </Link>
            </Reveal>
          </div>

          {/* 6 CLEAN IMAGE CARDS IN A SINGLE ROW ON DESKTOP */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {displayPortfolio.slice(0, 6).map((item, idx) => (
              <Reveal key={item.id || item.title || idx} delay={idx * 0.06}>
                <Link
                  to="/portfolio"
                  className="group block"
                >
                  {/* Clean image card without wooden frame */}
                  <div className="relative aspect-[4/5] rounded-md overflow-hidden shadow-card bg-bg-soft">
                    <img
                      src={item.image}
                      alt={`${item.title} by SUBASH STUDIO`}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-ink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>

                  {/* Title below and small category uppercase */}
                  <div className="mt-3">
                    <h3 className="font-display text-[15px] sm:text-base font-medium text-ink group-hover:text-gold-dark transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-ink-soft uppercase tracking-[0.16em] font-semibold mt-0.5">
                      {item.category || "Featured"}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 — CTA BANNER */}
      <section className="relative py-24 sm:py-28 overflow-hidden">
        <img
          src="/images/girl pic for studio.webp"
          alt="SUBASH STUDIO cinematic photography"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-ink/80 backdrop-blur-[1px]" />
        
        <div className="relative max-w-3xl mx-auto px-6 text-center z-10">
          <Reveal>
            <p className="eyebrow text-gold-light tracking-[0.32em] text-xs uppercase mb-4">
              YOUR STORY MATTERS
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="font-display font-medium text-3xl sm:text-4xl lg:text-5xl text-bg-soft leading-[1.15] text-balance">
              Your story deserves <br className="hidden sm:inline" />
              more than a snapshot.
            </h2>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-4 text-bg-soft/70 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
              Let&apos;s create timeless memories together.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <Link
              to="/contact"
              className="inline-block mt-9 px-8 sm:px-10 py-3.5 sm:py-4 bg-gold text-ink text-[13px] font-semibold tracking-[0.14em] uppercase rounded-full hover:bg-gold-light transition-all duration-300 shadow-card"
            >
              Book a Shoot
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
