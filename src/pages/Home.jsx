import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import * as ReactCountUp from "react-countup";
const CountUp = ReactCountUp.default?.default || ReactCountUp.default;
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import FloralCorners from "../components/FloralCorners";
import WhyChooseUs from "../components/WhyChooseUs";
import { img } from "../data/images";
import { services as defaultServices } from "../data/services";
import { portfolioProjects as defaultPortfolio } from "../data/portfolio";
import { useAdminData } from "../admin/context/AdminDataContext";

const defaultStats = [
  { end: 12, suffix: "+", label: "Years Behind the Lens" },
  { end: 1400, suffix: "+", label: "Weddings Documented" },
  { end: 2, suffix: "", label: "Studio Branches" },
  { end: 98, suffix: "%", label: "Clients Who Refer Us" },
];

export default function Home() {
  const { websiteContent, services: adminServices, portfolio: adminPortfolio } = useAdminData();

  const homeData = websiteContent?.home || {};
  const heroEyebrow = homeData.heroHeading || "Fine Photography & Cinematic Films";
  const heroSub = homeData.heroTagline || "Preserving timeless heritage, profound emotions, and authentic human celebrations across generations.";
  
  const displayServices = (adminServices && adminServices.length > 0
    ? adminServices.filter((s) => s.status !== "Inactive")
    : defaultServices
  ).map((s) => ({
    ...s,
    name: s.name || s.title || "Service",
    image: s.image || s.imageUrl || "/images/wedding photos.jpg",
  }));

  const displayPortfolio = (adminPortfolio && adminPortfolio.length > 0
    ? adminPortfolio.filter((p) => p.published !== false)
    : defaultPortfolio
  ).map((p) => ({
    ...p,
    title: p.title || p.client || "Portfolio",
    image: p.coverImage || p.image || p.imageUrl || "/images/wedding photos.jpg",
  }));
  return (
    <>
      <Seo title="Home" description="SUBASH STUDIO — a premium photography and cinematography house crafting timeless wedding, portrait and editorial imagery across three branches." />

      {/* HERO */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-bg-soft via-bg to-bg-soft pt-[84px]">
        <FloralCorners />

        <div className="relative max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_1fr] items-center">
          {/* Left — copy */}
          <div className="relative z-10 flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-16 lg:py-12">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="eyebrow mb-6"
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
                className="block text-6xl sm:text-7xl lg:text-[5.5rem] text-gold-dark"
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
              className="max-w-sm text-ink-soft text-[15px] leading-relaxed"
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
                to="/gallery"
                className="group inline-flex items-center gap-2 px-7 py-3.5 border border-gold/70 text-ink text-[13px] font-semibold tracking-[0.1em] uppercase rounded-full hover:bg-ink hover:border-ink hover:text-bg-soft transition-colors duration-300"
              >
                Explore Photography
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="hidden sm:flex flex-col items-center gap-3 mt-16"
              style={{ alignSelf: "flex-start" }}
            >
              <span className="text-ink-soft/70 text-[10px] tracking-[0.32em] uppercase">Scroll Down</span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="w-9 h-9 rounded-full border border-gold/70 flex items-center justify-center text-gold-dark"
              >
                <ArrowDown size={14} />
              </motion.div>
            </motion.div>
          </div>

          {/* Right — image */}
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
            className="relative w-full aspect-square overflow-hidden"
            style={{ aspectRatio: "1 / 1" }}
          >
            <img
              src="/images/storefront.jpg"
              alt="SUBASH STUDIO storefront"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-bg-soft/30 lg:to-bg-soft/0 pointer-events-none" />
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg-soft to-transparent hidden lg:block pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-bg-soft border-y border-line">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
          {defaultStats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center">
              <p className="font-display text-4xl md:text-5xl text-gold-dark">
                <CountUp end={s.end} duration={2.2} enableScrollSpy scrollSpyOnce />
                {s.suffix}
              </p>
              <p className="mt-2 text-xs tracking-[0.12em] uppercase text-ink-soft">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <WhyChooseUs />

      {/* INTRO / ABOUT TEASER */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-28 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <Reveal className="relative">
          <div className="relative rounded-md overflow-hidden shadow-soft aspect-[4/5]">
            <img src="/images/shyam chandru.jpeg" alt="SUBASH STUDIO photographer at work" className="w-full h-full object-cover" />
          </div>
          <div className="hidden md:flex absolute -bottom-8 right-2 lg:-right-8 w-40 h-40 rounded-md overflow-hidden shadow-soft border-4 border-bg-soft">
            <img src="/images/shyam chandru.jpeg" alt="Detail from a SUBASH STUDIO wedding shoot" className="w-full h-full object-cover" />
          </div>
        </Reveal>

        <div>
          <SectionHeading
            eyebrow="Our Craft"
            title="Photography that feels less like a service, more like a keepsake."
            desc="For over a decade, SUBASH STUDIO has documented weddings, families and milestones across Tamil Nadu with an editorial eye and an unhurried hand. What began as a single studio in Mylapore has grown into three branches, one shared philosophy: light, honesty, and a story worth returning to."
          />
          <Reveal delay={0.24}>
            <Link to="/about" className="inline-flex items-center gap-3 mt-8 text-sm font-semibold tracking-[0.08em] uppercase text-ink group">
              Our Story
              <span className="w-8 h-[1px] bg-gold group-hover:w-12 transition-all duration-300" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

  {/* Wedding Photography */}
  <Reveal delay={0}>
    <Link
      to="/services"
      className="group block relative rounded-md overflow-hidden aspect-[3/4] shadow-card"
    >
      <img
        src="/images/wedding photos.jpg"
        alt="Wedding Photography"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-bg-soft font-display text-lg">
          Wedding Photography
        </p>
      </div>
    </Link>
  </Reveal>


  {/* Wedding Cinematography */}
  <Reveal delay={0.08}>
    <Link
      to="/services"
      className="group block relative rounded-md overflow-hidden aspect-[3/4] shadow-card"
    >
      <img
        src="/images/wedding cinematography.jpg"
        alt="Wedding Cinematography"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-bg-soft font-display text-lg">
          Wedding Cinematography
        </p>
      </div>
    </Link>
  </Reveal>


  {/* Traditional Photography */}
  <Reveal delay={0.16}>
    <Link
      to="/services"
      className="group block relative rounded-md overflow-hidden aspect-[3/4] shadow-card"
    >
      <img
        src="/images/traditional photos.jpg"
        alt="Traditional Photography"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-bg-soft font-display text-lg">
          Traditional Photography
        </p>
      </div>
    </Link>
  </Reveal>


  {/* Traditional Cinematography */}
  <Reveal delay={0.24}>
    <Link
      to="/services"
      className="group block relative rounded-md overflow-hidden aspect-[3/4] shadow-card"
    >
      <img
        src="/images/traditional cinematography.jpg"
        alt="Traditional Cinematography"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-bg-soft font-display text-lg">
          Traditional Cinematography
        </p>
      </div>
    </Link>
  </Reveal>

</div>
      {/* PORTFOLIO PREVIEW */}
      {/* PORTFOLIO PREVIEW */}
<section className="max-w-7xl mx-auto px-6 lg:px-10 py-28">

  {/* SECTION HEADER */}
  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">

    <SectionHeading
      eyebrow="Selected Work"
      title="Stories captured, moments preserved."
      desc="A glimpse into the celebrations, emotions, and unforgettable moments captured by SUBASH STUDIO."
    />

    <Reveal delay={0.15}>
      <Link
        to="/portfolio"
        className="group inline-flex items-center gap-3 text-sm font-semibold tracking-[0.08em] uppercase text-ink whitespace-nowrap"
      >
        Full Portfolio

        <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">
          →
        </span>
      </Link>
    </Reveal>

  </div>


  {/* PORTFOLIO GRID */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

    {/* WEDDING */}
    <Reveal delay={0}>
      <Link
        to="/portfolio"
        className="group relative block overflow-hidden rounded-md shadow-card aspect-[4/5]"
      >

        <img
          src="/images/wedding photos.jpg"
          alt="Wedding Photography by SUBASH STUDIO"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">

          <p className="text-white/70 text-xs uppercase tracking-[0.18em] mb-2">
            Wedding
          </p>

          <h3 className="text-white font-display text-2xl">
            Timeless Celebrations
          </h3>

        </div>

      </Link>
    </Reveal>


    {/* COUPLE */}
    <Reveal delay={0.08}>
      <Link
        to="/portfolio"
        className="group relative block overflow-hidden rounded-md shadow-card aspect-[4/5]"
      >

        <img
          src="/images/couple.jpg"
          alt="Couple Photography by SUBASH STUDIO"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">

          <p className="text-white/70 text-xs uppercase tracking-[0.18em] mb-2">
            Couple
          </p>

          <h3 className="text-white font-display text-2xl">
            Stories of Two
          </h3>

        </div>

      </Link>
    </Reveal>


    {/* RECEPTION */}
    <Reveal delay={0.16}>
      <Link
        to="/portfolio"
        className="group relative block overflow-hidden rounded-md shadow-card aspect-[4/5]"
      >

        <img
          src="/images/From this day,always and forever❤️🥹 Groom- @sankarsubramanian Bride- @esakiammal_kandasamy ..Ma.jpg"
          alt="Reception Photography by SUBASH STUDIO"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">

          <p className="text-white/70 text-xs uppercase tracking-[0.18em] mb-2">
            Reception
          </p>

          <h3 className="text-white font-display text-2xl">
            Moments in Motion
          </h3>

        </div>

      </Link>
    </Reveal>


    {/* BABY */}
    <Reveal delay={0.08}>
      <Link
        to="/portfolio"
        className="group relative block overflow-hidden rounded-md shadow-card aspect-[4/5]"
      >

        <img
          src="/images/Divinity is found in every moment🦚✨..DM FOR BOOKING♥️📸9345706609@subash_studio @shyam_chandru2.jpg"
          alt="Baby Photography by SUBASH STUDIO"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">

          <p className="text-white/70 text-xs uppercase tracking-[0.18em] mb-2">
            Baby Photography
          </p>

          <h3 className="text-white font-display text-2xl">
            Little Memories
          </h3>

        </div>

      </Link>
    </Reveal>


    {/* MATERNITY */}
    <Reveal delay={0.16}>
      <Link
        to="/portfolio"
        className="group relative block overflow-hidden rounded-md shadow-card aspect-[4/5]"
      >

        <img
          src="/images/maternity.jpg"
          alt="Maternity Photography by SUBASH STUDIO"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">

          <p className="text-white/70 text-xs uppercase tracking-[0.18em] mb-2">
            Maternity
          </p>

          <h3 className="text-white font-display text-2xl">
            Before We Meet
          </h3>

        </div>

      </Link>
    </Reveal>


    {/* OUTDOOR */}
    <Reveal delay={0.24}>
      <Link
        to="/portfolio"
        className="group relative block overflow-hidden rounded-md shadow-card aspect-[4/5]"
      >

        <img
          src="/images/outdoor.jpg"
          alt="Outdoor Photography by SUBASH STUDIO"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">

          <p className="text-white/70 text-xs uppercase tracking-[0.18em] mb-2">
            Outdoor
          </p>

          <h3 className="text-white font-display text-2xl">
            Frames in Nature
          </h3>

        </div>

      </Link>
    </Reveal>

  </div>


  {/* VIEW PORTFOLIO BUTTON */}
  <Reveal delay={0.3} className="mt-14 text-center">

    <Link
      to="/portfolio"
      className="inline-flex items-center gap-3 px-8 py-3.5 border border-ink/20 text-ink text-[13px] font-semibold tracking-[0.12em] uppercase rounded-full hover:border-gold hover:text-gold-dark transition-all duration-300"
    >
      Explore Full Portfolio

      <span className="transition-transform duration-300 hover:translate-x-1">
        →
      </span>
    </Link>

  </Reveal>

</section>

      {/* CTA BAND */}
      <section className="relative py-28 overflow-hidden">
        <img src="/images/girl pic for studio.webp" alt="A candid photography moment by SUBASH STUDIO" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-ink/75" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <SectionHeading
            eyebrow="Let's Begin"
            title="Your story deserves more than a snapshot."
            desc="Tell us the date, the place, the people — we'll take it from there."
            align="center"
            light
          />
          <Reveal delay={0.24}>
            <Link to="/contact" className="inline-block mt-10 px-9 py-4 bg-gold text-ink text-[13px] font-semibold tracking-[0.12em] uppercase rounded-full hover:bg-bg-soft transition-colors">
              Book a Shoot
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
