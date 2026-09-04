import { Camera, Heart, Gem, Users } from "lucide-react";
import Reveal from "./Reveal";

const benefits = [
  {
    icon: Camera,
    title: "Years of Experience",
    description:
      "With 12+ years in the industry, we bring expertise, creativity, and a deep understanding of what makes every moment special.",
  },
  {
    icon: Heart,
    title: "Storytelling Approach",
    description:
      "We don’t just take photos — we capture emotions, relationships, and the little moments that make your story unique.",
  },
  {
    icon: Gem,
    title: "Premium Quality",
    description:
      "From photography and cinematography to editing and album creation, every detail receives the same level of care.",
  },
  {
    icon: Users,
    title: "Personalized Experience",
    description:
      "Every client is unique. We tailor our approach to match your vision, ensuring a photography experience that feels personal and meaningful.",
  },
];

function BlossomOrnament({ className, flip = false }) {
  return (
    <svg
      className={className}
      width="220"
      height="220"
      viewBox="0 0 260 260"
      fill="none"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden="true"
    >
      <g opacity="0.4" stroke="#C9A669" strokeWidth="1.2">
        <path d="M10 40 C 60 10, 110 30, 150 90" />
        <path d="M20 90 C 70 70, 120 90, 160 140" />
        <path d="M0 130 C 50 120, 90 140, 120 190" />
      </g>
      <g opacity="0.75">
        {[
          [40, 46],
          [78, 30],
          [118, 66],
          [58, 96],
          [96, 118],
          [22, 120],
          [140, 108],
          [70, 150],
        ].map(([cx, cy], i) => (
          <g key={i} transform={`translate(${cx} ${cy})`}>
            {[0, 72, 144, 216, 288].map((deg) => (
              <ellipse
                key={deg}
                cx="0"
                cy="-6"
                rx="4.2"
                ry="6.5"
                fill="#FFFDF8"
                stroke="#E4D3A6"
                strokeWidth="0.8"
                transform={`rotate(${deg})`}
              />
            ))}
            <circle r="2.4" fill="#C9A669" />
          </g>
        ))}
      </g>
    </svg>
  );
}

export default function WhyChooseUs() {
  return (
    <section className="relative w-full bg-bg py-24 sm:py-28 lg:py-32 overflow-hidden border-b border-line/60">
      {/* Ambient subtle floral decorations */}
      <BlossomOrnament className="absolute -top-10 -left-12 pointer-events-none select-none opacity-40 blur-[0.4px] hidden xl:block" />
      <BlossomOrnament
        className="absolute -bottom-10 -right-12 pointer-events-none select-none opacity-40 blur-[0.4px] hidden xl:block"
        flip
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        {/* Header */}
        <header className="max-w-3xl mx-auto text-center">
          <Reveal>
            <div className="inline-flex items-center gap-3 justify-center">
              <span className="h-px w-8 sm:w-12 bg-gold/60" />
              <svg
                width="10"
                height="10"
                viewBox="0 0 14 14"
                className="text-gold shrink-0"
                aria-hidden="true"
              >
                <path d="M7 0 L9 7 L7 14 L5 7 Z" fill="currentColor" />
              </svg>
              <span className="eyebrow text-[12px] sm:text-[13px] tracking-[0.32em] font-semibold text-gold-dark">
                Why Choose Us
              </span>
              <svg
                width="10"
                height="10"
                viewBox="0 0 14 14"
                className="text-gold shrink-0"
                aria-hidden="true"
              >
                <path d="M7 0 L9 7 L7 14 L5 7 Z" fill="currentColor" />
              </svg>
              <span className="h-px w-8 sm:w-12 bg-gold/60" />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="font-display font-medium text-[34px] sm:text-[46px] lg:text-[62px] leading-[1.08] tracking-tight text-ink mt-5">
              More Than <span className="text-gold-dark font-normal italic">Photographs</span>
            </h2>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-5 text-base sm:text-lg lg:text-xl text-ink-soft max-w-2xl mx-auto font-display italic font-light leading-relaxed">
              We preserve emotions, stories, and the moments you’ll treasure forever.
            </p>
          </Reveal>
        </header>

        {/* 4 Benefit columns */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-10 lg:gap-0 lg:divide-x lg:divide-gold/25">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <Reveal
                key={b.title}
                delay={0.2 + i * 0.1}
                className="px-4 sm:px-6 lg:px-8 text-center group flex flex-col items-center"
              >
                {/* Elegant circular icon area */}
                <div className="w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-full border border-gold/40 bg-bg-soft flex items-center justify-center text-gold-dark mx-auto shadow-sm group-hover:border-gold group-hover:scale-105 group-hover:bg-gold/10 group-hover:text-gold transition-all duration-300">
                  <Icon size={26} strokeWidth={1.3} aria-hidden="true" />
                </div>

                {/* Benefit title */}
                <h3 className="font-display text-xl sm:text-2xl text-ink font-medium mt-6 tracking-tight">
                  {b.title}
                </h3>

                {/* Short gold decorative divider */}
                <div className="w-8 h-[1px] bg-gold/50 mx-auto my-4 transition-all duration-300 group-hover:w-12 group-hover:bg-gold" />

                {/* Short description */}
                <p className="text-sm sm:text-[15px] text-ink-soft leading-relaxed max-w-xs mx-auto">
                  {b.description}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
